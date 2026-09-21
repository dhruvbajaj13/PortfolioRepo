'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ArrowUpRight, Globe } from 'lucide-react';

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  category: string;
  image: string;
  images?: string[];
  imageLabels?: string[];
  problem: string;
  solution: string;
  features: string[];
  techStack: string[];
  impact?: string;
  github: string;
  liveDemo: string;
  browserUrl?: string;
}

export const PROJECTS_DATA: ProjectItem[] = [
  // ─── Row 1 ───────────────────────────────────────────────────────────
  {
    id: 'splitr',
    title: 'Splitr',
    tagline: 'AI-Powered Expense Sharing & Bill Splitting',
    category: 'Full-Stack & AI',
    image: '/images/splitr_home.png',
    images: ['/images/splitr_home.png', '/images/splitr_dashboard.png'],
    imageLabels: ['Home', 'Dashboard'],
    browserUrl: 'https://splitr-q9gg.vercel.app',
    problem: 'Manual group expense tracking is error-prone with lost paper receipts, unequal splits, and awkward IOUs.',
    solution: 'Full-stack platform integrating Tesseract OCR for automated receipt itemization and minimum-cash-flow graph algorithms to simplify group debt settlement.',
    features: ['OCR Receipt Scanner', 'Debt Graph Simplifier', 'Expense Analytics Chart', 'Multi-Payer Tracking'],
    techStack: ['React.js', 'Node.js', 'Express', 'MongoDB', 'Tesseract OCR', 'Tailwind CSS'],
    github: 'https://github.com/dhruvbajaj13/Splitr',
    liveDemo: 'https://splitr-q9gg.vercel.app',
  },
  {
    id: 'rag-agent',
    title: 'RAG AI Agent',
    tagline: 'Autonomous Document Intelligence & Live Search',
    category: 'GenAI & Agents',
    image: '/images/rag_agent.png',
    browserUrl: 'https://github.com/dhruvbajaj13/RAG-Based-AI-Document-Agent',
    problem: 'Standard LLMs hallucinate outdated information and cannot securely reason over proprietary internal documents or live web facts.',
    solution: 'Hybrid agentic RAG system built on LangChain with ChromaDB vector embeddings, semantic query routing, and real-time DuckDuckGo search fallback with citations.',
    features: ['Hybrid Vector Retrieval', 'Document Page Citations', 'Live Search Fallback', 'Conversational Memory'],
    techStack: ['Python', 'LangChain', 'ChromaDB', 'OpenAI API', 'FastAPI', 'Streamlit'],
    github: 'https://github.com/dhruvbajaj13/RAG-Based-AI-Document-Agent',
    liveDemo: 'https://github.com/dhruvbajaj13/RAG-Based-AI-Document-Agent',
  },

  // ─── Row 2 ───────────────────────────────────────────────────────────
  {
    id: 'stock-market-analyser',
    title: 'Stock Market Analyzer',
    tagline: 'Real-Time Equity Analytics & Technical Indicators',
    category: 'FinTech & Analytics',
    image: '/images/stock_analyser.png',
    browserUrl: 'https://stock-market-analyzer-we8x.vercel.app',
    problem: 'Retail investors struggle with fragmented platforms for analyzing real-time stock quotes, candlestick patterns, and technical indicators.',
    solution: 'Modern financial dashboard featuring real-time equity quotes, interactive candlestick charts, automated RSI/MACD indicators, and personalized watchlist tracking.',
    features: ['Real-Time Stock Quotes', 'Candlestick Charts', 'Technical Indicators (RSI/MACD)', 'Watchlist Tracker'],
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'Financial APIs', 'Lucide'],
    github: 'https://github.com/dhruvbajaj13/Stock-Market-Analyzer',
    liveDemo: 'https://stock-market-analyzer-we8x.vercel.app/',
  },
  {
    id: 'codecraft',
    title: 'CodeCraft',
    tagline: 'SaaS Cloud IDE & Multi-Language Runner',
    category: 'Cloud DevTools',
    image: '/images/codecraft_home.png',
    images: ['/images/codecraft_home.png', '/images/codecraft_editor.png'],
    imageLabels: ['Home', 'Editor'],
    browserUrl: 'https://code-craft-two-livid.vercel.app',
    problem: 'Local developer environment setups are slow, resource-heavy, and inconvenient for quick multi-language code testing.',
    solution: 'Cloud-based web IDE powered by Monaco Editor and Judge0 sandboxed API, allowing instant compilation and execution in 10+ languages with zero local setup.',
    features: ['10+ Languages Execution', 'Monaco Code Editor', 'Judge0 Sandboxed Exec', 'Custom Editor Themes'],
    techStack: ['Next.js 15', 'TypeScript', 'Monaco Editor', 'Judge0 API', 'Tailwind CSS'],
    github: 'https://github.com/dhruvbajaj13/CodeCraft',
    liveDemo: 'https://code-craft-two-livid.vercel.app',
  },

  // ─── Row 3 ───────────────────────────────────────────────────────────
  {
    id: 'synthex',
    title: 'Synthex',
    tagline: 'AI Web Productivity Chrome Extension',
    category: 'Browser Extensions',
    image: '/images/synthex.png',
    browserUrl: 'https://github.com/dhruvbajaj13/Synthex',
    problem: 'Constantly switching tabs to prompt ChatGPT interrupts reading focus, email drafting, and online research.',
    solution: 'Manifest V3 Chrome Extension providing contextual AI text actions directly on highlighted webpage text with one-click summarization and smart reply drafting.',
    features: ['Contextual Selection Menu', 'Smart Email Drafter', 'One-Click Summarizer', 'Zero Tab Switching'],
    techStack: ['JavaScript', 'Manifest V3', 'Chrome Extension APIs', 'OpenAI API', 'Tailwind CSS'],
    github: 'https://github.com/dhruvbajaj13/Synthex',
    liveDemo: 'https://github.com/dhruvbajaj13/Synthex',
  },
  {
    id: 'cleancity',
    title: 'CleanCity (SIH)',
    tagline: 'Smart Waste Management & Eco-Reward Platform',
    category: 'IoT & Smart Cities',
    image: '/images/cleancity_home.png',
    images: ['/images/cleancity_home.png', '/images/cleancity_about.png', '/images/cleancity_dashboard.png'],
    imageLabels: ['Home', 'About', 'Dashboard'],
    browserUrl: 'https://clean-city-sih.vercel.app',
    problem: 'Overflowing municipal bins and unaddressed illegal waste dumping cause severe sanitation hazards and delayed municipal intervention.',
    solution: 'Smart India Hackathon project connecting citizen AI waste reporting, gamified token rewards, municipal dispatch routing, and smart bin telemetry.',
    features: ['AI Waste Report Verification', 'Gamified Token Rewards', 'Impact Leaderboard', 'Municipal Dispatch Map'],
    techStack: ['React.js', 'Node.js', 'Express', 'MongoDB', 'IoT Sensors', 'Leaflet Maps'],
    github: 'https://github.com/dhruvbajaj13/CleanCity-SIH',
    liveDemo: 'https://clean-city-sih.vercel.app/',
  },
];

function ProjectCardMedia({
  project,
  index,
}: {
  project: ProjectItem;
  index: number;
}) {
  const images = project.images && project.images.length > 1 ? project.images : [project.image];
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered || images.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % images.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  const hasMultiple = images.length > 1;

  // Choose optimal image alignment
  const objectPosition =
    project.id === 'rag-agent'
      ? 'object-top'
      : hasMultiple
      ? 'object-bottom'
      : 'object-center';

  return (
    <div
      className="relative w-full aspect-[16/9] overflow-hidden bg-[#070707] border-b border-white/8 group/img select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={images[activeIdx]}
          src={images[activeIdx]}
          alt={`${project.title} preview ${activeIdx + 1}`}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 0.95, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className={`w-full h-full object-cover ${objectPosition} group-hover/img:opacity-100 group-hover/img:scale-105 transition-all duration-700 ease-out`}
          loading="lazy"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-transparent to-transparent pointer-events-none" />

      {/* Subtle shine sweep overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/img:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

      {/* Subtle project index pill */}
      <div className="absolute top-2.5 left-3 font-mono text-[9px] font-bold text-white/80 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 z-10 shadow-sm">
        0{index + 1} // {project.category}
      </div>

      {/* Multi-Image Interactive Indicator Pills */}
      {hasMultiple && (
        <div className="absolute bottom-2.5 right-3 flex items-center gap-1.5 z-10">
          {images.map((img, idx) => {
            const label = project.imageLabels?.[idx] || `View ${idx + 1}`;
            const isActive = idx === activeIdx;
            return (
              <button
                key={img}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx(idx);
                }}
                className={`px-2 py-0.5 rounded-full text-[8.5px] font-mono transition-all backdrop-blur-md border ${
                  isActive
                    ? 'bg-[#FF6B2C] text-black font-bold border-[#FF6B2C] shadow-[0_0_8px_rgba(255,107,44,0.4)] scale-105'
                    : 'bg-black/60 text-white/50 border-white/10 hover:text-white hover:border-white/30'
                }`}
                title={`Switch to ${label}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ActProjects() {
  return (
    <section id="projects" className="relative bg-[#050505] pt-12 pb-18 md:pt-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">

        {/* Section Header */}
        <div className="mb-8 md:mb-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase mb-2"
          >
            — Selected Works —
          </motion.p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none"
            >
              Projects
            </motion.h2>
            <span className="font-mono text-[10.5px] text-white/40 tracking-wider">
              [ 6 Featured Applications · 3 × 2 Grid ]
            </span>
          </div>
        </div>

        {/* 3 Rows × 2 Columns Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {PROJECTS_DATA.map((proj, i) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: (i % 2) * 0.1 }}
              whileHover={{ y: -4 }}
              className="group/card relative rounded-2xl border border-white/10 bg-[#0C0C0C] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:border-[#FF6B2C]/30 hover:shadow-[0_16px_45px_rgba(255,107,44,0.12)] transition-all duration-300 flex flex-col justify-between"
            >
              {/* macOS Browser Header Bar */}
              <div className="flex items-center justify-between px-3.5 py-2 bg-[#121212] border-b border-white/8">
                {/* Traffic light dots */}
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] shadow-[0_0_5px_rgba(255,95,87,0.5)] group-hover/card:brightness-110 transition-all" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E] shadow-[0_0_5px_rgba(254,188,46,0.4)] group-hover/card:brightness-110 transition-all" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28C840] shadow-[0_0_5px_rgba(40,200,64,0.4)] group-hover/card:brightness-110 transition-all" />
                </div>

                {/* Browser URL Search Bar */}
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#080808] border border-white/10 max-w-[190px] sm:max-w-[220px] truncate">
                  <Globe className="w-2.5 h-2.5 text-white/30 shrink-0" />
                  <span className="font-mono text-[9px] text-white/50 truncate select-none">
                    {proj.browserUrl ? proj.browserUrl.replace('https://', '') : `${proj.id}.dev`}
                  </span>
                </div>

                {/* Quick Link Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={proj.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-6 h-6 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-[#FF6B2C]/60 hover:bg-white/10 transition-all bg-[#080808]"
                    title="View GitHub Repository"
                  >
                    <Github className="w-2.5 h-2.5" />
                  </a>
                  <a
                    href={proj.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 h-6 rounded-full bg-[#FF6B2C] text-black font-bold uppercase tracking-wider text-[8px] flex items-center gap-0.5 hover:scale-105 transition-transform shadow-[0_0_10px_rgba(255,107,44,0.4)]"
                    title="Open Live App"
                  >
                    <span>Live</span>
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              {/* Project Screenshot Media with Carousel Animation */}
              <ProjectCardMedia project={proj} index={i} />

              {/* Card Body Details */}
              <div className="p-3.5 sm:p-4 flex flex-col gap-3 flex-1 justify-between">
                <div className="space-y-1">
                  <h3 className="font-display font-black text-lg sm:text-xl text-white tracking-tight uppercase">
                    {proj.title}
                  </h3>
                  <p className="text-white/50 text-[11px] font-light leading-snug">
                    {proj.tagline}
                  </p>

                  {/* Problem & Solution Block */}
                  <div className="pt-1 space-y-1.5 text-[10.5px] text-white/65 leading-relaxed font-light">
                    <div>
                      <span className="font-mono text-[8px] tracking-widest text-[#FF6B2C]/80 uppercase block mb-0.5 font-bold">
                        // Problem
                      </span>
                      <p className="line-clamp-2">{proj.problem}</p>
                    </div>
                    <div>
                      <span className="font-mono text-[8px] tracking-widest text-[#FF6B2C]/80 uppercase block mb-0.5 font-bold">
                        // Solution
                      </span>
                      <p className="line-clamp-2">{proj.solution}</p>
                    </div>
                  </div>
                </div>

                {/* Tech Stack Badges */}
                <div className="pt-2 border-t border-white/8 space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {proj.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.04] text-[9px] font-mono text-white/70 hover:border-[#FF6B2C]/40 hover:text-[#FF6B2C] transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Key Highlights */}
                  <ul className="grid grid-cols-2 gap-1 pt-0.5">
                    {proj.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex items-center gap-1.5 text-[9px] text-white/40 truncate">
                        <span className="w-1 h-1 rounded-full bg-white/40 shrink-0" />
                        <span className="truncate">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
