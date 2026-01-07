import React, { useState, useEffect, useRef } from 'react';
import { View } from '../../types';
import { ArrowLeft, Sun } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const SolarCalc: React.FC<Props> = ({ onNavigate }) => {
    // State: Day of Year (0-365)
    const [dayOfYear, setDayOfYear] = useState(172); // ~June 21 (Summer Solstice)
    const [lat, setLat] = useState(51.5); // London

    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Theory:
    // Earth Axis Tilt = 23.5 deg
    // Declination (delta) approx = -23.44 * cos(360/365 * (N + 10))
    const toRad = (d: number) => d * Math.PI / 180;
    const toDeg = (r: number) => r * 180 / Math.PI;

    // Approx declination formula for Nth day
    // N=0 is Jan 1. Spring Equinox ~Day 80.
    const declination = -23.44 * Math.cos(toRad((360 / 365) * (dayOfYear + 10)));

    // Day Length Calc
    // cos(H) = -tan(Lat) * tan(Dec)
    // if |tan Lat tan Dec| > 1, then 24h day or 0h day.
    let dayLengthHours = 0;
    const tanArg = -Math.tan(toRad(lat)) * Math.tan(toRad(declination));

    if (tanArg >= 1) {
        dayLengthHours = 0; // Polar Night
    } else if (tanArg <= -1) {
        dayLengthHours = 24; // Midnight Sun
    } else {
        const hourAngleRad = Math.acos(tanArg);
        dayLengthHours = (toDeg(hourAngleRad) * 2) / 15; // 360 deg = 24h, so 15 deg/h
    }

    // Determine Season label
    const getMonth = (d: number) => {
        const date = new Date(2023, 0, d); // Any non-leap year
        return date.toLocaleString('default', { month: 'short', day: 'numeric' });
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // Visualization: Earth Orbit or simplified "Sun position relative to Earth tilt"
        // Let's draw Earth with Tilt and Sun rays coming from right.

        const cx = w / 2;
        const cy = h / 2;
        const radius = 80;

        // Draw Sun Rays
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        for (let i = -50; i <= 50; i += 20) {
            ctx.beginPath();
            ctx.moveTo(w - 20, cy + i);
            ctx.lineTo(cx + radius + 20, cy + i); // Stopping before earth for now
            ctx.stroke();
        }

        // Earth
        // Tilt is constant 23.5 relative to Ecliptic. 
        // But relative to Sun rays, the "effective tilt" presented to Sun matches Declination.
        // So we rotate Earth by -Declination.
        // If Dec is +23.5 (Summer N), North Pole tips TOWARDS Sun (Right).

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(toRad(-declination)); // Rotate Earth to show presentation to Sun

        // Atmosphere/Day side
        // Lit side is the side facing the Sun (Right side in this unrotated view? No we rotated Earth)
        // Sun is at Right.
        // So Right half is lit.

        // Draw Night side (Left half)
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(0, 0, radius, Math.PI / 2, Math.PI * 3 / 2);
        ctx.fill();

        // Draw Lit side (Right half)
        ctx.fillStyle = '#38bdf8'; // Ocean blue
        ctx.beginPath();
        ctx.arc(0, 0, radius, -Math.PI / 2, Math.PI / 2);
        ctx.fill();

        // Draw Axis
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(0, -radius - 20);
        ctx.lineTo(0, radius + 20);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Equator & selected Latitude
        // Equator
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(-radius, 0); ctx.lineTo(radius, 0); ctx.stroke();

        // Selected Latitude
        // We are drawing a cross section (Meridian).
        // But wait, Latitude is circle around axis.
        // In cross section, it's a chord perpendicular to axis.
        // y = -R * sin(lat) ? No.
        // On the circle of radius R, Lat L is at angle L from Equator.
        // So y = -radius * sin(lat) (Up is negative?)
        // Let's say Up (North) is -y.
        const latY = -radius * Math.sin(toRad(lat));
        const latW = radius * Math.cos(toRad(lat)); // Width at that lat

        ctx.strokeStyle = '#f472b6'; // Pink
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-latW, latY);
        ctx.lineTo(latW, latY);
        ctx.stroke();

        ctx.restore();

        // Labels
        ctx.font = '12px sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText("Sun Rays", w - 70, cy - 60);

    }, [declination, lat]);

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex items-center space-x-4">
                <button onClick={() => onNavigate?.(View.GEN_NAV_HOME)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"><ArrowLeft size={20} /></button>
                <div className="flex items-center gap-2">
                    <Sun className="text-yellow-400" />
                    <h1 className="text-2xl font-bold text-slate-100">Solar Time & Seasons</h1>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 flex flex-col items-center">
                    <canvas ref={canvasRef} width={300} height={300} className="rounded-full bg-slate-950 border border-slate-800 shadow-inner" />
                    <div className="flex gap-4 mt-4 text-xs font-bold text-center">
                        <span className="text-pink-400">Selected Latitude</span>
                        <span className="text-sky-400">Daylit Side</span>
                        <span className="text-slate-500">Night Side</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs text-slate-400">Date</label>
                                <span className="text-xs font-bold text-white">{getMonth(dayOfYear)}</span>
                            </div>
                            <input type="range" min="1" max="365" value={dayOfYear} onChange={e => setDayOfYear(Number(e.target.value))} className="w-full accent-yellow-500" />
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                <span>Jan</span><span>Mar (Eq)</span><span>Jun (Sol)</span><span>Sep (Eq)</span><span>Dec (Sol)</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-xs text-slate-400">Latitude</label>
                                <span className="text-xs font-bold text-white">{Math.abs(lat)}° {lat >= 0 ? 'N' : 'S'}</span>
                            </div>
                            <input type="range" min="-90" max="90" value={lat} onChange={e => setLat(Number(e.target.value))} className="w-full accent-pink-500" />
                        </div>

                        <div className="bg-slate-800 p-4 rounded-lg space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-400">Solar Declination:</span>
                                <span className="font-mono text-white">{declination.toFixed(1)}°</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-400">Day Length:</span>
                                <span className="font-mono text-yellow-400">{Math.floor(dayLengthHours)}h {Math.round((dayLengthHours % 1) * 60)}m</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SolarCalc;
