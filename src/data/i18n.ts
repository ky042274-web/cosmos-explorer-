import { CosmosModuleId, Language } from '../types/cosmos';

export interface I18nDict {
  appName: string;
  tagline: string;
  modules: Record<CosmosModuleId, string>;
  common: {
    live: string;
    forecast: string;
    simulated: string;
    authentic: string;
    explore: string;
    search: string;
    searchPlaceholder: string;
    save: string;
    saved: string;
    remove: string;
    loading: string;
    error: string;
    offlineMode: string;
    onlineMode: string;
    speed: string;
    resetCamera: string;
    details: string;
    diameter: string;
    mass: string;
    distance: string;
    gravity: string;
    temperature: string;
    moons: string;
    atmosphere: string;
    back: string;
    compare: string;
    askCosmosAi: string;
    citations: string;
    exportPdf: string;
    exportJson: string;
  };
}

export const I18N_TRANSLATIONS: Record<'en' | 'hi', I18nDict> = {
  en: {
    appName: 'COSMOS EXPLORER',
    tagline: 'The Universe at Your Fingertips',
    modules: {
      dashboard: 'Live Space Dashboard',
      'solar-system': '3D Universe & Planets',
      'earth-twin': 'Earth Digital Twin',
      'mars-explorer': 'Mars Explorer & Rovers',
      'moon-explorer': 'Moon Explorer & Base',
      'satellite-iss': 'Live ISS & Satellites',
      'space-weather': 'Space Weather Monitor',
      'asteroids-neo': 'Asteroid & NEO Observatory',
      exoplanets: 'Exoplanet Discovery Lab',
      'deep-space': 'Stars, Nebulae & Galaxies',
      'black-holes': 'Black Hole & Gravity Lab',
      'ai-assistant': 'COSMOS Gemini AI',
      'ai-image-analyzer': 'AI Space Image Analyzer',
      'nasa-data': 'NASA & Space Data Center',
      'research-lab': 'Advanced Research Lab',
      'mission-control': 'Space Mission Control',
      'space-travel': '3D Space Travel Simulator',
      calculators: 'Astronomy Calculators',
      telescopes: 'Telescopes & Observation',
      'learning-center': 'Space Learning & Quizzes',
      timeline: 'Universe Timeline',
      'personal-library': 'Personal Space Library',
    },
    common: {
      live: 'LIVE TELEMETRY',
      forecast: 'FORECAST',
      simulated: 'SIMULATION',
      authentic: 'OFFICIAL DATA',
      explore: 'Explore',
      search: 'Search Cosmos...',
      searchPlaceholder: 'Search planets, stars, missions, equations (Ctrl+K)...',
      save: 'Bookmark',
      saved: 'Bookmarked',
      remove: 'Remove',
      loading: 'Loading telemetry...',
      error: 'Data error, using backup feed',
      offlineMode: 'Offline Mode (Local Cache Active)',
      onlineMode: 'Connected to Deep Space Network',
      speed: 'Simulation Speed',
      resetCamera: 'Reset View',
      details: 'Scientific Details',
      diameter: 'Diameter',
      mass: 'Mass',
      distance: 'Distance from Sun',
      gravity: 'Surface Gravity',
      temperature: 'Avg Temperature',
      moons: 'Confirmed Moons',
      atmosphere: 'Atmosphere Composition',
      back: 'Back to Explorer',
      compare: 'Compare Objects',
      askCosmosAi: 'Ask Gemini AI about this',
      citations: 'Approved Scientific Sources',
      exportPdf: 'Export Research Report',
      exportJson: 'Export Data (JSON)',
    },
  },
  hi: {
    appName: 'कॉसमॉस एक्सप्लोरर',
    tagline: 'ब्रह्मांड अब आपकी उंगलियों पर',
    modules: {
      dashboard: 'लाइव स्पेस डैशबोर्ड',
      'solar-system': '3D सौर मंडल एवं ग्रह',
      'earth-twin': 'पृथ्वी डिजिटल ट्विन',
      'mars-explorer': 'मंगल अन्वेषण एवं रोवर',
      'moon-explorer': 'चंद्रमा एवं लूनर बेस',
      'satellite-iss': 'लाइव ISS व उपग्रह ट्रैकर',
      'space-weather': 'अंतरिक्ष मौसम मॉनिटर',
      'asteroids-neo': 'क्षुद्रग्रह (NEO) वेधशाला',
      exoplanets: 'बहिर्ग्रह खोज प्रयोगशाला',
      'deep-space': 'तारे, नीहारिका व आकाशगंगा',
      'black-holes': 'ब्लैक होल व गुरुत्वाकर्षण',
      'ai-assistant': 'कॉसमॉस जेमिनी AI',
      'ai-image-analyzer': 'AI अंतरिक्ष चित्र विश्लेषक',
      'nasa-data': 'नासा एवं अंतरिक्ष डेटा केंद्र',
      'research-lab': 'उन्नत अंतरिक्ष शोध लैब',
      'mission-control': 'अंतरिक्ष मिशन नियंत्रण',
      'space-travel': '3D अंतरिक्ष यात्रा सिम्युलेटर',
      calculators: 'खगोल विज्ञान कैलकुलेटर',
      telescopes: 'दूरबीन एवं अवलोकन केंद्र',
      'learning-center': 'शिक्षा एवं प्रश्नोत्तरी',
      timeline: 'ब्रह्मांड समयरेखा',
      'personal-library': 'मेरी अंतरिक्ष लाइब्रेरी',
    },
    common: {
      live: 'लाइव टेलीमेट्री',
      forecast: 'पूर्वानुमान',
      simulated: 'सिमुलेशन',
      authentic: 'आधिकारिक डेटा',
      explore: 'अन्वेषण करें',
      search: 'खोजें...',
      searchPlaceholder: 'ग्रह, तारे, मिशन या सूत्र खोजें (Ctrl+K)...',
      save: 'बुकमार्क करें',
      saved: 'सहेजा गया',
      remove: 'हटाएं',
      loading: 'डेटा लोड हो रहा है...',
      error: 'त्रुटि, बैकअप डेटा प्रयुक्त',
      offlineMode: 'ऑफ़लाइन मोड सक्रिय',
      onlineMode: 'डीप स्पेस नेटवर्क से जुड़ा है',
      speed: 'सिमुलेशन गति',
      resetCamera: 'कैमरा रीसेट',
      details: 'वैज्ञानिक विवरण',
      diameter: 'व्यास',
      mass: 'द्रव्यमान',
      distance: 'सूर्य से दूरी',
      gravity: 'सतही गुरुत्वाकर्षण',
      temperature: 'औसत तापमान',
      moons: 'पुष्ट चंद्रमा',
      atmosphere: 'वायुमंडलीय संघटन',
      back: 'वापस जाएँ',
      compare: 'तुलना करें',
      askCosmosAi: 'जेमिनी AI से पूछें',
      citations: 'पुष्ट वैज्ञानिक संदर्भ',
      exportPdf: 'शोध रिपोर्ट निर्यात करें',
      exportJson: 'डेटा निर्यात करें (JSON)',
    },
  },
};
