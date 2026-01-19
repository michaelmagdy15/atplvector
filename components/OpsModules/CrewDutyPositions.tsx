import React, { useState } from 'react';
import { Users, Plane, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const CrewDutyPositions: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'positions' | 'duties' | 'refueling'>('positions');

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-2">
                <Users className="w-8 h-8 text-blue-400" />
                <div>
                    <h2 className="text-2xl font-bold text-white">Crew Composition & Duties</h2>
                    <p className="text-slate-400 text-sm">Flight deck positions, duties, and special procedures.</p>
                </div>
            </div>

            <div className="flex gap-2 bg-slate-800/50 p-1 rounded-xl w-fit border border-slate-700">
                {[
                    { id: 'positions', label: 'Duty Positions' },
                    { id: 'duties', label: 'Crew Duties' },
                    { id: 'refueling', label: 'Refueling with Pax' },
                ].map(t => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id as any)}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === t.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {activeTab === 'positions' && <DutyPositionsSection />}
            {activeTab === 'duties' && <CrewDutiesSection />}
            {activeTab === 'refueling' && <RefuelingSection />}
        </div>
    );
};

const DutyPositionsSection = () => {
    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Plane className="w-5 h-5 text-blue-400" />
                        Flight Crew Requirements
                    </h3>
                    <ul className="space-y-4 text-sm text-slate-300">
                        <li className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Minimum <strong>1 PIC</strong> for all operations</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>Minimum <strong>2 flight crew</strong> for IFR/Night on turboprops with MOPSC &gt;9 or turbojets</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                            <span>Only <strong>1 inexperienced</strong> flight crew member per flight</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <span>≥1 suitably qualified pilot at controls at all times</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-purple-400" />
                        Station Requirements
                    </h3>
                    <ul className="space-y-4 text-sm text-slate-300">
                        <li className="bg-slate-800 p-3 rounded-lg">
                            <span className="text-white font-bold block mb-1">Cabin Crew</span>
                            Stationed for <strong>take-off and landing</strong>
                        </li>
                        <li className="bg-slate-800 p-3 rounded-lg">
                            <span className="text-white font-bold block mb-1">Flight Crew</span>
                            Always at stations except for <strong>physiological needs</strong>
                        </li>
                        <li className="bg-slate-800 p-3 rounded-lg">
                            <span className="text-white font-bold block mb-1">Controlled Rest</span>
                            Permitted if Commander decides (not a qualifying rest period)
                        </li>
                    </ul>
                </div>
            </div>

            {/* Seat Belt Rules */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4">Seat Belt & Harness Rules</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-center">
                        <div className="text-2xl mb-2">🛫</div>
                        <div className="font-bold text-white">Take-Off</div>
                        <div className="text-sm text-slate-400">Pilots strapped in</div>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-center">
                        <div className="text-2xl mb-2">🛬</div>
                        <div className="font-bold text-white">Landing</div>
                        <div className="text-sm text-slate-400">Pilots strapped in</div>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-center">
                        <div className="text-2xl mb-2">💺</div>
                        <div className="font-bold text-white">Cruise</div>
                        <div className="text-sm text-slate-400">Safety belt always fastened while seated</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CrewDutiesSection = () => {
    const preventDuties = [
        "People in parts of the plane not designed for accommodation",
        "Passengers using portable electronic devices improperly",
        "Boarding of intoxicated individuals",
        "Unauthorized admission to the flight deck",
        "Carriage of unauthorized people/cargo"
    ];

    return (
        <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-red-500/30">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    Crew Must PREVENT:
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                    {preventDuties.map((duty, i) => (
                        <div key={i} className="flex items-start gap-2 bg-red-900/20 p-3 rounded-lg border border-red-500/20">
                            <span className="text-red-400">✕</span>
                            <span className="text-sm text-slate-300">{duty}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4">Commander Authority</h3>
                    <ul className="space-y-3 text-sm text-slate-300">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400">•</span>
                            Responsible for following Operations Manual procedures
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400">•</span>
                            May deviate from Ops Manual <strong>only in emergencies</strong>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400">•</span>
                            Must allow ramp inspectors access to flight deck unless safety impacted
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400">•</span>
                            Must be notified of special passengers and inadmissible persons
                        </li>
                    </ul>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4">Special Passengers</h3>
                    <ul className="space-y-2 text-sm text-slate-300">
                        <li className="bg-slate-800 p-2 rounded">Children under 12</li>
                        <li className="bg-slate-800 p-2 rounded">PRMs (Persons with Reduced Mobility)</li>
                        <li className="bg-slate-800 p-2 rounded">Inadmissible Persons</li>
                        <li className="bg-slate-800 p-2 rounded">Deportees</li>
                        <li className="bg-slate-800 p-2 rounded">Persons in Custody</li>
                    </ul>
                    <div className="mt-4 text-xs text-slate-500">
                        Cannot sit where they impede crew, access to emergency equipment, or evacuation.
                    </div>
                </div>
            </div>

            <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                <h4 className="font-bold text-blue-300 mb-2">Language Requirements</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Crew members must speak the <strong>same language</strong></li>
                    <li>• Operations Manual must be at least in <strong>English</strong></li>
                </ul>
            </div>
        </div>
    );
};

const RefuelingSection = () => {
    const requirements = [
        "Operator is authorized for the procedure",
        "Qualified person on-board",
        "2-way communications available",
        "Crew, staff, and passengers warned",
        "Fasten Seat Belt signs OFF",
        "No Smoking sign ON",
        "Cabin lights ON",
        "Minimum number of cabin crew onboard",
        "Emergency slides/exits clear"
    ];

    return (
        <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-emerald-500/30">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    Refueling with Passengers Onboard - Requirements
                </h3>
                <div className="grid md:grid-cols-3 gap-3">
                    {requirements.map((req, i) => (
                        <div key={i} className="flex items-center gap-2 bg-emerald-900/20 p-3 rounded-lg border border-emerald-500/20">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span className="text-sm text-slate-300">{req}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-900/20 p-6 rounded-xl border border-red-500/30">
                    <h3 className="font-bold text-red-300 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        STOP IMMEDIATELY IF:
                    </h3>
                    <div className="text-lg font-bold text-white">
                        You smell FUEL! 🔥
                    </div>
                    <p className="text-sm text-slate-400 mt-2">
                        Stop refueling operations immediately and evacuate if fuel odor is detected.
                    </p>
                </div>

                <div className="bg-orange-900/20 p-6 rounded-xl border border-orange-500/30">
                    <h3 className="font-bold text-orange-300 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        PROHIBITED FOR:
                    </h3>
                    <ul className="space-y-2 text-slate-300">
                        <li className="font-bold text-white">• Wide-Cut Fuels</li>
                        <li className="font-bold text-white">• AVGAS (Aviation Gasoline)</li>
                    </ul>
                    <p className="text-sm text-slate-500 mt-2">
                        Refueling with passengers is only permitted for Jet A/A-1 type fuels.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CrewDutyPositions;
