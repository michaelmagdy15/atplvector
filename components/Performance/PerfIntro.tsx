import React, { useState } from 'react';
import { Shield, Cloud, Activity, Ruler, ChevronRight, Scale, AlertOctagon, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PerfIntro: React.FC = () => {
    const [activeTab, setActiveTab] = useState('groups');

    const tabs = [
        { id: 'groups', label: 'Performance Groups', icon: <Shield size={18} /> },
        { id: 'atmosphere', label: 'Atmosphere', icon: <Cloud size={18} /> },
        { id: 'distances', label: 'Distances (TORA/TODA/ASDA/LDA)', icon: <Ruler size={18} /> },
        { id: 'speeds', label: 'V-Speeds & Stall Definitions', icon: <Activity size={18} /> },
        { id: 'tables', label: 'Screen Heights, Bank & Gradients', icon: <Scale size={18} /> },
        { id: 'formulas', label: 'Contamination, Flex & Obstacle Math', icon: <CheckCircle2 size={18} /> }
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-lime-100 dark:bg-lime-900/50 p-4 rounded-full">
                    <Shield className="text-lime-500 dark:text-lime-400" size={40} />
                </div>
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Introduction & Classification</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg mt-1">EASA Subject 032 Performance Classes, Certification Hierarchy & Declared Distances</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden">
                <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-colors whitespace-nowrap outline-none ${
                                activeTab === tab.id
                                    ? 'text-lime-600 dark:text-lime-400 border-b-2 border-lime-500 dark:border-lime-400 bg-white dark:bg-slate-800'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-6 md:p-8 min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'groups' && (
                            <motion.div
                                key="groups"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Performance Classes</h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    EASA classifies aircraft into performance groups based on propulsion type, certification standard, and passenger capacity.
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 rounded bg-lime-500 text-white flex items-center justify-center font-bold">A</div>
                                            <h3 className="font-bold text-lg dark:text-white">Class A</h3>
                                        </div>
                                        <ul className="space-y-3 mt-4 text-sm dark:text-slate-300">
                                            <li className="flex gap-2"><ChevronRight size={16} className="text-lime-500 shrink-0 mt-0.5" /> All multi-engine turbojets</li>
                                            <li className="flex gap-2"><ChevronRight size={16} className="text-lime-500 shrink-0 mt-0.5" /> Multi-engine turboprops with &gt; 9 passenger seats</li>
                                            <li className="flex gap-2"><ChevronRight size={16} className="text-lime-500 shrink-0 mt-0.5" /> Multi-engine turboprops &gt; 5,700 kg MTOM</li>
                                            <li className="flex gap-2"><ChevronRight size={16} className="text-lime-500 shrink-0 mt-0.5" /> Certification: CS-25 (Large Aeroplanes)</li>
                                        </ul>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 rounded bg-amber-500 text-white flex items-center justify-center font-bold">B</div>
                                            <h3 className="font-bold text-lg dark:text-white">Class B</h3>
                                        </div>
                                        <ul className="space-y-3 mt-4 text-sm dark:text-slate-300">
                                            <li className="flex gap-2"><ChevronRight size={16} className="text-amber-500 shrink-0 mt-0.5" /> Propeller-driven aeroplanes</li>
                                            <li className="flex gap-2"><ChevronRight size={16} className="text-amber-500 shrink-0 mt-0.5" /> 9 or fewer passenger seats</li>
                                            <li className="flex gap-2"><ChevronRight size={16} className="text-amber-500 shrink-0 mt-0.5" /> MTOM ≤ 5,700 kg</li>
                                            <li className="flex gap-2"><ChevronRight size={16} className="text-amber-500 shrink-0 mt-0.5" /> Certification: CS-23 (Normal, Utility, Commuter)</li>
                                        </ul>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 rounded bg-rose-500 text-white flex items-center justify-center font-bold">C</div>
                                            <h3 className="font-bold text-lg dark:text-white">Class C</h3>
                                        </div>
                                        <ul className="space-y-3 mt-4 text-sm dark:text-slate-300">
                                            <li className="flex gap-2"><ChevronRight size={16} className="text-rose-500 shrink-0 mt-0.5" /> Piston-engine aeroplanes</li>
                                            <li className="flex gap-2"><ChevronRight size={16} className="text-rose-500 shrink-0 mt-0.5" /> &gt; 9 passenger seats OR...</li>
                                            <li className="flex gap-2"><ChevronRight size={16} className="text-rose-500 shrink-0 mt-0.5" /> MTOM &gt; 5,700 kg</li>
                                            <li className="flex gap-2"><ChevronRight size={16} className="text-rose-500 shrink-0 mt-0.5" /> Special transport rules similar to Class A</li>
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'atmosphere' && (
                            <motion.div
                                key="atmosphere"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Atmospheric Effects on Performance</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <h3 className="font-bold text-slate-800 dark:text-white mb-2">Pressure Altitude (PA)</h3>
                                            <p className="text-sm dark:text-slate-300 mb-2">The altitude in the International Standard Atmosphere (ISA) where the prevailing pressure occurs.</p>
                                            <div className="bg-slate-200 dark:bg-slate-900 p-3 rounded font-mono text-xs text-lime-600 dark:text-lime-400">
                                                PA = Elevation + (1013.25 - QNH) × 27.3 ft
                                            </div>
                                        </div>
                                        
                                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <h3 className="font-bold text-slate-800 dark:text-white mb-2">Density Altitude (DA)</h3>
                                            <p className="text-sm dark:text-slate-300 mb-2">Pressure altitude corrected for non-standard temperature. High density altitude = low air density = degraded performance.</p>
                                            <div className="bg-slate-200 dark:bg-slate-900 p-3 rounded font-mono text-xs text-lime-600 dark:text-lime-400">
                                                DA = PA + (118.8 ft × Delta ISA)
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-lime-50 dark:bg-lime-900/10 border border-lime-200 dark:border-lime-900/50 rounded-lg p-6">
                                        <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Key Principles</h3>
                                        <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                                            <li className="flex gap-2">
                                                <ChevronRight className="text-lime-500 shrink-0" size={18} />
                                                <span><strong>High Temperature:</strong> Decreases air density, reducing engine thrust, propeller efficiency, and aerodynamic lift. Increases takeoff ground roll.</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <ChevronRight className="text-lime-500 shrink-0" size={18} />
                                                <span><strong>High Elevation:</strong> Decreases ambient pressure and air density, increasing true airspeed (TAS) required for lift-off.</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <ChevronRight className="text-lime-500 shrink-0" size={18} />
                                                <span><strong>High Humidity:</strong> Water vapor is less dense than dry air (molecular mass 18 vs 29), further reducing air density.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'distances' && (
                            <motion.div
                                key="distances"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Runway Declared Distances (ICAO Annex 14 / CS-25)</h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    The four certified operational distances declared by aerodrome authorities for takeoff and landing.
                                </p>

                                {/* SVG Diagram */}
                                <div className="w-full bg-slate-950 rounded-2xl p-6 flex flex-col items-center justify-center border border-slate-800">
                                    <svg viewBox="0 0 800 280" className="w-full max-w-4xl text-slate-300 font-sans" fill="none">
                                        {/* Physical Runway Pavement */}
                                        <rect x="100" y="160" width="380" height="40" fill="#334155" stroke="#475569" strokeWidth="2" />
                                        <text x="290" y="185" fill="#f8fafc" fontSize="14" textAnchor="middle" fontWeight="bold">RUNWAY (TORA: 0 to End)</text>
                                        
                                        {/* Displaced Threshold */}
                                        <rect x="100" y="160" width="60" height="40" fill="#b45309" opacity="0.3" stroke="#f59e0b" strokeDasharray="3 3" />
                                        <text x="130" y="185" fill="#fcd34d" fontSize="9" textAnchor="middle">DISPLACED</text>

                                        {/* Stopway */}
                                        <rect x="480" y="160" width="90" height="40" fill="#991b1b" opacity="0.4" stroke="#ef4444" strokeWidth="1.5" />
                                        <text x="525" y="185" fill="#fca5a5" fontSize="12" textAnchor="middle" fontWeight="bold">STOPWAY</text>
                                        
                                        {/* Clearway */}
                                        <rect x="480" y="115" width="160" height="35" fill="#065f46" opacity="0.3" stroke="#10b981" strokeDasharray="4 4"/>
                                        <text x="560" y="137" fill="#6ee7b7" fontSize="12" textAnchor="middle" fontWeight="bold">CLEARWAY (Max 50% TORA)</text>

                                        {/* TORA Dimension Line */}
                                        <line x1="100" y1="220" x2="480" y2="220" stroke="#38bdf8" strokeWidth="2" markerStart="url(#arrowBlue)" markerEnd="url(#arrowBlue)" />
                                        <text x="290" y="235" fill="#38bdf8" fontSize="11" textAnchor="middle" fontWeight="bold">TORA (Take-Off Run Available)</text>

                                        {/* TODA Dimension Line */}
                                        <line x1="100" y1="250" x2="640" y2="250" stroke="#10b981" strokeWidth="2" markerStart="url(#arrowGreen)" markerEnd="url(#arrowGreen)" />
                                        <text x="370" y="265" fill="#10b981" fontSize="11" textAnchor="middle" fontWeight="bold">TODA = TORA + Clearway (Capped at 50% TORA)</text>

                                        {/* ASDA Dimension Line */}
                                        <line x1="100" y1="100" x2="570" y2="100" stroke="#ef4444" strokeWidth="2" markerStart="url(#arrowRed)" markerEnd="url(#arrowRed)" />
                                        <text x="335" y="90" fill="#ef4444" fontSize="11" textAnchor="middle" fontWeight="bold">ASDA = TORA + Stopway</text>

                                        {/* LDA Dimension Line */}
                                        <line x1="160" y1="210" x2="480" y2="210" stroke="#fbbf24" strokeWidth="2" strokeDasharray="2 2" markerStart="url(#arrowAmber)" markerEnd="url(#arrowAmber)" />
                                        <text x="320" y="205" fill="#fbbf24" fontSize="10" textAnchor="middle" fontWeight="bold">LDA = TORA - Displaced Threshold</text>
                                        
                                        <defs>
                                            <marker id="arrowBlue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
                                            </marker>
                                            <marker id="arrowGreen" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                                            </marker>
                                            <marker id="arrowRed" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                                            </marker>
                                            <marker id="arrowAmber" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
                                            </marker>
                                        </defs>
                                    </svg>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                                        <h4 className="font-bold text-blue-600 dark:text-blue-400">TORA (Take-Off Run Available)</h4>
                                        <p className="text-xs dark:text-slate-300 leading-relaxed">
                                            The physical length of runway declared available and suitable for the ground roll of an aeroplane taking off.
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                                        <h4 className="font-bold text-emerald-600 dark:text-emerald-400">TODA (Take-Off Distance Available)</h4>
                                        <p className="text-xs dark:text-slate-300 leading-relaxed">
                                            <strong>TODA = TORA + Clearway</strong>. Under ICAO Annex 14 & CS-25, clearway is strictly limited to a <strong>maximum of 50% of TORA</strong>. Must be an obstacle-free ground/water plane under airport control, min 500 ft (150 m) wide, max 1.25% slope.
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                                        <h4 className="font-bold text-rose-600 dark:text-rose-400">ASDA (Accelerate-Stop Distance Available)</h4>
                                        <p className="text-xs dark:text-slate-300 leading-relaxed">
                                            <strong>ASDA = TORA + Stopway</strong>. A stopway is a load-bearing paved surface centered on the runway centerline, capable of supporting the aircraft without structural damage during an aborted takeoff.
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                                        <h4 className="font-bold text-amber-600 dark:text-amber-400">LDA (Landing Distance Available)</h4>
                                        <p className="text-xs dark:text-slate-300 leading-relaxed">
                                            The length of runway declared available and suitable for the ground roll of an aeroplane landing. If a displaced threshold exists, LDA begins at the displaced threshold.
                                        </p>
                                    </div>
                                </div>

                                {/* Balanced Field Length Concept Callout */}
                                <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-2">
                                    <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                                        <Scale size={18} />
                                        The Balanced Field Length Concept: TODR = ASDR at V1
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed">
                                        The condition where the Take-Off Distance Required (TODR) with an engine failure at V1 exactly equals the Accelerate-Stop Distance Required (ASDR).
                                        This balances the risk of stopping versus continuing, minimizing the required runway length and yielding the <strong>highest allowable takeoff mass (MTOM)</strong> for a given runway.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                        
                        {activeTab === 'speeds' && (
                            <motion.div
                                key="speeds"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">V-Speed Hierarchy & Certification Rules</h2>
                                        <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">CS-25.107 Take-Off Speeds and Operating Envelopes</p>
                                    </div>
                                    <span className="font-mono text-xs px-3 py-1 rounded bg-lime-500/10 text-lime-400 border border-lime-500/20 font-bold">
                                        VMCG ≤ V1 ≤ VR ≤ VMBE
                                    </span>
                                </div>

                                {/* Certification Speed Ladder */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        { speed: "VMCG", name: "Min Control Speed (Ground)", rule: "VMCG ≤ V1", desc: "Minimum speed on ground where directional control can be maintained using aerodynamic rudder alone following critical engine failure (nosewheel steering ignored)." },
                                        { speed: "V1", name: "Takeoff Decision Speed", rule: "VMCG ≤ V1 ≤ VR ≤ VMBE", desc: "The speed by which the decision to abort or continue must be made. Before V1 abort; after V1 takeoff MUST continue into the air." },
                                        { speed: "VR", name: "Rotation Speed", rule: "VR ≥ 1.05 VMCA & VR ≥ V1", desc: "Speed at which pilot initiates pitch rotation at strictly 3°/sec to achieve V2 by screen height (35ft dry / 15ft wet)." },
                                        { speed: "VMCA", name: "Min Control Speed (Air)", rule: "VR ≥ 1.05 VMCA", desc: "Minimum airborne flight speed where directional control can be maintained with critical engine inoperative, up to 5° bank into live engine." },
                                        { speed: "VMBE", name: "Max Brake Energy Speed", rule: "V1 ≤ VR ≤ VMBE", desc: "Maximum speed from which an aborted takeoff can be completed without exceeding the thermal absorption limits of the wheel brakes." },
                                        { speed: "V2", name: "Takeoff Safety Speed", rule: "V2 ≥ 1.13 VSR", desc: "Target climb speed achieved by screen height with one engine inoperative (OEI), maintaining required 1st and 2nd segment climb gradients." },
                                        { speed: "VREF", name: "Landing Reference Speed", rule: "VREF ≥ 1.23 VSR0", desc: "Target speed at 50 ft threshold in landing configuration with all engines operating, providing 23% margin above 1-g stall speed." },
                                        { speed: "VLOF", name: "Lift-off Speed", rule: "VLOF > VR", desc: "The speed at which the aeroplane first becomes airborne as the main landing gear bogeys leave the runway surface." },
                                        { speed: "VFTO", name: "Final Takeoff Speed", rule: "Green Dot Clean", desc: "Best lift-to-drag ratio speed in clean configuration, target speed for 4th climb segment up to 1,500 ft AGL." }
                                    ].map((item, i) => (
                                        <div key={i} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="bg-lime-500 text-slate-950 font-mono font-bold px-2 py-0.5 rounded text-xs">
                                                    {item.speed}
                                                </span>
                                                <span className="font-mono text-[10px] text-lime-400 font-bold">
                                                    {item.rule}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-sm dark:text-white">{item.name}</h4>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Mental Model & Anti-patterns */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                    <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-2">
                                        <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                                            <AlertOctagon size={18} />
                                            Mental Model: "V1 as the Red Line of No Return"
                                        </div>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            Before V1, the captain aborts for engine failure, fire, or master caution.
                                            <strong> After V1, takeoff MUST continue into the air even with catastrophic engine failure or smoke; stopping distance is gone.</strong>
                                            Aborting at V1 + 2 kt guarantees runway excursion because kinetic energy varies with velocity squared (Ek ∝ V²).
                                        </p>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                                        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                                            <AlertTriangle size={18} />
                                            Rotation Anti-Patterns (Under vs Over-Rotation)
                                        </div>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            Pilot rotation rate must be maintained strictly at <strong>3°/second</strong>.
                                            Rotating prematurely (&lt; VR) increases ground roll and risks tail strike.
                                            Rotating too rapidly (&gt; 3°/sec) drastically spikes induced drag and can stall the wings in ground effect!
                                        </p>
                                    </div>
                                </div>

                                {/* Exact Stall Speed Definitions & VMO/VS Ratio Matrix */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                                    <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3">
                                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                                            Exact EASA Stall Speed Definitions (CS-25 / CS-23)
                                        </h3>
                                        <div className="space-y-2 text-xs">
                                            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                                <strong className="text-lime-400 font-mono">VSR1:</strong> Reference stall speed in a <strong>specific configuration</strong>.
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                                <strong className="text-lime-400 font-mono">VSR0:</strong> Reference stall speed in the <strong>landing configuration</strong> (governed by CLmax and load factor ≥ 1).
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                                <strong className="text-sky-400 font-mono">VS1g:</strong> 1-g stall speed at which the aeroplane can develop a lift force normal to the flight path equal to its weight.
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                                <strong className="text-amber-400 font-mono">VS1 / VS0:</strong> Minimum steady flight speed at which the aeroplane is controllable in a specific (VS1) or landing (VS0) configuration.
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-lime-500/10 border border-lime-500/30 text-slate-300">
                                                <strong>Stall Warning &amp; V2 Limits:</strong> Stall warning activates <strong>5% or 5 kt</strong> above VSR. <strong>VMCA</strong> limits V2 at <em>low altitude / cold</em>; <strong>VSR</strong> limits V2 at <em>high altitude / warm</em>.
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4">
                                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                                            VMO Relative to VS &amp; Key Speed Multipliers
                                        </h3>
                                        <table className="w-full text-left text-xs font-mono border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-300 dark:border-slate-700 text-slate-500 uppercase">
                                                    <th className="py-2">Propulsion</th>
                                                    <th className="py-2">Clean Config</th>
                                                    <th className="py-2">Flaps Extended</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                                <tr>
                                                    <td className="py-2.5 font-bold text-sky-400">Turbojet</td>
                                                    <td className="py-2.5 font-bold text-white">1.6 VS</td>
                                                    <td className="py-2.5 font-bold text-white">1.4 VS</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2.5 font-bold text-amber-400">Propeller</td>
                                                    <td className="py-2.5 font-bold text-white">1.3 VS</td>
                                                    <td className="py-2.5 font-bold text-white">1.2 VS</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
                                            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                                <span className="text-[10px] text-slate-400 block">Class A Approach / Landing</span>
                                                <strong className="text-lime-400">VREF = 1.23 VSR0</strong>
                                                <span className="block text-[10px] text-slate-400">VAPP = 1.33 VS</span>
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                                <span className="text-[10px] text-slate-400 block">Class B Takeoff / Landing</span>
                                                <strong className="text-amber-400">VR ≥ 1.05 VMCA / 1.1 VS1</strong>
                                                <span className="block text-[10px] text-slate-400">V2 ≥ 1.1 VMCA | VREF = 1.3 VS0</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </motion.div>
                        )}

                        {activeTab === 'tables' && (
                            <motion.div
                                key="tables"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    Screen Heights, Bank Angles &amp; Climb Gradients (Christmas Rule)
                                </h2>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Screen Heights & Obstacle Clearance Table */}
                                    <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3">
                                        <h3 className="font-bold text-base text-lime-500">
                                            Screen Heights &amp; Vertical Obstacle Clearance
                                        </h3>
                                        <table className="w-full text-left text-xs font-mono border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-300 dark:border-slate-700 text-slate-400 uppercase">
                                                    <th className="py-2">Phase / Rule</th>
                                                    <th className="py-2">Class A</th>
                                                    <th className="py-2">Class B</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                                <tr>
                                                    <td className="py-2.5 font-bold">Takeoff Screen Height</td>
                                                    <td className="py-2.5 text-emerald-400 font-bold">35 ft Dry / 15 ft Wet</td>
                                                    <td className="py-2.5 text-amber-400 font-bold">50 ft</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2.5 font-bold">Landing Screen Height</td>
                                                    <td className="py-2.5 text-sky-400 font-bold">50 ft (35 ft Steep ≥ 4.5°)</td>
                                                    <td className="py-2.5 text-amber-400 font-bold">50 ft</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2.5 font-bold">Obstacle Clearance (Net)</td>
                                                    <td className="py-2.5 text-rose-400 font-bold" colSpan={2}>
                                                        35 ft Dry | 15 ft Wet | 50 ft if Bank &gt; 15°
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Maximum Bank Angles Table */}
                                    <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3">
                                        <h3 className="font-bold text-base text-sky-400">
                                            Maximum Bank Angle After Takeoff (OEI)
                                        </h3>
                                        <table className="w-full text-left text-xs font-mono border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-300 dark:border-slate-700 text-slate-400 uppercase">
                                                    <th className="py-2">Height Above Runway</th>
                                                    <th className="py-2">Normal Max Bank</th>
                                                    <th className="py-2">Special Authorization</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                                <tr>
                                                    <td className="py-2 font-bold">0 – 50 ft</td>
                                                    <td className="py-2 text-rose-400 font-bold">0° (Wings Level)</td>
                                                    <td className="py-2 text-slate-400">0°</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 font-bold">50 – 200 ft</td>
                                                    <td className="py-2 text-amber-400 font-bold">15°</td>
                                                    <td className="py-2 text-slate-400">15°</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 font-bold">200 – 400 ft</td>
                                                    <td className="py-2 text-emerald-400 font-bold">15°</td>
                                                    <td className="py-2 text-sky-400 font-bold">20° (Special)</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 font-bold">&gt; 400 ft</td>
                                                    <td className="py-2 text-emerald-400 font-bold">25°</td>
                                                    <td className="py-2 text-sky-400 font-bold">30° (Special)</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Christmas Mnemonic Climb Gradients + Gross/Net Deductions */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3">
                                        <h3 className="font-bold text-base text-emerald-400">
                                            Min Gross Climb Gradients — "Christmas Rule" (24.12)
                                        </h3>
                                        <table className="w-full text-left text-xs font-mono border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-300 dark:border-slate-700 text-slate-400 uppercase">
                                                    <th className="py-2">Engines</th>
                                                    <th className="py-2">1st Seg</th>
                                                    <th className="py-2">2nd Seg</th>
                                                    <th className="py-2">4th Seg</th>
                                                    <th className="py-2">Mnemonic</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                                <tr>
                                                    <td className="py-2.5 font-bold text-white">2-Eng</td>
                                                    <td className="py-2.5 text-lime-400 font-bold">&gt; 0%</td>
                                                    <td className="py-2.5 text-lime-400 font-bold">2.4%</td>
                                                    <td className="py-2.5 text-lime-400 font-bold">1.2%</td>
                                                    <td className="py-2.5 text-slate-300">"0 presents on 24.12"</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2.5 font-bold text-white">3-Eng</td>
                                                    <td className="py-2.5 text-amber-400 font-bold">0.3%</td>
                                                    <td className="py-2.5 text-amber-400 font-bold">2.7%</td>
                                                    <td className="py-2.5 text-amber-400 font-bold">1.5%</td>
                                                    <td className="py-2.5 text-slate-300">"Buy 3 → add 0.3%"</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2.5 font-bold text-white">4-Eng</td>
                                                    <td className="py-2.5 text-sky-400 font-bold">0.5%</td>
                                                    <td className="py-2.5 text-sky-400 font-bold">3.0%</td>
                                                    <td className="py-2.5 text-sky-400 font-bold">1.7%</td>
                                                    <td className="py-2.5 text-slate-300">"High 5, 3 gifts, age 1-7"</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3">
                                        <h3 className="font-bold text-base text-purple-400">
                                            Gross ↔ Net Gradient Deductions &amp; Approach / Balked Climb
                                        </h3>
                                        <table className="w-full text-left text-xs font-mono border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-300 dark:border-slate-700 text-slate-400 uppercase">
                                                    <th className="py-2">Engines</th>
                                                    <th className="py-2">Climb (Gross→Net)</th>
                                                    <th className="py-2">Descent (Gross→Net)</th>
                                                    <th className="py-2">Appr Climb (OEI)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                                <tr>
                                                    <td className="py-2 font-bold">2-Eng</td>
                                                    <td className="py-2 text-rose-400 font-bold">± 0.8%</td>
                                                    <td className="py-2 text-sky-400 font-bold">± 1.2%</td>
                                                    <td className="py-2 text-emerald-400 font-bold">2.1% (2nd − 0.3%)</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 font-bold">3-Eng</td>
                                                    <td className="py-2 text-rose-400 font-bold">± 0.9%</td>
                                                    <td className="py-2 text-sky-400 font-bold">± 1.4%</td>
                                                    <td className="py-2 text-emerald-400 font-bold">2.4% (2nd − 0.3%)</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 font-bold">4-Eng</td>
                                                    <td className="py-2 text-rose-400 font-bold">± 1.0%</td>
                                                    <td className="py-2 text-sky-400 font-bold">± 1.6%</td>
                                                    <td className="py-2 text-emerald-400 font-bold">2.7% (2nd − 0.3%)</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className="text-xs text-slate-300 space-y-1 pt-1">
                                            <p>• <strong>Class A Landing / Balked Climb (AEO, gear down, flaps land, 8s idle→GA):</strong> <strong>3.2%</strong> gross.</p>
                                            <p>• <strong>Class B MEP Gradients:</strong> Takeoff AEO = <strong>4%</strong> (to 1,500 ft); OEI = positive to 400 ft, <strong>0.75%</strong> to 1,500 ft; Balked AEO = <strong>2.5%</strong>; Missed Appr OEI = <strong>0.75%</strong>.</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'formulas' && (
                            <motion.div
                                key="formulas"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    Contamination, Hydroplaning, Flex vs Derate &amp; Obstacle Math
                                </h2>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Hydroplaning & Runway Contamination */}
                                    <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3">
                                        <h3 className="font-bold text-base text-sky-400">
                                            Hydroplaning Formulas &amp; Runway Surface Definitions
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                                            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                                <span className="text-[10px] text-slate-400 block">Dynamic (Rotating / Takeoff)</span>
                                                <strong className="text-base text-sky-400">VP = 9 × √P (psi)</strong>
                                            </div>
                                            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                                <span className="text-[10px] text-slate-400 block">Viscous (Locked / Landing)</span>
                                                <strong className="text-base text-amber-400">VP = 7.7 × √P (psi)</strong>
                                            </div>
                                        </div>
                                        <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                                            <li>• <strong>Damp:</strong> Surface not dry, moisture does <em>not</em> give a shiny appearance.</li>
                                            <li>• <strong>Wet:</strong> Covered by water ≤ 3 mm deep, reflective/shiny appearance.</li>
                                            <li>• <strong>Frost:</strong> Granular frozen moisture crystals formed on cold surface.</li>
                                            <li>• <strong>Slush:</strong> Water-saturated snow that splatters when stepped on heavily.</li>
                                            <li>• <strong>Wet Snow:</strong> Forms a snowball when squeezed, <em>no</em> free water released.</li>
                                            <li>• <strong>Compacted Snow:</strong> Compressed into solid mass — <strong>TOD remains same, ASD increases!</strong></li>
                                        </ul>
                                    </div>

                                    {/* Reduced (Flex) vs Derated Thrust */}
                                    <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3">
                                        <h3 className="font-bold text-base text-amber-400">
                                            Reduced Thrust (FLEX / Assumed Temp) vs. Derated Thrust
                                        </h3>
                                        <table className="w-full text-left text-xs font-mono border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-300 dark:border-slate-700 text-slate-400 uppercase">
                                                    <th className="py-2">Parameter</th>
                                                    <th className="py-2 text-emerald-400">Reduced (FLEX)</th>
                                                    <th className="py-2 text-sky-400">Derated Thrust</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                                <tr>
                                                    <td className="py-2 font-bold">VMCA / VMCG</td>
                                                    <td className="py-2 font-bold text-white">Remains SAME</td>
                                                    <td className="py-2 font-bold text-emerald-400">DECREASES (Lower VMC)</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 font-bold">Contaminated RWY</td>
                                                    <td className="py-2 font-bold text-rose-400">PROHIBITED (Wet OK)</td>
                                                    <td className="py-2 font-bold text-emerald-400">ALLOWED</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 font-bold">TOGA Application</td>
                                                    <td className="py-2 text-slate-300">Can advance to full TOGA without VMC violation</td>
                                                    <td className="py-2 text-slate-300">Advancing to full TOGA below original VMCA risks loss of control!</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Class B Factors & Obstacle / Ref Zero / Cloud Base Formulas */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3">
                                        <h3 className="font-bold text-base text-lime-400">
                                            Class B Factors &amp; Regulatory Multipliers
                                        </h3>
                                        <div className="space-y-2 text-xs font-mono text-slate-300">
                                            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                                <strong className="text-lime-400">Takeoff Surface:</strong> 1.0× Paved Wet | 1.2× Grass Dry | 1.3× Grass Wet | +5% per 1% Upslope (×1.05)
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                                <strong className="text-sky-400">Takeoff Regulatory:</strong> Balanced: TOD × 1.25 = TODR | Unbalanced: TOD × 1.0 = TORR, × 1.15 = TODR, × 1.30 = ASDR
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                                <strong className="text-amber-400">Landing Factors:</strong> Class A: LD × 1.67 (LDA × 0.6) | Class B: LD × 1.43 (LDA × 0.7) | Wet/Grass: × 1.15 | +5% per 1% Downslope
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                                <strong className="text-purple-400">Class B Net Conversions:</strong> Net Climb = Gross × 0.77 | Net Glide Gradient = Gross + 0.5%
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3">
                                        <h3 className="font-bold text-base text-rose-400">
                                            Obstacle Math, Reference Zero &amp; SEP Glide Above Clouds
                                        </h3>
                                        <div className="space-y-2 text-xs font-mono text-slate-300">
                                            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                                <strong className="text-emerald-400">Reference Zero:</strong> Ref Zero = BRP − (TODR × Runway Incline %)
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                                <strong className="text-sky-400">Climb Gradient &amp; Distance:</strong> Grad % = ROC / TAS | Air Dist = (ΔHeight / Grad %) × 100 | Ground Dist = Air Dist × (GS / TAS)
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                                <strong className="text-amber-400">SEP Glide Above Clouds:</strong> Must glide to <strong>1,000 ft</strong> above suitable landing area; cloud base must be above MSA.
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30">
                                                <strong className="text-rose-400">Classic Exam Numerical Key (SEP Glide / Cloud Base):</strong> Distances: <strong>4.82 NM, 5.35 NM, 6.65 NM</strong> | Heights/Speeds: <strong>156, 172, 215, 248, 275</strong>.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default PerfIntro;
