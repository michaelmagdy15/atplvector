import React, { useState } from 'react';
import { Radar, Eye, Brain, Play, AlertCircle } from 'lucide-react';

const HPLSituationAwareness: React.FC = () => {
    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Radar className="text-teal-400" />
                Situation Awareness (SA)
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
                <EndsleyModel />
                <SADemons />
            </div>
        </div>
    );
};

const EndsleyModel = () => {
    const [level, setLevel] = useState(0);

    const steps = [
        {
            lvl: 1, name: 'Perception', question: 'WHAT is happening?',
            desc: 'Scanning dials, hearing ATC, feeling vibrations. Gathering raw data.',
            fail: 'Failure to monitor, distractions, poor scan.',
            color: 'bg-blue-600'
        },
        {
            lvl: 2, name: 'Comprehension', question: 'What does it MEAN?',
            desc: 'Synthesizing the data. "Fuel is low" + "Headwind is strong" = "I might not make it".',
            fail: 'Poor mental model, lack of knowledge.',
            color: 'bg-indigo-600'
        },
        {
            lvl: 3, name: 'Projection', question: 'What will happen NEXT?',
            desc: 'Thinking ahead of the aircraft. "In 10 mins I will be over the mountains with low fuel".',
            fail: 'Living in the now, reacting instead of anticipating.',
            color: 'bg-purple-600'
        },
    ];

    return (
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="text-xl font-bold text-teal-400 mb-4">Endsley's 3 Levels</h3>

            <div className="relative flex flex-col gap-4 mb-6">
                {steps.map((s, i) => (
                    <div
                        key={i}
                        onClick={() => setLevel(i)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${level === i ? `${s.color} border-white shadow-lg` : 'bg-slate-800 border-slate-600 opacity-60'}`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-black text-xl text-white/20">Level {s.lvl}</span>
                            <span className="font-bold text-white">{s.name}</span>
                        </div>
                        <p className="text-xs text-white/90 font-mono mb-2">"{s.question}"</p>
                        {level === i && (
                            <div className="animate-in fade-in pt-2 border-t border-white/20">
                                <p className="text-xs text-white mb-2">{s.desc}</p>
                                <p className="text-[10px] text-red-200 bg-red-900/40 p-1 rounded">
                                    <strong>Failure:</strong> {s.fail}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <p className="text-xs text-center text-slate-500 italic">
                You cannot have Level 3 without Level 2, and cannot have Level 2 without Level 1.
            </p>
        </div>
    );
};

const SADemons = () => {
    return (
        <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Eye size={20} className="text-red-400" />
                    Cues of Lost SA
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                    If you experience these, your reality does not match the actual situation.
                </p>
                <div className="grid grid-cols-2 gap-3">
                    {['Ambiguity', 'Fixation', 'Confusion', 'Unresolved Discrepancies'].map((cue) => (
                        <div key={cue} className="bg-slate-800 p-2 rounded text-xs font-bold text-red-300 border border-red-900/50 flex items-center justify-center text-center h-12">
                            {cue}
                        </div>
                    ))}
                </div>
                <div className="mt-4 p-3 bg-teal-900/20 border border-teal-500/30 rounded">
                    <h4 className="font-bold text-teal-400 text-sm mb-1">Recovery (Regaining SA)</h4>
                    <ol className="list-decimal pl-4 text-xs text-teal-200">
                        <li><strong>Communicate:</strong> "I am not sure where we are."</li>
                        <li><strong>Stable Platform:</strong> Fly straight and level. Climb to safe altitude.</li>
                        <li><strong>Rebuild:</strong> Go back to basics (Level 1).</li>
                    </ol>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Brain size={20} className="text-orange-400" />
                    Mental Workload
                </h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Under-load</span>
                            <span>Optimal</span>
                            <span>Over-load</span>
                        </div>
                        <div className="h-4 bg-gradient-to-r from-blue-900 via-emerald-600 to-red-900 rounded-full w-full relative">
                            <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-white shadow-[0_0_10px_white]"></div>
                        </div>
                        <p className="text-center text-xs text-slate-500 mt-2">Yerkes-Dodson Law (Inverted U-Curve)</p>
                    </div>

                    <div className="p-3 bg-slate-800 rounded border border-slate-600">
                        <h4 className="font-bold text-white text-sm">Load Shedding</h4>
                        <p className="text-xs text-slate-400 mt-1">
                            When overloaded, the brain involuntarily drops tasks. Peripheral vision goes first (Tunnel Vision), then auditory processing (Deafness).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HPLSituationAwareness;
