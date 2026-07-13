
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Brain, Eye, Layers, Target, AlertCircle, RefreshCcw, Zap, Gauge, Timer, Activity, ChevronRight, ArrowRight, Cpu, Settings, BookOpen } from 'lucide-react';

/* ──────────────────────────────────────────────────────────
   CSS-in-JS keyframes injected once
   ────────────────────────────────────────────────────────── */
const STYLE_ID = 'info-processing-animations';
const injectStyles = () => {
    if (typeof document === 'undefined') return;
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
        @keyframes flowDot {
            0% { left: 0%; opacity: 0; }
            5% { opacity: 1; }
            95% { opacity: 1; }
            100% { left: 100%; opacity: 0; }
        }
        @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 8px rgba(99,102,241,0.3); }
            50% { box-shadow: 0 0 20px rgba(99,102,241,0.6); }
        }
        @keyframes bottleneckPulse {
            0%, 100% { background-color: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.4); }
            50% { background-color: rgba(239,68,68,0.35); border-color: rgba(239,68,68,0.8); }
        }
        @keyframes overloadFlash {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
        }
        @keyframes slideDown {
            from { max-height: 0; opacity: 0; }
            to { max-height: 500px; opacity: 1; }
        }
        @keyframes gameFlash {
            0% { transform: scale(1); }
            50% { transform: scale(1.03); }
            100% { transform: scale(1); }
        }
        .flow-dot {
            position: absolute;
            width: 8px;
            height: 8px;
            background: #818cf8;
            border-radius: 50%;
            top: 50%;
            transform: translateY(-50%);
            animation: flowDot 3s linear infinite;
            box-shadow: 0 0 6px #818cf8;
        }
        .flow-dot:nth-child(2) { animation-delay: 0.8s; }
        .flow-dot:nth-child(3) { animation-delay: 1.6s; }
        .pipeline-stage { animation: pulseGlow 3s ease-in-out infinite; }
        .pipeline-stage:hover { transform: translateY(-2px); }
        .bottleneck-zone { animation: bottleneckPulse 2s ease-in-out infinite; }
        .overload-flash { animation: overloadFlash 0.6s ease-in-out infinite; }
        .detail-expand { animation: slideDown 0.3s ease-out forwards; overflow: hidden; }
        .game-flash { animation: gameFlash 0.3s ease-out; }
    `;
    document.head.appendChild(style);
};

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════ */
const InformationProcessing: React.FC = () => {
    const [tab, setTab] = useState<'pipeline' | 'attention' | 'gauge' | 'reaction' | 'srk' | 'sa' | 'capture'>('pipeline');

    useEffect(() => { injectStyles(); }, []);

    const tabs = [
        { key: 'pipeline' as const, label: 'Processing Pipeline', icon: <Activity size={14} /> },
        { key: 'gauge' as const, label: 'Attention Gauge', icon: <Gauge size={14} /> },
        { key: 'reaction' as const, label: 'Reaction Game', icon: <Timer size={14} /> },
        { key: 'srk' as const, label: 'SRK Framework', icon: <Layers size={14} /> },
        { key: 'attention' as const, label: 'Attention Types', icon: <Target size={14} /> },
        { key: 'sa' as const, label: 'Situation Awareness', icon: <Eye size={14} /> },
        { key: 'capture' as const, label: 'Env. Capture', icon: <RefreshCcw size={14} /> },
    ];

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Brain className="text-indigo-400" />
                        Info Processing (040.03)
                    </h2>
                    <p className="text-slate-400 text-sm">Attention, Vigilance, Situation Awareness &amp; Information Processing.</p>
                </div>
            </div>

            {/* Tab bar - scrollable */}
            <div className="flex bg-slate-900 p-1 rounded-lg mb-6 overflow-x-auto gap-1">
                {tabs.map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-md font-bold text-xs whitespace-nowrap transition-all ${
                            tab === t.key
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {tab === 'pipeline' && <ProcessingPipeline />}
            {tab === 'gauge' && <AttentionResourceGauge />}
            {tab === 'reaction' && <ReactionTimeGame />}
            {tab === 'srk' && <RasmussenSRK />}
            {tab === 'attention' && <AttentionTypes />}
            {tab === 'sa' && <SAModel />}
            {tab === 'capture' && <EnvironmentCapture />}
        </div>
    );
};

/* ══════════════════════════════════════════════════════════
   1. INFORMATION PROCESSING PIPELINE
   ══════════════════════════════════════════════════════════ */
interface PipelineStage {
    id: string;
    label: string;
    icon: React.ReactNode;
    color: string;
    borderColor: string;
    bgColor: string;
    detail: string;
    aviationExample: string;
    isBottleneck?: boolean;
}

const PIPELINE_STAGES: PipelineStage[] = [
    {
        id: 'stimulus',
        label: 'Stimulus',
        icon: <Zap size={20} />,
        color: 'text-amber-400',
        borderColor: 'border-amber-500/50',
        bgColor: 'bg-amber-500/10',
        detail: 'External input from the environment — visual, auditory, tactile signals. Raw sensory data has not yet been processed or interpreted.',
        aviationExample: 'A flashing red light appears on the warning panel, or ATC transmits an instruction on frequency.',
    },
    {
        id: 'sensory',
        label: 'Sensory Store',
        icon: <Eye size={20} />,
        color: 'text-sky-400',
        borderColor: 'border-sky-500/50',
        bgColor: 'bg-sky-500/10',
        detail: 'Very brief memory buffer (~0.5s visual, ~2s auditory). Holds raw data before attention selects what to process. Most information is lost here.',
        aviationExample: 'Iconic memory briefly holds the instrument scan image. Echoic memory retains the last ATC instruction for a couple of seconds.',
    },
    {
        id: 'attention',
        label: 'Attention Filter',
        icon: <Target size={20} />,
        color: 'text-red-400',
        borderColor: 'border-red-500/50',
        bgColor: 'bg-red-500/10',
        detail: 'BOTTLENECK — Limited capacity channel. Only selected information passes through. Broadbent\'s Filter Theory: selection based on physical characteristics. Treisman\'s Attenuation: unselected channels are attenuated, not blocked.',
        aviationExample: 'Pilot focuses on localiser during approach, attenuating other radio chatter — but "MAYDAY" on any frequency will break through (cocktail party effect).',
        isBottleneck: true,
    },
    {
        id: 'perception',
        label: 'Perception & Decision',
        icon: <Brain size={20} />,
        color: 'text-indigo-400',
        borderColor: 'border-indigo-500/50',
        bgColor: 'bg-indigo-500/10',
        detail: 'Pattern recognition and meaning extraction using long-term memory schemas. Decision-making occurs here — comparing options, applying rules, or reasoning from first principles (see SRK Framework).',
        aviationExample: 'Recognising the glideslope deviation pattern and deciding to initiate a go-around vs. correcting.',
    },
    {
        id: 'response',
        label: 'Response Execution',
        icon: <ArrowRight size={20} />,
        color: 'text-emerald-400',
        borderColor: 'border-emerald-500/50',
        bgColor: 'bg-emerald-500/10',
        detail: 'Motor programming and execution of the selected response. Highly practiced actions become automatic (skill-based), freeing attention resources for higher-level tasks.',
        aviationExample: 'Pushing the throttle forward, calling "Going around, flaps 20", and pitching to go-around attitude.',
    },
];

const ProcessingPipeline = () => {
    const [expandedStage, setExpandedStage] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            {/* Pipeline visualisation */}
            <div className="relative">
                {/* Flow dots container */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 hidden md:block" style={{ zIndex: 0 }}>
                    <div className="relative w-full h-full bg-slate-700/50 rounded-full">
                        <div className="flow-dot" />
                        <div className="flow-dot" />
                        <div className="flow-dot" />
                    </div>
                </div>

                {/* Stages */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 relative" style={{ zIndex: 1 }}>
                    {PIPELINE_STAGES.map((stage, idx) => (
                        <button
                            key={stage.id}
                            onClick={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}
                            className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
                                ${stage.isBottleneck ? 'bottleneck-zone' : 'pipeline-stage'}
                                ${expandedStage === stage.id
                                    ? `${stage.bgColor} ${stage.borderColor} ring-2 ring-offset-2 ring-offset-slate-800 ring-indigo-500/40`
                                    : `bg-slate-900 ${stage.borderColor} hover:${stage.bgColor}`
                                }
                            `}
                        >
                            {stage.isBottleneck && (
                                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    Bottleneck
                                </span>
                            )}
                            <div className={`${stage.color} mb-2`}>{stage.icon}</div>
                            <span className={`text-xs font-bold ${stage.color} text-center leading-tight`}>{stage.label}</span>
                            <span className="text-[10px] text-slate-500 mt-1">Click to expand</span>

                            {/* Arrow between stages (desktop) */}
                            {idx < PIPELINE_STAGES.length - 1 && (
                                <ChevronRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Expanded detail panel */}
            {expandedStage && (() => {
                const stage = PIPELINE_STAGES.find(s => s.id === expandedStage)!;
                return (
                    <div key={stage.id} className={`detail-expand rounded-xl border-2 ${stage.borderColor} ${stage.bgColor} p-5`}>
                        <div className="flex items-start gap-3">
                            <div className={`${stage.color} mt-1 shrink-0`}>{stage.icon}</div>
                            <div>
                                <h4 className={`font-bold text-lg ${stage.color}`}>{stage.label}</h4>
                                <p className="text-slate-300 text-sm mt-1">{stage.detail}</p>
                                <div className="mt-3 bg-slate-800/60 rounded-lg p-3 border border-slate-600/50">
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">✈ Aviation Example</p>
                                    <p className="text-sm text-slate-200">{stage.aviationExample}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Summary note */}
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 flex items-start gap-3">
                <AlertCircle className="text-indigo-400 shrink-0 mt-0.5" size={18} />
                <p className="text-xs text-slate-300">
                    <strong className="text-indigo-300">Single-Channel Theory (Welford):</strong> Humans can only process one decision at a time through the central channel.
                    Incoming stimuli must queue — which is why reaction time increases with concurrent tasks.
                    This bottleneck at the attention filter is the core limitation of human information processing.
                </p>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════
   2. ATTENTION RESOURCES GAUGE
   ══════════════════════════════════════════════════════════ */
interface TaskItem {
    id: string;
    label: string;
    cost: number;
    icon: React.ReactNode;
    color: string;
}

const AVAILABLE_TASKS: TaskItem[] = [
    { id: 'flying', label: 'Flying (Manual)', cost: 30, icon: <Activity size={14} />, color: 'text-sky-400' },
    { id: 'navigating', label: 'Navigating', cost: 20, icon: <Target size={14} />, color: 'text-indigo-400' },
    { id: 'radio', label: 'Monitoring Radio', cost: 15, icon: <Zap size={14} />, color: 'text-amber-400' },
    { id: 'weather', label: 'Weather Check', cost: 20, icon: <Eye size={14} />, color: 'text-emerald-400' },
    { id: 'emergency', label: 'Emergency', cost: 45, icon: <AlertCircle size={14} />, color: 'text-red-400' },
];

const AttentionResourceGauge = () => {
    const [activeTasks, setActiveTasks] = useState<string[]>([]);

    const totalLoad = activeTasks.reduce((sum, taskId) => {
        const t = AVAILABLE_TASKS.find(t => t.id === taskId);
        return sum + (t?.cost ?? 0);
    }, 0);

    const isOverloaded = totalLoad > 100;
    const gaugePercent = Math.min(totalLoad, 120);

    const toggleTask = (taskId: string) => {
        setActiveTasks(prev =>
            prev.includes(taskId)
                ? prev.filter(id => id !== taskId)
                : [...prev, taskId]
        );
    };

    const getGaugeColor = () => {
        if (totalLoad > 100) return 'bg-red-500';
        if (totalLoad > 75) return 'bg-amber-500';
        if (totalLoad > 50) return 'bg-yellow-400';
        return 'bg-emerald-500';
    };

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Gauge */}
                <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 flex flex-col items-center justify-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Mental Resource Load</p>

                    {/* Vertical gauge */}
                    <div className="relative w-20 h-48 bg-slate-800 rounded-full border-2 border-slate-600 overflow-hidden">
                        <div
                            className={`absolute bottom-0 left-0 right-0 transition-all duration-500 rounded-full ${getGaugeColor()} ${isOverloaded ? 'overload-flash' : ''}`}
                            style={{ height: `${Math.min(gaugePercent, 100)}%` }}
                        />
                        {/* Tick marks */}
                        {[25, 50, 75, 100].map(tick => (
                            <div key={tick} className="absolute left-0 right-0 flex items-center" style={{ bottom: `${tick}%` }}>
                                <div className={`w-full h-px ${tick === 100 ? 'bg-red-500' : 'bg-slate-600'}`} />
                            </div>
                        ))}
                    </div>

                    <div className={`text-3xl font-black mt-4 tabular-nums ${isOverloaded ? 'text-red-400 overload-flash' : 'text-white'}`}>
                        {totalLoad}%
                    </div>

                    {isOverloaded && (
                        <div className="mt-3 bg-red-900/30 border border-red-500 text-red-300 text-xs font-bold px-4 py-2 rounded-lg text-center overload-flash">
                            ⚠ COGNITIVE OVERLOAD — Error probability spikes! Task shedding required.
                        </div>
                    )}
                    {!isOverloaded && totalLoad > 75 && (
                        <div className="mt-3 bg-amber-900/30 border border-amber-500/50 text-amber-300 text-xs px-4 py-2 rounded-lg text-center">
                            ⚡ High workload — limited spare capacity for unexpected events.
                        </div>
                    )}
                    {totalLoad === 0 && (
                        <p className="mt-3 text-slate-500 text-xs text-center">Add tasks below to see resource consumption.</p>
                    )}
                </div>

                {/* Task buttons */}
                <div className="space-y-3">
                    <p className="text-sm text-slate-300 font-semibold">Toggle flight tasks:</p>
                    {AVAILABLE_TASKS.map(task => {
                        const isActive = activeTasks.includes(task.id);
                        return (
                            <button
                                key={task.id}
                                onClick={() => toggleTask(task.id)}
                                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all text-left ${
                                    isActive
                                        ? `bg-slate-800 border-indigo-500 ${task.color}`
                                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    {task.icon}
                                    <span className="font-bold text-sm">{task.label}</span>
                                </div>
                                <span className={`text-xs font-mono px-2 py-1 rounded ${isActive ? 'bg-indigo-600/30 text-indigo-300' : 'bg-slate-800 text-slate-500'}`}>
                                    {task.cost}%
                                </span>
                            </button>
                        );
                    })}
                    <button
                        onClick={() => setActiveTasks([])}
                        className="w-full text-center text-xs text-slate-500 hover:text-white py-2 transition-colors"
                    >
                        Reset all tasks
                    </button>
                </div>
            </div>

            {/* Theory note */}
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 flex items-start gap-3">
                <Gauge className="text-indigo-400 shrink-0 mt-0.5" size={18} />
                <p className="text-xs text-slate-300">
                    <strong className="text-indigo-300">Kahneman&apos;s Capacity Model:</strong> Attention is a single, limited pool of mental resources.
                    Total capacity depends on arousal level (Yerkes-Dodson). Tasks that are well-practised (automated/skill-based)
                    consume fewer resources, freeing capacity for novel demands. When total demand exceeds capacity, performance degrades on all tasks.
                </p>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════
   3. REACTION TIME MINI-GAME
   ══════════════════════════════════════════════════════════ */
type GamePhase = 'idle' | 'waiting' | 'ready' | 'result' | 'tooEarly' | 'done';

const ReactionTimeGame = () => {
    const [phase, setPhase] = useState<GamePhase>('idle');
    const [mode, setMode] = useState<'simple' | 'choice'>('simple');
    const [targetColor, setTargetColor] = useState<string>('bg-emerald-500');
    const [choiceTarget, setChoiceTarget] = useState<'left' | 'right'>('left');
    const [startTime, setStartTime] = useState(0);
    const [results, setResults] = useState<number[]>([]);
    const [currentRT, setCurrentRT] = useState(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const roundRef = useRef(0);

    const TOTAL_ROUNDS = 3;

    const cleanup = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
    }, []);

    useEffect(() => () => cleanup(), [cleanup]);

    const startRound = () => {
        cleanup();
        setPhase('waiting');
        const delay = 2000 + Math.random() * 3000;
        timerRef.current = setTimeout(() => {
            if (mode === 'choice') {
                setChoiceTarget(Math.random() > 0.5 ? 'left' : 'right');
            }
            setTargetColor('bg-emerald-500');
            setStartTime(Date.now());
            setPhase('ready');
        }, delay);
    };

    const startGame = (m: 'simple' | 'choice') => {
        setMode(m);
        setResults([]);
        roundRef.current = 0;
        startRound();
    };

    const handleClick = (side?: 'left' | 'right') => {
        if (phase === 'waiting') {
            cleanup();
            setPhase('tooEarly');
            return;
        }
        if (phase === 'ready') {
            const rt = Date.now() - startTime;
            // In choice mode, check if correct side was clicked
            if (mode === 'choice' && side !== choiceTarget) {
                // Wrong choice — penalise with extra time
                setCurrentRT(rt + 150);
            } else {
                setCurrentRT(rt);
            }
            const finalRT = mode === 'choice' && side !== choiceTarget ? rt + 150 : rt;
            const newResults = [...results, finalRT];
            setResults(newResults);
            roundRef.current += 1;
            setPhase(roundRef.current >= TOTAL_ROUNDS ? 'done' : 'result');
        }
    };

    const avg = results.length > 0 ? Math.round(results.reduce((a, b) => a + b, 0) / results.length) : 0;

    const getBoxStyle = () => {
        switch (phase) {
            case 'waiting': return 'bg-red-900/50 border-red-500/50 cursor-pointer';
            case 'ready': return `${targetColor} border-emerald-400 cursor-pointer game-flash`;
            case 'tooEarly': return 'bg-amber-900/50 border-amber-500';
            default: return 'bg-slate-900 border-slate-700';
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Game area */}
                <div className="space-y-4">
                    {phase === 'idle' && (
                        <div className="bg-slate-900 rounded-xl p-8 border border-slate-700 text-center space-y-4">
                            <Timer className="w-12 h-12 text-indigo-400 mx-auto" />
                            <h3 className="text-lg font-bold text-white">Reaction Time Test</h3>
                            <p className="text-sm text-slate-400">Test your response speed. {TOTAL_ROUNDS} rounds per mode.</p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => startGame('simple')}
                                    className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors text-sm"
                                >
                                    Simple RT
                                </button>
                                <button
                                    onClick={() => startGame('choice')}
                                    className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-colors text-sm"
                                >
                                    Choice RT
                                </button>
                            </div>
                            <p className="text-xs text-slate-500">Simple = click when green · Choice = click correct side</p>
                        </div>
                    )}

                    {(phase === 'waiting' || phase === 'ready') && mode === 'simple' && (
                        <div
                            onClick={() => handleClick()}
                            className={`rounded-xl p-16 border-2 text-center transition-all duration-150 select-none ${getBoxStyle()}`}
                        >
                            {phase === 'waiting' && (
                                <p className="text-red-300 font-bold text-lg">Wait for GREEN...</p>
                            )}
                            {phase === 'ready' && (
                                <p className="text-white font-black text-2xl">CLICK NOW!</p>
                            )}
                        </div>
                    )}

                    {(phase === 'waiting' || phase === 'ready') && mode === 'choice' && (
                        <div className="grid grid-cols-2 gap-3">
                            <div
                                onClick={() => handleClick('left')}
                                className={`rounded-xl p-12 border-2 text-center transition-all cursor-pointer select-none ${
                                    phase === 'ready' && choiceTarget === 'left'
                                        ? 'bg-emerald-500 border-emerald-400 game-flash'
                                        : phase === 'ready' && choiceTarget === 'right'
                                        ? 'bg-slate-900 border-slate-600'
                                        : 'bg-red-900/50 border-red-500/50'
                                }`}
                            >
                                <p className="font-bold text-white text-sm">LEFT</p>
                            </div>
                            <div
                                onClick={() => handleClick('right')}
                                className={`rounded-xl p-12 border-2 text-center transition-all cursor-pointer select-none ${
                                    phase === 'ready' && choiceTarget === 'right'
                                        ? 'bg-emerald-500 border-emerald-400 game-flash'
                                        : phase === 'ready' && choiceTarget === 'left'
                                        ? 'bg-slate-900 border-slate-600'
                                        : 'bg-red-900/50 border-red-500/50'
                                }`}
                            >
                                <p className="font-bold text-white text-sm">RIGHT</p>
                            </div>
                        </div>
                    )}

                    {phase === 'tooEarly' && (
                        <div className="bg-amber-900/30 rounded-xl p-8 border border-amber-500 text-center space-y-3">
                            <p className="text-amber-300 font-bold text-lg">Too early!</p>
                            <p className="text-sm text-slate-400">Wait for the colour change before clicking.</p>
                            <button onClick={startRound} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm">
                                Try Again
                            </button>
                        </div>
                    )}

                    {phase === 'result' && (
                        <div className="bg-slate-900 rounded-xl p-8 border border-indigo-500/50 text-center space-y-3">
                            <p className="text-indigo-300 text-sm">Round {roundRef.current} of {TOTAL_ROUNDS}</p>
                            <p className="text-4xl font-black text-white tabular-nums">{currentRT}<span className="text-lg text-slate-400">ms</span></p>
                            <button onClick={startRound} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-sm">
                                Next Round →
                            </button>
                        </div>
                    )}

                    {phase === 'done' && (
                        <div className="bg-slate-900 rounded-xl p-8 border border-emerald-500/50 text-center space-y-3">
                            <p className="text-emerald-400 font-bold text-sm uppercase tracking-wider">Test Complete ({mode === 'simple' ? 'Simple' : 'Choice'} RT)</p>
                            <p className="text-5xl font-black text-white tabular-nums">{avg}<span className="text-lg text-slate-400">ms avg</span></p>
                            <div className="flex gap-2 justify-center">
                                {results.map((r, i) => (
                                    <span key={i} className="bg-slate-800 px-3 py-1 rounded text-xs text-slate-300 tabular-nums">R{i + 1}: {r}ms</span>
                                ))}
                            </div>
                            <button
                                onClick={() => { setPhase('idle'); setResults([]); }}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm mt-2"
                            >
                                Play Again
                            </button>
                        </div>
                    )}
                </div>

                {/* Reference data */}
                <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 space-y-4">
                    <h4 className="font-bold text-white flex items-center gap-2"><Zap className="text-amber-400" size={16} /> Reaction Time Reference</h4>

                    <div className="space-y-3">
                        <div className="bg-slate-800 rounded-lg p-3 border border-slate-600">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-300 font-semibold">Simple RT</span>
                                <span className="text-sm font-mono text-emerald-400">~200ms</span>
                            </div>
                            <div className="mt-1.5 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '40%' }} />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Single stimulus, single response.</p>
                        </div>

                        <div className="bg-slate-800 rounded-lg p-3 border border-slate-600">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-300 font-semibold">Choice RT</span>
                                <span className="text-sm font-mono text-amber-400">~350ms+</span>
                            </div>
                            <div className="mt-1.5 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 rounded-full" style={{ width: '70%' }} />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Multiple stimuli, must select correct response.</p>
                        </div>

                        <div className="bg-slate-800 rounded-lg p-3 border border-slate-600">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-300 font-semibold">Complex RT</span>
                                <span className="text-sm font-mono text-red-400">~500ms+</span>
                            </div>
                            <div className="mt-1.5 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500 rounded-full" style={{ width: '100%' }} />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Multiple stimuli, variable responses, cognitive load.</p>
                        </div>
                    </div>

                    <div className="p-3 bg-indigo-900/20 border border-indigo-500/30 rounded-lg">
                        <p className="text-xs text-slate-300">
                            <strong className="text-indigo-300">Hick&apos;s Law:</strong> RT increases logarithmically with the number of alternatives.
                            RT = a + b × log₂(n). This is why checklists and SOPs reduce cockpit response time — they limit decision options.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════
   4. RASMUSSEN'S SRK FRAMEWORK
   ══════════════════════════════════════════════════════════ */
interface SRKLevel {
    id: string;
    label: string;
    short: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    borderColor: string;
    description: string;
    mechanism: string;
    errorType: string;
    aviationExamples: string[];
}

const SRK_LEVELS: SRKLevel[] = [
    {
        id: 'skill',
        label: 'Skill-Based',
        short: 'S',
        icon: <Settings size={28} />,
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/50',
        description: 'Automatic, unconscious actions driven by practised motor patterns. Requires minimal attention. Most efficient level of performance.',
        mechanism: 'Sensory signals → direct motor response (no conscious thought). Relies on stored motor schemas from extensive practice.',
        errorType: 'Slips & Lapses — correct intention, wrong execution. E.g., reaching for the wrong switch out of habit.',
        aviationExamples: [
            'Maintaining wings-level flight through small control inputs',
            'Scanning instruments in the trained T-scan pattern',
            'Operating radio frequency changes on familiar equipment',
            'Flaring during landing approach after hundreds of repetitions',
        ],
    },
    {
        id: 'rule',
        label: 'Rule-Based',
        short: 'R',
        icon: <BookOpen size={28} />,
        color: 'text-indigo-400',
        bgColor: 'bg-indigo-500/10',
        borderColor: 'border-indigo-500/50',
        description: 'Conscious application of stored IF-THEN rules learned from training, SOPs, or experience. Requires moderate attention.',
        mechanism: 'Recognise situation → match to known rule → apply stored procedure. Uses working memory to hold and execute the rule sequence.',
        errorType: 'Mistakes (Rule-based) — applying the wrong rule, or misidentifying the situation that triggers the rule.',
        aviationExamples: [
            'IF engine fire warning → THEN execute Engine Fire checklist',
            'IF crosswind > 15kts → THEN use crab or wing-low technique',
            'IF TCAS RA → THEN follow RA guidance, override ATC instructions',
            'IF missed approach point reached with no visual → THEN go around',
        ],
    },
    {
        id: 'knowledge',
        label: 'Knowledge-Based',
        short: 'K',
        icon: <Cpu size={28} />,
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/50',
        description: 'Conscious, slow analytical reasoning from first principles. Used when no rules exist for the situation. Highest attention demand, slowest, most error-prone.',
        mechanism: 'Novel situation → analyse from first principles → generate and evaluate potential solutions → select best option. Very resource-intensive.',
        errorType: 'Mistakes (Knowledge-based) — incomplete mental model, reasoning errors, fixation on wrong hypothesis.',
        aviationExamples: [
            'Diagnosing an unfamiliar combination of system failures with no checklist coverage',
            'Deciding whether to divert or continue when facing multiple simultaneous degradations',
            'Captain Sullenberger reasoning through the Hudson River ditching options in real-time',
            'Troubleshooting unexpected avionics behaviour not covered in the QRH',
        ],
    },
];

const RasmussenSRK = () => {
    const [expanded, setExpanded] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-white">Rasmussen&apos;s SRK Framework (1983)</h3>
                <p className="text-sm text-slate-400 mt-1">Three levels of cognitive control in human performance. Click each card to explore.</p>
            </div>

            {/* Three cards */}
            <div className="grid md:grid-cols-3 gap-4">
                {SRK_LEVELS.map(level => {
                    const isExpanded = expanded === level.id;
                    return (
                        <button
                            key={level.id}
                            onClick={() => setExpanded(isExpanded ? null : level.id)}
                            className={`text-left p-5 rounded-xl border-2 transition-all duration-300 ${
                                isExpanded
                                    ? `${level.bgColor} ${level.borderColor} ring-2 ring-offset-2 ring-offset-slate-800 ring-indigo-500/30`
                                    : `bg-slate-900 ${level.borderColor} hover:${level.bgColor}`
                            }`}
                        >
                            <div className={`${level.color} mb-3`}>{level.icon}</div>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className={`text-2xl font-black ${level.color}`}>{level.short}</span>
                                <span className="text-white font-bold text-sm">{level.label}</span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">{level.description}</p>
                            <p className="text-[10px] text-slate-500 mt-3">Click to {isExpanded ? 'collapse' : 'expand details'}</p>
                        </button>
                    );
                })}
            </div>

            {/* Expanded detail */}
            {expanded && (() => {
                const level = SRK_LEVELS.find(l => l.id === expanded)!;
                return (
                    <div key={level.id} className={`detail-expand rounded-xl border-2 ${level.borderColor} ${level.bgColor} p-5 space-y-4`}>
                        <div>
                            <h4 className={`font-bold ${level.color} mb-1`}>Processing Mechanism</h4>
                            <p className="text-sm text-slate-300">{level.mechanism}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-red-400 mb-1">Typical Error Type</h4>
                            <p className="text-sm text-slate-300">{level.errorType}</p>
                        </div>
                        <div>
                            <h4 className={`font-bold ${level.color} mb-2`}>✈ Aviation Examples</h4>
                            <ul className="space-y-1.5">
                                {level.aviationExamples.map((ex, i) => (
                                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                        <span className={`${level.color} mt-0.5`}>•</span>
                                        {ex}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            })()}

            {/* SRK hierarchy note */}
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 flex items-start gap-3">
                <Layers className="text-indigo-400 shrink-0 mt-0.5" size={18} />
                <p className="text-xs text-slate-300">
                    <strong className="text-indigo-300">Key Insight:</strong> Pilots move DOWN the hierarchy (K→R→S) through training and practice.
                    Expertise means converting knowledge-based tasks into rule-based, and rule-based into skill-based.
                    Under stress, pilots may REGRESS upward — losing automaticity and reverting to slower, error-prone analytical processing.
                </p>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════
   ORIGINAL COMPONENTS — Preserved in full
   ══════════════════════════════════════════════════════════ */

// 040.03.01 Attention
const AttentionTypes = () => {
    const [type, setType] = useState<'selective' | 'divided' | 'sustained'>('selective');

    return (
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
            <div className="space-y-4">
                <button onClick={() => setType('selective')} className={`w-full p-4 text-left rounded-lg border transition-all ${type === 'selective' ? 'bg-purple-900/20 border-purple-500 text-purple-300' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                    <div className="font-bold text-lg mb-1">Selective Attention</div>
                    <div className="text-xs opacity-70">Focusing on one source, ignoring others. &quot;Cocktail Party Effect&quot;.</div>
                </button>
                <button onClick={() => setType('divided')} className={`w-full p-4 text-left rounded-lg border transition-all ${type === 'divided' ? 'bg-blue-900/20 border-blue-500 text-blue-300' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                    <div className="font-bold text-lg mb-1">Divided Attention</div>
                    <div className="text-xs opacity-70">Time-sharing between tasks. Requires skill/automaticity. Danger of saturation.</div>
                </button>
                <button onClick={() => setType('sustained')} className={`w-full p-4 text-left rounded-lg border transition-all ${type === 'sustained' ? 'bg-emerald-900/20 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                    <div className="font-bold text-lg mb-1">Sustained Attention (Vigilance)</div>
                    <div className="text-xs opacity-70">Maintaining focus over time. Risk of Hypovigilance (under-arousal).</div>
                </button>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 flex items-center justify-center relative overflow-hidden">
                {type === 'selective' && (
                    <div className="text-center relative z-10 animate-in zoom-in">
                        <Target className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                        <p className="text-white font-bold">The Filter</p>
                        <p className="text-sm text-slate-400 mt-2">Brain filters inputs based on Intensity, Relevance, and Expectation.</p>
                        <div className="mt-4 flex gap-2 justify-center opacity-50">
                            <span className="bg-slate-800 p-2 rounded text-xs line-through">Noise</span>
                            <span className="bg-slate-800 p-2 rounded text-xs line-through">Chatter</span>
                            <span className="bg-purple-600 p-2 rounded text-xs text-white font-bold">WARNING</span>
                        </div>
                    </div>
                )}
                {type === 'divided' && (
                    <div className="text-center relative z-10 animate-in zoom-in">
                        <Layers className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                        <p className="text-white font-bold">The Juggler</p>
                        <p className="text-sm text-slate-400 mt-2">Cannot truly multitask. Rapidly switching attention.</p>
                        <div className="mt-4 flex gap-4 justify-center">
                            <div className="w-20 h-20 bg-slate-800 rounded-full border-4 border-blue-500 flex items-center justify-center animate-pulse">Fly</div>
                            <div className="w-20 h-20 bg-slate-800 rounded-full border-4 border-blue-500 flex items-center justify-center animate-pulse animation-delay-500">Radio</div>
                        </div>
                    </div>
                )}
                {type === 'sustained' && (
                    <div className="text-center relative z-10 animate-in zoom-in">
                        <Eye className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                        <p className="text-white font-bold">The Watchman</p>
                        <p className="text-sm text-slate-400 mt-2">Performance drops after 20-30 mins of monitoring without stimulus.</p>
                        <div className="mt-4 p-2 bg-red-900/20 border border-red-500/50 rounded text-xs text-red-300">
                            <strong>Hypovigilance:</strong> Danger state of low arousal. Can lead to microsleeps.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// 040.03.02 Situation Awareness
const SAModel = () => {
    return (
        <div className="animate-in slide-in-from-right-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Endsley&apos;s 3 Levels of SA</h3>
            
            <div className="flex flex-col md:flex-row gap-4 items-stretch justify-center h-[300px]">
                {/* Level 1 */}
                <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col justify-end group hover:border-sky-500 transition-colors relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-sky-500"></div>
                    <div className="text-6xl font-black text-slate-800 absolute top-4 right-4 group-hover:text-sky-900 transition-colors">1</div>
                    <Eye className="text-sky-500 mb-4 w-10 h-10" />
                    <h4 className="text-lg font-bold text-white">Perception</h4>
                    <p className="text-xs text-slate-400 mt-2">&quot;What is happening?&quot;</p>
                    <p className="text-xs text-slate-500 mt-1 italic">Scanning instruments, hearing alarms, seeing traffic.</p>
                </div>

                {/* Level 2 */}
                <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col justify-end group hover:border-indigo-500 transition-colors relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
                    <div className="text-6xl font-black text-slate-800 absolute top-4 right-4 group-hover:text-indigo-900 transition-colors">2</div>
                    <Brain className="text-indigo-500 mb-4 w-10 h-10" />
                    <h4 className="text-lg font-bold text-white">Comprehension</h4>
                    <p className="text-xs text-slate-400 mt-2">&quot;What does it mean?&quot;</p>
                    <p className="text-xs text-slate-500 mt-1 italic">Understanding that a low fuel reading means limited range.</p>
                </div>

                {/* Level 3 */}
                <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col justify-end group hover:border-emerald-500 transition-colors relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                    <div className="text-6xl font-black text-slate-800 absolute top-4 right-4 group-hover:text-emerald-900 transition-colors">3</div>
                    <Target className="text-emerald-500 mb-4 w-10 h-10" />
                    <h4 className="text-lg font-bold text-white">Projection</h4>
                    <p className="text-xs text-slate-400 mt-2">&quot;What will happen?&quot;</p>
                    <p className="text-xs text-slate-500 mt-1 italic">Thinking ahead. Predicting engine failure from decreasing oil pressure.</p>
                </div>
            </div>

            <div className="mt-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-500 shrink-0" />
                <div>
                    <h5 className="font-bold text-red-400 text-sm">Loss of SA</h5>
                    <p className="text-xs text-slate-300">
                        Usually starts at Level 1 (Failure to monitor). 
                        Can be caused by Fixation, Distraction, or High Workload.
                        <strong> Regaining SA</strong> requires stepping back to Level 1 (Scan).
                    </p>
                </div>
            </div>
        </div>
    );
};

// 040.03.02.04 Environment Capture
const EnvironmentCapture = () => {
    const [action, setAction] = useState<string | null>(null);

    const handleAction = (act: string) => {
        setAction(act);
    };

    return (
        <div className="animate-in fade-in">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <RefreshCcw className="text-orange-400" /> Habit Capture
                    </h3>
                    <p className="text-sm text-slate-300 mb-4">
                        A frequently practiced skill/habit overrides the intended action, especially during high workload or fatigue.
                    </p>
                    
                    <div className="bg-slate-800 p-4 rounded border border-slate-600 mb-4">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Scenario</p>
                        <p className="text-white text-sm">
                            You normally fly the <strong>Cessna 172</strong> (Fixed Gear).<br/>
                            Today you are flying a <strong>Piper Arrow</strong> (Retractable).
                        </p>
                        <p className="text-white text-sm mt-2 font-bold text-orange-300">
                            After takeoff, what do you do?
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={() => handleAction('habit')}
                            className="p-3 bg-red-900/30 border border-red-500/50 hover:bg-red-900/50 rounded text-red-200 text-sm font-bold transition-colors"
                        >
                            Nothing (Fixed Gear Habit)
                        </button>
                        <button 
                            onClick={() => handleAction('intent')}
                            className="p-3 bg-emerald-900/30 border border-emerald-500/50 hover:bg-emerald-900/50 rounded text-emerald-200 text-sm font-bold transition-colors"
                        >
                            Retract Gear (Intention)
                        </button>
                    </div>
                </div>

                <div className="flex flex-col justify-center">
                    {action === 'habit' && (
                        <div className="bg-red-500 text-white p-6 rounded-xl shadow-lg text-center animate-in zoom-in">
                            <h4 className="text-2xl font-black mb-2">ERROR!</h4>
                            <p className="text-sm">
                                You fell victim to <strong>Environment Capture</strong> (or Habit Intrusion). 
                                Your brain defaulted to the stronger neural pathway (Fixed Gear) because you didn&apos;t consciously override it.
                            </p>
                        </div>
                    )}
                    {action === 'intent' && (
                        <div className="bg-emerald-500 text-white p-6 rounded-xl shadow-lg text-center animate-in zoom-in">
                            <h4 className="text-2xl font-black mb-2">CORRECT</h4>
                            <p className="text-sm">
                                You successfully used conscious attention to override the automatic habit. 
                                This requires mental effort (Level 2/3 Processing).
                            </p>
                        </div>
                    )}
                    {!action && (
                        <div className="text-center text-slate-500">
                            <Brain size={64} className="mx-auto mb-4 opacity-20" />
                            <p>Select an action to test the theory.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InformationProcessing;
