import React, { useState } from 'react';
import { Shield, Cloud, Activity, Ruler, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PerfIntro: React.FC = () => {
    const [activeTab, setActiveTab] = useState('groups');

    const tabs = [
        { id: 'groups', label: 'Performance Groups', icon: <Shield size={18} /> },
        { id: 'atmosphere', label: 'Atmosphere', icon: <Cloud size={18} /> },
        { id: 'distances', label: 'Distances (TORA/TODA)', icon: <Ruler size={18} /> },
        { id: 'speeds', label: 'V-Speeds', icon: <Activity size={18} /> }
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-lime-100 dark:bg-lime-900/50 p-4 rounded-full">
                    <Shield className="text-lime-500 dark:text-lime-400" size={40} />
                </div>
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Introduction & Classification</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg mt-1">EASA 032 Performance Classes and Basics</p>
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
                                    EASA classifies aircraft into performance groups based on their propulsion type and passenger capacity. The class dictates the operational and certification requirements.
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
                                            <li className="flex gap-2"><ChevronRight size={16} className="text-amber-500 shrink-0 mt-0.5" /> Certification: CS-23 (Normal, Utility, Aerobatic, Commuter aeroplanes)</li>
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
                                            <li className="flex gap-2"><ChevronRight size={16} className="text-rose-500 shrink-0 mt-0.5" /> Certification: Subject to special performance rules similar to Class A</li>
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
                                                PA = Elevation + (1013.2 - QNH) × 27 ft
                                            </div>
                                        </div>
                                        
                                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <h3 className="font-bold text-slate-800 dark:text-white mb-2">Density Altitude (DA)</h3>
                                            <p className="text-sm dark:text-slate-300 mb-2">Pressure altitude corrected for non-standard temperature. High density altitude = low air density = poor performance.</p>
                                            <div className="bg-slate-200 dark:bg-slate-900 p-3 rounded font-mono text-xs text-lime-600 dark:text-lime-400">
                                                DA = PA + (118.8 ft × ISA Deviation)
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-lime-50 dark:bg-lime-900/10 border border-lime-200 dark:border-lime-900/50 rounded-lg p-6">
                                        <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Key Principles</h3>
                                        <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                                            <li className="flex gap-2">
                                                <ChevronRight className="text-lime-500 shrink-0" size={18} />
                                                <span><strong>High Temperature</strong> decreases air density, reducing engine thrust, propeller efficiency, and aerodynamic lift. Increases take-off run.</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <ChevronRight className="text-lime-500 shrink-0" size={18} />
                                                <span><strong>High Altitude (Low Pressure)</strong> decreases air density, leading to degraded performance.</span>
                                            </li>
                                            <li className="flex gap-2">
                                                <ChevronRight className="text-lime-500 shrink-0" size={18} />
                                                <span><strong>High Humidity</strong> decreases air density (water vapor is less dense than dry air), further degrading performance, especially in piston engines.</span>
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
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Declared Distances</h2>
                                <p className="text-slate-600 dark:text-slate-400">Definitions of key terms related to take-off and landing field lengths.</p>

                                {/* SVG Diagram Placeholder */}
                                <div className="w-full bg-slate-800 rounded-lg p-6 flex flex-col items-center justify-center border border-slate-700">
                                    <svg viewBox="0 0 800 300" className="w-full max-w-4xl text-slate-300 font-sans" fill="none">
                                        <rect x="100" y="200" width="400" height="40" fill="#475569" />
                                        <text x="300" y="225" fill="#f8fafc" fontSize="16" textAnchor="middle" fontWeight="bold">RUNWAY</text>
                                        
                                        <rect x="500" y="200" width="100" height="40" fill="#334155" />
                                        <text x="550" y="225" fill="#cbd5e1" fontSize="14" textAnchor="middle">STOPWAY</text>
                                        
                                        <rect x="500" y="160" width="200" height="30" fill="#1e293b" opacity="0.8" strokeDasharray="4 4" stroke="#94a3b8"/>
                                        <text x="600" y="180" fill="#cbd5e1" fontSize="14" textAnchor="middle">CLEARWAY</text>

                                        {/* TORA */}
                                        <path d="M100 260 L500 260" stroke="#3b82f6" strokeWidth="2" markerStart="url(#arrow)" markerEnd="url(#arrow)"/>
                                        <text x="300" y="280" fill="#3b82f6" fontSize="14" textAnchor="middle" fontWeight="bold">TORA</text>

                                        {/* TODA */}
                                        <path d="M100 290 L700 290" stroke="#84cc16" strokeWidth="2" markerStart="url(#arrow)" markerEnd="url(#arrow)"/>
                                        <text x="400" y="310" fill="#84cc16" fontSize="14" textAnchor="middle" fontWeight="bold">TODA</text>

                                        {/* ASDA */}
                                        <path d="M100 140 L600 140" stroke="#ef4444" strokeWidth="2" markerStart="url(#arrow)" markerEnd="url(#arrow)"/>
                                        <text x="350" y="130" fill="#ef4444" fontSize="14" textAnchor="middle" fontWeight="bold">ASDA</text>
                                        
                                        <defs>
                                            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                                <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                                            </marker>
                                        </defs>
                                    </svg>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded border border-slate-200 dark:border-slate-700">
                                        <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-1">TORA (Take-Off Run Available)</h4>
                                        <p className="text-sm dark:text-slate-300">The length of runway declared available and suitable for the ground run of an aeroplane taking off.</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded border border-slate-200 dark:border-slate-700">
                                        <h4 className="font-bold text-lime-600 dark:text-lime-400 mb-1">TODA (Take-Off Distance Available)</h4>
                                        <p className="text-sm dark:text-slate-300">TORA plus the length of any associated clearway (TODA = TORA + Clearway). Max Clearway considered is usually 50% of TORA.</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded border border-slate-200 dark:border-slate-700">
                                        <h4 className="font-bold text-red-600 dark:text-red-400 mb-1">ASDA (Accelerate-Stop Distance Available)</h4>
                                        <p className="text-sm dark:text-slate-300">TORA plus the length of any associated stopway (ASDA = TORA + Stopway).</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded border border-slate-200 dark:border-slate-700">
                                        <h4 className="font-bold text-amber-600 dark:text-amber-400 mb-1">LDA (Landing Distance Available)</h4>
                                        <p className="text-sm dark:text-slate-300">The length of runway which is declared available and suitable for the ground run of an aeroplane landing.</p>
                                    </div>
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
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Performance V-Speeds (Class A focus)</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { speed: "VMCG", name: "Min Control Speed (Ground)", desc: "Minimum speed on the ground where directional control can be maintained using aerodynamic controls alone following an engine failure." },
                                        { speed: "V1", name: "Decision Speed", desc: "The speed by which an engine failure must be recognized and a rejected takeoff initiated to stop within the ASDA. Also the speed to continue takeoff and reach V2 to clear obstacles." },
                                        { speed: "VR", name: "Rotation Speed", desc: "The speed at which the pilot initiates rotation to achieve V2 by the screen height (35ft)." },
                                        { speed: "VMCA", name: "Min Control Speed (Air)", desc: "Minimum flight speed at which directional control can be maintained with the critical engine inoperative, up to 5° bank into the live engine." },
                                        { speed: "VLOF", name: "Lift-off Speed", desc: "The speed at which the aircraft first becomes airborne." },
                                        { speed: "V2", name: "Takeoff Safety Speed", desc: "Target speed to be reached by 35 feet above the runway surface, ensuring the required aircraft climb gradient is met." }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <div className="bg-lime-500 text-slate-900 font-bold px-3 py-1 rounded h-fit shrink-0">
                                                {item.speed}
                                            </div>
                                            <div>
                                                <h4 className="font-bold dark:text-white mb-1">{item.name}</h4>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
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
