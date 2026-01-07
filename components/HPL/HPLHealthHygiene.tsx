import React, { useState } from 'react';
import { View } from '../../types';
import { ArrowLeft, Beer, Cigarette, AlertTriangle, Clock, Activity, Heart, Ban } from 'lucide-react';

interface Props {
    onNavigate: (view: View) => void;
}

const HPLHealthHygiene: React.FC<Props> = ({ onNavigate }) => {
    const [units, setUnits] = useState(2);
    const [hoursSinceDrink, setHoursSinceDrink] = useState(0);

    // Alcohol elimination: approx 1 unit per hour (rough rule of thumb for average metabolism)
    // EASA limit is effectively zero (0.2 permille ~ 0.02 BAC)
    // 1 Unit = 10ml pure alcohol.

    // Simple calc: Time to zero = Units * 1 hour + 1 hour safety buffer
    const hoursToZero = Math.ceil(units * 1);
    const isLegal = hoursSinceDrink >= (hoursToZero + 8); // EASA 'Bottle to throttle' 8 hours minimum RULE + sober
    const BAC = Math.max(0, (units * 0.02) - (hoursSinceDrink * 0.015)); // Very rough approximation

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => onNavigate(View.SYLLABUS_VIEWER)}
                    className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Health & Hygiene</h1>
                    <p className="text-slate-400">040.02.03 Alcohol, Drugs & Self-Discipline</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Alcohol Calculator */}
                <div className="glass-card p-6 rounded-2xl border border-slate-700">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Beer className="text-amber-400" />
                        "Bottle to Throttle" Calculator
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="flex justify-between text-slate-300 font-bold mb-2">
                                <span>Units Consumed</span>
                                <span className="text-amber-400">{units} Units</span>
                            </label>
                            <input
                                type="range" min="1" max="20"
                                value={units} onChange={e => setUnits(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>1 Pint ≈ 2-3 Units</span>
                                <span>1 Wine Bottle ≈ 9-10 Units</span>
                            </div>
                        </div>

                        <div>
                            <label className="flex justify-between text-slate-300 font-bold mb-2">
                                <span>Hours Since Last Drink</span>
                                <span className="text-blue-400">{hoursSinceDrink} Hours</span>
                            </label>
                            <input
                                type="range" min="0" max="48"
                                value={hoursSinceDrink} onChange={e => setHoursSinceDrink(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>

                        <div className={`p-4 rounded-xl border ${isLegal ? 'bg-emerald-900/20 border-emerald-500' : 'bg-red-900/20 border-red-500'} transition-colors`}>
                            <div className="flex items-center gap-3 mb-2">
                                {isLegal ? <Activity className="text-emerald-400" /> : <Ban className="text-red-400" />}
                                <h3 className={`text-lg font-black ${isLegal ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {isLegal ? "FIT TO FLY" : "NO FLY"}
                                </h3>
                            </div>
                            <p className="text-slate-300 text-sm mb-2">
                                {isLegal
                                    ? "You have passed the 8-hour minimum and are theoretically sober."
                                    : `Waiting time required. EASA mandates absolute sobriety + min 8 hours.`}
                            </p>

                            {!isLegal && (
                                <div className="mt-2 text-xs text-slate-400 font-mono">
                                    Est. Time to Zero BAC: {Math.max(0, hoursToZero - hoursSinceDrink)} hours more
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Smoking & Hypoxia */}
                <div className="glass-card p-6 rounded-2xl border border-slate-700">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Cigarette className="text-slate-400" />
                        Smoking & Hypoxia
                    </h2>

                    <div className="bg-slate-900 rounded-xl p-4 mb-4">
                        <h3 className="font-bold text-white mb-2">Carbon Monoxide (CO) Affinity</h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Haemoglobin has a <strong>210x - 250x</strong> greater affinity for CO than Oxygen.
                            Smoking creates "Anaemic Hypoxia" (reduced carrying capacity).
                        </p>

                        <div className="relative h-24 bg-red-900/20 rounded-lg overflow-hidden border border-red-900/50">
                            {/* RBCs */}
                            <div className="absolute top-1/2 left-4 w-8 h-8 rounded-full bg-red-600 shadow-[0_0_10px_red] flex items-center justify-center text-[8px] font-bold text-white animate-pulse">Hb</div>

                            {/* O2 Molecules */}
                            <div className="absolute top-1/4 right-8 w-4 h-4 rounded-full bg-blue-400 flex items-center justify-center text-[6px] text-black">O2</div>

                            {/* CO Molecules */}
                            <div className="absolute top-1/2 right-20 w-4 h-4 rounded-full bg-slate-400 border border-white flex items-center justify-center text-[6px] text-black font-bold animate-bounce">CO</div>

                            <div className="absolute bottom-2 left-2 text-xs text-slate-500">The CO molecule blocks the O2 binding site permanently (until cell death).</div>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="text-yellow-400 shrink-0" size={20} />
                            <div>
                                <h4 className="font-bold text-white text-sm">Effect on Night Vision</h4>
                                <p className="text-xs text-slate-400 mt-1">
                                    Smokers have a <strong>physiological altitude of 4,000 - 5,000 ft</strong> even at sea level.
                                    This significantly degrades night vision (rods concern) and lowers TUC.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Other Hygiene Factors */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <h3 className="font-bold text-white mb-2">Drugs & Medication</h3>
                    <p className="text-slate-400 text-sm">
                        Rule: "If you have to take medicine, you are not fit to fly."
                        <br /> Unless approved by AME. Even common cold remedies (antihistamines) cause drowsiness.
                    </p>
                </div>
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <h3 className="font-bold text-white mb-2">Blood Donation</h3>
                    <p className="text-slate-400 text-sm">
                        Wait <strong>24 hours</strong> after giving blood before flying to restore volume.
                        Reduces oxygen carrying capacity until RBCs replenish (weeks).
                    </p>
                </div>
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <h3 className="font-bold text-white mb-2">Decompression Sickness</h3>
                    <p className="text-slate-400 text-sm">
                        Scuba Diving &gt; 10m depth: Do not fly for <strong>24 hours</strong>.
                        <br /> &lt; 10m depth: Wait 12 hours. Nitrogen bubbles expand at altitude.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HPLHealthHygiene;
