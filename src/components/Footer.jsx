import { motion } from 'framer-motion';
import { Clock, CalendarCheck, Facebook, ExternalLink } from 'lucide-react';
import { SITE } from '../utils/constants';

export default function Footer({ onOpenDeveloperModal }) {
  const handleDeveloperClick = () => {
    if (onOpenDeveloperModal) {
      onOpenDeveloperModal();
    } else {
      window.location.hash = '#developer';
    }
  };

  return (
    <footer id="contact" className="px-5 pt-20 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        // සුදු පැහැති Glassmorphism ශෛලිය සහිත container එක
        className="max-w-5xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-8 md:p-14 text-center shadow-2xl"
      >
        {/* Centered Circular Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full p-[3px] bg-gradient-to-br from-[#FACC15] via-[#F59E0B] to-[#06B6D4] shadow-[0_0_30px_rgba(250,204,21,0.35)] flex items-center justify-center">
            <div className="w-full h-full rounded-full overflow-hidden bg-black/90 p-1 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="ශ්‍රී සෙත Logo"
                className="w-full h-full object-cover rounded-full transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>

        <h3 className="font-sinhala text-3xl md:text-4xl text-[#FACC15] font-bold mb-2">
          {SITE.titleSi}
        </h3>
        <p className="font-sinhala text-white/80 text-lg">සියලු ජ්‍යොතිෂ කටයුතු සඳහා</p>

        <div className="flex flex-wrap justify-center gap-4 my-10">
          <span className="font-sinhala flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white/90">
            <Clock className="w-4 h-4 text-[#FACC15]" /> {SITE.hours}
          </span>
          <span className="font-sinhala flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white/90">
            <CalendarCheck className="w-4 h-4 text-[#FACC15]" /> {SITE.everyDay}
          </span>
        </div>

        <div className="max-w-sm mx-auto rounded-2xl border border-white/10 bg-white/5 p-6">
          <a
            href={SITE.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            // ලා නිල් පැහැති බොත්තම
            className="flex items-center justify-center gap-3 w-full py-4 rounded-full bg-[#007bff] text-white font-semibold shadow-lg hover:bg-[#0056b3] transition-all"
          >
            <Facebook className="w-5 h-5" />
            Facebook
          </a>
          <p className="font-sinhala text-sm text-white/60 mt-3 flex items-center justify-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" /> අපගේ ෆේස්බුක් පිටුවට පිවිසීමට මෙතැන ක්ලික් කරන්න
          </p>
        </div>

        {/* Footer Bottom / Developer Attribution */}
        <div className="mt-10 pt-8 border-t border-white/10 text-white/60 text-sm font-sinhala space-y-4">
          <p>{SITE.copyright}</p>

          {/* Professional Developer Branding with Logo */}
          <div className="flex flex-col items-center justify-center gap-2 pt-2">
            <button
              onClick={handleDeveloperClick}
              className="group inline-flex items-center gap-2 text-sm sm:text-base font-sans font-medium transition-all focus:outline-none"
            >
              <span className="text-white/60 text-xs sm:text-sm tracking-widest uppercase">
                Developed by
              </span>
              <span className="font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-200 group-hover:from-white group-hover:to-white transition-all duration-300">
                Dulana Chathurma
              </span>
            </button>

            {/* Developer Logo Banner */}
            <button
              onClick={handleDeveloperClick}
              aria-label="Dulana Chathurma Developer Profile"
              className="relative group inline-block rounded-xl overflow-hidden border border-white/20 bg-black/80 p-1 sm:p-1.5 shadow-[0_6px_20px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105 hover:border-amber-400/80 hover:shadow-[0_0_25px_rgba(250,204,21,0.35)] focus:outline-none"
            >
              <img
                src="/images/developer_logo.jpg"
                alt="Dulana Chathurma"
                className="h-10 sm:h-12 md:h-14 w-auto object-contain rounded-lg"
              />
            </button>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}