import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import { developer } from '../data/developer';

export default function DeveloperProfile() {
  return (
    <div className="w-full text-center">
      
      {/* Profile Photo (Desktop එකේදී තවත් විශාලව පෙනෙන පරිදි w-32 h-32 md:w-36 md:h-36) */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 mx-auto mb-4">
        <div className="w-full h-full rounded-full p-[3px] bg-gradient-to-br from-[#FACC15] via-amber-400 to-white/40 shadow-xl">
          <img
            src={developer.photo}
            alt={developer.name}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/150';
            }}
          />
        </div>
      </div>

      {/* Name & Role */}
      <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-wide">
        {developer.name}
      </h3>
      <p className="text-[#FACC15] text-xs sm:text-sm md:text-base font-medium my-2 max-w-md mx-auto leading-relaxed">
        {developer.role}
      </p>

      {/* Contact Box (Email & Phone) */}
      <div className="my-4 md:my-6 bg-white/5 border border-white/10 rounded-2xl p-3.5 sm:p-4 md:p-5 space-y-2.5 text-white/90">
        <a 
          href={`mailto:${developer.email}`} 
          className="flex items-center justify-center gap-2.5 hover:text-[#FACC15] transition-colors text-xs sm:text-sm md:text-base font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis"
        >
          <Mail className="w-4 h-4 md:w-5 md:h-5 text-[#FACC15] shrink-0" /> 
          <span className="truncate">{developer.email}</span>
        </a>
        <a 
          href={`tel:${developer.phone.replace(/\s+/g, '')}`} 
          className="flex items-center justify-center gap-2.5 hover:text-[#FACC15] transition-colors text-xs sm:text-sm md:text-base font-medium"
        >
          <Phone className="w-4 h-4 md:w-5 md:h-5 text-[#FACC15] shrink-0" /> 
          <span>{developer.phone}</span>
        </a>
      </div>

      {/* Social Icons Grid */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 pt-1">
        {developer.links.map(({ label, href, icon: Icon, external }) => (
          <a
            key={label}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            aria-label={label}
            className="flex items-center justify-center h-10 sm:h-11 md:h-12 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-[#FACC15] hover:text-black hover:border-[#FACC15] transition-all hover:scale-105"
          >
            <Icon className="w-4 h-4 md:w-5 md:h-5" />
          </a>
        ))}
      </div>

      {/* Developer Brand Logo Banner inside card */}
      <div className="pt-5 md:pt-6 flex justify-center">
        <div className="p-1 sm:p-1.5 rounded-xl bg-black/60 border border-white/15 shadow-inner">
          <img
            src="/images/developer_logo.jpg"
            alt="Dulana Chathurma"
            className="h-9 sm:h-11 md:h-12 w-auto object-contain rounded-lg"
          />
        </div>
      </div>

    </div>
  );
}
