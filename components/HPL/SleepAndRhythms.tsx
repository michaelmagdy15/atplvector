
import React, { useState } from 'react';
import { Moon, Sun, Clock, Zap, Battery, Globe, Plane, Brain, Activity, AlertTriangle, Info, BarChart3 } from 'lucide-react';

const SleepAndRhythms: React.FC = () => {
    const [tab, setTab] = useState<'circadian' | 'sleep' | 'debt' | 'jetlag'>('circadian');

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Moon className="text-indigo-400" />
                        Body Rhythm & Sleep (040.02)
                    </h2>
                    <p className="text-slate-400 text-sm">Circadian rhythms, sleep architecture, debt, and jet lag.</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg overflow-x-auto">
                    <button onClick={() => setTab('circadian')} className={`px-4 py-2 rounded-md font-bold text-sm whitespace-nowrap transition-all ${tab === 'circadian' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Circadian & Temp</button>
                    <button onClick={() => setTab('sleep')} className={`px-4 py-2 rounded-md font-bold text-sm whitespace-nowrap transition-all ${tab === 'sleep' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Sleep Cycle</button>
                    <button onClick={() => setTab('debt')} className={`px-4 py-2 rounded-md font-bold text-sm whitespace-nowrap transition-all ${tab === 'debt' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Sleep Debt</button>
                    <button onClick={() => setTab('jetlag')} className={`px-4 py-2 rounded-md font-bold text-sm whitespace-nowrap transition-all ${tab === 'jetlag' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Jet Lag Calc</button>
                </div>
            </div>

            {tab === 'circadian' && <CircadianGraph />}
            {tab === 'sleep' && <SleepStages />}
            {tab === 'debt' && <SleepDebtCalculator />}
            {tab === 'jetlag' && <JetLagCalc />}
        </div>
    );
};

// 040.02.03.02 Circadian Rhythm & Body Temp
const CircadianGraph = () => {
    const [time, setTime] = useState(14); // 14:00 default

    // Body Temp Curve (Peak ~18:00, Low ~04:00)
    // Formula: Just a visual approximation sine wave shifted
    const getTemp = (t: number) => {
        // Peak at 18 (t-18), Low at 6. 
        // 37.0 avg, +/- 0.5 variation
        return 37.0 + 0.5 * Math.cos((t - 18) * Math.PI / 12);
    };

    // Performance closely follows Body Temp
    const getPerf = (t: number) => {
        // 0-100 scale
        return 75 + 25 * Math.cos((t - 18) * Math.PI / 12);
    };

    const temp = getTemp(time);
    const perf = getPerf(time);

    // WOCL: 02:00 - 06:00
    const isWocl = time >= 2 && time <= 6;

    return (
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 relative overflow-hidden flex flex-col justify-center">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    {/* Background Grid */}
                    <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                </div>

                <div className="z-10 text-center mb-8 relative">
                    <div className="text-6xl font-black text-white mb-2">{time.toString().padStart(2, '0')}:00</div>
                    <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Local Time (24h)</div>

                    {/* Sun/Moon Indicator */}
                    <div className="absolute top-0 right-0 p-2">
                        {time >= 6 && time <= 20 ? <Sun className="text-yellow-400 w-8 h-8 animate-spin-slow" /> : <Moon className="text-blue-300 w-8 h-8" />}
                    </div>
                </div>

                <div className="relative mb-6">
                    <input
                        type="range"
                        min="0"
                        max="24"
                        step="1"
                        value={time}
                        onChange={e => setTime(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mt-2">
                        <span>00:00</span>
                        <span>06:00</span>
                        <span>12:00</span>
                        <span>18:00</span>
                        <span>24:00</span>
                    </div>
                </div>

                {isWocl && (
                    <div className="bg-red-500/20 border border-red-500/50 p-3 rounded-lg flex items-center justify-center gap-2 animate-pulse">
                        <AlertTriangle className="text-red-500 w-5 h-5" />
                        <span className="text-red-400 font-bold text-sm">WOCL (Window of Circadian Low)</span>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Activity className="text-emerald-400" /> Performance vs Body Temp
                    </h3>

                    <div className="space-y-4">
                        {/* Body Temp Bar */}
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-400">Body Temperature</span>
                                <span className="text-emerald-400 font-mono font-bold">{temp.toFixed(2)}°C</span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-500 via-green-500 to-red-500" style={{ width: `${((temp - 36) / 2) * 100}%` }}></div>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1">Normal Range: 36.5°C - 37.5°C. Performance tracks this curve.</p>
                        </div>

                        {/* Performance Bar */}
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-400">Alertness Level</span>
                                <span className={`font-bold ${perf > 80 ? 'text-green-400' : perf < 60 ? 'text-red-400' : 'text-yellow-400'}`}>
                                    {Math.round(perf)}%
                                </span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-300 ${perf > 80 ? 'bg-green-500' : perf < 60 ? 'bg-red-500' : 'bg-yellow-500'}`} style={{ width: `${perf}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                    <h4 className="font-bold text-white text-sm mb-2">Key Concepts (040.02.03)</h4>
                    <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
                        <li><strong>Internal Clock (SCN):</strong> Located in Suprachiasmatic Nucleus. Free-running cycle is ~25 hours.</li>
                        <li><strong>Zeitgebers:</strong> External cues (Light, Meals, Social) reset the clock to 24h.</li>
                        <li><strong>Correlation:</strong> Performance peaks when body temperature peaks (late afternoon).</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

// 040.02.03.02 Sleep Cycle
const SleepStages = () => (
    <div className="animate-in slide-in-from-right-4">
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4">Typical Hypnogram (90 min Cycle)</h3>

                {/* Visual Hypnogram */}
                <div className="relative h-48 w-full border-l border-b border-slate-600 mt-8">
                    {/* Y-Axis Labels */}
                    <div className="absolute -left-8 top-0 text-[10px] text-slate-500">Awake</div>
                    <div className="absolute -left-8 top-[25%] text-[10px] text-slate-500">REM</div>
                    <div className="absolute -left-8 top-[50%] text-[10px] text-slate-500">Light</div>
                    <div className="absolute -left-8 top-[75%] text-[10px] text-slate-500">Deep</div>

                    {/* The Line - Approximate cycle */}
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                        <path
                            d="M0,0 L5,25 L10,50 L15,90 L25,90 L30,50 L35,25 L40,25 L45,50 L50,90 L60,90 L65,25 L75,25 L80,50 L85,0"
                            fill="none"
                            stroke="#6366f1"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                        />
                        {/* REM Highlights */}
                        <rect x="35" y="20" width="5" height="10" className="fill-yellow-400/30" />
                        <rect x="65" y="20" width="10" height="10" className="fill-yellow-400/30" />
                    </svg>

                    {/* X-Axis */}
                    <div className="absolute -bottom-6 w-full flex justify-between text-[10px] text-slate-500">
                        <span>0h</span>
                        <span>1.5h</span>
                        <span>3h</span>
                        <span>4.5h</span>
                        <span>6h</span>
                        <span>7.5h</span>
                    </div>
                </div>

                <div className="flex gap-4 mt-8 justify-center">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                        <span className="text-xs text-slate-300">SWS (Deep Sleep)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <span className="text-xs text-slate-300">REM (Dreaming)</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-500/50">
                    <h4 className="font-bold text-indigo-400 text-sm mb-1 flex items-center gap-2"><Battery size={14} /> SWS (Stages 3/4)</h4>
                    <p className="text-xs text-slate-300 mb-2">Slow Wave Sleep / Deep Sleep</p>
                    <ul className="text-[10px] text-slate-400 list-disc pl-3">
                        <li>Physical restoration & repair.</li>
                        <li>Dominates first half of night.</li>
                        <li>Difficult to wake (High Sleep Inertia).</li>
                    </ul>
                </div>
                <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/50">
                    <h4 className="font-bold text-yellow-400 text-sm mb-1 flex items-center gap-2"><Brain size={14} /> REM (Paradoxical)</h4>
                    <p className="text-xs text-slate-300 mb-2">Rapid Eye Movement</p>
                    <ul className="text-[10px] text-slate-400 list-disc pl-3">
                        <li>Mental restoration & Memory consolidation.</li>
                        <li>Brain active, Body paralyzed (atonia).</li>
                        <li>Dominates second half of night.</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

// 040.02.03.02 Sleep Credit/Debit
const SleepDebtCalculator = () => {
    // 7 Day History
    const [sleepLog, setSleepLog] = useState([8, 8, 7, 6, 5, 6, 8]); // Hours slept
    const REQUIRED = 8;

    // Calculate Debt
    const totalDebt = sleepLog.reduce((acc, val) => acc + (REQUIRED - val), 0);
    const cumulativeStatus = totalDebt <= 0 ? 'Good' : totalDebt < 5 ? 'Reduced' : 'DANGER';

    const updateLog = (idx: number, val: number) => {
        const newLog = [...sleepLog];
        newLog[idx] = val;
        setSleepLog(newLog);
    };

    return (
        <div className="animate-in slide-in-from-right-4">
            <h3 className="font-bold text-white mb-6">Cumulative Sleep Debt</h3>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-sm font-bold text-slate-400 uppercase">Weekly Sleep Log</span>
                        <div className={`px-3 py-1 rounded text-xs font-bold ${totalDebt > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                            Net Debt: {totalDebt > 0 ? `-${totalDebt} hrs` : 'None'}
                        </div>
                    </div>

                    <div className="flex justify-between items-end h-32 mb-4 gap-2">
                        {sleepLog.map((hours, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end items-center group relative">
                                <div
                                    className={`w-full rounded-t transition-all duration-300 ${hours >= 8 ? 'bg-emerald-500' : hours >= 6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                    style={{ height: `${(hours / 10) * 100}%` }}
                                ></div>
                                <span className="text-[10px] text-slate-500 mt-2">D{i + 1}</span>
                                {/* Slider Popup */}
                                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 p-2 rounded shadow-xl border border-slate-600 z-10 w-32">
                                    <p className="text-center text-xs text-white mb-1">{hours} hours</p>
                                    <input
                                        type="range" min="0" max="12" step="1"
                                        value={hours}
                                        onChange={(e) => updateLog(i, Number(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-dashed border-slate-600 pt-2 text-center text-[10px] text-slate-500">
                        Target: 8 Hours / Night
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Battery Visual */}
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col items-center">
                        <Battery
                            size={64}
                            className={`mb-2 ${cumulativeStatus === 'Good' ? 'text-green-500' : cumulativeStatus === 'Reduced' ? 'text-yellow-500' : 'text-red-500'}`}
                        />
                        <h4 className="text-xl font-bold text-white mb-1">Performance Capacity</h4>
                        <p className={`text-sm font-bold ${cumulativeStatus === 'Good' ? 'text-green-400' : cumulativeStatus === 'Reduced' ? 'text-yellow-400' : 'text-red-400'}`}>
                            {cumulativeStatus.toUpperCase()}
                        </p>

                        <div className="mt-4 w-full text-left space-y-2">
                            {totalDebt > 2 && (
                                <div className="flex items-center gap-2 text-xs text-red-300 bg-red-900/10 p-2 rounded">
                                    <AlertTriangle size={12} /> Microsleep risk increased
                                </div>
                            )}
                            {totalDebt > 5 && (
                                <div className="flex items-center gap-2 text-xs text-red-300 bg-red-900/10 p-2 rounded">
                                    <AlertTriangle size={12} /> Cognitive function impaired (Alcohol equiv &gt; 0.05%)
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-800 p-4 rounded text-xs text-slate-400">
                        <strong>Rule of Thumb:</strong> Sleep debt is cumulative. It generally takes 2 consecutive nights of unrestricted sleep to fully recover from a chronic sleep debt.
                    </div>
                </div>
            </div>
        </div>
    );
};

// 040.02.03.02 Jet Lag Formula
const JetLagCalc = () => {
    const [direction, setDirection] = useState<'EAST' | 'WEST'>('EAST');
    const [zones, setZones] = useState(6);

    // EASA Rule of Thumb / ICAO
    // West: Days = Zones / 1.5
    // East: Days = Zones / 1 (Slower recovery)
    const recoveryDays = direction === 'WEST' ? zones / 1.5 : zones;

    return (
        <div className="animate-in slide-in-from-right-4">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 flex flex-col items-center">
                <h3 className="font-bold text-white mb-6">Jet Lag Recovery Calculator</h3>

                <div className="flex items-center gap-8 mb-8 w-full max-w-md">
                    <div className="flex-1">
                        <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Flight Direction</label>
                        <div className="flex gap-2">
                            <button onClick={() => setDirection('WEST')} className={`flex-1 py-2 rounded text-xs font-bold ${direction === 'WEST' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'}`}>WEST</button>
                            <button onClick={() => setDirection('EAST')} className={`flex-1 py-2 rounded text-xs font-bold ${direction === 'EAST' ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'}`}>EAST</button>
                        </div>
                    </div>

                    <div className="flex-1">
                        <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Time Zones Crossed</label>
                        <div className="flex items-center gap-3">
                            <input type="range" min="1" max="12" value={zones} onChange={e => setZones(Number(e.target.value))} className="w-full" />
                            <span className="font-mono font-bold text-white w-6">{zones}</span>
                        </div>
                    </div>
                </div>

                <div className="relative w-48 h-48 flex items-center justify-center bg-slate-800 rounded-full border-4 border-slate-700 mb-6">
                    <Globe size={80} className="text-slate-600 opacity-50" />
                    <Plane
                        size={32}
                        className={`absolute text-white transition-all duration-500 ${direction === 'EAST' ? 'rotate-45 translate-x-12 -translate-y-12' : '-rotate-45 -translate-x-12 -translate-y-12'}`}
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-4xl text-white drop-shadow-lg">
                        {recoveryDays.toFixed(1)} <span className="text-xs font-normal block">DAYS</span>
                    </div>
                </div>

                <div className="bg-slate-800 p-4 rounded-lg w-full max-w-lg text-center">
                    <p className="text-sm text-slate-300 font-bold mb-2">Formula Applied</p>
                    <div className="flex justify-around text-xs font-mono text-slate-400">
                        <div className={direction === 'WEST' ? 'text-sky-400 font-bold' : ''}>
                            WEST: Zones / 1.5
                        </div>
                        <div className={direction === 'EAST' ? 'text-orange-400 font-bold' : ''}>
                            EAST: Zones / 1.0
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3 italic">
                        "West is Best (Easier), East is Least (Harder)" due to the body clock's natural tendency to lengthen (free-run &gt; 24h).
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SleepAndRhythms;
