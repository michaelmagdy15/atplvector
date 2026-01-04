
import React, { useState, useEffect } from 'react';
import { MessageSquare, Ear, Zap, Thermometer, UserCheck, EyeOff, Mic, Activity, ArrowRight, Gauge, HeartPulse, Battery, AlertTriangle } from 'lucide-react';

const CommunicationAndStress: React.FC = () => {
    const [tab, setTab] = useState<'comms' | 'theory' | 'stress' | 'gas'>('stress');

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
                    <button onClick={() => setTab('stress')} className={`px-4 py-2 rounded-md font-bold text-sm whitespace-nowrap transition-all ${tab === 'stress' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}>Stress Bucket</button>
                    <button onClick={() => setTab('gas')} className={`px-4 py-2 rounded-md font-bold text-sm whitespace-nowrap transition-all ${tab === 'gas' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}>G.A.S. Model</button>
                    <button onClick={() => setTab('comms')} className={`px-4 py-2 rounded-md font-bold text-sm whitespace-nowrap transition-all ${tab === 'comms' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}>4-Ears</button>
                    <button onClick={() => setTab('theory')} className={`px-4 py-2 rounded-md font-bold text-sm whitespace-nowrap transition-all ${tab === 'theory' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}>Comm Theory</button>
                </div>
            </div>

            {tab === 'stress' && <StressAccumulator />}
            {tab === 'gas' && <GasModel />}
            {tab === 'comms' && <FourEarsModel />}
            {tab === 'theory' && <CommTheory />}
        </div>
    );
};

// 040.03.06.02 Stress Accumulation & Transfer
const StressAccumulator = () => {
    // Stress Level (0-100)
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

// 040.03.06.02 General Adaptation Syndrome (GAS)
const GasModel = () => {
    const [phase, setPhase] = useState(0); // 0: Homeostasis, 1: Alarm, 2: Resistance, 3: Exhaustion

    return (
        <div className="animate-in slide-in-from-right-4">
            <h3 className="text-xl font-bold text-white mb-6">General Adaptation Syndrome (Selye)</h3>

            {/* The Graph */}
            <div className="relative h-64 bg-slate-900 rounded-xl border border-slate-700 mb-8 overflow-hidden">
                {/* Base Level Line */}
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-500 border-t border-dashed"></div>
                <div className="absolute top-1/2 left-2 text-[10px] text-slate-500 -mt-4">Normal Resistance</div>

                {/* SVG Curve */}
                <svg viewBox="0 0 400 200" className="w-full h-full absolute inset-0">
                    {/* Phase 1: Alarm (Dip then Spike) */}
                    <path d="M 0 100 Q 30 130 50 100 T 100 50" fill="none" stroke={phase >= 1 ? "#f43f5e" : "#334155"} strokeWidth="4" />
                    {/* Phase 2: Resistance (High Plateau) */}
                    <path d="M 100 50 L 250 50" fill="none" stroke={phase >= 2 ? "#fbbf24" : "#334155"} strokeWidth="4" />
                    {/* Phase 3: Exhaustion (Drop) */}
                    <path d="M 250 50 Q 300 50 350 150" fill="none" stroke={phase >= 3 ? "#94a3b8" : "#334155"} strokeWidth="4" />
                </svg>

                {/* Markers */}
                <div className="absolute top-4 left-[20%] text-xs font-bold text-pink-500 transition-opacity" style={{ opacity: phase >= 1 ? 1 : 0.3 }}>ALARM</div>
                <div className="absolute top-4 left-[45%] text-xs font-bold text-yellow-500 transition-opacity" style={{ opacity: phase >= 2 ? 1 : 0.3 }}>RESISTANCE</div>
                <div className="absolute bottom-4 right-[10%] text-xs font-bold text-slate-400 transition-opacity" style={{ opacity: phase >= 3 ? 1 : 0.3 }}>EXHAUSTION</div>
            </div>

            {/* Controls & Explanation */}
            <div className="grid md:grid-cols-3 gap-4">
                <button
                    onClick={() => setPhase(1)}
                    className={`p-4 rounded-lg border text-left transition-all ${phase === 1 ? 'bg-pink-900/20 border-pink-500' : 'bg-slate-900 border-slate-700'}`}
                >
                    <div className="font-bold text-white mb-2">1. Alarm Reaction</div>
                    <p className="text-xs text-slate-400">Shock &rarr; Counter-shock. Adrenaline release. "Fight or Flight". Temporary performance dip then spike.</p>
                </button>

                <button
                    onClick={() => setPhase(2)}
                    className={`p-4 rounded-lg border text-left transition-all ${phase === 2 ? 'bg-yellow-900/20 border-yellow-500' : 'bg-slate-900 border-slate-700'}`}
                >
                    <div className="font-bold text-white mb-2">2. Resistance</div>
                    <p className="text-xs text-slate-400">Body adapts to stressor. High arousal maintained. Cortisol release. Cannot be sustained indefinitely.</p>
                </button>

                <button
                    onClick={() => setPhase(3)}
                    className={`p-4 rounded-lg border text-left transition-all ${phase === 3 ? 'bg-slate-800 border-slate-500' : 'bg-slate-900 border-slate-700'}`}
                >
                    <div className="font-bold text-white mb-2">3. Exhaustion</div>
                    <p className="text-xs text-slate-400">Resources depleted. Performance collapses below normal. Burnout, illness, error prone.</p>
                </button>
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

// 040.06 Stress Curve (Updated for Underload/Overload)
const StressCurve = () => {
    const [arousal, setArousal] = useState(50);

    // Yerkes-Dodson Curve approximation
    // Peak at 50. Drops off both sides.
    const performance = -0.04 * Math.pow(arousal - 50, 2) + 100;

    let zone = 'Optimum';
    let color = 'text-emerald-400';
    let symp = 'Peak cognitive function';

    if (arousal < 30) {
        zone = 'Underload (Boredom)';
        color = 'text-blue-400';
        symp = 'Hypovigilance, Complacency, Missed Signals';
    } else if (arousal > 70) {
        zone = 'Overload (Panic)';
        color = 'text-red-400';
        symp = 'Tunnel Vision, Cognitive Shedding, Aggression';
    }

    return (
        <div className="animate-in fade-in">
            <h3 className="text-xl font-bold text-white mb-6">Yerkes-Dodson Law (Performance vs Arousal)</h3>

            <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2 space-y-6">
                    <div>
                        <label className="flex justify-between text-slate-400 text-sm mb-2">
                            <span>Arousal / Stress Level</span>
                            <span className="font-bold text-white">{arousal}%</span>
                        </label>
                        <input
                            type="range" min="0" max="100" step="1"
                            value={arousal} onChange={e => setArousal(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                        />
                    </div>

                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <span className="text-xs text-slate-400 uppercase font-bold">Current State</span>
                        <div className={`text-xl font-black ${color} mb-1`}>{zone}</div>
                        <p className="text-sm text-slate-300 mb-4">{symp}</p>

                        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-300 ${color.replace('text', 'bg').replace('400', '500')}`}
                                style={{ width: `${Math.max(0, performance)}%` }}
                            ></div>
                        </div>
                        <span className="text-xs text-slate-500 mt-1 block">Performance Potential</span>
                    </div>
                </div>

                {/* Graph Visualization */}
                <div className="w-full md:w-1/2 h-64 bg-slate-900 rounded-xl border border-slate-700 relative overflow-hidden flex items-end">
                    {/* The Curve */}
                    <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 pointer-events-none p-4" preserveAspectRatio="none">
                        <path d="M 0 100 Q 50 0 100 100" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
                    </svg>

                    {/* The Indicator */}
                    <div
                        className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_10px_white] transition-all duration-100"
                        style={{
                            left: `${arousal}%`,
                            bottom: `${Math.max(0, performance)}%`,
                            transform: 'translate(-50%, 50%)'
                        }}
                    ></div>

                    <div className="absolute bottom-2 left-2 text-[8px] text-slate-500 uppercase">Underload</div>
                    <div className="absolute bottom-2 right-2 text-[8px] text-slate-500 uppercase">Overload</div>
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[8px] text-slate-500 uppercase">Eustress</div>
                </div>
            </div>

            <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600 text-sm text-slate-300">
                <p><strong>Exam Note:</strong> Stress is not always bad. A moderate amount (Eustress) is required for optimal performance. Too little leads to boredom and missed cues; too much leads to distress and performance collapse.</p>
            </div>
        </div>
    );
};

export default CommunicationAndStress;
