import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import { developer } from '../data/developer';

export default function DeveloperProfile() {
  return (
    <section id="developer" className="px-5 py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <h2 className="font-display italic text-4xl md:text-5xl font-semibold text-[#FACC15] mb-3">
            Developer
          </h2>
          <p className="text-white/70 tracking-wide">
            Designed and Developed by <span className="text-[#FACC15]">Dulana Chathurma</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          // සුදු පැහැති Glassmorphism ශෛලිය
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2.25rem] p-8 md:p-14 shadow-2xl flex flex-col items-center text-center"
        >
          <div className="relative w-40 h-40 mb-8 animate-float">
            <div className="relative w-full h-full rounded-full p-[4px] bg-gradient-to-br from-[#FACC15] to-white/30 shadow-lg">
              <div className="w-full h-full rounded-full overflow-hidden ring-4 ring-white/10 group">
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

          <h3 className="font-display text-3xl font-semibold text-white">{developer.name}</h3>
          <p className="text-[#FACC15] mt-2 text-sm md:text-base tracking-wide">{developer.role}</p>

          <div className="flex flex-col sm:flex-row gap-3 mt-6 text-white/80 text-sm">
            <a href={`mailto:${developer.email}`} className="flex items-center gap-2 hover:text-[#FACC15] transition-colors">
              <Mail className="w-4 h-4" /> {developer.email}
            </a>
            <span className="hidden sm:inline text-[#FACC15]/30">•</span>
            <a href={`tel:${developer.phone.replace(/\s+/g, '')}`} className="flex items-center gap-2 hover:text-[#FACC15] transition-colors">
              <Phone className="w-4 h-4" /> {developer.phone}
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-10">
            {developer.links.map(({ label, href, icon: Icon, external }) => (
              <motion.a
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                aria-label={label}
                whileHover={{ y: -6, scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                // ලා නිල් පැහැති/සුදු Glass තේමාවට ගැළපෙන බොත්තම්
                className="group relative w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-[#007bff] hover:text-white hover:border-[#007bff] hover:shadow-lg transition-all"
              >
                <Icon className="w-6 h-6" />
                <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-white/20 backdrop-blur text-white px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  {label}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}