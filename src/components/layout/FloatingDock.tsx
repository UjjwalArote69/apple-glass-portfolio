import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Home, Layers, User, Briefcase, Mail } from 'lucide-react';
import { scrollToTarget } from '../../hooks/useLenis';

interface DockItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

// Same order as the sections on the page, so the bubble only ever slides one way while scrolling
const dockItems: DockItem[] = [
  { id: 'hero', label: 'Home', icon: Home, href: '#hero' },
  { id: 'about', label: 'About', icon: User, href: '#about' },
  { id: 'work', label: 'Work', icon: Layers, href: '#work' },
  { id: 'experience', label: 'Experience', icon: Briefcase, href: '#experience' },
  { id: 'contact', label: 'Contact', icon: Mail, href: '#contact' },
];

const SHOW_AFTER = 120;
// A section becomes active once its top crosses this fraction of the viewport
const ACTIVE_LINE = 0.35;
// Safety net in case a programmatic scroll never reports completion
const NAV_LOCK_TIMEOUT = 2500;

interface BubbleRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function FloatingDock() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState(false);
  const [bubble, setBubble] = useState<BubbleRect | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<string, HTMLAnchorElement>());
  const navLockRef = useRef<number | null>(null);

  const releaseNavLock = () => {
    if (navLockRef.current !== null) {
      window.clearTimeout(navLockRef.current);
      navLockRef.current = null;
    }
  };

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setIsVisible(window.scrollY > SHOW_AFTER);

      // While a dock click is scrolling, keep the clicked item highlighted
      // instead of flicking through every section in between
      if (navLockRef.current !== null) return;

      const line = window.innerHeight * ACTIVE_LINE;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

      let current = dockItems[0].id;
      if (atBottom) {
        current = dockItems[dockItems.length - 1].id;
      } else {
        let best = -Infinity;
        for (const item of dockItems) {
          const el = document.getElementById(item.id);
          if (!el) continue;
          const top = el.getBoundingClientRect().top;
          if (top <= line && top > best) {
            best = top;
            current = item.id;
          }
        }
      }
      setActiveSection(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // The user taking over the scroll cancels the lock
    const onUserScroll = () => {
      if (navLockRef.current === null) return;
      releaseNavLock();
      onScroll();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('wheel', onUserScroll, { passive: true });
    window.addEventListener('touchstart', onUserScroll, { passive: true });
    window.addEventListener('keydown', onUserScroll);
    update();

    return () => {
      cancelAnimationFrame(frame);
      releaseNavLock();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('wheel', onUserScroll);
      window.removeEventListener('touchstart', onUserScroll);
      window.removeEventListener('keydown', onUserScroll);
    };
  }, []);

  // Measure with offset* (which ignores transforms) so the dock's own entrance
  // animation and hover effects can't throw the bubble off
  useLayoutEffect(() => {
    const measure = () => {
      const el = itemRefs.current.get(activeSection);
      if (!el) return;
      setBubble({ x: el.offsetLeft, y: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight });
    };
    measure();

    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [activeSection]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, item: DockItem) => {
    e.preventDefault();
    setActiveSection(item.id);

    releaseNavLock();
    navLockRef.current = window.setTimeout(releaseNavLock, NAV_LOCK_TIMEOUT);
    scrollToTarget(item.href, { onComplete: releaseNavLock });
  };

  return (
    <motion.nav
      initial={false}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
      className={`fixed bottom-6 inset-x-0 z-40 flex justify-center pointer-events-none px-4 pb-[env(safe-area-inset-bottom)] ${
        isVisible ? '' : 'invisible'
      }`}
      style={{ transitionProperty: 'visibility', transitionDelay: isVisible ? '0s' : '0.45s' }}
      aria-label="Bottom Navigation Dock"
      aria-hidden={!isVisible}
      data-no-magnet
    >
      <div
        ref={trackRef}
        className="glass-pill dock-glass relative px-2.5 py-2 flex items-center gap-1.5 shadow-2xl pointer-events-auto"
      >
        {/* Sliding glass bubble */}
        {bubble && (
          <motion.div
            aria-hidden="true"
            className="dock-bubble absolute top-0 left-0 rounded-full"
            initial={false}
            animate={{ x: bubble.x, y: bubble.y, width: bubble.width, height: bubble.height }}
            transition={{ type: 'spring', stiffness: 520, damping: 40, mass: 0.8 }}
          />
        )}

        {dockItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <a
              key={item.id}
              ref={(el) => {
                if (el) itemRefs.current.set(item.id, el);
                else itemRefs.current.delete(item.id);
              }}
              href={item.href}
              onClick={(e) => handleClick(e, item)}
              className="relative p-2.5 sm:px-3 sm:py-2.5 rounded-full flex items-center justify-center tap-apple group select-none"
              aria-label={item.label}
              aria-current={isActive ? 'location' : undefined}
              tabIndex={isVisible ? undefined : -1}
            >
              <span
                className={`relative z-10 transition-colors duration-200 ${
                  isActive ? 'text-[var(--text)]' : 'text-[var(--text-2)] group-hover:text-[var(--text)]'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[1.5]" />
              </span>

              {/* Tooltip on hover — pure CSS, no re-render */}
              <span className="dock-tooltip absolute bottom-full left-1/2 mb-2.5 px-2 py-0.5 rounded-md text-[10px] font-medium shadow-lg pointer-events-none whitespace-nowrap">
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </motion.nav>
  );
}
