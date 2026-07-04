import { motion } from 'framer-motion';
import { Award, MapPin, Home as HomeIcon } from 'lucide-react';
import { astrologer, SITE } from '../utils/constants';
import { lagnaData } from '../data/lagnaData';

function ZodiacRing() {
  const radius = 168; 
  return (
    <div className="absolute inset-0 flex items-center justify-center z-0"> 
      {/* පරිගණක තිරයේදී විශාල වන අතර ජංගම තිරයේදී කුඩා වේ */}
      <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] animate-orbit-slow">
        {lagnaData.map((lagna, i) => {
          const angle = (i / lagnaData.length) * 2 * Math.PI - Math.PI / 2;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          return (
            <span
              key={lagna.name}
              className="absolute font-sinhala text-[11px] md:text-[14px] text-[#FACC15]/70 -translate-x-1/2 -translate-y-1/2 animate-orbit-reverse"
              style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
            >
              {lagna.name}
            </span>
          );
        })}
      </div>
      <div className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full border border-[#FACC15]/15" />
      <div className="absolute w-[240px] h-[240px] md:w-[360px] md:h-[360px] rounded-full border border-[#FACC15]/10 animate-orbit" />
    </div>
  );
}

export default function HeroProfile() {
  return (
    <section id="home" className="relative pt-20 md:pt-32 pb-10 px-4 md:px-10 flex flex-col items-center justify-center min-h-screen">
      <div className="absolute inset-0 bg-radial-fade pointer-events-none" />
      
      {/* පරිගණක තිරයේදී flex-row, ජංගම තිරයේදී flex-col ලෙස සකසා ඇත */}
      <div className="max-w-6xl w-full mx-auto relative flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20">
        
        {/* Left Side: Ring and Image */}
        <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] flex items-center justify-center shrink-0">
          <ZodiacRing />
          <div className="relative z-10 w-[180px] h-[180px] md:w-[280px] md:h-[280px] rounded-full overflow-hidden border-4 border-[#FACC15] shadow-2xl">
            <img
              src={astrologer.photo}
              alt={astrologer.nameMain}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Side: Text and Details */}
        <div className="w-full max-w-xl text-center md:text-left">
          <motion.header
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 w-full"
          >
            {/* whitespace-nowrap මගින් Desktop හිදී නම එකම පේළියක පෙන්වයි */}
            <h1 className="font-sinhala text-3xl md:text-6xl font-bold text-[#FACC15] tracking-wide whitespace-nowrap w-full text-center md:text-left">
              {SITE.titleSi}
            </h1>
            <p className="font-sinhala text-white text-lg md:text-2xl mt-4 text-center md:text-left">
              {SITE.subtitleSi}
            </p>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] px-6 md:px-10 py-8 w-full text-center md:text-left shadow-2xl"
          >
            <h2 className="font-sinhala text-2xl md:text-3xl text-[#FACC15] font-bold">
              {astrologer.nameTitle}
            </h2>
            <h3 className="font-sinhala text-xl md:text-2xl text-white font-semibold mt-1">
              {astrologer.nameMain}
            </h3>

            <div className="mt-6 md:mt-8 inline-flex items-center justify-center md:justify-start gap-3 px-6 md:px-8 py-3 md:py-4 rounded-2xl bg-[#FACC15]/20 border border-[#FACC15]/50 mx-auto md:mx-0">
              <Award className="w-5 h-5 md:w-6 md:h-6 text-[#FACC15]" />
              <span className="font-bold text-white text-lg md:text-xl">{astrologer.experience}</span>
            </div>

            <div className="mt-6 md:mt-8 space-y-3 md:space-y-4">
              <p className="font-sinhala flex items-center justify-center md:justify-start gap-3 text-white text-sm md:text-lg">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-[#FACC15]" /> {astrologer.addresses[0]}
              </p>
              <p className="font-sinhala flex items-center justify-center md:justify-start gap-3 text-white text-sm md:text-lg">
                <HomeIcon className="w-4 h-4 md:w-5 md:h-5 text-[#FACC15]" /> {astrologer.addresses[1]}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
