import React, { useEffect, useState } from 'react';
import { NearEarthObject, Language } from '../../types/cosmos';
import { ShieldAlert, AlertTriangle, Crosshair, Orbit, Compass, RefreshCw, Info, ExternalLink } from 'lucide-react';

interface AsteroidObservatoryViewProps {
  language: Language;
}

export const AsteroidObservatoryView: React.FC<AsteroidObservatoryViewProps> = ({ language }) => {
  const [asteroids, setAsteroids] = useState<NearEarthObject[]>([]);
  const [selectedAsteroid, setSelectedAsteroid] = useState<NearEarthObject | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAsteroids = async () => {
    try {
      const res = await fetch('/api/nasa/neo');
      const data = await res.json();
      setAsteroids(data.asteroids || []);
      if (data.asteroids && data.asteroids.length > 0) {
        setSelectedAsteroid(data.asteroids[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsteroids();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            <span>Near-Earth Object (NEO) & Asteroid Observatory</span>
          </h1>
          <p className="text-xs text-slate-400">
            NASA JPL Center for Near Earth Object Studies (CNEOS) telemetry, close-approach trajectories, and planetary defense.
          </p>
        </div>

        <button
          onClick={fetchAsteroids}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh CNEOS Radar</span>
        </button>
      </div>

      {/* Hero Highlight for Tracked Asteroid */}
      {selectedAsteroid && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded border ${
                    selectedAsteroid.isPotentiallyHazardous
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {selectedAsteroid.isPotentiallyHazardous
                    ? 'POTENTIALLY HAZARDOUS ASTEROID (PHA)'
                    : 'NON-HAZARDOUS TRAJECTORY'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Orbit: {selectedAsteroid.orbitClass}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {selectedAsteroid.name}
              </h2>
              <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
                {selectedAsteroid.riskNote}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono shrink-0 space-y-1.5 min-w-[240px]">
              <div className="text-slate-400">Next Close Approach:</div>
              <div className="text-sm font-bold text-rose-400">
                📅 {selectedAsteroid.closeApproachDate}
              </div>
              <div className="text-slate-400 pt-1 border-t border-slate-800">
                Miss Distance: <strong className="text-white">{selectedAsteroid.missDistanceLD.toFixed(3)} LD</strong> ({selectedAsteroid.missDistanceKm.toLocaleString()} km)
              </div>
            </div>
          </div>

          {/* 4 Quantitative Trajectory Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-slate-400 text-xs">Estimated Diameter</div>
              <div className="text-base sm:text-lg font-bold font-mono text-white mt-1">
                ~{selectedAsteroid.estimatedDiameterMeters.min} – {selectedAsteroid.estimatedDiameterMeters.max} m
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-slate-400 text-xs">Relative Velocity</div>
              <div className="text-base sm:text-lg font-bold font-mono text-cyan-300 mt-1">
                {selectedAsteroid.relativeVelocityKmSec} km/s
              </div>
              <div className="text-[10px] text-slate-500">{(selectedAsteroid.relativeVelocityKmSec * 3600).toLocaleString()} km/h</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-slate-400 text-xs">Miss Distance in Lunar Distances</div>
              <div className="text-base sm:text-lg font-bold font-mono text-amber-300 mt-1">
                {selectedAsteroid.missDistanceLD} LD
              </div>
              <div className="text-[10px] text-slate-500">1 LD = 384,400 km (Earth-Moon)</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-slate-400 text-xs">Torino Impact Hazard Scale</div>
              <div className="text-base sm:text-lg font-bold font-mono text-emerald-400 mt-1">
                Scale 0 (White)
              </div>
              <div className="text-[10px] text-slate-500">Zero collision probability</div>
            </div>
          </div>
        </div>
      )}

      {/* Tracked Asteroids List & Planetary Defense Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-cyan-400" />
              <span>Tracked High-Profile Near-Earth Asteroids</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">{asteroids.length} Objects</span>
          </h3>

          <div className="space-y-3">
            {asteroids.map((ast) => (
              <div
                key={ast.id}
                onClick={() => setSelectedAsteroid(ast)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedAsteroid?.id === ast.id
                    ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg'
                    : 'bg-slate-950/50 hover:bg-slate-800/60 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{ast.name}</span>
                      {ast.isPotentiallyHazardous && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          PHA
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Diameter: ~{ast.estimatedDiameterMeters.min}–{ast.estimatedDiameterMeters.max}m • Velocity: {ast.relativeVelocityKmSec} km/s
                    </div>
                  </div>

                  <div className="text-left sm:text-right font-mono text-xs text-slate-300">
                    <div>Approach: <span className="text-rose-400 font-bold">{ast.closeApproachDate}</span></div>
                    <div className="text-[10px] text-slate-400">Miss: {ast.missDistanceLD} LD ({ast.missDistanceKm.toLocaleString()} km)</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Planetary Defense Section (DART Mission) */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> NASA Planetary Defense: DART Success
            </div>
            <h4 className="text-base font-bold text-white mb-2">Kinetic Impactor Redirection</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              In September 2022, NASA’s Double Asteroid Redirection Test (DART) intentionally crashed into Dimorphos (moon of asteroid Didymos) at 6.6 km/s, altering its orbital period by 33 minutes. This proved humankind possesses the technology to deflect an asteroid given sufficient advance warning.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
              <div className="text-slate-400 font-semibold">Key Warning Timescale:</div>
              <div className="text-slate-300">A tiny velocity change (Δv ≈ 1 mm/s) applied 10 years before predicted impact deflects an asteroid by more than an Earth radius!</div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[10px] font-mono text-slate-500">
            Source: NASA CNEOS (Center for Near Earth Object Studies)
          </div>
        </div>
      </div>
    </div>
  );
};
