import { motion } from 'framer-motion';
import { Award, MapPin, Home as HomeIcon } from 'lucide-react';
import { astrologer, SITE } from '../utils/constants';
import { lagnaData } from '../data/lagnaData';

function ZodiacRing() {
  const radius = 168;
  return (
    <div className="absolute inset-0 flex items-center justify-center z-0"> 
      <div className="relative w-[380px] h-[380px] animate-orbit-slow">
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
      <div className="absolute w-[380px] h-[380px] rounded-full border border-[#FACC15]/15" />
      <div className="absolute w-[300px] h-[300px] rounded-full border border-[#FACC15]/10 animate-orbit" />
    </div>
  );
}

export default function HeroProfile() {
  return (
    // pt-20 ලෙස වෙනස් කර ඇත (mobile responsive), touch-pan-y මගින් scroll වේගය වැඩි වේ
    <section id="home" className="relative pt-20 md:pt-44 pb-10 px-4 overflow-hidden touch-pan-y">
      <div className="absolute inset-0 bg-radial-fade pointer-events-none" />
      <div className="max-w-5xl mx-auto relative">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-center mb-8"
        >
          <h1 className="font-sinhala text-3xl sm:text-4xl md:text-5xl font-bold text-[#FACC15] tracking-wide">
            {SITE.titleSi}
          </h1>
          <p className="font-sinhala text-white text-lg mt-2">
            {SITE.subtitleSi}
          </p>
        </motion.header>

        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9 }}
            className="relative w-[280px] h-[280px] mb-8 flex items-center justify-center"
          >
            <ZodiacRing />
            <div className="relative w-[240px] h-[240px] rounded-full p-[6px] bg-gradient-to-br from-[#FACC15] via-[#C1793B] to-deep shadow-gold-lg animate-float">
              <div className="w-full h-full rounded-full overflow-hidden ring-4 ring-void">
                <img
                  src={astrologer.photo}
                  alt={astrologer.nameMain}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] px-6 py-8 w-full max-w-sm text-center shadow-2xl"
          >
            {/* රූපය නිවැරදිව public ෆෝල්ඩරයෙන් ලබා ගනී */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full border-2 border-[#FACC15]/50 overflow-hidden shadow-lg">
                <img 
                  src="/shriyani.jpg" 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>

            <h2 className="font-sinhala text-2xl text-[#FACC15] font-bold">
              {astrologer.nameTitle}
            </h2>
            <h3 className="font-sinhala text-xl text-white font-semibold mt-1">
              {astrologer.nameMain}
            </h3>

            <div className="font-sinhala mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FACC15]/20 border border-[#FACC15]/50 cursor-pointer">
              <Award className="w-5 h-5 text-[#FACC15]" />
              <span className="font-bold text-white text-lg">{astrologer.experience}</span>
            </div>

            <div className="mt-6 space-y-3">
              <p className="font-sinhala flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm">
                <MapPin className="w-4 h-4 text-[#FACC15]" /> {astrologer.addresses[0]}
              </p>
              <p className="font-sinhala flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm">
                <HomeIcon className="w-4 h-4 text-[#FACC15]" /> {astrologer.addresses[1]}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
