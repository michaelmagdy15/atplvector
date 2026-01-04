
import React, { useState } from 'react';
import { Bot, AlertOctagon, Monitor, Zap } from 'lucide-react';

const HPLAutomation: React.FC = () => {
    const [tab, setTab] = useState<'levels' | 'irony' | 'complacency'>('levels');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Bot className="text-cyan-400" />
                        Automation & Philosophy (040.03)
                    </h2>
                    <p className="text-slate-400 text-sm">Levels of Automation, Complacency, and Mode Confusion.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setTab('levels')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'levels' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}>Levels</button>
                    <button onClick={() => setTab('irony')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'irony' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}>Irony of Auto</button>
                    <button onClick={() => setTab('complacency')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'complacency' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}>Complacency</button>
                </div>
            </div>

            {tab === 'levels' && <AutomationLevels />}
            {tab === 'irony' && <IronyOfAutomation />}
            {tab === 'complacency' && <Complacency />}
        </div>
    );
};

const AutomationLevels = () => {
    const levels = [
        { lvl: 'Basic', title: 'Manual Flight', desc: 'No automation. Pilot flies hands-on. High workload.', color: 'border-slate-500' },
        { lvl: 'Assisted', title: 'Flight Director', desc: 'Computer computes path, Pilot flies to follow FD cues.', color: 'border-blue-500' },
        { lvl: 'Auto', title: 'Autopilot (Basic)', desc: 'Holds Heading/Altitude. Pilot monitors.', color: 'border-indigo-500' },
        { lvl: 'Mgmt', title: 'LNAV / VNAV', desc: 'FMS manages path. Complex modes.', color: 'border-purple-500' },
        { lvl: 'Full', title: 'Autoland', desc: 'System manages flare, rollout. Pilot monitors failures.', color: 'border-emerald-500' },
    ];

    return (
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
            <div className="space-y-4">
                <h3 className="font-bold text-white">Levels of Automation</h3>
                {levels.map((l, i) => (
                    <div key={i} className={`bg-slate-900 p-4 rounded-lg border-l-4 ${l.color}`}>
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="font-bold text-white text-sm">{l.title}</h4>
                            <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400">{l.lvl}</span>
                        </div>
                        <p className="text-xs text-slate-400">{l.desc}</p>
                    </div>
                ))}
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4">Mode Confusion</h3>
                <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-lg mb-6">
                    <div className="flex items-start gap-3">
                        <AlertOctagon className="text-red-500 shrink-0" />
                        <div>
                            <h4 className="text-red-400 font-bold text-sm">"What is it doing now?"</h4>
                            <p className="text-xs text-red-200 mt-1">
                                The most common question in modern cockpits. Occurs when the pilot believes the automation is in one mode, but it is actually in another.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase">Golden Rules</p>
                    <div className="bg-slate-800 p-3 rounded text-sm text-slate-300">
                        1. Fly the aircraft (Aviate).
                    </div>
                    <div className="bg-slate-800 p-3 rounded text-sm text-slate-300">
                        2. Monitor the FMA (Flight Mode Annunciator).
                    </div>
                    <div className="bg-slate-800 p-3 rounded text-sm text-slate-300">
                        3. If confused, <strong>Click It Off</strong> (Revert to manual).
                    </div>
                </div>
            </div>
        </div>
    );
};

const IronyOfAutomation = () => (
    <div className="animate-in fade-in space-y-6">
        <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">The Irony of Automation</h3>
            <p className="text-slate-400 text-sm italic mb-8">Lisanne Bainbridge (1983)</p>

            <div className="grid md:grid-cols-2 gap-8 text-left">
                <div className="bg-slate-800 p-6 rounded-lg">
                    <h4 className="text-emerald-400 font-bold mb-2">Promise</h4>
                    <p className="text-sm text-slate-300">
                        Automation is designed to reduce pilot workload and errors.
                    </p>
                </div>
                <div className="bg-slate-800 p-6 rounded-lg">
                    <h4 className="text-red-400 font-bold mb-2">Reality (The Irony)</h4>
                    <p className="text-sm text-slate-300">
                        Automation reduces workload when it is already low (Cruise), but <strong>increases</strong> workload when it is already high (Emergencies / Reprogramming).
                    </p>
                </div>
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                <h4 className="font-bold text-white text-sm">Skill Fade</h4>
                <p className="text-xs text-slate-400 mt-2">Manual flying skills degrade due to lack of practice.</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                <h4 className="font-bold text-white text-sm">Out-of-the-Loop</h4>
                <p className="text-xs text-slate-400 mt-2">Reduced situational awareness because the pilot is not actively controlling the loop.</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                <h4 className="font-bold text-white text-sm">False Security</h4>
                <p className="text-xs text-slate-400 mt-2">Over-reliance on the system. "It knows better".</p>
            </div>
        </div>
    </div>
);

const Complacency = () => (
    <div className="animate-in fade-in grid md:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Monitor className="text-orange-400" /> System Monitoring
            </h3>
            <p className="text-sm text-slate-300 mb-6">
                Humans are terrible monitors of highly reliable systems. We get bored.
            </p>

            <div className="bg-black p-4 rounded border border-slate-800 font-mono text-green-500 text-sm mb-4">
                <div className="flex justify-between border-b border-green-900/50 pb-2 mb-2">
                    <span>A/THR</span>
                    <span>CMD 1</span>
                    <span>NAV</span>
                </div>
                <div className="text-center py-4 opacity-50">
                    ... SYSTEM NORMAL ...
                </div>
            </div>
            <p className="text-xs text-slate-500 italic">
                If the system works 99.9% of the time, the pilot stops checking (Complacency). When it finally fails, the pilot is surprised (Startle Effect).
            </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-4">Fight Complacency</h3>
            <ul className="space-y-3">
                <li className="flex items-start gap-2">
                    <Zap size={16} className="text-yellow-400 mt-1" />
                    <p className="text-xs text-slate-300"><strong>Active Monitoring:</strong> Force yourself to scan FMA changes call them out loud.</p>
                </li>
                <li className="flex items-start gap-2">
                    <Zap size={16} className="text-yellow-400 mt-1" />
                    <p className="text-xs text-slate-300"><strong>Mental Shadowing:</strong> "What would I do if I were flying manual right now?"</p>
                </li>
                <li className="flex items-start gap-2">
                    <Zap size={16} className="text-yellow-400 mt-1" />
                    <p className="text-xs text-slate-300"><strong>Keep Skills Sharp:</strong> Fly manual when safe/permitted (Day VMC).</p>
                </li>
                <li className="flex items-start gap-2">
                    <Zap size={16} className="text-yellow-400 mt-1" />
                    <p className="text-xs text-slate-300"><strong>Expect Failure:</strong> Always have an escape plan.</p>
                </li>
            </ul>
        </div>
    </div>
);

export default HPLAutomation;
