import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, AlertCircle, CheckCircle, RefreshCcw, ArrowRight } from 'lucide-react';

const SCENARIOS = [
    {
        id: 1,
        title: 'Pre-flight Distraction',
        type: 'THREAT',
        desc: 'While performing the walk-around, a passenger engages you in a long conversation about the weather.',
        explanation: 'This is a THREAT (Latent/External). It increases the likelihood of an error (e.g., missing a check). Management: "Please excuse me, I must finish my checks first."',
        correct: 'THREAT'
    },
    {
        id: 2,
        title: 'Wrong Altimeter Setting',
        type: 'ERROR',
        desc: 'You read back "QNH 1013" but set "1003" on the subscale.',
        explanation: 'This is an ERROR (Action). It is a deviation from intentions/procedures. Mitigation: Cross-check with other pilot or instrument comparison.',
        correct: 'ERROR'
    },
    {
        id: 3,
        title: 'Unstabilized Approach',
        type: 'UAS',
        desc: 'The aircraft is fast and high at 500ft due to a late descent clearance.',
        explanation: 'This is an UNDESIRED AIRCRAFT STATE (UAS). The aircraft is in a position/speed that reduces safety margins. Recovery: Go-around.',
        correct: 'UAS'
    },
    {
        id: 4,
        title: 'Complex Clearance',
        type: 'THREAT',
        desc: 'ATC issues a rapid-fire, complex departure clearance with multiple amendments.',
        explanation: 'This is a THREAT. It challenges your capacity. Strategy: "Standby", write it down, valid readback.',
        correct: 'THREAT'
    },
    {
        id: 5,
        title: 'Automation Error',
        type: 'ERROR',
        desc: 'The Captain intended to set FL100 but accidentally scrolls to FL110. The FO does not verify.',
        explanation: 'This is an ERROR (Action/Selection). It is a failure to exercise care. Management: Monitor and Cross-check.',
        correct: 'ERROR'
    },
    {
        id: 6,
        title: 'Severe Turbulence',
        type: 'THREAT',
        desc: 'Unexpected severe turbulence is encountered at cruise, requiring an immediate altitude change.',
        explanation: 'This is an Environmental THREAT. It is outside the crew\'s control but requires management. Management: Use of weather radar, pilot reports, and seatbelt signs.',
        correct: 'THREAT'
    },
    {
        id: 7,
        title: 'Taxiway Incursion',
        type: 'UAS',
        desc: 'The aircraft has crossed a hold-short line without a specific ATC clearance to enter the runway.',
        explanation: 'This is a UAS (Ground Navigation). The aircraft is in a unsafe position. Management: Stop immediately and notify ATC.',
        correct: 'UAS'
    },
    {
        id: 8,
        title: 'Fatigue',
        type: 'THREAT',
        desc: 'The FO has had only 4 hours of sleep and is struggling to maintain concentration during the approach.',
        explanation: 'This is a THREAT (Internal/Human). It reduces the crew\'s capability. Management: Workload sharing, Napping (where allowed), and use of automation.',
        correct: 'THREAT'
    }
];

const TEMAdvanced: React.FC = () => {
    const [currentScenario, setCurrentScenario] = useState(0);
    const [feedback, setFeedback] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');
    const [score, setScore] = useState(0);

    const handleGuess = (guess: string) => {
        if (feedback !== 'IDLE') return;

        if (guess === SCENARIOS[currentScenario].correct) {
            setFeedback('CORRECT');
            setScore(s => s + 1);
        } else {
            setFeedback('WRONG');
        }
    };

    const next = () => {
        if (currentScenario < SCENARIOS.length - 1) {
            setCurrentScenario(c => c + 1);
            setFeedback('IDLE');
        } else {
            setCurrentScenario(0);
            setFeedback('IDLE');
            setScore(0);
        }
    };

    const scenario = SCENARIOS[currentScenario];

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-red-500/20 rounded-xl">
                    <ShieldAlert className="w-8 h-8 text-red-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">
                        TEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Advanced Trainer</span>
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Threat and Error Management: Identify, Trap, Mitigate.
                    </p>
                </div>
            </div>

            {/* Game Card */}
            <div className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                    <div
                        className="h-full bg-red-500 transition-all duration-500"
                        style={{ width: `${((currentScenario) / SCENARIOS.length) * 100}%` }}
                    />
                </div>

                <div className="mt-4">
                    <span className="text-xs font-mono text-slate-500 mb-2 block">SCENARIO {currentScenario + 1}/{SCENARIOS.length}</span>
                    <h2 className="text-2xl font-bold text-white mb-4">{scenario.title}</h2>
                    <p className="text-lg text-slate-300 leading-relaxed mb-8 bg-slate-800/50 p-6 rounded-xl border-l-4 border-blue-500">
                        "{scenario.desc}"
                    </p>
                </div>

                {/* Choices */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <button
                        onClick={() => handleGuess('THREAT')}
                        disabled={feedback !== 'IDLE'}
                        className={`p-4 rounded-xl border border-dashed border-slate-600 hover:border-orange-500 hover:bg-orange-500/10 transition-all flex flex-col items-center gap-2 group ${feedback !== 'IDLE' && scenario.correct === 'THREAT' ? 'bg-emerald-500/20 border-emerald-500' : ''}`}
                    >
                        <AlertTriangle className="text-orange-400 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-orange-200">THREAT</span>
                    </button>
                    <button
                        onClick={() => handleGuess('ERROR')}
                        disabled={feedback !== 'IDLE'}
                        className={`p-4 rounded-xl border border-dashed border-slate-600 hover:border-red-500 hover:bg-red-500/10 transition-all flex flex-col items-center gap-2 group ${feedback !== 'IDLE' && scenario.correct === 'ERROR' ? 'bg-emerald-500/20 border-emerald-500' : ''}`}
                    >
                        <AlertCircle className="text-red-400 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-red-200">ERROR</span>
                    </button>
                    <button
                        onClick={() => handleGuess('UAS')}
                        disabled={feedback !== 'IDLE'}
                        className={`p-4 rounded-xl border border-dashed border-slate-600 hover:border-purple-500 hover:bg-purple-500/10 transition-all flex flex-col items-center gap-2 group ${feedback !== 'IDLE' && scenario.correct === 'UAS' ? 'bg-emerald-500/20 border-emerald-500' : ''}`}
                    >
                        <RefreshCcw className="text-purple-400 group-hover:rotate-180 transition-transform duration-700" />
                        <span className="font-bold text-purple-200">UAS</span>
                    </button>
                </div>

                {/* Feedback */}
                {feedback !== 'IDLE' && (
                    <div className={`p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-4 ${feedback === 'CORRECT' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                        <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-full ${feedback === 'CORRECT' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                                {feedback === 'CORRECT' ? <CheckCircle className="text-white w-5 h-5" /> : <AlertTriangle className="text-white w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                                <h3 className={`font-bold mb-1 ${feedback === 'CORRECT' ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {feedback === 'CORRECT' ? 'Correct Analysis!' : 'Not quite.'}
                                </h3>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    {scenario.explanation}
                                </p>
                            </div>
                            <button
                                onClick={next}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-bold flex items-center gap-2 transition-all"
                            >
                                Next <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TEMAdvanced;
