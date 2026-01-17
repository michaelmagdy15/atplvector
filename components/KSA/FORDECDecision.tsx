import React, { useState } from 'react';
import {
    Brain,
    ChevronRight,
    AlertTriangle,
    CheckCircle2,
    Info,
    ListChecks,
    ShieldAlert,
    Play,
    RotateCcw,
    Activity
} from 'lucide-react';

interface Stage {
    id: 'FACTS' | 'OPTIONS' | 'RISKS' | 'DECISION' | 'EXECUTION' | 'CHECK';
    label: string;
    description: string;
    icon: any;
    color: string;
    questions: string[];
}

const STAGES: Stage[] = [
    {
        id: 'FACTS',
        label: 'Facts',
        description: 'Gather all available information. Avoid assumptions.',
        icon: Info,
        color: 'text-blue-400',
        questions: [
            'What is the current status?',
            'How much fuel is onboard?',
            'What is the weather at destination/alternate?',
            'Are there any technical failures?'
        ]
    },
    {
        id: 'OPTIONS',
        label: 'Options',
        description: 'Generate available courses of action.',
        icon: ListChecks,
        color: 'text-purple-400',
        questions: [
            'Can we continue to destination?',
            'Should we divert to the nearest suitable airport?',
            'Can we hold and wait for improvement?',
            'Is there a better alternate available?'
        ]
    },
    {
        id: 'RISKS',
        label: 'Risks',
        description: 'Evaluate the pros and cons of each option.',
        icon: AlertTriangle,
        color: 'text-amber-400',
        questions: [
            'What are the weather risks at each option?',
            'What is the fuel margin for each option?',
            'Is there any performance/NOTAM risk?',
            'What is the impact on the schedule/passengers?'
        ]
    },
    {
        id: 'DECISION',
        label: 'Decision',
        description: 'Select the best course of action.',
        icon: CheckCircle2,
        color: 'text-emerald-400',
        questions: [
            'Which option provides the highest safety margin?',
            'Is the crew in agreement?',
            'Has the decision been clearly communicated?'
        ]
    },
    {
        id: 'EXECUTION',
        label: 'Execution',
        description: 'Implement the plan.',
        icon: Activity,
        color: 'text-indigo-400',
        questions: [
            'Who is flying (PF) and who is monitoring (PM)?',
            'What are the specific tasks to be performed?',
            'Have ATC and the cabin crew been briefed?'
        ]
    },
    {
        id: 'CHECK',
        label: 'Check',
        description: 'Monitor the outcome and revisit if necessary.',
        icon: RotateCcw,
        color: 'text-pink-400',
        questions: [
            'Is the plan working as expected?',
            'Has anything changed (weather, fuel, technical)?',
            'Do we need to restart the process?'
        ]
    }
];

const SCENARIOS = [
    {
        id: 1,
        title: 'Electrical Smoke in Cabin',
        context: 'You are 150 NM from your destination at FL350. The cabin crew reports a faint smell of electrical smoke in the rear galley. No circuit breakers have tripped yet.',
        startingFacts: [
            'Position: 150NM from EHAM',
            'Altitude: FL350',
            'Fuel: 4500kg (Reserve 2200kg)',
            'Weather: EHAM 240/15 8000 -RA BKN012',
            'Alternate: EBBR (80NM south) 250/10 9999 FEW030'
        ]
    },
    {
        id: 2,
        title: 'Passenger Medical Emergency',
        context: 'Mid-Atlantic, 3 hours from land. A passenger has collapsed with symptoms of a stroke. There is a doctor on board providing assistance.',
        startingFacts: [
            'Position: NAT Track A, POS MARIT',
            'ETOPS Status: OK',
            'Nearest Diversion: CYQX (3.5 hours away)',
            'Turn back: 3 hours back to Lajes'
        ]
    }
];

const FORDECDecision: React.FC = () => {
    const [currentScenario, setCurrentScenario] = useState<any>(null);
    const [activeStageIdx, setActiveStageIdx] = useState(0);
    const [inputs, setInputs] = useState<Record<string, string>>({});

    const handleNext = () => {
        if (activeStageIdx < STAGES.length - 1) {
            setActiveStageIdx(activeStageIdx + 1);
        }
    };

    const handlePrev = () => {
        if (activeStageIdx > 0) {
            setActiveStageIdx(activeStageIdx - 1);
        }
    };

    const reset = () => {
        setCurrentScenario(null);
        setActiveStageIdx(0);
        setInputs({});
    };

    if (!currentScenario) {
        return (
            <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
                        <Brain size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">
                            FOR-DEC <span className="text-indigo-400">Decision Model</span>
                        </h1>
                        <p className="text-slate-400 mt-1">Practice the standard EASA decision-making framework.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {SCENARIOS.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setCurrentScenario(s)}
                            className="bg-slate-800/50 border border-white/10 p-6 rounded-2xl text-left hover:border-indigo-500/50 transition-all hover:bg-slate-800"
                        >
                            <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{s.context}</p>
                            <div className="mt-4 flex items-center text-indigo-400 font-bold text-sm uppercase tracking-wider">
                                Start Scenario <ChevronRight size={16} />
                            </div>
                        </button>
                    ))}
                </div>

                <div className="bg-slate-900/50 border border-white/5 p-6 rounded-3xl mt-8">
                    <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Info size={18} className="text-indigo-400" />
                        What is FOR-DEC?
                    </h2>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        FOR-DEC is a structured decision-making tool used in aviation to manage complex and time-critical situations. It helps crews avoid "confirmation bias" and "tunnel vision" by ensuring all facts and options are considered before a decision is reached.
                    </p>
                </div>
            </div>
        );
    }

    const currentStage = STAGES[activeStageIdx];

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header & Scenario Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={reset} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors">
                        <RotateCcw size={20} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{currentScenario.title}</h2>
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase mt-1">
                            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded">Training Mode</span>
                            <span>FOR-DEC Framework</span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-2">
                    {STAGES.map((s, idx) => (
                        <div
                            key={s.id}
                            className={`h-1.5 w-8 rounded-full transition-all duration-300 ${idx <= activeStageIdx ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-800'
                                }`}
                        />
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Facts Box */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-slate-950 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Info size={14} /> Initial Facts
                        </h3>
                        <div className="space-y-3">
                            {currentScenario.startingFacts.map((f: string, i: number) => (
                                <div key={i} className="text-sm text-slate-300 border-l-2 border-slate-700 pl-3 py-1">
                                    {f}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">Stage Guidance</h3>
                        <p className="text-xs text-indigo-200/70 leading-relaxed">
                            {currentStage.description}
                        </p>
                    </div>
                </div>

                {/* Right: Active Stage Work Area */}
                <div className="lg:col-span-8">
                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden h-full min-h-[500px] flex flex-col">
                        <div className="flex items-center gap-4 mb-8">
                            <div className={`p-4 rounded-2xl bg-white/5 border border-white/10`}>
                                <currentStage.icon className={`w-10 h-10 ${currentStage.color}`} />
                            </div>
                            <div>
                                <span className={`text-xs font-black uppercase tracking-widest ${currentStage.color}`}>Step {activeStageIdx + 1}</span>
                                <h3 className="text-4xl font-black text-white leading-none">{currentStage.label.toUpperCase()}</h3>
                            </div>
                        </div>

                        <div className="flex-1 space-y-6">
                            <p className="text-slate-400 font-medium">Consider the following questions to build your mental model:</p>

                            <div className="space-y-4">
                                {currentStage.questions.map((q, i) => (
                                    <div key={i} className="group">
                                        <label className="block text-sm font-bold text-slate-500 mb-2 group-focus-within:text-white transition-colors">
                                            {q}
                                        </label>
                                        <textarea
                                            value={inputs[`${currentStage.id}_${i}`] || ''}
                                            onChange={(e) => setInputs({ ...inputs, [`${currentStage.id}_${i}`]: e.target.value })}
                                            className="w-full bg-slate-950/50 border border-white/5 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all text-sm resize-none"
                                            rows={2}
                                            placeholder="Notes..."
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/5">
                            <button
                                onClick={handlePrev}
                                disabled={activeStageIdx === 0}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeStageIdx === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <ArrowLeft size={18} /> Back
                            </button>

                            <button
                                onClick={activeStageIdx === STAGES.length - 1 ? reset : handleNext}
                                className="flex items-center gap-2 px-8 py-3 bg-white text-slate-950 hover:bg-indigo-400 transition-all rounded-xl font-black"
                            >
                                {activeStageIdx === STAGES.length - 1 ? 'Finish Scenario' : 'Next Step'}
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Help helper for icons
const ArrowLeft = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
);

export default FORDECDecision;
