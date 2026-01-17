
import React, { useState } from 'react';
import { Shield, AlertTriangle, Users, BookOpen, Activity } from 'lucide-react';

const HPLSafetyCulture: React.FC = () => {
    const [tab, setTab] = useState<'cheese' | 'culture' | 'sms'>('cheese');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Shield className="text-emerald-400" />
                        Safety Culture & SMS (040.01.04)
                    </h2>
                    <p className="text-slate-400 text-sm">Organizational safety, Swiss Cheese Model, and Just Culture.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg">
                    <button onClick={() => setTab('cheese')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'cheese' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>Swiss Cheese</button>
                    <button onClick={() => setTab('culture')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'culture' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>Safety Culture</button>
                    <button onClick={() => setTab('sms')} className={`px-4 py-2 rounded-md font-bold text-sm ${tab === 'sms' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}>SMS</button>
                </div>
            </div>

            {tab === 'cheese' && <SwissCheeseModel />}
            {tab === 'culture' && <SafetyCultureView />}
            {tab === 'sms' && <SMSView />}
        </div>
    );
};

const SwissCheeseModel = () => {
    const [holes, setHoles] = useState([false, false, false, false]);

    const toggleHole = (idx: number) => {
        const newHoles = [...holes];
        newHoles[idx] = !newHoles[idx];
        setHoles(newHoles);
    };

    const isAccident = holes.every(h => h === true);

    const layers = [
        { name: 'Organization', desc: 'Latent Failures. Culture, Resource allocation, Cost cutting.' },
        { name: 'Supervision', desc: 'Latent Failures. Inadequate training, Poor scheduling.' },
        { name: 'Preconditions', desc: 'Latent/Active. Fatigue, Stress, Poor equipment.' },
        { name: 'Unsafe Acts', desc: 'Active Failures. Errors (Slips/Mistakes) & Violations.' }
    ];

    return (
        <div className="animate-in fade-in">
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white">James Reason's Swiss Cheese Model</h3>
                <p className="text-sm text-slate-400">Accidents occur when holes (failures) in all defenses align.</p>
            </div>

            <div className="relative h-64 bg-slate-900 rounded-xl border border-slate-700 mb-8 flex items-center justify-between px-8 overflow-hidden max-w-4xl mx-auto">
                {/* Hazard */}
                <div className="z-10 flex flex-col items-center">
                    <AlertTriangle className="text-red-500 w-12 h-12 relative z-10 animate-bounce" />
                    <span className="text-xs font-bold text-red-500 mt-2">THREAT</span>
                </div>

                {/* Laser Line */}
                <div className={`absolute left-16 right-16 h-1 transition-colors duration-300 z-0 ${isAccident ? 'bg-red-500 shadow-[0_0_15px_red]' : 'bg-slate-700'}`}></div>

                {/* Slices */}
                {layers.map((layer, idx) => {
                    const isOpen = holes[idx];
                    return (
                        <div
                            key={idx}
                            onClick={() => toggleHole(idx)}
                            className={`
                                 relative z-10 w-8 h-48 rounded cursor-pointer transition-all duration-500 flex flex-col items-center justify-center group
                                 ${isOpen ? 'bg-slate-800 border-2 border-dashed border-slate-600' : 'bg-yellow-500 border-2 border-yellow-400 shadow-xl'}
                             `}
                        >
                            {/* Holes Visual */}
                            {!isOpen && (
                                <>
                                    <div className="w-2 h-2 bg-slate-900 rounded-full absolute top-4 left-1 opacity-50"></div>
                                    <div className="w-3 h-3 bg-slate-900 rounded-full absolute bottom-8 right-2 opacity-50"></div>
                                    <div className="w-1 h-1 bg-slate-900 rounded-full absolute top-12 right-2 opacity-50"></div>
                                </>
                            )}

                            {isOpen && <div className="w-4 h-4 rounded-full bg-red-500/20 animate-ping absolute"></div>}

                            {/* Tooltip */}
                            <div className="absolute -top-24 bg-black/90 text-white text-xs p-2 rounded w-32 text-center opacity-0 group-hover:opacity-100 transition pointer-events-none z-30">
                                <strong>{layer.name}</strong>
                                <p className="font-light mt-1">{layer.desc}</p>
                            </div>

                            <span className="absolute -bottom-8 text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap">{layer.name}</span>
                        </div>
                    );
                })}

                {/* Accident */}
                <div className="z-10 flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isAccident ? 'bg-red-600 text-white scale-125' : 'bg-slate-800 text-slate-600'}`}>
                        <Activity />
                    </div>
                    <span className={`text-xs font-bold mt-2 ${isAccident ? 'text-red-500' : 'text-slate-600'}`}>ACCIDENT</span>
                </div>
            </div>

            <p className="text-center text-xs text-slate-500 italic">Click on the cheese slices to align/misalign the holes.</p>
        </div>
    );
};

const SafetyCultureView = () => (
    <div className="animate-in fade-in grid md:grid-cols-2 gap-8">
        <div>
            <h3 className="font-bold text-white mb-4">The 5 Components of Safety Culture</h3>
            <div className="space-y-3">
                <div className="bg-slate-900 p-3 rounded-lg border-l-4 border-emerald-500">
                    <h4 className="font-bold text-emerald-400 text-sm">1. Informed Culture</h4>
                    <p className="text-xs text-slate-300">People know current knowledge about human, technical, and organizational factors.</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border-l-4 border-sky-500">
                    <h4 className="font-bold text-sky-400 text-sm">2. Reporting Culture</h4>
                    <p className="text-xs text-slate-300">People are prepared to report their errors and experiences.</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-bold text-blue-400 text-sm">3. Learning Culture</h4>
                    <p className="text-xs text-slate-300">Organization has the will and competence to draw conclusions from safety info.</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border-l-4 border-purple-500">
                    <h4 className="font-bold text-purple-400 text-sm">4. Just Culture</h4>
                    <p className="text-xs text-slate-300">Atmosphere of trust. No punishment for honest errors. Gross negligence IS punished.</p>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border-l-4 border-indigo-500">
                    <h4 className="font-bold text-indigo-400 text-sm">5. Flexible Culture</h4>
                    <p className="text-xs text-slate-300">Able to reconfigure facing high tempo operations or danger.</p>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="font-bold text-white mb-4">National Culture (Hofstede)</h3>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border-r border-slate-700 pr-4">
                            <h4 className="font-bold text-white text-sm">Power Distance (PDI)</h4>
                            <p className="text-xs text-slate-400 mt-1">
                                High PDI (e.g., some Asian/Latin countries) = Subordinates hesitate to question Captain.
                                <br /><span className="text-red-400">Risk:</span> Steep cockpit gradient. Communication barrier.
                            </p>
                        </div>
                        <div className="pl-4">
                            <h4 className="font-bold text-white text-sm">Individualism (IDV)</h4>
                            <p className="text-xs text-slate-400 mt-1">
                                High IDV (e.g., USA/Europe) = Focus on self.
                                <br />Low IDV = Focus on Group/Face.
                                <br /><span className="text-emerald-400">Goal:</span> Balanced cockpit culture regardless of nationality.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white mb-4">Just vs Non-Punitive</h4>
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-red-900/20 rounded flex items-center justify-center shrink-0">
                            <span className="text-2xl">❌</span>
                        </div>
                        <div>
                            <h5 className="font-bold text-red-400 text-sm">Non-Punitive (Total Immunity)</h5>
                            <p className="text-xs text-slate-400">"No matter what you do, you won't be punished." <br /> BAD. Encourages recklessness/negligence.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-emerald-900/20 rounded flex items-center justify-center shrink-0">
                            <span className="text-2xl">✅</span>
                        </div>
                        <div>
                            <h5 className="font-bold text-emerald-400 text-sm">Just Culture</h5>
                            <p className="text-xs text-slate-400">Honest mistakes = No punishment. <br />Gross Negligence / Wilful Violation = Punishment.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white mb-2">Open vs Closed Culture</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-slate-800 p-2 rounded">
                        <span className="text-emerald-400 font-bold block">OPEN</span>
                        <span className="text-[10px] text-slate-400">Reports encouraged.<br />Flight data analyzed.<br />Feedback given.</span>
                    </div>
                    <div className="bg-slate-800 p-2 rounded">
                        <span className="text-red-400 font-bold block">CLOSED</span>
                        <span className="text-[10px] text-slate-400">Reports hidden.<br />Blame culture.<br />Information suppressed.</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const SMSView = () => (
    <div className="animate-in fade-in">
        <h3 className="font-bold text-white mb-4">Safety Management System (SMS)</h3>
        <p className="text-sm text-slate-400 mb-6 font-bold text-center italic">"Safety First"</p>

        <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h4 className="text-emerald-400 font-bold mb-2">Hazard Identification</h4>
                <p className="text-xs text-slate-300">
                    Proactive method of identifying risks before they become accidents. (FDA, LOSA, Reporting).
                </p>
            </div>
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h4 className="text-emerald-400 font-bold mb-2">Risk Management</h4>
                <p className="text-xs text-slate-300">
                    Assessing the probability and severity of a hazard. ALARP (As Low As Reasonably Practicable).
                </p>
            </div>
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h4 className="text-emerald-400 font-bold mb-2">Safety Assurance</h4>
                <p className="text-xs text-slate-300">
                    Monitoring the effectiveness of safety strategies. Audits and feedback.
                </p>
            </div>
        </div>
    </div>
);

export default HPLSafetyCulture;
