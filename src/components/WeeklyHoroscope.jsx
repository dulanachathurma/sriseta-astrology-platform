import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { lagnaData } from '../data/lagnaData';

const AUTO_SLIDE_MS = 3500;

export default function WeeklyHoroscope() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (paused) return undefined;
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % lagnaData.length);
    }, AUTO_SLIDE_MS);
    return () => clearInterval(timerRef.current);
  }, [paused]);

  const prevSlide = () => setCurrent((c) => (c - 1 + lagnaData.length) % lagnaData.length);
  const nextSlide = () => setCurrent((c) => (c + 1) % lagnaData.length);

  return (
    <section id="weekly-horoscope" className="px-5 py-24 relative">
      {/* ඩෙස්ක්ටොප් සඳහා max-w-4xl සිට max-w-5xl දක්වා වැඩි කිරීමෙන් කාඩ්පත වඩාත් ඉඩකඩ සහිත කරයි */}
      <div className="max-w-4xl lg:max-w-5xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-[2.25rem] p-6 lg:p-12 shadow-2xl">
        
        {/* මාතෘකාව: ඩෙස්ක්ටොප් එකේදී 3xl ලෙස විශාල කරයි */}
        <h4 className="text-center text-2xl lg:text-3xl font-bold text-white mb-8 flex items-center justify-center gap-3">
          <CalendarDays className="w-9 h-9 text-gold" /> ග්‍රහ ලොව පෙර දැක්ම
        </h4>

        <div 
          className="relative touch-pan-y" 
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 lg:p-12 min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={lagnaData[current].name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ willChange: 'opacity' }}
                className="flex flex-col md:flex-row items-center gap-8 lg:gap-12"
              >
                <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full border-4 border-gold p-1 overflow-hidden shadow-lg shrink-0">
                  <img 
                    src={lagnaData[current].image} 
                    alt={lagnaData[current].name} 
                    className="w-full h-full object-cover rounded-full" 
                    loading="lazy" 
                    decoding="async"
                  />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  {/* ලග්න නම: ඩෙස්ක්ටොප් එකේදී 4xl ලෙස විශාල කරයි */}
                  <h3 className="text-3xl lg:text-4xl font-bold text-gold mb-4">
                    {lagnaData[current].name} ලග්නය
                  </h3>
                  
                  {/* විස්තරය: ඩෙස්ක්ටොප් එකේදී xl ලෙස කියවීමට පහසු කරයි */}
                  <p className="text-white/90 leading-relaxed text-lg lg:text-xl">
                    {lagnaData[current].description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mt-8">
            <button 
              onClick={prevSlide} 
              className="w-12 h-12 rounded-full bg-gold/20 border border-gold/50 text-gold flex items-center justify-center hover:bg-gold hover:text-white transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="font-bold text-gold text-lg">{current + 1} / {lagnaData.length}</span>
            <button 
              onClick={nextSlide} 
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
