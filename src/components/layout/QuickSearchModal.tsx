import React, { useState, useEffect, useRef } from 'react';
import { CosmosModuleId } from '../../types/cosmos';
import { SOLAR_SYSTEM_BODIES } from '../../data/solarSystemData';
import { MISSIONS_DATA } from '../../data/missionsData';
import { EXOPLANETS_DATA } from '../../data/exoplanetsData';
import { DEEP_SPACE_OBJECTS } from '../../data/deepSpaceData';
import { Search, X, Compass, Rocket, Sparkles, Calculator, Bot, ArrowRight } from 'lucide-react';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: CosmosModuleId, targetId?: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onNavigate('dashboard');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNavigate]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Filter items
  const matchedPlanets = SOLAR_SYSTEM_BODIES.filter(
    (b) => b.name.toLowerCase().includes(q) || b.hindiName.includes(q) || b.category.includes(q)
  );

  const matchedMissions = MISSIONS_DATA.filter(
    (m) => m.name.toLowerCase().includes(q) || m.target.toLowerCase().includes(q) || m.agency.toLowerCase().includes(q)
  );

  const matchedExoplanets = EXOPLANETS_DATA.filter(
    (e) => e.name.toLowerCase().includes(q) || e.hostStar.toLowerCase().includes(q)
  );

  const matchedDeepSpace = DEEP_SPACE_OBJECTS.filter(
    (d) => d.name.toLowerCase().includes(q) || d.type.includes(q) || d.constellation.toLowerCase().includes(q)
  );

  const matchedCalculators = [
    { title: 'Escape Velocity Calculator', formula: 've = √(2GM/R)' },
    { title: 'Schwarzschild Black Hole Radius', formula: 'rs = 2GM/c²' },
    { title: 'Planetary Weight Converter', formula: 'W = m × g' },
    { title: 'Kepler’s 3rd Law Orbital Period', formula: 'T² ∝ a³' },
    { title: 'Light-Year & Parsec Converter', formula: '1 pc ≈ 3.26 ly' },
  ].filter((c) => c.title.toLowerCase().includes(q) || c.formula.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800">
          <Search className="w-5 h-5 text-indigo-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search planets, rovers, missions, black holes, calculators..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white rounded-md mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700 ml-2"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Quick Tool Links if empty */}
          {!q && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Featured Explorers & AI Tools
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'solar-system', label: '3D Solar System', desc: 'Sun & 9 planetary bodies', icon: Compass },
                  { id: 'ai-assistant', label: 'Cosmos Gemini AI', desc: 'Bilingual astrophysics chat', icon: Bot },
                  { id: 'satellite-iss', label: 'Live ISS Tracker', desc: 'Real-time telemetry & crew', icon: Rocket },
                  { id: 'black-holes', label: 'Black Hole & Gravity Lab', desc: 'Kerr relativistic physics', icon: Sparkles },
                  { id: 'calculators', label: 'Astronomy Calculators', desc: 'Escape velocity & light-years', icon: Calculator },
                  { id: 'research-lab', label: 'Space Research Lab', desc: 'arXiv papers & AI summaries', icon: Search },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id as CosmosModuleId);
                        onClose();
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 text-left transition-all group"
                    >
                      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-indigo-200">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-slate-400">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matched Planets */}
          {matchedPlanets.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Solar System Bodies</span>
                <span className="text-indigo-400">{matchedPlanets.length}</span>
              </div>
              <div className="space-y-1">
                {matchedPlanets.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      onNavigate('solar-system', b.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 hover:bg-slate-800/80 border border-slate-800/60 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: b.color }}
                      />
                      <div>
                        <span className="text-xs font-semibold text-white group-hover:text-indigo-300 mr-2">
                          {b.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-hindi">
                          {b.hindiName}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="font-mono text-[11px]">{b.diameterKm.toLocaleString()} km</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Missions */}
          {matchedMissions.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Space Missions</span>
                <span className="text-cyan-400">{matchedMissions.length}</span>
              </div>
              <div className="space-y-1">
                {matchedMissions.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onNavigate('mission-control', m.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 hover:bg-slate-800/80 border border-slate-800/60 text-left transition-colors group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-cyan-300">
                        {m.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {m.agency} • Target: {m.target} ({m.launchYear})
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Deep Space Objects */}
          {matchedDeepSpace.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Stars, Nebulae & Black Holes</span>
                <span className="text-purple-400">{matchedDeepSpace.length}</span>
              </div>
              <div className="space-y-1">
                {matchedDeepSpace.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      onNavigate(d.type === 'black-hole' ? 'black-holes' : 'deep-space', d.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 hover:bg-slate-800/80 border border-slate-800/60 text-left transition-colors group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-purple-300">
                        {d.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {d.scientificClassification} • {d.distanceLightYears}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-purple-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Exoplanets */}
          {matchedExoplanets.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Confirmed Exoplanets</span>
                <span className="text-emerald-400">{matchedExoplanets.length}</span>
              </div>
              <div className="space-y-1">
                {matchedExoplanets.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => {
                      onNavigate('exoplanets', e.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 hover:bg-slate-800/80 border border-slate-800/60 text-left transition-colors group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-emerald-300">
                        {e.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Host: {e.hostStar} ({e.distanceLightYears} ly) • {e.inHabitableZone ? '🌿 In Habitable Zone' : 'Extreme Atmosphere'}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Calculators */}
          {matchedCalculators.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Astrophysics Calculators</span>
                <span className="text-amber-400">{matchedCalculators.length}</span>
              </div>
              <div className="space-y-1">
                {matchedCalculators.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onNavigate('calculators');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 hover:bg-slate-800/80 border border-slate-800/60 text-left transition-colors group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-amber-300">
                        {c.title}
                      </div>
                      <div className="font-mono text-[10px] text-amber-400/80">
                        {c.formula}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && matchedPlanets.length === 0 && matchedMissions.length === 0 && matchedDeepSpace.length === 0 && matchedExoplanets.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm">No celestial catalog results for &quot;{query}&quot;.</p>
              <button
                onClick={() => {
                  onNavigate('ai-assistant');
                  onClose();
                }}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
              >
                <Bot className="w-4 h-4" /> Ask Gemini AI about &quot;{query}&quot;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
