import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';

export const PoFLimitations = () => {
    const [aircraftType, setAircraftType] = useState<'Normal' | 'Utility' | 'Aerobatic' | 'Transport'>('Transport');

    // Define limits based on category
    const limits = {
        Transport: { pos: 2.5, neg: -1.0, va: 150, vno: 250, vne: 300 },
        Normal: { pos: 3.8, neg: -1.52, va: 110, vno: 160, vne: 180 },
        Utility: { pos: 4.4, neg: -1.76, va: 120, vno: 170, vne: 195 },
        Aerobatic: { pos: 6.0, neg: -3.0, va: 140, vno: 200, vne: 230 }
    };

    const currentLimits = limits[aircraftType];

    // Generate V-n diagram shape
    const data = [
        { speed: 0, maxPos: 0, maxNeg: 0, stallPos: 0, stallNeg: 0 },
        { speed: 60, maxPos: 1, maxNeg: -0.5, stallPos: 1, stallNeg: -0.5 }, // 1G Stall
        { speed: currentLimits.va - 20, maxPos: currentLimits.pos - 0.5, maxNeg: currentLimits.neg + 0.2, stallPos: currentLimits.pos - 0.5, stallNeg: currentLimits.neg + 0.2 },
        { speed: currentLimits.va, maxPos: currentLimits.pos, maxNeg: currentLimits.neg, stallPos: currentLimits.pos, stallNeg: currentLimits.neg }, // Va (Design Maneuvering Speed)
        { speed: currentLimits.vno, maxPos: currentLimits.pos, maxNeg: currentLimits.neg, stallPos: currentLimits.pos, stallNeg: currentLimits.neg }, // Vno (Max Structural Cruise)
        { speed: currentLimits.vne, maxPos: currentLimits.pos, maxNeg: currentLimits.neg, stallPos: currentLimits.pos, stallNeg: currentLimits.neg }, // Vne (Never Exceed)
    ];

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold mb-4 text-slate-800 dark:text-slate-100 flex items-center">
                <ShieldAlert className="mr-3 text-red-500" />
                Flight Limitations & The V-n Diagram
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
                The V-n (Velocity vs. Load Factor) diagram defines the flight operating strength envelope. Operating outside these boundaries risks structural failure or stalling.
            </p>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm mb-6">
                <h2 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">Select Aircraft Category</h2>

                <div className="flex gap-4 mb-6 flex-wrap">
                    {(Object.keys(limits) as Array<keyof typeof limits>).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setAircraftType(cat)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${aircraftType === cat
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                }`}
                        >
                            {cat} Category
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="text-xs text-green-600 dark:text-green-400 font-bold uppercase">Pos Load Limit</div>
                        <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">+{currentLimits.pos} G</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="text-xs text-red-600 dark:text-red-400 font-bold uppercase">Neg Load Limit</div>
                        <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{currentLimits.neg} G</div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase">Va (Maneuvering)</div>
                        <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{currentLimits.va} kt</div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                        <div className="text-xs text-orange-600 dark:text-orange-400 font-bold uppercase">Vne (Never Exceed)</div>
                        <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{currentLimits.vne} kt</div>
                    </div>
                </div>

                <div className="h-80 w-full bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis dataKey="speed" type="number" domain={[0, 350]} allowDataOverflow name="Speed (kts)" tick={{ fill: '#888' }} />
                            <YAxis domain={[-4, 7]} name="Load Factor (G)" tick={{ fill: '#888' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
                                formatter={(value: number) => [`${value} G`, 'Load Limit']}
                                labelFormatter={(label) => `Speed: ${label} kts`}
                            />

                            {/* Safe Envelope Area */}
                            <Area type="monotone" dataKey="maxPos" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                            <Area type="monotone" dataKey="maxNeg" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />

                            {/* Key speed lines */}
                            <ReferenceLine x={currentLimits.va} stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'top', value: 'Va', fill: '#f59e0b', fontSize: 12 }} />
                            <ReferenceLine x={currentLimits.vne} stroke="#ef4444" strokeWidth={2} label={{ position: 'top', value: 'Vne', fill: '#ef4444', fontSize: 12 }} />
                            <ReferenceLine y={1} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'right', value: '1G (Level)', fill: '#10b981', fontSize: 12 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-6 flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <Info className="flex-shrink-0 text-blue-500 mt-1" size={20} />
                    <div className="text-sm text-blue-800 dark:text-blue-300">
                        <p className="mb-2"><strong>Maneuvering Speed (V<sub>a</sub>)</strong> limits: Below this speed, the aircraft will stall before exceeding the design limit load factor. Full, abrupt control movements can be safely made safely only below this speed.</p>
                        <p><strong>Design Limit Load (DLL):</strong> Exceeding the boundaries of the blue area means exceeding the DLL, risking permanent structural deformation (bending) or failure.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PoFLimitations;
