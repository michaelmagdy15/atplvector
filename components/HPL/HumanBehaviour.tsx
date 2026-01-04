
import React, { useState } from 'react';
import { Users, AlertTriangle, CheckCircle, ShieldCheck, UserPlus, Scale, Smile, Frown, TrendingUp } from 'lucide-react';

const HumanBehaviour: React.FC = () => {
    const [tab, setTab] = useState<'attitudes' | 'leadership' | 'ideal'>('attitudes');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Users className="text-orange-400" />
                        Human Behaviour (040.05)
                    </h2>
                    <p className="text-slate-400 text-sm">Hazardous Attitudes, Ideal Crew Member, and Leadership.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setTab('attitudes')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'attitudes' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}>Hazardous Attitudes</button>
                    <button onClick={() => setTab('ideal')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'ideal' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}>Ideal Crew</button>
                    <button onClick={() => setTab('leadership')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'leadership' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}>Leadership</button>
                </div>
            </div>

            {tab === 'attitudes' && <HazardousAttitudes />}
            {tab === 'ideal' && <IdealCrewBuilder />}
            {tab === 'leadership' && <LeadershipStyles />}
        </div>
    );
};

// 040.03.05 Hazardous Attitudes
const HazardousAttitudes = () => {
    const [flipped, setFlipped] = useState<number | null>(null);

    const attitudes = [
        { 
            id: 1, 
            name: 'Anti-Authority', 
            phrase: "Don't tell me what to do!", 
            antidote: "Follow the rules. They are usually right.",
            icon: <AlertTriangle className="text-red-500" />
        },
        { 
            id: 2, 
            name: 'Impulsivity', 
            phrase: "Do it quickly!", 
            antidote: "Not so fast. Think first.",
            icon: <ZapIcon />
        },
        { 
            id: 3, 
            name: 'Invulnerability', 
            phrase: "It won't happen to me.", 
            antidote: "It could happen to me.",
            icon: <ShieldCheck className="text-blue-500" />
        },
        { 
            id: 4, 
            name: 'Macho', 
            phrase: "I can do it!", 
            antidote: "Taking chances is foolish.",
            icon: <UserPlus className="text-orange-500" />
        },
        { 
            id: 5, 
            name: 'Resignation', 
            phrase: "What's the use?", 
            antidote: "I'm not helpless. I can make a difference.",
            icon: <Scale className="text-slate-500" />
        }
    ];

    return (
        <div className="grid md:grid-cols-5 gap-4 animate-in fade-in">
            <div className="col-span-full text-center mb-4">
                <p className="text-slate-400 text-sm">Click a card to reveal the <strong>Antidote</strong>.</p>
            </div>
            
            {attitudes.map((att) => (
                <div 
                    key={att.id}
                    onClick={() => setFlipped(flipped === att.id ? null : att.id)}
                    className="relative h-64 cursor-pointer group perspective-1000"
                >
                    <div className={`w-full h-full transition-transform duration-500 transform-style-3d relative ${flipped === att.id ? 'rotate-y-180' : ''}`}>
                        
                        {/* Front */}
                        <div className="absolute inset-0 bg-slate-900 rounded-xl border-2 border-slate-700 p-6 flex flex-col items-center justify-center backface-hidden shadow-lg group-hover:border-orange-500 transition-colors">
                            <div className="bg-slate-800 p-4 rounded-full mb-4">
                                {att.icon}
                            </div>
                            <h3 className="font-bold text-white text-lg mb-2">{att.name}</h3>
                            <p className="text-slate-400 text-xs italic text-center">"{att.phrase}"</p>
                        </div>

                        {/* Back */}
                        <div className="absolute inset-0 bg-orange-600 rounded-xl p-6 flex flex-col items-center justify-center rotate-y-180 backface-hidden shadow-lg text-center">
                            <CheckCircle size={32} className="text-white mb-4" />
                            <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-2">Antidote</h3>
                            <p className="text-white font-medium text-sm">"{att.antidote}"</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// 040.03.05 Ideal Crew Member
const IdealCrewBuilder = () => {
    const [traits, setTraits] = useState<string[]>([]);
    
    const availableTraits = [
        { id: 'pro', label: 'Professional', type: 'good' },
        { id: 'imp', label: 'Impulsive', type: 'bad' },
        { id: 'res', label: 'Respectful', type: 'good' },
        { id: 'inv', label: 'Invulnerable', type: 'bad' },
        { id: 'assert', label: 'Assertive', type: 'good' },
        { id: 'macho', label: 'Over-Confident', type: 'bad' },
        { id: 'adpt', label: 'Adaptable', type: 'good' },
        { id: 'auth', label: 'Authoritarian', type: 'bad' },
    ];

    const toggleTrait = (id: string) => {
        if (traits.includes(id)) setTraits(traits.filter(t => t !== id));
        else if (traits.length < 4) setTraits([...traits, id]);
    };

    const score = traits.reduce((acc, t) => {
        const trait = availableTraits.find(at => at.id === t);
        return acc + (trait?.type === 'good' ? 25 : -25);
    }, 50); // Start at 50

    return (
        <div className="animate-in slide-in-from-right-4">
            <h3 className="text-xl font-bold text-white mb-2">Build the Ideal Crew Member</h3>
            <p className="text-sm text-slate-400 mb-6">Select up to 4 traits to define the crew profile. Aim for 100% Safety Score.</p>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h4 className="font-bold text-slate-300 mb-4 text-sm uppercase">Available Traits</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {availableTraits.map(t => (
                            <button
                                key={t.id}
                                onClick={() => toggleTrait(t.id)}
                                disabled={!traits.includes(t.id) && traits.length >= 4}
                                className={`p-3 rounded-lg border text-sm font-bold transition-all
                                    ${traits.includes(t.id) 
                                        ? (t.type === 'good' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-red-600 border-red-500 text-white')
                                        : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-400'}
                                    ${(!traits.includes(t.id) && traits.length >= 4) ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
                    <div className="relative w-32 h-32 mb-4">
                        <div className={`absolute inset-0 rounded-full border-4 transition-all duration-500 ${score >= 80 ? 'border-emerald-500' : score < 50 ? 'border-red-500' : 'border-yellow-500'}`}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            {score >= 80 ? <Smile size={48} className="text-emerald-500" /> : score < 50 ? <Frown size={48} className="text-red-500" /> : <Scale size={48} className="text-yellow-500" />}
                        </div>
                    </div>
                    
                    <div className="text-center">
                        <p className="text-slate-400 text-xs font-bold uppercase">Safety Score</p>
                        <p className={`text-4xl font-black transition-colors ${score >= 80 ? 'text-emerald-400' : score < 50 ? 'text-red-400' : 'text-yellow-400'}`}>
                            {score}%
                        </p>
                    </div>

                    <div className="mt-6 w-full bg-slate-800 p-3 rounded text-center">
                        <p className="text-xs text-slate-300">
                            {score >= 100 ? "PERFECT: Stable, communicative, and safe." :
                             score > 50 ? "ACCEPTABLE: But room for improvement." :
                             "HAZARDOUS: High risk of accident."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 040.03.04 Leadership (Blake & Mouton)
const LeadershipStyles = () => {
    const [style, setStyle] = useState(50);

    const getStyleName = (val: number) => {
        if (val < 20) return { name: 'Laissez-Faire', desc: 'Low concern for People & Task. Passive, detached.', color: 'text-slate-400' };
        if (val > 80) return { name: 'Autocratic', desc: 'High Task, Low People. Dictatorial.', color: 'text-red-400' };
        if (val > 40 && val < 60) return { name: 'Synergistic', desc: 'High Task, High People. Ideal Team.', color: 'text-emerald-400' };
        return { name: 'Mixed / Transactional', desc: 'Varies based on situation.', color: 'text-yellow-400' };
    };

    const current = getStyleName(style);

    return (
        <div className="flex flex-col items-center animate-in slide-in-from-right-4">
            <h3 className="text-xl font-bold text-white mb-6">Leadership Styles (Cockpit Gradient)</h3>
            
            <div className="w-full max-w-lg bg-slate-900 p-8 rounded-xl border border-slate-700 text-center">
                <div className="mb-8">
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={style} 
                        onChange={(e) => setStyle(Number(e.target.value))}
                        className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <div className="flex justify-between text-xs text-slate-500 font-bold mt-2 uppercase">
                        <span>Passive</span>
                        <span>Balanced</span>
                        <span>Authoritarian</span>
                    </div>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border border-slate-600">
                    <h4 className={`text-2xl font-black mb-2 ${current.color}`}>{current.name}</h4>
                    <p className="text-slate-300 text-sm">{current.desc}</p>
                </div>
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-6 w-full max-w-2xl">
                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                    <h4 className="font-bold text-white text-sm mb-2">Ideal Crew Member</h4>
                    <ul className="text-xs text-slate-300 list-disc pl-4 space-y-1">
                        <li>Assertive but respectful.</li>
                        <li>Supportive of the leader.</li>
                        <li>Adheres to SOPs.</li>
                        <li>Practices active listening.</li>
                    </ul>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                    <h4 className="font-bold text-white text-sm mb-2">Ideal Leader</h4>
                    <ul className="text-xs text-slate-300 list-disc pl-4 space-y-1">
                        <li>Decisive but open to input.</li>
                        <li>Maintains situational awareness.</li>
                        <li>Balances task and people needs.</li>
                        <li>Sets a good example.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const ZapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);

export default HumanBehaviour;
