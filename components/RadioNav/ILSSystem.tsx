import React, { useState, useEffect } from 'react';
import { View } from '../../types';
import {
    ArrowLeft, Radio, Compass, AlertTriangle, Navigation,
    Signal, Zap, Waves, Eye, Settings, Info, Map, Plane,
    LandPlot, Activity, Volume2, VolumeX
} from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const ILSSystem: React.FC<Props> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState('OVERVIEW');

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
                        <LandPlot className="text-sky-400" size={32} />
                        ILS System
                    </h1>
                    <p className="text-slate-400 mt-1">Instrument Landing System</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 p-1 bg-slate-900/80 rounded-xl backdrop-blur-sm border border-slate-800 sticky top-4 z-50">
                <TabButton id="OVERVIEW" label="Overview" icon={<Info size={18} />} active={activeTab} setActive={setActiveTab} />
                <TabButton id="PRINCIPLES" label="Principles" icon={<Waves size={18} />} active={activeTab} setActive={setActiveTab} />
                <TabButton id="COVERAGE" label="Coverage" icon={<Map size={18} />} active={activeTab} setActive={setActiveTab} />
                <TabButton id="MARKERS" label="Markers" icon={<Signal size={18} />} active={activeTab} setActive={setActiveTab} />
                <TabButton id="CATEGORIES" label="Categories" icon={<Settings size={18} />} active={activeTab} setActive={setActiveTab} />
                <TabButton id="INSTRUMENTS" label="Instruments" icon={<Compass size={18} />} active={activeTab} setActive={setActiveTab} />
                <TabButton id="ERRORS" label="Errors" icon={<AlertTriangle size={18} />} active={activeTab} setActive={setActiveTab} />
            </div>

            <div className="min-h-[600px] transition-all duration-300">
                {activeTab === 'OVERVIEW' && <OverviewSection />}
                {activeTab === 'PRINCIPLES' && <PrinciplesSection />}
                {activeTab === 'COVERAGE' && <CoverageSection />}
                {activeTab === 'MARKERS' && <MarkersSection />}
                {activeTab === 'CATEGORIES' && <CategoriesSection />}
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
            ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/20'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
    >
        {icon}
        <span className="hidden sm:inline">{label}</span>
    </button>
);

// === SECTION 1: OVERVIEW ===
const OverviewSection = () => {
    const [freq, setFreq] = useState(109.5);
    const locMin = 108.0, locMax = 111.95;
    const isOddDecimal = (freq * 100) % 20 >= 10;
    const isInLocRange = freq >= locMin && freq <= locMax && isOddDecimal;
    const pairedGS = 329.15 + ((freq - 108.1) / 0.05) * 0.15;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                    <h3 className="text-xl font-bold text-sky-400 mb-4 flex items-center gap-2">
                        <Info size={20} /> What is ILS?
                    </h3>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                        <strong className="text-white">ILS (Instrument Landing System)</strong> is a
                        <strong className="text-sky-400"> precision approach</strong> aid providing both
                        horizontal (Localizer) and vertical (Glide Slope) guidance to the runway.
                    </p>
                    <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-sky-500">
                        <h4 className="font-bold text-white mb-2">Key Facts</h4>
                        <ul className="text-sm text-slate-300 space-y-2">
                            <li>• <strong className="text-white">Localizer:</strong> VHF 108–111.95 MHz (odd decimals)</li>
                            <li>• <strong className="text-white">Glide Slope:</strong> UHF 329–335 MHz (auto-paired)</li>
                            <li>• <strong className="text-white">Ident:</strong> 2-4 letter Morse code at 1020 Hz (~10s)</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 flex flex-col">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Frequency Pairing</h4>
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="relative h-16 bg-gradient-to-r from-slate-800 via-sky-900/50 to-slate-800 rounded-lg overflow-hidden mb-4">
                            <div
                                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] transition-all"
                                style={{ left: `${((freq - 108) / 4) * 100}%` }}
                            />
                            <div
                                className="absolute top-0 bottom-0 bg-sky-500/20 border-x border-sky-500/50"
                                style={{
                                    left: `${((locMin - 108) / 4) * 100}%`,
                                    width: `${((locMax - locMin) / 4) * 100}%`
                                }}
                            />
                        </div>
                        <input
                            type="range" min="108" max="112" step="0.05" value={freq}
                            onChange={(e) => setFreq(Number(e.target.value))}
                            className="w-full accent-sky-500"
                        />
                        <div className="flex justify-between items-center mt-4">
                            <div>
                                <span className="text-slate-400 text-sm">LOC: </span>
                                <span className={`text-2xl font-mono ${isInLocRange ? 'text-sky-400' : 'text-red-400'}`}>
                                    {freq.toFixed(2)} MHz
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-400 text-sm">G/S: </span>
                                <span className="text-xl font-mono text-amber-400">
                                    {isInLocRange ? pairedGS.toFixed(2) : '---'} MHz
                                </span>
                            </div>
                        </div>
                        {isInLocRange ? (
                            <div className="mt-2 text-green-400 text-sm text-center bg-green-900/20 p-2 rounded">✓ Valid ILS frequency (odd decimal)</div>
                        ) : (
                            <div className="mt-2 text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">✗ Must be odd decimal (x.x5 or x.x0 where odd)</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Identification */}
            <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                <h3 className="text-xl font-bold text-sky-400 mb-4">Identification Process</h3>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <p className="text-slate-300 mb-4 text-sm">
                            Every ~10 seconds, the station transmits its <strong className="text-white">2-4 letter Morse identifier</strong>
                            at 1020 Hz. Always verify the ident before using the ILS.
                        </p>
                        <div className="flex gap-2">
                            <div className="bg-slate-800 px-3 py-1 rounded font-mono text-xl text-sky-400 animate-pulse">
                                • • — — &nbsp;&nbsp;&nbsp;— • • • &nbsp;&nbsp;&nbsp;• — • •
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 font-mono">(Morse for "IJBL")</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative h-32 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="absolute border border-sky-500/30 rounded-full animate-ping"
                                    style={{
                                        width: `${i * 40}px`,
                                        height: `${i * 40}px`,
                                        animationDuration: '3s',
                                        animationDelay: `${i * 0.5}s`
                                    }}
                                />
                            ))}
                            <div className="relative z-10 font-bold text-xs text-sky-400 bg-slate-900 px-2 rounded">1020 Hz TONE</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// === SECTION 2: PRINCIPLES ===
const PrinciplesSection = () => {
    const [aircraftPos, setAircraftPos] = useState({ x: 0, y: 0 });

    const get90Hz = (x: number, y: number) => Math.max(0, -x * 5 + 50);
    const get150Hz = (x: number, y: number) => Math.max(0, x * 5 + 50);
    const signal90 = get90Hz(aircraftPos.x, aircraftPos.y);
    const signal150 = get150Hz(aircraftPos.x, aircraftPos.y);
    const ddm = (signal90 - signal150) / 100;
    const flyDirection = ddm > 0.02 ? 'FLY RIGHT' : ddm < -0.02 ? 'FLY LEFT' : 'ON COURSE';

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                        <h3 className="text-xl font-bold text-sky-400 mb-4">Signal Modulation</h3>
                        <p className="text-slate-300 mb-4 text-sm">
                            Both Localizer and Glide Slope use two overlapping AM signals: <strong className="text-blue-400">90 Hz</strong> and <strong className="text-yellow-400">150 Hz</strong>.
                        </p>
                        <div className="space-y-4">
                            <div className="bg-slate-800 p-4 rounded-lg">
                                <h4 className="font-bold text-white mb-2">Localizer (Horizontal)</h4>
                                <ul className="text-xs text-slate-400 space-y-1">
                                    <li>• Transmitter at <strong className="text-white">far end</strong> of runway</li>
                                    <li>• <span className="text-blue-400">90 Hz</span> = Left side → "Fly Right"</li>
                                    <li>• <span className="text-yellow-400">150 Hz</span> = Right side → "Fly Left"</li>
                                </ul>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-lg">
                                <h4 className="font-bold text-white mb-2">Glide Slope (Vertical)</h4>
                                <ul className="text-xs text-slate-400 space-y-1">
                                    <li>• Transmitter at <strong className="text-white">touchdown zone</strong> (~300m from threshold)</li>
                                    <li>• <span className="text-blue-400">90 Hz</span> = Above → "Fly Down"</li>
                                    <li>• <span className="text-yellow-400">150 Hz</span> = Below → "Fly Up"</li>
                                    <li>• Standard angle: <strong className="text-white">3°</strong></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 p-6">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Localizer Lobe Visualizer</h4>
                    <div className="relative h-64 bg-slate-900 rounded-lg overflow-hidden">
                        {/* Runway */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-3 bg-slate-600 rounded"></div>
                        <div className="absolute right-20 top-1/2 w-px h-full bg-white/20 border-l border-dashed"></div>

                        {/* 90Hz Lobe (Left/Blue) */}
                        <div className="absolute right-20 top-0 bottom-1/2 left-0 bg-gradient-to-b from-blue-500/30 to-transparent"></div>
                        <div className="absolute right-20 top-1/4 left-4 text-blue-400 text-xs font-bold">90 Hz</div>

                        {/* 150Hz Lobe (Right/Yellow) */}
                        <div className="absolute right-20 top-1/2 bottom-0 left-0 bg-gradient-to-t from-yellow-500/30 to-transparent"></div>
                        <div className="absolute right-20 bottom-1/4 left-4 text-yellow-400 text-xs font-bold">150 Hz</div>

                        {/* Aircraft (draggable area) */}
                        <div
                            className="absolute inset-0 cursor-crosshair"
                            onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
                                const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
                                setAircraftPos({ x: -y, y: x });
                            }}
                        >
                            <div
                                className="absolute w-6 h-6 transition-all duration-200"
                                style={{
                                    left: `${50 - aircraftPos.y * 2}%`,
                                    top: `${50 - aircraftPos.x * 2}%`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                            >
                                <Plane size={24} className="text-white rotate-90" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                        <div className="bg-blue-900/30 p-2 rounded">
                            <div className="text-xs text-slate-400">90 Hz</div>
                            <div className="text-lg font-mono text-blue-400">{signal90.toFixed(0)}%</div>
                        </div>
                        <div className={`p-2 rounded ${flyDirection === 'ON COURSE' ? 'bg-green-900/30' : 'bg-slate-800'}`}>
                            <div className="text-xs text-slate-400">Command</div>
                            <div className={`text-sm font-bold ${flyDirection === 'ON COURSE' ? 'text-green-400' : 'text-white'}`}>{flyDirection}</div>
                        </div>
                        <div className="bg-yellow-900/30 p-2 rounded">
                            <div className="text-xs text-slate-400">150 Hz</div>
                            <div className="text-lg font-mono text-yellow-400">{signal150.toFixed(0)}%</div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 text-center italic">Click anywhere to move the aircraft</p>
                </div>
            </div>
        </div>
    );
};

// === SECTION 3: COVERAGE ===
const CoverageSection = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                    <h3 className="text-xl font-bold text-sky-400 mb-4">Localizer Coverage</h3>
                    <div className="relative h-48 bg-slate-950 rounded-lg overflow-hidden mb-4">
                        {/* Runway */}
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-2 bg-slate-500"></div>
                        {/* 10° cone - 25NM */}
                        <div className="absolute right-10 top-1/2 origin-right w-[200px] h-0 border-t border-dashed border-green-500"
                            style={{ transform: 'rotate(5deg)' }}></div>
                        <div className="absolute right-10 top-1/2 origin-right w-[200px] h-0 border-t border-dashed border-green-500"
                            style={{ transform: 'rotate(-5deg)' }}></div>
                        {/* 35° cone - 17NM */}
                        <div className="absolute right-10 top-1/2 origin-right w-[140px] h-0 border-t border-yellow-500/50"
                            style={{ transform: 'rotate(17.5deg)' }}></div>
                        <div className="absolute right-10 top-1/2 origin-right w-[140px] h-0 border-t border-yellow-500/50"
                            style={{ transform: 'rotate(-17.5deg)' }}></div>
                        {/* Labels */}
                        <div className="absolute left-4 top-4 text-xs text-green-400">±10° to 25 NM</div>
                        <div className="absolute left-4 top-10 text-xs text-yellow-400">±35° to 17 NM</div>
                    </div>
                    <ul className="text-sm text-slate-300 space-y-2">
                        <li>• Accurate within <strong className="text-white">10°</strong> of centerline out to <strong className="text-white">25 NM</strong></li>
                        <li>• Accurate within <strong className="text-white">35°</strong> out to <strong className="text-white">17 NM</strong></li>
                    </ul>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                    <h3 className="text-xl font-bold text-amber-400 mb-4">Glide Slope Coverage</h3>
                    <div className="relative h-48 bg-slate-950 rounded-lg overflow-hidden mb-4">
                        {/* Ground */}
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-emerald-900/20"></div>
                        {/* Runway */}
                        <div className="absolute bottom-8 right-2 w-12 h-1 bg-slate-500"></div>
                        {/* G/S Beam (3°) */}
                        <div className="absolute bottom-8 right-14 origin-bottom-right w-[200px] h-0 border-t-2 border-amber-500"
                            style={{ transform: 'rotate(-3deg)' }}></div>
                        {/* Upper limit (1.75θ = 5.25°) */}
                        <div className="absolute bottom-8 right-14 origin-bottom-right w-[180px] h-0 border-t border-dashed border-amber-500/50"
                            style={{ transform: 'rotate(-5.25deg)' }}></div>
                        {/* Lower limit (0.45θ = 1.35°) */}
                        <div className="absolute bottom-8 right-14 origin-bottom-right w-[180px] h-0 border-t border-dashed border-amber-500/50"
                            style={{ transform: 'rotate(-1.35deg)' }}></div>
                        {/* Labels */}
                        <div className="absolute left-4 top-4 text-xs text-amber-400">Range: 10 NM</div>
                        <div className="absolute left-4 top-10 text-xs text-slate-400">Width: 8° (0.45θ to 1.75θ)</div>
                    </div>
                    <ul className="text-sm text-slate-300 space-y-2">
                        <li>• Accurate out to <strong className="text-white">10 NM</strong></li>
                        <li>• Usable between <strong className="text-white">0.45×θ</strong> and <strong className="text-white">1.75×θ</strong></li>
                    </ul>
                </div>
            </div>

            {/* Critical/Sensitive Areas */}
            <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                <h3 className="text-xl font-bold text-red-400 mb-4">Signal Protection Areas</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/30">
                        <h4 className="font-bold text-red-400 mb-2">Critical Area</h4>
                        <p className="text-sm text-slate-300">Zone directly around the transmitter. <strong className="text-white">No vehicles or aircraft allowed</strong> during ILS use. Protects against signal distortion.</p>
                    </div>
                    <div className="bg-amber-900/20 p-4 rounded-lg border border-amber-500/30">
                        <h4 className="font-bold text-amber-400 mb-2">Sensitive Area</h4>
                        <p className="text-sm text-slate-300">Larger protected zone controlled by ATC. <strong className="text-white">Special holding points</strong> during Cat II/III operations (LVP).</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// === SECTION 4: MARKERS ===
const MarkersSection = () => {
    const [activeMarker, setActiveMarker] = useState<string | null>(null);

    const markers = [
        { id: 'outer', name: 'Outer Marker', color: 'blue', pattern: '— — —', pitch: 'Low', distance: '~4 NM', audio: 400 },
        { id: 'middle', name: 'Middle Marker', color: 'orange', pattern: '— • —', pitch: 'Medium', distance: '~0.6 NM', audio: 1300 },
        { id: 'inner', name: 'Inner Marker', color: 'white', pattern: '• • • •', pitch: 'High', distance: 'Threshold', audio: 3000 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                <h3 className="text-xl font-bold text-sky-400 mb-4">Marker Beacons</h3>
                <p className="text-slate-300 mb-6">Marker beacons verify distance and height on the approach. Modern aircraft often use DME paired with ILS instead.</p>

                {/* Approach Path Visualization */}
                <div className="relative h-40 bg-slate-950 rounded-lg overflow-hidden mb-6">
                    {/* Ground */}
                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-emerald-900/20 border-t border-emerald-700/30"></div>
                    {/* Runway */}
                    <div className="absolute bottom-6 right-4 w-20 h-2 bg-slate-500"></div>
                    {/* Glide Path */}
                    <div className="absolute bottom-6 right-24 origin-bottom-right w-[90%] h-0 border-t-2 border-dashed border-amber-500/50"
                        style={{ transform: 'rotate(-3deg)' }}></div>

                    {/* Markers */}
                    <div className="absolute bottom-6 right-[25%] w-1 h-20 bg-white/50" onClick={() => setActiveMarker('inner')}>
                        <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${activeMarker === 'inner' ? 'bg-white animate-pulse' : 'bg-white/50'}`}></div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] text-white whitespace-nowrap">IM</div>
                    </div>
                    <div className="absolute bottom-6 right-[45%] w-1 h-20 bg-orange-500/50" onClick={() => setActiveMarker('middle')}>
                        <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${activeMarker === 'middle' ? 'bg-orange-400 animate-pulse' : 'bg-orange-500/50'}`}></div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] text-orange-400 whitespace-nowrap">MM</div>
                    </div>
                    <div className="absolute bottom-6 right-[75%] w-1 h-20 bg-blue-500/50" onClick={() => setActiveMarker('outer')}>
                        <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${activeMarker === 'outer' ? 'bg-blue-400 animate-pulse' : 'bg-blue-500/50'}`}></div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] text-blue-400 whitespace-nowrap">OM</div>
                    </div>

                    {/* Aircraft */}
                    <div className="absolute bottom-12 left-[10%]">
                        <Plane size={24} className="text-sky-400 -rotate-12" />
                    </div>
                </div>

                {/* Marker Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                    {markers.map(m => (
                        <div
                            key={m.id}
                            onClick={() => setActiveMarker(activeMarker === m.id ? null : m.id)}
                            className={`p-4 rounded-lg cursor-pointer transition-all ${activeMarker === m.id
                                    ? `bg-${m.color === 'orange' ? 'amber' : m.color}-900/30 border-2 border-${m.color === 'orange' ? 'amber' : m.color}-500`
                                    : 'bg-slate-800 border border-slate-700 hover:border-slate-600'
                                }`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`w-4 h-4 rounded-full ${m.color === 'blue' ? 'bg-blue-400' :
                                        m.color === 'orange' ? 'bg-amber-400' : 'bg-white'
                                    } ${activeMarker === m.id ? 'animate-pulse' : ''}`}></div>
                                <h4 className="font-bold text-white">{m.name}</h4>
                            </div>
                            <div className="space-y-1 text-xs text-slate-400">
                                <p>Pattern: <span className="font-mono text-white">{m.pattern}</span></p>
                                <p>Pitch: <span className="text-white">{m.pitch}</span></p>
                                <p>Distance: <span className="text-white">{m.distance}</span></p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* DME Alternative */}
            <div className="bg-sky-900/20 p-4 rounded-lg border border-sky-500/30">
                <h4 className="font-bold text-sky-400 mb-2 flex items-center gap-2">
                    <Radio size={16} /> DME/ILS Pairing
                </h4>
                <p className="text-sm text-slate-300">
                    Modern aircraft often use <strong className="text-white">DME distance</strong> paired with ILS to cross-check altitude against the approach chart,
                    rather than relying on physical marker beacons.
                </p>
            </div>
        </div>
    );
};

// === SECTION 5: CATEGORIES ===
const CategoriesSection = () => {
    const categories = [
        { cat: 'Cat I', dh: '200 ft', rvr: '550m / 800m', equip: 'Basic ILS', color: 'green' },
        { cat: 'Cat II', dh: '100 ft', rvr: '300m', equip: 'Autoland capable', color: 'yellow' },
        { cat: 'Cat IIIA', dh: '50 ft or none', rvr: '200m', equip: 'Autoland + Rollout', color: 'orange' },
        { cat: 'Cat IIIB', dh: '15 ft or none', rvr: '75m', equip: 'Autoland + Taxi guidance', color: 'red' },
        { cat: 'Cat IIIC', dh: 'None', rvr: 'None', equip: 'Full autoland (theoretical)', color: 'purple' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                <h3 className="text-xl font-bold text-sky-400 mb-4">ILS Categories</h3>
                <p className="text-slate-300 mb-6">
                    Categories are based on equipment precision and airport facilities, determining the minimum visibility conditions.
                </p>

                <div className="space-y-4">
                    {categories.map(c => (
                        <div key={c.cat} className={`p-4 rounded-lg bg-slate-800 border-l-4 border-${c.color}-500`}>
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <h4 className={`font-bold text-${c.color}-400 text-lg`}>{c.cat}</h4>
                                    <p className="text-xs text-slate-500">{c.equip}</p>
                                </div>
                                <div className="flex gap-8">
                                    <div className="text-center">
                                        <div className="text-xs text-slate-500 uppercase">DH</div>
                                        <div className="text-lg font-mono text-white">{c.dh}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-slate-500 uppercase">RVR</div>
                                        <div className="text-lg font-mono text-white">{c.rvr}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Definitions */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-4 rounded-lg">
                    <h4 className="font-bold text-amber-400 mb-2">DH (Decision Height)</h4>
                    <p className="text-sm text-slate-300">
                        The altitude at which the pilot must have <strong className="text-white">visual reference</strong> to continue,
                        otherwise execute a <strong className="text-white">go-around</strong>.
                    </p>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                    <h4 className="font-bold text-sky-400 mb-2">RVR (Runway Visual Range)</h4>
                    <p className="text-sm text-slate-300">
                        A measurement of <strong className="text-white">visibility</strong> down the runway centerline,
                        reported in meters.
                    </p>
                </div>
            </div>
        </div>
    );
};

// === SECTION 6: INSTRUMENTS ===
const InstrumentsSection = () => {
    const [distance, setDistance] = useState(5);
    const [lateralOffset, setLateralOffset] = useState(0);
    const [altitude, setAltitude] = useState(1600);
    const [displayType, setDisplayType] = useState<'OBI' | 'HSI' | 'PFD'>('OBI');

    const GS_ANGLE = 3.0;
    const LOC_WIDTH = 2.5;
    const GS_WIDTH = 0.7;

    const altitudeNM = altitude / 6076;
    const currentAngle = Math.atan2(altitudeNM, distance) * (180 / Math.PI);
    const gsDeviationDegrees = currentAngle - GS_ANGLE;
    const gsDotsClamped = Math.max(-2.5, Math.min(2.5, -(gsDeviationDegrees / GS_WIDTH) * 2.5));
    const locDotsClamped = Math.max(-2.5, Math.min(2.5, -(lateralOffset / LOC_WIDTH) * 2.5));

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                <h3 className="text-xl font-bold text-sky-400 mb-4">Cockpit Instrumentation</h3>
                <p className="text-slate-300 mb-4 text-sm">
                    ILS is much more sensitive than VOR. <strong className="text-white">Localizer FSD = 2.5°</strong>, <strong className="text-white">Glide Slope FSD = 0.75°</strong>.
                </p>

                {/* Display Type Selector */}
                <div className="flex gap-2 mb-6">
                    {(['OBI', 'HSI', 'PFD'] as const).map(t => (
                        <button key={t} onClick={() => setDisplayType(t)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${displayType === t ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                            {t}
                        </button>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Instrument Display */}
                    <div className="bg-[#0a0a0a] rounded-xl border border-slate-800 p-8 flex flex-col items-center justify-center">
                        <div className="relative w-64 h-64 bg-slate-900 rounded-full border-4 border-slate-600 shadow-2xl flex items-center justify-center overflow-hidden">
                            {/* LOC Scale (Horizontal dots) */}
                            <div className="absolute flex gap-4">
                                {[-2, -1, 0, 1, 2].map(i => (
                                    <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'w-4 h-4 border-2 border-white bg-transparent' : 'bg-white/50'}`}></div>
                                ))}
                            </div>

                            {/* GS Scale (Vertical dots) */}
                            <div className="absolute flex flex-col gap-4">
                                {[-2, -1, 0, 1, 2].map(i => (
                                    <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'w-4 h-4 border-2 border-transparent bg-transparent' : 'bg-white/50'}`}></div>
                                ))}
                            </div>

                            {/* LOC Needle */}
                            <div
                                className="absolute w-1 h-40 bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)] transition-transform duration-300"
                                style={{ transform: `translateX(${locDotsClamped * 20}px)` }}
                            ></div>

                            {/* GS Needle */}
                            <div
                                className="absolute h-1 w-40 bg-amber-400 shadow-[0_0_10px_rgba(250,204,21,0.5)] transition-transform duration-300"
                                style={{ transform: `translateY(${-gsDotsClamped * 20}px)` }}
                            ></div>
                        </div>
                        <div className="mt-4 flex gap-4 text-xs font-mono">
                            <span className={`${Math.abs(locDotsClamped) < 0.5 ? 'text-green-400' : 'text-slate-400'}`}>
                                LOC: {locDotsClamped === 0 ? 'ON TRK' : locDotsClamped > 0 ? 'FLY RIGHT >' : '< FLY LEFT'}
                            </span>
                            <span className={`${Math.abs(gsDotsClamped) < 0.5 ? 'text-green-400' : 'text-slate-400'}`}>
                                GS: {gsDotsClamped === 0 ? 'ON PATH' : gsDotsClamped > 0 ? 'FLY UP ^' : 'v FLY DOWN'}
                            </span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs text-slate-400 flex justify-between">
                                <span>Distance from Threshold</span>
                                <span className="text-white font-mono">{distance} NM</span>
                            </label>
                            <input type="range" min="0.5" max="10" step="0.1" value={distance}
                                onChange={(e) => setDistance(parseFloat(e.target.value))} className="w-full accent-slate-500" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-slate-400 flex justify-between">
                                <span>Altitude (QNH)</span>
                                <span className="text-white font-mono">{altitude} ft</span>
                            </label>
                            <input type="range" min="0" max="4000" step="50" value={altitude}
                                onChange={(e) => setAltitude(parseInt(e.target.value))} className="w-full accent-amber-500" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-slate-400 flex justify-between">
                                <span>Lateral Offset</span>
                                <span className="text-white font-mono">{lateralOffset.toFixed(1)}°</span>
                            </label>
                            <input type="range" min="-5" max="5" step="0.1" value={lateralOffset}
                                onChange={(e) => setLateralOffset(parseFloat(e.target.value))} className="w-full accent-sky-500" />
                            <div className="flex justify-between text-[10px] text-slate-600">
                                <span>Left of Course</span>
                                <span>Right of Course</span>
                            </div>
                        </div>

                        <div className="bg-slate-800 p-4 rounded-lg">
                            <div className="text-xs text-slate-500 mb-2">Sensitivity Comparison</div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-400">VOR:</span>
                                    <span className="text-white ml-2">10° FSD</span>
                                </div>
                                <div>
                                    <span className="text-slate-400">LOC:</span>
                                    <span className="text-sky-400 ml-2">2.5° FSD</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// === SECTION 7: ERRORS ===
const ErrorsSection = () => {
    const [showFalseGS, setShowFalseGS] = useState(false);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-sky-400">Common Errors</h3>

                    <div className="bg-red-900/20 p-4 rounded-xl border border-red-500/30">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-red-900/50 rounded-lg"><AlertTriangle className="text-red-400" size={20} /></div>
                            <div>
                                <h4 className="font-bold text-red-400">False Glide Slopes</h4>
                                <p className="text-sm text-slate-300 mt-1">
                                    Side lobes create "echoes" above the real glide path, often at <strong className="text-white">double the angle</strong> (e.g., 6° instead of 3°).
                                </p>
                                <p className="text-xs text-slate-400 mt-2 italic">
                                    Solution: Always intercept the glide slope from <strong className="text-white">below</strong>.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-900/20 p-4 rounded-xl border border-amber-500/30">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-amber-900/50 rounded-lg"><Navigation className="text-amber-400" size={20} /></div>
                            <div>
                                <h4 className="font-bold text-amber-400">Back Course</h4>
                                <p className="text-sm text-slate-300 mt-1">
                                    Using the localizer for departure or landing in the opposite direction results in <strong className="text-white">reverse sensing</strong>.
                                </p>
                                <p className="text-xs text-slate-400 mt-2 italic">
                                    "Fly Left" indication actually requires turning Right. Prohibited for approaches in Europe.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 p-6">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">False Glide Slope Visualizer</h4>
                    <div className="relative h-64 bg-slate-900 rounded-lg overflow-hidden">
                        {/* Ground */}
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-emerald-900/20"></div>
                        {/* Runway */}
                        <div className="absolute bottom-8 right-4 w-12 h-1 bg-slate-500"></div>

                        {/* Real GS (3°) */}
                        <div className="absolute bottom-8 right-16 origin-bottom-right w-[200px] h-0 border-t-2 border-green-500"
                            style={{ transform: 'rotate(-3deg)' }}></div>
                        <div className="absolute bottom-16 right-[60%] text-xs text-green-400">3° (Real)</div>

                        {/* False GS (6°) */}
                        {showFalseGS && (
                            <>
                                <div className="absolute bottom-8 right-16 origin-bottom-right w-[200px] h-0 border-t-2 border-dashed border-red-500"
                                    style={{ transform: 'rotate(-6deg)' }}></div>
                                <div className="absolute top-16 right-[40%] text-xs text-red-400">6° (False)</div>
                            </>
                        )}

                        {/* Toggle */}
                        <button
                            onClick={() => setShowFalseGS(!showFalseGS)}
                            className="absolute top-4 left-4 px-3 py-1 bg-slate-800 text-xs text-white rounded hover:bg-slate-700"
                        >
                            {showFalseGS ? 'Hide False G/S' : 'Show False G/S'}
                        </button>
                    </div>

                    <div className="mt-4 p-3 bg-green-900/20 rounded border border-green-500/30 text-sm text-green-300">
                        <strong>Best Practice:</strong> Always intercept the glide slope from below to avoid capturing a false slope.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ILSSystem;
