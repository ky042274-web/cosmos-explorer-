import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SOLAR_SYSTEM_BODIES } from '../../data/solarSystemData';
import { createProceduralTexture, createSaturnRingsTexture } from '../../utils/proceduralTextures';
import { Play, Pause, RotateCcw, ZoomIn, Eye, Sparkles } from 'lucide-react';

interface SolarSystemSceneProps {
  selectedPlanetId: string | null;
  onSelectPlanet: (id: string) => void;
  scaleMode?: 'visual' | 'distance';
}

export const SolarSystemScene: React.FC<SolarSystemSceneProps> = ({
  selectedPlanetId,
  onSelectPlanet,
  scaleMode = 'visual',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [hoveredName, setHoveredName] = useState<string | null>(null);

  // References for animation and interaction
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const planetMeshesRef = useRef<Map<string, { mesh: THREE.Mesh; pivot: THREE.Group; dist: number; speed: number; rotSpeed: number }>>(new Map());
  const reqAnimRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect software GL
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

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 4000);
    camera.position.set(0, 140, 240);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Starfield particles in deep space
    const starGeo = new THREE.BufferGeometry();
    const starCount = isSoftwareGl ? 800 : 2500;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 3000;
      starPositions[i + 1] = (Math.random() - 0.5) * 3000;
      starPositions[i + 2] = (Math.random() - 0.5) * 3000;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.5,
      transparent: true,
      opacity: 0.8,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Ambient light for dark side of planets
    const ambientLight = new THREE.AmbientLight(0x334155, 0.4);
    scene.add(ambientLight);

    // Sun light source
    const sunLight = new THREE.PointLight(0xfffbeb, 2.8, 2500, 0.3);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Planetary radii for visual representation
    const visualScale: Record<string, { radius: number; dist: number; speed: number; rotSpeed: number }> = {
      sun: { radius: 18, dist: 0, speed: 0, rotSpeed: 0.002 },
      mercury: { radius: 1.6, dist: 30, speed: 0.04, rotSpeed: 0.01 },
      venus: { radius: 3.2, dist: 44, speed: 0.015, rotSpeed: -0.004 },
      earth: { radius: 3.5, dist: 60, speed: 0.01, rotSpeed: 0.02 },
      mars: { radius: 2.2, dist: 78, speed: 0.008, rotSpeed: 0.018 },
      jupiter: { radius: 9.5, dist: 115, speed: 0.0035, rotSpeed: 0.04 },
      saturn: { radius: 7.8, dist: 155, speed: 0.002, rotSpeed: 0.035 },
      uranus: { radius: 5.0, dist: 195, speed: 0.0012, rotSpeed: -0.02 },
      neptune: { radius: 4.8, dist: 235, speed: 0.0008, rotSpeed: 0.022 },
      pluto: { radius: 1.2, dist: 270, speed: 0.0005, rotSpeed: 0.008 },
    };

    const orbitLinesGroup = new THREE.Group();
    scene.add(orbitLinesGroup);

    // Build the Sun & Planets
    planetMeshesRef.current.clear();

    SOLAR_SYSTEM_BODIES.forEach((body) => {
      const cfg = visualScale[body.id];
      if (!cfg) return;

      const texture = createProceduralTexture(body.texturePattern);
      const geometry = new THREE.SphereGeometry(cfg.radius, 32, 32);

      let material: THREE.Material;
      if (body.id === 'sun') {
        // Glowing emissive material for the Sun
        material = new THREE.MeshBasicMaterial({
          map: texture,
        });

        // Pulsing Corona Mesh
        const coronaGeo = new THREE.SphereGeometry(cfg.radius * 1.15, 32, 32);
        const coronaMat = new THREE.MeshBasicMaterial({
          color: 0xf59e0b,
          transparent: true,
          opacity: 0.35,
          side: THREE.BackSide,
        });
        const corona = new THREE.Mesh(coronaGeo, coronaMat);
        scene.add(corona);
      } else {
        material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.8,
          metalness: 0.1,
        });
      }

      const planetMesh = new THREE.Mesh(geometry, material);
      planetMesh.name = body.id;

      // Saturn Rings
      if (body.hasRings) {
        const ringGeo = new THREE.RingGeometry(cfg.radius * 1.3, cfg.radius * 2.3, 64);
        // Correct ring UV mapping to radial
        const pos = ringGeo.attributes.position;
        const uvs = [];
        for (let i = 0; i < pos.count; i++) {
          const vx = pos.getX(i);
          const vy = pos.getY(i);
          const r = Math.sqrt(vx * vx + vy * vy);
          const u = (r - cfg.radius * 1.3) / (cfg.radius * 2.3 - cfg.radius * 1.3);
          uvs.push(u, 0.5);
        }
        ringGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

        const ringMat = new THREE.MeshStandardMaterial({
          map: createSaturnRingsTexture(),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
          roughness: 0.7,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.3;
        planetMesh.add(ringMesh);
      }

      // Earth's Moon
      if (body.id === 'earth') {
        const moonGeo = new THREE.SphereGeometry(0.9, 16, 16);
        const moonMat = new THREE.MeshStandardMaterial({
          map: createProceduralTexture('moon'),
          roughness: 0.9,
        });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        moonMesh.position.set(6, 0, 0);
        planetMesh.add(moonMesh);
      }

      // Orbital pivot
      const pivot = new THREE.Group();
      scene.add(pivot);

      planetMesh.position.x = cfg.dist;
      pivot.add(planetMesh);

      planetMeshesRef.current.set(body.id, {
        mesh: planetMesh,
        pivot: pivot,
        dist: cfg.dist,
        speed: cfg.speed,
        rotSpeed: cfg.rotSpeed,
      });

      // Draw Orbit Line
      if (cfg.dist > 0) {
        const orbitCurve = new THREE.EllipseCurve(0, 0, cfg.dist, cfg.dist, 0, 2 * Math.PI, false, 0);
        const points = orbitCurve.getPoints(120);
        const orbitGeo = new THREE.BufferGeometry().setFromPoints(
          points.map((p) => new THREE.Vector3(p.x, 0, p.y))
        );
        const orbitMat = new THREE.LineBasicMaterial({
          color: 0x334155,
          transparent: true,
          opacity: 0.5,
        });
        const orbitLine = new THREE.Line(orbitGeo, orbitMat);
        orbitLinesGroup.add(orbitLine);
      }
    });

    // Asteroid Belt Particles (between Mars and Jupiter, radii 90 to 105)
    const asteroidGeo = new THREE.BufferGeometry();
    const asteroidCount = isSoftwareGl ? 600 : 1800;
    const asteroidPos = new Float32Array(asteroidCount * 3);
    for (let i = 0; i < asteroidCount * 3; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 88 + Math.random() * 22;
      const heightVar = (Math.random() - 0.5) * 6;
      asteroidPos[i] = Math.cos(angle) * radius;
      asteroidPos[i + 1] = heightVar;
      asteroidPos[i + 2] = Math.sin(angle) * radius;
    }
    asteroidGeo.setAttribute('position', new THREE.BufferAttribute(asteroidPos, 3));
    const asteroidMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 1.2,
      transparent: true,
      opacity: 0.7,
    });
    const asteroidBelt = new THREE.Points(asteroidGeo, asteroidMat);
    scene.add(asteroidBelt);

    // Raycaster for mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = Array.from(planetMeshesRef.current.values()).map((v) => v.mesh);
      const intersects = raycaster.intersectObjects(meshes, false);

      if (intersects.length > 0) {
        const foundId = intersects[0].object.name;
        const found = SOLAR_SYSTEM_BODIES.find((b) => b.id === foundId);
        if (found) setHoveredName(found.name);
        container.style.cursor = 'pointer';
      } else {
        setHoveredName(null);
        container.style.cursor = 'default';
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = Array.from(planetMeshesRef.current.values()).map((v) => v.mesh);
      const intersects = raycaster.intersectObjects(meshes, false);

      if (intersects.length > 0) {
        const clickedPlanetId = intersects[0].object.name;
        onSelectPlanet(clickedPlanetId);
      }
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('click', handleClick);

    // Simple Drag Controls for Camera Rotation
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let cameraAngle = { theta: 0, phi: Math.PI / 4, radius: 260 };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isDragging = true;
        prevMousePos = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseMoveGlobal = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMousePos.x;
      const dy = e.clientY - prevMousePos.y;
      prevMousePos = { x: e.clientX, y: e.clientY };

      cameraAngle.theta -= dx * 0.005;
      cameraAngle.phi = Math.max(0.1, Math.min(Math.PI / 2.1, cameraAngle.phi - dy * 0.005));

      camera.position.x = cameraAngle.radius * Math.sin(cameraAngle.phi) * Math.sin(cameraAngle.theta);
      camera.position.y = cameraAngle.radius * Math.cos(cameraAngle.phi);
      camera.position.z = cameraAngle.radius * Math.sin(cameraAngle.phi) * Math.cos(cameraAngle.theta);
      camera.lookAt(0, 0, 0);
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraAngle.radius = Math.max(40, Math.min(600, cameraAngle.radius + e.deltaY * 0.25));
      camera.position.x = cameraAngle.radius * Math.sin(cameraAngle.phi) * Math.sin(cameraAngle.theta);
      camera.position.y = cameraAngle.radius * Math.cos(cameraAngle.phi);
      camera.position.z = cameraAngle.radius * Math.sin(cameraAngle.phi) * Math.cos(cameraAngle.theta);
      camera.lookAt(0, 0, 0);
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMoveGlobal);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // Handle Window Resize
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
    let lastTime = performance.now();
    const animate = (time: number) => {
      reqAnimRef.current = requestAnimationFrame(animate);
      const delta = (time - lastTime) * 0.001;
      lastTime = time;

      // Orbit Asteroid belt slowly
      asteroidBelt.rotation.y += 0.0003 * simSpeed;

      // Rotate planets & revolve around Sun
      planetMeshesRef.current.forEach((item) => {
        item.mesh.rotation.y += item.rotSpeed * simSpeed;
        if (isPlaying && item.speed > 0) {
          item.pivot.rotation.y += item.speed * simSpeed * 0.5;
        }
      });

      renderer.render(scene, camera);
    };

    reqAnimRef.current = requestAnimationFrame(animate);

    return () => {
      if (reqAnimRef.current) cancelAnimationFrame(reqAnimRef.current);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMoveGlobal);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);

      // Dispose Geometries and Materials
      starGeo.dispose();
      starMat.dispose();
      asteroidGeo.dispose();
      asteroidMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isPlaying, simSpeed]);

  // Orbit Visibility Toggle
  useEffect(() => {
    if (sceneRef.current) {
      const orbitGroup = sceneRef.current.children.find((c) => c instanceof THREE.Group && c.children.some((x) => x instanceof THREE.Line));
      if (orbitGroup) orbitGroup.visible = showOrbits;
    }
  }, [showOrbits]);

  const handleResetCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 140, 240);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  return (
    <div className="relative w-full h-[620px] rounded-2xl overflow-hidden bg-radial from-slate-950 via-gray-950 to-black border border-slate-800 shadow-2xl group">
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Hovered Target Pill */}
      {hoveredName && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-indigo-950/80 backdrop-blur-md border border-indigo-500/50 text-indigo-200 text-sm font-medium tracking-wide flex items-center gap-2 pointer-events-none shadow-lg animate-pulse">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Click to inspect: <strong className="text-white">{hoveredName}</strong></span>
        </div>
      )}

      {/* Floating Control HUD */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Playback & Speed Controls */}
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/60 pointer-events-auto shadow-xl">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-1.5 px-2">
            {[0.5, 1, 2, 5].map((spd) => (
              <button
                key={spd}
                onClick={() => setSimSpeed(spd)}
                className={`text-xs px-2 py-1 rounded-md font-mono font-medium transition-all ${
                  simSpeed === spd
                    ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-400/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-700" />

          <button
            onClick={() => setShowOrbits(!showOrbits)}
            className={`text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              showOrbits ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Orbital Lines"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Orbits</span>
          </button>

          <button
            onClick={handleResetCamera}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Reset Camera View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Legend / Quick Nav */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/60 pointer-events-auto shadow-xl text-xs">
          <span className="text-slate-400 font-medium mr-1 hidden sm:inline">Quick Jump:</span>
          {SOLAR_SYSTEM_BODIES.slice(0, 9).map((body) => (
            <button
              key={body.id}
              onClick={() => onSelectPlanet(body.id)}
              className={`px-2 py-1 rounded-md transition-all whitespace-nowrap ${
                selectedPlanetId === body.id
                  ? 'bg-indigo-600 text-white font-semibold ring-1 ring-indigo-400'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {body.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
