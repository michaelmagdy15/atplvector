
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, AlertTriangle, ArrowDown, ArrowUp, Gauge } from 'lucide-react';

const LandingGearSystem: React.FC = () => {
    // Aircraft State
    const [onGround, setOnGround] = useState(true); // Squat Switch
    const [sysHydPressure, setSysHydPressure] = useState(3000); // PSI

    // Gear Lever: 'UP' | 'DOWN' | 'OFF'
    const [leverPos, setLeverPos] = useState<'UP' | 'DOWN' | 'OFF'>('DOWN');

    // Gear Position (0 = UP/LOCKED, 100 = DOWN/LOCKED)
    const [nosePos, setNosePos] = useState(100);
    const [leftPos, setLeftPos] = useState(100);
    const [rightPos, setRightPos] = useState(100);

    // Door Position (0 = CLOSED, 100 = OPEN)
    const [noseDoor, setNoseDoor] = useState(0);
    const [mainDoors, setMainDoors] = useState(0);

    // Brake Temps (deg C)
    const [brakeTemps, setBrakeTemps] = useState([150, 145, 155, 140]); // L1, L2, R1, R2

    // Auto Brake: 'RTO' | 'OFF' | '1' | '2' | '3' | 'MAX'
    const [autoBrake, setAutoBrake] = useState('OFF');

    // Simulation Loop
    useEffect(() => {
        const timer = setInterval(() => {
            // Retraction Logic
            if (leverPos === 'UP') {
                if (onGround) {
                    // Safety Interlock preventing retraction on ground
                    return;
                }

                // 1. Open Doors
                if (mainDoors < 100) setMainDoors(p => Math.min(100, p + 5));
                if (noseDoor < 100) setNoseDoor(p => Math.min(100, p + 5));

                // 2. Retract Gear (Only if doors open)
                if (mainDoors > 80 && mainDoors <= 100) {
                    if (leftPos > 0) setLeftPos(p => Math.max(0, p - 2));
                    if (rightPos > 0) setRightPos(p => Math.max(0, p - 2));
                    if (nosePos > 0) setNosePos(p => Math.max(0, p - 2));
                }

                // 3. Close Doors (Only if gear up)
                if (leftPos === 0 && rightPos === 0 && nosePos === 0) {
                    if (mainDoors > 0) setMainDoors(p => Math.max(0, p - 5));
                    if (noseDoor > 0) setNoseDoor(p => Math.max(0, p - 5));
                }
            }

            // Extension Logic
            if (leverPos === 'DOWN') {
                // 1. Open Doors
                if (mainDoors < 100) setMainDoors(p => Math.min(100, p + 5));
                if (noseDoor < 100) setNoseDoor(p => Math.min(100, p + 5));

                // 2. Extend Gear
                if (mainDoors > 80) {
                    if (leftPos < 100) setLeftPos(p => Math.min(100, p + 2)); // Gravity assist
                    if (rightPos < 100) setRightPos(p => Math.min(100, p + 2));
                    if (nosePos < 100) setNosePos(p => Math.min(100, p + 2));
                }

                // 3. Close Doors
                if (leftPos === 100 && rightPos === 100 && nosePos === 100) {
                    if (mainDoors > 0) setMainDoors(p => Math.max(0, p - 5));
                    if (noseDoor > 0) setNoseDoor(p => Math.max(0, p - 5));
                }
            }

            // Brake Cooling
            setBrakeTemps(prev => prev.map(t => Math.max(20, t - 0.1)));

        }, 50);
        return () => clearInterval(timer);
    }, [leverPos, onGround, mainDoors, leftPos]);

    const applyBrakes = () => {
        setBrakeTemps(prev => prev.map(t => Math.min(900, t + 15)));
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <Settings className="text-emerald-500" />
                Landing Gear & Braking Systems
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 1. Main Gear Panel (Center) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Visualizer */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative min-h-[400px] flex items-center justify-center overflow-hidden">

                        {/* Aircraft Body Outline */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10">
                            <ArrowUp size={300} className="text-slate-500" />
                        </div>

                        {/* NOSE GEAR */}
                        <div className="absolute top-20 left-1/2 -translate-x-1/2 flex flex-col items-center">
                            <GearLight pos={nosePos} label="NOSE" />
                            <div className="mt-2 w-4 h-16 bg-slate-800 rounded-full border border-slate-600 relative overflow-hidden">
                                <motion.div
                                    className="w-full bg-slate-400 absolute bottom-0"
                                    animate={{ height: `${nosePos}%` }}
                                />
                            </div>
                            <span className="text-[10px] bg-slate-800 px-2 rounded text-slate-400 mt-1">
                                {noseDoor > 0 ? (noseDoor === 100 ? 'DOOR OPEN' : 'DOOR TRANSIT') : 'DOOR CLSD'}
                            </span>
                        </div>

                        {/* LEFT MAIN */}
                        <div className="absolute bottom-20 left-32 flex flex-col items-center">
                            <GearLight pos={leftPos} label="L MAIN" />
                            <div className="mt-2 w-4 h-16 bg-slate-800 rounded-full border border-slate-600 relative overflow-hidden">
                                <motion.div
                                    className="w-full bg-slate-400 absolute bottom-0"
                                    animate={{ height: `${leftPos}%` }}
                                />
                            </div>
                        </div>

                        {/* RIGHT MAIN */}
                        <div className="absolute bottom-20 right-32 flex flex-col items-center">
                            <GearLight pos={rightPos} label="R MAIN" />
                            <div className="mt-2 w-4 h-16 bg-slate-800 rounded-full border border-slate-600 relative overflow-hidden">
                                <motion.div
                                    className="w-full bg-slate-400 absolute bottom-0"
                                    animate={{ height: `${rightPos}%` }}
                                />
                            </div>
                        </div>

                        {/* Squat Switch Indicator */}
                        <div className="absolute top-4 right-4">
                            <div className={`px-4 py-2 rounded-lg border-2 font-black uppercase text-xs flex items-center gap-2 ${onGround ? 'border-orange-500 bg-orange-900/20 text-orange-500' : 'border-blue-500 bg-blue-900/20 text-blue-500'}`}>
                                {onGround ? 'WEIGHT ON WHEELS' : 'AIRBORNE'}
                            </div>
                        </div>

                    </div>

                    {/* Brake Temp Monitor */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-white font-bold mb-4 flex justify-between">
                            <span>Brake Temperatures (Carbon)</span>
                            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">OPT RANGE: 100-300°C</span>
                        </h3>
                        <div className="grid grid-cols-4 gap-4">
                            {brakeTemps.map((temp, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div className="h-32 w-4 bg-slate-800 rounded-full relative overflow-hidden mb-2">
                                        <motion.div
                                            className={`absolute bottom-0 w-full ${temp > 600 ? 'bg-red-500' : temp > 300 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                            animate={{ height: `${Math.min((temp / 900) * 100, 100)}%` }}
                                        />
                                    </div>
                                    <span className={`font-mono font-bold ${temp > 600 ? 'text-red-500 animate-pulse' : 'text-slate-300'}`}>
                                        {temp.toFixed(0)}°
                                    </span>
                                    <span className="text-[10px] text-slate-500">WHEEL {i + 1}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-center">
                            <button
                                onClick={applyBrakes}
                                className="px-6 py-3 bg-red-900/30 border border-red-500 text-red-400 rounded-xl font-bold active:scale-95 transition-transform hover:bg-red-900/50"
                            >
                                APPLY TOEBRAKES
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. Controls Panel (Right) */}
                <div className="bg-slate-800 border-l border-slate-700 p-6 space-y-8 h-fit lg:col-span-1">

                    {/* Gear Lever */}
                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-2xl relative">
                        <div className="text-zinc-500 text-xs font-black uppercase tracking-widest text-center mb-4">Landing Gear Lever</div>

                        <div className="w-16 h-48 mx-auto bg-black rounded-full relative border-2 border-zinc-700">
                            {/* Track */}
                            <div className="absolute top-4 bottom-4 left-1/2 -translate-x-1/2 w-2 bg-zinc-800 rounded-full"></div>

                            {/* Limits */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-zinc-600"></div>
                            <span className="absolute top-4 right-10 text-[10px] text-zinc-400 font-bold">UP</span>

                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-1 bg-zinc-600"></div>
                            <span className="absolute bottom-4 right-10 text-[10px] text-zinc-400 font-bold">DN</span>

                            {/* Handle */}
                            <motion.div
                                className="absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-xl border-4 border-slate-300 z-10 cursor-pointer flex items-center justify-center"
                                animate={{ top: leverPos === 'UP' ? '10%' : leverPos === 'OFF' ? '50%' : '85%' }}
                            >
                                <div className={`w-8 h-8 rounded-full border-2 ${leverPos === 'UP' && onGround ? 'bg-red-500/50 border-red-500 animate-pulse' : 'bg-slate-200 border-slate-400'}`}></div>
                            </motion.div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col gap-2 mt-6">
                            <button
                                onClick={() => !onGround ? setLeverPos('UP') : alert('GEAR LEVER LOCKED: SQUAT SWITCH ACTIVE')}
                                className={`py-3 rounded font-bold transition-all ${leverPos === 'UP' ? 'bg-blue-600 text-white shadow-lg' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                            >
                                UP
                            </button>
                            <button
                                onClick={() => setLeverPos('OFF')}
                                className={`py-3 rounded font-bold transition-all ${leverPos === 'OFF' ? 'bg-blue-600 text-white shadow-lg' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                            >
                                OFF
                            </button>
                            <button
                                onClick={() => setLeverPos('DOWN')}
                                className={`py-3 rounded font-bold transition-all ${leverPos === 'DOWN' ? 'bg-blue-600 text-white shadow-lg' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                            >
                                DOWN
                            </button>
                        </div>

                        {onGround && leverPos === 'DOWN' && (
                            <div className="mt-4 p-2 bg-red-500/10 border border-red-500/50 rounded text-[10px] text-red-400 text-center font-bold">
                                SQUAT SWITCH INTERLOCK ACTIVE
                            </div>
                        )}
                    </div>

                    {/* Auto Brake Selector */}
                    <div className="bg-zinc-800 p-6 rounded-xl border border-zinc-700">
                        <div className="text-zinc-400 text-xs font-black uppercase tracking-widest text-center mb-4">Auto Brake</div>
                        <div className="grid grid-cols-3 gap-2">
                            {['RTO', 'OFF', '1', '2', '3', 'MAX'].map(mode => (
                                <button
                                    key={mode}
                                    onClick={() => setAutoBrake(mode)}
                                    className={`py-2 rounded text-xs font-bold border transition-colors ${autoBrake === mode
                                        ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                                        : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Simulation Controls */}
                    <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="font-bold text-white text-sm">Weight on Wheels</span>
                            <div
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${onGround ? 'bg-emerald-500' : 'bg-slate-600'}`}
                                onClick={() => setOnGround(!onGround)}
                            >
                                <motion.div
                                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                                    animate={{ x: onGround ? 24 : 0 }}
                                />
                            </div>
                        </label>
                        <p className="text-[10px] text-slate-400 mt-2">
                            Simulates Air/Ground Logic sensors on main gear struts. Critical for Thrust Reverser and Ground Spoiler deployment.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

const GearLight: React.FC<{ pos: number; label: string }> = ({ pos, label }) => {
    // Logic:
    // DOWN & LOCKED (100) = GREEN
    // TRANSIT (1-99) = RED
    // UP & LOCKED (0) = OFF (Dark Cockpit)

    let color = 'bg-slate-900 border-slate-700';
    let glow = '';

    if (pos === 100) {
        color = 'bg-emerald-500 border-emerald-400';
        glow = 'shadow-[0_0_15px_rgba(16,185,129,0.5)]';
    } else if (pos > 0 && pos < 100) {
        color = 'bg-red-500 border-red-400';
        glow = 'shadow-[0_0_15px_rgba(239,68,68,0.5)]';
    }

    return (
        <div className="flex flex-col items-center">
            <div className={`w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[25px] border-b-current transition-all duration-300 ${color === 'bg-slate-900 border-slate-700' ? 'text-slate-900' : pos === 100 ? 'text-emerald-500' : 'text-red-500'} drop-shadow-lg`}></div>
            <span className="text-[10px] font-bold text-slate-500 mt-1">{label}</span>
        </div>
    );
};

export default LandingGearSystem;
