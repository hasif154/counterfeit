import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
interface HeroSectionProps {
  openModal: () => void;
}
export function HeroSection({
  openModal
}: HeroSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    // Particle settings
    const particlesArray: Particle[] = [];
    const numberOfParticles = 100;
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 0.5;
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = (Math.random() - 0.5) * 1;
        this.color = `rgba(${Math.floor(Math.random() * 80 + 120)}, ${Math.floor(Math.random() * 80 + 180)}, ${Math.floor(Math.random() * 80 + 220)}, ${Math.random() * 0.5 + 0.2})`;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;else if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const init = () => {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };
    const connect = () => {
      if (!ctx) return;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(80, 180, 255, ${0.2 - distance / 500})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach(particle => {
        particle.update();
        particle.draw();
      });
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };
    init();
    animate();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  return <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/80 to-gray-900"></div>
      {/* Hero Content */}
      <div className="container mx-auto px-4 z-10 text-center">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.2
      }} className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-300 to-cyan-200">
            Real Products. Real Proof.
          </h1>
          <motion.p initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 0.8,
          delay: 0.6
        }} className="text-xl md:text-2xl text-gray-300 mb-8">
            Because originality should never be a question.
          </motion.p>
          <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 0.8,
          delay: 1
        }} className="flex items-center justify-center mb-12">
            <div className="bg-gray-800/60 backdrop-blur-sm px-6 py-2 rounded-full flex items-center space-x-2 border border-blue-500/20">
              <Shield size={18} className="text-green-400" />
              <span className="text-gray-300">100k+ Products Verified</span>
            </div>
          </motion.div>
          <motion.button onClick={openModal} whileHover={{
          scale: 1.05,
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)'
        }} whileTap={{
          scale: 0.98
        }} initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 0.8,
          delay: 1.2
        }} className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-lg font-medium px-10 py-3 rounded-full hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-300">
            Try Now
          </motion.button>
        </motion.div>
      </div>
      {/* Scroll Indicator */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 2,
      duration: 1
    }} className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <motion.div animate={{
          y: [0, 12, 0],
          opacity: [1, 0.2, 1]
        }} transition={{
          repeat: Infinity,
          duration: 1.5
        }} className="w-1.5 h-3 bg-blue-400 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>;
}