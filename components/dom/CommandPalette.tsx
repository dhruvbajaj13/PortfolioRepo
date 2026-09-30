'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Home,
  User,
  Briefcase,
  Trophy,
  Layers,
  FolderGit2,
  Mail,
  FileDown,
  Github,
  Linkedin,
  Copy,
  Check,
  Code2,
  ExternalLink,
  Command,
} from 'lucide-react';

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Actions' | 'Socials';
  title: string;
  subtitle: string;
  icon: React.ElementType;
  action: () => void;
  shortcut?: string;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('d4bajaj@gmail.com');
      showToast('Copied d4bajaj@gmail.com to clipboard! 📋');
    } catch {
      showToast('d4bajaj@gmail.com');
    }
  };

  const scrollTo = (id: string) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const COMMANDS: CommandItem[] = [
    // Navigation
    {
      id: 'nav-home',
      category: 'Navigation',
      title: 'Home',
      subtitle: 'Jump to hero scene & 3D workstation',
      icon: Home,
      action: () => scrollTo('hero'),
      shortcut: 'H',
    },
    {
      id: 'nav-about',
      category: 'Navigation',
      title: 'About Me',
      subtitle: 'Biography, mindset & journey',
      icon: User,
      action: () => scrollTo('about'),
      shortcut: 'A',
    },
    {
      id: 'nav-exp',
      category: 'Navigation',
      title: 'Experience',
      subtitle: 'Engineering roles & internship journey',
      icon: Briefcase,
      action: () => scrollTo('experience'),
      shortcut: 'E',
    },
    {
      id: 'nav-cp',
      category: 'Navigation',
      title: 'Coding Profiles & Streak',
      subtitle: 'LeetCode Knight (1951), 365-day streak & CodeChef',
      icon: Code2,
      action: () => scrollTo('cp-stats'),
      shortcut: 'C',
    },
    {
      id: 'nav-achieve',
      category: 'Navigation',
      title: 'Achievements',
      subtitle: '1000+ DSA, GSSOC, CodeX & AlgoUniversity finalists',
      icon: Trophy,
      action: () => scrollTo('achievements'),
      shortcut: 'M',
    },
    {
      id: 'nav-skills',
      category: 'Navigation',
      title: 'Skills & Tech Stack',
      subtitle: 'Languages, frameworks, databases & AI tools',
      icon: Layers,
      action: () => scrollTo('skills'),
      shortcut: 'S',
    },
    {
      id: 'nav-projects',
      category: 'Navigation',
      title: 'Projects',
      subtitle: '6 production applications & live demos',
      icon: FolderGit2,
      action: () => scrollTo('projects'),
      shortcut: 'P',
    },
    {
      id: 'nav-contact',
      category: 'Navigation',
      title: 'Contact',
      subtitle: 'Get in touch & direct inquiry',
      icon: Mail,
      action: () => scrollTo('contact'),
      shortcut: 'T',
    },

    // Actions
    {
      id: 'act-resume',
      category: 'Actions',
      title: 'Download Résumé',
      subtitle: 'Open latest CV in Google Drive',
      icon: FileDown,
      action: () => {
        window.open('https://drive.google.com/file/d/1F0QmpaQFUWuysUn1V8pO1E9kHdVS_BCZ/view', '_blank');
        setIsOpen(false);
      },
      shortcut: 'R',
    },
    {
      id: 'act-copy-email',
      category: 'Actions',
      title: 'Copy Email Address',
      subtitle: 'd4bajaj@gmail.com',
      icon: Copy,
      action: () => {
        copyEmail();
        setIsOpen(false);
      },
    },

    // External Profiles
    {
      id: 'soc-github',
      category: 'Socials',
      title: 'GitHub Profile',
      subtitle: 'github.com/dhruvbajaj13 (Repos & open source)',
      icon: Github,
      action: () => {
        window.open('https://github.com/dhruvbajaj13', '_blank');
        setIsOpen(false);
      },
    },
    {
      id: 'soc-leetcode',
      category: 'Socials',
      title: 'LeetCode Profile',
      subtitle: 'leetcode.com/u/nobodyknowswhy (Knight 1951)',
      icon: Code2,
      action: () => {
        window.open('https://leetcode.com/u/nobodyknowswhy/', '_blank');
        setIsOpen(false);
      },
    },
    {
      id: 'soc-linkedin',
      category: 'Socials',
      title: 'LinkedIn Profile',
      subtitle: 'linkedin.com/in/dhruvbajaj13',
      icon: Linkedin,
      action: () => {
        window.open('https://www.linkedin.com/in/dhruvbajaj13', '_blank');
        setIsOpen(false);
      },
    },
  ];

  // Filter commands by search
  const filtered = COMMANDS.filter((cmd) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.subtitle.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  // Global Keyboard listener for Cmd+K / Ctrl+K and custom event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleCustomOpen);
    };
  }, []);

  // Reset selectedIndex when filter changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  // Key navigation inside palette
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    }
  };

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-white text-black font-sans text-xs font-bold shadow-[0_10px_35px_rgba(255,255,255,0.4)] flex items-center gap-2 pointer-events-none"
          >
            <Check className="w-3.5 h-3.5 text-black" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-xl rounded-2xl border border-white/20 bg-[#0C0C0E]/95 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.95)] overflow-hidden z-10 flex flex-col max-h-[75vh]"
            >
              {/* Search Bar Input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-[#121215]">
                <Search className="w-4 h-4 text-white/50 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Type a command or jump to section..."
                  className="w-full bg-transparent text-white placeholder-white/40 text-sm font-sans focus:outline-none"
                />
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/10 text-white/60 border border-white/10">
                    ESC
                  </span>
                </div>
              </div>

              {/* Command List */}
              <div className="overflow-y-auto p-2 divide-y divide-white/5 space-y-1">
                {filtered.length === 0 ? (
                  <div className="py-12 text-center text-white/40 text-xs font-mono">
                    No results found for &quot;{search}&quot;
                  </div>
                ) : (
                  filtered.map((cmd, idx) => {
                    const Icon = cmd.icon;
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={cmd.id}
                        type="button"
                        onClick={cmd.action}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-3 transition-colors ${
                          isSelected
                            ? 'bg-white text-black font-semibold shadow-md'
                            : 'text-white/80 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                              isSelected
                                ? 'bg-black text-white border-black/20'
                                : 'bg-white/5 text-white/70 border-white/10'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="flex flex-col min-w-0">
                            <span className="text-xs sm:text-sm truncate">
                              {cmd.title}
                            </span>
                            <span
                              className={`text-[10px] truncate ${
                                isSelected ? 'text-black/70' : 'text-white/40'
                              }`}
                            >
                              {cmd.subtitle}
                            </span>
                          </div>
                        </div>

                        {/* Category or shortcut indicator */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                              isSelected
                                ? 'bg-black/10 border-black/20 text-black'
                                : 'bg-white/5 border-white/10 text-white/40'
                            }`}
                          >
                            {cmd.category}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer info bar */}
              <div className="px-4 py-2.5 bg-[#08080A] border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/40 select-none">
                <div className="flex items-center gap-3">
                  <span>
                    <kbd className="px-1 py-0.5 rounded bg-white/10 text-white/70 text-[9px]">↑</kbd>{' '}
                    <kbd className="px-1 py-0.5 rounded bg-white/10 text-white/70 text-[9px]">↓</kbd> navigate
                  </span>
                  <span>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70 text-[9px]">↵</kbd> select
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Command className="w-3 h-3 text-white/50" />
                  <span>Command Palette</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
