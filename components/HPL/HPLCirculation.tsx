
import React, { useState, useEffect } from 'react';
import { Heart, Activity, Droplet, ArrowRight, Play, Pause } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const HPLCirculation: React.FC = () => {
    const [tab, setTab] = useState<'heart' | 'blood' | 'bp'>('heart');

    return (
        <div className="space-y-6">
            <header className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                        <Heart className="w-6 h-6 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100">Circulation & Cardiac System</h1>
                </div>
                <p className="text-slate-400">
                    The dual-pump system that oxygenates the body. Understanding cardiac output and blood pressure is key to G-Force tolerance.
                </p>
            </header>

            <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg">
                <TabButton active={tab === 'heart'} onClick={() => setTab('heart')} icon={Heart} label="Heart Pump" />
                <TabButton active={tab === 'blood'} onClick={() => setTab('blood')} icon={Droplet} label="Blood Comp" />
                <TabButton active={tab === 'bp'} onClick={() => setTab('bp')} icon={Activity} label="Blood Pressure" />
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 min-h-[400px]">
                {tab === 'heart' && <HeartSim />}
                {tab === 'blood' && <BloodComp />}
                {tab === 'bp' && <BloodPressureSim />}
            </div>
        </div>
    );
};

// --- Sub-components ---

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md transition-all font-medium ${active
            ? 'bg-red-600 text-white shadow-lg shadow-red-900/20'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
    >
        <Icon size={18} />
        {label}
    </button>
);

const HeartSim = () => {
    const [bpm, setBpm] = useState(60);
    const [isPlaying, setIsPlaying] = useState(true);

    const beatDuration = 60 / bpm; // seconds per beat

    return (
        <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-slate-900/50 p-8 rounded-xl border border-slate-700 flex flex-col items-center justify-center min-h-[300px]">
                {/* Animated Heart */}
                <div className="relative">
                    <Heart
                        size={120}
                        className={`text-red-600 filter drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-transform duration-100 ease-out`}
                        style={{
                            animation: isPlaying ? `heartbeat ${beatDuration}s infinite` : 'none',
                        }}
                    />
                    <style>{`
                        @keyframes heartbeat {
                            0% { transform: scale(1); }
                            15% { transform: scale(1.15); }
                            30% { transform: scale(1); }
                            45% { transform: scale(1.15); }
                            60% { transform: scale(1); }
                        }
                    `}</style>
                </div>
                <div className="font-mono text-3xl font-black text-white mt-8">{bpm} <span className="text-sm font-normal text-slate-400">BPM</span></div>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Cardiac Output Controller</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="flex justify-between text-sm text-slate-300 mb-2">
                                Heart Rate
                                <span className={`font-bold ${bpm > 100 ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {bpm < 60 ? 'Bradycardia' : bpm > 100 ? 'Tachycardia' : 'Normal'}
                                </span>
                            </label>
                            <input
                                type="range"
                                min="40"
                                max="180"
                                value={bpm}
                                onChange={(e) => setBpm(Number(e.target.value))}
                                className="w-full h-3 bg-slate-700 rounded-lg accent-red-500"
                            />
                        </div>

                        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/50">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-slate-200">Stroke Volume (SV)</span>
                                <span className="text-xs font-mono text-slate-400">~70ml</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-slate-600 pt-2">
                                <span className="text-sm font-bold text-white">Cardiac Output (Q)</span>
                                <span className="text-xl font-bold text-red-400">{((bpm * 70) / 1000).toFixed(1)} L/min</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm font-bold text-white transition-colors"
                            >
                                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                                {isPlaying ? 'Pause Sim' : 'Resume'}
                            </button>
                            <button onClick={() => setBpm(60)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm text-slate-300">Reset</button>
                            <button onClick={() => setBpm(130)} className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded text-sm border border-red-500/30">Stress</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BloodComp = () => (
    <div className="grid md:grid-cols-3 gap-4 animate-in fade-in">
        <div className="col-span-1 md:col-span-3 mb-4">
            <h3 className="text-xl font-bold text-white mb-2">Blood Composition</h3>
            <p className="text-sm text-slate-400">Select a component to view details.</p>
        </div>

        <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-700 hover:border-red-500 transition-all hover:-translate-y-1 group">
            <Droplet className="text-red-500 mb-4 group-hover:scale-110 transition-transform" size={40} />
            <h4 className="font-bold text-white text-lg">Red Blood Cells</h4>
            <p className="text-xs text-red-300 font-mono mb-3">ERYTHROCYTES</p>
            <p className="text-sm text-slate-300 leading-relaxed">
                The oxygen carriers contains <strong>Haemoglobin</strong> which binds to O2.
                <br /><br />
                <span className="text-xs text-slate-500">Lifespan: 120 days.</span>
            </p>
        </div>

        <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-700 hover:border-slate-300 transition-all hover:-translate-y-1 group">
            <div className="bg-slate-700 w-10 h-10 rounded-full flex items-center justify-center mb-4 group-hover:bg-slate-600 transition-colors">
                <Activity className="text-white" size={24} />
            </div>
            <h4 className="font-bold text-white text-lg">White Blood Cells</h4>
            <p className="text-xs text-slate-400 font-mono mb-3">LEUCOCYTES</p>
            <p className="text-sm text-slate-300 leading-relaxed">
                The defense force. Fights infection and destroys foreign bodies.
                <br /><br />
                <span className="text-xs text-slate-500">Increases during infection.</span>
            </p>
        </div>

        <div className="bg-slate-900/80 p-6 rounded-xl border border-slate-700 hover:border-yellow-500 transition-all hover:-translate-y-1 group">
            <div className="bg-yellow-900/30 w-10 h-10 rounded-full flex items-center justify-center mb-4 border border-yellow-500/30">
                <div className="w-4 h-4 bg-yellow-500 rotate-45"></div>
            </div>
            <h4 className="font-bold text-white text-lg">Platelets</h4>
            <p className="text-xs text-yellow-500/80 font-mono mb-3">THROMBOCYTES</p>
            <p className="text-sm text-slate-300 leading-relaxed">
                The repair crew. Causes clotting (coagulation) to seal wounds.
                <br /><br />
                <span className="text-xs text-slate-500">Small fragments of cells.</span>
            </p>
        </div>
    </div>
);

const BloodPressureSim = () => {
    // Generate dummy BP data
    const data = Array.from({ length: 20 }, (_, i) => ({
        time: i,
        systolic: 120 + Math.sin(i * 0.5) * 5,
        diastolic: 80 + Math.sin(i * 0.5) * 3
    }));

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col items-center justify-center h-48">
                    <div className="font-mono text-6xl font-black text-white flex items-baseline tracking-tight">
                        <span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">120</span>
                        <span className="text-3xl text-slate-600 mx-2">/</span>
                        <span className="text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">80</span>
                    </div>
                    <div className="text-xs font-bold text-slate-500 uppercase mt-2 tracking-widest">Millimeters of Mercury (mmHg)</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-lg">
                        <h4 className="font-bold text-emerald-400">Systolic</h4>
                        <p className="text-xs text-slate-400 mt-1">Peak pressure during contraction (Pumping).</p>
                    </div>
                    <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-lg">
                        <h4 className="font-bold text-blue-400">Diastolic</h4>
                        <p className="text-xs text-slate-400 mt-1">Lowest pressure during relaxation (Filling).</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 min-h-[300px]">
                <h4 className="text-sm font-bold text-white mb-4">Pressure Waveform</h4>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <LineChart data={data}>
                            <XAxis dataKey="time" hide />
                            <YAxis domain={[60, 140]} hide />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                            <ReferenceLine y={120} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Sys', fill: '#10b981', fontSize: 10 }} />
                            <ReferenceLine y={80} stroke="#3b82f6" strokeDasharray="3 3" label={{ value: 'Dia', fill: '#3b82f6', fontSize: 10 }} />
                            <Line type="monotone" dataKey="systolic" stroke="#10b981" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default HPLCirculation;
