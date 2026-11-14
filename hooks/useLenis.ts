'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Ultra-responsive, buttery-smooth 60-120FPS Lenis scroll config
    const lenis = new Lenis({
      duration: 0.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.0,
      infinite: false,
    });

    lenisRef.current = lenis;

    const handleResize = () => {
      lenis.resize();
    };
    window.addEventListener('resize', handleResize);

    let animId: number;
    function raf(time: number) {
      lenis.raf(time);
      animId = requestAnimationFrame(raf);
    }
    animId = requestAnimationFrame(raf);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      lenis.destroy();
    };
  }, []);

  return lenisRef;
}
