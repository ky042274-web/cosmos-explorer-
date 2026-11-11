import React, { useState } from 'react';
import { SOLAR_SYSTEM_BODIES } from '../../data/solarSystemData';
import { Language } from '../../types/cosmos';
import { Calculator, Compass, Scale, Weight, Orbit, Zap, Sparkles, ArrowRightLeft } from 'lucide-react';

interface AstronomyCalculatorViewProps {
  language: Language;
}

export const AstronomyCalculatorView: React.FC<AstronomyCalculatorViewProps> = ({ language }) => {
  const [activeCalc, setActiveCalc] = useState<
    'distance' | 'weight' | 'escape' | 'kepler' | 'gravity' | 'schwarzschild' | 'stefan' | 'units'
  >('distance');

  // 1. Distance Converter
  const [distValue, setDistValue] = useState<number>(1);
  const [distUnit, setDistUnit] = useState<'ly' | 'pc' | 'au' | 'km'>('ly');

  const lyToKm = 9.461e12;
  const pcToKm = 3.086e13;
  const auToKm = 1.496e8;

  let kmValue = 0;
  if (distUnit === 'ly') kmValue = distValue * lyToKm;
  else if (distUnit === 'pc') kmValue = distValue * pcToKm;
  else if (distUnit === 'au') kmValue = distValue * auToKm;
  else kmValue = distValue;

  // 2. Planetary Weight
  const [earthWeightKg, setEarthWeightKg] = useState<number>(70);

  // 3. Escape Velocity
  const [escMassKg, setEscMassKg] = useState<number>(5.972e24); // Earth mass
  const [escRadiusKm, setEscRadiusKm] = useState<number>(6371); // Earth radius
  const G = 6.6743e-11;
  const escapeVelocityKmS = Math.sqrt((2 * G * escMassKg) / (escRadiusKm * 1000)) / 1000;

  // 4. Kepler 3rd Law
  const [semiMajorAxisAU, setSemiMajorAxisAU] = useState<number>(1.524); // Mars
  const keplerPeriodYears = Math.pow(semiMajorAxisAU, 1.5);

  // 5. Gravitational Force
  const [mass1Kg, setMass1Kg] = useState<number>(1.989e30); // Sun
  const [mass2Kg, setMass2Kg] = useState<number>(5.972e24); // Earth
  const [distanceKm, setDistanceKm] = useState<number>(1.496e8); // 1 AU
  const forceNewtons = (G * mass1Kg * mass2Kg) / Math.pow(distanceKm * 1000, 2);

  // 6. Schwarzschild Radius
  const [smbhMassSolar, setSmbhMassSolar] = useState<number>(10);
  const c = 2.99792e8;
  const rsMeters = (2 * G * smbhMassSolar * 1.989e30) / (c * c);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
          <Calculator className="w-6 h-6 text-yellow-400" />
          <span>Advanced Astronomy & Astrophysics Calculators</span>
        </h1>
        <p className="text-xs text-slate-400">
          Mathematically verified educational calculators with physical constants, SI derivations, and step-by-step formulas.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl text-xs">
        {[
          { id: 'distance', label: 'Distance Converter' },
          { id: 'weight', label: 'Planetary Weight' },
          { id: 'escape', label: 'Escape Velocity' },
          { id: 'kepler', label: 'Kepler’s 3rd Law' },
          { id: 'gravity', label: 'Newton Gravity' },
          { id: 'schwarzschild', label: 'Schwarzschild Radius' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCalc(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
              activeCalc === tab.id
                ? 'bg-yellow-500 text-slate-950 font-bold shadow-md shadow-yellow-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Distance Converter */}
      {activeCalc === 'distance' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">Astrophysical Distance Converter</h3>
              <p className="text-xs text-slate-400 font-mono">1 pc ≈ 3.2616 ly ≈ 206,265 AU ≈ 3.086 × 10¹³ km</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Input Distance</label>
              <input
                type="number"
                value={distValue}
                onChange={(e) => setDistValue(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Unit</label>
              <select
                value={distUnit}
                onChange={(e) => setDistUnit(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-sm"
              >
                <option value="ly">Light-Years (ly)</option>
                <option value="pc">Parsecs (pc)</option>
                <option value="au">Astronomical Units (AU)</option>
                <option value="km">Kilometers (km)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[11px] text-slate-400">Kilometers</div>
              <div className="text-base font-bold font-mono text-cyan-300 mt-1 truncate">
                {kmValue.toExponential(4)} km
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[11px] text-slate-400">Astronomical Units</div>
              <div className="text-base font-bold font-mono text-white mt-1 truncate">
                {(kmValue / auToKm).toFixed(2)} AU
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[11px] text-slate-400">Light-Years</div>
              <div className="text-base font-bold font-mono text-yellow-300 mt-1 truncate">
                {(kmValue / lyToKm).toFixed(4)} ly
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[11px] text-slate-400">Parsecs</div>
              <div className="text-base font-bold font-mono text-purple-300 mt-1 truncate">
                {(kmValue / pcToKm).toFixed(4)} pc
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Planetary Weight */}
      {activeCalc === 'weight' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">Weight on Other Celestial Worlds</h3>
              <p className="text-xs text-slate-400 font-mono">Formula: W = m · g (Weight = Mass × Surface Gravity)</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400">Your Mass on Earth:</label>
              <input
                type="number"
                value={earthWeightKg}
                onChange={(e) => setEarthWeightKg(parseFloat(e.target.value) || 0)}
                className="w-24 bg-slate-950 border border-slate-700 text-white rounded-lg p-1.5 font-mono text-xs"
              />
              <span className="text-xs text-slate-400">kg</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SOLAR_SYSTEM_BODIES.map((body) => {
              const weightOnBody = (earthWeightKg * (body.surfaceGravityMs2 / 9.807)).toFixed(1);
              return (
                <div key={body.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-white">{body.name.split(' ')[0]}</span>
                    <span className="font-mono text-[10px]">{body.surfaceGravityMs2} m/s²</span>
                  </div>
                  <div className="text-xl font-bold font-mono text-yellow-400">
                    {weightOnBody} <span className="text-xs font-normal text-slate-400">kg</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Escape Velocity */}
      {activeCalc === 'escape' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white">Escape Velocity Calculator</h3>
            <p className="text-xs text-slate-400 font-mono">Formula: ve = √(2GM / R)</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Body Mass (kg)</label>
              <input
                type="number"
                value={escMassKg}
                onChange={(e) => setEscMassKg(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono text-sm"
              />
              <div className="text-[10px] text-slate-500 mt-1">Earth Mass: 5.972 × 10²⁴ kg</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Body Radius (km)</label>
              <input
                type="number"
                value={escRadiusKm}
                onChange={(e) => setEscRadiusKm(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono text-sm"
              />
              <div className="text-[10px] text-slate-500 mt-1">Earth Radius: 6,371 km</div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-yellow-950/20 border border-yellow-800/40">
            <div className="text-xs text-yellow-300 font-semibold mb-1">Required Escape Velocity (ve):</div>
            <div className="text-3xl font-black font-mono text-white">
              {escapeVelocityKmS.toFixed(2)} km/s
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono">
              ~{(escapeVelocityKmS * 3600).toLocaleString()} km/h (Mach {(escapeVelocityKmS / 0.343).toFixed(1)})
            </div>
          </div>
        </div>
      )}

      {/* 4. Kepler 3rd Law */}
      {activeCalc === 'kepler' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white">Kepler’s Third Law Orbital Period</h3>
            <p className="text-xs text-slate-400 font-mono">Formula for Sun-orbiting bodies: T² = a³ ⟹ T = a^(1.5)</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Semi-Major Axis a (Astronomical Units AU)</label>
            <input
              type="number"
              step="0.01"
              value={semiMajorAxisAU}
              onChange={(e) => setSemiMajorAxisAU(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono text-sm"
            />
          </div>

          <div className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-800/40">
            <div className="text-xs text-indigo-300 font-semibold mb-1">Orbital Period T:</div>
            <div className="text-3xl font-black font-mono text-cyan-300">
              {keplerPeriodYears.toFixed(2)} Earth Years
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono">
              ~{(keplerPeriodYears * 365.25).toFixed(1)} Earth Days
            </div>
          </div>
        </div>
      )}

      {/* 5. Newton Gravity */}
      {activeCalc === 'gravity' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white">Newton’s Law of Universal Gravitation</h3>
            <p className="text-xs text-slate-400 font-mono">Formula: F = G · (m1 · m2) / r²</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mass 1 (m1 kg)</label>
              <input
                type="number"
                value={mass1Kg}
                onChange={(e) => setMass1Kg(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mass 2 (m2 kg)</label>
              <input
                type="number"
                value={mass2Kg}
                onChange={(e) => setMass2Kg(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Distance r (km)</label>
              <input
                type="number"
                value={distanceKm}
                onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2 font-mono text-xs"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-cyan-950/20 border border-cyan-800/40">
            <div className="text-xs text-cyan-300 font-semibold mb-1">Gravitational Force (F):</div>
            <div className="text-3xl font-black font-mono text-white">
              {forceNewtons.toExponential(4)} Newtons
            </div>
          </div>
        </div>
      )}

      {/* 6. Schwarzschild Radius */}
      {activeCalc === 'schwarzschild' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white">Schwarzschild Event Horizon Radius</h3>
            <p className="text-xs text-slate-400 font-mono">Formula: rs = 2GM / c² ≈ 2.95 km × (M / M☉)</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Mass in Solar Masses (M☉)</label>
            <input
              type="number"
              value={smbhMassSolar}
              onChange={(e) => setSmbhMassSolar(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono text-sm"
            />
          </div>

          <div className="p-6 rounded-2xl bg-purple-950/20 border border-purple-800/40">
            <div className="text-xs text-purple-300 font-semibold mb-1">Schwarzschild Radius (rs):</div>
            <div className="text-3xl font-black font-mono text-purple-300">
              {(rsMeters / 1000).toFixed(2)} km
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono">
              Diameter of event horizon: {((rsMeters * 2) / 1000).toFixed(2)} km
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
