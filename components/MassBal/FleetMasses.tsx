import React, { useState } from 'react';
import { Scale, Calendar, Users, Calculator, Info, AlertTriangle } from 'lucide-react';

const FleetMasses: React.FC = () => {
    const [fleetSize, setFleetSize] = useState(12);
    const [domDiff, setDomDiff] = useState(0.3); // % difference
    const [macDiff, setMacDiff] = useState(0.2); // % difference

    // Calculate required sample size based on fleet size
    const calculateSampleSize = (n: number): { formula: string; result: number } => {
        if (n <= 3) {
            return { formula: 'n', result: n };
        } else if (n <= 9) {
            return { formula: '(n + 3) / 2', result: Math.ceil((n + 3) / 2) };
        } else {
            return { formula: '(n + 51) / 10', result: Math.ceil((n + 51) / 10) };
        }
    };

    const sample = calculateSampleSize(fleetSize);

    // Check tolerances
    const domOk = domDiff <= 0.5;
    const macOk = macDiff <= 0.5;

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-sky-500/10 rounded-full mb-4">
                    <Users className="w-8 h-8 text-sky-400" />
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                    Fleet <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-500">Weighing Procedures</span>
                </h1>
                <p className="text-slate-400 mt-2">Managing mass data across a fleet of aircraft</p>
            </div>

            {/* Weighing Intervals */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Calendar className="text-sky-400" /> Weighing Schedule
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Individual Aircraft */}
                    <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-xl p-6 border border-amber-500/30">
                        <div className="text-5xl font-black text-amber-400 mb-2">4</div>
                        <div className="text-lg font-bold text-white">Years</div>
                        <p className="text-sm text-slate-400 mt-2">Individual aircraft weighing interval</p>
                        <div className="mt-4 text-xs text-amber-300 bg-amber-900/30 p-2 rounded">
                            Standard requirement for mass verification
                        </div>
                    </div>

                    {/* Fleet Masses */}
                    <div className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 rounded-xl p-6 border border-emerald-500/30">
                        <div className="text-5xl font-black text-emerald-400 mb-2">9</div>
                        <div className="text-lg font-bold text-white">Years</div>
                        <p className="text-sm text-slate-400 mt-2">When using fleet masses</p>
                        <div className="mt-4 text-xs text-emerald-300 bg-emerald-900/30 p-2 rounded">
                            Each individual aircraft must still be weighed
                        </div>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-slate-900 rounded-lg text-sm text-slate-400">
                    <strong className="text-white">Note:</strong> Modifications may be recorded rather than re-weighing the aircraft
                    if cumulative changes are within tolerance.
                </div>
            </div>

            {/* Fleet Sampling Calculator */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Calculator className="text-cyan-400" /> Fleet Sample Size Calculator
                </h3>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Input */}
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase block mb-3">Fleet Size</label>
                        <input
                            type="range"
                            min="2"
                            max="50"
                            value={fleetSize}
                            onChange={e => setFleetSize(Number(e.target.value))}
                            className="w-full accent-cyan-500 h-3"
                        />
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-slate-500 text-sm">2 aircraft</span>
                            <span className="text-3xl font-black text-white">{fleetSize}</span>
                            <span className="text-slate-500 text-sm">50 aircraft</span>
                        </div>

                        {/* Formula Table */}
                        <div className="mt-6 overflow-hidden rounded-lg border border-slate-700">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-900">
                                    <tr>
                                        <th className="py-2 px-4 text-left text-slate-400">Fleet Size</th>
                                        <th className="py-2 px-4 text-left text-slate-400">Formula</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className={`${fleetSize <= 3 ? 'bg-cyan-900/30' : 'bg-slate-800'}`}>
                                        <td className="py-2 px-4 text-white">2 - 3</td>
                                        <td className="py-2 px-4 font-mono text-cyan-400">n</td>
                                    </tr>
                                    <tr className={`${fleetSize >= 4 && fleetSize <= 9 ? 'bg-cyan-900/30' : 'bg-slate-800'}`}>
                                        <td className="py-2 px-4 text-white">4 - 9</td>
                                        <td className="py-2 px-4 font-mono text-cyan-400">(n + 3) / 2</td>
                                    </tr>
                                    <tr className={`${fleetSize >= 10 ? 'bg-cyan-900/30' : 'bg-slate-800'}`}>
                                        <td className="py-2 px-4 text-white">10+</td>
                                        <td className="py-2 px-4 font-mono text-cyan-400">(n + 51) / 10</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Result */}
                    <div className="flex flex-col justify-center">
                        <div className="bg-gradient-to-br from-cyan-900/30 to-sky-900/30 rounded-xl p-8 border border-cyan-500/30 text-center">
                            <div className="text-xs uppercase text-slate-400 mb-2">Sample Required (every 4 years)</div>
                            <div className="text-6xl font-black text-cyan-400">{sample.result}</div>
                            <div className="text-lg text-white mt-2">aircraft</div>

                            <div className="mt-6 p-3 bg-black/30 rounded-lg font-mono text-sm">
                                <span className="text-slate-400">Using formula:</span>
                                <span className="text-cyan-400 ml-2">{sample.formula}</span>
                            </div>

                            <div className="mt-4 text-xs text-slate-400">
                                = {sample.formula.replace('n', String(fleetSize))} = <span className="text-white font-bold">{sample.result}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tolerance Checker */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Scale className="text-violet-400" /> Fleet Mass Tolerances
                </h3>

                <p className="text-slate-400 mb-6">
                    For fleet masses, DOM and CG values may not differ by more than <strong className="text-white">±0.5%</strong>
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* DOM Tolerance */}
                    <div className={`p-6 rounded-xl border ${domOk ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                        <label className="flex justify-between text-xs font-bold uppercase mb-3">
                            <span className="text-slate-400">DOM Difference</span>
                            <span className={domOk ? 'text-emerald-400' : 'text-red-400'}>±{domDiff.toFixed(1)}%</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={domDiff}
                            onChange={e => setDomDiff(Number(e.target.value))}
                            className={`w-full ${domOk ? 'accent-emerald-500' : 'accent-red-500'} h-2`}
                        />
                        <div className="flex justify-between items-center mt-4">
                            <span className={`text-sm font-bold ${domOk ? 'text-emerald-400' : 'text-red-400'}`}>
                                {domOk ? '✓ Within Tolerance' : '✗ Exceeds Tolerance'}
                            </span>
                            <span className="text-xs text-slate-500">Limit: ±0.5%</span>
                        </div>
                    </div>

                    {/* MAC Tolerance */}
                    <div className={`p-6 rounded-xl border ${macOk ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                        <label className="flex justify-between text-xs font-bold uppercase mb-3">
                            <span className="text-slate-400">MAC Difference</span>
                            <span className={macOk ? 'text-emerald-400' : 'text-red-400'}>±{macDiff.toFixed(1)}%</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={macDiff}
                            onChange={e => setMacDiff(Number(e.target.value))}
                            className={`w-full ${macOk ? 'accent-emerald-500' : 'accent-red-500'} h-2`}
                        />
                        <div className="flex justify-between items-center mt-4">
                            <span className={`text-sm font-bold ${macOk ? 'text-emerald-400' : 'text-red-400'}`}>
                                {macOk ? '✓ Within Tolerance' : '✗ Exceeds Tolerance'}
                            </span>
                            <span className="text-xs text-slate-500">Limit: ±0.5%</span>
                        </div>
                    </div>
                </div>

                {(!domOk || !macOk) && (
                    <div className="mt-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center gap-3">
                        <AlertTriangle className="text-red-400 flex-shrink-0" />
                        <div className="text-sm text-red-300">
                            <strong>Action Required:</strong> If cumulative changes exceed ±0.5% of MSLM or ±0.5% of MAC,
                            recalculation of mass/CG is necessary.
                        </div>
                    </div>
                )}
            </div>

            {/* Weighing Requirements */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                    <Info size={20} /> Weighing Requirements
                </h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-300">
                    <div>
                        <h4 className="font-bold text-white mb-2">Equipment Standards</h4>
                        <ul className="space-y-1">
                            <li>• Scale capacity: <strong className="text-amber-400">150 kg</strong></li>
                            <li>• Graduations: <strong className="text-amber-400">500 g</strong></li>
                            <li>• Operator must complete detailed weighing survey</li>
                            <li>• Must be approved by competent Authority</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-2">BEM Establishment</h4>
                        <ul className="space-y-1">
                            <li>• Obtained from manufacturer or AMO</li>
                            <li>• Recorded in the Weighing Schedule</li>
                            <li>• Aircraft weighed fully equipped (standard role)</li>
                            <li>• In enclosed building with no A/C</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FleetMasses;
