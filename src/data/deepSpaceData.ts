export interface DeepSpaceObject {
  id: string;
  name: string;
  type: 'black-hole' | 'nebula' | 'galaxy' | 'star';
  constellation: string;
  distanceLightYears: string;
  apparentMagnitude?: number;
  description: string;
  hindiDescription: string;
  keyFacts: string[];
  image: string;
  scientificClassification: string;
}

export const DEEP_SPACE_OBJECTS: DeepSpaceObject[] = [
  {
    id: 'sagittarius-a-star',
    name: 'Sagittarius A* (Sgr A*)',
    type: 'black-hole',
    constellation: 'Sagittarius',
    distanceLightYears: '26,673 ly (Center of Milky Way)',
    scientificClassification: 'Supermassive Black Hole (SMBH)',
    description: 'The supermassive black hole anchoring the dynamical center of the Milky Way galaxy. Contains approximately 4.15 million solar masses compressed inside a region smaller than Mercury’s orbit.',
    hindiDescription: 'हमारी आकाशगंगा (मिल्की वे) के केंद्र में स्थित विशालकाय ब्लैक होल, जिसका द्रव्यमान सूर्य से लगभग 41.5 लाख गुना अधिक है।',
    keyFacts: [
      'Schwarzschild Radius: ~12.2 million km (~0.08 AU)',
      'Imaged directly by the Event Horizon Telescope (EHT) in 2022',
      'Stars in the central cluster (like S2) orbit at speeds up to 7,700 km/s (2.5% speed of light)',
    ],
    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'm87-star',
    name: 'Messier 87* (M87*)',
    type: 'black-hole',
    constellation: 'Virgo',
    distanceLightYears: '53.5 million ly',
    scientificClassification: 'Supermassive Black Hole with Relativistic Jet',
    description: 'The colossal supermassive black hole at the center of the giant elliptical galaxy M87, weighing 6.5 billion solar masses. It launched the first direct photographic image of an event horizon shadow in human history in 2019.',
    hindiDescription: 'विशाल दीर्घवृत्ताकार आकाशगंगा M87 के केंद्र में स्थित 6.5 अरब सौर द्रव्यमान वाला महाविशाल ब्लैक होल।',
    keyFacts: [
      'Event horizon shadow diameter: 40 billion km (larger than our entire Solar System)',
      'Launches a relativistic jet of plasma spanning over 5,000 light-years',
      'Rotates at near the theoretical maximum Kerr spin parameter',
    ],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'pillars-of-creation',
    name: 'Pillars of Creation (Eagle Nebula / M16)',
    type: 'nebula',
    constellation: 'Serpens',
    distanceLightYears: '6,500 ly',
    apparentMagnitude: 6.0,
    scientificClassification: 'Diffuse H II Emission Nebula & Star-Forming Region',
    description: 'Spectacular elephant trunks of interstellar dust and hydrogen gas within the Eagle Nebula. Towering several light-years tall, these pillars act as stellar nurseries where nascent protostars are born.',
    hindiDescription: 'चील नीहारिका (Eagle Nebula) में गैस और धूल के विशाल खंभे, जहाँ नए तारों का जन्म होता है।',
    keyFacts: [
      'Tallest pillar measures approximately 4 light-years from base to tip',
      'Evaporating Gaseous Globules (EGGs) shield embryonic stars from ionizing ultraviolet radiation',
      'Multi-wavelength observations by Hubble and JWST reveal interior infant star clusters',
    ],
    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'andromeda-galaxy',
    name: 'Andromeda Galaxy (M31)',
    type: 'galaxy',
    constellation: 'Andromeda',
    distanceLightYears: '2.537 million ly',
    apparentMagnitude: 3.44,
    scientificClassification: 'Barred Spiral Galaxy (SA(s)b)',
    description: 'The nearest major spiral galaxy to our Milky Way and the largest member of our Local Group. Spanning roughly 220,000 light-years across and containing roughly one trillion stars.',
    hindiDescription: 'हमारी आकाशगंगा की सबसे निकटतम विशाल सर्पिल आकाशगंगा, जो लगभग 4.5 अरब वर्षों में हमारी आकाशगंगा से टकराकर विलीन हो जाएगी।',
    keyFacts: [
      'Moving toward the Milky Way at ~110 km/s in a collision trajectory in 4.5 billion years',
      'Contains over 400 globular clusters, including Mayall II (G1)',
      'Hosts a supermassive black hole of 100–230 million solar masses at its nucleus',
    ],
    image: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'james-webb-deep-field',
    name: 'Webb’s First Deep Field (SMACS 0723)',
    type: 'galaxy',
    constellation: 'Volans',
    distanceLightYears: '4.6 billion ly (cluster) to >13.4 billion ly (background)',
    scientificClassification: 'Massive Galaxy Cluster Gravitational Lens',
    description: 'The deepest and sharpest infrared view of the early universe ever obtained. The massive foreground cluster SMACS 0723 acts as a cosmic gravitational magnifying glass, warping and lensing background galaxies that existed just a few hundred million years after the Big Bang.',
    hindiDescription: 'जेम्स वेब टेलीस्कोप का पहला डीप फील्ड, जिसने 13.4 अरब साल पुराने ब्रह्मांड की सबसे प्राचीन आकाशगंगाओं को गुरुत्वाकर्षण लेंसिंग द्वारा प्रकट किया।',
    keyFacts: [
      'Covering a patch of sky approximately the size of a grain of sand held at arm’s length',
      'Gravitational lensing arcs demonstrate Einstein’s General Theory of Relativity',
      'Identified SPARKY and GLASS-z12 high-redshift primordial galaxies',
    ],
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'betelgeuse',
    name: 'Betelgeuse (Alpha Orionis)',
    type: 'star',
    constellation: 'Orion',
    distanceLightYears: '642 ly',
    apparentMagnitude: 0.5,
    scientificClassification: 'Red Supergiant Star (M1-2 Ia-ab)',
    description: 'A semiregular variable red supergiant star marking Orion’s right shoulder. If placed at the center of our Solar System, its pulsating photosphere would engulf Mercury, Venus, Earth, Mars, and potentially Jupiter.',
    hindiDescription: 'ओरियन नक्षत्र का प्रसिद्ध लाल अति-विशालकाय तारा, जो जीवन के अंतिम पड़ाव में है और किसी भी समय सुपरनोवा बनकर फट सकता है।',
    keyFacts: [
      'Diameter is ~760 to 1,000 times that of the Sun',
      'Expected to explode in a Type II core-collapse supernova within the next 100,000 years',
      'Experienced the "Great Dimming" in 2019-2020 due to a massive surface mass ejection of dust',
    ],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
  },
];
