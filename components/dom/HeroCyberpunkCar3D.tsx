'use client';

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Zap, Gauge, Volume2, VolumeX, Sparkles, Navigation } from "lucide-react";

export interface HeroCyberpunkCar3DProps {
  className?: string;
}

export const HeroCyberpunkCar3D: React.FC<HeroCyberpunkCar3DProps> = ({ className = "" }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isBoosting, setIsBoosting] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(85);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // References to communicate with Three.js animation loop without re-renders
  const boostStateRef = useRef(false);
  const targetSpeedRef = useRef(85);
  const audioContextRef = useRef<AudioContext | null>(null);
  const engineGainRef = useRef<GainNode | null>(null);
  const engineOscRef = useRef<OscillatorNode | null>(null);

  // Synthesize futuristic cyberpunk turbo engine audio via Web Audio API (Zero external assets)
  const initAudio = useCallback(() => {
    if (audioContextRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(55, ctx.currentTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      gain.gain.setValueAtTime(soundEnabled ? 0.04 : 0, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      engineOscRef.current = osc;
      engineGainRef.current = gain;
    } catch {
      // Audio autoplay blocked or not supported
    }
  }, [soundEnabled]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (!audioContextRef.current) {
      initAudio();
    }
    if (engineGainRef.current && audioContextRef.current) {
      engineGainRef.current.gain.setTargetAtTime(next ? 0.04 : 0, audioContextRef.current.currentTime, 0.1);
    }
  };

  const handleBoostToggle = () => {
    const next = !boostStateRef.current;
    boostStateRef.current = next;
    setIsBoosting(next);
    targetSpeedRef.current = next ? 285 : 85;

    if (soundEnabled && audioContextRef.current && engineOscRef.current && engineGainRef.current) {
      const now = audioContextRef.current.currentTime;
      if (next) {
        engineOscRef.current.frequency.setTargetAtTime(140, now, 0.3);
        engineGainRef.current.gain.setTargetAtTime(0.08, now, 0.2);
      } else {
        engineOscRef.current.frequency.setTargetAtTime(55, now, 0.4);
        engineGainRef.current.gain.setTargetAtTime(0.04, now, 0.3);
      }
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 360;

    // ── 1. WebGL Scene, Camera & Renderer ──
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0e051c, 0.018); // Deep Cyberpunk Violet Atmospheric Fog

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 250);
    // 3rd-person chase camera positioned just behind and slightly elevated
    camera.position.set(0, 1.45, 4.3);
    camera.lookAt(0, 0.85, -15);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
      precision: "mediump",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.setClearColor(0x0a0316, 1);
    container.appendChild(renderer.domElement);

    // ── 2. Cinematic Lighting ──
    const ambientLight = new THREE.AmbientLight(0x38185c, 1.2);
    scene.add(ambientLight);

    // Top Key Light
    const topKey = new THREE.DirectionalLight(0xff66cc, 1.8);
    topKey.position.set(0, 8, -5);
    scene.add(topKey);

    // Cyan City Rim Light
    const cyanRim = new THREE.DirectionalLight(0x00f0ff, 1.6);
    cyanRim.position.set(-6, 3, 2);
    scene.add(cyanRim);

    // Hot Magenta Ground Fill
    const magentaFill = new THREE.PointLight(0xff0066, 3.2, 14);
    magentaFill.position.set(0, 0.3, 2.0);
    scene.add(magentaFill);

    // ── 3. Procedural Textures (Zero Network Requests) ──
    // A. Building Window Grid Texture
    const createBuildingTexture = (tint: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 512;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#0a0a14";
      ctx.fillRect(0, 0, 256, 512);

      // Grid of illuminated windows
      const rows = 32;
      const cols = 8;
      const winW = 16;
      const winH = 8;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const rand = Math.random();
          if (rand > 0.45) {
            ctx.fillStyle = rand > 0.88 ? tint : rand > 0.7 ? "#00f0ff" : rand > 0.55 ? "#ffea00" : "#ffffff";
            ctx.shadowColor = ctx.fillStyle;
            ctx.shadowBlur = rand > 0.8 ? 6 : 0;
            ctx.fillRect(16 + c * 28, 12 + r * 15, winW, winH);
          }
        }
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      return tex;
    };

    // B. Neon Japanese Kanji Billboard "どこかに" (from reference image)
    const createKanjiSignTexture = (text: string, bgColor: string, neonColor: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 96;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, 256, 96);
      ctx.lineWidth = 4;
      ctx.strokeStyle = neonColor;
      ctx.strokeRect(4, 4, 248, 88);

      ctx.fillStyle = neonColor;
      ctx.font = "bold 44px 'Hiragino Sans', 'Noto Sans JP', 'Segoe UI', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = neonColor;
      ctx.shadowBlur = 12;
      ctx.fillText(text, 128, 48);

      const tex = new THREE.CanvasTexture(canvas);
      return tex;
    };

    // C. Exhaust Bloom Glow Sprite Texture
    const createGlowTexture = (colorStop: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext("2d")!;
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.2, colorStop);
      grad.addColorStop(0.55, "rgba(255, 0, 128, 0.4)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(canvas);
    };

    // ── 4. The Wet Reflective Asphalt Highway ──
    const roadGroup = new THREE.Group();
    scene.add(roadGroup);

    const roadGeo = new THREE.PlaneGeometry(16, 200, 1, 32);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x07050e,
      roughness: 0.22,
      metalness: 0.85,
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, -60);
    roadGroup.add(road);

    // Glowing Neon Lane Markings
    const laneDashCount = 28;
    const laneDashMeshes: THREE.Mesh[] = [];
    const laneDashGeo = new THREE.PlaneGeometry(0.18, 2.4);
    const laneDashMat = new THREE.MeshBasicMaterial({
      color: 0xff0088,
      transparent: true,
      opacity: 0.85,
    });

    for (let i = 0; i < laneDashCount; i++) {
      const dash = new THREE.Mesh(laneDashGeo, laneDashMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(0, 0.015, -i * 7);
      roadGroup.add(dash);
      laneDashMeshes.push(dash);
    }

    // Outer Neon Highway Guardrails (Left: Cyan, Right: Hot Magenta)
    const railGeo = new THREE.BoxGeometry(0.12, 0.35, 200);
    const leftRailMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const rightRailMat = new THREE.MeshBasicMaterial({ color: 0xff0066 });

    const leftRail = new THREE.Mesh(railGeo, leftRailMat);
    leftRail.position.set(-6.5, 0.18, -60);
    roadGroup.add(leftRail);

    const rightRail = new THREE.Mesh(railGeo, rightRailMat);
    rightRail.position.set(6.5, 0.18, -60);
    roadGroup.add(rightRail);

    // ── 5. Cyberpunk City Skyscrapers & Billboards ──
    const buildingsGroup = new THREE.Group();
    scene.add(buildingsGroup);

    interface BuildingItem {
      mesh: THREE.Mesh;
      baseZ: number;
    }
    const buildings: BuildingItem[] = [];

    const bldgPalette = ["#ff0088", "#00f0ff", "#a855f7", "#ffea00"];
    const bldgCount = 36;

    for (let i = 0; i < bldgCount; i++) {
      const isLeft = i % 2 === 0;
      const side = isLeft ? -1 : 1;
      const x = side * (9.5 + Math.random() * 9);
      const z = -((i * 5.2) % 180);
      const bldgW = 4.5 + Math.random() * 3.5;
      const bldgH = 18 + Math.random() * 26;
      const bldgD = 5 + Math.random() * 4;

      const tex = createBuildingTexture(bldgPalette[i % bldgPalette.length]);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x0c0b16,
        map: tex,
        metalness: 0.6,
        roughness: 0.4,
      });

      const geo = new THREE.BoxGeometry(bldgW, bldgH, bldgD);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, bldgH / 2 - 0.2, z);
      buildingsGroup.add(mesh);
      buildings.push({ mesh, baseZ: z });

      // Add Glowing Neon Kanji / BAR signs to selected buildings (Just like reference image!)
      if (i % 3 === 0) {
        const signText = i % 6 === 0 ? "どこかに" : i % 4 === 0 ? "BAR" : "CYBER";
        const signBg = i % 4 === 0 ? "#120008" : "#001018";
        const signColor = i % 4 === 0 ? "#ff0055" : "#00f0ff";
        const signTex = createKanjiSignTexture(signText, signBg, signColor);

        const signGeo = new THREE.PlaneGeometry(3.6, 1.4);
        const signMat = new THREE.MeshBasicMaterial({
          map: signTex,
          transparent: true,
        });
        const signMesh = new THREE.Mesh(signGeo, signMat);
        signMesh.position.set(
          x + (isLeft ? bldgW / 2 + 0.05 : -bldgW / 2 - 0.05),
          6 + Math.random() * 6,
          z + 1.2
        );
        signMesh.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2;
        buildingsGroup.add(signMesh);
      }
    }

    // ── 6. Speed Light Streaks (Elongated Neon Motion Trails on Sides) ──
    const streakCount = 45;
    const streakMeshes: { mesh: THREE.Mesh; speedMult: number }[] = [];
    const streakColors = [0xff0066, 0x00f0ff, 0xffea00, 0xa855f7, 0xffffff];

    for (let i = 0; i < streakCount; i++) {
      const streakLength = 3.5 + Math.random() * 6;
      const streakGeo = new THREE.BoxGeometry(0.04, 0.04, streakLength);
      const col = streakColors[i % streakColors.length];
      const streakMat = new THREE.MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: 0.75 + Math.random() * 0.25,
      });
      const streak = new THREE.Mesh(streakGeo, streakMat);

      const side = Math.random() > 0.5 ? 1 : -1;
      const x = side * (5.5 + Math.random() * 6.5);
      const y = 0.4 + Math.random() * 3.5;
      const z = -Math.random() * 120;
      streak.position.set(x, y, z);

      scene.add(streak);
      streakMeshes.push({ mesh: streak, speedMult: 0.8 + Math.random() * 0.5 });
    }

    // ── 7. Detailed Procedural Cyberpunk Supercar ──
    const carRoot = new THREE.Group();
    carRoot.position.set(0, 0.42, 0);
    scene.add(carRoot);

    // Car Body Materials
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x16171d, // Dark titanium gunmetal body
      metalness: 0.92,
      roughness: 0.22,
    });

    const darkAccentMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0c,
      metalness: 0.95,
      roughness: 0.35,
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x040810,
      metalness: 0.98,
      roughness: 0.08,
    });

    // Main Lower Chassis Wedge
    const lowerBodyGeo = new THREE.BoxGeometry(1.85, 0.34, 3.8);
    const lowerBody = new THREE.Mesh(lowerBodyGeo, chassisMat);
    lowerBody.position.set(0, 0, 0);
    carRoot.add(lowerBody);

    // Front Slanted Hood Wedge
    const hoodGeo = new THREE.BoxGeometry(1.65, 0.22, 1.2);
    const hood = new THREE.Mesh(hoodGeo, chassisMat);
    hood.position.set(0, -0.04, -1.6);
    hood.rotation.x = 0.12;
    carRoot.add(hood);

    // Rear Quarter Flare Panels (Wide Hips)
    const leftHipGeo = new THREE.BoxGeometry(0.24, 0.38, 1.8);
    const leftHip = new THREE.Mesh(leftHipGeo, chassisMat);
    leftHip.position.set(-0.95, 0.02, 0.7);
    carRoot.add(leftHip);

    const rightHip = new THREE.Mesh(leftHipGeo, chassisMat);
    rightHip.position.set(0.95, 0.02, 0.7);
    carRoot.add(rightHip);

    // Tapered Cockpit Canopy / Roof
    const cockpitGeo = new THREE.BoxGeometry(1.25, 0.38, 1.7);
    const cockpit = new THREE.Mesh(cockpitGeo, glassMat);
    cockpit.position.set(0, 0.32, -0.15);
    carRoot.add(cockpit);

    // Rear Louvers / Aerodynamic Engine Slats
    for (let l = 0; l < 4; l++) {
      const slatGeo = new THREE.BoxGeometry(1.15, 0.035, 0.14);
      const slat = new THREE.Mesh(slatGeo, darkAccentMat);
      slat.position.set(0, 0.28 - l * 0.05, 0.85 + l * 0.22);
      slat.rotation.x = -0.18;
      carRoot.add(slat);
    }

    // Rear Wing / Aerodynamic Spoiler (Cyberpunk Quadra look)
    const wingBladeGeo = new THREE.BoxGeometry(1.92, 0.045, 0.38);
    const wingBlade = new THREE.Mesh(wingBladeGeo, darkAccentMat);
    wingBlade.position.set(0, 0.44, 1.82);
    carRoot.add(wingBlade);

    // Wing Struts
    const strutGeo = new THREE.BoxGeometry(0.04, 0.22, 0.22);
    const leftStrut = new THREE.Mesh(strutGeo, darkAccentMat);
    leftStrut.position.set(-0.62, 0.32, 1.8);
    carRoot.add(leftStrut);

    const rightStrut = new THREE.Mesh(strutGeo, darkAccentMat);
    rightStrut.position.set(0.62, 0.32, 1.8);
    carRoot.add(rightStrut);

    // ── Signature Blinding Neon Rear Light Bar (Exact match to image!) ──
    const tailLightBarGeo = new THREE.BoxGeometry(1.72, 0.075, 0.08);
    const tailLightBarMat = new THREE.MeshBasicMaterial({
      color: 0xff0044,
    });
    const tailLightBar = new THREE.Mesh(tailLightBarGeo, tailLightBarMat);
    tailLightBar.position.set(0, 0.14, 1.91);
    carRoot.add(tailLightBar);

    // Secondary lower neon accent line
    const lowerNeonGeo = new THREE.BoxGeometry(1.6, 0.03, 0.05);
    const lowerNeonMat = new THREE.MeshBasicMaterial({ color: 0xff0077 });
    const lowerNeon = new THREE.Mesh(lowerNeonGeo, lowerNeonMat);
    lowerNeon.position.set(0, 0.04, 1.91);
    carRoot.add(lowerNeon);

    // Tail Light Bloom Flare Sprite (Additive Blending for high-intensity glow)
    const glowTex = createGlowTexture("#ff0044");
    const tailFlareGeo = new THREE.PlaneGeometry(2.8, 0.9);
    const tailFlareMat = new THREE.MeshBasicMaterial({
      map: glowTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.85,
      depthWrite: false,
    });
    const tailFlare = new THREE.Mesh(tailFlareGeo, tailFlareMat);
    tailFlare.position.set(0, 0.14, 1.95);
    carRoot.add(tailFlare);

    // ── Dual Turbo Jet Exhaust Thrusters & Flaming Plasma Trails ──
    const exhaustGroup = new THREE.Group();
    carRoot.add(exhaustGroup);

    // Exhaust Metal Rings
    const exhaustPortGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.22, 16);
    exhaustPortGeo.rotateX(Math.PI / 2);
    const exhaustPortMat = new THREE.MeshStandardMaterial({
      color: 0x222226,
      metalness: 0.95,
      roughness: 0.1,
    });

    const leftPort = new THREE.Mesh(exhaustPortGeo, exhaustPortMat);
    leftPort.position.set(-0.46, -0.04, 1.88);
    exhaustGroup.add(leftPort);

    const rightPort = new THREE.Mesh(exhaustPortGeo, exhaustPortMat);
    rightPort.position.set(0.46, -0.04, 1.88);
    exhaustGroup.add(rightPort);

    // Dynamic Flame Plumes (Cones pointed backward onto the asphalt)
    const flameGeo = new THREE.ConeGeometry(0.16, 2.4, 16);
    flameGeo.rotateX(-Math.PI / 2);
    flameGeo.translate(0, 0, 1.2);

    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xff00aa,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const leftFlame = new THREE.Mesh(flameGeo, flameMat);
    leftFlame.position.set(-0.46, -0.04, 1.95);
    exhaustGroup.add(leftFlame);

    const rightFlame = new THREE.Mesh(flameGeo, flameMat);
    rightFlame.position.set(0.46, -0.04, 1.95);
    exhaustGroup.add(rightFlame);

    // Inner bright white/cyan plasma core
    const innerFlameGeo = new THREE.ConeGeometry(0.08, 1.8, 16);
    innerFlameGeo.rotateX(-Math.PI / 2);
    innerFlameGeo.translate(0, 0, 0.9);
    const innerFlameMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const leftInnerFlame = new THREE.Mesh(innerFlameGeo, innerFlameMat);
    leftInnerFlame.position.set(-0.46, -0.04, 1.95);
    exhaustGroup.add(leftInnerFlame);

    const rightInnerFlame = new THREE.Mesh(innerFlameGeo, innerFlameMat);
    rightInnerFlame.position.set(0.46, -0.04, 1.95);
    exhaustGroup.add(rightInnerFlame);

    // Ground Flame Glow Reflection Flares
    const groundFlameFlareMat = new THREE.MeshBasicMaterial({
      map: glowTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.9,
      depthWrite: false,
    });
    const groundFlameGeo = new THREE.PlaneGeometry(1.4, 3.2);
    groundFlameGeo.rotateX(-Math.PI / 2);

    const leftGroundFlame = new THREE.Mesh(groundFlameGeo, groundFlameFlareMat);
    leftGroundFlame.position.set(-0.46, 0.02, 3.0);
    scene.add(leftGroundFlame);

    const rightGroundFlame = new THREE.Mesh(groundFlameGeo, groundFlameFlareMat);
    rightGroundFlame.position.set(0.46, 0.02, 3.0);
    scene.add(rightGroundFlame);

    // ── Wheels (4 High-Performance Cyber Wheels) ──
    const wheelGroup = new THREE.Group();
    carRoot.add(wheelGroup);

    const tireGeo = new THREE.CylinderGeometry(0.33, 0.33, 0.32, 20);
    tireGeo.rotateZ(Math.PI / 2);
    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x08080a,
      roughness: 0.8,
      metalness: 0.2,
    });

    const rimGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.33, 16);
    rimGeo.rotateZ(Math.PI / 2);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.4,
    });

    const createWheel = (x: number, y: number, z: number) => {
      const g = new THREE.Group();
      const tire = new THREE.Mesh(tireGeo, tireMat);
      const rim = new THREE.Mesh(rimGeo, rimMat);
      g.add(tire);
      g.add(rim);
      g.position.set(x, y, z);
      wheelGroup.add(g);
      return g;
    };

    const wheelFL = createWheel(-0.95, -0.12, -1.25);
    const wheelFR = createWheel(0.95, -0.12, -1.25);
    const wheelRL = createWheel(-0.98, -0.12, 1.25);
    const wheelRR = createWheel(0.98, -0.12, 1.25);
    const wheels = [wheelFL, wheelFR, wheelRL, wheelRR];

    // ── 8. Interactive Mouse Steering & Parallax ──
    let targetCarX = 0;
    let targetCarRotY = 0;
    let targetCarRoll = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
      targetCarX = normX * 2.2; // Move across lanes
      targetCarRotY = -normX * 0.12; // Slight yaw into turn
      targetCarRoll = normX * 0.08; // Slight roll
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // ── 9. Render & Animation Loop ──
    let animId: number;
    let isVisible = true;
    let clock = 0;
    let speed = 85;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      clock += 0.016;

      // Smooth Speed Interpolation
      const targetSpeed = targetSpeedRef.current;
      speed += (targetSpeed - speed) * 0.08;

      // Update React UI Speed state at throttled interval
      if (Math.round(clock * 60) % 5 === 0) {
        setCurrentSpeed(Math.round(speed));
      }

      const speedFactor = speed / 85;

      // Move Lane Markings
      const dashMove = 0.35 * speedFactor;
      laneDashMeshes.forEach((dash) => {
        dash.position.z += dashMove;
        if (dash.position.z > 8) {
          dash.position.z -= laneDashCount * 7;
        }
      });

      // Move Skyscrapers & Infinite City Recycling
      const bldgMove = 0.45 * speedFactor;
      buildings.forEach((item) => {
        item.mesh.position.z += bldgMove;
        if (item.mesh.position.z > 22) {
          item.mesh.position.z -= 180;
        }
      });

      // Move Speed Light Streaks
      streakMeshes.forEach((item) => {
        item.mesh.position.z += 0.75 * speedFactor * item.speedMult;
        if (item.mesh.position.z > 12) {
          item.mesh.position.z = -120 - Math.random() * 20;
        }
        // Elongate streaks in boost mode
        const boostStretch = boostStateRef.current ? 2.4 : 1.0;
        item.mesh.scale.z = boostStretch;
      });

      // Rotate Wheels
      const wheelRotSpeed = 0.45 * speedFactor;
      wheels.forEach((w) => {
        w.rotation.x += wheelRotSpeed;
      });

      // Steer Front Wheels
      wheelFL.rotation.y = targetCarRotY * 1.5;
      wheelFR.rotation.y = targetCarRotY * 1.5;

      // Smooth Car Chassis Movement & Physics
      carRoot.position.x += (targetCarX - carRoot.position.x) * 0.08;
      carRoot.rotation.y += (targetCarRotY - carRoot.rotation.y) * 0.08;
      carRoot.rotation.z += (targetCarRoll - carRoot.rotation.z) * 0.08;

      // High-Speed Engine Rumble Vibration
      const rumble = Math.sin(clock * 45) * (boostStateRef.current ? 0.022 : 0.008);
      carRoot.position.y = 0.42 + rumble;

      // Pitch car down at rear under acceleration squat
      const squat = boostStateRef.current ? -0.045 : -0.015;
      carRoot.rotation.x += (squat - carRoot.rotation.x) * 0.1;

      // Dual Exhaust Plasma Flames Scaling & Pulsing
      const flamePulse = Math.sin(clock * 60) * 0.15;
      const boostFlameLen = boostStateRef.current ? 2.6 + flamePulse : 0.9 + flamePulse * 0.5;
      leftFlame.scale.set(1.0, 1.0, boostFlameLen);
      rightFlame.scale.set(1.0, 1.0, boostFlameLen);
      leftInnerFlame.scale.set(1.0, 1.0, boostFlameLen * 0.85);
      rightInnerFlame.scale.set(1.0, 1.0, boostFlameLen * 0.85);

      // Follow car ground flame reflections
      leftGroundFlame.position.x = carRoot.position.x - 0.46;
      rightGroundFlame.position.x = carRoot.position.x + 0.46;
      const groundGlowOpacity = boostStateRef.current ? 0.95 : 0.5;
      groundFlameFlareMat.opacity = groundGlowOpacity + Math.sin(clock * 40) * 0.1;

      // Dynamic Camera Reaction to Acceleration
      const targetCamZ = boostStateRef.current ? 4.9 : 4.3;
      camera.position.z += (targetCamZ - camera.position.z) * 0.06;
      camera.position.x += (carRoot.position.x * 0.35 - camera.position.x) * 0.08;

      // Render Scene
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
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      onClick={handleBoostToggle}
      className={`relative w-full h-full cursor-pointer select-none overflow-hidden group/carscene ${className}`}
      title="Click anywhere to activate Nitro Boost!"
    >
      {/* ── Top HUD Header: Game Status & Telemetry ── */}
      <div className="absolute top-2.5 inset-x-3 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-[9px] sm:text-[10px] text-cyan-300 font-bold tracking-widest uppercase">
            NIGHT DRIVE · TOKYO
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSound();
            }}
            className="p-1 rounded-lg bg-black/60 border border-white/10 text-white/60 hover:text-white hover:border-cyan-400/50 transition-colors backdrop-blur-md"
            title={soundEnabled ? "Mute Engine" : "Enable Synth Engine Sound"}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-white/50" />
            )}
          </button>

          {/* 60 FPS Badge */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[9px] font-mono text-emerald-400 font-bold backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            60 FPS
          </div>
        </div>
      </div>

      {/* ── Center Click-to-Run Interactive Action Prompt ── */}
      <div className="absolute top-11 inset-x-0 flex justify-center pointer-events-none z-20">
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] sm:text-xs font-mono font-bold tracking-wider transition-all duration-300 shadow-lg ${
            isBoosting
              ? "bg-fuchsia-600/30 border-fuchsia-400 text-fuchsia-200 shadow-[0_0_20px_rgba(217,70,239,0.5)] scale-105"
              : "bg-black/70 border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.25)] hover:border-cyan-400"
          }`}
        >
          <Zap className={`w-3.5 h-3.5 ${isBoosting ? "text-yellow-300 animate-bounce" : "text-cyan-400"}`} />
          <span>
            {isBoosting ? "🔥 NITRO ACTIVE (CLICK TO CRUISE)" : "⚡ CLICK CAR TO ACCELERATE (NITRO)"}
          </span>
        </div>
      </div>

      {/* ── Bottom-Left Mini-Map Radar HUD (Exact from Reference Image!) ── */}
      <div className="absolute bottom-3 left-3 pointer-events-none z-20 flex items-center gap-2">
        <div className="relative w-12 h-12 rounded-full border border-cyan-500/40 bg-black/70 backdrop-blur-md flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          {/* Radar Circles */}
          <div className="absolute inset-1.5 rounded-full border border-cyan-500/20" />
          <div className="absolute inset-3 rounded-full border border-cyan-500/15" />
          {/* Radar Sweep Needle */}
          <div className="absolute inset-0 rounded-full border-t border-cyan-400 animate-spin opacity-75" />
          {/* Player Blip */}
          <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 shadow-[0_0_6px_#ff00ff]" />
          <Navigation className="absolute -top-1 w-2.5 h-2.5 text-cyan-400" />
        </div>
      </div>

      {/* ── Bottom-Right Tachometer / Speedometer HUD (Exact from Reference Image!) ── */}
      <div className="absolute bottom-3 right-3 pointer-events-none z-20">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/15 bg-black/80 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          {/* Mini RPM Circular Arc Gauge */}
          <div className="relative w-9 h-9 rounded-full border-2 border-white/10 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={isBoosting ? "text-fuchsia-500" : "text-cyan-400"}
                strokeDasharray={`${(currentSpeed / 300) * 100}, 100`}
                strokeWidth="3.2"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <Gauge className={`w-3.5 h-3.5 absolute ${isBoosting ? "text-yellow-300" : "text-white/70"}`} />
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-lg sm:text-xl font-black text-white tracking-tighter leading-none">
                {currentSpeed}
              </span>
              <span className="font-mono text-[9px] text-cyan-300 font-bold uppercase">
                KM/H
              </span>
            </div>
            <span className="font-mono text-[8px] text-white/50 tracking-wider">
              {isBoosting ? "GEAR 6 · BOOST" : "GEAR 4 · CRUISE"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCyberpunkCar3D;
