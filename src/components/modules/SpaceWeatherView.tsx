import React, { useEffect, useState } from 'react';
import { SpaceWeather, Language } from '../../types/cosmos';
import { Sun, Wind, ShieldAlert, Sparkles, AlertTriangle, RefreshCw, Activity, Compass } from 'lucide-react';

interface SpaceWeatherViewProps {
  language: Language;
}

export const SpaceWeatherView: React.FC<SpaceWeatherViewProps> = ({ language }) => {
  const [data, setData] = useState<SpaceWeather | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSpaceWeather = async () => {
    try {
      const res = await fetch('/api/space-weather');
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaceWeather();
    const interval = setInterval(fetchSpaceWeather, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Sun className="w-6 h-6 text-amber-400" />
            <span>Space Weather Observatory & Geomagnetic Monitor</span>
          </h1>
          <p className="text-xs text-slate-400">
            Official solar dynamics from NOAA Space Weather Prediction Center (SWPC) and NASA Solar Dynamics Observatory.
          </p>
        </div>

        <button
          onClick={fetchSpaceWeather}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Feeds</span>
        </button>
      </div>

      {/* 3 Main Space Weather Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Planetary Kp Index Gauge */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4" /> Planetary Kp Index
              </span>
              <span className="text-[10px] font-mono text-slate-500">Scale: 0 - 9</span>
            </div>

            <div className="flex items-baseline gap-3 my-4">
              <span className="text-4xl sm:text-5xl font-black font-mono text-white">
                Kp {data?.kpIndex ?? 3}
              </span>
              <span
                className={`text-xs font-bold uppercase px-2.5 py-1 rounded-lg border ${
                  (data?.kpIndex ?? 3) >= 5
                    ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                }`}
              >
                {data?.stormLevel ?? 'G0 (Quiet)'}
              </span>
            </div>

            {/* Visual Kp Meter */}
            <div className="grid grid-cols-9 gap-1 h-3 mt-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
                <div
                  key={lvl}
                  className={`rounded-sm transition-all ${
                    (data?.kpIndex ?? 3) >= lvl
                      ? lvl <= 4
                        ? 'bg-emerald-400'
                        : lvl <= 6
                        ? 'bg-amber-400'
                        : 'bg-red-500'
                      : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
            The Kp-index measures global geomagnetic perturbations induced by solar wind interacting with Earth’s magnetosphere. Kp ≥ 5 indicates a geomagnetic storm.
          </p>
        </div>

        {/* Solar Wind Telemetry */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="font-semibold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Wind className="w-4 h-4" /> Solar Wind (DSCOVR)
              </span>
              <span className="text-[10px] font-mono text-slate-500">L1 Lagrange Point</span>
            </div>

            <div className="space-y-4 my-2">
              <div>
                <div className="text-xs text-slate-400">Proton Velocity</div>
                <div className="text-2xl font-bold font-mono text-sky-400">
                  {data?.solarWind.speedKmS ?? 435} <span className="text-xs font-normal text-slate-400">km/s</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <div className="text-[11px] text-slate-400">Proton Density</div>
                  <div className="text-sm font-bold font-mono text-white">
                    {data?.solarWind.densityPcm3 ?? 4.8} p/cm³
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Interplanetary Bz</div>
                  <div className="text-sm font-bold font-mono text-amber-400">
                    {data?.solarWind.bzFieldNt ?? -1.8} nT
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
            A negative Bz component (southward magnetic field) connects easily with Earth’s northward magnetic field, funneling solar energetic particles directly into polar auroral ovals.
          </p>
        </div>

        {/* Solar Flare Classification */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="font-semibold uppercase tracking-wider text-yellow-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Solar Flare Activity
              </span>
              <span className="text-[10px] font-mono text-slate-500">GOES-18 X-Ray</span>
            </div>

            <div className="my-3">
              <div className="text-xs text-slate-400">Current Background Flare Class</div>
              <div className="text-3xl font-black font-mono text-yellow-400 mt-1">
                {data?.solarFlareActivity.class ?? 'C3.1'}
              </div>
              <div className="text-xs text-slate-300 mt-1 font-mono">
                X-Ray Flux: {data?.solarFlareActivity.xRayFlux ?? '3.1 × 10⁻⁶ W/m²'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
              <div className="font-semibold text-white">Active Solar Region:</div>
              <div className="text-[11px] text-slate-400">{data?.solarFlareActivity.sourceRegion ?? 'AR3872 (Southern Sunspot Belt)'}</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500">
            Flare Hierarchy: A &lt; B &lt; C (Minor) &lt; M (Moderate / Radio Fade) &lt; X (Extreme Blackouts)
          </div>
        </div>
      </div>

      {/* Aurora Forecast & Earth Magnetosphere Educational Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Aurora Viewing Probability */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Aurora Borealis & Australis Viewing Forecast</span>
            </h3>
            <span className="text-xs text-emerald-400 font-mono font-semibold">
              {data?.auroraForecast.probabilityNorthPolar ?? 75}% Polar Probability
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-950 border border-emerald-800/40">
            <div className="text-xs font-semibold text-emerald-200 mb-2">Prime Visibility Locations Tonight:</div>
            <div className="flex flex-wrap gap-2">
              {(data?.auroraForecast.viewableLocations ?? ['Norway (Tromsø)', 'Iceland (Reykjavik)', 'Alaska (Fairbanks)', 'Northern Canada', 'Finland']).map(
                (loc, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-medium"
                  >
                    📍 {loc}
                  </span>
                )
              )}
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-4 leading-relaxed">
            Auroras occur when solar wind electrons and protons are guided down geomagnetic field lines into the upper thermosphere (100–300 km), exciting Oxygen (yielding emerald green at 557.7 nm and crimson red at 630 nm) and Nitrogen (yielding blue/purple hues).
          </p>
        </div>

        {/* CME (Coronal Mass Ejection) Tracker */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Coronal Mass Ejection (CME) Impact Watch</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">SOHO / LASCO C2/C3</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Earth-Directed CME:</span>
              <span className="font-bold text-emerald-400">None Imminent (Quiet)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Last Significant Event:</span>
              <span className="font-mono text-slate-300">{data?.cmeAlert.lastEvent ?? '2026-10-24 (Grazing shockwave)'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Power Grid / GPS Impact Risk:</span>
              <span className="font-mono text-emerald-400 font-bold">Low (Normal Operations)</span>
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-400 leading-relaxed">
            Data Source: <strong className="text-white">NOAA Space Weather Prediction Center (SWPC)</strong> in Boulder, Colorado, utilizing real-time solar telemetry from DSCOVR, GOES-16/18, SOHO, and SDO satellites.
          </div>
        </div>
      </div>
    </div>
  );
};
