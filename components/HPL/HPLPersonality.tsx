
import React, { useState } from 'react';
import { User, Shield, TrendingUp, Layers, HelpCircle, AlertTriangle, ChevronRight, Activity, Brain, Zap, Target, CheckCircle2 } from 'lucide-react';

/* ─────────────────────── MAIN COMPONENT ─────────────────────── */
const HPLPersonality: React.FC = () => {
    const [tab, setTab] = useState<'maslow' | 'defence' | 'big5' | 'self' | 'hazardous' | 'yerkes'>('maslow');

    const tabs: { key: typeof tab; label: string }[] = [
        { key: 'maslow', label: 'Maslow' },
        { key: 'defence', label: 'Defence' },
        { key: 'big5', label: 'Big 5' },
        { key: 'hazardous', label: 'Attitudes' },
        { key: 'yerkes', label: 'Yerkes-Dodson' },
        { key: 'self', label: 'Self & Social' },
    ];

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
                    {tabs.map(t => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${tab === t.key ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {tab === 'maslow' && <MaslowPyramid />}
            {tab === 'defence' && <DefenceMechanisms />}
            {tab === 'big5' && <BigFiveRadar />}
            {tab === 'hazardous' && <HazardousAttitudesQuiz />}
            {tab === 'yerkes' && <YerkesDodsonCurve />}
            {tab === 'self' && <SelfAndSocial />}
        </div>
    );
};

/* ─────────────────────── SELF & SOCIAL (PRESERVED) ─────────────────────── */
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

/* ─────────────────────── MASLOW'S PYRAMID (CLICKABLE) ─────────────────────── */
const MaslowPyramid = () => {
    const [level, setLevel] = useState<number | null>(null);

    const levels = [
        {
            id: 5, label: 'Self-Actualization',
            desc: 'Achieving full potential. Creative activities. "Being the best pilot you can be".',
            color: 'bg-red-500',
            details: 'At this peak, a pilot pursues mastery — mentoring others, contributing to safety culture, and seeking continuous improvement. This is about purpose, not rewards.',
            examples: ['Volunteering for safety committees', 'Mentoring junior cadets', 'Innovating cockpit procedures'],
        },
        {
            id: 4, label: 'Esteem Needs',
            desc: 'Prestige, feeling of accomplishment. Rank, respect from crew.',
            color: 'bg-orange-500',
            details: 'Recognition and respect. A pilot who never receives positive feedback may develop insecurity or compensatory macho behaviour.',
            examples: ['Earning a type-rating', 'Being trusted as PIC', 'Receiving praise from a check captain'],
        },
        {
            id: 3, label: 'Belongingness (Social)',
            desc: 'Intimate relationships, friends. Crew bonding, airline culture.',
            color: 'bg-yellow-500',
            details: 'Humans need social bonds. Isolation (e.g., long-haul roster, new airline) can impair motivation and well-being.',
            examples: ['Crew debriefs over coffee', 'Union membership', 'Feeling part of the airline family'],
        },
        {
            id: 2, label: 'Safety Needs',
            desc: 'Security, safety. Job security, safe aircraft, good SOPs.',
            color: 'bg-green-500',
            details: 'A pilot worried about job loss or flying an aircraft they distrust cannot focus on higher performance goals.',
            examples: ['Stable employment contracts', 'Well-maintained fleet', 'Clear SOPs and checklists'],
        },
        {
            id: 1, label: 'Physiological Needs',
            desc: 'Food, water, warmth, rest. Oxygen! (Base Requirement).',
            color: 'bg-blue-500',
            details: 'The absolute base. Hypoxia, dehydration, fatigue, or hunger directly impair cognitive function and decision-making.',
            examples: ['Adequate crew rest', 'Supplemental oxygen above FL100', 'In-flight meals and hydration'],
        },
    ];

    const selected = levels.find(l => l.id === level);

    return (
        <div className="animate-in fade-in grid md:grid-cols-2 gap-8 items-start">
            {/* SVG Pyramid */}
            <div className="p-6 bg-slate-900 rounded-xl border border-slate-700">
                <svg viewBox="0 0 400 320" className="w-full" xmlns="http://www.w3.org/2000/svg">
                    {levels.map((l) => {
                        const i = 5 - l.id; // 0 = top, 4 = bottom
                        const y = 10 + i * 60;
                        const halfW = 40 + i * 40;
                        const cx = 200;
                        const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];
                        const isActive = level === l.id;
                        return (
                            <g key={l.id}
                                onClick={() => setLevel(l.id)}
                                onMouseEnter={() => setLevel(l.id)}
                                className="cursor-pointer"
                            >
                                <polygon
                                    points={`${cx},${y} ${cx + halfW},${y + 52} ${cx - halfW},${y + 52}`}
                                    fill={isActive ? colors[5 - l.id] : `${colors[5 - l.id]}66`}
                                    stroke={isActive ? '#fff' : colors[5 - l.id]}
                                    strokeWidth={isActive ? 2.5 : 1}
                                    className="transition-all duration-300"
                                />
                                <text
                                    x={cx} y={y + 34}
                                    textAnchor="middle"
                                    fill="white"
                                    fontSize={l.id === 5 ? 10 : 11}
                                    fontWeight="bold"
                                    className="pointer-events-none select-none"
                                >
                                    {l.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>
                <p className="text-center text-[10px] text-slate-500 mt-2">Click each level to explore</p>
            </div>

            {/* Expanded Content */}
            <div className="bg-slate-900 p-8 rounded-xl border border-slate-700 min-h-[340px] flex flex-col justify-center">
                {selected ? (
                    <div className="animate-in slide-in-from-right">
                        <div className={`inline-block px-3 py-1 rounded text-xs font-bold text-white mb-4 ${selected.color}`}>
                            Level {selected.id}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">{selected.label}</h3>
                        <p className="text-slate-300 italic mb-4">"{selected.desc}"</p>
                        <p className="text-sm text-slate-400 mb-4">{selected.details}</p>
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-orange-400 uppercase">Aviation Examples:</p>
                            {selected.examples.map((ex, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                                    <ChevronRight size={12} className="text-orange-500 shrink-0" />
                                    {ex}
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-6">
                            Note: Lower needs must be satisfied before higher needs can be addressed.
                        </p>
                    </div>
                ) : (
                    <div className="text-center text-slate-500">
                        <Layers size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Click on the pyramid to explore motivation levels.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ─────────────────────── DEFENCE MECHANISMS (PRESERVED) ─────────────────────── */
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

/* ─────────────────────── BIG FIVE RADAR CHART ─────────────────────── */
const BigFiveRadar = () => {
    const [values, setValues] = useState({ O: 50, C: 80, E: 50, A: 60, N: 30 });

    const traits: {
        code: keyof typeof values;
        name: string;
        low: string;
        high: string;
        aviation: string;
    }[] = [
        { code: 'O', name: 'Openness', low: 'Practical, Routine', high: 'Curious, Flexible', aviation: 'High is generally good (adaptable), but too high may ignore SOPs.' },
        { code: 'C', name: 'Conscientiousness', low: 'Impulsive, Disorganized', high: 'Disciplined, Careful', aviation: 'High is CRITICAL for pilots. The most desired trait.' },
        { code: 'E', name: 'Extroversion', low: 'Reserved, Solitary', high: 'Social, Outgoing', aviation: 'Balance needed. Too high = Distracting. Too low = Poor comms.' },
        { code: 'A', name: 'Agreeableness', low: 'Critical, Suspicious', high: 'Cooperative, Trusting', aviation: 'Balance. Too high = Compliant/Weak (Yes-man). Too low = Hostile.' },
        { code: 'N', name: 'Neuroticism', low: 'Calm, Confident (Stable)', high: 'Anxious, Pessimistic', aviation: 'Low (Stability) is desired. High neuroticism is dangerous.' },
    ];

    // Radar chart geometry
    const cx = 150, cy = 150, maxR = 110;
    const angleOffset = -Math.PI / 2; // start from top

    const getPoint = (index: number, value: number) => {
        const angle = angleOffset + (2 * Math.PI * index) / 5;
        const r = (value / 100) * maxR;
        return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    };

    const gridLevels = [20, 40, 60, 80, 100];
    const traitCodes: (keyof typeof values)[] = ['O', 'C', 'E', 'A', 'N'];
    const dataPoints = traitCodes.map((code, i) => getPoint(i, values[code]));
    const polygonStr = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

    return (
        <div className="animate-in fade-in">
            <h3 className="text-xl font-bold text-white mb-2">The "Big Five" Personality Traits (OCEAN)</h3>
            <p className="text-sm text-slate-400 mb-6">Drag the sliders to build your personality profile and watch the radar chart update in real time.</p>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* SVG Radar */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex items-center justify-center">
                    <svg viewBox="0 0 300 300" className="w-full max-w-[320px]" xmlns="http://www.w3.org/2000/svg">
                        {/* Grid rings */}
                        {gridLevels.map(lv => {
                            const pts = Array.from({ length: 5 }, (_, i) => getPoint(i, lv));
                            return (
                                <polygon
                                    key={lv}
                                    points={pts.map(p => `${p.x},${p.y}`).join(' ')}
                                    fill="none"
                                    stroke="#334155"
                                    strokeWidth={lv === 100 ? 1.5 : 0.5}
                                />
                            );
                        })}
                        {/* Axis lines */}
                        {traitCodes.map((_, i) => {
                            const p = getPoint(i, 100);
                            return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#475569" strokeWidth={0.5} />;
                        })}
                        {/* Data polygon */}
                        <polygon points={polygonStr} fill="rgba(251,146,60,0.25)" stroke="#f97316" strokeWidth={2} className="transition-all duration-200" />
                        {/* Data dots + labels */}
                        {traitCodes.map((code, i) => {
                            const p = getPoint(i, values[code]);
                            const labelP = getPoint(i, 115);
                            return (
                                <g key={code}>
                                    <circle cx={p.x} cy={p.y} r={4} fill="#f97316" stroke="#fff" strokeWidth={1.5} className="transition-all duration-200" />
                                    <text x={labelP.x} y={labelP.y} textAnchor="middle" dominantBaseline="middle" fill="#f97316" fontSize={11} fontWeight="bold">
                                        {code}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* Sliders */}
                <div className="space-y-5">
                    {traits.map(t => (
                        <div key={t.code} className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-7 h-7 rounded-full bg-orange-600 flex items-center justify-center font-black text-white text-xs shadow-lg shrink-0">
                                    {t.code}
                                </div>
                                <span className="font-bold text-white text-sm">{t.name}</span>
                                <span className="ml-auto text-orange-400 font-mono text-sm font-bold">{values[t.code]}%</span>
                            </div>
                            <input
                                type="range" min={0} max={100} value={values[t.code]}
                                onChange={e => setValues(prev => ({ ...prev, [t.code]: Number(e.target.value) }))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                <span>{t.low}</span>
                                <span>{t.high}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-2">
                                <strong className="text-orange-400">Aviation:</strong> {t.aviation}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 p-4 bg-slate-900 rounded-lg border border-slate-700 text-center">
                <p className="text-sm text-slate-400 italic">
                    "Personality is stable and hard to change. Attitudes are unstable and can be changed."
                </p>
            </div>
        </div>
    );
};

/* ─────────────────────── HAZARDOUS ATTITUDES QUIZ ─────────────────────── */
interface QuizOption {
    text: string;
    attitude: string;
}
interface QuizQuestion {
    scenario: string;
    options: QuizOption[];
}

const quizQuestions: QuizQuestion[] = [
    {
        scenario: 'The weather is marginal VFR and deteriorating. You planned this flight for weeks. Your passengers are eager. What do you do?',
        options: [
            { text: '"I\'ve flown in worse. Let\'s go."', attitude: 'Macho' },
            { text: '"We\'ll be fine — bad things happen to other pilots, not me."', attitude: 'Invulnerability' },
            { text: '"Let\'s wait for an update and reassess in 30 minutes."', attitude: 'Safe' },
        ],
    },
    {
        scenario: 'ATC asks you to hold short of the runway while an aircraft lands. You are already running 15 minutes late.',
        options: [
            { text: '"I can make it across before they land. Going now!"', attitude: 'Impulsivity' },
            { text: '"Who are they to tell me what to do? I\'m the PIC."', attitude: 'Anti-Authority' },
            { text: '"Roger, holding short. Safety first."', attitude: 'Safe' },
        ],
    },
    {
        scenario: 'During cruise, you notice an unusual vibration. Your co-pilot hasn\'t noticed anything.',
        options: [
            { text: '"It\'s probably nothing. The aircraft is fine."', attitude: 'Invulnerability' },
            { text: '"There\'s nothing I can do about it anyway."', attitude: 'Resignation' },
            { text: '"Let me run through the checklist and report it."', attitude: 'Safe' },
        ],
    },
    {
        scenario: 'Your instructor recommends a go-around during an unstable approach. You feel you can still land it.',
        options: [
            { text: '"I can handle this. Watch me nail it."', attitude: 'Macho' },
            { text: '"The regulations are too conservative. I know my limits."', attitude: 'Anti-Authority' },
            { text: '"Going around. Better safe than sorry."', attitude: 'Safe' },
        ],
    },
    {
        scenario: 'You forgot to file a NOTAM check before departure. You\'re already at the holding point ready to go.',
        options: [
            { text: '"Let\'s just go — I don\'t want to delay further."', attitude: 'Impulsivity' },
            { text: '"If there were anything important, someone would have told me."', attitude: 'Resignation' },
            { text: '"Let me call ops and check quickly before departure."', attitude: 'Safe' },
        ],
    },
];

const attitudeAntidotes: Record<string, { icon: React.ReactNode; color: string; antidote: string; description: string }> = {
    'Anti-Authority': { icon: <Shield size={18} />, color: '#ef4444', antidote: 'Follow the rules — they are usually right.', description: '"Don\'t tell me what to do!" — Resents rules, procedures, and authority figures.' },
    'Impulsivity': { icon: <Zap size={18} />, color: '#f59e0b', antidote: 'Not so fast — think first.', description: '"Do something — quickly!" — Acts without thinking through consequences.' },
    'Invulnerability': { icon: <Shield size={18} />, color: '#3b82f6', antidote: 'It could happen to me.', description: '"It won\'t happen to me." — Believes accidents only happen to others.' },
    'Macho': { icon: <TrendingUp size={18} />, color: '#a855f7', antidote: 'Taking chances is foolish.', description: '"I can do it — watch!" — Tries to prove themselves, takes unnecessary risks.' },
    'Resignation': { icon: <AlertTriangle size={18} />, color: '#64748b', antidote: 'I\'m not helpless — I can make a difference.', description: '"What\'s the use?" — Gives up, feels nothing they do matters.' },
};

const HazardousAttitudesQuiz = () => {
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [selected, setSelected] = useState<number | null>(null);
    const [showResults, setShowResults] = useState(false);

    const handleSelect = (optionIndex: number) => {
        setSelected(optionIndex);
    };

    const handleNext = () => {
        if (selected === null) return;
        const attitude = quizQuestions[currentQ].options[selected].attitude;
        const newAnswers = [...answers, attitude];
        setAnswers(newAnswers);
        setSelected(null);

        if (currentQ + 1 >= quizQuestions.length) {
            setShowResults(true);
        } else {
            setCurrentQ(currentQ + 1);
        }
    };

    const handleReset = () => {
        setCurrentQ(0);
        setAnswers([]);
        setSelected(null);
        setShowResults(false);
    };

    // Tally results
    const tally: Record<string, number> = {};
    const hazardousAnswers = answers.filter(a => a !== 'Safe');
    hazardousAnswers.forEach(a => { tally[a] = (tally[a] || 0) + 1; });
    const safeCount = answers.filter(a => a === 'Safe').length;
    const maxAttitude = Object.entries(tally).sort((a, b) => b[1] - a[1])[0];

    if (showResults) {
        return (
            <div className="animate-in fade-in">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Target className="text-orange-400" /> Hazardous Attitudes — Your Results
                </h3>

                {hazardousAnswers.length === 0 ? (
                    <div className="bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-xl mt-4 text-center">
                        <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-3" />
                        <p className="text-lg font-bold text-emerald-400">Excellent airmanship!</p>
                        <p className="text-sm text-slate-300 mt-2">You selected the safe option every time. Keep applying the antidotes!</p>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-slate-400 mb-6">Safe choices: {safeCount}/{answers.length}. Review your hazardous tendencies below.</p>

                        {/* Bar Chart */}
                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 mb-6 space-y-4">
                            {Object.keys(attitudeAntidotes).map(att => {
                                const count = tally[att] || 0;
                                const pct = (count / answers.length) * 100;
                                const info = attitudeAntidotes[att];
                                return (
                                    <div key={att}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span style={{ color: info.color }}>{info.icon}</span>
                                            <span className="text-sm font-bold text-white">{att}</span>
                                            <span className="ml-auto text-xs text-slate-400">{count} / {answers.length}</span>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-700"
                                                style={{ width: `${pct}%`, backgroundColor: info.color }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Dominant Attitude + Antidote */}
                        {maxAttitude && (
                            <div className="bg-orange-900/15 border border-orange-500/30 p-6 rounded-xl">
                                <p className="text-xs uppercase font-bold text-orange-400 mb-2">Your dominant hazardous attitude</p>
                                <h4 className="text-2xl font-bold text-white mb-2">{maxAttitude[0]}</h4>
                                <p className="text-sm text-slate-300 mb-4">{attitudeAntidotes[maxAttitude[0]].description}</p>
                                <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-orange-500">
                                    <p className="text-xs uppercase font-bold text-orange-400 mb-1">Antidote</p>
                                    <p className="text-white font-bold text-lg">"{attitudeAntidotes[maxAttitude[0]].antidote}"</p>
                                </div>
                            </div>
                        )}
                    </>
                )}

                <button onClick={handleReset} className="mt-6 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-colors">
                    Retake Quiz
                </button>
            </div>
        );
    }

    const q = quizQuestions[currentQ];

    return (
        <div className="animate-in fade-in">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <AlertTriangle className="text-orange-400" /> Hazardous Attitudes Self-Check
            </h3>
            <p className="text-sm text-slate-400 mb-6">5 aviation scenarios. Pick your instinctive response — be honest!</p>

            {/* Progress */}
            <div className="flex gap-1 mb-6">
                {quizQuestions.map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < currentQ ? 'bg-orange-500' : i === currentQ ? 'bg-orange-400 animate-pulse' : 'bg-slate-700'}`} />
                ))}
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <p className="text-xs uppercase font-bold text-slate-500 mb-2">Scenario {currentQ + 1} of {quizQuestions.length}</p>
                <p className="text-white font-medium text-base mb-6 leading-relaxed">{q.scenario}</p>

                <div className="space-y-3">
                    {q.options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => handleSelect(i)}
                            className={`w-full text-left p-4 rounded-lg border transition-all text-sm
                                ${selected === i
                                    ? 'bg-orange-600/20 border-orange-500 text-white'
                                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
                                }`}
                        >
                            {opt.text}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    disabled={selected === null}
                    className={`mt-6 px-6 py-3 font-bold rounded-lg transition-all flex items-center gap-2
                        ${selected !== null ? 'bg-orange-600 hover:bg-orange-500 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                >
                    {currentQ + 1 >= quizQuestions.length ? 'See Results' : 'Next Scenario'}
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

/* ─────────────────────── YERKES-DODSON CURVE ─────────────────────── */
const YerkesDodsonCurve = () => {
    const [arousal, setArousal] = useState(50);

    // Generate a smooth inverted-U curve
    const w = 500, h = 280;
    const padL = 50, padR = 20, padT = 20, padB = 50;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    const curvePoints: { x: number; y: number }[] = [];
    for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        // inverted-U  y = -4*(t-0.5)^2 + 1   range [0, 1]
        const perf = -4 * (t - 0.5) * (t - 0.5) + 1;
        curvePoints.push({
            x: padL + t * plotW,
            y: padT + (1 - perf) * plotH,
        });
    }
    const pathD = curvePoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

    // Dot position on curve
    const dotT = arousal / 100;
    const dotPerf = -4 * (dotT - 0.5) * (dotT - 0.5) + 1;
    const dotX = padL + dotT * plotW;
    const dotY = padT + (1 - dotPerf) * plotH;

    // Zone info
    const getZone = (val: number): { zone: string; color: string; description: string; examples: string[] } => {
        if (val < 30) return {
            zone: 'Under-Aroused',
            color: '#3b82f6',
            description: 'Boredom, complacency, low vigilance. The pilot is on "autopilot" mentally — not monitoring instruments or environment.',
            examples: ['Long cruise in smooth air', 'Routine repetitive tasks', 'Night flights with low workload'],
        };
        if (val <= 70) return {
            zone: 'Optimal Arousal',
            color: '#22c55e',
            description: 'Peak performance zone. Alert, focused, and responsive. The ideal state for flight operations.',
            examples: ['Active approach and landing', 'Busy controlled airspace', 'Normal workload with good SA'],
        };
        return {
            zone: 'Over-Aroused',
            color: '#ef4444',
            description: 'Panic, tunnel vision, cognitive overload. Decision-making deteriorates rapidly. May freeze or act impulsively.',
            examples: ['Engine failure after takeoff', 'Unexpected severe weather', 'Multiple system failures'],
        };
    };

    const zone = getZone(arousal);

    return (
        <div className="animate-in fade-in">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Activity className="text-orange-400" /> Yerkes-Dodson Law
            </h3>
            <p className="text-sm text-slate-400 mb-6">Performance increases with arousal — but only to a point. Move the slider to explore the curve.</p>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* SVG Curve */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" xmlns="http://www.w3.org/2000/svg">
                        {/* Axis lines */}
                        <line x1={padL} y1={padT} x2={padL} y2={h - padB} stroke="#475569" strokeWidth={1.5} />
                        <line x1={padL} y1={h - padB} x2={w - padR} y2={h - padB} stroke="#475569" strokeWidth={1.5} />

                        {/* Axis labels */}
                        <text x={padL - 10} y={(padT + h - padB) / 2} textAnchor="middle" fill="#94a3b8" fontSize={11} fontWeight="bold" transform={`rotate(-90, ${padL - 10}, ${(padT + h - padB) / 2})`}>
                            Performance
                        </text>
                        <text x={(padL + w - padR) / 2} y={h - 8} textAnchor="middle" fill="#94a3b8" fontSize={11} fontWeight="bold">
                            Arousal Level
                        </text>

                        {/* Zone backgrounds */}
                        <rect x={padL} y={padT} width={plotW * 0.3} height={plotH} fill="#3b82f6" opacity={0.06} />
                        <rect x={padL + plotW * 0.3} y={padT} width={plotW * 0.4} height={plotH} fill="#22c55e" opacity={0.06} />
                        <rect x={padL + plotW * 0.7} y={padT} width={plotW * 0.3} height={plotH} fill="#ef4444" opacity={0.06} />

                        {/* Zone labels */}
                        <text x={padL + plotW * 0.15} y={h - padB - 8} textAnchor="middle" fill="#3b82f6" fontSize={9} opacity={0.8}>BORED</text>
                        <text x={padL + plotW * 0.5} y={padT + 16} textAnchor="middle" fill="#22c55e" fontSize={9} opacity={0.8}>OPTIMAL</text>
                        <text x={padL + plotW * 0.85} y={h - padB - 8} textAnchor="middle" fill="#ef4444" fontSize={9} opacity={0.8}>PANIC</text>

                        {/* Curve */}
                        <path d={pathD} fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" />

                        {/* Moving dot */}
                        <circle cx={dotX} cy={dotY} r={8} fill={zone.color} stroke="#fff" strokeWidth={2} className="transition-all duration-150" />

                        {/* Vertical dashed line from dot */}
                        <line x1={dotX} y1={dotY} x2={dotX} y2={h - padB} stroke={zone.color} strokeWidth={1} strokeDasharray="4 3" opacity={0.5} className="transition-all duration-150" />
                    </svg>

                    {/* Slider */}
                    <div className="mt-4">
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Arousal Level: {arousal}%</label>
                        <input
                            type="range" min={0} max={100} value={arousal}
                            onChange={e => setArousal(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                            <span>Low (Bored)</span>
                            <span>Moderate</span>
                            <span>High (Panic)</span>
                        </div>
                    </div>
                </div>

                {/* Zone Info */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 min-h-[300px] flex flex-col justify-center">
                    <div className="animate-in fade-in" key={zone.zone}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: zone.color }} />
                            <h4 className="text-xl font-bold text-white">{zone.zone}</h4>
                        </div>
                        <p className="text-sm text-slate-300 mb-4 leading-relaxed">{zone.description}</p>
                        <p className="text-xs font-bold text-orange-400 uppercase mb-2">Aviation Examples</p>
                        <div className="space-y-2">
                            {zone.examples.map((ex, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                                    <ChevronRight size={12} className="text-orange-500 shrink-0" />
                                    {ex}
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 p-3 bg-slate-800 rounded-lg border border-slate-700">
                            <p className="text-[11px] text-slate-400">
                                <strong className="text-orange-400">Performance:</strong> {Math.round(Math.max(0, dotPerf) * 100)}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-700 text-center">
                <p className="text-sm text-slate-400 italic">
                    "An inverted-U relationship exists between arousal and performance. Too little arousal = complacency. Too much = panic."
                </p>
            </div>
        </div>
    );
};

export default HPLPersonality;
