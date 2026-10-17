'use client';

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RotateCcw, Zap, Eye, Sparkles } from "lucide-react";

export type WorkstationScreenMode = "terminal" | "matrix" | "specs" | "visualizer";

interface HeroKnightTechScene3DProps {
  currentMode: WorkstationScreenMode;
  onModeChange: (mode: WorkstationScreenMode) => void;
  onDuckQuack?: (msg?: string) => void;
}

export const HeroKnightTechScene3D: React.FC<HeroKnightTechScene3DProps> = ({
  currentMode,
  onModeChange,
  onDuckQuack,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<WorkstationScreenMode>(currentMode);
  modeRef.current = currentMode;

  const [autoSpinState, setAutoSpinState] = useState(true);
  const triggerPulseRef = useRef<() => void>(() => {});
  const resetViewRef = useRef<() => void>(() => {});

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 460;
    const height = container.clientHeight || 345;

    // ── 1. High-Performance Locked 60-120FPS WebGL Renderer ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 2.4, 6.2);
    camera.lookAt(0, 0.6, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      precision: "mediump",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // ── 2. Cinematic Lighting Setup ──
    scene.add(new THREE.AmbientLight(0xffffff, 0.85));

    // Warm Key Light (Gold specular gleam)
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.5);
    keyLight.position.set(4.5, 6.5, 5.0);
    scene.add(keyLight);

    // Cool Cyber Fill Light
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.1);
    fillLight.position.set(-5.0, 3.5, 3.0);
    scene.add(fillLight);

    // Luminous Magenta Rim Light
    const rimLight = new THREE.DirectionalLight(0xa855f7, 2.2);
    rimLight.position.set(0, 5.0, -4.5);
    scene.add(rimLight);

    // Bottom Cyan Ground Accent Light
    const bottomAccent = new THREE.PointLight(0x00f0ff, 1.5, 7.0);
    bottomAccent.position.set(0, -0.2, 2.0);
    scene.add(bottomAccent);

    // ── 3. Turntable Root Group (360° Rotatable) ──
    const turntable = new THREE.Group();
    turntable.position.set(0, -0.65, 0);
    scene.add(turntable);

    // ── 4. Ground Platform & Cyber Grid ──
    const groundGeo = new THREE.CylinderGeometry(3.3, 3.4, 0.14, 48);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x090b10,
      metalness: 0.85,
      roughness: 0.35,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.position.y = -0.07;
    turntable.add(groundMesh);

    // Outer Neon Cyan Border Ring
    const rimRing = new THREE.Mesh(
      new THREE.TorusGeometry(3.35, 0.035, 12, 48),
      new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.6,
      })
    );
    rimRing.rotation.x = Math.PI / 2;
    rimRing.position.y = 0.01;
    turntable.add(rimRing);

    // Procedural Circuit Board Texture
    const circuitCanvas = document.createElement("canvas");
    circuitCanvas.width = 512;
    circuitCanvas.height = 512;
    const cctx = circuitCanvas.getContext("2d");
    if (cctx) {
      cctx.fillStyle = "#06080d";
      cctx.fillRect(0, 0, 512, 512);

      cctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
      cctx.lineWidth = 2;
      [65, 135, 215].forEach((r) => {
        cctx.beginPath();
        cctx.arc(256, 256, r, 0, Math.PI * 2);
        cctx.stroke();
      });

      cctx.strokeStyle = "rgba(16, 185, 129, 0.35)";
      cctx.lineWidth = 1.5;
      for (let a = 0; a < 16; a++) {
        const rad = (a / 16) * Math.PI * 2;
        const x1 = 256 + Math.cos(rad) * 60;
        const y1 = 256 + Math.sin(rad) * 60;
        const x2 = 256 + Math.cos(rad) * 235;
        const y2 = 256 + Math.sin(rad) * 235;
        cctx.beginPath();
        cctx.moveTo(x1, y1);
        cctx.lineTo(x2, y2);
        cctx.stroke();

        cctx.fillStyle = "#f59e0b";
        cctx.beginPath();
        cctx.arc(x2, y2, 3, 0, Math.PI * 2);
        cctx.fill();
      }
    }
    const circuitTexture = new THREE.CanvasTexture(circuitCanvas);
    const topPlate = new THREE.Mesh(
      new THREE.CircleGeometry(3.3, 48),
      new THREE.MeshStandardMaterial({
        map: circuitTexture,
        roughness: 0.4,
        metalness: 0.75,
        transparent: true,
        opacity: 0.95,
      })
    );
    topPlate.rotation.x = -Math.PI / 2;
    topPlate.position.y = 0.005;
    turntable.add(topPlate);

    // ── NEW FEATURE 1: Rotating Sci-Fi Hologram Rings on Ground ──
    const holoRing1 = new THREE.Mesh(
      new THREE.RingGeometry(1.2, 1.28, 36),
      new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
      })
    );
    holoRing1.rotation.x = -Math.PI / 2;
    holoRing1.position.y = 0.015;
    turntable.add(holoRing1);

    const holoRing2 = new THREE.Mesh(
      new THREE.RingGeometry(1.5, 1.55, 32),
      new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
      })
    );
    holoRing2.rotation.x = -Math.PI / 2;
    holoRing2.position.y = 0.016;
    turntable.add(holoRing2);

    // Soft Radial Contact Shadows
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sctx = shadowCanvas.getContext("2d");
    if (sctx) {
      const grad = sctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(0, 0, 0, 0.85)");
      grad.addColorStop(0.5, "rgba(0, 0, 0, 0.4)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });

    const createContactShadow = (x: number, z: number, scaleX: number, scaleZ: number) => {
      const sMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), shadowMat);
      sMesh.rotation.x = -Math.PI / 2;
      sMesh.position.set(x, 0.012, z);
      sMesh.scale.set(scaleX, scaleZ, 1);
      turntable.add(sMesh);
    };
    createContactShadow(0, 0, 1.8, 1.8);
    createContactShadow(-2.1, 0.1, 1.6, 1.6);
    createContactShadow(2.1, 0.1, 1.6, 1.6);

    // ── 5. Realistic Sculpted Golden Unicorn Chess Knight (Centerpiece) ──
    const knightGroup = new THREE.Group();
    knightGroup.name = "knight";
    turntable.add(knightGroup);

    // Antique Royal Gold Materials with Specular Highlights
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xe0a536,
      metalness: 0.88,
      roughness: 0.22,
      emissive: 0x3d2704,
      emissiveIntensity: 0.22,
    });

    const darkGoldMat = new THREE.MeshStandardMaterial({
      color: 0xa87418,
      metalness: 0.85,
      roughness: 0.35,
    });

    // Staunton Chess Lathed Pedestal Base
    const lathePoints = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.70, 0),
      new THREE.Vector2(0.70, 0.07),
      new THREE.Vector2(0.63, 0.13),
      new THREE.Vector2(0.54, 0.19),
      new THREE.Vector2(0.58, 0.25),
      new THREE.Vector2(0.48, 0.35),
      new THREE.Vector2(0.41, 0.45),
      new THREE.Vector2(0.46, 0.51),
      new THREE.Vector2(0.38, 0.57),
      new THREE.Vector2(0, 0.57),
    ];
    const pedestalGeo = new THREE.LatheGeometry(lathePoints, 36);
    const pedestal = new THREE.Mesh(pedestalGeo, goldMat);
    knightGroup.add(pedestal);

    // Horse Head Geometry
    const knightShape = new THREE.Shape();
    knightShape.moveTo(-0.35, 0);
    knightShape.quadraticCurveTo(-0.50, 0.45, -0.44, 0.95);
    knightShape.quadraticCurveTo(-0.40, 1.35, -0.25, 1.70);
    knightShape.lineTo(-0.21, 1.74);
    knightShape.lineTo(-0.15, 2.10);
    knightShape.lineTo(-0.05, 1.80);
    knightShape.quadraticCurveTo(0.12, 1.66, 0.34, 1.50);
    knightShape.quadraticCurveTo(0.54, 1.36, 0.52, 1.18);
    knightShape.quadraticCurveTo(0.44, 1.05, 0.30, 1.10);
    knightShape.quadraticCurveTo(0.14, 1.05, 0.10, 0.85);
    knightShape.quadraticCurveTo(0.06, 0.52, 0.28, 0);
    knightShape.closePath();

    const headGeo = new THREE.ExtrudeGeometry(knightShape, {
      depth: 0.38,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.045,
      bevelThickness: 0.045,
      curveSegments: 20,
    });
    headGeo.center();
    const headMesh = new THREE.Mesh(headGeo, goldMat);
    headMesh.position.set(0.02, 1.45, 0);
    knightGroup.add(headMesh);

    // Mane Curls
    for (let i = 0; i < 4; i++) {
      const mane = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055 - i * 0.007, 0.11, 0.26, 14),
        darkGoldMat
      );
      mane.position.set(-0.38 - i * 0.04, 1.95 - i * 0.28, 0);
      mane.rotation.z = -0.6 - i * 0.15;
      knightGroup.add(mane);
    }

    // Inset Obsidian Gem Eyes
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x050508,
      roughness: 0.04,
      metalness: 0.95,
    });
    [-0.21, 0.21].forEach((zPos) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 14, 14), eyeMat);
      eye.position.set(0.24, 1.78, zPos);
      knightGroup.add(eye);
    });

    // Golden Unicorn Horn with Glowing Tip
    const hornGroup = new THREE.Group();
    hornGroup.position.set(0.24, 1.98, 0);
    hornGroup.rotation.z = -Math.PI / 5.2;

    const hornCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.075, 0.68, 20),
      goldMat
    );
    hornCone.position.y = 0.34;
    hornGroup.add(hornCone);

    for (let i = 0; i < 5; i++) {
      const coil = new THREE.Mesh(
        new THREE.TorusGeometry(0.072 - i * 0.01, 0.016, 8, 16),
        darkGoldMat
      );
      coil.position.y = 0.1 + i * 0.11;
      coil.rotation.x = Math.PI / 2 + 0.2;
      hornGroup.add(coil);
    }

    const hornTipMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 1.3,
      metalness: 0.3,
      roughness: 0.1,
    });
    const hornTip = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.22, 14), hornTipMat);
    hornTip.position.y = 0.72;
    hornGroup.add(hornTip);

    const hornGlowLight = new THREE.PointLight(0x00f0ff, 1.5, 2.5);
    hornGlowLight.position.set(0, 0.76, 0);
    hornGroup.add(hornGlowLight);

    knightGroup.add(hornGroup);

    // ── NEW FEATURE 2: 4 Orbiting 3D Holographic Data Badges ──
    const badgeGroup = new THREE.Group();
    turntable.add(badgeGroup);

    const createHoloBadge = (text: string, icon: string, angle: number, radius: number, yPos: number) => {
      const bCanvas = document.createElement("canvas");
      bCanvas.width = 256;
      bCanvas.height = 64;
      const bctx = bCanvas.getContext("2d");
      if (bctx) {
        bctx.fillStyle = "rgba(10, 15, 25, 0.85)";
        bctx.strokeStyle = "rgba(0, 240, 255, 0.6)";
        bctx.lineWidth = 3;
        bctx.beginPath();
        bctx.roundRect(4, 4, 248, 56, 12);
        bctx.fill();
        bctx.stroke();

        bctx.fillStyle = "#00f0ff";
        bctx.font = "bold 20px monospace";
        bctx.fillText(icon, 14, 38);

        bctx.fillStyle = "#ffffff";
        bctx.font = "bold 15px -apple-system, monospace";
        bctx.fillText(text, 44, 37);
      }
      const bTexture = new THREE.CanvasTexture(bCanvas);
      const bMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.88, 0.22),
        new THREE.MeshBasicMaterial({
          map: bTexture,
          transparent: true,
          opacity: 0.9,
          side: THREE.DoubleSide,
        })
      );
      bMesh.position.set(Math.cos(angle) * radius, yPos, Math.sin(angle) * radius);
      bMesh.lookAt(camera.position);
      badgeGroup.add(bMesh);
      return { mesh: bMesh, baseAngle: angle, radius, yPos };
    };

    const holoBadges = [
      createHoloBadge("KNIGHT 1951", "👑", 0.4, 1.85, 2.3),
      createHoloBadge("FULL STACK", "⚡", Math.PI - 0.4, 1.85, 2.2),
      createHoloBadge("AI RAG CORE", "🤖", -0.5, 1.95, 1.9),
      createHoloBadge("SIH WINNER", "🏆", -Math.PI + 0.5, 1.95, 2.0),
    ];

    // ── 6. Zero-Overhead Physics Newton's Cradle (Using Group Rotation) ──
    const cradleGroup = new THREE.Group();
    cradleGroup.name = "cradle";
    cradleGroup.position.set(0, 3.1, 0);
    turntable.add(cradleGroup);

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf5f5fa,
      metalness: 0.98,
      roughness: 0.04,
    });

    // Top Chrome Rails
    [-0.14, 0.14].forEach((zRail) => {
      const topRail = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 2.1, 14),
        chromeMat
      );
      topRail.rotation.z = Math.PI / 2;
      topRail.position.set(0, 0, zRail);
      cradleGroup.add(topRail);
    });

    [-0.95, 0.95].forEach((xEnd) => {
      const arch = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 1.3, 14),
        chromeMat
      );
      arch.position.set(xEnd, -0.65, 0);
      cradleGroup.add(arch);

      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.34), chromeMat);
      cap.position.set(xEnd, 0, 0);
      cradleGroup.add(cap);
    });

    // 5 Suspended Spheres mounted on Pendulum Pivot Groups (ZERO CPU buffer uploads!)
    const cradlePivots: THREE.Group[] = [];
    const cradleBalls: THREE.Mesh[] = [];
    const numBalls = 5;
    const ballR = 0.155;
    const stringLen = 1.05;
    const ballSpacing = 0.315;

    for (let i = 0; i < numBalls; i++) {
      const xRest = (i - 2) * ballSpacing;

      // Pendulum pivot group located on the top rail
      const pivot = new THREE.Group();
      pivot.position.set(xRest, 0, 0);
      cradleGroup.add(pivot);
      cradlePivots.push(pivot);

      // Sphere child
      const ball = new THREE.Mesh(
        new THREE.SphereGeometry(ballR, 28, 28),
        chromeMat
      );
      ball.position.set(0, -stringLen, 0);
      pivot.add(ball);
      cradleBalls.push(ball);

      // Two V-wires as static children of the pivot
      [-0.14, 0.14].forEach((zRail) => {
        const wireCurve = new THREE.LineCurve3(
          new THREE.Vector3(0, 0, zRail),
          new THREE.Vector3(0, -stringLen + ballR * 0.8, 0)
        );
        const wireGeo = new THREE.TubeGeometry(wireCurve, 2, 0.007, 4, false);
        const wire = new THREE.Mesh(
          wireGeo,
          new THREE.MeshStandardMaterial({ color: 0xb0b0be, metalness: 0.9, roughness: 0.2 })
        );
        pivot.add(wire);
      });
    }

    // NEW FEATURE 3: Impact Energy Shockwave Ring at Collision Points
    const impactRingGeo = new THREE.RingGeometry(0.05, 0.12, 16);
    const impactRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const impactRing = new THREE.Mesh(impactRingGeo, impactRingMat);
    impactRing.position.set(-0.32, -stringLen, 0);
    cradleGroup.add(impactRing);

    // ── 7. Dual Server Racks with Live Holographic Telemetry & Spinning Fans ──
    const makeICChipPedestal = (x: number) => {
      const chipGroup = new THREE.Group();
      chipGroup.position.set(x, 0, 0);

      const chipMat = new THREE.MeshStandardMaterial({
        color: 0x16161b,
        metalness: 0.35,
        roughness: 0.55,
      });
      const chipBody = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.1, 1.08), chipMat);
      chipBody.position.y = 0.05;
      chipGroup.add(chipBody);

      const die = new THREE.Mesh(
        new THREE.BoxGeometry(0.72, 0.02, 0.72),
        new THREE.MeshStandardMaterial({ color: 0x222228, metalness: 0.85, roughness: 0.2 })
      );
      die.position.y = 0.11;
      chipGroup.add(die);

      const pinMat = new THREE.MeshStandardMaterial({
        color: 0xd8d8e2,
        metalness: 0.95,
        roughness: 0.15,
      });
      const pinCountPerSide = 7;
      const step = 0.11;
      for (let p = 0; p < pinCountPerSide; p++) {
        const offset = (p - (pinCountPerSide - 1) / 2) * step;
        [-0.56, 0.56].forEach((zPos) => {
          const pin = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.05, 0.09), pinMat);
          pin.position.set(offset, 0.04, zPos);
          chipGroup.add(pin);
        });
        [-0.56, 0.56].forEach((xPos) => {
          const pin = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.05, 0.045), pinMat);
          pin.position.set(xPos, 0.04, offset);
          chipGroup.add(pin);
        });
      }
      turntable.add(chipGroup);
      return chipGroup;
    };

    // Roof Fan Creator
    const createExhaustFan = () => {
      const fanGroup = new THREE.Group();
      const grille = new THREE.Mesh(
        new THREE.TorusGeometry(0.22, 0.02, 8, 20),
        new THREE.MeshStandardMaterial({ color: 0x222228, metalness: 0.8 })
      );
      grille.rotation.x = Math.PI / 2;
      fanGroup.add(grille);

      const bladesGroup = new THREE.Group();
      for (let b = 0; b < 4; b++) {
        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(0.18, 0.01, 0.04),
          new THREE.MeshStandardMaterial({ color: 0x00f0ff, metalness: 0.5, emissive: 0x00f0ff, emissiveIntensity: 0.3 })
        );
        blade.rotation.y = (b / 4) * Math.PI * 2;
        blade.position.x = Math.cos(blade.rotation.y) * 0.09;
        blade.position.z = Math.sin(blade.rotation.y) * 0.09;
        bladesGroup.add(blade);
      }
      fanGroup.add(bladesGroup);
      return { fanGroup, bladesGroup };
    };

    // Left Server Rack
    makeICChipPedestal(-2.1);
    const leftRackGroup = new THREE.Group();
    leftRackGroup.name = "server";
    leftRackGroup.position.set(-2.1, 0.1, 0);
    turntable.add(leftRackGroup);

    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x111317,
      metalness: 0.7,
      roughness: 0.35,
    });
    const leftChassis = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.85, 0.68), chassisMat);
    leftChassis.position.y = 0.925;
    leftRackGroup.add(leftChassis);

    const leftFan = createExhaustFan();
    leftFan.fanGroup.position.set(0, 1.86, 0);
    leftRackGroup.add(leftFan.fanGroup);

    const frontPanel = new THREE.Mesh(
      new THREE.BoxGeometry(0.78, 1.75, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x1a1c22, metalness: 0.6, roughness: 0.5 })
    );
    frontPanel.position.set(0, 0.925, 0.35);
    leftRackGroup.add(frontPanel);

    const leftLeds: THREE.Mesh[] = [];
    const ledBlueMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const numRows = 14;
    for (let r = 0; r < numRows; r++) {
      [-0.26, 0.26].forEach((xCol) => {
        const led = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 0.02), ledBlueMat);
        led.position.set(xCol, 0.22 + r * 0.11, 0.38);
        leftRackGroup.add(led);
        leftLeds.push(led);
      });
    }

    // Right Server Rack (Glass Cabinet)
    makeICChipPedestal(2.1);
    const rightRackGroup = new THREE.Group();
    rightRackGroup.name = "server";
    rightRackGroup.position.set(2.1, 0.1, 0);
    turntable.add(rightRackGroup);

    const rightChassis = new THREE.Mesh(new THREE.BoxGeometry(0.88, 1.85, 0.68), chassisMat);
    rightChassis.position.y = 0.925;
    rightRackGroup.add(rightChassis);

    const rightFan = createExhaustFan();
    rightFan.fanGroup.position.set(0, 1.86, 0);
    rightRackGroup.add(rightFan.fanGroup);

    const rightLeds: { mesh: THREE.Mesh; baseColor: number }[] = [];
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0x1c1e26,
      metalness: 0.7,
      roughness: 0.4,
    });
    const ledColors = [0x10b981, 0x00f0ff, 0xf59e0b, 0xa855f7, 0xef4444, 0x10b981];

    for (let b = 0; b < 6; b++) {
      const bladeY = 0.24 + b * 0.27;
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.22, 0.58), bladeMat);
      blade.position.set(0, bladeY, 0.02);
      rightRackGroup.add(blade);

      for (let l = 0; l < 4; l++) {
        const col = ledColors[(b + l) % ledColors.length];
        const ledMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.022, 10, 10),
          new THREE.MeshBasicMaterial({ color: col })
        );
        ledMesh.position.set(-0.16 + l * 0.1, bladeY, 0.34);
        rightRackGroup.add(ledMesh);
        rightLeds.push({ mesh: ledMesh, baseColor: col });
      }
    }

    const glassDoor = new THREE.Mesh(
      new THREE.BoxGeometry(0.84, 1.78, 0.03),
      new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.26,
        metalness: 0.3,
        roughness: 0.08,
      })
    );
    glassDoor.position.set(0, 0.925, 0.36);
    rightRackGroup.add(glassDoor);

    // ── 8. Ambient Cyber Motes (Animated via Object Rotation: ZERO Buffer uploads) ──
    const dustCount = 80;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 6;
      dustPos[i * 3 + 1] = Math.random() * 3.8;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustParticles = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        color: 0x00f0ff,
        size: 0.045,
        transparent: true,
        opacity: 0.65,
      })
    );
    turntable.add(dustParticles);

    // ── 9. Ultra-Smooth Native Pointer & Touch Drag Physics ──
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let dragDeltaX = 0;
    let dragDeltaY = 0;
    let dragVelocityY = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let autoSpin = true;
    let idleTimer: NodeJS.Timeout | null = null;

    const onPointerDown = (e: PointerEvent) => {
      try {
        container.setPointerCapture(e.pointerId);
      } catch {}
      isDragging = true;
      autoSpin = false;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      if (idleTimer) clearTimeout(idleTimer);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      dragDeltaX += e.clientX - prevMouseX;
      dragDeltaY += e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (isDragging) {
        try {
          container.releasePointerCapture(e.pointerId);
        } catch {}
      }
      isDragging = false;
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        autoSpin = autoSpinState;
      }, 4000);
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);

    // Raycaster for click interactivity
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseCoord.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseCoord.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      raycaster.setFromCamera(mouseCoord, camera);

      const hits = raycaster.intersectObjects(turntable.children, true);
      if (hits.length > 0) {
        let hit: THREE.Object3D | null = hits[0].object;
        while (hit && hit !== turntable) {
          if (hit.name === "knight") {
            knightHopSpeed = 0.06;
            if (onDuckQuack) {
              const quotes = [
                "👑 LeetCode Knight · Rating 1951 · Top 3%",
                "⚔️ 1,100+ Problems Solved with Optimal Complexity!",
                "🦄 Unicorn Engineer: Full-Stack + AI RAG Specialist",
                "✨ Clean Code & Scalable Microservices Architecture",
              ];
              onDuckQuack(quotes[Math.floor(Math.random() * quotes.length)]);
            }
            return;
          }
          if (hit.name === "server") {
            if (onDuckQuack) {
              const sQuotes = [
                "⚡ Production Server: Next.js + AI Agents Active",
                "🖥️ CleanCity IoT Architecture Deployed!",
                "🤖 RAG AI Agent with LangChain Online",
              ];
              onDuckQuack(sQuotes[Math.floor(Math.random() * sQuotes.length)]);
            }
            return;
          }
          if (hit.name === "cradle") {
            cradleBoost = 0.55;
            if (onDuckQuack) {
              onDuckQuack("🔁 Newton's Cradle: Kinetic Momentum Transferred!");
            }
            return;
          }
          hit = hit.parent;
        }
      }
    };
    container.addEventListener("click", onClick);

    // Hook up external UI buttons
    triggerPulseRef.current = () => {
      cradleBoost = 0.7;
      knightHopSpeed = 0.08;
      impactShockwave = 1.0;
      if (onDuckQuack) onDuckQuack("⚡ Cyber Surge Activated: Max Energy!");
    };

    resetViewRef.current = () => {
      targetRotY = 0;
      targetRotX = 0;
      dragVelocityY = 0;
      if (onDuckQuack) onDuckQuack("🎯 View Reset to Center");
    };

    // ── 10. Locked 60-120FPS Animation Loop (Zero-GC, Zero Buffer uploads) ──
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    let animId: number;
    let time = 0;
    let knightHop = 0;
    let knightHopSpeed = 0;
    let cradleBoost = 0;
    let impactShockwave = 0;
    let ledTick = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;
      time += 0.016;
      ledTick++;

      // 1. Damped Spring Turntable Rotation (Zero layout recalculation)
      if (isDragging) {
        targetRotY += dragDeltaX * 0.007;
        targetRotX = Math.max(-0.25, Math.min(0.32, targetRotX + dragDeltaY * 0.004));
        dragVelocityY = dragDeltaX * 0.007;
        dragDeltaX = 0;
        dragDeltaY = 0;
      } else {
        if (autoSpin) {
          targetRotY += 0.0042;
          targetRotX += (0 - targetRotX) * 0.05;
        } else {
          targetRotY += dragVelocityY;
          dragVelocityY *= 0.93; // Smooth kinetic glide
        }
      }

      turntable.rotation.y += (targetRotY - turntable.rotation.y) * 0.14;
      turntable.rotation.x += (targetRotX - turntable.rotation.x) * 0.14;

      // 2. Knight Hop Physics
      if (knightHopSpeed !== 0 || knightHop > 0) {
        knightHop += knightHopSpeed;
        knightHopSpeed -= 0.005;
        if (knightHop <= 0) {
          knightHop = 0;
          knightHopSpeed = 0;
        }
        knightGroup.position.y = knightHop;
      }

      // 3. Unicorn Horn Glow Pulse
      hornTipMat.emissiveIntensity = 1.0 + Math.sin(time * 3.5) * 0.6;
      hornGlowLight.intensity = 1.3 + Math.sin(time * 3.5) * 0.6;

      // 4. Rotating Sci-Fi Hologram Rings
      holoRing1.rotation.z += 0.008;
      holoRing2.rotation.z -= 0.005;

      // 5. Spin Roof Exhaust Fans
      leftFan.bladesGroup.rotation.y += 0.12;
      rightFan.bladesGroup.rotation.y += 0.12;

      // 6. Holographic Data Badges Billboarding & Gentle Bob
      holoBadges.forEach((b, idx) => {
        b.mesh.position.y = b.yPos + Math.sin(time * 2 + idx * 1.5) * 0.04;
        b.mesh.quaternion.copy(camera.quaternion);
      });

      // 7. Newton's Cradle via Pivot Group Rotation (ZERO CPU buffer upload!)
      const cradlePeriod = 2.2;
      const tNorm = (time % cradlePeriod) / cradlePeriod;
      const maxTheta = 0.62 + cradleBoost;
      cradleBoost *= 0.96;

      let theta0 = 0;
      let theta4 = 0;

      if (tNorm < 0.5) {
        const subPhase = (tNorm / 0.5) * Math.PI;
        theta0 = -Math.sin(subPhase) * maxTheta;
        theta4 = 0;
      } else {
        const subPhase = ((tNorm - 0.5) / 0.5) * Math.PI;
        theta0 = 0;
        theta4 = Math.sin(subPhase) * maxTheta;
      }

      cradlePivots[0].rotation.z = theta0;
      cradlePivots[4].rotation.z = theta4;

      // Middle Balls Impact Shudder
      const isImpact = Math.abs(tNorm - 0.5) < 0.035 || tNorm < 0.035 || tNorm > 0.965;
      for (let i = 1; i <= 3; i++) {
        cradlePivots[i].rotation.z = isImpact ? Math.sin(time * 50) * 0.006 : 0;
      }

      // Shockwave Ring pulse on impact
      if (isImpact) {
        impactShockwave = 1.0;
        impactRing.position.x = tNorm < 0.5 ? -0.32 : 0.32;
      }
      if (impactShockwave > 0) {
        impactShockwave *= 0.88;
        impactRingMat.opacity = impactShockwave * 0.8;
        impactRing.scale.setScalar(1 + (1 - impactShockwave) * 2.5);
      } else {
        impactRingMat.opacity = 0;
      }

      // 8. Blinking Server LEDs
      if (ledTick % 4 === 0) {
        const mode = modeRef.current;
        if (mode === "matrix") {
          leftLeds.forEach((led, idx) => {
            const row = Math.floor(idx / 2);
            const isHead = ((Math.floor(time * 14) + row) % numRows) === 0;
            const isTail = ((Math.floor(time * 14) + row + 1) % numRows) === 0;
            (led.material as THREE.MeshBasicMaterial).color.setHex(
              isHead ? 0xffffff : isTail ? 0x4ade80 : 0x052e16
            );
          });
          rightLeds.forEach((item, idx) => {
            const isGreen = ((Math.floor(time * 16) + idx) % 4) === 0;
            (item.mesh.material as THREE.MeshBasicMaterial).color.setHex(
              isGreen ? 0x22c55e : 0x052e16
            );
          });
        } else if (mode === "visualizer") {
          leftLeds.forEach((led, idx) => {
            const row = Math.floor(idx / 2);
            const freq = Math.sin(time * 9 + (idx % 2) * 2.5) * 0.5 + 0.5;
            const on = row / numRows < freq;
            (led.material as THREE.MeshBasicMaterial).color.setHex(
              on ? 0xa855f7 : 0x1e1035
            );
          });
          rightLeds.forEach((item, idx) => {
            const blade = Math.floor(idx / 4);
            const freq = Math.sin(time * 11 + blade * 1.5) * 0.5 + 0.5;
            const on = (idx % 4) / 4 < freq;
            (item.mesh.material as THREE.MeshBasicMaterial).color.setHex(
              on ? item.baseColor : 0x111116
            );
          });
        } else if (mode === "specs") {
          leftLeds.forEach((led, idx) => {
            const row = Math.floor(idx / 2);
            const scan = Math.sin(time * 6 - row * 0.4) > 0.3;
            (led.material as THREE.MeshBasicMaterial).color.setHex(
              scan ? 0xf59e0b : 0x3d2003
            );
          });
          rightLeds.forEach((item) => {
            (item.mesh.material as THREE.MeshBasicMaterial).color.setHex(item.baseColor);
          });
        } else {
          leftLeds.forEach((led) => {
            const on = Math.random() > 0.35;
            (led.material as THREE.MeshBasicMaterial).color.setHex(
              on ? 0x00f0ff : 0x002244
            );
          });
          rightLeds.forEach((item) => {
            const on = Math.random() > 0.25;
            (item.mesh.material as THREE.MeshBasicMaterial).color.setHex(
              on ? item.baseColor : 0x111116
            );
          });
        }
      }

      // 9. Ambient Cyber Motes (Smooth object rotation: Zero GPU re-uploads)
      dustParticles.rotation.y = time * 0.05;

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
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      container.removeEventListener("click", onClick);
      cancelAnimationFrame(animId);
      if (idleTimer) clearTimeout(idleTimer);
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [autoSpinState, onDuckQuack, onModeChange]);

  return (
    <div className="relative w-full h-full">
      {/* WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none touch-none"
      />

      {/* Floating Futuristic Interactive HUD Control Bar */}
      <div className="absolute top-2.5 right-3 flex items-center gap-1.5 z-20 pointer-events-auto">
        {/* Auto-Spin Toggle Button */}
        <button
          onClick={() => setAutoSpinState((prev) => !prev)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[9px] font-mono font-bold transition-all shadow-sm ${
            autoSpinState
              ? "bg-[#00f0ff]/15 border-[#00f0ff]/40 text-[#00f0ff]"
              : "bg-white/5 border-white/10 text-white/40 hover:text-white/70"
          }`}
          title="Toggle 360° Auto Rotation"
        >
          <RotateCcw className={`w-2.5 h-2.5 ${autoSpinState ? "animate-spin" : ""}`} style={{ animationDuration: "6s" }} />
          <span>{autoSpinState ? "360° ON" : "PAUSED"}</span>
        </button>

        {/* Cyber Surge Energy Boost */}
        <button
          onClick={() => triggerPulseRef.current()}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md border border-amber-400/30 bg-amber-400/10 text-amber-300 text-[9px] font-mono font-bold hover:bg-amber-400/20 hover:border-amber-400/60 transition-all shadow-sm active:scale-95"
          title="Trigger Energy Pulse"
        >
          <Zap className="w-2.5 h-2.5 text-amber-300" />
          <span>SURGE</span>
        </button>

        {/* Recenter View Button */}
        <button
          onClick={() => resetViewRef.current()}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-white/10 bg-white/5 text-white/50 text-[9px] font-mono hover:text-white hover:border-white/30 transition-all shadow-sm active:scale-95"
          title="Reset to Front Angle"
        >
          <Eye className="w-2.5 h-2.5" />
        </button>
      </div>

      {/* Bottom Floating Status Pill */}
      <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between font-mono text-[8px] sm:text-[8.5px] text-white/50 pointer-events-none select-none z-10">
        <span className="bg-black/75 px-2.5 py-0.5 rounded-full border border-white/10 backdrop-blur-md flex items-center gap-1 text-white/70">
          <Sparkles className="w-2 h-2 text-[#00f0ff]" />
          Drag 360° · Click Knight or Surge
        </span>
        <span className="bg-black/75 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-md text-[#00f0ff] font-bold">
          120FPS LOCKED
        </span>
      </div>
    </div>
  );
};
