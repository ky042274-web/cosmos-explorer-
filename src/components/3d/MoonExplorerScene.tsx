import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createProceduralTexture } from '../../utils/proceduralTextures';
import { MapPin, Moon, Sun, Award } from 'lucide-react';

export interface MoonLandmark {
  id: string;
  name: string;
  lat: number;
  lon: number;
  type: 'apollo' | 'modern-mission' | 'crater';
  description: string;
  significance: string;
}

export const MOON_LANDMARKS: MoonLandmark[] = [
  {
    id: 'apollo-11',
    name: 'Apollo 11 Landing Site (Statio Tranquillitatis)',
    lat: 0.674,
    lon: 23.473,
    type: 'apollo',
    description: 'First crewed landing on July 20, 1969. Neil Armstrong and Buzz Aldrin stepped onto the lunar basalt plains of the Sea of Tranquility.',
    significance: 'Historic human footsteps and deployment of Early Apollo Scientific Experiments Package (EASEP).',
  },
  {
    id: 'chandrayaan-3',
    name: 'Chandrayaan-3 Shiv Shakti Point',
    lat: -69.37,
    lon: 32.32,
    type: 'modern-mission',
    description: 'Touchdown point of ISRO’s Vikram lander and Pragyan rover near the lunar South Pole on August 23, 2023.',
    significance: 'First landing within the high-latitude lunar South Polar zone, detecting elemental Sulfur and measuring sub-surface temperature gradients.',
  },
  {
    id: 'change-4',
    name: 'Chang’e 4 & Yutu-2 (Far Side Von Kármán Crater)',
    lat: -45.45,
    lon: 177.58,
    type: 'modern-mission',
    description: 'First soft landing on the farside of the Moon in the South Pole-Aitken basin in January 2019.',
    significance: 'Relayed telemetry via Queqiao relay satellite at Earth-Moon L2, probing lunar mantle ejecta.',
  },
  {
    id: 'shackleton-crater',
    name: 'Shackleton Crater (Artemis Base Camp Candidate)',
    lat: -89.9,
    lon: 0.0,
    type: 'crater',
    description: 'A 21-km diameter impact crater at the exact lunar South Pole. Its rims receive near-constant solar illumination while its floor sits in perpetual cryogenic darkness (-240°C).',
    significance: 'Permanently shadowed interior harbors billions of tons of water-ice reserves critical for propellant and life support.',
  },
  {
    id: 'tycho-crater',
    name: 'Tycho Crater',
    lat: -43.3,
    lon: -11.2,
    type: 'crater',
    description: 'One of the most prominent rayed impact craters on the Moon (86 km diameter), formed roughly 108 million years ago.',
    significance: 'Its bright radial ejecta rays span over 1,500 kilometers across the lunar near side.',
  },
];

interface MoonExplorerSceneProps {
  selectedLandmarkId: string | null;
  onSelectLandmark: (landmark: MoonLandmark) => void;
}

export const MoonExplorerScene: React.FC<MoonExplorerSceneProps> = ({
  selectedLandmarkId,
  onSelectLandmark,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [moonPhaseAngle, setMoonPhaseAngle] = useState(0); // 0 to 2PI (New Moon to Full Moon)
  const [hoveredLandmark, setHoveredLandmark] = useState<MoonLandmark | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const moonMeshRef = useRef<THREE.Mesh | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
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

    // Directional Sunlight (controlled by phase slider)
    const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.7);
    sunLight.position.set(50, 0, 30);
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Faint earthshine ambient light on dark side
    const earthshine = new THREE.AmbientLight(0x1e293b, 0.25);
    scene.add(earthshine);

    // Moon Sphere
    const moonRadius = 15;
    const moonGeo = new THREE.SphereGeometry(moonRadius, 64, 64);
    const moonMat = new THREE.MeshStandardMaterial({
      map: createProceduralTexture('moon'),
      roughness: 0.95,
      metalness: 0.05,
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    scene.add(moonMesh);
    moonMeshRef.current = moonMesh;

    // Pins Group
    const pinsGroup = new THREE.Group();
    scene.add(pinsGroup);
    pinsGroupRef.current = pinsGroup;

    MOON_LANDMARKS.forEach((lm) => {
      const pos = latLonToVector3(lm.lat, lm.lon, moonRadius + 0.18);
      const pinGroup = new THREE.Group();
      pinGroup.position.copy(pos);

      const pinGeo = new THREE.SphereGeometry(0.5, 16, 16);
      const pinMat = new THREE.MeshStandardMaterial({
        color: lm.type === 'apollo' ? 0xfacc15 : lm.type === 'modern-mission' ? 0x38bdf8 : 0xec4899,
        emissive: lm.type === 'apollo' ? 0xca8a04 : lm.type === 'modern-mission' ? 0x0284c7 : 0xdb2777,
        emissiveIntensity: 0.6,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.name = lm.id;
      pinGroup.add(pinMesh);
      pinsGroup.add(pinGroup);
    });

    // Raycaster
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
        const matched = MOON_LANDMARKS.find((m) => m.id === id);
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
        const matched = MOON_LANDMARKS.find((m) => m.id === id);
        if (matched) onSelectLandmark(matched);
      }
    };

    container.addEventListener('mousemove', handleMouseMoveRay);
    container.addEventListener('click', handleClickRay);

    // Orbit Controls
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

      moonGeo.dispose();
      moonMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Sunlight direction based on phase angle slider
  useEffect(() => {
    if (sunLightRef.current) {
      const r = 60;
      sunLightRef.current.position.set(
        Math.sin(moonPhaseAngle) * r,
        10,
        Math.cos(moonPhaseAngle) * r
      );
    }
  }, [moonPhaseAngle]);

  const getPhaseName = (angle: number) => {
    const deg = (angle * 180) / Math.PI;
    if (deg < 20 || deg > 340) return 'Full Moon (Earth-facing side fully lit)';
    if (deg < 70) return 'Waxing Gibbous';
    if (deg < 110) return 'First Quarter';
    if (deg < 160) return 'Waxing Crescent';
    if (deg < 200) return 'New Moon (Sunlit on far side)';
    if (deg < 250) return 'Waning Crescent';
    if (deg < 290) return 'Third Quarter';
    return 'Waning Gibbous';
  };

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden bg-radial from-slate-900 via-slate-950 to-black border border-slate-800 shadow-2xl">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Hovered Landmark Floating Tooltip */}
      {hoveredLandmark && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-sky-500/50 shadow-2xl text-xs text-white pointer-events-none flex items-center gap-2 animate-bounce">
          <MapPin className="w-4 h-4 text-amber-400" />
          <span>Click to examine: <strong>{hoveredLandmark.name}</strong></span>
        </div>
      )}

      {/* Lunar Phase Lighting Slider HUD */}
      <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-700/60 shadow-xl text-xs max-w-sm">
        <div className="flex items-center justify-between text-slate-300 font-medium mb-1.5">
          <span className="flex items-center gap-1.5">
            <Moon className="w-4 h-4 text-indigo-400" /> Lunar Phase Illuminator
          </span>
          <span className="text-amber-400 font-mono text-[11px]">{getPhaseName(moonPhaseAngle)}</span>
        </div>
        <input
          type="range"
          min="0"
          max={Math.PI * 2}
          step="0.05"
          value={moonPhaseAngle}
          onChange={(e) => setMoonPhaseAngle(parseFloat(e.target.value))}
          className="w-full accent-indigo-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>Full Moon</span>
          <span>1st Quarter</span>
          <span>New Moon</span>
          <span>3rd Quarter</span>
        </div>
      </div>

      {/* Quick Jump Buttons */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2 overflow-x-auto bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/60 pointer-events-auto text-xs">
          <span className="text-slate-400 font-medium">Lunar Sites:</span>
          {MOON_LANDMARKS.map((lm) => (
            <button
              key={lm.id}
              onClick={() => onSelectLandmark(lm)}
              className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap ${
                selectedLandmarkId === lm.id
                  ? 'bg-amber-600 text-white font-medium ring-1 ring-amber-400'
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
