
import React, { useState } from 'react';
import {
    AlertOctagon, GitMerge, CheckSquare, RefreshCcw, Activity,
    ChevronRight, ChevronDown, TreePine, Brain, Zap, ShieldAlert,
    Target, Eye, Wrench, ArrowRight, Lightbulb, AlertTriangle,
    Shield, Lock, Unlock, ArrowDown, Play, RotateCcw, Layers,
    BookOpen, ClipboardList, Users, Gauge, Compass
} from 'lucide-react';

// ─── Error Classification Tree Data ──────────────────────────────
interface TreeNode {
    id: string;
    label: string;
    color: string;
    borderColor: string;
    icon: React.ReactNode;
    description: string;
    children?: TreeNode[];
    examples?: string[];
}

const errorTree: TreeNode = {
    id: 'root',
    label: 'Human Error',
    color: 'text-orange-400',
    borderColor: 'border-orange-500',
    icon: <AlertOctagon size={18} />,
    description: 'Any deviation from optimal human performance, whether intentional or unintentional.',
    children: [
        {
            id: 'slips',
            label: 'Slips',
            color: 'text-blue-400',
            borderColor: 'border-blue-500',
            icon: <Zap size={16} />,
            description: 'Attention failures — action not as planned. Good intention, bad execution. Skill-based errors.',
            examples: [
                'Selecting gear UP instead of flaps UP after landing',
                'Tuning the wrong frequency (transposition: 124.35 → 124.53)',
                'Moving the throttle when intending to move the prop lever',
                'Pressing the wrong button on the FMC due to adjacent key proximity',
            ],
        },
        {
            id: 'lapses',
            label: 'Lapses',
            color: 'text-indigo-400',
            borderColor: 'border-indigo-500',
            icon: <Brain size={16} />,
            description: 'Memory failures — forgetting to perform an action or losing place in a procedure. Skill/Rule-based.',
            examples: [
                'Forgetting to set the altimeter to QNH after transition level',
                'Losing your place on the checklist and skipping an item',
                'Forgetting to arm the spoilers before landing',
                'Omitting a callout during the approach briefing',
            ],
        },
        {
            id: 'mistakes',
            label: 'Mistakes',
            color: 'text-purple-400',
            borderColor: 'border-purple-500',
            icon: <Target size={16} />,
            description: 'Planning failures — the plan itself was wrong. Doing the wrong thing believing it is right.',
            children: [
                {
                    id: 'rule-based',
                    label: 'Rule-Based',
                    color: 'text-purple-300',
                    borderColor: 'border-purple-400',
                    icon: <BookOpen size={14} />,
                    description: 'Applying a good rule to the wrong situation, or using a bad/outdated rule.',
                    examples: [
                        'Applying the single-engine procedure for a dual-engine failure',
                        'Using a familiar approach chart for the wrong runway',
                        'Following the "always go around if unstable" rule but at an airfield where terrain makes a go-around more dangerous',
                    ],
                },
                {
                    id: 'knowledge-based',
                    label: 'Knowledge-Based',
                    color: 'text-purple-200',
                    borderColor: 'border-purple-300',
                    icon: <Lightbulb size={14} />,
                    description: 'No existing rule applies. Incorrect reasoning in a novel situation due to limited knowledge.',
                    examples: [
                        'Misinterpreting icing conditions and choosing the wrong altitude',
                        'Incorrectly diagnosing a hydraulic problem as electrical',
                        'Attempting a novel troubleshooting sequence never trained for',
                    ],
                },
            ],
        },
        {
            id: 'violations',
            label: 'Violations',
            color: 'text-red-400',
            borderColor: 'border-red-500',
            icon: <ShieldAlert size={16} />,
            description: 'Deliberate deviations from rules, procedures, or SOPs. The person knows the rule but chooses to deviate.',
            children: [
                {
                    id: 'routine',
                    label: 'Routine Violations',
                    color: 'text-red-300',
                    borderColor: 'border-red-400',
                    icon: <RotateCcw size={14} />,
                    description: 'Habitual shortcuts — often tolerated or even encouraged by workplace culture.',
                    examples: [
                        'Skipping the full pre-flight walkaround on short turnarounds',
                        'Not using the sterile cockpit rule below 10,000 ft as "nothing ever happens"',
                        'Habitually exceeding the speed limit in the taxi area',
                    ],
                },
                {
                    id: 'exceptional',
                    label: 'Exceptional Violations',
                    color: 'text-red-200',
                    borderColor: 'border-red-300',
                    icon: <AlertTriangle size={14} />,
                    description: 'Rare, one-time deviations — often in extreme or unusual circumstances.',
                    examples: [
                        'Landing on a closed runway to avoid running out of fuel',
                        'Exceeding structural limits to avoid terrain in an emergency',
                        'Departing without full fuel load to meet an urgent medical evacuation schedule',
                    ],
                },
                {
                    id: 'optimizing',
                    label: 'Optimizing Violations',
                    color: 'text-amber-300',
                    borderColor: 'border-amber-400',
                    icon: <Gauge size={14} />,
                    description: 'Breaking rules for personal gain (comfort, time-saving, thrill).',
                    examples: [
                        'Performing unauthorized low passes over a familiar area',
                        'Exceeding bank angle limits for a "smoother" visual approach',
                        'Skipping de-icing to avoid departure delay',
                    ],
                },
            ],
        },
    ],
};

// ─── Tree Node Component ─────────────────────────────────────────
const TreeNodeComponent: React.FC<{ node: TreeNode; depth?: number }> = ({ node, depth = 0 }) => {
    const [expanded, setExpanded] = useState(depth === 0);
    const hasChildren = (node.children && node.children.length > 0) || (node.examples && node.examples.length > 0);
    const indent = depth * 20;

    return (
        <div style={{ marginLeft: indent }}>
            <button
                onClick={() => setExpanded(!expanded)}
                className={`w-full text-left flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 mb-2
                    ${expanded
                        ? `bg-slate-800/80 ${node.borderColor} border-l-4 shadow-lg`
                        : 'bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600'
                    }`}
            >
                <div className={`mt-0.5 ${node.color} shrink-0`}>
                    {hasChildren ? (expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />) : <span className="inline-block w-4" />}
                </div>
                <div className={`mt-0.5 ${node.color} shrink-0`}>{node.icon}</div>
                <div className="flex-1 min-w-0">
                    <span className={`font-bold text-sm ${node.color}`}>{node.label}</span>
                    {expanded && (
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{node.description}</p>
                    )}
                </div>
            </button>

            {expanded && (
                <div className="transition-all duration-300">
                    {node.examples && node.examples.length > 0 && (
                        <div className="ml-10 mb-3 space-y-1.5">
                            {node.examples.map((ex, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-slate-400 bg-slate-900/40 p-2 rounded border border-slate-700/30">
                                    <Compass size={12} className="text-amber-500 mt-0.5 shrink-0" />
                                    <span>{ex}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {node.children && node.children.map(child => (
                        <TreeNodeComponent key={child.id} node={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Error Chain Interactive ─────────────────────────────────────
const ErrorChain: React.FC = () => {
    const [broken, setBroken] = useState<Set<number>>(new Set());

    const toggleBreak = (i: number) => {
        setBroken(prev => {
            const next = new Set(prev);
            if (next.has(i)) next.delete(i); else next.add(i);
            return next;
        });
    };

    const chainBroken = broken.size > 0;
    const events = [
        { label: 'Fatigue / High Workload', detail: 'Crew awake 14+ hours, complex weather' },
        { label: 'Missed Checklist Item', detail: 'Landing gear not confirmed due to distraction' },
        { label: 'Poor CRM', detail: 'F/O did not cross-check or challenge' },
        { label: 'Ignored Warning', detail: 'Gear warning horn dismissed as spurious' },
    ];

    return (
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                <Layers size={18} className="text-amber-400" />
                The Error Chain
            </h4>
            <p className="text-xs text-slate-500 mb-6">Click any event to break the chain and prevent the accident.</p>
            <div className="flex flex-col gap-1 items-center">
                {events.map((ev, i) => (
                    <React.Fragment key={i}>
                        <button
                            onClick={() => toggleBreak(i)}
                            className={`w-full max-w-xs p-3 rounded-lg border-2 text-center transition-all duration-300 group relative
                                ${broken.has(i)
                                    ? 'bg-green-900/30 border-green-500/50 line-through opacity-60'
                                    : 'bg-slate-800 border-slate-600 hover:border-orange-500/50 hover:bg-slate-700'
                                }`}
                        >
                            <span className={`text-xs font-bold block ${broken.has(i) ? 'text-green-400' : 'text-slate-300'}`}>
                                {broken.has(i) ? '✓ BROKEN' : ev.label}
                            </span>
                            <span className="text-[10px] text-slate-500">{ev.detail}</span>
                        </button>
                        {i < events.length - 1 && (
                            <div className={`h-5 w-0.5 transition-colors duration-300 ${broken.has(i) || broken.has(i + 1) ? 'bg-green-600/30' : 'bg-slate-600'}`} />
                        )}
                    </React.Fragment>
                ))}
                <div className="h-5 w-0.5 bg-slate-600" />
                <div className={`w-full max-w-xs p-4 rounded-lg border-2 text-center font-black transition-all duration-500
                    ${chainBroken
                        ? 'bg-green-900/30 border-green-500 text-green-400'
                        : 'bg-red-900/50 border-red-500 text-red-400 animate-pulse'
                    }`}>
                    {chainBroken ? '✓ ACCIDENT PREVENTED' : 'ACCIDENT'}
                </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 text-center">
                Breaking just <strong className="text-amber-400">one link</strong> in the chain can prevent the accident.
            </p>
        </div>
    );
};

// ─── Decision Making Models (Tabbed Comparison) ──────────────────
type DecisionModel = 'analytical' | 'rpd' | 'fordec';

const DecisionModelTabs: React.FC<{ onSelectFordec: () => void }> = ({ onSelectFordec }) => {
    const [model, setModel] = useState<DecisionModel>('analytical');

    const tabs: { key: DecisionModel; label: string; icon: React.ReactNode }[] = [
        { key: 'analytical', label: 'Analytical', icon: <ClipboardList size={16} /> },
        { key: 'rpd', label: 'Naturalistic / RPD', icon: <Eye size={16} /> },
        { key: 'fordec', label: 'FOR-DEC Model', icon: <GitMerge size={16} /> },
    ];

    return (
        <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Brain size={20} className="text-amber-400" />
                Decision Making Models
            </h3>
            {/* Tab bar */}
            <div className="flex bg-slate-900 p-1 rounded-lg mb-4 overflow-x-auto">
                {tabs.map(t => (
                    <button
                        key={t.key}
                        onClick={() => setModel(t.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md font-bold text-xs whitespace-nowrap transition-all ${model === t.key ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'text-slate-400 hover:text-white'}`}
                    >
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {/* Analytical */}
            {model === 'analytical' && (
                <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 space-y-4">
                    <p className="text-sm text-slate-300">Classical, slow, systematic decision-making. Best when time allows and the problem is novel.</p>
                    {/* Flowchart */}
                    <div className="flex flex-col items-center gap-1">
                        {[
                            { step: 'Identify Problem', desc: 'Recognise something is wrong' },
                            { step: 'Gather Information', desc: 'Collect all relevant data' },
                            { step: 'Generate Options', desc: 'Brainstorm possible solutions' },
                            { step: 'Evaluate Options', desc: 'Compare risks & benefits' },
                            { step: 'Select Best Option', desc: 'Choose optimal course' },
                            { step: 'Implement', desc: 'Execute the decision' },
                            { step: 'Review', desc: 'Monitor outcomes' },
                        ].map((s, i, arr) => (
                            <React.Fragment key={i}>
                                <div className="w-full max-w-sm bg-slate-800 border border-slate-600 rounded-lg p-3 text-center">
                                    <span className="text-xs font-bold text-amber-400 block">{s.step}</span>
                                    <span className="text-[10px] text-slate-500">{s.desc}</span>
                                </div>
                                {i < arr.length - 1 && <ArrowDown size={16} className="text-slate-600" />}
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-3 text-xs text-amber-300 mt-4">
                        <strong>Limitation:</strong> Too slow for time-critical aviation scenarios (e.g., engine failure on takeoff). Prone to analysis paralysis.
                    </div>
                </div>
            )}

            {/* RPD */}
            {model === 'rpd' && (
                <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 space-y-4">
                    <p className="text-sm text-slate-300">Recognition-Primed Decision (Klein, 1989). How experienced pilots actually decide — fast, intuitive pattern matching.</p>
                    <div className="flex flex-col items-center gap-1">
                        {[
                            { step: 'Situation Recognition', desc: 'Pattern match to prior experience', color: 'text-sky-400' },
                            { step: 'Mental Simulation', desc: '"If I do X, will it work?"', color: 'text-sky-400' },
                            { step: 'Modify if Needed', desc: 'Tweak the mental plan', color: 'text-sky-400' },
                            { step: 'Implement First Workable Option', desc: 'Act — don\'t compare all options', color: 'text-green-400' },
                        ].map((s, i, arr) => (
                            <React.Fragment key={i}>
                                <div className={`w-full max-w-sm bg-slate-800 border border-slate-600 rounded-lg p-3 text-center`}>
                                    <span className={`text-xs font-bold block ${s.color}`}>{s.step}</span>
                                    <span className="text-[10px] text-slate-500">{s.desc}</span>
                                </div>
                                {i < arr.length - 1 && <ArrowDown size={16} className="text-slate-600" />}
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3 text-xs text-green-300">
                            <strong>Strengths:</strong> Fast, uses experience, works under time pressure, used by 80%+ of experienced decision-makers.
                        </div>
                        <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3 text-xs text-red-300">
                            <strong>Weaknesses:</strong> Requires deep experience, can fail in truly novel situations, susceptible to biases (confirmation, anchoring).
                        </div>
                    </div>
                </div>
            )}

            {/* FOR-DEC Overview */}
            {model === 'fordec' && (
                <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 space-y-4">
                    <p className="text-sm text-slate-300">Structured decision model for non-normal situations. Designed by Lufthansa. Combines analytical rigour with time-bounded structure.</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {['Facts', 'Options', 'Risks & Benefits', 'Decision', 'Execution', 'Check'].map((s, i) => (
                            <React.Fragment key={s}>
                                <div className="bg-orange-600/20 border border-orange-600/40 rounded-lg px-4 py-3 text-center min-w-[100px]">
                                    <span className="text-lg font-black text-orange-400 block">{s[0]}</span>
                                    <span className="text-[10px] font-bold text-orange-200">{s}</span>
                                </div>
                                {i < 5 && <ArrowRight size={16} className="text-slate-600 self-center hidden sm:block" />}
                            </React.Fragment>
                        ))}
                    </div>
                    <button
                        onClick={onSelectFordec}
                        className="w-full mt-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-orange-600/20"
                    >
                        <Play size={16} /> Try Interactive FOR-DEC Walkthrough
                    </button>
                </div>
            )}
        </div>
    );
};

// ─── FOR-DEC Interactive Walkthrough ─────────────────────────────
const scenarios = [
    {
        title: 'Engine Fire After Takeoff',
        context: 'Shortly after takeoff from RWY 09L, climbing through 3,000 ft, the fire warning bell sounds. EICAS shows ENG 1 FIRE. Vibration sensed. Weather is VMC, airport below.',
        steps: [
            {
                id: 'F', label: 'Facts', desc: 'What do we know?',
                content: [
                    'Engine 1 fire indication — EICAS alert + fire bell',
                    'Aircraft is at 3,000 ft, climbing, gear up',
                    'VMC conditions, airport behind us',
                    'Fuel load: 6 hours, MTOW',
                    'Passengers on board: 180',
                ],
            },
            {
                id: 'O', label: 'Options', desc: 'What are our options?',
                content: [
                    'Option A: Return to departure airport immediately',
                    'Option B: Divert to alternate airport (25 NM east)',
                    'Option C: Continue to destination (not viable — fire)',
                ],
            },
            {
                id: 'R', label: 'Risks & Benefits', desc: 'Evaluate each option.',
                content: [
                    'Option A: ✅ Closest, ARFF available — ⚠️ Heavy landing (fuel dump may be needed)',
                    'Option B: ✅ Longer runway — ⚠️ Further away, overfly residential area',
                    'Option C: ❌ Unacceptable — active fire with passengers',
                ],
            },
            {
                id: 'D', label: 'Decision', desc: 'Choose the best option.',
                content: [
                    'DECISION: Return to departure airport (Option A)',
                    'Reason: Closest available, ARFF on standby, single-engine approach feasible',
                    'Fuel dump if required per QRH',
                ],
            },
            {
                id: 'E', label: 'Execution', desc: 'Execute and assign tasks.',
                content: [
                    'PF: Fly the aircraft, maintain single-engine flight profile',
                    'PM: Run ENG FIRE checklist (QRH), fire extinguisher discharge',
                    'PM: Contact ATC — declare MAYDAY, request return',
                    'PM: Brief cabin crew — prepare for possible evacuation',
                ],
            },
            {
                id: 'C', label: 'Check', desc: 'Is our decision still valid?',
                content: [
                    'Is the fire out after extinguisher discharge?',
                    'Are we maintaining safe altitude and speed?',
                    'Has ATC cleared us for approach?',
                    'Is cabin crew prepared?',
                    'If fire NOT out → consider fuel dump + expedite landing',
                ],
            },
        ],
    },
    {
        title: 'Weather Diversion En-Route',
        context: 'Cruising at FL370. Destination METAR shows CB activity, RVR 300m, wind 280/35G50. Alternate is 120 NM south with CAVOK conditions. Fuel remaining: 3h20m.',
        steps: [
            {
                id: 'F', label: 'Facts', desc: 'What do we know?',
                content: [
                    'Destination weather: CB, RVR 300m (below Cat I minima), strong gusting crosswind',
                    'Conditions expected to persist 2-3 hours',
                    'Fuel remaining: 3h20m (alternate requires 45min fuel)',
                    'Alternate CAVOK, runway suitable',
                    'No other weather issues en-route',
                ],
            },
            {
                id: 'O', label: 'Options', desc: 'What are our options?',
                content: [
                    'Option A: Hold at destination hoping weather improves',
                    'Option B: Divert to alternate now',
                    'Option C: Request a different approach (Cat II/III if equipped)',
                ],
            },
            {
                id: 'R', label: 'Risks & Benefits', desc: 'Evaluate each option.',
                content: [
                    'Option A: ⚠️ Weather may not improve, fuel burn reduces alternate options',
                    'Option B: ✅ Guaranteed safe landing, CAVOK — ⚠️ Passenger inconvenience, costs',
                    'Option C: ⚠️ Crosswind exceeds Cat II limits, not viable',
                ],
            },
            {
                id: 'D', label: 'Decision', desc: 'Choose the best option.',
                content: [
                    'DECISION: Divert to alternate now (Option B)',
                    'Reason: Weather forecast unreliable, fuel margins will shrink, alternate guarantees safety',
                    'Better early decision than running out of options later',
                ],
            },
            {
                id: 'E', label: 'Execution', desc: 'Execute and assign tasks.',
                content: [
                    'PF: Program FMC for alternate routing',
                    'PM: Contact ATC — request diversion clearance',
                    'PM: Coordinate with dispatch — inform of diversion',
                    'PM: PA to passengers — explain situation',
                    'PM: Calculate landing weight and performance for alternate',
                ],
            },
            {
                id: 'C', label: 'Check', desc: 'Is our decision still valid?',
                content: [
                    'Is alternate weather still CAVOK?',
                    'Fuel sufficient for the revised route?',
                    'Any NOTAM changes for alternate?',
                    'Cabin crew aware and prepared?',
                    'If alternate weather deteriorates → select second alternate',
                ],
            },
        ],
    },
];

const FordecWalkthrough: React.FC = () => {
    const [scenarioIdx, setScenarioIdx] = useState(0);
    const [step, setStep] = useState(0);
    const [revealed, setRevealed] = useState<Set<number>>(new Set([0]));
    const sc = scenarios[scenarioIdx];
    const currentStep = sc.steps[step];

    const goToStep = (i: number) => {
        setStep(i);
        setRevealed(prev => new Set(prev).add(i));
    };

    const nextStep = () => {
        if (step < sc.steps.length - 1) goToStep(step + 1);
    };

    const resetWalkthrough = () => {
        setStep(0);
        setRevealed(new Set([0]));
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Play size={20} className="text-orange-400" />
                    FOR-DEC Walkthrough
                </h3>
                <div className="flex gap-2">
                    {scenarios.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => { setScenarioIdx(i); resetWalkthrough(); }}
                            className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${scenarioIdx === i ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'}`}
                        >
                            {s.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* Scenario context */}
            <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-4">
                <span className="text-xs font-bold text-amber-400 block mb-1">SCENARIO</span>
                <p className="text-sm text-amber-200/80">{sc.context}</p>
            </div>

            {/* Step selector */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {sc.steps.map((s, i) => (
                    <button
                        key={s.id}
                        onClick={() => goToStep(i)}
                        disabled={!revealed.has(i)}
                        className={`p-3 rounded-lg border-b-4 transition-all relative
                            ${step === i
                                ? 'bg-orange-600 border-orange-800 text-white transform -translate-y-1 shadow-lg shadow-orange-600/20'
                                : revealed.has(i)
                                    ? 'bg-slate-800 border-slate-900 text-slate-400 hover:bg-slate-700 cursor-pointer'
                                    : 'bg-slate-900 border-slate-900 text-slate-700 cursor-not-allowed opacity-40'
                            }`}
                    >
                        <span className="text-xl font-black block">{s.id}</span>
                        <span className="text-[10px] font-bold uppercase">{s.label}</span>
                        {revealed.has(i) && i !== step && (
                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500" />
                        )}
                    </button>
                ))}
            </div>

            {/* Step content */}
            <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-orange-500/20 text-orange-400 p-3 rounded-full">
                        {step === 0 && <Activity size={24} />}
                        {step === 1 && <GitMerge size={24} />}
                        {step === 2 && <AlertOctagon size={24} />}
                        {step === 3 && <CheckSquare size={24} />}
                        {step === 4 && <Users size={24} />}
                        {step === 5 && <RefreshCcw size={24} />}
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white">{currentStep.label}</h4>
                        <p className="text-sm text-slate-400">{currentStep.desc}</p>
                    </div>
                </div>
                <div className="space-y-2">
                    {currentStep.content.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                            <ArrowRight size={14} className="text-orange-400 mt-0.5 shrink-0" />
                            <span className="text-sm text-slate-300">{item}</span>
                        </div>
                    ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-700/50">
                    <button
                        onClick={resetWalkthrough}
                        className="text-xs text-slate-500 hover:text-white flex items-center gap-1 transition-colors"
                    >
                        <RotateCcw size={14} /> Reset
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600">Step {step + 1} / {sc.steps.length}</span>
                        {step < sc.steps.length - 1 ? (
                            <button
                                onClick={nextStep}
                                className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-5 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-lg shadow-orange-600/20"
                            >
                                Next Step <ArrowRight size={14} />
                            </button>
                        ) : (
                            <span className="text-green-400 font-bold text-sm flex items-center gap-2">
                                <CheckSquare size={16} /> Walkthrough Complete
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Error Management Strategies ─────────────────────────────────
const ErrorManagement: React.FC = () => {
    const [revealed, setRevealed] = useState<Set<string>>(new Set());

    const toggleReveal = (key: string) => {
        setRevealed(prev => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key); else next.add(key);
            return next;
        });
    };

    const columns: {
        title: string;
        icon: React.ReactNode;
        color: string;
        bgColor: string;
        borderColor: string;
        desc: string;
        items: { key: string; label: string; detail: string }[];
    }[] = [
        {
            title: 'Prevention',
            icon: <Shield size={20} />,
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-900/20',
            borderColor: 'border-emerald-600/30',
            desc: 'Stop errors from happening in the first place.',
            items: [
                { key: 'p1', label: 'Standardised Procedures (SOPs)', detail: 'Clear, unambiguous checklists and callouts. Challenge-and-response format reduces slips and lapses.' },
                { key: 'p2', label: 'Training & Recurrent Checks', detail: 'Regular simulator sessions. CRM/TEM training keeps error awareness high.' },
                { key: 'p3', label: 'Ergonomic Design', detail: 'Cockpit layout that prevents mode confusion. Guard covers on critical switches. Colour coding.' },
                { key: 'p4', label: 'Fatigue Risk Management', detail: 'Duty time limits, controlled rest, FRMS programs that treat fatigue as a hazard.' },
                { key: 'p5', label: 'Just Culture', detail: 'Open reporting environment where crews report errors/hazards without fear of punitive action.' },
            ],
        },
        {
            title: 'Trapping',
            icon: <Eye size={20} />,
            color: 'text-sky-400',
            bgColor: 'bg-sky-900/20',
            borderColor: 'border-sky-600/30',
            desc: 'Catch errors before they cause harm.',
            items: [
                { key: 't1', label: 'Cross-Checking (Crew)', detail: 'PF/PM cross-monitor each other. "Two pairs of eyes" philosophy catches slips the acting pilot missed.' },
                { key: 't2', label: 'Automation Monitoring', detail: 'GPWS, TCAS, EGPWS, stall warnings — independent systems that alert crew to developing threats.' },
                { key: 't3', label: 'Challenge & Response Checklists', detail: 'One pilot reads, other responds. Missed items are immediately caught.' },
                { key: 't4', label: 'Closed-Loop Communication', detail: '"Cleared to FL350" → "Climbing FL350" → confirmed. Eliminates read-back/hear-back errors.' },
                { key: 't5', label: 'Briefings & Situational Awareness', detail: 'Approach briefings, threat briefings, and regular position awareness checks trap planning errors early.' },
            ],
        },
        {
            title: 'Mitigation',
            icon: <Wrench size={20} />,
            color: 'text-amber-400',
            bgColor: 'bg-amber-900/20',
            borderColor: 'border-amber-600/30',
            desc: 'Limit consequences when errors do occur.',
            items: [
                { key: 'm1', label: 'Emergency Procedures', detail: 'Well-drilled memory items and QRH procedures ensure correct response even under stress.' },
                { key: 'm2', label: 'Redundant Systems', detail: 'Dual hydraulic systems, multiple generators, backup instruments — single failures don\'t cascade.' },
                { key: 'm3', label: 'Safety Equipment', detail: 'Fire suppression, oxygen systems, crash-worthy seats, ELTs — limiting injury when prevention fails.' },
                { key: 'm4', label: 'Go-Around / Diversion Policy', detail: 'No penalty for going around. Stabilised approach criteria give a clear decision gate.' },
                { key: 'm5', label: 'Incident Reporting & Learning', detail: 'ASR, ASRS, mandatory occurrence reporting. Each incident feeds back into prevention and trapping improvements.' },
            ],
        },
    ];

    return (
        <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Shield size={20} className="text-amber-400" />
                Error Management Strategies
            </h3>
            <p className="text-xs text-slate-500 mb-4">Click each strategy to reveal aviation-specific details.</p>
            <div className="grid md:grid-cols-3 gap-4">
                {columns.map(col => (
                    <div key={col.title} className={`${col.bgColor} border ${col.borderColor} rounded-xl p-4`}>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={col.color}>{col.icon}</span>
                            <h4 className={`font-bold text-sm ${col.color}`}>{col.title}</h4>
                        </div>
                        <p className="text-[10px] text-slate-500 mb-3">{col.desc}</p>
                        <div className="space-y-2">
                            {col.items.map(item => (
                                <button
                                    key={item.key}
                                    onClick={() => toggleReveal(item.key)}
                                    className={`w-full text-left p-3 rounded-lg border transition-all duration-200
                                        ${revealed.has(item.key)
                                            ? 'bg-slate-800/80 border-slate-600'
                                            : 'bg-slate-900/50 border-slate-700/30 hover:bg-slate-800/50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-300">{item.label}</span>
                                        {revealed.has(item.key)
                                            ? <ChevronDown size={14} className="text-slate-500" />
                                            : <ChevronRight size={14} className="text-slate-600" />
                                        }
                                    </div>
                                    {revealed.has(item.key) && (
                                        <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{item.detail}</p>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Main Component ──────────────────────────────────────────────
type MainTab = 'error-tree' | 'decision-models' | 'fordec-walkthrough' | 'error-management';

const ErrorAndDecision: React.FC = () => {
    const [tab, setTab] = useState<MainTab>('error-tree');

    const tabConfig: { key: MainTab; label: string; icon: React.ReactNode }[] = [
        { key: 'error-tree', label: 'Error Classification', icon: <TreePine size={16} /> },
        { key: 'decision-models', label: 'Decision Models', icon: <Brain size={16} /> },
        { key: 'fordec-walkthrough', label: 'FOR-DEC Sim', icon: <Play size={16} /> },
        { key: 'error-management', label: 'Management', icon: <Shield size={16} /> },
    ];

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                        <GitMerge className="text-orange-400" />
                        Error & Decision (040.03)
                    </h2>
                    <p className="text-slate-400 text-sm">Human Error Theory, Decision Making Models, and Error Management.</p>
                </div>
                <div className="flex bg-slate-900 p-1 rounded-lg overflow-x-auto">
                    {tabConfig.map(t => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-md font-bold text-xs whitespace-nowrap transition-all
                                ${tab === t.key
                                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {t.icon}
                            <span className="hidden sm:inline">{t.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {tab === 'error-tree' && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                <TreePine size={20} className="text-amber-400" />
                                Error Classification Tree
                            </h3>
                            <p className="text-xs text-slate-500 mb-4">Click each node to expand. Based on Reason&apos;s taxonomy of human error (1990).</p>
                            <TreeNodeComponent node={errorTree} />
                        </div>
                        <ErrorChain />
                    </div>
                )}

                {tab === 'decision-models' && (
                    <DecisionModelTabs onSelectFordec={() => setTab('fordec-walkthrough')} />
                )}

                {tab === 'fordec-walkthrough' && <FordecWalkthrough />}

                {tab === 'error-management' && <ErrorManagement />}
            </div>
        </div>
    );
};

export default ErrorAndDecision;
