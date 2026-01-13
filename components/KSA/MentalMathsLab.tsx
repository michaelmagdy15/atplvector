import React, { useState, useEffect } from 'react';
import {
    Calculator, RotateCw, Navigation, Watch, Check, X,
    Wind, TrendingDown, Fuel, Percent, TrendingUp,
    Scale, Gauge, ArrowRight, Play, ArrowLeft
} from 'lucide-react';

const MentalMathsLab: React.FC = () => {
    const [activeModule, setActiveModule] = useState<string>('CONVERSION');

    const modules = [
        { id: 'CONVERSION', label: 'Conversions', icon: Scale, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { id: 'TSD', label: 'Time / Speed / Dist', icon: Watch, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { id: 'VS', label: 'Vertical Speed', icon: TrendingDown, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        { id: 'ARITHMETIC', label: 'Rapid Arithmetic', icon: Calculator, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10' },
        { id: 'FUEL', label: 'Fuel Burn', icon: Fuel, color: 'text-orange-400', bg: 'bg-orange-500/10' },
        { id: 'DECISION', label: 'Decision Time', icon: Watch, color: 'text-red-400', bg: 'bg-red-500/10' },
        { id: 'TOD', label: 'Top of Descent', icon: TrendingDown, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        { id: 'PERCENT', label: 'Percentages', icon: Percent, color: 'text-pink-400', bg: 'bg-pink-500/10' },
        { id: 'GLIDE', label: '3° Glide Slope', icon: TrendingDown, color: 'text-violet-400', bg: 'bg-violet-500/10' },
        { id: '1IN60', label: '1 in 60 Rule', icon: Navigation, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        { id: 'WIND', label: 'Wind Components', icon: Wind, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    ];

    const ActiveComponent = () => {
        switch (activeModule) {
            case 'CONVERSION': return <ConversionTrainer />;
            case 'TSD': return <TSDTrainer />;
            case 'VS': return <VerticalSpeedTrainer />;
            case 'ARITHMETIC': return <ArithmeticTrainer />;
            case 'FUEL': return <FuelBurnTrainer />;
            case 'DECISION': return <DecisionTimeTrainer />;
            case 'TOD': return <TodTrainer />;
            case 'PERCENT': return <PercentageTrainer />;
            case 'GLIDE': return <GlideSlopeTrainer />;
            case '1IN60': return <OneInSixtyTrainer />;
            case 'WIND': return <WindTrainer />;
            default: return <ConversionTrainer />;
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-[800px] bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            {/* Sidebar */}
            <div className="w-full lg:w-64 bg-slate-950/50 border-r border-white/5 p-4 overflow-y-auto custom-scrollbar">
                <div className="mb-6 px-2">
                    <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-fuchsia-400" />
                        Mental<span className="text-fuchsia-400">Lab</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">KSA 100 Training Suite</p>
                </div>
                <div className="space-y-1">
                    {modules.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setActiveModule(m.id)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${activeModule === m.id
                                ? 'bg-slate-800 text-white shadow-lg border border-white/10'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <div className={`p-1.5 rounded-lg ${m.bg}`}>
                                <m.icon size={16} className={m.color} />
                            </div>
                            <span className="text-sm font-semibold">{m.label}</span>
                            {activeModule === m.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-fuchsia-400" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 lg:p-10 overflow-y-auto bg-slate-900/30">
                <div className="max-w-2xl mx-auto h-full flex flex-col">
                    <ActiveComponent />
                </div>
            </div>
        </div>
    );
};

// --- Trainer Components ---

// --- Shared Engine ---

const TrainerEngine = ({
    title,
    description,
    generateFn,
    validateFn,
    formatQuestion,
    unit
}: {
    title: string,
    description: string,
    generateFn: () => any,
    validateFn: (q: any, a: string) => boolean,
    formatQuestion: (q: any) => React.ReactNode,
    unit?: string
}) => {
    const [started, setStarted] = useState(false);
    const [question, setQuestion] = useState<any>(null);
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');
    const [streak, setStreak] = useState(0);
    const [showSolution, setShowSolution] = useState<string | null>(null);

    const next = () => {
        setQuestion(generateFn());
        setAnswer('');
        setFeedback('IDLE');
        setShowSolution(null);
    };

    const start = () => {
        setStarted(true);
        next();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // If already correct, next question
        if (feedback === 'CORRECT') {
            next();
            return;
        }

        if (validateFn(question, answer)) {
            setFeedback('CORRECT');
            setStreak(s => s + 1);
            // Removed auto-timeout to allow user to review answer
        } else {
            setFeedback('WRONG');
            setStreak(0);
        }
    };

    if (!started) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="p-8 bg-slate-800 rounded-3xl border border-white/10 shadow-xl max-w-md">
                    <h3 className="text-3xl font-black text-white mb-4">{title}</h3>
                    <p className="text-slate-400 mb-8 leading-relaxed">{description}</p>
                    <button
                        onClick={start}
                        className="w-full py-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-fuchsia-500/25 flex items-center justify-center gap-2"
                    >
                        <Play size={20} fill="currentColor" />
                        Start Training
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto space-y-8 animate-in fly-in-y-4 duration-300">
            {/* Header / Stats */}
            <div className="w-full flex justify-between items-center text-sm font-medium text-slate-500">
                <button onClick={() => setStarted(false)} className="hover:text-white transition-colors flex items-center gap-1">
                    <ArrowLeft size={16} /> Exit
                </button>
                <div className="flex items-center gap-2">
                    <TrendingUp size={16} className={streak > 0 ? "text-emerald-400" : "text-slate-600"} />
                    <span className={streak > 0 ? "text-emerald-400" : ""}>Streak: {streak}</span>
                </div>
            </div>

            {/* Question Card */}
            <div className="w-full bg-slate-800/50 backdrop-blur border-2 border-slate-700 rounded-3xl p-8 text-center relative overflow-hidden">
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Question</div>
                <div className="text-4xl md:text-5xl font-black text-white mb-2">
                    {formatQuestion(question)}
                </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="relative">
                    <input
                        autoFocus
                        disabled={feedback === 'CORRECT'}
                        type="number"
                        step="any"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className={`w-full bg-slate-900/80 border-2 rounded-2xl px-6 py-5 text-3xl font-mono text-center font-bold text-white outline-none transition-all ${feedback === 'WRONG' ? 'border-red-500/50 bg-red-500/10' :
                                feedback === 'CORRECT' ? 'border-emerald-500/50 bg-emerald-500/10' :
                                    'border-slate-700 focus:border-fuchsia-500'
                            }`}
                        placeholder="???"
                    />
                    {unit && (
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                            {unit}
                        </span>
                    )}
                </div>

                <button
                    type="submit"
                    className={`w-full py-4 font-bold rounded-xl transition-all border ${feedback === 'CORRECT'
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
                            : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                        }`}
                >
                    {feedback === 'CORRECT' ? (
                        <span className="flex items-center justify-center gap-2">
                            Next Question <ArrowRight size={20} />
                        </span>
                    ) : 'Check Answer'}
                </button>
            </form>

            {/* Feedback */}
            <div className="h-8 text-center">
                {feedback === 'CORRECT' && (
                    <div className="text-emerald-400 font-bold flex items-center justify-center gap-2 animate-bounce">
                        <Check size={20} /> Correct!
                    </div>
                )}
                {feedback === 'WRONG' && (
                    <div className="text-red-400 font-bold flex items-center justify-center gap-2 animate-shake">
                        <X size={20} /> Incorrect
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Trainer Implementations ---

// 1. Conversion Trainer
const ConversionTrainer = () => {
    // Types: KG_LBS, LBS_KG, L_USG, USG_L
    const generate = () => {
        const type = ['KG_LBS', 'LBS_KG', 'L_USG', 'USG_L'][Math.floor(Math.random() * 4)];
        const val = Math.floor(Math.random() * 100) + 10;
        return { type, val };
    };

    const format = (q: any) => {
        switch (q.type) {
            case 'KG_LBS': return <>{q.val} <span className="text-blue-400 text-2xl">KG</span> → ??? <span className="text-slate-500 text-2xl">LBS</span></>;
            case 'LBS_KG': return <>{q.val} <span className="text-blue-400 text-2xl">LBS</span> → ??? <span className="text-slate-500 text-2xl">KG</span></>;
            case 'L_USG': return <>{q.val} <span className="text-blue-400 text-2xl">L</span> → ??? <span className="text-slate-500 text-2xl">USG</span></>;
            case 'USG_L': return <>{q.val} <span className="text-blue-400 text-2xl">USG</span> → ??? <span className="text-slate-500 text-2xl">L</span></>;
        }
    };

    const validate = (q: any, ans: string) => {
        const val = parseFloat(ans);
        let correct = 0;
        // Using standard approx: 1kg=2.2lbs, 1USG=3.8L
        switch (q.type) {
            case 'KG_LBS': correct = q.val * 2.20462; break;
            case 'LBS_KG': correct = q.val / 2.20462; break;
            case 'L_USG': correct = q.val / 3.785; break;
            case 'USG_L': correct = q.val * 3.785; break;
        }
        // Allow 5% margin
        return Math.abs(val - correct) < (correct * 0.05);
    };

    return <TrainerEngine
        title="Unit Conversions"
        description="Practice converting between Mass (kg/lbs) and Volume (L/USG) using standard aviation factors."
        generateFn={generate}
        validateFn={validate}
        formatQuestion={format}
    />;
};

// 2. TSD Trainer
const TSDTrainer = () => {
    // Types: CALC_DIST, CALC_TIME, CALC_SPEED
    const generate = () => {
        const type = ['CALC_DIST', 'CALC_TIME', 'CALC_SPEED'][Math.floor(Math.random() * 3)];
        // Nice numbers
        const speed = Math.floor(Math.random() * 30 + 10) * 10; // 100-400
        const timeMin = Math.floor(Math.random() * 12 + 1) * 5; // 5-60 min
        const timeHr = timeMin / 60;
        const dist = Math.round(speed * timeHr);

        return { type, speed, timeMin, dist };
    };

    const format = (q: any) => {
        switch (q.type) {
            case 'CALC_DIST': return <div className="space-y-2">
                <div>{q.speed} <span className="text-2xl text-slate-500">KT</span></div>
                <div>{q.timeMin} <span className="text-2xl text-slate-500">MIN</span></div>
                <div className="text-sm text-emerald-400 mt-2">Find DISTANCE</div>
            </div>;
            case 'CALC_TIME': return <div className="space-y-2">
                <div>{q.dist} <span className="text-2xl text-slate-500">NM</span></div>
                <div>{q.speed} <span className="text-2xl text-slate-500">KT</span></div>
                <div className="text-sm text-emerald-400 mt-2">Find TIME (min)</div>
            </div>;
            case 'CALC_SPEED': return <div className="space-y-2">
                <div>{q.dist} <span className="text-2xl text-slate-500">NM</span></div>
                <div>{q.timeMin} <span className="text-2xl text-slate-500">MIN</span></div>
                <div className="text-sm text-emerald-400 mt-2">Find SPEED</div>
            </div>;
        }
    };

    const validate = (q: any, ans: string) => {
        const val = parseFloat(ans);
        let correct = 0;
        switch (q.type) {
            case 'CALC_DIST': correct = q.dist; break;
            case 'CALC_TIME': correct = q.timeMin; break;
            case 'CALC_SPEED': correct = q.speed; break;
        }
        return Math.abs(val - correct) < (correct * 0.05); // 5% margin
    };

    return <TrainerEngine
        title="Time / Speed / Distance"
        description="Solve for the missing variable. Remember: Distance = Speed × Time."
        generateFn={generate}
        validateFn={validate}
        formatQuestion={format}
    />;
};

// 3. Vertical Speed
const VerticalSpeedTrainer = () => {
    // Types: ROD_3DEG
    const generate = () => {
        const speed = Math.floor(Math.random() * 20 + 8) * 10; // 80-280 KT
        return { speed };
    };

    const format = (q: any) => {
        return <div className="space-y-2">
            <div>{q.speed} <span className="text-2xl text-slate-500">GS</span></div>
            <div className="text-sm text-cyan-400 mt-2">3° Glide ROD?</div>
        </div>;
    };

    const validate = (q: any, ans: string) => {
        const val = parseFloat(ans);
        const correct = q.speed * 5;
        // Allow small margin (e.g. if they use * 5.2 approx)
        return Math.abs(val - correct) <= 50;
    };

    return <TrainerEngine
        title="Vertical Speed"
        description="Calculate the required Rate of Descent for a 3° Glide Slope (GS × 5)."
        generateFn={generate}
        validateFn={validate}
        formatQuestion={format}
        unit="ft/min"
    />;
};

// 4. Arithmetic Trainer
const ArithmeticTrainer = () => {
    // Operations: ADD, SUB
    const generate = () => {
        const op = Math.random() > 0.5 ? 'ADD' : 'SUB';
        // Generate big numbers for "rapid" feel
        const a = Math.floor(Math.random() * 900) + 100;
        const b = Math.floor(Math.random() * 900) + 100;
        return { op, a, b };
    };

    const format = (q: any) => {
        return <div className="flex items-center gap-4 justify-center">
            <span>{q.a}</span>
            <span className="text-fuchsia-400">{q.op === 'ADD' ? '+' : '-'}</span>
            <span>{q.b}</span>
        </div>;
    };

    const validate = (q: any, ans: string) => {
        const val = parseInt(ans);
        const correct = q.op === 'ADD' ? q.a + q.b : q.a - q.b;
        return val === correct;
    };

    return <TrainerEngine
        title="Rapid Arithmetic"
        description="Quickly add and subtract large numbers."
        generateFn={generate}
        validateFn={validate}
        formatQuestion={format}
    />;
};

// 5. Fuel Burn Trainer
const FuelBurnTrainer = () => {
    const generate = () => {
        const burn = Math.floor(Math.random() * 40 + 10) * 100; // 1000 - 5000 kg/hr
        const timeMin = Math.floor(Math.random() * 12 + 1) * 5; // 5 - 60 min
        return { burn, timeMin };
    };

    const format = (q: any) => {
        return <div className="space-y-2">
            <div>{q.burn} <span className="text-2xl text-slate-500">KG/HR</span></div>
            <div>{q.timeMin} <span className="text-2xl text-slate-500">MIN</span></div>
            <div className="text-sm text-orange-400 mt-2">Fuel Consumed?</div>
        </div>;
    };

    const validate = (q: any, ans: string) => {
        const val = parseFloat(ans);
        // Burn * (Min / 60)
        const correct = q.burn * (q.timeMin / 60);
        return Math.abs(val - correct) < (correct * 0.05);
    };

    return <TrainerEngine
        title="Fuel Burn"
        description="Calculate fuel consumed based on flow rate and time."
        generateFn={generate}
        validateFn={validate}
        formatQuestion={format}
        unit="kg"
    />;
};

// 6. Decision Time Trainer
const DecisionTimeTrainer = () => {
    const generate = () => {
        const burn = Math.floor(Math.random() * 20 + 10) * 100; // 1000 - 3000 kg/hr
        const reserve = Math.floor(Math.random() * 20 + 10) * 100; // 1000 - 3000 kg
        const onboard = reserve + Math.floor(Math.random() * 20 + 5) * 100; // Above reserve
        return { burn, reserve, onboard };
    };

    const format = (q: any) => {
        return <div className="space-y-1">
            <div className="text-lg">FOB: <span className="font-bold">{q.onboard}</span></div>
            <div className="text-lg">Rsrv: <span className="font-bold">{q.reserve}</span></div>
            <div className="text-lg">Flow: <span className="font-bold">{q.burn}</span></div>
            <div className="text-sm text-red-400 mt-2">Time to Reserve?</div>
        </div>;
    };

    const validate = (q: any, ans: string) => {
        const val = parseFloat(ans);
        // (FOB - Rsrv) / Flow -> Hours
        // Convert to minutes? Usually decision time is in minutes.
        // Let's expect Minutes.
        const correctHours = (q.onboard - q.reserve) / q.burn;
        const correctMin = correctHours * 60;
        return Math.abs(val - correctMin) < 5; // 5 min margin
    };

    return <TrainerEngine
        title="Decision Time"
        description="Calculate time remaining until you reach reserve fuel. (Answer in MINUTES)"
        generateFn={generate}
        validateFn={validate}
        formatQuestion={format}
        unit="min"
    />;
};

// 7. Top of Descent Trainer
const TodTrainer = () => {
    // Distance = (CurrentAlt - TargetAlt) / 1000 * 3
    const generate = () => {
        const target = Math.floor(Math.random() * 5 + 2) * 1000; // 2000-7000 ft
        const current = target + Math.floor(Math.random() * 20 + 10) * 1000; // +10000 to +30000 ft
        return { current, target };
    };

    const format = (q: any) => {
        return <div className="space-y-4">
            <div className="flex justify-between px-8 text-xl">
                <div className="text-center">
                    <div className="font-bold text-slate-500 text-sm">CRZ ALT</div>
                    <div className="text-white">FL{q.current / 100}</div>
                </div>
                <ArrowRight className="text-indigo-400 mt-2" />
                <div className="text-center">
                    <div className="font-bold text-slate-500 text-sm">TGT ALT</div>
                    <div className="text-white">{q.target} ft</div>
                </div>
            </div>
            <div className="text-sm text-indigo-400 mt-2">Distance to Start Descent (3°)?</div>
        </div>;
    };

    const validate = (q: any, ans: string) => {
        const val = parseFloat(ans);
        const diff = q.current - q.target;
        const correct = (diff / 1000) * 3;
        // Allow margin
        return Math.abs(val - correct) <= 3;
    };

    return <TrainerEngine
        title="Top of Descent"
        description="Calculate the distance required for a 3° descent path. (Diff/1000 × 3)"
        generateFn={generate}
        validateFn={validate}
        formatQuestion={format}
        unit="NM"
    />;
};

// 8. Percentage Trainer
const PercentageTrainer = () => {
    // Types: X_PERCENT_OF_Y, INCREASE_X_BY_Y, DECREASE_X_BY_Y
    const generate = () => {
        const type = ['OF', 'INC', 'DEC'][Math.floor(Math.random() * 3)];
        const pct = [5, 10, 15, 20, 25, 50][Math.floor(Math.random() * 6)];
        const val = Math.floor(Math.random() * 20 + 2) * 50; // 100-1000
        return { type, pct, val };
    };

    const format = (q: any) => {
        switch (q.type) {
            case 'OF': return <>{q.pct}% <span className="text-xl text-slate-500">OF</span> {q.val}</>;
            case 'INC': return <>{q.val} <span className="text-xl text-slate-500">+</span> {q.pct}%</>;
            case 'DEC': return <>{q.val} <span className="text-xl text-slate-500">-</span> {q.pct}%</>;
        }
    };

    const validate = (q: any, ans: string) => {
        const val = parseFloat(ans);
        let correct = 0;
        switch (q.type) {
            case 'OF': correct = q.val * (q.pct / 100); break;
            case 'INC': correct = q.val * (1 + q.pct / 100); break;
            case 'DEC': correct = q.val * (1 - q.pct / 100); break;
        }
        return Math.abs(val - correct) < 0.1;
    };

    return <TrainerEngine
        title="Percentages"
        description="Calculate percentages, increases, and decreases."
        generateFn={generate}
        validateFn={validate}
        formatQuestion={format}
    />;
};

// 9. Glide Slope Trainer
const GlideSlopeTrainer = () => {
    // Height = Dist * 300 (or 318)
    // Dist = Height / 300
    const generate = () => {
        // Mode: Find Height or Find Dist? Left's focus on Height vs Dist as it's the check height procedure.
        const dist = Math.floor(Math.random() * 10 + 2); // 2-12 NM
        return { dist };
    };

    const format = (q: any) => {
        return <div className="space-y-2">
            <div>{q.dist} <span className="text-2xl text-slate-500">NM</span></div>
            <div className="text-sm text-violet-400 mt-2">Height AAL (3°)?</div>
        </div>;
    };

    const validate = (q: any, ans: string) => {
        const val = parseFloat(ans);
        const correct300 = q.dist * 300;
        const correct318 = q.dist * 318;
        // Accept either Rule of Thumb (300) or Accurate (318)
        return (val >= correct300 * 0.9 && val <= correct318 * 1.1);
    };

    return <TrainerEngine
        title="3° Glide Slope"
        description="Calculate the standard height for a given distance (Dist × 300)."
        generateFn={generate}
        validateFn={validate}
        formatQuestion={format}
        unit="ft"
    />;
};

// 10. 1 in 60 Trainer
const OneInSixtyTrainer = () => {
    // TE = (Off / Gone) * 60
    // CA = (Off / ToGo) * 60
    const generate = () => {
        const type = Math.random() > 0.5 ? 'TE' : 'CA';
        const off = Math.floor(Math.random() * 5 + 1); // 1-5 NM off
        const dist = Math.floor(Math.random() * 6 + 2) * 10; // 20-80 NM Gone or ToGo
        return { type, off, dist };
    };

    const format = (q: any) => {
        return <div className="space-y-2">
            <div>{q.off} <span className="text-2xl text-slate-500">NM OFF</span></div>
            <div>{q.dist} <span className="text-2xl text-slate-500">{q.type === 'TE' ? 'NM GONE' : 'NM TO GO'}</span></div>
            <div className="text-sm text-yellow-400 mt-2">
                {q.type === 'TE' ? 'Track Error Angle?' : 'Closing Angle?'}
            </div>
        </div>;
    };

    const validate = (q: any, ans: string) => {
        const val = parseFloat(ans);
        const correct = (q.off / q.dist) * 60;
        // Allow small margin
        return Math.abs(val - correct) < 1;
    };

    return <TrainerEngine
        title="1 in 60 Rule"
        description="Calculate Track Error or Closing Angle. (Dist Off / Dist × 60)"
        generateFn={generate}
        validateFn={validate}
        formatQuestion={format}
        unit="°"
    />;
};

// 11. Wind Trainer
const WindTrainer = () => {
    // HW = WindSpd * cos(angle)
    // XW = WindSpd * sin(angle)
    // Use rules of thumb: 
    // 30 deg off = 0.5 XW, 0.9 HW
    // 45 deg off = 0.7 XW, 0.7 HW
    // 60 deg off = 0.9 XW, 0.5 HW
    const generate = () => {
        const angle = [30, 45, 60][Math.floor(Math.random() * 3)];
        const windSpd = Math.floor(Math.random() * 4 + 1) * 10; // 10, 20, 30, 40 KT
        const comp = Math.random() > 0.5 ? 'HW' : 'XW';
        return { angle, windSpd, comp };
    };

    const format = (q: any) => {
        return <div className="space-y-4">
            <div className="flex justify-center items-center gap-2">
                <Wind className="text-slate-500" />
                <span className="text-3xl font-bold">{q.windSpd} KT</span>
            </div>
            <div className="flex justify-center items-center gap-2">
                <Navigation className="text-slate-500" />
                <span className="text-3xl font-bold">{q.angle}° Off</span>
            </div>
            <div className="text-sm text-sky-400 mt-2">
                {q.comp === 'HW' ? 'Headwind Component?' : 'Crosswind Component?'}
            </div>
        </div>;
    };

    const validate = (q: any, ans: string) => {
        const val = parseFloat(ans);
        const rad = q.angle * (Math.PI / 180);
        const exact = q.comp === 'HW' ? q.windSpd * Math.cos(rad) : q.windSpd * Math.sin(rad);

        // Check exact or rule of thumb
        // RoT Factors:
        // 30 deg: HW 0.9 (or 0.86), XW 0.5
        // 45 deg: HW 0.7, XW 0.7
        // 60 deg: HW 0.5, XW 0.9 (or 0.86)

        let rotFactor = 0;
        if (q.angle === 30) rotFactor = q.comp === 'HW' ? 0.9 : 0.5;
        if (q.angle === 45) rotFactor = 0.7;
        if (q.angle === 60) rotFactor = q.comp === 'HW' ? 0.5 : 0.9;

        const rotVal = q.windSpd * rotFactor;

        // Accept if close to either Exact or ROT
        return Math.abs(val - exact) < 3 || Math.abs(val - rotVal) < 3;
    };

    return <TrainerEngine
        title="Wind Components"
        description="Calculate Headwind or Crosswind components using Rules of Thumb (30°=0.5, 45°=0.7, 60°=0.9)."
        generateFn={generate}
        validateFn={validate}
        formatQuestion={format}
        unit="KT"
    />;
};

// Utility Components
const PlaceholderTrainer = ({ title, desc }: { title: string, desc: string }) => (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="p-4 bg-slate-800 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400">{desc}</p>
        </div>
        <button className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-fuchsia-500/25">
            Start Training
        </button>
    </div>
);

export default MentalMathsLab;
