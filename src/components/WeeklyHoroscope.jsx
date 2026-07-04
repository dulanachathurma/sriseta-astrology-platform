import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { lagnaData } from '../data/lagnaData';

const AUTO_SLIDE_MS = 3500;

export default function WeeklyHoroscope() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  
  const slides = lagnaData;

  useEffect(() => {
    if (paused) return undefined;
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, AUTO_SLIDE_MS);
    return () => clearInterval(timerRef.current);
  }, [paused, slides.length]);

  return (
    <section id="weekly-horoscope" className="px-5 py-24 relative">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-[2.25rem] p-6 md:p-14 shadow-2xl">
        <h5 className="font-sinhala text-center text-2xl md:text-3xl font-bold text-white mb-8 flex items-center justify-center gap-3">
          <CalendarDays className="w-9 h-9 text-gold" /> ග්‍රහ ලොව පෙර දැක්ම
        </h5>

        {/* touch-pan-y මගින් mobile scrolling පහසු කරයි */}
        <div 
          className="relative touch-pan-y" 
          onMouseEnter={() => setPaused(true)} 
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={slides[current].name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{ willChange: 'opacity' }}
                className="flex flex-col md:flex-row items-center gap-8"
              >
                {/* aspect-square මගින් layout shift වළක්වයි, loading="lazy" වේගය වැඩි කරයි */}
                <div className="w-48 h-48 md:w-56 md:h-56 aspect-square shrink-0 rounded-full border-4 border-gold p-1 bg-white/10 backdrop-blur-sm overflow-hidden shadow-lg">
                  <img 
                    src={slides[current].image} 
                    alt={slides[current].name} 
                    className="w-full h-full object-cover rounded-full" 
                    loading="lazy" 
                    decoding="async"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-sinhala text-3xl font-bold text-gold mb-4">{slides[current].name} ලග්නය</h3>
                  <p className="font-sinhala text-white/90 leading-relaxed text-lg">{slides[current].description}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mt-8">
            <button 
              onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)} 
              className="w-12 h-12 rounded-full bg-gold/20 border border-gold/50 text-gold flex items-center justify-center hover:bg-gold hover:text-white transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="font-bold text-gold">{current + 1} / {slides.length}</span>
            <button 
              onClick={() => setCurrent((c) => (c + 1) % slides.length)} 
              className="w-12 h-12 rounded-full bg-gold/20 border border-gold/50 text-gold flex items-center justify-center hover:bg-gold hover:text-white transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
