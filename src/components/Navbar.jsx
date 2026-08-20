import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { id: 'home', label: 'මුල් පිටුව' },
  { id: 'services', label: 'සේවා' },
  { id: 'weekly-horoscope', label: 'ග්‍රහ ලොව පෙර දැක්ම' },
  { id: 'developer', label: 'Developer' },
];

export default function Navbar({ onOpenBookingModal, onOpenDeveloperModal }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-3 shadow-lg' : 'bg-transparent py-5'}`}>
      <nav className="max-w-7xl mx-auto px-5 flex items-center justify-between">
        
        {/* Logo */}
        <button onClick={() => handleNavClick('home')} className="flex items-center gap-2 group relative">
          <div className="relative w-12 h-12 rounded-full p-[2px] overflow-hidden flex items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              className="absolute w-[180%] h-[180%] bg-[conic-gradient(from_0deg,#FACC15_0%,transparent_30%,#FACC15_50%,transparent_80%,#FACC15_100%)]"
            />
            <div className="relative w-full h-full rounded-full overflow-hidden bg-black p-0.5 z-10 flex items-center justify-center">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover rounded-full" />
            </div>
          </div>
        </button>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button 
              key={link.id} 
              onClick={() => handleNavClick(link.id)} 
              className={`text-sm transition-all relative py-1 uppercase tracking-wider ${active === link.id && link.id !== 'developer' ? 'text-[#FACC15] font-bold' : (scrolled ? 'text-gray-200' : 'text-white/80')}`}
            >
              {link.label}
              {active === link.id && link.id !== 'developer' && (
                <motion.span layoutId="nav-underline" className="absolute left-0 -bottom-1 w-full h-[2px] bg-[#FACC15]" />
              )}
            </button>
          ))}
        </div>

        {/* Desktop Button Contact */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => handleNavClick('contact')}
            className="relative group flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <motion.span animate={{ scale: [1, 1.25, 1.4], opacity: [0.6, 0.3, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }} className="absolute inset-0 rounded-full border-2 border-[#22c55e]" />
            <motion.span animate={{ scale: [1, 1.2, 1.35], opacity: [0.6, 0.3, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.6, ease: 'easeOut' }} className="absolute inset-0 rounded-full border-2 border-[#22c55e]" />
            <motion.span animate={{ scale: [1, 1.15, 1.25], opacity: [0.6, 0.3, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 1.2, ease: 'easeOut' }} className="absolute inset-0 rounded-full border-2 border-[#22c55e]" />

            <span className="relative z-10 px-7 py-2.5 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-sm transition-colors duration-300 shadow-[0_0_15px_rgba(34,197,94,0.5)]">
              සම්බන්ධ වන්න
            </span>
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <button onClick={() => setOpen(!open)} className={`md:hidden ${scrolled ? 'text-white' : 'text-[#FACC15]'}`}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            className="md:hidden bg-black/95 border-b border-white/10 backdrop-blur-xl absolute top-full left-0 w-full"
          >
            <div className="flex flex-col px-5 py-6 gap-5">
              {NAV_LINKS.map((link) => (
                <button 
                  key={link.id} 
                  onClick={() => handleNavClick(link.id)} 
                  className={`text-left text-lg ${active === link.id && link.id !== 'developer' ? 'text-[#FACC15] font-bold' : 'text-gray-200'}`}
                >
                  {link.label}
                </button>
              ))}
              
              {/* Mobile Contact Button (Animated Rings Added) */}
              <div className="pt-2 px-2">
                <button
                  onClick={() => handleNavClick('contact')}
                  className="relative flex items-center justify-center w-full py-3 group transition-all duration-300 active:scale-95"
                >
                  {/* Animated Expanding Rings for Mobile Button */}
                  <motion.span animate={{ scale: [1, 1.15, 1.3], opacity: [0.6, 0.3, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }} className="absolute inset-0 rounded-full border-2 border-[#22c55e]" />
                  <motion.span animate={{ scale: [1, 1.1, 1.2], opacity: [0.6, 0.3, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.6, ease: 'easeOut' }} className="absolute inset-0 rounded-full border-2 border-[#22c55e]" />

                  <span className="relative z-10 w-full py-3 rounded-full bg-[#22c55e] text-white font-bold text-center shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                    සම්බන්ධ වන්න
                  </span>
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
