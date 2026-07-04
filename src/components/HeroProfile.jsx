import { motion } from 'framer-motion';
import { Award, MapPin, Home as HomeIcon } from 'lucide-react';
import { astrologer, SITE } from '../utils/constants';
import { lagnaData } from '../data/lagnaData';

function ZodiacRing() {
  const radius = 120; // තිරයට ගැලපෙන ලෙස radius එක කුඩා කරන ලදී
  return (
    <div className="absolute inset-0 flex items-center justify-center z-0"> 
      <div className="relative w-[300px] h-[300px] animate-orbit-slow">
        {lagnaData.map((lagna, i) => {
          const angle = (i / lagnaData.length) * 2 * Math.PI - Math.PI / 2;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          return (
            <span
              key={lagna.name}
              className="absolute font-sinhala text-[11px] text-[#FACC15]/70 -translate-x-1/2 -translate-y-1/2 animate-orbit-reverse"
              style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
            >
              {lagna.name}
            </span>
          );
        })}
      </div>
      <div className="absolute w-[300px] h-[300px] rounded-full border border-[#FACC15]/15" />
      <div className="absolute w-[240px] h-[240px] rounded-full border border-[#FACC15]/10 animate-orbit" />
    </div>
  );
}

export default function HeroProfile() {
  return (
    <section id="home" className="relative pt-20 pb-10 px-4 overflow-hidden touch-pan-y flex flex-col items-center">
      <div className="absolute inset-0 bg-radial-fade pointer-events-none" />
      
      <div className="max-w-md w-full mx-auto relative flex flex-col items-center">
        {/* Header - Center */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-center mb-10 w-full"
        >
          <h1 className="font-sinhala text-3xl md:text-5xl font-bold text-[#FACC15] tracking-wide">
            {SITE.titleSi}
          </h1>
          <p className="font-sinhala text-white text-lg mt-3">
            {SITE.subtitleSi}
          </p>
        </motion.header>

        {/* ZodiacRing and Photo Container - Mobile Optimized */}
        <div className="relative w-[300px] h-[300px] mb-8 flex items-center justify-center scale-[0.9] sm:scale-100">
          <ZodiacRing />
          <div className="relative z-10 w-[180px] h-[180px] rounded-full overflow-hidden border-4 border-[#FACC15] shadow-2xl">
            <img
              src={astrologer.photo}
              alt={astrologer.nameMain}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
        </div>

        {/* Info Card - Center */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] px-6 py-8 w-full text-center shadow-2xl"
        >
          <h2 className="font-sinhala text-2xl text-[#FACC15] font-bold">
            {astrologer.nameTitle}
          </h2>
          <h3 className="font-sinhala text-xl text-white font-semibold mt-1">
            {astrologer.nameMain}
          </h3>

          <div className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#FACC15]/20 border border-[#FACC15]/50 mx-auto">
            <Award className="w-5 h-5 text-[#FACC15]" />
            <span className="font-bold text-white text-lg">{astrologer.experience}</span>
          </div>

          <div className="mt-6 space-y-3 w-full">
            <p className="font-sinhala flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm mx-auto">
              <MapPin className="w-4 h-4 text-[#FACC15]" /> {astrologer.addresses[0]}
            </p>
            <p className="font-sinhala flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm mx-auto">
              <HomeIcon className="w-4 h-4 text-[#FACC15]" /> {astrologer.addresses[1]}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
