import React, { useState } from 'react';
import { Plane, Mic, Play, CheckCircle, RotateCcw } from 'lucide-react';

const VfrFlightSim: React.FC = () => {
    const [stage, setStage] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);

    const scenario = [
        {
            phase: "Initial Call",
            context: "You are G-ABCD, Cessna 172, on apron at Oxford. Request taxi for VFR flight to Cambridge.",
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
        },
        {
            phase: "Enroute - FIS",
            context: "You are leaving the frequency. You want to contact 'London Information' for a Basic Service.",
            options: [
                "London Information, G-ABCD, request Basic Service.",
                "London Control, G-ABCD, with you.",
                "London, G-CD, VFR flight Cambridge."
            ],
            correct: 0,
            expl: "Call new station with full callsign and service request. 'London Information' provides Basic Service."
        },
        {
            phase: "Zone Transit",
            context: "You need to cross Luton's Control Zone. Request transit.",
            options: [
                "Luton Radar, G-ABCD, request zone transit.",
                "Luton, G-CD, request crossing.",
                "Luton, G-ABCD, entering your zone."
            ],
            correct: 0,
            expl: "Standard phraseology: 'Request zone transit'."
        },
        {
            phase: "Arrival - Initial",
            context: "Approaching Cambridge. 10 miles out. Request joining instructions.",
            options: [
                "Cambridge Tower, G-ABCD, 10 miles South, request join.",
                "Cambridge, G-CD, landing.",
                "Cambridge, G-ABCD, inbound."
            ],
            correct: 0,
            expl: "State position and request 'joining instructions'."
        }
    ];

    const handleAnswer = (idx: number) => {
        if (idx === scenario[stage].correct) {
            setFeedback("CORRECT");
            setTimeout(() => {
                setFeedback(null);
                if (stage < scenario.length - 1) setStage(stage + 1);
            }, 1500);
        } else {
            setFeedback("INCORRECT");
        }
    };

    const reset = () => {
        setStage(0);
        setFeedback(null);
    };

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Plane className="text-sky-400" /> VFR Communications Simulator
                </h2>
                <div className="text-sm font-bold text-slate-400">
                    Stage {stage + 1} / {scenario.length}
                </div>
            </div>

            <div className="bg-white rounded-xl p-8 min-h-[400px] flex flex-col relative overflow-hidden transition-all duration-300">
                {/* Visual Context */}
                <div className="absolute top-0 right-0 w-40 h-40 opacity-5 pointer-events-none">
                    <Plane size={160} />
                </div>

                <div className="mb-8">
                    <div className="flex items-center gap-2 text-xs font-bold text-sky-600 uppercase tracking-widest mb-2">
                        <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                        Phase: {scenario[stage].phase}
                    </div>
                    <p className="text-2xl font-medium text-slate-900 leading-relaxed font-heading">
                        {scenario[stage].context}
                    </p>
                </div>

                <div className="space-y-4 flex-1">
                    {scenario[stage].options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => !feedback && handleAnswer(i)}
                            className={`w-full p-5 rounded-xl border-2 text-left transition-all flex items-center gap-5 group
                                ${feedback ? 'cursor-default' : 'hover:border-sky-500 hover:shadow-lg hover:-translate-y-0.5'}
                                ${feedback === 'CORRECT' && i === scenario[stage].correct ? 'bg-green-50 border-green-500 text-green-900 shadow-none' : ''}
                                ${feedback === 'INCORRECT' && i !== scenario[stage].correct && feedback ? 'opacity-40 grayscale' : 'bg-white border-slate-200 text-slate-700'}
                                ${feedback === 'INCORRECT' && i === scenario[stage].correct ? 'ring-2 ring-green-500 ring-offset-2' : ''} 
                            `}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${feedback === 'CORRECT' && i === scenario[stage].correct ? 'bg-green-200 text-green-700' : 'bg-slate-100 text-slate-500 group-hover:bg-sky-100 group-hover:text-sky-600'}`}>
                                <Mic size={20} />
                            </div>
                            <span className="font-mono text-base font-medium">{opt}</span>
                        </button>
                    ))}
                </div>

                {feedback && (
                    <div className={`mt-6 p-4 rounded-xl text-sm font-bold flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 ${feedback === 'CORRECT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {feedback === 'CORRECT' ? <CheckCircle className="mt-0.5 shrink-0" size={20} /> : <Play className="mt-0.5 shrink-0 rotate-90" size={20} />}
                        <div>
                            <div className="text-base mb-1">{feedback === 'CORRECT' ? "Correct Call!" : "Incorrect."}</div>
                            <div className="font-normal opacity-90">{scenario[stage].expl}</div>
                        </div>
                    </div>
                )}

                {stage === scenario.length - 1 && feedback === 'CORRECT' && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 animate-in fade-in zoom-in-95">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                            <CheckCircle size={40} />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-2">Flight Complete!</h3>
                        <p className="text-slate-500 mb-8">You successfully handled all communications.</p>
                        <button onClick={reset} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center gap-2">
                            <RotateCcw size={18} /> Fly Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VfrFlightSim;
