import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Volume2, Mountain, Plane, TrendingDown, Settings, ChevronDown, AlertOctagon, ShieldCheck, Database, Map, Radio, Eye } from 'lucide-react';

interface GPWSMode {
    id: number;
    name: string;
    description: string;
    sensorBasis: string;
    warning: string;
    color: string;
}

const GPWS_MODES: GPWSMode[] = [
    { id: 1, name: 'Excessive Descent Rate', sensorBasis: 'Radio Alt & Baro Sink Rate', description: 'Sinking too fast relative to ground clearance', warning: 'SINK RATE / WHOOP WHOOP PULL UP', color: 'red' },
    { id: 2, name: 'Excessive Terrain Closure', sensorBasis: 'Radio Alt Rate of Change', description: 'Rising terrain ahead closing rapidly with flight path', warning: 'TERRAIN, TERRAIN / WHOOP WHOOP PULL UP', color: 'red' },
    { id: 3, name: 'Altitude Loss After T/O or Go-Around', sensorBasis: 'Barometric Alt & Gear/Flap logic', description: 'Barometric height loss before reaching 700 ft AGL', warning: "DON'T SINK, DON'T SINK", color: 'amber' },
    { id: 4, name: 'Unsafe Terrain Clearance (Not in Landing Config)', sensorBasis: 'Radio Alt, Airspeed, Gear & Flap levers', description: 'Too close to ground without gear down or flaps extended', warning: 'TOO LOW GEAR / TOO LOW FLAPS / TOO LOW TERRAIN', color: 'amber' },
    { id: 5, name: 'Excessive Glideslope Deviation', sensorBasis: 'ILS Glideslope Receiver & Radio Alt', description: 'More than 1.3 dots below glideslope during approach', warning: 'GLIDESLOPE, GLIDESLOPE', color: 'amber' },
    { id: 6, name: 'Advisory Callouts & Excessive Bank Angle', sensorBasis: 'Radio Alt stepped callouts & Roll Angle', description: 'Bank angle exceeds 35°-40°, plus 2500, 1000, 500, Minimums', warning: 'BANK ANGLE / MINIMUMS', color: 'sky' },
    { id: 7, name: 'Windshear Alerting', sensorBasis: 'ADC vs Accelerometers (Energy rate)', description: 'Severe decreasing headwind or severe downdraft detected', warning: 'WINDSHEAR, WINDSHEAR, WINDSHEAR', color: 'red' },
];

const GPWSSystem: React.FC = () => {
    const [selectedMode, setSelectedMode] = useState<GPWSMode>(GPWS_MODES[0]);
    const [activeSystemType, setActiveSystemType] = useState<'CLASSIC' | 'EGPWS'>('EGPWS');
    
    // Flight Parameters
    const [agl, setAgl] = useState(1200);
    const [descentRate, setDescentRate] = useState(800);
    const [gearDown, setGearDown] = useState(true);
    const [flapsExtended, setFlapsExtended] = useState(true);
    const [glidePathDeviation, setGlidePathDeviation] = useState(0.2); // dots below
    
    // EGPWS Look-Ahead Parameters
    const [terrainDistanceNm, setTerrainDistanceNm] = useState(8); // NM ahead
    const [terrainHeightRelFt, setTerrainHeightRelFt] = useState(1500); // Relative height of terrain ahead (+1500 ft above aircraft)
    const [groundspeedKt, setGroundspeedKt] = useState(240); // kt

    // Time to terrain impact: (Dist_NM / GS_kt) * 3600 seconds
    const timeToTerrainSec = Math.round((terrainDistanceNm / groundspeedKt) * 3600);

    // Derived Warnings
    const [activeWarning, setActiveWarning] = useState<string | null>(null);
    const [egpwsAlert, setEgpwsAlert] = useState<'CLEAR' | 'CAUTION' | 'WARNING'>('CLEAR');

    useEffect(() => {
        let warning: string | null = null;
        let egpws: 'CLEAR' | 'CAUTION' | 'WARNING' = 'CLEAR';

        // 1. Classic GPWS Mode Logic
        if (selectedMode.id === 1) {
            if (descentRate > 1500 && agl < 2500) warning = 'SINK RATE';
            if (descentRate > 3500 && agl < 1500) warning = 'WHOOP WHOOP PULL UP';
        } else if (selectedMode.id === 2) {
            if (descentRate > 2000 && agl < 1800) warning = 'TERRAIN, TERRAIN';
            if (descentRate > 3000 && agl < 1000) warning = 'WHOOP WHOOP PULL UP';
        } else if (selectedMode.id === 4) {
            if (agl < 500 && !gearDown) warning = 'TOO LOW GEAR';
            else if (agl < 300 && !flapsExtended) warning = 'TOO LOW FLAPS';
            else if (agl < 200) warning = 'TOO LOW TERRAIN';
        } else if (selectedMode.id === 5) {
            if (glidePathDeviation >= 1.3 && agl < 1000) warning = 'GLIDESLOPE';
        }

        // 2. EGPWS Look-Ahead Terrain Logic
        if (activeSystemType === 'EGPWS' && terrainHeightRelFt > 0) {
            if (timeToTerrainSec <= 30) {
                egpws = 'WARNING';
                warning = 'TERRAIN, TERRAIN, PULL UP';
            } else if (timeToTerrainSec <= 60) {
                egpws = 'CAUTION';
                warning = warning || 'TERRAIN AHEAD';
            }
        }

        setActiveWarning(warning);
        setEgpwsAlert(egpws);
    }, [agl, descentRate, gearDown, flapsExtended, glidePathDeviation, selectedMode, activeSystemType, terrainDistanceNm, terrainHeightRelFt, groundspeedKt, timeToTerrainSec]);

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-10">
                <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-widest mb-2">
                    <span>AGK 022</span>
                    <span>•</span>
                    <span>Terrain Awareness & Warning Systems</span>
                </div>
                <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                    <AlertOctagon className="text-red-400" />
                    GPWS & Enhanced Look-Ahead Terrain (EGPWS / TAWS)
                </h1>
                <p className="text-slate-400 max-w-3xl leading-relaxed text-sm">
                    Classic GPWS uses downward-directed radio altimeters to alert on Modes 1&ndash;7.
                    <strong className="text-white"> Enhanced GPWS (EGPWS / TAWS Class A)</strong> overcomes the radio altimeter's "blind look" by coupling
                    <strong className="text-white"> GPS/FMS positioning</strong> with a high-resolution <strong className="text-white">Digital Terrain Elevation Database (DTED)</strong>,
                    providing forward-looking predictive warnings independent of aircraft descent rate.
                </p>
            </div>

            {/* Architecture Selector */}
            <div className="flex gap-3 mb-8 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 w-fit">
                <button
                    onClick={() => setActiveSystemType('EGPWS')}
                    className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                        activeSystemType === 'EGPWS' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-slate-400 hover:text-white'
                    }`}
                >
                    <Database size={14} />
                    <span>EGPWS Look-Ahead (Database + GPS)</span>
                </button>
                <button
                    onClick={() => setActiveSystemType('CLASSIC')}
                    className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                        activeSystemType === 'CLASSIC' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                    }`}
                >
                    <Radio size={14} />
                    <span>Classic GPWS (Modes 1&ndash;7 Only)</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Simulator Inputs */}
                <div className="lg:col-span-1 space-y-6">
                    {/* EGPWS Look-Ahead Controls */}
                    {activeSystemType === 'EGPWS' && (
                        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-5">
                            <h3 className="text-white font-bold flex items-center gap-2 text-xs uppercase tracking-wider">
                                <Eye className="text-emerald-400 w-4 h-4" />
                                Forward Terrain Parameters
                            </h3>

                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Terrain Distance Ahead</span>
                                    <span className="text-white font-mono font-bold">{terrainDistanceNm} NM ({timeToTerrainSec}s CPA)</span>
                                </label>
                                <input
                                    type="range" min="1" max="15" step="0.5"
                                    value={terrainDistanceNm}
                                    onChange={(e) => setTerrainDistanceNm(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                                />
                                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                                    <span className="text-red-400">2 NM (Warning: ~30s)</span>
                                    <span className="text-amber-400">4 NM (Caution: ~60s)</span>
                                    <span>15 NM</span>
                                </div>
                            </div>

                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Relative Terrain Peak Height</span>
                                    <span className={`font-mono font-bold ${terrainHeightRelFt > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                        {terrainHeightRelFt > 0 ? `+${terrainHeightRelFt} FT (Above)` : `${terrainHeightRelFt} FT (Below)`}
                                    </span>
                                </label>
                                <input
                                    type="range" min="-2500" max="3000" step="100"
                                    value={terrainHeightRelFt}
                                    onChange={(e) => setTerrainHeightRelFt(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                                    <span>−2,500' (Safe)</span>
                                    <span>0' (Level)</span>
                                    <span className="text-red-400">+3,000' (Obstacle)</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Classic Aircraft Parameters */}
                    <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-5">
                        <h3 className="text-white font-bold flex items-center gap-2 text-xs uppercase tracking-wider">
                            <Settings className="text-slate-400 w-4 h-4" />
                            Aircraft Flight State
                        </h3>

                        <div>
                            <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                <span>Radio Height (AGL)</span>
                                <span className="text-white font-mono font-bold">{agl} FT</span>
                            </label>
                            <input
                                type="range" min="50" max="2500" step="50"
                                value={agl}
                                onChange={(e) => setAgl(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                <span>Descent Rate (Baro / VSI)</span>
                                <span className={`font-mono font-bold ${descentRate > 2000 ? 'text-red-400' : 'text-sky-400'}`}>
                                    {descentRate} FPM
                                </span>
                            </label>
                            <input
                                type="range" min="0" max="5000" step="100"
                                value={descentRate}
                                onChange={(e) => setDescentRate(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                            />
                        </div>

                        {/* Mode 4 Landing Configuration Toggles */}
                        <div className="pt-2 border-t border-slate-800 space-y-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Landing Config (Mode 4)</span>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setGearDown(!gearDown)}
                                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                                        gearDown ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-red-500/20 border-red-500 text-red-300'
                                    }`}
                                >
                                    Gear: {gearDown ? 'DOWN' : 'UP'}
                                </button>
                                <button
                                    onClick={() => setFlapsExtended(!flapsExtended)}
                                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                                        flapsExtended ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-red-500/20 border-red-500 text-red-300'
                                    }`}
                                >
                                    Flaps: {flapsExtended ? 'LANDING' : 'CLEAN'}
                                </button>
                            </div>
                        </div>

                        {/* Mode 5 Glideslope */}
                        <div className="pt-2 border-t border-slate-800">
                            <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-1">
                                <span>Glideslope Deviation (Mode 5)</span>
                                <span className="font-mono text-amber-400 font-bold">{glidePathDeviation.toFixed(1)} dots below</span>
                            </label>
                            <input
                                type="range" min="0" max="3" step="0.1"
                                value={glidePathDeviation}
                                onChange={(e) => setGlidePathDeviation(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                            <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                                <span>On Slope</span>
                                <span>Alert &ge; 1.3 dots below</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Display Canvas & Radar/EGPWS Map */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Annunciator Warning Box */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col items-center justify-center min-h-[140px]">
                        <AnimatePresence mode="wait">
                            {activeWarning ? (
                                <motion.div
                                    key={activeWarning}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="text-center space-y-2"
                                >
                                    <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-red-400">
                                        <AlertTriangle className="animate-bounce" size={16} />
                                        <span>Aural Warning Active</span>
                                    </div>
                                    <div className="text-3xl font-black font-mono tracking-wider text-red-500 animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">
                                        "{activeWarning}"
                                    </div>
                                    <div className="text-[11px] text-slate-400">
                                        Execute immediate terrain escape maneuver: Maximum thrust, wings level, pitch to pitch limit indicator.
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="text-center text-slate-500 text-xs font-mono">
                                    <ShieldCheck size={24} className="text-emerald-500/60 mx-auto mb-1" />
                                    <span>TERRAIN SYSTEM NORMAL &ndash; NO ACTIVE WARNINGS</span>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Navigation Display (ND) Terrain Display / Cross-Section */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-6">
                            <span className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <Map className="w-4 h-4 text-emerald-400" />
                                {activeSystemType === 'EGPWS' ? 'EFIS ND Look-Ahead Terrain Elevation Display' : 'Classic Radio Altimeter Profile'}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                                {activeSystemType === 'EGPWS' ? 'DTED Database Active' : 'Downward Cone Only'}
                            </span>
                        </div>

                        {activeSystemType === 'EGPWS' ? (
                            /* EGPWS Look-Ahead Synthetic Canvas */
                            <div className="space-y-4">
                                <div className="h-60 bg-slate-950 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col justify-end p-4">
                                    {/* Terrain Look-Ahead Warning Ribbons */}
                                    {egpwsAlert === 'WARNING' && (
                                        <div className="absolute inset-x-0 top-0 h-8 bg-red-600/30 border-b-2 border-red-500 text-red-300 font-mono text-[10px] font-black flex items-center justify-center tracking-widest animate-pulse">
                                            TERRAIN LOOK-AHEAD WARNING (IMPACT IN {timeToTerrainSec}s)
                                        </div>
                                    )}
                                    {egpwsAlert === 'CAUTION' && (
                                        <div className="absolute inset-x-0 top-0 h-8 bg-amber-600/30 border-b-2 border-amber-500 text-amber-300 font-mono text-[10px] font-black flex items-center justify-center tracking-widest">
                                            TERRAIN LOOK-AHEAD CAUTION (IMPACT IN {timeToTerrainSec}s)
                                        </div>
                                    )}

                                    {/* Projected Flight Path Line */}
                                    <div className="absolute left-8 top-1/2 right-12 border-t-2 border-dashed border-sky-400/80 flex items-center justify-between text-[9px] font-mono text-sky-300">
                                        <div className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded">
                                            <Plane size={12} className="rotate-90" />
                                            <span>Own Aircraft ({groundspeedKt} KT GS)</span>
                                        </div>
                                        <span className="bg-slate-900 px-1 rounded">Projected Trajectory</span>
                                    </div>

                                    {/* Approaching Rising Mountain Ridge */}
                                    <div
                                        className="absolute right-0 bottom-0 w-64 h-44 transition-all duration-300 flex flex-col justify-end"
                                        style={{ transform: `translateX(${(terrainDistanceNm - 2) * 15}px)` }}
                                    >
                                        <div className={`w-full h-full rounded-tl-[60px] border-l-4 transition-colors ${
                                            terrainHeightRelFt > 1000
                                                ? 'bg-red-600/40 border-red-500'
                                                : terrainHeightRelFt > 0
                                                ? 'bg-amber-500/40 border-amber-400'
                                                : 'bg-emerald-600/30 border-emerald-500'
                                        }`}>
                                            <div className="p-3 text-[10px] font-bold font-mono text-white">
                                                Terrain Peak: {terrainHeightRelFt > 0 ? `+${terrainHeightRelFt} FT` : `${terrainHeightRelFt} FT`}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* EGPWS ND Color Coding Standard Table */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
                                    <div className="p-2 bg-slate-950 rounded-xl border border-red-500/40 text-center">
                                        <div className="w-3 h-3 bg-red-500 mx-auto rounded-sm mb-1" />
                                        <div className="text-[10px] font-bold text-red-400">Solid Red</div>
                                        <div className="text-[9px] text-slate-500">&gt; 2,000' Above Aircraft</div>
                                    </div>
                                    <div className="p-2 bg-slate-950 rounded-xl border border-amber-500/40 text-center">
                                        <div className="w-3 h-3 bg-amber-400 mx-auto rounded-sm mb-1" />
                                        <div className="text-[10px] font-bold text-amber-300">Amber Dots</div>
                                        <div className="text-[9px] text-slate-500">−500' to +1,000' Ahead</div>
                                    </div>
                                    <div className="p-2 bg-slate-950 rounded-xl border border-emerald-500/40 text-center">
                                        <div className="w-3 h-3 bg-emerald-500 mx-auto rounded-sm mb-1" />
                                        <div className="text-[10px] font-bold text-emerald-400">Green Dots</div>
                                        <div className="text-[9px] text-slate-500">1,000' to 2,000' Below</div>
                                    </div>
                                    <div className="p-2 bg-slate-950 rounded-xl border border-white/5 text-center">
                                        <div className="w-3 h-3 bg-black border border-slate-700 mx-auto rounded-sm mb-1" />
                                        <div className="text-[10px] font-bold text-slate-400">Black Screen</div>
                                        <div className="text-[9px] text-slate-500">&gt; 2,000' Clear Below</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Classic GPWS Downward Cone Limitation View */
                            <div className="space-y-4">
                                <div className="h-60 bg-slate-950 rounded-2xl border border-white/5 relative p-4 flex flex-col justify-between">
                                    <div className="text-xs text-amber-400 font-bold">
                                        Limitation of Classic GPWS: The Radio Altimeter looks strictly downward!
                                    </div>
                                    <div className="relative h-32 flex items-center justify-center">
                                        {/* Aircraft */}
                                        <div className="absolute top-2 flex flex-col items-center">
                                            <Plane size={24} className="text-white rotate-90" />
                                            {/* Downward Radar Cone */}
                                            <div className="w-24 h-24 border-l border-r border-dashed border-emerald-400/60 bg-emerald-500/5 mt-1" />
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        If flying level toward a sheer mountain wall, the downward radio altimeter reads normal clearance until microseconds before impact. EGPWS look-ahead solves this disaster pathway!
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Classic GPWS Modes 1 to 7 Selector & Reference */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4">
                            All 7 Classic GPWS Modes (ICAO Annex 6)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {GPWS_MODES.map((mode) => (
                                <div
                                    key={mode.id}
                                    onClick={() => setSelectedMode(mode)}
                                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                                        selectedMode.id === mode.id
                                            ? 'bg-slate-800 border-red-500/60 shadow-md'
                                            : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                                    }`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[11px] font-bold text-white">Mode {mode.id}: {mode.name}</span>
                                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                                            mode.color === 'red' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                                        }`}>
                                            {mode.warning.split('/')[0]}
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-slate-400 leading-tight">{mode.description}</div>
                                    <div className="text-[9px] text-slate-500 font-mono mt-1">Sensor: {mode.sensorBasis}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GPWSSystem;
