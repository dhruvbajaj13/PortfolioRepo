'use client';

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Zap, Gauge, Volume2, VolumeX, Navigation } from "lucide-react";

// Helper to add rim lighting effect to a MeshStandardMaterial
function applyRimLight(material: THREE.MeshStandardMaterial) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.rimColor = { value: new THREE.Color(0x00ffff) };
    shader.uniforms.rimPower = { value: 2.5 };
    shader.uniforms.rimIntensity = { value: 1.5 };

    // Inject varyings into vertex shader
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `#include <common>
      varying vec3 vRimNormal;
      varying vec3 vRimViewPos;`
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <fog_vertex>',
      `#include <fog_vertex>
      vRimNormal = normalize(normalMatrix * normal);
      vec4 rimMvPos = modelViewMatrix * vec4(position, 1.0);
      vRimViewPos = -rimMvPos.xyz;`
    );

    // Inject uniforms/varyings into fragment shader
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `#include <common>
      uniform vec3 rimColor;
      uniform float rimPower;
      uniform float rimIntensity;
      varying vec3 vRimNormal;
      varying vec3 vRimViewPos;`
    );
    // Apply rim glow after dithering
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `#include <dithering_fragment>
      vec3 rimN = normalize(vRimNormal);
      vec3 rimV = normalize(vRimViewPos);
      float rimFactor = 1.0 - max(dot(rimV, rimN), 0.0);
      float rim = pow(rimFactor, rimPower) * rimIntensity;
      gl_FragColor.rgb += rimColor * rim;`
    );
  };
}

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
      const freq = boostStateRef.current ? 160 : 70;
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
        engineOscRef.current.frequency.setTargetAtTime(160, now, 0.2);
        engineGainRef.current.gain.setTargetAtTime(0.08, now, 0.15);
      } else {
        engineOscRef.current.frequency.setTargetAtTime(70, now, 0.3);
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
    // Soft atmospheric mist that doesn't black-out the city
    scene.fog = new THREE.FogExp2(0x240b38, 0.007);

    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 350);
    camera.position.set(0, 1.48, 3.8);
    camera.lookAt(0, 0.75, -16);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
      precision: "mediump",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    // ------------------------------------------------------------
    // 🎨 Simple gradient environment map for reflective highlights
    const envCanvas = document.createElement("canvas");
    envCanvas.width = 512;
    envCanvas.height = 512;
    const envCtx = envCanvas.getContext("2d")!;
    const envGrad = envCtx.createLinearGradient(0, 0, 0, 512);
    envGrad.addColorStop(0, "#0a001f");
    envGrad.addColorStop(0.5, "#22004b");
    envGrad.addColorStop(1, "#340064");
    envCtx.fillStyle = envGrad;
    envCtx.fillRect(0, 0, 512, 512);
    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;

    scene.environment = envTexture;
    // ------------------------------------------------------------
    // 🪩 Helper: generate cheap procedural metal textures (albedo/normal/roughness)
    const createMetalTexture = (size: number, type: "albedo" | "normal" | "roughness") => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      if (type === "albedo") {
        ctx.fillStyle = "#f0f4f8"; // silver base
        ctx.fillRect(0, 0, size, size);
        // subtle noise
        for (let i = 0; i < size * 2; i++) {
          ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.02})`;
          ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
        }
      } else if (type === "normal") {
        ctx.fillStyle = "#8080ff"; // neutral normal (0.5,0.5,1)
        ctx.fillRect(0, 0, size, size);
        for (let i = 0; i < size * 3; i++) {
          ctx.fillStyle = `rgba(128,128,255,${Math.random() * 0.1})`;
          ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
        }
      } else {
        ctx.fillStyle = "#777777";
        ctx.fillRect(0, 0, size, size);
        for (let i = 0; i < size; i++) {
          ctx.fillStyle = `rgba(200,200,200,${Math.random() * 0.05})`;
          ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
        }
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };
    const albedoTex = createMetalTexture(512, "albedo");
    const normalTex = createMetalTexture(512, "normal");
    const roughTex = createMetalTexture(512, "roughness");
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.setClearColor(0x220836, 1);
    container.appendChild(renderer.domElement);

    // ── 2. Vivid Cyberpunk Lighting Setup ──
    scene.add(new THREE.AmbientLight(0x7c3aed, 2.2)); // Rich purple ambient light

    // Key Spotlight directly illuminating the silver car chassis
    const carSpotlight = new THREE.DirectionalLight(0xffffff, 3.2);
    carSpotlight.position.set(0, 5.0, 3.5);
    scene.add(carSpotlight);

    // Cyan Street Lighting from left
    const leftStreetLight = new THREE.DirectionalLight(0x00f0ff, 2.5);
    leftStreetLight.position.set(-10, 6, -5);
    scene.add(leftStreetLight);

    // Neon Magenta Street Lighting from right
    const rightStreetLight = new THREE.DirectionalLight(0xff007f, 2.8);
    rightStreetLight.position.set(10, 6, -5);
    scene.add(rightStreetLight);

    // Wet Asphalt Reflective Glow
    const wetRoadGlow = new THREE.PointLight(0xff00aa, 3.5, 14);
    wetRoadGlow.position.set(0, 0.2, 1.5);
    scene.add(wetRoadGlow);

    // ── 3. High-Res Cyberpunk Sky Backdrop ──
    const skyGeo = new THREE.SphereGeometry(220, 24, 16);
    const skyCanvas = document.createElement("canvas");
    skyCanvas.width = 512;
    skyCanvas.height = 512;
    const sCtx = skyCanvas.getContext("2d")!;
    const skyGrad = sCtx.createLinearGradient(0, 0, 0, 512);
    skyGrad.addColorStop(0, "#0b0314");
    skyGrad.addColorStop(0.3, "#210738");
    skyGrad.addColorStop(0.6, "#4a0e5c");
    skyGrad.addColorStop(0.82, "#831872");
    skyGrad.addColorStop(1.0, "#3c0b48");
    sCtx.fillStyle = skyGrad;
    sCtx.fillRect(0, 0, 512, 512);

    // Neon haze clouds & city glow
    for (let c = 0; c < 45; c++) {
      sCtx.fillStyle = c % 2 === 0 ? "rgba(0, 240, 255, 0.16)" : "rgba(255, 0, 128, 0.18)";
      sCtx.beginPath();
      sCtx.arc(Math.random() * 512, 260 + Math.random() * 140, 25 + Math.random() * 55, 0, Math.PI * 2);
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

    // ── 4. Procedural Textures (Asphalt, Windows, Neon Signs, Bloom) ──

    // A. Procedural Wet Asphalt Road Texture with Painted Lines
    const createRoadTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 1024;
      const ctx = canvas.getContext("2d")!;

      // Dark asphalt base
      ctx.fillStyle = "#110e1a";
      ctx.fillRect(0, 0, 512, 1024);

      // Fine asphalt gravel noise
      for (let i = 0; i < 4000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 1024;
        ctx.fillStyle = Math.random() > 0.5 ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.15)";
        ctx.fillRect(x, y, 2, 2);
      }

      // Wet reflective puddles
      for (let p = 0; p < 12; p++) {
        const px = Math.random() * 400 + 50;
        const py = Math.random() * 900 + 50;
        const pGrad = ctx.createRadialGradient(px, py, 5, px, py, 60);
        pGrad.addColorStop(0, "rgba(217, 70, 239, 0.2)");
        pGrad.addColorStop(0.5, "rgba(0, 240, 255, 0.12)");
        pGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = pGrad;
        ctx.fillRect(px - 60, py - 60, 120, 120);
      }

      // Outer Road Boundary Stripes (Cyan on left, Pink on right)
      ctx.fillStyle = "#00f0ff";
      ctx.fillRect(36, 0, 10, 1024);
      ctx.fillStyle = "#ff0077";
      ctx.fillRect(466, 0, 10, 1024);

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(1, 16);
      return tex;
    };

    // B. Self-Illuminating Skyscraper Windows Texture
    const createBuildingTexture = (primaryColor: string, secondaryColor: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 512;
      const ctx = canvas.getContext("2d")!;

      // Deep cyber wall
      ctx.fillStyle = "#1e1330";
      ctx.fillRect(0, 0, 256, 512);

      // Vertical architectural structural lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 2;
      for (let x = 0; x <= 256; x += 28) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 512);
        ctx.stroke();
      }

      // Brightly lit windows
      const rows = 36;
      const cols = 8;
      const winW = 20;
      const winH = 9;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const rand = Math.random();
          if (rand > 0.22) {
            ctx.fillStyle = rand > 0.8 ? primaryColor : rand > 0.55 ? secondaryColor : rand > 0.38 ? "#ffea00" : "#ffffff";
            ctx.shadowColor = ctx.fillStyle;
            ctx.shadowBlur = rand > 0.7 ? 8 : 0;
            ctx.fillRect(16 + c * 28, 12 + r * 14, winW, winH);
          }
        }
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      return tex;
    };

    // C. Glowing Neon Billboard Textures (Anderson Mancini style)
    const createNeonSignTexture = (text: string, neonColor: string, borderCol: string, bgCol: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 340;
      canvas.height = 140;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = bgCol;
      ctx.fillRect(0, 0, 340, 140);

      // Glowing border
      ctx.lineWidth = 6;
      ctx.strokeStyle = borderCol;
      ctx.shadowColor = borderCol;
      ctx.shadowBlur = 18;
      ctx.strokeRect(10, 10, 320, 120);

      // Glowing neon text
      ctx.fillStyle = neonColor;
      ctx.font = "bold 60px 'Hiragino Sans', 'Noto Sans JP', 'Impact', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = neonColor;
      ctx.shadowBlur = 28;
      ctx.fillText(text, 170, 70);

      return new THREE.CanvasTexture(canvas);
    };

    // D. Radial Bloom Flare Texture
    const createGlowTexture = (colorStop: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext("2d")!;
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.25, colorStop);
      grad.addColorStop(0.65, "rgba(255, 0, 128, 0.45)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(canvas);
    };

    const redBloomTex = createGlowTexture("#ff0044");
    const purpleBloomTex = createGlowTexture("#d946ef");
    const cyanBloomTex = createGlowTexture("#00f0ff");

    // ── 5. The Racing Game Highway (Wet Asphalt + 3D Curbs + Gantries) ──
    const highwayGroup = new THREE.Group();
    scene.add(highwayGroup);

    // Multi-Lane Road
    const roadTex = createRoadTexture();
    const roadGeo = new THREE.PlaneGeometry(16, 260, 1, 32);
    const roadMat = new THREE.MeshStandardMaterial({
      map: roadTex,
      roughness: 0.15,
      metalness: 0.85,
    });
    const highway = new THREE.Mesh(roadGeo, roadMat);
    highway.rotation.x = -Math.PI / 2;
    highway.position.set(0, 0, -80);
    highwayGroup.add(highway);

    // Moving Dashed Center Line Markings
    const laneDashCount = 36;
    const laneDashMeshes: THREE.Mesh[] = [];
    const laneDashGeo = new THREE.PlaneGeometry(0.25, 3.4);
    const laneDashMat = new THREE.MeshBasicMaterial({
      color: 0xff0066,
      transparent: true,
      opacity: 0.95,
    });

    for (let i = 0; i < laneDashCount; i++) {
      const dash = new THREE.Mesh(laneDashGeo, laneDashMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(0, 0.025, -i * 6.5);
      highwayGroup.add(dash);
      laneDashMeshes.push(dash);
    }

    // Secondary White/Cyan Lane Separators
    const sideDashMeshes: THREE.Mesh[] = [];
    const sideDashMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.75 });
    for (let i = 0; i < laneDashCount; i++) {
      const leftDash = new THREE.Mesh(laneDashGeo, sideDashMat);
      leftDash.rotation.x = -Math.PI / 2;
      leftDash.position.set(-3.5, 0.025, -i * 6.5);
      highwayGroup.add(leftDash);
      sideDashMeshes.push(leftDash);

      const rightDash = new THREE.Mesh(laneDashGeo, sideDashMat);
      rightDash.rotation.x = -Math.PI / 2;
      rightDash.position.set(3.5, 0.025, -i * 6.5);
      highwayGroup.add(rightDash);
      sideDashMeshes.push(rightDash);
    }

    // 3D Sidewalk Curbs with Racing Checkered Stripes (Red & White / Yellow & Black)
    const curbGeo = new THREE.BoxGeometry(0.55, 0.22, 260);
    const curbCanvas = document.createElement("canvas");
    curbCanvas.width = 64;
    curbCanvas.height = 128;
    const cCtx = curbCanvas.getContext("2d")!;
    cCtx.fillStyle = "#ff0055";
    cCtx.fillRect(0, 0, 64, 64);
    cCtx.fillStyle = "#ffffff";
    cCtx.fillRect(0, 64, 64, 64);
    const curbTex = new THREE.CanvasTexture(curbCanvas);
    curbTex.wrapS = THREE.RepeatWrapping;
    curbTex.wrapT = THREE.RepeatWrapping;
    curbTex.repeat.set(1, 40);

    const curbMat = new THREE.MeshBasicMaterial({ map: curbTex });
    const leftCurb = new THREE.Mesh(curbGeo, curbMat);
    leftCurb.position.set(-8.2, 0.11, -80);
    highwayGroup.add(leftCurb);

    const rightCurb = new THREE.Mesh(curbGeo, curbMat);
    rightCurb.position.set(8.2, 0.11, -80);
    highwayGroup.add(rightCurb);

    // Glowing Guardrail Barriers
    const guardrailGeo = new THREE.BoxGeometry(0.18, 0.45, 260);
    const leftGuardrail = new THREE.Mesh(guardrailGeo, new THREE.MeshBasicMaterial({ color: 0x00f0ff }));
    leftGuardrail.position.set(-8.5, 0.35, -80);
    highwayGroup.add(leftGuardrail);

    const rightGuardrail = new THREE.Mesh(guardrailGeo, new THREE.MeshBasicMaterial({ color: 0xff0077 }));
    rightGuardrail.position.set(8.5, 0.35, -80);
    highwayGroup.add(rightGuardrail);

    // ── 6. Overhead Highway Sign Gantries (Spanning Across Road Every 55 Units) ──
    const gantryGroup = new THREE.Group();
    scene.add(gantryGroup);

    interface GantryItem {
      group: THREE.Group;
      baseZ: number;
    }
    const gantries: GantryItem[] = [];

    const createGantry = (z: number, signText: string, signCol: string) => {
      const g = new THREE.Group();

      // Steel truss arch
      const postGeo = new THREE.BoxGeometry(0.35, 6.5, 0.35);
      const postMat = new THREE.MeshStandardMaterial({ color: 0x242432, metalness: 0.9, roughness: 0.2 });

      const leftPost = new THREE.Mesh(postGeo, postMat);
      leftPost.position.set(-8.4, 3.25, 0);
      g.add(leftPost);

      const rightPost = new THREE.Mesh(postGeo, postMat);
      rightPost.position.set(8.4, 3.25, 0);
      g.add(rightPost);

      // Top cross beam
      const beamGeo = new THREE.BoxGeometry(17.2, 0.4, 0.4);
      const beam = new THREE.Mesh(beamGeo, postMat);
      beam.position.set(0, 6.2, 0);
      g.add(beam);

      // Electronic Green/Cyan Overhead Highway Sign
      const signTex = createNeonSignTexture(signText, signCol, "#ffffff", "#040d14");
      const signGeo = new THREE.PlaneGeometry(6.5, 1.8);
      const signMat = new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide });
      const signMesh = new THREE.Mesh(signGeo, signMat);
      signMesh.position.set(0, 5.0, 0.1);
      g.add(signMesh);

      // Bottom glowing cyan tube on gantry
      const tubeGeo = new THREE.BoxGeometry(16.8, 0.08, 0.08);
      const tube = new THREE.Mesh(tubeGeo, new THREE.MeshBasicMaterial({ color: 0x00f0ff }));
      tube.position.set(0, 4.0, 0);
      g.add(tube);

      g.position.set(0, 0, z);
      gantryGroup.add(g);
      return { group: g, baseZ: z };
    };

    gantries.push(createGantry(-45, "TOKYO EXPY · 渋谷", "#00f0ff"));
    gantries.push(createGantry(-110, "SPEED LIMIT 280 · 速度", "#ffea00"));
    gantries.push(createGantry(-175, "NEO CITY · 次の出口", "#ff0077"));

    // ── 7. Street Light Poles with Glowing Lamps Lining Highway ──
    const streetLightGroup = new THREE.Group();
    scene.add(streetLightGroup);

    interface LampItem {
      group: THREE.Group;
      baseZ: number;
    }
    const lamps: LampItem[] = [];

    for (let l = 0; l < 18; l++) {
      const isLeft = l % 2 === 0;
      const z = -l * 14;
      const lg = new THREE.Group();

      const poleGeo = new THREE.CylinderGeometry(0.08, 0.1, 5.5, 8);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x282c38, metalness: 0.8, roughness: 0.3 });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(isLeft ? -8.6 : 8.6, 2.75, 0);
      lg.add(pole);

      // Curved Lamp Arm extending over road
      const armGeo = new THREE.BoxGeometry(1.6, 0.08, 0.08);
      const arm = new THREE.Mesh(armGeo, poleMat);
      arm.position.set(isLeft ? -7.8 : 7.8, 5.4, 0);
      lg.add(arm);

      // Glowing Lamp Bulb
      const bulbGeo = new THREE.SphereGeometry(0.22, 12, 12);
      const bulbMat = new THREE.MeshBasicMaterial({ color: isLeft ? 0x00f0ff : 0xffaa00 });
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(isLeft ? -7.1 : 7.1, 5.3, 0);
      lg.add(bulb);

      lg.position.set(0, 0, z);
      streetLightGroup.add(lg);
      lamps.push({ group: lg, baseZ: z });
    }

    // ── 8. DENSE Cyberpunk City Skyscrapers Flanking Highway (No Darkness!) ──
    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    interface CityBuilding {
      mesh: THREE.Mesh;
      baseZ: number;
    }
    const buildings: CityBuilding[] = [];

    const bldgPalette = [
      { p: "#ff0088", s: "#ffea00" },
      { p: "#00f0ff", s: "#d946ef" },
      { p: "#f43f5e", s: "#38bdf8" },
      { p: "#eab308", s: "#a855f7" },
    ];

    const totalBuildings = 54;
    for (let i = 0; i < totalBuildings; i++) {
      const isLeft = i % 2 === 0;
      const side = isLeft ? -1 : 1;
      const x = side * (8.8 + Math.random() * 7.5);
      const z = -((i * 4.6) % 240);
      const bldgW = 4.8 + Math.random() * 3.8;
      const bldgH = 20 + Math.random() * 38;
      const bldgD = 5.0 + Math.random() * 4.2;

      const pal = bldgPalette[i % bldgPalette.length];
      const tex = createBuildingTexture(pal.p, pal.s);

      // Self-illuminated emissive material so buildings are NEVER dark or black!
      const mat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: tex,
        emissive: 0xffffff,
        emissiveMap: tex,
        emissiveIntensity: 0.65,
        metalness: 0.6,
        roughness: 0.3,
      });

      const geo = new THREE.BoxGeometry(bldgW, bldgH, bldgD);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, bldgH / 2 - 0.2, z);
      cityGroup.add(mesh);
      buildings.push({ mesh, baseZ: z });

      // Add Giant Glowing Neon Billboards directly facing the street
      if (i % 2 === 0) {
        let signText = "BAR";
        let signBorder = "#00f0ff";
        let signNeon = "#00ffff";
        let signBg = "#00121a";

        if (i % 6 === 0) {
          signText = "どこかに"; // Exact Japanese sign from user photo!
          signBorder = "#ff0044";
          signNeon = "#ffe600";
          signBg = "#1a0008";
        } else if (i % 4 === 0) {
          signText = "XXX";
          signBorder = "#ff0077";
          signNeon = "#ff00aa";
          signBg = "#14000b";
        } else if (i % 3 === 0) {
          signText = "RAMEN";
          signBorder = "#ffaa00";
          signNeon = "#fff066";
          signBg = "#160b00";
        }

        const signTex = createNeonSignTexture(signText, signNeon, signBorder, signBg);
        const signGeo = new THREE.PlaneGeometry(4.8, 1.8);
        const signMat = new THREE.MeshBasicMaterial({
          map: signTex,
          transparent: true,
          side: THREE.DoubleSide,
        });
        const signMesh = new THREE.Mesh(signGeo, signMat);

        signMesh.position.set(
          x + (isLeft ? bldgW / 2 + 0.12 : -bldgW / 2 - 0.12),
          5.0 + (i % 5) * 3.0,
          z + 1.2
        );
        signMesh.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2;
        cityGroup.add(signMesh);

        // Vertical Neon Light Column running up the whole height of the skyscraper!
        const colGeo = new THREE.BoxGeometry(0.18, bldgH, 0.18);
        const colMat = new THREE.MeshBasicMaterial({ color: isLeft ? 0x00f0ff : 0xff0066 });
        const colMesh = new THREE.Mesh(colGeo, colMat);
        colMesh.position.set(
          x + (isLeft ? bldgW / 2 + 0.08 : -bldgW / 2 - 0.08),
          bldgH / 2,
          z + bldgD / 2
        );
        cityGroup.add(colMesh);
      }
    }

    // ── 9. High-Speed Motion Blur Neon Streaks ──
    const streakCount = 75;
    const streakMeshes: { mesh: THREE.Mesh; speedMult: number; baseLen: number }[] = [];
    const streakColors = [0xff0066, 0x00f0ff, 0xffea00, 0xa855f7, 0xff3366, 0xffffff];

    for (let i = 0; i < streakCount; i++) {
      const streakLen = 4.5 + Math.random() * 8.5;
      const streakGeo = new THREE.BoxGeometry(0.07, 0.07, streakLen);
      const col = streakColors[i % streakColors.length];
      const streakMat = new THREE.MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: 0.9,
      });
      const streak = new THREE.Mesh(streakGeo, streakMat);

      const side = Math.random() > 0.5 ? 1 : -1;
      const x = side * (3.8 + Math.random() * 6.8);
      const y = 0.35 + Math.random() * 4.2;
      const z = -Math.random() * 160;
      streak.position.set(x, y, z);

      scene.add(streak);
      streakMeshes.push({ mesh: streak, speedMult: 0.85 + Math.random() * 0.45, baseLen: streakLen });
    }

    // ── 10. Crystal-Clear High-Definition Cyberpunk Supercar ──
    const carRoot = new THREE.Group();
    carRoot.position.set(0, 0.48, 0);
    scene.add(carRoot);

    // ── Materials Setup ──
    // Liquid Platinum Silver Metallic Body
    const bodySilverMat = new THREE.MeshStandardMaterial({
      color: 0xf0f4f8,
      metalness: 0.95,
      roughness: 0.12,
      map: albedoTex,
      normalMap: normalTex,
      roughnessMap: roughTex,
      envMap: envTexture,
    });
    applyRimLight(bodySilverMat);

    // Matte Weave Carbon Fiber
    const bodyDarkCarbonMat = new THREE.MeshStandardMaterial({
      color: 0x111317,
      metalness: 0.88,
      roughness: 0.32,
    });

    // Deep Obsidian Polarized Aeronautic Glass
    const cockpitGlassMat = new THREE.MeshStandardMaterial({
      color: 0x050810,
      metalness: 0.98,
      roughness: 0.04,
      transparent: true,
      opacity: 0.94,
    });

    // High-Intensity Cyber Neon Emissives
    const headlightNeonMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const headlightOpticMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const neonCyanEdgeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const neonAmberVentMat = new THREE.MeshStandardMaterial({
      color: 0xffa500,
      metalness: 0.6,
      roughness: 0.15,
      emissive: 0xff9900,
      emissiveIntensity: 1.6,
    });
    const taillightMat = new THREE.MeshBasicMaterial({ color: 0xff0044 });
    const taillightLowerMat = new THREE.MeshBasicMaterial({ color: 0xff0077 });

    // Wheel & Brake Materials
    const brakeRotorMat = new THREE.MeshStandardMaterial({
      color: 0x828894,
      metalness: 0.94,
      roughness: 0.22,
    });
    const brakeCaliperMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      metalness: 0.45,
      roughness: 0.18,
    });
    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0e,
      roughness: 0.88,
      metalness: 0.15,
    });
    const rimAlloyMat = new THREE.MeshStandardMaterial({
      color: 0x1f232c,
      metalness: 0.95,
      roughness: 0.18,
    });
    const rimCyanRingMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

    // ── 1. Cyberpunk Neon Underglow ──
    const underglowGeo = new THREE.PlaneGeometry(2.3, 4.3);
    underglowGeo.rotateX(-Math.PI / 2);
    const underglowMat = new THREE.MeshBasicMaterial({
      map: cyanBloomTex,
      transparent: true,
      opacity: 0.82,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const underglow = new THREE.Mesh(underglowGeo, underglowMat);
    underglow.position.set(0, -0.22, 0.0);
    carRoot.add(underglow);

    // ── 2. Carbon Floor Pan, Front Splitter & Side Skirts ──
    const underbodyGeo = new THREE.BoxGeometry(2.12, 0.04, 4.4);
    const underbody = new THREE.Mesh(underbodyGeo, bodyDarkCarbonMat);
    underbody.position.set(0, -0.18, -0.05);
    carRoot.add(underbody);

    // Front Extended Racing Splitter
    const frontSplitterGeo = new THREE.BoxGeometry(1.72, 0.038, 0.72);
    const frontSplitter = new THREE.Mesh(frontSplitterGeo, bodyDarkCarbonMat);
    frontSplitter.position.set(0, -0.18, -2.18);
    carRoot.add(frontSplitter);

    // Front Splitter Neon Cyan Edge
    const splitterNeonGeo = new THREE.BoxGeometry(1.74, 0.015, 0.02);
    const splitterNeon = new THREE.Mesh(splitterNeonGeo, neonCyanEdgeMat);
    splitterNeon.position.set(0, -0.17, -2.54);
    carRoot.add(splitterNeon);

    // Splitter Aerodynamic Corner Canards / Winglets
    const canardGeo = new THREE.BoxGeometry(0.04, 0.16, 0.42);
    const leftCanard = new THREE.Mesh(canardGeo, bodyDarkCarbonMat);
    leftCanard.position.set(-1.12, -0.11, -2.12);
    leftCanard.rotation.y = -0.18;
    carRoot.add(leftCanard);

    const rightCanard = new THREE.Mesh(canardGeo, bodyDarkCarbonMat);
    rightCanard.position.set(1.12, -0.11, -2.12);
    rightCanard.rotation.y = 0.18;
    carRoot.add(rightCanard);

    // Carbon Side Skirts with Neon Edge Strips
    const skirtGeo = new THREE.BoxGeometry(0.14, 0.05, 2.7);
    const leftSkirt = new THREE.Mesh(skirtGeo, bodyDarkCarbonMat);
    leftSkirt.position.set(-1.14, -0.18, 0.0);
    carRoot.add(leftSkirt);

    const rightSkirt = new THREE.Mesh(skirtGeo, bodyDarkCarbonMat);
    rightSkirt.position.set(1.14, -0.18, 0.0);
    carRoot.add(rightSkirt);

    const skirtNeonGeo = new THREE.BoxGeometry(0.02, 0.015, 2.7);
    const leftSkirtNeon = new THREE.Mesh(skirtNeonGeo, neonCyanEdgeMat);
    leftSkirtNeon.position.set(-1.21, -0.17, 0.0);
    carRoot.add(leftSkirtNeon);

    const rightSkirtNeon = new THREE.Mesh(skirtNeonGeo, neonCyanEdgeMat);
    rightSkirtNeon.position.set(1.21, -0.17, 0.0);
    carRoot.add(rightSkirtNeon);

    // ── 3. Aggressive Rear Diffuser & F1 Rain Light ──
    const diffuserBaseGeo = new THREE.BoxGeometry(1.94, 0.12, 0.85);
    const diffuserBase = new THREE.Mesh(diffuserBaseGeo, bodyDarkCarbonMat);
    diffuserBase.position.set(0, -0.12, 1.95);
    diffuserBase.rotation.x = -0.18;
    carRoot.add(diffuserBase);

    // 4 Vertical Aerodynamic Diffuser Strakes
    const strakeGeo = new THREE.BoxGeometry(0.035, 0.22, 0.75);
    const strakeXPositions = [-0.72, -0.24, 0.24, 0.72];
    strakeXPositions.forEach((sx) => {
      const strake = new THREE.Mesh(strakeGeo, bodyDarkCarbonMat);
      strake.position.set(sx, -0.11, 1.95);
      strake.rotation.x = -0.18;
      carRoot.add(strake);
    });

    // F1-Style Center Flashing Rain/Hazard Light
    const f1LightGeo = new THREE.BoxGeometry(0.18, 0.12, 0.04);
    const f1LightMat = new THREE.MeshBasicMaterial({ color: 0xff0044 });
    const f1Light = new THREE.Mesh(f1LightGeo, f1LightMat);
    f1Light.position.set(0, -0.05, 2.32);
    carRoot.add(f1Light);

    // ── 4. Main Chiseled Aerodynamic Wedge Monocoque ──
    // Central chassis core
    const mainBodyGeo = new THREE.BoxGeometry(1.84, 0.36, 4.05);
    const mainBody = new THREE.Mesh(mainBodyGeo, bodySilverMat);
    mainBody.position.set(0, 0.02, -0.05);
    carRoot.add(mainBody);

    // Slanted Aerodynamic Front Hood
    const frontHoodGeo = new THREE.BoxGeometry(1.78, 0.18, 1.5);
    const frontHood = new THREE.Mesh(frontHoodGeo, bodySilverMat);
    frontHood.position.set(0, 0.08, -1.55);
    frontHood.rotation.x = 0.16;
    carRoot.add(frontHood);

    // Center Hood Power Bulge Crease
    const hoodCreaseGeo = new THREE.BoxGeometry(0.58, 0.05, 1.3);
    const hoodCrease = new THREE.Mesh(hoodCreaseGeo, bodySilverMat);
    hoodCrease.position.set(0, 0.19, -1.48);
    hoodCrease.rotation.x = 0.16;
    carRoot.add(hoodCrease);

    // Dual Recessed Hood Heat Extractor Air Vents
    const hoodVentGeo = new THREE.BoxGeometry(0.36, 0.025, 0.55);
    const leftHoodVent = new THREE.Mesh(hoodVentGeo, bodyDarkCarbonMat);
    leftHoodVent.position.set(-0.48, 0.18, -1.42);
    leftHoodVent.rotation.x = 0.16;
    carRoot.add(leftHoodVent);

    const rightHoodVent = new THREE.Mesh(hoodVentGeo, bodyDarkCarbonMat);
    rightHoodVent.position.set(0.48, 0.18, -1.42);
    rightHoodVent.rotation.x = 0.16;
    carRoot.add(rightHoodVent);

    // Front Bumper Nose & Lower Air Intakes
    const frontNoseGeo = new THREE.BoxGeometry(1.74, 0.22, 0.45);
    const frontNose = new THREE.Mesh(frontNoseGeo, bodySilverMat);
    frontNose.position.set(0, -0.04, -2.12);
    carRoot.add(frontNose);

    const intakeGrilleGeo = new THREE.BoxGeometry(0.68, 0.12, 0.08);
    const leftIntake = new THREE.Mesh(intakeGrilleGeo, bodyDarkCarbonMat);
    leftIntake.position.set(-0.52, -0.07, -2.25);
    carRoot.add(leftIntake);

    const rightIntake = new THREE.Mesh(intakeGrilleGeo, bodyDarkCarbonMat);
    rightIntake.position.set(0.52, -0.07, -2.25);
    carRoot.add(rightIntake);

    // Front Fender Wheel Arches with Top Aerodynamic Pressure Louvers
    const frontArchGeo = new THREE.BoxGeometry(0.24, 0.44, 1.48);
    const leftFrontArch = new THREE.Mesh(frontArchGeo, bodySilverMat);
    leftFrontArch.position.set(-1.02, 0.04, -1.38);
    carRoot.add(leftFrontArch);

    const rightFrontArch = new THREE.Mesh(frontArchGeo, bodySilverMat);
    rightFrontArch.position.set(1.02, 0.04, -1.38);
    carRoot.add(rightFrontArch);

    for (let i = 0; i < 3; i++) {
      const fenderLouverGeo = new THREE.BoxGeometry(0.18, 0.015, 0.08);
      const lfl = new THREE.Mesh(fenderLouverGeo, bodyDarkCarbonMat);
      lfl.position.set(-1.02, 0.27, -1.55 + i * 0.14);
      carRoot.add(lfl);

      const rfl = new THREE.Mesh(fenderLouverGeo, bodyDarkCarbonMat);
      rfl.position.set(1.02, 0.27, -1.55 + i * 0.14);
      carRoot.add(rfl);
    }

    // ── 5. Cyberpunk LED Matrix Headlights ──
    const headlightBarGeo = new THREE.BoxGeometry(0.58, 0.055, 0.08);
    const leftHeadlight = new THREE.Mesh(headlightBarGeo, headlightNeonMat);
    leftHeadlight.position.set(-0.58, 0.06, -2.18);
    leftHeadlight.rotation.y = -0.12;
    carRoot.add(leftHeadlight);

    const rightHeadlight = new THREE.Mesh(headlightBarGeo, headlightNeonMat);
    rightHeadlight.position.set(0.58, 0.06, -2.18);
    rightHeadlight.rotation.y = 0.12;
    carRoot.add(rightHeadlight);

    // Dual Quad Projector Optic Lens Cubes
    const opticCubeGeo = new THREE.BoxGeometry(0.08, 0.04, 0.04);
    [-0.72, -0.56, -0.42].forEach((ox) => {
      const optic = new THREE.Mesh(opticCubeGeo, headlightOpticMat);
      optic.position.set(ox, 0.06, -2.22);
      carRoot.add(optic);
    });
    [0.72, 0.56, 0.42].forEach((ox) => {
      const optic = new THREE.Mesh(opticCubeGeo, headlightOpticMat);
      optic.position.set(ox, 0.06, -2.22);
      carRoot.add(optic);
    });

    // Headlight Neon Bloom Flares
    const headlightBloomGeo = new THREE.PlaneGeometry(1.6, 0.65);
    const headlightBloomMat = new THREE.MeshBasicMaterial({
      map: cyanBloomTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.85,
      depthWrite: false,
    });
    const leftHBloom = new THREE.Mesh(headlightBloomGeo, headlightBloomMat);
    leftHBloom.position.set(-0.58, 0.06, -2.25);
    carRoot.add(leftHBloom);

    const rightHBloom = new THREE.Mesh(headlightBloomGeo, headlightBloomMat);
    rightHBloom.position.set(0.58, 0.06, -2.25);
    carRoot.add(rightHBloom);

    // ── 6. Muscular Widebody Rear Haunches & Side NACA Ducts ──
    const rearFlareGeo = new THREE.BoxGeometry(0.36, 0.52, 1.95);
    const leftFlare = new THREE.Mesh(rearFlareGeo, bodySilverMat);
    leftFlare.position.set(-1.12, 0.08, 0.82);
    carRoot.add(leftFlare);

    const rightFlare = new THREE.Mesh(rearFlareGeo, bodySilverMat);
    rightFlare.position.set(1.12, 0.08, 0.82);
    carRoot.add(rightFlare);

    // Side NACA Air Intake Ducts feeding mid-engine radiators
    const nacaGeo = new THREE.BoxGeometry(0.12, 0.28, 0.55);
    const leftNaca = new THREE.Mesh(nacaGeo, bodyDarkCarbonMat);
    leftNaca.position.set(-1.16, 0.12, 0.02);
    leftNaca.rotation.y = 0.22;
    carRoot.add(leftNaca);

    const rightNaca = new THREE.Mesh(nacaGeo, bodyDarkCarbonMat);
    rightNaca.position.set(1.16, 0.12, 0.02);
    rightNaca.rotation.y = -0.22;
    carRoot.add(rightNaca);

    // Glowing cyan radiator mesh inside NACA scoops
    const meshRadiatorGeo = new THREE.PlaneGeometry(0.24, 0.18);
    const meshRadiatorMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true });
    const leftRad = new THREE.Mesh(meshRadiatorGeo, meshRadiatorMat);
    leftRad.position.set(-1.17, 0.12, 0.08);
    leftRad.rotation.y = Math.PI / 2 + 0.22;
    carRoot.add(leftRad);

    const rightRad = new THREE.Mesh(meshRadiatorGeo, meshRadiatorMat);
    rightRad.position.set(1.17, 0.12, 0.08);
    rightRad.rotation.y = -Math.PI / 2 - 0.22;
    carRoot.add(rightRad);

    // ── 7. Streamlined Fighter-Jet Cockpit Canopy ──
    // Fast Raked Windshield (Angled back 36 degrees)
    const windshieldGeo = new THREE.BoxGeometry(1.36, 0.045, 1.15);
    const windshield = new THREE.Mesh(windshieldGeo, cockpitGlassMat);
    windshield.position.set(0, 0.42, -0.72);
    windshield.rotation.x = 0.58;
    carRoot.add(windshield);

    // Slender Silver A-Pillars
    const aPillarGeo = new THREE.BoxGeometry(0.06, 0.06, 1.18);
    const leftAPillar = new THREE.Mesh(aPillarGeo, bodySilverMat);
    leftAPillar.position.set(-0.68, 0.43, -0.72);
    leftAPillar.rotation.x = 0.58;
    leftAPillar.rotation.z = -0.08;
    carRoot.add(leftAPillar);

    const rightAPillar = new THREE.Mesh(aPillarGeo, bodySilverMat);
    rightAPillar.position.set(0.68, 0.43, -0.72);
    rightAPillar.rotation.x = 0.58;
    rightAPillar.rotation.z = 0.08;
    carRoot.add(rightAPillar);

    // Tapered Double-Bubble Roof Plate
    const roofGeo = new THREE.BoxGeometry(1.24, 0.06, 1.15);
    const roof = new THREE.Mesh(roofGeo, bodySilverMat);
    roof.position.set(0, 0.68, -0.15);
    carRoot.add(roof);

    // Dark Tinted Side Quarter Windows
    const sideWinGeo = new THREE.BoxGeometry(0.04, 0.32, 1.05);
    const leftSideWin = new THREE.Mesh(sideWinGeo, cockpitGlassMat);
    leftSideWin.position.set(-0.63, 0.50, -0.15);
    carRoot.add(leftSideWin);

    const rightSideWin = new THREE.Mesh(sideWinGeo, cockpitGlassMat);
    rightSideWin.position.set(0.63, 0.50, -0.15);
    carRoot.add(rightSideWin);

    // Fastback Slanted Rear Engine Window
    const rearWinGeo = new THREE.BoxGeometry(1.28, 0.045, 0.85);
    const rearWin = new THREE.Mesh(rearWinGeo, cockpitGlassMat);
    rearWin.position.set(0, 0.52, 0.55);
    rearWin.rotation.x = -0.42;
    carRoot.add(rearWin);

    // Roof Ram-Air Periscope Snorkel (Forces cooling air into twin turbos)
    const snorkelGeo = new THREE.BoxGeometry(0.38, 0.14, 0.65);
    const snorkel = new THREE.Mesh(snorkelGeo, bodyDarkCarbonMat);
    snorkel.position.set(0, 0.76, 0.08);
    snorkel.rotation.x = -0.12;
    carRoot.add(snorkel);

    const snorkelMouthGeo = new THREE.BoxGeometry(0.34, 0.09, 0.04);
    const snorkelMouthMat = new THREE.MeshBasicMaterial({ color: 0x050508 });
    const snorkelMouth = new THREE.Mesh(snorkelMouthGeo, snorkelMouthMat);
    snorkelMouth.position.set(0, 0.78, -0.25);
    carRoot.add(snorkelMouth);

    // Aerodynamic Carbon Stalk Side Mirrors with LED Turn Strips
    const mirrorStalkGeo = new THREE.BoxGeometry(0.24, 0.035, 0.05);
    const mirrorHeadGeo = new THREE.BoxGeometry(0.22, 0.08, 0.12);
    const mirrorLedGeo = new THREE.BoxGeometry(0.22, 0.015, 0.02);

    const leftMirrorGroup = new THREE.Group();
    leftMirrorGroup.position.set(-0.82, 0.42, -0.72);
    const leftStalk = new THREE.Mesh(mirrorStalkGeo, bodyDarkCarbonMat);
    leftStalk.position.set(-0.12, 0, 0);
    const leftHead = new THREE.Mesh(mirrorHeadGeo, bodySilverMat);
    leftHead.position.set(-0.24, 0.03, 0);
    const leftLed = new THREE.Mesh(mirrorLedGeo, neonCyanEdgeMat);
    leftLed.position.set(-0.24, 0.03, -0.06);
    leftMirrorGroup.add(leftStalk, leftHead, leftLed);
    carRoot.add(leftMirrorGroup);

    const rightMirrorGroup = new THREE.Group();
    rightMirrorGroup.position.set(0.82, 0.42, -0.72);
    const rightStalk = new THREE.Mesh(mirrorStalkGeo, bodyDarkCarbonMat);
    rightStalk.position.set(0.12, 0, 0);
    const rightHead = new THREE.Mesh(mirrorHeadGeo, bodySilverMat);
    rightHead.position.set(0.24, 0.03, 0);
    const rightLed = new THREE.Mesh(mirrorLedGeo, neonCyanEdgeMat);
    rightLed.position.set(0.24, 0.03, -0.06);
    rightMirrorGroup.add(rightStalk, rightHead, rightLed);
    carRoot.add(rightMirrorGroup);

    // ── 8. Rear Deck Lid & Stepped Engine Louvers ──
    for (let l = 0; l < 5; l++) {
      const louverGeo = new THREE.BoxGeometry(1.26, 0.036, 0.14);
      const louver = new THREE.Mesh(louverGeo, bodyDarkCarbonMat);
      louver.position.set(0, 0.36 - l * 0.048, 0.82 + l * 0.22);
      louver.rotation.x = -0.18;
      carRoot.add(louver);
    }

    // Yellow Heat Vents on Rear Deck Lid
    const ventGeo = new THREE.BoxGeometry(0.34, 0.07, 0.58);
    const leftVent = new THREE.Mesh(ventGeo, neonAmberVentMat);
    leftVent.position.set(-0.46, 0.24, 1.02);
    leftVent.rotation.x = -0.15;
    carRoot.add(leftVent);

    const rightVent = new THREE.Mesh(ventGeo, neonAmberVentMat);
    rightVent.position.set(0.46, 0.24, 1.02);
    rightVent.rotation.x = -0.15;
    carRoot.add(rightVent);

    // Twin Titanium Roof Telemetry Antenna Needles
    const antennaMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const antennaGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.85, 8);
    antennaGeo.rotateX(0.38);

    const leftAntenna = new THREE.Mesh(antennaGeo, antennaMat);
    leftAntenna.position.set(-0.28, 0.72, 0.52);
    carRoot.add(leftAntenna);

    const rightAntenna = new THREE.Mesh(antennaGeo, antennaMat);
    rightAntenna.position.set(0.28, 0.72, 0.52);
    carRoot.add(rightAntenna);

    // ── 9. High-Tech Swan-Neck Active Aero Rear Wing ──
    const spoilerBladeGeo = new THREE.BoxGeometry(2.28, 0.048, 0.46);
    const spoilerBlade = new THREE.Mesh(spoilerBladeGeo, bodyDarkCarbonMat);
    spoilerBlade.position.set(0, 0.62, 1.95);
    carRoot.add(spoilerBlade);

    // Wing Downward Endplates
    const endplateGeo = new THREE.BoxGeometry(0.045, 0.26, 0.52);
    const leftEndplate = new THREE.Mesh(endplateGeo, bodyDarkCarbonMat);
    leftEndplate.position.set(-1.14, 0.60, 1.95);
    carRoot.add(leftEndplate);

    const rightEndplate = new THREE.Mesh(endplateGeo, bodyDarkCarbonMat);
    rightEndplate.position.set(1.14, 0.60, 1.95);
    carRoot.add(rightEndplate);

    // Dual Swan-Neck Carbon Support Pylons
    const strutGeo = new THREE.BoxGeometry(0.05, 0.38, 0.32);
    const leftStrut = new THREE.Mesh(strutGeo, bodyDarkCarbonMat);
    leftStrut.position.set(-0.68, 0.44, 1.88);
    leftStrut.rotation.x = -0.12;
    carRoot.add(leftStrut);

    const rightStrut = new THREE.Mesh(strutGeo, bodyDarkCarbonMat);
    rightStrut.position.set(0.68, 0.44, 1.88);
    rightStrut.rotation.x = -0.12;
    carRoot.add(rightStrut);

    // Integrated Third Brake Light Blade on Wing Trailing Edge
    const wingBrakeGeo = new THREE.BoxGeometry(2.15, 0.02, 0.03);
    const wingBrakeLight = new THREE.Mesh(wingBrakeGeo, taillightMat);
    wingBrakeLight.position.set(0, 0.62, 2.18);
    carRoot.add(wingBrakeLight);

    // ── 10. OLED Rear Taillight Matrix & Holographic Badge ──
    // Seamless Edge-to-Edge Full-Width Red OLED Taillight Blade
    const tailBarGeo = new THREE.BoxGeometry(2.06, 0.08, 0.08);
    const tailBar = new THREE.Mesh(tailBarGeo, taillightMat);
    tailBar.position.set(0, 0.16, 2.05);
    carRoot.add(tailBar);

    // Wrap-around outer fins
    const tailFinGeo = new THREE.BoxGeometry(0.08, 0.08, 0.35);
    const leftTailFin = new THREE.Mesh(tailFinGeo, taillightMat);
    leftTailFin.position.set(-1.03, 0.16, 1.92);
    carRoot.add(leftTailFin);

    const rightTailFin = new THREE.Mesh(tailFinGeo, taillightMat);
    rightTailFin.position.set(1.03, 0.16, 1.92);
    carRoot.add(rightTailFin);

    // Secondary Lower Accent Lightbar
    const lowerBarGeo = new THREE.BoxGeometry(1.86, 0.03, 0.07);
    const lowerBar = new THREE.Mesh(lowerBarGeo, taillightLowerMat);
    lowerBar.position.set(0, 0.04, 2.05);
    carRoot.add(lowerBar);

    // Taillight Halo Bloom Flare
    const tailBloomGeo = new THREE.PlaneGeometry(3.6, 1.25);
    const tailBloomMat = new THREE.MeshBasicMaterial({
      map: redBloomTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.98,
      depthWrite: false,
    });
    const tailBloom = new THREE.Mesh(tailBloomGeo, tailBloomMat);
    tailBloom.position.set(0, 0.16, 2.08);
    carRoot.add(tailBloom);

    // Holographic Cyber Matrix Badge ("QUADRA // TURBO-R")
    const badgeMat = new THREE.MeshBasicMaterial({ color: 0xff0066 });
    const badgeGeo = new THREE.PlaneGeometry(0.85, 0.14);
    const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
    badgeMesh.position.set(0, 0.26, 2.05);
    carRoot.add(badgeMesh);

    // ── 11. Quad Burnt Titanium Rocket Exhausts & Plasma Boost ──
    const exhaustGroup = new THREE.Group();
    carRoot.add(exhaustGroup);

    // 4 Titanium Exhaust Barrels (Dual Twin Tips)
    const exhaustNozzleGeo = new THREE.CylinderGeometry(0.11, 0.125, 0.28, 20);
    exhaustNozzleGeo.rotateX(Math.PI / 2);
    const exhaustNozzleMat = new THREE.MeshStandardMaterial({
      color: 0x1a1e28,
      metalness: 0.96,
      roughness: 0.12,
    });
    const exhaustCoreMat = new THREE.MeshBasicMaterial({ color: 0xff4400 });
    const exhaustCoreGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 16);
    exhaustCoreGeo.rotateX(Math.PI / 2);

    const exhaustPositions = [-0.64, -0.44, 0.44, 0.64];
    exhaustPositions.forEach((exX) => {
      const nozzle = new THREE.Mesh(exhaustNozzleGeo, exhaustNozzleMat);
      nozzle.position.set(exX, -0.06, 2.02);
      exhaustGroup.add(nozzle);

      const core = new THREE.Mesh(exhaustCoreGeo, exhaustCoreMat);
      core.position.set(exX, -0.06, 2.03);
      exhaustGroup.add(core);
    });

    // Outer Magenta Plasma Flames
    const flameGeo = new THREE.ConeGeometry(0.26, 3.2, 16);
    flameGeo.rotateX(-Math.PI / 2);
    flameGeo.translate(0, 0, 1.6);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xd946ef,
      transparent: true,
      opacity: 0.94,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const leftFlame = new THREE.Mesh(flameGeo, flameMat);
    leftFlame.position.set(-0.54, -0.06, 2.08);
    exhaustGroup.add(leftFlame);

    const rightFlame = new THREE.Mesh(flameGeo, flameMat);
    rightFlame.position.set(0.54, -0.06, 2.08);
    exhaustGroup.add(rightFlame);

    // Inner White-Hot Plasma Shock Diamonds
    const innerFlameGeo = new THREE.ConeGeometry(0.12, 2.5, 16);
    innerFlameGeo.rotateX(-Math.PI / 2);
    innerFlameGeo.translate(0, 0, 1.25);
    const innerFlameMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.98,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const leftInnerFlame = new THREE.Mesh(innerFlameGeo, innerFlameMat);
    leftInnerFlame.position.set(-0.54, -0.06, 2.08);
    exhaustGroup.add(leftInnerFlame);

    const rightInnerFlame = new THREE.Mesh(innerFlameGeo, innerFlameMat);
    rightInnerFlame.position.set(0.54, -0.06, 2.08);
    exhaustGroup.add(rightInnerFlame);

    // Ground Road Plasma Glow Flares
    const groundFlameGeo = new THREE.PlaneGeometry(2.1, 4.6);
    groundFlameGeo.rotateX(-Math.PI / 2);
    const groundFlameMat = new THREE.MeshBasicMaterial({
      map: purpleBloomTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.95,
      depthWrite: false,
    });

    const leftGroundGlow = new THREE.Mesh(groundFlameGeo, groundFlameMat);
    leftGroundGlow.position.set(-0.54, 0.035, 3.5);
    scene.add(leftGroundGlow);

    const rightGroundGlow = new THREE.Mesh(groundFlameGeo, groundFlameMat);
    rightGroundGlow.position.set(0.54, 0.035, 3.5);
    scene.add(rightGroundGlow);

    // ── 12. High-Performance Wheels with Calipers & Carbon-Ceramic Rotors ──
    const wheelGroup = new THREE.Group();
    carRoot.add(wheelGroup);

    // Hub Cap Material
    const hubNutMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      metalness: 0.85,
      roughness: 0.25,
    });

    // Helper: Build high-detail wheel assembly with separate steer pivot and spinning axle
    const buildWheelAssembly = (isFront: boolean, isLeft: boolean) => {
      const tireWidth = isFront ? 0.35 : 0.44; // Staggered wider rear racing tires!
      const wheelRadius = 0.36;

      // Outer Steer Group (Rotates on Y for steering without wobble)
      const steerGroup = new THREE.Group();

      // Non-rotating Brake Assembly (Mounts to steer pivot)
      const brakeAssembly = new THREE.Group();
      const rotorGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.04, 24);
      rotorGeo.rotateZ(Math.PI / 2);
      const rotor = new THREE.Mesh(rotorGeo, brakeRotorMat);
      brakeAssembly.add(rotor);

      const caliperGeo = new THREE.BoxGeometry(0.12, 0.16, 0.14);
      const caliper = new THREE.Mesh(caliperGeo, brakeCaliperMat);
      caliper.position.set(isLeft ? -0.08 : 0.08, 0.16, 0.10);
      brakeAssembly.add(caliper);
      steerGroup.add(brakeAssembly);

      // Inner Spinning Wheel (Rotates on X at driving speed)
      const spinner = new THREE.Group();

      // Beveled Performance Tire
      const tireGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, tireWidth, 24);
      tireGeo.rotateZ(Math.PI / 2);
      const tireMesh = new THREE.Mesh(tireGeo, tireMat);
      spinner.add(tireMesh);

      // Forged Gunmetal Rim Barrel
      const rimBarrelGeo = new THREE.CylinderGeometry(0.25, 0.25, tireWidth + 0.005, 24);
      rimBarrelGeo.rotateZ(Math.PI / 2);
      const rimBarrel = new THREE.Mesh(rimBarrelGeo, rimAlloyMat);
      spinner.add(rimBarrel);

      // Glowing Neon Cyan Rim Bead Ring on outer face
      const ringGeo = new THREE.CylinderGeometry(0.248, 0.248, 0.02, 24);
      ringGeo.rotateZ(Math.PI / 2);
      const ringMesh = new THREE.Mesh(ringGeo, rimCyanRingMat);
      ringMesh.position.set(isLeft ? -tireWidth / 2 - 0.004 : tireWidth / 2 + 0.004, 0, 0);
      spinner.add(ringMesh);

      // 5-Split-Spoke Turbine Forged Face
      const spokeGroup = new THREE.Group();
      spokeGroup.position.set(isLeft ? -tireWidth / 2 - 0.002 : tireWidth / 2 + 0.002, 0, 0);
      for (let s = 0; s < 5; s++) {
        const spokeGeo = new THREE.BoxGeometry(0.02, 0.22, 0.045);
        const spoke = new THREE.Mesh(spokeGeo, rimAlloyMat);
        const angle = (s * Math.PI * 2) / 5;
        spoke.rotation.x = angle;
        spoke.position.set(0, Math.sin(angle) * 0.11, Math.cos(angle) * 0.11);
        spokeGroup.add(spoke);
      }
      spinner.add(spokeGroup);

      // Anodized Racing Center-Lock Hub Nut
      const nutGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.06, 12);
      nutGeo.rotateZ(Math.PI / 2);
      const nutMesh = new THREE.Mesh(nutGeo, hubNutMat);
      nutMesh.position.set(isLeft ? -tireWidth / 2 - 0.015 : tireWidth / 2 + 0.015, 0, 0);
      spinner.add(nutMesh);

      steerGroup.add(spinner);
      wheelGroup.add(steerGroup);

      return { steerGroup, spinner };
    };

    // Instantiate 4 Staggered Wheel Assemblies
    const wheelFLObj = buildWheelAssembly(true, true);
    wheelFLObj.steerGroup.position.set(-1.08, -0.12, -1.38);

    const wheelFRObj = buildWheelAssembly(true, false);
    wheelFRObj.steerGroup.position.set(1.08, -0.12, -1.38);

    const wheelRLObj = buildWheelAssembly(false, true);
    wheelRLObj.steerGroup.position.set(-1.14, -0.12, 1.38);

    const wheelRRObj = buildWheelAssembly(false, false);
    wheelRRObj.steerGroup.position.set(1.14, -0.12, 1.38);

    // Variables for steering and rotation animation
    const wheelFL = wheelFLObj.steerGroup;
    const wheelFR = wheelFRObj.steerGroup;
    const wheelRL = wheelRLObj.steerGroup;
    const wheelRR = wheelRRObj.steerGroup;

    // Spinners array - spins on X during highway drive
    const wheels = [
      wheelFLObj.spinner,
      wheelFRObj.spinner,
      wheelRLObj.spinner,
      wheelRRObj.spinner,
    ];

    // ── 11. Mouse Steering (Active ONLY When Hovered) ──
    let targetCarX = 0;
    let targetCarRotY = 0;
    let targetCarRoll = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHoveredRef.current) {
        targetCarX = 0;
        targetCarRotY = 0;
        targetCarRoll = 0;
        return;
      }
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetCarX = normX * 2.5;
      targetCarRotY = -normX * 0.15;
      targetCarRoll = normX * 0.09;
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });

    // ── 12. Locked 60-120FPS Animation Loop (Runs on Hover, Stops on Leave) ──
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

      // Speed Target (0 when mouse is outside window, 120 or 295 when hovered inside)
      const targetSpeed = isHoveredRef.current
        ? (boostStateRef.current ? 295 : 120)
        : 0;

      speed += (targetSpeed - speed) * 0.085;

      if (Math.round(clock * 60) % 4 === 0) {
        setCurrentSpeed(Math.round(speed));
      }

      const speedFactor = speed / 120;

      // Move Lane Markings
      const dashMove = 0.46 * speedFactor;
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

      // Move Road Surface Texture repeat offset for realistic wet highway motion
      roadTex.offset.y -= 0.045 * speedFactor;

      // Move Buildings
      const bldgMove = 0.55 * speedFactor;
      buildings.forEach((item) => {
        item.mesh.position.z += bldgMove;
        if (item.mesh.position.z > 24) {
          item.mesh.position.z -= 240;
        }
      });

      // Move Overhead Gantries
      gantries.forEach((item) => {
        item.group.position.z += bldgMove;
        if (item.group.position.z > 20) {
          item.group.position.z -= 195;
        }
      });

      // Move Streetlight Lamps
      lamps.forEach((item) => {
        item.group.position.z += bldgMove;
        if (item.group.position.z > 18) {
          item.group.position.z -= 252;
        }
      });

      // Move Speed Light Streaks
      streakMeshes.forEach((item) => {
        item.mesh.position.z += 0.9 * speedFactor * item.speedMult;
        if (item.mesh.position.z > 14) {
          item.mesh.position.z = -160 - Math.random() * 25;
        }
        const boostStretch = boostStateRef.current && isHoveredRef.current ? 2.8 : 1.0;
        item.mesh.scale.z = boostStretch;
        (item.mesh.material as THREE.MeshBasicMaterial).opacity = isHoveredRef.current ? 0.9 : 0.25;
      });

      // Rotate Wheels
      const wheelRotSpeed = 0.55 * speedFactor;
      wheels.forEach((w) => {
        w.rotation.x += wheelRotSpeed;
      });

      wheelFL.rotation.y = targetCarRotY * 1.6;
      wheelFR.rotation.y = targetCarRotY * 1.6;

      // Smooth Car Physics
      carRoot.position.x += (targetCarX - carRoot.position.x) * 0.09;
      carRoot.rotation.y += (targetCarRotY - carRoot.rotation.y) * 0.09;
      carRoot.rotation.z += (targetCarRoll - carRoot.rotation.z) * 0.09;

      // Engine Rumble Vibration
      const rumble = speed > 5 ? Math.sin(clock * 48) * (boostStateRef.current ? 0.024 : 0.009) : 0;
      carRoot.position.y = 0.48 + rumble;

      // Acceleration Squat
      const targetSquat = speed > 5 ? (boostStateRef.current ? -0.052 : -0.02) : 0;
      carRoot.rotation.x += (targetSquat - carRoot.rotation.x) * 0.1;

      // Dual Exhaust Plasma Flames
      const flamePulse = Math.sin(clock * 65) * 0.18;
      const boostFlameLen = isHoveredRef.current
        ? (boostStateRef.current ? 3.0 + flamePulse : 1.2 + flamePulse * 0.5)
        : (speed > 5 ? (speed / 120) * 0.5 : 0.001);

      leftFlame.scale.set(1.0, 1.0, boostFlameLen);
      rightFlame.scale.set(1.0, 1.0, boostFlameLen);
      leftInnerFlame.scale.set(1.0, 1.0, boostFlameLen * 0.88);
      rightInnerFlame.scale.set(1.0, 1.0, boostFlameLen * 0.88);

      leftGroundGlow.position.x = carRoot.position.x - 0.54;
      rightGroundGlow.position.x = carRoot.position.x + 0.54;
      const groundGlowOpacity = isHoveredRef.current
        ? (boostStateRef.current ? 0.98 : 0.65)
        : (speed > 5 ? (speed / 120) * 0.35 : 0);
      groundFlameMat.opacity = groundGlowOpacity;

      // Camera Dynamics
      const targetCamZ = isHoveredRef.current && boostStateRef.current ? 4.5 : 3.8;
      camera.position.z += (targetCamZ - camera.position.z) * 0.07;
      camera.position.x += (carRoot.position.x * 0.32 - camera.position.x) * 0.09;

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
