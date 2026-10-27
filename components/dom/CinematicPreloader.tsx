'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Glitching random digit that flickers to the real digit as progress passes
function GlitchDigit({ target, active }: { target: string; active: boolean }) {
  const [displayed, setDisplayed] = useState(target);
  const chars = '0123456789';
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) { setDisplayed(target); return; }
    let count = 0;
    ref.current = setInterval(() => {
      count++;
      if (count > 7) { setDisplayed(target); clearInterval(ref.current!); return; }
      setDisplayed(chars[Math.floor(Math.random() * chars.length)]);
    }, 40);
    return () => clearInterval(ref.current!);
  }, [target, active]);

  return <span>{displayed}</span>;
}

// ── Corner bracket decoration
function CornerBracket({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const size = 20;
  const stroke = 'rgba(255,255,255,0.25)';
  const sw = 1.5;
  const corners = {
    tl: <><line x1={size} y1="0" x2="0" y2="0" stroke={stroke} strokeWidth={sw} /><line x1="0" y1="0" x2="0" y2={size} stroke={stroke} strokeWidth={sw} /></>,
    tr: <><line x1="0" y1="0" x2={size} y2="0" stroke={stroke} strokeWidth={sw} /><line x1={size} y1="0" x2={size} y2={size} stroke={stroke} strokeWidth={sw} /></>,
    bl: <><line x1="0" y1="0" x2="0" y2={size} stroke={stroke} strokeWidth={sw} /><line x1="0" y1={size} x2={size} y2={size} stroke={stroke} strokeWidth={sw} /></>,
    br: <><line x1={size} y1="0" x2={size} y2={size} stroke={stroke} strokeWidth={sw} /><line x1="0" y1={size} x2={size} y2={size} stroke={stroke} strokeWidth={sw} /></>,
  };
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute" style={{
      top: pos.startsWith('t') ? 0 : undefined,
      bottom: pos.startsWith('b') ? 0 : undefined,
      left: pos.endsWith('l') ? 0 : undefined,
      right: pos.endsWith('r') ? 0 : undefined,
    }}>
      {corners[pos]}
    </svg>
  );
}

export function CinematicPreloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);

  // ── Progress ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setDone(true), 200);
          setTimeout(onComplete, 560);
          return 100;
        }
        return Math.min(prev + Math.floor(Math.random() * 7) + 4, 100);
      });
    }, 18);
    return () => clearInterval(interval);
  }, [onComplete]);

  // ── Film grain
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    const draw = () => {
      animId = requestAnimationFrame(draw);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const img = ctx.createImageData(canvas.width, canvas.height);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 9;
      }
      ctx.putImageData(img, 0, 0);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  // ── Horizontal scanline sweep
  useEffect(() => {
    const el = scanRef.current;
    if (!el) return;
    let y = 0;
    let animId: number;
    const sweep = () => {
      animId = requestAnimationFrame(sweep);
      y = (y + 0.8) % window.innerHeight;
      el.style.transform = `translateY(${y}px)`;
    };
    sweep();
    return () => cancelAnimationFrame(animId);
  }, []);

  const padded = progress < 10 ? `0${progress}` : `${progress}`;
  const nameChars = 'DHRUV BAJAJ'.split('');
  const revealAt = nameChars.length; // chars revealed = floor(progress / (100 / len))
  const revealed = Math.floor((progress / 100) * nameChars.length);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -12, transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden select-none"
        >
          {/* Film grain */}
          <canvas ref={canvasRef} aria-hidden className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.28] mix-blend-overlay" />

          {/* Dot grid */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

          {/* Scanline sweep */}
          <div ref={scanRef} className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none z-10" />

          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_50%,transparent_55%,rgba(0,0,0,0.92)_100%)] pointer-events-none" />

          {/* Horizontal rule lines — top & bottom thirds */}
          <div className="absolute left-10 right-10 top-[28%] h-px bg-white/[0.06] pointer-events-none" />
          <div className="absolute left-10 right-10 bottom-[28%] h-px bg-white/[0.06] pointer-events-none" />

          {/* ── Corner decorations */}
          <div className="absolute top-6 sm:top-10 left-6 sm:left-12 w-10 h-10">
            <CornerBracket pos="tl" />
          </div>
          <div className="absolute top-6 sm:top-10 right-6 sm:right-12 w-10 h-10">
            <CornerBracket pos="tr" />
          </div>
          <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-12 w-10 h-10">
            <CornerBracket pos="bl" />
          </div>
          <div className="absolute bottom-6 sm:bottom-10 right-6 sm:right-12 w-10 h-10">
            <CornerBracket pos="br" />
          </div>

          {/* ── Top bar */}
          <div className="absolute top-6 sm:top-10 left-16 sm:left-24 right-16 sm:right-24 flex items-center justify-between z-10">
            <span className="font-mono text-[9px] tracking-[0.35em] text-white/25 uppercase">Portfolio · 2026</span>
            <motion.span
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="font-mono text-[9px] tracking-[0.35em] text-white/25 uppercase"
            >
              {progress === 100 ? 'Ready' : 'Loading'}
            </motion.span>
          </div>

          {/* ── Main center content */}
          <div className="relative z-10 flex flex-col items-center gap-8 sm:gap-10 w-full px-8">

            {/* Name reveal — letter by letter */}
            <div className="flex items-center gap-[0.08em] overflow-hidden">
              {nameChars.map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={i <= revealed ? { opacity: ch === ' ' ? 0 : 0.12, y: 0 } : { opacity: 0, y: 14 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display font-black text-[5vw] sm:text-[3.5vw] md:text-[2.8vw] text-white tracking-[0.18em] uppercase"
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </motion.span>
              ))}
            </div>

            {/* Giant glitch counter */}
            <div className="flex items-end gap-2 leading-none">
              <span className="font-display font-black text-[22vw] sm:text-[18vw] md:text-[15vw] text-white tracking-tighter tabular-nums" style={{ lineHeight: 0.85 }}>
                <GlitchDigit target={padded[0]} active={true} />
                <GlitchDigit target={padded[1]} active={true} />
              </span>
              <span className="font-display font-extralight text-[7vw] sm:text-[5.5vw] text-white/20 mb-[2vw]">%</span>
            </div>

            {/* Progress bar */}
            <div className="relative w-full max-w-[280px] sm:max-w-[360px]">
              {/* Track */}
              <div className="w-full h-px bg-white/10" />
              {/* Fill */}
              <motion.div
                className="absolute top-0 left-0 h-px bg-white"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.07, ease: 'linear' }}
              />
              {/* Glowing tip */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white shadow-[0_0_10px_4px_rgba(255,255,255,0.55)]"
                style={{ left: `calc(${Math.min(progress, 99)}% - 2px)` }}
                transition={{ duration: 0.07, ease: 'linear' }}
              />
              {/* Tick marks */}
              {[25, 50, 75].map((t) => (
                <div
                  key={t}
                  className="absolute top-[-4px] w-px h-[9px]"
                  style={{
                    left: `${t}%`,
                    background: progress >= t ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.12)',
                    transition: 'background 0.3s',
                  }}
                />
              ))}
            </div>

            {/* Status */}
            <motion.p
              key={Math.floor(progress / 25)}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-[9px] sm:text-[10px] tracking-[0.4em] text-white/20 uppercase"
            >
              {progress < 30 ? 'Initializing' : progress < 60 ? 'Building modules' : progress < 90 ? 'Preparing assets' : 'Launching'}
            </motion.p>
          </div>

          {/* ── Bottom bar */}
          <div className="absolute bottom-6 sm:bottom-10 left-16 sm:left-24 right-16 sm:right-24 flex items-center justify-between z-10">
            <span className="font-mono text-[9px] tracking-[0.3em] text-white/20 uppercase">Full-Stack · AI</span>
            <motion.div
              className="flex gap-1.5"
              animate={{ opacity: [0.15, 0.5, 0.15] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 rounded-full bg-white"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.25 }}
                />
              ))}
            </motion.div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
