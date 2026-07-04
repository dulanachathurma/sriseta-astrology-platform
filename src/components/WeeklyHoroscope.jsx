import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, RefreshCw, AlertCircle, Clock3, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchWeeklyHoroscope } from '../services/horoscopeApi';
import { lagnaData } from '../data/lagnaData';
import LoadingSpinner from './LoadingSpinner';

const AUTO_SLIDE_MS = 3500;
const NO_TEXT_FALLBACK = 'මෙම ලග්නය සඳහා විස්තර මෙම මොහොතේ මූලාශ්‍රයෙන් හඳුනාගත නොහැකි විය.';

function formatDate(value) {
  if (!value) return null;
  try {
    return new Date(value).toLocaleDateString('si-LK', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return value; }
}

function buildSlides(items) {
  const bySign = new Map((items || []).map((item) => [item.sign, item.text]));
  return lagnaData.map((lagna) => ({ ...lagna, text: bySign.get(lagna.name) || null }));
}

export default function WeeklyHoroscope() {
  const [status, setStatus] = useState('loading');
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState(null);
  const [slides, setSlides] = useState(() => buildSlides([]));
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const load = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const data = await fetchWeeklyHoroscope();
      setPayload(data);
      setSlides(buildSlides(data.items));
      setStatus('ready');
    } catch (err) {
      setError(err.message || 'Unknown error');
      setSlides(buildSlides([]));
      setStatus('error');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (paused || status === 'loading') return undefined;
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % slides.length), AUTO_SLIDE_MS);
    return () => clearInterval(timerRef.current);
  }, [paused, status, slides.length]);

  const slide = slides[current];

  return (
    <section id="weekly-horoscope" className="px-5 py-24 relative">
      {/* Glassmorphism Card Wrapper */}
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-[2.25rem] p-6 md:p-14 shadow-2xl">
        
        <h2 className="font-sinhala text-center text-4xl md:text-5xl font-bold text-white mb-8 flex items-center justify-center gap-3">
          <CalendarDays className="w-9 h-9 text-gold" /> සතියේ පලාපල
        </h2>

        {status === 'loading' ? (
          <LoadingSpinner label="පූරණය වෙමින්..." />
        ) : (
          <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            
            {/* Glassmorphism Inner Box */}
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
                  {/* Golden Circular Frame for Image */}
                  <div className="w-48 h-48 md:w-56 md:h-56 shrink-0 rounded-full border-4 border-gold p-1 bg-white/10 backdrop-blur-sm overflow-hidden shadow-lg">
                    <img
                      src={slide.image}
                      alt={slide.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-sinhala text-3xl font-bold text-gold mb-4">{slide.name} ලග්නය</h3>
                    <p className="font-sinhala text-white/90 leading-relaxed text-lg">{slide.text || NO_TEXT_FALLBACK}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Controls */}
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
        )}
      </div>
    </section>
  );
}