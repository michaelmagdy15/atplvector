import React, { useState, useEffect } from 'react';
import { Eye, Compass, Move, AlertOctagon, RotateCw, Plane } from 'lucide-react';

const HPLDisorientation: React.FC = () => {
    const [tab, setTab] = useState<'vestibular' | 'illusion' | 'visual'>('vestibular');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Compass className="text-amber-400" />
                        Disorientation & Illusions (040.02.04)
                    </h2>
                    <p className="text-slate-400 text-sm">Vestibular System, The Leans, and Visual Illusions.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setTab('vestibular')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'vestibular' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}>Vestibular</button>
                    <button onClick={() => setTab('illusion')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'illusion' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}>The Leans Sim</button>
                    <button onClick={() => setTab('visual')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'visual' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}>Visual Cues</button>
                </div>
            </div>

            {tab === 'vestibular' && <VestibularSystem />}
            {tab === 'illusion' && <LeansSimulator />}
            {tab === 'visual' && <VisualIllusions />}
        </div>
    );
};

// Vestibular System (Semicircular Canals & Otoliths)
const VestibularSystem = () => {
    return (
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
            <div className="space-y-6">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4">The Semicircular Canals</h3>
                    <p className="text-xs text-slate-400 mb-4">
                        Three canals at 90° angles (Pitch, Roll, Yaw). Fluid (Endolymph) moves hairs (Cupula).
                        <br /><strong>Detects:</strong> Angular Acceleration (Turning).
                    </p>

                    <div className="relative h-48 bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/50 via-slate-900 to-slate-900"></div>
                        {/* Abstract Representation */}
                        <div className="relative w-32 h-32 border-4 border-slate-600 rounded-full animate-spin-slow-reverse flex items-center justify-center">
                            <div className="absolute top-0 w-4 h-4 bg-amber-500 rounded-full shadow-lg shadow-amber-500/50"></div>
                            <span className="text-xs font-bold text-slate-400">FLUID</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4">The Otoliths (Utricle & Saccule)</h3>
                    <p className="text-xs text-slate-400 mb-4">
                        Chalk-like crystals on hairs.
                        <br /><strong>Detects:</strong> Linear Acceleration (Speed up/down) & Gravity.
                    </p>
                    <div className="bg-slate-800 p-3 rounded text-amber-200 text-xs font-bold text-center border border-amber-500/30">
                        Cause of Somatogravic Illustion (False Climb)
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col justify-center">
                <h3 className="font-bold text-white mb-6 text-center">Threshold of Perception</h3>

                <div className="space-y-8">
                    <div className="text-center">
                        <div className="text-4xl font-black text-amber-400 mb-2">2° / sec</div>
                        <p className="text-xs text-slate-400">Rate of Turn Threshold</p>
                        <p className="text-xs text-slate-500 italic mt-1">If a turn is entered slower than this, the fluid doesn't move enough to simulate the hairs. The pilot turns but THINKS they are level.</p>
                    </div>

                    <div className="h-px bg-slate-700 w-full"></div>

                    <div>
                        <h4 className="font-bold text-white text-sm mb-2">The "Washout" Filter</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Once a steady turn is established (constant speed), the fluid catches up with the canal walls and stops moving relative to the hairs.
                            <br /><br />
                            <span className="text-red-400 font-bold">RESULT:</span> Brain thinks turn has stopped. Pilot feels wings level while actually banking.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// The Leans Simulator
const LeansSimulator = () => {
    const [state, setState] = useState<'level' | 'sub-threshold' | 'correction'>('level');
    const [bank, setBank] = useState(0); // Actual bank
    const [perceived, setPerceived] = useState(0); // What pilot feels

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (state === 'sub-threshold') {
            // Slowly bank right, but perceived stays 0 (undetected)
            interval = setInterval(() => {
                setBank(prev => {
                    if (prev >= 20) {
                        setState('correction'); // Max bank reached, pilot notices instruments
                        return prev;
                    }
                    return prev + 0.1; // Very slow rate
                });
            }, 50);
        } else if (state === 'correction') {
            // Pilot snaps back to level quickly.
            // Fluid moves violently opposite way.
            interval = setInterval(() => {
                setBank(prev => {
                    if (prev <= 0) {
                        setBank(0);
                        setPerceived(-20); // Illusion of opposite bank!
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1; // Fast correction
                });
            }, 20);
        }

        return () => clearInterval(interval);
    }, [state]);

    const reset = () => {
        setState('level');
        setBank(0);
        setPerceived(0);
    };

    const start = () => {
        setState('sub-threshold');
    };

    return (
        <div className="animate-in slide-in-from-right-4">
            <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-white">The Leans (Most Common Illusion)</h3>
                <p className="text-sm text-slate-400">
                    Cause: A sub-threshold roll (undetected) followed by a sudden correction.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Visual Display */}
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 relative flex justify-center h-64 overflow-hidden">
                    {/* Horizon Line */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[150%] h-[200%] bg-sky-900 absolute top-[-100%] transition-transform duration-100 ease-linear origin-bottom"
                            style={{ transform: `rotate(${-bank}deg)` }}
                        ></div>
                        <div className="w-[150%] h-[100%] bg-amber-900/50 absolute bottom-0 transition-transform duration-100 ease-linear origin-top"
                            style={{ transform: `rotate(${-bank}deg)` }}
                        ></div>
                        <div className="w-full h-px bg-white z-10 absolute shadow-[0_0_10px_white]"></div>
                    </div>

                    {/* Plane Symbol */}
                    <Plane size={64} className="text-white z-20 drop-shadow-xl" />

                    <div className="absolute top-4 left-4 z-30 bg-black/50 p-2 rounded text-xs font-mono text-white">
                        ACTUAL BANK: {bank.toFixed(1)}° R
                    </div>
                </div>

                {/* Pilot Perception */}
                <div className="bg-slate-800 border-2 border-slate-600 rounded-xl p-8 relative flex flex-col justify-center items-center h-64 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-4">What the Pilot FEELS</p>

                    <div className={`transition-transform duration-500 ${perceived !== 0 ? 'scale-110' : ''}`}>
                        {perceived === 0 && bank === 0 && state === 'level' && <p className="text-2xl font-black text-emerald-400">LEVEL</p>}
                        {state === 'sub-threshold' && <p className="text-2xl font-black text-emerald-400">LEVEL (False)</p>}
                        {state === 'correction' && bank > 0 && <p className="text-2xl font-black text-white">LEVELING...</p>}
                        {perceived < 0 && (
                            <div>
                                <p className="text-3xl font-black text-red-500 animate-pulse">BANK LEFT!</p>
                                <p className="text-xs text-red-300 mt-2">Pilot feels leaning LEFT, so leans RIGHT to compensate.</p>
                                <p className="text-xs text-red-300">Re-enters original turn.</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 space-x-4 z-30">
                        {state === 'level' || (state === 'correction' && bank <= 0 && perceived < 0) ? (
                            <button onClick={start} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold">
                                {perceived < 0 ? 'Try Again' : 'Start Simulation'}
                            </button>
                        ) : (
                            <div className="text-xs text-slate-400 animate-pulse">Simulating...</div>
                        )}
                        {perceived < 0 && (
                            <button onClick={reset} className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg font-bold">
                                Reset
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Visual Illusions
const VisualIllusions = () => (
    <div className="animate-in slide-in-from-right-4">
        <h3 className="font-bold text-white mb-6">Visual Illusions (Runway Perspective)</h3>

        <div className="grid md:grid-cols-3 gap-6">
            {/* Narrow Runway */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 group hover:border-amber-500 transition-colors">
                <div className="h-32 bg-black relative mb-4 overflow-hidden rounded border border-slate-800">
                    {/* Narrow RWY perspective looks 'High' so pilot flies 'Low' */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-full bg-slate-500"
                        style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0% 100%)' }}></div>
                </div>
                <h4 className="font-bold text-white text-sm">Narrow Runway</h4>
                <p className="text-xs text-slate-400 mt-2">
                    Runway looks longer/higher than actual.
                    <br /><strong>Reaction:</strong> Pilot flies a <span className="text-red-400 font-bold">LOWER</span> approach.
                </p>
                <div className="mt-2 text-[10px] text-amber-400 font-mono">DANGER: CFIT / Undershoot</div>
            </div>

            {/* Wide Runway */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 group hover:border-amber-500 transition-colors">
                <div className="h-32 bg-black relative mb-4 overflow-hidden rounded border border-slate-800">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-full bg-slate-500"
                        style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0% 100%)' }}></div>
                </div>
                <h4 className="font-bold text-white text-sm">Wide Runway</h4>
                <p className="text-xs text-slate-400 mt-2">
                    Runway looks closer/lower than actual.
                    <br /><strong>Reaction:</strong> Pilot flies a <span className="text-blue-400 font-bold">HIGHER</span> approach.
                </p>
                <div className="mt-2 text-[10px] text-blue-400 font-mono">RISK: Overshoot / Flare High</div>
            </div>

            {/* Upslope */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 group hover:border-amber-500 transition-colors">
                <div className="h-32 bg-black relative mb-4 overflow-hidden rounded border border-slate-800 flex items-center justify-center">
                    <div className="w-24 h-24 border-b-8 border-slate-500 transform perspective-500 rotate-x-45"></div>
                </div>
                <h4 className="font-bold text-white text-sm">Upsloping Runway</h4>
                <p className="text-xs text-slate-400 mt-2">
                    Visual picture looks 'High'.
                    <br /><strong>Reaction:</strong> Pilot flies a <span className="text-red-400 font-bold">LOWER</span> approach.
                </p>
                <div className="mt-2 text-[10px] text-amber-400 font-mono">DANGER: CFIT / Undershoot</div>
            </div>
        </div>

        <div className="mt-8 p-4 bg-slate-700/30 rounded-lg text-sm text-slate-300 border border-slate-600">
            <strong>The Black Hole Effect:</strong> Approach over water or unlit terrain at night.
            No peripheral cues. Pilots tend to fly a curved approach, landing short.
            <br /><br />
            <strong>Autokinesis:</strong> Staring at a single static light in the dark. It appears to move after a few seconds. Do not follow it.
        </div>
    </div>
);

export default HPLDisorientation;
