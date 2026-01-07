import React, { useState } from 'react';
import { View } from '../../types';
import { ArrowLeft, Brain, Users, Radio, Activity, MessageSquare, CheckCircle, Target, Shield, BookOpen } from 'lucide-react';

interface Props {
    onNavigate: (view: View) => void;
}

const HPLCompetency: React.FC<Props> = ({ onNavigate }) => {
    const [selectedCompetency, setSelectedCompetency] = useState<number | null>(null);

    const competencies = [
        {
            id: 1,
            title: "Application of Procedures",
            icon: <BookOpen size={32} />,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            description: "Identifies and applies procedures in accordance with published operating instructions and applicable regulations.",
            ksa: {
                knowledge: "SOPs, Regulations, Systems",
                skills: "Checklist discipline, Compliance",
                attitude: "Rigor, Adherence to rules"
            }
        },
        {
            id: 2,
            title: "Communication",
            icon: <MessageSquare size={32} />,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            description: "Demonstrates effective oral, non-verbal and written communications, in normal and non-normal situations.",
            ksa: {
                knowledge: "Language proficiency, Standard phraseology",
                skills: "Active listening, Assertiveness",
                attitude: "Openness to feedback"
            }
        },
        {
            id: 3,
            title: "FPM - Automation",
            icon: <Radio size={32} />,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
            description: "Controls the aircraft flight path through automation, including appropriate use of flight management systems.",
            ksa: {
                knowledge: "Automation modes, Systems logic",
                skills: "Mode selection, Monitoring",
                attitude: "Trust but verify"
            }
        },
        {
            id: 4,
            title: "FPM - Manual Control",
            icon: <Activity size={32} />,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
            border: "border-amber-500/20",
            description: "Controls the aircraft flight path through manual flight, including appropriate use of flight control systems.",
            ksa: {
                knowledge: "Aerodynamics, Aircraft limits",
                skills: "Hand-eye coordination, Smooth inputs",
                attitude: "Confidence, Precision"
            }
        },
        {
            id: 5,
            title: "Leadership & Teamwork",
            icon: <Users size={32} />,
            color: "text-rose-400",
            bg: "bg-rose-500/10",
            border: "border-rose-500/20",
            description: "Demonstrates effective leadership and team working.",
            ksa: {
                knowledge: "CRM principles, Group dynamics",
                skills: "Delegation, Conflict resolution",
                attitude: "Empathy, Integrity"
            }
        },
        {
            id: 6,
            title: "Problem Solving & Decision Making",
            icon: <Brain size={32} />,
            color: "text-indigo-400",
            bg: "bg-indigo-500/10",
            border: "border-indigo-500/20",
            description: "Accurately identifies risks and resolves problems. Uses the appropriate decision-making processes.",
            ksa: {
                knowledge: "Decision models (DODAR, FOR-DEC)",
                skills: "Risk assessment, Critical thinking",
                attitude: "Decisiveness, Calmness"
            }
        },
        {
            id: 7,
            title: "Situation Awareness",
            icon: <Target size={32} />,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10",
            border: "border-cyan-500/20",
            description: "Perceives and comprehends all of the relevant information regarding the aircraft and its environment.",
            ksa: {
                knowledge: "Environment, Systems status",
                skills: "Scanning, Projection (Thinking ahead)",
                attitude: "Vigilance, Curiosity"
            }
        },
        {
            id: 8,
            title: "Workload Management",
            icon: <Shield size={32} />,
            color: "text-orange-400",
            bg: "bg-orange-500/10",
            border: "border-orange-500/20",
            description: "Manages available resources effectively to prioritize and perform tasks in a timely manner.",
            ksa: {
                knowledge: "Task prioritization, Stress limits",
                skills: "Time management, Task shedding",
                attitude: "Self-discipline, Organization"
            }
        }
    ];

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
                    <h1 className="text-3xl font-black text-white tracking-tight">ICAO Core Competencies</h1>
                    <p className="text-slate-400">040.01.01.01 Becoming a competent pilot</p>
                </div>
            </div>

            {/* Intro KSA Section */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                    { l: 'K', t: 'Knowledge', d: 'What you know', c: 'from-blue-500 to-indigo-500' },
                    { l: 'S', t: 'Skills', d: 'What you can do', c: 'from-emerald-500 to-teal-500' },
                    { l: 'A', t: 'Attitude', d: 'How you think & feel', c: 'from-amber-500 to-orange-500' }
                ].map((item, idx) => (
                    <div key={idx} className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.c} opacity-10 rounded-full blur-2xl -mr-8 -mt-8`}></div>
                        <div className="text-5xl font-black text-white/10 absolute bottom-4 right-4 group-hover:scale-110 transition-transform">{item.l}</div>
                        <h3 className="text-xl font-bold text-white mb-2">{item.t}</h3>
                        <p className="text-slate-400 text-sm">{item.d}</p>
                    </div>
                ))}
            </div>

            {/* Interactive Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {competencies.map((comp) => (
                    <button
                        key={comp.id}
                        onClick={() => setSelectedCompetency(comp.id)}
                        className={`
                            relative p-6 rounded-2xl border text-left transition-all duration-300 group
                            ${selectedCompetency === comp.id
                                ? `${comp.bg} ${comp.border} ring-1 ring-white/20 scale-[1.02] shadow-xl`
                                : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                            }
                        `}
                    >
                        <div className={`${comp.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                            {comp.icon}
                        </div>
                        <h3 className="text-lg font-bold text-slate-200 mb-2 leading-tight">{comp.title}</h3>
                        <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${selectedCompetency === comp.id ? 'from-white to-transparent' : 'from-slate-700 to-transparent'}`}></div>
                    </button>
                ))}
            </div>

            {/* Detail View */}
            {selectedCompetency && (
                <div className="glass-card rounded-2xl p-8 border border-slate-700 animate-in slide-in-from-bottom-4 duration-500">
                    {(() => {
                        const comp = competencies.find(c => c.id === selectedCompetency)!;
                        return (
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="md:w-1/3">
                                    <h2 className={`text-3xl font-black ${comp.color} mb-4`}>{comp.title}</h2>
                                    <p className="text-slate-300 text-lg leading-relaxed mb-6">{comp.description}</p>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                        <CheckCircle size={16} />
                                        <span>Click another card to switch</span>
                                    </div>
                                </div>
                                <div className="md:w-2/3 grid gap-4">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Components of Competence</h3>
                                    <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800 flex items-start gap-4">
                                        <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400 font-bold shrink-0">KW</div>
                                        <div>
                                            <h4 className="text-white font-bold mb-1">Knowledge</h4>
                                            <p className="text-slate-400">{comp.ksa.knowledge}</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800 flex items-start gap-4">
                                        <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400 font-bold shrink-0">SK</div>
                                        <div>
                                            <h4 className="text-white font-bold mb-1">Skills</h4>
                                            <p className="text-slate-400">{comp.ksa.skills}</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800 flex items-start gap-4">
                                        <div className="bg-amber-500/20 p-2 rounded-lg text-amber-400 font-bold shrink-0">AT</div>
                                        <div>
                                            <h4 className="text-white font-bold mb-1">Attitude</h4>
                                            <p className="text-slate-400">{comp.ksa.attitude}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}
        </div>
    );
};

export default HPLCompetency;
