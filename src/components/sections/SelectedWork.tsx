import { useRef, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { content } from '../../content';
import type { Project } from '../../types/portfolio';
import { hostname } from '../../utils/url';

type Filter = 'all' | 'personal' | 'internship';

interface SelectedWorkProps {
  onSelectProject: (project: Project) => void;
}

const EASE = [0.32, 0.72, 0, 1] as const;

const CATEGORY_LABEL: Record<NonNullable<Project['category']>, string> = {
  personal: 'Personal',
  internship: 'MEKA Group',
};

export function SelectedWork({ onSelectProject }: SelectedWorkProps) {
  const { projects } = content;
  const [filter, setFilter] = useState<Filter>('all');

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: projects.length },
    { id: 'personal', label: 'Personal', count: projects.filter((p) => p.category === 'personal').length },
    { id: 'internship', label: 'MEKA Group', count: projects.filter((p) => p.category === 'internship').length },
  ];

  const visible = filter === 'all' ? projects : projects.filter((p) => p.category === filter);
  const years = projects.map((p) => Number(p.year));
  const range = `${Math.min(...years)}–${Math.max(...years)}`;

  return (
    <section id="work" className="px-4 sm:px-8 py-24 max-w-7xl mx-auto relative z-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <span className="text-xs uppercase tracking-widest text-[var(--text-3)] font-semibold block mb-2">
            02 // Work
          </span>
          <h2 className="text-3xl sm:text-5xl font-light text-[var(--text)] tracking-tight">
            Selected work <span className="text-[var(--text-3)]">{range}</span>
          </h2>
          <p className="mt-3 text-[15px] text-[var(--text-2)] max-w-md">
            Tools I&apos;ve built on my own, and the sites I shipped for MEKA Group.
          </p>
        </div>

        {/* Segmented filter */}
        <LayoutGroup id="work-filter">
          <div role="tablist" aria-label="Filter projects" className="work-filter self-start lg:self-auto">
            {filters.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f.id)}
                  className="work-filter-tab"
                  data-active={active}
                >
                  {active && (
                    <motion.span
                      layoutId="work-filter-thumb"
                      className="work-filter-thumb"
                      transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                    />
                  )}
                  <span className="relative">
                    {f.label} <span className="work-filter-count">{f.count}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </div>

      {/* Grid: the first project gets the wide featured layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              featured={i === 0}
              onSelect={() => onSelectProject(project)}
            />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

interface ProjectCardProps {
  project: Project;
  featured: boolean;
  onSelect: () => void;
}

function ProjectCard({ project, featured, onSelect }: ProjectCardProps) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const maxTilt = featured ? 3 : 5;

  // Tilt + sheen are written straight to CSS variables: no re-render per pointer move
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = tiltRef.current;
    if (!el || e.pointerType !== 'mouse') return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    el.style.setProperty('--rx', `${(0.5 - y) * 2 * maxTilt}deg`);
    el.style.setProperty('--ry', `${(x - 0.5) * 2 * maxTilt}deg`);
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
  };

  const handlePointerLeave = () => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  // Flatten the tilt first so the screenshot leaves the card from a clean rectangle
  const open = () => {
    handlePointerLeave();
    onSelect();
  };

  // Mouse users can click anywhere on the card; the title button is the keyboard/AT control
  const handleCardClick = (e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest('a, button')) return;
    open();
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, ease: EASE }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleCardClick}
      data-cursor="View"
      className={`work-card ${featured ? 'md:col-span-2' : ''}`}
      style={{ '--accent': project.accentColor } as React.CSSProperties}
      data-project-id={project.id}
      data-featured={featured}
    >
      <div ref={tiltRef} className="work-tilt">
        <div className={`work-inner ${featured ? 'lg:grid lg:grid-cols-12' : ''}`}>
          {/* Screenshot in a browser frame */}
          <div className={`work-media ${featured ? 'lg:col-span-7' : ''}`}>
            <div className="work-chrome" aria-hidden="true">
              <span className="work-chrome-dots">
                <i />
                <i />
                <i />
              </span>
              <span className="work-chrome-url">{hostname(project.link)}</span>
            </div>
            {/* Shares its layoutId with the case-study sheet: this screenshot flies into it */}
            <motion.div layoutId={`project-shot-${project.id}`} className="work-shot" style={{ borderRadius: 16 }}>
              <img
                src={project.image}
                alt={`${project.title} homepage`}
                width={1920}
                height={1125}
                loading={featured ? 'eager' : 'lazy'}
                decoding="async"
              />
              <span className="work-sheen" aria-hidden="true" />
            </motion.div>
          </div>

          {/* Details */}
          <div className={`work-body ${featured ? 'lg:col-span-5 lg:justify-center' : ''}`}>
            <p className="work-meta">
              <span className="work-dot" aria-hidden="true" />
              {project.category ? CATEGORY_LABEL[project.category] : 'Project'}
              <span aria-hidden="true">·</span>
              {project.year}
            </p>

            <h3 className={`work-title ${featured ? 'lg:text-[2rem]' : ''}`}>
              <button type="button" onClick={open} className="work-open" data-cursor="View">
                {project.title}
              </button>
            </h3>

            <p className={`work-desc ${featured ? '' : 'line-clamp-2'}`}>{project.oneLiner}</p>

            <div className="work-footer">
              <ul className="work-tags" aria-label="Tags">
                {project.tags.slice(0, featured ? 4 : 3).map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="work-live"
                data-cursor="Visit"
                aria-label={`Open ${project.title} live site`}
              >
                Live
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
