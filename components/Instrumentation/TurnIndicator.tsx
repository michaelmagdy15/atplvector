import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Info, AlertTriangle, Clock, Plane } from 'lucide-react';

const TurnIndicator: React.FC = () => {
    const [bankAngle, setBankAngle] = useState(0);
    const [isStandardRate, setIsStandardRate] = useState(true);
    const [slipIndicator, setSlipIndicator] = useState(0); // -1 = skid, 0 = coord, 1 = slip
    const [speed, setSpeed] = useState(120); // knots

    // Rate 1 turn = 3°/sec = 180°/min = 2 min turn
    // Rate 1 bank angle ≈ TAS/10 + 7 (simplified)
    const standardRateBankAngle = Math.min(speed / 10 + 7, 30);

    // Calculate turn rate based on bank angle
    const turnRate = (bankAngle / standardRateBankAngle) * 3; // degrees per second
    const timeFor360 = turnRate > 0 ? 360 / turnRate : Infinity;

    useEffect(() => {
        if (isStandardRate) {
            setBankAngle(standardRateBankAngle);
        }
    }, [isStandardRate, standardRateBankAngle]);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-white mb-2">Turn & Balance Indicator</h1>
                <p className="text-slate-400">Rate gyros, coordinated turns, and slip/skid indications.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Interactive Instrument */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <RotateCcw className="text-amber-400" />
                        Turn Coordinator
                    </h2>

                    {/* Turn Indicator Display */}
                    <div className="relative w-64 h-64 mx-auto bg-slate-800 rounded-full border-4 border-slate-600 shadow-2xl flex items-center justify-center">
                        {/* Rate markings */}
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-16">
                            <div className="w-4 h-1 bg-white rounded" style={{ transform: 'rotate(-24deg)' }}></div>
                            <div className="w-4 h-1 bg-white rounded" style={{ transform: 'rotate(24deg)' }}></div>
                        </div>
                        <div className="absolute top-6 text-white text-xs font-bold">2 MIN</div>

                        {/* Miniature airplane */}
                        <motion.div
                            animate={{ rotate: bankAngle }}
                            transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                            className="relative"
                        >
                            <Plane className="w-24 h-24 text-white" />
                        </motion.div>

                        {/* Slip/Skid Ball */}
                        <div className="absolute bottom-12 w-32 h-8 bg-slate-700 rounded-full overflow-hidden border border-slate-600">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-white rounded-full opacity-30"></div>
                                <div className="w-6 h-6 border-2 border-white rounded-full opacity-30 -ml-1"></div>
                            </div>
                            <motion.div
                                animate={{ x: slipIndicator * 20 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg"
                            />
                        </div>
                    </div>

                    {/* Turn Stats */}
                    <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                        <div className="bg-slate-800/50 p-3 rounded-xl">
                            <div className="text-2xl font-mono font-bold text-amber-400">{bankAngle.toFixed(0)}°</div>
                            <div className="text-xs text-slate-500 uppercase">Bank Angle</div>
                        </div>
                        <div className="bg-slate-800/50 p-3 rounded-xl">
                            <div className="text-2xl font-mono font-bold text-emerald-400">{turnRate.toFixed(1)}°/s</div>
                            <div className="text-xs text-slate-500 uppercase">Turn Rate</div>
                        </div>
                        <div className="bg-slate-800/50 p-3 rounded-xl">
                            <div className="text-2xl font-mono font-bold text-sky-400">
                                {timeFor360 === Infinity ? '∞' : `${(timeFor360 / 60).toFixed(1)} min`}
                            </div>
                            <div className="text-xs text-slate-500 uppercase">360° Turn</div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-6">
                    {/* Speed Control */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                        <label className="text-sm font-bold text-slate-400 uppercase mb-3 block">
                            True Airspeed (TAS)
                        </label>
                        <input
                            type="range"
                            min={80}
                            max={300}
                            value={speed}
                            onChange={(e) => setSpeed(Number(e.target.value))}
                            className="w-full accent-sky-500"
                        />
                        <div className="flex justify-between text-sm mt-2">
                            <span className="text-slate-500">80 kts</span>
                            <span className="text-sky-400 font-mono font-bold">{speed} kts</span>
                            <span className="text-slate-500">300 kts</span>
                        </div>
                    </div>

                    {/* Bank Angle Control */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-sm font-bold text-slate-400 uppercase">Bank Angle</label>
                            <button
                                onClick={() => setIsStandardRate(!isStandardRate)}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${isStandardRate ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 'bg-slate-700 text-slate-400'}`}
                            >
                                {isStandardRate ? 'Rate 1 Active' : 'Manual'}
                            </button>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={45}
                            value={bankAngle}
                            onChange={(e) => {
                                setIsStandardRate(false);
                                setBankAngle(Number(e.target.value));
                            }}
                            className="w-full accent-amber-500"
                        />
                        <div className="flex justify-between text-sm mt-2">
                            <span className="text-slate-500">0°</span>
                            <span className="text-amber-400 font-mono font-bold">{bankAngle.toFixed(0)}°</span>
                            <span className="text-slate-500">45°</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            Rate 1 bank at {speed} kts ≈ {standardRateBankAngle.toFixed(0)}° (TAS/10 + 7)
                        </p>
                    </div>

                    {/* Slip/Skid Control */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                        <label className="text-sm font-bold text-slate-400 uppercase mb-3 block">
                            Slip/Skid Ball Position
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSlipIndicator(-1)}
                                className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all ${slipIndicator === -1 ? 'bg-red-500/20 text-red-400 border border-red-500' : 'bg-slate-800 text-slate-400'}`}
                            >
                                Skid (Left)
                            </button>
                            <button
                                onClick={() => setSlipIndicator(0)}
                                className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all ${slipIndicator === 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500' : 'bg-slate-800 text-slate-400'}`}
                            >
                                Coordinated
                            </button>
                            <button
                                onClick={() => setSlipIndicator(1)}
                                className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all ${slipIndicator === 1 ? 'bg-amber-500/20 text-amber-400 border border-amber-500' : 'bg-slate-800 text-slate-400'}`}
                            >
                                Slip (Right)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Concepts */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                        <Clock className="text-sky-400 w-5 h-5" />
                        Rate 1 vs Rate 2 Turns
                    </h3>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-slate-500">
                                <th className="text-left pb-2">Type</th>
                                <th className="text-left pb-2">Rate</th>
                                <th className="text-left pb-2">360° Time</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-300">
                            <tr>
                                <td className="py-1 font-bold text-amber-400">Rate 1</td>
                                <td>3°/sec</td>
                                <td>2 minutes</td>
                            </tr>
                            <tr>
                                <td className="py-1 font-bold text-rose-400">Rate 2</td>
                                <td>6°/sec</td>
                                <td>1 minute (4-min turn)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
                    <h3 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Memory Aid: Ball Position
                    </h3>
                    <p className="text-slate-300 text-sm">
                        <strong>"Step on the Ball"</strong> - Use rudder to push the ball back to center.
                    </p>
                    <ul className="text-slate-400 text-sm mt-3 space-y-1">
                        <li>• <strong>Skid:</strong> Too much bank, not enough rudder. Ball moves OUTSIDE of turn.</li>
                        <li>• <strong>Slip:</strong> Not enough bank, too much rudder. Ball moves INSIDE of turn.</li>
                    </ul>
                </div>
            </div>

            {/* Turn Indicator vs Turn Coordinator */}
            <div className="mt-6 bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Info className="text-sky-400 w-5 h-5" />
                    Turn Indicator vs. Turn Coordinator
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                        <h4 className="text-amber-400 font-bold mb-2">Turn Indicator (TC)</h4>
                        <ul className="text-slate-400 space-y-1">
                            <li>• Needle shows <strong>rate of turn only</strong></li>
                            <li>• Gyro axis is <strong>horizontal</strong></li>
                            <li>• Does NOT sense roll</li>
                            <li>• Older aircraft, less common</li>
                        </ul>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                        <h4 className="text-sky-400 font-bold mb-2">Turn Coordinator</h4>
                        <ul className="text-slate-400 space-y-1">
                            <li>• Miniature airplane shows <strong>rate of turn + roll</strong></li>
                            <li>• Gyro axis tilted <strong>30° upward</strong></li>
                            <li>• Senses both yaw AND roll</li>
                            <li>• Standard on modern aircraft</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TurnIndicator;
