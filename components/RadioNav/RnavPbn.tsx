import React, { useState } from 'react';
import { View } from '../../types';
import { ArrowLeft, Waypoints, Map as MapIcon, LocateFixed } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const RnavPbn: React.FC<Props> = ({ onNavigate }) => {
    const [mode, setMode] = useState<'CONV' | 'RNAV'>('CONV');
    const [rnp, setRnp] = useState(1.0); // NM

    return (
        <div className="max-w-5xl mx-auto p-4 space-y-6">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => onNavigate?.(View.RAD_NAV_HOME)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                    <Waypoints className="text-teal-400" />
                    <h1 className="text-2xl font-bold text-slate-100">RNAV & PBN (Performance Based Nav)</h1>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">

                {/* Map Visualizer */}
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 relative overflow-hidden h-[400px]">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-950"></div>

                    {/* Stations */}
                    <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                        <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[14px] border-l-transparent border-r-transparent border-b-blue-500"></div>
                        <span className="text-[10px] text-blue-400 mt-1 font-bold">VOR A</span>
                    </div>

                    <div className="absolute bottom-1/4 right-1/4 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                        <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[14px] border-l-transparent border-r-transparent border-b-blue-500"></div>
                        <span className="text-[10px] text-blue-400 mt-1 font-bold">VOR B</span>
                    </div>

                    {/* Flight Path */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <defs>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                        </defs>

                        {mode === 'CONV' ? (
                            <>
                                {/* Conventional: Fly to station, then track to next */}
                                <path d="M 50,200 L 120,100 L 320,300 L 400,300" stroke="#fbbf24" strokeWidth="3" fill="none" strokeDasharray="5,5" />
                                <text x="130" y="100" fill="#fbbf24" fontSize="10">Overfly Station A</text>
                            </>
                        ) : (
                            <>
                                {/* RNAV: Direct Waypoints */}
                                {/* Define Waypoints */}
                                <circle cx="150" cy="150" r="4" fill="white" />
                                <text x="160" y="150" fill="white" fontSize="10">WPT1</text>

                                <circle cx="300" cy="250" r="4" fill="white" />
                                <text x="310" y="250" fill="white" fontSize="10">WPT2</text>

                                {/* Ghost Stations (Rho Theta) Visualization if calculated from VORs */}
                                <line x1="120" y1="100" x2="150" y2="150" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.3" />
                                <line x1="320" y1="300" x2="300" y2="250" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.3" />

                                {/* Corridor (RNP Width) */}
                                <path
                                    d="M 50,100 L 150,150 L 300,250 L 400,250"
                                    stroke="#2dd4bf"
                                    strokeWidth={rnp * 20} // Scale width
                                    strokeOpacity="0.2"
                                    fill="none"
                                />
                                <path d="M 50,100 L 150,150 L 300,250 L 400,250" stroke="#2dd4bf" strokeWidth="2" fill="none" filter="url(#glow)" />
                            </>
                        )}
                    </svg>

                    <div className="absolute bottom-4 left-4 text-xs text-slate-500 bg-slate-900/80 p-2 rounded border border-slate-700">
                        {mode === 'CONV' ? "Conventional: Sensor-to-Sensor Navigation" : `RNAV: Point-to-Point (RNP ${rnp})`}
                    </div>
                </div>

                {/* Controls & Theory */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl space-y-4">
                        <label className="text-sm font-bold text-white block">Navigation Mode</label>
                        <div className="flex bg-slate-950 p-1 rounded-lg">
                            <button onClick={() => setMode('CONV')} className={`flex-1 py-2 text-xs font-bold rounded ${mode === 'CONV' ? 'bg-amber-500 text-black' : 'text-slate-500'}`}>Conventional</button>
                            <button onClick={() => setMode('RNAV')} className={`flex-1 py-2 text-xs font-bold rounded ${mode === 'RNAV' ? 'bg-teal-500 text-black' : 'text-slate-500'}`}>RNAV / PBN</button>
                        </div>
                    </div>

                    {mode === 'RNAV' && (
                        <div className="glass-panel p-6 rounded-xl space-y-4 animate-fade-in">
                            <label className="text-sm font-bold text-white flex justify-between">
                                <span>RNP Value (Accuracy)</span>
                                <span className="font-mono text-teal-400">{rnp} NM</span>
                            </label>
                            <input
                                type="range"
                                min="0.1" max="5" step="0.1"
                                value={rnp} onChange={(e) => setRnp(parseFloat(e.target.value))}
                                className="w-full accent-teal-500"
                            />
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>RNP 0.1 (Approach)</span>
                                <span>RNP 5 (Enroute)</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">
                                <strong>RNP (Required Navigation Performance):</strong> Defines the lateral corridor width (95% containment). The system must alert if accuracy falls below this threshold (Integrity Monitor).
                            </p>
                        </div>
                    )}

                    <div className="glass-panel p-6 rounded-xl">
                        <h3 className="text-sm font-bold text-white mb-2">Key Concepts</h3>
                        <ul className="space-y-2 text-xs text-slate-300">
                            <li className="flex gap-2"><MapIcon size={14} className="shrink-0 text-sky-400" /> <strong>Waypoints:</strong> Defined by Lat/Long coordinates, not physical stations.</li>
                            <li className="flex gap-2"><LocateFixed size={14} className="shrink-0 text-sky-400" /> <strong>Kalam Filtering:</strong> FMS blends inputs (IRS, GPS, DME/DME, VOR/DME) for best position estimate.</li>
                            <li className="flex gap-2"><Waypoints size={14} className="shrink-0 text-sky-400" /> <strong>Phantom Station:</strong> Creating a waypoint by defining a radial/range from a VOR.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* NEW: RNP Approach Types */}
            <div className="mt-8 grid md:grid-cols-2 gap-6 animate-in slide-in-from-bottom border-t border-slate-700 pt-6">
                <div className="glass-panel p-6 rounded-xl space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <LocateFixed size={20} className="text-teal-400" />
                        RNP APCH (Standard)
                    </h3>
                    <p className="text-xs text-slate-400">
                        Previously called "GPS Approach" or "GNSS Approach".
                        Flown with generic GNSS equipment.
                    </p>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                            <span className="text-xs font-bold text-slate-200">Straight Segments Only</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                            <span className="text-xs font-bold text-slate-200">No RF Legs (Radius to Fix)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                            <span className="text-xs font-bold text-slate-200">Integrity: RAIM required</span>
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-xl space-y-4 border-l-4 border-amber-500">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Waypoints size={20} className="text-amber-400" />
                        RNP AR APCH (Auth Required)
                    </h3>
                    <p className="text-xs text-slate-400">
                        "Approval Required" (SAAAR). For navigating complex terrain or airspace.
                    </p>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            <span className="text-xs font-bold text-slate-200">Curved Paths (RF Legs)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            <span className="text-xs font-bold text-slate-200">RNP Values &lt; 0.3 NM (down to 0.1)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            <span className="text-xs font-bold text-slate-200">Mandatory: Auto-flight coupling</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RnavPbn;
