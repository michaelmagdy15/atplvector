
import React, { useState } from 'react';
import { Thermometer, ArrowUp, ArrowDown, Droplets, Gauge } from 'lucide-react';

const Density: React.FC = () => {
    const [temperature, setTemperature] = useState(15); // ISA 15°C
    const [pressure, setPressure] = useState(1013); // ISA 1013 hPa
    const [humidity, setHumidity] = useState(0); // 0%

    // Rough approximation for educational purposes
    // Density Altitude = Pressure Altitude + [120 * (OAT - ISA_Temp)]
    // 1 hPa = 30ft roughly

    const pressureAlt = (1013 - pressure) * 30; // at Sea Level
    const isaTemp = 15; // at Sea Level
    const tempDev = temperature - isaTemp;

    // Humidity correction (Rule of thumb: high humidity increases DA)
    // Very rough heuristic: +10% humidity ~= +100ft DA (just for visualization effect)
    const humidityEffect = humidity * 10;

    // Total DA
    const densityAltitude = pressureAlt + (120 * tempDev) + humidityEffect;

    // Performance Impact Factor (1.0 is ISA Sea Level standard)
    // Lift is proportional to density. Lower density -> Less Lift -> Worse Performance.
    // Roughly 1% power loss per 1°C above ISA.
    // Normalized performance score (0-100%)
    const perfScore = Math.max(20, Math.min(100, 100 - (densityAltitude / 200)));

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Calculator Controls */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Thermometer className="text-orange-400" /> Density Altitude
                    </h3>

                    <div className="space-y-6">
                        {/* Temp Control */}
                        <div>
                            <div className="flex justify-between text-sm font-bold text-slate-400 mb-2">
                                <span>Temperature (OAT)</span>
                                <span className={`${temperature > 15 ? 'text-red-400' : 'text-blue-400'}`}>{temperature}°C</span>
                            </div>
                            <input
                                type="range" min="-20" max="50" step="1"
                                value={temperature}
                                onChange={(e) => setTemperature(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                                <span>Cold (Low DA)</span>
                                <span>Hot (High DA)</span>
                            </div>
                        </div>

                        {/* Pressure Control */}
                        <div>
                            <div className="flex justify-between text-sm font-bold text-slate-400 mb-2">
                                <span>Pressure (QNH)</span>
                                <span className="text-white">{pressure} hPa</span>
                            </div>
                            <input
                                type="range" min="950" max="1050" step="1"
                                value={pressure}
                                onChange={(e) => setPressure(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                                <span>Low Pressure (High DA)</span>
                                <span>High Pressure (Low DA)</span>
                            </div>
                        </div>

                        {/* Humidity Control */}
                        <div>
                            <div className="flex justify-between text-sm font-bold text-slate-400 mb-2">
                                <span>Humidity</span>
                                <span className="text-cyan-400">{humidity}%</span>
                            </div>
                            <input
                                type="range" min="0" max="100" step="10"
                                value={humidity}
                                onChange={(e) => setHumidity(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            />
                            <div className="text-[10px] text-slate-500 mt-2">
                                Moist air is LESS dense than dry air (Water vapor is lighter than Nitrogen/Oxygen).
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Visualizer */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col justify-between">
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Calculated Conditions</h4>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                <div className="text-[10px] text-slate-500 mb-1">Density Altitude</div>
                                <div className="text-3xl font-black text-white font-mono flex items-baseline gap-1">
                                    {densityAltitude.toFixed(0)} <span className="text-sm font-bold text-slate-600">ft</span>
                                </div>
                            </div>
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                <div className="text-[10px] text-slate-500 mb-1">Performance Index</div>
                                <div className={`text-3xl font-black font-mono flex items-baseline gap-1 ${perfScore > 90 ? 'text-emerald-400' : perfScore > 70 ? 'text-yellow-400' : 'text-red-500'
                                    }`}>
                                    {perfScore.toFixed(0)}<span className="text-sm font-bold text-slate-600">%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                        <div className="flex items-center gap-3 mb-2">
                            <Gauge className={`w-5 h-5 ${perfScore < 70 ? 'text-red-400' : 'text-slate-400'}`} />
                            <span className="font-bold text-white text-sm">Takeoff Analysis</span>
                        </div>
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-2">
                            <div
                                className={`h-full transition-all duration-500 ${densityAltitude > 3000 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                style={{ width: `${Math.min(100, (densityAltitude / 5000) * 100)}%` }}
                            />
                        </div>
                        <div className="text-xs text-slate-400 leading-relaxed">
                            {densityAltitude > 2000
                                ? "Caution: High Density Altitude. Takeoff distance increased. Climb performance reduced. Engine power output lower."
                                : "Standard density conditions. Normal performance expected."
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Density;
