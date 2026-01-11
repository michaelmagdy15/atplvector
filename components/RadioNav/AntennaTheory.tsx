import React, { useState, useEffect, useRef } from 'react';
import { View } from '../../types';
import { ArrowLeft, Wifi, Ruler, Radio, Globe, Info, RotateCw } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const AntennaTheory: React.FC<Props> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'PRINCIPLES' | 'SIZING' | 'TYPES' | 'PROPAGATION'>('PRINCIPLES');

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-6">
                <button
                    onClick={() => onNavigate?.(View.RAD_NAV_HOME)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                        <Wifi className="text-sky-400" size={32} />
                        Antenna Theory
                    </h1>
                    <p className="text-slate-400 mt-1">Fundamentals of radio wave propagation, antenna design, and types.</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 p-1 bg-slate-900/80 rounded-xl backdrop-blur-sm border border-slate-800">
                <TabButton
                    active={activeTab === 'PRINCIPLES'}
                    onClick={() => setActiveTab('PRINCIPLES')}
                    icon={<Wifi size={18} />}
                    label="Principles & Polarization"
                />
                <TabButton
                    active={activeTab === 'SIZING'}
                    onClick={() => setActiveTab('SIZING')}
                    icon={<Ruler size={18} />}
                    label="Sizing & Practicality"
                />
                <TabButton
                    active={activeTab === 'TYPES'}
                    onClick={() => setActiveTab('TYPES')}
                    icon={<Radio size={18} />}
                    label="Antenna Types"
                />
                <TabButton
                    active={activeTab === 'PROPAGATION'}
                    onClick={() => setActiveTab('PROPAGATION')}
                    icon={<Globe size={18} />}
                    label="Line of Sight (Propagation)"
                />
            </div>

            {/* Content Area */}
            <div className="transition-all duration-300 ease-in-out">
                {activeTab === 'PRINCIPLES' && <PrinciplesSection />}
                {activeTab === 'SIZING' && <SizingSection />}
                {activeTab === 'TYPES' && <TypesSection />}
                {activeTab === 'PROPAGATION' && <PropagationSection />}
            </div>
        </div>
    );
};

// --- Sub-Components ---

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${active
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
    >
        {icon}
        {label}
    </button>
);

const PrinciplesSection: React.FC = () => {
    const [polarization, setPolarization] = useState(0); // 0 = Vertical, 90 = Horizontal
    const [rxOrientation, setRxOrientation] = useState(0);

    // E-field is always vertical (0 deg) in this demo initially
    // Signal strength depends on difference
    const signalStrength = Math.abs(Math.cos((polarization - rxOrientation) * (Math.PI / 180)));

    return (
        <div className="space-y-8">
            {/* Principles Cards */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                    <h3 className="text-xl font-bold text-sky-400 mb-4 flex items-center gap-2">
                        <Wifi size={20} /> Electromagnetic Waves
                    </h3>
                    <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                        An antenna transmits and receives radio waves by converting electric currents into electromagnetic fields.
                        A radio wave consists of two perpendicular components traveling at the speed of light:
                    </p>
                    <ul className="space-y-3 mb-6">
                        <li className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-red-500/20">
                            <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                            <span className="text-slate-200 font-medium">Electric Field (E-Field)</span>
                            <span className="text-xs text-slate-500 ml-auto">Determines Polarization</span>
                        </li>
                        <li className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-blue-500/20">
                            <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                            <span className="text-slate-200 font-medium">Magnetic Field (H-Field)</span>
                            <span className="text-xs text-slate-500 ml-auto">Perpendicular to E</span>
                        </li>
                    </ul>

                    {/* Simple Wave Animation Placeholder */}
                    <div className="h-32 bg-slate-950 rounded-lg relative overflow-hidden flex items-center justify-center border border-slate-800">
                        {/* We can do a CSS animation here for a wave */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-1 bg-slate-800"></div>
                            <div className="absolute w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDuration: '2s' }}></div>
                            <div className="absolute w-2 h-2 bg-blue-500 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
                        </div>
                        <span className="text-xs text-slate-600 absolute bottom-2">Visual representation of orthogonal fields</span>
                    </div>
                </div>

                {/* Polarization Interactive */}
                <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                    <h3 className="text-xl font-bold text-sky-400 mb-4 flex items-center gap-2">
                        <RotateCw size={20} /> Polarization Matching
                    </h3>
                    <p className="text-slate-300 mb-6 text-sm">
                        For optimal reception, the receiving antenna's orientation must match the transmitting antenna's polarization (E-field orientation).
                    </p>

                    <div className="flex flex-col items-center space-y-6">
                        {/* Visual */}
                        <div className="relative w-48 h-48 bg-slate-950 rounded-full border-2 border-slate-800 flex items-center justify-center">
                            {/* TX Antenna (Fixed as Vertical for demo simplicity) */}
                            <div className="absolute w-1 h-32 bg-red-500/50 rounded-full"></div>
                            <div className="absolute text-xs text-red-500 -top-6 font-bold">TX (Vertical)</div>

                            {/* RX Antenna (Rotatable) */}
                            <div
                                className="w-1 h-32 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)] rounded-full transition-transform duration-300"
                                style={{ transform: `rotate(${rxOrientation}deg)` }}
                            ></div>
                            <div className="absolute text-xs text-green-500 -bottom-6 font-bold">RX (You)</div>
                        </div>

                        {/* Controls */}
                        <div className="w-full space-y-4">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Vertical (0°)</span>
                                <span>Horizontal (90°)</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="90"
                                step="1"
                                value={rxOrientation}
                                onChange={(e) => setRxOrientation(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                            />

                            {/* Signal Meter */}
                            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-400">Signal Strength</span>
                                    <span className={`font-mono font-bold ${signalStrength > 0.9 ? 'text-green-400' : signalStrength < 0.3 ? 'text-red-400' : 'text-yellow-400'}`}>
                                        {(signalStrength * 100).toFixed(0)}%
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${signalStrength > 0.9 ? 'bg-green-500' : signalStrength < 0.3 ? 'bg-red-500' : 'bg-yellow-500'}`}
                                        style={{ width: `${signalStrength * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SizingSection: React.FC = () => {
    const [freq, setFreq] = useState(118); // MHz
    const c = 300; // Speed of light approx in Mm/s for easy calculation (300 / f_MHz = lambda_m)
    const wavelength = c / freq;
    const optimalLength = wavelength / 2;
    const quarterWave = wavelength / 4;

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/50">
                    <h3 className="text-xl font-bold text-sky-400 mb-4">Antenna Sizing Calculator</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-400 mb-2">Frequency (MHz)</label>
                            <input
                                type="number"
                                value={freq}
                                onChange={(e) => setFreq(Math.max(1, Number(e.target.value)))}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-sky-500 outline-none"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-2">
                                <button onClick={() => setFreq(10)} className="hover:text-sky-400">HF (10 MHz)</button>
                                <button onClick={() => setFreq(118)} className="hover:text-sky-400">VHF Com (118 MHz)</button>
                                <button onClick={() => setFreq(300)} className="hover:text-sky-400">UHF (300 MHz)</button>
                            </div>
                        </div>

                        <div className="space-y-2 pt-4 border-t border-slate-800">
                            <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg">
                                <span className="text-slate-400 text-sm">Wavelength (λ)</span>
                                <span className="text-xl font-mono text-white">{wavelength.toFixed(2)} m</span>
                            </div>
                            <div className="flex justify-between items-center bg-sky-900/20 p-3 rounded-lg border border-sky-500/20">
                                <span className="text-sky-300 text-sm font-bold">Ideal Dipole (λ/2)</span>
                                <span className="text-xl font-mono text-sky-400">{optimalLength.toFixed(2)} m</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg">
                                <span className="text-slate-400 text-sm">Quarter Wave (λ/4)</span>
                                <span className="text-xl font-mono text-slate-300">{quarterWave.toFixed(2)} m</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-900/10 border border-yellow-500/20 p-4 rounded-xl">
                    <h4 className="flex items-center gap-2 text-yellow-400 font-bold mb-2">
                        <Info size={18} /> Practical Limitations
                    </h4>
                    <p className="text-sm text-yellow-200/80 leading-relaxed">
                        In the HF band (wavelengths 10–100m), a full half-wave dipole can be huge (up to 50m!).
                        Aircraft use fractions of the wavelength (e.g., 1/4, 1/8) or "bent" wire antennas to fit the airframe.
                        This compromises signal quality but is necessary for aerodynamics and structural integrity.
                    </p>
                </div>
            </div>

            {/* Visualizer */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-8 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(circle at center, #0ea5e9 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="text-xs text-slate-500 mb-2 mb-8">Relative Scale Presentation</div>

                    {/* Aircraft Silhouette (Just a reference size, say 30m length) */}
                    <div className="relative h-64 w-8 bg-slate-800 rounded-full flex items-center justify-center group">
                        <span className="absolute -left-16 text-slate-600 text-xs rotate-[-90deg]">Ref: Fuselage Section</span>

                        {/* The Antenna */}
                        <div
                            className="bg-sky-500 w-2 rounded-full shadow-[0_0_20px_rgba(14,165,233,0.6)] transition-all duration-500"
                            style={{ height: `${Math.min(optimalLength * 10, 240)}px` }} // Scale factor for viz
                        ></div>
                    </div>

                    <div className="mt-6 text-center">
                        <div className="text-2xl font-bold text-white transition-all">
                            {(optimalLength * 3.28084).toFixed(1)} <span className="text-sm text-slate-400">ft</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">Physical Length Required</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TypesSection: React.FC = () => {
    const types = [
        {
            id: 'LOOP',
            name: 'Loop Antenna',
            desc: 'Detects direction by measuring phase differences between sides.',
            app: 'NDB (ADF)',
            color: 'text-yellow-400',
            bg: 'bg-yellow-500'
        },
        {
            id: 'PARABOLIC',
            name: 'Parabolic Dish',
            desc: 'Reflects weak signals to a focus point for high gain.',
            app: 'Radar, SatCom',
            color: 'text-green-400',
            bg: 'bg-green-500'
        },
        {
            id: 'PHASED',
            name: 'Phased Array',
            desc: 'Electronic beam steering without moving parts.',
            app: 'Modern Radar',
            color: 'text-purple-400',
            bg: 'bg-purple-500'
        },
        {
            id: 'SLOTTED',
            name: 'Slotted Planar',
            desc: 'Flat plate with slots act as individual antennas.',
            app: 'Weather Radar',
            color: 'text-pink-400',
            bg: 'bg-pink-500'
        },
        {
            id: 'HELICAL',
            name: 'Helical Antenna',
            desc: 'Produces circularly polarized waves.',
            app: 'GPS',
            color: 'text-orange-400',
            bg: 'bg-orange-500'
        }
    ];

    const [selected, setSelected] = useState(types[0]);

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* List */}
            <div className="lg:col-span-1 space-y-3">
                {types.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setSelected(t)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${selected.id === t.id
                                ? 'bg-slate-800 border-sky-500/50 shadow-lg'
                                : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800'
                            }`}
                    >
                        <h4 className={`font-bold ${selected.id === t.id ? 'text-white' : 'text-slate-300'}`}>{t.name}</h4>
                        <div className={`text-xs mt-1 ${t.color}`}>{t.app}</div>
                    </button>
                ))}
            </div>

            {/* Detail View */}
            <div className="lg:col-span-2 glass-panel p-8 rounded-xl border border-slate-700 bg-slate-900/80 flex flex-col items-center justify-center min-h-[400px]">
                <h2 className="text-3xl font-bold text-white mb-2">{selected.name}</h2>
                <div className={`text-sm font-mono px-3 py-1 rounded-full bg-slate-950 mb-8 border border-slate-800 ${selected.color}`}>
                    Application: {selected.app}
                </div>

                <div className="relative w-full max-w-sm aspect-square bg-slate-950 rounded-2xl border-2 border-slate-800 flex items-center justify-center overflow-hidden mb-8">
                    {/* Dynamic Visuals based on ID */}
                    {selected.id === 'LOOP' && (
                        <div className="relative flex items-center justify-center">
                            <div className="w-48 h-48 border-8 border-slate-700 rounded-full"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-64 h-2 bg-yellow-500/20 blur-xl animate-pulse"></div>
                            </div>
                            <div className="absolute top-0 text-xs text-yellow-500 bg-black/50 px-2 rounded">Phase A</div>
                            <div className="absolute bottom-0 text-xs text-yellow-500 bg-black/50 px-2 rounded">Phase B</div>
                        </div>
                    )}
                    {selected.id === 'PARABOLIC' && (
                        <div className="relative flex items-center justify-center">
                            <div className="w-48 h-48 border-r-4 border-slate-300 rounded-full" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}></div>
                            <div className="absolute right-12 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></div>
                            {/* Rays */}
                            <div className="absolute w-32 h-[1px] bg-green-500/50 top-16 right-12 rotated-ray origin-right transform -rotate-12"></div>
                            <div className="absolute w-32 h-[1px] bg-green-500/50 bottom-16 right-12 rotated-ray origin-right transform rotate-12"></div>
                        </div>
                    )}
                    {selected.id === 'PHASED' && (
                        <div className="grid grid-cols-4 gap-2">
                            {[...Array(16)].map((_, i) => (
                                <div key={i} className={`w-8 h-8 rounded bg-purple-900/50 border border-purple-500/30 ${[5, 6, 9, 10].includes(i) ? 'bg-purple-500 animate-pulse' : ''}`}></div>
                            ))}
                            <div className="absolute w-full h-32 bg-purple-500/10 blur-xl -top-10 animate-pulse"></div>
                        </div>
                    )}
                    {selected.id === 'SLOTTED' && (
                        <div className="w-48 h-32 bg-slate-800 border-2 border-slate-600 rounded flex flex-col justify-around px-4 relative overflow-hidden">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="w-full h-1 bg-black rounded-full shadow-[0_0_5px_#ec4899] animate-pulse"></div>
                            ))}
                            <div className="absolute inset-0 bg-pink-500/10 mix-blend-overlay"></div>
                        </div>
                    )}
                    {selected.id === 'HELICAL' && (
                        <div className="relative">
                            <svg width="200" height="100" viewBox="0 0 200 100">
                                <path d="M10,50 Q30,10 50,50 T90,50 T130,50 T170,50" fill="none" stroke="#f97316" strokeWidth="4" className="drop-shadow-[0_0_5px_#f97316]" />
                            </svg>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-orange-500 rounded-full animate-ping"></div>
                        </div>
                    )}
                </div>

                <p className="text-slate-300 text-center max-w-lg leading-relaxed">{selected.desc}</p>
            </div>
        </div>
    );
};

const PropagationSection: React.FC = () => {
    const [h1, setH1] = useState(100);
    const [h2, setH2] = useState(3000);
    const range = (1.23 * Math.sqrt(h1) + 1.23 * Math.sqrt(h2)).toFixed(1);

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-4">Line of Sight Calculator</h3>
                    <p className="text-slate-400 mb-6 text-sm">
                        VHF/UHF signals travel in straight lines. The range is limited by the curvature of the Earth.
                    </p>

                    <div className="space-y-6">
                        <div>
                            <label className="flex justify-between text-sm text-slate-300 mb-2">
                                <span>Transmitter Height</span>
                                <span className="font-mono text-sky-400">{h1} ft</span>
                            </label>
                            <input type="range" min="0" max="5000" step="50" value={h1} onChange={(e) => setH1(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500" />
                        </div>
                        <div>
                            <label className="flex justify-between text-sm text-slate-300 mb-2">
                                <span>Receiver Height (Aircraft)</span>
                                <span className="font-mono text-sky-400">{h2} ft</span>
                            </label>
                            <input type="range" min="0" max="45000" step="500" value={h2} onChange={(e) => setH2(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500" />
                        </div>
                    </div>

                    <div className="mt-8 bg-sky-900/20 border border-sky-500/20 p-4 rounded-xl flex justify-between items-center">
                        <span className="text-sky-200 font-semibold">Max Range</span>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-sky-400 font-mono">{range}</div>
                            <div className="text-xs text-sky-500">Nautical Miles</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-b from-sky-900/20 to-slate-900 rounded-xl border border-slate-700 p-6 flex items-center justify-center">
                <div className="relative w-full h-64">
                    <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-2xl">
                        {/* Earth Curvature */}
                        <path d="M-50,250 Q200,100 450,250" fill="#1e293b" stroke="#334155" strokeWidth="2" />

                        {/* TX Tower */}
                        <line x1="50" y1="185" x2="50" y2="150" stroke="#94a3b8" strokeWidth="2" />
                        <circle cx="50" cy="150" r="3" fill="#0ea5e9" />
                        <text x="40" y="200" className="text-[10px] fill-slate-500">TX</text>

                        {/* Aircraft */}
                        <g transform={`translate(300, ${150 - (h2 / 500)})`}>
                            <path d="M-10,0 L10,0 M0,-5 L0,5" stroke="#f472b6" strokeWidth="2" />
                        </g>

                        {/* Signal Path */}
                        <line
                            x1="50"
                            y1="150"
                            x2="300"
                            y2={150 - (h2 / 500)}
                            stroke="#0ea5e9"
                            strokeWidth="1"
                            strokeDasharray="4 2"
                            className="animated-line"
                        />
                    </svg>
                    <div className="absolute bottom-4 left-4 text-xs text-slate-500 italic">
                        *Not to scale. Exaggerated for visualization.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AntennaTheory;
