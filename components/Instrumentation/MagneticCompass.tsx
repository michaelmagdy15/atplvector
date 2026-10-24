import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Zap, Info, ShieldAlert, Activity, RefreshCw, Anchor, ArrowRight, RotateCw, RotateCcw } from 'lucide-react';

const MagneticCompass: React.FC = () => {
    const [heading, setHeading] = useState(90); // 090 = East
    const [accelState, setAccelState] = useState<'CONSTANT' | 'ACCEL' | 'DECEL'>('CONSTANT');
    const [turnState, setTurnState] = useState<'NONE' | 'LEFT' | 'RIGHT'>('NONE');
    const [hemisphere, setHemisphere] = useState<'NORTH' | 'SOUTH'>('NORTH');

    // 1. ANDS Acceleration Error Logic
    // Max on East (090°) and West (270°). Zero on North (000°) and South (180°).
    // Northern Hemisphere:
    // Accelerate on East: Weight lags back => compass tilts => dip pulls North => card rotates towards NORTH
    // Decelerate on East: Weight swings forward => card rotates towards SOUTH
    const isEastWestHeading = Math.abs(Math.sin((heading * Math.PI) / 180)); // 1.0 at 90/270, 0.0 at 0/180
    let accelerationError = 0;
    if (accelState === 'ACCEL') {
        accelerationError = hemisphere === 'NORTH' ? -25 * isEastWestHeading : 25 * isEastWestHeading;
    } else if (accelState === 'DECEL') {
        accelerationError = hemisphere === 'NORTH' ? 25 * isEastWestHeading : -25 * isEastWestHeading;
    }

    // 2. UNOS Turning Error Logic
    // Max when turning through North (000°) or South (180°). Zero when turning through East/West.
    // Northern Hemisphere:
    // Turning through North: Liquid swirl and magnetic dip cause compass to LAG behind actual turn.
    // Must roll out before indicated North (Undershoot North).
    // Turning through South: Compass LEADS ahead of actual turn.
    // Must roll out past indicated South (Overshoot South).
    const isNorthSouthHeading = Math.abs(Math.cos((heading * Math.PI) / 180)); // 1.0 at 0/180, 0.0 at 90/270
    let turningError = 0;
    if (turnState === 'RIGHT') {
        // Turning clockwise
        if (heading < 90 || heading > 270) {
            // Turning through North => Lags behind turn (indicates less heading)
            turningError = hemisphere === 'NORTH' ? -30 * isNorthSouthHeading : 30 * isNorthSouthHeading;
        } else {
            // Turning through South => Leads ahead of turn (indicates higher heading)
            turningError = hemisphere === 'NORTH' ? 30 * isNorthSouthHeading : -30 * isNorthSouthHeading;
        }
    } else if (turnState === 'LEFT') {
        // Turning counter-clockwise
        if (heading < 90 || heading > 270) {
            turningError = hemisphere === 'NORTH' ? 30 * isNorthSouthHeading : -30 * isNorthSouthHeading;
        } else {
            turningError = hemisphere === 'NORTH' ? -30 * isNorthSouthHeading : 30 * isNorthSouthHeading;
        }
    }

    const totalError = accelerationError + turningError;
    const displayedHeading = (heading + totalError + 360) % 360;

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-10">
                <div className="flex items-center gap-2 text-xs font-bold text-yellow-400 uppercase tracking-widest mb-2">
                    <span>AGK 022</span>
                    <span>•</span>
                    <span>Terrestrial Magnetism & Direct-Reading Compass</span>
                </div>
                <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                    <Compass className="text-yellow-400" />
                    Magnetic Compass Acceleration & Turning Errors
                </h1>
                <p className="text-slate-400 max-w-3xl leading-relaxed text-sm">
                    The direct-reading magnetic compass is the autonomous backup for all heading systems.
                    Because the magnetic needle is pendulously suspended and counterweighted to offset terrestrial <strong className="text-white">Magnetic Dip</strong>,
                    aircraft accelerations and turns induce apparent heading errors: <span className="text-yellow-400 font-bold">ANDS</span> and <span className="text-yellow-400 font-bold">UNOS</span>.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Flight Controls */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl">
                        <h3 className="text-white font-bold mb-5 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Anchor className="text-slate-400 w-4 h-4" />
                            Aircraft Heading & Dynamics
                        </h3>

                        <div className="space-y-6">
                            {/* Heading Slider */}
                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Real Aircraft Heading</span>
                                    <span className="text-white font-mono font-bold">{heading.toString().padStart(3, '0')}°</span>
                                </label>
                                <input
                                    type="range" min="0" max="359"
                                    value={heading}
                                    onChange={(e) => setHeading(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                                />
                                <div className="mt-2 flex justify-between text-[10px] text-slate-500 font-bold font-mono px-1">
                                    <span>N (000°)</span>
                                    <span>E (090°)</span>
                                    <span>S (180°)</span>
                                    <span>W (270°)</span>
                                </div>
                            </div>

                            {/* Preset Cardinal Buttons */}
                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    { label: 'North', val: 0 },
                                    { label: 'East', val: 90 },
                                    { label: 'South', val: 180 },
                                    { label: 'West', val: 270 }
                                ].map((card) => (
                                    <button
                                        key={card.label}
                                        onClick={() => setHeading(card.val)}
                                        className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                                            heading === card.val ? 'bg-yellow-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        {card.label}
                                    </button>
                                ))}
                            </div>

                            {/* Hemisphere Toggle */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                                <span className="text-xs font-bold text-slate-400 uppercase">Hemisphere</span>
                                <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                                    <button
                                        onClick={() => setHemisphere('NORTH')}
                                        className={`px-3 py-1 rounded text-xs font-bold ${hemisphere === 'NORTH' ? 'bg-yellow-500 text-slate-950' : 'text-slate-400'}`}
                                    >
                                        Northern (EASA)
                                    </button>
                                    <button
                                        onClick={() => setHemisphere('SOUTH')}
                                        className={`px-3 py-1 rounded text-xs font-bold ${hemisphere === 'SOUTH' ? 'bg-yellow-500 text-slate-950' : 'text-slate-400'}`}
                                    >
                                        Southern
                                    </button>
                                </div>
                            </div>

                            {/* Acceleration State */}
                            <div className="space-y-2 pt-2 border-t border-slate-800">
                                <span className="text-xs font-bold text-slate-400 uppercase block">Linear Speed Action (ANDS)</span>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => {
                                            setAccelState('ACCEL');
                                            setTurnState('NONE');
                                        }}
                                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                                            accelState === 'ACCEL' ? 'bg-orange-500/20 border-orange-500 text-orange-300' : 'bg-slate-800/40 border-slate-700 text-slate-400'
                                        }`}
                                    >
                                        Accelerate
                                    </button>
                                    <button
                                        onClick={() => setAccelState('CONSTANT')}
                                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                                            accelState === 'CONSTANT' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-800/40 border-slate-700 text-slate-400'
                                        }`}
                                    >
                                        Constant
                                    </button>
                                    <button
                                        onClick={() => {
                                            setAccelState('DECEL');
                                            setTurnState('NONE');
                                        }}
                                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                                            accelState === 'DECEL' ? 'bg-orange-500/20 border-orange-500 text-orange-300' : 'bg-slate-800/40 border-slate-700 text-slate-400'
                                        }`}
                                    >
                                        Decelerate
                                    </button>
                                </div>
                            </div>

                            {/* Turning Action */}
                            <div className="space-y-2 pt-2 border-t border-slate-800">
                                <span className="text-xs font-bold text-slate-400 uppercase block">Turning Action (UNOS)</span>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => {
                                            setTurnState('LEFT');
                                            setAccelState('CONSTANT');
                                        }}
                                        className={`py-2 px-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition-all ${
                                            turnState === 'LEFT' ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'bg-slate-800/40 border-slate-700 text-slate-400'
                                        }`}
                                    >
                                        <RotateCcw size={13} />
                                        <span>Turn Left</span>
                                    </button>
                                    <button
                                        onClick={() => setTurnState('NONE')}
                                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                                            turnState === 'NONE' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-800/40 border-slate-700 text-slate-400'
                                        }`}
                                    >
                                        Straight
                                    </button>
                                    <button
                                        onClick={() => {
                                            setTurnState('RIGHT');
                                            setAccelState('CONSTANT');
                                        }}
                                        className={`py-2 px-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 transition-all ${
                                            turnState === 'RIGHT' ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'bg-slate-800/40 border-slate-700 text-slate-400'
                                        }`}
                                    >
                                        <RotateCw size={13} />
                                        <span>Turn Right</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Memory Aids Card */}
                    <div className="bg-yellow-500/10 border border-yellow-500/25 p-5 rounded-2xl space-y-3">
                        <h4 className="text-yellow-400 font-bold flex items-center gap-2 text-xs uppercase tracking-wider">
                            <Info size={15} />
                            Memory Rules (Northern Hemisphere)
                        </h4>
                        <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                            <div className="p-2.5 bg-slate-900/80 rounded-xl border border-white/5">
                                <span className="font-bold text-yellow-400 font-mono">A.N.D.S.</span>: <strong>A</strong>ccelerate <strong>N</strong>orth, <strong>D</strong>ecelerate <strong>S</strong>outh.
                                <p className="text-[10px] text-slate-400 mt-1">Maximum on <strong>East (090°)</strong> and <strong>West (270°)</strong> headings. Zero on North and South.</p>
                            </div>
                            <div className="p-2.5 bg-slate-900/80 rounded-xl border border-white/5">
                                <span className="font-bold text-sky-400 font-mono">U.N.O.S.</span>: <strong>U</strong>ndershoot <strong>N</strong>orth, <strong>O</strong>vershoot <strong>S</strong>outh.
                                <p className="text-[10px] text-slate-400 mt-1">Turning onto North: compass lags, so roll out early. Turning onto South: compass leads, so roll out late.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Compass Instrument Display */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden min-h-[460px] flex flex-col items-center justify-center">
                        <div className="w-full flex justify-between items-center border-b border-slate-800/80 pb-3 mb-8">
                            <span className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <Compass className="w-4 h-4 text-yellow-400" />
                                Cockpit E-Type Direct Reading Compass Card
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                                Fluid-Damped Pivot Suspension
                            </span>
                        </div>

                        {/* Moving Card Display (Aircraft Perspective: Looking through compass window) */}
                        <div className="w-full max-w-md h-32 bg-slate-950 border-[6px] border-slate-800 relative shadow-2xl overflow-hidden rounded-2xl flex items-center justify-center">
                            {/* Glass Reflection & Vignette */}
                            <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-slate-950 via-transparent to-slate-950" />
                            <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-20" />

                            {/* Scrolling Heading Card Tape */}
                            <motion.div
                                animate={{ x: -((displayedHeading % 360) * 4) }} // 1 degree = 4px offset
                                transition={{ type: 'spring', damping: 25, stiffness: 80 }}
                                className="absolute flex items-end h-full pl-[224px]"
                            >
                                {[...Array(73)].map((_, i) => {
                                    const deg = (i * 5) % 360;
                                    const isMajor = deg % 30 === 0;
                                    return (
                                        <div key={i} className="flex flex-col items-center w-20 shrink-0">
                                            {isMajor && (
                                                <div className="text-xl font-black text-white mb-2 font-mono">
                                                    {deg === 0 ? 'N' : deg === 90 ? 'E' : deg === 180 ? 'S' : deg === 270 ? 'W' : (deg / 10).toString().padStart(2, '0')}
                                                </div>
                                            )}
                                            <div className={`w-1 bg-slate-600 ${isMajor ? 'h-7 bg-yellow-400' : 'h-3'}`} />
                                        </div>
                                    );
                                })}
                            </motion.div>

                            {/* Fixed Lubber Line */}
                            <div className="absolute top-0 bottom-0 w-1.5 bg-yellow-400 z-30 shadow-[0_0_12px_rgba(250,204,21,0.8)]" />
                        </div>

                        {/* Comparison Indicators */}
                        <div className="mt-8 grid grid-cols-2 gap-8 w-full max-w-sm text-center">
                            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">True Magnetic Heading</span>
                                <div className="text-3xl font-black text-white font-mono">
                                    {heading.toString().padStart(3, '0')}°
                                </div>
                                <span className="text-[9px] text-slate-400">Actual Aircraft Direction</span>
                            </div>

                            <div className="bg-slate-950/80 p-4 rounded-xl border border-yellow-500/20">
                                <span className="text-[10px] font-bold text-yellow-400 uppercase block mb-1">Compass Reads</span>
                                <div className="text-3xl font-black text-yellow-400 font-mono">
                                    {Math.round(displayedHeading).toString().padStart(3, '0')}°
                                </div>
                                <span className={`text-[9px] font-bold ${totalError !== 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                    {totalError !== 0 ? `Error: ${totalError > 0 ? '+' : ''}${Math.round(totalError)}°` : 'Accurate (No Error)'}
                                </span>
                            </div>
                        </div>

                        {/* Real-time Dynamic Diagnostic Box */}
                        <div className="mt-6 w-full max-w-md">
                            <AnimatePresence mode="wait">
                                {totalError !== 0 ? (
                                    <motion.div
                                        key="error"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="p-3 bg-yellow-500/15 border border-yellow-500/30 rounded-xl text-xs text-yellow-200 text-center leading-relaxed"
                                    >
                                        {accelerationError !== 0 && (
                                            <span>
                                                <strong>ANDS Active:</strong> On heading {heading}°, {accelState === 'ACCEL' ? 'acceleration' : 'deceleration'} causes the pendulous mass to swing, creating a false indication of a turn to <strong>{displayedHeading < heading ? 'North' : 'South'}</strong>!
                                            </span>
                                        )}
                                        {turningError !== 0 && (
                                            <span>
                                                <strong>UNOS Active:</strong> Turning {turnState.toLowerCase()} through {heading < 90 || heading > 270 ? 'North' : 'South'}: Magnetic dip causes the compass to <strong>{heading < 90 || heading > 270 ? 'LAG behind' : 'LEAD ahead of'}</strong> the aircraft!
                                            </span>
                                        )}
                                    </motion.div>
                                ) : (
                                    <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl text-xs text-slate-400 text-center">
                                        Wings level at constant speed: Direct-reading compass indicates true magnetic heading with zero dip errors.
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Mechanical Anatomy of Direct-Reading Compass */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-yellow-400" />
                                Pendulous Pivot & Counterweight
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                In the Northern Hemisphere, magnetic flux dips steeply into the Earth. To keep the card horizontal in level flight, the pivot is placed above the center of gravity and a <strong>counterweight is added to the South end</strong>.
                                In flight, linear accelerations act on this mass, producing torque around the pivot that rotates the card.
                            </p>
                        </div>

                        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                                <ShieldAlert className="text-blue-400" />
                                Operational Technique
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Never trust a magnetic compass when accelerating, decelerating, or turning.
                                Always read the compass only in <strong>straight, unaccelerated level flight</strong> (allow 5-10 seconds for fluid swirl to settle), then synchronize the Directional Gyro (DG).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MagneticCompass;
