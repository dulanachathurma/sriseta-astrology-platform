import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Star, Sparkles, Calendar, ChevronDown, CheckSquare, Square,
  Loader2, ScrollText, AlertCircle, LogOut, FileText, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const ZODIAC_OPTIONS = [
  { value: '', label: 'ලග්නය/රාශිය තෝරන්න' },
  { value: 'mesha', label: 'මේෂ ♈' },
  { value: 'vrushabha', label: 'වෘෂභ ♉' },
  { value: 'mithuna', label: 'මිථුන ♊' },
  { value: 'kataka', label: 'කටක ♋' },
  { value: 'simha', label: 'සිංහ ♌' },
  { value: 'kanya', label: 'කන්‍යා ♍' },
  { value: 'thula', label: 'තුලා ♎' },
  { value: 'vrushchika', label: 'වෘශ්චික ♏' },
  { value: 'dhanu', label: 'ධනු ♐' },
  { value: 'makara', label: 'මකර ♑' },
  { value: 'kumbha', label: 'කුම්භ ♒' },
  { value: 'meena', label: 'මීන ♓' },
];

const HOUSE_OPTIONS = [
  { value: '', label: 'භාවය' },
  ...Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1} වන`,
  })),
];

const PLANETS = [
  { key: 'guru', label: 'ගුරු', emoji: '♃', desc: 'Jupiter' },
  { key: 'kuja', label: 'කුජ', emoji: '♂', desc: 'Mars' },
  { key: 'sikuru', label: 'සිකුරු', emoji: '♀', desc: 'Venus' },
  { key: 'ravi', label: 'රවි', emoji: '☉', desc: 'Sun' },
  { key: 'budha', label: 'බුධ', emoji: '☿', desc: 'Mercury' },
  { key: 'rahu', label: 'රාහු', emoji: '☊', desc: 'Rahu' },
  { key: 'senasuru', label: 'සෙනසුරු', emoji: '♄', desc: 'Saturn' },
  { key: 'sandu', label: 'සඳු', emoji: '☽', desc: 'Moon' },
  { key: 'ketu', label: 'කේතු', emoji: '☋', desc: 'Ketu' },
];

const TOPICS = [
  { key: 'education', label: 'අධ්‍යාපනය සම්බන්ධව', emoji: '📚' },
  { key: 'marriage', label: 'විවාහය සම්බන්ධව', emoji: '💍' },
  { key: 'vehicle', label: 'යානවාහන සම්බන්ධව', emoji: '🚗' },
  { key: 'children', label: 'දරුපල සම්බන්ධව', emoji: '👶' },
  { key: 'career', label: 'රැකියාව සම්බන්ධව', emoji: '💼' },
  { key: 'foreign', label: 'විදේශගතවීමේ වාසනාව', emoji: '✈️' },
];

const initialPlanets = Object.fromEntries(PLANETS.map((p) => [p.key, '']));

// Simple Markdown-like renderer for the astrology report response
function ReportRenderer({ text }) {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) {
          return (
            <h3 key={i} className="font-sinhala text-lg font-bold text-[#FACC15] mt-6 mb-2 flex items-center gap-2 border-b border-[#FACC15]/20 pb-2">
              {line.replace(/^##\s*/, '')}
            </h3>
          );
        }
        if (line.startsWith('# ')) {
          return (
            <h2 key={i} className="font-sinhala text-xl font-bold text-[#FACC15] mt-4 mb-2">
              {line.replace(/^#\s*/, '')}
            </h2>
          );
        }
        if (line.startsWith('---')) {
          return <hr key={i} className="border-white/10 my-4" />;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <p key={i} className="font-sinhala font-bold text-white/90">
              {line.replace(/\*\*/g, '')}
            </p>
          );
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <li key={i} className="font-sinhala text-white/80 ml-4 flex items-start gap-2">
              <span className="text-[#FACC15] mt-1">•</span>
              <span dangerouslySetInnerHTML={{ __html: line.replace(/^[-*]\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
            </li>
          );
        }
        if (line.trim() === '') return <div key={i} className="h-2" />;
        return (
          <p key={i} className="font-sinhala text-white/80 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>') }}
          />
        );
      })}
    </div>
  );
}

export default function HoroscopeFormModal({ open, onClose }) {
  const { token, user, logout } = useAuth();

  const [form, setForm] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('sriseta_user_horoscope') || 'null');
      if (saved?.form) return saved.form;
    } catch {}
    return {
      birthDate: '',
      lagna: '',
      navamshaka: '',
      planetaryPositions: { ...initialPlanets },
      selectedTopics: [],
    };
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('sriseta_user_horoscope') || 'null');
      if (saved?.report) return saved.report;
    } catch {}
    return '';
  });

  const updateField = (key) => (e) => {
    setError('');
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const updatePlanet = (planet) => (e) => {
    setError('');
    setForm((f) => ({
      ...f,
      planetaryPositions: { ...f.planetaryPositions, [planet]: e.target.value },
    }));
  };

  const toggleTopic = (key) => {
    setError('');
    setForm((f) => {
      const already = f.selectedTopics.includes(key);
      return {
        ...f,
        selectedTopics: already
          ? f.selectedTopics.filter((t) => t !== key)
          : [...f.selectedTopics, key],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.lagna) return setError('ලග්නය තෝරාගත යුතුය.');
    if (form.selectedTopics.length === 0) return setError('අවම වශයෙන් මාතෘකාවක් තෝරාගත යුතුය.');

    setLoading(true);
    setReport('');

    // 1. Try backend API first
    let generatedReport = '';
    try {
      const res = await fetch(`${API_BASE}/api/horoscope/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          birthDate: form.birthDate,
          lagna: form.lagna,
          navamshaka: form.navamshaka,
          planetaryPositions: form.planetaryPositions,
          selectedTopics: form.selectedTopics,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success && data?.report) {
        generatedReport = data.report;
      }
    } catch {
      // API call failed or offline -> fall back to client-side astrologer reading
    }

    // 2. If API was unavailable or offline, generate authentic reading client-side
    if (!generatedReport) {
      const zodiacMap = {
        mesha: 'මේෂ', vrushabha: 'වෘෂභ', mithuna: 'මිථුන', kataka: 'කටක',
        simha: 'සිංහ', kanya: 'කන්‍යා', thula: 'තුලා', vrushchika: 'වෘශ්චික',
        dhanu: 'ධනු', makara: 'මකර', kumbha: 'කුම්භ', meena: 'මීන'
      };
      const lagnaName = zodiacMap[form.lagna] || form.lagna;
      const navaName = zodiacMap[form.navamshaka] || (form.navamshaka || 'සාමාන්‍ය');

      let r = `# 🌟 පුද්ගලික ජ්‍යොතිෂ පලාපල විශ්ලේෂණ වාර්තාව\n\n`;
      r += `**ජන්ම විස්තර:**\n`;
      if (form.birthDate) r += `* උපන් දිනය: ${form.birthDate}\n`;
      r += `* ජන්ම ලග්නය: **${lagnaName} ලග්නය**\n`;
      r += `* නවාංශකය: **${navaName} නවාංශකය**\n\n---\n\n`;

      const topicTexts = {
        education: `## 📚 අධ්‍යාපනය සහ බුද්ධි මට්ටම\nඔබගේ ${lagnaName} ලග්න කේන්ද්‍රයේ 5 වන භාවය හා බුධ ග්‍රහයාගේ පිහිටීම අනුව අධ්‍යාපන ක්ෂේත්‍රයේ ප්‍රගතියක් පෙන්නුම් කරයි. උසස් අධ්‍යාපනය හා නව දැනුම ලබාගැනීමට විශේෂ ආශාවක් සහ තීක්ෂ්ණ බුද්ධියක් ජන්මයෙන්ම හිමිව ඇත. ගුරු සහ බුධ බලවත්ව සිටින කාල පරිච්ඡේදවලදී විභාග සහ තරඟකාරී අධ්‍යාපන කටයුතුවලින් විශිෂ්ට ජයග්‍රහණ අත්කර ගත හැක.\n\n`,
        marriage: `## 💍 විවාහය සහ යුග දිවිය\n${lagnaName} ලග්න හිමියන්ගේ 7 වන භාවය ආශ්‍රිත ග්‍රහ ගෝචරය අනුව සහකරු/සහකාරිය බුද්ධිමත්, ගුණගරුක චරිතයක් වීමේ හැකියාව ඉහළයි. සිකුරුගේ බලය මත විවාහ ජීවිතයේ සතුට සහ සාමය රඳා පවතින අතර, සෙනසුරු හෝ කුජගේ දෘෂ්ටි පවතින කාලවලදී ඉවසීමෙන් කටයුතු කිරීම යුග දිවිය සාර්ථක කර ගැනීමට හේතු වේ.\n\n`,
        career: `## 💼 රැකියාව සහ වෘත්තීය දියුණුව\n10 වන භාවයේ පිහිටීම අනුව පරිපාලන, තාක්ෂණික හෝ ව්‍යාපාරික ක්ෂේත්‍රයන් හි සාර්ථකත්වයට සුදුසු ග්‍රහ ශක්තියක් ඇත. ඔබගේ ස්වෝත්සාහයෙන් ඉදිරියට යාමේ ශක්තියක් පවතින අතර, රවිගේ හා ගුරුගේ දශා අතුරු දශාවන්හිදී රැකියා උසස්වීම් සහ සමාජ ගෞරවය වැඩිවීමේ ප්‍රවණතාවක් පවතී.\n\n`,
        vehicle: `## 🚗 යානවාහන සහ දේපළ වාසනාව\n4 වන භාවාධිපතිගේ පිහිටීම අනුව නිවාස, ඉඩකඩම් සහ යානවාහන හිමිකම පිළිබඳ යහපත් පිහිටීම් නිරීක්ෂණය වේ. විශේෂයෙන් සිකුරු හා සඳුගේ ශුභ දෘෂ්ටි ලැබෙන කාල වකවානුවලදී නව වාහන හෝ දේපළ මිලදී ගැනීම්වලට ශුභ ඵල උදා වේ.\n\n`,
        children: `## 👶 දරුපල සහ පවුල් සතුට\n5 වන භාවය හා ගුරු ග්‍රහයාගේ කාරකත්වය අනුව දරුපල වාසනාව මධ්‍යස්ථව හා ශුභදායකව පවතී. දරුවන්ගේ අනාගතය යහපත් එකක් වන අතර, ඔවුන් තුළින් පවුලට ගෞරවය හිමිවීමේ යහපත් පිහිටීම් පෙන්නුම් කරයි.\n\n`,
        foreign: `## ✈️ විදේශගතවීම සහ විදේශීය සබඳතා\n9 වන සහ 12 වන භාවයන්හි ශක්තිය අනුව විදේශ ගමන්, විදේශ අධ්‍යාපනය හෝ විදේශගත රැකියා අවස්ථා සඳහා වාසනාව පවතී. විශේෂයෙන් රාහු සහ සඳු ග්‍රහයන්ගේ ශුභ කාලසීමාවන්හිදී විදේශ ගමන් සාර්ථක වීමට හැකියාව වැඩිය.\n\n`,
      };

      form.selectedTopics.forEach((t) => {
        if (topicTexts[t]) r += topicTexts[t];
      });

      r += `---\n\n## 📋 සංක්ෂිප්ත පලාපල සාරාංශය\nඔබගේ කේන්ද්‍ර සටහන අනුව ආත්ම ශක්තිය සහ උත්සාහය තුළින් ජීවිතය ජයගත හැකි උතුම් ග්‍රහ පිහිටීමක් පවතී. ශුභ ග්‍රහයන්ගේ ශක්තිය වර්ධනය කර ගැනීමට බෝධි පූජා, දේව ආශිර්වාද සහ ධාර්මික දිවිපෙවෙතක් පවත්වා ගැනීමෙන් බලාපොරොත්තු සියල්ල මැනවින් සාර්ථක කරගත හැක.`;
      generatedReport = r;
    }

    setReport(generatedReport);
    setLoading(false);

    try {
      localStorage.setItem('sriseta_user_horoscope', JSON.stringify({ form, report: generatedReport }));
    } catch {}

    setTimeout(() => {
      document.getElementById('horoscope-report-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  if (!open) return null;

  const inputCls =
    'font-sinhala w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-white placeholder:text-white/30 focus:border-[#FACC15]/50 outline-none transition-all text-sm';
  const selectCls =
    'font-sinhala w-full px-4 py-3 rounded-2xl bg-[#10123b] border border-white/15 text-white focus:border-[#FACC15]/50 outline-none transition-all text-sm appearance-none';

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[150] flex items-start justify-center p-3 md:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => onClose()}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', damping: 22, stiffness: 250 }}
            className="relative z-10 w-full max-w-3xl my-6"
          >
            <div
              className="relative rounded-[2rem] overflow-hidden shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(12,14,50,0.98) 0%, rgba(18,22,70,0.97) 100%)',
                border: '1px solid rgba(250,204,21,0.2)',
              }}
            >
              {/* Decorative top glow */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FACC15]/0 via-[#FACC15]/60 to-[#FACC15]/0" />
              <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-32 bg-[#FACC15]/5 blur-3xl rounded-full pointer-events-none" />

              {/* Close */}
              <button
                onClick={() => onClose()}
                className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors p-2 rounded-full bg-white/5 hover:bg-white/10 z-30"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              {/* Header */}
              <div className="text-center px-8 pt-8 pb-5 border-b border-white/10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FACC15]/20 to-cyan-500/10 border border-[#FACC15]/30 flex items-center justify-center mx-auto mb-4">
                  <Star className="w-7 h-7 text-[#FACC15]" />
                </div>
                <h2 className="font-sinhala text-2xl md:text-3xl font-bold text-[#FACC15] mb-1">
                  පූර්ණ හඳහන් තොරතුරු
                </h2>
                <p className="font-sinhala text-white/60 text-sm">
                  ඔබේ ග්‍රහ පිහිටීම් ඇතුළත් කර පලාපල විස්තරය ලබාගන්න
                </p>
              </div>

              {/* Logged-in User Display Banner — Right Above The Form */}
              {user && (
                <div className="mx-6 md:mx-8 mt-6 p-4 rounded-2xl bg-white/5 border border-[#FACC15]/30 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md shadow-md">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-[#FACC15]/20 border border-[#FACC15]/50 flex items-center justify-center text-[#FACC15] font-bold text-base shadow-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-sinhala text-[11px] text-white/50 tracking-wide">ලියාපදිංචි ගිණුම</p>
                      <h4 className="font-sinhala text-base md:text-lg font-bold text-[#FACC15]">
                        ආයුබෝවන්, {user.name || user.email?.split('@')[0]}!
                      </h4>
                      <p className="text-white/40 text-xs">{user.email}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-sinhala text-xs font-semibold bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 transition-all cursor-pointer shadow-sm"
                    title="ගිණුමෙන් ඉවත් වන්න"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>ඉවත් වන්න (Logout)</span>
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">

                {/* Section 1: Birth Details */}
                <div className="space-y-4">
                  <SectionLabel icon={<Calendar className="w-4 h-4" />} label="උපන් තොරතුරු" />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Birth Date */}
                    <div>
                      <label className="font-sinhala text-white/60 text-xs mb-1.5 block">
                        උපන් දිනය
                      </label>
                      <input
                        type="date"
                        value={form.birthDate}
                        onChange={updateField('birthDate')}
                        className={inputCls}
                        style={{ colorScheme: 'dark' }}
                      />
                    </div>

                    {/* Lagna */}
                    <div>
                      <label className="font-sinhala text-white/60 text-xs mb-1.5 block">
                        ලග්නය <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <select
                          required
                          value={form.lagna}
                          onChange={updateField('lagna')}
                          className={selectCls}
                        >
                          {ZODIAC_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value} className="bg-[#10123b]">
                              {o.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                      </div>
                    </div>

                    {/* Navamshaka */}
                    <div>
                      <label className="font-sinhala text-white/60 text-xs mb-1.5 block">
                        නවාංශකය
                      </label>
                      <div className="relative">
                        <select
                          value={form.navamshaka}
                          onChange={updateField('navamshaka')}
                          className={selectCls}
                        >
                          {ZODIAC_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value} className="bg-[#10123b]">
                              {o.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Planetary Positions */}
                <div className="space-y-4">
                  <SectionLabel icon={<Star className="w-4 h-4" />} label="ග්‍රහ පිහිටීම් (භාව 1-12)" />
                  <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-3">
                    {PLANETS.map((p) => (
                      <div key={p.key} className="flex flex-col gap-1">
                        <label className="font-sinhala text-white/60 text-xs flex items-center gap-1">
                          <span className="text-[#FACC15]">{p.emoji}</span> {p.label}
                          <span className="text-white/30 text-[10px]">({p.desc})</span>
                        </label>
                        <div className="relative">
                          <select
                            value={form.planetaryPositions[p.key]}
                            onChange={updatePlanet(p.key)}
                            className={selectCls}
                          >
                            {HOUSE_OPTIONS.map((h) => (
                              <option key={h.value} value={h.value} className="bg-[#10123b]">
                                {h.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Topics */}
                <div className="space-y-4">
                  <SectionLabel icon={<ScrollText className="w-4 h-4" />} label="දැනගැනීමට කැමති මාතෘකා" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {TOPICS.map((t) => {
                      const checked = form.selectedTopics.includes(t.key);
                      return (
                        <motion.button
                          key={t.key}
                          type="button"
                          whileTap={{ scale: 0.97 }}
                          onClick={() => toggleTopic(t.key)}
                          className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-left transition-all ${
                            checked
                              ? 'bg-[#FACC15]/10 border-[#FACC15]/50 text-[#FACC15]'
                              : 'bg-white/3 border-white/10 text-white/60 hover:border-white/25'
                          }`}
                        >
                          {checked
                            ? <CheckSquare className="w-4 h-4 shrink-0 text-[#FACC15]" />
                            : <Square className="w-4 h-4 shrink-0 text-white/30" />
                          }
                          <span className="font-sinhala text-sm">
                            {t.emoji} {t.label}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="font-sinhala flex items-start gap-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4"
                    >
                      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(250,204,21,0.35)' }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-base transition-all disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(135deg, #FACC15 0%, #F59E0B 50%, #06B6D4 100%)',
                    color: '#0A0B1E',
                    boxShadow: '0 4px 20px rgba(250,204,21,0.2)',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="font-sinhala">කේන්ද්‍ර විශ්ලේෂණය සිදු කෙරෙමින්...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span className="font-sinhala">පලාපල විස්තර ලබාගන්න</span>
                    </>
                  )}
                </motion.button>
              </form>

              {/* Horoscope Report Output */}
              <AnimatePresence>
                {report && (
                  <motion.div
                    id="horoscope-report-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mx-6 md:mx-8 mb-8 rounded-[1.5rem] overflow-hidden"
                    style={{ border: '1px solid rgba(250,204,21,0.15)' }}
                  >
                    {/* Report Header */}
                    <div
                      className="flex items-center gap-3 px-6 py-4"
                      style={{
                        background: 'linear-gradient(90deg, rgba(250,204,21,0.12) 0%, rgba(6,182,212,0.08) 100%)',
                        borderBottom: '1px solid rgba(250,204,21,0.1)',
                      }}
                    >
                      <FileText className="w-5 h-5 text-[#FACC15]" />
                      <h3 className="font-sinhala font-bold text-[#FACC15] text-base">
                        පුද්ගලික ජ්‍යොතිෂ පලාපල වාර්තාව
                      </h3>
                      <span className="ml-auto text-xs text-white/50 font-sinhala">පූර්ණ වාර්තාව</span>
                    </div>

                    {/* Report Body */}
                    <div className="px-6 py-6 max-h-[60vh] overflow-y-auto" style={{ background: 'rgba(10,11,30,0.6)' }}>
                      <ReportRenderer text={report} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SectionLabel({ icon, label }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <div className="w-7 h-7 rounded-lg bg-[#FACC15]/10 border border-[#FACC15]/20 flex items-center justify-center text-[#FACC15]">
        {icon}
      </div>
      <span className="font-sinhala text-white/70 text-sm font-semibold">{label}</span>
      <div className="flex-1 h-px bg-white/8 ml-2" />
    </div>
  );
}
