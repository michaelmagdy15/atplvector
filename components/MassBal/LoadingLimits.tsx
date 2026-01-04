
import React, { useState } from 'react';
import { Package, Scale, ArrowRight, AlertTriangle } from 'lucide-react';

const LoadingLimits: React.FC = () => {
    const [mass, setMass] = useState(500); // kg
    const [length, setLength] = useState(1); // m
    const [width, setWidth] = useState(1); // m

    // Aircraft Limits
    const MAX_RUNNING_LOAD = 400; // kg/m
    const MAX_FLOOR_LOAD = 300; // kg/m²

    // Calculations
    const area = length * width;
    const runningLoad = mass / length;
    const floorLoad = mass / area;

    const runningOk = runningLoad <= MAX_RUNNING_LOAD;
    const floorOk = floorLoad <= MAX_FLOOR_LOAD;

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Package className="text-orange-400" /> Loading Limits (031.06)
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
                
                {/* Inputs */}
                <div className="space-y-6">
                    <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                        <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Package Mass</label>
                        <input type="range" min="100" max="1000" step="10" value={mass} onChange={e => setMass(Number(e.target.value))} className="w-full accent-white" />
                        <div className="text-right text-2xl font-mono text-white">{mass} kg</div>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-slate-900 p-5 rounded-lg border border-slate-700 flex-1">
                            <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Length (x)</label>
                            <input type="range" min="0.5" max="3" step="0.1" value={length} onChange={e => setLength(Number(e.target.value))} className="w-full accent-white" />
                            <div className="text-right text-xl font-mono text-white">{length} m</div>
                        </div>
                        <div className="bg-slate-900 p-5 rounded-lg border border-slate-700 flex-1">
                            <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Width (y)</label>
                            <input type="range" min="0.5" max="3" step="0.1" value={width} onChange={e => setWidth(Number(e.target.value))} className="w-full accent-white" />
                            <div className="text-right text-xl font-mono text-white">{width} m</div>
                        </div>
                    </div>
                </div>

                {/* Analysis */}
                <div className="space-y-4">
                    {/* Running Load */}
                    <div className={`p-6 rounded-xl border-l-4 transition-all ${runningOk ? 'bg-slate-700 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
                        <h3 className="font-bold text-white mb-2">Linear (Running) Load</h3>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs text-slate-400">Mass / Length</p>
                                <p className={`text-2xl font-mono font-bold ${runningOk ? 'text-green-400' : 'text-red-400'}`}>
                                    {runningLoad.toFixed(1)} <span className="text-sm">kg/m</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400">Limit</p>
                                <p className="text-white font-bold">{MAX_RUNNING_LOAD} kg/m</p>
                            </div>
                        </div>
                        {!runningOk && <p className="text-red-400 text-xs mt-2 font-bold flex items-center"><AlertTriangle size={12} className="mr-1"/> EXCEEDED: Use spreaders to increase length!</p>}
                    </div>

                    {/* Area Load */}
                    <div className={`p-6 rounded-xl border-l-4 transition-all ${floorOk ? 'bg-slate-700 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
                        <h3 className="font-bold text-white mb-2">Area (Floor) Load</h3>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs text-slate-400">Mass / Area</p>
                                <p className={`text-2xl font-mono font-bold ${floorOk ? 'text-green-400' : 'text-red-400'}`}>
                                    {floorLoad.toFixed(1)} <span className="text-sm">kg/m²</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400">Limit</p>
                                <p className="text-white font-bold">{MAX_FLOOR_LOAD} kg/m²</p>
                            </div>
                        </div>
                         {!floorOk && <p className="text-red-400 text-xs mt-2 font-bold flex items-center"><AlertTriangle size={12} className="mr-1"/> EXCEEDED: Use spreaders to increase area!</p>}
                    </div>
                </div>

            </div>
            
            {/* Visualizer Box */}
            <div className="mt-8 flex justify-center">
                 <div 
                    className="bg-orange-500/80 border-2 border-orange-300 relative flex items-center justify-center shadow-lg transition-all duration-300"
                    style={{ 
                        width: `${width * 100}px`, 
                        height: `${length * 100}px` 
                    }}
                 >
                    <div className="text-center">
                        <Package className="text-white opacity-50 mx-auto" />
                        <span className="text-white font-bold text-xs">{mass}kg</span>
                    </div>
                    {/* Spreader indication if failed */}
                    {(!runningOk || !floorOk) && (
                        <div className="absolute -bottom-6 w-full text-center text-[10px] text-red-400 font-bold uppercase animate-pulse">
                            Structural Danger
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default LoadingLimits;
