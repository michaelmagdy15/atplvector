
import React, { useState } from 'react';
import { Plane, AlertTriangle, ArrowRight, Mountain, FileText } from 'lucide-react';

const RulesOfTheAirDetails: React.FC = () => {
    const [tab, setTab] = useState<'row' | 'heights' | 'fpl' | 'general' | 'signals'>('row');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Plane className="text-sky-400" />
                        Rules of the Air (Annex 2)
                    </h2>
                    <p className="text-slate-400 text-sm">Collision Avoidance, Minimum Heights, and Flight Plans.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg flex-wrap">
                    <button onClick={() => setTab('general')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'general' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}>General</button>
                    <button onClick={() => setTab('row')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'row' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}>Right of Way</button>
                    <button onClick={() => setTab('heights')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'heights' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}>Min Heights</button>
                    <button onClick={() => setTab('fpl')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'fpl' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}>Flight Plans</button>
                    <button onClick={() => setTab('signals')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'signals' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}>Signals</button>
                </div>
            </div>

            {tab === 'general' && <GeneralApplicability />}
            {tab === 'row' && <RightOfWay />}
            {tab === 'heights' && <MinimumHeights />}
            {tab === 'fpl' && <FlightPlans />}
            {tab === 'signals' && <Signals />}
        </div>
    );
};

const RightOfWay = () => {
    const [scenario, setScenario] = useState('converging');

    return (
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
            <div className="space-y-4">
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h3 className="font-bold text-white mb-4">Select Scenario</h3>
                    <div className="flex flex-col gap-2">
                        <button onClick={() => setScenario('converging')} className={`p-3 text-left rounded ${scenario === 'converging' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                            Converging (Same Altitude)
                        </button>
                        <button onClick={() => setScenario('headon')} className={`p-3 text-left rounded ${scenario === 'headon' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                            Head-on Approaching
                        </button>
                        <button onClick={() => setScenario('overtaking')} className={`p-3 text-left rounded ${scenario === 'overtaking' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                            Overtaking
                        </button>
                        <button onClick={() => setScenario('landing')} className={`p-3 text-left rounded ${scenario === 'landing' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                            Landing
                        </button>
                    </div>
                </div>

                <div className="bg-slate-800 border-l-4 border-yellow-500 p-4 rounded">
                    <h4 className="font-bold text-white text-sm mb-2">Priority Hierarchy</h4>
                    <ul className="text-xs text-slate-300 space-y-1">
                        <li>1. Distress (Emergency)</li>
                        <li>2. Balloons</li>
                        <li>3. Gliders</li>
                        <li>4. Airships</li>
                        <li>5. Power-driven Aircraft (Towing)</li>
                        <li>6. Power-driven Aircraft</li>
                    </ul>
                </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-8 border border-slate-700 relative h-[300px] flex items-center justify-center overflow-hidden">
                {/* Visuals */}
                {scenario === 'converging' && (
                    <>
                        <div className="absolute text-center">
                            <Plane className="text-red-500 w-12 h-12 -rotate-90" />
                            <p className="text-[10px] text-red-400 mt-1">Give Way</p>
                        </div>
                        <div className="absolute text-center translate-x-24 -translate-y-24">
                            <Plane className="text-emerald-500 w-12 h-12" />
                            <p className="text-[10px] text-emerald-400 mt-1">Right of Way</p>
                        </div>
                        <div className="absolute top-4 left-4 bg-black/50 p-2 rounded text-xs text-white">
                            "Give way to the aircraft on your RIGHT"
                        </div>
                    </>
                )}

                {scenario === 'headon' && (
                    <>
                        <div className="absolute text-center translate-y-16">
                            <Plane className="text-sky-400 w-12 h-12" />
                            <ArrowRight className="text-sky-400 rotate-45 mt-1 mx-auto" size={16} />
                        </div>
                        <div className="absolute text-center -translate-y-16">
                            <Plane className="text-sky-400 w-12 h-12 rotate-180" />
                            <ArrowRight className="text-sky-400 rotate-[135deg] mb-1 mx-auto" size={16} />
                        </div>
                        <div className="absolute top-4 left-4 bg-black/50 p-2 rounded text-xs text-white">
                            "Both turn RIGHT"
                        </div>
                    </>
                )}

                {scenario === 'overtaking' && (
                    <>
                        <div className="absolute text-center translate-y-12">
                            <Plane className="text-red-500 w-12 h-12" />
                            <p className="text-[10px] text-red-400 mt-1">Overtaking (Give Way)</p>
                        </div>
                        <div className="absolute text-center -translate-y-12">
                            <Plane className="text-emerald-500 w-12 h-12" />
                            <p className="text-[10px] text-emerald-400 mt-1">Overtaken (Right of Way)</p>
                        </div>
                        <div className="absolute top-4 left-4 bg-black/50 p-2 rounded text-xs text-white">
                            "Overtake on the RIGHT"
                        </div>
                    </>
                )}

                {scenario === 'landing' && (
                    <>
                        <div className="absolute text-center translate-y-8 translate-x-12">
                            <Plane className="text-emerald-500 w-12 h-12 -rotate-12" />
                            <p className="text-[10px] text-emerald-400 mt-1">Lower</p>
                        </div>
                        <div className="absolute text-center -translate-y-16 -translate-x-12">
                            <Plane className="text-red-500 w-12 h-12 -rotate-12" />
                            <p className="text-[10px] text-red-400 mt-1">Higher</p>
                        </div>
                        <div className="absolute bottom-0 w-full h-2 bg-slate-600"></div>
                        <div className="absolute top-4 left-4 bg-black/50 p-2 rounded text-xs text-white">
                            "Lower aircraft has priority (Emergency exception)"
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const MinimumHeights = () => (
    <div className="grid md:grid-cols-2 gap-8 animate-in slide-in-from-right-2">
        <div className="space-y-6">
            <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                    <Mountain className="text-amber-500" /> Congested Areas
                </h3>
                <p className="text-sm text-slate-300 mb-4">Cities, towns, settlements, or open air assemblies.</p>
                <div className="bg-slate-800 p-4 rounded border-l-4 border-amber-500">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-xs text-slate-400">Min Height</span>
                        <span className="text-xl font-bold text-white">1000 ft</span>
                    </div>
                    <p className="text-xs text-slate-500">Above highest obstacle within 600m radius.</p>
                </div>
            </div>

            <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                    <Mountain className="text-emerald-500" /> Elsewhere
                </h3>
                <p className="text-sm text-slate-300 mb-4">Any other area (water, rural).</p>
                <div className="bg-slate-800 p-4 rounded border-l-4 border-emerald-500">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-xs text-slate-400">Min Height</span>
                        <span className="text-xl font-bold text-white">500 ft</span>
                    </div>
                    <p className="text-xs text-slate-500">Above ground or water (AGL).</p>
                </div>
            </div>
        </div>

        <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700 relative min-h-[300px] flex items-end">
            {/* Visual */}
            <div className="absolute top-4 left-4 z-10 text-xs font-bold text-white bg-black/50 p-2 rounded">
                GENERAL RULE
            </div>

            {/* City */}
            <div className="w-1/2 h-full relative flex items-end justify-center border-r border-slate-700 border-dashed">
                <div className="w-20 h-32 bg-slate-700 mx-auto z-10 relative">
                    <div className="absolute -top-32 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <Plane className="text-amber-400 w-8 h-8 mb-1" />
                        <div className="h-20 w-0 border-l border-amber-500/50"></div>
                        <span className="text-amber-400 text-xs font-bold bg-black/50 px-1 rounded">1000ft</span>
                    </div>
                </div>
                <div className="w-full h-4 bg-slate-600 absolute bottom-0"></div>
                <span className="absolute bottom-2 text-xs font-bold text-white z-20">Congested</span>
            </div>

            {/* Rural */}
            <div className="w-1/2 h-full relative flex items-end justify-center">
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center translate-y-32">
                    <Plane className="text-emerald-400 w-8 h-8 mb-1" />
                    <div className="h-10 w-0 border-l border-emerald-500/50"></div>
                    <span className="text-emerald-400 text-xs font-bold bg-black/50 px-1 rounded">500ft</span>
                </div>
                <div className="w-full h-4 bg-emerald-800 absolute bottom-0"></div>
                <span className="absolute bottom-2 text-xs font-bold text-white z-20">Elsewhere</span>
            </div>
        </div>
    </div>
);

const FlightPlans = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                <FileText size={20} className="text-indigo-400" /> Submission Requirements
            </h3>

            <div className="relative border-l-2 border-slate-600 ml-4 space-y-8 py-2">
                <div className="relative pl-8">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 bg-indigo-500 rounded-full border-2 border-slate-900"></div>
                    <h4 className="font-bold text-white text-sm">60 Minutes Before Departure</h4>
                    <p className="text-xs text-slate-400">Standard submission for IFR flights or flights crossing borders.</p>
                </div>
                <div className="relative pl-8">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 bg-sky-500 rounded-full border-2 border-slate-900"></div>
                    <h4 className="font-bold text-white text-sm">10 Minutes Before Entry</h4>
                    <p className="text-xs text-slate-400">In-flight submission (AFIL) before entering Controlled Airspace (or crossing border).</p>
                </div>
                <div className="relative pl-8">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
                    <h4 className="font-bold text-white text-sm">30 Minutes After Landing</h4>
                    <p className="text-xs text-slate-400">Flight Plan CLOSURE. Mandatory arrival report if no ATS at destination to prevent SAR initiation.</p>
                </div>
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-800 p-4 rounded border border-slate-600">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Repetitive FPL</p>
                <p className="text-white font-bold">RPL</p>
                <p className="text-[10px] text-slate-500 mt-1">For regular scheduled flights (e.g., Airline schedules).</p>
            </div>
            <div className="bg-slate-800 p-4 rounded border border-slate-600">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">Delay Tolerance</p>
                <p className="text-white font-bold">30 Mins (Controlled)</p>
                <p className="text-[10px] text-slate-500 mt-1">FPL invalid if delayed &gt;30 mins (60 mins uncontrolled). Send DLA msg.</p>
            </div>
            <div className="bg-slate-800 p-4 rounded border border-slate-600">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">VFR Requirement</p>
                <p className="text-white font-bold">Crossing Borders</p>
                <p className="text-[10px] text-slate-500 mt-1">Or entering Class B/C/D airspace.</p>
            </div>
        </div>
    </div>
);

const GeneralApplicability = () => (
    <div className="grid md:grid-cols-2 gap-6 animate-in fade-in">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="text-sky-400" /> Responsibility & Authority
            </h3>
            <div className="space-y-4">
                <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-sky-500">
                    <h4 className="font-bold text-white text-sm mb-1">PIC Responsibility</h4>
                    <p className="text-xs text-slate-300">Responsible for operation in accordance with Rules of the Air. May deviate <strong>ONLY</strong> in the interests of safety.</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-indigo-500">
                    <h4 className="font-bold text-white text-sm mb-1">Final Authority</h4>
                    <p className="text-xs text-slate-300">The PIC has final authority as to the disposition of the aircraft while in command.</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-amber-500">
                    <h4 className="font-bold text-white text-sm mb-1">Pre-flight Action</h4>
                    <p className="text-xs text-slate-300">PIC must become familiar with all available information: weather, fuel, and alternatives.</p>
                </div>
            </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Plane className="text-emerald-400" /> Territorial Application
            </h3>
            <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded border border-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                    <p className="text-xs text-slate-300">Must comply with rules of the <strong>State of Registration</strong> wherever they are.</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded border border-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                    <p className="text-xs text-slate-300">If local rules differ, the <strong>most restrictive</strong> applies.</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded border border-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                    <p className="text-xs text-slate-300">Over <strong>High Seas</strong>: ICAO Rules apply, or rules of the State that has taken responsibility for that airspace.</p>
                </div>
            </div>

            <h3 className="font-bold text-white mt-6 mb-4 flex items-center gap-2">
                <AlertTriangle className="text-amber-500" size={18} /> Proximity & Formation
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 p-3 rounded border border-slate-700">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Formation</span>
                    <p className="text-[11px] text-slate-300 mt-1">Pre-arranged by PICs. Operates as <strong>single aircraft</strong> for ATC.</p>
                </div>
                <div className="bg-slate-800 p-3 rounded border border-slate-700">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Proximity</span>
                    <p className="text-[11px] text-slate-300 mt-1">Shall not be operated so as to create a <strong>collision hazard</strong>.</p>
                </div>
            </div>
        </div>
    </div>
);

const Signals = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="text-red-500" /> Interception Signals
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-800 p-4 rounded-lg">
                    <h4 className="text-xs font-bold text-red-400 uppercase mb-3">Interceptor Actions</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-[11px] border-b border-slate-700 pb-2">
                            <span className="text-slate-300">Rock wings + slow turn</span>
                            <span className="text-white font-bold">Follow Me</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] border-b border-slate-700 pb-2">
                            <span className="text-slate-300">Abrupt break-off turn</span>
                            <span className="text-white font-bold">Proceed</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] border-b border-slate-700 pb-2">
                            <span className="text-slate-300">Lower gear + overfly rwy</span>
                            <span className="text-white font-bold">Land Here</span>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase mb-3">Intercepted Actions</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-[11px] border-b border-slate-700 pb-2">
                            <span className="text-slate-300">Rock wings + flash lights</span>
                            <span className="text-white font-bold">Understood / Wilco</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] border-b border-slate-700 pb-2">
                            <span className="text-slate-300">Irregular flash (all lights)</span>
                            <span className="text-white font-bold">In Distress</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] border-b border-slate-700 pb-2">
                            <span className="text-slate-300">Switching on/off (regular)</span>
                            <span className="text-white font-bold">Unable to Comply</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4 p-3 bg-red-900/20 border border-red-900/50 rounded flex gap-3 items-center">
                <AlertTriangle className="text-red-500 shrink-0" size={16} />
                <p className="text-[10px] text-red-200">Set transponder to <strong>7700</strong> (Emergency) and attempt contact on <strong>121.5 MHz</strong>.</p>
            </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-4">Light Gun Signals (Ground/Air)</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-[11px] text-left">
                    <thead>
                        <tr className="border-b border-slate-700 text-slate-500 uppercase font-black tracking-tighter">
                            <th className="py-2 px-1">Signal Type</th>
                            <th className="py-2 px-1">In Flight</th>
                            <th className="py-2 px-1">On Ground</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-300">
                        <tr className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                            <td className="py-3 px-1 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div> Steady Green</td>
                            <td className="py-2 px-1 text-emerald-400 font-bold">Cleared to Land</td>
                            <td className="py-2 px-1 text-emerald-400 font-bold">Cleared for Take-off</td>
                        </tr>
                        <tr className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                            <td className="py-3 px-1 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Flashing Green</td>
                            <td className="py-2 px-1">Return for Landing</td>
                            <td className="py-2 px-1 text-emerald-400">Cleared to Taxi</td>
                        </tr>
                        <tr className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                            <td className="py-3 px-1 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div> Steady Red</td>
                            <td className="py-2 px-1 text-red-400">Give way / Circle</td>
                            <td className="py-2 px-1 text-red-400 font-bold">STOP</td>
                        </tr>
                        <tr className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                            <td className="py-3 px-1 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> Flashing Red</td>
                            <td className="py-2 px-1 text-red-400">Aerodrome Unsafe</td>
                            <td className="py-2 px-1 text-red-400">Taxi clear of rwy</td>
                        </tr>
                        <tr className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                            <td className="py-3 px-1 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-white animate-pulse"></div> Flashing White</td>
                            <td className="py-2 px-1">Land and Proceed</td>
                            <td className="py-2 px-1">Return to Start</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

export default RulesOfTheAirDetails;
