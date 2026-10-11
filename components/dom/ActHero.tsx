'use client';

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, ArrowDown, ExternalLink, Download, RotateCcw, Sparkles } from "lucide-react";
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

    // Colorful wireframe shapes
    const shapeConfigs = [
      { geo: new THREE.IcosahedronGeometry(1.1, 1), color: 0x00e5ff, x: -2.5, y: 1.2, z: -2, rspeed: { x: 0.003, y: 0.005 } },
      { geo: new THREE.IcosahedronGeometry(0.8, 1), color: 0x7c3aed, x: 2.8, y: -0.8, z: -3, rspeed: { x: 0.004, y: 0.003 } },
      { geo: new THREE.TorusGeometry(0.9, 0.25, 8, 24), color: 0x10b981, x: -1.2, y: -2.2, z: -1.5, rspeed: { x: 0.005, y: 0.004 } },
      { geo: new THREE.OctahedronGeometry(0.9), color: 0xf59e0b, x: 3.2, y: 2.0, z: -2.5, rspeed: { x: 0.006, y: 0.002 } },
      { geo: new THREE.DodecahedronGeometry(0.75), color: 0x3b82f6, x: 0.5, y: 2.8, z: -3.5, rspeed: { x: 0.003, y: 0.006 } },
      // Extra meshes
      { geo: new THREE.TorusGeometry(0.6, 0.18, 8, 20), color: 0xf43f5e, x: -3.5, y: -1.5, z: -3, rspeed: { x: 0.007, y: 0.003 } },
      { geo: new THREE.OctahedronGeometry(0.65), color: 0x06b6d4, x: 1.8, y: -2.8, z: -2, rspeed: { x: 0.004, y: 0.007 } },
      { geo: new THREE.DodecahedronGeometry(0.55), color: 0xa78bfa, x: -2.8, y: 2.5, z: -4, rspeed: { x: 0.005, y: 0.004 } },
    ];

    const meshes: THREE.Mesh[] = [];
    shapeConfigs.forEach(cfg => {
      const mat = new THREE.MeshBasicMaterial({ color: cfg.color, wireframe: true, transparent: true, opacity: 0.55 });
      const mesh = new THREE.Mesh(cfg.geo, mat);
      mesh.position.set(cfg.x, cfg.y, cfg.z);
      (mesh as any)._rspeed = cfg.rspeed;
      scene.add(mesh);
      meshes.push(mesh);
    });

    // Multicolor particles
    const particleCount = 260;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);
    const pOffsets = new Float32Array(particleCount);
    const techColors = [
      [0, 0.9, 1], [0.48, 0.23, 0.93], [0.063, 0.72, 0.506],
      [0.96, 0.62, 0.04], [0.23, 0.51, 0.96], [0.96, 0.25, 0.37],
    ];
    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 18;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
      pOffsets[i] = Math.random() * Math.PI * 2;
      const c = techColors[Math.floor(Math.random() * techColors.length)];
      pColors[i * 3] = c[0]; pColors[i * 3 + 1] = c[1]; pColors[i * 3 + 2] = c[2];
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(pColors, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.07, vertexColors: true, transparent: true, opacity: 0.75 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    let animId: number;
    let t = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.01;
      meshes.forEach(m => {
        const rs = (m as any)._rspeed;
        m.rotation.x += rs.x;
        m.rotation.y += rs.y;
      });
      // Gentle particle bob
      const pos = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] = pPos[i * 3 + 1] + Math.sin(t + pOffsets[i]) * 0.12;
      }
      pGeo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none opacity-80" />;
};

// ─── 2. Golden Knight Tech Scene — 360° Turntable with Newton's Cradle ───
interface KnightTechScene3DProps {
  autoSpin: boolean;
  onAutoSpinToggle: () => void;
  onInteract: (msg: string | null) => void;
  resetTrigger?: number;
}

const HeroKnightTechScene3D: React.FC<KnightTechScene3DProps> = ({
  autoSpin,
  onInteract,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const autoSpinRef = useRef(autoSpin);
  autoSpinRef.current = autoSpin;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const W = container.clientWidth || 460;
    const H = container.clientHeight || 345;

    // ── Scene & Renderer ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, W / H, 0.1, 100);
    camera.position.set(0, 2.8, 6.5);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance", precision: "mediump" });
    renderer.setSize(W, H);
    renderer.setPixelRatio(1);
    renderer.shadowMap.enabled = false;
    container.appendChild(renderer.domElement);

    // ── Turntable group (everything rotates together) ──
    const turntable = new THREE.Group();
    scene.add(turntable);

    // ── Lighting ──
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const sun = new THREE.DirectionalLight(0xfff8e1, 1.8);
    sun.position.set(4, 7, 5);
    scene.add(sun);
    const rimLight = new THREE.DirectionalLight(0x00e5ff, 0.6);
    rimLight.position.set(-5, 3, -4);
    scene.add(rimLight);
    const fillLight = new THREE.PointLight(0xa855f7, 1.2, 12);
    fillLight.position.set(0, 4, 0);
    scene.add(fillLight);

    // ── Circuit Board Ground Platform ──
    const groundGeo = new THREE.CylinderGeometry(3.2, 3.2, 0.12, 64);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x0a1628, roughness: 0.8, metalness: 0.2 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.06;
    turntable.add(ground);

    // Circuit traces (rings)
    const ringColors = [0x00e5ff, 0x7c3aed, 0x10b981];
    [1.2, 2.0, 2.9].forEach((r, i) => {
      const ringGeo = new THREE.TorusGeometry(r, 0.02, 8, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: ringColors[i], transparent: true, opacity: 0.55 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.01;
      turntable.add(ring);
    });

    // ── Golden Chess Knight (Main Centerpiece) ──
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.25, metalness: 0.95, emissive: 0xb8860b, emissiveIntensity: 0.12 });
    const hornGlowMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, roughness: 0.1, metalness: 0.9, emissive: 0x00e5ff, emissiveIntensity: 0.8 });
    const darkGoldMat = new THREE.MeshStandardMaterial({ color: 0xb8860b, roughness: 0.4, metalness: 0.8 });

    const knightGroup = new THREE.Group();
    knightGroup.name = "knight";
    knightGroup.position.set(0, 0, 0);

    // Base pedestal
    const pedestalGeo = new THREE.CylinderGeometry(0.55, 0.65, 0.18, 24);
    knightGroup.add(new THREE.Mesh(pedestalGeo, darkGoldMat));

    // Body
    const bodyGeo = new THREE.CylinderGeometry(0.38, 0.48, 0.9, 18);
    const body = new THREE.Mesh(bodyGeo, goldMat);
    body.position.y = 0.54;
    knightGroup.add(body);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.2, 0.35, 0.35, 14);
    const neck = new THREE.Mesh(neckGeo, goldMat);
    neck.position.y = 1.17;
    knightGroup.add(neck);

    // Head (horse-like elongated)
    const headGeo = new THREE.BoxGeometry(0.32, 0.55, 0.55);
    const head = new THREE.Mesh(headGeo, goldMat);
    head.position.set(0.08, 1.6, 0.06);
    head.rotation.z = -0.18;
    knightGroup.add(head);

    // Snout
    const snoutGeo = new THREE.BoxGeometry(0.22, 0.28, 0.42);
    const snout = new THREE.Mesh(snoutGeo, goldMat);
    snout.position.set(0.18, 1.44, 0.12);
    knightGroup.add(snout);

    // Ears
    [-0.08, 0.08].forEach(xo => {
      const earGeo = new THREE.ConeGeometry(0.07, 0.22, 10);
      const ear = new THREE.Mesh(earGeo, goldMat);
      ear.position.set(xo, 1.92, -0.08);
      knightGroup.add(ear);
    });

    // Unicorn Horn (glows cyan)
    const hornGeo = new THREE.ConeGeometry(0.05, 0.45, 10);
    const horn = new THREE.Mesh(hornGeo, hornGlowMat);
    horn.position.set(0.26, 2.0, 0.1);
    horn.rotation.z = Math.PI / 5;
    knightGroup.add(horn);

    // Mane strands
    for (let i = 0; i < 5; i++) {
      const maneGeo = new THREE.SphereGeometry(0.07 - i * 0.008, 8, 6);
      const mane = new THREE.Mesh(maneGeo, darkGoldMat);
      mane.position.set(-0.14, 1.75 - i * 0.14, -0.1 - i * 0.05);
      knightGroup.add(mane);
    }

    // Crown
    for (let i = 0; i < 5; i++) {
      const spikeGeo = new THREE.ConeGeometry(0.045, 0.18, 8);
      const spike = new THREE.Mesh(spikeGeo, new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffa000, emissiveIntensity: 0.5, metalness: 0.9, roughness: 0.1 }));
      const angle = (i / 5) * Math.PI * 2;
      spike.position.set(Math.cos(angle) * 0.32, 1.04, Math.sin(angle) * 0.32);
      knightGroup.add(spike);
    }

    // Chess board base tile
    const tileGeo = new THREE.BoxGeometry(1.1, 0.06, 1.1);
    const tileMat = new THREE.MeshStandardMaterial({ color: 0x1a0a00, roughness: 0.6 });
    const tile = new THREE.Mesh(tileGeo, tileMat);
    tile.position.y = -0.09;
    knightGroup.add(tile);

    turntable.add(knightGroup);

    // ── Dual Server Racks (left & right on IC chip pedestals) ──
    const makeServerRack = (xPos: number) => {
      const rackGroup = new THREE.Group();
      rackGroup.position.set(xPos, 0, 0.3);

      // IC chip pedestal
      const chipGeo = new THREE.BoxGeometry(0.9, 0.08, 0.75);
      const chipMat = new THREE.MeshStandardMaterial({ color: 0x1a2a1a, roughness: 0.5, metalness: 0.6 });
      const chip = new THREE.Mesh(chipGeo, chipMat);
      chip.position.y = 0.04;
      rackGroup.add(chip);

      // Chip pins
      for (let i = 0; i < 5; i++) {
        for (const zSide of [-0.38, 0.38]) {
          const pinGeo = new THREE.BoxGeometry(0.05, 0.06, 0.03);
          const pinMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9, roughness: 0.1 });
          const pin = new THREE.Mesh(pinGeo, pinMat);
          pin.position.set(-0.3 + i * 0.14, 0.04, zSide);
          rackGroup.add(pin);
        }
      }

      // Server rack chassis
      const chassisGeo = new THREE.BoxGeometry(0.78, 1.6, 0.55);
      const chassisMat = new THREE.MeshStandardMaterial({ color: 0x1c1c22, roughness: 0.6, metalness: 0.4 });
      const chassis = new THREE.Mesh(chassisGeo, chassisMat);
      chassis.name = "server";
      chassis.position.y = 0.88;
      rackGroup.add(chassis);

      // Server units (blades)
      for (let u = 0; u < 6; u++) {
        const bladeGeo = new THREE.BoxGeometry(0.72, 0.19, 0.5);
        const bladeMat = new THREE.MeshStandardMaterial({ color: u % 2 === 0 ? 0x252530 : 0x1a1a24, roughness: 0.7 });
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.y = 0.08 + u * 0.24;
        rackGroup.add(blade);

        // LED indicator per blade
        const ledGeo = new THREE.SphereGeometry(0.025, 8, 6);
        const ledColors = [0x00ff88, 0x00e5ff, 0xff6600, 0x00ff88, 0x7c3aed, 0x00e5ff];
        const ledMat = new THREE.MeshBasicMaterial({ color: ledColors[u] });
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.set(0.3, 0.08 + u * 0.24, 0.27);
        rackGroup.add(led);
        (led as any)._ledBase = ledColors[u];
        (led as any)._isLed = true;
      }

      turntable.add(rackGroup);
      return rackGroup;
    };

    const leftRack = makeServerRack(-2.3);
    const rightRack = makeServerRack(2.3);

    // ── Newton's Cradle Overhead ──
    const cradleGroup = new THREE.Group();
    cradleGroup.position.set(0, 3.4, 0);
    cradleGroup.name = "cradle";
    turntable.add(cradleGroup);

    // Frame
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9, roughness: 0.15 });
    const frameBar = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.2, 10), frameMat);
    [-0.9, 0.9].forEach(x => {
      const v = frameBar.clone();
      v.position.set(x, 0, 0);
      cradleGroup.add(v);
    });
    const crossBar = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.9, 10), frameMat);
    crossBar.rotation.z = Math.PI / 2;
    crossBar.position.y = 0;
    cradleGroup.add(crossBar);
    const topBar = crossBar.clone();
    topBar.position.y = -1.0;
    cradleGroup.add(topBar);

    // 5 balls on strings
    const ballMats = [
      new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.95, roughness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: 0x00e5ff, metalness: 0.9, roughness: 0.1, emissive: 0x00e5ff, emissiveIntensity: 0.3 }),
      new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.95, roughness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: 0xa855f7, metalness: 0.9, roughness: 0.1, emissive: 0xa855f7, emissiveIntensity: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.95, roughness: 0.1 }),
    ];
    const cradleBalls: THREE.Mesh[] = [];
    const stringLen = 0.95;
    for (let i = 0; i < 5; i++) {
      const x = -0.72 + i * 0.36;
      const ballGeo = new THREE.SphereGeometry(0.155, 16, 14);
      const ball = new THREE.Mesh(ballGeo, ballMats[i]);
      ball.position.set(x, -stringLen, 0);
      cradleGroup.add(ball);
      cradleBalls.push(ball);

      // String lines (two thin cylinders per ball)
      for (const zs of [-0.06, 0.06]) {
        const strGeo = new THREE.CylinderGeometry(0.008, 0.008, stringLen, 6);
        const strMat = new THREE.MeshBasicMaterial({ color: 0x888888 });
        const str = new THREE.Mesh(strGeo, strMat);
        str.position.set(x, -stringLen / 2, zs);
        cradleGroup.add(str);
      }
    }

    // ── 120 Ambient Dust Particles ──
    const dustGeo = new THREE.BufferGeometry();
    const dustCount = 120;
    const dPos = new Float32Array(dustCount * 3);
    const dColors = new Float32Array(dustCount * 3);
    const dustOffsets = new Float32Array(dustCount);
    const dustPalette = [[0, 0.9, 1], [0.48, 0.23, 0.93], [1, 0.85, 0], [0.063, 0.72, 0.5]];
    for (let i = 0; i < dustCount; i++) {
      const r = 1.5 + Math.random() * 2.5;
      const angle = Math.random() * Math.PI * 2;
      dPos[i * 3] = Math.cos(angle) * r;
      dPos[i * 3 + 1] = Math.random() * 3.5 - 0.5;
      dPos[i * 3 + 2] = Math.sin(angle) * r;
      dustOffsets[i] = Math.random() * Math.PI * 2;
      const c = dustPalette[Math.floor(Math.random() * dustPalette.length)];
      dColors[i * 3] = c[0]; dColors[i * 3 + 1] = c[1]; dColors[i * 3 + 2] = c[2];
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dPos.slice(), 3));
    dustGeo.setAttribute("color", new THREE.BufferAttribute(dColors, 3));
    const dustMat = new THREE.PointsMaterial({ size: 0.055, vertexColors: true, transparent: true, opacity: 0.65 });
    const dust = new THREE.Points(dustGeo, dustMat);
    turntable.add(dust);

    // ── Raycaster for click interaction ──
    const raycaster = new THREE.Raycaster();
    const mouse2d = new THREE.Vector2();

    const onPointerDown = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse2d.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse2d.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      raycaster.setFromCamera(mouse2d, camera);

      const hits = raycaster.intersectObjects(turntable.children, true);
      if (hits.length > 0) {
        let obj: THREE.Object3D | null = hits[0].object;
        while (obj && obj !== turntable) {
          if (obj.name === "knight") {
            const msgs = ["👑 LeetCode Knight · Rating 1951 · Top 3%", "⚔️ 1,100+ problems solved!", "🦄 Unicorn Engineer — rare combo of AI + DSA"];
            onInteract(msgs[Math.floor(Math.random() * msgs.length)]);
            return;
          }
          if (obj.name === "server") {
            const msgs = ["🖥️ Next.js + MERN stack deployed!", "⚡ CleanCity IoT — SIH 2024 Winner!", "🤖 RAG AI Agent with LangChain running..."];
            onInteract(msgs[Math.floor(Math.random() * msgs.length)]);
            return;
          }
          if (obj.name === "cradle") {
            const msgs = ["🔁 Newton's Cradle = Momentum Transfer Algorithms", "💡 Every action has an equal reaction — just like recursion!", "📐 Physics + CS = Magic ✨"];
            onInteract(msgs[Math.floor(Math.random() * msgs.length)]);
            return;
          }
          obj = obj.parent;
        }
      }
    };
    container.addEventListener("pointerdown", onPointerDown);

    // ── Drag-to-rotate ──
    let isDragging = false;
    let prevX = 0;
    let dragVelocity = 0;
    const onMouseDown = (e: MouseEvent) => { isDragging = true; prevX = e.clientX; dragVelocity = 0; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      dragVelocity = dx * 0.012;
      turntable.rotation.y += dragVelocity;
      prevX = e.clientX;
    };
    const onMouseUp = () => { isDragging = false; };
    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // ── Animation Loop ──
    let animId: number;
    let t = 0;
    let ledFlicker = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.016;
      ledFlicker++;

      // Auto-spin
      if (autoSpinRef.current && !isDragging) {
        turntable.rotation.y += 0.006;
      } else if (!isDragging && Math.abs(dragVelocity) > 0.001) {
        turntable.rotation.y += dragVelocity;
        dragVelocity *= 0.96;
      }

      // Knight subtle bob
      knightGroup.position.y = Math.sin(t * 0.8) * 0.04;

      // Horn glow pulse
      (horn.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + Math.sin(t * 2.5) * 0.4;

      // Newton's Cradle — realistic pendulum momentum
      const cradleT = t * 2.8;
      const swingAmp = 0.55;
      // Ball 0 swings right when ball 4 is at rest, etc.
      const phase0 = Math.max(0, -Math.sin(cradleT)) * swingAmp;
      const phase4 = Math.max(0, Math.sin(cradleT)) * swingAmp;
      cradleBalls[0].position.x = -0.72 + Math.sin(-phase0) * stringLen * 0.8;
      cradleBalls[0].position.y = -stringLen + (1 - Math.cos(phase0)) * stringLen * 0.5;
      cradleBalls[4].position.x = 0.72 + Math.sin(phase4) * stringLen * 0.8;
      cradleBalls[4].position.y = -stringLen + (1 - Math.cos(phase4)) * stringLen * 0.5;
      // Middle balls stay mostly stationary (realistic transfer)
      for (let i = 1; i <= 3; i++) {
        cradleBalls[i].position.y = -stringLen + Math.abs(Math.sin(cradleT * 8)) * 0.01;
      }

      // LED flicker on server racks
      if (ledFlicker % 30 === 0) {
        [leftRack, rightRack].forEach(rack => {
          rack.children.forEach(child => {
            if ((child as any)._isLed) {
              const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
              mat.color.setHex(Math.random() > 0.15 ? (child as any)._ledBase : 0x000000);
            }
          });
        });
      }

      // Dust bob
      const dp = dustGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < dustCount; i++) {
        dp[i * 3 + 1] = dPos[i * 3 + 1] + Math.sin(t + dustOffsets[i]) * 0.18;
      }
      dustGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
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
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("pointerdown", onPointerDown);
      cancelAnimationFrame(animId);
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onInteract]);

  return <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none" />;
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
  const RESUME_URL = "https://drive.google.com/file/d/1muHU96RCNS1iCxL6H6SonHjeL6nJlkrA/view";

  const [autoSpin, setAutoSpin] = useState(true);
  const [interactMsg, setInteractMsg] = useState<string | null>(null);
  const interactTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInteract = (msg: string | null) => {
    setInteractMsg(msg);
    if (interactTimerRef.current) clearTimeout(interactTimerRef.current);
    if (msg) {
      interactTimerRef.current = setTimeout(() => setInteractMsg(null), 2800);
    }
  };

  // Typewriter Loop Logic
  const [roleIndex, setRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const targetRole = ROLES[roleIndex];
    const typingSpeed = isDeleting ? 40 : 80;
    const pauseAtEnd = 1400;
    const pauseAtStart = 300;

    if (!isDeleting && currentText === targetRole) {
      const t = setTimeout(() => setIsDeleting(true), pauseAtEnd);
      return () => clearTimeout(t);
    }
    if (isDeleting && currentText === "") {
      const t = setTimeout(() => {
        setIsDeleting(false);
        setRoleIndex(prev => (prev + 1) % ROLES.length);
      }, pauseAtStart);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setCurrentText(isDeleting
        ? targetRole.slice(0, currentText.length - 1)
        : targetRole.slice(0, currentText.length + 1)
      );
    }, typingSpeed);
    return () => clearTimeout(t);
  }, [currentText, isDeleting, roleIndex]);

  const scrollToNext = () => {
    const next = document.querySelector("[data-section='about']") as HTMLElement;
    if (next) next.scrollIntoView({ behavior: "smooth" });
  };

  const socialLinks = [
    { href: "https://github.com/Dhruv-Bajaj-code", icon: Github, label: "GitHub" },
    { href: "https://linkedin.com/in/dhruv-bajaj-8ba898257", icon: Linkedin, label: "LinkedIn" },
    { href: "mailto:d4bajaj@gmail.com", icon: Mail, label: "Email" },
  ];

  return (
    <section
      data-section="hero"
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#080808] px-4 sm:px-6 pt-20 pb-8"
    >
      {/* 3D Geometric Background */}
      <Hero3DGeometricBackground />

      {/* Subtle radial vignette */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(8,8,8,0.85)_100%)]" />

      {/* Main two-column layout */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8">

        {/* Left: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-[11px] font-mono text-white/60 mb-5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Available for SDE Roles & Internships
          </div>

          {/* Name */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white mb-2">
            DHRUV
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] via-[#7c3aed] to-[#10b981]">
              BAJAJ
            </span>
          </h1>

          {/* Typewriter Role */}
          <div className="h-7 sm:h-8 flex items-center gap-1.5 mb-5">
            <span className="text-base sm:text-lg font-mono font-medium text-white/75">{currentText}</span>
            <span className="w-0.5 h-5 bg-[#00e5ff] animate-pulse" />
          </div>

          {/* Bio */}
          <p className="text-sm sm:text-[15px] text-white/55 leading-relaxed mb-7 max-w-[420px]">
            B.Tech CSE · NSUT Delhi — Building full-stack apps, AI agents & competitive programming with{" "}
            <span className="text-[#facc15] font-semibold">LeetCode Knight</span> rated at 1951.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <motion.a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-colors shadow-lg"
            >
              <Download className="w-4 h-4" />
              Resume
            </motion.a>
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 text-white/80 font-medium text-sm hover:border-white/40 hover:text-white transition-colors backdrop-blur-sm"
            >
              <ExternalLink className="w-4 h-4" />
              View Projects
            </motion.a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ scale: 1.12, y: -2 }}
                whileTap={{ scale: 0.92 }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/12 hover:border-white/30 transition-all flex items-center justify-center text-white/70 hover:text-white backdrop-blur-sm"
              >
                <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Right: 3D Knight Tech Scene */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[480px] flex flex-col items-center gap-2"
        >
          {/* Interaction Toast */}
          <AnimatePresence>
            {interactMsg && (
              <motion.div
                key={interactMsg}
                initial={{ opacity: 0, y: -8, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.94 }}
                transition={{ duration: 0.28 }}
                className="absolute -top-10 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap bg-[#0a0a0e]/95 border border-white/15 text-white/90 text-[11px] sm:text-xs font-mono px-4 py-1.5 rounded-full shadow-xl backdrop-blur-md"
              >
                {interactMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3D Viewport */}
          <div className="relative w-full aspect-[4/3] rounded-3xl border border-white/15 bg-[#0C0C0E]/95 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden backdrop-blur-2xl flex flex-col group/terminal">

            {/* Window Chrome */}
            <div className="flex items-center justify-between px-3 sm:px-3.5 py-2 bg-[#141418] border-b border-white/10 shrink-0 select-none">
              {/* Mac Traffic Lights */}
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] shadow-[0_0_5px_rgba(255,95,87,0.5)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E] shadow-[0_0_5px_rgba(254,188,46,0.4)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28C840] shadow-[0_0_5px_rgba(40,200,64,0.4)]" />
              </div>

              {/* Auto-Spin Toggle */}
              <button
                onClick={() => setAutoSpin(v => !v)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-mono font-medium border transition-all ${
                  autoSpin
                    ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                    : "bg-white/5 border-white/10 text-white/40 hover:text-white/70"
                }`}
              >
                <RotateCcw className="w-2.5 h-2.5" />
                {autoSpin ? "AUTO-SPIN ON" : "AUTO-SPIN OFF"}
              </button>

              {/* Live status */}
              <span className="flex items-center gap-1 text-[8.5px] sm:text-[9px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                360°
              </span>
            </div>

            {/* 3D Canvas */}
            <div className="relative flex-1 w-full h-full overflow-hidden">
              <HeroKnightTechScene3D
                autoSpin={autoSpin}
                onAutoSpinToggle={() => setAutoSpin(v => !v)}
                onInteract={handleInteract}
              />

              {/* Interaction Hints */}
              <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between font-mono text-[8px] sm:text-[8.5px] text-white/50 pointer-events-none select-none">
                <span className="bg-black/75 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-sm">
                  Drag to rotate · Click to explore
                </span>
                <span className="bg-black/75 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-sm flex items-center gap-1 text-cyan-300">
                  <Sparkles className="w-2 h-2" />
                  KNIGHT
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
