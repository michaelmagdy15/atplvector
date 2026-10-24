import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudLightning, Zap, Wind, AlertOctagon, ShieldAlert, ArrowDown, ArrowUp, Navigation, Compass, AlertTriangle, EyeOff } from 'lucide-react';

const Thunderstorms: React.FC = () => {
    const [subTab, setSubTab] = useState<'lifecycle' | 'microburst' | 'anvil'>('lifecycle');
    const [stage, setStage] = useState<0 | 1 | 2>(1); // 0: Cumulus, 1: Mature, 2: Dissipating

    const stages = [
        {
            name: 'Cumulus (Developing Stage)',
            time: '15 - 20 minutes',
            updraft: 'Up to 3,000 fpm',
            downdraft: 'Nil (None yet)',
            precip: 'None reaching surface (held aloft by updrafts)',
            features: [
                'Updrafts dominate throughout the entire cell (up to 3,000 fpm)',
                'Rapid vertical expansion into Towering Cumulus (TCU)',
                'Large volume of supercooled water droplets accumulating aloft',
                'Severe icing and moderate turbulence inside cloud core'
            ],
            color: 'bg-yellow-500',
            textColor: 'text-yellow-400',
            borderColor: 'border-yellow-500/30'
        },
        {
            name: 'Mature Stage (Most Hazardous)',
            time: '15 - 30 minutes',
            updraft: 'Up to 6,000+ fpm',
            downdraft: 'Up to 6,000 fpm (Microbursts)',
            precip: 'Heavy torrential rain, large hail, and microbursts',
            features: [
                'Commences when precipitation first breaks through and hits the ground',
                'Coexistence of violent updrafts (6,000 fpm) and cold downdrafts (6,000 fpm)',
                'Extreme vertical windshear, microbursts, gust fronts, and squall lines',
                'Active lightning discharge and supercooled hail ejected into the anvil',
                'Cloud tops frequently punching through tropopause to FL450–600'
            ],
            color: 'bg-red-500',
            textColor: 'text-red-400',
            borderColor: 'border-red-500/30'
        },
        {
            name: 'Dissipating Stage',
            time: '1.5 - 2.5 hours',
            updraft: 'Dying out completely',
            downdraft: 'Dominates throughout the cell',
            precip: 'Light to moderate steady rain',
            features: [
                'Downdrafts completely choke off the inflow of warm moist surface air',
                'Characteristic fibrous cirrus "anvil" top fully spreads out downwind',
                'Storm core is literally raining itself out',
                'Severe turbulence still present inside and beneath the dying anvil'
            ],
            color: 'bg-blue-500',
            textColor: 'text-blue-400',
            borderColor: 'border-blue-500/30'
        }
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                            <CloudLightning className="text-purple-400" size={32} />
                        </div>
                        Cumulonimbus Dynamics, Microbursts & Anvil Hazards
                        <span className="text-sm font-bold bg-purple-600 px-3 py-1 rounded-full text-white tracking-wide ml-2">ATPL 050</span>
                    </h2>
                    <p className="text-slate-400 mt-2 text-base font-light">
                        Three-stage lifecycle thermodynamics, 6,000 fpm microburst performance shear, and "The Anvil Points the Way" hail safety doctrine.
                    </p>
                </div>

                <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800 backdrop-blur-md">
                    {(['lifecycle', 'microburst', 'anvil'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setSubTab(tab)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                                subTab === tab
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            {tab === 'lifecycle' ? 'Lifecycle Stages' : tab === 'microburst' ? 'Microburst Shear' : 'Anvil & Hail Hazard'}
                        </button>
                    ))}
                </div>
            </header>

            {/* TAB 1: LIFECYCLE */}
            {subTab === 'lifecycle' && (
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <CloudLightning className="text-purple-400" />
                            Cumulonimbus Three-Stage Life Cycle
                        </h3>

                        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                            {[0, 1, 2].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStage(s as any)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        stage === s ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    Stage {s + 1}: {s === 0 ? 'Cumulus' : s === 1 ? 'Mature' : 'Dissipating'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Interactive Animation Visualizer */}
                        <div className="relative h-[420px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-end justify-center">
                            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"></div>

                            {/* Ground & Surface Rain */}
                            <div className="absolute bottom-0 w-full h-8 bg-slate-900 border-t border-slate-800 flex items-center justify-center">
                                <span className="text-[10px] font-mono text-slate-500">Surface / Ground Elevation</span>
                            </div>

                            {/* Cloud SVG Simulation */}
                            <svg className="w-full h-full relative z-10" viewBox="0 0 400 360">
                                {stage === 0 && (
                                    <g>
                                        {/* Towering Cumulus Shape */}
                                        <path
                                            d="M130,320 C100,280 110,210 150,190 C140,140 200,110 240,140 C280,110 330,170 300,220 C330,260 300,320 200,320 Z"
                                            fill="#94a3b8"
                                            opacity="0.85"
                                        />
                                        {/* Pure Updraft Arrows */}
                                        <motion.line x1="180" y1="300" x2="180" y2="180" stroke="#f87171" strokeWidth="3" strokeDasharray="6 4" animate={{ strokeDashoffset: [0, -20] }} transition={{ repeat: Infinity, ease: 'linear', duration: 1 }} />
                                        <motion.line x1="220" y1="300" x2="220" y2="170" stroke="#f87171" strokeWidth="3" strokeDasharray="6 4" animate={{ strokeDashoffset: [0, -20] }} transition={{ repeat: Infinity, ease: 'linear', duration: 1 }} />
                                        <text x="200" y="250" fill="#fca5a5" fontSize="12" fontWeight="bold" textAnchor="middle">Updrafts Only</text>
                                        <text x="200" y="270" fill="#fca5a5" fontSize="10" textAnchor="middle">(~3,000 fpm)</text>
                                        <text x="200" y="100" fill="#f1f5f9" fontSize="12" fontWeight="bold" textAnchor="middle">Towering Cumulus (TCU)</text>
                                    </g>
                                )}

                                {stage === 1 && (
                                    <g>
                                        {/* Mature CB with Anvil */}
                                        <path
                                            d="M120,320 C80,260 100,180 140,160 C120,100 160,50 220,50 L360,50 C380,50 360,110 290,140 C320,200 290,320 180,320 Z"
                                            fill="#475569"
                                            opacity="0.95"
                                        />
                                        {/* Updrafts (Red) */}
                                        <motion.line x1="170" y1="310" x2="170" y2="100" stroke="#f87171" strokeWidth="3" strokeDasharray="8 4" animate={{ strokeDashoffset: [0, -24] }} transition={{ repeat: Infinity, ease: 'linear', duration: 0.8 }} />
                                        <text x="160" y="210" fill="#fca5a5" fontSize="10" fontWeight="bold">Updraft</text>
                                        <text x="160" y="225" fill="#fca5a5" fontSize="9">6,000 fpm</text>

                                        {/* Cold Downdrafts (Blue) */}
                                        <motion.line x1="250" y1="120" x2="250" y2="310" stroke="#38bdf8" strokeWidth="3.5" strokeDasharray="8 4" animate={{ strokeDashoffset: [0, 24] }} transition={{ repeat: Infinity, ease: 'linear', duration: 0.8 }} />
                                        <text x="260" y="210" fill="#7dd3fc" fontSize="10" fontWeight="bold">Downdraft</text>
                                        <text x="260" y="225" fill="#7dd3fc" fontSize="9">6,000 fpm</text>

                                        {/* Anvil Label */}
                                        <text x="310" y="40" fill="#e2e8f0" fontSize="11" fontWeight="bold">Cirrus Anvil</text>

                                        {/* Rain and Hail */}
                                        {[...Array(12)].map((_, i) => (
                                            <motion.line
                                                key={i}
                                                x1={230 + (i * 7)}
                                                y1={300}
                                                x2={220 + (i * 7)}
                                                y2={330}
                                                stroke="#60a5fa"
                                                strokeWidth="2"
                                                animate={{ y1: [300, 330], y2: [320, 350], opacity: [0, 1, 0] }}
                                                transition={{ repeat: Infinity, duration: 0.5, delay: (i % 4) * 0.1 }}
                                            />
                                        ))}

                                        {/* Lightning */}
                                        <motion.path
                                            d="M200,100 L180,180 L210,180 L190,280"
                                            stroke="#fbbf24"
                                            strokeWidth="3"
                                            fill="none"
                                            animate={{ opacity: [0, 1, 0, 1, 0] }}
                                            transition={{ repeat: Infinity, repeatDelay: 2.5, duration: 0.2 }}
                                        />
                                    </g>
                                )}

                                {stage === 2 && (
                                    <g>
                                        {/* Dissipating Anvil */}
                                        <path
                                            d="M80,80 L380,80 C360,140 280,160 220,180 C180,220 160,320 120,320 C100,320 80,260 120,200 C80,150 70,100 80,80 Z"
                                            fill="#64748b"
                                            opacity="0.6"
                                        />
                                        {/* Downdrafts only */}
                                        <motion.line x1="160" y1="120" x2="160" y2="300" stroke="#60a5fa" strokeWidth="2.5" strokeDasharray="6 4" animate={{ strokeDashoffset: [0, 20] }} transition={{ repeat: Infinity, ease: 'linear', duration: 1.2 }} />
                                        <motion.line x1="200" y1="140" x2="200" y2="300" stroke="#60a5fa" strokeWidth="2.5" strokeDasharray="6 4" animate={{ strokeDashoffset: [0, 20] }} transition={{ repeat: Infinity, ease: 'linear', duration: 1.2 }} />
                                        <text x="210" y="240" fill="#93c5fd" fontSize="11" fontWeight="bold">Downdrafts Dominate</text>
                                        <text x="230" y="70" fill="#e2e8f0" fontSize="11" fontWeight="bold">Detached Orphan Anvil</text>
                                    </g>
                                )}
                            </svg>
                        </div>

                        {/* Detailed Description Panel */}
                        <div className="space-y-6 flex flex-col justify-between">
                            <div>
                                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-3 ${stages[stage].color}`}>
                                    {stages[stage].name}
                                </div>
                                <div className="text-sm font-mono text-slate-400 mb-4">
                                    Typical Duration: <span className="text-white font-bold">{stages[stage].time}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                                        <span className="text-[10px] text-red-400 uppercase font-bold block mb-1">Max Updraft</span>
                                        <span className="text-base font-mono font-bold text-white">{stages[stage].updraft}</span>
                                    </div>
                                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                                        <span className="text-[10px] text-sky-400 uppercase font-bold block mb-1">Max Downdraft</span>
                                        <span className="text-base font-mono font-bold text-white">{stages[stage].downdraft}</span>
                                    </div>
                                </div>

                                <ul className="space-y-3">
                                    {stages[stage].features.map((feat, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
                                <span className="text-slate-400 font-bold block mb-1">Precipitation Signature:</span>
                                <span className="text-slate-200">{stages[stage].precip}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: MICROBURST SHEAR */}
            {subTab === 'microburst' && (
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-8">
                    <div>
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                            <AlertOctagon className="text-red-400" />
                            Microburst Mechanics & 6,000 fpm Performance Shear
                        </h3>
                        <p className="text-slate-400 text-xs mt-1">
                            An intense, localized downdraft (&lt;4 km diameter) that strikes the surface and curls into an outward divergent radial vortex.
                        </p>
                    </div>

                    {/* Flight Trajectory Schematic */}
                    <div className="relative h-72 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden p-4">
                        <svg className="w-full h-full" viewBox="0 0 600 240">
                            {/* Ground Line & Runway */}
                            <line x1="20" y1="200" x2="580" y2="200" stroke="#475569" strokeWidth="2" />
                            <rect x="420" y="196" width="140" height="8" fill="#e2e8f0" rx="2" />
                            <text x="490" y="220" fill="#94a3b8" fontSize="10" textAnchor="middle">Runway Threshold</text>

                            {/* Microburst Core Downdraft (6,000 fpm) */}
                            <path d="M260,20 L340,20 L350,180 L250,180 Z" fill="#38bdf8" fillOpacity="0.15" />
                            <motion.line x1="300" y1="30" x2="300" y2="180" stroke="#0ea5e9" strokeWidth="4" strokeDasharray="8 6" animate={{ strokeDashoffset: [0, 28] }} transition={{ repeat: Infinity, ease: 'linear', duration: 0.6 }} />
                            <text x="300" y="80" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">DOWNDRAFT</text>
                            <text x="300" y="98" fill="#ef4444" fontSize="13" fontWeight="black" textAnchor="middle">UP TO 6,000 FPM</text>

                            {/* Outflow Curled Vortices */}
                            <path d="M290,180 Q250,180 200,160" fill="none" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#windArrow)" />
                            <path d="M310,180 Q350,180 400,160" fill="none" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#windArrow)" />

                            {/* Flight Path (White dashed line) */}
                            <path
                                d="M40,60 L200,90 L260,110 L300,180 L400,195"
                                fill="none"
                                stroke="#f87171"
                                strokeWidth="2.5"
                                strokeDasharray="5 5"
                            />

                            {/* Phase 1: Sudden Headwind Increase */}
                            <circle cx="160" cy="85" r="5" fill="#34d399" />
                            <text x="160" y="70" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">1. Headwind Surge</text>
                            <text x="160" y="115" fill="#94a3b8" fontSize="8" textAnchor="middle">Airspeed balloons, pitch up</text>

                            {/* Phase 2: Core Downdraft */}
                            <circle cx="300" cy="180" r="5" fill="#f59e0b" />
                            <text x="300" y="160" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle">2. Severe Downdraft</text>

                            {/* Phase 3: Tailwind Shear & Crash Hazard */}
                            <circle cx="380" cy="190" r="5" fill="#ef4444" />
                            <text x="440" y="160" fill="#ef4444" fontSize="10" fontWeight="black" textAnchor="middle">3. Massive Tailwind Shear</text>
                            <text x="440" y="175" fill="#fca5a5" fontSize="8" textAnchor="middle">Loss of 45-90 kts airspeed!</text>
                        </svg>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                            <span className="text-emerald-400 font-bold text-xs uppercase block">Phase 1: The Trap</span>
                            <h4 className="text-white font-bold text-sm">Headwind Surge</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                As you penetrate the outflow boundary, headwind increases rapidly (+20 to +40 kts). Lift increases and the aircraft balloons above glideslope. Pilot instinctively pulls power to idle!
                            </p>
                        </div>

                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                            <span className="text-amber-400 font-bold text-xs uppercase block">Phase 2: The Core</span>
                            <h4 className="text-white font-bold text-sm">Crushing Downdraft</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Entering the central downdraft shaft, the aircraft is pushed downward at rates up to <strong>6,000 fpm</strong>. With throttles retarded from Phase 1, sink rate spikes out of control.
                            </p>
                        </div>

                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                            <span className="text-red-400 font-bold text-xs uppercase block">Phase 3: The Shear</span>
                            <h4 className="text-white font-bold text-sm">Catastrophic Tailwind</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Exiting the core, the wind instantly reverses to a crushing tailwind. Total vector change exceeds <strong>45 to 90 kts</strong>. Aircraft stalls and impacts ground short of runway.
                            </p>
                        </div>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ShieldAlert className="text-red-400" size={24} />
                            <div>
                                <h4 className="text-red-300 font-bold text-sm">Mandatory Pilot Action upon Windshear Warning</h4>
                                <p className="text-xs text-slate-400">
                                    Immediate Go-Around: Disconnect autopilot, advance maximum takeoff/go-around (TOGA) thrust, rotate to flight director pitch-limit cue, and do NOT change configuration until clear!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: ANVIL & HAIL HAZARD */}
            {subTab === 'anvil' && (
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-8">
                    <div>
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                            <ShieldAlert className="text-amber-400" />
                            Cockpit Mental Model: "The Anvil Points the Way"
                        </h3>
                        <p className="text-slate-400 text-xs mt-1">
                            High-altitude tropospheric winds shear the top of mature Cb cells into a spreading cirrus anvil blown downwind.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="relative h-72 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden p-4">
                            <svg className="w-full h-full" viewBox="0 0 500 240">
                                {/* Upper Jet Wind Arrow */}
                                <line x1="80" y1="30" x2="420" y2="30" stroke="#38bdf8" strokeWidth="2" strokeDasharray="8 4" />
                                <text x="250" y="24" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">High Altitude Winds (Downwind Flow →)</text>

                                {/* CB Cloud Core */}
                                <path
                                    d="M60,220 C40,160 80,120 120,100 C110,60 160,40 200,40 L380,40 C430,40 400,90 280,110 C300,160 260,220 160,220 Z"
                                    fill="#475569"
                                    opacity="0.9"
                                />

                                {/* Falling Hail under Anvil */}
                                <g>
                                    {[...Array(14)].map((_, i) => (
                                        <motion.circle
                                            key={i}
                                            cx={260 + (i * 9)}
                                            cy={90 + (i * 5)}
                                            r="3.5"
                                            fill="#e0f2fe"
                                            stroke="#0284c7"
                                            strokeWidth="1"
                                            animate={{ y: [0, 80], opacity: [0, 1, 0] }}
                                            transition={{ repeat: Infinity, duration: 1.5, delay: (i % 5) * 0.3 }}
                                        />
                                    ))}
                                </g>

                                <rect x="230" y="140" width="160" height="36" rx="6" fill="#7f1d1d" fillOpacity="0.8" stroke="#ef4444" strokeWidth="1" />
                                <text x="310" y="155" fill="#fca5a5" fontSize="10" fontWeight="bold" textAnchor="middle">CLEAR AIR HAIL ZONE</text>
                                <text x="310" y="169" fill="#fecaca" fontSize="9" textAnchor="middle">Extends up to 20 NM Downwind</text>

                                {/* Danger aircraft icon */}
                                <line x1="280" y1="180" x2="340" y2="180" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
                                <text x="310" y="200" fill="#ef4444" fontSize="10" fontWeight="black" textAnchor="middle">NEVER FLY UNDER ANVIL</text>
                            </svg>
                        </div>

                        <div className="space-y-4 text-xs text-slate-300">
                            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                                <h4 className="text-white font-bold text-sm">Anti-Pattern: Flying Beneath the Cirrus Anvil</h4>
                                <p className="text-slate-400 leading-relaxed">
                                    Massive updrafts inside the Cb core loft supercooled water high into the upper reaches of the cloud where it freezes into large hailstones. Upper winds blow these stones out into the cirrus anvil.
                                </p>
                                <p className="text-slate-400 leading-relaxed">
                                    Because hail is heavy, it falls out of the anvil into <strong>completely clear air</strong> up to <strong>20 nautical miles downwind</strong> of the visible storm core!
                                </p>
                            </div>

                            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                                <h4 className="text-amber-300 font-bold text-sm">Operational Separation Rules</h4>
                                <ul className="space-y-1.5 text-slate-400">
                                    <li>• <strong className="text-white">Lateral Clearance:</strong> Maintain at least <strong>20 NM</strong> separation from any severe Cb cell.</li>
                                    <li>• <strong className="text-white">Vertical Clearance (Topping):</strong> At least <strong>1,000 ft per 10 kts</strong> of wind speed over the top, or minimum <strong>5,000 ft clearance</strong> above cloud top.</li>
                                    <li>• <strong className="text-white">Radar Blindness:</strong> Hail in clear air beneath an anvil has no wet liquid skin and is virtually invisible on airborne X-band radar until it strikes the aircraft!</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Thunderstorms;
