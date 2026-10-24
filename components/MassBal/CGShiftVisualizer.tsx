import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Plus, Minus, Move, BookOpen, AlertTriangle, CheckCircle, Calculator, Plane } from 'lucide-react';

interface ScenarioPreset {
    id: string;
    title: string;
    description: string;
    aircraftMass: number;
    oldCg: number;
    opMass: number;
    dist: number;
    unit: 'm' | 'in';
    mode: 'move' | 'find_mass' | 'add_remove';
    targetCg?: number;
    isAdded?: boolean;
    examNote?: string;
}

const PRESETS: ScenarioPreset[] = [
    {
        id: 'easa-ch10',
        title: 'EASA Ch 10 Worked Example (60t Airliner)',
        description: 'CG is at 15.5m (0.5m out of fwd limit 16.0m). Moving baggage from Fwd Hold (10m) to Aft Hold (35m).',
        aircraftMass: 60000,
        oldCg: 15.5,
        opMass: 1200,
        dist: 25.0, // 35m - 10m
        unit: 'm',
        mode: 'find_mass',
        targetCg: 16.0,
        examNote: 'Mass to Shift = Total Mass × (ΔCG / Distance) = 60,000 × (0.5 / 25.0) = 1,200 kg.'
    },
    {
        id: 'pax-reseat',
        title: 'Passenger Reseating (Zone A to Zone E)',
        description: '10 standard adult passengers (84 kg each = 840 kg) reseated from Row 1 (12m) to Row 30 (32m).',
        aircraftMass: 45000,
        oldCg: 17.2,
        opMass: 840,
        dist: 20.0,
        unit: 'm',
        mode: 'move',
        examNote: 'Standard Part-CAT adult passenger mass = 84 kg. Distance = 32m - 12m = 20m.'
    },
    {
        id: 'ballast-add',
        title: 'Ballast Addition (Aft Hold Loading)',
        description: 'Adding 500 kg of water/lead ballast in aft compartment (station 750 in) to cure fwd CG.',
        aircraftMass: 52000,
        oldCg: 480,
        opMass: 500,
        dist: 750,
        unit: 'in',
        mode: 'add_remove',
        isAdded: true,
        examNote: 'New CG = (Old Mass × Old CG + Added Mass × Added Arm) / (Old Mass + Added Mass).'
    }
];

const CGShiftVisualizer: React.FC = () => {
    // Mode: 'move' (find deltaCG), 'find_mass' (find mass to move), 'add_remove' (add or subtract mass)
    const [mode, setMode] = useState<'move' | 'find_mass' | 'add_remove'>('move');
    const [unit, setUnit] = useState<'m' | 'in'>('m');

    // Aircraft State
    const [mass, setMass] = useState<number>(60000); // Total Mass (kg)
    const [oldCg, setOldCg] = useState<number>(15.5); // Initial CG (m or in)
    const [targetCg, setTargetCg] = useState<number>(16.0); // Target CG for find_mass mode

    // Operation State
    const [opMass, setOpMass] = useState<number>(1200); // Mass to move/add/remove (kg)
    const [dist, setDist] = useState<number>(25.0); // Distance moved OR Arm of added mass
    const [isAdded, setIsAdded] = useState<boolean>(true); // for add/remove mode

    // Apply Preset
    const applyPreset = (preset: ScenarioPreset) => {
        setUnit(preset.unit);
        setMode(preset.mode);
        setMass(preset.aircraftMass);
        setOldCg(preset.oldCg);
        setOpMass(preset.opMass);
        setDist(preset.dist);
        if (preset.targetCg !== undefined) {
            setTargetCg(preset.targetCg);
        }
        if (preset.isAdded !== undefined) {
            setIsAdded(preset.isAdded);
        }
    };

    // Calculations
    let deltaCg = 0;
    let newCg = 0;
    let newMass = mass;
    let computedMassToMove = 0;

    if (mode === 'move') {
        // Delta CG = (Mass Moved * Dist Moved) / Total Mass
        deltaCg = mass > 0 ? (opMass * dist) / mass : 0;
        newCg = oldCg + deltaCg;
        newMass = mass;
    } else if (mode === 'find_mass') {
        // Mass to Move = Total Mass * (Target CG - Old CG) / Distance
        const reqShift = targetCg - oldCg;
        computedMassToMove = dist !== 0 ? Math.abs((mass * reqShift) / dist) : 0;
        deltaCg = reqShift;
        newCg = targetCg;
        newMass = mass;
    } else {
        // Add / Remove Mode
        const action = isAdded ? 1 : -1;
        newMass = mass + (opMass * action);
        if (newMass > 0) {
            const oldMoment = mass * oldCg;
            const addedMoment = (opMass * action) * dist; // dist is the Arm
            const newMoment = oldMoment + addedMoment;
            newCg = newMoment / newMass;
            deltaCg = newCg - oldCg;
        } else {
            newCg = oldCg;
            deltaCg = 0;
        }
    }

    // Graphical Bounds
    const rangeMin = unit === 'm' ? 0 : 0;
    const rangeMax = unit === 'm' ? 40 : 800;

    return (
        <div className="bg-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl border border-slate-700 font-sans space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700 pb-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                        <Move className="w-3.5 h-3.5" /> Subject 031 • Mass Shifting & Correction
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        Mass Shifting & CG Displacement Simulator
                    </h2>
                    <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
                        Calculate exact Center of Gravity movements when shifting cargo/passengers or calculate the precise mass displacement required to bring an out-of-limits aircraft back into certified flight envelopes.
                    </p>
                </div>

                {/* Unit Switcher */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Units:</span>
                    <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
                        <button
                            onClick={() => { setUnit('m'); setOldCg(15.5); setDist(25.0); setTargetCg(16.0); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${unit === 'm' ? 'bg-cyan-500 text-slate-900 shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            Meters (m)
                        </button>
                        <button
                            onClick={() => { setUnit('in'); setOldCg(400); setDist(200); setTargetCg(420); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${unit === 'in' ? 'bg-cyan-500 text-slate-900 shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            Inches (in)
                        </button>
                    </div>
                </div>
            </div>

            {/* Presets Bar */}
            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    EASA Worked Exam Scenarios:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {PRESETS.map(p => (
                        <button
                            key={p.id}
                            onClick={() => applyPreset(p)}
                            className="p-3 bg-slate-950/80 hover:bg-cyan-950/30 hover:border-cyan-500/50 border border-slate-800 rounded-xl text-left transition-all group"
                        >
                            <span className="text-xs font-bold text-white group-hover:text-cyan-300 block mb-1">
                                {p.title}
                            </span>
                            <span className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                                {p.description}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Mode Selector */}
            <div className="flex flex-wrap bg-slate-900/60 p-1.5 rounded-xl border border-slate-700 gap-1">
                <button
                    onClick={() => setMode('move')}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        mode === 'move' ? 'bg-cyan-500 text-slate-900 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
                    }`}
                >
                    <ArrowLeftRight className="w-4 h-4" />
                    1. Shift Mass → Find ΔCG
                </button>
                <button
                    onClick={() => setMode('find_mass')}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        mode === 'find_mass' ? 'bg-cyan-500 text-slate-900 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
                    }`}
                >
                    <Calculator className="w-4 h-4" />
                    2. Target Envelope → Find Mass to Move
                </button>
                <button
                    onClick={() => setMode('add_remove')}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        mode === 'add_remove' ? 'bg-cyan-500 text-slate-900 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
                    }`}
                >
                    <Plus className="w-3.5 h-3.5" />/<Minus className="w-3.5 h-3.5" />
                    3. Add or Remove Mass
                </button>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid lg:grid-cols-12 gap-8">
                {/* Inputs Column (5 cols) */}
                <div className="lg:col-span-5 bg-slate-900/50 p-6 rounded-2xl border border-slate-700 space-y-6">
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
                        Parameters
                    </h3>

                    {/* Aircraft Mass */}
                    <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
                            <span>TOTAL AIRCRAFT MASS (M)</span>
                            <span className="text-white font-bold">{mass.toLocaleString()} kg</span>
                        </div>
                        <input
                            type="range"
                            min="2000"
                            max="250000"
                            step="1000"
                            value={mass}
                            onChange={e => setMass(Number(e.target.value))}
                            className="w-full accent-cyan-500 h-2 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                            <span>2,000 kg</span>
                            <span>60,000 kg (A320/B737)</span>
                            <span>250,000 kg</span>
                        </div>
                    </div>

                    {/* Initial CG */}
                    <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
                            <span>INITIAL CG STATION</span>
                            <span className="text-white font-bold">{oldCg.toFixed(2)} {unit}</span>
                        </div>
                        <input
                            type="range"
                            min={unit === 'm' ? 5 : 100}
                            max={unit === 'm' ? 35 : 700}
                            step={unit === 'm' ? 0.1 : 1}
                            value={oldCg}
                            onChange={e => setOldCg(Number(e.target.value))}
                            className="w-full accent-slate-400 h-2 cursor-pointer"
                        />
                    </div>

                    {/* Conditional Input depending on mode */}
                    {mode === 'move' && (
                        <>
                            <div>
                                <div className="flex justify-between text-xs text-cyan-400 mb-2 font-mono font-bold">
                                    <span>MASS MOVED (m)</span>
                                    <span className="text-white">{opMass} kg</span>
                                </div>
                                <input
                                    type="range"
                                    min="50"
                                    max="15000"
                                    step="50"
                                    value={opMass}
                                    onChange={e => setOpMass(Number(e.target.value))}
                                    className="w-full accent-cyan-500 h-2 cursor-pointer"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between text-xs text-cyan-400 mb-2 font-mono font-bold">
                                    <span>DISTANCE MOVED (d)</span>
                                    <span className={`font-bold ${dist >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                        {dist >= 0 ? `+${dist} ${unit} (Aft)` : `${dist} ${unit} (Forward)`}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min={unit === 'm' ? -30 : -400}
                                    max={unit === 'm' ? 30 : 400}
                                    step={unit === 'm' ? 0.5 : 5}
                                    value={dist}
                                    onChange={e => setDist(Number(e.target.value))}
                                    className="w-full accent-cyan-500 h-2 cursor-pointer"
                                />
                            </div>
                        </>
                    )}

                    {mode === 'find_mass' && (
                        <>
                            <div>
                                <div className="flex justify-between text-xs text-cyan-400 mb-2 font-mono font-bold">
                                    <span>TARGET CG POSITION (Limit)</span>
                                    <span className="text-white">{targetCg.toFixed(2)} {unit}</span>
                                </div>
                                <input
                                    type="range"
                                    min={unit === 'm' ? 5 : 100}
                                    max={unit === 'm' ? 35 : 700}
                                    step={unit === 'm' ? 0.1 : 1}
                                    value={targetCg}
                                    onChange={e => setTargetCg(Number(e.target.value))}
                                    className="w-full accent-cyan-500 h-2 cursor-pointer"
                                />
                                <span className="text-[10px] text-slate-400 block mt-1">
                                    Required Shift ΔCG: {targetCg >= oldCg ? `+${(targetCg - oldCg).toFixed(2)}` : (targetCg - oldCg).toFixed(2)} {unit}
                                </span>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs text-cyan-400 mb-2 font-mono font-bold">
                                    <span>DISTANCE BETWEEN HOLDS (D)</span>
                                    <span className="text-white">{dist} {unit}</span>
                                </div>
                                <input
                                    type="range"
                                    min={unit === 'm' ? 5 : 50}
                                    max={unit === 'm' ? 35 : 500}
                                    step={unit === 'm' ? 0.5 : 5}
                                    value={dist}
                                    onChange={e => setDist(Number(e.target.value))}
                                    className="w-full accent-cyan-500 h-2 cursor-pointer"
                                />
                                <span className="text-[10px] text-slate-500 block mt-1">
                                    Distance between origin compartment and destination compartment.
                                </span>
                            </div>
                        </>
                    )}

                    {mode === 'add_remove' && (
                        <>
                            <div>
                                <div className="flex justify-between text-xs text-cyan-400 mb-2 font-mono font-bold">
                                    <span>MASS TO ADD / REMOVE</span>
                                    <span className="text-white">{opMass} kg</span>
                                </div>
                                <input
                                    type="range"
                                    min="50"
                                    max="15000"
                                    step="50"
                                    value={opMass}
                                    onChange={e => setOpMass(Number(e.target.value))}
                                    className="w-full accent-cyan-500 h-2 cursor-pointer"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between text-xs text-cyan-400 mb-2 font-mono font-bold">
                                    <span>ARM STATION OF MASS</span>
                                    <span className="text-white">{dist} {unit}</span>
                                </div>
                                <input
                                    type="range"
                                    min={unit === 'm' ? 2 : 50}
                                    max={unit === 'm' ? 38 : 750}
                                    step={unit === 'm' ? 0.5 : 5}
                                    value={dist}
                                    onChange={e => setDist(Number(e.target.value))}
                                    className="w-full accent-cyan-500 h-2 cursor-pointer"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setIsAdded(true)}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                                        isAdded ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'border-slate-700 text-slate-500'
                                    }`}
                                >
                                    + ADD MASS
                                </button>
                                <button
                                    onClick={() => setIsAdded(false)}
                                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                                        !isAdded ? 'bg-red-500/20 border-red-500 text-red-300' : 'border-slate-700 text-slate-500'
                                    }`}
                                >
                                    - REMOVE MASS
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Visualizer & Mathematical Proof (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Visual Airframe & Displacement Line */}
                    <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-700 shadow-inner relative overflow-hidden">
                        <div className="flex justify-between text-xs text-slate-400 font-mono mb-4">
                            <span>FUSELAGE LONGITUDINAL AXIS</span>
                            <span>SCALE: 0 to {rangeMax} {unit}</span>
                        </div>

                        <div className="relative h-48 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden select-none">
                            {/* Datum Line */}
                            <div className="absolute top-0 bottom-0 left-4 w-0.5 border-l border-dashed border-red-500 z-10 flex flex-col justify-between py-2 pl-1.5">
                                <span className="text-[9px] text-red-400 font-mono font-bold">DATUM</span>
                            </div>

                            {/* Aircraft Silhouette Representation */}
                            <div className="absolute top-1/2 left-8 right-8 h-8 bg-slate-800/80 rounded-full -translate-y-1/2 border border-slate-700 flex items-center justify-between px-6 z-0">
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Nose</span>
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tail</span>
                            </div>

                            {/* Old CG Marker */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-500 rounded-full border-2 border-slate-300 z-10 transition-all duration-300"
                                style={{ left: `${(oldCg / rangeMax) * 100}%` }}
                            >
                                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-600 text-slate-300 text-[10px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap">
                                    Initial: {oldCg.toFixed(2)} {unit}
                                </div>
                            </div>

                            {/* New CG Marker */}
                            <motion.div
                                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-cyan-400 rounded-full border-2 border-slate-950 shadow-lg shadow-cyan-400/50 z-20 flex items-center justify-center"
                                animate={{ left: `${(newCg / rangeMax) * 100}%` }}
                                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                            >
                                <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                                <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-cyan-950 border border-cyan-500 text-cyan-300 text-[11px] font-mono font-black px-2 py-0.5 rounded shadow whitespace-nowrap">
                                    New CG: {newCg.toFixed(2)} {unit}
                                </div>
                            </motion.div>

                            {/* Shift Vector Arrow */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 h-1 bg-cyan-500/40 z-10"
                                style={{
                                    left: `${(Math.min(oldCg, newCg) / rangeMax) * 100}%`,
                                    width: `${(Math.abs(deltaCg) / rangeMax) * 100}%`
                                }}
                            ></div>
                        </div>

                        {/* Shift Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                                <span className="text-[10px] text-slate-500 uppercase block font-mono">Displacement (ΔCG)</span>
                                <span className="text-xl font-mono font-black text-cyan-400">
                                    {deltaCg >= 0 ? `+${deltaCg.toFixed(3)}` : deltaCg.toFixed(3)} {unit}
                                </span>
                            </div>

                            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                                <span className="text-[10px] text-slate-500 uppercase block font-mono">
                                    {mode === 'find_mass' ? 'REQUIRED MASS SHIFT' : 'MASS DISPLACED'}
                                </span>
                                <span className="text-xl font-mono font-black text-white">
                                    {mode === 'find_mass' ? Math.round(computedMassToMove).toLocaleString() : opMass.toLocaleString()} kg
                                </span>
                            </div>

                            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                                <span className="text-[10px] text-slate-500 uppercase block font-mono">FINAL AIRCRAFT MASS</span>
                                <span className="text-xl font-mono font-black text-white">
                                    {newMass.toLocaleString()} kg
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Step-by-Step Formula Proof */}
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <span className="text-cyan-400 font-bold uppercase tracking-wider">
                                Aviation Mathematical Proof (Mass & Balance Formula)
                            </span>
                            <span className="text-[11px] text-slate-500 font-sans">EASA ATPL 031 Standard</span>
                        </div>

                        {mode === 'move' && (
                            <div className="space-y-2 text-slate-300">
                                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-cyan-300 text-sm font-bold">
                                    ΔCG = (Mass Moved × Distance Moved) / Total Aircraft Mass
                                </div>
                                <div>1. Shift Moment = {opMass} kg × {dist} {unit} = {(opMass * dist).toLocaleString()} kg•{unit}</div>
                                <div>2. Divide by Mass = {(opMass * dist).toLocaleString()} / {mass.toLocaleString()} kg = <strong>{deltaCg.toFixed(4)} {unit}</strong></div>
                                <div>3. New CG = {oldCg} {unit} + {deltaCg.toFixed(4)} {unit} = <strong className="text-white text-sm">{newCg.toFixed(2)} {unit}</strong></div>
                            </div>
                        )}

                        {mode === 'find_mass' && (
                            <div className="space-y-2 text-slate-300">
                                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-cyan-300 text-sm font-bold">
                                    Mass to Shift = Total Mass × (Required ΔCG / Distance Between Holds)
                                </div>
                                <div>1. Required Shift ΔCG = {targetCg} - {oldCg} = <strong>{(targetCg - oldCg).toFixed(2)} {unit}</strong></div>
                                <div>2. Distance Ratio = {(targetCg - oldCg).toFixed(2)} / {dist} = {((targetCg - oldCg) / dist).toFixed(5)}</div>
                                <div>3. Mass to Move = {mass.toLocaleString()} kg × {((targetCg - oldCg) / dist).toFixed(5)} = <strong className="text-emerald-400 text-base">{Math.round(computedMassToMove).toLocaleString()} kg</strong></div>
                                <p className="text-[11px] text-slate-400 font-sans mt-2 pt-2 border-t border-slate-800">
                                    Operational action: Transfer {Math.round(computedMassToMove).toLocaleString()} kg of cargo from forward compartment to aft compartment across the {dist} {unit} distance.
                                </p>
                            </div>
                        )}

                        {mode === 'add_remove' && (
                            <div className="space-y-2 text-slate-300">
                                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-cyan-300 text-sm font-bold">
                                    New CG = (Old Total Moment ± Added Moment) / New Total Mass
                                </div>
                                <div>1. Old Moment = {mass.toLocaleString()} kg × {oldCg} {unit} = {(mass * oldCg).toLocaleString()} kg•{unit}</div>
                                <div>2. Operation Moment = {isAdded ? '+' : '-'} ({opMass} kg × {dist} {unit}) = {isAdded ? '+' : '-'}{(opMass * dist).toLocaleString()} kg•{unit}</div>
                                <div>3. New Total Mass = {mass.toLocaleString()} {isAdded ? '+' : '-'} {opMass} = <strong>{newMass.toLocaleString()} kg</strong></div>
                                <div>4. New CG = {((mass * oldCg) + ((isAdded ? 1 : -1) * opMass * dist)).toLocaleString()} / {newMass.toLocaleString()} = <strong className="text-white text-sm">{newCg.toFixed(2)} {unit}</strong></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CGShiftVisualizer;
