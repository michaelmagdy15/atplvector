import React, { useState } from 'react';
import { View } from '../../types';
import { ArrowLeft, ArrowRightLeft, Ruler } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const DMESimulator: React.FC<Props> = ({ onNavigate }) => {
    const [altitude, setAltitude] = useState(30000); // Feet
    const [groundDist, setGroundDist] = useState(10); // NM

    // Calculations
    const altitudeNM = altitude / 6076.12; // Convert feet to NM
    const slantRange = Math.sqrt(Math.pow(groundDist, 2) + Math.pow(altitudeNM, 2));
    const error = slantRange - groundDist;
    const errorPercent = (error / groundDist) * 100;

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => onNavigate?.(View.RAD_NAV_HOME)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                    <Ruler className="text-emerald-400" /> DME Simulator
                </h1>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Visualizer (Triangle) */}
                <div className="glass-panel p-8 rounded-2xl flex items-center justify-center bg-slate-900/50 relative min-h-[400px]">
                    <div className="relative w-full max-w-[400px] aspect-[4/3] border-b-2 border-slate-600 border-l-2 border-slate-600">
                        {/* Plane Position */}
                        <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                            <div className="text-white">✈️</div>
                            <div className="text-xs text-white absolute -top-5 left-0 whitespace-nowrap">
                                Alt: {altitude.toLocaleString()} ft ({altitudeNM.toFixed(1)} NM)
                            </div>
                        </div>

                        {/* Station Position */}
                        <div className="absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2">
                            <div className="w-4 h-4 bg-emerald-500 rounded-sm"></div>
                            <div className="text-xs text-emerald-500 absolute top-5 left-0 whitespace-nowrap font-bold">DME Station</div>
                        </div>

                        {/* Hypotenuse (Slant Range) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                            <line x1="0%" y1="100%" x2="100%" y2="0%" stroke="#34d399" strokeWidth="2" strokeDasharray="5,5" />
                            <text x="50%" y="45%" fill="#34d399" className="text-sm font-bold bg-slate-900">
                                Slant Range: {slantRange.toFixed(2)} NM
                            </text>
                        </svg>

                        {/* Ground Distance */}
                        <div className="absolute bottom-[-20px] w-full text-center text-xs text-slate-400">
                            Ground Distance: {groundDist} NM
                        </div>
                    </div>
                </div>

                {/* Controls & Data */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl space-y-4">
                        <div className="space-y-4">
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

                        <div className="bg-slate-950 p-4 rounded-xl space-y-2 border border-slate-800">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">DME Indication:</span>
                                <span className="text-emerald-400 font-bold font-mono text-lg">{slantRange.toFixed(2)} NM</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">True Ground Distance:</span>
                                <span className="text-slate-200 font-mono">{groundDist.toFixed(2)} NM</span>
                            </div>
                            <div className="h-px bg-white/10 my-2"></div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500">Slant Range Error:</span>
                                <span className={`${error > 0.5 ? 'text-red-400' : 'text-green-400'} font-bold`}>
                                    +{error.toFixed(2)} NM ({errorPercent.toFixed(1)}%)
                                </span>
                            </div>
                        </div>

                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs leading-relaxed text-blue-200">
                            <strong>Rule of Thumb:</strong> When ground distance is at least <span className="text-white font-bold">1 NM for every 1000 ft</span> of altitude, the slant range error is negligible.
                            <br /><br />
                            Current Ratio: <span className="font-mono text-white">{(groundDist / (altitude / 1000)).toFixed(1)} NM per 1000ft</span>
                        </div>

                        {groundDist === 0 && (
                            <div className="p-2 bg-red-500/20 text-red-300 text-xs rounded border border-red-500/30 text-center font-bold">
                                OVERHEAD STATION: DME reads Altitude!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DMESimulator;
