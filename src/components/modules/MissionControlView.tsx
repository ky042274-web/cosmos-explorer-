import React, { useState } from 'react';
import { MISSIONS_DATA } from '../../data/missionsData';
import { SpaceMission, Language } from '../../types/cosmos';
import { Rocket, Clock, Compass, Radio, CheckCircle2, ArrowRight } from 'lucide-react';

interface MissionControlViewProps {
  language: Language;
}

export const MissionControlView: React.FC<MissionControlViewProps> = ({ language }) => {
  const [selectedMission, setSelectedMission] = useState<SpaceMission>(MISSIONS_DATA[3]); // JWST
  const [filterType, setFilterType] = useState<string>('All');

  const filteredMissions = MISSIONS_DATA.filter((m) =>
    filterType === 'All' ? true : m.status === filterType
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Rocket className="w-6 h-6 text-orange-400" />
            <span>Space Mission Control Center & Deep Space Network</span>
          </h1>
          <p className="text-xs text-slate-400">
            Chronological mission architectures, interplanetary trajectory waypoints, and NASA Deep Space Network (DSN) tracking.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs">
          {['All', 'Active', 'Completed', 'En Route', 'Planned'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterType(status)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterType === status ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Mission Spotlight Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative h-64 sm:h-80 lg:h-auto overflow-hidden">
            <img
              src={selectedMission.image}
              alt={selectedMission.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-cyan-300 border border-slate-700">
              {selectedMission.agency} • Launch: {selectedMission.launchYear}
            </div>
          </div>

          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                    selectedMission.status === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : selectedMission.status === 'En Route'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {selectedMission.status}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Target: {selectedMission.target}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {selectedMission.name}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-4">
                {selectedMission.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Mission Milestones & Telemetry Record:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedMission.keyMilestones.map((ms, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{ms}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Space Network (DSN) Live Dish Tracking Simulator */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>NASA Deep Space Network (DSN) Global Tracking Complex</span>
          </h3>
          <span className="text-xs text-emerald-400 font-mono">Continuous 3-Station Relay</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
              <span>Goldstone Complex (California, USA)</span>
              <span className="text-emerald-400 font-mono text-[10px]">DSS 14 (70m)</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">Tracking: Voyager 1 & Perseverance</div>
            <div className="text-[10px] text-slate-500 mt-2">Uplink: 7.1 GHz • Round-Trip Light Time: 45h 12m</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
              <span>Madrid Complex (Robledo, Spain)</span>
              <span className="text-emerald-400 font-mono text-[10px]">DSS 63 (70m)</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">Tracking: James Webb Space Telescope (JWST)</div>
            <div className="text-[10px] text-slate-500 mt-2">Ka-Band Science Downlink: 28 Mbps • RTLT: 10.2 sec</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
              <span>Canberra Complex (Tidbinbilla, Australia)</span>
              <span className="text-emerald-400 font-mono text-[10px]">DSS 43 (70m)</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">Tracking: Europa Clipper & Voyager 2</div>
            <div className="text-[10px] text-slate-500 mt-2">X-Band Trajectory Intercept Navigation</div>
          </div>
        </div>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMissions.map((m) => (
          <div
            key={m.id}
            onClick={() => setSelectedMission(m)}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              selectedMission.id === m.id
                ? 'bg-orange-950/30 border-orange-500/70 shadow-xl'
                : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-white">{m.name}</span>
              <span
                className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                  m.status === 'Active'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {m.status}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono mb-2">
              {m.agency} • Launch: {m.launchYear}
            </div>
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {m.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
