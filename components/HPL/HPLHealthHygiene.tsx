import React, { useState } from 'react';
import { View } from '../../types';
import { ArrowLeft, Beer, Cigarette, AlertTriangle, Clock, Activity, Ban, Utensils, Droplets, Apple } from 'lucide-react';

interface Props {
    onNavigate: (view: View) => void;
}

const HPLHealthHygiene: React.FC<Props> = ({ onNavigate }) => {
    const [tab, setTab] = useState<'alcohol' | 'smoking' | 'diet'>('alcohol');
    const [units, setUnits] = useState(2);
    const [hoursSinceDrink, setHoursSinceDrink] = useState(0);

    // Alcohol elimination: approx 1 unit per hour
    const hoursToZero = Math.ceil(units * 1);
    const isLegal = hoursSinceDrink >= (hoursToZero + 8);

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onNavigate(View.HPL_HOME)}
                        className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Health & Hygiene</h1>
                        <p className="text-slate-400">040.02.03 Health Maintenance & Hygiene</p>
                    </div>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                    <button
                        onClick={() => setTab('alcohol')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${tab === 'alcohol' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Alcohol
                    </button>
                    <button
                        onClick={() => setTab('smoking')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${tab === 'smoking' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Smoking
                    </button>
                    <button
                        onClick={() => setTab('diet')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${tab === 'diet' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Diet & Hydration
                    </button>
                </div>
            </div>

            {tab === 'alcohol' && (
                <div className="grid md:grid-cols-2 gap-8 animate-in slide-in-from-left-4">
                    <div className="glass-card p-6 rounded-2xl border border-slate-700">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Beer className="text-amber-400" />
                            "Bottle to Throttle" Calculator
                        </h2>
                        {/* Alcohol UI code */}
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
                            <div className={`p-4 rounded-xl border ${isLegal ? 'bg-emerald-900/20 border-emerald-500' : 'bg-red-900/20 border-red-500'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                    {isLegal ? <Activity className="text-emerald-400" /> : <Ban className="text-red-400" />}
                                    <h3 className={`text-lg font-black ${isLegal ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {isLegal ? "FIT TO FLY" : "NO FLY"}
                                    </h3>
                                </div>
                                <p className="text-slate-300 text-sm">{isLegal ? "You have passed the 8-hour minimum and are theoretically sober." : "Waiting time required. EASA mandates absolute sobriety + min 8 hours."}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <AlertTriangle className="text-yellow-400" /> Regulations
                        </h3>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><strong>8 Hours:</strong> Minimum "Bottle to Throttle" time.</li>
                            <li><strong>0.2 Promille:</strong> The effective legal limit for flight crew (effectively zero).</li>
                            <li><strong>Wait 24h:</strong> Recommended after heavy consumption to ensure no hangover effects.</li>
                            <li><strong>AME:</strong> Must be consulted if alcohol dependency is suspected.</li>
                        </ul>
                    </div>
                </div>
            )}

            {tab === 'smoking' && (
                <div className="grid md:grid-cols-2 gap-8 animate-in slide-in-from-right-4">
                    <div className="glass-card p-6 rounded-2xl border border-slate-700">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Cigarette className="text-slate-400" />
                            Smoking & Hypoxia
                        </h2>
                        <div className="bg-slate-900 rounded-xl p-4 mb-4">
                            <h3 className="font-bold text-white mb-2 text-sm">Carbon Monoxide (CO) Affinity</h3>
                            <p className="text-xs text-slate-400 mb-4">Haemoglobin has a <strong>210-250x</strong> greater affinity for CO than O2.</p>
                            <div className="relative h-20 bg-red-900/10 border border-red-900/30 rounded-lg overflow-hidden flex items-center justify-around">
                                <div className="text-center"><div className="w-8 h-8 rounded-full bg-red-600 mx-auto mb-1 animate-pulse"></div><span className="text-[10px] text-white">Hb</span></div>
                                <div className="text-slate-500">←</div>
                                <div className="text-center"><div className="w-6 h-6 rounded-full bg-slate-400 mx-auto mb-1 border border-white"></div><span className="text-[10px] text-white">CO</span></div>
                                <div className="text-emerald-500 font-black">X</div>
                                <div className="text-center opacity-30"><div className="w-6 h-6 rounded-full bg-blue-400 mx-auto mb-1"></div><span className="text-[10px] text-white font-bold">O2</span></div>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                            <p className="text-xs text-slate-400">Smokers have a <strong>physiological altitude of 4,000-5,000 ft</strong> at sea level, significantly degrading night vision.</p>
                        </div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                        <h3 className="font-bold text-white mb-4">Toxic Hazards</h3>
                        <div className="space-y-4">
                            <div className="p-3 bg-slate-800 rounded-lg border-l-4 border-red-500">
                                <h4 className="text-xs font-bold text-white">Blood Donation</h4>
                                <p className="text-[10px] text-slate-400">Wait 24h before flying. Reduces O2 carrying capacity.</p>
                            </div>
                            <div className="p-3 bg-slate-800 rounded-lg border-l-4 border-blue-500">
                                <h4 className="text-xs font-bold text-white">Scuba Diving</h4>
                                <p className="text-[10px] text-slate-400">Wait 24h (if {">10m"}) or 12h (if {"<10m"}). Risk of DCS.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {tab === 'diet' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in zoom-in-95 duration-500">
                    <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-700">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Utensils className="text-emerald-400" />
                            Dietary Hazards & Nutrition
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                                <h3 className="font-bold text-white mb-2 text-sm flex items-center gap-2">
                                    <AlertTriangle className="text-orange-400" size={16} /> Gastrointestinal Upsets
                                </h3>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    The most common cause of short-term pilot incapacitation. Often caused by food poisoning or dietary changes during travel.
                                </p>
                            </div>
                            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                                <h3 className="font-bold text-white mb-2 text-sm flex items-center gap-2">
                                    <Apple className="text-emerald-400" size={16} /> Balanced Diet
                                </h3>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    A healthy diet should consist of approximately:
                                    <br />• 60% Carbohydrates
                                    <br />• 25% Fats
                                    <br />• 15% Proteins
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 bg-red-900/10 p-4 rounded-xl border border-red-500/20">
                            <h3 className="font-bold text-red-400 mb-2 text-sm flex items-center gap-2">
                                <Activity size={16} /> Hypoglycaemia
                            </h3>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Low blood sugar caused by missed meals or excessive sugar intake (causing a "crash").
                                <strong>Symptoms:</strong> Tremor, sweating, dizziness, and impaired cognitive performance.
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Droplets className="text-blue-400" /> Hydration
                        </h3>
                        <p className="text-xs text-slate-400 mb-4">
                            Cabin humidity is typically <strong>{"< 5%"}</strong>. Pilots lose moisture through respiration and skin.
                        </p>
                        <ul className="space-y-3 text-xs text-slate-300">
                            <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0"></div> Drink water before you feel thirsty.</li>
                            <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0"></div> Avoid excessive coffee/tea (diuretics).</li>
                            <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0"></div> Dehydration leads to fatigue and poor judgment.</li>
                        </ul>

                        <div className="mt-8 pt-6 border-t border-slate-800">
                            <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                                <Utensils size={14} className="text-emerald-400" /> Food & Water Hygiene
                            </h4>
                            <div className="space-y-3">
                                <p className="text-[10px] text-slate-400 leading-relaxed">
                                    Common infections: <strong>Salmonella, Staphylococci, and Botulism.</strong>
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-slate-800 p-2 rounded text-[9px] text-slate-300">
                                        <span className="text-emerald-400 font-bold block mb-1">Water Safety</span>
                                        Filter, Boil (Min 1 min), or use Chlorine/Iodine tablets.
                                    </div>
                                    <div className="bg-slate-800 p-2 rounded text-[9px] text-slate-300">
                                        <span className="text-emerald-400 font-bold block mb-1">Food Safety</span>
                                        "Peel it, Cook it, or Forget it." Avoid buffet food left at room temp.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HPLHealthHygiene;
