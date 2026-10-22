import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { LocalTime } from '../ui/LocalTime';
import { content } from '../../content';
import { scrollToTarget } from '../../hooks/useLenis';

const EASE = [0.32, 0.72, 0, 1] as const;
const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

// Renders a paragraph, turning [text](url) into external links
function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK_PATTERN)) {
    const [whole, label, href] = match;
    const index = match.index ?? 0;
    parts.push(text.slice(last, index));
    parts.push(
      <a key={index} href={href} target="_blank" rel="noreferrer" className="about-link">
        {label}
      </a>
    );
    last = index + whole.length;
  }
  parts.push(text.slice(last));
  return <>{parts.map((part, i) => <Fragment key={i}>{part}</Fragment>)}</>;
}

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, delay, ease: EASE },
});

export function AboutCard() {
  const { author, about } = content;

  return (
    <section id="about" className="px-4 sm:px-8 py-20 max-w-7xl mx-auto relative z-10">
      <div className="mb-4">
        <span className="text-xs uppercase tracking-widest text-[var(--text-3)] font-semibold">01 // About</span>
      </div>

      <GlassCard className="p-0 about-card">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Story */}
          <div className="lg:col-span-7 p-7 sm:p-12 lg:p-14">
            <motion.p {...reveal()} className="about-lead">
              <RichText text={about.lead} />
            </motion.p>

            <motion.div {...reveal(0.08)} className="about-body mt-8 space-y-5">
              {about.paragraphs.map((paragraph, i) => (
                <p key={i}>
                  <RichText text={paragraph} />
                </p>
              ))}
            </motion.div>

            <motion.div {...reveal(0.16)} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
              <button type="button" onClick={() => scrollToTarget('#work')} className="about-cta group">
                See the work
                <ArrowRight className="w-4 h-4 stroke-[1.75] transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button type="button" onClick={() => scrollToTarget('#experience')} className="about-cta about-cta-quiet group">
                Experience timeline
                <ArrowRight className="w-4 h-4 stroke-[1.75] transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>

          {/* Fact sheet */}
          <motion.aside
            {...reveal(0.12)}
            className="lg:col-span-5 p-7 sm:p-12 lg:p-14 border-t lg:border-t-0 lg:border-l about-rule"
            aria-label="Quick facts"
          >
            <dl className="about-facts">
              <div className="about-fact">
                <dt>Based in</dt>
                <dd>
                  <span className="about-fact-value">{author.location}</span>
                  <span className="about-fact-detail">
                    <LocalTime /> local time
                  </span>
                </dd>
              </div>

              {about.facts.map((fact) => (
                <div key={fact.label} className="about-fact">
                  <dt>{fact.label}</dt>
                  <dd>
                    <span className="about-fact-value">{fact.value}</span>
                    {fact.detail && <span className="about-fact-detail">{fact.detail}</span>}
                  </dd>
                </div>
              ))}

              {author.availableForWork && (
                <div className="about-fact">
                  <dt>Status</dt>
                  <dd>
                    <span className="about-fact-value inline-flex items-center gap-2">
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      {author.statusText}
                    </span>
                    <a href={`mailto:${author.email}`} className="about-fact-detail about-link w-fit">
                      {author.email}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </motion.aside>
        </div>
      </GlassCard>
    </section>
  );
}
