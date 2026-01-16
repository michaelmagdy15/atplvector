
import React, { useState } from 'react';
import { Cloud, ArrowUp, ArrowDown, Calculator, Info, AlertTriangle, Mountain, Ruler } from 'lucide-react';

const Altimetry: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'basics' | 'fast-method' | 'errors' | 'calculator' | 'pit-calc'>('basics');

    // Calculator State
    const [qnh, setQnh] = useState(1013);
    const [elevation, setElevation] = useState(0);
    const [tempDev, setTempDev] = useState(0); // ISA Deviation

    // Fast Method State
    const [targetAltitude, setTargetAltitude] = useState(10000);
    const [pressureDiff, setPressureDiff] = useState(0);

    // PIT Calculator State
    const [pitQnh, setPitQnh] = useState(1013);
    const [pitIndicatedAlt, setPitIndicatedAlt] = useState(10000);
    const [pitTempDev, setPitTempDev] = useState(0);

    // PIT Calculations
    const pressCorr = (pitQnh - 1013) * 30; // Approx 30ft per hPa
    const pressAlt = pitIndicatedAlt - pressCorr;

    // Temp correction formula: 4ft per 1000ft per degree deviation
    // Applied to the INDICATED altitude (technically the height of the column of air)
    const tempCorr = (pitIndicatedAlt / 1000) * 4 * pitTempDev;
    const trueAlt = pitIndicatedAlt + tempCorr;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Ruler className="text-teal-400" size={32} />
                    Altimetry & The Atmosphere
                </h2>
                <p className="text-slate-400 text-lg">
                    Master pressure altitude, density altitude, and altimeter errors with interactive tools.
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                    { id: 'basics', label: 'Fundamentals', icon: Mountain },
                    { id: 'fast-method', label: 'The Fast Method', icon: ArrowUp },
                    { id: 'pit-calc', label: 'P I T Calculator', icon: Info },
                    { id: 'errors', label: 'Errors & Hazards', icon: AlertTriangle },
                    { id: 'calculator', label: 'Flight Level Calc', icon: Calculator },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                            }`}
                    >
                        {/* @ts-ignore */}
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 min-h-[500px]">

                {/* --- BASICS TAB --- */}
                {activeTab === 'basics' && (
                    <div className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-white">Pressure Definitions</h3>
                                <div className="space-y-3">
                                    {[
                                        { code: 'QNH', title: 'Nautical Height', desc: 'Altimeter reads ELEVATION when on ground. Used for altitude below Transition Altitude.' },
                                        { code: 'QFE', title: 'Field Elevation', desc: 'Altimeter reads ZERO when on ground. Height above reference point.' },
                                        { code: 'QNE', title: 'Standard Pressure', desc: '1013.25 hPa. Used for Flight Levels above Transition Altitude.' },
                                    ].map(item => (
                                        <div key={item.code} className="bg-slate-800 p-4 rounded-lg border-l-4 border-teal-500">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xl font-bold text-teal-400">{item.code}</span>
                                                <span className="text-xs font-mono text-slate-500 uppercase">{item.title}</span>
                                            </div>
                                            <p className="text-slate-300 text-sm">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
                                {/* Interactive Visualiser for Q-Codes could go here */}
                                <div className="relative w-full max-w-xs h-64 bg-slate-900/50 rounded-lg border border-slate-700 overflow-hidden text-center flex items-center justify-center">
                                    <p className="text-slate-500 italic">Visual Reference</p>

                                    {/* Simple SVG diagram */}
                                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                                        {/* Sea Level */}
                                        <path d="M0 180 L200 180" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
                                        <text x="5" y="175" fill="#3b82f6" fontSize="10">MSL</text>

                                        {/* Terrain */}
                                        <path d="M0 180 L50 180 L80 120 L120 120 L150 180 L200 180" fill="#334155" stroke="none" />

                                        {/* Airport */}
                                        <rect x="90" y="118" width="40" height="2" fill="#ef4444" />
                                        <text x="90" y="115" fill="#ef4444" fontSize="10">Aerodrome</text>

                                        {/* Aircraft */}
                                        <circle cx="110" cy="50" r="5" fill="#facc15" />
                                        <text x="120" y="55" fill="#e2e8f0" fontSize="10">Aircraft</text>

                                        {/* QFE Line */}
                                        <path d="M110 50 L110 120" stroke="#facc15" strokeWidth="1" />
                                        <text x="115" y="90" fill="#facc15" fontSize="10">Height (QFE)</text>

                                        {/* QNH Line */}
                                        <path d="M80 50 L80 180" stroke="#2dd4bf" strokeWidth="1" />
                                        <text x="40" y="100" fill="#2dd4bf" fontSize="10">Altitude (QNH)</text>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- FAST METHOD TAB --- */}
                {activeTab === 'fast-method' && (
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="bg-gradient-to-r from-teal-900/40 to-slate-900 p-6 rounded-xl border border-teal-500/30">
                            <h3 className="text-xl font-bold text-teal-300 mb-4 flex items-center gap-2">
                                <ArrowUp className="w-6 h-6" /> The "Gaps" Technical Method
                            </h3>
                            <p className="text-slate-300 mb-6">
                                The easiest way to solve altimetry problems is to draw columns. Remember:
                                <br />
                                <strong className="text-white">"High to Low, Watch out Below"</strong> (True altitude is LOWER than Indicated).
                                <br />
                                <strong className="text-white">"Low to High, Clear Blue Sky"</strong> (True altitude is HIGHER than Indicated).
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                {/* Controls */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm text-slate-400">Pressure Difference (hPa)</label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="range" min="-50" max="50" step="1"
                                                value={pressureDiff}
                                                onChange={(e) => setPressureDiff(parseInt(e.target.value))}
                                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                                            />
                                            <span className="w-16 font-mono text-right text-teal-400 font-bold">
                                                {pressureDiff > 0 ? `+${pressureDiff}` : pressureDiff}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            Simulate flying from Standard (1013) to an area with {1013 + pressureDiff} hPa.
                                        </p>
                                    </div>

                                    <div className="bg-black/20 p-4 rounded-lg">
                                        <div className="flex justify-between text-sm text-slate-400 mb-2">
                                            <span>Indicated Alt:</span>
                                            <span className="text-white font-mono">10,000 ft</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-slate-400 mb-2">
                                            <span>Pressure Correction:</span>
                                            <span className="text-teal-400 font-mono">{pressureDiff * 30} ft</span>
                                        </div>
                                        <div className="h-px bg-slate-700 my-2"></div>
                                        <div className="flex justify-between font-bold text-white">
                                            <span>True Altitude:</span>
                                            <span className="font-mono text-xl">{10000 + (pressureDiff * 30)} ft</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Visualisation */}
                                <div className="h-80 bg-slate-800 rounded-xl relative overflow-hidden border border-slate-700">
                                    {/* Reference Line (Indicated) */}
                                    <div className="absolute top-[40%] left-0 right-0 border-t border-dashed border-white/30 flex items-center">
                                        <span className="text-xs text-white/50 ml-2 bg-slate-800 px-1">Indicated (10,000')</span>
                                    </div>

                                    {/* Aircraft */}
                                    <div
                                        className="absolute left-1/2 transform -translate-x-1/2 transition-all duration-500"
                                        style={{ top: `${40 - (pressureDiff * 0.5)}%` }} // Simple scaling for visual
                                    >
                                        <div className={`p-2 rounded-lg text-xs font-bold whitespace-nowrap mb-1 text-center transition-colors ${(10000 + pressureDiff * 30) < 10000 ? 'text-red-400 bg-red-950/50' : 'text-green-400 bg-green-950/50'
                                            }`}>
                                            True: {10000 + (pressureDiff * 30)}'
                                        </div>
                                        <PlaneIcon className={`w-8 h-8 ${(10000 + pressureDiff * 30) < 10000 ? 'text-red-500' : 'text-green-500'
                                            }`} />
                                    </div>

                                    {/* Ground/Sea */}
                                    <div className="absolute bottom-0 w-full h-12 bg-blue-500/20 border-t border-blue-500/50"></div>
                                </div>
                            </div>
                        </div>

                        {/* Steps */}
                        <div className="grid md:grid-cols-3 gap-4">
                            {[
                                { step: 1, text: 'Compare QNH vs Subscale' },
                                { step: 2, text: 'Difference x 30ft' },
                                { step: 3, text: 'High to Low = Subtract' },
                            ].map((s) => (
                                <div key={s.step} className="bg-slate-800 p-4 rounded-lg flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-teal-900 text-teal-400 flex items-center justify-center font-bold">{s.step}</div>
                                    <span className="text-slate-200 font-medium">{s.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- PIT CALCULATOR TAB --- */}
                {activeTab === 'pit-calc' && (
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Header Section */}
                        <div className="text-center space-y-4">
                            <h3 className="text-2xl font-bold text-white tracking-wide">P &nbsp; I &nbsp; T &nbsp; Calculator</h3>
                            <p className="text-slate-400 max-w-2xl mx-auto">
                                Visualize the relationship between <span className="text-blue-400 font-bold">Pressure</span>, <span className="text-purple-400 font-bold">Indicated</span>, and <span className="text-green-400 font-bold">True</span> altitude.
                                Use the sliders to apply Pressure and Temperature corrections.
                            </p>
                        </div>

                        {/* Diagram Container */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 relative">
                            {/* Inputs Row */}
                            <div className="flex flex-col md:flex-row justify-between gap-6 mb-12">
                                <div className="flex-1 bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                                    <label className="text-sm text-slate-400 font-semibold mb-2 block">Pressure Setting (QNH)</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            value={pitQnh}
                                            onChange={(e) => setPitQnh(Number(e.target.value))}
                                            className="bg-transparent border-b border-slate-500 text-2xl font-mono text-center w-full focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                        <span className="text-xs font-bold text-slate-500">hPa</span>
                                    </div>
                                    <input
                                        type="range" min="950" max="1050"
                                        value={pitQnh}
                                        onChange={(e) => setPitQnh(Number(e.target.value))}
                                        className="w-full mt-4 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                </div>

                                <div className="flex-1 bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                                    <label className="text-sm text-slate-400 font-semibold mb-2 block">Indicated Altitude</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            value={pitIndicatedAlt}
                                            onChange={(e) => setPitIndicatedAlt(Number(e.target.value))}
                                            className="bg-transparent border-b border-slate-500 text-2xl font-mono text-center w-full focus:outline-none focus:border-purple-500 transition-colors"
                                        />
                                        <span className="text-xs font-bold text-slate-500">ft</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="50000" step="100"
                                        value={pitIndicatedAlt}
                                        onChange={(e) => setPitIndicatedAlt(Number(e.target.value))}
                                        className="w-full mt-4 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                    />
                                </div>

                                <div className="flex-1 bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                                    <label className="text-sm text-slate-400 font-semibold mb-2 block">ISA Deviation</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            value={pitTempDev}
                                            onChange={(e) => setPitTempDev(Number(e.target.value))}
                                            className={`bg-transparent border-b border-slate-500 text-2xl font-mono text-center w-full focus:outline-none transition-colors ${pitTempDev < 0 ? 'text-blue-400' : 'text-red-400'}`}
                                        />
                                        <span className="text-xs font-bold text-slate-500">°C</span>
                                    </div>
                                    <input
                                        type="range" min="-30" max="30"
                                        value={pitTempDev}
                                        onChange={(e) => setPitTempDev(Number(e.target.value))}
                                        className="w-full mt-4 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                    />
                                </div>
                            </div>

                            {/* P I T Visual Flow */}
                            <div className="flex justify-between items-center relative py-8 px-4 md:px-12">
                                {/* Connecting Arcs (Decorators) */}
                                <div className="absolute top-0 left-12 right-12 h-8 border-t-2 border-dashed border-slate-600/30 rounded-[100%]"></div>

                                {/* P Node */}
                                <div className="flex flex-col items-center gap-4 z-10 w-1/3">
                                    <div className="bg-blue-900/20 border border-blue-500/50 p-4 rounded-2xl min-w-[120px] text-center backdrop-blur-sm">
                                        <span className="text-4xl font-black text-blue-400 block mb-1">P</span>
                                        <span className="text-xs text-blue-300 uppercase tracking-wider font-bold">Pressure</span>
                                    </div>
                                    <div className="bg-slate-900 px-3 py-1 rounded border border-slate-700 font-mono text-lg font-bold text-blue-200">
                                        {Math.round(pressAlt)} ft
                                    </div>
                                </div>

                                {/* Arrows/Correction Display P <-> I */}
                                <div className="flex-1 flex flex-col items-center justify-center -mt-12">
                                    <div className="text-xs text-slate-400 mb-1">Pressure Corr</div>
                                    <div className={`font-mono font-bold text-sm px-2 py-0.5 rounded ${pressCorr >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {pressCorr > 0 ? '+' : ''}{Math.round(pressCorr)} ft
                                    </div>
                                    <div className="w-full h-px bg-slate-600 my-2 relative">
                                        <div className="absolute left-0 -top-1 w-2 h-2 border-l border-b border-slate-600 rotate-45"></div>
                                        <div className="absolute right-0 -top-1 w-2 h-2 border-r border-t border-slate-600 rotate-45"></div>
                                    </div>
                                </div>

                                {/* I Node */}
                                <div className="flex flex-col items-center gap-4 z-10 w-1/3">
                                    <div className="bg-purple-900/20 border border-purple-500/50 p-6 rounded-2xl min-w-[140px] text-center backdrop-blur-sm transform scale-110 shadow-lg shadow-purple-900/20">
                                        <span className="text-5xl font-black text-purple-400 block mb-1">I</span>
                                        <span className="text-xs text-purple-300 uppercase tracking-wider font-bold">Indicated</span>
                                    </div>
                                    <div className="bg-slate-900 px-4 py-2 rounded border border-slate-700 font-mono text-xl font-bold text-purple-200">
                                        {Math.round(pitIndicatedAlt)} ft
                                    </div>
                                </div>

                                {/* Arrows/Correction Display I <-> T */}
                                <div className="flex-1 flex flex-col items-center justify-center -mt-12">
                                    <div className="text-xs text-slate-400 mb-1">Temp Corr</div>
                                    <div className={`font-mono font-bold text-sm px-2 py-0.5 rounded ${tempCorr >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {tempCorr > 0 ? '+' : ''}{Math.round(tempCorr)} ft
                                    </div>
                                    <div className="w-full h-px bg-slate-600 my-2 relative">
                                        <div className="absolute left-0 -top-1 w-2 h-2 border-l border-b border-slate-600 rotate-45"></div>
                                        <div className="absolute right-0 -top-1 w-2 h-2 border-r border-t border-slate-600 rotate-45"></div>
                                    </div>
                                </div>

                                {/* T Node */}
                                <div className="flex flex-col items-center gap-4 z-10 w-1/3">
                                    <div className="bg-green-900/20 border border-green-500/50 p-4 rounded-2xl min-w-[120px] text-center backdrop-blur-sm">
                                        <span className="text-4xl font-black text-green-400 block mb-1">T</span>
                                        <span className="text-xs text-green-300 uppercase tracking-wider font-bold">True</span>
                                    </div>
                                    <div className="bg-slate-900 px-3 py-1 rounded border border-slate-700 font-mono text-lg font-bold text-green-200">
                                        {Math.round(trueAlt)} ft
                                    </div>
                                </div>
                            </div>

                            {/* Summary Text */}
                            <div className="bg-slate-900/50 p-4 rounded-xl text-center text-sm text-slate-400 mt-8">
                                <p>
                                    At Indicated Altitude <strong>{pitIndicatedAlt} ft</strong> with QNH <strong>{pitQnh}</strong> and Temp Dev <strong>{pitTempDev > 0 ? '+' : ''}{pitTempDev}°C</strong>:
                                </p>
                                <p className="mt-2 text-white">
                                    The aircraft is effectively flying at <strong>{Math.round(trueAlt)} ft</strong> True Altitude.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- ERRORS TAB --- */}
                {activeTab === 'errors' && (
                    <div className="space-y-6">
                        <div className="bg-orange-500/10 border border-orange-500/30 p-6 rounded-xl">
                            <h3 className="text-xl font-bold text-orange-400 mb-2 flex items-center gap-2">
                                <AlertTriangle /> Temperature Error
                            </h3>
                            <p className="text-slate-300">
                                <strong>"Hot to Cold, Watch out Below."</strong>
                                <br />
                                When flying into colder than ISA air, your altimeter overreads. You are LOWER than you think.
                                <br />
                                <em>Correction: 4% per 10°C (ISA deviation).</em>
                            </p>
                        </div>

                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                            <h4 className="text-lg font-bold text-white mb-4">Temperature Correction Calculator</h4>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-slate-400 block mb-1">Indicated Altitude (ft)</label>
                                        <input
                                            type="number"
                                            value={targetAltitude}
                                            onChange={(e) => setTargetAltitude(Number(e.target.value))}
                                            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-slate-400 block mb-1">ISA Deviation (°C)</label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="range" min="-50" max="50" step="5"
                                                value={tempDev}
                                                onChange={(e) => setTempDev(Number(e.target.value))}
                                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                            />
                                            <span className={`w-12 font-mono font-bold text-right ${tempDev < 0 ? 'text-blue-400' : 'text-red-400'}`}>
                                                {tempDev > 0 ? '+' : ''}{tempDev}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center items-center bg-slate-900 rounded-xl p-6 border border-slate-700">
                                    <span className="text-slate-400 text-sm mb-1">True Altitude Approx</span>
                                    <span className={`text-4xl font-mono font-bold ${(targetAltitude + (targetAltitude * (4 * tempDev) / 1000)) < targetAltitude ? 'text-red-500' : 'text-green-500'
                                        }`}>
                                        {Math.round(targetAltitude + (targetAltitude * (4 * tempDev) / 1000))} ft
                                    </span>
                                    <span className="text-xs text-slate-500 mt-2">
                                        Error: {Math.round(targetAltitude * (4 * tempDev) / 1000)} ft
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- CALCULATOR TAB --- */}
                {activeTab === 'calculator' && (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Inputs */}
                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Calculator size={20} className="text-teal-400" />
                                    Parameters
                                </h3>
                                <div>
                                    <label className="text-sm text-slate-400">QNH (hPa)</label>
                                    <input
                                        type="number"
                                        value={qnh}
                                        onChange={(e) => setQnh(Number(e.target.value))}
                                        className="w-full mt-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-slate-400">Elevation (ft)</label>
                                    <input
                                        type="number"
                                        value={elevation}
                                        onChange={(e) => setElevation(Number(e.target.value))}
                                        className="w-full mt-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white font-mono"
                                    />
                                </div>
                                <div className="pt-4 border-t border-slate-700">
                                    <p className="text-xs text-slate-500 mb-2">Presets:</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => setQnh(1013)} className="px-3 py-1 bg-slate-700 rounded text-xs hover:bg-slate-600 text-white">Standard</button>
                                        <button onClick={() => setQnh(990)} className="px-3 py-1 bg-slate-700 rounded text-xs hover:bg-slate-600 text-white">Low Pres</button>
                                        <button onClick={() => setQnh(1030)} className="px-3 py-1 bg-slate-700 rounded text-xs hover:bg-slate-600 text-white">High Pres</button>
                                    </div>
                                </div>
                            </div>

                            {/* Results */}
                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-center space-y-6">
                                <div>
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-slate-400 text-sm">Pressure Altitude</span>
                                        <span className="text-slate-500 text-xs">(1013 - QNH) x 30 + Elev</span>
                                    </div>
                                    <div className="text-3xl font-mono font-bold text-white bg-slate-900 p-3 rounded-lg border border-slate-600 text-right">
                                        {Math.round((1013 - qnh) * 30 + elevation)} ft
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-slate-400 text-sm">QFE (Approx)</span>
                                        <span className="text-slate-500 text-xs">QNH - (Elev / 30)</span>
                                    </div>
                                    <div className="text-3xl font-mono font-bold text-teal-400 bg-slate-900 p-3 rounded-lg border border-slate-600 text-right">
                                        {Math.round(qnh - (elevation / 30))} hPa
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper for the plane icon to avoid missing dependency if it's not imported above
const PlaneIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M2 12h20" stroke="none" />
        <path d="M12 2l-5 10l5 10l5-10z" fill="currentColor" stroke="none" />
        {/* Simple arrow/plane shape fallback */}
        <polygon points="12 2 2 22 22 22 12 2" />
    </svg>
);

export default Altimetry;
