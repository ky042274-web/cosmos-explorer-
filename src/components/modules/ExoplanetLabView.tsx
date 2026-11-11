import React, { useState } from 'react';
import { EXOPLANETS_DATA } from '../../data/exoplanetsData';
import { Exoplanet, Language } from '../../types/cosmos';
import { Compass, Sparkles, Filter, Globe, Activity, Eye, Search, Check } from 'lucide-react';

interface ExoplanetLabViewProps {
  language: Language;
}

export const ExoplanetLabView: React.FC<ExoplanetLabViewProps> = ({ language }) => {
  const [filterMethod, setFilterMethod] = useState<string>('All');
  const [habitableOnly, setHabitableOnly] = useState<boolean>(false);
  const [selectedExoplanet, setSelectedExoplanet] = useState<Exoplanet>(EXOPLANETS_DATA[0]);

  // Transit light curve simulator state
  const [transitProgress, setTransitProgress] = useState(50); // 0 to 100%

  const filteredExoplanets = EXOPLANETS_DATA.filter((p) => {
    if (filterMethod !== 'All' && p.discoveryMethod !== filterMethod) return false;
    if (habitableOnly && !p.inHabitableZone) return false;
    return true;
  });

  // Calculate simulated transit flux dip
  // In the middle (45-55%), brightness dips proportional to (Rp/R*)^2
  const transitDip =
    transitProgress >= 35 && transitProgress <= 65
      ? 1.0 - Math.pow(selectedExoplanet.radiusEarthRelative * 0.009, 2)
      : 1.0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-emerald-400" />
            <span>Exoplanet Discovery Lab & Habitable Zones</span>
          </h1>
          <p className="text-xs text-slate-400">
            NASA Exoplanet Archive verified worlds, stellar transit spectroscopy, and circumstellar habitable zone modeling.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs">
          <span className="text-slate-400 px-1 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {['All', 'Transit', 'Radial Velocity'].map((method) => (
            <button
              key={method}
              onClick={() => setFilterMethod(method)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterMethod === method ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {method}
            </button>
          ))}
          <button
            onClick={() => setHabitableOnly(!habitableOnly)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
              habitableOnly ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌿 Habitable Only
          </button>
        </div>
      </div>

      {/* Selected Exoplanet Hero Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded border ${
                  selectedExoplanet.inHabitableZone
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
              >
                {selectedExoplanet.inHabitableZone ? 'CIRCUMSTELLAR HABITABLE ZONE' : 'EXTREME ENVIRONMENT'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Method: {selectedExoplanet.discoveryMethod} ({selectedExoplanet.discoveryYear})
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {selectedExoplanet.name}
            </h2>
            <div className="text-xs text-indigo-300 mt-1 font-mono">
              Host Star: {selectedExoplanet.hostStar} ({selectedExoplanet.hostStarType}) • Distance: {selectedExoplanet.distanceLightYears} light-years
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1.5 shrink-0 min-w-[240px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Earth Similarity (ESI):</span>
              <span className="text-emerald-400 font-bold">
                {Math.round(selectedExoplanet.habitabilityIndex * 100)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Equilibrium Temp:</span>
              <span className="text-cyan-300 font-bold">{selectedExoplanet.equilibriumTempK} K ({(selectedExoplanet.equilibriumTempK - 273.15).toFixed(0)}°C)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Orbital Period:</span>
              <span className="text-white font-bold">{selectedExoplanet.orbitalPeriodDays} Earth days</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mt-4">
          {selectedExoplanet.overview}
        </p>

        {/* 4 Quantitative Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-slate-400 text-xs">Planetary Radius</div>
            <div className="text-base sm:text-lg font-bold font-mono text-white mt-1">
              {selectedExoplanet.radiusEarthRelative}x Earth
            </div>
            <div className="text-[10px] text-slate-500">{(selectedExoplanet.radiusEarthRelative * 6371).toFixed(0)} km</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-slate-400 text-xs">Planetary Mass</div>
            <div className="text-base sm:text-lg font-bold font-mono text-cyan-300 mt-1">
              {selectedExoplanet.massEarthRelative}x Earth
            </div>
            <div className="text-[10px] text-slate-500">{(selectedExoplanet.massEarthRelative * 5.97e24).toExponential(2)} kg</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-slate-400 text-xs">Stellar Classification</div>
            <div className="text-base sm:text-lg font-bold font-mono text-amber-300 mt-1">
              {selectedExoplanet.hostStarType.split(' ')[0]}
            </div>
            <div className="text-[10px] text-slate-500">{selectedExoplanet.hostStar}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-slate-400 text-xs">Surface Water Status</div>
            <div className="text-base sm:text-lg font-bold font-mono text-emerald-400 mt-1">
              {selectedExoplanet.inHabitableZone ? 'Thermodynamically Stabled' : 'Vaporized / Frozen'}
            </div>
            <div className="text-[10px] text-slate-500">Based on radiative equilibrium</div>
          </div>
        </div>
      </div>

      {/* Transit Light Curve Simulator */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              <span>Interactive Transit Photometry & Light Curve Simulator</span>
            </h3>
            <p className="text-xs text-slate-400">
              Drag the planet slider across the host star disk to observe the stellar brightness dip ΔF / F = (Rp / R*)².
            </p>
          </div>
          <div className="text-xs font-mono text-cyan-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            Normalized Flux: {(transitDip * 100).toFixed(3)}%
          </div>
        </div>

        {/* Visual Transit Stage */}
        <div className="relative h-36 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
          {/* Host Star */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-200 shadow-2xl shadow-yellow-500/50 flex items-center justify-center">
            <span className="text-[10px] font-mono text-amber-950 font-bold">{selectedExoplanet.hostStar}</span>
          </div>

          {/* Transiting Planet */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black border border-cyan-400/80 shadow-lg pointer-events-none transition-all duration-75"
            style={{ left: `${transitProgress}%`, transform: 'translate(-50%, -50%)' }}
          />
        </div>

        <div className="mt-4">
          <input
            type="range"
            min="10"
            max="90"
            value={transitProgress}
            onChange={(e) => setTransitProgress(parseInt(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
            <span>Pre-ingress</span>
            <span>Transit Center (Max Occlusion)</span>
            <span>Post-egress</span>
          </div>
        </div>
      </div>

      {/* Catalog of Exoplanets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExoplanets.map((exo) => (
          <div
            key={exo.id}
            onClick={() => setSelectedExoplanet(exo)}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              selectedExoplanet.id === exo.id
                ? 'bg-indigo-950/40 border-indigo-500/70 shadow-xl'
                : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-white">{exo.name}</span>
              <span
                className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                  exo.inHabitableZone
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {exo.inHabitableZone ? 'Habitable Zone' : 'Extreme'}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              {exo.distanceLightYears} ly • Radius: {exo.radiusEarthRelative}x Earth • Mass: {exo.massEarthRelative}x Earth
            </div>
            <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
              {exo.overview}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
