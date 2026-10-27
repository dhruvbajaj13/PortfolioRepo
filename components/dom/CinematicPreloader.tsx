'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function CinematicPreloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ── Progress counter
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setDone(true), 180);
          setTimeout(onComplete, 520);
          return 100;
        }
        const inc = Math.floor(Math.random() * 7) + 5;
        return Math.min(prev + inc, 100);
      });
    }, 18);
    return () => clearInterval(interval);
  }, [onComplete]);

  // ── Noise / grain canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const draw = () => {
      animId = requestAnimationFrame(draw);
      const w = canvas.width = window.innerWidth;
      const h = canvas.height = window.innerHeight;
      const imageData = ctx.createImageData(w, h);
      const buf = imageData.data;
      for (let i = 0; i < buf.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        buf[i] = buf[i + 1] = buf[i + 2] = v;
        buf[i + 3] = 10; // very subtle
      }
      ctx.putImageData(imageData, 0, 0);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  const padded = progress < 10 ? `0${progress}` : `${progress}`;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.38, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden select-none"
        >
          {/* Film-grain noise layer */}
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none opacity-30 mix-blend-overlay"
          />

          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,transparent_60%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />

          {/* Fine dot-grid */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

          {/* ── Top bar */}
          <div className="absolute top-6 sm:top-10 left-6 sm:left-12 right-6 sm:right-12 flex items-center justify-between z-10">
            <span className="font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase">
              Portfolio
            </span>
            <span className="font-mono text-[10px] tracking-[0.3em] text-white/20 uppercase">
              {progress === 100 ? 'Ready' : 'Loading'}
            </span>
          </div>

          {/* ── Center content */}
          <div className="relative z-10 flex flex-col items-center gap-10 w-full px-8">

            {/* Giant counter */}
            <div className="relative flex items-end leading-none gap-1">
              <motion.span
                key={padded}
                initial={{ opacity: 0.5, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.08 }}
                className="font-display font-black text-[18vw] sm:text-[16vw] md:text-[14vw] text-white tracking-tighter tabular-nums"
                style={{ lineHeight: 0.88 }}
              >
                {padded}
              </motion.span>
              <span className="font-display font-thin text-[6vw] sm:text-[5vw] text-white/30 mb-[1vw]">
                %
              </span>
            </div>

            {/* Thin progress line */}
            <div className="relative w-full max-w-xs sm:max-w-sm h-px bg-white/10">
              <motion.div
                className="absolute inset-y-0 left-0 bg-white rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.07, ease: 'linear' }}
              />
              {/* Glow dot at tip */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-[3px] h-[3px] rounded-full bg-white shadow-[0_0_8px_3px_rgba(255,255,255,0.6)]"
                style={{ left: `${Math.min(progress, 99.5)}%` }}
                transition={{ duration: 0.07, ease: 'linear' }}
              />
            </div>

            {/* Status line */}
            <motion.p
              key={Math.floor(progress / 25)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-[10px] sm:text-[11px] tracking-[0.35em] text-white/25 uppercase text-center"
            >
              {progress < 30
                ? 'Initializing'
                : progress < 65
                ? 'Dhruv Bajaj'
                : progress < 95
                ? 'Almost there'
                : 'Launching'}
            </motion.p>
          </div>

          {/* ── Bottom bar */}
          <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-12 right-6 sm:right-12 flex items-center justify-between z-10">
            <span className="font-mono text-[10px] tracking-[0.25em] text-white/20 uppercase">
              2026
            </span>
            <motion.span
              animate={{ opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase"
            >
              ■ ■ ■
            </motion.span>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
