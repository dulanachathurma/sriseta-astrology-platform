import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { lagnaData } from '../data/lagnaData';

export default function WeeklyHoroscope() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  return (
    <section id="weekly-horoscope" className="px-5 py-24 relative">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-[2.25rem] p-6 shadow-2xl">
        <h5 className="text-center text-2xl font-bold text-white mb-8 flex items-center justify-center gap-3">
          <CalendarDays className="w-9 h-9 text-gold" /> ග්‍රහ ලොව පෙර දැක්ම
        </h5>

        <div 
          className="relative touch-pan-y" 
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <AnimatePresence mode="wait">
              <motion.div
                layout // මෙය ස්ක්‍රෝල් එකේ පැන පැන යාම වළක්වයි
                key={lagnaData[current].name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex flex-col md:flex-row items-center gap-8"
              >
                <div className="w-48 h-48 rounded-full border-4 border-gold p-1 overflow-hidden shadow-lg">
                  <img 
                    src={lagnaData[current].image} 
                    alt={lagnaData[current].name} 
                    className="w-full h-full object-cover rounded-full" 
                    loading="lazy" 
                    decoding="async"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-bold text-gold mb-4">{lagnaData[current].name} ලග්නය</h3>
                  <p className="text-white/90 leading-relaxed text-lg">{lagnaData[current].description}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
