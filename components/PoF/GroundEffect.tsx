import React, { useState } from 'react';
import { ArrowDown, Plane } from 'lucide-react';

const GroundEffect: React.FC = () => {
    const [height, setHeight] = useState(1); // Wingspans

    const isGroundEffect = height < 0.5;
    const inducedDragFactor = height < 1 ? (height * 0.8 + 0.2) : 1; // Simplified reduction factor

    return (
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <ArrowDown className="text-yellow-400" /> Ground Effect
            </h2>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Visualization */}
                <div className="flex-1 bg-[#0f172a] rounded-xl border border-slate-600 h-[400px] relative overflow-hidden flex flex-col justify-end">

                    {/* Sky */}
                    <div className="absolute inset-0 bg-gradient-to-b from-sky-900/20 to-transparent pointer-events-none"></div>

                    {/* Plane */}
                    <div
                        className="absolute left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-out z-10"
                        style={{ bottom: `${height * 200}px` }}
                    >
                        <Plane size={64} className="text-white transform -rotate-90" />

                        {/* Vortices Visual */}
                        <div className={`absolute -bottom-4 left-0 w-20 h-10 rounded-full border-t-4 border-slate-400 opacity-50 transform -translate-x-full transition-all duration-500 ${isGroundEffect ? 'scale-x-150 rotate-12' : 'scale-100 rotate-45'}`}></div>
                        <div className={`absolute -bottom-4 right-0 w-20 h-10 rounded-full border-t-4 border-slate-400 opacity-50 transform translate-x-full transition-all duration-500 ${isGroundEffect ? 'scale-x-150 -rotate-12' : 'scale-100 -rotate-45'}`}></div>
                    </div>

                    {/* Ground */}
                    <div className="h-2 bg-emerald-500 w-full z-20 shadow-[0_0_20px_theme('colors.emerald.500')]"></div>
                    <div className="h-8 bg-emerald-900/50 w-full z-20">
                        <div className="text-center text-xs text-emerald-400 py-1">Ground / Water Surface</div>
                    </div>

                    {/* Cushion Effect Visual */}
                    {isGroundEffect && (
                        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-40 h-20 bg-white/5 rounded-full blur-xl animate-pulse">
                        </div>
                    )}
                </div>

                {/* Controls & Data */}
                <div className="w-full md:w-1/3 space-y-8">
                    <div>
                        <label className="text-slate-400 text-sm block mb-2 flex justify-between">
                            <span>Height above Ground (Wingspans)</span>
                            <span className="text-white font-mono">{height.toFixed(2)} b</span>
                        </label>
                        <input
                            type="range" min="0.1" max="1.5" step="0.05"
                            value={height}
                            onChange={e => setHeight(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                        />
                    </div>

                    <div className={`p-4 rounded-lg border transition-colors duration-300 ${isGroundEffect ? 'bg-indigo-900/30 border-indigo-500' : 'bg-slate-800 border-slate-700'}`}>
                        <h3 className="font-bold text-white mb-4">Aerodynamic Changes</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-300">Induced Drag</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${inducedDragFactor * 100}%` }}></div>
                                    </div>
                                    <span className="text-white font-mono text-sm">{(inducedDragFactor * 100).toFixed(0)}%</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-slate-300">Effective Lift</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                                        {/* Lift increases as height decreases */}
                                        <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(1 + (1 - inducedDragFactor) * 0.5) * 100}%` }}></div>
                                    </div>
                                    <span className="text-white font-mono text-sm">+{(((1 + (1 - inducedDragFactor) * 0.5) - 1) * 100).toFixed(0)}%</span>
                                </div>
                            </div>

                            <div className="border-t border-slate-600 pt-3 mt-2">
                                <span className="block text-sm font-semibold text-white mb-1">Pilot effects:</span>
                                <ul className="text-xs text-slate-400 list-disc ml-4 space-y-1">
                                    <li>"Floating" during flare</li>
                                    <li>Ballooning if speed too high</li>
                                    <li>Premature liftoff possible</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroundEffect;
