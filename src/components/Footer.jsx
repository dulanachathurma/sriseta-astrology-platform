import { motion } from 'framer-motion';
import { Clock, CalendarCheck, Facebook, ExternalLink } from 'lucide-react';
import { SITE } from '../utils/constants';

export default function Footer() {
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

        <div className="mt-10 pt-8 border-t border-white/10 text-white/60 text-sm font-sinhala space-y-1">
          <p>{SITE.copyright}</p>
          <p className="text-[#FACC15]/70">Developed by Dulana Chathurma</p>
        </div>
      </motion.div>
    </footer>
  );
}