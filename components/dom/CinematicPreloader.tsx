'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function CinematicPreloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth, gradual progression from 0 to 100
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 450);
          return 100;
        }
        // Steady, gradual increment
        const increment = Math.floor(Math.random() * 4) + 2;
        return Math.min(prev + increment, 100);
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  const getStatusText = (p: number) => {
    if (p < 25) return 'INITIALIZING ENVIRONMENT';
    if (p < 55) return 'DHRUV BAJAJ · SOFTWARE ENGINEER';
    if (p < 85) return 'LOADING PROJECTS & ARCHITECTURE';
    if (p < 100) return 'PREPARING EXPERIENCE';
    return 'READY';
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-12 bg-black text-white select-none overflow-hidden"
    >
      {/* CSS-Only Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Floating gradient orbs */}
        <div
          className="absolute top-1/3 left-1/4 w-[350px] h-[350px] rounded-full blur-[140px] opacity-[0.05]"
          style={{
            background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)',
            animation: 'preloaderFloat1 6s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[160px] opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)',
            animation: 'preloaderFloat2 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[120px] opacity-[0.02]"
          style={{
            background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)',
            animation: 'preloaderFloat3 10s ease-in-out infinite',
          }}
        />

        {/* Animated horizontal scan line */}
        <div
          className="absolute left-0 right-0 h-[1px] opacity-[0.08]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
            animation: 'scanLine 3s linear infinite',
          }}
        />
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes preloaderFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.1); }
        }
        @keyframes preloaderFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-25px, 15px) scale(1.05); }
        }
        @keyframes preloaderFloat3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.02; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.05; }
        }
        @keyframes scanLine {
          0% { top: -2%; }
          100% { top: 102%; }
        }
      `}</style>

      {/* Subtle Ambient Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_65%)] pointer-events-none z-[1]" />

      {/* Top Bar Indicators */}
      <div className="w-full flex items-center justify-between font-mono text-[10px] text-white/40 tracking-widest uppercase z-10">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          DHRUV BAJAJ
        </span>
        <span>PORTFOLIO // 2025</span>
      </div>

      {/* Dead-Center Minimalist 0-100 Counter */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto space-y-5 px-4 text-center">
        {/* Large Cinematic Number */}
        <div className="flex items-baseline justify-center">
          <motion.span
            key={progress}
            className="font-display font-black text-6xl sm:text-8xl md:text-9xl text-white tracking-tighter tabular-nums"
          >
            {progress < 10 ? `0${progress}` : progress}
          </motion.span>
          <span className="font-mono text-2xl sm:text-4xl text-white/40 font-light ml-1 sm:ml-2">
            %
          </span>
        </div>

        {/* Minimalist Glowing Progress Line */}
        <div className="w-44 sm:w-64 h-[2px] bg-white/10 rounded-full overflow-hidden relative shadow-inner">
          <motion.div
            className="h-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Subtitle / Status Text */}
        <motion.p
          key={getStatusText(progress)}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="font-mono text-[11px] sm:text-xs text-white/60 tracking-[0.25em] uppercase text-center"
        >
          {getStatusText(progress)}
        </motion.p>
      </div>

      {/* Bottom Bar Indicators */}
      <div className="w-full flex items-center justify-between font-mono text-[10px] text-white/40 tracking-widest uppercase z-10">
        <span>NSUT // DELHI</span>
        <span>SYSTEM: {progress === 100 ? 'ONLINE' : 'BOOTING'}</span>
      </div>
    </motion.div>
  );
}
