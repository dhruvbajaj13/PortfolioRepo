'use client';

import React from 'react';
import { motion } from 'framer-motion';

const STATS = [
  { value: '10+', label: 'Projects Shipped' },
  { value: '3+', label: 'Internships' },
  { value: '1000+', label: 'Problems Solved' },
  { value: '2027', label: 'Graduating' },
];

export function ActAbout() {
  return (
    <section
      id="about"
      className="relative w-full px-4 sm:px-8 md:px-16 py-24 md:py-32 bg-[#050505]"
    >
      <div className="max-w-6xl mx-auto">

        {/* Header — same massive style as Experience */}
        <div className="mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase mb-4"
          >
            — Who I Am —
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none"
          >
            About Me
          </motion.h2>
        </div>

        {/* Two-column layout — same as Experience */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-stretch">

          {/* Left — profile photo */}
          <div className="w-full lg:w-[36%] flex justify-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-full aspect-square max-w-[310px] lg:max-w-[350px] rounded-2xl overflow-hidden border border-white/15 bg-white/[0.03] group shadow-2xl"
            >
              <img
                src="/images/dhruv_profile.jpg"
                alt="Dhruv Bajaj"
                className="w-full h-full object-cover opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
            </motion.div>
          </div>

          {/* Right — detail panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 w-full rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10 flex flex-col justify-between gap-8"
          >
            {/* Bio text */}
            <div className="pb-6 border-b border-white/10">
              <h3 className="font-display font-black text-white text-2xl md:text-3xl tracking-tight mb-4">
                Dhruv Bajaj
              </h3>
              <div className="flex flex-col gap-4 text-white/65 text-sm md:text-base leading-relaxed font-light">
                <p>
                  I’m a <span className="text-white font-medium">final year B.Tech student</span> at <span className="text-white font-medium">NSUT</span> pursuing <span className="text-white font-medium">Electronics &amp; Communication Engineering</span> with a specialization in <span className="text-white font-medium">IoT</span>. I’m passionate about software development and enjoy building solutions that solve real-world problems.
                </p>
                <p>
                  I have a strong foundation in <span className="text-white font-medium">Data Structures &amp; Algorithms using Java</span> and hands-on experience in full-stack web development using <span className="text-white font-medium">React.js, Node.js, Express.js, and MongoDB</span>. Recently, I’ve also been exploring AI technologies and building applications using <span className="text-white font-medium">LangChain, LangGraph, RAG, Embeddings, Vector DB</span>, and LLM-based systems to create intelligent and practical solutions.
                </p>
                <p>
                  I’m always eager to learn new technologies, work on impactful projects, and grow as a software engineer. Currently, I’m looking for <span className="text-white font-medium">internship opportunities</span> where I can contribute, learn from experienced developers, and gain industry experience.
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                  className="flex flex-col gap-1 p-4 rounded-xl border border-white/8 bg-white/[0.02] hover:border-[#FF6B2C]/30 transition-colors"
                >
                  <span className="font-display font-black text-white text-2xl md:text-3xl tracking-tight">
                    {s.value}
                  </span>
                  <span className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
                    {s.label}
                  </span>
                </motion.div>
              ))}
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
