import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, MountainSnow, Wind, Target, Plane } from 'lucide-react';

export const ClimbPerf = () => {
    const [speedScale, setSpeedScale] = useState<number>(50); // 0 to 100 representing Vx to Vy to Vmo

    // Calculate derived values based on speed scale (simplified aerodynamics)
    // At scale 20 (Vx): max gradient (steepest angle), lower rate
    // At scale 50 (Vy): max rate (fastest climb), lower gradient than Vx
    // At scale 90 (High speed): low gradient, low rate

    // Gradient peaks at Vx, decreases after
    let gradient = speedScale <= 20 ? 10 + (speedScale / 20) * 5 : 15 - ((speedScale - 20) / 80) * 10;
    // Rate peaks at Vy (50), decreases after
    let rate = speedScale <= 50 ? 500 + (speedScale / 50) * 1500 : 2000 - ((speedScale - 50) / 50) * 1500;

    if (speedScale < 10) {
        gradient = 0; rate = 0; // Stall region
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full">
                    <TrendingUp className="text-indigo-600 dark:text-indigo-400" size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Climb Performance</h1>
                    <p className="text-slate-600 dark:text-slate-400">Gradient vs. Rate (Vx and Vy)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center min-h-[450px] relative overflow-hidden">

                    {/* Obstacle (Mountain) */}
                    <div className="absolute right-12 bottom-12 text-slate-600 dark:text-slate-700 z-10">
                        <MountainSnow size={120} strokeWidth={1} />
                    </div>

                    {/* Flight Path Visualization */}
                    <div className="absolute left-10 bottom-12 w-[80%] h-[300px] border-l-2 border-b-2 border-slate-700 border-dashed z-0 flex items-end">
                        <div
                            className="bg-blue-500/20 border-t-2 border-blue-500 h-full w-[2px] transition-all duration-300 origin-bottom-left absolute"
                            style={{
                                width: '120%',
                                transform: `rotate(-${gradient}deg)`,
                                backgroundColor: speedScale === 20 ? 'rgba(16, 185, 129, 0.2)' : speedScale === 50 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                                borderColor: speedScale === 20 ? '#10b981' : speedScale === 50 ? '#3b82f6' : '#64748b'
                            }}
                        />

                        {/* Status overlays in canvas */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {speedScale === 20 && (
                                <div className="bg-emerald-900/80 border border-emerald-500 text-emerald-300 px-3 py-1 rounded text-sm font-bold">
                                    Vx Achieved (Max Angle)
                                </div>
                            )}
                            {speedScale === 50 && (
                                <div className="bg-blue-900/80 border border-blue-500 text-blue-300 px-3 py-1 rounded text-sm font-bold">
                                    Vy Achieved (Max Rate)
                                </div>
                            )}
                            {gradient > 12 && speedScale < 40 && (
                                <div className="bg-slate-800/80 text-emerald-400 px-3 py-1 rounded text-xs">
                                    Clearing Obstacle
                                </div>
                            )}
                            {gradient <= 12 && rate > 0 && (
                                <div className="bg-slate-800/80 text-rose-400 px-3 py-1 rounded text-xs animate-pulse">
                                    Obstacle Clearance Critical!
                                </div>
                            )}
                            {rate === 0 && (
                                <div className="bg-rose-900 border border-rose-500 text-rose-300 px-3 py-1 rounded text-sm font-bold">
                                    STALL
                                </div>
                            )}
                        </div>
                    </div>

                    {/* The Plane */}
                    <div
                        className="absolute bottom-12 left-10 w-8 h-8 flex items-center justify-center transition-all duration-300 z-20"
                        style={{
                            transform: `translate(${speedScale * 4}px, -${speedScale * (gradient / 10)}px) rotate(-${gradient}deg)`
                        }}
                    >
                        <Plane size={32} className="text-white" style={{ transform: 'rotate(45deg)' }} />
                    </div>

                    <div className="w-full mt-auto z-30 bg-slate-800 border border-slate-700 p-5 rounded-xl">
                        <label className="block text-sm font-bold mb-4 flex justify-between items-center text-slate-300">
                            Pitch / Airspeed Selector
                            <span className="bg-slate-700 px-3 py-1 rounded-md text-sky-300 font-mono">
                                V = {(speedScale + 60).toFixed(0)} kts
                            </span>
                        </label>
                        <div className="relative">
                            {/* Guide markers on slider */}
                            <div className="absolute top-1/2 left-[20%] w-1 h-3 bg-emerald-500 -translate-y-1/2 -translate-x-1/2 rounded-full pointer-events-none z-10" />
                            <div className="absolute top-1/2 left-[50%] w-1 h-3 bg-blue-500 -translate-y-1/2 -translate-x-1/2 rounded-full pointer-events-none z-10" />

                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={speedScale}
                                onChange={(e) => setSpeedScale(Number(e.target.value))}
                                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-slate-300 relative z-20"
                            />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                            <span>V-Stall</span>
                            <span className="text-emerald-400 font-bold" style={{ marginLeft: '-15%' }}>Vx (Best Angle)</span>
                            <span className="text-blue-400 font-bold" style={{ marginLeft: '-10%' }}>Vy (Best Rate)</span>
                            <span>Cruise Climb</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                        <div className="text-3xl font-mono font-bold text-slate-800 dark:text-white mb-1">
                            {gradient.toFixed(1)}%
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Climb Gradient (Angle)</p>

                        <div className="text-3xl font-mono font-bold text-slate-800 dark:text-white mb-1">
                            {rate.toFixed(0)} fpm
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Rate of Climb</p>

                        <div className="space-y-4">
                            <div className={`p-4 rounded-xl border ${speedScale === 20 ? 'bg-emerald-50 border-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-700' : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700'}`}>
                                <h4 className="flex items-center justify-between font-bold text-slate-800 dark:text-white text-sm mb-1">
                                    Vx
                                    {speedScale === 20 && <Target size={16} className="text-emerald-500" />}
                                </h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                    Best <strong>Angle</strong> of climb. Provides the most altitude gained per distance traveled forward. Used for <strong>Obstacle Clearance</strong>.
                                </p>
                            </div>

                            <div className={`p-4 rounded-xl border ${speedScale === 50 ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700' : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700'}`}>
                                <h4 className="flex items-center justify-between font-bold text-slate-800 dark:text-white text-sm mb-1">
                                    Vy
                                    {speedScale === 50 && <TrendingUp size={16} className="text-blue-500" />}
                                </h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                    Best <strong>Rate</strong> of climb. Provides the most altitude gained per unit of time. Used to reach cruising altitude quickly.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClimbPerf;
