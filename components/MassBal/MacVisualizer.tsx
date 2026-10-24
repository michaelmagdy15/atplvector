import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Percent, Plane, ArrowRightLeft, Info, AlertTriangle, CheckCircle, Calculator, Layers } from 'lucide-react';

interface AircraftPreset {
    id: string;
    name: string;
    lemac: number; // inches or meters
    mac: number;
    unit: 'in' | 'm';
    fwdLimit: number; // % MAC
    aftLimit: number; // % MAC
    datumDesc: string;
    description: string;
}

const PRESETS: AircraftPreset[] = [
    {
        id: 'b738',
        name: 'Boeing 737-800',
        lemac: 626.5,
        mac: 155.8,
        unit: 'in',
        fwdLimit: 7.0,
        aftLimit: 31.0,
        datumDesc: '540 inches forward of nose radome',
        description: 'Standard EASA narrow-body transport jet.'
    },
    {
        id: 'a320',
        name: 'Airbus A320-200',
        lemac: 14.35,
        mac: 4.19,
        unit: 'm',
        fwdLimit: 18.0,
        aftLimit: 38.0,
        datumDesc: 'Frame 0 (nose tip reference)',
        description: 'Fly-by-wire transport category airliner.'
    },
    {
        id: 'atr72',
        name: 'ATR 72-600',
        lemac: 10.20,
        mac: 2.57,
        unit: 'm',
        fwdLimit: 15.0,
        aftLimit: 32.0,
        datumDesc: 'Forward bulkhead reference',
        description: 'Twin-turboprop regional commuter.'
    },
    {
        id: 'c172',
        name: 'Cessna 172S Skyhawk',
        lemac: 35.0,
        mac: 58.0,
        unit: 'in',
        fwdLimit: 6.0,
        aftLimit: 25.0,
        datumDesc: 'Lower portion of front face of firewall',
        description: 'Single-engine training utility aircraft.'
    }
];

interface LoadStation {
    id: string;
    name: string;
    mass: number; // kg
    arm: number;  // in or m
}

const MacVisualizer: React.FC = () => {
    // Selected Preset
    const [selectedPresetId, setSelectedPresetId] = useState<string>('b738');
    const preset = PRESETS.find(p => p.id === selectedPresetId) || PRESETS[0];

    // Core Geometry
    const [lemac, setLemac] = useState<number>(preset.lemac);
    const [mac, setMac] = useState<number>(preset.mac);
    const [fwdLimit, setFwdLimit] = useState<number>(preset.fwdLimit);
    const [aftLimit, setAftLimit] = useState<number>(preset.aftLimit);

    // Modes: 'direct' = slide CG station / %MAC, 'moments' = multi-station load builder
    const [calcMode, setCalcMode] = useState<'direct' | 'moments'>('direct');
    const [direction, setDirection] = useState<'stationToMac' | 'macToStation'>('stationToMac');

    // State for Direct Mode
    const defaultCg = Number((preset.lemac + (preset.mac * 0.20)).toFixed(2));
    const [cgStation, setCgStation] = useState<number>(defaultCg);
    const [inputPercentMac, setInputPercentMac] = useState<number>(20.0);

    // State for Moments Mode: Multi-Station Load Sheet
    const [stations, setStations] = useState<LoadStation[]>([
        { id: '1', name: 'Basic Empty Mass (BEM)', mass: 41500, arm: 650.0 },
        { id: '2', name: 'Forward Passenger Cabin', mass: 5800, arm: 540.0 },
        { id: '3', name: 'Aft Passenger Cabin', mass: 6400, arm: 760.0 },
        { id: '4', name: 'Forward Cargo Hold', mass: 2200, arm: 480.0 },
        { id: '5', name: 'Aft Cargo Hold', mass: 2800, arm: 820.0 },
        { id: '6', name: 'Wing Fuel Tanks', mass: 8500, arm: 660.0 }
    ]);

    // Apply Preset
    const handlePresetChange = (presetId: string) => {
        const found = PRESETS.find(p => p.id === presetId);
        if (!found) return;
        setSelectedPresetId(presetId);
        setLemac(found.lemac);
        setMac(found.mac);
        setFwdLimit(found.fwdLimit);
        setAftLimit(found.aftLimit);

        const newCg = Number((found.lemac + (found.mac * 0.20)).toFixed(2));
        setCgStation(newCg);
        setInputPercentMac(20.0);

        // Update default arms scale for moments if unit changes
        if (found.unit === 'm') {
            setStations([
                { id: '1', name: 'Basic Empty Mass (BEM)', mass: 42000, arm: 15.20 },
                { id: '2', name: 'Forward Passenger Cabin', mass: 6000, arm: 11.50 },
                { id: '3', name: 'Aft Passenger Cabin', mass: 6500, arm: 18.00 },
                { id: '4', name: 'Forward Cargo Hold', mass: 2200, arm: 9.80 },
                { id: '5', name: 'Aft Cargo Hold', mass: 2600, arm: 20.40 },
                { id: '6', name: 'Main Fuel Tanks', mass: 8000, arm: 15.00 }
            ]);
        } else {
            setStations([
                { id: '1', name: 'Basic Empty Mass (BEM)', mass: 41500, arm: 650.0 },
                { id: '2', name: 'Forward Passenger Cabin', mass: 5800, arm: 540.0 },
                { id: '3', name: 'Aft Passenger Cabin', mass: 6400, arm: 760.0 },
                { id: '4', name: 'Forward Cargo Hold', mass: 2200, arm: 480.0 },
                { id: '5', name: 'Aft Cargo Hold', mass: 2800, arm: 820.0 },
                { id: '6', name: 'Wing Fuel Tanks', mass: 8500, arm: 660.0 }
            ]);
        }
    };

    // Calculate from Moments Mode
    const totalMass = stations.reduce((acc, s) => acc + s.mass, 0);
    const totalMoment = stations.reduce((acc, s) => acc + (s.mass * s.arm), 0);
    const momentsCgStation = totalMass > 0 ? totalMoment / totalMass : 0;
    const momentsPercentMac = mac > 0 ? ((momentsCgStation - lemac) / mac) * 100 : 0;

    // Active Values
    const activeCgStation = calcMode === 'direct'
        ? (direction === 'stationToMac' ? cgStation : lemac + (inputPercentMac / 100) * mac)
        : momentsCgStation;

    const activePercentMac = calcMode === 'direct'
        ? (direction === 'stationToMac' ? (mac > 0 ? ((cgStation - lemac) / mac) * 100 : 0) : inputPercentMac)
        : momentsPercentMac;

    const temac = lemac + mac;
    const isWithinLimits = activePercentMac >= fwdLimit && activePercentMac <= aftLimit;
    const isTooForward = activePercentMac < fwdLimit;
    const isTooAft = activePercentMac > aftLimit;

    // Slider bounds
    const minStation = lemac - (mac * 0.2);
    const maxStation = temac + (mac * 0.2);
    const sliderStep = preset.unit === 'm' ? 0.01 : 0.5;

    // Update station in moments table
    const updateStation = (id: string, field: 'mass' | 'arm', val: number) => {
        setStations(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s));
    };

    return (
        <div className="bg-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl border border-slate-700 font-sans space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700 pb-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
                        <Percent className="w-3.5 h-3.5" /> Subject 031 • Mean Aerodynamic Chord
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        Mean Aerodynamic Chord (% MAC) Visualizer
                    </h2>
                    <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
                        Transform Center of Gravity distance measurements into standardized chord percentages. Essential for universal load sheet verification across certified transport fleets.
                    </p>
                </div>

                {/* Preset Selector */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fleet Preset:</span>
                    <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
                        {PRESETS.map(p => (
                            <button
                                key={p.id}
                                onClick={() => handlePresetChange(p.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    selectedPresetId === p.id
                                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {p.name.split(' ')[0]}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={() => setCalcMode('direct')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                        calcMode === 'direct'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/30'
                            : 'bg-slate-900 text-slate-400 border border-slate-700 hover:text-white'
                    }`}
                >
                    <ArrowRightLeft className="w-4 h-4" />
                    Bidirectional Station ↔ % MAC Slider
                </button>
                <button
                    onClick={() => setCalcMode('moments')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                        calcMode === 'moments'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/30'
                            : 'bg-slate-900 text-slate-400 border border-slate-700 hover:text-white'
                    }`}
                >
                    <Calculator className="w-4 h-4" />
                    Load Moments Multi-Station Builder (ΣM / ΣMass)
                </button>
            </div>

            {/* Aerodynamic Wing & MAC Graphic */}
            <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-700 shadow-inner relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-4">
                    <span>AIRCRAFT CHORD SECTION VIEW: {preset.name.toUpperCase()}</span>
                    <span>DATUM: {preset.datumDesc}</span>
                </div>

                {/* SVG Wing Airfoil and Scale */}
                <div className="relative h-56 w-full bg-slate-950 rounded-xl border border-slate-800 overflow-hidden select-none">
                    {/* Datum Line */}
                    <div className="absolute top-0 bottom-0 left-6 w-0.5 border-l-2 border-dashed border-red-500/80 z-10 flex flex-col justify-between py-2 pl-2">
                        <span className="text-[10px] text-red-400 font-mono font-bold bg-slate-900/90 px-1.5 py-0.5 rounded border border-red-500/40 w-max">
                            DATUM (0 {preset.unit})
                        </span>
                        <span className="text-[9px] text-red-500/70 font-mono">Reference Plane</span>
                    </div>

                    {/* Wing Airfoil Profile (Stylized chord) */}
                    <div
                        className="absolute top-12 bottom-12 bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-transparent rounded-r-full border-y border-r border-blue-500/40 z-0"
                        style={{
                            left: '25%',
                            width: '60%'
                        }}
                    >
                        {/* Shaded MAC region */}
                        <div className="absolute inset-0 bg-blue-500/10">
                            {/* Chord center chordline */}
                            <div className="absolute top-1/2 left-0 right-0 h-px bg-blue-400/30 border-b border-dashed border-blue-400/40"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 px-3 py-1 rounded-full border border-blue-500/30 text-blue-300 text-xs font-mono font-bold">
                                MAC = {mac} {preset.unit}
                            </div>
                        </div>

                        {/* LEMAC Marker */}
                        <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-cyan-400 z-10">
                            <div className="absolute -top-7 -left-6 bg-cyan-950 border border-cyan-500/50 text-cyan-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap">
                                LEMAC (0%) = {lemac} {preset.unit}
                            </div>
                        </div>

                        {/* TEMAC Marker */}
                        <div className="absolute top-0 bottom-0 right-0 w-0.5 bg-cyan-400 z-10">
                            <div className="absolute -top-7 -right-6 bg-cyan-950 border border-cyan-500/50 text-cyan-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap">
                                TEMAC (100%) = {temac} {preset.unit}
                            </div>
                        </div>

                        {/* Certified Envelope (Fwd Limit to Aft Limit) */}
                        <div
                            className="absolute top-0 bottom-0 bg-emerald-500/20 border-x-2 border-emerald-500/80"
                            style={{
                                left: `${fwdLimit}%`,
                                width: `${aftLimit - fwdLimit}%`
                            }}
                        >
                            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-emerald-400 font-mono font-bold bg-slate-900/90 px-2 py-0.5 rounded border border-emerald-500/30 whitespace-nowrap">
                                Certified Envelope ({fwdLimit}% – {aftLimit}% MAC)
                            </span>
                        </div>

                        {/* Current CG Pointer */}
                        <motion.div
                            className="absolute top-0 bottom-0 w-0.5 z-30"
                            style={{
                                left: `${activePercentMac}%`
                            }}
                            animate={{ left: `${Math.max(-5, Math.min(105, activePercentMac))}%` }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                            <div className={`w-0.5 h-full ${isWithinLimits ? 'bg-purple-400' : 'bg-red-500 animate-pulse'}`}></div>
                            {/* CG Marker Pin */}
                            <div className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-xs font-mono font-black shadow-lg flex flex-col items-center whitespace-nowrap ${
                                isWithinLimits ? 'bg-purple-600 text-white shadow-purple-600/40' : 'bg-red-600 text-white shadow-red-600/50'
                            }`}>
                                <span>CG: {activePercentMac.toFixed(1)}% MAC</span>
                                <div className={`w-2 h-2 rotate-45 -mb-1 ${isWithinLimits ? 'bg-purple-600' : 'bg-red-600'}`}></div>
                            </div>

                            {/* Station Bottom Tag */}
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-300 whitespace-nowrap bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                                Stn {activeCgStation.toFixed(2)} {preset.unit}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center gap-3">
                        {isWithinLimits ? (
                            <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
                        ) : (
                            <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 animate-bounce" />
                        )}
                        <div>
                            <div className="text-sm font-bold text-white">
                                {isWithinLimits && 'CG WITHIN CERTIFIED LIMITS'}
                                {isTooForward && 'DANGER: CG FORWARD OF FORWARD LIMIT!'}
                                {isTooAft && 'DANGER: CG AFT OF AFT CERTIFIED LIMIT!'}
                            </div>
                            <div className="text-xs text-slate-400">
                                {isWithinLimits && `Operating in certified envelope (${fwdLimit}% to ${aftLimit}% MAC). Optimal stability and control.`}
                                {isTooForward && `High nose-down pitch moment. Requires excessive tail download → extreme trim drag, higher stall speed, inability to flare on landing.`}
                                {isTooAft && `Dangerously reduced or negative static margin. Ultra-light stick forces, high risk of pitch-up divergent stall or unrecoverable flat spin.`}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 font-mono text-right">
                        <div>
                            <span className="text-[10px] text-slate-500 uppercase block">CG Station</span>
                            <span className="text-xl font-black text-white">{activeCgStation.toFixed(2)} {preset.unit}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-500 uppercase block">% MAC</span>
                            <span className={`text-2xl font-black ${isWithinLimits ? 'text-purple-400' : 'text-red-400'}`}>
                                {activePercentMac.toFixed(2)}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Direct Slider Mode Controls */}
            {calcMode === 'direct' && (
                <div className="grid md:grid-cols-2 gap-8 bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                    {/* Direction Switcher */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Calculation Direction</span>
                            <div className="flex bg-slate-950 p-1 rounded-lg">
                                <button
                                    onClick={() => setDirection('stationToMac')}
                                    className={`px-3 py-1 text-xs font-bold rounded transition-colors ${direction === 'stationToMac' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Station → % MAC
                                </button>
                                <button
                                    onClick={() => setDirection('macToStation')}
                                    className={`px-3 py-1 text-xs font-bold rounded transition-colors ${direction === 'macToStation' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                >
                                    % MAC → Station
                                </button>
                            </div>
                        </div>

                        {direction === 'stationToMac' ? (
                            <div>
                                <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
                                    <span>CG STATION (Distance from Datum)</span>
                                    <span className="text-white font-bold">{cgStation.toFixed(2)} {preset.unit}</span>
                                </div>
                                <input
                                    type="range"
                                    min={minStation}
                                    max={maxStation}
                                    step={sliderStep}
                                    value={cgStation}
                                    onChange={e => setCgStation(parseFloat(e.target.value))}
                                    className="w-full accent-purple-500 h-2 cursor-pointer"
                                />
                                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                                    <span>{minStation.toFixed(1)} {preset.unit}</span>
                                    <span>LEMAC: {lemac}</span>
                                    <span>TEMAC: {temac}</span>
                                    <span>{maxStation.toFixed(1)} {preset.unit}</span>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
                                    <span>CHORD PERCENTAGE (% MAC)</span>
                                    <span className="text-white font-bold">{inputPercentMac.toFixed(1)}% MAC</span>
                                </div>
                                <input
                                    type="range"
                                    min="-10"
                                    max="50"
                                    step="0.5"
                                    value={inputPercentMac}
                                    onChange={e => setInputPercentMac(parseFloat(e.target.value))}
                                    className="w-full accent-purple-500 h-2 cursor-pointer"
                                />
                                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                                    <span>-10%</span>
                                    <span>Fwd Limit: {fwdLimit}%</span>
                                    <span>Aft Limit: {aftLimit}%</span>
                                    <span>50%</span>
                                </div>
                            </div>
                        )}

                        <div className="pt-2 text-xs text-slate-400 space-y-1">
                            <p><strong>Fleet Model:</strong> {preset.name} ({preset.description})</p>
                            <p><strong>MAC Length:</strong> {mac} {preset.unit} • <strong>LEMAC Station:</strong> {lemac} {preset.unit}</p>
                        </div>
                    </div>

                    {/* Step-by-Step Mathematical Proof Card */}
                    <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                        <span className="text-purple-400 font-bold uppercase tracking-wider block">Croucher Mathematical Proof (Ch 10)</span>
                        {direction === 'stationToMac' ? (
                            <div className="space-y-2 text-slate-300">
                                <div className="p-2 bg-slate-900 rounded border border-slate-800 text-purple-300 font-bold">
                                    % MAC = ((CG - LEMAC) / MAC) × 100
                                </div>
                                <div>1. Subtraction: {activeCgStation.toFixed(2)} - {lemac} = {(activeCgStation - lemac).toFixed(2)} {preset.unit} from LEMAC</div>
                                <div>2. Chord Ratio: {(activeCgStation - lemac).toFixed(2)} / {mac} = {((activeCgStation - lemac) / mac).toFixed(4)}</div>
                                <div>3. Percentage: {((activeCgStation - lemac) / mac).toFixed(4)} × 100 = <strong className="text-white">{activePercentMac.toFixed(2)}% MAC</strong></div>
                            </div>
                        ) : (
                            <div className="space-y-2 text-slate-300">
                                <div className="p-2 bg-slate-900 rounded border border-slate-800 text-purple-300 font-bold">
                                    CG Station = LEMAC + ((% MAC / 100) × MAC)
                                </div>
                                <div>1. Decimal Chord: {inputPercentMac.toFixed(1)} / 100 = {(inputPercentMac / 100).toFixed(4)}</div>
                                <div>2. Distance along MAC: {(inputPercentMac / 100).toFixed(4)} × {mac} = {((inputPercentMac / 100) * mac).toFixed(2)} {preset.unit}</div>
                                <div>3. Station from Datum: {lemac} + {((inputPercentMac / 100) * mac).toFixed(2)} = <strong className="text-white">{activeCgStation.toFixed(2)} {preset.unit}</strong></div>
                            </div>
                        )}
                        <p className="text-[11px] text-slate-500 pt-1 font-sans">
                            Why % MAC is used: Absolute inches or meters change drastically between aircraft types; % MAC allows pilots and dispatchers to evaluate aerodynamic balance universally regardless of airframe scale.
                        </p>
                    </div>
                </div>
            )}

            {/* Load Moments Multi-Station Builder Mode */}
            {calcMode === 'moments' && (
                <div className="space-y-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Layers className="w-5 h-5 text-purple-400" />
                                Multi-Station Load Builder & Moment Balance
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Enter individual masses and arm stations. Total CG is computed via: Total Moment / Total Mass.
                            </p>
                        </div>
                        <div className="flex gap-4 font-mono text-xs">
                            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                                <span className="text-slate-500 block">TOTAL MASS</span>
                                <span className="text-white font-bold text-sm">{totalMass.toLocaleString()} kg</span>
                            </div>
                            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                                <span className="text-slate-500 block">TOTAL MOMENT</span>
                                <span className="text-white font-bold text-sm">{totalMoment.toLocaleString()} kg•{preset.unit}</span>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono border-collapse">
                            <thead>
                                <tr className="border-b border-slate-700 text-slate-400">
                                    <th className="py-2.5 px-3">LOADING STATION</th>
                                    <th className="py-2.5 px-3 text-right">MASS (kg)</th>
                                    <th className="py-2.5 px-3 text-right">ARM ({preset.unit})</th>
                                    <th className="py-2.5 px-3 text-right">MOMENT (kg•{preset.unit})</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stations.map(st => (
                                    <tr key={st.id} className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                                        <td className="py-2.5 px-3 font-sans text-slate-200 font-medium">{st.name}</td>
                                        <td className="py-2.5 px-3 text-right">
                                            <input
                                                type="number"
                                                value={st.mass}
                                                onChange={e => updateStation(st.id, 'mass', Math.max(0, Number(e.target.value)))}
                                                className="w-24 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-right text-white font-bold focus:border-purple-500 focus:outline-none"
                                            />
                                        </td>
                                        <td className="py-2.5 px-3 text-right">
                                            <input
                                                type="number"
                                                step={preset.unit === 'm' ? 0.01 : 1}
                                                value={st.arm}
                                                onChange={e => updateStation(st.id, 'arm', Number(e.target.value))}
                                                className="w-24 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-right text-slate-300 focus:border-purple-500 focus:outline-none"
                                            />
                                        </td>
                                        <td className="py-2.5 px-3 text-right text-purple-400 font-bold">
                                            {(st.mass * st.arm).toLocaleString(undefined, { maximumFractionDigits: 1 })}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-slate-950 font-bold border-t-2 border-slate-700">
                                    <td className="py-3 px-3 text-white">TOTALS & DERIVED CG:</td>
                                    <td className="py-3 px-3 text-right text-emerald-400">{totalMass.toLocaleString()} kg</td>
                                    <td className="py-3 px-3 text-right text-purple-400">CG: {momentsCgStation.toFixed(2)} {preset.unit}</td>
                                    <td className="py-3 px-3 text-right text-purple-300">{totalMoment.toLocaleString(undefined, { maximumFractionDigits: 1 })}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Reference Table / Theory */}
            <div className="grid md:grid-cols-3 gap-6 pt-2">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700">
                    <span className="text-cyan-400 font-bold text-xs uppercase block mb-1">LEMAC & TEMAC</span>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Leading Edge and Trailing Edge of the Mean Aerodynamic Chord. The imaginary rectangular wing slice with identical aerodynamic pitching moments and lift distribution as the swept tapered wing.
                    </p>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700">
                    <span className="text-purple-400 font-bold text-xs uppercase block mb-1">Datum Reference</span>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        An arbitrary vertical plane from which all horizontal distances (arms) are measured. A negative arm occurs if an item sits forward of the datum, producing a negative moment with positive mass.
                    </p>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700">
                    <span className="text-emerald-400 font-bold text-xs uppercase block mb-1">Neutral Point & Static Margin</span>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        The Neutral Point is the aerodynamic center of the whole aircraft. The distance between the CG and the Neutral Point is the <em>static margin</em>. Aft CG reduces this margin towards zero, creating dynamic instability.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MacVisualizer;
