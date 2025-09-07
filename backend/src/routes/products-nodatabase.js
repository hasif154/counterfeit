import express from 'express';
import crypto from 'crypto';
import QRCode from 'qrcode';

const router = express.Router();

// Generate unique PID
function generatePID() {
  return crypto.randomBytes(16).toString('hex').toUpperCase();
}

// Create product with automatic PID and QR generation (no database)
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
      
      products.push({
        id: i + 1,
        product_id: pid,
        product_name: product_name,
        manufacturing_date: manufacturing_date,
        model_number: model_number,
        created_at: new Date().toISOString(),
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

export default router;