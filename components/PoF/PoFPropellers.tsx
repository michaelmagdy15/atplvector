import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fan, Activity, Settings, RotateCw, CheckCircle, XCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

type Tab = 'THEORY' | 'EFFICIENCY' | 'CSU' | 'EFFECTS' | 'QUIZ';

const PoFPropellers: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('THEORY');

    // Tab 1: Theory
    const [rpm, setRpm] = useState(2500);
    const [tas, setTas] = useState(120); // knots
    const [diameter, setDiameter] = useState(2.0); // meters

    const helixData = useMemo(() => {
        // Convert TAS (knots) to m/s
        const V = tas * 0.514444; 
        // Convert RPM to revs per second (n)
        const n = rpm / 60;
        // Tangential velocity at tip
        const vRot = Math.PI * diameter * n;
        // Helix angle (advance angle) arctan(V / vRot)
        const helixAngleRad = Math.atan(V / vRot);
        const helixAngleDeg = helixAngleRad * (180 / Math.PI);
        
        // Blade angle is pitch. Assuming AoA is 4 degrees
        const aoa = 4;
        const bladeAngle = helixAngleDeg + aoa;

        return { V, vRot, helixAngleDeg, aoa, bladeAngle };
    }, [rpm, tas, diameter]);

    // Tab 2: Efficiency
    const efficiencyData = useMemo(() => {
        const data = [];
        for (let j = 0.1; j <= 1.4; j += 0.1) {
            // Simulated curves
            let fixed = 0;
            if (j >= 0.2 && j <= 1.1) {
                fixed = 85 - 150 * Math.pow(j - 0.6, 2); // Peak 85% at J=0.6
                if (fixed < 0) fixed = 0;
            }
            
            // Variable pitch envelope (peaks across a wider range)
            let variable = 0;
            if (j >= 0.2 && j <= 1.3) {
                variable = 88 - 50 * Math.pow(j - 0.75, 2); 
                if (variable < 0) variable = 0;
            }

            data.push({
                advanceRatio: j.toFixed(1),
                fixed: Math.max(0, fixed),
                variable: Math.max(0, variable)
            });
        }
        return data;
    }, []);

    // Tab 3: CSU
    const [csuState, setCsuState] = useState<'UNDERSPEED' | 'ON_SPEED' | 'OVERSPEED'>('ON_SPEED');

    // Tab 5: Quiz
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
    const [showQuizResults, setShowQuizResults] = useState(false);

    const QUIZ_QUESTIONS = [
        { q: "What is the Advance Ratio (J) of a propeller?", options: ["The ratio of forward speed to rotational speed (V / nd)", "The angle between the blade chord and the plane of rotation", "The ratio of thrust horsepower to brake horsepower", "The distance the propeller advances in one revolution in a solid medium"], answer: 0, rationale: "Advance ratio (J) is a dimensionless term defined as V / (n * D), where V is true airspeed, n is rotational speed in revs/sec, and D is the propeller diameter. It defines the aerodynamic operating conditions of the propeller." },
        { q: "A Constant Speed Unit (CSU) detects an overspeed condition. The governor flyweights will:", options: ["Move inwards due to decreased centrifugal force", "Remain stationary as the speeder spring pressure increases", "Move outwards against the speeder spring, admitting oil to coarsen the pitch", "Move outwards, draining oil to fine the pitch"], answer: 2, rationale: "In an overspeed, centrifugal force on the flyweights overcomes the speeder spring pressure. They move outwards, lifting the pilot valve, which directs oil to increase (coarsen) the blade angle, causing RPM to drop back to normal." },
        { q: "What causes P-factor (asymmetric blade effect)?", options: ["The slipstream striking the left side of the vertical fin", "Engine torque reaction trying to roll the aircraft", "The descending blade having a higher angle of attack than the ascending blade at high aircraft angles of attack", "Precession from an applied pitching moment"], answer: 2, rationale: "When flying at a high angle of attack (nose up), the descending blade (usually the right blade) meets the relative airflow at a higher angle of attack and higher relative speed than the ascending (left) blade, generating more thrust on the right side and causing a yaw to the left." },
        { q: "Why are propeller blades feathered if an engine fails in cruising flight?", options: ["To prevent the propeller from overspeeding", "To increase elevator authority", "To minimise aerodynamic drag from the windmilling propeller", "To cool the engine cylinders more effectively"], answer: 2, rationale: "Feathering turns the blades practically parallel to the airflow (~90° blade angle), stopping rotation and presenting the minimum possible profile area to the relative wind. This drastically reduces drag from a windmilling prop, which is crucial for single-engine performance." },
        { q: "Compared to a fixed-pitch propeller, a variable-pitch propeller provides:", options: ["Maximum efficiency only at its single design airspeed", "Higher advance ratios at takeoff", "High thrust at low speeds and high efficiency at high speeds", "Lower structural complexity and reduced maintenance"], answer: 2, rationale: "By changing blade angle, a variable pitch propeller can maintain an optimal angle of attack over a wide range of airspeeds. It uses fine pitch for high thrust at low speeds (takeoff) and coarse pitch for efficiency at high speeds (cruise)." }
    ];

    const calculateScore = () => Object.keys(quizAnswers).reduce((acc, key) => acc + (quizAnswers[Number(key)] === QUIZ_QUESTIONS[Number(key)].answer ? 1 : 0), 0);

    return (
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm text-slate-300 w-full max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Fan className="text-emerald-400" /> Principles of Flight: Propellers
            </h2>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-700 pb-4">
                {[
                    { id: 'THEORY', label: 'Propeller Theory', icon: RotateCw },
                    { id: 'EFFICIENCY', label: 'Efficiency', icon: Activity },
                    { id: 'CSU', label: 'CSU & Pitch', icon: Settings },
                    { id: 'EFFECTS', label: 'Propeller Effects', icon: Fan },
                    { id: 'QUIZ', label: 'Quiz', icon: CheckCircle }
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
                    {/* ===== TAB 1: THEORY ===== */}
                    {activeTab === 'THEORY' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                    <h3 className="text-white font-bold mb-6">Blade Element Variables</h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1 flex justify-between">
                                                <span>True Airspeed (TAS)</span>
                                                <span className="text-blue-400 font-bold">{tas} kt</span>
                                            </label>
                                            <input type="range" min="0" max="250" value={tas} onChange={e => setTas(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1 flex justify-between">
                                                <span>RPM</span>
                                                <span className="text-emerald-400 font-bold">{rpm}</span>
                                            </label>
                                            <input type="range" min="500" max="3000" step="100" value={rpm} onChange={e => setRpm(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1 flex justify-between">
                                                <span>Propeller Diameter</span>
                                                <span className="text-yellow-400 font-bold">{diameter.toFixed(1)} m</span>
                                            </label>
                                            <input type="range" min="1.5" max="3.5" step="0.1" value={diameter} onChange={e => setDiameter(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-600 text-sm">
                                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-700">
                                        <span className="text-slate-400">Total Relative Velocity:</span>
                                        <span className="font-bold text-white">{Math.sqrt(helixData.V**2 + Math.pow(helixData.vRot,2)).toFixed(1)} m/s</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-700">
                                        <span className="text-slate-400">Helix Angle:</span>
                                        <span className="font-bold text-blue-400">{helixData.helixAngleDeg.toFixed(1)}°</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">Blade Angle (assuming 4° AoA):</span>
                                        <span className="font-bold text-emerald-400">{helixData.bladeAngle.toFixed(1)}°</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#0f172a] rounded-xl border border-slate-600 p-6 flex flex-col justify-center items-center overflow-hidden">
                                <h3 className="text-white font-bold mb-4">Blade Element Diagram</h3>
                                <svg viewBox="0 0 400 300" className="w-full max-w-sm">
                                    {/* Plane of rotation (Vertical line) */}
                                    <line x1="100" y1="50" x2="100" y2="250" stroke="#475569" strokeWidth="2" strokeDasharray="5" />
                                    <text x="110" y="60" fill="#475569" fontSize="12">Plane of Rotation</text>

                                    {/* Rotational velocity vector (vertical down) */}
                                    <line x1="100" y1="150" x2="100" y2="220" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow-green)"/>
                                    <text x="110" y="210" fill="#10b981" fontSize="12">vRot = π.D.n</text>

                                    {/* Forward velocity vector (horizontal left) */}
                                    <line x1="100" y1="220" x2="30" y2="220" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow-blue)"/>
                                    <text x="40" y="240" fill="#3b82f6" fontSize="12">TAS (V)</text>

                                    {/* Relative Airflow (Diagonal) */}
                                    <g transform={`translate(100, 150) rotate(${90 - helixData.helixAngleDeg})`}>
                                        <line x1="0" y1="0" x2="100" y2="0" stroke="#facc15" strokeWidth="3" markerEnd="url(#arrow-yellow)" />
                                    </g>
                                    <text x="140" y="210" fill="#facc15" fontSize="12">Relative Airflow</text>

                                    {/* Helix Angle Arc */}
                                    <path d={`M 100 190 A 40 40 0 0 1 ${100 + 40 * Math.sin(helixData.helixAngleDeg * Math.PI/180)} ${150 + 40 * Math.cos(helixData.helixAngleDeg * Math.PI/180)}`} fill="none" stroke="#60a5fa" strokeWidth="2" />
                                    <text x="105" y="180" fill="#60a5fa" fontSize="10">Helix Angle</text>

                                    {/* Aerofoil section rotated by blade angle */}
                                    <g transform={`translate(100, 150) rotate(${-helixData.bladeAngle})`}>
                                        <path d="M -40 0 Q -20 -15 20 -5 Q 50 2 60 5 Q 30 5 -40 0" fill="#94a3b8" />
                                        <line x1="-40" y1="0" x2="60" y2="5" stroke="#cbd5e1" strokeDasharray="3" />
                                    </g>
                                    
                                    {/* Blade Angle Arc (Plane of rotation to chord line) */}
                                    <path d={`M 100 120 A 30 30 0 0 0 ${100 + 30 * Math.sin(helixData.bladeAngle * Math.PI/180)} ${150 - 30 * Math.cos(helixData.bladeAngle * Math.PI/180)}`} fill="none" stroke="#e879f9" strokeWidth="2" />
                                    <text x="110" y="115" fill="#e879f9" fontSize="10">Blade Angle</text>

                                    <defs>
                                        <marker id="arrow-green" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#10b981" /></marker>
                                        <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" /></marker>
                                        <marker id="arrow-yellow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#facc15" /></marker>
                                    </defs>
                                </svg>
                                <p className="text-xs text-slate-400 mt-2 text-center max-w-xs">
                                    Thrust is generated by angle of attack relative to the helical airflow path.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ===== TAB 2: EFFICIENCY ===== */}
                    {activeTab === 'EFFICIENCY' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 space-y-6">
                                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                    <h3 className="text-xl font-bold text-white mb-4">Propeller Efficiency (η)</h3>
                                    <div className="bg-[#0f172a] p-4 rounded border border-slate-600 font-mono text-center mb-6">
                                        <div className="text-white text-lg">η = <span className="text-blue-400">T × V</span> / <span className="text-emerald-400">P</span></div>
                                        <div className="text-xs mt-2 text-slate-400">T: Thrust, V: TAS, P: Shaft Power</div>
                                    </div>
                                    <ul className="text-sm space-y-3 text-slate-300">
                                        <li>Fixed pitch drops in efficiency off its design speed because the AoA becomes sub-optimal.</li>
                                        <li>Variable pitch maintains optimal AoA, keeping efficiency high across a wide speed range.</li>
                                        <li>Advance Ratio (J) defines operating conditions: <span className="font-mono text-xs ml-1 bg-slate-900 px-1 py-0.5 rounded border border-slate-700">J = V / (n×D)</span></li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="lg:col-span-2 bg-[#0f172a] rounded-xl border border-slate-600 p-6 flex flex-col h-full min-h-[350px]">
                                <h3 className="text-white font-bold mb-4">Efficiency vs Advance Ratio (J)</h3>
                                <div className="flex-1 w-full h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={efficiencyData} margin={{top:10, bottom: 20}}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                            <XAxis dataKey="advanceRatio" stroke="#94a3b8" label={{ value: 'Advance Ratio (J)', position: 'bottom', fill: '#94a3b8' }} />
                                            <YAxis stroke="#94a3b8" label={{ value: 'Efficiency (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} domain={[0, 100]} />
                                            <Tooltip contentStyle={{backgroundColor: '#1e293b', border:'none', color:'#fff'}}/>
                                            <Legend verticalAlign="top" height={36}/>
                                            <Line type="monotone" name="Fixed Pitch" dataKey="fixed" stroke="#f43f5e" strokeWidth={3} dot={false} />
                                            <Line type="monotone" name="Variable Pitch (Envelope)" dataKey="variable" stroke="#10b981" strokeWidth={3} dot={false} strokeDasharray="4 4" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== TAB 3: CSU ===== */}
                    {activeTab === 'CSU' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-white">Constant Speed Unit (CSU)</h3>
                                    <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700">
                                        <button onClick={() => setCsuState('UNDERSPEED')} className={`px-2 py-1 text-xs font-bold rounded ${csuState === 'UNDERSPEED' ? 'bg-blue-600' : 'text-slate-400'}`}>Underspeed</button>
                                        <button onClick={() => setCsuState('ON_SPEED')} className={`px-2 py-1 text-xs font-bold rounded ${csuState === 'ON_SPEED' ? 'bg-emerald-600' : 'text-slate-400'}`}>On Speed</button>
                                        <button onClick={() => setCsuState('OVERSPEED')} className={`px-2 py-1 text-xs font-bold rounded ${csuState === 'OVERSPEED' ? 'bg-red-600' : 'text-slate-400'}`}>Overspeed</button>
                                    </div>
                                </div>
                                
                                <div className="bg-[#0f172a] h-64 rounded border border-slate-600 flex items-center justify-center p-4">
                                    {/* Animated CSU Schematic */}
                                    <svg viewBox="0 0 300 200" className="w-full h-full">
                                        {/* Speeder Spring */}
                                        <motion.path 
                                            d="M 140 30 L 160 30 L 140 40 L 160 50 L 140 60 L 160 70 L 150 80" 
                                            stroke="#3b82f6" strokeWidth="4" fill="none"
                                            animate={{
                                                d: csuState === 'UNDERSPEED' 
                                                    ? "M 140 30 L 160 30 L 140 45 L 160 60 L 140 75 L 160 90 L 150 100" // extended
                                                    : csuState === 'OVERSPEED'
                                                    ? "M 140 30 L 160 30 L 140 35 L 160 40 L 140 45 L 160 50 L 150 60" // compressed
                                                    : "M 140 30 L 160 30 L 140 40 L 160 50 L 140 60 L 160 70 L 150 80" // normal
                                            }}
                                        />
                                        
                                        {/* Flyweights */}
                                        <motion.g 
                                            animate={{ 
                                                rotate: csuState === 'UNDERSPEED' ? 10 : csuState === 'OVERSPEED' ? -20 : 0, 
                                                x: csuState === 'UNDERSPEED' ? 5 : csuState === 'OVERSPEED' ? -10 : 0 
                                            }}
                                            originX={130} originY={100}
                                        >
                                            <path d="M 130 100 L 100 70 L 130 90 Z" fill="#94a3b8" />
                                        </motion.g>

                                        <motion.g 
                                            animate={{ 
                                                rotate: csuState === 'UNDERSPEED' ? -10 : csuState === 'OVERSPEED' ? 20 : 0,
                                                x: csuState === 'UNDERSPEED' ? -5 : csuState === 'OVERSPEED' ? 10 : 0
                                            }}
                                            originX={170} originY={100}
                                        >
                                            <path d="M 170 100 L 200 70 L 170 90 Z" fill="#94a3b8" />
                                        </motion.g>

                                        {/* Pilot Valve */}
                                        <motion.rect 
                                            x="145" y="80" width="10" height="60" fill="#cbd5e1"
                                            animate={{
                                                y: csuState === 'UNDERSPEED' ? 100 : csuState === 'OVERSPEED' ? 60 : 80
                                            }}
                                        />

                                        {/* Oil Ports */}
                                        <rect x="135" y="90" width="10" height="40" fill="none" stroke="#64748b" />
                                        <rect x="155" y="90" width="10" height="40" fill="none" stroke="#64748b" />

                                        {/* Labels */}
                                        <text x="180" y="40" fill="#3b82f6" fontSize="12">Speeder Spring</text>
                                        <text x="210" y="80" fill="#94a3b8" fontSize="12">Flyweights</text>
                                        <text x="165" y="140" fill="#cbd5e1" fontSize="12">Pilot Valve</text>

                                        {/* Oil Flow Arrow */}
                                        <motion.path 
                                            d={csuState === 'OVERSPEED' ? "M 160 110 L 190 110" : csuState === 'UNDERSPEED' ? "M 140 110 L 110 110" : ""}
                                            stroke={csuState === 'OVERSPEED' ? '#ef4444' : '#3b82f6'} strokeWidth="4" markerEnd="url(#arrow-oil)"
                                            fill="none"
                                            initial={{pathLength: 0}}
                                            animate={{pathLength: csuState !== 'ON_SPEED' ? 1 : 0}}
                                        />
                                        <defs>
                                            <marker id="arrow-oil" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill={csuState === 'OVERSPEED' ? '#ef4444' : '#3b82f6'} /></marker>
                                        </defs>
                                    </svg>
                                </div>
                                
                                <div className="mt-4 text-sm text-slate-300">
                                    {csuState === 'ON_SPEED' && <p><strong>On Speed:</strong> Centrifugal force on flyweights balances speeder spring pressure. Oil ports are closed.</p>}
                                    {csuState === 'OVERSPEED' && <p><strong>Overspeed:</strong> Aircraft pitches down. RPM increases. Higher centrifugal force pulls flyweights out. Valve moves UP, directing oil to COARSEN pitch → restores target RPM.</p>}
                                    {csuState === 'UNDERSPEED' && <p><strong>Underspeed:</strong> Aircraft pitches up. RPM decreases. Speeder spring pushes flyweights in. Valve moves DOWN, directing oil to FINE pitch → restores target RPM.</p>}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-[#0f172a] p-6 rounded-xl border border-slate-600">
                                    <h3 className="text-emerald-400 font-bold mb-2">Fine vs Coarse Pitch</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                                        <div className="bg-slate-800 p-4 rounded border-t-2 border-blue-500">
                                            <strong className="block text-white mb-2">Fine Pitch (Takeoff)</strong>
                                            <ul className="list-disc pl-4 space-y-1 text-slate-300 text-xs">
                                                <li>Low blade angle</li>
                                                <li>High RPM capable</li>
                                                <li>High thrust at low speeds</li>
                                                <li>Acts like "low gear" in a car</li>
                                            </ul>
                                        </div>
                                        <div className="bg-slate-800 p-4 rounded border-t-2 border-yellow-500">
                                            <strong className="block text-white mb-2">Coarse Pitch (Cruise)</strong>
                                            <ul className="list-disc pl-4 space-y-1 text-slate-300 text-xs">
                                                <li>High blade angle</li>
                                                <li>Lower RPM, better efficiency</li>
                                                <li>Good thrust at high speeds</li>
                                                <li>Acts like "high gear" in a car</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#0f172a] p-6 rounded-xl border border-slate-600">
                                    <h3 className="text-white font-bold mb-2">Special Modes</h3>
                                    <div className="space-y-4 text-sm text-slate-300 mt-4">
                                        <div>
                                            <strong className="text-emerald-400">Feathering</strong>
                                            <p className="text-xs">Blade turns to ~90° (parallel to airflow) upon engine failure. Completely stops rotation and minimizes asymmetrical drag, drastically improving OEI performance.</p>
                                        </div>
                                        <div>
                                            <strong className="text-emerald-400">Reverse Pitch (Beta Range)</strong>
                                            <p className="text-xs">Blade turns to a negative angle. Used on turboprops post-landing to generate reverse thrust, vastly reducing landing roll and brake wear.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== TAB 4: EFFECTS ===== */}
                    {activeTab === 'EFFECTS' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { 
                                    name: "Torque Reaction", 
                                    desc: "Newton's 3rd Law: As the engine rotates the propeller clockwise (viewed from cockpit), an equal opposite reaction tries to roll the fuselage anti-clockwise.", 
                                    action: "More weight on left main gear. Needs right aileron/rudder on takeoff roll."
                                },
                                { 
                                    name: "Slipstream Effect", 
                                    desc: "Propeller wash forms a corkscrew pattern around the fuselage, hitting the left side of the vertical fin.", 
                                    action: "Pushes tail right, meaning nose yaws LEFT. Compensated by right rudder or vertical fin offset/trim."
                                },
                                { 
                                    name: "P-Factor (Asymmetric Thrust)", 
                                    desc: "At high angles of attack, the descending blade (right) meets the air at a higher local AoA than the ascending blade, creating more thrust on the right side.", 
                                    action: "Causes a left turning tendency, especially noticeable in climbs at full power. Requires right rudder."
                                },
                                { 
                                    name: "Gyroscopic Effect", 
                                    desc: "A rotating propeller acts like a gyroscope. A force applied to it acts 90 degrees in the direction of rotation (Precession).", 
                                    action: "Pitching up results in a yaw to the right. Pitching down results in a yaw to the left (for CW prop)."
                                }
                            ].map(effect => (
                                <div key={effect.name} className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                    <h3 className="text-lg font-bold text-emerald-400 mb-2">{effect.name}</h3>
                                    <p className="text-sm text-slate-300 mb-4">{effect.desc}</p>
                                    <div className="bg-slate-900/50 p-3 rounded text-xs border-l-2 border-blue-500 text-slate-400">
                                        <strong className="text-blue-400">Result:</strong> {effect.action}
                                    </div>
                                </div>
                            ))}
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
                                            {calculateScore() === QUIZ_QUESTIONS.length ? 'Perfect!' : 'Review the propeller concepts you missed below.'}
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

export default PoFPropellers;
