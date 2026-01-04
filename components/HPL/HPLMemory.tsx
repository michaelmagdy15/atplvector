
import React, { useState } from 'react';
import { Brain, Database, Cpu, Save } from 'lucide-react';

const HPLMemory: React.FC = () => {
    const [tab, setTab] = useState<'model' | 'failures' | 'motor'>('model');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Database className="text-teal-400" />
                        Memory (040.03)
                    </h2>
                    <p className="text-slate-400 text-sm">Sensory, Short Term, and Long Term Memory.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setTab('model')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'model' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}>The Model</button>
                    <button onClick={() => setTab('failures')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'failures' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}>Failures</button>
                    <button onClick={() => setTab('motor')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'motor' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}>Motor Programs</button>
                </div>
            </div>

            {tab === 'model' && <MemoryModel />}
            {tab === 'failures' && <MemoryFailures />}
            {tab === 'motor' && <MotorPrograms />}
        </div>
    );
};

const MemoryModel = () => (
    <div className="animate-in fade-in space-y-6">
        <h3 className="font-bold text-white mb-4">Multi-Store Model (Atkinson & Shiffrin)</h3>

        <div className="flex flex-col md:flex-row gap-4 items-stretch justify-center">
            {/* Sensory */}
            <div className="flex-1 bg-slate-900 p-4 rounded-xl border border-slate-700 relative group">
                <div className="absolute -top-3 left-4 bg-slate-800 text-xs px-2 py-1 rounded border border-slate-600">Step 1</div>
                <h4 className="font-bold text-white text-lg mb-2">Sensory Store</h4>
                <div className="space-y-2 text-xs text-slate-400">
                    <p><strong className="text-teal-400">Iconic (Visual):</strong> 0.5 - 1 sec</p>
                    <p><strong className="text-teal-400">Echoic (Audio):</strong> 2 - 8 sec</p>
                </div>
                <div className="mt-4 p-2 bg-slate-800 rounded text-[10px] text-slate-500">
                    "Ultra-short term". Holds input just long enough for attention to grab it.
                </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center text-slate-600">
                <p className="text-xs font-bold text-center">Attention</p>
                <MoveRightIcon />
            </div>

            {/* STM */}
            <div className="flex-1 bg-slate-900 p-4 rounded-xl border border-slate-700 relative group border-t-4 border-t-teal-500">
                <div className="absolute -top-3 left-4 bg-slate-800 text-xs px-2 py-1 rounded border border-slate-600">Step 2</div>
                <h4 className="font-bold text-white text-lg mb-2">Short Term (STM)</h4>
                <div className="space-y-2 text-xs text-slate-400">
                    <p><strong className="text-white">Capacity:</strong> 7 &plusmn; 2 items</p>
                    <p><strong className="text-white">Duration:</strong> 10 - 20 secs</p>
                </div>
                <div className="mt-4 p-2 bg-slate-800 rounded text-[10px] text-slate-500">
                    Also called "Working Memory". Very fragile. Sensitive to interruption.
                    <br /><span className="text-teal-400 font-bold">Chunking</span> helps increase capacity.
                </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center text-slate-600">
                <p className="text-xs font-bold text-center">Rehearsal / Coding</p>
                <MoveRightIcon />
            </div>

            {/* LTM */}
            <div className="flex-1 bg-slate-900 p-4 rounded-xl border border-slate-700 relative group">
                <div className="absolute -top-3 left-4 bg-slate-800 text-xs px-2 py-1 rounded border border-slate-600">Step 3</div>
                <h4 className="font-bold text-white text-lg mb-2">Long Term (LTM)</h4>
                <div className="space-y-2 text-xs text-slate-400">
                    <p><strong className="text-white">Capacity:</strong> Unlimited</p>
                    <p><strong className="text-white">Duration:</strong> Lifetime</p>
                </div>
                <div className="mt-4 p-2 bg-slate-800 rounded text-[10px] text-slate-500">
                    <p className="mb-1"><strong>Semantic:</strong> Facts/Knowledge</p>
                    <p><strong>Episodic:</strong> Events/Experiences</p>
                </div>
            </div>
        </div>
    </div>
);

const MemoryFailures = () => (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-4">Common Failures</h3>
            <div className="space-y-3">
                <div className="bg-slate-800 p-3 rounded border-l-4 border-orange-500">
                    <h4 className="font-bold text-white text-sm">Amnesia</h4>
                    <p className="text-xs text-slate-400">Loss of memory (Blow to head, trauma).</p>
                </div>
                <div className="bg-slate-800 p-3 rounded border-l-4 border-orange-500">
                    <h4 className="font-bold text-white text-sm">Interference</h4>
                    <p className="text-xs text-slate-400">Old info blocks new info (Proactive), or New info overwrites old (Retroactive).</p>
                </div>
                <div className="bg-slate-800 p-3 rounded border-l-4 border-orange-500">
                    <h4 className="font-bold text-white text-sm">Bias / Suggestion</h4>
                    <p className="text-xs text-slate-400">Memory is reconstructive, not a video recording. We "fill in the gaps", often incorrectly.</p>
                </div>
            </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-4">Mnemonics (Aids)</h3>
            <p className="text-sm text-slate-300 mb-4">
                Techniques to improve coding into LTM.
            </p>
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-teal-400">BUMPFITCH</span>
                    <span className="text-xs text-slate-400">Downwind Checks</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-teal-400">HASELL</span>
                    <span className="text-xs text-slate-400">Stalling / Aerobatics Checks</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-teal-400">FREDA</span>
                    <span className="text-xs text-slate-400">Cruise Checks</span>
                </div>
            </div>
        </div>
    </div>
);

const MotorPrograms = () => (
    <div className="animate-in fade-in bg-slate-900 p-6 rounded-xl border border-slate-700">
        <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                    <Cpu className="text-purple-400" />
                    Motor Memory (Skill)
                </h3>
                <p className="text-sm text-slate-300 mb-4">
                    Also known as <strong>Procedural Memory</strong>. "Muscle Memory".
                </p>
                <div className="bg-slate-800 p-4 rounded-lg">
                    <h4 className="font-bold text-white text-sm mb-2">Development Stages</h4>
                    <ul className="space-y-2 text-xs text-slate-400">
                        <li><strong>1. Cognitive Phase:</strong> Thinking about every move. "Pull stick... power up...". (Slow, jerky).</li>
                        <li><strong>2. Associative Phase:</strong> Practice. smoothing out actions.</li>
                        <li><strong>3. Autonomous Phase:</strong> Automatic. Can do it while talking. (Fast, fluid).</li>
                    </ul>
                </div>
            </div>

            <div className="flex-1 bg-slate-800 p-4 rounded-xl border border-slate-600">
                <h4 className="font-bold text-white text-sm mb-2 text-center">Schema Theory</h4>
                <p className="text-xs text-slate-300 text-center mb-4">
                    We don't store every specific movement. We store a generalized "Schema" (Blueprint).
                </p>
                <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-slate-700 p-2 rounded text-[10px] text-slate-300">
                        Initial Conditions
                    </div>
                    <div className="bg-slate-700 p-2 rounded text-[10px] text-slate-300">
                        Response Spec
                    </div>
                    <div className="bg-slate-700 p-2 rounded text-[10px] text-slate-300">
                        Sensory Consequences
                    </div>
                    <div className="bg-slate-700 p-2 rounded text-[10px] text-slate-300">
                        Response Outcome
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const MoveRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-2"><path d="M18 8L22 12L18 16" /><path d="M2 12H22" /></svg>
);

export default HPLMemory;
