import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Calendar, Hash, QrCode, ArrowLeft, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Generate unique PID
function generatePID() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('').toUpperCase();
}

// Generate QR code as data URL
function generateQRCode(text: string): string {
  // Simple QR code placeholder - in production use a proper QR library
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = 200;
  canvas.height = 200;
  
  // Fill background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 200, 200);
  
  // Draw simple pattern
  ctx.fillStyle = '#000000';
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('QR CODE', 100, 50);
  ctx.fillText(text.substring(0, 8), 100, 100);
  ctx.fillText(text.substring(8, 16), 100, 120);
  ctx.fillText(text.substring(16, 24), 100, 140);
  ctx.fillText(text.substring(24, 32), 100, 160);
  
  return canvas.toDataURL();
}

interface ProductRegistrationProps {
  onBack: () => void;
}

export function ProductRegistration({ onBack }: ProductRegistrationProps) {
  const [formData, setFormData] = useState({
    productName: '',
    manufacturingDate: '',
    modelNumber: '',
    quantity: 1
  });
  const [qrGenerated, setQrGenerated] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateQR = async () => {
    if (formData.productName && formData.manufacturingDate && formData.modelNumber) {
      setIsLoading(true);
      setError('');
      
      try {
        const generatedProducts = [];
        const quantity = parseInt(formData.quantity);
        
        // Generate products for each unit
        for (let i = 0; i < quantity; i++) {
          const pid = generatePID();
          const qrCode = generateQRCode(pid);
          
          // Save to Supabase
          const { data, error: dbError } = await supabase
            .from('products')
            .insert([
              {
                product_id: pid,
                product_name: formData.productName,
                manufacturing_date: formData.manufacturingDate,
                model_number: formData.modelNumber
              }
            ])
            .select()
            .single();

          if (dbError) {
            throw dbError;
          }

          generatedProducts.push({
            ...data,
            pid: pid,
            qr_code: qrCode
          });
        }
        
        setProducts(generatedProducts);
        setQrGenerated(true);
      } catch (err: any) {
        setError(err.message || 'Failed to generate products');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Product Registration</h1>
                <p className="text-gray-400">Register your product for blockchain verification</p>
              </div>
            </div>
          </div>

          {!qrGenerated ? (
            /* Registration Form */
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    <Package size={16} className="inline mr-2" />
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    <Calendar size={16} className="inline mr-2" />
                    Manufacturing Date
                  </label>
                  <input
                    type="date"
                    name="manufacturingDate"
                    value={formData.manufacturingDate}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    <Hash size={16} className="inline mr-2" />
                    Product Model Number
                  </label>
                  <input
                    type="text"
                    name="modelNumber"
                    value={formData.modelNumber}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter model number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    <Package size={16} className="inline mr-2" />
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    max="100"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Number of units"
                  />
                </div>

                {error && (
                  <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3 text-blue-400 text-sm">
                  <p><strong>Note:</strong> Each unit will get a unique PID and QR code for blockchain verification.</p>
                </div>

                <button
                  onClick={generateQR}
                  disabled={!formData.productName || !formData.manufacturingDate || !formData.modelNumber || isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium py-3 rounded-lg hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <Loader size={20} className="animate-spin mr-2" />
                      Generating PIDs & QR Codes...
                    </>
                  ) : (
                    'Generate Products'
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Products Display */
            <div className="p-6">
              <div className="mb-6 text-center">
                <p className="text-green-400 font-medium mb-4">
                  {products.length} Product{products.length > 1 ? 's' : ''} Generated Successfully!
                </p>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-4">
                {products.map((product, index) => (
                  <div key={product.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <img 
                          src={product.qr_code} 
                          alt={`QR Code ${index + 1}`}
                          className="w-24 h-24 rounded border-2 border-gray-600"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white mb-2">Unit #{index + 1}</h4>
                        <div className="text-sm text-gray-300 space-y-1">
                          <p><strong>PID:</strong> <span className="font-mono text-xs">{product.pid}</span></p>
                          <p><strong>Name:</strong> {product.product_name}</p>
                          <p><strong>Model:</strong> {product.model_number}</p>
                          <p><strong>Date:</strong> {product.manufacturing_date}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setQrGenerated(false)}
                  className="flex-1 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Register More
                </button>
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Download All QR Codes
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}