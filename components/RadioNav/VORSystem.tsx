import React, { useState, useEffect, useRef } from 'react';
import { View } from '../../types';
import {
    ArrowLeft, Radio, Compass, AlertTriangle, Navigation,
    Signal, Zap, Waves, Eye, Settings, Info, Map,
    RotateCw, Plane, Activity, Activity as OscIcon
} from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const VORSystem: React.FC<Props> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState('FUNDAMENTALS');

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6 pb-20">
            <div className="flex items-center space-x-4 mb-6">
                <button
                    onClick={() => onNavigate?.(View.RAD_NAV_HOME)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                        <Compass className="text-blue-400" size={32} />
                        VOR System
                    </h1>
                    <p className="text-slate-400 mt-1">Very High Frequency Omnidirectional Range</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 p-1 bg-slate-900/80 rounded-xl backdrop-blur-sm border border-slate-800 sticky top-4 z-50">
                <TabButton id="FUNDAMENTALS" label="Fundamentals" icon={<Info size={18} />} active={activeTab} setActive={setActiveTab} />
                <TabButton id="PRINCIPLES" label="Principles" icon={<Waves size={18} />} active={activeTab} setActive={setActiveTab} />
                <TabButton id="INSTRUMENTS" label="Instruments" icon={<Compass size={18} />} active={activeTab} setActive={setActiveTab} />
                <TabButton id="PROCEDURES" label="Procedures" icon={<Map size={18} />} active={activeTab} setActive={setActiveTab} />
                <TabButton id="ERRORS" label="Errors" icon={<AlertTriangle size={18} />} active={activeTab} setActive={setActiveTab} />
            </div>

            <div className="min-h-[600px] transition-all duration-300">
                {activeTab === 'FUNDAMENTALS' && <FundamentalsSection />}
                {activeTab === 'PRINCIPLES' && <PrinciplesSection />}
                {activeTab === 'INSTRUMENTS' && <InstrumentsSection />}
                {activeTab === 'PROCEDURES' && <ProceduresSection />}
                {activeTab === 'ERRORS' && <ErrorsSection />}
            </div>
        </div>
    );
};

const TabButton = ({ id, label, icon, active, setActive }: any) => (
    <button
        onClick={() => setActive(id)}
        className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${active === id
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
    >
        {icon}
        {label}
    </button>
);

// === SECTION 1: FUNDAMENTALS ===
const FundamentalsSection = () => {
    const [freq, setFreq] = useState(112.5);
    const vorMin = 108.0;
    const vorMax = 117.95;
    const isInVORRange = freq >= vorMin && freq <= vorMax;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                    <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                        <Info size={20} /> What is VOR?
                    </h3>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        <strong className="text-white">VOR (Very High Frequency Omnidirectional Range)</strong> is a short-to-medium range navigation system.
                        Unlike NDB which only gives an arrow to the station, VOR provides <strong className="text-white">360 unique radials</strong> (magnetic tracks) extending from the station.
                    </p>
                    <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-bold text-white mb-2">Key Facts</h4>
                        <ul className="text-sm text-slate-300 space-y-2">
                            <li>• <strong className="text-white">VHF Band:</strong> 108.00 MHz – 117.95 MHz</li>
                            <li>• <strong className="text-white">Identification:</strong> 3-letter Morse code every 10s (at 1020 Hz)</li>
                            <li>• <strong className="text-white">Type:</strong> Line-of-sight navigation (Short range)</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 flex flex-col">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Frequency Spectrum</h4>
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="relative h-16 bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 rounded-lg overflow-hidden mb-4">
                            <div
                                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] transition-all"
                                style={{ left: `${((freq - 100) / 25) * 100}%` }}
                            />
                            <div className="absolute inset-0 flex items-center justify-between px-4 text-[10px] text-white/50">
                                <span>100 MHz</span>
                                <span>VOR RANGE</span>
                                <span>125 MHz</span>
                            </div>
                            <div
                                className="absolute top-0 bottom-0 bg-blue-500/20 border-x border-blue-500/50"
                                style={{
                                    left: `${((vorMin - 100) / 25) * 100}%`,
                                    width: `${((vorMax - vorMin) / 25) * 100}%`
                                }}
                            />
                        </div>
                        <input
                            type="range" min="100" max="125" step="0.05" value={freq}
                            onChange={(e) => setFreq(Number(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-slate-400 text-sm">Selected:</span>
                            <span className={`text-2xl font-mono ${isInVORRange ? 'text-blue-400' : 'text-red-400'}`}>
                                {freq.toFixed(2)} MHz
                            </span>
                        </div>
                        {isInVORRange ? (
                            <div className="mt-2 text-green-400 text-sm text-center bg-green-900/20 p-2 rounded">✓ Within VOR frequency range</div>
                        ) : (
                            <div className="mt-2 text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">✗ Outside VOR range</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Identification Animation */}
            <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Identification Process</h3>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <p className="text-slate-300 mb-4 text-sm">
                            Every 10 seconds, the station transmits its <strong className="text-white">3-letter identifier</strong>.
                            This is critical for ensuring the pilot is tracking the correct station.
                        </p>
                        <div className="flex gap-2">
                            <div className="bg-slate-800 px-3 py-1 rounded font-mono text-xl text-blue-400 animate-pulse">
                                • • —&nbsp;&nbsp;&nbsp;— • • •&nbsp;&nbsp;&nbsp;— • — •
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 font-mono">(Morse for "ABC")</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative h-32 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="absolute border border-blue-500/30 rounded-full animate-ping"
                                    style={{
                                        width: `${i * 40}px`,
                                        height: `${i * 40}px`,
                                        animationDuration: '3s',
                                        animationDelay: `${i * 0.5}s`
                                    }}
                                />
                            ))}
                            <div className="relative z-10 font-bold text-xs text-blue-400 bg-slate-900 px-2 rounded">1020 Hz TONE</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// === SECTION 2: PRINCIPLES ===
const PrinciplesSection = () => {
    const [mode, setMode] = useState<'STANDARD' | 'DOPPLER'>('STANDARD');
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setPhase(p => (p + 5) % 360), 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                        <h3 className="text-xl font-bold text-blue-400 mb-4">Phase Difference Principle</h3>
                        <p className="text-slate-300 mb-4 text-sm">
                            The receiver compares two 30 Hz signals to determine the bearing.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => setMode('STANDARD')}
                                className={`w-full p-4 rounded-lg text-left transition-all ${mode === 'STANDARD' ? 'bg-blue-600/20 border-2 border-blue-500' : 'bg-slate-800 border border-slate-700'}`}
                            >
                                <div className="font-bold text-white">Standard VOR (CVOR)</div>
                                <div className="text-sm text-slate-400">Reference: FM | Variable: AM (Rotating)</div>
                            </button>
                            <button
                                onClick={() => setMode('DOPPLER')}
                                className={`w-full p-4 rounded-lg text-left transition-all ${mode === 'DOPPLER' ? 'bg-purple-600/20 border-2 border-purple-500' : 'bg-slate-800 border border-slate-700'}`}
                            >
                                <div className="font-bold text-white">Doppler VOR (DVOR)</div>
                                <div className="text-sm text-slate-400">Reference: AM | Variable: FM (Doppler shift)</div>
                            </button>
                        </div>

                        <div className="mt-6 p-4 bg-slate-800 rounded-lg text-xs leading-relaxed">
                            <strong className="text-blue-400 block mb-1">How it works:</strong>
                            {mode === 'STANDARD' ? (
                                "Uses a stationary reference signal and a rotating signal. At Magnetic North, signals are in phase. As the beam rotates, the phase difference increases proportionally to the bearing."
                            ) : (
                                "Uses a circular array of antennas to simulate a rotating source, creating a Doppler shift. This design is highly resistant to signal reflection errors (site error)."
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 flex flex-col items-center justify-center">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-8">Phase Comparison (30 Hz)</h4>

                    <div className="relative w-full h-48 bg-black/50 rounded-lg border border-slate-800 overflow-hidden px-4">
                        <svg className="w-full h-full" viewBox="0 0 400 200">
                            {/* Grid */}
                            <line x1="0" y1="100" x2="400" y2="100" stroke="#334155" strokeDasharray="5,5" />

                            {/* Reference Signal */}
                            <path
                                d={`M ${Array.from({ length: 40 }).map((_, i) => {
                                    const x = i * 10;
                                    const y = 100 + Math.sin((x + phase) * 0.05) * 40;
                                    return `${x},${y}`;
                                }).join(' L ')}`}
                                fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.6"
                            />

                            {/* Variable Signal */}
                            <path
                                d={`M ${Array.from({ length: 40 }).map((_, i) => {
                                    const x = i * 10;
                                    const y = 100 + Math.sin((x + phase + 90) * 0.05) * 40;
                                    return `${x},${y}`;
                                }).join(' L ')}`}
                                fill="none" stroke="#3b82f6" strokeWidth="3"
                            />
                        </svg>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4 w-full">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                            <span className="text-[10px] text-slate-400">Reference Signal</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full" />
                            <span className="text-[10px] text-slate-400">Variable (Phase: 90°)</span>
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <div className="text-lg font-mono text-white">Bearing: 090°</div>
                        <div className="text-[10px] text-slate-500 italic">Phase shift = Azimuth</div>
                    </div>
                </div>
            </div>

            {/* Spokes on a wheel graphic */}
            <div className="glass-panel p-8 rounded-xl border border-slate-700 bg-slate-900/50 flex flex-col items-center">
                <h3 className="text-xl font-bold text-blue-400 mb-6">"Spokes on a Wheel" Concept</h3>
                <div className="relative w-64 h-64 border-2 border-slate-700 rounded-full">
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
                        <div key={deg} className="absolute inset-0" style={{ transform: `rotate(${deg}deg)` }}>
                            <div className="w-0.5 h-full bg-blue-500/10 mx-auto" />
                            <div className="absolute top-0 left-1/2 -ml-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-[0_0_10px_#60a5fa]"
                                style={{ animationDelay: `${deg / 30 * 0.2}s` }} />
                        </div>
                    ))}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_20px_#2563eb]">
                        <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                    </div>
                </div>
                <p className="text-center text-sm text-slate-400 mt-6 max-w-md">
                    The VOR acts like a lighthouse with 360 individual beams. Your receiver simply determines which "spoke" you are currently on.
                </p>
            </div>
        </div>
    );
};

// === SECTION 3: INSTRUMENTS ===
const InstrumentsSection = () => {
    const [obs, setObs] = useState(360);
    const [radial, setRadial] = useState(10);
    const [type, setType] = useState<'OBI' | 'HSI' | 'RMI'>('OBI');

    // CDI Calculations
    let diff = radial - obs;
    while (diff <= -180) diff += 360;
    while (diff > 180) diff -= 360;

    const absDiff = Math.abs(diff);
    let flag: 'TO' | 'FROM' | 'OFF' = 'OFF';
    if (absDiff < 89) flag = 'FROM';
    else if (absDiff > 91) flag = 'TO';

    let deflection = 0;
    if (flag === 'FROM') deflection = diff;
    else if (flag === 'TO') {
        if (diff > 0) deflection = diff - 180;
        else deflection = diff + 180;
    }
    const clampedDeflection = Math.max(-10, Math.min(10, deflection));

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                        <h3 className="text-xl font-bold text-blue-400 mb-6">Instrument Comparison</h3>
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {(['OBI', 'HSI', 'RMI'] as const).map(t => (
                                <button key={t} onClick={() => setType(t)}
                                    className={`p-3 rounded-lg text-sm font-bold transition-all ${type === t ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                                    {t}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                                <h4 className="font-bold text-white mb-2 text-sm">
                                    {type === 'OBI' && "OBI (Omni Bearing Indicator)"}
                                    {type === 'HSI' && "HSI (Horizontal Situation Indicator)"}
                                    {type === 'RMI' && "RMI (Radio Magnetic Indicator)"}
                                </h4>
                                <ul className="text-xs text-slate-400 space-y-2">
                                    {type === 'OBI' && (
                                        <>
                                            <li>• Standard CDI needle for course deviation.</li>
                                            <li>• <strong className="text-white">TO/FROM</strong> flag indicates which sector you are in.</li>
                                            <li>• OBS knob used to select the desired radial.</li>
                                        </>
                                    )}
                                    {type === 'HSI' && (
                                        <>
                                            <li>• Combines VOR with Compass/Directional Gyro.</li>
                                            <li>• Shows aircraft heading and course simultaneously.</li>
                                            <li>• <strong className="text-white">Situational Awareness:</strong> Much easier to visualize intercepts.</li>
                                        </>
                                    )}
                                    {type === 'RMI' && (
                                        <>
                                            <li>• Simple needle pointing to station.</li>
                                            <li>• No OBS selection; needle head always shows <strong className="text-white">QDM</strong>.</li>
                                            <li>• Compass card is slaved (rotating).</li>
                                        </>
                                    )}
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                                        <span>Selected Course (OBS)</span>
                                        <span>{obs.toString().padStart(3, '0')}°</span>
                                    </div>
                                    <input type="range" min="0" max="359" value={obs} onChange={e => setObs(Number(e.target.value))} className="w-full accent-blue-500" disabled={type === 'RMI'} />
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                                        <span>Aircraft Position (Radial)</span>
                                        <span>{radial.toString().padStart(3, '0')}°</span>
                                    </div>
                                    <input type="range" min="0" max="359" value={radial} onChange={e => setRadial(Number(e.target.value))} className="w-full accent-green-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0a0a0a] rounded-xl border border-slate-800 p-8 flex flex-col items-center justify-center">
                    {/* The Instrument Graphic */}
                    {type === 'OBI' && (
                        <div className="relative w-64 h-64 rounded-full border-8 border-slate-800 bg-slate-900 shadow-2xl flex items-center justify-center">
                            {/* Compass card mockup */}
                            <div className="absolute inset-4 rounded-full border border-slate-700 flex items-center justify-center">
                                <div className="text-[10px] text-slate-600 font-bold mb-48">N</div>
                                <div className="text-3xl font-mono text-yellow-500 font-bold bg-black px-2 rounded border border-white/5">{obs.toString().padStart(3, '0')}°</div>
                            </div>

                            {/* Deviation Dots */}
                            <div className="flex gap-4 items-center">
                                {[...Array(5)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-700" />)}
                                <div className="w-4 h-4 rounded-full border-2 border-slate-400 bg-transparent" />
                                {[...Array(5)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-700" />)}
                            </div>

                            {/* Needle */}
                            <div className="absolute w-1 h-40 bg-white transition-transform duration-500 shadow-[0_0_10px_white]"
                                style={{ transform: `translateX(${-clampedDeflection * 8}px)` }} />

                            {/* Flags */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-8 flex gap-8">
                                <div className={`text-[8px] font-black px-1 rounded ${flag === 'TO' ? 'bg-white text-black' : 'text-slate-800 bg-slate-950'}`}>TO</div>
                                <div className={`text-[8px] font-black px-1 rounded ${flag === 'FROM' ? 'bg-white text-black' : 'text-slate-800 bg-slate-950'}`}>FR</div>
                            </div>
                        </div>
                    )}

                    {type === 'HSI' && (
                        <div className="relative w-64 h-64 rounded-xl border-4 border-slate-800 bg-[#111] overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-2 border-2 border-slate-700 rounded-full" />
                            {/* Heading Bug / Card Rotation simulation */}
                            <div className="absolute w-1 h-32 bg-blue-500 -top-4 rounded-full" />
                            <div className="text-xl font-bold text-white z-10">HSI VIEW</div>
                            <div className="absolute bottom-4 text-[10px] text-slate-500">Integrated Course/Heading</div>
                        </div>
                    )}

                    {type === 'RMI' && (
                        <div className="relative w-64 h-64 rounded-full border-4 border-slate-800 bg-slate-900 shadow-2xl flex items-center justify-center">
                            {/* Compass card slaved logic (static for sim) */}
                            <div className="absolute inset-2 border-2 border-slate-700 rounded-full" />
                            <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500"
                                style={{ transform: `rotate(${radial}deg)` }}>
                                <div className="w-1 h-full flex flex-col justify-between py-4">
                                    <div className="w-4 h-4 rounded-full bg-blue-500 mx-auto" />
                                    <div className="w-0.5 h-full bg-blue-400/50 mx-auto" />
                                </div>
                            </div>
                            <div className="relative z-10 bg-slate-950 px-2 py-1 rounded text-blue-400 font-mono text-lg">{radial.toString().padStart(3, '0')}°</div>
                            <div className="absolute bottom-4 text-[10px] text-slate-500">Needle Points To Station</div>
                        </div>
                    )}

                    <div className="mt-8 bg-slate-900/50 p-4 rounded-lg border border-slate-800 w-full max-w-xs text-center">
                        <div className="text-xs text-slate-500 mb-1">CDI Interpretation</div>
                        <div className="text-sm font-bold text-white mb-2">
                            {Math.abs(deflection) < 0.5 ? "On Centerline" : `Off Course: ${Math.abs(Math.round(deflection))}°`}
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                            <span className="bg-slate-800 px-2 py-1 rounded">1 dot = 2°</span>
                            <span className="bg-slate-800 px-2 py-1 rounded">FSD = 10°</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// === SECTION 4: PROCEDURES ===
const ProceduresSection = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                    <h3 className="text-xl font-bold text-blue-400 mb-4">Radials vs Reciprocals</h3>
                    <div className="space-y-4">
                        <div className="bg-slate-800 p-4 rounded-lg flex gap-4 items-center">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold">FROM</div>
                            <div>
                                <h4 className="font-bold text-white">Radial</h4>
                                <p className="text-xs text-slate-400">Magnetic bearing FROM the beacon (QDR).</p>
                            </div>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-lg flex gap-4 items-center">
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-bold">TO</div>
                            <div>
                                <h4 className="font-bold text-white">Track (QDM)</h4>
                                <p className="text-xs text-slate-400">Magnetic course TO the beacon. (Radial + 180°)</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 p-6">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Course Intercept Logic</h4>
                    <div className="relative h-64 rounded-lg overflow-hidden flex items-center justify-center">
                        {/* Interactive diagram visual */}
                        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />
                        <div className="relative w-48 h-48">
                            {/* VOR */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-sm rotate-45" />

                            {/* Selected Course Line */}
                            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-blue-500/50" />

                            {/* Aircraft */}
                            <div className="absolute bottom-8 right-8 text-2xl animate-bounce">✈️</div>

                            {/* Intercept Arrow */}
                            <svg className="absolute inset-0 w-full h-full">
                                <path d="M 150 160 L 100 120" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" markerEnd="url(#arrow)" />
                                <defs>
                                    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                                    </marker>
                                </defs>
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded text-xs text-blue-300">
                        <strong className="block mb-1">Standard Intercept:</strong>
                        To re-intercept a radial, turn toward the CDI needle (apply a 30° or 45° intercept angle).
                    </div>
                </div>
            </div>
        </div>
    );
};

// === SECTION 5: ERRORS ===
const ErrorsSection = () => {
    const [h1, setH1] = useState(1000);
    const [h2, setH2] = useState(3000);
    const range = (1.23 * (Math.sqrt(h1) + Math.sqrt(h2))).toFixed(1);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-blue-400">System Errors & Limitations</h3>
                    <div className="space-y-3">
                        <ErrorCard
                            title="Cone of Confusion"
                            desc="Directly overhead the station, the signal is vertical/unreliable. Needle wavers and flags fluctuate."
                            icon={<Zap className="text-yellow-400" />}
                        />
                        <ErrorCard
                            title="Scalloping / Bending"
                            desc="Reflections from obstacles (multipath) cause the course to waver or bend."
                            icon={<Activity className="text-red-400" />}
                        />
                        <ErrorCard
                            title="Line of Sight"
                            desc="VHF waves do not follow Earth's curvature. Range is limited by altitude."
                            icon={<Eye className="text-blue-400" />}
                        />
                    </div>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 p-6">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Line of Sight Calculator</h4>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>VOR Transmitter Height (ft)</span>
                                <span className="text-white font-mono">{h1} ft</span>
                            </div>
                            <input type="range" min="0" max="5000" value={h1} onChange={e => setH1(Number(e.target.value))} className="w-full accent-blue-500" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>Aircraft Receiver Height (ft)</span>
                                <span className="text-white font-mono">{h2} ft</span>
                            </div>
                            <input type="range" min="0" max="45000" step="500" value={h2} onChange={e => setH2(Number(e.target.value))} className="w-full accent-blue-500" />
                        </div>

                        <div className="p-6 bg-slate-900 rounded-xl border-t-4 border-blue-600 text-center">
                            <div className="text-xs text-slate-500 uppercase font-bold mb-2 tracking-widest text-[8px]">Theoretical Max Range</div>
                            <div className="text-4xl font-black text-white mb-2">{range} <span className="text-lg font-normal text-slate-400">NM</span></div>
                            <div className="text-[10px] text-slate-500 font-mono">1.23 × (√H₁ + √H₂)</div>
                        </div>

                        <div className="bg-blue-900/10 p-4 rounded-lg border border-blue-500/20 text-[10px] text-slate-400 leading-relaxed italic">
                            "Accuracy is expected to be within ±5.0° for 95% of the time, though typical accuracy is ±1.2° to ±2.5°."
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ErrorCard = ({ title, desc, icon }: any) => (
    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex gap-4 items-start">
        <div className="p-2 bg-slate-800 rounded-lg">{icon}</div>
        <div>
            <h4 className="font-bold text-white text-sm">{title}</h4>
            <p className="text-xs text-slate-400 mt-1">{desc}</p>
        </div>
    </div>
);

export default VORSystem;
