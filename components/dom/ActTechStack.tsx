'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ALL_TECH = [
  // Languages
  { name: 'Java',         category: 'Languages', color: '#E76F00', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { name: 'JavaScript',  category: 'Languages', color: '#F7DF1E', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'TypeScript',  category: 'Languages', color: '#3178C6', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name: 'Python',      category: 'Languages', color: '#3776AB', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },

  // Frontend
  { name: 'React.js',    category: 'Frontend',  color: '#61DAFB', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Next.js',     category: 'Frontend',  color: '#FFFFFF', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
  { name: 'Tailwind CSS',category: 'Frontend',  color: '#06B6D4', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'Framer Motion',category:'Frontend',  color: '#BB4BFF', logo: 'https://cdn.simpleicons.org/framer/BB4BFF' },
  { name: 'HTML5 / CSS3',category: 'Frontend',  color: '#E34F26', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },

  // Backend
  { name: 'Node.js',     category: 'Backend',   color: '#339933', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: 'Express.js',  category: 'Backend',   color: '#FFFFFF', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
  { name: 'REST APIs',   category: 'Backend',   color: '#FFFFFF', logo: 'https://cdn.simpleicons.org/fastapi/00E5FF' },
  { name: 'MongoDB',     category: 'Backend',   color: '#47A248', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'MySQL',       category: 'Backend',   color: '#4479A1', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
  { name: 'ChromaDB',    category: 'Backend',   color: '#A855F7', logo: 'https://cdn.simpleicons.org/chromatic/A855F7' },

  // AI / ML
  { name: 'LangChain',   category: 'AI / ML',   color: '#1CD399', logo: 'https://cdn.simpleicons.org/langchain/1CD399' },
  { name: 'LangGraph',   category: 'AI / ML',   color: '#FF6B6B', logo: 'https://cdn.simpleicons.org/langchain/FF6B6B' },
  { name: 'OpenAI',      category: 'AI / ML',   color: '#FFFFFF', logo: 'https://cdn.simpleicons.org/openai/FFFFFF' },
  { name: 'RAG',         category: 'AI / ML',   color: '#F59E0B', logo: 'https://cdn.simpleicons.org/googlebard/F59E0B' },
  { name: 'Vector DBs',  category: 'AI / ML',   color: '#EC4899', logo: 'https://cdn.simpleicons.org/pinecone/EC4899' },
  { name: 'HuggingFace', category: 'AI / ML',   color: '#FFD21E', logo: 'https://cdn.simpleicons.org/huggingface/FFD21E' },

  // Tools
  { name: 'Git',         category: 'Tools',     color: '#F05032', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'GitHub',      category: 'Tools',     color: '#FFFFFF', logo: 'https://cdn.simpleicons.org/github/FFFFFF' },
  { name: 'Docker',      category: 'Tools',     color: '#2496ED', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { name: 'Postman',     category: 'Tools',     color: '#FF6C37', logo: 'https://cdn.simpleicons.org/postman/FF6C37' },
  { name: 'Jira',        category: 'Tools',     color: '#0052CC', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg' },
  { name: 'Jupyter',     category: 'Tools',     color: '#F37626', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg' },
];

export const TECH_NODES = ALL_TECH.map((t) => t.name);

const TABS = ['All', 'Languages', 'Frontend', 'Backend', 'AI / ML', 'Tools'];

export function ActTechStack() {
  const [activeTab, setActiveTab] = useState('All');

  const filtered = activeTab === 'All'
    ? ALL_TECH
    : ALL_TECH.filter((t) => t.category === activeTab);

  return (
    <section
      id="skills"
      className="relative w-full px-4 sm:px-8 md:px-16 py-20 md:py-28 bg-[#050505]"
    >
      <div className="max-w-6xl mx-auto">

        {/* Section Header */}
        <div className="mb-10 md:mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase mb-3"
          >
            — Tech Arsenal —
          </motion.p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none"
            >
              Skills
            </motion.h2>
            <span className="font-mono text-xs text-white/40 tracking-wider">
              [ {ALL_TECH.length} Active Technologies & Tools ]
            </span>
          </div>
        </div>

        {/* Top Horizontal Filter Tabs (Zero Empty Space) */}
        <div className="flex items-center gap-2 sm:gap-3 mb-8 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
          {TABS.map((tab) => {
            const count = tab === 'All' ? ALL_TECH.length : ALL_TECH.filter(t => t.category === tab).length;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 sm:px-5 py-2 rounded-full font-mono text-xs transition-all duration-300 flex items-center gap-2 border whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-white text-black font-bold border-white shadow-[0_0_20px_rgba(255,255,255,0.35)] scale-105'
                    : 'bg-white/[0.03] text-white/60 border-white/10 hover:border-white/40 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span>{tab}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-black/20 text-black font-semibold' : 'bg-white/10 text-white/40'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Full-width Responsive Tech Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((tech, i) => (
              <TechCard key={tech.name} tech={tech} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}

function TechCard({ tech, index }: { tech: typeof ALL_TECH[0]; index: number }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.3) }}
      whileHover={{ y: -4, scale: 1.04 }}
      className="group relative flex flex-col items-center justify-center gap-2.5 p-3.5 sm:p-4 rounded-2xl border border-white/8 bg-white/[0.02] hover:border-white/35 hover:bg-white/[0.03] transition-all duration-300 cursor-default shadow-md hover:shadow-xl"
    >
      {/* Icon container with vibrant colored logo */}
      <div className="w-11 sm:w-12 h-11 sm:h-12 rounded-xl flex items-center justify-center border border-white/10 bg-white/5 transition-all duration-300 group-hover:scale-110 group-hover:border-white/40 shadow-inner">
        {!imgError ? (
          <img
            src={tech.logo}
            alt={tech.name}
            className="w-6 h-6 object-contain opacity-100 transition-transform duration-300"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <span className="text-base font-extrabold font-mono text-white/80 group-hover:text-white transition-colors">
            {tech.name[0]}
          </span>
        )}
      </div>

      <div className="text-center space-y-0.5">
        <span className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors block leading-tight">
          {tech.name}
        </span>
        <span className="text-[9px] font-mono text-white/30 group-hover:text-white/50 block">
          {tech.category}
        </span>
      </div>
    </motion.div>
  );
}
