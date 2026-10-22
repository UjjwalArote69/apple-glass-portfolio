import { LayoutGrid, Sun, Moon } from 'lucide-react';
import { GlassPill } from '../ui/GlassPill';
import { IconButton } from '../ui/IconButton';
import type { Theme } from '../../hooks/useTheme';
import { content } from '../../content';

interface TopBarProps {
  theme: Theme;
  isQuickLinksOpen: boolean;
  onToggleTheme: () => void;
  onOpenQuickLinks: () => void;
}

export function TopBar({ theme, isQuickLinksOpen, onToggleTheme, onOpenQuickLinks }: TopBarProps) {
  const { author } = content;

  return (
    <header className="fixed top-0 inset-x-0 z-40 px-4 sm:px-8 py-4 pointer-events-none transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Left: Quick links grid button */}
        <div className="flex items-center gap-3">
          <IconButton
            size="md"
            tooltip="Quick navigation (Ctrl/⌘ K)"
            aria-label="Open quick navigation"
            aria-haspopup="dialog"
            aria-expanded={isQuickLinksOpen}
            onClick={onOpenQuickLinks}
            className="shadow-sm"
          >
            <LayoutGrid className="w-4 h-4 stroke-[1.5]" />
          </IconButton>
        </div>

        {/* Right: Availability indicator, Theme toggle pill, Avatar */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Availability pill */}
          <GlassPill size="md" className="hidden md:inline-flex shadow-sm items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-[var(--text)]">Available for work</span>
          </GlassPill>

          {/* Theme Toggle Pill */}
          <button
            onClick={onToggleTheme}
            className="glass-pill px-3.5 py-2 flex items-center gap-2 text-xs font-medium cursor-pointer shadow-sm hover:scale-105 active:scale-95 transition-all duration-300"
            aria-label={`Switch to ${theme === 'daylight' ? 'Night' : 'Daylight'} mode`}
          >
            {theme === 'daylight' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500 stroke-[1.75]" />
                <span className="hidden xs:inline">Daylight</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400 stroke-[1.75]" />
                <span className="hidden xs:inline">Night</span>
              </>
            )}
          </button>

          {/* Avatar button */}
          <div className="relative group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full p-[2px] glass-pill overflow-hidden shadow-sm">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
