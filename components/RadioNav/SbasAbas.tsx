import React, { useState, useEffect } from 'react';
import { View } from '../../types';
import { ArrowLeft, Satellite, RadioTower, Server, Send } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const SbasAbas: React.FC<Props> = ({ onNavigate }) => {
    const [step, setStep] = useState(0);

    // Animation Loop for data flow
    useEffect(() => {
        const interval = setInterval(() => {
            setStep((s) => (s + 1) % 6);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    const steps = [
        { id: 0, label: 'GPS Constellation emits signals', icon: Satellite },
        { id: 1, label: 'Reference Stations (RIMS) receive signals and calculate error', icon: RadioTower },
        { id: 2, label: 'Master Control Center processes corrections', icon: Server },
        { id: 3, label: 'Uplink Station sends msg to GEO Satellite', icon: Send },
        { id: 4, label: 'GEO Satellite broadcasts integrity/correctionmsg locally', icon: Satellite },
        { id: 5, label: 'Aircraft receives GPS + Correction (Accuracy < 3m)', icon: PlaneIcon }
    ];

    function PlaneIcon() { return <div className="text-xl">✈️</div>; }

    return (
        <div className="max-w-5xl mx-auto p-4 space-y-8">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => onNavigate?.(View.RAD_NAV_HOME)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                    <Satellite className="text-sky-400" />
                    <h1 className="text-2xl font-bold text-slate-100">SBAS & ABAS (GNSS Augmentation)</h1>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* SBAS Visualizer */}
                <div className="col-span-1 border border-slate-700 bg-slate-900 rounded-2xl p-6 relative overflow-hidden min-h-[500px]">
                    <h2 className="text-lg font-bold text-white mb-6">SBAS Architecture (EGNOS / WAAS)</h2>

                    {/* Diagram Layout */}
                    <div className="relative w-full h-[400px]">

                        {/* 1. GPS Satellites (Top Left) */}
                        <div className={`absolute top-0 left-10 transition-all duration-500 ${step === 0 ? 'scale-125 text-white drop-shadow-glow' : 'text-slate-600'}`}>
                            <Satellite size={40} />
                            <span className="text-xs absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">GPS Constellation</span>
                        </div>

                        {/* 2. RIMS (Bottom Left) */}
                        <div className={`absolute bottom-10 left-10 transition-all duration-500 ${step === 1 ? 'scale-125 text-yellow-400 drop-shadow-glow' : 'text-slate-600'}`}>
                            <RadioTower size={40} />
                            <span className="text-xs absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">Ref Station (RIMS)</span>
                        </div>

                        {/* 3. Master Station (Bottom Center) */}
                        <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 transition-all duration-500 ${step === 2 ? 'scale-125 text-blue-400 drop-shadow-glow' : 'text-slate-600'}`}>
                            <Server size={40} />
                            <span className="text-xs absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">Master Control (MCC)</span>
                        </div>

                        {/* 4. Uplink (Bottom Right) */}
                        <div className={`absolute bottom-10 right-10 transition-all duration-500 ${step === 3 ? 'scale-125 text-green-400 drop-shadow-glow' : 'text-slate-600'}`}>
                            <Send size={40} />
                            <span className="text-xs absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">Uplink Station (NLES)</span>
                        </div>

                        {/* 5. GEO Sat (Top Right) */}
                        <div className={`absolute top-10 right-10 transition-all duration-500 ${step === 4 ? 'scale-125 text-purple-400 drop-shadow-glow' : 'text-slate-600'}`}>
                            <Satellite size={40} />
                            <span className="text-xs absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">GEO Satellite (SBAS)</span>
                        </div>

                        {/* 6. Aircraft (Center) */}
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${step === 5 ? 'scale-150 text-white drop-shadow-glow' : 'text-slate-700'}`}>
                            <PlaneIcon />
                        </div>

                        {/* Connection Lines (SVG) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <defs>
                                <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                                    <path d="M0,0 L0,6 L9,3 z" fill="#475569" />
                                </marker>
                                <marker id="arrow-active" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                                    <path d="M0,0 L0,6 L9,3 z" fill="#38bdf8" />
                                </marker>
                            </defs>

                            {/* GPS -> RIMS */}
                            <line x1="60" y1="40" x2="60" y2="350" stroke={step === 0 ? "#38bdf8" : "#334155"} strokeWidth="2" strokeDasharray="5,5" markerEnd={step === 0 ? "url(#arrow-active)" : "url(#arrow)"} />

                            {/* RIMS -> MCC */}
                            <line x1="80" y1="370" x2="200" y2="370" stroke={step === 1 ? "#fbbf24" : "#334155"} strokeWidth="2" markerEnd={step === 1 ? "url(#arrow-active)" : "url(#arrow)"} />

                            {/* MCC -> Uplink */}
                            <line x1="240" y1="370" x2="380" y2="370" stroke={step === 2 ? "#60a5fa" : "#334155"} strokeWidth="2" markerEnd={step === 2 ? "url(#arrow-active)" : "url(#arrow)"} />

                            {/* Uplink -> GEO */}
                            <line x1="400" y1="350" x2="400" y2="60" stroke={step === 3 ? "#4ade80" : "#334155"} strokeWidth="2" strokeDasharray="5,5" markerEnd={step === 3 ? "url(#arrow-active)" : "url(#arrow)"} />

                            {/* GEO -> Aircraft */}
                            <line x1="380" y1="60" x2="230" y2="190" stroke={step === 4 ? "#c084fc" : "#334155"} strokeWidth="2" markerEnd={step === 4 ? "url(#arrow-active)" : "url(#arrow)"} />

                            {/* GPS -> Aircraft (Direct) */}
                            <line x1="80" y1="40" x2="210" y2="190" stroke="#334155" strokeWidth="1" strokeDasharray="2,2" />
                        </svg>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <h4 className="text-sm font-bold text-slate-400 mb-2">Process Step: {step + 1}/6</h4>
                        <p className="text-white text-lg animate-fade-in">{steps[step].label}</p>
                    </div>
                </div>

                {/* ABAS / RAIM Info */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl space-y-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">ABAS (RAIM) Requirements</h2>
                        <p className="text-sm text-slate-300">
                            <strong>Receiver Autonomous Integrity Monitoring</strong> uses redundant GPS signals to detect faults locally, without ground stations.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
                                <div className="text-3xl font-bold text-sky-400 mb-1">5</div>
                                <div className="text-xs text-slate-400 uppercase font-bold">Satellites</div>
                                <div className="text-sm text-white mt-2">Fault Detection</div>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
                                <div className="text-3xl font-bold text-green-400 mb-1">6</div>
                                <div className="text-xs text-slate-400 uppercase font-bold">Satellites</div>
                                <div className="text-sm text-white mt-2">Fault Exclusion</div>
                            </div>
                        </div>

                        <div className="bg-blue-900/20 p-3 rounded text-xs text-blue-200 border border-blue-500/20">
                            Barometric Aiding can substitute for 1 satellite in some cases.
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-xl">
                        <h2 className="text-lg font-bold text-white mb-4">Systems</h2>
                        <div className="space-y-3">
                            <div className="p-3 bg-slate-900 rounded border border-slate-700">
                                <span className="font-bold text-sky-400 block">WAAS</span>
                                <span className="text-xs text-slate-400">Wide Area Augmentation System (USA)</span>
                            </div>
                            <div className="p-3 bg-slate-900 rounded border border-slate-700">
                                <span className="font-bold text-yellow-400 block">EGNOS</span>
                                <span className="text-xs text-slate-400">European Geostationary Navigation Overlay Service (Europe)</span>
                            </div>
                            <div className="p-3 bg-slate-900 rounded border border-slate-700">
                                <span className="font-bold text-purple-400 block">MSAS / GAGAN</span>
                                <span className="text-xs text-slate-400">Japan / India</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SbasAbas;
