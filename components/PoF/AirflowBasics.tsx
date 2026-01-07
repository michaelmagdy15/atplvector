import React, { useState } from 'react';
import { Wind, ArrowRight, Activity } from 'lucide-react';

const AirflowBasics: React.FC = () => {
    const [constriction, setConstriction] = useState(50); // % of width

    // Bernoulli calc placeholders
    // A1*V1 = A2*V2
    // P + 0.5*rho*v^2 = const
    const v1 = 100;
    const a1 = 100;
    const a2 = constriction;
    const v2 = (a1 * v1) / a2;

    const p1 = 1013;
    const rho = 1.225;
    // P2 = P1 + 0.5*rho*(v1^2 - v2^2) (Simplification for Pa, but we'll just show relative drop)
    // Using dynamic pressure q = 0.5*rho*v^2
    const q1 = 0.5 * rho * Math.pow(v1 / 10, 2); // Scale down V for nicer numbers
    const q2 = 0.5 * rho * Math.pow(v2 / 10, 2);

    const p2Estimate = p1 - (q2 - q1);

    return (
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Wind className="text-sky-400" /> Airflow & Bernoulli's Principle
            </h2>

            <div className="flex flex-col gap-8">
                {/* Visualization of Venturi Tube */}
                <div className="relative h-[250px] bg-[#0f172a] rounded-xl border border-slate-600 flex items-center overflow-hidden">
                    {/* Top Wall */}
                    <div
                        className="absolute top-0 left-0 right-0 bg-slate-700 transition-all duration-300 ease-out z-10"
                        style={{ height: `${(100 - constriction) / 2}%` }}
                    />
                    {/* Bottom Wall */}
                    <div
                        className="absolute bottom-0 left-0 right-0 bg-slate-700 transition-all duration-300 ease-out z-10"
                        style={{ height: `${(100 - constriction) / 2}%` }}
                    />

                    {/* Streamlines */}
                    <div className="absolute inset-0 flex flex-col justify-center gap-2 px-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-1 w-full opacity-50">
                                <div className="h-0.5 bg-sky-400 w-1/3" />
                                <div className="h-0.5 bg-sky-300 w-1/3 transition-all duration-300"
                                    style={{ transform: `scaleX(${v2 / v1})`, transformOrigin: 'left' }} />
                                <div className="h-0.5 bg-sky-400 w-1/3" style={{ marginLeft: 'auto' }} />
                            </div>
                        ))}
                    </div>

                    {/* Labels */}
                    <div className="absolute left-10 top-1/2 transform -translate-y-1/2 text-center z-20">
                        <div className="text-white font-bold">Inlet</div>
                        <div className="text-xs text-sky-300">V1 = {v1} kt</div>
                        <div className="text-xs text-yellow-300">P1 = {p1} hPa</div>
                    </div>

                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-20">
                        <div className="text-white font-bold">Throat</div>
                        <div className="text-xs text-sky-300">V2 = {Math.round(v2)} kt</div>
                        <div className="text-xs text-yellow-300">P2 = {p2Estimate.toFixed(1)} hPa</div>
                    </div>

                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="text-slate-400 text-sm block mb-2">Throat Constriction</label>
                        <input
                            type="range" min="20" max="100" step="1"
                            value={constriction}
                            onChange={e => setConstriction(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-2">
                            <span>Narrow</span>
                            <span>Wide</span>
                        </div>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-lg">
                        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                            <Activity size={16} /> Concept Summary
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Acccording to the <span className="text-yellow-400">Equation of Continuity</span> (A × V = Constant), as area decreases, velocity MUST increase.
                            <br /><br />
                            According to <span className="text-sky-400">Bernoulli's Principle</span>, as velocity increases (dynamic pressure rises), the static pressure MUST decrease to keep total energy constant.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AirflowBasics;
