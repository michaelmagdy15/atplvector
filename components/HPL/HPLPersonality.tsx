
import React, { useState } from 'react';
import { User, Shield, TrendingUp, Layers, HelpCircle } from 'lucide-react';

const HPLPersonality: React.FC = () => {
    const [tab, setTab] = useState<'maslow' | 'defence' | 'big5' | 'self'>('maslow');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <User className="text-orange-400" />
                        Personality & Motivation (040.03)
                    </h2>
                    <p className="text-slate-400 text-sm">Hierarchy of Needs, Traits, and Self-Concept.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 flex-wrap">
                    <button onClick={() => setTab('maslow')} className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${tab === 'maslow' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Maslow</button>
                    <button onClick={() => setTab('defence')} className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${tab === 'defence' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Defence</button>
                    <button onClick={() => setTab('big5')} className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${tab === 'big5' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Big 5</button>
                    <button onClick={() => setTab('self')} className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${tab === 'self' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Self & Social</button>
                </div>
            </div>

            {tab === 'maslow' && <MaslowPyramid />}
            {tab === 'defence' && <DefenceMechanisms />}
            {tab === 'big5' && <BigFiveTraits />}
            {tab === 'self' && <SelfAndSocial />}
        </div>
    );
};

const SelfAndSocial = () => (
    <div className="animate-in fade-in space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
            {/* Self-Concept */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <User className="text-orange-400" /> Self-Concept
                </h3>
                <p className="text-xs text-slate-300 mb-4 uppercase font-bold text-center border-b border-slate-800 pb-2">"Who do I think I am?"</p>
                <div className="space-y-4">
                    <div className="p-3 bg-slate-800 rounded border-l-4 border-blue-500">
                        <h4 className="font-bold text-white text-sm">Self-Image</h4>
                        <p className="text-[11px] text-slate-400 italic">"How I see myself right now."</p>
                    </div>
                    <div className="p-3 bg-slate-800 rounded border-l-4 border-emerald-500">
                        <h4 className="font-bold text-white text-sm">Self-Ideal</h4>
                        <p className="text-[11px] text-slate-400 italic">"The person I want to be."</p>
                    </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-4 leading-relaxed">
                    A large gap between image and ideal leads to low self-esteem and anxiety. Pilots need a realistic, positive self-concept to handle criticism.
                </p>
            </div>

            {/* Social Skills & Discipline */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Shield className="text-orange-400" /> Social Skills & Discipline
                </h3>
                <div className="space-y-4">
                    <div className="p-3 bg-orange-900/10 border border-orange-500/30 rounded">
                        <h4 className="font-bold text-white text-sm">Self-Discipline</h4>
                        <p className="text-[10px] text-slate-300">The ability to follow SOPs even when no one is watching. Reliability and professionalism.</p>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 mb-2">Social Skills:</h4>
                        <ul className="text-[10px] text-slate-300 space-y-2 ml-4 list-disc">
                            <li><strong>Empathy:</strong> Understanding others' perspectives.</li>
                            <li><strong>Persuasion:</strong> Leading through influence, not just authority.</li>
                            <li><strong>Listening:</strong> Active listening is a core CRM skill.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const MaslowPyramid = () => {
    const [level, setLevel] = useState<number | null>(null);

    const levels = [
        { id: 5, label: 'Self-Actualization', desc: 'Achieving full potential. Creative activities. "Being the best pilot you can be".', color: 'bg-red-500' },
        { id: 4, label: 'Esteem Needs', desc: 'Prestige, feeling of accomplishment. Rank, respect from crew.', color: 'bg-orange-500' },
        { id: 3, label: 'Belongingness (Social)', desc: 'Intimate relationships, friends. Crew bonding, airline culture.', color: 'bg-yellow-500' },
        { id: 2, label: 'Safety Needs', desc: 'Security, safety. Job security, safe aircraft, good SOPs.', color: 'bg-green-500' },
        { id: 1, label: 'Physiological Needs', desc: 'Food, water, warmth, rest. Oxygen! (Base Requirement).', color: 'bg-blue-500' },
    ];

    return (
        <div className="animate-in fade-in grid md:grid-cols-2 gap-8 items-center">

            {/* Pyramid Viz */}
            <div className="flex flex-col gap-1 items-center justify-center p-8 bg-slate-900 rounded-xl border border-slate-700">
                {levels.map((l) => (
                    <button
                        key={l.id}
                        onClick={() => setLevel(l.id)}
                        onMouseEnter={() => setLevel(l.id)}
                        className={`w-full transition-all duration-300 font-bold text-white shadow-lg
                        ${l.id === 1 ? 'w-[90%]' : l.id === 2 ? 'w-[75%]' : l.id === 3 ? 'w-[60%]' : l.id === 4 ? 'w-[45%]' : 'w-[30%]'}
                        ${l.color} ${level === l.id ? 'scale-110 z-10 brightness-125' : 'opacity-80 hover:opacity-100'}
                        rounded h-12 flex items-center justify-center`}
                    >
                        {level === l.id && <span className="animate-in fade-in text-xs uppercase mr-2 opacity-75">#{l.id}</span>}
                        <span className="text-xs md:text-sm drop-shadow-md">{l.label}</span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 h-[300px] flex flex-col justify-center">
                {level ? (
                    <div className="animate-in slide-in-from-right text-center">
                        <div className={`inline-block px-3 py-1 rounded text-xs font-bold text-white mb-4 ${levels.find(l => l.id === level)?.color}`}>
                            Level {level}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">
                            {levels.find(l => l.id === level)?.label}
                        </h3>
                        <p className="text-slate-300 italic">
                            "{levels.find(l => l.id === level)?.desc}"
                        </p>
                        <p className="text-xs text-slate-500 mt-6">
                            Note: Lower needs must be satisfied before higher needs can be addressed.
                            (e.g. A starving pilot does not care about Self-Actualization).
                        </p>
                    </div>
                ) : (
                    <div className="text-center text-slate-500">
                        <Layers size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Hover over the pyramid to explore motivation levels.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const DefenceMechanisms = () => {
    const mechanisms = [
        { title: 'Rationalisation', desc: 'Justifying behavior with logical-sounding reasons (excuses) rather than the true reason.', ex: '"I didn\'t check the weather because the TAF is always wrong anyway."', icon: <HelpCircle /> },
        { title: 'Denial', desc: 'Refusing to accept a painful reality.', ex: '"No, the fuel gauge must be broken. We have plenty of fuel."', icon: <Shield /> },
        { title: 'Displacement', desc: 'Shifting emotion to a safer target.', ex: 'Captain shouts at First Officer because he is angry at ATC.', icon: <TrendingUp /> },
        { title: 'Projection', desc: 'Attributing one\'s own faults to others.', ex: '"Everyone else is flying dangerously today" (when you are the one flying poorly).', icon: <User /> },
        { title: 'Repression', desc: 'Pushing uncomfortable thoughts into the subconscious.', ex: 'Forgetting a scary near-miss incident entirely.', icon: <Layers /> },
    ];

    return (
        <div className="animate-in slide-in-from-right-4">
            <h3 className="text-xl font-bold text-white mb-6">Subconscious Defence Mechanisms</h3>
            <p className="text-sm text-slate-400 mb-6">
                The ego protects itself from anxiety or failure. These are <strong>subconscious</strong> responses (unlike lying, which is conscious).
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mechanisms.map((m, i) => (
                    <div key={i} className="bg-slate-900 p-6 rounded-xl border border-slate-700 hover:border-orange-500 transition-colors group">
                        <div className="flex items-center gap-2 mb-3 text-orange-400">
                            {m.icon}
                            <h4 className="font-bold text-white">{m.title}</h4>
                        </div>
                        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                            {m.desc}
                        </p>
                        <div className="bg-slate-800 p-3 rounded text-xs border-l-2 border-orange-500 italic text-slate-400">
                            {m.ex}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const BigFiveTraits = () => {
    // OCEAN
    const traits = [
        { code: 'O', name: 'Openness', low: 'Practical, Routine', high: 'Curious, Flexible', aviation: 'High is generally good (adaptable), but too high may ignore SOPs.' },
        { code: 'C', name: 'Conscientiousness', low: 'Impulsive, Disorganized', high: 'Disciplined, Careful', aviation: 'High is CRITICAL for pilots. The most desired trait.' },
        { code: 'E', name: 'Extroversion', low: 'Reserved, Solitary', high: 'Social, Outgoing', aviation: 'Balance needed. Too high = Distracting. Too low = Poor comms.' },
        { code: 'A', name: 'Agreeableness', low: 'Critical, Suspicious', high: 'Cooperative, Trusting', aviation: 'Balance. Too high = Compliant/Weak (Yes-man). Too low = Hostile.' },
        { code: 'N', name: 'Neuroticism', low: 'Calm, Confident (Stable)', high: 'Anxious, Pessimistic', aviation: 'Low (Stability) is desired. High neuroticism is dangerous.' },
    ];

    return (
        <div className="animate-in fade-in">
            <h3 className="text-xl font-bold text-white mb-6">The "Big Five" Personality Traits (OCEAN)</h3>

            <div className="space-y-4">
                {traits.map((t) => (
                    <div key={t.code} className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden flex flex-col md:flex-row">
                        <div className="bg-slate-800 p-4 md:w-48 flex items-center justify-center md:justify-start gap-3 md:border-r border-slate-700 shrink-0">
                            <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center font-black text-white text-lg shadow-lg">
                                {t.code}
                            </div>
                            <div className="font-bold text-white">{t.name}</div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-center">
                            <div className="flex justify-between text-xs text-slate-400 uppercase font-bold mb-2">
                                <span>Low: {t.low}</span>
                                <span>High: {t.high}</span>
                            </div>
                            <div className="w-full bg-slate-700 h-2 rounded-full mb-3 relative">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500 via-transparent to-red-500 opacity-20"></div>
                            </div>
                            <p className="text-sm text-slate-300">
                                <strong className="text-orange-400">Aviation Context:</strong> {t.aviation}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-4 bg-slate-900 rounded-lg border border-slate-700 text-center">
                <p className="text-sm text-slate-400 italic">
                    "Personality is stable and hard to change. Attitudes are unstable and can be changed."
                </p>
            </div>
        </div>
    );
};

export default HPLPersonality;
