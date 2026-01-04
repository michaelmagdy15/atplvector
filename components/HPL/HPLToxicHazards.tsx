
import React, { useState } from 'react';
import { Skull, AlertTriangle, Wine, Cigarette, Wind } from 'lucide-react';

const HPLToxicHazards: React.FC = () => {
    const [tab, setTab] = useState<'co' | 'alcohol' | 'smoking'>('co');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Skull className="text-amber-500" />
                        Toxic Hazards (040.02)
                    </h2>
                    <p className="text-slate-400 text-sm">Carbon Monoxide, Alcohol, and Smoking risks.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setTab('co')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'co' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}>Carbon Monoxide</button>
                    <button onClick={() => setTab('alcohol')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'alcohol' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}>Alcohol</button>
                    <button onClick={() => setTab('smoking')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'smoking' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}>Smoking</button>
                </div>
            </div>

            {tab === 'co' && <COSim />}
            {tab === 'alcohol' && <AlcoholCalc />}
            {tab === 'smoking' && <SmokingFacts />}
        </div>
    );
};

const COSim = () => {
    return (
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Wind className="text-slate-400" /> Carbon Monoxide (CO)
                </h3>
                <p className="text-sm text-slate-300 mb-6">
                    Colourless, odourless, tasteless gas. Product of incomplete combustion (exhaust, heater leaks).
                </p>

                <div className="space-y-4">
                    <div className="bg-slate-800 p-4 rounded border-l-4 border-red-500">
                        <h4 className="font-bold text-white text-sm mb-2">Haemoglobin Affinity</h4>
                        <p className="text-xs text-slate-300">
                            Haemoglobin prefers CO over O2 by <span className="text-red-400 font-bold text-lg">210-250x</span>.
                            <br />
                            Even small amounts of CO rapidly block O2 transport.
                        </p>
                    </div>

                    <div className="bg-slate-800 p-4 rounded border-l-4 border-amber-500">
                        <h4 className="font-bold text-white text-sm mb-2">Symptoms</h4>
                        <ul className="text-xs text-slate-400 list-disc pl-4 space-y-1">
                            <li>Headache (Tight band)</li>
                            <li>Dizziness / Nausea</li>
                            <li>Impaired Judgement</li>
                            <li>Cherry Red lips/fingernails (late stage)</li>
                            <li>Death</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4">Corrective Action</h3>
                    <div className="flex flex-col gap-3">
                        <div className="bg-slate-800 p-3 rounded flex items-center gap-3">
                            <span className="bg-amber-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0">1</span>
                            <span className="text-sm text-slate-200">Turn OFF Heater / Defroster</span>
                        </div>
                        <div className="bg-slate-800 p-3 rounded flex items-center gap-3">
                            <span className="bg-amber-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0">2</span>
                            <span className="text-sm text-slate-200">Open Windows / Fresh Air Vents</span>
                        </div>
                        <div className="bg-slate-800 p-3 rounded flex items-center gap-3">
                            <span className="bg-amber-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0">3</span>
                            <span className="text-sm text-slate-200">Use 100% Oxygen (if available)</span>
                        </div>
                        <div className="bg-slate-800 p-3 rounded flex items-center gap-3">
                            <span className="bg-amber-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0">4</span>
                            <span className="text-sm text-slate-200">Land ASAP</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-amber-900/20 border border-amber-500/50 rounded-lg">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="text-amber-500 shrink-0" />
                        <p className="text-xs text-amber-200">
                            <strong>Warning:</strong> CO detectors are cheap and essential. A "Stick-on" spot darkens presence of CO. Electronic detectors are better.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AlcoholCalc = () => {
    return (
        <div className="animate-in fade-in">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Wine className="text-purple-400" /> Alcohol Metabolism
                    </h3>
                    <p className="text-sm text-slate-300 mb-4">
                        Alcohol is a nervous system depressant. It impairs judgement, vision, and balance (Vestibular).
                    </p>

                    <div className="bg-slate-800 p-4 rounded-lg mb-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Elimination Rate</h4>
                        <p className="text-white font-bold text-lg">1 Unit per Hour</p>
                        <p className="text-xs text-slate-400 mt-1">
                            The liver breaks it down at a constant rate. Coffee, cold showers, or exercise <strong>DO NOT</strong> speed this up.
                        </p>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-lg">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Histotoxic Hypoxia</h4>
                        <p className="text-xs text-slate-300">
                            Alcohol poisons the cells, preventing them from using Oxygen. This mimics altitude hypoxia even at sea level.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4">Legal Limits (EASA)</h3>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-800 rounded border-l-4 border-red-500">
                            <span className="text-sm text-slate-300">Blood Alcohol Limit</span>
                            <span className="font-mono font-bold text-white">0.2 g/l (0.02%)</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800 rounded border-l-4 border-red-500">
                            <span className="text-sm text-slate-300">Breath Alcohol Limit</span>
                            <span className="font-mono font-bold text-white">90 micrograms/l</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800 rounded border-l-4 border-red-500">
                            <span className="text-sm text-slate-300">Bottle-to-Throttle</span>
                            <span className="font-mono font-bold text-white">8 Hours (Min)</span>
                        </div>
                    </div>

                    <p className="text-xs text-slate-500 mt-6 italic">
                        *Many airlines have stricter "Zero Tolerance" or 12/24 hour rules.
                    </p>
                </div>
            </div>
        </div>
    );
};

const SmokingFacts = () => (
    <div className="animate-in fade-in grid md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Cigarette className="text-slate-400" /> Smoking & Flying
            </h3>
            <ul className="space-y-4">
                <li className="bg-slate-800 p-4 rounded border-l-4 border-slate-500">
                    <h4 className="font-bold text-white text-sm">Carbon Monoxide Load</h4>
                    <p className="text-xs text-slate-300 mt-1">
                        Smokers carry 4-8% COHb (Carboxyhaemoglobin) in their blood constantly.
                    </p>
                </li>
                <li className="bg-slate-800 p-4 rounded border-l-4 border-slate-500">
                    <h4 className="font-bold text-white text-sm">Physiological Altitude</h4>
                    <p className="text-xs text-slate-300 mt-1">
                        A smoker at sea level is effectively at <strong>5,000 - 6,000ft</strong> physiologically.
                        Hypoxia sets in much earlier.
                    </p>
                </li>
                <li className="bg-slate-800 p-4 rounded border-l-4 border-slate-500">
                    <h4 className="font-bold text-white text-sm">Night Vision</h4>
                    <p className="text-xs text-slate-300 mt-1">
                        Nicotine reduces sensitivity of the eyes. Night vision is degraded by approx 20%.
                    </p>
                </li>
            </ul>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-4">Medication & Drugs</h3>
            <p className="text-sm text-slate-300 mb-6">
                Consult an AME (Aeromedical Examiner) before flying with any new medication.
            </p>

            <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                    <span>Antihistamines</span>
                    <span className="text-red-400 text-right">Drowsiness, dry mouth.</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                    <span>Analgesics (Pain)</span>
                    <span className="text-red-400 text-right">Masks pain (warning), sedation.</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                    <span>Antibiotics</span>
                    <span className="text-red-400 text-right">Side effects, allergic reaction.</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                    <span>Caffeine (Excess)</span>
                    <span className="text-red-400 text-right">Anxiety, palpitations, dehydration.</span>
                </div>
            </div>
        </div>
    </div>
);

export default HPLToxicHazards;
