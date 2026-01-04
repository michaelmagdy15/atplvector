
import React, { useState } from 'react';
import { AlertTriangle, Clock, Map, Plane, ShieldAlert, AlertOctagon } from 'lucide-react';

const HPLIncidents: React.FC = () => {
    const [tab, setTab] = useState<'swiss' | 'tenerife' | 'chain'>('swiss');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <AlertTriangle className="text-red-500" />
                        Incidents & Case Studies (040.03)
                    </h2>
                    <p className="text-slate-400 text-sm">Reason's Model, Error Chains, and Case Analysis.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setTab('swiss')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'swiss' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}>Swiss Cheese</button>
                    <button onClick={() => setTab('chain')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'chain' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}>Error Chain</button>
                    <button onClick={() => setTab('tenerife')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'tenerife' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}>Case: Tenerife</button>
                </div>
            </div>

            {tab === 'swiss' && <SwissCheeseModel />}
            {tab === 'chain' && <ErrorChain />}
            {tab === 'tenerife' && <TenerifeCase />}
        </div>
    );
};

const SwissCheeseModel = () => {
    const [aligned, setAligned] = useState(false);

    return (
        <div className="animate-in fade-in">
            <h3 className="text-xl font-bold text-white mb-6">Reason's Swiss Cheese Model</h3>

            <div className="relative h-64 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex items-center justify-center gap-8 mb-6">
                {/* Trajectory */}
                <div className={`absolute left-0 h-2 bg-red-500 z-50 transition-all duration-1000 ${aligned ? 'w-full' : 'w-[15%]'}`}></div>
                {aligned && <div className="absolute right-4 text-red-500 font-black animate-ping">ACCIDENT</div>}

                {/* Layers */}
                {[
                    { name: 'Organisation', hole: aligned ? 50 : 20 },
                    { name: 'Supervision', hole: aligned ? 50 : 70 },
                    { name: 'Preconditions', hole: aligned ? 50 : 40 },
                    { name: 'Specific Acts', hole: aligned ? 50 : 80 },
                ].map((layer, i) => (
                    <div key={i} className="relative w-32 h-48 bg-yellow-500/80 rounded border-2 border-yellow-400 shadow-xl flex flex-col items-center justify-start py-2 z-10">
                        <span className="text-[10px] font-bold text-yellow-900 uppercase mb-2">{layer.name}</span>
                        {/* The Hole */}
                        <div
                            className="w-12 h-12 bg-slate-900 rounded-full transition-all duration-1000 absolute"
                            style={{ top: `${layer.hole}%` }}
                        ></div>
                        {/* Decoy holes */}
                        <div className="w-4 h-4 bg-slate-900/50 rounded-full absolute bottom-4 left-4"></div>
                        <div className="w-6 h-6 bg-slate-900/50 rounded-full absolute top-12 right-2"></div>
                    </div>
                ))}
            </div>

            <div className="text-center">
                <button
                    onClick={() => setAligned(!aligned)}
                    className={`px-8 py-3 rounded-full font-bold text-white transition-all shadow-lg ${aligned ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-600 hover:bg-red-500 animate-bounce'}`}
                >
                    {aligned ? 'Reset Layers' : 'Align Holes (Trigger Accident)'}
                </button>
                <p className="text-sm text-slate-400 mt-4 max-w-2xl mx-auto">
                    Accidents occur when latent conditions (holes) in each defence layer align momentarily, allowing a threat to pass through to a catastrophe.
                </p>
            </div>
        </div>
    );
};

const ErrorChain = () => {
    return (
        <div className="animate-in slide-in-from-right-4">
            <h3 className="text-xl font-bold text-white mb-6">The Accident Chain</h3>
            <p className="text-sm text-slate-400 mb-8">
                Most accidents are not caused by a single event, but a sequence of events. Breaking <strong>ANY</strong> link prevents the accident.
            </p>

            <div className="space-y-4 relative">
                <div className="absolute left-6 top-4 bottom-4 w-1 bg-slate-700 -z-10"></div>

                {[
                    { title: 'Organisational Factor', desc: 'Airline cuts training budget to save money.', type: 'Latent' },
                    { title: 'Training Deficit', desc: 'Pilots not checked on low-vis procedures recently.', type: 'Latent' },
                    { title: 'Environmental Condition', desc: 'Heavy Fog (RVR 300m) at destination.', type: 'Threat' },
                    { title: 'Pilot Error (Active)', desc: 'Captain decides to land despite RVR below minima.', type: 'Error' },
                    { title: 'Defence Failure', desc: 'First Officer fails to speak up (Steep Authority Gradient).', type: 'UAS' },
                    { title: 'ACCIDENT', desc: 'Runway Excursion.', type: 'Outcome', color: 'bg-red-600 text-white border-red-500' }
                ].map((step, i) => (
                    <div key={i} className={`ml-0 md:ml-4 relative ${step.color || 'bg-slate-900 border-slate-700'} p-4 rounded-xl border flex gap-4 items-center`}>
                        <div className="w-12 h-12 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center font-bold text-slate-400 shrink-0 z-10">
                            {i + 1}
                        </div>
                        <div>
                            <h4 className="font-bold text-sm mb-1 flex items-center gap-2">
                                {step.title}
                                {step.type !== 'Outcome' && <span className="text-[10px] uppercase border px-1 rounded opacity-50">{step.type}</span>}
                            </h4>
                            <p className={`text-xs ${step.color ? 'text-white' : 'text-slate-400'}`}>{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TenerifeCase = () => (
    <div className="animate-in fade-in">
        <div className="flex items-center gap-4 mb-6">
            <div className="bg-red-600 p-3 rounded-lg text-white">
                <Plane size={32} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-white">Tenerife 1977</h3>
                <p className="text-sm text-slate-400">KLM 4805 vs Pan Am 1736</p>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <h4 className="font-bold text-orange-400 border-b border-orange-500/30 pb-2">Human Factors / Causes</h4>

                <div className="bg-slate-900 p-4 rounded border-l-4 border-orange-500">
                    <h5 className="text-white font-bold text-sm">1. Expectation Bias</h5>
                    <p className="text-xs text-slate-400 mt-1">KLM Captain "heard" a takeoff clearance because he was expecting one. (Interpretation of "OK" from ATC).</p>
                </div>

                <div className="bg-slate-900 p-4 rounded border-l-4 border-orange-500">
                    <h5 className="text-white font-bold text-sm">2. Stress / Hurry</h5>
                    <p className="text-xs text-slate-400 mt-1">Concern about duty time limits (impatience). Desire to leave before weather worsened.</p>
                </div>

                <div className="bg-slate-900 p-4 rounded border-l-4 border-orange-500">
                    <h5 className="text-white font-bold text-sm">3. Authority Gradient</h5>
                    <p className="text-xs text-slate-400 mt-1">KLM Flight Engineer questioned the takeoff ("Is he not clear, that Pan Am?"). Captain dismissed it. FO was hesitant to challenge senior Captain.</p>
                </div>

                <div className="bg-slate-900 p-4 rounded border-l-4 border-orange-500">
                    <h5 className="text-white font-bold text-sm">4. Communication</h5>
                    <p className="text-xs text-slate-400 mt-1">Non-standard phraseology. "We are now at takeoff" (Ambiguous). Simultaneous transmissions (Heterodyne/Squeal) blocked critical instructions.</p>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white mb-4">The Lesson (CRM)</h4>
                <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                    This accident birthed **Crew Resource Management (CRM)**.
                    It highlighted that technical skill (the KLM Captain was the chief instructor) does not prevent accidents if communication and teamwork fail.
                </p>
                <div className="p-4 bg-emerald-900/20 border border-emerald-500/50 rounded-lg">
                    <div className="flex gap-2 items-center mb-2">
                        <ShieldAlert className="text-emerald-500" />
                        <span className="font-bold text-emerald-400 text-sm">Defences Added Since</span>
                    </div>
                    <ul className="text-xs text-slate-300 list-disc pl-4 space-y-1">
                        <li>Standardised ICAO Phraseology (English).</li>
                        <li>Readback / Hearback requirements.</li>
                        <li>Assertiveness training for Junior pilots.</li>
                        <li>"Sterile Cockpit" below 10,000ft.</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

export default HPLIncidents;
