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
  link: string;
  overview: string;
  gallery: string[];
  outcomes: ProjectOutcome[];
  featured?: boolean;
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
  kind: 'Work' | 'Education' | 'Independent';
  company: string;
  role: string;
  period: string;
  // Marks an ongoing entry whose period has an end date rather than "Present"
  current?: boolean;
  location: string;
  description: string;
  highlights: string[];
  // Project ids from `projects`, shown as links into their case studies
  projects?: string[];
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
    availableForWork: boolean;
    statusText: string;
    email: string;
    resumeUrl: string;
  };
  about: {
    lead: string;
    // Supports inline [text](url) links
    paragraphs: string[];
    facts: { label: string; value: string; detail?: string }[];
  };
  headline: {
    greeting: string;
    lead: string;
    emphasis: string;
  };
  stats: StatItem[];
  projects: Project[];
  skills: SkillCategory[];
  experience: ExperienceItem[];
  socials: SocialLink[];
  quickLinks: { title: string; description?: string; href: string; icon: string; badge?: string }[];
}
