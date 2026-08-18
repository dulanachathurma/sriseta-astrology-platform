import { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroProfile from '../components/HeroProfile';
import ServicesSection from '../components/ServicesSection';
import WeeklyHoroscope from '../components/WeeklyHoroscope';
import DeveloperProfile from '../components/DeveloperProfile';
import Footer from '../components/Footer';
import ServiceForm from '../components/ServiceForm';

export default function Home({ isBookingOpen, setIsBookingOpen }) {
  
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
      <DeveloperProfile />
      <Footer />

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

              <ServiceForm />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
