
import React, { useState, useEffect } from 'react';
import { Radio, Zap, ChevronRight, CheckCircle2, AlertTriangle, RefreshCw, Volume2 } from 'lucide-react';

const TransferDrill: React.FC = () => {
    const [activeFreq, setActiveFreq] = useState("118.100");
    const [standbyFreq, setStandbyFreq] = useState("000.000");
    const [targetFreq, setTargetFreq] = useState("");
    const [instruction, setInstruction] = useState("");
    const [feedback, setFeedback] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [isSwapping, setIsSwapping] = useState(false);

    const freqInstructions = [
        { text: "Fastair 345, contact Heathrow Tower 118.705.", freq: "118.705", station: "Heathrow Tower" },
        { text: "Fastair 345, monitor London Control 132.450.", freq: "132.450", station: "London Control" },
        { text: "Fastair 345, contact Information 126.325.", freq: "126.325", station: "Information" },
        { text: "Fastair 345, carry out radio check 121.500.", freq: "121.500", station: "Guard" },
        { text: "Fastair 345, frequency change approved London Radar 123.900.", freq: "123.900", station: "London Radar" },
    ];

    const generateTask = () => {
        const randomIndex = Math.floor(Math.random() * freqInstructions.length);
        const task = freqInstructions[randomIndex];
        setInstruction(task.text);
        setTargetFreq(task.freq);
        setFeedback(null);
        setStandbyFreq("000.000");
    };

    useEffect(() => {
        generateTask();
    }, []);

    const handleKeypad = (val: string) => {
        setStandbyFreq(prev => {
            if (prev === "000.000") return val.padStart(prev.length, '0');
            const clean = prev.replace('.', '');
            const updated = (clean + val).slice(-6);
            return updated.slice(0, 3) + '.' + updated.slice(3);
        });
    };

    const handleSwap = () => {
        setIsSwapping(true);
        setTimeout(() => {
            const oldActive = activeFreq;
            setActiveFreq(standbyFreq);
            setStandbyFreq(oldActive);
            setIsSwapping(false);

            if (standbyFreq === targetFreq) {
                setScore(prev => prev + 10);
                setFeedback("Correct Handover!");
                setTimeout(generateTask, 2000);
            } else {
                setFeedback("Wrong frequency on Active!");
            }
        }, 500);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-8 border-b border-slate-800 bg-slate-800/50 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-white flex items-center gap-3">
                            <Radio className="text-blue-400" /> Radio Management Panel
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">Master frequency transfer procedures (090.02.01.08)</p>
                    </div>
                    <div className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-xl border border-blue-500/30 font-mono font-bold">
                        Score: {score}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Simulator Side */}
                    <div className="p-8 border-r border-slate-800">
                        <div className="bg-slate-950 rounded-2xl p-8 border-4 border-slate-800 shadow-inner space-y-8">
                            {/* Freq Display */}
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="text-[10px] text-emerald-500 font-bold mb-1 uppercase tracking-tighter">Active</div>
                                    <div className="bg-black/50 p-4 rounded-xl border border-emerald-500/20">
                                        <div className={`text-3xl font-mono text-emerald-400 text-center tracking-widest ${isSwapping ? 'animate-pulse' : ''}`}>
                                            {activeFreq}
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 text-slate-700">
                                    <RefreshCw className={`animate-spin-slow ${isSwapping ? 'text-blue-500' : ''}`} />
                                </div>
                                <div className="flex-1">
                                    <div className="text-[10px] text-blue-400 font-bold mb-1 uppercase tracking-tighter">Standby</div>
                                    <div className="bg-black/50 p-4 rounded-xl border border-blue-500/20">
                                        <div className="text-3xl font-mono text-blue-400 text-center tracking-widest">
                                            {standbyFreq}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Keypad */}
                            <div className="grid grid-cols-3 gap-3">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'CLR'].map(key => (
                                    <button
                                        key={key.toString()}
                                        onClick={() => key === 'CLR' ? setStandbyFreq("000.000") : handleKeypad(key.toString())}
                                        className="py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 font-mono font-bold shadow-lg transition-transform active:scale-95"
                                    >
                                        {key}
                                    </button>
                                ))}
                                <button
                                    onClick={handleSwap}
                                    className="col-span-3 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-black uppercase tracking-tighter shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <RefreshCw size={20} /> Transfer / Swap
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Instruction Side */}
                    <div className="p-8 flex flex-col">
                        <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 flex-grow relative overflow-hidden group">
                            <div className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Volume2 size={16} /> Incoming ATC Message
                            </div>
                            <p className="text-xl font-medium text-slate-100 italic leading-relaxed mb-8">
                                "{instruction}"
                            </p>

                            <div className="space-y-4">
                                <div className="text-xs font-bold text-slate-500 uppercase">Procedure Steps:</div>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-sm text-slate-300">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${standbyFreq !== "000.000" ? 'bg-emerald-500 text-white' : 'bg-slate-700'}`}>1</div>
                                        Set frequency on <span className="text-blue-400 font-bold">Standby</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-slate-300">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isSwapping ? 'bg-emerald-500 text-white' : 'bg-slate-700'}`}>2</div>
                                        Press <span className="text-slate-100 font-bold uppercase">Transfer</span> button
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-slate-300">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${activeFreq === targetFreq ? 'bg-emerald-500 text-white' : 'bg-slate-700'}`}>3</div>
                                        Establish contact on <span className="text-emerald-400 font-bold">Active</span>
                                    </li>
                                </ul>
                            </div>

                            {feedback && (
                                <div className={`mt-8 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 z-10 relative ${feedback.includes('Correct') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                    }`}>
                                    {feedback.includes('Correct') ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                                    <span className="font-bold text-sm tracking-tight">{feedback}</span>
                                </div>
                            )}

                            <div className="absolute -bottom-8 -right-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Zap size={200} />
                            </div>
                        </div>

                        <button
                            onClick={generateTask}
                            className="mt-6 py-4 border border-slate-700 hover:bg-slate-800 text-slate-400 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all hover:text-white"
                        >
                            Skip Task / Next Station
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransferDrill;
