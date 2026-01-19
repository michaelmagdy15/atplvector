import React, { useState } from 'react';
import { Users, User, Briefcase, Info, Scale, Calculator } from 'lucide-react';

const StandardMasses: React.FC = () => {
    const [mopsc, setMopsc] = useState(180);
    const [includeHandBag, setIncludeHandBag] = useState(true);

    // Standard masses (as per regulations)
    const flightCrew = 85; // kg includes hand baggage
    const cabinCrew = 75;  // kg includes hand baggage
    const handBaggage = 6; // kg
    const clothing = 4;    // kg

    // Calculate passenger mass based on MOPSC
    const getPassengerMass = () => {
        if (mopsc < 10) {
            // Statement from each person required
            // Standard: +6kg hand baggage, +4kg clothing
            return includeHandBag ? 76 + handBaggage + clothing : 76;
        } else if (mopsc < 19) {
            return includeHandBag ? 76 : 76 - handBaggage;
        } else {
            // Use standard tables
            return 84; // Average adult
        }
    };

    const passengerMass = getPassengerMass();

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-teal-500/10 rounded-full mb-4">
                    <Users className="w-8 h-8 text-teal-400" />
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                    Standard <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500">Masses</span>
                </h1>
                <p className="text-slate-400 mt-2">Crew and passenger standard mass values</p>
            </div>

            {/* Crew Standard Masses */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <User className="text-indigo-400" /> Crew Standard Masses
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Flight Crew */}
                    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-6 border border-indigo-500/30">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center">
                                <User className="text-indigo-400" size={32} />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white">Flight Crew</h4>
                                <p className="text-xs text-slate-400">Pilots / Flight Engineers</p>
                            </div>
                        </div>
                        <div className="text-center py-4">
                            <div className="text-5xl font-black text-indigo-400">{flightCrew}</div>
                            <div className="text-lg text-white">kg</div>
                        </div>
                        <div className="text-xs text-slate-400 text-center bg-black/30 rounded-lg p-2">
                            Includes hand baggage allowance
                        </div>
                    </div>

                    {/* Cabin Crew */}
                    <div className="bg-gradient-to-br from-pink-900/30 to-rose-900/30 rounded-xl p-6 border border-pink-500/30">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center">
                                <Users className="text-pink-400" size={32} />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white">Cabin Crew</h4>
                                <p className="text-xs text-slate-400">Flight Attendants</p>
                            </div>
                        </div>
                        <div className="text-center py-4">
                            <div className="text-5xl font-black text-pink-400">{cabinCrew}</div>
                            <div className="text-lg text-white">kg</div>
                        </div>
                        <div className="text-xs text-slate-400 text-center bg-black/30 rounded-lg p-2">
                            Includes hand baggage allowance
                        </div>
                    </div>
                </div>
            </div>

            {/* MOPSC Calculator */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Calculator className="text-amber-400" /> Passenger Mass Calculator (MOPSC Based)
                </h3>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Inputs */}
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase block mb-3">
                                Maximum Operational Passenger Seating Configuration (MOPSC)
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="300"
                                value={mopsc}
                                onChange={e => setMopsc(Number(e.target.value))}
                                className="w-full accent-amber-500 h-3"
                            />
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-slate-500 text-sm">1 seat</span>
                                <span className="text-3xl font-black text-white">{mopsc}</span>
                                <span className="text-slate-500 text-sm">300 seats</span>
                            </div>
                        </div>

                        {/* MOPSC Thresholds */}
                        <div className="space-y-2">
                            <div className={`p-3 rounded-lg border transition-all ${mopsc < 10 ? 'bg-amber-900/30 border-amber-500' : 'bg-slate-900 border-slate-700'}`}>
                                <div className="flex justify-between items-center">
                                    <span className={`font-bold ${mopsc < 10 ? 'text-amber-400' : 'text-slate-500'}`}>MOPSC &lt; 10</span>
                                    {mopsc < 10 && <span className="text-xs bg-amber-500 text-black px-2 py-1 rounded-full font-bold">ACTIVE</span>}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">Statement from each person required</p>
                            </div>
                            <div className={`p-3 rounded-lg border transition-all ${mopsc >= 10 && mopsc < 19 ? 'bg-cyan-900/30 border-cyan-500' : 'bg-slate-900 border-slate-700'}`}>
                                <div className="flex justify-between items-center">
                                    <span className={`font-bold ${mopsc >= 10 && mopsc < 19 ? 'text-cyan-400' : 'text-slate-500'}`}>MOPSC 10-18</span>
                                    {mopsc >= 10 && mopsc < 19 && <span className="text-xs bg-cyan-500 text-black px-2 py-1 rounded-full font-bold">ACTIVE</span>}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">No hand baggage = -6kg</p>
                            </div>
                            <div className={`p-3 rounded-lg border transition-all ${mopsc >= 19 ? 'bg-emerald-900/30 border-emerald-500' : 'bg-slate-900 border-slate-700'}`}>
                                <div className="flex justify-between items-center">
                                    <span className={`font-bold ${mopsc >= 19 ? 'text-emerald-400' : 'text-slate-500'}`}>MOPSC ≥ 19</span>
                                    {mopsc >= 19 && <span className="text-xs bg-emerald-500 text-black px-2 py-1 rounded-full font-bold">ACTIVE</span>}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">Use standard mass tables</p>
                            </div>
                        </div>

                        {mopsc < 19 && (
                            <div className="flex items-center gap-3 p-4 bg-slate-900 rounded-lg border border-slate-700">
                                <input
                                    type="checkbox"
                                    id="handBag"
                                    checked={includeHandBag}
                                    onChange={e => setIncludeHandBag(e.target.checked)}
                                    className="w-5 h-5 accent-amber-500"
                                />
                                <label htmlFor="handBag" className="text-sm text-slate-300">
                                    Include hand baggage (+{handBaggage}kg)
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Result */}
                    <div className="flex flex-col justify-center">
                        <div className="bg-gradient-to-br from-teal-900/30 to-emerald-900/30 rounded-xl p-8 border border-teal-500/30 text-center">
                            <div className="text-xs uppercase text-slate-400 mb-2">Standard Passenger Mass</div>
                            <div className="text-6xl font-black text-teal-400">{passengerMass}</div>
                            <div className="text-xl text-white mt-2">kg per passenger</div>

                            {mopsc < 10 && (
                                <div className="mt-4 p-3 bg-amber-900/30 rounded-lg text-xs text-amber-300">
                                    <strong>Note:</strong> Includes +{handBaggage}kg hand baggage and +{clothing}kg clothing
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Weighing Equipment */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Scale className="text-violet-400" /> Weighing Equipment Standards
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-violet-900/20 rounded-xl p-6 border border-violet-500/30">
                        <div className="text-xs uppercase text-slate-400 mb-2">Scale Capacity</div>
                        <div className="text-4xl font-black text-violet-400">150 <span className="text-lg">kg</span></div>
                    </div>
                    <div className="bg-violet-900/20 rounded-xl p-6 border border-violet-500/30">
                        <div className="text-xs uppercase text-slate-400 mb-2">Graduation</div>
                        <div className="text-4xl font-black text-violet-400">500 <span className="text-lg">g</span></div>
                    </div>
                </div>
            </div>

            {/* Key Notes */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                    <Info size={20} /> Key Points
                </h3>
                <ul className="text-sm text-slate-300 space-y-2">
                    <li>• Crew masses can be <strong>actual</strong> or <strong>standard</strong></li>
                    <li>• Standard masses include hand baggage allowance</li>
                    <li>• Operator must complete detailed weighing survey approved by Authority</li>
                    <li>• For MOPSC &lt; 10: Statement required from each person</li>
                </ul>
            </div>
        </div>
    );
};

export default StandardMasses;
