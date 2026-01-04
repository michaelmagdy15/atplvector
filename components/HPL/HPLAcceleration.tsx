
import React, { useState, useEffect } from 'react';
import { Gauge, ArrowDown, Activity, AlertTriangle, Play } from 'lucide-react';

const HPLAcceleration: React.FC = () => {
    const [tab, setTab] = useState<'types' | 'gloc' | 'protection'>('types');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Gauge className="text-lime-400" />
                        Acceleration & G-Forces
                    </h2>
                    <p className="text-slate-400 text-sm">Gz Factors, G-LOC, and Anti-G Straining.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setTab('types')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'types' ? 'bg-lime-600 text-white' : 'text-slate-400 hover:text-white'}`}>G-Vectors</button>
                    <button onClick={() => setTab('gloc')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'gloc' ? 'bg-lime-600 text-white' : 'text-slate-400 hover:text-white'}`}>G-LOC Sim</button>
                    <button onClick={() => setTab('protection')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'protection' ? 'bg-lime-600 text-white' : 'text-slate-400 hover:text-white'}`}>Protection</button>
                </div>
            </div>

            {tab === 'types' && <GVectors />}
            {tab === 'gloc' && <GLocSim />}
            {tab === 'protection' && <GProtection />}
        </div>
    );
};

const GVectors = () => (
    <div className="animate-in fade-in grid md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-4">G-Force Vectors</h3>
            <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded border-l-4 border-red-500">
                    <div className="text-center w-12 shrink-0">
                        <span className="block text-2xl font-black text-red-400">+Gz</span>
                        <ArrowDown className="mx-auto text-red-400" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold">Head-to-Foot</h4>
                        <p className="text-xs text-slate-300">
                            Blood pools in legs. Heart works harder to pump to brain.
                            <br /><strong>Limit:</strong> ~3-4G (relaxed), ~5G (straining).
                            <br /><strong>Risk:</strong> Grey-out, Black-out, G-LOC.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded border-l-4 border-blue-500">
                    <div className="text-center w-12 shrink-0">
                        <span className="block text-2xl font-black text-blue-400">-Gz</span>
                        <ArrowDown className="mx-auto text-blue-400 rotate-180" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold">Foot-to-Head</h4>
                        <p className="text-xs text-slate-300">
                            Blood forced to head. Bunt / Outside Loop.
                            <br /><strong>Limit:</strong> ~ -2 to -3G.
                            <br /><strong>Risk:</strong> Red-out (Burst vessels in eyes), Brain hemorrhage.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded border-l-4 border-emerald-500">
                    <div className="text-center w-12 shrink-0">
                        <span className="block text-2xl font-black text-emerald-400">Gx</span>
                        <div className="flex justify-center"><ArrowDown className="-rotate-90 text-emerald-400" /></div>
                    </div>
                    <div>
                        <h4 className="text-white font-bold">Chest-to-Back</h4>
                        <p className="text-xs text-slate-300">
                            Acceleration (Takeoff/Catapult). Best tolerance (&gt;10G).
                            <br /><strong>Limit:</strong> Breathing difficulty at high G.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex items-center justify-center relative overflow-hidden">
            {/* Visual representation of blood pooling */}
            <div className="relative h-[300px] w-[120px] bg-slate-800 rounded-full border-4 border-slate-600 overflow-hidden">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-400 rounded-full z-10"></div> {/* Brain */}
                <div className="absolute top-16 left-1/2 -translate-x-1/2 w-6 h-10 bg-red-800/50 rounded z-10 animate-pulse"></div> {/* Heart */}

                {/* Blood Level */}
                <div className="absolute bottom-0 w-full bg-red-600/80 transition-all duration-1000 ease-in-out" style={{ height: '60%' }}></div>

                {/* Body Outline */}
                <div className="absolute inset-0 border-4 border-slate-600 rounded-full z-20"></div>
            </div>
            <div className="absolute top-8 right-8 text-right">
                <p className="text-xs font-bold text-slate-500">Normal 1G</p>
                <div className="h-0.5 w-12 bg-slate-600 ml-auto my-1"></div>
                <p className="text-xs text-slate-400">Blood reaches brain</p>
            </div>
        </div>
    </div>
);

const GLocSim = () => {
    const [gForce, setGForce] = useState(1);
    const [duration, setDuration] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    // Sim state
    // Hydrostatic column effect: Brain pressure drops ~22mmHg per G.
    // Normal mean eye-level MAP ~ 100 - 25 = 75mmHg.
    // At 4G: 100 - (4*25) = 0mmHg at eye level.

    useEffect(() => {
        let interval: any;
        if (isRunning) {
            interval = setInterval(() => {
                setDuration(d => d + 0.1);
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const brainBloodPressure = Math.max(0, 100 - (gForce * 22)); // Approx drop

    let symptoms = "Normal";
    let color = "text-white";
    let vision = 100; // % Visibility

    if (brainBloodPressure < 40) { symptoms = "Grey-out (Tunnel Vision)"; color = "text-yellow-400"; vision = 40; }
    if (brainBloodPressure < 20) { symptoms = "Black-out (Vision Lost, Conscious)"; color = "text-orange-500"; vision = 0; }
    if (brainBloodPressure === 0) { symptoms = "G-LOC (Unconscious)"; color = "text-red-600"; vision = -10; }

    return (
        <div className="animate-in fade-in grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <div className="mb-8">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-slate-400">Load Factor</span>
                        <span className="text-3xl font-black text-lime-400">{gForce.toFixed(1)} G</span>
                    </div>
                    <input
                        type="range" min="1" max="9" step="0.1"
                        value={gForce} onChange={e => setGForce(Number(e.target.value))}
                        className="w-full h-4 bg-slate-700 rounded-lg accent-lime-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                        <span>1G (Relaxed)</span>
                        <span>5G (Blackout)</span>
                        <span>9G (F-16 Limit)</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-slate-800 p-4 rounded text-center">
                        <p className="text-xs text-slate-400 uppercase font-bold">Brain Blood Pressure</p>
                        <p className={`text-2xl font-mono ${brainBloodPressure < 30 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
                            {brainBloodPressure.toFixed(0)} mmHg
                        </p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded text-center border-t-4 border-slate-600">
                        <p className="text-xs text-slate-400 uppercase font-bold">Physiological State</p>
                        <p className={`text-lg font-bold ${color}`}>{symptoms}</p>
                    </div>
                </div>
            </div>

            {/* Vision Simulator */}
            <div className="relative bg-black rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center h-[300px]">
                {/* Background Image (Abstract Horizon) */}
                <div className="absolute inset-0 bg-gradient-to-b from-sky-400 to-emerald-600">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-1 bg-white/50"></div>
                    </div>
                    {/* Clouds */}
                    <div className="absolute top-10 left-10 w-20 h-10 bg-white/20 rounded-full blur-xl"></div>
                    <div className="absolute top-20 right-20 w-32 h-12 bg-white/30 rounded-full blur-xl"></div>
                </div>

                {/* Tunnel Vision Mask */}
                {vision < 100 && vision >= 0 && (
                    <div
                        className="absolute inset-0 bg-black transition-all duration-300"
                        style={{
                            maskImage: `radial-gradient(circle at center, transparent ${vision}%, black ${vision + 20}%)`,
                            WebkitMaskImage: `radial-gradient(circle at center, transparent ${vision}%, black ${vision + 20}%)`
                        }}
                    ></div>
                )}

                {/* G-LOC Overlay */}
                {vision < 0 && (
                    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-20">
                        <h1 className="text-red-600 font-black text-4xl mb-2 animate-pulse">G-LOC</h1>
                        <p className="text-slate-500 text-xs">Absolute Incapacitation (~15s) + Relative Incapacitation</p>
                    </div>
                )}

                <div className="absolute bottom-4 left-4 bg-black/50 p-2 rounded text-xs text-white backdrop-blur-sm">
                    Pilot View Simulation
                </div>
            </div>
        </div>
    );
};

const GProtection = () => (
    <div className="animate-in fade-in space-y-6">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-6">Improving G-Tolerance</h3>
            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-800 p-4 rounded border-l-4 border-lime-500">
                    <h4 className="font-bold text-white text-sm mb-2">Anti-G Straining Manoeuvre (AGSM)</h4>
                    <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
                        <li>Muscle tensing (Legs, Abs, Buttocks) to squeeze blood up.</li>
                        <li>Closed glottis breathing cycles (2.5 - 3 sec). "Hick... Hick...".</li>
                        <li><strong>Effect:</strong> Adds +3 to +4G tolerance.</li>
                    </ul>
                </div>
                <div className="bg-slate-800 p-4 rounded border-l-4 border-lime-500">
                    <h4 className="font-bold text-white text-sm mb-2">Anti-G Suit</h4>
                    <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
                        <li>Inflatable bladders compress legs/abdomen.</li>
                        <li>Prevents blood pooling mechanically.</li>
                        <li><strong>Effect:</strong> Adds +1 to +1.5G tolerance.</li>
                    </ul>
                </div>
                <div className="bg-slate-800 p-4 rounded border-l-4 border-lime-500">
                    <h4 className="font-bold text-white text-sm mb-2">Factors Reducing Tolerance</h4>
                    <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
                        <li>Dehydration</li>
                        <li>Hypoglycaemia (Low blood sugar)</li>
                        <li>Fatigue / Illness</li>
                        <li>Alcohol / Smoking</li>
                        <li>Rapid G-Onset ("Jolt")</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

export default HPLAcceleration;
