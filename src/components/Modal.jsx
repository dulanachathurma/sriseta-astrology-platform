import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ open, title, onClose, children }) {
  const contentRef = useRef(null);
  // Tracks whether THIS modal instance pushed a history entry that still
  // needs to be consumed. Lets us tell "closed via Back button" apart from
  // "closed via X/backdrop/Escape" so we never double-navigate.
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!open) return undefined;

    document.body.style.overflow = 'hidden';

    // Push a history entry so the browser/mobile Back button closes the
    // modal and returns to the page underneath, instead of leaving the site.
    window.history.pushState({ modalOpen: true }, '');
    pushedRef.current = true;

    const onPopState = () => {
      // Back button was pressed — the browser already consumed our pushed
      // entry, so just close the modal in React state, nothing else to undo.
      pushedRef.current = false;
      onClose();
    };
    window.addEventListener('popstate', onPopState);

    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('keydown', onKey);

      // Modal is closing for a reason OTHER than Back (X button, backdrop
      // click, Escape, or a parent forcing it shut) — consume the history
      // entry we pushed so a later Back press doesn't just reopen it.
      if (pushedRef.current) {
        pushedRef.current = false;
        window.history.back();
      }
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={contentRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="glass-card relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-[2rem] p-6 md:p-10 shadow-gold-lg border-2 border-gold/25"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-gold/10 border border-gold/30 text-gold flex items-center justify-center hover:bg-gold/20 hover:rotate-90 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-sinhala text-2xl md:text-3xl text-gold font-bold text-center pb-5 mb-6 border-b border-gold/25">
              {title}
            </h3>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}