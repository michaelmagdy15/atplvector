import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Plus, Minus, Move } from 'lucide-react';

const CGShiftVisualizer: React.FC = () => {
    const [mode, setMode] = useState<'move' | 'add_remove'>('move');

    // Aircraft State
    const [mass, setMass] = useState(50000); // Initial Mass
    const [oldCg, setOldCg] = useState(400); // Initial CG (inches)

    // Operation State
    const [opMass, setOpMass] = useState(1000); // Mass to move/add/remove
    const [dist, setDist] = useState(200); // Distance moved OR Arm of added mass
    const [isAdded, setIsAdded] = useState(true); // for add/remove mode

    // Calculations
    let deltaCg = 0;
    let newCg = 0;
    let newMass = mass;
    let formula = '';

    if (mode === 'move') {
        // Move Formula: Delta CG = (Mass Moved * Dist Moved) / Total Mass
        deltaCg = (opMass * dist) / mass;
        newCg = oldCg + deltaCg;
        newMass = mass;
        formula = `ΔCG = ( ${opMass} × ${dist} ) / ${mass} = ${deltaCg.toFixed(2)}`;
    } else {
        // Add/Remove Formula: Delta CG = (Added Mass * (Arm - OldCG)) / New Total Mass
        // Simplified "change of moment" approach
        const action = isAdded ? 1 : -1;
        newMass = mass + (opMass * action);
        // Moment Change
        const oldMoment = mass * oldCg;
        const addedMoment = (opMass * action) * dist; // dist here is the ARM of the mass
        const newMoment = oldMoment + addedMoment;
        newCg = newMoment / newMass;
        deltaCg = newCg - oldCg;
    }

    // Visualization Scales
    const range = 800; // Total length to visualize

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8 font-sans">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Move className="text-cyan-400" />
                CG Shift Calculator
            </h2>

            {/* Mode Switcher */}
            <div className="flex bg-slate-900/50 p-1 rounded-lg mb-8 inline-flex">
                <button
                    onClick={() => setMode('move')}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${mode === 'move' ? 'bg-cyan-500 text-slate-900 shadow' : 'text-slate-400 hover:text-white'}`}
                >
                    <ArrowLeftRight className="inline w-4 h-4 mr-2" />
                    Move Mass
                </button>
                <button
                    onClick={() => setMode('add_remove')}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${mode === 'add_remove' ? 'bg-cyan-500 text-slate-900 shadow' : 'text-slate-400 hover:text-white'}`}
                >
                    <Plus className="inline w-4 h-4 mr-1" />/<Minus className="inline w-4 h-4 mr-1" />
                    Add or Remove
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                    {/* Controls */}
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 space-y-4">
                        <div className="flex justify-between items-center text-sm text-slate-400 mb-2">
                            <span>Aircraft Mass</span>
                            <span className="text-white font-mono">{mass} kg</span>
                        </div>
                        <input type="range" min="10000" max="100000" step="1000" value={mass} onChange={e => setMass(Number(e.target.value))} className="w-full accent-slate-500" />

                        <div className="flex justify-between items-center text-sm text-slate-400 mb-2">
                            <span>Initial CG (Arm)</span>
                            <span className="text-white font-mono">{oldCg}"</span>
                        </div>
                        <input type="range" min="100" max="700" step="1" value={oldCg} onChange={e => setOldCg(Number(e.target.value))} className="w-full accent-slate-500" />

                        <div className="h-px bg-slate-800 my-4"></div>

                        <div className="flex justify-between items-center text-sm text-cyan-400 font-bold mb-2">
                            <span>{mode === 'move' ? 'Mass to Move' : 'Mass to Add/Remove'}</span>
                            <span className="text-white font-mono">{opMass} kg</span>
                        </div>
                        <input type="range" min="100" max="5000" step="50" value={opMass} onChange={e => setOpMass(Number(e.target.value))} className="w-full accent-cyan-500" />

                        <div className="flex justify-between items-center text-sm text-cyan-400 font-bold mb-2">
                            <span>{mode === 'move' ? 'Distance to Move (+/-)' : 'Arm of New Mass'}</span>
                            <span className="text-white font-mono">{dist}"</span>
                        </div>
                        <input type="range" min={mode === 'move' ? -300 : 0} max={mode === 'move' ? 300 : 800} step="10" value={dist} onChange={e => setDist(Number(e.target.value))} className="w-full accent-cyan-500" />

                        {mode === 'add_remove' && (
                            <div className="flex gap-4 mt-4">
                                <button
                                    onClick={() => setIsAdded(true)}
                                    className={`flex-1 py-2 rounded font-bold border ${isAdded ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-slate-700 text-slate-500'}`}
                                >
                                    ADD
                                </button>
                                <button
                                    onClick={() => setIsAdded(false)}
                                    className={`flex-1 py-2 rounded font-bold border ${!isAdded ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-slate-700 text-slate-500'}`}
                                >
                                    REMOVE
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Visualization */}
                <div className="flex flex-col justify-center">
                    <div className="relative h-64 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden mb-8">
                        {/* Datum */}
                        <div className="absolute left-4 top-0 bottom-0 w-px bg-red-500 border-l border-dashed border-red-500 z-0">
                            <span className="absolute top-2 left-2 text-red-500 text-xs font-mono">DATUM</span>
                        </div>

                        {/* Old CG */}
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-500 rounded-full border-2 border-slate-400 z-10 transition-all duration-300"
                            style={{ left: `${(oldCg / range) * 100}%` }}
                        >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-slate-400 text-xs font-bold whitespace-nowrap">Old CG</div>
                        </div>

                        {/* New CG */}
                        <motion.div
                            animate={{ left: `${(newCg / range) * 100}%` }}
                            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-cyan-500 rounded-full border-4 border-slate-900 shadow shadow-cyan-500/50 z-20"
                        >
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-cyan-400 text-sm font-bold whitespace-nowrap">New CG</div>
                        </motion.div>

                        {/* Shift Arrow */}
                        <div
                            className="absolute top-1/2 mt-1 h-1 bg-cyan-500/30"
                            style={{
                                left: `${(Math.min(oldCg, newCg) / range) * 100}%`,
                                width: `${(Math.abs(deltaCg) / range) * 100}%`
                            }}
                        ></div>

                        {/* Moving Mass Visual */}
                        {mode === 'move' && (
                            <motion.div
                                animate={{ x: dist }} // This is relative visual only, roughly scaling
                                className="absolute bottom-4 w-8 h-8 bg-amber-500 rounded border border-amber-400 flex items-center justify-center text-xs font-bold text-slate-900"
                                style={{ left: '50%' }}
                            >
                                M
                            </motion.div>
                        )}

                        {mode === 'add_remove' && (
                            <div
                                className={`absolute top-1/3 w-8 h-8 rounded border flex items-center justify-center text-xs font-bold z-10 ${isAdded ? 'bg-emerald-500 border-emerald-400 text-slate-900' : 'bg-red-500 border-red-400 text-white'}`}
                                style={{ left: `${(dist / range) * 100}%` }}
                            >
                                {isAdded ? '+' : '-'}
                            </div>
                        )}

                    </div>

                    <div className="bg-slate-900/80 p-6 rounded-xl border border-white/5 backdrop-blur text-center">
                        <div className="grid grid-cols-2 gap-4 mb-4 text-left">
                            <div>
                                <div className="text-slate-500 text-xs uppercase tracking-widest">New Mass</div>
                                <div className="text-2xl font-mono text-white">{newMass} kg</div>
                            </div>
                            <div>
                                <div className="text-slate-500 text-xs uppercase tracking-widest">Shift (ΔCG)</div>
                                <div className="text-2xl font-mono text-cyan-400">{deltaCg > 0 ? '+' : ''}{deltaCg.toFixed(2)}"</div>
                            </div>
                        </div>

                        <div className="text-sm bg-slate-800 p-3 rounded font-mono text-slate-300 overflow-x-auto">
                            {mode === 'move' ? (
                                <>
                                    ΔCG = (Mass × Dist) / Total<br />
                                    ΔCG = ({opMass} × {dist}) / {mass}<br />
                                    <span className="text-cyan-400 break-words">= {((opMass * dist) / mass).toFixed(2)} inches</span>
                                </>
                            ) : (
                                <>
                                    NewCG = Total Moment / Total Mass<br />
                                    NewCG = ( {(mass * oldCg).toFixed(0)} {isAdded ? '+' : '-'} {(opMass * dist).toFixed(0)} ) / {newMass}<br />
                                    <span className="text-cyan-400">= {newCg.toFixed(2)} inches</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CGShiftVisualizer;
