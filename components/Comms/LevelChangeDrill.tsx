import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Mic, RefreshCw, Send, Check, X } from 'lucide-react';

interface Scenario {
    currentLevel: string;
    clearedLevel: string;
    direction: 'climb' | 'descend';
}

const levels = ['FL100', 'FL120', 'FL240', 'FL330', '3000ft', '5000ft'];

const LevelChangeDrill: React.FC = () => {
    const [scenario, setScenario] = useState<Scenario | null>(null);
    const [action, setAction] = useState<'climbing' | 'descending' | ''>('');
    const [fromVal, setFromVal] = useState('');
    const [toVal, setToVal] = useState('');
    const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
    const [feedback, setFeedback] = useState('');
    const [streak, setStreak] = useState(0);

    const generateScenario = () => {
        const isClimb = Math.random() > 0.5;
        const current = levels[Math.floor(Math.random() * levels.length)];
        let target = levels[Math.floor(Math.random() * levels.length)];

        while (target === current) {
            target = levels[Math.floor(Math.random() * levels.length)];
        }

        // Simplistic logic for demonstration (height/level doesn't strictly matter for string matching logic here)
        // In reality, would parse FL vs ft.

        setScenario({
            currentLevel: current,
            clearedLevel: target,
            direction: isClimb ? 'climb' : 'descend' // Forcing direction based on boolean for drill purposes, user must match
        });

        setAction('');
        setFromVal('');
        setToVal('');
        setResult(null);
        setFeedback('');
    };

    useEffect(() => {
        generateScenario();
    }, []);

    const handleSubmit = () => {
        if (!scenario) return;

        // Correct format: [ACTION] [TO] [NOW] [FROM] ?? No...
        // Standard ICAO: "LEAVING [CURRENT] CLIMBING [CLEARED]" or just "CLIMBING [CLEARED]" depending on context.
        // EASA Part-SERA: "LEAVING [CURRENT LEVEL] CLIMBING/DESCENDING [CLEARED LEVEL]"

        const isClimb = scenario.direction === 'climb';

        if (action === '' || fromVal === '' || toVal === '') {
            setFeedback("Complete all fields.");
            return;
        }

        const actionCorrect = (isClimb && action === 'climbing') || (!isClimb && action === 'descending');
        const fromCorrect = fromVal === scenario.currentLevel;
        const toCorrect = toVal === scenario.clearedLevel;

        if (actionCorrect && fromCorrect && toCorrect) {
            setResult('correct');
            setFeedback("Perfect! 'LEAVING " + scenario.currentLevel + " " + action.toUpperCase() + " " + scenario.clearedLevel + "'");
            setStreak(s => s + 1);
        } else {
            setResult('incorrect');
            setFeedback("Incorrect. Remember: Report LEAVING the current level, and the action you are taking towards the CLEARED level.");
            setStreak(0);
        }
    };

    if (!scenario) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-white">Level Change Reports</h2>
                    <p className="text-slate-400">Construct the correct transmission for level changes.</p>
                </div>
                <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                    <span className="text-xs text-slate-500 uppercase tracking-widest">Streak</span>
                    <div className="text-2xl font-mono text-center text-green-400">{streak}</div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Visualizer */}
                <div className="bg-slate-900 rounded-2xl p-8 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10"></div>

                    <div className="relative z-10 text-center space-y-8">
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 w-48 mx-auto">
                            <div className="text-xs text-slate-500 uppercase">Cleared Level</div>
                            <div className="text-3xl font-mono font-bold text-green-400">{scenario.clearedLevel}</div>
                        </div>

                        {scenario.direction === 'climb' ? (
                            <ArrowUp size={48} className="text-sky-500 animate-bounce" />
                        ) : (
                            <ArrowDown size={48} className="text-orange-500 animate-bounce" />
                        )}

                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 w-48 mx-auto opacity-60">
                            <div className="text-xs text-slate-500 uppercase">Current Level</div>
                            <div className="text-3xl font-mono font-bold text-white line-through decoration-red-500">{scenario.currentLevel}</div>
                        </div>
                    </div>
                </div>

                {/* Builder */}
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Mic className="text-indigo-600" />
                        Report leaving...
                    </h3>

                    <div className="space-y-4 font-mono">
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded border border-slate-200">
                            <span className="text-slate-400 select-none">1.</span>
                            <span className="font-bold text-slate-600">LEAVING</span>
                            <select
                                value={fromVal}
                                onChange={e => setFromVal(e.target.value)}
                                className="bg-white border rounded px-2 py-1 flex-1"
                            >
                                <option value="">Select Level...</option>
                                {levels.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>

                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded border border-slate-200">
                            <span className="text-slate-400 select-none">2.</span>
                            <select
                                value={action}
                                onChange={e => setAction(e.target.value as any)}
                                className="bg-white border rounded px-2 py-1 w-full font-bold text-indigo-600"
                            >
                                <option value="">Select Action...</option>
                                <option value="climbing">CLIMBING</option>
                                <option value="descending">DESCENDING</option>
                                <option value="maintaining">MAINTAINING</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded border border-slate-200">
                            <span className="text-slate-400 select-none">3.</span>
                            <span className="font-bold text-slate-600">TO</span>
                            <select
                                value={toVal}
                                onChange={e => setToVal(e.target.value)}
                                className="bg-white border rounded px-2 py-1 flex-1"
                            >
                                <option value="">Select Level...</option>
                                {levels.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="mt-8">
                        {!result && (
                            <button
                                onClick={handleSubmit}
                                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Send size={18} /> Transmit
                            </button>
                        )}

                        {result === 'correct' && (
                            <button
                                onClick={generateScenario}
                                className="w-full py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 animate-in zoom-in"
                            >
                                <RefreshCw size={18} /> Correct! Next Scenario
                            </button>
                        )}

                        {result === 'incorrect' && (
                            <button
                                onClick={() => setResult(null)}
                                className="w-full py-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 animate-in shake"
                            >
                                <RefreshCw size={18} /> Try Again
                            </button>
                        )}

                        {feedback && (
                            <p className={`mt-4 text-center text-sm ${result === 'correct' ? 'text-green-600' : 'text-red-500'}`}>
                                {feedback}
                            </p>
                        )}
                    </div>

                </div>
            </div>
            <div className="mt-6 bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg text-blue-200 text-sm">
                <strong>Standard Phraseology:</strong> "LEAVING [current level] [CLIMBING/DESCENDING] [cleared level]"
            </div>
        </div>
    );
};

export default LevelChangeDrill;
