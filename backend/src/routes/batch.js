import express from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { generatePIDs } from '../services/pidGenerator.js';
import { buildMerkleTree } from '../services/merkle.js';
import { createPDFManifest } from '../services/pdfManifest.js';

const router = express.Router();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.manufacturerId = user.manufacturerId;
    next();
  });
};

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { sku, product_name, quantity } = req.body;
    
    if (!sku || !product_name || !quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid batch data' });
    }

    const result = await query(
      'INSERT INTO batches (manufacturer_id, sku, product_name, quantity, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.manufacturerId, sku, product_name, quantity, 'draft']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create batch' });
  }
});

router.post('/:id/generate', authenticateToken, async (req, res) => {
  try {
    const batchId = req.params.id;
    
    // Get batch
    const batchResult = await query(
      'SELECT * FROM batches WHERE id = $1 AND manufacturer_id = $2',
      [batchId, req.manufacturerId]
    );

    if (batchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    const batch = batchResult.rows[0];
    
    if (batch.status !== 'draft') {
      return res.status(400).json({ error: 'Batch already generated' });
    }

    // Generate PIDs
    const pids = generatePIDs(batch.quantity);
    
    // Insert products
    const productInserts = pids.map(pid => 
      query('INSERT INTO products (batch_id, pid, status) VALUES ($1, $2, $3)', 
            [batchId, pid, 'created'])
    );
    await Promise.all(productInserts);

    // Build merkle tree
    const merkleRoot = buildMerkleTree(pids);

    // Create PDF manifest
    const manifestPath = await createPDFManifest(batch, pids);

    // Update batch
    await query(
      'UPDATE batches SET merkle_root = $1, manifest_url = $2, status = $3 WHERE id = $4',
      [merkleRoot, manifestPath, 'generated', batchId]
    );

    // Queue anchor worker (simplified - in production use a proper queue)
    process.nextTick(() => {
      import('../workers/anchorWorker.js').then(worker => {
        worker.anchorBatch(batchId);
      });
    });

    res.json({ 
      batchId, 
      merkleRoot, 
      manifestPath,
      pidsGenerated: pids.length 
    });
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ error: 'Failed to generate batch' });
  }
});

router.post('/markApplied', authenticateToken, async (req, res) => {
  try {
    const { pid, operatorId, lat, lon } = req.body;
    
    await query(
      'UPDATE products SET status = $1, applied_at = NOW() WHERE pid = $2',
      ['applied', pid]
    );

    await query(
      'INSERT INTO scan_events (pid, event_type, operator_id, latitude, longitude) VALUES ($1, $2, $3, $4, $5)',
      [pid, 'applied', operatorId, lat, lon]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark applied' });
  }
});

export default router;