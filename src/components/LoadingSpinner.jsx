import { Sparkles } from 'lucide-react';

export default function LoadingSpinner({ label = 'පූරණය වෙමින්...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-gold/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold animate-spin" />
        <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-gold" />
      </div>
      <p className="font-sinhala text-sm text-slate-soft">{label}</p>
    </div>
  );
}
