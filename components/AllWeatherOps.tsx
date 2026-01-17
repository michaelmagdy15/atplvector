import React, { useState } from 'react';
import { Cloud, Eye, Ruler, AlertTriangle, ArrowDownToLine, Plane, CheckCircle2, XCircle } from 'lucide-react';

const AllWeatherOps: React.FC = () => {
    const [tab, setTab] = useState<'aom' | 'ban' | 'lvp'>('aom');

    return (
        <div className="bg-slate-900 min-h-screen text-slate-100 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-teal-500/20 rounded-xl border border-teal-500/30">
                        <Cloud className="text-teal-400 w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">All Weather Operations</h1>
                        <p className="text-slate-400">Aerodrome Operating Minima, LVP, and Approach Bans.</p>
                    </div>
                </div>

                <div className="flex gap-2 mb-8 bg-slate-800/50 p-1 rounded-xl w-fit border border-slate-700">
                    <button
                        onClick={() => setTab('aom')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${tab === 'aom' ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        Operating Minima (AOM)
                    </button>
                    <button
                        onClick={() => setTab('ban')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${tab === 'ban' ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        Approach Ban
                    </button>
                    <button
                        onClick={() => setTab('lvp')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${tab === 'lvp' ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        Low Visibility (LVP)
                    </button>
                </div>

                <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm p-6 min-h-[500px]">
                    {tab === 'aom' && <AomCalculator />}
                    {tab === 'ban' && <ApproachBanVisualizer />}
                    {tab === 'lvp' && <LvpExplainer />}
                </div>
            </div>
        </div>
    );
};

// -------------------------------------------------------------------------
// 1. AOM Calculator (Take-off Minima)
// -------------------------------------------------------------------------
const AomCalculator = () => {
    const [facilities, setFacilities] = useState<string>('full');
    const [acCat, setAcCat] = useState<string>('A');

    const getMinima = () => {
        // Simplified Logic based on EASA Part-SPO/CAT
        if (facilities === 'full') return { rvr: 150, note: "Requires HIV Lts + RCLS (Runway Centerline Lights)" };
        if (facilities === 'inter') return { rvr: 200, note: "Requires RCLS or Edge Lights" };
        if (facilities === 'basic') return { rvr: 400, note: "Requires NIL facilities (Day only)" };
        if (facilities === 'nil') return { rvr: 500, note: "Basic visual reference" };
        return { rvr: 500, note: "" };
    };

    const result = getMinima();

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Ruler className="text-teal-400" /> Take-off Minima Calculator
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-3">Aerodrome Facilities</label>
                        <div className="space-y-2">
                            {[
                                { id: 'full', label: 'RCLS + High Intensity Lights', desc: 'Full LVP capability' },
                                { id: 'inter', label: 'Runway Edge Lights Only', desc: 'Standard Night capability' },
                                { id: 'basic', label: 'Day Markings Only', desc: 'Day VFR capability' },
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => setFacilities(opt.id)}
                                    className={`w-full text-left p-3 rounded-lg border transition-all ${facilities === opt.id ? 'bg-teal-600/20 border-teal-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                                >
                                    <div className="font-bold text-sm">{opt.label}</div>
                                    <div className="text-xs opacity-70">{opt.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-3">Aircraft Category</label>
                        <div className="flex gap-2">
                            {['A', 'B', 'C', 'D'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setAcCat(cat)}
                                    className={`flex-1 py-2 rounded-lg font-bold border transition-colors ${acCat === cat ? 'bg-teal-600 border-teal-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-black/40 rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center text-center">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-2">Required RVR</div>
                    <div className="text-6xl font-black text-white tracking-widest text-shadow-glow-teal mb-2">
                        {result.rvr}m
                    </div>
                    <div className="bg-teal-900/50 text-teal-200 px-3 py-1 rounded text-xs border border-teal-500/30">
                        {result.note}
                    </div>

                    <div className="mt-8 text-left w-full bg-slate-800/50 p-4 rounded border border-slate-700">
                        <h4 className="font-bold text-white text-sm mb-1">Visual Reference</h4>
                        <p className="text-xs text-slate-400">
                            Pilot must have sufficient visual reference to maintain directional control (e.g., centerline lights visible). Categories A, B, C typically share TO minima, but D may require higher if strict alignment needed.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// -------------------------------------------------------------------------
// 2. Approach Ban Visualizer
// -------------------------------------------------------------------------
const ApproachBanVisualizer = () => {
    const [rvr, setRvr] = useState(400); // Current RVR
    const [minima, setMinima] = useState(550); // Charted Minima
    const [altitude, setAltitude] = useState(1500); // Current Altitude

    const isBanEffect = rvr < minima;
    const isAbove1000 = altitude > 1000;

    // Logic: 
    // If RVR < Minima:
    //   - Above 1000ft (or FAF): BAN APPLIES (Cannot Continue)
    //   - Below 1000ft: CAN CONTINUE to DA/H (Look-see approach)

    const canContinue = !isBanEffect || !isAbove1000;

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <AlertTriangle className="text-orange-400" /> Approach Ban Rules
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-400">Current RVR</span>
                                <span className={`font-bold ${rvr < minima ? 'text-red-400' : 'text-emerald-400'}`}>{rvr}m</span>
                            </div>
                            <input
                                type="range" min="0" max="1000" step="50"
                                value={rvr} onChange={(e) => setRvr(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-400">Charted Minima</span>
                                <span className="text-white font-bold">{minima}m</span>
                            </div>
                            <input
                                type="range" min="0" max="1000" step="50"
                                value={minima} onChange={(e) => setMinima(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-500"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-400">Aircraft Altitude (AAL)</span>
                                <span className="text-white font-bold">{altitude}ft</span>
                            </div>
                            <input
                                type="range" min="0" max="2000" step="100"
                                value={altitude} onChange={(e) => setAltitude(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                            />
                            {isAbove1000 && <div className="text-xs text-orange-400 text-right mt-1">Above Approach Ban Point (1000ft)</div>}
                            {!isAbove1000 && <div className="text-xs text-emerald-400 text-right mt-1">Below Approach Ban Point</div>}
                        </div>
                    </div>

                    <div className={`p-4 rounded-xl border ${canContinue ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-red-900/20 border-red-500/50'}`}>
                        <div className="flex items-center gap-3">
                            {canContinue ? <CheckCircle2 size={32} className="text-emerald-500" /> : <XCircle size={32} className="text-red-500" />}
                            <div>
                                <h3 className={`font-bold text-lg ${canContinue ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {canContinue ? 'CONTINUE APPROACH' : 'GO AROUND'}
                                </h3>
                                <p className="text-xs text-slate-300">
                                    {canContinue
                                        ? (isBanEffect ? "RVR is below minima, but past the ban point (1000ft). You may continue to DA/H to look for visuals." : "RVR is adequate. Normal Approach.")
                                        : "RVR is below minima and you are outside the ban point (>1000ft). You must not continue."
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-xl border border-slate-700 relative overflow-hidden flex flex-col justify-between">
                    {/* Visual representation of Glide Path */}
                    <div className="absolute inset-x-0 bottom-0 top-0 bg-[url('https://images.unsplash.com/photo-1579965342575-16428a7c8d71?q=80&w=1975&auto=format&fit=crop')] bg-cover opacity-10"></div>

                    <div className="relative z-10 w-full h-full p-8 flex items-end">
                        {/* Runway */}
                        <div className="absolute bottom-4 right-8 w-32 h-2 bg-slate-500 rounded shadow-[0_0_10px_white]"></div>

                        {/* Ban Line */}
                        <div className="absolute top-1/2 w-full h-px border-t border-dashed border-orange-500 flex items-center justify-end px-2">
                            <span className="text-xs text-orange-400 bg-slate-900 p-1">1000ft AAL (Outer Marker)</span>
                        </div>

                        {/* Plane */}
                        <div
                            className="absolute transition-all duration-300 text-white"
                            style={{
                                bottom: `${(altitude / 2000) * 80}%`,
                                left: `${(1 - (altitude / 2000)) * 70}%`
                            }}
                        >
                            <Plane size={24} className="rotate-12" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// -------------------------------------------------------------------------
// 3. LVP Explainer
// -------------------------------------------------------------------------
const LvpExplainer = () => {
    return (
        <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Eye className="text-teal-400" /> Low Visibility Procedures (LVP)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 hover:border-teal-500 transition-colors">
                    <div className="font-bold text-xl text-white mb-1">CAT I</div>
                    <div className="text-xs text-slate-400 mb-4">Standard Precision Approach</div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">DH</span>
                            <span className="text-white font-mono">≥ 200ft</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">RVR</span>
                            <span className="text-white font-mono">≥ 550m</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 hover:border-teal-500 transition-colors">
                    <div className="font-bold text-xl text-white mb-1">CAT II</div>
                    <div className="text-xs text-slate-400 mb-4">Autoland usually required</div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">DH</span>
                            <span className="text-white font-mono">100-200ft</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">RVR</span>
                            <span className="text-white font-mono">≥ 300m</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 hover:border-teal-500 transition-colors">
                    <div className="font-bold text-xl text-white mb-1">CAT III</div>
                    <div className="text-xs text-slate-400 mb-4">Zero visibility ops</div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">DH</span>
                            <span className="text-white font-mono">&lt; 100ft</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">RVR</span>
                            <span className="text-white font-mono">75m - 200m</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-teal-900/20 p-6 rounded-xl border border-teal-500/30">
                <h3 className="font-bold text-teal-400 mb-3">LVP Trigger</h3>
                <p className="text-slate-300 text-sm mb-4">
                    LVPs are enforced when RVR falls below <strong>550m</strong> or Cloud Ceiling below <strong>200ft</strong>.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 p-3 rounded border border-slate-700">
                        <div className="font-bold text-white text-sm">1. Protected Area</div>
                        <div className="text-xs text-slate-400">ILS Sensitive areas are protected from taxiing aircraft to prevent signal interference.</div>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded border border-slate-700">
                        <div className="font-bold text-white text-sm">2. Callouts</div>
                        <div className="text-xs text-slate-400">ATC will state "LVP IN FORCE". Pilots must acknowledge.</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllWeatherOps;
