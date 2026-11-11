export interface TimelineEpoch {
  era: string;
  timeFromBigBang: string;
  yearsAgo: string;
  title: string;
  hindiTitle: string;
  description: string;
  hindiDescription: string;
  icon: string;
  temperature: string;
  physicalProcess: string;
}

export const COSMIC_TIMELINE: TimelineEpoch[] = [
  {
    era: 'Planck Epoch',
    timeFromBigBang: '0 to 10⁻⁴³ seconds',
    yearsAgo: '13.8 billion years ago',
    title: 'The Planck Epoch & Quantum Gravity',
    hindiTitle: 'प्लैंक युग और क्वांटम गुरुत्वाकर्षण',
    description: 'All four fundamental forces (gravitation, strong nuclear, weak nuclear, and electromagnetism) were unified into a single primordial superforce at unimaginable energy densities (>10¹⁹ GeV).',
    hindiDescription: 'ब्रह्मांड की उत्पत्ति का पहला क्षण जब प्रकृति के सभी चार बल एक साथ एकीकृत थे।',
    icon: 'Sparkles',
    temperature: '> 10³² Kelvin',
    physicalProcess: 'Quantum fluctuations before spacetime established classical geometry',
  },
  {
    era: 'Inflationary Epoch',
    timeFromBigBang: '10⁻³⁶ to 10⁻³² seconds',
    yearsAgo: '13.8 billion years ago',
    title: 'Cosmic Inflation',
    hindiTitle: 'कॉस्मिक इन्फ्लेशन (तीव्र विस्तार)',
    description: 'An exponential vacuum energy expansion expanded the metric of spacetime by a factor of at least 10²⁶ in a tiny fraction of a second, smoothing cosmic curvature and seeding galaxy formation from quantum fluctuations.',
    hindiDescription: 'एक सेकंड के खरबवें हिस्से में अंतरिक्ष का आकार घातीय गति से बढ़ा।',
    icon: 'Maximize2',
    temperature: '10²⁷ Kelvin',
    physicalProcess: 'Inflaton scalar field decay into a hot thermal soup of quarks and gluons (Reheating)',
  },
  {
    era: 'Big Bang Nucleosynthesis',
    timeFromBigBang: '10 seconds to 20 minutes',
    yearsAgo: '13.8 billion years ago',
    title: 'Primordial Nucleosynthesis',
    hindiTitle: 'मूलभूत नाभिकीय संलयन',
    description: 'Temperatures cooled enough for protons and neutrons to fuse into the first atomic nuclei: ~75% Hydrogen, ~25% Helium-4, and trace amounts of Deuterium, Helium-3, and Lithium-7.',
    hindiDescription: 'प्रोटॉन और न्यूट्रॉन जुड़कर ब्रह्मांड के पहले तत्व (हाइड्रोजन और हीलियम) बने।',
    icon: 'Atom',
    temperature: '10⁹ to 10⁷ Kelvin',
    physicalProcess: 'Light element fusion fixing cosmic baryon abundance ratio',
  },
  {
    era: 'Recombination & CMB',
    timeFromBigBang: '380,000 years',
    yearsAgo: '13.799 billion years ago',
    title: 'Cosmic Microwave Background (CMB)',
    hindiTitle: 'कॉस्मिक माइक्रोवेव बैकग्राउंड और पुनर्संयोजन',
    description: 'Electrons bound with protons to form neutral hydrogen atoms. The universe transitioned from opaque plasma to transparent, releasing photons that we detect today as the 2.725 K Cosmic Microwave Background.',
    hindiDescription: 'ब्रह्मांड पारदर्शी हो गया और पहला प्रकाश मुक्त हुआ जो आज CMB विकिरण के रूप में दिखाई देता है।',
    icon: 'Radio',
    temperature: '3,000 Kelvin',
    physicalProcess: 'Photon decoupling and surface of last scattering',
  },
  {
    era: 'Cosmic Dawn & First Stars',
    timeFromBigBang: '100 – 250 million years',
    yearsAgo: '13.6 billion years ago',
    title: 'Population III Stars & Reionization',
    hindiTitle: 'पहले तारे और पुनरायनन युग',
    description: 'Gravity pulled primordial gas clouds into the first colossal, metal-free Population III stars (100–300 solar masses), whose high-energy ultraviolet radiation ended the Cosmic Dark Ages and reionized the intergalactic medium.',
    hindiDescription: 'ब्रह्मांड के सबसे पहले विशालकाय तारों का जन्म हुआ जिन्होंने पहले अंधकार युग को समाप्त किया।',
    icon: 'Sun',
    temperature: '60 Kelvin',
    physicalProcess: 'Stellar nucleosynthesis synthesizing the first Carbon, Oxygen, and Iron',
  },
  {
    era: 'Formation of the Solar System',
    timeFromBigBang: '9.2 billion years',
    yearsAgo: '4.6 billion years ago',
    title: 'Birth of the Sun and Planets',
    hindiTitle: 'सौर मंडल और पृथ्वी की उत्पत्ति',
    description: 'Gravitational collapse of a giant interstellar molecular cloud (solar nebula), enriched by previous supernova ejecta, formed our Sun at the center and an accretion disk that condensed into the eight planets, moons, and asteroids.',
    hindiDescription: 'अंतरिक्षीय धूल और गैस के घूर्णन से सूर्य और सभी आठ ग्रहों का निर्माण हुआ।',
    icon: 'Globe',
    temperature: 'Solar System equilibrium',
    physicalProcess: 'Planetesimal accretion and differentiation into core-mantle-crust structures',
  },
  {
    era: 'Origin of Life on Earth',
    timeFromBigBang: '10.0 billion years',
    yearsAgo: '3.8 billion years ago',
    title: 'Abiogenesis & Cellular Life',
    hindiTitle: 'पृथ्वी पर जीवन का उद्भव',
    description: 'First single-celled anaerobic prokaryotes and cyanobacteria emerged in hydrothermal vents or oceanic lagoons, eventually inventing oxygenic photosynthesis which transformed Earth’s atmosphere (Great Oxidation Event).',
    hindiDescription: 'पृथ्वी के महासागरों में पहले सूक्ष्मजीवों का प्रादुर्भाव हुआ।',
    icon: 'Dna',
    temperature: 'Moderate terrestrial oceans',
    physicalProcess: 'Biological evolution shaping biogeochemical cycles',
  },
  {
    era: 'Present Day & Space Age',
    timeFromBigBang: '13.8 billion years',
    yearsAgo: 'Today',
    title: 'The Era of Human Cosmic Exploration',
    hindiTitle: 'वर्तमान युग और अंतरिक्ष अनुसंधान',
    description: 'A conscious species on planet Earth decodes general relativity and quantum mechanics, builds space telescopes like JWST, sends robotic probes past Pluto and into interstellar space, and pioneers planetary science.',
    hindiDescription: 'मानव द्वारा अंतरिक्ष अन्वेषण, दूरबीनों और कृत्रिम बुद्धिमत्ता की मदद से ब्रह्मांड के रहस्यों की खोज।',
    icon: 'Rocket',
    temperature: '2.725 Kelvin (CMB background)',
    physicalProcess: 'Anthropogenic space exploration and artificial intelligence',
  },
  {
    era: 'Far Future (10¹⁴ years)',
    timeFromBigBang: 'Trillions of years',
    yearsAgo: 'Future',
    title: 'The Degenerate & Black Hole Eras',
    hindiTitle: 'सुदूर भविष्य: ब्लैक होल युग',
    description: 'Star formation ceases as fuel is exhausted. Galaxies dissolve, red dwarfs fade into black dwarfs, and eventually only stellar remnants and supermassive black holes remain, which slowly evaporate via quantum Hawking radiation.',
    hindiDescription: 'सभी तारे समाप्त हो जाएँगे और केवल ब्लैक होल शेष रहेंगे जो हॉकिंग विकिरण द्वारा धीरे-धीरे लुप्त होंगे।',
    icon: 'Moon',
    temperature: 'Approaching Absolute Zero',
    physicalProcess: 'Proton decay, black hole evaporation, and ultimate thermodynamic Heat Death',
  },
];
