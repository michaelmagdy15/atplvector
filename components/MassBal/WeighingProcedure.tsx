import React, { useState } from 'react';
import { Scale, ArrowRight, CheckCircle, AlertTriangle, Calculator } from 'lucide-react';

const WeighingProcedure: React.FC = () => {
    const [leftMain, setLeftMain] = useState(502);
    const [rightMain, setRightMain] = useState(498);
    const [nose, setNose] = useState(150);

    // Arms from Datum (m)
    const armMain = 2.0;
    const armNose = 0.5;

    const totalMass = leftMain + rightMain + nose;

    // Moment = Mass * Arm
    const momentMain = (leftMain + rightMain) * armMain;
    const momentNose = nose * armNose;
    const totalMoment = momentMain + momentNose;

    // CG Position
    const cg = totalMoment / totalMass;

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Scale className="text-indigo-400" /> Weighing Procedures (031.04)
            </h2>

            <p className="text-slate-400 mb-6">
                Calculate the Basic Empty Mass Center of Gravity (BEM CG) using scale readings from the wheels.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Visual Representation */}
                <div className="bg-slate-900 rounded-xl p-8 relative flex flex-col items-center justify-center min-h-[300px] border border-slate-700">
                    {/* Aircraft Schematic Top View */}
                    <div className="relative w-48 h-64 border-2 border-slate-600 rounded-full opacity-50"></div>

                    {/* Wings */}
                    <div className="absolute top-1/2 left-0 w-full h-2 bg-slate-600 -translate-y-1/2"></div>

                    {/* Left Main Scale */}
                    <div className="absolute left-[20%] top-[60%] flex flex-col items-center">
                        <div className="w-12 h-12 bg-slate-800 border-2 border-indigo-500 rounded flex items-center justify-center text-indigo-400 font-bold">L</div>
                        <span className="text-xs text-slate-400 mt-1">Left Main</span>
                    </div>

                    {/* Right Main Scale */}
                    <div className="absolute right-[20%] top-[60%] flex flex-col items-center">
                        <div className="w-12 h-12 bg-slate-800 border-2 border-indigo-500 rounded flex items-center justify-center text-indigo-400 font-bold">R</div>
                        <span className="text-xs text-slate-400 mt-1">Right Main</span>
                    </div>

                    {/* Nose Scale */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-[20%] flex flex-col items-center">
                        <div className="w-12 h-12 bg-slate-800 border-2 border-emerald-500 rounded flex items-center justify-center text-emerald-400 font-bold">N</div>
                        <span className="text-xs text-slate-400 mt-1">Nose</span>
                    </div>

                    {/* Datum Line */}
                    <div className="absolute top-0 left-0 w-full border-t-2 border-dashed border-red-500"></div>
                    <span className="absolute top-0 right-0 text-red-500 text-xs font-bold bg-slate-900 px-1">DATUM</span>
                </div>

                {/* Controls and Calculations */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                            <label className="flex justify-between text-xs text-indigo-400 font-bold uppercase mb-2">
                                Left Main Scale (kg)
                                <span className="text-white">{leftMain}</span>
                            </label>
                            <input type="range" min="400" max="600" value={leftMain} onChange={e => setLeftMain(Number(e.target.value))} className="w-full accent-indigo-500" />
                        </div>
                        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                            <label className="flex justify-between text-xs text-indigo-400 font-bold uppercase mb-2">
                                Right Main Scale (kg)
                                <span className="text-white">{rightMain}</span>
                            </label>
                            <input type="range" min="400" max="600" value={rightMain} onChange={e => setRightMain(Number(e.target.value))} className="w-full accent-indigo-500" />
                        </div>
                        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                            <label className="flex justify-between text-xs text-emerald-400 font-bold uppercase mb-2">
                                Nose Scale (kg)
                                <span className="text-white">{nose}</span>
                            </label>
                            <input type="range" min="100" max="250" value={nose} onChange={e => setNose(Number(e.target.value))} className="w-full accent-emerald-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 text-slate-900 shadow-lg">
                        <h3 className="font-bold text-lg mb-4 border-b pb-2">Weighing Report (BEM)</h3>
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <span className="text-slate-500">Total Weight:</span>
                            <span className="font-mono font-bold text-right">{totalMass} kg</span>

                            <span className="text-slate-500">Total Moment:</span>
                            <span className="font-mono font-bold text-right">{totalMoment.toFixed(1)} kg·m</span>

                            <span className="text-slate-500 col-span-2 mt-2 pt-2 border-t font-bold text-base flex justify-between items-center">
                                Calculated CG:
                                <span className="text-indigo-600 text-xl">{cg.toFixed(3)} m</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Equipment Standards Note */}
            <div className="mt-8 bg-slate-700/50 rounded-lg p-4 border border-slate-600 flex items-start gap-3">
                <Calculator className="w-5 h-5 text-indigo-400 mt-1" />
                <div className="text-sm text-slate-300">
                    <p className="font-bold text-white mb-1">Equipment Standards</p>
                    <ul className="list-disc pl-4 space-y-1">
                        <li>Capacity: Must be compatible with the mass to be weighed.</li>
                        <li>Accuracy: Typically better than ±0.5% of the reading.</li>
                        <li>Graduations: Approximate to the mass (e.g., 5g for small aircraft, up to 20kg for large jets).</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default WeighingProcedure;
