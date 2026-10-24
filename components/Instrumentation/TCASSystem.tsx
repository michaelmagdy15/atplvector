import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle, Volume2, ShieldCheck, Activity, Plane, ArrowUp, ArrowDown, Radio, Info, CheckCircle2, XCircle } from 'lucide-react';

const TCASSystem: React.FC = () => {
    const [cpaSeconds, setCpaSeconds] = useState(55); // Time to CPA in seconds
    const [intruderRelativeAlt, setIntruderRelativeAlt] = useState(-300); // Relative ft (e.g. -300 ft = 300 ft below)
    const [intruderClimbing, setIntruderClimbing] = useState(true); // Trend arrow
    const [atcCommand, setAtcCommand] = useState<'DESCEND' | 'CLIMB' | 'MAINTAIN'>('DESCEND');
    const [pilotAction, setPilotAction] = useState<'FOLLOW_TCAS' | 'FOLLOW_ATC' | 'WAIT' | null>(null);

    // Determine TCAS State based on Tau (CPA time)
    // Non-threat: > 45s and > 6NM
    // Proximate: > 45s but <= 6NM
    // TA: <= 45s to CPA (solid yellow circle)
    // RA: <= 30s to CPA (solid red square)
    const isRA = cpaSeconds <= 30;
    const isTA = cpaSeconds > 30 && cpaSeconds <= 45;
    const isProximate = cpaSeconds > 45 && cpaSeconds <= 60;
    const isOther = cpaSeconds > 60;

    // Derived Aural and Commands
    let auralAlert = "MONITORING";
    let raCommand = "NONE";
    let targetVsiFpm = 0; // Target vertical speed to resolve

    if (isRA) {
        // If intruder is below and climbing towards us => TCAS issues "CLIMB, CLIMB" (fly up at +1500 to +2000 FPM)
        raCommand = "CLIMB, CLIMB";
        auralAlert = "CLIMB, CLIMB!";
        targetVsiFpm = 1800;
    } else if (isTA) {
        raCommand = "TRAFFIC ADVISORY";
        auralAlert = "TRAFFIC, TRAFFIC";
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-10">
                <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-widest mb-2">
                    <span>AGK 022</span>
                    <span>•</span>
                    <span>Surveillance & Collision Avoidance</span>
                </div>
                <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                    <ShieldAlert className="text-red-400" />
                    TCAS II (Traffic Alert and Collision Avoidance System)
                </h1>
                <p className="text-slate-400 max-w-3xl leading-relaxed text-sm">
                    Operating via Mode S transponder interrogations (1030 MHz / 1090 MHz), TCAS II provides autonomous traffic surveillance and collision resolution.
                    Master Tau (<span className="text-white font-mono">&tau;</span>) closest-point-of-approach calculation, <strong className="text-white">Traffic Advisories (TA, 45s)</strong>,
                    <strong className="text-white">Resolution Advisories (RA, 30s)</strong>, and the absolute <strong className="text-red-400">legal priority of TCAS RAs over contradictory ATC commands</strong>.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Control Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl">
                        <h3 className="text-white font-bold mb-5 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Radio className="text-red-400 w-4 h-4" />
                            Traffic Convergence Parameters
                        </h3>

                        <div className="space-y-6">
                            {/* CPA Slider */}
                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Time to Closest Approach (&tau; / CPA)</span>
                                    <span className={`font-mono font-bold ${isRA ? 'text-red-400' : isTA ? 'text-amber-400' : 'text-sky-400'}`}>
                                        {cpaSeconds} SEC
                                    </span>
                                </label>
                                <input
                                    type="range" min="10" max="75" step="1"
                                    value={cpaSeconds}
                                    onChange={(e) => setCpaSeconds(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                                />
                                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                                    <span className="text-red-400">25s (RA)</span>
                                    <span className="text-amber-400">45s (TA)</span>
                                    <span>70s (Clear)</span>
                                </div>
                            </div>

                            {/* Relative Altitude Slider */}
                            <div>
                                <label className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                    <span>Intruder Relative Altitude</span>
                                    <span className="text-white font-mono font-bold">
                                        {intruderRelativeAlt > 0 ? `+${intruderRelativeAlt}` : intruderRelativeAlt} FT
                                    </span>
                                </label>
                                <input
                                    type="range" min="-1500" max="1500" step="100"
                                    value={intruderRelativeAlt}
                                    onChange={(e) => setIntruderRelativeAlt(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                                />
                                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                                    <span>−1,500 FT (Below)</span>
                                    <span>0 FT (Co-altitude)</span>
                                    <span>+1,500 FT (Above)</span>
                                </div>
                            </div>

                            {/* Intruder Vertical Trend */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                                <span className="text-xs font-bold text-slate-400 uppercase">Intruder Trend</span>
                                <button
                                    onClick={() => setIntruderClimbing(!intruderClimbing)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                                        intruderClimbing ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                    }`}
                                >
                                    {intruderClimbing ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                                    <span>{intruderClimbing ? 'Climbing (+1200 FPM)' : 'Descending (−1200 FPM)'}</span>
                                </button>
                            </div>

                            {/* Quick Presets */}
                            <div className="pt-2 border-t border-slate-800">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Threat Scenarios</span>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => {
                                            setCpaSeconds(25);
                                            setIntruderRelativeAlt(-200);
                                            setIntruderClimbing(true);
                                        }}
                                        className="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-xs font-bold text-left"
                                    >
                                        Imminent RA (25s)
                                    </button>
                                    <button
                                        onClick={() => {
                                            setCpaSeconds(42);
                                            setIntruderRelativeAlt(500);
                                            setIntruderClimbing(false);
                                        }}
                                        className="py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-bold text-left"
                                    >
                                        Traffic Advisory (42s)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* The Legal Command Hierarchy Dilemma */}
                    <div className="bg-gradient-to-br from-red-950/40 via-slate-900 to-slate-900 border-2 border-red-500/40 p-5 rounded-2xl shadow-xl space-y-4">
                        <div className="flex items-center gap-2 text-red-400 font-black text-xs uppercase tracking-wider">
                            <ShieldCheck className="w-4 h-4" />
                            Contradictory ATC Order Challenge
                        </div>
                        <div className="p-3 bg-slate-950 rounded-xl border border-white/10 text-xs space-y-1">
                            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">Simultaneous Events:</span>
                            <div className="text-white">1. TCAS II triggers: <span className="text-red-400 font-mono font-bold">"CLIMB, CLIMB!"</span></div>
                            <div className="text-white">2. ATC Controller radio calls: <span className="text-yellow-300 font-mono font-bold">"Descend immediately to FL280!"</span></div>
                        </div>

                        <div className="space-y-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Pilot Decision:</span>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <button
                                    onClick={() => setPilotAction('FOLLOW_TCAS')}
                                    className={`p-2.5 rounded-xl border font-bold text-left transition-all ${
                                        pilotAction === 'FOLLOW_TCAS'
                                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                                            : 'bg-slate-800 text-slate-300 hover:border-slate-600'
                                    }`}
                                >
                                    Follow TCAS RA (Climb)
                                </button>
                                <button
                                    onClick={() => setPilotAction('FOLLOW_ATC')}
                                    className={`p-2.5 rounded-xl border font-bold text-left transition-all ${
                                        pilotAction === 'FOLLOW_ATC'
                                            ? 'bg-red-500 text-white border-red-400 font-black'
                                            : 'bg-slate-800 text-slate-300 hover:border-slate-600'
                                    }`}
                                >
                                    Obey ATC Order (Descend)
                                </button>
                            </div>
                        </div>

                        {pilotAction && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-3 rounded-xl text-xs leading-relaxed ${
                                    pilotAction === 'FOLLOW_TCAS'
                                        ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                                        : 'bg-red-500/20 border border-red-500/50 text-red-300'
                                }`}
                            >
                                {pilotAction === 'FOLLOW_TCAS' ? (
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                                        <div>
                                            <strong className="block text-white">CORRECT (ICAO Annex 2 & Doc 8168):</strong>
                                            TCAS RA vertical guidance <strong>ALWAYS overrides conflicting ATC commands</strong>. Disconnect autopilot if necessary, smoothly pitch into the green fly-to arc within 5 seconds, and notify ATC: <em>"Callsign, TCAS RA"</em>.
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-2">
                                        <XCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                                        <div>
                                            <strong className="block text-white">FATAL ATPL ERROR (Überlingen Disaster Precedent):</strong>
                                            Never follow an ATC command that contradicts a TCAS RA. TCAS is coordinated with the opposing aircraft via Mode S data links; following ATC will destroy the computerized separation geometry.
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* TCAS Cockpit Displays (ND + PFD VSI Eyebrow) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Navigation Display (ND) Radar Screen */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-around gap-6">
                        {/* EFIS Radar Scope */}
                        <div className="relative w-72 h-72 rounded-full bg-black border-4 border-slate-800 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden">
                            {/* Range Rings (3 NM, 5 NM, 10 NM) */}
                            <div className="absolute w-20 h-20 rounded-full border border-white/10" />
                            <div className="absolute w-40 h-40 rounded-full border border-white/10" />
                            <div className="absolute w-60 h-60 rounded-full border border-white/10" />

                            {/* Bearing Lines */}
                            <div className="absolute w-full h-px bg-white/5" />
                            <div className="absolute h-full w-px bg-white/5" />

                            {/* Own Aircraft Symbol (White Triangle at Center) */}
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[16px] border-b-white" />
                            </div>

                            {/* Converging Intruder Target Symbol */}
                            <motion.div
                                animate={{
                                    x: (cpaSeconds / 75) * 80,
                                    y: -((cpaSeconds / 75) * 60)
                                }}
                                transition={{ type: 'spring', damping: 20 }}
                                className="absolute z-20 flex flex-col items-center cursor-pointer"
                            >
                                {/* Symbology by TCAS Threat Level */}
                                {isRA ? (
                                    // RA: Solid Red Square
                                    <div className="w-5 h-5 bg-red-500 rounded-sm shadow-[0_0_12px_rgba(239,68,68,0.9)] animate-pulse" />
                                ) : isTA ? (
                                    // TA: Solid Amber Circle
                                    <div className="w-5 h-5 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
                                ) : isProximate ? (
                                    // Proximate: Solid Cyan Diamond
                                    <div className="w-4 h-4 bg-cyan-400 rotate-45 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                                ) : (
                                    // Other Traffic: Hollow Cyan Diamond
                                    <div className="w-4 h-4 border-2 border-cyan-400 rotate-45" />
                                )}

                                {/* Target Data Tag: Relative Alt in Hundreds of Feet + Trend Arrow */}
                                <div className={`text-[10px] font-mono font-black mt-1 flex items-center gap-0.5 ${
                                    isRA ? 'text-red-400' : isTA ? 'text-amber-400' : 'text-cyan-400'
                                }`}>
                                    <span>{intruderRelativeAlt >= 0 ? `+${intruderRelativeAlt / 100}` : `${intruderRelativeAlt / 100}`}</span>
                                    {intruderClimbing ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                                </div>
                            </motion.div>

                            {/* Annunciator Banner */}
                            <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-[10px] font-mono">
                                <span className="text-slate-500">TCAS MODE: AUTO</span>
                                <span className={`font-bold px-2 py-0.5 rounded ${
                                    isRA ? 'bg-red-500/20 text-red-400 animate-pulse' : isTA ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400'
                                }`}>
                                    {isRA ? 'RA ACTIVE' : isTA ? 'TA ACTIVE' : 'CLEAR'}
                                </span>
                            </div>
                        </div>

                        {/* PFD Vertical Speed (VSI) Eyebrow Pitch Cue */}
                        <div className="w-full max-w-xs space-y-4">
                            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                                    PFD VSI Pitch Command Cue
                                </span>
                                
                                {/* Vertical Tape Mockup */}
                                <div className="h-44 w-16 mx-auto bg-slate-900 rounded-xl border border-white/10 relative flex flex-col justify-between p-1 font-mono text-[9px] text-slate-500">
                                    <span className="text-right pr-1">+6</span>
                                    <span className="text-right pr-1">+4</span>
                                    <span className="text-right pr-1">+2</span>
                                    <span className="text-right pr-1">0</span>
                                    <span className="text-right pr-1">−2</span>
                                    <span className="text-right pr-1">−4</span>
                                    <span className="text-right pr-1">−6</span>

                                    {/* Fly-to Green Zone & Red Keep-out Zone on RA */}
                                    {isRA && (
                                        <>
                                            {/* Red Forbidden Arc (Below +1500 FPM) */}
                                            <div className="absolute left-0 right-0 bottom-0 top-[40%] bg-red-600/40 border-t-2 border-red-500 rounded-b-xl flex items-center justify-center">
                                                <span className="text-[8px] font-bold text-red-300 uppercase -rotate-90">AVOID</span>
                                            </div>
                                            {/* Green Fly-To Arc (+1500 to +2000 FPM) */}
                                            <div className="absolute left-0 right-0 top-[22%] h-8 bg-emerald-500/40 border-2 border-emerald-400 rounded flex items-center justify-center">
                                                <span className="text-[8px] font-black text-emerald-200 uppercase">FLY TO</span>
                                            </div>
                                        </>
                                    )}

                                    {/* Current Aircraft VSI Pointer */}
                                    <div className="absolute left-full -ml-1 top-1/2 -translate-y-1/2 w-4 h-2 bg-white" />
                                </div>

                                <div className="mt-3 text-center">
                                    <div className="text-[10px] text-slate-400">Target Resolution ROC:</div>
                                    <div className={`text-base font-black font-mono ${isRA ? 'text-emerald-400' : 'text-slate-500'}`}>
                                        {isRA ? '+1,500 to +2,000 FPM' : '0 FPM (Level)'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Aural & Procedural Response Box */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Volume2 className={isRA ? 'text-red-400 animate-bounce' : isTA ? 'text-amber-400' : 'text-slate-500'} />
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Cockpit Voice Synthesizer:</span>
                            </div>
                            <span className={`text-sm font-black font-mono px-3 py-1 rounded-full ${
                                isRA ? 'bg-red-500 text-white shadow-lg shadow-red-500/50' : isTA ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
                            }`}>
                                "{auralAlert}"
                            </span>
                        </div>

                        {/* Standard ICAO Phraseology Reference */}
                        <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800">
                            <div className="p-3 bg-slate-950 rounded-xl border border-white/5">
                                <span className="text-[10px] text-slate-500 uppercase font-black block mb-1">1. Initial RA Call to ATC</span>
                                <div className="font-mono text-emerald-300 font-bold">"[Callsign], TCAS RA"</div>
                                <span className="text-[9px] text-slate-400 block mt-1">Transmitted immediately as aircraft responds to RA.</span>
                            </div>
                            <div className="p-3 bg-slate-950 rounded-xl border border-white/5">
                                <span className="text-[10px] text-slate-500 uppercase font-black block mb-1">2. Clear of Conflict Call</span>
                                <div className="font-mono text-sky-300 font-bold">"[Callsign], Clear of conflict, returning to FL[xxx]"</div>
                                <span className="text-[9px] text-slate-400 block mt-1">Transmitted when threat has passed CPA.</span>
                            </div>
                        </div>
                    </div>

                    {/* TCAS II Symbology Reference Matrix */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center flex flex-col items-center">
                            <div className="w-3.5 h-3.5 border-2 border-cyan-400 rotate-45 mb-2 mt-1" />
                            <div className="text-[10px] font-bold text-white uppercase">Other Traffic</div>
                            <div className="text-[9px] text-slate-500 mt-0.5">&gt; 6 NM or &plusmn;1200'</div>
                        </div>

                        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center flex flex-col items-center">
                            <div className="w-3.5 h-3.5 bg-cyan-400 rotate-45 mb-2 mt-1" />
                            <div className="text-[10px] font-bold text-white uppercase">Proximate</div>
                            <div className="text-[9px] text-slate-500 mt-0.5">&le; 6 NM and &plusmn;1200'</div>
                        </div>

                        <div className="bg-slate-900/60 p-3 rounded-xl border border-amber-500/30 text-center flex flex-col items-center">
                            <div className="w-3.5 h-3.5 bg-amber-400 rounded-full mb-2 mt-1" />
                            <div className="text-[10px] font-bold text-amber-300 uppercase">Traffic Advisory (TA)</div>
                            <div className="text-[9px] text-amber-400/80 mt-0.5">&tau; &approx; 40–45s CPA</div>
                        </div>

                        <div className="bg-slate-900/60 p-3 rounded-xl border border-red-500/40 text-center flex flex-col items-center">
                            <div className="w-3.5 h-3.5 bg-red-500 rounded-sm mb-2 mt-1" />
                            <div className="text-[10px] font-bold text-red-400 uppercase">Resolution Advisory (RA)</div>
                            <div className="text-[9px] text-red-400/80 mt-0.5">&tau; &approx; 25–30s CPA (MANDATORY)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TCASSystem;
