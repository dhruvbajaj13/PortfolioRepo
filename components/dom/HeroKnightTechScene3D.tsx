'use client';

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
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

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 460;
    const height = container.clientHeight || 345;

    // ── 1. Scene, Camera & High-Performance Renderer ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 6.2);
    camera.lookAt(0, 0.6, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      precision: "mediump",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // ── 2. Studio Lighting (Key, Fill, Rim & Ground Bounce) ──
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    // Warm key light (creates golden specular gleam)
    const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.4);
    keyLight.position.set(4.5, 6.5, 5.0);
    scene.add(keyLight);

    // Cool blue cyber fill light
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.1);
    fillLight.position.set(-5.0, 3.5, 3.0);
    scene.add(fillLight);

    // Luminous rim / backlight (highlights contours & horse crest)
    const rimLight = new THREE.DirectionalLight(0xa855f7, 2.0);
    rimLight.position.set(0, 5.0, -4.5);
    scene.add(rimLight);

    // Cyan accent light from beneath/front
    const bottomAccent = new THREE.PointLight(0x00f0ff, 1.6, 8.0);
    bottomAccent.position.set(0, -0.2, 2.0);
    scene.add(bottomAccent);

    // ── 3. Turntable Group (Allows 360° rotation) ──
    const turntable = new THREE.Group();
    turntable.position.set(0, -0.65, 0);
    scene.add(turntable);

    // ── 4. Ground Platform & Circuit Board Base ──
    // Circular cyber pedestal
    const groundGeo = new THREE.CylinderGeometry(3.3, 3.4, 0.14, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0b0e14,
      metalness: 0.8,
      roughness: 0.35,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.position.y = -0.07;
    turntable.add(groundMesh);

    // Metallic rim around the pedestal
    const rimRingGeo = new THREE.TorusGeometry(3.35, 0.04, 16, 64);
    const rimRingMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.5,
    });
    const rimRing = new THREE.Mesh(rimRingGeo, rimRingMat);
    rimRing.rotation.x = Math.PI / 2;
    rimRing.position.y = 0.01;
    turntable.add(rimRing);

    // Procedural Circuit Board Texture Canvas
    const circuitCanvas = document.createElement("canvas");
    circuitCanvas.width = 512;
    circuitCanvas.height = 512;
    const cctx = circuitCanvas.getContext("2d");
    if (cctx) {
      cctx.fillStyle = "#070a10";
      cctx.fillRect(0, 0, 512, 512);

      // Radial rings
      cctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
      cctx.lineWidth = 2;
      [70, 140, 210].forEach((r) => {
        cctx.beginPath();
        cctx.arc(256, 256, r, 0, Math.PI * 2);
        cctx.stroke();
      });

      // Circuit lines
      cctx.strokeStyle = "rgba(16, 185, 129, 0.35)";
      cctx.lineWidth = 1.5;
      for (let a = 0; a < 16; a++) {
        const rad = (a / 16) * Math.PI * 2;
        const x1 = 256 + Math.cos(rad) * 60;
        const y1 = 256 + Math.sin(rad) * 60;
        const x2 = 256 + Math.cos(rad) * 230;
        const y2 = 256 + Math.sin(rad) * 230;
        cctx.beginPath();
        cctx.moveTo(x1, y1);
        cctx.lineTo(x2, y2);
        cctx.stroke();

        // Contact pads
        cctx.fillStyle = "#f59e0b";
        cctx.beginPath();
        cctx.arc(x2, y2, 3, 0, Math.PI * 2);
        cctx.fill();
      }
    }
    const circuitTexture = new THREE.CanvasTexture(circuitCanvas);
    const topPlateGeo = new THREE.CircleGeometry(3.3, 64);
    const topPlateMat = new THREE.MeshStandardMaterial({
      map: circuitTexture,
      roughness: 0.4,
      metalness: 0.7,
      transparent: true,
      opacity: 0.95,
    });
    const topPlate = new THREE.Mesh(topPlateGeo, topPlateMat);
    topPlate.rotation.x = -Math.PI / 2;
    topPlate.position.y = 0.005;
    turntable.add(topPlate);

    // Soft Contact Shadows for realism
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
    createContactShadow(0, 0, 1.8, 1.8);       // Under Knight
    createContactShadow(-2.1, 0.1, 1.6, 1.6);  // Under Left Server
    createContactShadow(2.1, 0.1, 1.6, 1.6);   // Under Right Server

    // ── 5. Golden Unicorn Chess Knight (Main Centerpiece) ──
    const knightGroup = new THREE.Group();
    knightGroup.name = "knight";
    knightGroup.position.set(0, 0, 0);
    turntable.add(knightGroup);

    // Premium Rich Gold Material
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xdfa535,
      metalness: 0.88,
      roughness: 0.22,
      emissive: 0x422a06,
      emissiveIntensity: 0.2,
    });

    // Darker Antique Gold for Accents
    const darkGoldMat = new THREE.MeshStandardMaterial({
      color: 0xa87418,
      metalness: 0.85,
      roughness: 0.35,
    });

    // Lathed Chess Pedestal (Authentic Staunton profile)
    const lathePoints = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.68, 0),
      new THREE.Vector2(0.68, 0.07),
      new THREE.Vector2(0.61, 0.12),
      new THREE.Vector2(0.53, 0.18),
      new THREE.Vector2(0.56, 0.24),
      new THREE.Vector2(0.46, 0.34),
      new THREE.Vector2(0.40, 0.44),
      new THREE.Vector2(0.45, 0.50),
      new THREE.Vector2(0.36, 0.56),
      new THREE.Vector2(0, 0.56),
    ];
    const pedestalGeo = new THREE.LatheGeometry(lathePoints, 48);
    const pedestal = new THREE.Mesh(pedestalGeo, goldMat);
    knightGroup.add(pedestal);

    // Sculpted Horse Head (Extruded Profile with Chamfered Bevels)
    const knightShape = new THREE.Shape();
    knightShape.moveTo(-0.35, 0);
    // Arched crest going backward and up
    knightShape.quadraticCurveTo(-0.52, 0.45, -0.46, 0.95);
    knightShape.quadraticCurveTo(-0.42, 1.35, -0.25, 1.68);
    // Back of alert horse ear
    knightShape.lineTo(-0.22, 1.72);
    knightShape.lineTo(-0.16, 2.05); // Ear tip
    // Front of ear
    knightShape.lineTo(-0.06, 1.76);
    // Forehead slope down to snout
    knightShape.quadraticCurveTo(0.12, 1.62, 0.32, 1.48);
    // Muzzle / Snout curve
    knightShape.quadraticCurveTo(0.52, 1.35, 0.50, 1.18);
    knightShape.quadraticCurveTo(0.42, 1.05, 0.28, 1.10); // Mouth & lower jaw
    // Throat curve coming back in
    knightShape.quadraticCurveTo(0.12, 1.05, 0.08, 0.85);
    // Proud chest curve descending to base
    knightShape.quadraticCurveTo(0.04, 0.55, 0.25, 0);
    knightShape.closePath();

    const headGeo = new THREE.ExtrudeGeometry(knightShape, {
      depth: 0.36,
      bevelEnabled: true,
      bevelSegments: 5,
      bevelSize: 0.05,
      bevelThickness: 0.05,
      curveSegments: 28,
    });
    headGeo.center();
    const headMesh = new THREE.Mesh(headGeo, goldMat);
    headMesh.position.set(0.02, 1.42, 0);
    knightGroup.add(headMesh);

    // Mane Carved Waves
    for (let i = 0; i < 4; i++) {
      const maneGeo = new THREE.CylinderGeometry(0.06 - i * 0.008, 0.12, 0.28, 16);
      const mane = new THREE.Mesh(maneGeo, darkGoldMat);
      mane.position.set(-0.38 - i * 0.04, 1.95 - i * 0.28, 0);
      mane.rotation.z = -0.6 - i * 0.15;
      knightGroup.add(mane);
    }

    // Inset Obsidian Gem Eyes
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x050508,
      roughness: 0.05,
      metalness: 0.95,
    });
    [-0.20, 0.20].forEach((zPos) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.038, 16, 16), eyeMat);
      eye.position.set(0.24, 1.76, zPos);
      knightGroup.add(eye);
    });

    // Spiraled Golden Unicorn Horn with Glowing Cyan Tip
    const hornGroup = new THREE.Group();
    hornGroup.position.set(0.22, 1.96, 0);
    hornGroup.rotation.z = -Math.PI / 5;

    const hornConeGeo = new THREE.ConeGeometry(0.075, 0.65, 24);
    const hornCone = new THREE.Mesh(hornConeGeo, goldMat);
    hornCone.position.y = 0.32;
    hornGroup.add(hornCone);

    // Spiral coils around the horn
    for (let i = 0; i < 5; i++) {
      const coilR = 0.07 - i * 0.01;
      const coil = new THREE.Mesh(
        new THREE.TorusGeometry(coilR, 0.018, 8, 20),
        darkGoldMat
      );
      coil.position.y = 0.1 + i * 0.1;
      coil.rotation.x = Math.PI / 2 + 0.2;
      hornGroup.add(coil);
    }

    // Glowing cyan tip crystal
    const hornTipMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 1.2,
      metalness: 0.3,
      roughness: 0.1,
    });
    const hornTip = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.2, 16), hornTipMat);
    hornTip.position.y = 0.68;
    hornGroup.add(hornTip);

    // Light emission from the horn tip
    const hornGlowLight = new THREE.PointLight(0x00f0ff, 1.4, 2.5);
    hornGlowLight.position.set(0, 0.72, 0);
    hornGroup.add(hornGlowLight);

    knightGroup.add(hornGroup);

    // ── 6. Newton's Cradle Overhead with Real Conservation of Momentum ──
    const cradleGroup = new THREE.Group();
    cradleGroup.name = "cradle";
    cradleGroup.position.set(0, 3.1, 0);
    turntable.add(cradleGroup);

    // Polished Chrome Frame
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf5f5fa,
      metalness: 0.98,
      roughness: 0.04,
    });

    // Top horizontal crossbars (front and back rails)
    [-0.14, 0.14].forEach((zRail) => {
      const topRail = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 2.1, 16),
        chromeMat
      );
      topRail.rotation.z = Math.PI / 2;
      topRail.position.set(0, 0, zRail);
      cradleGroup.add(topRail);
    });

    // Vertical Frame Uprights with Chamfered Joints
    [-0.95, 0.95].forEach((xEnd) => {
      const arch = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 1.3, 16),
        chromeMat
      );
      arch.position.set(xEnd, -0.65, 0);
      cradleGroup.add(arch);

      // Horizontal connector cap
      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.34), chromeMat);
      cap.position.set(xEnd, 0, 0);
      cradleGroup.add(cap);
    });

    // 5 Suspended Chrome Spheres & Dual V-Wires
    const cradleBalls: THREE.Mesh[] = [];
    const wireLines: THREE.Line[] = [];
    const numBalls = 5;
    const ballR = 0.155;
    const stringLen = 1.05;
    const ballSpacing = 0.315;

    for (let i = 0; i < numBalls; i++) {
      const xRest = (i - 2) * ballSpacing;

      // Chrome Sphere with high specular precision
      const ballGeo = new THREE.SphereGeometry(ballR, 48, 48);
      const ball = new THREE.Mesh(ballGeo, chromeMat);
      ball.position.set(xRest, -stringLen, 0);
      cradleGroup.add(ball);
      cradleBalls.push(ball);

      // Suspension V-Wires (Front wire & Back wire to respective rails)
      [-0.14, 0.14].forEach((zRail) => {
        const wireGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(xRest, 0, zRail),
          new THREE.Vector3(xRest, -stringLen + ballR * 0.8, 0),
        ]);
        const wireMat = new THREE.LineBasicMaterial({
          color: 0xc8c8d5,
          transparent: true,
          opacity: 0.8,
        });
        const wire = new THREE.Line(wireGeo, wireMat);
        cradleGroup.add(wire);
        wireLines.push(wire);
      });
    }

    // ── 7. Left Server Rack on IC Chip Pedestal ──
    const makeICChipPedestal = (x: number, label: string) => {
      const chipGroup = new THREE.Group();
      chipGroup.position.set(x, 0, 0);

      // Dark Ceramic Chip Body
      const chipMat = new THREE.MeshStandardMaterial({
        color: 0x16161b,
        metalness: 0.35,
        roughness: 0.55,
      });
      const chipBody = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.1, 1.08), chipMat);
      chipBody.position.y = 0.05;
      chipGroup.add(chipBody);

      // Metallic Heat Spreader / Die in center
      const dieMat = new THREE.MeshStandardMaterial({
        color: 0x222228,
        metalness: 0.85,
        roughness: 0.2,
      });
      const die = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.02, 0.72), dieMat);
      die.position.y = 0.11;
      chipGroup.add(die);

      // Metallic IC Pins (32 total, 8 per side)
      const pinMat = new THREE.MeshStandardMaterial({
        color: 0xd8d8e2,
        metalness: 0.95,
        roughness: 0.15,
      });
      const pinCountPerSide = 7;
      const step = 0.11;
      for (let p = 0; p < pinCountPerSide; p++) {
        const offset = (p - (pinCountPerSide - 1) / 2) * step;

        // Front & Back pins
        [-0.56, 0.56].forEach((zPos) => {
          const pin = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.05, 0.09), pinMat);
          pin.position.set(offset, 0.04, zPos);
          chipGroup.add(pin);
        });

        // Left & Right pins
        [-0.56, 0.56].forEach((xPos) => {
          const pin = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.05, 0.045), pinMat);
          pin.position.set(xPos, 0.04, offset);
          chipGroup.add(pin);
        });
      }

      turntable.add(chipGroup);
      return chipGroup;
    };

    // Left Server Rack: Enterprise Telecom / Compute Unit
    makeICChipPedestal(-2.1, "DHRUV-AI");
    const leftRackGroup = new THREE.Group();
    leftRackGroup.name = "server";
    leftRackGroup.position.set(-2.1, 0.1, 0);
    turntable.add(leftRackGroup);

    // Chassis in brushed dark metal
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x111317,
      metalness: 0.7,
      roughness: 0.35,
    });
    const leftChassis = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.85, 0.68), chassisMat);
    leftChassis.position.y = 0.925;
    leftRackGroup.add(leftChassis);

    // Front Panel with Vertical Air Intake Louvers & Blue LED arrays
    const frontPanelMat = new THREE.MeshStandardMaterial({
      color: 0x1a1c22,
      metalness: 0.6,
      roughness: 0.5,
    });
    const frontPanel = new THREE.Mesh(new THREE.BoxGeometry(0.78, 1.75, 0.05), frontPanelMat);
    frontPanel.position.set(0, 0.925, 0.35);
    leftRackGroup.add(frontPanel);

    // Dynamic Blinking Blue & Cyan LEDs (Enterprise Activity)
    const leftLeds: THREE.Mesh[] = [];
    const ledBlueMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const ledDimMat = new THREE.MeshBasicMaterial({ color: 0x002244 });
    const numRows = 14;
    for (let r = 0; r < numRows; r++) {
      [-0.26, 0.26].forEach((xCol) => {
        const led = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 0.02), ledBlueMat);
        led.position.set(xCol, 0.22 + r * 0.11, 0.38);
        leftRackGroup.add(led);
        leftLeds.push(led);
      });
    }

    // ── 8. Right Server Rack on IC Chip Pedestal (Glass Cabinet with Colorful Blades) ──
    makeICChipPedestal(2.1, "OCTA-CORE");
    const rightRackGroup = new THREE.Group();
    rightRackGroup.name = "server";
    rightRackGroup.position.set(2.1, 0.1, 0);
    turntable.add(rightRackGroup);

    // Main cabinet body
    const rightChassis = new THREE.Mesh(new THREE.BoxGeometry(0.88, 1.85, 0.68), chassisMat);
    rightChassis.position.y = 0.925;
    rightRackGroup.add(rightChassis);

    // Stacked Server Blades (6 units) with multicolored status LEDs
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

      // Handle on blade
      const handleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });
      [-0.32, 0.32].forEach((hx) => {
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.12, 0.04), handleMat);
        handle.position.set(hx, bladeY, 0.34);
        rightRackGroup.add(handle);
      });

      // Cluster of 4 LEDs per blade
      for (let l = 0; l < 4; l++) {
        const col = ledColors[(b + l) % ledColors.length];
        const ledMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.022, 12, 12),
          new THREE.MeshBasicMaterial({ color: col })
        );
        ledMesh.position.set(-0.16 + l * 0.1, bladeY, 0.34);
        rightRackGroup.add(ledMesh);
        rightLeds.push({ mesh: ledMesh, baseColor: col });
      }
    }

    // Sleek Tempered Glass Door with Cyan Tint
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.28,
      metalness: 0.3,
      roughness: 0.08,
    });
    const glassDoor = new THREE.Mesh(new THREE.BoxGeometry(0.84, 1.78, 0.03), glassMat);
    glassDoor.position.set(0, 0.925, 0.36);
    rightRackGroup.add(glassDoor);

    // ── 9. Stylized Background Clouds & Cyber Dust Particles ──
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.9,
      metalness: 0.1,
      transparent: true,
      opacity: 0.35,
    });
    // Cloud puffs in distance
    const cloudPuffs = [
      { x: -2.8, y: 3.2, z: -2.2, r: 0.7 },
      { x: -2.1, y: 3.5, z: -2.0, r: 0.9 },
      { x: 2.2, y: 3.4, z: -2.1, r: 0.85 },
      { x: 2.9, y: 3.1, z: -2.3, r: 0.65 },
    ];
    cloudPuffs.forEach((cp) => {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(cp.r, 20, 20), cloudMat);
      puff.position.set(cp.x, cp.y, cp.z);
      turntable.add(puff);
    });

    // Ambient floating Cyber Dust Motes
    const dustCount = 80;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    const dustOffsets = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 6;
      dustPos[i * 3 + 1] = Math.random() * 3.8;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 5;
      dustOffsets[i] = Math.random() * Math.PI * 2;
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

    // ── 10. Interactive 360° Drag & Inertia ──
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let angularVelocityY = 0;
    let tiltVelocityX = 0;
    let currentTiltX = 0;
    let autoSpin = true;
    let idleTimer: NodeJS.Timeout | null = null;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      autoSpin = false;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
      if (idleTimer) clearTimeout(idleTimer);
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const dx = clientX - prevMouseX;
      const dy = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      angularVelocityY = dx * 0.008;
      tiltVelocityX = dy * 0.003;
      turntable.rotation.y += angularVelocityY;
      currentTiltX = Math.max(-0.2, Math.min(0.25, currentTiltX + tiltVelocityX));
      turntable.rotation.x = currentTiltX;
    };

    const onPointerUp = () => {
      isDragging = false;
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        autoSpin = true;
      }, 3500);
    };

    container.addEventListener("mousedown", onPointerDown);
    container.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("touchend", onPointerUp);

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
                "⚔️ 1,100+ DSA Problems Solved!",
                "🦄 Unicorn Full-Stack & AI Engineer",
                "✨ Clean Code & Optimal Time Complexity",
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
            cradleBoost = 0.45;
            if (onDuckQuack) {
              onDuckQuack("🔁 Newton's Cradle: Algorithmic Momentum Transfer!");
            }
            return;
          }
          hit = hit.parent;
        }
      }
    };
    container.addEventListener("click", onClick);

    // ── 11. 60FPS Physics & Rendering Loop ──
    let animId: number;
    let time = 0;
    let knightHop = 0;
    let knightHopSpeed = 0;
    let cradleBoost = 0;
    let ledTick = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.016;
      ledTick++;

      // 1. Turntable rotation physics (Auto-spin & Drag damping)
      if (autoSpin && !isDragging) {
        turntable.rotation.y += 0.0055;
        turntable.rotation.x += (0 - turntable.rotation.x) * 0.05;
      } else if (!isDragging) {
        turntable.rotation.y += angularVelocityY;
        angularVelocityY *= 0.94;
        turntable.rotation.x += (currentTiltX - turntable.rotation.x) * 0.08;
      }

      // 2. Knight hop animation
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
      hornTipMat.emissiveIntensity = 0.9 + Math.sin(time * 3.5) * 0.6;
      hornGlowLight.intensity = 1.2 + Math.sin(time * 3.5) * 0.6;

      // 4. Newton's Cradle Realistic Momentum Transfer Physics
      const cradlePeriod = 2.2;
      const tNorm = (time % cradlePeriod) / cradlePeriod; // 0 to 1
      const maxTheta = 0.62 + cradleBoost;
      cradleBoost *= 0.96; // Smooth decay of click boost

      let theta0 = 0;
      let theta4 = 0;

      if (tNorm < 0.5) {
        // Half 1: Left sphere (Ball 0) swings out and returns
        const subPhase = (tNorm / 0.5) * Math.PI;
        theta0 = -Math.sin(subPhase) * maxTheta;
        theta4 = 0;
      } else {
        // Half 2: Right sphere (Ball 4) swings out and returns
        const subPhase = ((tNorm - 0.5) / 0.5) * Math.PI;
        theta0 = 0;
        theta4 = Math.sin(subPhase) * maxTheta;
      }

      // Update Ball 0 (Leftmost)
      const x0Rest = (0 - 2) * ballSpacing;
      cradleBalls[0].position.x = x0Rest + Math.sin(theta0) * stringLen;
      cradleBalls[0].position.y = -Math.cos(theta0) * stringLen;

      // Middle Balls (1, 2, 3) stay stationary with subtle impact shudder
      const isImpact = Math.abs(tNorm - 0.5) < 0.04 || tNorm < 0.04 || tNorm > 0.96;
      for (let i = 1; i <= 3; i++) {
        const xRest = (i - 2) * ballSpacing;
        cradleBalls[i].position.x = xRest;
        cradleBalls[i].position.y = -stringLen + (isImpact ? Math.sin(time * 50) * 0.008 : 0);
      }

      // Update Ball 4 (Rightmost)
      const x4Rest = (4 - 2) * ballSpacing;
      cradleBalls[4].position.x = x4Rest + Math.sin(theta4) * stringLen;
      cradleBalls[4].position.y = -Math.cos(theta4) * stringLen;

      // Update wire suspension lines dynamically
      for (let i = 0; i < numBalls; i++) {
        const ballPos = cradleBalls[i].position;
        const xRest = (i - 2) * ballSpacing;

        // Front wire (rail at z = -0.14)
        const frontWire = wireLines[i * 2];
        const fPos = frontWire.geometry.attributes.position.array as Float32Array;
        fPos[0] = xRest; fPos[1] = 0; fPos[2] = -0.14;
        fPos[3] = ballPos.x; fPos[4] = ballPos.y + ballR * 0.8; fPos[5] = 0;
        frontWire.geometry.attributes.position.needsUpdate = true;

        // Back wire (rail at z = +0.14)
        const backWire = wireLines[i * 2 + 1];
        const bPos = backWire.geometry.attributes.position.array as Float32Array;
        bPos[0] = xRest; bPos[1] = 0; bPos[2] = 0.14;
        bPos[3] = ballPos.x; bPos[4] = ballPos.y + ballR * 0.8; bPos[5] = 0;
        backWire.geometry.attributes.position.needsUpdate = true;
      }

      // 5. Interactive Mode-Reactive Server LEDs
      if (ledTick % 4 === 0) {
        const mode = modeRef.current;
        if (mode === "matrix") {
          // Matrix cascade: digital green streaming down the rack
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
          // Equalizer audio spectrum bouncing
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
          // Golden Neofetch scan line
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
          // Terminal mode: High-traffic enterprise network activity
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

      // 6. Cyber Dust Gentle Float
      const dPosArr = dustGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < dustCount; i++) {
        dPosArr[i * 3 + 1] =
          dustPos[i * 3 + 1] + Math.sin(time + dustOffsets[i]) * 0.18;
      }
      dustGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // Responsive Resize Handler
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
      container.removeEventListener("mousedown", onPointerDown);
      container.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchend", onPointerUp);
      container.removeEventListener("click", onClick);
      cancelAnimationFrame(animId);
      if (idleTimer) clearTimeout(idleTimer);
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onDuckQuack, onModeChange]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
    />
  );
};
