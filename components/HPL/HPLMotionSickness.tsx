import React, { useState } from 'react';
import { Waves, Brain, AlertCircle, Pill, RotateCcw } from 'lucide-react';

const HPLMotionSickness: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'mechanism' | 'symptoms' | 'prevention'>('mechanism');

    return (
        <div className="space-y-6">
            <header className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                        <Waves className="w-6 h-6 text-amber-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100">Motion Sickness</h1>
                </div>
                <p className="text-slate-400">
                    Understanding the sensory conflict theory, symptoms, and countermeasures for motion sickness in aviation.
                </p>
            </header>

            <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg">
                <TabButton
                    active={activeTab === 'mechanism'}
                    onClick={() => setActiveTab('mechanism')}
                    icon={Brain}
                    label="Mechanism"
                />
                <TabButton
                    active={activeTab === 'symptoms'}
                    onClick={() => setActiveTab('symptoms')}
                    icon={AlertCircle}
                    label="Symptoms"
                />
                <TabButton
                    active={activeTab === 'prevention'}
                    onClick={() => setActiveTab('prevention')}
                    icon={Pill}
                    label="Prevention"
                />
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 min-h-[400px]">
                {activeTab === 'mechanism' && <MechanismSection />}
                {activeTab === 'symptoms' && <SymptomsSection />}
                {activeTab === 'prevention' && <PreventionSection />}
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md transition-all font-medium ${active
            ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
    >
        <Icon size={18} />
        {label}
    </button>
);

const MechanismSection = () => {
    const [conflictType, setConflictType] = useState<number>(0);

    const conflicts = [
        {
            title: 'Visual-Vestibular Conflict',
            example: 'Reading in a moving car',
            visual: 'Stationary (book)',
            vestibular: 'Motion detected',
            brain: 'CONFLICT! Triggers nausea response',
            color: 'amber'
        },
        {
            title: 'Vestibular-Proprioceptive Conflict',
            example: 'Turbulence while seated',
            visual: 'Cabin appears stable',
            vestibular: 'Irregular accelerations detected',
            brain: 'Mismatch between expected and actual motion',
            color: 'purple'
        },
        {
            title: 'Canal-Otolith Conflict',
            example: 'The Leans / Coriolis Effect',
            visual: 'Instruments show straight & level',
            vestibular: 'Semicircular canals signal rotation',
            brain: 'Internal vestibular conflict - very disorienting',
            color: 'rose'
        },
    ];

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">Sensory Conflict Theory</h3>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    Motion sickness occurs when the brain receives conflicting signals from the visual system,
                    vestibular system, and proprioceptors about body position and motion.
                </p>
            </div>

            {/* Interactive Conflict Selector */}
            <div className="flex justify-center gap-2 flex-wrap">
                {conflicts.map((c, i) => (
                    <button
                        key={i}
                        onClick={() => setConflictType(i)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${conflictType === i
                                ? `bg-${c.color}-600 text-white`
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                    >
                        {c.title}
                    </button>
                ))}
            </div>

            {/* Conflict Visualization */}
            <div className={`bg-${conflicts[conflictType].color}-900/20 border border-${conflicts[conflictType].color}-500/30 rounded-xl p-6`}>
                <h4 className="text-lg font-bold text-white text-center mb-6">{conflicts[conflictType].title}</h4>
                <p className="text-center text-slate-400 mb-6">Example: {conflicts[conflictType].example}</p>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                        <div className="text-3xl mb-2">👁️</div>
                        <h5 className="font-bold text-blue-400 mb-2">Visual System</h5>
                        <p className="text-sm text-slate-300">{conflicts[conflictType].visual}</p>
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                        <div className="text-3xl mb-2">👂</div>
                        <h5 className="font-bold text-purple-400 mb-2">Vestibular System</h5>
                        <p className="text-sm text-slate-300">{conflicts[conflictType].vestibular}</p>
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                        <div className="text-3xl mb-2">🧠</div>
                        <h5 className="font-bold text-red-400 mb-2">Brain Response</h5>
                        <p className="text-sm text-slate-300">{conflicts[conflictType].brain}</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-lg">
                <h4 className="font-bold text-white mb-2">Why does nausea occur?</h4>
                <p className="text-slate-300 text-sm">
                    The brain interprets sensory conflict as possible poisoning (historically, toxins can affect
                    coordination and perception). The vomiting center is activated as a protective mechanism to
                    expel the "toxin". This is why motion sickness shares symptoms with food poisoning.
                </p>
            </div>
        </div>
    );
};

const SymptomsSection = () => {
    const phases = [
        {
            phase: 'Phase 1: Early Warning',
            symptoms: ['Stomach awareness', 'Yawning', 'Increased salivation', 'Pale skin (pallor)'],
            action: 'Look outside at horizon, get fresh air',
            color: 'green'
        },
        {
            phase: 'Phase 2: Moderate',
            symptoms: ['Cold sweating', 'Nausea', 'Headache', 'Drowsiness', 'Decreased performance'],
            action: 'Take control or focus on instruments, consider medication',
            color: 'yellow'
        },
        {
            phase: 'Phase 3: Severe',
            symptoms: ['Vomiting', 'Apathy', 'Severe discomfort', 'Complete incapacitation'],
            action: 'Transfer control immediately, recovery may take hours',
            color: 'red'
        },
    ];

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white text-center">Progression of Symptoms</h3>

            <div className="space-y-4">
                {phases.map((p, i) => (
                    <div
                        key={i}
                        className={`border rounded-xl p-5 ${p.color === 'green' ? 'border-green-500/30 bg-green-900/10' :
                                p.color === 'yellow' ? 'border-yellow-500/30 bg-yellow-900/10' :
                                    'border-red-500/30 bg-red-900/10'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-white">{p.phase}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${p.color === 'green' ? 'bg-green-500/20 text-green-400' :
                                    p.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-red-500/20 text-red-400'
                                }`}>
                                {p.color === 'green' ? 'ACT NOW' : p.color === 'yellow' ? 'URGENT' : 'CRITICAL'}
                            </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm text-slate-500 block mb-2">Symptoms:</span>
                                <ul className="space-y-1">
                                    {p.symptoms.map((s, j) => (
                                        <li key={j} className="text-slate-300 text-sm flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span>
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <span className="text-sm text-slate-500 block mb-2">Recommended Action:</span>
                                <p className="text-emerald-400 font-medium text-sm">{p.action}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-amber-900/20 border border-amber-500/30 p-4 rounded-lg">
                <h4 className="font-bold text-amber-300 mb-2">Sopite Syndrome</h4>
                <p className="text-slate-300 text-sm">
                    A less-known variant where fatigue, drowsiness, and mood changes are the primary symptoms,
                    with minimal nausea. Can be dangerous in flight as it impairs vigilance without obvious warning signs.
                </p>
            </div>
        </div>
    );
};

const PreventionSection = () => {
    const tips = [
        { icon: '👀', title: 'Visual Fixation', desc: 'Look at the horizon or a stable reference point outside the aircraft' },
        { icon: '🎮', title: 'Active Control', desc: 'Flying the aircraft yourself reduces symptoms vs being a passenger' },
        { icon: '❄️', title: 'Ventilation', desc: 'Cool, fresh air helps - avoid hot, stuffy cockpits' },
        { icon: '🍽️', title: 'Light Meals', desc: 'Avoid heavy, fatty meals before flight. Light snacks are fine' },
        { icon: '💤', title: 'Adequate Rest', desc: 'Fatigue significantly increases susceptibility' },
        { icon: '📖', title: 'Avoid Reading', desc: 'Head-down tasks increase conflict - look up frequently' },
    ];

    const medications = [
        { name: 'Hyoscine (Scopolamine)', type: 'Anticholinergic', side: 'Drowsiness, dry mouth, blurred vision', note: 'NOT approved for pilots in most jurisdictions' },
        { name: 'Promethazine', type: 'Antihistamine', side: 'Significant sedation', note: 'Generally NOT approved' },
        { name: 'Meclizine', type: 'Antihistamine', side: 'Mild sedation', note: 'Check with AME - some allow ground test first' },
        { name: 'Ginger', type: 'Natural', side: 'None significant', note: 'Generally acceptable, mild effectiveness' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-bold text-white mb-4">Prevention Strategies</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {tips.map((tip, i) => (
                            <div key={i} className="bg-slate-900/50 p-3 rounded-lg">
                                <span className="text-2xl block mb-2">{tip.icon}</span>
                                <h5 className="font-bold text-white text-sm mb-1">{tip.title}</h5>
                                <p className="text-xs text-slate-400">{tip.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-white mb-4">Desensitization</h3>
                    <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-lg mb-4">
                        <div className="flex items-center gap-3 mb-3">
                            <RotateCcw className="text-emerald-400" />
                            <span className="font-bold text-emerald-300">Adaptation occurs with exposure</span>
                        </div>
                        <p className="text-slate-300 text-sm">
                            Most pilots develop natural tolerance over time. Start with short flights in calm conditions
                            and gradually increase duration and complexity. About 90% of affected individuals adapt within 10 flights.
                        </p>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-lg">
                        <h4 className="font-bold text-amber-400 mb-2">Student Pilot Tips</h4>
                        <ul className="space-y-2 text-sm text-slate-300">
                            <li>• Avoid scheduling lessons in turbulent conditions initially</li>
                            <li>• Keep lessons short (30-45 min) until adapted</li>
                            <li>• Practice maneuvers gradually - don't do steep turns day 1</li>
                            <li>• Take breaks if symptoms start - don't push through</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold text-white mb-4">Medications</h3>
                <div className="bg-red-900/20 border border-red-500/30 p-3 rounded-lg mb-4">
                    <p className="text-red-300 text-sm font-medium">
                        ⚠️ Most motion sickness medications are <span className="text-white">PROHIBITED</span> for pilots
                        due to sedating side effects. Always consult your AME before taking any medication.
                    </p>
                </div>
                <div className="overflow-hidden rounded-lg border border-slate-700">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-900">
                            <tr>
                                <th className="px-4 py-2 text-left text-slate-400">Medication</th>
                                <th className="px-4 py-2 text-left text-slate-400">Type</th>
                                <th className="px-4 py-2 text-left text-slate-400">Side Effects</th>
                                <th className="px-4 py-2 text-left text-slate-400">Aviation Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medications.map((med, i) => (
                                <tr key={i} className="border-t border-slate-700">
                                    <td className="px-4 py-2 text-white font-medium">{med.name}</td>
                                    <td className="px-4 py-2 text-slate-300">{med.type}</td>
                                    <td className="px-4 py-2 text-amber-400">{med.side}</td>
                                    <td className="px-4 py-2 text-red-400 text-xs">{med.note}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HPLMotionSickness;
