import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import BackToTop from './components/BackToTop';
import Home from './pages/Home';

export default function App() {
  const [ready, setReady] = useState(false);

  return (
    <>
      {!ready && <SplashScreen onFinish={() => setReady(true)} />}

      <div
  className={`min-h-screen bg-stars text-ivory transition-opacity duration-700 ${
    ready ? 'opacity-100' : 'opacity-0'
  }`}
>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <BackToTop />
      
      </div>
    </>
  );
}
