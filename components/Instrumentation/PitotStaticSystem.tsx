import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Wind, Droplets, Info, ShieldCheck, Zap, Plane } from 'lucide-react';

const PitotStaticSystem: React.FC = () => {
    const [pitotBlocked, setPitotBlocked] = useState(false);
    const [staticBlocked, setStaticBlocked] = useState(false);
    const [altitude, setAltitude] = useState(5000);
    const [airspeed, setAirspeed] = useState(150);
    const [isClimbing, setIsClimbing] = useState(false);
    const [isDescending, setIsDescending] = useState(false);

    // Derived logic based on PDF notes
    // Pitot Blockage (PUD - Pitot Underread Descent)
    // In a climb with blocked pitot, dynamic pressure increases (air inside expands), so it OVERREADS.
    // In a descent with blocked pitot, dynamic pressure decreases (air escapes or compresses against sealed volume), so it UNDERREADS (PUD).

    // Static Blockage (SOD - Static Overread Descent)
    // If static is blocked, instruments keep reading the pressure at the moment of blockage.
    // Altimeter and VSI freeze.
    // ASI will UNDERREAD in a climb and OVERREAD in a descent (SOD).

    const getASIIndication = () => {
        if (pitotBlocked) {
            if (isClimbing) return airspeed + (altitude - 5000) / 10; // Overreads in climb
            if (isDescending) return airspeed - (5000 - altitude) / 10; // Underreads in descent (PUD)
            return airspeed;
        }
        if (staticBlocked) {
            if (isClimbing) return airspeed - (altitude - 5000) / 15; // Underreads in climb
            if (isDescending) return airspeed + (5000 - altitude) / 15; // Overreads in descent (SOD)
            return airspeed;
        }
        return airspeed;
    };

    const getAltIndication = () => {
        if (staticBlocked) return 5000; // Frozen at blockage altitude
        return altitude;
    };

    const getVSIIndication = () => {
        if (staticBlocked) return 0; // Frozen at zero
        if (isClimbing) return 1000;
        if (isDescending) return -1000;
        return 0;
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-12">
                <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                    <Wind className="text-blue-400" />
                    Pitot-Static System
                </h1>
                <p className="text-slate-400 max-w-2xl">
                    The nervous system of flight instruments. Explore how total and static pressures drive your cockpit indications and what happens when sensors fail.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Simulator Controls */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Zap className="text-amber-400 w-4 h-4" />
                            Flight Configuration
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Altitude</span>
                                    <span className="text-white">{altitude} FT</span>
                                </label>
                                <input
                                    type="range" min="0" max="10000" step="100"
                                    value={altitude}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (val > altitude) { setIsClimbing(true); setIsDescending(false); }
                                        else if (val < altitude) { setIsClimbing(false); setIsDescending(true); }
                                        else { setIsClimbing(false); setIsDescending(false); }
                                        setAltitude(val);
                                    }}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>

                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Airspeed (TAS)</span>
                                    <span className="text-white">{airspeed} KTS</span>
                                </label>
                                <input
                                    type="range" min="40" max="400"
                                    value={airspeed}
                                    onChange={(e) => setAirspeed(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                                />
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
                            <h4 className="text-xs font-bold text-slate-500 uppercase">Failures</h4>

                            <button
                                onClick={() => setPitotBlocked(!pitotBlocked)}
                                className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${pitotBlocked ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Droplets className={pitotBlocked ? 'animate-pulse' : ''} />
                                    <span className="font-bold">Pitot Blocked (Ice)</span>
                                </div>
                                {pitotBlocked && <AlertCircle size={18} />}
                            </button>

                            <button
                                onClick={() => setStaticBlocked(!staticBlocked)}
                                className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${staticBlocked ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Droplets className={staticBlocked ? 'animate-pulse' : ''} />
                                    <span className="font-bold">Static Port Blocked</span>
                                </div>
                                {staticBlocked && <AlertCircle size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl">
                        <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                            <Info size={16} />
                            Memory Aid
                        </h4>
                        <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                            <p><strong>PUD:</strong> Pitot Blocked → <strong>Underread</strong> in <strong>Descent</strong>.</p>
                            <p><strong>SOD:</strong> Static Blocked → <strong>Overread</strong> in <strong>Descent</strong>.</p>
                            <p className="text-slate-400 italic mt-2">"Think of a blocked pitot as an altimeter - as you climb, the trapped air expands, so it overreads speed."</p>
                        </div>
                    </div>
                </div>

                {/* Diagram and Instruments */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Visual Diagram */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden min-h-[400px] flex items-center justify-center">
                        {/* Aircraft Silhouette Placeholder */}
                        <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                            <Plane size={300} strokeWidth={0.5} />
                        </div>

                        {/* Tubes and Nodes */}
                        <div className="relative z-10 w-full max-w-md">
                            <div className="flex flex-col items-center gap-12">

                                {/* Pitot Probe */}
                                <div className="flex items-center gap-4 w-full">
                                    <div className={`w-32 h-6 rounded-l-full border-t border-b border-l flex items-center justify-end px-2 transition-colors ${pitotBlocked ? 'bg-red-500/20 border-red-500' : 'bg-blue-500/20 border-blue-400'}`}>
                                        <Wind size={16} className={pitotBlocked ? 'text-red-400' : 'text-blue-400 animate-pulse'} />
                                    </div>
                                    <div className={`flex-1 h-1 transition-colors ${pitotBlocked ? 'bg-red-500' : 'bg-blue-400'}`}></div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase">Total Pressure (Pt)</div>
                                </div>

                                {/* Static Port */}
                                <div className="flex items-center gap-4 w-full">
                                    <div className={`w-8 h-8 rounded-full border transition-colors flex items-center justify-center ${staticBlocked ? 'bg-red-500/20 border-red-500' : 'bg-emerald-500/20 border-emerald-400'}`}>
                                        <div className="w-1 h-1 bg-white rounded-full"></div>
                                    </div>
                                    <div className="text-xs font-black text-slate-400">STATIC PORT</div>
                                    <div className={`flex-1 h-1 transition-colors ${staticBlocked ? 'bg-red-500' : 'bg-emerald-400'}`}></div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase">Static Pressure (Ps)</div>
                                </div>

                                {/* Gauge Connectors */}
                                <div className="grid grid-cols-3 gap-8 w-full mt-8">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="h-20 w-px bg-slate-700 relative">
                                            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${pitotBlocked ? 'bg-red-500' : 'bg-blue-400'}`}></div>
                                            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${staticBlocked ? 'bg-red-500' : 'bg-emerald-400'}`}></div>
                                        </div>
                                        <div className="text-[10px] font-black text-white bg-slate-800 px-2 py-1 rounded">ASI</div>
                                        <div className="text-[8px] text-slate-500">PT - PS</div>
                                    </div>

                                    <div className="flex flex-col items-center gap-2">
                                        <div className="h-20 w-px bg-slate-700 relative">
                                            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${staticBlocked ? 'bg-red-500' : 'bg-emerald-400'}`}></div>
                                        </div>
                                        <div className="text-[10px] font-black text-white bg-slate-800 px-2 py-1 rounded">ALT</div>
                                        <div className="text-[8px] text-slate-500">PS ONLY</div>
                                    </div>

                                    <div className="flex flex-col items-center gap-2">
                                        <div className="h-20 w-px bg-slate-700 relative">
                                            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${staticBlocked ? 'bg-red-500' : 'bg-emerald-400'}`}></div>
                                        </div>
                                        <div className="text-[10px] font-black text-white bg-slate-800 px-2 py-1 rounded">VSI</div>
                                        <div className="text-[8px] text-slate-500">ΔPS/ΔT</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gauges Row */}
                    <div className="grid grid-cols-3 gap-6">
                        {/* ASI */}
                        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col items-center">
                            <h4 className="text-[10px] font-bold text-slate-500 mb-4 uppercase">ASI</h4>
                            <div className="w-24 h-24 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
                                <motion.div
                                    animate={{ rotate: (getASIIndication() / 400) * 360 }}
                                    className="w-1 h-10 bg-white origin-bottom rounded-full absolute bottom-1/2"
                                />
                                <div className="text-xl font-black text-white z-10">{Math.round(getASIIndication())}</div>
                            </div>
                            <div className="mt-2 text-[10px] text-slate-400 font-medium">KNOTS</div>
                        </div>

                        {/* Altimeter */}
                        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col items-center text-center">
                            <h4 className="text-[10px] font-bold text-slate-500 mb-4 uppercase">ALT</h4>
                            <div className="w-24 h-24 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
                                <div className="text-lg font-black text-white">{Math.round(getAltIndication())}</div>
                            </div>
                            <div className="mt-2 text-[10px] text-slate-400 font-medium">FEET</div>
                        </div>

                        {/* VSI */}
                        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col items-center">
                            <h4 className="text-[10px] font-bold text-slate-500 mb-4 uppercase">VSI</h4>
                            <div className="w-24 h-24 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
                                <motion.div
                                    animate={{ rotate: (getVSIIndication() / 2000) * 180 }}
                                    className="w-1 h-10 bg-emerald-400 origin-bottom rounded-full absolute bottom-1/2"
                                />
                                <div className="text-lg font-black text-white">{getVSIIndication() / 100}</div>
                            </div>
                            <div className="mt-2 text-[10px] text-slate-400 font-medium">100 FT/MIN</div>
                        </div>
                    </div>

                    {/* Status Alerts */}
                    <AnimatePresence>
                        {(pitotBlocked || staticBlocked) && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-orange-500/10 border-l-4 border-orange-500 p-6 rounded-r-2xl"
                            >
                                <div className="flex gap-4">
                                    <AlertCircle className="text-orange-500 shrink-0" />
                                    <div>
                                        <h4 className="text-white font-bold mb-1">System Warning</h4>
                                        <p className="text-sm text-slate-300 leading-relaxed">
                                            {pitotBlocked && staticBlocked
                                                ? "COMPLETE PITOT-STATIC FAILURE. All pressure-dependent flight instruments are unreliable. Transition to standby GNSS/Attitude if available."
                                                : pitotBlocked
                                                    ? "PITOT BLOCKED: ASI acting like an altimeter. It will overread in a climb and underread in a descent (PUD). Static instruments (ALT/VSI) remain normal."
                                                    : "STATIC BLOCKED: ALT and VSI frozen. ASI will overread in a descent (SOD) and underread in a climb. Enable alternate static source."
                                            }
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Error Theory Section (NEW) */}
            <div className="mt-12 grid md:grid-cols-2 gap-8 pt-12 border-t border-slate-800">
                <div>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <ShieldCheck className="text-emerald-400" />
                        System Errors & Theory
                    </h3>
                    <div className="space-y-4">
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                            <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Position Error</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Streamlines around the aircraft are affected by its presence (Bernoulli's Theorem). There is <strong>no single point</strong> on a fuselage where local pressure equals free-stream pressure for all angles of attack.
                            </p>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                            <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Maneuver Error</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Short-duration errors induced during maneuvers as airflow around the aircraft (ailerons, configuration changes) is temporarily altered.
                            </p>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                            <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Static Unbalanced</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Occurs during sideslips. Modern aircraft use ports on <strong>both sides</strong> of the fuselage to balance the extra pressure on the windward side with the leeward side.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Zap className="text-sky-400" />
                        Alternate Static Source
                    </h3>
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Plane size={80} />
                        </div>
                        <p className="text-sm text-slate-300 mb-4">
                            Usable if the outside static port gets blocked (usually in the cabin on light aircraft).
                        </p>
                        <div className="bg-sky-500/10 border-l-4 border-sky-500 p-4 rounded">
                            <h5 className="font-bold text-white text-xs mb-1 uppercase">Aerodynamic Suction Effect</h5>
                            <p className="text-xs text-slate-300">
                                Inside the aircraft, static pressure is <strong>slightly less</strong> than outside due to air acceleration around the fuselage.
                            </p>
                            <ul className="mt-3 space-y-2 text-[11px] font-bold text-sky-400">
                                <li>• Altimeter: OVERREADS</li>
                                <li>• ASI: OVERREADS</li>
                                <li>• VSI: Momentary CLIMB indication</li>
                            </ul>
                        </div>
                        <p className="mt-4 text-[10px] text-slate-500 italic">
                            "If no alternate source is fitted, breaking the VSI glass can restore static pressure to the other instruments."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PitotStaticSystem;
