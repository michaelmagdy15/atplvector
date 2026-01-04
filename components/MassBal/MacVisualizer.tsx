import React, { useState } from 'react';
import { Ruler, Plane } from 'lucide-react';

const MacVisualizer: React.FC = () => {
    const [lemac, setLemac] = useState(10); // meters from datum
    const [mac, setMac] = useState(4); // meters
    const [cg, setCg] = useState(11); // meters from datum

    // Calculation
    // %MAC = (CG - LEMAC) / MAC * 100
    const percentMac = ((cg - lemac) / mac) * 100;
    
    // Limits
    const limitFwd = 15; // %
    const limitAft = 35; // %
    const isSafe = percentMac >= limitFwd && percentMac <= limitAft;

    // Visual Scales
    const maxDatum = 20; // total range visualized
    const scale = (val: number) => (val / maxDatum) * 100;

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Ruler className="text-yellow-400" /> Mean Aerodynamic Chord (MAC)
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
                
                {/* Visualizer */}
                <div className="bg-slate-900 rounded-xl p-8 relative h-[300px] border border-slate-700 overflow-hidden flex flex-col justify-center">
                    {/* Datum Line */}
                    <div className="absolute left-4 top-0 bottom-0 border-l-2 border-dashed border-slate-500"></div>
                    <span className="absolute left-6 top-4 text-xs font-bold text-slate-500 uppercase rotate-90 origin-top-left">Datum</span>

                    {/* Fuselage (Simplified) */}
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-12 bg-slate-800 rounded-r-full"></div>

                    {/* Wing / MAC Representation */}
                    <div 
                        className="absolute top-1/2 -translate-y-1/2 h-40 bg-slate-700 border border-slate-600 rounded opacity-80"
                        style={{ left: `${scale(lemac)}%`, width: `${scale(mac)}%` }}
                    >
                        {/* LEMAC Label */}
                        <div className="absolute -left-[1px] top-0 bottom-0 border-l-2 border-yellow-500/50"></div>
                        <span className="absolute -left-2 -top-6 text-[10px] font-bold text-yellow-500">LEMAC</span>

                        {/* TEMAC Label */}
                        <div className="absolute -right-[1px] top-0 bottom-0 border-r-2 border-yellow-500/50"></div>
                        <span className="absolute -right-2 -bottom-6 text-[10px] font-bold text-yellow-500">TEMAC</span>
                    </div>

                    {/* CG Marker */}
                    <div 
                        className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center z-10 transition-all duration-100"
                        style={{ left: `${scale(cg)}%` }}
                    >
                        <div className={`w-4 h-4 rounded-full border-2 ${isSafe ? 'bg-green-500 border-white' : 'bg-red-500 border-white shadow-[0_0_10px_red]'}`}></div>
                        <div className="h-48 w-0 border-l border-white/50"></div>
                        <span className="absolute -top-8 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                            CG: {cg}m
                        </span>
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-6">
                    <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Leading Edge MAC (LEMAC)</label>
                        <input type="range" min="5" max="15" step="0.1" value={lemac} onChange={e => setLemac(Number(e.target.value))} className="w-full accent-yellow-500" />
                        <div className="text-right text-yellow-400 font-mono">{lemac.toFixed(1)} m</div>
                    </div>

                    <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">MAC Length</label>
                        <input type="range" min="2" max="8" step="0.1" value={mac} onChange={e => setMac(Number(e.target.value))} className="w-full accent-yellow-500" />
                        <div className="text-right text-yellow-400 font-mono">{mac.toFixed(1)} m</div>
                    </div>

                    <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Center of Gravity (Station)</label>
                        <input type="range" min="5" max="20" step="0.1" value={cg} onChange={e => setCg(Number(e.target.value))} className="w-full accent-white" />
                        <div className="text-right text-white font-mono">{cg.toFixed(1)} m</div>
                    </div>

                    <div className={`p-4 rounded-xl text-center border-2 ${isSafe ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
                        <p className="text-xs font-bold uppercase opacity-70 mb-1">Result</p>
                        <p className="text-3xl font-black">{percentMac.toFixed(1)} % MAC</p>
                        <p className="text-xs mt-2 opacity-70">Limit: {limitFwd}% - {limitAft}%</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MacVisualizer;