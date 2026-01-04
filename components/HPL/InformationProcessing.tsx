
import React, { useState } from 'react';
import { Brain, Eye, Layers, Target, AlertCircle, RefreshCcw } from 'lucide-react';

const InformationProcessing: React.FC = () => {
    const [tab, setTab] = useState<'attention' | 'sa' | 'capture'>('attention');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Brain className="text-purple-400" />
                        Info Processing (040.03)
                    </h2>
                    <p className="text-slate-400 text-sm">Attention, Vigilance, and Situation Awareness.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setTab('attention')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'attention' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>Attention</button>
                    <button onClick={() => setTab('sa')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'sa' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>Situation Awareness</button>
                    <button onClick={() => setTab('capture')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'capture' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>Env. Capture</button>
                </div>
            </div>

            {tab === 'attention' && <AttentionTypes />}
            {tab === 'sa' && <SAModel />}
            {tab === 'capture' && <EnvironmentCapture />}
        </div>
    );
};

// 040.03.01 Attention
const AttentionTypes = () => {
    const [type, setType] = useState<'selective' | 'divided' | 'sustained'>('selective');

    return (
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
            <div className="space-y-4">
                <button onClick={() => setType('selective')} className={`w-full p-4 text-left rounded-lg border transition-all ${type === 'selective' ? 'bg-purple-900/20 border-purple-500 text-purple-300' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                    <div className="font-bold text-lg mb-1">Selective Attention</div>
                    <div className="text-xs opacity-70">Focusing on one source, ignoring others. "Cocktail Party Effect".</div>
                </button>
                <button onClick={() => setType('divided')} className={`w-full p-4 text-left rounded-lg border transition-all ${type === 'divided' ? 'bg-blue-900/20 border-blue-500 text-blue-300' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                    <div className="font-bold text-lg mb-1">Divided Attention</div>
                    <div className="text-xs opacity-70">Time-sharing between tasks. Requires skill/automaticity. Danger of saturation.</div>
                </button>
                <button onClick={() => setType('sustained')} className={`w-full p-4 text-left rounded-lg border transition-all ${type === 'sustained' ? 'bg-emerald-900/20 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                    <div className="font-bold text-lg mb-1">Sustained Attention (Vigilance)</div>
                    <div className="text-xs opacity-70">Maintaining focus over time. Risk of Hypovigilance (under-arousal).</div>
                </button>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 flex items-center justify-center relative overflow-hidden">
                {type === 'selective' && (
                    <div className="text-center relative z-10 animate-in zoom-in">
                        <Target className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                        <p className="text-white font-bold">The Filter</p>
                        <p className="text-sm text-slate-400 mt-2">Brain filters inputs based on Intensity, Relevance, and Expectation.</p>
                        <div className="mt-4 flex gap-2 justify-center opacity-50">
                            <span className="bg-slate-800 p-2 rounded text-xs line-through">Noise</span>
                            <span className="bg-slate-800 p-2 rounded text-xs line-through">Chatter</span>
                            <span className="bg-purple-600 p-2 rounded text-xs text-white font-bold">WARNING</span>
                        </div>
                    </div>
                )}
                {type === 'divided' && (
                    <div className="text-center relative z-10 animate-in zoom-in">
                        <Layers className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                        <p className="text-white font-bold">The Juggler</p>
                        <p className="text-sm text-slate-400 mt-2">Cannot truly multitask. Rapidly switching attention.</p>
                        <div className="mt-4 flex gap-4 justify-center">
                            <div className="w-20 h-20 bg-slate-800 rounded-full border-4 border-blue-500 flex items-center justify-center animate-pulse">Fly</div>
                            <div className="w-20 h-20 bg-slate-800 rounded-full border-4 border-blue-500 flex items-center justify-center animate-pulse animation-delay-500">Radio</div>
                        </div>
                    </div>
                )}
                {type === 'sustained' && (
                    <div className="text-center relative z-10 animate-in zoom-in">
                        <Eye className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                        <p className="text-white font-bold">The Watchman</p>
                        <p className="text-sm text-slate-400 mt-2">Performance drops after 20-30 mins of monitoring without stimulus.</p>
                        <div className="mt-4 p-2 bg-red-900/20 border border-red-500/50 rounded text-xs text-red-300">
                            <strong>Hypovigilance:</strong> Danger state of low arousal. Can lead to microsleeps.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// 040.03.02 Situation Awareness
const SAModel = () => {
    return (
        <div className="animate-in slide-in-from-right-4">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Endsley's 3 Levels of SA</h3>
            
            <div className="flex flex-col md:flex-row gap-4 items-stretch justify-center h-[300px]">
                {/* Level 1 */}
                <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col justify-end group hover:border-sky-500 transition-colors relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-sky-500"></div>
                    <div className="text-6xl font-black text-slate-800 absolute top-4 right-4 group-hover:text-sky-900 transition-colors">1</div>
                    <Eye className="text-sky-500 mb-4 w-10 h-10" />
                    <h4 className="text-lg font-bold text-white">Perception</h4>
                    <p className="text-xs text-slate-400 mt-2">"What is happening?"</p>
                    <p className="text-xs text-slate-500 mt-1 italic">Scanning instruments, hearing alarms, seeing traffic.</p>
                </div>

                {/* Level 2 */}
                <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col justify-end group hover:border-indigo-500 transition-colors relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
                    <div className="text-6xl font-black text-slate-800 absolute top-4 right-4 group-hover:text-indigo-900 transition-colors">2</div>
                    <Brain className="text-indigo-500 mb-4 w-10 h-10" />
                    <h4 className="text-lg font-bold text-white">Comprehension</h4>
                    <p className="text-xs text-slate-400 mt-2">"What does it mean?"</p>
                    <p className="text-xs text-slate-500 mt-1 italic">Understanding that a low fuel reading means limited range.</p>
                </div>

                {/* Level 3 */}
                <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col justify-end group hover:border-emerald-500 transition-colors relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                    <div className="text-6xl font-black text-slate-800 absolute top-4 right-4 group-hover:text-emerald-900 transition-colors">3</div>
                    <Target className="text-emerald-500 mb-4 w-10 h-10" />
                    <h4 className="text-lg font-bold text-white">Projection</h4>
                    <p className="text-xs text-slate-400 mt-2">"What will happen?"</p>
                    <p className="text-xs text-slate-500 mt-1 italic">Thinking ahead. Predicting engine failure from decreasing oil pressure.</p>
                </div>
            </div>

            <div className="mt-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-500 shrink-0" />
                <div>
                    <h5 className="font-bold text-red-400 text-sm">Loss of SA</h5>
                    <p className="text-xs text-slate-300">
                        Usually starts at Level 1 (Failure to monitor). 
                        Can be caused by Fixation, Distraction, or High Workload.
                        <strong> Regaining SA</strong> requires stepping back to Level 1 (Scan).
                    </p>
                </div>
            </div>
        </div>
    );
};

// 040.03.02.04 Environment Capture
const EnvironmentCapture = () => {
    const [action, setAction] = useState<string | null>(null);

    const handleAction = (act: string) => {
        setAction(act);
    };

    return (
        <div className="animate-in fade-in">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <RefreshCcw className="text-orange-400" /> Habit Capture
                    </h3>
                    <p className="text-sm text-slate-300 mb-4">
                        A frequently practiced skill/habit overrides the intended action, especially during high workload or fatigue.
                    </p>
                    
                    <div className="bg-slate-800 p-4 rounded border border-slate-600 mb-4">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Scenario</p>
                        <p className="text-white text-sm">
                            You normally fly the <strong>Cessna 172</strong> (Fixed Gear).<br/>
                            Today you are flying a <strong>Piper Arrow</strong> (Retractable).
                        </p>
                        <p className="text-white text-sm mt-2 font-bold text-orange-300">
                            After takeoff, what do you do?
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={() => handleAction('habit')}
                            className="p-3 bg-red-900/30 border border-red-500/50 hover:bg-red-900/50 rounded text-red-200 text-sm font-bold transition-colors"
                        >
                            Nothing (Fixed Gear Habit)
                        </button>
                        <button 
                            onClick={() => handleAction('intent')}
                            className="p-3 bg-emerald-900/30 border border-emerald-500/50 hover:bg-emerald-900/50 rounded text-emerald-200 text-sm font-bold transition-colors"
                        >
                            Retract Gear (Intention)
                        </button>
                    </div>
                </div>

                <div className="flex flex-col justify-center">
                    {action === 'habit' && (
                        <div className="bg-red-500 text-white p-6 rounded-xl shadow-lg text-center animate-in zoom-in">
                            <h4 className="text-2xl font-black mb-2">ERROR!</h4>
                            <p className="text-sm">
                                You fell victim to <strong>Environment Capture</strong> (or Habit Intrusion). 
                                Your brain defaulted to the stronger neural pathway (Fixed Gear) because you didn't consciously override it.
                            </p>
                        </div>
                    )}
                    {action === 'intent' && (
                        <div className="bg-emerald-500 text-white p-6 rounded-xl shadow-lg text-center animate-in zoom-in">
                            <h4 className="text-2xl font-black mb-2">CORRECT</h4>
                            <p className="text-sm">
                                You successfully used conscious attention to override the automatic habit. 
                                This requires mental effort (Level 2/3 Processing).
                            </p>
                        </div>
                    )}
                    {!action && (
                        <div className="text-center text-slate-500">
                            <Brain size={64} className="mx-auto mb-4 opacity-20" />
                            <p>Select an action to test the theory.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InformationProcessing;
