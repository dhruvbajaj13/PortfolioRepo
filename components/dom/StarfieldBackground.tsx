'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Ultra-lightweight CSS-canvas starfield that sits fixed behind the entire page.
 * Uses a single OffscreenCanvas (or regular canvas) to draw ~200 tiny twinkling
 * white dots. No Three.js – runs on the CPU at negligible cost.
 */
export function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const STAR_COUNT = 220;

    // Set canvas to viewport size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Generate stars
    type Star = {
      x: number; y: number;
      r: number;
      opacity: number;
      speed: number;      // twinkle speed
      phase: number;      // twinkle phase offset
    };

    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 0.4 + Math.random() * 1.0,
      opacity: 0.15 + Math.random() * 0.55,
      speed: 0.3 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
    }));

    let animId: number;
    let t = 0;

    const draw = () => {
      animId = requestAnimationFrame(draw);
      t += 0.016;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const s of stars) {
        // Twinkle: sine wave modulates opacity
        const twinkle = s.opacity * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${twinkle.toFixed(3)})`;
        ctx.fill();
      }
    };

    draw();

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
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
