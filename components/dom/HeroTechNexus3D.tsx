'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  Zap,
  Activity,
  RotateCcw,
  Layers,
  Volume2,
  VolumeX,
  Palette,
  Sparkles,
} from 'lucide-react';
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
  schematicY: number;
  schematicRadius: number;
  details: string;
  techStack: string;
}

const TECH_NODES: TechNodeData[] = [
  {
    id: 'ai-rag',
    name: 'AI & RAG Engine',
    category: 'GenAI Architecture',
    color: 0x1cd399,
    hex: '#1CD399',
    orbitRadius: 2.15,
    orbitSpeed: 0.38,
    orbitPhase: 0,
    orbitTilt: 0.28,
    schematicY: 0.5,
    schematicRadius: 1.6,
    details: 'LangChain • LangGraph • Agentic Workflows',
    techStack: 'Groq • Llama 3 • Pinecone RAG',
  },
  {
    id: 'algorithms',
    name: 'Algorithmic Engine',
    category: 'Competitive DSA',
    color: 0xffa116,
    hex: '#FFA116',
    orbitRadius: 2.35,
    orbitSpeed: 0.3,
    orbitPhase: (Math.PI * 2) / 6,
    orbitTilt: -0.32,
    schematicY: 0.5,
    schematicRadius: 1.8,
    details: 'LeetCode Knight (Rating 1951) • Top 3%',
    techStack: 'Graph Algorithms • Dynamic Programming',
  },
  {
    id: 'systems',
    name: 'Frontend Client Tier',
    category: 'Spatial & Web UI',
    color: 0x3178c6,
    hex: '#3178C6',
    orbitRadius: 2.05,
    orbitSpeed: 0.35,
    orbitPhase: (Math.PI * 4) / 6,
    orbitTilt: 0.45,
    schematicY: 1.4,
    schematicRadius: 1.5,
    details: 'Next.js 15 App Router • TypeScript • React',
    techStack: 'Tailwind CSS • Framer Motion • Three.js',
  },
  {
    id: 'backend',
    name: 'Distributed Services',
    category: 'Async Backend',
    color: 0x009688,
    hex: '#009688',
    orbitRadius: 2.25,
    orbitSpeed: -0.32,
    orbitPhase: (Math.PI * 6) / 6,
    orbitTilt: -0.22,
    schematicY: -0.5,
    schematicRadius: 1.6,
    details: 'FastAPI • Node.js • RESTful Architecture',
    techStack: 'Background Workers • Python • Express',
  },
  {
    id: 'realtime',
    name: 'Realtime & Telemetry',
    category: 'State & Events',
    color: 0xff5722,
    hex: '#FF5722',
    orbitRadius: 2.18,
    orbitSpeed: 0.28,
    orbitPhase: (Math.PI * 8) / 6,
    orbitTilt: 0.36,
    schematicY: 1.4,
    schematicRadius: 1.7,
    details: 'Convex Realtime DB • Inngest Queues',
    techStack: 'WebSockets • Reactive Synchronization',
  },
  {
    id: 'data',
    name: 'Vector & Data Store',
    category: 'High-Dim Storage',
    color: 0xa855f7,
    hex: '#A855F7',
    orbitRadius: 2.3,
    orbitSpeed: -0.28,
    orbitPhase: (Math.PI * 10) / 6,
    orbitTilt: -0.42,
    schematicY: -1.3,
    schematicRadius: 1.7,
    details: 'ChromaDB • Pinecone • MongoDB Atlas',
    techStack: 'Cosine Similarity • Document Indexing',
  },
];

const THEMES = [
  { id: 'cyan', name: 'QUANTUM CYAN', coreColor: 0x38bdf8, rimColor: 0x00f0ff, hex: '#38BDF8' },
  { id: 'matrix', name: 'MATRIX EMERALD', coreColor: 0x10b981, rimColor: 0x00ff88, hex: '#10B981' },
  { id: 'amber', name: 'SOLAR COMPUTE', coreColor: 0xf59e0b, rimColor: 0xffaa00, hex: '#F59E0B' },
  { id: 'violet', name: 'NEURAL VIOLET', coreColor: 0xa855f7, rimColor: 0xc084fc, hex: '#A855F7' },
];

export function HeroTechNexus3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { playPop, playWhoosh, playClick } = useTactileSound();

  const [isOverclocked, setIsOverclocked] = useState(false);
  const [isSchematic, setIsSchematic] = useState(false);
  const [themeIdx, setThemeIdx] = useState(0);
  const [soundActive, setSoundActive] = useState(false);
  const [selectedNode, setSelectedNode] = useState<TechNodeData | null>(null);
  const [fps, setFps] = useState(60);

  const isSchematicRef = useRef(false);
  isSchematicRef.current = isSchematic;

  const currentThemeRef = useRef(THEMES[themeIdx]);
  currentThemeRef.current = THEMES[themeIdx];

  const overclockRef = useRef(false);
  const triggerPulseRef = useRef<(() => void) | null>(null);
  const resetCameraRef = useRef<(() => void) | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthFilterRef = useRef<BiquadFilterNode | null>(null);
  const synthGainRef = useRef<GainNode | null>(null);

  const toggleSound = useCallback(() => {
    if (!soundActive) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(55, ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);
        filter.Q.setValueAtTime(4, ctx.currentTime);

        gain.gain.setValueAtTime(0.04, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        synthFilterRef.current = filter;
        synthGainRef.current = gain;
        setSoundActive(true);
        playClick();
      } catch {
        // Audio policy
      }
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setSoundActive(false);
      playClick();
    }
  }, [soundActive, playClick]);

  const handlePulse = useCallback(() => {
    playWhoosh();
    setIsOverclocked(true);
    overclockRef.current = true;

    if (synthFilterRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      synthFilterRef.current.frequency.cancelScheduledValues(now);
      synthFilterRef.current.frequency.setValueAtTime(1400, now);
      synthFilterRef.current.frequency.exponentialRampToValueAtTime(320, now + 1.6);
    }

    if (triggerPulseRef.current) {
      triggerPulseRef.current();
    }
    setTimeout(() => {
      setIsOverclocked(false);
      overclockRef.current = false;
    }, 1900);
  }, [playWhoosh]);

  const handleNextTheme = useCallback(() => {
    playPop();
    setThemeIdx((prev) => (prev + 1) % THEMES.length);
  }, [playPop]);

  const handleToggleSchematic = useCallback(() => {
    playClick();
    setIsSchematic((prev) => !prev);
  }, [playClick]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 480;
    let height = container.clientHeight || 340;

    // ─── 1. Scene, Camera, Renderer ──────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.8);

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

    // ─── 3. Lighting with Dynamic Theme Response ─────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0xffffff, 3.4, 14);
    coreLight.position.set(0, 0, 0);
    masterPivot.add(coreLight);

    const rimLight1 = new THREE.DirectionalLight(0x38bdf8, 1.5);
    rimLight1.position.set(4, 5, 3);
    scene.add(rimLight1);

    const rimLight2 = new THREE.DirectionalLight(0xa855f7, 1.2);
    rimLight2.position.set(-4, -4, 2);
    scene.add(rimLight2);

    // ─── 4. Holographic Floor Grid & Radar Sweep ──────────────────────
    const gridHelper = new THREE.PolarGridHelper(3.4, 16, 8, 64, 0x3f3f46, 0x18181b);
    gridHelper.position.y = -2.1;
    masterPivot.add(gridHelper);

    const radarGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -2.08, 0),
      new THREE.Vector3(3.4, -2.08, 0),
    ]);
    const radarMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
    });
    const radarLine = new THREE.Line(radarGeo, radarMat);
    masterPivot.add(radarLine);

    // ─── 5. Schematic Architectural Tier Plates (Blueprint Mode) ─────
    const schematicTiersGroup = new THREE.Group();
    schematicTiersGroup.visible = false;
    masterPivot.add(schematicTiersGroup);

    const tierHeights = [1.4, 0.5, -0.5, -1.3];
    tierHeights.forEach((th) => {
      const tierGrid = new THREE.GridHelper(3.0, 10, 0x71717a, 0x27272a);
      tierGrid.position.y = th;
      (tierGrid.material as THREE.Material).transparent = true;
      (tierGrid.material as THREE.Material).opacity = 0.4;
      schematicTiersGroup.add(tierGrid);
    });

    // ─── 6. Central Quantum Core Cluster ─────────────────────────────
    const coreGroup = new THREE.Group();
    masterPivot.add(coreGroup);

    // 6.1 Hyper-speed counter-rotating inner octahedron
    const innerOctGeo = new THREE.OctahedronGeometry(0.28, 0);
    const innerOctMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
    });
    const innerOctMesh = new THREE.Mesh(innerOctGeo, innerOctMat);
    coreGroup.add(innerOctMesh);

    // 6.2 Inner energetic seed
    const seedGeo = new THREE.IcosahedronGeometry(0.44, 2);
    const seedMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const seedMesh = new THREE.Mesh(seedGeo, seedMat);
    coreGroup.add(seedMesh);

    // 6.3 Middle wireframe crystalline cage
    const midCageGeo = new THREE.IcosahedronGeometry(0.74, 1);
    const midCageMat = new THREE.MeshStandardMaterial({
      color: 0xe0e7ff,
      wireframe: true,
      emissive: 0x818cf8,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.9,
    });
    const midCageMesh = new THREE.Mesh(midCageGeo, midCageMat);
    coreGroup.add(midCageMesh);

    // 6.4 Outer faceted shell
    const outerGeo = new THREE.DodecahedronGeometry(1.02, 0);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.38,
      roughness: 0.1,
      metalness: 0.8,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerMesh);

    // ─── 7. Sweeping Vertical Holographic Laser Scanner Ring ──────────
    const scannerRingGeo = new THREE.TorusGeometry(2.5, 0.009, 16, 90);
    const scannerRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const scannerRing = new THREE.Mesh(scannerRingGeo, scannerRingMat);
    scannerRing.rotation.x = Math.PI / 2;
    masterPivot.add(scannerRing);

    // ─── 8. Vertical Double-Helix Quantum Data Stream (DNA of Compute) ─
    const helixCount = 60;
    const helixGeo = new THREE.BufferGeometry();
    const helixPos = new Float32Array(helixCount * 3);
    const helixCol = new Float32Array(helixCount * 3);

    for (let i = 0; i < helixCount; i++) {
      helixPos[i * 3] = 0;
      helixPos[i * 3 + 1] = 0;
      helixPos[i * 3 + 2] = 0;
      const strand = i % 2 === 0 ? 0 : 1;
      helixCol[i * 3] = strand === 0 ? 1 : 0.2;
      helixCol[i * 3 + 1] = strand === 0 ? 1 : 0.8;
      helixCol[i * 3 + 2] = 1;
    }
    helixGeo.setAttribute('position', new THREE.BufferAttribute(helixPos, 3));
    helixGeo.setAttribute('color', new THREE.BufferAttribute(helixCol, 3));

    const helixMat = new THREE.PointsMaterial({
      size: 0.038,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const helixStream = new THREE.Points(helixGeo, helixMat);
    masterPivot.add(helixStream);

    // ─── 9. Floating Digital Data Ring (Micro Bits Orbiting Core) ─────
    const bitCount = 52;
    const bitInstancedGeo = new THREE.BoxGeometry(0.035, 0.035, 0.035);
    const bitInstancedMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
    });
    const bitMesh = new THREE.InstancedMesh(bitInstancedGeo, bitInstancedMat, bitCount);
    const dummy = new THREE.Object3D();
    masterPivot.add(bitMesh);

    // ─── 10. Gyroscopic Gimbal Orbital Rings ──────────────────────────
    const ringMatBase = {
      color: 0xffffff,
      transparent: true,
      roughness: 0.3,
      metalness: 0.85,
    };

    const ring1Geo = new THREE.TorusGeometry(1.5, 0.015, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({ ...ringMatBase, opacity: 0.4 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    masterPivot.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(1.88, 0.013, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({ ...ringMatBase, opacity: 0.3, color: 0xd4d4d8 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 6;
    masterPivot.add(ring2);

    const ring3Geo = new THREE.TorusGeometry(2.38, 0.011, 16, 100);
    const ring3Mat = new THREE.MeshStandardMaterial({ ...ringMatBase, opacity: 0.25, color: 0xa1a1aa });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = -Math.PI / 4;
    ring3.rotation.z = Math.PI / 3;
    masterPivot.add(ring3);

    // ─── 11. Orbital Tech Nodes with Dynamic Plasma Lightning Arcs ───
    const SEGMENTS_PER_LINE = 20;

    interface LiveNodeMesh {
      data: TechNodeData;
      pivot: THREE.Group;
      nodeMesh: THREE.Mesh;
      haloMesh: THREE.Mesh;
      line: THREE.Line;
      packet: THREE.Mesh;
      packetProgress: number;
      currentPos: THREE.Vector3;
    }

    const liveNodes: LiveNodeMesh[] = [];
    const interactiveMeshes: THREE.Mesh[] = [];

    TECH_NODES.forEach((nodeData) => {
      const nodePivot = new THREE.Group();
      masterPivot.add(nodePivot);

      const nGeo = new THREE.SphereGeometry(0.14, 24, 24);
      const nMat = new THREE.MeshStandardMaterial({
        color: nodeData.color,
        emissive: nodeData.color,
        emissiveIntensity: 0.9,
        roughness: 0.2,
        metalness: 0.85,
      });
      const nodeMesh = new THREE.Mesh(nGeo, nMat);
      nodeMesh.userData = { nodeData };
      nodePivot.add(nodeMesh);
      interactiveMeshes.push(nodeMesh);

      const haloGeo = new THREE.RingGeometry(0.19, 0.24, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: nodeData.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.55,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      nodePivot.add(haloMesh);

      // Multi-segment BufferGeometry for dynamic sine plasma lightning
      const points = [];
      for (let p = 0; p < SEGMENTS_PER_LINE; p++) {
        points.push(new THREE.Vector3(0, 0, 0));
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: nodeData.color,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      masterPivot.add(line);

      const packetGeo = new THREE.SphereGeometry(0.045, 12, 12);
      const packetMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
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
        currentPos: new THREE.Vector3(),
      });
    });

    // ─── 12. Quantum Particle Swarm with Gravitational Attractor ─────
    const particleCount = 260;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pInitialPos = new Float32Array(particleCount * 3);
    const pVel = new Float32Array(particleCount * 3);
    const pCol = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.3 + Math.random() * 2.7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const px = radius * Math.sin(phi) * Math.cos(theta);
      const py = radius * Math.sin(phi) * Math.sin(theta);
      const pz = radius * Math.cos(phi);

      pPos[i * 3] = px;
      pPos[i * 3 + 1] = py;
      pPos[i * 3 + 2] = pz;

      pInitialPos[i * 3] = px;
      pInitialPos[i * 3 + 1] = py;
      pInitialPos[i * 3 + 2] = pz;

      pVel[i * 3] = 0;
      pVel[i * 3 + 1] = 0;
      pVel[i * 3 + 2] = 0;

      const intensity = 0.45 + Math.random() * 0.55;
      pCol[i * 3] = intensity;
      pCol[i * 3 + 1] = intensity;
      pCol[i * 3 + 2] = intensity * 1.15;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.028,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    masterPivot.add(particles);

    // ─── 13. Dual Shockwave Rings ────────────────────────────────────
    const shockwaveGeo1 = new THREE.RingGeometry(0.1, 0.16, 64);
    const shockwaveMat1 = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const shockwave1 = new THREE.Mesh(shockwaveGeo1, shockwaveMat1);
    masterPivot.add(shockwave1);

    const shockwaveGeo2 = new THREE.RingGeometry(0.12, 0.2, 64);
    const shockwaveMat2 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const shockwave2 = new THREE.Mesh(shockwaveGeo2, shockwaveMat2);
    shockwave2.rotation.x = Math.PI / 2;
    masterPivot.add(shockwave2);

    let shockwaveActive = false;
    let shockwaveScale = 0.1;
    let shockwaveOpacity = 0;
    let cameraRecoil = 0;

    triggerPulseRef.current = () => {
      shockwaveActive = true;
      shockwaveScale = 0.1;
      shockwaveOpacity = 1;
      cameraRecoil = 0.42; // Kinetic recoil on impulse!
    };

    // ─── 14. Controls: Smooth Drag, Attractor, Zoom ──────────────────
    let isMouseDown = false;
    let prevMousePos = { x: 0, y: 0 };
    const targetRotation = { x: 0.2, y: 0.4 };
    const currentRotation = { x: 0.2, y: 0.4 };
    let targetZoom = 5.8;
    let currentZoom = 5.8;

    const mouseRay = new THREE.Vector2(-1000, -1000);
    const raycaster = new THREE.Raycaster();
    const mouse3DPoint = new THREE.Vector3(0, 0, 0);

    resetCameraRef.current = () => {
      targetRotation.x = 0.2;
      targetRotation.y = 0.4;
      targetZoom = 5.8;
      setSelectedNode(null);
    };

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      mouseRay.x = (clientX / rect.width) * 2 - 1;
      mouseRay.y = -(clientY / rect.height) * 2 + 1;

      mouse3DPoint.set(mouseRay.x * 2.8, mouseRay.y * 2.0, 0.8);

      if (isMouseDown) {
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;
        targetRotation.y += deltaX * 0.008;
        targetRotation.x += deltaY * 0.008;
        prevMousePos = { x: e.clientX, y: e.clientY };

        if (synthFilterRef.current && audioCtxRef.current) {
          const dragSpeed = Math.hypot(deltaX, deltaY);
          const freq = Math.min(300 + dragSpeed * 40, 1600);
          synthFilterRef.current.frequency.setTargetAtTime(freq, audioCtxRef.current.currentTime, 0.05);
        }
      } else {
        targetRotation.y = mouseRay.x * 0.45;
        targetRotation.x = -mouseRay.y * 0.35 + 0.15;
      }
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onClick = () => {
      raycaster.setFromCamera(mouseRay, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        const clickedData = intersects[0].object.userData.nodeData as TechNodeData;
        if (clickedData) {
          playPop();
          setSelectedNode((prev) => (prev?.id === clickedData.id ? null : clickedData));
        }
      } else {
        setSelectedNode(null);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetZoom = Math.min(Math.max(targetZoom + e.deltaY * 0.003, 3.6), 7.8);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isMouseDown = true;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isMouseDown && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - prevMousePos.x;
        const deltaY = e.touches[0].clientY - prevMousePos.y;
        targetRotation.y += deltaX * 0.01;
        targetRotation.x += deltaY * 0.01;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchEnd = () => {
      isMouseDown = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('click', onClick);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // ─── 15. Resize Observer ─────────────────────────────────────────
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

    // ─── 16. Animation Loop (Locked 60FPS) ───────────────────────────
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let frameCount = 0;
    let lastTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const speedMultiplier = overclockRef.current ? 2.8 : 1.0;

      // FPS tracking
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }

      // Camera recoil decay and zoom lerp
      cameraRecoil *= 0.91;
      currentZoom += (targetZoom + cameraRecoil - currentZoom) * 0.08;
      camera.position.z = currentZoom;

      // Master rotation
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.06;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.06;
      masterPivot.rotation.x = currentRotation.x;
      masterPivot.rotation.y = currentRotation.y + elapsedTime * 0.08 * speedMultiplier;

      // Theme color morphing
      const targetTheme = currentThemeRef.current;
      const themeColor = new THREE.Color(targetTheme.coreColor);
      rimLight1.color.lerp(themeColor, 0.05);
      shockwaveMat2.color.lerp(themeColor, 0.05);
      midCageMat.emissive.lerp(themeColor, 0.05);
      scannerRingMat.color.lerp(themeColor, 0.05);

      // Radar scan rotation
      radarLine.rotation.y = elapsedTime * 1.2 * speedMultiplier;

      // Sweeping vertical holographic laser scanner ring
      scannerRing.position.y = Math.sin(elapsedTime * 1.4) * 1.85;

      // Schematic Blueprint mode transition
      const schematicActive = isSchematicRef.current;
      schematicTiersGroup.visible = schematicActive;

      // ── NEW ANIMATION: Heartbeat Rhythmic Sentient Pulse ───────────
      const heartPulse =
        Math.pow(Math.sin(elapsedTime * 3.0), 12) * 0.14 +
        Math.pow(Math.sin(elapsedTime * 3.0 - 0.35), 16) * 0.07;
      seedMesh.scale.setScalar(1.0 + heartPulse);

      // Inner hyper-speed octahedron spin
      innerOctMesh.rotation.x = -elapsedTime * 1.4 * speedMultiplier;
      innerOctMesh.rotation.y = elapsedTime * 1.8 * speedMultiplier;

      // Core rotation
      midCageMesh.rotation.x = elapsedTime * 0.45 * speedMultiplier;
      midCageMesh.rotation.y = elapsedTime * 0.65 * speedMultiplier;
      outerMesh.rotation.y = -elapsedTime * 0.3 * speedMultiplier;
      outerMesh.rotation.z = elapsedTime * 0.28 * speedMultiplier;

      // Gimbal Rings
      const targetRing1Y = schematicActive ? 1.4 : 0;
      const targetRing2Y = schematicActive ? 0.0 : 0;
      const targetRing3Y = schematicActive ? -1.3 : 0;

      ring1.position.y += (targetRing1Y - ring1.position.y) * 0.08;
      ring2.position.y += (targetRing2Y - ring2.position.y) * 0.08;
      ring3.position.y += (targetRing3Y - ring3.position.y) * 0.08;

      ring1.rotation.z = elapsedTime * 0.22 * speedMultiplier;
      ring2.rotation.y += 0.005 * speedMultiplier;
      ring3.rotation.z -= 0.006 * speedMultiplier;

      // ── NEW ANIMATION: Vertical Double Helix Quantum Data Strand ───
      const helixPositions = helixGeo.attributes.position as THREE.BufferAttribute;
      const hPos = helixPositions.array as Float32Array;
      for (let i = 0; i < helixCount; i++) {
        const strand = i % 2 === 0 ? 0 : Math.PI;
        const normY = ((i / helixCount) * 4.4 - 2.2 + ((elapsedTime * 0.4) % 4.4) - 2.2);
        const yWrapped = ((normY + 2.2) % 4.4) - 2.2;
        const angle = yWrapped * 2.8 + strand + elapsedTime * 1.2 * speedMultiplier;
        const r = 0.55 + Math.sin(yWrapped * 2) * 0.12;

        hPos[i * 3] = Math.cos(angle) * r;
        hPos[i * 3 + 1] = yWrapped;
        hPos[i * 3 + 2] = Math.sin(angle) * r;
      }
      helixPositions.needsUpdate = true;

      // Particle physics: Gravitational attractor on mouse hold
      const pPositions = pGeo.attributes.position as THREE.BufferAttribute;
      const posArray = pPositions.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        let px = posArray[idx];
        let py = posArray[idx + 1];
        let pz = posArray[idx + 2];

        if (isMouseDown) {
          const dx = mouse3DPoint.x - px;
          const dy = mouse3DPoint.y - py;
          const dz = mouse3DPoint.z - pz;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.1;

          const force = (0.015 / (dist * dist)) * speedMultiplier;
          pVel[idx] += dx * force;
          pVel[idx + 1] += dy * force;
          pVel[idx + 2] += dz * force;

          pVel[idx] *= 0.94;
          pVel[idx + 1] *= 0.94;
          pVel[idx + 2] *= 0.94;

          posArray[idx] += pVel[idx];
          posArray[idx + 1] += pVel[idx + 1];
          posArray[idx + 2] += pVel[idx + 2];
        } else {
          const hx = pInitialPos[idx];
          const hy = pInitialPos[idx + 1];
          const hz = pInitialPos[idx + 2];

          posArray[idx] += (hx - px) * 0.04;
          posArray[idx + 1] += (hy - py) * 0.04;
          posArray[idx + 2] += (hz - pz) * 0.04;
        }
      }
      pPositions.needsUpdate = true;
      particles.rotation.y = -elapsedTime * 0.035;

      // Floating digital bits ring
      for (let i = 0; i < bitCount; i++) {
        const bitAngle = (i / bitCount) * Math.PI * 2 + elapsedTime * 0.25 * speedMultiplier;
        const bitRad = 1.25 + Math.sin(bitAngle * 3 + elapsedTime) * 0.08;
        const bx = Math.cos(bitAngle) * bitRad;
        const bz = Math.sin(bitAngle) * bitRad;
        const by = Math.sin(bitAngle * 2 + elapsedTime * 1.5) * 0.25;

        dummy.position.set(bx, by, bz);
        dummy.rotation.set(elapsedTime * 2 + i, elapsedTime + i, 0);
        dummy.updateMatrix();
        bitMesh.setMatrixAt(i, dummy.matrix);
      }
      bitMesh.instanceMatrix.needsUpdate = true;

      // Dual shockwaves
      if (shockwaveActive) {
        shockwaveScale += 0.085;
        shockwaveOpacity -= 0.032;

        shockwave1.scale.setScalar(shockwaveScale);
        shockwaveMat1.opacity = Math.max(0, shockwaveOpacity);

        shockwave2.scale.setScalar(shockwaveScale * 1.15);
        shockwaveMat2.opacity = Math.max(0, shockwaveOpacity * 0.8);

        if (shockwaveOpacity <= 0) {
          shockwaveActive = false;
        }
      }

      // Update Tech Nodes & ── NEW ANIMATION: Sinusoidal Plasma Lightning Tendrils ──
      liveNodes.forEach((live, idx) => {
        const { data, pivot, haloMesh, line, packet, currentPos } = live;

        let targetX = 0;
        let targetY = 0;
        let targetZ = 0;

        if (schematicActive) {
          const tierAngle = data.orbitPhase + elapsedTime * 0.15;
          targetX = Math.cos(tierAngle) * data.schematicRadius;
          targetZ = Math.sin(tierAngle) * data.schematicRadius;
          targetY = data.schematicY;
        } else {
          const angle = data.orbitPhase + elapsedTime * data.orbitSpeed * speedMultiplier;
          targetX = Math.cos(angle) * data.orbitRadius;
          targetZ = Math.sin(angle) * data.orbitRadius;
          targetY = Math.sin(angle * 1.5 + data.orbitTilt) * 0.52;
        }

        currentPos.x += (targetX - currentPos.x) * 0.08;
        currentPos.y += (targetY - currentPos.y) * 0.08;
        currentPos.z += (targetZ - currentPos.z) * 0.08;

        pivot.position.copy(currentPos);
        haloMesh.lookAt(camera.position);

        const haloScale = 1.0 + Math.sin(elapsedTime * 4 + idx) * 0.18;
        haloMesh.scale.setScalar(haloScale);

        // Dynamic electric plasma arc wave update
        const linePositions = (line.geometry as THREE.BufferGeometry).attributes.position as THREE.BufferAttribute;
        for (let seg = 0; seg < SEGMENTS_PER_LINE; seg++) {
          const frac = seg / (SEGMENTS_PER_LINE - 1);
          const bx = currentPos.x * frac;
          const by = currentPos.y * frac;
          const bz = currentPos.z * frac;

          // Envelope: 0 at ends, peak in center
          const envelope = Math.sin(frac * Math.PI);
          const jitterAmp = (overclockRef.current ? 0.12 : 0.04) * envelope;
          const waveX = Math.sin(elapsedTime * 14 + idx * 2.5 + seg * 0.7) * jitterAmp;
          const waveY = Math.cos(elapsedTime * 12 + idx * 3.1 + seg * 0.8) * jitterAmp;

          linePositions.setXYZ(seg, bx + waveX, by + waveY, bz);
        }
        linePositions.needsUpdate = true;

        // Packet travel
        live.packetProgress = (live.packetProgress + 0.015 * speedMultiplier) % 1;
        const px = currentPos.x * (1 - live.packetProgress);
        const py = currentPos.y * (1 - live.packetProgress);
        const pz = currentPos.z * (1 - live.packetProgress);
        packet.position.set(px, py, pz);
      });

      renderer.render(scene, camera);
    };

    animate();

    // ─── 17. Cleanup ─────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('click', onClick);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between select-none overflow-hidden">
      {/* 3D WebGL Canvas Mount */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Futuristic Cyberpunk Top Control Deck */}
      <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between pointer-events-none">
        {/* Left Status Pill */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/70 border border-white/10 backdrop-blur-md">
          <span
            className={`w-2 h-2 rounded-full ${isOverclocked ? 'animate-ping' : 'animate-pulse'}`}
            style={{ backgroundColor: THEMES[themeIdx].hex }}
          />
          <span className="font-mono text-[9px] sm:text-[10px] tracking-wider text-white font-bold uppercase">
            {isOverclocked ? 'OVERCLOCK // MAX' : isSchematic ? 'BLUEPRINT // SCHEMATIC' : 'NEURAL NEXUS // 3D'}
          </span>
        </div>

        {/* Right Action Icons Deck */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {/* FPS Counter */}
          <div className="hidden xs:flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 border border-white/10 backdrop-blur-md font-mono text-[9px] sm:text-[10px] text-white/60">
            <Activity className="w-3 h-3 text-[#1CD399]" />
            <span>{fps} FPS</span>
          </div>

          {/* Toggle 3D Schematic Mode */}
          <button
            onClick={handleToggleSchematic}
            className={`px-2 py-1 rounded-full font-mono text-[9.5px] font-bold flex items-center gap-1 border transition-all duration-300 active:scale-95 backdrop-blur-md ${
              isSchematic
                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.7)]'
                : 'bg-black/50 text-white/70 border-white/10 hover:border-white/30 hover:text-white'
            }`}
            title="Toggle Exploded Architectural Schematic Mode"
          >
            <Layers className="w-3 h-3" />
            <span className="hidden sm:inline">{isSchematic ? 'SPHERE' : 'SCHEMATIC'}</span>
          </button>

          {/* Theme Color Cycle Button */}
          <button
            onClick={handleNextTheme}
            className="p-1.5 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 hover:border-white/40 text-white/70 hover:text-white transition-all backdrop-blur-md active:scale-95"
            title={`Cycle Energy State: ${THEMES[themeIdx].name}`}
          >
            <Palette className="w-3.5 h-3.5" style={{ color: THEMES[themeIdx].hex }} />
          </button>

          {/* Synth Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded-full border transition-all backdrop-blur-md active:scale-95 ${
              soundActive
                ? 'bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.6)]'
                : 'bg-black/50 text-white/60 border-white/10 hover:border-white/30 hover:text-white'
            }`}
            title={soundActive ? 'Mute Cyber Synth' : 'Enable Realtime Cyber Synth'}
          >
            {soundActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Reset View */}
          <button
            onClick={() => {
              if (resetCameraRef.current) resetCameraRef.current();
            }}
            className="p-1.5 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 hover:border-white/30 text-white/60 hover:text-white transition-all backdrop-blur-md active:scale-95"
            title="Reset Camera Position"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          {/* Overclock Pulse */}
          <button
            onClick={handlePulse}
            className={`px-2.5 py-1 rounded-full font-mono text-[9.5px] sm:text-[10px] font-bold flex items-center gap-1 border transition-all duration-300 active:scale-95 backdrop-blur-md ${
              isOverclocked
                ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.9)]'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/25 hover:border-white/50'
            }`}
            title="Trigger Quantum Pulse Shockwave"
          >
            <Zap className={`w-3 h-3 ${isOverclocked ? 'fill-black' : 'fill-white'}`} />
            <span>PULSE</span>
          </button>
        </div>
      </div>

      {/* Floating Holographic 3D Node Inspector */}
      <div className="relative z-10 px-4 pointer-events-none flex justify-center pb-3">
        {selectedNode ? (
          <div className="pointer-events-auto px-4 py-2.5 rounded-2xl border border-white/25 bg-black/90 backdrop-blur-2xl shadow-[0_15px_45px_rgba(0,0,0,0.9)] flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200 max-w-sm">
            <span
              className="w-3 h-3 rounded-full shrink-0 shadow-[0_0_12px_currentColor]"
              style={{ backgroundColor: selectedNode.hex, color: selectedNode.hex }}
            />
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-extrabold text-white block leading-tight font-display tracking-tight">
                  {selectedNode.name}
                </span>
                <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white/70 border border-white/15">
                  {selectedNode.category}
                </span>
              </div>
              <span className="text-[9.5px] font-mono text-white/80 block leading-tight">
                {selectedNode.details}
              </span>
              <span className="text-[8.5px] font-mono text-white/50 block">
                {selectedNode.techStack}
              </span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-white/40 hover:text-white text-xs ml-1 p-1"
              aria-label="Close Inspector"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="opacity-0 transition-opacity duration-300">
            <span className="text-xs">&nbsp;</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default HeroTechNexus3D;
