
import React, { useState, useEffect } from 'react';
import { Cloud, Wind, Eye, Droplets, Thermometer, Database, CheckCircle2, AlertTriangle, Send, RefreshCcw } from 'lucide-react';

const MetarBuilder: React.FC = () => {
    const [task, setTask] = useState<any>(null);
    const [userInput, setUserInput] = useState(["", "", "", "", "", ""]); // Station, Time, Wind, Vis, Cloud, Temp
    const [feedback, setFeedback] = useState<string | null>(null);
    const [score, setScore] = useState(0);

    const tasks = [
        {
            desc: {
                station: "London Heathrow",
                time: "12:50 UTC",
                wind: "West at 15 knots",
                vis: "10km or more",
                clouds: "Few at 3000ft",
                temp: "15°C / Dew point 10°C"
            },
            solution: ["EGLL", "1250Z", "27015KT", "9999", "FEW030", "15/10"]
        },
        {
            desc: {
                station: "Paris CDG",
                time: "08:20 UTC",
                wind: "Variable at 3 knots",
                vis: "4000 meters",
                clouds: "Overcast at 500ft",
                temp: "05°C / Dew point 04°C"
            },
            solution: ["LFPG", "0820Z", "VRB03KT", "4000", "OVC005", "05/04"]
        },
        {
            desc: {
                station: "Amsterdam Schiphol",
                time: "23:50 UTC",
                wind: "North at 20 knots gusting 30",
                vis: "800 meters in fog",
                clouds: "Vertical Visibility 200ft",
                temp: "-02°C / Dew point -03°C"
            },
            solution: ["EHAM", "2350Z", "36020G30KT", "0800", "VV002", "M02/M03"]
        }
    ];

    const generateTask = () => {
        const randomIndex = Math.floor(Math.random() * tasks.length);
        setTask(tasks[randomIndex]);
        setUserInput(["", "", "", "", "", ""]);
        setFeedback(null);
    };

    useEffect(() => {
        generateTask();
    }, []);

    const checkSolution = () => {
        const isCorrect = userInput.every((val, i) => val.toUpperCase() === task.solution[i]);
        if (isCorrect) {
            setScore(prev => prev + 20);
            setFeedback("METAR Validated - Excellent work!");
        } else {
            setFeedback("Format Error - Check your codes.");
        }
    };

    const InputBox = ({ index, label, icon: Icon, placeholder }: any) => (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Icon size={12} className="text-blue-400" /> {label}
            </label>
            <input
                type="text"
                value={userInput[index]}
                onChange={(e) => {
                    const next = [...userInput];
                    next[index] = e.target.value;
                    setUserInput(next);
                }}
                placeholder={placeholder}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 font-mono text-emerald-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-800"
            />
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8">
            <div className="bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-8 bg-gradient-to-r from-slate-900 to-indigo-950 border-b border-slate-800 flex justify-between items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black rounded-full mb-3 uppercase tracking-tighter">
                            Subject 090.03/07
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight">METAR Generator</h1>
                        <p className="text-slate-400 text-sm mt-1">Convert descriptive weather into standard ICAO codes.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Total Score</div>
                        <div className="text-4xl font-black text-blue-400 tracking-tighter tabular-nums">{score}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
                    {/* Weather Data Card */}
                    <div className="lg:col-span-2 p-8 bg-slate-800/30 border-r border-slate-800">
                        <h2 className="text-sm font-black text-slate-100 uppercase tracking-widest mb-6 border-l-4 border-blue-500 pl-4">Met Briefing</h2>
                        <div className="space-y-6">
                            <div className="flex gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
                                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 h-fit"><Database size={20} /></div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Station & Time</div>
                                    <div className="text-white font-medium">{task?.desc.station} @ {task?.desc.time}</div>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
                                <div className="p-3 bg-sky-500/10 rounded-xl text-sky-400 h-fit"><Wind size={20} /></div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Wind & Velocity</div>
                                    <div className="text-white font-medium">{task?.desc.wind}</div>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
                                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 h-fit"><Eye size={20} /></div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Visibility & Phenomena</div>
                                    <div className="text-white font-medium">{task?.desc.vis}</div>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
                                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 h-fit"><Cloud size={20} /></div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Cloud Coverage</div>
                                    <div className="text-white font-medium">{task?.desc.clouds}</div>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
                                <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400 h-fit"><Thermometer size={20} /></div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Temp / Dew Point</div>
                                    <div className="text-white font-medium">{task?.desc.temp}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Builder Canvas */}
                    <div className="lg:col-span-3 p-8 flex flex-col bg-slate-950/20">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                            <InputBox index={0} label="ID" icon={Database} placeholder="EGLL" />
                            <InputBox index={1} label="Time" icon={Database} placeholder="1250Z" />
                            <InputBox index={2} label="Wind" icon={Wind} placeholder="27015KT" />
                            <InputBox index={3} label="Vis" icon={Eye} placeholder="9999" />
                            <InputBox index={4} label="Clouds" icon={Cloud} placeholder="FEW030" />
                            <InputBox index={5} label="Temp" icon={Thermometer} placeholder="15/10" />
                        </div>

                        {/* Constructed Preview */}
                        <div className="flex-grow flex flex-col items-center justify-center p-8 bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-800 mb-8 overflow-hidden relative group">
                            <div className="absolute top-4 left-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">METAR String Preview</div>
                            <div className="text-3xl md:text-4xl font-mono text-emerald-400/80 tracking-widest flex flex-wrap justify-center gap-x-4">
                                {userInput.map((u, i) => (
                                    <span key={i} className={u ? "text-emerald-400" : "text-slate-800"}>
                                        {u.toUpperCase() || "____"}
                                    </span>
                                ))}
                            </div>

                            {feedback && (
                                <div className={`mt-12 p-5 rounded-2xl flex items-center gap-4 animate-in zoom-in-95 duration-300 ${feedback.includes('Validated') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    }`}>
                                    {feedback.includes('Validated') ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                                    <span className="font-black text-lg tracking-tight italic">{feedback}</span>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={checkSolution}
                                className="flex-1 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                <Send size={20} /> Validate Meteorological Report
                            </button>
                            <button
                                onClick={generateTask}
                                className="p-5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all border border-slate-700 active:scale-95"
                            >
                                <RefreshCcw size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetarBuilder;
