import React, { useState } from 'react';
import { Activity, Gauge } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const TotalDrag: React.FC = () => {
    // Generate Drag Curves
    // Induced Drag: Di proportional to 1/V^2
    // Parasite Drag: Dp proportional to V^2
    // Total Drag = Di + Dp

    const data = [];
    const minSpeed = 50;
    const maxSpeed = 300;

    // Constants for shape
    const k = 1000000; // Induced drag constant
    const c = 0.02;    // Parasite drag constant

    let minDrag = Infinity;
    let vmd = 0;

    for (let v = minSpeed; v <= maxSpeed; v += 5) {
        const di = k / (v * v);
        const dp = c * v * v;
        const total = di + dp;

        if (total < minDrag) {
            minDrag = total;
            vmd = v;
        }

        data.push({
            speed: v,
            induced: di,
            parasite: dp,
            total: total
        });
    }

    return (
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="text-orange-400" /> Total Drag Graph
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="hidden md:block col-span-1 space-y-6">
                    <div className="bg-slate-800 p-4 rounded-lg">
                        <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                            <Gauge size={18} className="text-sky-400" /> Vmd (Min Drag)
                        </h3>
                        <div className="text-3xl font-mono text-white text-center py-4">
                            {vmd} <span className="text-base text-slate-400">kt</span>
                        </div>
                        <p className="text-xs text-slate-400 text-center">
                            Speed where Parasite Drag = Induced Drag
                        </p>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-lg">
                        <h3 className="text-white font-bold mb-2">Drag Components</h3>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <div className="flex justify-between mb-1">
                                    <span className="text-red-400">Induced Drag</span>
                                    <span className="text-slate-500">~ 1/V²</span>
                                </div>
                                <p className="text-xs text-slate-400">Dominant at low speeds.</p>
                            </li>
                            <li>
                                <div className="flex justify-between mb-1">
                                    <span className="text-green-400">Parasite Drag</span>
                                    <span className="text-slate-500">~ V²</span>
                                </div>
                                <p className="text-xs text-slate-400">Dominant at high speeds.</p>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="md:col-span-2 h-[400px] bg-slate-800 p-4 rounded-xl border border-slate-600">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis
                                dataKey="speed"
                                stroke="#94a3b8"
                                label={{ value: 'Airspeed (TAS)', position: 'bottom', fill: '#94a3b8' }}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                label={{ value: 'Drag Force', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value: number) => value.toFixed(0)}
                            />
                            <ReferenceLine x={vmd} stroke="white" strokeDasharray="3 3" label={{ value: 'Vmd', fill: 'white', position: 'top' }} />

                            <Line type="monotone" dataKey="total" stroke="#f59e0b" strokeWidth={4} dot={false} name="Total Drag" />
                            <Line type="monotone" dataKey="induced" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Induced" />
                            <Line type="monotone" dataKey="parasite" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Parasite" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default TotalDrag;
