import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mountain,
    AlertTriangle,
    Layers,
    Gauge,
    ArrowUpRight,
    CheckCircle2,
    Thermometer,
    Compass,
    Plane
} from 'lucide-react';
import {
    STANDARD_PRESSURE_HPA,
    BARO_LAPSE_LOWER_TROPO_RULE_OF_THUMB,
    TEMP_ERROR_FACTOR_FT_PER_1000FT_PER_DEG,
    DENSITY_ALT_FACTOR_FT_PER_DEG
} from './altimetryCalculations';

export type ReminderTab = 'datums' | 'high-to-low' | 'subscale-drill';

interface AltimeterQuickReminderCardProps {
    initialTab?: ReminderTab;
    className?: string;
    onExploreFullLab?: () => void;
}

export const AltimeterQuickReminderCard: React.FC<AltimeterQuickReminderCardProps> = ({
    initialTab = 'datums',
    className = '',
    onExploreFullLab
}) => {
    const [activeTab, setActiveTab] = useState<ReminderTab>(initialTab);

    // Tab 1 State: Active Datum Highlight
    const [selectedDatum, setSelectedDatum] = useState<'HEIGHT' | 'ALTITUDE' | 'PRESSURE_ALT' | 'FL' | 'DENSITY_ALT'>('ALTITUDE');

    // Tab 2 State: Temperature & Pressure Deviation Slider
    const [tempDev, setTempDev] = useState<number>(-15); // Cold by default to show danger!
    const [pressureDevHpa, setPressureDevHpa] = useState<number>(-10);

    // Rule of thumb calculation:
    // Indicated = 5000 ft fixed
    const baseIndicatedFt = 5000;
    // Temp error = (5000 / 1000) * 4 * tempDev = 5 * 4 * (-15) = -300 ft
    const tempErrorFt = (baseIndicatedFt / 1000) * TEMP_ERROR_FACTOR_FT_PER_1000FT_PER_DEG * tempDev;
    // Pressure error = pressureDev * 30 ft/hPa = -10 * 30 = -300 ft
    const pressErrorFt = pressureDevHpa * BARO_LAPSE_LOWER_TROPO_RULE_OF_THUMB;
    const trueAltitudeFt = baseIndicatedFt + tempErrorFt + pressErrorFt;
    const mountainPeakFt = 4800;
    const clearanceFt = trueAltitudeFt - mountainPeakFt;
    const isCfitDanger = clearanceFt < 200;

    // Tab 3 State: Subscale Drill
    const [drillQnh] = useState<number>(1002);
    const [drillSubscale, setDrillSubscale] = useState<number>(1013);
    const drillErrorFt = (drillSubscale - drillQnh) * BARO_LAPSE_LOWER_TROPO_RULE_OF_THUMB;

    return (
        <div className={`w-full max-w-xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 md:p-6 shadow-2xl overflow-hidden ${className}`}>
            {/* Header with Quick Timer Tag (< 60s) */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <Gauge size={18} />
                    </div>
                    <div>
                        <h3 className="text-white font-black text-base flex items-center gap-2">
                            Altimetry Quick Reminder
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                &lt; 60s Review
                            </span>
                        </h3>
                        <p className="text-[11px] text-slate-400">Essential rules, vertical datums, and high-stakes error math</p>
                    </div>
                </div>

                {onExploreFullLab && (
                    <button
                        onClick={onExploreFullLab}
                        className="hidden sm:flex items-center gap-1 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors"
                    >
                        Full Lab <ArrowUpRight size={14} />
                    </button>
                )}
            </div>

            {/* Quick Segmented Nav */}
            <div className="grid grid-cols-3 gap-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-800 mb-5">
                {[
                    { id: 'datums', label: '5 Datums', icon: Layers },
                    { id: 'high-to-low', label: 'High to Low', icon: AlertTriangle },
                    { id: 'subscale-drill', label: 'Subscale Math', icon: Compass }
                ].map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as ReminderTab)}
                            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${isActive
                                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                }`}
                        >
                            <Icon size={14} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* TAB CONTENT */}
            <AnimatePresence mode="wait">
                {/* --- TAB 1: 5 DATUMS DECODED --- */}
                {activeTab === 'datums' && (
                    <motion.div
                        key="datums"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="space-y-4"
                    >
                        {/* Interactive Vertical Ladder */}
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                            {[
                                {
                                    id: 'HEIGHT',
                                    short: 'Height',
                                    datum: 'QFE',
                                    ref: 'Aerodrome Ground (AGL)',
                                    color: 'border-amber-500 text-amber-400 bg-amber-500/10',
                                    pill: 'Reads 0 on Touchdown'
                                },
                                {
                                    id: 'ALTITUDE',
                                    short: 'Altitude',
                                    datum: 'QNH',
                                    ref: 'Mean Sea Level (AMSL)',
                                    color: 'border-emerald-500 text-emerald-400 bg-emerald-500/10',
                                    pill: 'Terrain Clearance ≤ TA'
                                },
                                {
                                    id: 'PRESSURE_ALT',
                                    short: 'PA',
                                    datum: '1013.25',
                                    ref: 'Standard Isobar',
                                    color: 'border-sky-500 text-sky-400 bg-sky-500/10',
                                    pill: 'Base for Perf & DA'
                                },
                                {
                                    id: 'FL',
                                    short: 'Flight Level',
                                    datum: 'SPS (1013)',
                                    ref: 'PA in 100s of feet',
                                    color: 'border-indigo-500 text-indigo-400 bg-indigo-500/10',
                                    pill: 'Cruise ≥ Transition Level'
                                },
                                {
                                    id: 'DENSITY_ALT',
                                    short: 'Density Alt',
                                    datum: 'PA ± 120ΔT',
                                    ref: 'Perf Equivalent ISA',
                                    color: 'border-rose-500 text-rose-400 bg-rose-500/10',
                                    pill: 'Hot/High Engine Loss'
                                }
                            ].map(item => {
                                const isSelected = selectedDatum === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setSelectedDatum(item.id as any)}
                                        className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${isSelected
                                            ? `${item.color} border-current shadow-lg scale-[1.02]`
                                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                                            }`}
                                    >
                                        <div>
                                            <span className="text-[10px] font-mono font-black uppercase tracking-wider block opacity-70">
                                                {item.datum}
                                            </span>
                                            <span className="text-xs font-bold text-white block mt-0.5">
                                                {item.short}
                                            </span>
                                        </div>
                                        <span className="text-[9px] text-slate-400 mt-2 block leading-tight">
                                            {item.pill}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Datum Detail Box */}
                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                            {selectedDatum === 'HEIGHT' && (
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-amber-400 font-bold text-xs uppercase">
                                        <span>HEIGHT (AGL) • Subscale: QFE</span>
                                        <span className="font-mono">Circuit & CAT II/III</span>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed">
                                        Vertical distance measured above the <strong>aerodrome elevation</strong> (or runway threshold). On the ground at the airport, the altimeter reads exactly <strong>0 FT</strong>.
                                    </p>
                                </div>
                            )}
                            {selectedDatum === 'ALTITUDE' && (
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-emerald-400 font-bold text-xs uppercase">
                                        <span>ALTITUDE (AMSL) • Subscale: QNH</span>
                                        <span className="font-mono">Terrain Clearance</span>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed">
                                        Vertical distance measured above <strong>Mean Sea Level (MSL)</strong>. On the ground at the airport, the altimeter reads the <strong>official aerodrome elevation</strong>. Used at or below Transition Altitude.
                                    </p>
                                </div>
                            )}
                            {selectedDatum === 'PRESSURE_ALT' && (
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-sky-400 font-bold text-xs uppercase">
                                        <span>PRESSURE ALTITUDE • Subscale: 1013.25 hPa (29.92 inHg)</span>
                                        <span className="font-mono">PA = Alt + (1013 - QNH) × 30</span>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed">
                                        Altitude measured above the theoretical standard pressure isobar of 1013.25 hPa. Foundation for aircraft performance tables and Density Altitude calculation.
                                    </p>
                                </div>
                            )}
                            {selectedDatum === 'FL' && (
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-indigo-400 font-bold text-xs uppercase">
                                        <span>FLIGHT LEVELS (FL) • Subscale: SPS (1013.25)</span>
                                        <span className="font-mono">FL = PA / 100</span>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed">
                                        Surfaces of constant atmospheric pressure separated by nominal pressure intervals. Used for en-route cruising above the Transition Level to guarantee safe vertical separation regardless of local QNH.
                                    </p>
                                </div>
                            )}
                            {selectedDatum === 'DENSITY_ALT' && (
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-rose-400 font-bold text-xs uppercase">
                                        <span>DENSITY ALTITUDE • Performance Metric</span>
                                        <span className="font-mono">DA = PA ± (120 ft × ΔISA)</span>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed">
                                        Pressure Altitude corrected for non-standard temperature. High temperature reduces air density $\to$ aircraft performs as if it is at a much higher altitude (longer takeoff roll, degraded climb).
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* --- TAB 2: HIGH TO LOW LOOK OUT BELOW --- */}
                {activeTab === 'high-to-low' && (
                    <motion.div
                        key="high-to-low"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="space-y-4"
                    >
                        {/* Interactive Controls */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                            <div>
                                <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
                                    <span className="flex items-center gap-1">
                                        <Thermometer size={12} className="text-orange-400" /> ISA Deviation
                                    </span>
                                    <span className={`font-mono ${tempDev < 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                                        {tempDev > 0 ? `+${tempDev}` : tempDev}°C
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="-30"
                                    max="30"
                                    step="1"
                                    value={tempDev}
                                    onChange={(e) => setTempDev(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                                <span className="text-[9px] text-slate-500">4 ft / 1000 ft / °C deviation</span>
                            </div>

                            <div>
                                <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
                                    <span className="flex items-center gap-1">
                                        <Compass size={12} className="text-sky-400" /> Pressure Deficit
                                    </span>
                                    <span className={`font-mono ${pressureDevHpa < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                        {pressureDevHpa > 0 ? `+${pressureDevHpa}` : pressureDevHpa} hPa
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="-25"
                                    max="25"
                                    step="1"
                                    value={pressureDevHpa}
                                    onChange={(e) => setPressureDevHpa(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                                />
                                <span className="text-[9px] text-slate-500">30 ft per hPa deficit</span>
                            </div>
                        </div>

                        {/* Visual Terrain & Aircraft Graphic */}
                        <div className="relative h-44 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-end p-4">
                            {/* Mountain Ridge Profile */}
                            <svg viewBox="0 0 400 120" className="absolute bottom-0 inset-x-0 w-full h-28 pointer-events-none">
                                <path
                                    d="M 0 120 L 100 80 L 180 30 L 230 50 L 300 20 L 400 120 Z"
                                    fill="#1e293b"
                                    stroke="#334155"
                                    strokeWidth="2"
                                />
                                {/* Peak Flag */}
                                <line x1="300" y1="20" x2="300" y2="8" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
                                <circle cx="300" cy="8" r="3" fill="#ef4444" />
                                <text x="290" y="6" textAnchor="end" fill="#ef4444" fontSize="9" fontWeight="bold">
                                    PEAK: 4,800'
                                </text>
                            </svg>

                            {/* Ghost Altimeter Target (What pilot thinks) */}
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-40">
                                <Plane size={20} className="text-slate-400" />
                                <span className="text-[10px] font-mono text-slate-400">Indicated: 5,000'</span>
                            </div>

                            {/* Actual Flying Aircraft Position */}
                            <motion.div
                                animate={{
                                    y: Math.min(65, Math.max(-20, (5000 - trueAltitudeFt) * 0.12))
                                }}
                                transition={{ type: 'spring', stiffness: 120 }}
                                className="absolute top-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
                            >
                                <div className={`p-1.5 rounded-full ${isCfitDanger ? 'bg-red-500 text-white animate-bounce' : 'bg-emerald-500 text-slate-950'}`}>
                                    <Plane size={20} />
                                </div>
                                <div className={`mt-1 px-2 py-0.5 rounded-md font-mono text-xs font-black shadow-lg ${isCfitDanger ? 'bg-red-500 text-white' : 'bg-slate-900 text-emerald-400 border border-emerald-500/40'}`}>
                                    True: {Math.round(trueAltitudeFt)}'
                                </div>
                            </motion.div>

                            {/* Danger Banner */}
                            <div className="relative z-20 flex justify-between items-center bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs">
                                <span className="font-mono text-[11px] text-slate-300">
                                    Clearance: <strong className={clearanceFt < 200 ? 'text-red-400 font-black' : 'text-emerald-400'}>{Math.round(clearanceFt)} FT</strong>
                                </span>
                                {isCfitDanger ? (
                                    <span className="flex items-center gap-1 text-[10px] font-black text-red-400 uppercase tracking-wider animate-pulse">
                                        <AlertTriangle size={12} /> CFIT Danger (Overreading)
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                                        <CheckCircle2 size={12} /> Safe Separation
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Mnemonic Pill */}
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-between">
                            <div className="text-xs text-red-300">
                                <strong>"From High to Low, look out below!"</strong>
                                <span className="block text-[10px] text-slate-400 mt-0.5">Cold air or low pressure without subscale reset = Altimeter overreads = Aircraft physically lower than indicated!</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* --- TAB 3: SUBSCALE QUICK MATH --- */}
                {activeTab === 'subscale-drill' && (
                    <motion.div
                        key="subscale-drill"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="space-y-4"
                    >
                        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">Actual Local QNH:</span>
                                <span className="font-mono font-black text-white text-sm">{drillQnh} hPa</span>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-400">Dialed Subscale Setting:</span>
                                    <span className="font-mono font-black text-emerald-400 text-sm">{drillSubscale} hPa</span>
                                </div>
                                <input
                                    type="range"
                                    min="970"
                                    max="1035"
                                    step="1"
                                    value={drillSubscale}
                                    onChange={(e) => setDrillSubscale(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                    <span>970 hPa</span>
                                    <span>Standard (1013)</span>
                                    <span>1035 hPa</span>
                                </div>
                            </div>
                        </div>

                        {/* Calculation Result */}
                        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                    Indicated Error (Δp × 30')
                                </span>
                                <span className={`text-2xl font-mono font-black ${drillErrorFt > 0 ? 'text-red-400' : drillErrorFt < 0 ? 'text-sky-400' : 'text-emerald-400'}`}>
                                    {drillErrorFt > 0 ? `+${drillErrorFt}` : drillErrorFt} FT
                                </span>
                            </div>

                            <div className="text-right max-w-[200px]">
                                <span className="text-xs font-bold text-white block">
                                    {drillErrorFt > 0
                                        ? 'OVERREADING ⚠'
                                        : drillErrorFt < 0
                                            ? 'UNDERREADING (Safe)'
                                            : 'EXACT CALIBRATION ✓'}
                                </span>
                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                    {drillErrorFt > 0
                                        ? 'Subscale set too high -> True altitude is LOWER than indicated.'
                                        : drillErrorFt < 0
                                            ? 'Subscale set too low -> True altitude is HIGHER than indicated.'
                                            : 'Subscale matches ambient QNH.'}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AltimeterQuickReminderCard;
