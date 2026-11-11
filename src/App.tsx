import React, { useState, useEffect } from 'react';
import { CosmosModuleId, Language, SavedLibraryItem } from './types/cosmos';
import { NavigationHeader } from './components/layout/NavigationHeader';
import { CosmicBackground } from './components/layout/CosmicBackground';
import { QuickSearchModal } from './components/layout/QuickSearchModal';

// Modules
import { LiveSpaceDashboard } from './components/modules/LiveSpaceDashboard';
import { UniverseExplorerView } from './components/modules/UniverseExplorerView';
import { EarthDigitalTwinView } from './components/modules/EarthDigitalTwinView';
import { MarsExplorerView } from './components/modules/MarsExplorerView';
import { MoonExplorerView } from './components/modules/MoonExplorerView';
import { SatelliteTrackerView } from './components/modules/SatelliteTrackerView';
import { SpaceWeatherView } from './components/modules/SpaceWeatherView';
import { AsteroidObservatoryView } from './components/modules/AsteroidObservatoryView';
import { ExoplanetLabView } from './components/modules/ExoplanetLabView';
import { DeepSpaceView } from './components/modules/DeepSpaceView';
import { BlackHoleLabView } from './components/modules/BlackHoleLabView';
import { AIAssistantView } from './components/modules/AIAssistantView';
import { AIImageAnalyzerView } from './components/modules/AIImageAnalyzerView';
import { NasaDataCenterView } from './components/modules/NasaDataCenterView';
import { ResearchLabView } from './components/modules/ResearchLabView';
import { MissionControlView } from './components/modules/MissionControlView';
import { SpaceTravelSimulatorView } from './components/modules/SpaceTravelSimulatorView';
import { AstronomyCalculatorView } from './components/modules/AstronomyCalculatorView';
import { TelescopeCenterView } from './components/modules/TelescopeCenterView';
import { LearningCenterView } from './components/modules/LearningCenterView';
import { UniverseTimelineView } from './components/modules/UniverseTimelineView';
import { PersonalLibraryView } from './components/modules/PersonalLibraryView';

export default function App() {
  const [currentModule, setCurrentModule] = useState<CosmosModuleId>('dashboard');
  const [language, setLanguage] = useState<Language>('en');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [aiAssistantPrompt, setAiAssistantPrompt] = useState<string | undefined>(undefined);

  // Saved library items with localStorage persistence
  const [savedItems, setSavedItems] = useState<SavedLibraryItem[]>(() => {
    try {
      const stored = localStorage.getItem('cosmos_library');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'init-1',
        type: 'celestial-body',
        title: 'Jupiter & Galilean Moons',
        savedAt: 'Catalog Entry',
        data: {
          overview:
            'The largest gas giant with 95 confirmed moons and the ancient anticyclonic Great Red Spot storm.',
        },
      },
      {
        id: 'init-2',
        type: 'research-note',
        title: 'JWST Exoplanet Transmission Spectroscopy',
        savedAt: 'Catalog Entry',
        data: {
          content:
            'Observation confirmed carbon dioxide and methane in K2-18 b atmosphere, pointing toward a possible Hycean ocean world.',
        },
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('cosmos_library', JSON.stringify(savedItems));
    } catch (e) {
      console.error(e);
    }
  }, [savedItems]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleAddItem = (item: SavedLibraryItem) => {
    setSavedItems((prev) => {
      if (prev.some((p) => p.id === item.id)) return prev;
      return [item, ...prev];
    });
  };

  const handleRemoveItem = (id: string) => {
    setSavedItems((prev) => prev.filter((p) => p.id !== id));
  };

  const isItemSaved = (id: string) => {
    return savedItems.some((p) => p.id === id);
  };

  const navigateToAiWithPrompt = (prompt: string) => {
    setAiAssistantPrompt(prompt);
    setCurrentModule('ai-assistant');
  };

  const handleQuickNavigate = (module: CosmosModuleId, targetId?: string) => {
    setCurrentModule(module);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Background Starfield Canvas */}
      <CosmicBackground />

      {/* Sticky Main Navigation Header */}
      <NavigationHeader
        currentModule={currentModule}
        onSelectModule={(mod) => setCurrentModule(mod)}
        language={language}
        onSetLanguage={(l) => setLanguage(l)}
        onOpenSearch={() => setIsSearchOpen(true)}
        isOnline={isOnline}
      />

      {/* Global Quick Search Modal (Cmd+K) */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleQuickNavigate}
      />

      {/* Main Module Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentModule === 'dashboard' && (
          <LiveSpaceDashboard
            onNavigate={(mod) => setCurrentModule(mod)}
            language={language}
          />
        )}

        {currentModule === 'solar-system' && (
          <UniverseExplorerView
            onNavigateToAiWithPrompt={navigateToAiWithPrompt}
            onSaveItem={handleAddItem}
            isItemSaved={isItemSaved}
            language={language}
          />
        )}

        {currentModule === 'earth-twin' && (
          <EarthDigitalTwinView language={language} />
        )}

        {currentModule === 'mars-explorer' && (
          <MarsExplorerView language={language} />
        )}

        {currentModule === 'moon-explorer' && (
          <MoonExplorerView language={language} />
        )}

        {currentModule === 'satellite-iss' && (
          <SatelliteTrackerView language={language} />
        )}

        {currentModule === 'space-weather' && (
          <SpaceWeatherView language={language} />
        )}

        {currentModule === 'asteroids-neo' && (
          <AsteroidObservatoryView language={language} />
        )}

        {currentModule === 'exoplanets' && (
          <ExoplanetLabView language={language} />
        )}

        {currentModule === 'deep-space' && (
          <DeepSpaceView language={language} />
        )}

        {currentModule === 'black-holes' && (
          <BlackHoleLabView language={language} />
        )}

        {currentModule === 'ai-assistant' && (
          <AIAssistantView
            initialPrompt={aiAssistantPrompt}
            language={language}
            onSetLanguage={(l) => setLanguage(l)}
            onSaveChat={(chat) =>
              handleAddItem({
                id: `ai-${Date.now()}`,
                type: 'ai-chat',
                title: `Gemini AI: ${chat.content.slice(0, 45)}...`,
                savedAt: chat.time,
                data: chat,
              })
            }
          />
        )}

        {currentModule === 'ai-image-analyzer' && (
          <AIImageAnalyzerView language={language} />
        )}

        {currentModule === 'nasa-data' && (
          <NasaDataCenterView language={language} />
        )}

        {currentModule === 'research-lab' && (
          <ResearchLabView language={language} />
        )}

        {currentModule === 'mission-control' && (
          <MissionControlView language={language} />
        )}

        {currentModule === 'space-travel' && (
          <SpaceTravelSimulatorView language={language} />
        )}

        {currentModule === 'calculators' && (
          <AstronomyCalculatorView language={language} />
        )}

        {currentModule === 'telescopes' && (
          <TelescopeCenterView language={language} />
        )}

        {currentModule === 'learning-center' && (
          <LearningCenterView language={language} />
        )}

        {currentModule === 'timeline' && (
          <UniverseTimelineView language={language} />
        )}

        {currentModule === 'personal-library' && (
          <PersonalLibraryView
            savedItems={savedItems}
            onRemoveItem={handleRemoveItem}
            onAddItem={handleAddItem}
            isOnline={isOnline}
            language={language}
          />
        )}
      </main>

      {/* Space Scientific Footer */}
      <footer className="relative z-10 bg-slate-950/80 border-t border-slate-900 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">🪐</span>
            <div>
              <div className="font-bold text-slate-300">
                COSMOS EXPLORER – The Universe at Your Fingertips
              </div>
              <div className="text-[11px] text-slate-500">
                Scientific Data Gateway &bull; Powered by Google Gemini AI &bull; NASA Open APIs &bull; NOAA SWPC &bull; USGS
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>Version 2.6.4 (Production Full-Stack)</span>
            <span>&bull;</span>
            <span className="text-indigo-400 font-mono">Bilingual EN / हिन्दी</span>
            <span>&bull;</span>
            <span>All educational simulations clearly delineated from live telemetry</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
