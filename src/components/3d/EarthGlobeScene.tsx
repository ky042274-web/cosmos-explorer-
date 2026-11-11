import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createProceduralTexture } from '../../utils/proceduralTextures';
import { Layers, Activity, Radio, Sun, RotateCcw } from 'lucide-react';

interface Earthquake {
  id: string;
  magnitude: number;
  place: string;
  coords: [number, number]; // [lat, lon]
}

interface EarthGlobeSceneProps {
  issPosition?: { lat: number; lon: number };
  earthquakes?: Earthquake[];
}

export const EarthGlobeScene: React.FC<EarthGlobeSceneProps> = ({
  issPosition,
  earthquakes = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showClouds, setShowClouds] = useState(true);
  const [showQuakes, setShowQuakes] = useState(true);
  const [showIss, setShowIss] = useState(true);
  const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const quakesGroupRef = useRef<THREE.Group | null>(null);
  const issMeshRef = useRef<THREE.Group | null>(null);
  const reqAnimRef = useRef<number | null>(null);

  // Helper to convert Lat/Lon to 3D Sphere Vector
  const latLonToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 540;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 52);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting (Sun from right angle for natural day/night terminator)
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(60, 20, 40);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x1e293b, 0.35);
    scene.add(ambientLight);

    // Earth Sphere
    const earthRadius = 16;
    const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthTexture = createProceduralTexture('earth');
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.65,
      metalness: 0.1,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // Atmosphere Glow Layer
    const atmosGeo = new THREE.SphereGeometry(earthRadius * 1.025, 48, 48);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    scene.add(atmosMesh);

    // Swirling Clouds Sphere
    const cloudsGeo = new THREE.SphereGeometry(earthRadius * 1.012, 48, 48);
    // Procedural cloud alpha canvas
    const cloudCanvas = document.createElement('canvas');
    cloudCanvas.width = 512;
    cloudCanvas.height = 256;
    const cctx = cloudCanvas.getContext('2d')!;
    cctx.fillStyle = 'rgba(255, 255, 255, 0)';
    cctx.fillRect(0, 0, 512, 256);
    cctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    for (let i = 0; i < 60; i++) {
      const cx = Math.random() * 512;
      const cy = 40 + Math.random() * 176;
      cctx.beginPath();
      cctx.ellipse(cx, cy, 30 + Math.random() * 40, 8 + Math.random() * 12, 0.2, 0, Math.PI * 2);
      cctx.fill();
    }
    const cloudTex = new THREE.CanvasTexture(cloudCanvas);
    cloudTex.colorSpace = THREE.SRGBColorSpace;
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: cloudTex,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    scene.add(cloudsMesh);
    cloudsMeshRef.current = cloudsMesh;

    // Earthquakes Group
    const quakesGroup = new THREE.Group();
    scene.add(quakesGroup);
    quakesGroupRef.current = quakesGroup;

    // ISS 3D Model Group
    const issGroup = new THREE.Group();
    // Central Module
    const issBodyGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.2, 8);
    const issBodyMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8, roughness: 0.2 });
    const issBody = new THREE.Mesh(issBodyGeo, issBodyMat);
    issBody.rotation.z = Math.PI / 2;
    issGroup.add(issBody);

    // Solar panels
    const panelGeo = new THREE.BoxGeometry(0.1, 1.8, 0.6);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1 });
    const panelLeft = new THREE.Mesh(panelGeo, panelMat);
    panelLeft.position.x = -1.1;
    const panelRight = new THREE.Mesh(panelGeo, panelMat);
    panelRight.position.x = 1.1;
    issGroup.add(panelLeft);
    issGroup.add(panelRight);

    scene.add(issGroup);
    issMeshRef.current = issGroup;

    // ISS Orbit Path Ring
    const orbitRadius = earthRadius + 2.8;
    const issOrbitGeo = new THREE.RingGeometry(orbitRadius - 0.05, orbitRadius + 0.05, 96);
    const issOrbitMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const issOrbitMesh = new THREE.Mesh(issOrbitGeo, issOrbitMat);
    issOrbitMesh.rotation.x = Math.PI / 2 - 0.9; // 51.6° ISS inclination
    scene.add(issOrbitMesh);

    // Drag Orbit Controls
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let cameraAngle = { theta: 0, phi: Math.PI / 2, radius: 50 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMousePos.x;
      const dy = e.clientY - prevMousePos.y;
      prevMousePos = { x: e.clientX, y: e.clientY };

      cameraAngle.theta -= dx * 0.005;
      cameraAngle.phi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraAngle.phi - dy * 0.005));

      camera.position.x = cameraAngle.radius * Math.sin(cameraAngle.phi) * Math.sin(cameraAngle.theta);
      camera.position.y = cameraAngle.radius * Math.cos(cameraAngle.phi);
      camera.position.z = cameraAngle.radius * Math.sin(cameraAngle.phi) * Math.cos(cameraAngle.theta);
      camera.lookAt(0, 0, 0);
    };

    const handleMouseUp = () => (isDragging = false);

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraAngle.radius = Math.max(24, Math.min(90, cameraAngle.radius + e.deltaY * 0.05));
      camera.position.x = cameraAngle.radius * Math.sin(cameraAngle.phi) * Math.sin(cameraAngle.theta);
      camera.position.y = cameraAngle.radius * Math.cos(cameraAngle.phi);
      camera.position.z = cameraAngle.radius * Math.sin(cameraAngle.phi) * Math.cos(cameraAngle.theta);
      camera.lookAt(0, 0, 0);
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const animate = () => {
      reqAnimRef.current = requestAnimationFrame(animate);

      // Earth slow rotation
      if (earthMeshRef.current) {
        earthMeshRef.current.rotation.y += 0.0006;
      }
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += 0.0008; // clouds rotate slightly faster
      }

      renderer.render(scene, camera);
    };
    reqAnimRef.current = requestAnimationFrame(animate);

    return () => {
      if (reqAnimRef.current) cancelAnimationFrame(reqAnimRef.current);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);

      earthGeo.dispose();
      earthMat.dispose();
      atmosGeo.dispose();
      atmosMat.dispose();
      cloudsGeo.dispose();
      cloudsMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Earthquakes on globe
  useEffect(() => {
    if (!quakesGroupRef.current) return;
    quakesGroupRef.current.clear();

    if (!showQuakes) return;

    earthquakes.forEach((eq) => {
      const pos = latLonToVector3(eq.coords[0], eq.coords[1], 16.1);
      const scale = Math.max(0.4, (eq.magnitude - 4) * 0.4);
      const geo = new THREE.SphereGeometry(scale, 12, 12);
      const mat = new THREE.MeshBasicMaterial({
        color: eq.magnitude >= 6 ? 0xef4444 : 0xf59e0b,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      quakesGroupRef.current!.add(mesh);
    });
  }, [earthquakes, showQuakes]);

  // Update ISS position on globe
  useEffect(() => {
    if (!issMeshRef.current) return;
    issMeshRef.current.visible = showIss;

    if (issPosition && showIss) {
      const pos = latLonToVector3(issPosition.lat, issPosition.lon, 18.8);
      issMeshRef.current.position.copy(pos);
      issMeshRef.current.lookAt(0, 0, 0);
    }
  }, [issPosition, showIss]);

  // Toggle clouds
  useEffect(() => {
    if (cloudsMeshRef.current) {
      cloudsMeshRef.current.visible = showClouds;
    }
  }, [showClouds]);

  return (
    <div className="relative w-full h-[540px] rounded-2xl overflow-hidden bg-radial from-slate-950 via-slate-900 to-black border border-slate-800 shadow-2xl">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Earth Layers Overlay HUD */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-3 rounded-xl border border-slate-700/60 shadow-xl text-xs">
        <span className="text-slate-400 font-semibold tracking-wider uppercase text-[10px] flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-400" /> Layer Controls
        </span>
        <button
          onClick={() => setShowClouds(!showClouds)}
          className={`px-2.5 py-1.5 rounded-lg flex items-center justify-between gap-3 transition-colors ${
            showClouds ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Atmospheric Clouds</span>
          <span className={`w-2 h-2 rounded-full ${showClouds ? 'bg-cyan-400' : 'bg-slate-600'}`} />
        </button>

        <button
          onClick={() => setShowQuakes(!showQuakes)}
          className={`px-2.5 py-1.5 rounded-lg flex items-center justify-between gap-3 transition-colors ${
            showQuakes ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-400" /> Live USGS Quakes ({earthquakes.length})
          </span>
          <span className={`w-2 h-2 rounded-full ${showQuakes ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`} />
        </button>

        <button
          onClick={() => setShowIss(!showIss)}
          className={`px-2.5 py-1.5 rounded-lg flex items-center justify-between gap-3 transition-colors ${
            showIss ? 'bg-sky-600/30 text-sky-200 border border-sky-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-sky-400" /> ISS Orbit & Telemetry
          </span>
          <span className={`w-2 h-2 rounded-full ${showIss ? 'bg-sky-400 animate-ping' : 'bg-slate-600'}`} />
        </button>
      </div>

      {/* ISS Telemetry Badge */}
      {issPosition && showIss && (
        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-sky-500/40 shadow-xl text-xs flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <div className="font-semibold text-white">ISS Real-Time Position</div>
            <div className="font-mono text-sky-300">
              {issPosition.lat.toFixed(2)}° Lat, {issPosition.lon.toFixed(2)}° Lon
            </div>
          </div>
        </div>
      )}

      {/* Instruction Tip */}
      <div className="absolute bottom-4 left-4 text-[11px] text-slate-400 bg-slate-950/70 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-800">
        Drag to rotate Earth globe • Scroll to zoom • Sunlight represents real solar angle
      </div>
    </div>
  );
};
