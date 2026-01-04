
import React, { useState, useEffect, useRef } from 'react';
import { Brain, Zap, Activity, Timer, RotateCcw } from 'lucide-react';

const HPLNervousSystem: React.FC = () => {
    const [tab, setTab] = useState<'anatomy' | 'autonomic' | 'reflex'>('anatomy');

    return (
        <div className="space-y-6">
            <header className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-pink-500/20 rounded-lg">
                        <Brain className="w-6 h-6 text-pink-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100">Nervous System</h1>
                </div>
                <p className="text-slate-400">
                    The command and control center. Processes sensory input and coordinates action.
                </p>
            </header>

            <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg">
                <TabButton active={tab === 'anatomy'} onClick={() => setTab('anatomy')} icon={Brain} label="Anatomy" />
                <TabButton active={tab === 'autonomic'} onClick={() => setTab('autonomic')} icon={Activity} label="Autonomic" />
                <TabButton active={tab === 'reflex'} onClick={() => setTab('reflex')} icon={Zap} label="Reflex Test" />
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 min-h-[400px]">
                {tab === 'anatomy' && <NervousAnatomy />}
                {tab === 'autonomic' && <AutonomicSystem />}
                {tab === 'reflex' && <ReflexTest />}
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md transition-all font-medium ${active
            ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/20'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
    >
        <Icon size={18} />
        {label}
    </button>
);

const NervousAnatomy = () => (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Central vs Peripheral</h3>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 hover:border-pink-500 transition-colors cursor-default group">
                <h4 className="font-bold text-pink-400 mb-2 flex items-center gap-2">
                    <Brain size={20} /> CNS (Central)
                </h4>
                <p className="text-sm text-slate-300 mb-4">
                    The processing center. Makes decisions.
                </p>
                <div className="flex gap-4">
                    <div className="bg-slate-800 px-3 py-1 rounded text-xs font-bold text-slate-400 group-hover:bg-pink-900/30 group-hover:text-pink-300 transition-colors">Brain</div>
                    <div className="bg-slate-800 px-3 py-1 rounded text-xs font-bold text-slate-400 group-hover:bg-pink-900/30 group-hover:text-pink-300 transition-colors">Spinal Cord</div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors cursor-default group">
                <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                    <Activity size={20} /> PNS (Peripheral)
                </h4>
                <p className="text-sm text-slate-300 mb-4">
                    The wiring. Transmits signals to/from the CNS.
                </p>
                <div className="flex gap-4">
                    <div className="bg-slate-800 px-3 py-1 rounded text-xs font-bold text-slate-400 group-hover:bg-blue-900/30 group-hover:text-blue-300 transition-colors">Sensory Nerves</div>
                    <div className="bg-slate-800 px-3 py-1 rounded text-xs font-bold text-slate-400 group-hover:bg-blue-900/30 group-hover:text-blue-300 transition-colors">Motor Nerves</div>
                </div>
            </div>
        </div>

        <div className="relative bg-slate-900/50 rounded-xl border border-slate-700 p-8 flex items-center justify-center">
            {/* Abstract SVG of Nervous System */}
            <svg viewBox="0 0 200 400" className="h-80 opacity-80">
                {/* Brain */}
                <path d="M70,50 Q100,10 130,50 Q150,80 130,110 Q100,140 70,110 Q50,80 70,50" fill="#db2777" className="animate-pulse" />
                {/* Spine */}
                <path d="M100,110 L100,350" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
                {/* Nerves */}
                <path d="M100,140 L40,160" stroke="#3b82f6" strokeWidth="2" />
                <path d="M100,140 L160,160" stroke="#3b82f6" strokeWidth="2" />
                <path d="M100,180 L30,220" stroke="#3b82f6" strokeWidth="2" />
                <path d="M100,180 L170,220" stroke="#3b82f6" strokeWidth="2" />
                <path d="M100,240 L40,300" stroke="#3b82f6" strokeWidth="2" />
                <path d="M100,240 L160,300" stroke="#3b82f6" strokeWidth="2" />
            </svg>

            <div className="absolute top-4 right-4 text-xs text-slate-500 text-right">
                <div className="flex items-center justify-end gap-2 mb-1">CNS <div className="w-3 h-3 bg-pink-600 rounded-full"></div></div>
                <div className="flex items-center justify-end gap-2">PNS <div className="w-3 h-3 bg-blue-500 rounded-full"></div></div>
            </div>
        </div>
    </div>
);

const AutonomicSystem = () => {
    const [mode, setMode] = useState<'symp' | 'para'>('symp');

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4">
            <div className="flex justify-center gap-4 bg-slate-900 p-2 rounded-lg inline-flex mx-auto w-full">
                <button
                    onClick={() => setMode('symp')}
                    className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${mode === 'symp' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                    Sympathetic (Action)
                </button>
                <button
                    onClick={() => setMode('para')}
                    className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all ${mode === 'para' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                    Parasympathetic (Rest)
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
                <EffectCard
                    active={mode === 'symp'}
                    title="Fight or Flight"
                    icon={Zap}
                    color="red"
                    effects={[
                        "Pupils Dilate (Tunnel Vision)",
                        "Heart Rate Increases",
                        "Digestion Stops",
                        "Adrenaline Dump"
                    ]}
                />
                <EffectCard
                    active={mode === 'para'}
                    title="Rest and Digest"
                    icon={Activity}
                    color="emerald"
                    effects={[
                        "Pupils Constrict",
                        "Heart Rate Slows",
                        "Digestion Resumes",
                        "Recovery Mode"
                    ]}
                />
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 mt-4 text-center">
                <p className="text-sm text-slate-300">
                    Arousal is necessary for performance (Yerkes-Dodson), but too much sympathetic activation leads to <strong className="text-red-400">Panic</strong>.
                </p>
            </div>
        </div>
    );
};

const EffectCard = ({ active, title, icon: Icon, color, effects }: any) => (
    <div className={`p-6 rounded-xl border-2 transition-all duration-300 ${active ? `bg-${color}-900/20 border-${color}-500 scale-105 shadow-[0_0_20px_rgba(0,0,0,0.3)]` : 'bg-slate-900/50 border-slate-800 opacity-50 grayscale'}`}>
        <div className="flex items-center gap-3 mb-6">
            <div className={`p-3 rounded-lg bg-${color}-500/20`}>
                <Icon className={`text-${color}-500`} size={24} />
            </div>
            <h3 className={`text-xl font-bold text-${color}-400`}>{title}</h3>
        </div>
        <ul className="space-y-3">
            {effects.map((e: string, i: number) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                    <div className={`w-2 h-2 rounded-full bg-${color}-500`} />
                    {e}
                </li>
            ))}
        </ul>
    </div>
);

const ReflexTest = () => {
    const [gameState, setGameState] = useState<'idle' | 'waiting' | 'ready' | 'finished'>('idle');
    const [startTime, setStartTime] = useState(0);
    const [reactionTime, setReactionTime] = useState(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const startGame = () => {
        setGameState('waiting');
        setReactionTime(0);
        const randomDelay = 1000 + Math.random() * 3000;
        timeoutRef.current = setTimeout(() => {
            setGameState('ready');
            setStartTime(performance.now());
        }, randomDelay);
    };

    const handleClick = () => {
        if (gameState === 'waiting') {
            // Too early
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setGameState('idle');
            alert("Too early! Wait for green.");
        } else if (gameState === 'ready') {
            const end = performance.now();
            setReactionTime(Math.round(end - startTime));
            setGameState('finished');
        }
    };

    const reset = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setGameState('idle');
        setReactionTime(0);
    }

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Reaction Time Test</h3>
                <div className="text-sm text-slate-400">
                    Avg Human Visual Reaction: <span className="text-white font-bold">250ms</span>
                </div>
            </div>

            <div
                className={`
                    w-full h-64 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 select-none
                    ${gameState === 'idle' ? 'bg-slate-700 hover:bg-slate-600' : ''}
                    ${gameState === 'waiting' ? 'bg-red-600' : ''}
                    ${gameState === 'ready' ? 'bg-emerald-500 active:scale-95' : ''}
                    ${gameState === 'finished' ? 'bg-slate-800 border-2 border-emerald-500' : ''}
                `}
                onClick={gameState === 'idle' ? startGame : gameState === 'finished' ? reset : handleClick}
            >
                {gameState === 'idle' && (
                    <>
                        <Zap size={48} className="text-yellow-400 mb-4" />
                        <h4 className="text-2xl font-bold text-white">Click to Start</h4>
                        <p className="text-slate-300 mt-2">Wait for green, then click!</p>
                    </>
                )}
                {gameState === 'waiting' && (
                    <>
                        <Timer size={48} className="text-white mb-4 animate-spin-slow" />
                        <h4 className="text-2xl font-bold text-white">Wait for it...</h4>
                    </>
                )}
                {gameState === 'ready' && (
                    <>
                        <h4 className="text-4xl font-black text-white uppercase">CLICK NOW!</h4>
                    </>
                )}
                {gameState === 'finished' && (
                    <>
                        <div className="text-6xl font-black text-white mb-2 font-mono">{reactionTime}ms</div>
                        <p className={`text-lg font-bold mb-6 ${reactionTime < 250 ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {reactionTime < 200 ? "Superhuman!" : reactionTime < 270 ? "Average Pilot" : "Tired?"}
                        </p>
                        <button onClick={(e) => { e.stopPropagation(); reset(); }} className="flex items-center gap-2 px-6 py-3 bg-slate-700 rounded-lg text-white hover:bg-slate-600">
                            <RotateCcw size={18} /> Try Again
                        </button>
                    </>
                )}
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 text-xs text-slate-400">
                <strong className="text-white block mb-1">HPL Theory:</strong>
                Reaction time = Detection (Sensory) + Processing (CNS) + Action (Motor).
                <br />
                Age, fatigue, alcohol, and distractions significantly increase this time.
            </div>
        </div>
    );
};

export default HPLNervousSystem;
