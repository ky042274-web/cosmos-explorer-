import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, Zap, Activity, Info, Gauge } from 'lucide-react';

interface BlackHoleSceneProps {
  massSolarMasses?: number;
}

export const BlackHoleScene: React.FC<BlackHoleSceneProps> = ({
  massSolarMasses = 4.15e6, // Default Sagittarius A*
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [spinParameter, setSpinParameter] = useState(0.85); // Kerr spin (0 to 0.998)
  const [showSpacetimeGrid, setShowSpacetimeGrid] = useState(true);
  const [showJets, setShowJets] = useState(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const accretionDiskRef = useRef<THREE.Mesh | null>(null);
  const spacetimeGridRef = useRef<THREE.GridHelper | null>(null);
  const jetsGroupRef = useRef<THREE.Group | null>(null);
  const reqAnimRef = useRef<number | null>(null);

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

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 24, 52);
    camera.lookAt(0, 0, 0);
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
    renderer.toneMappingExposure = 1.3;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Distant Stars (lensed backdrop)
    const starGeo = new THREE.BufferGeometry();
    const starCount = isSoftwareGl ? 600 : 1600;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 600;
      starPos[i + 1] = (Math.random() - 0.5) * 600;
      starPos[i + 2] = (Math.random() - 0.5) * 600;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.2, transparent: true, opacity: 0.65 });
    scene.add(new THREE.Points(starGeo, starMat));

    // 1. Spacetime Curvature Funnel Grid
    const gridHelper = new THREE.GridHelper(80, 40, 0x38bdf8, 0x1e293b);
    gridHelper.position.y = -6;
    scene.add(gridHelper);
    spacetimeGridRef.current = gridHelper;

    // 2. Event Horizon (Schwarzschild / Kerr shadow)
    const rs = 7; // Visual radius
    const horizonGeo = new THREE.SphereGeometry(rs, 48, 48);
    const horizonMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const eventHorizon = new THREE.Mesh(horizonGeo, horizonMat);
    scene.add(eventHorizon);

    // 3. Photon Sphere Ring (1.5 x rs)
    const photonRingGeo = new THREE.RingGeometry(rs * 1.35, rs * 1.48, 64);
    const photonRingMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const photonRing = new THREE.Mesh(photonRingGeo, photonRingMat);
    photonRing.rotation.x = Math.PI / 2;
    scene.add(photonRing);

    // 4. Accretion Disk (Doppler boosted glowing plasma)
    const diskGeo = new THREE.RingGeometry(rs * 1.6, rs * 4.2, 96);
    // Custom procedural canvas texture with Doppler asymmetry (left side bright/blue, right side dim/red)
    const diskCanvas = document.createElement('canvas');
    diskCanvas.width = 512;
    diskCanvas.height = 64;
    const dctx = diskCanvas.getContext('2d')!;
    const grad = dctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, '#38bdf8');   // Relativistic blueshift
    grad.addColorStop(0.3, '#f59e0b'); // Hot ionized gas
    grad.addColorStop(0.7, '#ea580c'); // Orange plasma
    grad.addColorStop(1.0, '#7f1d1d'); // Relativistic redshift & dimming
    dctx.fillStyle = grad;
    dctx.fillRect(0, 0, 512, 64);

    const diskTex = new THREE.CanvasTexture(diskCanvas);
    diskTex.colorSpace = THREE.SRGBColorSpace;
    const diskMat = new THREE.MeshBasicMaterial({
      map: diskTex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const accretionDisk = new THREE.Mesh(diskGeo, diskMat);
    accretionDisk.rotation.x = Math.PI / 2;
    scene.add(accretionDisk);
    accretionDiskRef.current = accretionDisk;

    // 5. Relativistic Plasma Jets (Top & Bottom poles)
    const jetsGroup = new THREE.Group();
    const jetGeo = new THREE.CylinderGeometry(0.5, 3.5, 36, 16);
    const jetMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const topJet = new THREE.Mesh(jetGeo, jetMat);
    topJet.position.y = 22;
    const bottomJet = new THREE.Mesh(jetGeo, jetMat);
    bottomJet.position.y = -22;
    bottomJet.rotation.z = Math.PI;
    jetsGroup.add(topJet);
    jetsGroup.add(bottomJet);
    scene.add(jetsGroup);
    jetsGroupRef.current = jetsGroup;

    // Mouse Interaction
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let cameraAngle = { theta: 0, phi: Math.PI / 3, radius: 56 };

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
      cameraAngle.radius = Math.max(20, Math.min(90, cameraAngle.radius + e.deltaY * 0.05));
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
      if (accretionDiskRef.current) {
        accretionDiskRef.current.rotation.z += 0.015 * (1 + spinParameter * 2);
      }
      renderer.render(scene, camera);
    };
    reqAnimRef.current = requestAnimationFrame(animate);

    return () => {
      if (reqAnimRef.current) cancelAnimationFrame(reqAnimRef.current);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMoveGlobal);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);

      horizonGeo.dispose();
      horizonMat.dispose();
      diskGeo.dispose();
      diskMat.dispose();
      jetGeo.dispose();
      jetMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [spinParameter]);

  useEffect(() => {
    if (spacetimeGridRef.current) spacetimeGridRef.current.visible = showSpacetimeGrid;
  }, [showSpacetimeGrid]);

  useEffect(() => {
    if (jetsGroupRef.current) jetsGroupRef.current.visible = showJets;
  }, [showJets]);

  // Real relativistic physics calculations
  const G = 6.6743e-11;
  const c = 2.99792e8;
  const M_sun = 1.989e30;
  const totalMassKg = massSolarMasses * M_sun;
  const schwarzschildRadiusKm = (2 * G * totalMassKg) / (c * c * 1000);
  const iscoRadiusKm = (schwarzschildRadiusKm / 2) * (1 + Math.sqrt(1 - spinParameter * spinParameter));

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden bg-radial from-slate-950 via-purple-950/30 to-black border border-purple-900/30 shadow-2xl">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Kerr Parameter & Relativistic HUD */}
      <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-700/60 shadow-xl text-xs max-w-sm">
        <div className="flex items-center justify-between text-white font-semibold mb-2">
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-purple-400" /> Kerr Black Hole Physics
          </span>
          <span className="text-amber-400 font-mono text-[11px]">
            a* = {spinParameter.toFixed(2)}
          </span>
        </div>

        <div className="mb-2">
          <div className="flex justify-between text-[11px] text-slate-300 mb-1">
            <span>Spin Parameter (Kerr a/M)</span>
            <span className="font-mono">{Math.round(spinParameter * 100)}% Max</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.998"
            step="0.01"
            value={spinParameter}
            onChange={(e) => setSpinParameter(parseFloat(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
          <div>
            <div className="text-slate-400">Event Horizon (rs):</div>
            <div className="font-mono text-purple-300 font-medium">
              {(schwarzschildRadiusKm / 1e6).toFixed(2)}M km
            </div>
          </div>
          <div>
            <div className="text-slate-400">ISCO Orbit:</div>
            <div className="font-mono text-cyan-300 font-medium">
              {(iscoRadiusKm / 1e6).toFixed(2)}M km
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800">
          <button
            onClick={() => setShowSpacetimeGrid(!showSpacetimeGrid)}
            className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
              showSpacetimeGrid ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'text-slate-500 hover:text-white'
            }`}
          >
            Spacetime Grid
          </button>
          <button
            onClick={() => setShowJets(!showJets)}
            className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
              showJets ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-500 hover:text-white'
            }`}
          >
            Relativistic Jets
          </button>
        </div>
      </div>

      {/* Relativistic Beaming Explanation Tip */}
      <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-xl text-[11px] text-slate-300 max-w-xs">
        <strong className="text-cyan-300">Doppler Beaming Effect:</strong> The side of the accretion disk rotating toward you appears brighter and blue-shifted; the receding side is dimmed and redshifted.
      </div>
    </div>
  );
};
