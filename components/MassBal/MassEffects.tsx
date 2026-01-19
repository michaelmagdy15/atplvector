import React, { useState } from 'react';
import { Weight, TrendingUp, TrendingDown, Plane, Fuel, Gauge, Timer, ArrowUp, ArrowDown, Info, Zap } from 'lucide-react';

interface EffectCard {
    label: string;
    icon: React.ReactNode;
    effect: 'increase' | 'decrease' | 'none';
    description: string;
}

const MassEffects: React.FC = () => {
    const [mass, setMass] = useState(50000); // Current mass in kg
    const baseMass = 40000; // Reference mass
    const massRatio = mass / baseMass;

    // Stall speed calculation: VS1 = VS0 × √(W1/W0)
    const baseStallSpeed = 120; // knots
    const newStallSpeed = baseStallSpeed * Math.sqrt(massRatio);

    // Effect intensity (0-100) based on mass increase
    const intensity = Math.min(100, ((mass - baseMass) / baseMass) * 100);

    const effects: EffectCard[] = [
        { label: 'VMC (Min Control Speed)', icon: <Gauge size={20} />, effect: 'increase', description: 'Reduced manoeuvrability' },
        { label: 'Take-Off Run', icon: <Plane size={20} />, effect: 'increase', description: 'Longer runway required' },
        { label: 'Angle of Climb', icon: <TrendingUp size={20} />, effect: 'decrease', description: 'Lower climb gradient' },
        { label: 'Rate of Climb', icon: <ArrowUp size={20} />, effect: 'decrease', description: 'Slower vertical speed' },
        { label: 'Fuel Consumption', icon: <Fuel size={20} />, effect: 'increase', description: 'Higher burn rate' },
        { label: 'Tyre Wear', icon: <Zap size={20} />, effect: 'increase', description: 'More stress on landing gear' },
        { label: 'Landing Speed', icon: <Plane size={20} />, effect: 'increase', description: 'Higher approach speed' },
        { label: 'Angle of Glide', icon: <TrendingDown size={20} />, effect: 'increase', description: 'Steeper descent path' },
        { label: 'VMU (Min Unstick Speed)', icon: <ArrowUp size={20} />, effect: 'increase', description: 'Rotate later' },
        { label: 'Glide Range', icon: <Plane size={20} />, effect: 'none', description: 'No effect on distance' },
    ];

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-rose-500/10 rounded-full mb-4">
                    <Weight className="w-8 h-8 text-rose-400" />
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                    Effects of <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-500">Increased Mass</span>
                </h1>
                <p className="text-slate-400 mt-2">Understanding how weight affects aircraft performance</p>
            </div>

            {/* Lift Formula Card */}
            <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl p-6 border border-indigo-500/30">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Info className="text-indigo-400" /> Lift Formula
                </h3>
                <div className="flex flex-wrap items-center justify-center gap-4 text-white font-mono text-xl md:text-2xl">
                    <span className="text-yellow-400 font-bold">L</span>
                    <span>=</span>
                    <span className="text-slate-400">½</span>
                    <span className="text-cyan-400">ρ</span>
                    <span>×</span>
                    <span className="text-green-400">TAS²</span>
                    <span>×</span>
                    <span className="text-orange-400">S</span>
                    <span>×</span>
                    <span className="text-pink-400">C<sub>L</sub></span>
                </div>
                <p className="text-center text-slate-400 text-sm mt-4">
                    When mass increases, lift must also increase to maintain equilibrium
                </p>
            </div>

            {/* Interactive Mass Slider */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Slider Control */}
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-400 uppercase block">Aircraft Mass</label>
                        <input
                            type="range"
                            min="30000"
                            max="70000"
                            step="1000"
                            value={mass}
                            onChange={e => setMass(Number(e.target.value))}
                            className="w-full accent-rose-500 h-3 rounded-full"
                        />
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-sm">Light</span>
                            <span className="text-3xl font-black text-white">{(mass / 1000).toFixed(0)} <span className="text-lg text-slate-400">tonnes</span></span>
                            <span className="text-slate-500 text-sm">Heavy</span>
                        </div>

                        {/* Reference mass indicator */}
                        <div className="bg-slate-900 rounded-lg p-4 mt-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Reference Mass:</span>
                                <span className="text-yellow-400 font-bold">{(baseMass / 1000).toFixed(0)} tonnes</span>
                            </div>
                            <div className="flex justify-between text-sm mt-2">
                                <span className="text-slate-400">Mass Ratio (W₁/W₀):</span>
                                <span className={`font-bold ${massRatio > 1 ? 'text-rose-400' : 'text-green-400'}`}>
                                    {massRatio.toFixed(3)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stall Speed Calculator */}
                    <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-xl p-6 border border-amber-500/30">
                        <h3 className="text-lg font-bold text-amber-400 mb-4">Stall Speed Relationship</h3>
                        <div className="text-center font-mono text-lg text-white mb-4">
                            V<sub>S1</sub> = V<sub>S0</sub> × √(W₁/W₀)
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-black/30 rounded-lg p-3">
                                <div className="text-slate-400 text-xs uppercase mb-1">Base Stall Speed</div>
                                <div className="text-xl font-bold text-white">{baseStallSpeed} <span className="text-sm text-slate-400">kt</span></div>
                            </div>
                            <div className={`rounded-lg p-3 ${massRatio > 1 ? 'bg-rose-900/50' : 'bg-green-900/50'}`}>
                                <div className="text-slate-400 text-xs uppercase mb-1">New Stall Speed</div>
                                <div className={`text-xl font-bold ${massRatio > 1 ? 'text-rose-400' : 'text-green-400'}`}>
                                    {newStallSpeed.toFixed(1)} <span className="text-sm opacity-70">kt</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-4 text-center">
                            Increase in weight = Increase in stall speed
                        </p>
                    </div>
                </div>
            </div>

            {/* Effects Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {effects.map((effect, idx) => (
                    <div
                        key={idx}
                        className={`relative overflow-hidden rounded-xl p-4 border transition-all duration-300 group hover:scale-105 ${effect.effect === 'increase'
                                ? 'bg-rose-900/20 border-rose-500/30 hover:border-rose-500'
                                : effect.effect === 'decrease'
                                    ? 'bg-emerald-900/20 border-emerald-500/30 hover:border-emerald-500'
                                    : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                            }`}
                    >
                        {/* Animated fill based on intensity */}
                        {effect.effect !== 'none' && (
                            <div
                                className={`absolute bottom-0 left-0 right-0 transition-all duration-500 ${effect.effect === 'increase' ? 'bg-rose-500/20' : 'bg-emerald-500/20'
                                    }`}
                                style={{ height: `${intensity}%` }}
                            />
                        )}

                        <div className="relative z-10">
                            <div className={`mb-2 ${effect.effect === 'increase'
                                    ? 'text-rose-400'
                                    : effect.effect === 'decrease'
                                        ? 'text-emerald-400'
                                        : 'text-slate-400'
                                }`}>
                                {effect.icon}
                            </div>
                            <h4 className="text-xs font-bold text-white mb-1 leading-tight">{effect.label}</h4>
                            <div className="flex items-center gap-1">
                                {effect.effect === 'increase' && <ArrowUp size={12} className="text-rose-400" />}
                                {effect.effect === 'decrease' && <ArrowDown size={12} className="text-emerald-400" />}
                                {effect.effect === 'none' && <span className="text-slate-500 text-[10px]">—</span>}
                                <span className={`text-[10px] uppercase font-bold ${effect.effect === 'increase'
                                        ? 'text-rose-400'
                                        : effect.effect === 'decrease'
                                            ? 'text-emerald-400'
                                            : 'text-slate-500'
                                    }`}>
                                    {effect.effect === 'none' ? 'No Change' : effect.effect}
                                </span>
                            </div>
                        </div>

                        {/* Tooltip on hover */}
                        <div className="absolute inset-0 bg-black/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-2">
                            <p className="text-xs text-center text-slate-300">{effect.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Key Points Summary */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                    <Info size={20} /> Key Points to Remember
                </h3>
                <ul className="grid md:grid-cols-2 gap-3 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                        <span className="text-rose-400 font-bold">•</span>
                        Heavier aircraft = Higher stall speed
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-rose-400 font-bold">•</span>
                        Increased mass requires more lift
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        Glide RANGE is NOT affected by mass
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-rose-400 font-bold">•</span>
                        Glide ANGLE increases with mass
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default MassEffects;
