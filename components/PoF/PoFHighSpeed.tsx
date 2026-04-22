import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, Navigation, AlertTriangle, Layers, CheckCircle, XCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

type Tab = 'COMPRESSIBILITY' | 'TRANSONIC' | 'SWEPT_WINGS' | 'LIMITS' | 'QUIZ';

const PoFHighSpeed: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('COMPRESSIBILITY');

    // Tab 1 States
    const [altitude, setAltitude] = useState(0); // ft
    const [tas, setTas] = useState(450); // kt
    
    const tempK = useMemo(() => {
        // ISA: 15°C at sea level, decreases 1.98°C per 1000 ft until 36,000 ft, then constant at -56.5°C
        let tempC = 15;
        if (altitude <= 36000) {
            tempC -= (altitude / 1000) * 1.98;
        } else {
            tempC = -56.5;
        }
        return tempC + 273.15;
    }, [altitude]);

    const speedOfSoundKt = useMemo(() => {
        // a = 38.94 * sqrt(T in Kelvin) for knots
        return 38.94 * Math.sqrt(tempK);
    }, [tempK]);

    const machNumber = useMemo(() => tas / speedOfSoundKt, [tas, speedOfSoundKt]);

    const getMachRegime = (m: number) => {
        if (m < 0.75) return { name: 'Subsonic', color: 'bg-blue-500', flow: 'Incompressible (mostly)' };
        if (m < 1.20) return { name: 'Transonic', color: 'bg-yellow-500', flow: 'Mixed subsonic/supersonic' };
        if (m < 5.0) return { name: 'Supersonic', color: 'bg-orange-500', flow: 'Fully supersonic, shock waves' };
        return { name: 'Hypersonic', color: 'bg-red-500', flow: 'Aerodynamic heating dominant' };
    };
    
    const regime = getMachRegime(machNumber);

    // Tab 2 States
    const [shockType, setShockType] = useState<'NORMAL' | 'OBLIQUE' | 'BOW'>('NORMAL');
    const dragData = useMemo(() => {
        const data = [];
        for (let m = 0.5; m <= 1.5; m += 0.05) {
            let cd = 0.02; // base drag
            if (m > 0.8 && m < 1.0) cd += Math.pow((m - 0.8) * 3, 2) * 0.05;
            if (m >= 1.0) cd = 0.1 - (m - 1.0) * 0.02;
            data.push({ mach: m.toFixed(2), cd: cd });
        }
        return data;
    }, []);

    // Tab 3 States
    const [sweepAngle, setSweepAngle] = useState(30);

    // Tab 4 States
    const [coffinAltitude, setCoffinAltitude] = useState(35000); // ft

    // Quiz States
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
    const [showQuizResults, setShowQuizResults] = useState(false);

    const QUIZ_QUESTIONS = [
        { q: "The critical Mach number (Mcrit) is defined as the free-stream Mach number at which:", options: ["The aircraft breaks the sound barrier", "Local airflow over the wing first reaches Mach 1.0", "Shock waves reach the trailing edge", "Wave drag begins to decrease"], answer: 1, rationale: "Mcrit is the speed where the fastest moving air over the wing (usually the upper surface peak camber) reaches Mach 1.0 exactly." },
        { q: "What is the primary aerodynamic benefit of swept wings on high-speed aircraft?", options: ["It reduces Mach tuck", "It increases static longitudinal stability", "It reduces the effective Mach number over the wing chord, delaying the onset of wave drag", "It prevents shock-induced separation"], answer: 2, rationale: "Sweeping the wing means only the velocity component perpendicular to the leading edge contributes to the Mach effects over the chord, effectively delaying Mcrit and wave drag." },
        { q: "As altitude increases in the troposphere, the speed of sound:", options: ["Increases because density decreases", "Decreases because temperature decreases", "Remains constant", "Increases because pressure decreases"], answer: 1, rationale: "The speed of sound in an ideal gas depends solely on its absolute temperature (a = √(γRT)). Since ISA temperature drops with altitude up to the tropopause, the local speed of sound decreases." },
        { q: "Mach tuck is a nose-down pitching tendency caused by:", options: ["The center of pressure moving aft as shock waves develop on the wing", "The center of gravity shifting forward as fuel moves", "A loss of elevator effectiveness", "Shock-induced boundary layer separation on the nose"], answer: 0, rationale: "At transonic speeds, as shock waves move aft on the wing, lift redistribution causes the center of pressure to shift rearwards, pushing the nose down." },
        { q: "The 'Coffin Corner' refers to the altitude where:", options: ["VNE and VMO intersect", "The low-speed buffet (stall) and high-speed buffet (Mach limits) converge", "Wave drag exceeds engine thrust", "The tropopause begins"], answer: 1, rationale: "At very high altitudes, the stall speed (IAS) increases while the speed of sound (and thus MMO converted to IAS) decreases. The narrow gap between these boundaries is the coffin corner." }
    ];

    const calculateScore = () => Object.keys(quizAnswers).reduce((acc, key) => acc + (quizAnswers[Number(key)] === QUIZ_QUESTIONS[Number(key)].answer ? 1 : 0), 0);

    return (
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm text-slate-300 w-full max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Zap className="text-emerald-400" /> High Speed Aerodynamics
            </h2>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-700 pb-4">
                {[
                    { id: 'COMPRESSIBILITY', label: 'Compressibility', icon: Layers },
                    { id: 'TRANSONIC', label: 'Transonic Effects', icon: Activity },
                    { id: 'SWEPT_WINGS', label: 'Wing Design', icon: Navigation },
                    { id: 'LIMITS', label: 'High-Speed Limits', icon: AlertTriangle },
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
                    {/* ===== TAB 1: COMPRESSIBILITY ===== */}
                    {activeTab === 'COMPRESSIBILITY' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                    <h3 className="text-xl font-bold text-white mb-4">Mach Number & Speed of Sound</h3>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <label className="flex justify-between text-sm font-medium text-slate-400 mb-2">
                                                <span>Altitude: <span className="text-emerald-400 font-bold">{altitude.toLocaleString()} ft</span></span>
                                                <span className="text-slate-500">{(tempK - 273.15).toFixed(1)} °C</span>
                                            </label>
                                            <input 
                                                type="range" min="0" max="60000" step="1000" 
                                                value={altitude} 
                                                onChange={e => setAltitude(Number(e.target.value))}
                                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="flex justify-between text-sm font-medium text-slate-400 mb-2">
                                                <span>True Airspeed (TAS): <span className="text-blue-400 font-bold">{tas} kt</span></span>
                                            </label>
                                            <input 
                                                type="range" min="100" max="1000" step="10" 
                                                value={tas} 
                                                onChange={e => setTas(Number(e.target.value))}
                                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-6">
                                        <div className="bg-[#0f172a] p-4 rounded-lg flex flex-col justify-center border border-slate-600">
                                            <span className="text-xs text-slate-400 mb-1">Local Speed of Sound</span>
                                            <span className="text-2xl font-black text-white">{speedOfSoundKt.toFixed(0)}<span className="text-sm font-normal text-slate-500 ml-1">kt</span></span>
                                            <span className="text-[10px] text-slate-500 mt-2 font-mono">a = √(γRT)</span>
                                        </div>
                                        <div className={`p-4 rounded-lg flex flex-col justify-center border border-slate-600 ${regime.color.replace('bg-', 'bg-').replace('500', '900/30')} ${regime.color.replace('bg-', 'border-').replace('500', '500/50')}`}>
                                            <span className="text-xs text-slate-400 mb-1">Current Mach Number</span>
                                            <span className="text-3xl font-black text-white">M {machNumber.toFixed(2)}</span>
                                            <span className={`text-[10px] font-bold mt-1 ${regime.color.replace('bg-', 'text-')}`}>{regime.name.toUpperCase()}</span>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-xs text-slate-500 italic text-center text-balance">{regime.flow}</p>
                                </div>
                            </div>

                            <div className="bg-[#0f172a] justify-between rounded-xl border border-slate-600 p-6 flex flex-col relative overflow-hidden">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Critical Mach Number (Mcrit)</h3>
                                    <p className="text-sm text-slate-400">
                                        As air flows over the cambered upper surface, it accelerates. <span className="text-emerald-400 font-bold">Mcrit</span> is the free-stream Mach where local airflow velocity over the wing hits exactly Mach 1.0.
                                    </p>
                                </div>

                                <div className="flex-1 w-full flex items-center justify-center p-4">
                                    <svg viewBox="0 0 300 150" className="w-full h-full overflow-visible">
                                        {/* Airfoil */}
                                        <path d="M 20 75 Q 100 0 280 75 Q 100 100 20 75 Z" fill="#475569" stroke="#1e293b" />
                                        
                                        {/* Airflow */}
                                        <motion.path 
                                            d="M 5 60 Q 100 -20 200 65" 
                                            fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5"
                                            animate={{ strokeDashoffset: -50 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: 'linear'}}
                                        />
                                        <motion.path 
                                            d="M 5 85 Q 100 110 200 80" 
                                            fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="5"
                                            animate={{ strokeDashoffset: -50 }}
                                            transition={{ repeat: Infinity, duration: 2, ease: 'linear'}}
                                        />
                                        
                                        {/* Mach 1.0 bubble */}
                                        <motion.path 
                                            d="M 70 30 Q 120 0 160 40 Q 120 40 70 30 Z" 
                                            fill="#ef4444" fillOpacity="0.4"
                                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                        />
                                        <text x="95" y="15" fill="#fca5a5" fontSize="10" className="font-bold">Local Mach 1.0</text>
                                        
                                        {/* Label */}
                                        <text x="20" y="20" fill="#94a3b8" fontSize="10">Freestream M = 0.78</text>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== TAB 2: TRANSONIC EFFECTS ===== */}
                    {activeTab === 'TRANSONIC' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="bg-[#0f172a] rounded-xl border border-slate-600 p-6">
                                    <h3 className="text-lg font-bold text-white mb-4">Shock Wave Formation</h3>
                                    
                                    <div className="flex gap-2 mb-4">
                                        {(['NORMAL', 'OBLIQUE', 'BOW'] as const).map(type => (
                                            <button 
                                                key={type}
                                                onClick={() => setShockType(type)}
                                                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${shockType === type ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'}`}
                                            >
                                                {type.charAt(0) + type.slice(1).toLowerCase()}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="h-48 relative flex items-center justify-center">
                                        <svg viewBox="0 0 300 150" className="w-full h-full">
                                            {shockType === 'NORMAL' && (
                                                <g>
                                                    <path d="M 50 75 Q 150 20 250 75 Q 150 110 50 75 Z" fill="#475569" />
                                                    <motion.line x1="180" y1="20" x2="180" y2="70" stroke="#facc15" strokeWidth="4" />
                                                    <text x="175" y="10" fill="#facc15" fontSize="10" textAnchor="end">Normal Shock</text>
                                                    <path d="M 180 30 L 220 20 L 280 60" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.6"/>
                                                    <text x="240" y="40" fill="#f87171" fontSize="8" textAnchor="middle">Shock-induced separation</text>
                                                </g>
                                            )}
                                            {shockType === 'OBLIQUE' && (
                                                <g>
                                                    <path d="M 50 75 L 150 50 L 250 75 L 150 100 Z" fill="#475569" /> {/* Wedge */}
                                                    <line x1="50" y1="75" x2="120" y2="20" stroke="#facc15" strokeWidth="3" />
                                                    <text x="125" y="15" fill="#facc15" fontSize="10">Oblique Shock (M &gt; 1)</text>
                                                </g>
                                            )}
                                            {shockType === 'BOW' && (
                                                <g>
                                                    <path d="M 100 75 C 100 40 250 50 250 75 C 250 100 100 110 100 75 Z" fill="#475569" /> {/* Blunt body */}
                                                    <path d="M 80 10 Q 50 75 80 140" fill="none" stroke="#facc15" strokeWidth="4" />
                                                    <text x="75" y="15" fill="#facc15" fontSize="10" textAnchor="end">Bow Shock (Stand-off)</text>
                                                </g>
                                            )}
                                        </svg>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2">
                                        {shockType === 'NORMAL' && "Perpendicular to airflow. Drastically slows air to subsonic, causing severe pressure rise and boundary layer separation."}
                                        {shockType === 'OBLIQUE' && "Angled to airflow (wedge/cone). Air slows down but remains supersonic behind the shock."}
                                        {shockType === 'BOW' && "Forms ahead of blunt leading edges at supersonic speeds. Central part acts like a normal shock."}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-full flex flex-col">
                                    <h3 className="text-lg font-bold text-white mb-2">Wave Drag Divergence</h3>
                                    <p className="text-sm text-slate-400 mb-6">As shocks form past Mcrit, <span className="font-bold text-red-400">Wave Drag</span> increases massively. The Drag-Divergence Mach Number (Mdd) marks a rapid rise in drag coefficient ($C_D$).</p>
                                    
                                    <div className="flex-1 w-full h-[200px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={dragData} margin={{top:10, right:10, left:-20, bottom:0}}>
                                                <defs>
                                                    <linearGradient id="colorCd" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                                <XAxis dataKey="mach" stroke="#94a3b8" fontSize={10} minTickGap={20} />
                                                <YAxis stroke="#94a3b8" fontSize={10}/>
                                                <Tooltip contentStyle={{backgroundColor:'#0f172a', borderColor:'#334155'}} itemStyle={{color:'#ef4444'}}/>
                                                <Area type="monotone" dataKey="cd" stroke="#ef4444" fillOpacity={1} fill="url(#colorCd)" />
                                                <ReferenceLine x="0.80" stroke="#facc15" strokeDasharray="3 3" label={{ position: 'insideTopLeft',  value: 'Mcrit', fill: '#facc15', fontSize: 10 }} />
                                                <ReferenceLine x="0.85" stroke="#f97316" strokeDasharray="3 3" label={{ position: 'insideTopRight',  value: 'Mdd', fill: '#f97316', fontSize: 10 }} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="p-4 mt-6 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                                        <p className="text-xs text-blue-300"><span className="font-bold">Mach Tuck:</span> The shock wave forces boundary layer separation, shifting the center of lift rearward and reducing downwash on the tailplate. The aircraft pitches nose-down drastically.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== TAB 3: WING DESIGN ===== */}
                    {activeTab === 'SWEPT_WINGS' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                    <h3 className="text-xl font-bold text-white mb-4">Wing Sweep Effect</h3>
                                    
                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                        Wing Sweep Angle (Λ): <span className="text-emerald-400 font-bold">{sweepAngle}°</span>
                                    </label>
                                    <input 
                                        type="range" min="0" max="60" step="5" 
                                        value={sweepAngle} 
                                        onChange={e => setSweepAngle(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 mb-6"
                                    />

                                    <div className="bg-[#0f172a] h-64 rounded-xl border border-slate-600 relative overflow-hidden flex items-center justify-center p-4">
                                        <svg viewBox="0 0 200 200" className="w-full max-w-[200px]">
                                            <g transform={`rotate(${sweepAngle}, 50, 100)`}>
                                                {/* Wing section */}
                                                <rect x="50" y="50" width="40" height="100" fill="#475569" stroke="#1e293b" />
                                                
                                                {/* Free stream vector V */}
                                                <g transform={`rotate(${-sweepAngle}, 70, 100)`}>
                                                    <line x1="10" y1="100" x2="60" y2="100" stroke="#facc15" strokeWidth="2" markerEnd="url(#arrow)"/>
                                                    <text x="0" y="105" fill="#facc15" fontSize="12" fontWeight="bold">V</text>
                                                </g>
                                                
                                                {/* Chordwise component (causes drag/mach) */}
                                                <line x1="20" y1="100" x2="60" y2="100" stroke="#ef4444" strokeWidth="2" strokeDasharray="2" />
                                                <text x="30" y="90" fill="#ef4444" fontSize="10">V * cos(Λ)</text>

                                                {/* Spanwise component (causes boundary layer drift) */}
                                                <line x1="70" y1="100" x2="70" y2="150" stroke="#60a5fa" strokeWidth="2" strokeDasharray="2" />
                                                <text x="75" y="130" fill="#60a5fa" fontSize="10">Spanwise</text>
                                            </g>
                                        </svg>
                                    </div>
                                    <div className="mt-4 p-4 bg-emerald-900/20 rounded border border-emerald-500/20 text-emerald-400 text-sm flex justify-between items-center">
                                        <span>If Aircraft M = 0.85</span>
                                        <span className="font-bold">Effective Mach = {(0.85 * Math.cos(sweepAngle * Math.PI/180)).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="bg-[#0f172a] p-6 rounded-xl border border-slate-600">
                                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">Area Rule (Whitcomb)</h3>
                                    <p className="text-xs text-slate-400 mb-4">Wave drag depends on the cross-sectional area distribution. Squeezing the fuselage (coke-bottle shape) where the wings attach smooths the area profile and slashes supersonic drag.</p>
                                    <svg viewBox="0 0 300 100" className="w-full">
                                        <path d="M 50 40 Q 150 40 250 40 Q 150 70 50 40 Z" fill="none" stroke="#475569" /> {/* Wing proxy */}
                                        <path d="M 20 40 C 100 40 100 50 150 50 C 200 50 200 40 280 40 L 280 60 C 200 60 200 50 150 50 C 100 50 100 60 20 60 Z" fill="#94a3b8" /> {/* Fuselage */}
                                        <line x1="150" y1="20" x2="150" y2="80" stroke="#ef4444" strokeWidth="1" strokeDasharray="2" />
                                        <text x="150" y="15" fill="#fca5a5" fontSize="10" textAnchor="middle">Area pinched at wing root</text>
                                    </svg>
                                </div>

                                <div className="bg-[#0f172a] p-6 rounded-xl border border-slate-600">
                                    <h3 className="text-white font-bold mb-4">Supercritical Airfoil</h3>
                                    <svg viewBox="0 0 300 120" className="w-full">
                                        {/* Conventional */}
                                        <text x="0" y="20" fill="#94a3b8" fontSize="10">Conventional</text>
                                        <path d="M 0 50 Q 80 0 140 50 Q 80 60 0 50 Z" fill="none" stroke="#475569" strokeWidth="2" />
                                        
                                        {/* Supercritical */}
                                        <text x="160" y="20" fill="#94a3b8" fontSize="10">Supercritical (Flatter top, swept trailing edge)</text>
                                        <path d="M 160 50 Q 220 20 290 60 Q 220 80 160 50 Z" fill="none" stroke="#10b981" strokeWidth="2" />
                                    </svg>
                                    <p className="text-xs text-slate-400 mt-2">Delays supersonic flow acceleration on top surface, pushing shock wave rearwards and weakening it. Significantly raises $M_{crit}$.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== TAB 4: LIMITATIONS ===== */}
                    {activeTab === 'LIMITS' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                    <h3 className="text-xl font-bold text-white mb-2">The Coffin Corner</h3>
                                    <p className="text-sm text-slate-400 mb-6">
                                        At high altitudes, the speed of sound decreases (lowering Mach limits like $M_{MO}$ expressed in IAS), while true stall speed increases because air density drops. The intersection creates a corner where slowing down stalls the plane, and speeding up triggers high-speed Mach buffet.
                                    </p>

                                    <label className="block text-sm font-medium text-slate-400 mb-2">
                                        Cruising Altitude: <span className="text-red-400 font-bold">{coffinAltitude.toLocaleString()} ft</span>
                                    </label>
                                    <input 
                                        type="range" min="10000" max="45000" step="1000" 
                                        value={coffinAltitude} 
                                        onChange={e => setCoffinAltitude(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                                    />
                                    {coffinAltitude > 40000 && (
                                        <div className="mt-4 p-3 bg-red-900/30 text-red-400 text-sm rounded flex items-center gap-2 border border-red-500/30">
                                            <AlertTriangle size={16} /> Margins virtually zero. High risk of upset.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-[#0f172a] rounded-xl border border-slate-600 p-6 flex flex-col h-80 relative overflow-hidden">
                                <h3 className="text-white font-bold mb-4">Altitude vs IAS Boundary</h3>
                                
                                <div className="flex-1 w-full mx-auto relative flex items-end">
                                    <svg viewBox="0 0 300 250" className="w-full h-full overflow-visible">
                                        {/* Axes */}
                                        <line x1="40" y1="200" x2="280" y2="200" stroke="#475569" />
                                        <line x1="40" y1="20" x2="40" y2="200" stroke="#475569" />
                                        <text x="150" y="220" fill="#94a3b8" fontSize="10" textAnchor="middle">Indicated Airspeed (IAS)</text>
                                        <text x="10" y="110" fill="#94a3b8" fontSize="10" transform="rotate(-90 10 110)">Altitude</text>

                                        {/* Stall Curve (Low speed buffet) - IAS vs Alt
                                            Density drops, IAS stall remains roughly constant until compressibility effects at very high alt
                                            For drawing sake, we'll curve it right slightly at high alt.
                                        */}
                                        <path d="M 80 200 Q 80 100 130 20" fill="none" stroke="#facc15" strokeWidth="2" />
                                        <text x="90" y="100" fill="#facc15" fontSize="10">Low Speed Buffet</text>
                                        
                                        {/* Mach Limit (High speed buffet) - Mmo converted to IAS
                                            Decreases as altitude increases 
                                        */}
                                        <path d="M 260 200 L 260 120 Q 260 80 150 20" fill="none" stroke="#ef4444" strokeWidth="2" />
                                        <text x="220" y="90" fill="#ef4444" fontSize="10" textAnchor="end">High Speed Buffet</text>
                                        
                                        <text x="140" y="10" fill="#94a3b8" fontSize="10">Coffin Corner</text>
                                        
                                        {/* Current Altitude Indicator */}
                                        {(() => {
                                            // Map 10k -> y=180, 45k -> y=30
                                            const normalizedAlt = (coffinAltitude - 10000) / 35000;
                                            const yPos = 180 - (normalizedAlt * 150);
                                            // Width representation
                                            const stallX = 80 + (normalizedAlt * normalizedAlt * 40);
                                            const machX = 260 - (normalizedAlt * 105);
                                            return (
                                                <g>
                                                    <motion.line 
                                                        x1="40" x2="280" stroke="#334155" strokeDasharray="3"
                                                        animate={{y1: yPos, y2: yPos}}
                                                    />
                                                    <motion.line 
                                                        x1={stallX} x2={machX} stroke="#10b981" strokeWidth="4"
                                                        animate={{y1: yPos, y2: yPos, x1: stallX, x2: machX}}
                                                    />
                                                </g>
                                            )
                                        })()}
                                    </svg>
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
                                            {calculateScore() === QUIZ_QUESTIONS.length ? 'Perfect execution.' : 'Review the concepts you missed below.'}
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

export default PoFHighSpeed;
