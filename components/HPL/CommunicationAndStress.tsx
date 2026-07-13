
import React, { useState } from 'react';
import {
  MessageSquare, Ear, Zap, Thermometer, UserCheck, EyeOff, Mic, Activity,
  ArrowRight, Gauge, HeartPulse, Battery, AlertTriangle, Shield, Brain,
  Wind, ChevronDown, ChevronUp, Radio, Volume2, Users, Target,
  Megaphone, AlertCircle, CheckCircle2, XCircle, Flame, Snowflake,
  Clock, Dumbbell, RefreshCw, Layers
} from 'lucide-react';

// ─── Main Component ────────────────────────────────────────────────────────────
const CommunicationAndStress: React.FC = () => {
    const [tab, setTab] = useState<'comms' | 'theory' | 'stress' | 'gas' | 'shannon' | 'assertive' | 'toolkit'>('stress');

    const tabs = [
        { id: 'stress' as const, label: 'Stress Bucket', icon: Gauge },
        { id: 'gas' as const, label: 'G.A.S. Model', icon: Activity },
        { id: 'shannon' as const, label: 'Comm Model', icon: Radio },
        { id: 'assertive' as const, label: 'Assertiveness', icon: Shield },
        { id: 'toolkit' as const, label: 'Mgmt Toolkit', icon: Brain },
        { id: 'comms' as const, label: '4-Ears', icon: Ear },
        { id: 'theory' as const, label: 'Comm Theory', icon: MessageSquare },
    ];

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <HeartPulse className="text-pink-400" />
                        Stress & Communication (040.03/06)
                    </h2>
                    <p className="text-slate-400 text-sm">Overload, Underload, Stress Management and Communication Models.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg overflow-x-auto">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`px-3 py-2 rounded-md font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${tab === t.id ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20' : 'text-slate-400 hover:text-white'}`}
                        >
                            <t.icon size={14} />
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {tab === 'stress' && <StressAccumulator />}
            {tab === 'gas' && <GasModelInteractive />}
            {tab === 'shannon' && <ShannonWeaverModel />}
            {tab === 'assertive' && <AssertivenessStyles />}
            {tab === 'toolkit' && <StressManagementToolkit />}
            {tab === 'comms' && <FourEarsModel />}
            {tab === 'theory' && <CommTheory />}
        </div>
    );
};

// ─── 1. Shannon-Weaver Communication Model (Interactive SVG) ────────────────
type ShannonElement = 'sender' | 'encoding' | 'channel' | 'decoding' | 'receiver' | 'noise' | 'feedback' | null;

const shannonData: Record<Exclude<ShannonElement, null>, { title: string; desc: string; example: string; barrier: string; color: string }> = {
    sender: {
        title: 'Sender (Source)',
        desc: 'The person who initiates the communication. In aviation, typically the PF, PM, or ATC.',
        example: 'Captain: "Set heading 270."',
        barrier: 'Unclear intent, emotional state, authority gradient inhibiting expression.',
        color: '#38bdf8',
    },
    encoding: {
        title: 'Encoding',
        desc: 'Translating thoughts into words, gestures, or signals. Uses ICAO phraseology in aviation.',
        example: '"Turn left heading two-seven-zero" (standard phraseology)',
        barrier: 'Non-standard phraseology, language barrier, jargon mismatch.',
        color: '#818cf8',
    },
    channel: {
        title: 'Channel (Medium)',
        desc: 'The medium through which the message travels — radio, intercom, face-to-face, or data-link.',
        example: 'VHF radio transmission to ATC on 121.5 MHz.',
        barrier: 'Radio congestion, frequency blockage, intercom failure.',
        color: '#a78bfa',
    },
    decoding: {
        title: 'Decoding',
        desc: 'The receiver interprets and makes sense of the message. Influenced by expectation and experience.',
        example: 'FO interprets "two-seven-zero" as magnetic heading, not QDR.',
        barrier: 'Expectation bias, fatigue affecting comprehension, cultural differences.',
        color: '#c084fc',
    },
    receiver: {
        title: 'Receiver',
        desc: 'The person the message is intended for. Must actively listen and read back for confirmation.',
        example: 'FO reads back: "Left heading 270, [callsign]."',
        barrier: 'Distraction, high workload, passive listening, no readback.',
        color: '#f472b6',
    },
    noise: {
        title: 'Noise (Interference)',
        desc: 'Any factor that distorts or prevents the message from being received accurately.',
        example: 'Engine noise, co-frequency transmissions, accent differences, emotional stress.',
        barrier: 'Physical noise (engines), physiological (hearing loss), psychological (preoccupation), semantic (ambiguity).',
        color: '#f97316',
    },
    feedback: {
        title: 'Feedback Loop',
        desc: "The receiver's response confirming message receipt and understanding. Essential in aviation readback/hearback.",
        example: '"Readback correct" confirms the communication loop is closed.',
        barrier: 'No readback requested, "hearback" error (not catching wrong readback).',
        color: '#22d3ee',
    },
};

const ShannonWeaverModel = () => {
    const [selected, setSelected] = useState<ShannonElement>(null);

    const BoxNode = ({ id, label, x, y, w, h }: { id: Exclude<ShannonElement, null>; label: string; x: number; y: number; w: number; h: number }) => {
        const isActive = selected === id;
        const data = shannonData[id];
        return (
            <g className="cursor-pointer" onClick={() => setSelected(selected === id ? null : id)}>
                <rect
                    x={x} y={y} width={w} height={h} rx={8}
                    fill={isActive ? data.color + '33' : '#1e293b'}
                    stroke={isActive ? data.color : '#475569'}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    className="transition-all duration-300"
                />
                <text
                    x={x + w / 2} y={y + h / 2 + 5}
                    textAnchor="middle" fontSize="13" fontWeight="bold"
                    fill={isActive ? data.color : '#94a3b8'}
                    className="pointer-events-none select-none"
                >
                    {label}
                </text>
            </g>
        );
    };

    return (
        <div className="animate-in fade-in space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Radio className="text-sky-400" size={22} />
                Shannon-Weaver Communication Model
            </h3>
            <p className="text-sm text-slate-400">Click any element to see aviation-specific examples and barriers.</p>

            {/* SVG Diagram */}
            <div className="bg-slate-900 rounded-xl border border-slate-700 p-4 overflow-x-auto">
                <svg viewBox="0 0 720 260" className="w-full" style={{ minWidth: 600 }}>
                    {/* Flow Arrows */}
                    <defs>
                        <marker id="arrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
                        </marker>
                        <marker id="arrowCyan" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#22d3ee" />
                        </marker>
                        <marker id="arrowOrange" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#f97316" />
                        </marker>
                    </defs>

                    {/* Main flow arrows */}
                    <line x1="135" y1="105" x2="165" y2="105" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow)" />
                    <line x1="295" y1="105" x2="325" y2="105" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow)" />
                    <line x1="455" y1="105" x2="485" y2="105" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow)" />
                    <line x1="615" y1="105" x2="645" y2="105" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow)" />

                    {/* Noise arrow down */}
                    <line x1="390" y1="40" x2="390" y2="75" stroke="#f97316" strokeWidth="2" strokeDasharray="5 3" markerEnd="url(#arrowOrange)" />

                    {/* Feedback arc (bottom) */}
                    <path d="M 680 130 Q 680 230 390 230 Q 100 230 50 130" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="6 4" markerEnd="url(#arrowCyan)" />
                    <g className="cursor-pointer" onClick={() => setSelected(selected === 'feedback' ? null : 'feedback')}>
                        <rect x="330" y="215" width="120" height="32" rx="6"
                            fill={selected === 'feedback' ? '#22d3ee22' : '#1e293b'}
                            stroke={selected === 'feedback' ? '#22d3ee' : '#475569'}
                            strokeWidth={selected === 'feedback' ? 2.5 : 1}
                        />
                        <text x="390" y="236" textAnchor="middle" fontSize="12" fontWeight="bold"
                            fill={selected === 'feedback' ? '#22d3ee' : '#94a3b8'}
                            className="pointer-events-none select-none"
                        >
                            FEEDBACK
                        </text>
                    </g>

                    {/* Noise box (top) */}
                    <g className="cursor-pointer" onClick={() => setSelected(selected === 'noise' ? null : 'noise')}>
                        <rect x="335" y="8" width="110" height="32" rx="6"
                            fill={selected === 'noise' ? '#f9731633' : '#1e293b'}
                            stroke={selected === 'noise' ? '#f97316' : '#475569'}
                            strokeWidth={selected === 'noise' ? 2.5 : 1}
                        />
                        <text x="390" y="29" textAnchor="middle" fontSize="12" fontWeight="bold"
                            fill={selected === 'noise' ? '#f97316' : '#94a3b8'}
                            className="pointer-events-none select-none"
                        >
                            ⚡ NOISE
                        </text>
                    </g>

                    {/* Main boxes */}
                    <BoxNode id="sender"   label="SENDER"   x={15}  y={80} w={120} h={50} />
                    <BoxNode id="encoding" label="ENCODING" x={170} y={80} w={120} h={50} />
                    <BoxNode id="channel"  label="CHANNEL"  x={330} y={80} w={120} h={50} />
                    <BoxNode id="decoding" label="DECODING" x={490} y={80} w={120} h={50} />
                    <BoxNode id="receiver" label="RECEIVER" x={650} y={80} w={120} h={50} />

                    {/* Labels */}
                    <text x="75" y="148" textAnchor="middle" fontSize="9" fill="#64748b">Source</text>
                    <text x="230" y="148" textAnchor="middle" fontSize="9" fill="#64748b">Transmitter</text>
                    <text x="390" y="148" textAnchor="middle" fontSize="9" fill="#64748b">Medium</text>
                    <text x="550" y="148" textAnchor="middle" fontSize="9" fill="#64748b">Interpreter</text>
                    <text x="710" y="148" textAnchor="middle" fontSize="9" fill="#64748b">Destination</text>
                </svg>
            </div>

            {/* Detail Panel */}
            {selected && (
                <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 animate-in fade-in slide-in-from-bottom-2">
                    <h4 className="text-lg font-bold mb-3" style={{ color: shannonData[selected].color }}>
                        {shannonData[selected].title}
                    </h4>
                    <p className="text-sm text-slate-300 mb-4">{shannonData[selected].desc}</p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-600">
                            <div className="text-xs font-bold text-sky-400 uppercase mb-2">✈ Aviation Example</div>
                            <p className="text-sm text-slate-200 italic">"{shannonData[selected].example}"</p>
                        </div>
                        <div className="bg-slate-800/70 p-4 rounded-lg border border-orange-500/30">
                            <div className="text-xs font-bold text-orange-400 uppercase mb-2">⚠ Barriers at This Stage</div>
                            <p className="text-sm text-slate-200">{shannonData[selected].barrier}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


// ─── 2. Enhanced G.A.S. Model (Interactive Curve with Slider) ───────────────
const GasModelInteractive = () => {
    const [duration, setDuration] = useState(30); // 0-100 slider for stress duration

    // Determine phase from duration
    let phase: 'alarm' | 'resistance' | 'exhaustion';
    if (duration <= 25) phase = 'alarm';
    else if (duration <= 65) phase = 'resistance';
    else phase = 'exhaustion';

    const physiological: Record<typeof phase, { hr: string; cortisol: string; focus: string; performance: number; color: string; desc: string; aviationExample: string }> = {
        alarm: {
            hr: '120-160 bpm ↑↑', cortisol: 'Spike (Adrenaline)', focus: 'Narrowed — Tunnel Vision',
            performance: 60, color: '#f43f5e',
            desc: 'Shock → Counter-shock. Immediate "Fight or Flight" response. Adrenaline floods the body. Temporary dip in resistance below normal, then rapid spike.',
            aviationExample: 'Acute: Engine fire on takeoff. Pilot freezes momentarily (shock), then training kicks in and they execute the memory items (counter-shock).',
        },
        resistance: {
            hr: '85-100 bpm (sustained)', cortisol: 'Elevated (Chronic Cortisol)', focus: 'Adequate but depleting',
            performance: 85, color: '#fbbf24',
            desc: 'Body adapts to the stressor. Resistance rises above normal. High arousal maintained via cortisol. Appears functional but cannot be sustained indefinitely.',
            aviationExample: 'Chronic: A pilot dealing with ongoing fatigue rosters + personal stress. Appears "coping" on the line but is slowly depleting resources over weeks.',
        },
        exhaustion: {
            hr: '70 bpm (flat response)', cortisol: 'Depleted (Adrenal Fatigue)', focus: 'Poor — Errors increase',
            performance: 25, color: '#94a3b8',
            desc: 'Adaptive energy is depleted. Performance collapses below normal. The body can no longer mount a stress response. Burnout, illness, and critical errors follow.',
            aviationExample: 'A pilot at the end of a poorly rostered month with cumulative fatigue commits a runway incursion due to impaired attention and slowed reactions.',
        },
    };

    const data = physiological[phase];

    // Compute cursor position on the SVG curve
    const getCurvePoint = (t: number) => {
        // Approximation of the GAS curve shape
        if (t <= 25) {
            // Alarm: dip then rise
            const x = 40 + (t / 25) * 100;
            const y = t < 12 ? 100 + (t / 12) * 30 : 130 - ((t - 12) / 13) * 80;
            return { x, y };
        } else if (t <= 65) {
            // Resistance: plateau at high
            const x = 140 + ((t - 25) / 40) * 160;
            return { x, y: 50 };
        } else {
            // Exhaustion: decline
            const x = 300 + ((t - 65) / 35) * 120;
            const y = 50 + ((t - 65) / 35) * 100;
            return { x, y };
        }
    };
    const cursor = getCurvePoint(duration);

    return (
        <div className="animate-in slide-in-from-right-4 space-y-6">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Activity className="text-sky-400" size={22} />
                General Adaptation Syndrome (Selye)
            </h3>

            {/* Interactive SVG Curve */}
            <div className="relative bg-slate-900 rounded-xl border border-slate-700 p-2 overflow-hidden" style={{ height: 260 }}>
                {/* Baseline label */}
                <div className="absolute top-1/2 left-3 text-[10px] text-slate-500 -translate-y-1/2 z-10">Normal<br />Resistance</div>

                <svg viewBox="0 0 450 200" className="w-full h-full">
                    {/* Baseline */}
                    <line x1="30" y1="100" x2="430" y2="100" stroke="#475569" strokeWidth="1" strokeDasharray="6 4" />

                    {/* Phase background bands */}
                    <rect x="40" y="10" width="100" height="180" fill="#f43f5e11" rx="4" />
                    <rect x="140" y="10" width="160" height="180" fill="#fbbf2411" rx="4" />
                    <rect x="300" y="10" width="120" height="180" fill="#94a3b811" rx="4" />

                    {/* Alarm curve: dip then rise */}
                    <path d="M 40 100 Q 60 130 80 130 Q 100 130 120 60 L 140 50" fill="none" stroke="#f43f5e" strokeWidth="3" />
                    {/* Resistance plateau */}
                    <path d="M 140 50 L 300 50" fill="none" stroke="#fbbf24" strokeWidth="3" />
                    {/* Exhaustion decline */}
                    <path d="M 300 50 Q 340 50 380 120 Q 400 150 420 160" fill="none" stroke="#94a3b8" strokeWidth="3" />

                    {/* Phase labels */}
                    <text x="90" y="22" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f43f5e">ALARM</text>
                    <text x="220" y="22" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fbbf24">RESISTANCE</text>
                    <text x="370" y="22" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#94a3b8">EXHAUSTION</text>

                    {/* Cursor dot */}
                    <circle cx={cursor.x} cy={cursor.y} r="8" fill={data.color} opacity="0.3">
                        <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={cursor.x} cy={cursor.y} r="5" fill={data.color} stroke="white" strokeWidth="2" />
                </svg>
            </div>

            {/* Duration Slider */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                <label className="flex justify-between text-slate-400 text-sm mb-2">
                    <span className="flex items-center gap-2"><Clock size={14} /> Stress Duration</span>
                    <span className="font-bold text-white">{duration < 25 ? 'Minutes' : duration < 65 ? 'Days → Weeks' : 'Weeks → Months'}</span>
                </label>
                <input
                    type="range" min="0" max="100" step="1"
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Acute (seconds)</span>
                    <span>Sustained (days)</span>
                    <span>Chronic (months)</span>
                </div>
            </div>

            {/* Physiological Response Panel */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* Vitals */}
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 space-y-4">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <HeartPulse size={16} style={{ color: data.color }} />
                        Physiological Response
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400 flex items-center gap-1.5"><HeartPulse size={12} /> Heart Rate</span>
                            <span className="text-sm font-bold" style={{ color: data.color }}>{data.hr}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400 flex items-center gap-1.5"><Flame size={12} /> Cortisol</span>
                            <span className="text-sm font-bold" style={{ color: data.color }}>{data.cortisol}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-400 flex items-center gap-1.5"><Brain size={12} /> Focus</span>
                            <span className="text-sm font-bold" style={{ color: data.color }}>{data.focus}</span>
                        </div>
                        <div>
                            <span className="text-xs text-slate-400">Performance Level</span>
                            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden mt-1">
                                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${data.performance}%`, backgroundColor: data.color }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description & Aviation Example */}
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 space-y-4">
                    <div>
                        <h4 className="font-bold text-sm mb-2" style={{ color: data.color }}>
                            {phase === 'alarm' ? '1. Alarm Reaction' : phase === 'resistance' ? '2. Resistance Stage' : '3. Exhaustion Stage'}
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{data.desc}</p>
                    </div>
                    <div className="bg-slate-800/70 p-3 rounded-lg border border-sky-500/20">
                        <div className="text-[10px] font-bold text-sky-400 uppercase mb-1">✈ Aviation Example ({phase === 'alarm' ? 'Acute' : phase === 'resistance' ? 'Sustained' : 'Chronic'})</div>
                        <p className="text-xs text-slate-200 italic">{data.aviationExample}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


// ─── 3. Assertiveness Styles (Quadrant + PACE) ──────────────────────────────
type AssertStyle = 'passive' | 'aggressive' | 'passive-aggressive' | 'assertive' | null;

const assertivenessData: Record<Exclude<AssertStyle, null>, { label: string; desc: string; cockpitExample: string; icon: typeof Shield; color: string; concern: string; directness: string }> = {
    passive: {
        label: 'Passive',
        desc: 'Avoids conflict, does not express concerns, defers to authority even when unsafe. Common in steep authority gradients.',
        cockpitExample: '"Oh… I guess the Captain knows best. I won\'t mention the low fuel reading."',
        icon: EyeOff, color: '#60a5fa', concern: 'Low', directness: 'Low',
    },
    aggressive: {
        label: 'Aggressive',
        desc: 'Dominates communication, dismisses others, intimidates. Creates a toxic CRM environment.',
        cockpitExample: '"Don\'t question my decisions! I\'ve been flying for 20 years!"',
        icon: Megaphone, color: '#ef4444', concern: 'High (Self)', directness: 'High',
    },
    'passive-aggressive': {
        label: 'Passive-Aggressive',
        desc: 'Appears to comply but undermines through indirect actions, sarcasm, or deliberate delays.',
        cockpitExample: '"Sure, Captain…" (then deliberately delays checklist completion and mutters complaints)',
        icon: AlertCircle, color: '#f59e0b', concern: 'Hidden', directness: 'Indirect',
    },
    assertive: {
        label: 'Assertive ✓ TARGET',
        desc: 'Expresses concerns clearly and respectfully. Balances advocacy with inquiry. The goal of CRM training.',
        cockpitExample: '"Captain, I\'m concerned about our fuel state. I calculate we have 25 minutes below minimum. I suggest we divert now."',
        icon: CheckCircle2, color: '#22c55e', concern: 'High (Safety)', directness: 'Direct & Respectful',
    },
};

const paceModel = [
    { letter: 'P', word: 'Probe', desc: 'Ask a question to draw attention.', example: '"Captain, have you noticed our fuel state?"', color: '#38bdf8' },
    { letter: 'A', word: 'Alert', desc: 'State your concern explicitly.', example: '"Captain, I\'m uncomfortable with our fuel remaining."', color: '#fbbf24' },
    { letter: 'C', word: 'Challenge', desc: 'Direct challenge if concern is not addressed.', example: '"Captain, I believe we need to divert NOW."', color: '#f97316' },
    { letter: 'E', word: 'Emergency', desc: 'Take control if safety is at immediate risk.', example: '"I am taking control. Mayday, Mayday, Mayday."', color: '#ef4444' },
];

const AssertivenessStyles = () => {
    const [selected, setSelected] = useState<AssertStyle>(null);

    const QuadrantButton = ({ id }: { id: Exclude<AssertStyle, null> }) => {
        const d = assertivenessData[id];
        const isActive = selected === id;
        const isTarget = id === 'assertive';
        return (
            <button
                onClick={() => setSelected(selected === id ? null : id)}
                className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${isActive
                    ? 'border-2 shadow-lg' : isTarget
                        ? 'bg-green-900/10 border-green-500/30 hover:border-green-500/60'
                        : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                }`}
                style={isActive ? { borderColor: d.color, backgroundColor: d.color + '15' } : {}}
            >
                {isTarget && <div className="absolute top-2 right-2 text-[9px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold">TARGET</div>}
                <d.icon size={20} style={{ color: d.color }} className="mb-2" />
                <div className="font-bold text-white text-sm mb-1">{d.label}</div>
                <div className="text-[10px] text-slate-400">
                    Concern: {d.concern} · Directness: {d.directness}
                </div>
            </button>
        );
    };

    return (
        <div className="animate-in fade-in space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="text-sky-400" size={22} />
                Assertiveness Styles & PACE Model
            </h3>

            {/* Quadrant Grid */}
            <div className="grid grid-cols-2 gap-4">
                <QuadrantButton id="passive" />
                <QuadrantButton id="aggressive" />
                <QuadrantButton id="passive-aggressive" />
                <QuadrantButton id="assertive" />
            </div>

            {/* Detail Panel */}
            {selected && (
                <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 animate-in fade-in slide-in-from-bottom-2">
                    <h4 className="text-lg font-bold mb-2" style={{ color: assertivenessData[selected].color }}>
                        {assertivenessData[selected].label}
                    </h4>
                    <p className="text-sm text-slate-300 mb-4">{assertivenessData[selected].desc}</p>
                    <div className="bg-slate-800/70 p-4 rounded-lg border border-sky-500/20">
                        <div className="text-xs font-bold text-sky-400 uppercase mb-1">✈ Cockpit Example</div>
                        <p className="text-sm text-slate-200 italic">{assertivenessData[selected].cockpitExample}</p>
                    </div>
                </div>
            )}

            {/* PACE Model */}
            <div className="bg-slate-900 rounded-xl border border-slate-700 p-5">
                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Target size={16} className="text-sky-400" />
                    PACE Assertiveness Escalation Model
                </h4>
                <p className="text-xs text-slate-400 mb-4">Graduated escalation when the Assertive style is needed in the cockpit:</p>
                <div className="grid md:grid-cols-4 gap-3">
                    {paceModel.map((p, i) => (
                        <div key={p.letter} className="bg-slate-800 p-4 rounded-lg border border-slate-600 relative">
                            <div className="text-3xl font-black mb-1" style={{ color: p.color }}>{p.letter}</div>
                            <div className="text-sm font-bold text-white mb-1">{p.word}</div>
                            <p className="text-[11px] text-slate-400 mb-2">{p.desc}</p>
                            <p className="text-[11px] text-slate-200 italic border-t border-slate-700 pt-2">"{p.example}"</p>
                            {i < 3 && (
                                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                                    <ArrowRight size={14} className="text-slate-500" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <p className="text-[10px] text-pink-400 mt-3 italic">
                    Note: Reaching 'E' (Emergency Authority) should be exceptionally rare. Most situations should be resolved at P or A level with effective CRM.
                </p>
            </div>
        </div>
    );
};


// ─── 4. Stress Management Toolkit (Expandable Cards) ────────────────────────
interface ToolkitCategory {
    id: string;
    title: string;
    icon: typeof Wind;
    color: string;
    strategies: { name: string; desc: string; aviationTip: string }[];
}

const toolkitCategories: ToolkitCategory[] = [
    {
        id: 'physical', title: 'Physical Strategies', icon: Dumbbell, color: '#22c55e',
        strategies: [
            { name: 'Controlled Breathing (4-7-8)', desc: 'Inhale for 4 seconds, hold for 7, exhale for 8. Activates the parasympathetic nervous system.', aviationTip: 'Use before critical phases: briefing, approach, abnormal procedures.' },
            { name: 'Progressive Muscle Relaxation', desc: 'Tense then release muscle groups systematically to reduce physical tension.', aviationTip: 'Useful during long-haul cruise to prevent physical fatigue accumulation.' },
            { name: 'Regular Exercise', desc: 'Cardiovascular exercise 3-5x/week reduces baseline cortisol and improves sleep quality.', aviationTip: 'Critical for jet-lag management and circadian rhythm regulation on changing rosters.' },
            { name: 'Sleep Hygiene', desc: 'Consistent sleep schedule, dark room, no screens 1 hr before bed, 7-9 hours per night.', aviationTip: 'Use controlled rest procedures and strategic napping per FRMS guidelines.' },
        ],
    },
    {
        id: 'cognitive', title: 'Cognitive Strategies', icon: Brain, color: '#a78bfa',
        strategies: [
            { name: 'Cognitive Reframing', desc: 'Replace catastrophic thinking with realistic, solution-focused assessment.', aviationTip: '"This is an abnormal, not a catastrophe. I have trained for this. What does the checklist say?"' },
            { name: 'Task Prioritization (Aviate, Navigate, Communicate)', desc: 'Under overload, shed low-priority tasks. Focus on the essential.', aviationTip: 'The golden rule: FLY THE AIRCRAFT FIRST. Everything else is secondary.' },
            { name: 'Mental Rehearsal', desc: 'Visualize emergency procedures during calm moments to build automatic responses.', aviationTip: 'Chair-fly ECAM procedures, rejected takeoffs, go-arounds before each duty.' },
            { name: 'Mindfulness & Situational Awareness', desc: 'Stay present. Monitor for fixation and actively scan the full picture.', aviationTip: 'Prevents cognitive tunneling during high-workload phases.' },
        ],
    },
    {
        id: 'organizational', title: 'Organizational Strategies', icon: Users, color: '#38bdf8',
        strategies: [
            { name: 'Crew Resource Management (CRM)', desc: 'Structured teamwork, communication, and decision-making processes shared across the crew.', aviationTip: 'Use standard callouts, briefings, and de-briefings to distribute workload and catch errors.' },
            { name: 'Fatigue Risk Management System (FRMS)', desc: 'Organizational system to identify, assess, and mitigate fatigue-related risks.', aviationTip: 'Report fatigue proactively. Use fatigue prediction tools. Know your duty time limits.' },
            { name: 'Workload Management', desc: 'Distribute tasks between crew members based on current demand. Use sterile cockpit rules.', aviationTip: 'Below 10,000 ft or during abnormals: sterile cockpit. No non-essential conversation.' },
            { name: 'Social Support & Peer Programs', desc: 'Access to peer support, Employee Assistance Programs, and Critical Incident Stress Debriefing.', aviationTip: 'After a critical incident (rejected takeoff, TCAS RA), debrief with peers. Don\'t bottle it up.' },
        ],
    },
];

const StressManagementToolkit = () => {
    const [expanded, setExpanded] = useState<string | null>('physical');

    return (
        <div className="animate-in fade-in space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Brain className="text-sky-400" size={22} />
                Stress Management Toolkit
            </h3>
            <p className="text-sm text-slate-400">Click each category to expand and explore strategies with aviation-specific applications.</p>

            <div className="space-y-4">
                {toolkitCategories.map(cat => {
                    const isOpen = expanded === cat.id;
                    return (
                        <div key={cat.id} className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden transition-all">
                            <button
                                onClick={() => setExpanded(isOpen ? null : cat.id)}
                                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-800/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg" style={{ backgroundColor: cat.color + '20' }}>
                                        <cat.icon size={20} style={{ color: cat.color }} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-sm">{cat.title}</div>
                                        <div className="text-[11px] text-slate-400">{cat.strategies.length} strategies</div>
                                    </div>
                                </div>
                                {isOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                            </button>

                            {isOpen && (
                                <div className="px-5 pb-5 space-y-3 animate-in fade-in slide-in-from-top-2">
                                    {cat.strategies.map((s, i) => (
                                        <div key={i} className="bg-slate-800/70 p-4 rounded-lg border border-slate-600">
                                            <div className="font-bold text-white text-sm mb-1">{s.name}</div>
                                            <p className="text-xs text-slate-300 mb-2">{s.desc}</p>
                                            <div className="flex items-start gap-2 bg-slate-900/50 p-2 rounded border border-sky-500/20">
                                                <span className="text-sky-400 text-[10px] font-bold mt-0.5 shrink-0">✈ TIP:</span>
                                                <p className="text-[11px] text-sky-200">{s.aviationTip}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


// ─── ORIGINAL TABS (Preserved) ──────────────────────────────────────────────

// 040.03.06.02 Stress Accumulation & Transfer
const StressAccumulator = () => {
    const [level, setLevel] = useState(20);
    const [stressors, setStressors] = useState<string[]>([]);

    const addStressor = (name: string, amount: number) => {
        if (stressors.includes(name)) return;
        setStressors([...stressors, name]);
        setLevel(prev => Math.min(100, prev + amount));
    };

    const removeStressor = (name: string, amount: number) => {
        setStressors(stressors.filter(s => s !== name));
        setLevel(prev => Math.max(0, prev - amount));
    };

    const StressButton = ({ label, impact, type }: { label: string, impact: number, type: string }) => {
        const isActive = stressors.includes(label);
        return (
            <button
                onClick={() => isActive ? removeStressor(label, impact) : addStressor(label, impact)}
                className={`p-2 rounded text-xs font-bold border transition-all ${isActive ? 'bg-pink-600 border-pink-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-pink-400'}`}
            >
                {label} (+{impact})
            </button>
        );
    };

    return (
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
            {/* The Bucket */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col items-center">
                <h3 className="font-bold text-white mb-6">The Stress Reservoir</h3>

                <div className="relative w-32 h-64 border-4 border-slate-500 border-t-0 rounded-b-xl bg-slate-800 overflow-hidden mb-4">
                    {/* Liquid */}
                    <div
                        className={`absolute bottom-0 w-full transition-all duration-1000 ${level > 80 ? 'bg-red-500 animate-pulse' : level > 50 ? 'bg-orange-500' : 'bg-blue-500'}`}
                        style={{ height: `${level}%` }}
                    ></div>

                    {/* Thresholds */}
                    <div className="absolute top-[20%] w-full border-t border-dashed border-red-500 opacity-50"></div>
                    <div className="absolute top-[20%] right-1 text-[10px] text-red-400 font-bold">OVERLOAD</div>

                    <div className="absolute bottom-[20%] w-full border-t border-dashed border-blue-300 opacity-50"></div>
                    <div className="absolute bottom-[20%] right-1 text-[10px] text-blue-300 font-bold">UNDERLOAD</div>
                </div>

                <div className="text-center">
                    <p className="text-xs text-slate-400 uppercase font-bold">Current Load</p>
                    <p className={`text-3xl font-black ${level > 80 ? 'text-red-500' : 'text-white'}`}>{level}%</p>
                    {level > 80 && <p className="text-red-400 text-xs font-bold mt-1">PERFORMANCE COLLAPSE</p>}
                    {level < 20 && <p className="text-blue-400 text-xs font-bold mt-1">COMPLACENCY RISK</p>}
                </div>
            </div>

            {/* Stressor Controls */}
            <div className="space-y-6">
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h4 className="text-sm font-bold text-white mb-3">1. Environmental Stressors (Physical)</h4>
                    <div className="flex flex-wrap gap-2">
                        <StressButton label="Noise" impact={10} type="env" />
                        <StressButton label="Vibration" impact={10} type="env" />
                        <StressButton label="Hypoxia" impact={30} type="env" />
                        <StressButton label="Temp Extreme" impact={15} type="env" />
                    </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h4 className="text-sm font-bold text-white mb-3">2. Domestic / Life Stressors (Psychological)</h4>
                    <div className="flex flex-wrap gap-2">
                        <StressButton label="Divorce" impact={40} type="life" />
                        <StressButton label="Financial" impact={20} type="life" />
                        <StressButton label="Lack of Sleep" impact={25} type="life" />
                    </div>
                    <p className="text-[10px] text-pink-400 mt-2 italic">
                        "Stress Transfer": Domestic stress reduces the capacity available for flight tasks.
                    </p>
                </div>

                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h4 className="text-sm font-bold text-white mb-3">3. Acute Cockpit Stressors</h4>
                    <div className="flex flex-wrap gap-2">
                        <StressButton label="Engine Failure" impact={50} type="acute" />
                        <StressButton label="Time Pressure" impact={20} type="acute" />
                        <StressButton label="ATC Confusion" impact={15} type="acute" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 040.03.04.04 Communication Theory (Watzlawick & Non-verbal)
const CommTheory = () => {
    return (
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
            {/* Watzlawick */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4">Watzlawick's Axiom</h3>
                <div className="bg-black p-6 rounded-lg text-center border-l-4 border-pink-500 mb-4">
                    <p className="text-xl font-black text-white">"One Cannot Not Communicate"</p>
                </div>
                <p className="text-sm text-slate-300 mb-4">
                    Even silence, posture, or absence is a message.
                    <br />Example: A captain crossing arms and looking away transmits "I am closed to input" or "I am angry", even without speaking.
                </p>
                <div className="flex justify-center gap-4">
                    <div className="text-center">
                        <EyeOff className="mx-auto mb-1 text-slate-500" />
                        <span className="text-[10px] text-slate-400">Ignoring = Rejecting</span>
                    </div>
                    <div className="text-center">
                        <Mic className="mx-auto mb-1 text-slate-500" />
                        <span className="text-[10px] text-slate-400">Silence = Agreement?</span>
                    </div>
                </div>
            </div>

            {/* Non-Verbal Rule */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4">Verbal vs Non-Verbal (Mehrabian)</h3>

                <div className="relative h-48 w-full flex items-end gap-2 px-4">
                    <div className="w-1/3 bg-blue-500 rounded-t relative group h-[7%]" >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-white font-bold">7%</span>
                        <div className="absolute bottom-2 left-0 w-full text-center text-[10px] text-white font-bold">WORDS</div>
                    </div>
                    <div className="w-1/3 bg-purple-500 rounded-t relative group h-[38%]">
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-white font-bold">38%</span>
                        <div className="absolute bottom-2 left-0 w-full text-center text-[10px] text-white font-bold">TONE</div>
                    </div>
                    <div className="w-1/3 bg-pink-500 rounded-t relative group h-[55%]">
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-white font-bold">55%</span>
                        <div className="absolute bottom-2 left-0 w-full text-center text-[10px] text-white font-bold">BODY LANG</div>
                    </div>
                </div>

                <p className="text-xs text-slate-400 mt-4 text-center italic">
                    Note: This applies specifically when messages are incongruent (e.g., saying "I'm fine" while looking terrified).
                </p>
            </div>

            {/* Meta-Communication */}
            <div className="col-span-full bg-slate-900 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
                <div className="bg-slate-800 p-3 rounded text-pink-400">
                    <MessageSquare size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-white">The Meta-Plane</h4>
                    <p className="text-sm text-slate-300">
                        Communication <strong>about</strong> communication. Stepping back to discuss <em>how</em> we are talking, not just <em>what</em> we are talking about. Crucial for resolving conflict in the cockpit.
                    </p>
                </div>
            </div>
        </div>
    );
};

// 040.03.04 Communication
const FourEarsModel = () => {
    // Schulz von Thun Model
    const [aspect, setAspect] = useState<'fact' | 'self' | 'relation' | 'appeal'>('fact');

    const message = "The light is green.";

    const interpretations = {
        fact: { label: 'Factual Level', meaning: "The traffic light shows the color green.", color: 'text-blue-400' },
        self: { label: 'Self-Disclosure', meaning: "I am in a hurry.", color: 'text-green-400' },
        relation: { label: 'Relationship', meaning: "You need my help to drive.", color: 'text-yellow-400' },
        appeal: { label: 'Appeal', meaning: "Go! Drive!", color: 'text-red-400' }
    };

    return (
        <div className="animate-in fade-in">
            <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-white mb-2">The 4-Ears Model (Schulz von Thun)</h3>
                <div className="bg-white text-slate-900 font-bold p-4 rounded-lg inline-block text-xl shadow-lg">
                    "{message}"
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <button onClick={() => setAspect('fact')} className={`p-4 rounded-xl border transition-all ${aspect === 'fact' ? 'bg-blue-900/20 border-blue-500' : 'bg-slate-900 border-slate-700'}`}>
                    <div className="font-bold text-blue-400 mb-1">Factual</div>
                    <div className="text-[10px] text-slate-400">Data / Facts</div>
                </button>
                <button onClick={() => setAspect('self')} className={`p-4 rounded-xl border transition-all ${aspect === 'self' ? 'bg-green-900/20 border-green-500' : 'bg-slate-900 border-slate-700'}`}>
                    <div className="font-bold text-green-400 mb-1">Self</div>
                    <div className="text-[10px] text-slate-400">Sender's State</div>
                </button>
                <button onClick={() => setAspect('relation')} className={`p-4 rounded-xl border transition-all ${aspect === 'relation' ? 'bg-yellow-900/20 border-yellow-500' : 'bg-slate-900 border-slate-700'}`}>
                    <div className="font-bold text-yellow-400 mb-1">Relationship</div>
                    <div className="text-[10px] text-slate-400">You & Me</div>
                </button>
                <button onClick={() => setAspect('appeal')} className={`p-4 rounded-xl border transition-all ${aspect === 'appeal' ? 'bg-red-900/20 border-red-500' : 'bg-slate-900 border-slate-700'}`}>
                    <div className="font-bold text-red-400 mb-1">Appeal</div>
                    <div className="text-[10px] text-slate-400">Call to Action</div>
                </button>
            </div>

            <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 text-center">
                <div className="flex justify-center mb-4">
                    <Ear size={48} className={interpretations[aspect].color} />
                </div>
                <h4 className={`text-lg font-bold mb-2 ${interpretations[aspect].color}`}>{interpretations[aspect].label}</h4>
                <p className="text-2xl font-medium text-white">"{interpretations[aspect].meaning}"</p>
                <p className="text-xs text-slate-500 mt-4">
                    Miscommunication often happens when the receiver listens with the wrong "ear" (e.g., hearing a relationship attack instead of a fact).
                </p>
            </div>
        </div>
    );
};

export default CommunicationAndStress;
