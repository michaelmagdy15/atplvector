import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, AlertTriangle, Info, RotateCcw, Zap } from 'lucide-react';

const DirectionalGyro: React.FC = () => {
    const [heading, setHeading] = useState(90);
    const [driftRate, setDriftRate] = useState(0); // degrees per 15 min
    const [latitude, setLatitude] = useState(45);
    const [timeElapsed, setTimeElapsed] = useState(0); // minutes since last alignment

    // Calculate drift components
    const earthRate = 15 * Math.sin(latitude * Math.PI / 180); // °/hr
    const transportWander = 0; // Simplified - depends on groundspeed and heading
    const apparentDrift = earthRate;
    const totalDrift = (apparentDrift * timeElapsed) / 60;

    // Indicated heading after drift
    const indicatedHeading = (heading - totalDrift + 360) % 360;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-white mb-2">Directional Gyro (DG)</h1>
                <p className="text-slate-400">Gyro-stabilized heading reference with drift effects.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* DG Display */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Compass className="text-sky-400" />
                        Heading Indicator
                    </h2>

                    {/* DG Face */}
                    <div className="relative w-64 h-64 mx-auto bg-slate-800 rounded-full border-4 border-slate-600 shadow-2xl">
                        {/* Compass Rose */}
                        <motion.div
                            animate={{ rotate: -indicatedHeading }}
                            transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                            className="absolute inset-4"
                        >
                            {/* Cardinal Points */}
                            {['N', 'E', 'S', 'W'].map((dir, i) => (
                                <div
                                    key={dir}
                                    className="absolute w-full h-full flex justify-center"
                                    style={{ transform: `rotate(${i * 90}deg)` }}
                                >
                                    <span className="text-white font-bold text-xl" style={{ transform: `rotate(${-i * 90 + indicatedHeading}deg)` }}>
                                        {dir}
                                    </span>
                                </div>
                            ))}
                            {/* Degree ticks */}
                            {[...Array(36)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute top-0 left-1/2 w-0.5 bg-white origin-bottom"
                                    style={{
                                        height: i % 3 === 0 ? 12 : 6,
                                        transform: `translateX(-50%) rotate(${i * 10}deg)`,
                                        transformOrigin: 'center 112px'
                                    }}
                                />
                            ))}
                        </motion.div>

                        {/* Lubber Line */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-8 bg-amber-500"></div>

                        {/* Airplane Symbol */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-16 flex flex-col items-center">
                                <div className="w-1 h-8 bg-amber-400"></div>
                                <div className="w-8 h-1 bg-amber-400"></div>
                                <div className="w-1 h-4 bg-amber-400"></div>
                                <div className="w-4 h-1 bg-amber-400"></div>
                            </div>
                        </div>
                    </div>

                    {/* Heading Display */}
                    <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                        <div className="bg-slate-800/50 p-3 rounded-xl">
                            <div className="text-2xl font-mono font-bold text-sky-400">{heading.toFixed(0).padStart(3, '0')}°</div>
                            <div className="text-xs text-slate-500 uppercase">True Heading</div>
                        </div>
                        <div className="bg-slate-800/50 p-3 rounded-xl">
                            <div className="text-2xl font-mono font-bold text-amber-400">{indicatedHeading.toFixed(0).padStart(3, '0')}°</div>
                            <div className="text-xs text-slate-500 uppercase">Indicated (w/ Drift)</div>
                        </div>
                    </div>

                    {/* Drift Info */}
                    {timeElapsed > 0 && (
                        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
                            <div className="text-amber-400 text-sm">
                                Drift Error: <strong>{totalDrift.toFixed(1)}°</strong> after {timeElapsed} min
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="space-y-6">
                    {/* True Heading */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                        <label className="text-sm font-bold text-slate-400 uppercase mb-3 block">
                            True Heading
                        </label>
                        <input
                            type="range"
                            min={0}
                            max={359}
                            value={heading}
                            onChange={(e) => setHeading(Number(e.target.value))}
                            className="w-full accent-sky-500"
                        />
                        <div className="flex justify-between text-sm mt-2">
                            <span className="text-slate-500">000°</span>
                            <span className="text-sky-400 font-mono font-bold">{heading}°</span>
                            <span className="text-slate-500">359°</span>
                        </div>
                    </div>

                    {/* Latitude */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                        <label className="text-sm font-bold text-slate-400 uppercase mb-3 block">
                            Current Latitude
                        </label>
                        <input
                            type="range"
                            min={0}
                            max={90}
                            value={latitude}
                            onChange={(e) => setLatitude(Number(e.target.value))}
                            className="w-full accent-emerald-500"
                        />
                        <div className="flex justify-between text-sm mt-2">
                            <span className="text-slate-500">0° (Equator)</span>
                            <span className="text-emerald-400 font-mono font-bold">{latitude}°N</span>
                            <span className="text-slate-500">90° (Pole)</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            Earth rate at {latitude}°: {earthRate.toFixed(1)}°/hr
                        </p>
                    </div>

                    {/* Time Since Alignment */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-sm font-bold text-slate-400 uppercase">
                                Time Since Last Alignment
                            </label>
                            <button
                                onClick={() => setTimeElapsed(0)}
                                className="text-xs px-3 py-1 bg-sky-500/20 text-sky-400 rounded-full hover:bg-sky-500/30 transition-all flex items-center gap-1"
                            >
                                <RotateCcw className="w-3 h-3" /> Reset
                            </button>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={60}
                            value={timeElapsed}
                            onChange={(e) => setTimeElapsed(Number(e.target.value))}
                            className="w-full accent-amber-500"
                        />
                        <div className="flex justify-between text-sm mt-2">
                            <span className="text-slate-500">Just Aligned</span>
                            <span className="text-amber-400 font-mono font-bold">{timeElapsed} min</span>
                            <span className="text-slate-500">60 min</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Drift Theory */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                        <Zap className="text-amber-400 w-5 h-5" />
                        Apparent Drift (Earth Rate)
                    </h3>
                    <p className="text-slate-400 text-sm mb-3">
                        Because a DG is "rigid in space", it does not follow the Earth's rotation.
                        The apparent drift rate depends on latitude:
                    </p>
                    <div className="bg-slate-800/50 p-4 rounded-lg font-mono text-center">
                        <span className="text-amber-400 font-bold">Drift = 15° × sin(LAT) per hour</span>
                    </div>
                    <ul className="text-slate-500 text-xs mt-3 space-y-1">
                        <li>• At Equator (0°): 0°/hr drift</li>
                        <li>• At 45°N: 10.6°/hr drift</li>
                        <li>• At Poles (90°): 15°/hr drift</li>
                    </ul>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                        <Info className="text-sky-400 w-5 h-5" />
                        Transport Wander
                    </h3>
                    <p className="text-slate-400 text-sm mb-3">
                        If the aircraft moves East/West, the local vertical changes. The DG
                        will appear to drift even if there's no apparent movement:
                    </p>
                    <div className="bg-slate-800/50 p-4 rounded-lg font-mono text-center text-sm">
                        <span className="text-sky-400 font-bold">Wander = (GS × sin(TRK)) / (60 × cos(LAT))</span>
                    </div>
                    <p className="text-slate-500 text-xs mt-3">
                        This is why the DG must be realigned every 15 minutes or so during flight.
                    </p>
                </div>
            </div>

            {/* Comparison: DG vs RIC */}
            <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
                <h3 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    DG vs. Remote Indicating Compass (RIC)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                        <h4 className="text-white font-bold mb-2">Directional Gyro (DG)</h4>
                        <ul className="text-slate-400 space-y-1">
                            <li>• <strong>Pros:</strong> Stable, no turning/accel errors</li>
                            <li>• <strong>Cons:</strong> Drifts, must realign every 15 min</li>
                            <li>• Uses: Short-term heading reference</li>
                        </ul>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                        <h4 className="text-white font-bold mb-2">Remote Indicating Compass (Slaved)</h4>
                        <ul className="text-slate-400 space-y-1">
                            <li>• <strong>Pros:</strong> Long-term magnetic alignment</li>
                            <li>• <strong>Cons:</strong> Needs flux valve, more complex</li>
                            <li>• Uses: Primary heading on modern aircraft</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DirectionalGyro;
