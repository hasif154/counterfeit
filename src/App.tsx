import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import { IndustriesGrid } from './components/IndustriesGrid';
import { PlaceholderSection } from './components/PlaceholderSection';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { TryNowModal } from './components/TryNowModal';
import { ProductRegistration } from './components/ProductRegistration';
import { QRScanner } from './components/QRScanner';

type ViewType = 'home' | 'manufacturer' | 'buyer';

export function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const handleRoleSelection = (role: 'manufacturer' | 'buyer') => {
    setCurrentView(role);
    closeModal();
  };
  
  const goHome = () => setCurrentView('home');

  if (currentView === 'manufacturer') {
    return <ProductRegistration onBack={goHome} />;
  }

  if (currentView === 'buyer') {
    return <QRScanner onBack={goHome} />;
  }

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
      <TryNowModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSelectRole={handleRoleSelection}
      />
    </div>;
}