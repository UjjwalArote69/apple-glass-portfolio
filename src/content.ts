import type { PortfolioContent } from './types/portfolio';

export const content: PortfolioContent = {
  author: {
    name: "Ujjwal Sitaram Arote",
    role: "Full Stack AI Developer",
    tagline: "Engineering distributed systems, intelligent AI agents & calm tactile interfaces.",
    location: "Mumbai, India",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    availableForWork: true,
    statusText: "Available for AI & Full Stack Roles",
    email: "ujjwalarote69@gmail.com",
    resumeUrl: "#resume"
  },

  about: {
    lead: "I'm Ujjwal, a computer engineering student in Mumbai who builds full-stack web apps, often with AI at the core.",
    paragraphs: [
      "My own projects sit where AI, systems and interfaces meet. [Kendall](https://kendall-web.vercel.app/) lets you sketch an architecture and send simulated traffic through it to see where it breaks. [SchemaStudio](https://schema-studio.vercel.app/) turns database design into a visual canvas that writes the SQL for you. [Yapster](http://yapster-2-0.vercel.app/welcome) is a German tutor you can hold a conversation with.",
      "From March to May 2026 I interned at MEKA Group, building the web side of the group: five sites, from its corporate home at [meka.com](https://meka.com/) to its maritime, dredging, consulting and safety-tech businesses.",
      "I finished my diploma in 2026 and I'm now doing a BE in Computer Engineering, graduating in 2029. I'm open to AI and full-stack roles."
    ],
    facts: [
      { label: "Studying", value: "BE Computer Engineering", detail: "Atharva College of Engineering, 2026 to 2029" },
      { label: "Before that", value: "Diploma", detail: "2023 to 2026" },
      { label: "Interned", value: "Web Developer Intern", detail: "MEKA Group, March to May 2026" },
      { label: "Usually in", value: "React, TypeScript, Node.js", detail: "Python for the AI side" }
    ]
  },

  headline: {
    greeting: "Hello, I'm Ujjwal Arote",
    lead: "Full Stack AI Developer",
    emphasis: ""
  },

  stats: [
    {
      id: "stat-1",
      value: "19",
      suffix: " y/o",
      label: "Age · Degree",
      sublabel: "BE Comp Engg · Atharva College"
    },
    {
      id: "stat-2",
      value: "09",
      suffix: "+",
      label: "Shipped Projects",
      sublabel: "Personal AI & Enterprise"
    },
    {
      id: "stat-3",
      value: "05",
      suffix: "",
      label: "MEKA Group Portals",
      sublabel: "Marine & Infrastructure"
    },
    {
      id: "stat-4",
      value: "100",
      suffix: "%",
      label: "Production Deployed",
      sublabel: "Live on Vercel & Enterprise"
    }
  ],

  projects: [
    {
      id: "kendall",
      title: "Kendall — Flight Simulator for System Design",
      oneLiner: "Interactive distributed systems simulator to model traffic, stress-test architecture, and detect bottlenecks before production.",
      role: "Creator & Full Stack AI Developer",
      year: "2025",
      tags: ["Distributed Systems", "Load Simulation", "React", "TypeScript", "PWA"],
      image: "/projects/kendall.jpg",
      accentColor: "#3B82F6",
      link: "https://kendall-web.vercel.app/",
      category: "personal",
      overview: "Kendall serves as a flight simulator for system design. It allows software architects and engineers to visually sketch distributed service topologies on a canvas, simulate realistic discrete-event traffic loads and failovers, and pinpoint database saturations and latency bottlenecks before shipping code to production.",
      gallery: [
        "/projects/kendall.jpg"
      ],
      outcomes: [
        { metric: "PWA", label: "Installable on Android & iOS" },
        { metric: "3.2k", label: "Peak simulated RPS load" },
        { metric: "<5ms", label: "Canvas graph latency" }
      ],
      featured: true
    },
    {
      id: "schema-studio",
      title: "SchemaStudio",
      oneLiner: "Interactive visual database schema designer with instant SQL, Prisma, and Mongoose code export.",
      role: "Creator & Full Stack Developer",
      year: "2025",
      tags: ["Database Architecture", "SQL Generation", "Prisma", "Mongoose", "React"],
      image: "/projects/schema-studio.jpg",
      accentColor: "#10B981",
      link: "https://schema-studio.vercel.app/",
      category: "personal",
      overview: "SchemaStudio is a visual database architecting tool. Users drag-and-drop tables, link foreign-key relations with visual connectors, configure column constraints, and immediately export production-ready SQL DDL, Prisma schema files, and Mongoose models with zero compilation delay.",
      gallery: [
        "/projects/schema-studio.jpg"
      ],
      outcomes: [
        { metric: "3+", label: "ORM / SQL formats supported" },
        { metric: "1.0", label: "Live production release" },
        { metric: "0ms", label: "Client-side export time" }
      ],
      featured: false
    },
    {
      id: "yapster",
      title: "Yapster AI Language Companion",
      oneLiner: "Conversational German AI language tutor with contextual memory and natural speech interactions.",
      role: "AI Engineer & Full Stack Developer",
      year: "2024",
      tags: ["Conversational AI", "LLMs", "Audio Speech API", "Context Memory", "React"],
      image: "/projects/yapster.jpg",
      accentColor: "#8B5CF6",
      link: "http://yapster-2-0.vercel.app/welcome",
      category: "personal",
      overview: "Yapster transforms language learning from mechanical flashcards into real daily conversations. Built with an empathetic conversational persona and persistent memory, the AI tutor tracks previous dialogue topics, remembers past user corrections, and offers constructive post-chat grammar breakdowns.",
      gallery: [
        "/projects/yapster.jpg"
      ],
      outcomes: [
        { metric: "Daily", label: "Conversational practice" },
        { metric: "Memory", label: "Context retention across chats" },
        { metric: "Realtime", label: "Audio speech response" }
      ],
      featured: false
    },
    {
      id: "whispr",
      title: "Whispr Anonymous Platform",
      oneLiner: "Privacy-first anonymous inquiry and feedback platform with zero-tracking security.",
      role: "Full Stack Developer",
      year: "2024",
      tags: ["Next.js", "Full Stack", "Data Privacy", "Tailwind CSS", "Vercel"],
      image: "/projects/whispr.jpg",
      accentColor: "#F59E0B",
      link: "https://whispr-lemon.vercel.app/",
      category: "personal",
      overview: "An unfiltered, private feedback and confession platform designed with a high-contrast minimalist aesthetic. Allows users to claim unique shareable links and receive raw, authentic feedback directly to their dashboard with zero surveillance or tracking cookies.",
      gallery: [
        "/projects/whispr.jpg"
      ],
      outcomes: [
        { metric: "0", label: "Tracking cookies or third-party tags" },
        { metric: "Instant", label: "Direct-to-dashboard delivery" },
        { metric: "100%", label: "Anonymity assurance" }
      ],
      featured: false
    },
    {
      id: "meka-group",
      title: "MEKA Group Corporate Portal",
      oneLiner: "Flagship digital experience for 45+ years of marine engineering, dredging, and port infrastructure.",
      role: "Web Developer Intern @ MEKA Group",
      year: "2026",
      tags: ["Enterprise Web", "Corporate UI", "Marine Infrastructure", "Performance"],
      image: "/projects/meka-group.jpg",
      accentColor: "#0EA5E9",
      link: "https://meka.com/",
      category: "internship",
      overview: "The primary digital corporate portal for MEKA Group, encapsulating 45+ years of coastal infrastructure, marine construction, and civil engineering across India and the Middle East. Features modern responsive navigation, legacy timelines, and project showcases.",
      gallery: [
        "/projects/meka-group.jpg"
      ],
      outcomes: [
        { metric: "45+", label: "Years of company legacy" },
        { metric: "Global", label: "Middle East & India operations" },
        { metric: "99+", label: "Google PageSpeed performance" }
      ],
      featured: false
    },
    {
      id: "amma-lines",
      title: "Amma Lines Marine Infrastructure",
      oneLiner: "Showcase portal for MEKA Group's flagship marine construction and deepwater dredging arm.",
      role: "Web Developer Intern @ MEKA Group",
      year: "2026",
      tags: ["Marine Engineering", "Infrastructure", "Multilingual UI", "Animations"],
      image: "/projects/amma-lines.jpg",
      accentColor: "#06B6D4",
      link: "https://amma-lines.vercel.app/",
      category: "internship",
      overview: "Showcase portal for Amma Lines Pvt. Ltd., the flagship marine engineering arm of MEKA Group incorporated in 1978. Highlights over 1,300 meters of armored breakwaters on the Bay of Bengal, deepwater jetties, and heavy coastal dredging fleets across 12 disciplines.",
      gallery: [
        "/projects/amma-lines.jpg"
      ],
      outcomes: [
        { metric: "1,300m", label: "Armored coastline featured" },
        { metric: "12", label: "Marine engineering disciplines" },
        { metric: "3", label: "Languages supported (EN/HI/AR)" }
      ],
      featured: false
    },
    {
      id: "meka-dredging",
      title: "MEKA Dredging Operations",
      oneLiner: "Technical marine dredging portal featuring fleet specifications, coastal boundary depth modeling, and harbor reclamation.",
      role: "Web Developer Intern @ MEKA Group",
      year: "2026",
      tags: ["Marine Dredging", "Hydrographic Tech", "Fleet Showcase", "Interactive UI"],
      image: "/projects/meka-dredging.jpg",
      accentColor: "#3B82F6",
      link: "https://meka-dredging.vercel.app/",
      category: "internship",
      overview: "Specialized operations portal for MEKA Dredging, focusing on coastal boundary redefinition, cutter suction fleets, trailing suction hopper dredgers, and channel depth maintenance. Built with high-craft technical typography and interactive fleet data sheets.",
      gallery: [
        "/projects/meka-dredging.jpg"
      ],
      outcomes: [
        { metric: "Target", label: "Depth precision modeling" },
        { metric: "Fleet", label: "Technical equipment registry" },
        { metric: "60fps", label: "Smooth scroll interactions" }
      ],
      featured: false
    },
    {
      id: "meka-consultants",
      title: "MEKA Consultants",
      oneLiner: "Strategic management, engineering consulting, and infrastructure advisory digital hub.",
      role: "Web Developer Intern @ MEKA Group",
      year: "2026",
      tags: ["Strategic Consulting", "Engineering Advisory", "Corporate UI", "Tailwind"],
      image: "/projects/meka-consultants.jpg",
      accentColor: "#6366F1",
      link: "https://meka-consultants.vercel.app/",
      category: "internship",
      overview: "Digital platform for MEKA Consultants, providing strategic management consulting, operational excellence advisory, and capital project consulting for large-scale infrastructure clients.",
      gallery: [
        "/projects/meka-consultants.jpg"
      ],
      outcomes: [
        { metric: "B2B", label: "Executive consulting leads" },
        { metric: "100%", label: "Clean modern design system" },
        { metric: "Fast", label: "Sub-second page transitions" }
      ],
      featured: false
    },
    {
      id: "nari-astra",
      title: "Nari Astra Self-Defense & Safety",
      oneLiner: "Modern web experience showcasing empowerment and premium personal self-defense technology for women.",
      role: "Web Developer Intern @ MEKA Group",
      year: "2026",
      tags: ["Product Showcase", "Safety Tech", "E-Commerce UI", "React"],
      image: "/projects/nari-astra.jpg",
      accentColor: "#EC4899",
      link: "https://nari-astra.vercel.app/",
      category: "internship",
      overview: "A luxury self-defense and personal protection product showcase. Features an empowering aesthetic, interactive safety mechanism demonstrations, story section, and an intuitive product catalog designed to put safety directly into women's hands.",
      gallery: [
        "/projects/nari-astra.jpg"
      ],
      outcomes: [
        { metric: "100%", label: "Responsive mobile-first UI" },
        { metric: "Safety", label: "Empowerment narrative driven" },
        { metric: "Cart", label: "Seamless checkout flow preview" }
      ],
      featured: false
    }
  ],

  skills: [
    {
      category: "Full Stack & AI Engineering",
      skills: [
        { name: "Full Stack AI Architecture", highlighted: true },
        { name: "LLMs & Prompt Engineering", highlighted: true },
        { name: "React / Next.js", highlighted: true },
        { name: "TypeScript / Node.js" },
        { name: "Python / AI Frameworks", highlighted: true },
        { name: "Vector Search & RAG" },
        { name: "REST & WebSocket APIs" }
      ]
    },
    {
      category: "Systems & Database Design",
      skills: [
        { name: "Distributed Systems Simulation", highlighted: true },
        { name: "Visual Schema Modeling", highlighted: true },
        { name: "SQL DDL Generation" },
        { name: "Prisma & Mongoose" },
        { name: "Performance Optimization", highlighted: true },
        { name: "Docker & Cloud Deployments" },
        { name: "PWA & Mobile-First Web" }
      ]
    },
    {
      category: "Tactile UI & Engineering Craft",
      skills: [
        { name: "Apple HIG & Glassmorphism", highlighted: true },
        { name: "Tailwind CSS Architecture" },
        { name: "Framer Motion & GSAP", highlighted: true },
        { name: "Three.js / WebGL & Shaders" },
        { name: "Responsive Enterprise Design", highlighted: true },
        { name: "Clean Microservice Design" }
      ]
    }
  ],

  experience: [
    {
      id: "exp-be",
      kind: "Education",
      company: "Atharva College of Engineering",
      role: "BE in Computer Engineering",
      period: "2026 — 2029",
      current: true,
      location: "Mumbai, India",
      description: "Bachelor of Engineering in Computer Engineering, graduating in 2029.",
      highlights: [
        "Coursework in distributed systems, operating systems, databases and artificial intelligence."
      ]
    },
    {
      id: "exp-1",
      kind: "Work",
      company: "MEKA Group",
      role: "Full Stack & Web Developer Intern",
      period: "Mar 2026 — May 2026",
      location: "Mumbai, India",
      description: "I built and shipped the group's websites, from the corporate site at meka.com to the sites for its maritime, dredging, consulting and safety-tech businesses.",
      highlights: [
        "Built the front end of five sites and handled their deployment.",
        "Designed Nari Astra's product site for a personal-safety brand, with interactive sections and motion."
      ],
      projects: ["meka-group", "amma-lines", "meka-dredging", "meka-consultants", "nari-astra"]
    },
    {
      id: "exp-3",
      kind: "Independent",
      company: "Independent projects",
      role: "Full Stack AI Developer",
      period: "2023 — Present",
      location: "Mumbai / Remote",
      description: "Alongside college I build my own tools, mostly where AI and systems design meet.",
      highlights: [
        "Kendall lets you sketch a system's architecture and simulate traffic to find bottlenecks before production.",
        "Yapster is a German tutor you can talk to, with memory of past conversations and speech feedback.",
        "SchemaStudio and Whispr are both live on Vercel."
      ],
      projects: ["kendall", "schema-studio", "yapster", "whispr"]
    },
    {
      id: "exp-diploma",
      kind: "Education",
      company: "Diploma",
      role: "Diploma in Engineering",
      period: "2023 — 2026",
      location: "Mumbai, India",
      description: "Three-year diploma, completed in 2026 before starting the BE.",
      highlights: []
    }
  ],

  socials: [
    { platform: "GitHub", handle: "@UjjwalArote69", url: "https://github.com/UjjwalArote69", icon: "github" },
    { platform: "LinkedIn", handle: "ujjwal-arote", url: "https://linkedin.com", icon: "linkedin" },
    { platform: "X", handle: "@UjjwalArote", url: "https://x.com/UjjwalArote", icon: "twitter" },
    { platform: "Portfolio", handle: "ujjwal.dev", url: "#", icon: "dribbble" }
  ],

  quickLinks: [
    { title: "About", description: "Who I am, what I study and how I build", href: "#about", icon: "user" },
    { title: "Work", description: "Shipped AI, systems and enterprise projects", href: "#work", icon: "layers", badge: "9 Projects" },
    { title: "Skills", description: "Languages, frameworks and tools I use daily", href: "#skills", icon: "cpu" },
    { title: "Experience", description: "Education, internship and independent work", href: "#experience", icon: "briefcase" },
    { title: "Contact", description: "Open to AI and full-stack roles", href: "#contact", icon: "mail", badge: "Open" }
  ]
};
