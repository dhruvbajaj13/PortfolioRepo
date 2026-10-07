'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// ─── Subtle 3D Floating Geometry Background for Preloader ───
function Preloader3DBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'low-power',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // 1. Small Cyan Octahedron (top-left)
    const geo1 = new THREE.OctahedronGeometry(0.7, 0);
    const mat1 = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const mesh1 = new THREE.Mesh(geo1, mat1);
    mesh1.position.set(-3.2, 1.8, -1);
    scene.add(mesh1);

    // 2. Small Violet Icosahedron (bottom-right)
    const geo2 = new THREE.IcosahedronGeometry(0.85, 0);
    const mat2 = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const mesh2 = new THREE.Mesh(geo2, mat2);
    mesh2.position.set(3.4, -1.6, -1);
    scene.add(mesh2);

    // 3. Small Emerald Torus (bottom-left)
    const geo3 = new THREE.TorusGeometry(0.65, 0.18, 8, 16);
    const mat3 = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const mesh3 = new THREE.Mesh(geo3, mat3);
    mesh3.position.set(-2.8, -1.8, -1.5);
    scene.add(mesh3);

    // 4. Small Amber Cube (top-right)
    const geo4 = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    const mat4 = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const mesh4 = new THREE.Mesh(geo4, mat4);
    mesh4.position.set(2.8, 2.0, -1.5);
    scene.add(mesh4);

    // 80 Tiny Ambient Floating Stars / Particles
    const pCount = 80;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pCols = new Float32Array(pCount * 3);
    const colors = [
      new THREE.Color(0x00f0ff),
      new THREE.Color(0xa855f7),
      new THREE.Color(0x10b981),
      new THREE.Color(0xffffff),
    ];

    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 14;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      const c = colors[i % colors.length];
      pCols[i * 3] = c.r;
      pCols[i * 3 + 1] = c.g;
      pCols[i * 3 + 2] = c.b;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCols, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    let animId: number;
    let clock = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      clock += 0.018;

      mesh1.rotation.x += 0.008;
      mesh1.rotation.y += 0.012;
      mesh1.position.y += Math.sin(clock) * 0.002;

      mesh2.rotation.x -= 0.01;
      mesh2.rotation.y -= 0.007;
      mesh2.position.y += Math.cos(clock * 1.2) * 0.002;

      mesh3.rotation.x += 0.012;
      mesh3.rotation.y -= 0.01;

      mesh4.rotation.x += 0.007;
      mesh4.rotation.y += 0.009;

      particles.rotation.y += 0.0008;

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
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) container.removeChild(renderer.domElement);
      geo1.dispose();
      mat1.dispose();
      geo2.dispose();
      mat2.dispose();
      geo3.dispose();
      mat3.dispose();
      geo4.dispose();
      mat4.dispose();
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none opacity-80" />;
}

// ─── Cute Running Cartoon Character SVG ───
function CartoonRunner({ isComplete }: { isComplete: boolean }) {
  return (
    <div className={`relative flex items-center justify-center ${isComplete ? 'animate-bounce' : 'runner-bob'}`}>
      {/* Trailing speed dust puffs */}
      {!isComplete && (
        <div className="absolute -left-3 bottom-0.5 flex gap-0.5 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/70 dust-puff" style={{ animationDelay: '0s' }} />
          <span className="w-1 h-1 rounded-full bg-white/60 dust-puff" style={{ animationDelay: '0.15s' }} />
        </div>
      )}

      {/* Cute Cyber Astronaut / Mini Coder Runner */}
      <svg width="28" height="32" viewBox="0 0 28 32" fill="none" className="drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]">
        {/* Jetpack / Backpack on back */}
        <rect x="3" y="10" width="4" height="10" rx="1.5" fill="#a855f7" />
        <rect x="4" y="12" width="2" height="6" rx="1" fill="#c084fc" />

        {/* Jet flame trail */}
        {!isComplete && (
          <path d="M1 15 L4 13 L4 17 Z" fill="#00f0ff" className="animate-pulse" />
        )}

        {/* Body Torso */}
        <rect x="7" y="10" width="11" height="11" rx="3" fill="#ffffff" />
        <rect x="9.5" y="12" width="6" height="5" rx="1.5" fill="#0f172a" />
        {/* Glowing chest core */}
        <circle cx="12.5" cy="14.5" r="1.5" fill="#00f0ff" />

        {/* Head Helmet */}
        <rect x="7.5" y="2" width="10" height="9" rx="4.5" fill="#ffffff" />
        {/* Helmet Visor */}
        <rect x="10.5" y="3.5" width="7" height="5.5" rx="2.5" fill="#00f0ff" />
        {/* Visor shine */}
        <ellipse cx="14.5" cy="5" rx="2" ry="1" fill="#ffffff" opacity="0.8" />

        {/* Antenna with blinking light */}
        <line x1="12.5" y1="2" x2="12.5" y2="0.5" stroke="#ffffff" strokeWidth="1" />
        <circle cx="12.5" cy="0.5" r="1" fill={isComplete ? '#10b981' : '#f59e0b'} className="animate-ping" />

        {/* Front Arm (Swinging) */}
        <g className={isComplete ? 'origin-[15px_11px] -rotate-45' : 'arm-front origin-[15px_11px]'}>
          <rect x="14" y="11" width="3.5" height="7" rx="1.5" fill="#ffffff" />
          <circle cx="15.8" cy="18" r="1.5" fill="#00f0ff" />
        </g>

        {/* Back Arm (Swinging) */}
        <g className={isComplete ? 'origin-[8px_11px] rotate-45' : 'arm-back origin-[8px_11px]'}>
          <rect x="7" y="11" width="3" height="6.5" rx="1.5" fill="#94a3b8" />
          <circle cx="8.5" cy="17.5" r="1.2" fill="#a855f7" />
        </g>

        {/* Front Leg (Running cycle) */}
        <g className={isComplete ? 'origin-[14px_20px] translate-y-0.5' : 'leg-front origin-[14px_20px]'}>
          <rect x="12.5" y="20" width="3.5" height="7.5" rx="1.5" fill="#ffffff" />
          {/* Shoe */}
          <rect x="12.5" y="26" width="5.5" height="3" rx="1" fill="#00f0ff" />
        </g>

        {/* Back Leg (Running cycle) */}
        <g className={isComplete ? 'origin-[10px_20px]' : 'leg-back origin-[10px_20px]'}>
          <rect x="8.5" y="20" width="3" height="7" rx="1.5" fill="#94a3b8" />
          {/* Shoe */}
          <rect x="7.5" y="25.5" width="5" height="3" rx="1" fill="#a855f7" />
        </g>
      </svg>
    </div>
  );
}

export function CinematicPreloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Snappy, low-latency progression (~700ms total)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 220);
          return 100;
        }
        // Rapid, energetic increments
        const increment = Math.floor(Math.random() * 5) + 3;
        return Math.min(prev + increment, 100);
      });
    }, 20);

    return () => clearInterval(interval);
  }, [onComplete]);

  const getStatusText = (p: number) => {
    if (p < 30) return 'INITIALIZING SYSTEM';
    if (p < 65) return 'DHRUV BAJAJ // DEVELOPER';
    if (p < 90) return 'LOADING CORE MODULES';
    return 'READY // LAUNCHING';
  };

  const isComplete = progress >= 100;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-12 bg-black text-white select-none overflow-hidden"
    >
      {/* 3D Floating Geometry & Star Particles in Background */}
      <Preloader3DBackground />

      {/* CSS Running Cycle Animations */}
      <style jsx global>{`
        .runner-bob {
          animation: runnerBob 0.35s ease-in-out infinite alternate;
        }
        @keyframes runnerBob {
          0% { transform: translateY(0px) rotate(4deg); }
          100% { transform: translateY(-4px) rotate(7deg); }
        }
        .leg-front {
          animation: legSwingFront 0.35s ease-in-out infinite alternate;
        }
        @keyframes legSwingFront {
          0% { transform: rotate(-35deg); }
          100% { transform: rotate(35deg); }
        }
        .leg-back {
          animation: legSwingBack 0.35s ease-in-out infinite alternate;
        }
        @keyframes legSwingBack {
          0% { transform: rotate(35deg); }
          100% { transform: rotate(-35deg); }
        }
        .arm-front {
          animation: armSwingFront 0.35s ease-in-out infinite alternate;
        }
        @keyframes armSwingFront {
          0% { transform: rotate(30deg); }
          100% { transform: rotate(-30deg); }
        }
        .arm-back {
          animation: armSwingBack 0.35s ease-in-out infinite alternate;
        }
        @keyframes armSwingBack {
          0% { transform: rotate(-30deg); }
          100% { transform: rotate(30deg); }
        }
        .dust-puff {
          animation: dustPuff 0.4s ease-out infinite;
        }
        @keyframes dustPuff {
          0% { opacity: 0.8; transform: scale(1) translateX(0); }
          100% { opacity: 0; transform: scale(0.2) translateX(-14px); }
        }
      `}</style>

      {/* Ambient Vignette & Center Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05)_0%,transparent_65%)] pointer-events-none z-[1]" />

      {/* Top Bar Indicators */}
      <div className="w-full flex items-center justify-between font-mono text-[10px] text-white/50 tracking-widest uppercase z-10">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]" />
          DHRUV BAJAJ
        </span>
        <span className="text-white/40">QUANTUM OS // 2025</span>
      </div>

      {/* Center 0-100 Counter with Cute Cartoon Runner along Track */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto space-y-4 px-4 text-center">
        {/* Large Cinematic Number */}
        <div className="flex items-baseline justify-center">
          <motion.span
            key={progress}
            className="font-display font-black text-6xl sm:text-8xl md:text-9xl text-white tracking-tighter tabular-nums drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            {progress < 10 ? `0${progress}` : progress}
          </motion.span>
          <span className="font-mono text-2xl sm:text-4xl text-cyan-400/70 font-light ml-1 sm:ml-2">
            %
          </span>
        </div>

        {/* Progress Track with Cute Cartoon Runner Moving Along It */}
        <div className="w-60 sm:w-80 pt-6 pb-2 relative">
          {/* Animated Cartoon Runner running along progress bar */}
          <div
            className="absolute top-0 -translate-x-1/2 transition-all duration-75 ease-out z-20 pointer-events-none"
            style={{ left: `${Math.min(Math.max(progress, 4), 96)}%` }}
          >
            <CartoonRunner isComplete={isComplete} />
          </div>

          {/* Minimalist Glowing Progress Line */}
          <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden relative shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-white shadow-[0_0_14px_rgba(0,240,255,0.9)] rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Subtitle / Status Text */}
        <motion.p
          key={getStatusText(progress)}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="font-mono text-[10.5px] sm:text-xs text-white/60 tracking-[0.25em] uppercase text-center"
        >
          {getStatusText(progress)}
        </motion.p>
      </div>

      {/* Bottom Bar Indicators */}
      <div className="w-full flex items-center justify-between font-mono text-[10px] text-white/40 tracking-widest uppercase z-10">
        <span>NSUT // DELHI</span>
        <span className="text-cyan-400/80 font-mono">
          STATUS: {progress === 100 ? 'ONLINE ✓' : 'WARMING UP...'}
        </span>
      </div>
    </motion.div>
  );
}

