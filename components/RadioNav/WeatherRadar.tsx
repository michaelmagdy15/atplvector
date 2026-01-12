
import React, { useState, useEffect, useRef } from 'react';
import { View } from '../../types';
import { ArrowLeft, CloudRain, Wind, AlertTriangle, Info, Compass, Target, Layers, Ruler, Activity, Settings } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

interface StormCell {
    id: number;
    angle: number; // Azimuth relative to nose (0 is straight ahead)
    dist: number;  // NM
    width: number; // NM radius
    height: number; // ft (Top of storm)
    base: number;   // ft (Bottom of storm)
    intensity: number; // 0-1 (1 is max)
    type: 'CB' | 'STRATUS';
}

const WeatherRadar: React.FC<Props> = ({ onNavigate }) => {
    // Simulator State
    const [range, setRange] = useState(80); // NM Range Scale
    const [tilt, setTilt] = useState(0); // Degrees
    const [gain, setGain] = useState(70); // %
    const [mode, setMode] = useState<'WX' | 'MAP' | 'WX+T'>('WX');
    const [aircraftAlt, setAircraftAlt] = useState(15000); // ft
    const [scanAngle, setScanAngle] = useState(0); // Current beam angle (-45 to 45)

    // Derived Constants
    const BEAM_WIDTH = 3.0; // Degrees
    const GROUND_ELEVATION = 0; // ft MSL

    // Simulation Objects
    const [storms, setStorms] = useState<StormCell[]>([]);
    const ndCanvasRef = useRef<HTMLCanvasElement>(null);
    const vertCanvasRef = useRef<HTMLCanvasElement>(null);

    // Initialize Storms
    useEffect(() => {
        const initialStorms: StormCell[] = [
            { id: 1, angle: -10, dist: 40, width: 4, height: 35000, base: 2000, intensity: 0.9, type: 'CB' },
            { id: 2, angle: 15, dist: 60, width: 8, height: 25000, base: 1000, intensity: 0.7, type: 'CB' },
            { id: 3, angle: -30, dist: 20, width: 3, height: 12000, base: 0, intensity: 0.5, type: 'STRATUS' },
            { id: 4, angle: 5, dist: 90, width: 12, height: 40000, base: 500, intensity: 1.0, type: 'CB' },
        ];
        setStorms(initialStorms);
    }, []);

    // Simulation State
    const sweepDirRef = useRef(1); // 1 = Right, -1 = Left
    const lastTimeRef = useRef(Date.now());

    // Animation & Logic Loop
    useEffect(() => {
        let frameId: number;

        const loop = () => {
            const now = Date.now();
            const dt = (now - lastTimeRef.current) / 1000;
            lastTimeRef.current = now;

            // 1. Update Antenna Sweep
            setScanAngle(prev => {
                let next = prev + (sweepDirRef.current * 60 * dt); // 60 deg/sec
                if (next > 45) {
                    next = 45;
                    sweepDirRef.current = -1;
                }
                if (next < -45) {
                    next = -45;
                    sweepDirRef.current = 1;
                }
                return next;
            });

            // 2. Render functions will be called by the effect, 
            // but relying on state updates to trigger effect re-run for drawing is inefficient.
            // Better to just update scan angle state, and let the effect re-run render the canvas?
            // Actually, currently we call drawND() in the loop.
            drawND();
            drawVerticalProfile();

            frameId = requestAnimationFrame(loop);
        };
        frameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameId);
    }, [range, tilt, gain, mode, aircraftAlt, storms, scanAngle]);


    // === RENDERERS ===

    const drawND = () => {
        const cvs = ndCanvasRef.current;
        if (!cvs) return;
        const ctx = cvs.getContext('2d');
        if (!ctx) return;

        const w = cvs.width;
        const h = cvs.height;
        const cx = w / 2;
        const cy = h; // Bottom center
        const scalePxPerNm = h / range; // e.g. 400px / 80nm = 5 px/nm

        // Fade effect (persist previous sweep slightly)
        ctx.fillStyle = 'rgba(0,0,0,0.05)';
        ctx.fillRect(0, 0, w, h);

        // Draw Sweep Line (Current Beam)
        // We only draw physics returns AT the scan line
        // But for visual smoothness we might cheat and draw full storms if we want traditional game-feel,
        // BUT for a simulator, we should only draw along the sweep line like a real radar raster.
        // Let's go hybrid: Clear background fully, redraw static overlay, but draw returns based on beam intersection.

        // Actually, real radars "paint" the returns.
        // Let's clear completely for crisp React rendering, but simulate "painting" by just drawing everything visible.
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, w, h);

        // 1. Grid / Rings
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, h * 0.25, Math.PI, 2 * Math.PI);
        ctx.arc(cx, cy, h * 0.5, Math.PI, 2 * Math.PI);
        ctx.arc(cx, cy, h * 0.75, Math.PI, 2 * Math.PI);
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = '10px monospace';
        ctx.fillText(`${range / 4}`, cx + 5, cy - h * 0.25);
        ctx.fillText(`${range / 2}`, cx + 5, cy - h * 0.5);
        ctx.fillText(`${range * 0.75}`, cx + 5, cy - h * 0.75);

        // 2. RAYCASTING LOGIC (The Core Simulation)
        // We iterate angle from -45 to +45 in small steps to build the image (simulating memory)
        // Or just iterate objects and check visibility.
        // Iterating objects is faster for JS.

        // Beam Calculation
        const beamTopAngle = tilt + (BEAM_WIDTH / 2);
        const beamBottomAngle = tilt - (BEAM_WIDTH / 2);

        // GROUND RETURN
        // Ground is a plane at GROUND_ELEVATION.
        // Aircraft is at aircraftAlt.
        // Angle to ground at distance D = atan((GroundAlt - AircraftAlt) / D)
        // Check if BeamBottom < AngleToGround < BeamTop

        // Ground Clutter Loop (per NM)
        if (mode !== 'MAP') { // Map mode usually enhances ground, but WX tries to suppress or differentiate.
            // For sim, let's just draw "Ground" as red noise
            const step = 0.5; // NM
            for (let d = 1; d < range; d += step) {
                const distFt = d * 6076;
                const angleToGround = (Math.atan((GROUND_ELEVATION - aircraftAlt) / distFt) * 180 / Math.PI);

                // If the beam hits the ground (Beam Bottom is below the angle to ground, AND Beam Top is above it)
                // Actually if Beam 'includes' the ground angle.
                if (beamBottomAngle <= angleToGround && beamTopAngle >= angleToGround) {
                    // Hit!
                    const arcWidth = 90 * (Math.PI / 180); // Full sector
                    const r = d * scalePxPerNm;

                    ctx.beginPath();
                    ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI); // Draw full arc for ground? Or just sector?
                    ctx.strokeStyle = `rgba(255, 0, 0, ${0.1 * (gain / 100)})`; // Faint red ring
                    ctx.stroke();
                }
            }
        }

        // STORM RETURNS
        storms.forEach(storm => {
            // 1. Is storm within Range?
            if (storm.dist > range) return;

            // 2. Vertical Intercept? 
            // Calculate Beam Height at Storm Distance.
            // Height = Dist(ft) * tan(tilt) roughly.
            const distFt = storm.dist * 6076;
            // Beam center height relative to aircraft
            const beamCenterHeightRel = distFt * Math.tan(tilt * Math.PI / 180);
            const beamTopRel = distFt * Math.tan(beamTopAngle * Math.PI / 180);
            const beamBottomRel = distFt * Math.tan(beamBottomAngle * Math.PI / 180);

            const beamAbsTop = aircraftAlt + beamTopRel;
            const beamAbsBottom = aircraftAlt + beamBottomRel;

            // Does beam overlap storm vertical extent?
            // Storm Z: [storm.base, storm.height]
            const overlapsVertically = (beamAbsBottom < storm.height) && (beamAbsTop > storm.base);

            if (overlapsVertically) {
                // Draw Storm
                // Convert Polar to Cartesian for Canvas
                const angleRad = (storm.angle - 90) * (Math.PI / 180);
                const x = cx + Math.cos(angleRad) * (storm.dist * scalePxPerNm);
                const y = cy + Math.sin(angleRad) * (storm.dist * scalePxPerNm);
                const radius = storm.width * scalePxPerNm;

                // Color based on Intensity & Gain
                const visualIntensity = storm.intensity * (gain / 50);

                const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
                if (visualIntensity > 0.8) {
                    grad.addColorStop(0, '#ff00ff'); // Turbulence
                    grad.addColorStop(0.5, '#ef4444'); // Red
                    grad.addColorStop(1, '#22c55e');   // Green
                } else if (visualIntensity > 0.5) {
                    grad.addColorStop(0, '#ef4444');
                    grad.addColorStop(1, '#22c55e');
                } else {
                    grad.addColorStop(0, '#22c55e');
                    grad.addColorStop(1, 'rgba(34, 197, 94, 0)');
                }

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // 3. Draw Sweep Line
        const scanRad = (scanAngle - 90) * (Math.PI / 180);
        ctx.strokeStyle = '#0ea5e9';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(scanRad) * h, cy + Math.sin(scanRad) * h);
        ctx.stroke();
    };

    const drawVerticalProfile = () => {
        const cvs = vertCanvasRef.current;
        if (!cvs) return;
        const ctx = cvs.getContext('2d');
        if (!ctx) return;
        const w = cvs.width;
        const h = cvs.height;

        // Coordinate System:
        // X: Distance (0 to Range)
        // Y: Altitude (0 to 60,000 ft)
        const maxAlt = 50000;
        const scaleX = w / range; // px per NM
        const scaleY = h / maxAlt; // px per ft

        // BG
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, w, h);

        // Grid (Altitudes)
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        for (let a = 10000; a < maxAlt; a += 10000) {
            const y = h - (a * scaleY);
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
            ctx.fillStyle = '#475569'; ctx.font = '10px monospace'; ctx.fillText(`${a / 1000}k`, 5, y - 2);
        }

        // Draw Ground
        const groundY = h - (GROUND_ELEVATION * scaleY);
        ctx.fillStyle = '#3f6212'; // Dark Green
        ctx.fillRect(0, groundY, w, h - groundY); // Simple flat earth for now

        // Draw Storms (Side View)
        storms.forEach(storm => {
            // Only draw if within viewing range
            if (storm.dist > range) return;

            // X position
            const x = storm.dist * scaleX;
            const widthPx = storm.width * scaleX * 2; // Approximate width in side view

            // Y position
            const topY = h - (storm.height * scaleY);
            const baseY = h - (storm.base * scaleY);
            const heightPx = baseY - topY;

            // Draw Rect (Simple profile)
            ctx.fillStyle = storm.intensity > 0.8 ? '#ef4444' : '#22c55e';
            ctx.fillRect(x - widthPx / 2, topY, widthPx, heightPx);
        });

        // Draw Aircraft Position
        const acY = h - (aircraftAlt * scaleY);
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(0, acY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw Radar CONE
        // Beam spreads with distance.
        // Upper Edge
        const beamTopAngle = tilt + (BEAM_WIDTH / 2);
        const beamBottomAngle = tilt - (BEAM_WIDTH / 2);

        // Calculate Y at max range
        const distFt = range * 6076;
        const topYOffset = distFt * Math.tan(beamTopAngle * Math.PI / 180);
        const bottomYOffset = distFt * Math.tan(beamBottomAngle * Math.PI / 180);

        const yTopAtRange = h - ((aircraftAlt + topYOffset) * scaleY);
        const yBottomAtRange = h - ((aircraftAlt + bottomYOffset) * scaleY);

        ctx.fillStyle = 'rgba(14, 165, 233, 0.2)'; // Sky blue, transparent
        ctx.beginPath();
        ctx.moveTo(0, acY);
        ctx.lineTo(w, yTopAtRange);
        ctx.lineTo(w, yBottomAtRange);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(14, 165, 233, 0.5)';
        ctx.beginPath();
        ctx.moveTo(0, acY);
        ctx.lineTo(w, h - ((aircraftAlt + (distFt * Math.tan(tilt * Math.PI / 180))) * scaleY)); // Center line
        ctx.stroke();

    };


    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6 pb-20">
            <div className="flex items-center space-x-4 mb-6">
                <button
                    onClick={() => onNavigate?.(View.RAD_NAV_HOME)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                        <Activity className="text-sky-400" size={32} />
                        Weather Radar Simulator
                    </h1>
                    <p className="text-slate-400 mt-1">Advanced Tilt Management & Interpretation</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">

                {/* LEFT: PRIMARY DISPLAY (ND) */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="bg-black rounded-3xl border-8 border-slate-800 shadow-2xl overflow-hidden relative aspect-square max-w-2xl mx-auto">
                        <canvas ref={ndCanvasRef} width={600} height={600} className="w-full h-full" />

                        {/* Corner Overlays */}
                        <div className="absolute top-4 left-4 font-mono font-bold text-sky-400 text-lg">
                            {mode}
                            <span className="block text-white text-2xl">RNG {range}</span>
                        </div>
                        <div className="absolute top-4 right-4 font-mono font-bold text-lg text-right">
                            <span className={`block ${tilt > 0 ? 'text-blue-400' : tilt < 0 ? 'text-amber-400' : 'text-white'}`}>
                                TILT {tilt > 0 ? '+' : ''}{tilt.toFixed(1)}°
                            </span>
                            <span className="block text-emerald-400 text-sm">GAIN {gain}%</span>
                        </div>

                        {/* Aircraft Icon */}
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                            <PlaneIcon className="text-white w-12 h-12" />
                        </div>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex justify-center gap-8">
                        <div className="text-center">
                            <div className="text-xs text-slate-400 uppercase mb-1">Beam Hits Ground?</div>
                            {(tilt - 1.5) < (Math.atan((0 - aircraftAlt) / (range * 6076)) * 180 / Math.PI) ? ( // Rough approx check at max range
                                <span className="text-red-500 font-bold flex items-center gap-1 justify-center"><AlertTriangle size={16} /> YES (CLUTTER)</span>
                            ) : (
                                <span className="text-emerald-500 font-bold">NO (CLEAR)</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: CONTROLS & VERTICAL PROFILE */}
                <div className="lg:col-span-5 space-y-6">

                    {/* Vertical Profile Visualizer */}
                    <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
                        <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Ruler size={16} /> Vertical Profile (Side View)
                            </h3>
                            <span className="text-xs text-slate-400">Not available in real cockpit</span>
                        </div>
                        <div className="h-64 bg-slate-950 relative">
                            <canvas ref={vertCanvasRef} width={500} height={300} className="w-full h-full" />
                        </div>
                        <div className="p-3 text-xs text-slate-500 bg-slate-900/50">
                            Shows relationship between Beam Cone (Blue), Storms (Green/Red), and Ground (Dark Green).
                        </div>
                    </div>

                    {/* Control Panel */}
                    <div className="glass-panel p-6 rounded-xl border border-slate-700 bg-slate-900/80">
                        <h3 className="text-lg font-bold text-sky-400 mb-6 flex items-center gap-2">
                            <Settings size={20} /> Radar Control Panel
                        </h3>

                        <div className="space-y-6">
                            {/* TILT */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-bold text-white">ANT TILT</label>
                                    <span className="font-mono text-sky-400">{tilt.toFixed(1)}°</span>
                                </div>
                                <input
                                    type="range" min="-15" max="15" step="0.1"
                                    value={tilt} onChange={(e) => setTilt(parseFloat(e.target.value))}
                                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                                />
                                <div className="flex justify-between text-xs text-slate-500 mt-1">
                                    <span>-15° (DN)</span>
                                    <span>0°</span>
                                    <span>+15° (UP)</span>
                                </div>
                            </div>

                            {/* RANGE */}
                            <div>
                                <label className="text-sm font-bold text-white mb-2 block">RANGE SCALE</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {[10, 20, 40, 80, 160].map(r => (
                                        <button
                                            key={r}
                                            onClick={() => setRange(r)}
                                            className={`py-2 rounded font-mono text-sm font-bold transition-all ${range === r ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* GAIN */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-bold text-white">GAIN</label>
                                    <span className="font-mono text-emerald-400">{gain}%</span>
                                </div>
                                <input
                                    type="range" min="0" max="100" step="1"
                                    value={gain} onChange={(e) => setGain(parseInt(e.target.value))}
                                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                            </div>

                            {/* ALTITUDE SIM */}
                            <div className="pt-4 border-t border-slate-700">
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-bold text-slate-300">AIRCRAFT ALTITUDE</label>
                                    <span className="font-mono text-white">{(aircraftAlt).toLocaleString()} ft</span>
                                </div>
                                <input
                                    type="range" min="0" max="45000" step="1000"
                                    value={aircraftAlt} onChange={(e) => setAircraftAlt(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

function PlaneIcon(props: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
    );
}

export default WeatherRadar;
