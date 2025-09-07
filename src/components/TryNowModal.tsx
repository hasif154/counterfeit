import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Lock } from 'lucide-react';
interface TryNowModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function TryNowModal({
  isOpen,
  onClose
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
                Get Started with BlockAuthentic
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-6">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-900/30 flex items-center justify-center border border-blue-500/30">
                  <QrCode size={32} className="text-blue-400" />
                </div>
              </div>
              <p className="text-gray-300 text-center mb-6">
                Fill out the form below to start your journey with
                BlockAuthentic and secure your products with our cutting-edge
                verification technology.
              </p>
              <form className="space-y-4">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-400 mb-1">
                    Company Name
                  </label>
                  <input type="text" id="company" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Your company name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                    Email Address
                  </label>
                  <input type="email" id="email" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="you@example.com" />
                </div>
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-400 mb-1">
                    Industry
                  </label>
                  <select id="industry" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="" disabled selected>
                      Select your industry
                    </option>
                    <option value="luxury">Luxury Goods</option>
                    <option value="electronics">Electronics</option>
                    <option value="pharma">Pharmaceuticals</option>
                    <option value="documents">Documents</option>
                    <option value="fashion">Fashion</option>
                    <option value="automotive">Automotive</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </form>
            </div>
            {/* Modal Footer */}
            <div className="bg-gray-800/50 p-6 flex flex-col gap-4">
              <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium py-2 rounded-lg hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                Request Demo
              </button>
              <div className="flex items-center justify-center text-sm text-gray-400">
                <Lock size={14} className="mr-2" />
                <span>Your information is secure and encrypted</span>
              </div>
            </div>
            {/* Decorative gradient border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"></div>
          </motion.div>
        </div>}
    </AnimatePresence>;
}