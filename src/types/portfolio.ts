export interface ProjectOutcome {
  metric: string;
  label: string;
}

export interface Project {
  id: string;
  title: string;
  oneLiner: string;
  role: string;
  year: string;
  tags: string[];
  image: string;
  accentColor: string; // for night mode vivid gradient tile
  nightTileClass: string;
  link: string;
  overview: string;
  gallery: string[];
  outcomes: ProjectOutcome[];
  featured?: boolean;
  bentoSpan?: string; // Tailwind grid span
  category?: 'personal' | 'internship';
}

export interface StatItem {
  id: string;
  value: string;
  suffix?: string;
  label: string;
  sublabel: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
}

export interface SkillCategory {
  category: string;
  skills: { name: string; icon?: string; highlighted?: boolean }[];
}

export interface SocialLink {
  platform: string;
  handle: string;
  url: string;
  icon: string;
}

export interface PortfolioContent {
  author: {
    name: string;
    role: string;
    tagline: string;
    location: string;
    avatar: string;
    currentCompany: string;
    currentRole: string;
    bioLines: string[];
    availableForWork: boolean;
    statusText: string;
    shippedCount: number;
    email: string;
    resumeUrl: string;
  };
  headline: {
    greeting: string;
    lead: string;
    emphasis: string;
    filterPills: string[];
  };
  stats: StatItem[];
  projects: Project[];
  skills: SkillCategory[];
  experience: ExperienceItem[];
  socials: SocialLink[];
  quickLinks: { title: string; href: string; icon: string; badge?: string }[];
}
