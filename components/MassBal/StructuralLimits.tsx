import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Plane, Shield, ArrowDown, ArrowUp, Info, Scale, Fuel, Activity, Layers } from 'lucide-react';

interface LimitDefinition {
    code: string;
    name: string;
    description: string;
    color: string;
    icon: React.ReactNode;
    note?: string;
}

const StructuralLimits: React.FC = () => {
    const [selectedLimit, setSelectedLimit] = useState<string | null>('MZFM');

    // Certified aircraft structural limits (kg)
    const mstm = 79400;  // Max Structural Taxi Mass
    const mstom = 79000; // Max Structural Take-Off Mass
    const mslm = 66360;  // Max Structural Landing Mass
    const mzfm = 62730;  // Max Zero Fuel Mass (B737-800 certified limit)

    // Performance limits for today's runway/climb condition
    const pltom = 77500; // Performance Limited Take-Off Mass
    const pllm = 65000;  // Performance Limited Landing Mass

    // Regulated limits (Lower of structural and performance)
    const rtom = Math.min(mstom, pltom);
    const rlm = Math.min(mslm, pllm);

    // Dynamic State Sliders
    const [zfmMass, setZfmMass] = useState<number>(60000); // Current ZFM (DOM + Traffic Load)
    const [fuelMass, setFuelMass] = useState<number>(14000); // Fuel in wing tanks
    const [tripFuel, setTripFuel] = useState<number>(8500); // Planned Trip Fuel burn

    // Computed masses
    const tom = zfmMass + fuelMass;
    const estLandingMass = tom - tripFuel;

    // Wing Bending Relief Physics State
    // Lift produces upward bending moment at wing root: M_lift ≈ Lift * span_arm
    // Wing fuel mass produces downward relief moment: M_fuel ≈ Fuel * tank_arm
    // Net Wing Root Bending Moment = M_lift - M_fuel
    const wingFuelReliefFactor = Math.min(1.0, fuelMass / 18000); // 0 (empty) to 1 (full tanks)
    const upwardLiftForce = tom * 0.00981; // kN
    // Wing root bending moment in kNm (approximate beam physics)
    const rawLiftMoment = upwardLiftForce * 7.5; // Upward moment kNm
    const fuelReliefMoment = (fuelMass * 0.00981) * 6.2; // Downward countering moment kNm
    const netWingRootBendingMoment = Math.round(rawLiftMoment - fuelReliefMoment);
    const maxCertifiedWingRootMoment = 3800; // kNm certified design limit (+2.5g maneuver ceiling)

    // Violations check
    const isZfmExceeded = zfmMass > mzfm;
    const isTomExceeded = tom > rtom;
    const isLmExceeded = estLandingMass > rlm;
    const isWingOverstressed = netWingRootBendingMoment > maxCertifiedWingRootMoment;

    const limits: LimitDefinition[] = [
        {
            code: 'MZFM',
            name: 'Maximum Zero Fuel Mass',
            description: 'Maximum permissible mass of the aircraft with no usable fuel in wing tanks. Protects the wing root from excessive upward aerodynamic bending moments during flight.',
            color: 'red',
            icon: <Scale size={20} />,
            note: 'Calculated for certified +2.5G limit maneuver load factor with empty wing tanks.'
        },
        {
            code: 'MSTOM',
            name: 'Maximum Structural Take-Off Mass',
            description: 'Maximum brake-release mass certified for takeoff based on fuselage, landing gear, and wing primary structure strength.',
            color: 'yellow',
            icon: <Plane size={20} />,
            note: 'Never exceed MTOM even if runway length allows.'
        },
        {
            code: 'MSLM',
            name: 'Maximum Structural Landing Mass',
            description: 'Maximum mass certified for normal touchdown at 10 ft/sec sink rate. Touchdown above MSLM requires overweight landing inspection.',
            color: 'orange',
            icon: <ArrowDown size={20} />,
            note: 'May be exceeded only in a commander-declared in-flight emergency.'
        },
        {
            code: 'MSTM',
            name: 'Maximum Structural Taxi Mass',
            description: 'Maximum permissible mass for ground maneuvering (Ramp Mass). Allows for fuel burn during APU run and ground taxi.',
            color: 'purple',
            icon: <Plane size={20} />,
            note: 'Taxi Fuel allowance accounts for the delta between MSTM and MSTOM.'
        },
        {
            code: 'RTOM',
            name: 'Regulated Take-Off Mass',
            description: 'The strict operational ceiling: Lower of Structural MTOM and Performance Limited Take-Off Mass (runway length, obstacle climb, tire speed).',
            color: 'cyan',
            icon: <Shield size={20} />,
            note: 'Always the governing limit for dispatch.'
        },
        {
            code: 'RLM',
            name: 'Regulated Landing Mass',
            description: 'The operational touchdown ceiling: Lower of Structural MSLM and Performance Limited Landing Mass (runway dry/wet braking distance, approach climb).',
            color: 'emerald',
            icon: <Shield size={20} />,
            note: 'Must be verified before departure using forecast arrival conditions.'
        },
    ];

    const selectedLimitData = limits.find(l => l.code === selectedLimit);

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-red-500/10 border border-red-500/20 rounded-full mb-4">
                    <Shield className="w-8 h-8 text-red-400" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
                    Aircraft Structural <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">Mass Limits & Wing Relief</span>
                </h1>
                <p className="text-slate-400 mt-2 max-w-2xl mx-auto text-sm leading-relaxed">
                    Master the structural weight hierarchy (EASA 031) and explore the physics of Maximum Zero Fuel Mass (MZFM) wing-bending relief.
                </p>
            </div>

            {/* Interactive Wing Bending Relief Physics Laboratory */}
            <div className="bg-slate-900/90 rounded-3xl p-6 md:p-8 border border-red-500/30 relative overflow-hidden shadow-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs font-bold uppercase tracking-wider mb-1">
                            <Activity className="w-3.5 h-3.5" /> EASA Ch 10 Physics Focus
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight">
                            Maximum Zero Fuel Mass (MZFM) & Wing Bending Relief
                        </h2>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-950 p-2 rounded-xl border border-slate-800">
                        <div className="text-right">
                            <span className="text-[10px] text-slate-500 uppercase block font-mono">Wing Root Bending Moment</span>
                            <span className={`text-xl font-mono font-black ${isWingOverstressed ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                                {netWingRootBendingMoment.toLocaleString()} kNm
                            </span>
                        </div>
                        <div className="h-8 w-px bg-slate-800"></div>
                        <div className="text-left text-xs font-mono text-slate-400">
                            <span>Max Limit:</span>
                            <span className="block text-white font-bold">{maxCertifiedWingRootMoment} kNm</span>
                        </div>
                    </div>
                </div>

                {/* Visual Wing Beam Flexure Simulation */}
                <div className="relative h-60 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden p-6 select-none flex flex-col justify-between">
                    <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                        <span>FUSELAGE WING ROOT (STATION 0)</span>
                        <span>WING TIP (SPAN ARM)</span>
                    </div>

                    {/* Beam Schematic */}
                    <div className="relative w-full h-24 my-auto flex items-center">
                        {/* Fuselage Root Wall */}
                        <div className="w-8 h-24 bg-slate-800 border-r-4 border-red-500 rounded-l flex flex-col items-center justify-center text-center z-20 shadow-xl">
                            <span className="text-[9px] font-mono font-bold text-red-400 -rotate-90">WING ROOT</span>
                        </div>

                        {/* Flexible Wing Beam with Dynamic Upward Curve */}
                        <div className="relative flex-1 h-8 bg-slate-800 border border-slate-700 flex items-center justify-between px-4 z-10">
                            {/* Fuel Tanks Inside Wing */}
                            <div
                                className="absolute top-0 bottom-0 left-4 bg-yellow-500/30 border border-yellow-400/50 rounded flex items-center justify-center transition-all duration-300"
                                style={{ width: `${Math.min(90, (fuelMass / 20000) * 100)}%` }}
                            >
                                <span className="text-[10px] text-yellow-300 font-mono font-bold">
                                    Fuel in Wing: {(fuelMass / 1000).toFixed(1)}t
                                </span>
                            </div>

                            {/* Downward Fuel Relief Force Vectors */}
                            {fuelMass > 2000 && (
                                <div className="absolute top-full left-12 right-12 flex justify-around mt-1">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="flex flex-col items-center text-yellow-400">
                                            <ArrowDown className="w-4 h-4 animate-bounce" />
                                            <span className="text-[9px] font-mono">Fuel Weight</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Upward Aerodynamic Lift Force Vectors */}
                            <div className="absolute bottom-full left-8 right-8 flex justify-around mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex flex-col items-center text-emerald-400">
                                        <span className="text-[9px] font-mono">Lift</span>
                                        <ArrowUp className="w-4 h-4" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Wing Tip */}
                        <div className="w-4 h-12 bg-slate-700 rounded-r border-l border-slate-600 z-10"></div>
                    </div>

                    {/* Explanatory Caption */}
                    <div className="flex flex-wrap items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                            <ArrowUp className="w-3.5 h-3.5" /> Aerodynamic Lift pushes wings upward
                        </span>
                        <span className="flex items-center gap-1.5 text-yellow-400">
                            <ArrowDown className="w-3.5 h-3.5" /> Fuel inside wings counters lift (Inertia Relief)
                        </span>
                        <span className="flex items-center gap-1.5 text-red-400">
                            <Scale className="w-3.5 h-3.5" /> Empty tanks concentrate upward bend at root
                        </span>
                    </div>
                </div>

                {/* Critical Operational Pitfall & Mental Model Warning */}
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
                        <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                            <Info className="w-4 h-4 text-amber-400" />
                            Cockpit Mental Model: "Wing Bending Relief"
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Lift pushes the wings upward; heavy fuel inside the wing tanks pushes downward against lift. Burning fuel out of the wings removes this relief, concentrating bending force directly at the wing root. Therefore, the most critical structural condition occurs at touchdown with zero fuel in the wings.
                        </p>
                    </div>

                    <div className="p-4 bg-red-950/30 border border-red-500/40 rounded-2xl">
                        <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            Critical Flight Pitfall: Exceeding MZFM by Adding More Fuel
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Fuel CANNOT compensate for excess cargo! If ZFM exceeds MZFM, the aircraft is structurally non-compliant even if total mass remains below MTOM. The wing root is already overstressed before fuel is loaded. Cargo or passengers must be offloaded.
                        </p>
                    </div>
                </div>
            </div>

            {/* Mass Envelope & Live Sliders */}
            <div className="bg-slate-800/50 rounded-3xl p-6 md:p-8 border border-slate-700 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Layers className="w-5 h-5 text-cyan-400" />
                            Live Flight Weight Hierarchy Checker (EASA Part-CAT)
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                            Adjust Zero Fuel Mass (traffic load) and Fuel to verify all certified structural limits in parallel.
                        </p>
                    </div>

                    {/* Operational Compliance Status */}
                    <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-bold text-sm ${
                        isZfmExceeded || isTomExceeded || isLmExceeded
                            ? 'bg-red-950/50 border-red-500 text-red-400 animate-pulse'
                            : 'bg-emerald-950/50 border-emerald-500 text-emerald-400'
                    }`}>
                        {isZfmExceeded || isTomExceeded || isLmExceeded ? (
                            <>
                                <AlertTriangle className="w-5 h-5 shrink-0" />
                                <span>STRUCTURAL LIMIT EXCEEDED! NO-GO</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5 shrink-0" />
                                <span>ALL WEIGHT LIMITS COMPLIANT</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Sliders Grid */}
                <div className="grid md:grid-cols-3 gap-6 pt-2">
                    {/* ZFM Slider */}
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                        <div className="flex justify-between items-center text-xs font-mono mb-2">
                            <span className="text-red-400 font-bold uppercase">1. Zero Fuel Mass (ZFM)</span>
                            <span className={`font-bold ${isZfmExceeded ? 'text-red-400' : 'text-white'}`}>
                                {(zfmMass / 1000).toFixed(1)}t
                            </span>
                        </div>
                        <input
                            type="range"
                            min="45000"
                            max="68000"
                            step="200"
                            value={zfmMass}
                            onChange={e => setZfmMass(Number(e.target.value))}
                            className="w-full accent-red-500 h-2 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                            <span>45t</span>
                            <span className="text-red-400">MZFM: {(mzfm / 1000).toFixed(1)}t</span>
                            <span>68t</span>
                        </div>
                    </div>

                    {/* Fuel Slider */}
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                        <div className="flex justify-between items-center text-xs font-mono mb-2">
                            <span className="text-yellow-400 font-bold uppercase">2. Take-Off Fuel</span>
                            <span className="text-white font-bold">{(fuelMass / 1000).toFixed(1)}t</span>
                        </div>
                        <input
                            type="range"
                            min="3000"
                            max="21000"
                            step="200"
                            value={fuelMass}
                            onChange={e => setFuelMass(Number(e.target.value))}
                            className="w-full accent-yellow-500 h-2 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                            <span>3t</span>
                            <span>Wing Capacity: 21t</span>
                        </div>
                    </div>

                    {/* Trip Fuel Slider */}
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                        <div className="flex justify-between items-center text-xs font-mono mb-2">
                            <span className="text-cyan-400 font-bold uppercase">3. Planned Trip Fuel</span>
                            <span className="text-white font-bold">{(tripFuel / 1000).toFixed(1)}t</span>
                        </div>
                        <input
                            type="range"
                            min="2000"
                            max="16000"
                            step="200"
                            value={tripFuel}
                            onChange={e => setTripFuel(Number(e.target.value))}
                            className="w-full accent-cyan-500 h-2 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                            <span>2t</span>
                            <span>Burn Rate En-Route</span>
                            <span>16t</span>
                        </div>
                    </div>
                </div>

                {/* Mass Bar Comparisons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
                    {/* ZFM vs MZFM */}
                    <div className={`p-4 rounded-xl border ${isZfmExceeded ? 'bg-red-950/40 border-red-500' : 'bg-slate-900/60 border-slate-800'}`}>
                        <span className="text-[10px] text-slate-400 uppercase block">Zero Fuel Mass Check</span>
                        <div className="text-xl font-black text-white mt-1">
                            {(zfmMass / 1000).toFixed(2)}t <span className="text-xs text-slate-500">/ {(mzfm / 1000).toFixed(2)}t</span>
                        </div>
                        <div className={`text-xs mt-1 font-bold ${isZfmExceeded ? 'text-red-400' : 'text-emerald-400'}`}>
                            {isZfmExceeded ? `⚠️ EXCEEDED BY +${((zfmMass - mzfm) / 1000).toFixed(2)}t` : `✓ Margin: ${((mzfm - zfmMass) / 1000).toFixed(2)}t`}
                        </div>
                    </div>

                    {/* TOM vs RTOM */}
                    <div className={`p-4 rounded-xl border ${isTomExceeded ? 'bg-red-950/40 border-red-500' : 'bg-slate-900/60 border-slate-800'}`}>
                        <span className="text-[10px] text-slate-400 uppercase block">Take-Off Mass (TOM) Check</span>
                        <div className="text-xl font-black text-white mt-1">
                            {(tom / 1000).toFixed(2)}t <span className="text-xs text-slate-500">/ {(rtom / 1000).toFixed(2)}t</span>
                        </div>
                        <div className={`text-xs mt-1 font-bold ${isTomExceeded ? 'text-red-400' : 'text-emerald-400'}`}>
                            {isTomExceeded ? `⚠️ EXCEEDED BY +${((tom - rtom) / 1000).toFixed(2)}t` : `✓ Margin: ${((rtom - tom) / 1000).toFixed(2)}t`}
                        </div>
                    </div>

                    {/* Landing Mass vs RLM */}
                    <div className={`p-4 rounded-xl border ${isLmExceeded ? 'bg-red-950/40 border-red-500' : 'bg-slate-900/60 border-slate-800'}`}>
                        <span className="text-[10px] text-slate-400 uppercase block">Landing Mass (LM) Check</span>
                        <div className="text-xl font-black text-white mt-1">
                            {(estLandingMass / 1000).toFixed(2)}t <span className="text-xs text-slate-500">/ {(rlm / 1000).toFixed(2)}t</span>
                        </div>
                        <div className={`text-xs mt-1 font-bold ${isLmExceeded ? 'text-red-400' : 'text-emerald-400'}`}>
                            {isLmExceeded ? `⚠️ EXCEEDED BY +${((estLandingMass - rlm) / 1000).toFixed(2)}t` : `✓ Margin: ${((rlm - estLandingMass) / 1000).toFixed(2)}t`}
                        </div>
                    </div>
                </div>
            </div>

            {/* Limit Definition Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {limits.map(limit => (
                    <button
                        key={limit.code}
                        onClick={() => setSelectedLimit(limit.code)}
                        className={`p-4 rounded-xl border text-left transition-all hover:scale-105 ${
                            selectedLimit === limit.code
                                ? 'bg-slate-800 border-cyan-500 shadow-lg shadow-cyan-500/10'
                                : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                        }`}
                    >
                        <div className="text-cyan-400 mb-2">{limit.icon}</div>
                        <h4 className="font-bold text-white text-sm">{limit.code}</h4>
                        <p className="text-xs text-slate-400 mt-1">{limit.name}</p>
                    </button>
                ))}
            </div>

            {/* Selected Limit Detail */}
            {selectedLimitData && (
                <div className="bg-slate-900/80 border border-cyan-500/50 rounded-2xl p-6 shadow-xl space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="text-cyan-400">{selectedLimitData.icon}</span>
                        <div>
                            <h3 className="text-xl font-bold text-white">{selectedLimitData.code}</h3>
                            <p className="text-sm text-cyan-400">{selectedLimitData.name}</p>
                        </div>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{selectedLimitData.description}</p>
                    {selectedLimitData.note && (
                        <div className="p-3 bg-slate-950 rounded-lg text-xs text-amber-400 flex items-center gap-2 border border-slate-800">
                            <Info size={16} className="shrink-0" />
                            {selectedLimitData.note}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StructuralLimits;
