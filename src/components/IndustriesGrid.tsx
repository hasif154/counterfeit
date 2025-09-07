import React, { Children } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Cpu, PillIcon, FileText, Shirt, Car } from 'lucide-react';
export function IndustriesGrid() {
  const industries = [{
    icon: <ShoppingBag size={32} className="text-blue-400" />,
    title: 'Luxury Goods',
    emoji: '👜',
    description: 'Protect brand value with unquestionable authenticity'
  }, {
    icon: <Cpu size={32} className="text-green-400" />,
    title: 'Electronics',
    emoji: '⚡',
    description: 'Combat counterfeit components with blockchain verification'
  }, {
    icon: <PillIcon size={32} className="text-red-400" />,
    title: 'Pharmaceuticals',
    emoji: '💊',
    description: 'Ensure medication safety through verified supply chains'
  }, {
    icon: <FileText size={32} className="text-yellow-400" />,
    title: 'Documents',
    emoji: '📄',
    description: 'Verify certificates and important documents instantly'
  }, {
    icon: <Shirt size={32} className="text-purple-400" />,
    title: 'Fashion',
    emoji: '👗',
    description: 'Authenticate designer items and combat replicas'
  }, {
    icon: <Car size={32} className="text-cyan-400" />,
    title: 'Automotive',
    emoji: '🚗',
    description: 'Verify genuine parts and prevent counterfeits'
  }];
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  return <section id="industries" className="py-24 bg-gray-900/80">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            Industries We Serve
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            BlockAuthentic provides verification solutions across multiple
            sectors.
          </p>
        </div>
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
        once: true,
        amount: 0.1
      }}>
          {industries.map((industry, index) => <motion.div key={index} variants={itemVariants} className="relative overflow-hidden bg-gray-800/30 backdrop-blur rounded-xl p-6 border border-gray-700 group hover:border-blue-500/50 transition-all duration-300" whileHover={{
          boxShadow: '0 0 25px rgba(59, 130, 246, 0.2)'
        }}>
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gray-900/60 rounded-lg border border-gray-700">
                    {industry.icon}
                  </div>
                  <span className="text-3xl" role="img" aria-label={industry.title}>
                    {industry.emoji}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-blue-300 transition-colors duration-300">
                  {industry.title}
                </h3>
                <p className="text-gray-400">{industry.description}</p>
              </div>
              {/* Animated border effect */}
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-xl" />
            </motion.div>)}
        </motion.div>
      </div>
    </section>;
}