import React, { useState } from 'react';
import { View } from '../../types';
import {
    ArrowLeft, Brain, Users, Radio, Activity, MessageSquare,
    CheckCircle, Target, Shield, BookOpen, ChevronRight, Award,
    Layers, Eye, Zap, RotateCcw, X, Sparkles, TrendingUp
} from 'lucide-react';

interface Props {
    onNavigate: (view: View) => void;
}

/* ────────────────────────── DATA ────────────────────────── */

const COMPETENCIES = [
    {
        id: 0,
        title: "Application of Procedures",
        short: "APR",
        icon: BookOpen,
        color: "#60a5fa",        // blue-400
        tailColor: "text-blue-400",
        tailBg: "bg-blue-500/10",
        tailBorder: "border-blue-500/30",
        description: "Identifies and applies procedures in accordance with published operating instructions and applicable regulations.",
        ksa: {
            knowledge: "SOPs, Regulations, Systems",
            skills: "Checklist discipline, Compliance",
            attitude: "Rigor, Adherence to rules"
        },
        indicators: [
            "Identifies the source of operating instructions",
            "Follows SOPs unless deviation is needed for safety",
            "Identifies and manages deviations from SOPs",
            "Applies relevant emergency and abnormal procedures"
        ],
        example: "During an engine failure after V1, the crew systematically follow the Engine Failure After Takeoff procedure, identifying the failed engine, maintaining directional control, and executing the memory items before referring to the QRH."
    },
    {
        id: 1,
        title: "Communication",
        short: "COM",
        icon: MessageSquare,
        color: "#34d399",        // emerald-400
        tailColor: "text-emerald-400",
        tailBg: "bg-emerald-500/10",
        tailBorder: "border-emerald-500/30",
        description: "Demonstrates effective oral, non-verbal and written communications, in normal and non-normal situations.",
        ksa: {
            knowledge: "Language proficiency, Standard phraseology",
            skills: "Active listening, Assertiveness",
            attitude: "Openness to feedback"
        },
        indicators: [
            "Ensures the recipient is ready and able to receive the information",
            "Selects appropriately what, when, how and with whom to communicate",
            "Conveys messages clearly, accurately and concisely",
            "Confirms the recipient correctly understands important information"
        ],
        example: "The First Officer notices the Captain has selected the wrong runway for departure. Using assertive communication, the FO states: 'Captain, I believe runway 27L is the assigned runway, not 27R. Shall I confirm with ATC?'"
    },
    {
        id: 2,
        title: "FPM – Automated",
        short: "FPA",
        icon: Radio,
        color: "#c084fc",        // purple-400
        tailColor: "text-purple-400",
        tailBg: "bg-purple-500/10",
        tailBorder: "border-purple-500/30",
        description: "Controls the aircraft flight path through automation, including appropriate use of flight management systems.",
        ksa: {
            knowledge: "Automation modes, Systems logic",
            skills: "Mode selection, Monitoring",
            attitude: "Trust but verify"
        },
        indicators: [
            "Selects the appropriate level and mode of automation",
            "Monitors the automation to ensure expected flight path",
            "Detects automation anomalies and takes appropriate action",
            "Manages automation with awareness of mode transitions"
        ],
        example: "During a RNAV STAR, the PM notices the aircraft is not following the expected vertical profile. They cross-check the FMS prediction, identify a constraint error, and alert the PF to correct it before deviation becomes significant."
    },
    {
        id: 3,
        title: "FPM – Manual",
        short: "FPM",
        icon: Activity,
        color: "#fbbf24",        // amber-400
        tailColor: "text-amber-400",
        tailBg: "bg-amber-500/10",
        tailBorder: "border-amber-500/30",
        description: "Controls the aircraft flight path through manual flight, including appropriate use of flight control systems.",
        ksa: {
            knowledge: "Aerodynamics, Aircraft limits",
            skills: "Hand-eye coordination, Smooth inputs",
            attitude: "Confidence, Precision"
        },
        indicators: [
            "Controls the aircraft manually with accuracy and smoothness",
            "Detects deviations from the desired flight path and corrects",
            "Manages the flight path to maintain situational awareness",
            "Uses raw data / basic modes when appropriate"
        ],
        example: "On a non-precision approach in turbulent conditions, the PF hand-flies using raw data, maintaining stable parameters while the PM calls deviations. The approach is stabilized by 1000ft AGL."
    },
    {
        id: 4,
        title: "Leadership & Teamwork",
        short: "LTW",
        icon: Users,
        color: "#fb7185",        // rose-400
        tailColor: "text-rose-400",
        tailBg: "bg-rose-500/10",
        tailBorder: "border-rose-500/30",
        description: "Demonstrates effective leadership and team working.",
        ksa: {
            knowledge: "CRM principles, Group dynamics",
            skills: "Delegation, Conflict resolution",
            attitude: "Empathy, Integrity"
        },
        indicators: [
            "Creates an atmosphere for open communication",
            "Takes initiative and gives directions when required",
            "Addresses and resolves conflicts and disagreements",
            "Demonstrates empathy and shows respect and tolerance"
        ],
        example: "The Captain notices the FO is overwhelmed during a busy departure. Rather than adding pressure, the Captain says: 'I'll handle the radio, you focus on the flight path. Let's sort tasks out.' This demonstrates supportive leadership."
    },
    {
        id: 5,
        title: "Problem Solving & Decision Making",
        short: "PSD",
        icon: Brain,
        color: "#818cf8",        // indigo-400
        tailColor: "text-indigo-400",
        tailBg: "bg-indigo-500/10",
        tailBorder: "border-indigo-500/30",
        description: "Accurately identifies risks and resolves problems. Uses the appropriate decision-making processes.",
        ksa: {
            knowledge: "Decision models (DODAR, FOR-DEC)",
            skills: "Risk assessment, Critical thinking",
            attitude: "Decisiveness, Calmness"
        },
        indicators: [
            "Identifies and verifies what and why things have gone wrong",
            "Employs proper problem-solving strategies",
            "Applies appropriate decision-making model",
            "Monitors, reviews and adapts decisions as required"
        ],
        example: "Approaching destination with a hydraulic leak, the crew uses DODAR: Diagnose (system A quantity decreasing), Options (continue, divert, hold), Decide (divert to nearest suitable airport), Assign (PM programs, PF flies), Review (monitor quantity trend)."
    },
    {
        id: 6,
        title: "Situation Awareness",
        short: "SAW",
        icon: Target,
        color: "#22d3ee",        // cyan-400
        tailColor: "text-cyan-400",
        tailBg: "bg-cyan-500/10",
        tailBorder: "border-cyan-500/30",
        description: "Perceives and comprehends all of the relevant information regarding the aircraft and its environment.",
        ksa: {
            knowledge: "Environment, Systems status",
            skills: "Scanning, Projection (Thinking ahead)",
            attitude: "Vigilance, Curiosity"
        },
        indicators: [
            "Identifies and assesses accurately the state of the aircraft and its systems",
            "Identifies and assesses accurately the aircraft's environment",
            "Anticipates and responds appropriately to developments",
            "Develops and maintains a mental model of the current state"
        ],
        example: "On approach, the PM projects: 'Weather is deteriorating, wind is shifting to a tailwind on runway 09. If we go around, runway 27 is available. Shall I get the ATIS update and brief a runway change?'"
    },
    {
        id: 7,
        title: "Workload Management",
        short: "WLM",
        icon: Shield,
        color: "#fb923c",        // orange-400
        tailColor: "text-orange-400",
        tailBg: "bg-orange-500/10",
        tailBorder: "border-orange-500/30",
        description: "Manages available resources effectively to prioritize and perform tasks in a timely manner.",
        ksa: {
            knowledge: "Task prioritization, Stress limits",
            skills: "Time management, Task shedding",
            attitude: "Self-discipline, Organization"
        },
        indicators: [
            "Prioritizes actions to manage tasks effectively",
            "Plans, prioritises and schedules tasks effectively",
            "Manages time and available resources efficiently",
            "Offers and gives assistance; asks for help when needed"
        ],
        example: "During a busy arrival, the cabin crew calls about a sick passenger. The PM prioritizes: 'Aviate, Navigate, Communicate. Let's complete the approach brief first, then I'll coordinate with cabin crew during the straight-in segment.'"
    }
];

const CONSCIOUS_COMPETENCE_STAGES = [
    {
        level: 1,
        title: "Unconscious Incompetence",
        subtitle: "\"You don't know what you don't know\"",
        color: "#ef4444",
        tailColor: "text-red-400",
        tailBg: "bg-red-500/10",
        tailBorder: "border-red-500/30",
        aviationExample: "A student pilot doesn't understand why CRM is important. They believe flying is simply about stick-and-rudder skills and don't realise the role of non-technical competencies in flight safety.",
        trainingImplication: "Initial ground school and awareness training. Expose students to accident case studies (e.g., Tenerife, AF447) showing how human factors lead to incidents. Build awareness of gaps.",
        icon: Eye
    },
    {
        level: 2,
        title: "Conscious Incompetence",
        subtitle: "\"You know what you don't know\"",
        color: "#f59e0b",
        tailColor: "text-amber-400",
        tailBg: "bg-amber-500/10",
        tailBorder: "border-amber-500/30",
        aviationExample: "After learning about DODAR decision-making, a cadet realizes they struggle under pressure and don't naturally follow a structured process. They understand the gap but can't yet perform reliably.",
        trainingImplication: "Structured simulator sessions with debriefs. Practice specific scenarios targeting weak competencies. Instructor provides constructive feedback. Deliberate practice is key.",
        icon: Zap
    },
    {
        level: 3,
        title: "Conscious Competence",
        subtitle: "\"You know, but it takes effort\"",
        color: "#22c55e",
        tailColor: "text-green-400",
        tailBg: "bg-green-500/10",
        tailBorder: "border-green-500/30",
        aviationExample: "A newly type-rated First Officer can apply threat and error management but needs to consciously think through each step. Under high workload, they might revert to old habits.",
        trainingImplication: "Line-Oriented Flight Training (LOFT). Gradually increase complexity. Build mental models through repetition. Recurrent training maintains the skill at this level.",
        icon: TrendingUp
    },
    {
        level: 4,
        title: "Unconscious Competence",
        subtitle: "\"It's second nature\"",
        color: "#3b82f6",
        tailColor: "text-blue-400",
        tailBg: "bg-blue-500/10",
        tailBorder: "border-blue-500/30",
        aviationExample: "An experienced Captain naturally scans for threats, communicates assertively, delegates tasks, and manages workload — without consciously thinking about the 'framework.' Competencies are embedded.",
        trainingImplication: "Risk of complacency — need recurrent evaluation to prevent skill erosion. EBT assessments help identify unconscious drift. Mentoring junior crew reinforces the Captain's own skills.",
        icon: Sparkles
    }
];

const EBT_SCENARIOS = [
    {
        id: 1,
        title: "Engine Failure After Takeoff",
        description: "During a departure in IMC, the left engine fails at V1+10. The crew must manage the emergency, follow procedures, and communicate with ATC while maintaining the flight path.",
        correctCompetencies: [0, 3, 1, 5, 6],
        explanation: "This scenario primarily tests Application of Procedures (memory items, QRH), FPM-Manual (maintaining flight path on one engine), Communication (with ATC and crew), Problem Solving (decision to continue or return), and Situation Awareness (monitoring remaining engine, terrain)."
    },
    {
        id: 2,
        title: "Diversion Decision in Deteriorating Weather",
        description: "Approaching destination, the crew receives updated weather showing conditions below minimums. Alternate is 45 minutes away. Fuel is adequate but not generous. Cabin crew reports an anxious passenger.",
        correctCompetencies: [5, 6, 1, 7, 4],
        explanation: "This scenario tests Problem Solving & Decision Making (divert decision using DODAR), Situation Awareness (weather projection, fuel state), Communication (crew coordination, ATC, passengers), Workload Management (prioritizing tasks), and Leadership & Teamwork (managing cabin concerns while flying)."
    },
    {
        id: 3,
        title: "TCAS Resolution Advisory on Approach",
        description: "On final approach, the crew receives a TCAS RA 'CLIMB CLIMB'. ATC simultaneously instructs to maintain altitude. The PM spots the conflicting traffic visually.",
        correctCompetencies: [0, 3, 6, 5, 1],
        explanation: "This scenario tests Application of Procedures (TCAS procedures mandate following RA over ATC), FPM-Manual (executing the climb), Situation Awareness (traffic perception and projection), Problem Solving (resolving ATC conflict), and Communication (informing ATC 'TCAS RA')."
    },
    {
        id: 4,
        title: "Automation Surprise During RNAV Approach",
        description: "During a complex RNAV arrival, the aircraft unexpectedly levels off instead of descending. The PM notices the FMA has changed to ALT HOLD. The PF hasn't noticed the mode reversion.",
        correctCompetencies: [2, 6, 1, 4, 7],
        explanation: "This scenario tests FPM-Automated (recognizing mode reversion, understanding automation logic), Situation Awareness (detecting deviation from expected path), Communication (PM alerting PF to anomaly), Leadership & Teamwork (PM speaking up assertively), and Workload Management (reprioritizing to resolve the issue)."
    }
];

const COMPARISON_DATA = [
    {
        aspect: "Philosophy",
        traditional: "Test to fail — identify weaknesses to mark as 'unsatisfactory'",
        modern: "Train to competence — develop through evidence-based assessment"
    },
    {
        aspect: "Scope",
        traditional: "Pass/Fail on specific manoeuvres (engine failure, ILS approach)",
        modern: "Holistic assessment of 8 core competencies across scenarios"
    },
    {
        aspect: "Grading",
        traditional: "Binary: Satisfactory / Unsatisfactory",
        modern: "5-point competency grading scale with behavioural indicators"
    },
    {
        aspect: "Focus",
        traditional: "Technical skills (stick and rudder)",
        modern: "Technical + non-technical skills (CRM, decision-making, SA)"
    },
    {
        aspect: "Scenarios",
        traditional: "Pre-defined, predictable check rides",
        modern: "Varied, operationally relevant scenarios (LOFT-style)"
    },
    {
        aspect: "Training Link",
        traditional: "Training and checking are separate events",
        modern: "Training informs assessment; assessment informs training (closed loop)"
    },
    {
        aspect: "Data Use",
        traditional: "Individual pass/fail records",
        modern: "Aggregate data drives fleet-wide training needs analysis"
    },
    {
        aspect: "Outcome",
        traditional: "Licence validation event",
        modern: "Continuous professional development and evidence-based training (EBT)"
    }
];

/* ─────────────────── COMPETENCY WHEEL SVG ─────────────────── */

const CompetencyWheel: React.FC<{
    selected: number | null;
    onSelect: (id: number | null) => void;
}> = ({ selected, onSelect }) => {
    const cx = 200, cy = 200, r = 150, innerR = 70;
    const segments = COMPETENCIES.length;
    const anglePerSegment = (2 * Math.PI) / segments;
    const gap = 0.025; // radians gap between segments

    return (
        <div className="flex flex-col items-center">
            <svg
                viewBox="0 0 400 400"
                className="w-full max-w-[400px] h-auto"
                style={{ filter: 'drop-shadow(0 0 20px rgba(16,185,129,0.1))' }}
            >
                <defs>
                    {COMPETENCIES.map((c, i) => (
                        <filter key={`glow-${i}`} id={`glow-${i}`}>
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feFlood floodColor={c.color} floodOpacity="0.6" result="color" />
                            <feComposite in="color" in2="blur" operator="in" result="glowColor" />
                            <feMerge>
                                <feMergeNode in="glowColor" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    ))}
                </defs>

                {/* Background circle */}
                <circle cx={cx} cy={cy} r={r + 10} fill="none" stroke="#1e293b" strokeWidth="1" />

                {/* Segments */}
                {COMPETENCIES.map((comp, i) => {
                    const startAngle = i * anglePerSegment - Math.PI / 2 + gap;
                    const endAngle = (i + 1) * anglePerSegment - Math.PI / 2 - gap;
                    const isActive = selected === i;

                    const outerR = isActive ? r + 8 : r;
                    const x1Outer = cx + outerR * Math.cos(startAngle);
                    const y1Outer = cy + outerR * Math.sin(startAngle);
                    const x2Outer = cx + outerR * Math.cos(endAngle);
                    const y2Outer = cy + outerR * Math.sin(endAngle);

                    const x1Inner = cx + innerR * Math.cos(startAngle);
                    const y1Inner = cy + innerR * Math.sin(startAngle);
                    const x2Inner = cx + innerR * Math.cos(endAngle);
                    const y2Inner = cy + innerR * Math.sin(endAngle);

                    const largeArc = anglePerSegment - 2 * gap > Math.PI ? 1 : 0;

                    const path = [
                        `M ${x1Inner} ${y1Inner}`,
                        `L ${x1Outer} ${y1Outer}`,
                        `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2Outer} ${y2Outer}`,
                        `L ${x2Inner} ${y2Inner}`,
                        `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x1Inner} ${y1Inner}`,
                        'Z'
                    ].join(' ');

                    // Label position
                    const midAngle = (startAngle + endAngle) / 2;
                    const labelR = (outerR + innerR) / 2;
                    const lx = cx + labelR * Math.cos(midAngle);
                    const ly = cy + labelR * Math.sin(midAngle);

                    return (
                        <g key={i}>
                            <path
                                d={path}
                                fill={isActive ? comp.color : `${comp.color}22`}
                                stroke={comp.color}
                                strokeWidth={isActive ? 2 : 1}
                                opacity={selected !== null && !isActive ? 0.35 : 1}
                                onClick={() => onSelect(isActive ? null : i)}
                                style={{
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    filter: isActive ? `url(#glow-${i})` : 'none'
                                }}
                            />
                            <text
                                x={lx}
                                y={ly}
                                textAnchor="middle"
                                dominantBaseline="central"
                                fill={isActive ? '#0f172a' : '#e2e8f0'}
                                fontSize="10"
                                fontWeight="bold"
                                style={{ pointerEvents: 'none', userSelect: 'none' }}
                            >
                                {comp.short}
                            </text>
                        </g>
                    );
                })}

                {/* Center circle */}
                <circle cx={cx} cy={cy} r={innerR - 8} fill="#0f172a" stroke="#334155" strokeWidth="1" />
                <text x={cx} y={cy - 10} textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">ICAO</text>
                <text x={cx} y={cy + 6} textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="bold">CORE</text>
                <text x={cx} y={cy + 22} textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">8 COMPS</text>
            </svg>
            <p className="text-slate-500 text-sm mt-2 text-center">Click a segment to explore</p>
        </div>
    );
};

/* ────────────── CONSCIOUS COMPETENCE LADDER ────────────── */

const ConsciousCompetenceLadder: React.FC = () => {
    const [activeStage, setActiveStage] = useState<number | null>(null);
    const stages = [...CONSCIOUS_COMPETENCE_STAGES].reverse(); // render bottom-to-top

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
                <Layers className="text-emerald-400" size={24} />
                <h2 className="text-2xl font-black text-white">Conscious Competence Model</h2>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
                The four-stage model describes how we progress from ignorance to mastery.
                In aviation training, understanding which stage you're at helps both instructor
                and student target the right interventions. Click each stage below.
            </p>

            <div className="relative">
                {/* Vertical connector line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 via-green-500/50 via-amber-500/50 to-red-500/50" />

                {stages.map((stage, displayIdx) => {
                    const isActive = activeStage === stage.level;
                    const Icon = stage.icon;

                    return (
                        <div key={stage.level} className="relative pl-20 mb-4">
                            {/* Step number circle */}
                            <button
                                onClick={() => setActiveStage(isActive ? null : stage.level)}
                                className="absolute left-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 z-10"
                                style={{
                                    backgroundColor: isActive ? stage.color : '#1e293b',
                                    color: isActive ? '#0f172a' : stage.color,
                                    border: `2px solid ${stage.color}`,
                                    boxShadow: isActive ? `0 0 20px ${stage.color}40` : 'none',
                                    transform: isActive ? 'scale(1.15)' : 'scale(1)'
                                }}
                            >
                                {stage.level}
                            </button>

                            {/* Card */}
                            <button
                                onClick={() => setActiveStage(isActive ? null : stage.level)}
                                className={`w-full text-left rounded-xl border p-5 transition-all duration-300 ${
                                    isActive
                                        ? `${stage.tailBg} ${stage.tailBorder} ring-1 ring-white/10`
                                        : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                                }`}
                            >
                                <div className="flex items-center gap-3 mb-1">
                                    <Icon size={18} className={stage.tailColor} />
                                    <h3 className="text-lg font-bold text-white">{stage.title}</h3>
                                    <ChevronRight
                                        size={16}
                                        className={`text-slate-500 ml-auto transition-transform duration-300 ${isActive ? 'rotate-90' : ''}`}
                                    />
                                </div>
                                <p className="text-slate-500 text-sm italic">{stage.subtitle}</p>

                                {isActive && (
                                    <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800">
                                            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">✈️ Aviation Example</h4>
                                            <p className="text-slate-400 text-sm leading-relaxed">{stage.aviationExample}</p>
                                        </div>
                                        <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800">
                                            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">🎓 Training Implication</h4>
                                            <p className="text-slate-400 text-sm leading-relaxed">{stage.trainingImplication}</p>
                                        </div>
                                    </div>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/* ─────────────────── EBT SCENARIO CARDS ─────────────────── */

const EBTScenarioCards: React.FC = () => {
    const [activeScenario, setActiveScenario] = useState<number | null>(null);
    const [selections, setSelections] = useState<Record<number, number[]>>({});
    const [revealed, setRevealed] = useState<Record<number, boolean>>({});

    const toggleSelection = (scenarioId: number, compId: number) => {
        if (revealed[scenarioId]) return;
        setSelections(prev => {
            const current = prev[scenarioId] || [];
            return {
                ...prev,
                [scenarioId]: current.includes(compId)
                    ? current.filter(c => c !== compId)
                    : [...current, compId]
            };
        });
    };

    const revealAnswer = (scenarioId: number) => {
        setRevealed(prev => ({ ...prev, [scenarioId]: true }));
    };

    const resetScenario = (scenarioId: number) => {
        setRevealed(prev => ({ ...prev, [scenarioId]: false }));
        setSelections(prev => ({ ...prev, [scenarioId]: [] }));
    };

    const getScore = (scenarioId: number) => {
        const scenario = EBT_SCENARIOS.find(s => s.id === scenarioId);
        if (!scenario) return { correct: 0, total: 0 };
        const selected = selections[scenarioId] || [];
        const correct = selected.filter(s => scenario.correctCompetencies.includes(s)).length;
        const falsePositives = selected.filter(s => !scenario.correctCompetencies.includes(s)).length;
        return {
            correct,
            total: scenario.correctCompetencies.length,
            falsePositives,
            percentage: Math.round((correct / scenario.correctCompetencies.length) * 100)
        };
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
                <Award className="text-emerald-400" size={24} />
                <h2 className="text-2xl font-black text-white">EBT Scenario Challenge</h2>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
                Evidence-Based Training (EBT) uses operationally relevant scenarios to assess multiple
                competencies simultaneously. For each scenario below, select which ICAO competencies you think
                are being primarily tested, then reveal the answer.
            </p>

            <div className="grid gap-6">
                {EBT_SCENARIOS.map((scenario) => {
                    const isActive = activeScenario === scenario.id;
                    const isRevealed = revealed[scenario.id];
                    const userSelections = selections[scenario.id] || [];
                    const score = getScore(scenario.id);

                    return (
                        <div
                            key={scenario.id}
                            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                                isActive
                                    ? 'bg-slate-800/80 border-emerald-500/30 ring-1 ring-emerald-500/10'
                                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                            }`}
                        >
                            {/* Scenario header */}
                            <button
                                onClick={() => setActiveScenario(isActive ? null : scenario.id)}
                                className="w-full text-left p-6 flex items-start gap-4"
                            >
                                <div className="bg-emerald-500/10 text-emerald-400 p-2.5 rounded-xl shrink-0 font-bold text-lg">
                                    {scenario.id}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-white mb-2">{scenario.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{scenario.description}</p>
                                </div>
                                <ChevronRight
                                    size={20}
                                    className={`text-slate-500 shrink-0 transition-transform duration-300 mt-1 ${isActive ? 'rotate-90' : ''}`}
                                />
                            </button>

                            {/* Expanded content */}
                            {isActive && (
                                <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="border-t border-slate-700 pt-5">
                                        <p className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">
                                            Select the competencies being tested:
                                        </p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
                                            {COMPETENCIES.map((comp) => {
                                                const isSelected = userSelections.includes(comp.id);
                                                const isCorrect = scenario.correctCompetencies.includes(comp.id);

                                                let chipStyle = 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600';
                                                if (isRevealed) {
                                                    if (isCorrect && isSelected) {
                                                        chipStyle = 'bg-green-500/15 border-green-500/40 text-green-400';
                                                    } else if (isCorrect && !isSelected) {
                                                        chipStyle = 'bg-amber-500/10 border-amber-500/30 text-amber-400';
                                                    } else if (!isCorrect && isSelected) {
                                                        chipStyle = 'bg-red-500/10 border-red-500/30 text-red-400';
                                                    }
                                                } else if (isSelected) {
                                                    chipStyle = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300';
                                                }

                                                return (
                                                    <button
                                                        key={comp.id}
                                                        onClick={() => toggleSelection(scenario.id, comp.id)}
                                                        disabled={isRevealed}
                                                        className={`px-3 py-2.5 rounded-lg border text-xs font-semibold transition-all duration-200 ${chipStyle} ${
                                                            isRevealed ? 'cursor-default' : 'cursor-pointer'
                                                        }`}
                                                    >
                                                        <span className="flex items-center gap-1.5">
                                                            {isRevealed && isCorrect && <CheckCircle size={12} />}
                                                            {isRevealed && !isCorrect && isSelected && <X size={12} />}
                                                            {comp.short}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-3">
                                            {!isRevealed ? (
                                                <button
                                                    onClick={() => revealAnswer(scenario.id)}
                                                    disabled={userSelections.length === 0}
                                                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                                                        userSelections.length > 0
                                                            ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-900'
                                                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                                    }`}
                                                >
                                                    Reveal Answer
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => resetScenario(scenario.id)}
                                                    className="px-5 py-2.5 rounded-xl text-sm font-bold bg-slate-700 hover:bg-slate-600 text-slate-300 transition-all flex items-center gap-2"
                                                >
                                                    <RotateCcw size={14} /> Try Again
                                                </button>
                                            )}
                                            {isRevealed && (
                                                <span className="text-sm font-bold" style={{
                                                    color: score.percentage! >= 80 ? '#34d399' : score.percentage! >= 50 ? '#fbbf24' : '#f87171'
                                                }}>
                                                    {score.correct}/{score.total} correct
                                                    {score.falsePositives! > 0 && ` · ${score.falsePositives} extra`}
                                                </span>
                                            )}
                                        </div>

                                        {/* Explanation */}
                                        {isRevealed && (
                                            <div className="mt-4 bg-slate-950/50 rounded-xl p-4 border border-slate-800 animate-in fade-in duration-300">
                                                <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">Explanation</h4>
                                                <p className="text-slate-400 text-sm leading-relaxed">{scenario.explanation}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/* ─────────── COMPARISON TABLE ─────────── */

const ComparisonTable: React.FC = () => {
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
                <RotateCcw className="text-emerald-400" size={24} />
                <h2 className="text-2xl font-black text-white">Traditional Checking vs. ICAO EBT</h2>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
                The aviation industry is shifting from traditional pass/fail checking to competency-based,
                evidence-based training and assessment. Hover over each row to compare the philosophies.
            </p>

            <div className="rounded-2xl border border-slate-700 overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-[140px_1fr_1fr] bg-slate-800/80 border-b border-slate-700">
                    <div className="p-4 text-sm font-bold text-slate-400 uppercase tracking-wider">Aspect</div>
                    <div className="p-4 text-sm font-bold text-red-400 uppercase tracking-wider border-l border-slate-700">
                        ❌ Traditional
                    </div>
                    <div className="p-4 text-sm font-bold text-emerald-400 uppercase tracking-wider border-l border-slate-700">
                        ✅ ICAO EBT
                    </div>
                </div>

                {/* Rows */}
                {COMPARISON_DATA.map((row, i) => (
                    <div
                        key={i}
                        className={`grid grid-cols-[140px_1fr_1fr] border-b border-slate-800 last:border-b-0 transition-colors duration-200 ${
                            hoveredRow === i ? 'bg-slate-800/60' : 'bg-slate-900/30'
                        }`}
                        onMouseEnter={() => setHoveredRow(i)}
                        onMouseLeave={() => setHoveredRow(null)}
                    >
                        <div className="p-4 text-sm font-bold text-white">{row.aspect}</div>
                        <div className={`p-4 text-sm border-l border-slate-800 transition-colors duration-200 ${
                            hoveredRow === i ? 'text-red-300' : 'text-slate-500'
                        }`}>
                            {row.traditional}
                        </div>
                        <div className={`p-4 text-sm border-l border-slate-800 transition-colors duration-200 ${
                            hoveredRow === i ? 'text-emerald-300' : 'text-slate-400'
                        }`}>
                            {row.modern}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */

const HPLCompetency: React.FC<Props> = ({ onNavigate }) => {
    const [selectedCompetency, setSelectedCompetency] = useState<number | null>(null);
    const [activeSection, setActiveSection] = useState<string>('wheel');

    const selectedComp = selectedCompetency !== null ? COMPETENCIES[selectedCompetency] : null;

    const sections = [
        { key: 'wheel', label: 'Competency Wheel', icon: Target },
        { key: 'ladder', label: 'Competence Model', icon: Layers },
        { key: 'ebt', label: 'EBT Scenarios', icon: Award },
        { key: 'comparison', label: 'Old vs New', icon: RotateCcw }
    ];

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => onNavigate(View.SYLLABUS_VIEWER)}
                    className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">ICAO Core Competencies</h1>
                    <p className="text-slate-400">040.01.01.01 Becoming a competent pilot</p>
                </div>
            </div>

            {/* Intro KSA Section – preserved from original */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
                {[
                    { l: 'K', t: 'Knowledge', d: 'What you know — the theoretical foundation underpinning every competency', c: 'from-blue-500 to-indigo-500' },
                    { l: 'S', t: 'Skills', d: 'What you can do — observable abilities applied in practice', c: 'from-emerald-500 to-teal-500' },
                    { l: 'A', t: 'Attitude', d: 'How you think & feel — the mindset that drives safe behaviour', c: 'from-amber-500 to-orange-500' }
                ].map((item, idx) => (
                    <div key={idx} className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.c} opacity-10 rounded-full blur-2xl -mr-8 -mt-8`}></div>
                        <div className="text-5xl font-black text-white/10 absolute bottom-4 right-4 group-hover:scale-110 transition-transform">{item.l}</div>
                        <h3 className="text-xl font-bold text-white mb-2">{item.t}</h3>
                        <p className="text-slate-400 text-sm">{item.d}</p>
                    </div>
                ))}
            </div>

            {/* Section Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
                {sections.map((sec) => {
                    const Icon = sec.icon;
                    const isActive = activeSection === sec.key;
                    return (
                        <button
                            key={sec.key}
                            onClick={() => setActiveSection(sec.key)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                                isActive
                                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 ring-1 ring-emerald-500/10'
                                    : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:bg-slate-700/60 hover:text-slate-300'
                            }`}
                        >
                            <Icon size={16} />
                            {sec.label}
                        </button>
                    );
                })}
            </div>

            {/* ──────────── SECTION: Competency Wheel ──────────── */}
            {activeSection === 'wheel' && (
                <div className="animate-in fade-in duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <Target className="text-emerald-400" size={24} />
                        <h2 className="text-2xl font-black text-white">ICAO Competency Framework</h2>
                    </div>
                    <p className="text-slate-400 mb-8 leading-relaxed max-w-3xl">
                        The ICAO competency framework defines 8 core competencies required of all airline pilots.
                        Each competency is assessed through observable behavioural indicators and underpinned by
                        Knowledge, Skills, and Attitudes (KSA). Click a segment on the wheel to explore.
                    </p>

                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                        {/* Wheel */}
                        <CompetencyWheel selected={selectedCompetency} onSelect={setSelectedCompetency} />

                        {/* Detail panel */}
                        <div className="min-h-[420px]">
                            {selectedComp ? (
                                <div className="glass-card rounded-2xl p-6 border border-slate-700 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-2xl font-black text-white mb-1">{selectedComp.title}</h3>
                                            <p className="text-slate-400 text-sm leading-relaxed">{selectedComp.description}</p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedCompetency(null)}
                                            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-white transition-colors"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>

                                    {/* KSA Breakdown */}
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 mt-6">KSA Breakdown</h4>
                                    <div className="space-y-2 mb-6">
                                        {[
                                            { label: 'Knowledge', value: selectedComp.ksa.knowledge, tag: 'KW', color: 'blue' },
                                            { label: 'Skills', value: selectedComp.ksa.skills, tag: 'SK', color: 'emerald' },
                                            { label: 'Attitude', value: selectedComp.ksa.attitude, tag: 'AT', color: 'amber' }
                                        ].map((k) => (
                                            <div key={k.tag} className="bg-slate-950/50 rounded-lg p-3 border border-slate-800 flex items-start gap-3">
                                                <div className={`bg-${k.color}-500/20 px-2 py-0.5 rounded text-${k.color}-400 text-xs font-bold shrink-0`}>{k.tag}</div>
                                                <div>
                                                    <span className="text-white text-sm font-semibold">{k.label}: </span>
                                                    <span className="text-slate-400 text-sm">{k.value}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Behavioral Indicators */}
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Behavioural Indicators</h4>
                                    <ul className="space-y-2 mb-6">
                                        {selectedComp.indicators.map((ind, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                                <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                                {ind}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Example */}
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Aviation Example</h4>
                                    <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
                                        <p className="text-slate-300 text-sm leading-relaxed italic">"{selectedComp.example}"</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="glass-card rounded-2xl p-8 border border-slate-700 flex flex-col items-center justify-center min-h-[420px] text-center">
                                    <Target size={48} className="text-slate-600 mb-4" />
                                    <h3 className="text-xl font-bold text-slate-400 mb-2">Select a Competency</h3>
                                    <p className="text-slate-500 text-sm max-w-xs">
                                        Click any segment on the wheel to view its description, behavioural indicators, KSA breakdown, and an aviation example.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick-access grid below wheel */}
                    <div className="mt-10">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Quick Access — All 8 Competencies</h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {COMPETENCIES.map((comp) => {
                                const Icon = comp.icon;
                                const isActive = selectedCompetency === comp.id;
                                return (
                                    <button
                                        key={comp.id}
                                        onClick={() => setSelectedCompetency(isActive ? null : comp.id)}
                                        className={`relative p-5 rounded-xl border text-left transition-all duration-300 group ${
                                            isActive
                                                ? `${comp.tailBg} ${comp.tailBorder} ring-1 ring-white/10 scale-[1.02] shadow-lg`
                                                : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                                        }`}
                                    >
                                        <div className={`${comp.tailColor} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon size={24} />
                                        </div>
                                        <h4 className="text-sm font-bold text-slate-200 leading-tight">{comp.title}</h4>
                                        <div className={`h-0.5 w-8 rounded-full mt-2 bg-gradient-to-r ${isActive ? 'from-white/60 to-transparent' : 'from-slate-700 to-transparent'}`} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ──────────── SECTION: Conscious Competence ──────────── */}
            {activeSection === 'ladder' && (
                <div className="animate-in fade-in duration-300">
                    <ConsciousCompetenceLadder />
                </div>
            )}

            {/* ──────────── SECTION: EBT Scenarios ──────────── */}
            {activeSection === 'ebt' && (
                <div className="animate-in fade-in duration-300">
                    <EBTScenarioCards />
                </div>
            )}

            {/* ──────────── SECTION: Comparison Table ──────────── */}
            {activeSection === 'comparison' && (
                <div className="animate-in fade-in duration-300">
                    <ComparisonTable />
                </div>
            )}
        </div>
    );
};

export default HPLCompetency;
