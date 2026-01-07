import React, { useState } from 'react';
import { Plane, Maximize2 } from 'lucide-react';

const WingGeom: React.FC = () => {
    const [aspectRatio, setAspectRatio] = useState(8);
    const [taperRatio, setTaperRatio] = useState(0.5);
    const [sweep, setSweep] = useState(15);

    // Visualization Calculations
    // Draw right wing, mirror for left
    // Root chord length factor
    const rootChord = 100;
    const tipChord = rootChord * taperRatio;
    const semiSpan = Math.sqrt(aspectRatio * ((rootChord + tipChord) / 2 * (rootChord + tipChord) / 2));
    // Wait, AR = b^2 / S. S = b * c_avg. AR = b / c_avg. 
    // Let's fix span for visualization and adjust chords to match AR visually
    const fixedSpan = 250;
    const meanChord = (2 * fixedSpan) / aspectRatio; // Since AR = (2*span)^2 / S = 2*span / meanChord
    // meanChord approx (Root + Tip) / 2
    // meanChord = (Root + Root*taper)/2 = Root(1+taper)/2
    // Root = 2 * meanChord / (1 + taper)

    const calculatedRoot = (2 * meanChord) / (1 + taperRatio);
    const calculatedTip = calculatedRoot * taperRatio;

    // Sweep setback
    const tipSetback = fixedSpan * Math.tan(sweep * (Math.PI / 180));

    return (
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Plane className="text-emerald-400" /> Wing Geometry & Planform
            </h2>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Visualizer */}
                <div className="flex-1 bg-[#0f172a] rounded-xl border border-slate-600 h-[400px] flex items-center justify-center relative overflow-hidden">
                    <svg width="600" height="400" viewBox="-300 -50 600 400">
                        <defs>
                            <linearGradient id="wingGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                        </defs>

                        {/* Right Wing */}
                        <path
                            d={`M 0 0 L ${fixedSpan} ${tipSetback} L ${fixedSpan} ${tipSetback + calculatedTip} L 0 ${calculatedRoot} Z`}
                            fill="url(#wingGrad)"
                            stroke="#34d399"
                            strokeWidth="2"
                        />

                        {/* Left Wing (Mirrored) */}
                        <path
                            d={`M 0 0 L -${fixedSpan} ${tipSetback} L -${fixedSpan} ${tipSetback + calculatedTip} L 0 ${calculatedRoot} Z`}
                            fill="url(#wingGrad)"
                            stroke="#34d399"
                            strokeWidth="2"
                        />

                        {/* Center Line */}
                        <line x1="0" y1="-50" x2="0" y2="400" stroke="#475569" strokeDasharray="4,4" />

                        {/* Geometric Mean Chord (Approx location) */}
                        <rect x="0" y={calculatedRoot / 2} width={meanChord} height="2" fill="yellow" />
                        <text x="10" y={calculatedRoot / 2 - 5} fill="yellow" fontSize="10">MAC (Approx)</text>
                    </svg>

                    <div className="absolute bottom-4 right-4 bg-slate-800/80 p-2 rounded text-xs text-slate-300">
                        Top Down View
                    </div>
                </div>

                {/* Controls */}
                <div className="w-full md:w-1/3 space-y-6">
                    <div>
                        <label className="text-slate-400 text-sm block mb-2 flex justify-between">
                            <span>Aspect Ratio (AR)</span>
                            <span className="text-white font-mono">{aspectRatio}</span>
                        </label>
                        <input
                            type="range" min="4" max="25" step="0.5"
                            value={aspectRatio}
                            onChange={e => setAspectRatio(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>Fighter</span>
                            <span>Glider</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-slate-400 text-sm block mb-2 flex justify-between">
                            <span>Taper Ratio (λ)</span>
                            <span className="text-white font-mono">{taperRatio}</span>
                        </label>
                        <input
                            type="range" min="0" max="1" step="0.1"
                            value={taperRatio}
                            onChange={e => setTaperRatio(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>Pointed</span>
                            <span>Rectangular</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-slate-400 text-sm block mb-2 flex justify-between">
                            <span>Sweep Angle (Λ)</span>
                            <span className="text-white font-mono">{sweep}°</span>
                        </label>
                        <input
                            type="range" min="0" max="60" step="1"
                            value={sweep}
                            onChange={e => setSweep(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                    </div>

                    <div className="bg-slate-800 p-4 rounded-lg text-sm text-slate-300 space-y-2">
                        <h3 className="font-bold text-white mb-2"><Maximize2 size={14} className="inline mr-2" />Formulas</h3>
                        <div className="flex justify-between border-b border-slate-700 pb-1">
                            <span>Aspect Ratio</span>
                            <span className="font-mono text-emerald-400">b² / S</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-700 pb-1">
                            <span>Taper Ratio</span>
                            <span className="font-mono text-emerald-400">Ct / Cr</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Wing Area</span>
                            <span className="font-mono text-emerald-400">b × MAC</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WingGeom;
