import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MacVisualizer: React.FC = () => {
    const [lemac] = useState(200);
    const [temac] = useState(300);
    const mac = temac - lemac;
    const [cg, setCg] = useState(230);

    const percentMac = ((cg - lemac) / mac) * 100;

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8 font-sans">
            <h2 className="text-2xl font-bold text-white mb-6">MAC Visualizer</h2>
            <div className="h-40 bg-slate-900 relative border-b border-t border-slate-700 mb-8">
                {/* Wing */}
                <div className="absolute top-0 bottom-0 bg-blue-500/10 border-l border-r border-blue-500/30"
                    style={{ left: '20%', width: '30%' }}>
                    <span className="absolute top-2 left-2 text-blue-400 text-xs font-mono">LEMAC ({lemac}")</span>
                    <span className="absolute top-2 right-2 text-blue-400 text-xs font-mono">TEMAC ({temac}")</span>
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-blue-500/50"></div>
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-300 font-bold">MAC = {mac}"</span>
                </div>

                {/* Datum */}
                <div className="absolute top-0 bottom-0 left-0 w-px bg-red-500 border-l border-dashed border-red-500">
                    <span className="absolute top-1 left-2 text-red-500 text-xs font-mono">DATUM</span>
                </div>

                {/* CG */}
                <motion.div
                    className="absolute top-0 bottom-0 w-0.5 bg-purple-500 z-10"
                    style={{ left: `${(cg / 1000) * 100}%` }} // Simplified scale
                >
                    <div className="absolute -top-6 -translate-x-1/2 bg-purple-600 px-2 py-1 rounded text-white text-xs font-bold">CG</div>
                </motion.div>
            </div>

            <div className="space-y-4 max-w-md mx-auto">
                <div>
                    <label className="text-slate-400 text-sm">CG Position (inches aft of datum)</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="150" max="350"
                            value={cg}
                            onChange={(e) => setCg(parseInt(e.target.value))}
                            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                        <span className="text-white font-mono w-16 text-right">{cg}"</span>
                    </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-lg text-center">
                    <div className="text-slate-500 text-sm uppercase tracking-widest mb-1">Result</div>
                    <div className="text-3xl font-bold text-white font-mono">
                        {percentMac.toFixed(1)}% MAC
                    </div>
                    <div className="text-slate-400 text-xs mt-2">
                        Formula: ((CG - LEMAC) / MAC) × 100
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-8 p-6 text-sm">
                <div className="bg-slate-700/30 p-4 rounded">
                    <span className="text-cyan-400 font-bold block mb-1">LEMAC</span>
                    Leading Edge of Mean Aerodynamic Chord
                </div>
                <div className="bg-slate-700/30 p-4 rounded">
                    <span className="text-cyan-400 font-bold block mb-1">TEMAC</span>
                    Trailing Edge of Mean Aerodynamic Chord
                </div>
                <div className="bg-slate-700/30 p-4 rounded">
                    <span className="text-cyan-400 font-bold block mb-1">MAC</span>
                    Mean Aerodynamic Chord (The "average" wing slice)
                </div>
            </div>
        </div>
    );
};

export default MacVisualizer;