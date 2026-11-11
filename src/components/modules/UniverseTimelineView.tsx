import React, { useState } from 'react';
import { COSMIC_TIMELINE, TimelineEpoch } from '../../data/timelineData';
import { Language } from '../../types/cosmos';
import { Clock, Sparkles, Sun, Globe, Atom, Radio, Rocket, Moon, Maximize2, Dna } from 'lucide-react';

interface UniverseTimelineViewProps {
  language: Language;
}

export const UniverseTimelineView: React.FC<UniverseTimelineViewProps> = ({ language }) => {
  const [selectedEpoch, setSelectedEpoch] = useState<TimelineEpoch>(COSMIC_TIMELINE[3]); // CMB

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Maximize2': return <Maximize2 className="w-5 h-5" />;
      case 'Atom': return <Atom className="w-5 h-5" />;
      case 'Radio': return <Radio className="w-5 h-5" />;
      case 'Sun': return <Sun className="w-5 h-5" />;
      case 'Globe': return <Globe className="w-5 h-5" />;
      case 'Dna': return <Dna className="w-5 h-5" />;
      case 'Rocket': return <Rocket className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
          <Clock className="w-6 h-6 text-purple-400" />
          <span>The Cosmic Calendar: 13.8 Billion Years of Universe Evolution</span>
        </h1>
        <p className="text-xs text-slate-400">
          Chronological milestone timeline from the Planck Epoch and Cosmic Inflation to the birth of the Solar System and Heat Death.
        </p>
      </div>

      {/* Selected Epoch Spotlight */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              {getIcon(selectedEpoch.icon)}
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-purple-400 font-semibold">
                {selectedEpoch.era} • {selectedEpoch.timeFromBigBang}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {language === 'hi' ? selectedEpoch.hindiTitle : selectedEpoch.title}
              </h2>
            </div>
          </div>

          <div className="text-right text-xs font-mono shrink-0">
            <div className="text-slate-400">Cosmic Epoch:</div>
            <div className="font-bold text-cyan-300">{selectedEpoch.yearsAgo}</div>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mt-4">
          {language === 'hi' ? selectedEpoch.hindiDescription : selectedEpoch.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-800 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block mb-1">Cosmic Background Temperature:</span>
            <span className="font-mono text-amber-300 font-bold">{selectedEpoch.temperature}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block mb-1">Physical Mechanism:</span>
            <span className="font-mono text-white">{selectedEpoch.physicalProcess}</span>
          </div>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-indigo-500/40 space-y-6">
        {COSMIC_TIMELINE.map((epoch, idx) => {
          const isSelected = selectedEpoch.era === epoch.era;
          return (
            <div
              key={idx}
              onClick={() => setSelectedEpoch(epoch)}
              className="relative cursor-pointer group"
            >
              {/* Timeline Marker Dot */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                  isSelected
                    ? 'bg-purple-600 border-white ring-4 ring-purple-500/30'
                    : 'bg-slate-950 border-slate-700 group-hover:border-purple-400'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-slate-600'}`} />
              </div>

              <div
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500/60 shadow-xl'
                    : 'bg-slate-900/70 hover:bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs mb-1">
                  <span className="font-mono font-bold text-purple-300">{epoch.era}</span>
                  <span className="font-mono text-[11px] text-slate-400">{epoch.timeFromBigBang} ({epoch.yearsAgo})</span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-purple-200 transition-colors">
                  {epoch.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {epoch.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
