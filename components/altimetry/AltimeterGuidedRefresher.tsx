import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings,
    Thermometer,
    Compass,
    Layers,
    Activity,
    AlertTriangle,
    CheckCircle2,
    ShieldAlert,
    Info,
    ArrowRight,
    RotateCcw,
    Sliders,
    BookOpen
} from 'lucide-react';
import { AltimeterGauge } from './AltimeterGauge';
import { PressureChamberVisualizer } from './PressureChamberVisualizer';
import {
    AtmosphereConditions,
    AltimeterSettings,
    AltimeterReadout,
    BarometricDatum
} from './types';
import {
    resolveAltimetryReadout,
    STANDARD_PRESSURE_HPA,
    ISA_SEA_LEVEL_TEMP_C,
    BARO_LAPSE_LOWER_TROPO_RULE_OF_THUMB,
    calculateTransitionLevel
} from './altimetryCalculations';

export const AltimeterGuidedRefresher: React.FC = () => {
    // Mode: Guided steps vs Free Sandbox
    const [mode, setMode] = useState<'guided' | 'sandbox'>('guided');
    const [guidedStep, setGuidedStep] = useState<number>(1);

    // Primary Interactive State
    const [trueAltitudeFt, setTrueAltitudeFt] = useState<number>(3500);
    const [actualQnhHpa, setActualQnhHpa] = useState<number>(1005);
    const [subscaleHpa, setSubscaleHpa] = useState<number>(1013);
    const [oatC, setOatC] = useState<number>(-5); // Cold atmosphere by default
    const [elevationFt, setElevationFt] = useState<number>(650); // Aerodrome elevation
    const [transitionAltFt, setTransitionAltFt] = useState<number>(5000);

    // Instrument Failure / System Toggles
    const [isStaticBlocked, setIsStaticBlocked] = useState<boolean>(false);
    const [isAlternateStaticOn, setIsAlternateStaticOn] = useState<boolean>(false);

    // Master calculation
    const conditions: AtmosphereConditions = {
        actualQnhHpa,
        elevationFt,
        oatC,
        trueAltitudeFt
    };

    const settings: AltimeterSettings = {
        subscaleHpa,
        transitionAltitudeFt: transitionAltFt
    };

    const readout: AltimeterReadout = resolveAltimetryReadout({ conditions, settings });

    // Effective ambient pressure for capsule chamber
    // Approx: SL QNH - (Alt / 30)
    const currentAmbientPressure = Math.max(200, actualQnhHpa - (trueAltitudeFt / BARO_LAPSE_LOWER_TROPO_RULE_OF_THUMB));

    // Guided Lesson Scenarios
    const guidedSteps = [
        {
            step: 1,
            title: '1. Apron Calibration & Subscale Basics',
            subtitle: 'QNH vs QFE vs ICAO Pre-Flight Tolerances',
            instruction: 'Adjust the Subscale Knob until the altimeter reads the Aerodrome Elevation (650 FT). This sets QNH (1005 hPa).',
            setup: () => {
                setTrueAltitudeFt(650);
                setActualQnhHpa(1005);
                setSubscaleHpa(1013); // Start with standard
                setOatC(15);
                setIsStaticBlocked(false);
                setIsAlternateStaticOn(false);
            },
            hint: 'Set subscale to 1005 hPa to zero out subscale error. Altimeter will indicate 650 ft (Aerodrome Elevation).'
        },
        {
            step: 2,
            title: '2. The Aneroid Engine & Static Mechanics',
            subtitle: 'Evacuated Capsule Physics & Alternate Static Source',
            instruction: 'Climb the aircraft to 8,000 FT. Observe how the evacuated aneroid capsule expands in response to reduced casing static pressure.',
            setup: () => {
                setTrueAltitudeFt(8000);
                setActualQnhHpa(1013);
                setSubscaleHpa(1013);
                setOatC(0);
                setIsStaticBlocked(false);
            },
            hint: 'Try toggling "Alternate Static Source" to see how aerodynamic cockpit suction lowers casing pressure and makes the altimeter overread.'
        },
        {
            step: 3,
            title: '3. Extreme Cold Temperature Distortion',
            subtitle: 'From High to Low, Look Out Below!',
            instruction: 'Lower the Outside Air Temperature (OAT) to -25°C. Notice how the cold air column shrinks, causing True Altitude to be hundreds of feet below Indicated!',
            setup: () => {
                setTrueAltitudeFt(6000);
                setActualQnhHpa(1013);
                setSubscaleHpa(1013);
                setOatC(-25);
                setIsStaticBlocked(false);
                setIsAlternateStaticOn(false);
            },
            hint: 'Rule: 4 ft per 1,000 ft per °C of ISA deviation. Cold air is denser -> pressure levels pack closer to the surface -> dangerous overreading.'
        },
        {
            step: 4,
            title: '4. Transition Altitude & Flight Level Procedures',
            subtitle: 'Annex 2 / Air Law Changeover & Transition Layer',
            instruction: 'Climb passing the Transition Altitude (5,000 FT). Notice the flight regime change and requirement to switch subscale to Standard 1013.25 hPa.',
            setup: () => {
                setTrueAltitudeFt(4500);
                setActualQnhHpa(998); // Low QNH expands transition layer!
                setSubscaleHpa(998);
                setOatC(5);
                setTransitionAltFt(5000);
                setIsStaticBlocked(false);
                setIsAlternateStaticOn(false);
            },
            hint: 'With low QNH (998 hPa), standard pressure 1013 is lower down, so the lowest usable Transition Level rises from FL60 to FL70!'
        }
    ];

    const currentStepConfig = guidedSteps[guidedStep - 1];

    const applyStep = (stepNumber: number) => {
        setGuidedStep(stepNumber);
        guidedSteps[stepNumber - 1].setup();
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8">
            {/* Main Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400 border border-emerald-500/30">
                            <Activity size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight">
                                Altimeter & Vertical Reference Systems Lab
                            </h1>
                            <p className="text-slate-400 text-sm mt-0.5">
                                Foundation Refresher & Engineering Simulator across ATPL 022 (Inst), 050 (Met), and 010 (Air Law)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mode Selector */}
                <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
                    <button
                        onClick={() => { setMode('guided'); applyStep(1); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'guided'
                            ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <BookOpen size={15} />
                        Guided Refresher
                    </button>
                    <button
                        onClick={() => setMode('sandbox')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'sandbox'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <Sliders size={15} />
                        Free Sandbox
                    </button>
                </div>
            </div>

            {/* Guided Progress Stepper */}
            {mode === 'guided' && (
                <div className="bg-slate-900/80 border border-slate-800 p-4 md:p-6 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
                            Guided Learning Module • Step {guidedStep} of {guidedSteps.length}
                        </span>
                        <div className="flex items-center gap-2">
                            {guidedStep > 1 && (
                                <button
                                    onClick={() => applyStep(guidedStep - 1)}
                                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-lg transition-all"
                                >
                                    Previous
                                </button>
                            )}
                            {guidedStep < guidedSteps.length && (
                                <button
                                    onClick={() => applyStep(guidedStep + 1)}
                                    className="flex items-center gap-1 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-xs font-black text-slate-950 rounded-xl transition-all shadow-md shadow-emerald-500/20"
                                >
                                    Next Step <ArrowRight size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {guidedSteps.map(s => (
                            <button
                                key={s.step}
                                onClick={() => applyStep(s.step)}
                                className={`p-3 rounded-2xl border text-left transition-all ${guidedStep === s.step
                                    ? 'bg-emerald-500/10 border-emerald-500 text-white'
                                    : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                <span className="text-[10px] font-black uppercase block opacity-60">Step {s.step}</span>
                                <span className="text-xs font-bold truncate block">{s.title.split('. ')[1]}</span>
                            </button>
                        ))}
                    </div>

                    {/* Step Briefing */}
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h4 className="text-base font-bold text-white mb-1">{currentStepConfig.title}</h4>
                            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                                {currentStepConfig.instruction}
                            </p>
                        </div>
                        <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl shrink-0">
                            <strong>💡 ATPL Takeaway:</strong> {currentStepConfig.hint}
                        </div>
                    </div>
                </div>
            )}

            {/* MAIN INTERACTIVE STAGE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left 4 Cols: Interactive Controls */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl">
                        <div className="flex items-center justify-between">
                            <h3 className="text-white font-bold text-sm flex items-center gap-2">
                                <Settings size={16} className="text-slate-400" />
                                Environmental Controls
                            </h3>
                            <button
                                onClick={() => {
                                    setTrueAltitudeFt(3500);
                                    setActualQnhHpa(1013);
                                    setSubscaleHpa(1013);
                                    setOatC(15);
                                    setIsStaticBlocked(false);
                                    setIsAlternateStaticOn(false);
                                }}
                                className="text-[10px] font-bold text-slate-500 hover:text-slate-300 flex items-center gap-1"
                            >
                                <RotateCcw size={11} /> Reset ISA
                            </button>
                        </div>

                        {/* True Geometric Altitude */}
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                                <span>True Geometric Altitude (MSL)</span>
                                <span className="font-mono text-white text-sm">{trueAltitudeFt} FT</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="25000"
                                step="100"
                                value={trueAltitudeFt}
                                onChange={(e) => setTrueAltitudeFt(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                <span>Sea Level (0')</span>
                                <span>10,000'</span>
                                <span>25,000'</span>
                            </div>
                        </div>

                        {/* Outside Air Temperature (OAT) */}
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                                <span className="flex items-center gap-1.5">
                                    <Thermometer size={14} className="text-orange-400" /> OAT at Altitude
                                </span>
                                <span className={`font-mono text-sm ${oatC < readout.isaTempAtAltC ? 'text-blue-400' : 'text-orange-400'}`}>
                                    {oatC}°C <span className="text-[10px] text-slate-500">(ISA Dev: {readout.isaDeviationC > 0 ? `+${readout.isaDeviationC}` : readout.isaDeviationC}°C)</span>
                                </span>
                            </div>
                            <input
                                type="range"
                                min="-50"
                                max="40"
                                step="1"
                                value={oatC}
                                onChange={(e) => setOatC(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                <span>-50°C (Extreme Cold)</span>
                                <span>ISA Standard</span>
                                <span>+40°C (Hot)</span>
                            </div>
                        </div>

                        {/* Actual Ambient QNH */}
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                                <span>Actual Surface QNH</span>
                                <span className="font-mono text-white text-sm">{actualQnhHpa} hPa</span>
                            </div>
                            <input
                                type="range"
                                min="950"
                                max="1050"
                                step="1"
                                value={actualQnhHpa}
                                onChange={(e) => setActualQnhHpa(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                <span>950 hPa (Low)</span>
                                <span>1013.25 hPa (ISA)</span>
                                <span>1050 hPa (High)</span>
                            </div>
                        </div>

                        {/* Kollsman Subscale Setting */}
                        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                            <div className="flex justify-between items-center text-xs font-bold">
                                <span className="text-slate-400">Kollsman Subscale Dial</span>
                                <span className="font-mono text-emerald-400 text-sm">{subscaleHpa} hPa</span>
                            </div>
                            <input
                                type="range"
                                min="940"
                                max="1060"
                                step="1"
                                value={subscaleHpa}
                                onChange={(e) => setSubscaleHpa(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <div className="flex gap-2 pt-1">
                                <button
                                    onClick={() => setSubscaleHpa(actualQnhHpa)}
                                    className="flex-1 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-xl text-[11px] font-bold transition-all"
                                >
                                    Set QNH ({actualQnhHpa})
                                </button>
                                <button
                                    onClick={() => setSubscaleHpa(1013)}
                                    className="flex-1 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-500/30 rounded-xl text-[11px] font-bold transition-all"
                                >
                                    Set STD (1013)
                                </button>
                            </div>
                        </div>

                        {/* Pitot-Static Failure Toggles */}
                        <div className="pt-2 border-t border-slate-800 space-y-2">
                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                                Pitot-Static System Failures
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setIsStaticBlocked(!isStaticBlocked)}
                                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${isStaticBlocked
                                        ? 'bg-red-500/20 border-red-500 text-red-400'
                                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                                        }`}
                                >
                                    Static Port Blocked
                                </button>
                                <button
                                    onClick={() => setIsAlternateStaticOn(!isAlternateStaticOn)}
                                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${isAlternateStaticOn
                                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                                        }`}
                                >
                                    Alt Static Source
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center 4 Cols: Realistic 3-Pointer Cockpit Gauge */}
                <div className="lg:col-span-4 flex flex-col items-center justify-between gap-6">
                    <div className="w-full bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col items-center">
                        <div className="w-full flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                3-Pointer Cockpit Instrument
                            </span>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${readout.flightRegime === 'BELOW_TA'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : readout.flightRegime === 'TRANSITION_LAYER'
                                    ? 'bg-amber-500/20 text-amber-400'
                                    : 'bg-indigo-500/20 text-indigo-400'
                                }`}>
                                {readout.flightRegime.replace('_', ' ')}
                            </span>
                        </div>

                        {/* Cockpit Altimeter Dial */}
                        <AltimeterGauge
                            indicatedAltitude={readout.indicatedAltitude}
                            subscaleHpa={subscaleHpa}
                            onSubscaleChange={(val) => setSubscaleHpa(val)}
                            size="lg"
                            interactive={true}
                        />

                        {/* Primary Indication Banner */}
                        <div className="w-full mt-6 grid grid-cols-2 gap-3 text-center border-t border-slate-800 pt-4">
                            <div>
                                <span className="text-[10px] font-bold uppercase text-slate-500 block">Indicated Alt</span>
                                <span className="font-mono text-2xl font-black text-white">
                                    {readout.indicatedAltitude.toLocaleString()}
                                    <span className="text-xs text-slate-400 font-normal"> FT</span>
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase text-slate-500 block">True Alt (AMSL)</span>
                                <span className="font-mono text-2xl font-black text-emerald-400">
                                    {readout.trueAltitude.toLocaleString()}
                                    <span className="text-xs text-slate-400 font-normal"> FT</span>
                                </span>
                            </div>
                        </div>

                        {/* Error Warning Pill */}
                        <div className="w-full mt-4">
                            {readout.totalErrorFt !== 0 ? (
                                <div className={`p-3 rounded-2xl border text-xs flex items-center gap-2.5 ${readout.isOverreading
                                    ? 'bg-red-500/10 border-red-500/40 text-red-300'
                                    : 'bg-sky-500/10 border-sky-500/40 text-sky-300'
                                    }`}>
                                    <AlertTriangle size={18} className="shrink-0" />
                                    <div>
                                        <div className="font-bold">
                                            {readout.isOverreading ? 'DANGER: Overreading (+Error)' : 'Underreading (-Error)'}
                                        </div>
                                        <div className="text-[11px] opacity-80 mt-0.5">
                                            Indicated is {Math.abs(readout.totalErrorFt)} FT {readout.isOverreading ? 'higher' : 'lower'} than True!
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 flex items-center gap-2 font-bold">
                                    <CheckCircle2 size={16} /> Zero Net Error (Perfect Calibration)
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right 4 Cols: Aneroid Chamber Visualizer & Diagnostics */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Aneroid Capsule Mechanism */}
                    <PressureChamberVisualizer
                        ambientPressureHpa={currentAmbientPressure}
                        isStaticBlocked={isStaticBlocked}
                        isAlternateStaticOn={isAlternateStaticOn}
                    />

                    {/* Breakdown of the 5 Core Vertical Datums */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
                        <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                            The 5 Vertical References (ATPL Taxonomy)
                        </h4>

                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between items-center p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                                <div>
                                    <strong className="text-amber-400">1. Height (AGL):</strong>
                                    <span className="text-[10px] text-slate-500 block">QFE datum • Ground relative</span>
                                </div>
                                <span className="font-mono font-bold text-white">{readout.heightAGL} FT</span>
                            </div>

                            <div className="flex justify-between items-center p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                                <div>
                                    <strong className="text-emerald-400">2. Altitude (AMSL):</strong>
                                    <span className="text-[10px] text-slate-500 block">QNH datum • MSL relative</span>
                                </div>
                                <span className="font-mono font-bold text-white">{readout.altitudeAMSL} FT</span>
                            </div>

                            <div className="flex justify-between items-center p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                                <div>
                                    <strong className="text-sky-400">3. Pressure Altitude:</strong>
                                    <span className="text-[10px] text-slate-500 block">1013.25 datum • Performance</span>
                                </div>
                                <span className="font-mono font-bold text-white">{readout.pressureAltitude} FT</span>
                            </div>

                            <div className="flex justify-between items-center p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                                <div>
                                    <strong className="text-indigo-400">4. Flight Level:</strong>
                                    <span className="text-[10px] text-slate-500 block">SPS • Cruise ≥ TL</span>
                                </div>
                                <span className="font-mono font-bold text-white">FL{readout.flightLevel}</span>
                            </div>

                            <div className="flex justify-between items-center p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                                <div>
                                    <strong className="text-rose-400">5. Density Altitude:</strong>
                                    <span className="text-[10px] text-slate-500 block">PA ± 120ΔT • Engine lift</span>
                                </div>
                                <span className="font-mono font-bold text-white">{readout.densityAltitude} FT</span>
                            </div>
                        </div>

                        {/* Transition Level ATC Info Box */}
                        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                            <div className="flex justify-between">
                                <span>Transition Altitude (TA):</span>
                                <strong className="text-white font-mono">{transitionAltFt} FT</strong>
                            </div>
                            <div className="flex justify-between">
                                <span>Lowest Usable TL (ATC):</span>
                                <strong className="text-emerald-400 font-mono">{readout.transitionLevelInfo.transitionLevelFL}</strong>
                            </div>
                            <div className="flex justify-between">
                                <span>Transition Layer Depth:</span>
                                <span className="text-slate-300 font-mono">{readout.transitionLevelInfo.transitionLayerThicknessFt} FT</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AltimeterGuidedRefresher;
