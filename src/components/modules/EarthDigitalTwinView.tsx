import React, { useEffect, useState } from 'react';
import { EarthGlobeScene } from '../3d/EarthGlobeScene';
import { Globe, Activity, Wind, Shield, Satellite, Radio, RefreshCw, Thermometer } from 'lucide-react';
import { Language } from '../../types/cosmos';

interface EarthDigitalTwinViewProps {
  language: Language;
}

export const EarthDigitalTwinView: React.FC<EarthDigitalTwinViewProps> = ({ language }) => {
  const [earthquakes, setEarthquakes] = useState<any[]>([]);
  const [issPosition, setIssPosition] = useState<{ lat: number; lon: number }>({ lat: 28.5, lon: 77.2 });
  const [activeTab, setActiveTab] = useState<'quakes' | 'atmosphere' | 'satellites'>('quakes');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [eqRes, issRes] = await Promise.allSettled([
          fetch('/api/earthquakes').then((r) => r.json()),
          fetch('/api/iss/now').then((r) => r.json()),
        ]);

        if (eqRes.status === 'fulfilled' && eqRes.value.earthquakes) {
          setEarthquakes(eqRes.value.earthquakes);
        }
        if (issRes.status === 'fulfilled' && issRes.value.latitude !== undefined) {
          setIssPosition({ lat: issRes.value.latitude, lon: issRes.value.longitude });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-sky-400" />
            <span>Earth Digital Twin & Planetary Sensor Sphere</span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time planetary data: USGS tectonic seismology, atmospheric circulation, orbital satellites, and solar illumination.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('quakes')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'quakes' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Seismic (USGS)
          </button>
          <button
            onClick={() => setActiveTab('atmosphere')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'atmosphere' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Atmosphere & Magnetosphere
          </button>
          <button
            onClick={() => setActiveTab('satellites')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'satellites' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Orbital Assets
          </button>
        </div>
      </div>

      {/* 3D Earth Globe */}
      <EarthGlobeScene
        issPosition={issPosition}
        earthquakes={earthquakes}
      />

      {/* Dynamic Data Panel */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
        {activeTab === 'quakes' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <span>Recent Global Earthquakes (M 4.5+ Monitored by USGS)</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Live Seismic Feed</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {earthquakes.slice(0, 8).map((eq) => (
                <div
                  key={eq.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                          eq.magnitude >= 6.0
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        M {eq.magnitude.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Depth: {eq.depthKm} km</span>
                    </div>
                    <div className="text-xs font-medium text-white truncate" title={eq.place}>
                      {eq.place}
                    </div>
                  </div>
                  <div className="mt-3 text-[10px] text-slate-400 font-mono">
                    Coords: {eq.coords[0].toFixed(2)}°, {eq.coords[1].toFixed(2)}°
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'atmosphere' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Wind className="w-4 h-4" /> Atmospheric Layers
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li>• <strong>Troposphere (0-12 km):</strong> Houses 75% of atmospheric mass and all terrestrial weather systems.</li>
                <li>• <strong>Stratosphere (12-50 km):</strong> Contains the protective ozone layer (O₃) absorbing UV-C and UV-B.</li>
                <li>• <strong>Mesosphere (50-85 km):</strong> Coldest layer (-90°C) where incoming meteoroids incinerate into "shooting stars".</li>
                <li>• <strong>Thermosphere (85-600 km):</strong> Ionized by extreme solar UV; host to the ISS and polar Auroras.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Shield className="w-4 h-4" /> Earth’s Geodynamo Magnetosphere
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Generated by convective circulation of molten iron and nickel in Earth's outer core. Deflects lethal solar wind ions and cosmic rays into the Van Allen radiation belts, preserving Earth’s oceans and atmosphere over geological time.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Thermometer className="w-4 h-4" /> Climate & Albedo Metrics
              </div>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Planetary Bond Albedo:</span>
                  <span className="font-mono text-white">0.306 (Reflects ~30% sunlight)</span>
                </div>
                <div className="flex justify-between">
                  <span>Atmospheric Carbon Dioxide:</span>
                  <span className="font-mono text-white">~424 ppm (NOAA Mauna Loa)</span>
                </div>
                <div className="flex justify-between">
                  <span>Surface Solar Irradiance:</span>
                  <span className="font-mono text-white">1,361 W/m² (Solar constant)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'satellites' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs font-semibold text-white flex items-center justify-between mb-2">
                <span>International Space Station (ISS)</span>
                <span className="text-emerald-400 font-mono text-[10px]">OPERATIONAL</span>
              </div>
              <p className="text-xs text-slate-400">
                Low Earth Orbit at 421 km altitude, 51.6° orbital inclination, completing one revolution every 92.7 minutes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs font-semibold text-white flex items-center justify-between mb-2">
                <span>Hubble Space Telescope (HST)</span>
                <span className="text-emerald-400 font-mono text-[10px]">OPERATIONAL</span>
              </div>
              <p className="text-xs text-slate-400">
                Orbiting at 535 km altitude since 1990, conducting deep optical, ultraviolet, and near-infrared astronomy.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs font-semibold text-white flex items-center justify-between mb-2">
                <span>NOAA & Copernicus Constellation</span>
                <span className="text-sky-400 font-mono text-[10px]">CONTINUOUS POLAR</span>
              </div>
              <p className="text-xs text-slate-400">
                Sun-synchronous polar orbits monitoring ocean temperatures, polar ice sheet melt, and severe hurricane tracks.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
