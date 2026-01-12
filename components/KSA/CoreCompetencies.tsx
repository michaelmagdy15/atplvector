import React, { useState } from 'react';
import { Target, MessageSquare, Users, Brain, Activity, ShieldCheck, Globe, Clock, Check } from 'lucide-react';

const COMPETENCIES = [
    {
        id: 'COMM',
        title: 'Communication',
        icon: MessageSquare,
        color: 'text-blue-400',
        bg: 'bg-blue-500/20',
        description: 'Communicates consistently and effectively through verbal, non-verbal and written means.',
        details: [
            'Ensures recipients are ready and able to receive information.',
            'Selects methods appropriately (verbal, written, visual, non-verbal).',
            'Uses appropriate and standard aviation phraseology.',
            'Asks questions to resolve doubts and checks for understanding.'
        ]
    },
    {
        id: 'LDS',
        title: 'Leadership & Teamwork',
        icon: Users,
        color: 'text-purple-400',
        bg: 'bg-purple-500/20',
        description: 'Demonstrates effective leadership and teamwork to achieve joint goals.',
        details: [
            'Agrees on clear, attainable goals and objectives.',
            'Encourages input and feedback from others.',
            'Intervenes if task safety is compromised.',
            'Demonstrates initiative and decisiveness.'
        ]
    },
    {
        id: 'PSD',
        title: 'Problem Solving',
        icon: Brain,
        color: 'text-amber-400',
        bg: 'bg-amber-500/20',
        description: 'Identifies and assesses accurate information to define a problem and implement a solution.',
        details: [
            'Identifies and verifies why things have gone wrong.',
            'Generates options and assesses risks.',
            'Selects and implements an appropriate solution.',
            'Reviews the outcome.'
        ]
    },
    {
        id: 'SA',
        title: 'Situation Awareness',
        icon: Globe,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/20',
        description: 'Perceives and comprehends all relevant information regarding the flight environment.',
        details: [
            'Monitors the flight path and aircraft systems.',
            'Anticipates future events (Thinking Ahead).',
            'Identifies threats to the safety of the flight.',
            'Maintains a shared mental model.'
        ]
    },
    {
        id: 'WLM',
        title: 'Workload Management',
        icon: Activity,
        color: 'text-red-400',
        bg: 'bg-red-500/20',
        description: 'Maintains available workload capacity by prioritizing and distributing tasks.',
        details: [
            'Plan tasks to prevent overload.',
            'Prioritizes duties: Aviate, Navigate, Communicate.',
            'Recognizes and reports overload.',
            'Delegates tasks effectively.'
        ]
    },
    {
        id: 'APK',
        title: 'App. of Knowledge',
        icon: Target,
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/20',
        description: 'Demonstrates technical knowledge and underpinning understanding.',
        details: [
            'Applies knowledge significantly and accurately.',
            'Operates within the scope of knowledge.',
            'Follows procedures and regulations.',
            'Demonstrates technical skills.'
        ]
    },
    {
        id: 'FPA',
        title: 'Flight Path Auto',
        icon: ShieldCheck,
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/20',
        description: 'Controls the aircraft flight path through automation.',
        details: [
            'Selects appropriate level of automation.',
            'Monitors automation status and modes.',
            'Recovers from automation failures.',
            'Understands automation limitations.'
        ]
    },
    {
        id: 'FPM',
        title: 'Flight Path Manual',
        icon: Clock,
        color: 'text-sky-400',
        bg: 'bg-sky-500/20',
        description: 'Controls the aircraft flight path through manual flight.',
        details: [
            'Maintains desired flight path.',
            'Operates within aircraft limitations.',
            'Controls energy state.',
            'Demonstrates smooth and accurate handling.'
        ]
    },
];

const CoreCompetencies: React.FC = () => {
    const [selectedId, setSelectedId] = useState<string>('SA');

    const activeComp = COMPETENCIES.find(c => c.id === selectedId) || COMPETENCIES[0];

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-indigo-500/20 rounded-xl">
                    <Brain className="w-8 h-8 text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">
                        ICAO <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Core Competencies</span>
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Framework for assessing pilot performance beyond technical skills.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Interactive Selector */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Select Competency</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {COMPETENCIES.map((comp) => (
                                <button
                                    key={comp.id}
                                    onClick={() => setSelectedId(comp.id)}
                                    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all border ${selectedId === comp.id
                                        ? 'bg-white/10 border-white/20 shadow-lg'
                                        : 'bg-slate-800/30 border-transparent hover:bg-slate-800'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg ${comp.bg}`}>
                                        <comp.icon className={`w-5 h-5 ${comp.color}`} />
                                    </div>
                                    <div className="text-left flex-1">
                                        <div className={`font-bold ${selectedId === comp.id ? 'text-white' : 'text-slate-300'}`}>
                                            {comp.title}
                                        </div>
                                    </div>
                                    {selectedId === comp.id && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Detail View */}
                <div className="lg:col-span-7">
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sticky top-28 shadow-2xl overflow-hidden relative">
                        {/* Background Decoration */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`p-4 rounded-2xl ${activeComp.bg}`}>
                                    <activeComp.icon className={`w-10 h-10 ${activeComp.color}`} />
                                </div>
                                <div>
                                    <div className="text-sm font-mono text-slate-500 mb-1">COMPETENCY ID: {activeComp.id}</div>
                                    <h2 className="text-3xl font-bold text-white">{activeComp.title}</h2>
                                </div>
                            </div>

                            <div className="prose prose-invert max-w-none">
                                <p className="text-xl text-indigo-200 leading-relaxed font-light mb-8 border-l-4 border-indigo-500 pl-4">
                                    "{activeComp.description}"
                                </p>

                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Activity size={20} className="text-slate-400" />
                                    Behavioural Indicators
                                </h3>
                                <div className="grid gap-3">
                                    {activeComp.details.map((detail, idx) => (
                                        <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-all">
                                            <div className="mt-1 p-1 bg-emerald-500/20 rounded-full">
                                                <Check size={12} className="text-emerald-400" />
                                            </div>
                                            <span className="text-slate-300">{detail}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoreCompetencies;
