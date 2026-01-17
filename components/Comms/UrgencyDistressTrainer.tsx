import React, { useState, useEffect } from 'react';
import { AlertTriangle, Flame, Activity, Zap, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

interface Scenario {
    id: number;
    title: string;
    description: string;
    correctType: 'MAYDAY' | 'PAN PAN';
    explanation: string;
}

const scenarios: Scenario[] = [
    {
        id: 1,
        title: "Engine Fire",
        description: "You have a fire in the left engine that cannot be extinguished.",
        correctType: "MAYDAY",
        explanation: "Fire constitutes grave and imminent danger to the aircraft and occupants."
    },
    {
        id: 2,
        title: "Passenger Heart Attack",
        description: "A passenger is having a suspected heart attack. The aircraft is safe.",
        correctType: "PAN PAN",
        explanation: "This is an urgent situation concerning the safety of a person, but the aircraft itself is not in danger."
    },
    {
        id: 3,
        title: "Dual Engine Failure",
        description: "Both engines have failed. You are gliding.",
        correctType: "MAYDAY",
        explanation: "Immediate danger requires immediate assistance."
    },
    {
        id: 4,
        title: "Lost Position",
        description: "You are unsure of your position but have fuel and are in VMC.",
        correctType: "PAN PAN",
        explanation: "If you are not in immediate danger, use PAN PAN to request assistance."
    },
    {
        id: 5,
        title: "Rough Running Engine",
        description: "Engine is vibrating but producing power. You want to land ASAP as a precaution.",
        correctType: "PAN PAN",
        explanation: "A potential threat exists, but immediate danger is not yet present."
    },
    {
        id: 6,
        title: "Smoke in Cockpit",
        description: "Thick smoke is filling the cockpit, obscuring instruments.",
        correctType: "MAYDAY",
        explanation: "Severe incapacitation risk and fire risk constitutes grave danger."
    },
];

const UrgencyDistressTrainer: React.FC = () => {
    const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
    const [score, setScore] = useState(0);
    const [total, setTotal] = useState(0);
    const [feedback, setFeedback] = useState<{ correct: boolean, text: string } | null>(null);

    useEffect(() => {
        nextScenario();
    }, []);

    const nextScenario = () => {
        const random = scenarios[Math.floor(Math.random() * scenarios.length)];
        setCurrentScenario(random);
        setFeedback(null);
    };

    const handleGuess = (type: 'MAYDAY' | 'PAN PAN') => {
        if (!currentScenario) return;

        const isCorrect = type === currentScenario.correctType;
        if (isCorrect) setScore(s => s + 1);
        setTotal(t => t + 1);

        setFeedback({
            correct: isCorrect,
            text: isCorrect ? "Correct! " + currentScenario.explanation : "Incorrect. " + currentScenario.explanation
        });
    };

    if (!currentScenario) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-white mb-2">Urgency vs Distress</h2>
                <p className="text-slate-400">Decide: Is the safety of the aircraft/person threatened (Urgency) or is there grave and imminent danger (Distress)?</p>
                <div className="mt-4 inline-block bg-slate-800 px-6 py-2 rounded-full font-mono text-xl">
                    Score: <span className="text-green-400">{score}</span> / {total}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">

                {/* Scenario Card */}
                <div className="bg-white rounded-3xl p-8 shadow-2xl relative overflow-hidden min-h-[300px] flex flex-col justify-center">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <ShieldAlert size={100} />
                    </div>

                    <h3 className="text-2xl font-bold text-slate-800 mb-4">{currentScenario.title}</h3>
                    <p className="text-slate-600 text-lg leading-relaxed">{currentScenario.description}</p>

                    {feedback && (
                        <div className={`mt-8 p-4 rounded-xl border ${feedback.correct ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'} animate-in slide-in-from-bottom-5`}>
                            <div className="flex items-center gap-2 font-bold mb-1">
                                {feedback.correct ? <CheckCircle size={18} /> : <XCircle size={18} />}
                                {feedback.correct ? "Excellent Decision" : "Wrong Call"}
                            </div>
                            <p className="text-sm">{feedback.text}</p>

                            <button onClick={nextScenario} className="mt-4 w-full py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-bold">
                                Next Scenario →
                            </button>
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="space-y-6">
                    <button
                        onClick={() => handleGuess('MAYDAY')}
                        disabled={!!feedback}
                        className="w-full group relative overflow-hidden bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:hover:bg-red-600 text-white p-8 rounded-2xl transition-all hover:scale-105 shadow-lg shadow-red-900/50"
                    >
                        <div className="relative z-10 flex items-center justify-between">
                            <div className="text-left">
                                <span className="block text-xs font-bold opacity-70 mb-1">DISTRESS</span>
                                <span className="text-3xl font-black tracking-widest">MAYDAY</span>
                            </div>
                            <Flame size={48} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </button>

                    <button
                        onClick={() => handleGuess('PAN PAN')}
                        disabled={!!feedback}
                        className="w-full group relative overflow-hidden bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:hover:bg-orange-500 text-white p-8 rounded-2xl transition-all hover:scale-105 shadow-lg shadow-orange-900/50"
                    >
                        <div className="relative z-10 flex items-center justify-between">
                            <div className="text-left">
                                <span className="block text-xs font-bold opacity-70 mb-1">URGENCY</span>
                                <span className="text-3xl font-black tracking-widest">PAN PAN</span>
                            </div>
                            <Zap size={48} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default UrgencyDistressTrainer;
