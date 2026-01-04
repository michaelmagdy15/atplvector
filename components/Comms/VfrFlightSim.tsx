
import React, { useState } from 'react';
import { Plane, Mic, Play, CheckCircle } from 'lucide-react';

const VfrFlightSim: React.FC = () => {
    const [stage, setStage] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);

    const scenario = [
        {
            phase: "Initial Call",
            context: "You are G-ABCD, Cessna 172, on apron at Oxford. You want taxi instructions for VFR flight to Cambridge.",
            options: [
                "Oxford Tower, G-ABCD, Cessna 172 at the apron, request taxi for VFR flight to Cambridge.",
                "Oxford Tower, G-ABCD, request taxi.",
                "Oxford Tower, G-CD, ready to taxi."
            ],
            correct: 0,
            expl: "Initial call must include: Station ID, Callsign, Type, Position, Intentions."
        },
        {
            phase: "Taxi Clearance",
            context: "Tower: 'G-CD, Taxi to holding point A1 runway 19, QNH 1013.'",
            options: [
                "Taxi to holding point A1, G-CD.",
                "Taxi to holding point A1 runway 19, QNH 1013, G-CD.",
                "Roger, G-CD."
            ],
            correct: 1,
            expl: "Must readback: Clearance limits (Hold A1), Runway (19), and QNH."
        },
        {
            phase: "Take-off",
            context: "Tower: 'G-CD, cleared for takeoff runway 19, surface wind 230 10 knots.'",
            options: [
                "Cleared for takeoff runway 19, G-CD.",
                "Copy wind, taking off, G-CD.",
                "Rolling, G-CD."
            ],
            correct: 0,
            expl: "Mandatory readback: 'Cleared for takeoff' and 'Runway identifier'."
        }
    ];

    const handleAnswer = (idx: number) => {
        if (idx === scenario[stage].correct) {
            setFeedback("CORRECT");
            setTimeout(() => {
                setFeedback(null);
                if (stage < scenario.length - 1) setStage(stage + 1);
                else setStage(0); // Loop for demo
            }, 1500);
        } else {
            setFeedback("INCORRECT");
        }
    };

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Plane className="text-sky-400" /> VFR Communications Simulator
            </h2>

            <div className="bg-white rounded-xl p-8 min-h-[400px] flex flex-col relative overflow-hidden">
                {/* Visual Context */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                    <Plane size={120} />
                </div>

                <div className="mb-8">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Phase: {scenario[stage].phase}
                    </div>
                    <p className="text-xl font-medium text-slate-900 leading-relaxed">
                        {scenario[stage].context}
                    </p>
                </div>

                <div className="space-y-3 flex-1">
                    {scenario[stage].options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => handleAnswer(i)}
                            className={`w-full p-4 rounded-lg border-2 text-left transition-all flex items-center gap-4 group
                                ${feedback ? 'cursor-default' : 'hover:border-sky-500 hover:bg-sky-50'}
                                ${feedback === 'CORRECT' && i === scenario[stage].correct ? 'bg-green-100 border-green-500 text-green-900' : ''}
                                ${feedback === 'INCORRECT' && i !== scenario[stage].correct ? 'opacity-50' : 'bg-white border-slate-200 text-slate-700'}
                            `}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${feedback === 'CORRECT' && i === scenario[stage].correct ? 'bg-green-200' : 'bg-slate-100 group-hover:bg-white'}`}>
                                <Mic size={16} className="text-slate-600" />
                            </div>
                            <span className="font-mono text-sm">{opt}</span>
                        </button>
                    ))}
                </div>

                {feedback && (
                    <div className={`mt-6 p-4 rounded-lg text-sm font-bold flex items-center gap-2 ${feedback === 'CORRECT' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {feedback === 'CORRECT' ? <CheckCircle size={18} /> : <Play size={18} />}
                        {feedback === 'CORRECT' ? "Correct Phraseology!" : "Standard phraseology required."}
                        <span className="font-normal ml-2 text-xs">{scenario[stage].expl}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VfrFlightSim;
