
import React, { useState } from 'react';
import { Shield, AlertTriangle, Activity, PieChart, Layers, CheckCircle, Brain, Users } from 'lucide-react';

const HumanFactorsIntro: React.FC = () => {
    const [tab, setTab] = useState<'stats' | 'tem' | 'culture'>('stats');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Shield className="text-emerald-400" />
                        Human Factors: Basic Concepts (040.01)
                    </h2>
                    <p className="text-slate-400 text-sm">Accident statistics, SHELL model, TEM, and Safety Culture.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setTab('stats')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'stats' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>Statistics</button>
                    <button onClick={() => setTab('tem')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'tem' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>TEM Model</button>
                    <button onClick={() => setTab('culture')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'culture' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>Safety Culture</button>
                </div>
            </div>

            {tab === 'stats' && <AccidentStats />}
            {tab === 'tem' && <TEMModel />}
            {tab === 'culture' && <SafetyCulture />}
        </div>
    );
};

// 040.01.02 Accident Statistics
const AccidentStats = () => (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <PieChart className="text-sky-400" /> Causes of Accidents
            </h3>
            
            <div className="relative h-64 w-64 mx-auto mb-6">
                {/* Simulated Pie Chart */}
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {/* Human Error: ~70-80% */}
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="20" strokeDasharray="210 251" />
                    {/* Technical: ~15-20% */}
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="20" strokeDasharray="40 251" strokeDashoffset="-210" />
                    {/* Other: ~5-10% */}
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#64748b" strokeWidth="20" strokeDasharray="10 251" strokeDashoffset="-250" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-black text-white">~75%</span>
                    <span className="text-xs text-emerald-400 font-bold uppercase">Human Factors</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-emerald-900/20 rounded border border-emerald-500/50 text-emerald-400 font-bold">Human Error (70-80%)</div>
                <div className="p-2 bg-amber-900/20 rounded border border-amber-500/50 text-amber-400 font-bold">Technical (15-20%)</div>
                <div className="p-2 bg-slate-800 rounded border border-slate-600 text-slate-400 font-bold">Weather/Other</div>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                <h4 className="font-bold text-white mb-2">Trend Analysis</h4>
                <p className="text-sm text-slate-300">
                    While technical reliability has improved drastically (jet engines, avionics), the human component remains the "weakest link" but also the most flexible safety net.
                </p>
                <div className="mt-4 bg-slate-800 p-3 rounded text-xs text-slate-400 italic">
                    "Aviation is the safest mode of mass transport, yet human error remains the primary cause of the few accidents that do occur."
                </div>
            </div>

            <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                <h4 className="font-bold text-white mb-2">Approach & Landing</h4>
                <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden mb-2">
                    <div className="bg-red-500 h-full w-[50%] animate-pulse"></div>
                </div>
                <p className="text-xs text-slate-300">
                    Approx <strong>50% of accidents</strong> occur during the Approach & Landing phase, despite it representing only ~4% of flight time.
                </p>
            </div>
        </div>
    </div>
);

// 040.01.03 Flight Safety Concepts (TEM)
const TEMModel = () => {
    const [step, setStep] = useState(0);

    return (
        <div className="animate-in slide-in-from-right-4">
            <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-white">Threat & Error Management (TEM)</h3>
                <p className="text-sm text-slate-400">The modern framework for flight safety.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-8">
                <button onClick={() => setStep(0)} className={`p-6 rounded-xl border-2 w-full md:w-1/3 transition-all ${step >= 0 ? 'bg-orange-900/20 border-orange-500 text-orange-400' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                    <AlertTriangle className="mx-auto mb-2" />
                    <div className="font-bold text-lg">1. THREAT</div>
                    <div className="text-xs mt-1">External / Internal</div>
                </button>
                <div className="text-slate-500">→</div>
                <button onClick={() => setStep(1)} className={`p-6 rounded-xl border-2 w-full md:w-1/3 transition-all ${step >= 1 ? 'bg-red-900/20 border-red-500 text-red-400' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                    <Activity className="mx-auto mb-2" />
                    <div className="font-bold text-lg">2. ERROR</div>
                    <div className="text-xs mt-1">Action / Inaction</div>
                </button>
                <div className="text-slate-500">→</div>
                <button onClick={() => setStep(2)} className={`p-6 rounded-xl border-2 w-full md:w-1/3 transition-all ${step >= 2 ? 'bg-purple-900/20 border-purple-500 text-purple-400' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                    <Shield className="mx-auto mb-2" />
                    <div className="font-bold text-lg">3. UAS</div>
                    <div className="text-xs mt-1">Undesired Aircraft State</div>
                </button>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 min-h-[150px] flex flex-col justify-center text-center">
                {step === 0 && (
                    <div className="animate-in fade-in">
                        <h4 className="text-orange-400 font-bold mb-2">Threats</h4>
                        <p className="text-slate-300 text-sm mb-4">Events or errors that occur beyond the influence of the flight crew, increase operational complexity, and must be managed.</p>
                        <div className="flex justify-center gap-4 text-xs font-bold">
                            <span className="bg-slate-800 px-3 py-1 rounded text-white">Weather</span>
                            <span className="bg-slate-800 px-3 py-1 rounded text-white">ATC Error</span>
                            <span className="bg-slate-800 px-3 py-1 rounded text-white">System Malfunction</span>
                            <span className="bg-slate-800 px-3 py-1 rounded text-white">Time Pressure</span>
                        </div>
                    </div>
                )}
                {step === 1 && (
                    <div className="animate-in fade-in">
                        <h4 className="text-red-400 font-bold mb-2">Errors</h4>
                        <p className="text-slate-300 text-sm mb-4">Actions or inactions by the flight crew that lead to deviations from organizational or flight intentions.</p>
                        <div className="flex justify-center gap-4 text-xs font-bold">
                            <span className="bg-slate-800 px-3 py-1 rounded text-white">Slip (Action)</span>
                            <span className="bg-slate-800 px-3 py-1 rounded text-white">Lapse (Memory)</span>
                            <span className="bg-slate-800 px-3 py-1 rounded text-white">Mistake (Knowledge)</span>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div className="animate-in fade-in">
                        <h4 className="text-purple-400 font-bold mb-2">Undesired Aircraft State (UAS)</h4>
                        <p className="text-slate-300 text-sm mb-4">A position, speed, attitude or configuration of an aircraft that results from ineffective error management.</p>
                        <div className="flex justify-center gap-4 text-xs font-bold">
                            <span className="bg-slate-800 px-3 py-1 rounded text-white">Unstable Approach</span>
                            <span className="bg-slate-800 px-3 py-1 rounded text-white">Altitude Deviation</span>
                            <span className="bg-slate-800 px-3 py-1 rounded text-white">Runway Incursion</span>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="flex justify-center mt-6">
                <button onClick={() => setStep((prev) => (prev + 1) % 3)} className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500 transition">
                    Next Step
                </button>
            </div>
        </div>
    );
};

// 040.01.04 Safety Culture
const SafetyCulture = () => {
    const [holes, setHoles] = useState([false, false, false]); // Align state

    const toggleHole = (idx: number) => {
        const newHoles = [...holes];
        newHoles[idx] = !newHoles[idx];
        setHoles(newHoles);
    };

    const isAccident = holes.every(h => h === true);

    return (
        <div className="animate-in slide-in-from-left-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">James Reason's Swiss Cheese Model</h3>
            
            <div className="relative h-64 bg-slate-900 rounded-xl border border-slate-700 mb-8 flex items-center justify-between px-8 overflow-hidden">
                {/* Hazard */}
                <div className="z-10 flex flex-col items-center">
                    <div className="w-12 h-12 bg-red-500 rounded-full animate-ping absolute opacity-20"></div>
                    <AlertTriangle className="text-red-500 w-12 h-12 relative z-10" />
                    <span className="text-xs font-bold text-red-500 mt-2">HAZARD</span>
                </div>

                {/* Laser Line */}
                <div className={`absolute left-16 right-16 h-1 transition-colors duration-300 z-0 ${isAccident ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-slate-700'}`}></div>

                {/* Slices */}
                {['Organization', 'Supervision', 'Preconditions', 'Acts'].map((label, idx) => {
                    if (idx > 2) return null; // Simplified to 3 layers for visual clarity
                    const isOpen = holes[idx];
                    return (
                        <div 
                            key={idx}
                            onClick={() => toggleHole(idx)}
                            className={`
                                relative z-10 w-4 h-40 rounded cursor-pointer transition-all duration-500 flex flex-col items-center justify-center
                                ${isOpen ? 'bg-slate-700 border-2 border-dashed border-slate-500' : 'bg-yellow-500 border-2 border-yellow-400 shadow-lg'}
                            `}
                        >
                            {isOpen && <div className="w-6 h-6 rounded-full bg-slate-900"></div>}
                            <span className="absolute -bottom-8 text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap">{label}</span>
                        </div>
                    );
                })}

                {/* Accident */}
                <div className="z-10 flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isAccident ? 'bg-red-600 text-white scale-110' : 'bg-slate-800 text-slate-600'}`}>
                        <Activity />
                    </div>
                    <span className={`text-xs font-bold mt-2 ${isAccident ? 'text-red-500' : 'text-slate-600'}`}>ACCIDENT</span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h4 className="font-bold text-emerald-400 mb-2">Just Culture</h4>
                    <p className="text-sm text-slate-300">
                        An atmosphere of trust where people are encouraged to provide essential safety-related information, but where they are also clear about where the line must be drawn between acceptable and unacceptable behavior.
                    </p>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h4 className="font-bold text-sky-400 mb-2">Latent vs Active Failures</h4>
                    <ul className="text-xs text-slate-300 space-y-1">
                        <li><strong className="text-white">Active:</strong> Unsafe acts committed by people in direct contact with the system (Pilots).</li>
                        <li><strong className="text-white">Latent:</strong> Inevitable "resident pathogens" within the system (Management, Design).</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default HumanFactorsIntro;
