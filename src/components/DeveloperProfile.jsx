import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import { developer } from '../data/developer';

export default function DeveloperProfile() {
  return (
    <div className="w-full max-w-xl mx-auto px-1 py-2 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 sm:p-8 shadow-2xl flex flex-col items-center text-center"
      >
        {/* Profile Photo - Height එක අඩු කිරීම සඳහා size එක compact කළා */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-4">
          <div className="relative w-full h-full rounded-full p-[3px] bg-gradient-to-br from-[#FACC15] to-white/30 shadow-lg">
            <div className="w-full h-full rounded-full overflow-hidden ring-2 ring-white/10 group">
              <img
                src={developer.photo}
                alt={developer.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/320x320/ffffff/000000?text=DC';
                }}
              />
            </div>
          </div>
        </div>

        {/* Name & Role */}
        <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-wide">
          {developer.name}
        </h3>
        <p className="text-[#FACC15] mt-1 text-xs sm:text-sm font-medium max-w-xs leading-snug">
          {developer.role}
        </p>

        {/* Contact Info - Text break-all එකතු කර Email එක නොකැපෙන ලෙස සකස් කළා */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-4 w-full bg-black/20 border border-white/10 rounded-2xl p-3 text-xs sm:text-sm text-white/90">
          <a 
            href={`mailto:${developer.email}`} 
            className="flex items-center gap-1.5 hover:text-[#FACC15] transition-colors break-all text-center"
          >
            <Mail className="w-4 h-4 text-[#FACC15] shrink-0" /> 
            <span>{developer.email}</span>
          </a>
          <span className="hidden sm:inline text-[#FACC15]/40">•</span>
          <a 
            href={`tel:${developer.phone.replace(/\s+/g, '')}`} 
            className="flex items-center gap-1.5 hover:text-[#FACC15] transition-colors shrink-0"
          >
            <Phone className="w-4 h-4 text-[#FACC15] shrink-0" /> 
            <span>{developer.phone}</span>
          </a>
        </div>

        {/* Social / Action Links - Width එක වැඩි කර, Height එක අඩු වන සේ Row එකකට සකස් කළා */}
        <div className="flex flex-wrap justify-center gap-3 mt-5 w-full">
          {developer.links.map(({ label, href, icon: Icon, external }) => (
            <motion.a
              key={label}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              aria-label={label}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[#FACC15] hover:text-black hover:border-[#FACC15] hover:shadow-lg transition-all"
            >
              <Icon className="w-5 h-5" />
              <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] bg-black/80 backdrop-blur text-white px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {label}
              </span>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
