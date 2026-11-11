'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Zap, RotateCcw, Activity } from 'lucide-react';
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
    orbitSpeed: 0.32,
    orbitPhase: 0,
    orbitTilt: 0.25,
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
    orbitSpeed: 0.26,
    orbitPhase: (Math.PI * 2) / 6,
    orbitTilt: -0.28,
    details: 'LeetCode Knight (Rating 1951) • Top 3%',
    techStack: 'Graph Algorithms • Dynamic Programming',
  },
  {
    id: 'systems',
    name: 'Full-Stack Web',
    category: 'Spatial & Web UI',
    color: 0x3178c6,
    hex: '#3178C6',
    orbitRadius: 2.05,
    orbitSpeed: 0.3,
    orbitPhase: (Math.PI * 4) / 6,
    orbitTilt: 0.38,
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
    orbitSpeed: -0.28,
    orbitPhase: (Math.PI * 6) / 6,
    orbitTilt: -0.2,
    details: 'FastAPI • Node.js • RESTful Architecture',
    techStack: 'Background Workers • Python • Express',
  },
  {
    id: 'realtime',
    name: 'Realtime State',
    category: 'Workflows & Sync',
    color: 0xff5722,
    hex: '#FF5722',
    orbitRadius: 2.18,
    orbitSpeed: 0.24,
    orbitPhase: (Math.PI * 8) / 6,
    orbitTilt: 0.32,
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
    orbitSpeed: -0.24,
    orbitPhase: (Math.PI * 10) / 6,
    orbitTilt: -0.36,
    details: 'ChromaDB • Pinecone • MongoDB Atlas',
    techStack: 'Cosine Similarity • Document Indexing',
  },
];

export function HeroTechNexus3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { playPop, playWhoosh } = useTactileSound();

  const [isOverclocked, setIsOverclocked] = useState(false);
  const [activeNode, setActiveNode] = useState<TechNodeData | null>(null);
  const [fps, setFps] = useState(60);

  const overclockRef = useRef(false);
  const triggerPulseRef = useRef<(() => void) | null>(null);
  const resetCameraRef = useRef<(() => void) | null>(null);

  // Trigger smooth pulse shockwave
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
    }, 1600);
  }, [playWhoosh]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 480;
    let height = container.clientHeight || 340;

    // ─── 1. Scene, Camera, Renderer ──────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c0c0e, 0.08);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
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

    // ─── 3. Studio Lighting ──────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0xffffff, 3.0, 14);
    coreLight.position.set(0, 0, 0);
    masterPivot.add(coreLight);

    const rimLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    rimLight1.position.set(4, 5, 3);
    scene.add(rimLight1);

    const rimLight2 = new THREE.DirectionalLight(0x71717a, 0.8);
    rimLight2.position.set(-4, -4, 2);
    scene.add(rimLight2);

    // ─── 4. Subtle Floor Horizon Grid ────────────────────────────────
    const gridHelper = new THREE.PolarGridHelper(3.4, 16, 6, 64, 0x27272a, 0x18181b);
    gridHelper.position.y = -2.1;
    masterPivot.add(gridHelper);

    // ─── 5. Central Quantum Core ─────────────────────────────────────
    const coreGroup = new THREE.Group();
    masterPivot.add(coreGroup);

    // 5.1 Inner glowing solid energy sphere
    const seedGeo = new THREE.IcosahedronGeometry(0.42, 2);
    const seedMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const seedMesh = new THREE.Mesh(seedGeo, seedMat);
    coreGroup.add(seedMesh);

    // 5.2 Middle wireframe crystalline cage
    const midCageGeo = new THREE.IcosahedronGeometry(0.72, 1);
    const midCageMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      wireframe: true,
      emissive: 0xd4d4d8,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.9,
    });
    const midCageMesh = new THREE.Mesh(midCageGeo, midCageMat);
    coreGroup.add(midCageMesh);

    // 5.3 Outer faceted geometric shell
    const outerGeo = new THREE.DodecahedronGeometry(0.98, 0);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.32,
      roughness: 0.1,
      metalness: 0.8,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerMesh);

    // ─── 6. Concentric Gimbal Gyroscope Rings ────────────────────────
    const ringMatBase = {
      color: 0xffffff,
      transparent: true,
      roughness: 0.3,
      metalness: 0.9,
    };

    const ring1Geo = new THREE.TorusGeometry(1.48, 0.012, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({ ...ringMatBase, opacity: 0.35 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    masterPivot.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(1.86, 0.011, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({ ...ringMatBase, opacity: 0.26, color: 0xd4d4d8 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 6;
    masterPivot.add(ring2);

    const ring3Geo = new THREE.TorusGeometry(2.36, 0.009, 16, 100);
    const ring3Mat = new THREE.MeshStandardMaterial({ ...ringMatBase, opacity: 0.2, color: 0xa1a1aa });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = -Math.PI / 4;
    ring3.rotation.z = Math.PI / 3;
    masterPivot.add(ring3);

    // ─── 7. Orbital Tech Nodes & Synaptic Laser Lines ────────────────
    const SEGMENTS_PER_LINE = 16;

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

      const nGeo = new THREE.SphereGeometry(0.13, 24, 24);
      const nMat = new THREE.MeshStandardMaterial({
        color: nodeData.color,
        emissive: nodeData.color,
        emissiveIntensity: 0.85,
        roughness: 0.2,
        metalness: 0.85,
      });
      const nodeMesh = new THREE.Mesh(nGeo, nMat);
      nodeMesh.userData = { nodeData };
      nodePivot.add(nodeMesh);
      interactiveMeshes.push(nodeMesh);

      // Delicate halo ring
      const haloGeo = new THREE.RingGeometry(0.18, 0.22, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: nodeData.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      nodePivot.add(haloMesh);

      // Connecting laser beam
      const points = [];
      for (let p = 0; p < SEGMENTS_PER_LINE; p++) {
        points.push(new THREE.Vector3(0, 0, 0));
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: nodeData.color,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      masterPivot.add(line);

      // Floating data packet
      const packetGeo = new THREE.SphereGeometry(0.04, 12, 12);
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

    // ─── 8. Ambient Starlight Dust Particles ─────────────────────────
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

      const intensity = 0.5 + Math.random() * 0.5;
      pCol[i * 3] = intensity;
      pCol[i * 3 + 1] = intensity;
      pCol[i * 3 + 2] = intensity;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.024,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    masterPivot.add(particles);

    // ─── 9. Refined Pulse Shockwave ──────────────────────────────────
    const shockwaveGeo = new THREE.RingGeometry(0.1, 0.15, 64);
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const shockwave = new THREE.Mesh(shockwaveGeo, shockwaveMat);
    masterPivot.add(shockwave);

    let shockwaveActive = false;
    let shockwaveScale = 0.1;
    let shockwaveOpacity = 0;
    let cameraRecoil = 0;

    triggerPulseRef.current = () => {
      shockwaveActive = true;
      shockwaveScale = 0.1;
      shockwaveOpacity = 0.85;
      cameraRecoil = 0.35;
    };

    // ─── 10. Inertial Momentum & Drag Physics ────────────────────────
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let velocityX = 0;
    let velocityY = 0;
    const targetRotation = { x: 0.2, y: 0.4 };
    const currentRotation = { x: 0.2, y: 0.4 };
    let targetZoom = 5.8;
    let currentZoom = 5.8;

    const mouseRay = new THREE.Vector2(-1000, -1000);
    const raycaster = new THREE.Raycaster();
    let currentlyHoveredId: string | null = null;

    resetCameraRef.current = () => {
      targetRotation.x = 0.2;
      targetRotation.y = 0.4;
      targetZoom = 5.8;
      velocityX = 0;
      velocityY = 0;
      setActiveNode(null);
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
      velocityX = 0;
      velocityY = 0;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      mouseRay.x = (clientX / rect.width) * 2 - 1;
      mouseRay.y = -(clientY / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;

        velocityX = deltaX * 0.006;
        velocityY = deltaY * 0.006;

        targetRotation.y += velocityX;
        targetRotation.x += velocityY;
        prevMousePos = { x: e.clientX, y: e.clientY };
      } else {
        // Subtle magnetic orientation toward mouse position
        targetRotation.y = mouseRay.x * 0.35;
        targetRotation.x = -mouseRay.y * 0.25 + 0.15;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onClick = () => {
      raycaster.setFromCamera(mouseRay, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        const hitData = intersects[0].object.userData.nodeData as TechNodeData;
        if (hitData) {
          playPop();
          setActiveNode((prev) => (prev?.id === hitData.id ? null : hitData));
        }
      } else {
        handlePulse();
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetZoom = Math.min(Math.max(targetZoom + e.deltaY * 0.003, 3.8), 7.2);
    };

    // Mobile touch controls with inertia
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        velocityX = 0;
        velocityY = 0;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - prevMousePos.x;
        const deltaY = e.touches[0].clientY - prevMousePos.y;

        velocityX = deltaX * 0.008;
        velocityY = deltaY * 0.008;

        targetRotation.y += velocityX;
        targetRotation.x += velocityY;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('click', onClick);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // ─── 11. Resize Observer ─────────────────────────────────────────
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

    // ─── 12. Animation Loop ──────────────────────────────────────────
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let frameCount = 0;
    let lastTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const speedMultiplier = overclockRef.current ? 2.4 : 1.0;

      // Track FPS
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }

      // Smooth inertia decay when dragging stops
      if (!isDragging) {
        targetRotation.y += velocityX;
        targetRotation.x += velocityY;
        velocityX *= 0.94;
        velocityY *= 0.94;
      }

      // Camera recoil decay & zoom lerp
      cameraRecoil *= 0.91;
      currentZoom += (targetZoom + cameraRecoil - currentZoom) * 0.08;
      camera.position.z = currentZoom;

      // Smooth master rotation
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.06;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.06;
      masterPivot.rotation.x = currentRotation.x;
      masterPivot.rotation.y = currentRotation.y + elapsedTime * 0.07 * speedMultiplier;

      // Core calm breathing pulse
      const breath = 1.0 + Math.sin(elapsedTime * 2.0) * 0.05;
      seedMesh.scale.setScalar(breath);
      midCageMesh.rotation.x = elapsedTime * 0.4 * speedMultiplier;
      midCageMesh.rotation.y = elapsedTime * 0.55 * speedMultiplier;
      outerMesh.rotation.y = -elapsedTime * 0.25 * speedMultiplier;
      outerMesh.rotation.z = elapsedTime * 0.22 * speedMultiplier;

      // Gimbal Rings rotation
      ring1.rotation.z = elapsedTime * 0.18 * speedMultiplier;
      ring2.rotation.y += 0.004 * speedMultiplier;
      ring3.rotation.z -= 0.005 * speedMultiplier;

      // Particles ambient drift
      particles.rotation.y = -elapsedTime * 0.025;

      // Pulse shockwave
      if (shockwaveActive) {
        shockwaveScale += 0.08;
        shockwaveOpacity -= 0.035;
        shockwave.scale.setScalar(shockwaveScale);
        shockwaveMat.opacity = Math.max(0, shockwaveOpacity);
        if (shockwaveOpacity <= 0) {
          shockwaveActive = false;
        }
      }

      // Raycaster for interactive hover
      raycaster.setFromCamera(mouseRay, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        const hitData = intersects[0].object.userData.nodeData as TechNodeData;
        if (hitData && hitData.id !== currentlyHoveredId) {
          currentlyHoveredId = hitData.id;
          setActiveNode(hitData);
          playPop();
        }
      } else if (!isDragging && currentlyHoveredId) {
        currentlyHoveredId = null;
        setActiveNode(null);
      }

      // Update tech nodes & synaptic lines
      liveNodes.forEach((live, idx) => {
        const { data, pivot, nodeMesh, haloMesh, line, packet, currentPos } = live;
        const isHovered = currentlyHoveredId === data.id;

        const angle = data.orbitPhase + elapsedTime * data.orbitSpeed * speedMultiplier;
        const targetX = Math.cos(angle) * data.orbitRadius;
        const targetZ = Math.sin(angle) * data.orbitRadius;
        const targetY = Math.sin(angle * 1.5 + data.orbitTilt) * 0.48;

        currentPos.x += (targetX - currentPos.x) * 0.08;
        currentPos.y += (targetY - currentPos.y) * 0.08;
        currentPos.z += (targetZ - currentPos.z) * 0.08;

        pivot.position.copy(currentPos);
        haloMesh.lookAt(camera.position);

        // Scale node gently on hover
        const targetScale = isHovered ? 1.45 : overclockRef.current ? 1.2 : 1.0;
        nodeMesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);

        const haloScale = 1.0 + Math.sin(elapsedTime * 3.5 + idx) * (isHovered ? 0.3 : 0.15);
        haloMesh.scale.setScalar(haloScale);
        (haloMesh.material as THREE.MeshBasicMaterial).opacity = isHovered ? 0.85 : 0.45;

        // Clean sine wave line
        const linePositions = (line.geometry as THREE.BufferGeometry).attributes.position as THREE.BufferAttribute;
        for (let seg = 0; seg < SEGMENTS_PER_LINE; seg++) {
          const frac = seg / (SEGMENTS_PER_LINE - 1);
          const bx = currentPos.x * frac;
          const by = currentPos.y * frac;
          const bz = currentPos.z * frac;

          const envelope = Math.sin(frac * Math.PI);
          const jitter = (overclockRef.current ? 0.08 : 0.025) * envelope;
          const waveX = Math.sin(elapsedTime * 10 + idx * 2 + seg * 0.6) * jitter;
          const waveY = Math.cos(elapsedTime * 8 + idx * 3 + seg * 0.7) * jitter;

          linePositions.setXYZ(seg, bx + waveX, by + waveY, bz);
        }
        linePositions.needsUpdate = true;
        (line.material as THREE.LineBasicMaterial).opacity = isHovered ? 0.75 : 0.35;

        // Packet travel
        live.packetProgress = (live.packetProgress + 0.012 * speedMultiplier) % 1;
        const px = currentPos.x * (1 - live.packetProgress);
        const py = currentPos.y * (1 - live.packetProgress);
        const pz = currentPos.z * (1 - live.packetProgress);
        packet.position.set(px, py, pz);
      });

      renderer.render(scene, camera);
    };

    animate();

    // ─── 13. Cleanup ─────────────────────────────────────────────────
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

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [playPop]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between select-none overflow-hidden group/canvas">
      {/* 3D WebGL Canvas Mount */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Clean Minimalist Top Header (Apple/Linear Style) */}
      <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between pointer-events-none">
        {/* Left Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md">
          <span className={`w-1.5 h-1.5 rounded-full ${isOverclocked ? 'bg-white animate-ping' : 'bg-white animate-pulse'}`} />
          <span className="font-mono text-[9.5px] sm:text-[10px] tracking-wider text-white/90 font-medium uppercase">
            SYSTEM ARCHITECTURE
          </span>
        </div>

        {/* Right Action Icons Deck */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {/* FPS Counter */}
          <div className="hidden xs:flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md font-mono text-[9px] text-white/50">
            <Activity className="w-3 h-3 text-white/70" />
            <span>{fps} FPS</span>
          </div>

          {/* Reset Camera Position */}
          <button
            onClick={() => {
              if (resetCameraRef.current) resetCameraRef.current();
            }}
            className="p-1.5 rounded-full bg-black/40 hover:bg-black/80 border border-white/10 hover:border-white/30 text-white/60 hover:text-white transition-all backdrop-blur-md active:scale-95"
            title="Reset view"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          {/* Overclock Pulse */}
          <button
            onClick={handlePulse}
            className={`px-3 py-1 rounded-full font-mono text-[10px] font-semibold flex items-center gap-1.5 border transition-all duration-300 active:scale-95 backdrop-blur-md ${
              isOverclocked
                ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.7)]'
                : 'bg-white/10 text-white border-white/15 hover:bg-white/20 hover:border-white/40'
            }`}
            title="Trigger pulse"
          >
            <Zap className={`w-3 h-3 ${isOverclocked ? 'fill-black' : 'fill-white'}`} />
            <span>PULSE</span>
          </button>
        </div>
      </div>

      {/* Floating Minimalist Node Tooltip on Hover */}
      <div className="relative z-10 px-4 pointer-events-none flex justify-center pb-3">
        {activeNode ? (
          <div className="px-4 py-2 rounded-xl border border-white/15 bg-black/80 backdrop-blur-xl shadow-xl flex items-center gap-2.5 animate-in fade-in zoom-in-95 duration-150">
            <span
              className="w-2 h-2 rounded-full shrink-0 shadow-[0_0_6px_currentColor]"
              style={{ backgroundColor: activeNode.hex, color: activeNode.hex }}
            />
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white block font-display">
                {activeNode.name}
              </span>
              <span className="text-white/30 font-mono text-xs">•</span>
              <span className="text-[10px] font-mono text-white/60 block">
                {activeNode.details}
              </span>
            </div>
          </div>
        ) : (
          <div className="opacity-0 transition-opacity duration-200">
            <span className="text-xs">&nbsp;</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default HeroTechNexus3D;
