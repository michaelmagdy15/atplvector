import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Plane, AlertTriangle, CheckCircle, Fuel, Gauge, RotateCcw, TrendingUp, TrendingDown, Info } from 'lucide-react';

const CGEffects: React.FC = () => {
    const [cgPosition, setCgPosition] = useState(25); // % MAC

    const fwdLimit = 15;
    const aftLimit = 35;
    const neutral = 25;

    const isForward = cgPosition < neutral;
    const isAft = cgPosition > neutral;
    const isOutOfLimits = cgPosition < fwdLimit || cgPosition > aftLimit;

    const forwardEffects = [
        { icon: <Fuel size={16} />, label: 'Fuel Consumption', change: 'Increased', bad: true },
        { icon: <Plane size={16} />, label: 'Range & Endurance', change: 'Decreased', bad: true },
        { icon: <Gauge size={16} />, label: 'Elevator Control Loads', change: 'Increased', bad: true },
        { icon: <CheckCircle size={16} />, label: 'Longitudinal Stability', change: 'Increased', bad: false },
        { icon: <TrendingUp size={16} />, label: 'Stall Speed', change: 'Increased', bad: true },
        { icon: <TrendingDown size={16} />, label: 'Absolute Ceiling', change: 'Decreased', bad: true },
        { icon: <TrendingDown size={16} />, label: 'Rate of Climb', change: 'Decreased', bad: true },
    ];

    const aftEffects = [
        { icon: <AlertTriangle size={16} />, label: 'Longitudinal Stability', change: 'Decreased', bad: true },
        { icon: <Gauge size={16} />, label: 'Pitch Stick Forces', change: 'Very Light', bad: true },
        { icon: <RotateCcw size={16} />, label: 'Spin Recovery', change: 'Difficult', bad: true },
        { icon: <Fuel size={16} />, label: 'Range & Endurance', change: 'Increased', bad: false },
        { icon: <TrendingDown size={16} />, label: 'Stall Speed', change: 'Decreased', bad: false },
    ];

    // Calculate aircraft pitch rotation based on CG
    const pitchRotation = (cgPosition - neutral) * 0.5; // degrees

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-violet-500/10 rounded-full mb-4">
                    <Plane className="w-8 h-8 text-violet-400" />
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                    CG Position <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-500">Effects</span>
                </h1>
                <p className="text-slate-400 mt-2">Forward vs Aft CG comparison</p>
            </div>

            {/* Interactive CG Slider with Aircraft Visualization */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                {/* Aircraft Side View */}
                <div className="relative h-48 mb-8 overflow-hidden">
                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-10">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="absolute top-0 bottom-0 border-l border-slate-400" style={{ left: `${i * 5}%` }} />
                        ))}
                    </div>

                    {/* Horizon Line */}
                    <div className="absolute left-0 right-0 top-1/2 border-t-2 border-dashed border-slate-600" />

                    {/* Aircraft */}
                    <div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
                        style={{ transform: `translate(-50%, -50%) rotate(${pitchRotation}deg)` }}
                    >
                        {/* Fuselage */}
                        <div className="relative">
                            <div className="w-64 h-8 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 rounded-full relative">
                                {/* Cockpit */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-6 bg-sky-400/50 rounded-l-full" />
                                {/* Tail */}
                                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-12 bg-slate-500 rounded-t-lg origin-bottom" />
                            </div>
                            {/* Wings */}
                            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-16 h-48 bg-slate-600 rounded-lg -z-10" />

                            {/* CG Marker */}
                            <div
                                className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all duration-300 ${isOutOfLimits
                                        ? 'bg-red-500 border-white animate-pulse'
                                        : 'bg-green-500 border-white'
                                    }`}
                                style={{ left: `${cgPosition}%` }}
                            >
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-white bg-black/70 px-2 py-1 rounded">
                                    CG: {cgPosition}% MAC
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Labels */}
                    <div className="absolute left-4 top-4 text-xs font-bold text-cyan-400 uppercase">Forward (Nose Heavy)</div>
                    <div className="absolute right-4 top-4 text-xs font-bold text-pink-400 uppercase">Aft (Tail Heavy)</div>
                </div>

                {/* CG Slider */}
                <div className="relative">
                    {/* Limit markers */}
                    <div className="absolute top-0 h-4 border-l-2 border-red-500" style={{ left: `${fwdLimit}%` }}>
                        <span className="absolute -top-6 -translate-x-1/2 text-[10px] text-red-400 font-bold">FWD</span>
                    </div>
                    <div className="absolute top-0 h-4 border-l-2 border-red-500" style={{ left: `${aftLimit}%` }}>
                        <span className="absolute -top-6 -translate-x-1/2 text-[10px] text-red-400 font-bold">AFT</span>
                    </div>

                    <input
                        type="range"
                        min="5"
                        max="45"
                        value={cgPosition}
                        onChange={e => setCgPosition(Number(e.target.value))}
                        className={`w-full h-3 rounded-full appearance-none cursor-pointer ${isOutOfLimits ? 'accent-red-500' : 'accent-violet-500'
                            }`}
                        style={{
                            background: `linear-gradient(to right, 
                                #ef4444 0%, #ef4444 ${fwdLimit}%, 
                                #22c55e ${fwdLimit}%, #22c55e ${aftLimit}%, 
                                #ef4444 ${aftLimit}%, #ef4444 100%)`
                        }}
                    />

                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                        <span>0%</span>
                        <span>50% MAC</span>
                    </div>
                </div>

                {/* Status */}
                <div className={`mt-4 p-4 rounded-xl text-center font-bold ${isOutOfLimits
                        ? 'bg-red-900/30 text-red-400 border border-red-500/50'
                        : 'bg-green-900/30 text-green-400 border border-green-500/50'
                    }`}>
                    {isOutOfLimits
                        ? '⚠️ CG OUT OF LIMITS - DANGEROUS!'
                        : `✓ CG Within Limits (${fwdLimit}% - ${aftLimit}% MAC)`
                    }
                </div>
            </div>

            {/* Side by Side Comparison */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Forward CG */}
                <div className={`rounded-2xl p-6 border transition-all duration-300 ${isForward
                        ? 'bg-cyan-900/30 border-cyan-500 shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-800/50 border-slate-700 opacity-60'
                    }`}>
                    <div className="flex items-center gap-3 mb-6">
                        <ArrowLeft className="text-cyan-400" />
                        <h2 className="text-xl font-bold text-white">Forward CG</h2>
                        <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full">Nose Heavy</span>
                    </div>

                    <div className="space-y-3">
                        {forwardEffects.map((effect, idx) => (
                            <div
                                key={idx}
                                className={`flex items-center justify-between p-3 rounded-lg transition-all ${isForward ? 'bg-slate-900/50' : 'bg-slate-900/30'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className={effect.bad ? 'text-rose-400' : 'text-emerald-400'}>
                                        {effect.icon}
                                    </span>
                                    <span className="text-sm text-slate-300">{effect.label}</span>
                                </div>
                                <span className={`text-xs font-bold ${effect.bad ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {effect.change}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 p-3 bg-slate-900 rounded-lg text-xs text-slate-400">
                        <strong className="text-cyan-400">Summary:</strong> Same effects as a HEAVIER aircraft
                    </div>
                </div>

                {/* Aft CG */}
                <div className={`rounded-2xl p-6 border transition-all duration-300 ${isAft
                        ? 'bg-pink-900/30 border-pink-500 shadow-lg shadow-pink-500/20'
                        : 'bg-slate-800/50 border-slate-700 opacity-60'
                    }`}>
                    <div className="flex items-center gap-3 mb-6">
                        <ArrowRight className="text-pink-400" />
                        <h2 className="text-xl font-bold text-white">Aft CG</h2>
                        <span className="text-xs px-2 py-1 bg-pink-500/20 text-pink-400 rounded-full">Tail Heavy</span>
                    </div>

                    <div className="space-y-3">
                        {aftEffects.map((effect, idx) => (
                            <div
                                key={idx}
                                className={`flex items-center justify-between p-3 rounded-lg transition-all ${isAft ? 'bg-slate-900/50' : 'bg-slate-900/30'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className={effect.bad ? 'text-rose-400' : 'text-emerald-400'}>
                                        {effect.icon}
                                    </span>
                                    <span className="text-sm text-slate-300">{effect.label}</span>
                                </div>
                                <span className={`text-xs font-bold ${effect.bad ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {effect.change}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 p-3 bg-slate-900 rounded-lg text-xs text-slate-400">
                        <strong className="text-pink-400">Summary:</strong> Same effects as a LIGHTER aircraft
                    </div>

                    {/* Warning for Aft CG */}
                    <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
                        <div className="flex items-center gap-2 text-red-400 text-xs font-bold">
                            <AlertTriangle size={14} />
                            Light stick forces could lead to overstress!
                        </div>
                    </div>
                </div>
            </div>

            {/* Important Note */}
            <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-amber-400 mb-3 flex items-center gap-2">
                    <Info size={20} /> CG Limits
                </h3>
                <ul className="text-sm text-slate-300 space-y-2">
                    <li>• CG limits are specified in the Aircraft Flight Manual (AFM)</li>
                    <li>• Safety margins are applied for crew/pax movement and fuel consumption</li>
                    <li>• Gear deployment will move the CG position</li>
                    <li>• Tailwheel aircraft must be measured in the flight position</li>
                </ul>
            </div>
        </div>
    );
};

export default CGEffects;
