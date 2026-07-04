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

      {/* Background එක ස්ක්‍රෝල් නොවන පරිදි Fixed Layer එකක් ලෙස තබන්න */}
      <div className="bg-fixed-layer" />

      <div
        className={`min-h-screen text-ivory transition-opacity duration-700 ${
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
