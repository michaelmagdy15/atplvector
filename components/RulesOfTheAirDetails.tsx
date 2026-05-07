import React, { useState } from 'react';
import { Plane, AlertTriangle, ArrowRight, Mountain, FileText, Wind, Sun, Moon, Navigation, Info, Shield, CheckCircle2, ChevronRight, Lightbulb, Zap, Radio, UserX, Activity, Eye, Clock, MapPin, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RulesOfTheAirDetails: React.FC = () => {
    const [tab, setTab] = useState<'row' | 'heights' | 'fpl' | 'general' | 'signals' | 'levels' | 'weather' | 'atc' | 'ops'>('general');

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

                <div className="flex bg-slate-900 p-1 rounded-lg flex-wrap gap-1">
                    <button onClick={() => setTab('general')} className={`px-3 py-1.5 rounded-md font-bold text-xs transition-all ${tab === 'general' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>General</button>
                    <button onClick={() => setTab('row')} className={`px-3 py-1.5 rounded-md font-bold text-xs transition-all ${tab === 'row' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>Right of Way</button>
                    <button onClick={() => setTab('heights')} className={`px-3 py-1.5 rounded-md font-bold text-xs transition-all ${tab === 'heights' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>Min Heights</button>
                    <button onClick={() => setTab('levels')} className={`px-3 py-1.5 rounded-md font-bold text-xs transition-all ${tab === 'levels' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>Cruising Levels</button>
                    <button onClick={() => setTab('weather')} className={`px-3 py-1.5 rounded-md font-bold text-xs transition-all ${tab === 'weather' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>Weather Minima</button>
                    <button onClick={() => setTab('fpl')} className={`px-3 py-1.5 rounded-md font-bold text-xs transition-all ${tab === 'fpl' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>Flight Plans</button>
                    <button onClick={() => setTab('atc')} className={`px-3 py-1.5 rounded-md font-bold text-xs transition-all ${tab === 'atc' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>ATC & Comms</button>
                    <button onClick={() => setTab('ops')} className={`px-3 py-1.5 rounded-md font-bold text-xs transition-all ${tab === 'ops' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>Operations</button>
                    <button onClick={() => setTab('signals')} className={`px-3 py-1.5 rounded-md font-bold text-xs transition-all ${tab === 'signals' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>Signals</button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {tab === 'general' && <GeneralApplicability />}
                    {tab === 'row' && <RightOfWay />}
                    {tab === 'heights' && <MinimumHeights />}
                    {tab === 'levels' && <CruisingLevels />}
                    {tab === 'weather' && <WeatherMinima />}
                    {tab === 'fpl' && <FlightPlans />}
                    {tab === 'atc' && <ATCProcedures />}
                    {tab === 'ops' && <OperationsSafety />}
                    {tab === 'signals' && <Signals />}
                </motion.div>
            </AnimatePresence>

        </div>
    );
};

const RightOfWay = () => {
    const [scenario, setScenario] = useState('converging');

    const variants = {
        converging: {
            plane1: { x: -100, y: 0, rotate: 90 },
            plane2: { x: 0, y: -100, rotate: 180 },
            action: "Give way to the aircraft on your RIGHT"
        },
        headon: {
            plane1: { x: 0, y: 100, rotate: 0 },
            plane2: { x: 0, y: -100, rotate: 180 },
            action: "Both turn RIGHT"
        },
        overtaking: {
            plane1: { x: 0, y: 80, rotate: 0 },
            plane2: { x: 0, y: -40, rotate: 0 },
            action: "Overtake on the RIGHT"
        },
        landing: {
            plane1: { x: 100, y: 50, rotate: -20 },
            plane2: { x: -100, y: -50, rotate: -20 },
            action: "Lower aircraft has priority"
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
            <div className="space-y-4">
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h3 className="font-bold text-white mb-4">Select Scenario</h3>
                    <div className="flex flex-col gap-2">
                        <button onClick={() => setScenario('converging')} className={`p-3 text-left rounded transition-all ${scenario === 'converging' ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                            Converging (Same Altitude)
                        </button>
                        <button onClick={() => setScenario('headon')} className={`p-3 text-left rounded transition-all ${scenario === 'headon' ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                            Head-on Approaching
                        </button>
                        <button onClick={() => setScenario('overtaking')} className={`p-3 text-left rounded transition-all ${scenario === 'overtaking' ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                            Overtaking
                        </button>
                        <button onClick={() => setScenario('landing')} className={`p-3 text-left rounded transition-all ${scenario === 'landing' ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                            Landing
                        </button>
                    </div>
                </div>

                <div className="bg-slate-800 border-l-4 border-yellow-500 p-4 rounded shadow-inner">
                    <h4 className="font-bold text-white text-sm mb-2">Priority Hierarchy</h4>
                    <ul className="text-xs text-slate-300 space-y-1">
                        <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-[10px] font-bold">1</span> Distress (Emergency)</li>
                        <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-500 flex items-center justify-center text-[10px] font-bold">2</span> Balloons</li>
                        <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-500 flex items-center justify-center text-[10px] font-bold">3</span> Gliders</li>
                        <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-500 flex items-center justify-center text-[10px] font-bold">4</span> Airships</li>
                        <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-500 flex items-center justify-center text-[10px] font-bold">5</span> Power-driven (Towing)</li>
                    </ul>
                </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-8 border border-slate-700 relative h-[350px] flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={scenario}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative w-full h-full flex items-center justify-center"
                    >
                        {/* Plane 1 */}
                        <motion.div 
                            initial={variants[scenario as keyof typeof variants].plane1}
                            animate={scenario === 'headon' ? { x: 50, y: 50, rotate: 45 } : 
                                     scenario === 'converging' ? { x: 0, y: 0 } : {}}
                            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                            className="absolute flex flex-col items-center"
                        >
                            <Plane className={`${scenario === 'landing' ? 'text-emerald-500' : 'text-red-500'} w-12 h-12 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]`} />
                            <span className="text-[8px] font-bold text-white mt-1 uppercase bg-black/40 px-1 rounded">
                                {scenario === 'landing' ? 'Lower' : 'Give Way'}
                            </span>
                        </motion.div>

                        {/* Plane 2 */}
                        <motion.div 
                            initial={variants[scenario as keyof typeof variants].plane2}
                            animate={scenario === 'headon' ? { x: -50, y: -50, rotate: 225 } : 
                                     scenario === 'overtaking' ? { x: 30, y: -80, rotate: 10 } : {}}
                            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                            className="absolute flex flex-col items-center"
                        >
                            <Plane className={`${scenario === 'landing' ? 'text-red-500' : 'text-emerald-500'} w-12 h-12 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]`} />
                            <span className="text-[8px] font-bold text-white mt-1 uppercase bg-black/40 px-1 rounded">
                                {scenario === 'landing' ? 'Higher' : 'Priority'}
                            </span>
                        </motion.div>

                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10 text-xs text-white flex items-center gap-2 max-w-[200px] z-20">
                            <Info size={14} className="text-sky-400 shrink-0" />
                            <span>{variants[scenario as keyof typeof variants].action}</span>
                        </div>
                    </motion.div>
                </AnimatePresence>
                
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
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

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 mt-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Clock size={18} className="text-amber-400" /> Inadvertent Changes
            </h3>
            <p className="text-xs text-slate-400 mb-4 italic">If flight deviates from current FPL, PIC must notify ATS if:</p>
            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col items-center text-center">
                    <Wind className="text-sky-400 mb-2" size={20} />
                    <h4 className="text-white font-bold text-sm">TAS Change</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">± 5% of TAS</p>
                    <p className="text-[9px] text-slate-500 mt-1">Notify ATS of the new estimated true airspeed.</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col items-center text-center">
                    <Clock className="text-amber-400 mb-2" size={20} />
                    <h4 className="text-white font-bold text-sm">Time Estimate</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">&gt; 2 Minutes</p>
                    <p className="text-[9px] text-slate-500 mt-1">If estimate for next reporting point changes by &gt;2 mins.</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col items-center text-center">
                    <Navigation className="text-emerald-400 mb-2" size={20} />
                    <h4 className="text-white font-bold text-sm">Track Deviation</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Regain Track</p>
                    <p className="text-[9px] text-slate-500 mt-1">Adjust heading to regain track as soon as practicable.</p>
                </div>
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
                    <p className="text-xs text-slate-300 mb-2">PIC must become familiar with all available information: weather, fuel, and alternatives.</p>
                    <div className="bg-slate-900/50 p-2 rounded border border-amber-500/30">
                        <p className="text-[10px] text-amber-200 font-bold uppercase mb-1">For IFR Flights:</p>
                        <p className="text-[9px] text-slate-400 italic">Must include careful study of current weather reports/forecasts, fuel requirements, and alternative plans if flight cannot be completed.</p>
                    </div>
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

        <div className="grid lg:grid-cols-2 gap-6">
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

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Lightbulb size={80} />
                </div>
                <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                    <Zap className="text-yellow-400" size={18} /> Aircraft Navigation Lights
                </h3>
                
                <div className="relative h-48 flex items-center justify-center">
                    <div className="relative w-64">
                        {/* Aircraft Body Outline */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10">
                            <Plane size={140} className="text-white" />
                        </div>

                        {/* Left Wing (Port) */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center">
                            <motion.div 
                                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="w-3 h-3 bg-red-500 rounded-full blur-[3px]"
                            ></motion.div>
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-[-8px] relative z-10"></div>
                            <span className="text-[9px] font-bold text-red-400 mt-1 uppercase tracking-widest">Port</span>
                            <span className="text-[8px] text-slate-500">110° Red</span>
                        </div>

                        {/* Right Wing (Starboard) */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center">
                            <motion.div 
                                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.75 }}
                                className="w-3 h-3 bg-emerald-500 rounded-full blur-[3px]"
                            ></motion.div>
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-[-8px] relative z-10"></div>
                            <span className="text-[9px] font-bold text-emerald-400 mt-1 uppercase tracking-widest">Starboard</span>
                            <span className="text-[8px] text-slate-500">110° Green</span>
                        </div>

                        {/* Tail (Aft) */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center translate-y-12">
                            <motion.div 
                                animate={{ opacity: [0.2, 0.7, 0.2] }}
                                transition={{ repeat: Infinity, duration: 2.5 }}
                                className="w-5 h-5 bg-white rounded-full blur-[5px]"
                            ></motion.div>
                            <div className="w-1.5 h-1.5 bg-white rounded-full mt-[-12px] relative z-10"></div>
                            <span className="text-[9px] font-bold text-white mt-1 uppercase tracking-widest">Tail</span>
                            <span className="text-[8px] text-slate-500">140° White</span>
                        </div>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-2">
                    <div className="p-2 bg-slate-800/50 rounded border border-slate-700 text-center">
                        <h4 className="text-[9px] font-black text-slate-500 uppercase">Sunset-Sunrise</h4>
                        <p className="text-[10px] text-slate-300">Navigation Lights Required</p>
                    </div>
                    <div className="p-2 bg-slate-800/50 rounded border border-slate-700 text-center">
                        <h4 className="text-[9px] font-black text-slate-500 uppercase">Anti-Collision</h4>
                        <p className="text-[10px] text-slate-300">Strobes/Beacons Required</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const CruisingLevels = () => {
    const [track, setTrack] = useState(45);
    const [isVFR, setIsVFR] = useState(false);

    const isEasterly = track >= 0 && track < 180;
    const levels = isVFR 
        ? (isEasterly ? ['FL 35', 'FL 55', 'FL 75'] : ['FL 45', 'FL 65', 'FL 85'])
        : (isEasterly ? ['FL 30', 'FL 50', 'FL 70'] : ['FL 40', 'FL 60', 'FL 80']);

    return (
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
            <div className="space-y-6">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Navigation className="text-sky-400" /> Semi-Circular Rule
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-slate-400 block mb-2">Magnetic Track: {track}°</label>
                            <input 
                                type="range" 
                                min="0" 
                                max="359" 
                                value={track} 
                                onChange={(e) => setTrack(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                            />
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setIsVFR(false)}
                                className={`flex-1 py-2 rounded font-bold text-xs ${!isVFR ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                            >
                                IFR
                            </button>
                            <button 
                                onClick={() => setIsVFR(true)}
                                className={`flex-1 py-2 rounded font-bold text-xs ${isVFR ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                            >
                                VFR
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h4 className="text-sm font-bold text-white mb-3">Available Levels ({isEasterly ? 'Easterly' : 'Westerly'})</h4>
                    <div className="grid grid-cols-1 gap-2">
                        {levels.map((lvl) => (
                            <div key={lvl} className="bg-slate-800 p-3 rounded border border-slate-700 flex justify-between items-center">
                                <span className="text-white font-mono font-bold">{lvl}</span>
                                <span className="text-[10px] text-slate-500">{isEasterly ? '000° - 179° (ODD)' : '180° - 359° (EVEN)'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-8 border border-slate-700 flex items-center justify-center relative min-h-[300px]">
                <div className="w-64 h-64 rounded-full border-4 border-slate-800 relative">
                    {/* Compass Ring */}
                    <div className="absolute inset-0 rounded-full border border-slate-700 border-dashed"></div>
                    
                    {/* Directional Split */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-700 -translate-x-1/2"></div>
                    
                    {/* Labels */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500">000°</div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500">180°</div>
                    
                    {/* Track Indicator */}
                    <motion.div 
                        animate={{ rotate: track }}
                        className="absolute inset-0 flex flex-col items-center pt-4"
                    >
                        <Plane className="text-sky-400 w-8 h-8" />
                        <div className="h-24 w-0.5 bg-sky-500/50"></div>
                    </motion.div>

                    {/* Zone Highlight */}
                    <div className={`absolute inset-0 rounded-full transition-colors duration-500 ${isEasterly ? 'bg-sky-500/5' : 'bg-indigo-500/5'}`}></div>
                </div>

                <div className="absolute bottom-4 right-4 bg-black/50 p-2 rounded text-[10px] text-slate-300">
                    IFR: Whole FLs<br/>
                    VFR: FLs + 500ft
                </div>
            </div>
        </div>
    );
};

const WeatherMinima = () => {
    const [altitude, setAltitude] = useState<'high' | 'low'>('low');

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex bg-slate-900 p-1 rounded-lg w-fit">
                <button 
                    onClick={() => setAltitude('low')}
                    className={`px-4 py-2 rounded-md font-bold text-xs ${altitude === 'low' ? 'bg-sky-600 text-white' : 'text-slate-400'}`}
                >
                    Below 10,000ft (FL100)
                </button>
                <button 
                    onClick={() => setAltitude('high')}
                    className={`px-4 py-2 rounded-md font-bold text-xs ${altitude === 'high' ? 'bg-sky-600 text-white' : 'text-slate-400'}`}
                >
                    Above 10,000ft (FL100)
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 bg-sky-500/10 text-sky-500 rounded-bl-lg">
                        <Sun size={16} />
                    </div>
                    <h3 className="font-bold text-white mb-4">Visibility</h3>
                    <div className="text-3xl font-black text-sky-400 mb-1">
                        {altitude === 'low' ? '5 km' : '8 km'}
                    </div>
                    <p className="text-xs text-slate-500">Minimum horizontal visibility required for VFR.</p>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 bg-indigo-500/10 text-indigo-500 rounded-bl-lg">
                        <Wind size={16} />
                    </div>
                    <h3 className="font-bold text-white mb-4">Distance from Cloud</h3>
                    <div className="space-y-3">
                        <div>
                            <div className="text-xl font-bold text-white">1,500 m</div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">Horizontal</p>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-white">1,000 ft</div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">Vertical</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">VMC Criteria</h4>
                            <p className="text-[10px] text-slate-500">Visual Meteorological Conditions</p>
                        </div>
                    </div>
                    <ul className="text-xs text-slate-300 space-y-2">
                        <li className="flex gap-2">
                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                            <span>Clear of cloud and in sight of surface (below 3000ft/1000ft AGL)</span>
                        </li>
                        <li className="flex gap-2">
                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                            <span>Class G Exception: 1.5km Vis (if &lt;140kt)</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 relative h-48 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-sky-400 to-transparent"></div>
                </div>
                <div className="relative z-10 text-center">
                    <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="flex flex-col items-center"
                    >
                        <Plane className="text-white w-12 h-12 mb-4 drop-shadow-lg" />
                        <div className="flex gap-16 items-center">
                            <div className="w-24 h-16 bg-white/10 backdrop-blur-md rounded border border-white/20 flex flex-col items-center justify-center">
                                <span className="text-[10px] text-slate-400">Horizontal</span>
                                <span className="text-sm font-bold text-white">1.5 km</span>
                            </div>
                            <div className="w-24 h-16 bg-white/10 backdrop-blur-md rounded border border-white/20 flex flex-col items-center justify-center">
                                <span className="text-[10px] text-slate-400">Vertical</span>
                                <span className="text-sm font-bold text-white">1,000 ft</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
                {/* Clouds */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 blur-3xl rounded-full"></div>
                <div className="absolute top-20 -right-20 w-60 h-60 bg-white/5 blur-3xl rounded-full"></div>
            </div>
        </div>
    );
};

const ATCProcedures = () => {
    const [comState, setComState] = useState<'normal' | 'failure' | 'unlawful'>('normal');

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Shield className="text-sky-400" /> ATC Clearances
                    </h3>
                    <div className="space-y-4">
                        <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-sky-500">
                            <h4 className="font-bold text-white text-sm mb-1">Clearance Requirement</h4>
                            <p className="text-xs text-slate-300">Required for all flights in <strong>Controlled Airspace</strong> (IFR and VFR in Class B/C/D) and all <strong>Special VFR</strong> flights.</p>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-amber-500">
                            <h4 className="font-bold text-white text-sm mb-1">Unsatisfactory Clearance</h4>
                            <p className="text-xs text-slate-300">If a PIC finds a clearance unsatisfactory, they <strong>must</strong> request an amended clearance immediately.</p>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-indigo-500">
                            <h4 className="font-bold text-white text-sm mb-1">In-Flight VFR Change</h4>
                            <p className="text-xs text-slate-300">If VMC cannot be maintained on a controlled VFR flight: Request amended clearance to remain VMC, leave controlled airspace, or request IFR clearance.</p>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-red-500">
                            <h4 className="font-bold text-white text-sm mb-1 text-red-400 flex items-center gap-2">
                                <AlertTriangle size={14} /> Ground Operations
                            </h4>
                            <div className="space-y-2 mt-2">
                                <p className="text-[11px] text-slate-300"><strong>Stop Bars:</strong> An aircraft shall <strong>STOP</strong> at a lighted red stop bar and may proceed only when the lights are switched off.</p>
                                <p className="text-[11px] text-slate-300"><strong>Holding Positions:</strong> Aircraft shall not cross a runway-holding position without specific clearance from the tower.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <MapPin className="text-emerald-400" /> Position Reporting
                    </h3>
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-widest">Report Content (Standard)</h4>
                        <div className="space-y-2">
                            {['Aircraft Identification', 'Position', 'Time', 'Flight Level or Altitude', 'Next Position & ETA', 'Ensuing Significant Point'].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-xs text-slate-300">
                                    <div className="w-5 h-5 rounded bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">{i + 1}</div>
                                    {item}
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-700">
                            <p className="text-[10px] text-slate-500 italic">Reports must be made over designated compulsory reporting points (filled triangles) unless exempted.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Radio className="text-red-400" /> Emergency Communications
                    </h3>
                    <div className="flex bg-slate-800 p-1 rounded-lg gap-1">
                        <button onClick={() => setComState('normal')} className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${comState === 'normal' ? 'bg-slate-600 text-white' : 'text-slate-500 hover:text-white'}`}>Normal</button>
                        <button onClick={() => setComState('failure')} className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${comState === 'failure' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-white'}`}>COM Failure</button>
                        <button onClick={() => setComState('unlawful')} className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${comState === 'unlawful' ? 'bg-orange-600 text-white' : 'text-slate-500 hover:text-white'}`}>Unlawful</button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={comState}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="bg-slate-800/50 p-6 rounded-xl border border-slate-700"
                    >
                        {comState === 'normal' && (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Radio size={48} className="text-slate-600 mb-4 opacity-20" />
                                <p className="text-slate-400 text-sm">Select an emergency scenario to view procedures.</p>
                            </div>
                        )}

                        {comState === 'failure' && (
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                                        <AlertTriangle size={18} /> SQUAWK 7600
                                    </div>
                                    <div className="bg-slate-900 p-4 rounded border-l-4 border-emerald-500">
                                        <h4 className="text-white font-bold text-xs mb-1">In VMC (Visual)</h4>
                                        <p className="text-[11px] text-slate-300">Continue flight in VMC, land at the <strong>nearest suitable aerodrome</strong>, and report arrival to ATS ASAP.</p>
                                    </div>
                                    <div className="bg-slate-900 p-4 rounded border-l-4 border-indigo-500">
                                        <h4 className="text-white font-bold text-xs mb-1">In IMC (Instrument)</h4>
                                        <p className="text-[11px] text-slate-300">Maintain last assigned speed and level for <strong>20 minutes</strong> after failure to report over a point, then climb to FPL level.</p>
                                    </div>
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
                                    <h4 className="text-white font-bold text-xs mb-3">Approach & Landing (IMC)</h4>
                                    <ul className="text-[10px] text-slate-400 space-y-3">
                                        <li className="flex gap-2"><ArrowRight size={12} className="text-sky-500 shrink-0" /> Proceed to the navigation aid serving the destination AD.</li>
                                        <li className="flex gap-2"><ArrowRight size={12} className="text-sky-500 shrink-0" /> Commence descent at the <strong>latest</strong> of: Last Assigned EAT or FPL ETA.</li>
                                        <li className="flex gap-2"><ArrowRight size={12} className="text-sky-500 shrink-0" /> Complete normal instrument approach and land within 30 mins of ETA.</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {comState === 'unlawful' && (
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="bg-orange-950/30 p-6 rounded-full border-4 border-orange-500/20 animate-pulse">
                                    <div className="text-4xl font-black text-orange-500">7500</div>
                                    <div className="text-[10px] font-bold text-orange-400 uppercase text-center mt-1 tracking-tighter">Hijack Code</div>
                                </div>
                                <div className="space-y-4 flex-1">
                                    <h4 className="text-white font-bold text-sm">Action by Pilot</h4>
                                    <p className="text-xs text-slate-300 leading-relaxed">Attempt to notify ATS of the fact, any significant circumstances, and any deviation from current flight plan. If unable to notify via radio, use SQUAWK 7500 to alert radar controllers.</p>
                                    <div className="p-3 bg-orange-900/20 border border-orange-900/50 rounded flex gap-3 items-center">
                                        <Info className="text-orange-500 shrink-0" size={16} />
                                        <p className="text-[10px] text-orange-200 font-medium">ATS will acknowledge and provide as much assistance as possible without compromising other traffic safety.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

const OperationsSafety = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <UserX className="text-red-400" /> Psychoactive Substances
                </h3>
                <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-red-500">
                    <p className="text-xs text-slate-300 leading-relaxed">
                        No person whose function is critical to the safety of aviation (PIC, crew, ATC) shall undertake that function while under the influence of any <strong>psychoactive substance</strong>, by reason of which human performance is impaired.
                    </p>
                    <div className="mt-3 p-2 bg-red-900/20 rounded border border-red-900/30 text-[10px] text-red-200 italic">
                        Includes: Alcohol, opioids, cannabinoids, sedatives, hypnotics, cocaine, other psychostimulants, hallucinogens, and volatile solvents.
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="text-sky-400" /> Simulated Instrument Flight
                </h3>
                <div className="space-y-4">
                    <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-sky-500">
                        <h4 className="font-bold text-white text-sm mb-1">Requirements</h4>
                        <ul className="text-xs text-slate-300 space-y-2">
                            <li className="flex gap-2">
                                <CheckCircle2 size={14} className="text-sky-500 shrink-0" />
                                <span>Fully functioning <strong>dual controls</strong> must be installed.</span>
                            </li>
                            <li className="flex gap-2">
                                <CheckCircle2 size={14} className="text-sky-500 shrink-0" />
                                <span>A <strong>Safety Pilot</strong> must occupy a control seat.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-slate-800 p-3 rounded border border-slate-700">
                        <p className="text-[11px] text-slate-400">The safety pilot must have adequate vision forward and to each side of the aircraft, or a competent observer must be in communication with them.</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                <Navigation className="text-emerald-400" /> Aerodrome Vicinity Rules
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-3">
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 h-full">
                        <h4 className="text-xs font-black text-slate-500 uppercase mb-2">Traffic Observation</h4>
                        <p className="text-xs text-slate-300">Observe other aerodrome traffic for the purpose of avoiding collision.</p>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 h-full">
                        <h4 className="text-xs font-black text-slate-500 uppercase mb-2">Traffic Pattern</h4>
                        <p className="text-xs text-slate-300">Conform with or avoid the pattern of traffic formed by other aircraft in operation.</p>
                        <div className="mt-3 flex items-center gap-2 text-amber-400 font-bold text-[10px]">
                            <AlertTriangle size={12} /> ALL TURNS TO THE LEFT
                        </div>
                        <p className="text-[9px] text-slate-500 mt-1">(Unless otherwise instructed by ATC or signal box)</p>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 h-full">
                        <h4 className="text-xs font-black text-slate-500 uppercase mb-2">Landing & Take-off</h4>
                        <p className="text-xs text-slate-300">Land and take off into the wind unless safety or runway configuration determines otherwise.</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6 opacity-10">
                <Plane size={100} className="text-white -rotate-45" />
            </div>
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="text-indigo-400" /> Proximity & Formation
            </h3>
            <div className="grid md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-4">
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                        <h4 className="font-bold text-white text-sm mb-2">Formation Flight</h4>
                        <ul className="text-xs text-slate-300 space-y-2">
                            <li className="flex gap-2 items-start">
                                <ArrowRight size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                                <span>Pre-arranged by the PICs of the participating aircraft.</span>
                            </li>
                            <li className="flex gap-2 items-start">
                                <ArrowRight size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                                <span>For the purpose of ATC, the formation operates as a <strong>single aircraft</strong>.</span>
                            </li>
                            <li className="flex gap-2 items-start">
                                <ArrowRight size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                                <span>Navigation lights shall be displayed by all aircraft in formation.</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col justify-center">
                    <h4 className="font-bold text-white text-sm mb-2">Proximity Warning</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        An aircraft shall not be operated in such proximity to other aircraft as to create a <strong>collision hazard</strong>. 
                        No formation flight unless by prior agreement between the PICs.
                    </p>
                </div>
            </div>
        </div>
    </div>
);

export default RulesOfTheAirDetails;
