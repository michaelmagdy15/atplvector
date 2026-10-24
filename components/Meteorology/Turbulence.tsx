import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, Waves, AlertTriangle, EyeOff, Radio, ArrowUpRight, Compass, ShieldAlert } from 'lucide-react';

const Turbulence: React.FC = () => {
    const [activeSection, setActiveSection] = useState<'cat' | 'waves' | 'shear'>('cat');

    return (
        <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30">
                            <Wind className="text-amber-400" size={32} />
                        </div>
                        Aviation Turbulence & Jet Stream CAT
                        <span className="text-sm font-bold bg-amber-600 px-3 py-1 rounded-full text-white tracking-wide ml-2">ATPL 050</span>
                    </h2>
                    <p className="text-slate-400 mt-2 text-base font-light">
                        Clear Air Turbulence (CAT) dynamics on the cold poleward flank, mountain wave rotors, and windshear thresholds.
                    </p>
                </div>

                <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800 backdrop-blur-md">
                    {[
                        { id: 'cat', label: 'Jet Stream CAT' },
                        { id: 'waves', label: 'Mountain Waves' },
                        { id: 'shear', label: 'Low-Level Windshear' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSection(tab.id as any)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                                activeSection === tab.id
                                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/50'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* SECTION 1: JET STREAM CAT */}
            {activeSection === 'cat' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Wind className="text-amber-400" /> Jet Core CAT Cross-Section
                            </h3>
                            <span className="text-xs font-mono text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                                Cold Poleward Side = Max CAT
                            </span>
                        </div>

                        {/* Interactive Jet Stream Cross Section SVG */}
                        <div className="relative h-64 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden p-4">
                            <svg className="w-full h-full" viewBox="0 0 450 200">
                                {/* Axis */}
                                <line x1="40" y1="170" x2="420" y2="170" stroke="#334155" strokeWidth="1.5" />
                                <text x="60" y="185" fill="#64748b" fontSize="9">Poleward / Cold Air Side (North)</text>
                                <text x="310" y="185" fill="#64748b" fontSize="9">Equatorward / Warm Air Side</text>

                                {/* Tropopause Break */}
                                <path d="M40,70 L200,70 L240,110 L420,110" stroke="#64748b" strokeWidth="2" strokeDasharray="5 4" fill="none" />
                                <text x="60" y="60" fill="#94a3b8" fontSize="9" fontWeight="bold">Polar Tropopause (FL300)</text>
                                <text x="310" y="100" fill="#94a3b8" fontSize="9" fontWeight="bold">Tropical Tropopause (FL500)</text>

                                {/* Jet Core (West-to-East flowing out of page) */}
                                <circle cx="210" cy="95" r="28" fill="#0284c7" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="2" />
                                <circle cx="210" cy="95" r="16" fill="#0284c7" fillOpacity="0.6" stroke="#38bdf8" strokeWidth="2" />
                                <circle cx="210" cy="95" r="6" fill="#f8fafc" />
                                <text x="210" y="100" fill="#ffffff" fontSize="10" fontWeight="black" textAnchor="middle">CORE</text>
                                <text x="210" y="132" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">&gt; 150 kts</text>

                                {/* Severe CAT Zone (Cold Poleward Side & Below Core) */}
                                <path
                                    d="M130,75 L200,75 L200,120 L150,135 Z"
                                    fill="#ef4444"
                                    fillOpacity="0.3"
                                    stroke="#ef4444"
                                    strokeWidth="1.5"
                                    strokeDasharray="4 2"
                                />
                                <text x="135" y="105" fill="#fca5a5" fontSize="10" fontWeight="black">SEVERE CAT</text>
                                <text x="135" y="117" fill="#fecaca" fontSize="8">(Cyclonic Shear)</text>

                                {/* Light CAT Zone (Warm side) */}
                                <path
                                    d="M225,100 L300,105 L300,130 L225,125 Z"
                                    fill="#f59e0b"
                                    fillOpacity="0.15"
                                    stroke="#f59e0b"
                                    strokeWidth="1"
                                    strokeDasharray="4 2"
                                />
                                <text x="240" y="118" fill="#fcd34d" fontSize="9">Light CAT</text>
                            </svg>
                        </div>

                        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
                            <h4 className="font-bold text-white flex items-center gap-2">
                                <ShieldAlert size={14} className="text-red-400" />
                                Why is CAT worst on the Cold Side?
                            </h4>
                            <p className="text-slate-400">
                                Horizontal temperature gradients are steepest across the polar front boundary. The cyclonic (poleward) flank produces extreme horizontal shear exceeding <strong className="text-slate-200">40 kts per 150 NM</strong>, combined with vertical shear exceeding <strong className="text-slate-200">6 kts per 1,000 ft</strong> just beneath the jet core.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                            <h4 className="text-base font-bold text-white flex items-center gap-2">
                                <EyeOff className="text-red-400" size={18} />
                                Radar Invisibility Hazard (Croucher Ch 14)
                            </h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Airborne weather radar operates on electromagnetic backscatter from liquid water droplets and wet hail. CAT occurs in completely moisture-free clear air. <strong>Airborne weather radar CANNOT detect CAT!</strong>
                            </p>
                            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                                <span className="font-bold text-white block">Primary Defenses Against CAT:</span>
                                <div>• High-Level Significant Weather Charts (SIGWX)</div>
                                <div>• Pilot Reports (PIREPs) relayed by ATC</div>
                                <div>• Total Air Temperature (TAT) trend monitoring in cruise</div>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                            <h4 className="text-base font-bold text-white flex items-center gap-2">
                                <ArrowUpRight className="text-amber-400" size={18} />
                                In-Flight Escape Maneuver
                            </h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                If encountering severe CAT while cruising near a jet stream:
                            </p>
                            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                                <li>Check the Outside Air Temp (OAT) gauge: if temp is <strong className="text-cyan-400">dropping rapidly</strong>, you are flying deeper into the cold cyclonic shear zone.</li>
                                <li>Turn toward the warm side (Equatorward) or request an altitude change (climb or descend 2,000 to 4,000 ft) to exit the narrow vertical shear layer.</li>
                                <li>Disengage altitude hold and autothrottle to prevent airspeed oscillations from overstressing the airframe.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* SECTION 2: MOUNTAIN WAVES */}
            {activeSection === 'waves' && (
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Waves className="text-blue-400" />
                        Mountain Waves & Rotor Aerodynamics
                    </h3>

                    <div className="relative h-64 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                        <svg className="w-full h-full" viewBox="0 0 600 240">
                            {/* Mountain Ridge */}
                            <path d="M0,240 L120,80 L220,240 Z" fill="#334155" stroke="#475569" strokeWidth="2" />
                            <text x="120" y="110" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">Ridge Crest</text>

                            {/* Standing Wave Streamlines */}
                            <path d="M0,70 Q120,40 200,90 Q280,140 360,90 Q440,40 520,90 Q580,140 600,100" fill="none" stroke="#60a5fa" strokeWidth="3" strokeDasharray="8 4" />
                            <path d="M0,110 Q120,80 200,130 Q280,180 360,130 Q440,80 520,130 Q580,180 600,140" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="6 3" opacity="0.6" />

                            {/* Standing Lenticular Cloud (ACSL) */}
                            <ellipse cx="360" cy="85" rx="55" ry="12" fill="#ffffff" fillOpacity="0.85" />
                            <text x="360" y="89" fill="#1e293b" fontSize="9" fontWeight="bold" textAnchor="middle">Lenticular (ACSL)</text>

                            {/* Turbulent Rotor Zone Beneath Crest */}
                            <ellipse cx="280" cy="180" rx="35" ry="30" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 3" />
                            <text x="280" y="180" fill="#fca5a5" fontSize="10" fontWeight="black" textAnchor="middle">ROTOR ZONE</text>
                            <text x="280" y="195" fill="#fecaca" fontSize="8" textAnchor="middle">Extreme Turbulence</text>

                            {/* Roll Cloud */}
                            <ellipse cx="280" cy="140" rx="25" ry="8" fill="#94a3b8" opacity="0.7" />
                            <text x="280" y="143" fill="#ffffff" fontSize="7" textAnchor="middle">Roll Cloud</text>
                        </svg>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <span className="text-blue-400 font-bold block mb-1">Necessary Conditions:</span>
                            Stable atmosphere, wind blowing within 30° perpendicular to the ridge line, and wind speed exceeding <strong>20 kts</strong> at ridge level increasing with height.
                        </div>
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <span className="text-amber-400 font-bold block mb-1">Visual Signatures:</span>
                            Altocumulus Standing Lenticular (ACSL) clouds at wave crests; ragged roll clouds in the rotor zone. Waves may be dry with NO clouds if air is dry!
                        </div>
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <span className="text-red-400 font-bold block mb-1">Aircraft Hazard:</span>
                            Downdrafts in the lee of the ridge frequently exceed <strong>3,000 to 5,000 fpm</strong>, completely overcoming aircraft maximum climb gradient.
                        </div>
                    </div>
                </div>
            )}

            {/* SECTION 3: LOW-LEVEL WINDSHEAR */}
            {activeSection === 'shear' && (
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <AlertTriangle className="text-orange-400" />
                        Low-Level Windshear & Frontal Inversion Boundaries
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                            <h4 className="text-white font-bold text-sm">Nocturnal Radiation Inversion Shear</h4>
                            <p className="text-slate-400 leading-relaxed">
                                On clear calm nights, radiative cooling creates a steep surface inversion. Surface winds drop to 0–3 kts, while just 1,000 ft above the surface a low-level nocturnal jet of 25–40 kts develops.
                            </p>
                            <p className="text-amber-300">
                                Result: Passing through 500–1,000 ft on approach, an aircraft encounters abrupt 30 kt wind loss in seconds.
                            </p>
                        </div>

                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                            <h4 className="text-white font-bold text-sm">Cold Front Squall Lines</h4>
                            <p className="text-slate-400 leading-relaxed">
                                The dense cold wedge pushes a violent gust front 5–15 NM ahead of the front. Wind veers 40°–90° instantly and gusts up to 50–70 kts with severe rolling horizontal vortices.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Turbulence;
