import React, { useState } from 'react';
import { Database, Calendar, Clock, FileCheck, Search, Bell } from 'lucide-react';

const AirLawAISDeepDive: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(42); // Default to Distribution Day

    const getTimeStep = () => {
        if (currentTime < 28) return airacCycle[0];
        if (currentTime < 42) return airacCycle[1];
        if (currentTime < 56) return airacCycle[2];
        return airacCycle[3];
    };

    const airacCycle = [
        { day: 1, title: 'Submission', desc: 'Raw data submitted to AIS by originators.', color: 'blue' },
        { day: 28, title: 'Final Review', desc: 'Data verified and compiled into datasets.', color: 'amber' },
        { day: 42, title: 'Distribution', desc: 'AIP Amendments and circulars published.', color: 'emerald' },
        { day: 56, title: 'Effective Date', desc: 'Changes become active for operational use.', color: 'red' },
    ];

    const activeStep = getTimeStep();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 animate-in fade-in duration-500">
            <header className="max-w-6xl mx-auto mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-red-500/20 text-red-500 rounded-2xl border border-red-500/30">
                        <Database size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">AIS & AIRAC Deep Dive</h1>
                        <p className="text-slate-500 text-sm uppercase tracking-widest font-semibold">
                            Aeronautical Information Service Cycle
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto space-y-12">
                {/* AIRAC Timeline */}
                <section className="bg-slate-900/30 border border-white/5 p-8 rounded-3xl">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                                <Calendar className="text-blue-400" size={20} />
                                AIRAC Time Traveler
                            </h2>
                            <p className="text-slate-500 text-sm">Slide to see how data moves through the 56-day cycle.</p>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-mono font-bold text-red-500">Day {currentTime}</div>
                            <div className="text-xs text-slate-600 font-bold uppercase tracking-tighter">Current Phase</div>
                        </div>
                    </div>

                    <div className="mb-12">
                        <input
                            type="range" min="1" max="56" value={currentTime}
                            onChange={(e) => setCurrentTime(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                        />
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 relative">
                        {airacCycle.map((step, i) => {
                            const isActive = currentTime >= step.day;
                            const isExact = activeStep.day === step.day;
                            return (
                                <div key={i} className={`relative z-10 flex flex-col items-center text-center transition-all duration-500 ${isExact ? 'scale-105' : 'opacity-40 grayscale'}`}>
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 border-slate-950 mb-4 transition-all ${isActive ? `bg-${step.color}-500 text-white shadow-lg shadow-${step.color}-500/20` : 'bg-slate-800 text-slate-500'}`}>
                                        <Clock size={24} />
                                    </div>
                                    <h3 className={`font-bold mb-1 ${isExact ? 'text-white' : 'text-slate-400'}`}>{step.title}</h3>
                                    <div className="text-[10px] font-mono mb-2 text-slate-600">Day {step.day}</div>
                                    <p className="text-xs text-slate-500 px-4 leading-relaxed">{step.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* NOTAM Breakdown */}
                <section className="grid md:grid-cols-2 gap-8">
                    <div className="bg-slate-900/50 border border-white/5 p-8 rounded-3xl">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Bell className="text-amber-500" size={20} />
                            NOTAM Series & Codes
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                                <span className="text-red-500 font-mono font-bold mr-2">A)</span>
                                <span className="text-sm text-slate-400 font-mono">ICAO Location Indicator (e.g., EGLL)</span>
                            </div>
                            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                                <span className="text-red-500 font-mono font-bold mr-2">B)</span>
                                <span className="text-sm text-slate-400 font-mono">Start of validity (YYMMDDHHMM)</span>
                            </div>
                            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                                <span className="text-red-500 font-mono font-bold mr-2">C)</span>
                                <span className="text-sm text-slate-400 font-mono">End of validity (YYMMDDHHMM or PERM)</span>
                            </div>
                            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                                <span className="text-red-500 font-mono font-bold mr-2">E)</span>
                                <span className="text-sm text-slate-400 font-mono">NOTAM text (Plain language descriptions)</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <FileCheck className="text-green-500" size={20} />
                            Aeronautical Information Products
                        </h3>
                        <div className="grid grid-cols-1 gap-4 flex-1">
                            {[
                                { title: 'AIP', desc: 'Basic info of lasting character.' },
                                { title: 'AIC', desc: 'Explains technical or safety info not suitable for AIP.' },
                                { title: 'AIP Supplements', desc: 'Temporary changes of long duration.' },
                                { title: 'NOTAM', desc: 'Time-critical information of short duration.' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-red-500/30 transition-all cursor-pointer group">
                                    <div>
                                        <div className="font-bold group-hover:text-red-400 transition-colors uppercase tracking-widest text-xs">{item.title}</div>
                                        <div className="text-xs text-slate-500 tracking-tight">{item.desc}</div>
                                    </div>
                                    <Clock size={16} className="text-slate-700" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AirLawAISDeepDive;
