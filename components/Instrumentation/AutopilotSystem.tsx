import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Plane, AlertTriangle, Info, Zap, RotateCcw, TrendingUp, ArrowUp } from 'lucide-react';

const AutopilotSystem: React.FC = () => {
    const [apEngaged, setApEngaged] = useState(false);
    const [atEngaged, setAtEngaged] = useState(false);
    const [fdEngaged, setFdEngaged] = useState(true);
    const [lateralMode, setLateralMode] = useState<string>('HDG');
    const [verticalMode, setVerticalMode] = useState<string>('VS');
    const [selectedSpeed, setSelectedSpeed] = useState(280);
    const [selectedAltitude, setSelectedAltitude] = useState(35000);
    const [selectedHeading, setSelectedHeading] = useState(90);
    const [selectedVS, setSelectedVS] = useState(1500);

    const lateralModes = ['HDG', 'LNAV', 'VOR', 'LOC', 'ROLL'];
    const verticalModes = ['VS', 'VNAV', 'FLCH', 'ALT', 'G/S'];

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-white mb-2">Autopilot & AFCS</h1>
                <p className="text-slate-400">Automatic Flight Control System - AP, AT, and FD control loops.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* MCP Panel Simulation */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
                    <h2 className="text-lg font-bold text-slate-400 mb-4">Mode Control Panel (MCP)</h2>

                    {/* FMA Display */}
                    <div className="bg-black p-4 rounded-xl mb-6 font-mono">
                        <div className="grid grid-cols-5 gap-2 text-center text-sm">
                            <div>
                                <div className="text-slate-600 text-xs mb-1">A/T</div>
                                <motion.div animate={{ boxShadow: atEngaged ? '0 0 10px rgba(34, 197, 94, 0.5)' : 'none' }} className={`py-1 px-2 rounded ${atEngaged ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500' : 'text-slate-600'}`}>
                                    {atEngaged ? 'SPD' : '---'}
                                </motion.div>
                            </div>
                            <div>
                                <div className="text-slate-600 text-xs mb-1">ROLL</div>
                                <motion.div animate={{ boxShadow: apEngaged ? '0 0 10px rgba(34, 197, 94, 0.5)' : 'none' }} className={`py-1 px-2 rounded ${apEngaged ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500' : 'text-slate-600'}`}>
                                    {apEngaged ? lateralMode : '---'}
                                </motion.div>
                            </div>
                            <div>
                                <div className="text-slate-600 text-xs mb-1">PITCH</div>
                                <motion.div animate={{ boxShadow: apEngaged ? '0 0 10px rgba(34, 197, 94, 0.5)' : 'none' }} className={`py-1 px-2 rounded ${apEngaged ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500' : 'text-slate-600'}`}>
                                    {apEngaged ? verticalMode : '---'}
                                </motion.div>
                            </div>
                            <div>
                                <div className="text-slate-600 text-xs mb-1">A/P</div>
                                <motion.div className={`py-1 px-2 rounded ${apEngaged ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500' : 'text-slate-600'}`}>
                                    {apEngaged ? 'CMD' : '---'}
                                </motion.div>
                            </div>
                            <div>
                                <div className="text-slate-600 text-xs mb-1">F/D</div>
                                <motion.div className={`py-1 px-2 rounded ${fdEngaged ? 'bg-sky-500/20 text-sky-400 border border-sky-500' : 'text-slate-600'}`}>
                                    {fdEngaged ? 'FD' : '---'}
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Speed/HDG/ALT Windows */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-slate-800 p-3 rounded-xl text-center">
                            <div className="text-slate-500 text-xs uppercase mb-1">IAS/MACH</div>
                            <div className="text-2xl font-mono font-bold text-white">{selectedSpeed}</div>
                        </div>
                        <div className="bg-slate-800 p-3 rounded-xl text-center">
                            <div className="text-slate-500 text-xs uppercase mb-1">HEADING</div>
                            <div className="text-2xl font-mono font-bold text-white">{selectedHeading.toString().padStart(3, '0')}°</div>
                        </div>
                        <div className="bg-slate-800 p-3 rounded-xl text-center">
                            <div className="text-slate-500 text-xs uppercase mb-1">ALTITUDE</div>
                            <div className="text-2xl font-mono font-bold text-white">{selectedAltitude}</div>
                        </div>
                        <div className="bg-slate-800 p-3 rounded-xl text-center">
                            <div className="text-slate-500 text-xs uppercase mb-1">V/S</div>
                            <div className="text-2xl font-mono font-bold text-white">{selectedVS > 0 ? '+' : ''}{selectedVS}</div>
                        </div>
                    </div>

                    {/* Mode Buttons */}
                    <div className="grid grid-cols-5 gap-2 mb-6">
                        {lateralModes.map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setLateralMode(mode)}
                                className={`py-2 px-3 rounded-lg text-sm font-bold transition-all ${lateralMode === mode && apEngaged ? 'bg-emerald-500 text-white' : lateralMode === mode ? 'bg-emerald-500/30 text-emerald-400 border border-emerald-500' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-5 gap-2 mb-6">
                        {verticalModes.map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setVerticalMode(mode)}
                                className={`py-2 px-3 rounded-lg text-sm font-bold transition-all ${verticalMode === mode && apEngaged ? 'bg-sky-500 text-white' : verticalMode === mode ? 'bg-sky-500/30 text-sky-400 border border-sky-500' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>

                    {/* Master Switches */}
                    <div className="grid grid-cols-3 gap-4">
                        <button
                            onClick={() => setApEngaged(!apEngaged)}
                            className={`py-4 px-6 rounded-xl font-bold text-lg transition-all ${apEngaged ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                        >
                            A/P {apEngaged ? 'ENGAGED' : 'OFF'}
                        </button>
                        <button
                            onClick={() => setAtEngaged(!atEngaged)}
                            className={`py-4 px-6 rounded-xl font-bold text-lg transition-all ${atEngaged ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                        >
                            A/T {atEngaged ? 'ENGAGED' : 'OFF'}
                        </button>
                        <button
                            onClick={() => setFdEngaged(!fdEngaged)}
                            className={`py-4 px-6 rounded-xl font-bold text-lg transition-all ${fdEngaged ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                        >
                            F/D {fdEngaged ? 'ON' : 'OFF'}
                        </button>
                    </div>
                </div>

                {/* Control Loop Diagram */}
                <div className="space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <RotateCcw className="w-5 h-5 text-sky-400" />
                            Control Loops
                        </h3>
                        <div className="space-y-4">
                            <div className={`p-4 rounded-lg border ${fdEngaged ? 'bg-sky-500/10 border-sky-500/50' : 'bg-slate-800/50 border-slate-700'}`}>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-sky-400 font-bold">OUTER LOOP</div>
                                        <div className="text-slate-400 text-sm">Flight Director</div>
                                    </div>
                                    <div className="text-slate-500 text-xs">Guidance</div>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <ArrowUp className="text-slate-600 w-6 h-6" />
                            </div>
                            <div className={`p-4 rounded-lg border ${apEngaged ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-800/50 border-slate-700'}`}>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-emerald-400 font-bold">INNER LOOP</div>
                                        <div className="text-slate-400 text-sm">Autopilot</div>
                                    </div>
                                    <div className="text-slate-500 text-xs">Attitude</div>
                                </div>
                            </div>
                        </div>
                        <p className="text-slate-500 text-xs mt-4">
                            The FD computes the <strong>target attitude</strong>, and the AP flies to achieve it.
                        </p>
                    </div>

                    {/* Loop Combinations */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                        <h3 className="text-white font-bold mb-3">Loop Combinations</h3>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-slate-500">
                                    <th className="text-left pb-2">Inner</th>
                                    <th className="text-left pb-2">Outer</th>
                                    <th className="text-left pb-2">Mode</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-300">
                                <tr className={!apEngaged && !fdEngaged ? 'text-amber-400 font-bold' : ''}>
                                    <td className="py-1">✗</td>
                                    <td>✗</td>
                                    <td>Hand Flying</td>
                                </tr>
                                <tr className={!apEngaged && fdEngaged ? 'text-amber-400 font-bold' : ''}>
                                    <td className="py-1">✗</td>
                                    <td>✓</td>
                                    <td>HF with FD</td>
                                </tr>
                                <tr className={apEngaged && fdEngaged ? 'text-amber-400 font-bold' : ''}>
                                    <td className="py-1">✓</td>
                                    <td>✓</td>
                                    <td>Autoflight</td>
                                </tr>
                                <tr className={apEngaged && !fdEngaged ? 'text-amber-400 font-bold' : ''}>
                                    <td className="py-1">✓</td>
                                    <td>✗</td>
                                    <td>CWS Mode</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Safety Features */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                    <h3 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Speed Reversion
                    </h3>
                    <p className="text-slate-400 text-sm">
                        If speed drops into the <strong className="text-amber-400">cautionary range</strong> (yellow on tape),
                        A/P switches to MCP SPD and pitches to maintain 5 kts above the range.
                    </p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                    <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Speed Limiting
                    </h3>
                    <p className="text-slate-400 text-sm">
                        If speed exceeds <strong className="text-red-400">VMO/MMO</strong> (red bricks), A/T goes to RETARD
                        and A/P pitches up to reduce speed.
                    </p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                    <h3 className="text-sky-400 font-bold mb-3 flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Servo Gain
                    </h3>
                    <p className="text-slate-400 text-sm">
                        <strong>Optimal Gain</strong> allows a slight overshoot but fast response.
                        <strong> Critical Gain</strong> is the highest with no overshoot.
                    </p>
                </div>
            </div>

            {/* Autopilot Types */}
            <div className="mt-6 bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Info className="text-sky-400 w-5 h-5" />
                    Autopilot System Types
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                        <h4 className="text-amber-400 font-bold mb-2">Standard A/P</h4>
                        <p className="text-slate-400">1 channel. On failure, control reverts to pilot. Authority weighting gives priority to manual inputs.</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                        <h4 className="text-emerald-400 font-bold mb-2">Duplex System</h4>
                        <p className="text-slate-400">2 channels. Cross-coupling allows each A/P to monitor the other's actuators for runaway detection.</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                        <h4 className="text-sky-400 font-bold mb-2">Triplex / Fail Operational</h4>
                        <p className="text-slate-400">3 channels. Majority vote disconnects the faulty A/P. Required for CAT III autoland.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutopilotSystem;
