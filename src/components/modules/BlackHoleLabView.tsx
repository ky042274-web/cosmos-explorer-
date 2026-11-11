import React, { useState } from 'react';
import { BlackHoleScene } from '../3d/BlackHoleScene';
import { Language } from '../../types/cosmos';
import { Sparkles, Zap, Radio, Volume2, ShieldAlert, Compass, Activity } from 'lucide-react';

interface BlackHoleLabViewProps {
  language: Language;
}

export const BlackHoleLabView: React.FC<BlackHoleLabViewProps> = ({ language }) => {
  const [massInputSolar, setMassInputSolar] = useState<number>(4.15e6); // Default Sagittarius A*
  const [targetPreset, setTargetPreset] = useState<'sgr-a' | 'm87' | 'stellar-gw' | 'earth'>('sgr-a');
  const [isPlayingChirp, setIsPlayingChirp] = useState(false);

  const presets = {
    'sgr-a': { name: 'Sagittarius A* (Milky Way SMBH)', mass: 4.15e6 },
    m87: { name: 'Messier 87* (EHT M87 SMBH)', mass: 6.5e9 },
    'stellar-gw': { name: 'GW150914 Binary Black Hole Merger', mass: 62 },
    earth: { name: 'Earth Compressed to Black Hole', mass: 3e-6 },
  };

  const applyPreset = (key: keyof typeof presets) => {
    setTargetPreset(key);
    setMassInputSolar(presets[key].mass);
  };

  // Relativistic Equations
  const G = 6.6743e-11;
  const c = 2.99792458e8;
  const hbar = 1.054571817e-34;
  const kB = 1.380649e-23;
  const M_sun = 1.98847e30;

  const totalMassKg = massInputSolar * M_sun;
  const rsMeters = (2 * G * totalMassKg) / (c * c);
  const rsKm = rsMeters / 1000;

  // Hawking Temperature: T = hbar * c^3 / (8 * pi * G * M * kB)
  const hawkingTempK = (hbar * Math.pow(c, 3)) / (8 * Math.PI * G * totalMassKg * kB);

  // Evaporation time: t_evap = (5120 * pi * G^2 * M^3) / (hbar * c^4)
  const evapTimeSeconds = (5120 * Math.PI * Math.pow(G, 2) * Math.pow(totalMassKg, 3)) / (hbar * Math.pow(c, 4));
  const evapTimeYears = evapTimeSeconds / (365.25 * 86400);

  // Web Audio API Synthesizer for LIGO Binary Black Hole Gravitational Chirp
  const playGravitationalWaveChirp = () => {
    try {
      setIsPlayingChirp(true);
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      // Gravitational wave frequency sweeps exponentially upward during inspiral and merger
      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(35, now);
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.6); // Chirp peak merger frequency

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7); // Ringdown damping

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.75);

      setTimeout(() => setIsPlayingChirp(false), 800);
    } catch (e) {
      console.error('Audio play error', e);
      setIsPlayingChirp(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <span>Black Hole & General Relativity Laboratory</span>
          </h1>
          <p className="text-xs text-slate-400">
            Kerr spacetime metric, event horizon thermodynamics, Doppler beaming, and gravitational wave acoustic synthesis.
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs">
          {(Object.keys(presets) as Array<keyof typeof presets>).map((key) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                targetPreset === key ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {key === 'sgr-a' ? 'Sgr A*' : key === 'm87' ? 'M87*' : key === 'stellar-gw' ? 'GW150914' : 'Earth Black Hole'}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Interactive Black Hole */}
      <BlackHoleScene massSolarMasses={massInputSolar} />

      {/* Relativistic Thermodynamics & Event Horizon Calculator */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span>Event Horizon & Hawking Thermodynamics Calculator</span>
            </h3>
            <p className="text-xs text-slate-400">
              Formulas: rs = 2GM / c² • TH = ℏc³ / (8πGMkB)
            </p>
          </div>

          {/* Gravitational Wave Chirp Play Button */}
          <button
            onClick={playGravitationalWaveChirp}
            disabled={isPlayingChirp}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-lg ${
              isPlayingChirp
                ? 'bg-purple-500 text-white animate-pulse'
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isPlayingChirp ? 'Playing Chirp...' : 'Play LIGO Gravitational Chirp'}</span>
          </button>
        </div>

        {/* Mass Slider / Input */}
        <div className="my-6">
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Black Hole Mass: <span className="font-mono text-purple-400 text-sm">{massInputSolar.toExponential(2)} Solar Masses (M☉)</span>
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="10"
              step="0.1"
              value={Math.log10(massInputSolar > 0 ? massInputSolar : 1)}
              onChange={(e) => setMassInputSolar(Math.pow(10, parseFloat(e.target.value)))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1">
            <span>Stellar Mass (10 M☉)</span>
            <span>Intermediate (~10⁴ M☉)</span>
            <span>Supermassive Sgr A* (~10⁶ M☉)</span>
            <span>Ultramassive M87* (~10⁹ M☉)</span>
          </div>
        </div>

        {/* 4 Relativistic Result Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs text-slate-400">Schwarzschild Radius (rs)</div>
            <div className="text-lg font-bold font-mono text-purple-300 mt-1">
              {rsKm >= 1e6
                ? `${(rsKm / 1e6).toFixed(2)} Million km`
                : rsKm >= 1
                ? `${rsKm.toFixed(2)} km`
                : `${(rsMeters * 1000).toFixed(1)} mm`}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Boundary of no return</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs text-slate-400">Photon Sphere Radius</div>
            <div className="text-lg font-bold font-mono text-cyan-300 mt-1">
              {((rsKm * 1.5) >= 1e6 ? `${((rsKm * 1.5) / 1e6).toFixed(2)}M km` : `${(rsKm * 1.5).toFixed(1)} km`)}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Orbits where photons circle</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs text-slate-400">Hawking Temperature (TH)</div>
            <div className="text-lg font-bold font-mono text-amber-300 mt-1">
              {hawkingTempK.toExponential(3)} K
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Colder than CMB for large holes</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs text-slate-400">Hawking Evaporation Lifespan</div>
            <div className="text-lg font-bold font-mono text-rose-400 mt-1">
              {evapTimeYears > 1e10 ? `~${evapTimeYears.toExponential(2)} Years` : `${evapTimeYears.toFixed(0)} Years`}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Exceeds age of universe for &gt; 10¹² kg</div>
          </div>
        </div>

        {/* Spacetime Curvature & Spaghettification Note */}
        <div className="mt-6 p-4 rounded-2xl bg-purple-950/20 border border-purple-800/40 text-xs text-slate-300 leading-relaxed">
          <strong className="text-purple-300">Tidal Forces & Spaghettification:</strong> The differential gravitational acceleration dg = -(2GM/r³) · dr between your head and your feet as you fall toward the event horizon. For stellar-mass black holes, tidal forces tear matter apart far outside the event horizon. For supermassive black holes like Sgr A*, the tidal force at the horizon is gentle, allowing an astronaut to cross the horizon intact before being drawn to the central singularity.
        </div>
      </div>
    </div>
  );
};
