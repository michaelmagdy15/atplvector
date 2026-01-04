
import React, { useState } from 'react';
import { Moon, Wind, Zap, AlertOctagon } from 'lucide-react';

const HPLSleepDisorders: React.FC = () => {
    const [tab, setTab] = useState<'apnea' | 'insomnia' | 'para'>('apnea');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Moon className="text-purple-400" />
                        Sleep Disorders (040.02)
                    </h2>
                    <p className="text-slate-400 text-sm">Apnea, Insomnia, and disqualifying conditions.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setTab('apnea')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'apnea' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>Sleep Apnea</button>
                    <button onClick={() => setTab('insomnia')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'insomnia' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>Insomnia</button>
                    <button onClick={() => setTab('para')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'para' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>Other</button>
                </div>
            </div>

            {tab === 'apnea' && <SleepApnea />}
            {tab === 'insomnia' && <Insomnia />}
            {tab === 'para' && <OtherDisorders />}
        </div>
    );
};

const SleepApnea = () => (
    <div className="animate-in fade-in grid md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Wind className="text-slate-400" /> Obstructive Sleep Apnea (OSA)
            </h3>
            <p className="text-sm text-slate-300 mb-6">
                Throat muscles relax during sleep, blocking the airway. Breathing stops (Apnea) until brain wakes up briefly to gasp.
            </p>

            <div className="space-y-4">
                <div className="bg-slate-800 p-4 rounded border-l-4 border-red-500">
                    <h4 className="font-bold text-white text-sm">Risk Factors</h4>
                    <ul className="text-xs text-slate-400 mt-2 list-disc pl-4">
                        <li>Obesity (Neck circumference).</li>
                        <li>Age / Male gender.</li>
                        <li>Alcohol / Sedatives.</li>
                    </ul>
                </div>

                <div className="bg-slate-800 p-4 rounded border-l-4 border-orange-500">
                    <h4 className="font-bold text-white text-sm">Symptoms</h4>
                    <ul className="text-xs text-slate-400 mt-2 list-disc pl-4">
                        <li>Loud snoring.</li>
                        <li>Excessive daytime sleepiness.</li>
                        <li>Morning headaches (Hypoxia).</li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col justify-center">
            <div className="text-center mb-6">
                <AlertOctagon size={48} className="text-red-500 mx-auto mb-2" />
                <h4 className="font-bold text-white text-xl">Fitness to Fly?</h4>
                <p className="text-red-400 font-bold mt-2">DISQUALIFYING</p>
                <p className="text-xs text-slate-500 mt-1">Unless treated.</p>
            </div>

            <div className="bg-emerald-900/20 p-4 rounded-lg border border-emerald-500/30">
                <h5 className="font-bold text-emerald-400 text-sm mb-1">Treatment</h5>
                <p className="text-xs text-slate-300">
                    <strong>CPAP Machine:</strong> Continuous Positive Airway Pressure. Keeps airway open.
                    <br />Weight loss.
                </p>
            </div>
        </div>
    </div>
);

const Insomnia = () => (
    <div className="animate-in slide-in-from-right-4">
        <h3 className="text-xl font-bold text-white mb-6">Insomnia</h3>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-white text-sm mb-2">Clinical</h4>
                    <p className="text-xs text-slate-400">Unable to fall asleep or stay asleep for &gt; 3 weeks.</p>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-white text-sm mb-2">Situational</h4>
                    <p className="text-xs text-slate-400">Circadian disruption (Jet Lag) or Route Stress.</p>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white mb-4">Management</h4>
                <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex gap-2">
                        <span className="text-green-500">✓</span>
                        <span><strong>Sleep Hygiene:</strong> Dark room, cool temp, no screens.</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-green-500">✓</span>
                        <span><strong>Caffeine Stop:</strong> 6 hours before bed.</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-red-500">✗</span>
                        <span><strong>Alcohol:</strong> Helps onset, but ruins REM sleep (fragmentation).</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-red-500">✗</span>
                        <span><strong>Sleeping Pills:</strong> Last resort. "Hangover" effect. Banned unless approved.</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
);

const OtherDisorders = () => (
    <div className="animate-in fade-in grid md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="text-yellow-400" /> Narcolepsy
            </h3>
            <p className="text-sm text-slate-300 mb-4">
                Unexpectedly falling asleep ("Sleep Attacks"), often triggered by emotion.
            </p>
            <div className="bg-red-900/20 p-4 rounded border border-red-500/50">
                <span className="font-bold text-red-500 text-sm">PERMANENTLY UNFIT</span>
                <p className="text-xs text-red-200 mt-1">Cannot hold a medical certificate.</p>
            </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-4">Parasomnias</h3>
            <div className="space-y-4">
                <div>
                    <h4 className="text-sm font-bold text-white">Somnambulism (Sleep Walking)</h4>
                    <p className="text-xs text-slate-400">Occurs in Slow Wave Sleep (Stage 3/4). Disqualifying if adult.</p>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-white">Sleep Talking</h4>
                    <p className="text-xs text-slate-400">Usually harmless.</p>
                </div>
            </div>
        </div>
    </div>
);

export default HPLSleepDisorders;
