import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ onFinish, duration = 2600 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onFinish, 600);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-void bg-stars px-4"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
        >
          {/* ලාංඡන කොටස */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative flex items-center justify-center scale-75 sm:scale-100"
          >
            {/* වෘත්තවල ප්‍රමාණය අඩු කරන ලදී */}
            <span className="absolute inline-block w-72 h-72 rounded-full border border-[#FACC15]/30 animate-orbit-slow" />
            <span className="absolute inline-block w-[22rem] h-[22rem] rounded-full border border-[#FACC15]/15 animate-orbit-reverse" />
            
            <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-[0_0_80px_rgba(250,204,21,0.4)] border-2 border-[#FACC15]/60 bg-deep flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Sri Seta Jyothisha"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextSibling.style.display = 'flex';
                }}
              />
              <span
                className="hidden w-full h-full items-center justify-center font-display text-8xl text-[#FACC15]"
                style={{ display: 'none' }}
              >
                ॐ
              </span>
            </div>
          </motion.div>

          {/* පෙළ කොටස - mt අගය වැඩි කර තව පහළට ගෙන ඇත */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-sinhala mt-24 sm:mt-32 text-white text-2xl sm:text-3xl text-center px-6 leading-relaxed max-w-xs sm:max-w-none"
          >
            Sri seta Astrology Service
          </motion.p>

          {/* පහළ තිත් ලෝඩරය */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-10 flex gap-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-4 h-4 rounded-full bg-[#FACC15]"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
