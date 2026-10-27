'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';

// ── Corner bracket
function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const s = 24;
  const sw = 1;
  const c = 'rgba(255,255,255,0.2)';
  return (
    <svg
      width={s} height={s} viewBox={`0 0 ${s} ${s}`}
      className="absolute"
      style={{
        top:    pos.startsWith('t') ? 0 : undefined,
        bottom: pos.startsWith('b') ? 0 : undefined,
        left:   pos.endsWith('l')   ? 0 : undefined,
        right:  pos.endsWith('r')   ? 0 : undefined,
      }}
    >
      {pos === 'tl' && <><line x1={s} y1={sw/2} x2={sw/2} y2={sw/2} stroke={c} strokeWidth={sw}/><line x1={sw/2} y1={sw/2} x2={sw/2} y2={s} stroke={c} strokeWidth={sw}/></>}
      {pos === 'tr' && <><line x1="0" y1={sw/2} x2={s-sw/2} y2={sw/2} stroke={c} strokeWidth={sw}/><line x1={s-sw/2} y1={sw/2} x2={s-sw/2} y2={s} stroke={c} strokeWidth={sw}/></>}
      {pos === 'bl' && <><line x1={sw/2} y1="0" x2={sw/2} y2={s-sw/2} stroke={c} strokeWidth={sw}/><line x1={sw/2} y1={s-sw/2} x2={s} y2={s-sw/2} stroke={c} strokeWidth={sw}/></>}
      {pos === 'br' && <><line x1={s-sw/2} y1="0" x2={s-sw/2} y2={s-sw/2} stroke={c} strokeWidth={sw}/><line x1={s-sw/2} y1={s-sw/2} x2="0" y2={s-sw/2} stroke={c} strokeWidth={sw}/></>}
    </svg>
  );
}

export function CinematicPreloader({ onComplete }: { onComplete: () => void }) {
  const [display, setDisplay] = useState(0);   // integer shown on screen
  const [done,    setDone]    = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanRef   = useRef<HTMLDivElement>(null);
  const mv        = useMotionValue(0);          // smooth 0-100 motion value

  // ── Smooth 0-100 over ~1.8s with slight ease-in ease-out
  useEffect(() => {
    const ctrl = animate(mv, 100, {
      duration: 1.85,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
      onComplete: () => {
        setTimeout(() => setDone(true), 220);
        setTimeout(onComplete, 620);
      },
    });
    return () => ctrl.stop();
  }, [onComplete, mv]);

  // ── Film grain
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let id: number;
    const grain = () => {
      id = requestAnimationFrame(grain);
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      const img = ctx.createImageData(canvas.width, canvas.height);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        img.data[i] = img.data[i+1] = img.data[i+2] = v;
        img.data[i+3] = 8;
      }
      ctx.putImageData(img, 0, 0);
    };
    grain();
    return () => cancelAnimationFrame(id);
  }, []);

  // ── Scanline sweep
  useEffect(() => {
    const el = scanRef.current;
    if (!el) return;
    let y = 0, id: number;
    const sweep = () => {
      id = requestAnimationFrame(sweep);
      y  = (y + 1) % window.innerHeight;
      el.style.transform = `translateY(${y}px)`;
    };
    sweep();
    return () => cancelAnimationFrame(id);
  }, []);

  const padded  = display < 10 ? `0${display}` : `${display}`;
  const percent = display;

  // Name reveal: each letter fades in as progress crosses its threshold
  const NAME = 'DHRUV BAJAJ';
  const chars = NAME.split('');
  const revealed = Math.floor((percent / 100) * chars.length);

  // Ambient glow opacity scales with progress
  const glowOpacity = percent / 100 * 0.18;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden select-none"
        >
          {/* Film grain */}
          <canvas ref={canvasRef} aria-hidden className="absolute inset-0 w-full h-full pointer-events-none opacity-25 mix-blend-overlay" />

          {/* Dot grid */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:34px_34px] pointer-events-none" />

          {/* Scanline */}
          <div ref={scanRef} className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.035] to-transparent pointer-events-none z-10" />

          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,transparent_50%,rgba(0,0,0,0.94)_100%)] pointer-events-none" />

          {/* Ambient glow — expands as progress grows */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(ellipse 55% 45% at 50% 50%, rgba(255,255,255,${glowOpacity}) 0%, transparent 100%)`,
            }}
          />

          {/* Thin horizontal rule lines */}
          <div className="absolute left-12 right-12 top-[30%] h-px bg-white/[0.05] pointer-events-none" />
          <div className="absolute left-12 right-12 bottom-[30%] h-px bg-white/[0.05] pointer-events-none" />

          {/* Vertical side lines */}
          <div className="absolute top-[30%] bottom-[30%] left-12 w-px bg-white/[0.05] pointer-events-none" />
          <div className="absolute top-[30%] bottom-[30%] right-12 w-px bg-white/[0.05] pointer-events-none" />

          {/* Corner brackets at rule intersections */}
          {(['tl','tr','bl','br'] as const).map(p => (
            <div
              key={p}
              className="absolute w-6 h-6"
              style={{
                top:    p.startsWith('t') ? 'calc(30% - 0px)' : undefined,
                bottom: p.startsWith('b') ? 'calc(30% - 0px)' : undefined,
                left:   p.endsWith('l')   ? '46px' : undefined,
                right:  p.endsWith('r')   ? '46px' : undefined,
              }}
            >
              <Corner pos={p} />
            </div>
          ))}

          {/* ── Top status bar */}
          <div className="absolute top-7 sm:top-10 left-8 sm:left-14 right-8 sm:right-14 flex items-center justify-between z-20">
            <span className="font-mono text-[9px] tracking-[0.35em] text-white/25 uppercase">Portfolio · 2026</span>
            <motion.span
              animate={{ opacity: [0.2, 0.55, 0.2] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="font-mono text-[9px] tracking-[0.35em] text-white/30 uppercase"
            >
              {percent === 100 ? 'Ready' : 'Loading'}
            </motion.span>
          </div>

          {/* ── Center block */}
          <div className="relative z-20 flex flex-col items-center w-full px-8 gap-7 sm:gap-9">

            {/* Name — letter-by-letter drop */}
            <div className="flex items-center overflow-hidden h-[3.5vw] sm:h-[2.8vw] min-h-[18px]">
              {chars.map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={i < revealed
                    ? { opacity: ch === ' ' ? 0 : 0.15, y: 0 }
                    : { opacity: 0, y: 10 }
                  }
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display font-black text-[3.8vw] sm:text-[2.6vw] md:text-[2vw] text-white tracking-[0.3em] uppercase"
                >
                  {ch === ' ' ? '\u2003' : ch}
                </motion.span>
              ))}
            </div>

            {/* Giant counter */}
            <div className="flex items-end leading-none">
              <span
                className="font-display font-black text-white tabular-nums tracking-tighter"
                style={{ fontSize: 'clamp(80px, 20vw, 220px)', lineHeight: 0.85 }}
              >
                {padded}
              </span>
              <span
                className="font-display font-thin text-white/15 ml-1"
                style={{ fontSize: 'clamp(28px, 6vw, 72px)', marginBottom: '1.5vw' }}
              >
                %
              </span>
            </div>

            {/* Progress track */}
            <div className="relative w-full max-w-[260px] sm:max-w-[340px] py-3">
              {/* Tick marks */}
              {[0, 25, 50, 75, 100].map(t => (
                <div
                  key={t}
                  className="absolute top-0 w-px"
                  style={{
                    left: `${t}%`,
                    height: t % 50 === 0 ? '8px' : '5px',
                    background: percent >= t ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.1)',
                    transition: 'background 0.25s',
                  }}
                />
              ))}
              {/* Track */}
              <div className="absolute top-[11px] left-0 right-0 h-px bg-white/10" />
              {/* Fill */}
              <motion.div
                className="absolute top-[11px] left-0 h-px bg-white origin-left"
                style={{ width: `${percent}%`, transition: 'width 0.06s linear' }}
              />
              {/* Glow dot */}
              <motion.div
                className="absolute w-[5px] h-[5px] rounded-full bg-white shadow-[0_0_12px_5px_rgba(255,255,255,0.5)]"
                style={{
                  top: '9px',
                  left: `calc(${Math.min(percent, 99.5)}% - 2.5px)`,
                  transition: 'left 0.06s linear',
                }}
              />
            </div>

            {/* Status text */}
            <motion.p
              key={Math.floor(percent / 25)}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="font-mono text-[9px] sm:text-[10px] tracking-[0.45em] text-white/20 uppercase"
            >
              {percent < 25 ? 'Initializing' : percent < 50 ? 'Building modules' : percent < 80 ? 'Preparing assets' : percent < 100 ? 'Launching' : 'Ready'}
            </motion.p>
          </div>

          {/* ── Bottom bar */}
          <div className="absolute bottom-7 sm:bottom-10 left-8 sm:left-14 right-8 sm:right-14 flex items-center justify-between z-20">
            <span className="font-mono text-[9px] tracking-[0.3em] text-white/18 uppercase">Full-Stack · AI · DSA</span>
            <motion.div className="flex items-center gap-2">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-[3px] h-[3px] rounded-full bg-white"
                  animate={{ opacity: [0.1, 0.45, 0.1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
                />
              ))}
            </motion.div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
