import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createProceduralTexture } from '../../utils/proceduralTextures';
import { MapPin, Compass, Eye, Info } from 'lucide-react';

export interface MarsLandmark {
  id: string;
  name: string;
  type: 'volcano' | 'canyon' | 'rover-site' | 'crater';
  lat: number;
  lon: number;
  description: string;
  elevationOrDepth: string;
  significance: string;
}

export const MARS_LANDMARKS: MarsLandmark[] = [
  {
    id: 'olympus-mons',
    name: 'Olympus Mons',
    type: 'volcano',
    lat: 18.65,
    lon: -133.8,
    description: 'The tallest planetary mountain and largest shield volcano discovered in our Solar System, standing nearly 22 km above surrounding plains.',
    elevationOrDepth: '+21.9 km elevation (2.5x Everest)',
    significance: 'Maintained by stationary hotspot without moving tectonic plates.',
  },
  {
    id: 'valles-marineris',
    name: 'Valles Marineris',
    type: 'canyon',
    lat: -14.0,
    lon: -59.2,
    description: 'A vast tectonic rift canyon spanning more than 4,000 km across the Martian equator, up to 200 km wide and 7 km deep.',
    elevationOrDepth: '-7.0 km maximum depth',
    significance: 'Formed as crust cracked during uplift of the Tharsis volcanic bulge.',
  },
  {
    id: 'jezero-crater',
    name: 'Jezero Crater (Perseverance & Ingenuity)',
    type: 'rover-site',
    lat: 18.38,
    lon: 77.58,
    description: 'Ancient 45-km impact basin that once hosted a deep liquid freshwater lake and prominent river delta system ~3.7 billion years ago.',
    elevationOrDepth: '-2.5 km below Martian datum',
    significance: 'Primary astrobiology site where Perseverance collects sedimentary cores.',
  },
  {
    id: 'gale-crater',
    name: 'Gale Crater & Mount Sharp (Curiosity)',
    type: 'rover-site',
    lat: -5.4,
    lon: 137.8,
    description: 'A 154-km impact crater featuring a 5.5-km central sedimentary mound (Aeolis Mons) climbed by NASA’s Curiosity rover since 2012.',
    elevationOrDepth: '+5.5 km peak height',
    significance: 'Confirmed long-lived neutral pH lake habitability and clay minerals.',
  },
];

interface MarsExplorerSceneProps {
  selectedLandmarkId: string | null;
  onSelectLandmark: (landmark: MarsLandmark) => void;
}

export const MarsExplorerScene: React.FC<MarsExplorerSceneProps> = ({
  selectedLandmarkId,
  onSelectLandmark,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredLandmark, setHoveredLandmark] = useState<MarsLandmark | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const marsMeshRef = useRef<THREE.Mesh | null>(null);
  const pinsGroupRef = useRef<THREE.Group | null>(null);
  const reqAnimRef = useRef<number | null>(null);

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
    const height = container.clientHeight || 520;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 48);
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
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Direct lighting & ambient
    const sunLight = new THREE.DirectionalLight(0xfff1e6, 2.6);
    sunLight.position.set(50, 25, 45);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x450a0a, 0.4);
    scene.add(ambientLight);

    // Mars Sphere
    const marsRadius = 15;
    const marsGeo = new THREE.SphereGeometry(marsRadius, 64, 64);
    const marsMat = new THREE.MeshStandardMaterial({
      map: createProceduralTexture('mars'),
      roughness: 0.85,
      metalness: 0.05,
    });
    const marsMesh = new THREE.Mesh(marsGeo, marsMat);
    scene.add(marsMesh);
    marsMeshRef.current = marsMesh;

    // Thin Red Atmosphere Glow
    const atmosGeo = new THREE.SphereGeometry(marsRadius * 1.02, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.14,
      side: THREE.BackSide,
    });
    scene.add(new THREE.Mesh(atmosGeo, atmosMat));

    // Landmark Pins
    const pinsGroup = new THREE.Group();
    scene.add(pinsGroup);
    pinsGroupRef.current = pinsGroup;

    MARS_LANDMARKS.forEach((lm) => {
      const pos = latLonToVector3(lm.lat, lm.lon, marsRadius + 0.15);
      const pinGroup = new THREE.Group();
      pinGroup.position.copy(pos);

      // Pin head
      const pinGeo = new THREE.SphereGeometry(0.55, 16, 16);
      const pinMat = new THREE.MeshStandardMaterial({
        color: lm.type === 'rover-site' ? 0x06b6d4 : 0xf59e0b,
        emissive: lm.type === 'rover-site' ? 0x0891b2 : 0xd97706,
        emissiveIntensity: 0.5,
      });
      const pinHead = new THREE.Mesh(pinGeo, pinMat);
      pinHead.name = lm.id;
      pinGroup.add(pinHead);

      pinsGroup.add(pinGroup);
    });

    // Raycaster for clicking landmark pins
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseMoveRay = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const pinMeshes = pinsGroup.children.map((c) => c.children[0]).filter(Boolean);
      const intersects = raycaster.intersectObjects(pinMeshes, false);

      if (intersects.length > 0) {
        const id = intersects[0].object.name;
        const matched = MARS_LANDMARKS.find((m) => m.id === id);
        if (matched) setHoveredLandmark(matched);
        container.style.cursor = 'pointer';
      } else {
        setHoveredLandmark(null);
        container.style.cursor = 'default';
      }
    };

    const handleClickRay = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const pinMeshes = pinsGroup.children.map((c) => c.children[0]).filter(Boolean);
      const intersects = raycaster.intersectObjects(pinMeshes, false);

      if (intersects.length > 0) {
        const id = intersects[0].object.name;
        const matched = MARS_LANDMARKS.find((m) => m.id === id);
        if (matched) onSelectLandmark(matched);
      }
    };

    container.addEventListener('mousemove', handleMouseMoveRay);
    container.addEventListener('click', handleClickRay);

    // Mouse drag rotation
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let cameraAngle = { theta: 0, phi: Math.PI / 2, radius: 48 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMoveGlobal = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      prevMouse = { x: e.clientX, y: e.clientY };

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
      cameraAngle.radius = Math.max(22, Math.min(80, cameraAngle.radius + e.deltaY * 0.05));
      camera.position.x = cameraAngle.radius * Math.sin(cameraAngle.phi) * Math.sin(cameraAngle.theta);
      camera.position.y = cameraAngle.radius * Math.cos(cameraAngle.phi);
      camera.position.z = cameraAngle.radius * Math.sin(cameraAngle.phi) * Math.cos(cameraAngle.theta);
      camera.lookAt(0, 0, 0);
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMoveGlobal);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      reqAnimRef.current = requestAnimationFrame(animate);
      if (marsMeshRef.current) marsMeshRef.current.rotation.y += 0.0008;
      if (pinsGroupRef.current) pinsGroupRef.current.rotation.y += 0.0008;
      renderer.render(scene, camera);
    };
    reqAnimRef.current = requestAnimationFrame(animate);

    return () => {
      if (reqAnimRef.current) cancelAnimationFrame(reqAnimRef.current);
      container.removeEventListener('mousemove', handleMouseMoveRay);
      container.removeEventListener('click', handleClickRay);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMoveGlobal);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);

      marsGeo.dispose();
      marsMat.dispose();
      atmosGeo.dispose();
      atmosMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden bg-radial from-red-950/40 via-slate-950 to-black border border-red-900/30 shadow-2xl">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Hovered Landmark Floating Tooltip */}
      {hoveredLandmark && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-950/90 backdrop-blur-md px-4 py-2 rounded-xl border border-red-500/50 shadow-2xl text-xs text-white pointer-events-none flex items-center gap-2 animate-bounce">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span>Click to examine: <strong>{hoveredLandmark.name}</strong> ({hoveredLandmark.elevationOrDepth})</span>
        </div>
      )}

      {/* Landmark Quick Jump Selector */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2 overflow-x-auto bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/60 pointer-events-auto text-xs">
          <span className="text-slate-400 font-medium">Martian Landmarks:</span>
          {MARS_LANDMARKS.map((lm) => (
            <button
              key={lm.id}
              onClick={() => onSelectLandmark(lm)}
              className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap ${
                selectedLandmarkId === lm.id
                  ? 'bg-red-600 text-white font-medium ring-1 ring-red-400'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {lm.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
