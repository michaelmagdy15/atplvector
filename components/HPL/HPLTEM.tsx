import React, { useState } from 'react';
import { AlertTriangle, Activity, Shield, ArrowRight, CheckCircle, Users } from 'lucide-react';
import HPLShell from './HPLShell';

const HPLTEM: React.FC = () => {
    const [tab, setTab] = useState<'concepts' | 'threats' | 'errors' | 'uas' | 'shell'>('concepts');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Shield className="text-orange-400" />
                        TEM & SHELL Models
                    </h2>
                    <p className="text-slate-400 text-sm">Proactive safety philosophy & Human Factors Framework.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg flex-wrap">
                    <button onClick={() => setTab('concepts')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'concepts' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}>TEM Model</button>
                    <button onClick={() => setTab('threats')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'threats' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}>Threats</button>
                    <button onClick={() => setTab('errors')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'errors' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}>Errors</button>
                    <button onClick={() => setTab('uas')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'uas' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}>UAS</button>
                    <div className="w-px bg-slate-700 mx-2"></div>
                    <button onClick={() => setTab('shell')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'shell' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}>SHELL Model</button>
                </div>
            </div>

            {tab === 'concepts' && <TEMConcepts />}
            {tab === 'threats' && <ThreatsModule />}
            {tab === 'errors' && <ErrorsModule />}
            {tab === 'uas' && <UASModule />}
            {tab === 'shell' && <HPLShell />}
        </div>
    );
};

export default HPLTEM;

const TEMConcepts = () => (
    <div className="animate-in fade-in space-y-8">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 text-center">
            <h3 className="text-xl font-bold text-white mb-4">The 3 Components</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <div className="bg-slate-800 p-6 rounded-xl border-l-4 border-red-500 w-full md:w-1/3">
                    <AlertTriangle className="w-8 h-8 text-red-500 mb-2 mx-auto" />
                    <h4 className="text-lg font-bold text-white mb-1">1. Threats</h4>
                    <p className="text-xs text-slate-400">Events/Errors beyond flight crew influence. Must be managed to maintain safety margins.</p>
                </div>
                <ArrowRight className="text-slate-600 hidden md:block" />
                <div className="bg-slate-800 p-6 rounded-xl border-l-4 border-yellow-500 w-full md:w-1/3">
                    <Activity className="w-8 h-8 text-yellow-500 mb-2 mx-auto" />
                    <h4 className="text-lg font-bold text-white mb-1">2. Errors</h4>
                    <p className="text-xs text-slate-400">Actions/Inactions by crew that lead to deviation from intentions or expectations.</p>
                </div>
                <ArrowRight className="text-slate-600 hidden md:block" />
                <div className="bg-slate-800 p-6 rounded-xl border-l-4 border-purple-500 w-full md:w-1/3">
                    <Shield className="w-8 h-8 text-purple-500 mb-2 mx-auto" />
                    <h4 className="text-lg font-bold text-white mb-1">3. U.A.S.</h4>
                    <p className="text-xs text-slate-400">Undesired Aircraft State. Aircraft is in a position/condition that reduces safety.</p>
                </div>
            </div>

            <div className="mt-8 bg-slate-800 p-4 rounded border border-slate-600">
                <h4 className="font-bold text-white mb-2">Countermeasures</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                    <div className="bg-slate-700 p-2 rounded text-slate-300"><strong className="text-white block">SOPs</strong>Adherence to Procedure</div>
                    <div className="bg-slate-700 p-2 rounded text-slate-300"><strong className="text-white block">Checklists</strong>Memory trap</div>
                    <div className="bg-slate-700 p-2 rounded text-slate-300"><strong className="text-white block">Briefings</strong>Pre-planning</div>
                    <div className="bg-slate-700 p-2 rounded text-slate-300"><strong className="text-white block">Callouts</strong>Communication</div>
                </div>
            </div>
        </div>
    </div>
);

const ThreatsModule = () => {
    const [dragged, setDragged] = useState<string | null>(null);
    const [score, setScore] = useState({ env: 0, org: 0 });

    const items = [
        { id: 'wx', label: 'Thunderstorms', type: 'env' },
        { id: 'atc', label: 'Confusing ATC', type: 'env' },
        { id: 'roster', label: 'Fatiguing Roster', type: 'org' },
        { id: 'doc', label: 'Outdated Manual', type: 'org' },
        { id: 'terrain', label: 'High Terrain', type: 'env' },
        { id: 'culture', label: 'Commercial Pressure', type: 'org' },
    ];

    return (
        <div className="animate-in fade-in grid md:grid-flow-col gap-6">
            <div className="space-y-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-2 text-sm uppercase">Classification</h3>
                    <div className="space-y-3">
                        <div className="p-3 bg-slate-800 rounded border-l-2 border-sky-400">
                            <h4 className="text-sky-400 font-bold text-sm">Environmental Threats</h4>
                            <p className="text-xs text-slate-400">Outside control of the operator. (Wx, ATC, Airport, Terrain).</p>
                        </div>
                        <div className="p-3 bg-slate-800 rounded border-l-2 border-indigo-400">
                            <h4 className="text-indigo-400 font-bold text-sm">Organizational Threats</h4>
                            <p className="text-xs text-slate-400">Linked to the operator. (Maintenance, Rostering, Dispatch, Ground Handling).</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-2 text-sm uppercase">Latent Threats</h3>
                    <p className="text-xs text-slate-300 mb-2">Threats not directly obvious. "Resident Pathogens".</p>
                    <ul className="text-xs list-disc pl-4 text-slate-400 space-y-1">
                        <li>Poor Cockpit Design (Switch confusion).</li>
                        <li>Normalization of Deviance (Culture).</li>
                        <li>Inadequate Training.</li>
                    </ul>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col justify-center">
                <h4 className="text-center font-bold text-white mb-6">Threat Quiz: Which type is it?</h4>
                <div className="flex gap-4 justify-center flex-wrap">
                    {items.map(item => (
                        <div key={item.id} className="bg-slate-700 px-4 py-2 rounded text-sm font-bold text-slate-200 cursor-help hover:bg-slate-600 transition">
                            {item.label}
                            <span className="ml-2 text-[10px] uppercase opacity-50">
                                {item.type === 'env' ? '(Env)' : '(Org)'}
                            </span>
                        </div>
                    ))}
                </div>
                <p className="text-center text-xs text-slate-500 mt-6 italic">
                    (Normally interactive drag & drop - Static for demo)
                </p>
            </div>
        </div>
    );
};

const ErrorsModule = () => (
    <div className="animate-in fade-in">
        <h3 className="font-bold text-white mb-4">Classifying Errors</h3>
        <p className="text-sm text-slate-400 mb-6 bg-slate-900 p-4 rounded border border-slate-700">
            <strong>Definition:</strong> "Action or inaction by the flight crew that leads to deviations from organizational or flight intentions or expectations." (ICAO Doc 9683)
        </p>

        <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-5 rounded-xl border border-slate-700">
                <div className="text-emerald-400 mb-3"><CheckCircle /></div>
                <h4 className="font-bold text-white mb-2">Aircraft Handling</h4>
                <p className="text-xs text-slate-400 mb-4">Errors in physical manipulation of the aircraft or systems.</p>
                <ul className="text-xs text-slate-300 list-disc pl-4 space-y-2">
                    <li>Manual flight deviations (Alt/Hdg).</li>
                    <li>Incorrect automation mode (VS vs VNAV).</li>
                    <li>Wrong flap setting.</li>
                </ul>
            </div>

            <div className="bg-slate-900 p-5 rounded-xl border border-slate-700">
                <div className="text-amber-400 mb-3"><Activity /></div>
                <h4 className="font-bold text-white mb-2">Procedural</h4>
                <p className="text-xs text-slate-400 mb-4">Errors in following regulations or SOPs.</p>
                <ul className="text-xs text-slate-300 list-disc pl-4 space-y-2">
                    <li>Missed checklist item.</li>
                    <li>Wrong briefing.</li>
                    <li>Documentation error.</li>
                </ul>
            </div>

            <div className="bg-slate-900 p-5 rounded-xl border border-slate-700">
                <div className="text-sky-400 mb-3"><Users /></div>
                <h4 className="font-bold text-white mb-2">Communication</h4>
                <p className="text-xs text-slate-400 mb-4">Errors in information transfer.</p>
                <ul className="text-xs text-slate-300 list-disc pl-4 space-y-2">
                    <li>Missed callout.</li>
                    <li>Misinterpretation of ATC.</li>
                    <li>Crew miscommunication.</li>
                </ul>
            </div>
        </div>
    </div>
);

const UASModule = () => (
    <div className="animate-in fade-in grid md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-4">Undesired Aircraft State (UAS)</h3>
            <p className="text-sm text-slate-300 mb-6">
                The last stage before an incident/accident. The aircraft is positionally unsafe or unstable.
            </p>

            <div className="space-y-4">
                <div className="flex items-start gap-3 bg-slate-800 p-3 rounded">
                    <div className="bg-red-900/50 p-2 rounded text-red-500 font-bold shrink-0">Ex 1</div>
                    <div>
                        <h4 className="text-sm font-bold text-white">Unstable Approach</h4>
                        <p className="text-xs text-slate-400">High, Fast, Unconfigured at 1000ft.</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 bg-slate-800 p-3 rounded">
                    <div className="bg-red-900/50 p-2 rounded text-red-500 font-bold shrink-0">Ex 2</div>
                    <div>
                        <h4 className="text-sm font-bold text-white">Rule Violation</h4>
                        <p className="text-xs text-slate-400">Entering airspace without clearance.</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 bg-slate-800 p-3 rounded">
                    <div className="bg-red-900/50 p-2 rounded text-red-500 font-bold shrink-0">Ex 3</div>
                    <div>
                        <h4 className="text-sm font-bold text-white">Attitude</h4>
                        <p className="text-xs text-slate-400">Excessive bank angle or pitch.</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col justify-center">
            <div className="text-center space-y-4">
                <h4 className="text-lg font-bold text-white">The Choice</h4>
                <div className="flex flex-col gap-2">
                    <div className="p-4 bg-emerald-900/20 border border-emerald-500 rounded text-emerald-400 font-bold text-sm">
                        Recover
                        <span className="block text-xs font-normal text-emerald-200 mt-1">Succeed &rarr; Safe Flight</span>
                    </div>
                    <div className="p-4 bg-red-900/20 border border-red-500 rounded text-red-400 font-bold text-sm">
                        Fail to Manage
                        <span className="block text-xs font-normal text-red-200 mt-1">Failure &rarr; Accident / Incident</span>
                    </div>
                </div>
                <p className="text-xs text-slate-500 italic mt-4">
                    "A UAS is a transient state. It must be managed immediately."
                </p>
            </div>
        </div>
    </div>
);
