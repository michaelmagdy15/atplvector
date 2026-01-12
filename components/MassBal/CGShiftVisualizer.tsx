import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Calculator, Scale } from 'lucide-react';

type Mode = 'MOVE' | 'ADD' | 'REMOVE';

const CGShiftVisualizer: React.FC = () => {
    const [mode, setMode] = useState<Mode>('MOVE');

    // State
    const [oldMass, setOldMass] = useState(50000);
    const [massChange, setMassChange] = useState(2000);
    const [distance, setDistance] = useState(10); // Distance moved or Arm of added/removed mass
    const [oldCG, setOldCG] = useState(20); // %MAC or meters, generic units

    // Calculations
    let shift = 0;
    let newMass = oldMass;
    let newCG = oldCG;
    let formulaString = "";

    if (mode === 'MOVE') {
        // Shift = (Mass Change * Distance Moved) / Total Mass
        shift = (massChange * distance) / oldMass;
        newMass = oldMass; // Mass doesn't change
        newCG = oldCG + shift; // Simplified: assume positive shift for demo
        formulaString = `Shift = (${massChange} × ${distance}) / ${oldMass}`;
    } else if (mode === 'ADD') {
        // Shift = (Mass Added * Dist between Mass & Old CG) / New Total Mass
        // Dist usually = Arm - OldCG. Let's simplify and make 'distance' the input "dist between mass and CG" for clarity as per formula sheet
        newMass = oldMass + massChange;
        shift = (massChange * distance) / newMass;
        newCG = oldCG + shift;
        formulaString = `Shift = (${massChange} × ${distance}) / ${newMass}`;
    } else if (mode === 'REMOVE') {
        // Shift = (Mass Removed * Dist between Mass & Old CG) / Old Total Mass (Wait, strictly it's Remaining Mass in denominator? NO.
        // User image formula says: "Removing Mass: (Mass Change / Old Total Mass) = (Change of CG / Dist between Mass & CG)"
        // -> Change of CG = (Mass Change * Dist) / Old Total Mass ?? 
        // Let's check standard formula: Shift = (Mass * Dist) / New Total Mass (Remaining Mass).
        // However, the user image explicitly says: "3. Removing Mass ... / Old Total Mass". This might be an approximation or specific variation.
        // ACTUALLY, looking at standard derived formulas:
        // Moment Change = Mass * Arm.
        // Let's stick to the USER PROVIDED IMAGE formula:
        // Formula 3: Mass Change / Old Total Mass = Change of CG / Dist between Mass & CG
        // => Change of CG = (Mass Change * Dist) / Old Total Mass.

        newMass = oldMass - massChange;
        shift = (massChange * distance) / oldMass;
        newCG = oldCG - shift; // Assume removing from forward moves CG aft? Direction depends on signs.
        // For visualization, we'll just show the MAGNITUDE of shift calculated by their formula.
        formulaString = `Shift = (${massChange} × ${distance}) / ${oldMass}`;
    }

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                    CG Shift <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Calculator</span>
                </h1>
                <p className="text-slate-400 mt-2">Interactive formula visualizer.</p>
            </div>

            {/* Mode Selector */}
            <div className="flex bg-slate-800 p-1 rounded-xl">
                {(['MOVE', 'ADD', 'REMOVE'] as Mode[]).map(m => (
                    <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${mode === m ? 'bg-slate-700 text-white shadow-lg border border-slate-600' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        {m === 'MOVE' && '1. Moving Mass'}
                        {m === 'ADD' && '2. Adding Mass'}
                        {m === 'REMOVE' && '3. Removing Mass'}
                    </button>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                            {mode === 'REMOVE' ? 'Old Total Mass' : (mode === 'ADD' ? 'Old Total Mass' : 'Total Mass')}
                        </label>
                        <div className="flex items-center bg-slate-800 rounded px-3 py-2 border border-slate-700">
                            <Scale size={16} className="text-slate-500 mr-2" />
                            <input
                                type="number" value={oldMass} onChange={e => setOldMass(Number(e.target.value))}
                                className="bg-transparent w-full text-white font-mono"
                            />
                            <span className="text-slate-500 text-xs font-bold">kg</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Mass Change</label>
                        <div className="flex items-center bg-slate-800 rounded px-3 py-2 border border-slate-700">
                            <span className="text-slate-500 mr-2 font-bold">Δ</span>
                            <input
                                type="number" value={massChange} onChange={e => setMassChange(Number(e.target.value))}
                                className="bg-transparent w-full text-white font-mono"
                            />
                            <span className="text-slate-500 text-xs font-bold">kg</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                            {mode === 'MOVE' ? 'Distance Moved' : 'Dist. between Mass & CG'}
                        </label>
                        <div className="flex items-center bg-slate-800 rounded px-3 py-2 border border-slate-700">
                            <ArrowRight size={16} className="text-slate-500 mr-2" />
                            <input
                                type="number" value={distance} onChange={e => setDistance(Number(e.target.value))}
                                className="bg-transparent w-full text-white font-mono"
                            />
                            <span className="text-slate-500 text-xs font-bold">m</span>
                        </div>
                    </div>
                </div>

                {/* Results & Visualization */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700 flex flex-col justify-center items-center">

                    <div className="mb-8 w-full">
                        <div className="text-xs text-slate-400 uppercase font-bold text-center mb-4">Visual Representation</div>

                        {/* Seesaw Visualization */}
                        <div className="relative h-24 w-full border-b-2 border-slate-600">
                            {/* Fulcrum (Old CG) */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-slate-500"></div>

                            {/* Mass Representation */}
                            {mode === 'MOVE' && (
                                <>
                                    <div className="absolute bottom-1 left-[20%] w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-[10px] font-bold opacity-50">Old</div>
                                    <ArrowRight className="absolute bottom-4 left-[30%] text-white animate-pulse" />
                                    <div className="absolute bottom-1 left-[60%] w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-[10px] font-bold border-2 border-white">New</div>
                                </>
                            )}

                            {mode === 'ADD' && (
                                <>
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-16 bg-slate-700 rounded flex items-center justify-center text-xs text-slate-500">Aircraft</div>
                                    <ArrowDown className="absolute top-0 right-[20%] text-green-500 animate-bounce" />
                                    <div className="absolute bottom-1 right-[20%] w-8 h-8 bg-green-500 rounded flex items-center justify-center text-[10px] font-bold text-black">+</div>
                                </>
                            )}

                            {mode === 'REMOVE' && (
                                <>
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-16 bg-slate-700 rounded flex items-center justify-center text-xs text-slate-500">Aircraft</div>
                                    <ArrowUp className="absolute top-0 right-[20%] text-red-500 animate-bounce" />
                                    <div className="absolute bottom-1 right-[20%] w-8 h-8 bg-red-500/50 border-2 border-red-500 dashed rounded flex items-center justify-center text-[10px] font-bold text-white">-</div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="text-center space-y-4 w-full">
                        <div className="bg-black/30 p-4 rounded-lg font-mono text-sm text-yellow-400 break-all">
                            {formulaString}
                        </div>

                        <div className="flex justify-between items-end border-t border-slate-700 pt-4">
                            <div className="text-left">
                                <div className="text-xs text-slate-500 uppercase">Input Check</div>
                                <div className="text-sm font-bold text-slate-300">
                                    {mode === 'ADD' ? `New Mass: ${newMass}kg` : (mode === 'REMOVE' ? `Old Mass Val used: ${oldMass}kg` : `Mass Constant`)}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-slate-500 uppercase">CG Shift</div>
                                <div className="text-3xl font-black text-white">{shift.toFixed(4)} m</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="bg-blue-900/20 text-blue-200 p-4 rounded-lg text-sm border border-blue-500/30">
                <p><strong>Note:</strong> The formula for "Removing Mass" provided in the reference uses <code>Old Total Mass</code> in the denominator. Always verify which mass (Old vs New) is used in specific exam questions, as conventions can vary slightly in operational contexts vs theoretical questions.</p>
            </div>

        </div>
    );
};

export default CGShiftVisualizer;
