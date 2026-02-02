import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, ArrowUp, Thermometer, Layers, Info } from 'lucide-react';

interface Props {
    initialView?: 'layers' | 'isa' | 'heat';
}

const AtmosphereMaster: React.FC<Props> = ({ initialView = 'layers' }) => {
    const [altitude, setAltitude] = useState(0); // Feet
    const [view, setView] = useState<'layers' | 'isa' | 'heat'>(initialView);

    // ISA CALCS
    // T = 15 - 1.98 * alt/1000 (up to 36090)
    // P = 1013.25 * (1 - 0.0000225577 * alt)^5.25588
    // Rho = 1.225 * (1 - 0.0000225577 * alt)^4.25588

    // Simplifed for display:
    const getISAValues = (alt: number) => {
        let temp = 15;
        if (alt <= 36090) {
            temp = 15 - 1.98 * (alt / 1000);
        } else {
            temp = -56.5; // Stratosphere isothermal base
        }

        // Relative Pressure (approx)
        const pressure = 1013.25 * Math.pow((1 - 2.25577e-5 * Math.min(alt, 36090)), 5.25588);

        // Relative Density (approx) based on Pressure/Temp relation
        // rho = p / R T (in Kelvin)
        const density = pressure / (2.87 * (temp + 273.15)); // kg/m3 approx

        return { temp, pressure, density };
    };

    const { temp, pressure, density } = getISAValues(altitude);

    const layers = [
        { name: 'Thermosphere', height: '85km+', temp: 'Rising Rapidly', desc: 'Auroras occur here. Temp rises due to UV absorption.', color: 'bg-purple-900/40' },
        { name: 'Mesosphere', height: '50-85km', temp: 'Dropping to -90°C', desc: 'Coldest layer. Meteors burn up here.', color: 'bg-blue-900/40' },
        { name: 'Stratosphere', height: '11-50km', temp: 'Isothermal then Rising', desc: 'Ozone layer absorbs UV. Stable air. Jet streams at base.', color: 'bg-indigo-900/40' },
        { name: 'Troposphere', height: '0-11km', temp: 'Dropping -2°C/1000ft', desc: '75% of mass. Most weather occurs here. Mixing layer.', color: 'bg-sky-900/40' }
    ];

    return (
        <div className="space-y-8">
            {/* View Toggle */}
            <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800 w-fit mx-auto">
                <button
                    onClick={() => setView('layers')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'layers' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    Layers & Structure
                </button>
                <button
                    onClick={() => setView('isa')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'isa' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    ISA Calculator
                </button>
                <button
                    onClick={() => setView('heat')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'heat' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    Heat & Diurnal
                </button>
            </div>

            {/* LAYERS VIEW */}
            {view === 'layers' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl relative overflow-hidden flex flex-col justify-end min-h-[600px]">
                        <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900 to-sky-900/20 opacity-50" />

                        {/* Interactive Rocket/Balloon/Plane scaler ?? Simple list for now mapped to height */}
                        <div className="relative z-10 space-y-2">
                            {layers.map((l, i) => (
                                <motion.div
                                    key={l.name}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`${l.color} backdrop-blur-sm p-4 rounded-xl border border-white/5 hover:border-white/20 transition-colors`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="text-lg font-bold text-white shadow-black drop-shadow-md">{l.name}</h3>
                                        <span className="text-xs font-mono text-slate-300">{l.height}</span>
                                    </div>
                                    <p className="text-xs text-slate-200 mb-2">{l.desc}</p>
                                    <div className="flex items-center gap-2 text-xs font-bold text-sky-300 bg-black/20 w-fit px-2 py-1 rounded">
                                        <Thermometer size={12} /> {l.temp}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Earth Surface */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-emerald-900 to-transparent opacity-50" />
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Info className="text-blue-400" /> Key Concepts
                            </h3>
                            <ul className="space-y-4">
                                <li className="bg-slate-800/50 p-3 rounded-lg border-l-4 border-blue-500">
                                    <h4 className="font-bold text-white text-sm">Tropopause</h4>
                                    <p className="text-xs text-slate-400 mt-1">
                                        The lid of the weather. Varies from 25,000ft (Poles) to 55,000ft (Equator). Higher in summer. Jet streams found in the breaks.
                                    </p>
                                </li>
                                <li className="bg-slate-800/50 p-3 rounded-lg border-l-4 border-purple-500">
                                    <h4 className="font-bold text-white text-sm">Ozone Layer</h4>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Found in the Stratosphere. Absorbs UV radiation, causing local warming (Temperature Inversion).
                                    </p>
                                </li>
                                <li className="bg-slate-800/50 p-3 rounded-lg border-l-4 border-orange-500">
                                    <h4 className="font-bold text-white text-sm">Composition</h4>
                                    <p className="text-xs text-slate-400 mt-1">
                                        78% Nitrogen, 21% Oxygen, 0.9% Argon. Trace gases (CO2) absorb earth's radiation (Greenhouse).
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* ISA VIEW */}
            {view === 'isa' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                        <div className="mb-8">
                            <label className="flex justify-between text-sm font-bold text-slate-400 uppercase mb-4">
                                <span>Altitude (MSL)</span>
                                <span className="text-white font-mono">{altitude.toLocaleString()} FT</span>
                            </label>
                            <input
                                type="range"
                                min="0" max="60000" step="500"
                                value={altitude}
                                onChange={(e) => setAltitude(parseInt(e.target.value))}
                                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                                <span>Sea Level</span>
                                <span>Tropopause ~36k</span>
                                <span>60,000 ft</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Temperature</div>
                                <div className="text-2xl font-black text-white font-mono">{temp.toFixed(1)}°C</div>
                                <div className="text-[10px] text-slate-600">Lapse: -1.98°C/1k ft</div>
                            </div>
                            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Pressure</div>
                                <div className="text-2xl font-black text-white font-mono">{pressure.toFixed(0)} hPa</div>
                                <div className="text-[10px] text-slate-600">~27ft/hPa @ SL</div>
                            </div>
                            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Density</div>
                                <div className="text-2xl font-black text-white font-mono">{density.toFixed(3)}</div>
                                <div className="text-[10px] text-slate-600">kg/m³</div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                            <h4 className="flex items-center gap-2 text-blue-400 font-bold mb-2 text-sm">
                                <Info size={16} /> Why ISA Matters?
                            </h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Performance data (Takeoff distance, Climb rate) is based on ISA.
                                If actual temp is <strong>HOTTER</strong> than ISA, density is lower &rarr; Performance degrades (High Density Altitude).
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex items-center justify-center">
                        {/* Simple Graph Plot */}
                        <div className="relative w-full h-[300px] border-l border-b border-slate-600">
                            {/* Axis Labels */}
                            <div className="absolute -left-8 top-0 text-[10px] text-slate-500">60k</div>
                            <div className="absolute -left-8 bottom-0 text-[10px] text-slate-500">0</div>
                            <div className="absolute left-0 -bottom-6 text-[10px] text-slate-500">-60°C</div>
                            <div className="absolute right-0 -bottom-6 text-[10px] text-slate-500">+20°C</div>

                            {/* Temp Line SVG (Approximation) */}
                            <svg className="absolute inset-0 w-full h-full overflow-visible">
                                <path
                                    d="M 90% 100% L 30% 40% L 30% 0%"
                                    fill="none"
                                    stroke="#ef4444"
                                    strokeWidth="3"
                                    className="drop-shadow-lg"
                                />
                                {/* Current Altitude Marker */}
                                <circle
                                    cx={altitude <= 36090 ? 90 - ((altitude / 36090) * 60) + '%' : '30%'} // Very rough vis logic
                                    cy={100 - (altitude / 60000) * 100 + '%'}
                                    r="6"
                                    fill="white"
                                />
                                <line
                                    x1="0" y1={100 - (altitude / 60000) * 100 + '%'}
                                    x2="100%" y2={100 - (altitude / 60000) * 100 + '%'}
                                    stroke="white" strokeDasharray="4 4" opacity="0.2"
                                />
                            </svg>
                            <div className="absolute top-4 right-4 text-xs font-bold text-red-400">Temperature Profile</div>
                        </div>
                    </div>
                </div>
            )}

            {/* HEAT VIEW */}
            {view === 'heat' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Sun className="text-yellow-500" /> Diurnal Variation
                        </h3>
                        <div className="space-y-6">
                            <div className="relative h-24 bg-gradient-to-r from-indigo-900 via-sky-500 to-indigo-900 rounded-xl border border-slate-700 overflow-hidden">
                                <div className="absolute inset-0 flex justify-between items-end px-4 pb-2 text-[10px] text-white font-bold">
                                    <span>Sunrise</span>
                                    <span>Noon</span>
                                    <span>Sunset</span>
                                </div>
                                {/* Sun Path */}
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.6)] animate-pulse"></div>
                            </div>

                            <ul className="space-y-3 text-sm text-slate-300">
                                <li className="flex justify-between">
                                    <span>Min Temp (Surface)</span>
                                    <span className="text-blue-400 font-bold">Sunrise + 30m</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Max Temp (Surface)</span>
                                    <span className="text-orange-400 font-bold">~14:00 (Lag)</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Max Wind (Turbulence)</span>
                                    <span className="text-white font-bold">Afternoon</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">Radiation Budget</h3>
                        <div className="space-y-4">
                            <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-400">Absorbed by Surface</span>
                                    <span className="text-emerald-400 font-bold">45%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full w-[45%]"></div>
                                </div>
                            </div>
                            <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-400">Reflected by Clouds/Atmosphere</span>
                                    <span className="text-white font-bold">30%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div className="bg-white h-full w-[30%]"></div>
                                </div>
                            </div>
                            <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-400">Absorbed by Atmosphere</span>
                                    <span className="text-blue-400 font-bold">20%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div className="bg-blue-500 h-full w-[20%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AtmosphereMaster;
