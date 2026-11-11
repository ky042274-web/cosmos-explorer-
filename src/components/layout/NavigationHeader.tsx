import React, { useState } from 'react';
import { CosmosModuleId, Language } from '../../types/cosmos';
import { I18N_TRANSLATIONS } from '../../data/i18n';
import {
  Globe,
  Compass,
  Satellite,
  Sun,
  ShieldAlert,
  Bot,
  Image as ImageIcon,
  BookOpen,
  Calculator,
  Rocket,
  Search,
  Sparkles,
  Wifi,
  WifiOff,
  Menu,
  X,
  Telescope,
  GraduationCap,
  Clock,
  Bookmark,
  Share2,
} from 'lucide-react';

interface NavigationHeaderProps {
  currentModule: CosmosModuleId;
  onSelectModule: (id: CosmosModuleId) => void;
  language: Language;
  onSetLanguage: (lang: Language) => void;
  onOpenSearch: () => void;
  isOnline: boolean;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentModule,
  onSelectModule,
  language,
  onSetLanguage,
  onOpenSearch,
  isOnline,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = I18N_TRANSLATIONS[language === 'hinglish' ? 'en' : language];

  const primaryModules: Array<{ id: CosmosModuleId; icon: any }> = [
    { id: 'dashboard', icon: Globe },
    { id: 'solar-system', icon: Compass },
    { id: 'earth-twin', icon: Globe },
    { id: 'mars-explorer', icon: Rocket },
    { id: 'satellite-iss', icon: Satellite },
    { id: 'space-weather', icon: Sun },
    { id: 'asteroids-neo', icon: ShieldAlert },
    { id: 'exoplanets', icon: Compass },
    { id: 'black-holes', icon: Sparkles },
    { id: 'ai-assistant', icon: Bot },
    { id: 'ai-image-analyzer', icon: ImageIcon },
    { id: 'research-lab', icon: BookOpen },
    { id: 'calculators', icon: Calculator },
    { id: 'telescopes', icon: Telescope },
    { id: 'learning-center', icon: GraduationCap },
    { id: 'timeline', icon: Clock },
    { id: 'personal-library', icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div
            onClick={() => onSelectModule('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden">
                <span className="text-xl">🪐</span>
              </div>
            </div>
            <div>
              <div className="font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-cyan-300 text-base sm:text-lg flex items-center gap-2">
                COSMOS EXPLORER
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI v2.6
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium hidden sm:block tracking-wide">
                {language === 'hi' ? 'ब्रह्मांड अब आपकी उंगलियों पर' : 'The Universe at Your Fingertips'}
              </div>
            </div>
          </div>

          {/* Center Navigation Shortcuts (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { id: 'dashboard', label: language === 'hi' ? 'डैशबोर्ड' : 'Dashboard' },
              { id: 'solar-system', label: language === 'hi' ? 'सौर मंडल 3D' : 'Solar System 3D' },
              { id: 'earth-twin', label: language === 'hi' ? 'पृथ्वी ट्विन' : 'Earth Twin' },
              { id: 'mars-explorer', label: language === 'hi' ? 'मंगल' : 'Mars' },
              { id: 'satellite-iss', label: language === 'hi' ? 'ISS ट्रैकर' : 'ISS Tracker' },
              { id: 'black-holes', label: language === 'hi' ? 'ब्लैक होल' : 'Black Holes' },
              { id: 'ai-assistant', label: 'Gemini AI' },
              { id: 'learning-center', label: language === 'hi' ? 'शिक्षा' : 'Academy' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => onSelectModule(tab.id as CosmosModuleId)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentModule === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Button (Ctrl+K) */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-400 hover:text-white hover:border-indigo-500/50 transition-colors text-xs"
              title="Search Cosmos (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden md:inline font-mono text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* Language Selector */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-medium">
              <button
                onClick={() => onSetLanguage('en')}
                className={`px-2 py-1 rounded transition-colors ${
                  language === 'en'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onSetLanguage('hi')}
                className={`px-2 py-1 rounded transition-colors ${
                  language === 'hi'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => onSetLanguage('hinglish')}
                className={`px-2 py-1 rounded transition-colors ${
                  language === 'hinglish'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Hinglish (Hindi in English script)"
              >
                Hin
              </button>
            </div>

            {/* Online / Offline status badge */}
            <div
              className={`hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
                isOnline
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50'
                  : 'bg-amber-950/40 text-amber-400 border-amber-800/50'
              }`}
              title={isOnline ? 'Connected to Real-Time Telemetry' : 'Offline Mode (Local Cache Active)'}
            >
              {isOnline ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-mono">LIVE DSN</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3" />
                  <span className="text-[11px] font-mono">CACHED</span>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 mt-2">
            {primaryModules.map((m) => {
              const Icon = m.icon;
              const isSelected = currentModule === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    onSelectModule(m.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/30'
                      : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 border border-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-cyan-400" />
                  <span className="truncate">{t.modules[m.id]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
