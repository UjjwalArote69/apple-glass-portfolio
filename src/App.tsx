import { useState } from 'react';
import { useLenis } from './hooks/useLenis';
import { useTheme } from './hooks/useTheme';
import { useMouseDamped } from './hooks/useMouseDamped';
import { SceneContainer } from './scene/SceneContainer';
import { TopBar } from './components/layout/TopBar';
import { FloatingDock } from './components/layout/FloatingDock';
import { QuickLinksSheet } from './components/layout/QuickLinksSheet';
import { HeroSection } from './components/sections/HeroSection';
import { SummaryStrip } from './components/sections/SummaryStrip';
import { AboutCard } from './components/sections/AboutCard';
import { SelectedWork } from './components/sections/SelectedWork';
import { ProjectDetailModal } from './components/sections/ProjectDetailModal';
import { SkillsSection } from './components/sections/SkillsSection';
import { ExperienceTimeline } from './components/sections/ExperienceTimeline';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/sections/Footer';
import { CustomCursor } from './components/ui/CustomCursor';
import { Toast } from './components/ui/Toast';
import type { Project } from './types/portfolio';
import { content } from './content';

export function App() {
  // Smooth scroll
  useLenis();

  // Color theme (Daylight vs Night)
  const { theme, toggleTheme } = useTheme();

  // Damped pointer coordinates for 3D lean and tilt
  const mouseCoords = useMouseDamped(0.08);

  // Modal and navigation states
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isQuickLinksOpen, setIsQuickLinksOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Carousel navigation within modal
  const handleNextProject = () => {
    if (!selectedProject) return;
    const idx = content.projects.findIndex((p) => p.id === selectedProject.id);
    const nextIdx = (idx + 1) % content.projects.length;
    setSelectedProject(content.projects[nextIdx]);
  };

  const handlePrevProject = () => {
    if (!selectedProject) return;
    const idx = content.projects.findIndex((p) => p.id === selectedProject.id);
    const prevIdx = (idx - 1 + content.projects.length) % content.projects.length;
    setSelectedProject(content.projects[prevIdx]);
  };

  return (
    <div className="relative min-h-screen text-[var(--text)] transition-colors duration-500 overflow-x-hidden selection:bg-orange-200/50 dark:selection:bg-indigo-500/30">
      {/* Desktop Custom Tactile Glass Cursor */}
      <CustomCursor />

      {/* Persistent Fullscreen 3D Scene */}
      <SceneContainer pointer={mouseCoords} theme={theme} />

      {/* Tactile Ambient Backdrop Sunrise Discs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Peach blob */}
        <div
          className="ambient-glow-disc -top-40 -left-40 w-[650px] h-[650px] transition-colors duration-700"
          style={{ background: 'var(--bg-glow-1)' }}
        />
        {/* Lavender blob */}
        <div
          className="ambient-glow-disc top-1/3 -right-40 w-[600px] h-[600px] transition-colors duration-700"
          style={{ background: 'var(--bg-glow-2)' }}
        />
        {/* Periwinkle blob */}
        <div
          className="ambient-glow-disc -bottom-40 left-1/4 w-[700px] h-[700px] transition-colors duration-700"
          style={{ background: 'var(--bg-glow-3)' }}
        />
      </div>

      {/* Top Bar with Avatar, Theme Toggle, Status */}
      <TopBar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenQuickLinks={() => setIsQuickLinksOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="relative z-10 flex flex-col">
        <HeroSection />
        <SummaryStrip />
        <AboutCard />
        <SelectedWork
          theme={theme}
          onSelectProject={(p) => setSelectedProject(p)}
        />
        <SkillsSection />
        <ExperienceTimeline />
        <ContactSection onShowToast={(msg) => setToastMessage(msg)} />
      </main>

      {/* Colophon Footer */}
      <Footer />

      {/* Floating Dock Nav at Bottom Center */}
      <FloatingDock />

      {/* Shared-Element Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onNext={handleNextProject}
        onPrev={handlePrevProject}
      />

      {/* Quick Links Drawer Sheet */}
      <QuickLinksSheet
        isOpen={isQuickLinksOpen}
        onClose={() => setIsQuickLinksOpen(false)}
      />

      {/* Glass Notification Toast */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}

export default App;
