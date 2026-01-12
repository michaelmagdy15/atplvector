import React, { useState, useEffect } from 'react';
import { Clipboard, AlertTriangle, CheckCircle, ArrowRight, Scale, Fuel } from 'lucide-react';

const LoadSheetSim: React.FC = () => {
    // Inputs (kg)
    const [bem, setBem] = useState(25000);
    const [crew, setCrew] = useState(480);
    const [pantry, setPantry] = useState(200);
    const [traffic, setTraffic] = useState(12500);
    const [fuel, setFuel] = useState(8200);
    const [taxiFuel, setTaxiFuel] = useState(200);

    // Limits (kg)
    const MZFM = 42000;
    const MTOM = 52000;
    const MLM = 48000;
    const TripFuel = 6000; // Simplified for this sim check

    // Calculations
    const dom = bem + crew + pantry;
    const zfm = dom + traffic;
    const tom = zfm + fuel; // Take off fuel (block - taxi)
    // Note: Usually input is Block Fuel. Here simplified: Fuel = Take-off Fuel.
    // If input was Block Fuel, then TOM = ZFM + (Block - Taxi).
    // Let's assume 'fuel' state here is TAKE_OFF FUEL for simplicity or clarify in UI.
    const lm = tom - TripFuel; // Estimated Landing Mass

    // Status
    const zfmOver = zfm > MZFM;
    const tomOver = tom > MTOM;
    const lmOver = lm > MLM;
    const isOverload = zfmOver || tomOver || lmOver;

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                    <Clipboard className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">
                        Load Sheet <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Simulator</span>
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Build up mass from BEM to TOM and check against structural limits.
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">

                {/* Visual Paper Loadsheet */}
                <div className="bg-white text-slate-900 p-8 rounded-xl shadow-2xl font-mono relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-slate-900/10"></div>
                    <div className="absolute top-0 left-0 w-2 h-full bg-slate-900/10"></div>

                    <div className="flex justify-between border-b-2 border-slate-900 pb-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">LOAD SHEET</h2>
                            <p className="text-xs">ICAO STANDARD FORMAT</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold">FLIGHT: ATPL-031</p>
                            <p>DATE: {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm">
                        {/* BEM */}
                        <div className="flex justify-between items-center py-1 border-b border-slate-300">
                            <span>BASIC EMPTY MASS</span>
                            <span className="font-bold">{bem} kg</span>
                        </div>

                        {/* DOM Build Up */}
                        <div className="pl-4 text-slate-500 text-xs flex justify-between py-1">
                            <span>+ CREW</span>
                            <span>{crew}</span>
                        </div>
                        <div className="pl-4 text-slate-500 text-xs flex justify-between py-1">
                            <span>+ PANTRY</span>
                            <span>{pantry}</span>
                        </div>

                        {/* DOM */}
                        <div className="flex justify-between items-center py-2 bg-slate-100 px-2 font-bold border-l-4 border-slate-900 mt-2">
                            <span>DRY OPERATING MASS (DOM)</span>
                            <span>{dom} kg</span>
                        </div>

                        {/* Traffic Load */}
                        <div className="flex justify-between items-center py-1 border-b border-slate-300 mt-2">
                            <span>+ TRAFFIC LOAD</span>
                            <span className="text-blue-700 font-bold">{traffic} kg</span>
                        </div>

                        {/* ZFM */}
                        <div className={`flex justify-between items-center py-2 px-2 font-bold border-l-4 mt-2 ${zfmOver ? 'bg-red-100 border-red-500 text-red-600' : 'bg-slate-100 border-slate-900'}`}>
                            <span>ZERO FUEL MASS (ZFM)</span>
                            <span>{zfm} kg</span>
                        </div>
                        <div className="flex justify-end text-xs text-slate-400 mb-2">
                            <span>MAX ZFM: {MZFM} kg</span>
                        </div>

                        {/* Fuel */}
                        <div className="flex justify-between items-center py-1 border-b border-slate-300 mt-2">
                            <span>+ TAKE-OFF FUEL</span>
                            <span className="text-amber-700 font-bold">{fuel} kg</span>
                        </div>

                        {/* TOM */}
                        <div className={`flex justify-between items-center py-2 px-2 font-bold border-l-4 mt-2 text-lg ${tomOver ? 'bg-red-100 border-red-500 text-red-600' : 'bg-slate-200 border-slate-900'}`}>
                            <span>TAKE-OFF MASS (TOM)</span>
                            <span>{tom} kg</span>
                        </div>
                        <div className="flex justify-end text-xs text-slate-400 mb-2">
                            <span>MAX TOM: {MTOM} kg</span>
                        </div>

                        {/* Landing Mass Est */}
                        <div className="mt-8 pt-4 border-t-2 border-dashed border-slate-300 opacity-70">
                            <div className="flex justify-between">
                                <span>- TRIP FUEL</span>
                                <span>{TripFuel} kg</span>
                            </div>
                            <div className={`flex justify-between font-bold mt-1 ${lmOver ? 'text-red-500' : ''}`}>
                                <span>EST. LANDING MASS</span>
                                <span>{lm} kg</span>
                            </div>
                            <div className="flex justify-end text-xs text-slate-400">
                                <span>MAX LM: {MLM} kg</span>
                            </div>
                        </div>

                    </div>

                    {/* Final Stamp */}
                    <div className="absolute bottom-8 right-8 rota bg-slate-100 p-4 border-4 border-slate-900 -rotate-12 rounded opacity-80">
                        {isOverload ? (
                            <div className="text-red-600 font-black text-xl border-red-600 flex flex-col items-center">
                                <AlertTriangle size={32} />
                                REJECTED
                                <span className="text-[10px]">LIMIT EXCEEDED</span>
                            </div>
                        ) : (
                            <div className="text-emerald-700 font-black text-xl flex flex-col items-center">
                                <CheckCircle size={32} />
                                ACCEPTED
                                <span className="text-[10px]">WITHIN LIMITS</span>
                            </div>
                        )}
                    </div>

                </div>

                {/* Controls */}
                <div className="space-y-6">
                    <div className="bg-slate-900/50 backdrop-blur p-6 rounded-2xl border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Scale size={20} className="text-emerald-400" /> Operational Items
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    Basic Empty Mass (BEM)
                                    <span>{bem} kg</span>
                                </label>
                                <input type="range" min="20000" max="30000" step="100" value={bem} onChange={(e) => setBem(Number(e.target.value))} className="w-full accent-slate-500" />
                            </div>
                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    Crew Mass
                                    <span>{crew} kg</span>
                                </label>
                                <input type="range" min="160" max="600" step="10" value={crew} onChange={(e) => setCrew(Number(e.target.value))} className="w-full accent-slate-500" />
                            </div>
                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    Pantry / Catering
                                    <span>{pantry} kg</span>
                                </label>
                                <input type="range" min="0" max="500" step="10" value={pantry} onChange={(e) => setPantry(Number(e.target.value))} className="w-full accent-slate-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur p-6 rounded-2xl border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <CheckCircle size={20} className="text-blue-400" /> Variable Load
                        </h3>
                        <div>
                            <label className="flex justify-between text-xs font-bold text-blue-400 uppercase mb-2">
                                Traffic Load (Pax + Cargo)
                                <span>{traffic} kg</span>
                            </label>
                            <input type="range" min="0" max="18000" step="100" value={traffic} onChange={(e) => setTraffic(Number(e.target.value))} className="w-full accent-blue-500" />
                        </div>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur p-6 rounded-2xl border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Fuel size={20} className="text-amber-400" /> Fuel
                        </h3>
                        <div>
                            <label className="flex justify-between text-xs font-bold text-amber-400 uppercase mb-2">
                                Take-off Fuel
                                <span>{fuel} kg</span>
                            </label>
                            <input type="range" min="2000" max="15000" step="100" value={fuel} onChange={(e) => setFuel(Number(e.target.value))} className="w-full accent-amber-500" />
                        </div>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-sm text-slate-400">
                        <p><strong>Limit Check Mode:</strong> Adjust loads until you stay within MZFM, MTOM and MLM limits. Overloading any parameter invalidates the flight.</p>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default LoadSheetSim;
