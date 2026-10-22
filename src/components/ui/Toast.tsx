import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
        >
          <div className="glass-pill px-5 py-2.5 flex items-center gap-2.5 bg-white/90 dark:bg-neutral-800/90 shadow-2xl border border-white/60 dark:border-white/20">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </span>
            <span className="text-sm font-medium text-[var(--text)] tracking-tight">
              {message}
            </span>
            <button
              onClick={onClose}
              className="ml-1 text-[var(--text-3)] hover:text-[var(--text)] transition-colors p-0.5"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
