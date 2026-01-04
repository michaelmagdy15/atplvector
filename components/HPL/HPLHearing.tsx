
import React, { useState, useEffect } from 'react';
import { Ear, RefreshCw, AlertTriangle, RotateCw, Volume2 } from 'lucide-react';

const HPLHearing: React.FC = () => {
    const [tab, setTab] = useState<'anatomy' | 'vestibular' | 'noise'>('anatomy');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Ear className="text-purple-400" />
                        Hearing & Balance
                    </h2>
                    <p className="text-slate-400 text-sm">The Ear, Vestibular System, and Spatial Disorientation.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setTab('anatomy')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'anatomy' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>The Ear</button>
                    <button onClick={() => setTab('vestibular')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'vestibular' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>Vestibular Illusions</button>
                    <button onClick={() => setTab('noise')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'noise' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>Noise Exposure</button>
                </div>
            </div>

            {tab === 'anatomy' && <EarAnatomy />}
            {tab === 'vestibular' && <VestibularSim />}
            {tab === 'noise' && <NoiseExposure />}
        </div>
    );
};

const EarAnatomy = () => (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
        <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4">Functional Divisions</h3>
                <div className="space-y-4">
                    <div className="bg-slate-800 p-4 rounded border-l-4 border-blue-400">
                        <h4 className="font-bold text-white text-sm">Outer Ear</h4>
                        <p className="text-xs text-slate-400">Pinna & Auditory Canal. Collects sound and directs to eardrum.</p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded border-l-4 border-purple-400">
                        <h4 className="font-bold text-white text-sm">Middle Ear</h4>
                        <p className="text-xs text-slate-400">Ossicles (Hammer, Anvil, Stirrup). Amplifies sound. Connected to throat via Eustachian Tube (Pressure equalisation).</p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded border-l-4 border-emerald-400">
                        <h4 className="font-bold text-white text-sm">Inner Ear</h4>
                        <p className="text-xs text-slate-400">Cochlea (Hearing) & Vestibular Apparatus (Balance). Converts mech energy to electrical nerve impulses.</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-black p-6 rounded-xl border border-slate-700 flex items-center justify-center">
            {/* Abstract Diagram */}
            <div className="relative w-full h-[300px]">
                {/* Cochlea (Spiral) */}
                <svg viewBox="0 0 200 200" className="w-full h-full">
                    <path d="M 40 100 C 60 100 60 40 100 40 C 160 40 160 160 100 160 C 80 160 80 130 100 130" fill="none" stroke="#a855f7" strokeWidth="10" strokeLinecap="round" opacity="0.6" />
                    <text x="100" y="100" fill="#a855f7" fontSize="12" textAnchor="middle">Cochlea</text>

                    {/* Semi-circular canals (Loops) */}
                    <path d="M 60 80 C 60 50 40 50 40 80" fill="none" stroke="#3b82f6" strokeWidth="6" />
                    <path d="M 50 90 C 20 90 20 70 50 70" fill="none" stroke="#3b82f6" strokeWidth="6" />
                    <text x="50" y="40" fill="#3b82f6" fontSize="10" textAnchor="middle">Semicircular</text>
                    <text x="50" y="50" fill="#3b82f6" fontSize="10" textAnchor="middle">Canals</text>

                    {/* Eardrum */}
                    <line x1="10" y1="100" x2="30" y2="100" stroke="#94a3b8" strokeWidth="2" />
                    <circle cx="35" cy="100" r="5" fill="#e2e8f0" />
                </svg>
            </div>
        </div>
    </div>
);

const VestibularSim = () => {
    const [illusion, setIllusion] = useState<'leans' | 'coriolis' | 'graveyard'>('leans');
    const [phase, setPhase] = useState(0); // Animation phase

    useEffect(() => {
        const interval = setInterval(() => {
            setPhase(p => (p + 1) % 100);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    // Viz logic
    // The Leans: Gradual subliminal entry (fluid moves with canal), rapid correction (fluid moves).
    // Actual = Real aircraft attitude
    // Perceived = What pilot feels

    let actualRot = 0;
    let perceivedRot = 0;

    if (illusion === 'leans') {
        // Phase 0-50: Slow roll right (sub-threshold). Fluid doesn't move relative to canal.
        // Actual goes 0 -> 20. Perceived stays 0.
        // Phase 50-60: Rapid correction left. Fluid moves.
        // Actual goes 20 -> 0. Perceived goes 0 -> -20 (Lean sensation).
        if (phase < 50) {
            actualRot = (phase / 50) * 20;
            perceivedRot = 0;
        } else {
            actualRot = 20 - ((phase - 50) / 10) * 20; // 20 -> 0 fast
            if (actualRot < 0) actualRot = 0;
            // Impulse creates false sensation
            perceivedRot = -((phase - 50) / 10) * 15;
            if (phase > 60) perceivedRot = -15 + ((phase - 60) / 40) * 15; // Decay
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex justify-center gap-4">
                <button onClick={() => setIllusion('leans')} className={`px-4 py-2 rounded font-bold text-sm ${illusion === 'leans' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'}`}>The Leans</button>
                <button onClick={() => { }} className="px-4 py-2 rounded font-bold text-sm bg-slate-800 text-slate-600 cursor-not-allowed">Other Illusions (Locked)</button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Visualizer */}
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 flex flex-col items-center">
                    <h3 className="text-white font-bold mb-8">Attitude Comparison</h3>

                    <div className="flex gap-12">
                        {/* Actual Aircraft */}
                        <div className="text-center">
                            <div className="relative w-32 h-32 bg-sky-900/50 rounded-full border-2 border-sky-500 flex items-center justify-center mb-2 mx-auto">
                                <div className="w-full h-1 bg-sky-500/30 absolute"></div>
                                <div
                                    className="text-white transition-transform duration-75"
                                    style={{ transform: `rotate(${actualRot}deg)` }}
                                >
                                    <AlertTriangle size={48} className="fill-white" />
                                </div>
                            </div>
                            <p className="text-xs font-bold text-sky-400">ACTUAL BANK</p>
                            <p className="text-lg font-mono text-white">{actualRot.toFixed(0)}&deg;</p>
                        </div>

                        {/* Perceived */}
                        <div className="text-center">
                            <div className="relative w-32 h-32 bg-purple-900/50 rounded-full border-2 border-purple-500 flex items-center justify-center mb-2 mx-auto">
                                <div className="w-full h-1 bg-purple-500/30 absolute"></div>
                                <div
                                    className="text-white transition-transform duration-75"
                                    style={{ transform: `rotate(${perceivedRot}deg)` }}
                                >
                                    <AlertTriangle size={48} className="fill-red-500/50 text-red-400" />
                                </div>
                            </div>
                            <p className="text-xs font-bold text-purple-400">PERCEIVED BANK</p>
                            <p className="text-lg font-mono text-white">{perceivedRot.toFixed(0)}&deg;</p>
                        </div>
                    </div>

                    <div className="mt-8 bg-slate-800 p-4 rounded w-full">
                        <div className="flex justify-between text-xs text-slate-400 mb-2">
                            <span>Timeline</span>
                            <span>{phase}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 transition-all duration-75 linear" style={{ width: `${phase}%` }}></div>
                        </div>
                        <p className="text-xs text-slate-300 mt-2 text-center">
                            {phase < 50 ? "Sub-threshold roll (undetected by vestibular)" : "Rapid recovery (stimulated). Pilot feels 'Leaning' opposite way."}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h3 className="font-bold text-white mb-2">Mechanism</h3>
                        <p className="text-sm text-slate-300 mb-4">
                            The semicircular canals detect <strong>Angular Acceleration</strong> (&gt; 2&deg;/s&sup2;).
                            They DO NOT detect constant velocity or sub-threshold acceleration.
                        </p>
                        <ul className="text-xs text-slate-400 list-disc pl-4 space-y-2">
                            <li><strong>Step 1:</strong> Slow entry into bank. Fluid doesn't move due to inertia/friction. <span className="text-red-400">Error: Brain thinks wings level.</span></li>
                            <li><strong>Step 2:</strong> Rapid correction. Fluid moves heavily. <span className="text-red-400">Error: Brain thinks rolling opposite way.</span></li>
                            <li><strong>Step 3:</strong> Pilot leans away from the false sensation (The Leans) or re-enters the turn to "feel level".</li>
                        </ul>
                    </div>
                    <div className="bg-slate-800 p-4 rounded border-l-4 border-red-500">
                        <h4 className="font-bold text-white text-sm">Corrective Action</h4>
                        <p className="text-xs text-slate-300">TRUST YOUR INSTRUMENTS. Ignore bodily sensations (Seat of the pants).</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NoiseExposure = () => (
    <div className="animate-in fade-in">
        <h3 className="font-bold text-white mb-6 flex items-center gap-2">
            <Volume2 className="text-pink-400" /> Noise Induced Hearing Loss (NIHL)
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <p className="text-sm text-slate-300 mb-4">
                    Damage occurs to the <strong>Hair Cells (Cilia)</strong> in the Cochlea. High frequency sensitivity is lost first (4000 Hz notch).
                </p>
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-800 p-3 rounded">
                        <span className="text-sm text-slate-300">Pain Threshold</span>
                        <span className="text-white font-mono font-bold">140 dB</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-800 p-3 rounded">
                        <span className="text-sm text-slate-300">Max Exposure (8 hrs)</span>
                        <span className="text-yellow-400 font-mono font-bold">85-90 dB</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-800 p-3 rounded">
                        <span className="text-sm text-slate-300">Normal Conversation</span>
                        <span className="text-green-400 font-mono font-bold">60 dB</span>
                    </div>
                </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white text-sm mb-2">Presbycusis vs NIHL</h4>
                <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
                    <li><strong>Presbycusis:</strong> Age related. Loss of high frequencies naturally over time.</li>
                    <li><strong>NIHL:</strong> Damage related. Permanent. Cumulative.</li>
                    <li><strong>Conductive Deafness:</strong> Problem in Outer/Middle ear (Wax, Otosclerosis). Can often be treated.</li>
                    <li><strong>Sensorineural Deafness:</strong> Problem in Inner Ear/Nerve. Permanent.</li>
                </ul>
            </div>
        </div>
    </div>
);

export default HPLHearing;
