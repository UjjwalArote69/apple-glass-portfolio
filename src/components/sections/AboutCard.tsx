import { motion } from 'framer-motion';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { content } from '../../content';
import { scrollToTarget } from '../../hooks/useLenis';

export function AboutCard() {
  const { author } = content;

  const scrollToStory = () => scrollToTarget('#experience');

  return (
    <section id="about" className="px-4 sm:px-8 py-20 max-w-7xl mx-auto relative z-10">
      <div className="mb-4">
        <span className="text-xs uppercase tracking-widest text-[var(--text-3)] font-semibold">
          01 // Profile
        </span>
      </div>

      <GlassCard className="p-0 backdrop-blur-3xl bg-white/60 dark:bg-neutral-900/50 border-white/80 dark:border-white/10 shadow-2xl overflow-hidden">
        <div className="p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Profile Information */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-indigo-950/60 text-orange-800 dark:text-indigo-300 border border-orange-200/50 dark:border-indigo-800/40 inline-flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Full Stack AI Developer
              </span>
              <span className="text-xs text-[var(--text-3)]">·</span>
              <span className="text-xs text-[var(--text-2)]">{author.statusText}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-light text-[var(--text)] tracking-tight">
              Crafting tactile software that feels{' '}
              <span className="font-semibold text-neutral-950 dark:text-white">weightless</span>.
            </h2>

            {/* Bio lines */}
            <div className="space-y-3 text-[var(--text-2)] text-base sm:text-lg leading-relaxed font-normal">
              {author.bioLines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            {/* Key/Value Pairs with tiny grey labels (Apple Health style) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-black/5 dark:border-white/10">
              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06]">
                <span className="text-[11px] uppercase tracking-wider text-[var(--text-3)] block mb-1 font-medium">
                  Currently
                </span>
                <span className="text-sm sm:text-base font-semibold text-[var(--text)]">
                  {author.currentRole} at {author.currentCompany}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06]">
                <span className="text-[11px] uppercase tracking-wider text-[var(--text-3)] block mb-1 font-medium">
                  Based in
                </span>
                <span className="text-sm sm:text-base font-semibold text-[var(--text)] flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-orange-500" />
                  {author.location}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Embedded mini orb interactive visualizer */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full p-2 flex items-center justify-center">
              {/* Outer soft breathing glow rings */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-peach-300 via-purple-300 to-blue-200 opacity-40 blur-2xl animate-pulse" />
              
              {/* Embedded Orb Thumbnail */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full shadow-2xl overflow-hidden flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle at 35% 30%, #FFFFFF 0%, #FFD1B3 25%, #D8CCFD 55%, #A9C4FF 85%, #849FFF 100%)',
                  boxShadow: 'inset 0 2px 14px rgba(255, 255, 255, 0.9), 0 24px 60px -12px rgba(60, 40, 30, 0.25)',
                }}
              >
                {/* Highlight refraction arc */}
                <div className="absolute top-4 left-8 w-24 h-12 rounded-full bg-white/40 blur-[2px] transform -rotate-25 pointer-events-none" />
                <div className="text-center p-4 text-neutral-900/80 pointer-events-none">
                  <span className="text-[10px] uppercase font-bold tracking-widest block opacity-70">
                    Aesthetic
                  </span>
                  <span className="text-xs font-semibold tracking-tight">
                    Spatial & Tactile
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Full-width action strip at bottom */}
        <button
          onClick={scrollToStory}
          data-cursor="Timeline"
          className="w-full py-4 sm:py-5 px-8 sm:px-12 bg-black/[0.03] dark:bg-white/[0.04] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] border-t border-black/5 dark:border-white/10 flex items-center justify-between transition-colors tap-apple text-left cursor-pointer group"
        >
          <span className="text-sm sm:text-base font-medium text-[var(--text)] group-hover:translate-x-1 transition-transform">
            Read my story & career trajectory
          </span>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-2)] group-hover:text-[var(--text)]">
            <span>Explore</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </GlassCard>
    </section>
  );
}
