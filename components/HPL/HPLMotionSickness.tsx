import React, { useState } from 'react';
import {
    Waves, Brain, AlertCircle, Pill, RotateCcw,
    Eye, Ear, Activity, ChevronDown, ChevronRight,
    Clock, Shield, Thermometer, ArrowRight, CheckCircle,
    XCircle, User, Plane, MapPin, BarChart3, Heart
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type TabKey = 'mechanism' | 'symptoms' | 'susceptibility' | 'prevention';

interface ScenarioInput {
    label: string;
    status: 'agree' | 'conflict' | 'partial';
    detail: string;
}

interface Scenario {
    name: string;
    description: string;
    visual: ScenarioInput;
    vestibular: ScenarioInput;
    proprioceptive: ScenarioInput;
    brainResult: string;
}

interface Factor {
    name: string;
    value: number;
    icon: React.ElementType;
    details: string[];
    color: string;
}

interface FlowStep {
    title: string;
    icon: React.ElementType;
    items: string[];
    tip: string;
}

// ─── Scenario Data ───────────────────────────────────────────────────────────

const scenarios: Record<string, Scenario> = {
    normal: {
        name: 'Normal Flight',
        description: 'Smooth flight with clear visual reference — all senses agree.',
        visual: { label: 'Eyes see stable horizon', status: 'agree', detail: 'Visual field matches actual motion' },
        vestibular: { label: 'Inner ear detects smooth motion', status: 'agree', detail: 'Consistent acceleration signals' },
        proprioceptive: { label: 'Body feels seated & stable', status: 'agree', detail: 'Pressure cues match expected flight' },
        brainResult: '✅ All inputs match — no conflict, no sickness.',
    },
    turbulence: {
        name: 'Turbulence',
        description: 'Unpredictable bumps cause vestibular chaos while eyes see a stable cabin.',
        visual: { label: 'Cabin appears mostly stable', status: 'conflict', detail: 'Eyes say "not much is moving"' },
        vestibular: { label: 'Irregular jolts & accelerations', status: 'conflict', detail: 'Otoliths & canals fire unpredictably' },
        proprioceptive: { label: 'Body bounced in seat', status: 'partial', detail: 'Pressure changes don\'t match expectations' },
        brainResult: '⚠️ Vestibular signals contradict visual & proprioceptive — nausea likely.',
    },
    simulator: {
        name: 'Simulator',
        description: 'Visual motion without real G-forces — a classic cue mismatch.',
        visual: { label: 'Screen shows banking & turning', status: 'conflict', detail: 'Strong visual motion cues' },
        vestibular: { label: 'No real acceleration detected', status: 'conflict', detail: 'Otoliths sense no tilt or G-force' },
        proprioceptive: { label: 'Body static in chair', status: 'conflict', detail: 'No seatback pressure changes' },
        brainResult: '⚠️ Visual says "moving" — body says "still". Classic simulator sickness.',
    },
    reading: {
        name: 'Reading in Car',
        description: 'Eyes fixed on a book while the body is in motion — the textbook conflict.',
        visual: { label: 'Eyes locked on stationary page', status: 'conflict', detail: 'No peripheral motion cues' },
        vestibular: { label: 'Motion, turns, acceleration felt', status: 'conflict', detail: 'Semicircular canals sense every turn' },
        proprioceptive: { label: 'Body swaying with vehicle', status: 'agree', detail: 'Matches vestibular input' },
        brainResult: '⚠️ Visual says "still" — vestibular says "moving". Triggers nausea response.',
    },
};

// ─── Factor Data ─────────────────────────────────────────────────────────────

const susceptibilityFactors: Factor[] = [
    {
        name: 'Age',
        value: 80,
        icon: User,
        color: 'emerald',
        details: [
            'Children aged 2–12 are most susceptible.',
            'Susceptibility peaks around age 9–10.',
            'Adults gradually become less susceptible with age.',
            'Elderly individuals are least affected due to reduced vestibular sensitivity.',
        ],
    },
    {
        name: 'Gender',
        value: 65,
        icon: Heart,
        color: 'emerald',
        details: [
            'Women are more susceptible than men on average.',
            'Hormonal fluctuations (menstrual cycle) can increase susceptibility.',
            'Pregnancy increases risk significantly.',
            'Oral contraceptives may heighten sensitivity.',
        ],
    },
    {
        name: 'Experience',
        value: 90,
        icon: Shield,
        color: 'emerald',
        details: [
            'Student pilots have highest incidence.',
            '~90% adapt within 10 flights.',
            'Experienced pilots rarely affected under normal conditions.',
            'Long breaks from flying can reset adaptation.',
        ],
    },
    {
        name: 'Aircraft Type',
        value: 70,
        icon: Plane,
        color: 'emerald',
        details: [
            'Light aircraft: more turbulence = higher risk.',
            'Helicopters: vibrations add additional conflict.',
            'Large transport: smoother but pressure changes can affect crew.',
            'Aerobatic aircraft: extreme vestibular stimulation.',
        ],
    },
    {
        name: 'Phase of Flight',
        value: 60,
        icon: Activity,
        color: 'emerald',
        details: [
            'Maneuvers (steep turns, stalls) highest risk.',
            'Turbulence during cruise is common trigger.',
            'Approach in gusty conditions increases symptoms.',
            'Straight-and-level cruise is lowest risk.',
        ],
    },
    {
        name: 'Seat Position',
        value: 45,
        icon: MapPin,
        color: 'emerald',
        details: [
            'Rear seats experience more motion amplitude.',
            'Pilot (front) seat provides visual reference advantage.',
            'Window seats better than aisle — external visual cues.',
            'Over-wing seats have least vertical displacement in airliners.',
        ],
    },
];

// ─── Flowchart Data ──────────────────────────────────────────────────────────

const flowSteps: FlowStep[] = [
    {
        title: 'Pre-Flight Preparation',
        icon: Shield,
        items: [
            'Eat a light, low-fat meal 1–2 hours before flight.',
            'Ensure adequate hydration — dehydration worsens symptoms.',
            'Get 7–8 hours of sleep — fatigue multiplies susceptibility.',
            'Avoid alcohol for at least 12 hours before flight.',
            'Brief crew on motion sickness procedures.',
            'Have a sick bag readily accessible.',
        ],
        tip: '💡 Most motion sickness can be prevented by preparation alone.',
    },
    {
        title: 'During-Flight Strategies',
        icon: Plane,
        items: [
            'Fix gaze on the horizon or a distant external reference.',
            'Actively fly the aircraft — active control reduces symptoms.',
            'Ensure cool, fresh air flow over your face.',
            'Avoid head-down tasks (charts, kneeboard) for extended periods.',
            'Keep smooth, coordinated control inputs.',
            'At first sign of symptoms: look outside, breathe deeply.',
        ],
        tip: '💡 The pilot flying is far less likely to feel sick than the pilot monitoring.',
    },
    {
        title: 'Post-Event Recovery',
        icon: RotateCcw,
        items: [
            'Transfer aircraft control if symptoms become moderate.',
            'Sip cool water slowly — avoid gulping.',
            'Focus on deep, slow breathing.',
            'After landing, rest in fresh air — recovery may take 1–4 hours.',
            'Debrief the event — no stigma, it is a physiological response.',
            'If recurring, discuss desensitization plan with instructor or AME.',
        ],
        tip: '💡 ~90% of affected student pilots adapt fully within 10 exposure flights.',
    },
];

// ─── Medications Data (preserved from original) ──────────────────────────────

const medications = [
    { name: 'Hyoscine (Scopolamine)', type: 'Anticholinergic', side: 'Drowsiness, dry mouth, blurred vision', note: 'NOT approved for pilots in most jurisdictions' },
    { name: 'Promethazine', type: 'Antihistamine', side: 'Significant sedation', note: 'Generally NOT approved' },
    { name: 'Meclizine', type: 'Antihistamine', side: 'Mild sedation', note: 'Check with AME - some allow ground test first' },
    { name: 'Ginger', type: 'Natural', side: 'None significant', note: 'Generally acceptable, mild effectiveness' },
];

// ─── Symptom Timeline Data ───────────────────────────────────────────────────

const timelineStages = [
    {
        label: 'Baseline',
        range: [0, 10],
        severity: 'None',
        color: 'emerald',
        symptoms: ['Normal state', 'No symptoms present'],
        action: 'No action needed.',
    },
    {
        label: 'Early Warning',
        range: [11, 30],
        severity: 'Mild',
        color: 'yellow',
        symptoms: ['Pallor (pale skin)', 'Yawning', 'Cold sweat', 'Stomach awareness', 'Increased salivation'],
        action: 'Look outside at the horizon. Get fresh, cool air. Avoid head-down tasks.',
    },
    {
        label: 'Moderate',
        range: [31, 65],
        severity: 'Moderate',
        color: 'orange',
        symptoms: ['Nausea', 'Disorientation', 'Headache', 'Drowsiness', 'Decreased concentration', 'Decreased performance'],
        action: 'Take control or focus on instruments. Consider transferring control. Ventilate the cockpit.',
    },
    {
        label: 'Severe',
        range: [66, 100],
        severity: 'Severe',
        color: 'red',
        symptoms: ['Vomiting', 'Severe apathy', 'Complete incapacitation', 'Inability to perform duties'],
        action: 'Transfer control IMMEDIATELY. Recovery may take 1–4 hours after motion stops.',
    },
];

function getTimelineStage(value: number) {
    return timelineStages.find(s => value >= s.range[0] && value <= s.range[1]) ?? timelineStages[0];
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════

const HPLMotionSickness: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabKey>('mechanism');

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <Waves className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100">Motion Sickness</h1>
                </div>
                <p className="text-slate-400">
                    Understanding the sensory conflict theory, symptoms, and countermeasures for motion sickness in aviation.
                </p>
            </header>

            {/* Tab Bar */}
            <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg flex-wrap">
                <TabButton active={activeTab === 'mechanism'} onClick={() => setActiveTab('mechanism')} icon={Brain} label="Sensory Conflict" />
                <TabButton active={activeTab === 'symptoms'} onClick={() => setActiveTab('symptoms')} icon={AlertCircle} label="Symptoms" />
                <TabButton active={activeTab === 'susceptibility'} onClick={() => setActiveTab('susceptibility')} icon={BarChart3} label="Susceptibility" />
                <TabButton active={activeTab === 'prevention'} onClick={() => setActiveTab('prevention')} icon={Pill} label="Prevention" />
            </div>

            {/* Tab Content */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 min-h-[400px]">
                {activeTab === 'mechanism' && <MechanismSection />}
                {activeTab === 'symptoms' && <SymptomsSection />}
                {activeTab === 'susceptibility' && <SusceptibilitySection />}
                {activeTab === 'prevention' && <PreventionSection />}
            </div>
        </div>
    );
};

// ─── Tab Button ──────────────────────────────────────────────────────────────

const TabButton = ({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: React.ElementType; label: string }) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md transition-all font-medium text-sm ${active
            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
    >
        <Icon size={18} />
        {label}
    </button>
);

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 1 — SENSORY CONFLICT INTERACTIVE DIAGRAM (SVG)
// ═════════════════════════════════════════════════════════════════════════════

const MechanismSection = () => {
    const [activeScenario, setActiveScenario] = useState<string>('normal');
    const scenario = scenarios[activeScenario];

    const statusColor = (s: 'agree' | 'conflict' | 'partial') =>
        s === 'agree' ? '#22c55e' : s === 'conflict' ? '#ef4444' : '#f59e0b';
    const statusBg = (s: 'agree' | 'conflict' | 'partial') =>
        s === 'agree' ? 'bg-emerald-900/30 border-emerald-500/40' : s === 'conflict' ? 'bg-red-900/30 border-red-500/40' : 'bg-amber-900/30 border-amber-500/40';
    const statusLabel = (s: 'agree' | 'conflict' | 'partial') =>
        s === 'agree' ? 'AGREES' : s === 'conflict' ? 'CONFLICTS' : 'PARTIAL';
    const statusIcon = (s: 'agree' | 'conflict' | 'partial') =>
        s === 'agree' ? <CheckCircle size={14} className="text-emerald-400" /> : s === 'conflict' ? <XCircle size={14} className="text-red-400" /> : <AlertCircle size={14} className="text-amber-400" />;

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">Sensory Conflict Theory</h3>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    Motion sickness occurs when the brain receives conflicting signals from the visual system,
                    vestibular system, and proprioceptors about body position and motion.
                </p>
            </div>

            {/* Scenario Selector */}
            <div className="flex justify-center gap-2 flex-wrap">
                {Object.entries(scenarios).map(([key, s]) => (
                    <button
                        key={key}
                        onClick={() => setActiveScenario(key)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeScenario === key
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                    >
                        {s.name}
                    </button>
                ))}
            </div>

            {/* Description */}
            <p className="text-center text-slate-400 text-sm italic">{scenario.description}</p>

            {/* Interactive SVG Diagram */}
            <div className="flex justify-center">
                <svg viewBox="0 0 500 320" className="w-full max-w-[540px]" aria-label="Sensory Conflict Diagram">
                    {/* Background */}
                    <rect x="0" y="0" width="500" height="320" rx="16" fill="#0f172a" fillOpacity="0.5" />

                    {/* ── Visual System (top-left) ── */}
                    <g>
                        <circle cx="100" cy="70" r="40" fill="#1e293b" stroke={statusColor(scenario.visual.status)} strokeWidth="2.5" />
                        <text x="100" y="60" textAnchor="middle" fill={statusColor(scenario.visual.status)} fontSize="24">👁️</text>
                        <text x="100" y="82" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">VISUAL</text>
                        {/* Arrow to brain */}
                        <line x1="140" y1="90" x2="210" y2="150" stroke={statusColor(scenario.visual.status)} strokeWidth="3" strokeDasharray={scenario.visual.status === 'agree' ? '0' : '8,4'} />
                        <polygon points="210,150 198,143 202,155" fill={statusColor(scenario.visual.status)} />
                    </g>

                    {/* ── Vestibular System (top-right) ── */}
                    <g>
                        <circle cx="400" cy="70" r="40" fill="#1e293b" stroke={statusColor(scenario.vestibular.status)} strokeWidth="2.5" />
                        <text x="400" y="60" textAnchor="middle" fill={statusColor(scenario.vestibular.status)} fontSize="24">👂</text>
                        <text x="400" y="82" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">VESTIBULAR</text>
                        {/* Arrow to brain */}
                        <line x1="360" y1="90" x2="290" y2="150" stroke={statusColor(scenario.vestibular.status)} strokeWidth="3" strokeDasharray={scenario.vestibular.status === 'agree' ? '0' : '8,4'} />
                        <polygon points="290,150 298,143 302,155" fill={statusColor(scenario.vestibular.status)} />
                    </g>

                    {/* ── Proprioceptive System (bottom-center offset) ── */}
                    <g>
                        <circle cx="100" cy="240" r="40" fill="#1e293b" stroke={statusColor(scenario.proprioceptive.status)} strokeWidth="2.5" />
                        <text x="100" y="230" textAnchor="middle" fill={statusColor(scenario.proprioceptive.status)} fontSize="24">🧍</text>
                        <text x="100" y="255" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600">PROPRIOCEPTIVE</text>
                        {/* Arrow to brain */}
                        <line x1="140" y1="220" x2="210" y2="185" stroke={statusColor(scenario.proprioceptive.status)} strokeWidth="3" strokeDasharray={scenario.proprioceptive.status === 'agree' ? '0' : '8,4'} />
                        <polygon points="210,185 198,178 202,190" fill={statusColor(scenario.proprioceptive.status)} />
                    </g>

                    {/* ── Central Brain ── */}
                    <g>
                        <circle cx="250" cy="170" r="52" fill="#1e293b" stroke="#a78bfa" strokeWidth="2.5" />
                        <text x="250" y="162" textAnchor="middle" fill="#a78bfa" fontSize="30">🧠</text>
                        <text x="250" y="190" textAnchor="middle" fill="#c4b5fd" fontSize="11" fontWeight="700">BRAIN</text>
                    </g>

                    {/* ── Legend ── */}
                    <g>
                        <line x1="310" y1="265" x2="340" y2="265" stroke="#22c55e" strokeWidth="3" />
                        <text x="346" y="269" fill="#94a3b8" fontSize="10">Agree (solid)</text>

                        <line x1="310" y1="285" x2="340" y2="285" stroke="#ef4444" strokeWidth="3" strokeDasharray="8,4" />
                        <text x="346" y="289" fill="#94a3b8" fontSize="10">Conflict (dashed)</text>

                        <line x1="310" y1="305" x2="340" y2="305" stroke="#f59e0b" strokeWidth="3" strokeDasharray="8,4" />
                        <text x="346" y="309" fill="#94a3b8" fontSize="10">Partial (dashed)</text>
                    </g>
                </svg>
            </div>

            {/* Input Detail Cards */}
            <div className="grid md:grid-cols-3 gap-4">
                {[
                    { key: 'visual' as const, icon: Eye, label: 'Visual System', data: scenario.visual },
                    { key: 'vestibular' as const, icon: Ear, label: 'Vestibular System', data: scenario.vestibular },
                    { key: 'proprioceptive' as const, icon: Activity, label: 'Proprioceptive System', data: scenario.proprioceptive },
                ].map(({ key, icon: SIcon, label, data }) => (
                    <div key={key} className={`border rounded-lg p-4 ${statusBg(data.status)}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <SIcon size={18} className="text-slate-300" />
                            <h5 className="font-bold text-white text-sm">{label}</h5>
                            <span className="ml-auto flex items-center gap-1 text-xs font-bold">
                                {statusIcon(data.status)}
                                {statusLabel(data.status)}
                            </span>
                        </div>
                        <p className="text-sm text-slate-300 mb-1">{data.label}</p>
                        <p className="text-xs text-slate-500">{data.detail}</p>
                    </div>
                ))}
            </div>

            {/* Brain Result */}
            <div className="bg-slate-900 p-4 rounded-lg text-center">
                <p className="text-white font-semibold">{scenario.brainResult}</p>
            </div>

            {/* Preserved educational callout */}
            <div className="bg-slate-900 p-4 rounded-lg">
                <h4 className="font-bold text-white mb-2">Why does nausea occur?</h4>
                <p className="text-slate-300 text-sm">
                    The brain interprets sensory conflict as possible poisoning (historically, toxins can affect
                    coordination and perception). The vomiting center is activated as a protective mechanism to
                    expel the &quot;toxin&quot;. This is why motion sickness shares symptoms with food poisoning.
                </p>
            </div>
        </div>
    );
};

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 2 — SYMPTOM PROGRESSION TIMELINE (SLIDER)
// ═════════════════════════════════════════════════════════════════════════════

const SymptomsSection = () => {
    const [timeValue, setTimeValue] = useState(0);
    const stage = getTimelineStage(timeValue);

    const severityColorMap: Record<string, string> = {
        emerald: 'text-emerald-400',
        yellow: 'text-yellow-400',
        orange: 'text-orange-400',
        red: 'text-red-400',
    };
    const severityBgMap: Record<string, string> = {
        emerald: 'bg-emerald-500',
        yellow: 'bg-yellow-500',
        orange: 'bg-orange-500',
        red: 'bg-red-500',
    };
    const severityBorderMap: Record<string, string> = {
        emerald: 'border-emerald-500/30 bg-emerald-900/10',
        yellow: 'border-yellow-500/30 bg-yellow-900/10',
        orange: 'border-orange-500/30 bg-orange-900/10',
        red: 'border-red-500/30 bg-red-900/10',
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">Symptom Progression Timeline</h3>
                <p className="text-slate-400 max-w-2xl mx-auto text-sm">
                    Drag the slider to see how symptoms escalate over time if the motion stimulus continues and no action is taken.
                </p>
            </div>

            {/* Stage Indicators */}
            <div className="grid grid-cols-4 gap-2 text-center">
                {timelineStages.map((s) => {
                    const isActive = s.label === stage.label;
                    return (
                        <button
                            key={s.label}
                            onClick={() => setTimeValue(s.range[0])}
                            className={`py-2 px-2 rounded-lg text-xs font-bold transition-all border ${isActive
                                ? severityBorderMap[s.color]
                                : 'border-transparent bg-slate-900/30 text-slate-500 hover:bg-slate-700/50'
                                } ${isActive ? severityColorMap[s.color] : ''}`}
                        >
                            {s.label}
                        </button>
                    );
                })}
            </div>

            {/* Slider */}
            <div className="px-2">
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={timeValue}
                    onChange={(e) => setTimeValue(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-700 accent-emerald-500"
                    style={{
                        accentColor:
                            stage.color === 'emerald' ? '#22c55e'
                                : stage.color === 'yellow' ? '#eab308'
                                    : stage.color === 'orange' ? '#f97316'
                                        : '#ef4444',
                    }}
                />
                {/* Gradient bar underneath */}
                <div className="w-full h-1.5 rounded-full mt-1 overflow-hidden flex">
                    <div className="flex-[10] bg-emerald-500/60" />
                    <div className="flex-[20] bg-yellow-500/60" />
                    <div className="flex-[35] bg-orange-500/60" />
                    <div className="flex-[35] bg-red-500/60" />
                </div>
            </div>

            {/* Active Stage Card */}
            <div className={`border rounded-xl p-6 ${severityBorderMap[stage.color]}`}>
                <div className="flex items-center justify-between mb-4">
                    <h4 className={`text-lg font-bold ${severityColorMap[stage.color]}`}>{stage.label}</h4>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${severityBgMap[stage.color]} text-white`}>
                        {stage.severity}
                    </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <span className="text-sm text-slate-500 block mb-2">Symptoms:</span>
                        <ul className="space-y-1.5">
                            {stage.symptoms.map((s, i) => (
                                <li key={i} className="text-slate-300 text-sm flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${severityBgMap[stage.color]}`} />
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <span className="text-sm text-slate-500 block mb-2">Recommended Action:</span>
                        <p className="text-emerald-400 font-medium text-sm">{stage.action}</p>
                    </div>
                </div>
            </div>

            {/* Sopite Syndrome callout — preserved */}
            <div className="bg-amber-900/20 border border-amber-500/30 p-4 rounded-lg">
                <h4 className="font-bold text-amber-300 mb-2">Sopite Syndrome</h4>
                <p className="text-slate-300 text-sm">
                    A less-known variant where fatigue, drowsiness, and mood changes are the primary symptoms,
                    with minimal nausea. Can be dangerous in flight as it impairs vigilance without obvious warning signs.
                </p>
            </div>
        </div>
    );
};

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 3 — SUSCEPTIBILITY FACTORS (INTERACTIVE BAR CHART)
// ═════════════════════════════════════════════════════════════════════════════

const SusceptibilitySection = () => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">Motion Sickness Susceptibility Factors</h3>
                <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                    Click any bar to learn how each factor influences motion sickness risk.
                </p>
            </div>

            <div className="space-y-3">
                {susceptibilityFactors.map((factor, i) => {
                    const isExpanded = expandedIndex === i;
                    const FIcon = factor.icon;

                    return (
                        <div key={factor.name}>
                            <button
                                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                                className="w-full text-left group"
                            >
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="w-8 h-8 rounded-md bg-slate-700 flex items-center justify-center group-hover:bg-emerald-900/50 transition-colors">
                                        <FIcon size={16} className="text-emerald-400" />
                                    </div>
                                    <span className="text-sm font-semibold text-white w-28">{factor.name}</span>
                                    <div className="flex-1 h-6 bg-slate-900 rounded-full overflow-hidden relative">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-700 ease-out flex items-center justify-end pr-2"
                                            style={{ width: `${factor.value}%` }}
                                        >
                                            <span className="text-xs font-bold text-white drop-shadow">{factor.value}%</span>
                                        </div>
                                    </div>
                                    {isExpanded
                                        ? <ChevronDown size={16} className="text-emerald-400" />
                                        : <ChevronRight size={16} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                                    }
                                </div>
                            </button>

                            {isExpanded && (
                                <div className="ml-11 mt-2 mb-2 bg-emerald-900/15 border border-emerald-500/20 rounded-lg p-4 animate-in">
                                    <ul className="space-y-1.5">
                                        {factor.details.map((d, j) => (
                                            <li key={j} className="text-slate-300 text-sm flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                                                {d}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Impact label */}
            <div className="flex justify-between text-xs text-slate-500 px-11">
                <span>Low Impact</span>
                <span>High Impact</span>
            </div>
        </div>
    );
};

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 4 — PREVENTION & TREATMENT FLOWCHART + MEDICATIONS
// ═════════════════════════════════════════════════════════════════════════════

const PreventionSection = () => {
    const [activeStep, setActiveStep] = useState(0);
    const step = flowSteps[activeStep];
    const StepIcon = step.icon;

    const tips = [
        { icon: Eye, title: 'Visual Fixation', desc: 'Look at the horizon or a stable reference point outside the aircraft' },
        { icon: Activity, title: 'Active Control', desc: 'Flying the aircraft yourself reduces symptoms vs being a passenger' },
        { icon: Thermometer, title: 'Ventilation', desc: 'Cool, fresh air helps — avoid hot, stuffy cockpits' },
        { icon: Heart, title: 'Light Meals', desc: 'Avoid heavy, fatty meals before flight. Light snacks are fine' },
        { icon: Clock, title: 'Adequate Rest', desc: 'Fatigue significantly increases susceptibility' },
        { icon: AlertCircle, title: 'Avoid Reading', desc: 'Head-down tasks increase conflict — look up frequently' },
    ];

    return (
        <div className="space-y-6">
            {/* ── Click-Through Flowchart ── */}
            <div>
                <h3 className="text-xl font-bold text-white text-center mb-2">Prevention & Treatment Flowchart</h3>
                <p className="text-slate-400 text-sm text-center mb-4">Step through the three phases of motion sickness management.</p>

                {/* Phase Selector */}
                <div className="flex items-center justify-center gap-1 mb-6 flex-wrap">
                    {flowSteps.map((fs, i) => {
                        const FSIcon = fs.icon;
                        return (
                            <React.Fragment key={i}>
                                <button
                                    onClick={() => setActiveStep(i)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeStep === i
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white'
                                        }`}
                                >
                                    <FSIcon size={16} />
                                    {fs.title}
                                </button>
                                {i < flowSteps.length - 1 && (
                                    <ArrowRight size={16} className="text-slate-600 mx-1 hidden sm:block" />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Active Step Card */}
                <div className="bg-emerald-900/15 border border-emerald-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <StepIcon size={22} className="text-emerald-400" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-white">{step.title}</h4>
                            <span className="text-xs text-emerald-400 font-semibold">Step {activeStep + 1} of {flowSteps.length}</span>
                        </div>
                    </div>
                    <ul className="space-y-2 mb-4">
                        {step.items.map((item, i) => (
                            <li key={i} className="text-slate-300 text-sm flex items-start gap-3">
                                <CheckCircle size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <div className="bg-slate-900/60 rounded-lg p-3">
                        <p className="text-emerald-300 text-sm font-medium">{step.tip}</p>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                            disabled={activeStep === 0}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            ← Previous
                        </button>
                        <button
                            onClick={() => setActiveStep(Math.min(flowSteps.length - 1, activeStep + 1))}
                            disabled={activeStep === flowSteps.length - 1}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Quick Tips Grid (preserved content) ── */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-bold text-white mb-4">Quick Prevention Tips</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {tips.map((tip, i) => {
                            const TipIcon = tip.icon;
                            return (
                                <div key={i} className="bg-slate-900/50 p-3 rounded-lg hover:bg-slate-900/80 transition-colors">
                                    <div className="w-8 h-8 rounded-md bg-emerald-500/15 flex items-center justify-center mb-2">
                                        <TipIcon size={16} className="text-emerald-400" />
                                    </div>
                                    <h5 className="font-bold text-white text-sm mb-1">{tip.title}</h5>
                                    <p className="text-xs text-slate-400">{tip.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-white mb-4">Desensitization</h3>
                    <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-lg mb-4">
                        <div className="flex items-center gap-3 mb-3">
                            <RotateCcw className="text-emerald-400" />
                            <span className="font-bold text-emerald-300">Adaptation occurs with exposure</span>
                        </div>
                        <p className="text-slate-300 text-sm">
                            Most pilots develop natural tolerance over time. Start with short flights in calm conditions
                            and gradually increase duration and complexity. About 90% of affected individuals adapt within 10 flights.
                        </p>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-lg">
                        <h4 className="font-bold text-amber-400 mb-2">Student Pilot Tips</h4>
                        <ul className="space-y-2 text-sm text-slate-300">
                            <li>• Avoid scheduling lessons in turbulent conditions initially</li>
                            <li>• Keep lessons short (30–45 min) until adapted</li>
                            <li>• Practice maneuvers gradually — don't do steep turns day 1</li>
                            <li>• Take breaks if symptoms start — don't push through</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* ── Medications Table (preserved content) ── */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Medications</h3>
                <div className="bg-red-900/20 border border-red-500/30 p-3 rounded-lg mb-4">
                    <p className="text-red-300 text-sm font-medium">
                        ⚠️ Most motion sickness medications are <span className="text-white">PROHIBITED</span> for pilots
                        due to sedating side effects. Always consult your AME before taking any medication.
                    </p>
                </div>
                <div className="overflow-x-auto rounded-lg border border-slate-700">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-900">
                            <tr>
                                <th className="px-4 py-2 text-left text-slate-400">Medication</th>
                                <th className="px-4 py-2 text-left text-slate-400">Type</th>
                                <th className="px-4 py-2 text-left text-slate-400">Side Effects</th>
                                <th className="px-4 py-2 text-left text-slate-400">Aviation Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medications.map((med, i) => (
                                <tr key={i} className="border-t border-slate-700">
                                    <td className="px-4 py-2 text-white font-medium">{med.name}</td>
                                    <td className="px-4 py-2 text-slate-300">{med.type}</td>
                                    <td className="px-4 py-2 text-amber-400">{med.side}</td>
                                    <td className="px-4 py-2 text-red-400 text-xs">{med.note}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HPLMotionSickness;
