
import React, { useState } from 'react';
import {
    HeartPulse,
    AlertTriangle,
    UserX,
    Wind,
    CheckCircle2,
    Volume2,
    AlertOctagon,
    ChevronRight,
    Stethoscope,
    Zap
} from 'lucide-react';
import { View } from '../../types';

interface Props {
    onNavigate: (view: View) => void;
}

const HPLIncapacitation: React.FC<Props> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'types' | 'procedures' | 'fumes'>('types');

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-900 via-rose-900 to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl border border-red-700/50 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-500/20 rounded-lg backdrop-blur-md border border-red-500/30">
                            <UserX className="text-red-400" size={24} />
                        </div>
                        <span className="text-red-400 font-bold tracking-widest text-xs uppercase">Learning Objective 040.02.03.05</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Incapacitation & Fumes</h1>
                    <p className="text-rose-100/80 max-w-2xl text-lg leading-relaxed">
                        Procedures for handling crew incapacitation, including the "2-Communication Rule" and recognizing subtle fume events.
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex p-1 bg-slate-900/50 rounded-2xl border border-slate-800 backdrop-blur-sm sticky top-24 z-20">
                {[
                    { id: 'types', label: 'Types & Recognition', icon: HeartPulse },
                    { id: 'procedures', label: 'Handling Procedures', icon: CheckCircle2 },
                    { id: 'fumes', label: 'Fume Events', icon: Wind },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 font-bold text-sm ${activeTab === tab.id
                            ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        <tab.icon size={18} />
                        <span className="hidden md:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[500px]">
                {activeTab === 'types' && <RecognitionTab />}
                {activeTab === 'procedures' && <ProceduresTab />}
                {activeTab === 'fumes' && <FumesTab />}
            </div>

            {/* Footer Navigation */}
            <div className="pt-12 border-t border-slate-800 flex justify-between">
                <button
                    onClick={() => onNavigate(View.HPL_HOME)}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                    <div className="rotate-180 group-hover:-translate-x-1 transition-transform">
                        <ChevronRight />
                    </div>
                    Return to HPL Dashboard
                </button>
            </div>
        </div>
    );
};

const RecognitionTab = () => {
    return (
        <div className="grid md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <AlertOctagon size={120} className="text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-6">Sudden vs Insidious</h3>

                <div className="space-y-6 relative z-10">
                    <div className="bg-red-900/10 border border-red-500/20 p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-3">
                            <Zap className="text-red-500" />
                            <h4 className="font-bold text-white text-lg">Sudden Incapacitation</h4>
                        </div>
                        <p className="text-slate-400 text-sm mb-4">
                            Obvious and immediate. Examples include heart attack, seizure, or stroke.
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm text-slate-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                Collapse / Unconsciousness
                            </li>
                            <li className="flex items-center gap-2 text-sm text-slate-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                Severe Pain / Convulsions
                            </li>
                        </ul>
                    </div>

                    <div className="bg-amber-900/10 border border-amber-500/20 p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-3">
                            <UserX className="text-amber-500" />
                            <h4 className="font-bold text-white text-lg">Insidious Incapacitation</h4>
                        </div>
                        <p className="text-slate-400 text-sm mb-4">
                            Dangerous because it is hard to detect. The pilot looks normal but is not functioning.
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm text-slate-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                Hypoxia / CO Poisoning
                            </li>
                            <li className="flex items-center gap-2 text-sm text-slate-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                Fatigue / Microsleeps
                            </li>
                            <li className="flex items-center gap-2 text-sm text-slate-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                Low Blood Sugar (Hypoglycaemia)
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
                <h3 className="text-2xl font-bold text-white mb-6">The "2-Communication Rule"</h3>
                <p className="text-slate-400 mb-8">
                    How do you confirm insidious incapacitation?
                    <br /><br />
                    <span className="text-white italic">"If a crew member does not respond to <strong className="text-rose-400">two</strong> verbal communications, or one verbal and one significant visual/tactile stimulus, assume they are incapacitated."</span>
                </p>

                <div className="bg-slate-800 rounded-2xl p-6 text-center border border-slate-700">
                    <TwoCommsSim />
                </div>
            </div>
        </div>
    );
};

const TwoCommsSim = () => {
    const [step, setStep] = useState(0);

    // 0: Start
    // 1: First Call (No response)
    // 2: Second Call (No response)
    // 3: Shake/Touch (No response)
    // 4: Assumption Made

    const reset = () => setStep(0);

    return (
        <div className="space-y-4">
            <h4 className="font-bold text-white text-lg mb-4">Simulation</h4>

            <div className={`h-32 flex items-center justify-center rounded-xl border-2 transition-all duration-500 ${step === 4 ? 'bg-red-500/20 border-red-500' : 'bg-slate-900 border-slate-600'}`}>
                {step === 0 && <span className="text-slate-400">Pilot Flying looks fixated...</span>}
                {step === 1 && <span className="text-slate-300 animate-pulse">"Speed check?" ... (Silence)</span>}
                {step === 2 && <span className="text-amber-400 animate-pulse">"HEY! SPEED CHECK!" ... (Silence)</span>}
                {step === 3 && <span className="text-orange-500 font-bold animate-bounce">SHAKING SHOULDER ... (No Reaction)</span>}
                {step === 4 && <span className="text-red-500 font-black text-2xl animate-pulse">I HAVE CONTROL!</span>}
            </div>

            <div className="grid grid-cols-1 gap-2">
                {step === 0 && (
                    <button onClick={() => setStep(1)} className="p-3 bg-slate-700 rounded-lg text-white font-bold hover:bg-slate-600">
                        1. Ask Standard Callout
                    </button>
                )}
                {step === 1 && (
                    <button onClick={() => setStep(2)} className="p-3 bg-amber-700 rounded-lg text-white font-bold hover:bg-amber-600">
                        2. Repeat Loudly
                    </button>
                )}
                {step === 2 && (
                    <button onClick={() => setStep(3)} className="p-3 bg-orange-700 rounded-lg text-white font-bold hover:bg-orange-600">
                        3. Shake Shoulder
                    </button>
                )}
                {step === 3 && (
                    <button onClick={() => setStep(4)} className="p-3 bg-red-600 rounded-lg text-white font-bold hover:bg-red-500 shadow-lg shadow-red-900/50">
                        4. ASSUME CONTROL
                    </button>
                )}
                {step === 4 && (
                    <button onClick={reset} className="p-3 bg-slate-700 rounded-lg text-slate-300 text-sm hover:bg-slate-600">
                        Reset Scenario
                    </button>
                )}
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase font-bold mt-4">
                <span className={step >= 1 ? 'text-rose-500' : ''}>Trigger 1</span>
                <span className={step >= 2 ? 'text-rose-500' : ''}>Trigger 2</span>
                <span className={step >= 3 ? 'text-rose-500' : ''}>Action</span>
            </div>
        </div>
    );
};

const ProceduresTab = () => {
    return (
        <div className="grid md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-6">
                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <CheckCircle2 className="text-emerald-500" />
                        In-Flight Procedures
                    </h3>

                    <div className="space-y-4">
                        {[
                            { title: "1. Take Control", desc: "State 'I HAVE CONTROL'. Press AP disconnect button to ensure you are the master.", critical: true },
                            { title: "2. Ensure Safety", desc: "Fly the aircraft. Engage autopilot if appropriate. Move incapacitated pilot away from controls (slide seat back).", critical: true },
                            { title: "3. Secure Cockpit", desc: "Lock shoulder harness (inertial reel) to prevent them falling onto yoke/stick.", critical: false },
                            { title: "4. Call for Help", desc: "Senior Cabin Crew member to flight deck. Can apply First Aid / Oxygen.", critical: false },
                            { title: "5. Plan", desc: "Declare Emergency (Mayday). Land ASAP. Request Medical Assistance on arrival.", critical: false }
                        ].map((step, i) => (
                            <div key={i} className={`p-4 rounded-xl border ${step.critical ? 'bg-rose-900/10 border-rose-500/30' : 'bg-slate-800 border-slate-700'}`}>
                                <div className="flex justify-between mb-1">
                                    <h4 className={`font-bold ${step.critical ? 'text-rose-400' : 'text-slate-200'}`}>{step.title}</h4>
                                    {step.critical && <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">CRITICAL</span>}
                                </div>
                                <p className="text-sm text-slate-400">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
                    <h3 className="text-2xl font-bold text-white mb-6">Prevention: One-Stomach Rule</h3>

                    <div className="flex flex-col items-center justify-center gap-6 py-6">
                        <div className="flex gap-8">
                            <div className="text-center">
                                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-600 mb-2">
                                    <span className="text-2xl">🍗</span>
                                </div>
                                <p className="text-white font-bold">Captain</p>
                                <p className="text-xs text-slate-400">Chicken Meal</p>
                            </div>

                            <div className="h-24 w-[2px] bg-slate-700"></div>

                            <div className="text-center">
                                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-600 mb-2">
                                    <span className="text-2xl">🐟</span>
                                </div>
                                <p className="text-white font-bold">First Officer</p>
                                <p className="text-xs text-slate-400">Fish Meal</p>
                            </div>
                        </div>

                        <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-xl text-center w-full">
                            <h4 className="text-emerald-400 font-bold mb-1">Why?</h4>
                            <p className="text-xs text-slate-300">
                                To prevent simultaneous incapacitation from food poisoning.
                                Meals should be consumed at different times (e.g. 1 hour apart) if possible.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
                    <h3 className="text-xl font-bold text-white mb-4">Gastrointestinal Incapacitation</h3>
                    <p className="text-sm text-slate-400">
                        Gastroenteritis is the most common cause of pilot incapacitation (~50% of cases).
                    </p>
                </div>
            </div>
        </div>
    );
};

const FumesTab = () => {
    return (
        <div className="grid md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Wind className="text-slate-400" />
                    Fume Events (Toxic Air)
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                    Bleed air from engines can be contaminated by pyrolyzed oil/hydraulic fluid. This contains organophosphates (nervous system toxins).
                </p>

                <div className="space-y-4">
                    <div className="bg-slate-800 p-4 rounded-xl border-l-4 border-amber-500">
                        <h4 className="font-bold text-white mb-2">Olfactory Recognition</h4>
                        <p className="text-sm text-slate-300 mb-3">Often described as:</p>
                        <div className="flex gap-2 flex-wrap">
                            <span className="px-3 py-1 bg-slate-700 rounded-lg text-xs font-bold text-amber-200">Wet Dog</span>
                            <span className="px-3 py-1 bg-slate-700 rounded-lg text-xs font-bold text-amber-200">Old Socks</span>
                            <span className="px-3 py-1 bg-slate-700 rounded-lg text-xs font-bold text-amber-200">Acrid / Metallic</span>
                        </div>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-xl border-l-4 border-red-500">
                        <h4 className="font-bold text-white mb-2">Symptoms (Aerotoxic Syndrome)</h4>
                        <ul className="grid grid-cols-2 gap-2 text-xs text-slate-400 list-disc pl-4">
                            <li>Eye/Nose Irritation</li>
                            <li>Dizziness / Nausea</li>
                            <li>Blurred Vision</li>
                            <li>Tremors</li>
                            <li>Poor Concentration</li>
                            <li>Memory Impairment</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <AlertTriangle className="text-red-500" />
                    Immediate Actions
                </h3>

                <div className="relative">
                    <div className="absolute left-6 top-6 bottom-6 w-1 bg-slate-700 -z-10"></div>

                    <div className="space-y-6">
                        <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center font-black text-white shrink-0 shadow-lg shadow-red-900/50">1</div>
                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex-1">
                                <h4 className="font-bold text-white">DON OXYGEN MASKS</h4>
                                <p className="text-xs text-rose-400 font-bold">100% / EMERGENCY Setting</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-black text-white shrink-0">2</div>
                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex-1">
                                <h4 className="font-bold text-white">ESTABLISH COMMS</h4>
                                <p className="text-xs text-slate-400">Through mask microphone</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-black text-white shrink-0">3</div>
                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex-1">
                                <h4 className="font-bold text-white">SMOKE/FUME CHECKLIST</h4>
                                <p className="text-xs text-slate-400">Isolate bleed source</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-black text-white shrink-0">4</div>
                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex-1">
                                <h4 className="font-bold text-white">LAND ASAP</h4>
                                <p className="text-xs text-slate-400">Do not persist with toxic air</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HPLIncapacitation;
