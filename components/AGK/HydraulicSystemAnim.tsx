import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Droplets, 
    Settings, 
    AlertTriangle, 
    Gauge, 
    ArrowRight, 
    RefreshCw, 
    Shield, 
    Zap, 
    Flame, 
    CheckCircle2, 
    Layers,
    Sliders,
    Wind
} from 'lucide-react';

type TabType = 'schematic' | 'ptu' | 'accumulator' | 'fluids' | 'pascal';

const HydraulicSystemAnim: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('schematic');

    // System pressure state (3000 PSI nominal)
    const [greenPumpOn, setGreenPumpOn] = useState(true);
    const [yellowPumpOn, setYellowPumpOn] = useState(true);
    const [blueElectricOn, setBlueElectricOn] = useState(false);
    const [ratDeployed, setRatDeployed] = useState(false);
    const [ptuAuto, setPtuAuto] = useState(true);

    const [greenPress, setGreenPress] = useState(3000);
    const [yellowPress, setYellowPress] = useState(3000);
    const [bluePress, setBluePress] = useState(0);

    // Actuator extension (0-100%)
    const [flightControlPos, setFlightControlPos] = useState(50);

    // PTU transfer active if pressure delta > 500 PSI between Green and Yellow
    const ptuRunning = ptuAuto && (
        (greenPumpOn && !yellowPumpOn && greenPress > 2000) ||
        (!greenPumpOn && yellowPumpOn && yellowPress > 2000)
    );

    // Simulation loop
    useEffect(() => {
        const interval = setInterval(() => {
            // Green system pressure
            if (greenPumpOn) {
                setGreenPress(p => Math.min(3000, p + 100));
            } else if (ptuRunning && yellowPress > 2500) {
                // PTU mechanically drives green pump
                setGreenPress(p => Math.min(2900, p + 80));
            } else {
                setGreenPress(p => Math.max(0, p - 60));
            }

            // Yellow system pressure
            if (yellowPumpOn) {
                setYellowPress(p => Math.min(3000, p + 100));
            } else if (ptuRunning && greenPress > 2500) {
                // PTU mechanically drives yellow pump
                setYellowPress(p => Math.min(2900, p + 80));
            } else {
                setYellowPress(p => Math.max(0, p - 60));
            }

            // Blue system pressure (Electric pump or RAT)
            if (blueElectricOn || ratDeployed) {
                setBluePress(p => Math.min(3000, p + 120));
            } else {
                setBluePress(p => Math.max(0, p - 80));
            }
        }, 60);

        return () => clearInterval(interval);
    }, [greenPumpOn, yellowPumpOn, blueElectricOn, ratDeployed, ptuRunning, yellowPress, greenPress]);

    // Pascal's Law interactive calculator
    const [pascalSysPressure, setPascalSysPressure] = useState<number>(3000); // PSI
    const [pistonDiameter, setPistonDiameter] = useState<number>(3.0); // inches
    const pistonRadius = pistonDiameter / 2;
    const pistonAreaSqIn = Math.PI * Math.pow(pistonRadius, 2);
    const calculatedForceLbs = pascalSysPressure * pistonAreaSqIn;

    // Accumulator interactive state
    const [accHydPress, setAccHydPress] = useState<number>(3000); // PSI
    const nitrogenPrecharge = 1500; // PSI
    // Gauge reading is the higher of precharge or hydraulic pressure
    const accGaugeReading = Math.max(nitrogenPrecharge, accHydPress);
    // Gas volume compression: high pressure compresses nitrogen chamber
    const nitrogenVolumePct = Math.max(25, Math.min(100, Math.round(100 - (accHydPress / 3000) * 55)));

    const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
        { id: 'schematic', label: 'Multi-System Architecture', icon: <Layers className="w-4 h-4" /> },
        { id: 'ptu', label: 'Power Transfer Unit (PTU)', icon: <RefreshCw className="w-4 h-4" /> },
        { id: 'accumulator', label: 'Nitrogen Accumulator', icon: <Gauge className="w-4 h-4" /> },
        { id: 'fluids', label: 'Skydrol vs Mineral Fluid', icon: <Droplets className="w-4 h-4" /> },
        { id: 'pascal', label: "Pascal's Law Lab", icon: <Sliders className="w-4 h-4" /> },
    ];

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8 min-h-screen">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-purple-400 mb-2">
                    <span>EASA 021.03</span>
                    <span>•</span>
                    <span>Aircraft General Knowledge</span>
                    <span>•</span>
                    <span>Hydraulics</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3">
                    <Droplets className="text-purple-400 w-10 h-10" />
                    Hydraulic Power & Flight Actuation
                </h1>
                <p className="text-slate-400 mt-2 max-w-3xl text-base md:text-lg">
                    Pascal's hydraulic multiplication, non-flammable Skydrol phosphate ester fluids, nitrogen gas pre-charged accumulators, and the Power Transfer Unit (PTU) mechanical handshake.
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                            activeTab === tab.id
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Content Tabs */}
            <AnimatePresence mode="wait">
                {/* 1. SCHEMATIC / ARCHITECTURE */}
                {activeTab === 'schematic' && (
                    <motion.div
                        key="schematic"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="space-y-6"
                    >
                        {/* Redundant Circuit Visualization */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Layers className="text-purple-400" />
                                        Triple-Redundant Circuit Bus (Green, Blue, Yellow)
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Independent, segregated 3,000 PSI circuits powering flight controls and heavy actuators.
                                    </p>
                                </div>
                                <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300">
                                    Operating Standard: <span className="font-bold text-white">3,000 PSI ± 200 PSI</span>
                                </div>
                            </div>

                            {/* 3 Circuit Columns */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* GREEN CIRCUIT */}
                                <div className="bg-slate-950 p-6 rounded-2xl border border-emerald-500/30 flex flex-col justify-between space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">GREEN SYSTEM</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                                greenPress > 2500 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                                            }`}>
                                                {greenPress > 2500 ? 'NORMAL' : 'LOW PRESS'}
                                            </span>
                                        </div>

                                        <div className="text-3xl font-black font-mono text-emerald-400 mb-1">
                                            {greenPress} <span className="text-sm font-sans text-slate-400">PSI</span>
                                        </div>
                                        <div className="text-xs text-slate-400 mb-4">Primary: Engine 1 EDP + PTU</div>

                                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1 text-xs text-slate-300">
                                            <div>• Landing Gear Retraction</div>
                                            <div>• Normal Braking & Nosewheel Steering</div>
                                            <div>• Flaps & Slats Motors</div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setGreenPumpOn(!greenPumpOn)}
                                        className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                                            greenPumpOn
                                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                                                : 'bg-red-900/40 text-red-300 border border-red-500/40'
                                        }`}
                                    >
                                        ENG 1 PUMP: {greenPumpOn ? 'ON (3000 PSI)' : 'OFF (FAILED)'}
                                    </button>
                                </div>

                                {/* BLUE CIRCUIT */}
                                <div className="bg-slate-950 p-6 rounded-2xl border border-blue-500/30 flex flex-col justify-between space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">BLUE SYSTEM</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                                bluePress > 2500 ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-400'
                                            }`}>
                                                {bluePress > 2500 ? 'NORMAL' : 'STANDBY'}
                                            </span>
                                        </div>

                                        <div className="text-3xl font-black font-mono text-blue-400 mb-1">
                                            {bluePress} <span className="text-sm font-sans text-slate-400">PSI</span>
                                        </div>
                                        <div className="text-xs text-slate-400 mb-4">Primary: Electric Pump + Deployable RAT</div>

                                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1 text-xs text-slate-300">
                                            <div>• Emergency Flight Control Authority</div>
                                            <div>• Slats Operation (Alternate)</div>
                                            <div>• Dedicated Emergency RAT Turbine</div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <button
                                            onClick={() => setBlueElectricOn(!blueElectricOn)}
                                            className={`w-full py-2 rounded-xl font-bold text-xs transition-all ${
                                                blueElectricOn
                                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            ELECTRIC PUMP: {blueElectricOn ? 'ON' : 'OFF'}
                                        </button>
                                        <button
                                            onClick={() => setRatDeployed(!ratDeployed)}
                                            className={`w-full py-2 rounded-xl font-bold text-xs transition-all ${
                                                ratDeployed
                                                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            RAT: {ratDeployed ? 'DEPLOYED' : 'STOWED'}
                                        </button>
                                    </div>
                                </div>

                                {/* YELLOW CIRCUIT */}
                                <div className="bg-slate-950 p-6 rounded-2xl border border-amber-500/30 flex flex-col justify-between space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">YELLOW SYSTEM</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                                yellowPress > 2500 ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'
                                            }`}>
                                                {yellowPress > 2500 ? 'NORMAL' : 'LOW PRESS'}
                                            </span>
                                        </div>

                                        <div className="text-3xl font-black font-mono text-amber-400 mb-1">
                                            {yellowPress} <span className="text-sm font-sans text-slate-400">PSI</span>
                                        </div>
                                        <div className="text-xs text-slate-400 mb-4">Primary: Engine 2 EDP + PTU + Hand Pump</div>

                                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1 text-xs text-slate-300">
                                            <div>• Alternate Braking & Parking Brake</div>
                                            <div>• Cargo Door Operation</div>
                                            <div>• Flaps Operation (Alternate)</div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setYellowPumpOn(!yellowPumpOn)}
                                        className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                                            yellowPumpOn
                                                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                                                : 'bg-red-900/40 text-red-300 border border-red-500/40'
                                        }`}
                                    >
                                        ENG 2 PUMP: {yellowPumpOn ? 'ON (3000 PSI)' : 'OFF (FAILED)'}
                                    </button>
                                </div>
                            </div>

                            {/* PTU Status Bar */}
                            <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                                ptuRunning 
                                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' 
                                    : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}>
                                <div className="flex items-center gap-3">
                                    <RefreshCw className={`w-5 h-5 ${ptuRunning ? 'animate-spin text-amber-400' : 'text-slate-600'}`} />
                                    <div>
                                        <span className="font-bold text-white text-sm block">
                                            Power Transfer Unit (PTU): {ptuRunning ? 'RUNNING (TRANSFERRING TORQUE)' : 'STANDBY'}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            {ptuRunning 
                                                ? 'Mechanical drive shaft spinning to equalize Green and Yellow pressure with ZERO fluid transfer!' 
                                                : 'Both systems balanced or PTU switch off.'}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setPtuAuto(!ptuAuto)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                                        ptuAuto ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                                    }`}
                                >
                                    PTU: {ptuAuto ? 'AUTO' : 'OFF'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 2. POWER TRANSFER UNIT (PTU) DEEP DIVE */}
                {activeTab === 'ptu' && (
                    <motion.div
                        key="ptu"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <RefreshCw className="text-purple-400" />
                                    The "Separated Bloodlines" Mental Model
                                </h3>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    The Power Transfer Unit (PTU) connects the Green and Yellow hydraulic systems. It consists of two reversible hydraulic motor-pumps mechanically joined by a <strong>solid rotating drive shaft</strong>.
                                </p>

                                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                                    <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-3">
                                        <span className="text-emerald-400 font-bold">GREEN SYSTEM FLUID</span>
                                        <span className="text-slate-500">MECHANICAL SHAFT</span>
                                        <span className="text-amber-400 font-bold">YELLOW SYSTEM FLUID</span>
                                    </div>

                                    <div className="flex items-center justify-between py-4">
                                        <div className="w-24 h-16 rounded-xl bg-emerald-950/40 border-2 border-emerald-500/50 flex items-center justify-center text-center">
                                            <span className="text-xs font-bold text-emerald-300">Motor or Pump</span>
                                        </div>

                                        <div className="flex-1 mx-4 h-3 bg-gradient-to-r from-emerald-500 via-white to-amber-500 rounded-full relative flex items-center justify-center">
                                            <motion.div
                                                className="w-4 h-4 bg-white rounded-full shadow-lg"
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                            />
                                        </div>

                                        <div className="w-24 h-16 rounded-xl bg-amber-950/40 border-2 border-amber-500/50 flex items-center justify-center text-center">
                                            <span className="text-xs font-bold text-amber-300">Motor or Pump</span>
                                        </div>
                                    </div>

                                    <div className="text-center text-xs font-mono text-cyan-300 bg-cyan-950/30 p-2.5 rounded-xl border border-cyan-500/20">
                                        <strong>FLUID TRANSFER = 0%</strong> • <strong>TORQUE TRANSFER = 100%</strong>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-400 leading-relaxed">
                                    If a hydraulic line bursts in the Green circuit and all fluid leaks out, Yellow fluid is never contaminated and never lost. The PTU automatically inhibits itself to prevent burning up its motor.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                                    <h4 className="text-sm font-mono uppercase text-purple-400 font-bold mb-3">
                                        PTU Automatic Trigger Logic
                                    </h4>
                                    <ul className="space-y-3 text-xs text-slate-300">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                            <span><strong>Differential Trigger:</strong> Automatically activates when the pressure difference between Green and Yellow exceeds 500 PSI.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                            <span><strong>Engine Start Inhibit:</strong> Automatically inhibited during Engine 1 start until Engine 2 is running to prevent premature operation while passengers board.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                            <span><strong>Barking Dog Sound:</strong> The characteristic cycling "barking dog" noise heard on Airbus A320s is the PTU rapidly cycling during single-engine taxi!</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-amber-950/20 border border-amber-500/30 rounded-3xl p-6">
                                    <h4 className="text-sm font-mono uppercase text-amber-400 font-bold mb-2 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" />
                                        ATPL Exam Question: Can Fluid Cross the PTU?
                                    </h4>
                                    <p className="text-xs text-amber-200/90 leading-relaxed">
                                        <em>Question:</em> "If system Green suffers complete fluid depletion, can the PTU replenish Green fluid from Yellow?"<br />
                                        <strong>Answer: ABSOLUTELY NOT.</strong> The PTU transfers only mechanical shaft torque. It cannot transfer fluid or restore a depleted reservoir.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 3. NITROGEN-CHARGED ACCUMULATOR */}
                {activeTab === 'accumulator' && (
                    <motion.div
                        key="accumulator"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Interactive Accumulator Cutaway */}
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Gauge className="text-purple-400" />
                                    Hydraulic Accumulator Simulator
                                </h3>

                                <div>
                                    <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                                        <span>System Hydraulic Pressure</span>
                                        <span className="text-purple-400 font-bold">{accHydPress} PSI</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="3000"
                                        step="100"
                                        value={accHydPress}
                                        onChange={(e) => setAccHydPress(Number(e.target.value))}
                                        className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                                        <span>0 PSI (Pumps Off)</span>
                                        <span>1500 PSI (Precharge)</span>
                                        <span>3000 PSI (Normal)</span>
                                    </div>
                                </div>

                                {/* Accumulator Chamber Cutaway */}
                                <div className="h-64 bg-slate-950 rounded-2xl border-2 border-slate-700 relative overflow-hidden flex flex-col justify-between p-4">
                                    {/* Nitrogen Gas Chamber */}
                                    <motion.div
                                        className="w-full bg-blue-900/40 border border-blue-500/40 rounded-t-xl flex flex-col items-center justify-center transition-all duration-300"
                                        style={{ height: `${nitrogenVolumePct}%` }}
                                    >
                                        <span className="text-xs font-mono font-bold text-blue-300 uppercase">
                                            Nitrogen Gas Charge ($N_2$)
                                        </span>
                                        <span className="text-[10px] text-blue-200 font-mono">
                                            Gas Pressure: {accGaugeReading} PSI
                                        </span>
                                    </motion.div>

                                    {/* Floating Piston / Bladder Divider */}
                                    <div className="w-full h-3 bg-amber-400 rounded-full my-1 shadow-[0_0_10px_rgba(251,191,36,0.6)] flex items-center justify-center">
                                        <span className="text-[8px] font-black text-slate-950 font-mono">SEPARATION PISTON</span>
                                    </div>

                                    {/* Hydraulic Fluid Chamber */}
                                    <motion.div
                                        className="w-full bg-purple-900/50 border border-purple-500/50 rounded-b-xl flex flex-col items-center justify-center transition-all duration-300"
                                        style={{ height: `${100 - nitrogenVolumePct}%` }}
                                    >
                                        <span className="text-xs font-mono font-bold text-purple-300 uppercase">
                                            Skydrol Fluid Inflow
                                        </span>
                                        <span className="text-[10px] text-purple-200 font-mono">
                                            Line Pressure: {accHydPress} PSI
                                        </span>
                                    </motion.div>
                                </div>

                                {/* Gauge Reading Output */}
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                                    <div>
                                        <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
                                            Accumulator Pressure Gauge
                                        </span>
                                        <span className="text-[10px] text-slate-500">
                                            Reads Nitrogen pre-charge even when hydraulic pumps are unpowered!
                                        </span>
                                    </div>
                                    <div className="text-2xl font-black font-mono text-emerald-400">
                                        {accGaugeReading} PSI
                                    </div>
                                </div>
                            </div>

                            {/* Functions & Exam Trap */}
                            <div className="space-y-6">
                                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                                    <h4 className="text-sm font-mono uppercase text-purple-400 font-bold mb-4">
                                        3 Critical Accumulator Functions
                                    </h4>
                                    <div className="space-y-3 text-xs text-slate-300">
                                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                                            <strong className="text-white block mb-1">1. Damps Pump Pulsations</strong>
                                            Piston pumps produce rapid cyclic pressure ripples. The compressible nitrogen cushion absorbs these shocks to protect lines from fatigue rupture.
                                        </div>
                                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                                            <strong className="text-white block mb-1">2. Absorbs Thermal Expansion</strong>
                                            As hydraulic fluid heats up in flight, expansion pushes fluid into the accumulator rather than blowing overpressure relief valves.
                                        </div>
                                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                                            <strong className="text-white block mb-1">3. Emergency Stored Energy Reserve</strong>
                                            Provides stored hydraulic pressure to actuate emergency wheel brakes (typically 7–10 full brake applications) or deploy landing gear doors.
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-amber-950/20 border border-amber-500/30 rounded-3xl p-6">
                                    <h4 className="text-sm font-mono uppercase text-amber-400 font-bold mb-2 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" />
                                        The Classic Precharge Exam Trap
                                    </h4>
                                    <p className="text-xs text-amber-200/90 leading-relaxed">
                                        <em>Question:</em> "Before engine start with all hydraulic pumps OFF, what will the brake accumulator pressure gauge indicate?"<br />
                                        <strong>Answer: The nitrogen gas precharge pressure (~1,000 to 1,500 PSI), NOT ZERO!</strong> Zero PSI indicates the nitrogen charge has completely leaked out, rendering the accumulator inoperative.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 4. SKYDROL VS MINERAL FLUID */}
                {activeTab === 'fluids' && (
                    <motion.div
                        key="fluids"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="space-y-6"
                    >
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Droplets className="text-purple-400" />
                                Hydraulic Fluid Chemistry & Seal Compatibility
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Skydrol */}
                                <div className="bg-slate-950 p-6 rounded-2xl border border-purple-500/40 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-lg font-bold text-purple-300">Skydrol / HyJet (Phosphate Ester)</h4>
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                                            Transport Category Standard
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-xs text-slate-300">
                                        <div>• <strong className="text-white">Color:</strong> Purple or Green / Clear.</div>
                                        <div>• <strong className="text-white">Flammability:</strong> Fire-resistant; self-extinguishing if sprayed on hot engine exhausts.</div>
                                        <div>• <strong className="text-white">Mandatory Seals:</strong> <strong>EPDM / Butyl Rubber</strong> seals only.</div>
                                        <div>• <strong className="text-white">Toxicity:</strong> Severe skin irritant, destructive to cockpit paint, wire insulation, and eyes.</div>
                                        <div>• <strong className="text-white">Moisture Risk:</strong> Hygroscopic; absorbs atmospheric water, creating corrosive phosphoric acid.</div>
                                    </div>
                                </div>

                                {/* Mineral */}
                                <div className="bg-slate-950 p-6 rounded-2xl border border-red-500/40 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-lg font-bold text-red-300">DTD 585 / MIL-H-5606 (Mineral Oil)</h4>
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40">
                                            Light Aircraft & Legacy
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-xs text-slate-300">
                                        <div>• <strong className="text-white">Color:</strong> Dyed distinct Red.</div>
                                        <div>• <strong className="text-white">Flammability:</strong> Petroleum-based and highly flammable under high-pressure atomization.</div>
                                        <div>• <strong className="text-white">Mandatory Seals:</strong> <strong>Neoprene / Nitrile Rubber</strong> seals.</div>
                                        <div>• <strong className="text-white">Toxicity:</strong> Moderate petroleum oil toxicity.</div>
                                        <div>• <strong className="text-white">Limitation:</strong> Unsuitable for high-temp transport aircraft braking & engines.</div>
                                    </div>
                                </div>
                            </div>

                            {/* Seal Incompatibility Disaster Warning */}
                            <div className="mt-6 bg-red-950/20 border-2 border-red-500/50 rounded-2xl p-6 flex items-start gap-4">
                                <div className="p-3 bg-red-500/20 text-red-400 rounded-xl shrink-0">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wide">
                                        Fatal Anti-Pattern: Cross-Fluid Contamination
                                    </h4>
                                    <p className="text-xs text-red-200/90 leading-relaxed">
                                        Pouring mineral oil into a Skydrol system dissolves EPDM seals into mush. Pouring Skydrol into a mineral system immediately swells and shreds neoprene seals. In both cases, <strong>catastrophic total hydraulic fluid blowout occurs within minutes</strong>. Ground servicing carts are strictly keyed with non-interchangeable fittings to prevent cross-contamination.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 5. PASCAL'S LAW LAB */}
                {activeTab === 'pascal' && (
                    <motion.div
                        key="pascal"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Interactive Multiplication Calculator */}
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Sliders className="text-purple-400" />
                                    Pascal's Principle & Actuator Sizing ($F = P \times A$)
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Pressure applied to an enclosed fluid is transmitted undiminished in all directions.
                                </p>

                                <div>
                                    <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                                        <span>Hydraulic Pressure ($P$)</span>
                                        <span className="text-purple-400 font-bold">{pascalSysPressure} PSI</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1000"
                                        max="5000"
                                        step="100"
                                        value={pascalSysPressure}
                                        onChange={(e) => setPascalSysPressure(Number(e.target.value))}
                                        className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                                        <span>Actuator Piston Diameter ($D$)</span>
                                        <span className="text-white font-bold">{pistonDiameter.toFixed(1)} inches</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1.0"
                                        max="6.0"
                                        step="0.1"
                                        value={pistonDiameter}
                                        onChange={(e) => setPistonDiameter(Number(e.target.value))}
                                        className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                                    />
                                </div>

                                {/* Calculation Output */}
                                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                                    <div className="flex justify-between items-center text-xs text-slate-400">
                                        <span>Piston Area ($A = \pi \times r^2$):</span>
                                        <span className="font-mono text-white font-bold">{pistonAreaSqIn.toFixed(2)} sq in</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-800 pt-2">
                                        <span>Linear Force Output ($F = P \times A$):</span>
                                        <span className="text-2xl font-black font-mono text-emerald-400">
                                            {Math.round(calculatedForceLbs).toLocaleString()} LBS
                                        </span>
                                    </div>
                                </div>

                                {/* Reset to Standard Example Button */}
                                <button
                                    onClick={() => {
                                        setPascalSysPressure(3000);
                                        setPistonDiameter(3.0);
                                    }}
                                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-colors"
                                >
                                    Load Standard Chapter 4 Worked Example (3000 PSI, 3" Piston)
                                </button>
                            </div>

                            {/* Worked Example Card */}
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
                                <h4 className="text-sm font-mono uppercase text-purple-400 font-bold">
                                    Hydraulics Worked Example: Flap Actuator Sizing
                                </h4>
                                <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                                    <p>
                                        <strong>Scenario:</strong> Calculate the force generated by a trailing-edge flap actuator piston with a 3.0-inch diameter connected to a standard 3,000 PSI system:
                                    </p>
                                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono space-y-1 text-slate-200">
                                        <div>1. Radius r = 3.0 / 2 = 1.5 inches</div>
                                        <div>2. Area A = π × (1.5)² = 7.07 sq inches</div>
                                        <div>3. Force F = 3,000 × 7.07 = 21,210 lbs</div>
                                    </div>
                                    <p>
                                        Over <strong>21,000 lbs of linear push</strong> is required to deploy high-drag transport aircraft flaps against high-speed aerodynamic airflow!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HydraulicSystemAnim;
