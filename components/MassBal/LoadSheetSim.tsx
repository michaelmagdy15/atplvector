import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, Info } from 'lucide-react';

const LoadSheetSim: React.FC = () => {
    // Standard Aircraft: MAC starts at 200in, Length 100in
    const LEMAC = 200;
    const MAC = 100;

    // Limits
    const MTOM = 5000;
    const FWD_CG_LIMIT = 20; // %MAC
    const AFT_CG_LIMIT = 35; // %MAC

    const [items, setItems] = useState([
        { id: 'bem', name: 'Basic Empty Mass', mass: 4000, arm: 240, locked: true },
        { id: 'fwd_pax', name: 'Fwd Pax', mass: 160, arm: 150, locked: false },
        { id: 'aft_pax', name: 'Aft Pax', mass: 160, arm: 350, locked: false },
        { id: 'fwd_cargo', name: 'Fwd Cargo', mass: 50, arm: 100, locked: false },
        { id: 'aft_cargo', name: 'Aft Cargo', mass: 50, arm: 450, locked: false },
        { id: 'fuel', name: 'Fuel', mass: 400, arm: 250, locked: false },
    ]);

    const updateMass = (id: string, newMass: number) => {
        setItems(items.map(item => item.id === id ? { ...item, mass: newMass } : item));
    };

    const totalMass = items.reduce((sum, item) => sum + item.mass, 0);
    const totalMoment = items.reduce((sum, item) => sum + (item.mass * item.arm), 0);
    const cgPosition = totalMass > 0 ? totalMoment / totalMass : 0;
    const cgPercentMac = ((cgPosition - LEMAC) / MAC) * 100;

    // Visual Scales
    const aircraftLength = 600; // inches

    return (
        <div className="flex flex-col gap-6 font-sans mt-8 h-[calc(100vh-140px)] overflow-y-auto">
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            Load Sheet Simulator
                        </h3>
                        <p className="text-sm text-slate-400">Plan your flight loading and verify mass & CG limits.</p>
                    </div>

                    <div className="flex gap-4 text-right">
                        <div>
                            <div className="text-xs text-slate-500 uppercase">Total Mass</div>
                            <div className={`text-2xl font-mono ${totalMass > MTOM ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>
                                {totalMass.toLocaleString()} <span className="text-sm text-slate-500">/ {MTOM} kg</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 uppercase">CG Position</div>
                            <div className="text-2xl font-mono text-purple-400">{cgPosition.toFixed(1)} in</div>
                        </div>
                        <div className="relative">
                            <div className="text-xs text-slate-500 uppercase">% MAC</div>
                            <div className={`text-2xl font-mono ${cgPercentMac >= FWD_CG_LIMIT && cgPercentMac <= AFT_CG_LIMIT ? 'text-emerald-400' : 'text-red-500'}`}>
                                {cgPercentMac.toFixed(1)}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Aircraft Visualization */}
                <div className="relative h-48 bg-slate-900/50 rounded-lg border border-slate-800 mb-8 overflow-hidden">
                    {/* Fuselage Outline */}
                    <div className="absolute top-1/2 left-4 right-4 h-12 bg-slate-800 rounded-full -translate-y-1/2 border border-slate-700"></div>

                    {/* Wing / MAC representation */}
                    <div
                        className="absolute top-1/2 h-20 bg-slate-800/80 border-l border-r border-slate-600 -translate-y-1/2"
                        style={{ left: `${(LEMAC / aircraftLength) * 100}%`, width: `${(MAC / aircraftLength) * 100}%` }}
                    >
                        <div className="absolute top-0 -mt-6 text-xs text-slate-500 w-full text-center">MAC</div>
                    </div>

                    {/* Limits */}
                    <div
                        className="absolute top-1/2 h-6 bg-emerald-500/10 border-l border-r border-emerald-500/30 -translate-y-1/2 z-0"
                        style={{
                            left: `${((LEMAC + (MAC * FWD_CG_LIMIT / 100)) / aircraftLength) * 100}%`,
                            width: `${(MAC * (AFT_CG_LIMIT - FWD_CG_LIMIT) / 100 / aircraftLength) * 100}%`
                        }}
                    ></div>

                    {/* CG Marker */}
                    <motion.div
                        animate={{ left: `${(cgPosition / aircraftLength) * 100}%` }}
                        className="absolute top-1/2 w-0.5 h-32 bg-purple-500 -translate-y-1/2 z-10"
                    >
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
                            <div className="w-4 h-4 rounded-full border-2 border-purple-500 bg-slate-900 grid place-items-center">
                                <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                            </div>
                            <div className="w-0.5 h-full bg-purple-500"></div>
                        </div>
                    </motion.div>

                    {/* Items */}
                    {items.map(item => (
                        <div
                            key={item.id}
                            className="absolute top-1/2 w-4 h-4 rounded-full bg-blue-500/30 border border-blue-400 -translate-y-1/2 -translate-x-1/2 hover:scale-150 transition-transform cursor-help z-20"
                            style={{ left: `${(item.arm / aircraftLength) * 100}%` }}
                            title={`${item.name}: ${item.mass}kg @ ${item.arm}in`}
                        ></div>
                    ))}

                    {/* Datum */}
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-500/50">
                        <span className="absolute top-2 left-2 text-xs text-red-500 font-mono">DATUM</span>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="text-slate-400 border-b border-slate-700">
                                <th className="p-3">Item</th>
                                <th className="p-3 text-right">Mass (kg)</th>
                                <th className="p-3 text-right">Arm (in)</th>
                                <th className="p-3 text-right">Moment (kg-in)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                    <td className="p-3 font-medium text-slate-300">{item.name}</td>
                                    <td className="p-3 text-right">
                                        <input
                                            type="number"
                                            value={item.mass}
                                            disabled={item.locked}
                                            onChange={(e) => updateMass(item.id, parseInt(e.target.value) || 0)}
                                            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 w-24 text-right font-mono focus:border-blue-500 outline-none disabled:opacity-50 text-white"
                                        />
                                    </td>
                                    <td className="p-3 text-right font-mono text-slate-400">{item.arm}</td>
                                    <td className="p-3 text-right font-mono text-slate-400">{(item.mass * item.arm).toLocaleString()}</td>
                                </tr>
                            ))}
                            <tr className="bg-slate-800/50 font-bold border-t-2 border-slate-700">
                                <td className="p-3 text-white">Total</td>
                                <td className="p-3 text-blue-400 font-mono text-right">{totalMass.toLocaleString()}</td>
                                <td className="p-3 text-purple-400 font-mono text-right">{cgPosition.toFixed(2)}</td>
                                <td className="p-3 text-slate-300 font-mono text-right">{totalMoment.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        <span className="text-slate-400">Stable Range ({FWD_CG_LIMIT}-{AFT_CG_LIMIT}% MAC)</span>
                    </div>
                    {cgPercentMac < FWD_CG_LIMIT && (
                        <div className="text-red-400 font-bold flex items-center gap-2 animate-pulse">
                            <AlertTriangle className="w-4 h-4" /> Unstable (Too Forward) - High Stick Forces!
                        </div>
                    )}
                    {cgPercentMac > AFT_CG_LIMIT && (
                        <div className="text-red-400 font-bold flex items-center gap-2 animate-pulse">
                            <AlertTriangle className="w-4 h-4" /> Unstable (Too Aft) - Spin Risk!
                        </div>
                    )}
                    {totalMass > MTOM && (
                        <div className="text-red-400 font-bold flex items-center gap-2 animate-pulse">
                            <AlertTriangle className="w-4 h-4" /> Mass Exceeds MTOM!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoadSheetSim;
