import express from 'express';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import { redis } from '../redisClient.js';
import { query } from '../db.js';

const router = express.Router();

// Rate limit for OTT generation
const ottLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute per IP
  keyGenerator: (req) => `${req.ip}-${req.query.pid}`,
  message: { error: 'Too many OTT requests for this PID' }
});

router.get('/ott', ottLimiter, async (req, res) => {
  try {
    const { pid } = req.query;
    
    if (!pid) {
      return res.status(400).json({ error: 'PID required' });
    }

    // Check if product exists
    const productResult = await query(
      'SELECT p.*, b.product_name FROM products p JOIN batches b ON p.batch_id = b.id WHERE p.pid = $1',
      [pid]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Generate OTT
    const ott = uuidv4();
    const ottKey = `ott:${pid}:${ott}`;
    
    // Store in Redis with 30s TTL
    await redis.setex(ottKey, 30, JSON.stringify({
      pid,
      generatedAt: Date.now(),
      ip: req.ip
    }));

    res.json({ ott });
  } catch (error) {
    console.error('OTT generation error:', error);
    res.status(500).json({ error: 'Failed to generate OTT' });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { pid, ott, deviceFingerprint, lat, lon } = req.body;
    
    if (!pid || !ott) {
      return res.status(400).json({ error: 'PID and OTT required' });
    }

    const ottKey = `ott:${pid}:${ott}`;
    
    // Check and consume OTT (single use)
    const ottData = await redis.get(ottKey);
    if (!ottData) {
      return res.status(400).json({ 
        result: 'suspect',
        reason: 'Invalid or expired verification token'
      });
    }

    // Delete OTT (single use)
    await redis.del(ottKey);

    // Get product and batch info
    const productResult = await query(`
      SELECT p.*, b.product_name, b.sku, b.manufacturer_id, m.company_name
      FROM products p 
      JOIN batches b ON p.batch_id = b.id 
      JOIN manufacturers m ON b.manufacturer_id = m.id
      WHERE p.pid = $1
    `, [pid]);

    if (productResult.rows.length === 0) {
      return res.status(404).json({ 
        result: 'suspect',
        reason: 'Product not found'
      });
    }

    const product = productResult.rows[0];

    // Check if product is revoked
    if (product.status === 'revoked') {
      await logScanEvent(pid, 'verify_revoked', deviceFingerprint, lat, lon);
      return res.json({
        result: 'revoked',
        product: {
          pid: product.pid,
          product_name: product.product_name,
          sku: product.sku,
          manufacturer: product.company_name
        }
      });
    }

    // Log scan event
    await logScanEvent(pid, 'verify_success', deviceFingerprint, lat, lon);

    // Simple fraud detection
    const suspiciousActivity = await checkSuspiciousActivity(pid, lat, lon);
    
    // Get scan history
    const historyResult = await query(
      'SELECT event_type, created_at, latitude, longitude FROM scan_events WHERE pid = $1 ORDER BY created_at DESC LIMIT 10',
      [pid]
    );

    res.json({
      result: suspiciousActivity ? 'suspect' : 'authentic',
      product: {
        pid: product.pid,
        product_name: product.product_name,
        sku: product.sku,
        manufacturer: product.company_name,
        status: product.status
      },
      history: historyResult.rows,
      ...(suspiciousActivity && { reason: 'Suspicious scanning pattern detected' })
    });

  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

async function logScanEvent(pid, eventType, deviceFingerprint, lat, lon) {
  await query(
    'INSERT INTO scan_events (pid, event_type, device_fingerprint, latitude, longitude) VALUES ($1, $2, $3, $4, $5)',
    [pid, eventType, deviceFingerprint, lat, lon]
  );
}

async function checkSuspiciousActivity(pid, lat, lon) {
  // Check for burst scans (more than 5 scans in last 5 minutes)
  const burstResult = await query(
    'SELECT COUNT(*) as count FROM scan_events WHERE pid = $1 AND created_at > NOW() - INTERVAL \'5 minutes\'',
    [pid]
  );

  if (parseInt(burstResult.rows[0].count) > 5) {
    return true;
  }

  // Check for impossible travel (if coordinates provided)
  if (lat && lon) {
    const lastLocationResult = await query(
      'SELECT latitude, longitude, created_at FROM scan_events WHERE pid = $1 AND latitude IS NOT NULL AND longitude IS NOT NULL ORDER BY created_at DESC LIMIT 1',
      [pid]
    );

    if (lastLocationResult.rows.length > 0) {
      const lastScan = lastLocationResult.rows[0];
      const timeDiff = (Date.now() - new Date(lastScan.created_at).getTime()) / 1000 / 60; // minutes
      
      // Simple distance calculation (not accurate but good enough for demo)
      const distance = Math.sqrt(
        Math.pow(lat - lastScan.latitude, 2) + Math.pow(lon - lastScan.longitude, 2)
      ) * 111; // rough km conversion
      
      // If moved more than 100km in less than 10 minutes, suspicious
      if (distance > 100 && timeDiff < 10) {
        return true;
      }
    }
  }

  return false;
}

export default router;