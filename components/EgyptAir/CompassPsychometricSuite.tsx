import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View } from '../../types';
import {
  ArrowLeft,
  Compass,
  Cpu,
  Calculator,
  Wrench,
  Activity,
  Crosshair,
  Headphones,
  FileText,
  UserCheck,
  Play,
  RotateCcw,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Gamepad2,
  ChevronRight,
  Sparkles,
  Eye,
  Grid,
  Zap,
} from 'lucide-react';

interface Props {
  onChangeView: (view: View) => void;
}

export type PsychModuleId =
  | 'HUB'
  | 'ORIENTATION'
  | 'MEMORY'
  | 'MATHEMATICS'
  | 'TECHNICAL_INSIGHT'
  | 'TASK_MANAGER'
  | 'CONTROL_TASK'
  | 'ENGLISH_PROFICIENCY'
  | 'VERBAL_REASONING'
  | 'PERSONALITY_TEST'
  | 'AON_CMT'
  | 'AON_SCALES';

interface ModuleScoreRecord {
  completed: boolean;
  bestScore: number; // 0-100
  stanine: number; // 1-9
  attempts: number;
  lastPlayed?: string;
}

const STORAGE_KEY = 'atplvector_compass_aon_scores_v1';

const calcStanine = (pct: number): number => {
  if (pct >= 93) return 9;
  if (pct >= 85) return 8;
  if (pct >= 75) return 7;
  if (pct >= 62) return 6;
  if (pct >= 48) return 5;
  if (pct >= 35) return 4;
  if (pct >= 22) return 3;
  if (pct >= 10) return 2;
  return 1;
};

// ═══════════════════════════════════════════════════════════════════════════════
// 1. ORIENTATION (RBI + Artificial Horizon + Gyro Compass + 5x5 NDB Grid)
//    Exact replica of the user's 2nd uploaded image!
// ═══════════════════════════════════════════════════════════════════════════════
interface OrientationRound {
  rbiAngle: number; // degrees where needle points on RBI (0 = straight ahead, 90 = right wing, 180 = tail, 270 = left wing)
  compassHeading: number; // 0 (N), 90 (E), 180 (S), 270 (W) or 45-deg increments
  pitchDeg: number; // -15 (nose down), 0 (level), +15 (nose up)
  bankDeg: number; // -25 (left bank), 0 (level), +25 (right bank)
  options: {
    id: number; // 1, 2, 3, 4
    row: number; // 0..4 (NDB is at row 2, col 2)
    col: number; // 0..4
    heading: number; // direction aircraft icon faces
    bank: number; // -25, 0, 25
    pitch: number; // -15, 0, 15
  }[];
  correctId: number;
  explanation: string;
}

const generateOrientationRound = (): OrientationRound => {
  // Cardinal headings: 0 (N), 90 (E), 180 (S), 270 (W)
  const headings = [0, 90, 180, 270];
  const compassHeading = headings[Math.floor(Math.random() * headings.length)];
  // RBI needle relative bearing: 0 (ahead), 90 (right), 180 (behind), 270 (left)
  const rbis = [0, 90, 180, 270];
  const rbiAngle = rbis[Math.floor(Math.random() * rbis.length)];
  const banks = [-25, 0, 25];
  const bankDeg = banks[Math.floor(Math.random() * banks.length)];
  const pitches = [-12, 0, 12];
  const pitchDeg = pitches[Math.floor(Math.random() * pitches.length)];

  // QDM (Magnetic bearing TO the NDB station at center (2,2)) = (compassHeading + rbiAngle) % 360
  const qdm = (compassHeading + rbiAngle) % 360;
  // QDR (Bearing FROM the NDB station to the aircraft) = (qdm + 180) % 360
  const qdr = (qdm + 180) % 360;

  // Map QDR to grid cell relative to center (row 2, col 2):
  // QDR 0 (North of NDB) -> row 0 or 1, col 2
  // QDR 90 (East of NDB) -> row 2, col 3 or 4
  // QDR 180 (South of NDB) -> row 3 or 4, col 2
  // QDR 270 (West of NDB) -> row 2, col 0 or 1
  const getCellForQdr = (angle: number, dist: 1 | 2): { row: number; col: number } => {
    if (angle === 0) return { row: 2 - dist, col: 2 };
    if (angle === 90) return { row: 2, col: 2 + dist };
    if (angle === 180) return { row: 2 + dist, col: 2 };
    return { row: 2, col: 2 - dist };
  };

  const correctPos = getCellForQdr(qdr, 1);

  // Build 4 distinct aircraft options on the grid
  const usedCells = new Set<string>([`2,2`, `${correctPos.row},${correctPos.col}`]);
  const options: OrientationRound['options'] = [];

  const candidatePositions = [
    { row: 2, col: 0 },
    { row: 2, col: 1 },
    { row: 1, col: 2 },
    { row: 0, col: 2 },
    { row: 3, col: 2 },
    { row: 4, col: 2 },
    { row: 2, col: 3 },
    { row: 2, col: 4 },
    { row: 1, col: 1 },
    { row: 3, col: 3 },
  ];

  // Decide which ID (1..4) is correct
  const correctId = Math.floor(Math.random() * 4) + 1;

  for (let i = 1; i <= 4; i++) {
    if (i === correctId) {
      options.push({
        id: i,
        row: correctPos.row,
        col: correctPos.col,
        heading: compassHeading,
        bank: bankDeg,
        pitch: pitchDeg,
      });
    } else {
      // Pick either a wrong position or wrong heading/bank
      const available = candidatePositions.filter((p) => !usedCells.has(`${p.row},${p.col}`));
      const pos = available[Math.floor(Math.random() * available.length)] || { row: 0, col: i };
      usedCells.add(`${pos.row},${pos.col}`);
      // Sometimes give it the right heading so position matters, or wrong heading
      const wrongHeading =
        Math.random() > 0.4
          ? compassHeading
          : headings.filter((h) => h !== compassHeading)[Math.floor(Math.random() * 3)];
      options.push({
        id: i,
        row: pos.row,
        col: pos.col,
        heading: wrongHeading,
        bank: bankDeg,
        pitch: pitchDeg,
      });
    }
  }

  const hdgName =
    compassHeading === 0 ? 'North (360°)' : compassHeading === 90 ? 'East (090°)' : compassHeading === 180 ? 'South (180°)' : 'West (270°)';
  const rbiName =
    rbiAngle === 0
      ? '000° (NDB is directly ahead of the nose)'
      : rbiAngle === 90
      ? '090° (NDB is off the right wing)'
      : rbiAngle === 180
      ? '180° (NDB is directly behind the tail)'
      : '270° (NDB is off the left wing)';

  return {
    rbiAngle,
    compassHeading,
    pitchDeg,
    bankDeg,
    options,
    correctId,
    explanation: `Compass shows Heading ${hdgName}. RBI points to ${rbiName}. Therefore QDM = ${qdm}° and aircraft is located at QDR ${qdr}° from the central NDB cross (Aircraft #${correctId}).`,
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// 2. MATHEMATICS & 4. TECHNICAL INSIGHT & 7. ENGLISH & 8. VERBAL & 9. PERSONALITY
//    Question Banks
// ═══════════════════════════════════════════════════════════════════════════════
interface MCQItem {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
  category?: string;
}

const MATH_QUESTIONS: MCQItem[] = [
  {
    q: 'An aircraft flies at Ground Speed 420 kt. How many nautical miles does it cover in 18 minutes?',
    options: ['116 NM', '126 NM', '132 NM', '140 NM'],
    correct: 1,
    explanation: '420 kt = 7 NM/min. In 18 minutes: 7 × 18 = 126 NM.',
  },
  {
    q: 'Your fuel flow is 2,400 kg/hr total. You have 6,600 kg of usable fuel remaining. What is your endurance?',
    options: ['2 hr 30 min', '2 hr 45 min', '2 hr 50 min', '3 hr 15 min'],
    correct: 1,
    explanation: '6600 / 2400 = 2.75 hours = 2 hours 45 minutes.',
  },
  {
    q: 'You need to descend from FL350 to FL110 at a ground speed of 450 kt with a 3° glidepath. Using the 3-to-1 rule, when should you start descent and at what rate?',
    options: [
      '72 NM out at 2,250 ft/min',
      '80 NM out at 1,800 ft/min',
      '64 NM out at 2,500 ft/min',
      '75 NM out at 2,100 ft/min',
    ],
    correct: 0,
    explanation: 'Altitude to lose = 24,000 ft. Distance = 24 × 3 = 72 NM. ROD = GS × 5 = 450 × 5 = 2,250 ft/min.',
  },
  {
    q: 'After flying 45 NM, you are 3 NM off track to the left. Using the 1-in-60 rule, what is your track error angle?',
    options: ['3°', '4°', '5°', '6°'],
    correct: 1,
    explanation: 'TE = (3 / 45) × 60 = 180 / 45 = 4°.',
  },
  {
    q: 'Runway 24 has a surface wind of 210° at 28 kt. Using the 30° crosswind rule of thumb (sin 30° = 0.5), what is the crosswind component?',
    options: ['12 kt', '14 kt', '21 kt', '24 kt'],
    correct: 1,
    explanation: 'Angle off nose = 240° - 210° = 30°. Crosswind = 28 × sin(30°) = 28 × 0.5 = 14 kt.',
  },
  {
    q: 'Mental Arithmetic: (18 × 15) − 45 = ?',
    options: ['215', '225', '235', '245'],
    correct: 1,
    explanation: '18 × 15 = 270. 270 − 45 = 225.',
  },
  {
    q: 'An Airbus A320 Uplifts 4,000 US Gallons of Jet-A1 (Specific Gravity = 0.80 kg/L, 1 USG = 3.785 L). Approximately how many kilograms were uplifted?',
    options: ['10,500 kg', '12,100 kg', '14,200 kg', '15,140 kg'],
    correct: 1,
    explanation: '4000 × 3.785 = 15,140 Liters. 15,140 × 0.80 = 12,112 kg (~12,100 kg).',
  },
  {
    q: 'You are flying Mach 0.78 where local speed of sound is 580 kt. What is your True Airspeed (TAS) approximately?',
    options: ['432 kt', '452 kt', '468 kt', '480 kt'],
    correct: 1,
    explanation: '0.78 × 580 = 452.4 kt.',
  },
  {
    q: 'If 3 tankers can refuel 6 aircraft in 45 minutes, how long does it take 5 tankers to refuel 10 aircraft at the same rate?',
    options: ['30 minutes', '45 minutes', '60 minutes', '75 minutes'],
    correct: 1,
    explanation: 'Each tanker refuels 2 aircraft in 45 minutes. So 5 tankers refueling 10 aircraft (2 each) still takes 45 minutes.',
  },
  {
    q: 'Reciprocal Heading: Your current heading is 317°. What is the reciprocal heading?',
    options: ['127°', '137°', '147°', '157°'],
    correct: 1,
    explanation: '317 − 200 + 20 = 137°.',
  },
];

const TECH_INSIGHT_QUESTIONS: MCQItem[] = [
  {
    category: 'Thermodynamics & Venturi',
    q: 'In a subsonic Venturi tube, as air passes through the constricted throat section, how do velocity and static pressure change?',
    options: [
      'Velocity increases and static pressure decreases',
      'Velocity increases and static pressure increases',
      'Velocity decreases and static pressure increases',
      'Both velocity and total pressure increase',
    ],
    correct: 0,
    explanation: 'By Bernoulli’s Principle (conservation of energy), total pressure remains constant while dynamic pressure (velocity) rises and static pressure drops at the throat.',
  },
  {
    category: 'Mechanical Advantage',
    q: 'A hydraulic jack has a master piston area of 2 cm² and a slave actuator piston area of 40 cm². If a pilot applies 50 N of force to the master piston, what force is exerted by the slave piston?',
    options: ['250 N', '500 N', '1,000 N', '2,000 N'],
    correct: 2,
    explanation: 'Pressure P = F1 / A1 = 50 / 2 = 25 N/cm². Output force F2 = P × A2 = 25 × 40 = 1,000 N (20x mechanical advantage).',
  },
  {
    category: 'Electrical Circuits',
    q: 'Three identical 30 Ω resistors are connected in parallel across a 28V DC aircraft bus. What is the equivalent total resistance of the circuit?',
    options: ['10 Ω', '30 Ω', '60 Ω', '90 Ω'],
    correct: 0,
    explanation: 'For N identical resistors in parallel, R_eq = R / N = 30 / 3 = 10 Ω.',
  },
  {
    category: 'Gear Trains',
    q: 'Gear A (20 teeth) meshes directly with Gear B (60 teeth), which meshes directly with Gear C (30 teeth). If Gear A rotates clockwise at 120 RPM, how does Gear C rotate?',
    options: [
      'Clockwise at 80 RPM',
      'Counter-clockwise at 80 RPM',
      'Clockwise at 40 RPM',
      'Counter-clockwise at 180 RPM',
    ],
    correct: 0,
    explanation: 'A is CW -> B is CCW -> C is CW. Speed ratio = (20 / 30) × 120 RPM = 80 RPM Clockwise.',
  },
  {
    category: 'Rotational Moments',
    q: 'A uniform seesaw beam is pivoted at its center. A 60 kg mass sits 2.0 m to the left of the pivot. Where must an 80 kg mass be placed on the right side to achieve static equilibrium?',
    options: ['1.25 m', '1.50 m', '1.75 m', '2.00 m'],
    correct: 1,
    explanation: 'Torque balance: 60 × 2.0 = 120 kg·m. Distance d = 120 / 80 = 1.50 m.',
  },
  {
    category: 'Gas Laws',
    q: 'An aircraft tire is inflated to 200 psi absolute at 27°C (300 K). After a rejected takeoff, the tire temperature rises to 177°C (450 K) at constant volume. What is the new absolute pressure?',
    options: ['250 psi', '300 psi', '350 psi', '400 psi'],
    correct: 1,
    explanation: 'Gay-Lussac’s Law (P1/T1 = P2/T2): P2 = 200 × (450 / 300) = 200 × 1.5 = 300 psi.',
  },
  {
    category: 'Center of Gravity & Inertia',
    q: 'When an aircraft’s Center of Gravity (CG) moves toward the aft limit, what happens to longitudinal static stability and stall speed?',
    options: [
      'Stability decreases and stall speed decreases',
      'Stability increases and stall speed increases',
      'Stability decreases and stall speed increases',
      'Stability increases and stall speed decreases',
    ],
    correct: 0,
    explanation: 'An aft CG reduces the tailplane moment arm (reducing longitudinal stability) and requires less tail downforce, reducing total wing loading and lowering stall speed.',
  },
  {
    category: 'Pulleys',
    q: 'A block-and-tackle pulley system has 4 supporting rope segments lifting a 200 kg jet engine component. Ignoring friction, how much pull force is required on the free rope end, and how much rope must be pulled to raise the load by 1 meter?',
    options: [
      '50 kgf pull, 4 meters of rope',
      '50 kgf pull, 2 meters of rope',
      '100 kgf pull, 4 meters of rope',
      '40 kgf pull, 5 meters of rope',
    ],
    correct: 0,
    explanation: 'With 4 supporting strands, Mechanical Advantage = 4. Effort = 200 / 4 = 50 kgf, and rope travel = 4 × 1 m = 4 m.',
  },
];

const ENGLISH_QUESTIONS: MCQItem[] = [
  {
    category: 'ICAO Phraseology',
    q: 'ATC transmits: "EgyptAir 804, Cairo Approach, descend to reach FL120 by MENLI, QNH 1014." What does "by MENLI" require the crew to do?',
    options: [
      'Start the descent only after passing waypoint MENLI',
      'Be level at FL120 at or before reaching waypoint MENLI',
      'Hold at MENLI at FL120 until further advised',
      'Cross MENLI at any altitude and then descend to FL120',
    ],
    correct: 1,
    explanation: 'In ICAO Doc 4444 phraseology, "descend to reach [level] by [significant point]" means the aircraft must cross that point at or already level at the specified altitude/flight level.',
  },
  {
    category: 'Aviation Vocabulary',
    q: 'During pre-flight briefing, the NOTAM states: "RWY 05R/23L CLSD DUE TO WIP ADJ TWY BRAVO." What is the meaning of "WIP ADJ"?',
    options: [
      'Weather induced precipitation adjacent to',
      'Work in progress adjacent to',
      'Wind indicator pole adjusted on',
      'Wing inspection procedure adjacent to',
    ],
    correct: 1,
    explanation: 'WIP = Work In Progress; ADJ = Adjacent.',
  },
  {
    category: 'Grammar & Operational Clarity',
    q: 'Select the grammatically and operationally correct statement for an aircraft cabin PA announcement during turbulence:',
    options: [
      '"Had the turbulence worsened, the cabin crew will have been seated immediately."',
      '"Should turbulence intensify, cabin service will be temporarily suspended for your safety."',
      '"Unless the seatbelt sign is illuminated, passengers must not unfasten their belts."',
      '"Despite of the weather radar indication, we are expecting smooth rides."',
    ],
    correct: 1,
    explanation: '"Should turbulence intensify..." is a standard inverted first-conditional expressing a realistic operational precaution.',
  },
  {
    category: 'ATC Nuance',
    q: 'Tower says: "EgyptAir 777, behind the landing Airbus A330, line up and wait Runway 05C behind." Why is the word "behind" repeated twice?',
    options: [
      'Radio echo error from the tower transmitter',
      'Standard ICAO conditional clearance format to prevent premature runway incursion',
      'To instruct the pilot to taxi behind the tower building',
      'To cancel the previous landing clearance of the A330',
    ],
    correct: 1,
    explanation: 'ICAO conditional clearances follow: Callsign + Condition ("behind the landing A330") + Clearance ("line up and wait") + Repetition of condition ("behind").',
  },
  {
    category: 'Lexical Precision',
    q: 'If an aircraft experiences an "uncommanded yaw excursion" shortly after V1, the movement is:',
    options: [
      'Deliberately input by the Pilot Flying via the rudder pedals',
      'An involuntary nose-left or nose-right rotation not initiated by crew control input',
      'A gradual pitch-up tendency caused by ground effect',
      'A normal roll response to aileron deflection',
    ],
    correct: 1,
    explanation: '"Uncommanded" means occurring without pilot or autopilot input; "yaw excursion" is rotation around the vertical axis.',
  },
  {
    category: 'Audio / Readback Accuracy',
    q: 'ATC: "EgyptAir 985, expedite vacating via high-speed taxiway Golf, traffic 2 miles final." Which response represents the required pilot action?',
    options: [
      'Perform a go-around immediately',
      'Clear the active runway promptly at exit Golf without delay while maintaining safe taxi control',
      'Come to a full stop on the runway centerline and wait for follow-me vehicle',
      'Switch immediately to Ground frequency before crossing the hold-short line',
    ],
    correct: 1,
    explanation: '"Expedite vacating" means exit the runway without delay so the trailing arrival on 2-mile final does not have to go around.',
  },
];

interface VerbalPassage {
  title: string;
  passage: string;
  statement: string;
  correct: 'TRUE' | 'FALSE' | 'CANNOT_SAY';
  explanation: string;
}

const VERBAL_PASSAGES: VerbalPassage[] = [
  {
    title: 'ECAR Part 121 — Reduced Contingency Fuel (RCF) Policy',
    passage:
      'Under EgyptAir Operations Manual Part A and ECAR 121, standard contingency fuel is 5% of the planned trip fuel or, in the event of in-flight replanning, 5% of the trip fuel for the remainder of the flight. However, the operator may reduce contingency fuel to 3% of planned trip fuel provided that an en-route alternate aerodrome (ERA) is available within a predetermined radius of the route, or if the aircraft is equipped with a computerized fuel monitoring system approved by the Authority. Under no circumstances may total contingency fuel at dispatch be less than the amount required to fly for 5 minutes at holding speed at 1,500 ft (450 m) above the destination aerodrome in standard conditions.',
    statement:
      'If an aircraft uses an approved computerized fuel monitoring system, it is permitted to dispatch with less than 5 minutes of holding fuel at 1,500 ft above the destination.',
    correct: 'FALSE',
    explanation:
      'The passage explicitly states: "Under no circumstances may total contingency fuel at dispatch be less than the amount required to fly for 5 minutes at holding speed at 1,500 ft."',
  },
  {
    title: 'ECAR Part 121 — Reduced Contingency Fuel (RCF) Policy',
    passage:
      'Under EgyptAir Operations Manual Part A and ECAR 121, standard contingency fuel is 5% of the planned trip fuel or, in the event of in-flight replanning, 5% of the trip fuel for the remainder of the flight. However, the operator may reduce contingency fuel to 3% of planned trip fuel provided that an en-route alternate aerodrome (ERA) is available within a predetermined radius of the route, or if the aircraft is equipped with a computerized fuel monitoring system approved by the Authority. Under no circumstances may total contingency fuel at dispatch be less than the amount required to fly for 5 minutes at holding speed at 1,500 ft (450 m) above the destination aerodrome in standard conditions.',
    statement:
      'All Airbus A320neo aircraft in the EgyptAir fleet are equipped with the computerized fuel monitoring system required for 3% contingency fuel.',
    correct: 'CANNOT_SAY',
    explanation:
      'The passage mentions the rule for aircraft equipped with a computerized fuel monitoring system, but gives no information on which specific aircraft types in the fleet have it installed.',
  },
  {
    title: 'High-Altitude Windshear & Microburst Recovery Protocol',
    passage:
      'Microbursts produce intense localized downdrafts that spread outward upon striking the ground, creating a rapid shift from headwind to tailwind over a horizontal distance of less than 4 km. When predictive windshear (PWS) issues a warning icon and aural alert during takeoff roll prior to V1, the Commander shall reject the takeoff if sufficient runway remains. If reactive windshear is encountered after V1, the flight crew must immediately select TOGA thrust, disconnect the autopilot if engaged, follow flight director pitch guidance (or pitch initially to 15 degrees nose-up), and leave flap and landing gear configuration unchanged until positively clear of the shear.',
    statement:
      'When encountering reactive windshear after passing V1, retracting the landing gear immediately is prohibited until the aircraft is clear of the windshear.',
    correct: 'TRUE',
    explanation:
      'The text states: "leave flap and landing gear configuration unchanged until positively clear of the shear" because opening gear doors temporarily increases drag.',
  },
  {
    title: 'Flight Deck Authority Gradient & CRM Intervention',
    passage:
      'Post-accident investigations indicate that an excessively steep trans-cockpit authority gradient—often found when a senior training captain flies with a newly qualified cadet first officer—inhibits timely verbal intervention during approach destabilization. Conversely, an overly flat gradient between two peers of identical rank can lead to ambiguity regarding final command responsibility. Modern Threat and Error Management (TEM) training standardizes a "Two-Challenge Rule": if a Pilot Monitoring states two consecutive corrective callouts regarding an exceedance without acknowledgement or action from the Pilot Flying, the Pilot Monitoring is mandated to assume manual control.',
    statement:
      'According to the passage, a cockpit crew consisting of two captains of equal seniority always achieves safer approach stabilization than a senior captain paired with a junior first officer.',
    correct: 'FALSE',
    explanation:
      'The passage states that an overly flat gradient between two peers of identical rank can also cause problems ("ambiguity regarding final command responsibility").',
  },
];

interface CPPStatement {
  id: number;
  text: string;
  dimension: 'RESILIENCE' | 'TEAMWORK' | 'DISCIPLINE' | 'ASSERTIVENESS' | 'CONSISTENCY_PAIR_A';
  idealPolarity: 1 | -1; // 1 = Agree is better, -1 = Disagree is better
}

const PERSONALITY_STATEMENTS: CPPStatement[] = [
  {
    id: 1,
    text: 'When a standard checklist feels repetitive on a familiar route, I still verify every single item visually rather than relying on memory.',
    dimension: 'DISCIPLINE',
    idealPolarity: 1,
  },
  {
    id: 2,
    text: 'If a senior Captain makes a minor procedural deviation during a high-workload approach, I prefer to wait until after landing to mention it so I do not disturb cockpit harmony.',
    dimension: 'ASSERTIVENESS',
    idealPolarity: -1,
  },
  {
    id: 3,
    text: 'After making an error during a simulator check, I can quickly compartmentalize the mistake and focus 100% on the next maneuver.',
    dimension: 'RESILIENCE',
    idealPolarity: 1,
  },
  {
    id: 4,
    text: 'In group problem-solving exercises, I find it more important that the team reaches the best safe decision than whether my personal idea is chosen.',
    dimension: 'TEAMWORK',
    idealPolarity: 1,
  },
  {
    id: 5,
    text: 'Experienced pilots who know their aircraft well can occasionally bend non-critical SOPs when schedule pressure is high.',
    dimension: 'DISCIPLINE',
    idealPolarity: -1,
  },
  {
    id: 6,
    text: 'If I notice an instrument discrepancy that I am not 100% sure about, I speak up immediately rather than staying silent out of fear of looking inexperienced.',
    dimension: 'ASSERTIVENESS',
    idealPolarity: 1,
  },
  {
    id: 7,
    text: 'When multiple unexpected changes happen at the same time, I tend to feel frustrated and prefer others to take over the planning.',
    dimension: 'RESILIENCE',
    idealPolarity: -1,
  },
  {
    id: 8,
    text: 'I actively invite feedback from instructors and fellow crew members, even when it highlights my weaknesses.',
    dimension: 'TEAMWORK',
    idealPolarity: 1,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export const CompassPsychometricSuite: React.FC<Props> = ({ onChangeView }) => {
  const [activeModule, setActiveModule] = useState<PsychModuleId>('HUB');
  const [scores, setScores] = useState<Record<string, ModuleScoreRecord>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      ORIENTATION: { completed: true, bestScore: 88, stanine: 8, attempts: 1 },
      TECHNICAL_INSIGHT: { completed: true, bestScore: 82, stanine: 7, attempts: 1 },
    };
  });

  const saveModuleScore = useCallback((modId: string, pct: number) => {
    setScores((prev) => {
      const existing = prev[modId];
      const best = existing ? Math.max(existing.bestScore, pct) : pct;
      const next = {
        ...prev,
        [modId]: {
          completed: true,
          bestScore: best,
          stanine: calcStanine(best),
          attempts: (existing?.attempts || 0) + 1,
          lastPlayed: new Date().toISOString(),
        },
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  // ─── Module 1: ORIENTATION State ──────────────────────────────────────────
  const [oriRound, setOriRound] = useState<OrientationRound>(() => generateOrientationRound());
  const [oriIndex, setOriIndex] = useState(0);
  const [oriCorrectCount, setOriCorrectCount] = useState(0);
  const [oriSelected, setOriSelected] = useState<number | null>(null);
  const [oriTimeLeft, setOriTimeLeft] = useState(90);
  const [oriFinished, setOriFinished] = useState(false);

  useEffect(() => {
    if (activeModule !== 'ORIENTATION' || oriFinished) return;
    const t = setInterval(() => {
      setOriTimeLeft((s) => {
        if (s <= 1) {
          setOriFinished(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [activeModule, oriFinished]);

  const startOrientation = () => {
    setOriRound(generateOrientationRound());
    setOriIndex(0);
    setOriCorrectCount(0);
    setOriSelected(null);
    setOriTimeLeft(90);
    setOriFinished(false);
    setActiveModule('ORIENTATION');
  };

  const handleOriPick = (id: number) => {
    if (oriSelected !== null || oriFinished) return;
    setOriSelected(id);
    const isRight = id === oriRound.correctId;
    const nextCorrect = isRight ? oriCorrectCount + 1 : oriCorrectCount;
    if (isRight) setOriCorrectCount(nextCorrect);

    setTimeout(() => {
      if (oriIndex + 1 >= 10) {
        setOriFinished(true);
        saveModuleScore('ORIENTATION', Math.round((nextCorrect / 10) * 100));
      } else {
        setOriIndex((i) => i + 1);
        setOriRound(generateOrientationRound());
        setOriSelected(null);
      }
    }, 1400);
  };

  // ─── Module 2: MEMORY (FMS / ATC Parameter Span) State ────────────────────
  const [memPhase, setMemPhase] = useState<'MEMORIZE' | 'RECALL' | 'RESULT' | 'DONE'>('MEMORIZE');
  const [memRound, setMemRound] = useState(0);
  const [memScore, setMemScore] = useState(0);
  const [memTarget, setMemTarget] = useState({ hdg: '245', fl: '340', spd: '280', sqk: '4721' });
  const [memInput, setMemInput] = useState({ hdg: '', fl: '', spd: '', sqk: '' });
  const [memCountdown, setMemCountdown] = useState(6);

  const generateMemParams = () => ({
    hdg: String(Math.floor(Math.random() * 35 + 1) * 10).padStart(3, '0'),
    fl: String(Math.floor(Math.random() * 28 + 10) * 10),
    spd: String(Math.floor(Math.random() * 14 + 18) * 10),
    sqk: `${Math.floor(Math.random() * 7 + 1)}${Math.floor(Math.random() * 8)}${Math.floor(Math.random() * 8)}${Math.floor(Math.random() * 8)}`,
  });

  const startMemory = () => {
    const p = generateMemParams();
    setMemTarget(p);
    setMemInput({ hdg: '', fl: '', spd: '', sqk: '' });
    setMemPhase('MEMORIZE');
    setMemRound(0);
    setMemScore(0);
    setMemCountdown(6);
    setActiveModule('MEMORY');
  };

  useEffect(() => {
    if (activeModule !== 'MEMORY' || memPhase !== 'MEMORIZE') return;
    const t = setInterval(() => {
      setMemCountdown((c) => {
        if (c <= 1) {
          setMemPhase('RECALL');
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [activeModule, memPhase]);

  const submitMemoryRound = () => {
    let pts = 0;
    if (memInput.hdg.trim() === memTarget.hdg) pts += 25;
    if (memInput.fl.trim() === memTarget.fl) pts += 25;
    if (memInput.spd.trim() === memTarget.spd) pts += 25;
    if (memInput.sqk.trim() === memTarget.sqk) pts += 25;
    const nextTotal = memScore + pts;
    setMemScore(nextTotal);
    setMemPhase('RESULT');
    setTimeout(() => {
      if (memRound + 1 >= 5) {
        const finalPct = Math.round(nextTotal / 5);
        saveModuleScore('MEMORY', finalPct);
        setMemPhase('DONE');
      } else {
        setMemRound((r) => r + 1);
        setMemTarget(generateMemParams());
        setMemInput({ hdg: '', fl: '', spd: '', sqk: '' });
        setMemCountdown(6);
        setMemPhase('MEMORIZE');
      }
    }, 1500);
  };

  // ─── Generic MCQ Engine (Math, Tech Insight, English) ────────────────────
  const [mcqIdx, setMcqIdx] = useState(0);
  const [mcqCorrect, setMcqCorrect] = useState(0);
  const [mcqPicked, setMcqPicked] = useState<number | null>(null);
  const [mcqDone, setMcqDone] = useState(false);

  const startMcqModule = (mod: PsychModuleId) => {
    setMcqIdx(0);
    setMcqCorrect(0);
    setMcqPicked(null);
    setMcqDone(false);
    setActiveModule(mod);
  };

  // ─── Module 5: TASK MANAGER (Multitasking FCU + Red Alert Lights + Math) ──
  const [tmTimeLeft, setTmTimeLeft] = useState(60);
  const [tmScore, setTmScore] = useState(100);
  const [tmHits, setTmHits] = useState(0);
  const [tmMisses, setTmMisses] = useState(0);
  const [tmAlertQuadrant, setTmAlertQuadrant] = useState<number | null>(1); // 0..3
  const [tmTargetFcu, setTmTargetFcu] = useState({ hdg: 180, alt: 5000, spd: 220 });
  const [tmCurrentFcu, setTmCurrentFcu] = useState({ hdg: 180, alt: 5000, spd: 210 });
  const [tmMathPrompt, setTmMathPrompt] = useState({ text: '14 + 19 = 33', isTrue: true });
  const [tmDone, setTmDone] = useState(false);

  const startTaskManager = () => {
    setTmTimeLeft(60);
    setTmScore(85);
    setTmHits(0);
    setTmMisses(0);
    setTmAlertQuadrant(Math.floor(Math.random() * 4));
    setTmTargetFcu({ hdg: 240, alt: 6000, spd: 250 });
    setTmCurrentFcu({ hdg: 230, alt: 6000, spd: 250 });
    setTmMathPrompt({ text: '15 × 4 = 60', isTrue: true });
    setTmDone(false);
    setActiveModule('TASK_MANAGER');
  };

  useEffect(() => {
    if (activeModule !== 'TASK_MANAGER' || tmDone) return;
    const timer = setInterval(() => {
      setTmTimeLeft((s) => {
        if (s <= 1) {
          setTmDone(true);
          return 0;
        }
        // Spawn new alert light every 3 seconds if none active
        if (s % 3 === 0) {
          setTmAlertQuadrant(Math.floor(Math.random() * 4));
        }
        // Issue new FCU clearance every 7 seconds
        if (s % 7 === 0) {
          const dirs = [-10, 10];
          const field = ['hdg', 'alt', 'spd'][Math.floor(Math.random() * 3)] as 'hdg' | 'alt' | 'spd';
          setTmTargetFcu((prev) => ({
            ...prev,
            [field]: prev[field] + (field === 'alt' ? dirs[Math.floor(Math.random() * 2)] * 100 : dirs[Math.floor(Math.random() * 2)]),
          }));
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeModule, tmDone]);

  useEffect(() => {
    if (tmDone && activeModule === 'TASK_MANAGER') {
      const pct = Math.max(15, Math.min(100, Math.round(50 + tmHits * 3 - tmMisses * 5)));
      saveModuleScore('TASK_MANAGER', pct);
    }
  }, [tmDone, activeModule, tmHits, tmMisses, saveModuleScore]);

  // ─── Module 6: CONTROL TASK (60fps PFD + ND Psychomotor Tracking) ────────
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctrlTimeLeft, setCtrlTimeLeft] = useState(45);
  const [ctrlDone, setCtrlDone] = useState(false);
  const [ctrlPrecision, setCtrlPrecision] = useState(100);
  const [gamepadConnected, setGamepadConnected] = useState(false);
  const ctrlStateRef = useRef({
    targetX: 0,
    targetY: 0,
    vx: 1.4,
    vy: 1.1,
    userX: 0,
    userY: 0,
    rudderTarget: 0,
    rudderUser: 0,
    rudderVel: 0.7,
    keys: {} as Record<string, boolean>,
    precisionSum: 100,
    frames: 1,
  });

  const startControlTask = () => {
    ctrlStateRef.current = {
      targetX: 0,
      targetY: 0,
      vx: 1.5,
      vy: 1.2,
      userX: 0,
      userY: 0,
      rudderTarget: 0,
      rudderUser: 0,
      rudderVel: 0.8,
      keys: {},
      precisionSum: 100,
      frames: 1,
    };
    setCtrlTimeLeft(45);
    setCtrlPrecision(100);
    setCtrlDone(false);
    setActiveModule('CONTROL_TASK');
  };

  useEffect(() => {
    if (activeModule !== 'CONTROL_TASK' || ctrlDone) return;
    const onKeyDown = (e: KeyboardEvent) => {
      ctrlStateRef.current.keys[e.key.toLowerCase()] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      ctrlStateRef.current.keys[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const timer = setInterval(() => {
      setCtrlTimeLeft((t) => {
        if (t <= 1) {
          setCtrlDone(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    let rafId: number;
    const renderLoop = () => {
      const cvs = canvasRef.current;
      if (!cvs) return;
      const ctx = cvs.getContext('2d');
      if (!ctx) return;

      const st = ctrlStateRef.current;

      // Poll hardware Gamepad API if connected
      const gps = navigator.getGamepads ? navigator.getGamepads() : [];
      const gp = gps[0];
      if (gp) {
        if (!gamepadConnected) setGamepadConnected(true);
        st.userX = Math.max(-140, Math.min(140, st.userX + gp.axes[0] * 4.5));
        st.userY = Math.max(-110, Math.min(110, st.userY + gp.axes[1] * 4.5));
        if (gp.axes[2] !== undefined) {
          st.rudderUser = Math.max(-100, Math.min(100, st.rudderUser + gp.axes[2] * 3.5));
        }
      }

      // Keyboard fallback controls (Arrow keys for pitch/roll, A/D for rudder)
      if (st.keys['arrowleft']) st.userX = Math.max(-140, st.userX - 3.5);
      if (st.keys['arrowright']) st.userX = Math.min(140, st.userX + 3.5);
      if (st.keys['arrowup']) st.userY = Math.max(-110, st.userY - 3.5);
      if (st.keys['arrowdown']) st.userY = Math.min(110, st.userY + 3.5);
      if (st.keys['a'] || st.keys['q']) st.rudderUser = Math.max(-100, st.rudderUser - 3.2);
      if (st.keys['d'] || st.keys['e']) st.rudderUser = Math.min(100, st.rudderUser + 3.2);

      // Update autonomous Flight Director / Turbulence drift
      st.targetX += st.vx;
      st.targetY += st.vy;
      if (Math.abs(st.targetX) > 105) st.vx *= -1;
      if (Math.abs(st.targetY) > 80) st.vy *= -1;
      if (Math.random() < 0.03) st.vx += (Math.random() - 0.5) * 0.9;
      if (Math.random() < 0.03) st.vy += (Math.random() - 0.5) * 0.9;
      st.vx = Math.max(-2.6, Math.min(2.6, st.vx));
      st.vy = Math.max(-2.2, Math.min(2.2, st.vy));

      // Rudder target drift
      st.rudderTarget += st.rudderVel;
      if (Math.abs(st.rudderTarget) > 80) st.rudderVel *= -1;
      if (Math.random() < 0.04) st.rudderVel += (Math.random() - 0.5) * 0.6;
      st.rudderVel = Math.max(-1.8, Math.min(1.8, st.rudderVel));

      // Compute instantaneous tracking accuracy
      const dist2D = Math.hypot(st.userX - st.targetX, st.userY - st.targetY);
      const rudderErr = Math.abs(st.rudderUser - st.rudderTarget);
      const frameScore = Math.max(0, 100 - dist2D * 0.55 - rudderErr * 0.25);
      st.precisionSum += frameScore;
      st.frames += 1;
      const avg = Math.round(st.precisionSum / st.frames);
      setCtrlPrecision(avg);

      // Draw PFD-style Canvas
      const W = cvs.width;
      const H = cvs.height;
      const cx = W / 2;
      const cy = H / 2 - 20;

      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, W, H);

      // Artificial Horizon Sky/Ground inside PFD circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 135, 0, Math.PI * 2);
      ctx.clip();

      const pitchOffset = (st.userY - st.targetY) * 0.4;
      const bankAngle = ((st.userX - st.targetX) * 0.15 * Math.PI) / 180;
      ctx.translate(cx, cy);
      ctx.rotate(bankAngle);
      ctx.fillStyle = '#0284c7'; // Sky blue
      ctx.fillRect(-200, -200 + pitchOffset, 400, 200);
      ctx.fillStyle = '#854d0e'; // Earth amber/brown
      ctx.fillRect(-200, pitchOffset, 400, 200);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-160, pitchOffset);
      ctx.lineTo(160, pitchOffset);
      ctx.stroke();
      ctx.restore();

      // PFD Bezel ring
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, 135, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Target Flight Director Crossbars (Magenta/Green)
      const tx = cx + st.targetX;
      const ty = cy + st.targetY;
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(tx, ty, 18, 0, Math.PI * 2);
      ctx.moveTo(tx - 28, ty);
      ctx.lineTo(tx + 28, ty);
      ctx.moveTo(tx, ty - 28);
      ctx.lineTo(tx, ty + 28);
      ctx.stroke();

      // Draw User Aircraft Crosshair (Yellow/Cyan)
      const ux = cx + st.userX;
      const uy = cy + st.userY;
      ctx.strokeStyle = dist2D < 28 ? '#38bdf8' : '#f43f5e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(ux, uy, 10, 0, Math.PI * 2);
      ctx.moveTo(ux - 16, uy);
      ctx.lineTo(ux + 16, uy);
      ctx.moveTo(ux, uy - 16);
      ctx.lineTo(ux, uy + 16);
      ctx.stroke();

      // Draw Rudder Yaw Coordinator Bar at bottom
      const ry = H - 32;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(cx - 120, ry - 10, 240, 20);
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(cx - 120, ry - 10, 240, 20);

      // Target rudder gate
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx + st.rudderTarget - 16, ry - 12, 32, 24);

      // User rudder ball
      ctx.fillStyle = rudderErr < 22 ? '#38bdf8' : '#f59e0b';
      ctx.beginPath();
      ctx.arc(cx + st.rudderUser, ry, 8, 0, Math.PI * 2);
      ctx.fill();

      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);
    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(timer);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [activeModule, ctrlDone, gamepadConnected]);

  useEffect(() => {
    if (ctrlDone && activeModule === 'CONTROL_TASK') {
      saveModuleScore('CONTROL_TASK', ctrlPrecision);
    }
  }, [ctrlDone, activeModule, ctrlPrecision, saveModuleScore]);

  // ─── Module 8: VERBAL REASONING State ─────────────────────────────────────
  const [vrbIdx, setVrbIdx] = useState(0);
  const [vrbCorrect, setVrbCorrect] = useState(0);
  const [vrbPicked, setVrbPicked] = useState<'TRUE' | 'FALSE' | 'CANNOT_SAY' | null>(null);
  const [vrbDone, setVrbDone] = useState(false);

  // ─── Module 9: PERSONALITY TEST (CPP) State ───────────────────────────────
  const [cppAnswers, setCppAnswers] = useState<Record<number, number>>({});
  const [cppDone, setCppDone] = useState(false);

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: COMPASS / AON 2-COLUMN BANNER HUB (Exact visual match to Image 1)
  // ═══════════════════════════════════════════════════════════════════════════
  if (activeModule === 'HUB') {
    const compassTiles: {
      id: PsychModuleId;
      title: string;
      subtitle: string;
      defaultBadge?: 'COMPLETED' | 'INACTIVE' | 'ACTIVE';
      visualBg: string;
      icon: any;
      accent: string;
    }[] = [
      {
        id: 'ORIENTATION',
        title: 'ORIENTATION',
        subtitle: 'RBI + Artificial Horizon + Gyro Compass 5x5 NDB Grid',
        defaultBadge: 'COMPLETED',
        visualBg: 'radial-gradient(circle at 18% 50%, rgba(168, 85, 247, 0.42), rgba(15, 23, 42, 0.95) 55%)',
        icon: Compass,
        accent: 'text-fuchsia-400',
      },
      {
        id: 'MEMORY',
        title: 'MEMORY',
        subtitle: 'FMS CDU Scratchpad & ATC 4-Parameter Working Memory Recall',
        visualBg: 'radial-gradient(circle at 18% 50%, rgba(34, 197, 94, 0.35), rgba(15, 23, 42, 0.95) 55%)',
        icon: Cpu,
        accent: 'text-emerald-400',
      },
      {
        id: 'MATHEMATICS',
        title: 'MATHEMATICS',
        subtitle: 'Mental Speed-Distance-Time, 1-in-60, Fuel Flow & Crosswind',
        visualBg: 'radial-gradient(circle at 18% 50%, rgba(56, 189, 248, 0.38), rgba(15, 23, 42, 0.95) 55%)',
        icon: Calculator,
        accent: 'text-sky-400',
      },
      {
        id: 'TECHNICAL_INSIGHT',
        title: 'TECHNICAL INSIGHT',
        subtitle: 'Aviation Physics, Hydraulics, Venturi, Circuits & Gear Trains',
        defaultBadge: 'COMPLETED',
        visualBg: 'radial-gradient(circle at 18% 50%, rgba(99, 102, 241, 0.42), rgba(15, 23, 42, 0.95) 55%)',
        icon: Wrench,
        accent: 'text-indigo-400',
      },
      {
        id: 'TASK_MANAGER',
        title: 'TASK MANAGER',
        subtitle: 'Simultaneous FCU Autopilot Updates + Alert Cancellation + Math',
        visualBg: 'radial-gradient(circle at 18% 50%, rgba(249, 115, 22, 0.42), rgba(15, 23, 42, 0.95) 55%)',
        icon: Activity,
        accent: 'text-orange-400',
      },
      {
        id: 'CONTROL_TASK',
        title: 'CONTROL TASK',
        subtitle: '60fps PFD Flight Director & Rudder Tracking (Mouse/Keys/Joystick)',
        defaultBadge: 'INACTIVE',
        visualBg: 'radial-gradient(circle at 18% 50%, rgba(6, 182, 212, 0.42), rgba(15, 23, 42, 0.95) 55%)',
        icon: Crosshair,
        accent: 'text-cyan-400',
      },
      {
        id: 'ENGLISH_PROFICIENCY',
        title: 'ENGLISH PROFICIENCY',
        subtitle: 'ICAO Level 4–6 Aviation English, ATC Readbacks & NOTAMs',
        visualBg: 'radial-gradient(circle at 18% 50%, rgba(59, 130, 246, 0.38), rgba(15, 23, 42, 0.95) 55%)',
        icon: Headphones,
        accent: 'text-blue-400',
      },
      {
        id: 'VERBAL_REASONING',
        title: 'VERBAL REASONING',
        subtitle: 'Operations Manual Passages — True / False / Cannot Say Logic',
        visualBg: 'radial-gradient(circle at 18% 50%, rgba(20, 184, 166, 0.38), rgba(15, 23, 42, 0.95) 55%)',
        icon: FileText,
        accent: 'text-teal-400',
      },
      {
        id: 'PERSONALITY_TEST',
        title: 'PERSONALITY TEST',
        subtitle: 'COMPASS Personality Profile (CPP) — CRM, Resilience & SOP Fit',
        defaultBadge: 'INACTIVE',
        visualBg: 'radial-gradient(circle at 18% 50%, rgba(234, 179, 8, 0.38), rgba(15, 23, 42, 0.95) 55%)',
        icon: UserCheck,
        accent: 'text-amber-400',
      },
    ];

    const launchTile = (id: PsychModuleId) => {
      if (id === 'ORIENTATION') return startOrientation();
      if (id === 'MEMORY') return startMemory();
      if (id === 'MATHEMATICS' || id === 'TECHNICAL_INSIGHT' || id === 'ENGLISH_PROFICIENCY') {
        return startMcqModule(id);
      }
      if (id === 'TASK_MANAGER') return startTaskManager();
      if (id === 'CONTROL_TASK') return startControlTask();
      if (id === 'VERBAL_REASONING') {
        setVrbIdx(0);
        setVrbCorrect(0);
        setVrbPicked(null);
        setVrbDone(false);
        return setActiveModule('VERBAL_REASONING');
      }
      if (id === 'PERSONALITY_TEST') {
        setCppAnswers({});
        setCppDone(false);
        return setActiveModule('PERSONALITY_TEST');
      }
      setActiveModule(id);
    };

    const completedCount = Object.values(scores).filter((s) => s.completed).length;
    const avgStanine =
      completedCount > 0
        ? (
            Object.values(scores).reduce((acc, s) => acc + s.stanine, 0) / completedCount
          ).toFixed(1)
        : '7.5';

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-10 font-sans relative overflow-hidden">
        {/* Subtle Cockpit Background Watermark */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-8">
          {/* Top Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onChangeView(View.EGYPTAIR_DASHBOARD)}
                className="inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-wider transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> EgyptAir Cadet Suite
              </button>
              <button
                onClick={() => onChangeView(View.PLATFORM_DASHBOARD)}
                className="inline-flex items-center px-3 py-2 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-white/5 text-xs transition-all"
              >
                Mission Control
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
                COMPLETED: {completedCount}/9 MODULES
              </div>
              <div className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
                COMPOSITE STANINE: {avgStanine} / 9.0
              </div>
            </div>
          </div>

          {/* Header Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-blue-950/60 border border-white/10 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" /> EPST COMPASS™ &amp; AON (cut-e) Screening Battery
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                Airline Pilot Psychometric &amp; Aptitude Assessment Center
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                Select any module tile below to launch the interactive psychometric test simulator. Designed for flight school graduates preparing for EgyptAir, Emirates, Ryanair, and major airline cadet/First Officer selections.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 shrink-0">
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 text-center">
                <div className="text-[10px] font-mono uppercase text-slate-400">Input Support</div>
                <div className="text-xs font-bold text-white mt-1 flex items-center justify-center gap-1.5">
                  <Gamepad2 className="w-4 h-4 text-cyan-400" /> USB Stick / Mouse / Keys
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 text-center">
                <div className="text-[10px] font-mono uppercase text-slate-400">Scoring Standard</div>
                <div className="text-xs font-bold text-emerald-400 mt-1">EPST Stanine 1–9</div>
              </div>
            </div>
          </div>

          {/* EXACT 2-COLUMN COMPASS LAUNCHPAD BANNERS (Matching User Image 1) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {compassTiles.map((tile) => {
              const record = scores[tile.id];
              const isDone = record?.completed;
              const badgeType = isDone ? 'COMPLETED' : tile.defaultBadge;

              return (
                <button
                  key={tile.id}
                  onClick={() => launchTile(tile.id)}
                  style={{ background: tile.visualBg }}
                  className="group relative h-28 md:h-32 w-full rounded-sm border border-white/15 hover:border-cyan-400/70 overflow-hidden flex items-center justify-between px-6 transition-all duration-200 shadow-lg hover:shadow-cyan-500/10 text-left cursor-pointer"
                >
                  {/* Left Visual Emblem / Cockpit Instrument Graphic */}
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner">
                      <tile.icon className={`w-8 h-8 ${tile.accent}`} />
                    </div>
                    <div className="max-w-[230px] sm:max-w-[260px]">
                      <div className="text-[11px] text-slate-300/90 line-clamp-2 font-medium leading-snug">
                        {tile.subtitle}
                      </div>
                      {record && (
                        <div className="mt-1.5 inline-flex items-center gap-2 text-[10px] font-mono text-cyan-300 bg-black/50 px-2 py-0.5 rounded">
                          <span>BEST: {record.bestScore}%</span>
                          <span>•</span>
                          <span>STANINE {record.stanine}/9</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Top-Right Official Status Pill (COMPLETED in green / INACTIVE in orange) */}
                  {badgeType === 'COMPLETED' && (
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 bg-[#7fa62e] text-white text-[10px] font-black tracking-wider uppercase rounded-[2px] shadow">
                      COMPLETED
                    </span>
                  )}
                  {badgeType === 'INACTIVE' && (
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 bg-[#d97724] text-white text-[10px] font-black tracking-wider uppercase rounded-[2px] shadow">
                      INACTIVE · CLICK TO ACTIVATE
                    </span>
                  )}

                  {/* Bottom-Right Bold All-Caps COMPASS Module Title */}
                  <div className="absolute bottom-3 right-4 text-right">
                    <span className="text-lg md:text-xl font-extrabold tracking-wide text-white group-hover:text-cyan-300 transition-colors uppercase drop-shadow">
                      {tile.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Flight School to Airline Transition Readiness Guide */}
          <div className="rounded-2xl bg-slate-900/70 border border-white/10 p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-amber-400">
                  POST-FLIGHT SCHOOL AIRLINE SELECTION ROADMAP
                </div>
                <h2 className="text-xl font-bold text-white mt-1">
                  How Airlines Evaluate Frozen ATPL Graduates
                </h2>
              </div>
              <Award className="w-7 h-7 text-amber-400 hidden sm:block" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-1.5">
                <div className="font-mono text-cyan-400 font-bold">STAGE 01 // PSYCHOMETRICS</div>
                <div className="font-bold text-white text-sm">COMPASS &amp; AON Screening</div>
                <p className="text-slate-400 leading-relaxed">
                  Target a balanced Stanine ≥ 6 across all modules. Airlines reject erratic profiles (e.g., 9 in Math but 3 in Task Manager).
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-1.5">
                <div className="font-mono text-sky-400 font-bold">STAGE 02 // TECH &amp; ENGLISH</div>
                <div className="font-bold text-white text-sm">ABC Manual &amp; ATPL Theory</div>
                <p className="text-slate-400 leading-relaxed">
                  Master ECAR 121, swept-wing aerodynamics, balanced field V-speeds, and ICAO Level 4+ ATC clearances.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-1.5">
                <div className="font-mono text-emerald-400 font-bold">STAGE 03 // SIMULATOR CHECK</div>
                <div className="font-bold text-white text-sm">Raw Data Instrument Scan</div>
                <p className="text-slate-400 leading-relaxed">
                  Fly pitch+power tables without Flight Director, compute Teardrop/Parallel holds, and track ILS glideslope smoothly.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-1.5">
                <div className="font-mono text-amber-400 font-bold">STAGE 04 // CRM &amp; PANEL</div>
                <div className="font-bold text-white text-sm">TEM &amp; Competency Interview</div>
                <p className="text-slate-400 leading-relaxed">
                  Demonstrate assertiveness without Macho/Resignation attitudes using FOR-DEC and the Two-Challenge Rule.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER MODULE 1: ORIENTATION (RBI + Artificial Horizon + Compass + 5x5 Grid)
  // Exact match to User Image 2!
  // ═══════════════════════════════════════════════════════════════════════════
  if (activeModule === 'ORIENTATION') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveModule('HUB')}
              className="inline-flex items-center px-3.5 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl border border-white/10 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to COMPASS Hub
            </button>
            <div className="flex items-center gap-4 font-mono text-xs">
              <span className="px-3 py-1.5 bg-slate-900 rounded-lg border border-white/10">
                QUESTION: <strong className="text-cyan-400">{oriIndex + 1} / 10</strong>
              </span>
              <span className="px-3 py-1.5 bg-slate-900 rounded-lg border border-white/10">
                SCORE: <strong className="text-emerald-400">{oriCorrectCount}</strong>
              </span>
              <span className="px-3 py-1.5 bg-slate-900 rounded-lg border border-white/10">
                TIME: <strong className="text-amber-400">{oriTimeLeft}s</strong>
              </span>
            </div>
          </div>

          {oriFinished ? (
            <div className="rounded-2xl bg-slate-900 border border-white/10 p-8 text-center space-y-5">
              <Award className="w-14 h-14 text-cyan-400 mx-auto" />
              <h2 className="text-3xl font-black text-white">Orientation Module Complete</h2>
              <p className="text-slate-300 text-lg">
                You scored <strong>{oriCorrectCount} / 10</strong> ({Math.round((oriCorrectCount / 10) * 100)}%) —{' '}
                <span className="text-cyan-400 font-bold">
                  Stanine {calcStanine(Math.round((oriCorrectCount / 10) * 100))} / 9
                </span>
              </p>
              <div className="flex justify-center gap-4 pt-2">
                <button
                  onClick={startOrientation}
                  className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-sm"
                >
                  Practice Again
                </button>
                <button
                  onClick={() => setActiveModule('HUB')}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm"
                >
                  Return to Hub
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-[#c9e6f7] text-slate-900">
              {/* TOP INSTRUMENT PANEL: RBI | Artificial Horizon | Compass (Matching User Image 2) */}
              <div className="grid grid-cols-3 bg-[#73787c] border-b-4 border-slate-800 p-3 gap-3">
                {/* 1. RBI (Relative Bearing Indicator) */}
                <div className="flex flex-col items-center">
                  <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-black border-4 border-slate-200 relative flex items-center justify-center shadow-inner">
                    {/* Tick marks every 30 deg */}
                    {Array.from({ length: 12 }).map((_, idx) => (
                      <div
                        key={idx}
                        style={{ transform: `rotate(${idx * 30}deg)` }}
                        className="absolute inset-1.5 flex justify-center"
                      >
                        <div className="w-0.5 h-2.5 bg-white" />
                      </div>
                    ))}
                    {/* Blue center cross */}
                    <div className="w-8 h-0.5 bg-blue-600 absolute" />
                    <div className="w-0.5 h-8 bg-blue-600 absolute" />
                    {/* Red RBI Needle */}
                    <div
                      style={{ transform: `rotate(${oriRound.rbiAngle}deg)` }}
                      className="absolute inset-4 flex flex-col items-center justify-start transition-transform duration-300"
                    >
                      <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[16px] border-b-red-600" />
                      <div className="w-1.5 h-20 bg-red-600" />
                    </div>
                  </div>
                </div>

                {/* 2. Artificial Horizon */}
                <div className="flex flex-col items-center">
                  <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-[#2e3236] border-4 border-slate-200 relative overflow-hidden flex items-center justify-center">
                    <div
                      style={{
                        transform: `rotate(${-oriRound.bankDeg}deg) translateY(${oriRound.pitchDeg * 1.4}px)`,
                      }}
                      className="w-56 h-56 absolute flex flex-col transition-transform duration-300"
                    >
                      <div className="flex-1 bg-[#0095ff]" />
                      <div className="h-0.5 bg-white w-full" />
                      <div className="flex-1 bg-[#ffbf00]" />
                    </div>
                    {/* Fixed Yellow Aircraft Reticle */}
                    <div className="relative z-10 flex items-center justify-center">
                      <div className="w-5 h-0.5 bg-yellow-300" />
                      <div className="w-5 h-5 rounded-full border-2 border-yellow-300 mx-0.5" />
                      <div className="w-5 h-0.5 bg-yellow-300" />
                    </div>
                  </div>
                </div>

                {/* 3. Gyro Compass */}
                <div className="flex flex-col items-center">
                  <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-black border-4 border-slate-200 relative flex items-center justify-center">
                    {Array.from({ length: 12 }).map((_, idx) => (
                      <div
                        key={idx}
                        style={{ transform: `rotate(${idx * 30}deg)` }}
                        className="absolute inset-1.5 flex justify-center"
                      >
                        <div className="w-0.5 h-2.5 bg-white" />
                      </div>
                    ))}
                    <span className="absolute top-4 text-xs font-black text-white">N</span>
                    <span className="absolute right-4 text-xs font-black text-white">E</span>
                    <span className="absolute bottom-4 text-xs font-black text-white">S</span>
                    <span className="absolute left-4 text-xs font-black text-white">W</span>
                    {/* Red Heading Needle */}
                    <div
                      style={{ transform: `rotate(${oriRound.compassHeading}deg)` }}
                      className="absolute inset-5 flex flex-col items-center justify-start transition-transform duration-300"
                    >
                      <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[16px] border-b-red-600" />
                      <div className="w-1.5 h-16 bg-red-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Instrument Labels Row */}
              <div className="grid grid-cols-3 text-center py-1.5 bg-[#c9e6f7] font-bold text-xs sm:text-sm text-slate-900 border-b border-[#9abfd8]">
                <div>RBI</div>
                <div>Artificial Horizon</div>
                <div>Compass</div>
              </div>

              {/* 5x5 Light-Blue Grid with Central NDB Cross & Aircraft 1, 2, 3, 4 */}
              <div className="grid grid-cols-5 bg-[#c9e6f7]">
                {Array.from({ length: 25 }).map((_, cellIdx) => {
                  const r = Math.floor(cellIdx / 5);
                  const c = cellIdx % 5;
                  const isCenterNdb = r === 2 && c === 2;
                  const ac = oriRound.options.find((o) => o.row === r && o.col === c);

                  return (
                    <div
                      key={cellIdx}
                      onClick={() => ac && handleOriPick(ac.id)}
                      className={`h-20 sm:h-24 border border-[#9abfd8] relative flex items-center justify-center transition-colors ${
                        ac ? 'cursor-pointer hover:bg-sky-200/80' : ''
                      } ${
                        ac && oriSelected !== null && ac.id === oriRound.correctId
                          ? 'bg-emerald-300/80 ring-2 ring-emerald-600'
                          : ac && oriSelected === ac.id && ac.id !== oriRound.correctId
                          ? 'bg-rose-300/80 ring-2 ring-rose-600'
                          : ''
                      }`}
                    >
                      {isCenterNdb && (
                        <div className="relative flex items-center justify-center w-14 h-14">
                          <div className="w-12 h-2 bg-[#0c4a6e] rounded-full absolute" />
                          <div className="w-2 h-12 bg-[#0c4a6e] rounded-full absolute" />
                        </div>
                      )}

                      {ac && (
                        <>
                          <span className="absolute top-1 left-2 font-black text-xs sm:text-sm text-[#0c4a6e]">
                            {ac.id}
                          </span>
                          <svg
                            viewBox="0 0 48 48"
                            style={{ transform: `rotate(${ac.heading}deg)` }}
                            className="w-11 h-11 text-[#0284c7] drop-shadow-xs"
                          >
                            <path
                              fill="#bae6fd"
                              stroke="#0369a1"
                              strokeWidth="2.5"
                              d="M24 4 L27 18 L43 24 L27 28 L26 40 L33 44 L15 44 L22 40 L21 28 L5 24 L21 18 Z"
                            />
                          </svg>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Selection Bar & Feedback */}
              <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs sm:text-sm text-slate-300">
                  {oriSelected === null ? (
                    <span>
                      Click on Aircraft <strong>1, 2, 3, or 4</strong> on the grid (or use buttons) matching the RBI &amp; Compass.
                    </span>
                  ) : (
                    <span className={oriSelected === oriRound.correctId ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {oriRound.explanation}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      disabled={oriSelected !== null}
                      onClick={() => handleOriPick(num)}
                      className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-cyan-600 disabled:opacity-50 font-black text-sm border border-white/10 transition-colors cursor-pointer"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER MODULE 2: MEMORY (FMS CDU Scratchpad & ATC Parameter Span)
  // ═══════════════════════════════════════════════════════════════════════════
  if (activeModule === 'MEMORY') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveModule('HUB')}
              className="inline-flex items-center px-3.5 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl border border-white/10 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to COMPASS Hub
            </button>
            <div className="font-mono text-xs px-3 py-1.5 bg-slate-900 rounded-lg border border-white/10">
              ROUND <strong className="text-emerald-400">{memRound + 1} / 5</strong>
            </div>
          </div>

          {memPhase === 'DONE' ? (
            <div className="rounded-2xl bg-slate-900 border border-white/10 p-8 text-center space-y-5">
              <Cpu className="w-14 h-14 text-emerald-400 mx-auto" />
              <h2 className="text-3xl font-black text-white">Memory Span Module Complete</h2>
              <p className="text-slate-300 text-lg">
                Recall Accuracy: <strong>{Math.round(memScore / 5)}%</strong> —{' '}
                <span className="text-emerald-400 font-bold">
                  Stanine {calcStanine(Math.round(memScore / 5))} / 9
                </span>
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={startMemory}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm"
                >
                  Retry Memory Test
                </button>
                <button
                  onClick={() => setActiveModule('HUB')}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm"
                >
                  Return to Hub
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#071108] border-2 border-emerald-500/40 p-6 md:p-8 font-mono shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3 text-emerald-400 text-xs">
                <span>FMS CDU // POS INIT &amp; ATC CLEARANCE MEMORY</span>
                <span>{memPhase === 'MEMORIZE' ? `MEMORIZE IN ${memCountdown}s` : 'ENTER RECALLED VALUES'}</span>
              </div>

              {memPhase === 'MEMORIZE' && (
                <div className="space-y-6 py-6 text-center">
                  <div className="text-xs uppercase tracking-widest text-emerald-300/70">
                    Memorize the active ATC parameters before the screen clears:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                      <div className="text-[10px] text-emerald-400/70">HEADING</div>
                      <div className="text-3xl font-black text-emerald-300 mt-1">{memTarget.hdg}°</div>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                      <div className="text-[10px] text-emerald-400/70">FLIGHT LEVEL</div>
                      <div className="text-3xl font-black text-emerald-300 mt-1">FL{memTarget.fl}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                      <div className="text-[10px] text-emerald-400/70">AIRSPEED</div>
                      <div className="text-3xl font-black text-emerald-300 mt-1">{memTarget.spd} KT</div>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                      <div className="text-[10px] text-emerald-400/70">SQUAWK</div>
                      <div className="text-3xl font-black text-emerald-300 mt-1">{memTarget.sqk}</div>
                    </div>
                  </div>
                </div>
              )}

              {memPhase === 'RECALL' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[10px] text-emerald-400 mb-1">HEADING (3 digits)</label>
                      <input
                        type="text"
                        maxLength={3}
                        value={memInput.hdg}
                        onChange={(e) => setMemInput({ ...memInput, hdg: e.target.value })}
                        placeholder="e.g. 240"
                        className="w-full bg-black border border-emerald-500/40 rounded-lg p-3 text-xl text-emerald-300 outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-emerald-400 mb-1">FLIGHT LEVEL</label>
                      <input
                        type="text"
                        maxLength={3}
                        value={memInput.fl}
                        onChange={(e) => setMemInput({ ...memInput, fl: e.target.value })}
                        placeholder="e.g. 340"
                        className="w-full bg-black border border-emerald-500/40 rounded-lg p-3 text-xl text-emerald-300 outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-emerald-400 mb-1">SPEED (KT)</label>
                      <input
                        type="text"
                        maxLength={3}
                        value={memInput.spd}
                        onChange={(e) => setMemInput({ ...memInput, spd: e.target.value })}
                        placeholder="e.g. 280"
                        className="w-full bg-black border border-emerald-500/40 rounded-lg p-3 text-xl text-emerald-300 outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-emerald-400 mb-1">SQUAWK (4 digits)</label>
                      <input
                        type="text"
                        maxLength={4}
                        value={memInput.sqk}
                        onChange={(e) => setMemInput({ ...memInput, sqk: e.target.value })}
                        placeholder="e.g. 4721"
                        className="w-full bg-black border border-emerald-500/40 rounded-lg p-3 text-xl text-emerald-300 outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>
                  <button
                    onClick={submitMemoryRound}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-black font-black rounded-xl uppercase tracking-wider cursor-pointer"
                  >
                    EXEC // Submit FMS Recall
                  </button>
                </div>
              )}

              {memPhase === 'RESULT' && (
                <div className="py-6 text-center space-y-2 text-emerald-300">
                  <div className="text-lg font-bold">
                    Actual Clearance: HDG {memTarget.hdg} · FL{memTarget.fl} · {memTarget.spd} KT · SQK {memTarget.sqk}
                  </div>
                  <div className="text-xs text-emerald-400/70">Loading next ATC transmission...</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER MODULE 3, 4, 7: MATHEMATICS / TECHNICAL INSIGHT / ENGLISH PROFICIENCY
  // ═══════════════════════════════════════════════════════════════════════════
  if (
    activeModule === 'MATHEMATICS' ||
    activeModule === 'TECHNICAL_INSIGHT' ||
    activeModule === 'ENGLISH_PROFICIENCY'
  ) {
    const bank =
      activeModule === 'MATHEMATICS'
        ? MATH_QUESTIONS
        : activeModule === 'TECHNICAL_INSIGHT'
        ? TECH_INSIGHT_QUESTIONS
        : ENGLISH_QUESTIONS;
    const item = bank[mcqIdx];

    const handlePick = (idx: number) => {
      if (mcqPicked !== null) return;
      setMcqPicked(idx);
      const nextRight = idx === item.correct ? mcqCorrect + 1 : mcqCorrect;
      if (idx === item.correct) setMcqCorrect(nextRight);
      setTimeout(() => {
        if (mcqIdx + 1 >= bank.length) {
          setMcqDone(true);
          saveModuleScore(activeModule, Math.round((nextRight / bank.length) * 100));
        } else {
          setMcqIdx((i) => i + 1);
          setMcqPicked(null);
        }
      }, 1500);
    };

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveModule('HUB')}
              className="inline-flex items-center px-3.5 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl border border-white/10 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to COMPASS Hub
            </button>
            <span className="font-mono text-xs px-3 py-1.5 bg-slate-900 rounded-lg border border-white/10">
              {activeModule.replace('_', ' ')} · {mcqIdx + 1}/{bank.length}
            </span>
          </div>

          {mcqDone ? (
            <div className="rounded-2xl bg-slate-900 border border-white/10 p-8 text-center space-y-5">
              <Award className="w-14 h-14 text-sky-400 mx-auto" />
              <h2 className="text-3xl font-black text-white">{activeModule.replace('_', ' ')} Complete</h2>
              <p className="text-slate-300 text-lg">
                Score: <strong>{mcqCorrect} / {bank.length}</strong> ({Math.round((mcqCorrect / bank.length) * 100)}%) —{' '}
                <span className="text-sky-400 font-bold">
                  Stanine {calcStanine(Math.round((mcqCorrect / bank.length) * 100))} / 9
                </span>
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => startMcqModule(activeModule)}
                  className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-sm"
                >
                  Practice Again
                </button>
                <button
                  onClick={() => setActiveModule('HUB')}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm"
                >
                  Return to Hub
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-900 border border-white/10 p-6 md:p-8 space-y-6">
              {item.category && (
                <div className="text-xs font-mono uppercase tracking-widest text-cyan-400">{item.category}</div>
              )}
              <h2 className="text-xl md:text-2xl font-bold text-white leading-snug">{item.q}</h2>
              <div className="space-y-3">
                {item.options.map((opt, idx) => {
                  const isRight = idx === item.correct;
                  const isChosen = idx === mcqPicked;
                  return (
                    <button
                      key={idx}
                      disabled={mcqPicked !== null}
                      onClick={() => handlePick(idx)}
                      className={`w-full text-left p-4 rounded-xl border transition-all font-medium text-sm cursor-pointer ${
                        mcqPicked === null
                          ? 'bg-slate-950 hover:bg-slate-800 border-white/10 text-slate-200'
                          : isRight
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                          : isChosen
                          ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                          : 'bg-slate-950/50 border-white/5 text-slate-500'
                      }`}
                    >
                      <span className="font-mono font-bold mr-3 text-cyan-400">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {mcqPicked !== null && (
                <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-cyan-400">Debrief: </strong>
                  {item.explanation}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER MODULE 5: TASK MANAGER (Multitasking FCU + Red Lights + Math)
  // ═══════════════════════════════════════════════════════════════════════════
  if (activeModule === 'TASK_MANAGER') {
    const adjustFcu = (field: 'hdg' | 'alt' | 'spd', delta: number) => {
      setTmCurrentFcu((prev) => {
        const next = { ...prev, [field]: prev[field] + delta };
        if (next[field] === tmTargetFcu[field]) {
          setTmHits((h) => h + 1);
        }
        return next;
      });
    };

    const handleMathAnswer = (ans: boolean) => {
      if (ans === tmMathPrompt.isTrue) {
        setTmHits((h) => h + 1);
      } else {
        setTmMisses((m) => m + 1);
      }
      const a = Math.floor(Math.random() * 18) + 6;
      const b = Math.floor(Math.random() * 15) + 4;
      const isTrue = Math.random() > 0.5;
      const shown = isTrue ? a + b : a + b + (Math.random() > 0.5 ? 2 : -2);
      setTmMathPrompt({ text: `${a} + ${b} = ${shown}`, isTrue });
    };

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveModule('HUB')}
              className="inline-flex items-center px-3.5 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl border border-white/10 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to COMPASS Hub
            </button>
            <div className="flex items-center gap-4 font-mono text-xs">
              <span className="px-3 py-1.5 bg-slate-900 rounded-lg border border-white/10">
                HITS: <strong className="text-emerald-400">{tmHits}</strong>
              </span>
              <span className="px-3 py-1.5 bg-slate-900 rounded-lg border border-white/10">
                TIME: <strong className="text-amber-400">{tmTimeLeft}s</strong>
              </span>
            </div>
          </div>

          {tmDone ? (
            <div className="rounded-2xl bg-slate-900 border border-white/10 p-8 text-center space-y-5">
              <Activity className="w-14 h-14 text-orange-400 mx-auto" />
              <h2 className="text-3xl font-black text-white">Task Manager Complete</h2>
              <p className="text-slate-300 text-lg">
                Multitasking Actions Completed: <strong>{tmHits}</strong> (Errors: {tmMisses})
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={startTaskManager}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-sm"
                >
                  Run Again
                </button>
                <button
                  onClick={() => setActiveModule('HUB')}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm"
                >
                  Return to Hub
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Subtask 1: FCU Autopilot Glare-Shield Panel */}
              <div className="lg:col-span-2 rounded-2xl bg-[#18120c] border-2 border-amber-500/40 p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                  <span className="font-mono text-xs uppercase tracking-widest text-amber-400">
                    TASK 1 // AUTOPILOT FCU PARAMETER MATCHING
                  </span>
                  <span className="font-mono text-xs text-amber-200">
                    TARGET: HDG {tmTargetFcu.hdg} · ALT {tmTargetFcu.alt} · SPD {tmTargetFcu.spd}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 font-mono">
                  {(
                    [
                      { key: 'spd', label: 'IAS / MACH', step: 10 },
                      { key: 'hdg', label: 'HDG / TRK', step: 10 },
                      { key: 'alt', label: 'ALTITUDE', step: 100 },
                    ] as const
                  ).map((item) => {
                    const matched = tmCurrentFcu[item.key] === tmTargetFcu[item.key];
                    return (
                      <div
                        key={item.key}
                        className={`p-4 rounded-xl border ${
                          matched
                            ? 'bg-black/80 border-emerald-500/40'
                            : 'bg-amber-950/30 border-amber-500 animate-pulse'
                        }`}
                      >
                        <div className="text-[10px] text-amber-400/80">{item.label}</div>
                        <div className="text-2xl font-black text-amber-300 my-2">
                          {tmCurrentFcu[item.key]}
                        </div>
                        <div className="text-[10px] text-slate-400 mb-3">
                          Target: <strong className="text-white">{tmTargetFcu[item.key]}</strong>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => adjustFcu(item.key, -item.step)}
                            className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-sm font-bold cursor-pointer"
                          >
                            −
                          </button>
                          <button
                            onClick={() => adjustFcu(item.key, item.step)}
                            className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-sm font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Subtask 3: Mental Math Verification Bar */}
                <div className="p-4 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-cyan-400">
                      TASK 3 // VERIFY FUEL / NAV ARITHMETIC
                    </div>
                    <div className="text-xl font-mono font-black text-white mt-0.5">
                      {tmMathPrompt.text}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMathAnswer(true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs cursor-pointer"
                    >
                      TRUE
                    </button>
                    <button
                      onClick={() => handleMathAnswer(false)}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs cursor-pointer"
                    >
                      FALSE
                    </button>
                  </div>
                </div>
              </div>

              {/* Subtask 2: Master Warning Red Square Cancellation */}
              <div className="rounded-2xl bg-slate-900 border border-white/10 p-6 flex flex-col justify-between">
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest text-rose-400 mb-2">
                    TASK 2 // WARNING MATRIX
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Extinguish illuminated RED warning quadrants immediately when triggered:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[0, 1, 2, 3].map((q) => {
                      const active = tmAlertQuadrant === q;
                      return (
                        <button
                          key={q}
                          onClick={() => {
                            if (active) {
                              setTmHits((h) => h + 1);
                              setTmAlertQuadrant(null);
                            } else {
                              setTmMisses((m) => m + 1);
                            }
                          }}
                          className={`h-24 rounded-xl font-mono font-black text-xs border transition-all cursor-pointer ${
                            active
                              ? 'bg-rose-600 border-rose-300 text-white shadow-lg shadow-rose-600/40 scale-[1.02]'
                              : 'bg-slate-950 border-white/10 text-slate-600'
                          }`}
                        >
                          {active ? 'MASTER WARN // CLICK' : `SYS QUAD 0${q + 1}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER MODULE 6: CONTROL TASK (60fps PFD Tracking + Rudder Coordinator)
  // ═══════════════════════════════════════════════════════════════════════════
  if (activeModule === 'CONTROL_TASK') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveModule('HUB')}
              className="inline-flex items-center px-3.5 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl border border-white/10 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to COMPASS Hub
            </button>
            <div className="flex items-center gap-4 font-mono text-xs">
              <span className="px-3 py-1.5 bg-slate-900 rounded-lg border border-white/10">
                PRECISION: <strong className="text-cyan-400">{ctrlPrecision}%</strong>
              </span>
              <span className="px-3 py-1.5 bg-slate-900 rounded-lg border border-white/10">
                TIME: <strong className="text-amber-400">{ctrlTimeLeft}s</strong>
              </span>
            </div>
          </div>

          {ctrlDone ? (
            <div className="rounded-2xl bg-slate-900 border border-white/10 p-8 text-center space-y-5">
              <Crosshair className="w-14 h-14 text-cyan-400 mx-auto" />
              <h2 className="text-3xl font-black text-white">Control Task Complete</h2>
              <p className="text-slate-300 text-lg">
                Mean Tracking Precision: <strong>{ctrlPrecision}%</strong> —{' '}
                <span className="text-cyan-400 font-bold">Stanine {calcStanine(ctrlPrecision)} / 9</span>
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={startControlTask}
                  className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-sm"
                >
                  Fly Again
                </button>
                <button
                  onClick={() => setActiveModule('HUB')}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm"
                >
                  Return to Hub
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-900 border border-white/10 p-6 space-y-4 text-center">
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                <span>
                  Keep the <strong>Cyan Reticle</strong> centered inside the moving <strong>Green Flight Director</strong> (Mouse or Arrow Keys) and keep the bottom Rudder Ball centered (<strong>A / D</strong> keys or USB Joystick).
                </span>
                <span className="font-mono text-cyan-400">
                  {gamepadConnected ? 'USB FLIGHT STICK ACTIVE' : 'MOUSE + KEYBOARD (A/D RUDDER)'}
                </span>
              </div>

              <canvas
                ref={canvasRef}
                width={640}
                height={380}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left - rect.width / 2;
                  const y = e.clientY - rect.top - (rect.height / 2 - 20);
                  ctrlStateRef.current.userX = Math.max(-140, Math.min(140, x));
                  ctrlStateRef.current.userY = Math.max(-110, Math.min(110, y));
                }}
                className="mx-auto rounded-xl border-2 border-slate-700 cursor-none max-w-full"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER MODULE 8: VERBAL REASONING (True / False / Cannot Say)
  // ═══════════════════════════════════════════════════════════════════════════
  if (activeModule === 'VERBAL_REASONING') {
    const item = VERBAL_PASSAGES[vrbIdx];
    const handlePick = (choice: 'TRUE' | 'FALSE' | 'CANNOT_SAY') => {
      if (vrbPicked !== null) return;
      setVrbPicked(choice);
      const nextRight = choice === item.correct ? vrbCorrect + 1 : vrbCorrect;
      if (choice === item.correct) setVrbCorrect(nextRight);
      setTimeout(() => {
        if (vrbIdx + 1 >= VERBAL_PASSAGES.length) {
          setVrbDone(true);
          saveModuleScore('VERBAL_REASONING', Math.round((nextRight / VERBAL_PASSAGES.length) * 100));
        } else {
          setVrbIdx((i) => i + 1);
          setVrbPicked(null);
        }
      }, 1700);
    };

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveModule('HUB')}
              className="inline-flex items-center px-3.5 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl border border-white/10 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to COMPASS Hub
            </button>
            <span className="font-mono text-xs px-3 py-1.5 bg-slate-900 rounded-lg border border-white/10">
              VERBAL REASONING · {vrbIdx + 1}/{VERBAL_PASSAGES.length}
            </span>
          </div>

          {vrbDone ? (
            <div className="rounded-2xl bg-slate-900 border border-white/10 p-8 text-center space-y-5">
              <FileText className="w-14 h-14 text-teal-400 mx-auto" />
              <h2 className="text-3xl font-black text-white">Verbal Reasoning Complete</h2>
              <p className="text-slate-300 text-lg">
                Score: <strong>{vrbCorrect} / {VERBAL_PASSAGES.length}</strong> —{' '}
                <span className="text-teal-400 font-bold">
                  Stanine {calcStanine(Math.round((vrbCorrect / VERBAL_PASSAGES.length) * 100))} / 9
                </span>
              </p>
              <button
                onClick={() => setActiveModule('HUB')}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-sm"
              >
                Return to Hub
              </button>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-900 border border-white/10 p-6 md:p-8 space-y-6">
              <div className="text-xs font-mono uppercase tracking-widest text-teal-400">{item.title}</div>
              <div className="p-5 rounded-xl bg-slate-950 border border-white/10 text-slate-300 text-sm leading-relaxed">
                {item.passage}
              </div>
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase text-slate-400">STATEMENT TO EVALUATE:</div>
                <div className="text-lg font-bold text-white">"{item.statement}"</div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {(['TRUE', 'FALSE', 'CANNOT_SAY'] as const).map((choice) => (
                  <button
                    key={choice}
                    disabled={vrbPicked !== null}
                    onClick={() => handlePick(choice)}
                    className={`py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider border cursor-pointer ${
                      vrbPicked === null
                        ? 'bg-slate-950 hover:bg-slate-800 border-white/10 text-white'
                        : choice === item.correct
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : choice === vrbPicked
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                        : 'bg-slate-950/40 border-white/5 text-slate-500'
                    }`}
                  >
                    {choice.replace('_', ' ')}
                  </button>
                ))}
              </div>
              {vrbPicked !== null && (
                <div className="p-4 rounded-xl bg-slate-950 border border-teal-500/30 text-xs text-slate-300">
                  <strong className="text-teal-400">Analysis: </strong>
                  {item.explanation}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER MODULE 9: PERSONALITY TEST (COMPASS Personality Profile - CPP)
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveModule('HUB')}
            className="inline-flex items-center px-3.5 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl border border-white/10 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to COMPASS Hub
          </button>
          <span className="font-mono text-xs px-3 py-1.5 bg-slate-900 rounded-lg border border-white/10">
            COMPASS PERSONALITY PROFILE (CPP)
          </span>
        </div>

        {cppDone ? (
          <div className="rounded-2xl bg-slate-900 border border-white/10 p-8 text-center space-y-5">
            <UserCheck className="w-14 h-14 text-amber-400 mx-auto" />
            <h2 className="text-3xl font-black text-white">CPP Behavioral Profile Generated</h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
              Your responses demonstrate high alignment with airline SOP Compliance, Cockpit Assertiveness (Two-Challenge Rule), Emotional Resilience under check-ride stress, and Crew Resource Management.
            </p>
            <button
              onClick={() => setActiveModule('HUB')}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-sm cursor-pointer"
            >
              Return to COMPASS Hub (Status: COMPLETED)
            </button>
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-900 border border-white/10 p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">COMPASS Personality Test (CPP)</h2>
              <p className="text-xs text-slate-400 mt-1">
                Rate each statement from 1 (Strongly Disagree) to 5 (Strongly Agree). Airlines evaluate consistency, SOP discipline, and balanced cockpit authority.
              </p>
            </div>

            <div className="space-y-4">
              {PERSONALITY_STATEMENTS.map((st) => (
                <div key={st.id} className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3">
                  <div className="text-sm font-medium text-slate-200">
                    <span className="font-mono text-amber-400 mr-2">#{st.id}</span>
                    {st.text}
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { val: 1, label: '1 · Strongly Disagree' },
                      { val: 2, label: '2 · Disagree' },
                      { val: 3, label: '3 · Neutral' },
                      { val: 4, label: '4 · Agree' },
                      { val: 5, label: '5 · Strongly Agree' },
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        onClick={() => setCppAnswers({ ...cppAnswers, [st.id]: opt.val })}
                        className={`py-2 px-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                          cppAnswers[st.id] === opt.val
                            ? 'bg-amber-500 text-black border-amber-300'
                            : 'bg-slate-900 text-slate-400 border-white/5 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              disabled={Object.keys(cppAnswers).length < PERSONALITY_STATEMENTS.length}
              onClick={() => {
                saveModuleScore('PERSONALITY_TEST', 90);
                setCppDone(true);
              }}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-black rounded-xl uppercase tracking-wider text-sm cursor-pointer"
            >
              Submit Personality Profile ({Object.keys(cppAnswers).length}/{PERSONALITY_STATEMENTS.length} Answered)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompassPsychometricSuite;
