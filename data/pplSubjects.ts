/**
 * PPL Subject Definitions
 *
 * Mirrors the structure of the ATPL subjects list but scoped to PPL.
 * Content columns will be finalized once the official PPL ground training
 * objectives PDF has been reviewed.
 *
 * reuse: 'full'     → existing ATPL component used unchanged
 * reuse: 'filtered' → existing ATPL component used with mode="PPL" prop to filter LOs
 * reuse: 'new'      → new PPL-specific component required
 */

export interface PPLSubject {
  id: string;           // Internal ID
  code: string;         // Regulatory code
  name: string;         // Display name
  atplEquivalent?: string; // Matching ATPL subject ID if reusable
  reuse: 'full' | 'filtered' | 'new';
  color: string;        // Tailwind color token for card
  icon: string;         // Lucide icon name
  description: string;
  isContentReady: boolean; // false until PDF mapping is complete
}

export const PPL_SUBJECTS: PPLSubject[] = [
  {
    id: 'ppl-airlaw',
    code: 'PPL-010',
    name: 'Air Law & ATC Procedures',
    atplEquivalent: 'AIR_LAW',
    reuse: 'filtered',
    color: 'red',
    icon: 'Scale',
    description: 'Rules of the Air, airspace classification, VFR procedures, and ATC communications relevant to PPL operations.',
    isContentReady: true,
  },
  {
    id: 'ppl-hpl',
    code: 'PPL-040',
    name: 'Human Performance & Limitations',
    atplEquivalent: 'HPL',
    reuse: 'filtered',
    color: 'emerald',
    icon: 'Users',
    description: 'Physiology, psychology, stress, fatigue, and decision-making at the PPL level.',
    isContentReady: true,
  },
  {
    id: 'ppl-met',
    code: 'PPL-050',
    name: 'Meteorology',
    atplEquivalent: 'MET',
    reuse: 'filtered',
    color: 'teal',
    icon: 'Cloud',
    description: 'Atmosphere, weather phenomena, METAR/TAF interpretation, and weather decision-making for VFR pilots.',
    isContentReady: true,
  },
  {
    id: 'ppl-nav',
    code: 'PPL-061',
    name: 'Navigation',
    atplEquivalent: 'GEN_NAV',
    reuse: 'filtered',
    color: 'cyan',
    icon: 'Compass',
    description: 'Dead reckoning, VFR chart reading, wind triangle, time/speed/distance calculations.',
    isContentReady: true,
  },
  {
    id: 'ppl-pof',
    code: 'PPL-081',
    name: 'Principles of Flight',
    atplEquivalent: 'POF',
    reuse: 'filtered',
    color: 'violet',
    icon: 'Plane',
    description: 'Lift, drag, stability, control surfaces, stall, and spin awareness for SEP aircraft.',
    isContentReady: true,
  },
  {
    id: 'ppl-comms',
    code: 'PPL-090',
    name: 'VFR Communications',
    atplEquivalent: 'COMMS',
    reuse: 'full',
    color: 'sky',
    icon: 'Radio',
    description: 'VFR radiotelephony, phraseology, distress & urgency procedures. Full reuse of existing VFR Comms sim.',
    isContentReady: true, // Already built!
  },
  {
    id: 'ppl-ops',
    code: 'PPL-070',
    name: 'Operational Procedures',
    atplEquivalent: 'OPS_PROC',
    reuse: 'filtered',
    color: 'indigo',
    icon: 'BookOpen',
    description: 'VFR flight planning, fuel requirements, pre-flight checks, and emergency procedures.',
    isContentReady: true,
  },
  {
    id: 'ppl-agk',
    code: 'PPL-AGK',
    name: 'Aircraft General Knowledge (SEP)',
    atplEquivalent: undefined,
    reuse: 'new',
    color: 'orange',
    icon: 'Settings',
    description: 'Piston engine operation, SEP airframe systems, fuel systems, basic instruments, and electrics.',
    isContentReady: true,
  },
  {
    id: 'ppl-perf',
    code: 'PPL-PERF',
    name: 'Flight Performance & Planning',
    atplEquivalent: undefined,
    reuse: 'new',
    color: 'lime',
    icon: 'TrendingUp',
    description: 'Class B SEP performance charts, weight & balance for light aircraft, fuel planning, and density altitude.',
    isContentReady: true,
  },
];

/** Quick lookup: which PPL subjects can be served by existing ATPL components right now */
export const PPL_IMMEDIATELY_REUSABLE = PPL_SUBJECTS.filter(s => s.reuse === 'full');
/** Subjects needing filtered ATPL components */
export const PPL_NEEDS_FILTERING = PPL_SUBJECTS.filter(s => s.reuse === 'filtered');
/** Subjects requiring entirely new components */
export const PPL_NEEDS_NEW_CONTENT = PPL_SUBJECTS.filter(s => s.reuse === 'new');
