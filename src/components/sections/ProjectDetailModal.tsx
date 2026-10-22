import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, Pin } from 'lucide-react';
import type { Project } from '../../types/portfolio';
import { IconButton } from '../ui/IconButton';
import { GlassPill } from '../ui/GlassPill';
import { DotMatrixNumber } from '../ui/DotMatrixNumber';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export function ProjectDetailModal({
  project,
  onClose,
  onPrev,
  onNext,
}: ProjectDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose, onPrev, onNext]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-0 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 dark:bg-black/75 backdrop-blur-xl"
        />

        {/* Fullscreen Glass Sheet */}
        <motion.div
          layoutId={`card-container-${project.id}`}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="relative z-10 w-full max-w-5xl min-h-screen sm:min-h-0 sm:my-8 rounded-none sm:rounded-[36px] bg-white/90 dark:bg-neutral-900/90 shadow-2xl border-0 sm:border border-white/60 dark:border-white/20 overflow-hidden flex flex-col"
        >
          {/* iOS-Style Top Bar */}
          <div className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md">
            {/* Circular Back Button */}
            <IconButton size="md" onClick={onClose} tooltip="Back to projects">
              <ArrowLeft className="w-4 h-4 stroke-[2]" />
            </IconButton>

            {/* Centered "Pinned" Capsule Pill */}
            <div className="glass-pill px-4 py-1.5 flex items-center gap-1.5 text-xs font-semibold bg-white/60 dark:bg-white/10 border-white/80 dark:border-white/20">
              <Pin className="w-3.5 h-3.5 text-orange-500 fill-orange-500/20" />
              <span>Pinned Case Study</span>
            </div>

            {/* Right: Next / Prev Circular Arrow Buttons */}
            <div className="flex items-center gap-2">
              {onPrev && (
                <IconButton size="sm" onClick={onPrev} tooltip="Previous project">
                  <ChevronLeft className="w-4 h-4" />
                </IconButton>
              )}
              {onNext && (
                <IconButton size="sm" onClick={onNext} tooltip="Next project">
                  <ChevronRight className="w-4 h-4" />
                </IconButton>
              )}
            </div>
          </div>

          {/* Modal Content Scroll Area */}
          <div className="p-6 sm:p-10 lg:p-12 space-y-10">
            {/* Title & Metadata Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <GlassPill size="sm" className="bg-orange-100 dark:bg-indigo-950 text-orange-800 dark:text-indigo-300 font-bold">
                  {project.year}
                </GlassPill>
                {project.tags.map((tag) => (
                  <GlassPill key={tag} size="sm">
                    {tag}
                  </GlassPill>
                ))}
              </div>

              <h2 className="text-3xl sm:text-5xl font-semibold text-[var(--text)] tracking-tight">
                {project.title}
              </h2>

              <p className="text-sm sm:text-base text-[var(--text-2)] font-medium mt-2">
                Role: <span className="text-[var(--text)]">{project.role}</span>
              </p>
            </div>

            {/* Horizontally Scrollable Image Carousel */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-black/5 dark:border-white/10 bg-black/5">
              <div className="aspect-[16/9] w-full overflow-hidden relative">
                <motion.img
                  key={activeImageIndex}
                  src={project.gallery[activeImageIndex] || project.image}
                  alt={`${project.title} screenshot ${activeImageIndex + 1}`}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />

                {/* Left/Right carousel arrow overlays */}
                {project.gallery.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          prev === 0 ? project.gallery.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-pill flex items-center justify-center bg-white/70 dark:bg-black/70 shadow-md hover:scale-105 active:scale-95"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          prev === project.gallery.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-pill flex items-center justify-center bg-white/70 dark:bg-black/70 shadow-md hover:scale-105 active:scale-95"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Page Dots */}
              {project.gallery.length > 1 && (
                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
                  {project.gallery.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        activeImageIndex === i
                          ? 'w-6 bg-white shadow-md'
                          : 'w-2 bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Overview & Story */}
            <div className="space-y-4 max-w-3xl">
              <span className="text-xs uppercase tracking-widest text-[var(--text-3)] font-semibold block">
                Overview & Architecture
              </span>
              <p className="text-base sm:text-lg text-[var(--text-2)] leading-relaxed font-normal">
                {project.overview}
              </p>
            </div>

            {/* Outcomes as Big Dot-Matrix Numerals */}
            <div className="pt-6 border-t border-black/5 dark:border-white/10">
              <span className="text-xs uppercase tracking-widest text-[var(--text-3)] font-semibold block mb-4">
                Key Outcomes & Performance
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {project.outcomes.map((out, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06]"
                  >
                    <div className="text-3xl sm:text-4xl text-[var(--text)] mb-1">
                      <DotMatrixNumber value={out.metric} />
                    </div>
                    <span className="text-xs text-[var(--text-2)] font-medium">
                      {out.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="glass-pill px-6 py-3 text-sm font-medium inline-flex items-center gap-2 bg-white/80 dark:bg-white/20 text-[var(--text)] hover:scale-105 active:scale-95 shadow-md"
              >
                <span>Launch project preview</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <button
                onClick={onClose}
                className="text-xs uppercase tracking-wider font-semibold text-[var(--text-3)] hover:text-[var(--text)] transition-colors cursor-pointer"
              >
                Close sheet [Esc]
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
