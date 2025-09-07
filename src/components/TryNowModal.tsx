import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Search } from 'lucide-react';
interface TryNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: 'manufacturer' | 'buyer') => void;
}
export function TryNowModal({
  isOpen,
  onClose,
  onSelectRole
}: TryNowModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    document.addEventListener('mousedown', handleClickOutside);
    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  return <AnimatePresence>
      {isOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.3
      }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div ref={modalRef} initial={{
        opacity: 0,
        scale: 0.9,
        y: 20
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} exit={{
        opacity: 0,
        scale: 0.9,
        y: 20
      }} transition={{
        type: 'spring',
        duration: 0.5
      }} className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden">
            {/* Modal Header with close button */}
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">
                Choose Your Role
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-300 text-center mb-8">
                Select your role to get started with BlockAuthentic
              </p>
              <div className="space-y-4">
                <button 
                  onClick={() => onSelectRole('manufacturer')}
                  className="w-full p-6 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 hover:bg-gray-700 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center border border-blue-500/30 group-hover:bg-blue-900/50">
                      <Package size={24} className="text-blue-400" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-white font-semibold">Manufacturer</h4>
                      <p className="text-gray-400 text-sm">Register and secure your products</p>
                    </div>
                  </div>
                </button>
                <button 
                  onClick={() => onSelectRole('buyer')}
                  className="w-full p-6 bg-gray-800 border border-gray-700 rounded-lg hover:border-green-500 hover:bg-gray-700 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center border border-green-500/30 group-hover:bg-green-900/50">
                      <Search size={24} className="text-green-400" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-white font-semibold">Buyer</h4>
                      <p className="text-gray-400 text-sm">Scan and verify product authenticity</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            {/* Decorative gradient border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"></div>
          </motion.div>
        </div>}
    </AnimatePresence>;
}