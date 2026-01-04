
import React, { useState } from 'react';
import { Globe, Users, ShieldCheck, AlertTriangle } from 'lucide-react';

const HPLCulture: React.FC = () => {
    const [tab, setTab] = useState<'hofstede' | 'safety' | 'org'>('hofstede');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Globe className="text-indigo-400" />
                        Culture & Safety (040.03)
                    </h2>
                    <p className="text-slate-400 text-sm">National Culture, Safety Culture, and SMS.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setTab('hofstede')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'hofstede' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Hofstede</button>
                    <button onClick={() => setTab('safety')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'safety' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Safety Culture</button>
                    <button onClick={() => setTab('org')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'org' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>SMS</button>
                </div>
            </div>

            {tab === 'hofstede' && <HofstedeDimensions />}
            {tab === 'safety' && <SafetyCulture />}
            {tab === 'org' && <SMSOverview />}
        </div>
    );
};

const HofstedeDimensions = () => (
    <div className="animate-in fade-in">
        <h3 className="text-xl font-bold text-white mb-6">Hofstede's Cultural Dimensions</h3>
        <p className="text-sm text-slate-400 mb-6">How national culture affects the cockpit.</p>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Users className="text-blue-400" /> Power Distance (PDI)
                </h4>
                <p className="text-sm text-slate-300 mb-4">
                    The extent to which less powerful members accept that power is distributed unequally.
                </p>

                <div className="space-y-4">
                    <div className="bg-slate-800 p-3 rounded border-l-4 border-red-500">
                        <span className="text-xs font-bold text-red-500 uppercase block mb-1">High PDI (e.g. Latin/Asian)</span>
                        <p className="text-xs text-slate-300">
                            Subordinates expect to be told what to do. FO will <strong>NOT</strong> speak up against Captain. <br />
                            <em>Risk: steep authority gradient accidents.</em>
                        </p>
                    </div>
                    <div className="bg-slate-800 p-3 rounded border-l-4 border-green-500">
                        <span className="text-xs font-bold text-green-500 uppercase block mb-1">Low PDI (e.g. Scandinavian)</span>
                        <p className="text-xs text-slate-300">
                            Subordinates expect consultation. "First among equals".
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Users className="text-yellow-400" /> Individualism (IDV)
                </h4>
                <p className="text-sm text-slate-300 mb-4">
                    "I" vs "We".
                </p>

                <div className="space-y-4">
                    <div className="bg-slate-800 p-3 rounded border-l-4 border-yellow-500">
                        <span className="text-xs font-bold text-yellow-500 uppercase block mb-1">High IDV (e.g. USA/UK)</span>
                        <p className="text-xs text-slate-300">
                            Look after self. Communication is direct and low-context. "Say what you mean."
                        </p>
                    </div>
                    <div className="bg-slate-800 p-3 rounded border-l-4 border-blue-500">
                        <span className="text-xs font-bold text-blue-500 uppercase block mb-1">Low IDV (Collectivist)</span>
                        <p className="text-xs text-slate-300">
                            Group harmony is key. Saving face. Indirect communication.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const SafetyCulture = () => (
    <div className="animate-in slide-in-from-right-4">
        <h3 className="text-xl font-bold text-white mb-6">Components of Safety Culture</h3>

        <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 hover:border-emerald-500 transition-colors">
                <ShieldCheck className="text-emerald-500 mb-3" size={24} />
                <h4 className="font-bold text-white text-sm mb-2">Just Culture</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                    Honest mistakes are not punished.
                    <br /><br />
                    Gross negligence / wilful violations <strong>ARE</strong> punished.
                </p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors">
                <AlertTriangle className="text-blue-500 mb-3" size={24} />
                <h4 className="font-bold text-white text-sm mb-2">Reporting Culture</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                    People are willing to report their own errors without fear.
                    <br /><br />
                    "You can't manage what you don't measure."
                </p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 hover:border-purple-500 transition-colors">
                <Users className="text-purple-500 mb-3" size={24} />
                <h4 className="font-bold text-white text-sm mb-2">Learning Culture</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                    The organisation has the will and competence to draw the right conclusions from safety info and <strong>change</strong>.
                </p>
            </div>
        </div>
    </div>
);

const SMSOverview = () => (
    <div className="animate-in fade-in">
        <h3 className="text-xl font-bold text-white mb-6">Safety Management System (SMS)</h3>

        <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 flex flex-col items-center">
            <div className="flex gap-4 items-center mb-6">
                <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center font-black text-2xl text-white">P</div>
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center font-black text-2xl text-white">D</div>
                <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center font-black text-2xl text-white">C</div>
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center font-black text-2xl text-white">A</div>
            </div>

            <p className="text-lg font-bold text-white mb-2">PDCA Cycle (Deming / Shewhart)</p>
            <p className="text-sm text-slate-400 text-center max-w-lg mb-8">
                The core of SMS is continuous improvement.
            </p>

            <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
                <div className="bg-slate-800 p-4 rounded border-l-4 border-emerald-500">
                    <strong className="text-emerald-500">Plan:</strong> Define safety policy, objectives, and responsibilities.
                </div>
                <div className="bg-slate-800 p-4 rounded border-l-4 border-blue-500">
                    <strong className="text-blue-500">Do:</strong> Implement processes (Reporting, Risk Assessment).
                </div>
                <div className="bg-slate-800 p-4 rounded border-l-4 border-yellow-500">
                    <strong className="text-yellow-500">Check:</strong> Monitor performance (SPIs), Audits.
                </div>
                <div className="bg-slate-800 p-4 rounded border-l-4 border-red-500">
                    <strong className="text-red-500">Act:</strong> Corrective actions to fix findings.
                </div>
            </div>
        </div>
    </div>
);

export default HPLCulture;
