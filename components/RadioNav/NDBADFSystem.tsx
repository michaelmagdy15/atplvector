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
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-emerald-900/50 to-transparent rounded-b-[100%]" />
                    <div className="absolute bottom-16 left-8 flex flex-col items-center">
                        <div className="w-1 h-12 bg-amber-500" />
                        <div className="w-4 h-4 bg-amber-500 rounded-full animate-pulse shadow-[0_0_20px_#f59e0b]" />
                        <span className="text-[10px] text-amber-400 mt-1">NDB</span>
                    </div>
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 150">
                        <path d="M 30 100 Q 100 90 200 95 Q 300 100 380 110" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_3s_linear_infinite]" opacity="0.6" />
                        <path d="M 30 90 Q 100 80 200 85 Q 300 90 380 100" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_3s_linear_infinite]" opacity="0.4" style={{ animationDelay: '0.5s' }} />
                    </svg>
                    <div className="absolute bottom-24 right-16 text-2xl">✈️</div>
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

    const getPatternPath = () => {
        const cx = 150, cy = 150, scale = 100;
        if (stage === 1) {
            return `M ${cx} ${cy - scale} Q ${cx + scale * 0.5} ${cy - scale * 0.5} ${cx} ${cy} Q ${cx - scale * 0.5} ${cy + scale * 0.5} ${cx} ${cy + scale} Q ${cx + scale * 0.5} ${cy + scale * 0.5} ${cx} ${cy} Q ${cx - scale * 0.5} ${cy - scale * 0.5} ${cx} ${cy - scale}`;
        } else if (stage === 2) {
            return `M ${cx} ${cy - scale} A ${scale} ${scale} 0 1 1 ${cx} ${cy + scale} A ${scale} ${scale} 0 1 1 ${cx} ${cy - scale}`;
        } else {
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
                        <circle cx="150" cy="150" r="100" fill="none" stroke="#334155" strokeDasharray="4,4" />
                        <circle cx="150" cy="150" r="50" fill="none" stroke="#334155" strokeDasharray="4,4" />
                        <line x1="150" y1="50" x2="150" y2="250" stroke="#334155" strokeDasharray="4,4" />
                        <line x1="50" y1="150" x2="250" y2="150" stroke="#334155" strokeDasharray="4,4" />

                        <path
                            d={getPatternPath()}
                            fill={stage === 1 ? 'rgba(245,158,11,0.2)' : stage === 2 ? 'rgba(34,197,94,0.2)' : 'rgba(56,189,248,0.2)'}
                            stroke={stage === 1 ? '#f59e0b' : stage === 2 ? '#22c55e' : '#38bdf8'}
                            strokeWidth="2"
                        />

                        <circle cx="150" cy="150" r="8" fill="#1e293b" stroke="#64748b" strokeWidth="2" />

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

                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-amber-500" />

                        <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300" style={{ transform: `rotate(${relBearing}deg)` }}>
                            <div className="w-1 h-48 bg-gradient-to-b from-amber-400 via-amber-500 to-transparent rounded-full shadow-[0_0_10px_#f59e0b]">
                                <div className="w-4 h-4 bg-amber-500 rounded-full absolute -top-2 left-1/2 -translate-x-1/2" />
                            </div>
                        </div>

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
    const [activeError, setActiveError] = useState<string | null>('coastal');
    const [isNight, setIsNight] = useState(true);
    const [coastalAngle, setCoastalAngle] = useState(45);
    const [needleWobble, setNeedleWobble] = useState(0);

    useEffect(() => {
        if (activeError === 'night' && isNight) {
            const interval = setInterval(() => {
                setNeedleWobble(Math.random() * 36 - 18);
            }, 180);
            return () => clearInterval(interval);
        } else if (activeError === 'coastal') {
            const bendError = Math.sin((coastalAngle * Math.PI) / 180) * 12 * (coastalAngle < 90 ? 1 : -1);
            setNeedleWobble(bendError);
        } else if (activeError === 'static') {
            setNeedleWobble(42);
        } else {
            setNeedleWobble(0);
        }
    }, [activeError, isNight, coastalAngle]);

    const errors = [
        {
            id: 'coastal',
            name: 'Coastal Refraction',
            icon: <Waves size={20} />,
            color: 'blue',
            desc: 'Radio waves travel faster over seawater than land. When crossing the shoreline, the wavefront speeds up and bends TOWARDS THE NORMAL, causing the ADF needle to pull towards the coast.'
        },
        {
            id: 'night',
            name: 'Night Effect (Skywave Interference)',
            icon: <Eye size={20} />,
            color: 'purple',
            desc: 'At sunset, the D-layer recombines and disappears, allowing E and F skywaves to reflect back to Earth with elliptical polarization, generating unwanted EMF in the horizontal wires of the loop antenna.'
        },
        {
            id: 'static',
            name: 'Thunderstorm Static Attraction',
            icon: <Zap size={20} />,
            color: 'yellow',
            desc: 'Cumulonimbus electrical activity generates intense broad-spectrum RF noise in LF/MF. The ADF needle swings away from the beacon and points directly at lightning strikes.'
        },
        {
            id: 'mountain',
            name: 'Mountain Effect & Reflection',
            icon: <Navigation size={20} />,
            color: 'emerald',
            desc: 'Steep terrain and mountain ridges reflect and diffract LF/MF surface waves, creating multi-path phase cancellation and erroneous needle indications.'
        },
        {
            id: 'quadrantal',
            name: 'Quadrantal Error',
            icon: <Settings size={20} />,
            color: 'orange',
            desc: 'Aircraft metallic fuselage acts as a secondary re-radiator. Zero error on cardinal headings (000°, 090°, 180°, 270°); maximum error at 45° quadrantal bearings.'
        }
    ];

    const currentError = errors.find(e => e.id === activeError);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Error Selector */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-amber-400">NDB/ADF Error Sources</h3>
                    <div className="space-y-2.5">
                        {errors.map((err) => (
                            <button
                                key={err.id}
                                onClick={() => setActiveError(err.id)}
                                className={`w-full p-4 rounded-xl text-left transition-all flex items-start gap-4 border ${
                                    activeError === err.id
                                        ? 'bg-amber-600/20 border-amber-500 shadow-lg shadow-amber-950/30'
                                        : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-400'
                                }`}
                            >
                                <div className="p-2.5 rounded-xl bg-slate-800 text-amber-400 shrink-0 mt-0.5">
                                    {err.icon}
                                </div>
                                <div className="space-y-1">
                                    <div className="font-bold text-white text-sm">{err.name}</div>
                                    <div className="text-xs text-slate-400 leading-relaxed line-clamp-2">{err.desc}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Interactive Error Visualizer */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-6 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                                {currentError?.name} Simulation
                            </h4>
                            {activeError === 'night' && (
                                <button
                                    onClick={() => setIsNight(!isNight)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        isNight ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
                                    }`}
                                >
                                    {isNight ? '🌙 Night (D-Layer Gone)' : '☀️ Day (D-Layer Absorbs)'}
                                </button>
                            )}
                        </div>

                        {/* Coastal Refraction Angle Controller */}
                        {activeError === 'coastal' && (
                            <div className="mb-4 p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                                <div className="flex justify-between text-xs font-mono">
                                    <span className="text-slate-400">Angle of Shoreline Crossing:</span>
                                    <span className="text-sky-400 font-bold">{coastalAngle}°</span>
                                </div>
                                <input
                                    type="range"
                                    min="15"
                                    max="90"
                                    step="5"
                                    value={coastalAngle}
                                    onChange={e => setCoastalAngle(Number(e.target.value))}
                                    className="w-full accent-sky-500"
                                />
                                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                                    <span>15° (Severe Bending)</span>
                                    <span>90° Normal (Zero Error!)</span>
                                </div>
                            </div>
                        )}

                        {/* Visual Display Screen */}
                        <div className="relative h-64 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                            {/* Night Effect Ionosphere */}
                            {activeError === 'night' && (
                                <div className={`absolute top-0 left-0 right-0 h-16 transition-opacity duration-500 ${isNight ? 'opacity-100 bg-purple-950/40 border-b border-purple-500/30' : 'opacity-20'}`}>
                                    <div className="p-2 text-[10px] font-mono text-purple-300">
                                        {isNight ? 'E & F LAYERS REFLECTING SKYWAVE (NO D-LAYER)' : 'D-LAYER ABSORBS MF SKYWAVES'}
                                    </div>
                                    {isNight && (
                                        <svg className="absolute inset-0 w-full h-full">
                                            <path d="M 40 50 Q 140 10 240 50" fill="none" stroke="#c084fc" strokeWidth="2" strokeDasharray="4,4" className="animate-pulse" />
                                        </svg>
                                    )}
                                </div>
                            )}

                            {/* Coastal Refraction Shoreline */}
                            {activeError === 'coastal' && (
                                <div className="absolute inset-0">
                                    <div className="w-1/2 h-full bg-emerald-950/30 border-r-2 border-amber-500/50 float-left p-3">
                                        <span className="text-[10px] font-mono text-emerald-400">LAND (Low Conductivity)</span>
                                    </div>
                                    <div className="w-1/2 h-full bg-sky-950/30 float-right p-3 text-right">
                                        <span className="text-[10px] font-mono text-sky-400">SEA (High Velocity)</span>
                                    </div>
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                        <line x1="50" y1="180" x2="160" y2="120" stroke="#f59e0b" strokeWidth="2" />
                                        <line x1="160" y1="120" x2="280" y2="80" stroke="#38bdf8" strokeWidth="2.5" />
                                        <text x="170" y="110" fill="#38bdf8" fontSize="9" fontFamily="monospace">Bends toward normal</text>
                                    </svg>
                                </div>
                            )}

                            {/* Lightning Storm */}
                            {activeError === 'static' && (
                                <div className="absolute top-6 right-8 flex flex-col items-center">
                                    <Zap size={44} className="text-yellow-400 animate-bounce drop-shadow-[0_0_15px_#facc15]" />
                                    <span className="text-[10px] font-mono text-yellow-300 mt-1 font-bold">CB CELL (LIGHTNING)</span>
                                </div>
                            )}

                            {/* ADF Instrument Indicator */}
                            <div className="relative z-10 w-28 h-28 bg-slate-950 rounded-full border-4 border-slate-700 flex items-center justify-center shadow-xl">
                                <div className="text-[9px] font-mono text-slate-500 absolute top-2 font-bold">000°</div>
                                <div
                                    className="w-1.5 h-20 bg-amber-400 rounded-full transition-transform origin-center shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                                    style={{ transform: `rotate(${needleWobble}deg)` }}
                                />
                                <div className="w-3 h-3 bg-white rounded-full z-20"></div>
                            </div>
                        </div>
                    </div>

                    {/* Operational Advice Box */}
                    <div className="p-4 bg-slate-900 rounded-xl border border-white/5 space-y-2 text-xs">
                        <strong className="text-amber-400 block font-bold">ICAO / EASA Operational Recovery Rule:</strong>
                        {activeError === 'coastal' && (
                            <p className="text-slate-300">
                                <strong>Coastal Mitigation:</strong> Cross coastlines as close to 90° (normal) as possible.
                                At 90° incidence, angle of refraction is 0°, eliminating coastal error entirely.
                                Avoid using NDB stations located far inland when flying over coastal waters.
                            </p>
                        )}
                        {activeError === 'night' && (
                            <p className="text-slate-300">
                                <strong>Night Effect Mitigation:</strong> Error is worst during twilight (sunrise and sunset).
                                Use ground waves only (limit range to within ~50-70 NM).
                                Average fluctuating ADF needle readings or cross-check with VOR/DME.
                            </p>
                        )}
                        {activeError === 'static' && (
                            <p className="text-slate-300">
                                <strong>Storm Warning:</strong> Never use ADF navigation in the vicinity of cumulonimbus (CB) clouds.
                                The needle will reliably indicate the location of electrical discharges rather than the beacon.
                            </p>
                        )}
                        {activeError === 'mountain' && (
                            <p className="text-slate-300">
                                <strong>Mountain Terrain:</strong> Fly at higher altitudes to increase the ratio of direct surface wave to reflected waves.
                            </p>
                        )}
                        {activeError === 'quadrantal' && (
                            <p className="text-slate-300">
                                <strong>Quadrantal Calibration:</strong> Modern ADF installations use electronic loop compensators or look-up tables to cancel airframe re-radiation.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NDBADFSystem;
