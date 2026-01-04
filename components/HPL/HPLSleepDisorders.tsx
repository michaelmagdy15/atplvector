import React, { useState } from 'react';
import { Moon, Info, AlertOctagon, BedDouble, AlertTriangle } from 'lucide-react';

const HPLSleepDisorders: React.FC = () => {
    const [tab, setTab] = useState<'apnea' | 'narcolepsy' | 'parasomnia'>('apnea');

    return (
        <div className="space-y-6">
            <header className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <Moon className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100">Sleep Disorders</h1>
                </div>
                <p className="text-slate-400">
                    Conditions preventing restorative sleep. A major cause of chronic fatigue and disqualification.
                </p>
            </header>

            <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg">
                <button onClick={() => setTab('apnea')} className={`flex-1 py-2 rounded transition-colors ${tab === 'apnea' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>Sleep Apnea</button>
                <button onClick={() => setTab('narcolepsy')} className={`flex-1 py-2 rounded transition-colors ${tab === 'narcolepsy' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>Narcolepsy</button>
                <button onClick={() => setTab('parasomnia')} className={`flex-1 py-2 rounded transition-colors ${tab === 'parasomnia' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>Parasomnias</button>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 min-h-[400px]">
                {tab === 'apnea' && <ApneaInfo />}
                {tab === 'narcolepsy' && <NarcolepsyInfo />}
                {tab === 'parasomnia' && <ParasomniaInfo />}
            </div>
        </div>
    );
};

const ApneaInfo = () => (
    <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">Obstructive Sleep Apnea (OSA)</h3>
        <p className="text-slate-300">
            A serious disorder where breathing repeatedly stops and starts. The throat muscles relax and block the airway.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h4 className="font-bold text-red-400 mb-4">Mechanism</h4>
                <ol className="list-decimal list-inside space-y-3 text-sm text-slate-300">
                    <li>Muscles in the back of the throat relax during sleep.</li>
                    <li>Airway narrows or closes as you breathe in.</li>
                    <li>Breathing stops (Apnea) for 10-20 seconds.</li>
                    <li>O2 levels drop | CO2 levels rise.</li>
                    <li>Brain senses danger and briefly rouses you (Micro-arousal) to reopen airway.</li>
                    <li>Specific sleep cycle (REM) is interrupted repeatedly (hundreds of times).</li>
                </ol>
            </div>

            <div className="space-y-6">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-white text-sm mb-2">Risk Factors (STOP-BANG)</h4>
                    <ul className="text-xs text-slate-400 grid grid-cols-2 gap-2">
                        <li>• Snoring (Loud)</li>
                        <li>• Tired (Daytime)</li>
                        <li>• Observed (Stop breathing)</li>
                        <li>• Pressure (Blood - High)</li>
                        <li>• BMI (&gt;35)</li>
                        <li>• Age (&gt;50)</li>
                        <li>• Neck Size (Large)</li>
                        <li>• Gender (Male)</li>
                    </ul>
                </div>

                <div className="bg-indigo-900/20 p-4 rounded-xl border border-indigo-500/30">
                    <h4 className="font-bold text-indigo-300 text-sm mb-1">Aviation Impact</h4>
                    <p className="text-xs text-slate-300">
                        Causes <strong className="text-white">Excessive Daytime Sleepiness</strong>.
                        Pilots with OSA may fall asleep in cruise (Micro-sleeps).
                        Disqualifying unless treated (e.g., CPAP machine).
                    </p>
                </div>
            </div>
        </div>
    </div>
);

const NarcolepsyInfo = () => (
    <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Narcolepsy</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
                A chronic neurological disorder that affects the brain's ability to control sleep-wake cycles.
                Characterized by overwhelming daytime drowsiness and sudden attacks of sleep.
            </p>

            <div className="bg-red-500/10 p-6 rounded-xl border border-red-500/30">
                <div className="flex items-center gap-2 mb-2">
                    <AlertOctagon className="text-red-500" />
                    <h4 className="font-bold text-red-500">Permanently Disqualifying</h4>
                </div>
                <p className="text-xs text-slate-300">
                    A pilot cannot control when they fall asleep. Attacks can happen during conversation, driving, or flying.
                </p>
            </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h4 className="font-bold text-slate-200 mb-4">Key Symptoms</h4>
            <div className="space-y-4">
                <div className="flex gap-4">
                    <div className="w-1 bg-indigo-500 rounded"></div>
                    <div>
                        <strong className="text-indigo-300 text-sm">Cataplexy</strong>
                        <p className="text-xs text-slate-400">Sudden loss of muscle tone triggered by strong emotion (laughter/anger).</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-1 bg-indigo-500 rounded"></div>
                    <div>
                        <strong className="text-indigo-300 text-sm">Sleep Paralysis</strong>
                        <p className="text-xs text-slate-400">Inability to move or speak while falling asleep or waking up.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-1 bg-indigo-500 rounded"></div>
                    <div>
                        <strong className="text-indigo-300 text-sm">Hallucinations</strong>
                        <p className="text-xs text-slate-400">Vivid, dream-like experiences while awake (Hypnagogic).</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ParasomniaInfo = () => (
    <div className="space-y-8">
        <h3 className="text-xl font-bold text-white">Parasomnias</h3>
        <p className="text-slate-300">
            Abnormal behaviors or experiences that occur during sleep.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <BedDouble className="w-8 h-8 text-slate-500 mb-4" />
                <h4 className="font-bold text-white mb-2">Somnambulism</h4>
                <p className="text-xs text-slate-400">
                    <strong>Sleep Walking.</strong> Occurs during Slow Wave Sleep (Stage 3).
                    Person is unresponsive but can perform complex tasks.
                    Disqualifying if persistent in adulthood.
                </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <Info className="w-8 h-8 text-slate-500 mb-4" />
                <h4 className="font-bold text-white mb-2">Somniloquy</h4>
                <p className="text-xs text-slate-400">
                    <strong>Sleep Talking.</strong> Can occur in any stage. Usually harmless, but can disrupt crew rest in bunk situations.
                </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <AlertTriangle className="w-8 h-8 text-slate-500 mb-4" />
                <h4 className="font-bold text-white mb-2">Night Terrors</h4>
                <p className="text-xs text-slate-400">
                    Different from nightmares. Occur in SWS (not REM).
                    Sudden waking in terror with no memory of the event.
                    Indicates unstable nervous system.
                </p>
            </div>
        </div>
    </div>
);

export default HPLSleepDisorders;
