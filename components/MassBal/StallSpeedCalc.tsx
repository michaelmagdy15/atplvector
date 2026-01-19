import React, { useState } from 'react';
import { Calculator, TrendingUp, Weight, Info, Gauge } from 'lucide-react';

const StallSpeedCalc: React.FC = () => {
    const [baseStallSpeed, setBaseStallSpeed] = useState(120); // VS0 in knots
    const [baseMass, setBaseMass] = useState(50000); // W0 in kg
    const [newMass, setNewMass] = useState(60000); // W1 in kg

    // Calculate new stall speed: VS1 = VS0 × √(W1/W0)
    const massRatio = newMass / baseMass;
    const newStallSpeed = baseStallSpeed * Math.sqrt(massRatio);
    const speedChange = newStallSpeed - baseStallSpeed;
    const percentChange = ((newStallSpeed - baseStallSpeed) / baseStallSpeed) * 100;

    // Visual position for speed gauge (0-200 knots range)
    const basePosition = (baseStallSpeed / 200) * 100;
    const newPosition = Math.min(100, (newStallSpeed / 200) * 100);

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-amber-500/10 rounded-full mb-4">
                    <Calculator className="w-8 h-8 text-amber-400" />
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                    Stall Speed <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Calculator</span>
                </h1>
                <p className="text-slate-400 mt-2">Understanding how mass affects stall speed</p>
            </div>

            {/* Formula Display */}
            <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-2xl p-8 border border-amber-500/30">
                <div className="text-center">
                    <h3 className="text-lg font-bold text-amber-400 mb-6">The Formula</h3>

                    <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-2xl md:text-4xl text-white">
                        <span className="text-cyan-400 font-bold">V<sub>S1</sub></span>
                        <span className="text-slate-400">=</span>
                        <span className="text-yellow-400 font-bold">V<sub>S0</sub></span>
                        <span className="text-slate-400">×</span>
                        <span className="text-pink-400 font-bold">√</span>
                        <span className="text-slate-400">(</span>
                        <div className="flex flex-col items-center">
                            <span className="text-green-400 font-bold border-b-2 border-slate-500 px-2">W<sub>1</sub></span>
                            <span className="text-orange-400 font-bold px-2">W<sub>0</sub></span>
                        </div>
                        <span className="text-slate-400">)</span>
                    </div>

                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="bg-black/30 rounded-lg p-3">
                            <div className="text-cyan-400 font-bold">V<sub>S1</sub></div>
                            <div className="text-slate-400">New Stall Speed</div>
                        </div>
                        <div className="bg-black/30 rounded-lg p-3">
                            <div className="text-yellow-400 font-bold">V<sub>S0</sub></div>
                            <div className="text-slate-400">Base Stall Speed</div>
                        </div>
                        <div className="bg-black/30 rounded-lg p-3">
                            <div className="text-green-400 font-bold">W<sub>1</sub></div>
                            <div className="text-slate-400">New Weight</div>
                        </div>
                        <div className="bg-black/30 rounded-lg p-3">
                            <div className="text-orange-400 font-bold">W<sub>0</sub></div>
                            <div className="text-slate-400">Original Weight</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Calculator */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white mb-4">Input Values</h3>

                    {/* Base Stall Speed */}
                    <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                        <label className="flex justify-between text-xs font-bold uppercase mb-3">
                            <span className="text-yellow-400">Base Stall Speed (V<sub>S0</sub>)</span>
                            <span className="text-white">{baseStallSpeed} kt</span>
                        </label>
                        <input
                            type="range"
                            min="60"
                            max="180"
                            value={baseStallSpeed}
                            onChange={e => setBaseStallSpeed(Number(e.target.value))}
                            className="w-full accent-yellow-500 h-2"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>60 kt</span>
                            <span>180 kt</span>
                        </div>
                    </div>

                    {/* Base Mass */}
                    <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                        <label className="flex justify-between text-xs font-bold uppercase mb-3">
                            <span className="text-orange-400">Original Weight (W<sub>0</sub>)</span>
                            <span className="text-white">{(baseMass / 1000).toFixed(0)} tonnes</span>
                        </label>
                        <input
                            type="range"
                            min="20000"
                            max="80000"
                            step="1000"
                            value={baseMass}
                            onChange={e => setBaseMass(Number(e.target.value))}
                            className="w-full accent-orange-500 h-2"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>20t</span>
                            <span>80t</span>
                        </div>
                    </div>

                    {/* New Mass */}
                    <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                        <label className="flex justify-between text-xs font-bold uppercase mb-3">
                            <span className="text-green-400">New Weight (W<sub>1</sub>)</span>
                            <span className="text-white">{(newMass / 1000).toFixed(0)} tonnes</span>
                        </label>
                        <input
                            type="range"
                            min="20000"
                            max="100000"
                            step="1000"
                            value={newMass}
                            onChange={e => setNewMass(Number(e.target.value))}
                            className="w-full accent-green-500 h-2"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>20t</span>
                            <span>100t</span>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white mb-4">Calculation Results</h3>

                    {/* Calculation breakdown */}
                    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 font-mono">
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Mass Ratio (W₁/W₀):</span>
                                <span className={`font-bold ${massRatio > 1 ? 'text-rose-400' : 'text-green-400'}`}>
                                    {massRatio.toFixed(4)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Square Root:</span>
                                <span className="text-pink-400 font-bold">{Math.sqrt(massRatio).toFixed(4)}</span>
                            </div>
                            <div className="border-t border-slate-700 pt-3 flex justify-between">
                                <span className="text-slate-400">V<sub>S0</sub> × √(W₁/W₀):</span>
                                <span className="text-white font-bold">{baseStallSpeed} × {Math.sqrt(massRatio).toFixed(3)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Result Display */}
                    <div className={`rounded-xl p-6 text-center ${massRatio > 1
                            ? 'bg-rose-900/30 border-2 border-rose-500'
                            : 'bg-emerald-900/30 border-2 border-emerald-500'
                        }`}>
                        <div className="text-xs uppercase text-slate-400 mb-2">New Stall Speed (V<sub>S1</sub>)</div>
                        <div className={`text-5xl font-black ${massRatio > 1 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {newStallSpeed.toFixed(1)}
                            <span className="text-2xl ml-2">kt</span>
                        </div>
                        <div className={`mt-4 text-sm font-bold ${massRatio > 1 ? 'text-rose-300' : 'text-emerald-300'}`}>
                            {speedChange >= 0 ? '+' : ''}{speedChange.toFixed(1)} kt ({percentChange >= 0 ? '+' : ''}{percentChange.toFixed(1)}%)
                        </div>
                    </div>

                    {/* Speed Comparison Gauge */}
                    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                        <div className="text-xs text-slate-400 uppercase mb-3">Speed Comparison</div>
                        <div className="relative h-8 bg-slate-900 rounded-full overflow-hidden">
                            {/* Gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 via-yellow-500/30 to-red-500/30" />

                            {/* Base speed marker */}
                            <div
                                className="absolute top-0 bottom-0 w-1 bg-yellow-400 transition-all duration-300"
                                style={{ left: `${basePosition}%` }}
                            >
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-yellow-400 whitespace-nowrap font-bold">
                                    V<sub>S0</sub>: {baseStallSpeed}kt
                                </div>
                            </div>

                            {/* New speed marker */}
                            <div
                                className={`absolute top-0 bottom-0 w-1 transition-all duration-300 ${massRatio > 1 ? 'bg-rose-400' : 'bg-green-400'}`}
                                style={{ left: `${newPosition}%` }}
                            >
                                <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap font-bold ${massRatio > 1 ? 'text-rose-400' : 'text-green-400'}`}>
                                    V<sub>S1</sub>: {newStallSpeed.toFixed(0)}kt
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 mt-8">
                            <span>0 kt</span>
                            <span>100 kt</span>
                            <span>200 kt</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Point */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                    <Info size={20} /> Key Point
                </h3>
                <p className="text-slate-300">
                    An <strong className="text-rose-400">increase in weight</strong> will always result in an <strong className="text-rose-400">increase in stall speed</strong>.
                    This is why heavier aircraft require higher approach speeds and longer runways.
                </p>
            </div>
        </div>
    );
};

export default StallSpeedCalc;
