import React, { useState } from 'react';
import {
    ClipboardList,
    CheckSquare,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    ChevronRight,
    RotateCcw,
    Play,
    ShieldCheck,
    List,
    Clock,
    UserCheck
} from 'lucide-react';

interface ProcedureStep {
    id: number;
    text: string;
    isCritical: boolean;
}

interface ProcedureScenario {
    id: number;
    title: string;
    context: string;
    steps: ProcedureStep[];
    deviationIndex?: number; // Index of step with an error
    deviationText?: string;
    correctAction: string;
}

const PROCEDURES: ProcedureScenario[] = [
    {
        id: 1,
        title: 'Engine Fire on Ground',
        context: 'During taxi, the fire bell rings and the ENG 1 FIRE handle illuminates. You need to execute the memory items.',
        steps: [
            { id: 1, text: 'THRUST LEVERS - IDLE', isCritical: true },
            { id: 2, text: 'PARKING BRAKE - ON', isCritical: true },
            { id: 3, text: 'ENG FIRE HANDLE - PULL', isCritical: true },
            { id: 4, text: 'AGENT 1 - DISCHARGE', isCritical: true },
            { id: 5, text: 'ATC - NOTIFY', isCritical: false }
        ],
        correctAction: 'Execute memory items swiftly and precisely without waiting for QRH.'
    },
    {
        id: 2,
        title: 'Deviation Recognition: Go-Around',
        context: 'You are stabilized on approach. At 400ft, the speed drops to Vref-10 and the sink rate increases to 1200 fpm. The Pilot Flying continues the approach.',
        steps: [
            { id: 1, text: 'Observe Deviation', isCritical: true },
            { id: 2, text: 'Call Out: "SINK RATE"', isCritical: true },
            { id: 3, text: 'Call Out: "GO AROUND, FLAPS 15"', isCritical: true },
            { id: 4, text: 'Verify Maneuver', isCritical: true }
        ],
        deviationIndex: 2,
        deviationText: 'The Pilot Flying says: "It\'s okay, I have the runway in sight, continuing."',
        correctAction: 'Mandatory Go-Around. Unstabilized below 500ft (IMC/VMC) requires immediate abort.'
    }
];

const ProcedureApplication: React.FC = () => {
    const [activeScenario, setActiveScenario] = useState<ProcedureScenario | null>(null);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [feedback, setFeedback] = useState('');

    const handleStep = (stepId: number) => {
        if (gameOver) return;

        const step = activeScenario?.steps.find(s => s.id === stepId);
        const expectedStep = activeScenario?.steps[completedSteps.length];

        if (stepId === expectedStep?.id) {
            const newSteps = [...completedSteps, stepId];
            setCompletedSteps(newSteps);

            if (newSteps.length === activeScenario?.steps.length) {
                setGameOver(true);
                setFeedback(activeScenario?.correctAction || 'Procedure completed successfully.');
            }
        } else {
            setGameOver(true);
            setFeedback('Incorrect Sequence. SOP requires strict adherence to the defined flow.');
        }
    };

    const reset = () => {
        setActiveScenario(null);
        setCompletedSteps([]);
        setGameOver(false);
        setFeedback('');
    };

    if (!activeScenario) {
        return (
            <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
                        <ClipboardList size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">
                            Procedure <span className="text-emerald-400">Application</span>
                        </h1>
                        <p className="text-slate-400 mt-1">SOP adherence and deviation recognition training for KSA 100.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {PROCEDURES.map(p => (
                        <button
                            key={p.id}
                            onClick={() => setActiveScenario(p)}
                            className="bg-slate-800/50 border border-white/10 p-6 rounded-2xl text-left hover:border-emerald-500/50 transition-all hover:bg-slate-800 group"
                        >
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{p.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{p.context}</p>
                            <div className="mt-4 flex items-center text-emerald-400 font-bold text-xs uppercase tracking-widest">
                                Start Drill <ChevronRight size={14} />
                            </div>
                        </button>
                    ))}
                </div>

                <div className="bg-slate-900/50 border border-white/5 p-8 rounded-3xl mt-8 flex gap-6 items-start">
                    <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h2 className="text-white font-bold mb-2">Procedural Discipline</h2>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            A core pilot competency is the ability to apply procedures accurately and recognize when they are not being followed. This module tests your knowledge of standard flows and your assertiveness in calling out deviations.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <button onClick={reset} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-sm">
                    <RotateCcw size={16} /> Exit Drill
                </button>
                <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                    Manual Selection Mode
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Situation */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <Clock className="text-emerald-400" size={20} />
                            <h3 className="text-white font-black tracking-tight uppercase">The Situation</h3>
                        </div>
                        <p className="text-lg text-slate-300 leading-relaxed font-medium">
                            {activeScenario.context}
                        </p>
                        {activeScenario.deviationText && (
                            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <p className="text-sm text-red-400 font-bold italic">
                                    "{activeScenario.deviationText}"
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-2xl flex items-start gap-4">
                        <UserCheck size={20} className="text-emerald-500 mt-1" />
                        <div>
                            <h4 className="text-sm font-bold text-slate-300">PF/PM Coordination</h4>
                            <p className="text-xs text-slate-500 mt-1">Ensure your actions match the role and the procedural state of the flight.</p>
                        </div>
                    </div>
                </div>

                {/* Checklist/Steps Area */}
                <div className="lg:col-span-7">
                    <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 px-2 flex items-center justify-between">
                            Execution Flow
                            <span className="text-[10px] text-slate-700">{completedSteps.length} / {activeScenario.steps.length} Steps</span>
                        </h4>

                        <div className="space-y-3">
                            {gameOver ? (
                                <div className={`p-8 rounded-3xl border-2 text-center animate-in zoom-in ${feedback.includes('Incorrect') ? 'border-red-500/30 bg-red-500/10' : 'border-emerald-500/30 bg-emerald-500/10'}`}>
                                    {feedback.includes('Incorrect') ? <XCircle className="mx-auto mb-4 text-red-400" size={48} /> : <CheckCircle2 className="mx-auto mb-4 text-emerald-400" size={48} />}
                                    <h5 className={`text-2xl font-black mb-2 ${feedback.includes('Incorrect') ? 'text-red-400' : 'text-emerald-400'}`}>
                                        {feedback.includes('Incorrect') ? 'PROCEDURAL ERROR' : 'MISSION SUCCESS'}
                                    </h5>
                                    <p className="text-slate-300 text-sm leading-relaxed max-w-sm mx-auto mb-8">
                                        {feedback}
                                    </p>
                                    <button onClick={reset} className="px-8 py-3 bg-white text-slate-900 rounded-xl font-black hover:bg-slate-200 transition-all">
                                        Return to Menu
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-2">
                                    {activeScenario.steps.map(step => {
                                        const isCompleted = completedSteps.includes(step.id);
                                        return (
                                            <button
                                                key={step.id}
                                                onClick={() => handleStep(step.id)}
                                                disabled={isCompleted}
                                                className={`flex items-center justify-between p-5 rounded-2xl border transition-all text-left group ${isCompleted
                                                        ? 'bg-emerald-500/10 border-emerald-500/20 opacity-50'
                                                        : 'bg-slate-800 border-white/5 hover:border-emerald-500/50 hover:bg-slate-700'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-slate-700 group-hover:border-emerald-500/50'
                                                        }`}>
                                                        {isCompleted && <CheckSquare size={14} className="text-slate-900" />}
                                                    </div>
                                                    <span className={`font-bold ${isCompleted ? 'text-emerald-400 line-through' : 'text-slate-200'}`}>
                                                        {step.text}
                                                    </span>
                                                </div>
                                                {step.isCritical && !isCompleted && (
                                                    <div className="px-2 py-0.5 bg-red-500/10 text-red-400 text-[10px] font-black rounded border border-red-500/20">CRITICAL</div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProcedureApplication;
