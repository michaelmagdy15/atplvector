import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, Users, Check, X, AlertCircle } from 'lucide-react';

interface FleetPlane {
    id: string;
    reg: string;
    mass: number;
    lastWeighed: string;
}

const FleetMasses: React.FC = () => {
    // EASA EU-OPS Rules for fleet mass
    // "Values for a fleet... if the individual masses are within a tolerance..."
    // Tolerance: +/- 0.5% of max structural landing mass OR +/- 0.5% of dry operating mass (whichever is greater? No, usually based on stats)
    // Actually: "An operator may use the fleet mean mass... provided that the individual masses are within the tolerances specified."

    // Rule:
    // If the fleet mean mass is used:
    // 1. The sample size must be adequate.
    // 2. Individual aircraft must be within ±0.5% max landing mass OR ±0.5% of the logic... 
    // Let's implement a checker based on "Standard Fleet Values" logic.

    const [stats, setStats] = useState({
        meanMass: 45000,
        tolerance: 0.5, // %
        referenceMassType: 'DOM' as 'DOM' | 'MSLM',
    });

    const [fleet, setFleet] = useState<FleetPlane[]>([
        { id: '1', reg: 'G-ABCD', mass: 45100, lastWeighed: '2023-01-10' },
        { id: '2', reg: 'G-EFGH', mass: 44950, lastWeighed: '2023-06-15' },
        { id: '3', reg: 'G-IJKL', mass: 45200, lastWeighed: '2022-11-20' },
        { id: '4', reg: 'G-MNOP', mass: 44800, lastWeighed: '2024-02-01' },
        { id: '5', reg: 'G-QRST', mass: 45500, lastWeighed: '2021-05-05' }, // Outlier
    ]);

    // Calculate actual mean
    const actualMean = fleet.reduce((acc, p) => acc + p.mass, 0) / fleet.length;

    // Check compliance
    const limit = (stats.meanMass * stats.tolerance) / 100;
    const lower = actualMean - limit;
    const upper = actualMean + limit;

    const complianceCheck = (mass: number) => {
        const diff = Math.abs(mass - actualMean);
        const percent = (diff / actualMean) * 100;
        return {
            isCompliant: percent <= stats.tolerance,
            diff: diff,
            percent: percent
        };
    };

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8 font-sans">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                <Users className="text-teal-400" />
                Fleet Mass Evaluator
            </h2>
            <p className="text-slate-400 mb-8">
                Determine if an aircraft can use "Fleet Mass" values instead of its individual weighing report.
            </p>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Configuration Panel */}
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 h-fit">
                    <h3 className="text-lg font-bold text-white mb-4">Parameters</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="text-slate-400 text-xs uppercase mb-1 block">Ref. Mean Mass (kg)</label>
                            <div className="text-2xl font-mono text-white mb-2">{actualMean.toFixed(0)}</div>
                            <p className="text-xs text-slate-500">Calculated from current fleet list.</p>
                        </div>

                        <div className="h-px bg-slate-800 my-4"></div>

                        <div>
                            <label className="text-slate-400 text-xs uppercase mb-1 block">Tolerance Limit (%)</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="0.1" max="2.0" step="0.1"
                                    value={stats.tolerance}
                                    onChange={(e) => setStats({ ...stats, tolerance: parseFloat(e.target.value) })}
                                    className="flex-1 accent-teal-500"
                                />
                                <span className="font-mono text-teal-400 font-bold">{stats.tolerance}%</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">EU-OPS compliant limit is typically 0.5% of MSLM or DOM.</p>
                        </div>
                    </div>

                    <div className="mt-8 bg-slate-800 p-4 rounded border border-slate-700">
                        <div className="text-slate-400 text-xs uppercase mb-2">Fleet Status</div>
                        {fleet.every(p => complianceCheck(p.mass).isCompliant) ? (
                            <div className="flex items-center gap-2 text-emerald-400 font-bold">
                                <Check size={20} />
                                FLEET VALUES VALID
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-red-400 font-bold">
                                <X size={20} />
                                INDIVIDUAL WEIGHING REQ.
                            </div>
                        )}
                        <p className="text-xs text-slate-500 mt-2">
                            All aircraft must be within tolerance to use the single fleet mass value.
                        </p>
                    </div>
                </div>

                {/* Visualization & List */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Visual Graph */}
                    <div className="h-48 bg-slate-900 rounded-xl border border-slate-700 relative flex items-center px-12">
                        {/* Mean Line */}
                        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-teal-500/50 border-l border-dashed border-teal-500 z-0"></div>
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-teal-500 text-xs font-mono">MEAN</div>

                        {/* Tolerance Band */}
                        <div
                            className="absolute top-0 bottom-0 bg-teal-500/5 left-1/2 -translate-x-1/2 border-l border-r border-teal-500/20"
                            style={{ width: '40%' }} // Fixed visual width for the band
                        ></div>

                        {/* Aircraft Dots */}
                        {fleet.map((plane, i) => {
                            const check = complianceCheck(plane.mass);
                            // Visual scaling: Mean is center (50%). 
                            // Limit is +/- 20% visually.
                            // deviation / limit * 20
                            const deviation = plane.mass - actualMean;
                            const limitVal = actualMean * (stats.tolerance / 100);
                            const visualOffset = (deviation / limitVal) * 20; // 20% width is the limit boundary

                            return (
                                <motion.div
                                    key={plane.id}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold z-10 cursor-pointer group ${check.isCompliant ? 'bg-slate-800 border-teal-500 text-teal-400' : 'bg-red-500/20 border-red-500 text-red-500'}`}
                                    style={{
                                        left: `${50 + visualOffset}%`,
                                        top: `${20 + (i * 15)}%`
                                    }}
                                >
                                    {i + 1}

                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-xs p-2 rounded border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity">
                                        {plane.reg}: {plane.mass}kg
                                        <br />
                                        Dev: {check.percent.toFixed(2)}%
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Data Table */}
                    <div className="overflow-hidden rounded-xl border border-slate-700">
                        <table className="w-full text-left bg-slate-900/50 text-sm">
                            <thead className="bg-slate-900 text-slate-400">
                                <tr>
                                    <th className="p-3">#</th>
                                    <th className="p-3">Registration</th>
                                    <th className="p-3 text-right">Mass (kg)</th>
                                    <th className="p-3 text-right">Deviation</th>
                                    <th className="p-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {fleet.map((plane, i) => {
                                    const check = complianceCheck(plane.mass);
                                    return (
                                        <tr key={plane.id} className="hover:bg-slate-800/50">
                                            <td className="p-3 text-slate-500">{i + 1}</td>
                                            <td className="p-3 font-medium text-white">{plane.reg}</td>
                                            <td className="p-3 text-right font-mono text-slate-300">{plane.mass.toLocaleString()}</td>
                                            <td className="p-3 text-right font-mono text-slate-400">
                                                {plane.mass > actualMean ? '+' : ''}{(plane.mass - actualMean).toFixed(0)}
                                                <span className="text-xs ml-1 opacity-50">({check.percent.toFixed(2)}%)</span>
                                            </td>
                                            <td className="p-3 text-center">
                                                {check.isCompliant ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-500">
                                                        OK
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-500/10 text-red-500">
                                                        FAIL
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg flex gap-3 text-sm text-blue-200">
                        <AlertCircle className="shrink-0" size={20} />
                        <div>
                            <p className="font-bold mb-1">Regulation Note</p>
                            If the equipment and/or interior of the aircraft varies significantly from the other aircraft in the fleet, it must be weighed separately. "Sister ships" must be identical in configuration.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FleetMasses;
