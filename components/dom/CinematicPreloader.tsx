'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// ─── Cute Running Cartoon Astronaut / Coder Character SVG ───
function CartoonRunner({ isComplete }: { isComplete: boolean }) {
  return (
    <div className={`relative flex items-center justify-center ${isComplete ? 'animate-bounce' : 'runner-bob'}`}>
      {/* Trailing speed dust puffs */}
      {!isComplete && (
        <div className="absolute -left-3 bottom-0.5 flex gap-0.5 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 dust-puff" style={{ animationDelay: '0s' }} />
          <span className="w-1 h-1 rounded-full bg-white/70 dust-puff" style={{ animationDelay: '0.12s' }} />
        </div>
      )}

      {/* Cute Cyber Astronaut / Mini Coder Runner */}
      <svg width="28" height="32" viewBox="0 0 28 32" fill="none" className="drop-shadow-[0_0_10px_rgba(0,240,255,0.85)]">
        {/* Jetpack with Glowing Thruster */}
        <rect x="3" y="10" width="4" height="10" rx="1.5" fill="#a855f7" />
        <rect x="4" y="12" width="2" height="6" rx="1" fill="#c084fc" />

        {/* Jet flame trail */}
        {!isComplete && (
          <path d="M1 15 L4 13 L4 17 Z" fill="#00f0ff" className="animate-pulse" />
        )}

        {/* Body Torso */}
        <rect x="7" y="10" width="11" height="11" rx="3" fill="#ffffff" />
        <rect x="9.5" y="12" width="6" height="5" rx="1.5" fill="#0f172a" />
        {/* Glowing chest core */}
        <circle cx="12.5" cy="14.5" r="1.5" fill="#00f0ff" />

        {/* Head Helmet */}
        <rect x="7.5" y="2" width="10" height="9" rx="4.5" fill="#ffffff" />
        {/* Helmet Visor */}
        <rect x="10.5" y="3.5" width="7" height="5.5" rx="2.5" fill="#00f0ff" />
        {/* Visor shine */}
        <ellipse cx="14.5" cy="5" rx="2" ry="1" fill="#ffffff" opacity="0.8" />

        {/* Antenna with blinking light */}
        <line x1="12.5" y1="2" x2="12.5" y2="0.5" stroke="#ffffff" strokeWidth="1" />
        <circle cx="12.5" cy="0.5" r="1" fill={isComplete ? '#10b981' : '#f59e0b'} className="animate-ping" />

        {/* Front Arm (Swinging) */}
        <g className={isComplete ? 'origin-[15px_11px] -rotate-45' : 'arm-front origin-[15px_11px]'}>
          <rect x="14" y="11" width="3.5" height="7" rx="1.5" fill="#ffffff" />
          <circle cx="15.8" cy="18" r="1.5" fill="#00f0ff" />
        </g>

        {/* Back Arm (Swinging) */}
        <g className={isComplete ? 'origin-[8px_11px] rotate-45' : 'arm-back origin-[8px_11px]'}>
          <rect x="7" y="11" width="3" height="6.5" rx="1.5" fill="#94a3b8" />
          <circle cx="8.5" cy="17.5" r="1.2" fill="#a855f7" />
        </g>

        {/* Front Leg (Running cycle) */}
        <g className={isComplete ? 'origin-[14px_20px] translate-y-0.5' : 'leg-front origin-[14px_20px]'}>
          <rect x="12.5" y="20" width="3.5" height="7.5" rx="1.5" fill="#ffffff" />
          <rect x="12.5" y="26" width="5.5" height="3" rx="1" fill="#00f0ff" />
        </g>

        {/* Back Leg (Running cycle) */}
        <g className={isComplete ? 'origin-[10px_20px]' : 'leg-back origin-[10px_20px]'}>
          <rect x="8.5" y="20" width="3" height="7" rx="1.5" fill="#94a3b8" />
          <rect x="7.5" y="25.5" width="5" height="3" rx="1" fill="#a855f7" />
        </g>
      </svg>
    </div>
  );
}

export function CinematicPreloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Ultra-fast, snappy cyber boot sequence (~420ms total)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 160);
          return 100;
        }
        // Rapid energetic increments
        const increment = Math.floor(Math.random() * 7) + 5;
        return Math.min(prev + increment, 100);
      });
    }, 18);

    return () => clearInterval(interval);
  }, [onComplete]);

  const getStatusText = (p: number) => {
    if (p < 25) return 'INITIALIZING SYSTEM MATRIX';
    if (p < 55) return 'DHRUV BAJAJ // FULL-STACK AI SDE';
    if (p < 85) return 'SYNCING LEETCODE KNIGHT 1951';
    return 'SYSTEM ONLINE // LAUNCHING';
  };

  const isComplete = progress >= 100;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.35, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-12 bg-[#050508] text-white select-none overflow-hidden"
    >
      {/* CSS Running Cycle Animations */}
      <style jsx global>{`
        .runner-bob {
          animation: runnerBob 0.3s ease-in-out infinite alternate;
        }
        @keyframes runnerBob {
          0% { transform: translateY(0px) rotate(4deg); }
          100% { transform: translateY(-4px) rotate(7deg); }
        }
        .leg-front {
          animation: legSwingFront 0.3s ease-in-out infinite alternate;
        }
        @keyframes legSwingFront {
          0% { transform: rotate(-35deg); }
          100% { transform: rotate(35deg); }
        }
        .leg-back {
          animation: legSwingBack 0.3s ease-in-out infinite alternate;
        }
        @keyframes legSwingBack {
          0% { transform: rotate(35deg); }
          100% { transform: rotate(-35deg); }
        }
        .arm-front {
          animation: armSwingFront 0.3s ease-in-out infinite alternate;
        }
        @keyframes armSwingFront {
          0% { transform: rotate(30deg); }
          100% { transform: rotate(-30deg); }
        }
        .arm-back {
          animation: armSwingBack 0.3s ease-in-out infinite alternate;
        }
        @keyframes armSwingBack {
          0% { transform: rotate(-30deg); }
          100% { transform: rotate(30deg); }
        }
        .dust-puff {
          animation: dustPuff 0.35s ease-out infinite;
        }
        @keyframes dustPuff {
          0% { opacity: 0.8; transform: scale(1) translateX(0); }
          100% { opacity: 0; transform: scale(0.2) translateX(-14px); }
        }
      `}</style>

      {/* Cyber Grid Background (Lightweight Pure CSS, 0% GPU load) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff08_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff08_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Radial Vignette & Neon Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.08)_0%,rgba(168,85,247,0.04)_45%,transparent_75%)] pointer-events-none" />

      {/* Top Header Chrome */}
      <div className="w-full flex items-center justify-between font-mono text-[10px] text-white/50 tracking-widest uppercase z-10">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shadow-[0_0_8px_#00f0ff]" />
          DHRUV BAJAJ // PORTFOLIO
        </span>
        <span className="text-white/40 font-mono">NODE v20 // READY</span>
      </div>

      {/* Center 0-100 Counter with Animated Cartoon Runner on Glowing Laser Track */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto space-y-4 px-4 text-center">
        {/* Large Digital Counter */}
        <div className="flex items-baseline justify-center">
          <motion.span
            key={progress}
            className="font-display font-black text-6xl sm:text-8xl md:text-9xl text-white tracking-tighter tabular-nums drop-shadow-[0_0_25px_rgba(0,240,255,0.3)]"
          >
            {progress < 10 ? `0${progress}` : progress}
          </motion.span>
          <span className="font-mono text-2xl sm:text-4xl text-cyan-400 font-light ml-1 sm:ml-2">
            %
          </span>
        </div>

        {/* Progress Track with Cartoon Runner Moving Across */}
        <div className="w-64 sm:w-84 pt-6 pb-2 relative">
          {/* Animated Runner positioned along the progress percentage */}
          <div
            className="absolute top-0 -translate-x-1/2 transition-all duration-75 ease-out z-20 pointer-events-none"
            style={{ left: `${Math.min(Math.max(progress, 4), 96)}%` }}
          >
            <CartoonRunner isComplete={isComplete} />
          </div>

          {/* Glowing Laser Progress Bar */}
          <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden relative shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-[#7c3aed] via-[#00f0ff] to-[#ffffff] shadow-[0_0_16px_rgba(0,240,255,1)] rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Status Indicator Subtitle */}
        <motion.p
          key={getStatusText(progress)}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.12 }}
          className="font-mono text-[10.5px] sm:text-xs text-cyan-300/80 tracking-[0.25em] uppercase text-center"
        >
          {getStatusText(progress)}
        </motion.p>
      </div>

      {/* Bottom Diagnostics Footer */}
      <div className="w-full flex items-center justify-between font-mono text-[10px] text-white/40 tracking-widest uppercase z-10">
        <span>NSUT DELHI · CSE</span>
        <span className="text-emerald-400 font-mono font-medium">
          {progress === 100 ? 'STATUS: ONLINE 100%' : 'BOOTING...'}
        </span>
      </div>
    </motion.div>
  );
}
