import React, { useState } from 'react';
import { Cloud, ArrowUp, Thermometer, Gauge } from 'lucide-react';

const AtmosphereProp: React.FC = () => {
    const [altitude, setAltitude] = useState(0); // Feet

    // ISA Calculations (Simplified for visualization)
    // T = 15 - 1.98 * (h/1000)
    // P = 1013.25 * (1 - 2.25577e-5 * h)^5.25588
    // Rho = P / (287.05 * (T + 273.15))

    const tempC = 15 - (1.98 * (altitude / 1000));
    const pressHpa = 1013.25 * Math.pow((1 - 2.25577e-5 * altitude), 5.25588);
    const density = (pressHpa * 100) / (287.05 * (tempC + 273.15)); // kg/m3
    const densityRatio = density / 1.225; // Sigma

    return (
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Cloud className="text-sky-400" /> ISA Atmosphere Properties
            </h2>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Controls */}
                <div className="w-full md:w-1/3 space-y-6">
                    <div>
                        <label className="text-slate-400 text-sm block mb-2">Altitude (ft)</label>
                        <input
                            type="range" min="0" max="40000" step="1000"
                            value={altitude}
                            onChange={e => setAltitude(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                        <div className="text-right text-sky-400 font-mono text-xl mt-1">{altitude.toLocaleString()} ft</div>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-lg space-y-3">
                        <h3 className="text-slate-300 font-semibold mb-2">ISA Stardard Values</h3>
                        <div className="flex justify-between items-center bg-slate-700/50 p-2 rounded">
                            <span className="flex items-center gap-2 text-slate-400">
                                <Thermometer size={16} /> Temperature
                            </span>
                            <span className="text-white font-mono">{tempC.toFixed(1)}°C</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-700/50 p-2 rounded">
                            <span className="flex items-center gap-2 text-slate-400">
                                <Gauge size={16} /> Pressure
                            </span>
                            <span className="text-white font-mono">{pressHpa.toFixed(1)} hPa</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-700/50 p-2 rounded">
                            <span className="flex items-center gap-2 text-slate-400">
                                <Cloud size={16} /> Density (ρ)
                            </span>
                            <span className="text-white font-mono">{density.toFixed(3)} kg/m³</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-700/50 p-2 rounded border-t border-slate-600 mt-2 pt-2">
                            <span className="text-slate-400">Relative Density (σ)</span>
                            <span className="text-yellow-400 font-mono">{densityRatio.toFixed(3)}</span>
                        </div>
                    </div>
                </div>

                {/* Visualization */}
                <div className="flex-1 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#334155] rounded-xl relative h-[400px] overflow-hidden border border-slate-600">
                    {/* Altitude Marker */}
                    <div className="absolute right-0 w-16 h-full flex flex-col justify-between text-xs text-slate-500 pr-2 py-4 border-l border-slate-700/50 bg-slate-900/30">
                        <span>40,000</span>
                        <span>30,000</span>
                        <span>20,000</span>
                        <span>10,000</span>
                        <span>0 ft</span>
                    </div>

                    {/* Plane Icon */}
                    <div
                        className="absolute left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-out"
                        style={{ bottom: `${(altitude / 45000) * 100}%` }}
                    >
                        <div className="relative">
                            <ArrowUp className="text-sky-500 rotate-45 w-8 h-8" />
                            <div className="absolute top-0 -right-24 bg-slate-800/80 px-2 py-1 rounded text-xs text-white whitespace-nowrap">
                                {altitude.toLocaleString()} ft
                            </div>
                        </div>
                    </div>

                    {/* Density Visual (Particles) */}
                    {/* We can simulate density by opacity or number of dots */}
                    <div className="absolute inset-0 pointer-events-none p-4">
                        <div className="w-full h-full relative opacity-30">
                            {Array.from({ length: Math.floor(densityRatio * 100) }).map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute bg-white rounded-full w-1 h-1 animate-pulse"
                                    style={{
                                        left: `${Math.random() * 80}%`,
                                        top: `${Math.random() * 100}%`,
                                        animationDelay: `${Math.random() * 2}s`
                                    }}
                                />
                            ))}
                        </div>
                        <div className="absolute bottom-4 left-4 text-xs text-slate-400">
                            * Particle density represents air density
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AtmosphereProp;
