'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

/* ─── Official Brand Logos (exact brand colors, SVG paths) ─── */

const LeetCodeLogo = () => (
  <svg viewBox="0 0 95 111" fill="none" className="w-6 h-6">
    <path d="M68.5 37.1H46.9c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5H68.5c1.4 0 2.5-1.1 2.5-2.5s-1.1-2.5-2.5-2.5z" fill="#FFA116"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M42 72.7L13.3 44c-5-5-5-13.1 0-18.1L32.6 6.6c5-5 13.1-5 18.1 0l54 54c5 5 5 13.1 0 18.1L85.4 88c-5 5-13.1 5-18.1 0L42 62.8V72.7zM47.5 7.9c-3.1 0-6.2 1.2-8.5 3.5L19.7 30.7c-4.7 4.7-4.7 12.3 0 17L42 70l-3.5 3.5V90l30 30c2.3 2.3 5.4 3.5 8.5 3.5s6.2-1.2 8.5-3.5l19.3-19.3c4.7-4.7 4.7-12.3 0-17L47.5 7.9z" fill="#FFA116"/>
    <path d="M56 68.5c-2.8 2.8-7.4 2.8-10.2 0L13.3 36c-2.8-2.8-2.8-7.4 0-10.2L32.6 6.5c2.8-2.8 7.4-2.8 10.2 0l32.5 32.5-3.5 3.5-32-32c-1.4-1.4-3.7-1.4-5.1 0L15.4 29.8c-1.4 1.4-1.4 3.7 0 5.1l32.5 32.5-3.5 3.5 11.6 11.6c2.8 2.8 7.4 2.8 10.2 0l19.3-19.3c1.4-1.4 1.4-3.7 0-5.1L56 68.5z" fill="#B3B3B3"/>
  </svg>
);

const CodeforcesLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
    <rect x="1" y="8" width="6" height="13" rx="1.5" fill="#1890FF"/>
    <rect x="9" y="2" width="6" height="19" rx="1.5" fill="#E74C3C"/>
    <rect x="17" y="12" width="6" height="9" rx="1.5" fill="#1890FF"/>
  </svg>
);

const CodeChefLogo = () => (
  <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none">
    <circle cx="20" cy="20" r="20" fill="#5B4638"/>
    <path d="M20 7c-1.7 0-3 1.3-3 3 0 1.1.6 2.1 1.5 2.6C15.4 13.6 13 16.6 13 20c0 1.5.4 2.9 1.1 4.1C12.4 25 11 26.9 11 29c0 2.2 1.8 4 4 4s4-1.8 4-4h2c0 2.2 1.8 4 4 4s4-1.8 4-4c0-2.1-1.4-4-3.1-4.9.7-1.2 1.1-2.6 1.1-4.1 0-3.4-2.4-6.4-5.5-7.4.9-.5 1.5-1.5 1.5-2.6 0-1.7-1.3-3-3-3zm0 2c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm0 5c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5zm-5 12.3c.5.4 1 .7 1.6.9-.4.6-.6 1.2-.6 1.8 0 1.1-.9 2-2 2s-2-.9-2-2c0-1.1.9-2 2-2 .4 0 .7.1 1 .3zm10 0c.3-.2.6-.3 1-.3 1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2c0-.6-.2-1.2-.6-1.8.6-.2 1.1-.5 1.6-.9z" fill="#F5C518"/>
  </svg>
);

const GeeksforGeeksLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm-1.25 5.5a1.25 1.25 0 0 0-1.25 1.25v2.5a1.25 1.25 0 0 1-1.25 1.25 1.25 1.25 0 0 1 1.25 1.25v2.5A1.25 1.25 0 0 0 10.75 17h.5a.75.75 0 0 0 0-1.5h-.25v-2.25a2.75 2.75 0 0 0-2.25-2.7 2.75 2.75 0 0 0 2.25-2.7V7.5h.25a.75.75 0 0 0 0-1.5h-.5zm2.5 0a.75.75 0 0 0 0 1.5h.25v.35a2.75 2.75 0 0 0 2.25 2.7 2.75 2.75 0 0 0-2.25 2.7v2.25h-.25a.75.75 0 0 0 0 1.5h.5a1.25 1.25 0 0 0 1.25-1.25v-2.5a1.25 1.25 0 0 1 1.25-1.25 1.25 1.25 0 0 1-1.25-1.25v-2.5A1.25 1.25 0 0 0 13.25 7.5h-.5z"
      fill="#2F8D46"
    />
  </svg>
);

/* ─── Animated Counter ─── */
function AnimatedCounter({ target, duration = 1000 }: { target: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  const numMatch = target.match(/\d+/);
  const targetNum = numMatch ? parseInt(numMatch[0], 10) : 0;
  const hasPlus = target.includes('+');

  useEffect(() => {
    if (!isInView || targetNum === 0) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * targetNum));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, targetNum, duration]);

  if (targetNum === 0) return <span ref={ref}>{target}</span>;
  return <span ref={ref}>{count.toLocaleString()}{hasPlus ? '+' : ''}</span>;
}

const PLATFORMS_DATA = [
  {
    id: 'leetcode',
    name: 'LeetCode',
    tagline: 'Primary Algorithmic Platform',
    badge: 'Knight · Top 3%',
    profileUrl: 'https://leetcode.com/u/nobodyknowswhy/',
    stats: [
      { label: 'Solved', value: '1000+' },
      { label: 'Rating', value: '1933' },
      { label: 'Contests', value: '42' },
    ],
    Logo: LeetCodeLogo,
  },
  {
    id: 'geeksforgeeks',
    name: 'GeeksforGeeks',
    tagline: 'DSA & Core Problem Solving',
    badge: 'Consistent Problem Solver',
    profileUrl: 'https://www.geeksforgeeks.org/profile/d4ba0ewg',
    stats: [
      { label: 'Solved', value: '60+' },
      { label: 'Score', value: '180+' },
      { label: 'Streak', value: 'Active' },
    ],
    Logo: GeeksforGeeksLogo,
  },
  {
    id: 'codeforces',
    name: 'Codeforces',
    tagline: 'Speed & Math Problems',
    badge: 'Newbie → Pupil',
    profileUrl: 'https://codeforces.com/profile/dhruvvv_1307',
    stats: [
      { label: 'Solved', value: '70+' },
      { label: 'Rating', value: '1198' },
      { label: 'Contests', value: '10+' },
    ],
    Logo: CodeforcesLogo,
  },
  {
    id: 'codechef',
    name: 'CodeChef',
    tagline: 'Long & Starters Contests',
    badge: '3★ Division',
    profileUrl: 'https://www.codechef.com/users/dhruvvv_1307',
    stats: [
      { label: 'Solved', value: '70+' },
      { label: 'Rating', value: '1605' },
      { label: 'Contests', value: '17' },
    ],
    Logo: CodeChefLogo,
  },
];

export function ActCPStats() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = PLATFORMS_DATA[activeIdx];

  return (
    <section
      id="cp-stats"
      className="relative w-full px-4 sm:px-8 md:px-16 py-24 md:py-32 bg-[#050505]"
    >
      <div className="max-w-6xl mx-auto">

        {/* Section Header — same premium style as Experience */}
        <div className="mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase mb-4"
          >
            — Competitive Programming —
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none"
          >
            CP Profile
          </motion.h2>
        </div>

        {/* Two-column layout — identical to Experience layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">

          {/* Left column – clickable platform list */}
          <div className="lg:w-[42%] flex flex-col gap-3">
            {PLATFORMS_DATA.map((plat, i) => {
              const { Logo } = plat;
              return (
                <motion.button
                  key={plat.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  onClick={() => setActiveIdx(i)}
                  className={`group text-left w-full px-6 py-5 rounded-2xl border transition-all duration-300 flex justify-between items-center gap-4 ${
                    activeIdx === i
                      ? 'bg-[#FF6B2C]/5 border-[#FF6B2C]/40 shadow-[0_0_20px_rgba(255,107,44,0.08)]'
                      : 'bg-white/[0.02] border-white/8 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center shrink-0 bg-white/5">
                      <Logo />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className={`font-display font-bold text-lg md:text-xl tracking-tight transition-colors leading-tight ${activeIdx === i ? 'text-white' : 'text-white/50 group-hover:text-white/85'}`}>
                        {plat.name}
                      </span>
                      <span className={`text-xs font-light transition-colors ${activeIdx === i ? 'text-[#FF6B2C]' : 'text-white/35 group-hover:text-white/50'}`}>
                        {plat.tagline}
                      </span>
                    </div>
                  </div>

                  {/* Active indicator line on right */}
                  <div className={`w-0.5 h-10 rounded-full flex-shrink-0 transition-all duration-300 ${activeIdx === i ? 'bg-[#FF6B2C] shadow-[0_0_8px_#FF6B2C]' : 'bg-white/10'}`} />
                </motion.button>
              );
            })}
          </div>

          {/* Right column – platform details */}
          <div className="lg:flex-1 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10 flex flex-col justify-between h-full gap-8 min-h-[300px]"
              >
                {/* Brand + Badge Title */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl border border-white/15 bg-white/5 flex items-center justify-center">
                      <active.Logo />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight">
                        {active.name}
                      </h3>
                      <p className="text-white/40 text-xs font-mono tracking-wider uppercase mt-0.5">
                        {active.tagline}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold font-mono px-3.5 py-1.5 rounded-full border border-[#FF6B2C]/25 bg-[#FF6B2C]/10 text-[#FF6B2C] shadow-sm">
                    {active.badge}
                  </span>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 py-2">
                  {active.stats.map((s, idx) => (
                    <div key={s.label} className="flex flex-col gap-1 p-4 rounded-xl border border-white/8 bg-white/[0.02] text-center hover:border-[#FF6B2C]/30 transition-colors">
                      <span className="font-display font-black text-2xl md:text-3xl text-white tracking-tight">
                        <AnimatedCounter target={s.value} />
                      </span>
                      <span className="font-mono text-[10px] tracking-widest text-[#FF6B2C]/70 uppercase">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* LeetCode Consistency Streak Banner (Visible only when LeetCode is selected) */}
                {active.id === 'leetcode' && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="p-3.5 sm:p-5 rounded-2xl border border-white/10 bg-[#0B0B0B] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-mono text-xs font-semibold text-white/90">
                          366-Day Problem Solving Streak
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-emerald-400/90 border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                        Daily Active
                      </span>
                    </div>

                    <div className="rounded-xl overflow-hidden border border-white/8 bg-[#141414]/90 p-1 sm:p-2">
                      <img
                        src="/images/leetcode_streak.png"
                        alt="LeetCode 4,000 Submissions with 366 Max Streak"
                        className="w-full h-auto object-contain rounded-lg"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Direct Link Button */}
                <div className="pt-6 border-t border-white/8 mt-auto flex justify-end">
                  <a
                    href={active.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl border border-white/10 hover:border-[#FF6B2C] text-white font-semibold uppercase tracking-wider text-xs bg-white/5 hover:bg-[#FF6B2C] hover:text-black transition-all duration-300 shadow-lg hover:scale-105"
                  >
                    <span>View Profile</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
