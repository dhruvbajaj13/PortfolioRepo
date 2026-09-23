'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export function Navigation({ activeScene = 0 }: { activeScene?: number }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NAV_LINKS = [
    { label: 'Home', href: '#hero', index: 0 },
    { label: 'About', href: '#about', index: 1 },
    { label: 'Journey', href: '#experience', index: 2 },
    { label: 'Projects', href: '#projects', index: 4 },
    { label: 'Contact', href: '#contact', index: 6 },
  ];

  return (
    <>
      {/* Top Floating Glass Pill Navbar (Comfortable Size & Padding) */}
      <header className="fixed top-6 left-0 right-0 z-40 flex justify-center px-4 pointer-events-auto">
        <nav
          className={`flex items-center justify-center px-8 sm:px-12 py-3.5 sm:py-4 rounded-full transition-all duration-500 max-w-fit border border-white/10 bg-[#0A0A0A]/90 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.9)] ${
            scrolled ? 'scale-95 border-white/15' : 'scale-100'
          }`}
        >
          {/* Desktop Centered Navigation Links */}
          <div className="hidden md:flex items-center gap-8 sm:gap-10">
            {NAV_LINKS.map((link) => {
              const isActive = activeScene === link.index;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`relative py-1.5 font-sans text-base font-semibold transition-colors duration-300 group ${
                    isActive ? 'text-white font-bold' : 'text-[#A8A8A8] hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>

                  {/* Left-to-Right Underline Animation */}
                  {isActive ? (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  ) : (
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white/60 rounded-full group-hover:w-full transition-all duration-300 ease-out" />
                  )}
                </a>
              );
            })}
          </div>

          {/* Mobile Menu Toggle & Brand Name */}
          <div className="flex md:hidden items-center justify-between w-full gap-6 px-1">
            <a href="#hero" className="font-display text-base font-bold text-white tracking-wider">
              Dhruv <span className="text-white">Bajaj</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full text-white hover:text-white/80 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-4 right-4 z-40 p-6 rounded-3xl bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col gap-4 pointer-events-auto md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-display text-lg font-semibold text-[#A8A8A8] hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
