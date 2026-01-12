import React, { useState, useEffect, useRef } from 'react';
import { View } from '../../types';
import { ArrowLeft, Signal, Radio, AlertTriangle, Zap, Clock, Target, Compass, Info, CheckCircle, XCircle, TrendingDown } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const MLS: React.FC<Props> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState('STATUS');

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6 pb-20">
            <div className="flex items-center space-x-4 mb-6">
                <button onClick={() => onNavigate?.(View.RAD_NAV_HOME)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                        <Signal className="text-purple-400" size={32} />
                        Microwave Landing System (MLS)
                    </h1>
                    <p className="text-slate-400 mt-1">Advanced precision approach using time-reference scanning beams.</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 p-1 bg-slate-900/80 rounded-xl backdrop-blur-sm border border-slate-800 sticky top-4 z-50">
                {[
                    { id: 'STATUS', label: 'Status & History', icon: <TrendingDown size={18} /> },
                    { id: 'FREQUENCY', label: 'Frequency & Signals', icon: <Radio size={18} /> },
                    { id: 'TRSB', label: 'TRSB Principles', icon: <Target size={18} /> },
                    { id: 'COVERAGE', label: 'Coverage & DME-P', icon: <Compass size={18} /> },
                    { id: 'ERRORS', label: 'Errors & Blanking', icon: <AlertTriangle size={18} /> },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
                        {tab.icon}{tab.label}
                    </button>
                ))}
            </div>

            <div className="min-h-[600px]">
                {activeTab === 'STATUS' && <StatusSection />}
                {activeTab === 'FREQUENCY' && <FrequencySection />}
                {activeTab === 'TRSB' && <TRSBSection />}
                {activeTab === 'COVERAGE' && <CoverageSection />}
                {activeTab === 'ERRORS' && <ErrorsSection />}
            </div>
        </div>
    );
};

const StatusSection = () => {
    const [year, setYear] = useState(1990);
    const timeline = [
        { year: 1978, event: "MLS development begins", type: "mls" },
        { year: 1988, event: "MLS approved by ICAO", type: "mls" },
        { year: 1995, event: "GPS becomes fully operational", type: "gps" },
        { year: 2000, event: "GPS SA disabled, accuracy improves", type: "gps" },
        { year: 2010, event: "GBAS/GLS approaches widespread", type: "gps" },
        { year: 2020, event: "MLS largely obsolete", type: "decline" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                    <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2"><Clock size={20} /> Timeline</h3>
                    <input type="range" min="1978" max="2025" value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg accent-purple-500 mb-2" />
                    <div className="text-center font-mono text-2xl text-purple-400 mb-4">{year}</div>
                    <div className="space-y-2 max-h-56 overflow-y-auto">
                        {timeline.filter(t => t.year <= year).map((t, i) => (
                            <div key={i} className={`p-3 rounded-lg border-l-4 ${t.type === 'mls' ? 'bg-purple-900/20 border-purple-500' : t.type === 'gps' ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
                                <div className="flex justify-between"><span className="font-bold text-white">{t.year}</span><span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300">{t.type.toUpperCase()}</span></div>
                                <p className="text-slate-300 text-sm mt-1">{t.event}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">Why MLS Failed</h3>
                    <div className="space-y-4">
                        <div className="bg-slate-800 p-4 rounded-xl">
                            <h4 className="font-bold text-red-400 mb-3 flex items-center gap-2"><XCircle size={18} /> High Infrastructure Cost</h4>
                            <div className="relative h-8 bg-slate-700 rounded-full overflow-hidden mb-2">
                                <div className="absolute inset-y-0 left-0 bg-red-500 rounded-full" style={{ width: '85%' }}></div>
                                <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">MLS: ~$5M per runway</span>
                            </div>
                            <div className="relative h-8 bg-slate-700 rounded-full overflow-hidden">
                                <div className="absolute inset-y-0 left-0 bg-green-500 rounded-full" style={{ width: '15%' }}></div>
                                <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">GPS: No ground aids</span>
                            </div>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl">
                            <h4 className="font-bold text-orange-400 mb-2 flex items-center gap-2"><AlertTriangle size={18} /> Bad Timing</h4>
                            <p className="text-slate-300 text-sm">GPS became operational just as MLS investment was needed. Airlines chose GPS-based approaches instead.</p>
                        </div>
                        <div className="bg-green-900/20 p-4 rounded-xl border border-green-500/20">
                            <h4 className="font-bold text-green-400 mb-2 flex items-center gap-2"><CheckCircle size={18} /> GPS Advantages</h4>
                            <ul className="text-sm text-slate-300 space-y-1">
                                <li>• No airport ground infrastructure</li>
                                <li>• Global coverage from satellites</li>
                                <li>• Lower maintenance costs</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FrequencySection = () => {
    const [showMultiplex, setShowMultiplex] = useState(false);
    const [timeSlot, setTimeSlot] = useState(0);

    useEffect(() => {
        if (showMultiplex) {
            const interval = setInterval(() => setTimeSlot(prev => (prev + 1) % 4), 800);
            return () => clearInterval(interval);
        }
    }, [showMultiplex]);

    const slots = [{ name: "Azimuth TO", color: "bg-sky-500" }, { name: "Azimuth FRO", color: "bg-sky-400" }, { name: "Elevation TO", color: "bg-amber-500" }, { name: "Elevation FRO", color: "bg-amber-400" }];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                    <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2"><Zap size={20} /> SHF Band (3-30 GHz)</h3>
                    <div className="bg-slate-800 p-4 rounded-xl mb-4">
                        <div className="flex justify-between text-sm text-slate-400 mb-2"><span>3 GHz</span><span>30 GHz</span></div>
                        <div className="relative h-10 bg-gradient-to-r from-indigo-900 via-purple-600 to-pink-900 rounded-lg">
                            <div className="absolute inset-y-0 bg-purple-400/50 border-x-2 border-purple-300 flex items-center justify-center" style={{ left: '7%', width: '3%' }}>
                                <div className="absolute -top-6 whitespace-nowrap text-xs text-purple-300 font-bold">5031-5090 MHz</div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-slate-800 p-3 rounded-lg"><div className="text-2xl font-mono text-purple-400">~5 GHz</div><div className="text-xs text-slate-400">Frequency</div></div>
                        <div className="bg-slate-800 p-3 rounded-lg"><div className="text-2xl font-mono text-purple-400">200</div><div className="text-xs text-slate-400">Channels</div></div>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                    <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2"><Signal size={20} /> Time Division Multiplexing</h3>
                    <p className="text-slate-300 mb-4 text-sm">Azimuth and elevation share the <strong>same frequency</strong> via time slots.</p>
                    <button onClick={() => setShowMultiplex(!showMultiplex)} className={`w-full py-3 rounded-xl font-bold transition-all ${showMultiplex ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                        {showMultiplex ? 'Stop Animation' : 'Start Demo'}
                    </button>
                    <div className="mt-4 space-y-2">
                        {slots.map((slot, i) => (
                            <div key={i} className={`p-3 rounded-lg transition-all ${timeSlot === i && showMultiplex ? `${slot.color} text-white scale-105 shadow-lg` : 'bg-slate-800 text-slate-400'}`}>
                                <div className="flex justify-between"><span className="font-bold">{slot.name}</span><span className="text-xs">Slot {i + 1}</span></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TRSBSection = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [aircraftPos, setAircraftPos] = useState(0.3);
    const [isRunning, setIsRunning] = useState(true);
    const sweepRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animId: number;
        const render = () => {
            const w = canvas.width, h = canvas.height;
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = '#1e293b'; ctx.fillRect(0, h - 30, w, 30);
            ctx.fillStyle = '#475569'; ctx.fillRect(w / 2 - 15, h - 30, 30, 30);
            ctx.fillStyle = '#a855f7'; ctx.beginPath(); ctx.arc(w / 2, h - 35, 8, 0, Math.PI * 2); ctx.fill();

            if (isRunning) sweepRef.current = (sweepRef.current + 3) % 360;
            const sweepAngle = Math.sin(sweepRef.current * Math.PI / 180) * 40;
            const beamLen = h - 80, bx = w / 2, by = h - 40;

            ctx.fillStyle = 'rgba(168, 85, 247, 0.3)';
            ctx.beginPath(); ctx.moveTo(bx, by);
            const angleRad = (sweepAngle - 90) * Math.PI / 180;
            ctx.lineTo(bx + beamLen * Math.cos(angleRad - 0.08), by + beamLen * Math.sin(angleRad - 0.08));
            ctx.lineTo(bx + beamLen * Math.cos(angleRad + 0.08), by + beamLen * Math.sin(angleRad + 0.08));
            ctx.closePath(); ctx.fill();

            ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)'; ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(bx, by);
            ctx.lineTo(bx + beamLen * Math.cos((-40 - 90) * Math.PI / 180), by + beamLen * Math.sin((-40 - 90) * Math.PI / 180));
            ctx.moveTo(bx, by);
            ctx.lineTo(bx + beamLen * Math.cos((40 - 90) * Math.PI / 180), by + beamLen * Math.sin((40 - 90) * Math.PI / 180));
            ctx.stroke(); ctx.setLineDash([]);

            const acAngle = (aircraftPos - 0.5) * 80 - 90, acDist = beamLen * 0.7;
            const acX = bx + acDist * Math.cos(acAngle * Math.PI / 180);
            const acY = by + acDist * Math.sin(acAngle * Math.PI / 180);
            ctx.font = '24px sans-serif'; ctx.fillText("✈️", acX - 12, acY + 8);

            if (Math.abs(sweepAngle - (aircraftPos - 0.5) * 80) < 5) {
                ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(acX, acY - 20, 6, 0, Math.PI * 2); ctx.fill();
            }
            animId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(animId);
    }, [isRunning, aircraftPos]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">Time Reference Scanning Beam</h2>
                    <p className="text-slate-300">Unlike ILS overlapping lobes, MLS uses a <strong>single beam that scans back and forth</strong>.</p>
                    <div className="bg-slate-800 p-4 rounded-xl border-l-4 border-purple-500">
                        <h4 className="font-bold text-purple-400 mb-2">Position Calculation</h4>
                        <p className="text-sm text-slate-400">The receiver measures the <strong>time interval</strong> between TO and FRO sweeps. Shorter gap = near one edge; longer gap = near other edge.</p>
                    </div>
                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">
                        <label className="block text-sm font-semibold text-slate-300 mb-3">Aircraft Position</label>
                        <input type="range" min="0.1" max="0.9" step="0.01" value={aircraftPos} onChange={(e) => setAircraftPos(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg accent-purple-500" />
                        <div className="flex justify-between text-xs text-slate-500 mt-2"><span>-40°</span><span>0°</span><span>+40°</span></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800 p-4 rounded-xl text-center"><div className="text-2xl font-mono text-purple-400">{((aircraftPos - 0.5) * 80).toFixed(1)}°</div><div className="text-xs text-slate-400">Angular Position</div></div>
                        <div className="bg-slate-800 p-4 rounded-xl text-center"><div className="text-2xl font-mono text-amber-400">{(Math.abs(aircraftPos - 0.5) * 200).toFixed(0)}%</div><div className="text-xs text-slate-400">Time Gap</div></div>
                    </div>
                    <button onClick={() => setIsRunning(!isRunning)} className={`w-full py-3 rounded-xl font-bold ${isRunning ? 'bg-red-600' : 'bg-green-600'} text-white`}>{isRunning ? 'Pause' : 'Resume'}</button>
                </div>
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 flex items-center justify-center">
                    <canvas ref={canvasRef} width={500} height={400} className="rounded-lg" />
                </div>
            </div>
        </div>
    );
};

const CoverageSection = () => {
    const [showCurved, setShowCurved] = useState(false);
    const [hasDMEP, setHasDMEP] = useState(true);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">Coverage Volumes</h3>
                    <div className="space-y-4">
                        <div className="bg-slate-800 p-4 rounded-xl">
                            <div className="flex items-center gap-3 mb-3"><div className="w-3 h-3 bg-sky-500 rounded-full"></div><span className="font-bold text-white">Azimuth</span></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-700 p-3 rounded-lg text-center"><div className="text-xl font-mono text-sky-400">±40°</div><div className="text-xs text-slate-400">Width</div></div>
                                <div className="bg-slate-700 p-3 rounded-lg text-center"><div className="text-xl font-mono text-sky-400">20 NM</div><div className="text-xs text-slate-400">Range</div></div>
                            </div>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl">
                            <div className="flex items-center gap-3 mb-3"><div className="w-3 h-3 bg-amber-500 rounded-full"></div><span className="font-bold text-white">Elevation</span></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-700 p-3 rounded-lg text-center"><div className="text-xl font-mono text-amber-400">0.9°-20°</div><div className="text-xs text-slate-400">Vertical</div></div>
                                <div className="bg-slate-700 p-3 rounded-lg text-center"><div className="text-xl font-mono text-amber-400">20 NM</div><div className="text-xs text-slate-400">Range</div></div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 bg-slate-950 p-4 rounded-xl h-40 relative overflow-hidden">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 120">
                            <defs><linearGradient id="wg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#a855f7" stopOpacity="0.1" /><stop offset="50%" stopColor="#a855f7" stopOpacity="0.3" /><stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" /></linearGradient></defs>
                            <path d="M 100 110 L 30 20 L 170 20 Z" fill="url(#wg)" stroke="#a855f7" strokeWidth="1" />
                            <text x="100" y="55" textAnchor="middle" fill="#a855f7" fontSize="10">3D Coverage Wedge</text>
                        </svg>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">DME-P & Curved Approaches</h3>
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-white">DME-P (Precision)</span>
                            <button onClick={() => setHasDMEP(!hasDMEP)} className={`px-4 py-2 rounded-lg font-bold text-sm ${hasDMEP ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-400'}`}>{hasDMEP ? 'Enabled' : 'Disabled'}</button>
                        </div>
                        <div className={`p-4 rounded-xl ${hasDMEP ? 'bg-green-900/20 border border-green-500/20' : 'bg-slate-800'}`}>
                            <div className="flex items-center gap-2 mb-2"><Target size={18} className={hasDMEP ? 'text-green-400' : 'text-slate-400'} /><span className={`font-mono text-lg ${hasDMEP ? 'text-green-400' : 'text-slate-400'}`}>±{hasDMEP ? '100' : '1000'} feet</span></div>
                            <p className="text-sm text-slate-300">{hasDMEP ? 'Precision distance for curved approaches.' : 'Without DME-P, limited to straight-in approaches.'}</p>
                        </div>
                    </div>
                    <button onClick={() => setShowCurved(!showCurved)} className={`w-full py-3 rounded-xl font-bold mb-4 ${showCurved ? 'bg-purple-600' : 'bg-slate-700 hover:bg-slate-600'} text-white`}>{showCurved ? 'Show Straight' : 'Show Curved'}</button>
                    <div className="bg-slate-950 p-4 rounded-xl h-40 relative overflow-hidden">
                        <div className="absolute bottom-4 right-4 w-10 h-2 bg-slate-600"></div>
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 120">
                            {showCurved && hasDMEP ? (
                                <><path d="M 60 100 L 80 50 L 100 100 Z" fill="#475569" /><path d="M 20 30 Q 60 30 100 60 Q 140 90 180 100" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="5,3" /><text x="100" y="20" textAnchor="middle" fill="#22c55e" fontSize="9">Curved Approach</text></>
                            ) : (
                                <><line x1="20" y1="30" x2="180" y2="100" stroke="#3b82f6" strokeWidth="3" strokeDasharray="5,3" /><text x="100" y="55" textAnchor="middle" fill="#3b82f6" fontSize="9">Straight-In</text></>
                            )}
                            <text x="25" y="28" fill="#fff" fontSize="12">✈️</text>
                        </svg>
                        {showCurved && !hasDMEP && <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center"><div className="text-red-400 font-bold text-center text-sm"><AlertTriangle size={24} className="mx-auto mb-1" />DME-P Required</div></div>}
                    </div>
                </div>
            </div>
            <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20">
                <h4 className="font-bold text-blue-300 mb-2">MLS vs ILS</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div><span className="text-slate-400">ILS:</span> <span className="text-white">Fixed straight-line beam</span></div>
                    <div><span className="text-slate-400">MLS:</span> <span className="text-white">3D wedge, selectable glideslope, curved paths</span></div>
                </div>
            </div>
        </div>
    );
};

const ErrorsSection = () => {
    const [blankingActive, setBlankingActive] = useState(false);
    const [sweepPos, setSweepPos] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setSweepPos(prev => (prev + 1) % 100), 50);
        return () => clearInterval(interval);
    }, []);

    const obstacleRange = { start: 35, end: 55 };
    const isOverObstacle = sweepPos >= obstacleRange.start && sweepPos <= obstacleRange.end;
    const signalOn = blankingActive ? !isOverObstacle : true;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                    <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2"><AlertTriangle size={20} /> Multipath Errors</h3>
                    <p className="text-slate-300 mb-4 text-sm">Signals can reflect off vehicles, buildings, or terrain.</p>
                    <div className="bg-slate-950 p-4 rounded-xl h-44 relative overflow-hidden">
                        <div className="absolute bottom-4 left-4 w-4 h-8 bg-purple-500 rounded"></div>
                        <svg className="absolute inset-0 w-full h-full">
                            <line x1="30" y1="140" x2="180" y2="50" stroke="#22c55e" strokeWidth="2" />
                            <text x="100" y="80" fill="#22c55e" fontSize="9">Direct</text>
                            <path d="M 30 140 L 120 160 L 180 50" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,4" />
                            <text x="120" y="150" fill="#ef4444" fontSize="8">Reflected</text>
                        </svg>
                        <div className="absolute bottom-0 left-16 right-16 h-3 bg-orange-900/50 border-t border-orange-500"></div>
                        <div className="absolute top-10 right-6 text-xl">✈️</div>
                    </div>
                    <div className="mt-4 p-3 bg-red-900/20 rounded-lg border border-red-500/20 text-sm text-red-200">
                        <strong>Protection Required:</strong> Critical areas must be kept clear.
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                    <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2"><Zap size={20} /> Signal Blanking</h3>
                    <p className="text-slate-300 mb-4 text-sm">MLS can <strong>switch off</strong> the signal over known obstacles to prevent reflections.</p>
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-bold text-white">Blanking</span>
                        <button onClick={() => setBlankingActive(!blankingActive)} className={`px-4 py-2 rounded-lg font-bold text-sm ${blankingActive ? 'bg-green-600' : 'bg-red-600'} text-white`}>{blankingActive ? 'Active' : 'Inactive'}</button>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl h-44 relative overflow-hidden">
                        <div className={`absolute bottom-16 h-28 w-1 transition-colors ${signalOn ? 'bg-purple-500 shadow-[0_0_10px_#a855f7]' : 'bg-slate-700'}`} style={{ left: `${sweepPos}%` }}></div>
                        <div className="absolute bottom-0 bg-slate-600" style={{ left: `${obstacleRange.start}%`, width: `${obstacleRange.end - obstacleRange.start}%`, height: '60px', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
                        <div className="absolute text-xs text-slate-400" style={{ left: `${(obstacleRange.start + obstacleRange.end) / 2}%`, bottom: '65px', transform: 'translateX(-50%)' }}>Mountain</div>
                        <div className="absolute bottom-0 left-0 w-3 h-5 bg-purple-500 rounded-t"></div>
                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${signalOn ? 'bg-green-500' : 'bg-red-500'} text-white`}>Signal: {signalOn ? 'ON' : 'BLANKED'}</div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl">
                <h3 className="font-bold text-white mb-4">Key Takeaways</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-slate-700 p-4 rounded-lg"><div className="text-purple-400 font-bold mb-1">SHF Band</div><p className="text-sm text-slate-300">5031-5090 MHz</p></div>
                    <div className="bg-slate-700 p-4 rounded-lg"><div className="text-purple-400 font-bold mb-1">Coverage</div><p className="text-sm text-slate-300">±40° az, 0.9°-20° el, 20 NM</p></div>
                    <div className="bg-slate-700 p-4 rounded-lg"><div className="text-purple-400 font-bold mb-1">DME-P</div><p className="text-sm text-slate-300">±100 ft (for curved)</p></div>
                </div>
            </div>
        </div>
    );
};

export default MLS;
