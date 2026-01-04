
import React, { useState } from 'react';
import { Compass, RotateCw, MoveRight, AlertTriangle } from 'lucide-react';

const HPLVestibular: React.FC = () => {
    const [tab, setTab] = useState<'leans' | 'coriolis' | 'somato'>('leans');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Compass className="text-rose-400" />
                        Vestibular Illusions
                    </h2>
                    <p className="text-slate-400 text-sm">Spatial Disorientation and the "Seat of the Pants".</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setTab('leans')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'leans' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}>The Leans</button>
                    <button onClick={() => setTab('coriolis')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'coriolis' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}>Coriolis</button>
                    <button onClick={() => setTab('somato')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'somato' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}>Somatogravic</button>
                </div>
            </div>

            {tab === 'leans' && <TheLeans />}
            {tab === 'coriolis' && <CoriolisEffect />}
            {tab === 'somato' && <Somatogravic />}
        </div>
    );
};

const TheLeans = () => (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-4">The Leans</h3>
            <p className="text-sm text-slate-300 mb-4">
                The most common illusion. Caused by the <strong>Threshold of Perception</strong> (~2&deg;/s).
            </p>

            <div className="space-y-4">
                <div className="bg-slate-800 p-4 rounded relative">
                    <span className="absolute top-2 right-2 text-xs font-bold text-rose-400">Step 1</span>
                    <p className="text-xs text-slate-300 font-bold mb-1">Sub-Threshold Entry</p>
                    <p className="text-xs text-slate-400">
                        Pilot enters a gentle turn (&lt;2&deg;/sec). Fluid in ear does not move (inertia).
                        <br />
                        <strong>Result:</strong> Pilot thinks wings are LEVEL.
                    </p>
                </div>
                <div className="bg-slate-800 p-4 rounded relative">
                    <span className="absolute top-2 right-2 text-xs font-bold text-rose-400">Step 2</span>
                    <p className="text-xs text-slate-300 font-bold mb-1">Rapid Correction</p>
                    <p className="text-xs text-slate-400">
                        Pilot notices turn on instruments and corrects quickly. Fluid moves.
                        <br />
                        <strong>Result:</strong> Pilot feels a turn in the OPPOSITE direction.
                    </p>
                </div>
                <div className="bg-slate-800 p-4 rounded relative border-l-4 border-rose-500">
                    <span className="absolute top-2 right-2 text-xs font-bold text-rose-400">Step 3</span>
                    <p className="text-xs text-slate-300 font-bold mb-1">The Response</p>
                    <p className="text-xs text-slate-400">
                        Pilot leans away from the false sensation to "verticalize" themselves, or re-enters the turn to feel comfortable.
                    </p>
                </div>
            </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
            {/* Visual Aid */}
            <div className="mb-4 text-center">
                <div className="inline-block p-4 bg-slate-800 rounded-full mb-2">
                    <RotateCw size={48} className="text-rose-400" />
                </div>
                <p className="text-xs text-slate-400 text-center max-w-xs mx-auto">
                    Semicircular canals only detect <strong>acceleration</strong>, not steady turns.
                </p>
            </div>
        </div>
    </div>
);

const CoriolisEffect = () => (
    <div className="animate-in fade-in space-y-6">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-4">Coriolis Effect</h3>
            <div className="flex items-start gap-4">
                <div className="p-3 bg-rose-900/20 rounded-full border border-rose-500/50">
                    <AlertTriangle className="text-rose-500" />
                </div>
                <div>
                    <p className="text-sm text-slate-300 mb-2">
                        The most dangerous illusion. Can cause overwhelming disorientation and nausea ("The Bends" of the ear).
                    </p>
                    <div className="bg-slate-800 p-4 rounded text-xs text-slate-400">
                        <strong>Condition:</strong> Aircraft is already turning (Steady turn). One set of canals is stabilised.
                        <br /><br />
                        <strong>Trigger:</strong> Pilot moves head in a different plane (e.g., looking down at fuel selector).
                        <br /><br />
                        <strong>Result:</strong> Simultaneous stimulation of two canals causes a "Tumbling" sensation.
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const Somatogravic = () => (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-4">Somatogravic Illusion</h3>
            <p className="text-sm text-slate-300 mb-6">
                Confusion between <strong>Acceleration</strong> and <strong>Gravity</strong> (Tilt). The Otoliths cannot distinguish between the two.
            </p>

            <div className="space-y-4">
                <div className="p-4 bg-sky-900/20 border border-sky-500/50 rounded-lg">
                    <h4 className="font-bold text-white text-sm">Take-off (Rapid Acceleration)</h4>
                    <p className="text-xs text-slate-300 mt-1">
                        Body feels pushed BACK into seat.
                        <br />
                        <strong>Brain Interprets:</strong> "We are pitching UP".
                        <br />
                        <strong>Danger:</strong> Pilot pushes nose DOWN (into terrain).
                    </p>
                </div>

                <div className="p-4 bg-purple-900/20 border border-purple-500/50 rounded-lg">
                    <h4 className="font-bold text-white text-sm">Deceleration</h4>
                    <p className="text-xs text-slate-300 mt-1">
                        Body feels thrown FORWARD.
                        <br />
                        <strong>Brain Interprets:</strong> "We are pitching DOWN".
                        <br />
                        <strong>Danger:</strong> Pilot puls nose UP (Stall).
                    </p>
                </div>
            </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 border-b-2 border-slate-600">
                {/* Vector Diagram */}
                <div className="absolute bottom-0 left-0 w-1 h-32 bg-slate-500 flex flex-col items-center justify-end">
                    <span className="text-[10px] text-slate-400 -mt-4">Gravity</span>
                </div>
                <div className="absolute bottom-0 left-0 h-1 w-32 bg-sky-500 flex items-center justify-end">
                    <span className="text-[10px] text-sky-400 ml-2">Accel -&gt;</span>
                </div>
                <div className="absolute bottom-0 left-0 w-1 h-44 bg-rose-500 origin-bottom transform rotate-45 opacity-80"></div>
                <span className="absolute top-10 right-10 text-rose-400 text-xs font-bold">Resultant Vector</span>
            </div>
            <p className="text-xs text-slate-400 mt-4 text-center">
                The brain assumes gravity is always "Down". When acceleration adds a backward force, the brain resolves the vector by assuming the pilot has tilted backwards (Pitched up).
            </p>
        </div>
    </div>
);

export default HPLVestibular;
