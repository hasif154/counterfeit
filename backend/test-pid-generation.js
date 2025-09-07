import crypto from 'crypto';
import QRCode from 'qrcode';

// Generate unique PID
function generatePID() {
  return crypto.randomBytes(16).toString('hex').toUpperCase();
}

async function testPIDGeneration() {
  console.log('Testing PID and QR Code Generation...\n');
  
  const quantity = 3;
  const products = [];
  
  for (let i = 0; i < quantity; i++) {
    const pid = generatePID();
    
    // Generate QR code as Base64
    const qrCodeData = await QRCode.toDataURL(pid, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    products.push({
      unit: i + 1,
      pid: pid,
      qr_code_length: qrCodeData.length,
      qr_preview: qrCodeData.substring(0, 50) + '...'
    });
    
    console.log(`Unit ${i + 1}:`);
    console.log(`  PID: ${pid}`);
    console.log(`  QR Code: ${qrCodeData.substring(0, 50)}...`);
    console.log('');
  }
  
  console.log(`✅ Successfully generated ${quantity} unique PIDs and QR codes!`);
}

testPIDGeneration().catch(console.error);