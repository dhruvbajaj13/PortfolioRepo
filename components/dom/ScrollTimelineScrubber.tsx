'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SECTIONS = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Journey' },
  { id: 'cp-stats', label: 'Coding' },
  { id: 'achievements', label: 'Honors' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export function ScrollTimelineScrubber({ activeScene = 0 }: { activeScene?: number }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, Math.round(currentProgress))));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      aria-label="Page scroll timeline"
      className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center py-4 px-2 rounded-full border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] pointer-events-auto transition-opacity duration-300"
    >
      {/* Nodes list */}
      <div className="relative flex flex-col items-center gap-3.5 my-1">
        {/* Vertical subtle track line */}
        <div className="absolute top-1 bottom-1 w-[1px] bg-white/10 -z-10" />

        {SECTIONS.map((sec, i) => {
          const isActive = activeScene === i;
          return (
            <div
              key={sec.id}
              className="relative flex items-center justify-center cursor-pointer group"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => scrollToSection(sec.id)}
            >
              {/* Tooltip on hover (slides in from right to left) */}
              <AnimatePresence>
                {hoveredIdx === i && (
                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: -12 }}
                    exit={{ opacity: 0, x: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-full whitespace-nowrap px-2.5 py-1 rounded-lg border border-white/15 bg-black/90 backdrop-blur-xl shadow-lg pointer-events-none z-50 flex items-center gap-1.5"
                  >
                    <span className="font-mono text-[9px] text-white/40">0{i + 1}</span>
                    <span className="font-sans text-xs font-semibold text-white tracking-wide">
                      {sec.label}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Node Bead */}
              <button
                type="button"
                aria-label={`Scroll to ${sec.label}`}
                className={`relative rounded-full transition-all duration-300 flex items-center justify-center ${
                  isActive
                    ? 'w-3 h-3 bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] scale-110'
                    : 'w-2 h-2 bg-white/25 hover:bg-white/70 hover:scale-125'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeScrubberIndicator"
                    className="absolute inset-[-4px] rounded-full border border-white/50 animate-pulse pointer-events-none"
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Real-time Percentage indicator */}
      <div className="mt-3 pt-2 border-t border-white/10 font-mono text-[9px] text-white/50 tracking-tighter">
        {scrollProgress}%
      </div>
    </div>
  );
}
