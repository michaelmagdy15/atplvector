import React, { useState } from 'react';
import { Droplets, CloudRain, Flame, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

const HumidityLab: React.FC = () => {
    const [temperature, setTemperature] = useState(20); // Celsius
    const [dewPoint, setDewPoint] = useState(10); // Celsius

    // Spread calculation
    const spread = temperature - dewPoint;
    const relHumidity = 100 - (5 * spread); // Rule of thumb: RH = 100 - 5*(T-Td)
    const baseOfCloud = spread * 400; // Formula: (T-Td) * 400ft

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Controls */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                    <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                        <Droplets className="text-cyan-400" /> Humidity & Stability
                    </h3>

                    <div className="space-y-8">
                        <div>
                            <label className="flex justify-between text-sm font-bold text-slate-400 uppercase mb-2">
                                <span>Air Temperature</span>
                                <span className="text-white font-mono">{temperature}°C</span>
                            </label>
                            <input
                                type="range"
                                min="-10" max="40" step="1"
                                value={temperature}
                                onChange={(e) => setTemperature(parseInt(e.target.value))}
                                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                        </div>

                        <div>
                            <label className="flex justify-between text-sm font-bold text-slate-400 uppercase mb-2">
                                <span>Dew Point (Td)</span>
                                <span className="text-cyan-300 font-mono">{dewPoint}°C</span>
                            </label>
                            <input
                                type="range"
                                min="-10" max="40" step="1"
                                value={dewPoint}
                                onChange={(e) => setDewPoint(Math.min(parseInt(e.target.value), temperature))} // Td cannot be > T
                                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            />
                            <p className="text-[10px] text-slate-500 mt-2">Dew point cannot exceed ambient temperature.</p>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <div className="text-xs text-slate-500 uppercase font-bold">Relative Humidity</div>
                            <div className="text-3xl font-black text-white font-mono">{Math.max(relHumidity, 0).toFixed(0)}%</div>
                        </div>
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <div className="text-xs text-slate-500 uppercase font-bold">Cloud Base (Approx)</div>
                            <div className="text-3xl font-black text-white font-mono">{baseOfCloud} ft</div>
                            <div className="text-[10px] text-slate-600">Formula: (T - Td) x 400</div>
                        </div>
                    </div>
                </div>

                {/* Stability Diagram Visualizer */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col items-center justify-end relative overflow-hidden min-h-[400px]">
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-slate-950"></div>

                    {/* Ground */}
                    <div className="absolute bottom-0 w-full h-4 bg-emerald-600"></div>

                    {/* Cloud Base Indicator */}
                    <motion.div
                        initial={false}
                        animate={{ bottom: (baseOfCloud / 10000) * 100 + '%' }} // Scale roughly to 10k ft container
                        className="absolute w-full border-b-2 border-white/30 text-right px-4"
                    >
                        <span className="text-xs text-white bg-black/50 px-2 rounded">Cloud Base {baseOfCloud}ft</span>
                        <div className="absolute -top-4 w-full flex justify-center opacity-50">
                            <CloudRain size={32} className="text-white" />
                            <CloudRain size={40} className="text-white -ml-4" />
                        </div>
                    </motion.div>

                    {/* Explainer */}
                    <div className="absolute top-6 left-6 max-w-xs z-10 space-y-4">
                        <div className="bg-slate-800/80 p-4 rounded-xl border-l-4 border-cyan-400 backdrop-blur-md">
                            <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                                <Flame size={14} className="text-orange-400" /> Latent Heat
                            </h4>
                            <p className="text-xs text-slate-300">
                                When water vapor condenses into cloud (at the dew point altitude), it releases <strong>Latent Heat</strong>.
                                This slows the cooling rate from DALR (3°/1000ft) to SALR (1.8°/1000ft), making the air effectively WARMER and UNSTABLE (it wants to keep rising!).
                            </p>
                        </div>
                    </div>

                    <div className="absolute bottom-8 right-8 flex flex-col gap-1 items-center">
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                        >
                            <ArrowUp className="text-orange-500" size={32} />
                        </motion.div>
                        <span className="text-xs font-bold text-orange-500 uppercase bg-black/50 px-2 py-1 rounded">Rising Air</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HumidityLab;
