
import React, { useState, useEffect, useRef } from 'react';
import { View } from '../../types';
import { ArrowLeft, CloudRain, Zap, Layers, AlertTriangle } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const WeatherRadar: React.FC<Props> = ({ onNavigate }) => {
    // Controls
    const [tilt, setTilt] = useState(0); // Degrees (-15 to +15)
    const [gain, setGain] = useState(50); // %
    const [range, setRange] = useState(80); // NM
    const [isoEcho, setIsoEcho] = useState(false);
    const [showShadow, setShowShadow] = useState(true);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sweepRef = useRef(0);
    const animationRef = useRef<number | null>(null);

    // Weather Cell Data (Simulated)
    // Distance (NM), Azimuth (Deg), Intensity (0-100), Size (NM)
    const [cells] = useState([
        { dist: 30, az: -10, intensity: 90, size: 8 }, // Heavy Storm (Left)
        { dist: 45, az: 15, intensity: 60, size: 12 }, // Moderate Rain (Right)
        { dist: 60, az: -5, intensity: 40, size: 20 }, // Light Rain (Center)
    ]);

    useEffect(() => {
        const render = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const width = canvas.width;
            const height = canvas.height;
            const cx = width / 2;
            const cy = height; // Fan origin at bottom center

            // Clear Background
            ctx.fillStyle = '#020617'; // Slate 950
            ctx.fillRect(0, 0, width, height);

            // Draw Range Arcs
            ctx.strokeStyle = '#1e293b'; // Slate 800
            ctx.lineWidth = 1;
            const scale = height / range; // px per NM

            for (let r = range / 4; r <= range; r += range / 4) {
                ctx.beginPath();
                ctx.arc(cx, cy, r * scale, Math.PI, 2 * Math.PI);
                ctx.stroke();
                // Label
                ctx.fillStyle = '#64748b';
                ctx.font = '10px monospace';
                ctx.fillText(`${r} NM`, cx + 5, cy - r * scale + 10);
            }

            // Draw Azimuth Lines
            [-30, -15, 0, 15, 30].forEach(deg => {
                const rad = (deg - 90) * (Math.PI / 180);
                const x = cx + Math.cos(rad) * height;
                const y = cy + Math.sin(rad) * height;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(x, y);
                ctx.stroke();
            });

            // --- Render Weather Returns ---
            // Calculate effective "slice" based on Tilt
            // Simple model: 
            // - Ground clutter appears if Tilt < -2
            // - Storm tops approx 40k ft. Bottoms 2k ft.
            // - Aircraft Alt: assume 30k ft.
            // - Beam width: 3 degrees.

            // Ground Clutter Simulation
            if (tilt < -1) {
                const clutterStart = Math.max(10, 80 + (tilt * 5)); // Clutter moves out as tilt goes up (less negative)
                // Draw noise at range
                for (let i = 0; i < 500; i++) {
                    const r = (clutterStart + Math.random() * 40) * scale;
                    const theta = Math.PI + (Math.random() * Math.PI); // Full 180 semi circle
                    const x = cx + r * Math.cos(theta);
                    const y = cy + r * Math.sin(theta);

                    if (y < height && y > 0 && x > 0 && x < width) {
                        ctx.fillStyle = Math.random() > 0.5 ? '#15803d' : '#facc15'; // Green/Yellow clutter
                        ctx.fillRect(x, y, 2, 2);
                    }
                }
            }

            // Weather Cells
            cells.forEach((cell, index) => {
                // Determine visibility based on Tilt
                // 1 deg tilt = 100ft per NM approx.
                // At 30NM, 1 deg change = 3000ft.
                // If we tilt UP (+), we scan tops. Down (-), we scan lower.
                // Let's assume optimal tilt for this weather is 0 deg.
                // If tilt > 5, we overscan (miss it).
                // If tilt < -10, we underscan (ground clutter obscures).

                const tiltFactor = Math.abs(tilt); // Simple deviation
                if (tiltFactor > 8) return; // Beam misses cell

                // Attenuation Logic (Shadowing)
                // If this cell is BEHIND a stronger cell, reduce its intensity
                // Simple check: is there a cell with *similar azimuth* but *closer distance*?
                let attenuatedIntensity = cell.intensity;

                if (showShadow) {
                    cells.forEach(blocker => {
                        if (blocker === cell) return;
                        if (blocker.dist < cell.dist &&
                            Math.abs(blocker.az - cell.az) < 10 && // Overlapping azimuth
                            blocker.intensity > 70) { // Strong enough to attenuate
                            attenuatedIntensity *= 0.2; // Massive signal loss
                        }
                    });
                }

                // Color Mapping (Green -> Yellow -> Red -> Magenta)
                let color = '#22c55e'; // Green
                if (attenuatedIntensity > 50) color = '#eab308'; // Yellow
                if (attenuatedIntensity > 75) color = '#ef4444'; // Red
                if (attenuatedIntensity > 85) color = '#d946ef'; // Magenta (Turbulence)

                // Iso-Echo: Strong returns turn BLACK
                if (isoEcho && attenuatedIntensity > 80) {
                    color = '#000000'; // Black hole effect
                }

                // Draw Cell (Blob)
                const centerR = cell.dist * scale;
                const centerTheta = (cell.az - 90) * (Math.PI / 180);
                const baseX = cx + centerR * Math.cos(centerTheta);
                const baseY = cy + centerR * Math.sin(centerTheta);
                const sizePx = cell.size * scale;

                const grad = ctx.createRadialGradient(baseX, baseY, 0, baseX, baseY, sizePx);
                grad.addColorStop(0, color);
                grad.addColorStop(1, 'transparent');

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(baseX, baseY, sizePx, 0, 2 * Math.PI);
                ctx.fill();

                // Iso-Echo border (if black)
                if (isoEcho && attenuatedIntensity > 80) {
                    ctx.strokeStyle = '#d946ef';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });


            // Sweep Line
            sweepRef.current = (sweepRef.current + 2) % 360; // deg
            // Constrain sweep to +/- 60 deg scan sector
            // Let's create a ping-pong sweep -60 to +60
            const time = Date.now() / 1000;
            const sweepAngle = Math.sin(time * 2) * 60; // +/- 60 deg

            const sweepRad = (sweepAngle - 90) * (Math.PI / 180);

            ctx.strokeStyle = '#0ea5e9'; // Sky blue
            ctx.lineWidth = 2;
            ctx.shadowColor = '#0ea5e9';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + height * Math.cos(sweepRad), cy + height * Math.sin(sweepRad));
            ctx.stroke();
            ctx.shadowBlur = 0;

            animationRef.current = requestAnimationFrame(render);
        };

        render();
        return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
    }, [tilt, gain, range, isoEcho, showShadow, cells]);


    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => onNavigate?.(View.RAD_NAV_HOME)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                    <CloudRain className="text-emerald-400" />
                    <h1 className="text-2xl font-bold text-slate-100">Airborne Weather Radar</h1>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Radar Display (EHSI/ND style) */}
                <div className="lg:col-span-2 bg-black rounded-3xl border-8 border-slate-800 shadow-2xl overflow-hidden relative aspect-[4/3]">
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover"
                    />

                    {/* Corner Info */}
                    <div className="absolute top-4 left-4 text-emerald-500 font-mono text-sm space-y-1">
                        <div>WXR {isoEcho ? 'ISO' : 'STD'}</div>
                        <div>TILT {tilt > 0 ? `+${tilt.toFixed(1)}` : tilt.toFixed(1)}°</div>
                        <div>GAIN {gain}%</div>
                    </div>

                    <div className="absolute top-4 right-4 text-emerald-500 font-mono text-sm text-right">
                        <div>RNG {range}</div>
                        <div>MODE WX</div>
                    </div>

                    {/* Aircraft Symbol */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-white">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L12 22M2 12L22 12" stroke="transparent" /> {/* Spacer */}
                            <path d="M12 2L15 10L22 12L15 14L12 22L9 14L2 12L9 10L12 2Z" fill="#fbbf24" stroke="none" />
                        </svg>
                    </div>
                </div>

                {/* Control Panel */}
                <div className="space-y-6 bg-slate-900 p-6 rounded-2xl border border-slate-700">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Layers size={20} />
                        Radar Control Head
                    </h2>

                    {/* Tilt Control */}
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <label className="text-xs font-bold text-slate-400 uppercase flex justify-between mb-2">
                            <span>Antenna Tilt</span>
                            <span className="text-white">{tilt.toFixed(1)}°</span>
                        </label>
                        <input
                            type="range"
                            min="-15" max="15" step="0.5"
                            value={tilt}
                            onChange={(e) => setTilt(parseFloat(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                            <span>DN (Ground)</span>
                            <span>AUTO</span>
                            <span>UP (Overshoot)</span>
                        </div>
                    </div>

                    {/* Range Control */}
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <label className="text-xs font-bold text-slate-400 uppercase flex justify-between mb-2">
                            <span>Range</span>
                            <span className="text-white">{range} NM</span>
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {[10, 20, 40, 80, 160, 320].map(r => (
                                <button
                                    key={r}
                                    onClick={() => setRange(r)}
                                    className={`px-2 py-1 rounded text-xs font-bold transition-all ${range === r
                                        ? 'bg-blue-600 text-white shadow'
                                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                        }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Modes */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setIsoEcho(!isoEcho)}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${isoEcho
                                ? 'bg-fuchsia-900/50 border-fuchsia-500/50 text-fuchsia-200'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                                }`}
                        >
                            <Zap size={24} className={isoEcho ? "animate-pulse" : ""} />
                            <span className="font-bold">ISO-ECHO</span>
                        </button>

                        <button
                            onClick={() => setShowShadow(!showShadow)}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${showShadow
                                ? 'bg-orange-900/50 border-orange-500/50 text-orange-200'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                                }`}
                        >
                            <AlertTriangle size={24} />
                            <span className="font-bold">ATTENUATION</span>
                        </button>
                    </div>

                    {/* Theory Panel */}
                    <div className="border border-blue-500/30 bg-blue-900/10 p-4 rounded-xl text-xs space-y-2 text-blue-200">
                        <h4 className="font-bold text-blue-100 border-b border-blue-500/20 pb-2 mb-2">Operational Theory</h4>
                        <p>
                            <strong>Planar Array:</strong> Stabilized antenna to maintain horizon reference during turns.
                        </p>
                        <p>
                            <strong>Attenuation:</strong> Heavy rain (Red/Magenta) absorbs radar energy, creating a "Shadow" behind it where other storms may hide.
                        </p>
                        <p>
                            <strong>Iso-Echo:</strong> Inverts strong signals (&gt;80%) to black to highlight areas of steepest gradient (extreme turbulence).
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default WeatherRadar;
