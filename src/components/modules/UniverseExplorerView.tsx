import React, { useState } from 'react';
import { SOLAR_SYSTEM_BODIES } from '../../data/solarSystemData';
import { CelestialBody, CosmosModuleId, Language } from '../../types/cosmos';
import { SolarSystemScene } from '../3d/SolarSystemScene';
import {
  Info,
  Layers,
  ArrowRightLeft,
  Bookmark,
  Bot,
  Compass,
  Sparkles,
  Scale,
  Thermometer,
  Weight,
  Clock,
  Orbit,
  X,
  Check,
} from 'lucide-react';

interface UniverseExplorerViewProps {
  onNavigateToAiWithPrompt?: (prompt: string) => void;
  onSaveItem?: (item: any) => void;
  isItemSaved?: (id: string) => boolean;
  language: Language;
}

export const UniverseExplorerView: React.FC<UniverseExplorerViewProps> = ({
  onNavigateToAiWithPrompt,
  onSaveItem,
  isItemSaved,
  language,
}) => {
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>('earth');
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [comparePlanetAId, setComparePlanetAId] = useState<string>('earth');
  const [comparePlanetBId, setComparePlanetBId] = useState<string>('mars');

  const selectedBody = SOLAR_SYSTEM_BODIES.find((b) => b.id === selectedPlanetId) || SOLAR_SYSTEM_BODIES[3];
  const planetA = SOLAR_SYSTEM_BODIES.find((b) => b.id === comparePlanetAId) || SOLAR_SYSTEM_BODIES[3];
  const planetB = SOLAR_SYSTEM_BODIES.find((b) => b.id === comparePlanetBId) || SOLAR_SYSTEM_BODIES[5];

  const isSaved = isItemSaved ? isItemSaved(selectedBody.id) : false;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 3D Solar System Viewport */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
              <Compass className="w-6 h-6 text-indigo-400" />
              <span>3D Universe & Solar System Explorer</span>
            </h1>
            <p className="text-xs text-slate-400">
              Interactive physical simulation of the Sun, eight planets, dwarf planets, moons, and the Asteroid Belt.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCompareOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 shadow-lg transition-all"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" />
              <span>Compare Planets</span>
            </button>
          </div>
        </div>

        <SolarSystemScene
          selectedPlanetId={selectedPlanetId}
          onSelectPlanet={(id) => setSelectedPlanetId(id)}
        />
      </div>

      {/* Selected Celestial Body Deep Inspector Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: selectedBody.color }}
            >
              <span className="text-2xl drop-shadow-md">🪐</span>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {selectedBody.name}
                </h2>
                <span className="text-base text-slate-400 font-hindi">
                  ({selectedBody.hindiName})
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {selectedBody.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Distance: {selectedBody.distanceFromSunAU} AU ({(selectedBody.distanceFromSunKm / 1e6).toFixed(1)}M km)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onSaveItem && (
              <button
                onClick={() =>
                  onSaveItem({
                    id: selectedBody.id,
                    type: 'celestial-body',
                    title: selectedBody.name,
                    data: selectedBody,
                  })
                }
                className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                  isSaved
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{isSaved ? 'Bookmarked' : 'Save Object'}</span>
              </button>
            )}

            {onNavigateToAiWithPrompt && (
              <button
                onClick={() =>
                  onNavigateToAiWithPrompt(
                    `Explain the astrophysical formation, internal structure, and unique characteristics of ${selectedBody.name}. What are the latest discoveries from space probes?`
                  )
                }
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Ask Gemini AI</span>
              </button>
            )}
          </div>
        </div>

        {/* Overview Description */}
        <p className="text-sm text-slate-300 leading-relaxed mt-4">
          {language === 'hi' ? selectedBody.hindiOverview : selectedBody.overview}
        </p>

        {/* 6 Essential Astronomical Parameters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
              <Scale className="w-3.5 h-3.5 text-indigo-400" /> Diameter
            </div>
            <div className="text-sm sm:text-base font-bold font-mono text-white">
              {selectedBody.diameterKm.toLocaleString()} km
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
              <Weight className="w-3.5 h-3.5 text-indigo-400" /> Mass
            </div>
            <div className="text-sm sm:text-base font-bold font-mono text-white">
              {selectedBody.massEarthRelative}x Earth
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
              <Orbit className="w-3.5 h-3.5 text-indigo-400" /> Surface Gravity
            </div>
            <div className="text-sm sm:text-base font-bold font-mono text-white">
              {selectedBody.surfaceGravityMs2} m/s²
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
              <Thermometer className="w-3.5 h-3.5 text-indigo-400" /> Avg Temp
            </div>
            <div className="text-sm sm:text-base font-bold font-mono text-white">
              {selectedBody.averageTempC}°C
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> Orbital Period
            </div>
            <div className="text-sm sm:text-base font-bold font-mono text-white">
              {selectedBody.orbitalPeriodDays} days
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Moons
            </div>
            <div className="text-sm sm:text-base font-bold font-mono text-white">
              {selectedBody.moonsCount} confirmed
            </div>
          </div>
        </div>

        {/* Atmosphere & Geological Features & Missions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-slate-800">
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Atmospheric Composition
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {selectedBody.atmosphere.map((gas, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200 text-xs font-mono"
                >
                  {gas}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Geological & Structural Highlights
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {selectedBody.keyFeatures.map((feat, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-indigo-400 mt-0.5">•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Exploration Probes & Milestones
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {selectedBody.explorationMilestones.map((ms, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-cyan-400 mt-0.5">🚀</span>
                  <span>{ms}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Planet-to-Planet Comparison Modal */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
                  <span>Planetary Side-by-Side Comparison</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Contrast physical, gravitational, and orbital dimensions between any two worlds.
                </p>
              </div>
              <button
                onClick={() => setIsCompareOpen(false)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selectors */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Body A</label>
                <select
                  value={comparePlanetAId}
                  onChange={(e) => setComparePlanetAId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm rounded-xl px-3 py-2"
                >
                  {SOLAR_SYSTEM_BODIES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Body B</label>
                <select
                  value={comparePlanetBId}
                  onChange={(e) => setComparePlanetBId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm rounded-xl px-3 py-2"
                >
                  {SOLAR_SYSTEM_BODIES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Metric Comparison Table */}
            <div className="mt-6 space-y-4">
              {[
                {
                  label: 'Diameter',
                  valA: `${planetA.diameterKm.toLocaleString()} km`,
                  valB: `${planetB.diameterKm.toLocaleString()} km`,
                  ratio: (planetA.diameterKm / planetB.diameterKm).toFixed(2),
                },
                {
                  label: 'Surface Gravity',
                  valA: `${planetA.surfaceGravityMs2} m/s²`,
                  valB: `${planetB.surfaceGravityMs2} m/s²`,
                  ratio: (planetA.surfaceGravityMs2 / planetB.surfaceGravityMs2).toFixed(2),
                },
                {
                  label: 'Orbital Period (Year)',
                  valA: `${planetA.orbitalPeriodDays} Earth days`,
                  valB: `${planetB.orbitalPeriodDays} Earth days`,
                  ratio: (planetA.orbitalPeriodDays / (planetB.orbitalPeriodDays || 1)).toFixed(2),
                },
                {
                  label: 'Rotation Period (Day)',
                  valA: `${planetA.rotationPeriodHours} hours`,
                  valB: `${planetB.rotationPeriodHours} hours`,
                  ratio: (Math.abs(planetA.rotationPeriodHours) / Math.abs(planetB.rotationPeriodHours)).toFixed(2),
                },
                {
                  label: 'Average Temperature',
                  valA: `${planetA.averageTempC}°C`,
                  valB: `${planetB.averageTempC}°C`,
                  ratio: '-',
                },
                {
                  label: 'Confirmed Moons',
                  valA: `${planetA.moonsCount}`,
                  valB: `${planetB.moonsCount}`,
                  ratio: `${planetA.moonsCount} vs ${planetB.moonsCount}`,
                },
              ].map((metric, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                    <span>{metric.label}</span>
                    <span className="text-slate-400 font-mono text-[11px]">Ratio A/B: {metric.ratio}x</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div className="text-indigo-300 font-bold">
                      {planetA.name.split(' ')[0]}: {metric.valA}
                    </div>
                    <div className="text-cyan-300 font-bold">
                      {planetB.name.split(' ')[0]}: {metric.valB}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
