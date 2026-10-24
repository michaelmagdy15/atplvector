import { QCode, LightSignal, AirspaceData, AirspaceClass, IcaoAnnexDef, FreedomOfAirDef, MelIntervalDef, AwoMinimaDef, DeicingHoldoverDef } from '../types';

export const qCodes: QCode[] = [
  { code: 'QDM', meaning: 'Magnetic to station' },
  { code: 'QDR', meaning: 'Magnetic from station' },
  { code: 'QUJ', meaning: 'True track to station' },
  { code: 'QTE', meaning: 'True track from station' },
  { code: 'QNH', meaning: 'Altitude (Obtain Elevation - Sea Level Pressure)' },
  { code: 'QFE', meaning: 'Height (At Elevation/Runway Threshold)' },
];

export const urgencyCategories = [
  { name: 'Distress (SS)', call: 'MAYDAY', meaning: 'Serious/Imminent Danger, require immediate assistance' },
  { name: 'Urgency (DD)', call: 'PAN-PAN', meaning: 'Safety concern but no immediate danger' },
  { name: 'Safety (FF)', call: 'SECURITE', meaning: 'Flight Safety messages' },
  { name: 'Meteorological (GG)', call: '-', meaning: 'Met reports, forecasts' },
  { name: 'Regularity (KK)', call: '-', meaning: 'Flight regularity' },
];

export const lightSignals: LightSignal[] = [
  { id: '1', color: 'green', pattern: 'steady', context: 'ground', meaning: 'Cleared for takeoff' },
  { id: '2', color: 'green', pattern: 'steady', context: 'air', meaning: 'Cleared to land' },
  { id: '3', color: 'red', pattern: 'steady', context: 'ground', meaning: 'Stop' },
  { id: '4', color: 'red', pattern: 'steady', context: 'air', meaning: 'Give way to other aircraft and continue circling' },
  { id: '5', color: 'green', pattern: 'flash', context: 'ground', meaning: 'Cleared to taxi' },
  { id: '6', color: 'green', pattern: 'flash', context: 'air', meaning: 'Return for landing' },
  { id: '7', color: 'red', pattern: 'flash', context: 'ground', meaning: 'Taxi clear of landing area in use' },
  { id: '8', color: 'red', pattern: 'flash', context: 'air', meaning: 'Aerodrome unsafe - DO NOT LAND' },
  { id: '9', color: 'white', pattern: 'flash', context: 'ground', meaning: 'Return to starting point on the aerodrome' },
  { id: '10', color: 'white', pattern: 'flash', context: 'air', meaning: 'N/A (Not used in air usually)' },
];

export const readabilityScale = [
  { level: 1, desc: 'Unreadable' },
  { level: 2, desc: 'Readable now and then' },
  { level: 3, desc: 'Readable but with difficulty' },
  { level: 4, desc: 'Readable' },
  { level: 5, desc: 'Perfectly readable' },
];

export const vhfSpectrum = [
    { band: 'VLF', range: '3 - 30 kHz', wave: 'Very Long', dist: '100km - 10km' },
    { band: 'LF', range: '30 - 300 kHz', wave: 'Long', dist: '10km - 1km' },
    { band: 'MF', range: '300 - 3000 kHz', wave: 'Medium', dist: '1km - 100m' },
    { band: 'HF', range: '3 - 30 MHz', wave: 'Short', dist: '100m - 10m' },
    { band: 'VHF', range: '30 - 300 MHz', wave: 'Short', dist: '10m - 1m' },
];

export const phoneticAlphabet = [
  { char: 'A', word: 'Alpha' }, { char: 'B', word: 'Bravo' }, { char: 'C', word: 'Charlie' },
  { char: 'D', word: 'Delta' }, { char: 'E', word: 'Echo' }, { char: 'F', word: 'Foxtrot' },
  { char: 'G', word: 'Golf' }, { char: 'H', word: 'Hotel' }, { char: 'I', word: 'India' },
  { char: 'J', word: 'Juliet' }, { char: 'K', word: 'Kilo' }, { char: 'L', word: 'Lima' },
  { char: 'M', word: 'Mike' }, { char: 'N', word: 'November' }, { char: 'O', word: 'Oscar' },
  { char: 'P', word: 'Papa' }, { char: 'Q', word: 'Quebec' }, { char: 'R', word: 'Romeo' },
  { char: 'S', word: 'Sierra' }, { char: 'T', word: 'Tango' }, { char: 'U', word: 'Uniform' },
  { char: 'V', word: 'Victor' }, { char: 'W', word: 'Whiskey' }, { char: 'X', word: 'X-ray' },
  { char: 'Y', word: 'Yankee' }, { char: 'Z', word: 'Zulu' }
];

export const morseCode = [
  { char: 'A', code: '.-' }, { char: 'B', code: '-...' }, { char: 'C', code: '-.-.' },
  { char: 'D', code: '-..' }, { char: 'E', code: '.' }, { char: 'F', code: '..-.' },
  { char: 'G', code: '--.' }, { char: 'H', code: '....' }, { char: 'I', code: '..' },
  { char: 'J', code: '.---' }, { char: 'K', code: '-.-' }, { char: 'L', code: '.-..' },
  { char: 'M', code: '--' }, { char: 'N', code: '-.' }, { char: 'O', code: '---' },
  { char: 'P', code: '.--.' }, { char: 'Q', code: '--.-' }, { char: 'R', code: '.-.' },
  { char: 'S', code: '...' }, { char: 'T', code: '-' }, { char: 'U', code: '..-' },
  { char: 'V', code: '...-' }, { char: 'W', code: '.--' }, { char: 'X', code: '-..-' },
  { char: 'Y', code: '-.--' }, { char: 'Z', code: '--..' }
];

// EASA Specific Codes
export const transponderCodes = [
  { code: '7700', meaning: 'Emergency (Distress)' },
  { code: '7600', meaning: 'Radio Failure' },
  { code: '7500', meaning: 'Hijack / Unlawful Interference' },
  { code: '2000', meaning: 'IFR / Oceanic Standard' },
  { code: '7000', meaning: 'VFR Standard (EASA)' },
  { code: '0000', meaning: 'Mode C / Mode S Testing' }
];

export const standardWords = [
  { word: 'WILCO', meaning: 'I understand your message and will comply with it.' },
  { word: 'ROGER', meaning: 'I have received all of your last transmission.' },
  { word: 'AFFIRM', meaning: 'Yes.' },
  { word: 'NEGATIVE', meaning: 'No.' },
  { word: 'STANDBY', meaning: 'Wait and I will call you.' },
  { word: 'ACKNOWLEDGE', meaning: 'Let me know that you have received and understood this message.' },
  { word: 'CORRECTION', meaning: 'An error has been made in this transmission, the correct version is...' },
  { word: 'MONITOR', meaning: 'Listen out on (frequency).' },
];

export const easaAirspace = [
  { class: 'A', vfr: false, separation: 'All aircraft (IFR from IFR)', radio: 'Required', clearance: 'Required', speed: 'Not applicable (IFR only)', notes: 'IFR only. VFR strictly prohibited.' },
  { class: 'B', vfr: true, separation: 'All aircraft from all aircraft', radio: 'Required', clearance: 'Required', speed: '250 kt IAS below FL 100', notes: 'ATC separates IFR from IFR, IFR from VFR, and VFR from VFR. Rare in Europe.' },
  { class: 'C', vfr: true, separation: 'IFR from IFR & VFR; VFR from IFR', radio: 'Required', clearance: 'Required', speed: '250 kt IAS below FL 100', notes: 'VFR separated from IFR. VFR receives traffic info regarding other VFR (NO VFR-VFR separation).' },
  { class: 'D', vfr: true, separation: 'IFR from IFR only', radio: 'Required', clearance: 'Required', speed: '250 kt IAS below FL 100', notes: 'IFR separated from IFR only. Traffic information given to all regarding VFR.' },
  { class: 'E', vfr: true, separation: 'IFR from IFR only', radio: 'Required for IFR', clearance: 'Required for IFR', speed: '250 kt IAS below FL 100', notes: 'Controlled for IFR; uncontrolled for VFR. VFR needs no clearance or radio in standard ICAO.' },
  { class: 'F', vfr: true, separation: 'IFR from IFR advisory', radio: 'Continuous two-way for IFR', clearance: 'Not required', speed: '250 kt IAS below FL 100', notes: 'Advisory airspace. Air traffic advisory service for IFR.' },
  { class: 'G', vfr: true, separation: 'None', radio: 'Not required', clearance: 'Not required', speed: '250 kt IAS below FL 100', notes: 'Uncontrolled airspace. Flight Information Service (FIS) provided on request.' },
];

export const interceptSignals = [
  { id: 1, signal: "Rocking wings", meaning: "Follow me" },
  { id: 2, signal: "Abrupt break-away (diverging)", meaning: "You may proceed" },
  { id: 3, signal: "Circling aerodrome", meaning: "Land at this aerodrome" },
  { id: 4, signal: "Raising landing gear (while overflying runway)", meaning: "Aerodrome inadequate" },
  { id: 5, signal: "Flashing all lights", meaning: "Distress / Compliance" }
];

export const VFR_RULES = [
  "Visual Meteorological Conditions (VMC) minima apply.",
  "At or below FL 195 (unless authorized).",
  "Transonic/Supersonic speed prohibited.",
  "Above FL 290: RVSM separation applies if authorized.",
  "Prohibited in Class A airspace.",
  "Traffic avoidance is pilot's responsibility (See & Avoid)."
];

export const IFR_RULES = [
  "Instrument Meteorological Conditions (IMC) allowed.",
  "Must carry appropriate instruments & navigation equipment.",
  "Flight Plan mandatory for Controlled Airspace.",
  "Adherence to ATC Clearances is mandatory.",
  "Cruising levels: Semi-Circular Rule (East Odd, West Even).",
  "Minimum Obstacle Clearance required (1000ft / 2000ft mountainous)."
];

export const AIRSPACE_DATA: AirspaceData[] = [
  { 
    class: AirspaceClass.A, 
    type: 'Controlled', 
    separation: 'All aircraft (IFR from IFR)', 
    vfrAllowed: false, 
    radioReq: true, 
    clearanceReq: true, 
    speedLimit: 'Not applicable (IFR only)',
    vmcMinima: 'VFR Prohibited',
    rtfqTrap: 'TRAP: Questions asking if SVFR is allowed in Class A — SVFR is VFR, so SVFR is NEVER permitted in Class A airspace!',
    separationDetails: {
      ifrFromIfr: 'Positive ATC separation provided',
      ifrFromVfr: 'VFR not permitted',
      vfrFromIfr: 'VFR not permitted',
      vfrFromVfr: 'VFR not permitted'
    },
    notes: 'High altitude, upper airways (typically above FL 195/FL 245), major TMA cores. IFR Only.' 
  },
  { 
    class: AirspaceClass.B, 
    type: 'Controlled', 
    separation: 'All aircraft from all aircraft', 
    vfrAllowed: true, 
    radioReq: true, 
    clearanceReq: true, 
    speedLimit: '250 kt IAS below FL 100',
    vmcMinima: 'At/above FL 100: 8 km vis, 1,500 m horiz / 1,000 ft vert from cloud. Below FL 100: 5 km vis, 1,500 m / 1,000 ft.',
    rtfqTrap: 'TRAP: Class B is the ONLY class where ATC separates VFR from other VFR! Extremely rare in Europe, common in USA.',
    separationDetails: {
      ifrFromIfr: 'Separated',
      ifrFromVfr: 'Separated',
      vfrFromIfr: 'Separated',
      vfrFromVfr: 'Separated'
    },
    notes: 'ATC separates every aircraft from every other aircraft. Rare in Europe.' 
  },
  { 
    class: AirspaceClass.C, 
    type: 'Controlled', 
    separation: 'IFR from IFR & VFR; VFR from IFR only', 
    vfrAllowed: true, 
    radioReq: true, 
    clearanceReq: true, 
    speedLimit: '250 kt IAS below FL 100 (unless authorized by ATC for IFR)',
    vmcMinima: 'At/above FL 100: 8 km vis, 1,500 m horiz / 1,000 ft vert from cloud. Below FL 100: 5 km vis, 1,500 m / 1,000 ft.',
    rtfqTrap: 'TRAP: In Class C, VFR is separated from IFR, but NOT from other VFR! VFR receives traffic info regarding VFR.',
    separationDetails: {
      ifrFromIfr: 'Separated',
      ifrFromVfr: 'Separated',
      vfrFromIfr: 'Separated',
      vfrFromVfr: 'Traffic information only (NO separation)'
    },
    notes: 'Standard for busy terminal control areas (TMA) and CTRs. VFR separated from IFR but not other VFR.' 
  },
  { 
    class: AirspaceClass.D, 
    type: 'Controlled', 
    separation: 'IFR from IFR only', 
    vfrAllowed: true, 
    radioReq: true, 
    clearanceReq: true, 
    speedLimit: '250 kt IAS below FL 100',
    vmcMinima: 'At/above FL 100: 8 km vis, 1,500 m horiz / 1,000 ft vert. Below FL 100: 5 km vis, 1,500 m / 1,000 ft.',
    rtfqTrap: 'TRAP: In Class D, IFR receives traffic information about VFR, but NO ATC separation is provided between IFR and VFR!',
    separationDetails: {
      ifrFromIfr: 'Separated',
      ifrFromVfr: 'Traffic information only',
      vfrFromIfr: 'Traffic information only',
      vfrFromVfr: 'Traffic information only'
    },
    notes: 'Regional airport CTRs and control zones. IFR separated from IFR only. Traffic information given to all regarding VFR.' 
  },
  { 
    class: AirspaceClass.E, 
    type: 'Controlled', 
    separation: 'IFR from IFR only', 
    vfrAllowed: true, 
    radioReq: true, 
    clearanceReq: true, 
    speedLimit: '250 kt IAS below FL 100',
    vmcMinima: 'At/above FL 100: 8 km vis, 1,500 m horiz / 1,000 ft vert. Below FL 100: 5 km vis, 1,500 m / 1,000 ft.',
    rtfqTrap: 'TRAP: Class E is controlled for IFR, but UNCONTROLLED for VFR! VFR does NOT need an ATC clearance or two-way radio in standard ICAO rules.',
    separationDetails: {
      ifrFromIfr: 'Separated',
      ifrFromVfr: 'Traffic information provided as far as practical',
      vfrFromIfr: 'No traffic info unless requested',
      vfrFromVfr: 'None'
    },
    notes: 'Lower airways and approach transition areas. Controlled for IFR, uncontrolled for VFR.' 
  },
  { 
    class: AirspaceClass.F, 
    type: 'Advisory', 
    separation: 'IFR from IFR advisory where practical', 
    vfrAllowed: true, 
    radioReq: true, 
    clearanceReq: false, 
    speedLimit: '250 kt IAS below FL 100',
    vmcMinima: 'At/above FL 100: 8 km vis, 1,500 m / 1,000 ft. Below FL 100: 5 km vis, 1,500 m / 1,000 ft. At or below 3,000 ft AMSL / 1,000 ft AGL: 5 km (or 1,500 m for low speed), clear of cloud and in sight of surface.',
    rtfqTrap: 'TRAP: Class F is advisory airspace. Separation is NOT guaranteed, merely advised. Phased out in most of Europe.',
    separationDetails: {
      ifrFromIfr: 'Advisory separation only (participating IFR)',
      ifrFromVfr: 'Flight Information Service',
      vfrFromIfr: 'Flight Information Service',
      vfrFromVfr: 'None'
    },
    notes: 'Advisory routes. Separation attempted where practical but not guaranteed.' 
  },
  { 
    class: AirspaceClass.G, 
    type: 'Uncontrolled', 
    separation: 'None', 
    vfrAllowed: true, 
    radioReq: false, 
    clearanceReq: false, 
    speedLimit: '250 kt IAS below FL 100',
    vmcMinima: 'At/above FL 100: 8 km vis, 1,500 m / 1,000 ft. Below FL 100: 5 km vis, 1,500 m / 1,000 ft. At or below 3,000 ft AMSL / 1,000 ft AGL: 5 km (1,500 m for <=140 kt), clear of cloud with continuous surface reference.',
    rtfqTrap: 'TRAP: In Class G, no separation is provided to ANY flight. Only Flight Information Service (FIS) and alerting service upon request.',
    separationDetails: {
      ifrFromIfr: 'None',
      ifrFromVfr: 'None',
      vfrFromIfr: 'None',
      vfrFromVfr: 'None'
    },
    notes: 'Open FIR. Uncontrolled airspace. Flight Information Service and alerting only.' 
  },
];

// =========================================================================
// CROUCHER FRAMEWORK: ICAO ANNEXES (1 TO 19)
// =========================================================================
export const ICAO_ANNEXES_DATA: IcaoAnnexDef[] = [
  {
    nr: 1,
    title: 'Personnel Licensing',
    domain: 'Personnel',
    focus: 'Flight crew, ATC, and maintenance personnel licensing, ratings, medical certificates.',
    mnemonic: '1 pilot at the controls holding a licence.',
    croucherKey: 'Class 1 medical validity: 12 months (6 months for 60+ in multi-crew, 40+ in single-pilot commercial pax ops).',
    rtfqTrap: 'TRAP: Commercial operations over 60 years old: cannot fly single-pilot CAT; multi-crew allowed up to 65 if other pilot is under 60.'
  },
  {
    nr: 2,
    title: 'Rules of the Air',
    domain: 'Operations',
    focus: 'General flight rules, Right of Way rules, VMC minima, Special VFR, semi-circular level rules.',
    mnemonic: '2 rules of the road (VFR & IFR).',
    croucherKey: 'Convergence is a Watch Hands Rule: Always give way to the right; head-on both turn right; overtake on the right.',
    rtfqTrap: 'TRAP: Aircraft being overtaken has right of way! Overtaking aircraft must alter heading to the right and keep out of the way.'
  },
  {
    nr: 3,
    title: 'Meteorological Service for International Air Navigation',
    domain: 'Environment',
    focus: 'METAR, TAF, SPECI, SIGMET, AIRMET, VOLMET, and meteorological briefing standards.',
    mnemonic: '3 cloud layers (Low, Medium, High).',
    croucherKey: 'SIGMET covers severe phenomena affecting ALL aircraft (severe turbulence, severe icing, volcanic ash, severe mountain waves).',
    rtfqTrap: 'TRAP: AIRMET is specifically for LOW-LEVEL operations (below FL 100 or FL 150 in mountainous terrain); SIGMET is for all flight levels.'
  },
  {
    nr: 4,
    title: 'Aeronautical Charts',
    domain: 'Operations',
    focus: 'Standard chart projections, scales, colors, symbols, WAC 1:1,000,000, Topographic 1:500,000, Instrument Approach Charts.',
    mnemonic: '4 corners of a navigation map / 4 cardinal points.',
    croucherKey: 'Lambert Conformal Conic is standard for mid-latitudes; Mercator for equatorial routes; Polar Stereographic for polar regions.',
    rtfqTrap: 'TRAP: 1:500,000 chart is mandatory for visual air navigation; WAC 1:1,000,000 covers larger continental regions.'
  },
  {
    nr: 5,
    title: 'Units of Measurement to be Used in Air and Ground Operations',
    domain: 'Technical',
    focus: 'SI units, standardized non-SI alternatives (nautical miles, knots, feet).',
    mnemonic: '5 fingers on a hand for measuring.',
    croucherKey: 'Standard vertical dimension: Foot (ft); horizontal distance: Nautical Mile (NM); speed: Knot (kt); altimeter: Hectopascal (hPa).',
    rtfqTrap: 'TRAP: Standard pressure is 1013.25 hPa (or mb), NOT 1013.25 psi!'
  },
  {
    nr: 6,
    title: 'Operation of Aircraft',
    domain: 'Operations',
    focus: 'Part I (Commercial Air Transport - Aeroplanes), Part II (General Aviation), Part III (Helicopters). Operator responsibilities, MEL, oxygen, fuel.',
    mnemonic: 'Route 66 of aircraft operations.',
    croucherKey: 'Part-CAT Operations Manual: Part A (General), Part B (Type-specific / MEL), Part C (Routes & Aerodromes), Part D (Training).',
    rtfqTrap: 'TRAP: Operator MEL can NEVER be less restrictive than the Master MEL (MMEL) created by the manufacturer and certified by the state.'
  },
  {
    nr: 7,
    title: 'Aircraft Nationality and Registration Marks',
    domain: 'Technical',
    focus: 'Common marks, registration lettering, fireproof identification plate, state of registry.',
    mnemonic: 'Lucky 007 license plate on an aircraft tail.',
    croucherKey: 'Aircraft have nationality of the State where registered (Chicago Art 17). Dual registration is strictly prohibited (Art 18).',
    rtfqTrap: 'TRAP: Identification plate must be secured to the aircraft in a prominent position near the main entrance or exterior tail, made of fireproof metal.'
  },
  {
    nr: 8,
    title: 'Airworthiness of Aircraft',
    domain: 'Technical',
    focus: 'Type certification, Certificate of Airworthiness (CofA), continuing airworthiness, Airworthiness Directives (ADs).',
    mnemonic: 'Figure 8 is an infinity loop of continuous maintenance.',
    croucherKey: 'State of Design issues Type Certificate; State of Manufacture oversees production; State of Registry issues and maintains CofA.',
    rtfqTrap: 'TRAP: Under EASA, the CofA has unlimited validity, but remains valid ONLY if the Airworthiness Review Certificate (ARC) is renewed annually.'
  },
  {
    nr: 9,
    title: 'Facilitation',
    domain: 'Administration',
    focus: 'Customs, immigration, public health, baggage clearance, airport transit areas, passenger manifest, cargo declaration.',
    mnemonic: 'Cloud 9 smooth passage through border control.',
    croucherKey: 'States must facilitate smooth customs/immigration without unnecessary delay to international air commerce.',
    rtfqTrap: 'TRAP: General Declaration (GenDec) and Passenger Manifest are required documents under Annex 9 for border crossing facilitation.'
  },
  {
    nr: 10,
    title: 'Aeronautical Telecommunications',
    domain: 'Technical',
    focus: 'Vol I (Radio Nav Aids), Vol II (Comms Procedures), Vol III (Data links), Vol IV (Surveillance radar & ACAS), Vol V (Freq spectrum).',
    mnemonic: '10-4 Roger on the radio telecom frequency.',
    croucherKey: 'Emergency frequencies: 121.5 MHz (VHF guard), 243.0 MHz (military UHF), 406 MHz (COSPAS-SARSAT digital ELT).',
    rtfqTrap: 'TRAP: ACAS II (TCAS II) mandates Resolution Advisories (RA) in vertical plane only; pilots must follow RA immediately, overriding ATC.'
  },
  {
    nr: 11,
    title: 'Air Traffic Services',
    domain: 'Operations',
    focus: 'Air Traffic Control (ATC), Flight Information Service (FIS), Alerting Service. Airspace classes A through G.',
    mnemonic: '11 = Two parallel control towers watching the runway.',
    croucherKey: 'ATS has 3 core services: ATC (prevent collisions), FIS (advice and useful info), Alerting Service (notify SAR organizations).',
    rtfqTrap: 'TRAP: Alerting service is provided to ALL aircraft with a flight plan, and to all aircraft known to ATS, even in Class G uncontrolled airspace!'
  },
  {
    nr: 12,
    title: 'Search and Rescue (SAR)',
    domain: 'Safety',
    focus: 'Emergency phases (INCERFA, ALERFA, DETRESFA), SAR regions, ground-to-air visual signaling codes.',
    mnemonic: '12 disciples searching / 121.5 MHz homing.',
    croucherKey: 'Emergency Phases: 1) INCERFA (Uncertainty - no comms within 30 min of ETA), 2) ALERFA (Alert - failed comms, apprehension), 3) DETRESFA (Distress - grave danger).',
    rtfqTrap: 'TRAP: Ground-to-air signal "V" means "Require assistance"; "X" means "Require medical assistance"; "Y" means "Yes/Affirmative"; "N" means "No/Negative".'
  },
  {
    nr: 13,
    title: 'Aircraft Accident and Incident Investigation',
    domain: 'Safety',
    focus: 'Investigation procedures, notification, state rights, accredited representative, safety recommendations.',
    mnemonic: 'Unlucky 13 accident investigation.',
    croucherKey: 'The SOLE objective of investigation is the PREVENTION of future accidents and incidents. NOT to apportion blame or legal liability!',
    rtfqTrap: 'TRAP: State of Occurrence leads investigation. Accredited representatives can be appointed by State of Registry, Operator, Design, Manufacture.'
  },
  {
    nr: 14,
    title: 'Aerodromes',
    domain: 'Infrastructure',
    focus: 'Vol I (Aerodrome Design & Operations - runways, taxiways, lighting, markings, RFF), Vol II (Heliports).',
    mnemonic: 'Runway 14 at the aerodrome.',
    croucherKey: 'Aerodrome Reference Code: Code Number (Runway field length 1 to 4) + Code Letter (Wingspan & Outer Main Gear Wheel Span A to F).',
    rtfqTrap: 'TRAP: RFF Category response time: Mandatory 2 minutes, not exceeding 3 minutes to the end of each operational runway.'
  },
  {
    nr: 15,
    title: 'Aeronautical Information Services (AIS)',
    domain: 'Information',
    focus: 'Integrated Aeronautical Information Package: AIP, AIP Supplements, AIC (Aeronautical Information Circulars), NOTAM, Pre-flight PIB.',
    mnemonic: '15 NOTAMs printed in your pre-flight briefing packet.',
    croucherKey: 'AIRAC cycle is strictly 28 days! Operationally significant changes must be distributed 28 days in advance (or 56 days for major changes).',
    rtfqTrap: 'TRAP: AIC Series A is distributed internationally; Series B is distributed nationally only. White = admin, Yellow = ops, Pink = safety, Green = maps.'
  },
  {
    nr: 16,
    title: 'Environmental Protection',
    domain: 'Environment',
    focus: 'Vol I (Aircraft Noise certification - Chapters 2, 3, 4, 14), Vol II (Aircraft Engine Emissions), Vol III (CO2 emissions).',
    mnemonic: 'Sweet 16 quiet neighborhood (noise abatement).',
    croucherKey: 'Chapter 14 is the most stringent current noise standard. Chapter 3 and Chapter 4 phased out older Chapter 2 "heavy roar" jets.',
    rtfqTrap: 'TRAP: Noise certificate must be carried on board during international operations under Chicago Convention Article 29.'
  },
  {
    nr: 17,
    title: 'Security: Safeguarding International Civil Aviation Against Acts of Unlawful Interference',
    domain: 'Security',
    focus: 'Airport security zones, access control, baggage screening, cockpit door security, unruly passengers, hijack procedures.',
    mnemonic: 'Armed security guard on patrol at 1700 hours.',
    croucherKey: 'Flight deck door on commercial transport must be bullet-proof/intrusion-resistant, lockable from inside, with CCTV/spyhole monitoring.',
    rtfqTrap: 'TRAP: Transponder code 7500 indicates Unlawful Interference / Hijack. If unable to talk, pilot sets 7500 on squawk.'
  },
  {
    nr: 18,
    title: 'The Safe Transport of Dangerous Goods by Air',
    domain: 'Safety',
    focus: 'Classes 1 through 9 hazardous materials, forbidden goods, Cargo Aircraft Only (CAO), NOTOC, packaging, labeling.',
    mnemonic: '18+ legal age for handling explosive and hazardous cargo.',
    croucherKey: 'NOTOC (Notification to Captain) must be delivered in writing to the Pilot-in-Command BEFORE departure, indicating location and hazard classes.',
    rtfqTrap: 'TRAP: Class 1 = Explosives; Class 7 = Radioactive; Class 8 = Corrosives; Class 9 = Miscellaneous (includes Lithium batteries and dry ice).'
  },
  {
    nr: 19,
    title: 'Safety Management',
    domain: 'Safety',
    focus: 'State Safety Programme (SSP), Safety Management Systems (SMS), Safety Risk Management (SRM), Safety Assurance, Just Culture.',
    mnemonic: 'COVID-19 pandemic triggered the latest global safety management evolution.',
    croucherKey: 'SMS 4 Pillars: 1) Safety Policy & Objectives, 2) Safety Risk Management, 3) Safety Assurance, 4) Safety Promotion.',
    rtfqTrap: 'TRAP: Mandatory Occurrence Reporting (MOR) under Just Culture protects honest human error from punitive prosecution, except in cases of gross negligence.'
  }
];

// =========================================================================
// CROUCHER FRAMEWORK: CHICAGO FREEDOMS OF THE AIR (1ST TO 5TH & CABOTAGE)
// =========================================================================
export const FREEDOMS_OF_THE_AIR_DATA: FreedomOfAirDef[] = [
  {
    id: 1,
    title: '1st Freedom',
    name: 'Right of Innocent Overflight',
    type: 'Transit',
    desc: 'The privilege to fly across the territory of another State without landing.',
    example: 'A British Airways flight from London to Rome overflying French sovereign airspace without landing.',
    trafficRights: 'Transit only; no passenger, cargo, or mail embarkation or disembarkation.',
    rtfqTrap: 'TRAP: State sovereignty (Article 1) is absolute over territorial land and territorial waters (12 NM). Prior clearance or bilateral agreement required.'
  },
  {
    id: 2,
    title: '2nd Freedom',
    name: 'Technical Stop',
    type: 'Transit',
    desc: 'The privilege to land in another State for non-traffic purposes (refuelling, maintenance, or emergency).',
    example: 'A Lufthansa flight from Frankfurt to Buenos Aires landing in Dakar (Senegal) strictly to take on fuel, with no passenger boarding.',
    trafficRights: 'Technical only. Absolutely NO commercial traffic (no passenger, cargo, or mail pickup or set-down).',
    rtfqTrap: 'TRAP: If ANY passenger boards or leaves the aircraft for commercial reasons, it ceases to be a 2nd freedom stop!'
  },
  {
    id: 3,
    title: '3rd Freedom',
    name: 'Outbound Commercial Carriage',
    type: 'Commercial',
    desc: 'The privilege to put down in the territory of another State passengers, mail, and cargo taken on in the flag State.',
    example: 'An Air France flight taking on passengers in Paris (home state) and setting them down in New York (USA).',
    trafficRights: 'Originates in home state, terminates in foreign state.',
    rtfqTrap: 'TRAP: 3rd and 4th freedoms are reciprocal and form the foundational bilateral agreement for all standard international air services.'
  },
  {
    id: 4,
    title: '4th Freedom',
    name: 'Inbound Commercial Carriage',
    type: 'Commercial',
    desc: 'The privilege to take on in the territory of another State passengers, mail, and cargo destined for the flag State.',
    example: 'An Air France flight taking on passengers in New York (foreign state) and carrying them home to Paris.',
    trafficRights: 'Originates in foreign state, terminates in home state.',
    rtfqTrap: 'TRAP: Remember 3rd is OUTBOUND from home; 4th is INBOUND back to home.'
  },
  {
    id: 5,
    title: '5th Freedom',
    name: 'Intermediate Commercial Beyond Rights',
    type: 'Commercial',
    desc: 'The privilege to take on or set down passengers, mail, and cargo between two foreign States, on a flight that originates or terminates in the airline home State.',
    example: 'Emirates flight originating in Dubai -> lands in Milan (Italy) -> picks up passengers in Milan -> lands in New York (USA). Emirates sells tickets for Milan-to-New York!',
    trafficRights: 'Commercial carriage between two foreign nations; flight MUST touch home state at beginning or end.',
    rtfqTrap: "TRAP: Flight MUST originate or terminate in the carrier's home nation. If it does not touch the home state, it is 7th freedom (stand-alone foreign service)."
  },
  {
    id: 6,
    title: '6th Freedom',
    name: 'Behind-and-Beyond Hub Transit',
    type: 'Commercial',
    desc: 'The combination of 4th and 3rd freedoms through the home state hub (e.g. Amsterdam, Doha, Dubai).',
    example: 'KLM carrying a passenger from Manchester to Amsterdam (4th) and immediately onto Singapore (3rd) via Amsterdam Schiphol hub.',
    trafficRights: 'Carriage between two foreign states stopping in the home hub.',
    rtfqTrap: 'TRAP: 6th freedom is technically not an official Chicago treaty freedom; it is legally constructed by pairing a 4th freedom inbound with a 3rd freedom outbound.'
  },
  {
    id: 7,
    title: '7th Freedom',
    name: 'Stand-alone Foreign Operations',
    type: 'Commercial',
    desc: 'The privilege to operate completely outside the home state between two foreign states with no home-state segment.',
    example: 'Ryanair (an Irish airline) operating flights between Frankfurt (Germany) and Rome (Italy) without any connection to Ireland.',
    trafficRights: 'Completely open within the EU Single European Aviation Market (deregulation).',
    rtfqTrap: 'TRAP: Rare outside unified economic blocs like the EU (European Common Aviation Area).'
  },
  {
    id: 8,
    title: '8th Freedom (Consecutive Cabotage)',
    name: 'Consecutive Cabotage',
    type: 'Cabotage',
    desc: 'The privilege to carry domestic traffic within a foreign State on a flight that originates or terminates in the home State.',
    example: 'Air France flying Paris -> Montreal -> Toronto. Taking on domestic Canadian passengers in Montreal and flying them to Toronto.',
    trafficRights: 'Domestic carriage in a foreign country connected to an international leg.',
    rtfqTrap: 'TRAP: Article 7 of Chicago Convention strictly protects cabotage. Contracting states have the absolute right to refuse cabotage to foreign airlines.'
  },
  {
    id: 9,
    title: '9th Freedom (Stand-alone Cabotage)',
    name: 'Pure Stand-alone Cabotage',
    type: 'Cabotage',
    desc: 'The privilege to operate purely domestic flights entirely within the territory of a foreign State with no home-state link.',
    example: 'EasyJet (UK carrier) operating a purely domestic flight from Nice to Paris inside France.',
    trafficRights: 'Full domestic carriage within a foreign nation. Granted universally within EU open skies, virtually never outside.',
    rtfqTrap: 'TRAP: Article 7 forbids giving cabotage rights on an EXCLUSIVE basis to any one state; if granted, must be non-discriminatory.'
  }
];

// =========================================================================
// CROUCHER FRAMEWORK: MEL DISPATCH INTERVALS & LOGIC
// =========================================================================
export const MEL_DISPATCH_INTERVALS_DATA: MelIntervalDef[] = [
  {
    category: 'A',
    duration: 'Special Specified Limit',
    hoursOrDays: 'Variable (flight cycles, calendar hours, or specific days)',
    description: 'No standard default interval; must be rectified within the exact time limit, flight cycles, or date specified in the Remarks or Exceptions column.',
    extensionAllowed: false,
    croucherRule: 'Category A rectification intervals CANNOT be extended by the operator under any circumstances! Non-extendable.'
  },
  {
    category: 'B',
    duration: '3 Calendar Days',
    hoursOrDays: '72 Hours (excluding the day of defect discovery)',
    description: 'Items in this category shall be rectified within 3 consecutive calendar days (72 hours), beginning at midnight on the day the defect was recorded in the aircraft technical log.',
    extensionAllowed: true,
    croucherRule: 'Clock starts at MIDNIGHT on the day of discovery. Can be extended once for an additional 3 days (72h) under approved Rectification Interval Extension (RIE).'
  },
  {
    category: 'C',
    duration: '10 Calendar Days',
    hoursOrDays: '240 Hours (excluding the day of defect discovery)',
    description: 'Items in this category shall be rectified within 10 consecutive calendar days (240 hours), beginning at midnight on the day of discovery.',
    extensionAllowed: true,
    croucherRule: 'Most common avionics and auxiliary equipment interval. Clock starts at 00:00 midnight that night. Can be extended once for an additional 10 days (240h) with RIE.'
  },
  {
    category: 'D',
    duration: '120 Calendar Days',
    hoursOrDays: '120 consecutive calendar days',
    description: 'Optional / non-essential equipment items (e.g. cabin entertainment, passenger convenience systems) to be rectified within 120 consecutive calendar days.',
    extensionAllowed: false,
    croucherRule: 'Category D items are strictly for convenience and cosmetic items. Non-extendable under standard EASA RIE rules.'
  }
];

// =========================================================================
// CROUCHER FRAMEWORK: ALL-WEATHER OPERATIONS (AWO) MINIMA & APPROACH BAN
// =========================================================================
export const AWO_OPERATING_MINIMA_DATA: AwoMinimaDef[] = [
  {
    category: 'CAT I',
    dh: '>= 200 ft (60 m)',
    rvr: '>= 550 m (or vis >= 800 m)',
    visualRefRequired: 'At least ONE light element of approach or runway lights (e.g. approach lights, threshold, TDZ, or runway edge).',
    systemReq: 'Standard ILS receiver, flight director, or autopilot coupled.',
    croucherNotes: 'Standard precision approach. If visual reference lost below DH, immediate go-around mandatory.'
  },
  {
    category: 'CAT II',
    dh: '100 ft to 199 ft (30 m to 60 m)',
    rvr: '>= 300 m',
    visualRefRequired: 'At least THREE consecutive lights of approach centerline, runway centerline, TDZ lights, or edge lights PLUS a lateral ground pattern element.',
    systemReq: 'Autoland or HUD approved to touchdown, dual flight directors, auto-throttle, radio altimeter mandatory.',
    croucherNotes: 'Requires LVP in force at aerodrome. Decision Height based on Radio Altimeter (RA).'
  },
  {
    category: 'CAT IIIA',
    dh: '< 100 ft (or NO DH)',
    rvr: '>= 175 m (ICAO 200 m / EASA 175 m)',
    visualRefRequired: 'At least THREE consecutive lights of runway centerline or touchdown zone lights.',
    systemReq: 'Fail-passive autoland system minimum; automatic rollout or manual rollout with visual reference.',
    croucherNotes: 'Fail-passive: In the event of a failure, there is no significant out-of-trim condition, but pilot must disconnect and complete landing manually.'
  },
  {
    category: 'CAT IIIB',
    dh: '< 50 ft (or NO DH)',
    rvr: '75 m <= RVR < 175 m',
    visualRefRequired: 'At least ONE centerline light.',
    systemReq: 'Fail-operational autoland and automatic rollout system mandatory.',
    croucherNotes: 'Fail-operational: Following any failure below alert height, approach, flare, and landing can be completed automatically by the remaining channel.'
  },
  {
    category: 'CAT IIIC',
    dh: 'NO Decision Height (0 ft)',
    rvr: 'NO RVR limitation (0 m)',
    visualRefRequired: 'None required for landing or rollout (Zero-Zero).',
    systemReq: 'Full automated landing, rollout, and taxi guidance.',
    croucherNotes: 'Zero-Zero operations. Currently theoretical and NOT operationally approved anywhere in the world due to emergency vehicle evacuation limitations!'
  }
];

// =========================================================================
// CROUCHER FRAMEWORK: DE-ICING, HOLDOVER TIMES & CLEAN AIRCRAFT CONCEPT
// =========================================================================
export const DEICING_HOLDOVER_DATA: DeicingHoldoverDef[] = [
  {
    fluidType: 'Type I',
    color: 'Orange / Red-Orange',
    thickened: false,
    minVr: 'No minimum (suitable for all rotation speeds)',
    hotRange: 'Very Short (typically 3 to 15 minutes)',
    primaryUse: 'De-icing: Heated mixture (60-80°C) sprayed under pressure to melt and shed existing ice, snow, and frost from surfaces.',
    keyRule: 'Contains no thickening agents. Shear-thins instantly; provides virtually NO ongoing anti-icing protection once stopped.'
  },
  {
    fluidType: 'Type II',
    color: 'Water-clear / Pale Straw',
    thickened: true,
    minVr: 'Vr >= 100 kt (jets and large turboprops)',
    hotRange: 'Medium (approx 30 to 90 minutes depending on precipitation)',
    primaryUse: 'Anti-icing: Pseudoplastic fluid that adheres to wings during taxi and shears off aerodynamic surfaces above 100 kt rotation speed.',
    keyRule: 'Must NOT be used on aircraft with Vr < 100 kt as the viscous fluid layer will not blow off, causing severe loss of lift and stall margin!'
  },
  {
    fluidType: 'Type III',
    color: 'Bright Yellow',
    thickened: true,
    minVr: 'Vr < 100 kt (commuters and regional turboprops)',
    hotRange: 'Medium-Short (between Type I and Type II)',
    primaryUse: 'Anti-icing for slower aircraft: Formulated to shear off cleanly at lower rotation speeds (60 to 100 kt).',
    keyRule: 'Designed specifically for regional commuters that cannot reach 100 kt before takeoff rotation.'
  },
  {
    fluidType: 'Type IV',
    color: 'Emerald Green',
    thickened: true,
    minVr: 'Vr >= 100 kt (high-speed transport jets)',
    hotRange: 'Longest (typically 45 minutes to 3+ hours in light frost/snow)',
    primaryUse: 'Advanced Anti-icing: Highest viscosity and longest Holdover Time for heavy commercial airline operations.',
    keyRule: 'Croucher Rule: The Holdover Time clock begins at the START of the anti-icing application step, NEVER when spraying finishes!'
  }
];

