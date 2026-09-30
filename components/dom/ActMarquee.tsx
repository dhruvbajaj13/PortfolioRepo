'use client';

import React, { useRef, useState, useEffect } from "react";
import {
  Flame,
  Sparkles,
  Code2,
  Trophy,
  Cpu,
  Layers,
  TrendingUp,
  GitBranch,
} from "lucide-react";

/* ─── Domain-Themed Cards (Grayscale by default, bursting into color on hover) ─── */

const MARQUEE_ITEMS = [
  {
    id: "leetcode",
    title: "LeetCode Knight",
    tag: "Top 3%",
    highlight: "Rating 1951 · 1,100+ Solved",
    sub: "DSA in Java · 366-Day Max Streak",
    icon: Flame,
    colorClass: "group-hover:border-[#FFA116]/60 group-hover:bg-[#120D06] group-hover:shadow-[0_0_25px_rgba(255,161,22,0.2)]",
    accentColor: "#FFA116",
    badgeClass: "text-[#FFA116] bg-[#FFA116]/10 border-[#FFA116]/30",
  },
  {
    id: "ai-rag",
    title: "Agentic RAG & LLMs",
    tag: "GenAI",
    highlight: "LangChain · ChromaDB · Vector DB",
    sub: "Autonomous Retrieval & Web Search",
    icon: Sparkles,
    colorClass: "group-hover:border-[#A855F7]/60 group-hover:bg-[#10081C] group-hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]",
    accentColor: "#A855F7",
    badgeClass: "text-[#C084FC] bg-[#A855F7]/10 border-[#A855F7]/30",
  },
  {
    id: "fullstack",
    title: "Full-Stack MERN",
    tag: "Web Architecture",
    highlight: "React.js · Node · Express · MongoDB",
    sub: "Scalable REST APIs & Real-time UIs",
    icon: Code2,
    colorClass: "group-hover:border-[#38BDF8]/60 group-hover:bg-[#06121C] group-hover:shadow-[0_0_25px_rgba(56,189,248,0.2)]",
    accentColor: "#38BDF8",
    badgeClass: "text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30",
  },
  {
    id: "sih",
    title: "Smart India Hackathon",
    tag: "SIH Finalist",
    highlight: "CleanCity IoT Waste Management",
    sub: "Smart Bins Telemetry & Route Dispatch",
    icon: Trophy,
    colorClass: "group-hover:border-[#10B981]/60 group-hover:bg-[#06140F] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]",
    accentColor: "#10B981",
    badgeClass: "text-[#34D399] bg-[#10B981]/10 border-[#10B981]/30",
  },
  {
    id: "codecraft",
    title: "CodeCraft Cloud IDE",
    tag: "DevTools",
    highlight: "Monaco Editor · Judge0 Sandboxed",
    sub: "10+ Languages Instant Execution",
    icon: Cpu,
    colorClass: "group-hover:border-[#6366F1]/60 group-hover:bg-[#0A0C1C] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.2)]",
    accentColor: "#6366F1",
    badgeClass: "text-[#818CF8] bg-[#6366F1]/10 border-[#6366F1]/30",
  },
  {
    id: "synthex",
    title: "Synthex Chrome Extension",
    tag: "Manifest V3",
    highlight: "Contextual AI Web Productivity",
    sub: "Inline Highlighting & Smart Actions",
    icon: Layers,
    colorClass: "group-hover:border-[#F43F5E]/60 group-hover:bg-[#1C0810] group-hover:shadow-[0_0_25px_rgba(244,63,94,0.2)]",
    accentColor: "#F43F5E",
    badgeClass: "text-[#FB7185] bg-[#F43F5E]/10 border-[#F43F5E]/30",
  },
  {
    id: "fintech",
    title: "Stock Market Analyzer",
    tag: "FinTech",
    highlight: "Live Quotes · Candlestick Charts",
    sub: "RSI & MACD Technical Indicators",
    icon: TrendingUp,
    colorClass: "group-hover:border-[#22C55E]/60 group-hover:bg-[#07140B] group-hover:shadow-[0_0_25px_rgba(34,197,94,0.2)]",
    accentColor: "#22C55E",
    badgeClass: "text-[#4ADE80] bg-[#22C55E]/10 border-[#22C55E]/30",
  },
  {
    id: "git-oss",
    title: "Open Source & Git",
    tag: "Engineering",
    highlight: "10+ Production Repositories",
    sub: "Clean Git Commits & CI/CD Pipelines",
    icon: GitBranch,
    colorClass: "group-hover:border-white/60 group-hover:bg-[#121212] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.15)]",
    accentColor: "#FFFFFF",
    badgeClass: "text-white bg-white/10 border-white/30",
  },
];

export function ActMarquee() {
  const [offset, setOffset] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!sectionRef.current) return;
          const { top } = sectionRef.current.getBoundingClientRect();
          if (top < window.innerHeight && top > -window.innerHeight * 2) {
            setOffset((window.scrollY - top + window.innerHeight) * 0.4);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loopItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <section
      ref={sectionRef}
      className="py-6 sm:py-8 bg-[#050505] overflow-hidden relative z-10 border-y border-white/[0.06]"
    >
      <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#050505] to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none" />

      <div
        className="flex gap-3.5 sm:gap-4 will-change-transform select-none"
        style={{ transform: `translateX(${-(offset % 2000)}px)` }}
      >
        {loopItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={`${item.id}-${i}`}
              className={`group relative w-[250px] sm:w-[280px] h-[115px] sm:h-[120px] shrink-0 rounded-2xl border border-white/10 bg-[#0A0A0A] p-3.5 flex flex-col justify-between cursor-default grayscale contrast-125 opacity-70 hover:grayscale-0 hover:opacity-100 hover:scale-[1.03] hover:-translate-y-1 z-10 transition-all duration-300 ${item.colorClass}`}
            >
              <div className="flex items-center justify-between border-b border-white/8 pb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center border border-white/10 bg-white/5"
                    style={{ color: item.accentColor }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-display font-bold text-white tracking-tight uppercase">
                    {item.title}
                  </span>
                </div>
                <span
                  className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border ${item.badgeClass}`}
                >
                  {item.tag}
                </span>
              </div>

              <div className="space-y-0.5 pt-1">
                <p className="font-mono text-[10.5px] font-bold text-white tracking-tight truncate">
                  {item.highlight}
                </p>
                <p className="font-mono text-[9px] text-white/50 tracking-wide truncate">
                  {item.sub}
                </p>
              </div>

              <div
                className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: item.accentColor }}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
