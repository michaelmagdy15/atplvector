import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Zap, Info, ShieldAlert, Activity, RefreshCw, Anchor } from 'lucide-react';

const MagneticCompass: React.FC = () => {
    const [heading, setHeading] = useState(0);
    const [isAccelerating, setIsAccelerating] = useState(false);
    const [isTurningToNorth, setIsTurningToNorth] = useState(false);
    const [isTurningToSouth, setIsTurningToSouth] = useState(false);

    // Compass Errors Logic
    // ANDS: Accelerate North, Decelerate South (On East/West headings)
    const accelerationError = isAccelerating ? (heading > 45 && heading < 135 ? -20 : (heading > 225 && heading < 315 ? 20 : 0)) : 0;

    // UNOS: Undershoot North, Overshoot South (Turning error)
    const turningError = isTurningToNorth ? -25 : (isTurningToSouth ? 25 : 0);

    const displayedHeading = (heading + accelerationError + turningError + 360) % 360;

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-12">
                <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                    <Compass className="text-yellow-400" />
                    Magnetic Compass Lab
                </h1>
                <p className="text-slate-400 max-w-2xl">
                    The ultimate backup. Master the Direct Reading Compass and its quirky behaviors like Dip, ANDS acceleration errors, and UNOS turning errors.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Simulator Controls */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-sm uppercase">
                            <Anchor className="text-slate-500 w-4 h-4" />
                            Aircraft State
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Magnetic Heading</span>
                                    <span className="text-white font-mono">{heading}°</span>
                                </label>
                                <input
                                    type="range" min="0" max="359"
                                    value={heading}
                                    onChange={(e) => setHeading(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                                />
                                <div className="mt-2 flex justify-between text-[10px] text-slate-500 font-black px-1">
                                    <span>N</span><span>E</span><span>S</span><span>W</span><span>N</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-800 space-y-4">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Physics Engagement</h4>

                                <button
                                    onClick={() => {
                                        setIsAccelerating(!isAccelerating);
                                        setIsTurningToNorth(false);
                                        setIsTurningToSouth(false);
                                    }}
                                    className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${isAccelerating ? 'bg-orange-500/10 border-orange-500/50 text-orange-400' : 'bg-slate-800/50 border-slate-700 text-slate-400'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Activity size={18} />
                                        <span className="font-bold">Accelerate / Decel</span>
                                    </div>
                                    <div className="text-[8px] font-black px-2 py-0.5 bg-slate-900 rounded border border-white/5">ANDS</div>
                                </button>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => {
                                            setIsTurningToNorth(!isTurningToNorth);
                                            setIsTurningToSouth(false);
                                            setIsAccelerating(false);
                                        }}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${isTurningToNorth ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : 'bg-slate-800/50 border-slate-700 text-slate-400'
                                            }`}
                                    >
                                        <RefreshCw size={16} className={isTurningToNorth ? 'animate-spin' : ''} />
                                        <span className="text-[10px] font-black uppercase">Turn to North</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setIsTurningToSouth(!isTurningToSouth);
                                            setIsTurningToNorth(false);
                                            setIsAccelerating(false);
                                        }}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${isTurningToSouth ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-slate-800/50 border-slate-700 text-slate-400'
                                            }`}
                                    >
                                        <RefreshCw size={16} className={isTurningToSouth ? 'animate-spin' : ''} />
                                        <span className="text-[10px] font-black uppercase">Turn to South</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-2xl">
                        <h4 className="text-yellow-400 font-bold mb-2 flex items-center gap-2 text-sm uppercase">
                            <Info size={16} />
                            Memory Aids
                        </h4>
                        <div className="text-xs text-slate-300 space-y-4 leading-relaxed">
                            <p><strong>ANDS:</strong> <strong>A</strong>ccelerate <strong>N</strong>orth, <strong>D</strong>ecelerate <strong>S</strong>outh (Max effect on E/W headings).</p>
                            <p><strong>UNOS:</strong> <strong>U</strong>ndershoot <strong>N</strong>orth, <strong>O</strong>vershoot <strong>S</strong>outh (Northern Hemisphere).</p>
                        </div>
                    </div>
                </div>

                {/* Instrument Side */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 min-h-[450px] flex flex-col items-center justify-center relative overflow-hidden">

                        {/* E2 Type Compass Card */}
                        <div className="w-96 h-28 bg-slate-950 border-[6px] border-slate-800 relative shadow-2xl overflow-hidden rounded-xl flex items-center justify-center">

                            {/* Moving Card Gradient Overlay */}
                            <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-slate-950 via-transparent to-slate-950"></div>

                            {/* The Heading Card */}
                            <motion.div
                                animate={{ x: -((displayedHeading % 360) * 4) }} // 1 degree = 4px
                                className="absolute flex items-end gap-0 h-full pl-[192px]" // Offset so 0 is at center initially
                            >
                                {/* We render the scale twice to handle looping, but here we just render a wide line */}
                                {[...Array(73)].map((_, i) => {
                                    const deg = (i * 5) % 360;
                                    const isBig = deg % 30 === 0;
                                    return (
                                        <div key={i} className="flex flex-col items-center w-20 shrink-0">
                                            {isBig && (
                                                <div className="text-xl font-black text-white mb-2 font-mono">
                                                    {deg === 0 ? 'N' : deg === 90 ? 'E' : deg === 180 ? 'S' : deg === 270 ? 'W' : deg / 10}
                                                </div>
                                            )}
                                            <div className={`w-1 bg-slate-700 ${isBig ? 'h-8' : 'h-4'}`}></div>
                                        </div>
                                    );
                                })}
                            </motion.div>

                            {/* Lubber Line */}
                            <div className="absolute top-0 bottom-0 w-1 bg-yellow-500 z-30 shadow-[0_0_15px_rgba(234,179,8,0.5)]"></div>
                        </div>

                        {/* Truth vs Indication */}
                        <div className="mt-12 w-full max-w-sm flex items-center justify-between">
                            <div className="text-center">
                                <div className="text-[10px] font-black text-slate-500 uppercase mb-1">True Heading</div>
                                <div className="text-4xl font-black text-white font-mono">{heading}°</div>
                            </div>
                            <div className="w-12 h-px bg-slate-800"></div>
                            <div className="text-center">
                                <div className="text-[10px] font-black text-yellow-500 uppercase mb-1">Compass Reads</div>
                                <div className="text-4xl font-black text-yellow-400 font-mono tracking-tighter">
                                    {Math.round(displayedHeading)}°
                                </div>
                            </div>
                        </div>

                        {/* Error Alert Bubble */}
                        <AnimatePresence>
                            {(accelerationError !== 0 || turningError !== 0) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute bottom-8 px-6 py-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-4"
                                >
                                    <ShieldAlert className="text-yellow-400" />
                                    <div className="text-xs text-slate-300">
                                        {accelerationError !== 0 && "Acceleration causes the magnetic mass to lag, causing a dip and false heading change."}
                                        {turningError !== 0 && "Centrifugal force and magnetic dip combine to cause the compass to lag (North) or lead (South)."}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Mechanical Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                            <h4 className="flex items-center gap-2 text-white font-bold mb-4">
                                <Activity className="text-blue-400 w-4 h-4" />
                                Magnetic Dip
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Magnetic flux lines don't run parallel to the surface (except at the Equator). At the poles, they are vertical. To fix this, weight is added to the "South" end of the needle in the NH, which creates the <strong>Acceleration and Turning Errors</strong>.
                            </p>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                            <h4 className="flex items-center gap-2 text-white font-bold mb-4">
                                <RefreshCw className="text-yellow-400 w-4 h-4" />
                                Deviation & Variation
                            </h4>
                            <ul className="text-xs text-slate-400 space-y-2">
                                <li><strong>Variation:</strong> Angle between True North and Magnetic North (isogonals).</li>
                                <li><strong>Deviation:</strong> Errors caused by the aircraft's own magnetic field (iron components). Corrected by "swinging the compass".</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MagneticCompass;
