import React, { useState } from 'react';
import { View } from '../../types';
import { ArrowLeft, Users, Zap, UserPlus, UserMinus, Shield, Target, Award, Heart } from 'lucide-react';

interface Props {
    onNavigate: (view: View) => void;
}

const HPLCooperation: React.FC<Props> = ({ onNavigate }) => {
    const [crewSize, setCrewSize] = useState(2);
    const [cohesion, setCohesion] = useState(50); // 0-100
    const [leadership, setLeadership] = useState<'authoritarian' | 'laissez-faire' | 'synergistic'>('synergistic');

    // Calculate "Effective Output" based on crew size, cohesion, and leadership
    const calculateOutput = () => {
        let baseOutput = crewSize * 10;
        let synergyBonus = 0;

        if (leadership === 'synergistic') {
            // Synergy: The whole is greater than the sum
            synergyBonus = (cohesion / 100) * (crewSize * 5); // Up to 50% boost per person
        } else if (leadership === 'authoritarian') {
            // Stifle inputs
            synergyBonus = - (crewSize * 2); // Negative impact
        } else {
            // Laissez-faire: Social Loafing
            synergyBonus = - (crewSize * 3); // Significant drag
        }

        return Math.max(0, baseOutput + synergyBonus);
    };

    const output = calculateOutput();
    const maxPotential = (crewSize * 10) + (crewSize * 5); // Ideal synergistic output

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => onNavigate(View.SYLLABUS_VIEWER)}
                    className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Cooperation & Synergy</h1>
                    <p className="text-slate-400">040.03.04.03 Group Dynamics & Crew Coordination</p>
                </div>
            </div>

            {/* Synergy Simulator */}
            <div className="glass-card p-8 rounded-2xl border border-slate-700 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Users className="text-purple-400" />
                    Crew Synergy Simulator
                </h2>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Controls */}
                    <div className="space-y-8">
                        {/* Crew Size */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-bold text-slate-300">Crew Size</label>
                                <span className="text-purple-400 font-mono font-bold text-xl">{crewSize} Pilots</span>
                            </div>
                            <input
                                type="range" min="1" max="4" step="1"
                                value={crewSize} onChange={(e) => setCrewSize(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                            <p className="text-xs text-slate-500 mt-1">Multi-crew cooperation is required for AC &gt; 5700kg or &gt; 9 pax.</p>
                        </div>

                        {/* Cohesion */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-bold text-slate-300">Group Cohesion</label>
                                <span className="text-emerald-400 font-mono font-bold text-xl">{cohesion}%</span>
                            </div>
                            <input
                                type="range" min="0" max="100" step="10"
                                value={cohesion} onChange={(e) => setCohesion(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <p className="text-xs text-slate-500 mt-1">Shared goals, mutual respect, and standardized procedures (SOPs).</p>
                        </div>

                        {/* Leadership Style */}
                        <div>
                            <label className="text-sm font-bold text-slate-300 mb-3 block">Leadership Style</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => setLeadership('authoritarian')}
                                    className={`p-3 rounded-lg border text-xs font-bold transition-all ${leadership === 'authoritarian' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-slate-900 border-slate-700 text-slate-500'}`}
                                >
                                    Authoritarian
                                </button>
                                <button
                                    onClick={() => setLeadership('laissez-faire')}
                                    className={`p-3 rounded-lg border text-xs font-bold transition-all ${leadership === 'laissez-faire' ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-slate-900 border-slate-700 text-slate-500'}`}
                                >
                                    Laissez-Faire
                                </button>
                                <button
                                    onClick={() => setLeadership('synergistic')}
                                    className={`p-3 rounded-lg border text-xs font-bold transition-all ${leadership === 'synergistic' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-slate-900 border-slate-700 text-slate-500'}`}
                                >
                                    Synergistic
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Output Visualization */}
                    <div className="flex flex-col items-center justify-center bg-slate-900/50 rounded-xl p-6 border border-slate-800 relative">
                        {/* Equation */}
                        <div className="text-4xl font-black text-white mb-2 flex items-center gap-4">
                            <span>1 + 1</span>
                            {leadership === 'synergistic' && cohesion > 60 ? (
                                <span className="text-emerald-400 text-5xl">&gt;</span>
                            ) : (
                                <span className="text-red-400 text-5xl">&lt;</span>
                            )}
                            <span className={leadership === 'synergistic' && cohesion > 60 ? 'text-emerald-400' : 'text-red-400'}>2</span>
                        </div>
                        <p className="text-slate-400 font-mono mb-8 uppercase tracking-widest text-sm">
                            {leadership === 'synergistic' && cohesion > 60 ? 'POSITIVE SYNERGY' : 'PROCESS LOSS'}
                        </p>

                        {/* Bars */}
                        <div className="w-full space-y-4">
                            <div>
                                <div className="flex justify-between text-xs text-slate-400 mb-1">
                                    <span>Individual Potential (Sum)</span>
                                    <span>{crewSize * 10} units</span>
                                </div>
                                <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: `${((crewSize * 10) / maxPotential) * 100}%` }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-xs text-slate-400 mb-1">
                                    <span>Actual Team Output</span>
                                    <span className={output > (crewSize * 10) ? 'text-emerald-400' : 'text-red-400'}>{output.toFixed(1)} units</span>
                                </div>
                                <div className="h-4 bg-slate-700 rounded-full overflow-hidden relative">
                                    {/* Base */}
                                    <div className="h-full bg-blue-500 absolute top-0 left-0 transition-all duration-500" style={{ width: `${Math.min(100, (Math.min(output, crewSize * 10) / maxPotential) * 100)}%` }}></div>
                                    {/* Bonus/Loss */}
                                    {output > (crewSize * 10) && (
                                        <div className="h-full bg-emerald-500 absolute top-0 transition-all duration-500" style={{ left: `${((crewSize * 10) / maxPotential) * 100}%`, width: `${((output - (crewSize * 10)) / maxPotential) * 100}%` }}></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Concepts Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-purple-500/50 transition-colors group">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                        <UserPlus size={24} />
                    </div>
                    <h3 className="font-bold text-white mb-2">Social Facilitation</h3>
                    <p className="text-slate-400 text-sm">
                        Performance <strong>improves</strong> in the presence of others for simple, well-learned tasks.
                        <br /><span className="text-xs text-slate-500 mt-2 block">(Doing a checklist better because someone is watching)</span>
                    </p>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-purple-500/50 transition-colors group">
                    <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 mb-4 group-hover:scale-110 transition-transform">
                        <UserMinus size={24} />
                    </div>
                    <h3 className="font-bold text-white mb-2">Social Loafing</h3>
                    <p className="text-slate-400 text-sm">
                        Individuals exert <strong>less effort</strong> when working in a group compared to working alone.
                        <br /><span className="text-xs text-slate-500 mt-2 block">(Assuming the other pilot will catch the error)</span>
                    </p>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-purple-500/50 transition-colors group">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                        <Heart size={24} />
                    </div>
                    <h3 className="font-bold text-white mb-2">Cohesion & Groupthink</h3>
                    <p className="text-slate-400 text-sm">
                        High cohesion is good, but <strong>too much</strong> can lead to Groupthink (preserving harmony over safety).
                        <br /><span className="text-xs text-slate-500 mt-2 block">(Not challenging the Captain to avoid conflict)</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HPLCooperation;
