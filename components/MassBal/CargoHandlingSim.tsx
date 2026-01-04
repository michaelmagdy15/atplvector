import React, { useState } from 'react';
import { Package, ArrowLeftRight, Scale } from 'lucide-react';

const CargoHandlingSim: React.FC = () => {
    const [totalMass, setTotalMass] = useState(50000); // kg
    const [cargoMass, setCargoMass] = useState(1000); // kg
    const [distMoved, setDistMoved] = useState(0); // meters (- for fwd, + for aft)

    // Formula: Delta CG = (Mass Moved * Distance Moved) / Total Mass
    const deltaCG = (cargoMass * distMoved) / totalMass;

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <ArrowLeftRight className="text-purple-400" /> Load Shifting Simulator
            </h2>

            <div className="flex flex-col gap-8">
                
                {/* Visual Plane */}
                <div className="bg-slate-900 rounded-xl p-8 border border-slate-700 relative h-[250px] flex items-center justify-center overflow-hidden">
                    {/* Fuselage Outline */}
                    <div className="w-[80%] h-12 border-y-2 border-slate-500 relative flex items-center">
                        {/* Center Pivot (Initial CG) */}
                        <div className="absolute left-1/2 -translate-x-1/2 h-20 w-1 bg-white/20 top-[-20px]"></div>
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-15px] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-slate-500"></div>

                        {/* Draggable Cargo Box (Simulated via slider for now) */}
                        <div 
                            className="w-16 h-10 bg-orange-500 rounded border-2 border-orange-300 flex items-center justify-center absolute transition-all duration-300 shadow-lg z-10"
                            style={{ 
                                left: `calc(50% + ${(distMoved * 20)}px)`, // Scale factor for visual
                                transform: 'translateX(-50%)'
                            }}
                        >
                            <Package className="text-orange-900" size={20} />
                        </div>

                        {/* Visual Shift Arrow */}
                        {distMoved !== 0 && (
                            <div 
                                className={`absolute h-1 bg-white/50 top-1/2 -translate-y-1/2 transition-all duration-300`}
                                style={{
                                    left: '50%',
                                    width: `${Math.abs(distMoved * 20)}px`,
                                    transform: distMoved < 0 ? 'translateX(-100%)' : 'translateX(0)'
                                }}
                            ></div>
                        )}
                    </div>
                    
                    {/* CG Shift Indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
                        <p className="text-xs text-slate-500 uppercase font-bold">New CG Position</p>
                        <div className={`text-xl font-black ${deltaCG === 0 ? 'text-white' : deltaCG > 0 ? 'text-red-400' : 'text-blue-400'}`}>
                            {deltaCG === 0 ? 'No Change' : `${Math.abs(deltaCG).toFixed(3)}m ${deltaCG > 0 ? 'AFT' : 'FWD'}`}
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Total Aircraft Mass</label>
                        <input 
                            type="range" min="10000" max="100000" step="1000" 
                            value={totalMass} onChange={e => setTotalMass(Number(e.target.value))}
                            className="w-full accent-slate-500"
                        />
                        <div className="text-right text-white font-mono">{totalMass} kg</div>
                    </div>

                    <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Cargo Mass to Move</label>
                        <input 
                            type="range" min="100" max="5000" step="100" 
                            value={cargoMass} onChange={e => setCargoMass(Number(e.target.value))}
                            className="w-full accent-orange-500"
                        />
                        <div className="text-right text-orange-400 font-mono">{cargoMass} kg</div>
                    </div>

                    <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Distance Moved (FWD / AFT)</label>
                        <input 
                            type="range" min="-10" max="10" step="0.5" 
                            value={distMoved} onChange={e => setDistMoved(Number(e.target.value))}
                            className="w-full accent-purple-500"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>FWD</span>
                            <span>AFT</span>
                        </div>
                        <div className="text-center text-purple-400 font-mono text-lg font-bold mt-1">
                            {distMoved > 0 ? `+${distMoved}m` : `${distMoved}m`}
                        </div>
                    </div>
                </div>

                <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-500/30 flex items-center justify-center gap-4">
                    <Scale className="text-indigo-400" />
                    <div>
                        <p className="text-xs text-indigo-300 font-bold uppercase">Formula to Remember</p>
                        <p className="text-white font-mono text-lg">ΔCG = (Mass Moved × Distance) / Total Mass</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CargoHandlingSim;