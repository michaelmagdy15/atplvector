import React, { useState } from 'react';
import { Brain, GraduationCap, Database, ArrowRight, Save, Play, TrendingUp, Eye } from 'lucide-react';

const HPLLearning: React.FC = () => {
    const [tab, setTab] = useState<'memory' | 'curve' | 'skills'>('memory');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <GraduationCap className="text-lime-400" />
                        Learning & Memory (040.03)
                    </h2>
                    <p className="text-slate-400 text-sm">Information Processing, Memory Types, and Skill Acquisition.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setTab('memory')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'memory' ? 'bg-lime-600 text-white' : 'text-slate-400 hover:text-white'}`}>Memory Model</button>
                    <button onClick={() => setTab('curve')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'curve' ? 'bg-lime-600 text-white' : 'text-slate-400 hover:text-white'}`}>Learning Curve</button>
                    <button onClick={() => setTab('skills')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'skills' ? 'bg-lime-600 text-white' : 'text-slate-400 hover:text-white'}`}>Skill Phases</button>
                </div>
            </div>

            {tab === 'memory' && <MemoryPipeline />}
            {tab === 'curve' && <LearningCurve />}
            {tab === 'skills' && <SkillPhases />}
        </div>
    );
};

// Multi-Store Model of Memory (Atkinson-Shriffrin)
const MemoryPipeline = () => {
    const [activeStage, setActiveStage] = useState<string | null>(null);

    return (
        <div className="animate-in fade-in">
            <h3 className="font-bold text-white mb-6">Multi-Store Memory Model</h3>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-8 relative">
                {/* Sensory Store */}
                <div
                    onClick={() => setActiveStage('sensory')}
                    className="w-40 p-4 bg-slate-900 border-2 border-slate-700 rounded-xl text-center cursor-pointer hover:border-lime-500 transition-colors relative z-10"
                >
                    <Eye className="mx-auto mb-2 text-slate-400" />
                    <h4 className="font-bold text-white text-sm">Sensory Store</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Ultra-short (0.5 - 2s)</p>
                </div>

                <ArrowRight className="text-slate-600" />

                {/* STM */}
                <div
                    onClick={() => setActiveStage('stm')}
                    className="w-40 p-4 bg-slate-900 border-2 border-slate-700 rounded-xl text-center cursor-pointer hover:border-lime-500 transition-colors relative z-10"
                >
                    <Brain className="mx-auto mb-2 text-lime-400" />
                    <h4 className="font-bold text-white text-sm">Working / STM</h4>
                    <p className="text-[10px] text-slate-500 mt-1">7 ± 2 Items</p>
                    <p className="text-[10px] text-slate-500">10 - 20 seconds</p>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <ArrowRight className="text-slate-600" />
                    <div className="text-[10px] text-slate-500 font-mono uppercase rotate-90 md:rotate-0">Encoding</div>
                    <ArrowRight className="text-slate-600 rotate-180" />
                </div>

                {/* LTM */}
                <div
                    onClick={() => setActiveStage('ltm')}
                    className="w-40 p-4 bg-slate-900 border-2 border-slate-700 rounded-xl text-center cursor-pointer hover:border-lime-500 transition-colors relative z-10"
                >
                    <Database className="mx-auto mb-2 text-blue-400" />
                    <h4 className="font-bold text-white text-sm">Long Term (LTM)</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Unlimited Capacity</p>
                    <p className="text-[10px] text-slate-500">Unlimited Duration</p>
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 min-h-[150px]">
                {!activeStage && <p className="text-center text-slate-500 text-sm">Select a stage above to view details.</p>}

                {activeStage === 'sensory' && (
                    <div className="animate-in zoom-in">
                        <h4 className="font-bold text-white mb-2">Sensory Memory (Iconic/Echoic)</h4>
                        <p className="text-sm text-slate-300">
                            The entry point. Holds sensory information for a split second.
                            <br /><strong>Capacity:</strong> Huge.
                            <br /><strong>Duration:</strong> Very short (Iconic ~0.5s, Echoic ~2s).
                            <br /><strong>Action:</strong> Attention is required to move data to STM. Otherwise, it decays instantly.
                        </p>
                    </div>
                )}
                {activeStage === 'stm' && (
                    <div className="animate-in zoom-in">
                        <h4 className="font-bold text-lime-400 mb-2">Short Term / Working Memory</h4>
                        <p className="text-sm text-slate-300">
                            The "workbench" of the mind. Vulnerable to distraction.
                            <br /><strong>Capacity:</strong> Miller's Law: 7 ± 2 items (Chunks).
                            <br /><strong>Duration:</strong> ~15-20 seconds without rehearsal.
                            <br /><strong>Technique:</strong> "Chunking" (e.g., grouping radio frequencies) improves capacity.
                        </p>
                        <div className="mt-2 text-xs text-red-400 font-bold">Limit: Easily overloaded in emergencies.</div>
                    </div>
                )}
                {activeStage === 'ltm' && (
                    <div className="animate-in zoom-in">
                        <h4 className="font-bold text-blue-400 mb-2">Long Term Memory</h4>
                        <p className="text-sm text-slate-300">
                            Permanent storage.
                            <br /><strong>Semantic:</strong> Facts / General Knowledge (Checklists).
                            <br /><strong>Episodic:</strong> Personal experiences (That one landing).
                            <br /><strong>Procedural:</strong> Motor skills (Flying the plane).
                            <br /><strong>Risk:</strong> "False Memories" - reconstruction can be flawed.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Learning Curves
const LearningCurve = () => {
    return (
        <div className="animate-in slide-in-from-right-4 grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex items-center justify-center p-8">
                {/* CSS Graph */}
                <div className="relative w-full h-48 border-l border-b border-slate-500">
                    <div className="absolute -left-6 top-1/2 -rotate-90 text-[10px] text-slate-400">PERFORMANCE</div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-400">PRACTICE / TIME</div>

                    {/* The Curve */}
                    <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 overflow-visible">
                        <path d="M 0 100 Q 20 80 40 40 T 100 10" fill="none" stroke="#84cc16" strokeWidth="3" />

                        {/* Plateau */}
                        <rect x="35" y="35" width="20" height="20" className="fill-white/10" />
                        <text x="36" y="30" className="text-[3px] fill-white font-bold">PLATEAU</text>
                    </svg>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h4 className="font-bold text-white text-sm">The Learning Plateau</h4>
                    <p className="text-xs text-slate-400 mt-1">
                        A temporary period where performance stalls despite continued practice.
                        <br /><strong>Causes:</strong> Fatigue, lack of motivation, or consolidating a new method.
                        <br /><strong>Remedy:</strong> Take a break, change instructor, or try a different approach.
                    </p>
                </div>

                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h4 className="font-bold text-white text-sm">Overlearning</h4>
                    <p className="text-xs text-slate-400 mt-1">
                        Practicing beyond the point of "good enough".
                        <br /><strong>Benefit:</strong> Essential for emergencies. Skills become automatic and resistant to stress.
                    </p>
                </div>
            </div>
        </div>
    );
};

// Skill Acquisition Phases (Fitts & Posner)
const SkillPhases = () => {
    const phases = [
        { id: 1, name: 'Cognitive', desc: 'Thinking about every move. "Erratic". Needs instruction. High Error rate.', color: 'border-red-500' },
        { id: 2, name: 'Associative', desc: 'Smoother. Associations formed. Self-monitoring begins. "Practice phase".', color: 'border-yellow-500' },
        { id: 3, name: 'Autonomous', desc: 'Automatic. Subconscious performace. Can multitask. "Expert".', color: 'border-lime-500' }
    ];

    return (
        <div className="animate-in slide-in-from-right-4">
            <h3 className="font-bold text-white mb-6">Fitts & Posner Phases of Motor Learning</h3>

            <div className="grid md:grid-cols-3 gap-6">
                {phases.map((p) => (
                    <div key={p.id} className={`bg-slate-900 p-6 rounded-xl border-t-4 ${p.color} relative overflow-hidden group`}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-white group-hover:scale-110 transition-transform">
                            {p.id}
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">{p.name}</h4>
                        <p className="text-sm text-slate-300 leading-relaxed">{p.desc}</p>

                        <div className="mt-4 pt-4 border-t border-slate-800 text-[10px] text-slate-500 uppercase font-bold">
                            {p.id === 1 && "Requires Full Attention"}
                            {p.id === 2 && "Links perception to action"}
                            {p.id === 3 && "Resistant to interference"}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-4 bg-slate-700/30 rounded-lg text-sm text-slate-300 flex items-center gap-4">
                <Play className="shrink-0 text-lime-400" />
                <p>
                    <strong>Regression:</strong> Under high stress, a pilot in the Autonomous phase may regress to the Cognitive phase (e.g. over-thinking a landing and fumbling), or reversion to old habits.
                </p>
            </div>
        </div>
    );
};

export default HPLLearning;
