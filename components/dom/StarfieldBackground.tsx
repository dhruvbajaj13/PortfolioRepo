'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Ultra-lightweight canvas starfield fixed behind the page.
 * Throttled to ~20fps with fast fillRect draws so backdrop-filter glass layers never lag.
 */
export function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const STAR_COUNT = isMobile ? 55 : 100;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    type Star = {
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
      phase: number;
    };

    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 1 + Math.random() * 1.4,
      opacity: 0.2 + Math.random() * 0.55,
      speed: 0.4 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
    }));

    let animId: number;
    let lastTime = 0;
    const FRAME_INTERVAL = 50; // ~20fps is plenty for slow star twinkling

    const draw = (now: number) => {
      animId = requestAnimationFrame(draw);
      if (document.hidden || now - lastTime < FRAME_INTERVAL) return;
      lastTime = now;

      const t = now * 0.001;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const twinkle = s.opacity * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
        ctx.fillStyle = `rgba(255,255,255,${twinkle.toFixed(2)})`;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      }
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
