import React, { useState } from 'react';
import { Thermometer, Droplet, Flame, Snowflake } from 'lucide-react';

const HPLThermal: React.FC = () => {
    const [tab, setTab] = useState<'regulation' | 'extremes' | 'humidity'>('regulation');

    return (
        <div className="space-y-6">
            <header className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                        <Thermometer className="w-6 h-6 text-orange-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100">Thermal Physiology</h1>
                </div>
                <p className="text-slate-400">
                    The body maintains a core temp of ~37°C. Deviations impair performance significantly.
                </p>
            </header>

            <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg">
                <button onClick={() => setTab('regulation')} className={`flex-1 py-2 rounded transition-colors ${tab === 'regulation' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>Regulation</button>
                <button onClick={() => setTab('extremes')} className={`flex-1 py-2 rounded transition-colors ${tab === 'extremes' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>Extremes</button>
                <button onClick={() => setTab('humidity')} className={`flex-1 py-2 rounded transition-colors ${tab === 'humidity' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>Humidity</button>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 min-h-[400px]">
                {tab === 'regulation' && <RegulationSystem />}
                {tab === 'extremes' && <ThermalExtremes />}
                {tab === 'humidity' && <HumidityEffects />}
            </div>
        </div>
    );
};

const RegulationSystem = () => (
    <div className="space-y-8">
        <h3 className="text-xl font-bold text-white">Homeostasis Control Loop</h3>

        <div className="grid md:grid-cols-3 gap-8 text-center items-center">
            <div className="bg-blue-900/30 p-6 rounded-xl border border-blue-500/30">
                <Snowflake className="mx-auto mb-4 text-blue-400" />
                <h4 className="font-bold text-white mb-2">Response to Cold</h4>
                <ul className="text-left text-sm text-slate-300 space-y-2">
                    <li>• <strong>Vasoconstriction:</strong> Blood vessels narrow to keep warm blood in core.</li>
                    <li>• <strong>Shivering:</strong> Muscles twitch to generate heat.</li>
                    <li>• <strong>Metabolism:</strong> Increases to burn fuel.</li>
                </ul>
            </div>

            <div className="flex flex-col items-center">
                <div className="bg-slate-900 p-4 rounded-full border-4 border-slate-700 z-10 w-32 h-32 flex flex-col justify-center items-center">
                    <span className="text-xs text-slate-400 uppercase font-bold">Controller</span>
                    <span className="font-black text-white">Hypothalamus</span>
                    <span className="text-xs text-slate-500 mt-1">37°C Setpoint</span>
                </div>
            </div>

            <div className="bg-red-900/30 p-6 rounded-xl border border-red-500/30">
                <Flame className="mx-auto mb-4 text-red-400" />
                <h4 className="font-bold text-white mb-2">Response to Heat</h4>
                <ul className="text-left text-sm text-slate-300 space-y-2">
                    <li>• <strong>Vasodilation:</strong> Vessels widen to radiate heat at skin.</li>
                    <li>• <strong>Sweating:</strong> Evaporation cools the skin.</li>
                    <li>• <strong>Metabolism:</strong> Decreases (lethargy).</li>
                </ul>
            </div>
        </div>

        <div className="bg-slate-700/30 p-4 rounded-lg text-center text-sm text-slate-300 border border-slate-600 max-w-2xl mx-auto">
            For every 1°C rise in body temp, metabolic rate (and oxygen demand) increases by ~10%. <br />
            <span className="text-yellow-400 font-bold">Fever induces Hypoxia faster at altitude.</span>
        </div>
    </div>
);

const ThermalExtremes = () => (
    <div className="grid md:grid-cols-2 gap-8">
        <div>
            <div className="flex items-center gap-2 mb-4">
                <Snowflake className="text-blue-400" />
                <h3 className="text-xl font-bold text-white">Hypothermia</h3>
            </div>

            <div className="space-y-4">
                <StageCard temp="35-36°C" title="Mild" desc="Shivering, loss of fine motor skills (can't fly), lethargy." color="blue" />
                <StageCard temp="33-35°C" title="Moderate" desc="Shivering STOPS (danger sign), confusion, slurred speech." color="blue" />
                <StageCard temp="< 32°C" title="Severe" desc="Unconsciousness, cardiac arrhythmia, death." color="blue" />

                <div className="bg-blue-900/20 p-4 rounded text-sm text-slate-300 border-l-4 border-blue-500 mt-4">
                    <strong>Survival:</strong> In cold water, survival time is drastically reduced. HELP posture conserves heat.
                </div>
            </div>
        </div>

        <div>
            <div className="flex items-center gap-2 mb-4">
                <Flame className="text-red-400" />
                <h3 className="text-xl font-bold text-white">Hyperthermia</h3>
            </div>

            <div className="space-y-4">
                <StageCard temp="> 38°C" title="Heat Exhaustion" desc="Heavy sweating, pale skin, dizzy, rapid pulse." color="red" />
                <StageCard temp="> 40°C" title="Heat Stroke" desc="Sweating STOPS (dry hot skin), unconsciousness. Medical Emergency." color="red" />

                <div className="bg-red-900/20 p-4 rounded text-sm text-slate-300 border-l-4 border-red-500 mt-4">
                    <strong>Dehydration:</strong> A key factor. Losing 2% body weight in water = sigificant performance drop. Thirst is a late indicator.
                </div>
            </div>
        </div>
    </div>
);

const StageCard = ({ temp, title, desc, color }: any) => (
    <div className={`p-4 rounded-lg bg-slate-900 border ${color === 'blue' ? 'border-blue-500/20' : 'border-red-500/20'}`}>
        <div className="flex justify-between items-center mb-1">
            <span className={`font-bold ${color === 'blue' ? 'text-blue-300' : 'text-red-300'}`}>{title}</span>
            <span className="text-xs font-mono bg-black/40 px-2 py-1 rounded text-white">{temp}</span>
        </div>
        <p className="text-xs text-slate-400">{desc}</p>
    </div>
);

const HumidityEffects = () => (
    <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">Humidity & Comfort</h3>
        <p className="text-slate-300">
            Air in pressurized cabins is extremely dry (Relative Humidity ~3-5%). This is due to the cold external air holding very little moisture before being heated.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-4">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h4 className="font-bold text-slate-200 flex items-center gap-2 mb-4">
                    <Droplet size={18} className="text-blue-400" /> Low Humidity Hazards
                </h4>
                <ul className="space-y-3 text-sm text-slate-400">
                    <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> Dehydration (rapid fluid loss).</li>
                    <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> Dry eyes (contact lens issues).</li>
                    <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> Mucous membrane irritation (throat/nose).</li>
                    <li className="flex gap-2"><span className="text-blue-500 font-bold">•</span> Kidney stones (long term).</li>
                </ul>
                <div className="mt-4 text-xs font-bold text-blue-400">
                    Fix: Drink water frequently. Avoid coffee/tea (diuretics).
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h4 className="font-bold text-slate-200 flex items-center gap-2 mb-4">
                    <Thermometer size={18} className="text-orange-400" /> High Humidity (Heat)
                </h4>
                <p className="text-sm text-slate-400 mb-4">
                    High humidity reduces the effectiveness of sweating (evaporation).
                </p>
                <div className="bg-orange-500/10 p-3 rounded border border-orange-500/20">
                    <strong className="text-orange-300 text-sm">Performance Impact</strong>
                    <p className="text-xs text-slate-300 mt-1">
                        At high temps + high humidity, the body cannot cool itself.
                        Safe working times are drastically reduced.
                        "Apparent Temperature" is much higher than actual air temp.
                    </p>
                </div>
            </div>
        </div>
    </div>
);

export default HPLThermal;
