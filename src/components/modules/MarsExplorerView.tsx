import React, { useState } from 'react';
import { MarsExplorerScene, MARS_LANDMARKS, MarsLandmark } from '../3d/MarsExplorerScene';
import { Language } from '../../types/cosmos';
import {
  Rocket,
  Compass,
  Camera,
  Layers,
  Thermometer,
  Shield,
  Zap,
  Droplet,
  Wind,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface MarsExplorerViewProps {
  language: Language;
}

export const MarsExplorerView: React.FC<MarsExplorerViewProps> = ({ language }) => {
  const [selectedLandmark, setSelectedLandmark] = useState<MarsLandmark>(MARS_LANDMARKS[2]); // Jezero Crater
  const [activeSubTab, setActiveSubTab] = useState<'globe' | 'rovers' | 'habitat-sim'>('globe');

  // Mars Habitat Simulator State
  const [powerSource, setPowerSource] = useState<'solar' | 'nuclear'>('nuclear');
  const [crewSize, setCrewSize] = useState<number>(4);
  const [moxieUnits, setMoxieUnits] = useState<number>(2);
  const [iceDrills, setIceDrills] = useState<number>(2);

  // Habitat calculations
  const requiredPowerKw = crewSize * 4 + moxieUnits * 3 + iceDrills * 2.5;
  const suppliedPowerKw = powerSource === 'nuclear' ? 40 : 22; // Solar reduced by dust
  const oxygenProducedKg = moxieUnits * 6; // 6 kg/day per scaled MOXIE unit
  const oxygenNeededKg = crewSize * 0.84; // 0.84 kg O2 / person / day
  const waterProducedL = iceDrills * 25; // 25 liters / drill / day
  const waterNeededL = crewSize * 4.5;

  const isPowerSufficient = suppliedPowerKw >= requiredPowerKw;
  const isOxygenSufficient = oxygenProducedKg >= oxygenNeededKg;
  const isWaterSufficient = waterProducedL >= waterNeededL;
  const habitatSurvivalScore = Math.round(
    (Number(isPowerSufficient) * 35 +
      Number(isOxygenSufficient) * 35 +
      Number(isWaterSufficient) * 30)
  );

  const roverPhotos = [
    {
      title: 'Perseverance Mastcam-Z Delta Panorama',
      rover: 'Perseverance',
      sol: 642,
      camera: 'Mastcam-Z (Stereo & Zoom)',
      url: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1200&auto=format&fit=crop',
      desc: 'Layered delta sedimentary rocks preserving signs of ancient water flow in Jezero Crater.',
    },
    {
      title: 'Curiosity Navcam Over Mount Sharp',
      rover: 'Curiosity',
      sol: 3820,
      camera: 'Navigation Camera',
      url: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=1200&auto=format&fit=crop',
      desc: 'Ascending the sulfate-bearing unit of Aeolis Mons (Mount Sharp) inside Gale Crater.',
    },
    {
      title: 'Martian Sunset in Blue Dust Haze',
      rover: 'Curiosity',
      sol: 956,
      camera: 'Mastcam Right',
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
      desc: 'Fine dust particles in the thin Martian atmosphere scatter red light forward, making sunsets appear bluish.',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <span className="text-red-500">🔴</span>
            <span>Mars Explorer & Astrobiology Laboratory</span>
          </h1>
          <p className="text-xs text-slate-400">
            Interactive 3D Martian terrain, rover mission telephoto archives, and educational human habitat simulator.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveSubTab('globe')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeSubTab === 'globe' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            3D Surface Globe
          </button>
          <button
            onClick={() => setActiveSubTab('rovers')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeSubTab === 'rovers' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Rover Photo Archive
          </button>
          <button
            onClick={() => setActiveSubTab('habitat-sim')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeSubTab === 'habitat-sim' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Habitat Simulator
          </button>
        </div>
      </div>

      {activeSubTab === 'globe' && (
        <div className="space-y-6">
          <MarsExplorerScene
            selectedLandmarkId={selectedLandmark.id}
            onSelectLandmark={(lm) => setSelectedLandmark(lm)}
          />

          {/* Selected Landmark Details */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                  {selectedLandmark.type.toUpperCase()}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {selectedLandmark.name}
                </h3>
              </div>
              <div className="text-xs font-mono text-cyan-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                Lat: {selectedLandmark.lat}° | Lon: {selectedLandmark.lon}°
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div className="md:col-span-2">
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedLandmark.description}
                </p>
                <div className="mt-3 text-xs text-slate-400">
                  <strong className="text-white">Scientific Significance:</strong> {selectedLandmark.significance}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                <div className="text-slate-400">Elevation Profile:</div>
                <div className="font-mono text-sm text-red-300 font-bold">
                  {selectedLandmark.elevationOrDepth}
                </div>
                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                  Surface Gravity: 3.72 m/s² (38% of Earth)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'rovers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roverPhotos.map((photo, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="relative h-48 overflow-hidden group">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-cyan-300 border border-slate-700">
                      Sol {photo.sol}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-[10px] uppercase font-mono text-indigo-400 font-semibold mb-1">
                      {photo.rover} • {photo.camera}
                    </div>
                    <h4 className="text-sm font-bold text-white mb-2">{photo.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{photo.desc}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
                  Attribution: NASA / JPL-Caltech / MSSS / ASU
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'habitat-sim' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-400" />
                <span>Martian Surface Base Life Support Simulator</span>
              </h3>
              <p className="text-xs text-slate-400">
                Educational engineering simulation balancing power, in-situ oxygen generation (MOXIE), and permafrost water extraction.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Hab Stability Index:</span>
              <span
                className={`text-lg font-mono font-bold px-3 py-1 rounded-xl border ${
                  habitatSurvivalScore === 100
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                }`}
              >
                {habitatSurvivalScore}%
              </span>
            </div>
          </div>

          {/* Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-2">Crew Complement</label>
              <select
                value={crewSize}
                onChange={(e) => setCrewSize(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg p-2"
              >
                {[2, 4, 6, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} Astronauts
                  </option>
                ))}
              </select>
              <div className="text-[10px] text-slate-500 mt-2">Requires: {(crewSize * 0.84).toFixed(1)} kg O₂/day</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-2">Primary Power Reactor</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setPowerSource('nuclear')}
                  className={`p-2 rounded-lg font-medium border transition-colors ${
                    powerSource === 'nuclear'
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-900 text-slate-400 border-slate-700'
                  }`}
                >
                  Kilopower Nuclear
                </button>
                <button
                  onClick={() => setPowerSource('solar')}
                  className={`p-2 rounded-lg font-medium border transition-colors ${
                    powerSource === 'solar'
                      ? 'bg-amber-600 text-white border-amber-500'
                      : 'bg-slate-900 text-slate-400 border-slate-700'
                  }`}
                >
                  Solar Array
                </button>
              </div>
              <div className="text-[10px] text-slate-500 mt-2">Output: {suppliedPowerKw} kW</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-2">MOXIE Oxygen Extractors</label>
              <input
                type="range"
                min="1"
                max="4"
                value={moxieUnits}
                onChange={(e) => setMoxieUnits(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>{moxieUnits} Units</span>
                <span className="font-mono text-cyan-300">+{oxygenProducedKg} kg O₂/day</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-2">Cryo Ice Drills</label>
              <input
                type="range"
                min="1"
                max="4"
                value={iceDrills}
                onChange={(e) => setIceDrills(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>{iceDrills} Drills</span>
                <span className="font-mono text-cyan-300">+{waterProducedL} L/day</span>
              </div>
            </div>
          </div>

          {/* Habitat Status Diagnostics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div
              className={`p-4 rounded-xl border flex items-center gap-3 ${
                isPowerSufficient
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                  : 'bg-red-950/30 border-red-800/60 text-red-300'
              }`}
            >
              <Zap className="w-5 h-5 shrink-0" />
              <div>
                <div className="text-xs font-bold">Power Grid: {isPowerSufficient ? 'Nominal' : 'Deficit!'}</div>
                <div className="text-[11px] font-mono opacity-80">
                  {suppliedPowerKw} kW available vs {requiredPowerKw.toFixed(1)} kW required
                </div>
              </div>
            </div>

            <div
              className={`p-4 rounded-xl border flex items-center gap-3 ${
                isOxygenSufficient
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                  : 'bg-red-950/30 border-red-800/60 text-red-300'
              }`}
            >
              <Wind className="w-5 h-5 shrink-0" />
              <div>
                <div className="text-xs font-bold">Oxygen Reserves: {isOxygenSufficient ? 'Nominal' : 'Hypoxia Risk!'}</div>
                <div className="text-[11px] font-mono opacity-80">
                  {oxygenProducedKg} kg/day generated vs {oxygenNeededKg.toFixed(1)} kg needed
                </div>
              </div>
            </div>

            <div
              className={`p-4 rounded-xl border flex items-center gap-3 ${
                isWaterSufficient
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                  : 'bg-red-950/30 border-red-800/60 text-red-300'
              }`}
            >
              <Droplet className="w-5 h-5 shrink-0" />
              <div>
                <div className="text-xs font-bold">Hydro Balance: {isWaterSufficient ? 'Nominal' : 'Dehydration Risk!'}</div>
                <div className="text-[11px] font-mono opacity-80">
                  {waterProducedL} L/day extracted vs {waterNeededL.toFixed(1)} L needed
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
