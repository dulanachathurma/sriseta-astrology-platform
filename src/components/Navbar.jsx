import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';

const NAV_LINKS = [
  { id: 'home', label: 'මුල් පිටුව' },
  { id: 'services', label: 'සේවා' },
  { id: 'weekly-horoscope', label: 'සතියේ පලාපල' },
  { id: 'developer', label: 'Developer' },
  { id: 'contact', label: 'සම්බන්ධ වන්න' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 1. Intersection Observer (Scroll වන විට active වීමට)
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

  // 2. Hash Change Listener (Mobile Back Button සඳහා)
  useEffect(() => {
    const handleHashChange = () => {
      const id = window.location.hash.replace('#', '');
      if (id) {
        setActive(id);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const scrollTo = (id) => {
    setOpen(false);
    setActive(id);
    window.location.hash = id; // මෙය මගින් URL එකේ #id සටහන් වේ
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/70 backdrop-blur-xl border-b border-black/10 py-3 shadow-lg' : 'bg-transparent py-5'}`}>
      <nav className="max-w-7xl mx-auto px-5 flex items-center justify-between">
        <button onClick={() => scrollTo('home')} className="flex items-center gap-2">
          <Sparkles className={`w-6 h-6 ${scrolled ? 'text-black' : 'text-[#FACC15]'}`} />
          <span className={`font-semibold text-lg ${scrolled ? 'text-black' : 'text-[#FACC15]'}`}>ශ්‍රී සෙත</span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button key={link.id} onClick={() => scrollTo(link.id)} className={`text-sm transition-all relative py-1 ${active === link.id ? 'text-[#FACC15] font-bold' : (scrolled ? 'text-gray-700' : 'text-white/80')}`}>
              {link.label}
              {active === link.id && <motion.span layoutId="nav-underline" className="absolute left-0 -bottom-1 w-full h-[2px] bg-[#FACC15]" />}
            </button>
          ))}
        </div>

        <button onClick={() => setOpen(!open)} className={`md:hidden ${scrolled ? 'text-black' : 'text-[#FACC15]'}`}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden bg-white/95 border-b backdrop-blur-lg absolute top-full left-0 w-full">
            <div className="flex flex-col px-5 py-6 gap-5">
              {NAV_LINKS.map((link) => (
                <button key={link.id} onClick={() => scrollTo(link.id)} className={`text-left text-lg ${active === link.id ? 'text-[#FACC15] font-bold' : 'text-gray-800'}`}>
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}