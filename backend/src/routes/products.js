import express from 'express';
import crypto from 'crypto';
import QRCode from 'qrcode';
import { query } from '../db.js';

const router = express.Router();

// Generate unique PID
function generatePID() {
  return crypto.randomBytes(16).toString('hex').toUpperCase();
}

// Create product with automatic PID and QR generation
router.post('/', async (req, res) => {
  try {
    console.log('Received request:', req.body);
    const { product_name, manufacturing_date, model_number, quantity = 1 } = req.body;
    
    if (!product_name || !manufacturing_date || !model_number) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const products = [];
    
    // Generate products for each unit
    for (let i = 0; i < quantity; i++) {
      const pid = generatePID();
      console.log(`Generated PID ${i + 1}:`, pid);
      
      // Generate QR code as Base64
      const qrCodeData = await QRCode.toDataURL(pid, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      console.log(`Generated QR code ${i + 1}`);
      
      // Save to database
      console.log('Attempting database insert...');
      const result = await query(
        'INSERT INTO products (product_id, product_name, manufacturing_date, model_number) VALUES ($1, $2, $3, $4) RETURNING *',
        [pid, product_name, manufacturing_date, model_number]
      );
      console.log('Database insert successful');
      
      products.push({
        ...result.rows[0],
        pid: pid,
        qr_code: qrCodeData
      });
    }
    
    res.json({
      success: true,
      total_units: quantity,
      products: products
    });
  } catch (error) {
    console.error('Products API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get product by PID
router.get('/:product_id', async (req, res) => {
  try {
    const { product_id } = req.params;
    
    const result = await query(
      'SELECT * FROM products WHERE product_id = $1',
      [product_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Generate QR code for response
    const qrCodeData = await QRCode.toDataURL(product_id, {
      width: 256,
      margin: 2
    });
    
    res.json({
      ...result.rows[0],
      qr_code: qrCodeData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;