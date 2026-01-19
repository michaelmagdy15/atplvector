import React, { useState } from 'react';
import { Book, Shield, Users, Map, GraduationCap, AlertCircle } from 'lucide-react';

const OpsManualVisualizer: React.FC = () => {
    const [activePart, setActivePart] = useState<string | null>(null);

    const parts = [
        {
            id: 'A',
            title: 'Part A: General/Basic',
            desc: 'Non-type related operational policies. Applies to all aircraft.',
            icon: Book,
            color: 'blue',
            details: [
                'Administration & Control of Manual',
                'Organization & Responsibilities',
                'Operational Control & Supervision',
                'Crew Composition & Qualification',
                'Flight Time Limitations',
                'Security Procedures'
            ]
        },
        {
            id: 'B',
            title: 'Part B: Type Specific',
            desc: 'Technical details and procedures for a specific aircraft type.',
            icon: Shield,
            color: 'emerald',
            details: [
                'General Information & Systems',
                'Normal Procedures',
                'Abnormal & Emergency Procedures',
                'Performance',
                'Mass & Balance',
                'Minimum Equipment List (MEL)'
            ]
        },
        {
            id: 'C',
            title: 'Part C: Route & Aerodrome',
            desc: 'Instructions and information for routes and aerodromes.',
            icon: Map,
            color: 'purple',
            details: [
                'Aerodrome Briefings',
                'Route Information',
                'Communication Frequencies',
                'Navigation Aids',
                'Maps & Charts'
            ]
        },
        {
            id: 'D',
            title: 'Part D: Training',
            desc: 'Training syllabi and checking requirements.',
            icon: GraduationCap,
            color: 'orange',
            details: [
                'Training Syllabi',
                'Checking Programs',
                'Procedures for Training & Checking',
                'Documentation & Storage'
            ]
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
                <Book className="w-8 h-8 text-blue-400" />
                <div>
                    <h2 className="text-2xl font-bold text-white">Operations Manual Structure</h2>
                    <p className="text-slate-400 text-sm">The "Bible" of airline operations. Compliance is mandatory.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {parts.map((part) => (
                    <button
                        key={part.id}
                        onClick={() => setActivePart(part.id)}
                        className={`p-6 rounded-xl border text-left transition-all hover:scale-[1.02] active:scale-95 ${activePart === part.id
                                ? `bg-${part.color}-900/40 border-${part.color}-500 ring-2 ring-${part.color}-500/20`
                                : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-lg bg-${part.color}-500/20 flex items-center justify-center mb-4`}>
                            <part.icon className={`w-6 h-6 text-${part.color}-400`} />
                        </div>
                        <h3 className="font-bold text-white text-lg mb-1">{part.title}</h3>
                        <p className="text-xs text-slate-400">{part.desc}</p>
                    </button>
                ))}
            </div>

            {activePart && (
                <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-700 backdrop-blur-sm animate-in zoom-in-95 duration-200">
                    <h3 className="text-xl font-bold text-white mb-4">
                        Contents of Part {activePart}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {parts.find(p => p.id === activePart)?.details.map((detail, i) => (
                            <div key={i} className="flex items-center gap-2 text-slate-300 p-2 rounded bg-slate-800/50 border border-slate-700/50">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                {detail}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700">
                    <h3 className="flex items-center gap-2 font-bold text-white mb-4">
                        <Users className="w-5 h-5 text-indigo-400" />
                        Management Structure
                    </h3>
                    <ul className="space-y-3 text-sm text-slate-300">
                        <li className="flex justify-between items-center py-2 border-b border-slate-700">
                            <span>Accountable Manager</span>
                            <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">Overall Responsibility</span>
                        </li>
                        <li className="flex justify-between items-center py-2 border-b border-slate-700">
                            <span>Nominated Postholders</span>
                            <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">Flight Ops, Maintenance, Training, Ground</span>
                        </li>
                        <li className="flex justify-between items-center py-2 border-b border-slate-700">
                            <span>Safety Manager</span>
                            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">Independent Corporate Function</span>
                        </li>
                        <li className="flex justify-between items-center py-2">
                            <span>Compliance Monitoring</span>
                            <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded">Audits & Quality</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700">
                    <h3 className="flex items-center gap-2 font-bold text-white mb-4">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        Key Definitions
                    </h3>
                    <div className="space-y-4">
                        <div className="text-sm">
                            <span className="text-white font-bold block mb-1">MCTOM</span>
                            <span className="text-slate-400">Maximum Certified Take-Off Mass. &gt;27,000 kg requires mandatory SMS.</span>
                        </div>
                        <div className="text-sm">
                            <span className="text-white font-bold block mb-1">MOPSC</span>
                            <span className="text-slate-400">Maximum Operational Passenger Seating Configuration. Dictates Cabin Crew numbers (1 per 50 seats).</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpsManualVisualizer;
