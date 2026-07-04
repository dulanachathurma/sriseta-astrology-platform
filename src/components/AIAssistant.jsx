import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X, Send } from 'lucide-react';
import { sendAssistantMessage } from '../services/assistantApi';

const WELCOME = {
  role: 'assistant',
  text: 'ආයුබෝවන්! මම ශ්‍රී සෙත AI සහායකයා. ඔබට කුමන ආකාරයේ සහයක් අවශ්‍යද?',
};

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setSending(true);

    try {
      const reply = await sendAssistantMessage(text, messages);
      setMessages((m) => [...m, { role: 'assistant', text: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: 'සමාවන්න, දැනට AI සහායක සේවාව සම්බන්ධ කර නොමැත. කරුණාකර WhatsApp හරහා අප හා සම්බන්ධ වන්න.',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label="AI Assistant"
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-gold to-copper shadow-gold-lg flex items-center justify-center text-void"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-7 h-7" />
            </motion.span>
          ) : (
            <motion.span key="s" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Sparkles className="w-7 h-7" />
            </motion.span>
          )}
        </AnimatePresence>
        <span className="absolute inset-0 rounded-full border-2 border-gold/50 animate-ping [animation-duration:2.5s]" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ duration: 0.35 }}
            className="fixed bottom-24 right-6 z-40 w-[92vw] max-w-sm h-[70vh] max-h-[520px] glass-card rounded-3xl shadow-gold-lg flex flex-col overflow-hidden border border-gold/20"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gold/15 bg-white/5">
              <div className="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center text-gold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="font-sinhala text-gold font-semibold leading-tight">AI සහායක</p>
                <p className="text-xs text-slate-soft">Sri Seta Assistant</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`font-sinhala max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-gradient-to-r from-gold to-copper text-void rounded-br-sm'
                        : 'bg-white/8 text-ivory/90 border border-gold/10 rounded-bl-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="px-4 py-2.5 rounded-2xl bg-white/8 border border-gold/10 flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-gold"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-gold/15 bg-white/5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="පණිවිඩයක් ලියන්න..."
                className="font-sinhala flex-1 bg-white/5 border border-gold/20 rounded-full px-4 py-2.5 text-sm text-ivory placeholder:text-slate-soft/60 focus:border-gold outline-none"
              />
              <button
                type="submit"
                disabled={sending}
                className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-r from-gold to-copper text-void flex items-center justify-center disabled:opacity-50"
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}