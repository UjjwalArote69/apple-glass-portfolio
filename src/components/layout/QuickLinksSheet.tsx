import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers, User, Cpu, Briefcase, Mail, ArrowUpRight } from 'lucide-react';
import { content } from '../../content';
import { IconButton } from '../ui/IconButton';
import { GlassCard } from '../ui/GlassCard';

interface QuickLinksSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  layers: <Layers className="w-5 h-5 stroke-[1.5]" />,
  user: <User className="w-5 h-5 stroke-[1.5]" />,
  cpu: <Cpu className="w-5 h-5 stroke-[1.5]" />,
  briefcase: <Briefcase className="w-5 h-5 stroke-[1.5]" />,
  mail: <Mail className="w-5 h-5 stroke-[1.5]" />,
};

export function QuickLinksSheet({ isOpen, onClose }: QuickLinksSheetProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="relative z-10 w-full max-w-lg"
          >
            <GlassCard className="p-6 sm:p-8 bg-white/85 dark:bg-neutral-900/85 shadow-2xl border-white/60 dark:border-white/20">
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-black/5 dark:border-white/10">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[var(--text-3)] font-medium">Quick Directory</span>
                  <h3 className="text-xl font-semibold text-[var(--text)] tracking-tight">Navigation</h3>
                </div>
                <IconButton size="md" onClick={onClose} tooltip="Close modal">
                  <X className="w-4 h-4 stroke-[1.75]" />
                </IconButton>
              </div>

              {/* Navigation Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-6">
                {content.quickLinks.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] hover:bg-black/[0.07] dark:hover:bg-white/[0.08] transition-all duration-300 tap-apple group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[var(--text-2)] group-hover:text-[var(--text)] transition-colors">
                        {iconMap[item.icon] || <Layers className="w-5 h-5 stroke-[1.5]" />}
                      </span>
                      <span className="text-sm font-medium text-[var(--text)]">
                        {item.title}
                      </span>
                    </div>
                    {item.badge && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-orange-100 dark:bg-indigo-950/60 text-orange-700 dark:text-indigo-300 border border-orange-200/50 dark:border-indigo-800/40">
                        {item.badge}
                      </span>
                    )}
                  </a>
                ))}
              </div>

              {/* Footer info */}
              <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs text-[var(--text-2)]">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {content.author.location}
                </span>
                <a
                  href={`mailto:${content.author.email}`}
                  className="font-medium text-[var(--text)] hover:underline inline-flex items-center gap-1"
                >
                  Contact directly <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
