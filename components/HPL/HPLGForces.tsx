import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, ArrowUp } from 'lucide-react';

const HPLGForces: React.FC = () => {
    const [gLoad, setGLoad] = useState(1);

    // G-Tolerance simple model
    const getPhysiologicalEffect = (g: number) => {
        if (g < 2.5) return { stage: 'Normal', desc: 'No significant effects.', color: 'text-emerald-400' };
        if (g < 3.5) return { stage: 'Grey Out', desc: 'Loss of peripheral vision. Blood pooling in legs.', color: 'text-yellow-400' };
        if (g < 4.5) return { stage: 'Black Out', desc: 'Complete loss of vision. Consciousness remains.', color: 'text-orange-500' };
        return { stage: 'G-LOC', desc: 'G-induced Loss Of Consciousness. Incapacitation.', color: 'text-red-500' };
    };

    const effect = getPhysiologicalEffect(gLoad);

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <TrendingUp className="text-blue-400" />
                Acceleration & G-Forces
            </h2>
            <p className="text-slate-400 text-sm mb-6">
                Positive Gz acceleration forces blood away from the head, leading to visual symptoms and eventually unconsciousness.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Controls & Graph */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <div className="mb-8">
                        <label className="block text-slate-300 font-bold mb-2">Applied Load: +{gLoad.toFixed(1)} Gz</label>
                        <input
                            type="range"
                            min="1.0"
                            max="6.0"
                            step="0.1"
                            value={gLoad}
                            onChange={(e) => setGLoad(parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>1G</span>
                            <span>2G</span>
                            <span>3G</span>
                            <span>4G</span>
                            <span>5G</span>
                            <span>6G</span>
                        </div>
                    </div>

                    <div className="relative h-64 border-l border-b border-slate-600">
                        {/* Simple Bar Chart Representation */}
                        <div
                            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-blue-600 transition-all duration-300 rounded-t"
                            style={{ height: `${(gLoad / 6) * 100}%`, width: '40px' }}
                        ></div>

                        {/* Threshold Lines */}
                        <div className="absolute w-full border-t border-dashed border-yellow-600 bottom-[41.6%]"><span className="text-xs text-yellow-600 absolute right-0 -top-4">Grey Out (~2.5G)</span></div>
                        <div className="absolute w-full border-t border-dashed border-orange-600 bottom-[58.3%]"><span className="text-xs text-orange-600 absolute right-0 -top-4">Black Out (~3.5G)</span></div>
                        <div className="absolute w-full border-t border-dashed border-red-600 bottom-[75%]"><span className="text-xs text-red-600 absolute right-0 -top-4">G-LOC (~4.5G)</span></div>
                    </div>
                </div>

                {/* Physiology Visualizer */}
                <div className="space-y-6">
                    <div className={`p-6 rounded-xl border-2 ${gLoad > 4.5 ? 'border-red-500 bg-red-900/10' : 'border-slate-600 bg-slate-900'}`}>
                        <h3 className={`text-3xl font-black mb-2 ${effect.color}`}>{effect.stage}</h3>
                        <p className="text-slate-300">{effect.desc}</p>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                            <ArrowUp size={16} /> Improving Tolerance
                        </h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-400 font-bold">+1.0G</span>
                                Anti-G Straining Maneuver (AGSM) - Muscle tensing to force blood up.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-400 font-bold">+1.5G</span>
                                Anti-G Trousers (G-Suit) - Mechanical pressure on legs/abdomen.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-400 font-bold">-0.5G</span>
                                Factors reducing tolerance: Hypoglycemia, Smoking, Alcohol, Fatigue.
                            </li>
                        </ul>
                    </div>

                    {gLoad > 2 && (
                        <div className="flex items-center gap-3 p-4 bg-yellow-900/20 border border-yellow-600/50 rounded-lg">
                            <AlertTriangle className="text-yellow-500 shrink-0" />
                            <div>
                                <h4 className="text-sm font-bold text-yellow-400">Tunnel Vision</h4>
                                <p className="text-xs text-slate-400">At this level, your peripheral field of view is restricting. Check your scan.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HPLGForces;
