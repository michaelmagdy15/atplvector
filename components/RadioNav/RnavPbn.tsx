import React, { useState, useEffect } from 'react';
import { View } from '../../types';
import { ArrowLeft, Waypoints, Map as MapIcon, LocateFixed, Globe, AlertTriangle, Database, Activity, CheckCircle2 } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const RnavPbn: React.FC<Props> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState<number>(0);

    // Tab 1: Evolution (Conv vs RNAV)
    const [navMode, setNavMode] = useState<'CONV' | 'RNAV'>('CONV');

    // Tab 3: RNP (Monitoring)
    const [rnpValue, setRnpValue] = useState(1.0);
    const [anpValue, setAnpValue] = useState(0.5);
    const [alertActive, setAlertActive] = useState(false);

    useEffect(() => {
        if (anpValue > rnpValue) {
            setAlertActive(true);
        } else {
            setAlertActive(false);
        }
    }, [anpValue, rnpValue]);

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => onNavigate?.(View.RAD_NAV_HOME)}
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-500/10 rounded-lg">
                            <Waypoints className="text-teal-400" size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-100">RNAV & PBN</h1>
                            <p className="text-xs text-slate-400">Performance Based Navigation</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-slate-900/50 p-1 rounded-xl flex overflow-x-auto gap-1 border border-slate-800">
                {[
                    { id: 0, label: '1. Evolution', icon: MapIcon },
                    { id: 1, label: '2. RNAV Standards', icon: Activity },
                    { id: 2, label: '3. RNP Concepts', icon: AlertTriangle },
                    { id: 3, label: '4. Approach Ops', icon: LocateFixed },
                    { id: 4, label: '5. Infrastructure', icon: Globe },
                    { id: 5, label: '6. Definitions', icon: Database },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* TAB CONTENT */}
            <div className="min-h-[500px]">

                {/* 1. EVOLUTION OF NAVIGATION */}
                {activeTab === 0 && (
                    <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 relative overflow-hidden h-[400px]">
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-950"></div>

                            {/* Map Visualization */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                <defs>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                                        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                    </filter>
                                </defs>

                                {/* VOR Stations */}
                                <g transform="translate(100, 100)">
                                    <path d="M -8,8 L 0,-8 L 8,8 L -8,8" fill="none" stroke="#3b82f6" strokeWidth="2" />
                                    <circle cx="0" cy="0" r="2" fill="#3b82f6" />
                                    <text x="-15" y="-15" fill="#3b82f6" fontSize="10">VOR A</text>
                                </g>
                                <g transform="translate(350, 300)">
                                    <path d="M -8,8 L 0,-8 L 8,8 L -8,8" fill="none" stroke="#3b82f6" strokeWidth="2" />
                                    <circle cx="0" cy="0" r="2" fill="#3b82f6" />
                                    <text x="-15" y="20" fill="#3b82f6" fontSize="10">VOR B</text>
                                </g>

                                {navMode === 'CONV' ? (
                                    <>
                                        {/* Zig Zag Path */}
                                        <path d="M 50,300 L 100,100 L 350,300 L 450,300"
                                            stroke="#fbbf24" strokeWidth="2" fill="none" strokeDasharray="6,4" />
                                        <circle cx="100" cy="100" r="3" fill="#fbbf24" />
                                        <text x="110" y="100" fill="#fbbf24" fontSize="10">Fly Over</text>
                                    </>
                                ) : (
                                    <>
                                        {/* Direct Path */}
                                        <path d="M 50,300 L 200,150 L 450,250" stroke="#2dd4bf" strokeWidth="2" fill="none" filter="url(#glow)" />

                                        {/* Virtual Waypoints */}
                                        <g transform="translate(200, 150)">
                                            <path d="M 0,-6 L 5,0 L 0,6 L -5,0 Z" fill="#14b8a6" />
                                            <text x="10" y="0" fill="#14b8a6" fontSize="10">WPT1 (Virtual)</text>
                                        </g>

                                        {/* Reference Lines representing inputs */}
                                        <line x1="100" y1="100" x2="200" y2="150" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="2,2" />
                                        <line x1="350" y1="300" x2="200" y2="150" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="2,2" />
                                    </>
                                )}
                            </svg>

                            <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-700 p-3 rounded-lg backdrop-blur">
                                <div className="text-xs text-slate-400 mb-1">Navigation Method</div>
                                <div className="font-bold text-slate-200">
                                    {navMode === 'CONV' ? 'Navaid-to-Navaid (Zig-Zag)' : 'Area Navigation (Direct)'}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="glass-panel p-6 rounded-xl">
                                <h2 className="text-xl font-bold text-white mb-4">Evolution of Navigation</h2>
                                <p className="text-slate-400 mb-6">
                                    Why RNAV? Early navigation required flying strictly between physical ground stations (VORs, NDBs).
                                    This limited airspace efficiency and forced longer routes.
                                </p>

                                <div className="bg-slate-900/50 p-2 rounded-lg flex gap-2 border border-slate-800 mb-6">
                                    <button
                                        onClick={() => setNavMode('CONV')}
                                        className={`flex-1 py-3 rounded-md text-sm font-bold transition-colors ${navMode === 'CONV' ? 'bg-amber-600 text-white' : 'text-slate-500 hover:bg-slate-800'}`}
                                    >
                                        Conventional
                                    </button>
                                    <button
                                        onClick={() => setNavMode('RNAV')}
                                        className={`flex-1 py-3 rounded-md text-sm font-bold transition-colors ${navMode === 'RNAV' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:bg-slate-800'}`}
                                    >
                                        RNAV (PBN)
                                    </button>
                                </div>

                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-sm text-slate-300">
                                        <div className="mt-1 p-1 bg-teal-500/20 rounded text-teal-400"><CheckCircle2 size={14} /></div>
                                        <span><strong>Virtual Waypoints:</strong> Defined by Lat/Long, not physical location.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-300">
                                        <div className="mt-1 p-1 bg-teal-500/20 rounded text-teal-400"><CheckCircle2 size={14} /></div>
                                        <span><strong>"Cutting Corners":</strong> Fly direct routes to save fuel and time.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-slate-300">
                                        <div className="mt-1 p-1 bg-teal-500/20 rounded text-teal-400"><CheckCircle2 size={14} /></div>
                                        <span><strong>FMS Role:</strong> Calculate position from multiple sensors (GPS, IRS, DME/DME).</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. RNAV STANDARDS */}
                {activeTab === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="glass-panel p-6 rounded-xl border-l-4 border-teal-500">
                                <h3 className="text-lg font-bold text-white mb-2">Accuracy Standard (95%)</h3>
                                <p className="text-slate-400 text-sm mb-4">
                                    The number in an RNAV/RNP designation (e.g., RNAV 1) represents the accuracy required
                                    for <strong>95% of the flight time</strong>.
                                </p>
                                <div className="h-32 bg-slate-900 rounded-lg relative overflow-hidden flex items-center justify-center">
                                    <div className="absolute inset-x-0 h-16 bg-teal-500/10 border-y border-teal-500/30 flex items-center justify-center">
                                        <span className="text-teal-400 text-xs font-mono">Total System Error (TSE)</span>
                                    </div>
                                    <div className="absolute h-2 w-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                                    <div className="absolute bottom-2 text-[10px] text-slate-500">Must stay in lane 95% of time</div>
                                </div>
                            </div>

                            <div className="glass-panel p-6 rounded-xl border-l-4 border-rose-500">
                                <h3 className="text-lg font-bold text-white mb-2">Alerting Requirements</h3>
                                <p className="text-slate-400 text-sm mb-4">
                                    <strong>Crucial Distinction:</strong> RNAV equipment must alert if it <em>fails completely</em>,
                                    but is <strong>NOT</strong> required to alert if the accuracy simply drifts apart.
                                </p>
                                <div className="flex items-center gap-3 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                                    <AlertTriangle className="text-rose-500 shrink-0" />
                                    <div className="text-xs text-rose-200">
                                        "I don't know if I'm drifting off course, but I'm still powered on." - RNAV System
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                            <h3 className="text-md font-bold text-slate-300 mb-4">Terminology Updates</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-700 opacity-50">
                                    <span className="text-slate-500 line-through decoration-red-500">Basic RNAV (B-RNAV)</span>
                                    <span className="text-xs text-red-500 font-bold">OBSOLETE</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-900 rounded border border-teal-500/30">
                                    <span className="text-teal-400 font-bold">RNAV 5</span>
                                    <span className="text-xs text-slate-400">Current Standard</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-700 opacity-50">
                                    <span className="text-slate-500 line-through decoration-red-500">Precision RNAV (P-RNAV)</span>
                                    <span className="text-xs text-red-500 font-bold">OBSOLETE</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-900 rounded border border-teal-500/30">
                                    <span className="text-teal-400 font-bold">RNAV 1</span>
                                    <span className="text-xs text-slate-400">Current Standard</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. RNP CONCEPTS */}
                {activeTab === 2 && (
                    <div className="grid lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="space-y-6">
                            <div className="glass-panel p-6 rounded-xl">
                                <h2 className="text-xl font-bold text-white mb-2">The RNP Difference</h2>
                                <p className="text-slate-400 mb-6">
                                    <strong>"On-Board Performance Monitoring and Alerting"</strong> is the key difference between RNAV and RNP.
                                    RNP self-monitors and warns the pilot if error exceeds the limit.
                                </p>
                            </div>

                            <div className="glass-panel p-6 rounded-xl border border-slate-700">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-slate-200">Simulation Control</h3>
                                    <div className={`px-2 py-1 rounded text-xs font-bold ${alertActive ? 'bg-red-500 animate-pulse text-white' : 'bg-slate-800 text-slate-500'}`}>
                                        {alertActive ? 'UNABLE RNP' : 'SYSTEM OK'}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-xs mb-2">
                                            <span className="text-slate-400">Required (RNP)</span>
                                            <span className="text-teal-400 font-mono">{rnpValue.toFixed(1)} NM</span>
                                        </div>
                                        <input
                                            type="range" min="0.1" max="2.0" step="0.1"
                                            value={rnpValue} onChange={(e) => setRnpValue(parseFloat(e.target.value))}
                                            className="w-full accent-teal-500"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-xs mb-2">
                                            <span className="text-slate-400">Actual (ANP/EPE)</span>
                                            <span className={`${anpValue > rnpValue ? 'text-red-500' : 'text-emerald-400'} font-mono`}>{anpValue.toFixed(2)} NM</span>
                                        </div>
                                        <input
                                            type="range" min="0.0" max="2.5" step="0.05"
                                            value={anpValue} onChange={(e) => setAnpValue(parseFloat(e.target.value))}
                                            className="w-full accent-rose-500"
                                        />
                                        <div className="text-[10px] text-slate-500 mt-1">Simulate degradation of signal</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visualization of Containment */}
                        <div className="bg-slate-950 rounded-2xl p-8 flex items-center justify-center relative border border-slate-800">
                            {/* RNP Tunnel */}
                            <div
                                className="absolute h-full border-x-2 border-dashed transition-all duration-500 flex items-center justify-center"
                                style={{
                                    width: `${rnpValue * 100}px`,
                                    borderColor: alertActive ? '#ef4444' : '#2dd4bf',
                                    backgroundColor: alertActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(45, 212, 191, 0.05)'
                                }}
                            >
                                <span className="text-[10px] font-mono text-slate-500 absolute top-4">RNP Boundary</span>
                            </div>

                            {/* Aircraft Position / Error */}
                            <div
                                className="h-4 w-4 rounded-full shadow-[0_0_15px] transition-all duration-300 relative z-10"
                                style={{
                                    backgroundColor: alertActive ? '#ef4444' : '#34d399',
                                    boxShadow: alertActive ? '0 0 20px #ef4444' : '0 0 15px #34d399',
                                    transform: `translateX(${anpValue * 50}px)` // Scaled for visual
                                }}
                            >
                            </div>

                            {/* Center Line */}
                            <div className="absolute h-full w-px bg-slate-700"></div>

                            {alertActive && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur border border-red-500 text-red-500 px-6 py-4 rounded-xl font-bold text-xl animate-bounce z-20">
                                    UNABLE RNP
                                </div>
                            )}

                            <div className="absolute bottom-4 text-center w-full">
                                <div className="text-xs text-slate-500">
                                    If <strong>Actual Performance</strong> &gt; <strong>RNP Limit</strong>, Alert MUST Trigger.
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. APPROACH OPERATIONS */}
                {activeTab === 3 && (
                    <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="glass-panel p-6 rounded-xl space-y-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <LocateFixed size={20} className="text-teal-400" />
                                RNP APCH (Standard)
                            </h3>
                            <p className="text-sm text-slate-400">
                                Formerly "GPS Approach" or "GNSS Approach". The standard 2D/3D approach used globally.
                            </p>
                            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-3">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-teal-500" />
                                    <span className="text-sm text-slate-200">Final App Accuracy: <strong>0.3 NM</strong></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-teal-500" />
                                    <span className="text-sm text-slate-200">Straight Segments Only</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-teal-500" />
                                    <span className="text-sm text-slate-200">Equipment: Basic GNSS (RAIM)</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel p-6 rounded-xl space-y-4 border-l-4 border-amber-500">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Waypoints size={20} className="text-amber-400" />
                                    RNP AR APCH
                                </h3>
                                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-500 text-[10px] font-bold rounded border border-amber-500/30">AUTHORIZATION REQUIRED</span>
                            </div>
                            <p className="text-sm text-slate-400">
                                For complex terrain (e.g., Innsbruck, Queenstown). Requires specific airline & crew certification.
                            </p>
                            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                    <span className="text-sm text-slate-200">Accuracy: <strong>0.3 NM down to 0.1 NM</strong></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                    <span className="text-sm text-slate-200">Curved Paths (RF Legs) in Final</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                    <span className="text-sm text-slate-200">Mandatory: Auto-flight Coupling</span>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 bg-slate-800/50 p-6 rounded-xl text-center">
                            <div className="inline-block p-4 bg-slate-900 rounded-full mb-4">
                                <AlertTriangle size={32} className="text-amber-500" />
                            </div>
                            <h4 className="text-white font-bold mb-2">Why "AR"?</h4>
                            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
                                "AR" stands for <strong>Authorization Required</strong> (formerly SAAAR).
                                Because the margins are so tight (0.1 NM), errors could be catastrophic.
                                Therefore, the Operator, Aircraft, and Crew must all be specifically authorized.
                            </p>
                        </div>
                    </div>
                )}

                {/* 5. INFRASTRUCTURE */}
                {activeTab === 4 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">The PBN Concept</h2>
                            <p className="text-slate-400">PBN relies on three core pillars to function lawfully.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Pillar 1 */}
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center hover:border-teal-500/50 transition-colors">
                                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Globe size={32} className="text-blue-400" />
                                </div>
                                <h3 className="font-bold text-white mb-2">1. Infrastructure</h3>
                                <p className="text-xs text-slate-400">
                                    The physical signals available.
                                    <br /><br />
                                    <strong>GNSS (Satellites)</strong><br />
                                    <strong>DME/DME</strong><br />
                                    <strong>VOR/DME</strong>
                                </p>
                            </div>

                            {/* Pillar 2 */}
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center hover:border-teal-500/50 transition-colors">
                                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Database size={32} className="text-purple-400" />
                                </div>
                                <h3 className="font-bold text-white mb-2">2. Applications</h3>
                                <p className="text-xs text-slate-400">
                                    The rules and specs.
                                    <br /><br />
                                    <strong>RNAV 1 / RNAV 5</strong><br />
                                    <strong>RNP 4 / RNP 1</strong><br />
                                    <strong>RNP APCH</strong>
                                </p>
                            </div>

                            {/* Pillar 3 */}
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center hover:border-teal-500/50 transition-colors">
                                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Activity size={32} className="text-emerald-400" />
                                </div>
                                <h3 className="font-bold text-white mb-2">3. Equipment</h3>
                                <p className="text-xs text-slate-400">
                                    Onboard capability.
                                    <br /><br />
                                    <strong>FMS / GPS Unit</strong><br />
                                    <strong>Navigation Database</strong><br />
                                    <strong>RNP Monitoring & Alerting</strong>
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 bg-slate-800/50 rounded-xl p-6 flex items-start gap-4">
                            <Database className="text-sky-400 shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-white text-sm mb-1">Crucial: The Navigation Database</h4>
                                <p className="text-xs text-slate-400">
                                    PBN cannot be flown "visually" or by manual tuning alone. It requires a valid, current
                                    <strong> Onboard Navigation Database</strong> to define the virtual waypoints and paths.
                                    If the database is expired, the system cannot ensure the required accuracy.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 6. DEFINITIONS & MNEMONICS */}
                {activeTab === 5 && (
                    <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="glass-panel p-6 rounded-xl space-y-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Database size={20} className="text-teal-400" />
                                Essential Definitions
                            </h3>
                            <div className="space-y-4">
                                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                                    <span className="text-teal-400 font-bold text-xs block mb-1">PBN (Performance Based Navigation)</span>
                                    <p className="text-xs text-slate-400">Area navigation based on performance requirements for aircraft operating along an ATS route, on an instrument approach procedure or in a designated airspace.</p>
                                </div>
                                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                                    <span className="text-teal-400 font-bold text-xs block mb-1">RNAV (Area Navigation)</span>
                                    <p className="text-xs text-slate-400">A method of navigation which permits aircraft operation on any desired flight path within the coverage of ground- or space-based navigation aids or within the limits of the capability of self-contained aids, or a combination of these.</p>
                                </div>
                                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                                    <span className="text-teal-400 font-bold text-xs block mb-1">RNP (Required Navigation Performance)</span>
                                    <p className="text-xs text-slate-400">A statement of the navigation performance necessary for operation within a defined airspace. RNP = RNAV + On-Board Monitoring & Alerting.</p>
                                </div>
                                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                                    <span className="text-teal-400 font-bold text-xs block mb-1">RF Leg (Radius to Fix)</span>
                                    <p className="text-xs text-slate-400">A specific constant radius circular vessel path about a defined turn center. Only available in advanced RNP operations (like RNP AR APCH).</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="glass-panel p-6 rounded-xl space-y-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Activity size={20} className="text-amber-400" />
                                    Mnemonics & Key Concepts
                                </h3>

                                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                                    <h4 className="text-sm font-bold text-white mb-2">The PBN Triad: "I-S-E"</h4>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-3 bg-slate-950 p-2 rounded">
                                            <div className="w-6 h-6 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">I</div>
                                            <span className="text-xs text-slate-300"><strong>Infrastructure:</strong> Navaids (GNSS, DME, VOR)</span>
                                        </li>
                                        <li className="flex items-center gap-3 bg-slate-950 p-2 rounded">
                                            <div className="w-6 h-6 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold">S</div>
                                            <span className="text-xs text-slate-300"><strong>Specification:</strong> Rules (RNAV 1, RNP 4)</span>
                                        </li>
                                        <li className="flex items-center gap-3 bg-slate-950 p-2 rounded">
                                            <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">E</div>
                                            <span className="text-xs text-slate-300"><strong>Equipment:</strong> FMS, Database, Alerting</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                                    <h4 className="text-sm font-bold text-white mb-2">Total System Error (TSE)</h4>
                                    <p className="text-xs text-slate-400 mb-3">TSE is the vector sum of three errors:</p>
                                    <div className="text-center space-y-1">
                                        <div className="text-xs font-mono text-teal-400 bg-teal-950/30 p-1 rounded">PDE (Path Definition Error)</div>
                                        <div className="text-[10px] text-slate-500">+</div>
                                        <div className="text-xs font-mono text-teal-400 bg-teal-950/30 p-1 rounded">FTE (Flight Technical Error)</div>
                                        <div className="text-[10px] text-slate-500">+</div>
                                        <div className="text-xs font-mono text-teal-400 bg-teal-950/30 p-1 rounded">NSE (Navigation System Error)</div>
                                        <div className="text-[10px] text-slate-500">=</div>
                                        <div className="text-sm font-bold text-white border border-teal-500 rounded p-1 inline-block">TSE (Total System Error)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RnavPbn;
