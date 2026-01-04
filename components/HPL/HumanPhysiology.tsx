
import React, { useState } from 'react';
import { HeartPulse, Wind, AlertTriangle, Clock, Activity, ArrowUp } from 'lucide-react';

const HumanPhysiology: React.FC = () => {
    const [tab, setTab] = useState<'hypoxia' | 'tuc' | 'gas'>('hypoxia');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <HeartPulse className="text-red-500" />
                        Physiology & Altitude (040.02)
                    </h2>
                    <p className="text-slate-400 text-sm">Hypoxia symptoms, TUC limits, and Gas Laws.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setTab('hypoxia')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'hypoxia' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}>Hypoxia Sim</button>
                    <button onClick={() => setTab('tuc')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'tuc' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}>TUC Chart</button>
                    <button onClick={() => setTab('gas')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'gas' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}>Gas Laws</button>
                </div>
            </div>

            {tab === 'hypoxia' && <HypoxiaSim />}
            {tab === 'tuc' && <TucChart />}
            {tab === 'gas' && <GasLaws />}
        </div>
    );
};

// 040.02.01 Hypoxia
const HypoxiaSim = () => {
    const [altitude, setAltitude] = useState(0);

    const getSymptoms = (alt: number) => {
        if (alt < 10000) return { zone: 'Safe', symptoms: 'Normal function. Night vision slightly reduced >5000ft.', sat: '95-98%' };
        if (alt < 15000) return { zone: 'Reaction', symptoms: 'Impaired judgement, night vision loss, euphoria.', sat: '85-90%' };
        if (alt < 20000) return { zone: 'Disturbance', symptoms: 'Drowsiness, dizziness, tunnel vision, cyanosis (blue lips).', sat: '70-80%' };
        return { zone: 'Critical', symptoms: 'Unconsciousness, convulsions, death.', sat: '< 65%' };
    };

    const status = getSymptoms(altitude);

    return (
        <div className="flex flex-col md:flex-row gap-8 animate-in fade-in">
            <div className="w-full md:w-1/3">
                <label className="block text-slate-400 mb-4">Cabin Altitude: <span className="text-white font-bold text-xl ml-2">{altitude} ft</span></label>
                <input 
                    type="range" 
                    min="0" 
                    max="35000" 
                    step="1000"
                    value={altitude}
                    onChange={(e) => setAltitude(Number(e.target.value))}
                    className="w-full h-3 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-red-500 mb-8"
                />
                
                <div className="space-y-4">
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-600 flex justify-between items-center">
                        <span className="text-xs text-slate-400 uppercase font-bold">SpO2</span>
                        <div className={`text-2xl font-bold ${altitude > 15000 ? 'text-red-500' : 'text-white'}`}>{status.sat}</div>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-600">
                        <span className="text-xs text-slate-400 uppercase font-bold">Current State</span>
                        <div className={`text-xl font-bold mt-1 ${status.zone === 'Critical' ? 'text-red-500' : status.zone === 'Disturbance' ? 'text-orange-500' : 'text-emerald-500'}`}>
                            {status.zone} Stage
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-2/3 bg-slate-900 rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden border border-slate-700">
                {/* Visualizer */}
                <div className={`relative w-48 h-48 mb-6 rounded-full border-4 flex items-center justify-center transition-all duration-1000 ${altitude > 15000 ? 'border-red-500 bg-red-900/10' : 'border-emerald-500 bg-emerald-900/10'}`}>
                    <Wind size={64} className={`transition-all duration-500 ${altitude > 15000 ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`} />
                    {altitude > 20000 && (
                        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center animate-[pulse_2s_infinite]">
                            <span className="text-red-500 font-black text-xl">BLACKOUT</span>
                        </div>
                    )}
                </div>

                <div className="text-center z-10 max-w-sm">
                     <h3 className="text-lg font-bold text-white mb-2">Symptoms</h3>
                     <p className="text-slate-400 text-sm leading-relaxed">{status.symptoms}</p>
                     
                     {altitude > 10000 && (
                        <div className="mt-6 inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full font-bold animate-bounce shadow-lg shadow-red-500/30">
                            <AlertTriangle size={18} /> OXYGEN ON
                        </div>
                     )}
                </div>
            </div>
        </div>
    );
};

// Time of Useful Consciousness
const TucChart = () => {
    const data = [
        { alt: 18000, tuc: '30 min' },
        { alt: 22000, tuc: '5-10 min' },
        { alt: 25000, tuc: '3-6 min' },
        { alt: 30000, tuc: '1-3 min' },
        { alt: 35000, tuc: '30-60 sec' },
        { alt: 40000, tuc: '15-20 sec' },
    ];

    return (
        <div className="animate-in slide-in-from-right-4">
            <h3 className="text-xl font-bold text-white mb-6">Time of Useful Consciousness (TUC)</h3>
            <p className="text-slate-400 text-sm mb-6">Also known as Effective Performance Time (EPT). The time available to take corrective action before becoming incapacitated.</p>

            <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
                <div className="grid grid-cols-2 bg-slate-800 p-4 font-bold text-xs uppercase text-slate-400">
                    <div>Altitude (ft)</div>
                    <div>TUC / EPT</div>
                </div>
                {data.map((row, i) => (
                    <div key={row.alt} className={`grid grid-cols-2 p-4 border-t border-slate-800 hover:bg-white/5 transition-colors ${row.alt >= 35000 ? 'text-red-400' : 'text-slate-200'}`}>
                        <div className="font-mono font-bold">{row.alt.toLocaleString()}</div>
                        <div className="font-mono">{row.tuc}</div>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border-l-4 border-orange-500">
                <div className="flex items-start gap-3">
                    <Activity className="text-orange-500 mt-1" size={20} />
                    <div>
                        <h4 className="text-white font-bold text-sm">Explosive Decompression</h4>
                        <p className="text-xs text-slate-300 mt-1">If decompression is explosive (rapid), TUC is reduced by <strong>50%</strong>.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 040.02.01 Gas Laws
const GasLaws = () => {
    return (
        <div className="grid md:grid-cols-3 gap-6 animate-in slide-in-from-left-4">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors group">
                <div className="text-blue-500 mb-4 group-hover:scale-110 transition-transform"><Wind size={32} /></div>
                <h3 className="text-lg font-bold text-white mb-2">Dalton's Law</h3>
                <p className="text-xs text-slate-400 uppercase font-bold mb-2">The Law of Partial Pressure</p>
                <p className="text-sm text-slate-300">
                    Total pressure = Sum of partial pressures. As altitude increases, total pressure drops, so partial pressure of O2 drops.
                </p>
                <div className="mt-4 text-xs font-mono text-blue-400">Cause of: Hypoxia</div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 hover:border-orange-500 transition-colors group">
                <div className="text-orange-500 mb-4 group-hover:scale-110 transition-transform"><ArrowUp size={32} /></div>
                <h3 className="text-lg font-bold text-white mb-2">Boyle's Law</h3>
                <p className="text-xs text-slate-400 uppercase font-bold mb-2">Volume vs Pressure</p>
                <p className="text-sm text-slate-300">
                    P x V = Constant. As pressure decreases (ascent), volume of gas expands.
                </p>
                <div className="mt-4 text-xs font-mono text-orange-400">Cause of: Barotrauma (Ears, Sinus, GI tract)</div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 hover:border-emerald-500 transition-colors group">
                <div className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform"><Activity size={32} /></div>
                <h3 className="text-lg font-bold text-white mb-2">Henry's Law</h3>
                <p className="text-xs text-slate-400 uppercase font-bold mb-2">Solubility</p>
                <p className="text-sm text-slate-300">
                    Gas dissolved in liquid is proportional to pressure. Rapid pressure drop releases gas as bubbles.
                </p>
                <div className="mt-4 text-xs font-mono text-emerald-400">Cause of: Decompression Sickness (The Bends)</div>
            </div>
        </div>
    );
};

export default HumanPhysiology;
