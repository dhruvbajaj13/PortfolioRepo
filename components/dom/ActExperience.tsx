'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, MapPin, Calendar } from 'lucide-react';

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  duration: string;
  year: string;
  bullets: string[];
  tech: string[];
  link?: string;
}

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'gomed',
    role: 'Full Stack Developer Intern',
    company: 'GOMed',
    location: 'Delhi, India · Hybrid',
    duration: 'May 2026 – July 2026',
    year: '2026',
    bullets: [
      'Developed an asynchronous background worker to synchronize user contact updates with Brevo, ensuring external API delays did not block GOmed’s core application workflows.',
      'Implemented atomic job claiming and idempotent synchronization logic to ensure concurrency-safe retries, prevent duplicate contacts, and avoid repeated job processing.',
    ],
    tech: ['Java', 'Svelte', 'Node.js', 'REST APIs', 'Git'],
    link: '#',
  },
  {
    id: 'gssoc',
    role: 'Open Source Contributor',
    company: 'GirlScript Summer of Code',
    location: 'Remote',
    duration: 'June 2025 – Oct 2025',
    year: '2025',
    bullets: [
      'Contributed core pull requests to high-impact open-source web apps, implementing UI components and optimizing performance.',
      'Participated in code reviews, bug fixes, and documentation across multi-maintainer repositories.',
    ],
    tech: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    link: '#',
  },
  {
    id: 'nexel',
    role: 'Frontend Developer Intern',
    company: 'Nexel – Futurize the Innovation',
    location: 'Remote',
    duration: 'Jan 2025 – Feb 2025',
    year: '2025',
    bullets: [
      'Designed and engineered responsive client interfaces, enhancing user engagement and accessibility.',
      'Optimized asset loading and state management for smoother client-side navigation.',
    ],
    tech: ['React.js', 'JavaScript', 'Tailwind CSS', 'Framer Motion'],
    link: '#',
  },
];

export function ActExperience() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = EXPERIENCES[activeIdx];

  return (
    <section
      id="experience"
      className="relative w-full px-4 sm:px-8 md:px-16 py-24 md:py-32 bg-[#050505]"
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase mb-4"
          >
            — Work Experience —
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="heading-hover-sweep font-display text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter uppercase leading-none"
          >
            Experience
          </motion.h2>
        </div>

        {/* Main layout: Left list + Right detail panel */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">

          {/* Left column – clickable role list */}
          <div className="lg:w-[42%] flex flex-col gap-3">
            {EXPERIENCES.map((exp, i) => (
              <motion.button
                key={exp.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => setActiveIdx(i)}
                className={`group text-left w-full px-5 sm:px-6 py-4 sm:py-5 rounded-2xl border transition-all duration-300 flex justify-between items-start gap-4 hover:translate-x-1.5 ${
                  activeIdx === i
                    ? 'bg-white/5 border-white/40 shadow-[0_0_25px_rgba(255,255,255,0.08)]'
                    : 'bg-white/[0.02] border-white/8 hover:border-white/30 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className={`font-mono text-[10px] tracking-widest uppercase transition-colors ${activeIdx === i ? 'text-white font-bold' : 'text-white/30 group-hover:text-white/50'}`}>
                    {exp.year} · {exp.location}
                  </span>
                  <span className={`font-display font-bold text-lg md:text-xl tracking-tight transition-colors leading-tight ${activeIdx === i ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}>
                    {exp.role}
                  </span>
                  <span className={`text-sm font-light transition-colors ${activeIdx === i ? 'text-white/80' : 'text-white/30 group-hover:text-white/50'}`}>
                    {exp.company}
                  </span>
                </div>

                {/* Active indicator line on right */}
                <div className={`w-0.5 self-stretch rounded-full flex-shrink-0 transition-all duration-300 ${activeIdx === i ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.6)]' : 'bg-white/10'}`} />
              </motion.button>
            ))}
          </div>

          {/* Right column – expanded detail card with hover translate */}
          <div className="lg:flex-1 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                className="group relative h-full rounded-3xl border border-white/10 bg-[#0A0A0E]/95 p-6 sm:p-9 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl flex flex-col gap-6 sm:gap-7 hover:-translate-y-1.5 hover:border-white/35 hover:shadow-[0_25px_65px_rgba(255,255,255,0.06)] transition-all duration-300 overflow-hidden"
              >
                {/* Subtle Ambient Glow Orb in background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-white/10 transition-colors duration-500" />

                {/* Role Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full border border-white/30 bg-white/10 text-white font-mono text-[10px] sm:text-xs font-semibold tracking-wider uppercase">
                        {active.year} · WORK
                      </span>
                      <span className="text-white/30 text-xs font-mono">•</span>
                      <span className="text-white/50 font-mono text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-white/50" />
                        {active.location}
                      </span>
                    </div>
                    <h3 className="font-display font-black text-white text-2xl md:text-3xl tracking-tight mb-1 group-hover:text-white transition-colors">
                      {active.role}
                    </h3>
                    <p className="text-white/70 font-medium text-base">{active.company}</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 font-mono text-xs text-white/90 shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-white/60" />
                    <span>{active.duration}</span>
                  </div>
                </div>

                {/* Bullets */}
                <ul className="flex flex-col gap-3.5 relative z-10">
                  {active.bullets.map((b, bi) => (
                    <motion.li
                      key={bi}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: bi * 0.08 }}
                      className="group/item flex items-start gap-3.5 text-sm md:text-base text-white/75 leading-relaxed hover:text-white transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white mt-2.5 shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.6)] group-hover/item:scale-150 transition-transform" />
                      <span>{b}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Tech Stack Pills with hover lift */}
                <div className="mt-auto pt-6 border-t border-white/10 flex flex-wrap gap-2 relative z-10">
                  {active.tech.map(t => (
                    <span
                      key={t}
                      className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-white/[0.03] font-mono text-xs text-white/70 hover:text-white hover:border-white/40 hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200 cursor-default shadow-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
