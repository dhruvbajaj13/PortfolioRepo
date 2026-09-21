'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  Send,
  Github,
  Linkedin,
  Mail,
  Instagram,
  CheckCircle,
  Copy,
  Check,
} from 'lucide-react';
import emailjs from '@emailjs/browser';

// ─── EmailJS config ──────────────────────────────────────────────
// Fill in your actual EmailJS IDs here or set them in .env.local
const EMAILJS_SERVICE_ID  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';
// ─────────────────────────────────────────────────────────────────

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

export function ActContact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const emailAddress = 'd4bajaj@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message || !formData.name) return;
    setIsSubmitting(true);
    setError('');

    const isEmailJSConfigured =
      EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID' &&
      EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
      EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY';

    let sentViaEmailJS = false;

    if (isEmailJSConfigured) {
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
            to_email: emailAddress,
          },
          EMAILJS_PUBLIC_KEY
        );
        sentViaEmailJS = true;
      } catch (err) {
        console.warn('EmailJS delivery fallback to direct mail client:', err);
      }
    }

    // Direct fallback: if EmailJS keys are not provided or error occurs,
    // open user mail client prefilled with message addressed to d4bajaj@gmail.com
    if (!sentViaEmailJS) {
      const subject = encodeURIComponent(`Portfolio Message from ${formData.name}`);
      const body = encodeURIComponent(
        `Hi Dhruv,\n\n${formData.message}\n\n---\nSender: ${formData.name}\nEmail: ${formData.email}`
      );
      window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
    }

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const SOCIAL_CARDS = [
    {
      label: 'GitHub',
      href: 'https://github.com/dhruvbajaj13',
      icon: <Github className="w-7 h-7 text-white transition-transform duration-300 group-hover:scale-105" />,
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/dhruvbajaj13',
      icon: <Linkedin className="w-7 h-7 text-[#0077B5] transition-transform duration-300 group-hover:scale-110" />,
    },
    {
      label: 'X',
      href: 'https://x.com/DhruvBajaj43391',
      icon: <XIcon className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-105" />,
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/dhruvvv_1307',
      icon: <Instagram className="w-7 h-7 text-[#E4405F] transition-transform duration-300 group-hover:scale-110" />,
    },
    {
      label: 'Discord',
      href: 'https://discord.com/invite/8PcMKtM6',
      icon: <DiscordIcon className="w-7 h-7 text-[#5865F2] transition-transform duration-300 group-hover:scale-110" />,
    },
  ];

  return (
    <section
      id="contact"
      className="relative w-full flex flex-col justify-center px-4 sm:px-8 md:px-16 py-16 md:py-24 overflow-hidden pointer-events-none bg-[#050505]"
    >
      <div className="max-w-5xl mx-auto w-full">

        {/* Section Header */}
        <div className="text-center space-y-3 mb-12 pointer-events-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            viewport={{ once: true }}
            className="font-display text-4xl sm:text-6xl font-extrabold text-white tracking-tight uppercase"
          >
            Get in <span className="text-white">Touch</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            viewport={{ once: true }}
            className="font-display text-base sm:text-xl font-medium text-[#A8A8A8] tracking-wide max-w-2xl mx-auto"
          >
            Open to internships and full-time opportunities.
          </motion.p>
        </div>

        {/* Mac-Style Terminal Contact Form Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/10 overflow-hidden pointer-events-auto shadow-[0_20px_60px_rgba(0,0,0,0.9)] bg-[#141414]"
        >
          {/* Mac Window Title Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#1C1C1C] border-b border-white/8">
            {/* Traffic light dots */}
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F57] shadow-[0_0_6px_rgba(255,95,87,0.6)] hover:brightness-110 cursor-default transition-all" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#FEBC2E] shadow-[0_0_6px_rgba(254,188,46,0.5)] hover:brightness-110 cursor-default transition-all" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#28C840] shadow-[0_0_6px_rgba(40,200,64,0.5)] hover:brightness-110 cursor-default transition-all" />
            </div>
            {/* Title */}
            <span className="font-mono text-xs text-white/40 select-none">
              dhruvbajaj.dev — contact@quantum-terminal
            </span>
            {/* Right icon */}
            <div className="flex items-center gap-1.5 text-white/40">
              <Terminal className="w-3.5 h-3.5" />
              <span className="font-mono text-[10px] hidden sm:inline">ENCRYPTED CHANNEL</span>
            </div>
          </div>

          {/* Prompt line */}
          <div className="px-6 pt-4 pb-1">
            <span className="font-mono text-xs text-white/30">
              $ <span className="text-white/50">new_message --to=d4bajaj@gmail.com</span>
            </span>
          </div>

          {/* Form Content */}
          <div className="px-6 pb-8 pt-4">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-mono text-[10px] text-white/35 uppercase tracking-wider mb-1.5">
                        // YOUR NAME
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-white/8 text-white font-sans text-sm focus:outline-none focus:border-[#FF6B2C]/50 focus:ring-1 focus:ring-[#FF6B2C]/30 transition-all placeholder:text-white/20"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] text-white/35 uppercase tracking-wider mb-1.5">
                        // YOUR EMAIL
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-white/8 text-white font-sans text-sm focus:outline-none focus:border-[#FF6B2C]/50 focus:ring-1 focus:ring-[#FF6B2C]/30 transition-all placeholder:text-white/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-white/35 uppercase tracking-wider mb-1.5">
                      // MESSAGE
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell me about your project or opportunity..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-white/8 text-white font-sans text-sm focus:outline-none focus:border-[#FF6B2C]/50 focus:ring-1 focus:ring-[#FF6B2C]/30 transition-all placeholder:text-white/20 resize-none"
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 font-mono text-xs">{error}</p>
                  )}

                  {/* Send Button */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-7 py-3 rounded-full bg-[#FF6B2C] font-sans text-sm font-bold text-black shadow-[0_0_20px_rgba(255,107,44,0.35)] hover:shadow-[0_0_35px_rgba(255,107,44,0.6)] hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                    >
                      <span>{isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}</span>
                      <Send className={`w-4 h-4 ${isSubmitting ? 'animate-bounce' : ''}`} />
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-[#28C840]/10 border border-[#28C840]/40 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-7 h-7 text-[#28C840]" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white">
                    MESSAGE SENT ✓
                  </h3>
                  <p className="font-sans text-[#A8A8A8] max-w-md mx-auto text-sm leading-relaxed">
                    Thanks for reaching out! I&apos;ll reply to <span className="text-white font-semibold">{formData.email}</span> within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', message: '' });
                    }}
                    className="font-mono text-xs text-white/40 underline pt-2 block mx-auto hover:text-white/70 transition-colors"
                  >
                    [ SEND ANOTHER MESSAGE ]
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Quick Email Copy Card */}
        <div className="mt-8 flex items-center justify-center pointer-events-auto">
          <div className="px-6 py-4 rounded-2xl bg-[#080808] border border-white/10 flex items-center gap-4 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Mail className="w-5 h-5" />
            </div>

            <div className="text-left">
              <span className="font-mono text-[11px] text-[#A8A8A8] block uppercase tracking-wider">
                Email
              </span>
              <span className="font-mono text-sm sm:text-base font-bold text-white">
                {emailAddress}
              </span>
            </div>

            <button
              onClick={handleCopyEmail}
              className="ml-4 px-3.5 py-1.5 rounded-lg bg-[#050505] border border-white/10 font-mono text-xs font-semibold text-white hover:border-[#FF6B2C] hover:text-[#FF6B2C] transition-colors flex items-center gap-1.5"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 5 Social Media Cards Grid */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-5 gap-4 pointer-events-auto">
          {SOCIAL_CARDS.map((card, idx) => (
            <motion.a
              key={card.label}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden group p-6 rounded-2xl border border-white/10 hover:border-[#FF6B2C]/40 hover:bg-[#FF6B2C]/[0.04] flex flex-col items-center justify-center gap-3 transition-all duration-300 shadow-xl bg-[#0C0C0C] hover:scale-105"
            >
              <div className="relative z-10 flex flex-col items-center gap-2.5">
                {card.icon}
                <span className="font-sans text-sm font-bold text-[#A8A8A8] group-hover:text-white transition-colors">
                  {card.label}
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Centered Footer Section */}
        <footer className="mt-16 text-center space-y-1.5 pointer-events-auto border-t border-white/10 pt-8">
          <h4 className="font-display text-lg sm:text-xl font-bold text-white">
            Dhruv Bajaj
          </h4>
          <p className="font-sans text-xs sm:text-sm text-[#A8A8A8] font-light">
            Web Developer • Software Engineer
          </p>
          <p className="font-sans text-[11px] text-[#A8A8A8]/60 pt-2">
            © {new Date().getFullYear()} Dhruv Bajaj. All rights reserved.
          </p>
        </footer>

      </div>
    </section>
  );
}
