import { useState } from 'react';
import { motion } from 'framer-motion';
import { Handshake, ScrollText, Star, PhoneCall, Eye, LogIn, Info } from 'lucide-react';
import { services } from '../utils/constants';
import Modal from './Modal';
import ServiceForm from './ServiceForm';

const ICONS = { Handshake, ScrollText, Star };

function ServiceCard({ service, onView, index }) {
  const Icon = ICONS[service.icon] || Star;
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={{ y: -12, scale: 1.03 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 relative overflow-hidden rounded-[1.75rem] p-9 flex flex-col items-center text-center shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#FACC15]/[0.03] via-transparent to-copper/[0.05] pointer-events-none" />
      <div className="relative w-16 h-16 rounded-2xl bg-[#FACC15]/10 border border-[#FACC15]/25 flex items-center justify-center mb-6 text-[#FACC15]">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="font-sinhala text-2xl font-bold text-[#FACC15] mb-3 relative">{service.title}</h3>
      <p className="font-sinhala text-white/80 leading-relaxed mb-8 relative flex-1">
        {service.description}
      </p>
      <button
        onClick={() => onView(service)}
        className="font-sinhala relative w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#007bff] text-white font-semibold shadow-lg hover:bg-[#0056b3] transition-all"
      >
        <Eye className="w-4 h-4" /> View Template
      </button>
    </motion.div>
  );
}

function ContactCard({ onBook, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={{ y: -12, scale: 1.03 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 relative overflow-hidden rounded-[1.75rem] p-9 flex flex-col items-center text-center shadow-2xl"
    >
      <div className="relative w-16 h-16 rounded-2xl bg-[#FACC15]/10 border border-[#FACC15]/25 flex items-center justify-center mb-6 text-[#FACC15]">
        <PhoneCall className="w-8 h-8" />
      </div>
      <h3 className="font-sinhala text-2xl font-bold text-[#FACC15] mb-3">සම්බන්ධ වන්න</h3>
      <p className="font-sinhala text-white/80 leading-relaxed mb-8 flex-1">
        සේවා වෙන්කරවා ගැනීම සඳහා
      </p>
      <button
        onClick={onBook}
        className="font-sinhala w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#007bff] text-white font-semibold shadow-lg hover:bg-[#0056b3] transition-all"
      >
        <LogIn className="w-4 h-4" /> සේවා අයදුම්කරු
      </button>
    </motion.div>
  );
}

export default function ServicesSection() {
  const [activeService, setActiveService] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDefault, setBookingDefault] = useState('');

  const openBooking = (serviceType = '') => {
    setActiveService(null);
    setTimeout(() => {
      setBookingDefault(serviceType);
      setBookingOpen(true);
    }, 150);
  };

  const handleClose = () => {
    setActiveService(null);
    setBookingOpen(false);
    setTimeout(() => {
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <section id="services" className="px-5 py-24 relative">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-sinhala text-center text-4xl md:text-5xl font-bold text-[#FACC15] mb-16 relative inline-block left-1/2 -translate-x-1/2"
        >
          <span className="text-[#FACC15]/60">☾&nbsp; </span>සේවා<span className="text-[#FACC15]/60"> &nbsp;☾</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} onView={setActiveService} index={i} />
          ))}
          <ContactCard onBook={() => openBooking('')} index={services.length} />
        </div>
      </div>

      <Modal open={!!activeService} title={activeService?.title || ''} onClose={handleClose}>
        {activeService && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              {activeService.images.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`${activeService.title} ${i + 1}`}
                  className="w-full h-48 object-cover rounded-2xl border-2 border-[#FACC15]/20 shadow-lg"
                />
              ))}
            </div>
            <div className="rounded-2xl bg-white/5 border-l-4 border-[#FACC15] p-6 mb-8">
              <h4 className="font-sinhala flex items-center gap-2 text-[#FACC15] text-lg mb-3">
                <Info className="w-5 h-5" /> සේවා විස්තර:
              </h4>
              <p className="font-sinhala text-ivory/85 leading-relaxed">{activeService.detail}</p>
            </div>
            <button
              onClick={() => openBooking(activeService.id)}
              className="font-sinhala w-full flex items-center justify-center gap-2 py-4 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-semibold shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              <LogIn className="w-5 h-5" /> සේවා අයදීම
            </button>
          </div>
        )}
      </Modal>

      <Modal open={bookingOpen} title="සේවා වෙන්කරවා ගැනීම" onClose={handleClose}>
        <ServiceForm defaultServiceType={bookingDefault} />
      </Modal>
    </section>
  );
}