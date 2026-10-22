import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Briefcase, MapPin, CheckCircle2 } from 'lucide-react';
import { content } from '../../content';
import { GlassCard } from '../ui/GlassCard';

export function ExperienceTimeline() {
  const { experience } = content;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const progressSpring = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 30,
  });

  return (
    <section
      id="experience"
      ref={containerRef}
      className="px-4 sm:px-8 py-24 max-w-5xl mx-auto relative z-10"
    >
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-widest text-[var(--text-3)] font-semibold block mb-2">
          04 // Trajectory
        </span>
        <h2 className="text-3xl sm:text-5xl font-light text-[var(--text)] tracking-tight">
          Experience <span className="font-semibold text-neutral-950 dark:text-white">& Leadership</span>
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-2)] mt-3 font-normal">
          Staff design engineering and creative technology across pioneering studios and platforms.
        </p>
      </div>

      {/* Vertical Timeline Container */}
      <div className="relative pl-6 sm:pl-10 space-y-12">
        {/* Progressing Track Line */}
        <div className="absolute left-2.5 sm:left-4 top-4 bottom-4 w-[2px] bg-black/10 dark:bg-white/10" />

        {/* Dynamic Glowing Progress Line */}
        <motion.div
          style={{ scaleY: progressSpring, transformOrigin: 'top' }}
          className="absolute left-2.5 sm:left-4 top-4 bottom-4 w-[2px] bg-gradient-to-b from-orange-400 via-purple-400 to-indigo-500 shadow-[0_0_12px_rgba(255,180,140,0.8)]"
        />

        {/* Timeline Cards */}
        {experience.map((exp, idx) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.32, 0.72, 0, 1] }}
            className="relative"
          >
            {/* Glowing Orb Marker */}
            <div className="absolute -left-6 sm:-left-10 top-6 -translate-x-1/2 w-5 h-5 rounded-full p-1 bg-white/90 dark:bg-neutral-800 shadow-md border border-white dark:border-white/20 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 shadow-sm" />
            </div>

            {/* Slim Glass Card */}
            <GlassCard className="p-6 sm:p-8 backdrop-blur-2xl bg-white/60 dark:bg-neutral-900/40 border-white/70 dark:border-white/10 hover:shadow-xl transition-all">
              {/* Header row: Company, Role, Period */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-black/5 dark:border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-orange-500" />
                    <h3 className="text-xl font-semibold text-[var(--text)] tracking-tight">
                      {exp.company}
                    </h3>
                  </div>
                  <span className="text-sm font-medium text-[var(--text-2)] mt-0.5 block">
                    {exp.role}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[var(--text-2)] font-medium">
                  <span className="px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06]">
                    {exp.period}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {exp.location}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-[var(--text-2)] font-normal mt-4 leading-relaxed">
                {exp.description}
              </p>

              {/* Highlights */}
              <ul className="mt-4 space-y-2">
                {exp.highlights.map((highlight, hIdx) => (
                  <li key={hIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-2)]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
