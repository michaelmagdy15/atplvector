import React, { useState, useEffect, useRef } from 'react';
import { View } from '../../types';
import { ArrowLeft, Navigation } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const WindTriangle: React.FC<Props> = ({ onNavigate }) => {
    // Inputs
    const [hdg, setHdg] = useState(90); // True Heading
    const [tas, setTas] = useState(120); // True Airspeed
    const [windDir, setWindDir] = useState(360); // Wind Coming FROM
    const [windSpd, setWindSpd] = useState(20); // Wind Speed

    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Theory:
    // Air Vector (Heading & TAS) + Wind Vector (Downwind & Speed) = Ground Vector (Track & GS)
    // Triangle of Velocities.

    // Calculations
    const toRad = (d: number) => d * Math.PI / 180;
    const toDeg = (r: number) => r * 180 / Math.PI;

    // Vectors components (North = -Y, East = +X)
    // Air Vector
    // Hdg 0 = Up (0, -TAS), Hdg 90 = Right (TAS, 0)
    // Math angle (0 is Right, CCW): theta = 90 - Hdg
    const airX = tas * Math.sin(toRad(hdg));
    const airY = -tas * Math.cos(toRad(hdg));

    // Wind Vector
    // Wind is FROM. We need vector TO.
    // So Wind Vector direction = WindDir + 180.
    const windVecDir = windDir + 180;
    const windX = windSpd * Math.sin(toRad(windVecDir));
    const windY = -windSpd * Math.cos(toRad(windVecDir));

    // Ground Vector = Air + Wind
    const groundX = airX + windX;
    const groundY = airY + windY;

    // Ground Speed
    const gs = Math.sqrt(groundX * groundX + groundY * groundY);

    // Track (Course)
    // groundX = gs * sin(trk), groundY = -gs * cos(trk)
    // atan2(y, x) -> atan2(-cos, sin) ?
    // Simpler: atan2(x, -y) gives angle from North CW ?
    // let's test: x=0, y=-10 (North). atan2(0, 10) = 0. Correct.
    // x=10, y=0 (East). atan2(10, 0) = PI/2. Correct.
    let trk = toDeg(Math.atan2(groundX, -groundY));
    if (trk < 0) trk += 360;

    // Drift
    // Drift = Track - Heading
    let drift = trk - hdg;
    // Normalize to -180 to +180
    if (drift > 180) drift -= 360;
    if (drift < -180) drift += 360;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;

        ctx.clearRect(0, 0, w, h);

        // Scale factors to fit in canvas
        // Max vector ~ 1.5 * TAS max? Say max TAS 200 => 300px?
        const scale = 1.0;

        // Draw Compass Rose Background
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(cx, cy, 120, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#475569';
        ctx.fillText("N", cx - 5, cy - 125);
        ctx.fillText("E", cx + 125, cy + 5);
        ctx.fillText("S", cx - 5, cy + 135);
        ctx.fillText("W", cx - 135, cy + 5);

        // Center Point (Origin)
        ctx.fillStyle = 'white';
        ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill();

        // Draw Air Vector (Blue) from Center
        const ax = cx + airX * scale;
        const ay = cy + airY * scale;

        ctx.beginPath();
        ctx.strokeStyle = '#38bdf8'; // Sky 400
        ctx.lineWidth = 3;
        ctx.moveTo(cx, cy);
        ctx.lineTo(ax, ay);
        ctx.stroke();

        // Draw Wind Vector (Red) FROM TIP of Air Vector
        const gx = cx + groundX * scale;
        const gy = cy + groundY * scale;

        ctx.beginPath();
        ctx.strokeStyle = '#f87171'; // Red 400
        ctx.lineWidth = 2;
        ctx.moveTo(ax, ay);
        ctx.lineTo(gx, gy); // Ground point is sum
        ctx.stroke();

        // Draw Ground Vector (Green) from Center to Ground Point
        ctx.beginPath();
        ctx.strokeStyle = '#4ade80'; // Green 400
        ctx.lineWidth = 3;
        ctx.moveTo(cx, cy);
        ctx.lineTo(gx, gy);
        ctx.stroke();

        // Legend/Labels
        // Air
        ctx.fillStyle = '#38bdf8';
        ctx.fillText("TAS/Hdg", ax + 5, ay);
        // Wind
        ctx.fillStyle = '#f87171';
        ctx.fillText("Wind", (ax + gx) / 2 + 5, (ay + gy) / 2);
        // Ground
        ctx.fillStyle = '#4ade80';
        ctx.fillText("GS/Trk", gx + 5, gy);

    }, [hdg, tas, windDir, windSpd]);

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex items-center space-x-4">
                <button onClick={() => onNavigate?.(View.GEN_NAV_HOME)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"><ArrowLeft size={20} /></button>
                <div className="flex items-center gap-2">
                    <Navigation className="text-sky-400" />
                    <h1 className="text-2xl font-bold text-slate-100">Wind Triangle (Dead Reckoning)</h1>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 flex flex-col items-center">
                    <canvas ref={canvasRef} width={350} height={350} className="rounded-full bg-slate-950 border border-slate-800 shadow-inner" />
                    <div className="flex gap-4 mt-4 text-xs font-bold">
                        <span className="text-sky-400">Air Vector (TAS)</span>
                        <span className="text-red-400">+ Wind Vector</span>
                        <span className="text-green-400">= Ground Vector (GS)</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">True Heading (°)</label>
                                <input type="number" value={hdg} onChange={e => setHdg(Number(e.target.value))} className="w-full bg-slate-800 rounded p-2 text-white font-mono" />
                                <input type="range" min="0" max="360" value={hdg} onChange={e => setHdg(Number(e.target.value))} className="w-full mt-1 accent-sky-500" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">TAS (kt)</label>
                                <input type="number" value={tas} onChange={e => setTas(Number(e.target.value))} className="w-full bg-slate-800 rounded p-2 text-white font-mono" />
                                <input type="range" min="50" max="250" value={tas} onChange={e => setTas(Number(e.target.value))} className="w-full mt-1 accent-sky-500" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Wind Dir (°)</label>
                                <input type="number" value={windDir} onChange={e => setWindDir(Number(e.target.value))} className="w-full bg-slate-800 rounded p-2 text-white font-mono" />
                                <input type="range" min="0" max="360" value={windDir} onChange={e => setWindDir(Number(e.target.value))} className="w-full mt-1 accent-white" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Wind Spd (kt)</label>
                                <input type="number" value={windSpd} onChange={e => setWindSpd(Number(e.target.value))} className="w-full bg-slate-800 rounded p-2 text-white font-mono" />
                                <input type="range" min="0" max="100" value={windSpd} onChange={e => setWindSpd(Number(e.target.value))} className="w-full mt-1 accent-white" />
                            </div>
                        </div>

                        <div className="border-t border-slate-700 pt-6">
                            <h2 className="text-sm font-bold text-slate-400 uppercase mb-4">Results</h2>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-slate-800 p-3 rounded-lg">
                                    <div className="text-2xl font-bold text-green-400">{Math.round(gs)}</div>
                                    <div className="text-xs text-slate-500">Ground Speed</div>
                                </div>
                                <div className="bg-slate-800 p-3 rounded-lg">
                                    <div className="text-2xl font-bold text-green-400">{Math.round(trk).toString().padStart(3, '0')}°</div>
                                    <div className="text-xs text-slate-500">True Track</div>
                                </div>
                                <div className="bg-slate-800 p-3 rounded-lg">
                                    <div className="text-2xl font-bold text-orange-400">{Math.abs(Math.round(drift))}° {drift > 0 ? 'R' : drift < 0 ? 'L' : ''}</div>
                                    <div className="text-xs text-slate-500">Drift Angle</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WindTriangle;
