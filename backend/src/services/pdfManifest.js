import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

export async function createPDFManifest(batch, pids) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const filename = `manifest_${batch.id}_${Date.now()}.pdf`;
  const filepath = path.join('manifests', filename);
  
  // Ensure manifests directory exists
  if (!fs.existsSync('manifests')) {
    fs.mkdirSync('manifests', { recursive: true });
  }
  
  doc.pipe(fs.createWriteStream(filepath));

  // Header
  doc.fontSize(20).text('BlockAuthentic Product Manifest', { align: 'center' });
  doc.moveDown();
  
  doc.fontSize(12)
     .text(`Batch ID: ${batch.id}`)
     .text(`Product: ${batch.product_name}`)
     .text(`SKU: ${batch.sku}`)
     .text(`Quantity: ${batch.quantity}`)
     .text(`Generated: ${new Date().toISOString()}`)
     .moveDown();

  // QR codes grid (4 per row)
  let x = 50, y = 200;
  const qrSize = 120;
  const spacing = 140;
  
  for (let i = 0; i < pids.length; i++) {
    const pid = pids[i];
    
    try {
      // Generate QR code as data URL
      const qrDataURL = await QRCode.toDataURL(`https://verify.blockauthentic.com/${pid}`, {
        width: qrSize,
        margin: 1
      });
      
      // Convert data URL to buffer
      const qrBuffer = Buffer.from(qrDataURL.split(',')[1], 'base64');
      
      // Add QR code to PDF
      doc.image(qrBuffer, x, y, { width: qrSize });
      doc.fontSize(8).text(pid, x, y + qrSize + 5, { width: qrSize, align: 'center' });
      
      // Move to next position
      x += spacing;
      if ((i + 1) % 4 === 0) {
        x = 50;
        y += spacing + 20;
        
        // New page if needed
        if (y > 700) {
          doc.addPage();
          y = 50;
        }
      }
    } catch (error) {
      console.error(`Error generating QR for PID ${pid}:`, error);
    }
  }

  doc.end();
  
  return filepath;
}