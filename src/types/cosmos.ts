export type Language = 'en' | 'hi' | 'hinglish';

export type CosmosModuleId =
  | 'dashboard'
  | 'solar-system'
  | 'earth-twin'
  | 'mars-explorer'
  | 'moon-explorer'
  | 'satellite-iss'
  | 'space-weather'
  | 'asteroids-neo'
  | 'exoplanets'
  | 'deep-space'
  | 'black-holes'
  | 'ai-assistant'
  | 'ai-image-analyzer'
  | 'nasa-data'
  | 'research-lab'
  | 'mission-control'
  | 'space-travel'
  | 'calculators'
  | 'telescopes'
  | 'learning-center'
  | 'timeline'
  | 'personal-library';

export interface CelestialBody {
  id: string;
  name: string;
  hindiName: string;
  category: 'star' | 'planet' | 'dwarf-planet' | 'moon' | 'asteroid' | 'exoplanet' | 'black-hole';
  diameterKm: number;
  massKg: string;
  massEarthRelative: number;
  distanceFromSunAU: number;
  distanceFromSunKm: number;
  orbitalPeriodDays: number;
  rotationPeriodHours: number;
  surfaceGravityMs2: number;
  averageTempC: number;
  moonsCount: number;
  atmosphere: string[];
  color: string;
  texturePattern: 'sun' | 'rocky-mercury' | 'cloud-venus' | 'earth' | 'mars' | 'jupiter-bands' | 'saturn' | 'uranus' | 'neptune' | 'pluto' | 'moon';
  hasRings?: boolean;
  ringsRadiusInner?: number;
  ringsRadiusOuter?: number;
  overview: string;
  hindiOverview: string;
  keyFeatures: string[];
  explorationMilestones: string[];
}

export interface ISSTelemetry {
  timestamp: number;
  latitude: number;
  longitude: number;
  altitudeKm: number;
  velocityKmh: number;
  crew: Array<{ name: string; agency: string; role: string }>;
  isLive: boolean;
}

export interface SpaceWeather {
  timestamp: string;
  kpIndex: number;
  stormLevel: string;
  solarWind: {
    speedKmS: number;
    densityPcm3: number;
    bzFieldNt: number;
  };
  solarFlareActivity: {
    class: string;
    status: string;
    xRayFlux: string;
    sourceRegion: string;
  };
  auroraForecast: {
    kpThreshold: number;
    probabilityNorthPolar: number;
    probabilityMidLatitudes: number;
    viewableLocations: string[];
  };
  cmeAlert: {
    detected: boolean;
    lastEvent: string;
    impactRisk: string;
  };
  sourceAttribution: string;
}

export interface NearEarthObject {
  id: string;
  name: string;
  estimatedDiameterMeters: { min: number; max: number };
  isPotentiallyHazardous: boolean;
  closeApproachDate: string;
  relativeVelocityKmSec: number;
  missDistanceKm: number;
  missDistanceLD: number;
  orbitClass: string;
  riskNote: string;
}

export interface Exoplanet {
  id: string;
  name: string;
  discoveryYear: number;
  discoveryMethod: 'Transit' | 'Radial Velocity' | 'Direct Imaging' | 'Gravitational Microlensing';
  distanceLightYears: number;
  hostStar: string;
  hostStarType: string;
  radiusEarthRelative: number;
  massEarthRelative: number;
  orbitalPeriodDays: number;
  inHabitableZone: boolean;
  habitabilityIndex: number; // 0 to 1
  equilibriumTempK: number;
  overview: string;
}

export interface SpaceMission {
  id: string;
  name: string;
  agency: string;
  launchYear: number;
  status: 'Active' | 'Completed' | 'En Route' | 'Planned';
  target: string;
  type: 'Orbiter' | 'Lander/Rover' | 'Flyby' | 'Space Telescope' | 'Crewed';
  keyMilestones: string[];
  description: string;
  image: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  journalOrArxiv: string;
  year: number;
  topic: string;
  abstract: string;
  doiOrUrl: string;
}

export interface SavedLibraryItem {
  id: string;
  type: 'celestial-body' | 'research-note' | 'ai-chat' | 'apod-image' | 'quiz-result';
  title: string;
  savedAt: string;
  data: any;
}
