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
      'Developed and deployed 5+ production-ready features for a live healthcare platform serving 3,000+ active users.',
      'Built and integrated 10+ REST API endpoints, resolved 20+ production bugs, optimized DB queries for 30% faster load times.',
      'Collaborated in Agile sprints across 6+ feature releases with a cross-functional team.',
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
            className="font-display text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none"
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
                className={`group text-left w-full px-5 sm:px-6 py-4 sm:py-5 rounded-2xl border transition-all duration-300 flex justify-between items-start gap-4 ${
                  activeIdx === i
                    ? 'bg-white/5 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.08)]'
                    : 'bg-white/[0.02] border-white/8 hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className={`font-mono text-[10px] tracking-widest uppercase transition-colors ${activeIdx === i ? 'text-white' : 'text-white/25 group-hover:text-white/40'}`}>
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
                <div className={`w-0.5 self-stretch rounded-full flex-shrink-0 transition-all duration-300 ${activeIdx === i ? 'bg-white shadow-[0_0_8px_#ffffff]' : 'bg-white/10'}`} />
              </motion.button>
            ))}
          </div>

          {/* Right column – expanded detail */}
          <div className="lg:flex-1 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-8 md:p-10 flex flex-col gap-6 sm:gap-7"
              >
                {/* Role header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/10">
                  <div>
                    <h3 className="font-display font-black text-white text-2xl md:text-3xl tracking-tight mb-1">
                      {active.role}
                    </h3>
                    <p className="text-white/60 font-light text-base">{active.company}</p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
                    <div className="flex items-center gap-1.5 font-mono text-xs text-white/90">
                      <Calendar className="w-3 h-3" />
                      {active.duration}
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-xs text-white/40">
                      <MapPin className="w-3 h-3" />
                      {active.location}
                    </div>
                  </div>
                </div>

                {/* Bullets */}
                <ul className="flex flex-col gap-3">
                  {active.bullets.map((b, bi) => (
                    <motion.li
                      key={bi}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: bi * 0.08 }}
                      className="flex items-start gap-3 text-sm md:text-base text-white/70 leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0 shadow-[0_0_6px_#ffffff]" />
                      {b}
                    </motion.li>
                  ))}
                </ul>

                {/* Tech pills */}
                <div className="mt-auto pt-6 border-t border-white/8 flex flex-wrap gap-2">
                  {active.tech.map(t => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full border border-white/20 bg-white/5 font-mono text-xs text-white/80 hover:border-white/50 hover:text-white transition-colors"
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
