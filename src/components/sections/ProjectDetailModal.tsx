import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { X, ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Project } from '../../types/portfolio';
import { content } from '../../content';
import { lockScroll, unlockScroll } from '../../hooks/useLenis';
import { hostname } from '../../utils/url';

interface ProjectDetailModalProps {
  project: Project | null;
  // True when opened from a Work card, whose screenshot can morph into the sheet
  sharedElement?: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

const EASE = [0.32, 0.72, 0, 1] as const;
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const CATEGORY_LABEL: Record<NonNullable<Project['category']>, string> = {
  personal: 'Personal project',
  internship: 'MEKA Group',
};

const pad = (n: number) => String(n).padStart(2, '0');

export function ProjectDetailModal({ project, sharedElement = false, onClose, onPrev, onNext }: ProjectDetailModalProps) {
  // The sheet lives inside AnimatePresence so closing plays its exit animation.
  // A constant key keeps one sheet mounted while prev/next swap the project inside it.
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {project && (
          <ProjectSheet
            key="project-sheet"
            project={project}
            sharedElement={sharedElement}
            onClose={onClose}
            onPrev={onPrev}
            onNext={onNext}
          />
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

interface ProjectSheetProps {
  project: Project;
  sharedElement: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

function ProjectSheet({ project, sharedElement, onClose, onPrev, onNext }: ProjectSheetProps) {
  // The screenshot shares a layoutId with the card that was clicked, so it flies in and back out.
  // Once the visitor moves to another project that link is dropped and closing is a plain fade.
  const [originId] = useState(project.id);
  const [morph, setMorph] = useState(sharedElement);
  const [direction, setDirection] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const { projects } = content;
  const index = projects.findIndex((p) => p.id === project.id);
  const next = projects[(index + 1) % projects.length];

  const goPrev = () => {
    if (!onPrev) return;
    setMorph(false);
    setDirection(-1);
    onPrev();
  };
  const goNext = () => {
    if (!onNext) return;
    setMorph(false);
    setDirection(1);
    onNext();
  };

  // Lock the page and remember the trigger (layout effect: before focus moves inside)
  useLayoutEffect(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    lockScroll();
    return unlockScroll;
  }, []);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    // Passive cleanup so React's post-commit focus restore can't undo it
    return () => returnFocusRef.current?.focus({ preventScroll: true });
  }, []);

  // New project: start reading from the top
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [project.id]);

  // Keep the latest handlers for the window listener without re-binding it
  const keysRef = useRef({ onClose, goPrev, goNext });
  useLayoutEffect(() => {
    keysRef.current = { onClose, goPrev, goNext };
  });
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') keysRef.current.onClose();
      else if (e.key === 'ArrowLeft') keysRef.current.goPrev();
      else if (e.key === 'ArrowRight') keysRef.current.goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Keep Tab inside the dialog
  const trapFocus = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !sheetRef.current) return;
    const focusables = Array.from(sheetRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
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
  };

  const closeOnOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        className="sheet-backdrop absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        aria-hidden="true"
      />

      <motion.div
        ref={scrollRef}
        layoutScroll
        data-lenis-prevent
        className="absolute inset-0 overflow-y-auto overscroll-contain"
        onClick={closeOnOutside}
      >
        <div className="sheet-frame" onClick={closeOnOutside}>
          <motion.div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-title"
            onKeyDown={trapFocus}
            className="sheet"
            initial={{ opacity: 0, y: 56 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40, transition: { duration: 0.28, ease: EASE } }}
            transition={{ type: 'spring', stiffness: 260, damping: 32, mass: 0.9 }}
          >
            {/* Sticky bar */}
            <div className="sheet-bar">
              <button ref={closeRef} type="button" onClick={onClose} aria-label="Close project" className="menu-icon-btn w-10 h-10">
                <X className="w-4 h-4 stroke-[1.75]" />
              </button>
              <p className="sheet-counter" aria-live="polite">
                <span>{pad(index + 1)}</span> / {pad(projects.length)}
              </p>
              <div className="flex items-center gap-2">
                <button type="button" onClick={goPrev} aria-label="Previous project" className="menu-icon-btn w-10 h-10">
                  <ChevronLeft className="w-4 h-4 stroke-[1.75]" />
                </button>
                <button type="button" onClick={goNext} aria-label="Next project" className="menu-icon-btn w-10 h-10">
                  <ChevronRight className="w-4 h-4 stroke-[1.75]" />
                </button>
              </div>
            </div>

            {/* Screenshot. Deliberately outside the prev/next AnimatePresence below: the shared
                element must see the sheet's own exit to hand back to the card immediately. */}
            <div className="sheet-media">
              <div className="work-chrome" aria-hidden="true">
                <span className="work-chrome-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="work-chrome-url">{hostname(project.link)}</span>
              </div>
              <motion.div
                key={morph ? 'shared' : 'local'}
                layoutId={morph ? `project-shot-${originId}` : undefined}
                className="sheet-shot"
                style={{ borderRadius: 18 }}
                transition={{ type: 'spring', stiffness: 220, damping: 30 }}
              >
                <AnimatePresence initial={false}>
                  <motion.img
                    key={project.id}
                    src={project.image}
                    alt={`${project.title} homepage`}
                    width={1920}
                    height={1125}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  />
                </AnimatePresence>
              </motion.div>
            </div>

            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={project.id}
                custom={direction}
                variants={{
                  enter: (d: number) => ({ opacity: 0, x: d * 36 }),
                  center: { opacity: 1, x: 0 },
                  exit: (d: number) => ({ opacity: 0, x: d * -36 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2, ease: EASE }}
                style={{ '--accent': project.accentColor } as React.CSSProperties}
              >
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.5, ease: EASE }}
                >
                  {/* Title */}
                  <header className="px-6 sm:px-10 pt-8">
                    <p className="work-meta">
                      <span className="work-dot" aria-hidden="true" />
                      {project.category ? CATEGORY_LABEL[project.category] : 'Project'}
                      <span aria-hidden="true">·</span>
                      {project.year}
                    </p>
                    <h2 id="sheet-title" className="sheet-title">
                      {project.title}
                    </h2>
                    <p className="sheet-lead">{project.oneLiner}</p>
                    <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="about-cta" data-cursor="Visit">
                        Visit live site
                        <ArrowUpRight className="w-4 h-4 stroke-[1.75]" />
                      </a>
                      <span className="text-[13px] text-[var(--text-3)]">{hostname(project.link)}</span>
                    </div>
                  </header>

                  {/* Overview + facts */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-6 sm:px-10 py-10">
                    <div className="lg:col-span-7">
                      <p className="menu-label">Overview</p>
                      <p className="sheet-body">{project.overview}</p>
                    </div>
                    <dl className="about-facts lg:col-span-5">
                      <div className="about-fact">
                        <dt>Role</dt>
                        <dd>
                          <span className="about-fact-value">{project.role}</span>
                        </dd>
                      </div>
                      <div className="about-fact">
                        <dt>Year</dt>
                        <dd>
                          <span className="about-fact-value">{project.year}</span>
                        </dd>
                      </div>
                      <div className="about-fact">
                        <dt>Built with</dt>
                        <dd>
                          <ul className="work-tags mt-0.5">
                            {project.tags.map((tag) => (
                              <li key={tag}>{tag}</li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Highlights */}
                  {project.outcomes.length > 0 && (
                    <div className="px-6 sm:px-10 pb-10">
                      <p className="menu-label">Highlights</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {project.outcomes.map((outcome) => (
                          <div key={outcome.label} className="sheet-stat">
                            <span className="sheet-stat-value">{outcome.metric}</span>
                            <span className="sheet-stat-label">{outcome.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Next project teaser */}
            {onNext && next && (
              <button type="button" onClick={goNext} className="sheet-next group">
                <img src={next.image} alt="" className="sheet-next-thumb" />
                <span className="flex-1 min-w-0">
                  <span className="menu-label block mb-1">Next project</span>
                  <span className="sheet-next-title">{next.title}</span>
                </span>
                <ArrowRight className="w-5 h-5 stroke-[1.5] shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
