'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Iconic Apple macOS-inspired continuous cursive "hello" vector path
const HELLO_PATH =
  'M 60 212 C 105 192, 158 128, 172 68 C 180 36, 144 34, 132 72 C 118 118, 108 185, 104 224 C 112 174, 140 144, 168 144 C 194 144, 196 174, 192 206 C 190 226, 212 232, 238 220 C 274 204, 314 178, 320 152 C 325 130, 288 130, 272 156 C 254 184, 264 224, 300 226 C 332 228, 364 204, 388 174 C 420 136, 450 96, 460 64 C 468 36, 436 34, 422 70 C 406 112, 394 182, 400 212 C 404 232, 430 232, 456 208 C 488 178, 528 112, 542 64 C 550 36, 518 34, 504 70 C 488 112, 476 182, 482 212 C 486 232, 514 232, 546 204 C 570 184, 592 152, 622 146 C 586 144, 564 180, 576 212 C 588 236, 636 236, 656 206 C 674 178, 658 148, 624 146 C 638 162, 684 168, 718 144';

export function CinematicPreloader({ onComplete }: { onComplete: () => void }) {
  const [done, setDone] = useState(false);

  // Total preloader duration: ~5.5 seconds (draw ~3.3s + hold/shimmer ~1.6s + exit ~0.6s)
  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setDone(true);
    }, 4950);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 5550);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (done) return;
    setDone(true);
    setTimeout(onComplete, 450);
  };

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="hello-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: 'blur(14px)',
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          }}
          onClick={handleSkip}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050507] overflow-hidden select-none cursor-pointer"
        >
          {/* ─── Rich Dark Obsidian + macOS-Inspired Liquid Aurora Mesh Background ─── */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Soft warm rose / magenta aurora orb (left) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: [0.35, 0.55, 0.4],
                scale: [1, 1.08, 1],
                x: ['-4%', '2%', '-4%'],
                y: ['-3%', '4%', '-3%'],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] max-w-[780px] max-h-[780px] rounded-full blur-[120px]"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(219, 39, 119, 0.28) 0%, rgba(147, 51, 234, 0.16) 45%, transparent 75%)',
              }}
            />

            {/* Electric violet / indigo aurora orb (center-right) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: [0.3, 0.5, 0.35],
                scale: [1.05, 0.96, 1.05],
                x: ['4%', '-3%', '4%'],
                y: ['3%', '-4%', '3%'],
              }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-[20%] -right-[10%] w-[70vw] h-[70vw] max-w-[850px] max-h-[850px] rounded-full blur-[130px]"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(99, 102, 241, 0.28) 0%, rgba(168, 85, 247, 0.18) 45%, transparent 75%)',
              }}
            />

            {/* Subtle central ambient backlight behind "hello" */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.15, 0.3, 0.22] }}
              transition={{ duration: 5, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] h-[38vh] rounded-full blur-[100px]"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(236, 72, 153, 0.16) 0%, rgba(139, 92, 246, 0.14) 50%, transparent 80%)',
              }}
            />

            {/* Subtle dark vignette around edges for obsidian depth */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_75%_at_50%_50%,transparent_40%,rgba(4,4,6,0.88)_100%)]" />
          </div>

          {/* ─── Center Stage: 3D Frosted Glass Tube "hello" Calligraphy ─── */}
          <div className="relative z-10 w-full max-w-[820px] px-6 sm:px-10 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full relative"
            >
              <svg
                viewBox="0 0 780 280"
                className="w-full h-auto overflow-visible"
                aria-label="hello"
              >
                <defs>
                  {/* 3D Cylindrical Specular Lighting Filter for Authentic Glass Tube Depth */}
                  <filter id="hello-3d-glass" x="-20%" y="-20%" width="140%" height="140%">
                    {/* Smooth heightmap from stroke alpha */}
                    <feGaussianBlur in="SourceAlpha" stdDeviation="5.5" result="heightMap" />
                    {/* Top-left studio key light specular reflection */}
                    <feSpecularLighting
                      in="heightMap"
                      surfaceScale="7"
                      specularConstant="1.15"
                      specularExponent="24"
                      lightingColor="#ffffff"
                      result="specularLight"
                    >
                      <feDistantLight azimuth="225" elevation="52" />
                    </feSpecularLighting>
                    {/* Clip specular reflection cleanly inside the tube */}
                    <feComposite
                      in="specularLight"
                      in2="SourceAlpha"
                      operator="in"
                      result="clippedSpecular"
                    />
                    {/* Soft outer frost bloom */}
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="softBody" />
                    {/* Elevation drop shadow */}
                    <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#000000" floodOpacity="0.55" />
                    <feMerge>
                      <feMergeNode in="softBody" />
                      <feMergeNode in="clippedSpecular" />
                    </feMerge>
                  </filter>

                  {/* Translucent frosted glass rim gradient */}
                  <linearGradient id="glass-tube-rim" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 0.72)" />
                    <stop offset="45%" stopColor="rgba(245, 232, 255, 0.56)" />
                    <stop offset="100%" stopColor="rgba(220, 210, 255, 0.68)" />
                  </linearGradient>

                  {/* Soft translucent inner glass core gradient */}
                  <linearGradient id="glass-tube-core" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 0.14)" />
                    <stop offset="50%" stopColor="rgba(255, 235, 250, 0.22)" />
                    <stop offset="100%" stopColor="rgba(230, 230, 255, 0.16)" />
                  </linearGradient>
                </defs>

                {/* Layer 1: Soft ambient outer halo behind the glass tube */}
                <motion.path
                  d={HELLO_PATH}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.10)"
                  strokeWidth="36"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: 'blur(14px)' }}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { duration: 3.3, delay: 0.35, ease: [0.42, 0, 0.18, 1] },
                    opacity: { duration: 0.4, delay: 0.35 },
                  }}
                />

                {/* Layer 2: Main 3D Specular-Lit Frosted Glass Outer Tube */}
                <motion.path
                  d={HELLO_PATH}
                  fill="none"
                  stroke="url(#glass-tube-rim)"
                  strokeWidth="26"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#hello-3d-glass)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.92 }}
                  transition={{
                    pathLength: { duration: 3.3, delay: 0.35, ease: [0.42, 0, 0.18, 1] },
                    opacity: { duration: 0.25, delay: 0.35 },
                  }}
                />

                {/* Layer 3: Translucent Hollow Inner Tube Core (gives authentic jelly-glass depth) */}
                <motion.path
                  d={HELLO_PATH}
                  fill="none"
                  stroke="url(#glass-tube-core)"
                  strokeWidth="15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: 'blur(2.5px)' }}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { duration: 3.3, delay: 0.35, ease: [0.42, 0, 0.18, 1] },
                    opacity: { duration: 0.25, delay: 0.35 },
                  }}
                />

                {/* Layer 4: Fine Top-Edge Specular Glass Highlight */}
                <motion.path
                  d={HELLO_PATH}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.55)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="translate(-1.5, -4)"
                  style={{ filter: 'blur(2px)' }}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0, 0.75, 0.55] }}
                  transition={{
                    pathLength: { duration: 3.3, delay: 0.35, ease: [0.42, 0, 0.18, 1] },
                    opacity: { duration: 3.6, delay: 0.35 },
                  }}
                />
              </svg>
            </motion.div>

            {/* Minimalist Subtle Subtitle after "hello" finishes drawing */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 3.6, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 sm:mt-6 flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.28em] text-white/60 uppercase">
                Dhruv Bajaj · Portfolio
              </span>
            </motion.div>
          </div>

          {/* Subtle Skip Hint at Bottom */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            whileHover={{ opacity: 0.8 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="absolute bottom-7 font-mono text-[10px] tracking-[0.3em] text-white uppercase"
          >
            Click anywhere to enter
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
