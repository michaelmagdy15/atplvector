
import React, { useState } from 'react';
import { AlertOctagon, GitMerge, CheckSquare, RefreshCcw, Activity } from 'lucide-react';

const ErrorAndDecision: React.FC = () => {
    const [tab, setTab] = useState<'error' | 'fordec'>('error');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <GitMerge className="text-orange-400" />
                        Error & Decision (040.03)
                    </h2>
                    <p className="text-slate-400 text-sm">Human Error Theory and Decision Making Models.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setTab('error')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'error' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}>Error Models</button>
                    <button onClick={() => setTab('fordec')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'fordec' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}>FOR-DEC</button>
                </div>
            </div>

            {tab === 'error' && <ErrorTheory />}
            {tab === 'fordec' && <FordecSim />}
        </div>
    );
};

// 040.03.02 Error Generation
const ErrorTheory = () => {
    return (
        <div className="animate-in fade-in">
            <h3 className="text-xl font-bold text-white mb-6">Classifying Human Error</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <h4 className="font-bold text-white mb-2">Unintentional Errors</h4>
                        <div className="space-y-3">
                            <div className="bg-slate-800 p-3 rounded border-l-4 border-blue-500">
                                <span className="font-bold text-blue-400 block text-sm">SLIP</span>
                                <span className="text-xs text-slate-300">Action not as planned. "Finger trouble". Good intention, bad execution. (Skill-based).</span>
                            </div>
                            <div className="bg-slate-800 p-3 rounded border-l-4 border-indigo-500">
                                <span className="font-bold text-indigo-400 block text-sm">LAPSE</span>
                                <span className="text-xs text-slate-300">Memory failure. Forgetting a checklist item. (Skill/Rule-based).</span>
                            </div>
                            <div className="bg-slate-800 p-3 rounded border-l-4 border-purple-500">
                                <span className="font-bold text-purple-400 block text-sm">MISTAKE</span>
                                <span className="text-xs text-slate-300">Plan was wrong. Knowledge failure. Doing the wrong thing, but believing it is right. (Knowledge-based).</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <h4 className="font-bold text-white mb-2">Intentional Non-Compliance</h4>
                        <div className="bg-slate-800 p-3 rounded border-l-4 border-red-500">
                            <span className="font-bold text-red-400 block text-sm">VIOLATION</span>
                            <span className="text-xs text-slate-300">Deliberate deviation from rules/SOPs. Routine (Shortcuts) vs Exceptional.</span>
                        </div>
                    </div>
                </div>

                {/* Error Chain Visualizer */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col items-center">
                    <h4 className="font-bold text-white mb-6">The Error Chain</h4>
                    <div className="flex flex-col gap-2 items-center relative">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-48 p-3 bg-slate-800 rounded border border-slate-600 text-center text-xs font-bold text-slate-400 relative group">
                                Event {i}
                                {i < 4 && <div className="absolute h-4 w-1 bg-slate-600 left-1/2 -bottom-4"></div>}
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-red-600 text-white px-2 py-1 rounded text-[10px] transition-opacity">
                                    BREAK
                                </button>
                            </div>
                        ))}
                        <div className="w-48 p-4 bg-red-900/50 border-2 border-red-500 rounded text-center text-red-400 font-black animate-pulse mt-2">
                            ACCIDENT
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-6 text-center">
                        Accidents are rarely single events. Breaking just <strong>one link</strong> in the chain can prevent the accident.
                    </p>
                </div>
            </div>
        </div>
    );
};

// 040.03.03 Decision Making
const FordecSim = () => {
    const [step, setStep] = useState(0);
    const steps = [
        { id: 'F', label: 'Facts', desc: 'What is the problem? Gather info.', example: 'Engine fire indication. Vibration.' },
        { id: 'O', label: 'Options', desc: 'What can we do?', example: 'Return, Divert, Continue (unlikely).' },
        { id: 'R', label: 'Risks', desc: 'Assess pros/cons of each option.', example: 'Return: Quickest but heavy. Divert: Longer. Terrain?' },
        { id: 'D', label: 'Decide', desc: 'Choose the best option.', example: 'Decision: Return to base.' },
        { id: 'E', label: 'Execute', desc: 'Do it. Assign tasks.', example: 'PF flies, PM runs checklist/comms.' },
        { id: 'C', label: 'Check', desc: 'Review. Is it working?', example: 'Is fire out? Are we on profile?' }
    ];

    return (
        <div className="animate-in slide-in-from-right-4">
            <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-white">Structured Decision Making (FOR-DEC)</h3>
                <p className="text-sm text-slate-400">Standard model for non-normal situations.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-8">
                {steps.map((s, i) => (
                    <button 
                        key={s.id}
                        onClick={() => setStep(i)}
                        className={`p-3 rounded-lg border-b-4 transition-all ${step === i ? 'bg-orange-600 border-orange-800 text-white transform -translate-y-1' : 'bg-slate-800 border-slate-900 text-slate-500 hover:bg-slate-700'}`}
                    >
                        <span className="text-2xl font-black block">{s.id}</span>
                        <span className="text-[10px] font-bold uppercase">{s.label}</span>
                    </button>
                ))}
            </div>

            <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 text-center min-h-[200px] flex flex-col justify-center items-center">
                <div className="bg-orange-500/20 text-orange-400 p-4 rounded-full mb-4">
                    {step === 0 && <Activity size={32} />}
                    {step === 1 && <GitMerge size={32} />}
                    {step === 2 && <AlertOctagon size={32} />}
                    {step === 3 && <CheckSquare size={32} />}
                    {step === 4 && <Activity size={32} />}
                    {step === 5 && <RefreshCcw size={32} />}
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">{steps[step].label}</h4>
                <p className="text-lg text-slate-300 mb-4">{steps[step].desc}</p>
                <div className="bg-slate-800 p-4 rounded border border-slate-600 text-sm text-slate-400 w-full max-w-lg">
                    <strong>Example:</strong> {steps[step].example}
                </div>
            </div>
        </div>
    );
};

export default ErrorAndDecision;
