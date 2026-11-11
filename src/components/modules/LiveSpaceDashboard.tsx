import React, { useEffect, useState } from 'react';
import { CosmosModuleId, Language, ISSTelemetry, SpaceWeather, NearEarthObject } from '../../types/cosmos';
import { I18N_TRANSLATIONS } from '../../data/i18n';
import {
  Satellite,
  Sun,
  ShieldAlert,
  Compass,
  Globe,
  Radio,
  Rocket,
  Sparkles,
  Telescope,
  Bot,
  Activity,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Flame,
  CheckCircle2,
} from 'lucide-react';

interface LiveSpaceDashboardProps {
  onNavigate: (module: CosmosModuleId, targetId?: string) => void;
  language: Language;
}

export const LiveSpaceDashboard: React.FC<LiveSpaceDashboardProps> = ({
  onNavigate,
  language,
}) => {
  const t = I18N_TRANSLATIONS[language === 'hinglish' ? 'en' : language];

  const [issData, setIssData] = useState<ISSTelemetry | null>(null);
  const [spaceWeather, setSpaceWeather] = useState<SpaceWeather | null>(null);
  const [neoData, setNeoData] = useState<{ asteroids: NearEarthObject[]; retrievedAt: string } | null>(null);
  const [apodData, setApodData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [issRes, swRes, neoRes, apodRes] = await Promise.allSettled([
        fetch('/api/iss/now').then((r) => r.json()),
        fetch('/api/space-weather').then((r) => r.json()),
        fetch('/api/nasa/neo').then((r) => r.json()),
        fetch('/api/nasa/apod').then((r) => r.json()),
      ]);

      if (issRes.status === 'fulfilled') setIssData(issRes.value);
      if (swRes.status === 'fulfilled') setSpaceWeather(swRes.value);
      if (neoRes.status === 'fulfilled') setNeoData(neoRes.value);
      if (apodRes.status === 'fulfilled') setApodData(apodRes.value);

      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (e) {
      console.error('Error fetching dashboard telemetry', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Welcome & Mission Status Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>COSMOS CORE TELEMETRY ACTIVE</span>
              <span className="text-slate-400">• Updated: {lastRefreshed || 'Just now'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {language === 'hi' ? 'ब्रह्मांड अन्वेषण नियंत्रण केंद्र' : 'Cosmos Mission Control & Real-Time Observatory'}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
              {language === 'hi'
                ? 'नासा, ईएसए और वैज्ञानिक वेधशालाओं से वास्तविक खगोलीय डेटा, 3D सौर मंडल सिमुलेशन और जेमिनी AI सहायता।'
                : 'Unified space science ecosystem combining NASA telemetry, 3D celestial mechanics, authentic satellite tracking, and Google Gemini AI assistance.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('solar-system')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Launch 3D Explorer</span>
            </button>
            <button
              onClick={() => onNavigate('ai-assistant')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Ask Gemini AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Critical Live Telemetry Dials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: ISS Live Position */}
        <div
          onClick={() => onNavigate('satellite-iss')}
          className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition-all cursor-pointer group shadow-xl"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-[11px] text-sky-400">
              <Satellite className="w-4 h-4" /> International Space Station
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">
              LIVE
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-white group-hover:text-sky-300 transition-colors">
            {issData ? `${issData.latitude.toFixed(2)}°, ${issData.longitude.toFixed(2)}°` : '42.18° N, 71.05° W'}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>Speed: 27,580 km/h</span>
            <span>Alt: 421 km</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-sky-400 group-hover:text-sky-300">
            <span>{issData?.crew.length || 5} Astronauts on board</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Space Weather & Solar Wind */}
        <div
          onClick={() => onNavigate('space-weather')}
          className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group shadow-xl"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-[11px] text-amber-400">
              <Sun className="w-4 h-4" /> Space Weather (NOAA)
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-mono">
              Kp {spaceWeather?.kpIndex || 3}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
            {spaceWeather?.stormLevel || 'G0 (Quiet Conditions)'}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>Solar Wind: {spaceWeather?.solarWind.speedKmS || 440} km/s</span>
            <span>Flare: {spaceWeather?.solarFlareActivity.class || 'C3.1'}</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-amber-400 group-hover:text-amber-300">
            <span>Aurora prob: {spaceWeather?.auroraForecast.probabilityNorthPolar || 75}% north</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Asteroid & NEO Watch */}
        <div
          onClick={() => onNavigate('asteroids-neo')}
          className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-red-500/50 transition-all cursor-pointer group shadow-xl"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-[11px] text-red-400">
              <ShieldAlert className="w-4 h-4" /> NASA Asteroid Radar
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
              CNEOS
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white group-hover:text-red-300 transition-colors">
            99942 Apophis
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>Size: ~340m</span>
            <span className="text-amber-400 font-mono">2029-04-13 (0.08 LD)</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-red-400 group-hover:text-red-300">
            <span>4 Tracked NEOs Monitored</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Black Hole & Gravitational Waves */}
        <div
          onClick={() => onNavigate('black-holes')}
          className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer group shadow-xl"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-[11px] text-purple-400">
              <Sparkles className="w-4 h-4" /> Relativistic Lab
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 font-mono">
              EHT
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
            Sagittarius A*
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>4.15M Solar Masses</span>
            <span className="text-purple-300">rs ≈ 12.2M km</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-purple-400 group-hover:text-purple-300">
            <span>Lensing & Spacetime Grid</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main Feature Dual Row: NASA APOD Showcase + Quick Module Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* NASA APOD Feature Card */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="relative h-64 sm:h-72 overflow-hidden group">
            <img
              src={apodData?.url || 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop'}
              alt={apodData?.title || 'Astronomy Picture of the Day'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600/90 text-white backdrop-blur-md shadow-lg">
                NASA Astronomy Picture of the Day
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {apodData?.title || 'The Pillars of Creation in Webb and Hubble Light'}
              </h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                {apodData?.explanation}
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-950 flex items-center justify-between border-t border-slate-800 text-xs">
            <div className="text-slate-400 font-mono text-[11px]">
              Credit: {apodData?.copyright || 'NASA, ESA, CSA, STScI'}
            </div>
            <button
              onClick={() => onNavigate('nasa-data')}
              className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1.5"
            >
              <span>Explore NASA Archive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Night Sky & Stargazing Highlights */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-cyan-400 flex items-center gap-1.5">
                <Telescope className="w-4 h-4" /> Visible in Sky Tonight
              </span>
              <span className="text-[10px] font-mono text-slate-500">Global Horizon</span>
            </div>

            <div className="space-y-3 mt-4">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-medium text-white">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    Jupiter (Mag -2.4)
                  </span>
                  <span className="text-amber-400 text-[11px]">Rising at Sunset</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Prominent in constellation Taurus; 4 Galilean moons visible with 10x binoculars.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-medium text-white">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    Mars (Mag -0.3)
                  </span>
                  <span className="text-red-400 text-[11px]">High Meridian</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Distinct red hue in Gemini; approaching opposition with clear polar cap features.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-medium text-white">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                    Saturn (Mag +0.8)
                  </span>
                  <span className="text-yellow-400 text-[11px]">Evening Twilight</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Rings currently tilted at edge-on angle (~3.7°), creating unique needle-like appearance.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('telescopes')}
            className="w-full mt-4 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium text-center transition-colors border border-slate-700 flex items-center justify-center gap-2"
          >
            <span>Open Telescope & Stargazing Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 24-Module Full Navigation Launchpad */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-indigo-400">⚡</span>
            <span>All 24 Cosmos Modules & Exploration Labs</span>
          </h2>
          <span className="text-xs text-slate-400">Click any card to launch immediately</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { id: 'solar-system', label: '3D Solar System', category: '3D Simulation', color: 'from-amber-500/20 to-orange-500/20' },
            { id: 'earth-twin', label: 'Earth Digital Twin', category: '3D Globe', color: 'from-blue-500/20 to-cyan-500/20' },
            { id: 'mars-explorer', label: 'Mars & Rovers', category: 'Surface Lab', color: 'from-red-500/20 to-amber-500/20' },
            { id: 'moon-explorer', label: 'Moon & Lunar Base', category: '3D Surface', color: 'from-slate-500/20 to-zinc-500/20' },
            { id: 'satellite-iss', label: 'ISS & Satellites', category: 'Live Orbit', color: 'from-sky-500/20 to-indigo-500/20' },
            { id: 'space-weather', label: 'Space Weather', category: 'NOAA Monitor', color: 'from-amber-500/20 to-yellow-500/20' },
            { id: 'asteroids-neo', label: 'Asteroid Radar', category: 'NASA CNEOS', color: 'from-rose-500/20 to-red-500/20' },
            { id: 'exoplanets', label: 'Exoplanet Lab', category: 'NASA Archive', color: 'from-emerald-500/20 to-teal-500/20' },
            { id: 'deep-space', label: 'Stars & Nebulae', category: 'Astrophysics', color: 'from-purple-500/20 to-violet-500/20' },
            { id: 'black-holes', label: 'Black Hole Lab', category: 'Relativity', color: 'from-fuchsia-500/20 to-purple-500/20' },
            { id: 'ai-assistant', label: 'Gemini AI Assistant', category: 'Intelligent AI', color: 'from-indigo-500/20 to-cyan-500/20' },
            { id: 'ai-image-analyzer', label: 'Image Analyzer', category: 'Gemini Vision', color: 'from-cyan-500/20 to-blue-500/20' },
            { id: 'nasa-data', label: 'NASA Data Center', category: 'APOD & Images', color: 'from-blue-500/20 to-indigo-500/20' },
            { id: 'research-lab', label: 'Space Research Lab', category: 'arXiv Summaries', color: 'from-slate-500/20 to-indigo-500/20' },
            { id: 'mission-control', label: 'Mission Control', category: 'Spaceflight', color: 'from-orange-500/20 to-amber-500/20' },
            { id: 'space-travel', label: 'Space Travel 3D', category: 'Orbital Mech', color: 'from-teal-500/20 to-emerald-500/20' },
            { id: 'calculators', label: 'Astro Calculators', category: '8 Equations', color: 'from-yellow-500/20 to-amber-500/20' },
            { id: 'telescopes', label: 'Great Telescopes', category: 'JWST & Hubble', color: 'from-sky-500/20 to-blue-500/20' },
            { id: 'learning-center', label: 'Academy & Quizzes', category: 'Certification', color: 'from-violet-500/20 to-indigo-500/20' },
            { id: 'timeline', label: 'Universe Timeline', category: '13.8 Billion Yrs', color: 'from-purple-500/20 to-pink-500/20' },
            { id: 'personal-library', label: 'Personal Library', category: 'Offline & Notes', color: 'from-slate-500/20 to-indigo-500/20' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as CosmosModuleId)}
              className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/40 text-left transition-all group flex flex-col justify-between h-24 hover:shadow-lg"
            >
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider group-hover:text-indigo-400">
                {item.category}
              </div>
              <div className="text-xs font-semibold text-white group-hover:text-indigo-200">
                {item.label}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
