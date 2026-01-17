
import React, { useState } from 'react';
import { Clock, Sun, Moon, Calendar, AlertCircle } from 'lucide-react';

const FTLCalculator: React.FC = () => {
    const [sectors, setSectors] = useState(2);
    const [reportTime, setReportTime] = useState(600); // 10:00 local changed to decimal minutes for slider but easier to do simple hours for now

    // Simple EASA FTL Table (approximate for demo)
    // Acclimatised, Standard Tbl A
    // Start Time (Local) vs Sectors
    const getMaxFdp = (startHour: number, numSectors: number) => {
        // Simplified Logic based on EASA ORO.FTL.205
        // 0600-1329: 13:00 (1 sector), 13:00 (2), 12:30 (3)...
        let base = 13.0; // 13h for 1-2 sectors in optimal window

        // Time of Day Penalty
        if (startHour < 6) base -= (6 - startHour) * 0.5; // Early starts reduce max FDP
        if (startHour > 13) base -= (startHour - 13) * 0.25; // Late starts reduce slightly

        // Sector Penalty
        if (numSectors === 3) base -= 0.5;
        if (numSectors === 4) base -= 1.5;
        if (numSectors >= 5) base -= 2.25;

        return Math.max(9, Math.min(13, base)); // Clamp between 9 and 13
    };

    const startHour = Math.floor(reportTime / 60);
    const startMin = reportTime % 60;
    const maxFdp = getMaxFdp(startHour, sectors);

    // Calculate end time
    const endMinutes = reportTime + (maxFdp * 60);
    const endHour = Math.floor(endMinutes / 60) % 24;
    const endMin = Math.floor(endMinutes % 60);

    const formatTime = (h: number, m: number) => `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

    return (
        <div className="bg-slate-900 min-h-screen text-slate-100 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-teal-500/20 rounded-xl border border-teal-500/30">
                        <Clock className="text-teal-400 w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Flight Time Limitations</h1>
                        <p className="text-slate-400">EASA ORO.FTL Calculator and Visualizer.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* INPUTS */}
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-8">
                        <div>
                            <label className="block text-sm font-bold text-slate-400 uppercase mb-4">Report Time (Local)</label>
                            <input
                                type="range"
                                min="0" max="1439" step="60"
                                value={reportTime}
                                onChange={(e) => setReportTime(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                            />
                            <div className="mt-3 text-3xl font-black text-white font-mono">{formatTime(startHour, startMin)}</div>
                            <p className="text-xs text-slate-500 mt-1">Start of Flight Duty Period (FDP)</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-400 uppercase mb-4">Number of Sectors</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5, 6].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setSectors(s)}
                                        className={`flex-1 py-3 rounded-lg font-bold border transition-all ${sectors === s ? 'bg-teal-600 border-teal-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 bg-teal-900/20 border border-teal-500/30 rounded-xl">
                            <h3 className="font-bold text-teal-400 mb-2 flex items-center gap-2">
                                <AlertCircle size={16} /> Extension
                            </h3>
                            <p className="text-xs text-slate-300">
                                Max FDP can be extended by up to 1 hour (max 2 sectors) with Commanders Discretion.
                            </p>
                        </div>
                    </div>

                    {/* OUTPUTS */}
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-bl-full"></div>

                        <div className="relative z-10">
                            <h3 className="font-bold text-slate-500 text-sm uppercase mb-6">Calculated Limits</h3>

                            <div className="mb-8">
                                <div className="text-6xl font-black text-white mb-2">{maxFdp.toFixed(2)} <span className="text-2xl text-slate-500">hrs</span></div>
                                <div className="text-teal-400 font-bold uppercase tracking-wider text-sm">Max Daily FDP</div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-slate-950 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase font-bold">Latest on Chocks</div>
                                        <div className="text-2xl font-mono font-bold text-white">{formatTime(endHour, endMin)}</div>
                                    </div>
                                    <Moon className="text-slate-600" />
                                </div>

                                <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
                                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">Rest Requirement</div>
                                    <div className="text-xl font-bold text-white">
                                        {Math.max(10, maxFdp)} Hours
                                        <span className="text-sm font-normal text-slate-500 ml-2">or length of duty</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 text-xs text-slate-500">
                                *Calculation based on EASA ORO.FTL.205 Table A (Acclimatised). Actual limits may vary based on FTL scheme.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline Viz */}
                <div className="mt-8 relative h-16 bg-slate-800 rounded-full overflow-hidden flex items-center border border-slate-700">
                    <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-slate-900 border-r border-slate-700/50 flex items-center justify-center text-xs text-slate-500 font-bold">Rest</div>
                    <div className="absolute left-1/4 top-1 bottom-1 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(20,184,166,0.5)]" style={{ width: '60%' }}>
                        Flight Duty Period ({maxFdp}h)
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FTLCalculator;
