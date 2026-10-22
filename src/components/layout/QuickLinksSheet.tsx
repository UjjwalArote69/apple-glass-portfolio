import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { X, ArrowRight, ArrowUpRight, Copy, Check } from 'lucide-react';
import { content } from '../../content';
import { lockScroll, unlockScroll, scrollToTarget } from '../../hooks/useLenis';
import { getActiveSection } from '../../utils/activeSection';
import { SocialIcon } from '../ui/BrandIcons';
import { LocalTime } from '../ui/LocalTime';

interface QuickLinksSheetProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const EASE = [0.32, 0.72, 0, 1] as const;
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const SHORTCUT = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘K' : 'Ctrl K';
const sectionIds = content.quickLinks.map((link) => link.href.slice(1));

export function QuickLinksSheet({ isOpen, onOpen, onClose }: QuickLinksSheetProps) {
  // ⌘K / Ctrl+K toggles the menu from anywhere
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onOpen();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [isOpen, onOpen, onClose]);

  // Freeze the page behind the menu. Layout effect so the trigger is captured
  // before the panel's own effect moves focus inside.
  const returnFocusRef = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    if (!isOpen) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    lockScroll();
    return unlockScroll;
  }, [isOpen]);

  // Hand focus back to the trigger. This must be a passive effect: during the commit
  // React restores focus to the still-mounted (exiting) menu link, which would undo it.
  useEffect(() => {
    if (!isOpen) return;
    return () => {
      returnFocusRef.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {isOpen && (
          <div key="quick-menu" className="fixed inset-0 z-50">
            <motion.div
              className="menu-backdrop absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              onClick={onClose}
            />
            <div className="relative h-full max-w-7xl mx-auto px-3 sm:px-8 py-3 sm:py-4 flex items-start pointer-events-none">
              <MenuPanel onClose={onClose} />
            </div>
          </div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

function MenuPanel({ onClose }: { onClose: () => void }) {
  const { author, socials, quickLinks } = content;
  const panelRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const copyTimer = useRef<number | undefined>(undefined);
  const [activeId] = useState(() => getActiveSection(sectionIds));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const target = linkRefs.current[Math.max(0, sectionIds.indexOf(activeId ?? ''))];
    target?.focus({ preventScroll: true });
    return () => window.clearTimeout(copyTimer.current);
  }, [activeId]);

  const navigate = (href: string) => {
    onClose();
    // Release the scroll lock now so Lenis accepts the programmatic scroll
    unlockScroll();
    scrollToTarget(href);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(author.email).then(() => {
      setCopied(true);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }

    // Keep Tab inside the dialog
    if (e.key === 'Tab' && panelRef.current) {
      const focusables = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
      return;
    }

    if (e.metaKey || e.ctrlKey || e.altKey) return;

    // Number keys jump straight to a section
    const index = Number(e.key) - 1;
    if (Number.isInteger(index) && index >= 0 && index < quickLinks.length) {
      e.preventDefault();
      navigate(quickLinks[index].href);
      return;
    }

    // Arrow keys move between sections
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const links = linkRefs.current.filter(Boolean) as HTMLAnchorElement[];
      const current = links.indexOf(document.activeElement as HTMLAnchorElement);
      const step = e.key === 'ArrowDown' ? 1 : -1;
      const next = current === -1 ? 0 : (current + step + links.length) % links.length;
      links[next]?.focus();
    }
  };

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-menu-title"
      onKeyDown={handleKeyDown}
      data-lenis-prevent
      className="menu-panel pointer-events-auto w-full sm:max-w-[880px] max-h-full overflow-y-auto overscroll-contain"
      style={{ transformOrigin: 'top left' }}
      initial={{ opacity: 0, scale: 0.9, y: -12, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.96, y: -8, filter: 'blur(6px)', transition: { duration: 0.22, ease: EASE } }}
      transition={{ type: 'spring', stiffness: 380, damping: 34, mass: 0.9 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 pt-4 pb-4">
        <div className="flex items-center gap-3.5">
          <button type="button" onClick={onClose} aria-label="Close menu" className="menu-icon-btn w-11 h-11">
            <X className="w-4 h-4 stroke-[1.75]" />
          </button>
          <div>
            <p className="text-[10.5px] uppercase tracking-[0.16em] font-semibold text-[var(--text-3)]">Quick directory</p>
            <h2 id="quick-menu-title" className="font-serif italic text-2xl leading-tight text-[var(--text)]">
              Where to next?
            </h2>
          </div>
        </div>
        <span className="hidden sm:inline-flex">
          <kbd className="menu-kbd">Esc</kbd>
        </span>
      </div>

      <div className="grid sm:grid-cols-[1.4fr_1fr] border-t menu-divider">
        {/* Section links */}
        <nav aria-label="Sections" className="p-2 sm:p-3">
          <ul>
            {quickLinks.map((link, i) => {
              const isActive = activeId === link.href.slice(1);
              return (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.045, duration: 0.5, ease: EASE }}
                >
                  <a
                    ref={(el) => {
                      linkRefs.current[i] = el;
                    }}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(link.href);
                    }}
                    aria-current={isActive ? 'location' : undefined}
                    className="menu-link group"
                  >
                    <span className="menu-index font-doto" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="flex items-center gap-2.5">
                        <span className="menu-title">{link.title}</span>
                        <span className="menu-dot" aria-hidden="true" />
                        {link.badge && <span className="menu-badge">{link.badge}</span>}
                      </span>
                      {link.description && <span className="menu-desc">{link.description}</span>}
                    </span>
                    <ArrowRight className="menu-arrow w-5 h-5 stroke-[1.5]" aria-hidden="true" />
                  </a>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* Profile and contact */}
        <motion.aside
          className="flex flex-col gap-5 p-5 sm:p-6 border-t sm:border-t-0 sm:border-l menu-divider"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.16, duration: 0.55, ease: EASE }}
        >
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-[var(--text)] truncate">{author.name}</p>
            <p className="text-xs text-[var(--text-2)] truncate">{author.role}</p>
          </div>

          {author.availableForWork && (
            <div className="menu-status">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>{author.statusText}</span>
            </div>
          )}

          <div>
            <p className="menu-label">Email</p>
            <div className="flex items-center gap-2">
              <a href={`mailto:${author.email}`} className="menu-email truncate">
                {author.email}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                aria-label={copied ? 'Email copied' : 'Copy email address'}
                className="menu-icon-btn w-8 h-8 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <p className="menu-label">Elsewhere</p>
            <ul className="-mx-2">
              {socials.filter((social) => social.url && social.url !== '#').map((social) => (
                <li key={social.platform}>
                  <a href={social.url} target="_blank" rel="noreferrer" className="contact-social group">
                    <span className="contact-social-icon">
                      <SocialIcon platform={social.platform} />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium text-[var(--text)]">{social.platform}</span>
                      <span className="block text-[12.5px] text-[var(--text-2)] truncate">{social.handle}</span>
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-[var(--text-3)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-auto text-xs text-[var(--text-3)]">
            {author.location} · <LocalTime /> IST
          </p>
        </motion.aside>
      </div>

      {/* Keyboard hints */}
      <div className="hidden sm:flex items-center justify-between px-6 py-3 border-t menu-divider text-[11px] text-[var(--text-3)]">
        <span className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <kbd className="menu-kbd">↑</kbd>
            <kbd className="menu-kbd">↓</kbd> move
          </span>
          <span className="flex items-center gap-1">
            <kbd className="menu-kbd">1</kbd>–<kbd className="menu-kbd">{quickLinks.length}</kbd> jump
          </span>
          <span className="flex items-center gap-1">
            <kbd className="menu-kbd">↵</kbd> open
          </span>
        </span>
        <span className="flex items-center gap-1">
          <kbd className="menu-kbd">{SHORTCUT}</kbd> toggle menu
        </span>
      </div>
    </motion.div>
  );
}
