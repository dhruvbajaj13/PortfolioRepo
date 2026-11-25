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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#080510] overflow-hidden select-none cursor-pointer"
        >
          {/* ─── Rich macOS-Inspired Luminous Mesh Aurora Background ─── */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Base diagonal warm-rose to deep-indigo wash */}
            <div
              className="absolute inset-0 opacity-85"
              style={{
                background:
                  'linear-gradient(125deg, #2a0e24 0%, #1c0f2e 38%, #121033 72%, #080510 100%)',
              }}
            />

            {/* Luminous warm rose / magenta aurora orb (top-left) */}
            <motion.div
              initial={{ opacity: 0.4, scale: 0.95 }}
              animate={{
                opacity: [0.55, 0.78, 0.6],
                scale: [1, 1.1, 1],
                x: ['-5%', '4%', '-5%'],
                y: ['-4%', '5%', '-4%'],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-[18%] -left-[12%] w-[72vw] h-[72vw] max-w-[900px] max-h-[900px] rounded-full blur-[110px]"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(236, 72, 153, 0.45) 0%, rgba(190, 24, 93, 0.25) 42%, transparent 74%)',
              }}
            />

            {/* Soft coral-pink highlight orb (center-left) */}
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{
                opacity: [0.35, 0.55, 0.38],
                scale: [0.98, 1.08, 0.98],
                x: ['2%', '-5%', '2%'],
                y: ['4%', '-3%', '4%'],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[15%] left-[10%] w-[52vw] h-[52vw] max-w-[680px] max-h-[680px] rounded-full blur-[120px]"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(244, 114, 182, 0.30) 0%, rgba(168, 85, 247, 0.18) 50%, transparent 76%)',
              }}
            />

            {/* Deep violet / electric indigo aurora orb (bottom-right) */}
            <motion.div
              initial={{ opacity: 0.4, scale: 1 }}
              animate={{
                opacity: [0.5, 0.72, 0.55],
                scale: [1.06, 0.96, 1.06],
                x: ['5%', '-4%', '5%'],
                y: ['4%', '-5%', '4%'],
              }}
              transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-[22%] -right-[12%] w-[75vw] h-[75vw] max-w-[940px] max-h-[940px] rounded-full blur-[120px]"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(99, 102, 241, 0.45) 0%, rgba(139, 92, 246, 0.28) 45%, transparent 75%)',
              }}
            />

            {/* Soft cyan-indigo rim whisper (top-right) */}
            <motion.div
              animate={{
                opacity: [0.22, 0.38, 0.22],
                scale: [1, 1.06, 1],
              }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-[15%] right-[5%] w-[45vw] h-[45vw] max-w-[580px] max-h-[580px] rounded-full blur-[130px]"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(59, 130, 246, 0.28) 0%, transparent 72%)',
              }}
            />

            {/* Subtle dark radial vignette to frame the glass calligraphy */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_80%_at_50%_50%,transparent_35%,rgba(5,4,10,0.68)_100%)]" />
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
