import React, { useState } from 'react';
import { Briefcase, FileText, CheckSquare, ShieldAlert, Book, Fuel, Ruler, Wind, GraduationCap, FileCheck, Shield, Plane, Map, Users } from 'lucide-react';
import OpsManualVisualizer from './OpsModules/OpsManualVisualizer';
import FuelPlanning from './OpsModules/FuelPlanning';
import MinimaCalculator from './OpsModules/MinimaCalculator';
import OxygenRequirements from './OpsModules/OxygenRequirements';
import TrainingTracker from './OpsModules/TrainingTracker';
import DocumentsAndReporting from './OpsModules/DocumentsAndReporting';
import EmergencyEquipmentGuide from './OpsModules/EmergencyEquipmentGuide';
import ApproachCategoriesVisualizer from './OpsModules/ApproachCategoriesVisualizer';
import AlternatePlanningTool from './OpsModules/AlternatePlanningTool';
import CrewDutyPositions from './OpsModules/CrewDutyPositions';

const OpsGeneral: React.FC = () => {
    const [tab, setTab] = useState('intro');

    const tabs = [
        { id: 'intro', label: 'Manual & Org', icon: Book },
        { id: 'crew', label: 'Crew', icon: Users },
        { id: 'docs', label: 'Documents', icon: FileCheck },
        { id: 'mel', label: 'MEL', icon: FileText },
        { id: 'fuel', label: 'Fuel Policy', icon: Fuel },
        { id: 'alt', label: 'Alternates', icon: Map },
        { id: 'minima', label: 'Minima', icon: Ruler },
        { id: 'approach', label: 'Approach Cat', icon: Plane },
        { id: 'eqp', label: 'Instruments', icon: CheckSquare },
        { id: 'emergency', label: 'Emergency Eqp', icon: Shield },
        { id: 'oxy', label: 'Oxygen', icon: Wind },
        { id: 'train', label: 'Training', icon: GraduationCap },
        { id: 'misc', label: 'Safety', icon: ShieldAlert },
    ];

    return (
        <div className="bg-slate-900 min-h-screen text-slate-100 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                        <Briefcase className="text-blue-400 w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Operational Procedures</h1>
                        <p className="text-slate-400">Comprehensive guide to EU-OPS / ICAO Annex 6 requirements.</p>
                    </div>
                </div>

                {/* Scrollable Tab Bar */}
                <div className="mb-8 overflow-x-auto pb-2">
                    <div className="flex gap-2 bg-slate-800/50 p-1.5 rounded-xl w-fit border border-slate-700">
                        {tabs.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className={`px-3 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 whitespace-nowrap ${tab === t.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <t.icon className="w-3.5 h-3.5" />
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm p-6 min-h-[500px]">
                    {tab === 'intro' && <OpsManualVisualizer />}
                    {tab === 'crew' && <CrewDutyPositions />}
                    {tab === 'docs' && <DocumentsAndReporting />}
                    {tab === 'mel' && <MelSimulator />}
                    {tab === 'fuel' && <FuelPlanning />}
                    {tab === 'alt' && <AlternatePlanningTool />}
                    {tab === 'minima' && <MinimaCalculator />}
                    {tab === 'approach' && <ApproachCategoriesVisualizer />}
                    {tab === 'eqp' && <EquipmentGame />}
                    {tab === 'emergency' && <EmergencyEquipmentGuide />}
                    {tab === 'oxy' && <OxygenRequirements />}
                    {tab === 'train' && <TrainingTracker />}
                    {tab === 'misc' && <MiscOps />}
                </div>
            </div>
        </div>
    );
};

// -------------------------------------------------------------------------
// MEL Simulator (Go/No-Go Decision)
// -------------------------------------------------------------------------
const MelSimulator = () => {
    const [failures, setFailures] = useState<string[]>([]);

    const toggleFailure = (id: string) => {
        setFailures(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    };

    const getStatus = () => {
        if (failures.includes('radalt') && failures.includes('gpws')) return { status: 'NO-GO', reason: "Dual Safety System Failure", color: 'red' };
        if (failures.includes('pack_l') && failures.includes('pack_r')) return { status: 'NO-GO', reason: "No Pressurization Capability", color: 'red' };
        if (failures.includes('pack_l')) return { status: 'GO (RESTRICTED)', reason: "FL250 Max due to Single Pack", color: 'orange' };
        if (failures.includes('radalt')) return { status: 'GO', reason: "Cat I Only (No Autoland)", color: 'green' };
        if (failures.includes('ap_1')) return { status: 'GO', reason: "Single Channel Approach Only", color: 'green' };
        if (failures.length === 0) return { status: 'GO', reason: "Aircraft Serviceable", color: 'green' };
        return { status: 'GO', reason: "Refer to MEL for Rectification Interval", color: 'green' };
    };

    const result = getStatus();

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
                <FileText className="w-8 h-8 text-blue-400" />
                <div>
                    <h2 className="text-2xl font-bold text-white">Minimum Equipment List (MEL)</h2>
                    <p className="text-slate-400 text-sm">Go / No-Go Decision Making.</p>
                </div>
            </div>

            <p className="text-slate-400 text-sm mb-6">
                The Master MEL (MMEL) is established by the manufacturer. The Operator's MEL may be <strong>more</strong> restrictive, but never less. Found in Ops Manual Part B.
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

                <div className="space-y-6">
                    <div className={`rounded-xl p-8 border-2 flex flex-col items-center justify-center text-center transition-colors duration-300
                        ${result.color === 'red' ? 'bg-red-950/50 border-red-500' :
                            result.color === 'orange' ? 'bg-orange-950/50 border-orange-500' :
                                'bg-emerald-950/50 border-emerald-500'}`}>
                        <div className="text-5xl font-black text-white mb-2">{result.status}</div>
                        <div className="text-lg opacity-80">{result.reason}</div>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                        <h4 className="font-bold text-white mb-3">Rectification Intervals</h4>
                        <div className="grid grid-cols-4 gap-2 text-center text-sm">
                            <div className="bg-slate-800 p-2 rounded">
                                <div className="font-black text-blue-400">A</div>
                                <div className="text-xs text-slate-400">Specified</div>
                            </div>
                            <div className="bg-slate-800 p-2 rounded">
                                <div className="font-black text-emerald-400">B</div>
                                <div className="text-xs text-slate-400">3 Days</div>
                            </div>
                            <div className="bg-slate-800 p-2 rounded">
                                <div className="font-black text-yellow-400">C</div>
                                <div className="text-xs text-slate-400">10 Days</div>
                            </div>
                            <div className="bg-slate-800 p-2 rounded">
                                <div className="font-black text-orange-400">D</div>
                                <div className="text-xs text-slate-400">120 Days</div>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-3">Starts at midnight that night. Expires 1 minute after midnight on the final day.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// -------------------------------------------------------------------------
// Equipment Game
// -------------------------------------------------------------------------
const EquipmentGame = () => {
    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
                <CheckSquare className="w-8 h-8 text-blue-400" />
                <div>
                    <h2 className="text-2xl font-bold text-white">Mandatory Instruments</h2>
                    <p className="text-slate-400 text-sm">Equipment requirements for VFR/IFR.</p>
                </div>
            </div>

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

            <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4">CVR & FDR Rules</h3>
                    <div className="space-y-4 text-sm">
                        <div>
                            <span className="text-blue-400 font-bold block mb-1">Cockpit Voice Recorder (CVR)</span>
                            <p className="text-slate-400">Records last <strong>2 hours</strong> of audio. Starts before aircraft can move under own power.</p>
                        </div>
                        <div>
                            <span className="text-blue-400 font-bold block mb-1">Flight Data Recorder (FDR)</span>
                            <p className="text-slate-400">Records last <strong>25 hours</strong> of data (10 hrs if &gt;5700kg). Required for all aircraft &gt;5700kg.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4">Special Equipment Requirements</h3>
                    <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex justify-between items-center py-2 border-b border-slate-700">
                            <span>Altitude Alerting System</span>
                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">MCTOM &gt;5700kg & MOPSC &gt;9</span>
                        </li>
                        <li className="flex justify-between items-center py-2 border-b border-slate-700">
                            <span>Weather Radar</span>
                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">If thunderstorms expected or at night</span>
                        </li>
                        <li className="flex justify-between items-center py-2 border-b border-slate-700">
                            <span>PA System</span>
                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">MOPSC &gt;19</span>
                        </li>
                        <li className="flex justify-between items-center py-2">
                            <span>Single Pilot IFR Autopilot</span>
                            <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded">Alt + Heading Hold</span>
                        </li>
                    </ul>
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
// Misc Ops (Safety, Security, Bird Strike)
// -------------------------------------------------------------------------
const MiscOps = () => {
    return (
        <div className="animate-in fade-in slide-in-from-left-4 duration-500 space-y-8">
            <div className="flex items-center gap-3 mb-2">
                <ShieldAlert className="w-8 h-8 text-blue-400" />
                <div>
                    <h2 className="text-2xl font-bold text-white">Occupational Safety</h2>
                    <p className="text-slate-400 text-sm">Reporting, Security, and Hazards.</p>
                </div>
            </div>

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

            {/* Position Lights */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4 text-lg">Navigation Lights</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/30 text-center">
                        <div className="text-3xl mb-2">🔴</div>
                        <div className="font-bold text-white">Port (Left)</div>
                        <div className="text-sm text-slate-400">RED - 110° range</div>
                    </div>
                    <div className="bg-emerald-900/20 p-4 rounded-lg border border-emerald-500/30 text-center">
                        <div className="text-3xl mb-2">🟢</div>
                        <div className="font-bold text-white">Starboard (Right)</div>
                        <div className="text-sm text-slate-400">GREEN - 110° range</div>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-600 text-center">
                        <div className="text-3xl mb-2">⚪</div>
                        <div className="font-bold text-white">Rear (Tail)</div>
                        <div className="text-sm text-slate-400">WHITE - 140° range</div>
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-4">Only required at night. Always steady (not flashing).</p>
            </div>
        </div>
    );
};

export default OpsGeneral;
