import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import { IndustriesGrid } from './components/IndustriesGrid';
import { PlaceholderSection } from './components/PlaceholderSection';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { TryNowModal } from './components/TryNowModal';
export function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return <div className="flex flex-col w-full min-h-screen bg-gray-900 text-white overflow-x-hidden">
      <Navbar openModal={openModal} />
      <main>
        <HeroSection openModal={openModal} />
        <HowItWorks />
        <IndustriesGrid />
        <PlaceholderSection />
        <CTASection openModal={openModal} />
      </main>
      <Footer />
      <TryNowModal isOpen={isModalOpen} onClose={closeModal} />
    </div>;
}