'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search } from 'lucide-react';
import { useTactileSound } from '@/hooks/useTactileSound';

export function Navigation({ activeScene = 0 }: { activeScene?: number }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { playClick } = useTactileSound();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const NAV_LINKS = [
    { label: 'Home', href: '#hero', index: 0 },
    { label: 'About', href: '#about', index: 1 },
    { label: 'Journey', href: '#experience', index: 2 },
    { label: 'Coding', href: '#cp-stats', index: 3 },
    { label: 'Achievements', href: '#achievements', index: 4 },
    { label: 'Skills', href: '#skills', index: 5 },
    { label: 'Projects', href: '#projects', index: 6 },
    { label: 'Contact', href: '#contact', index: 7 },
  ];

  // Compact links for desktop pill with intelligent section grouping
  const DESKTOP_LINKS = [
    { label: 'Home', href: '#hero', matchIndices: [0] },
    { label: 'About', href: '#about', matchIndices: [1] },
    { label: 'Journey', href: '#experience', matchIndices: [2, 3, 4] },
    { label: 'Skills', href: '#skills', matchIndices: [5] },
    { label: 'Projects', href: '#projects', matchIndices: [6] },
    { label: 'Contact', href: '#contact', matchIndices: [7] },
  ];

  const handleLinkClick = (href: string) => {
    playClick();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Floating Glass Pill Navbar */}
      <header className="fixed top-5 sm:top-6 left-0 right-0 z-40 flex justify-center px-4 sm:px-6 pointer-events-auto">
        <nav
          className={`flex items-center justify-between md:justify-center w-full max-w-[calc(100vw-24px)] sm:max-w-md md:max-w-fit px-4 sm:px-6 py-2 sm:py-2.5 rounded-full liquid-glass-pill transition-all duration-300 ${
            scrolled ? 'scale-[0.98] shadow-[0_18px_50px_rgba(0,0,0,0.95)]' : 'scale-100'
          }`}
        >
          {/* Desktop Centered Navigation Links with Sliding Glass Capsule */}
          <div className="hidden md:flex items-center gap-1">
            {DESKTOP_LINKS.map((link) => {
              const isActive = link.matchIndices.includes(activeScene);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }}
                  className={`relative px-4 py-2 font-sans text-sm lg:text-[14.5px] font-medium tracking-tight rounded-full transition-colors duration-200 select-none ${
                    isActive ? 'text-white font-semibold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>

                  {/* VisionOS-style Sliding Glass Capsule */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBubble"
                      className="absolute inset-0 rounded-full bg-white/[0.13] border border-white/20 shadow-[0_2px_12px_rgba(255,255,255,0.08),inset_0_1px_1px_rgba(255,255,255,0.25)] backdrop-blur-md"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                </a>
              );
            })}

            {/* Subtle Divider */}
            <div className="h-4 w-[1px] bg-white/15 mx-1.5" />

            {/* Quick Command Palette Trigger (Cmd+K) */}
            <button
              type="button"
              onClick={() => {
                playClick();
                window.dispatchEvent(new CustomEvent('open-command-palette'));
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all text-xs font-mono border border-transparent hover:border-white/15"
              title="Search & Quick Actions (⌘K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="text-[11px] text-white/45">⌘K</span>
            </button>
          </div>

          {/* Mobile Header: Brand + Search + Hamburger (Sound button removed) */}
          <div className="flex md:hidden items-center justify-between w-full">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('#hero');
              }}
              className="font-display text-sm sm:text-base font-bold text-white tracking-wider flex items-center gap-2"
            >
              <span>Dhruv Bajaj</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </a>

            <div className="flex items-center gap-2">
              {/* Mobile Command Palette Button */}
              <button
                type="button"
                onClick={() => {
                  playClick();
                  window.dispatchEvent(new CustomEvent('open-command-palette'));
                }}
                className="p-2.5 rounded-full border border-white/10 text-white/70 active:bg-white/10 transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Hamburger Button */}
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className="p-2.5 rounded-full text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Full-Screen Slide-in Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden pointer-events-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-16 inset-x-3 max-w-lg mx-auto p-5 rounded-3xl bg-[#0C0C0E]/98 backdrop-blur-3xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.95)] flex flex-col gap-2 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
                  Navigation
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full text-white/50 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Links Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                {NAV_LINKS.map((link) => {
                  const isActive = activeScene === link.index;
                  return (
                    <button
                      key={link.label}
                      onClick={() => handleLinkClick(link.href)}
                      className={`text-left px-3.5 py-3 rounded-2xl border transition-all flex items-center justify-between ${
                        isActive
                          ? 'bg-white text-black font-bold border-white shadow-md'
                          : 'bg-white/[0.03] text-white/80 border-white/8 hover:bg-white/[0.08] hover:text-white'
                      }`}
                    >
                      <span className="font-display text-sm tracking-tight">{link.label}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Quick Resume & Hire CTA in Mobile Menu */}
              <div className="pt-3 mt-1 border-t border-white/10 flex flex-col gap-2">
                <a
                  href="https://drive.google.com/file/d/1muHU96RCNS1iCxL6H6SonHjeL6nJlkrA/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl border border-white/15 bg-white/5 text-white font-sans text-xs font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                >
                  <span>Download Résumé</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
