
import React, { useState } from 'react';
import { Users, CheckSquare, Layers, AlertOctagon, TrendingUp, MessageSquare } from 'lucide-react';

const CockpitManagement: React.FC = () => {
    const [tab, setTab] = useState<'crm' | 'group' | 'sops'>('crm');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Users className="text-sky-400" />
                        Cockpit Management & CRM (040.03.04)
                    </h2>
                    <p className="text-slate-400 text-sm">Teamwork, Synergy, Group Dynamics, and SOPs.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setTab('crm')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'crm' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}>Synergy & CRM</button>
                    <button onClick={() => setTab('group')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'group' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}>Group Dynamics</button>
                    <button onClick={() => setTab('sops')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'sops' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}>SOPs & Checklists</button>
                </div>
            </div>

            {tab === 'crm' && <SynergyLab />}
            {tab === 'group' && <GroupDynamics />}
            {tab === 'sops' && <SopTrainer />}
        </div>
    );
};

// 040.03.04.03 Cooperation - Synergy
const SynergyLab = () => {
    const [quality, setQuality] = useState(50); // CRM Quality 0-100

    // Synergy calculation: 
    // Low CRM = Interference (1+1 < 2)
    // High CRM = Synergy (1+1 > 2)
    const pilot1 = 100;
    const pilot2 = 100;
    const synergyFactor = (quality - 50) / 50; // -1 to +1
    
    // Resultant effective output
    // Base is 200. Max Synergy 250. Max Interference 150.
    const output = (pilot1 + pilot2) + (synergyFactor * 50);
    
    const getStatus = () => {
        if (output > 210) return { label: 'SYNERGY (1+1>2)', color: 'text-emerald-400' };
        if (output < 190) return { label: 'INTERFERENCE (1+1<2)', color: 'text-red-400' };
        return { label: 'Neutral', color: 'text-slate-400' };
    };

    const status = getStatus();

    return (
        <div className="animate-in fade-in">
            <h3 className="text-xl font-bold text-white mb-6">The Synergy Concept</h3>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                    <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                        <label className="flex justify-between text-slate-400 text-sm mb-4">
                            <span>Communication Quality</span>
                            <span className="text-white font-bold">{quality}%</span>
                        </label>
                        <input 
                            type="range" min="0" max="100" 
                            value={quality} onChange={e => setQuality(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-2 uppercase font-bold">
                            <span>Conflict</span>
                            <span>Cooperation</span>
                        </div>
                    </div>

                    <div className="bg-slate-800 p-4 rounded text-sm text-slate-300">
                        <strong>Defintion:</strong> Synergy is the interaction of two or more agents so that their combined effect is greater than the sum of their individual effects.
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 flex flex-col items-center">
                    <div className="flex gap-2 items-end mb-4 h-32">
                        <div className="w-16 bg-slate-600 rounded-t flex items-end justify-center pb-2 text-white font-bold text-xs" style={{ height: '40%' }}>P1</div>
                        <div className="text-slate-500 font-black text-xl mb-4">+</div>
                        <div className="w-16 bg-slate-600 rounded-t flex items-end justify-center pb-2 text-white font-bold text-xs" style={{ height: '40%' }}>P2</div>
                        <div className="text-slate-500 font-black text-xl mb-4">=</div>
                        <div 
                            className={`w-24 rounded-t flex items-end justify-center pb-2 text-white font-bold text-lg transition-all duration-300 ${output > 200 ? 'bg-emerald-500' : output < 200 ? 'bg-red-500' : 'bg-blue-500'}`} 
                            style={{ height: `${(output/250)*80}%` }}
                        >
                            {Math.round(output)}
                        </div>
                    </div>
                    <div className={`text-xl font-black ${status.color} transition-colors`}>{status.label}</div>
                </div>
            </div>
        </div>
    );
};

// 040.03.04.03 Cooperation - Group Dynamics
const GroupDynamics = () => {
    const [risk, setRisk] = useState(30);
    const [shiftedRisk, setShiftedRisk] = useState(30);

    const applyRiskyShift = () => {
        // Risky Shift: Groups tend to make riskier decisions than individuals
        // If initial risk > 50 (already risky), group pushes to 80+
        // If initial risk < 50 (cautious), group might push slightly safer (Cautious Shift), but Risky Shift is more common in exams.
        
        let shift = 0;
        if (risk > 40) shift = 25; // Push riskier
        else shift = -10; // Push safer (Cautious shift)
        
        setShiftedRisk(Math.min(100, Math.max(0, risk + shift)));
    };

    return (
        <div className="animate-in fade-in space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Risky Shift */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="text-orange-400" /> The "Risky Shift"
                    </h4>
                    <p className="text-xs text-slate-400 mb-6">
                        The tendency for a group to make decisions that are more extreme than the initial inclination of its members.
                    </p>

                    <div className="space-y-6">
                        <div>
                            <label className="text-xs text-slate-400 uppercase font-bold block mb-2">Individual Risk Appetite</label>
                            <input 
                                type="range" min="0" max="100" 
                                value={risk} onChange={e => { setRisk(Number(e.target.value)); setShiftedRisk(Number(e.target.value)); }}
                                className="w-full h-2 bg-slate-700 rounded-lg accent-slate-400"
                            />
                        </div>

                        <div className="flex justify-center">
                            <button 
                                onClick={applyRiskyShift}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors"
                            >
                                Discuss in Group
                            </button>
                        </div>

                        <div>
                            <label className="text-xs text-slate-400 uppercase font-bold block mb-2">Group Decision</label>
                            <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                    className={`absolute top-0 bottom-0 w-2 bg-white transition-all duration-500`}
                                    style={{ left: `${risk}%`, opacity: 0.5 }}
                                ></div>
                                <div 
                                    className={`absolute top-0 bottom-0 w-full transition-all duration-700 ${shiftedRisk > risk ? 'bg-orange-500' : 'bg-emerald-500'}`}
                                    style={{ width: `${shiftedRisk}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                <span>Safe</span>
                                <span>Risky</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Groupthink */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                        <AlertOctagon className="text-red-400" /> Groupthink
                    </h4>
                    <p className="text-xs text-slate-400 mb-4">
                        A desire for harmony or conformity results in irrational or dysfunctional decision-making.
                    </p>
                    
                    <div className="space-y-2">
                        {[
                            { title: 'Illusion of Invulnerability', desc: 'Excessive optimism encouraging risk.' },
                            { title: 'Rationalization', desc: 'Ignoring warnings or data.' },
                            { title: 'Illusion of Morality', desc: 'Believing the group is ethically right.' },
                            { title: 'Pressure to Conform', desc: 'Suppressing dissenting views.' }
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-800 p-3 rounded border border-slate-600 hover:border-red-500 transition-colors cursor-help group">
                                <span className="font-bold text-slate-200 text-sm">{item.title}</span>
                                <p className="text-xs text-slate-500 mt-1 group-hover:text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 040.03.04 Checklists & SOPs
const SopTrainer = () => {
    const [method, setMethod] = useState<'read-do' | 'challenge'>('read-do');

    return (
        <div className="animate-in fade-in">
            <h3 className="text-xl font-bold text-white mb-6">Checklist Philosophies</h3>
            
            <div className="flex justify-center gap-4 mb-8">
                <button 
                    onClick={() => setMethod('read-do')}
                    className={`px-6 py-3 rounded-lg font-bold border-2 transition-all ${method === 'read-do' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                >
                    Read-Do
                </button>
                <button 
                    onClick={() => setMethod('challenge')}
                    className={`px-6 py-3 rounded-lg font-bold border-2 transition-all ${method === 'challenge' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                >
                    Challenge-Response
                </button>
            </div>

            <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 max-w-2xl mx-auto">
                {method === 'read-do' ? (
                    <div className="animate-in slide-in-from-left-4">
                        <h4 className="text-lg font-bold text-white mb-2">Read-Do Method</h4>
                        <p className="text-sm text-slate-400 mb-6">
                            Used for non-normal situations or when not in a critical phase. 
                            <strong> Read the item, then Do the action.</strong>
                        </p>
                        <div className="bg-slate-800 p-4 rounded font-mono text-sm text-yellow-400 border-l-4 border-yellow-500">
                            1. READ: "Landing Gear... Down"<br/>
                            2. ACTION: Select Gear Down<br/>
                            3. VERIFY: 3 Greens<br/>
                            4. COMPLETE.
                        </div>
                    </div>
                ) : (
                    <div className="animate-in slide-in-from-right-4">
                        <h4 className="text-lg font-bold text-white mb-2">Challenge-Response</h4>
                        <p className="text-sm text-slate-400 mb-6">
                            Used for normal operations (checklists). 
                            <strong> Actions are done from memory (flow), then verified.</strong>
                        </p>
                        <div className="grid grid-cols-2 gap-4 bg-slate-800 p-4 rounded font-mono text-sm border-l-4 border-emerald-500">
                            <div className="text-right text-sky-400 pr-4 border-r border-slate-600">
                                <span className="block text-[10px] text-slate-500">PM (Pilot Monitoring)</span>
                                "Landing Gear"
                            </div>
                            <div className="text-left text-white pl-4">
                                <span className="block text-[10px] text-slate-500">PF (Pilot Flying)</span>
                                "Down, 3 Greens"
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CockpitManagement;
