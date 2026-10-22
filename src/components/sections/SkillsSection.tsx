import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { content } from '../../content';

export function SkillsSection() {
  const { skills } = content;

  return (
    <section id="skills" className="px-4 sm:px-8 py-24 max-w-7xl mx-auto relative z-10 overflow-hidden">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-widest text-[var(--text-3)] font-semibold block mb-2">
          03 // Competencies
        </span>
        <h2 className="text-3xl sm:text-5xl font-light text-[var(--text)] tracking-tight">
          Tools, Systems <span className="font-semibold text-neutral-950 dark:text-white">& Principles</span>
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-2)] mt-3 font-normal">
          Floating craft capsules spanning spatial human interface design, custom shader pipelines, and mathematical physics.
        </p>
      </div>

      {/* Floating Marquee Rows with Depth */}
      <div className="space-y-6">
        {skills.map((category, rowIndex) => {
          // Double items for seamless infinite marquee drift
          const doubleSkills = [...category.skills, ...category.skills];
          const direction = rowIndex % 2 === 0 ? 1 : -1;

          return (
            <div key={category.category} className="relative">
              {/* Category label */}
              <div className="flex items-center gap-2 mb-2 px-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-3)]">
                  {category.category}
                </span>
                <div className="h-[1px] flex-1 bg-black/5 dark:bg-white/10" />
              </div>

              {/* Drifting Row */}
              <div className="overflow-hidden mask-gradient-x py-2">
                <motion.div
                  animate={{
                    x: direction === 1 ? [0, -600] : [-600, 0],
                  }}
                  transition={{
                    duration: 32 + rowIndex * 6,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="flex gap-3 sm:gap-4 w-max"
                >
                  {doubleSkills.map((skill, i) => (
                    <motion.div
                      key={`${skill.name}-${i}`}
                      whileHover={{
                        scale: 1.08,
                        y: -4,
                        boxShadow: '0 16px 36px -10px rgba(60, 40, 30, 0.22)',
                      }}
                      className={`glass-pill px-4 sm:px-5 py-2 sm:py-2.5 flex items-center gap-2 text-xs sm:text-sm font-medium cursor-pointer transition-all duration-300 select-none ${
                        skill.highlighted
                          ? 'bg-white/80 dark:bg-white/20 text-[var(--text)] border-orange-200/60 dark:border-indigo-400/30'
                          : 'bg-white/45 dark:bg-white/5 text-[var(--text-2)]'
                      }`}
                    >
                      {skill.highlighted ? (
                        <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-black/20 dark:bg-white/30" />
                      )}
                      <span>{skill.name}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
