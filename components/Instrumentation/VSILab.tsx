import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Zap, Info, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';

const VSILab: React.FC = () => {
    const [targetRate, setTargetRate] = useState(0); // ft/min
    const [standardVSI, setStandardVSI] = useState(0);
    const [ivsi, setIvsi] = useState(0);
    const [isVSIBlocked, setIsVSIBlocked] = useState(false);

    // Simulation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            if (isVSIBlocked) {
                setStandardVSI(prev => prev * 0.95); // Leak to zero
                setIvsi(prev => prev * 0.9);
                return;
            }

            // Standard VSI Lag: Exponential decay towards target
            // Typically takes 6-9 seconds to stabilize
            setStandardVSI(prev => {
                const diff = targetRate - prev;
                return prev + diff * 0.05; // slow response
            });

            // IVSI (Instantaneous): Dashpots provide immediate lead
            // Then it merges back into standard pressure change
            setIvsi(prev => {
                const diff = targetRate - prev;
                return prev + diff * 0.4; // much faster response
            });
        }, 50);

        return () => clearInterval(interval);
    }, [targetRate, isVSIBlocked]);

    const getRotation = (rate: number) => {
        // VSI scales are often non-linear (logarithmic)
        // 0 to 2000 ft/min mapped to approx 170 degrees
        return (rate / 2000) * 170;
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-12">
                <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                    <Activity className="text-indigo-400" />
                    Vertical Speed Indicator (VSI)
                </h1>
                <p className="text-slate-400 max-w-2xl">
                    Standard vs. Instantaneous. Explore why traditional VSIs lag during level-offs and how Dashpots (Inertia Lead) solve the problem.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Control Tower */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                            <Zap className="text-amber-400 w-4 h-4" />
                            Rate Control
                        </h3>

                        <div className="space-y-4">
                            <button
                                onClick={() => setTargetRate(1500)}
                                className={`w-full py-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${targetRate === 1500 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-800/50 border-slate-700 text-slate-400'
                                    }`}
                            >
                                <ChevronUp />
                                <span className="font-bold">Climb 1500 FPM</span>
                            </button>

                            <button
                                onClick={() => setTargetRate(0)}
                                className={`w-full py-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${targetRate === 0 ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-slate-800/50 border-slate-700 text-slate-400'
                                    }`}
                            >
                                <span className="font-bold">Level Flight</span>
                            </button>

                            <button
                                onClick={() => setTargetRate(-1500)}
                                className={`w-full py-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${targetRate === -1500 ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-slate-800/50 border-slate-700 text-slate-400'
                                    }`}
                            >
                                <ChevronDown />
                                <span className="font-bold">Descent 1500 FPM</span>
                            </button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-800">
                            <button
                                onClick={() => setIsVSIBlocked(!isVSIBlocked)}
                                className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${isVSIBlocked ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-slate-800/50 border-slate-700 text-slate-400'
                                    }`}
                            >
                                <span className="text-xs font-bold uppercase tracking-widest">Simulate Blockage</span>
                                <AlertCircle size={16} />
                            </button>
                            {isVSIBlocked && (
                                <p className="text-[10px] text-red-500/70 mt-2 text-center uppercase font-bold">VSI returning to zero...</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-2xl">
                        <h4 className="flex items-center gap-2 text-indigo-400 font-bold mb-2 text-sm uppercase">
                            <Clock className="w-4 h-4" />
                            Lag Breakdown
                        </h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed italic">
                            "Standard VSI measures the change in static pressure. Because of the <strong>Capillary/Metering Unit</strong>, it takes time for the pressure difference to build between the capsule and the case. This is your 6-9 second lag."
                        </p>
                    </div>
                </div>

                {/* Gauges and Comparison */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Standard VSI */}
                            <div className="flex flex-col items-center">
                                <h4 className="text-xs font-black text-slate-500 uppercase mb-8 tracking-widest">Standard VSI</h4>
                                <div className="w-64 h-64 rounded-full border-[10px] border-slate-800 bg-slate-950 shadow-2xl relative flex items-center justify-center">
                                    {/* Dial Marks */}
                                    {[0, 5, 10, 15, 20].map((num) => (
                                        <React.Fragment key={num}>
                                            <div className="absolute inset-4 text-center" style={{ transform: `rotate(${num * 8.5}deg)` }}>
                                                <span className="text-[10px] text-slate-700" style={{ transform: `rotate(-${num * 8.5}deg)` }}>{num}</span>
                                            </div>
                                            <div className="absolute inset-4 text-center" style={{ transform: `rotate(-${num * 8.5}deg)` }}>
                                                <span className="text-[10px] text-slate-700" style={{ transform: `rotate(${num * 8.5}deg)` }}>{num}</span>
                                            </div>
                                        </React.Fragment>
                                    ))}

                                    <motion.div
                                        animate={{ rotate: getRotation(standardVSI) }}
                                        className="absolute w-2 h-24 bg-white origin-bottom bottom-1/2 rounded-full shadow-lg"
                                    />
                                    <div className="w-4 h-4 bg-slate-800 rounded-full z-10"></div>
                                    <div className="absolute bottom-16 text-[8px] text-slate-600 font-black uppercase">Standard Lag</div>
                                </div>
                            </div>

                            {/* IVSI */}
                            <div className="flex flex-col items-center">
                                <h4 className="text-xs font-black text-indigo-400 uppercase mb-8 tracking-widest">Inertial Lead (IVSI)</h4>
                                <div className="w-64 h-64 rounded-full border-[10px] border-slate-800 bg-slate-950 shadow-2xl relative flex items-center justify-center">
                                    <motion.div
                                        animate={{ rotate: getRotation(ivsi) }}
                                        className="absolute w-2 h-24 bg-indigo-400 origin-bottom bottom-1/2 rounded-full shadow-lg shadow-indigo-500/20"
                                    />
                                    <div className="w-4 h-4 bg-slate-800 rounded-full z-10"></div>
                                    <div className="absolute bottom-16 text-[8px] text-indigo-500/50 font-black uppercase">Dashpot Assisted</div>
                                </div>
                            </div>
                        </div>

                        {/* Comparative Graph / Visual Lead Bar */}
                        <div className="mt-16 space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                                <span>Real-time Response</span>
                                <span className="text-white">Target: {targetRate} FPM</span>
                            </div>
                            <div className="h-6 bg-slate-950 rounded-full border border-slate-800 p-1 relative overflow-hidden">
                                <motion.div
                                    animate={{ width: `${Math.abs(standardVSI / 2000) * 100}%`, backgroundColor: standardVSI >= 0 ? '#10b981' : '#f59e0b' }}
                                    className="h-full rounded-full opacity-50 absolute left-0"
                                    style={{ left: targetRate >= 0 ? '50%' : 'auto', right: targetRate < 0 ? '50%' : 'auto' }}
                                />
                                <motion.div
                                    animate={{ width: `${Math.abs(ivsi / 2000) * 100}%`, backgroundColor: ivsi >= 0 ? '#818cf8' : '#6366f1' }}
                                    className="h-full rounded-full absolute left-0"
                                    style={{ left: targetRate >= 0 ? '50%' : 'auto', right: targetRate < 0 ? '50%' : 'auto' }}
                                />
                                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-700"></div>
                            </div>
                            <div className="flex justify-between text-[8px] text-slate-600 uppercase font-black">
                                <span>Descent</span>
                                <span>Level</span>
                                <span>Climb</span>
                            </div>
                        </div>
                    </div>

                    {/* Mechanics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                            <h4 className="flex items-center gap-2 text-white font-bold mb-4">
                                <Info className="text-blue-400 w-4 h-4" />
                                Dashpot Mechanics
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                IVSI uses two <strong>Dashpots (accelerometers)</strong>. When vertical acceleration is felt, they immediately move, creating an artificial pressure change inside the case. This "kicks" the needle before the air catches up.
                            </p>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                            <h4 className="flex items-center gap-2 text-white font-bold mb-4">
                                <AlertCircle className="text-orange-400 w-4 h-4" />
                                IVSI Turning Error
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Beware! In a <strong>steeply banked turn</strong>, centrifugal force can displace the dashpots, creating a false rate of climb/descent even in level flight.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VSILab;
