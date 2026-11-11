import React, { useState } from 'react';
import { DEEP_SPACE_OBJECTS, DeepSpaceObject } from '../../data/deepSpaceData';
import { Language } from '../../types/cosmos';
import { Sparkles, Sun, Eye, Layers, Compass, ArrowRight } from 'lucide-react';

interface DeepSpaceViewProps {
  language: Language;
}

export const DeepSpaceView: React.FC<DeepSpaceViewProps> = ({ language }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'black-hole' | 'nebula' | 'galaxy' | 'star'>('all');
  const [selectedObject, setSelectedObject] = useState<DeepSpaceObject>(DEEP_SPACE_OBJECTS[2]); // Pillars of Creation
  const [activeTab, setActiveTab] = useState<'catalog' | 'hr-diagram' | 'lifecycle'>('catalog');

  const filtered = DEEP_SPACE_OBJECTS.filter((d) =>
    selectedCategory === 'all' ? true : d.type === selectedCategory
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <span>Stars, Galaxies & Deep Space Nebula Explorer</span>
          </h1>
          <p className="text-xs text-slate-400">
            Hertzsprung-Russell stellar classifications, supernova nucleosynthesis, and multi-wavelength cosmic imagery.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'catalog' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Deep Space Catalog
          </button>
          <button
            onClick={() => setActiveTab('hr-diagram')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'hr-diagram' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            H-R Diagram
          </button>
          <button
            onClick={() => setActiveTab('lifecycle')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'lifecycle' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Stellar Lifecycle
          </button>
        </div>
      </div>

      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Hero Featured Object */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 sm:h-80 lg:h-auto overflow-hidden">
                <img
                  src={selectedObject.image}
                  alt={selectedObject.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent lg:hidden" />
              </div>

              <div className="p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {selectedObject.scientificClassification}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {selectedObject.constellation} Constellation
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    {selectedObject.name}
                  </h2>
                  <div className="text-xs font-mono text-cyan-300 mt-1">
                    Distance: {selectedObject.distanceLightYears}
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed mt-4">
                    {language === 'hi' ? selectedObject.hindiDescription : selectedObject.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Key Observational Facts:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedObject.keyFacts.map((fact, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter Pills & Cards */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {(['all', 'black-hole', 'nebula', 'galaxy', 'star'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat.replace('-', ' ')}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((obj) => (
              <div
                key={obj.id}
                onClick={() => setSelectedObject(obj)}
                className={`rounded-2xl overflow-hidden border cursor-pointer transition-all ${
                  selectedObject.id === obj.id
                    ? 'bg-purple-950/40 border-purple-500/70 shadow-xl'
                    : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800'
                }`}
              >
                <div className="h-40 overflow-hidden relative">
                  <img src={obj.image} alt={obj.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950/80 text-purple-300 border border-slate-700">
                    {obj.type.toUpperCase()}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-white mb-1">{obj.name}</h3>
                  <div className="text-[11px] text-slate-400 font-mono mb-2">
                    {obj.distanceLightYears}
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {obj.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'hr-diagram' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">
              The Hertzsprung-Russell (H-R) Stellar Diagram
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Plots stellar luminosity (vertical axis) against effective surface temperature / spectral class OBAFGKM (horizontal axis).
            </p>
          </div>

          <div className="relative h-80 rounded-2xl bg-slate-950 border border-slate-800 p-6 flex flex-col justify-between overflow-hidden">
            {/* Spectral classes axis */}
            <div className="flex justify-between text-xs font-mono font-bold text-slate-400 border-b border-slate-800 pb-2">
              <span className="text-blue-400">Class O (35,000K)</span>
              <span className="text-sky-300">Class B (20,000K)</span>
              <span className="text-white">Class A (10,000K)</span>
              <span className="text-yellow-200">Class F (7,000K)</span>
              <span className="text-yellow-400">Class G (Sun, 5,500K)</span>
              <span className="text-orange-400">Class K (4,000K)</span>
              <span className="text-red-400">Class M (3,000K)</span>
            </div>

            {/* Stars Plotted in Stages */}
            <div className="relative flex-1 my-4">
              {/* Supergiants */}
              <div className="absolute top-2 right-8 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                <span className="text-xs font-bold text-red-300">Betelgeuse (Red Supergiant, 100,000 L☉)</span>
              </div>

              {/* Main Sequence Band Diagonal */}
              <div className="absolute inset-x-8 top-12 bottom-12 border-dashed border-t-2 border-b-2 border-indigo-500/30 transform -rotate-12 pointer-events-none" />

              {/* Sun on Main Sequence */}
              <div className="absolute top-1/2 left-[58%] -translate-y-1/2 flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 shadow-md shadow-yellow-400/50" />
                <span className="text-xs font-mono font-bold text-yellow-300">Sun (1 L☉, G2V)</span>
              </div>

              {/* Sirius A */}
              <div className="absolute top-1/4 left-[38%] flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-white shadow-md shadow-white/50" />
                <span className="text-xs font-mono font-bold text-white">Sirius A (25 L☉, A1V)</span>
              </div>

              {/* White Dwarfs */}
              <div className="absolute bottom-2 left-16 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-md shadow-cyan-300/50" />
                <span className="text-xs font-mono font-bold text-cyan-300">Sirius B (White Dwarf, 0.03 L☉)</span>
              </div>
            </div>

            <div className="flex justify-between text-[11px] font-mono text-slate-500 border-t border-slate-800 pt-2">
              <span>← High Temperature (Bluer)</span>
              <span>Low Temperature (Redder) →</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'lifecycle' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-2">Stellar Evolution Lifecycles</h3>
          <p className="text-xs text-slate-400 mb-6">
            A star’s destiny is dictated exclusively by its initial zero-age main-sequence mass.
          </p>

          <div className="space-y-6">
            {/* Average Stars (e.g. Sun, < 8 Solar Masses) */}
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                Branch A: Average Stars (0.5 to 8 Solar Masses — like our Sun)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs mt-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-white">1. Stellar Nebula</div>
                  <div className="text-slate-400 text-[11px] mt-1">Gravitational collapse of interstellar H₂ clouds.</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-yellow-300">2. Main Sequence</div>
                  <div className="text-slate-400 text-[11px] mt-1">Stable core hydrogen fusion (approx 10 billion years).</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-orange-400">3. Red Giant</div>
                  <div className="text-slate-400 text-[11px] mt-1">Core helium fusion; envelope expands outward.</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-cyan-300">4. White Dwarf</div>
                  <div className="text-slate-400 text-[11px] mt-1">Outer layers shed as Planetary Nebula; dense carbon-oxygen core remains.</div>
                </div>
              </div>
            </div>

            {/* Massive Stars (> 8 Solar Masses) */}
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
                Branch B: Massive Stars (&gt; 8 Solar Masses — Betelgeuse, Rigel)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs mt-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-blue-300">1. Massive Blue Giant</div>
                  <div className="text-slate-400 text-[11px] mt-1">Burns fuel furiously; lifetimes of only tens of millions of years.</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-red-400">2. Red Supergiant</div>
                  <div className="text-slate-400 text-[11px] mt-1">Silicon burning until nickel-iron core cannot release fusion energy.</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-yellow-300">3. Supernova (Type II)</div>
                  <div className="text-slate-400 text-[11px] mt-1">Catastrophic core-collapse creating heavy elements via r-process.</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="font-bold text-fuchsia-300">4. Neutron Star or Black Hole</div>
                  <div className="text-slate-400 text-[11px] mt-1">If core &gt; 2.2 M☉ (Tolman-Oppenheimer-Volkoff limit), forms Black Hole.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
