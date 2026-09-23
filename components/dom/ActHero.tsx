'use client';

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, ArrowDown, ExternalLink, Download, Terminal, Code2, Cpu, Activity } from "lucide-react";
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
    renderer.setPixelRatio(1);
    container.appendChild(renderer.domElement);

    // Left spinning wireframe icosahedron
    const icoGeo1 = new THREE.IcosahedronGeometry(1.6, 1);
    const icoMat1 = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const icoMesh1 = new THREE.Mesh(icoGeo1, icoMat1);
    icoMesh1.position.set(-3.5, 0.5, -2);
    scene.add(icoMesh1);

    // Right spinning wireframe icosahedron
    const icoGeo2 = new THREE.IcosahedronGeometry(2.2, 1);
    const icoMat2 = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const icoMesh2 = new THREE.Mesh(icoGeo2, icoMat2);
    icoMesh2.position.set(3.8, -0.2, -3);
    scene.add(icoMesh2);

    // 250 Floating Ambient Particles
    const count = 250;
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const cyan = new THREE.Color(0x00e5ff);
    const white = new THREE.Color(0xffffff);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      const c = Math.random() > 0.4 ? cyan : white;
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(cols, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
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

    let animId: number;
    let frame = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame++;
      icoMesh1.rotation.y += 0.0025;
      icoMesh1.rotation.x += 0.0015;
      icoMesh2.rotation.y -= 0.002;
      icoMesh2.rotation.x -= 0.001;
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
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) container.removeChild(renderer.domElement);
      icoGeo1.dispose();
      icoMat1.dispose();
      icoGeo2.dispose();
      icoMat2.dispose();
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none opacity-70" />;
};

// ─── 2. Ultra-Smooth 60FPS 3D Retro Developer Workstation with Rubber Duck ───
export type WorkstationScreenMode = "terminal" | "matrix" | "specs" | "visualizer";

interface RetroWorkstation3DProps {
  currentMode: WorkstationScreenMode;
  onModeChange: (mode: WorkstationScreenMode) => void;
  onDuckQuack?: () => void;
}

const HeroRetroWorkstation3D: React.FC<RetroWorkstation3DProps> = ({
  currentMode,
  onModeChange,
  onDuckQuack,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<WorkstationScreenMode>(currentMode);
  modeRef.current = currentMode;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 460;
    const height = container.clientHeight || 345;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
    camera.position.set(0, 1.35, 4.5);
    camera.lookAt(0, 0.45, 0);

    // High performance WebGL setup (pixelRatio fixed to 1 to guarantee 60fps on all devices)
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
      precision: "mediump",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    container.appendChild(renderer.domElement);

    const deskGroup = new THREE.Group();
    deskGroup.position.set(0, -0.42, 0);
    scene.add(deskGroup);

    // 2. High-Performance Screen Canvas
    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 384;
    screenCanvas.height = 288;
    const ctx = screenCanvas.getContext("2d");
    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.minFilter = THREE.LinearFilter;
    screenTexture.magFilter = THREE.LinearFilter;

    // Performant Lambert Materials
    const chassisMat = new THREE.MeshLambertMaterial({ color: 0x1f1f23 });
    const bezelMat = new THREE.MeshLambertMaterial({ color: 0x2b2b30 });
    const darkMat = new THREE.MeshLambertMaterial({ color: 0x121215 });

    // Monitor Stand Base
    const baseGeo = new THREE.CylinderGeometry(0.48, 0.58, 0.08, 20);
    const baseMesh = new THREE.Mesh(baseGeo, chassisMat);
    baseMesh.position.set(0, 0.04, 0);
    deskGroup.add(baseMesh);

    // Monitor Stand Stem
    const stemGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.48, 14);
    const stemMesh = new THREE.Mesh(stemGeo, chassisMat);
    stemMesh.position.set(0, 0.28, 0);
    deskGroup.add(stemMesh);

    // Monitor Chassis Body
    const monitorBodyGeo = new THREE.BoxGeometry(2.16, 1.52, 0.48);
    const monitorBody = new THREE.Mesh(monitorBodyGeo, bezelMat);
    monitorBody.position.set(0, 1.25, 0);
    deskGroup.add(monitorBody);

    // CRT Screen Face
    const screenGeo = new THREE.PlaneGeometry(1.88, 1.22);
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 1.25, 0.245);
    screenMesh.name = "screen";
    deskGroup.add(screenMesh);

    // Power LED
    const ledGeo = new THREE.SphereGeometry(0.024, 12, 12);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(0.86, 0.58, 0.25);
    deskGroup.add(ledMesh);

    // Sticky Note on Monitor Corner
    const noteGeo = new THREE.PlaneGeometry(0.28, 0.28);
    const noteCanvas = document.createElement("canvas");
    noteCanvas.width = 128;
    noteCanvas.height = 128;
    const nctx = noteCanvas.getContext("2d");
    if (nctx) {
      nctx.fillStyle = "#fef08a";
      nctx.fillRect(0, 0, 128, 128);
      nctx.fillStyle = "#713f12";
      nctx.font = "bold 16px monospace";
      nctx.textAlign = "center";
      nctx.fillText("BUILD", 64, 45);
      nctx.fillText("IMPACT", 64, 75);
      nctx.fillText("// 2025", 64, 105);
    }
    const noteTexture = new THREE.CanvasTexture(noteCanvas);
    const noteMat = new THREE.MeshBasicMaterial({ map: noteTexture });
    const noteMesh = new THREE.Mesh(noteGeo, noteMat);
    noteMesh.position.set(0.82, 1.82, 0.25);
    noteMesh.rotation.z = -0.08;
    deskGroup.add(noteMesh);

    // Mechanical Keyboard Base
    const kbBaseGeo = new THREE.BoxGeometry(1.72, 0.08, 0.65);
    const kbBase = new THREE.Mesh(kbBaseGeo, chassisMat);
    kbBase.position.set(0, 0.05, 1.15);
    kbBase.rotation.x = 0.08;
    deskGroup.add(kbBase);

    // Keyboard Keycaps (Merged into clean row blocks for zero draw-call overhead!)
    const keyMatDark = new THREE.MeshLambertMaterial({ color: 0x333338 });
    const keyMatCyan = new THREE.MeshLambertMaterial({ color: 0x00e5ff });
    const keyMatWhite = new THREE.MeshLambertMaterial({ color: 0xffffff });

    for (let r = 0; r < 4; r++) {
      const rowZ = 0.92 + r * 0.135;
      const rowY = 0.08 + (3 - r) * 0.015;
      for (let c = 0; c < 12; c++) {
        const isEsc = r === 3 && c === 0;
        const isEnter = r === 1 && c === 11;
        const isSpace = r === 0 && c >= 4 && c <= 7;
        if (isSpace && c !== 4) continue;
        const m = isEsc ? keyMatCyan : isEnter ? keyMatWhite : keyMatDark;
        const kw = isSpace ? 0.46 : 0.095;
        const kGeo = new THREE.BoxGeometry(kw, 0.038, 0.082);
        const kMesh = new THREE.Mesh(kGeo, m);
        const xPos = isSpace ? 0 : (c - 5.5) * 0.125;
        kMesh.position.set(xPos, rowY, rowZ);
        kMesh.rotation.x = 0.08;
        deskGroup.add(kMesh);
      }
    }

    // Coiled Wire from keyboard to base
    const cableCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.06, 0.8),
      new THREE.Vector3(0.08, 0.06, 0.55),
      new THREE.Vector3(-0.06, 0.05, 0.35),
      new THREE.Vector3(0, 0.04, 0.15),
    ]);
    const cableGeo = new THREE.TubeGeometry(cableCurve, 16, 0.012, 6, false);
    const cableMesh = new THREE.Mesh(cableGeo, darkMat);
    deskGroup.add(cableMesh);

    // Mouse & Pad
    const padGeo = new THREE.BoxGeometry(0.62, 0.01, 0.72);
    const pad = new THREE.Mesh(padGeo, darkMat);
    pad.position.set(1.28, 0.005, 1.15);
    deskGroup.add(pad);

    const mouseGeo = new THREE.BoxGeometry(0.18, 0.07, 0.3);
    const mouse = new THREE.Mesh(mouseGeo, chassisMat);
    mouse.position.set(1.28, 0.045, 1.15);
    deskGroup.add(mouse);

    // ── Yellow Rubber Duck Mascot (Clickable!) ──
    const duckGroup = new THREE.Group();
    duckGroup.name = "duck";
    const duckMat = new THREE.MeshLambertMaterial({ color: 0xfacc15 });
    const duckBody = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 12), duckMat);
    duckBody.scale.set(1, 0.8, 1.15);
    duckGroup.add(duckBody);

    const duckHead = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 12), duckMat);
    duckHead.position.set(0, 0.13, 0.07);
    duckGroup.add(duckHead);

    const beak = new THREE.Mesh(
      new THREE.ConeGeometry(0.04, 0.08, 12),
      new THREE.MeshLambertMaterial({ color: 0xf97316 })
    );
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, 0.12, 0.17);
    duckGroup.add(beak);

    // Duck Sunglasses
    const glasses = new THREE.Mesh(
      new THREE.BoxGeometry(0.13, 0.032, 0.04),
      new THREE.MeshBasicMaterial({ color: 0x09090b })
    );
    glasses.position.set(0, 0.145, 0.15);
    duckGroup.add(glasses);

    duckGroup.position.set(-1.22, 0.13, 0.7);
    duckGroup.rotation.y = 0.45;
    deskGroup.add(duckGroup);

    // Coffee Mug with Steam
    const mugGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.28, 16);
    const mug = new THREE.Mesh(mugGeo, new THREE.MeshLambertMaterial({ color: 0xe4e4e7 }));
    mug.position.set(-1.26, 0.14, 1.22);
    deskGroup.add(mug);

    const coffee = new THREE.Mesh(
      new THREE.CircleGeometry(0.1, 14),
      new THREE.MeshBasicMaterial({ color: 0x3f2212 })
    );
    coffee.rotation.x = -Math.PI / 2;
    coffee.position.set(-1.26, 0.27, 1.22);
    deskGroup.add(coffee);

    // Steam particles
    const steamCount = 10;
    const steamGeo = new THREE.BufferGeometry();
    const steamPos = new Float32Array(steamCount * 3);
    for (let i = 0; i < steamCount; i++) {
      steamPos[i * 3] = -1.26 + (Math.random() - 0.5) * 0.06;
      steamPos[i * 3 + 1] = 0.3 + Math.random() * 0.35;
      steamPos[i * 3 + 2] = 1.22 + (Math.random() - 0.5) * 0.06;
    }
    steamGeo.setAttribute("position", new THREE.BufferAttribute(steamPos, 3));
    const steamMat = new THREE.PointsMaterial({
      size: 0.03,
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
    });
    const steam = new THREE.Points(steamGeo, steamMat);
    deskGroup.add(steam);

    // Lighting (Simple & Fast)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(3, 4, 3);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x00e5ff, 1.6, 4.0);
    pointLight.position.set(0, 1.2, 0.8);
    deskGroup.add(pointLight);

    // Data for Screen Modes
    const termLines = [
      "> DHRUV_BAJAJ.sh --mode=production",
      "> LeetCode Knight · Rating 1933 [TOP 3%]",
      "> Full-Stack: Next.js & MERN [ONLINE]",
      "> Agentic RAG & LangChain AI [READY]",
      "> SIH Winner · CleanCity IoT [DEPLOYED]",
      "> Systems Operational. Ready to build_",
    ];

    const matrixCols = 22;
    const matrixDrops = Array.from({ length: matrixCols }, () => Math.floor(Math.random() * -25));
    const matrixChars = "0101XYZΩλπΔ<>{}[]=/*#ABCDEF";

    // Mouse Tracking / Tilt
    let targetRotY = 0;
    let targetRotX = 0;

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const rect = container.getBoundingClientRect();
      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = Math.max(-0.25, Math.min(0.25, normX * 0.22));
      targetRotX = Math.max(-0.16, Math.min(0.16, -normY * 0.14));
    };

    window.addEventListener("mousemove", onPointerMove, { passive: true });
    container.addEventListener("touchmove", onPointerMove, { passive: true });

    // Click Detection (Raycaster)
    let duckHop = 0;
    let duckHopSpeed = 0;
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    const onPointerDown = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseCoord.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseCoord.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      raycaster.setFromCamera(mouseCoord, camera);

      const intersects = raycaster.intersectObjects(deskGroup.children, true);
      if (intersects.length > 0) {
        let hit: THREE.Object3D | null = intersects[0].object;
        while (hit && hit !== deskGroup) {
          if (hit.name === "duck") {
            duckHopSpeed = 0.08;
            if (onDuckQuack) onDuckQuack();
            return;
          }
          if (hit.name === "screen") {
            const modes: WorkstationScreenMode[] = ["terminal", "matrix", "specs", "visualizer"];
            const nextIdx = (modes.indexOf(modeRef.current) + 1) % modes.length;
            onModeChange(modes[nextIdx]);
            return;
          }
          hit = hit.parent;
        }
      }
    };
    container.addEventListener("pointerdown", onPointerDown);

    // Animation Loop with Throttled Canvas Updates (Zero Lag Guarantee)
    let frame = 0;
    let lastCanvasUpdate = 0;
    let animId: number;

    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);
      frame++;

      // Smooth Lerp Tilt (with subtle auto-sway on mobile)
      const autoSway = Math.sin(frame * 0.02) * 0.04;
      deskGroup.rotation.y += (targetRotY + autoSway - deskGroup.rotation.y) * 0.06;
      deskGroup.rotation.x += (targetRotX - deskGroup.rotation.x) * 0.06;

      // Duck bounce physics
      if (duckHopSpeed !== 0 || duckHop > 0) {
        duckHop += duckHopSpeed;
        duckHopSpeed -= 0.007;
        if (duckHop <= 0) {
          duckHop = 0;
          duckHopSpeed = 0;
        }
        duckGroup.position.y = 0.13 + duckHop;
        duckGroup.rotation.y = 0.45 + duckHop * 4.0;
      }

      // Steam float
      const sp = steamGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < steamCount * 3; i += 3) {
        sp[i] += 0.0025;
        if (sp[i] > 0.65) sp[i] = 0.3;
      }
      steamGeo.attributes.position.needsUpdate = true;

      // Throttle 2D Canvas redraw to 15-20 FPS for maximum performance
      if (time - lastCanvasUpdate > 60 && ctx) {
        lastCanvasUpdate = time;
        const mode = modeRef.current;
        const W = 384;
        const H = 288;

        if (mode === "matrix") {
          ctx.fillStyle = "rgba(4, 9, 14, 0.25)";
          ctx.fillRect(0, 0, W, H);
          ctx.font = "bold 13px monospace";

          for (let i = 0; i < matrixCols; i++) {
            const ch = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            const x = 14 + i * 16.5;
            const y = matrixDrops[i] * 16;
            ctx.fillStyle = "#ffffff";
            ctx.fillText(ch, x, y);
            ctx.fillStyle = "#22c55e";
            ctx.fillText(matrixChars[Math.floor(Math.random() * matrixChars.length)], x, y - 16);

            if (y > H && Math.random() > 0.95) matrixDrops[i] = 0;
            else matrixDrops[i]++;
          }

          ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
          ctx.fillRect(8, 8, W - 16, 22);
          ctx.fillStyle = "#4ade80";
          ctx.font = "bold 10px monospace";
          ctx.fillText("● MATRIX STREAM // DHRUV.SYS ACTIVE", 14, 23);

        } else if (mode === "specs") {
          ctx.fillStyle = "#0a0e17";
          ctx.fillRect(0, 0, W, H);

          // Top line
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 12px monospace";
          ctx.fillText("● ● ●  neofetch — dhruv@nsut", 16, 24);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
          ctx.beginPath(); ctx.moveTo(12, 32); ctx.lineTo(W - 12, 32); ctx.stroke();

          // ASCII Cat
          ctx.fillStyle = "#ffffff";
          ctx.font = "11px monospace";
          const cat = [" /\_/\ ", "( o.o )", " > ^ < ", " |   | "];
          for (let a = 0; a < cat.length; a++) {
            ctx.fillText(cat[a], 16, 68 + a * 20);
          }

          // Specs list
          const specs = [
            { k: "OS", v: "DhruvOS v2.5 (x86_64)", c: "#e2e8f0" },
            { k: "ROLE", v: "Full Stack & AI Engineer", c: "#ffffff" },
            { k: "LEETCODE", v: "Knight 1933 · Top 3%", c: "#facc15" },
            { k: "DSA", v: "1,000+ Problems Solved", c: "#22c55e" },
            { k: "STACK", v: "Next.js / MERN / AI RAG", c: "#38bdf8" },
            { k: "STATUS", v: "Open to SDE Roles / FTE", c: "#4ade80" },
          ];
          ctx.font = "10.5px monospace";
          for (let s = 0; s < specs.length; s++) {
            ctx.fillStyle = "#94a3b8";
            ctx.fillText(`${specs[s].k}:`, 110, 60 + s * 22);
            ctx.fillStyle = specs[s].c;
            ctx.fillText(specs[s].v, 180, 60 + s * 22);
          }

          // Palette
          const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#a855f7"];
          for (let p = 0; p < colors.length; p++) {
            ctx.fillStyle = colors[p];
            ctx.fillRect(110 + p * 24, 215, 18, 10);
          }

        } else if (mode === "visualizer") {
          ctx.fillStyle = "#080c14";
          ctx.fillRect(0, 0, W, H);

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 11px monospace";
          ctx.fillText("● SPECTRUM AUDIO & CORE TELEMETRY", 16, 24);

          const bars = 20;
          const bw = 12;
          const gap = 5;
          const startX = 18;

          for (let b = 0; b < bars; b++) {
            const freq = Math.sin(frame * 0.1 + b * 0.5) * 0.5 + 0.5;
            const bh = 25 + freq * 130 + Math.sin(frame * 0.05 * b) * 20;
            const y = 220 - bh;

            const grad = ctx.createLinearGradient(0, y, 0, 220);
            grad.addColorStop(0, "#ffffff");
            grad.addColorStop(0.5, "#38bdf8");
            grad.addColorStop(1, "#22c55e");
            ctx.fillStyle = grad;
            ctx.fillRect(startX + b * (bw + gap), y, bw, bh);
          }

          ctx.fillStyle = "#94a3b8";
          ctx.font = "10px monospace";
          ctx.fillText(`CPU: ${(24 + Math.sin(frame * 0.08) * 8).toFixed(1)}%   RAM: 4.8 GB   LATENCY: 12ms`, 16, 255);

        } else {
          // Terminal mode (default)
          ctx.fillStyle = "#080b12";
          ctx.fillRect(0, 0, W, H);

          // Scanlines
          ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
          for (let y = 0; y < H; y += 4) {
            ctx.fillRect(0, y, W, 2);
          }

          // Title
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 12px monospace";
          ctx.fillText("● ● ●  bash - 80x24", 16, 24);

          ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
          ctx.beginPath(); ctx.moveTo(12, 32); ctx.lineTo(W - 12, 32); ctx.stroke();

          // Lines
          ctx.font = "11px monospace";
          const visible = Math.min(Math.floor(frame / 28) + 1, termLines.length);
          for (let l = 0; l < visible; l++) {
            const isPrompt = l === 0;
            const isHigh = l === 1 || l === 4;
            ctx.fillStyle = isPrompt ? "#4ade80" : isHigh ? "#ffffff" : "#cbd5e1";
            const line = termLines[l];
            if (l === visible - 1 && visible < termLines.length) {
              const chars = Math.floor(((frame % 28) / 28) * line.length);
              ctx.fillText(line.slice(0, chars) + "█", 16, 56 + l * 26);
            } else {
              ctx.fillText(line, 16, 56 + l * 26);
            }
          }

          ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
          ctx.font = "9.5px monospace";
          ctx.fillText("Tip: Click screen to cycle modes • Click duck", 16, 268);
        }

        screenTexture.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

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
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onPointerMove);
      container.removeEventListener("touchmove", onPointerMove);
      container.removeEventListener("pointerdown", onPointerDown);
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [onDuckQuack, onModeChange]);

  return <div ref={mountRef} className="w-full h-full cursor-pointer touch-none" />;
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
          
          {/* Status Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#0C0C0E] border border-white/10 text-xs font-semibold text-slate-300 shadow-md backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Open to SDE Opportunities / Internship</span>
          </motion.div>

          {/* Hero Name Title */}
          <div className="space-y-2 w-full">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-tight"
            >
              Dhruv <span className="text-[#FFFFFF]">Bajaj</span>
            </motion.h1>

            {/* Typewriter Dynamic Role Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="h-9 sm:h-10 flex items-center justify-center lg:justify-start"
            >
              <span className="font-display text-base sm:text-xl md:text-2xl font-semibold text-white tracking-wide">
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

          {/* Social Icons Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="pt-1 flex items-center justify-center lg:justify-start gap-3"
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
                <div className="font-display text-lg sm:text-2xl font-extrabold text-[#FFFFFF]">1,000+</div>
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

        {/* Right Column: 3D Retro Developer Workstation Card (Zero Overlap & 60FPS) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="w-full lg:w-[48%] flex flex-col items-center justify-center relative"
        >
          {/* Duck Quack Notification Toast */}
          <AnimatePresence>
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
          </AnimatePresence>

          <div className="relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[480px] aspect-[4/3] rounded-3xl border border-white/15 bg-[#0C0C0E]/95 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden backdrop-blur-2xl flex flex-col group/terminal">
            
            {/* Window Header Chrome with Interactive Mode Switcher */}
            <div className="flex items-center justify-between px-3 sm:px-3.5 py-2 bg-[#141418] border-b border-white/10 shrink-0 select-none">
              {/* Mac Traffic Lights */}
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] shadow-[0_0_5px_rgba(255,95,87,0.5)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E] shadow-[0_0_5px_rgba(254,188,46,0.4)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28C840] shadow-[0_0_5px_rgba(40,200,64,0.4)]" />
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex items-center gap-0.5 sm:gap-1 bg-black/50 p-0.5 rounded-lg border border-white/10">
                <button
                  onClick={() => setScreenMode("terminal")}
                  className={`px-1.5 sm:px-2 py-0.5 rounded text-[8.5px] sm:text-[9.5px] font-mono font-medium transition-all flex items-center gap-1 ${
                    screenMode === "terminal"
                      ? "bg-white text-black font-bold shadow-sm"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  <Terminal className="w-2.5 h-2.5" />
                  <span>TERM</span>
                </button>

                <button
                  onClick={() => setScreenMode("matrix")}
                  className={`px-1.5 sm:px-2 py-0.5 rounded text-[8.5px] sm:text-[9.5px] font-mono font-medium transition-all flex items-center gap-1 ${
                    screenMode === "matrix"
                      ? "bg-emerald-500 text-black font-bold shadow-sm"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  <Code2 className="w-2.5 h-2.5" />
                  <span>MATRIX</span>
                </button>

                <button
                  onClick={() => setScreenMode("specs")}
                  className={`px-1.5 sm:px-2 py-0.5 rounded text-[8.5px] sm:text-[9.5px] font-mono font-medium transition-all flex items-center gap-1 ${
                    screenMode === "specs"
                      ? "bg-white text-black font-bold shadow-sm"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  <Cpu className="w-2.5 h-2.5" />
                  <span>SPECS</span>
                </button>

                <button
                  onClick={() => setScreenMode("visualizer")}
                  className={`px-1.5 sm:px-2 py-0.5 rounded text-[8.5px] sm:text-[9.5px] font-mono font-medium transition-all flex items-center gap-1 ${
                    screenMode === "visualizer"
                      ? "bg-purple-500 text-white font-bold shadow-sm"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  <Activity className="w-2.5 h-2.5" />
                  <span>EQ</span>
                </button>
              </div>

              {/* Live Status Indicator */}
              <span className="flex items-center gap-1 text-[8.5px] sm:text-[9px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                60FPS
              </span>
            </div>

            {/* 3D Canvas Viewport */}
            <div className="relative flex-1 w-full h-full overflow-hidden">
              <HeroRetroWorkstation3D
                currentMode={screenMode}
                onModeChange={setScreenMode}
                onDuckQuack={handleDuckQuack}
              />
              
              {/* Interaction Hints Pill */}
              <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between font-mono text-[8px] sm:text-[8.5px] text-white/50 pointer-events-none select-none">
                <span className="bg-black/75 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-sm">
                  Click Screen or Duck · Move to Tilt
                </span>
                <span className="bg-black/75 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-sm text-white">
                  {screenMode.toUpperCase()}
                </span>
              </div>
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
