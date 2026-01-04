
import React, { useState } from 'react';
import { Thermometer, Flame, Snowflake, RefreshCw } from 'lucide-react';

const HPLThermal: React.FC = () => {
    const [tab, setTab] = useState<'reg' | 'cold' | 'heat'>('reg');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Thermometer className="text-orange-400" />
                        Thermal Physiology (040.02)
                    </h2>
                    <p className="text-slate-400 text-sm">Regulation, Hypothermia, and Heat Stress.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setTab('reg')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'reg' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}>Regulation</button>
                    <button onClick={() => setTab('cold')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'cold' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}>Cold</button>
                    <button onClick={() => setTab('heat')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'heat' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}>Heat</button>
                </div>
            </div>

            {tab === 'reg' && <Thermoregulation />}
            {tab === 'cold' && <Hypothermia />}
            {tab === 'heat' && <HeatStress />}
        </div>
    );
};

const Thermoregulation = () => (
    <div className="animate-in fade-in">
        <h3 className="text-xl font-bold text-white mb-6">Homeostasis (37°C)</h3>
        <p className="text-sm text-slate-400 mb-6">
            The body maintains core temp within a very narrow range. Control center: <strong>Hypothalamus</strong>.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 border-t-4 border-t-red-500">
                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Flame className="text-red-500" /> Too Hot (&gt;37.5°C)
                </h4>
                <ul className="text-sm text-slate-300 space-y-3">
                    <li className="bg-slate-800 p-3 rounded">
                        <strong className="text-red-400">Vasodilation:</strong> Blood vessels near skin widen to loose heat (Red skin).
                    </li>
                    <li className="bg-slate-800 p-3 rounded">
                        <strong className="text-red-400">Sweating:</strong> Evaporation cools the skin. (Ineffective in high humidity).
                    </li>
                    <li className="bg-slate-800 p-3 rounded">
                        <strong className="text-red-400">Behavior:</strong> Remove clothes, seek shade.
                    </li>
                </ul>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 border-t-4 border-t-cyan-500">
                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Snowflake className="text-cyan-500" /> Too Cold (&lt;36.5°C)
                </h4>
                <ul className="text-sm text-slate-300 space-y-3">
                    <li className="bg-slate-800 p-3 rounded">
                        <strong className="text-cyan-400">Vasoconstriction:</strong> Blood vessels near skin narrow to keep core warm (Pale/Blue skin). Risk of frostbite in extremities.
                    </li>
                    <li className="bg-slate-800 p-3 rounded">
                        <strong className="text-cyan-400">Shivering:</strong> Rapid muscle contraction to generate heat from metabolism.
                    </li>
                    <li className="bg-slate-800 p-3 rounded">
                        <strong className="text-cyan-400">Piloerection:</strong> Goosebumps (Vestigial fur raising).
                    </li>
                </ul>
            </div>
        </div>
    </div>
);

const Hypothermia = () => (
    <div className="animate-in slide-in-from-right-4">
        <h3 className="text-xl font-bold text-white mb-6">Hypothermia</h3>
        <div className="space-y-4">
            {[
                { stage: 'Mild', temp: '35 - 32°C', sym: 'Max Shivering, Alert, "Umbles" (Stumbles, Mumbles, Fumbles).', action: 'Rewarm actively.' },
                { stage: 'Moderate', temp: '32 - 28°C', sym: 'Shivering stops (Danger!), Apathy, Drowsiness.', action: 'Handle gently. Cardiac risk.' },
                { stage: 'Severe', temp: '< 28°C', sym: 'Unconscious, slow pulse, death mimics.', action: 'Medical emergency.' }
            ].map((s, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-4 bg-slate-900 p-4 rounded-xl border border-slate-700">
                    <div className="w-32 shrink-0">
                        <div className={`font-bold text-lg ${i === 0 ? 'text-cyan-300' : i === 1 ? 'text-blue-400' : 'text-blue-600'}`}>
                            {s.stage}
                        </div>
                        <div className="text-xs text-slate-500 font-mono font-bold">{s.temp}</div>
                    </div>
                    <div>
                        <p className="text-sm text-white mb-1">{s.sym}</p>
                        <p className="text-xs text-slate-400">Action: {s.action}</p>
                    </div>
                </div>
            ))}
        </div>

        <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
            <h4 className="font-bold text-white text-sm">Water Survival</h4>
            <p className="text-xs text-slate-400 mt-2">
                Water conducts heat <strong>25x faster</strong> than air.
                <br />Survival time in 4°C water is &lt; 30 minutes without a suit.
            </p>
        </div>
    </div>
);

const HeatStress = () => (
    <div className="animate-in slide-in-from-right-4 grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white text-lg mb-2">Heat Exhaustion</h4>
                <p className="text-xs text-slate-400 bg-yellow-500/10 text-yellow-400 inline-block px-2 py-1 rounded mb-4">Warning Stage</p>
                <ul className="text-sm text-slate-300 list-disc pl-4 space-y-1">
                    <li>Heavy sweating.</li>
                    <li>Pale, clammy skin.</li>
                    <li>Weakness, dizziness.</li>
                    <li>Normal or slightly high temp.</li>
                </ul>
                <div className="mt-4 text-xs font-bold text-white">Action: Cool down, hydrate, rest.</div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 border-red-500/30">
                <h4 className="font-bold text-red-500 text-lg mb-2">Heat Stroke</h4>
                <p className="text-xs text-red-400 bg-red-900/10 text-red-400 inline-block px-2 py-1 rounded mb-4">Medical Emergency</p>
                <ul className="text-sm text-slate-300 list-disc pl-4 space-y-1">
                    <li><strong>NO sweating</strong> (Mechanism failed).</li>
                    <li>Red, hot, dry skin.</li>
                    <li>Confusion, unconsciousness.</li>
                    <li>Core temp &gt; 40°C.</li>
                </ul>
                <div className="mt-4 text-xs font-bold text-red-400">Action: Rapid cooling (Ice), 911.</div>
            </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col justify-center">
            <h4 className="font-bold text-white text-sm mb-4">Humidity Factor</h4>
            <div className="relative h-48 bg-gradient-to-t from-emerald-500 via-yellow-500 to-red-500 rounded-lg w-8 mx-auto mb-4">
                <div className="absolute top-1/2 left-full ml-2 w-32 text-xs text-slate-400">
                    High Humidity prevents evaporation = Sweat doesn't work.
                </div>
            </div>
            <p className="text-center text-xs text-slate-300">
                30°C at 90% humidity feels like 40°C (Heat Index).
                <br />Dehydration risk increases as sweat drips off without cooling.
            </p>
        </div>
    </div>
);

export default HPLThermal;
