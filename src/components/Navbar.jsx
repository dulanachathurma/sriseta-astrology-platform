import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { id: 'home', label: 'මුල් පිටුව' },
  { id: 'services', label: 'සේවා' },
  { id: 'weekly-horoscope', label: 'ග්‍රහ ලොව පෙර දැක්ම' },
  { id: 'palapala', label: 'පලාපල විස්තර' },
  { id: 'developer', label: 'Developer' },
];

export default function Navbar({ onOpenBookingModal, onOpenDeveloperModal }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobile Back Button එකෙන් Mobile Navigation Menu එක Close වීමට
  useEffect(() => {
    if (!open) return;

    window.history.pushState({ navMenu: true }, '', '#nav');

    const handlePopState = () => {
      setOpen(false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (window.location.hash === '#nav') {
        window.history.pushState('', document.title, window.location.pathname + window.location.search);
      }
    };
  }, [open]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { root: null, rootMargin: '-30% 0px -30% 0px', threshold: 0 }
    );

    NAV_LINKS.forEach((link) => {
      if (link.id !== 'developer') {
        const element = document.getElementById(link.id);
        if (element) observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id) => {
    setOpen(false);

    if (id === 'developer') {
      onOpenDeveloperModal?.();
      return;
    }

    setActive(id);

    if (id === 'contact') {
      window.location.hash = 'contact';
      if (onOpenBookingModal) {
        onOpenBookingModal();
      }
      return;
    }

    window.location.hash = id;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-3 sm:px-6 md:px-8 pt-2 sm:pt-3 pointer-events-none transition-all duration-300">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        {/* Floating Capsule Navbar (py-1 ලෙස vertical padding එක විතරක් අඩු කර ඇත) */}
        <nav
          className={`bg-white/95 backdrop-blur-md rounded-full px-4 sm:px-6 py-1 border border-slate-100 flex items-center justify-between transition-all duration-300 ${
            scrolled
              ? 'shadow-[0_12px_35px_rgba(0,0,0,0.18)]'
              : 'shadow-[0_8px_30px_rgba(0,0,0,0.12)]'
          }`}
        >
          {/* =========================================
              DESKTOP VIEW (md:flex)
             ========================================= */}

          {/* 1. Desktop Logo & Branding */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-full p-[2.5px] overflow-hidden flex items-center justify-center shrink-0 shadow-md">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                  className="absolute w-[180%] h-[180%] bg-[conic-gradient(from_0deg,#FACC15_0%,transparent_30%,#FACC15_50%,transparent_80%,#FACC15_100%)]"
                />
                <div className="relative w-full h-full rounded-full overflow-hidden bg-black p-0.5 z-10 flex items-center justify-center">
                  <img src="/logo.png" alt="sriseta.lk logo" className="w-full h-full object-cover rounded-full" />
                </div>
              </div>
              <span className="font-extrabold text-xl lg:text-2xl text-slate-900 tracking-tight transition-colors group-hover:text-blue-600">
                sriseta.lk
              </span>
            </button>
          </div>

          {/* 2. Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.id && link.id !== 'developer';
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-sm lg:text-[15px] font-semibold transition-colors relative py-1 tracking-wide focus:outline-none ${
                    isActive
                      ? 'text-blue-600 font-bold'
                      : 'text-slate-700 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-0 -bottom-1 w-full h-[2.5px] bg-blue-600 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* 3. Desktop Button Contact */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => handleNavClick('contact')}
              className="relative group flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none"
            >
              <motion.span
                animate={{ scale: [1, 1.25, 1.4], opacity: [0.6, 0.3, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full border-2 border-[#22c55e]"
              />
              <motion.span
                animate={{ scale: [1, 1.2, 1.35], opacity: [0.6, 0.3, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.6, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full border-2 border-[#22c55e]"
              />
              <motion.span
                animate={{ scale: [1, 1.15, 1.25], opacity: [0.6, 0.3, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 1.2, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full border-2 border-[#22c55e]"
              />

              <span className="relative z-10 px-6 py-2 lg:px-7 lg:py-2.5 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-sm transition-colors duration-300 shadow-[0_0_15px_rgba(34,197,94,0.45)]">
                සම්බන්ධ වන්න
              </span>
            </button>
          </div>

          {/* =========================================
              MOBILE VIEW (md:hidden)
             ========================================= */}

          {/* 1. Mobile Hamburger Button */}
          <div className="flex md:hidden items-center justify-start w-10">
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle Navigation Menu"
              className="w-10 h-10 rounded-full border border-gray-200/90 bg-gray-50/70 hover:bg-gray-100 flex items-center justify-center text-slate-800 transition-all duration-200 active:scale-90 shadow-sm focus:outline-none"
            >
              {open ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
            </button>
          </div>

          {/* 2. Mobile Logo & Branding */}
          <div className="flex md:hidden items-center justify-center flex-1">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="relative w-10 h-10 rounded-full p-[2px] overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                  className="absolute w-[180%] h-[180%] bg-[conic-gradient(from_0deg,#FACC15_0%,transparent_30%,#FACC15_50%,transparent_80%,#FACC15_100%)]"
                />
                <div className="relative w-full h-full rounded-full overflow-hidden bg-black p-0.5 z-10 flex items-center justify-center">
                  <img src="/logo.png" alt="sriseta.lk logo" className="w-full h-full object-cover rounded-full" />
                </div>
              </div>
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                sriseta.lk
              </span>
            </button>
          </div>

          {/* 3. Mobile Right Spacer */}
          <div className="flex md:hidden items-center justify-end w-10" />
        </nav>

        {/* Mobile Dropdown Menu Card */}
        <AnimatePresence>
          {open && (
            <>
              {/* Tap-outside Backdrop */}
              <div
                className="fixed inset-0 z-[-1] bg-black/30 backdrop-blur-[2px] md:hidden"
                onClick={() => setOpen(false)}
              />

              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="md:hidden mt-2 bg-white/95 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-[0_15px_35px_rgba(0,0,0,0.18)] overflow-hidden pointer-events-auto"
              >
                <div className="flex flex-col p-5 gap-2.5">
                  {NAV_LINKS.map((link) => {
                    const isActive = active === link.id && link.id !== 'developer';
                    return (
                      <button
                        key={link.id}
                        onClick={() => handleNavClick(link.id)}
                        className={`text-left text-base font-semibold py-2.5 px-4 rounded-xl transition-all ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 font-bold border-l-4 border-blue-600'
                            : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                        }`}
                      >
                        {link.label}
                      </button>
                    );
                  })}

                  {/* Mobile Contact Button */}
                  <div className="pt-3 px-1">
                    <button
                      onClick={() => handleNavClick('contact')}
                      className="relative flex items-center justify-center w-full py-3 group transition-all duration-300 active:scale-95 focus:outline-none"
                    >
                      <motion.span
                        animate={{ scale: [1, 1.15, 1.3], opacity: [0.6, 0.3, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
                        className="absolute inset-0 rounded-full border-2 border-[#22c55e]"
                      />
                      <motion.span
                        animate={{ scale: [1, 1.1, 1.2], opacity: [0.6, 0.3, 0] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 0.6, ease: 'easeOut' }}
                        className="absolute inset-0 rounded-full border-2 border-[#22c55e]"
                      />

                      <span className="relative z-10 w-full py-3 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-center text-sm shadow-[0_0_15px_rgba(34,197,94,0.45)]">
                        සම්බන්ධ වන්න
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
