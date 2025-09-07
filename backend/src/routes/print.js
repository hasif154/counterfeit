import express from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';

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

router.post('/confirm', authenticateToken, async (req, res) => {
  try {
    const { batchId, printed_roll_id } = req.body;
    
    if (!batchId || !printed_roll_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify batch belongs to manufacturer
    const batchResult = await query(
      'SELECT * FROM batches WHERE id = $1 AND manufacturer_id = $2',
      [batchId, req.manufacturerId]
    );

    if (batchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    // Log print confirmation
    await query(
      'INSERT INTO print_manifests (batch_id, printed_roll_id, printed_at) VALUES ($1, $2, NOW())',
      [batchId, printed_roll_id]
    );

    // Update batch status
    await query(
      'UPDATE batches SET status = $1 WHERE id = $2',
      ['printed', batchId]
    );

    res.json({ 
      success: true, 
      message: 'Print confirmed',
      batchId,
      printed_roll_id 
    });
  } catch (error) {
    console.error('Print confirm error:', error);
    res.status(500).json({ error: 'Failed to confirm print' });
  }
});

export default router;