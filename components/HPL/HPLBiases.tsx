import React, { useState, useEffect } from 'react';
import { BrainCircuit, Coins, Target, AlertOctagon, HelpCircle } from 'lucide-react';

const HPLBiases: React.FC = () => {
    const [tab, setTab] = useState<'confirmation' | 'sunk' | 'gambler'>('confirmation');

    return (
        <div className="space-y-6">
            <header className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-pink-500/20 rounded-lg">
                        <BrainCircuit className="w-6 h-6 text-pink-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100">Cognitive Biases</h1>
                </div>
                <p className="text-slate-400">
                    Mental shortcuts (heuristics) that lead to systematic deviations from rational judgment.
                </p>
            </header>

            <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg">
                <button onClick={() => setTab('confirmation')} className={`flex-1 py-2 rounded transition-colors ${tab === 'confirmation' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>Confirmation Bias</button>
                <button onClick={() => setTab('sunk')} className={`flex-1 py-2 rounded transition-colors ${tab === 'sunk' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>Sunk Cost</button>
                <button onClick={() => setTab('gambler')} className={`flex-1 py-2 rounded transition-colors ${tab === 'gambler' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}>Gambler's Fallacy</button>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 min-h-[400px]">
                {tab === 'confirmation' && <ConfirmationBias />}
                {tab === 'sunk' && <SunkCost />}
                {tab === 'gambler' && <GamblersFallacy />}
            </div>
        </div>
    );
};

const ConfirmationBias = () => {
    const [step, setStep] = useState(0);
    const [hypothesis, setHypothesis] = useState('');

    // Simple 2-4-8 sequence game
    const [testInput, setTestInput] = useState('');
    const [history, setHistory] = useState<{ nums: string, res: boolean }[]>([]);

    const checkSequence = () => {
        if (!testInput) return;
        const nums = testInput.split(',').map(n => parseInt(n.trim()));
        if (nums.length !== 3 || nums.some(isNaN)) return;

        // Rule is actually just "Ascending numbers"
        const fits = nums[0] < nums[1] && nums[1] < nums[2];
        setHistory([...history, { nums: testInput, res: fits }]);
        setTestInput('');
    };

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-xl font-bold text-white mb-4">The Wason Selection Task (Variant)</h3>
                <p className="text-slate-300 mb-6">
                    I have a hidden rule for a sequence of 3 numbers. The sequence <strong>2, 4, 8</strong> fits this rule.
                    <br /><br />
                    Test sequences to discover the rule. Most people only test sequences that <em>confirm</em> their theory, rather than trying to <em>falsify</em> it.
                </p>

                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 mb-4">
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
                            placeholder="e.g. 10, 12, 14"
                            value={testInput}
                            onChange={(e) => setTestInput(e.target.value)}
                        />
                        <button onClick={checkSequence} className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded font-bold">
                            Test
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    {history.map((h, i) => (
                        <div key={i} className={`flex justify-between p-2 rounded text-sm ${h.res ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            <span>{h.nums}</span>
                            <span className="font-bold">{h.res ? 'FITS RULE' : 'DOES NOT FIT'}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-slate-700/30 p-6 rounded-xl border border-slate-600">
                <div className="flex items-center gap-2 text-pink-400 font-bold mb-4">
                    <HelpCircle />
                    <h4>The Mechanism</h4>
                </div>

                <p className="text-sm text-slate-300 mb-4">
                    Did you assume the rule was "Multiply by 2" or "Add 2"?
                    Did you test <code>1, 2, 3</code>? Or <code>2, 4, 7</code>?
                </p>

                <div className="space-y-4">
                    <p className="text-sm text-slate-400 italic"> The actual rule is simply: <strong>Ascending Order</strong>.</p>

                    <div className="bg-pink-900/20 p-4 rounded border border-pink-500/20">
                        <strong className="text-pink-300 block mb-1">Aviation Implication</strong>
                        <p className="text-xs text-slate-300">
                            A pilot believes they have gear logic failure. They see three green lights. They assume the lights are false (confirming failure belief) rather than checking if the gear is actually down via other means (e.g., noise, drag).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SunkCost = () => {
    return (
        <div className="space-y-8">
            <h3 className="text-xl font-bold text-white">Sunk Cost Bias (Plan Continuation)</h3>

            <div className="relative bg-slate-900 p-8 rounded-xl overflow-hidden border border-slate-700">
                <div className="relative z-10 grid md:grid-cols-2 gap-12">
                    <div>
                        <h4 className="text-lg font-bold text-white mb-2">Scenario</h4>
                        <p className="text-slate-300 text-sm leading-relaxed mb-4">
                            You have flown 3 hours towards your destination. The weather at the destination has dropped below minima. You have enough fuel to divert, but...
                        </p>
                        <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                            <li>It's late at night.</li>
                            <li>Passengers are tired needed to be there.</li>
                            <li>You've already put in so much effort.</li>
                        </ul>
                    </div>

                    <div className="flex flex-col justify-center">
                        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg mb-4">
                            <span className="block text-red-400 font-bold text-xs uppercase mb-1">The Trap</span>
                            <p className="text-white font-bold">"We've come this far, we might as well continue."</p>
                        </div>
                        <div className="mx-auto text-2xl text-slate-500">vs</div>
                        <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg mt-4">
                            <span className="block text-green-400 font-bold text-xs uppercase mb-1">Rational Choice</span>
                            <p className="text-white font-bold">Past investment is irrelevant. Only future safety matters.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <AlertOctagon className="text-red-500 shrink-0" />
                <p className="text-sm text-slate-300">
                    <strong>Get-Home-Itis:</strong> The powerful unconscious desire to complete the mission, ignoring increasing risks. Often fatal in GA VFR into IMC accidents.
                </p>
            </div>
        </div>
    );
};

const GamblersFallacy = () => {
    const [history, setHistory] = useState<('H' | 'T')[]>([]);

    const flip = () => {
        const res = Math.random() > 0.5 ? 'H' : 'T';
        setHistory(prev => [...prev.slice(-9), res]);
    };

    const tailsCount = history.filter(x => x === 'T').length;
    const headsCount = history.filter(x => x === 'H').length;

    return (
        <div className="space-y-8 text-center">
            <div className="max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-white mb-2">The Gambler's Fallacy</h3>
                <p className="text-slate-400 text-sm">
                    The mistaken belief that if an event happens more frequently than normal during a given period, it will happen less frequently in the future.
                </p>
            </div>

            <div className="bg-slate-900 mx-auto max-w-lg p-8 rounded-xl border border-slate-700">
                <div className="flex justify-center gap-2 mb-8 min-h-[50px]">
                    {history.map((r, i) => (
                        <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 animate-in zoom-in ${r === 'H' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : 'border-slate-400 text-slate-400 bg-slate-400/10'
                            }`}>
                            {r}
                        </div>
                    ))}
                </div>

                <button onClick={flip} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-indigo-500/30 transition-all active:scale-95 flex items-center gap-2 mx-auto">
                    <Coins size={20} /> Flip Coin
                </button>

                {history.length >= 3 && (
                    <div className="mt-8 bg-black/30 p-4 rounded-lg text-sm">
                        <p className="text-slate-300 mb-2">
                            Current Run: {history[history.length - 1] === 'H' ? `${headsCount} Heads` : `${tailsCount} Tails`} in last 10.
                        </p>
                        <p className="text-xs text-slate-500 italic">
                            Chance of next flip being Heads: <strong className="text-white">50%</strong>. <br />
                            (The coin has no memory).
                        </p>
                    </div>
                )}
            </div>

            <div className="text-left bg-slate-800 p-4 rounded-lg border-l-4 border-yellow-500 max-w-2xl mx-auto">
                <h4 className="font-bold text-yellow-500 text-sm mb-1">Aviation Example</h4>
                <p className="text-sm text-slate-300">
                    "I've flown this approach 100 times in this weather and never had an issue." <br />
                    <span className="text-slate-500 text-xs">Past success does not guarantee future safety. Each approach has independent risks.</span>
                </p>
            </div>
        </div>
    );
};

export default HPLBiases;
