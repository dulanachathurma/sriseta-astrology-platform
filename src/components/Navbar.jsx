import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { id: 'home', label: 'මුල් පිටුව' },
  { id: 'services', label: 'සේවා' },
  { id: 'weekly-horoscope', label: 'ග්‍රහ ලොව පෙර දැක්ම' },
  { id: 'developer', label: 'Developer' },
];

export default function Navbar({ onOpenBookingModal }) {
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
      const element = document.getElementById(link.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const id = window.location.hash.replace('#', '');
      if (id) {
        setActive(id);
        if (id === 'contact') {
          onOpenBookingModal?.();
        } else {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [onOpenBookingModal]);

  const handleNavClick = (id) => {
    setOpen(false);
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
        
        {/* 1. Rotating Yellow Border/Glow Logo */}
        <button onClick={() => handleNavClick('home')} className="flex items-center gap-2 group relative">
          <div className="relative w-12 h-12 rounded-full p-[2px] overflow-hidden flex items-center justify-center">
            {/* Rotating Yellow Light Ring */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              className="absolute w-[180%] h-[180%] bg-[conic-gradient(from_0deg,#FACC15_0%,transparent_30%,#FACC15_50%,transparent_80%,#FACC15_100%)]"
            />
            
            {/* Logo Image Inside */}
            <div className="relative w-full h-full rounded-full overflow-hidden bg-black p-0.5 z-10 flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-full h-full object-cover rounded-full" 
              />
            </div>
          </div>
        </button>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button 
              key={link.id} 
              onClick={() => handleNavClick(link.id)} 
              className={`text-sm transition-all relative py-1 uppercase tracking-wider ${active === link.id ? 'text-[#FACC15] font-bold' : (scrolled ? 'text-gray-200' : 'text-white/80')}`}
            >
              {link.label}
              {active === link.id && (
                <motion.span layoutId="nav-underline" className="absolute left-0 -bottom-1 w-full h-[2px] bg-[#FACC15]" />
              )}
            </button>
          ))}
        </div>

        {/* 2. Rotating Bright Green Border/Glow Button (Desktop) */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => handleNavClick('contact')}
            className="relative group p-[2px] rounded-full overflow-hidden flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
          >
            {/* Rotating Bright Neon Green Light Ring */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              className="absolute w-[200%] h-[300%] bg-[conic-gradient(from_0deg,#00FF66_0%,transparent_30%,#10B981_50%,transparent_80%,#00FF66_100%)]"
            />

            {/* Inner Button Body with Glow */}
            <span className="relative z-10 px-7 py-2.5 rounded-full bg-black text-[#00FF66] font-bold text-sm transition-colors duration-300 group-hover:bg-[#00FF66] group-hover:text-black shadow-[0_0_15px_rgba(0,255,102,0.4)]">
              සම්බන්ධ වන්න
            </span>
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <button onClick={() => setOpen(!open)} className={`md:hidden ${scrolled ? 'text-white' : 'text-[#FACC15]'}`}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
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
                  className={`text-left text-lg ${active === link.id ? 'text-[#FACC15] font-bold' : 'text-gray-200'}`}
                >
                  {link.label}
                </button>
              ))}
              
              {/* Rotating Bright Green Glow Button (Mobile) */}
              <button
                onClick={() => handleNavClick('contact')}
                className="relative p-[2px] rounded-full overflow-hidden flex items-center justify-center mt-2 w-full"
              >
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                  className="absolute w-[200%] h-[300%] bg-[conic-gradient(from_0deg,#00FF66_0%,transparent_30%,#10B981_50%,transparent_80%,#00FF66_100%)]"
                />
                <span className="relative z-10 w-full py-3 rounded-full bg-black text-[#00FF66] font-bold text-center shadow-[0_0_15px_rgba(0,255,102,0.4)]">
                  සම්බන්ධ වන්න
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
