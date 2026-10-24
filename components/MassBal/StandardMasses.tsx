import React, { useState } from 'react';
import { Users, User, Briefcase, Info, Scale, Calculator, Baby, CheckCircle } from 'lucide-react';

const StandardMasses: React.FC = () => {
    const [mopsc, setMopsc] = useState(180);
    const [includeHandBag, setIncludeHandBag] = useState(true);

    // EASA Part-CAT Standard masses (EASA Ch 10)
    const flightCrew = 85; // kg includes hand baggage
    const cabinCrew = 75;  // kg includes hand baggage
    const handBaggage = 6; // kg
    const clothing = 4;    // kg

    // Passenger breakdown state
    const [maleCount, setMaleCount] = useState<number>(75);
    const [femaleCount, setFemaleCount] = useState<number>(65);
    const [childCount, setChildCount] = useState<number>(10);
    const [infantCount, setInfantCount] = useState<number>(3);
    const [baggageType, setBaggageType] = useState<'domestic' | 'european' | 'intercontinental'>('european');

    // Standard weights
    const adultMaleMass = 88; // kg
    const adultFemaleMass = 70; // kg
    const allAdultAverage = 84; // kg
    const childMass = 35; // kg
    const infantMass = 0; // kg (handled on lap)

    const baggageMasses = {
        domestic: 11,
        european: 13,
        intercontinental: 15
    };

    // Calculate passenger mass based on MOPSC
    const getPassengerMass = () => {
        if (mopsc < 10) {
            return includeHandBag ? 76 + handBaggage + clothing : 76;
        } else if (mopsc < 19) {
            return includeHandBag ? 76 : 76 - handBaggage;
        } else {
            return allAdultAverage;
        }
    };

    const passengerMass = getPassengerMass();

    // Fleet Traffic Load computation
    const totalPassengers = maleCount + femaleCount + childCount + infantCount;
    const separateGenderMass = (maleCount * adultMaleMass) + (femaleCount * adultFemaleMass) + (childCount * childMass) + (infantCount * infantMass);
    const allAdultAvgMass = ((maleCount + femaleCount) * allAdultAverage) + (childCount * childMass) + (infantCount * infantMass);
    const checkedBagMass = (maleCount + femaleCount + childCount) * baggageMasses[baggageType];
    const totalTrafficLoad = separateGenderMass + checkedBagMass;

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-teal-500/10 border border-teal-500/20 rounded-full mb-4">
                    <Users className="w-8 h-8 text-teal-400" />
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                    Standard <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500">Mass Values</span>
                </h1>
                <p className="text-slate-400 mt-2 text-sm">
                    EASA Part-CAT passenger and crew standard mass tables & MOPSC regulations (EASA Ch 10)
                </p>
            </div>

            {/* Crew Standard Masses */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <User className="text-indigo-400" /> Crew Standard Masses (Part-CAT)
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

            {/* EASA Standard EASA Passenger Standards Table */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Users className="text-emerald-400" />
                        EASA Part-CAT Passenger Standard Mass Values (MOPSC ≥ 20)
                    </h3>
                    <span className="text-xs font-mono text-emerald-400 font-bold">EASA Ch 10</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 text-center">
                        <span className="text-xs text-slate-400 uppercase font-mono block">Adult Male</span>
                        <span className="text-3xl font-black text-cyan-400 mt-1 block">88 kg</span>
                        <span className="text-[10px] text-slate-500">Including hand baggage</span>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 text-center">
                        <span className="text-xs text-slate-400 uppercase font-mono block">Adult Female</span>
                        <span className="text-3xl font-black text-pink-400 mt-1 block">70 kg</span>
                        <span className="text-[10px] text-slate-500">Including hand baggage</span>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 text-center">
                        <span className="text-xs text-slate-400 uppercase font-mono block">All-Adult Average</span>
                        <span className="text-3xl font-black text-emerald-400 mt-1 block">84 kg</span>
                        <span className="text-[10px] text-slate-500">When gender not tracked</span>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 text-center">
                        <span className="text-xs text-slate-400 uppercase font-mono block">Child (2–12 yrs)</span>
                        <span className="text-3xl font-black text-amber-400 mt-1 block">35 kg</span>
                        <span className="text-[10px] text-slate-500">Infant (&lt;2y) = 0 kg (lap)</span>
                    </div>
                </div>
            </div>

            {/* MOPSC Calculator */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Calculator className="text-amber-400" /> Passenger Mass Regulation by MOPSC
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
                                <p className="text-xs text-slate-400 mt-1">Statement of actual mass from each person required (or add +6kg hand bag +4kg clothing to 76kg)</p>
                            </div>
                            <div className={`p-3 rounded-lg border transition-all ${mopsc >= 10 && mopsc < 20 ? 'bg-cyan-900/30 border-cyan-500' : 'bg-slate-900 border-slate-700'}`}>
                                <div className="flex justify-between items-center">
                                    <span className={`font-bold ${mopsc >= 10 && mopsc < 20 ? 'text-cyan-400' : 'text-slate-500'}`}>MOPSC 10-19</span>
                                    {mopsc >= 10 && mopsc < 20 && <span className="text-xs bg-cyan-500 text-black px-2 py-1 rounded-full font-bold">ACTIVE</span>}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">No hand baggage allowance deduction (-6kg) applicable</p>
                            </div>
                            <div className={`p-3 rounded-lg border transition-all ${mopsc >= 20 ? 'bg-emerald-900/30 border-emerald-500' : 'bg-slate-900 border-slate-700'}`}>
                                <div className="flex justify-between items-center">
                                    <span className={`font-bold ${mopsc >= 20 ? 'text-emerald-400' : 'text-slate-500'}`}>MOPSC ≥ 20</span>
                                    {mopsc >= 20 && <span className="text-xs bg-emerald-500 text-black px-2 py-1 rounded-full font-bold">ACTIVE</span>}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">Full standard mass tables: 88kg male, 70kg female, or 84kg all-adult average</p>
                            </div>
                        </div>
                    </div>

                    {/* Result */}
                    <div className="flex flex-col justify-center">
                        <div className="bg-gradient-to-br from-teal-900/30 to-emerald-900/30 rounded-2xl p-8 border border-teal-500/30 text-center space-y-4">
                            <div className="text-xs uppercase text-slate-400">Standard Passenger Base Mass</div>
                            <div className="text-6xl font-black text-teal-400">{passengerMass}</div>
                            <div className="text-sm text-white">kg per passenger (Standard)</div>

                            {mopsc < 10 && (
                                <div className="p-3 bg-amber-900/30 rounded-lg text-xs text-amber-300">
                                    <strong>MOPSC &lt; 10 Rule:</strong> Includes +{handBaggage}kg hand baggage and +{clothing}kg clothing allowance.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Notes */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                    <Info size={20} /> EASA Part-CAT Key Rules
                </h3>
                <ul className="text-xs text-slate-300 space-y-2">
                    <li>• Crew masses may be <strong>actual</strong> or <strong>standard</strong> (85 kg flight crew, 75 kg cabin crew).</li>
                    <li>• Infants (&lt; 2 years) handled on an adult's lap carry a standard mass of <strong>0 kg</strong> for loadsheet purposes.</li>
                    <li>• If 20 or more seats are installed (MOPSC ≥ 20), gender-specific values (88kg M / 70kg F) or all-adult average (84kg) must be applied.</li>
                    <li>• Holiday charter flights may use reduced standard masses if certified by the national aviation authority.</li>
                </ul>
            </div>
        </div>
    );
};

export default StandardMasses;
