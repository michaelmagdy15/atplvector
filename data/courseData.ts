import { QCode, LightSignal, AirspaceData, AirspaceClass } from '../types';

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
  { class: 'A', vfr: false, separation: 'All aircraft', radio: 'Required', clearance: 'Required' },
  { class: 'C', vfr: true, separation: 'VFR from IFR', radio: 'Required', clearance: 'Required' },
  { class: 'D', vfr: true, separation: 'None', radio: 'Required', clearance: 'Required' },
  { class: 'E', vfr: true, separation: 'None', radio: 'Required for IFR', clearance: 'Required for IFR' },
  { class: 'G', vfr: true, separation: 'None', radio: 'Recommended', clearance: 'No' },
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
  { class: AirspaceClass.A, type: 'Controlled', separation: 'All aircraft', vfrAllowed: false, radioReq: true, clearanceReq: true, notes: 'High altitude, airways, major hubs. IFR Only.' },
  { class: AirspaceClass.B, type: 'Controlled', separation: 'All aircraft', vfrAllowed: true, radioReq: true, clearanceReq: true, notes: 'Rare in Europe. Common in USA. ATC separates VFR from VFR.' },
  { class: AirspaceClass.C, type: 'Controlled', separation: 'IFR from IFR, VFR from IFR', vfrAllowed: true, radioReq: true, clearanceReq: true, notes: 'Standard for busy airports. VFR separated from IFR but not other VFR (Traffic Info given).' },
  { class: AirspaceClass.D, type: 'Controlled', separation: 'IFR from IFR', vfrAllowed: true, radioReq: true, clearanceReq: true, notes: 'Regional airports. IFR separated from IFR. Traffic info for VFR.' },
  { class: AirspaceClass.E, type: 'Controlled', separation: 'IFR from IFR', vfrAllowed: true, radioReq: true, clearanceReq: true, notes: 'Lower airways. Controlled for IFR, Uncontrolled for VFR (no clearance needed for VFR).' },
  { class: AirspaceClass.F, type: 'Advisory', separation: 'IFR from IFR (Advisory)', vfrAllowed: true, radioReq: true, clearanceReq: false, notes: 'Advisory routes. Separation attempted but not guaranteed.' },
  { class: AirspaceClass.G, type: 'Uncontrolled', separation: 'None', vfrAllowed: true, radioReq: false, clearanceReq: false, notes: 'Open FIR. Flight Information Service only.' },
];
