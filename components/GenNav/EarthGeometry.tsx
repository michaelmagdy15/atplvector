import React, { useState, useEffect, useRef } from 'react';
import { View } from '../../types';
import { ArrowLeft, Globe, Compass, Navigation, Calculator, BookOpen, AlertTriangle, CheckCircle2, ChevronRight, RotateCcw } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const EarthGeometry: React.FC<Props> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'VISUALIZER' | 'DEPARTURE' | 'CONVERGENCY' | 'EXAM_PRESETS'>('VISUALIZER');

    // Preset route locations
    const [lat1, setLat1] = useState(51.5); // London EGLL (51.5°N)
    const [lon1, setLon1] = useState(-0.5); // 0.5°W
    const [lat2, setLat2] = useState(40.7); // New York KJFK (40.7°N)
    const [lon2, setLon2] = useState(-73.8); // 73.8°W

    // Departure Calculator State
    const [depLat, setDepLat] = useState(60.0);
    const [deltaLonDeg, setDeltaLonDeg] = useState(5);
    const [deltaLonMin, setDeltaLonMin] = useState(0);

    // Convergency Calculator State
    const [convLatA, setConvLatA] = useState(55.0);
    const [convLatB, setConvLatB] = useState(65.0);
    const [convLonA, setConvLonA] = useState(-20.0);
    const [convLonB, setConvLonB] = useState(10.0);
    const [hemisphere, setHemisphere] = useState<'N' | 'S'>('N');

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const toRad = (d: number) => (d * Math.PI) / 180;
    const toDeg = (r: number) => (r * 180) / Math.PI;

    // Earth radius in NM (standard ATPL mean radius)
    const R_NM = 3440.065;

    // Great Circle Distance using Great-circle spherical law of cosines
    const p1 = toRad(lat1);
    const p2 = toRad(lat2);
    const dLon = toRad(lon2 - lon1);
    const cosDist = Math.sin(p1) * Math.sin(p2) + Math.cos(p1) * Math.cos(p2) * Math.cos(dLon);
    const clampedCosDist = Math.max(-1, Math.min(1, cosDist));
    const distGC = Math.acos(clampedCosDist) * R_NM;

    // Initial Great Circle Bearing from A to B
    const yGC = Math.sin(dLon) * Math.cos(p2);
    const xGC = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dLon);
    let initBearingGC = (toDeg(Math.atan2(yGC, xGC)) + 360) % 360;

    // Final Great Circle Bearing arriving at B (reciprocal of B to A)
    const yFinal = Math.sin(-dLon) * Math.cos(p1);
    const xFinal = Math.cos(p2) * Math.sin(p1) - Math.sin(p2) * Math.cos(p1) * Math.cos(-dLon);
    let finalBearingGC = (toDeg(Math.atan2(yFinal, xFinal)) + 180) % 360;

    // Rhumb Line Track & Distance
    const dPhi = Math.log(Math.tan(Math.PI / 4 + p2 / 2) / Math.tan(Math.PI / 4 + p1 / 2));
    const q = Math.abs(dPhi) > 1e-10 ? (p2 - p1) / dPhi : Math.cos(p1);
    const rhumbBearingRad = Math.atan2(dLon, dPhi);
    const rhumbBearing = (toDeg(rhumbBearingRad) + 360) % 360;
    const distRhumb = Math.sqrt(Math.pow((lat2 - lat1) * 60, 2) + Math.pow(q * (lon2 - lon1) * 60, 2));

    // Departure Formula Calculation
    // Departure (NM) = Delta Long (minutes) * cos(Latitude)
    const totalDeltaLonMinutes = deltaLonDeg * 60 + deltaLonMin;
    const departureNM = totalDeltaLonMinutes * Math.cos(toRad(depLat));
    const meridianDistanceNM = (deltaLonDeg + deltaLonMin / 60) * 60; // 60 NM per degree along meridian

    // Earth Convergency & Conversion Angle Calculations
    const deltaLonConv = Math.abs(convLonB - convLonA);
    const meanLatConv = (convLatA + convLatB) / 2;
    const earthConvergencyDeg = deltaLonConv * Math.sin(toRad(meanLatConv));
    const conversionAngleDeg = 0.5 * earthConvergencyDeg;

    // Route Canvas Rendering
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        // Background
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, w, h);

        // Graticule (Meridians & Parallels)
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;

        // Longitude lines
        for (let lon = -180; lon <= 180; lon += 30) {
            const x = ((lon + 180) / 360) * w;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();

            ctx.fillStyle = '#475569';
            ctx.font = '9px monospace';
            ctx.fillText(`${lon}°`, x + 2, h - 6);
        }

        // Latitude lines
        for (let lat = -80; lat <= 80; lat += 20) {
            const y = h - ((lat + 90) / 180) * h;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();

            ctx.fillStyle = '#475569';
            ctx.font = '9px monospace';
            ctx.fillText(`${lat}°`, 4, y - 3);
        }

        // Equator highlight
        const eqY = h / 2;
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, eqY);
        ctx.lineTo(w, eqY);
        ctx.stroke();
        ctx.fillStyle = '#64748b';
        ctx.fillText('EQUATOR (GC & RL)', w / 2 - 45, eqY - 4);

        const mapX = (lon: number) => ((lon + 180) / 360) * w;
        const mapY = (lat: number) => h - ((lat + 90) / 180) * h;

        const x1 = mapX(lon1);
        const y1 = mapY(lat1);
        const x2 = mapX(lon2);
        const y2 = mapY(lat2);

        // 1. Draw Rhumb Line (Straight line in cylindrical projection)
        ctx.beginPath();
        ctx.strokeStyle = '#f59e0b'; // Amber
        ctx.setLineDash([5, 4]);
        ctx.lineWidth = 2;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);

        // 2. Draw Great Circle Path (Spherical intermediate waypoints)
        ctx.beginPath();
        ctx.strokeStyle = '#38bdf8'; // Sky blue
        ctx.lineWidth = 2.5;
        ctx.moveTo(x1, y1);

        const steps = 40;
        const rad1 = toRad(lat1);
        const rad2 = toRad(lat2);
        const radLon1 = toRad(lon1);
        const radLon2 = toRad(lon2);
        const angDist = distGC / R_NM;

        for (let i = 1; i <= steps; i++) {
            const f = i / steps;
            const A = Math.sin((1 - f) * angDist) / Math.sin(angDist);
            const B = Math.sin(f * angDist) / Math.sin(angDist);
            const xSph = A * Math.cos(rad1) * Math.cos(radLon1) + B * Math.cos(rad2) * Math.cos(radLon2);
            const ySph = A * Math.cos(rad1) * Math.sin(radLon1) + B * Math.cos(rad2) * Math.sin(radLon2);
            const zSph = A * Math.sin(rad1) + B * Math.sin(rad2);
            const latInterp = toDeg(Math.atan2(zSph, Math.sqrt(xSph * xSph + ySph * ySph)));
            const lonInterp = toDeg(Math.atan2(ySph, xSph));

            ctx.lineTo(mapX(lonInterp), mapY(latInterp));
        }
        ctx.stroke();

        // Waypoint Markers
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(x1, y1, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('A (DEP)', x1 + 8, y1 - 6);

        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(x2, y2, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillText('B (DEST)', x2 + 8, y2 - 6);
    }, [lat1, lon1, lat2, lon2, distGC]);

    const setPreset = (name: string) => {
        if (name === 'LON_NYC') {
            setLat1(51.5);
            setLon1(-0.5);
            setLat2(40.7);
            setLon2(-74.0);
        } else if (name === 'PAR_TYO') {
            setLat1(48.9);
            setLon1(2.4);
            setLat2(35.7);
            setLon2(139.7);
        } else if (name === 'EQUATOR') {
            setLat1(0.0);
            setLon1(-40.0);
            setLat2(0.0);
            setLon2(40.0);
        } else if (name === 'SYD_SCL') {
            // Southern hemisphere
            setLat1(-33.9);
            setLon1(151.2);
            setLat2(-33.4);
            setLon2(-70.7);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500 text-slate-100">
            {/* Navigation Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => onNavigate?.(View.GEN_NAV_HOME)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to General Navigation</span>
                </button>
                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-mono font-bold">
                    <span>EASA 061.03 GEODESY</span>
                </div>
            </div>

            {/* Hero Banner */}
            <div className="glass-panel p-6 md:p-10 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 relative overflow-hidden">
                <div className="relative z-10 max-w-3xl">
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
                        <Globe className="text-sky-400" size={38} />
                        Earth Geometry & Track Convergency
                    </h1>
                    <p className="text-slate-300 text-base md:text-lg mt-3 leading-relaxed">
                        Master the spherical mechanics of planet Earth: Great Circles vs Rhumb Lines, the Departure Formula,
                        Earth Convergency, and Conversion Angle across both hemispheres.
                    </p>
                </div>
                <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                    <Compass size={280} />
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800">
                <button
                    onClick={() => setActiveTab('VISUALIZER')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                        activeTab === 'VISUALIZER'
                            ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                >
                    <Globe size={16} /> Great Circle vs Rhumb Line
                </button>
                <button
                    onClick={() => setActiveTab('DEPARTURE')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                        activeTab === 'DEPARTURE'
                            ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                >
                    <Calculator size={16} /> Departure Formula (ΔLong × cos Lat)
                </button>
                <button
                    onClick={() => setActiveTab('CONVERGENCY')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                        activeTab === 'CONVERGENCY'
                            ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                >
                    <Compass size={16} /> Earth Convergency & Conversion Angle
                </button>
                <button
                    onClick={() => setActiveTab('EXAM_PRESETS')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                        activeTab === 'EXAM_PRESETS'
                            ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                >
                    <BookOpen size={16} /> ATPL Core Principles & Traps
                </button>
            </div>

            {/* TAB 1: INTERACTIVE GREAT CIRCLE VS RHUMB LINE */}
            {activeTab === 'VISUALIZER' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Controls & Comparison (5/12) */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-5">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-white text-lg">Waypoint Coordinates</h3>
                                <span className="text-xs text-slate-500 font-mono">DEG DECIMAL</span>
                            </div>

                            {/* Preset Buttons */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <button
                                    onClick={() => setPreset('LON_NYC')}
                                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-left border border-slate-700/50"
                                >
                                    🇬🇧 London → 🇺🇸 NYC
                                </button>
                                <button
                                    onClick={() => setPreset('PAR_TYO')}
                                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-left border border-slate-700/50"
                                >
                                    🇫🇷 Paris → 🇯🇵 Tokyo (Polar)
                                </button>
                                <button
                                    onClick={() => setPreset('EQUATOR')}
                                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-left border border-slate-700/50"
                                >
                                    🌐 Equator Route (40°W → 40°E)
                                </button>
                                <button
                                    onClick={() => setPreset('SYD_SCL')}
                                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-left border border-slate-700/50"
                                >
                                    🇦🇺 Sydney → 🇨🇱 Santiago
                                </button>
                            </div>

                            {/* Coordinate Inputs */}
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-3 p-3 bg-slate-950/60 rounded-xl border border-sky-500/20">
                                    <span className="text-xs font-bold text-sky-400 block">WAYPOINT A (DEP)</span>
                                    <div>
                                        <label className="text-[10px] text-slate-400 block">LATITUDE (°N/S)</label>
                                        <input
                                            type="number"
                                            value={lat1}
                                            onChange={e => setLat1(Number(e.target.value))}
                                            step="0.5"
                                            className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm font-mono text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-slate-400 block">LONGITUDE (°E/W)</label>
                                        <input
                                            type="number"
                                            value={lon1}
                                            onChange={e => setLon1(Number(e.target.value))}
                                            step="0.5"
                                            className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm font-mono text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3 p-3 bg-slate-950/60 rounded-xl border border-rose-500/20">
                                    <span className="text-xs font-bold text-rose-400 block">WAYPOINT B (DEST)</span>
                                    <div>
                                        <label className="text-[10px] text-slate-400 block">LATITUDE (°N/S)</label>
                                        <input
                                            type="number"
                                            value={lat2}
                                            onChange={e => setLat2(Number(e.target.value))}
                                            step="0.5"
                                            className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm font-mono text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-slate-400 block">LONGITUDE (°E/W)</label>
                                        <input
                                            type="number"
                                            value={lon2}
                                            onChange={e => setLon2(Number(e.target.value))}
                                            step="0.5"
                                            className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm font-mono text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Distance & Bearing Comparison Cards */}
                            <div className="space-y-3 pt-2">
                                <div className="p-4 bg-sky-950/30 border border-sky-500/30 rounded-xl space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-sky-400 uppercase tracking-wide">Great Circle (Orthodrome)</span>
                                        <span className="text-xs px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">SHORTEST PATH</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-slate-400 text-xs">Total Distance:</span>
                                        <span className="text-2xl font-black text-white font-mono">{Math.round(distGC)} NM</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 border-t border-sky-500/20 pt-2 font-mono">
                                        <div>Initial Track: <strong className="text-sky-300">{initBearingGC.toFixed(1)}°T</strong></div>
                                        <div>Final Track: <strong className="text-sky-300">{finalBearingGC.toFixed(1)}°T</strong></div>
                                    </div>
                                    <p className="text-[11px] text-sky-200/70 italic">
                                        Track continuously changes as it cuts each meridian at a different angle!
                                    </p>
                                </div>

                                <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">Rhumb Line (Loxodrome)</span>
                                        <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">CONSTANT BEARING</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-slate-400 text-xs">Total Distance:</span>
                                        <span className="text-2xl font-black text-white font-mono">{Math.round(distRhumb)} NM</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-300 border-t border-amber-500/20 pt-2 font-mono">
                                        <span>Constant Compass Track:</span>
                                        <strong className="text-amber-300">{rhumbBearing.toFixed(1)}°T</strong>
                                    </div>
                                    <div className="flex justify-between text-[11px] text-amber-200/80">
                                        <span>Extra Distance vs GC:</span>
                                        <span className="font-bold text-rose-400">+{Math.max(0, Math.round(distRhumb - distGC))} NM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Canvas & Educational Walkthrough (7/12) */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
                            <canvas
                                ref={canvasRef}
                                width={560}
                                height={320}
                                className="w-full bg-slate-950 rounded-2xl border border-slate-800 shadow-inner"
                            />
                            <div className="flex flex-wrap justify-between items-center w-full mt-4 text-xs font-bold gap-3 px-2">
                                <span className="text-sky-400 flex items-center gap-1.5">
                                    <span className="w-4 h-1 bg-sky-400 rounded-full inline-block"></span>
                                    Great Circle (Bows toward nearer Pole)
                                </span>
                                <span className="text-amber-400 flex items-center gap-1.5">
                                    <span className="w-4 h-0.5 border-t border-dashed border-amber-400 inline-block"></span>
                                    Rhumb Line (Cuts meridians at constant angle)
                                </span>
                            </div>
                        </div>

                        {/* Mental Model Explainer Card */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
                                <h4 className="text-sm font-bold text-sky-400 flex items-center gap-2">
                                    <Globe size={18} /> "Great Circles Bow to the Pole"
                                </h4>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    On cylindrical Mercator charts, the shortest distance between two points bows <strong>convex to the nearer pole</strong>.
                                    In the Northern Hemisphere, flying East from London to Tokyo initially heads North-East (smaller track), reaching highest latitude at the vertex, then turns South-East.
                                </p>
                            </div>

                            <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
                                <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                                    <Compass size={18} /> The Three Special Case Rules
                                </h4>
                                <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                                    <li><strong>The Equator:</strong> The only parallel of latitude that is BOTH a Great Circle and a Rhumb Line.</li>
                                    <li><strong>All Meridians of Longitude:</strong> Cut all parallels at 90°; they are BOTH Great Circles and Rhumb Lines.</li>
                                    <li><strong>All Parallels of Latitude:</strong> Constant bearing (090°/270°), hence Rhumb Lines, but NOT Great Circles (except Equator).</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: DEPARTURE FORMULA ENGINE */}
            {activeTab === 'DEPARTURE' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-6 bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
                        <div className="border-b border-slate-800 pb-4">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Calculator className="text-sky-400" />
                                Departure Formula Calculator
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Departure is the distance in Nautical Miles along a parallel of latitude between two meridians.
                            </p>
                        </div>

                        {/* Formula Display */}
                        <div className="p-5 bg-slate-950 rounded-2xl border border-sky-500/20 text-center space-y-2">
                            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block">CORE ATPL FORMULA</span>
                            <div className="text-2xl md:text-3xl font-black text-sky-400 font-mono">
                                Departure (NM) = ΔLong (min) × cos(Latitude)
                            </div>
                            <p className="text-xs text-slate-400">
                                Where 1° of Change of Longitude = 60 minutes of arc.
                            </p>
                        </div>

                        {/* Interactive Sliders */}
                        <div className="space-y-5">
                            <div>
                                <div className="flex justify-between text-xs text-slate-300 font-mono mb-2">
                                    <span>PARALLEL OF LATITUDE (φ):</span>
                                    <strong className="text-sky-400 font-bold">{depLat.toFixed(1)}°</strong>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="89.9"
                                    step="0.5"
                                    value={depLat}
                                    onChange={e => setDepLat(Number(e.target.value))}
                                    className="w-full accent-sky-500"
                                />
                                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                    <span>0° (Equator - cos 0 = 1.0)</span>
                                    <span>45° (Mid-lat - cos 45 = 0.707)</span>
                                    <span>90° (Poles - cos 90 = 0.0)</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1 font-mono">ΔLONG DEGREES (°)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="180"
                                        value={deltaLonDeg}
                                        onChange={e => setDeltaLonDeg(Math.max(0, Number(e.target.value)))}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1 font-mono">ΔLONG MINUTES (')</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="59"
                                        value={deltaLonMin}
                                        onChange={e => setDeltaLonMin(Math.max(0, Math.min(59, Number(e.target.value))))}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Live Calculation Output */}
                        <div className="p-6 bg-slate-950 rounded-2xl border border-white/5 space-y-4">
                            <div className="flex justify-between items-center text-xs text-slate-400">
                                <span>Total Change in Longitude (Minutes):</span>
                                <span className="font-mono text-white font-bold">{totalDeltaLonMinutes}'</span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-slate-400">
                                <span>cos({depLat}°):</span>
                                <span className="font-mono text-white font-bold">{Math.cos(toRad(depLat)).toFixed(4)}</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-slate-800 pt-3">
                                <span className="text-sm font-bold text-sky-400">Calculated Departure:</span>
                                <span className="text-3xl font-black text-white font-mono">
                                    {departureNM.toFixed(1)} <span className="text-sm text-slate-400 font-normal">NM</span>
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-800/50 pt-2">
                                <span>Equivalent Meridian Distance (if along Longitude):</span>
                                <span className="font-mono text-amber-300 font-bold">{meridianDistanceNM.toFixed(1)} NM</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Key Exam Rules & Worked Problems (6/12) */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-4">
                            <h4 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <AlertTriangle className="text-amber-400" size={18} />
                                Departure Anti-Patterns & Exam Traps
                            </h4>

                            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                                <div className="p-4 bg-rose-950/20 border border-rose-500/20 rounded-xl">
                                    <strong className="text-rose-400 block mb-1">TRAP 1: Using Departure along a Meridian of Longitude</strong>
                                    <p>
                                        Never multiply by $\cos(\text{Lat})$ when calculating distances between latitudes along a meridian!
                                        Distance along ANY meridian is always <strong>60 NM per degree of latitude</strong> everywhere on Earth (from pole to equator).
                                    </p>
                                </div>

                                <div className="p-4 bg-amber-950/20 border border-amber-500/20 rounded-xl">
                                    <strong className="text-amber-400 block mb-1">TRAP 2: Forgetting That 60° Latitude Halves Longitude Distances</strong>
                                    <p>
                                        At 60° North or South, $\cos(60^\circ) = 0.500$.
                                        Therefore, <strong>1° of longitude at 60° latitude is exactly 30 NM</strong> (half of the 60 NM at the equator).
                                        This 60° benchmark is tested in over 20% of EASA General Navigation exam questions!
                                    </p>
                                </div>

                                <div className="p-4 bg-sky-950/20 border border-sky-500/20 rounded-xl">
                                    <strong className="text-sky-400 block mb-1">Worked EASA Exam Question</strong>
                                    <p className="font-mono text-[11px] text-slate-300">
                                        Q: An aircraft flies due East along parallel 50°N from 002°00'W to 008°30'E. What is the ground distance flown?<br />
                                        • Step 1: ΔLong = 2°W + 8.5°E = 10°30' = 630 minutes of arc.<br />
                                        • Step 2: Departure = 630' × cos(50°) = 630 × 0.6428 = <strong>405 NM</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: EARTH CONVERGENCY & CONVERSION ANGLE */}
            {activeTab === 'CONVERGENCY' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Convergency Calculator (6/12) */}
                    <div className="lg:col-span-6 bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
                        <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Compass className="text-sky-400" />
                                    Convergency & Conversion Angle
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Calculates how Great Circles bend across meridians relative to Rhumb lines.
                                </p>
                            </div>
                            <div className="flex bg-slate-950 p-1 rounded-xl">
                                <button
                                    onClick={() => setHemisphere('N')}
                                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                                        hemisphere === 'N' ? 'bg-sky-500 text-slate-950' : 'text-slate-400'
                                    }`}
                                >
                                    Northern (N)
                                </button>
                                <button
                                    onClick={() => setHemisphere('S')}
                                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                                        hemisphere === 'S' ? 'bg-sky-500 text-slate-950' : 'text-slate-400'
                                    }`}
                                >
                                    Southern (S)
                                </button>
                            </div>
                        </div>

                        {/* Formulas */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-950 rounded-2xl border border-sky-500/20 text-center">
                                <span className="text-[10px] font-mono text-slate-400 uppercase">EARTH CONVERGENCY</span>
                                <div className="text-lg font-bold text-sky-400 font-mono mt-1">
                                    ΔLong × sin(Mean Lat)
                                </div>
                            </div>
                            <div className="p-4 bg-slate-950 rounded-2xl border border-amber-500/20 text-center">
                                <span className="text-[10px] font-mono text-slate-400 uppercase">CONVERSION ANGLE</span>
                                <div className="text-lg font-bold text-amber-400 font-mono mt-1">
                                    ½ × Earth Convergency
                                </div>
                            </div>
                        </div>

                        {/* Interactive Inputs */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1 font-mono">LATITUDE POINT A (°)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="85"
                                        value={convLatA}
                                        onChange={e => setConvLatA(Number(e.target.value))}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1 font-mono">LATITUDE POINT B (°)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="85"
                                        value={convLatB}
                                        onChange={e => setConvLatB(Number(e.target.value))}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1 font-mono">LONGITUDE A (°)</label>
                                    <input
                                        type="number"
                                        min="-180"
                                        max="180"
                                        value={convLonA}
                                        onChange={e => setConvLonA(Number(e.target.value))}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1 font-mono">LONGITUDE B (°)</label>
                                    <input
                                        type="number"
                                        min="-180"
                                        max="180"
                                        value={convLonB}
                                        onChange={e => setConvLonB(Number(e.target.value))}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Calculated Results */}
                        <div className="p-6 bg-slate-950 rounded-2xl border border-white/5 space-y-3 font-mono text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Mean Latitude (φ_mean):</span>
                                <span className="text-white font-bold">{meanLatConv.toFixed(1)}° {hemisphere}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Change of Longitude (Δλ):</span>
                                <span className="text-white font-bold">{deltaLonConv.toFixed(1)}°</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-800 pt-2 text-sky-400 font-bold text-sm">
                                <span>Earth Convergency:</span>
                                <span>{earthConvergencyDeg.toFixed(2)}°</span>
                            </div>
                            <div className="flex justify-between text-amber-400 font-bold text-sm">
                                <span>Conversion Angle (CA):</span>
                                <span>{conversionAngleDeg.toFixed(2)}°</span>
                            </div>
                        </div>
                    </div>

                    {/* Conversion Relationship & Mental Model (6/12) */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-5">
                            <h4 className="text-base font-bold text-white uppercase tracking-wider">
                                Track Conversion Rules (GC ⇄ Rhumb Line)
                            </h4>

                            <div className="p-4 bg-slate-950 rounded-2xl border border-sky-500/20 space-y-3 text-xs text-slate-300">
                                <div className="font-bold text-sky-400">Northern Hemisphere:</div>
                                <ul className="space-y-1 list-disc pl-4 font-mono">
                                    <li>Flying East: Initial GC Track = Rhumb Line Track - Conversion Angle</li>
                                    <li>Flying East: Final GC Track = Rhumb Line Track + Conversion Angle</li>
                                    <li>Flying West: Initial GC Track = Rhumb Line Track + Conversion Angle</li>
                                    <li>Flying West: Final GC Track = Rhumb Line Track - Conversion Angle</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-slate-950 rounded-2xl border border-amber-500/20 space-y-3 text-xs text-slate-300">
                                <div className="font-bold text-amber-400">Southern Hemisphere:</div>
                                <p className="text-[11px] text-slate-400">
                                    In the Southern Hemisphere, Great Circles bow toward the South Pole. Signs are completely inverted!
                                </p>
                                <ul className="space-y-1 list-disc pl-4 font-mono">
                                    <li>Flying East: Initial GC Track = Rhumb Line Track + Conversion Angle</li>
                                    <li>Flying West: Initial GC Track = Rhumb Line Track - Conversion Angle</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-2xl text-xs space-y-2">
                                <span className="font-bold text-indigo-300 block">Worked Example from Croucher ATPL:</span>
                                <p className="text-slate-300 leading-relaxed font-mono">
                                    A Rhumb line track from A (52°N 010°W) to B (52°N 020°E) is 090°T.<br />
                                    • ΔLong = 10°W + 20°E = 30°<br />
                                    • Earth Convergency = 30° × sin(52°) = 30 × 0.788 = 23.64°<br />
                                    • Conversion Angle = 23.64° / 2 = 11.82° ≈ 12°<br />
                                    • Initial GC Track at A = 090° - 12° = <strong>078°T</strong><br />
                                    • Final GC Track at B = 090° + 12° = <strong>102°T</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 4: ATPL CORE PRINCIPLES & CHEAT SHEET */}
            {activeTab === 'EXAM_PRESETS' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-3">
                        <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">1</div>
                        <h4 className="font-bold text-white text-base">The Nautical Mile Definition</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            1 International Nautical Mile is defined as <strong>1,852 meters</strong> (6,076.1 feet).
                            It corresponds to the length of <strong>1 minute of arc along a meridian of latitude</strong>.
                            Because Earth is an oblate spheroid, 1 minute of latitude is actually longer at the poles (1,861 m) than at the equator (1,843 m).
                        </p>
                    </div>

                    <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">2</div>
                        <h4 className="font-bold text-white text-base">Earth Rotation Rates</h4>
                        <p className="text-xs text-slate-300 leading-relaxed font-mono">
                            • 360° = 24 hours<br />
                            • 15° = 1 hour (60 minutes)<br />
                            • 1° = 4 minutes<br />
                            • 1' (minute of arc) = 4 seconds<br />
                            This exact rate forms the foundation for Local Mean Time (LMT) and UTC calculations in Class 061.05.
                        </p>
                    </div>

                    <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">3</div>
                        <h4 className="font-bold text-white text-base">The Vertex of a Great Circle</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            The Vertex is the point of highest latitude reached on a Great Circle track.
                            At the Vertex:
                            • The Great Circle track is exactly <strong>090°T or 270°T</strong>.
                            • The track is tangential to a parallel of latitude.
                            • The true heading matches the Rhumb line heading for a fraction of a second.
                        </p>
                    </div>

                    <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">4</div>
                        <h4 className="font-bold text-white text-base">Earth Convergency at Poles vs Equator</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            • At the Equator: $\sin(0^\circ) = 0 \rightarrow$ Convergency is <strong>0°</strong>. Meridians are parallel.
                            • At the Poles: $\sin(90^\circ) = 1 \rightarrow$ Convergency = <strong>ΔLong</strong>.
                            • At 30° Lat: $\sin(30^\circ) = 0.5 \rightarrow$ Convergency is half of ΔLong.
                        </p>
                    </div>

                    <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">5</div>
                        <h4 className="font-bold text-white text-base">Conversion Angle Mnemonic</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Conversion Angle is always <strong>HALF</strong> of Earth Convergency.
                            $$\text{CA} = \frac{1}{2} \text{ Convergency}$$
                            Never confuse the two in numerical exam questions! When an exam question provides Earth Convergency, divide by 2 before adjusting Rhumb Line track.
                        </p>
                    </div>

                    <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">6</div>
                        <h4 className="font-bold text-white text-base">Great Circle vs Rhumb Line Distance</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            A Great Circle distance is ALWAYS shorter than or equal to a Rhumb Line distance between two points ($D_{GC} \le D_{RL}$).
                            They are only equal when flying along a meridian or along the equator.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EarthGeometry;
