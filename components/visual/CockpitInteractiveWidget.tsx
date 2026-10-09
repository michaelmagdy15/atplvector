import React, { useState, useEffect } from 'react';
import { 
    Compass, 
    Gauge, 
    Activity, 
    Radio, 
    Brain, 
    Sparkles, 
    CheckCircle2, 
    XCircle, 
    RotateCcw, 
    ChevronRight,
    ArrowUp,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    Zap,
    Sliders,
    Volume2
} from 'lucide-react';

type WidgetMode = 'PFD' | 'NAV_RADIO' | 'AI_TUTOR';

export const CockpitInteractiveWidget: React.FC = () => {
    const [activeMode, setActiveMode] = useState<WidgetMode>('PFD');

    // PFD State
    const [pitch, setPitch] = useState<number>(2); // degrees
    const [roll, setRoll] = useState<number>(0); // degrees
    const [airspeed, setAirspeed] = useState<number>(142); // knots
    const [altitude, setAltitude] = useState<number>(18500); // feet
    const [heading, setHeading] = useState<number>(270); // degrees
    const [autopilotOn, setAutopilotOn] = useState<boolean>(true);

    // Nav Radio State
    const [obs, setObs] = useState<number>(270); // Course needle degrees
    const [frequency, setFrequency] = useState<string>('115.80');
    const [stationIdent, setStationIdent] = useState<string>('CAI');

    // AI Tutor State
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState<boolean>(false);

    // Gentle live telemetry drift for realistic PFD feel
    useEffect(() => {
        if (activeMode !== 'PFD') return;
        const interval = setInterval(() => {
            setAirspeed(prev => +(prev + (Math.random() * 0.8 - 0.4)).toFixed(1));
            setAltitude(prev => Math.round(prev + (Math.random() * 10 - 5)));
        }, 1200);
        return () => clearInterval(interval);
    }, [activeMode]);

    // Handle pitch/roll manual control
    const adjustFlight = (dp: number, dr: number) => {
        setPitch(p => Math.max(-20, Math.min(20, p + dp)));
        setRoll(r => Math.max(-30, Math.min(30, r + dr)));
    };

    const resetFlight = () => {
        setPitch(2);
        setRoll(0);
        setAirspeed(142);
        setAltitude(18500);
        setHeading(270);
    };

    // Calculate CDI deviation based on heading vs OBS
    const cdiOffset = Math.sin(((heading - obs) * Math.PI) / 180) * 45;

    return (
        <div className="w-full max-w-4xl mx-auto rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden backdrop-blur-xl">
            {/* Top Avionics Control Bar */}
            <div className="px-4 sm:px-6 py-3 bg-slate-950/80 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                    <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-300 uppercase">
                        AVIONICS SIMULATOR · LIVE TELEMETRY
                    </span>
                </div>

                {/* Mode Selector Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-white/10">
                    <button
                        type="button"
                        onClick={() => setActiveMode('PFD')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            activeMode === 'PFD'
                                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Gauge size={14} />
                        <span>Glass PFD</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveMode('NAV_RADIO')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            activeMode === 'NAV_RADIO'
                                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Radio size={14} />
                        <span>VOR / HSI Lab</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveMode('AI_TUTOR')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            activeMode === 'AI_TUTOR'
                                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Brain size={14} />
                        <span>AI Tutor Exam</span>
                    </button>
                </div>
            </div>

            {/* Main Interactive Screen */}
            <div className="p-4 sm:p-6 min-h-[360px] flex flex-col justify-between">
                {/* MODE 1: PRIMARY FLIGHT DISPLAY (PFD) */}
                {activeMode === 'PFD' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        {/* FMA (Flight Mode Annunciator) Bar */}
                        <div className="grid grid-cols-4 gap-1 p-2 bg-slate-950 rounded-xl border border-white/10 text-center font-mono text-[10px] tracking-wider font-bold">
                            <div className="text-emerald-400 border-r border-white/10">THR REF</div>
                            <div className="text-emerald-400 border-r border-white/10">NAV LOC</div>
                            <div className="text-cyan-400 border-r border-white/10">ALT ACQ</div>
                            <div className="text-emerald-400">AP1 · FD1</div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                            {/* Airspeed Tape (Left) */}
                            <div className="hidden md:flex md:col-span-2 flex-col items-center justify-center p-3 bg-slate-950/70 border border-white/10 rounded-2xl">
                                <span className="text-[10px] text-slate-500 font-mono uppercase mb-1">IAS (KT)</span>
                                <div className="text-3xl font-mono font-black text-emerald-400 bg-slate-900 px-3 py-2 rounded-xl border border-emerald-500/30 shadow-inner">
                                    {airspeed}
                                </div>
                                <div className="w-full mt-3 space-y-1 text-[9px] font-mono text-slate-400">
                                    <div className="flex justify-between text-rose-400"><span>Vne</span><span>195</span></div>
                                    <div className="flex justify-between text-yellow-400"><span>Vno</span><span>160</span></div>
                                    <div className="flex justify-between text-emerald-400"><span>Vy</span><span>130</span></div>
                                    <div className="flex justify-between text-slate-500"><span>Vs</span><span>62</span></div>
                                </div>
                            </div>

                            {/* Artificial Horizon (Center) */}
                            <div className="col-span-1 md:col-span-8 relative aspect-[16/10] sm:aspect-[2/1] rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 flex items-center justify-center shadow-2xl">
                                {/* Sky & Ground Layers */}
                                <div 
                                    className="absolute inset-0 transition-transform duration-200 ease-out will-change-transform origin-center"
                                    style={{
                                        transform: `rotate(${-roll}deg) translateY(${pitch * 4}px)`
                                    }}
                                >
                                    {/* Sky */}
                                    <div className="w-full h-full bg-gradient-to-b from-sky-600 to-sky-400" />
                                    {/* Horizon Line */}
                                    <div className="w-full h-0.5 bg-white shadow-lg" />
                                    {/* Ground */}
                                    <div className="w-full h-full bg-gradient-to-b from-amber-900 to-amber-950" />
                                    
                                    {/* Pitch Ladder Marks */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-white/80 font-mono text-[9px]">
                                        <div className="w-20 border-b border-white/60 mb-6 flex justify-between px-1"><span>+10</span><span>+10</span></div>
                                        <div className="w-12 border-b border-white/40 mb-6"></div>
                                        <div className="w-28 border-b-2 border-white mb-6"></div>
                                        <div className="w-12 border-b border-white/40 mb-6"></div>
                                        <div className="w-20 border-b border-white/60 flex justify-between px-1"><span>-10</span><span>-10</span></div>
                                    </div>
                                </div>

                                {/* Fixed Aircraft Crosshair Symbol */}
                                <div className="absolute z-20 pointer-events-none flex items-center justify-center">
                                    <div className="w-8 h-1 bg-yellow-400 rounded-sm shadow-md"></div>
                                    <div className="w-2 h-2 rounded-full border-2 border-yellow-400 bg-slate-950 mx-1"></div>
                                    <div className="w-8 h-1 bg-yellow-400 rounded-sm shadow-md"></div>
                                </div>

                                {/* Bank Angle Scale at Top */}
                                <div className="absolute top-2 z-20 flex gap-4 text-white/70 text-[9px] font-mono">
                                    <span>◄ 30°</span>
                                    <span>20°</span>
                                    <span>10°</span>
                                    <span className="text-yellow-400 font-bold">▼</span>
                                    <span>10°</span>
                                    <span>20°</span>
                                    <span>30° ►</span>
                                </div>

                                {/* Mobile Overlay Readouts */}
                                <div className="md:hidden absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-emerald-400 font-mono text-xs">
                                    {airspeed} KT
                                </div>
                                <div className="md:hidden absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-cyan-400 font-mono text-xs">
                                    {altitude} FT
                                </div>

                                {/* Bottom Heading Readout */}
                                <div className="absolute bottom-2 z-20 bg-slate-950/80 px-4 py-1 rounded-lg border border-white/20 text-white font-mono text-xs flex items-center gap-2">
                                    <span className="text-slate-400">HDG:</span>
                                    <span className="text-cyan-300 font-bold">{heading.toString().padStart(3, '0')}°</span>
                                    <span className="text-slate-400">MAG</span>
                                </div>
                            </div>

                            {/* Altitude Tape (Right) */}
                            <div className="hidden md:flex md:col-span-2 flex-col items-center justify-center p-3 bg-slate-950/70 border border-white/10 rounded-2xl">
                                <span className="text-[10px] text-slate-500 font-mono uppercase mb-1">ALT (FT)</span>
                                <div className="text-2xl font-mono font-black text-cyan-300 bg-slate-900 px-3 py-2 rounded-xl border border-cyan-500/30 shadow-inner">
                                    {altitude}
                                </div>
                                <div className="w-full mt-3 space-y-1 text-[9px] font-mono text-slate-400 text-center">
                                    <div className="text-emerald-400">QNH 1013 hPa</div>
                                    <div>VS +0 FPM</div>
                                    <div className="text-slate-500">FL 185</div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Flight Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-slate-400 uppercase">Yoke Control:</span>
                                <div className="flex items-center gap-1">
                                    <button 
                                        type="button" 
                                        onClick={() => adjustFlight(0, -5)}
                                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all active:scale-90"
                                        title="Bank Left"
                                    >
                                        <ArrowLeft size={16} />
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => adjustFlight(3, 0)}
                                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all active:scale-90"
                                        title="Pitch Up"
                                    >
                                        <ArrowUp size={16} />
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => adjustFlight(-3, 0)}
                                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all active:scale-90"
                                        title="Pitch Down"
                                    >
                                        <ArrowDown size={16} />
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => adjustFlight(0, 5)}
                                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all active:scale-90"
                                        title="Bank Right"
                                    >
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={resetFlight}
                                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-bold transition-all flex items-center gap-1.5"
                                >
                                    <RotateCcw size={14} /> Level Off
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAutopilotOn(!autopilotOn)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                                        autopilotOn 
                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                                            : 'bg-slate-800 text-slate-500'
                                    }`}
                                >
                                    AP: {autopilotOn ? 'ENGAGED' : 'STANDBY'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODE 2: VOR / HSI NAVIGATION LAB */}
                {activeMode === 'NAV_RADIO' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            {/* VOR Instrument Dial */}
                            <div className="relative aspect-square max-w-[280px] mx-auto w-full rounded-full border-4 border-slate-700 bg-slate-950 p-4 flex items-center justify-center shadow-2xl">
                                {/* Rotating Compass Ring */}
                                <div 
                                    className="absolute inset-3 rounded-full border border-white/20 transition-transform duration-300"
                                    style={{ transform: `rotate(${-obs}deg)` }}
                                >
                                    {/* Cardinal markers */}
                                    <span className="absolute top-1 left-1/2 -translate-x-1/2 text-xs font-bold text-yellow-400">N</span>
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-bold text-white">S</span>
                                    <span className="absolute left-1 top-1/2 -translate-y-1/2 text-xs font-bold text-white">W</span>
                                    <span className="absolute right-1 top-1/2 -translate-y-1/2 text-xs font-bold text-white">E</span>
                                </div>

                                {/* Deviation Dots */}
                                <div className="flex items-center gap-3 z-10">
                                    <div className="w-2 h-2 rounded-full border border-white/40"></div>
                                    <div className="w-2 h-2 rounded-full border border-white/40"></div>
                                    {/* CDI Needle */}
                                    <div 
                                        className="w-1 h-36 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)] transition-transform duration-300 rounded"
                                        style={{ transform: `translateX(${cdiOffset}px)` }}
                                    ></div>
                                    <div className="w-2 h-2 rounded-full border border-white/40"></div>
                                    <div className="w-2 h-2 rounded-full border border-white/40"></div>
                                </div>

                                {/* TO/FROM Flag */}
                                <div className="absolute top-12 z-10 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-[9px] font-mono font-bold text-emerald-400">
                                    TO
                                </div>

                                {/* Fixed Pointer at 12 o'clock */}
                                <div className="absolute top-1 text-yellow-400 text-sm font-bold z-20">▼</div>
                            </div>

                            {/* Nav Radio Controls */}
                            <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-white/10">
                                <div>
                                    <div className="text-[10px] text-slate-500 font-mono uppercase mb-1">TUNED VOR STATION</div>
                                    <div className="flex items-center justify-between">
                                        <div className="text-2xl font-mono font-black text-white">{stationIdent} · {frequency} MHz</div>
                                        <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                                            IDENT OK
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                                        <span>SELECTED COURSE (OBS):</span>
                                        <span className="text-yellow-400 font-bold">{obs.toString().padStart(3, '0')}°</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="359" 
                                        value={obs} 
                                        onChange={(e) => setObs(parseInt(e.target.value, 10))}
                                        className="w-full accent-yellow-400 cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                                        <span>000°</span>
                                        <span>090°</span>
                                        <span>180°</span>
                                        <span>270°</span>
                                        <span>359°</span>
                                    </div>
                                </div>

                                <div className="p-3 bg-blue-950/30 border border-blue-500/20 rounded-xl text-xs text-slate-300 space-y-1">
                                    <div className="font-bold text-blue-300">VOR Intercept Status:</div>
                                    <p className="text-[11px] leading-relaxed text-slate-400">
                                        {Math.abs(cdiOffset) < 5 
                                            ? '✓ Aircraft is centered on the radial! Ready for approach.'
                                            : cdiOffset > 0 
                                                ? 'Fly RIGHT to intercept selected radial.' 
                                                : 'Fly LEFT to intercept selected radial.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODE 3: LIVE ECQB QUESTION & AI EXPLANATION */}
                {activeMode === 'AI_TUTOR' && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between">
                            <span className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-500/30">
                                ECQB 2026 · SUBJECT 081 PRINCIPLES OF FLIGHT
                            </span>
                            <span className="text-xs text-slate-500 font-mono">QID: ATPL-81042</span>
                        </div>

                        <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/10">
                            <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                                During transonic flight as Mach number increases beyond Mcrit, what occurs to the Center of Pressure (CP) and aircraft pitch trim?
                            </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {[
                                { id: 0, text: "A. CP moves forward toward leading edge; pitch-up tendency occurs.", correct: false },
                                { id: 1, text: "B. CP moves aft toward 50% chord; Mach Tuck nose-down pitch tendency occurs.", correct: true },
                                { id: 2, text: "C. CP remains stationary due to wing sweepback; no trim change.", correct: false },
                                { id: 3, text: "D. CP oscillates rapidly between 25% and 75% causing deep stall.", correct: false },
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedAnswer(opt.id);
                                        setShowExplanation(true);
                                    }}
                                    className={`p-3.5 rounded-xl text-left text-xs sm:text-sm font-medium transition-all border ${
                                        selectedAnswer === opt.id
                                            ? opt.correct
                                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                                                : 'bg-rose-500/20 border-rose-500 text-rose-200'
                                            : 'bg-slate-900/60 border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20'
                                    }`}
                                >
                                    <div className="flex items-start gap-2">
                                        {selectedAnswer === opt.id && (
                                            opt.correct ? <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={16} /> : <XCircle className="text-rose-400 shrink-0 mt-0.5" size={16} />
                                        )}
                                        <span>{opt.text}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {showExplanation && (
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/50 to-slate-900/80 border border-purple-500/30 text-xs text-slate-300 space-y-2 animate-in slide-in-from-bottom-2 duration-300">
                                <div className="flex items-center gap-2 text-purple-300 font-bold">
                                    <Sparkles size={16} className="text-purple-400" />
                                    <span>AI Aeronautical Debrief:</span>
                                </div>
                                <p className="leading-relaxed">
                                    <strong className="text-white">Explanation:</strong> In subsonic flight, the aerodynamic center and CP reside at approximately 25% MAC. As shock waves form on the upper and lower surfaces at supersonic/transonic speeds, flow separates behind the shock wave, causing the Center of Pressure to shift backwards toward roughly 50% chord. This creates a strong nose-down pitching moment famously designated as <span className="text-cyan-300 font-semibold font-mono">Mach Tuck</span>.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Status / Footer Ticker */}
            <div className="px-6 py-2.5 bg-slate-950/90 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>SYSTEM: EFIS BUS OK</span>
                </div>
                <div>FRAME RATE: 60 FPS · GPU ACCELERATED</div>
            </div>
        </div>
    );
};

export default CockpitInteractiveWidget;
