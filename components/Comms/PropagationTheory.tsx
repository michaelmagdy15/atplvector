
import React, { useState } from 'react';
import { Radio, ArrowUpRight, CloudRain, Sun } from 'lucide-react';

const PropagationTheory: React.FC = () => {
    const [mode, setMode] = useState('los');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Radio className="text-purple-400" /> VHF Propagation Theory
                </h2>
                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setMode('los')} className={`px-3 py-1 rounded text-xs font-bold ${mode === 'los' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}>Line of Sight</button>
                    <button onClick={() => setMode('duct')} className={`px-3 py-1 rounded text-xs font-bold ${mode === 'duct' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}>Ducting</button>
                </div>
            </div>

            <div className="relative h-64 bg-slate-900 rounded-xl border border-slate-700 mb-6 overflow-hidden">
                {/* Ground */}
                <div className="absolute bottom-0 w-full h-8 bg-emerald-900/50 border-t border-emerald-500/30"></div>
                {/* Earth Curvature (Subtle) */}
                <div className="absolute bottom-0 w-[120%] -left-[10%] h-20 bg-slate-800 rounded-[100%]"></div>

                {/* Stations */}
                <div className="absolute bottom-16 left-10 w-2 h-10 bg-slate-500"></div> {/* TX */}
                <div className="absolute bottom-26 left-10 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>

                {/* Signal Visualization */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {mode === 'los' && (
                        <>
                            {/* Direct Wave */}
                            <line x1="45" y1="230" x2="300" y2="100" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
                            {/* Plane */}
                            <g transform="translate(300, 100)">
                                <path d="M-10,0 L10,0 M0,-5 L0,5" stroke="white" strokeWidth="2" />
                            </g>
                        </>
                    )}
                    {mode === 'duct' && (
                        <>
                            {/* Ducting Wave */}
                            <path d="M 45 230 Q 150 180 250 200 T 450 220" fill="none" stroke="#f472b6" strokeWidth="3" />
                            <text x="200" y="150" fill="white" fontSize="12">Temperature Inversion Layer</text>
                            <rect x="0" y="160" width="100%" height="40" fill="white" opacity="0.05" />
                        </>
                    )}
                </svg>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-700/30 p-4 rounded-lg">
                    <h3 className="font-bold text-white mb-2">Factors Reducing Range</h3>
                    <ul className="text-sm text-slate-300 space-y-1 list-disc pl-4">
                        <li>Terrain obstruction (Mountains/Buildings)</li>
                        <li>Transmitter power output</li>
                        <li>Receiver sensitivity / Squelch setting</li>
                        <li>Antenna shadowing (Banking away from station)</li>
                    </ul>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-lg">
                    <h3 className="font-bold text-white mb-2">Super-Refraction</h3>
                    <p className="text-sm text-slate-300">
                        Under certain atmospheric conditions (Temperature Inversion), VHF waves can be trapped in a 'duct', travelling far beyond the visual horizon. This can cause interference from distant stations.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PropagationTheory;
