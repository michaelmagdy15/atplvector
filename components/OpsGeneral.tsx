import React, { useState } from 'react';
import { Settings, Wrench, ShieldAlert, CheckSquare, Briefcase, FileText } from 'lucide-react';

const OpsGeneral: React.FC = () => {
    const [tab, setTab] = useState<'mel' | 'eqp' | 'misc'>('mel');

    return (
        <div className="bg-slate-900 min-h-screen text-slate-100 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                        <Briefcase className="text-blue-400 w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">General Requirements</h1>
                        <p className="text-slate-400">MEL/CDL, Equipment, and Operational Safety.</p>
                    </div>
                </div>

                <div className="flex gap-2 mb-8 bg-slate-800/50 p-1 rounded-xl w-fit border border-slate-700">
                    <button
                        onClick={() => setTab('mel')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${tab === 'mel' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        MEL Simulator
                    </button>
                    <button
                        onClick={() => setTab('eqp')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${tab === 'eqp' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        Equipment Check
                    </button>
                    <button
                        onClick={() => setTab('misc')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${tab === 'misc' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        Safety & Security
                    </button>
                </div>

                <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm p-6 min-h-[500px]">
                    {tab === 'mel' && <MelSimulator />}
                    {tab === 'eqp' && <EquipmentGame />}
                    {tab === 'misc' && <MiscOps />}
                </div>
            </div>
        </div>
    );
};

// -------------------------------------------------------------------------
// 1. MEL Simulator (Go/No-Go Decision)
// -------------------------------------------------------------------------
const MelSimulator = () => {
    const [failures, setFailures] = useState<string[]>([]);

    const toggleFailure = (id: string) => {
        setFailures(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    };

    const getStatus = () => {
        if (failures.includes('radalt') && failures.includes('gpws')) return { status: 'NO-GO', reason: "Dual Safety System Failure" };
        if (failures.includes('pack_l') && failures.includes('pack_r')) return { status: 'NO-GO', reason: "No Pressurization Capability" };
        if (failures.includes('pack_l')) return { status: 'GO (RESTRICTED)', reason: "FL250 Max due to Single Pack" };
        if (failures.includes('radalt')) return { status: 'GO', reason: "Cat I Only (No Autoland)" };
        if (failures.includes('ap_1')) return { status: 'GO', reason: "Single Channel Approach Only" };
        if (failures.length === 0) return { status: 'GO', reason: "Aircraft Serviceable" };
        return { status: 'GO', reason: "Refer to MEL for Rectification Interval" };
    };

    const result = getStatus();

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <FileText className="text-blue-400" /> Minimum Equipment List (MEL)
            </h2>
            <p className="text-slate-400 text-sm mb-6">
                The Master MEL (MMEL) is established by the manufacturer. The Operator's MEL may be <strong>more</strong> restrictive, but never less.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="font-bold text-white text-sm uppercase">Simulate Failures</h3>
                    {[
                        { id: 'pack_l', label: 'Left Pack Inop' },
                        { id: 'pack_r', label: 'Right Pack Inop' },
                        { id: 'radalt', label: 'Radio Altimeter 1 Fail' },
                        { id: 'gpws', label: 'GPWS Fail' },
                        { id: 'ap_1', label: 'Autopilot Ch A Fail' },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => toggleFailure(item.id)}
                            className={`w-full p-4 rounded-lg border flex justify-between items-center transition-all ${failures.includes(item.id) ? 'bg-red-900/30 border-red-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                        >
                            <span className="font-bold">{item.label}</span>
                            <div className={`w-4 h-4 rounded-full border ${failures.includes(item.id) ? 'bg-red-500 border-red-500' : 'border-slate-600'}`}></div>
                        </button>
                    ))}
                </div>

                <div className={`rounded-xl p-8 border-2 flex flex-col items-center justify-center text-center transition-colors ${result.status === 'NO-GO' ? 'bg-red-950/50 border-red-500' : result.status.includes('RESTRICTED') ? 'bg-orange-950/50 border-orange-500' : 'bg-emerald-950/50 border-emerald-500'}`}>
                    <div className="text-5xl font-black text-white mb-2">{result.status}</div>
                    <div className="text-lg opacity-80">{result.reason}</div>
                    <div className="mt-8 text-xs text-slate-400 border-t border-white/10 pt-4 w-full">
                        Rectification Intervals:<br />
                        A: Specified | B: 3 Days | C: 10 Days | D: 120 Days
                    </div>
                </div>
            </div>
        </div>
    );
};

// -------------------------------------------------------------------------
// 2. Equipment Game
// -------------------------------------------------------------------------
const EquipmentGame = () => {
    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <CheckSquare className="text-blue-400" /> Mandatory Equipment
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
                <EquipmentCard
                    title="VFR Day"
                    items={[
                        "Magnetic Compass", "Timepiece (Watch)", "Altimeter", "Airspeed Indicator"
                    ]}
                />
                <EquipmentCard
                    title="VFR Night"
                    items={[
                        "All VFR Day Items", "Turn & Slip (or Coordinator)", "Position Lights", "Landing Light", "Flashlight"
                    ]}
                    highlight
                />
                <EquipmentCard
                    title="IFR"
                    items={[
                        "All VFR Night Items", "Attitude Indicator (Artificial Horizon)", "Heading Indicator (DI)", "Pitot Heat", "2nd Altimeter"
                    ]}
                    highlight
                />
            </div>

            <div className="mt-8 bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4">CVR & FDR Rules</h3>
                <div className="grid grid-cols-2 gap-8 text-sm">
                    <div>
                        <span className="text-blue-400 font-bold block mb-1">Cockpit Voice Recorder (CVR)</span>
                        <p className="text-slate-400">Records last 2 hours of audio. Mandatory for multi-pilot turbine aircraft &gt; 5700kg.</p>
                    </div>
                    <div>
                        <span className="text-blue-400 font-bold block mb-1">Flight Data Recorder (FDR)</span>
                        <p className="text-slate-400">Records last 25 hours of data. Mandatory for aircraft &gt; 5700kg.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EquipmentCard = ({ title, items, highlight }: { title: string, items: string[], highlight?: boolean }) => (
    <div className={`p-5 rounded-xl border ${highlight ? 'bg-slate-800 border-blue-500/50' : 'bg-slate-900 border-slate-700'}`}>
        <h3 className="font-black text-xl text-white mb-4 border-b border-slate-700 pb-2">{title}</h3>
        <ul className="space-y-2">
            {items.map((it, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    {it}
                </li>
            ))}
        </ul>
    </div>
);

// -------------------------------------------------------------------------
// 3. Misc Ops (Safety, Security, Bird Strike)
// -------------------------------------------------------------------------
const MiscOps = () => {
    return (
        <div className="animate-in fade-in slide-in-from-left-4 duration-500 space-y-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <ShieldAlert className="text-blue-400" /> Operational Safety
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4 text-lg">Bird Strike Risk</h3>
                    <p className="text-sm text-slate-400 mb-4">Most strikes occur below 2,500ft. Greatest risk is "Low & Fast".</p>
                    <div className="space-y-3">
                        <div className="bg-slate-800 p-3 rounded border border-slate-600">
                            <span className="text-xs font-bold text-slate-500 uppercase">Reporting</span>
                            <p className="text-slate-200 text-sm">Commander MUST report any bird strike (confirmed or suspected) to the Authority.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4 text-lg">Security Codes (SSR)</h3>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-red-900/30 p-3 rounded border border-red-500/50 text-center">
                            <div className="text-2xl font-black text-red-500">7500</div>
                            <div className="text-[10px] text-red-300 uppercase mt-1">Hijack</div>
                        </div>
                        <div className="bg-orange-900/30 p-3 rounded border border-orange-500/50 text-center">
                            <div className="text-2xl font-black text-orange-500">7600</div>
                            <div className="text-[10px] text-orange-300 uppercase mt-1">Radio Fail</div>
                        </div>
                        <div className="bg-yellow-900/30 p-3 rounded border border-yellow-500/50 text-center">
                            <div className="text-2xl font-black text-yellow-500">7700</div>
                            <div className="text-[10px] text-yellow-300 uppercase mt-1">Emergency</div>
                        </div>
                    </div>
                    <p className="mt-4 text-xs text-slate-400">
                        In case of unlawful interference (7500), do NOT reply to ATC unless safety is assured. Continue flight profile.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OpsGeneral;
