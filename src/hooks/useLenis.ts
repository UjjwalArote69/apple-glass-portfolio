import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// The live instance, so programmatic scrolls go through Lenis instead of fighting it
let activeLenis: Lenis | null = null;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

interface ScrollToTargetOptions {
  offset?: number;
  onComplete?: () => void;
}

export function scrollToTarget(target: string | HTMLElement | number, { offset = 0, onComplete }: ScrollToTargetOptions = {}) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (activeLenis) {
    activeLenis.scrollTo(target, {
      offset,
      duration: 1.1,
      easing: easeInOutCubic,
      immediate: reduced,
      onComplete: () => onComplete?.(),
    });
    return;
  }

  // Fallback when Lenis isn't running
  const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth';
  if (typeof target === 'number') {
    window.scrollTo({ top: target + offset, behavior });
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior });
  }
  onComplete?.();
}

// Freeze page scrolling behind overlays (Lenis ignores body overflow on its own)
export function lockScroll() {
  activeLenis?.stop();
  document.body.style.overflow = 'hidden';
}

export function unlockScroll() {
  document.body.style.overflow = '';
  activeLenis?.start();
}

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    activeLenis = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerCallback);
      lenisRef.current = null;
      if (activeLenis === lenis) activeLenis = null;
    };
  }, []);

  return lenisRef;
}
