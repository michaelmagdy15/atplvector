
import React, { useState } from 'react';
import { Ruler, Eye, MousePointer2 } from 'lucide-react';

const HPLErgonomics: React.FC = () => {
    const [tab, setTab] = useState<'anthro' | 'dep' | 'bio'>('anthro');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Ruler className="text-indigo-400" />
                        Ergonomics & Design (040.01)
                    </h2>
                    <p className="text-slate-400 text-sm">Anthropometry, Design Eye Position (DEP), and Controls.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setTab('anthro')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'anthro' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Anthropometry</button>
                    <button onClick={() => setTab('dep')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'dep' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Eye Position</button>
                    <button onClick={() => setTab('bio')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'bio' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Biomechanics</button>
                </div>
            </div>

            {tab === 'anthro' && <Anthropometry />}
            {tab === 'dep' && <DesignEyePosition />}
            {tab === 'bio' && <Biomechanics />}
        </div>
    );
};

const Anthropometry = () => (
    <div className="animate-in fade-in">
        <h3 className="text-xl font-bold text-white mb-6">Anthropometry (Human Measurement)</h3>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white mb-4">"The Average Pilot"</h4>
                <p className="text-sm text-slate-300 mb-6">
                    A cockpit cannot be designed to fit 100% of the population. It is impossible.
                </p>

                <div className="space-y-4">
                    <div className="p-4 bg-slate-800 rounded border-l-4 border-indigo-500">
                        <h5 className="font-bold text-white text-sm">The 5th to 95th Percentile</h5>
                        <p className="text-xs text-slate-400 mt-1">
                            Cockpits are designed to fit the central 90% of the population.
                            <br />- Excludes the shortest 5%.
                            <br />- Excludes the tallest 5%.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
                <div className="w-full h-32 flex items-end justify-center gap-1 mb-2">
                    {/* Normal Distribution approx */}
                    <div className="w-4 h-4 bg-slate-700 rounded-t"></div>
                    <div className="w-4 h-8 bg-slate-700 rounded-t"></div>
                    <div className="w-4 h-16 bg-slate-600 rounded-t"></div>
                    <div className="w-4 h-24 bg-indigo-500 rounded-t"></div>
                    <div className="w-4 h-32 bg-indigo-500 rounded-t"></div>
                    <div className="w-4 h-24 bg-indigo-500 rounded-t"></div>
                    <div className="w-4 h-16 bg-slate-600 rounded-t"></div>
                    <div className="w-4 h-8 bg-slate-700 rounded-t"></div>
                    <div className="w-4 h-4 bg-slate-700 rounded-t"></div>
                </div>
                <p className="text-xs text-slate-500 text-center">
                    Adjustability (Seats, Pedals) allows the 90% to fit safely.
                </p>
            </div>
        </div>
    </div>
);

const DesignEyePosition = () => (
    <div className="animate-in slide-in-from-right-4">
        <h3 className="text-xl font-bold text-white mb-6">Design Eye Position (DEP)</h3>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
                <div className="relative w-64 h-48 border-2 border-slate-600 rounded-lg overflow-hidden bg-black/50">
                    {/* Windshield */}
                    <div className="absolute top-0 w-full h-24 bg-sky-900/20 border-b border-slate-600"></div>
                    {/* Nose */}
                    <div className="absolute bottom-0 w-full h-12 bg-slate-800"></div>

                    {/* Eye Point */}
                    <div className="absolute top-24 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.8)]"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Eye size={12} className="text-white" />
                        </div>
                    </div>

                    {/* Sight Lines */}
                    <div className="absolute top-24 left-1/2 w-full h-[1px] bg-red-500/50 rotate-[-15deg] origin-left"></div>
                </div>
                <p className="text-xs text-slate-500 mt-4 text-center">
                    The fixed point in space where the pilot's eye MUST be to see all instruments and the runway.
                </p>
            </div>

            <div className="space-y-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-white mb-2">Why is DEP critical?</h4>
                    <ul className="text-sm text-slate-300 list-disc pl-4 space-y-2">
                        <li><strong>Visibility:</strong> To see the runway over the nose (Cut-off angle).</li>
                        <li><strong>Instruments:</strong> To see the HUD or PFD without parallax error.</li>
                        <li><strong>Adjustment:</strong> Use the "Ball Sights" (White/Red balls) on the center pillar to align seat.</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

const Biomechanics = () => (
    <div className="animate-in fade-in">
        <h3 className="text-xl font-bold text-white mb-6">Biomechanics & Controls</h3>
        <p className="text-sm text-slate-400 mb-6">Interacting with the machine.</p>

        <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white text-sm mb-2">Movement Direction</h4>
                <p className="text-xs text-slate-400 mb-2">Controls should move in expected directions.</p>
                <div className="bg-slate-800 p-2 rounded text-xs text-slate-300">
                    Forward = Down/Fast.<br />
                    Back = Up/Slow.<br />
                    Clockwise = Increase.
                </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white text-sm mb-2">Tactile Feedback</h4>
                <p className="text-xs text-slate-400 mb-2">Shape coding prevents errors.</p>
                <div className="bg-slate-800 p-2 rounded text-xs text-slate-300">
                    <span className="text-slate-500">e.g.</span> Flap lever shaped like a wing. Gear lever shaped like a wheel.
                </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white text-sm mb-2">Reach & Strength</h4>
                <p className="text-xs text-slate-400 mb-2">Critical controls within easy reach.</p>
                <div className="bg-slate-800 p-2 rounded text-xs text-slate-300">
                    Emergency items (Fire handle, Gear, Oxy) must be reachable with locked harness.
                </div>
            </div>
        </div>
    </div>
);

export default HPLErgonomics;
