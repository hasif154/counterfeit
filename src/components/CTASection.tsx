import React from 'react';
import { motion } from 'framer-motion';
interface CTASectionProps {
  openModal: () => void;
}
export function CTASection({
  openModal
}: CTASectionProps) {
  return <section className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Animated background effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      </div>
      <motion.div className="container mx-auto px-4 relative z-10" initial={{
      opacity: 0
    }} whileInView={{
      opacity: 1
    }} transition={{
      duration: 0.8
    }} viewport={{
      once: true
    }}>
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-700 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Join the future of authenticity verification
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Be among the first to implement our cutting-edge blockchain
              verification technology and provide your customers with absolute
              confidence in your products.
            </p>
          </div>
          <div className="flex justify-center">
            <motion.button onClick={openModal} whileHover={{
            scale: 1.05,
            boxShadow: '0 0 25px rgba(59, 130, 246, 0.6)'
          }} whileTap={{
            scale: 0.98
          }} className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-lg font-medium px-10 py-3 rounded-full hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-300">
              Try Now
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>;
}