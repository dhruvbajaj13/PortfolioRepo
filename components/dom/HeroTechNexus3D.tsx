'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Zap, Activity, Maximize2, RotateCcw } from 'lucide-react';
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
    orbitRadius: 2.15,
    orbitSpeed: 0.38,
    orbitPhase: 0,
    orbitTilt: 0.28,
    details: 'LangChain • LangGraph • RAG',
  },
  {
    id: 'algorithms',
    name: 'Algorithms',
    category: 'Competitive DSA',
    color: 0xffa116,
    hex: '#FFA116',
    orbitRadius: 2.35,
    orbitSpeed: 0.3,
    orbitPhase: (Math.PI * 2) / 6,
    orbitTilt: -0.32,
    details: 'LeetCode Knight 1951',
  },
  {
    id: 'systems',
    name: 'Full Stack',
    category: 'Web Architecture',
    color: 0x3178c6,
    hex: '#3178C6',
    orbitRadius: 2.05,
    orbitSpeed: 0.35,
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
    orbitRadius: 2.25,
    orbitSpeed: -0.32,
    orbitPhase: (Math.PI * 6) / 6,
    orbitTilt: -0.22,
    details: 'FastAPI • Node.js • REST APIs',
  },
  {
    id: 'realtime',
    name: 'Realtime',
    category: 'State & Workflows',
    color: 0xff5722,
    hex: '#FF5722',
    orbitRadius: 2.18,
    orbitSpeed: 0.28,
    orbitPhase: (Math.PI * 8) / 6,
    orbitTilt: 0.36,
    details: 'Convex • Inngest • WebSockets',
  },
  {
    id: 'data',
    name: 'Vector DB',
    category: 'High-Dim Storage',
    color: 0xa855f7,
    hex: '#A855F7',
    orbitRadius: 2.3,
    orbitSpeed: -0.28,
    orbitPhase: (Math.PI * 10) / 6,
    orbitTilt: -0.42,
    details: 'Pinecone • ChromaDB • MongoDB',
  },
];

export function HeroTechNexus3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { playPop, playWhoosh } = useTactileSound();

  const [isOverclocked, setIsOverclocked] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<TechNodeData | null>(null);
  const [fps, setFps] = useState(60);

  const overclockRef = useRef(false);
  const triggerPulseRef = useRef<(() => void) | null>(null);
  const resetCameraRef = useRef<(() => void) | null>(null);

  // Interaction: Trigger Quantum Core Overclock Burst
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
    }, 1900);
  }, [playWhoosh]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 480;
    let height = container.clientHeight || 340;

    // ─── 1. Scene & Perspective Camera ────────────────────────────────
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

    // ─── 3. Lighting ────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0xffffff, 3.2, 14);
    coreLight.position.set(0, 0, 0);
    masterPivot.add(coreLight);

    const rimLight1 = new THREE.DirectionalLight(0x38bdf8, 1.4);
    rimLight1.position.set(4, 5, 3);
    scene.add(rimLight1);

    const rimLight2 = new THREE.DirectionalLight(0xa855f7, 1.1);
    rimLight2.position.set(-4, -4, 2);
    scene.add(rimLight2);

    // ─── 4. Holographic Floor Grid (Depth perspective) ───────────────
    const gridHelper = new THREE.PolarGridHelper(3.2, 16, 8, 64, 0x3f3f46, 0x18181b);
    gridHelper.position.y = -2.1;
    masterPivot.add(gridHelper);

    // Rotating radar scan line across the floor grid
    const radarGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -2.08, 0),
      new THREE.Vector3(3.2, -2.08, 0),
    ]);
    const radarMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
    });
    const radarLine = new THREE.Line(radarGeo, radarMat);
    masterPivot.add(radarLine);

    // ─── 5. Central Quantum Core Cluster ─────────────────────────────
    const coreGroup = new THREE.Group();
    masterPivot.add(coreGroup);

    // 5.1 Inner glowing energetic seed
    const seedGeo = new THREE.IcosahedronGeometry(0.44, 2);
    const seedMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
    const seedMesh = new THREE.Mesh(seedGeo, seedMat);
    coreGroup.add(seedMesh);

    // 5.2 Middle wireframe crystalline cage with subtle emissive pulse
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

    // 5.3 Outer faceted geometric shell
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

    // ─── 6. Floating Digital Data Ring (Micro Bits Orbiting Core) ─────
    const bitCount = 48;
    const bitInstancedGeo = new THREE.BoxGeometry(0.035, 0.035, 0.035);
    const bitInstancedMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
    });
    const bitMesh = new THREE.InstancedMesh(bitInstancedGeo, bitInstancedMat, bitCount);
    const dummy = new THREE.Object3D();
    masterPivot.add(bitMesh);

    // ─── 7. Gyroscopic Gimbal Orbital Rings ───────────────────────────
    const ringMatBase = {
      color: 0xffffff,
      transparent: true,
      roughness: 0.3,
      metalness: 0.85,
    };

    // Ring 1 — Equatorial
    const ring1Geo = new THREE.TorusGeometry(1.5, 0.015, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      ...ringMatBase,
      opacity: 0.4,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    masterPivot.add(ring1);

    // Ring 2 — Middle Inclined
    const ring2Geo = new THREE.TorusGeometry(1.88, 0.013, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      ...ringMatBase,
      opacity: 0.3,
      color: 0xd4d4d8,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 6;
    masterPivot.add(ring2);

    // Ring 3 — Outer Polar
    const ring3Geo = new THREE.TorusGeometry(2.38, 0.011, 16, 100);
    const ring3Mat = new THREE.MeshStandardMaterial({
      ...ringMatBase,
      opacity: 0.25,
      color: 0xa1a1aa,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = -Math.PI / 4;
    ring3.rotation.z = Math.PI / 3;
    masterPivot.add(ring3);

    // ─── 8. Orbital Tech Nodes with Direct 3D Raycasting ──────────────
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
    const interactiveMeshes: THREE.Mesh[] = [];

    TECH_NODES.forEach((nodeData) => {
      const nodePivot = new THREE.Group();
      masterPivot.add(nodePivot);

      // Node mesh
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

      // Halo ring
      const haloGeo = new THREE.RingGeometry(0.19, 0.24, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: nodeData.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.55,
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
        opacity: 0.32,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      masterPivot.add(line);

      // Traveling data packet
      const packetGeo = new THREE.SphereGeometry(0.045, 12, 12);
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

    // ─── 9. Quantum Ambient Particle Field ───────────────────────────
    const particleCount = 240;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pCol = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.3 + Math.random() * 2.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = radius * Math.cos(phi);

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

    // ─── 10. Dual Overclock Shockwaves ────────────────────────────────
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

    triggerPulseRef.current = () => {
      shockwaveActive = true;
      shockwaveScale = 0.1;
      shockwaveOpacity = 1;
    };

    // ─── 11. Raycaster for Interactive 3D Node Hover ─────────────────
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2(-1000, -1000);
    let currentlyHoveredNodeId: string | null = null;

    // ─── 12. Controls: Smooth Drag Orbit + Zoom Wheel ─────────────────
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    const targetRotation = { x: 0.2, y: 0.4 };
    const currentRotation = { x: 0.2, y: 0.4 };
    let targetZoom = 5.8;
    let currentZoom = 5.8;

    resetCameraRef.current = () => {
      targetRotation.x = 0.2;
      targetRotation.y = 0.4;
      targetZoom = 5.8;
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      mouseVector.x = (clientX / rect.width) * 2 - 1;
      mouseVector.y = -(clientY / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;
        targetRotation.y += deltaX * 0.008;
        targetRotation.x += deltaY * 0.008;
        prevMousePos = { x: e.clientX, y: e.clientY };
      } else {
        targetRotation.y = mouseVector.x * 0.45;
        targetRotation.x = -mouseVector.y * 0.35 + 0.15;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetZoom = Math.min(Math.max(targetZoom + e.deltaY * 0.003, 3.8), 7.5);
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
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // ─── 13. Resize Observer ─────────────────────────────────────────
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

    // ─── 14. Animation Loop ──────────────────────────────────────────
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

      // Smooth camera zoom & pivot rotation lerp
      currentZoom += (targetZoom - currentZoom) * 0.08;
      camera.position.z = currentZoom;

      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.06;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.06;
      masterPivot.rotation.x = currentRotation.x;
      masterPivot.rotation.y = currentRotation.y + elapsedTime * 0.09 * speedMultiplier;

      // Radar scan rotation
      radarLine.rotation.y = elapsedTime * 1.2 * speedMultiplier;

      // Core rotation & breathing pulse
      const breath = 1.0 + Math.sin(elapsedTime * 2.4) * 0.07;
      seedMesh.scale.setScalar(breath);
      midCageMesh.rotation.x = elapsedTime * 0.45 * speedMultiplier;
      midCageMesh.rotation.y = elapsedTime * 0.65 * speedMultiplier;
      outerMesh.rotation.y = -elapsedTime * 0.3 * speedMultiplier;
      outerMesh.rotation.z = elapsedTime * 0.28 * speedMultiplier;

      // Gimbal Rings rotation
      ring1.rotation.z = elapsedTime * 0.22 * speedMultiplier;
      ring2.rotation.y += 0.005 * speedMultiplier;
      ring3.rotation.z -= 0.006 * speedMultiplier;

      // Ambient particle rotation
      particles.rotation.y = -elapsedTime * 0.035;

      // Floating digital bits ring animation
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

      // Dual Shockwaves animation
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

      // Raycasting for direct 3D node hover
      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        const hitData = intersects[0].object.userData.nodeData as TechNodeData;
        if (hitData && hitData.id !== currentlyHoveredNodeId) {
          currentlyHoveredNodeId = hitData.id;
          setHoveredNode(hitData);
          playPop();
        }
      } else if (currentlyHoveredNodeId) {
        currentlyHoveredNodeId = null;
        setHoveredNode(null);
      }

      // Update Tech Nodes & Synaptic streams
      liveNodes.forEach((live, idx) => {
        const { data, pivot, nodeMesh, haloMesh, line, packet } = live;
        const isThisNodeHovered = currentlyHoveredNodeId === data.id;

        // Calculate 3D orbit coordinates
        const angle = data.orbitPhase + elapsedTime * data.orbitSpeed * speedMultiplier;
        const x = Math.cos(angle) * data.orbitRadius;
        const z = Math.sin(angle) * data.orbitRadius;
        const y = Math.sin(angle * 1.5 + data.orbitTilt) * 0.52;

        pivot.position.set(x, y, z);
        haloMesh.lookAt(camera.position);

        // Node scale on hover / overclock
        const targetScale = isThisNodeHovered ? 1.6 : overclockRef.current ? 1.25 : 1.0;
        nodeMesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);

        // Halo pulse
        const haloScale = 1.0 + Math.sin(elapsedTime * 4 + idx) * (isThisNodeHovered ? 0.35 : 0.15);
        haloMesh.scale.setScalar(haloScale);
        (haloMesh.material as THREE.MeshBasicMaterial).opacity = isThisNodeHovered ? 0.95 : 0.55;
        (nodeMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = isThisNodeHovered ? 2.2 : (overclockRef.current ? 1.8 : 0.9);

        // Dynamic laser stream line
        const linePositions = (line.geometry as THREE.BufferGeometry).attributes.position as THREE.BufferAttribute;
        linePositions.setXYZ(0, 0, 0, 0);
        linePositions.setXYZ(1, x, y, z);
        linePositions.needsUpdate = true;
        (line.material as THREE.LineBasicMaterial).opacity = isThisNodeHovered ? 0.8 : (overclockRef.current ? 0.65 : 0.3);

        // Packet travel
        live.packetProgress = (live.packetProgress + 0.014 * speedMultiplier) % 1;
        const px = x * (1 - live.packetProgress);
        const py = y * (1 - live.packetProgress);
        const pz = z * (1 - live.packetProgress);
        packet.position.set(px, py, pz);
      });

      renderer.render(scene, camera);
    };

    animate();

    // ─── 15. Cleanup ─────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
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
    <div className="relative w-full h-full flex flex-col justify-between select-none overflow-hidden">
      {/* 3D WebGL Canvas Mount */}
      <div
        ref={mountRef}
        onClick={handlePulse}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Sleek Minimalist Top HUD Header */}
      <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md">
          <span className={`w-2 h-2 rounded-full ${isOverclocked ? 'bg-[#FF5722] animate-ping' : 'bg-[#1CD399] animate-pulse'}`} />
          <span className="font-mono text-[9px] sm:text-[10px] tracking-wider text-white font-bold uppercase">
            {isOverclocked ? 'QUANTUM PULSE // MAX' : 'NEURAL NEXUS // ONLINE'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* FPS Counter */}
          <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 border border-white/10 backdrop-blur-md font-mono text-[9px] sm:text-[10px] text-white/60">
            <Activity className="w-3 h-3 text-[#1CD399]" />
            <span>{fps} FPS</span>
          </div>

          {/* Reset Camera View */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (resetCameraRef.current) resetCameraRef.current();
            }}
            className="pointer-events-auto p-1.5 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 hover:border-white/30 text-white/60 hover:text-white transition-all backdrop-blur-md active:scale-95"
            title="Reset 3D Camera Orientation & Zoom"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          {/* Interactive Quantum Overclock Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePulse();
            }}
            className={`pointer-events-auto px-2.5 py-1 rounded-full font-mono text-[9.5px] sm:text-[10.5px] font-bold flex items-center gap-1 border transition-all duration-300 active:scale-95 ${
              isOverclocked
                ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.8)]'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/25 hover:border-white/50 backdrop-blur-md'
            }`}
            title="Trigger Quantum Pulse Shockwave (Or click anywhere on the 3D model)"
          >
            <Zap className={`w-3 h-3 ${isOverclocked ? 'fill-black' : 'fill-white'}`} />
            <span>PULSE</span>
          </button>
        </div>
      </div>

      {/* Floating Holographic Node Inspector (Only appears when hovering directly over a 3D node) */}
      <div className="relative z-10 px-4 pointer-events-none flex justify-center pb-4">
        {hoveredNode ? (
          <div className="px-4 py-2 rounded-2xl border border-white/25 bg-black/85 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex items-center gap-2.5 animate-in fade-in zoom-in-95 duration-200">
            <span
              className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]"
              style={{ backgroundColor: hoveredNode.hex, color: hoveredNode.hex }}
            />
            <div>
              <span className="text-xs sm:text-sm font-extrabold text-white block leading-tight font-display tracking-tight">
                {hoveredNode.name}
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-white/70 block">
                {hoveredNode.details}
              </span>
            </div>
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
