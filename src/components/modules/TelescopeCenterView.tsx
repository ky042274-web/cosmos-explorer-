import React, { useState } from 'react';
import { Language } from '../../types/cosmos';
import { Telescope, Eye, Sparkles, Compass, Radio, ExternalLink } from 'lucide-react';

interface TelescopeCenterViewProps {
  language: Language;
}

export const TelescopeCenterView: React.FC<TelescopeCenterViewProps> = ({ language }) => {
  const observatories = [
    {
      id: 'jwst',
      name: 'James Webb Space Telescope (JWST)',
      agency: 'NASA / ESA / CSA',
      aperture: '6.5 meters (Gold-coated Beryllium)',
      orbit: 'Sun-Earth L2 (1.5 Million km)',
      wavelengths: 'Near-Infrared & Mid-Infrared (0.6 – 28.5 μm)',
      highlights: 'Captures ancient galaxies >13.4 billion years old; reveals exoplanet atmospheric water vapor and carbon dioxide.',
      image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 'hubble',
      name: 'Hubble Space Telescope (HST)',
      agency: 'NASA / ESA',
      aperture: '2.4 meters',
      orbit: 'Low Earth Orbit (535 km, 28.5°)',
      wavelengths: 'Ultraviolet, Optical, Near-Infrared (0.1 – 1.7 μm)',
      highlights: 'Over 30 years of flagship deep optical science, measuring cosmic expansion rate and discovery of dark energy acceleration.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 'chandra',
      name: 'Chandra X-ray Observatory',
      agency: 'NASA',
      aperture: '1.2 meters (Grazing-incidence nested mirrors)',
      orbit: 'Highly Elliptical Earth Orbit (16,000 – 133,000 km)',
      wavelengths: 'X-Ray (0.1 – 10 keV)',
      highlights: 'Investigates superheated million-degree plasma, black hole accretion disks, and neutron star magnetic fields.',
      image: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 'roman',
      name: 'Nancy Grace Roman Space Telescope',
      agency: 'NASA',
      aperture: '2.4 meters',
      orbit: 'Sun-Earth L2',
      wavelengths: 'Visible & Near-Infrared (0.5 – 2.0 μm)',
      highlights: 'Wide-field survey with 100x Hubble’s field of view to map billions of galaxies and dark matter halos.',
      image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1200&auto=format&fit=crop',
    },
  ];

  const stargazingGuide = [
    { target: 'Orion Nebula (M42)', type: 'Emission Nebula', mag: '+4.0', note: 'Easily visible below Orion’s belt with binoculars or small telescopes.' },
    { target: 'Andromeda Galaxy (M31)', type: 'Spiral Galaxy', mag: '+3.4', note: 'Faint fuzzy oval in constellation Andromeda; 2.5 million light-years away.' },
    { target: 'Pleiades Star Cluster (M45)', type: 'Open Cluster', mag: '+1.6', note: 'Seven bright blue B-type stars surrounded by faint reflection nebulosity.' },
    { target: 'Jupiter & 4 Galilean Moons', type: 'Gas Giant', mag: '-2.4', note: 'Io, Europa, Ganymede, Callisto clearly visible in a line through 10x binoculars.' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
          <Telescope className="w-6 h-6 text-sky-400" />
          <span>Great Observatories & Stargazing Observation Center</span>
        </h1>
        <p className="text-xs text-slate-400">
          Flagship space observatories (JWST, Hubble, Chandra, Roman), multi-wavelength optics, and tonight’s sky observing guide.
        </p>
      </div>

      {/* Observatories Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {observatories.map((tel) => (
          <div
            key={tel.id}
            className="rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between group hover:border-sky-500/50 transition-all"
          >
            <div>
              <div className="h-48 overflow-hidden relative">
                <img
                  src={tel.image}
                  alt={tel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono bg-black/70 text-cyan-300 backdrop-blur-md border border-slate-700">
                  {tel.agency}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">{tel.name}</h3>

                <div className="space-y-1.5 text-xs text-slate-300 font-mono mb-4">
                  <div>Aperture: <strong className="text-white">{tel.aperture}</strong></div>
                  <div>Orbit: <strong className="text-cyan-300">{tel.orbit}</strong></div>
                  <div>Band: <strong className="text-amber-300">{tel.wavelengths}</strong></div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{tel.highlights}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex items-center justify-between">
              <span>Scientific Instrument Array Verified</span>
              <span className="text-sky-400 font-semibold">Active Operations</span>
            </div>
          </div>
        ))}
      </div>

      {/* Stargazing Guide Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Eye className="w-4 h-4 text-cyan-400" />
          <span>Amateur Astronomer Observation Guide: Tonight's Sky Targets</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stargazingGuide.map((tgt, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-white">
                <span>{tgt.target}</span>
                <span className="font-mono text-[10px] text-amber-400">{tgt.mag}</span>
              </div>
              <div className="text-[10px] font-mono text-cyan-400">{tgt.type}</div>
              <p className="text-xs text-slate-400 leading-relaxed">{tgt.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
