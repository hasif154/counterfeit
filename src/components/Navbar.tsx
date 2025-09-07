import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
interface NavbarProps {
  openModal: () => void;
}
export function Navbar({
  openModal
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="#" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
          BlockAuthentic
        </a>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
            Home
          </a>
          <a href="#how-it-works" className="text-gray-300 hover:text-blue-400 transition-colors">
            How It Works
          </a>
          <a href="#industries" className="text-gray-300 hover:text-blue-400 transition-colors">
            Industries
          </a>
          <a href="#contact" className="text-gray-300 hover:text-blue-400 transition-colors">
            Contact
          </a>
          <button onClick={openModal} className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
            Try Now
          </button>
        </nav>
        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {/* Mobile Navigation */}
      {mobileMenuOpen && <div className="md:hidden bg-gray-800 shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors py-2">
              Home
            </a>
            <a href="#how-it-works" className="text-gray-300 hover:text-blue-400 transition-colors py-2">
              How It Works
            </a>
            <a href="#industries" className="text-gray-300 hover:text-blue-400 transition-colors py-2">
              Industries
            </a>
            <a href="#contact" className="text-gray-300 hover:text-blue-400 transition-colors py-2">
              Contact
            </a>
            <button onClick={() => {
          openModal();
          setMobileMenuOpen(false);
        }} className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
              Try Now
            </button>
          </div>
        </div>}
    </header>;
}