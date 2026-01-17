
import React, { useState } from 'react';
import { Globe, Plane, Map as MapIcon, Compass, AlertTriangle, Clock, Activity } from 'lucide-react';

const LongRangeOps: React.FC = () => {
    const [tab, setTab] = useState<'nat' | 'etops' | 'polar' | 'alt'>('nat');

    return (
        <div className="bg-slate-900 min-h-screen text-slate-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                        <Globe className="text-indigo-400 w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Long Range Operations</h1>
                        <p className="text-slate-400">NAT HLA, ETOPS, and Polar Navigation procedures.</p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-2 mb-8 bg-slate-800/50 p-1 rounded-xl w-fit border border-slate-700">
                    <button
                        onClick={() => setTab('nat')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${tab === 'nat' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        NAT HLA
                    </button>
                    <button
                        onClick={() => setTab('etops')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${tab === 'etops' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        ETOPS / EDTO
                    </button>
                    <button
                        onClick={() => setTab('polar')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${tab === 'polar' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        Polar Ops
                    </button>
                    <button
                        onClick={() => setTab('alt')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${tab === 'alt' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        Alt Planning
                    </button>
                </div>

                {/* Content Area */}
                <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm p-6 min-h-[600px]">
                    {tab === 'nat' && <NatHlaModule />}
                    {tab === 'etops' && <EtopsModule />}
                    {tab === 'polar' && <PolarOpsModule />}
                    {tab === 'alt' && <AlternatePlanningModule />}
                </div>
            </div >
        </div >
    );
};

// -------------------------------------------------------------------------
// Alternate Planning Module (Table 1)
// -------------------------------------------------------------------------
const AlternatePlanningModule = () => {
    const [destWx, setDestWx] = useState('cat23');

    const getAltReq = () => {
        if (destWx === 'cat23') return { req: 'Category I', rvr: '550m', note: 'If Destination is Cat II/III, Alternate must be at least Cat I.' };
        if (destWx === 'cat1') return { req: 'Non-Precision (NPA)', rvr: 'NPA Minima', note: 'If Destination is Cat I, Alternate must be Non-Precision (LNAV/VNAV).' };
        if (destWx === 'npa') return { req: 'NPA + 200ft / 1000m', rvr: 'Minima + 1000m', note: 'If Destination is NPA only, Alternate must be NPA with add-on margins.' };
        return { req: 'Check Charts', rvr: '', note: '' };
    };

    const res = getAltReq();

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Alternate Aerodrome Planning Minima</h2>
            <p className="text-slate-400 mb-8">
                The weather requirements for planning an Alternate are usually <strong>higher</strong> (more restrictive) than for the destination. This ensures a safety margin if you actually divert.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4">Destination Forecast</h3>
                    <div className="space-y-3">
                        <button onClick={() => setDestWx('cat23')} className={`w-full text-left p-4 rounded-lg border transition-all ${destWx === 'cat23' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                            <div className="font-bold">Cat II or III Capability</div>
                            <div className="text-xs opacity-70">RVR &lt; 550m</div>
                        </button>
                        <button onClick={() => setDestWx('cat1')} className={`w-full text-left p-4 rounded-lg border transition-all ${destWx === 'cat1' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                            <div className="font-bold">Cat I Capability</div>
                            <div className="text-xs opacity-70">RVR 550m+</div>
                        </button>
                        <button onClick={() => setDestWx('npa')} className={`w-full text-left p-4 rounded-lg border transition-all ${destWx === 'npa' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                            <div className="font-bold">Non-Precision Only</div>
                            <div className="text-xs opacity-70">LNAV / VOR / NDB</div>
                        </button>
                    </div>
                </div>

                <div className="bg-indigo-900/20 p-8 rounded-xl border border-indigo-500/30 flex flex-col justify-center items-center text-center">
                    <div className="text-sm font-bold text-indigo-300 uppercase mb-2">Required Alternate Minima</div>
                    <div className="text-4xl font-black text-white mb-2">{res.req}</div>
                    <div className="text-xl text-slate-300 mb-6">{res.rvr}</div>
                    <div className="bg-slate-900/50 p-4 rounded-lg text-sm text-slate-400 border border-slate-700">
                        {res.note}
                    </div>
                </div>
            </div>
        </div>
    );
};

// -------------------------------------------------------------------------
// NAT HLA Module
// -------------------------------------------------------------------------
const NatHlaModule = () => {
    const [scenario, setScenario] = useState('normal');

    return (
        <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">North Atlantic High Level Airspace</h2>
                    <p className="text-slate-400 text-sm">Formerly MNPS. Extending from FL285 to FL420.</p>
                </div>

                <div className="bg-slate-900 rounded-xl p-5 border border-slate-700">
                    <h3 className="font-bold text-indigo-400 mb-4 flex items-center gap-2">
                        <Activity size={18} /> Equipment Requirements
                    </h3>
                    <ul className="space-y-3">
                        <RequirementItem
                            label="2 x LRNS"
                            desc="Long Range Nav Systems (IRS/GPS)"
                            check={true}
                        />
                        <RequirementItem
                            label="2 x HF Radios"
                            desc="High Frequency comms (with SELCAL)"
                            check={true}
                        />
                        <RequirementItem
                            label="RNP 4 / RNP 10"
                            desc="Performance Based Navigation approval"
                            check={true}
                        />
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-white mb-3">Contingency Scenarios</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setScenario('turn-back')}
                            className={`p-3 rounded-lg border text-left text-sm font-bold transition-all ${scenario === 'turn-back' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                        >
                            Turn Back Procedure
                        </button>
                        <button
                            onClick={() => setScenario('weather')}
                            className={`p-3 rounded-lg border text-left text-sm font-bold transition-all ${scenario === 'weather' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                        >
                            Weather Deviation
                        </button>
                        <button
                            onClick={() => setScenario('comm-fail')}
                            className={`p-3 rounded-lg border text-left text-sm font-bold transition-all ${scenario === 'comm-fail' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                        >
                            Comms Failure
                        </button>
                        <button
                            onClick={() => setScenario('nav-fail')}
                            className={`p-3 rounded-lg border text-left text-sm font-bold transition-all ${scenario === 'nav-fail' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                        >
                            Nav Degradation
                        </button>
                    </div>
                </div>

                <div className="bg-indigo-900/20 rounded-xl p-4 border border-indigo-500/30">
                    <h4 className="font-bold text-indigo-300 text-sm mb-2 uppercase tracking-wider">Procedure Action</h4>
                    {scenario === 'turn-back' && (
                        <div className="text-sm text-slate-300 space-y-2">
                            <p><strong>1.</strong> Turn OFF Track 30° Left or Right.</p>
                            <p><strong>2.</strong> Acquire 5 NM offset.</p>
                            <p><strong>3.</strong> Turn back to parallel original track.</p>
                            <p><strong>4.</strong> Climb/Descend 500ft (or 1000ft if above FL410).</p>
                            <p className="text-xs text-indigo-400 mt-2">*Broadcast on 121.5 and 123.45 ("Interpilot").</p>
                        </div>
                    )}
                    {scenario === 'weather' && (
                        <div className="text-sm text-slate-300 space-y-2">
                            <p>If unable to obtain generic clearance:</p>
                            <p><strong>deviation &lt; 10 NM:</strong> Maintain Level.</p>
                            <p><strong>deviation &gt; 10 NM:</strong> Climb/Descend 300ft based on track (SAND Rule).</p>
                            <p className="text-xs font-mono bg-black/30 p-2 rounded border border-white/10 mt-2">
                                SOUTH = ASCEND (300ft)<br />NORTH = DESCEND (300ft)
                            </p>
                        </div>
                    )}
                    {scenario === 'comm-fail' && (
                        <div className="text-sm text-slate-300">
                            <p>Proceed in accordance with the last cleared routing received and acknowledged. If no clearance, proceed as filed.</p>
                            <p className="mt-2 text-indigo-400">Prioritize SATCOM if HF unavailable.</p>
                        </div>
                    )}
                    {scenario === 'nav-fail' && (
                        <div className="text-sm text-slate-300">
                            <p><strong>1 Partial Fail:</strong> Notify ATC, monitor remaining accuracy.</p>
                            <p><strong>Total Fail:</strong> Use visual cues (if any), dead reckoning, ask other aircraft for position checks.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Visualizer Area */}
            <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>

                <div className="relative z-10 w-full max-w-md">
                    <div className="aspect-square bg-blue-500/10 rounded-full border border-blue-500/30 relative flex items-center justify-center animate-pulse-slow">
                        {/* Tracks */}
                        <div className="absolute w-[120%] h-px bg-white/20 top-1/4 -rotate-12 group-hover:bg-indigo-400/50 transition-colors"></div>
                        <div className="absolute w-[120%] h-px bg-white/20 top-1/2 -rotate-12 group-hover:bg-indigo-400/50 transition-colors"></div>
                        <div className="absolute w-[120%] h-px bg-white/20 top-3/4 -rotate-12 group-hover:bg-indigo-400/50 transition-colors"></div>

                        <Plane size={32} className="text-white rotate-45 transform translate-x-4 -translate-y-4" />

                        {scenario === 'turn-back' && (
                            <div className="absolute top-1/2 left-1/2 w-16 h-16 border-l-2 border-t-2 border-dashed border-red-500 rounded-tl-3xl -ml-2 -mt-2 animate-pulse"></div>
                        )}

                        <div className="absolute bottom-4 right-4 text-xs font-mono text-indigo-300">
                            TRACK: SHANWICK OCEANIC<br />
                            FL350 M0.84
                        </div>
                    </div>
                </div>

                <div className="relative z-10 mt-6 grid grid-cols-2 gap-4 text-center w-full">
                    <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-600">
                        <div className="text-xs text-slate-400 uppercase">Vertical Sep</div>
                        <div className="text-xl font-bold text-white">1000 ft</div>
                        <div className="text-[10px] text-slate-500">RVSM</div>
                    </div>
                    <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-600">
                        <div className="text-xs text-slate-400 uppercase">Lateral Sep</div>
                        <div className="text-xl font-bold text-white">60 NM</div>
                        <div className="text-[10px] text-slate-500">RLatSM</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// -------------------------------------------------------------------------
// ETOPS Module
// -------------------------------------------------------------------------
const EtopsModule = () => {
    const [speed, setSpeed] = useState(380); // One engine inop speed
    const [time, setTime] = useState(60); // Rule Time
    const distance = speed * (time / 60);

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-white mb-6">Extended Diversion Time Operations (EDTO/ETOPS)</h2>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-lg font-bold text-indigo-400 mb-4">Threshold Calculation</h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Single Engine Cruise Speed (TAS)</label>
                                <input
                                    type="range"
                                    min="300" max="450"
                                    value={speed}
                                    onChange={e => setSpeed(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                                <div className="text-right font-mono font-bold text-white mt-1">{speed} kts</div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Approved Diversion Time</label>
                                <div className="flex gap-2">
                                    {[60, 120, 180, 240, 330].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setTime(t)}
                                            className={`flex-1 py-2 rounded text-sm font-bold border transition-colors ${time === t ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'}`}
                                        >
                                            {t}'
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 bg-black/40 p-4 rounded-xl border border-white/10 text-center">
                            <div className="text-xs text-slate-400 uppercase font-bold mb-1">Max Diversion Distance</div>
                            <div className="text-4xl font-black text-white tracking-widest text-shadow-glow-indigo">
                                {Math.round(distance)} <span className="text-lg text-slate-500">NM</span>
                            </div>
                            <div className="text-xs text-slate-500 mt-2">Still Air Distance (ISA Conditions)</div>
                        </div>
                    </div>

                    <div className="text-sm text-slate-400 bg-slate-800/50 p-4 rounded-lg">
                        <strong className="text-white">Note:</strong> ETOPS applies to twins when &gt; 60 mins from an adequate aerodrome at one-engine-inoperative cruise speed. <br /><br />
                        For &gt; 180 mins, specific "Adequate" vs "Suitable" airport requirements apply for weather planning.
                    </div>
                </div>

                <div className="bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-center p-8 relative overflow-hidden">
                    {/* Airport Center */}
                    <div className="relative z-10 w-full aspect-square max-w-[400px] flex items-center justify-center">
                        <div className="absolute inset-0 border border-slate-700 rounded-full"></div>
                        <div className="absolute inset-[25%] border border-slate-700 rounded-full border-dashed opacity-50"></div>

                        {/* Dynamic Range Circle */}
                        <div
                            className="absolute rounded-full bg-indigo-500/10 border-2 border-indigo-500 transition-all duration-500 flex items-center justify-center"
                            style={{
                                width: `${(time / 330) * 100}%`,
                                height: `${(time / 330) * 100}%`
                            }}
                        >
                            <span className="text-xs font-bold text-indigo-300 bg-slate-900/90 px-2 py-1 rounded">
                                {Math.round(distance)} NM
                            </span>
                        </div>

                        {/* Center Point */}
                        <div className="w-4 h-4 bg-white rounded-full relative z-20 shadow-[0_0_15px_white]">
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white whitespace-nowrap">ADEQUATE AERODROME</div>
                        </div>
                    </div>

                    <div className="absolute top-4 right-4 text-indigo-400 opacity-50">
                        <MapIcon size={120} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// -------------------------------------------------------------------------
// Polar Ops Module
// -------------------------------------------------------------------------
const PolarOpsModule = () => (
    <div className="animate-in fade-in slide-in-from-left-4 duration-500 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Polar Operations</h2>

        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-bold text-teal-400 mb-4 flex items-center gap-2">
                    <Compass size={20} /> Magnetic Unreliability
                </h3>
                <p className="text-slate-300 text-sm mb-4">
                    Near the magnetic poles, magnetic compasses are useless due to the steep dip angle of flux lines.
                </p>
                <div className="space-y-3">
                    <div className="bg-slate-800 p-3 rounded-lg border-l-4 border-teal-500">
                        <span className="text-xs font-bold text-slate-400 uppercase">Requirement 1</span>
                        <p className="font-bold text-white">Grid Navigation</p>
                        <p className="text-xs text-slate-400">Use of Grid Heading instead of Magnetic Heading.</p>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-lg border-l-4 border-teal-500">
                        <span className="text-xs font-bold text-slate-400 uppercase">Requirement 2</span>
                        <p className="font-bold text-white">True Heading Reference</p>
                        <p className="text-xs text-slate-400">IRS/GPS operate in True North mode.</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-bold text-orange-400 mb-4 flex items-center gap-2">
                    <AlertTriangle size={20} /> Specific Hazards
                </h3>
                <ul className="space-y-3">
                    <HazardItem
                        title="Fuel Freezing"
                        desc="Extremely low temps (-60°C or less). Fuel temp checks mandatory using ASTM freeze points."
                    />
                    <HazardItem
                        title="Solar Radiation"
                        desc="Higher exposure to cosmic radiation at poles. Monitoring required."
                    />
                    <HazardItem
                        title="Communication"
                        desc="VHF/SATCOM gaps. HF often required, but subject to interference."
                    />
                </ul>
            </div>
        </div>

        <div className="mt-6 bg-slate-900 p-6 rounded-xl border border-slate-700 flex items-center justify-between">
            <div>
                <h3 className="font-bold text-white text-lg">Special Maintenance Equipment</h3>
                <p className="text-slate-400 text-sm max-w-lg">
                    In case of diversion to a remote polar aerodrome, aircraft must carry specific cold-weather gear for passengers (parkas, boots) if ground support is limited.
                </p>
            </div>
            <div className="text-4xl">❄️</div>
        </div>
    </div>
);

// Helper Components
const RequirementItem = ({ label, desc, check }: { label: string, desc: string, check?: boolean }) => (
    <div className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg">
        <div className={`mt-1 w-5 h-5 rounded flex items-center justify-center ${check ? 'bg-green-500/20 text-green-500' : 'bg-slate-700'}`}>
            {check && "✓"}
        </div>
        <div>
            <div className="font-bold text-sm text-white">{label}</div>
            <div className="text-xs text-slate-400">{desc}</div>
        </div>
    </div>
);

const HazardItem = ({ title, desc }: { title: string, desc: string }) => (
    <li className="flex gap-3">
        <div className="mt-1 min-w-[6px] h-[6px] rounded-full bg-orange-500"></div>
        <div>
            <span className="block font-bold text-white text-sm">{title}</span>
            <span className="text-xs text-slate-400">{desc}</span>
        </div>
    </li>
);

export default LongRangeOps;
