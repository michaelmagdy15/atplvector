import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Gauge, Crosshair, BarChart2, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

type Tab = 'SPEED' | 'ENVELOPE' | 'STALL' | 'STRUCTURE' | 'QUIZ';

const PoFLimitations: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('SPEED');

    // Tab 1: Speed Limitations
    const [acType, setAcType] = useState<'LIGHT' | 'JET'>('LIGHT');
    const [bankAngleStall, setBankAngleStall] = useState(0);
    
    const speeds = {
        LIGHT: { vs0: 45, vs1: 52, vfe: 100, va: 110, vno: 130, vne: 160 },
        JET: { vs0: 120, vs1: 140, vfe: 180, va: 210, vno: 340, vne: 360 } // Mmo simplifies to Vne here for ASI
    };
    const s = speeds[acType];

    const currentVaLoadFactor = useMemo(() => {
        // Va = Vs1 * sqrt(n)
        return Math.pow(s.va / s.vs1, 2);
    }, [s.vs1, s.va]);

    // Tab 2: V-n Diagram
    const [maxLoad, setMaxLoad] = useState(3.8); // Normal category default
    const [gustLevel, setGustLevel] = useState<'LIGHT' | 'MODERATE' | 'SEVERE'>('LIGHT');

    // Tab 4: Structural
    const fatigueData = [
        { cycle: 100, stress: 100 },
        { cycle: 1000, stress: 80 },
        { cycle: 10000, stress: 65 },
        { cycle: 100000, stress: 55 },
        { cycle: 1000000, stress: 50 }, // Endurance limit
    ];

    // Quiz States
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
    const [showQuizResults, setShowQuizResults] = useState(false);

    const QUIZ_QUESTIONS = [
        { q: "What is the relationship between Limit Load and Ultimate Load?", options: ["Limit load is 1.5 times Ultimate load", "Ultimate load is 1.5 times Limit load", "They are identical in transport category aircraft", "Ultimate load is the gust limit, Limit load is the maneuver limit"], answer: 1, rationale: "The ultimate load is defined as the limit load multiplied by a safety factor, which is typically 1.5 for aircraft structures. Aircraft must withstand ultimate load for 3 seconds without failure." },
        { q: "At the manoeuvring speed (VA), the aircraft will:", options: ["Stall before it can be structurally damaged by a full, abrupt control input", "Survive a severe gust without losing altitude", "Experience Mach tuck", "Trigger the low speed buffet"], answer: 0, rationale: "VA is the design maneuvering speed. It is calculated such that a full control deflection will stall the wing, relieving the aerodynamic load before the structural limit load factor is exceeded." },
        { q: "What defines a 'Superstall' or 'Deep Stall'?", options: ["An accelerated stall in a steep turn", "A secondary stall occurring immediately after recovery", "A high-angle-of-attack stall where the turbulent wake from the main wing blankets the T-tail, preventing pitch-down recovery", "A stall caused by shockwave separation at high altitudes"], answer: 2, rationale: "A deep stall occurs mainly on T-tail aircraft when a high angle of attack places the horizontal stabilizer completely in the turbulent wake of the stalled main wing, rendering the elevator ineffective for recovery." },
        { q: "In a 60-degree banked level turn, the stall speed will:", options: ["Remain equal to Vs1", "Increase by exactly 41% (√2)", "Double", "Decrease due to increased lift component"], answer: 1, rationale: "In a 60° bank, load factor (n) is 2. The new stall speed is Vs * √n. √2 ≈ 1.41, meaning stall speed increases by 41%." },
        { q: "What happens to the V-n envelope if an aircraft is flown at a significantly reduced weight?", options: ["The structural limits increase", "The stall speeds increase", "Manoeuvring speed (VA) decreases", "Gust limits move further away"], answer: 2, rationale: "At a lower weight, the aircraft is subject to higher accelerations (G-loads) from the same aerodynamic force. Therefore, VA must be reduced to ensure the aircraft stalls before breaking." }
    ];

    const calculateScore = () => Object.keys(quizAnswers).reduce((acc, key) => acc + (quizAnswers[Number(key)] === QUIZ_QUESTIONS[Number(key)].answer ? 1 : 0), 0);

    return (
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm text-slate-300 w-full max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <AlertTriangle className="text-emerald-400" /> Principles of Flight: Limitations
            </h2>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-700 pb-4">
                {[
                    { id: 'SPEED', label: 'Speed Limitations', icon: Gauge },
                    { id: 'ENVELOPE', label: 'Flight Envelope', icon: ShieldAlert },
                    { id: 'STALL', label: 'Stall Characteristics', icon: Crosshair },
                    { id: 'STRUCTURE', label: 'Structural Limits', icon: BarChart2 },
                    { id: 'QUIZ', label: 'Knowledge Check', icon: CheckCircle }
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
                    {/* ===== TAB 1: SPEED LIMITATIONS ===== */}
                    {activeTab === 'SPEED' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-white">Speed Definitions</h3>
                                        <div className="flex gap-2 bg-slate-900 p-1 rounded-lg border border-slate-700">
                                            <button onClick={() => setAcType('LIGHT')} className={`px-4 py-1 text-sm font-bold rounded ${acType === 'LIGHT' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>Light</button>
                                            <button onClick={() => setAcType('JET')} className={`px-4 py-1 text-sm font-bold rounded ${acType === 'JET' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>Jet</button>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            { code: 'VSO', name: 'Stall (Landing)', val: s.vs0, desc: 'Flaps/Gear down' },
                                            { code: 'VS1', name: 'Stall (Clean)', val: s.vs1, desc: 'Flaps/Gear up' },
                                            { code: 'VFE', name: 'Max Flap Extended', val: s.vfe, desc: 'Top of white arc' },
                                            { code: 'VA', name: 'Manoeuvring Speed', val: s.va, desc: 'Full deflection limit' },
                                            { code: 'VNO', name: 'Normal Operating', val: s.vno, desc: 'Top of green arc' },
                                            { code: 'VNE', name: 'Never Exceed', val: s.vne, desc: 'Red line' },
                                        ].map(sp => (
                                            <div key={sp.code} className="bg-slate-900/50 p-4 rounded border border-slate-700 flex justify-between items-center">
                                                <div>
                                                    <span className="font-bold text-white block">{sp.code}</span>
                                                    <span className="text-[10px] text-slate-400">{sp.name}</span>
                                                </div>
                                                <div className="text-emerald-400 font-mono text-xl">{sp.val}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/20">
                                    <h4 className="font-bold text-blue-400 mb-2">VA (Manoeuvring Speed) Formula</h4>
                                    <div className="text-xl font-mono text-white mb-2">V<sub>A</sub> = V<sub>S1</sub> × √n</div>
                                    <p className="text-sm text-blue-200">Based on {acType} VS1 of {s.vs1}kt and VA of {s.va}kt, the limit load factor (n) designed for this aircraft is approximately <strong>+{currentVaLoadFactor.toFixed(1)}g</strong>.</p>
                                </div>
                            </div>

                            <div className="bg-[#0f172a] rounded-xl border border-slate-600 p-8 flex flex-col items-center justify-center">
                                <h3 className="text-white font-bold mb-8">Airspeed Indicator (ASI) Arcs</h3>
                                <svg viewBox="0 0 200 200" className="w-full max-w-[250px]">
                                    {/* ASI Background */}
                                    <circle cx="100" cy="100" r="95" fill="#1e293b" stroke="#334155" strokeWidth="4" />
                                    <circle cx="100" cy="100" r="5" fill="#fff" />
                                    
                                    {/* Arc logic: 
                                        We map 0 to VNE+20 knots over 300 degrees.
                                    */}
                                    {(() => {
                                        const maxScale = s.vne * 1.1;
                                        const angle = (v: number) => {
                                            const deg = (v / maxScale) * 300 - 150; // starts at -150 deg (bottom left)
                                            const rad = deg * Math.PI / 180;
                                            return { x: 100 + 85 * Math.sin(rad), y: 100 - 85 * Math.cos(rad), rad };
                                        };
                                        const drawArc = (vStart: number, vEnd: number, stroke: string, width: number, offset: number = 0) => {
                                            // Ensure we draw the arc correctly
                                            const a1 = angle(vStart);
                                            const a2 = angle(vEnd);
                                            // Arc radius
                                            const r = 85 - offset;
                                            const x1 = 100 + r * Math.sin(a1.rad);
                                            const y1 = 100 - r * Math.cos(a1.rad);
                                            const x2 = 100 + r * Math.sin(a2.rad);
                                            const y2 = 100 - r * Math.cos(a2.rad);
                                            const largeArc = (a2.rad - a1.rad) > Math.PI ? 1 : 0;
                                            return <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`} fill="none" stroke={stroke} strokeWidth={width} />;
                                        };
                                        
                                        return (
                                            <g>
                                                {/* White arc: Vs0 to Vfe */}
                                                {drawArc(s.vs0, s.vfe, '#ffffff', 6, 0)}
                                                {/* Green arc: Vs1 to Vno */}
                                                {drawArc(s.vs1, s.vno, '#10b981', 6, 8)}
                                                {/* Yellow arc: Vno to Vne */}
                                                {drawArc(s.vno, s.vne, '#facc15', 6, 8)}
                                                {/* Red line */}
                                                <line x1={angle(s.vne).x} y1={angle(s.vne).y} x2={100 + 75 * Math.sin(angle(s.vne).rad)} y2={100 - 75 * Math.cos(angle(s.vne).rad)} stroke="#ef4444" strokeWidth="4" />
                                                
                                                {/* Needle */}
                                                <path d={`M 100 100 L ${100 + 80 * Math.sin(angle(acType==='LIGHT'? 100 : 250).rad)} ${100 - 80 * Math.cos(angle(acType==='LIGHT'? 100 : 250).rad)}`} stroke="#f8fafc" strokeWidth="2" />
                                            </g>
                                        );
                                    })()}
                                </svg>
                                <div className="flex gap-4 mt-8 text-xs text-slate-400">
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-white rounded-full"></div> Flap Range</span>
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Normal Range</span>
                                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-500 rounded-full"></div> Caution</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== TAB 2: V-N DIAGRAM ===== */}
                    {activeTab === 'ENVELOPE' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 space-y-6">
                                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                    <h3 className="text-xl font-bold text-white mb-6">Structural Envelopes</h3>
                                    
                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                        Limit Load Factor (Positive): <br/><span className="text-emerald-400 font-bold">+{maxLoad.toFixed(1)}g</span>
                                    </label>
                                    <input 
                                        type="range" min="2.5" max="6.0" step="0.1" 
                                        value={maxLoad} 
                                        onChange={e => setMaxLoad(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 mb-6"
                                    />
                                    
                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                        Gust Intensity: <span className="text-blue-400 font-bold">{gustLevel}</span>
                                    </label>
                                    <div className="flex gap-2 bg-slate-900 p-1 rounded-lg border border-slate-700">
                                        <button onClick={() => setGustLevel('LIGHT')} className={`flex-1 py-1 text-xs font-bold rounded ${gustLevel === 'LIGHT' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>15 ft/s</button>
                                        <button onClick={() => setGustLevel('MODERATE')} className={`flex-1 py-1 text-xs font-bold rounded ${gustLevel === 'MODERATE' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>50 ft/s</button>
                                        <button onClick={() => setGustLevel('SEVERE')} className={`flex-1 py-1 text-xs font-bold rounded ${gustLevel === 'SEVERE' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>66 ft/s</button>
                                    </div>
                                </div>
                                <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-600 text-sm text-slate-400">
                                    <p><strong>VA</strong>: Design Manoeuvring Speed</p>
                                    <p><strong>VB</strong>: Design Gust Speed</p>
                                    <p><strong>VC</strong>: Design Cruise Speed</p>
                                    <p><strong>VD</strong>: Design Dive Speed (Flight tests)</p>
                                </div>
                            </div>
                            
                            <div className="lg:col-span-2 bg-[#0f172a] rounded-xl border border-slate-600 p-6 flex flex-col justify-center">
                                <h3 className="text-white font-bold mb-4">V-n Diagram</h3>
                                
                                <div className="w-full h-[350px] relative">
                                    <svg viewBox="0 0 500 300" className="w-full h-full">
                                        {/* Axes */}
                                        <line x1="50" y1="200" x2="480" y2="200" stroke="#475569" strokeWidth="2" />
                                        <line x1="50" y1="20" x2="50" y2="280" stroke="#475569" strokeWidth="2" />
                                        <text x="470" y="215" fill="#94a3b8" fontSize="12">EAS</text>
                                        <text x="30" y="30" fill="#94a3b8" fontSize="12">Load (n)</text>
                                        <text x="35" y="200" fill="#94a3b8" fontSize="12">1</text>
                                        <text x="35" y="204" fill="#94a3b8" fontSize="12">-1</text>
                                        
                                        {(() => {
                                            // Mapping load factor to Y: 1g = 200, 4g = 50. Slope = -50 per g (positive direction up)
                                            // negative g: -1g = 250, -2g = 300
                                            const y = (n: number) => 250 - Math.abs(n * 50); // Using 150 as 0g base offset. Wait, if 0g = 250, 1g=200, 2g=150.
                                            
                                            const yZero = 250;
                                            const scaleY = 50; 
                                            const getY = (n: number) => yZero - (n * scaleY);

                                            // Draw Max Load
                                            const topLimitY = getY(maxLoad);
                                            const bottomLimitY = getY(-maxLoad * 0.4); // typical negative limit is 40% of positive

                                            const vaX = 180;
                                            const vcX = 350;
                                            const vdX = 450;
                                            
                                            // Draw Gust lines
                                            const gustFactor = gustLevel === 'LIGHT' ? 0.5 : gustLevel === 'MODERATE' ? 1.5 : 2.0;
                                            
                                            return (
                                                <g>
                                                    {/* Positive Lift Boundaries */}
                                                    <motion.path 
                                                        d={`M 50 ${yZero} Q 100 150, ${vaX} ${topLimitY}`}
                                                        fill="none" stroke="#facc15" strokeWidth="2"
                                                        animate={{ d: `M 50 ${yZero} Q 100 150, ${vaX} ${topLimitY}` }}
                                                    />
                                                    <motion.line x1={vaX} y1={topLimitY} x2={vdX} y2={topLimitY} stroke="#10b981" strokeWidth="2" animate={{y1: topLimitY, y2: topLimitY}} />
                                                    <line x1={vdX} y1={topLimitY} x2={vdX} y2={bottomLimitY} stroke="#ef4444" strokeWidth="2" />
                                                    
                                                    {/* Negative Lift Boundaries */}
                                                    <motion.path 
                                                        d={`M 50 ${yZero} Q 120 280, ${vaX + 40} ${bottomLimitY}`}
                                                        fill="none" stroke="#facc15" strokeWidth="2"
                                                        animate={{ d: `M 50 ${yZero} Q 120 280, ${vaX + 40} ${bottomLimitY}` }}
                                                    />
                                                    <motion.line x1={vaX + 40} y1={bottomLimitY} x2={vcX} y2={bottomLimitY} stroke="#10b981" strokeWidth="2" animate={{y1: bottomLimitY, y2: bottomLimitY}} />
                                                    <line x1={vcX} y1={bottomLimitY} x2={vdX} y2={yZero} stroke="#10b981" strokeWidth="2" />
                                                    
                                                    {/* Gust Lines */}
                                                    <motion.line 
                                                        x1="50" y1={getY(1)} x2={vcX} y2={getY(1 + gustFactor)} 
                                                        stroke="#60a5fa" strokeDasharray="4" strokeWidth="2" 
                                                        animate={{ y2: getY(1 + gustFactor) }}
                                                    />
                                                    <motion.line 
                                                        x1="50" y1={getY(1)} x2={vcX} y2={getY(1 - gustFactor)} 
                                                        stroke="#60a5fa" strokeDasharray="4" strokeWidth="2" 
                                                        animate={{ y2: getY(1 - gustFactor) }}
                                                    />
                                                    <text x={vcX-10} y={getY(1 + gustFactor)-5} fill="#60a5fa" fontSize="10" textAnchor="end">Gust Envelope</text>

                                                    {/* Legend */}
                                                    <text x={vaX} y={getY(0)+15} fill="#94a3b8" fontSize="10">VA</text>
                                                    <line x1={vaX} y1={getY(0)-5} x2={vaX} y2={getY(0)+5} stroke="#475569" />
                                                    
                                                    <text x={vcX} y={getY(0)+15} fill="#94a3b8" fontSize="10">VC</text>
                                                    <line x1={vcX} y1={getY(0)-5} x2={vcX} y2={getY(0)+5} stroke="#475569" />

                                                    <text x={vdX-10} y={getY(0)+15} fill="#94a3b8" fontSize="10">VD</text>
                                                    <line x1={vdX} y1={getY(0)-5} x2={vdX} y2={getY(0)+5} stroke="#475569" />
                                                </g>
                                            )
                                        })()}
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== TAB 3: STALL CHARACTERISTICS ===== */}
                    {activeTab === 'STALL' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                <h3 className="text-xl font-bold text-white mb-4">Deep Stall (Superstall)</h3>
                                <p className="text-sm text-slate-400 mb-6">Occurs primarily on T-tail aircraft. At high angles of attack, the turbulent wake from the stalled main wing entirely blankets the horizontal tailplane/elevator. The aircraft is "locked" in a nose-high attitude as elevator authority is lost.</p>
                                
                                <div className="bg-[#0f172a] h-64 rounded border border-slate-600 flex items-center justify-center pt-8">
                                    <svg viewBox="0 0 300 200" className="w-[80%] h-full">
                                        <g transform="rotate(-30 150 100)">
                                            {/* Fuselage */}
                                            <path d="M 50 100 L 220 100" stroke="#94a3b8" strokeWidth="20" strokeLinecap="round" />
                                            {/* Main Wing */}
                                            <rect x="120" y="85" width="20" height="30" fill="#475569" />
                                            {/* Vertical Tail */}
                                            <path d="M 200 90 L 220 30 L 230 30 L 220 90 Z" fill="#64748b" />
                                            {/* Horizontal Tail (T-Tail) */}
                                            <rect x="200" y="25" width="40" height="10" fill="#cbd5e1" />

                                            {/* Turbulent Wake */}
                                            <path d="M 130 85 Q 200 30 250 10" fill="none" stroke="#ef4444" strokeWidth="20" strokeDasharray="10" opacity="0.4" />
                                            <path d="M 140 85 Q 210 50 250 40" fill="none" stroke="#ef4444" strokeWidth="30" strokeDasharray="15" opacity="0.3" />
                                        </g>
                                    </svg>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-[#0f172a] p-6 rounded-xl border border-slate-600">
                                    <h3 className="text-lg font-bold text-white mb-4">Accelerated Stall Demo</h3>
                                    <p className="text-xs text-slate-400 mb-4">An accelerated stall occurs when load factor is greater than 1G (e.g. pulling out of a dive, or in a steep turn). The stall occurs at a significantly higher airspeed.</p>
                                    
                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                        Bank Angle: <span className="text-emerald-400 font-bold">{bankAngleStall}°</span>
                                    </label>
                                    <input 
                                        type="range" min="0" max="75" step="1" 
                                        value={bankAngleStall} 
                                        onChange={e => setBankAngleStall(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 mb-6"
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-800 p-4 rounded text-center">
                                            <span className="text-xs text-slate-400 block mb-1">Load Factor</span>
                                            <span className="text-2xl font-bold text-white">{(1/Math.cos(bankAngleStall*Math.PI/180)).toFixed(2)}G</span>
                                        </div>
                                        <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded text-center">
                                            <span className="text-xs text-emerald-300 block mb-1">Stall Speed Multiplier</span>
                                            <span className="text-2xl font-bold text-emerald-400">{Math.sqrt(1/Math.cos(bankAngleStall*Math.PI/180)).toFixed(2)}x</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                    <h3 className="text-white font-bold mb-3">Stall Warning Sequence</h3>
                                    <ul className="space-y-2">
                                        <li className="flex gap-2 items-start"><CheckCircle size={16} className="text-yellow-500 mt-0.5"/> <span className="text-sm text-slate-300">1. Artificial warning triggers first (horn, light, stick shaker). Must operate at least 5% to 10% above actual stall speed.</span></li>
                                        <li className="flex gap-2 items-start"><CheckCircle size={16} className="text-orange-500 mt-0.5"/> <span className="text-sm text-slate-300">2. Natural aerodynamic buffet begins as airflow separates.</span></li>
                                        <li className="flex gap-2 items-start"><CheckCircle size={16} className="text-red-500 mt-0.5"/> <span className="text-sm text-slate-300">3. Stick pusher may actuate (if super-stall prone).</span></li>
                                        <li className="flex gap-2 items-start"><CheckCircle size={16} className="text-rose-700 mt-0.5"/> <span className="text-sm text-slate-300">4. Full stall break, un-commanded pitch down / roll drop.</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== TAB 4: STRUCTURAL LIMITS ===== */}
                    {activeTab === 'STRUCTURE' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                    <h3 className="text-xl font-bold text-white mb-4">G-Limits by Category</h3>
                                    <div className="space-y-3">
                                        {[
                                            { cat: "Normal", pos: "+3.8", neg: "-1.52", desc: "Non-aerobatic, max 60° bank turns." },
                                            { cat: "Utility", pos: "+4.4", neg: "-1.76", desc: "Limited aerobatics like spins & lazy eights." },
                                            { cat: "Transport", pos: "+2.5", neg: "-1.0", desc: "Airliners (clean flight configuration)." },
                                            { cat: "Aerobatic", pos: "+6.0", neg: "-3.0", desc: "No restrictions on manoeuvres." }
                                        ].map(c => (
                                            <div key={c.cat} className="flex flex-col bg-slate-900/50 p-3 rounded">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-bold text-white">{c.cat}</span>
                                                    <span className="font-mono text-emerald-400">{c.pos}G / {c.neg}G</span>
                                                </div>
                                                <span className="text-xs text-slate-400">{c.desc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-[#0f172a] p-6 rounded-xl border border-slate-600">
                                    <h3 className="text-white font-bold mb-4">Limit vs Ultimate Load</h3>
                                    <div className="flex items-center">
                                        <div className="w-1/3 text-sm text-slate-300">Limit Load</div>
                                        <div className="w-2/3 h-6 bg-slate-800 rounded overflow-hidden flex relative">
                                            <div className="w-2/3 bg-emerald-500 h-full flex items-center px-2 text-[10px] font-bold text-white">100% No damage</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center mt-4">
                                        <div className="w-1/3 text-sm text-slate-300">Ultimate Load</div>
                                        <div className="w-2/3 h-6 bg-slate-800 rounded overflow-hidden flex relative">
                                            <div className="w-[99%] bg-red-500 h-full flex items-center px-2 text-[10px] font-bold text-white">150% Failure expected</div>
                                            <div className="absolute left-[66%] h-full w-0.5 bg-white z-10"></div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-4 text-center">Ultimate Load = Limit Load × 1.5 Safety Factor</p>
                                </div>
                            </div>

                            <div className="bg-[#0f172a] p-6 rounded-xl border border-slate-600 flex flex-col h-full">
                                <h3 className="text-xl font-bold text-white mb-2">Metal Fatigue (S-N Curve)</h3>
                                <p className="text-sm text-slate-400 mb-6">Repeated stress (S) loading and unloading weakens metal over time. The S-N curve shows how higher stress amplitude leads to failure in fewer cycles (N).</p>
                                <div className="flex-1 w-full h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={fatigueData} margin={{top:20, bottom: 20}}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                            {/* Using a rough log scale layout conceptually */}
                                            <XAxis dataKey="cycle" scale="log" domain={['auto', 'auto']} stroke="#94a3b8" label={{ value: 'Number of Cycles to Failure (N)', position: 'insideBottom', offset: -10, fill: '#94a3b8' }} tickFormatter={(val) => `10^${Math.log10(val)}`} />
                                            <YAxis stroke="#94a3b8" label={{ value: 'Stress Amplitude (S)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                                            <Tooltip contentStyle={{backgroundColor: '#1e293b', border:'none'}}/>
                                            <Line type="monotone" dataKey="stress" stroke="#3b82f6" strokeWidth={3} dot={{r: 5, fill: '#3b82f6'}} />
                                            <ReferenceLine y={50} stroke="#10b981" strokeDasharray="5" label={{ value: 'Endurance Limit (Steel)', position:'top', fill:'#10b981', fontSize: 10 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <p className="text-xs text-slate-500 mt-4">Note: Aluminum designs (most aircraft) technically have no true endurance limit; they will eventually fail given enough cycles of any stress level.</p>
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
                                            {calculateScore() === QUIZ_QUESTIONS.length ? 'Perfect!' : 'Review the limitations concepts you missed below.'}
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

export default PoFLimitations;
