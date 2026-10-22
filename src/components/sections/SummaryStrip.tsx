import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { DotMatrixNumber } from '../ui/DotMatrixNumber';
import { content } from '../../content';

export function SummaryStrip() {
  const { stats } = content;

  return (
    <section className="px-4 sm:px-8 py-10 max-w-7xl mx-auto relative z-10">
      <GlassCard className="p-6 sm:p-8 backdrop-blur-3xl bg-white/50 dark:bg-neutral-900/40 border-white/70 dark:border-white/10 shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-black/5 dark:divide-white/10">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.32, 0.72, 0, 1] }}
              className={`flex flex-col justify-center ${idx > 0 ? 'pt-4 sm:pt-0 sm:pl-6' : ''}`}
            >
              {/* iOS Health Dashboard tiny grey label */}
              <span className="text-[11px] uppercase tracking-wider text-[var(--text-2)] font-medium mb-1">
                {stat.label}
              </span>

              {/* Big Dot-Matrix Numeral */}
              <div className="flex items-baseline text-3xl sm:text-4xl md:text-5xl text-[var(--text)]">
                <DotMatrixNumber value={stat.value} suffix={stat.suffix} />
              </div>

              {/* Sub-label description */}
              <span className="text-xs text-[var(--text-3)] mt-1.5 font-normal">
                {stat.sublabel}
              </span>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </section>
  );
}
