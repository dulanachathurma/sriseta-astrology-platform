import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { X } from 'lucide-react';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import BackToTop from './components/BackToTop';
import Home from './pages/Home';
import DeveloperProfile from './components/DeveloperProfile';

export default function App() {
  const [ready, setReady] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);

  // 1. Developer Modal එක Open කරන Function එක (URL Hash එක එකතු කරයි)
  const handleOpenDeveloperModal = () => {
    setIsDevModalOpen(true);
    window.history.pushState({ modalOpen: true }, '', '#developer');
  };

  // 2. Modal එක Close කරන Function එක (URL Hash එක අයින් කරයි)
  const handleCloseDeveloperModal = () => {
    setIsDevModalOpen(false);
    if (window.location.hash === '#developer') {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  };

  // 3. Mobile / Browser Back Button එක Click කළ විට Modal එක පමණක් Close කිරීමට
  useEffect(() => {
    const handlePopState = () => {
      if (isDevModalOpen) {
        setIsDevModalOpen(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isDevModalOpen]);

  return (
    <>
      {!ready && <SplashScreen onFinish={() => setReady(true)} />}

      <div className="bg-fixed-layer" />

      <div
        className={`min-h-screen text-ivory transition-opacity duration-700 ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Navbar 
          onOpenBookingModal={() => setIsBookingOpen(true)} 
          onOpenDeveloperModal={handleOpenDeveloperModal}
        />

        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                isBookingOpen={isBookingOpen} 
                setIsBookingOpen={setIsBookingOpen} 
              />
            } 
          />
          <Route 
            path="*" 
            element={
              <Home 
                isBookingOpen={isBookingOpen} 
                setIsBookingOpen={setIsBookingOpen} 
              />
            } 
          />
        </Routes>
        
        <BackToTop />

        {/* Developer Popup Modal */}
        {isDevModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            {/* Background එක Click කළ විට Close වීමට */}
            <div 
              className="absolute inset-0" 
              onClick={handleCloseDeveloperModal} 
            />

            <div className="relative z-10 w-full max-w-2xl bg-[#121216] border border-[#FACC15]/30 rounded-3xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              
              {/* Close (X) Button */}
              <button 
                onClick={handleCloseDeveloperModal}
                className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors p-2 rounded-full bg-white/5 hover:bg-white/10 z-20"
              >
                <X className="w-6 h-6" />
              </button>

              <DeveloperProfile />

            </div>
          </div>
        )}
      </div>
    </>
  );
}
