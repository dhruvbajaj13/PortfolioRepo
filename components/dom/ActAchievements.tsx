'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Flame, GitMerge, Star, Code2, Sparkles, CheckCircle2 } from 'lucide-react';

interface Achievement {
  id: string;
  category: string;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  metrics: string[];
  icon: React.ElementType;
}

const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: 'dsa-knight',
    category: 'Competitive Programming',
    badge: 'Knight · Top 3%',
    title: 'Knight on LeetCode & 3★ CodeChef',
    highlight: 'Max Rating: 1951 (LeetCode) | Max Rating: 1605 (CodeChef)',
    description:
      'Consistently ranked in the top 3% worldwide on LeetCode. Solved complex graph theory, dynamic programming, and data structure challenges across international contests.',
    metrics: ['Max Rating 1951', 'Top 3% Worldwide', '42+ Contests'],
    icon: Trophy,
  },
  {
    id: 'streak-1000',
    category: 'Consistency & Mastery',
    badge: '365+ Day Streak',
    title: '1,000+ DSA Problems Solved',
    highlight: 'Maintained 365+ Day Unbroken Coding Streak across LeetCode & CodeChef',
    description:
      'Solved 1000+ problems in Java and C++ covering Advanced Algorithms, Trees, Graphs, DP, and Segment Trees with 4,000+ submissions and rigorous daily problem-solving discipline.',
    metrics: ['1,000+ Solved', '365-Day Streak', '4,000+ Submissions'],
    icon: Flame,
  },
  {
    id: 'open-source',
    category: 'Open Source Community',
    badge: 'GSSOC’25 & OSCI 2025',
    title: 'Open Source Contributor — GSSOC’25 & OSCI 2025',
    highlight: 'Merged 7+ Production PRs across Multiple GitHub Repositories',
    description:
      'Active contributor to open-source software initiatives; engineered feature additions, bug resolutions, code refactors, and comprehensive documentation for developer tooling.',
    metrics: ['7+ PRs Merged', 'GSSOC 2025', 'OSCI Contributor'],
    icon: GitMerge,
  },
  {
    id: 'codex-hackathon',
    category: 'National Hackathon',
    badge: 'Top Finalist',
    title: 'Finalist — CodeX 2.0 Hackathon 2025',
    highlight: 'Selected as Finalist from over 25,000+ Applicants Nationwide',
    description:
      'Designed and pitched a production-grade full-stack prototype tackling real-world scalability and automated workflows under rigorous time-bound competitive evaluation.',
    metrics: ['25,000+ Applicants', 'Finalist Team', 'National Level'],
    icon: Award,
  },
  {
    id: 'algouniversity',
    category: 'Tech Fellowship',
    badge: 'Top 2,000 Selected',
    title: 'Top 2K Finalist — AlgoUniversity Tech Fellowship 2025',
    highlight: 'Qualified for Stage 2 among 30,000+ Candidates Nationwide',
    description:
      'Selected based on algorithmic aptitude, problem-solving speed, and software engineering foundations in a multi-stage competitive screening process.',
    metrics: ['Top 2,000 Stage 2', '30,000+ Applicants', 'Fellowship Finalist'],
    icon: Star,
  },
  {
    id: 'sih-iot',
    category: 'IoT & AI Innovation',
    badge: 'SIH Winner Project',
    title: 'Smart India Hackathon (SIH) Winner — CleanCity IoT',
    highlight: 'Smart Waste Management with Ultrasonic Telemetry & Automated Routing',
    description:
      'Spearheaded development of CleanCity IoT, connecting smart city hardware telemetry with a full-stack real-time admin portal and routing logistics engine.',
    metrics: ['SIH Winner', 'ESP32 Telemetry', 'Full-Stack IoT'],
    icon: Sparkles,
  },
];

export function ActAchievements() {
  return (
    <section
      id="achievements"
      className="relative w-full px-4 sm:px-8 md:px-16 py-20 md:py-28 bg-[#050505]"
    >
      <div className="max-w-6xl mx-auto">

        {/* Section Header */}
        <div className="mb-14 md:mb-18">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase mb-3"
          >
            — Milestones &amp; Recognition —
          </motion.p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none"
            >
              Achievements
            </motion.h2>
            <span className="font-mono text-xs text-white/40 tracking-wider">
              [ 6 Recognized Milestones · Competitive &amp; Open Source ]
            </span>
          </div>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {ACHIEVEMENTS_DATA.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl border border-white/10 bg-[#0C0C0C] p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-xl hover:border-white/30 hover:shadow-[0_16px_40px_rgba(255,255,255,0.06)] transition-all duration-300"
              >
                {/* Header row: Icon, Category & Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-white/30 group-hover:scale-105 transition-all text-white">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="font-mono text-[9.5px] uppercase tracking-widest text-white/40 block">
                        {item.category}
                      </span>
                      <h3 className="font-display font-bold text-base sm:text-lg text-white leading-tight mt-0.5">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <span className="shrink-0 font-mono text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/15">
                    {item.badge}
                  </span>
                </div>

                {/* Highlight banner */}
                <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/8 text-white/90 font-mono text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                  <span className="truncate">{item.highlight}</span>
                </div>

                {/* Description */}
                <p className="text-white/60 text-xs sm:text-sm font-light leading-relaxed">
                  {item.description}
                </p>

                {/* Metric Badges */}
                <div className="pt-3 border-t border-white/8 flex flex-wrap gap-2 mt-auto">
                  {item.metrics.map((m) => (
                    <span
                      key={m}
                      className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 font-mono text-[10px] text-white/70"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
