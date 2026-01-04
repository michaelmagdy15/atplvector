
import React, { useState } from 'react';
import { BrainCircuit, Filter, DollarSign, Dices } from 'lucide-react';

const HPLBiases: React.FC = () => {
    const [tab, setTab] = useState<'confirmation' | 'sunk' | 'gambler'>('confirmation');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <BrainCircuit className="text-pink-400" />
                        Cognitive Biases (040.03)
                    </h2>
                    <p className="text-slate-400 text-sm">Flaws in Human Decision Making.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setTab('confirmation')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'confirmation' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}>Confirmation</button>
                    <button onClick={() => setTab('sunk')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'sunk' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}>Sunk Cost</button>
                    <button onClick={() => setTab('gambler')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'gambler' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'}`}>Gambler's</button>
                </div>
            </div>

            {tab === 'confirmation' && <ConfirmationBias />}
            {tab === 'sunk' && <SunkCost />}
            {tab === 'gambler' && <GamblersFallacy />}
        </div>
    );
};

const ConfirmationBias = () => (
    <div className="animate-in fade-in">
        <h3 className="text-xl font-bold text-white mb-6">Confirmation Bias</h3>
        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                    <Filter className="text-pink-400" />
                    <h4 className="font-bold text-white">The Hypothesis Filter</h4>
                </div>
                <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                    Once we form a hypothesis (e.g. "We have enough fuel"), we sub-conciously:
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex gap-2">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>Seek information that <strong>Confirms</strong> it.</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-red-500 font-bold">✗</span>
                        <span>Ignore/Discard information that <strong>Disproves</strong> it.</span>
                    </li>
                </ul>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white mb-2">Aviation Example</h4>
                <div className="bg-slate-800 p-4 rounded italic text-slate-400 text-sm mb-4">
                    "I think that gear light is just a bulb failure. I'll check the bulb."
                </div>
                <p className="text-xs text-slate-500">
                    The pilot ignores the possibility that the gear is actually unsafe, and focuses only on proving the bulb is broken.
                </p>
                <div className="mt-4 border-t border-slate-800 pt-4">
                    <strong className="text-pink-400 text-xs uppercase">Countermeasure:</strong>
                    <p className="text-sm text-white">Actively seek <strong>Disconfirming</strong> evidence. "Prove me wrong."</p>
                </div>
            </div>
        </div>
    </div>
);

const SunkCost = () => (
    <div className="animate-in slide-in-from-right-4">
        <h3 className="text-xl font-bold text-white mb-6">Sunk Cost Fallacy (Get-there-itis)</h3>

        <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 max-w-2xl mx-auto text-center">
            <DollarSign className="text-green-400 w-16 h-16 mx-auto mb-4" />
            <p className="text-lg text-white font-bold mb-4">
                "We've come this far, might as well continue."
            </p>
            <p className="text-sm text-slate-400 mb-8">
                The tendency to continue an unsafe course of action because of the investment (time, money, effort) already made, even if the future outcome is likely bad.
            </p>

            <div className="grid grid-cols-2 gap-4 text-left">
                <div className="bg-slate-800 p-4 rounded border-l-4 border-slate-600">
                    <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Rational Choice</span>
                    <span className="text-sm text-slate-300">"The weather is bad. We should turn back. The past effort is irrelevant."</span>
                </div>
                <div className="bg-slate-800 p-4 rounded border-l-4 border-red-500">
                    <span className="text-xs font-bold text-red-500 uppercase block mb-1">Bias Choice</span>
                    <span className="text-sm text-slate-300">"But we are almost there! If we turn back now, we wasted 3 hours."</span>
                </div>
            </div>
        </div>
    </div>
);

const GamblersFallacy = () => (
    <div className="animate-in fade-in">
        <h3 className="text-xl font-bold text-white mb-6">Gambler's Fallacy</h3>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                    <Dices className="text-purple-400" />
                    <h4 className="font-bold text-white">The Law of Averages Trap</h4>
                </div>
                <p className="text-sm text-slate-300 mb-6">
                    Believing that if an event happens frequently now, it is less likely to happen in the future (or vice-versa), even though the events are independent.
                </p>
                <div className="bg-white/5 p-4 rounded text-center">
                    <p className="text-2xl font-black text-white tracking-widest mb-2">HEADS HEADS HEADS HEADS</p>
                    <p className="text-sm text-purple-400 font-bold">"Next one MUST be Tails, right?"</p>
                    <p className="text-xs text-slate-500 mt-2">NO. It's still 50/50.</p>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white mb-2">Aviation Context</h4>
                <ul className="space-y-4 text-sm text-slate-300">
                    <li className="bg-slate-800 p-3 rounded">
                        <strong>Weather:</strong> "The TAF has been wrong 3 times in a row. It is bound to be right this time." (False).
                    </li>
                    <li className="bg-slate-800 p-3 rounded">
                        <strong>Risk Taking:</strong> "I've flown this approach 100 times below minima and survived. The odds are in my favor." (Dangerous Normalisation of Deviance).
                    </li>
                </ul>
            </div>
        </div>
    </div>
);

export default HPLBiases;
