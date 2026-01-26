import React, { useState } from 'react';
import { Plane, AlertTriangle, CheckCircle, Info, ArrowRightLeft, MoveDown, Compass } from 'lucide-react';

const AirLawRightOfWay: React.FC = () => {
    const [scenario, setScenario] = useState<'head-on' | 'converging' | 'overtaking'>('head-on');

    const scenarios = {
        'head-on': {
            title: 'Head-On Approach',
            rule: 'Both aircraft shall alter course to the right.',
            visual: 'Two aircraft flying directly toward each other, then banking right.',
            icon: ArrowRightLeft
        },
        'converging': {
            title: 'Converging Paths',
            rule: 'The aircraft that has the other on its right shall give way.',
            visual: 'Aircraft A (right) precedes. Aircraft B (left) yields.',
            icon: MoveDown
        },
        'overtaking': {
            title: 'Overtaking',
            rule: 'The aircraft being overtaken has the right-of-way. Overtaking aircraft passes to the right.',
            visual: 'One aircraft approaching from behind, moving to the right to pass.',
            icon: Compass
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 animate-in fade-in duration-500">
            <header className="max-w-6xl mx-auto mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-red-500/20 text-red-500 rounded-2xl border border-red-500/30">
                        <Plane size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Right of Way Rules</h1>
                        <p className="text-slate-500 text-sm uppercase tracking-widest font-semibold flex items-center gap-2">
                            ICAO ANNEX 2 - RULES OF THE AIR
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto space-y-12">
                {/* Control Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {Object.entries(scenarios).map(([id, data]) => (
                        <button
                            key={id}
                            onClick={() => setScenario(id as any)}
                            className={`p-6 rounded-3xl border transition-all text-left group ${scenario === id ? 'bg-red-600 border-red-500 shadow-xl shadow-red-600/20' : 'bg-slate-900 border-white/5 hover:border-red-500/50'}`}
                        >
                            <div className={`p-3 rounded-2xl w-fit mb-4 ${scenario === id ? 'bg-white/20' : 'bg-slate-800 group-hover:bg-red-500/20 group-hover:text-red-500 transition-colors'}`}>
                                <data.icon size={24} />
                            </div>
                            <h3 className={`font-bold text-lg mb-1 ${scenario === id ? 'text-white' : 'text-slate-300'}`}>{data.title}</h3>
                            <p className={`text-xs ${scenario === id ? 'text-red-100' : 'text-slate-500'}`}>ICAO Standard Procedure</p>
                        </button>
                    ))}
                </div>

                {/* Visualizer Area */}
                <div className="bg-slate-900 border border-white/5 rounded-[40px] overflow-hidden shadow-2xl relative min-h-[400px] flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent opacity-50"></div>

                    <div className="relative z-10 text-center max-w-2xl px-8">
                        <div className="mb-12 flex justify-center gap-12">
                            {/* Simple Logic driven visuals */}
                            {scenario === 'head-on' && (
                                <div className="flex items-center gap-24 animate-in slide-in-from-top-12 duration-700">
                                    <div className="rotate-90"><Plane size={64} className="text-red-500" /></div>
                                    <div className="-rotate-90"><Plane size={64} className="text-blue-500" /></div>
                                </div>
                            )}
                            {scenario === 'converging' && (
                                <div className="flex gap-24 relative animate-in zoom-in duration-700">
                                    <div className="translate-y-12"><Plane size={64} className="text-red-500 rotate-45" /></div>
                                    <div className="-translate-x-12"><Plane size={64} className="text-blue-500 -rotate-45" /></div>
                                </div>
                            )}
                            {scenario === 'overtaking' && (
                                <div className="flex flex-col items-center gap-12 animate-in slide-in-from-bottom-12 duration-700">
                                    <Plane size={64} className="text-blue-500" />
                                    <Plane size={64} className="text-red-500 translate-x-8" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-2xl font-bold text-white">{scenarios[scenario].title}</h4>
                            <div className="p-6 bg-slate-950/80 rounded-2xl border border-slate-800 text-slate-400 italic leading-relaxed">
                                {scenarios[scenario].rule}
                            </div>
                            <div className="flex flex-wrap justify-center gap-3">
                                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 text-xs font-bold uppercase tracking-widest">
                                    <CheckCircle size={14} /> Clear of Conflict
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-xs font-bold uppercase tracking-widest">
                                    <AlertTriangle size={14} /> See & Avoid
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Rules Section */}
                <section className="bg-slate-900/50 border border-white/5 p-8 rounded-3xl">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Info className="text-blue-400" size={20} />
                        Priority Hierarchy
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Balloons', priority: 1 },
                            { label: 'Gliders', priority: 2 },
                            { label: 'Airships', priority: 3 },
                            { label: 'Power-driven', priority: 4 }
                        ].map(item => (
                            <div key={item.label} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center">
                                <div className="text-[10px] text-slate-600 font-bold uppercase mb-1">Priority {item.priority}</div>
                                <div className="font-bold text-slate-300">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AirLawRightOfWay;
