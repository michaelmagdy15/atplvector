import React, { useState } from 'react';
import { Globe, Users, ShieldCheck, Scale } from 'lucide-react';

const HPLCulture: React.FC = () => {
    const [tab, setTab] = useState<'national' | 'safety' | 'just'>('national');

    return (
        <div className="space-y-6">
            <header className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <Globe className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100">Culture & Safety</h1>
                </div>
                <p className="text-slate-400">
                    How national and organizational culture impacts crew interaction, authority gradients, and reporting.
                </p>
            </header>

            <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg">
                <button onClick={() => setTab('national')} className={`flex-1 py-2 rounded transition-colors ${tab === 'national' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>National Culture</button>
                <button onClick={() => setTab('safety')} className={`flex-1 py-2 rounded transition-colors ${tab === 'safety' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>Safety Culture</button>
                <button onClick={() => setTab('just')} className={`flex-1 py-2 rounded transition-colors ${tab === 'just' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>Just Culture</button>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 min-h-[400px]">
                {tab === 'national' && <HofstedeDimensions />}
                {tab === 'safety' && <SafetyCulture />}
                {tab === 'just' && <JustCultureGame />}
            </div>
        </div>
    );
};

const HofstedeDimensions = () => (
    <div className="space-y-8">
        <h3 className="text-xl font-bold text-white">Hofstede's Cultural Dimensions</h3>
        <p className="text-slate-300">
            Geert Hofstede identified dimensions distinguishing cultures. Two are critical in aviation CRM.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-6 rounded-xl border-t-4 border-blue-500">
                <h4 className="font-bold text-white text-lg mb-2">Power Distance (PDI)</h4>
                <p className="text-sm text-slate-400 mb-4">
                    The extent to which less powerful members accept unequal distribution of power.
                </p>

                <div className="space-y-4">
                    <div className="bg-blue-900/20 p-3 rounded">
                        <span className="font-bold text-blue-300 text-sm">High PDI</span>
                        <p className="text-xs text-slate-300">
                            Juniors unlikely to question Captain. High respect for authority. <br />
                            <em>Risk: </em> Steep Trans-Cockpit Authority Gradient.
                        </p>
                    </div>
                    <div className="bg-blue-900/20 p-3 rounded">
                        <span className="font-bold text-blue-300 text-sm">Low PDI</span>
                        <p className="text-xs text-slate-300">
                            Subordinates expect to be consulted. Authority based on competence not rank.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border-t-4 border-green-500">
                <h4 className="font-bold text-white text-lg mb-2">Individualism (IDV)</h4>
                <p className="text-sm text-slate-400 mb-4">
                    Degree of interdependence a society maintains among its members.
                </p>

                <div className="space-y-4">
                    <div className="bg-green-900/20 p-3 rounded">
                        <span className="font-bold text-green-300 text-sm">High IDV</span>
                        <p className="text-xs text-slate-300">
                            "I" identity. Personal goals prioritized. Direct communication. <br />
                            <em>Risk: </em> Competitive cockpit.
                        </p>
                    </div>
                    <div className="bg-green-900/20 p-3 rounded">
                        <span className="font-bold text-green-300 text-sm">Collectivism (Low IDV)</span>
                        <p className="text-xs text-slate-300">
                            "We" identity. Harmony prioritized. Face-saving communication. <br />
                            <em>Risk: </em> Indirect hints instead of clear warnings.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const SafetyCulture = () => (
    <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">Safety Management System (SMS) Components</h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 hover:border-indigo-500 transition-colors">
                <h4 className="font-bold text-indigo-300 mb-2">Reporting Culture</h4>
                <p className="text-sm text-slate-400">
                    People are prepared to report their errors and experiences.
                </p>
            </div>
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 hover:border-indigo-500 transition-colors">
                <h4 className="font-bold text-indigo-300 mb-2">Just Culture</h4>
                <p className="text-sm text-slate-400">
                    Atmosphere of trust. No punishment for honest mistakes. (Not "No Blame").
                </p>
            </div>
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 hover:border-indigo-500 transition-colors">
                <h4 className="font-bold text-indigo-300 mb-2">Flexible Culture</h4>
                <p className="text-sm text-slate-400">
                    Organization can adapt to changing demands and shift control authority.
                </p>
            </div>
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 hover:border-indigo-500 transition-colors">
                <h4 className="font-bold text-indigo-300 mb-2">Learning Culture</h4>
                <p className="text-sm text-slate-400">
                    Willingness to draw conclusions from safety systems and implement reform.
                </p>
            </div>
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 hover:border-indigo-500 transition-colors">
                <h4 className="font-bold text-indigo-300 mb-2">Informed Culture</h4>
                <p className="text-sm text-slate-400">
                    Those who manage the system have current knowledge of factors affecting safety.
                </p>
            </div>
        </div>
    </div>
);

const JustCultureGame = () => {
    const [result, setResult] = useState<{ type: 'safe' | 'unsafe' | 'neutral', msg: string } | null>(null);

    const check = (type: string) => {
        if (type === 'honest') setResult({ type: 'safe', msg: "Correct. In a Just Culture, honest errors (slips/lapses) are recorded for learning but NOT punished." });
        if (type === 'negligence') setResult({ type: 'unsafe', msg: "Correct. Gross negligence or willful violations ARE punished. It is not a 'Blame Free' culture." });
        if (type === 'violation') setResult({ type: 'unsafe', msg: "Correct. Deliberate procedural violations for convenience are unacceptable." });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Just vs Blame Culture</h3>
            <p className="text-slate-300">
                A Just Culture distinguishes between honest mistakes and willful misconduct.
            </p>

            <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 text-center">
                <h4 className="font-bold text-white mb-6">Scenario: Determine the outcome</h4>

                <div className="flex flex-wrap gap-4 justify-center">
                    <button onClick={() => check('honest')} className="bg-slate-800 hover:bg-slate-700 border border-slate-600 px-6 py-4 rounded-lg hover:scale-105 transition-all">
                        <div className="font-bold text-white mb-1">Honest Slip</div>
                        <div className="text-xs text-slate-400">Forgot switch due to distraction</div>
                    </button>

                    <button onClick={() => check('negligence')} className="bg-slate-800 hover:bg-slate-700 border border-slate-600 px-6 py-4 rounded-lg hover:scale-105 transition-all">
                        <div className="font-bold text-white mb-1">Gross Negligence</div>
                        <div className="text-xs text-slate-400">Taxiing at 50kts drunk</div>
                    </button>

                    <button onClick={() => check('violation')} className="bg-slate-800 hover:bg-slate-700 border border-slate-600 px-6 py-4 rounded-lg hover:scale-105 transition-all">
                        <div className="font-bold text-white mb-1">Corner Cutting</div>
                        <div className="text-xs text-slate-400">Skipping checklist to save time</div>
                    </button>
                </div>

                {result && (
                    <div className={`mt-8 p-4 rounded-lg text-sm font-bold animate-in fade-in slide-in-from-bottom-2 ${result.type === 'safe' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                        {result.msg}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HPLCulture;
