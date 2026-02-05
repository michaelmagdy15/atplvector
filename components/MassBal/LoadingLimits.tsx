import React, { useState } from 'react';
import { motion } from 'framer-motion';

const LoadingLimits: React.FC = () => {
    // Limits
    const STRUCTURAL_TOM = 78000;
    const STRUCTURAL_LM = 66000;
    const STRUCTURAL_ZFM = 62000;

    // Inputs
    const [runwayLength, setRunwayLength] = useState(2500); // meters
    const [obstacles, setObstacles] = useState(false);
    const [temp, setTemp] = useState(15); // Celsius
    const [tripFuel, setTripFuel] = useState(4000);

    // Performance Calculations (Simplified)
    // PLTOM decreases as Runway decreases, Temp increases, Obstacles exist
    const calculatePLTOM = () => {
        let pltom = 80000;
        pltom -= (3000 - runwayLength) * 10; // 10kg per meter less runway
        pltom -= (temp - 15) * 200; // 200kg per degree above ISA
        if (obstacles) pltom -= 5000;
        return Math.max(pltom, 40000);
    };

    // PLLM decreases as Runway decreases
    const calculatePLLM = () => {
        let pllm = 70000;
        pllm -= (3000 - runwayLength) * 8;
        return pllm;
    };

    const PLTOM = calculatePLTOM();
    const PLLM = calculatePLLM();

    // Regulated (Allowed) Limits - The LOWEST of Structural or Performance
    const ATOM = Math.min(STRUCTURAL_TOM, PLTOM); // Allowed Take-off Mass
    const ALM = Math.min(STRUCTURAL_LM, PLLM);    // Allowed Landing Mass

    // To find the Max Take-off Mass allowed by Landing Limit:
    // Max TOM (Landing Limited) = Allowed Landing Mass + Trip Fuel
    const TOM_LandingLimited = ALM + tripFuel;

    // The ACTUAL Regulated TOM is the lowest of:
    // 1. Structural TOM
    // 2. Perf Limited TOM
    // 3. Structural Max Zero Fuel Mass + Takeoff Fuel (Not modeled here for simplicity of graph, assumed sufficient)
    // 4. Max Landing Mass + Trip Fuel

    const RTOM = Math.min(ATOM, TOM_LandingLimited);
    const limitingFactor = RTOM === STRUCTURAL_TOM ? 'Structural TOM' :
        RTOM === PLTOM ? 'Performance (Runway/Climb)' :
            'Landing Mass Limit (+Trip Fuel)';


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 h-full font-sans">
            {/* Controls */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 space-y-8">
                <div>
                    <h3 className="text-xl font-bold text-white mb-6">Flight Conditions</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <label className="text-slate-400">Runway Length</label>
                                <span className="text-blue-400 font-mono">{runwayLength} m</span>
                            </div>
                            <input
                                type="range"
                                min="1500"
                                max="4000"
                                step="100"
                                value={runwayLength}
                                onChange={(e) => setRunwayLength(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <label className="text-slate-400">Temperature (OAT)</label>
                                <span className="text-amber-400 font-mono">{temp}°C</span>
                            </div>
                            <input
                                type="range"
                                min="-20"
                                max="50"
                                value={temp}
                                onChange={(e) => setTemp(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <label className="text-slate-400">Trip Fuel</label>
                                <span className="text-emerald-400 font-mono">{tripFuel} kg</span>
                            </div>
                            <input
                                type="range"
                                min="1000"
                                max="20000"
                                step="500"
                                value={tripFuel}
                                onChange={(e) => setTripFuel(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="obs"
                                checked={obstacles}
                                onChange={(e) => setObstacles(e.target.checked)}
                                className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
                            />
                            <label htmlFor="obs" className="text-slate-300">Significant Obstacles in Climb Path</label>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                    <h4 className="font-bold text-slate-300 mb-2">Structural Limits (Fixed)</h4>
                    <div className="space-y-1 text-sm text-slate-400">
                        <div className="flex justify-between">
                            <span>Max Structural TOM:</span>
                            <span className="font-mono text-slate-200">{STRUCTURAL_TOM} kg</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Max Structural LM:</span>
                            <span className="font-mono text-slate-200">{STRUCTURAL_LM} kg</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Max Zero Fuel Mass:</span>
                            <span className="font-mono text-slate-200">{STRUCTURAL_ZFM} kg</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visualization */}
            <div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col items-center justify-center relative">
                <h3 className="absolute top-6 left-6 text-xl font-bold text-white">Limit Determination</h3>

                <div className="flex items-end gap-12 h-96 w-full max-w-2xl px-8 pb-8 border-b border-slate-600 relative mt-12">
                    {/* Y-Axis Label */}
                    <div className="absolute -left-4 top-1/2 -rotate-90 text-slate-500 text-sm tracking-widest">MASS (KG)</div>

                    {/* Structural Limit Bar (Fixed) */}
                    <div className="flex-1 flex flex-col justify-end items-center h-full group relative">
                        <div className="text-xs text-slate-400 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">78,000</div>
                        <div className="w-full bg-slate-700/50 border-t-2 border-dashed border-slate-500 rounded-t-lg relative" style={{ height: '78%' }}>
                            <div className="absolute top-2 w-full text-center text-xs text-slate-500 font-bold">STRUCTURAL</div>
                        </div>
                    </div>

                    {/* Performance Limit Bar (Dynamic) */}
                    <div className="flex-1 flex flex-col justify-end items-center h-full relative">
                        <div className="w-full bg-blue-500/20 border border-blue-500/50 rounded-t-lg relative transition-all duration-500" style={{ height: `${PLTOM / 1000}%` }}>
                            <div className="absolute -top-6 w-full text-center text-blue-400 font-bold text-sm">PLTOM</div>
                            <div className="absolute bottom-2 w-full text-center text-xs text-blue-300">{Math.round(PLTOM)}</div>
                        </div>
                    </div>

                    {/* Landing Limit Back-Calculation Bar */}
                    <div className="flex-1 flex flex-col justify-end items-center h-full relative">
                        <div className="w-full bg-emerald-500/20 border border-emerald-500/50 rounded-t-lg relative transition-all duration-500" style={{ height: `${TOM_LandingLimited / 1000}%` }}>
                            <div className="absolute -top-6 w-full text-center text-emerald-400 font-bold text-sm">LM + FUEL</div>
                            <div className="absolute bottom-2 w-full text-center text-xs text-emerald-300">{Math.round(TOM_LandingLimited)}</div>

                            {/* Trip Fuel Segment */}
                            <div className="absolute top-0 left-0 right-0 bg-amber-500/20 border-b border-amber-500/30" style={{ height: `${(tripFuel / TOM_LandingLimited) * 100}%` }}>
                                <div className="absolute right-1 top-1 text-[10px] text-amber-500">TRIF</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Result */}
                <div className="mt-8 text-center bg-slate-900/80 p-6 rounded-2xl border border-white/10 backdrop-blur shadow-xl">
                    <p className="text-slate-400 text-sm uppercase tracking-widest mb-1">Regulated Take-off Mass (RTOM)</p>
                    <div className="text-5xl font-mono text-white font-bold mb-2">
                        <motion.span
                            key={RTOM}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {Math.round(RTOM).toLocaleString()}
                        </motion.span>
                        <span className="text-lg text-slate-500 ml-2">kg</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                        <AlertCircle className="w-4 h-4" />
                        Limited by: {limitingFactor}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AlertCircle = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
);

export default LoadingLimits;
