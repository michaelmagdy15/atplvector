import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  Target, 
  Compass, 
  AlertTriangle, 
  Layers, 
  BookOpen, 
  Zap, 
  Eye, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { triggerHaptic } from '../../lib/nativeBridge';

export type TrapType = 'UNIT_SWAP' | 'NEGATIVE_STEM' | 'INTERMEDIATE_STEP' | 'FALSE_OPPOSITE' | 'CONDITIONAL';

export interface TrapQuestion {
  id: string;
  subject: string;
  subjectCode: string;
  trapType: TrapType;
  trapName: string;
  question: string;
  deliverableSentence: string;
  unitAlert?: string;
  polarityAlert?: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    examinerDistractorNote: string;
  }[];
  explanation: string;
  goldenRule: string;
  easaReference: string;
}

const TRAP_QUESTIONS: TrapQuestion[] = [
  {
    id: 'rtfq-01',
    subject: 'Mass & Balance / General Nav',
    subjectCode: '031 / 061',
    trapType: 'UNIT_SWAP',
    trapName: 'Imperial vs US Gallon Divergence',
    question: 'A pilot notes that 140 US Gallons of AVGAS are required for a sector. Given a fuel Specific Gravity (SG) of 0.72, what is the exact fuel mass in kilograms to be entered onto the loadsheet?',
    deliverableSentence: 'What is the exact fuel mass in kilograms to be entered onto the loadsheet?',
    unitAlert: 'Target is KILOGRAMS from US GALLONS (1 USG = 3.785 L, not Imperial 4.54 L)!',
    options: [
      {
        id: 'A',
        text: '381.5 kg',
        isCorrect: true,
        examinerDistractorNote: 'CORRECT: 140 USG × 3.78541 L/USG = 529.96 L. Mass = 529.96 L × 0.72 kg/L = 381.57 kg.'
      },
      {
        id: 'B',
        text: '457.6 kg',
        isCorrect: false,
        examinerDistractorNote: 'TRAP (Imperial Gallon Swap): Candidate used 4.546 L/gal (140 × 4.546 × 0.72 = 458 kg).'
      },
      {
        id: 'C',
        text: '530.0 kg',
        isCorrect: false,
        examinerDistractorNote: 'TRAP (Forgot SG): Candidate stopped at volume in litres (140 × 3.785 = 530 L) without multiplying by 0.72.'
      },
      {
        id: 'D',
        text: '736.0 kg',
        isCorrect: false,
        examinerDistractorNote: 'TRAP (Divided by SG): Candidate calculated 530 / 0.72 = 736 kg instead of multiplying by density.'
      }
    ],
    explanation: 'US Gallons and Imperial Gallons are frequent EASA exam distractors. Remember: 1 US Gallon = 3.785 Litres (approx 6 lbs AVGAS). 1 Imperial Gallon = 4.546 Litres (approx 7.2 lbs AVGAS). Always write the conversion factor before touching the keypad.',
    goldenRule: 'Rule of Thumb: US gallon is the "smaller" gallon (3.785 L). Imperial gallon is the "large" British gallon (4.546 L). Write "USG × 3.785 × SG = kg" on your scratchpad before calculating.',
    easaReference: 'EASA TK Syllabus 031.01 & EASA Operations Manual'
  },
  {
    id: 'rtfq-02',
    subject: 'Principles of Flight',
    subjectCode: '081',
    trapType: 'NEGATIVE_STEM',
    trapName: 'Negative Polarity Stem',
    question: 'Regarding an aircraft in straight and level unaccelerated flight, which of the following statements is NOT correct when the center of gravity moves progressively forward?',
    deliverableSentence: 'Which of the following statements is NOT correct when the CG moves forward?',
    polarityAlert: 'NEGATIVE STEM: Look for the INCORRECT statement (what DOES NOT happen).',
    options: [
      {
        id: 'A',
        text: 'Longitudinal static stability decreases due to the reduced tailplane downforce required',
        isCorrect: true,
        examinerDistractorNote: 'CORRECT (It is the FALSE statement): Forward CG INCREASES longitudinal static stability because the static margin (distance between CG and Neutral Point) expands.'
      },
      {
        id: 'B',
        text: 'Stall speed increases because the main wing must generate additional lift to balance tail downforce',
        isCorrect: false,
        examinerDistractorNote: 'TRAP (True Statement): Forward CG increases required wing lift, raising Vs.'
      },
      {
        id: 'C',
        text: 'Cruise range decreases due to higher induced drag from higher lift demand',
        isCorrect: false,
        examinerDistractorNote: 'TRAP (True Statement): Greater total lift produces greater induced drag, burning more fuel.'
      },
      {
        id: 'D',
        text: 'Elevator control force during rotation and flare becomes noticeably heavier',
        isCorrect: false,
        examinerDistractorNote: 'TRAP (True Statement): More up-elevator deflection against higher nose-down pitching moment.'
      }
    ],
    explanation: 'Examiners use negative stems to exploit fast readers. Forward CG creates a larger nose-down moment, requiring greater downward tailplane aerodynamic download. Therefore, the main wing must generate Lift = Weight + Tail Download. This increases induced drag, increases stall speed, and INCREASES stability. Statement A falsely claims stability decreases.',
    goldenRule: 'When you see "NOT" or "EXCEPT", cross out true facts with your pencil. The one false statement is your golden target.',
    easaReference: 'EASA TK Syllabus 081.02.01 & EASA Aerodynamics Principles'
  },
  {
    id: 'rtfq-03',
    subject: 'General Navigation',
    subjectCode: '061',
    trapType: 'INTERMEDIATE_STEP',
    trapName: '1-in-60 Track Error vs Total Alteration',
    question: 'An aircraft has flown 75 NM along a planned track of 090° and finds itself 5 NM left of track. If the remaining distance to destination is 45 NM, what heading alteration must the pilot make to fly DIRECTLY to the destination?',
    deliverableSentence: 'What heading alteration must the pilot make to fly DIRECTLY to the destination?',
    unitAlert: 'Question asks for TOTAL ALTERATION (TEA + Closing Angle), not just Track Error Angle!',
    options: [
      {
        id: 'A',
        text: 'Alter heading 11° to the right',
        isCorrect: true,
        examinerDistractorNote: 'CORRECT: Track Error Angle (TEA) = (5 × 60) / 75 = 4°. Closing Angle (CA) = (5 × 60) / 45 = 6.67° (7°). Total Alteration = 4° + 7° = 11° Right.'
      },
      {
        id: 'B',
        text: 'Alter heading 4° to the right',
        isCorrect: false,
        examinerDistractorNote: 'TRAP (Intermediate Distractor): 4° is only the Track Error Angle (TEA) to fly parallel to planned track, NOT to reach destination.'
      },
      {
        id: 'C',
        text: 'Alter heading 7° to the right',
        isCorrect: false,
        examinerDistractorNote: 'TRAP (Partial Step): 7° is only the Closing Angle (CA) without compensating for the existing error.'
      },
      {
        id: 'D',
        text: 'Alter heading 11° to the left',
        isCorrect: false,
        examinerDistractorNote: 'TRAP (Direction Reversal): The aircraft is LEFT of track, so it must turn RIGHT, not left.'
      }
    ],
    explanation: '1-in-60 rule: Track Error Angle = (Dist Off × 60) / Dist Flown = (5 × 60) / 75 = 4°. To fly parallel, turn 4° right. Closing Angle = (Dist Off × 60) / Dist to Go = (5 × 60) / 45 = 6.67° (approx 7°). To intercept destination directly, the total turn is TEA + CA = 4° + 7° = 11° Right. EASA always puts TEA (4°) as an early distractor!',
    goldenRule: 'Standard Flight Calculation Formula: Parallel = TEA. Intercept = TEA + Closing Angle. Never pick TEA alone when the destination is the target.',
    easaReference: 'EASA TK Syllabus 061.01.03 & EASA Navigation Standards'
  },
  {
    id: 'rtfq-04',
    subject: 'Aircraft Performance',
    subjectCode: '032',
    trapType: 'INTERMEDIATE_STEP',
    trapName: 'Gross vs Net Takeoff Climb Gradient (CS-25)',
    question: 'A twin-engine Class A turbojet aircraft with one engine inoperative in the Second Segment has a certified gross climb gradient of 3.4%. What is the legal NET climb gradient to be used for obstacle clearance calculations?',
    deliverableSentence: 'What is the legal NET climb gradient to be used for obstacle clearance calculations?',
    unitAlert: 'Obstacle assessment strictly requires NET gradient (Gross minus regulatory margin)!',
    options: [
      {
        id: 'A',
        text: '2.6%',
        isCorrect: true,
        examinerDistractorNote: 'CORRECT: CS-25 specifies a mandatory 0.8% net deduction for twin-engine aircraft. Net = 3.4% - 0.8% = 2.6%.'
      },
      {
        id: 'B',
        text: '3.4%',
        isCorrect: false,
        examinerDistractorNote: 'TRAP (Gross Gradient Bait): 3.4% is the gross gradient; using gross for obstacle clearance is an automatic exam fail.'
      },
      {
        id: 'C',
        text: '2.4%',
        isCorrect: false,
        examinerDistractorNote: 'TRAP (Regulatory Minimum Confusion): 2.4% is the MINIMUM gross gradient requirement for certification, not the specific net result of this aircraft.'
      },
      {
        id: 'D',
        text: '2.5%',
        isCorrect: false,
        examinerDistractorNote: 'TRAP (Tri-jet Deduction): Candidate subtracted 0.9% (the margin for a three-engine aircraft).'
      }
    ],
    explanation: 'CS-25 net takeoff flight path penalties: Twin-engine = 0.8% gross deduction; Three-engine = 0.9%; Four-engine = 1.0%. Net = Gross - 0.8% = 3.4% - 0.8% = 2.6%. The gross gradient of 2.4% is merely the certification basement for twins.',
    goldenRule: 'Twin = 0.8%. Tri = 0.9%. Quad = 1.0%. Gross is what the test pilot achieved; Net is what you give the obstacles to keep passengers alive.',
    easaReference: 'CS-25.115 / CS-25.121 & CS-25 Flight Manual Standards'
  },
  {
    id: 'rtfq-05',
    subject: 'Performance / Air Law',
    subjectCode: '032 / 010',
    trapType: 'FALSE_OPPOSITE',
    trapName: 'V1 Sensitivity to Contaminated Runway',
    question: 'How is the Takeoff Decision Speed (V1) affected when taking off on a runway contaminated with standing water compared to a clean dry runway?',
    deliverableSentence: 'How is the Takeoff Decision Speed (V1) affected when taking off on a contaminated runway?',
    options: [
      {
        id: 'A',
        text: 'V1 is decreased to allow earlier recognition and stopping before degraded wheel braking runs out of pavement',
        isCorrect: true,
        examinerDistractorNote: 'CORRECT: With degraded wheel friction, the stop distance is substantially longer. V1 must be lowered so the aircraft aborts earlier.'
      },
      {
        id: 'B',
        text: 'V1 is increased to provide extra aerodynamic energy to overcome water spray drag',
        isCorrect: false,
        examinerDistractorNote: 'TRAP (False Opposite): Raising V1 on a slippery runway makes stopping impossible.'
      },
      {
        id: 'C',
        text: 'V1 remains unchanged because V1 is solely a function of aircraft gross weight and flap setting',
        isCorrect: false,
        examinerDistractorNote: 'TRAP (Oversimplification): V1 is heavily limited by runway surface condition and ambient density.'
      },
      {
        id: 'D',
        text: 'V1 must equal VR unconditionally on any contaminated surface',
        isCorrect: false,
        examinerDistractorNote: 'TRAP (False Rule): V1 can never exceed VR, but it does not equal VR when friction is degraded.'
      }
    ],
    explanation: 'On contaminated or wet surfaces, tire braking coefficient drops drastically. To maintain the abort capability within the Accelerate-Stop Distance Available (ASDA), V1 must be reduced (often down to the wet V1 or V1mcg boundary). Note that screen height at 35 ft is reduced to 15 ft in wet/contaminated calculations.',
    goldenRule: 'Slippery runway = stop is harder = V1 goes DOWN. Screen height goes down to 15 ft. Reverse thrust is credited.',
    easaReference: 'CS-25 Subpart B & CS-25 Flight Manual Standards'
  },
  {
    id: 'rtfq-06',
    subject: 'Meteorology',
    subjectCode: '050',
    trapType: 'CONDITIONAL',
    trapName: 'Altimeter Cold Temperature Error',
    question: 'An aircraft is flying at an indicated altitude of 4,000 ft with an altimeter subscale set to the local QNH of 1013 hPa. The outside air temperature (OAT) is -15°C at this altitude. What is the aircraft\'s actual TRUE altitude?',
    deliverableSentence: 'What is the aircraft\'s actual TRUE altitude?',
    unitAlert: 'Remember the golden rule: "High to Low (Pressure or Temp), Look Out Below!" Cold air = True < Indicated.',
    options: [
      {
        id: 'A',
        text: 'Approximately 3,550 ft (Lower than indicated)',
        isCorrect: true,
        examinerDistractorNote: 'CORRECT: ISA at 4,000 ft is +7°C (15 - 2×4). Actual OAT is -15°C, which is ISA - 22°C. Correction = 4 ft per 1,000 ft per 1°C dev = 4 × 4 × 22 = 352 ft lower. True = 4,000 - 352 = 3,648 ft (in cold dense column, approximately 3,550 - 3,650 ft).'
      },
      {
        id: 'B',
        text: 'Approximately 4,350 ft (Higher than indicated)',
        isCorrect: false,
        examinerDistractorNote: 'TRAP (Sign Inversion): Candidate added the temperature error instead of subtracting it.'
      },
      {
        id: 'C',
        text: 'Exactly 4,000 ft because the subscale is set correctly to QNH',
        isCorrect: false,
        examinerDistractorNote: 'TRAP (QNH Misconception): QNH only guarantees reading aerodrome elevation AT the aerodrome level; it does NOT correct for non-standard temperature aloft.'
      },
      {
        id: 'D',
        text: '3,800 ft based on 27 ft per 1 hPa',
        isCorrect: false,
        examinerDistractorNote: 'TRAP (Pressure vs Temp Rule Swap): Candidate used the pressure lapse rate instead of the column temperature correction.'
      }
    ],
    explanation: 'Altimeters are calibrated to the ISA atmosphere (15°C at sea level, lapsing at 1.98°C/1,000 ft). When air is colder than ISA, air density is higher and pressure levels collapse closer to the ground. The rule of thumb is 4 ft of error per 1,000 ft of altitude per degree Celsius of ISA deviation. In cold air, the aircraft is significantly closer to terrain than the needle indicates!',
    goldenRule: 'Cold Air = True Altitude is LOWER than Indicated. When approaching mountains in winter, apply ICAO 8168 temperature corrections to MDA/DA.',
    easaReference: 'EASA TK Syllabus 050.01.03 & ICAO Doc 8168 Standards'
  }
];

export const RTFQExamTrainer: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [checkedSteps, setCheckedSteps] = useState({
    deliverable: false,
    units: false,
    polarity: false,
    elimination: false
  });

  const filteredQuestions = selectedCategory === 'ALL'
    ? TRAP_QUESTIONS
    : TRAP_QUESTIONS.filter(q => q.trapType === selectedCategory);

  const currentQ = filteredQuestions[currentIndex] || TRAP_QUESTIONS[0];

  const handleSelectOption = (optionId: string) => {
    if (selectedOption !== null) return; // Prevent multiple clicks
    triggerHaptic('selection');
    setSelectedOption(optionId);
    setShowExplanation(true);

    const isCorrect = currentQ.options.find(o => o.id === optionId)?.isCorrect;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const handleNext = () => {
    triggerHaptic('light');
    setSelectedOption(null);
    setShowExplanation(false);
    setCheckedSteps({ deliverable: false, units: false, polarity: false, elimination: false });
    setCurrentIndex(prev => (prev + 1) % filteredQuestions.length);
  };

  const handleReset = () => {
    triggerHaptic('medium');
    setSelectedOption(null);
    setShowExplanation(false);
    setCheckedSteps({ deliverable: false, units: false, polarity: false, elimination: false });
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/40 border border-amber-500/30 p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-wider mb-3">
              <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>EASA ATPL Defense Methodology // Core Principles</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              RTFQ <span className="text-amber-400">Exam Defense</span> Trainer
            </h1>
            <p className="mt-2 text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
              &ldquo;Treat EASA examinations not as memory checks, but as adversary traps constructed around unit swaps, negative stems, and intermediate calculation distractors.&rdquo;
            </p>
          </div>

          {/* Defense Score Widget */}
          <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 flex items-center gap-6 min-w-[220px]">
            <div className="flex flex-col">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Defense Accuracy</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-amber-400">
                  {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 100}%
                </span>
                <span className="text-xs text-slate-400 font-mono">({score.correct}/{score.total})</span>
              </div>
            </div>
            <button 
              onClick={handleReset} 
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors ml-auto"
              title="Reset Session"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-4 h-4 text-slate-500 shrink-0 ml-1" />
        {[
          { id: 'ALL', label: 'All Traps' },
          { id: 'UNIT_SWAP', label: 'Unit Divergence' },
          { id: 'NEGATIVE_STEM', label: 'Negative Stems' },
          { id: 'INTERMEDIATE_STEP', label: 'Intermediate Distractors' },
          { id: 'FALSE_OPPOSITE', label: 'False Opposites' },
          { id: 'CONDITIONAL', label: 'Atmospheric Conditions' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              triggerHaptic('light');
              setSelectedCategory(cat.id);
              setCurrentIndex(0);
              setSelectedOption(null);
              setShowExplanation(false);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Question Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl backdrop-blur-md">
        {/* Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/5 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400">
              {currentQ.subjectCode} • {currentQ.subject}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300">
              Trap: {currentQ.trapName}
            </span>
          </div>
          <span className="text-slate-500">
            Drill {currentIndex + 1} of {filteredQuestions.length}
          </span>
        </div>

        {/* RTFQ Defense Checklist - Interactive Step Bar */}
        <div className="bg-slate-950/60 rounded-2xl p-4 border border-white/5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono uppercase font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 4-Step RTFQ Pre-Flight Protocol
            </span>
            <span className="text-[11px] text-slate-500">Click steps as you audit the prompt</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <button
              onClick={() => setCheckedSteps(s => ({ ...s, deliverable: !s.deliverable }))}
              className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-start gap-2 ${
                checkedSteps.deliverable 
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-200' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${checkedSteps.deliverable ? 'text-amber-400' : 'text-slate-600'}`} />
              <div>
                <div className="font-semibold">1. Deliverable Clause</div>
                <div className="text-[10px] text-slate-500">Read final sentence first</div>
              </div>
            </button>

            <button
              onClick={() => setCheckedSteps(s => ({ ...s, units: !s.units }))}
              className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-start gap-2 ${
                checkedSteps.units 
                  ? 'bg-blue-500/15 border-blue-500/50 text-blue-200' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${checkedSteps.units ? 'text-blue-400' : 'text-slate-600'}`} />
              <div>
                <div className="font-semibold">2. Unit Audit</div>
                <div className="text-[10px] text-slate-500">Gallons, kg, lbs, ft, m, hPa</div>
              </div>
            </button>

            <button
              onClick={() => setCheckedSteps(s => ({ ...s, polarity: !s.polarity }))}
              className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-start gap-2 ${
                checkedSteps.polarity 
                  ? 'bg-red-500/15 border-red-500/50 text-red-200' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${checkedSteps.polarity ? 'text-red-400' : 'text-slate-600'}`} />
              <div>
                <div className="font-semibold">3. Polarity Stem</div>
                <div className="text-[10px] text-slate-500">Check for NOT / EXCEPT</div>
              </div>
            </button>

            <button
              onClick={() => setCheckedSteps(s => ({ ...s, elimination: !s.elimination }))}
              className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-start gap-2 ${
                checkedSteps.elimination 
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${checkedSteps.elimination ? 'text-emerald-400' : 'text-slate-600'}`} />
              <div>
                <div className="font-semibold">4. 50/50 Method</div>
                <div className="text-[10px] text-slate-500">Kill 2 early distractors</div>
              </div>
            </button>
          </div>
        </div>

        {/* Stem Presentation */}
        <div className="space-y-3">
          <div className="text-lg md:text-xl font-medium text-slate-100 leading-relaxed">
            {currentQ.question}
          </div>

          {/* Highlighting Alerts */}
          {(currentQ.unitAlert || currentQ.polarityAlert) && (
            <div className="flex flex-wrap gap-2 pt-2">
              {currentQ.unitAlert && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-mono">
                  <Compass className="w-3.5 h-3.5 text-blue-400" />
                  <span>{currentQ.unitAlert}</span>
                </div>
              )}
              {currentQ.polarityAlert && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-mono">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <span>{currentQ.polarityAlert}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Answer Options */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map(option => {
            const isSelected = selectedOption === option.id;
            let btnStyle = 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900';

            if (selectedOption !== null) {
              if (option.isCorrect) {
                btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold shadow-lg shadow-emerald-950/30';
              } else if (isSelected && !option.isCorrect) {
                btnStyle = 'bg-red-950/60 border-red-500 text-red-200 font-semibold';
              } else {
                btnStyle = 'bg-slate-950/30 border-slate-900 text-slate-600 opacity-60';
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                disabled={selectedOption !== null}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-4 ${btnStyle}`}
              >
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 border ${
                  isSelected && option.isCorrect
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : isSelected && !option.isCorrect
                    ? 'bg-red-500 text-white border-red-400'
                    : option.isCorrect && selectedOption !== null
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}>
                  {option.id}
                </span>

                <div className="flex-1">
                  <div className="text-sm md:text-base leading-snug">{option.text}</div>
                  {selectedOption !== null && (
                    <div className="mt-2 text-xs font-mono pt-2 border-t border-white/5 opacity-90">
                      {option.examinerDistractorNote}
                    </div>
                  )}
                </div>

                {selectedOption !== null && (
                  <div className="shrink-0 self-center">
                    {option.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-red-400" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Defense Protocol */}
        {showExplanation && (
          <div className="mt-6 pt-6 border-t border-white/10 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Operational Rule Box */}
            <div className="bg-amber-950/30 border border-amber-500/40 rounded-2xl p-4 flex items-start gap-3">
              <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
                  Flight Operations Golden Rule
                </div>
                <div className="text-sm text-amber-100/90 mt-1 leading-relaxed font-sans">
                  {currentQ.goldenRule}
                </div>
              </div>
            </div>

            {/* In-depth Conceptual Explanation */}
            <div className="bg-slate-950/80 rounded-2xl p-4 border border-white/5 space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-400" /> Syllabus Detail ({currentQ.easaReference})
              </div>
              <div className="text-xs md:text-sm text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </div>
            </div>

            {/* Next Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-sm"
              >
                <span>Next Defense Drill</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RTFQExamTrainer;
