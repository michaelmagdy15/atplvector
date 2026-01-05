import React, { useState, useEffect } from 'react';
import { Gauge, Layers, Brain, AlertTriangle, CheckCircle, Timer } from 'lucide-react';

const HPLWorkload: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'concept' | 'management' | 'game'>('concept');

    return (
        <div className="space-y-6">
            <header className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                        <Gauge className="w-6 h-6 text-orange-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100">Workload Management</h1>
                </div>
                <p className="text-slate-400">
                    Understanding task saturation, workload curves, and prioritization strategies for optimal performance.
                </p>
            </header>

            <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg">
                <TabButton
                    active={activeTab === 'concept'}
                    onClick={() => setActiveTab('concept')}
                    icon={Layers}
                    label="Workload Concept"
                />
                <TabButton
                    active={activeTab === 'management'}
                    onClick={() => setActiveTab('management')}
                    icon={Brain}
                    label="Management Strategies"
                />
                <TabButton
                    active={activeTab === 'game'}
                    onClick={() => setActiveTab('game')}
                    icon={Timer}
                    label="Prioritization Trainer"
                />
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 min-h-[400px]">
                {activeTab === 'concept' && <WorkloadConcept />}
                {activeTab === 'management' && <ManagementStrategies />}
                {activeTab === 'game' && <PrioritizationGame />}
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md transition-all font-medium ${active
            ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
    >
        <Icon size={18} />
        {label}
    </button>
);

const WorkloadConcept = () => {
    const [workload, setWorkload] = useState(50);

    const getPerformanceZone = () => {
        if (workload < 20) return { zone: 'Underload', color: 'yellow', desc: 'Boredom, complacency, vigilance decrement' };
        if (workload < 40) return { zone: 'Low', color: 'green', desc: 'Comfortable, may lead to inattention' };
        if (workload < 70) return { zone: 'Optimal', color: 'emerald', desc: 'Peak performance, engaged, alert' };
        if (workload < 85) return { zone: 'High', color: 'orange', desc: 'Challenged, prioritization needed' };
        return { zone: 'Overload', color: 'red', desc: 'Task saturation, errors likely, tunnel vision' };
    };

    const zone = getPerformanceZone();

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white text-center">Yerkes-Dodson Curve: The Inverted U</h3>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <p className="text-slate-400 text-sm mb-6">
                        Performance follows an inverted-U relationship with workload/arousal.
                        Too little OR too much demand leads to degraded performance.
                    </p>

                    {/* Interactive Workload Slider */}
                    <div className="bg-slate-900 p-6 rounded-xl">
                        <label className="text-sm text-slate-400 block mb-4">
                            Adjust Workload Level: <span className="text-white font-bold">{workload}%</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={workload}
                            onChange={e => setWorkload(Number(e.target.value))}
                            className="w-full accent-orange-500"
                        />

                        <div className={`mt-6 p-4 rounded-lg border ${zone.color === 'emerald' ? 'border-emerald-500/50 bg-emerald-900/20' :
                                zone.color === 'green' ? 'border-green-500/50 bg-green-900/20' :
                                    zone.color === 'yellow' ? 'border-yellow-500/50 bg-yellow-900/20' :
                                        zone.color === 'orange' ? 'border-orange-500/50 bg-orange-900/20' :
                                            'border-red-500/50 bg-red-900/20'
                            }`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-white">{zone.zone} Zone</span>
                                <span className={`text-xs px-2 py-1 rounded-full font-bold ${zone.color === 'emerald' || zone.color === 'green' ? 'bg-emerald-500/30 text-emerald-300' :
                                        zone.color === 'yellow' ? 'bg-yellow-500/30 text-yellow-300' :
                                            zone.color === 'orange' ? 'bg-orange-500/30 text-orange-300' :
                                                'bg-red-500/30 text-red-300'
                                    }`}>
                                    {zone.color === 'emerald' ? 'OPTIMAL' : zone.color === 'red' ? 'DANGER' : 'CAUTION'}
                                </span>
                            </div>
                            <p className="text-sm text-slate-300">{zone.desc}</p>
                        </div>
                    </div>
                </div>

                <div>
                    {/* Visual Curve Representation */}
                    <div className="bg-slate-900 p-6 rounded-xl h-full">
                        <h4 className="font-bold text-white mb-4">Performance vs Workload</h4>
                        <div className="relative h-48">
                            {/* Simplified curve visualization */}
                            <div className="absolute inset-0 flex items-end">
                                {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((w, i) => {
                                    // Inverted U calculation
                                    const perf = w <= 50 ? w * 2 : 200 - (w * 2);
                                    const height = Math.max(0, Math.min(100, perf));
                                    const isActive = Math.abs(w - workload) < 10;

                                    return (
                                        <div
                                            key={w}
                                            className={`flex-1 transition-all duration-300 rounded-t ${isActive ? 'bg-orange-500' :
                                                    w <= 30 ? 'bg-yellow-500/30' :
                                                        w <= 70 ? 'bg-emerald-500/30' :
                                                            'bg-red-500/30'
                                                }`}
                                            style={{ height: `${height}%` }}
                                        />
                                    );
                                })}
                            </div>

                            {/* Labels */}
                            <div className="absolute bottom-0 left-0 right-0 flex justify-between pt-2 border-t border-slate-700 mt-2 text-xs text-slate-500">
                                <span>Low</span>
                                <span>Workload →</span>
                                <span>High</span>
                            </div>
                        </div>
                        <div className="text-xs text-slate-500 text-center mt-4">
                            ↑ Performance
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-lg">
                    <h4 className="font-bold text-yellow-300 mb-2">Underload Risks</h4>
                    <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Vigilance decrement (boredom)</li>
                        <li>• Complacency errors</li>
                        <li>• Mind wandering</li>
                        <li>• Slow reaction to changes</li>
                    </ul>
                </div>
                <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
                    <h4 className="font-bold text-red-300 mb-2">Overload Risks</h4>
                    <ul className="text-sm text-slate-300 space-y-1">
                        <li>• Task shedding (drop tasks)</li>
                        <li>• Tunnel vision</li>
                        <li>• Channelized attention</li>
                        <li>• Complete task saturation</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const ManagementStrategies = () => {
    const strategies = [
        {
            title: 'Aviate, Navigate, Communicate',
            abbrev: 'ANC',
            desc: 'The fundamental priority hierarchy for pilots',
            details: [
                { priority: 1, task: 'AVIATE', desc: 'Fly the aircraft first - maintain control', color: 'red' },
                { priority: 2, task: 'NAVIGATE', desc: 'Know where you are and where you\'re going', color: 'amber' },
                { priority: 3, task: 'COMMUNICATE', desc: 'Talk to ATC only when safe to do so', color: 'green' },
            ]
        },
    ];

    const techniques = [
        { icon: '📋', title: 'Use Checklists', desc: 'Reduce mental load by following procedures' },
        { icon: '⏰', title: 'Time Management', desc: 'Anticipate busy phases, prepare in advance' },
        { icon: '🤝', title: 'Task Sharing', desc: 'Delegate appropriately in multi-crew operations' },
        { icon: '🎯', title: 'Prioritize', desc: 'Focus on what matters NOW, defer what can wait' },
        { icon: '✈️', title: 'Use Automation', desc: 'Engage autopilot/autothrust when appropriate' },
        { icon: '🗣️', title: 'Communicate Load', desc: 'Tell ATC "Stand by" if saturated' },
    ];

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white text-center">Workload Management Strategies</h3>

            {/* ANC Priority */}
            <div className="bg-slate-900 p-6 rounded-xl">
                <h4 className="font-bold text-white text-lg mb-4 text-center">Priority Hierarchy</h4>
                <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch">
                    {strategies[0].details.map((d, i) => (
                        <div
                            key={i}
                            className={`flex-1 p-5 rounded-xl border text-center ${d.color === 'red' ? 'border-red-500/50 bg-red-900/20' :
                                    d.color === 'amber' ? 'border-amber-500/50 bg-amber-900/20' :
                                        'border-green-500/50 bg-green-900/20'
                                }`}
                        >
                            <div className={`text-4xl font-black mb-2 ${d.color === 'red' ? 'text-red-400' :
                                    d.color === 'amber' ? 'text-amber-400' :
                                        'text-green-400'
                                }`}>
                                {d.priority}
                            </div>
                            <div className="font-bold text-white text-lg">{d.task}</div>
                            <p className="text-sm text-slate-400 mt-2">{d.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Techniques */}
            <div>
                <h4 className="font-bold text-white mb-4">Practical Techniques</h4>
                <div className="grid md:grid-cols-3 gap-4">
                    {techniques.map((t, i) => (
                        <div key={i} className="bg-slate-900/50 p-4 rounded-lg">
                            <span className="text-2xl">{t.icon}</span>
                            <h5 className="font-bold text-white mt-2">{t.title}</h5>
                            <p className="text-sm text-slate-400 mt-1">{t.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* DODAR */}
            <div className="bg-orange-900/20 border border-orange-500/30 p-6 rounded-xl">
                <h4 className="font-bold text-orange-300 mb-4">DODAR Decision Framework</h4>
                <div className="grid md:grid-cols-5 gap-4">
                    {[
                        { letter: 'D', word: 'Diagnose', desc: 'What is the problem?' },
                        { letter: 'O', word: 'Options', desc: 'What can we do?' },
                        { letter: 'D', word: 'Decide', desc: 'Which option best?' },
                        { letter: 'A', word: 'Assign', desc: 'Who does what?' },
                        { letter: 'R', word: 'Review', desc: 'Is it working?' },
                    ].map((step, i) => (
                        <div key={i} className="text-center">
                            <div className="w-12 h-12 bg-orange-500/30 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-xl font-black text-orange-300">{step.letter}</span>
                            </div>
                            <div className="font-bold text-white text-sm">{step.word}</div>
                            <p className="text-xs text-slate-400">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const PrioritizationGame = () => {
    const [gameState, setGameState] = useState<'ready' | 'playing' | 'results'>('ready');
    const [currentTask, setCurrentTask] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);

    const scenarios = [
        {
            situation: 'Engine fire warning light illuminates during cruise',
            options: [
                { text: 'Inform ATC', priority: 3 },
                { text: 'Run engine fire checklist', priority: 1 },
                { text: 'Turn toward nearest suitable airport', priority: 2 },
            ]
        },
        {
            situation: 'TCAS RA "DESCEND" command received',
            options: [
                { text: 'Follow TCAS guidance immediately', priority: 1 },
                { text: 'Inform ATC of TCAS RA', priority: 2 },
                { text: 'Check visual for traffic', priority: 3 },
            ]
        },
        {
            situation: 'Windshear warning on short final',
            options: [
                { text: 'Advise tower of go-around', priority: 3 },
                { text: 'Execute go-around procedure', priority: 1 },
                { text: 'Apply TOGA and rotate', priority: 2 },
            ]
        },
    ];

    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && gameState === 'playing') {
            setGameState('results');
        }
    }, [timeLeft, gameState]);

    const handleAnswer = (priority: number) => {
        if (priority === 1) {
            setScore(s => s + 10);
        } else if (priority === 2) {
            setScore(s => s + 5);
        }

        if (currentTask < scenarios.length - 1) {
            setCurrentTask(t => t + 1);
        } else {
            setGameState('results');
        }
    };

    const startGame = () => {
        setGameState('playing');
        setCurrentTask(0);
        setScore(0);
        setTimeLeft(30);
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white text-center">Task Prioritization Trainer</h3>

            {gameState === 'ready' && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-6">🎮</div>
                    <h4 className="text-xl font-bold text-white mb-4">Quick Decision Trainer</h4>
                    <p className="text-slate-400 mb-6 max-w-md mx-auto">
                        You'll be presented with emergency scenarios. Choose the FIRST priority action as fast as possible.
                    </p>
                    <button
                        onClick={startGame}
                        className="px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-all"
                    >
                        Start Training
                    </button>
                </div>
            )}

            {gameState === 'playing' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-sm text-slate-400">
                            Scenario {currentTask + 1} of {scenarios.length}
                        </div>
                        <div className={`font-mono font-bold ${timeLeft < 10 ? 'text-red-400' : 'text-white'}`}>
                            {timeLeft}s
                        </div>
                        <div className="text-sm text-emerald-400">
                            Score: {score}
                        </div>
                    </div>

                    <div className="bg-red-900/30 border border-red-500/50 p-6 rounded-xl mb-6">
                        <div className="flex items-center gap-3 mb-3">
                            <AlertTriangle className="text-red-400" />
                            <span className="text-sm text-red-300 uppercase font-bold">Emergency Scenario</span>
                        </div>
                        <p className="text-xl text-white font-bold">
                            {scenarios[currentTask].situation}
                        </p>
                    </div>

                    <p className="text-slate-400 text-center mb-4">What is your FIRST priority?</p>

                    <div className="space-y-3">
                        {scenarios[currentTask].options
                            .sort(() => Math.random() - 0.5) // Shuffle
                            .map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleAnswer(opt.priority)}
                                    className="w-full p-4 bg-slate-900 hover:bg-slate-700 border border-slate-700 hover:border-orange-500/50 rounded-xl text-left text-white transition-all"
                                >
                                    {opt.text}
                                </button>
                            ))
                        }
                    </div>
                </div>
            )}

            {gameState === 'results' && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-6">
                        {score >= 25 ? '🏆' : score >= 15 ? '✅' : '📚'}
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">
                        {score >= 25 ? 'Excellent!' : score >= 15 ? 'Good Job!' : 'Keep Practicing'}
                    </h4>
                    <p className="text-4xl font-black text-orange-400 mb-4">{score} points</p>
                    <p className="text-slate-400 mb-6">
                        {score >= 25
                            ? 'You have strong prioritization instincts!'
                            : 'Remember: AVIATE first, then NAVIGATE, then COMMUNICATE'}
                    </p>
                    <button
                        onClick={startGame}
                        className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default HPLWorkload;
