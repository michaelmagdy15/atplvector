
import React, { useState } from 'react';
import { TrendingUp, ArrowUp, ArrowRight } from 'lucide-react';

const LiftDrag: React.FC = () => {
    const [aoa, setAoa] = useState(4); // Angle of Attack

    // Simplified curve logic
    const cl = Math.sin(aoa * (Math.PI/180)) * 10;
    const cd = 0.02 + (Math.pow(cl, 2) * 0.05); // Drag Polar approx

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
             <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="text-green-500" /> Aerodynamic Forces
            </h2>

            <div className="flex gap-8">
                <div className="w-1/3 space-y-6">
                    <div>
                        <label className="text-slate-400 text-sm block mb-2">Angle of Attack (α)</label>
                        <input 
                            type="range" min="0" max="20" value={aoa} 
                            onChange={e => setAoa(Number(e.target.value))}
                            className="w-full"
                        />
                        <div className="text-right text-white font-mono">{aoa}°</div>
                    </div>
                    
                    <div className="bg-slate-900 p-4 rounded text-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-green-400">Lift Coeff (CL)</span>
                            <span className="text-white font-mono">{cl.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-red-400">Drag Coeff (CD)</span>
                            <span className="text-white font-mono">{cd.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-700 pt-2">
                            <span className="text-sky-400">L/D Ratio</span>
                            <span className="text-white font-mono">{(cl/cd).toFixed(1)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-slate-900 rounded-xl relative h-[300px] flex items-center justify-center overflow-hidden border border-slate-600">
                    {/* Airfoil representation */}
                    <div className="relative transition-transform duration-300" style={{ transform: `rotate(-${aoa}deg)` }}>
                        <div className="w-48 h-8 bg-slate-300 rounded-full"></div>
                        
                        {/* Vectors - Fixed relative to airflow (horizontal) or body? Lift is perp to airflow. */}
                        {/* We'll simplify: Airflow coming from left. Lift Up, Drag Right. */}
                        
                        {/* Lift Vector */}
                        <div className="absolute top-1/2 left-1/2 w-1 bg-green-500 origin-bottom transition-all duration-300" 
                             style={{ height: `${cl * 30}px`, transform: `translate(-50%, -100%) rotate(${aoa}deg)` }}>
                             <ArrowUp className="absolute -top-4 -left-1.5 text-green-500" />
                        </div>

                        {/* Drag Vector */}
                        <div className="absolute top-1/2 left-1/2 h-1 bg-red-500 origin-left transition-all duration-300" 
                             style={{ width: `${cd * 500}px`, transform: `translate(0, -50%) rotate(${aoa}deg)` }}>
                             <ArrowRight className="absolute -right-4 -top-1.5 text-red-500" />
                        </div>
                    </div>

                    {/* Stall Warning */}
                    {aoa > 15 && (
                        <div className="absolute top-4 right-4 bg-red-600 text-white font-bold px-4 py-2 rounded animate-pulse">
                            STALL
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LiftDrag;
