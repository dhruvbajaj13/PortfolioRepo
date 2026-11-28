'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Iconic Apple macOS-inspired continuous cursive "hello" vector path
const HELLO_PATH =
  'M 60 212 C 105 192, 158 128, 172 68 C 180 36, 144 34, 132 72 C 118 118, 108 185, 104 224 C 112 174, 140 144, 168 144 C 194 144, 196 174, 192 206 C 190 226, 212 232, 238 220 C 274 204, 314 178, 320 152 C 325 130, 288 130, 272 156 C 254 184, 264 224, 300 226 C 332 228, 364 204, 388 174 C 420 136, 450 96, 460 64 C 468 36, 436 34, 422 70 C 406 112, 394 182, 400 212 C 404 232, 430 232, 456 208 C 488 178, 528 112, 542 64 C 550 36, 518 34, 504 70 C 488 112, 476 182, 482 212 C 486 232, 514 232, 546 204 C 570 184, 592 152, 622 146 C 586 144, 564 180, 576 212 C 588 236, 636 236, 656 206 C 674 178, 658 148, 624 146 C 638 162, 684 168, 718 144';

export function CinematicPreloader({ onComplete }: { onComplete: () => void }) {
  const [done, setDone] = useState(false);

  // Total preloader duration: ~4.5 seconds (draw ~2.8s + hold ~1.15s + exit ~0.55s)
  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setDone(true);
    }, 3950);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4500);

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
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
          }}
          onClick={handleSkip}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030303] overflow-hidden select-none cursor-pointer"
        >
          {/* ─── Deep Black Aurora Background ─── */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Pure black base */}
            <div className="absolute inset-0 bg-[#030303]" />

            {/* Deep cyan-teal whisper orb (top-left) — very dim */}
            <motion.div
              initial={{ opacity: 0.15, scale: 0.95 }}
              animate={{
                opacity: [0.18, 0.28, 0.18],
                scale: [1, 1.08, 1],
                x: ['-5%', '3%', '-5%'],
                y: ['-4%', '4%', '-4%'],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-[20%] -left-[15%] w-[70vw] h-[70vw] max-w-[860px] max-h-[860px] rounded-full will-change-transform"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(56, 189, 248, 0.22) 0%, rgba(14, 165, 233, 0.08) 42%, transparent 72%)',
              }}
            />

            {/* Soft violet glow orb (bottom-right) — very subtle */}
            <motion.div
              initial={{ opacity: 0.15, scale: 1 }}
              animate={{
                opacity: [0.18, 0.30, 0.18],
                scale: [1.04, 0.96, 1.04],
                x: ['4%', '-3%', '4%'],
                y: ['3%', '-4%', '3%'],
              }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-[20%] -right-[15%] w-[72vw] h-[72vw] max-w-[900px] max-h-[900px] rounded-full will-change-transform"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(139, 92, 246, 0.22) 0%, rgba(109, 40, 217, 0.08) 44%, transparent 74%)',
              }}
            />

            {/* Centre neutral glow — lifts the hello text ever so slightly */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(255,255,255,0.025) 0%, transparent 68%)',
              }}
            />

            {/* Deep vignette to push edges to pure black */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_75%_at_50%_50%,transparent_30%,rgba(2,2,2,0.82)_100%)]" />
          </div>

          {/* ─── Center Stage: Pure 3D Frosted Glass Tube "hello" Calligraphy (No Extra Text) ─── */}
          <div className="relative z-10 w-full max-w-[820px] px-6 sm:px-10 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
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
                    <feGaussianBlur in="SourceAlpha" stdDeviation="5.5" result="heightMap" />
                    <feSpecularLighting
                      in="heightMap"
                      surfaceScale="7.5"
                      specularConstant="1.2"
                      specularExponent="24"
                      lightingColor="#ffffff"
                      result="specularLight"
                    >
                      <feDistantLight azimuth="225" elevation="52" />
                    </feSpecularLighting>
                    <feComposite
                      in="specularLight"
                      in2="SourceAlpha"
                      operator="in"
                      result="clippedSpecular"
                    />
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="softBody" />
                    <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#000000" floodOpacity="0.45" />
                    <feMerge>
                      <feMergeNode in="softBody" />
                      <feMergeNode in="clippedSpecular" />
                    </feMerge>
                  </filter>

                  {/* Translucent frosted glass rim gradient */}
                  <linearGradient id="glass-tube-rim" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 0.78)" />
                    <stop offset="50%" stopColor="rgba(250, 236, 255, 0.62)" />
                    <stop offset="100%" stopColor="rgba(226, 220, 255, 0.74)" />
                  </linearGradient>

                  {/* Soft translucent inner glass core gradient */}
                  <linearGradient id="glass-tube-core" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 0.16)" />
                    <stop offset="50%" stopColor="rgba(255, 238, 252, 0.24)" />
                    <stop offset="100%" stopColor="rgba(232, 234, 255, 0.18)" />
                  </linearGradient>
                </defs>

                {/* Layer 1: Soft ambient outer halo behind the glass tube */}
                <motion.path
                  d={HELLO_PATH}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.14)"
                  strokeWidth="36"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: 'blur(14px)' }}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { duration: 2.8, delay: 0.2, ease: [0.42, 0, 0.18, 1] },
                    opacity: { duration: 0.35, delay: 0.2 },
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
                  animate={{ pathLength: 1, opacity: 0.94 }}
                  transition={{
                    pathLength: { duration: 2.8, delay: 0.2, ease: [0.42, 0, 0.18, 1] },
                    opacity: { duration: 0.2, delay: 0.2 },
                  }}
                />

                {/* Layer 3: Translucent Hollow Inner Tube Core */}
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
                    pathLength: { duration: 2.8, delay: 0.2, ease: [0.42, 0, 0.18, 1] },
                    opacity: { duration: 0.2, delay: 0.2 },
                  }}
                />

                {/* Layer 4: Fine Top-Edge Specular Glass Highlight */}
                <motion.path
                  d={HELLO_PATH}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.6)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="translate(-1.5, -4)"
                  style={{ filter: 'blur(2px)' }}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0, 0.8, 0.6] }}
                  transition={{
                    pathLength: { duration: 2.8, delay: 0.2, ease: [0.42, 0, 0.18, 1] },
                    opacity: { duration: 3.1, delay: 0.2 },
                  }}
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
