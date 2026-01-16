
import React, { useState, useEffect } from 'react';
import { Crosshair, Navigation, RotateCw, Activity, CheckCircle2, AlertTriangle, Mic } from 'lucide-react';

const RadarVectors: React.FC = () => {
    const [heading, setHeading] = useState(360);
    const [targetHeading, setTargetHeading] = useState(360);
    const [instruction, setInstruction] = useState<any>(null);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isRotating, setIsRotating] = useState(false);

    const instructions = [
        { text: "Fastair 345, turn left heading 270.", target: 270, type: 'HEADING', phrase: "Left heading 270, Fastair 345" },
        { text: "Fastair 345, turn right heading 090.", target: 90, type: 'HEADING', phrase: "Right heading 090, Fastair 345" },
        { text: "Fastair 345, fly heading 180.", target: 180, type: 'HEADING', phrase: "Heading 180, Fastair 345" },
        { text: "Fastair 345, maintain speed 220 knots.", target: 220, type: 'SPEED', phrase: "Maintain 220 knots, Fastair 345" },
        { text: "Fastair 345, climb FL100.", target: 100, type: 'ALTITUDE', phrase: "Climbing Flight Level 100, Fastair 345" },
    ];

    const generateInstruction = () => {
        const randomIndex = Math.floor(Math.random() * instructions.length);
        setInstruction(instructions[randomIndex]);
        setFeedback(null);
    };

    useEffect(() => {
        generateInstruction();
    }, []);

    const handleReadback = (phrase: string) => {
        if (phrase === instruction.phrase) {
            setScore(prev => prev + 10);
            setFeedback("Correct Readback!");
            if (instruction.type === 'HEADING') {
                setTargetHeading(instruction.target);
                setIsRotating(true);
            }
            setTimeout(() => {
                generateInstruction();
                setIsRotating(false);
            }, 2000);
        } else {
            setFeedback("Incorrect Readback. Try again.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Radar Display */}
                <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden relative aspect-square flex items-center justify-center p-8">
                    {/* Radar Grid */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute inset-0 border border-emerald-500/30 rounded-full m-4"></div>
                        <div className="absolute inset-0 border border-emerald-500/30 rounded-full m-24"></div>
                        <div className="absolute inset-0 border border-emerald-500/30 rounded-full m-44"></div>
                        <div className="absolute top-1/2 left-0 w-full h-px bg-emerald-500/30"></div>
                        <div className="absolute left-1/2 top-0 w-px h-full bg-emerald-500/30"></div>
                        {/* Degrees */}
                        {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                            <div
                                key={deg}
                                className="absolute top-1/2 left-1/2 h-[50%] w-px bg-emerald-500/20 origin-top text-[10px] text-emerald-400 font-mono"
                                style={{ transform: `rotate(${deg}deg)` }}
                            >
                                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2">{deg.toString().padStart(3, '0')}</span>
                            </div>
                        ))}
                    </div>

                    {/* Radar Sweep */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent w-1/2 h-full origin-right animate-[spin_4s_linear_infinite] pointer-events-none"></div>

                    {/* Aircraft Icon */}
                    <div
                        className="relative z-10 transition-all duration-[2000ms] ease-in-out"
                        style={{ transform: `rotate(${targetHeading}deg)` }}
                    >
                        <div className="relative group">
                            <Navigation className="text-emerald-400 fill-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" size={32} />

                            {/* Data Block */}
                            <div className="absolute -top-12 -right-16 bg-slate-800/80 backdrop-blur-md border border-emerald-500/30 p-2 rounded text-[10px] font-mono text-emerald-400 animate-pulse">
                                <div>FA345</div>
                                <div>FL120 250KT</div>
                                <div>HDG {targetHeading.toString().padStart(3, '0')}</div>
                            </div>
                        </div>
                    </div>

                    {/* Heading Bug */}
                    <div
                        className="absolute inset-0 pointer-events-none border-2 border-dashed border-emerald-500/10 rounded-full m-2"
                        style={{ transform: `rotate(${targetHeading}deg)` }}
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 w-3 h-3 rotate-45"></div>
                    </div>
                </div>

                {/* Control Panel */}
                <div className="flex flex-col gap-6">
                    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Crosshair className="text-blue-400" /> Control Tower
                            </h2>
                            <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-bold border border-blue-500/30">
                                Score: {score}
                            </div>
                        </div>

                        {/* ATC Instruction Area */}
                        <div className="bg-slate-900 rounded-xl p-5 border border-slate-700 mb-6 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 group-hover:w-2 transition-all"></div>
                            <div className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                                <Activity size={12} className="text-emerald-500" /> Incoming Transmission
                            </div>
                            <p className="text-blue-100 font-mono text-lg italic leading-relaxed">
                                {instruction?.text}
                            </p>
                        </div>

                        {/* Phraseology Options */}
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Select Readback:</p>
                            {[instruction?.phrase,
                                "Roger, turning now, Fastair 345.",
                            `Heading ${instruction?.target}, Fastair 345`,
                                "Wilco, Fastair 345"
                            ].sort(() => Math.random() - 0.5).map((p, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleReadback(p)}
                                    className="w-full text-left p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-xl transition-all group flex items-center justify-between"
                                >
                                    <span className="text-sm text-slate-200 font-medium group-hover:text-white transition-colors">
                                        "{p}"
                                    </span>
                                    <Mic size={16} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
                                </button>
                            ))}
                        </div>

                        {/* Feedback Overlay */}
                        {feedback && (
                            <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${feedback.includes('Correct') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}>
                                {feedback.includes('Correct') ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                                <span className="font-bold text-sm">{feedback}</span>
                            </div>
                        )}
                    </div>

                    {/* Instructions Section */}
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                            <Navigation size={14} className="text-blue-400" /> Radar Procedures
                        </h3>
                        <div className="space-y-4 text-xs text-slate-400 leading-relaxed">
                            <div className="flex gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg h-fit text-blue-400">01</div>
                                <p><span className="text-blue-300 font-bold">Standard Phrases:</span> Always include your callsign. Maintain strict readback of headings and speeds.</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-lg h-fit text-emerald-400">02</div>
                                <p><span className="text-emerald-300 font-bold">Vectoring:</span> Instructions like "Turn Left" or "Turn Right" specify the direction of the turn to ensure traffic separation.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RadarVectors;
