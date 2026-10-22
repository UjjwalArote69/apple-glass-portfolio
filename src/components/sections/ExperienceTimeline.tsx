import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { content } from '../../content';
import type { ExperienceItem, Project } from '../../types/portfolio';
import { GlassCard } from '../ui/GlassCard';

interface ExperienceTimelineProps {
  onSelectProject: (project: Project) => void;
}

const EASE = [0.32, 0.72, 0, 1] as const;

export function ExperienceTimeline({ onSelectProject }: ExperienceTimelineProps) {
  const { experience } = content;
  // Periods can start with a month ("Mar 2026"), so pick out the first four-digit year
  const startYear = Math.min(...experience.map((item) => Number(item.period.match(/\d{4}/)?.[0] ?? Infinity)));

  return (
    <section id="experience" className="px-4 sm:px-8 py-24 max-w-7xl mx-auto relative z-10">
      <div className="mb-10">
        <span className="text-xs uppercase tracking-widest text-[var(--text-3)] font-semibold block mb-2">
          04 // Trajectory
        </span>
        <h2 className="text-3xl sm:text-5xl font-light text-[var(--text)] tracking-tight">
          Experience <span className="text-[var(--text-3)]">{startYear}–now</span>
        </h2>
        <p className="mt-3 text-[15px] text-[var(--text-2)] max-w-md">
          Where I&apos;ve studied and worked, and what I built along the way.
        </p>
      </div>

      <GlassCard className="p-0 about-card">
        <ol className="py-2 sm:py-4">
          {experience.map((item) => (
            <TimelineEntry key={item.id} item={item} onSelectProject={onSelectProject} />
          ))}
        </ol>
      </GlassCard>
    </section>
  );
}

interface TimelineEntryProps {
  item: ExperienceItem;
  onSelectProject: (project: Project) => void;
}

function TimelineEntry({ item, onSelectProject }: TimelineEntryProps) {
  const ref = useRef<HTMLLIElement>(null);

  // The rail fills as this entry passes the upper part of the viewport, and its node lights up once reached
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 65%', 'end 65%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 });
  const [reached, setReached] = useState(false);
  useMotionValueEvent(scrollYProgress, 'change', (value) => setReached(value > 0));

  const related = (item.projects ?? [])
    .map((id) => content.projects.find((project) => project.id === id))
    .filter((project): project is Project => Boolean(project));
  const current = item.current ?? /present/i.test(item.period);

  return (
    <li ref={ref} className="tl-entry" data-reached={reached} data-current={current}>
      <div className="tl-when">
        <span className="tl-period">{item.period.replace(/present/i, 'Now')}</span>
        <span className="tl-kind">{item.kind}</span>
        <span className="tl-place">{item.location}</span>
      </div>

      <div className="tl-rail" aria-hidden="true">
        <span className="tl-track" />
        <motion.span className="tl-fill" style={{ scaleY: fill }} />
        <span className="tl-node" />
      </div>

      <motion.div
        className="tl-body"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <h3 className="tl-org">{item.company}</h3>
        <p className="tl-role">{item.role}</p>
        <p className="tl-desc">{item.description}</p>

        {item.highlights.length > 0 && (
          <ul className="tl-points">
            {item.highlights.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        )}

        {related.length > 0 && (
          <div className="tl-projects">
            <p className="menu-label">Projects</p>
            <div className="flex flex-wrap gap-2">
              {related.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => onSelectProject(project)}
                  className="tl-chip group"
                  data-cursor="Open"
                >
                  <img src={project.image} alt="" className="tl-chip-thumb" loading="lazy" />
                  <span>{project.title.split(' — ')[0]}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.75] opacity-50 transition-opacity group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </li>
  );
}
