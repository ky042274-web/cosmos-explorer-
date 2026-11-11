import React, { useState } from 'react';
import { MoonExplorerScene, MOON_LANDMARKS, MoonLandmark } from '../3d/MoonExplorerScene';
import { Language } from '../../types/cosmos';
import { Moon, Shield, Award, Droplet, Sun, Compass, Radio } from 'lucide-react';

interface MoonExplorerViewProps {
  language: Language;
}

export const MoonExplorerView: React.FC<MoonExplorerViewProps> = ({ language }) => {
  const [selectedLandmark, setSelectedLandmark] = useState<MoonLandmark>(MOON_LANDMARKS[1]); // Chandrayaan-3
  const [activeTab, setActiveTab] = useState<'globe' | 'base-builder'>('globe');

  // Base Builder State
  const [site, setSite] = useState<'shackleton' | 'equator'>('shackleton');
  const [regolithShieldingMeters, setRegolithShieldingMeters] = useState(2.5); // meters of lunar regolith
  const [solarPanelsKw, setSolarPanelsKw] = useState(50);

  const cosmicRadiationReduction = Math.min(99.5, Math.round((1 - Math.exp(-regolithShieldingMeters * 1.8)) * 100));
  const waterIceAccessibility = site === 'shackleton' ? 'Abundant (Cooled in permanent shadow)' : 'Extremely Scarce';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Moon className="w-6 h-6 text-amber-300" />
            <span>Moon Explorer & Artemis Base Camp Simulator</span>
          </h1>
          <p className="text-xs text-slate-400">
            Interactive 3D Moon with Apollo, Chandrayaan, Chang’e landing sites, lunar phase illumination, and South Pole habitat modeling.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('globe')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'globe' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            3D Moon & Landing Sites
          </button>
          <button
            onClick={() => setActiveTab('base-builder')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'base-builder' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Artemis Base Simulator
          </button>
        </div>
      </div>

      {activeTab === 'globe' && (
        <div className="space-y-6">
          <MoonExplorerScene
            selectedLandmarkId={selectedLandmark.id}
            onSelectLandmark={(lm) => setSelectedLandmark(lm)}
          />

          {/* Selected Landmark Details */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {selectedLandmark.type.toUpperCase()}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {selectedLandmark.name}
                </h3>
              </div>
              <div className="text-xs font-mono text-amber-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                Lat: {selectedLandmark.lat}° | Lon: {selectedLandmark.lon}°
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div className="md:col-span-2">
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedLandmark.description}
                </p>
                <div className="mt-3 text-xs text-slate-400">
                  <strong className="text-white">Historical & Scientific Impact:</strong> {selectedLandmark.significance}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                <div className="text-slate-400">Lunar Environment:</div>
                <div className="font-mono text-xs text-slate-300">Gravity: 1.62 m/s² (16.6% of Earth)</div>
                <div className="font-mono text-xs text-slate-300">Surface Temp: -130°C to +120°C</div>
                <div className="font-mono text-xs text-slate-300">Escape Velocity: 2.38 km/s</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'base-builder' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="pb-6 border-b border-slate-800">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <span>Lunar South Pole Artemis Base Architecture</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Simulate radiation shielding using in-situ sintered regolith, perpetual solar peak illumination, and cryo-trapped water ice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-2">Base Location</label>
              <div className="space-y-2 text-xs">
                <button
                  onClick={() => setSite('shackleton')}
                  className={`w-full p-2.5 rounded-lg text-left border transition-colors ${
                    site === 'shackleton'
                      ? 'bg-amber-600/30 border-amber-500/60 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="font-bold">Shackleton Rim (89.9°S)</div>
                  <div className="text-[10px] text-amber-300">92% continuous sunlight + water ice in shadow</div>
                </button>

                <button
                  onClick={() => setSite('equator')}
                  className={`w-full p-2.5 rounded-lg text-left border transition-colors ${
                    site === 'equator'
                      ? 'bg-amber-600/30 border-amber-500/60 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="font-bold">Lunar Equator (Apollo sites)</div>
                  <div className="text-[10px] text-slate-400">14-day night creates severe battery demand</div>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Regolith Shielding Thickness: <span className="text-amber-400 font-mono">{regolithShieldingMeters} m</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.5"
                value={regolithShieldingMeters}
                onChange={(e) => setRegolithShieldingMeters(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="mt-3 text-xs text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span>Radiation Blocked:</span>
                  <span className="font-mono text-emerald-400 font-bold">{cosmicRadiationReduction}%</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Overhead regolith shields against solar particle events (SPE) and galactic cosmic rays (GCR).
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Solar Generation Capacity: <span className="text-cyan-400 font-mono">{solarPanelsKw} kW</span>
              </label>
              <input
                type="range"
                min="20"
                max="150"
                step="10"
                value={solarPanelsKw}
                onChange={(e) => setSolarPanelsKw(parseInt(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <div className="mt-3 text-xs text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span>Water Reserves:</span>
                  <span className="font-mono text-cyan-300">{waterIceAccessibility}</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Powers oxygen extraction, propellant electrolysis (LH2/LOX), and life support.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
