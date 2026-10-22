import { ArrowUp } from 'lucide-react';
import { content } from '../../content';
import { GlassPill } from '../ui/GlassPill';
import { scrollToTarget } from '../../hooks/useLenis';

export function Footer() {
  const scrollToTop = () => scrollToTarget(0);

  return (
    <footer className="px-4 sm:px-8 py-12 max-w-7xl mx-auto border-t border-black/5 dark:border-white/10 relative z-10 text-xs text-[var(--text-2)] flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="font-medium text-[var(--text)]">{content.author.name}</span>
        <span>© {new Date().getFullYear()}</span>
        <span>·</span>
        <span>Designed with quiet intent in {content.author.location}</span>
      </div>

      <div className="flex items-center gap-3">
        <GlassPill
          size="sm"
          onClick={scrollToTop}
          className="text-xs bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10"
        >
          <span>Top</span>
          <ArrowUp className="w-3 h-3" />
        </GlassPill>
      </div>
    </footer>
  );
}
