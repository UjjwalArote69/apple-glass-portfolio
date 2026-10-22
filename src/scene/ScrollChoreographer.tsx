import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IridescentOrb } from './IridescentOrb';
import { GlassLens } from './GlassLens';
import type { Theme } from '../hooks/useTheme';

gsap.registerPlugin(ScrollTrigger);

interface ScrollChoreographerProps {
  pointer: { x: number; y: number };
  theme: Theme;
  isMobile: boolean;
}

export function ScrollChoreographer({ pointer, theme, isMobile }: ScrollChoreographerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [warmth, setWarmth] = useState(0);

  // Target values animated by GSAP
  const targets = useRef({
    x: isMobile ? 0 : 2.1,
    y: isMobile ? 1.6 : 0.0,
    z: isMobile ? -0.8 : 0.0,
    scale: isMobile ? 1.1 : 1.5,
    warmth: 0,
  });

  useEffect(() => {
    // Initial hero target based on screen width
    targets.current.x = isMobile ? 0 : 2.1;
    targets.current.y = isMobile ? 1.4 : 0.0;
    targets.current.z = isMobile ? -0.6 : 0.0;
    targets.current.scale = isMobile ? 1.15 : 1.5;
    targets.current.warmth = 0;

    const ctx = gsap.context(() => {
      // 1. Hero -> About
      ScrollTrigger.create({
        trigger: '#about',
        start: 'top 80%',
        end: 'center center',
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;
          // Drifts left and shrinks, warmth warms up
          const heroX = isMobile ? 0 : 2.1;
          const aboutX = isMobile ? 0 : -2.2;
          targets.current.x = THREE.MathUtils.lerp(heroX, aboutX, p);
          targets.current.y = THREE.MathUtils.lerp(isMobile ? 1.4 : 0.0, isMobile ? 0.6 : -0.2, p);
          targets.current.z = THREE.MathUtils.lerp(isMobile ? -0.6 : 0.0, -0.6, p);
          targets.current.scale = THREE.MathUtils.lerp(isMobile ? 1.15 : 1.5, isMobile ? 0.9 : 1.1, p);
          targets.current.warmth = THREE.MathUtils.lerp(0, 0.85, p);
        }
      });

      // 2. About -> Work (Bento Grid)
      ScrollTrigger.create({
        trigger: '#work',
        start: 'top 75%',
        end: 'center center',
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;
          // Drifts to the background and expands into an ambient glow behind the bento grid
          const fromX = isMobile ? 0 : -2.2;
          targets.current.x = THREE.MathUtils.lerp(fromX, 0, p);
          targets.current.y = THREE.MathUtils.lerp(isMobile ? 0.6 : -0.2, 0.4, p);
          targets.current.z = THREE.MathUtils.lerp(-0.6, -3.2, p);
          targets.current.scale = THREE.MathUtils.lerp(isMobile ? 0.9 : 1.1, 2.4, p);
          targets.current.warmth = THREE.MathUtils.lerp(0.85, 0.2, p);
        }
      });

      // 3. Work -> Contact
      ScrollTrigger.create({
        trigger: '#contact',
        start: 'top 85%',
        end: 'center center',
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;
          // Returns to center and fills with color
          targets.current.x = THREE.MathUtils.lerp(0, 0, p);
          targets.current.y = THREE.MathUtils.lerp(0.4, isMobile ? 0.8 : -0.3, p);
          targets.current.z = THREE.MathUtils.lerp(-3.2, -0.2, p);
          targets.current.scale = THREE.MathUtils.lerp(2.4, isMobile ? 1.2 : 1.6, p);
          targets.current.warmth = THREE.MathUtils.lerp(0.2, 0.95, p);
        }
      });
    });

    return () => ctx.revert();
  }, [isMobile]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Smoothly damp toward targets
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targets.current.x, 3.5, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targets.current.y, 3.5, delta);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targets.current.z, 3.5, delta);

    const s = THREE.MathUtils.damp(groupRef.current.scale.x, targets.current.scale, 3.5, delta);
    groupRef.current.scale.set(s, s, s);

    setWarmth(targets.current.warmth);
  });

  return (
    <group ref={groupRef} position={[isMobile ? 0 : 2.1, isMobile ? 1.4 : 0.0, 0]}>
      <IridescentOrb
        pointer={pointer}
        theme={theme}
        warmthFactor={warmth}
        scale={1.0}
      />
      {!isMobile && <GlassLens pointer={pointer} />}
    </group>
  );
}
