import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import { developer } from '../data/developer';

export default function DeveloperProfile() {
  return (
    <div className="w-full text-center">
      
      {/* Profile Photo */}
      <div className="relative w-24 h-24 mx-auto mb-3">
        <div className="w-full h-full rounded-full p-[2px] bg-gradient-to-br from-[#FACC15] to-white/30 shadow-md">
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
      <h3 className="text-xl font-bold text-white tracking-wide">
        {developer.name}
      </h3>
      <p className="text-[#FACC15] text-[11px] font-medium my-1 max-w-xs mx-auto leading-tight">
        {developer.role}
      </p>

      {/* Contact Box (Email Single Line Fix) */}
      <div className="my-3 bg-white/5 border border-white/10 rounded-xl p-2.5 space-y-1.5 text-white/90">
        <a 
          href={`mailto:${developer.email}`} 
          className="flex items-center justify-center gap-1.5 hover:text-[#FACC15] transition-colors text-[11px] sm:text-xs tracking-tight whitespace-nowrap overflow-hidden text-ellipsis"
        >
          <Mail className="w-3.5 h-3.5 text-[#FACC15] shrink-0" /> 
          <span className="truncate">{developer.email}</span>
        </a>
        <a 
          href={`tel:${developer.phone.replace(/\s+/g, '')}`} 
          className="flex items-center justify-center gap-1.5 hover:text-[#FACC15] transition-colors text-xs"
        >
          <Phone className="w-3.5 h-3.5 text-[#FACC15] shrink-0" /> 
          <span>{developer.phone}</span>
        </a>
      </div>

      {/* Social Icons Grid */}
      <div className="grid grid-cols-4 gap-2 pt-1">
        {developer.links.map(({ label, href, icon: Icon, external }) => (
          <a
            key={label}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            aria-label={label}
            className="flex items-center justify-center h-10 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-[#FACC15] hover:text-black hover:border-[#FACC15] transition-all"
          >
            <Icon className="w-4 h-4" />
          </a>
        ))}
      </div>

    </div>
  );
}
