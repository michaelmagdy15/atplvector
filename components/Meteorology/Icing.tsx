import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Snowflake, Droplets, Thermometer, AlertTriangle, ShieldAlert, ArrowUpRight, CheckCircle2, RotateCcw } from 'lucide-react';

const Icing: React.FC = () => {
    const [selectedType, setSelectedType] = useState<'clear' | 'rime' | 'fzra' | 'mixed'>('clear');

    const icingProfiles = {
        clear: {
            title: 'Clear Ice (Glaze)',
            dangerBadge: 'Most Lethal Structural Ice',
            color: 'text-red-400',
            border: 'border-red-500/40',
            bg: 'bg-red-500/10',
            temp: '0°C to -10°C (Peak: -2°C to -7°C)',
            clouds: 'Cumuliform (Cu, TCU, CB) & Freezing Rain',
            droplets: 'Large Supercooled Water Droplets (SCWD) with high Liquid Water Content (LWC)',
            mechanism: 'Upon impact, freezing is slow due to latent heat release. The liquid water flows backward over the aerofoil before freezing solid, forming a dense, transparent, tenacious coating.',
            aerodynamics: 'Drastically deforms the camber of the aerofoil, induces severe runback ice behind de-icing boots, and increases stall speed by 10-15+ kts.',
            removal: 'Extremely difficult to shed; pneumatic boots often cannot crack it once runback occurs.'
        },
        rime: {
            title: 'Rime Ice',
            dangerBadge: 'Manageable with Boots',
            color: 'text-cyan-300',
            border: 'border-cyan-500/40',
            bg: 'bg-cyan-500/10',
            temp: '-10°C to -20°C',
            clouds: 'Stratiform (St, Sc, As)',
            droplets: 'Small droplets with low Liquid Water Content (LWC)',
            mechanism: 'Small droplets freeze instantaneously on contact. Trapped microscopic air bubbles produce a milky white, opaque, brittle, rough deposit on the stagnation point of leading edges.',
            aerodynamics: 'Increases skin friction drag and causes moderate lift degradation. Does not flow back past protected areas.',
            removal: 'Easily cracked and shed by pneumatic leading-edge de-icing boots.'
        },
        mixed: {
            title: 'Mixed Ice',
            dangerBadge: 'High Severity',
            color: 'text-amber-400',
            border: 'border-amber-500/40',
            bg: 'bg-amber-500/10',
            temp: '-10°C to -15°C',
            clouds: 'Towering Cumulus & Occlusions with mixed droplet spectra',
            droplets: 'Mixture of large and small supercooled water droplets',
            mechanism: 'Simultaneous combination of instantaneous freezing small droplets and flowing large droplets, producing an irregular, rough, heavy deposit.',
            aerodynamics: 'High drag increase and erratic lift loss; difficult to predict stall margin degradation.',
            removal: 'Requires frequent cycling of de-icing boots and engine anti-ice systems.'
        },
        fzra: {
            title: 'Freezing Rain (FZRA) Hazard',
            dangerBadge: 'Immediate Evacuation Required',
            color: 'text-purple-400',
            border: 'border-purple-500/40',
            bg: 'bg-purple-500/10',
            temp: 'Sub-zero boundary layer beneath warm inversion layer aloft',
            clouds: 'Warm frontal inversions / rain falling from warm layer',
            droplets: 'Supercooled precipitation drops (>500 microns)',
            mechanism: 'Liquid rain drops fall through a freezing air layer near the ground. They strike sub-zero aircraft surfaces and freeze into massive clear ice across the entire airframe within minutes.',
            aerodynamics: 'Rapid, catastrophic airframe ice accretion on wings, fuselage, tailplane, and windshields. Leading cause of severe in-flight control upsets.',
            removal: 'Exceeds capability of all certified de-icing equipment. Mandatory immediate climb into warm inversion aloft or 180° turn!'
        }
    };

    const current = icingProfiles[selectedType];

    return (
        <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/30">
                            <Snowflake className="text-cyan-400" size={32} />
                        </div>
                        Aviation Icing Physics & Aerodynamics
                        <span className="text-sm font-bold bg-cyan-600 px-3 py-1 rounded-full text-white tracking-wide ml-2">ATPL 050</span>
                    </h2>
                    <p className="text-slate-400 mt-2 text-base font-light">
                        Supercooled droplet dynamics, thermodynamic freezing mechanisms, freezing rain inversions, and aerodynamic stall penalties.
                    </p>
                </div>

                {/* Type Selector */}
                <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800 backdrop-blur-md overflow-x-auto">
                    {(['clear', 'rime', 'mixed', 'fzra'] as const).map(type => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${
                                selectedType === type
                                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/50'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            {type === 'fzra' ? 'Freezing Rain' : `${type} ice`}
                        </button>
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Interactive Profile Card */}
                <div className="lg:col-span-2 space-y-6">
                    <div className={`p-8 rounded-3xl border bg-slate-900/90 ${current.border} shadow-2xl space-y-6`}>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                            <div>
                                <h3 className={`text-2xl font-black ${current.color} flex items-center gap-3`}>
                                    {current.title}
                                </h3>
                                <span className="text-xs font-mono text-slate-400">
                                    Thermal Band: {current.temp}
                                </span>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-slate-950 text-white text-xs font-bold border border-white/10">
                                {current.dangerBadge}
                            </span>
                        </div>

                        {/* Visual Aerofoil Cross-Section SVG */}
                        <div className="relative h-56 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
                            <svg className="w-full h-full" viewBox="0 0 500 200">
                                <defs>
                                    <linearGradient id="airfoilGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#475569" />
                                        <stop offset="100%" stopColor="#1e293b" />
                                    </linearGradient>
                                </defs>

                                {/* Airfoil Shape (NACA profile) */}
                                <path
                                    d="M80,100 C120,40 320,80 440,100 C320,115 120,135 80,100 Z"
                                    fill="url(#airfoilGrad)"
                                    stroke="#94a3b8"
                                    strokeWidth="2"
                                />
                                <text x="240" y="105" fill="#64748b" fontSize="12" fontWeight="bold">Aerofoil Chord Line</text>

                                {/* Ice Layer Deposition depending on selected type */}
                                {selectedType === 'clear' && (
                                    <g>
                                        {/* Runback clear ice behind leading edge */}
                                        <path
                                            d="M75,100 C70,75 100,55 160,65 C140,75 110,80 90,95 C110,110 150,118 160,128 C100,135 70,120 75,100 Z"
                                            fill="#38bdf8"
                                            fillOpacity="0.4"
                                            stroke="#38bdf8"
                                            strokeWidth="2"
                                        />
                                        <text x="60" y="35" fill="#38bdf8" fontSize="11" fontWeight="bold">Double Horn / Runback Ice</text>
                                        <line x1="120" y1="40" x2="100" y2="70" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
                                    </g>
                                )}

                                {selectedType === 'rime' && (
                                    <g>
                                        {/* Pointed brittle ice right at stagnation point */}
                                        <path
                                            d="M80,100 C60,95 50,100 45,100 C50,105 60,105 80,100 Z"
                                            fill="#e2e8f0"
                                            fillOpacity="0.85"
                                            stroke="#ffffff"
                                            strokeWidth="2"
                                        />
                                        <ellipse cx="65" cy="100" rx="15" ry="8" fill="#cbd5e1" opacity="0.9" />
                                        <text x="40" y="75" fill="#e2e8f0" fontSize="11" fontWeight="bold">Stagnation Point Build</text>
                                        <line x1="80" y1="80" x2="65" y2="95" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                                    </g>
                                )}

                                {selectedType === 'mixed' && (
                                    <g>
                                        <path
                                            d="M75,100 C60,80 90,65 130,70 C100,85 85,95 75,100 Z"
                                            fill="#f59e0b"
                                            fillOpacity="0.5"
                                            stroke="#fbbf24"
                                            strokeWidth="2"
                                        />
                                        <text x="60" y="45" fill="#fbbf24" fontSize="11" fontWeight="bold">Rough Jagged Deposit</text>
                                    </g>
                                )}

                                {selectedType === 'fzra' && (
                                    <g>
                                        {/* Total envelope clear ice coating */}
                                        <path
                                            d="M70,100 C115,30 325,75 445,100 C325,120 115,142 70,100 Z"
                                            fill="none"
                                            stroke="#c084fc"
                                            strokeWidth="6"
                                            strokeOpacity="0.7"
                                        />
                                        <text x="180" y="30" fill="#c084fc" fontSize="12" fontWeight="bold">
                                            Total Surface Glaze (Entire Upper/Lower Surface)
                                        </text>
                                    </g>
                                )}

                                {/* Airflow streamlines */}
                                <g opacity="0.3" stroke="#94a3b8" strokeWidth="1" strokeDasharray="6 4">
                                    <path d="M20,60 Q150,20 480,50" fill="none" />
                                    <path d="M20,140 Q150,180 480,150" fill="none" />
                                </g>
                            </svg>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                <span className="text-slate-500 font-bold uppercase block mb-1">Droplet & Cloud Environment</span>
                                <div className="text-slate-200 font-medium leading-relaxed">{current.droplets}</div>
                                <div className="text-cyan-400 font-mono mt-2">Clouds: {current.clouds}</div>
                            </div>

                            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                <span className="text-slate-500 font-bold uppercase block mb-1">Freezing Mechanism</span>
                                <p className="text-slate-300 leading-relaxed">{current.mechanism}</p>
                            </div>
                        </div>

                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs space-y-2">
                            <span className="text-slate-500 font-bold uppercase block">Aerodynamic Penalties & Removal Action</span>
                            <p className="text-slate-300 leading-relaxed">{current.aerodynamics}</p>
                            <div className="pt-2 border-t border-slate-800 text-amber-300 font-bold">
                                Removal Protocol: {current.removal}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Side Column: Aerodynamic Penalties & Freezing Rain Inversion */}
                <div className="space-y-6">
                    {/* Aerodynamic Penalties Card */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                            <AlertTriangle className="text-red-400" size={18} />
                            Aerodynamic Degradation (EASA Ch 14)
                        </h4>

                        <div className="space-y-3 text-xs">
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex justify-between items-center">
                                <span className="text-slate-300">Lift Loss (Leading Edge):</span>
                                <span className="text-red-400 font-mono font-bold text-sm">Up to -30%</span>
                            </div>
                            <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl flex justify-between items-center">
                                <span className="text-slate-300">Drag Increase:</span>
                                <span className="text-orange-400 font-mono font-bold text-sm">Up to +40%</span>
                            </div>
                            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex justify-between items-center">
                                <span className="text-slate-300">Stall Speed Increase:</span>
                                <span className="text-amber-300 font-mono font-bold text-sm">+10 to +15 kts</span>
                            </div>
                            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl flex justify-between items-center">
                                <span className="text-slate-300">Critical AoA (α-crit):</span>
                                <span className="text-purple-300 font-mono font-bold text-sm">Decreased</span>
                            </div>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-relaxed italic pt-2 border-t border-slate-800">
                            "Even a microscopic sandpaper roughness on the leading edge (0.4mm) degrades lift by 25% and drag by 30%."
                        </p>
                    </div>

                    {/* Freezing Rain Inversion Card */}
                    <div className="bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/30 p-6 rounded-3xl space-y-3">
                        <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                            <ShieldAlert size={18} />
                            Freezing Rain Physics & Inversion
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Freezing rain requires an <strong>inversion aloft</strong>. Snow or ice crystals fall into an upper warm wedge (&gt;0°C), melt into liquid rain, and then fall through a sub-zero cold dome near the ground.
                        </p>
                        <div className="p-3 bg-slate-950 rounded-xl border border-purple-500/20 text-xs">
                            <span className="text-purple-300 font-bold block mb-1">EASA Standard Mandatory Action:</span>
                            <div className="flex items-center gap-2 text-white font-bold">
                                <RotateCcw size={14} className="text-emerald-400" /> Immediate 180° Turn OR Climb
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1">
                                Climb into the warmer air layer aloft, or reverse course immediately. Never descend into the sub-freezing layer!
                            </p>
                        </div>
                    </div>

                    {/* Carburetor / Induction Icing */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-2">
                        <div className="flex justify-between items-center">
                            <h4 className="text-sm font-bold text-white">Carburetor / Induction Icing</h4>
                            <span className="text-xs font-mono text-orange-400">Up to +30°C</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Fuel vaporization (latent heat absorption) and Venturi adiabatic expansion together cause a temperature drop of up to <strong>20°C to 25°C</strong> within the carburetor throat.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Icing;
