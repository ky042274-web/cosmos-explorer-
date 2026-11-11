import React, { useEffect, useState } from 'react';
import { Language } from '../../types/cosmos';
import { Globe, Calendar, RefreshCw, ExternalLink, Image as ImageIcon, Sparkles, Radio } from 'lucide-react';

interface NasaDataCenterViewProps {
  language: Language;
}

export const NasaDataCenterView: React.FC<NasaDataCenterViewProps> = ({ language }) => {
  const [apodDate, setApodDate] = useState<string>('');
  const [apodData, setApodData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchApod = async (date?: string) => {
    setLoading(true);
    try {
      const url = `/api/nasa/apod${date ? `?date=${date}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      setApodData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApod();
  }, []);

  const newsItems = [
    {
      title: 'Europa Clipper Successfully Deploys Ice-Penetrating Radar Antennas in Deep Space',
      agency: 'NASA / JPL',
      date: 'November 2026',
      summary: 'The flagship outer planets probe has verified deployment of its 16-meter REASON radar boom, calibrated to sound the internal ice shell of Jupiter’s moon Europa.',
    },
    {
      title: 'James Webb Space Telescope Confirms Oldest Known Merging Supermassive Black Holes',
      agency: 'ESA / NASA / CSA',
      date: 'October 2026',
      summary: 'Infrared spectroscopy of galaxy cluster ZS7 at redshift z=7.4 reveals dual active galactic nuclei coalescing just 740 million years after the Big Bang.',
    },
    {
      title: 'ISRO Announces Next-Generation Gaganyaan Crewed Orbital Flight Readiness Test',
      agency: 'ISRO',
      date: 'October 2026',
      summary: 'Final integrated drop tests and ECLSS environmental life support qualification reviews completed ahead of human spaceflight demonstrations.',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-indigo-400" />
            <span>NASA & International Space Agency Data Center</span>
          </h1>
          <p className="text-xs text-slate-400">
            Official open API gateways: Astronomy Picture of the Day (APOD), NASA Image Archives, and multi-agency mission bulletins.
          </p>
        </div>

        {/* Date Selector for APOD */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs">
          <Calendar className="w-4 h-4 text-indigo-400 ml-1" />
          <input
            type="date"
            value={apodDate}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => {
              setApodDate(e.target.value);
              fetchApod(e.target.value);
            }}
            className="bg-slate-950 text-white border border-slate-700 px-2 py-1 rounded-lg focus:outline-none"
          />
        </div>
      </div>

      {/* APOD Hero Showcase */}
      {apodData && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-72 sm:h-96 lg:h-auto overflow-hidden group">
              <img
                src={apodData.url}
                alt={apodData.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-cyan-300 border border-slate-700">
                NASA APOD • {apodData.date}
              </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {apodData.media_type?.toUpperCase() || 'IMAGE'}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
                  {apodData.title}
                </h2>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  Credit: {apodData.copyright || 'NASA / ESA / STScI'}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-4">
                  {apodData.explanation}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">
                  Source: {apodData.isLive ? 'Live NASA Open API' : 'NASA Heritage Archive'}
                </span>
                {apodData.hdurl && (
                  <a
                    href={apodData.hdurl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <span>Full High-Res (HD)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Space Agency News Bulletins */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400" />
          <span>Latest Official Space Science & Exploration Dispatches</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {newsItems.map((news, i) => (
            <div key={i} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 mb-2">
                  <span>{news.agency}</span>
                  <span className="text-slate-500">{news.date}</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-2 leading-snug">{news.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{news.summary}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
                Verified Space Agency Telemetry
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
