import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, Navigation, AlertTriangle, Layers, CheckCircle, XCircle, ArrowDown, Gauge, ShieldAlert, BookOpen, Compass } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

type Tab = 'COMPRESSIBILITY' | 'TRANSONIC' | 'SWEPT_WINGS' | 'LIMITS' | 'QUIZ';

const PoFHighSpeed: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('COMPRESSIBILITY');

    // Tab 1 States: Compressibility & Speed of Sound
    const [altitude, setAltitude] = useState(35000); // default to FL350 for standard worked example
    const [tas, setTas] = useState(450); // kt
    
    const tempK = useMemo(() => {
        // ISA: 15°C at sea level, lapse rate 1.98°C/1000 ft up to 36,089 ft, then constant at -56.5°C
        let tempC = 15;
        if (altitude <= 36089) {
            tempC -= (altitude / 1000) * 1.98;
        } else {
            tempC = -56.5;
        }
        return tempC + 273.15;
    }, [altitude]);

    // Speed of sound: a = 38.94 * sqrt(T_Kelvin) in knots
    const speedOfSoundKt = useMemo(() => {
        return 38.94 * Math.sqrt(tempK);
    }, [tempK]);

    const machNumber = useMemo(() => tas / speedOfSoundKt, [tas, speedOfSoundKt]);

    const getMachRegime = (m: number) => {
        if (m < 0.75) return { name: 'Subsonic', color: 'bg-blue-500', flow: 'Incompressible assumption valid' };
        if (m < 1.20) return { name: 'Transonic', color: 'bg-amber-500', flow: 'Mixed subsonic and supersonic flow with shockwaves' };
        if (m < 5.0) return { name: 'Supersonic', color: 'bg-orange-500', flow: 'Fully supersonic flow throughout' };
        return { name: 'Hypersonic', color: 'bg-red-500', flow: 'High kinetic aerodynamic heating dominant' };
    };
    
    const regime = getMachRegime(machNumber);

    // Tab 2 States: Transonic & Mach Tuck Simulation
    const [transonicMach, setTransonicMach] = useState(0.82); // M 0.70 to 0.95
    const [shockType, setShockType] = useState<'NORMAL' | 'OBLIQUE' | 'BOW'>('NORMAL');

    // Center of pressure position based on Mach number
    // Subsonic CP ~ 25% chord. Supersonic CP ~ 50% chord.
    const cpPercent = useMemo(() => {
        if (transonicMach <= 0.76) return 25;
        if (transonicMach >= 0.92) return 50;
        const progress = (transonicMach - 0.76) / (0.92 - 0.76);
        return 25 + progress * 25;
    }, [transonicMach]);

    // Shock wave position and boundary layer separation
    const shockX = useMemo(() => {
        if (transonicMach < 0.78) return null;
        // Shock moves aft as Mach increases
        const progress = (transonicMach - 0.78) / (0.95 - 0.78);
        return 130 + progress * 80;
    }, [transonicMach]);

    const dragData = useMemo(() => {
        const data = [];
        for (let m = 0.5; m <= 1.5; m += 0.05) {
            let cd = 0.02; // base parasite drag
            if (m > 0.8 && m < 1.0) cd += Math.pow((m - 0.8) * 3, 2) * 0.05;
            if (m >= 1.0) cd = 0.1 - (m - 1.0) * 0.02;
            data.push({ mach: m.toFixed(2), cd: Number(cd.toFixed(4)) });
        }
        return data;
    }, []);

    // Tab 3 States: Swept Wings
    const [sweepAngle, setSweepAngle] = useState(30);
    const [hasFences, setHasFences] = useState(true);
    const [hasWashout, setHasWashout] = useState(true);

    // Tab 4 States: Limits & Coffin Corner
    const [coffinAltitude, setCoffinAltitude] = useState(38000); // ft

    // Quiz States
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
    const [showQuizResults, setShowQuizResults] = useState(false);

    const QUIZ_QUESTIONS = [
        { 
            q: "The critical Mach number (Mcrit) is defined as the free-stream Mach number at which:", 
            options: ["The aircraft breaks the sound barrier", "Local airflow over the wing first reaches Mach 1.0", "Shock waves reach the trailing edge", "Wave drag begins to decrease"], 
            answer: 1, 
            rationale: "Mcrit is the speed where the fastest moving air over the wing (usually upper surface peak camber) first accelerates to Mach 1.0." 
        },
        { 
            q: "What is the standard Speed of Sound formula in knots as a function of absolute temperature?", 
            options: ["a = 20.05 √T", "a = 38.94 √T (with T in Kelvin)", "a = 661 × (P / P0)", "a = 38.94 × T (Celsius)"], 
            answer: 1, 
            rationale: "In aviation units: a = 38.94 √T(Kelvin) knots. Temperature is the ONLY parameter governing the speed of sound in air." 
        },
        { 
            q: "Mach tuck is primarily caused by which two aerodynamic phenomena?", 
            options: [
                "Forward movement of Center of Pressure and increased elevator power",
                "Aft movement of Center of Pressure and loss of downwash over the horizontal tail", 
                "Center of gravity shifting rearward as fuel flows aft", 
                "Leading edge slat deployment at transonic speed"
            ], 
            answer: 1, 
            rationale: "As shock waves move aft, the Center of Pressure shifts rearward (from ~25% to ~50% chord) creating a nose-down moment, while boundary layer separation over the wing root reduces downwash at the tailplane, further pitching the nose down." 
        },
        { 
            q: "Why do swept wings suffer from severe pitch-up tendency at the stall?", 
            options: [
                "Because the wing root stalls first, shifting lift to the tips", 
                "Because spanwise flow causes the wingtips to stall first; since swept tips are aft of the CG, losing tip lift pitches the nose UP", 
                "Because sweepback reduces dihedral effect", 
                "Because high-speed buffeting pulls the elevator up"
            ], 
            answer: 1, 
            rationale: "Spanwise boundary layer outflow thickens the tip boundary layer, provoking tip stall. Because swept tips are located behind the CG, losing tip lift causes a violent, uncommanded pitch-up into deep stall." 
        },
        { 
            q: "What is the primary trade-off of sweeping a wing to delay Mcrit?", 
            options: [
                "Lower parasite drag at low speeds", 
                "Increased tip stall susceptibility, pitch-up tendency, and Dutch Roll dynamic coupling", 
                "Decreased structural weight of the wing spar", 
                "Higher low-speed lift coefficient"
            ], 
            answer: 1, 
            rationale: "While sweep delays Mcrit by reducing effective chordwise velocity (V cos Λ), it causes spanwise flow, tip stall, dangerous pitch-up, and Dutch roll instability requiring active yaw dampers." 
        }
    ];

    const calculateScore = () => Object.keys(quizAnswers).reduce((acc, key) => acc + (quizAnswers[Number(key)] === QUIZ_QUESTIONS[Number(key)].answer ? 1 : 0), 0);

    return (
        <div className="bg-slate-900/50 p-4 md:p-8 rounded-2xl border border-slate-700 backdrop-blur-sm text-slate-300 w-full max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                        <Zap size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                            High-Speed Aerodynamics (Transonic Flight & Swept Wings)
                        </h2>
                        <p className="text-slate-400 text-sm">
                            Master EASA 081 transonic aerodynamics: Speed of sound (38.94√T), M<sub>crit</sub>, Shock Stall, Center of Pressure aft migration, Mach Tuck, and Swept Wing trade-offs.
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-700 pb-4">
                {[
                    { id: 'COMPRESSIBILITY', label: 'Speed of Sound & Mach', icon: Layers },
                    { id: 'TRANSONIC', label: 'Transonic & Mach Tuck', icon: Activity },
                    { id: 'SWEPT_WINGS', label: 'Swept Wing Trade-offs', icon: Navigation },
                    { id: 'LIMITS', label: 'Coffin Corner Limits', icon: AlertTriangle },
                    { id: 'QUIZ', label: 'ATPL Knowledge Check', icon: CheckCircle }
                ].map(t => {
                    const Icon = t.icon;
                    return (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id as Tab)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 ${
                                activeTab === t.id
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                            }`}
                        >
                            <Icon size={16} /> {t.label}
                        </button>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* ===== TAB 1: COMPRESSIBILITY & SPEED OF SOUND ===== */}
                    {activeTab === 'COMPRESSIBILITY' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-6">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Gauge size={20} className="text-emerald-400" />
                                        Speed of Sound & Mach Calculator
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                                                <span>Flight Altitude: {altitude.toLocaleString()} ft</span>
                                                <span className="text-purple-400 font-mono">
                                                    {(tempK - 273.15).toFixed(1)} °C ({tempK.toFixed(1)} K)
                                                </span>
                                            </div>
                                            <input 
                                                type="range" min="0" max="45000" step="1000" 
                                                value={altitude} 
                                                onChange={e => setAltitude(Number(e.target.value))}
                                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                                                <span>True Airspeed (TAS): {tas} kt</span>
                                                <span className="text-sky-400 font-mono">{Math.round(tas * 1.852)} km/h</span>
                                            </div>
                                            <input 
                                                type="range" min="150" max="650" step="10" 
                                                value={tas} 
                                                onChange={e => setTas(Number(e.target.value))}
                                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                                            />
                                        </div>

                                        {/* Quick Jump Buttons */}
                                        <div className="flex gap-2 pt-2">
                                            {[
                                                { label: 'Sea Level (ISA)', alt: 0, speed: 450 },
                                                { label: 'FL250', alt: 25000, speed: 450 },
                                                { label: 'FL350 (Standard)', alt: 35000, speed: 450 },
                                                { label: 'FL410 (Tropopause)', alt: 41000, speed: 450 }
                                            ].map((preset, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => { setAltitude(preset.alt); setTas(preset.speed); }}
                                                    className="flex-1 py-1.5 px-2 bg-slate-900 border border-slate-700 hover:border-emerald-500/50 rounded-lg text-[10px] font-bold text-slate-300 transition-colors"
                                                >
                                                    {preset.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-700 text-center">
                                            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Local Speed of Sound (a)</span>
                                            <span className="text-2xl font-black text-white font-mono">{speedOfSoundKt.toFixed(1)}</span>
                                            <span className="text-xs text-slate-500 ml-1 font-mono">knots</span>
                                            <span className="text-[10px] text-emerald-400 block mt-1 font-mono">a = 38.94 · √T<sub>(K)</sub></span>
                                        </div>
                                        <div className={`p-4 rounded-xl border text-center ${regime.color.replace('bg-', 'bg-').replace('500', '950/40')} border-white/10`}>
                                            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Mach Number (M = TAS / a)</span>
                                            <span className="text-3xl font-black text-white font-mono">M {machNumber.toFixed(3)}</span>
                                            <span className={`text-[10px] font-bold mt-1 block uppercase ${regime.color.replace('bg-', 'text-')}`}>
                                                {regime.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Operational Worked Example Card */}
                                <div className="bg-slate-800 p-6 rounded-2xl border border-indigo-500/30 space-y-3">
                                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                                        <BookOpen size={18} />
                                        <span>Standard Worked Example: FL350 Cruise Speed of Sound</span>
                                    </div>
                                    <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-mono bg-slate-950 p-4 rounded-xl border border-white/5">
                                        <div>Standard ISA Temp at FL350 = -56.5°C = 216.65 Kelvin</div>
                                        <div>a = 38.94 × √216.65 = 38.94 × 14.719 = <span className="text-emerald-400 font-bold">573.1 knots</span></div>
                                        <div>Aircraft TAS = 450 knots:</div>
                                        <div>M = 450 / 573.1 = <span className="text-yellow-400 font-bold">0.785 Mach</span></div>
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        Notice that because temperature stops falling above the tropopause (~36,089 ft), the local speed of sound remains constant at 573 kt throughout the isothermal layer!
                                    </p>
                                </div>
                            </div>

                            {/* Compressibility Flow Regime Diagram */}
                            <div className="bg-[#0b1324] rounded-2xl border border-slate-700 p-6 flex flex-col justify-between relative overflow-hidden">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Compressibility Flow Regimes</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        As air velocity approaches Mach 1.0, pressure disturbances can no longer propagate upstream ahead of the aircraft. Density changes become significant (&gt;5% change above M 0.4), requiring compressible fluid dynamic equations.
                                    </p>
                                </div>

                                <div className="h-64 relative flex items-center justify-center my-6">
                                    <svg viewBox="0 0 320 160" className="w-full h-full">
                                        {/* Airfoil */}
                                        <path d="M 20 80 Q 110 10 290 80 Q 110 110 20 80 Z" fill="#334155" stroke="#64748b" strokeWidth="2" />
                                        
                                        {/* Dynamic Mach 1.0 bubble over upper surface */}
                                        {machNumber >= 0.75 && (
                                            <g>
                                                <path 
                                                    d={`M 80 40 Q 140 ${Math.max(-10, 30 - (machNumber - 0.75) * 80)} 200 50 Q 140 55 80 40 Z`} 
                                                    fill="#ef4444" 
                                                    fillOpacity="0.4"
                                                    stroke="#f87171"
                                                    strokeWidth="1.5"
                                                />
                                                <text x="140" y="25" fill="#fca5a5" fontSize="10" textAnchor="middle" fontWeight="bold">
                                                    Local Supersonic Pocket (M &gt; 1.0)
                                                </text>

                                                {/* Normal Shock Line */}
                                                <line 
                                                    x1={Math.min(240, 160 + (machNumber - 0.75) * 120)} 
                                                    y1="25" 
                                                    x2={Math.min(240, 160 + (machNumber - 0.75) * 120)} 
                                                    y2="70" 
                                                    stroke="#facc15" 
                                                    strokeWidth="3.5" 
                                                />
                                                <text 
                                                    x={Math.min(240, 160 + (machNumber - 0.75) * 120) + 5} 
                                                    y="35" 
                                                    fill="#facc15" 
                                                    fontSize="9" 
                                                    fontWeight="bold"
                                                >
                                                    Normal Shock
                                                </text>
                                            </g>
                                        )}

                                        <text x="30" y="30" fill="#94a3b8" fontSize="10">Freestream M = {machNumber.toFixed(2)}</text>
                                    </svg>
                                </div>

                                <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 text-xs text-slate-400">
                                    <strong className="text-white">Critical Mach Number (M<sub>crit</sub>):</strong> The lowest freestream Mach number where airflow velocity at any local point on the aircraft structure first reaches Mach 1.0 (typically upper camber crest).
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== TAB 2: TRANSONIC EFFECTS & MACH TUCK ===== */}
                    {activeTab === 'TRANSONIC' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Mach Tuck Visual Lab */}
                            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Activity size={20} className="text-amber-400" />
                                        Transonic Shock Stall & Mach Tuck Lab
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Adjust Mach Number to observe normal shock formation, shock stall separation, Center of Pressure (CP) aft migration, and uncommanded nose-down pitch.
                                    </p>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                                        <span>Freestream Mach Number</span>
                                        <span className={`font-mono font-bold ${transonicMach > 0.85 ? 'text-red-400' : 'text-amber-400'}`}>
                                            M {transonicMach.toFixed(2)}
                                        </span>
                                    </div>
                                    <input 
                                        type="range" min="0.70" max="0.95" step="0.01" 
                                        value={transonicMach} 
                                        onChange={e => setTransonicMach(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                        <span>M 0.70 (Subcritical)</span>
                                        <span>M 0.78 (M<sub>crit</sub>)</span>
                                        <span>M 0.95 (Deep Transonic)</span>
                                    </div>
                                </div>

                                {/* Airfoil with Shock & CP migration */}
                                <div className="bg-[#0b1324] h-60 rounded-xl border border-slate-700 p-4 relative flex flex-col justify-center items-center overflow-hidden">
                                    <svg viewBox="0 0 340 140" className="w-full h-full">
                                        {/* Airfoil Profile */}
                                        <path d="M 30 70 C 80 20, 180 20, 310 70 C 220 90, 90 90, 30 70 Z" fill="#334155" stroke="#64748b" strokeWidth="2" />
                                        
                                        {/* Chord Line */}
                                        <line x1="30" y1="70" x2="310" y2="70" stroke="#475569" strokeDasharray="3 3" />

                                        {/* Center of Gravity (Fixed at ~28% chord) */}
                                        <circle cx="108" cy="70" r="5" fill="#38bdf8" />
                                        <text x="108" y="90" fill="#38bdf8" fontSize="9" textAnchor="middle" fontWeight="bold">CG (28%)</text>

                                        {/* Center of Pressure (Migrating aft from 25% to 50%) */}
                                        {(() => {
                                            const cpX = 30 + (cpPercent / 100) * 280;
                                            return (
                                                <g>
                                                    <circle cx={cpX} cy="70" r="6" fill="#f59e0b" />
                                                    {/* Lift force vector pointing up */}
                                                    <line x1={cpX} y1="70" x2={cpX} y2="15" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#arrow)" />
                                                    <text x={cpX} y="10" fill="#f59e0b" fontSize="9" textAnchor="middle" fontWeight="bold">
                                                        CP ({cpPercent.toFixed(0)}%)
                                                    </text>
                                                </g>
                                            );
                                        })()}

                                        {/* Normal Shock Wave & Separated Boundary Layer */}
                                        {shockX && (
                                            <g>
                                                <line x1={shockX} y1="15" x2={shockX} y2="55" stroke="#ef4444" strokeWidth="3.5" />
                                                <text x={shockX} y="10" fill="#ef4444" fontSize="9" textAnchor="middle" fontWeight="bold">Normal Shock</text>
                                                {/* Separation turbulent bubble */}
                                                <path 
                                                    d={`M ${shockX} 55 Q ${(shockX + 310) / 2} 40 310 70 L 310 80 Q ${(shockX + 310) / 2} 65 ${shockX} 55 Z`} 
                                                    fill="#dc2626" 
                                                    fillOpacity="0.35" 
                                                />
                                                <text x={(shockX + 310) / 2} y="85" fill="#f87171" fontSize="8" textAnchor="middle">Shock Stall Separation</text>
                                            </g>
                                        )}
                                    </svg>
                                </div>

                                {/* Mach Tuck Pitching Alert */}
                                <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                                    transonicMach >= 0.83 
                                        ? 'bg-red-950/30 border-red-500/40 text-red-200' 
                                        : 'bg-slate-900 border-white/5 text-slate-300'
                                }`}>
                                    <ShieldAlert size={20} className={transonicMach >= 0.83 ? 'text-red-400 shrink-0' : 'text-slate-500 shrink-0'} />
                                    <div className="text-xs leading-relaxed space-y-1">
                                        <div className="font-bold flex items-center justify-between">
                                            <span>Mach Tuck Status: {transonicMach >= 0.83 ? 'SEVERE NOSE-DOWN MOMENT' : 'Controlled'}</span>
                                            <span className="font-mono">CP Arm: +{(cpPercent - 25).toFixed(0)}% aft</span>
                                        </div>
                                        <p>
                                            As CP shifts aft behind the CG, the nose-down pitching moment arm expands. Concurrently, root flow separation collapses downwash over the tailplane, removing horizontal stabilizer negative lift and diving the nose.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Wave Drag Divergence & Transonic Rules */}
                            <div className="space-y-6">
                                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex flex-col h-full">
                                    <h3 className="text-lg font-bold text-white mb-2">Wave Drag Divergence (M<sub>DD</sub>)</h3>
                                    <p className="text-xs text-slate-400 mb-4">
                                        Beyond M<sub>crit</sub>, the drag-divergence Mach number (M<sub>DD</sub>) marks an exponential rise in wave drag (typically where C<sub>D</sub> increases by 0.0020).
                                    </p>

                                    <div className="h-[220px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={dragData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorWaveCd" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                                <XAxis dataKey="mach" stroke="#94a3b8" fontSize={10} minTickGap={20} />
                                                <YAxis stroke="#94a3b8" fontSize={10} />
                                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} itemStyle={{ color: '#ef4444' }} />
                                                <Area type="monotone" dataKey="cd" stroke="#ef4444" fillOpacity={1} fill="url(#colorWaveCd)" />
                                                <ReferenceLine x="0.80" stroke="#facc15" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Mcrit (0.80)', fill: '#facc15', fontSize: 10 }} />
                                                <ReferenceLine x="0.85" stroke="#f97316" strokeDasharray="3 3" label={{ position: 'insideTopRight', value: 'Mdd (0.85)', fill: '#f97316', fontSize: 10 }} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* EASA Aerodynamics Framework Box */}
                                    <div className="mt-4 p-4 bg-indigo-950/30 border border-indigo-500/20 rounded-xl space-y-2 text-xs">
                                        <span className="font-bold text-indigo-300 block">The Three Pillars of Mach Tuck Recovery:</span>
                                        <ul className="list-disc pl-4 space-y-1 text-slate-300">
                                            <li><strong className="text-white">Mach Trim System:</strong> Automatically repositions the variable-incidence trimmable horizontal stabilizer (THS) nose-up as Mach increases.</li>
                                            <li><strong className="text-white">Supercritical Airfoils:</strong> Flattened upper contour with rear camber delays shock onset and softens CP migration.</li>
                                            <li><strong className="text-white">Speed Brakes / Thrust Reduction:</strong> Immediately decelerate the aircraft back below M<sub>crit</sub> to restore control effectiveness.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== TAB 3: SWEPT WINGS & TRADE-OFFS ===== */}
                    {activeTab === 'SWEPT_WINGS' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-6">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Navigation size={20} className="text-emerald-400" />
                                        Wing Sweepback Aerodynamic Trade-offs
                                    </h3>

                                    <div>
                                        <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                                            <span>Leading Edge Sweep Angle (Λ)</span>
                                            <span className="text-emerald-400 font-mono font-bold">{sweepAngle}°</span>
                                        </div>
                                        <input 
                                            type="range" min="0" max="50" step="5" 
                                            value={sweepAngle} 
                                            onChange={e => setSweepAngle(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                            <span>0° (Straight Wing)</span>
                                            <span>30° (Commercial Jet)</span>
                                            <span>50° (High Speed Fighter)</span>
                                        </div>
                                    </div>

                                    {/* Vector Decomposition Graphic */}
                                    <div className="bg-[#0b1324] h-60 rounded-xl border border-slate-700 relative overflow-hidden flex items-center justify-center p-4">
                                        <svg viewBox="0 0 240 180" className="w-full h-full">
                                            <g transform={`rotate(${sweepAngle}, 70, 90)`}>
                                                {/* Swept Wing panel */}
                                                <rect x="70" y="30" width="45" height="120" fill="#334155" stroke="#64748b" rx="4" />
                                                
                                                {/* Freestream Airflow Vector */}
                                                <g transform={`rotate(${-sweepAngle}, 90, 90)`}>
                                                    <line x1="20" y1="90" x2="80" y2="90" stroke="#facc15" strokeWidth="2.5" markerEnd="url(#arrow)" />
                                                    <text x="10" y="94" fill="#facc15" fontSize="11" fontWeight="bold">V</text>
                                                </g>

                                                {/* Chordwise Component V cos(Λ) */}
                                                <line x1="30" y1="90" x2="80" y2="90" stroke="#10b981" strokeWidth="2.5" />
                                                <text x="35" y="80" fill="#10b981" fontSize="10" fontWeight="bold">V · cos(Λ)</text>

                                                {/* Spanwise Component V sin(Λ) */}
                                                <line x1="92" y1="90" x2="92" y2="140" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
                                                <text x="96" y="125" fill="#ef4444" fontSize="9">Spanwise Flow</text>

                                                {/* Wing Fences Visual */}
                                                {hasFences && (
                                                    <rect x="68" y="75" width="49" height="4" fill="#38bdf8" />
                                                )}
                                            </g>
                                        </svg>
                                    </div>

                                    <div className="p-4 bg-emerald-950/30 rounded-xl border border-emerald-500/20 text-xs flex justify-between items-center font-mono">
                                        <span>At Freestream M = 0.85:</span>
                                        <span className="text-emerald-300 font-bold">
                                            Effective M<sub>chord</sub> = {(0.85 * Math.cos(sweepAngle * Math.PI / 180)).toFixed(3)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Swept Wing Penalties & Remedies */}
                            <div className="space-y-6">
                                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <AlertTriangle size={18} className="text-yellow-400" />
                                        Swept Wing Penalties (The Cost of Speed)
                                    </h3>

                                    <div className="space-y-3 text-xs text-slate-300">
                                        <div className="p-3 bg-slate-900 rounded-xl border border-white/5 space-y-1">
                                            <span className="text-red-400 font-bold block">1. Severe Tip Stall & Dangerous Pitch-Up:</span>
                                            <p className="leading-relaxed">
                                                Spanwise boundary layer outflow sweeps toward the wingtips, thickening the tip boundary layer. When approaching the stall, <strong className="text-white">wingtips stall first</strong>. Because swept wingtips are positioned <strong className="text-white">aft of the aircraft CG</strong>, the sudden loss of aft lift causes a violent, uncontrollable <strong className="text-red-400">PITCH-UP</strong> into a deep stall!
                                            </p>
                                        </div>

                                        <div className="p-3 bg-slate-900 rounded-xl border border-white/5 space-y-1">
                                            <span className="text-yellow-400 font-bold block">2. Dutch Roll Instability:</span>
                                            <p className="leading-relaxed">
                                                Sweep increases the dihedral effect (advancing wing experiences less sweep and surges in lift). Static lateral stability overpowers directional stability, causing a coupled out-of-phase yaw-roll oscillation.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Fixes Controls */}
                                    <div className="pt-2 border-t border-slate-700 space-y-2">
                                        <span className="text-xs font-bold text-slate-300 block">Aerodynamic Anti-Tip Stall Fixes:</span>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => setHasFences(!hasFences)}
                                                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                                    hasFences ? 'bg-sky-600 text-white' : 'bg-slate-900 text-slate-400'
                                                }`}
                                            >
                                                Wing Fences: {hasFences ? 'ACTIVE' : 'OFF'}
                                            </button>
                                            <button
                                                onClick={() => setHasWashout(!hasWashout)}
                                                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                                    hasWashout ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
                                                }`}
                                            >
                                                Washout Twist: {hasWashout ? 'ACTIVE' : 'OFF'}
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-1">
                                            Wing fences block spanwise boundary layer drift; geometric washout reduces tip AoA relative to the root, guaranteeing the root stalls first!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== TAB 4: COFFIN CORNER LIMITATIONS ===== */}
                    {activeTab === 'LIMITS' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <AlertTriangle size={20} className="text-red-400" />
                                        The Coffin Corner (Q-Corner)
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1">
                                        As altitude increases, lower air density increases low-speed stall speed (TAS), while dropping temperature lowers the speed of sound, compressing maximum Mach limit (M<sub>MO</sub>) into a razor-thin operational envelope.
                                    </p>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                                        <span>Cruising Flight Level: FL {Math.round(coffinAltitude / 100)}</span>
                                        <span className="text-red-400 font-mono font-bold">{coffinAltitude.toLocaleString()} ft</span>
                                    </div>
                                    <input 
                                        type="range" min="15000" max="45000" step="1000" 
                                        value={coffinAltitude} 
                                        onChange={e => setCoffinAltitude(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                        <span>FL150 (Wide Margin)</span>
                                        <span>FL350 (Standard Cruise)</span>
                                        <span>FL450 (Coffin Corner)</span>
                                    </div>
                                </div>

                                {coffinAltitude >= 41000 ? (
                                    <div className="p-4 bg-red-950/40 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-start gap-3 animate-pulse">
                                        <AlertTriangle size={20} className="text-red-400 shrink-0" />
                                        <div>
                                            <strong>CRITICAL MARGIN: Under 5 knots between Low Speed Buffet & High Speed Mach Buffet!</strong> Any turbulence, turn bank, or slight speed variance triggers immediate stall or catastrophic shock upset.
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-200 flex items-start gap-3">
                                        <CheckCircle size={20} className="text-emerald-400 shrink-0" />
                                        <div>
                                            Safe operational buffet margin: ~{Math.round((45000 - coffinAltitude) / 300)} knots between low-speed buffet onset and M<sub>MO</sub> buffet boundary.
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Coffin Corner Diagram */}
                            <div className="bg-[#0b1324] rounded-2xl border border-slate-700 p-6 flex flex-col justify-between">
                                <h3 className="text-white font-bold mb-2">Altitude vs Airspeed Flight Envelope</h3>
                                
                                <div className="h-64 relative flex items-center justify-center">
                                    <svg viewBox="0 0 320 220" className="w-full h-full">
                                        {/* Axes */}
                                        <line x1="45" y1="180" x2="295" y2="180" stroke="#475569" strokeWidth="1.5" />
                                        <line x1="45" y1="20" x2="45" y2="180" stroke="#475569" strokeWidth="1.5" />
                                        <text x="170" y="200" fill="#94a3b8" fontSize="10" textAnchor="middle">Airspeed (IAS)</text>
                                        <text x="15" y="100" fill="#94a3b8" fontSize="10" transform="rotate(-90 15 100)" textAnchor="middle">Altitude</text>

                                        {/* Low speed stall boundary */}
                                        <path d="M 85 180 Q 95 90 170 30" fill="none" stroke="#facc15" strokeWidth="3" />
                                        <text x="90" y="100" fill="#facc15" fontSize="9" fontWeight="bold">Low-Speed Buffet</text>

                                        {/* High speed Mach boundary */}
                                        <path d="M 270 180 L 270 110 Q 260 70 175 30" fill="none" stroke="#ef4444" strokeWidth="3" />
                                        <text x="260" y="100" fill="#ef4444" fontSize="9" textAnchor="end" fontWeight="bold">High-Speed Buffet (MMO)</text>

                                        {/* Current Altitude Line */}
                                        {(() => {
                                            const normAlt = (coffinAltitude - 15000) / 30000;
                                            const y = 180 - normAlt * 145;
                                            const stallX = 85 + normAlt * 80;
                                            const machX = 270 - normAlt * 90;
                                            return (
                                                <g>
                                                    <line x1="45" y1={y} x2="295" y2={y} stroke="#64748b" strokeDasharray="3 3" />
                                                    <line x1={stallX} y1={y} x2={machX} y2={y} stroke="#10b981" strokeWidth="4" />
                                                    <text x="290" y={y - 5} fill="#10b981" fontSize="9" textAnchor="end" fontWeight="bold">FL{Math.round(coffinAltitude / 100)}</text>
                                                </g>
                                            );
                                        })()}
                                    </svg>
                                </div>

                                <div className="text-[11px] text-slate-400 bg-slate-900/80 p-3 rounded-xl border border-white/5">
                                    <strong className="text-white">Coffin Corner Intersection:</strong> At the aerodynamic ceiling, low-speed stall speed and high-speed shock stall speed converge at a single airspeed.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== TAB 5: KNOWLEDGE CHECK ===== */}
                    {activeTab === 'QUIZ' && (
                        <div className="space-y-6">
                            {!showQuizResults ? (
                                <div className="space-y-6">
                                    {QUIZ_QUESTIONS.map((q, qIdx) => (
                                        <div key={qIdx} className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700">
                                            <h3 className="text-base font-bold text-white mb-4">{qIdx + 1}. {q.q}</h3>
                                            <div className="space-y-2">
                                                {q.options.map((opt, oIdx) => (
                                                    <button
                                                        key={oIdx}
                                                        onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                                                        className={`w-full text-left p-3.5 rounded-xl text-xs font-semibold border transition-all ${
                                                            quizAnswers[qIdx] === oIdx
                                                                ? 'bg-emerald-600/30 border-emerald-500 text-white shadow-lg'
                                                                : 'bg-slate-900/70 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800'
                                                        }`}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setShowQuizResults(true)}
                                        disabled={Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length}
                                        className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg transition-all"
                                    >
                                        Submit ATPL Answers
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="bg-slate-800 p-8 rounded-2xl text-center border border-slate-700 space-y-4">
                                        <h3 className="text-3xl font-black text-white">Score: {calculateScore()} / {QUIZ_QUESTIONS.length}</h3>
                                        <p className="text-slate-400 text-sm">
                                            {calculateScore() === QUIZ_QUESTIONS.length
                                                ? 'First-Time Pass! Ready for EASA ATPL 081 High-Speed Aerodynamics.'
                                                : 'Review the technical rationales below to solidify your understanding.'}
                                        </p>
                                        <button
                                            onClick={() => { setQuizAnswers({}); setShowQuizResults(false); }}
                                            className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-xl transition-colors"
                                        >
                                            Retake Quiz
                                        </button>
                                    </div>

                                    {QUIZ_QUESTIONS.map((q, qIdx) => {
                                        const isCorrect = quizAnswers[qIdx] === q.answer;
                                        return (
                                            <div key={qIdx} className={`p-6 rounded-2xl border ${isCorrect ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-red-950/20 border-red-500/30'} space-y-3`}>
                                                <div className="flex items-start gap-3">
                                                    {isCorrect ? <CheckCircle className="text-emerald-400 shrink-0 mt-0.5" /> : <XCircle className="text-red-400 shrink-0 mt-0.5" />}
                                                    <div className="space-y-2 w-full">
                                                        <h3 className="text-white font-bold text-sm">{q.q}</h3>
                                                        <div className="text-xs p-3 rounded-lg bg-slate-900 text-slate-300">
                                                            <span className="text-slate-500 mr-2">Your Answer:</span>
                                                            {q.options[quizAnswers[qIdx]]}
                                                        </div>
                                                        {!isCorrect && (
                                                            <div className="text-xs p-3 rounded-lg bg-emerald-900/30 border border-emerald-500/30 text-emerald-200">
                                                                <span className="font-bold mr-2">Correct Answer:</span>
                                                                {q.options[q.answer]}
                                                            </div>
                                                        )}
                                                        <div className="text-xs text-slate-400 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                                                            <strong className="text-white">ATPL Rationale:</strong> {q.rationale}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default PoFHighSpeed;
