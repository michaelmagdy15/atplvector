
import React, { useState } from 'react';
import { Briefcase, Gavel, AlertTriangle, Users, Calculator, Euro } from 'lucide-react';

const LiabilityAndRights: React.FC = () => {
    const [tab, setTab] = useState<'ec261' | 'liability'>('ec261');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Gavel className="text-purple-400" />
                        Liability & Rights
                    </h2>
                    <p className="text-slate-400 text-sm">Consumer protection (EC 261/2004) and Liability Conventions.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setTab('ec261')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'ec261' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>EC 261/2004</button>
                    <button onClick={() => setTab('liability')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'liability' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>Liability (Rome/Montreal)</button>
                </div>
            </div>

            {tab === 'ec261' && <EC261Calculator />}
            {tab === 'liability' && <LiabilityInfo />}
        </div>
    );
};

const EC261Calculator = () => {
    const [distance, setDistance] = useState(1000);
    const [delay, setDelay] = useState(2);

    const getCompensation = () => {
        // Rules:
        // <= 1500km: €250 (if delay > 2h for care, >3h for comp)
        // 1500-3500km: €400 (if delay > 3h)
        // > 3500km: €600 (if delay > 4h)

        let comp = 0;
        let care = false;

        if (distance <= 1500) {
            if (delay >= 2) care = true;
            if (delay >= 3) comp = 250;
        } else if (distance <= 3500) {
            if (delay >= 3) care = true;
            if (delay >= 3) comp = 400;
        } else {
            if (delay >= 4) care = true;
            if (delay >= 3) comp = 600; // Actually >4h for full, but >3h gives right to comp in case law
            // Simplified for exam purposes: >3500km delay >4h = 600. 
            // Note: Sturgeon ruling made delay >3h generally eligible. Let's use standard exam logic.
            // Exam often cites delay thresholds for "Duty of Care": 2h (Short), 3h (Med), 4h (Long).
        }

        // 50% reduction if rerouted arrival is close to original time (not implemented for simplicity)
        return { comp, care };
    };

    const result = getCompensation();

    return (
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
            <div className="space-y-6">
                <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Calculator size={18} /> Compensation Calculator
                    </h3>

                    <div className="mb-4">
                        <label className="flex justify-between text-xs text-slate-400 uppercase mb-2">
                            Flight Distance <span className="text-white font-bold">{distance} km</span>
                        </label>
                        <input type="range" min="100" max="6000" step="100" value={distance} onChange={e => setDistance(Number(e.target.value))} className="w-full accent-purple-500" />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                            <span>Short Haul (&le;1500)</span>
                            <span>Long Haul (&gt;3500)</span>
                        </div>
                    </div>

                    <div>
                        <label className="flex justify-between text-xs text-slate-400 uppercase mb-2">
                            Delay Duration <span className="text-white font-bold">{delay} hours</span>
                        </label>
                        <input type="range" min="0" max="10" step="1" value={delay} onChange={e => setDelay(Number(e.target.value))} className="w-full accent-purple-500" />
                    </div>
                </div>

                <div className="bg-slate-800 p-4 rounded border-l-4 border-slate-500 text-xs text-slate-400">
                    <strong>Note:</strong> Applies to all flights departing EU, or arriving EU on EU carrier. Extraordinary circumstances (Weather, Strike, ATC) exempt compensation but NOT duty of care.
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className={`p-6 rounded-xl border-2 flex items-center justify-between transition-all ${result.comp > 0 ? 'bg-emerald-900/20 border-emerald-500' : 'bg-slate-900 border-slate-700'}`}>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Cash Compensation</p>
                        <p className={`text-3xl font-black ${result.comp > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>€{result.comp}</p>
                    </div>
                    <div className="p-3 bg-emerald-500/20 rounded-full text-emerald-500">
                        <Euro size={32} />
                    </div>
                </div>

                <div className={`p-6 rounded-xl border-2 flex items-center justify-between transition-all ${result.care ? 'bg-blue-900/20 border-blue-500' : 'bg-slate-900 border-slate-700'}`}>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Duty of Care</p>
                        <p className={`text-lg font-bold ${result.care ? 'text-blue-400' : 'text-slate-500'}`}>
                            {result.care ? 'Meals, Refreshments, Hotel' : 'None Required yet'}
                        </p>
                    </div>
                    <div className="p-3 bg-blue-500/20 rounded-full text-blue-500">
                        <Users size={32} />
                    </div>
                </div>

                <div className="bg-slate-900 p-4 rounded border border-slate-700">
                    <h4 className="font-bold text-white text-sm mb-2">Denied Boarding</h4>
                    <p className="text-xs text-slate-300">If overbooked, airline must first seek volunteers. If denied involuntarily &rarr; Immediate Compensation + Care + Refund/Reroute.</p>
                </div>
            </div>
        </div>
    );
};

const LiabilityInfo = () => (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
        <div className="space-y-6">
            <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                <h3 className="font-bold text-white mb-3">Rome Convention (1952)</h3>
                <p className="text-sm text-slate-400 mb-4">Damage caused by foreign aircraft to third parties on the surface.</p>
                <ul className="text-sm text-slate-300 space-y-2 list-disc pl-4">
                    <li><strong className="text-purple-400">Strict Liability:</strong> Operator is liable regardless of fault (Absolute liability).</li>
                    <li>Limits based on <strong className="text-white">MTOW</strong> (Maximum Take-Off Weight).</li>
                    <li>Unless damage caused by deliberate act (Terrorism/Noise/Sonic Boom excluded usually).</li>
                </ul>
            </div>

            <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                <h3 className="font-bold text-white mb-3">Warsaw vs Montreal</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Warsaw (1929)</span>
                        <span className="text-red-400 text-right">Low Limits<br />Need to prove negligence</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Montreal (1999)</span>
                        <span className="text-emerald-400 text-right">Unlimited Liability (Injury)<br />2-Tier System</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
            <h3 className="font-bold text-white mb-4">Montreal Convention Limits (SDR)</h3>
            <div className="space-y-4">
                <div className="bg-slate-800 p-4 rounded relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10"><Briefcase size={40} /></div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Cargo</p>
                    <p className="text-2xl font-black text-white">22 SDR <span className="text-sm font-normal text-slate-500">/ kg</span></p>
                </div>
                <div className="bg-slate-800 p-4 rounded relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10"><Briefcase size={40} /></div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Baggage (Lost/Damaged)</p>
                    <p className="text-2xl font-black text-white">1,288 SDR <span className="text-sm font-normal text-slate-500">/ pax</span></p>
                </div>
                <div className="bg-slate-800 p-4 rounded relative overflow-hidden border-l-4 border-emerald-500">
                    <div className="absolute top-0 right-0 p-2 opacity-10"><Users size={40} /></div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Death / Injury (Tier 1)</p>
                    <p className="text-2xl font-black text-white">128,821 SDR</p>
                    <p className="text-[10px] text-emerald-400 mt-1">Strict Liability (No fault needed). Above this, carrier liable unless they prove no negligence.</p>
                </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-4 text-center">SDR = Special Drawing Rights (IMF Currency Basket). Values indexed approx every 5 years.</p>
        </div>
    </div>
);

export default LiabilityAndRights;
