import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { content } from '../../content';
import { scrollToTarget } from '../../hooks/useLenis';

export function HeroSection() {
  const { headline, author } = content;

  const scrollToWork = () => scrollToTarget('#work');

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-4 sm:px-8 pt-24 pb-16 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left column: Text & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(14px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, ease: [0.32, 0.72, 0, 1] }}
          className="lg:col-span-7 flex flex-col gap-6 z-10"
        >
          {/* Greeting label */}
          <div className="inline-flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-[var(--text-2)] font-semibold">
              Portfolio · {author.location}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
          </div>

          {/* Big light-weight headline with bold emphasis */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-light text-[var(--text)] tracking-tight leading-[1.08]">
            <span className="block opacity-90">{headline.greeting}</span>
            <span className="block mt-2 font-semibold text-black drop-shadow-sm">
              {headline.lead}
            </span>
          </h1>

          {/* CTA actions */}
          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={scrollToWork}
              data-cursor="Explore"
              className="glass-pill px-7 py-3.5 text-base font-medium inline-flex items-center gap-2.5 bg-white/80 dark:bg-white/20 text-[var(--text)] hover:scale-105 active:scale-95 shadow-lg border-white dark:border-white/30 transition-all duration-300 cursor-pointer"
            >
              <span>View my work</span>
              <ArrowDown className="w-4 h-4 stroke-[2]" />
            </button>

            <IconButton
              size="lg"
              tooltip="Open case studies"
              onClick={scrollToWork}
              data-cursor="Jump"
              className="hover:rotate-45"
            >
              <ArrowUpRight className="w-5 h-5 stroke-[1.75]" />
            </IconButton>
          </div>
        </motion.div>

        {/* Right column placeholder for 3D orb space on desktop */}
        <div className="hidden lg:block lg:col-span-5 h-[480px] pointer-events-none" />
      </div>
    </section>
  );
}
