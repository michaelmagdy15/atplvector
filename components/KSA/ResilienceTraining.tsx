import React, { useState } from 'react';
import {
    Zap,
    ShieldAlert,
    Wind,
    Activity,
    CheckCircle2,
    ChevronRight,
    Coffee,
    Moon,
    Flame,
    RotateCcw,
    RefreshCcw,
    HeartPulse,
    Brain,
    Info,
    AlertCircle
} from 'lucide-react';

interface ResilienceTopic {
    id: 'STARTLE' | 'STRESS' | 'FATIGUE' | 'ADAPT';
    title: string;
    icon: any;
    color: string;
    bg: string;
    summary: string;
    points: string[];
    strategy: string;
}

const TOPICS: ResilienceTopic[] = [
    {
        id: 'STARTLE',
        title: 'Startle Response',
        icon: Zap,
        color: 'text-amber-400',
        bg: 'bg-amber-500/20',
        summary: 'Protecting yourself from the cognitive "freeze" following an unexpected event.',
        points: [
            'Immediate "Arousal" spike',
            'Cognitive tunneling',
            'Time distortion',
            'Instinctive (often wrong) reactions'
        ],
        strategy: 'Acknowledge the startle, FLY THE AIRCRAFT, and take a deep breath before making non-essential changes.'
    },
    {
        id: 'STRESS',
        title: 'Stress Management',
        icon: HeartPulse,
        color: 'text-red-400',
        bg: 'bg-red-500/20',
        summary: 'Balancing pressure and performance (Yerkes-Dodson Law).',
        points: [
            'Physiological responses',
            'Loss of fine motor skills',
            'Communication breakdown',
            'Memory retrieval issues'
        ],
        strategy: 'Use structured tools (checklists), simplify the workload, and maintain professional discipline.'
    },
    {
        id: 'FATIGUE',
        title: 'Fatigue Mitigation',
        icon: Moon,
        color: 'text-blue-400',
        bg: 'bg-blue-500/20',
        summary: 'Managing capacity during long-haul or high-intensity operations.',
        points: [
            'Reduced reaction time',
            'Selective attention',
            'Increased error rate',
            'Irritability/low morale'
        ],
        strategy: 'Controlled rest (where allowed), workload sharing, and active cross-checking by the other pilot.'
    },
    {
        id: 'ADAPT',
        title: 'Adaptability',
        icon: RefreshCcw,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/20',
        summary: 'The ability to change plans when the situation evolves.',
        points: [
            'Developing "Plan B"',
            'Avoiding plan continuation bias',
            'Dynamic risk assessment',
            'Resilient thinking'
        ],
        strategy: 'Always have a "What If?" plan and monitor for small deviations from the expected path.'
    }
];

const ResilienceTraining: React.FC = () => {
    const [selectedId, setSelectedId] = useState<ResilienceTopic['id']>('STARTLE');

    const activeTopic = TOPICS.find(t => t.id === selectedId)!;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-red-500/20 rounded-xl">
                    <Flame className="w-8 h-8 text-red-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">
                        Resilience <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Training</span>
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Developing the ability to bounce back from adversity and manage unexpected events.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Topics */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Select Topic</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {TOPICS.map((topic) => (
                                <button
                                    key={topic.id}
                                    onClick={() => setSelectedId(topic.id)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${selectedId === topic.id
                                        ? 'bg-white/10 border-white/10 shadow-lg scale-[1.02]'
                                        : 'bg-slate-800/30 border-transparent hover:bg-slate-800 hover:scale-[1.01]'
                                        }`}
                                >
                                    <div className={`p-3 rounded-xl ${topic.bg}`}>
                                        <topic.icon className={`w-6 h-6 ${topic.color}`} />
                                    </div>
                                    <div className="text-left flex-1">
                                        <div className={`font-bold text-lg ${selectedId === topic.id ? 'text-white' : 'text-slate-300'}`}>
                                            {topic.title}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{topic.summary}</div>
                                    </div>
                                    {selectedId === topic.id && <ChevronRight size={20} className="text-red-500 animate-pulse" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-white/10 rounded-3xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Brain className="text-indigo-400" size={20} />
                            <h4 className="text-white font-bold">Resilience Mindset</h4>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            A resilient pilot doesn't just "suffer through" stress; they apply structured interventions to maintain operational integrity. Resilience is a skill that can be developed through training and experience.
                        </p>
                    </div>
                </div>

                {/* Right Column: Content */}
                <div className="lg:col-span-7">
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 h-full relative overflow-hidden shadow-2xl">
                        {/* Background Decoration */}
                        <div className={`absolute -top-32 -right-32 w-80 h-80 ${activeTopic.bg} rounded-full blur-3xl pointer-events-none opacity-40`} />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center gap-6 mb-10">
                                <div className={`p-5 rounded-3xl ${activeTopic.bg}`}>
                                    <activeTopic.icon className={`w-12 h-12 ${activeTopic.color}`} />
                                </div>
                                <div>
                                    <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">Module: {activeTopic.id}</div>
                                    <h2 className="text-4xl font-black text-white">{activeTopic.title}</h2>
                                </div>
                            </div>

                            <div className="space-y-10 flex-1">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Info size={14} /> The Problem
                                    </h3>
                                    <p className="text-2xl text-slate-200 leading-tight font-medium border-l-4 border-red-500 pl-6">
                                        {activeTopic.summary}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {activeTopic.points.map((point, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-4 bg-black/30 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                            <span className="text-sm font-medium text-slate-300">{point}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto pt-10">
                                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 relative group">
                                        <div className="absolute top-0 left-8 -translate-y-1/2 px-4 py-1 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                            Key Strategy
                                        </div>
                                        <p className="text-lg text-white font-bold leading-relaxed">
                                            {activeTopic.strategy}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResilienceTraining;
