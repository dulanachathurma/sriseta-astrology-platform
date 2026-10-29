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
                onOpenDeveloperModal={handleOpenDeveloperModal}
              />
            } 
          />
          <Route 
            path="*" 
            element={
              <Home 
                isBookingOpen={isBookingOpen} 
                setIsBookingOpen={setIsBookingOpen} 
                onOpenDeveloperModal={handleOpenDeveloperModal}
              />
            } 
          />
        </Routes>
        
        <BackToTop />

        {/* Developer Popup Modal (Enlarged on Desktop) */}
        {isDevModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            {/* Background click to close */}
            <div 
              className="fixed inset-0" 
              onClick={handleCloseDeveloperModal} 
            />

            {/* Modal Box: Desktop එකේදී තවත් විශාලව පෙනෙන පරිදි max-w-md md:max-w-xl lg:max-w-2xl ලෙස සකසා ඇත */}
            <div className="relative z-10 w-full max-w-md md:max-w-xl lg:max-w-2xl bg-[#121216] border border-[#FACC15]/40 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden my-auto">
              
              {/* Close (X) Button */}
              <button 
                onClick={handleCloseDeveloperModal}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-white transition-colors p-2 rounded-full bg-white/5 hover:bg-white/10 z-20"
                aria-label="Close Developer Modal"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <DeveloperProfile />

            </div>
          </div>
        )}
      </div>
    </>
  );
}
