import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles, LogIn, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function AuthModal({ open, onClose, defaultMode = 'login' }) {
  const { login } = useAuth();
  const [mode, setMode] = useState(defaultMode); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    setMode(defaultMode);
    setError('');
    setSuccess('');
    setForm({ name: '', email: '', password: '' });
  }, [defaultMode, open]);

  const update = (key) => (e) => {
    setError('');
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
    setForm({ name: '', email: '', password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const cleanEmail = (form.email || '').toLowerCase().trim();
    if (!cleanEmail) {
      setError('කරුණාකර ඔබගේ ඊමේල් ලිපිනය (Gmail) ඇතුළත් කරන්න.');
      return;
    }

    if (!form.password) {
      setError('කරුණාකර මුරපදය (Password) ඇතුළත් කරන්න.');
      return;
    }

    if (form.password.length < 6) {
      setError('මුරපදය අවම වශයෙන් අක්ෂර 6ක් විය යුතුය.');
      return;
    }

    if (mode === 'register' && !form.name.trim()) {
      setError('කරුණාකර ඔබගේ සම්පූර්ණ නම ඇතුළත් කරන්න.');
      return;
    }

    setLoading(true);

    const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
    const body =
      mode === 'register'
        ? { name: form.name.trim(), email: cleanEmail, password: form.password }
        : { email: cleanEmail, password: form.password };

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success && data?.token) {
        login(data.token, data.user);
        setSuccess(
          data.message ||
            (mode === 'register'
              ? 'ගිණුම සාර්ථකව නිර්මාණය කරන ලදී!'
              : 'සාර්ථකව ප්‍රවේශ විය!')
        );

        setTimeout(() => {
          onClose('success');
        }, 600);
        return;
      }

      // Display specific API error message
      if (data?.message) {
        setError(data.message);
      } else {
        setError(
          mode === 'register'
            ? 'ලියාපදිංචි වීමේදී දෝෂයක් ඇති විය. කරුණාකර නැවත උත්සාහ කරන්න.'
            : 'ඊමේල් හෝ මුරපදය වැරදිය. නැවත උත්සාහ කරන්න.'
        );
      }
    } catch (err) {
      console.error('Auth request failed:', err);
      setError('සම්බන්ධතා දෝෂයක්. කරුණාකර ඔබගේ අන්තර්ජාල සම්බන්ධතාවය පරීක්ෂා කරන්න.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
        onClick={() => onClose('cancelled')}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md my-8 rounded-3xl overflow-hidden shadow-2xl bg-[#0D0F24]/95 border border-white/20 p-6 md:p-8 text-white"
        >
          {/* Subtle top glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FACC15] via-[#F59E0B] to-[#06B6D4]" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#FACC15]/15 blur-[60px] pointer-events-none rounded-full" />

          {/* Close Button */}
          <button
            onClick={() => onClose('cancelled')}
            className="absolute top-5 right-5 p-2 rounded-full text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6 pt-2">
            <div className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/15 mb-3 shadow-inner">
              <Sparkles className="w-6 h-6 text-[#FACC15]" />
            </div>
            <h3 className="font-sinhala text-2xl font-bold text-white mb-1">
              {mode === 'login' ? 'ගිණුමට පිවිසෙන්න' : 'නව ගිණුමක් අරඹන්න'}
            </h3>
            <p className="font-sinhala text-xs text-white/60">
              {mode === 'login'
                ? 'ඔබගේ පුද්ගලික හඳහන් පලාපල වාර්තාව බැලීමට ලොගින් වන්න'
                : 'ආරක්ෂිතව ඔබගේ කේන්ද්‍ර විස්තර තැන්පත් කරගැනීමට ලියාපදිංචි වන්න'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex p-1 rounded-2xl bg-white/5 border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 py-2.5 rounded-xl text-xs md:text-sm font-semibold font-sinhala transition-all cursor-pointer flex items-center justify-center gap-2 ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-[#FACC15] to-[#F59E0B] text-[#0A0B1E] font-bold shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              ලොගින් (Login)
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`flex-1 py-2.5 rounded-xl text-xs md:text-sm font-semibold font-sinhala transition-all cursor-pointer flex items-center justify-center gap-2 ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-[#FACC15] to-[#F59E0B] text-[#0A0B1E] font-bold shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              ලියාපදිංචිය (Register)
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs font-sinhala mb-4"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs font-sinhala mb-4"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-sinhala text-white/70 mb-1.5">
                  සම්පූර්ණ නම (Full Name)
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={update('name')}
                    placeholder="සුනිල් පෙරේරා"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-[#FACC15]/60 focus:bg-white/10 outline-none text-sm text-white placeholder:text-white/30 font-sinhala transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-sinhala text-white/70 mb-1.5">
                ඊමේල් ලිපිනය (Gmail / Email)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={update('email')}
                  placeholder="example@gmail.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-[#FACC15]/60 focus:bg-white/10 outline-none text-sm text-white placeholder:text-white/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sinhala text-white/70 mb-1.5">
                මුරපදය (Password)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={update('password')}
                  placeholder="••••••••"
                  autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-[#FACC15]/60 focus:bg-white/10 outline-none text-sm text-white placeholder:text-white/30 transition-all tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === 'register' && (
                <p className="font-sinhala text-[11px] text-white/40 mt-1">
                  අවම වශයෙන් අක්ෂර 6ක් ඇතුළත් කරන්න
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-sinhala font-bold text-sm bg-gradient-to-r from-[#FACC15] via-[#F59E0B] to-[#06B6D4] text-[#0A0B1E] shadow-lg hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0A0B1E] border-t-transparent rounded-full animate-spin" />
                  <span>සකසමින් පවතී...</span>
                </>
              ) : (
                <>
                  {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  <span>{mode === 'login' ? 'ප්‍රවේශ වන්න (Login)' : 'ලියාපදිංචි වන්න (Register)'}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Notice */}
          <div className="mt-5 pt-4 border-t border-white/10 text-center">
            <p className="font-sinhala text-xs text-white/50">
              {mode === 'login' ? (
                <>
                  ගිණුමක් නොමැතිද?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('register')}
                    className="text-[#FACC15] hover:underline font-bold ml-1 cursor-pointer"
                  >
                    මෙහි ලියාපදිංචි වන්න
                  </button>
                </>
              ) : (
                <>
                  දැනටමත් ගිණුමක් තිබේද?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="text-[#FACC15] hover:underline font-bold ml-1 cursor-pointer"
                  >
                    මෙහි ලොගින් වන්න
                  </button>
                </>
              )}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
