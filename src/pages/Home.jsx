import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroProfile from '../components/HeroProfile';
import AIHoroscopeSection from '../components/AIHoroscopeSection';
import ServicesSection from '../components/ServicesSection';
import WeeklyHoroscope from '../components/WeeklyHoroscope';
import Footer from '../components/Footer';
import ServiceForm from '../components/ServiceForm';

export default function Home({ isBookingOpen, setIsBookingOpen, onOpenDeveloperModal }) {
  const [bookingServiceType, setBookingServiceType] = useState('palapala');
  
  // Browser හෝ Mobile Back Button එක ක්ලික් කළ විට Modal එක පමණක් Close වීමට
  useEffect(() => {
    const handlePopState = () => {
      if (isBookingOpen) {
        setIsBookingOpen(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isBookingOpen, setIsBookingOpen]);

  // Listen for open-booking-modal event and hash change
  useEffect(() => {
    const handleOpenBooking = (e) => {
      if (e?.detail?.serviceType) {
        setBookingServiceType(e.detail.serviceType);
      }
      setIsBookingOpen(true);
      window.history.pushState({ modal: 'contact' }, '', '#contact');
    };

    const handleHash = () => {
      if (window.location.hash === '#contact') {
        setIsBookingOpen(true);
      }
    };

    window.addEventListener('open-booking-modal', handleOpenBooking);
    window.addEventListener('hashchange', handleHash);

    return () => {
      window.removeEventListener('open-booking-modal', handleOpenBooking);
      window.removeEventListener('hashchange', handleHash);
    };
  }, [setIsBookingOpen]);

  // Modal එක Close (X) කළ විට URL එක සාමාන්‍ය තත්වයට පත් කිරීමට
  const handleCloseModal = () => {
    setIsBookingOpen(false);
    if (window.location.hash === '#contact') {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  };

  return (
    <>
      <HeroProfile />
      <ServicesSection />
      <WeeklyHoroscope />
      <AIHoroscopeSection />
      
      {/* <DeveloperProfile /> කොටස සාමාන්‍ය Flow එකෙන් අයින් කරන ලදී */}
      
      <Footer onOpenDeveloperModal={onOpenDeveloperModal} />

      {/* Service Form Popup Modal */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div 
              className="absolute inset-0" 
              onClick={handleCloseModal} 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#121216] border border-[#FACC15]/30 rounded-3xl p-6 md:p-8 shadow-2xl"
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors p-2 rounded-full bg-white/5 hover:bg-white/10"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="font-sinhala text-2xl font-bold text-[#FACC15] mb-6 text-center">
                සේවා අයදුම්පත
              </h2>

              <ServiceForm 
                defaultServiceType={bookingServiceType} 
                key={bookingServiceType + (isBookingOpen ? '-open' : '-closed')} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
