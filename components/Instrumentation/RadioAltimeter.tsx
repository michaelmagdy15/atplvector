import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, AlertTriangle, Info, Mountain, Plane } from 'lucide-react';

const RadioAltimeter: React.FC = () => {
    const [agl, setAgl] = useState(500); // feet AGL
    const [bankAngle, setBankAngle] = useState(0);
    const [terrainType, setTerrainType] = useState<'flat' | 'sloped' | 'rough'>('flat');

    // Simulate the cone emission effect
    const coneError = bankAngle > 0 ? Math.abs(agl * (1 / Math.cos(bankAngle * Math.PI / 180) - 1)) : 0;
    const indicatedAlt = terrainType === 'rough' ? agl + Math.random() * 50 - 25 : agl + coneError;

    // Decision Height indicator
    const dh = 200;
    const isAtOrBelowDH = agl <= dh;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-white mb-2">Radio Altimeter (RA)</h1>
                <p className="text-slate-400">FMCW radar measuring height above ground level (AGL).</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visualization */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Radio className="text-emerald-400" />
                        RA Display
                    </h2>

                    {/* Radio Altimeter Display */}
                    <div className="relative w-64 h-64 mx-auto bg-slate-800 rounded-2xl border-4 border-slate-600 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
                        {/* DH Bug */}
                        <div className="absolute top-4 text-amber-400 text-xs font-bold">DH: {dh} ft</div>

                        {/* Main Reading */}
                        <motion.div
                            animate={{ scale: isAtOrBelowDH ? [1, 1.1, 1] : 1 }}
                            transition={{ repeat: isAtOrBelowDH ? Infinity : 0, duration: 0.5 }}
                            className={`text-5xl font-mono font-black ${isAtOrBelowDH ? 'text-amber-400' : 'text-emerald-400'}`}
                        >
                            {Math.round(indicatedAlt)}
                        </motion.div>
                        <div className="text-slate-400 text-sm font-bold uppercase">Feet AGL</div>

                        {/* RA annunciator */}
                        {isAtOrBelowDH && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="absolute bottom-4 px-3 py-1 bg-amber-500/20 border border-amber-500 rounded-md text-amber-400 text-xs font-bold"
                            >
                                MINIMUMS
                            </motion.div>
                        )}

                        {/* Ground profile visual */}
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-emerald-900/50 to-transparent">
                            {terrainType === 'rough' && (
                                <div className="absolute inset-0 flex items-end justify-around pb-1">
                                    <Mountain className="text-emerald-700 w-4 h-4" />
                                    <Mountain className="text-emerald-700 w-6 h-6" />
                                    <Mountain className="text-emerald-700 w-3 h-3" />
                                    <Mountain className="text-emerald-700 w-5 h-5" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cone Emission Diagram */}
                    <div className="mt-6 relative h-32 bg-slate-800/50 rounded-xl overflow-hidden">
                        {/* Aircraft */}
                        <motion.div
                            animate={{ rotate: bankAngle }}
                            className="absolute top-4 left-1/2 -translate-x-1/2 text-white"
                        >
                            <Plane className="w-8 h-8" />
                        </motion.div>

                        {/* Cone */}
                        <div
                            className="absolute top-10 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-t-[80px] border-t-sky-500/30"
                            style={{ transform: `translateX(-50%) rotate(${bankAngle}deg)` }}
                        />

                        {/* Ground */}
                        <div className="absolute bottom-0 left-0 right-0 h-2 bg-emerald-600"></div>

                        {/* Labels */}
                        <div className="absolute bottom-6 left-4 text-xs text-slate-400">
                            Cone Emission: ±40° bank, ±25° pitch
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-6">
                    {/* Height Control */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                        <label className="text-sm font-bold text-slate-400 uppercase mb-3 block">
                            Actual Height AGL
                        </label>
                        <input
                            type="range"
                            min={0}
                            max={2500}
                            value={agl}
                            onChange={(e) => setAgl(Number(e.target.value))}
                            className="w-full accent-emerald-500"
                        />
                        <div className="flex justify-between text-sm mt-2">
                            <span className="text-slate-500">0 ft</span>
                            <span className="text-emerald-400 font-mono font-bold">{agl} ft</span>
                            <span className="text-slate-500">2500 ft</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            RA range is typically 0 - 2500 ft AGL.
                        </p>
                    </div>

                    {/* Bank Angle Control */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                        <label className="text-sm font-bold text-slate-400 uppercase mb-3 block">
                            Bank Angle (Cone Error Demo)
                        </label>
                        <input
                            type="range"
                            min={0}
                            max={40}
                            value={bankAngle}
                            onChange={(e) => setBankAngle(Number(e.target.value))}
                            className="w-full accent-amber-500"
                        />
                        <div className="flex justify-between text-sm mt-2">
                            <span className="text-slate-500">0°</span>
                            <span className="text-amber-400 font-mono font-bold">{bankAngle}°</span>
                            <span className="text-slate-500">40°</span>
                        </div>
                        {bankAngle > 0 && (
                            <p className="text-xs text-amber-400 mt-2">
                                ⚠️ Cone error adds ~{coneError.toFixed(0)} ft to indicated altitude in a turn.
                            </p>
                        )}
                    </div>

                    {/* Terrain Type */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                        <label className="text-sm font-bold text-slate-400 uppercase mb-3 block">
                            Terrain Type
                        </label>
                        <div className="flex gap-2">
                            {(['flat', 'sloped', 'rough'] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTerrainType(t)}
                                    className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm capitalize transition-all ${terrainType === t ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500' : 'bg-slate-800 text-slate-400'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Concepts */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                        <Info className="text-sky-400 w-5 h-5" />
                        FMCW Radar Operation
                    </h3>
                    <ul className="text-slate-400 text-sm space-y-2">
                        <li>• <strong>Carrier Wave:</strong> 4300 MHz (SHF)</li>
                        <li>• <strong>FM Modulation:</strong> ±50 MHz bandwidth (4250-4350 MHz)</li>
                        <li>• <strong>Sweep Rate:</strong> ~0.01 seconds per cycle</li>
                        <li>• <strong>Depth of Modulation:</strong> Large, to overcome Doppler effects</li>
                    </ul>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
                    <h3 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Cone Emission Limits
                    </h3>
                    <p className="text-slate-300 text-sm">
                        The RA provides accurate readings up to:
                    </p>
                    <ul className="text-slate-400 text-sm mt-3 space-y-1">
                        <li>• <strong>±40° bank angle</strong></li>
                        <li>• <strong>±25° pitch</strong></li>
                    </ul>
                    <p className="text-slate-500 text-xs mt-3">
                        Multiple antennas sense the lowest return to minimize over-reads in turns.
                    </p>
                </div>
            </div>

            {/* Pulse vs Continuous */}
            <div className="mt-6 bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                <h3 className="text-white font-bold mb-4">Pulse vs. Continuous Wave Radar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
                        <h4 className="text-red-400 font-bold mb-2">Pulse Radar (NOT used for RA)</h4>
                        <ul className="text-slate-400 space-y-1">
                            <li>• Single antenna for TX and RX</li>
                            <li>• Cannot receive while transmitting</li>
                            <li>• At low altitude, reflection returns before switching to RX mode</li>
                        </ul>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg">
                        <h4 className="text-emerald-400 font-bold mb-2">Continuous Wave (FMCW)</h4>
                        <ul className="text-slate-400 space-y-1">
                            <li>• Two antennas: one TX, one RX</li>
                            <li>• Continuous transmission and reception</li>
                            <li>• Uses frequency difference to calculate distance</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RadioAltimeter;
