import React, { useState } from 'react';
import { Wine, AlertTriangle, Pill, Cigarette, Clock, Skull } from 'lucide-react';

const HPLToxicology: React.FC = () => {
    const [tab, setTab] = useState<'alcohol' | 'drugs' | 'smoking'>('alcohol');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Skull className="text-purple-400" />
                        Toxicology (040.02.05)
                    </h2>
                    <p className="text-slate-400 text-sm">Effects of Alcohol, Drugs, and Toxic Hazards.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setTab('alcohol')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'alcohol' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>Alcohol Calc</button>
                    <button onClick={() => setTab('drugs')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'drugs' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>Medications</button>
                    <button onClick={() => setTab('smoking')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'smoking' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>Smoking & CO</button>
                </div>
            </div>

            {tab === 'alcohol' && <AlcoholCalc />}
            {tab === 'drugs' && <DrugInteractions />}
            {tab === 'smoking' && <SmokingCO />}
        </div>
    );
};

// Alcohol Calculator (Widmark Approximation)
const AlcoholCalc = () => {
    const [units, setUnits] = useState(2);
    const [hours, setHours] = useState(0);

    // Metabolic rate: ~1 unit per hour (highly variable, but rule of thumb)
    const eliminationRate = 1;
    const remaining = Math.max(0, units - (hours * eliminationRate));
    const timeToZero = Math.ceil(remaining / eliminationRate);

    // EASA Limit: 0.2 promille ~ roughly 0 units active in blood for safety
    // Effects map
    const getEffects = (u: number) => {
        if (u <= 0) return { label: 'Sober', color: 'text-emerald-400', desc: 'Safe to fly (subject to hangover).' };
        if (u < 2) return { label: 'Impaired', color: 'text-yellow-400', desc: 'Warmth, relaxation. Judgment slightly impaired.' };
        if (u < 5) return { label: 'Intoxicated', color: 'text-orange-400', desc: 'Risk taking, slurred speech, balance issues.' };
        return { label: 'Incapacitated', color: 'text-red-400', desc: 'Confusion, nausea, coma potential.' };
    };

    const status = getEffects(remaining);

    return (
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                    <Wine className="text-purple-400" /> Alcohol Elimination
                </h3>

                <div className="space-y-6">
                    <div>
                        <label className="flex justify-between text-slate-400 text-sm mb-2">
                            <span>Units Consumed</span>
                            <span className="text-white font-bold">{units} Units</span>
                        </label>
                        <input
                            type="range" min="1" max="10" step="1"
                            value={units} onChange={e => setUnits(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg accent-purple-500"
                        />
                        <div className="text-[10px] text-slate-500 mt-1">1 Unit = Half Pinte Beer / Small Glass of Wine</div>
                    </div>

                    <div>
                        <label className="flex justify-between text-slate-400 text-sm mb-2">
                            <span>Hours Passed</span>
                            <span className="text-white font-bold">{hours} Hours</span>
                        </label>
                        <input
                            type="range" min="0" max="24" step="1"
                            value={hours} onChange={e => setHours(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg accent-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col items-center justify-center flex-1">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-2">Active Units in Body</p>
                    <p className={`text-4xl font-black ${status.color}`}>{remaining.toFixed(1)}</p>
                    <p className={`text-lg font-bold mt-2 ${status.color}`}>{status.label}</p>
                    <p className="text-xs text-slate-300 text-center mt-2">{status.desc}</p>
                </div>

                {remaining > 0 ? (
                    <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-xl flex items-center gap-4">
                        <Clock className="text-red-400 shrink-0" />
                        <div>
                            <h4 className="font-bold text-red-400 text-sm">NOT SAFE TO FLY</h4>
                            <p className="text-xs text-slate-300">
                                Est. time to zero alcohol: <strong>{timeToZero} hours</strong>.
                                <br />Plus add recovery time for hangover/fatigue.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-emerald-900/20 border border-emerald-500/50 p-4 rounded-xl flex items-center gap-4">
                        <Clock className="text-emerald-400 shrink-0" />
                        <div>
                            <h4 className="font-bold text-emerald-400 text-sm">Legal Limit Reached?</h4>
                            <p className="text-xs text-slate-300">
                                Alcohol eliminated. Ensure no hangover symptoms remain.
                                <br /><strong>Rule:</strong> 8 Hours Bottle to Throttle (Min). Ideally 24h.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Drug Interactions
const DrugInteractions = () => {
    return (
        <div className="animate-in slide-in-from-right-4">
            <h3 className="font-bold text-white mb-6">Medication & Flying</h3>
            <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/50 mb-6 flex gap-3">
                <AlertTriangle className="text-yellow-500 shrink-0" />
                <p className="text-sm text-slate-300">
                    <strong>Golden Rule:</strong> If you are taking medication, you are likely not fit to fly due to the condition itself, regardless of side effects. Consult AME.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {[
                    { name: 'Analgesics / Painkillers', type: 'Aspirin, Ibuprofen', effect: 'Gastric irritation, masking of pain (warning system).', risk: 'Low' },
                    { name: 'Antihistamines', type: 'Hayfever Meds', effect: 'Drowsiness, impaired performance, dizziness. Older types are Sedative.', risk: 'High' },
                    { name: 'Antibiotics', type: 'Penicillin', effect: 'Nausea, allergic reactions, intestinal issues. Short term incapacity.', risk: 'Med' },
                    { name: 'Decongestants', type: 'Nasal Sprays', effect: 'Increased heart rate, anxiety, potential for "Reverse Block" on descent.', risk: 'Med' },
                    { name: 'Stimulants', type: 'Caffeine, Amphetamines', effect: 'Anxiety, tremor, false confidence, crash after effects wear off.', risk: 'High' },
                    { name: 'Hypnotics', type: 'Sleeping Pills', effect: 'Residual drowsiness, impaired reaction time next day.', risk: 'High' }
                ].map((drug, i) => (
                    <div key={i} className="bg-slate-900 p-4 rounded-xl border border-slate-700 hover:border-purple-500 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-white text-sm">{drug.name}</h4>
                                <p className="text-[10px] text-slate-400">{drug.type}</p>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded ${drug.risk === 'High' ? 'bg-red-500/20 text-red-400' : drug.risk === 'Med' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
                                {drug.risk} RISK
                            </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-2 border-t border-slate-800 pt-2">
                            <span className="text-purple-400 font-bold">Side Effects:</span> {drug.effect}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Smoking & Carbon Monoxide
const SmokingCO = () => {
    return (
        <div className="animate-in slide-in-from-right-4 grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Cigarette className="text-slate-400" /> Smoking Effects
                </h3>

                <div className="space-y-4">
                    <div className="bg-slate-800 p-4 rounded-lg">
                        <h4 className="text-sm font-bold text-white">Carbon Monoxide (CO) Affinity</h4>
                        <p className="text-xs text-slate-400 mt-2">
                            CO binds to Haemoglobin <strong>210-250 times</strong> more readily than Oxygen.
                            It forms Carboxyhaemoglobin (COHb), reducing blood's O2 carrying capacity.
                        </p>
                        <div className="mt-3 w-full bg-slate-700 h-4 rounded-full overflow-hidden flex">
                            <div className="bg-red-500 w-[10%] h-full"></div>
                            <div className="bg-blue-500 w-[90%] h-full"></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                            <span className="text-red-400 font-bold">CO (Blocker)</span>
                            <span className="text-blue-400">Available O2 Space</span>
                        </div>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-red-500">
                        <h4 className="text-sm font-bold text-white">Hypoxic Equivalent</h4>
                        <p className="text-xs text-slate-400 mt-1">
                            A heavy smoker (15-20/day) has a functional altitude of <strong>4,000 - 5,000 ft</strong> while at sea level.
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            Their Night Vision is degraded earlier (from ground level).
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4">Carbon Monoxide Poisoning</h3>
                <p className="text-xs text-slate-400 mb-4">
                    Most common in light aircraft via heater shroud leaks.
                </p>

                <div className="space-y-2">
                    <h4 className="text-sm font-bold text-slate-300">Symptoms Progression:</h4>
                    {[
                        { stage: 'Early', sym: 'Headache, slight dizziness, warm feeling' },
                        { stage: 'Middle', sym: 'Nausea, impaired judgement, cherry-red lips/skin' },
                        { stage: 'Late', sym: 'Convulsions, Coma, Death' },
                    ].map((s, i) => (
                        <div key={i} className="flex gap-2 p-2 bg-slate-800 rounded">
                            <div className={`w-2 h-full rounded-full ${i === 2 ? 'bg-red-600' : i === 1 ? 'bg-orange-500' : 'bg-yellow-400'}`}></div>
                            <div>
                                <span className="text-xs font-bold text-white block">{s.stage}</span>
                                <span className="text-xs text-slate-400">{s.sym}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 p-3 bg-red-900/20 border-red-500/50 border rounded-lg">
                    <p className="text-xs text-red-200 font-bold text-center">
                        ACTION: Shut off heater. Open vents. Land ASAP.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HPLToxicology;
