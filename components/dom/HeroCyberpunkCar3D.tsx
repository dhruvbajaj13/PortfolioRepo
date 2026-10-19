'use client';

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Zap, Gauge, Volume2, VolumeX, Navigation } from "lucide-react";

export interface HeroCyberpunkCar3DProps {
  className?: string;
}

export const HeroCyberpunkCar3D: React.FC<HeroCyberpunkCar3DProps> = ({ className = "" }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isBoosting, setIsBoosting] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const isHoveredRef = useRef(false);
  const boostStateRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const engineGainRef = useRef<GainNode | null>(null);
  const engineOscRef = useRef<OscillatorNode | null>(null);

  // Synthesize futuristic cyberpunk turbo engine audio via Web Audio API
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
      filter.frequency.setValueAtTime(360, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      engineOscRef.current = osc;
      engineGainRef.current = gain;
    } catch {
      // Audio autoplay blocked or not supported
    }
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (!audioContextRef.current) {
      initAudio();
    }
    if (engineGainRef.current && audioContextRef.current) {
      const targetVol = next && isHoveredRef.current ? (boostStateRef.current ? 0.08 : 0.04) : 0;
      engineGainRef.current.gain.setTargetAtTime(targetVol, audioContextRef.current.currentTime, 0.1);
    }
  };

  const handlePointerEnter = () => {
    isHoveredRef.current = true;
    setIsHovered(true);
    if (soundEnabled && audioContextRef.current && engineGainRef.current && engineOscRef.current) {
      const now = audioContextRef.current.currentTime;
      const freq = boostStateRef.current ? 155 : 65;
      const vol = boostStateRef.current ? 0.08 : 0.04;
      engineOscRef.current.frequency.setTargetAtTime(freq, now, 0.25);
      engineGainRef.current.gain.setTargetAtTime(vol, now, 0.2);
    }
  };

  const handlePointerLeave = () => {
    isHoveredRef.current = false;
    setIsHovered(false);
    if (soundEnabled && audioContextRef.current && engineGainRef.current && engineOscRef.current) {
      const now = audioContextRef.current.currentTime;
      engineGainRef.current.gain.setTargetAtTime(0, now, 0.4);
      engineOscRef.current.frequency.setTargetAtTime(45, now, 0.4);
    }
  };

  const handleBoostToggle = () => {
    if (!isHoveredRef.current) return;
    const next = !boostStateRef.current;
    boostStateRef.current = next;
    setIsBoosting(next);

    if (soundEnabled && audioContextRef.current && engineOscRef.current && engineGainRef.current) {
      const now = audioContextRef.current.currentTime;
      if (next) {
        engineOscRef.current.frequency.setTargetAtTime(155, now, 0.2);
        engineGainRef.current.gain.setTargetAtTime(0.08, now, 0.15);
      } else {
        engineOscRef.current.frequency.setTargetAtTime(65, now, 0.3);
        engineGainRef.current.gain.setTargetAtTime(0.04, now, 0.2);
      }
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 380;

    // ── 1. WebGL Scene, Camera & Renderer ──
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1a0628, 0.009);

    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 300);
    camera.position.set(0, 1.45, 3.85);
    camera.lookAt(0, 0.72, -18);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
      precision: "mediump",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45;
    renderer.setClearColor(0x180528, 1);
    container.appendChild(renderer.domElement);

    // ── 2. Vivid Cyberpunk Lighting ──
    scene.add(new THREE.AmbientLight(0x5a267a, 1.8));

    // Car Key Spotlight: Shines directly on the silver metallic body
    const carKeyLight = new THREE.DirectionalLight(0xfff0ff, 2.8);
    carKeyLight.position.set(0, 4.5, 4.0);
    scene.add(carKeyLight);

    const cityGlowLight = new THREE.DirectionalLight(0xff0088, 2.2);
    cityGlowLight.position.set(0, 7.0, -25);
    scene.add(cityGlowLight);

    const leftStreetLight = new THREE.DirectionalLight(0x00f0ff, 2.0);
    leftStreetLight.position.set(-8, 5, -5);
    scene.add(leftStreetLight);

    const rightStreetLight = new THREE.DirectionalLight(0xff0066, 2.2);
    rightStreetLight.position.set(8, 5, -5);
    scene.add(rightStreetLight);

    const groundReflection = new THREE.PointLight(0xff0088, 3.5, 12);
    groundReflection.position.set(0, 0.25, 2.2);
    scene.add(groundReflection);

    // ── 3. Cyberpunk Sky Dome / Horizon Backdrop ──
    const skyGeo = new THREE.SphereGeometry(180, 24, 16);
    const skyCanvas = document.createElement("canvas");
    skyCanvas.width = 512;
    skyCanvas.height = 512;
    const sCtx = skyCanvas.getContext("2d")!;
    const skyGrad = sCtx.createLinearGradient(0, 0, 0, 512);
    skyGrad.addColorStop(0, "#080210");
    skyGrad.addColorStop(0.35, "#180628");
    skyGrad.addColorStop(0.65, "#3b0a48");
    skyGrad.addColorStop(0.85, "#6a105c");
    skyGrad.addColorStop(1.0, "#280738");
    sCtx.fillStyle = skyGrad;
    sCtx.fillRect(0, 0, 512, 512);

    for (let c = 0; c < 30; c++) {
      sCtx.fillStyle = c % 2 === 0 ? "rgba(0, 240, 255, 0.12)" : "rgba(255, 0, 128, 0.15)";
      sCtx.beginPath();
      sCtx.arc(Math.random() * 512, 280 + Math.random() * 120, 20 + Math.random() * 45, 0, Math.PI * 2);
      sCtx.fill();
    }
    const skyTex = new THREE.CanvasTexture(skyCanvas);
    const skyMat = new THREE.MeshBasicMaterial({
      map: skyTex,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyMesh);

    // ── 4. Procedural Canvas Textures ──
    const createBuildingTexture = (primaryColor: string, secondaryColor: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 512;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#0c0816";
      ctx.fillRect(0, 0, 256, 512);

      const rows = 36;
      const cols = 9;
      const winW = 18;
      const winH = 8;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const rand = Math.random();
          if (rand > 0.3) {
            ctx.fillStyle = rand > 0.85 ? primaryColor : rand > 0.65 ? secondaryColor : rand > 0.45 ? "#fffae0" : "#00f0ff";
            ctx.fillRect(14 + c * 26, 10 + r * 14, winW, winH);
          }
        }
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      return tex;
    };

    const createNeonSignTexture = (text: string, neonColor: string, borderCol: string, bgCol: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 320;
      canvas.height = 120;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = bgCol;
      ctx.fillRect(0, 0, 320, 120);

      ctx.lineWidth = 6;
      ctx.strokeStyle = borderCol;
      ctx.shadowColor = borderCol;
      ctx.shadowBlur = 16;
      ctx.strokeRect(8, 8, 304, 104);

      ctx.fillStyle = neonColor;
      ctx.font = "bold 56px 'Hiragino Sans', 'Noto Sans JP', 'Impact', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = neonColor;
      ctx.shadowBlur = 24;
      ctx.fillText(text, 160, 60);

      return new THREE.CanvasTexture(canvas);
    };

    const createGlowTexture = (colorStop: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext("2d")!;
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.25, colorStop);
      grad.addColorStop(0.65, "rgba(255, 0, 128, 0.4)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(canvas);
    };

    const redBloomTex = createGlowTexture("#ff0044");
    const purpleBloomTex = createGlowTexture("#d946ef");

    // ── 5. The Wet Multi-Lane Highway ──
    const highwayGroup = new THREE.Group();
    scene.add(highwayGroup);

    const groundGeo = new THREE.PlaneGeometry(60, 220, 1, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x090712,
      roughness: 0.16,
      metalness: 0.88,
    });
    const highway = new THREE.Mesh(groundGeo, groundMat);
    highway.rotation.x = -Math.PI / 2;
    highway.position.set(0, 0, -60);
    highwayGroup.add(highway);

    // Glowing Lane Markings
    const laneDashCount = 32;
    const laneDashMeshes: THREE.Mesh[] = [];
    const laneDashGeo = new THREE.PlaneGeometry(0.22, 3.2);
    const laneDashMat = new THREE.MeshBasicMaterial({
      color: 0xff0066,
      transparent: true,
      opacity: 0.9,
    });

    for (let i = 0; i < laneDashCount; i++) {
      const dash = new THREE.Mesh(laneDashGeo, laneDashMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(0, 0.02, -i * 6.5);
      highwayGroup.add(dash);
      laneDashMeshes.push(dash);
    }

    const sideDashMeshes: THREE.Mesh[] = [];
    const sideDashMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.65 });
    for (let i = 0; i < laneDashCount; i++) {
      const leftDash = new THREE.Mesh(laneDashGeo, sideDashMat);
      leftDash.rotation.x = -Math.PI / 2;
      leftDash.position.set(-3.2, 0.02, -i * 6.5);
      highwayGroup.add(leftDash);
      sideDashMeshes.push(leftDash);

      const rightDash = new THREE.Mesh(laneDashGeo, sideDashMat);
      rightDash.rotation.x = -Math.PI / 2;
      rightDash.position.set(3.2, 0.02, -i * 6.5);
      highwayGroup.add(rightDash);
      sideDashMeshes.push(rightDash);
    }

    // Glowing Barrier Guardrails
    const barrierGeo = new THREE.BoxGeometry(0.25, 0.45, 220);
    const leftBarrierMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const rightBarrierMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });

    const leftBarrier = new THREE.Mesh(barrierGeo, leftBarrierMat);
    leftBarrier.position.set(-6.8, 0.22, -60);
    highwayGroup.add(leftBarrier);

    const rightBarrier = new THREE.Mesh(barrierGeo, rightBarrierMat);
    rightBarrier.position.set(6.8, 0.22, -60);
    highwayGroup.add(rightBarrier);

    // ── 6. DENSE Cyberpunk City Skyline Flanking Highway ──
    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    interface CityBuilding {
      mesh: THREE.Mesh;
      baseZ: number;
    }
    const buildings: CityBuilding[] = [];

    const bldgPalette = [
      { p: "#ff0088", s: "#ffea00" },
      { p: "#00f0ff", s: "#a855f7" },
      { p: "#f43f5e", s: "#38bdf8" },
      { p: "#eab308", s: "#ec4899" },
    ];

    const totalBuildings = 48;
    for (let i = 0; i < totalBuildings; i++) {
      const isLeft = i % 2 === 0;
      const side = isLeft ? -1 : 1;
      const x = side * (7.6 + Math.random() * 7.5);
      const z = -((i * 4.2) % 190);
      const bldgW = 4.2 + Math.random() * 3.8;
      const bldgH = 16 + Math.random() * 32;
      const bldgD = 4.5 + Math.random() * 4.0;

      const pal = bldgPalette[i % bldgPalette.length];
      const tex = createBuildingTexture(pal.p, pal.s);

      const mat = new THREE.MeshStandardMaterial({
        color: 0x140e22,
        map: tex,
        metalness: 0.7,
        roughness: 0.35,
      });

      const geo = new THREE.BoxGeometry(bldgW, bldgH, bldgD);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, bldgH / 2 - 0.2, z);
      cityGroup.add(mesh);
      buildings.push({ mesh, baseZ: z });

      // Add Giant Glowing Neon Billboards
      if (i % 2 === 0) {
        let signText = "BAR";
        let signBorder = "#00f0ff";
        let signNeon = "#00ffff";
        let signBg = "#00121a";

        if (i % 6 === 0) {
          signText = "どこかに";
          signBorder = "#ff0044";
          signNeon = "#ffe600";
          signBg = "#1a0008";
        } else if (i % 4 === 0) {
          signText = "XXX";
          signBorder = "#ff0077";
          signNeon = "#ff00aa";
          signBg = "#14000b";
        } else if (i % 3 === 0) {
          signText = "HOTEL";
          signBorder = "#a855f7";
          signNeon = "#e879f9";
          signBg = "#0e0216";
        }

        const signTex = createNeonSignTexture(signText, signNeon, signBorder, signBg);
        const signGeo = new THREE.PlaneGeometry(4.2, 1.6);
        const signMat = new THREE.MeshBasicMaterial({
          map: signTex,
          transparent: true,
          side: THREE.DoubleSide,
        });
        const signMesh = new THREE.Mesh(signGeo, signMat);

        signMesh.position.set(
          x + (isLeft ? bldgW / 2 + 0.08 : -bldgW / 2 - 0.08),
          4.5 + (i % 5) * 2.5,
          z + 1.0
        );
        signMesh.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2;
        cityGroup.add(signMesh);

        // Horizontal Neon Tubes
        const tubeGeo = new THREE.BoxGeometry(0.12, 0.12, bldgD + 2);
        const tubeMat = new THREE.MeshBasicMaterial({
          color: isLeft ? 0x00f0ff : 0xff0066,
        });
        const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
        tubeMesh.position.set(
          x + (isLeft ? bldgW / 2 + 0.15 : -bldgW / 2 - 0.15),
          3.0 + (i % 4) * 3,
          z
        );
        cityGroup.add(tubeMesh);
      }
    }

    // ── 7. High-Speed Motion Blur Light Streaks ──
    const streakCount = 65;
    const streakMeshes: { mesh: THREE.Mesh; speedMult: number; baseLen: number }[] = [];
    const streakColors = [0xff0066, 0x00f0ff, 0xffea00, 0xa855f7, 0xff3366, 0xffffff];

    for (let i = 0; i < streakCount; i++) {
      const streakLen = 4.0 + Math.random() * 8.0;
      const streakGeo = new THREE.BoxGeometry(0.06, 0.06, streakLen);
      const col = streakColors[i % streakColors.length];
      const streakMat = new THREE.MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: 0.85,
      });
      const streak = new THREE.Mesh(streakGeo, streakMat);

      const side = Math.random() > 0.5 ? 1 : -1;
      const x = side * (4.2 + Math.random() * 6.5);
      const y = 0.35 + Math.random() * 3.8;
      const z = -Math.random() * 140;
      streak.position.set(x, y, z);

      scene.add(streak);
      streakMeshes.push({ mesh: streak, speedMult: 0.85 + Math.random() * 0.45, baseLen: streakLen });
    }

    // ── 8. Detailed Cyberpunk Supercar ──
    const carRoot = new THREE.Group();
    carRoot.position.set(0, 0.46, 0);
    scene.add(carRoot);

    const bodySilverMat = new THREE.MeshStandardMaterial({
      color: 0xced4de,
      metalness: 0.92,
      roughness: 0.18,
    });

    const bodyDarkCarbonMat = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      metalness: 0.95,
      roughness: 0.3,
    });

    const cockpitGlassMat = new THREE.MeshStandardMaterial({
      color: 0x08101a,
      metalness: 0.98,
      roughness: 0.05,
    });

    // A. Main Lower Wide Body Wedge
    const mainBodyGeo = new THREE.BoxGeometry(2.05, 0.36, 3.9);
    const mainBody = new THREE.Mesh(mainBodyGeo, bodySilverMat);
    mainBody.position.set(0, 0, 0);
    carRoot.add(mainBody);

    // B. Slanted Hood Front Wedge
    const frontHoodGeo = new THREE.BoxGeometry(1.85, 0.22, 1.3);
    const frontHood = new THREE.Mesh(frontHoodGeo, bodySilverMat);
    frontHood.position.set(0, -0.05, -1.65);
    frontHood.rotation.x = 0.13;
    carRoot.add(frontHood);

    // C. Wide Flared Rear Fenders
    const flareGeo = new THREE.BoxGeometry(0.28, 0.42, 1.85);
    const leftFlare = new THREE.Mesh(flareGeo, bodySilverMat);
    leftFlare.position.set(-1.06, 0.03, 0.72);
    carRoot.add(leftFlare);

    const rightFlare = new THREE.Mesh(flareGeo, bodySilverMat);
    rightFlare.position.set(1.06, 0.03, 0.72);
    carRoot.add(rightFlare);

    // D. Cockpit Canopy & Rear Glass
    const cockpitGeo = new THREE.BoxGeometry(1.36, 0.42, 1.8);
    const cockpit = new THREE.Mesh(cockpitGeo, cockpitGlassMat);
    cockpit.position.set(0, 0.34, -0.15);
    carRoot.add(cockpit);

    // E. Amber/Yellow Dual Engine Vents
    const ventMat = new THREE.MeshStandardMaterial({
      color: 0xffb700,
      metalness: 0.5,
      roughness: 0.2,
      emissive: 0xffa200,
      emissiveIntensity: 0.5,
    });
    const ventGeo = new THREE.BoxGeometry(0.32, 0.06, 0.55);

    const leftVent = new THREE.Mesh(ventGeo, ventMat);
    leftVent.position.set(-0.42, 0.23, 0.95);
    leftVent.rotation.x = -0.14;
    carRoot.add(leftVent);

    const rightVent = new THREE.Mesh(ventGeo, ventMat);
    rightVent.position.set(0.42, 0.23, 0.95);
    rightVent.rotation.x = -0.14;
    carRoot.add(rightVent);

    // F. Twin Roof Antenna Rods
    const antennaMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0 });
    const antennaGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.75, 8);
    antennaGeo.rotateX(0.35);

    const leftAntenna = new THREE.Mesh(antennaGeo, antennaMat);
    leftAntenna.position.set(-0.25, 0.65, 0.5);
    carRoot.add(leftAntenna);

    const rightAntenna = new THREE.Mesh(antennaGeo, antennaMat);
    rightAntenna.position.set(0.25, 0.65, 0.5);
    carRoot.add(rightAntenna);

    // G. Rear Deck Louvers
    for (let l = 0; l < 4; l++) {
      const louverGeo = new THREE.BoxGeometry(1.22, 0.035, 0.16);
      const louver = new THREE.Mesh(louverGeo, bodyDarkCarbonMat);
      louver.position.set(0, 0.29 - l * 0.05, 0.8 + l * 0.24);
      louver.rotation.x = -0.16;
      carRoot.add(louver);
    }

    // H. Aerodynamic Rear Wing / Spoiler
    const spoilerBladeGeo = new THREE.BoxGeometry(2.1, 0.05, 0.42);
    const spoilerBlade = new THREE.Mesh(spoilerBladeGeo, bodyDarkCarbonMat);
    spoilerBlade.position.set(0, 0.48, 1.88);
    carRoot.add(spoilerBlade);

    const strutGeo = new THREE.BoxGeometry(0.04, 0.26, 0.24);
    const leftStrut = new THREE.Mesh(strutGeo, bodyDarkCarbonMat);
    leftStrut.position.set(-0.68, 0.34, 1.86);
    carRoot.add(leftStrut);

    const rightStrut = new THREE.Mesh(strutGeo, bodyDarkCarbonMat);
    rightStrut.position.set(0.68, 0.34, 1.86);
    carRoot.add(rightStrut);

    // I. Luminous Rear Tech Badge
    const badgeMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });
    const badgeGeo = new THREE.PlaneGeometry(0.75, 0.1);
    const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
    badgeMesh.position.set(0, 0.23, 1.96);
    carRoot.add(badgeMesh);

    // J. Glowing Red/Magenta LED Light Bar
    const tailBarGeo = new THREE.BoxGeometry(1.92, 0.085, 0.08);
    const tailBarMat = new THREE.MeshBasicMaterial({ color: 0xff0044 });
    const tailBar = new THREE.Mesh(tailBarGeo, tailBarMat);
    tailBar.position.set(0, 0.14, 1.96);
    carRoot.add(tailBar);

    const lowerBarGeo = new THREE.BoxGeometry(1.78, 0.03, 0.06);
    const lowerBarMat = new THREE.MeshBasicMaterial({ color: 0xff0077 });
    const lowerBar = new THREE.Mesh(lowerBarGeo, lowerBarMat);
    lowerBar.position.set(0, 0.04, 1.96);
    carRoot.add(lowerBar);

    // Taillight Bloom Flare
    const tailBloomGeo = new THREE.PlaneGeometry(3.2, 1.1);
    const tailBloomMat = new THREE.MeshBasicMaterial({
      map: redBloomTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.95,
      depthWrite: false,
    });
    const tailBloom = new THREE.Mesh(tailBloomGeo, tailBloomMat);
    tailBloom.position.set(0, 0.14, 2.0);
    carRoot.add(tailBloom);

    // K. Dual Exhaust Thrusters & Plasma Flames
    const exhaustGroup = new THREE.Group();
    carRoot.add(exhaustGroup);

    const exhaustNozzleGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.24, 16);
    exhaustNozzleGeo.rotateX(Math.PI / 2);
    const exhaustNozzleMat = new THREE.MeshStandardMaterial({
      color: 0x111114,
      metalness: 0.95,
      roughness: 0.1,
    });

    const leftNozzle = new THREE.Mesh(exhaustNozzleGeo, exhaustNozzleMat);
    leftNozzle.position.set(-0.52, -0.06, 1.94);
    exhaustGroup.add(leftNozzle);

    const rightNozzle = new THREE.Mesh(exhaustNozzleGeo, exhaustNozzleMat);
    rightNozzle.position.set(0.52, -0.06, 1.94);
    exhaustGroup.add(rightNozzle);

    // Roaring Plasma Flame Cones
    const flameGeo = new THREE.ConeGeometry(0.22, 2.8, 16);
    flameGeo.rotateX(-Math.PI / 2);
    flameGeo.translate(0, 0, 1.4);

    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xd946ef,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const leftFlame = new THREE.Mesh(flameGeo, flameMat);
    leftFlame.position.set(-0.52, -0.06, 2.02);
    exhaustGroup.add(leftFlame);

    const rightFlame = new THREE.Mesh(flameGeo, flameMat);
    rightFlame.position.set(0.52, -0.06, 2.02);
    exhaustGroup.add(rightFlame);

    const innerFlameGeo = new THREE.ConeGeometry(0.1, 2.2, 16);
    innerFlameGeo.rotateX(-Math.PI / 2);
    innerFlameGeo.translate(0, 0, 1.1);
    const innerFlameMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.98,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const leftInnerFlame = new THREE.Mesh(innerFlameGeo, innerFlameMat);
    leftInnerFlame.position.set(-0.52, -0.06, 2.02);
    exhaustGroup.add(leftInnerFlame);

    const rightInnerFlame = new THREE.Mesh(innerFlameGeo, innerFlameMat);
    rightInnerFlame.position.set(0.52, -0.06, 2.02);
    exhaustGroup.add(rightInnerFlame);

    // Road Ground Plasma Glow Flares
    const groundFlameGeo = new THREE.PlaneGeometry(1.8, 4.2);
    groundFlameGeo.rotateX(-Math.PI / 2);
    const groundFlameMat = new THREE.MeshBasicMaterial({
      map: purpleBloomTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.95,
      depthWrite: false,
    });

    const leftGroundGlow = new THREE.Mesh(groundFlameGeo, groundFlameMat);
    leftGroundGlow.position.set(-0.52, 0.03, 3.4);
    scene.add(leftGroundGlow);

    const rightGroundGlow = new THREE.Mesh(groundFlameGeo, groundFlameMat);
    rightGroundGlow.position.set(0.52, 0.03, 3.4);
    scene.add(rightGroundGlow);

    // L. Wheels
    const wheelGroup = new THREE.Group();
    carRoot.add(wheelGroup);

    const tireGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.34, 20);
    tireGeo.rotateZ(Math.PI / 2);
    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.8,
      metalness: 0.2,
    });

    const rimGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.35, 16);
    rimGeo.rotateZ(Math.PI / 2);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.45,
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

    const wheelFL = createWheel(-1.05, -0.12, -1.35);
    const wheelFR = createWheel(1.05, -0.12, -1.35);
    const wheelRL = createWheel(-1.08, -0.12, 1.35);
    const wheelRR = createWheel(1.08, -0.12, 1.35);
    const wheels = [wheelFL, wheelFR, wheelRL, wheelRR];

    // ── 9. Interactive Mouse Steering (Active ONLY When Hovered Inside Car Section) ──
    let targetCarX = 0;
    let targetCarRotY = 0;
    let targetCarRoll = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHoveredRef.current) {
        // Re-center if not hovered
        targetCarX = 0;
        targetCarRotY = 0;
        targetCarRoll = 0;
        return;
      }
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
      targetCarX = normX * 2.4;
      targetCarRotY = -normX * 0.14;
      targetCarRoll = normX * 0.09;
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });

    // ── 10. Locked 60-120FPS Animation Loop (Runs ONLY when hovered, stops when cursor leaves) ──
    let animId: number;
    let isVisible = true;
    let clock = 0;
    let speed = 0;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      clock += 0.016;

      // Target Speed is 0 when cursor is outside the car card!
      // When inside, cruises at 115 KM/H or boosts at 295 KM/H!
      const targetSpeed = isHoveredRef.current
        ? (boostStateRef.current ? 295 : 115)
        : 0;

      speed += (targetSpeed - speed) * 0.085;

      // Update React UI Speedometer state
      if (Math.round(clock * 60) % 4 === 0) {
        setCurrentSpeed(Math.round(speed));
      }

      const speedFactor = speed / 115;

      // Move Lane Markings (Stops when speed = 0)
      const dashMove = 0.44 * speedFactor;
      laneDashMeshes.forEach((dash) => {
        dash.position.z += dashMove;
        if (dash.position.z > 8) {
          dash.position.z -= laneDashCount * 6.5;
        }
      });
      sideDashMeshes.forEach((dash) => {
        dash.position.z += dashMove;
        if (dash.position.z > 8) {
          dash.position.z -= laneDashCount * 6.5;
        }
      });

      // Move Buildings (Stops when speed = 0)
      const bldgMove = 0.54 * speedFactor;
      buildings.forEach((item) => {
        item.mesh.position.z += bldgMove;
        if (item.mesh.position.z > 24) {
          item.mesh.position.z -= 190;
        }
      });

      // Move Speed Light Streaks (Stops when speed = 0)
      streakMeshes.forEach((item) => {
        item.mesh.position.z += 0.88 * speedFactor * item.speedMult;
        if (item.mesh.position.z > 14) {
          item.mesh.position.z = -140 - Math.random() * 25;
        }
        const boostStretch = boostStateRef.current && isHoveredRef.current ? 2.8 : 1.0;
        item.mesh.scale.z = boostStretch;
        (item.mesh.material as THREE.MeshBasicMaterial).opacity = isHoveredRef.current ? 0.85 : 0.25;
      });

      // Rotate Wheels (Stops when speed = 0)
      const wheelRotSpeed = 0.52 * speedFactor;
      wheels.forEach((w) => {
        w.rotation.x += wheelRotSpeed;
      });

      // Steer Front Wheels
      wheelFL.rotation.y = targetCarRotY * 1.6;
      wheelFR.rotation.y = targetCarRotY * 1.6;

      // Smooth Car Physics & Re-centering
      carRoot.position.x += (targetCarX - carRoot.position.x) * 0.09;
      carRoot.rotation.y += (targetCarRotY - carRoot.rotation.y) * 0.09;
      carRoot.rotation.z += (targetCarRoll - carRoot.rotation.z) * 0.09;

      // Engine Rumble Vibration (Active only while running)
      const rumble = speed > 5 ? Math.sin(clock * 48) * (boostStateRef.current ? 0.024 : 0.009) : 0;
      carRoot.position.y = 0.46 + rumble;

      // Acceleration Squat
      const targetSquat = speed > 5 ? (boostStateRef.current ? -0.05 : -0.018) : 0;
      carRoot.rotation.x += (targetSquat - carRoot.rotation.x) * 0.1;

      // Dual Exhaust Plasma Flames (Extinguishes/shrinks when stopped, roars when running!)
      const flamePulse = Math.sin(clock * 65) * 0.18;
      const boostFlameLen = isHoveredRef.current
        ? (boostStateRef.current ? 2.9 + flamePulse : 1.1 + flamePulse * 0.5)
        : (speed > 5 ? (speed / 115) * 0.5 : 0.001);

      leftFlame.scale.set(1.0, 1.0, boostFlameLen);
      rightFlame.scale.set(1.0, 1.0, boostFlameLen);
      leftInnerFlame.scale.set(1.0, 1.0, boostFlameLen * 0.88);
      rightInnerFlame.scale.set(1.0, 1.0, boostFlameLen * 0.88);

      // Follow car ground flame reflections
      leftGroundGlow.position.x = carRoot.position.x - 0.52;
      rightGroundGlow.position.x = carRoot.position.x + 0.52;
      const groundGlowOpacity = isHoveredRef.current
        ? (boostStateRef.current ? 0.98 : 0.6)
        : (speed > 5 ? (speed / 115) * 0.3 : 0);
      groundFlameMat.opacity = groundGlowOpacity;

      // Dynamic Camera Reaction to Acceleration & Braking
      const targetCamZ = isHoveredRef.current && boostStateRef.current ? 4.5 : 3.85;
      camera.position.z += (targetCamZ - camera.position.z) * 0.07;
      camera.position.x += (carRoot.position.x * 0.32 - camera.position.x) * 0.09;

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
      container.removeEventListener("mousemove", handleMouseMove);
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
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleBoostToggle}
      className={`relative w-full h-full cursor-pointer select-none overflow-hidden group/carscene ${className}`}
      title="Hover over car to run · Click for Nitro Boost · Move mouse outside to stop"
    >
      {/* ── Top HUD Header: Game Status & Telemetry ── */}
      <div className="absolute top-2.5 inset-x-3 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md">
          <span className={`w-1.5 h-1.5 rounded-full ${isHovered ? "bg-cyan-400 animate-pulse" : "bg-white/40"}`} />
          <span className="font-mono text-[9px] sm:text-[10px] text-cyan-300 font-bold tracking-widest uppercase">
            {isHovered ? "NIGHT DRIVE · TOKYO" : "PARKED · STANDBY"}
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

      {/* ── Center Dynamic Prompt Banner ── */}
      <div className="absolute top-11 inset-x-0 flex justify-center pointer-events-none z-20">
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] sm:text-xs font-mono font-bold tracking-wider transition-all duration-300 shadow-lg ${
            !isHovered
              ? "bg-black/80 border-white/20 text-white/70 shadow-md"
              : isBoosting
              ? "bg-fuchsia-600/35 border-fuchsia-400 text-fuchsia-200 shadow-[0_0_20px_rgba(217,70,239,0.5)] scale-105"
              : "bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)] scale-100"
          }`}
        >
          <Zap
            className={`w-3.5 h-3.5 ${
              !isHovered
                ? "text-white/40"
                : isBoosting
                ? "text-yellow-300 animate-bounce"
                : "text-cyan-400 animate-pulse"
            }`}
          />
          <span>
            {!isHovered
              ? "⚡ HOVER OVER CAR TO DRIVE · CLICK FOR NITRO"
              : isBoosting
              ? "🚀 NITRO ACTIVE · 295 KM/H (CLICK TO CRUISE)"
              : "🔥 DRIVING (CLICK FOR NITRO BOOST)"}
          </span>
        </div>
      </div>

      {/* ── Bottom-Left Mini-Map Radar HUD ── */}
      <div className="absolute bottom-3 left-3 pointer-events-none z-20 flex items-center gap-2">
        <div className="relative w-12 h-12 rounded-full border border-cyan-500/40 bg-black/70 backdrop-blur-md flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <div className="absolute inset-1.5 rounded-full border border-cyan-500/20" />
          <div className="absolute inset-3 rounded-full border border-cyan-500/15" />
          <div
            className={`absolute inset-0 rounded-full border-t border-cyan-400 ${
              isHovered ? "animate-spin opacity-90" : "opacity-30"
            }`}
          />
          <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 shadow-[0_0_6px_#ff00ff]" />
          <Navigation className="absolute -top-1 w-2.5 h-2.5 text-cyan-400" />
        </div>
      </div>

      {/* ── Bottom-Right Tachometer / Speedometer HUD ── */}
      <div className="absolute bottom-3 right-3 pointer-events-none z-20">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/15 bg-black/80 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)]">
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
                className={isBoosting && isHovered ? "text-fuchsia-500" : isHovered ? "text-cyan-400" : "text-white/20"}
                strokeDasharray={`${(currentSpeed / 320) * 100}, 100`}
                strokeWidth="3.2"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <Gauge
              className={`w-3.5 h-3.5 absolute ${
                !isHovered
                  ? "text-white/30"
                  : isBoosting
                  ? "text-yellow-300 animate-pulse"
                  : "text-white/70"
              }`}
            />
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
              {!isHovered
                ? "PARKED"
                : isBoosting
                ? "GEAR 6 · BOOST"
                : "GEAR 4 · CRUISE"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCyberpunkCar3D;
