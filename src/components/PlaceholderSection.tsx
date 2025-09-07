import React from 'react';
import { motion } from 'framer-motion';
import { ScanSearch } from 'lucide-react';
export function PlaceholderSection() {
  return <section className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            Seamless Verification, Coming Soon
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our advanced verification system is in development. Soon you'll be
            able to prove product originality in seconds.
          </p>
        </div>
        <motion.div className="max-w-3xl mx-auto bg-gray-800/30 backdrop-blur-md border border-gray-700 rounded-2xl p-8 md:p-12 overflow-hidden relative" initial={{
        opacity: 0,
        y: 50
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} viewport={{
        once: true
      }}>
          {/* Holographic effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-xl opacity-50"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold mb-4 text-white">
                Our advanced verification system will let you prove originality
                in seconds
              </h3>
              <p className="text-gray-400 mb-6">
                BlockAuthentic is developing a revolutionary scanning system
                that will make product verification simple, secure, and instant.
                Stay tuned for updates.
              </p>
              <div className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 inline-flex items-center">
                <span className="text-blue-400 mr-2">•</span>
                <span className="text-gray-300">Coming Q4 2025</span>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <motion.div className="w-40 h-40 bg-gray-900/70 rounded-full flex items-center justify-center border border-blue-500/30" animate={{
              boxShadow: ['0 0 0 rgba(59, 130, 246, 0)', '0 0 30px rgba(59, 130, 246, 0.5)', '0 0 0 rgba(59, 130, 246, 0)']
            }} transition={{
              repeat: Infinity,
              duration: 3
            }}>
                <motion.div animate={{
                rotate: 360
              }} transition={{
                repeat: Infinity,
                duration: 8,
                ease: 'linear'
              }}>
                  <ScanSearch size={64} className="text-blue-400" />
                </motion.div>
              </motion.div>
            </div>
          </div>
          {/* Animated radar effect */}
          <motion.div className="absolute bottom-0 right-0 w-full h-full pointer-events-none opacity-20" animate={{
          rotate: 360
        }} transition={{
          repeat: Infinity,
          duration: 15,
          ease: 'linear'
        }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] border-2 border-blue-400/20 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] border-2 border-cyan-400/20 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] border-2 border-blue-400/20 rounded-full"></div>
          </motion.div>
        </motion.div>
      </div>
    </section>;
}