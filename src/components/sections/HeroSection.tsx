import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { content } from '../../content';
import { scrollToTarget } from '../../hooks/useLenis';

export function HeroSection() {
  const { headline, author } = content;

  return (
    <section
      id="hero"
      // Below lg the orb floats in the top half of the screen, so the text sits in the
      // bottom half (clear of the dock) instead of being centred over the orb's edge
      className="relative min-h-[100svh] flex flex-col justify-end lg:justify-center px-5 sm:px-8 pt-24 pb-24 sm:pb-32 lg:pb-16 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left column: Text & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(14px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, ease: [0.32, 0.72, 0, 1] }}
          className="lg:col-span-7 flex flex-col z-10"
        >
          {/* Greeting label */}
          <p className="hero-label">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" aria-hidden="true" />
            Portfolio · {author.location}
          </p>

          <h1 className="hero-title">
            <span className="block font-light opacity-90">{headline.greeting}</span>
            <span className="hero-lead">{headline.lead}</span>
          </h1>

          <p className="hero-intro">{author.tagline}</p>

          {/* CTA actions */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-8 sm:mt-10">
            <button
              type="button"
              onClick={() => scrollToTarget('#work')}
              data-cursor="Explore"
              className="glass-pill px-7 py-3.5 text-base font-medium inline-flex items-center gap-2.5 bg-white/80 text-[var(--text)] hover:scale-105 active:scale-95 shadow-lg border-white transition-all duration-300 cursor-pointer"
            >
              <span>View my work</span>
              <ArrowDown className="w-4 h-4 stroke-[2]" />
            </button>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget('#contact');
              }}
              className="hero-link group"
            >
              Get in touch
              <ArrowRight className="w-4 h-4 stroke-[1.75] transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>

        {/* Right column placeholder for 3D orb space on desktop */}
        <div className="hidden lg:block lg:col-span-5 h-[480px] pointer-events-none" />
      </div>
    </section>
  );
}
