import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Wind, Droplets, Info, ShieldCheck, Zap, Plane, ArrowUpRight, ArrowDownRight, RefreshCw, Gauge } from 'lucide-react';

const PitotStaticSystem: React.FC = () => {
    const [altitude, setAltitude] = useState(5000);
    const [airspeed, setAirspeed] = useState(160);
    const [pitotBlocked, setPitotBlocked] = useState(false);
    const [drainBlocked, setDrainBlocked] = useState(true); // If true with pitot blocked => acts as altimeter; if false => leaks to 0
    const [staticBlocked, setStaticBlocked] = useState(false);
    const [alternateStatic, setAlternateStatic] = useState(false);
    
    // Trapped state snapshots
    const [blockageAlt, setBlockageAlt] = useState(5000);
    const [blockageAirspeed, setBlockageAirspeed] = useState(160);
    const [vsiPulse, setVsiPulse] = useState(0);

    // Track flight profile state
    const [verticalRate, setVerticalRate] = useState(0); // ft/min (+1000 climb, -1000 descent, 0 level)

    // Handle pitot blockage toggle
    const handleTogglePitot = () => {
        if (!pitotBlocked) {
            setBlockageAlt(altitude);
            setBlockageAirspeed(airspeed);
            setPitotBlocked(true);
        } else {
            setPitotBlocked(false);
        }
    };

    // Handle static blockage toggle
    const handleToggleStatic = () => {
        if (!staticBlocked) {
            setBlockageAlt(altitude);
            setBlockageAirspeed(airspeed);
            setStaticBlocked(true);
        } else {
            setStaticBlocked(false);
        }
    };

    // Alternate static source activation pulse
    useEffect(() => {
        if (alternateStatic) {
            setVsiPulse(600); // Momentary surge upward on opening
            const timer = setTimeout(() => setVsiPulse(0), 1800);
            return () => clearTimeout(timer);
        } else {
            setVsiPulse(0);
        }
    }, [alternateStatic]);

    // Pressure calculations (ISA standard low-level gradient ~ 27 ft per 1 hPa)
    const altitudeDelta = altitude - blockageAlt;

    // Derived ASI Indication
    const getASIIndication = () => {
        let indicated = airspeed;

        if (pitotBlocked) {
            if (!drainBlocked) {
                // Pitot iced over but drain hole open => total pressure bleeds off to ambient static
                return 0;
            }
            // Pitot and drain completely blocked:
            // Trapped Pt inside capsule. As aircraft climbs, ambient Ps drops => Pt - Ps increases!
            // ASI acts like an altimeter: Overreads in climb, Underreads in descent (PUD)
            // ~1 hPa per 27ft. In ASI knots: roughly 1.5 - 2 knots per 100 ft altitude change.
            const altimeterEffect = (altitudeDelta / 100) * 1.8;
            indicated = blockageAirspeed + altimeterEffect;
        } else if (staticBlocked && !alternateStatic) {
            // Static port blocked, pitot open:
            // Trapped Ps in case. As aircraft climbs, real Ps drops, but case remains high.
            // Pt(ambient Ps + q) - Ps(trapped high) < q => ASI UNDERREADS in climb!
            // In descent: ambient Ps rises above trapped Ps => ASI OVERREADS in descent (SOD).
            const staticError = (altitudeDelta / 100) * 1.4;
            indicated = airspeed - staticError;
        }

        // Alternate static effect: unpressurized cabin has suction (Bernoulli effect), lower Ps => ASI over-reads by ~3-5 kt
        if (alternateStatic) {
            indicated += 5;
        }

        return Math.max(0, indicated);
    };

    // Derived Altimeter Indication
    const getAltIndication = () => {
        if (staticBlocked && !alternateStatic) {
            // Trapped at blockage altitude
            return blockageAlt;
        }
        let alt = altitude;
        // Alternate static source: cabin pressure lower than outside static => altimeter over-reads by ~50-100 ft
        if (alternateStatic) {
            alt += 75;
        }
        return alt;
    };

    // Derived VSI Indication
    const getVSIIndication = () => {
        if (staticBlocked && !alternateStatic) {
            // Static line blocked => no pressure change into metering unit => VSI returns to 0
            return 0;
        }
        let vsi = verticalRate;
        if (vsiPulse !== 0) {
            vsi += vsiPulse;
        }
        return vsi;
    };

    const currentASI = getASIIndication();
    const currentAlt = getAltIndication();
    const currentVSI = getVSIIndication();

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-10">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">
                    <span>AGK 022</span>
                    <span>•</span>
                    <span>Pitot-Static System</span>
                </div>
                <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                    <Wind className="text-blue-400" />
                    Pitot-Static System & Failure Dynamics
                </h1>
                <p className="text-slate-400 max-w-3xl leading-relaxed text-sm">
                    Atmospheric pressure instruments translate total pressure (<span className="text-blue-400 font-mono font-bold">P<sub>t</sub></span>) and static pressure (<span className="text-emerald-400 font-mono font-bold">P<sub>s</sub></span>) into flight guidance.
                    Experiment with probe blockages, pitot-drain leaks, and alternate static sources to observe how the instruments react.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Simulator Controls */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Zap className="text-amber-400 w-4 h-4" />
                            Flight Envelope Controls
                        </h3>

                        <div className="space-y-5">
                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Aircraft Altitude</span>
                                    <span className="text-white font-mono">{altitude.toLocaleString()} FT</span>
                                </label>
                                <input
                                    type="range" min="0" max="12000" step="100"
                                    value={altitude}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (val > altitude) setVerticalRate(1000);
                                        else if (val < altitude) setVerticalRate(-1000);
                                        else setVerticalRate(0);
                                        setAltitude(val);
                                    }}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                                    <span>SL (0 FT)</span>
                                    <span>6,000 FT</span>
                                    <span>12,000 FT</span>
                                </div>
                            </div>

                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>True Airspeed (TAS)</span>
                                    <span className="text-white font-mono">{airspeed} KTS</span>
                                </label>
                                <input
                                    type="range" min="60" max="320" step="5"
                                    value={airspeed}
                                    onChange={(e) => setAirspeed(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                                />
                                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                                    <span>60 KTS</span>
                                    <span>160 KTS</span>
                                    <span>320 KTS</span>
                                </div>
                            </div>

                            {/* Quick Maneuvers */}
                            <div className="pt-2">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Preset Flight Profiles</span>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => {
                                            setAltitude(8500);
                                            setVerticalRate(1200);
                                        }}
                                        className="py-2 px-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-1 border border-slate-700"
                                    >
                                        <ArrowUpRight size={14} className="text-emerald-400" />
                                        <span>Climb 8500'</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setVerticalRate(0);
                                        }}
                                        className="py-2 px-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-1 border border-slate-700"
                                    >
                                        <Plane size={14} className="text-sky-400" />
                                        <span>Level Off</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setAltitude(2000);
                                            setVerticalRate(-1200);
                                        }}
                                        className="py-2 px-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-1 border border-slate-700"
                                    >
                                        <ArrowDownRight size={14} className="text-orange-400" />
                                        <span>Descend 2000'</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Failures Section */}
                        <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                                <span>Icing & Sensor Failures</span>
                                {(pitotBlocked || staticBlocked) && (
                                    <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                                        FAULT ACTIVE
                                    </span>
                                )}
                            </h4>

                            <button
                                onClick={handleTogglePitot}
                                className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                                    pitotBlocked
                                        ? 'bg-red-500/15 border-red-500/60 text-red-400 shadow-lg shadow-red-500/10'
                                        : 'bg-slate-800/40 border-slate-700 text-slate-300 hover:border-slate-500'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Droplets className={`w-5 h-5 ${pitotBlocked ? 'animate-pulse text-red-400' : 'text-slate-400'}`} />
                                    <div className="text-left">
                                        <div className="text-xs font-bold">Pitot Tube Blockage (Icing)</div>
                                        <div className="text-[10px] text-slate-400">
                                            {pitotBlocked ? `Trapped at ${blockageAlt} FT, ${blockageAirspeed} KT` : 'Normal Ram Air Flow'}
                                        </div>
                                    </div>
                                </div>
                                {pitotBlocked && <AlertCircle size={16} className="text-red-400 shrink-0" />}
                            </button>

                            {pitotBlocked && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="pl-4 border-l-2 border-red-500/40 space-y-2 py-1"
                                >
                                    <label className="flex items-center justify-between text-[11px] text-slate-300">
                                        <span>Pitot Drain Hole Status:</span>
                                        <button
                                            onClick={() => setDrainBlocked(!drainBlocked)}
                                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                drainBlocked ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                            }`}
                                        >
                                            {drainBlocked ? 'DRAIN BLOCKED (Trapped)' : 'DRAIN OPEN (Bleed)'}
                                        </button>
                                    </label>
                                    <p className="text-[9px] text-slate-500">
                                        {drainBlocked
                                            ? 'ASI behaves like an altimeter (overreads in climb).'
                                            : 'Dynamic air leaks out through drain into static line; ASI decays to 0 KTS.'}
                                    </p>
                                </motion.div>
                            )}

                            <button
                                onClick={handleToggleStatic}
                                className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                                    staticBlocked
                                        ? 'bg-red-500/15 border-red-500/60 text-red-400 shadow-lg shadow-red-500/10'
                                        : 'bg-slate-800/40 border-slate-700 text-slate-300 hover:border-slate-500'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Droplets className={`w-5 h-5 ${staticBlocked ? 'animate-pulse text-red-400' : 'text-slate-400'}`} />
                                    <div className="text-left">
                                        <div className="text-xs font-bold">Static Port Blockage</div>
                                        <div className="text-[10px] text-slate-400">
                                            {staticBlocked ? `Frozen at ${blockageAlt} FT datum` : 'Normal Ambient Static'}
                                        </div>
                                    </div>
                                </div>
                                {staticBlocked && <AlertCircle size={16} className="text-red-400 shrink-0" />}
                            </button>

                            {/* Alternate Static Source */}
                            <button
                                onClick={() => setAlternateStatic(!alternateStatic)}
                                className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                                    alternateStatic
                                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                                        : 'bg-slate-800/30 border-slate-700/60 text-slate-400 hover:text-slate-300'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <RefreshCw className={`w-4 h-4 ${alternateStatic ? 'rotate-180 text-amber-400' : ''}`} />
                                    <span className="text-xs">Alternate Static Valve</span>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${alternateStatic ? 'bg-amber-500/30 text-amber-200' : 'bg-slate-800 text-slate-500'}`}>
                                    {alternateStatic ? 'OPEN (Cabin)' : 'CLOSED (Normal)'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Memory Aid Card */}
                    <div className="bg-gradient-to-br from-blue-900/30 to-indigo-950/40 border border-blue-500/20 p-5 rounded-2xl">
                        <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2 text-xs uppercase tracking-wider">
                            <Info size={15} />
                            ATPL Golden Mnemonics
                        </h4>
                        <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
                            <div className="p-2.5 bg-slate-900/60 rounded-xl border border-white/5">
                                <span className="font-bold text-amber-400 font-mono">P.U.D.</span>: <strong className="text-white">P</strong>itot Blocked &rarr; <strong className="text-emerald-400">U</strong>nderreads in <strong className="text-orange-400">D</strong>escent.
                                <p className="text-[10px] text-slate-400 mt-1">Conversely, in a <strong>Climb</strong>, the trapped air expands against dropping ambient static, making the ASI <strong>overread like an altimeter</strong>!</p>
                            </div>
                            <div className="p-2.5 bg-slate-900/60 rounded-xl border border-white/5">
                                <span className="font-bold text-sky-400 font-mono">S.O.D.</span>: <strong className="text-white">S</strong>tatic Blocked &rarr; <strong className="text-amber-400">O</strong>verreads in <strong className="text-orange-400">D</strong>escent.
                                <p className="text-[10px] text-slate-400 mt-1">In a <strong>Climb</strong> with blocked static, ambient dynamic air enters against trapped high ground static &rarr; ASI <strong>underreads</strong>.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Diagram and Instruments */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Pneumatic Plumbing Visualizer */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden min-h-[380px] flex flex-col justify-between">
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                            <div className="flex items-center gap-2">
                                <Gauge className="w-5 h-5 text-blue-400" />
                                <span className="text-xs font-black text-white uppercase tracking-widest">Pneumatic Line Architecture</span>
                            </div>
                            <div className="flex gap-4 text-[10px] font-mono">
                                <span className="flex items-center gap-1.5 text-blue-400">
                                    <span className="w-2 h-2 rounded-full bg-blue-400"></span> Total Pressure (P<sub>t</sub>)
                                </span>
                                <span className="flex items-center gap-1.5 text-emerald-400">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Static Pressure (P<sub>s</sub>)
                                </span>
                            </div>
                        </div>

                        {/* Schematic Tubes */}
                        <div className="relative py-6 flex flex-col items-center justify-center">
                            {/* Pitot Probe */}
                            <div className="w-full flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className={`px-3 py-1.5 rounded-l-full border flex items-center gap-2 transition-all ${
                                        pitotBlocked ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-blue-500/20 border-blue-400 text-blue-300'
                                    }`}>
                                        <Wind size={15} className={pitotBlocked ? 'text-red-400' : 'text-blue-400 animate-pulse'} />
                                        <span className="text-[11px] font-black uppercase">Pitot Head</span>
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                        {pitotBlocked ? (drainBlocked ? 'Trapped Pt' : 'Leaking to 0') : 'Ram Air (Pt)'}
                                    </div>
                                </div>

                                {/* Pitot Line to ASI Capsule */}
                                <div className={`flex-1 h-1.5 mx-4 rounded-full transition-colors ${pitotBlocked ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-blue-500'}`} />
                                <div className="text-[10px] font-mono font-bold text-blue-300 bg-slate-800/80 px-2.5 py-1 rounded-md border border-white/5">
                                    P<sub>t</sub> &rarr; ASI Capsule
                                </div>
                            </div>

                            {/* Static Port */}
                            <div className="w-full flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                                        staticBlocked ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                                    }`}>
                                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-[11px] font-black text-white uppercase">Static Port</div>
                                        <div className="text-[10px] text-slate-500">
                                            {staticBlocked ? `Trapped @ ${blockageAlt} FT` : 'Ambient Air (Ps)'}
                                        </div>
                                    </div>
                                </div>

                                {/* Static Line Split to ASI, ALT, VSI */}
                                <div className={`flex-1 h-1.5 mx-4 rounded-full transition-colors ${staticBlocked && !alternateStatic ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-emerald-500'}`} />
                                <div className="text-[10px] font-mono font-bold text-emerald-300 bg-slate-800/80 px-2.5 py-1 rounded-md border border-white/5">
                                    P<sub>s</sub> &rarr; ASI Case, ALT, VSI
                                </div>
                            </div>

                            {/* Distribution Branch to 3 Instruments */}
                            <div className="w-full grid grid-cols-3 gap-6 mt-10 pt-4 border-t border-slate-800">
                                <div className="flex flex-col items-center bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
                                    <div className="text-xs font-black text-white mb-1">ASI</div>
                                    <div className="text-[10px] text-slate-400 font-mono">P<sub>t</sub> (Capsule) − P<sub>s</sub> (Case)</div>
                                    <div className="mt-2 text-[9px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                                        Measures Dynamic (q)
                                    </div>
                                </div>

                                <div className="flex flex-col items-center bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
                                    <div className="text-xs font-black text-white mb-1">Altimeter</div>
                                    <div className="text-[10px] text-slate-400 font-mono">P<sub>s</sub> Only (Aneroid)</div>
                                    <div className="mt-2 text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                        Measures Static Height
                                    </div>
                                </div>

                                <div className="flex flex-col items-center bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
                                    <div className="text-xs font-black text-white mb-1">VSI</div>
                                    <div className="text-[10px] text-slate-400 font-mono">&Delta;P<sub>s</sub> / &Delta;t (Capillary Leak)</div>
                                    <div className="mt-2 text-[9px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                        Measures Rate of P<sub>s</sub>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Alternate Static Annunciation */}
                        {alternateStatic && (
                            <div className="mt-2 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center">
                                <p className="text-[11px] text-amber-300 font-semibold">
                                    Alternate Static Source ACTIVE: Cabin air utilized. Aerodynamic suction around fuselage makes cabin pressure slightly lower than outside ambient static.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Gauges Cockpit Panel */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {/* Airspeed Indicator (ASI) */}
                        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col items-center justify-between relative shadow-xl">
                            <div className="w-full flex justify-between items-center mb-3">
                                <span className="text-[11px] font-bold text-slate-400 uppercase">ASI (Airspeed)</span>
                                {pitotBlocked && <span className="text-[9px] font-bold text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded">UNRELIABLE</span>}
                            </div>
                            <div className="w-28 h-28 rounded-full border-4 border-slate-800 bg-slate-950 flex items-center justify-center relative shadow-inner">
                                <motion.div
                                    animate={{ rotate: (currentASI / 350) * 360 }}
                                    transition={{ type: 'spring', damping: 20 }}
                                    className="w-1 h-12 bg-white origin-bottom rounded-full absolute bottom-1/2 shadow-[0_0_6px_rgba(255,255,255,0.7)]"
                                />
                                <div className="text-xl font-black text-white z-10 font-mono">
                                    {Math.round(currentASI)}
                                </div>
                            </div>
                            <div className="mt-3 text-center">
                                <div className="text-[10px] text-slate-400 font-mono">KNOTS (IAS)</div>
                                <div className="text-[9px] text-slate-500 mt-0.5">True Speed: {airspeed} KT</div>
                            </div>
                        </div>

                        {/* Altimeter */}
                        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col items-center justify-between relative shadow-xl">
                            <div className="w-full flex justify-between items-center mb-3">
                                <span className="text-[11px] font-bold text-slate-400 uppercase">Altimeter</span>
                                {staticBlocked && !alternateStatic && (
                                    <span className="text-[9px] font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded">FROZEN</span>
                                )}
                            </div>
                            <div className="w-28 h-28 rounded-full border-4 border-slate-800 bg-slate-950 flex items-center justify-center relative shadow-inner">
                                <motion.div
                                    animate={{ rotate: (currentAlt / 1000) * 360 }}
                                    transition={{ type: 'spring', damping: 20 }}
                                    className="w-1 h-12 bg-emerald-400 origin-bottom rounded-full absolute bottom-1/2 shadow-[0_0_6px_rgba(52,211,153,0.7)]"
                                />
                                <div className="text-lg font-black text-white z-10 font-mono">
                                    {Math.round(currentAlt)}
                                </div>
                            </div>
                            <div className="mt-3 text-center">
                                <div className="text-[10px] text-slate-400 font-mono">FEET (MSL)</div>
                                <div className="text-[9px] text-slate-500 mt-0.5">Actual Alt: {altitude} FT</div>
                            </div>
                        </div>

                        {/* VSI */}
                        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col items-center justify-between relative shadow-xl">
                            <div className="w-full flex justify-between items-center mb-3">
                                <span className="text-[11px] font-bold text-slate-400 uppercase">VSI (Rate of Climb)</span>
                                {staticBlocked && !alternateStatic && (
                                    <span className="text-[9px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">ZERO</span>
                                )}
                            </div>
                            <div className="w-28 h-28 rounded-full border-4 border-slate-800 bg-slate-950 flex items-center justify-center relative shadow-inner">
                                <motion.div
                                    animate={{ rotate: (currentVSI / 2000) * 170 }}
                                    transition={{ type: 'spring', damping: 20 }}
                                    className="w-1 h-12 bg-sky-400 origin-bottom rounded-full absolute bottom-1/2 shadow-[0_0_6px_rgba(56,189,248,0.7)]"
                                />
                                <div className="text-lg font-black text-white z-10 font-mono">
                                    {currentVSI >= 0 ? `+${currentVSI}` : currentVSI}
                                </div>
                            </div>
                            <div className="mt-3 text-center">
                                <div className="text-[10px] text-slate-400 font-mono">FT / MIN</div>
                                <div className="text-[9px] text-slate-500 mt-0.5">Actual ROC: {verticalRate} FPM</div>
                            </div>
                        </div>
                    </div>

                    {/* Active Blockage Diagnosis Summary */}
                    <AnimatePresence>
                        {(pitotBlocked || staticBlocked || alternateStatic) && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border-l-4 border-red-500 p-5 rounded-r-2xl border border-white/5 space-y-2"
                            >
                                <div className="flex items-center gap-2 text-white font-bold text-sm">
                                    <AlertCircle className="text-red-400 w-5 h-5 shrink-0" />
                                    <span>Active System Diagnostic:</span>
                                </div>
                                <div className="text-xs text-slate-300 leading-relaxed space-y-1 pl-7">
                                    {pitotBlocked && (
                                        <p>
                                            <strong className="text-red-300">Pitot Blocked:</strong> ASI is acting as an altimeter!
                                            {altitude > blockageAlt
                                                ? ` Aircraft has climbed +${altitude - blockageAlt} FT above blockage: Indicated airspeed is OVERREADING by ~${Math.round(currentASI - airspeed)} KTS.`
                                                : altitude < blockageAlt
                                                ? ` Aircraft has descended ${blockageAlt - altitude} FT below blockage: Indicated airspeed is UNDERREADING by ~${Math.round(airspeed - currentASI)} KTS (PUD risk: pilot pitch up causes stall).`
                                                : ' Aircraft is at the exact blockage altitude; ASI indication currently matches actual speed.'}
                                        </p>
                                    )}
                                    {staticBlocked && !alternateStatic && (
                                        <p>
                                            <strong className="text-amber-300">Static Blocked:</strong> Altimeter is completely frozen at {blockageAlt} FT. VSI has leaked to ZERO FPM regardless of actual vertical speed. ASI underreads in climb and overreads in descent (SOD).
                                        </p>
                                    )}
                                    {alternateStatic && (
                                        <p>
                                            <strong className="text-sky-300">Alternate Static Engaged:</strong> Due to cabin aerodynamic suction, Static Pressure is lower than ambient. Altimeter over-reads (+75 FT), ASI over-reads (+5 KTS), and VSI settled after momentary climb pulse.
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Systematic Theory Table */}
            <div className="mt-12 pt-10 border-t border-slate-800">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <ShieldCheck className="text-emerald-400" />
                    Pitot-Static Failure Matrix (EASA 022 Syllabus)
                </h3>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50">
                        <thead className="bg-slate-800/80 text-slate-300 uppercase font-mono text-[10px]">
                            <tr>
                                <th className="p-3.5">Failure Mode</th>
                                <th className="p-3.5">Airspeed Indicator (ASI)</th>
                                <th className="p-3.5">Altimeter</th>
                                <th className="p-3.5">Vertical Speed (VSI)</th>
                                <th className="p-3.5">Pilot Threat / Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                            <tr className="hover:bg-slate-800/30">
                                <td className="p-3.5 font-bold text-white">Pitot Tube & Drain Blocked (Icing)</td>
                                <td className="p-3.5 text-amber-300 font-semibold">Acts as altimeter: Overreads in climb, Underreads in descent</td>
                                <td className="p-3.5 text-emerald-400">Normal</td>
                                <td className="p-3.5 text-emerald-400">Normal</td>
                                <td className="p-3.5 text-slate-400">Descent underread may induce pilot to dive or exceed V<sub>NE</sub>. Turn on Pitot Heat immediately.</td>
                            </tr>
                            <tr className="hover:bg-slate-800/30">
                                <td className="p-3.5 font-bold text-white">Pitot Head Blocked, Drain Open</td>
                                <td className="p-3.5 text-red-400 font-semibold">Decays to ZERO Knots (Pt bleeds off to ambient Ps)</td>
                                <td className="p-3.5 text-emerald-400">Normal</td>
                                <td className="p-3.5 text-emerald-400">Normal</td>
                                <td className="p-3.5 text-slate-400">False stall warning/reaction. Fly pitch and power settings.</td>
                            </tr>
                            <tr className="hover:bg-slate-800/30">
                                <td className="p-3.5 font-bold text-white">Static Port Blocked, Pitot Open</td>
                                <td className="p-3.5 text-amber-300 font-semibold">Underreads in climb, Overreads in descent (SOD)</td>
                                <td className="p-3.5 text-red-400 font-semibold">FROZEN at blockage altitude</td>
                                <td className="p-3.5 text-red-400 font-semibold">Returns to and FROZEN at 0 FPM</td>
                                <td className="p-3.5 text-slate-400">Descent overread causes stall risk. Switch to Alternate Static Source (or break VSI glass in light unpressurized aircraft).</td>
                            </tr>
                            <tr className="hover:bg-slate-800/30">
                                <td className="p-3.5 font-bold text-white">Alternate Static Source Selected</td>
                                <td className="p-3.5 text-sky-300">Slightly Overreads (+3 to 5 kt)</td>
                                <td className="p-3.5 text-sky-300">Slightly Overreads (+50 to 100 ft)</td>
                                <td className="p-3.5 text-sky-300">Momentary climb spike, then normal</td>
                                <td className="p-3.5 text-slate-400">Caused by aerodynamic Bernoulli suction in unpressurized cabin reducing local pressure.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PitotStaticSystem;