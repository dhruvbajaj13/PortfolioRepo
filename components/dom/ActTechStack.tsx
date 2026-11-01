'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface TechItem {
  name: string;
  category: 'Languages' | 'Frontend' | 'Backend' | 'AI / ML' | 'Tools';
  color: string;
  logo: string;
  isCore?: boolean;
}

const ALL_TECH: TechItem[] = [
  // ─── Languages ────────────────────────────────────────────────────────
  { name: 'Java',         category: 'Languages', color: '#E76F00', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', isCore: true },
  { name: 'C++',          category: 'Languages', color: '#00599C', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', isCore: true },
  { name: 'Python',      category: 'Languages', color: '#3776AB', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', isCore: true },
  { name: 'JavaScript',  category: 'Languages', color: '#F7DF1E', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'TypeScript',  category: 'Languages', color: '#3178C6', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', isCore: true },
  { name: 'SQL',         category: 'Languages', color: '#00758F', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azuresqldatabase/azuresqldatabase-original.svg' },

  // ─── Frontend ─────────────────────────────────────────────────────────
  { name: 'React.js',    category: 'Frontend',  color: '#61DAFB', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', isCore: true },
  { name: 'Next.js',     category: 'Frontend',  color: '#FFFFFF', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', isCore: true },
  { name: 'HTML5 / CSS3',category: 'Frontend',  color: '#E34F26', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  { name: 'JavaScript',  category: 'Frontend',  color: '#F7DF1E', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'TypeScript',  category: 'Frontend',  color: '#3178C6', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name: 'Tailwind CSS',category: 'Frontend',  color: '#06B6D4', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', isCore: true },
  { name: 'shadcn/ui',   category: 'Frontend',  color: '#FFFFFF', logo: 'https://cdn.simpleicons.org/shadcnui/FFFFFF', isCore: true },
  { name: 'Framer Motion',category:'Frontend',  color: '#BB4BFF', logo: 'https://cdn.simpleicons.org/framer/BB4BFF' },
  { name: 'GSAP',        category: 'Frontend',  color: '#88CE02', logo: 'https://cdn.simpleicons.org/greensock/88CE02' },

  // ─── Backend ──────────────────────────────────────────────────────────
  { name: 'Node.js',     category: 'Backend',   color: '#339933', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', isCore: true },
  { name: 'Express.js',  category: 'Backend',   color: '#FFFFFF', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
  { name: 'FastAPI',     category: 'Backend',   color: '#009688', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg', isCore: true },
  { name: 'REST APIs',   category: 'Backend',   color: '#FFFFFF', logo: 'https://cdn.simpleicons.org/fastapi/00E5FF' },
  { name: 'MongoDB',     category: 'Backend',   color: '#47A248', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', isCore: true },
  { name: 'Convex',      category: 'Backend',   color: '#FF5722', logo: 'https://cdn.simpleicons.org/convex/FF5722', isCore: true },
  { name: 'PostgreSQL',  category: 'Backend',   color: '#4169E1', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { name: 'MySQL',       category: 'Backend',   color: '#4479A1', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
  { name: 'ChromaDB',    category: 'Backend',   color: '#A855F7', logo: 'https://cdn.simpleicons.org/chromatic/A855F7' },
  { name: 'Pinecone',    category: 'Backend',   color: '#000000', logo: 'https://api.iconify.design/logos/pinecone.svg' },

  // ─── AI / ML ──────────────────────────────────────────────────────────
  { name: 'LangChain',   category: 'AI / ML',   color: '#1CD399', logo: 'https://cdn.simpleicons.org/langchain/1CD399', isCore: true },
  { name: 'LangGraph',   category: 'AI / ML',   color: '#FF6B6B', logo: 'https://cdn.simpleicons.org/langchain/FF6B6B', isCore: true },
  { name: 'RAG',         category: 'AI / ML',   color: '#F59E0B', logo: 'https://cdn.simpleicons.org/googlebard/F59E0B', isCore: true },
  { name: 'Groq',        category: 'AI / ML',   color: '#F55036', logo: 'https://api.iconify.design/logos/groq.svg', isCore: true },
  { name: 'Llama',       category: 'AI / ML',   color: '#046CE5', logo: 'https://cdn.simpleicons.org/meta/046CE5', isCore: true },
  { name: 'HuggingFace', category: 'AI / ML',   color: '#FFD21E', logo: 'https://cdn.simpleicons.org/huggingface/FFD21E' },
  { name: 'Streamlit',   category: 'AI / ML',   color: '#FF4B4B', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/streamlit/streamlit-original.svg' },
  { name: 'FastAPI',     category: 'AI / ML',   color: '#009688', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
  { name: 'ChromaDB',    category: 'AI / ML',   color: '#A855F7', logo: 'https://cdn.simpleicons.org/chromatic/A855F7' },
  { name: 'Pinecone',    category: 'AI / ML',   color: '#000000', logo: 'https://api.iconify.design/logos/pinecone.svg' },
  { name: 'Vector DBs',  category: 'AI / ML',   color: '#EC4899', logo: 'https://api.iconify.design/logos/pinecone.svg' },

  // ─── Tools ────────────────────────────────────────────────────────────
  { name: 'Git',         category: 'Tools',     color: '#F05032', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', isCore: true },
  { name: 'GitHub',      category: 'Tools',     color: '#FFFFFF', logo: 'https://cdn.simpleicons.org/github/FFFFFF', isCore: true },
  { name: 'Docker',      category: 'Tools',     color: '#2496ED', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { name: 'Postman',     category: 'Tools',     color: '#FF6C37', logo: 'https://cdn.simpleicons.org/postman/FF6C37' },
  { name: 'Jira',        category: 'Tools',     color: '#0052CC', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg' },
  { name: 'Jupyter',     category: 'Tools',     color: '#F37626', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg' },
];

export const TECH_NODES = Array.from(new Set(ALL_TECH.map((t) => t.name)));

const TABS = ['All', 'Languages', 'Frontend', 'Backend', 'AI / ML', 'Tools'] as const;

export function ActTechStack() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // In 'All' tab, deduplicate items by name so identical skills don't repeat unnecessarily
  const sourceList = activeTab === 'All'
    ? ALL_TECH.filter((item, idx, arr) => arr.findIndex(t => t.name === item.name) === idx)
    : ALL_TECH.filter((t) => t.category === activeTab);

  const filtered = sourceList.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    return !q ||
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q);
  });

  return (
    <section
      id="skills"
      className="relative w-full px-4 sm:px-8 md:px-16 py-16 sm:py-20 md:py-28 bg-[#050505]"
    >
      <div className="max-w-6xl mx-auto">

        {/* Section Header */}
        <div className="mb-6 sm:mb-10 md:mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase mb-2 sm:mb-3"
          >
            — Tech Arsenal —
          </motion.p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="heading-hover-sweep font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase leading-none"
            >
              Skills
            </motion.h2>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-white/40 tracking-wider">
                [ {TECH_NODES.length} Unique Technologies &amp; Tools ]
              </span>
            </div>
          </div>
        </div>

        {/* Top Horizontal Filter Tabs + Sleek Terminal Search Input */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 sm:mb-8">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar pb-1.5 sm:pb-0 -webkit-overflow-scrolling-touch">
            {TABS.map((tab) => {
              const count = tab === 'All' 
                ? TECH_NODES.length 
                : ALL_TECH.filter(t => t.category === tab).length;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 sm:px-4 py-1.5 rounded-full font-mono text-[11px] sm:text-xs transition-all duration-300 flex items-center gap-1.5 border whitespace-nowrap shrink-0 active:scale-95 ${
                    isActive
                      ? 'bg-white text-black font-bold border-white shadow-[0_0_20px_rgba(255,255,255,0.35)] scale-105'
                      : 'bg-white/[0.03] text-white/60 border-white/10 hover:border-white/40 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <span>{tab}</span>
                  <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-black/20 text-black font-semibold' : 'bg-white/10 text-white/40'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sleek Terminal Search Input */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/35 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find tech (e.g. C++, Llama, Groq)..."
              className="w-full bg-white/[0.03] hover:bg-white/[0.05] focus:bg-white/[0.06] border border-white/10 focus:border-white/40 rounded-full pl-8 pr-8 py-1.5 text-xs font-mono text-white placeholder-white/30 focus:outline-none transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-0.5 rounded transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Empty state for search */}
        {filtered.length === 0 && (
          <div className="py-16 text-center border border-white/10 rounded-2xl bg-white/[0.01]">
            <p className="font-mono text-sm text-white/40 mb-3">No matching technologies found for &ldquo;{searchQuery}&rdquo;</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveTab('All'); }}
              className="font-mono text-xs text-white/90 hover:text-white underline underline-offset-4 tracking-wider uppercase"
            >
              Reset Search &amp; Filter
            </button>
          </div>
        )}

        {/* Full-width Responsive Tech Grid with Bento Spotlight Physics */}
        <motion.div
          layout
          className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((tech, i) => (
              <TechCard key={`${tech.category}-${tech.name}`} tech={tech} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}

function TechCard({ tech, index }: { tech: TechItem; index: number }) {
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.015, 0.2) }}
      whileHover={{ y: -4, scale: 1.02 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/40 transition-all duration-300 cursor-default shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] overflow-hidden"
    >
      {/* Bento Spotlight radial glow that follows mouse cursor */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(130px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.09), transparent 80%)`,
        }}
      />
      {/* Spotlight border accent */}
      <div
        className="pointer-events-none absolute -inset-px rounded-xl transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(90px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.25), transparent 70%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />

      {/* CORE Badge on top-right */}
      {tech.isCore && (
        <div className="absolute top-1.5 right-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-sm shadow-sm">
          <span className="w-1 h-1 rounded-full bg-white shadow-[0_0_6px_#fff]" />
          <span className="text-[7.5px] font-mono font-bold tracking-wider text-white/80">CORE</span>
        </div>
      )}

      {/* Icon container with vibrant logo */}
      <div className="relative z-10 w-9 h-9 rounded-lg flex items-center justify-center border border-white/10 bg-white/5 transition-all duration-300 group-hover:scale-110 group-hover:border-white/40 shadow-inner mt-0.5">
        {!imgError ? (
          <img
            src={tech.logo}
            alt={tech.name}
            className="w-4.5 h-4.5 object-contain opacity-95 group-hover:opacity-100 transition-all duration-300"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <span className="text-sm font-extrabold font-mono text-white/80 group-hover:text-white transition-colors">
            {tech.name[0]}
          </span>
        )}
      </div>

      <div className="relative z-10 text-center space-y-0.5">
        <span className="text-xs font-semibold text-white/80 group-hover:text-white transition-colors block leading-tight">
          {tech.name}
        </span>
        <span className="text-[8.5px] font-mono text-white/35 group-hover:text-white/55 block">
          {tech.category}
        </span>
      </div>
    </motion.div>
  );
}
