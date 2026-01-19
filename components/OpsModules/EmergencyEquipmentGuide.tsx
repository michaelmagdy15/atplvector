import React, { useState } from 'react';
import { Shield, AlertTriangle, Users, Flame, Wind, Anchor } from 'lucide-react';

const EmergencyEquipmentGuide: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>('fire');

    const categories = [
        { id: 'fire', label: 'Fire Extinguishers', icon: Flame },
        { id: 'oxy', label: 'Oxygen', icon: Wind },
        { id: 'life', label: 'Life Saving', icon: Anchor },
        { id: 'cabin', label: 'Cabin Crew', icon: Users },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8 text-blue-400" />
                <div>
                    <h2 className="text-2xl font-bold text-white">Emergency Equipment</h2>
                    <p className="text-slate-400 text-sm">Requirements based on MOPSC and MCTOM.</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeCategory === cat.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
                            }`}
                    >
                        <cat.icon className="w-4 h-4" />
                        {cat.label}
                    </button>
                ))}
            </div>

            <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-6">
                {activeCategory === 'fire' && <FireExtinguishers />}
                {activeCategory === 'oxy' && <OxygenEquipment />}
                {activeCategory === 'life' && <LifeSavingEquipment />}
                {activeCategory === 'cabin' && <CabinCrewRequirements />}
            </div>
        </div>
    );
};

const FireExtinguishers = () => {
    const cabinReqs = [
        { seats: '7-30', count: 1 },
        { seats: '31-60', count: 2 },
        { seats: '61-200', count: 3 },
        { seats: '201-300', count: 4 },
        { seats: '301-400', count: 5 },
        { seats: '401-500', count: 6 },
        { seats: '500+', count: '6 + 1 per 100 (max 8)' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-bold text-white mb-4">Cabin Requirements</h3>
                    <div className="bg-slate-900 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-800">
                                <tr>
                                    <th className="p-3 text-left text-slate-400 font-bold">MOPSC</th>
                                    <th className="p-3 text-right text-slate-400 font-bold">Extinguishers</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cabinReqs.map((r, i) => (
                                    <tr key={i} className="border-t border-slate-800">
                                        <td className="p-3 text-white">{r.seats} seats</td>
                                        <td className="p-3 text-right font-bold text-blue-400">{r.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-white mb-4">Additional Requirements</h3>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <div className="text-2xl font-black text-red-400 mb-1">+1</div>
                        <div className="text-white font-bold">Cockpit</div>
                        <div className="text-xs text-slate-400">Always required</div>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <div className="text-2xl font-black text-orange-400 mb-1">+1</div>
                        <div className="text-white font-bold">Per Galley</div>
                        <div className="text-xs text-slate-400">If not covered by minimum</div>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <div className="text-2xl font-black text-yellow-400 mb-1">+1</div>
                        <div className="text-white font-bold">Per Cargo Compartment</div>
                        <div className="text-xs text-slate-400">Accessible in flight</div>
                    </div>
                </div>
            </div>

            <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                <h4 className="font-bold text-blue-300 mb-2">Crash Axe / Crowbar</h4>
                <p className="text-sm text-slate-300">
                    Required if <strong>MCTOM &gt;5700kg AND MOPSC &gt;9</strong>. Located on flight deck.
                    Additional one in rear galley if <strong>MOPSC &gt;200</strong>.
                </p>
            </div>
        </div>
    );
};

const OxygenEquipment = () => {
    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4">First Aid Oxygen (Therapeutic)</h3>
                    <ul className="space-y-3 text-sm text-slate-300">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400">•</span>
                            Undiluted oxygen for passengers/crew after decompression
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400">•</span>
                            Required on pressurized flights &gt;25,000ft or cabin alt &gt;8,000ft
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400">•</span>
                            Minimum <strong>2 dispensing units</strong>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400">•</span>
                            Average flow rate: <strong>3 L/min STPD</strong> (starts at 4, min 2)
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400">•</span>
                            Enough for <strong>2% of passengers</strong> (never less than 1)
                        </li>
                    </ul>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4">Supplemental Oxygen</h3>
                    <ul className="space-y-3 text-sm text-slate-300">
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400">•</span>
                            Total dispensing outlets must exceed seats by <strong>10%</strong>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400">•</span>
                            Quick-donning masks on flight deck when operating &gt;25,000ft
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400">•</span>
                            Cabin altitude horn sounds &gt;10,000ft
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400">•</span>
                            Utility checked before taxi, demonstrated before T/O
                        </li>
                    </ul>
                </div>
            </div>

            <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/30 flex items-center gap-3">
                <AlertTriangle className="text-yellow-400 shrink-0" />
                <p className="text-sm text-yellow-200">
                    Maximum altitude without oxygen for 100% efficiency: <strong>8,000ft</strong>
                </p>
            </div>
        </div>
    );
};

const LifeSavingEquipment = () => {
    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-900 p-6 rounded-xl border border-blue-500/30">
                    <div className="text-3xl mb-3">🦺</div>
                    <h3 className="font-bold text-white mb-2">Life Jackets</h3>
                    <p className="text-sm text-slate-400 mb-3">Required for each person when:</p>
                    <ul className="text-xs text-slate-300 space-y-1">
                        <li>• &gt;50nm from shore</li>
                        <li>• T/O or landing could result in ditching</li>
                        <li>• Must have locator light</li>
                    </ul>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-orange-500/30">
                    <div className="text-3xl mb-3">🛟</div>
                    <h3 className="font-bold text-white mb-2">Life Rafts</h3>
                    <p className="text-sm text-slate-400 mb-3">Required when:</p>
                    <ul className="text-xs text-slate-300 space-y-1">
                        <li>• &gt;120 mins at cruise speed from land</li>
                        <li>• OR &gt;400nm (whichever is least)</li>
                        <li>• +1 spare of largest capacity</li>
                    </ul>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-red-500/30">
                    <div className="text-3xl mb-3">📡</div>
                    <h3 className="font-bold text-white mb-2">ELT</h3>
                    <p className="text-sm text-slate-400 mb-3">Emergency Locator Transmitter:</p>
                    <ul className="text-xs text-slate-300 space-y-1">
                        <li>• Transmits 121.5 + 406 MHz</li>
                        <li>• Battery lasts 48 hours</li>
                        <li>• MOPSC &lt;19: 1 of any type</li>
                        <li>• MOPSC &gt;19: 1 auto OR 2 any</li>
                    </ul>
                </div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4">Emergency Slides</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <span className="text-blue-400 font-bold">Height Threshold:</span>
                        <p>Slides required if door sill &gt;1.83m (6ft) above ground</p>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <span className="text-blue-400 font-bold">Testing:</span>
                        <p>Tested with gear extended (pre-2000) or collapsed (post-2000)</p>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <span className="text-blue-400 font-bold">Inflation:</span>
                        <p>Self-contained inflator. Manual handle as backup.</p>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <span className="text-red-400 font-bold">Note:</span>
                        <p>Slide won't inflate if opened from outside!</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4">Emergency Lighting</h3>
                <ul className="text-sm text-slate-300 space-y-2">
                    <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        Lighting must remain on for <strong>10 minutes</strong> after activation
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        Lighting is <strong>ARMED</strong> in normal flight
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        General illumination, floor level lighting, and exit signs required if MOPSC &gt;9
                    </li>
                </ul>
            </div>
        </div>
    );
};

const CabinCrewRequirements = () => {
    const requirements = [
        { mopsc: '1-19', crew: 0, note: 'No cabin crew required' },
        { mopsc: '20-50', crew: 1, note: '1 per 50 pax seats' },
        { mopsc: '51-100', crew: 2, note: '' },
        { mopsc: '101-150', crew: 3, note: '' },
        { mopsc: '151-200', crew: 4, note: '' },
        { mopsc: '201+', crew: '1 per 50', note: 'Plus one per deck if >100 pax per deck' },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-slate-900 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-800">
                        <tr>
                            <th className="p-4 text-left text-slate-400 font-bold">MOPSC</th>
                            <th className="p-4 text-center text-slate-400 font-bold">Min Cabin Crew</th>
                            <th className="p-4 text-left text-slate-400 font-bold">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requirements.map((r, i) => (
                            <tr key={i} className="border-t border-slate-800">
                                <td className="p-4 text-white font-bold">{r.mopsc}</td>
                                <td className="p-4 text-center">
                                    <span className="text-2xl font-black text-blue-400">{r.crew}</span>
                                </td>
                                <td className="p-4 text-sm text-slate-400">{r.note}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-emerald-900/20 p-4 rounded-lg border border-emerald-500/30">
                    <h4 className="font-bold text-emerald-300 mb-2">Megaphone Requirement</h4>
                    <p className="text-sm text-slate-300">
                        Required if <strong>MOPSC &gt;60</strong>. Additional +1 if &gt;100 per deck.
                    </p>
                </div>

                <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                    <h4 className="font-bold text-blue-300 mb-2">First Aid Kits</h4>
                    <p className="text-sm text-slate-300">
                        Minimum <strong>1 per 100 seats</strong>. Maximum 6 if &gt;500 seats. Must be readily accessible.
                    </p>
                </div>
            </div>

            <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/30">
                <h4 className="font-bold text-red-300 mb-2">Emergency Medical Kit</h4>
                <p className="text-sm text-slate-300">
                    Required if <strong>MOPSC &gt;30</strong> OR flight is &gt;60 mins from qualified medical assistance.
                    Includes syringes, defibrillators, drugs. Kept secure in flight deck compartment.
                </p>
            </div>
        </div>
    );
};

export default EmergencyEquipmentGuide;
