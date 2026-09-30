'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, Terminal } from 'lucide-react';

interface AchievementPoint {
  id: string;
  num: string;
  badge: string;
  text: string;
}

const ACHIEVEMENTS_POINTS: AchievementPoint[] = [
  {
    id: 'knight-codechef',
    num: '01',
    badge: 'Competitive Programming',
    text: 'Knight on LeetCode (Max Rating: 1951) and 3 Star on CodeChef (Max Rating: 1605).',
  },
  {
    id: 'dsa-streak',
    num: '02',
    badge: 'Consistency & Mastery',
    text: 'Solved 1100+ DSA problems across various platforms like LeetCode, CodeChef maintaining a 365-day coding streak.',
  },
  {
    id: 'open-source',
    num: '03',
    badge: 'Open Source',
    text: 'Open Source Contributor at GSSOC’25 and OSCI 2025 – Merged 7+ PRs, led feature development, and contributed to multiple GitHub repositories.',
  },
  {
    id: 'codex-hackathon',
    num: '04',
    badge: 'National Hackathon',
    text: 'Finalist, CodeX 2.0 Hackathon 2025 – Selected from over 25,000+ applicants.',
  },
  {
    id: 'algouniversity',
    num: '05',
    badge: 'Tech Fellowship',
    text: 'Top 2K Finalist, AlgoUniversity Tech Fellowship 2025 – Qualified for Stage 2 among 30,000+ applicants.',
  },
];

export function ActAchievements() {
  const [copied, setCopied] = useState(false);

  const handleCopyHighlights = async () => {
    const textToCopy = ACHIEVEMENTS_POINTS.map((item) => `• ${item.text}`).join('\n');
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <section
      id="achievements"
      className="relative w-full px-4 sm:px-8 md:px-16 py-20 md:py-28 bg-[#050505]"
    >
      <div className="max-w-5xl mx-auto">

        {/* Section Header */}
        <div className="mb-10 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase mb-3"
            >
              — Verified Milestones —
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none"
            >
              Achievements
            </motion.h2>
          </div>

          {/* Quick Copy for Recruiters Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            onClick={handleCopyHighlights}
            className="self-start md:self-auto px-4 py-2 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/10 hover:border-white/40 transition-all flex items-center gap-2 text-xs font-mono text-white/80 hover:text-white shadow-sm group"
            title="Copy bullet points to clipboard for interview evaluation"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Highlights Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-white/60 group-hover:text-white transition-colors" />
                <span>Copy Summary for Scorecard</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Minimalist List: Hover turns BG white & Text black */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-white/10 bg-[#0A0A0C]/90 backdrop-blur-xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.8)] divide-y divide-white/8"
        >
          {/* Header Bar */}
          <div className="px-5 py-3 bg-[#111114] border-b border-white/8 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs text-white/50">
              <Terminal className="w-3.5 h-3.5 text-white/40" />
              <span>key_milestones.md</span>
            </div>
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
              5 Verified Highlights
            </span>
          </div>

          {/* The 5 Clean Points */}
          {ACHIEVEMENTS_POINTS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className="group px-5 sm:px-7 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6 hover:bg-white transition-all duration-300 cursor-pointer"
            >
              {/* Left: Index + Text */}
              <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1">
                <span className="font-mono text-xs font-bold text-white/40 group-hover:text-black/60 transition-colors shrink-0 pt-0.5 sm:pt-0">
                  [{item.num}]
                </span>

                {/* Subtle bullet icon */}
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-black group-hover:scale-125 transition-all shrink-0 mt-2 sm:mt-0" />

                {/* Direct exact point text - turns black on hover */}
                <p className="font-sans text-sm sm:text-[15px] text-white/85 group-hover:text-black group-hover:font-medium leading-relaxed font-light transition-colors">
                  {item.text}
                </p>
              </div>

              {/* Right: Category Badge Pill */}
              <div className="shrink-0 pl-7 sm:pl-0">
                <span className="inline-block px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.02] font-mono text-[10px] text-white/60 group-hover:border-black/20 group-hover:bg-black/10 group-hover:text-black transition-colors whitespace-nowrap">
                  {item.badge}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
