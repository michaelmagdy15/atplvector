import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Activity, Crosshair, AlertTriangle, Zap, CheckCircle, XCircle, Calculator } from 'lucide-react';

type Tab = 'STATIC' | 'DYNAMIC' | 'MANOEUVRE' | 'TURNING' | 'QUIZ';
type DynamicMode = 'PHUGOID' | 'SHORT_PERIOD' | 'DUTCH_ROLL' | 'SPIRAL';

const PoFFlightMechanics: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('STATIC');
    
    // Tab 1 state
    const [cgPosition, setCgPosition] = useState(25); // % MAC
    const npPosition = 35; // % MAC

    // Tab 2 state
    const [dynamicMode, setDynamicMode] = useState<DynamicMode>('PHUGOID');

    // Tab 3 state
    const [bankAngleMan, setBankAngleMan] = useState(45);
    const [weight, setWeight] = useState(3000);

    // Tab 4 state
    const [tas, setTas] = useState(120);
    const [bankAngleTurn, setBankAngleTurn] = useState(30);

    // Tab 5 state
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
    const [showQuizResults, setShowQuizResults] = useState(false);

    const QUIZ_QUESTIONS = [
        { q: "What does longitudinal static stability primarily depend on?", options: ["The size of the ailerons", "The position of the Center of Gravity relative to the Neutral Point", "The type of dynamic stability mode", "The weight of the aircraft"], answer: 1, rationale: "Longitudinal static stability requires the CG to be ahead of the Neutral Point (NP)." },
        { q: "Which dynamic stability mode is characterized by long-period, slow oscillations in pitch and airspeed?", options: ["Spiral divergence", "Short period oscillation", "Phugoid", "Dutch roll"], answer: 2, rationale: "The phugoid is a long-period oscillation where kinetic and potential energy are exchanged (speed and altitude fluctuate)." },
        { q: "In a stable level turn at 60° bank, what is the approximate load factor (n)?", options: ["1.0 G", "1.41 G", "2.0 G", "2.5 G"], answer: 2, rationale: "Load factor n = 1 / cos(bank angle). cos(60°) = 0.5, so 1 / 0.5 = 2.0." },
        { q: "How does an increase in aircraft weight affect the corner velocity (Va) on a V-n diagram?", options: ["Va decreases", "Va increases", "Va remains constant", "Va is unrelated to weight"], answer: 1, rationale: "A heavier aircraft stalls at a higher speed. Therefore, the intersection of the maximum lift line and the limit load factor line (which defines Va) shifts to a higher speed." },
        { q: "What is the formula for the radius of a turn?", options: ["r = V² / (g × tan θ)", "r = (g × tan θ) / V", "r = V / (g × sin θ)", "r = V² × g × tan θ"], answer: 0, rationale: "Turn radius is V² / (g × tan θ), meaning a faster speed increases radius quadratically, while steeper bank decreases it." }
    ];

    const calculateScore = () => Object.keys(quizAnswers).reduce((acc, key) => acc + (quizAnswers[Number(key)] === QUIZ_QUESTIONS[Number(key)].answer ? 1 : 0), 0);

    const loadFactor = useMemo(() => {
        if (bankAngleMan >= 90) return Infinity;
        return 1 / Math.cos(bankAngleMan * Math.PI / 180);
    }, [bankAngleMan]);

    const vsRatio = useMemo(() => Math.sqrt(Math.abs(loadFactor)), [loadFactor]);

    // Turn calculations
    const turnCalcs = useMemo(() => {
        const vMetersPerSec = tas * 0.514444; // knots to m/s
        const g = 9.81;
        const bankRad = bankAngleTurn * Math.PI / 180;
        
        let rateDegSec = 0;
        let radiusMeters = 0;
        
        if (bankAngleTurn > 0 && vMetersPerSec > 0) {
            const rateRadSec = (g * Math.tan(bankRad)) / vMetersPerSec;
            rateDegSec = rateRadSec * (180 / Math.PI);
            radiusMeters = (vMetersPerSec * vMetersPerSec) / (g * Math.tan(bankRad));
        }

        // Std rate (3 deg/s) required bank angle
        const targetRateRad = 3 * (Math.PI / 180);
        const reqTan = (targetRateRad * vMetersPerSec) / g;
        const stdBank = Math.atan(reqTan) * (180 / Math.PI);

        return { rateDegSec, radiusMeters, stdBank };
    }, [tas, bankAngleTurn]);

    return (
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm text-slate-300 w-full max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Compass className="text-emerald-400" /> Principles of Flight: Flight Mechanics
            </h2>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-700 pb-4">
                {[
                    { id: 'STATIC', label: 'Static Stability', icon: Crosshair },
                    { id: 'DYNAMIC', label: 'Dynamic Stability', icon: Activity },
                    { id: 'MANOEUVRE', label: 'Manoeuvring Flight', icon: AlertTriangle },
                    { id: 'TURNING', label: 'Turning Flight', icon: Calculator },
                    { id: 'QUIZ', label: 'Knowledge Check', icon: Zap }
                ].map(t => {
                    const Icon = t.icon;
                    return (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id as Tab)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${activeTab === t.id ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                                }`}
                        >
                            <Icon size={16} /> {t.label}
                        </button>
                    )
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
                    {/* ===== TAB 1: STATIC STABILITY ===== */}
                    {activeTab === 'STATIC' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                    <h3 className="text-xl font-bold text-white mb-2">Longitudinal Static Stability</h3>
                                    <p className="text-sm text-slate-300 mb-6">
                                        For an aircraft to be statically stable in pitch, its Center of Gravity (CG) MUST be forward of the Neutral Point (NP). The distance between CG and NP is the <strong>Static Margin</strong>.
                                    </p>

                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                        Center of Gravity (% MAC): <span className="text-emerald-400">{cgPosition}%</span>
                                    </label>
                                    <input 
                                        type="range" min="10" max="50" step="1" 
                                        value={cgPosition} 
                                        onChange={e => setCgPosition(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 mb-2"
                                    />
                                    <div className="flex justify-between text-xs text-slate-500 mb-4"><span>10% (Fwd)</span><span>50% (Aft)</span></div>

                                    <div className={`p-4 rounded-lg flex items-center justify-between border ${
                                        cgPosition < npPosition ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-400' :
                                        cgPosition === npPosition ? 'bg-yellow-900/20 border-yellow-500/50 text-yellow-400' :
                                        'bg-red-900/20 border-red-500/50 text-red-400'
                                    }`}>
                                        <span className="font-bold">
                                            {cgPosition < npPosition ? 'STABLE' : cgPosition === npPosition ? 'NEUTRAL' : 'UNSTABLE'}
                                        </span>
                                        <span>Static Margin: {(npPosition - cgPosition).toFixed(1)}%</span>
                                    </div>
                                </div>

                                <div className="bg-[#0f172a] h-48 rounded-xl border border-slate-600 relative flex items-center justify-center p-4">
                                    <svg viewBox="0 0 400 100" className="w-full max-w-sm">
                                        {/* Simple side profile */}
                                        <path d="M 50 50 L 350 50" stroke="#475569" strokeWidth="15" strokeLinecap="round" />
                                        <path d="M 150 50 L 220 50 L 200 65 L 170 65 Z" fill="#94a3b8" /> {/* Wing */}
                                        <path d="M 330 50 L 350 50 L 350 30 Z" fill="#94a3b8" /> {/* Emmpenage */}
                                        
                                        {/* NP Mark */}
                                        <circle cx={150 + (npPosition * 1.5)} cy="50" r="5" fill="#facc15" />
                                        <text x={150 + (npPosition * 1.5)} y="35" fill="#facc15" fontSize="12" textAnchor="middle">NP</text>

                                        {/* CG Mark */}
                                        <motion.circle 
                                            cx={150 + (cgPosition * 1.5)} 
                                            cy="50" 
                                            r="7" 
                                            fill="#10b981" 
                                            animate={{ cx: 150 + (cgPosition * 1.5) }} 
                                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        />
                                        <g transform={`translate(${150 + (cgPosition * 1.5)}, 50)`}>
                                            <circle cx="0" cy="0" r="7" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3"/>
                                            <text x="0" y="70" fill="#10b981" fontSize="12" textAnchor="middle">CG</text>
                                        </g>
                                    </svg>
                                </div>
                            </div>

                            <div className="bg-[#0f172a] rounded-xl border border-slate-600 p-6 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-white font-bold mb-4">Coefficient of Moment (Cm) vs Angle of Attack (α)</h3>
                                    <p className="text-xs text-slate-400 mb-6">The slope of the Cm vs α curve determines stability. A negative slope means the aircraft naturally pitches down when perturbed nose-up, restoring equilibrium.</p>
                                </div>

                                <div className="flex-1 relative flex items-center justify-center">
                                    <svg viewBox="0 0 200 200" className="w-full max-w-[250px] overflow-visible">
                                        {/* Axes */}
                                        <line x1="0" y1="100" x2="200" y2="100" stroke="#475569" strokeWidth="2" />
                                        <line x1="100" y1="0" x2="100" y2="200" stroke="#475569" strokeWidth="2" />
                                        <text x="195" y="115" fill="#94a3b8" fontSize="10" textAnchor="end">Alpha (α) +</text>
                                        <text x="105" y="10" fill="#94a3b8" fontSize="10">Cm +</text>

                                        {/* Slope line calculation:
                                            Stable (cg < np) => negative slope (starts top left, goes bottom right)
                                            Neutral (cg == np) => flat slope
                                            Unstable (cg > np) => positive slope
                                        */}
                                        <motion.line 
                                            x1="20" 
                                            x2="180" 
                                            y1={100 + (cgPosition - npPosition) * 4} 
                                            y2={100 - (cgPosition - npPosition) * 4} 
                                            stroke={cgPosition < npPosition ? "#10b981" : cgPosition === npPosition ? "#facc15" : "#ef4444"}
                                            strokeWidth="3"
                                            animate={{
                                                y1: 100 + (cgPosition - npPosition) * 4,
                                                y2: 100 - (cgPosition - npPosition) * 4
                                            }}
                                            transition={{ type: 'spring', stiffness: 200 }}
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== TAB 2: DYNAMIC STABILITY ===== */}
                    {activeTab === 'DYNAMIC' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { id: 'PHUGOID', name: 'Phugoid' },
                                    { id: 'SHORT_PERIOD', name: 'Short Period' },
                                    { id: 'DUTCH_ROLL', name: 'Dutch Roll' },
                                    { id: 'SPIRAL', name: 'Spiral Divergence' }
                                ].map(m => (
                                    <button 
                                        key={m.id}
                                        onClick={() => setDynamicMode(m.id as DynamicMode)}
                                        className={`py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                                            dynamicMode === m.id ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        }`}
                                    >
                                        {m.name}
                                    </button>
                                ))}
                            </div>

                            <div className="bg-[#0f172a] rounded-xl border border-slate-600 p-8 h-[400px] flex flex-col justify-center relative overflow-hidden">
                                {dynamicMode === 'PHUGOID' && (
                                    <>
                                        <div className="absolute top-8 left-8 right-8">
                                            <h3 className="text-xl font-bold text-white mb-2">Phugoid Oscillation</h3>
                                            <p className="text-sm text-slate-400 max-w-lg">A long-period (slow) oscillation involving a constant exchange of kinetic energy (airspeed) and potential energy (altitude). Angle of attack remains nearly constant. Easily controlled by the pilot.</p>
                                        </div>
                                        <svg viewBox="0 0 500 200" className="w-full mt-20 stroke-emerald-400 fill-none" strokeWidth="2">
                                            {/* Sine wave with slight damping */}
                                            <motion.path 
                                                d="M 0 100 Q 60 20, 120 100 T 240 100 T 360 100 T 480 100" 
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                                            />
                                        </svg>
                                    </>
                                )}

                                {dynamicMode === 'SHORT_PERIOD' && (
                                    <>
                                        <div className="absolute top-8 left-8 right-8">
                                            <h3 className="text-xl font-bold text-white mb-2">Short Period Pitch Oscillation</h3>
                                            <p className="text-sm text-slate-400 max-w-lg">A rapid variation in pitch following a disturbance. Airspeed remains nearly constant. Typically heavily damped naturally. If undamped or pilot induces it (PIO), it can cause severe structural stress.</p>
                                        </div>
                                        <svg viewBox="0 0 500 200" className="w-full mt-20 stroke-red-400 fill-none" strokeWidth="2">
                                            {/* Heavily damped fast sine wave */}
                                            <motion.path 
                                                d="M 0 100 Q 15 20, 30 100 T 60 100 T 90 100 T 120 100 T 150 100 T 180 100" 
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                            />
                                            {/* Flat line after damping */}
                                            <path d="M 180 100 L 500 100" stroke="#94a3b8" strokeDasharray="4" />
                                        </svg>
                                    </>
                                )}

                                {dynamicMode === 'DUTCH_ROLL' && (
                                    <>
                                        <div className="absolute top-8 left-8 right-8">
                                            <h3 className="text-xl font-bold text-white mb-2">Dutch Roll</h3>
                                            <p className="text-sm text-slate-400 max-w-lg">Coupled lateral-directional oscillation. Triggered when lateral stability (dihedral effect) is stronger than directional stability. Causes an out-of-phase "wallowing" combination of roll and yaw. Corrected by Yaw Damper.</p>
                                        </div>
                                        <div className="flex w-full mt-20 justify-center h-24 relative">
                                            <motion.div
                                                animate={{ 
                                                    rotate: [0, 15, 0, -15, 0], // Roll
                                                    x: [0, 20, 0, -20, 0], // Yawish translation effect
                                                    scale: [1, 1.1, 1, 0.9, 1] // Nose wobble effect
                                                }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                                className="w-32 h-32 relative"
                                            >
                                                {/* Isometric/Frontal plane SVG */}
                                                <svg viewBox="0 0 100 100" className="w-full h-full fill-emerald-500">
                                                    <circle cx="50" cy="50" r="10" />
                                                    <path d="M 50 40 L 90 55 L 90 60 L 50 55" />
                                                    <path d="M 50 40 L 10 55 L 10 60 L 50 55" />
                                                    <path d="M 48 30 L 52 30 L 52 50 L 48 50 Z" />
                                                </svg>
                                            </motion.div>
                                        </div>
                                    </>
                                )}

                                {dynamicMode === 'SPIRAL' && (
                                    <>
                                        <div className="absolute top-8 left-8 right-8">
                                            <h3 className="text-xl font-bold text-white mb-2">Spiral Divergence</h3>
                                            <p className="text-sm text-slate-400 max-w-lg">Occurs when directional stability is very strong relative to lateral stability. A small wing drop causes slip, the high directional stability yaws the nose into the slip, speeding up the outer wing and steepening the bank. Results in a tightening diving spiral.</p>
                                        </div>
                                        <div className="flex w-full mt-20 justify-center h-24 relative">
                                            <motion.div
                                                animate={{ 
                                                    rotate: [0, 45, 90, 135],
                                                    y: [0, 10, 30, 60]
                                                }}
                                                transition={{ duration: 6, ease: "easeIn", repeat: Infinity }}
                                                className="w-24 h-24"
                                            >
                                                <svg viewBox="0 0 100 100" className="w-full h-full fill-purple-500">
                                                    <circle cx="50" cy="50" r="10" />
                                                    <path d="M 50 40 L 90 50 L 90 55 L 50 50 Z" />
                                                    <path d="M 50 40 L 10 50 L 10 55 L 50 50 Z" />
                                                    <path d="M 48 20 L 52 20 L 52 50 L 48 50 Z" />
                                                </svg>
                                            </motion.div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ===== TAB 3: MANOEUVRING ===== */}
                    {activeTab === 'MANOEUVRE' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                    <h3 className="text-lg font-bold text-white mb-4">G-Load & Bank Angle</h3>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                        Bank Angle (θ): <span className="text-emerald-400 font-bold">{bankAngleMan}°</span>
                                    </label>
                                    <input 
                                        type="range" min="0" max="80" step="1" 
                                        value={bankAngleMan} 
                                        onChange={e => setBankAngleMan(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 mb-4"
                                    />
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-[#0f172a] p-4 rounded-lg flex flex-col items-center">
                                            <span className="text-xs text-slate-400">Load Factor (n)</span>
                                            <span className="text-2xl font-bold text-white">{loadFactor.toFixed(2)} G</span>
                                            <span className="text-[10px] text-slate-500 mt-1">n = 1 / cos(θ)</span>
                                        </div>
                                        <div className="bg-[#0f172a] p-4 rounded-lg flex flex-col items-center">
                                            <span className="text-xs text-slate-400">Vs Increase</span>
                                            <span className="text-2xl font-bold text-amber-400">{(vsRatio * 100).toFixed(0)}%</span>
                                            <span className="text-[10px] text-slate-500 mt-1">Vs_turn = Vs_1g × √n</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                    <h3 className="text-lg font-bold text-white mb-4">Aircraft Weight</h3>
                                    <p className="text-xs text-slate-400 mb-4">Higher weight means stall occurs at a higher speed, shrinking the structural envelope.</p>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                        Weight: <span className="text-blue-400 font-bold">{weight} kg</span>
                                    </label>
                                    <input 
                                        type="range" min="1500" max="4500" step="100" 
                                        value={weight} 
                                        onChange={e => setWeight(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="bg-[#0f172a] rounded-xl border border-slate-600 p-6 flex flex-col justify-between">
                                <h3 className="text-white font-bold mb-2">V-n Diagram (Manoeuvre Envelope)</h3>
                                <div className="flex-1 w-full flex items-center justify-center relative mt-4">
                                    <svg viewBox="0 0 300 200" className="w-full h-full overflow-visible">
                                        {/* Axes */}
                                        <line x1="20" y1="150" x2="280" y2="150" stroke="#475569" strokeWidth="2" />
                                        <line x1="50" y1="20" x2="50" y2="180" stroke="#475569" strokeWidth="2" />
                                        <text x="270" y="165" fill="#94a3b8" fontSize="10">EAS</text>
                                        <text x="25" y="30" fill="#94a3b8" fontSize="10">Load (n)</text>
                                        <text x="35" y="150" fill="#94a3b8" fontSize="10">1</text>

                                        {/* Dynamic limits based on weight (shifting X offset) */}
                                        {(() => {
                                            const weightFactor = weight / 1500; // 1 to 3
                                            const vsX = 40 + (weightFactor * 10);
                                            const vaX = 80 + (weightFactor * 15);
                                            const vneX = 240;
                                            const nLimitY = 40; // Approx +3.8G or something visual
                                            const negNLimitY = 175;

                                            return (
                                                <g>
                                                    {/* Positive Lift Boundary */}
                                                    <motion.path 
                                                        d={`M 50 150 Q ${vsX} 100, ${vaX} ${nLimitY}`}
                                                        fill="none" stroke="#facc15" strokeWidth="2"
                                                        animate={{ d: `M 50 150 Q ${vsX} 100, ${vaX} ${nLimitY}` }}
                                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                                    />
                                                    {/* Limit Load horizontal line */}
                                                    <motion.line x1={vaX} y1={nLimitY} x2={vneX} y2={nLimitY} stroke="#10b981" strokeWidth="2" animate={{ x1: vaX }} />
                                                    
                                                    {/* Vne vertical line */}
                                                    <motion.line x1={vneX} y1={nLimitY} x2={vneX} y2={negNLimitY} stroke="#ef4444" strokeWidth="2" />

                                                    {/* Negative Lift Boundary */}
                                                    <motion.path 
                                                        d={`M 50 150 Q ${vsX+10} 165, ${vaX+20} ${negNLimitY}`}
                                                        fill="none" stroke="#facc15" strokeWidth="2"
                                                        animate={{ d: `M 50 150 Q ${vsX+10} 165, ${vaX+20} ${negNLimitY}` }}
                                                    />
                                                    {/* Negative Limit Load horizontal line */}
                                                    <motion.line x1={vaX+20} y1={negNLimitY} x2={vneX} y2={negNLimitY} stroke="#10b981" strokeWidth="2" animate={{ x1: vaX+20 }} />

                                                    {/* Envelope Fill */}
                                                    <motion.path 
                                                        d={`M 50 150 Q ${vsX} 100, ${vaX} ${nLimitY} L ${vneX} ${nLimitY} L ${vneX} ${negNLimitY} L ${vaX+20} ${negNLimitY} Q ${vsX+10} 165, 50 150 Z`}
                                                        fill="#3b82f6" fillOpacity="0.2"
                                                        animate={{ d: `M 50 150 Q ${vsX} 100, ${vaX} ${nLimitY} L ${vneX} ${nLimitY} L ${vneX} ${negNLimitY} L ${vaX+20} ${negNLimitY} Q ${vsX+10} 165, 50 150 Z` }}
                                                    />

                                                    {/* Marker Texts */}
                                                    <motion.text x={vaX} y={nLimitY - 5} fill="#facc15" fontSize="10" animate={{ x: vaX }}>Va</motion.text>
                                                    <text x={vneX - 10} y={nLimitY - 5} fill="#ef4444" fontSize="10">Vne</text>
                                                </g>
                                            )
                                        })()}
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== TAB 4: TURNING ===== */}
                    {activeTab === 'TURNING' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                    <h3 className="text-xl font-bold text-white mb-6">Turn Geometry Inputs</h3>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                                True Airspeed (TAS): <span className="text-emerald-400 font-bold">{tas} kt</span>
                                            </label>
                                            <input 
                                                type="range" min="60" max="300" step="5" 
                                                value={tas} 
                                                onChange={e => setTas(Number(e.target.value))}
                                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                                Bank Angle (θ): <span className="text-emerald-400 font-bold">{bankAngleTurn}°</span>
                                            </label>
                                            <input 
                                                type="range" min="5" max="60" step="1" 
                                                value={bankAngleTurn} 
                                                onChange={e => setBankAngleTurn(Number(e.target.value))}
                                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#0f172a] p-6 rounded-xl border border-slate-600">
                                    <h3 className="text-lg font-bold text-white mb-2">Standard Rate Turn</h3>
                                    <p className="text-sm text-slate-400 mb-4">A standard rate turn is defined as 3° per second (taking 2 minutes to complete a 360° heading change).</p>
                                    
                                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                                        <span className="text-slate-300">Required Bank Angle at {tas} kt:</span>
                                        <span className="text-2xl font-bold text-blue-400">{turnCalcs.stdBank.toFixed(1)}°</span>
                                    </div>
                                    <p className="mt-3 text-xs text-slate-500">Rule of thumb: TAS / 10 + 7 ≈ {(tas / 10 + 7).toFixed(1)}°</p>
                                </div>
                            </div>

                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-6">
                                <h3 className="text-xl font-bold text-white mb-2">Calculated Outputs</h3>
                                
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="bg-[#0f172a] p-6 rounded-xl border border-slate-600 relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                        <span className="text-sm text-slate-400 block mb-1">Rate of Turn</span>
                                        <span className="text-4xl font-black text-white">{turnCalcs.rateDegSec.toFixed(2)}<span className="text-lg text-slate-500 ml-1">°/sec</span></span>
                                        <div className="mt-4 pt-4 border-t border-slate-700/50">
                                            <span className="text-xs font-mono text-slate-500">Rate = (g × tan θ) / V</span>
                                        </div>
                                    </div>

                                    <div className="bg-[#0f172a] p-6 rounded-xl border border-slate-600 relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                                        <span className="text-sm text-slate-400 block mb-1">Turn Radius</span>
                                        <span className="text-4xl font-black text-white">{turnCalcs.radiusMeters.toFixed(0)}<span className="text-lg text-slate-500 ml-1">m</span></span>
                                        <div className="mt-4 pt-4 border-t border-slate-700/50">
                                            <span className="text-xs font-mono text-slate-500">Radius = V² / (g × tan θ)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 p-3 bg-blue-900/20 text-blue-300 rounded border border-blue-500/20 text-sm">
                                    <Activity size={18} className="shrink-0" />
                                    <span>If you maintain bank angle but increase speed, rate <strong>decreases</strong> and radius <strong>increases</strong> heavily.</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== TAB 5: QUIZ ===== */}
                    {activeTab === 'QUIZ' && (
                        <div className="space-y-6">
                            {!showQuizResults ? (
                                <div className="space-y-8">
                                    {QUIZ_QUESTIONS.map((q, qIdx) => (
                                        <div key={qIdx} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                                            <h3 className="text-lg font-medium text-white mb-4">{qIdx + 1}. {q.q}</h3>
                                            <div className="space-y-2">
                                                {q.options.map((opt, oIdx) => (
                                                    <button
                                                        key={oIdx}
                                                        onClick={() => setQuizAnswers(prev => ({...prev, [qIdx]: oIdx}))}
                                                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                                                            quizAnswers[qIdx] === oIdx 
                                                            ? 'bg-emerald-600/30 border-emerald-500 text-white' 
                                                            : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800'
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
                                        Submit Quiz
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="bg-slate-800 p-8 rounded-xl text-center border border-slate-700">
                                        <h3 className="text-3xl font-bold text-white mb-2">Score: {calculateScore()} / {QUIZ_QUESTIONS.length}</h3>
                                        <p className="text-slate-400">
                                            {calculateScore() === QUIZ_QUESTIONS.length ? 'Excellent grasp of Mechanics & Stability!' : 'Review the stability concepts below.'}
                                        </p>
                                        <button onClick={() => { setQuizAnswers({}); setShowQuizResults(false); }} className="mt-6 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">
                                            Retake Quiz
                                        </button>
                                    </div>

                                    {QUIZ_QUESTIONS.map((q, qIdx) => {
                                        const isCorrect = quizAnswers[qIdx] === q.answer;
                                        return (
                                            <div key={qIdx} className={`p-6 rounded-xl border ${isCorrect ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                                                <div className="flex items-start gap-4">
                                                    {isCorrect ? <CheckCircle className="text-emerald-500 shrink-0 mt-1" /> : <XCircle className="text-red-500 shrink-0 mt-1" />}
                                                    <div>
                                                        <h3 className="text-white font-medium mb-3">{q.q}</h3>
                                                        <div className="space-y-2 mb-4">
                                                            <div className="text-sm p-3 rounded bg-slate-900/50 text-slate-300">
                                                                <span className="text-slate-500 mr-2">Your Answer:</span>
                                                                {q.options[quizAnswers[qIdx]]}
                                                            </div>
                                                            {!isCorrect && (
                                                                <div className="text-sm p-3 rounded bg-emerald-900/30 border border-emerald-500/20 text-emerald-200">
                                                                    <span className="font-bold mr-2">Correct Answer:</span>
                                                                    {q.options[q.answer]}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-slate-400 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                                            <strong>Rationale:</strong> {q.rationale}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
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

export default PoFFlightMechanics;
