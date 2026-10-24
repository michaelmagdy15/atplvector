import React, { useState, useMemo } from 'react';
import { TrendingUp, ArrowUp, ArrowRight, ShieldAlert, Wind, Layers } from 'lucide-react';

const LiftDrag: React.FC = () => {
    const [aoa, setAoa] = useState(4); // Angle of Attack
    const [tas, setTas] = useState(140); // Knots
    const [altitude, setAltitude] = useState(5000); // Feet

    // ISA density calculation
    const rho = useMemo(() => {
        const tempC = 15 - (altitude / 1000) * 1.98;
        const tempK = tempC + 273.15;
        const pRatio = Math.pow(Math.max(0.01, 1 - 2.25577e-5 * (altitude * 0.3048)), 5.25588);
        return (101325 * pRatio) / (287.05 * tempK);
    }, [altitude]);

    // Dynamic pressure q = 0.5 * rho * V^2 (V in m/s)
    const vMs = tas * 0.514444;
    const dynamicPressureQ = 0.5 * rho * vMs * vMs;

    // Aerodynamic coefficients
    const stallAngle = 16;
    const isStalled = aoa > stallAngle;
    const cl = useMemo(() => {
        if (aoa <= stallAngle) {
            return Math.max(0, 0.11 * (aoa - (-4))); // Cambered airfoil zero lift at -4°
        }
        return Math.max(0.2, 0.11 * (stallAngle - (-4)) - 0.12 * (aoa - stallAngle));
    }, [aoa]);

    const cd = useMemo(() => {
        const cd0 = 0.025;
        const k = 0.045; // Induced drag factor
        let val = cd0 + k * Math.pow(cl, 2);
        if (aoa > stallAngle) {
            val += 0.08 * (aoa - stallAngle); // massive form drag separation
        }
        return val;
    }, [aoa, cl]);

    const wingArea = 18; // m^2
    const liftForceN = cl * dynamicPressureQ * wingArea;
    const dragForceN = cd * dynamicPressureQ * wingArea;
    const ldRatio = cd > 0 ? cl / cd : 0;

    return (
        <div className="bg-slate-800/80 rounded-2xl p-6 shadow-xl border border-slate-700 mt-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <TrendingUp className="text-emerald-400" /> Aerodynamic Force Vectors & The Lift Equation
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                        Lift: <span className="text-emerald-400 font-mono">L = C<sub>L</sub> · ½ρV² · S</span> | Drag: <span className="text-red-400 font-mono">D = C<sub>D</sub> · ½ρV² · S</span>
                    </p>
                </div>

                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-slate-900 text-xs font-mono text-sky-400 rounded-lg border border-slate-700">
                        q = {Math.round(dynamicPressureQ)} Pa
                    </span>
                    <span className="px-3 py-1 bg-slate-900 text-xs font-mono text-emerald-400 rounded-lg border border-slate-700">
                        L = {(liftForceN / 1000).toFixed(1)} kN
                    </span>
                    <span className="px-3 py-1 bg-slate-900 text-xs font-mono text-red-400 rounded-lg border border-slate-700">
                        D = {(dragForceN / 1000).toFixed(1)} kN
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Flight Sliders */}
                <div className="lg:col-span-4 space-y-5">
                    <div>
                        <label className="text-slate-300 text-xs font-bold flex justify-between mb-1.5">
                            <span>Angle of Attack (α)</span>
                            <span className={`font-mono ${isStalled ? 'text-red-400 font-bold' : 'text-emerald-400'}`}>
                                {aoa}°
                            </span>
                        </label>
                        <input 
                            type="range" min="-4" max="22" value={aoa} 
                            onChange={e => setAoa(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                            <span>-4° (α0L)</span>
                            <span>16° (Critical α)</span>
                            <span>22°</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-slate-300 text-xs font-bold flex justify-between mb-1.5">
                            <span>Airspeed (TAS)</span>
                            <span className="text-sky-400 font-mono">{tas} kt</span>
                        </label>
                        <input 
                            type="range" min="60" max="250" value={tas} 
                            onChange={e => setTas(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                    </div>

                    <div>
                        <label className="text-slate-300 text-xs font-bold flex justify-between mb-1.5">
                            <span>Altitude</span>
                            <span className="text-purple-400 font-mono">{altitude.toLocaleString()} ft</span>
                        </label>
                        <input 
                            type="range" min="0" max="30000" step="1000" value={altitude} 
                            onChange={e => setAltitude(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                    </div>
                    
                    <div className="bg-slate-900/90 p-4 rounded-xl text-xs space-y-2 border border-slate-700">
                        <div className="flex justify-between">
                            <span className="text-emerald-400 font-semibold">Lift Coefficient (C<sub>L</sub>)</span>
                            <span className="text-white font-mono">{cl.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-red-400 font-semibold">Drag Coefficient (C<sub>D</sub>)</span>
                            <span className="text-white font-mono">{cd.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-700 pt-2">
                            <span className="text-sky-400 font-semibold">Lift / Drag Ratio (L/D)</span>
                            <span className="text-white font-mono">{ldRatio.toFixed(1)}</span>
                        </div>
                    </div>
                </div>

                {/* Aerofoil Visualizer & Vector Decomposition */}
                <div className="lg:col-span-8 bg-[#0b1324] rounded-2xl relative h-[340px] flex items-center justify-center overflow-hidden border border-slate-700">
                    {/* Relative Wind indicator */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 text-xs text-slate-400">
                        <Wind size={16} className="text-sky-400" />
                        <span>Relative Airflow →</span>
                    </div>

                    {/* Airflow Streamlines */}
                    <div className="absolute inset-0 pointer-events-none opacity-20">
                        <div className="h-0.5 bg-sky-400 w-full absolute top-[30%]" />
                        <div className="h-0.5 bg-sky-400 w-full absolute top-[50%]" />
                        <div className="h-0.5 bg-sky-400 w-full absolute top-[70%]" />
                    </div>

                    {/* Airfoil representation */}
                    <div className="relative transition-transform duration-300" style={{ transform: `rotate(-${aoa}deg)` }}>
                        {/* Cambered shape */}
                        <svg width="220" height="60" viewBox="0 0 220 60" className="drop-shadow-lg">
                            <path 
                                d="M 10 30 C 40 10, 100 8, 210 30 C 130 45, 50 45, 10 30 Z" 
                                fill={isStalled ? '#7f1d1d' : '#334155'} 
                                stroke={isStalled ? '#ef4444' : '#94a3b8'} 
                                strokeWidth="2" 
                            />
                            {/* Chord line */}
                            <line x1="10" y1="30" x2="210" y2="30" stroke="#facc15" strokeDasharray="3 3" strokeWidth="1" />
                        </svg>
                        
                        {/* Lift Vector (Perpendicular to Relative Airflow - straight up) */}
                        <div 
                            className="absolute top-1/2 left-1/3 w-1.5 bg-emerald-400 origin-bottom transition-all duration-300 rounded" 
                            style={{ 
                                height: `${Math.min(150, cl * 80)}px`, 
                                transform: `translate(-50%, -100%) rotate(${aoa}deg)` 
                            }}
                        >
                            <ArrowUp className="absolute -top-4 -left-2 text-emerald-400" size={20} />
                            <span className="absolute -top-8 -left-3 text-[10px] font-bold text-emerald-400 whitespace-nowrap">
                                Lift ({cl.toFixed(2)})
                            </span>
                        </div>

                        {/* Drag Vector (Parallel to Relative Airflow - straight back/right) */}
                        <div 
                            className="absolute top-1/2 left-1/3 h-1.5 bg-red-400 origin-left transition-all duration-300 rounded" 
                            style={{ 
                                width: `${Math.min(180, cd * 400)}px`, 
                                transform: `translate(0, -50%) rotate(${aoa}deg)` 
                            }}
                        >
                            <ArrowRight className="absolute -right-4 -top-2 text-red-400" size={20} />
                            <span className="absolute -top-5 right-0 text-[10px] font-bold text-red-400 whitespace-nowrap">
                                Drag ({cd.toFixed(3)})
                            </span>
                        </div>
                    </div>

                    {/* Stall Warning Banner */}
                    {isStalled && (
                        <div className="absolute top-4 right-4 bg-red-600/90 text-white font-black text-xs px-4 py-2 rounded-xl flex items-center gap-2 border border-red-400 shadow-xl animate-pulse">
                            <ShieldAlert size={16} /> STALL: α &gt; α<sub>crit</sub> (Separated Flow)
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LiftDrag;
