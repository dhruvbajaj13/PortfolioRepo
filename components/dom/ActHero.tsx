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

// ─── 2. Interactive Feature-Packed Retro Developer Workstation ───
export type WorkstationScreenMode = "terminal" | "matrix" | "specs" | "visualizer";

interface RetroWorkstationProps {
  currentMode: WorkstationScreenMode;
  onModeChange: (mode: WorkstationScreenMode) => void;
  onDuckQuack?: () => void;
}

const HeroRetroWorkstation3D: React.FC<RetroWorkstationProps> = ({
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

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 360;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
    camera.position.set(0, 1.35, 4.6);
    camera.lookAt(0, 0.45, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1); // Fixed at 1 for smooth perf
    container.appendChild(renderer.domElement);

    // Root Group for Mouse Parallax
    const deskGroup = new THREE.Group();
    deskGroup.position.set(0, -0.4, 0);
    scene.add(deskGroup);

    // 1. CRT Screen Canvas (reduced resolution for smooth updates)
    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 256;
    screenCanvas.height = 192;
    const ctx = screenCanvas.getContext("2d");
    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.minFilter = THREE.LinearFilter;

    // Materials
    const darkChassisMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.5,
      metalness: 0.25,
    });
    const beigeBezelMat = new THREE.MeshStandardMaterial({
      color: 0x242429,
      roughness: 0.6,
      metalness: 0.15,
    });

    // Monitor Base
    const baseGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.08, 32);
    const baseMesh = new THREE.Mesh(baseGeo, darkChassisMat);
    baseMesh.position.set(0, 0.04, 0);
    deskGroup.add(baseMesh);

    // Monitor Stem
    const stemGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.5, 16);
    const stemMesh = new THREE.Mesh(stemGeo, darkChassisMat);
    stemMesh.position.set(0, 0.3, 0);
    deskGroup.add(stemMesh);

    // Monitor Chassis Body
    const monitorBodyGeo = new THREE.BoxGeometry(2.2, 1.55, 0.52);
    const monitorBody = new THREE.Mesh(monitorBodyGeo, beigeBezelMat);
    monitorBody.position.set(0, 1.25, 0);
    deskGroup.add(monitorBody);

    // CRT Screen Face (Interactive)
    const screenGeo = new THREE.PlaneGeometry(1.9, 1.24);
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 1.25, 0.265);
    screenMesh.name = "screen";
    deskGroup.add(screenMesh);

    // Monitor Power LED (Glows & pulses)
    const ledGeo = new THREE.SphereGeometry(0.025, 16, 16);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(0.88, 0.58, 0.27);
    deskGroup.add(ledMesh);

    // Sticky Note on Monitor
    const noteGeo = new THREE.PlaneGeometry(0.3, 0.3);
    const noteCanvas = document.createElement("canvas");
    noteCanvas.width = 128;
    noteCanvas.height = 128;
    const nctx = noteCanvas.getContext("2d");
    if (nctx) {
      nctx.fillStyle = "#fef08a";
      nctx.fillRect(0, 0, 128, 128);
      nctx.fillStyle = "#713f12";
      nctx.font = "bold 8px monospace";
      nctx.textAlign = "center";
      nctx.fillText("BUILD", 64, 42);
      nctx.fillText("IMPACT", 64, 72);
      nctx.fillText("// 2025", 64, 102);
    }
    const noteTexture = new THREE.CanvasTexture(noteCanvas);
    const noteMat = new THREE.MeshBasicMaterial({ map: noteTexture });
    const noteMesh = new THREE.Mesh(noteGeo, noteMat);
    noteMesh.position.set(0.82, 1.84, 0.27);
    noteMesh.rotation.z = -0.08;
    deskGroup.add(noteMesh);

    // 2. Mechanical Keyboard with Coiled Cable
    const kbBaseGeo = new THREE.BoxGeometry(1.75, 0.08, 0.68);
    const kbBase = new THREE.Mesh(kbBaseGeo, darkChassisMat);
    kbBase.position.set(0, 0.05, 1.15);
    kbBase.rotation.x = 0.08;
    deskGroup.add(kbBase);

    // Keyboard Keycaps
    const keyGeo = new THREE.BoxGeometry(0.1, 0.04, 0.085);
    const keyMatDark = new THREE.MeshStandardMaterial({ color: 0x2e2e33, roughness: 0.5 });
    const keyMatOrange = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 });
    const keyMatCyan = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.4 });

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 12; c++) {
        const isEsc = r === 3 && c === 0;
        const isEnter = r === 1 && c === 11;
        const isSpace = r === 0 && (c >= 4 && c <= 7);
        if (isSpace && c !== 4) continue;
        const m = isEsc ? keyMatOrange : isEnter ? keyMatCyan : keyMatDark;
        const kGeo = isSpace ? new THREE.BoxGeometry(0.48, 0.04, 0.085) : keyGeo;
        const key = new THREE.Mesh(kGeo, m);
        const xPos = isSpace ? 0 : (c - 5.5) * 0.125;
        key.position.set(xPos, 0.08 + (3 - r) * 0.015, 0.9 + r * 0.135);
        key.rotation.x = 0.08;
        deskGroup.add(key);
      }
    }

    // Coiled Keyboard Cable leading to monitor base
    const cableCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.06, 0.78),
      new THREE.Vector3(0.08, 0.07, 0.55),
      new THREE.Vector3(-0.06, 0.06, 0.35),
      new THREE.Vector3(0, 0.05, 0.15),
    ]);
    const cableGeo = new THREE.TubeGeometry(cableCurve, 24, 0.014, 8, false);
    const cableMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.6 });
    const cableMesh = new THREE.Mesh(cableGeo, cableMat);
    deskGroup.add(cableMesh);

    // Keyboard Underglow RGB Light Strip
    const underglowGeo = new THREE.BoxGeometry(1.8, 0.01, 0.72);
    const underglowMat = new THREE.MeshBasicMaterial({
      color: 0xff6b2c,
      transparent: true,
      opacity: 0.35,
    });
    const underglowMesh = new THREE.Mesh(underglowGeo, underglowMat);
    underglowMesh.position.set(0, 0.01, 1.15);
    deskGroup.add(underglowMesh);

    // 3. Mouse and Mousepad
    const padGeo = new THREE.BoxGeometry(0.65, 0.01, 0.75);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x111113, roughness: 0.8 });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.position.set(1.3, 0.005, 1.15);
    deskGroup.add(pad);

    const mouseGeo = new THREE.BoxGeometry(0.2, 0.075, 0.32);
    const mouseMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.4 });
    const mouse = new THREE.Mesh(mouseGeo, mouseMat);
    mouse.position.set(1.3, 0.045, 1.15);
    deskGroup.add(mouse);

    // Mouse sensor glow
    const mouseGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xff6b2c })
    );
    mouseGlow.position.set(1.3, 0.075, 1.08);
    deskGroup.add(mouseGlow);

    // 4. Yellow Rubber Duck Mascot (Clickable!)
    const duckGroup = new THREE.Group();
    duckGroup.name = "duck";
    const duckMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });
    const duckBody = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), duckMat);
    duckBody.scale.set(1, 0.8, 1.15);
    duckGroup.add(duckBody);

    const duckHead = new THREE.Mesh(new THREE.SphereGeometry(0.095, 16, 16), duckMat);
    duckHead.position.set(0, 0.14, 0.075);
    duckGroup.add(duckHead);

    const beak = new THREE.Mesh(
      new THREE.ConeGeometry(0.045, 0.09, 16),
      new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 })
    );
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, 0.13, 0.18);
    duckGroup.add(beak);

    // Duck Sunglasses (Cool Developer Touch!)
    const glassesGeo = new THREE.BoxGeometry(0.14, 0.035, 0.04);
    const glassesMat = new THREE.MeshBasicMaterial({ color: 0x09090b });
    const glasses = new THREE.Mesh(glassesGeo, glassesMat);
    glasses.position.set(0, 0.155, 0.165);
    duckGroup.add(glasses);

    duckGroup.position.set(-1.25, 0.14, 0.7);
    duckGroup.rotation.y = 0.45;
    deskGroup.add(duckGroup);

    // 5. Coffee Mug with Steaming Vapor
    const mugGeo = new THREE.CylinderGeometry(0.13, 0.11, 0.3, 20);
    const mugMat = new THREE.MeshStandardMaterial({ color: 0xe4e4e7, roughness: 0.3 });
    const mug = new THREE.Mesh(mugGeo, mugMat);
    mug.position.set(-1.28, 0.15, 1.22);
    deskGroup.add(mug);

    // Coffee surface
    const coffeeGeo = new THREE.CircleGeometry(0.11, 16);
    const coffeeMat = new THREE.MeshBasicMaterial({ color: 0x3f2212 });
    const coffee = new THREE.Mesh(coffeeGeo, coffeeMat);
    coffee.rotation.x = -Math.PI / 2;
    coffee.position.set(-1.28, 0.28, 1.22);
    deskGroup.add(coffee);

    // Steam particles
    const steamCount = 18;
    const steamGeo = new THREE.BufferGeometry();
    const steamPos = new Float32Array(steamCount * 3);
    for (let i = 0; i < steamCount; i++) {
      steamPos[i * 3] = -1.28 + (Math.random() - 0.5) * 0.08;
      steamPos[i * 3 + 1] = 0.32 + Math.random() * 0.35;
      steamPos[i * 3 + 2] = 1.22 + (Math.random() - 0.5) * 0.08;
    }
    steamGeo.setAttribute("position", new THREE.BufferAttribute(steamPos, 3));
    const steamMat = new THREE.PointsMaterial({
      size: 0.035,
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
    });
    const steam = new THREE.Points(steamGeo, steamMat);
    deskGroup.add(steam);

    // 6. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const screenLight = new THREE.PointLight(0xff6b2c, 2.2, 4.5);
    screenLight.position.set(0, 1.25, 0.7);
    deskGroup.add(screenLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.1);
    dirLight.position.set(3, 4, 3);
    scene.add(dirLight);

    const rimLight = new THREE.PointLight(0xa855f7, 1.4, 5);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);

    // 7. Floating Ambient Particles
    const dustCount = 100;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 6;
      dustPos[i * 3 + 1] = Math.random() * 3.5;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xff6b2c,
      transparent: true,
      opacity: 0.45,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // Matrix Rain State Variables
    const matrixCols = 28;
    const matrixDrops: number[] = [];
    for (let i = 0; i < matrixCols; i++) {
      matrixDrops[i] = Math.floor(Math.random() * -30);
    }
    const matrixChars = "01010101XYZΩλπ∑Δ√<>{}[]=/*#@!ABCDEF";

    // Terminal Lines
    const terminalLines = [
      "> DHRUV_BAJAJ.sh --mode=production",
      "> LeetCode Knight · Rating 1933 [TOP 3%]",
      "> Full-Stack MERN & Next.js [INITIALIZED]",
      "> Agentic RAG & LangChain AI [ONLINE]",
      "> CleanCity SIH IoT System [READY]",
      "> Systems Operational. Ready to build_",
    ];

    // Duck Animation State
    let duckHop = 0;
    let duckHopSpeed = 0;

    // Raycaster for 3D clicks on Screen & Duck
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    const onPointerDown = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseCoord.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseCoord.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      raycaster.setFromCamera(mouseCoord, camera);

      const intersects = raycaster.intersectObjects(deskGroup.children, true);
      if (intersects.length > 0) {
        let hitObject: THREE.Object3D | null = intersects[0].object;
        while (hitObject && hitObject !== deskGroup) {
          if (hitObject.name === "duck") {
            duckHopSpeed = 0.08;
            if (onDuckQuack) onDuckQuack();
            return;
          }
          if (hitObject.name === "screen") {
            // Cycle modes on screen click
            const modes: WorkstationScreenMode[] = ["terminal", "matrix", "specs", "visualizer"];
            const nextIdx = (modes.indexOf(modeRef.current) + 1) % modes.length;
            onModeChange(modes[nextIdx]);
            return;
          }
          hitObject = hitObject.parent;
        }
      }
    };
    container.addEventListener("pointerdown", onPointerDown);

    // Mouse Tracking for Smooth 3D Tilt
    let targetRotY = 0;
    let targetRotX = 0;
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = Math.max(-0.28, Math.min(0.28, normX * 0.22));
      targetRotX = Math.max(-0.18, Math.min(0.18, -normY * 0.14));
    };
    window.addEventListener("mousemove", onMouseMove);

    // Main Animation Loop
    let frame = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame++;

      // Lerp mouse tilt
      deskGroup.rotation.y += (targetRotY - deskGroup.rotation.y) * 0.06;
      deskGroup.rotation.x += (targetRotX - deskGroup.rotation.x) * 0.06;

      // Underglow color pulse
      underglowMat.opacity = 0.28 + Math.sin(frame * 0.05) * 0.12;

      // Duck bounce physics
      if (duckHopSpeed !== 0 || duckHop > 0) {
        duckHop += duckHopSpeed;
        duckHopSpeed -= 0.007; // Gravity
        if (duckHop <= 0) {
          duckHop = 0;
          duckHopSpeed = 0;
        }
        duckGroup.position.y = 0.14 + duckHop;
        duckGroup.rotation.y = 0.45 + duckHop * 4.0;
      }

      // Steam animation
      const sPos = steamGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < steamCount * 3; i += 3) {
        sPos[i] += 0.003;
        sPos[i - 1] += Math.sin(frame * 0.05 + i) * 0.001;
        if (sPos[i] > 0.7) {
          sPos[i] = 0.32;
          sPos[i - 1] = -1.28 + (Math.random() - 0.5) * 0.06;
        }
      }
      steamGeo.attributes.position.needsUpdate = true;

      // Dust float
      const positions = dustGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < dustCount * 3; i += 3) {
        positions[i] += 0.002;
        if (positions[i] > 3.5) positions[i] = 0;
      }
      dustGeo.attributes.position.needsUpdate = true;

      // ── CRT Canvas Drawing by Mode ──
      const mode = modeRef.current;

      if (ctx) {
        if (mode === "matrix") {
          // ── MATRIX DIGITAL RAIN ──
          ctx.fillStyle = "rgba(4, 9, 14, 0.2)";
          ctx.fillRect(0, 0, 256, 192);

          ctx.font = "bold 7px monospace";
          for (let i = 0; i < matrixCols; i++) {
            const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            const x = 8 + i * 9;
            const y = matrixDrops[i] * 18;

            // Head character is glowing white/cyan, body is matrix green
            ctx.fillStyle = "#e0f2fe";
            ctx.fillText(char, x, y);

            ctx.fillStyle = "#22c55e";
            const prevChar = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            ctx.fillText(prevChar, x, y - 18);

            if (y > 192 && Math.random() > 0.96) {
              matrixDrops[i] = 0;
            }
            matrixDrops[i]++;
          }

          // Matrix Title Banner
          ctx.fillStyle = "rgba(2, 6, 23, 0.85)";
          ctx.fillRect(5, 5, 246, 14);
          ctx.strokeStyle = "rgba(34, 197, 94, 0.4)";
          ctx.strokeRect(5, 5, 246, 14);
          ctx.fillStyle = "#4ade80";
          ctx.font = "bold 7px monospace";
          ctx.fillText("● MATRIX STREAM // DHRUV.SYS ACTIVE", 12, 14);

        } else if (mode === "specs") {
          // ── NEOFETCH / SYSTEM SPECS ──
          if (frame % 4 === 0) {
            ctx.fillStyle = "#0a0e17";
            ctx.fillRect(0, 0, 256, 192);

            // Scanlines
            ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
            for (let y = 0; y < 384; y += 2) {
              ctx.fillRect(0, y, 256, 1);
            }

            // Top Bar
            ctx.fillStyle = "#38bdf8";
            ctx.font = "bold 8px monospace";
            ctx.fillText("● ● ●  neofetch - dhruv@nsut", 12, 16);

            ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
            ctx.beginPath();
            ctx.moveTo(20, 44);
            ctx.lineTo(492, 44);
            ctx.stroke();

            // ASCII Art Mascot (Left)
            ctx.fillStyle = "#38bdf8";
            ctx.font = "7px monospace";
            const asciiArt = [
              "    /\\_/\\    ",
              "   ( o.o )   ",
              "    > ^ <    ",
              "  /|     |\\  ",
              " (_|     |_) ",
              "   ^^   ^^   ",
            ];
            for (let a = 0; a < asciiArt.length; a++) {
              ctx.fillText(asciiArt[a], 12, 44 + a * 12);
            }

            // Neofetch Specs List (Right)
            ctx.font = "7px monospace";
            const specs = [
              { label: "USER", val: "dhruv@nsut.ac.in", col: "#38bdf8" },
              { label: "OS", val: "DhruvOS v2.5 (x86_64)", col: "#e2e8f0" },
              { label: "ROLE", val: "Full Stack & AI Engineer", col: "#a855f7" },
              { label: "LEETCODE", val: "Knight · Rating 1933 [Top 3%]", col: "#f59e0b" },
              { label: "DSA SOLVED", val: "1,000+ Algorithmic Problems", col: "#10b981" },
              { label: "STACK", val: "Next.js / MERN / PyTorch / RAG", col: "#06b6d4" },
              { label: "HACKATHON", val: "SIH Winner (CleanCity Smart IoT)", col: "#ec4899" },
              { label: "STATUS", val: "Open to SDE Opportunities", col: "#22c55e" },
            ];

            for (let s = 0; s < specs.length; s++) {
              ctx.fillStyle = "#94a3b8";
              ctx.fillText(`${specs[s].label}: `, 95, 39 + s * 14);
              ctx.fillStyle = specs[s].col;
              ctx.fillText(specs[s].val, 140, 39 + s * 14);
            }

            // Memory Bar
            ctx.fillStyle = "#94a3b8";
            ctx.fillText("MEMORY: [██████████████░░] 88%", 95, 155);

            // Color Palette squares at bottom
            const palette = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#a855f7"];
            for (let p = 0; p < palette.length; p++) {
              ctx.fillStyle = palette[p];
              ctx.fillRect(95 + p * 17, 166, 13, 7);
            }
          }

        } else if (mode === "visualizer") {
          // ── CYBERPUNK AUDIO & CPU EQUALIZER ──
          if (frame % 2 === 0) {
            ctx.fillStyle = "#090d16";
            ctx.fillRect(0, 0, 256, 192);

            // Header
            ctx.fillStyle = "#a855f7";
            ctx.font = "bold 8px monospace";
            ctx.fillText("● SPECTRUM AUDIO & CORE TELEMETRY", 12, 17);

            // EQ Bars
            const numBars = 16;
            const barWidth = 7;
            const barGap = 3;
            const startX = 10;

            for (let b = 0; b < numBars; b++) {
              const freq = Math.sin(frame * 0.1 + b * 0.45) * 0.5 + 0.5;
              const barHeight = 20 + freq * 90 + Math.sin(frame * 0.04 * b) * 15;
              const y = 145 - barHeight;

              // Gradient bar
              const grad = ctx.createLinearGradient(0, y, 0, 290);
              grad.addColorStop(0, "#38bdf8");
              grad.addColorStop(0.5, "#a855f7");
              grad.addColorStop(1, "#22c55e");
              ctx.fillStyle = grad;
              ctx.fillRect(startX + b * (barWidth + barGap), y, barWidth, barHeight);

              // Cap
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(startX + b * (barWidth + barGap), y - 2, barWidth, 1);
            }

            // Realtime CPU Stats below
            ctx.fillStyle = "#38bdf8";
            ctx.font = "7px monospace";
            ctx.fillText(`CPU: ${(24 + Math.sin(frame * 0.08) * 8).toFixed(1)}%   RAM: 4.8 / 16 GB   LATENCY: 12ms`, 12, 170);
            ctx.fillText(`CORES: 8 ACTIVE   SYS LOAD: OPTIMAL`, 12, 182);
          }

        } else {
          // ── TERMINAL BASH (Default) ──
          if (frame % 3 === 0) {
            ctx.fillStyle = "#090c13";
            ctx.fillRect(0, 0, 256, 192);

            // CRT Scanlines
            ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
            for (let y = 0; y < 384; y += 2) {
              ctx.fillRect(0, y, 256, 1);
            }

            // Window Title Bar
            ctx.fillStyle = "#38bdf8";
            ctx.font = "bold 9px monospace";
            ctx.fillText("● ● ●  bash - 80x24", 12, 17);

            ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
            ctx.beginPath();
            ctx.moveTo(10, 24);
            ctx.lineTo(246, 24);
            ctx.stroke();

            // Lines
            ctx.font = "8px monospace";
            const visibleLines = Math.min(Math.floor(frame / 36) + 1, terminalLines.length);
            for (let l = 0; l < visibleLines; l++) {
              const isPrompt = l === 0;
              const isHighlight = l === 1 || l === 3;
              ctx.fillStyle = isPrompt ? "#34d399" : isHighlight ? "#a855f7" : "#e2e8f0";
              const text = terminalLines[l];
              if (l === visibleLines - 1 && visibleLines < terminalLines.length) {
                const charCount = Math.floor(((frame % 36) / 36) * text.length);
                ctx.fillText(text.slice(0, charCount) + "█", 24, 41 + l * 17);
              } else {
                ctx.fillText(text, 24, 41 + l * 17);
              }
            }

            // Command Hint
            ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
            ctx.font = "6px monospace";
            ctx.fillText("Tip: Click screen to cycle modes (Terminal, Matrix, Specs, EQ)", 12, 178);
          }
        }

        screenTexture.needsUpdate = true;
      }

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
      container.removeEventListener("pointerdown", onPointerDown);
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onDuckQuack, onModeChange]);

  return <div ref={mountRef} className="w-full h-full cursor-pointer" />;
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

          <div className="relative w-full max-w-[460px] lg:max-w-[490px] aspect-[4/3] rounded-3xl border border-white/15 bg-[#0C0C0E]/95 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden backdrop-blur-2xl flex flex-col group/terminal">
            
            {/* Window Header Chrome with Interactive Mode Switcher */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#141418] border-b border-white/10 shrink-0 select-none">
              {/* Mac Traffic Lights */}
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] shadow-[0_0_5px_rgba(255,95,87,0.5)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E] shadow-[0_0_5px_rgba(254,188,46,0.4)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28C840] shadow-[0_0_5px_rgba(40,200,64,0.4)]" />
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex items-center gap-1 bg-black/50 p-0.5 rounded-lg border border-white/10">
                <button
                  onClick={() => setScreenMode("terminal")}
                  className={`px-2 py-0.5 rounded text-[9.5px] font-mono font-medium transition-all flex items-center gap-1 ${
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
                  className={`px-2 py-0.5 rounded text-[9.5px] font-mono font-medium transition-all flex items-center gap-1 ${
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
                  className={`px-2 py-0.5 rounded text-[9.5px] font-mono font-medium transition-all flex items-center gap-1 ${
                    screenMode === "specs"
                      ? "bg-cyan-400 text-black font-bold shadow-sm"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  <Cpu className="w-2.5 h-2.5" />
                  <span>SPECS</span>
                </button>

                <button
                  onClick={() => setScreenMode("visualizer")}
                  className={`px-2 py-0.5 rounded text-[9.5px] font-mono font-medium transition-all flex items-center gap-1 ${
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
              <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400">
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
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between font-mono text-[8.5px] text-white/50 pointer-events-none select-none">
                <span className="bg-black/75 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-sm">
                  Click Screen or Duck · Move Mouse to Tilt
                </span>
                <span className="bg-black/75 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-sm text-cyan-400">
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
          className="p-2.5 rounded-full border border-white/10 text-[#A8A8A8] hover:text-[#FFFFFF] hover:border-[#FF6B2C]/60 transition-colors bg-[#080808]"
          aria-label="Scroll to About"
        >
          <ArrowDown className="w-4 h-4 animate-bounce text-[#FF6B2C]" />
        </button>
      </motion.div>
    </section>
  );
}
