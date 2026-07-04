import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, MessageCircle, Info } from 'lucide-react';
import { serviceTypeOptions, serviceName, SITE } from '../utils/constants';

const initialForm = {
  serviceType: '',
  fullName: '',
  phoneNumber: '',
  birthDetails: '',
  additionalInfo: '',
};

export default function ServiceForm({ defaultServiceType = '' }) {
  const [form, setForm] = useState({ ...initialForm, serviceType: defaultServiceType });
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const timestamp = new Date().toLocaleString('si-LK');

    const message = `Sri seta Astrology - සේවා අයදුම්පත

-> සේවා වර්ගය: ${serviceName(form.serviceType)}

-> නම: ${form.fullName}
-> දුරකථන: ${form.phoneNumber}
-> උපන් විස්තර: ${form.birthDetails}
-> අමතර තොරතුරු: ${form.additionalInfo}

-> යොමු කළ දිනය: ${timestamp}

-> ඔබගේ අයදුම්පත ලැබී ඇත.

-> මේ සමග ඔබේ ජන්මපත්‍රයේ ජායාරූපයක් අපට එවන්න.

-> අපගේ ජෝතීර්වේදිනී සමරවීර මහත්මිය ඔබට සම්බන්ධ වනු ඇත.

-> ඔබට ගුණාත්මක සේවාවක් ලබාදීමට අපි බලාපොරොත්තු වෙමු.

 ස්තුතියි!`;

    const url = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
    setWhatsappUrl(url);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-4"
      >
        <CheckCircle2 className="w-16 h-16 text-[#25D366] mx-auto mb-6 animate-pulse" />
        <h3 className="font-sinhala text-2xl text-[#FACC15] mb-3">සේවා අයදුම්පත යොමු කරන ලදී! ✅</h3>
        <p className="font-sinhala text-ivory/85 leading-relaxed mb-8">
          ඔබගේ තොරතුරු සාර්ථකව ගබඩා කරන ලදී. අපගේ ජ්‍යොතිෂවේදිනී ශ්‍රියාණි සමරවීර මහත්මිය ඔබට සම්බන්ධ වනු ඇත.
        </p>

        <div className="rounded-2xl border border-[#FACC15]/20 bg-white/5 p-6">
          <h4 className="font-sinhala flex items-center justify-center gap-2 text-[#FACC15] text-lg mb-3">
            <MessageCircle className="w-5 h-5" /> WhatsApp පණිවිඩය යැවීමට:
          </h4>
          <p className="font-sinhala text-slate-soft mb-5">
            පහත බොත්තම ක්ලික් කර WhatsApp හරහා ස්වයංක්‍රීයව පණිවිඩය යවන්න.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-semibold shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            <MessageCircle className="w-5 h-5" /> WhatsApp පණිවිඩය යවන්න
          </a>
          <p className="font-sinhala text-xs text-slate-soft mt-4 flex items-center justify-center gap-1.5">
            <Info className="w-3.5 h-3.5" /> WhatsApp විවෘත කිරීමට බොත්තම ක්ලික් කරන්න
          </p>
        </div>

        <p className="font-sinhala text-sm text-slate-soft mt-6">{SITE.hours} ({SITE.everyDay})</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="font-sinhala block mb-2 text-[#FACC15] font-semibold">සේවා වර්ගය</label>
        <select
          required
          value={form.serviceType}
          onChange={update('serviceType')}
          className="font-sinhala w-full px-5 py-4 rounded-2xl bg-white/5 border-2 border-[#FACC15]/25 text-ivory focus:border-[#FACC15] outline-none transition-colors"
        >
          {serviceTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-deep">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="font-sinhala block mb-2 text-[#FACC15] font-semibold">සම්පූර්ණ නම</label>
          <input
            required
            type="text"
            placeholder="ඔබේ සම්පූර්ණ නම"
            value={form.fullName}
            onChange={update('fullName')}
            className="font-sinhala w-full px-5 py-4 rounded-2xl bg-white/5 border-2 border-[#FACC15]/25 text-ivory placeholder:text-slate-soft/60 focus:border-[#FACC15] outline-none transition-colors"
          />
        </div>
        <div>
          <label className="font-sinhala block mb-2 text-[#FACC15] font-semibold">දුරකථන අංකය</label>
          <input
            required
            type="tel"
            pattern="[0-9]{10}"
            placeholder="07X XXX XXXX"
            value={form.phoneNumber}
            onChange={update('phoneNumber')}
            className="font-sinhala w-full px-5 py-4 rounded-2xl bg-white/5 border-2 border-[#FACC15]/25 text-ivory placeholder:text-slate-soft/60 focus:border-[#FACC15] outline-none transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="font-sinhala block mb-2 text-[#FACC15] font-semibold">උපන් විස්තර</label>
        <textarea
          required
          rows={3}
          placeholder={'උපන් දිනය,උපන් වේලාව,උපන් ස්ථානය,ස්ත්‍රී/පුරුෂ භාවය\nඋදා: 1990-05-15, 08:30 AM, කොළඹ'}
          value={form.birthDetails}
          onChange={update('birthDetails')}
          className="font-sinhala w-full px-5 py-4 rounded-2xl bg-white/5 border-2 border-[#FACC15]/25 text-ivory placeholder:text-slate-soft/60 focus:border-[#FACC15] outline-none transition-colors resize-y"
        />
      </div>

      <div>
        <label className="font-sinhala block mb-2 text-[#FACC15] font-semibold">අමතර තොරතුරු</label>
        <textarea
          rows={3}
          placeholder="අවශ්‍ය අමතර තොරතුරු හෝ විශේෂ අවශ්‍යතා"
          value={form.additionalInfo}
          onChange={update('additionalInfo')}
          className="font-sinhala w-full px-5 py-4 rounded-2xl bg-white/5 border-2 border-[#FACC15]/25 text-ivory placeholder:text-slate-soft/60 focus:border-[#FACC15] outline-none transition-colors resize-y"
        />
      </div>

      <button
        type="submit"
        className="font-sinhala w-full flex items-center justify-center gap-3 py-4 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-semibold tracking-wide shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
      >
        <Send className="w-5 h-5" /> Submit &amp; WhatsApp පණිවිඩය යවන්න
      </button>

      <div className="rounded-2xl bg-white/5 border-l-4 border-[#FACC15] p-5 text-sm">
        <h4 className="font-sinhala flex items-center gap-2 text-[#FACC15] mb-2">
          <MessageCircle className="w-4 h-4" /> WhatsApp පණිවිඩය:
        </h4>
        <p className="font-sinhala text-ivory/80 leading-relaxed">
          ඔබගේ තොරතුරු යොමු කිරීමෙන් පසු WhatsApp පණිවිඩයක් ස්වයංක්‍රීයව යවනු ලැබේ. පණිවිඩයේ ඔබගේ සියලු තොරතුරු ඇතුළත් වනු ඇත.
        </p>
        <p className="font-sinhala text-ivory/80 mt-2">සැලකිය යුතුයි :</p>
        <p className="font-sinhala text-ivory/80">
          ජන්ම පත්‍ර පරීක්ෂාව ,පොරොන්දම් පරීක්ෂාව ,විවාහ මංගල නැකැත් ඇතුලු සියලුම සුබ නැකැත් සෑදීම සදහා ඔබගේ ජන්ම පත්‍ර Whats App හරහා යොමු කළ යුතුය.
        </p>
      </div>
    </form>
  );
}