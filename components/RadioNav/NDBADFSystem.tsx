import React, { useState, useEffect } from 'react';
import { View } from '../../types';
import { ArrowLeft, Radio, Compass, AlertTriangle, Navigation, Signal, Zap, Waves, Eye, Settings } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const NDBADFSystem: React.FC<Props> = ({ onNavigate }) => {
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
                        <Radio className="text-amber-400" size={32} />
                        NDB & ADF Systems
                    </h1>
                    <p className="text-slate-400 mt-1">Master Non-Directional Beacons and Automatic Direction Finding</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 p-1 bg-slate-900/80 rounded-xl backdrop-blur-sm border border-slate-800 sticky top-4 z-50">
                <TabButton id="FUNDAMENTALS" label="Fundamentals" icon={<Radio size={18} />} active={activeTab} setActive={setActiveTab} />
                <TabButton id="SIGNALS" label="Signals" icon={<Waves size={18} />} active={activeTab} setActive={setActiveTab} />
                <TabButton id="ANTENNA" label="Antenna Theory" icon={<Signal size={18} />} active={activeTab} setActive={setActiveTab} />
                <TabButton id="INSTRUMENTS" label="Instruments" icon={<Compass size={18} />} active={activeTab} setActive={setActiveTab} />
                <TabButton id="ERRORS" label="Errors" icon={<AlertTriangle size={18} />} active={activeTab} setActive={setActiveTab} />
            </div>

            <div className="min-h-[600px] transition-all duration-300">
                {activeTab === 'FUNDAMENTALS' && <FundamentalsSection />}
                {activeTab === 'SIGNALS' && <SignalsSection />}
                {activeTab === 'ANTENNA' && <AntennaSection />}
                {activeTab === 'INSTRUMENTS' && <InstrumentsSection />}
                {activeTab === 'ERRORS' && <ErrorsSection />}
            </div>
        </div>
    );
};

const TabButton = ({ id, label, icon, active, setActive }: any) => (
    <button
        onClick={() => setActive(id)}
        className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${active === id
            ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
    >
        {icon}
        {label}
    </button>
);

// === SECTION 1: FUNDAMENTALS ===
const FundamentalsSection = () => {
    const [freq, setFreq] = useState(350);
    const ndbMin = 190;
    const ndbMax = 1750;
    const isInNDBRange = freq >= ndbMin && freq <= ndbMax;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                    <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
                        <Radio size={20} /> What is an NDB?
                    </h3>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        A <strong className="text-white">Non-Directional Beacon (NDB)</strong> is a ground-based radio transmitter
                        that acts as a <span className="text-amber-400">"radio lighthouse"</span>. It transmits signals in
                        <strong className="text-white"> all directions</strong> (omnidirectional), allowing aircraft to
                        determine the bearing TO or FROM the station.
                    </p>
                    <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-amber-500">
                        <h4 className="font-bold text-white mb-2">Key Characteristics</h4>
                        <ul className="text-sm text-slate-300 space-y-1">
                            <li>• <strong>LF/MF Band:</strong> 190 kHz – 1750 kHz</li>
                            <li>• <strong>Propagation:</strong> Surface Wave (Ground Wave)</li>
                            <li>• <strong>Range:</strong> ~300 NM over land, further over sea</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 flex flex-col">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Frequency Spectrum</h4>
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="relative h-16 bg-gradient-to-r from-red-900 via-amber-700 to-green-900 rounded-lg overflow-hidden mb-4">
                            <div
                                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] transition-all"
                                style={{ left: `${((freq - 100) / 1900) * 100}%` }}
                            />
                            <div className="absolute inset-0 flex items-center justify-between px-4 text-xs text-white/70">
                                <span>100 kHz</span>
                                <span>NDB RANGE</span>
                                <span>2000 kHz</span>
                            </div>
                            <div
                                className="absolute top-0 bottom-0 bg-amber-500/20 border-x border-amber-500/50"
                                style={{
                                    left: `${((ndbMin - 100) / 1900) * 100}%`,
                                    width: `${((ndbMax - ndbMin) / 1900) * 100}%`
                                }}
                            />
                        </div>
                        <input
                            type="range" min="100" max="2000" value={freq}
                            onChange={(e) => setFreq(Number(e.target.value))}
                            className="w-full accent-amber-500"
                        />
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-slate-400 text-sm">Selected:</span>
                            <span className={`text-2xl font-mono ${isInNDBRange ? 'text-amber-400' : 'text-red-400'}`}>
                                {freq} kHz
                            </span>
                        </div>
                        {isInNDBRange ? (
                            <div className="mt-2 text-green-400 text-sm text-center bg-green-900/20 p-2 rounded">✓ Within NDB frequency range</div>
                        ) : (
                            <div className="mt-2 text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">✗ Outside NDB range</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Surface Wave Animation */}
            <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                <h3 className="text-xl font-bold text-amber-400 mb-4">Surface Wave Propagation</h3>
                <p className="text-slate-300 mb-4">NDB signals follow the Earth's curvature via <strong>surface waves</strong>, refracting along the ground.</p>
                <div className="relative h-48 bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
                    {/* Earth curve */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-emerald-900/50 to-transparent rounded-b-[100%]" />
                    {/* NDB Tower */}
                    <div className="absolute bottom-16 left-8 flex flex-col items-center">
                        <div className="w-1 h-12 bg-amber-500" />
                        <div className="w-4 h-4 bg-amber-500 rounded-full animate-pulse shadow-[0_0_20px_#f59e0b]" />
                        <span className="text-[10px] text-amber-400 mt-1">NDB</span>
                    </div>
                    {/* Surface waves */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 150">
                        <path d="M 30 100 Q 100 90 200 95 Q 300 100 380 110" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_3s_linear_infinite]" opacity="0.6" />
                        <path d="M 30 90 Q 100 80 200 85 Q 300 90 380 100" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_3s_linear_infinite]" opacity="0.4" style={{ animationDelay: '0.5s' }} />
                    </svg>
                    {/* Aircraft */}
                    <div className="absolute bottom-24 right-16 text-2xl">✈️</div>
                    {/* Range label */}
                    <div className="absolute bottom-2 right-4 text-xs text-slate-500 bg-black/50 px-2 rounded">~300 NM range over land</div>
                </div>
            </div>
        </div>
    );
};

// === SECTION 2: SIGNALS ===
const SignalsSection = () => {
    const [signalType, setSignalType] = useState<'N0N' | 'A1A' | 'A2A'>('N0N');
    const [bfoOn, setBfoOn] = useState(false);
    const [time, setTime] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setTime(t => t + 0.1), 50);
        return () => clearInterval(interval);
    }, []);

    const generateWave = () => {
        const points: string[] = [];
        for (let i = 0; i < 200; i++) {
            const x = i * 2;
            let y = 75;
            const carrier = Math.sin((i + time * 10) * 0.2) * 30;

            if (signalType === 'N0N') {
                y = 75 + carrier;
            } else if (signalType === 'A1A') {
                const morsePattern = Math.floor((i + time * 5) / 30) % 4 < 2 ? 1 : 0;
                y = 75 + carrier * morsePattern;
            } else {
                const modulation = Math.sin((i + time * 5) * 0.05) * 0.5 + 0.5;
                y = 75 + carrier * (0.5 + modulation * 0.5);
            }
            points.push(`${x},${y}`);
        }
        return points.join(' ');
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                        <h3 className="text-xl font-bold text-amber-400 mb-4">Signal Classification</h3>
                        <p className="text-slate-300 mb-4">NDB signals can be identified by their emission designator:</p>
                        <div className="space-y-3">
                            {[
                                { id: 'N0N', name: 'N0N (Unmodulated)', desc: 'Pure carrier wave, no audio' },
                                { id: 'A1A', name: 'N0N A1A (Interrupted)', desc: 'Carrier interrupted for Morse ID. Requires BFO.' },
                                { id: 'A2A', name: 'N0N A2A (Modulated)', desc: 'AM modulated Morse ID. No BFO needed.' }
                            ].map((sig) => (
                                <button
                                    key={sig.id}
                                    onClick={() => setSignalType(sig.id as any)}
                                    className={`w-full p-4 rounded-lg text-left transition-all ${signalType === sig.id
                                        ? 'bg-amber-600/20 border-2 border-amber-500'
                                        : 'bg-slate-800 border border-slate-700 hover:bg-slate-700'}`}
                                >
                                    <div className="font-bold text-white">{sig.name}</div>
                                    <div className="text-sm text-slate-400">{sig.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {signalType === 'A1A' && (
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-white">Beat Frequency Oscillator (BFO)</h4>
                                    <p className="text-xs text-slate-400">Required to make A1A Morse audible</p>
                                </div>
                                <button
                                    onClick={() => setBfoOn(!bfoOn)}
                                    className={`px-4 py-2 rounded-lg font-bold transition-all ${bfoOn
                                        ? 'bg-green-600 text-white'
                                        : 'bg-slate-700 text-slate-400'}`}
                                >
                                    {bfoOn ? 'BFO ON' : 'BFO OFF'}
                                </button>
                            </div>
                            {!bfoOn && (
                                <div className="mt-3 text-red-400 text-sm bg-red-900/20 p-2 rounded flex items-center gap-2">
                                    <AlertTriangle size={16} /> Morse code inaudible without BFO!
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 p-6">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Oscilloscope View</h4>
                    <div className="relative h-48 bg-black rounded-lg border border-slate-700 overflow-hidden">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, #334155 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, #334155 20px)' }} />
                        <svg className="absolute inset-0 w-full h-full">
                            <polyline
                                points={generateWave()}
                                fill="none"
                                stroke={signalType === 'A1A' && !bfoOn ? '#64748b' : '#22c55e'}
                                strokeWidth="2"
                            />
                        </svg>
                        <div className="absolute bottom-2 left-2 text-xs text-green-500 font-mono">{signalType}</div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-slate-800 p-2 rounded"><span className="text-slate-400">Type:</span> <span className="text-white">{signalType}</span></div>
                        <div className="bg-slate-800 p-2 rounded"><span className="text-slate-400">Needle:</span> <span className={signalType === 'A1A' ? 'text-red-400' : 'text-green-400'}>{signalType === 'A1A' ? 'Erratic' : 'Stable'}</span></div>
                        <div className="bg-slate-800 p-2 rounded"><span className="text-slate-400">BFO:</span> <span className="text-white">{signalType === 'A1A' ? 'Required' : 'Not Req.'}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// === SECTION 3: ANTENNA PRINCIPLES ===
const AntennaSection = () => {
    const [stage, setStage] = useState<1 | 2 | 3>(1);
    const [signalAngle, setSignalAngle] = useState(45);

    const getPatternPath = () => {
        const cx = 150, cy = 150, scale = 100;
        if (stage === 1) {
            // Figure-8 (Loop only)
            return `M ${cx} ${cy - scale} Q ${cx + scale * 0.5} ${cy - scale * 0.5} ${cx} ${cy} Q ${cx - scale * 0.5} ${cy + scale * 0.5} ${cx} ${cy + scale} Q ${cx + scale * 0.5} ${cy + scale * 0.5} ${cx} ${cy} Q ${cx - scale * 0.5} ${cy - scale * 0.5} ${cx} ${cy - scale}`;
        } else if (stage === 2) {
            // Circle (Sense only)
            return `M ${cx} ${cy - scale} A ${scale} ${scale} 0 1 1 ${cx} ${cy + scale} A ${scale} ${scale} 0 1 1 ${cx} ${cy - scale}`;
        } else {
            // Cardioid
            const points: string[] = [];
            for (let a = 0; a <= 360; a += 5) {
                const rad = (a * Math.PI) / 180;
                const r = scale * (1 + Math.cos(rad)) * 0.5;
                const x = cx + r * Math.sin(rad);
                const y = cy - r * Math.cos(rad);
                points.push(`${a === 0 ? 'M' : 'L'} ${x} ${y}`);
            }
            return points.join(' ') + ' Z';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                        <h3 className="text-xl font-bold text-amber-400 mb-4">ADF Antenna System</h3>
                        <p className="text-slate-300 mb-4">The ADF uses a combination of antennas to determine direction:</p>

                        <div className="space-y-3">
                            <button onClick={() => setStage(1)} className={`w-full p-4 rounded-lg text-left transition-all ${stage === 1 ? 'bg-amber-600/20 border-2 border-amber-500' : 'bg-slate-800 border border-slate-700'}`}>
                                <div className="font-bold text-white">1. Loop Antenna</div>
                                <div className="text-sm text-slate-400">Detects signal direction but has 180° ambiguity (2 null points)</div>
                            </button>
                            <button onClick={() => setStage(2)} className={`w-full p-4 rounded-lg text-left transition-all ${stage === 2 ? 'bg-green-600/20 border-2 border-green-500' : 'bg-slate-800 border border-slate-700'}`}>
                                <div className="font-bold text-white">2. Sense Antenna</div>
                                <div className="text-sm text-slate-400">Omnidirectional vertical antenna (circular pattern)</div>
                            </button>
                            <button onClick={() => setStage(3)} className={`w-full p-4 rounded-lg text-left transition-all ${stage === 3 ? 'bg-sky-600/20 border-2 border-sky-500' : 'bg-slate-800 border border-slate-700'}`}>
                                <div className="font-bold text-white">3. Combined (Cardioid)</div>
                                <div className="text-sm text-slate-400">Loop + Sense = Heart-shaped pattern with single null</div>
                            </button>
                        </div>
                    </div>

                    <div className={`p-4 rounded-xl border ${stage === 3 ? 'bg-green-900/20 border-green-500/30 text-green-300' : 'bg-yellow-900/20 border-yellow-500/30 text-yellow-300'}`}>
                        <strong>{stage === 3 ? '✓ Ambiguity Resolved!' : '⚠ 180° Ambiguity Problem'}</strong>
                        <p className="text-sm mt-1">{stage === 3 ? 'The cardioid pattern has only ONE null, giving unambiguous direction.' : 'The loop antenna alone cannot tell if the signal is ahead or behind.'}</p>
                    </div>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 flex flex-col items-center justify-center">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Polar Diagram</h4>
                    <svg width="300" height="300" className="transition-all duration-500">
                        {/* Grid */}
                        <circle cx="150" cy="150" r="100" fill="none" stroke="#334155" strokeDasharray="4,4" />
                        <circle cx="150" cy="150" r="50" fill="none" stroke="#334155" strokeDasharray="4,4" />
                        <line x1="150" y1="50" x2="150" y2="250" stroke="#334155" strokeDasharray="4,4" />
                        <line x1="50" y1="150" x2="250" y2="150" stroke="#334155" strokeDasharray="4,4" />

                        {/* Pattern */}
                        <path
                            d={getPatternPath()}
                            fill={stage === 1 ? 'rgba(245,158,11,0.2)' : stage === 2 ? 'rgba(34,197,94,0.2)' : 'rgba(56,189,248,0.2)'}
                            stroke={stage === 1 ? '#f59e0b' : stage === 2 ? '#22c55e' : '#38bdf8'}
                            strokeWidth="2"
                        />

                        {/* Center */}
                        <circle cx="150" cy="150" r="8" fill="#1e293b" stroke="#64748b" strokeWidth="2" />

                        {/* Labels */}
                        <text x="150" y="40" textAnchor="middle" fill="#64748b" fontSize="12">N</text>
                        <text x="260" y="154" textAnchor="middle" fill="#64748b" fontSize="12">E</text>
                        <text x="150" y="268" textAnchor="middle" fill="#64748b" fontSize="12">S</text>
                        <text x="40" y="154" textAnchor="middle" fill="#64748b" fontSize="12">W</text>
                    </svg>
                    <div className="mt-4 text-center">
                        <span className={`text-lg font-bold ${stage === 1 ? 'text-amber-400' : stage === 2 ? 'text-green-400' : 'text-sky-400'}`}>
                            {stage === 1 ? 'Figure-8 (2 Nulls)' : stage === 2 ? 'Omnidirectional' : 'Cardioid (1 Null)'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// === SECTION 4: INSTRUMENTS ===
const InstrumentsSection = () => {
    const [mode, setMode] = useState<'RBI' | 'RMI'>('RBI');
    const [heading, setHeading] = useState(45);
    const [stationBearing, setStationBearing] = useState(315);

    const qdm = stationBearing;
    const qdr = (stationBearing + 180) % 360;
    const relBearing = (qdm - heading + 360) % 360;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                        <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2"><Compass size={20} /> Cockpit Indicators</h3>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <button onClick={() => setMode('RBI')} className={`p-4 rounded-lg transition-all ${mode === 'RBI' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                                <div className="font-bold">RBI</div>
                                <div className="text-xs opacity-80">Relative Bearing Indicator</div>
                            </button>
                            <button onClick={() => setMode('RMI')} className={`p-4 rounded-lg transition-all ${mode === 'RMI' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                                <div className="font-bold">RMI</div>
                                <div className="text-xs opacity-80">Radio Magnetic Indicator</div>
                            </button>
                        </div>

                        <div className={`p-4 rounded-lg ${mode === 'RBI' ? 'bg-slate-800' : 'bg-amber-900/20'} border ${mode === 'RBI' ? 'border-slate-700' : 'border-amber-500/30'}`}>
                            <h4 className="font-bold text-white mb-2">{mode === 'RBI' ? 'RBI Characteristics' : 'RMI Characteristics'}</h4>
                            <ul className="text-sm text-slate-300 space-y-1">
                                {mode === 'RBI' ? (
                                    <>
                                        <li>• Fixed compass card (North always up)</li>
                                        <li>• Shows RELATIVE bearing to station</li>
                                        <li>• Must calculate: QDM = HDG + RB</li>
                                    </>
                                ) : (
                                    <>
                                        <li>• Rotating card linked to compass</li>
                                        <li>• Heading shown at index (top)</li>
                                        <li>• Needle points directly to QDM</li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-xl space-y-4">
                        <div>
                            <label className="flex justify-between text-sm text-slate-400 mb-2">
                                <span>Aircraft Heading</span><span className="text-white font-mono">{heading}°</span>
                            </label>
                            <input type="range" min="0" max="359" value={heading} onChange={(e) => setHeading(Number(e.target.value))} className="w-full accent-amber-500" />
                        </div>
                        <div>
                            <label className="flex justify-between text-sm text-slate-400 mb-2">
                                <span>QDM (Bearing TO Station)</span><span className="text-amber-400 font-mono">{qdm}°</span>
                            </label>
                            <input type="range" min="0" max="359" value={stationBearing} onChange={(e) => setStationBearing(Number(e.target.value))} className="w-full accent-amber-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-900 p-3 rounded-lg text-center border border-slate-700">
                            <div className="text-xs text-slate-500">QDM (TO)</div>
                            <div className="text-xl font-mono text-green-400">{qdm.toString().padStart(3, '0')}°</div>
                        </div>
                        <div className="bg-slate-900 p-3 rounded-lg text-center border border-slate-700">
                            <div className="text-xs text-slate-500">QDR (FROM)</div>
                            <div className="text-xl font-mono text-orange-400">{qdr.toString().padStart(3, '0')}°</div>
                        </div>
                        <div className="bg-slate-900 p-3 rounded-lg text-center border border-slate-700">
                            <div className="text-xs text-slate-500">Rel. Bearing</div>
                            <div className="text-xl font-mono text-white">{Math.round(relBearing).toString().padStart(3, '0')}°</div>
                        </div>
                    </div>
                </div>

                {/* Instrument */}
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-8 flex flex-col items-center justify-center">
                    <div className="text-xs text-slate-500 mb-4">{mode === 'RBI' ? 'RELATIVE BEARING INDICATOR' : 'RADIO MAGNETIC INDICATOR'}</div>
                    <div className="relative w-64 h-64 bg-[#1a1a1a] rounded-full border-8 border-[#2a2a2a] shadow-2xl">
                        {/* Compass Card */}
                        <div className="absolute inset-2 rounded-full transition-transform duration-500" style={{ transform: mode === 'RMI' ? `rotate(${-heading}deg)` : 'rotate(0deg)' }}>
                            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                                <div key={deg} className="absolute top-0 left-1/2 w-0.5 origin-bottom h-1/2 -translate-x-1/2" style={{ transform: `rotate(${deg}deg)` }}>
                                    <div className={`w-full ${deg % 90 === 0 ? 'h-4 bg-yellow-500' : 'h-2 bg-white/50'}`} />
                                    {deg % 30 === 0 && (
                                        <span className="block mt-5 text-[10px] text-white font-bold text-center" style={{ transform: `rotate(${-deg + (mode === 'RMI' ? heading : 0)}deg)` }}>
                                            {(deg / 10).toString().padStart(2, '0')}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Index (Top) */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-amber-500" />

                        {/* Needle */}
                        <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300" style={{ transform: `rotate(${relBearing}deg)` }}>
                            <div className="w-1 h-48 bg-gradient-to-b from-amber-400 via-amber-500 to-transparent rounded-full shadow-[0_0_10px_#f59e0b]">
                                <div className="w-4 h-4 bg-amber-500 rounded-full absolute -top-2 left-1/2 -translate-x-1/2" />
                            </div>
                        </div>

                        {/* Center */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-slate-800 rounded-full border-2 border-slate-600 flex items-center justify-center">
                            <span className="text-[8px] text-amber-400">NDB</span>
                        </div>
                    </div>
                    <div className="mt-4 text-center text-sm text-slate-400">
                        Needle Head → <span className="text-green-400">Station (QDM)</span> | Tail → <span className="text-orange-400">Radial (QDR)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// === SECTION 5: ERRORS ===
const ErrorsSection = () => {
    const [activeError, setActiveError] = useState<string | null>('static');
    const [isNight, setIsNight] = useState(false);
    const [needleWobble, setNeedleWobble] = useState(0);

    useEffect(() => {
        if (activeError === 'night' && isNight) {
            const interval = setInterval(() => {
                setNeedleWobble(Math.random() * 30 - 15);
            }, 200);
            return () => clearInterval(interval);
        } else {
            setNeedleWobble(0);
        }
    }, [activeError, isNight]);

    const errors = [
        { id: 'static', name: 'Static Interference', icon: <Zap size={20} />, color: 'yellow', desc: 'Thunderstorms produce static that attracts the ADF needle toward the storm.' },
        { id: 'night', name: 'Night Effect', icon: <Eye size={20} />, color: 'purple', desc: 'At night, the D-layer disappears, allowing skywaves to return. These polarized waves confuse the loop antenna.' },
        { id: 'coastal', name: 'Coastal Refraction', icon: <Waves size={20} />, color: 'blue', desc: 'Radio waves speed up over water, causing the signal to bend toward the coast when crossing the shoreline.' },
        { id: 'mountain', name: 'Mountain Effect', icon: <Navigation size={20} />, color: 'emerald', desc: 'Terrain reflects and refracts signals, causing bearing errors in mountainous areas.' },
        { id: 'dip', name: 'Dip Error', icon: <Settings size={20} />, color: 'orange', desc: 'During banking turns, the antenna geometry causes temporary directional errors.' }
    ];

    const currentError = errors.find(e => e.id === activeError);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-amber-400">NDB/ADF Error Sources</h3>
                    <div className="space-y-2">
                        {errors.map((err) => (
                            <button
                                key={err.id}
                                onClick={() => setActiveError(err.id)}
                                className={`w-full p-4 rounded-lg text-left transition-all flex items-center gap-4 ${activeError === err.id
                                    ? `bg-${err.color}-600/20 border-2 border-${err.color}-500`
                                    : 'bg-slate-800 border border-slate-700 hover:bg-slate-700'}`}
                            >
                                <div className={`p-2 rounded-lg bg-slate-700 text-${err.color}-400`}>{err.icon}</div>
                                <div>
                                    <div className="font-bold text-white">{err.name}</div>
                                    <div className="text-sm text-slate-400 line-clamp-1">{err.desc}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 p-6">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Error Simulation</h4>

                    {activeError === 'night' && (
                        <div className="mb-4">
                            <button onClick={() => setIsNight(!isNight)} className={`px-4 py-2 rounded-lg font-bold transition-all ${isNight ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                {isNight ? '🌙 Night Mode' : '☀️ Day Mode'}
                            </button>
                        </div>
                    )}

                    <div className={`relative h-64 rounded-xl overflow-hidden transition-colors duration-500 ${activeError === 'night' && isNight ? 'bg-slate-950' : 'bg-slate-900'}`}>
                        {/* Ionosphere for night effect */}
                        {activeError === 'night' && (
                            <div className={`absolute top-0 left-0 right-0 h-12 transition-opacity duration-500 ${isNight ? 'opacity-100' : 'opacity-30'}`}>
                                <div className="h-full bg-gradient-to-b from-purple-500/30 to-transparent border-b border-purple-500/30" />
                                {isNight && (
                                    <svg className="absolute inset-0 w-full h-full">
                                        <path d="M 50 60 Q 100 20 200 50 Q 250 80 150 100" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
                                    </svg>
                                )}
                            </div>
                        )}

                        {/* Static/Lightning */}
                        {activeError === 'static' && (
                            <div className="absolute top-4 right-8 animate-pulse">
                                <Zap size={48} className="text-yellow-400 drop-shadow-[0_0_10px_#facc15]" />
                                <div className="text-xs text-yellow-400 mt-1">Storm</div>
                            </div>
                        )}

                        {/* Coast for coastal refraction */}
                        {activeError === 'coastal' && (
                            <>
                                <div className="absolute bottom-0 left-0 w-1/2 h-8 bg-emerald-900/50" />
                                <div className="absolute bottom-0 right-0 w-1/2 h-8 bg-blue-900/50" />
                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-slate-400">Coastline</div>
                                <svg className="absolute inset-0 w-full h-full">
                                    <path d="M 50 180 Q 150 170 200 150 Q 220 145 280 160" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" />
                                    <text x="180" y="130" fill="#64748b" fontSize="10">Signal bends</text>
                                </svg>
                            </>
                        )}

                        {/* Mountains */}
                        {activeError === 'mountain' && (
                            <div className="absolute bottom-0 left-0 right-0 h-16">
                                <svg viewBox="0 0 300 60" className="w-full h-full">
                                    <polygon points="0,60 50,20 100,60" fill="#1e3a5f" />
                                    <polygon points="80,60 150,10 220,60" fill="#1e4d5f" />
                                    <polygon points="200,60 260,25 300,60" fill="#1e3a5f" />
                                </svg>
                            </div>
                        )}

                        {/* Simple Needle Display */}
                        <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 w-24 h-24 bg-slate-800 rounded-full border-4 border-slate-700 flex items-center justify-center">
                            <div className="w-1 h-16 bg-amber-500 rounded-full transition-transform origin-bottom" style={{ transform: `rotate(${needleWobble}deg)` }} />
                        </div>

                        {/* NDB Station */}
                        <div className="absolute bottom-16 left-8 flex flex-col items-center">
                            <div className="w-1 h-8 bg-amber-500" />
                            <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
                            <span className="text-[10px] text-amber-400 mt-1">NDB</span>
                        </div>

                        {/* Description */}
                        <div className="absolute bottom-2 left-2 right-2 bg-black/60 p-2 rounded text-xs text-slate-300">
                            {currentError?.desc}
                        </div>
                    </div>

                    {activeError === 'night' && isNight && (
                        <div className="mt-4 text-red-400 text-sm bg-red-900/20 p-3 rounded flex items-center gap-2">
                            <AlertTriangle size={16} /> Needle unstable due to skywave interference!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NDBADFSystem;
