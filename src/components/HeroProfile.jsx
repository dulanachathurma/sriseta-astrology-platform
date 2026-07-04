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
    <section id="home" className="relative pt-36 md:pt-44 pb-24 px-5 overflow-hidden">
      <div className="absolute inset-0 bg-radial-fade pointer-events-none" />
      <div className="max-w-5xl mx-auto relative">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-center mb-14"
        >
          <h1 className="font-sinhala text-3xl sm:text-4xl md:text-5xl font-bold text-[#FACC15] tracking-wide leading-tight md:leading-relaxed">
            {SITE.titleSi}
          </h1>
          <p className="font-sinhala text-white text-lg md:text-xl mt-4">
            {SITE.subtitleSi}
          </p>
        </motion.header>

        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9 }}
            className="relative w-[280px] h-[280px] mb-12 flex items-center justify-center"
          >
            <ZodiacRing />
            <div className="relative w-[240px] h-[240px] rounded-full p-[6px] bg-gradient-to-br from-[#FACC15] via-[#C1793B] to-deep shadow-gold-lg animate-float">
              <div className="w-full h-full rounded-full overflow-hidden ring-4 ring-void">
                <img
                  src={astrologer.photo}
                  alt={astrologer.nameMain}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] px-8 py-10 md:px-14 md:py-12 max-w-lg w-full text-center shadow-2xl mt-20"
          >
            {/* කාඩ්පත තුළ රූපය එකතු කිරීම */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full border-2 border-[#FACC15]/50 overflow-hidden shadow-lg">
                <img 
                  src="public/new-photo.jpg" 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>

            <h2 className="font-sinhala text-2xl md:text-3xl text-[#FACC15] font-bold">
              {astrologer.nameTitle}
            </h2>
            <h3 className="font-sinhala text-xl md:text-2xl text-white font-semibold mt-1">
              {astrologer.nameMain}
            </h3>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-sinhala mt-6 inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-[#FACC15]/20 via-[#FACC15]/30 to-[#FACC15]/20 border border-[#FACC15]/50 shadow-[0_0_20px_rgba(250,204,21,0.3)] cursor-pointer"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Award className="w-6 h-6 text-[#FACC15]" />
              </motion.div>
              <span className="font-bold text-black text-xl tracking-wide">{astrologer.experience}</span>
            </motion.div>

            <div className="mt-6 space-y-3">
              <p className="font-sinhala flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-black/40 border border-white/10 text-white hover:bg-black/60 transition-colors">
                <MapPin className="w-5 h-5 text-[#FACC15]" /> {astrologer.addresses[0]}
              </p>
              <p className="font-sinhala flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-black/40 border border-white/10 text-white hover:bg-black/60 transition-colors">
                <HomeIcon className="w-5 h-5 text-[#FACC15]" /> {astrologer.addresses[1]}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}