import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scan, ArrowLeft, CheckCircle, XCircle, Package, Calendar, Hash, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface QRScannerProps {
  onBack: () => void;
}

interface ProductData {
  id: string;
  name: string;
  manufacturingDate: string;
  modelNumber: string;
  timestamp: string;
}

export function QRScanner({ onBack }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<ProductData | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const startScanning = () => {
    setIsScanning(true);
    setError('');
    
    // Simulate scanning process
    setTimeout(async () => {
      try {
        // In a real app, this would come from QR code scanning
        // For demo, we'll use a mock product ID that should exist in database
        const mockProductId = "1234567890-abc123def";
        
        // Fetch product data from Supabase
        const { data, error: dbError } = await supabase
          .from('products')
          .select('*')
          .eq('product_id', mockProductId)
          .single();

        if (dbError || !data) {
          // If product not found, try to get any product for demo
          const { data: anyProduct, error: anyError } = await supabase
            .from('products')
            .select('*')
            .limit(1)
            .single();
            
          if (anyError || !anyProduct) {
            setIsVerified(false);
            setError('Product not found in database');
          } else {
            const productData: ProductData = {
              id: anyProduct.product_id,
              name: anyProduct.product_name,
              manufacturingDate: anyProduct.manufacturing_date,
              modelNumber: anyProduct.model_number,
              timestamp: anyProduct.created_at
            };
            setScannedData(productData);
            setIsVerified(true);
          }
        } else {
          const productData: ProductData = {
            id: data.product_id,
            name: data.product_name,
            manufacturingDate: data.manufacturing_date,
            modelNumber: data.model_number,
            timestamp: data.created_at
          };
          setScannedData(productData);
          setIsVerified(true);
        }
      } catch (err: any) {
        setIsVerified(false);
        setError(err.message || 'Failed to verify product');
      } finally {
        setIsScanning(false);
      }
    }, 3000);
  };

  const resetScanner = () => {
    setScannedData(null);
    setIsVerified(null);
    setIsScanning(false);
    setError('');
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
                <h1 className="text-2xl font-bold">Product Verification</h1>
                <p className="text-gray-400">Scan QR code to verify product authenticity</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {!scannedData ? (
              /* Scanner Interface */
              <div className="text-center">
                <div className="w-64 h-64 mx-auto mb-6 bg-gray-700 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center relative overflow-hidden">
                  {isScanning ? (
                    <div className="relative">
                      <Scan size={80} className="text-blue-400 animate-pulse" />
                      <motion.div
                        className="absolute inset-0 border-2 border-blue-400"
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <Scan size={80} className="text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">Position QR code here</p>
                    </div>
                  )}
                </div>

                {isScanning ? (
                  <div>
                    <p className="text-blue-400 font-medium mb-2">Scanning...</p>
                    <p className="text-gray-400 text-sm">Please hold steady</p>
                  </div>
                ) : (
                  <button
                    onClick={startScanning}
                    className="bg-gradient-to-r from-green-600 to-emerald-500 text-white font-medium py-3 px-8 rounded-lg hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300"
                  >
                    Start Scanning
                  </button>
                )}
              </div>
            ) : (
              /* Verification Results */
              <div className="text-center">
                <div className="mb-6">
                  {isVerified ? (
                    <div className="w-20 h-20 mx-auto bg-green-900/30 rounded-full flex items-center justify-center border border-green-500/30 mb-4">
                      <CheckCircle size={40} className="text-green-400" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 mx-auto bg-red-900/30 rounded-full flex items-center justify-center border border-red-500/30 mb-4">
                      <XCircle size={40} className="text-red-400" />
                    </div>
                  )}
                  
                  <h3 className={`text-xl font-bold mb-2 ${isVerified ? 'text-green-400' : 'text-red-400'}`}>
                    {isVerified ? 'Product Verified!' : 'Verification Failed'}
                  </h3>
                  
                  <p className="text-gray-400">
                    {isVerified 
                      ? 'This product is authentic and registered in the database'
                      : error || 'This product could not be verified or may be counterfeit'
                    }
                  </p>
                </div>

                {isVerified && scannedData && (
                  <div className="bg-gray-700 rounded-lg p-6 mb-6 text-left">
                    <h4 className="font-semibold mb-4 text-center">Product Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Package size={16} className="text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-400">Product Name</p>
                          <p className="font-medium">{scannedData.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar size={16} className="text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-400">Manufacturing Date</p>
                          <p className="font-medium">{scannedData.manufacturingDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Hash size={16} className="text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-400">Model Number</p>
                          <p className="font-medium">{scannedData.modelNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={resetScanner}
                  className="bg-blue-600 text-white font-medium py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Scan Another Product
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}