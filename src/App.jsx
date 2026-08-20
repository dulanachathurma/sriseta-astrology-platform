import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { X } from 'lucide-react'; // 1. X Icon එක Import කරගන්න
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import BackToTop from './components/BackToTop';
import Home from './pages/Home';
import DeveloperProfile from './components/DeveloperProfile'; // 2. DeveloperProfile Component එක Import කරගන්න

export default function App() {
  const [ready, setReady] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  // 3. Developer Modal එක Open/Close පාලනය කරන්න අලුත් State එකක්
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);

  return (
    <>
      {!ready && <SplashScreen onFinish={() => setReady(true)} />}

      <div className="bg-fixed-layer" />

      <div
        className={`min-h-screen text-ivory transition-opacity duration-700 ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* 4. Navbar එකට Developer Modal Open වෙන Function එක pass කරන්න */}
        <Navbar 
          onOpenBookingModal={() => setIsBookingOpen(true)} 
          onOpenDeveloperModal={() => setIsDevModalOpen(true)}
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

        {/* 5. Developer Popup Modal එක (Navbar එකෙන් Click කළාම විතරක් මෙතනින් Pop-up වේ) */}
        {isDevModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            {/* Background එක Click කළාම Close වීමට */}
            <div 
              className="absolute inset-0" 
              onClick={() => setIsDevModalOpen(false)} 
            />

            <div className="relative z-10 w-full max-w-2xl bg-[#121216] border border-[#FACC15]/30 rounded-3xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              
              {/* Close (X) Button */}
              <button 
                onClick={() => setIsDevModalOpen(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors p-2 rounded-full bg-white/5 hover:bg-white/10 z-20"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Developer UI Component එක */}
              <DeveloperProfile />

            </div>
          </div>
        )}
      </div>
    </>
  );
}
