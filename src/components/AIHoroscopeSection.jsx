import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, LogIn, UserPlus, Star, Brain, Shield, ChevronRight, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import HoroscopeFormModal from './HoroscopeFormModal';

const FEATURES = [
  { icon: <Brain className="w-5 h-5" />, label: 'විශේෂඥ ජ්‍යොතිෂ විශ්ලේෂණය' },
  { icon: <Shield className="w-5 h-5" />, label: 'ආරක්ෂිත ගිණුම' },
  { icon: <Star className="w-5 h-5" />, label: 'පූර්ණ සිංහල වාර්තාව' },
];

export default function AIHoroscopeSection() {
  const { isLoggedIn, user, logout } = useAuth();

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [formOpen, setFormOpen] = useState(false);

  // Mobile / Browser Back Button එක Click කළ විට Modal එක පමණක් Close වීමට
  useEffect(() => {
    const handlePopState = () => {
      if (formOpen) {
        setFormOpen(false);
      } else if (authOpen) {
        setAuthOpen(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [formOpen, authOpen]);

  const openAuth = (mode) => {
    setAuthMode(mode);
    setAuthOpen(true);
    window.history.pushState({ modal: 'auth' }, '', '#auth');
  };

  const handleAuthClose = (result) => {
    setAuthOpen(false);
    if (window.location.hash === '#auth') {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
    if (result === 'success') {
      setTimeout(() => {
        setFormOpen(true);
        window.history.pushState({ modal: 'palapala-form' }, '', '#palapala-form');
      }, 350);
    }
  };

  const handleOpenForm = () => {
    if (isLoggedIn) {
      setFormOpen(true);
      window.history.pushState({ modal: 'palapala-form' }, '', '#palapala-form');
    } else {
      openAuth('login');
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    if (window.location.hash === '#palapala-form') {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  };

  return (
    <>
      <section id="palapala" className="px-5 py-16 relative scroll-mt-24">
        {/* Soft glow background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FACC15]/5 blur-[80px] rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-cyan-500/5 blur-[60px] rounded-full" />
        </div>

        <div className="max-w-4xl lg:max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            {/* Main Transparent Glassmorphic Card */}
            <div className="relative rounded-[2.25rem] overflow-hidden shadow-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 lg:p-12">
              
              {/* Subtle accent glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FACC15]/[0.04] via-transparent to-cyan-500/[0.04] pointer-events-none" />

              {/* Decorative planet rings */}
              <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full border border-white/10 pointer-events-none" />
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full border border-[#FACC15]/10 pointer-events-none" />

              <div className="relative">
                <div className="flex flex-col lg:flex-row gap-10 items-center">

                  {/* LEFT: Text Content */}
                  <div className="flex-1 text-center lg:text-left">
                    {/* Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-white/5 border border-white/15"
                    >
                      <Sparkles className="w-4 h-4 text-[#FACC15]" />
                      <span className="font-sinhala text-[#FACC15] text-xs font-bold tracking-wide">
                        ජ්‍යොතිෂ පලාපල සේවාව — නව!
                      </span>
                    </motion.div>

                    {/* Main Heading */}
                    <h2 className="font-sinhala text-3xl md:text-4xl font-bold text-white mb-4 leading-snug">
                      ඔබේ හඳහනට අනුව{' '}
                      <span
                        className="font-sinhala"
                        style={{
                          background: 'linear-gradient(120deg, #FACC15 0%, #F59E0B 50%, #06B6D4 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        පුද්ගලික
                      </span>
                      {' '}පලාපල විස්තරය
                    </h2>

                    {/* Subtitle */}
                    <p className="font-sinhala text-white/80 text-base leading-relaxed mb-6 max-w-lg mx-auto lg:mx-0">
                      ඔබේ ජන්ම ලග්නය සහ ග්‍රහ පිහිටීම් ඇතුළත් කිරීමෙන් ජ්‍යොතිෂ ශාස්ත්‍රයට අනුකූලව
                      සිංහලෙන් ගැඹුරු, පූර්ණ ජ්‍යොතිෂ පලාපල වාර්තාවක් ක්ෂණිකව ලබාගන්න.
                    </p>

                    {/* Logged in User Greeting Badge */}
                    {isLoggedIn && user && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/10 border border-[#FACC15]/30 mb-6 backdrop-blur-md"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#FACC15]/20 border border-[#FACC15]/40 flex items-center justify-center text-[#FACC15] font-bold text-xs">
                          {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                        </div>
                        <div className="text-left">
                          <p className="font-sinhala text-[11px] text-white/60">පිවිසී ඇත</p>
                          <p className="font-sinhala text-sm font-bold text-[#FACC15]">
                            ආයුබෝවන්, {user.name || user.email?.split('@')[0]}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Feature Pills */}
                    <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
                      {FEATURES.map((f, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/15"
                        >
                          <span className="text-[#FACC15]">{f.icon}</span>
                          <span className="font-sinhala text-white/80 text-xs">{f.label}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* CTA and Action Buttons */}
                    {isLoggedIn ? (
                      <div className="flex flex-wrap gap-4 justify-center lg:justify-start items-center">
                        <motion.button
                          whileHover={{ scale: 1.04, boxShadow: '0 0 35px rgba(250,204,21,0.4)' }}
                          whileTap={{ scale: 0.97 }}
                          onClick={handleOpenForm}
                          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base font-sinhala bg-gradient-to-r from-[#FACC15] via-[#F59E0B] to-[#06B6D4] text-[#0A0B1E] shadow-xl hover:opacity-95 transition-all cursor-pointer"
                        >
                          <Sparkles className="w-5 h-5" />
                          පලාපල විස්තරය ලබාගන්න
                          <ChevronRight className="w-4 h-4" />
                        </motion.button>

                        <button
                          type="button"
                          onClick={logout}
                          className="flex items-center gap-2 px-5 py-4 rounded-2xl font-sinhala font-semibold text-sm bg-white/5 hover:bg-red-500/20 text-white/80 hover:text-red-300 border border-white/15 hover:border-red-500/30 transition-all cursor-pointer shadow-sm"
                          title="ගිණුමෙන් ඉවත් වන්න"
                        >
                          <LogOut className="w-4 h-4" />
                          ඉවත් වන්න (Logout)
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                        {/* Register */}
                        <motion.button
                          whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(250,204,21,0.35)' }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => openAuth('register')}
                          id="register-btn"
                          className="flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-sm font-sinhala bg-gradient-to-r from-[#FACC15] to-[#F59E0B] text-[#0A0B1E] shadow-lg cursor-pointer"
                        >
                          <UserPlus className="w-4 h-4" />
                          Register (ලියාපදිංචිය)
                        </motion.button>

                        {/* Login */}
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => openAuth('login')}
                          id="login-btn"
                          className="flex items-center gap-2 px-7 py-4 rounded-2xl font-semibold text-sm font-sinhala bg-white/10 hover:bg-white/15 border border-white/20 text-[#FACC15] transition-all cursor-pointer"
                        >
                          <LogIn className="w-4 h-4" />
                          Login (ලොගින්)
                        </motion.button>
                      </div>
                    )}
                  </div>

                  {/* RIGHT: Decorative Astrology Graphic */}
                  <motion.div
                    initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                    whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="hidden lg:flex flex-col items-center justify-center shrink-0"
                  >
                    <div className="relative w-52 h-52">
                      {/* Outer ring */}
                      <div
                        className="absolute inset-0 rounded-full animate-spin"
                        style={{
                          border: '1.5px dashed rgba(250,204,21,0.25)',
                          animationDuration: '25s',
                        }}
                      />
                      {/* Middle ring */}
                      <div
                        className="absolute inset-6 rounded-full animate-spin"
                        style={{
                          border: '1px dashed rgba(6,182,212,0.25)',
                          animationDuration: '18s',
                          animationDirection: 'reverse',
                        }}
                      />
                      {/* Inner glow */}
                      <div className="absolute inset-12 rounded-full flex items-center justify-center bg-white/5 border border-white/15 shadow-inner">
                        <Sparkles className="w-10 h-10 text-[#FACC15]" style={{ filter: 'drop-shadow(0 0 12px rgba(250,204,21,0.5))' }} />
                      </div>
                      {/* Orbiting planet dots */}
                      {['top-2 left-1/2', 'bottom-2 left-1/2', 'left-2 top-1/2', 'right-2 top-1/2'].map((pos, i) => (
                        <div
                          key={i}
                          className={`absolute ${pos} w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full`}
                          style={{
                            background: i % 2 === 0 ? '#FACC15' : '#06B6D4',
                            boxShadow: `0 0 8px ${i % 2 === 0 ? 'rgba(250,204,21,0.7)' : 'rgba(6,182,212,0.7)'}`,
                          }}
                        />
                      ))}
                    </div>
                    <p className="font-sinhala text-white/50 text-xs mt-4 text-center">
                      ඩිජිටල් ජ්‍යොතිෂ පද්ධතිය
                    </p>
                  </motion.div>

                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        open={authOpen}
        onClose={handleAuthClose}
        defaultMode={authMode}
      />

      {/* Horoscope Form Modal */}
      <HoroscopeFormModal
        open={formOpen}
        onClose={handleFormClose}
        onOpenAuth={openAuth}
      />
    </>
  );
}
