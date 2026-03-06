import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Maximize, Clock, Info } from 'lucide-react';

export const CruisePerf = () => {
    const [speed, setSpeed] = useState<number>(100);

    // Simplified drag curve: minimum at ~150 knots
    // Power required curve: minimum at ~120 knots

    // Calculate fuel flow based on speed (simplified U-shape curve for Power Required)
    // Fuel flow mimics power required. Lowest point around 120 knots for endurance.
    const fuelFlow = (Math.pow((speed - 120) / 40, 2) + 10) * 10;

    // Miles per kg fuel = speed / fuelFlow -> max around 150 knots for range.
    const specificRange = speed / fuelFlow;

    // Find "best" points mathematically for the visualizer
    const isBestEndurance = speed >= 115 && speed <= 125;
    const isBestRange = speed >= 145 && speed <= 155;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-sky-100 dark:bg-sky-900/50 p-3 rounded-full">
                    <Plane className="text-sky-600 dark:text-sky-400" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Cruise Performance</h1>
                    <p className="text-slate-600 dark:text-slate-400">Maximum Range vs Maximum Endurance</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Graph Visualization */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-6">Fuel Flow / Power Required Curve</h3>

                    <div className="relative w-full h-[300px] bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
                        {/* Axes */}
                        <div className="absolute bottom-6 left-12 right-6 h-[1px] bg-slate-400"></div>
                        <div className="absolute top-6 bottom-6 left-12 w-[1px] bg-slate-400"></div>

                        <div className="absolute left-2 top-1/2 -rotate-90 text-[10px] font-bold text-slate-500 uppercase tracking-widest origin-center whitespace-nowrap">
                            Fuel Flow (Power Req)
                        </div>
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                            Airspeed (TAS)
                        </div>

                        {/* The U-Curve (CSS approximation using SVG) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path
                                d="M 15 80 Q 25 15, 40 25 T 90 90"
                                fill="none"
                                stroke="rgba(148, 163, 184, 0.5)"
                                strokeWidth="1"
                                className="dark:stroke-slate-600"
                            />
                            {/* Line from origin tangent to curve (Max Range) */}
                            <line x1="12" y1="94" x2="52" y2="48" stroke="rgba(20, 184, 166, 0.5)" strokeWidth="0.5" strokeDasharray="2" />
                        </svg>

                        {/* Interactive Dot on Curve */}
                        <motion.div
                            className="absolute w-4 h-4 bg-sky-500 rounded-full shadow-lg shadow-sky-500/50 z-20"
                            style={{
                                left: `calc(12% + ${(speed / 300) * 80}%)`,
                                bottom: `calc(6% + ${(fuelFlow / 500) * 80}%)`,
                                transform: 'translate(-50%, 50%)'
                            }}
                        />

                        {/* Best Endurance Marker */}
                        <div className="absolute bottom-[20%] left-[44%] w-1 h-full border-l border-dashed border-amber-400 opacity-50 z-10">
                            <span className="absolute top-2 -left-10 text-[10px] text-amber-600 dark:text-amber-400 font-bold bg-white/80 dark:bg-slate-900/80 px-1 rounded">Vmd</span>
                        </div>

                        {/* Best Range Marker */}
                        <div className="absolute bottom-[30%] left-[52%] w-1 h-full border-l border-dashed border-emerald-400 opacity-50 z-10">
                            <span className="absolute top-8 -left-10 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-white/80 dark:bg-slate-900/80 px-1 rounded">1.32 Vmd</span>
                        </div>

                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Set Airspeed: <span className="text-sky-500">{speed} kts</span></label>
                        <input
                            type="range"
                            min="60"
                            max="250"
                            value={speed}
                            onChange={(e) => setSpeed(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                    </div>
                </div>

                {/* Dashboard Metrics */}
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className={`p-6 rounded-2xl border transition-all ${isBestEndurance ? 'bg-amber-50 border-amber-300 dark:bg-amber-900/20 dark:border-amber-700 shadow-md ring-2 ring-amber-400/50' : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700'}`}>
                            <Clock className={`mb-3 ${isBestEndurance ? 'text-amber-500' : 'text-slate-400'}`} size={28} />
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Fuel Flow</p>
                            <div className="text-2xl font-mono font-bold text-slate-800 dark:text-white">
                                {fuelFlow.toFixed(1)} <span className="text-sm">kg/hr</span>
                            </div>
                        </div>

                        <div className={`p-6 rounded-2xl border transition-all ${isBestRange ? 'bg-emerald-50 border-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-700 shadow-md ring-2 ring-emerald-400/50' : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700'}`}>
                            <Maximize className={`mb-3 ${isBestRange ? 'text-emerald-500' : 'text-slate-400'}`} size={28} />
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Specific Range</p>
                            <div className="text-2xl font-mono font-bold text-slate-800 dark:text-white">
                                {(specificRange * 10).toFixed(2)} <span className="text-sm">NM/kg</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800/30 p-6 rounded-2xl mt-4 flex-grow">
                        <h4 className="font-bold text-sky-900 dark:text-sky-300 mb-3 flex items-center gap-2">
                            <Info size={18} /> Flight Status
                        </h4>

                        {isBestEndurance ? (
                            <div className="text-sm text-sky-800 dark:text-sky-200 leading-relaxed">
                                You are flying at <strong>Minimum Drag Speed (Vmd)</strong>. This provides the absolute lowest fuel flow possible.
                                <br /><br />
                                This speed maximizes <strong>Endurance</strong> (time in the air), useful for holding patterns.
                            </div>
                        ) : isBestRange ? (
                            <div className="text-sm text-sky-800 dark:text-sky-200 leading-relaxed">
                                You are flying exactly tangent to the power curve (approx <strong>1.32 Vmd</strong>).
                                <br /><br />
                                This speed maximizes <strong>Specific Range</strong>—the most distance covered per kg of fuel. Ideal for cruising to your destination.
                            </div>
                        ) : speed < 115 ? (
                            <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                You are flying on the <strong>back side of the power curve</strong>. Your speed is low, but form drag (induced drag) is extremely high, requiring more power to fly slower! This is inefficient and dangerous near the ground.
                            </div>
                        ) : (
                            <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                You are flying fast. Parasite drag is increasing rapidly as square of velocity. Fuel flow is very high, reducing both maximum range and endurance.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CruisePerf;
