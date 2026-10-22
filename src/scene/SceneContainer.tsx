import { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AmbientGlowField } from './AmbientGlowField';
import { ScrollChoreographer } from './ScrollChoreographer';
import { PostProcessingEffects } from './PostProcessingEffects';
import type { Theme } from '../hooks/useTheme';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface SceneContainerProps {
  pointer: { x: number; y: number };
  theme: Theme;
}

export function SceneContainer({ pointer, theme }: SceneContainerProps) {
  const reducedMotion = useReducedMotion();
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check WebGL support and mobile screen width
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleVisibility = () => {
      setIsTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Fallback for Reduced Motion or No WebGL
  if (!hasWebGL || reducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* CSS Radial Iridescent Orb Fallback */}
        <div
          className={`absolute rounded-full transition-all duration-1000 ${
            theme === 'night'
              ? 'bg-gradient-to-tr from-pink-600 via-indigo-600 to-emerald-400 opacity-60'
              : 'bg-gradient-to-tr from-[#FFD1B3] via-[#D8CCFD] to-[#A9C4FF] opacity-80'
          }`}
          style={{
            width: isMobile ? '320px' : '520px',
            height: isMobile ? '320px' : '520px',
            right: isMobile ? '10%' : '8%',
            top: isMobile ? '12%' : '18%',
            filter: 'blur(36px)',
            boxShadow: 'inset 0 0 80px rgba(255, 255, 255, 0.6)'
          }}
        />
        {/* Ambient sunrise blobs */}
        <div
          className="absolute rounded-full w-[600px] h-[600px] -left-32 -top-32 filter blur-[120px] opacity-40 pointer-events-none"
          style={{
            background: theme === 'night' ? '#E23A8C' : '#FFC9A3'
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        frameloop={isTabVisible ? 'always' : 'never'}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={theme === 'night' ? 0.35 : 0.6} />
          <directionalLight
            position={[4, 5, 4]}
            intensity={theme === 'night' ? 0.8 : 1.2}
            color="#FFFFFF"
          />

          {/* Ambient Blurred Sunrise Glow Blobs */}
          <AmbientGlowField theme={theme} />

          {/* Hero Orb + Lens with GSAP Scroll Choreography */}
          <ScrollChoreographer
            pointer={pointer}
            theme={theme}
            isMobile={isMobile}
          />

          {/* Subtle Postprocessing: Bloom + Micro Film Grain */}
          <PostProcessingEffects theme={theme} />
        </Suspense>
      </Canvas>
    </div>
  );
}
