import React, { useState } from 'react';

const FuelDensityCalc: React.FC = () => {
    const [volume, setVolume] = useState(1000); // Litres
    const [density, setDensity] = useState(0.80); // kg/l called SG usually
    const mass = volume * density;

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8 font-sans">
            <h2 className="text-2xl font-bold text-white mb-6">Fuel Density Calculator</h2>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <label className="text-slate-400 text-sm mb-2 block">Fuel Volume (Litres)</label>
                        <input
                            type="range"
                            min="0" max="5000" step="10"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                        <div className="text-right text-amber-400 font-mono mt-1">{volume} L</div>
                    </div>

                    <div>
                        <label className="text-slate-400 text-sm mb-2 block">Specific Gravity (Density kg/L)</label>
                        <p className="text-xs text-slate-500 mb-2">Avg: AVGAS 0.72, JET A-1 0.80</p>
                        <input
                            type="range"
                            min="0.65" max="0.85" step="0.01"
                            value={density}
                            onChange={(e) => setDensity(parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="text-right text-blue-400 font-mono mt-1">{density.toFixed(2)} kg/L</div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center bg-slate-900 border border-slate-700 rounded-xl p-8">
                    <span className="text-slate-500 uppercase tracking-widest text-sm mb-2">Fuel Mass</span>
                    <span className="text-5xl font-bold text-white mb-2">{Math.round(mass)}</span>
                    <span className="text-slate-400 text-lg">kg</span>
                </div>
            </div>
        </div>
    );
};

export default FuelDensityCalc;