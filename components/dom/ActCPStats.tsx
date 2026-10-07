'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const PLATFORM_ICON_COLORS: Record<string, string> = {
  leetcode: '#FFA116',
  geeksforgeeks: '#2F8D46',
  codeforces: '#318CE7',
  codechef: '#B97D4B',
};

function LeetCodeLogo({ color }: { color?: string }) {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill={color || 'currentColor'}>
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .666-1.607L9.4 8.447l4.77-4.676c.54-.54.54-1.414.003-1.955A1.374 1.374 0 0 0 13.483 0z" />
      <path d="M16.517 7.915a1.378 1.378 0 0 0-1.375 1.378v4.945c0 .762.614 1.378 1.375 1.378.762 0 1.378-.616 1.378-1.378V9.293c0-.762-.616-1.378-1.378-1.378z" />
    </svg>
  );
}

function GeeksforGeeksLogo({ color }: { color?: string }) {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill={color || 'currentColor'}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 15.344c-.75.75-1.781 1.156-2.844 1.156-1.062 0-2.094-.406-2.844-1.156l-.375-.375-.375.375c-.75.75-1.781 1.156-2.844 1.156-1.062 0-2.094-.406-2.844-1.156-1.562-1.562-1.562-4.125 0-5.688l3.219-3.219c.75-.75 1.781-1.156 2.844-1.156 1.062 0 2.094.406 2.844 1.156l.375.375.375-.375c.75-.75 1.781-1.156 2.844-1.156 1.062 0 2.094.406 2.844 1.156 1.562 1.562 1.562 4.125 0 5.688l-3.219 3.219z" />
    </svg>
  );
}

function CodeforcesLogo({ color }: { color?: string }) {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill={color || 'currentColor'}>
      <path d="M4.5 7.5A1.5 1.5 0 0 1 6 9v10.5A1.5 1.5 0 0 1 4.5 21h-3A1.5 1.5 0 0 1 0 19.5V9a1.5 1.5 0 0 1 1.5-1.5h3zm7.5-4.5A1.5 1.5 0 0 1 13.5 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 7.5 19.5V4.5A1.5 1.5 0 0 1 9 3h3zm7.5 9a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-6a1.5 1.5 0 0 1 1.5-1.5h3z" />
    </svg>
  );
}

function CodeChefLogo({ color }: { color?: string }) {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill={color || 'currentColor'}>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function AnimatedCounter({ target, duration = 1.2 }: { target: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  const targetNum = parseInt(target.replace(/[^0-9]/g, ''), 10) || 0;
  const hasPlus = target.includes('+');

  useEffect(() => {
    if (!isInView || targetNum === 0) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * targetNum));
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
      { label: 'Solved', value: '1100+' },
      { label: 'Max Rating', value: '1951' },
      { label: 'Contests', value: '42' },
    ],
    graphs: [
      { src: '/images/leetcode_rating.png', alt: 'LeetCode Rating Graph — Knight 1951' },
      { src: '/images/leetcode_streak.png', alt: 'LeetCode 365+ Day Streak & 4000+ Submissions' },
    ],
    Logo: LeetCodeLogo,
  },
  {
    id: 'codechef',
    name: 'CodeChef',
    tagline: 'Long & Starters Contests',
    badge: '3★ Division · Max 1605',
    profileUrl: 'https://www.codechef.com/users/dhruvvv_1307',
    stats: [
      { label: 'Solved', value: '70+' },
      { label: 'Max Rating', value: '1605' },
      { label: 'Contests', value: '17' },
    ],
    graphs: [
      { src: '/images/codechef_graph.png', alt: 'CodeChef Rating Graph — 3★ 1605' },
    ],
    Logo: CodeChefLogo,
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
    graphs: [
      { src: '/images/codeforces_graph.png', alt: 'Codeforces Rating Graph' },
    ],
    Logo: CodeforcesLogo,
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
    graphs: [] as { src: string; alt: string }[],
    Logo: GeeksforGeeksLogo,
  },
];

export function ActCPStats() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = PLATFORMS_DATA[activeIdx];

  return (
    <section
      id="cp-stats"
      className="relative w-full px-4 sm:px-8 md:px-16 py-20 md:py-28 bg-[#050505]"
    >
      <div className="max-w-4xl mx-auto">

        {/* Section Header */}
        <div className="mb-8 md:mb-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase mb-3"
          >
            — Competitive Programming —
          </motion.p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none"
            >
              CP Profile
            </motion.h2>
            <span className="font-mono text-xs text-white/40 tracking-wider">
              [ 1100+ Solved · Knight 1951 · 3★ 1605 ]
            </span>
          </div>
        </div>

        {/* Top Horizontal Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 no-scrollbar">
          {PLATFORMS_DATA.map((plat, i) => {
            const { Logo } = plat;
            const isSelected = activeIdx === i;
            const iconColor = PLATFORM_ICON_COLORS[plat.id];
            return (
              <button
                key={plat.id}
                type="button"
                onClick={() => setActiveIdx(i)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-sans transition-all duration-300 shrink-0 border ${
                  isSelected
                    ? 'bg-white text-black font-bold border-white shadow-[0_0_16px_rgba(255,255,255,0.35)] scale-105'
                    : 'bg-white/[0.03] text-white/60 border-white/10 hover:border-white/30 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <Logo color={isSelected ? '#000' : iconColor} />
                <span>{plat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Full-Width Platform Details Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-white/10 bg-[#0C0C0E]/95 p-4 sm:p-6 shadow-2xl flex flex-col gap-4"
          >
            {/* Header: Platform Branding & Direct Profile Link Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center"
                  style={{ color: PLATFORM_ICON_COLORS[active.id] }}
                >
                  <active.Logo color={PLATFORM_ICON_COLORS[active.id]} />
                </div>
                <div>
                  <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight">
                    {active.name}
                  </h3>
                  <p className="text-white/50 text-[10px] font-mono tracking-wider uppercase mt-0.5">
                    {active.tagline}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-bold font-mono px-3 py-1 rounded-full border border-white/20 bg-white/10 text-white shadow-sm">
                  {active.badge}
                </span>

                <a
                  href={active.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg border border-white/15 bg-white text-black font-sans font-bold text-[10px] uppercase tracking-wider hover:scale-105 transition-all shadow-md"
                >
                  <span>Profile</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Stats Row — compact */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {active.stats.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col gap-0.5 p-2.5 rounded-xl border border-white/8 bg-white/[0.02] text-center hover:border-white/25 transition-colors"
                >
                  <span className="font-display font-black text-xl sm:text-2xl text-white tracking-tight">
                    <AnimatedCounter target={s.value} />
                  </span>
                  <span className="font-mono text-[9px] tracking-widest text-white/50 uppercase">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Platform Graph Images - Compact & Balanced */}
            {active.graphs.length > 0 && (
              <div
                className={`grid grid-cols-1 ${
                  active.graphs.length > 1
                    ? 'sm:grid-cols-2 gap-3'
                    : 'max-w-2xl mx-auto w-full'
                } pt-1`}
              >
                {active.graphs.map((g) => (
                  <div
                    key={g.src}
                    className="rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0c] p-2 sm:p-2.5 flex items-center justify-center hover:border-white/25 transition-all group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={g.src}
                      alt={g.alt}
                      className={`w-auto max-w-full rounded-lg object-contain ${
                        active.graphs.length > 1
                          ? 'max-h-[175px] sm:max-h-[200px]'
                          : 'max-h-[230px] sm:max-h-[270px]'
                      } group-hover:scale-[1.01] transition-transform duration-300`}
                    />
                  </div>
                ))}
              </div>
            )}

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
