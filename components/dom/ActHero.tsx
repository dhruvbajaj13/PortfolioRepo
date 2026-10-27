'use client';

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowDown, ExternalLink, Download } from "lucide-react";
import * as THREE from "three";

// ─── 1. Ultra-Lightweight 3D Geometric Spinning Wireframe & Particle Background ───
const Hero3DGeometricBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "low-power",
      precision: "lowp",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // 1. Left spinning wireframe icosahedron — Vibrant Cyan (0x00f0ff)
    const icoGeo1 = new THREE.IcosahedronGeometry(1.6, 1);
    const icoMat1 = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const icoMesh1 = new THREE.Mesh(icoGeo1, icoMat1);
    icoMesh1.position.set(-3.5, 0.5, -2);
    scene.add(icoMesh1);

    // 2. Right spinning wireframe icosahedron — Electric Violet (0xa855f7)
    const icoGeo2 = new THREE.IcosahedronGeometry(2.0, 1);
    const icoMat2 = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const icoMesh2 = new THREE.Mesh(icoGeo2, icoMat2);
    icoMesh2.position.set(3.8, -0.2, -3);
    scene.add(icoMesh2);


    // 4. Bottom-Left floating wireframe Octahedron — Warm Amber (0xf59e0b)
    const octGeo = new THREE.OctahedronGeometry(1.1, 0);
    const octMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const octMesh = new THREE.Mesh(octGeo, octMat);
    octMesh.position.set(-2.8, -2.2, -2);
    scene.add(octMesh);

    // 5. Far Top-Left floating wireframe Dodecahedron — Radiant Blue (0x3b82f6)
    const dodecGeo = new THREE.DodecahedronGeometry(0.95, 0);
    const dodecMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    });
    const dodecMesh = new THREE.Mesh(dodecGeo, dodecMat);
    dodecMesh.position.set(-1.8, 2.4, -3.2);
    scene.add(dodecMesh);

    // 260 Ambient Multicolor Floating Particles
    const count = 260;
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const palette = [
      new THREE.Color(0x00f0ff), // Cyan
      new THREE.Color(0xa855f7), // Violet
      new THREE.Color(0x10b981), // Emerald
      new THREE.Color(0xf59e0b), // Amber
      new THREE.Color(0x3b82f6), // Blue
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      const c = palette[i % palette.length];
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(cols, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    let animId: number;
    let clock = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;
      clock += 0.015;

      // Subtle rotation and gentle bobbing
      icoMesh1.rotation.y += 0.0025;
      icoMesh1.rotation.x += 0.0015;
      icoMesh1.position.y = 0.5 + Math.sin(clock * 0.8) * 0.08;

      icoMesh2.rotation.y -= 0.002;
      icoMesh2.rotation.x -= 0.001;
      icoMesh2.position.y = -0.2 + Math.cos(clock * 0.7) * 0.08;

      octMesh.rotation.x -= 0.004;
      octMesh.rotation.y += 0.003;

      dodecMesh.rotation.y += 0.0035;
      dodecMesh.rotation.x += 0.002;

      particles.rotation.y += 0.0004;

      camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.04;
      camera.position.y += (mouseY * 0.2 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) container.removeChild(renderer.domElement);
      icoGeo1.dispose();
      icoMat1.dispose();
      icoGeo2.dispose();
      icoMat2.dispose();
      octGeo.dispose();
      octMat.dispose();
      dodecGeo.dispose();
      dodecMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none opacity-80" />;
};

// ─── 2. Cyberpunk Night Drive 3D Supercar Scene (Locked 60-120FPS) ───
import { HeroCyberpunkCar3D } from "./HeroCyberpunkCar3D";

// Roles for Typewriter Text Loop
const ROLES = [
  "Full-Stack Developer",
  "AI Engineer",
  "DSA Enthusiast",
  "Software Developer",
];

export function ActHero({
  selectedProject,
  setSelectedProject,
}: {
  selectedProject?: any;
  setSelectedProject?: (proj: any) => void;
}) {
  const RESUME_URL = "https://drive.google.com/file/d/1muHU96RCNS1iCxL6H6SonHjeL6nJlkrA/view";

  // Typewriter Loop Logic
  const [roleIndex, setRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const targetRole = ROLES[roleIndex];
    const typingSpeed = isDeleting ? 40 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setCurrentText(targetRole.substring(0, currentText.length + 1));
        if (currentText === targetRole) {
          setTimeout(() => setIsDeleting(true), 1600);
        }
      } else {
        setCurrentText(targetRole.substring(0, currentText.length - 1));
        if (currentText === "") {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % ROLES.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, roleIndex]);

  const scrollToNext = () => {
    const nextEl = document.getElementById("about");
    if (nextEl) {
      nextEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex flex-col justify-between px-4 sm:px-8 md:px-12 lg:px-16 pt-20 sm:pt-28 pb-8 sm:pb-10 overflow-hidden z-10 bg-[#050505]"
    >
      {/* 3D Wireframe & Particle Background */}
      <Hero3DGeometricBackground />

      {/* Subtle Volumetric Ambient Glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)] blur-[140px] pointer-events-none z-0" />

      {/* Main Hero Layout: 2 Columns (Responsive Stack on Mobile, Side-by-Side on Desktop) */}
      <div className="max-w-7xl mx-auto w-full my-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14 relative z-10">
        
        {/* Left Column: Text & Actions */}
        <div className="w-full lg:w-[52%] flex flex-col items-center lg:items-start text-center lg:text-left space-y-5 sm:space-y-6">
          
          {/* Header Title Lockup: Badge & Typewriter Centered relative to Name */}
          <div className="flex flex-col items-center lg:items-center max-w-fit w-full lg:w-auto">
            {/* Status Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0C0C0E] border border-white/10 text-xs font-semibold text-slate-300 shadow-md backdrop-blur-md mb-2.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Open to SDE Opportunities / Internship</span>
            </motion.div>

            {/* Hero Name Title */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="heading-hover-sweep font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight text-center cursor-pointer"
            >
              Dhruv Bajaj
            </motion.h1>

            {/* Typewriter Dynamic Role Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="h-9 sm:h-10 flex items-center justify-center mt-1"
            >
              <span className="font-display text-base sm:text-xl md:text-2xl font-semibold text-white tracking-wide text-center">
                {currentText}
                <span className="text-white animate-pulse ml-0.5">|</span>
              </span>
            </motion.div>
          </div>

          {/* Description Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="font-sans text-sm sm:text-base md:text-lg text-[#A8A8A8] max-w-xl leading-relaxed font-light"
          >
            Software engineer building production-grade full-stack web platforms and autonomous AI systems. Dedicated to algorithms, scalable architecture, and clean code.
          </motion.p>

          {/* Hero Action CTA Buttons (Fully Mobile Responsive) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="pt-1 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 w-full sm:w-auto"
          >
            {/* Primary CTA: View My Work ↗ */}
            <a
              href="#projects"
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-[#FFFFFF] font-sans text-sm font-bold text-black shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.7)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>View My Work</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Secondary CTA: Download Résumé */}
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3 rounded-2xl border border-white/15 text-white font-sans text-sm font-bold hover:border-white/60 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg bg-[#0C0C0E]"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Download Résumé</span>
            </a>

            {/* Tertiary CTA: Contact */}
            <a
              href="#contact"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-white/10 text-white/70 hover:text-white font-sans text-sm font-medium hover:border-white/30 hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Let&apos;s Talk</span>
            </a>
          </motion.div>

          {/* Social Icons Row (Centered) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="pt-1 flex items-center justify-center gap-3 w-full max-w-lg"
          >
            <a
              href="https://github.com/dhruvbajaj13"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl text-[#A8A8A8] hover:text-white border border-white/10 hover:border-white hover:scale-110 transition-all duration-300 shadow-md bg-[#0C0C0E]"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/dhruvbajaj13"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl text-[#A8A8A8] hover:text-white border border-white/10 hover:border-white hover:scale-110 transition-all duration-300 shadow-md bg-[#0C0C0E]"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:d4bajaj@gmail.com"
              className="p-3 rounded-xl text-[#A8A8A8] hover:text-white border border-white/10 hover:border-white hover:scale-110 transition-all duration-300 shadow-md bg-[#0C0C0E]"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Stat Cards Container */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="pt-2 w-full max-w-lg"
          >
            <div className="flex flex-row items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5 rounded-2xl border border-white/10 bg-[#0C0C0E]/90 shadow-xl backdrop-blur-xl">
              <div className="text-center">
                <div className="font-display text-lg sm:text-2xl font-extrabold text-[#FFFFFF]">1,100+</div>
                <div className="font-mono text-[8px] sm:text-[9.5px] text-[#A8A8A8] uppercase tracking-wider mt-0.5">LeetCode Solved</div>
              </div>

              <div className="w-px h-6 sm:h-7 bg-white/10" />

              <div className="text-center">
                <div className="font-display text-lg sm:text-2xl font-extrabold text-white">6+</div>
                <div className="font-mono text-[8px] sm:text-[9.5px] text-[#A8A8A8] uppercase tracking-wider mt-0.5">Featured Apps</div>
              </div>

              <div className="w-px h-6 sm:h-7 bg-white/10" />

              <div className="text-center">
                <div className="font-display text-lg sm:text-2xl font-extrabold text-[#FFFFFF]">Top 3%</div>
                <div className="font-mono text-[8px] sm:text-[9.5px] text-[#A8A8A8] uppercase tracking-wider mt-0.5">LeetCode Knight</div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Right Column: 3D Cyberpunk Night Drive Supercar (Interactive & Locked 60FPS) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="w-full lg:w-[48%] flex flex-col items-center justify-center relative"
        >
          <div className="relative w-full max-w-[380px] sm:max-w-[500px] lg:max-w-[560px] aspect-[16/10] rounded-3xl border border-white/15 hover:border-cyan-500/40 bg-[#0C0C0E]/95 shadow-[0_20px_60px_rgba(0,0,0,0.95)] hover:shadow-[0_25px_70px_rgba(255,0,128,0.22)] overflow-hidden backdrop-blur-2xl flex flex-col group/carcard transition-all duration-300">
            {/* 3D Canvas Viewport */}
            <div className="relative flex-1 w-full h-full overflow-hidden">
              <HeroCyberpunkCar3D />
            </div>
          </div>
        </motion.div>

      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="flex items-center justify-center pt-2 relative z-10"
      >
        <button
          onClick={scrollToNext}
          className="p-2 sm:p-2.5 rounded-full border border-white/10 text-[#A8A8A8] hover:text-[#FFFFFF] hover:border-white/60 transition-colors bg-[#080808]"
          aria-label="Scroll to About"
        >
          <ArrowDown className="w-4 h-4 animate-bounce text-white" />
        </button>
      </motion.div>
    </section>
  );
}
