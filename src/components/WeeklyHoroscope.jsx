import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { lagnaData } from '../data/lagnaData';

const AUTO_SLIDE_MS = 3500;

export default function WeeklyHoroscope() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  
  // ස්ථිර ලග්න දත්ත පමණක් භාවිතා වේ
  const slides = lagnaData;

  useEffect(() => {
    if (paused) return undefined;
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, AUTO_SLIDE_MS);
    return () => clearInterval(timerRef.current);
  }, [paused, slides.length]);

  const slide = slides[current];

  return (
    <section id="weekly-horoscope" className="px-5 py-24 relative">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-[2.25rem] p-6 md:p-14 shadow-2xl">
        <h3 className="font-sinhala text-center text-4xl md:text-5xl font-bold text-white mb-8 flex items-center justify-center gap-3">
          <CalendarDays className="w-9 h-9 text-gold" /> ග්‍රහ ලොව පෙර දැක්ම
        </h3>

        <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col md:flex-row items-center gap-8"
              >
                <div className="w-48 h-48 md:w-56 md:h-56 shrink-0 rounded-full border-4 border-gold p-1 bg-white/10 backdrop-blur-sm overflow-hidden shadow-lg">
                  <img src={slide.image} alt={slide.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-sinhala text-3xl font-bold text-gold mb-4">{slide.name} ලග්නය</h3>
                  <p className="font-sinhala text-white/90 leading-relaxed text-lg">{slide.description}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mt-8">
            <button onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)} className="w-12 h-12 rounded-full bg-gold/20 border border-gold/50 text-gold flex items-center justify-center hover:bg-gold hover:text-white transition-all">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="font-bold text-gold">{current + 1} / {slides.length}</span>
            <button onClick={() => setCurrent((c) => (c + 1) % slides.length)} className="w-12 h-12 rounded-full bg-gold/20 border border-gold/50 text-gold flex items-center justify-center hover:bg-gold hover:text-white transition-all">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
