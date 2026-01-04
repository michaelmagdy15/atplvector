import React, { useState } from 'react';
import { Cloud, Sun, Thermometer, Info, Umbrella, Waves } from 'lucide-react';

const HPLAtmosphere: React.FC = () => {
    const [tab, setTab] = useState<'isa' | 'radiation' | 'humidity'>('isa');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Cloud className="text-sky-400" />
                        The Atmosphere (040.02)
                    </h2>
                    <p className="text-slate-400 text-sm">ISA Model, Radiation Risks, and Humidity.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setTab('isa')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'isa' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}>ISA Model</button>
                    <button onClick={() => setTab('radiation')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'radiation' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}>Cosmic Radiation</button>
                    <button onClick={() => setTab('humidity')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'humidity' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}>Humidity</button>
                </div>
            </div>

            {tab === 'isa' && <ISACalculator />}
            {tab === 'radiation' && <CosmicRadiation />}
            {tab === 'humidity' && <HumidityEffects />}
        </div>
    );
};

// ISA Calculator
const ISACalculator = () => {
    const [alt, setAlt] = useState(0);

    // ISA Standard: 15C, 1013.25hPa at MSL.
    // Lapse Rate: -1.98C per 1000ft (approx -2C)
    // Tropopause at 36,090ft (-56.5C)
    const tropopause = 36090;

    let temp = 15;
    if (alt <= tropopause) {
        temp = 15 - (alt / 1000 * 1.98);
    } else {
        temp = -56.5; // Isothermal layer
    }

    // Pressure approx: P = P0 * (1 - L*h/T0)^(gM/RL) ... simplified exponential for display
    // Rule of thumb: -1hPa per 30ft at low levels.
    // Or just use the standard table scalar for display purposes
    const pressure = 1013.25 * Math.pow((1 - 2.25577e-5 * Math.min(alt, 11000)), 5.25588); // 11000m approx tropopause

    return (
        <div className="animate-in fade-in">
            <h3 className="font-bold text-white mb-6">ICAO Standard Atmosphere (ISA)</h3>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <label className="flex justify-between text-slate-400 text-sm mb-4">
                        <span>Altitude (ft)</span>
                        <span className="text-white font-mono font-bold">{alt.toLocaleString()} ft</span>
                    </label>
                    <input
                        type="range" min="0" max="50000" step="1000"
                        value={alt} onChange={e => setAlt(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg accent-sky-500 mb-8"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800 p-4 rounded text-center">
                            <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Temperature</span>
                            <span className="text-2xl font-black text-white">{temp.toFixed(1)}°C</span>
                        </div>
                        <div className="bg-slate-800 p-4 rounded text-center">
                            <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Pressure</span>
                            <span className="text-2xl font-black text-white">{(pressure / 1013.25 * 100).toFixed(0)}%</span>
                            <span className="text-[10px] text-slate-500 block">{pressure.toFixed(0)} hPa (Approx)</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-white text-sm mb-4">Atmospheric Composition</h4>
                    <div className="space-y-4">
                        <div className="relative h-8 bg-slate-800 rounded-full overflow-hidden flex text-xs font-bold text-white leading-8">
                            <div className="w-[78%] bg-blue-600 text-center">Nitrogen 78%</div>
                            <div className="w-[21%] bg-green-600 text-center">O2 21%</div>
                            <div className="w-[1%] bg-slate-500 text-center">1%</div>
                        </div>
                        <p className="text-xs text-slate-400">
                            <strong>Dalton's Law:</strong> This percentage remains constant up to ~60-70,000ft.
                            At 30,000ft, air is still 21% Oxygen, but the <em>Pressure</em> is lower, so fewer molecules are available per breath.
                        </p>
                    </div>

                    <div className="mt-6 p-3 bg-sky-900/20 border border-sky-500/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <Info size={16} className="text-sky-400" />
                            <span className="text-sky-400 font-bold text-xs">Tropopause</span>
                        </div>
                        <p className="text-xs text-slate-300">
                            Boundary between Troposphere and Stratosphere. Temp stops falling (-56.5°C).
                            Avg Height: 36,000ft (Poles 26k - Equator 54k).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Cosmic Radiation
const CosmicRadiation = () => {
    return (
        <div className="animate-in slide-in-from-right-4">
            <h3 className="font-bold text-white mb-6">Cosmic Radiation</h3>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <Sun className="text-yellow-400 mb-4 w-12 h-12" />
                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                        High energy particles from the Sun (Solar Flares) and Deep Space (Galactic).
                        Atmosphere protects us. Flying higher = Less protection.
                    </p>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-white p-2 border-b border-slate-700">
                            <span>Sea Level</span>
                            <span className="text-green-400">Minimal Risk</span>
                        </div>
                        <div className="flex justify-between text-xs text-white p-2 border-b border-slate-700">
                            <span>FL 300 (30,000ft)</span>
                            <span className="text-yellow-400">~60x Ground Level</span>
                        </div>
                        <div className="flex justify-between text-xs text-white p-2 border-b border-slate-700">
                            <span>Concorde (60,000ft)</span>
                            <span className="text-red-400">High Exposure</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col justify-center">
                    <h4 className="font-bold text-white text-sm mb-4">Key Factors</h4>
                    <ul className="text-xs text-slate-300 space-y-3">
                        <li className="flex gap-2">
                            <Waves size={16} className="text-sky-400 shrink-0" />
                            <span><strong>Altitude:</strong> Higher = More radiation.</span>
                        </li>
                        <li className="flex gap-2">
                            <Waves size={16} className="text-sky-400 shrink-0" />
                            <span><strong>Latitude:</strong> Protection is weakest at the Poles (Magnetic field funneling). Polar routes = Max dosage.</span>
                        </li>
                        <li className="flex gap-2">
                            <Waves size={16} className="text-sky-400 shrink-0" />
                            <span><strong>Solar Activity:</strong> Solar flares can significantly increase dosage temporarily.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

// Humidity
const HumidityEffects = () => {
    return (
        <div className="animate-in slide-in-from-right-4">
            <h3 className="font-bold text-white mb-6">Humidity & Dehydration</h3>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <Umbrella className="text-blue-400 w-10 h-10" />
                    <div>
                        <h4 className="text-lg font-bold text-white">Relative Humidity</h4>
                        <p className="text-xs text-slate-400">Amount of water vapor air can hold.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-black/30 p-4 rounded-lg text-center">
                        <p className="text-xs text-slate-500 uppercase font-bold">Standard Ground Comfort</p>
                        <p className="text-3xl font-black text-green-400">40 - 60%</p>
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg text-center border-2 border-red-500/30">
                        <p className="text-xs text-slate-500 uppercase font-bold">Airline Cabin (Cruise)</p>
                        <p className="text-3xl font-black text-red-400 text-pulse">&lt; 5%</p>
                    </div>
                </div>

                <p className="text-sm text-slate-300 mt-6 text-center">
                    Air at high altitude is freezing cold and holds almost no moisture. When heated to cabin temperature, the Relative Humidity drops to desert levels.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                    <h4 className="text-white text-sm font-bold mb-2">Effect</h4>
                    <p className="text-xs text-slate-400">Dry eyes, dry skin, thirst, faster fatigue.</p>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                    <h4 className="text-white text-sm font-bold mb-2">Recommendation</h4>
                    <p className="text-xs text-slate-400">Drink water frequently (small amounts). Avoid coffee/tea (Diuretics).</p>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                    <h4 className="text-white text-sm font-bold mb-2">Contact Lenses</h4>
                    <p className="text-xs text-slate-400">May become uncomfortable. Glasses recommended for long flights.</p>
                </div>
            </div>
        </div>
    );
};

export default HPLAtmosphere;
