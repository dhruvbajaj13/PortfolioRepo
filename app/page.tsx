'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import { useLenis } from '@/hooks/useLenis';
import { CustomCursor } from '@/components/dom/CustomCursor';
import { CinematicPreloader } from '@/components/dom/CinematicPreloader';
import { Navigation } from '@/components/dom/Navigation';
import { CommandPalette } from '@/components/dom/CommandPalette';

import { ActHero } from '@/components/dom/ActHero';
import { ActAbout } from '@/components/dom/ActAbout';
import { ActExperience } from '@/components/dom/ActExperience';
import { ActCPStats } from '@/components/dom/ActCPStats';
import { ActAchievements } from '@/components/dom/ActAchievements';
import { ActTechStack } from '@/components/dom/ActTechStack';
import { ActProjects } from '@/components/dom/ActProjects';
import { ActContact } from '@/components/dom/ActContact';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeScene, setActiveScene] = useState(0);

  // Initialize Lenis smooth scroll
  useLenis();

  // Track active scene in viewport for Navigation scroll-spy
  useEffect(() => {
    const handleScroll = () => {
      const sceneIds = ['hero', 'about', 'experience', 'cp-stats', 'achievements', 'skills', 'projects', 'contact'];
      const scrollPos = window.scrollY + window.innerHeight / 2;

      for (let i = 0; i < sceneIds.length; i++) {
        const el = document.getElementById(sceneIds[i]);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveScene(i);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="relative bg-[#050505] bg-noise min-h-screen text-white overflow-x-hidden selection:bg-white/30 selection:text-[#FFFFFF]">
      {/* Preloader */}
      <AnimatePresence>
        {isLoading && (
          <CinematicPreloader onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* Premium Magnetic Cursor */}
      <CustomCursor />

      {/* Global Interactive Command Palette (Cmd+K) */}
      <CommandPalette />

      {/* Top Floating Pill Navigation */}
      <Navigation activeScene={activeScene} />

      {/* Natural Filmlike Continuous Layout */}
      <div className="relative z-10 space-y-8 md:space-y-12">
        <ActHero />
        <ActAbout />
        <ActExperience />
        <ActCPStats />
        <ActAchievements />
        <ActTechStack />
        <ActProjects />
        <ActContact />
      </div>
    </main>
  );
}
