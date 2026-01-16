
import React, { useState } from 'react';
import { Activity, Thermometer, Wind, AlertCircle, Clock } from 'lucide-react';

const HPLHealth: React.FC = () => {
    const [tab, setTab] = useState<'gas' | 'hypoxia' | 'health' | 'profHealth'>('gas');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Activity className="text-emerald-400" />
                        Health & Physiology
                    </h2>
                    <p className="text-slate-400 text-sm">Gas Laws, Hypoxia, and Fitness to Fly.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button onClick={() => setTab('gas')} className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${tab === 'gas' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>Gas Laws</button>
                    <button onClick={() => setTab('hypoxia')} className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${tab === 'hypoxia' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>Hypoxia</button>
                    <button onClick={() => setTab('health')} className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${tab === 'health' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>Barotrauma</button>
                    <button onClick={() => setTab('profHealth')} className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${tab === 'profHealth' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>Prof. Health</button>
                </div>
            </div>

            {tab === 'gas' && <GasLaws />}
            {tab === 'hypoxia' && <HypoxiaTUC />}
            {tab === 'health' && <Barotrauma />}
            {tab === 'profHealth' && <ProfessionalHealth />}
        </div>
    );
};

const ProfessionalHealth = () => (
    <div className="animate-in fade-in space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
            {/* Obesity & Diabetes */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="text-red-400" /> Obesity & Metabolic Risks
                </h3>
                <div className="space-y-4">
                    <div className="p-3 bg-red-900/10 border-l-4 border-red-500 rounded">
                        <h4 className="font-bold text-white text-sm">Obesity Risks</h4>
                        <p className="text-xs text-slate-400">Reduced G-tolerance, increased risk of hypoxia, and Obstructive Sleep Apnoea (OSA).</p>
                    </div>
                    <div className="p-3 bg-blue-900/10 border-l-4 border-blue-500 rounded">
                        <h4 className="font-bold text-white text-sm">Type 2 Diabetes</h4>
                        <p className="text-xs text-slate-400">Can lead to disqualification if medication is required that causes hypoglycaemia. Associated with cardiovascular disease.</p>
                    </div>
                </div>
            </div>

            {/* Back Care */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="text-emerald-400" /> Back Care & Posture
                </h3>
                <p className="text-xs text-slate-400 mb-4">Long hours sitting in vibration-heavy cockpits lead to back issues (Lumbago).</p>
                <ul className="space-y-2 text-[11px] text-slate-300">
                    <li className="flex gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1"></div>
                        <span>Maintain lumbar support (adjust seat properly).</span>
                    </li>
                    <li className="flex gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1"></div>
                        <span>Regular exercise to strengthen core/abdominal muscles.</span>
                    </li>
                    <li className="flex gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1"></div>
                        <span>Isometric exercises (muscle tensing) during cruise.</span>
                    </li>
                </ul>
            </div>
        </div>

        <div className="bg-slate-900/50 p-6 rounded-xl border border-dashed border-slate-700 text-center">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Fitness to Fly Principle</h4>
            <p className="text-sm text-slate-300 italic">"The pilot is responsible for assessing their own fitness before every flight. If in doubt, ground yourself."</p>
        </div>
    </div>
);

const GasLaws = () => {
    const [altitude, setAltitude] = useState(0); // 0 to 40000 ft

    // Simple pressure model (exponential decay approx)
    // 0ft = 1013hPa, 18000ft = 500hPa (1/2), 34000ft = 250hPa (1/4)
    const pressureRatio = Math.pow(0.5, altitude / 18000);
    const volumeRatio = 1 / pressureRatio;

    return (
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
            <div className="space-y-6">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4">Boyle's Law</h3>
                    <p className="text-sm text-slate-300 mb-4 bg-emerald-900/20 p-2 rounded border-l-4 border-emerald-500">
                        "Volume is inversely proportional to Pressure." (T = Constant)
                    </p>

                    <div className="mb-4">
                        <label className="flex justify-between text-xs text-slate-400 mb-2">
                            Altitude
                            <span className="text-white font-mono">{altitude.toLocaleString()} ft</span>
                        </label>
                        <input type="range" min="0" max="40000" step="1000" value={altitude} onChange={e => setAltitude(Number(e.target.value))} className="w-full accent-emerald-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-slate-800 p-2 rounded">
                            <p className="text-xs text-slate-400">Pressure</p>
                            <p className="text-emerald-400 font-bold">{(pressureRatio * 100).toFixed(0)}%</p>
                        </div>
                        <div className="bg-slate-800 p-2 rounded">
                            <p className="text-xs text-slate-400">Gas Volume</p>
                            <p className="text-red-400 font-bold">{volumeRatio.toFixed(1)}x</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="bg-slate-800 p-4 rounded border-l-4 border-blue-500">
                        <h4 className="font-bold text-white text-sm">Dalton's Law</h4>
                        <p className="text-xs text-slate-400">Total pressure = Sum of partial pressures. Explains Hypoxia (Low pO2).</p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded border-l-4 border-purple-500">
                        <h4 className="font-bold text-white text-sm">Henry's Law</h4>
                        <p className="text-xs text-slate-400">Gas dissolved in liquid proportional to pressure. Explains DCS (The Bends) - Nitrogen coming out of solution.</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
                <h4 className="text-slate-400 text-sm mb-8 font-bold uppercase">Trapped Gas Expansion</h4>
                {/* Balloon Visual */}
                <div className="relative flex items-center justify-center h-64 w-full">
                    <div
                        className="bg-red-500/80 rounded-full shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all duration-300 flex items-center justify-center text-white font-bold border-4 border-white/10"
                        style={{
                            width: `${100 * Math.pow(volumeRatio, 0.33)}px`, // Cube root for 2D diameter approx of 3D vol
                            height: `${100 * Math.pow(volumeRatio, 0.33)}px`
                        }}
                    >
                        <span className="drop-shadow-md">GAS</span>
                    </div>
                </div>
                <p className="text-xs text-slate-500 text-center mt-4">
                    At 18,000ft, trapped gas (stomach difficulty) doubles in volume.<br />
                    At 34,000ft, it quadruples.
                </p>
            </div>
        </div>
    );
};

const HypoxiaTUC = () => {
    const [alt, setAlt] = useState(25000);

    // Approx TUC values
    const getTUC = (a: number) => {
        if (a < 18000) return "> 30 mins";
        if (a < 22000) return "5 - 10 mins";
        if (a < 26000) return "3 - 5 mins"; // 25000
        if (a < 30000) return "1 - 2 mins";
        if (a < 35000) return "30 - 60 secs";
        if (a < 40000) return "15 - 30 secs";
        return "< 15 secs";
    };

    return (
        <div className="animate-in fade-in">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Clock className="text-amber-400" /> Time of Useful Consciousness
                    </h3>

                    <div className="mb-6">
                        <label className="flex justify-between text-xs text-slate-400 mb-2">
                            Cabin Altitude
                            <span className="text-white font-mono">{alt.toLocaleString()} ft</span>
                        </label>
                        <input type="range" min="15000" max="45000" step="1000" value={alt} onChange={e => setAlt(Number(e.target.value))} className="w-full accent-amber-500" />
                    </div>

                    <div className="text-center p-6 bg-slate-800 rounded-xl border border-slate-600">
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Estimated TUC</p>
                        <p className="text-3xl font-black text-amber-400">{getTUC(alt)}</p>
                        <p className="text-[10px] text-slate-500 mt-2">Effective Performance Time (EPT). Reduced by activity or rapid decompression.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-white">Hypoxia Types</h3>
                    <div className="grid grid-cols-1 gap-2">
                        <div className="bg-slate-800 p-3 rounded border-l-4 border-blue-500">
                            <h4 className="text-sm font-bold text-white">Hypoxic</h4>
                            <p className="text-xs text-slate-400">Low partial pressure of O2 (Altitude). "Thin air".</p>
                        </div>
                        <div className="bg-slate-800 p-3 rounded border-l-4 border-red-500">
                            <h4 className="text-sm font-bold text-white">Anaemic</h4>
                            <p className="text-xs text-slate-400">Blood can't carry O2. CO poisoning (Carbon Monoxide) or low Haemoglobin.</p>
                        </div>
                        <div className="bg-slate-800 p-3 rounded border-l-4 border-purple-500">
                            <h4 className="text-sm font-bold text-white">Stagnant</h4>
                            <p className="text-xs text-slate-400">Blood not flowing (G-Force or Heart failure).</p>
                        </div>
                        <div className="bg-slate-800 p-3 rounded border-l-4 border-yellow-500">
                            <h4 className="text-sm font-bold text-white">Histotoxic</h4>
                            <p className="text-xs text-slate-400">Cells can't use O2 (Alcohol/Drugs/Cyanide).</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Barotrauma = () => (
    <div className="animate-in fade-in">
        <h3 className="font-bold text-white mb-6">Barotrauma (Pressure Injury)</h3>
        <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white text-sm mb-2">Otic Barotrauma</h4>
                <p className="text-xs text-slate-400 mb-2">Middle ear pain. Unequal pressure across eardrum.</p>
                <div className="bg-slate-800 p-2 rounded text-xs">
                    <strong className="text-red-400">Descent:</strong> Most critical. Eustachian tube collapses. Valsalva to clear. Do not fly with cold.
                </div>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white text-sm mb-2">Sinus Barotrauma</h4>
                <p className="text-xs text-slate-400 mb-2">Pain in forehead/cheeks.</p>
                <div className="bg-slate-800 p-2 rounded text-xs">
                    <strong className="text-red-400">Descent:</strong> Air trapped in sinus cavities shrinks/vacuums. Agonizing pain.
                </div>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white text-sm mb-2">Aerodontalgia</h4>
                <p className="text-xs text-slate-400 mb-2">Tooth pain.</p>
                <div className="bg-slate-800 p-2 rounded text-xs">
                    <strong className="text-blue-400">Ascent:</strong> Gas trapped under filling expands.
                </div>
            </div>
        </div>
    </div>
);

export default HPLHealth;
