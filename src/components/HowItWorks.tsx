import React, { Children } from 'react';
import { motion } from 'framer-motion';
import { QrCode, ShieldCheck, Factory } from 'lucide-react';
export function HowItWorks() {
  const steps = [{
    icon: <Factory size={32} className="text-blue-400" />,
    title: 'Manufacturer Registration',
    description: 'Manufacturers add products and receive unique verification codes for each item.'
  }, {
    icon: <QrCode size={32} className="text-cyan-400" />,
    title: 'Consumer Verification',
    description: 'Consumers scan product codes to instantly verify authenticity.'
  }, {
    icon: <ShieldCheck size={32} className="text-purple-400" />,
    title: 'Blockchain Security',
    description: 'Proof of originality is stored securely and immutably on the blockchain.'
  }];
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  return <section id="how-it-works" className="py-24 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            How It Works
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our revolutionary platform makes authenticity verification simple
            and secure.
          </p>
        </div>
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
        once: true,
        amount: 0.3
      }}>
          {steps.map((step, index) => <motion.div key={index} variants={itemVariants} className="relative bg-gray-800/50 backdrop-blur rounded-xl p-8 border border-gray-700 group hover:border-blue-500/50 transition-all duration-300" whileHover={{
          boxShadow: '0 0 25px rgba(59, 130, 246, 0.3)'
        }}>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-900/80 flex items-center justify-center border border-gray-700">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-4 text-white">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-center">{step.description}</p>
              </div>
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-xl" />
            </motion.div>)}
        </motion.div>
      </div>
    </section>;
}