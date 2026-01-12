import React, { useState, useEffect } from 'react';
import { Radio, ArrowDown, ArrowUp, Zap } from 'lucide-react';

const RadioAltimeter: React.FC = () => {
    const [height, setHeight] = useState(2500); // ft
    const [frequency] = useState(4300); // MHz (4.3 GHz standard)
    const [isSimulating, setIsSimulating] = useState(true);

    // Simulation loop for height variation
    useEffect(() => {
        if (!isSimulating) return;
        const interval = setInterval(() => {
            setHeight(h => {
                const noise = Math.random() * 10 - 5;
                let newH = h + noise;
                if (newH < 0) newH = 0;
                if (newH > 5000) newH = 5000;
                return newH;
            });
        }, 100);
        return () => clearInterval(interval);
    }, [isSimulating]);

    // Calculations
    // Time delay = 2 * Height / c
    // Frequency Shift (FMCW): df = Rate * TimeDelay
    const c = 300000000; // m/s
    const heightM = height * 0.3048;
    const timeDelay = (2 * heightM) / c;
    const timeDelayNs = timeDelay * 1e9; // nanoseconds

    // Decision Height (DH) Logic
    const dh = 200;
    const isBelowDh = height < dh;

    // Pulse animation logic
    const pulseDuration = Math.max(0.5, height / 1000); // Slower at altitude for visualization

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-violet-500/20 rounded-xl">
                    <Radio className="w-8 h-8 text-violet-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">
                        Radio <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Altimeter</span>
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Low Range Radio Altimeter (LRRA) principles using FMCW.
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">

                {/* Visualizer */}
                <div className="bg-slate-900 rounded-xl p-8 relative h-[400px] border border-slate-700 overflow-hidden flex flex-col items-center justify-between">

                    {/* Sky/Ground Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-sky-900/30 to-slate-900 z-0"></div>
                    <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-emerald-900/50 to-transparent border-b-4 border-emerald-500/50"></div>

                    {/* Aircraft */}
                    <div className="relative z-10 p-4 bg-slate-800 rounded-lg border border-slate-600 shadow-xl mb-4">
                        <Radio size={32} className="text-violet-400" />

                        {/* Transmit Beam */}
                        <div className="absolute top-full left-1/4 w-0.5 bg-yellow-400/50 animate-pulse origin-top"
                            style={{ height: `${Math.min(300, height / 10)}px`, animationDuration: `${pulseDuration}s` }}>
                            <div className="absolute bottom-0 -left-1.5"><ArrowDown size={12} className="text-yellow-400" /></div>
                        </div>

                        {/* Return Beam */}
                        <div className="absolute top-full right-1/4 w-0.5 bg-green-400/50 animate-pulse origin-bottom"
                            style={{ height: `${Math.min(300, height / 10)}px`, animationDuration: `${pulseDuration}s`, animationDelay: '0.1s' }}>
                            <div className="absolute top-0 -left-1.5"><ArrowUp size={12} className="text-green-400" /></div>
                        </div>
                    </div>

                    {/* Height Indication */}
                    <div className="relative z-10 text-center mt-auto mb-8">
                        <div className="text-6xl font-black font-mono text-white tracking-wider flex items-center justify-center gap-4">
                            {Math.round(height)}
                            <span className="text-lg text-slate-500 font-sans">FT</span>
                        </div>
                        {isBelowDh && (
                            <div className="animate-bounce mt-2 text-yellow-500 font-bold uppercase tracking-widest border border-yellow-500/50 px-3 py-1 rounded inline-block bg-yellow-500/10">
                                DH Reached
                            </div>
                        )}
                    </div>

                    {/* Ground Ref */}
                    <div className="relative z-10 w-full text-center text-xs font-bold text-emerald-500 uppercase tracking-widest">
                        Terrain Surface
                    </div>

                </div>

                {/* Controls & Theory */}
                <div className="space-y-6">
                    <div className="bg-slate-900/50 backdrop-blur p-6 rounded-2xl border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Zap size={20} className="text-yellow-400" /> Operational Range (0 - 2500ft)
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    Simulated Height
                                    <span>{Math.round(height)} ft</span>
                                </label>
                                <input
                                    type="range" min="0" max="5000" step="10"
                                    value={height}
                                    onChange={(e) => {
                                        setIsSimulating(false);
                                        setHeight(Number(e.target.value));
                                    }}
                                    className="w-full accent-violet-500"
                                />
                                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                    <span>0 ft</span>
                                    <span>2500 ft (Limit)</span>
                                    <span>5000 ft</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsSimulating(!isSimulating)}
                                className={`w-full py-2 rounded text-sm font-bold border transition-colors ${isSimulating ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-green-500/20 text-green-400 border-green-500/50'}`}
                            >
                                {isSimulating ? 'Stop Simulation' : 'Auto-Simulate Height'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                            <p className="text-xs text-slate-400 uppercase mb-1">Time Delay</p>
                            <p className="text-xl font-mono font-bold text-white">{timeDelayNs.toFixed(0)} ns</p>
                            <p className="text-[10px] text-slate-500">Round trip time</p>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                            <p className="text-xs text-slate-400 uppercase mb-1">Principle</p>
                            <p className="text-lg font-bold text-violet-400">FMCW</p>
                            <p className="text-[10px] text-slate-500">Frequency Modulated Cont. Wave</p>
                        </div>
                    </div>

                    <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/30 text-sm text-blue-200">
                        <p className="mb-2"><strong>Frequency Shift:</strong> The difference between transmitted and received frequency is proportional to height.</p>
                        <p>For landing approaches (Cat II/III), accurate height above terrain is crucial for flare and decision height logic.</p>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default RadioAltimeter;
