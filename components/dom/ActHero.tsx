'use client';

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowDown, ExternalLink, Download, Terminal, Code2, Cpu, Activity } from "lucide-react";
import * as THREE from "three";


// ─── 1. Smooth 3D Geometric Spinning Wireframes + Floating Particle Constellation ───
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
      powerPreference: 'low-power',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1); // Keep at 1 for perf
    container.appendChild(renderer.domElement);

    // Left spinning wireframe icosahedron
    const icoGeo1 = new THREE.IcosahedronGeometry(1.6, 1);
    const icoMat1 = new THREE.MeshBasicMaterial({ color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.16 });
    const icoMesh1 = new THREE.Mesh(icoGeo1, icoMat1);
    icoMesh1.position.set(-3.5, 0.5, -2);
    scene.add(icoMesh1);

    // Right spinning wireframe icosahedron
    const icoGeo2 = new THREE.IcosahedronGeometry(2.2, 1);
    const icoMat2 = new THREE.MeshBasicMaterial({ color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.19 });
    const icoMesh2 = new THREE.Mesh(icoGeo2, icoMat2);
    icoMesh2.position.set(3.8, -0.2, -3);
    scene.add(icoMesh2);

    // Floating particle constellation
    const particleCount = 400;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const cyan = new THREE.Color(0x00e5ff);
    const white = new THREE.Color(0xffffff);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      const c = Math.random() > 0.45 ? cyan : white;
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const particleMat = new THREE.PointsMaterial({ size: 0.03, vertexColors: true, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Gentle mouse parallax
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      icoMesh1.rotation.y += 0.003; icoMesh1.rotation.x += 0.002;
      icoMesh2.rotation.y -= 0.0025; icoMesh2.rotation.x -= 0.0015;
      particles.rotation.y += 0.0005;
      camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.04;
      camera.position.y += (mouseY * 0.2 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) container.removeChild(renderer.domElement);
      icoGeo1.dispose(); icoMat1.dispose(); icoGeo2.dispose(); icoMat2.dispose();
      particleGeo.dispose(); particleMat.dispose(); renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none opacity-80" />;
};

// ─── 2. Smooth CSS + Canvas2D Developer Terminal Card (Zero WebGL Lag) ───
export type WorkstationScreenMode = "terminal" | "matrix" | "specs" | "visualizer";

const WorkstationCard: React.FC<{
  currentMode: WorkstationScreenMode;
  onModeChange: (m: WorkstationScreenMode) => void;
  onDuckQuack?: () => void;
}> = ({ currentMode, onModeChange, onDuckQuack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef<WorkstationScreenMode>(currentMode);
  const animRef = useRef<number>(0);
  const frameRef = useRef<number>(0);
  const tiltRef = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  modeRef.current = currentMode;

  // Mouse tilt for card
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      tiltRef.current = {
        x: Math.max(-8, Math.min(8, dy * -6)),
        y: Math.max(-8, Math.min(8, dx * 6)),
      };
    };
    const onLeave = () => { tiltRef.current = { x: 0, y: 0 }; };
    window.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Animation loop using requestAnimationFrame + tilt via CSS var
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    let curX = 0, curY = 0;
    const applyTilt = () => {
      curX += (tiltRef.current.x - curX) * 0.08;
      curY += (tiltRef.current.y - curY) * 0.08;
      card.style.transform = `perspective(900px) rotateX(${curX}deg) rotateY(${curY}deg) scale3d(1.015,1.015,1.015)`;
      animRef.current = requestAnimationFrame(applyTilt);
    };
    animRef.current = requestAnimationFrame(applyTilt);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Canvas 2D draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 480, H = 320;
    canvas.width = W;
    canvas.height = H;

    // Matrix state
    const COLS = 22;
    const drops = Array.from({ length: COLS }, () => Math.floor(Math.random() * -30));
    const CHARS = "01XYZΩλπΔ√<>{}[]=/*#!ABCDEF";

    // Terminal lines
    const termLines = [
      { text: "$ dhruv_bajaj --mode=sde-ready", color: "#4ade80" },
      { text: "  LeetCode Knight · 1933 Rating [TOP 3%]", color: "#a78bfa" },
      { text: "  Full-Stack: Next.js MERN [ONLINE]", color: "#7dd3fc" },
      { text: "  Agentic RAG + LangChain AI [READY]", color: "#f9a8d4" },
      { text: "  SIH Winner · CleanCity IoT [DEPLOYED]", color: "#6ee7b7" },
      { text: "  6+ Production Apps [ACTIVE]", color: "#fcd34d" },
      { text: "> Systems operational. Ready to ship_", color: "#e2e8f0" },
    ];

    // Spec lines
    const specLines = [
      { k: "HANDLE", v: "dhruv@nsut · github.com/dhruvbajaj13", c: "#38bdf8" },
      { k: "ROLE", v: "Full Stack & AI Engineer", c: "#c084fc" },
      { k: "LEETCODE", v: "Knight · 1933 · Top 3%", c: "#fbbf24" },
      { k: "DSA", v: "1,000+ Problems Solved", c: "#34d399" },
      { k: "STACK", v: "Next.js · MERN · PyTorch · RAG", c: "#7dd3fc" },
      { k: "HACKATHON", v: "SIH Grand Winner — CleanCity", c: "#fb7185" },
      { k: "STATUS", v: "Open to SDE Internship / FTE 🟢", c: "#4ade80" },
    ];

    // Typing state
    let termVisible = 0;
    let termCharVisible = 0;

    let frame = 0;

    const draw = () => {
      frameRef.current = requestAnimationFrame(draw);
      frame++;
      const mode = modeRef.current;
      ctx.clearRect(0, 0, W, H);

      // ── TERMINAL ──
      if (mode === "terminal") {
        ctx.fillStyle = "#070b12";
        ctx.fillRect(0, 0, W, H);

        // Scanlines
        ctx.fillStyle = "rgba(0,0,0,0.18)";
        for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1.5);

        // Title bar
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 11px 'Courier New', monospace";
        ctx.fillText("● ● ●  bash — dhruv@nsut", 14, 20);
        ctx.strokeStyle = "rgba(56,189,248,0.2)";
        ctx.beginPath(); ctx.moveTo(12, 28); ctx.lineTo(W - 12, 28); ctx.stroke();

        // Reveal lines over time
        if (frame % 14 === 0 && termVisible < termLines.length) termVisible++;
        ctx.font = "11px 'Courier New', monospace";

        for (let i = 0; i < termVisible; i++) {
          const line = termLines[i];
          const y = 50 + i * 35;
          ctx.fillStyle = line.color;
          if (i === termVisible - 1) {
            if (frame % 2 === 0 && termCharVisible < line.text.length) termCharVisible++;
            ctx.fillText(line.text.slice(0, termCharVisible) + (frame % 16 < 8 ? "█" : ""), 14, y);
          } else {
            ctx.fillText(line.text, 14, y);
          }
        }

        // Reset after full reveal
        if (termVisible >= termLines.length && termCharVisible >= termLines[termLines.length - 1].text.length) {
          if (frame % 240 === 0) { termVisible = 0; termCharVisible = 0; }
        }

      // ── MATRIX ──
      } else if (mode === "matrix") {
        ctx.fillStyle = "rgba(4,9,14,0.18)";
        ctx.fillRect(0, 0, W, H);
        ctx.font = "bold 13px 'Courier New', monospace";

        for (let i = 0; i < COLS; i++) {
          const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
          const x = 10 + i * 21;
          const y = drops[i] * 17;
          // Head char glows bright
          ctx.fillStyle = "#e0f9ff";
          ctx.fillText(ch, x, y);
          // Trail
          ctx.fillStyle = "#22c55e";
          ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, y - 17);
          ctx.fillStyle = "rgba(34,197,94,0.5)";
          ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, y - 34);
          if (y > H && Math.random() > 0.96) drops[i] = 0;
          else drops[i] += 0.5;
        }

        // Header overlay
        ctx.fillStyle = "rgba(2,8,20,0.82)";
        ctx.fillRect(8, 6, W - 16, 22);
        ctx.strokeStyle = "rgba(34,197,94,0.35)";
        ctx.strokeRect(8, 6, W - 16, 22);
        ctx.fillStyle = "#4ade80";
        ctx.font = "bold 9px 'Courier New', monospace";
        ctx.fillText("● MATRIX STREAM v2.0 // DHRUV.SYS ACTIVE", 16, 20);

      // ── SPECS (NEOFETCH) ──
      } else if (mode === "specs") {
        if (frame % 3 !== 0) return;
        ctx.fillStyle = "#080d16";
        ctx.fillRect(0, 0, W, H);

        // Scanlines
        ctx.fillStyle = "rgba(0,0,0,0.15)";
        for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1.5);

        // Title
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 10px 'Courier New', monospace";
        ctx.fillText("● ● ●  neofetch — dhruv@nsut:~", 14, 20);
        ctx.strokeStyle = "rgba(56,189,248,0.2)";
        ctx.beginPath(); ctx.moveTo(12, 27); ctx.lineTo(W - 12, 27); ctx.stroke();

        // ASCII art (left side)
        const art = [
          "   /\\_____/\\",
          "  ( ◕   ◕ )",
          "   > ^ < ",
          "  /|      |\\",
          " (_|      |_)",
        ];
        ctx.font = "10px 'Courier New', monospace";
        ctx.fillStyle = "#38bdf8";
        for (let a = 0; a < art.length; a++) ctx.fillText(art[a], 14, 46 + a * 18);

        // Spec list (right side)
        ctx.font = "9.5px 'Courier New', monospace";
        for (let s = 0; s < specLines.length; s++) {
          const sp = specLines[s];
          const y = 40 + s * 26;
          ctx.fillStyle = "#64748b";
          ctx.fillText(sp.k + ":", 140, y);
          ctx.fillStyle = sp.c;
          ctx.fillText(sp.v, 200, y);
        }

        // Color palette bar
        const palette = ["#ef4444","#f97316","#eab308","#22c55e","#06b6d4","#3b82f6","#a855f7"];
        for (let p = 0; p < palette.length; p++) {
          ctx.fillStyle = palette[p];
          ctx.fillRect(140 + p * 22, H - 28, 18, 10);
        }

        // Memory bar
        ctx.fillStyle = "#475569";
        ctx.font = "8px 'Courier New', monospace";
        ctx.fillText("MEM [████████████░░░] 78%   DISK [████░░░] 56%", 14, H - 14);

      // ── VISUALIZER (EQ) ──
      } else if (mode === "visualizer") {
        if (frame % 2 !== 0) return;
        ctx.fillStyle = "#060a14";
        ctx.fillRect(0, 0, W, H);

        // Header
        ctx.fillStyle = "#a855f7";
        ctx.font = "bold 10px 'Courier New', monospace";
        ctx.fillText("● SPECTRUM VISUALIZER // CORE TELEMETRY", 14, 20);
        ctx.strokeStyle = "rgba(168,85,247,0.2)";
        ctx.beginPath(); ctx.moveTo(12, 27); ctx.lineTo(W - 12, 27); ctx.stroke();

        // EQ Bars (18 bars)
        const NUM = 18;
        const bw = 18, gap = 6, startX = 16;
        for (let b = 0; b < NUM; b++) {
          const freq = (Math.sin(frame * 0.1 + b * 0.6) * 0.5 + 0.5);
          const bh = 24 + freq * 155 + Math.sin(frame * 0.05 * b) * 24;
          const y = 260 - bh;
          const grad = ctx.createLinearGradient(0, y, 0, 260);
          grad.addColorStop(0, "#38bdf8");
          grad.addColorStop(0.45, "#a855f7");
          grad.addColorStop(1, "#22c55e");
          ctx.fillStyle = grad;
          ctx.fillRect(startX + b * (bw + gap), y, bw, bh);
          // Cap
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(startX + b * (bw + gap), y - 3, bw, 2);
        }

        // Waveform line
        ctx.beginPath();
        ctx.strokeStyle = "rgba(251,191,36,0.7)";
        ctx.lineWidth = 2;
        for (let x = 0; x < W; x += 2) {
          const y = H - 40 + Math.sin((x + frame * 2) * 0.04) * 12 + Math.sin((x + frame) * 0.09) * 6;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.lineWidth = 1;

        // Stats
        ctx.fillStyle = "#38bdf8";
        ctx.font = "8.5px 'Courier New', monospace";
        const cpu = (24 + Math.sin(frame * 0.08) * 9).toFixed(1);
        const lat = (8 + Math.sin(frame * 0.06) * 4).toFixed(0);
        ctx.fillText(`CPU ${cpu}%   RAM 4.8/16 GB   LATENCY ${lat}ms   CORES 8   LOAD OK`, 14, H - 10);
      }
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const modes: WorkstationScreenMode[] = ["terminal", "matrix", "specs", "visualizer"];
  const modeLabels: Record<WorkstationScreenMode, { label: string; color: string; activeClass: string }> = {
    terminal: { label: "TERM", color: "#ffffff", activeClass: "bg-white text-black" },
    matrix: { label: "MATRIX", color: "#22c55e", activeClass: "bg-emerald-500 text-black" },
    specs: { label: "SPECS", color: "#38bdf8", activeClass: "bg-cyan-400 text-black" },
    visualizer: { label: "EQ", color: "#a855f7", activeClass: "bg-purple-500 text-white" },
  };

  return (
    <div
      ref={cardRef}
      style={{ transition: "transform 0.05s linear", willChange: "transform", transformStyle: "preserve-3d" }}
      className="relative w-full max-w-[480px] rounded-2xl border border-white/10 bg-[#0a0a0f] shadow-[0_24px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col"
    >
      {/* Window Chrome */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#111118] border-b border-white/8 shrink-0 select-none">
        {/* Traffic lights */}
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] shadow-[0_0_6px_#FF5F57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E] shadow-[0_0_6px_#FEBC2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840] shadow-[0_0_6px_#28C840]" />
        </div>

        {/* Mode tabs */}
        <div className="flex items-center gap-0.5 bg-black/60 p-0.5 rounded-md border border-white/8">
          {modes.map((m) => {
            const meta = modeLabels[m];
            return (
              <button
                key={m}
                onClick={() => onModeChange(m)}
                className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all duration-150 flex items-center gap-1 ${
                  currentMode === m ? meta.activeClass + " shadow-sm" : "text-white/40 hover:text-white/80"
                }`}
              >
                {m === "terminal" && <Terminal className="w-2 h-2" />}
                {m === "matrix" && <Code2 className="w-2 h-2" />}
                {m === "specs" && <Cpu className="w-2 h-2" />}
                {m === "visualizer" && <Activity className="w-2 h-2" />}
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live badge */}
        <div className="flex items-center gap-1 text-[8.5px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE
        </div>
      </div>

      {/* Canvas Screen */}
      <div className="relative bg-[#070b12] overflow-hidden" style={{ aspectRatio: "3/2" }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          onClick={() => {
            const next = modes[(modes.indexOf(currentMode) + 1) % modes.length];
            onModeChange(next);
          }}
          style={{ cursor: "pointer", imageRendering: "pixelated" }}
        />
        {/* CRT vignette overlay */}
        <div className="absolute inset-0 pointer-events-none rounded-b-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.55) 100%)" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(rgba(0,229,255,0.015) 0%, transparent 100%)" }} />
      </div>

      {/* Bottom hint bar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#0d0d15] border-t border-white/8 text-[8px] font-mono text-white/35 select-none">
        <span>Click screen to cycle modes • Move mouse to tilt</span>
        <span className="text-cyan-500/70 font-bold">{currentMode.toUpperCase()}</span>
      </div>

      {/* Duck mascot (clickable!) */}
      <button
        onClick={onDuckQuack}
        className="absolute bottom-10 right-3.5 text-xl select-none hover:scale-125 transition-transform duration-200 active:scale-90"
        title="Rubber Duck Debug!"
        aria-label="Click rubber duck"
        style={{ filter: "drop-shadow(0 0 6px rgba(250,204,21,0.6))" }}
      >
        🦆
      </button>
    </div>
  );
};

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
  const RESUME_URL = "https://drive.google.com/file/d/1F0QmpaQFUWuysUn1V8pO1E9kHdVS_BCZ/view";

  // Screen Mode State for 3D Workstation
  const [screenMode, setScreenMode] = useState<WorkstationScreenMode>("terminal");
  const [duckNotification, setDuckNotification] = useState<string | null>(null);

  const handleDuckQuack = () => {
    const quips = [
      "Quack! 0 bugs in production! 🦆",
      "Rubber Duck Debugging: Approved! 💻",
      "LeetCode Knight vibes only! ⚔️",
      "Quack! Clean code detected! ✨",
    ];
    const picked = quips[Math.floor(Math.random() * quips.length)];
    setDuckNotification(picked);
    setTimeout(() => setDuckNotification(null), 2500);
  };

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
      className="relative w-full min-h-screen flex flex-col justify-between px-4 sm:px-8 md:px-12 lg:px-16 pt-24 sm:pt-32 pb-10 overflow-hidden z-10 bg-[#050505]"
    >
      {/* ─── Restored 3D Geometric Spinning Wireframes & Floating Particle Constellation ─── */}
      <Hero3DGeometricBackground />

      {/* Subtle Volumetric Ambient Glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(255,107,44,0.05)_0%,transparent_70%)] blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.04)_0%,transparent_70%)] blur-[120px] pointer-events-none z-0" />

      {/* Main Hero Layout: 2 Columns (Text on Left, Compact 3D Workstation on Right) */}
      <div className="max-w-7xl mx-auto w-full my-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14 relative z-10">
        
        {/* Left Column: Text & Actions */}
        <div className="w-full lg:w-[54%] flex flex-col items-center text-center space-y-6">
          
          {/* Status Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0C0C0E] border border-white/10 text-xs font-semibold text-slate-300 shadow-md backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Open to SDE Internship / FTE</span>
          </motion.div>

          {/* Hero Name Title */}
          <div className="space-y-2 w-full">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white leading-tight text-center"
            >
              Dhruv <span className="text-[#FF6B2C]">Bajaj</span>
            </motion.h1>

            {/* Typewriter Dynamic Role Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="h-10 flex items-center justify-center"
            >
              <span className="font-display text-lg sm:text-2xl font-semibold text-white tracking-wide">
                {currentText}
                <span className="text-[#FF6B2C] animate-pulse ml-0.5">|</span>
              </span>
            </motion.div>
          </div>

          {/* Description Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="font-sans text-base sm:text-lg text-[#A8A8A8] max-w-xl leading-relaxed font-light text-center"
          >
            Software engineer building production-grade full-stack web platforms and autonomous AI systems. Dedicated to algorithms, scalable architecture, and clean code.
          </motion.p>

          {/* Hero Action CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="pt-1 flex flex-wrap items-center justify-center gap-3.5"
          >
            {/* Primary CTA: View My Work ↗ */}
            <a
              href="#projects"
              className="px-7 py-3 rounded-2xl bg-[#FF6B2C] font-sans text-sm font-bold text-black shadow-[0_0_25px_rgba(255,107,44,0.4)] hover:shadow-[0_0_40px_rgba(255,107,44,0.7)] hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <span>View My Work</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Secondary CTA: Download Résumé */}
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3 rounded-2xl border border-white/15 text-white font-sans text-sm font-bold hover:border-[#FF6B2C]/60 hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-lg bg-[#0C0C0E]"
            >
              <Download className="w-4 h-4 text-[#FF6B2C]" />
              <span>Download Résumé</span>
            </a>

            {/* Tertiary CTA: Contact */}
            <a
              href="#contact"
              className="px-6 py-3 rounded-2xl border border-white/10 text-white/70 hover:text-white font-sans text-sm font-medium hover:border-[#FF6B2C]/40 hover:bg-white/5 transition-all duration-300 flex items-center gap-2"
            >
              <span>Let&apos;s Talk</span>
            </a>
          </motion.div>

          {/* Social Icons Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="pt-1 flex items-center justify-center gap-3"
          >
            <a
              href="https://github.com/dhruvbajaj13"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl text-[#A8A8A8] hover:text-white border border-white/10 hover:border-[#FF6B2C] hover:scale-110 transition-all duration-300 shadow-md bg-[#0C0C0E]"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/dhruvbajaj13"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl text-[#A8A8A8] hover:text-white border border-white/10 hover:border-[#FF6B2C] hover:scale-110 transition-all duration-300 shadow-md bg-[#0C0C0E]"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:d4bajaj@gmail.com"
              className="p-3 rounded-xl text-[#A8A8A8] hover:text-white border border-white/10 hover:border-[#FF6B2C] hover:scale-110 transition-all duration-300 shadow-md bg-[#0C0C0E]"
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
            <div className="flex flex-row items-center justify-between px-6 py-3.5 rounded-2xl border border-[#FF6B2C]/20 bg-[#0C0C0E]/90 shadow-xl backdrop-blur-xl">
              <div className="text-center">
                <div className="font-display text-xl sm:text-2xl font-extrabold text-[#FF6B2C]">1,000+</div>
                <div className="font-mono text-[9.5px] text-[#A8A8A8] uppercase tracking-wider mt-0.5">LeetCode Solved</div>
              </div>

              <div className="w-px h-7 bg-white/10" />

              <div className="text-center">
                <div className="font-display text-xl sm:text-2xl font-extrabold text-white">6+</div>
                <div className="font-mono text-[9.5px] text-[#A8A8A8] uppercase tracking-wider mt-0.5">Featured Apps</div>
              </div>

              <div className="w-px h-7 bg-white/10" />

              <div className="text-center">
                <div className="font-display text-xl sm:text-2xl font-extrabold text-[#FF6B2C]">Top 3%</div>
                <div className="font-mono text-[9.5px] text-[#A8A8A8] uppercase tracking-wider mt-0.5">LeetCode Knight</div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Dedicated Compact 3D Workstation (Feature-Packed & Zero Overlap!) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="w-full lg:w-[46%] flex flex-col items-center justify-center relative"
        >
          {/* Duck Quack Notification Toast */}
          {duckNotification && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute -top-11 z-30 px-3.5 py-1.5 rounded-full bg-amber-400 text-black font-mono text-xs font-bold shadow-[0_0_20px_rgba(251,191,36,0.6)] flex items-center gap-1.5"
            >
              <span>{duckNotification}</span>
            </motion.div>
          )}

          <WorkstationCard
            currentMode={screenMode}
            onModeChange={setScreenMode}
            onDuckQuack={handleDuckQuack}
          />
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
          className="p-2.5 rounded-full border border-white/10 text-[#A8A8A8] hover:text-[#FFFFFF] hover:border-[#FF6B2C]/60 transition-colors bg-[#080808]"
          aria-label="Scroll to About"
        >
          <ArrowDown className="w-4 h-4 animate-bounce text-[#FF6B2C]" />
        </button>
      </motion.div>
    </section>
  );
}
