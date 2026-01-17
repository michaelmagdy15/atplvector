import React, { useState } from 'react';
import {
    AlertCircle,
    AlertTriangle,
    Plane,
    ShieldAlert,
    Wind,
    ArrowUpCircle,
    ArrowDownCircle,
    RefreshCcw,
    RotateCcw,
    CheckCircle2,
    Info,
    ChevronRight,
    Camera
} from 'lucide-react';

interface UPRTScenario {
    id: number;
    title: string;
    description: string;
    image?: string; // We'll use a visual placeholder with CSS for now
    instruments: {
        pitch: number; // degrees
        bank: number;  // degrees
        speed: string; // 'LOW', 'HIGH', 'NORMAL'
        power: string; // 'LOW', 'HIGH', 'NORMAL'
        trend: string; // 'INCREASING', 'DECREASING', 'STABLE'
    };
    correctSequence: string[];
    explanation: string;
}

const SCENARIOS: UPRTScenario[] = [
    {
        id: 1,
        title: 'Nose High Upset',
        description: 'You encounter severe turbulence. The aircraft loses airspeed rapidly with a high pitch attitude.',
        instruments: {
            pitch: 25,
            bank: 0,
            speed: 'LOW',
            power: 'NORMAL',
            trend: 'DECREASING'
        },
        correctSequence: ['PUSH', 'ROLL', 'THRUST', 'STABILIZE'],
        explanation: 'For a Nose High upset: 1. PUSH to reduce AoA. 2. ROLL to level wings. 3. THRUST (only if needed once AoA is reduced). 4. STABILIZE.'
    },
    {
        id: 2,
        title: 'Nose Low / High Bank',
        description: 'Wake turbulence roll during approach. Pitch is decreasing and bank angle is 60 degrees.',
        instruments: {
            pitch: -15,
            bank: 60,
            speed: 'INCREASING',
            power: 'NORMAL',
            trend: 'INCREASING'
        },
        correctSequence: ['ROLL', 'PUSH', 'THRUST', 'STABILIZE'],
        explanation: 'For Nose Low: 1. ROLL to wings level first. 2. PUSH/Neutral pitch. 3. THRUST (Reduce power if speed is high). 4. STABILIZE.'
    },
    {
        id: 3,
        title: 'Approach to Stall',
        description: 'Clean configuration, high altitude. Stick shaker activates.',
        instruments: {
            pitch: 10,
            bank: 0,
            speed: 'LOW',
            power: 'LOW',
            trend: 'DECREASING'
        },
        correctSequence: ['PUSH', 'ROLL', 'THRUST', 'STABILIZE'],
        explanation: 'Stall Recovery: PUSH to reduce AoA is the priority above all else (including power in some swept-wing jets).'
    }
];

const UPRTConcepts: React.FC = () => {
    const [activeScenario, setActiveScenario] = useState<UPRTScenario | null>(null);
    const [userSequence, setUserSequence] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<{ status: 'IDLE' | 'CORRECT' | 'WRONG', text: string }>({ status: 'IDLE', text: '' });

    const handleAction = (action: string) => {
        if (feedback.status !== 'IDLE') return;

        const newSequence = [...userSequence, action];
        setUserSequence(newSequence);

        if (newSequence.length === activeScenario?.correctSequence.length) {
            const isCorrect = newSequence.every((val, index) => val === activeScenario.correctSequence[index]);
            if (isCorrect) {
                setFeedback({ status: 'CORRECT', text: 'Correct Recovery Technique! Well done.' });
            } else {
                setFeedback({ status: 'WRONG', text: `Incorrect. Correct sequence: ${activeScenario.correctSequence.join(' → ')}` });
            }
        }
    };

    const reset = () => {
        setUserSequence([]);
        setFeedback({ status: 'IDLE', text: '' });
    };

    const nextScenario = () => {
        const nextIdx = SCENARIOS.findIndex(s => s.id === activeScenario?.id) + 1;
        if (nextIdx < SCENARIOS.length) {
            setActiveScenario(SCENARIOS[nextIdx]);
            reset();
        } else {
            setActiveScenario(null);
        }
    };

    if (!activeScenario) {
        return (
            <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-red-500/20 rounded-xl text-red-400">
                        <AlertCircle size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">
                            UPRT <span className="text-red-400">Concepts</span>
                        </h1>
                        <p className="text-slate-400 mt-1">Upset Prevention and Recovery Training theory and PFD recognition.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {SCENARIOS.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setActiveScenario(s)}
                            className="bg-slate-800/50 border border-white/10 p-6 rounded-2xl text-left hover:border-red-500/50 transition-all hover:bg-slate-800"
                        >
                            <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{s.description}</p>
                            <div className="mt-4 flex items-center text-red-400 font-bold text-sm uppercase tracking-wider">
                                Train Recovery <ChevronRight size={16} />
                            </div>
                        </button>
                    ))}
                </div>

                <div className="bg-slate-900/50 border border-white/5 p-8 rounded-3xl mt-8">
                    <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Info size={18} className="text-red-400" />
                        UPRT Core Principles
                    </h2>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li className="flex gap-3">
                            <div className="h-5 w-5 rounded-full bg-red-500/20 flex-shrink-0 flex items-center justify-center text-red-400 font-bold text-[10px]">1</div>
                            <p><strong className="text-slate-200">Recognition:</strong> Early detection of the upset condition via instrumentation is critical.</p>
                        </li>
                        <li className="flex gap-3">
                            <div className="h-5 w-5 rounded-full bg-red-500/20 flex-shrink-0 flex items-center justify-center text-red-400 font-bold text-[10px]">2</div>
                            <p><strong className="text-slate-200">AoA Management:</strong> In almost all upsets, reducing Angle of Attack (Push) is the first priority.</p>
                        </li>
                        <li className="flex gap-3">
                            <div className="h-5 w-5 rounded-full bg-red-500/20 flex-shrink-0 flex items-center justify-center text-red-400 font-bold text-[10px]">3</div>
                            <p><strong className="text-slate-200">Automation:</strong> Disconnect autopilot and autothrottle immediately when an upset is recognized.</p>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <button onClick={() => setActiveScenario(null)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold">
                    <RotateCcw size={18} /> Exit Trainer
                </button>
                <div className="text-sm font-mono text-slate-500 uppercase tracking-widest">
                    Scenario {activeScenario.id} of {SCENARIOS.length}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Instrument View Simulator */}
                <div className="space-y-6">
                    <div className="bg-black border-4 border-slate-800 rounded-3xl aspect-square relative shadow-2xl overflow-hidden">
                        {/* Fake PFD Background */}
                        <div className="absolute inset-0 flex flex-col">
                            <div className="flex-1 bg-sky-500/40 relative">
                                {/* Synthetic Horizon based on pitch/bank */}
                                <div
                                    className="absolute inset-0 bg-amber-900/60 transition-transform duration-1000 origin-center"
                                    style={{
                                        transform: `rotate(${-activeScenario.instruments.bank}deg) translateY(${activeScenario.instruments.pitch * 2}px)`,
                                        top: '50%',
                                        bottom: '-100%',
                                        left: '-50%',
                                        right: '-50%'
                                    }}
                                />
                                {/* Pitch Scales */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                                    <div className="space-y-4">
                                        {[20, 10, 0, -10, -20].map(p => (
                                            <div key={p} className="flex items-center justify-center gap-8">
                                                <span className="text-[10px] text-white w-4">{p}</span>
                                                <div className="w-16 h-px bg-white" />
                                                <span className="text-[10px] text-white w-4">{p}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Central Symbology */}
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="relative">
                                {/* Aircraft Symbol */}
                                <div className="w-24 h-1 bg-white shadow-[0_0_10px_white]" />
                                <div className="absolute top-0 left-0 w-2 h-4 bg-white -translate-y-full" />
                                <div className="absolute top-0 right-0 w-2 h-4 bg-white -translate-y-full" />

                                {activeScenario.instruments.speed === 'LOW' && (
                                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-red-500 font-black animate-pulse flex flex-col items-center">
                                        <AlertCircle size={24} />
                                        <span className="text-xs">LOW SPEED</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Overlay Glass Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-900 border border-white/5 p-4 rounded-xl text-center">
                            <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Speed</div>
                            <div className={`text-xl font-black ${activeScenario.instruments.speed === 'LOW' ? 'text-red-400' : activeScenario.instruments.speed === 'HIGH' ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {activeScenario.instruments.speed}
                            </div>
                            <div className="text-[10px] text-slate-600 mt-1">{activeScenario.instruments.trend}</div>
                        </div>
                        <div className="bg-slate-900 border border-white/5 p-4 rounded-xl text-center">
                            <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Pitch</div>
                            <div className="text-xl font-black text-white">{activeScenario.instruments.pitch}°</div>
                            <div className="text-[10px] text-slate-600 mt-1">{activeScenario.instruments.pitch > 0 ? 'NOSE UP' : 'NOSE LOW'}</div>
                        </div>
                        <div className="bg-slate-900 border border-white/5 p-4 rounded-xl text-center">
                            <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Bank</div>
                            <div className="text-xl font-black text-white">{activeScenario.instruments.bank}°</div>
                            <div className="text-[10px] text-slate-600 mt-1">{activeScenario.instruments.bank > 0 ? 'LEVEL' : 'UPSET'}</div>
                        </div>
                    </div>
                </div>

                {/* Right: Interaction Area */}
                <div className="flex flex-col space-y-8">
                    <div className="bg-slate-900/80 border border-white/10 p-8 rounded-3xl flex-1 backdrop-blur-xl">
                        <h3 className="text-2xl font-bold text-white mb-6">Execution Sequence</h3>

                        <div className="flex flex-wrap gap-3 mb-12 min-h-[60px] p-4 bg-black/40 rounded-2xl border border-white/5 items-center">
                            {userSequence.map((action, i) => (
                                <React.Fragment key={i}>
                                    <div className="px-5 py-3 bg-white text-slate-900 rounded-xl font-black text-xs uppercase shadow-lg animate-in zoom-in">
                                        {action}
                                    </div>
                                    {i < userSequence.length - 1 && <ChevronRight size={16} className="text-slate-600" />}
                                </React.Fragment>
                            ))}
                            {userSequence.length === 0 && <span className="text-slate-600 font-mono text-xs italic">Select recovery actions in order...</span>}
                        </div>

                        {feedback.status === 'IDLE' ? (
                            <div className="grid grid-cols-2 gap-4">
                                {['PUSH', 'ROLL', 'THRUST', 'STABILIZE'].map(action => (
                                    <button
                                        key={action}
                                        onClick={() => handleAction(action)}
                                        disabled={userSequence.includes(action)}
                                        className="group relative h-20 bg-slate-800 border border-white/5 rounded-2xl hover:border-red-500/50 hover:bg-slate-700/50 transition-all font-black text-white flex items-center justify-center gap-3 overflow-hidden disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {action}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className={`p-8 rounded-3xl border-2 ${feedback.status === 'CORRECT' ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-red-500/30 bg-red-500/10'} animate-in slide-in-from-bottom duration-500`}>
                                <div className="flex items-center gap-3 mb-4">
                                    {feedback.status === 'CORRECT' ? <CheckCircle2 className="text-emerald-400 w-8 h-8" /> : <AlertTriangle className="text-red-400 w-8 h-8" />}
                                    <h4 className={`text-xl font-bold ${feedback.status === 'CORRECT' ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {feedback.status === 'CORRECT' ? 'SUPERIOR RECOVERY' : 'UNSUCCESSFUL RECOVERY'}
                                    </h4>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                                    {activeScenario.explanation}
                                </p>
                                <div className="flex gap-4">
                                    <button onClick={reset} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all text-sm">
                                        Try Again
                                    </button>
                                    <button onClick={nextScenario} className="flex-2 py-3 bg-white text-slate-900 hover:bg-slate-200 rounded-xl font-bold transition-all text-sm px-8">
                                        Next Scenario
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl flex items-start gap-4">
                        <ShieldAlert size={20} className="text-amber-500 mt-1" />
                        <div>
                            <h4 className="font-bold text-amber-500 text-sm italic">CAUTION: STARTLE EFFECT</h4>
                            <p className="text-xs text-amber-300/70 mt-1 leading-relaxed">
                                Real-world upsets often involve a "startle effect" that can cause pilot freezing or incorrect intuitive reactions. Mental rehearsal of recovery sequences is vital for instinctive correct action.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UPRTConcepts;
