import React, { useState } from 'react';
import { PenTool, Ruler, Info } from 'lucide-react';

const AerofoilGeom: React.FC = () => {
    const [camber, setCamber] = useState(2); // %
    const [thickness, setThickness] = useState(12); // %
    const [position, setPosition] = useState(30); // % of chord

    // Generate NACA 4-digit airfoil coordinates (Simplified approximation)
    const generatePoints = () => {
        const pointsTop = [];
        const pointsBottom = [];
        const m = camber / 100;
        const p = position / 10; // Input is %, NACA p is 0.x (e.g. 40% -> 0.4)
        const t = thickness / 100;
        const steps = 100;

        for (let i = 0; i <= steps; i++) {
            const x = i / steps;

            // Thickness distribution
            const yt = 5 * t * (0.2969 * Math.sqrt(x) - 0.1260 * x - 0.3516 * Math.pow(x, 2) + 0.2843 * Math.pow(x, 3) - 0.1015 * Math.pow(x, 4));

            // Camber line
            let yc = 0;
            let dyc_dx = 0;

            if (m === 0) {
                yc = 0;
                dyc_dx = 0;
            } else {
                if (x < p) {
                    yc = (m / Math.pow(p, 2)) * (2 * p * x - Math.pow(x, 2));
                    dyc_dx = (2 * m / Math.pow(p, 2)) * (p - x);
                } else {
                    yc = (m / Math.pow(1 - p, 2)) * ((1 - 2 * p) + 2 * p * x - Math.pow(x, 2));
                    dyc_dx = (2 * m / Math.pow(1 - p, 2)) * (p - x);
                }
            }

            const theta = Math.atan(dyc_dx);

            const xu = x - yt * Math.sin(theta);
            const yu = yc + yt * Math.cos(theta);
            const xl = x + yt * Math.sin(theta);
            const yl = yc - yt * Math.cos(theta);

            // Scale for SVG (Width 600, Height 200)
            const scaleX = 600;
            const scaleY = 300; // Y scale
            const offsetX = 50;
            const offsetY = 150; // Middle

            pointsTop.push(`${xu * scaleX + offsetX},${offsetY - yu * scaleY}`);
            pointsBottom.push(`${xl * scaleX + offsetX},${offsetY - yl * scaleY}`);
        }

        return {
            path: `M ${pointsTop.join(' L ')} L ${pointsBottom.reverse().join(' L ')} Z`,
            camberLine: `M ${50},150 ` + Array.from({ length: 101 }, (_, i) => {
                const x = i / 100;
                let yc = 0;
                if (m !== 0) {
                    if (x < p) yc = (m / Math.pow(p, 2)) * (2 * p * x - Math.pow(x, 2));
                    else yc = (m / Math.pow(1 - p, 2)) * ((1 - 2 * p) + 2 * p * x - Math.pow(x, 2));
                }
                return `${x * 600 + 50},${150 - yc * 300}`;
            }).join(' L '),
            chordLine: `M 50,150 L 650,150`
        };
    };

    const geom = generatePoints();

    return (
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <PenTool className="text-purple-400" /> Aerofoil Geometry Designer
            </h2>

            <div className="space-y-8">
                {/* Visualization */}
                <div className="bg-[#0f172a] rounded-xl border border-slate-600 p-4 overflow-hidden relative h-[350px] flex items-center justify-center">
                    <svg width="700" height="300" viewBox="0 0 700 300">
                        {/* Grid */}
                        <defs>
                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />

                        {/* Chord Line */}
                        <path d={geom.chordLine} stroke="#475569" strokeWidth="2" strokeDasharray="5,5" />
                        <text x="660" y="155" fill="#475569" fontSize="12">Chord Line</text>

                        {/* Camber Line */}
                        <path d={geom.camberLine} stroke="#f59e0b" strokeWidth="2" fill="none" />
                        <text x="350" y="100" fill="#f59e0b" fontSize="12" textAnchor="middle">Mean Camber Line</text>

                        {/* Airfoil Shape */}
                        <path d={geom.path} fill="#3b82f6" fillOpacity="0.2" stroke="#60a5fa" strokeWidth="3" />

                        {/* Points of Interest */}
                        <circle cx="50" cy="150" r="4" fill="#ef4444" />
                        <text x="50" y="180" fill="#ef4444" fontSize="12" textAnchor="middle">Leading Edge</text>

                        <circle cx="650" cy="150" r="4" fill="#ef4444" />
                        <text x="650" y="180" fill="#ef4444" fontSize="12" textAnchor="middle">Trailing Edge</text>
                    </svg>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <label className="text-slate-400 text-sm block mb-2 flex justify-between">
                            <span>Max Camber</span>
                            <span className="text-white font-mono">{camber}%</span>
                        </label>
                        <input
                            type="range" min="0" max="10" step="0.1"
                            value={camber}
                            onChange={e => setCamber(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                        <p className="text-xs text-slate-500 mt-2">Curvature of the wing.</p>
                    </div>

                    <div>
                        <label className="text-slate-400 text-sm block mb-2 flex justify-between">
                            <span>Max Thickness</span>
                            <span className="text-white font-mono">{thickness}%</span>
                        </label>
                        <input
                            type="range" min="1" max="30" step="0.5"
                            value={thickness}
                            onChange={e => setThickness(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                        <p className="text-xs text-slate-500 mt-2">Relative to chord length.</p>
                    </div>

                    <div>
                        <label className="text-slate-400 text-sm block mb-2 flex justify-between">
                            <span>Camber Position</span>
                            <span className="text-white font-mono">{position}%</span>
                        </label>
                        <input
                            type="range" min="10" max="90" step="1"
                            value={position}
                            onChange={e => setPosition(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                        <p className="text-xs text-slate-500 mt-2">Location of max camber.</p>
                    </div>
                </div>

                <div className="bg-slate-800 p-4 rounded-lg flex items-start gap-4">
                    <Info className="text-sky-400 shrink-0 mt-1" />
                    <div className="text-sm text-slate-300">
                        <p className="mb-2"><strong>Definitions:</strong></p>
                        <ul className="list-disc ml-4 space-y-1">
                            <li><strong>Chord Line:</strong> Straight line connecting Leading Edge and Trailing Edge.</li>
                            <li><strong>Mean Camber Line:</strong> Line equidistant from upper and lower surfaces.</li>
                            <li><strong>Camber:</strong> Max distance between Mean Camber Line and Chord Line.</li>
                            <li><strong>Thickness:</strong> Max distance between upper and lower surfaces perpendicular to chord.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AerofoilGeom;
