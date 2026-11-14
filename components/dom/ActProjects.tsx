'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ArrowUpRight, Globe, Check } from 'lucide-react';

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  category: string;
  filterCategory: 'ai' | 'fullstack' | 'devtools';
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
    title: 'SPLITR – AI Based Expense Splitting Platform',
    tagline: 'AI-Powered Expense Sharing & Bill Splitting',
    category: 'Full-Stack & AI',
    filterCategory: 'fullstack',
    image: '/images/splitr_home.png',
    images: ['/images/splitr_home.png', '/images/splitr_dashboard.png'],
    imageLabels: ['Home', 'Dashboard'],
    browserUrl: 'https://splitr-q9gg.vercel.app',
    problem: 'Manual group expense tracking is error-prone with lost paper receipts, unequal splits, and awkward IOUs.',
    solution: 'Full-stack platform integrating Gemini AI API for automated receipt itemization, Convex and Inngest for background workflows, and minimum-cash-flow graph algorithms to simplify group debt settlement.',
    features: ['AI Receipt Scanner', 'Debt Graph Simplifier', 'Expense Analytics Chart', 'Multi-Payer Tracking'],
    techStack: ['Next.js', 'JavaScript', 'Convex', 'Clerk', 'Inngest', 'Gemini AI API', 'Tailwind CSS', 'shadcn/ui'],
    github: 'https://github.com/dhruvbajaj13/Splitr',
    liveDemo: 'https://splitr-q9gg.vercel.app',
  },
  {
    id: 'rag-agent',
    title: 'RAG AI Agent with Web Search',
    tagline: 'Autonomous Document Intelligence & Live Search',
    category: 'GenAI & Agents',
    filterCategory: 'ai',
    image: '/images/rag_agent.png',
    browserUrl: 'https://github.com/dhruvbajaj13/RAG-Based-AI-Document-Agent',
    problem: 'Standard LLMs hallucinate outdated information and cannot securely reason over proprietary internal documents or live web facts.',
    solution: 'Hybrid agentic RAG system built on LangChain and LangGraph with Pinecone vector embeddings, Groq Llama inference, semantic query routing, and real-time DuckDuckGo search fallback with citations.',
    features: ['Hybrid Vector Retrieval', 'Document Page Citations', 'Live Search Fallback', 'Conversational Memory'],
    techStack: ['Python', 'LangChain', 'LangGraph', 'Pinecone', 'Hugging Face', 'Streamlit', 'Groq', 'Llama', 'FastAPI'],
    github: 'https://github.com/dhruvbajaj13/RAG-Based-AI-Document-Agent',
    liveDemo: 'https://github.com/dhruvbajaj13/RAG-Based-AI-Document-Agent',
  },

  // ─── Row 2 ───────────────────────────────────────────────────────────
  {
    id: 'stock-market-analyser',
    title: 'Stock Market Analyzer',
    tagline: 'Real-Time Equity Analytics & Technical Indicators',
    category: 'FinTech & Analytics',
    filterCategory: 'fullstack',
    image: '/images/stock_analyser.png',
    browserUrl: 'https://stock-market-analyzer-we8x.vercel.app',
    problem: 'Retail investors struggle with fragmented platforms for analyzing real-time stock quotes, candlestick patterns, and technical indicators.',
    solution: 'Modern financial dashboard featuring real-time equity quotes, interactive candlestick charts, automated RSI/MACD indicators, and personalized watchlist tracking.',
    features: ['Real-Time Stock Quotes', 'Candlestick Charts', 'Technical Indicators (RSI/MACD)', 'Watchlist Tracker'],
    techStack: ['Next.js', 'TypeScript', 'MongoDB', 'Nodemailer', 'Express.js', 'Node.js'],
    github: 'https://github.com/dhruvbajaj13/Stock-Market-Analyzer',
    liveDemo: 'https://stock-market-analyzer-we8x.vercel.app/',
  },
  {
    id: 'codecraft',
    title: 'CODECRAFT – SAAS CODE EDITOR AND IDE',
    tagline: 'SaaS Cloud IDE & Multi-Language Runner',
    category: 'Cloud DevTools',
    filterCategory: 'devtools',
    image: '/images/codecraft_home.png',
    images: ['/images/codecraft_home.png', '/images/codecraft_editor.png'],
    imageLabels: ['Home', 'Editor'],
    browserUrl: 'https://code-craft-two-livid.vercel.app',
    problem: 'Local developer environment setups are slow, resource-heavy, and inconvenient for quick multi-language code testing.',
    solution: 'Cloud-based web IDE powered by Monaco Editor, Convex real-time database, Clerk authentication, and Razorpay subscriptions, allowing instant multi-language compilation.',
    features: ['10+ Languages Execution', 'Monaco Code Editor', 'Subscription & Webhooks', 'Custom Editor Themes'],
    techStack: ['Next.js', 'TypeScript', 'Convex', 'Clerk', 'Webhooks', 'Razorpay', 'Tailwind CSS', 'shadcn/ui'],
    github: 'https://github.com/dhruvbajaj13/CodeCraft',
    liveDemo: 'https://code-craft-two-livid.vercel.app',
  },

  // ─── Row 3 ───────────────────────────────────────────────────────────
  {
    id: 'synthex',
    title: 'SYNTHEX AI Chrome Extension',
    tagline: 'AI Web Productivity Chrome Extension',
    category: 'Browser Extensions',
    filterCategory: 'ai',
    image: '/images/synthex.png',
    browserUrl: 'https://github.com/dhruvbajaj13/Synthex',
    problem: 'Constantly switching tabs to prompt AI assistants interrupts reading focus, email drafting, and online research.',
    solution: 'Manifest V3 Chrome Extension providing contextual Gemini AI actions directly on highlighted webpage text with one-click summarization and smart reply drafting.',
    features: ['Contextual Selection Menu', 'Smart Email Drafter', 'One-Click Summarizer', 'Zero Tab Switching'],
    techStack: ['JavaScript', 'Manifest V3', 'Chrome Extension APIs', 'Gemini AI API', 'Tailwind CSS'],
    github: 'https://github.com/dhruvbajaj13/Synthex',
    liveDemo: 'https://github.com/dhruvbajaj13/Synthex',
  },
  {
    id: 'cleancity',
    title: 'CleanCity',
    tagline: 'Smart Waste Management Platform with IoT Telemetry',
    category: 'IoT & Smart Cities',
    filterCategory: 'devtools',
    image: '/images/cleancity_home.png',
    images: ['/images/cleancity_home.png', '/images/cleancity_about.png', '/images/cleancity_dashboard.png'],
    imageLabels: ['Home', 'About', 'Dashboard'],
    browserUrl: 'https://clean-city-sih.vercel.app',
    problem: 'Overflowing municipal bins and unaddressed illegal waste dumping cause severe sanitation hazards and delayed municipal intervention.',
    solution: 'Smart platform connecting citizen waste reporting, gamified token rewards, municipal dispatch routing with Leaflet Maps, and Supabase backend telemetry.',
    features: ['Waste Report Verification', 'Gamified Token Rewards', 'Impact Leaderboard', 'Municipal Dispatch Map'],
    techStack: ['React.js', 'Supabase', 'JavaScript', 'Leaflet Maps', 'Tailwind CSS'],
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
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (isHovered || images.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % images.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const hasMultiple = images.length > 1;

  const objectPosition =
    project.id === 'rag-agent'
      ? 'object-top'
      : hasMultiple
      ? 'object-bottom'
      : 'object-center';

  return (
    <div
      className="relative w-full aspect-[16/8.5] overflow-hidden bg-[#060608] border-b border-white/8 group/img select-none cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={() => {
        if (hasMultiple) {
          setActiveIdx((prev) => (prev + 1) % images.length);
        }
      }}
    >
      {/* Top Segmented Story Progress Bar for Multi-Image Projects */}
      {hasMultiple && (
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 px-3 pt-2 pb-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
          {images.map((_, idx) => (
            <div
              key={idx}
              className="h-[2px] flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm"
            >
              <div
                className={`h-full bg-white transition-all duration-500 rounded-full ${
                  idx === activeIdx
                    ? 'w-full shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                    : idx < activeIdx
                    ? 'w-full opacity-40'
                    : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>
      )}

      {/* Main Image with Smooth Fade-Scale Reveal Animation */}
      <AnimatePresence mode="popLayout">
        <motion.img
          key={images[activeIdx]}
          src={images[activeIdx]}
          alt={`${project.title} preview ${activeIdx + 1}`}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 0.95, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full h-full object-cover ${objectPosition} group-hover/img:opacity-100 group-hover/img:scale-105 transition-all duration-700 ease-out`}
          loading="lazy"
        />
      </AnimatePresence>

      {/* Interactive Cursor Spotlight Glow Effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover/img:opacity-100 transition-opacity duration-500 z-10"
        style={{
          background: `radial-gradient(circle 220px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.12), transparent 75%)`,
        }}
      />

      {/* Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none z-10" />

      {/* Project Category Tag */}
      <div className="absolute top-3 left-3 font-mono text-[9px] font-bold text-white/90 bg-black/85 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/15 z-20 shadow-md">
        0{index + 1} // {project.category}
      </div>

      {/* Multi-Image Interactive Indicator Pills */}
      {hasMultiple && (
        <div className="absolute bottom-2.5 right-3 flex items-center gap-1.5 z-20">
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
                className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono transition-all backdrop-blur-md border ${
                  isActive
                    ? 'bg-white text-black font-bold border-white shadow-[0_0_10px_rgba(255,255,255,0.5)] scale-105'
                    : 'bg-black/75 text-white/60 border-white/15 hover:text-white hover:border-white/40'
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

const FILTER_TABS = [
  { id: 'all', label: 'All Projects', count: 6 },
  { id: 'ai', label: 'AI & GenAI', count: 2 },
  { id: 'fullstack', label: 'Full-Stack Apps', count: 2 },
  { id: 'devtools', label: 'Cloud & Systems', count: 2 },
] as const;

export function ActProjects() {
  const [activeTab, setActiveTab] = useState<typeof FILTER_TABS[number]['id']>('all');

  const filteredProjects = activeTab === 'all'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter((p) => p.filterCategory === activeTab);

  return (
    <section id="projects" className="relative bg-transparent pt-12 pb-18 md:pt-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">

        {/* Section Header */}
        <div className="mb-6 md:mb-8">
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
              className="heading-hover-sweep font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase leading-none"
            >
              Projects
            </motion.h2>
            <span className="font-mono text-[10.5px] text-white/40 tracking-wider">
              [ 6 Featured Applications · Production Code &amp; Deployed Apps ]
            </span>
          </div>
        </div>

        {/* Category Filter Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-6 sm:mb-8 -webkit-overflow-scrolling-touch">
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full font-mono text-[11px] sm:text-xs transition-all duration-300 flex items-center gap-1.5 border whitespace-nowrap shrink-0 active:scale-95 ${
                  isActive
                    ? 'bg-white text-black font-bold border-white shadow-[0_0_18px_rgba(255,255,255,0.35)] scale-105'
                    : 'liquid-glass-pill text-white/70 hover:border-white/35 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-black/20 text-black font-bold' : 'bg-white/10 text-white/40'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3 Rows × 2 Columns Responsive Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj, i) => (
              <motion.div
                key={proj.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: (i % 2) * 0.08 }}
                whileHover={{ y: -5 }}
                className="group/card relative rounded-2xl liquid-glass overflow-hidden transition-all duration-300 flex flex-col justify-between"
              >
                {/* macOS Browser Header Bar */}
                <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 bg-white/[0.03] backdrop-blur-md border-b border-white/8 gap-2">
                  {/* Traffic light dots */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] shadow-[0_0_6px_rgba(255,95,87,0.6)] group-hover/card:brightness-110 transition-all" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E] shadow-[0_0_6px_rgba(254,188,46,0.5)] group-hover/card:brightness-110 transition-all" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#28C840] shadow-[0_0_6px_rgba(40,200,64,0.5)] group-hover/card:brightness-110 transition-all" />
                  </div>

                  {/* Browser URL Search Bar with Live Pulse Dot */}
                  <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full liquid-glass-pill max-w-[130px] xs:max-w-[190px] sm:max-w-[240px] truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_6px_#10b981] animate-pulse" />
                    <Globe className="w-2.5 h-2.5 text-white/40 shrink-0" />
                    <span className="font-mono text-[9px] text-white/60 truncate select-none">
                      {proj.browserUrl ? proj.browserUrl.replace('https://', '') : `${proj.id}.dev`}
                    </span>
                  </div>

                  {/* Quick Link Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-white/60 hover:bg-white/10 transition-all bg-[#080808]"
                      title="View GitHub Repository"
                    >
                      <Github className="w-3 h-3" />
                    </a>
                    <a
                      href={proj.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 h-6 rounded-full bg-white text-black font-bold uppercase tracking-wider text-[8px] flex items-center gap-1 hover:scale-105 transition-transform shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                      title="Open Live App"
                    >
                      <span>Live</span>
                      <ArrowUpRight className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

                {/* Project Screenshot Media with Carousel Animation */}
                <ProjectCardMedia
                  project={proj}
                  index={i}
                />

                {/* Enhanced Card Body: Title, Tagline, Key Feature Chips & Tech Badges */}
                <div className="p-4 sm:p-5 flex flex-col gap-3 justify-between flex-1">
                  <div className="space-y-1.5">
                    <h3 className="font-display font-black text-base sm:text-lg text-white tracking-tight uppercase leading-snug">
                      {proj.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-[13px] text-white/60 leading-relaxed font-light">
                      {proj.tagline}
                    </p>
                  </div>

                  {/* Key Highlights Micro-Chips (2-3 Features) */}
                  <div className="flex flex-wrap gap-1.5">
                    {proj.features.slice(0, 3).map((feat) => (
                      <span
                        key={feat}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[9.5px] font-mono text-white/75"
                      >
                        <Check className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </span>
                    ))}
                  </div>

                  {/* Tech Stack Badges */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-full liquid-glass text-[9px] font-mono text-white/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Card Bottom: Direct Code & Live Demo Action Buttons */}
                  <div className="pt-3 border-t border-white/8 flex items-center justify-end gap-2.5">
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-lg liquid-glass hover:border-white/40 text-[11px] font-mono text-white/80 hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                    <a
                      href={proj.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-1.5 rounded-lg bg-white text-black font-sans font-bold text-[11px] uppercase tracking-wider hover:scale-105 transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Live Demo</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
