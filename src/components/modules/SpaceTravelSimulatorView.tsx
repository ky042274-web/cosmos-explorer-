import React, { useState } from 'react';
import { Language } from '../../types/cosmos';
import { Rocket, Compass, Orbit, Gauge, Zap, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

interface SpaceTravelSimulatorViewProps {
  language: Language;
}

export const SpaceTravelSimulatorView: React.FC<SpaceTravelSimulatorViewProps> = ({ language }) => {
  const [origin, setOrigin] = useState<'earth' | 'moon' | 'mars'>('earth');
  const [destination, setDestination] = useState<'moon' | 'mars' | 'jupiter' | 'saturn'>('mars');
  const [propulsion, setPropulsion] = useState<'chemical' | 'ntp' | 'ion' | 'lightsail'>('ntp');
  const [enableGravityAssist, setEnableGravityAssist] = useState(false);

  // Distances in AU from Sun
  const distancesAU: Record<string, number> = {
    earth: 1.0,
    moon: 1.0, // Treated from Earth orbit
    mars: 1.524,
    jupiter: 5.204,
    saturn: 9.582,
  };

  const r1 = distancesAU[origin];
  const r2 = distancesAU[destination];

  // Hohmann semi-major axis: a = (r1 + r2) / 2
  const a_AU = (r1 + r2) / 2;
  // Transfer time: T = 0.5 * a^(3/2) years
  let baseTransferDays = 0.5 * Math.pow(a_AU, 1.5) * 365.25;

  if (destination === 'moon') {
    baseTransferDays = 3.5; // Direct translunar injection
  }

  // Propulsion multipliers
  const propulsionConfigs = {
    chemical: { name: 'Chemical LH2/LOX (Isp ~450s)', timeMult: 1.0, deltaVMult: 1.0, desc: 'High thrust, high propellant mass ratio' },
    ntp: { name: 'Nuclear Thermal Propulsion (Isp ~900s)', timeMult: 0.65, deltaVMult: 0.85, desc: 'Doubled specific impulse, reduces Mars transit to 4 months' },
    ion: { name: 'Ion / Hall Thruster (Isp ~3000s)', timeMult: 1.4, deltaVMult: 0.45, desc: 'Continuous low-thrust spiral trajectory, extreme fuel efficiency' },
    lightsail: { name: 'Solar / Laser Light Sail', timeMult: 0.35, deltaVMult: 0.1, desc: 'Zero propellant reaction mass; propelled by photon radiation pressure' },
  };

  let transitDays = Math.round(baseTransferDays * propulsionConfigs[propulsion].timeMult);
  if (enableGravityAssist && (destination === 'jupiter' || destination === 'saturn')) {
    transitDays = Math.round(transitDays * 0.75); // Gravity assist slingshot speedup
  }

  // Approximate Delta-v in km/s
  let deltaVKmS = 0;
  if (destination === 'moon') deltaVKmS = 3.9;
  else if (destination === 'mars') deltaVKmS = 5.7;
  else if (destination === 'jupiter') deltaVKmS = 8.8;
  else if (destination === 'saturn') deltaVKmS = 10.3;

  deltaVKmS = +(deltaVKmS * propulsionConfigs[propulsion].deltaVMult).toFixed(2);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
          <Rocket className="w-6 h-6 text-teal-400" />
          <span>3D Space Travel & Interplanetary Trajectory Simulator</span>
        </h1>
        <p className="text-xs text-slate-400">
          Astrodynamics modeler: Hohmann transfer ellipses, orbital mechanics, propellant $\Delta v$ budgets, and planetary gravity assists.
        </p>
      </div>

      {/* Trajectory Configuration Panel */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Orbit className="w-4 h-4 text-teal-400" />
          <span>Mission Itinerary & Spacecraft Propulsion</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Origin */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <label className="block text-xs font-semibold text-slate-400 mb-2">Departure World</label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg p-2"
            >
              <option value="earth">Earth (Low Earth Orbit 300km)</option>
              <option value="moon">Moon (Lunar Gateway Orbit)</option>
              <option value="mars">Mars (Phobos Base)</option>
            </select>
          </div>

          {/* Destination */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <label className="block text-xs font-semibold text-slate-400 mb-2">Target Destination</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg p-2"
            >
              <option value="moon">The Moon (384,400 km)</option>
              <option value="mars">Mars (~225M km)</option>
              <option value="jupiter">Jupiter & Europa (~778M km)</option>
              <option value="saturn">Saturn & Titan (~1.4B km)</option>
            </select>
          </div>

          {/* Propulsion */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <label className="block text-xs font-semibold text-slate-400 mb-2">Engine Architecture</label>
            <select
              value={propulsion}
              onChange={(e) => setPropulsion(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg p-2"
            >
              <option value="chemical">Chemical LH2/LOX</option>
              <option value="ntp">Nuclear Thermal (NTP)</option>
              <option value="ion">Ion / Hall Thrusters</option>
              <option value="lightsail">Laser / Solar Light Sail</option>
            </select>
          </div>
        </div>

        {/* Gravity Assist Toggle */}
        <div className="mt-4 flex items-center justify-between p-3.5 rounded-xl bg-slate-950/40 border border-slate-800">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-300">
              Calculate Planetary Gravity Assist Slingshot (Mars / Earth Flyby)
            </span>
          </div>
          <button
            onClick={() => setEnableGravityAssist(!enableGravityAssist)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              enableGravityAssist
                ? 'bg-teal-600 text-white font-semibold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {enableGravityAssist ? 'ENABLED (+25% Speedup)' : 'DISABLED'}
          </button>
        </div>

        {/* Results Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-800/40">
            <div className="text-xs text-teal-300 font-semibold flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5" /> Estimated Transit Duration
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white">
              {transitDays >= 365
                ? `${(transitDays / 365.25).toFixed(1)} Years`
                : `${transitDays} Days`}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              ~{Math.round(transitDays * 24)} flight hours
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-800/40">
            <div className="text-xs text-indigo-300 font-semibold flex items-center gap-1.5 mb-1">
              <Zap className="w-3.5 h-3.5" /> Total Δv (Delta-V) Budget
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-300">
              {deltaVKmS} km/s
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Tsiolkovsky rocket equation budget
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-800/40">
            <div className="text-xs text-purple-300 font-semibold flex items-center gap-1.5 mb-1">
              <Orbit className="w-3.5 h-3.5" /> Hohmann Semi-Major Axis
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white">
              {a_AU.toFixed(2)} AU
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {(a_AU * 149.6).toFixed(1)} Million km orbit radius
            </div>
          </div>
        </div>

        {/* Hohmann Physics Formula Explanation */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1.5 leading-relaxed">
          <strong className="text-white">Educational Orbital Physics Note:</strong>
          <div>
            A Hohmann transfer ellipse is the most fuel-efficient two-burn maneuver to transfer between circular coplanar orbits. The departure burn Δv1 accelerates the spacecraft into an elliptical transfer orbit, and the arrival burn Δv2 circularizes into the target planetary orbit.
          </div>
        </div>
      </div>
    </div>
  );
};
