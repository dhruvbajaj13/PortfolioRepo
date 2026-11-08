'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Zap, Activity, Cpu, Database, Network, Code, Layers, Sparkles } from 'lucide-react';
import { useTactileSound } from '@/hooks/useTactileSound';

interface TechNodeData {
  id: string;
  name: string;
  category: string;
  color: number;
  hex: string;
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
  orbitTilt: number;
  details: string;
}

const TECH_NODES: TechNodeData[] = [
  {
    id: 'ai-rag',
    name: 'AI & RAG',
    category: 'GenAI Systems',
    color: 0x1cd399,
    hex: '#1CD399',
    orbitRadius: 2.1,
    orbitSpeed: 0.35,
    orbitPhase: 0,
    orbitTilt: 0.25,
    details: 'LangChain • LangGraph • Hybrid RAG',
  },
  {
    id: 'algorithms',
    name: 'Algorithms',
    category: 'Competitive DSA',
    color: 0xffa116,
    hex: '#FFA116',
    orbitRadius: 2.3,
    orbitSpeed: 0.28,
    orbitPhase: (Math.PI * 2) / 6,
    orbitTilt: -0.3,
    details: 'LeetCode Knight 1951 • 1100+ Solved',
  },
  {
    id: 'systems',
    name: 'Full Stack',
    category: 'Web Architecture',
    color: 0x3178c6,
    hex: '#3178C6',
    orbitRadius: 2.0,
    orbitSpeed: 0.32,
    orbitPhase: (Math.PI * 4) / 6,
    orbitTilt: 0.45,
    details: 'Next.js 15 • TypeScript • React',
  },
  {
    id: 'backend',
    name: 'Services',
    category: 'Distributed APIs',
    color: 0x009688,
    hex: '#009688',
    orbitRadius: 2.2,
    orbitSpeed: -0.3,
    orbitPhase: (Math.PI * 6) / 6,
    orbitTilt: -0.2,
    details: 'FastAPI • Node.js • REST APIs',
  },
  {
    id: 'realtime',
    name: 'Realtime',
    category: 'State & Workflows',
    color: 0xff5722,
    hex: '#FF5722',
    orbitRadius: 2.15,
    orbitSpeed: 0.25,
    orbitPhase: (Math.PI * 8) / 6,
    orbitTilt: 0.35,
    details: 'Convex • Inngest • WebSockets',
  },
  {
    id: 'data',
    name: 'Vector DB',
    category: 'High-Dim Storage',
    color: 0xa855f7,
    hex: '#A855F7',
    orbitRadius: 2.25,
    orbitSpeed: -0.26,
    orbitPhase: (Math.PI * 10) / 6,
    orbitTilt: -0.4,
    details: 'Pinecone • ChromaDB • MongoDB',
  },
];

export function HeroTechNexus3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { playClick, playPop, playWhoosh } = useTactileSound();

  const [activeMode, setActiveMode] = useState<'ALL' | 'AI' | 'SYSTEMS' | 'ALGO'>('ALL');
  const [activeNode, setActiveNode] = useState<TechNodeData | null>(null);
  const [isOverclocked, setIsOverclocked] = useState(false);
  const [fps, setFps] = useState(60);

  // References for animation loop
  const modeRef = useRef(activeMode);
  modeRef.current = activeMode;

  const overclockRef = useRef(false);
  const triggerPulseRef = useRef<(() => void) | null>(null);

  // Interaction handlers
  const handlePulse = useCallback(() => {
    playWhoosh();
    setIsOverclocked(true);
    overclockRef.current = true;
    if (triggerPulseRef.current) {
      triggerPulseRef.current();
    }
    setTimeout(() => {
      setIsOverclocked(false);
      overclockRef.current = false;
    }, 1800);
  }, [playWhoosh]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 480;
    let height = container.clientHeight || 340;

    // ─── 1. Scene, Camera, Renderer ──────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // ─── 2. Master Rotational Pivot ──────────────────────────────────
    const masterPivot = new THREE.Group();
    scene.add(masterPivot);

    // ─── 3. Lighting ────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0xffffff, 2.8, 12);
    coreLight.position.set(0, 0, 0);
    masterPivot.add(coreLight);

    const rimLight1 = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight1.position.set(4, 5, 3);
    scene.add(rimLight1);

    const rimLight2 = new THREE.DirectionalLight(0xa855f7, 0.9);
    rimLight2.position.set(-4, -4, 2);
    scene.add(rimLight2);

    // ─── 4. Central Holographic Quantum Core ─────────────────────────
    const coreGroup = new THREE.Group();
    masterPivot.add(coreGroup);

    // 4.1 Inner glowing solid energy seed
    const seedGeo = new THREE.IcosahedronGeometry(0.42, 2);
    const seedMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: false,
    });
    const seedMesh = new THREE.Mesh(seedGeo, seedMat);
    coreGroup.add(seedMesh);

    // 4.2 Middle wireframe crystalline cage
    const midCageGeo = new THREE.IcosahedronGeometry(0.72, 1);
    const midCageMat = new THREE.MeshStandardMaterial({
      color: 0xe0e7ff,
      wireframe: true,
      emissive: 0x818cf8,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.9,
    });
    const midCageMesh = new THREE.Mesh(midCageGeo, midCageMat);
    coreGroup.add(midCageMesh);

    // 4.3 Outer faceted geometric shell with vertex points
    const outerGeo = new THREE.DodecahedronGeometry(0.98, 0);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.8,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerMesh);

    // ─── 5. Gyroscopic Gimbal Orbital Rings ───────────────────────────
    const ringMatBase = {
      color: 0xffffff,
      transparent: true,
      roughness: 0.3,
      metalness: 0.8,
    };

    // Ring 1 — Inner Equatorial Ring
    const ring1Geo = new THREE.TorusGeometry(1.5, 0.014, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      ...ringMatBase,
      opacity: 0.35,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    masterPivot.add(ring1);

    // Ring 2 — Middle Inclined Ring
    const ring2Geo = new THREE.TorusGeometry(1.85, 0.012, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      ...ringMatBase,
      opacity: 0.25,
      color: 0xd4d4d8,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 6;
    masterPivot.add(ring2);

    // Ring 3 — Outer Polar Ring
    const ring3Geo = new THREE.TorusGeometry(2.35, 0.01, 16, 100);
    const ring3Mat = new THREE.MeshStandardMaterial({
      ...ringMatBase,
      opacity: 0.2,
      color: 0xa1a1aa,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = -Math.PI / 4;
    ring3.rotation.z = Math.PI / 3;
    masterPivot.add(ring3);

    // ─── 6. Orbital Tech Nodes & Synaptic Laser Lines ─────────────────
    interface LiveNodeMesh {
      data: TechNodeData;
      pivot: THREE.Group;
      nodeMesh: THREE.Mesh;
      haloMesh: THREE.Mesh;
      line: THREE.Line;
      packet: THREE.Mesh;
      packetProgress: number;
    }

    const liveNodes: LiveNodeMesh[] = [];

    TECH_NODES.forEach((nodeData) => {
      const nodePivot = new THREE.Group();
      masterPivot.add(nodePivot);

      // Node mesh (sphere with original tech domain color)
      const nGeo = new THREE.SphereGeometry(0.13, 20, 20);
      const nMat = new THREE.MeshStandardMaterial({
        color: nodeData.color,
        emissive: nodeData.color,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8,
      });
      const nodeMesh = new THREE.Mesh(nGeo, nMat);
      nodePivot.add(nodeMesh);

      // Outer pulsing halo ring
      const haloGeo = new THREE.RingGeometry(0.18, 0.22, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: nodeData.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      nodePivot.add(haloMesh);

      // Synaptic connection line to core
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0),
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: nodeData.color,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      masterPivot.add(line);

      // Traveling data packet
      const packetGeo = new THREE.SphereGeometry(0.04, 12, 12);
      const packetMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
      });
      const packet = new THREE.Mesh(packetGeo, packetMat);
      masterPivot.add(packet);

      liveNodes.push({
        data: nodeData,
        pivot: nodePivot,
        nodeMesh,
        haloMesh,
        line,
        packet,
        packetProgress: Math.random(),
      });
    });

    // ─── 7. Ambient Particle Field ───────────────────────────────────
    const particleCount = 200;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pCol = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.4 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = radius * Math.cos(phi);

      // Subtle monochromatic / cyan tinted particles
      const intensity = 0.4 + Math.random() * 0.6;
      pCol[i * 3] = intensity;
      pCol[i * 3 + 1] = intensity;
      pCol[i * 3 + 2] = intensity * 1.1;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    masterPivot.add(particles);

    // ─── 8. Overclock Shockwave Rings ────────────────────────────────
    const shockwaveGeo = new THREE.RingGeometry(0.1, 0.16, 64);
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const shockwaveMesh = new THREE.Mesh(shockwaveGeo, shockwaveMat);
    masterPivot.add(shockwaveMesh);

    let shockwaveActive = false;
    let shockwaveScale = 0.1;
    let shockwaveOpacity = 0;

    triggerPulseRef.current = () => {
      shockwaveActive = true;
      shockwaveScale = 0.1;
      shockwaveOpacity = 1;
    };

    // ─── 9. Mouse & Touch Controls with Smooth Inertia ───────────────
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    const targetRotation = { x: 0.2, y: 0.4 };
    const currentRotation = { x: 0.2, y: 0.4 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;
        targetRotation.y += deltaX * 0.008;
        targetRotation.x += deltaY * 0.008;
        prevMousePos = { x: e.clientX, y: e.clientY };
      } else {
        // Soft hover tracking
        targetRotation.y = normX * 0.45;
        targetRotation.x = -normY * 0.35 + 0.15;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch events for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - prevMousePos.x;
        const deltaY = e.touches[0].clientY - prevMousePos.y;
        targetRotation.y += deltaX * 0.01;
        targetRotation.x += deltaY * 0.01;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // ─── 10. Resize Observer ─────────────────────────────────────────
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // ─── 11. Animation Loop (Locked 60FPS) ───────────────────────────
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let frameCount = 0;
    let lastTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const speedMultiplier = overclockRef.current ? 2.6 : 1.0;

      // FPS tracking (every 30 frames)
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }

      // Smooth camera / pivot lerp
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.06;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.06;
      masterPivot.rotation.x = currentRotation.x;
      masterPivot.rotation.y = currentRotation.y + elapsedTime * 0.08 * speedMultiplier;

      // Core rotation & breathing
      const breath = 1.0 + Math.sin(elapsedTime * 2.2) * 0.06;
      seedMesh.scale.setScalar(breath);
      midCageMesh.rotation.x = elapsedTime * 0.45 * speedMultiplier;
      midCageMesh.rotation.y = elapsedTime * 0.6 * speedMultiplier;
      outerMesh.rotation.y = -elapsedTime * 0.3 * speedMultiplier;
      outerMesh.rotation.z = elapsedTime * 0.25 * speedMultiplier;

      // Gimbal Rings rotation
      ring1.rotation.z = elapsedTime * 0.2 * speedMultiplier;
      ring2.rotation.y += 0.004 * speedMultiplier;
      ring3.rotation.z -= 0.005 * speedMultiplier;

      // Ambient particle rotation
      particles.rotation.y = -elapsedTime * 0.03;

      // Shockwave animation
      if (shockwaveActive) {
        shockwaveScale += 0.08;
        shockwaveOpacity -= 0.035;
        shockwaveMesh.scale.set(shockwaveScale, shockwaveScale, shockwaveScale);
        shockwaveMat.opacity = Math.max(0, shockwaveOpacity);
        if (shockwaveOpacity <= 0) {
          shockwaveActive = false;
        }
      }

      // Update Tech Nodes & Laser streams
      const currentMode = modeRef.current;

      liveNodes.forEach((live, idx) => {
        const { data, pivot, nodeMesh, haloMesh, line, packet } = live;

        // Determine if node is highlighted based on active filter mode
        let isHighlighted = true;
        if (currentMode === 'AI' && data.id !== 'ai-rag' && data.id !== 'data') {
          isHighlighted = false;
        } else if (currentMode === 'SYSTEMS' && data.id !== 'systems' && data.id !== 'backend' && data.id !== 'realtime') {
          isHighlighted = false;
        } else if (currentMode === 'ALGO' && data.id !== 'algorithms') {
          isHighlighted = false;
        }

        // Calculate 3D orbit position
        const angle = data.orbitPhase + elapsedTime * data.orbitSpeed * speedMultiplier;
        const x = Math.cos(angle) * data.orbitRadius;
        const z = Math.sin(angle) * data.orbitRadius;
        const y = Math.sin(angle * 1.5 + data.orbitTilt) * 0.5;

        pivot.position.set(x, y, z);
        haloMesh.lookAt(camera.position);

        // Halo pulse
        const haloScale = isHighlighted ? (1.0 + Math.sin(elapsedTime * 4 + idx) * 0.15) : 0.6;
        haloMesh.scale.setScalar(haloScale);
        (haloMesh.material as THREE.MeshBasicMaterial).opacity = isHighlighted ? 0.65 : 0.15;
        (nodeMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = isHighlighted ? (overclockRef.current ? 1.6 : 1.0) : 0.2;

        // Line update (connect core center to current node position)
        const linePositions = (line.geometry as THREE.BufferGeometry).attributes.position as THREE.BufferAttribute;
        linePositions.setXYZ(0, 0, 0, 0);
        linePositions.setXYZ(1, x, y, z);
        linePositions.needsUpdate = true;
        (line.material as THREE.LineBasicMaterial).opacity = isHighlighted ? (overclockRef.current ? 0.6 : 0.3) : 0.08;

        // Packet travel along line
        live.packetProgress = (live.packetProgress + 0.012 * speedMultiplier) % 1;
        const px = x * (1 - live.packetProgress);
        const py = y * (1 - live.packetProgress);
        const pz = z * (1 - live.packetProgress);
        packet.position.set(px, py, pz);
        packet.visible = isHighlighted;
      });

      renderer.render(scene, camera);
    };

    animate();

    // ─── 12. Cleanup ─────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between select-none">
      {/* 3D WebGL Canvas Mount */}
      <div
        ref={mountRef}
        onClick={handlePulse}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Top Cybernetic HUD Header */}
      <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md">
          <span className={`w-2 h-2 rounded-full ${isOverclocked ? 'bg-[#FF5722] animate-ping' : 'bg-[#1CD399] animate-pulse'}`} />
          <span className="font-mono text-[9px] sm:text-[10px] tracking-wider text-white font-bold uppercase">
            {isOverclocked ? 'SYS.CORE // OVERCLOCK' : 'NEURAL NEXUS // ONLINE'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 border border-white/10 backdrop-blur-md font-mono text-[9px] sm:text-[10px] text-white/60">
            <Activity className="w-3 h-3 text-[#1CD399]" />
            <span>{fps} FPS</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePulse();
            }}
            className={`pointer-events-auto px-2.5 py-1 rounded-full font-mono text-[9.5px] sm:text-[10.5px] font-bold flex items-center gap-1 border transition-all duration-300 active:scale-95 ${
              isOverclocked
                ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.7)]'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/50'
            }`}
            title="Trigger Neural Core Pulse Shockwave"
          >
            <Zap className={`w-3 h-3 ${isOverclocked ? 'fill-black' : 'fill-white'}`} />
            <span>PULSE</span>
          </button>
        </div>
      </div>

      {/* Center Dynamic Node Tooltip (when hovered or pulsed) */}
      <div className="relative z-10 px-4 pointer-events-none flex justify-center">
        {activeNode && (
          <div className="px-3.5 py-1.5 rounded-xl border border-white/20 bg-black/80 backdrop-blur-xl shadow-2xl flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeNode.hex }} />
            <div>
              <span className="text-xs font-bold text-white block leading-tight">{activeNode.name}</span>
              <span className="text-[9px] font-mono text-white/60 block">{activeNode.details}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Filter & Telemetry Bar */}
      <div className="relative z-10 p-3 sm:p-4 flex flex-col gap-2 pointer-events-none">
        {/* Orbital Domain Filter Tabs */}
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar pointer-events-auto">
          {(['ALL', 'AI', 'SYSTEMS', 'ALGO'] as const).map((mode) => {
            const isActive = activeMode === mode;
            return (
              <button
                key={mode}
                onClick={() => {
                  playClick();
                  setActiveMode(mode);
                }}
                className={`px-2.5 sm:px-3 py-1 rounded-lg font-mono text-[9px] sm:text-[10px] transition-all duration-200 border whitespace-nowrap active:scale-95 ${
                  isActive
                    ? 'bg-white text-black font-extrabold border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                    : 'bg-black/60 text-white/60 border-white/10 hover:border-white/30 hover:text-white backdrop-blur-md'
                }`}
              >
                {mode === 'ALL' && 'ALL ARSENAL'}
                {mode === 'AI' && 'AI & RAG'}
                {mode === 'SYSTEMS' && 'FULL-STACK'}
                {mode === 'ALGO' && 'LEETCODE 1951'}
              </button>
            );
          })}
        </div>

        {/* Footnote instruction */}
        <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-white/40 px-1">
          <span>[ 3D NEURAL CLUSTER ]</span>
          <span>DRAG TO ROTATE • CLICK TO OVERCLOCK</span>
        </div>
      </div>
    </div>
  );
}

export default HeroTechNexus3D;
