
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Wind, Thermometer, Circle, ArrowUp } from 'lucide-react';

const StationModels: React.FC = () => {
    const [cloudCover, setCloudCover] = useState(8); // Oktas
    const [windDir, setWindDir] = useState(270);
    const [windSpeed, setWindSpeed] = useState(15);
    const [temp, setTemp] = useState(15);
    const [dewpoint, setDewpoint] = useState(12);
    const [pressure, setPressure] = useState(1013);
    const [pressureTendency, setPressureTendency] = useState<'RISING' | 'FALLING' | 'STEADY'>('RISING');

    // Helper to get cloud cover symbol (simplified)
    const getCloudFill = (oktas: number) => {
        if (oktas === 0) return 'none'; // SKC
        if (oktas === 8) return 'all'; // OVC
        // For simplicity, just handling 0 and 8 full fill visually, or partials
        return oktas;
    };

    return (
        <div className="space-y-8 p-4 md:p-6 max-w-7xl mx-auto">
            <div>
                <h2 className="text-3xl font-black text-white flex items-center gap-3">
                    <Circle className="text-emerald-400" />
                    Station Models
                </h2>
                <p className="text-slate-400 text-sm mt-1">Decoding synoptic chart symbols.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* INTERACTIVE BUILDER */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[500px] relative">
                    <div className="absolute top-4 left-4 text-xs font-bold text-slate-500 uppercase">Live Preview</div>

                    {/* THE STATION MODEL PLOT */}
                    <div className="relative w-64 h-64 bg-slate-950 rounded-full border border-slate-800 flex items-center justify-center shadow-2xl">

                        {/* Wind Barb Group - Rotated */}
                        <div
                            className="absolute w-1 h-32 bg-transparent origin-bottom"
                            style={{
                                transform: `rotate(${windDir - 180}deg) translateY(-50%)`, // Pointing INTO wind? No, barb points into wind. Standard: Staff extends INTO wind.
                                // If wind is 270 (West), barb should point West.
                                bottom: '50%'
                            }}
                        >
                            <div className="w-1 h-32 bg-white mx-auto relative">
                                {/* Flags/Feathers go here at top */}
                                <div className="absolute top-0 right-0 w-8 h-1 bg-white rotate-[-30deg] origin-left"></div>
                                {windSpeed > 10 && <div className="absolute top-3 right-0 w-8 h-1 bg-white rotate-[-30deg] origin-left"></div>}
                            </div>
                        </div>

                        {/* Cloud Cover Circle (Center) */}
                        <div className="relative w-16 h-16 rounded-full border-4 border-white bg-slate-900 z-10 flex items-center justify-center overflow-hidden">
                            {cloudCover === 8 && <div className="w-full h-full bg-white"></div>}
                            {cloudCover === 0 && <div className="text-white text-xs font-bold">CLR</div>}
                            {cloudCover > 0 && cloudCover < 8 && (
                                <div className="w-full h-full bg-white" style={{ clipPath: `polygon(0 0, 50% 50%, 100% 0)` }}></div> /* Very rough 4/8 approximation */
                            )}
                        </div>

                        {/* Data Points */}
                        <div className="absolute top-4 left-0 text-red-500 font-bold text-xl font-mono">{temp}</div>
                        <div className="absolute bottom-4 left-0 text-emerald-500 font-bold text-xl font-mono">{dewpoint}</div>

                        <div className="absolute top-4 right-0 text-white font-bold text-xl font-mono">
                            {pressure.toString().slice(-3)} {/* Last 3 digits */}
                        </div>
                        <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex flex-col items-center">
                            {pressureTendency === 'RISING' ? <ArrowUp className="text-green-400" size={16} /> : <ArrowUp className="text-red-400 rotate-180" size={16} />}
                            <span className="text-[10px] text-slate-500">Tendency</span>
                        </div>

                        <div className="absolute left-[-40px] top-1/2 -translate-y-1/2 flex items-center">
                            <Cloud size={24} className="text-white" />
                            <span className="text-[10px] text-slate-500 ml-1">Wx</span>
                        </div>

                    </div>
                </div>

                {/* CONTROLS */}
                <div className="space-y-6">
                    <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
                        <h3 className="font-bold text-white mb-6">Configure Station</h3>

                        <div className="space-y-4">
                            <ControlRow label="Cloud Cover (Oktas)" value={cloudCover} min={0} max={8} onChange={setCloudCover} icon={<Cloud size={14} />} />
                            <ControlRow label="Wind Direction" value={windDir} min={0} max={360} step={10} onChange={setWindDir} icon={<Wind size={14} />} />
                            <ControlRow label="Temperature (°C)" value={temp} min={-40} max={50} onChange={setTemp} icon={<Thermometer size={14} />} />
                            <ControlRow label="Pressure (hPa)" value={pressure} min={950} max={1050} onChange={setPressure} icon={<Circle size={14} />} />
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Decoding Rules</h4>
                        <ul className="space-y-2 text-xs text-slate-400">
                            <li>• <strong>Pressure:</strong> Plots last 3 digits (e.g., 1013.2 {`->`} 132). Decimal point omitted.</li>
                            <li>• <strong>Wind:</strong> Staff enters the station circle (points "from" where wind blows).</li>
                            <li>• <strong>Wx Symbols:</strong> Left of circle = Present Weather.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ControlRow = ({ label, value, min, max, step = 1, onChange, icon }: any) => (
    <div className="flex items-center gap-4">
        <div className="w-32 text-xs text-slate-400 flex items-center gap-2">
            {icon} {label}
        </div>
        <input
            type="range"
            min={min} max={max} step={step}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="flex-grow h-2 bg-slate-800 rounded-full appearance-none accent-emerald-500"
        />
        <div className="w-12 text-right text-sm font-bold text-white font-mono">{value}</div>
    </div>
);

export default StationModels;
