import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Plane, Shield, ArrowDown, ArrowUp, Info, Scale, Fuel } from 'lucide-react';

interface LimitDefinition {
    code: string;
    name: string;
    description: string;
    color: string;
    icon: React.ReactNode;
    note?: string;
}

const StructuralLimits: React.FC = () => {
    const [selectedLimit, setSelectedLimit] = useState<string | null>('MSTOM');

    // Example aircraft limits
    const mstom = 75000; // Max Structural Take-Off Mass
    const mslm = 65000;  // Max Structural Landing Mass
    const mzfm = 60000;  // Max Zero Fuel Mass
    const mstm = 76000;  // Max Structural Taxi Mass

    // Performance limits (example)
    const pltom = 72000; // Performance Limited Take-Off Mass
    const pllm = 64000;  // Performance Limited Landing Mass

    // Regulated limits
    const rtom = Math.min(mstom, pltom);
    const rlm = Math.min(mslm, pllm);

    const [currentMass, setCurrentMass] = useState(55000);
    const [currentFuel, setCurrentFuel] = useState(15000);

    const zfm = currentMass;
    const tom = zfm + currentFuel;

    const limits: LimitDefinition[] = [
        {
            code: 'MSTOM',
            name: 'Max Structural Take-Off Mass',
            description: 'Maximum mass for take-off based on structural strength',
            color: 'yellow',
            icon: <Plane size={20} />
        },
        {
            code: 'MSLM',
            name: 'Max Structural Landing Mass',
            description: 'Maximum mass for landing. May be exceeded in emergencies.',
            color: 'orange',
            icon: <ArrowDown size={20} />,
            note: 'Can be exceeded in emergencies'
        },
        {
            code: 'MZFM',
            name: 'Max Zero Fuel Mass',
            description: 'Maximum mass without fuel. Limited by wing root strength.',
            color: 'red',
            icon: <Scale size={20} />,
            note: 'Calculated for +2.5G load factor'
        },
        {
            code: 'MSTM',
            name: 'Max Structural Taxi Mass',
            description: 'Maximum mass for taxiing (Ramp/Block Mass)',
            color: 'purple',
            icon: <Plane size={20} />
        },
        {
            code: 'RTOM',
            name: 'Regulated Take-Off Mass',
            description: 'Lower of MSTOM and Performance Limited TOM',
            color: 'cyan',
            icon: <Shield size={20} />
        },
        {
            code: 'RLM',
            name: 'Regulated Landing Mass',
            description: 'Lower of MSLM and Performance Limited LM',
            color: 'emerald',
            icon: <Shield size={20} />
        },
    ];

    const selectedLimitData = limits.find(l => l.code === selectedLimit);

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-red-500/10 rounded-full mb-4">
                    <Shield className="w-8 h-8 text-red-400" />
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                    Structural <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">Mass Limits</span>
                </h1>
                <p className="text-slate-400 mt-2">Understanding aircraft structural limitations</p>
            </div>

            {/* Visual Mass Envelope */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-6">Mass Envelope Visualization</h3>

                <div className="relative h-80 bg-slate-900 rounded-xl p-4 overflow-hidden">
                    {/* Y-axis labels */}
                    <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-500 py-4">
                        <span>{(mstm / 1000).toFixed(0)}t</span>
                        <span>{((mstm + 0) / 2 / 1000).toFixed(0)}t</span>
                        <span>0t</span>
                    </div>

                    {/* Mass Bars */}
                    <div className="ml-12 h-full flex items-end gap-4">
                        {/* MSTM */}
                        <div className="flex-1 flex flex-col items-center">
                            <div
                                className="w-full bg-purple-500/30 border-t-4 border-purple-500 rounded-t transition-all duration-300 relative group cursor-pointer"
                                style={{ height: `${(mstm / mstm) * 100}%` }}
                                onClick={() => setSelectedLimit('MSTM')}
                            >
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-purple-400">{(mstm / 1000).toFixed(0)}t</span>
                            </div>
                            <span className="text-xs text-slate-400 mt-2">MSTM</span>
                        </div>

                        {/* MSTOM */}
                        <div className="flex-1 flex flex-col items-center">
                            <div
                                className="w-full bg-yellow-500/30 border-t-4 border-yellow-500 rounded-t transition-all duration-300 relative group cursor-pointer"
                                style={{ height: `${(mstom / mstm) * 100}%` }}
                                onClick={() => setSelectedLimit('MSTOM')}
                            >
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-yellow-400">{(mstom / 1000).toFixed(0)}t</span>
                            </div>
                            <span className="text-xs text-slate-400 mt-2">MSTOM</span>
                        </div>

                        {/* MSLM */}
                        <div className="flex-1 flex flex-col items-center">
                            <div
                                className="w-full bg-orange-500/30 border-t-4 border-orange-500 rounded-t transition-all duration-300 relative group cursor-pointer"
                                style={{ height: `${(mslm / mstm) * 100}%` }}
                                onClick={() => setSelectedLimit('MSLM')}
                            >
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-orange-400">{(mslm / 1000).toFixed(0)}t</span>
                            </div>
                            <span className="text-xs text-slate-400 mt-2">MSLM</span>
                        </div>

                        {/* MZFM */}
                        <div className="flex-1 flex flex-col items-center">
                            <div
                                className="w-full bg-red-500/30 border-t-4 border-red-500 rounded-t transition-all duration-300 relative group cursor-pointer"
                                style={{ height: `${(mzfm / mstm) * 100}%` }}
                                onClick={() => setSelectedLimit('MZFM')}
                            >
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-red-400">{(mzfm / 1000).toFixed(0)}t</span>
                            </div>
                            <span className="text-xs text-slate-400 mt-2">MZFM</span>
                        </div>

                        {/* Divider */}
                        <div className="w-px h-full bg-slate-700" />

                        {/* RTOM */}
                        <div className="flex-1 flex flex-col items-center">
                            <div
                                className="w-full bg-cyan-500/30 border-t-4 border-cyan-500 rounded-t transition-all duration-300 relative group cursor-pointer"
                                style={{ height: `${(rtom / mstm) * 100}%` }}
                                onClick={() => setSelectedLimit('RTOM')}
                            >
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-cyan-400">{(rtom / 1000).toFixed(0)}t</span>
                            </div>
                            <span className="text-xs text-slate-400 mt-2">RTOM</span>
                        </div>

                        {/* RLM */}
                        <div className="flex-1 flex flex-col items-center">
                            <div
                                className="w-full bg-emerald-500/30 border-t-4 border-emerald-500 rounded-t transition-all duration-300 relative group cursor-pointer"
                                style={{ height: `${(rlm / mstm) * 100}%` }}
                                onClick={() => setSelectedLimit('RLM')}
                            >
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-emerald-400">{(rlm / 1000).toFixed(0)}t</span>
                            </div>
                            <span className="text-xs text-slate-400 mt-2">RLM</span>
                        </div>

                        {/* Divider */}
                        <div className="w-px h-full bg-slate-700" />

                        {/* Current TOM */}
                        <div className="flex-1 flex flex-col items-center">
                            <div
                                className={`w-full rounded-t transition-all duration-300 relative ${tom > rtom ? 'bg-red-500/50 border-t-4 border-red-500 animate-pulse' : 'bg-green-500/30 border-t-4 border-green-500'
                                    }`}
                                style={{ height: `${(tom / mstm) * 100}%` }}
                            >
                                <span className={`absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold ${tom > rtom ? 'text-red-400' : 'text-green-400'}`}>
                                    {(tom / 1000).toFixed(0)}t
                                </span>
                            </div>
                            <span className="text-xs text-white mt-2 font-bold">TOM</span>
                        </div>
                    </div>
                </div>

                {/* Interactive Sliders */}
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Zero Fuel Mass (ZFM)</label>
                        <input
                            type="range"
                            min="40000"
                            max="65000"
                            value={currentMass}
                            onChange={e => setCurrentMass(Number(e.target.value))}
                            className="w-full accent-red-500"
                        />
                        <div className="flex justify-between text-sm mt-2">
                            <span className="text-slate-500">40t</span>
                            <span className={`font-bold ${currentMass > mzfm ? 'text-red-400' : 'text-white'}`}>
                                {(currentMass / 1000).toFixed(1)}t
                                {currentMass > mzfm && ' ⚠️ EXCEEDS MZFM'}
                            </span>
                            <span className="text-slate-500">65t</span>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block flex items-center gap-2">
                            <Fuel size={14} /> Take-Off Fuel
                        </label>
                        <input
                            type="range"
                            min="5000"
                            max="25000"
                            value={currentFuel}
                            onChange={e => setCurrentFuel(Number(e.target.value))}
                            className="w-full accent-yellow-500"
                        />
                        <div className="flex justify-between text-sm mt-2">
                            <span className="text-slate-500">5t</span>
                            <span className="font-bold text-yellow-400">{(currentFuel / 1000).toFixed(1)}t</span>
                            <span className="text-slate-500">25t</span>
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className={`mt-4 p-4 rounded-xl flex items-center justify-between ${tom > rtom || currentMass > mzfm
                        ? 'bg-red-900/30 border border-red-500'
                        : 'bg-green-900/30 border border-green-500'
                    }`}>
                    <div className="flex items-center gap-3">
                        {tom > rtom || currentMass > mzfm
                            ? <AlertTriangle className="text-red-400" />
                            : <CheckCircle className="text-green-400" />
                        }
                        <span className={`font-bold ${tom > rtom || currentMass > mzfm ? 'text-red-400' : 'text-green-400'}`}>
                            {tom > rtom || currentMass > mzfm ? 'LIMIT EXCEEDED!' : 'Within Limits'}
                        </span>
                    </div>
                    <div className="text-right text-sm">
                        <div className="text-slate-400">Take-Off Mass</div>
                        <div className="text-xl font-bold text-white">{(tom / 1000).toFixed(1)} tonnes</div>
                    </div>
                </div>
            </div>

            {/* Limit Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {limits.map(limit => (
                    <button
                        key={limit.code}
                        onClick={() => setSelectedLimit(limit.code)}
                        className={`p-4 rounded-xl border text-left transition-all hover:scale-105 ${selectedLimit === limit.code
                                ? `bg-${limit.color}-900/30 border-${limit.color}-500`
                                : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                            }`}
                    >
                        <div className={`text-${limit.color}-400 mb-2`}>{limit.icon}</div>
                        <h4 className="font-bold text-white text-sm">{limit.code}</h4>
                        <p className="text-xs text-slate-400 mt-1">{limit.name}</p>
                    </button>
                ))}
            </div>

            {/* Selected Limit Detail */}
            {selectedLimitData && (
                <div className={`bg-${selectedLimitData.color}-900/20 border border-${selectedLimitData.color}-500/50 rounded-xl p-6 animate-in fade-in`}>
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`text-${selectedLimitData.color}-400`}>{selectedLimitData.icon}</span>
                        <div>
                            <h3 className="text-xl font-bold text-white">{selectedLimitData.code}</h3>
                            <p className={`text-sm text-${selectedLimitData.color}-400`}>{selectedLimitData.name}</p>
                        </div>
                    </div>
                    <p className="text-slate-300">{selectedLimitData.description}</p>
                    {selectedLimitData.note && (
                        <div className="mt-4 p-3 bg-black/30 rounded-lg text-sm text-amber-400 flex items-center gap-2">
                            <Info size={16} />
                            {selectedLimitData.note}
                        </div>
                    )}
                </div>
            )}

            {/* Key Note */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                    <Info size={20} /> Key Points
                </h3>
                <ul className="text-sm text-slate-300 space-y-2">
                    <li>• Structural limits are set by the <strong>manufacturer</strong> in the AFM</li>
                    <li>• <strong>MSLM</strong> may be exceeded in emergencies</li>
                    <li>• <strong>MZFM</strong> is limited by wing root strength (calculated for +2.5G load factor)</li>
                    <li>• <strong>Regulated</strong> limits are the LOWER of structural and performance limits</li>
                </ul>
            </div>
        </div>
    );
};

export default StructuralLimits;
