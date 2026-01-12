import React, { useState, useEffect, useCallback } from 'react';
import { View } from '../../types';
import { ArrowLeft, Radio, Waves, Timer, Ruler, AlertTriangle, Zap, Plane, Signal, Clock, Volume2 } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

// ============================================================================
// SECTION 1: SYSTEM FUNDAMENTALS
// ============================================================================
const SystemFundamentals: React.FC = () => {
    const [vorFreq, setVorFreq] = useState(112.10);
    const [showInterrogation, setShowInterrogation] = useState(false);
    const [pulsePhase, setPulsePhase] = useState(0);

    // DME Channel pairing logic (simplified)
    const getDMEChannel = (freq: number): { channel: number; interrogate: number; reply: number } => {
        // VOR frequencies: 108.00 - 117.95 MHz
        // DME uses UHF 962-1213 MHz
        const baseChannel = Math.round((freq - 108.0) * 10);
        const interrogate = 1025 + baseChannel;
        const reply = interrogate + 63; // 63 MHz offset
        return { channel: baseChannel + 1, interrogate, reply };
    };

    const dmeInfo = getDMEChannel(vorFreq);

    useEffect(() => {
        if (showInterrogation) {
            const interval = setInterval(() => {
                setPulsePhase(p => (p + 1) % 100);
            }, 50);
            return () => clearInterval(interval);
        }
    }, [showInterrogation]);

    return (
        <div className="space-y-6">
            {/* Definition Card */}
            <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-500/20">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                        <Radio className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">What is DME?</h3>
                        <p className="text-slate-300 leading-relaxed">
                            <strong className="text-blue-300">Distance Measuring Equipment</strong> is a form of <strong className="text-amber-300">secondary radar</strong>.
                            Unlike primary radar which detects passive reflections, DME relies on an <em>active</em> interaction
                            between the aircraft's <strong>interrogator</strong> and a ground station <strong>transponder</strong>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Frequency Spectrum */}
            <div className="glass-panel p-6 rounded-2xl">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Waves className="text-purple-400" /> UHF Frequency Band
                </h4>
                <div className="relative h-16 bg-gradient-to-r from-violet-900/50 via-purple-600/50 to-pink-900/50 rounded-xl overflow-hidden border border-purple-500/30">
                    <div className="absolute inset-0 flex items-center justify-between px-4 text-xs text-white/80">
                        <span>300 MHz</span>
                        <span className="text-lg font-bold text-purple-200">UHF Band</span>
                        <span>3 GHz</span>
                    </div>
                    <div className="absolute left-[30%] top-0 bottom-0 w-1 bg-cyan-400 animate-pulse" />
                    <div className="absolute left-[30%] -translate-x-1/2 top-full mt-1 text-xs text-cyan-300 whitespace-nowrap">
                        DME: 962-1213 MHz
                    </div>
                </div>
                <p className="text-sm text-slate-400 mt-6">
                    DME operates in the <strong className="text-purple-300">Ultra High Frequency (UHF)</strong> band, specifically 962–1213 MHz.
                </p>
            </div>

            {/* Channel Pairing Interactive */}
            <div className="glass-panel p-6 rounded-2xl">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Zap className="text-amber-400" /> Channel Pairing
                </h4>
                <p className="text-sm text-slate-400 mb-4">
                    When you tune a VOR/ILS frequency on the NAV radio, the DME automatically selects the paired UHF channel.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* VOR Input */}
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                        <label className="text-xs text-slate-400 block mb-2">VOR/ILS Frequency (MHz)</label>
                        <input
                            type="range"
                            min="108.00"
                            max="117.95"
                            step="0.05"
                            value={vorFreq}
                            onChange={(e) => setVorFreq(parseFloat(e.target.value))}
                            className="w-full accent-green-500"
                        />
                        <div className="text-3xl font-mono text-green-400 text-center mt-2">
                            {vorFreq.toFixed(2)} MHz
                        </div>
                    </div>

                    {/* DME Output */}
                    <div className="bg-slate-950/70 p-4 rounded-xl border border-cyan-500/30 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">DME Channel:</span>
                            <span className="text-cyan-300 font-mono font-bold">{dmeInfo.channel}X</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Interrogation Freq:</span>
                            <span className="text-amber-300 font-mono">{dmeInfo.interrogate} MHz</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Reply Freq:</span>
                            <span className="text-emerald-300 font-mono">{dmeInfo.reply} MHz</span>
                        </div>
                        <div className="text-xs text-center text-slate-500 pt-2 border-t border-slate-700">
                            Offset: <span className="text-white font-bold">+63 MHz</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interrogation Animation */}
            <div className="glass-panel p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <Signal className="text-cyan-400" /> Interrogation Cycle
                    </h4>
                    <button
                        onClick={() => setShowInterrogation(!showInterrogation)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${showInterrogation ? 'bg-red-500/20 text-red-300 border border-red-500/50' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-500/30'}`}
                    >
                        {showInterrogation ? 'Stop' : 'Animate'}
                    </button>
                </div>

                <div className="relative h-40 bg-slate-900/50 rounded-xl overflow-hidden border border-slate-700">
                    {/* Aircraft */}
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 text-4xl">✈️</div>

                    {/* Ground Station */}
                    <div className="absolute right-8 bottom-4 flex flex-col items-center">
                        <div className="w-6 h-12 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm" />
                        <div className="w-10 h-2 bg-emerald-700 rounded-b" />
                        <span className="text-xs text-emerald-300 mt-1">DME</span>
                    </div>

                    {/* Interrogation Pulse */}
                    {showInterrogation && pulsePhase < 50 && (
                        <div
                            className="absolute top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-amber-500 to-transparent rounded-full"
                            style={{
                                left: `${80 + pulsePhase * 1.2}px`,
                                width: '60px',
                                opacity: 1 - pulsePhase / 50
                            }}
                        />
                    )}

                    {/* Reply Pulse */}
                    {showInterrogation && pulsePhase >= 50 && (
                        <div
                            className="absolute top-1/2 -translate-y-1/2 h-2 bg-gradient-to-l from-emerald-500 to-transparent rounded-full"
                            style={{
                                right: `${80 + (pulsePhase - 50) * 1.2}px`,
                                width: '60px',
                                opacity: 1 - (pulsePhase - 50) / 50
                            }}
                        />
                    )}

                    {/* Labels */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-amber-300">
                        {showInterrogation && pulsePhase < 50 && '→ Interrogation (UHF)'}
                    </div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-emerald-300">
                        {showInterrogation && pulsePhase >= 50 && '← Reply (+63 MHz)'}
                    </div>
                </div>

                <p className="text-sm text-slate-400 mt-4 text-center">
                    The aircraft interrogates on one frequency; the ground station replies on a frequency <strong className="text-white">63 MHz higher or lower</strong> to prevent interference.
                </p>
            </div>
        </div>
    );
};

// ============================================================================
// SECTION 2: SIGNAL CHARACTERISTICS
// ============================================================================
const SignalCharacteristics: React.FC = () => {
    const [animating, setAnimating] = useState(true);
    const [pulseTime, setPulseTime] = useState(0);
    const [jitterDemo, setJitterDemo] = useState(false);

    useEffect(() => {
        if (animating) {
            const interval = setInterval(() => {
                setPulseTime(t => (t + 1) % 200);
            }, 30);
            return () => clearInterval(interval);
        }
    }, [animating]);

    // Generate pulse pair shape
    const generatePulse = (offset: number, amplitude: number = 1) => {
        const width = 3.5; // microseconds (Gaussian width)
        const spacing = 12; // microseconds between pulses

        let points = [];
        for (let x = 0; x <= 30; x += 0.5) {
            // Two Gaussian pulses
            const p1 = Math.exp(-Math.pow(x - 5, 2) / (2 * width));
            const p2 = Math.exp(-Math.pow(x - 5 - spacing, 2) / (2 * width));
            const y = (p1 + p2) * amplitude * 40;
            points.push(`${offset + x * 4},${60 - y}`);
        }
        return points.join(' ');
    };

    return (
        <div className="space-y-6">
            {/* Pulse Pair Structure */}
            <div className="glass-panel p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <Waves className="text-cyan-400" /> Pulse Pair Structure
                    </h4>
                    <button
                        onClick={() => setAnimating(!animating)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${animating ? 'bg-red-500/20 text-red-300' : 'bg-cyan-500/20 text-cyan-300'}`}
                    >
                        {animating ? 'Pause' : 'Play'}
                    </button>
                </div>

                <div className="bg-slate-900/70 rounded-xl p-4 border border-slate-700">
                    <svg viewBox="0 0 400 80" className="w-full h-32">
                        {/* Grid */}
                        <defs>
                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect fill="url(#grid)" width="400" height="80" />

                        {/* Baseline */}
                        <line x1="0" y1="60" x2="400" y2="60" stroke="#475569" strokeWidth="1" />

                        {/* Animated Pulse Pair */}
                        <polyline
                            points={generatePulse((pulseTime * 2) % 400 - 150)}
                            fill="none"
                            stroke="#22d3ee"
                            strokeWidth="2"
                        />
                        <polyline
                            points={generatePulse((pulseTime * 2 + 200) % 400 - 150)}
                            fill="none"
                            stroke="#22d3ee"
                            strokeWidth="2"
                        />

                        {/* 12 µs label */}
                        <line x1="180" y1="65" x2="228" y2="65" stroke="#f59e0b" strokeWidth="1" />
                        <line x1="180" y1="62" x2="180" y2="68" stroke="#f59e0b" strokeWidth="1" />
                        <line x1="228" y1="62" x2="228" y2="68" stroke="#f59e0b" strokeWidth="1" />
                        <text x="204" y="77" textAnchor="middle" fill="#f59e0b" fontSize="10">12 µs</text>
                    </svg>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-cyan-500/10 p-3 rounded-lg border border-cyan-500/20">
                        <div className="text-xs text-slate-400">Pulse Width</div>
                        <div className="text-lg font-mono text-cyan-300">3.5 µs</div>
                    </div>
                    <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                        <div className="text-xs text-slate-400">Pulse Spacing</div>
                        <div className="text-lg font-mono text-amber-300">12 µs</div>
                    </div>
                </div>

                <p className="text-sm text-slate-400 mt-4">
                    DME signals are transmitted as <strong className="text-cyan-300">pulse pairs</strong> — two pulses spaced exactly <strong className="text-amber-300">12 microseconds</strong> apart. This unique spacing helps the receiver distinguish DME signals from noise.
                </p>
            </div>

            {/* Jittering Explanation */}
            <div className="glass-panel p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <Zap className="text-purple-400" /> Jittering (PRF Randomization)
                    </h4>
                    <button
                        onClick={() => setJitterDemo(!jitterDemo)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${jitterDemo ? 'bg-purple-500/30 text-purple-200' : 'bg-slate-700 text-slate-300'}`}
                    >
                        {jitterDemo ? 'Hide Demo' : 'Show Demo'}
                    </button>
                </div>

                <p className="text-sm text-slate-400 mb-4">
                    Multiple aircraft interrogate the same DME station. To ensure each aircraft receives only <em>its own</em> replies, the gap between pulse pairs is <strong className="text-purple-300">randomized uniquely</strong> for each aircraft (called "jittering").
                </p>

                {jitterDemo && (
                    <div className="bg-slate-900/70 rounded-xl p-4 border border-slate-700 space-y-3">
                        {['Aircraft A', 'Aircraft B', 'Aircraft C'].map((name, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <span className="text-xs text-slate-400 w-20">{name}</span>
                                <div className="flex-1 h-8 bg-slate-800 rounded relative overflow-hidden">
                                    {[0, 1, 2, 3].map(j => {
                                        const jitter = (i * 17 + j * 23) % 30;
                                        return (
                                            <div
                                                key={j}
                                                className="absolute top-1/2 -translate-y-1/2 w-1 h-4 rounded-full"
                                                style={{
                                                    left: `${10 + j * 25 + jitter}%`,
                                                    backgroundColor: ['#22d3ee', '#a855f7', '#22c55e'][i]
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                        <p className="text-xs text-slate-500 text-center pt-2 border-t border-slate-700">
                            Each aircraft's receiver locks onto its unique jitter pattern.
                        </p>
                    </div>
                )}
            </div>

            {/* Audio Identification */}
            <div className="glass-panel p-6 rounded-2xl">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Volume2 className="text-emerald-400" /> Audio Identification
                </h4>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-sm text-slate-300">VOR Ident</span>
                        </div>
                        <div className="flex items-end gap-1 h-12">
                            {[6, 4, 6, 2, 4, 6, 4, 2].map((h, i) => (
                                <div key={i} className="w-4 bg-emerald-500/60 rounded-t" style={{ height: `${h * 8}px` }} />
                            ))}
                        </div>
                        <div className="text-xs text-slate-500 mt-2">Lower Pitch (~1020 Hz)</div>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-xl border border-cyan-500/30">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 rounded-full bg-cyan-500" />
                            <span className="text-sm text-slate-300">DME Ident</span>
                        </div>
                        <div className="flex items-end gap-1 h-12">
                            {[8, 6, 8, 4, 6, 8, 6, 4].map((h, i) => (
                                <div key={i} className="w-4 bg-cyan-500/60 rounded-t" style={{ height: `${h * 6}px` }} />
                            ))}
                        </div>
                        <div className="text-xs text-slate-500 mt-2">Higher Pitch (~1350 Hz)</div>
                    </div>
                </div>

                <p className="text-sm text-slate-400 mt-4 text-center">
                    The DME ident is transmitted at a <strong className="text-cyan-300">higher pitch</strong> than the VOR ident, allowing pilots to confirm the DME is operational.
                </p>
            </div>
        </div>
    );
};

// ============================================================================
// SECTION 3: PRINCIPLE OF OPERATION
// ============================================================================
const PrincipleOfOperation: React.FC = () => {
    const [showCalc, setShowCalc] = useState(false);
    const [totalTime, setTotalTime] = useState(150); // microseconds (round trip)

    const GROUND_DELAY = 50; // µs
    const flightTime = (totalTime - GROUND_DELAY) / 2;
    const speedOfLight = 299792.458; // km/s = 0.162 NM/µs
    const distance = (flightTime * 0.162).toFixed(2);

    return (
        <div className="space-y-6">
            {/* Formula Card */}
            <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border border-emerald-500/20">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Timer className="text-emerald-400" /> Time-Based Distance Measurement
                </h4>

                <div className="text-center py-6 bg-slate-900/50 rounded-xl border border-slate-700">
                    <div className="text-2xl font-mono text-white mb-2">
                        Distance = <span className="text-emerald-300">Speed</span> × <span className="text-amber-300">Time</span>
                    </div>
                    <div className="text-sm text-slate-400">
                        Since Speed ≈ 162 NM/ms (speed of light), we measure the round-trip time.
                    </div>
                </div>

                <div className="mt-4 text-center text-sm text-slate-400">
                    The aircraft subtracts the known <strong className="text-amber-300">50 µs ground delay</strong>, halves the result for one-way distance.
                </div>
            </div>

            {/* Timeline Visualization */}
            <div className="glass-panel p-6 rounded-2xl">
                <h4 className="text-lg font-bold text-white mb-4">Time Delay Breakdown</h4>

                <div className="relative bg-slate-900/70 rounded-xl p-6 border border-slate-700">
                    <svg viewBox="0 0 500 120" className="w-full">
                        {/* Timeline */}
                        <line x1="50" y1="60" x2="450" y2="60" stroke="#475569" strokeWidth="2" />

                        {/* T0: Interrogation */}
                        <circle cx="50" cy="60" r="6" fill="#f59e0b" />
                        <text x="50" y="90" textAnchor="middle" fill="#f59e0b" fontSize="10">T₀</text>
                        <text x="50" y="105" textAnchor="middle" fill="#94a3b8" fontSize="8">Interrogate</text>

                        {/* T1: Arrival at ground */}
                        <circle cx="175" cy="60" r="6" fill="#22d3ee" />
                        <text x="175" y="90" textAnchor="middle" fill="#22d3ee" fontSize="10">T₁</text>
                        <text x="175" y="105" textAnchor="middle" fill="#94a3b8" fontSize="8">Received</text>

                        {/* Ground Delay */}
                        <rect x="175" y="50" width="75" height="20" fill="#10b981" fillOpacity="0.3" rx="4" />
                        <text x="212" y="45" textAnchor="middle" fill="#10b981" fontSize="9">50 µs delay</text>

                        {/* T2: Reply sent */}
                        <circle cx="250" cy="60" r="6" fill="#10b981" />
                        <text x="250" y="90" textAnchor="middle" fill="#10b981" fontSize="10">T₂</text>
                        <text x="250" y="105" textAnchor="middle" fill="#94a3b8" fontSize="8">Reply</text>

                        {/* T3: Reply arrives */}
                        <circle cx="375" cy="60" r="6" fill="#a855f7" />
                        <text x="375" y="90" textAnchor="middle" fill="#a855f7" fontSize="10">T₃</text>
                        <text x="375" y="105" textAnchor="middle" fill="#94a3b8" fontSize="8">Received</text>

                        {/* Transit time labels */}
                        <path d="M 50 40 Q 112 20 175 40" fill="none" stroke="#64748b" strokeDasharray="3" />
                        <text x="112" y="25" textAnchor="middle" fill="#64748b" fontSize="8">Transit</text>

                        <path d="M 250 40 Q 312 20 375 40" fill="none" stroke="#64748b" strokeDasharray="3" />
                        <text x="312" y="25" textAnchor="middle" fill="#64748b" fontSize="8">Transit</text>
                    </svg>
                </div>

                <div className="mt-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700 font-mono text-sm text-center">
                    <span className="text-emerald-300">One-Way Time</span> = (<span className="text-amber-300">T₃</span> - <span className="text-amber-300">T₀</span> - <span className="text-purple-300">50µs</span>) / 2
                </div>
            </div>

            {/* Interactive Calculator */}
            <div className="glass-panel p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <Ruler className="text-blue-400" /> Distance Calculator
                    </h4>
                    <button
                        onClick={() => setShowCalc(!showCalc)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${showCalc ? 'bg-blue-500/30 text-blue-200' : 'bg-slate-700 text-slate-300'}`}
                    >
                        {showCalc ? 'Hide' : 'Try It'}
                    </button>
                </div>

                {showCalc && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-slate-400 flex justify-between mb-2">
                                <span>Total Round-Trip Time</span>
                                <span className="text-amber-300 font-mono">{totalTime} µs</span>
                            </label>
                            <input
                                type="range"
                                min="60"
                                max="1000"
                                step="10"
                                value={totalTime}
                                onChange={(e) => setTotalTime(parseInt(e.target.value))}
                                className="w-full accent-amber-500"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                                <div className="text-xs text-slate-400">Ground Delay</div>
                                <div className="text-lg font-mono text-amber-300">{GROUND_DELAY} µs</div>
                            </div>
                            <div className="bg-cyan-500/10 p-3 rounded-lg border border-cyan-500/20">
                                <div className="text-xs text-slate-400">One-Way Time</div>
                                <div className="text-lg font-mono text-cyan-300">{flightTime.toFixed(1)} µs</div>
                            </div>
                            <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                                <div className="text-xs text-slate-400">Distance</div>
                                <div className="text-lg font-mono text-emerald-300">{distance} NM</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ============================================================================
// SECTION 4: SLANT RANGE VS GROUND RANGE
// ============================================================================
const SlantRangeSection: React.FC = () => {
    const [altitude, setAltitude] = useState(30000); // Feet
    const [groundDist, setGroundDist] = useState(10); // NM

    // Calculations
    const altitudeNM = altitude / 6076.12;
    const slantRange = Math.sqrt(Math.pow(groundDist, 2) + Math.pow(altitudeNM, 2));
    const error = slantRange - groundDist;
    const errorPercent = groundDist > 0 ? (error / groundDist) * 100 : 0;

    return (
        <div className="space-y-6">
            {/* Definition */}
            <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-500/20">
                <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <Ruler className="text-amber-400" /> Slant Range Explained
                </h4>
                <p className="text-slate-300 leading-relaxed">
                    DME measures the <strong className="text-amber-300">direct line-of-sight distance</strong> (slant range)
                    between the aircraft and the station — not the horizontal ground distance. This creates a geometric error
                    that increases when <strong className="text-red-300">close to the station</strong> or at <strong className="text-red-300">high altitude</strong>.
                </p>
            </div>

            {/* Interactive Simulator */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Triangle Visualizer */}
                <div className="glass-panel p-6 rounded-2xl bg-slate-900/50 min-h-[350px] flex items-center justify-center">
                    <div className="relative w-full max-w-[350px] aspect-[4/3]">
                        {/* Ground Line */}
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-600" />

                        {/* Vertical Line (Altitude) */}
                        <div className="absolute bottom-0 right-0 w-0.5 bg-blue-500" style={{ height: `${Math.min(altitudeNM * 20, 80)}%` }} />

                        {/* Aircraft */}
                        <div
                            className="absolute right-0 transform translate-x-1/2 text-2xl"
                            style={{ bottom: `${Math.min(altitudeNM * 20, 80)}%` }}
                        >
                            ✈️
                        </div>

                        {/* Station */}
                        <div className="absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2">
                            <div className="w-4 h-6 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t" />
                            <div className="text-xs text-emerald-400 mt-2 whitespace-nowrap">DME</div>
                        </div>

                        {/* Slant Range Line */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                            <line
                                x1="5%"
                                y1="100%"
                                x2="100%"
                                y2={`${100 - Math.min(altitudeNM * 20, 80)}%`}
                                stroke="#22d3ee"
                                strokeWidth="2"
                                strokeDasharray="6,4"
                            />
                        </svg>

                        {/* Labels */}
                        <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 text-xs text-slate-400">
                            Ground: <span className="text-white font-mono">{groundDist} NM</span>
                        </div>
                        <div className="absolute right-[-80px] top-1/2 -translate-y-1/2 text-xs text-blue-400">
                            Alt: {altitudeNM.toFixed(1)} NM
                        </div>
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-sm text-cyan-400 font-bold">
                            Slant: {slantRange.toFixed(2)} NM
                        </div>
                    </div>
                </div>

                {/* Controls & Data */}
                <div className="space-y-4">
                    <div className="glass-panel p-5 rounded-xl space-y-4">
                        <div>
                            <label className="text-xs text-slate-400 flex justify-between mb-2">
                                <span>Aircraft Altitude</span>
                                <span className="text-white font-mono">{altitude.toLocaleString()} ft</span>
                            </label>
                            <input
                                type="range" min="0" max="50000" step="1000"
                                value={altitude}
                                onChange={(e) => setAltitude(parseInt(e.target.value))}
                                className="w-full accent-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-slate-400 flex justify-between mb-2">
                                <span>Ground Distance</span>
                                <span className="text-white font-mono">{groundDist} NM</span>
                            </label>
                            <input
                                type="range" min="0" max="50" step="0.5"
                                value={groundDist}
                                onChange={(e) => setGroundDist(parseFloat(e.target.value))}
                                className="w-full accent-emerald-500"
                            />
                        </div>
                    </div>

                    {/* Results */}
                    <div className="glass-panel p-5 rounded-xl space-y-3 bg-slate-950/70">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-sm">DME Indication:</span>
                            <span className="text-cyan-400 font-bold font-mono text-xl">{slantRange.toFixed(2)} NM</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-sm">True Ground Distance:</span>
                            <span className="text-slate-200 font-mono">{groundDist.toFixed(2)} NM</span>
                        </div>
                        <div className="h-px bg-white/10" />
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-xs">Slant Range Error:</span>
                            <span className={`${error > 0.5 ? 'text-red-400' : 'text-green-400'} font-bold text-sm`}>
                                +{error.toFixed(2)} NM ({errorPercent.toFixed(1)}%)
                            </span>
                        </div>
                    </div>

                    {/* Rule of Thumb */}
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs leading-relaxed text-blue-200">
                        <strong>Rule of Thumb:</strong> When ground distance is at least <span className="text-white font-bold">1 NM for every 1000 ft</span> of altitude, the slant range error is negligible.
                        <div className="mt-2 font-mono text-white">
                            Current Ratio: {(groundDist / (altitude / 1000)).toFixed(1)} NM per 1000ft
                        </div>
                    </div>

                    {/* Overhead Warning */}
                    {groundDist === 0 && (
                        <div className="p-3 bg-red-500/20 text-red-300 text-sm rounded-xl border border-red-500/30 text-center font-bold animate-pulse">
                            ⚠️ OVERHEAD STATION: DME reads Altitude!
                        </div>
                    )}
                </div>
            </div>

            {/* Operational Note */}
            <div className="glass-panel p-5 rounded-xl bg-emerald-900/10 border border-emerald-500/20">
                <p className="text-sm text-emerald-200">
                    <strong>Operational Note:</strong> Procedures (SIDs, STARs, approaches) are designed based on slant range.
                    Always fly the indicated DME distance regardless of the geometric discrepancy.
                </p>
            </div>
        </div>
    );
};

// ============================================================================
// SECTION 5: SYSTEM FEATURES & ERRORS
// ============================================================================
const SystemFeaturesErrors: React.FC = () => {
    const [aircraftCount, setAircraftCount] = useState(60);
    const [signalLost, setSignalLost] = useState(false);
    const [memoryCountdown, setMemoryCountdown] = useState(10);
    const [zeroOffset, setZeroOffset] = useState(false);

    const MAX_CAPACITY = 100;
    const isSaturated = aircraftCount > MAX_CAPACITY;

    useEffect(() => {
        if (signalLost) {
            const interval = setInterval(() => {
                setMemoryCountdown(prev => {
                    if (prev <= 0) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setMemoryCountdown(10);
        }
    }, [signalLost]);

    return (
        <div className="space-y-6">
            {/* System Accuracy */}
            <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/20">
                <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <Signal className="text-green-400" /> System Accuracy
                </h4>
                <div className="flex items-center gap-6">
                    <div className="text-4xl font-bold text-green-400">±0.2 NM</div>
                    <p className="text-slate-400 text-sm">
                        Modern DME systems are accurate to within <strong className="text-green-300">±0.2 NM</strong> for <strong className="text-green-300">95%</strong> of the time.
                    </p>
                </div>
            </div>

            {/* Beacon Saturation */}
            <div className="glass-panel p-6 rounded-2xl">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="text-amber-400" /> Beacon Saturation
                </h4>

                <p className="text-sm text-slate-400 mb-4">
                    A DME ground station can handle approximately <strong className="text-white">100 aircraft</strong> simultaneously.
                    When overloaded, it prioritizes <strong className="text-amber-300">stronger signals</strong> (closer aircraft).
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-slate-400 flex justify-between mb-2">
                            <span>Aircraft Interrogating</span>
                            <span className={`font-mono ${isSaturated ? 'text-red-400' : 'text-white'}`}>{aircraftCount}</span>
                        </label>
                        <input
                            type="range" min="10" max="150" step="5"
                            value={aircraftCount}
                            onChange={(e) => setAircraftCount(parseInt(e.target.value))}
                            className="w-full accent-amber-500"
                        />
                    </div>

                    <div className="relative h-20 bg-slate-900/70 rounded-xl overflow-hidden border border-slate-700">
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* Aircraft icons */}
                            <div className="flex flex-wrap gap-1 justify-center max-w-[80%]">
                                {Array.from({ length: Math.min(aircraftCount, 30) }).map((_, i) => (
                                    <Plane
                                        key={i}
                                        size={14}
                                        className={`transition-all ${i >= (isSaturated ? 20 : 30) ? 'text-red-400/50 animate-pulse' : 'text-cyan-400'}`}
                                    />
                                ))}
                                {aircraftCount > 30 && (
                                    <span className="text-xs text-slate-500">+{aircraftCount - 30} more</span>
                                )}
                            </div>
                        </div>

                        {/* Capacity line */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700">
                            <div
                                className={`h-full transition-all ${isSaturated ? 'bg-red-500' : 'bg-emerald-500'}`}
                                style={{ width: `${Math.min((aircraftCount / MAX_CAPACITY) * 100, 100)}%` }}
                            />
                        </div>
                    </div>

                    {isSaturated && (
                        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-300 text-center">
                            ⚠️ <strong>Saturation!</strong> Weaker signals are being "shed" — distant aircraft may lose DME.
                        </div>
                    )}
                </div>
            </div>

            {/* Memory Mode */}
            <div className="glass-panel p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <Clock className="text-purple-400" /> Memory Mode (Coasting)
                    </h4>
                    <button
                        onClick={() => setSignalLost(!signalLost)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${signalLost ? 'bg-red-500/30 text-red-300' : 'bg-purple-500/20 text-purple-300'}`}
                    >
                        {signalLost ? 'Restore Signal' : 'Simulate Lost Signal'}
                    </button>
                </div>

                <p className="text-sm text-slate-400 mb-4">
                    If the signal is lost, the DME "coasts" — continuing to count down at the last known ground speed for approximately <strong className="text-purple-300">10 seconds</strong> before flagging a failure.
                </p>

                {signalLost && (
                    <div className={`p-4 rounded-xl border text-center ${memoryCountdown > 0 ? 'bg-purple-500/10 border-purple-500/30' : 'bg-red-500/20 border-red-500/30 animate-pulse'}`}>
                        {memoryCountdown > 0 ? (
                            <>
                                <div className="text-xs text-purple-300 mb-1">MEMORY MODE</div>
                                <div className="text-4xl font-mono text-purple-400">{memoryCountdown}s</div>
                                <div className="text-xs text-slate-500 mt-2">Coasting on last known rate...</div>
                            </>
                        ) : (
                            <>
                                <div className="text-xl font-bold text-red-400">⚠️ DME FLAG</div>
                                <div className="text-xs text-red-300 mt-1">Signal lost — data unreliable</div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Zero Point Offset */}
            <div className="glass-panel p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <Ruler className="text-cyan-400" /> Zero Point Offsetting
                    </h4>
                    <button
                        onClick={() => setZeroOffset(!zeroOffset)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${zeroOffset ? 'bg-cyan-500/30 text-cyan-200' : 'bg-slate-700 text-slate-300'}`}
                    >
                        {zeroOffset ? 'Standard' : 'With Offset'}
                    </button>
                </div>

                <p className="text-sm text-slate-400 mb-4">
                    For ILS approaches, the ground delay can be reduced (e.g., from 50µs to 25µs) so the DME reads
                    <strong className="text-cyan-300"> "zero" at the runway threshold</strong> rather than at the beacon location.
                </p>

                <div className="relative h-24 bg-slate-900/70 rounded-xl overflow-hidden border border-slate-700 p-4">
                    {/* Runway */}
                    <div className="absolute bottom-4 left-8 right-8 h-8 bg-gradient-to-t from-slate-700 to-slate-600 rounded flex items-center justify-center">
                        <div className="w-1/2 h-1 bg-white/40 rounded" />
                    </div>

                    {/* Threshold */}
                    <div className="absolute bottom-4 left-8 w-4 h-8 border-l-4 border-amber-500" />
                    <div className="absolute bottom-14 left-8 text-xs text-amber-400">Threshold</div>

                    {/* DME Beacon */}
                    <div className={`absolute bottom-4 h-8 flex flex-col items-center justify-end transition-all duration-500 ${zeroOffset ? 'right-8' : 'right-20'}`}>
                        <div className="w-3 h-5 bg-emerald-500 rounded-t" />
                        <div className="text-xs text-emerald-400 mt-1">DME</div>
                    </div>

                    {/* Zero reading indicator */}
                    {zeroOffset && (
                        <div className="absolute bottom-14 left-8 text-xs text-cyan-400 animate-pulse">
                            DME = 0.0 NM here!
                        </div>
                    )}
                </div>
            </div>

            {/* Multipath Reflections */}
            <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-500/20">
                <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <Waves className="text-orange-400" /> Multipath Reflections
                </h4>
                <p className="text-sm text-slate-300 mb-4">
                    Signals can bounce off terrain or buildings, arriving later than the direct path.
                    To avoid errors, the receiver locks onto only the <strong className="text-orange-300">first (shortest)</strong> pulse pair and ignores subsequent reflections.
                </p>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                    <svg viewBox="0 0 300 80" className="w-full">
                        {/* Direct path */}
                        <line x1="30" y1="40" x2="270" y2="40" stroke="#22d3ee" strokeWidth="2" />
                        <text x="150" y="35" textAnchor="middle" fill="#22d3ee" fontSize="9">Direct (used)</text>

                        {/* Reflected path */}
                        <polyline points="30,40 150,70 270,40" fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4" opacity="0.6" />
                        <text x="150" y="78" textAnchor="middle" fill="#f97316" fontSize="8">Reflected (ignored)</text>

                        {/* Aircraft */}
                        <circle cx="30" cy="40" r="8" fill="#1e293b" stroke="#22d3ee" strokeWidth="1" />
                        <text x="30" y="43" textAnchor="middle" fill="#fff" fontSize="8">✈</text>

                        {/* Station */}
                        <rect x="262" y="35" width="12" height="15" fill="#10b981" rx="2" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const DMESystem: React.FC<Props> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        { id: 0, label: 'Fundamentals', icon: Radio, color: 'blue' },
        { id: 1, label: 'Signal', icon: Waves, color: 'cyan' },
        { id: 2, label: 'Operation', icon: Timer, color: 'emerald' },
        { id: 3, label: 'Slant Range', icon: Ruler, color: 'amber' },
        { id: 4, label: 'Features & Errors', icon: AlertTriangle, color: 'red' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 0: return <SystemFundamentals />;
            case 1: return <SignalCharacteristics />;
            case 2: return <PrincipleOfOperation />;
            case 3: return <SlantRangeSection />;
            case 4: return <SystemFeaturesErrors />;
            default: return null;
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => onNavigate?.(View.RAD_NAV_HOME)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
                            <Ruler className="w-6 h-6 text-white" />
                        </div>
                        DME: Distance Measuring Equipment
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Secondary Radar • UHF Band • Slant Range Measurement</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 p-1 bg-slate-900/50 rounded-xl border border-slate-800">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? `bg-${tab.color}-500/20 text-${tab.color}-300 border border-${tab.color}-500/30`
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                }`}
                        >
                            <Icon size={16} />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div className="animate-in fade-in duration-300">
                {renderContent()}
            </div>
        </div>
    );
};

export default DMESystem;
