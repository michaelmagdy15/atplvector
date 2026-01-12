import React, { useState } from 'react';
import { Settings, TrendingUp } from 'lucide-react';

const TrimSheetSim: React.FC = () => {
    // Simplified Simulation State
    const [paxZoneA, setPaxZoneA] = useState(10);
    const [paxZoneB, setPaxZoneB] = useState(15);
    const [fuelIndex, setFuelIndex] = useState(5);

    // Initial DOI (Dry Operating Index)
    const startDOI = 43;

    // Calculation Logic (Mocked for visual representation)
    // Zone A: -0.5 per pax
    // Zone B: +0.2 per pax
    // Fuel: +1 per unit

    const deltaA = paxZoneA * -0.5;
    const deltaB = paxZoneB * 0.2;
    const currentDOI = startDOI + deltaA + deltaB + fuelIndex;

    const mass = 34000 + (paxZoneA + paxZoneB) * 84 + (fuelIndex * 100); // Rough mass calc

    // SVG plotting coordinates
    // X scale: Index 0-100 mapped to 0-300px
    // Y scale: Mass 30000-60000 mapped to 300-0px

    const mapX = (idx: number) => (idx / 100) * 100; // %
    const mapY = (m: number) => 100 - ((m - 30000) / 30000) * 100; // %

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-900/20 rounded-xl">
                    <TrendingUp className="w-8 h-8 text-red-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">
                        Trim Sheet <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Simulator</span>
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Manual Load Sheet & Trim Chart visualization.
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* Inputs Table */}
                <div className="bg-white text-slate-900 rounded-xl overflow-hidden shadow-2xl font-mono text-sm border-2 border-slate-300">
                    <div className="bg-slate-100 p-2 border-b border-slate-300 font-bold text-center">LOADING INPUTS</div>

                    <div className="p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="font-bold">DOI (Start)</label>
                            <span className="text-red-600 font-bold text-lg">{startDOI}</span>
                        </div>

                        <div className="border-t border-slate-200 pt-2">
                            <label className="block font-bold mb-1">Zone A (Fwd)</label>
                            <div className="flex items-center gap-2">
                                <input type="range" min="0" max="30" value={paxZoneA} onChange={e => setPaxZoneA(Number(e.target.value))} className="flex-1" />
                                <span className="w-8 text-right">{paxZoneA}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 text-right">Effect: {deltaA.toFixed(1)}</div>
                        </div>

                        <div className="border-t border-slate-200 pt-2">
                            <label className="block font-bold mb-1">Zone B (Aft)</label>
                            <div className="flex items-center gap-2">
                                <input type="range" min="0" max="30" value={paxZoneB} onChange={e => setPaxZoneB(Number(e.target.value))} className="flex-1" />
                                <span className="w-8 text-right">{paxZoneB}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 text-right">Effect: +{deltaB.toFixed(1)}</div>
                        </div>

                        <div className="border-t border-slate-200 pt-2">
                            <label className="block font-bold mb-1">Fuel Index</label>
                            <div className="flex items-center gap-2">
                                <input type="range" min="0" max="20" value={fuelIndex} onChange={e => setFuelIndex(Number(e.target.value))} className="flex-1" />
                                <span className="w-8 text-right">{fuelIndex}</span>
                            </div>
                        </div>

                        <div className="border-t-2 border-slate-900 pt-2 flex justify-between items-center mt-4 bg-yellow-100 p-2 rounded">
                            <span className="font-bold uppercase">Final Index</span>
                            <span className="font-black text-2xl text-red-600">{currentDOI.toFixed(1)}</span>
                        </div>
                    </div>
                </div>

                {/* Trim Chart Visualization */}
                <div className="lg:col-span-2 bg-white rounded-xl p-4 md:p-8 relative min-h-[400px] border-2 border-slate-300">
                    <h3 className="text-slate-900 font-bold mb-4 uppercase text-center border-b pb-2">Load & Trim Envelope</h3>

                    {/* SVG Graph */}
                    <div className="relative w-full aspect-[16/9] border border-slate-200 bg-[url('https://www.transparenttextures.com/patterns/grid.png')]">

                        {/* Drop Line Path Visualization */}
                        <svg className="absolute inset-0 w-full h-full text-[10px]" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {/* Grid Lines */}
                            <line x1="0" y1="0" x2="0" y2="100" stroke="#ddd" strokeWidth="0.5" />
                            <line x1="50" y1="0" x2="50" y2="100" stroke="#ddd" strokeWidth="0.5" />
                            <line x1="100" y1="0" x2="100" y2="100" stroke="#ddd" strokeWidth="0.5" />

                            {/* Envelope (Static Polygon) */}
                            <polygon points="20,90 30,10 80,10 70,90" fill="rgba(0,0,0,0.05)" stroke="black" strokeWidth="0.5" />

                            {/* Labels */}
                            <text x="25" y="50" fill="gray" transform="rotate(-75 25,50)">Fwd Limit</text>
                            <text x="75" y="50" fill="gray" transform="rotate(-75 75,50)">Aft Limit</text>

                            {/* The "Drop Line" - Red Path */}
                            {/* Start at top with DOI */}
                            <path
                                d={`
                                    M ${mapX(startDOI)} 0 
                                    L ${mapX(startDOI)} 15 
                                    L ${mapX(startDOI + deltaA)} 15
                                    L ${mapX(startDOI + deltaA)} 30
                                    L ${mapX(startDOI + deltaA + deltaB)} 30
                                    L ${mapX(startDOI + deltaA + deltaB)} 45
                                    L ${mapX(currentDOI)} 45
                                    L ${mapX(currentDOI)} ${mapY(mass)}
                                `}
                                fill="none"
                                stroke="#dc2626"
                                strokeWidth="1"
                                className="drop-shadow-md"
                            />

                            {/* Final Point */}
                            <circle cx={mapX(currentDOI)} cy={mapY(mass)} r="1.5" fill="#dc2626" />

                            {/* Crosshairs */}
                            <line x1="0" y1={mapY(mass)} x2="100" y2={mapY(mass)} stroke="#dc2626" strokeWidth="0.2" strokeDasharray="2 2" />
                            <line x1={mapX(currentDOI)} y1="100" x2={mapX(currentDOI)} y2={mapY(mass)} stroke="#dc2626" strokeWidth="0.2" strokeDasharray="2 2" />

                        </svg>

                        {/* Interactive Overlay Values */}
                        <div className="absolute top-2 left-2 bg-white/90 p-2 border border-slate-300 text-[10px] shadow">
                            <div><strong>Start DOI:</strong> {startDOI}</div>
                            <div className="text-red-600"><strong>Drop Line</strong> follows load changes</div>
                        </div>

                        <div
                            className="absolute bg-white/90 p-2 border-2 border-red-500 text-xs shadow-xl rounded z-10"
                            style={{ left: `${mapX(currentDOI)}%`, top: `${mapY(mass)}%`, transform: 'translate(10px, -50%)' }}
                        >
                            <div className="font-bold text-red-600">T.O.M: {Math.round(mass)} kg</div>
                            <div className="font-bold text-slate-800">Index: {currentDOI.toFixed(1)}</div>
                            <div className="text-[10px] text-green-600 font-bold uppercase mt-1">Within Limits</div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default TrimSheetSim;
