import React, { useState } from 'react';
import {
    MessageCircle,
    Users,
    Zap,
    ShieldAlert,
    CheckCircle2,
    XCircle,
    RotateCcw,
    ChevronRight,
    Brain,
    Headset,
    AlertTriangle
} from 'lucide-react';

interface Scenario {
    id: number;
    title: string;
    context: string;
    options: {
        text: string;
        quality: 'EXCELLENT' | 'GOOD' | 'POOR';
        explanation: string;
    }[];
}

const CRM_SCENARIOS: Scenario[] = [
    {
        id: 1,
        title: 'Authority Gradient',
        context: 'You are the Co-pilot (PM). The Captain, who is very senior, omits a checklist item during the descent. You notice it, but they seem focused on a complex approach transition.',
        options: [
            {
                text: 'Wait until the end of the descent and mention it casually.',
                quality: 'POOR',
                explanation: 'A safety omission must be addressed immediately. Waiting increases risk and creates a bad precedent for authority gradients.'
            },
            {
                text: 'Intervene using the PACE model: "Captain, I noticed the Landing Gear Lever is still UP. Should we perform the Landing Checklist now?"',
                quality: 'EXCELLENT',
                explanation: 'Excellent. Uses professional communication (PACE) to address a specific safety item while maintaining a shared mental model.'
            },
            {
                text: 'Silently reach over and perform the checklist item yourself.',
                quality: 'POOR',
                explanation: 'Silent correction destroys crew coordination. The Captain (PF) must know the state of the aircraft at all times.'
            }
        ]
    },
    {
        id: 2,
        title: 'Workload Sharing',
        context: 'Heavy rain, moderate turbulence, and busy ATC. The Captain (PF) is becoming visibly stressed and falling behind the aircraft. You are managing the Radios.',
        options: [
            {
                text: 'Offer specific assistance: "Captain, would you like me to handle the FMS programming while you focus on flying?"',
                quality: 'EXCELLENT',
                explanation: 'Specific offers of assistance are better than vague questions. It helps redistribute workload and supports the Pilot Flying.'
            },
            {
                text: 'Take over the controls immediately: "My aircraft."',
                quality: 'POOR',
                explanation: 'Sudden, unbriefed transfer of control in a stressful situation can cause confusion. Only take control if safety is immediately compromised.'
            },
            {
                text: 'Continue with your duties only and wait for instructions.',
                quality: 'GOOD',
                explanation: 'Acceptable but not proactive. CRM requires active monitoring and supporting the other crew member when their capacity is saturated.'
            }
        ]
    }
];

const CRMScenarios: React.FC = () => {
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [choice, setChoice] = useState<number | null>(null);
    const [score, setScore] = useState(0);

    const activeScenario = selectedIdx !== null ? CRM_SCENARIOS[selectedIdx] : null;

    const handleChoice = (idx: number) => {
        setChoice(idx);
        if (activeScenario?.options[idx].quality === 'EXCELLENT') {
            setScore(s => s + 10);
        } else if (activeScenario?.options[idx].quality === 'GOOD') {
            setScore(s => s + 5);
        }
    };

    const next = () => {
        if (selectedIdx !== null && selectedIdx < CRM_SCENARIOS.length - 1) {
            setSelectedIdx(selectedIdx + 1);
            setChoice(null);
        } else {
            setSelectedIdx(null);
            setChoice(null);
        }
    };

    if (selectedIdx === null) {
        return (
            <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                        <Users size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">
                            CRM <span className="text-purple-400">Scenarios</span>
                        </h1>
                        <p className="text-slate-400 mt-1">Crew Resource Management interactive situational training.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {CRM_SCENARIOS.map((s, idx) => (
                        <button
                            key={s.id}
                            onClick={() => setSelectedIdx(idx)}
                            className="bg-slate-800/50 border border-white/10 p-6 rounded-2xl text-left hover:border-purple-500/50 transition-all hover:bg-slate-800 group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{s.title}</h3>
                                <Zap className="text-slate-600 group-hover:text-purple-500 transition-colors" size={20} />
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{s.context}</p>
                            <div className="mt-6 flex items-center text-purple-400 font-bold text-xs uppercase tracking-widest">
                                Analyze Scenario <ChevronRight size={14} />
                            </div>
                        </button>
                    ))}
                </div>

                <div className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl mt-8 flex gap-6 items-start">
                    <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400">
                        <Brain size={24} />
                    </div>
                    <div>
                        <h2 className="text-white font-bold mb-2">CRM: The Non-Technical Skill</h2>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            KSA 100 emphasizes that a pilot's ability to communicate, lead, and work within a team is just as important as technical handling. These scenarios test your ability to balance safety, authority, and crew coordination.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (activeScenario && (
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 h-full flex flex-col">
            <div className="flex justify-between items-center">
                <button onClick={() => setSelectedIdx(null)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold">
                    <RotateCcw size={16} /> Exit Scenarios
                </button>
                <div className="px-4 py-1.5 bg-slate-800 border border-white/10 rounded-full text-xs font-mono text-slate-400 uppercase tracking-widest">
                    Performance Score: <span className="text-purple-400">{score}</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-8">
                {/* Context Card */}
                <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="bg-purple-600 px-8 py-4 flex items-center gap-3">
                        <Headset className="text-white" size={20} />
                        <h3 className="text-white font-black tracking-tight uppercase">Operational Situation</h3>
                    </div>
                    <div className="p-8">
                        <p className="text-xl text-slate-200 leading-relaxed font-medium italic">
                            "{activeScenario.context}"
                        </p>
                    </div>
                </div>

                {/* Choices */}
                <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest px-4">What is your next action?</h4>
                    <div className="grid gap-4">
                        {activeScenario.options.map((option, idx) => (
                            <button
                                key={idx}
                                disabled={choice !== null}
                                onClick={() => handleChoice(idx)}
                                className={`w-full p-6 rounded-2xl border text-left transition-all ${choice === null
                                        ? 'bg-slate-800/50 border-white/5 hover:border-purple-500/50 hover:bg-slate-800'
                                        : choice === idx
                                            ? option.quality === 'EXCELLENT'
                                                ? 'bg-emerald-500/10 border-emerald-500/50 ring-2 ring-emerald-500/20'
                                                : option.quality === 'GOOD'
                                                    ? 'bg-amber-500/10 border-amber-500/50'
                                                    : 'bg-red-500/10 border-red-500/50'
                                            : 'opacity-50 grayscale'
                                    }`}
                            >
                                <div className="flex gap-4">
                                    <div className="mt-1">
                                        {choice === idx ? (
                                            option.quality === 'EXCELLENT' ? <CheckCircle2 className="text-emerald-400" /> : <AlertTriangle className="text-amber-400" />
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border border-slate-600" />
                                        )}
                                    </div>
                                    <span className={`font-bold ${choice === idx ? 'text-white' : 'text-slate-300'}`}>{option.text}</span>
                                </div>
                                {choice === idx && (
                                    <div className="mt-4 pt-4 border-t border-white/5 text-sm text-slate-400 leading-relaxed animate-in slide-in-from-top-2">
                                        <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${option.quality === 'EXCELLENT' ? 'text-emerald-400' : option.quality === 'GOOD' ? 'text-amber-400' : 'text-red-400'
                                            }`}>
                                            CRM Assessment: {option.quality}
                                        </div>
                                        {option.explanation}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {choice !== null && (
                <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <button
                        onClick={next}
                        className="px-10 py-4 bg-white text-slate-900 hover:bg-purple-400 transition-all rounded-2xl font-black shadow-xl flex items-center gap-2"
                    >
                        {selectedIdx === CRM_SCENARIOS.length - 1 ? 'End Training' : 'Proceed to Next Case'}
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </div>
    ));
};

export default CRMScenarios;
