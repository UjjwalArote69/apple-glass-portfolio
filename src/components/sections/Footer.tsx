import { ArrowUp } from 'lucide-react';
import { content } from '../../content';
import { GlassPill } from '../ui/GlassPill';
import { scrollToTarget } from '../../hooks/useLenis';

export function Footer() {
  const scrollToTop = () => scrollToTarget(0);

  return (
    // Bottom padding keeps the footer above the floating dock, which is fixed to the bottom edge
    <footer className="px-5 sm:px-8 pt-10 pb-[calc(7.5rem+env(safe-area-inset-bottom))] max-w-7xl mx-auto border-t border-[var(--menu-divider)] site-footer relative z-10 text-xs flex flex-col sm:flex-row items-center justify-between gap-5">
      <p className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
        <span>
          <span className="font-medium text-[var(--text)]">{content.author.name}</span> © {new Date().getFullYear()}
        </span>
        <span className="hidden sm:inline" aria-hidden="true">·</span>
        <span>Designed with quiet intent in {content.author.location}</span>
      </p>

      <GlassPill size="sm" onClick={scrollToTop} className="text-xs px-4 py-2" aria-label="Back to top">
        <span>Top</span>
        <ArrowUp className="w-3 h-3" />
      </GlassPill>
    </footer>
  );
}
