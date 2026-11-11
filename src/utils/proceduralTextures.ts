import * as THREE from 'three';

// Cache generated textures to avoid regenerating identical procedural textures
const textureCache = new Map<string, THREE.CanvasTexture>();

export function createProceduralTexture(type: string): THREE.CanvasTexture {
  if (textureCache.has(type)) {
    return textureCache.get(type)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  switch (type) {
    case 'sun': {
      // Radiant solar plasma with turbulent convection cells
      const gradient = ctx.createRadialGradient(512, 256, 10, 512, 256, 512);
      gradient.addColorStop(0, '#fffbeb');
      gradient.addColorStop(0.3, '#f59e0b');
      gradient.addColorStop(0.7, '#d97706');
      gradient.addColorStop(1, '#b45309');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 512);

      // Solar granulaton & flares
      ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
      for (let i = 0; i < 400; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const r = 2 + Math.random() * 12;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'rocky-mercury': {
      ctx.fillStyle = '#64748b';
      ctx.fillRect(0, 0, 1024, 512);
      // Impact craters
      for (let i = 0; i < 300; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const r = 2 + Math.random() * 16;
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(x, y, r * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'cloud-venus': {
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#fef3c7');
      grad.addColorStop(0.5, '#fde68a');
      grad.addColorStop(1, '#d97706');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);

      // Sulfuric acid cloud bands
      ctx.fillStyle = 'rgba(217, 119, 6, 0.15)';
      for (let y = 0; y < 512; y += 14) {
        ctx.fillRect(0, y + Math.sin(y * 0.05) * 8, 1024, 6);
      }
      break;
    }

    case 'earth': {
      // Deep blue ocean
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(0, 0, 1024, 512);

      // Continent shapes
      ctx.fillStyle = '#15803d'; // Vegetation green
      // Eurasia & Africa
      ctx.beginPath();
      ctx.ellipse(600, 220, 180, 120, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#b45309'; // Sahara desert
      ctx.beginPath();
      ctx.ellipse(550, 240, 90, 50, 0, 0, Math.PI * 2);
      ctx.fill();

      // Americas
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.ellipse(260, 200, 70, 110, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(320, 360, 60, 100, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Australia
      ctx.fillStyle = '#ca8a04';
      ctx.beginPath();
      ctx.ellipse(820, 380, 50, 35, 0, 0, Math.PI * 2);
      ctx.fill();

      // Polar ice caps
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 1024, 35);
      ctx.fillRect(0, 477, 1024, 35);

      // Swirling white clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 40; i++) {
        const cx = Math.random() * 1024;
        const cy = 100 + Math.random() * 312;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 60 + Math.random() * 80, 15 + Math.random() * 20, 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'moon': {
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(0, 0, 1024, 512);

      // Dark basaltic Maria (seas)
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.ellipse(350, 200, 90, 70, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(450, 280, 110, 80, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(600, 210, 80, 60, -0.1, 0, Math.PI * 2);
      ctx.fill();

      // Impact craters with white ejecta rays (e.g. Tycho)
      for (let i = 0; i < 150; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const r = 2 + Math.random() * 8;
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    }

    case 'mars': {
      ctx.fillStyle = '#b91c1c'; // Rust red
      ctx.fillRect(0, 0, 1024, 512);

      // Dark basaltic terrains (Syrtis Major, etc.)
      ctx.fillStyle = '#7f1d1d';
      ctx.beginPath();
      ctx.ellipse(480, 260, 140, 90, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(220, 320, 110, 70, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Valles Marineris canyon rift
      ctx.strokeStyle = '#450a0a';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(250, 260);
      ctx.bezierCurveTo(340, 270, 420, 255, 490, 265);
      ctx.stroke();

      // Olympus Mons
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.arc(180, 220, 25, 0, Math.PI * 2);
      ctx.fill();

      // White polar ice caps (CO2 dry ice & water ice)
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 1024, 25);
      ctx.fillRect(0, 487, 1024, 25);
      break;
    }

    case 'jupiter-bands': {
      // Alternating atmospheric belts and zones
      for (let y = 0; y < 512; y++) {
        const band = Math.sin(y * 0.04) * 0.5 + 0.5;
        const r = Math.round(180 + band * 60);
        const g = Math.round(110 + band * 50);
        const b = Math.round(60 + band * 40);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(0, y, 1024, 1);
      }

      // Great Red Spot
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.ellipse(650, 320, 50, 30, -0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 3;
      ctx.stroke();
      break;
    }

    case 'saturn': {
      for (let y = 0; y < 512; y++) {
        const band = Math.sin(y * 0.03) * 0.3 + 0.7;
        const r = Math.round(234 * band);
        const g = Math.round(179 * band);
        const b = Math.round(8 * band);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(0, y, 1024, 1);
      }
      break;
    }

    case 'uranus': {
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#06b6d4');
      grad.addColorStop(0.5, '#67e8f9');
      grad.addColorStop(1, '#0891b2');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);
      break;
    }

    case 'neptune': {
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#1d4ed8');
      grad.addColorStop(0.5, '#2563eb');
      grad.addColorStop(1, '#1e40af');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);

      // High-altitude white methane cirrus cloud streaks
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      for (let i = 0; i < 15; i++) {
        const y = 80 + i * 25;
        ctx.fillRect(0, y, 1024, 3);
      }
      break;
    }

    default: {
      ctx.fillStyle = '#64748b';
      ctx.fillRect(0, 0, 1024, 512);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(type, texture);
  return texture;
}

// Generates procedural texture for Saturn's rings with Cassini division
export function createSaturnRingsTexture(): THREE.CanvasTexture {
  const cached = textureCache.get('saturn-rings');
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 1024, 64);
  const grad = ctx.createLinearGradient(0, 0, 1024, 0);
  grad.addColorStop(0, 'rgba(180, 150, 100, 0)');
  grad.addColorStop(0.15, 'rgba(220, 195, 140, 0.85)'); // C Ring
  grad.addColorStop(0.35, 'rgba(240, 215, 160, 0.95)'); // B Ring (densest)
  grad.addColorStop(0.65, 'rgba(40, 30, 20, 0.05)');    // Cassini Division gap!
  grad.addColorStop(0.70, 'rgba(210, 185, 130, 0.8)');  // A Ring
  grad.addColorStop(0.92, 'rgba(190, 165, 115, 0.4)');  // Encke Gap & outer A
  grad.addColorStop(1.0, 'rgba(160, 140, 90, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set('saturn-rings', texture);
  return texture;
}
