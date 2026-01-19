import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Volume2, Mountain, Plane, TrendingDown, Settings, ChevronDown, AlertOctagon } from 'lucide-react';

interface GPWSMode {
    id: number;
    name: string;
    description: string;
    warning: string;
    color: string;
}

const GPWS_MODES: GPWSMode[] = [
    { id: 1, name: 'Excessive Descent Rate', description: 'Sinking too fast relative to terrain', warning: 'SINK RATE / WHOOP WHOOP PULL UP', color: 'red' },
    { id: 2, name: 'Terrain Closure', description: 'Rising terrain ahead (closure rate)', warning: 'TERRAIN / WHOOP WHOOP PULL UP', color: 'red' },
    { id: 3, name: 'Altitude Loss After T/O', description: 'Height loss after takeoff or go-around', warning: "DON'T SINK", color: 'amber' },
    { id: 4, name: 'Unsafe Terrain Clearance', description: 'Too close to ground, not in landing config', warning: 'TOO LOW GEAR / TOO LOW FLAPS / TOO LOW TERRAIN', color: 'amber' },
    { id: 5, name: 'Glideslope Deviation', description: 'Below glideslope during ILS approach', warning: 'GLIDESLOPE', color: 'amber' },
    { id: 6, name: 'Advisory Callouts', description: 'Altitude calls and bank angle warnings', warning: 'MINIMUMS / BANK ANGLE', color: 'white' },
    { id: 7, name: 'Windshear', description: 'Detected windshear condition', warning: 'CAUTION WINDSHEAR / WINDSHEAR', color: 'red' },
];

const GPWSSystem: React.FC = () => {
    const [selectedMode, setSelectedMode] = useState<GPWSMode | null>(null);
    const [agl, setAgl] = useState(1500);
    const [descentRate, setDescentRate] = useState(0);
    const [gearDown, setGearDown] = useState(true);
    const [flapsExtended, setFlapsExtended] = useState(true);
    const [glidePathDeviation, setGlidePathDeviation] = useState(0);
    const [activeWarning, setActiveWarning] = useState<string | null>(null);

    // Simulate GPWS logic
    useEffect(() => {
        let warning: string | null = null;

        // Mode 1: Excessive descent rate
        if (descentRate > 2000 && agl < 2500) {
            warning = 'SINK RATE';
            if (descentRate > 4000 && agl < 1000) {
                warning = 'WHOOP WHOOP PULL UP';
            }
        }

        // Mode 4: Too low terrain clearance
        if (agl < 500 && (!gearDown || !flapsExtended)) {
            warning = !gearDown ? 'TOO LOW GEAR' : 'TOO LOW FLAPS';
        }

        // Mode 5: Glideslope
        if (glidePathDeviation > 1 && agl < 1000) {
            warning = 'GLIDESLOPE';
        }

        setActiveWarning(warning);
    }, [agl, descentRate, gearDown, flapsExtended, glidePathDeviation]);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-white mb-2">GPWS / EGPWS</h1>
                <p className="text-slate-400">Ground Proximity Warning System - Modes 1-7 explained and simulated.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Mode Selector */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <AlertTriangle className="text-amber-400" />
                        GPWS Modes
                    </h2>

                    <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                        {GPWS_MODES.map((mode) => (
                            <motion.div
                                key={mode.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedMode(mode)}
                                className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedMode?.id === mode.id ? `bg-${mode.color}-500/20 border-${mode.color}-500` : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-sm font-bold text-slate-400">Mode {mode.id}</div>
                                        <div className="text-white font-bold">{mode.name}</div>
                                        <div className="text-xs text-slate-500 mt-1">{mode.description}</div>
                                    </div>
                                    <div className={`text-xs px-2 py-1 rounded font-mono font-bold ${mode.color === 'red' ? 'bg-red-500/20 text-red-400' : mode.color === 'amber' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-600 text-white'}`}>
                                        {mode.color.toUpperCase()}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Selected Mode Detail */}
                    <AnimatePresence>
                        {selectedMode && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className={`mt-4 p-4 rounded-xl border ${selectedMode.color === 'red' ? 'bg-red-500/10 border-red-500/50' : 'bg-amber-500/10 border-amber-500/50'}`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Volume2 className={selectedMode.color === 'red' ? 'text-red-400' : 'text-amber-400'} />
                                    <span className="text-white font-bold">Aural Warning:</span>
                                </div>
                                <div className={`font-mono text-lg font-bold ${selectedMode.color === 'red' ? 'text-red-400' : 'text-amber-400'}`}>
                                    "{selectedMode.warning}"
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Interactive Simulator */}
                <div className="space-y-6">
                    {/* Warning Display */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 h-32 flex items-center justify-center relative overflow-hidden">
                        <AnimatePresence>
                            {activeWarning ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="text-center"
                                >
                                    <motion.div
                                        animate={{ opacity: [1, 0.3, 1] }}
                                        transition={{ repeat: Infinity, duration: 0.5 }}
                                        className="text-2xl font-mono font-black text-red-500"
                                    >
                                        {activeWarning}
                                    </motion.div>
                                    <div className="text-xs text-slate-500 mt-2">GPWS Warning Active</div>
                                </motion.div>
                            ) : (
                                <div className="text-slate-600 text-sm">No Active Warnings</div>
                            )}
                        </AnimatePresence>
                        <div className="absolute top-2 right-2">
                            <AlertOctagon className={`w-6 h-6 ${activeWarning ? 'text-red-500' : 'text-slate-700'}`} />
                        </div>
                    </div>

                    {/* Altitude AGL */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                        <label className="text-sm font-bold text-slate-400 uppercase mb-3 block flex items-center gap-2">
                            <Mountain className="w-4 h-4" /> Height AGL
                        </label>
                        <input
                            type="range"
                            min={0}
                            max={2500}
                            value={agl}
                            onChange={(e) => setAgl(Number(e.target.value))}
                            className="w-full accent-emerald-500"
                        />
                        <div className="flex justify-between text-sm mt-2">
                            <span className="text-slate-500">0 ft</span>
                            <span className="text-emerald-400 font-mono font-bold">{agl} ft</span>
                            <span className="text-slate-500">2500 ft</span>
                        </div>
                    </div>

                    {/* Descent Rate */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                        <label className="text-sm font-bold text-slate-400 uppercase mb-3 block flex items-center gap-2">
                            <TrendingDown className="w-4 h-4" /> Descent Rate
                        </label>
                        <input
                            type="range"
                            min={0}
                            max={6000}
                            step={100}
                            value={descentRate}
                            onChange={(e) => setDescentRate(Number(e.target.value))}
                            className="w-full accent-red-500"
                        />
                        <div className="flex justify-between text-sm mt-2">
                            <span className="text-slate-500">0 fpm</span>
                            <span className={`font-mono font-bold ${descentRate > 2000 ? 'text-red-400' : 'text-sky-400'}`}>{descentRate} fpm</span>
                            <span className="text-slate-500">6000 fpm</span>
                        </div>
                    </div>

                    {/* Landing Config Toggles */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                        <label className="text-sm font-bold text-slate-400 uppercase mb-3 block flex items-center gap-2">
                            <Settings className="w-4 h-4" /> Landing Configuration (Mode 4)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setGearDown(!gearDown)}
                                className={`py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${gearDown ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500' : 'bg-red-500/20 text-red-400 border border-red-500'}`}
                            >
                                <ChevronDown className={`w-4 h-4 ${gearDown ? '' : 'rotate-180'}`} />
                                Gear {gearDown ? 'DOWN' : 'UP'}
                            </button>
                            <button
                                onClick={() => setFlapsExtended(!flapsExtended)}
                                className={`py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${flapsExtended ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500' : 'bg-red-500/20 text-red-400 border border-red-500'}`}
                            >
                                Flaps {flapsExtended ? 'EXTENDED' : 'RETRACTED'}
                            </button>
                        </div>
                    </div>

                    {/* Glideslope Deviation */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                        <label className="text-sm font-bold text-slate-400 uppercase mb-3 block">
                            Glideslope Deviation (Mode 5)
                        </label>
                        <input
                            type="range"
                            min={0}
                            max={3}
                            step={0.1}
                            value={glidePathDeviation}
                            onChange={(e) => setGlidePathDeviation(Number(e.target.value))}
                            className="w-full accent-amber-500"
                        />
                        <div className="flex justify-between text-sm mt-2">
                            <span className="text-slate-500">On G/S</span>
                            <span className={`font-mono font-bold ${glidePathDeviation > 1 ? 'text-amber-400' : 'text-emerald-400'}`}>{glidePathDeviation.toFixed(1)} dots below</span>
                            <span className="text-slate-500">3 dots</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* EGPWS Enhancement Note */}
            <div className="mt-8 bg-sky-500/10 border border-sky-500/30 rounded-xl p-5">
                <h3 className="text-sky-400 font-bold mb-3 flex items-center gap-2">
                    <Plane className="w-5 h-5" />
                    EGPWS (Enhanced GPWS)
                </h3>
                <p className="text-slate-300 text-sm">
                    EGPWS adds a <strong>terrain database</strong> and <strong>GPS input</strong> for predictive warnings.
                    It provides visual terrain display on the ND, showing terrain as <strong className="text-red-400">RED</strong> (impact imminent),
                    <strong className="text-amber-400"> AMBER</strong> (caution), or <strong className="text-emerald-400"> GREEN</strong> (safe clearance).
                </p>
                <p className="text-slate-500 text-xs mt-3">
                    EGPWS can warn of terrain threats ahead of time, even if not descending rapidly ("Look Ahead" function).
                </p>
            </div>
        </div>
    );
};

export default GPWSSystem;
