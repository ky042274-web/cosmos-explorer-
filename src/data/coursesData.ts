export interface QuizQuestion {
  id: string;
  topic: string;
  question: string;
  hindiQuestion?: string;
  options: string[];
  hindiOptions?: string[];
  answerIndex: number;
  explanation: string;
  hindiExplanation?: string;
}

export interface Flashcard {
  id: string;
  term: string;
  hindiTerm: string;
  category: string;
  definition: string;
  hindiDefinition: string;
  formulaOrFact?: string;
}

export interface AstronomyCourse {
  id: string;
  title: string;
  hindiTitle: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  modulesCount: number;
  description: string;
  hindiDescription: string;
  topics: string[];
}

export const ASTRONOMY_COURSES: AstronomyCourse[] = [
  {
    id: 'course-1',
    title: 'Foundations of Planetary Science',
    hindiTitle: 'ग्रह विज्ञान के मूल सिद्धांत',
    level: 'Beginner',
    duration: '4 Modules (1.5 Hours)',
    modulesCount: 4,
    description: 'Master the geology, orbital mechanics, atmospheres, and magnetic fields of terrestrial worlds and gas giants in our Solar System.',
    hindiDescription: 'सौर मंडल के ग्रहों, उनकी बनावट, वायुमंडल और परिक्रमा की गति के बारे में संपूर्ण परिचय।',
    topics: ['Planetesimal Accretion', 'Atmospheric Greenhouse Effect', 'Tidal Heating in Icy Moons', 'Asteroids & Kuiper Belt'],
  },
  {
    id: 'course-2',
    title: 'Stellar Astrophysics & Nucleosynthesis',
    hindiTitle: 'तारकीय खगोल भौतिकी एवं नाभिकीय संलयन',
    level: 'Intermediate',
    duration: '5 Modules (2.5 Hours)',
    modulesCount: 5,
    description: 'Explore the life cycle of stars, from molecular cloud collapse to main-sequence hydrogen burning, Chandrasekhar mass limits, and supernova explosions.',
    hindiDescription: 'तारों का जन्म, जीवन चक्र, संलयन प्रक्रिया और सुपरनोवा विस्फोट की भौतिकी।',
    topics: ['Hertzsprung-Russell Diagram', 'Proton-Proton Chain & CNO Cycle', 'Degeneracy Pressure', 'Neutron Stars & Pulsars'],
  },
  {
    id: 'course-3',
    title: 'General Relativity & Black Hole Physics',
    hindiTitle: 'सामान्य सापेक्षता और ब्लैक होल भौतिकी',
    level: 'Advanced',
    duration: '6 Modules (3.5 Hours)',
    modulesCount: 6,
    description: 'Mathematical and conceptual exploration of curved spacetime, the Schwarzschild metric, Kerr rotating black holes, gravitational lensing, and Hawking radiation.',
    hindiDescription: 'आइंस्टीन का सापेक्षता सिद्धांत, स्पेसटाइम वक्रता, इवेंट होराइजन और गुरुत्वाकर्षण तरंगें।',
    topics: ['Schwarzschild Metric & Event Horizon', 'Kerr Metric & Ergosphere', 'Gravitational Lensing', 'LIGO Waveform Analysis'],
  },
  {
    id: 'course-4',
    title: 'Exoplanets & The Search for Extraterrestrial Life',
    hindiTitle: 'बहिर्ग्रह एवं ब्रह्मांड में जीवन की खोज',
    level: 'Intermediate',
    duration: '4 Modules (2 Hours)',
    modulesCount: 4,
    description: 'Techniques for detecting exoplanets (transits, radial velocities), planetary atmospheres, habitable zones, and biosignature gases.',
    hindiDescription: 'दूरस्थ तारों के ग्रहों की खोज तकनीक, जीवन योग्य क्षेत्र और वायुमंडलीय विश्लेषण।',
    topics: ['Transit Photometry & Light Curves', 'Spectroscopic Transmission', 'Habitable Zone Thermodynamics', 'Biosignatures vs Technosignatures'],
  },
];

export const FLASHCARDS_DATA: Flashcard[] = [
  {
    id: 'fc-1',
    term: 'Astronomical Unit (AU)',
    hindiTerm: 'खगोलीय इकाई (AU)',
    category: 'Units & Distances',
    definition: 'The mean distance from the center of the Earth to the center of the Sun, defined internationally as exactly 149,597,870,700 meters (~149.6 million km).',
    hindiDefinition: 'पृथ्वी और सूर्य के बीच की औसत दूरी, जो लगभग 14.96 करोड़ किलोमीटर के बराबर होती है।',
    formulaOrFact: '1 AU ≈ 8.317 light-minutes ≈ 499 light-seconds',
  },
  {
    id: 'fc-2',
    term: 'Light-Year (ly)',
    hindiTerm: 'प्रकाश वर्ष (ly)',
    category: 'Units & Distances',
    definition: 'The distance that electromagnetic radiation (light) travels in a vacuum in one Julian year (365.25 days).',
    hindiDefinition: 'प्रकाश द्वारा एक वर्ष में तय की गई दूरी (~9.46 ट्रिलियन किमी)।',
    formulaOrFact: '1 ly = c × 1 yr ≈ 9.461 × 10¹² km ≈ 63,241 AU',
  },
  {
    id: 'fc-3',
    term: 'Schwarzschild Radius (rs)',
    hindiTerm: 'श्वार्ज़शिल्ड त्रिज्या',
    category: 'Relativity & Black Holes',
    definition: 'The radius of the event horizon for a non-rotating spherically symmetric mass, within which escape velocity equals or exceeds the speed of light.',
    hindiDefinition: 'किसी पिंड के ब्लैक होल बनने की सीमांत त्रिज्या जिसके भीतर से प्रकाश भी नहीं बच सकता।',
    formulaOrFact: 'rs = 2GM / c² (For Earth, rs ≈ 9 mm; for Sun, rs ≈ 3 km)',
  },
  {
    id: 'fc-4',
    term: 'Hohmann Transfer Orbit',
    hindiTerm: 'होहमैन स्थानांतरण कक्षा',
    category: 'Orbital Mechanics & Rockets',
    definition: 'An elliptical orbit used to transfer a spacecraft between two circular orbits of different radii in the same plane using two impulsive engine burns.',
    hindiDefinition: 'दो ग्रहों के बीच अंतरिक्ष यान भेजने के लिए न्यूनतम ईंधन खर्च करने वाला अण्डाकार मार्ग।',
    formulaOrFact: 'Δv_total = Δv₁ + Δv₂ (Most fuel-efficient two-impulse trajectory)',
  },
  {
    id: 'fc-5',
    term: 'Chandrasekhar Limit',
    hindiTerm: 'चंद्रशेखर सीमा',
    category: 'Stellar Astrophysics',
    definition: 'The maximum mass of a stable white dwarf star supported by electron degeneracy pressure. If exceeded, the star collapses into a neutron star or black hole.',
    hindiDefinition: 'एक स्थिर सफेद बौने तारे का अधिकतम संभावित द्रव्यमान (लगभग 1.44 सौर द्रव्यमान)।',
    formulaOrFact: 'M_Ch ≈ 1.44 Solar Masses (Discovered by Subrahmanyan Chandrasekhar)',
  },
  {
    id: 'fc-6',
    term: 'Lagrange Points (L1 – L5)',
    hindiTerm: 'लैग्रेंज बिंदु',
    category: 'Celestial Mechanics',
    definition: 'Equilibrium positions in space where the gravitational forces of two large bodies (like Sun and Earth) equal the centrifugal force required to move with them.',
    hindiDefinition: 'अंतरिक्ष के वे स्थिर बिंदु जहाँ दो विशाल पिंडों का गुरुत्वाकर्षण खिंचाव संतुलन में रहता है।',
    formulaOrFact: 'L1: Solar monitoring (Aditya-L1, SOHO); L2: Deep space astronomy (JWST, Gaia)',
  },
];

export const STANDARD_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'sq-1',
    topic: 'Solar System',
    question: 'Why is Venus hotter than Mercury, even though Mercury is much closer to the Sun?',
    hindiQuestion: 'बुध ग्रह की तुलना में शुक्र ग्रह अधिक गर्म क्यों है, जबकि बुध सूर्य के अधिक निकट है?',
    options: [
      'Venus has a runaway greenhouse effect driven by a 96% CO₂ atmosphere',
      'Venus has internal radioactive core heating twice that of Mercury',
      'Mercury has an ice sheet that reflects 90% of solar radiation',
      'Venus generates its own thermal energy via nuclear fission',
    ],
    answerIndex: 0,
    explanation: 'Venus has an extreme runaway greenhouse effect. Its atmosphere is 96.5% carbon dioxide and 92 times denser than Earth’s, trapping infrared radiation and raising surface temperature to 465°C.',
  },
  {
    id: 'sq-2',
    topic: 'Stellar Physics',
    question: 'What fundamental quantum principle prevents a white dwarf star from collapsing under its own gravity?',
    hindiQuestion: 'क्वांटम भौतिकी का कौन सा नियम सफेद बौने तारे को अपने ही गुरुत्वाकर्षण से ढहने से रोकता है?',
    options: [
      'Heisenberg Uncertainty Principle',
      'Electron Degeneracy Pressure (Pauli Exclusion Principle)',
      'Neutron Degeneracy Pressure',
      'Coulomb Electrostatic Repulsion',
    ],
    answerIndex: 1,
    explanation: 'Electron degeneracy pressure, derived from the Pauli Exclusion Principle which forbids identical fermions (electrons) from occupying the same quantum state, provides the outward pressure opposing gravity.',
  },
  {
    id: 'sq-3',
    topic: 'Black Holes',
    question: 'What is the name of the supermassive black hole located at the center of the Milky Way galaxy?',
    hindiQuestion: 'हमारी आकाशगंगा (मिल्की वे) के केंद्र में स्थित विशालकाय ब्लैक होल का क्या नाम है?',
    options: ['Cygnus X-1', 'Messier 87*', 'Sagittarius A*', 'Gargantua'],
    answerIndex: 2,
    explanation: 'Sagittarius A* (pronounced Sagittarius A-star) is the supermassive black hole at the Galactic Center, with a mass of roughly 4.15 million solar masses.',
  },
  {
    id: 'sq-4',
    topic: 'Space Exploration',
    question: 'Which lunar mission achieved the first successful soft landing near the challenging South Polar region of the Moon?',
    hindiQuestion: 'चंद्रमा के दक्षिणी ध्रुवीय क्षेत्र के निकट पहली बार सफल सॉफ्ट लैंडिंग किस मिशन ने की?',
    options: ['Apollo 17', 'Chang’e 4', 'Chandrayaan-3', 'Luna 25'],
    answerIndex: 2,
    explanation: 'ISRO’s Chandrayaan-3 achieved historic touchdown near the lunar South Pole on August 23, 2023, deploying the Pragyan rover to analyze polar soil composition.',
  },
  {
    id: 'sq-5',
    topic: 'Cosmology',
    question: 'What is the approximate temperature of the Cosmic Microwave Background (CMB) radiation measured today?',
    hindiQuestion: 'आज मापे जाने वाले कॉस्मिक माइक्रोवेव बैकग्राउंड (CMB) विकिरण का तापमान लगभग कितना है?',
    options: ['0.00 Kelvin', '2.73 Kelvin (-270.4°C)', '77 Kelvin', '273 Kelvin (0°C)'],
    answerIndex: 1,
    explanation: 'The Cosmic Microwave Background has cooled as the universe expanded from ~3,000 Kelvin at recombination to an almost perfectly isotropic blackbody temperature of 2.7255 Kelvin today.',
  },
];
