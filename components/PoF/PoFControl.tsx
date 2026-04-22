import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Move, Activity, Zap, CheckCircle, XCircle, Info, ArrowRight } from 'lucide-react';

type Tab = 'PRIMARY' | 'SECONDARY' | 'FORCES' | 'QUIZ';

const PoFControl: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('PRIMARY');
    const [activePrimary, setActivePrimary] = useState<'AILERON' | 'ELEVATOR' | 'RUDDER'>('AILERON');
    const [activeSecondary, setActiveSecondary] = useState<'TRIM' | 'BALANCE' | 'SERVO' | 'ANTISERVO' | 'DIFFERENTIAL' | 'FRISE'>('TRIM');
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
    const [showQuizResults, setShowQuizResults] = useState(false);

    const PRIMARY_CONTROLS = {
        AILERON: {
            name: 'Ailerons',
            axis: 'Longitudinal Axis (Roll)',
            effect: 'Controls aircraft roll. Downward deflected aileron increases lift, upward decreases lift.',
            adverseYaw: 'The downward deflected aileron creates more lift and subsequently more induced drag, pulling the nose in the opposite direction of the roll. Overcome using rudder or specialized ailerons (Frise/Differential).'
        },
        ELEVATOR: {
            name: 'Elevator',
            axis: 'Lateral Axis (Pitch)',
            effect: 'Controls aircraft pitch. Upward deflection pushes tail down, raising nose. Downward raises tail, lowering nose.',
            adverseYaw: 'N/A for elevator. Changing pitch alters angle of attack and airspeed.'
        },
        RUDDER: {
            name: 'Rudder',
            axis: 'Normal/Vertical Axis (Yaw)',
            effect: 'Controls aircraft yaw. Deflection left creates aerodynamic force pushing tail right, yawing nose left.',
            adverseYaw: 'Rudder is typically used to counteract adverse yaw caused by ailerons (coordinating the turn).'
        }
    };

    const SECONDARY_CONTROLS = {
        TRIM: { name: 'Trim Tab', desc: 'Relieves pilot control force. Tab moves OPPOSITE to the desired main surface deflection. Reduces stick forces to zero for a specific attitude/airspeed.', tabAngle: -20, mainAngle: 20 },
        BALANCE: { name: 'Balance Tab', desc: 'Coupled to main surface. Moves OPPOSITE to main surface to provide aerodynamic assistance and reduce control forces.', tabAngle: -20, mainAngle: 20 },
        SERVO: { name: 'Servo Tab', desc: 'Pilot controls ONLY the tab. Tab moves OPPOSITE to desired main surface movement. Aerodynamic force on the tab drives the main surface.', tabAngle: -25, mainAngle: 20 },
        ANTISERVO: { name: 'Anti-servo Tab', desc: 'Moves in the SAME direction as main surface. Increases stick force to prevent over-controlling (common on stabilators).', tabAngle: 25, mainAngle: 20 },
        DIFFERENTIAL: { name: 'Differential Aileron', desc: 'Upward moving aileron deflects further than downward moving aileron. Reduces drag on the down-going wing, mitigating adverse yaw.', tabAngle: 0, mainAngle: 0 },
        FRISE: { name: 'Frise Aileron', desc: 'Leading edge of upward-moving aileron protrudes below the wing into the airflow, creating parasite drag to counteract adverse yaw.', tabAngle: 0, mainAngle: 0 }
    };

    const QUIZ_QUESTIONS = [
        { q: "Which control surface controls rotation around the longitudinal axis?", options: ["Elevator", "Rudder", "Aileron", "Flap"], answer: 2, rationale: "Ailerons control the aircraft's roll by rotating it around the longitudinal (nose-to-tail) axis." },
        { q: "What is the primary purpose of a balance tab?", options: ["To relieve pilot input force required to hold a steady attitude", "To decrease stick forces needed to move the main control surface", "To increase control feel on all-moving tailplanes", "To counteract adverse yaw"], answer: 1, rationale: "A balance tab is linkage-coupled to move opposite the main surface, providing aerodynamic help and reducing control forces." },
        { q: "Frise ailerons reduce adverse yaw by:", options: ["Deflecting the up-going aileron further than the down-going one", "Having the leading edge of the up-going aileron protrude below the wing", "Auto-coordinating the rudder", "Using a servo mechanism"], answer: 1, rationale: "Frise ailerons are hinged so that when deflected upward, their leading edge drops below the wing surface, creating parasite drag on the inside wing to counter adverse yaw." },
        { q: "An anti-servo tab moves in the ______ direction as the main surface to ______ control forces.", options: ["opposite, decrease", "same, decrease", "same, increase", "opposite, increase"], answer: 2, rationale: "Anti-servo tabs move in the same direction, typically on stabilators, providing an artificial feel and increasing stick forces to prevent overstressing." },
        { q: "Which aerodynamic balance method uses a portion of the control surface located ahead of the hinge line?", options: ["Mass balance", "Trim tab", "Spring tab", "Horn balance"], answer: 3, rationale: "A horn balance has an area of the control surface ahead of the hinge line. When deflected, air pressure on this forward portion assists the movement." }
    ];

    const handleQuizOption = (qIdx: number, oIdx: number) => {
        if (showQuizResults) return;
        setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
    };

    const calculateScore = () => {
        let score = 0;
        QUIZ_QUESTIONS.forEach((q, i) => {
            if (quizAnswers[i] === q.answer) score++;
        });
        return score;
    };

    return (
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm text-slate-300 w-full max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Settings className="text-purple-400" /> Principles of Flight: Flight Controls
            </h2>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-700 pb-4">
                {[
                    { id: 'PRIMARY', label: 'Primary', icon: Move },
                    { id: 'SECONDARY', label: 'Secondary', icon: Settings },
                    { id: 'FORCES', label: 'Forces & Balance', icon: Activity },
                    { id: 'QUIZ', label: 'Knowledge Check', icon: Zap }
                ].map(t => {
                    const Icon = t.icon;
                    return (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id as Tab)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${activeTab === t.id ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
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
                    {/* ===== TAB 1: PRIMARY CONTROLS ===== */}
                    {activeTab === 'PRIMARY' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-[#0f172a] rounded-xl border border-slate-600 h-[400px] relative overflow-hidden flex items-center justify-center">
                                {/* SVG Aircraft Planform */}
                                <svg width="300" height="300" viewBox="0 0 100 100" className="overflow-visible z-10 transition-transform duration-700">
                                    <defs>
                                        <filter id="glow">
                                            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                                            <feMerge>
                                                <feMergeNode in="coloredBlur"/>
                                                <feMergeNode in="SourceGraphic"/>
                                            </feMerge>
                                        </filter>
                                    </defs>
                                    
                                    {/* Fuselage */}
                                    <rect x="45" y="10" width="10" height="80" rx="5" fill="#334155" />
                                    {/* Cockpit */}
                                    <path d="M47 25 Q50 20 53 25 L52 35 L48 35 Z" fill="#94a3b8" />
                                    
                                    {/* Wings */}
                                    <path d="M45 40 L10 50 L10 60 L45 55 Z" fill="#475569" />
                                    <path d="M55 40 L90 50 L90 60 L55 55 Z" fill="#475569" />
                                    
                                    {/* Tailplane (Horizontal Stabilizer) */}
                                    <path d="M45 80 L25 85 L25 90 L45 88 Z" fill="#475569" />
                                    <path d="M55 80 L75 85 L75 90 L55 88 Z" fill="#475569" />

                                    {/* Ailerons */}
                                    <motion.path 
                                        d="M10 50 L25 47 L25 57 L10 60 Z" 
                                        fill={activePrimary === 'AILERON' ? '#a855f7' : '#1e293b'}
                                        stroke={activePrimary === 'AILERON' ? '#d8b4fe' : 'none'}
                                        filter={activePrimary === 'AILERON' ? 'url(#glow)' : ''}
                                        animate={{ y: activePrimary === 'AILERON' ? [0, -2, 2, 0] : 0 }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="cursor-pointer" onClick={() => setActivePrimary('AILERON')}
                                    />
                                    <motion.path 
                                        d="M90 50 L75 47 L75 57 L90 60 Z" 
                                        fill={activePrimary === 'AILERON' ? '#a855f7' : '#1e293b'}
                                        stroke={activePrimary === 'AILERON' ? '#d8b4fe' : 'none'}
                                        filter={activePrimary === 'AILERON' ? 'url(#glow)' : ''}
                                        animate={{ y: activePrimary === 'AILERON' ? [0, 2, -2, 0] : 0 }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="cursor-pointer" onClick={() => setActivePrimary('AILERON')}
                                    />
                                    
                                    {/* Elevators */}
                                    <motion.path 
                                        d="M25 85 L45 82 L45 88 L25 90 Z" 
                                        fill={activePrimary === 'ELEVATOR' ? '#3b82f6' : '#1e293b'}
                                        stroke={activePrimary === 'ELEVATOR' ? '#93c5fd' : 'none'}
                                        filter={activePrimary === 'ELEVATOR' ? 'url(#glow)' : ''}
                                        animate={{ y: activePrimary === 'ELEVATOR' ? [0, -2, 0, 2, 0] : 0 }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="cursor-pointer" onClick={() => setActivePrimary('ELEVATOR')}
                                    />
                                    <motion.path 
                                        d="M75 85 L55 82 L55 88 L75 90 Z" 
                                        fill={activePrimary === 'ELEVATOR' ? '#3b82f6' : '#1e293b'}
                                        stroke={activePrimary === 'ELEVATOR' ? '#93c5fd' : 'none'}
                                        filter={activePrimary === 'ELEVATOR' ? 'url(#glow)' : ''}
                                        animate={{ y: activePrimary === 'ELEVATOR' ? [0, -2, 0, 2, 0] : 0 }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="cursor-pointer" onClick={() => setActivePrimary('ELEVATOR')}
                                    />

                                    {/* Rudder (simplified as a separate highlight block on tail) */}
                                    <motion.path 
                                        d="M48 75 L52 75 L52 95 L48 95 Z" 
                                        fill={activePrimary === 'RUDDER' ? '#10b981' : '#1e293b'}
                                        stroke={activePrimary === 'RUDDER' ? '#6ee7b7' : 'none'}
                                        filter={activePrimary === 'RUDDER' ? 'url(#glow)' : ''}
                                        animate={{ x: activePrimary === 'RUDDER' ? [0, -2, 2, 0] : 0 }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="cursor-pointer" onClick={() => setActivePrimary('RUDDER')}
                                    />

                                    {/* Axes Rendering */}
                                    <AnimatePresence>
                                        {activePrimary === 'AILERON' && (
                                            <motion.line x1="50" y1="0" x2="50" y2="100" stroke="#f472b6" strokeWidth="0.5" strokeDasharray="2,2" 
                                            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} />
                                        )}
                                        {activePrimary === 'ELEVATOR' && (
                                            <motion.line x1="0" y1="52" x2="100" y2="52" stroke="#f472b6" strokeWidth="0.5" strokeDasharray="2,2" 
                                            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}/>
                                        )}
                                        {activePrimary === 'RUDDER' && (
                                            <motion.circle cx="50" cy="52" r="3" fill="none" stroke="#f472b6" strokeWidth="0.5" strokeDasharray="1,1" 
                                            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}/>
                                        )}
                                    </AnimatePresence>
                                </svg>
                                
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <button onClick={() => setActivePrimary('AILERON')} className={`px-3 py-1 rounded text-xs font-bold transition-colors ${activePrimary==='AILERON' ? 'bg-purple-500 text-white':'bg-slate-800 text-slate-400'}`}>Aileron</button>
                                    <button onClick={() => setActivePrimary('ELEVATOR')} className={`px-3 py-1 rounded text-xs font-bold transition-colors ${activePrimary==='ELEVATOR' ? 'bg-blue-500 text-white':'bg-slate-800 text-slate-400'}`}>Elevator</button>
                                    <button onClick={() => setActivePrimary('RUDDER')} className={`px-3 py-1 rounded text-xs font-bold transition-colors ${activePrimary==='RUDDER' ? 'bg-emerald-500 text-white':'bg-slate-800 text-slate-400'}`}>Rudder</button>
                                </div>
                            </div>
                            
                            <div className="flex flex-col justify-center space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{PRIMARY_CONTROLS[activePrimary].name}</h3>
                                    <div className="inline-block px-3 py-1 bg-slate-800 border border-slate-600 rounded text-sm text-pink-400 font-medium mb-4">
                                        {PRIMARY_CONTROLS[activePrimary].axis}
                                    </div>
                                    <p className="text-slate-300 mb-6 leading-relaxed">
                                        {PRIMARY_CONTROLS[activePrimary].effect}
                                    </p>
                                </div>

                                <div className="bg-slate-800/80 p-5 rounded-xl border-l-4 border-l-yellow-500 border-t border-t-slate-700 border-r border-r-slate-700 border-b border-b-slate-700">
                                    <h4 className="flex items-center gap-2 font-bold text-yellow-400 mb-2">
                                        <Info size={18} /> Regarding Adverse Yaw
                                    </h4>
                                    <p className="text-sm text-slate-300">
                                        {PRIMARY_CONTROLS[activePrimary].adverseYaw}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== TAB 2: SECONDARY CONTROLS ===== */}
                    {activeTab === 'SECONDARY' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-4 space-y-2">
                                {(Object.keys(SECONDARY_CONTROLS) as Array<keyof typeof SECONDARY_CONTROLS>).map(k => (
                                    <button 
                                        key={k}
                                        onClick={() => setActiveSecondary(k)}
                                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all flex justify-between items-center ${activeSecondary === k ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                    >
                                        {SECONDARY_CONTROLS[k].name}
                                        {activeSecondary === k && <ArrowRight size={16} />}
                                    </button>
                                ))}
                            </div>

                            <div className="lg:col-span-8">
                                <div className="bg-[#0f172a] rounded-xl border border-slate-600 h-[250px] relative overflow-hidden flex items-center justify-center p-8 mb-6">
                                    
                                    {/* Animated Trailing Edge Diagram */}
                                    <svg viewBox="0 0 300 150" className="w-full h-full">
                                        {/* Airfoil base */}
                                        <path d="M 20 75 Q 100 20 200 75 Q 100 130 20 75 Z" fill="#334155" />
                                        
                                        {(activeSecondary === 'TRIM' || activeSecondary === 'BALANCE' || activeSecondary === 'SERVO' || activeSecondary === 'ANTISERVO') && (
                                            <g>
                                                {/* Main surface */}
                                                <g transform={`rotate(${SECONDARY_CONTROLS[activeSecondary].mainAngle}, 200, 75)`}>
                                                    <path d="M 200 75 L 280 65 L 280 85 Z" fill="#475569" stroke="#1e293b" />
                                                    {/* Tab */}
                                                    <motion.path 
                                                        initial={{ rotate: 0 }}
                                                        animate={{ rotate: SECONDARY_CONTROLS[activeSecondary].tabAngle }}
                                                        transition={{ duration: 1, repeat: Infinity, repeatType: 'mirror', ease: "easeInOut" }}
                                                        style={{ transformOrigin: '280px 75px' }}
                                                        d="M 280 65 L 310 70 L 310 80 L 280 85 Z" 
                                                        fill="#3b82f6" 
                                                    />
                                                </g>
                                            </g>
                                        )}

                                        {activeSecondary === 'FRISE' && (
                                            <g transform="rotate(-25, 200, 75)">
                                                <path d="M 190 85 L 280 65 L 280 85 Z" fill="#475569" stroke="#1e293b" />
                                                <circle cx="200" cy="75" r="3" fill="red" />
                                                {/* Protruding nose */}
                                                <path d="M 200 75 L 190 85 L 195 90 Z" fill="#ef4444" />
                                                <text x="180" y="110" fill="#ef4444" fontSize="10">Parasite Drag</text>
                                                <path d="M 120 100 Q 180 100 195 90" fill="none" stroke="#94a3b8" strokeDasharray="4" markerEnd="url(#arrow)"/>
                                            </g>
                                        )}

                                        {activeSecondary === 'DIFFERENTIAL' && (
                                            <g>
                                                <text x="50" y="20" fill="white" fontSize="12">Up-going (Large deflection)</text>
                                                <path d="M 200 65 L 280 30 L 280 50 Z" fill="#475569" stroke="#1e293b" />
                                                
                                                <text x="50" y="140" fill="white" fontSize="12">Down-going (Small deflection)</text>
                                                <path d="M 200 85 L 280 100 L 280 110 Z" fill="#475569" stroke="#1e293b" opacity="0.5" />
                                            </g>
                                        )}
                                    </svg>
                                </div>
                                
                                <div className="bg-slate-800 p-6 rounded-xl">
                                    <h3 className="text-xl font-bold text-white mb-2">{SECONDARY_CONTROLS[activeSecondary].name}</h3>
                                    <p className="text-slate-300 text-lg leading-relaxed">{SECONDARY_CONTROLS[activeSecondary].desc}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== TAB 3: CONTROL FORCES ===== */}
                    {activeTab === 'FORCES' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-[#0f172a] p-6 rounded-xl border border-slate-600">
                                    <h3 className="text-lg font-bold text-white mb-4">Aerodynamic Balance</h3>
                                    <p className="text-slate-400 text-sm mb-6">Designed to reduce the physical effort needed to move a control surface by utilizing air pressure.</p>
                                    
                                    <div className="space-y-6">
                                        <div className="flex gap-4 items-start">
                                            <div className="w-16 h-16 shrink-0 bg-slate-800 rounded border border-slate-700 flex items-center justify-center p-2">
                                                {/* Inset Hinge Vector */}
                                                <svg viewBox="0 0 50 50">
                                                    <path d="M 10 25 L 40 10 L 40 40 Z" fill="#475569" />
                                                    <circle cx="20" cy="25" r="3" fill="#ef4444" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium">Inset Hinge</h4>
                                                <p className="text-xs text-slate-400 mt-1">Hinge line is set back from the leading edge. Air striking the area ahead of the hinge pushes in the direction of deflection.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 items-start">
                                            <div className="w-16 h-16 shrink-0 bg-slate-800 rounded border border-slate-700 flex items-center justify-center p-2">
                                                {/* Horn Balance */}
                                                <svg viewBox="0 0 50 50">
                                                    <path d="M 20 25 L 40 10 L 40 40 Z" fill="#475569" />
                                                    <path d="M 20 25 L 20 10 L 30 10 Z" fill="#3b82f6" opacity="0.8" />
                                                    <circle cx="20" cy="25" r="3" fill="#ef4444" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium">Horn Balance</h4>
                                                <p className="text-xs text-slate-400 mt-1">A protruding unshielded portion of the control surface ahead of the hinge line (common on rudders/elevators).</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#0f172a] p-6 rounded-xl border border-slate-600">
                                    <h3 className="text-lg font-bold text-white mb-4">Mass Balance</h3>
                                    <p className="text-slate-400 text-sm mb-6">Designed to prevent control surface <span className="text-red-400 font-bold">flutter</span> (rapid destructive oscillation) by modifying the center of gravity of the control surface.</p>
                                    
                                    <div className="flex justify-center mb-6 h-24">
                                        <svg viewBox="0 0 200 100" className="w-full">
                                            <g>
                                                {/* Control surface */}
                                                <path d="M 100 50 L 150 40 L 150 60 Z" fill="#475569" />
                                                {/* Hinge */}
                                                <circle cx="100" cy="50" r="4" fill="white" />
                                                {/* Weight rod */}
                                                <line x1="100" y1="50" x2="60" y2="50" stroke="#94a3b8" strokeWidth="3" />
                                                {/* Heavy weight */}
                                                <circle cx="60" cy="50" r="8" fill="#eab308" />
                                            </g>
                                        </svg>
                                    </div>
                                    <p className="text-xs text-slate-400 line-clamp-3">
                                        Weights are installed ahead of the hinge line. This brings the CG of the control surface to (or slightly forward of) the hinge line, damping out aerodynamic flutter caused by structural elasticity.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-white mb-4">Reversibility</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { title: 'Reversible (Manual)', desc: 'Aerodynamic forces on the control surface translate directly to the pilot\'s yoke. High "feel". Heavy at high speeds.' },
                                        { title: 'Power Assisted', desc: 'Hydraulics help move the surface, but pilot feels a proportion of the load. Similar to power steering in a car.' },
                                        { title: 'Irreversible (Fully Powered)', desc: 'Hydraulic actuators completely move the surface. External aerodynamic forces CANNOT move the yoke. Artificial feel units (Q-feel, springs) are mandatory.' }
                                    ].map((mode, i) => (
                                        <div key={i} className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors">
                                            <h4 className="text-blue-400 font-bold mb-2">{mode.title}</h4>
                                            <p className="text-sm text-slate-300">{mode.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== TAB 4: QUIZ ===== */}
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
                                                        onClick={() => handleQuizOption(qIdx, oIdx)}
                                                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                                                            quizAnswers[qIdx] === oIdx 
                                                            ? 'bg-purple-600/30 border-purple-500 text-white' 
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
                                        className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg transition-all"
                                    >
                                        Submit Quiz
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="bg-slate-800 p-8 rounded-xl text-center border border-slate-700">
                                        <h3 className="text-3xl font-bold text-white mb-2">Score: {calculateScore()} / {QUIZ_QUESTIONS.length}</h3>
                                        <p className="text-slate-400">
                                            {calculateScore() === QUIZ_QUESTIONS.length ? 'Perfect! You are completely ready.' : 'Review the explanations below for the ones you missed.'}
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

export default PoFControl;
