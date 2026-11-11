import React, { useEffect, useState } from 'react';
import { ISSTelemetry, Language } from '../../types/cosmos';
import {
  Satellite,
  Radio,
  Users,
  Compass,
  ArrowUpRight,
  RefreshCw,
  Clock,
  Shield,
  MapPin,
} from 'lucide-react';

interface SatelliteTrackerViewProps {
  language: Language;
}

export const SatelliteTrackerView: React.FC<SatelliteTrackerViewProps> = ({ language }) => {
  const [telemetry, setTelemetry] = useState<ISSTelemetry | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchISS = async () => {
    try {
      const res = await fetch('/api/iss/now');
      const data = await res.json();
      setTelemetry(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchISS();
    const interval = setInterval(fetchISS, 5000); // 5s interval for smooth orbital tracking
    return () => clearInterval(interval);
  }, []);

  // Compute 2D map position percentages
  const mapX = telemetry ? ((telemetry.longitude + 180) / 360) * 100 : 50;
  const mapY = telemetry ? ((90 - telemetry.latitude) / 180) * 100 : 50;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Satellite className="w-6 h-6 text-sky-400" />
            <span>Live International Space Station & Satellite Tracker</span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time orbital tracking, ground trajectory mapping, and human spaceflight crew status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-semibold">FEED: {telemetry?.isLive ? 'LIVE TELEMETRY' : 'ORBITAL PROPAGATOR'}</span>
            <span className="text-slate-500">• {lastUpdated}</span>
          </div>
          <button
            onClick={fetchISS}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
            title="Refresh Coordinates"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 font-medium">Latitude</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
            {telemetry ? `${telemetry.latitude.toFixed(4)}°` : '--'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {telemetry && telemetry.latitude >= 0 ? 'North of Equator' : 'South of Equator'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 font-medium">Longitude</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
            {telemetry ? `${telemetry.longitude.toFixed(4)}°` : '--'}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            {telemetry && telemetry.longitude >= 0 ? 'East of Greenwich' : 'West of Greenwich'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 font-medium">Orbital Velocity</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-sky-400 mt-1">
            27,580 km/h
          </div>
          <div className="text-[10px] text-slate-500 mt-1">~7.66 km per second (Mach 22.5)</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="text-xs text-slate-400 font-medium">Orbital Altitude</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-indigo-400 mt-1">
            421.4 km
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Low Earth Orbit (LEO)</div>
        </div>
      </div>

      {/* 2D World Ground Track Map */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Radio className="w-4 h-4 text-sky-400" />
            <span>Real-Time 2D Ground Track (Equirectangular Projection)</span>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Period: 92.68 min • Inclination: 51.64°
          </div>
        </div>

        <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
          {/* Subtle World Map Outline Grid */}
          <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 360 180">
            {/* Latitude Grid Lines */}
            {[-60, -30, 0, 30, 60].map((lat) => (
              <line
                key={lat}
                x1="0"
                y1={90 - lat}
                x2="360"
                y2={90 - lat}
                stroke="#334155"
                strokeWidth="0.5"
                strokeDasharray="2,2"
              />
            ))}
            {/* Longitude Grid Lines */}
            {[-120, -60, 0, 60, 120].map((lon) => (
              <line
                key={lon}
                x1={lon + 180}
                y1="0"
                x2={lon + 180}
                y2="180"
                stroke="#334155"
                strokeWidth="0.5"
                strokeDasharray="2,2"
              />
            ))}

            {/* Approximate continental outlines */}
            {/* Americas */}
            <path
              d="M 60,30 Q 90,40 80,75 Q 100,100 110,145 Q 90,165 75,130 Q 60,100 50,60 Z"
              fill="#1e293b"
            />
            {/* Eurasia / Africa */}
            <path
              d="M 180,30 Q 260,30 280,60 Q 250,90 220,90 Q 230,140 200,160 Q 180,120 170,90 Q 160,50 180,30 Z"
              fill="#1e293b"
            />
            {/* Australia */}
            <path d="M 290,120 Q 330,120 320,150 Q 285,150 290,120 Z" fill="#1e293b" />

            {/* Orbital Path Sine Wave */}
            <path
              d="M 0,90 Q 90,38.36 180,90 T 360,90"
              fill="none"
              stroke="#0284c7"
              strokeWidth="1.2"
              strokeDasharray="3,2"
              opacity="0.8"
            />
          </svg>

          {/* ISS Current Position Ping */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-1000 ease-linear pointer-events-none"
            style={{ left: `${mapX}%`, top: `${mapY}%` }}
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-sky-400/30 animate-ping absolute -inset-2" />
              <div className="w-4 h-4 rounded-full bg-sky-500 border-2 border-white flex items-center justify-center shadow-lg shadow-sky-500/80">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </div>
            <div className="absolute top-5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900/90 border border-sky-400/40 text-[10px] font-mono font-bold text-sky-200 whitespace-nowrap shadow-xl">
              ISS ({telemetry ? `${telemetry.latitude.toFixed(1)}°, ${telemetry.longitude.toFixed(1)}°` : ''})
            </div>
          </div>
        </div>
      </div>

      {/* Crew On Board & Other Tracked Satellites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expedition Crew Roster */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Current Human Crew on Board ISS (Expedition 71/72)</span>
            </h3>
            <span className="text-xs text-indigo-400 font-mono font-semibold">
              {telemetry?.crew.length || 5} Astronauts
            </span>
          </div>

          <div className="space-y-2.5">
            {(telemetry?.crew || [
              { name: 'Sunita Williams', agency: 'NASA', role: 'Commander' },
              { name: 'Barry Wilmore', agency: 'NASA', role: 'Flight Engineer' },
              { name: 'Don Pettit', agency: 'NASA', role: 'Flight Engineer' },
              { name: 'Aleksey Ovchinin', agency: 'Roscosmos', role: 'Flight Engineer' },
              { name: 'Ivan Vagner', agency: 'Roscosmos', role: 'Flight Engineer' },
            ]).map((astronaut, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xs text-indigo-300 font-bold">
                    {astronaut.name[0]}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{astronaut.name}</div>
                    <div className="text-[10px] text-slate-400">{astronaut.role}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                  {astronaut.agency}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Other Supported Satellites */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Satellite className="w-4 h-4 text-cyan-400" />
              <span>Other High-Value Spacecraft Tracked</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Catalog: NORAD</span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
                <span>Hubble Space Telescope (HST)</span>
                <span className="text-emerald-400 font-mono text-[10px]">LEO • 535 km</span>
              </div>
              <p className="text-[11px] text-slate-400">
                28.5° inclination orbit. Completing ~15 orbits daily, collecting deep ultraviolet and optical exposures.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
                <span>James Webb Space Telescope (JWST)</span>
                <span className="text-amber-400 font-mono text-[10px]">L2 Halo • 1.5M km</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Orbits the second Sun-Earth Lagrange point. Never enters Earth's shadow, keeping sunshield permanently aligned.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
                <span>NOAA-20 / JPSS Polar Weather</span>
                <span className="text-sky-400 font-mono text-[10px]">SSO • 824 km</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Sun-synchronous polar orbit crossing equator at 1:30 PM local time daily for global climate forecasting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
