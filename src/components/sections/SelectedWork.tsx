import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { content } from '../../content';
import type { Project } from '../../types/portfolio';
import { GlassPill } from '../ui/GlassPill';
import type { Theme } from '../../hooks/useTheme';

interface SelectedWorkProps {
  theme: Theme;
  onSelectProject: (project: Project) => void;
}

export function SelectedWork({ theme, onSelectProject }: SelectedWorkProps) {
  const { projects } = content;
  const [filter, setFilter] = useState<'all' | 'personal' | 'internship'>('all');

  const filteredProjects = projects.filter((p) => {
    if (filter === 'all') return true;
    return p.category === filter;
  });

  return (
    <section id="work" className="px-4 sm:px-8 py-24 max-w-7xl mx-auto relative z-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-[var(--text-3)] font-semibold block mb-2">
            02 // Portfolio
          </span>
          <h2 className="text-3xl sm:text-5xl font-light text-[var(--text)] tracking-tight">
            Selected Work <span className="font-semibold text-neutral-950 dark:text-white">· 2024–2025</span>
          </h2>
        </div>
        <p className="text-sm text-[var(--text-2)] max-w-sm font-normal">
          Production distributed system simulators, conversational AI companions, and enterprise marine infrastructure platforms.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2.5 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer transition-all duration-300 ${
            filter === 'all'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-md scale-102'
              : 'glass-pill text-[var(--text-2)] hover:text-[var(--text)]'
          }`}
        >
          All Projects ({projects.length})
        </button>
        <button
          onClick={() => setFilter('personal')}
          className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer transition-all duration-300 ${
            filter === 'personal'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-md scale-102'
              : 'glass-pill text-[var(--text-2)] hover:text-[var(--text)]'
          }`}
        >
          Personal & AI Tools ({projects.filter((p) => p.category === 'personal').length})
        </button>
        <button
          onClick={() => setFilter('internship')}
          className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer transition-all duration-300 ${
            filter === 'internship'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-md scale-102'
              : 'glass-pill text-[var(--text-2)] hover:text-[var(--text)]'
          }`}
        >
          MEKA Group Internship ({projects.filter((p) => p.category === 'internship').length})
        </button>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-5 sm:gap-6 auto-rows-[360px] sm:auto-rows-[390px]">
        {filteredProjects.map((project) => (
          <BentoTile
            key={project.id}
            project={project}
            theme={theme}
            onSelect={() => onSelectProject(project)}
          />
        ))}
      </div>
    </section>
  );
}

interface BentoTileProps {
  project: Project;
  theme: Theme;
  onSelect: () => void;
}

function BentoTile({ project, theme, onSelect }: BentoTileProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [sheenPos, setSheenPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate max 6° tilt
    const rotX = ((y - centerY) / centerY) * -6;
    const rotY = ((x - centerX) / centerX) * 6;

    setRotateX(rotX);
    setRotateY(rotY);
    setSheenPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      layoutId={`card-container-${project.id}`}
      data-project-id={project.id}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="View"
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
      className={`glass-card p-6 sm:p-8 flex flex-col justify-between cursor-pointer group transition-transform duration-200 ease-out select-none focus:outline-none focus:ring-2 focus:ring-neutral-400/50 ${
        project.bentoSpan || 'col-span-12 lg:col-span-6'
      }`}
    >
      {/* Background Image: heavily blurred by default, sharpens on hover */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-[inherit]">
        <img
          src={project.image}
          alt={project.title}
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            isHovered
              ? 'blur-0 scale-105 opacity-90'
              : 'blur-[28px] scale-120 opacity-40 dark:opacity-25'
          }`}
        />

        {/* Night mode vivid radial gradient overlay with technical tick-mark dials */}
        {theme === 'night' && (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${project.nightTileClass} opacity-80 mix-blend-screen transition-opacity duration-500`}
          >
            {/* Fine tick mark decorative dials */}
            <div className="absolute top-4 right-4 flex items-center gap-1 opacity-40">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="w-8 h-[1px] bg-white/40" />
              <span className="text-[9px] font-mono tracking-tighter text-white">MOD.{project.year}</span>
            </div>
            <div className="absolute bottom-4 left-6 flex items-center gap-2 opacity-30">
              <div className="w-12 h-[1px] bg-white/40" />
              <span className="text-[8px] font-mono text-white">48.204 // REF</span>
            </div>
          </div>
        )}

        {/* Ambient Glass Wash */}
        <div className="absolute inset-0 bg-white/30 dark:bg-black/40 backdrop-blur-md" />

        {/* Hover Sheen Light Sweep */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.7 : 0,
            background: `radial-gradient(circle at ${sheenPos.x}% ${sheenPos.y}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 65%)`,
          }}
        />
      </div>

      {/* Top Meta: Year, Tags, and Action Button */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <GlassPill size="sm" className="bg-white/80 dark:bg-black/60 shadow-sm font-semibold">
            {project.year}
          </GlassPill>
          {project.tags.slice(0, 2).map((tag) => (
            <GlassPill
              key={tag}
              size="sm"
              className="bg-white/40 dark:bg-white/10 text-xs hidden sm:inline-flex"
            >
              {tag}
            </GlassPill>
          ))}
        </div>

        {/* Circular Action Button: links directly to live site */}
        <motion.a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          title={`Open ${project.title} live demo`}
          animate={{
            scale: isHovered ? 1.08 : 0.95,
            opacity: isHovered ? 1 : 0.85,
          }}
          className="w-11 h-11 rounded-full glass-pill flex items-center justify-center bg-white/90 dark:bg-white/20 shadow-md hover:bg-white hover:scale-110 active:scale-95 text-neutral-900 dark:text-white z-20 cursor-pointer"
        >
          <ArrowUpRight className="w-4 h-4 stroke-[2] group-hover:rotate-45 transition-transform duration-300" />
        </motion.a>
      </div>

      {/* Bottom Content: Title & One-Liner */}
      <div className="relative z-10 pt-10 pb-2">
        <div className="inline-flex items-center gap-1.5 text-xs text-[var(--text-2)] mb-1 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>{project.role}</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] tracking-tight mb-2 group-hover:translate-x-1 transition-transform duration-300">
          {project.title}
        </h3>
        <p className="text-sm sm:text-base text-[var(--text-2)] line-clamp-2 max-w-xl font-normal leading-relaxed">
          {project.oneLiner}
        </p>
      </div>
    </motion.div>
  );
}
