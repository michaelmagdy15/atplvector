import { View } from '../types';

export const GOOGLE_DRIVE_FOLDER_ID = '1CTzK5RtHsvJtqTNyysjLByYCibqiRS8Z';
export const GOOGLE_DRIVE_FOLDER_URL =
  'https://drive.google.com/drive/folders/1CTzK5RtHsvJtqTNyysjLByYCibqiRS8Z?usp=sharing';

export interface TopicVideoEntry {
  view: View;
  subjectCode: string;
  title: string;
  durationSec: number;
  examTakeaway: string;
  driveFileId?: string;
  videoUrl?: string;
  dayBatch: number;
}

export const TOPIC_VIDEOS: Partial<Record<View, TopicVideoEntry>> = {
  [View.PERF_INTRO]: {
    view: View.PERF_INTRO,
    subjectCode: '032',
    title: 'Density Altitude & TAS vs IAS',
    durationSec: 59,
    examTakeaway: 'High density altitude shrinks thrust & wing lift while increasing TAS for any IAS.',
    driveFileId: '139p8C7mYAUcZIVBSXvxaZjy9_-h8U6zx',
    dayBatch: 1,
  },
  [View.PERF_TAKEOFF]: {
    view: View.PERF_TAKEOFF,
    subjectCode: '032',
    title: 'Balanced Field Length & V1',
    durationSec: 56,
    examTakeaway: 'V1 is balanced where Accelerate-Stop Distance equals Takeoff Distance Required.',
    driveFileId: '1Ijbo0rOv5L7zdN9miKK4cBI0aUt-ys0y',
    dayBatch: 1,
  },
  [View.PERF_CLIMB]: {
    view: View.PERF_CLIMB,
    subjectCode: '032',
    title: 'Vx vs Vy & Excess Thrust',
    durationSec: 61,
    examTakeaway: 'Steepest climb angle (Vx) needs excess thrust; best rate (Vy) needs excess power.',
    driveFileId: '1aCrVqqJTm-yQBiUNi-nnzhqR2nA2kM0m',
    dayBatch: 1,
  },
  [View.PERF_CRUISE]: {
    view: View.PERF_CRUISE,
    subjectCode: '032',
    title: 'Specific Air Range & Step Climb',
    durationSec: 57,
    examTakeaway: 'Headwinds demand faster MRC/LRC cruise speed; burning fuel lowers optimum altitude.',
    driveFileId: '1JEBRYJsSPJJabVnDywHuubDlOy7P-SWW',
    dayBatch: 1,
  },
  [View.PERF_LANDING]: {
    view: View.PERF_LANDING,
    subjectCode: '032',
    title: 'Factored Landing Distance (60% / 70% / Wet)',
    durationSec: 63,
    examTakeaway: 'CS-25 jets factor dry ALD by 1/0.60 (1.67) and multiply by 1.15 for wet runways.',
    driveFileId: '1ggTfQy0i5mN4TvASTzjI7qPG4UCR_mV1',
    dayBatch: 1,
  },
  [View.PERF_CLASS_A]: {
    view: View.PERF_CLASS_A,
    subjectCode: '032',
    title: 'Class A OEI Segments & Net vs Gross',
    durationSec: 58,
    examTakeaway: 'Net flight path deducts 0.8% (2-engine), 0.9% (3-engine), and 1.0% (4-engine) gradient.',
    driveFileId: '1Mnr_oNQomsKi-BOdnmjgRIuV7LHymZLc',
    dayBatch: 1,
  },
  [View.PERF_CLASS_B]: {
    view: View.PERF_CLASS_B,
    subjectCode: '032',
    title: 'Class B Safety Factors & Obstacles',
    durationSec: 54,
    examTakeaway: 'Multiply Class B unfactored takeoff by 1.25 (to 50 ft) and landing by 1.43.',
    driveFileId: '1OPOiwE2XkdD81xKApn9NFJxGiqf8HFHj',
    dayBatch: 1,
  },
  [View.POF_HIGH_SPEED]: {
    view: View.POF_HIGH_SPEED,
    subjectCode: '081',
    title: 'Coffin Corner & Mach Tuck',
    durationSec: 53,
    examTakeaway: 'Shockwaves shift CP aft causing nose-down tuck; trust Mach Trim and avoid hard pulls.',
    driveFileId: '1EnvcsbAiU3FlIw_9Atr3xxYjHArPxrWJ',
    dayBatch: 1,
  },
  [View.POF_STALL]: {
    view: View.POF_STALL,
    subjectCode: '081',
    title: 'Critical AoA & Load Factor Stall',
    durationSec: 56,
    examTakeaway: 'Stall always occurs at the critical AoA; load factor increases stall speed by √n.',
    driveFileId: '18ku8TS2B2o_-T56lEenBVjmweyu5VS2l',
    dayBatch: 1,
  },
  [View.POF_DRAG]: {
    view: View.POF_DRAG,
    subjectCode: '081',
    title: 'Total Drag Curve & VMD',
    durationSec: 57,
    examTakeaway: 'Minimum total drag (VMD) occurs where induced drag equals parasite drag.',
    driveFileId: '1zMco8SpMrt-FF6ZgPE6LVJES0G1Mvfjo',
    dayBatch: 1,
  },
  [View.AIR_LAW_ACCIDENT]: {
    view: View.AIR_LAW_ACCIDENT,
    subjectCode: '010',
    title: "Annex 13 Accident Investigation",
    durationSec: 59,
    examTakeaway: "ICAO Annex 13 sole objective is accident prevention, led by the State of Occurrence.",
    driveFileId: '1JK_tEqZK1nepfPqbdcZq7gueOoXfNPg2',
    dayBatch: 2,
  },
  [View.AIR_LAW_AERODROME_VIS]: {
    view: View.AIR_LAW_AERODROME_VIS,
    subjectCode: '010',
    title: "Visual Aids, Markings & PAPI",
    durationSec: 60,
    examTakeaway: "Runway markings are white, taxiways yellow; PAPI 2 white / 2 red marks an on-slope 3\u00b0 glidepath.",
    driveFileId: '1fiEWN2D_K_OntMPVIrWZx7cZ74OX587f',
    dayBatch: 2,
  },
  [View.AIR_LAW_AIRWORTHINESS]: {
    view: View.AIR_LAW_AIRWORTHINESS,
    subjectCode: '010',
    title: "Annex 8 Airworthiness & ARC",
    durationSec: 61,
    examTakeaway: "The State of Registry issues the non-expiring C of A, kept valid annually by the 12-month ARC.",
    driveFileId: '1yzr8LRs1FTNbcxG-lRRFp7EwulyYaMVS',
    dayBatch: 2,
  },
  [View.AIR_LAW_AIS_DEEP_DIVE]: {
    view: View.AIR_LAW_AIS_DEEP_DIVE,
    subjectCode: '010',
    title: "AIS Deep Dive: AIRAC, NOTAM & SNOWTAM",
    durationSec: 66,
    examTakeaway: "AIRAC publishes permanently effective operational changes on a strict 28-day cycle; NOTAMs cap at 3 months.",
    driveFileId: '1mwcBqlwY_TAqgLVlbuoTBrED2Az_tmIV',
    dayBatch: 2,
  },
  [View.AIR_LAW_ALTIMETER]: {
    view: View.AIR_LAW_ALTIMETER,
    subjectCode: '010',
    title: "Altimetry: TA, TL, QNH & QNE",
    durationSec: 64,
    examTakeaway: "Set 1013.25 hPa climbing past Transition Altitude; set QNH descending past Transition Level (high to low, look out below).",
    driveFileId: '1udQicx2f0m446u0sBRpS3X9i7mtD-1LN',
    dayBatch: 2,
  },
  [View.AIR_LAW_ANNEXES]: {
    view: View.AIR_LAW_ANNEXES,
    subjectCode: '010',
    title: "The 19 ICAO Annexes Map",
    durationSec: 62,
    examTakeaway: "Annex 2 governs Rules of the Air, Annex 6 Operations, Annex 11 ATS, Annex 14 Aerodromes, Annex 19 Safety Management.",
    driveFileId: '1iyCXrkqEJHFSdUr4C1DB2OaWsJ6QoUcV',
    dayBatch: 2,
  },
  [View.AIR_LAW_CONVENTIONS]: {
    view: View.AIR_LAW_CONVENTIONS,
    subjectCode: '010',
    title: "Tokyo, Hague & Montreal Conventions",
    durationSec: 68,
    examTakeaway: "Tokyo 1963 grants Aircraft Commander restraint powers; Hague 1970 targets hijacking; Montreal 1971 targets sabotage.",
    driveFileId: '1UIIDHAT90iPR5hH0-FYnQjP1p12Z-SUq',
    dayBatch: 2,
  },
  [View.AIR_LAW_CRUISING]: {
    view: View.AIR_LAW_CRUISING,
    subjectCode: '010',
    title: "Semi-Circular Cruising Levels & RVSM",
    durationSec: 66,
    examTakeaway: "Magnetic tracks 000\u2013179\u00b0 fly ODD flight levels and 180\u2013359\u00b0 EVEN; RVSM halves separation to 1,000 ft between FL290 and FL410.",
    driveFileId: '1m9fBHjL1iW6v49c1YEXNoOVq82y5bAVy',
    dayBatch: 2,
  },
  [View.AIR_LAW_DECLARED_DIST]: {
    view: View.AIR_LAW_DECLARED_DIST,
    subjectCode: '010',
    title: "Annex 14 Declared Runway Distances",
    durationSec: 61,
    examTakeaway: "TORA + Stopway = ASDA; TORA + Clearway = TODA; a displaced threshold reduces LDA for landing but still counts for takeoff.",
    driveFileId: '17nUSsXmRifzoA7h7jBe8grglWGO3HaVB',
    dayBatch: 2,
  },
  [View.AIR_LAW_DOCS]: {
    view: View.AIR_LAW_DOCS,
    subjectCode: '010',
    title: "Chicago Art. 29 Mandatory Onboard Docs",
    durationSec: 62,
    examTakeaway: "International flights must carry C of R, C of A, Crew Licenses, Journey Log, Radio License, Noise Cert & Manifests (AOC for CAT).",
    driveFileId: '16M-3ul51-aA6UZUZVU_-SY8BOZapPpKx',
    dayBatch: 2,
  },
  [View.AIR_LAW_EMERGENCY]: {
    view: View.AIR_LAW_EMERGENCY,
    subjectCode: '010',
    title: "Emergency Squawks, MAYDAY & PIC Deviation",
    durationSec: 71,
    examTakeaway: "7700 Emergency, 7600 Comms Loss, 7500 Hijack; MAYDAY indicates grave/imminent danger; PIC may deviate as required for safety.",
    driveFileId: '1FAqHJIooguNggj-DfSYdC2Xzee9N8Bdk',
    dayBatch: 3,
  },
  [View.AIR_LAW_FACILITATION]: {
    view: View.AIR_LAW_FACILITATION,
    subjectCode: '010',
    title: "Annex 9 Facilitation & Deportees",
    durationSec: 63,
    examTakeaway: "Under Annex 9, airlines handle repatriation of Inadmissible Persons, whereas States manage Deportees; crew carry a Crew Member Certificate.",
    driveFileId: '1kDpAPuAEkrmc1L_QDcjInKEKaIY5USCN',
    dayBatch: 3,
  },
  [View.AIR_LAW_GROUND_OPS]: {
    view: View.AIR_LAW_GROUND_OPS,
    subjectCode: '010',
    title: "Marshalling Signals & Apron Safety",
    durationSec: 54,
    examTakeaway: "Crossed illuminated wands overhead always mean STOP; ground vehicles always yield to taxiing aircraft on the apron.",
    driveFileId: '1FB1IIXe26z_snH_lahjT4pt5tdoBIuq7',
    dayBatch: 3,
  },
  [View.AIR_LAW_HOLDING]: {
    view: View.AIR_LAW_HOLDING,
    subjectCode: '010',
    title: "PANS-OPS Holding Patterns & Entries",
    durationSec: 58,
    examTakeaway: "Standard holds turn RIGHT; outbound leg is 1.0 min \u2264 FL140 and 1.5 min > FL140; entry splits 180\u00b0 Direct, 110\u00b0 Parallel, 70\u00b0 Teardrop.",
    driveFileId: '1rO8sIZzJvPIWQ2CSrtEpVQ9Kn3yFxwzZ',
    dayBatch: 3,
  },
  [View.AIR_LAW_IFR_VFR]: {
    view: View.AIR_LAW_IFR_VFR,
    subjectCode: '010',
    title: "SERA VMC Minima: FL100, 1500m & Class G",
    durationSec: 68,
    examTakeaway: "VMC requires 8 km visibility at/above FL100 and 5 km below, always 1500 m horizontal / 1000 ft vertical from cloud (except Class G \u22643000 ft).",
    driveFileId: '1CnNl3Qup-pIs6PwkSYrX5pMcq7gAOmiq',
    dayBatch: 3,
  },
  [View.AIR_LAW_INSTRUMENT]: {
    view: View.AIR_LAW_INSTRUMENT,
    subjectCode: '010',
    title: "5 Segments of an Instrument Approach",
    durationSec: 60,
    examTakeaway: "Every instrument approach has Arrival, Initial, Intermediate, Final & Missed segments; precision uses DA(H) while non-precision uses MDA(H).",
    driveFileId: '1iO7P2O56iCF2qhhtzxBIUM-HMWiKaEWx',
    dayBatch: 3,
  },
  [View.AIR_LAW_INT_LAW]: {
    view: View.AIR_LAW_INT_LAW,
    subjectCode: '010',
    title: "Chicago 1944, Cabotage & Freedoms of the Air",
    durationSec: 75,
    examTakeaway: "Article 1 establishes complete and exclusive national airspace sovereignty; Article 7 reserves domestic cabotage; Freedoms 1\u20132 are technical, 3\u20135 commercial.",
    driveFileId: '1Mn8HeCmzP_aMygswRtCAtoZGbWvOeJnp',
    dayBatch: 3,
  },
  [View.AIR_LAW_INTERCEPT]: {
    view: View.AIR_LAW_INTERCEPT,
    subjectCode: '010',
    title: "Civil Interception Signals (Annex 2)",
    durationSec: 65,
    examTakeaway: "Wing rocking means Follow Me; abrupt 90\u00b0 climbing left breakaway means Proceed; gear down + steady landing lights over RWY means Land Here.",
    driveFileId: '1O1xboBYHoB0Wib_Q36fqGLF3wtambkb1',
    dayBatch: 3,
  },
  [View.AIR_LAW_LAYERS]: {
    view: View.AIR_LAW_LAYERS,
    subjectCode: '010',
    title: "ICAO Airspace Classes A through G",
    durationSec: 65,
    examTakeaway: "Class A allows IFR only; Class C separates IFR from VFR; Class D gives VFR only traffic info on other flights; Class G is uncontrolled.",
    driveFileId: '1Dl8VkHDGCs6EXIZ6Ib0CFjyCGJSTpL0B',
    dayBatch: 3,
  },
  [View.AIR_LAW_LIABILITY]: {
    view: View.AIR_LAW_LIABILITY,
    subjectCode: '010',
    title: "Montreal 1999 SDR & EC 261/2004",
    durationSec: 63,
    examTakeaway: "Montreal 1999 sets strict two-tier passenger injury liability in SDRs; EC 261/2004 pays \u20ac250/\u20ac400/\u20ac600 based on flight distance (except extraordinary circumstances).",
    driveFileId: '1YgFPEUpPWhhkeRPPchaNlAcG-ErJCN8D',
    dayBatch: 3,
  },
  [View.AIR_LAW_LIGHTGUN]: {
    view: View.AIR_LAW_LIGHTGUN,
    subjectCode: '010',
    title: "Tower Aldis Light Gun Signals",
    durationSec: 60,
    examTakeaway: "Flashing Green means Return for Landing in flight (Cleared to Taxi on ground); Flashing Red means Aerodrome Unsafe (or Taxi Clear on ground); Flashing White means Return to Starting Point.",
    driveFileId: '19r8gwSOop0TBg0ufTzQSCn6hohgyt55l',
    dayBatch: 4,
  },
  [View.AIR_LAW_LIGHTING]: {
    view: View.AIR_LAW_LIGHTING,
    subjectCode: '010',
    title: "Annex 14 Runway & Taxiway Lighting",
    durationSec: 69,
    examTakeaway: "Runway centerline runs White \u2192 900\u2013300m alternating Red/White \u2192 last 300m Solid Red; edge lights turn Yellow in the final 600 m; taxiways use Blue edges and Green centerlines.",
    driveFileId: '1pClGedh78YpYCUs-Nd9eBs1fNVKVJkb0',
    dayBatch: 4,
  },
  [View.AIR_LAW_OPS_INFO]: {
    view: View.AIR_LAW_OPS_INFO,
    subjectCode: '010',
    title: "Integrated AIS Package: AIP, SUP, AIC & PIB",
    durationSec: 69,
    examTakeaway: "The AIP has 3 parts (GEN, ENR, AD); AIP Supplements hold temporary changes \u22653 months or long text/maps; AICs hold admin/safety info; PIB briefs pre-flight NOTAMs.",
    driveFileId: '1YoFDAiUOXWt1bHlenTk3JLHGth8gvG2g',
    dayBatch: 4,
  },
  [View.AIR_LAW_ORG]: {
    view: View.AIR_LAW_ORG,
    subjectCode: '010',
    title: "ICAO, EASA, EUROCONTROL & IATA Roles",
    durationSec: 69,
    examTakeaway: "ICAO (Montreal) sets global UN SARPs; EASA (Cologne) runs EU aviation safety & rulemaking; EUROCONTROL (Brussels) manages European ATM/NMOC; IATA is the airline trade association.",
    driveFileId: '1VXR3dtVUhL2eIaK6FU_4Q_VekmrTo7mP',
    dayBatch: 4,
  },
  [View.AIR_LAW_PANS_OPS]: {
    view: View.AIR_LAW_PANS_OPS,
    subjectCode: '010',
    title: "PANS-OPS Departures & Speed Categories",
    durationSec: 61,
    examTakeaway: "Standard SID Procedure Design Gradient is 3.3% (2.5% OIS + 0.8% obstacle clearance); omnidirectional turns start \u2265120 m (394 ft); Approach Categories depend on 1.3 \u00d7 VS0 at MLW.",
    driveFileId: '1J5L8ADIGujpXIO_MHyy93JUBuCChwnfg',
    dayBatch: 4,
  },
  [View.AIR_LAW_PARALLEL_RWY]: {
    view: View.AIR_LAW_PARALLEL_RWY,
    subjectCode: '010',
    title: "Doc 4444 Parallel Runway Ops (Modes 1\u20134)",
    durationSec: 60,
    examTakeaway: "Independent approaches (Mode 1) require \u22651,035 m spacing + No Transgression Zone; Dependent (Mode 2) \u2265915 m + 1.5\u20132 NM stagger; Independent departures (Mode 3) \u2265760 m.",
    driveFileId: '18LMXayS0kWudSYdE3v3D6zt7KBzImHPe',
    dayBatch: 4,
  },
  [View.AIR_LAW_PERSONNEL]: {
    view: View.AIR_LAW_PERSONNEL,
    subjectCode: '010',
    title: "Part-FCL Licensing, Currency & Medicals",
    durationSec: 62,
    examTakeaway: "Unfrozen ATPL(A) requires age 21, 1500 hrs total & 500 hrs multi-pilot; Class 1 drops from 12 to 6 months at age 40 (single-pilot CAT) or 60 (all); 90-day currency needs 3 T/O & landings.",
    driveFileId: '1A3KOHu6F5iwS-ETm7hZN7cxoE_nqym95',
    dayBatch: 4,
  },
  [View.AIR_LAW_REF_CODE]: {
    view: View.AIR_LAW_REF_CODE,
    subjectCode: '010',
    title: "Annex 14 Aerodrome Reference Code",
    durationSec: 60,
    examTakeaway: "Reference Code pairs Number 1\u20134 (Aeroplane Reference Field Length) with Letter A\u2013F (Wingspan up to 80 m \u2014 OMGWS was decoupled in modern Annex 14).",
    driveFileId: '1_CsWl53zna4nntmWX5S6CMFijwPlEIJZ',
    dayBatch: 4,
  },
  [View.AIR_LAW_REGISTRATION]: {
    view: View.AIR_LAW_REGISTRATION,
    subjectCode: '010',
    title: "Annex 7 Aircraft Nationality & Marks",
    durationSec: 66,
    examTakeaway: "Annex 7 marks pair Nationality + Registration separated by a hyphen, require a fireproof ID plate near the main entrance, and mandate 50 cm wing / 30 cm fuselage minimum letter height.",
    driveFileId: '14L3NPU6PDyhQFAoa6qfqFKe0jh1HVNin',
    dayBatch: 4,
  },
  [View.AIR_LAW_RULES_DETAILS]: {
    view: View.AIR_LAW_RULES_DETAILS,
    subjectCode: '010',
    title: "Right-of-Way & SERA Minimum Heights",
    durationSec: 64,
    examTakeaway: "Least-maneuverable gives priority (Balloon > Glider > Airship > Engine); converging gives way to RIGHT; head-on BOTH turn RIGHT; min heights 1000 ft / 600 m congested, 500 ft elsewhere.",
    driveFileId: '1Ezdmq48kkeHPDkv6aMyaX7V8D296tcAs',
    dayBatch: 4,
  },
};

export function hasPlayableVideo(entry?: TopicVideoEntry): entry is TopicVideoEntry {
  return Boolean(entry && (entry.driveFileId?.trim() || entry.videoUrl?.trim()));
}

export function getTopicVideo(view: View): TopicVideoEntry | null {
  const entry = TOPIC_VIDEOS[view];
  return hasPlayableVideo(entry) ? entry : null;
}

export function getSubjectPublishedVideos(subjectCode: string): TopicVideoEntry[] {
  return Object.values(TOPIC_VIDEOS).filter(
    (entry): entry is TopicVideoEntry =>
      hasPlayableVideo(entry) && entry.subjectCode === subjectCode
  );
}

export function getEmbedUrl(entry: TopicVideoEntry): string {
  if (entry.videoUrl?.trim()) {
    return entry.videoUrl.trim();
  }
  const fileId = entry.driveFileId?.trim() || '';
  return `https://drive.google.com/file/d/${fileId}/preview`;
}
