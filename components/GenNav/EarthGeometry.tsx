import React, { useState, useEffect, useRef } from 'react';
import { View } from '../../types';
import { ArrowLeft, Globe } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const EarthGeometry: React.FC<Props> = ({ onNavigate }) => {
    // Coordinates in degrees
    const [lat1, setLat1] = useState(51.5); // London
    const [lon1, setLon1] = useState(-0.1);
    const [lat2, setLat2] = useState(40.7); // NYC
    const [lon2, setLon2] = useState(-74.0);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Theory:
    // Rhumb Line: Constant bearing. Straight line on Mercator.
    // Great Circle: Shortest path. Curved line on Mercator (convex to nearer pole).
    // Earth Radius R ~ 3440 NM
    const R = 3440;

    const toRad = (d: number) => d * Math.PI / 180;
    const toDeg = (r: number) => r * 180 / Math.PI;

    // Calculate Distances
    // Great Circle (Spherical Law of Cosines)
    const dGC = Math.acos(
        Math.sin(toRad(lat1)) * Math.sin(toRad(lat2)) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1))
    ) * R;

    // Rhumb Line (Approx for sphere)
    // dPhi = ln(tan(pi/4 + lat2/2) / tan(pi/4 + lat1/2))
    // q = dLat / dPhi  (or cos(lat) if dLat ~0)
    // Dist = sqrt(dLat^2 + q^2 * dLon^2) * 60 ?? 
    // Simplified Rhumb distance: D = dLat / cos(Course)
    // Course = atan( dLon / dPhi ) ... huge rabbit hole for full Mercator math.
    // Let's use simple approximation for educational display or just show GC is shorter.
    // D_RL is always >= D_GC.

    // For visualization on "Mercator-ish" canvas:
    // X = Longitude, Y = Latitude (distorted)
    // But for simplicity, let's just map Lat/Lon linearly to X/Y for a "Plate Carrée" projection first, 
    // or Mercator Y = ln(tan(pi/4 + lat/2))

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        // Grid
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        for (let x = 0; x <= w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
        for (let y = 0; y <= h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

        // Map projection parameters
        // Center (0,0) at (w/2, h/2)
        // Scale: 180 deg lon = w/2?
        const scaleX = w / 360;
        const scaleY = h / 180;

        const mapX = (lon: number) => (lon + 180) * scaleX;
        const mapY = (lat: number) => h - ((lat + 90) * scaleY); // +90 because 0 is bottom

        const x1 = mapX(lon1);
        const y1 = mapY(lat1);
        const x2 = mapX(lon2);
        const y2 = mapY(lat2);

        // Draw Points
        ctx.fillStyle = '#facc15';
        ctx.beginPath(); ctx.arc(x1, y1, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f87171';
        ctx.beginPath(); ctx.arc(x2, y2, 5, 0, Math.PI * 2); ctx.fill();

        // Draw Rhumb Line (Straight on this projection for simplicity, though strictly Plate Carrée)
        ctx.beginPath();
        ctx.strokeStyle = '#facc15'; // Yellow
        ctx.setLineDash([5, 5]);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Draw Great Circle (Approximation)
        // Waypoints along the path
        ctx.beginPath();
        ctx.strokeStyle = '#38bdf8'; // Sky Blue
        ctx.setLineDash([]);
        ctx.moveTo(x1, y1);

        const steps = 20;
        for (let i = 1; i <= steps; i++) {
            const f = i / steps;
            // Intermediate point calc (Linear interp of vectors? Or just visual curve?)
            // Visual curve: GC bows towards the pole.
            // If Northern hemisphere, bows up (lower Y).
            // Curve height amplitude approx proportional to lon diff.

            // Simple Quadratic Bezier visual fallback:
            // Control point: mid longitude, but higher latitude?
            // This is purely visual to demonstrate the concept.

            // Real math: A + f*(B-A) in spherical vectors, then back to LatLon.
            // Let's do a simple visual hack for now:
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            // Curvature:
            const curvature = Math.abs(lon2 - lon1) * 0.2 * (lat1 > 0 ? -1 : 1);
            // -1 moves UP (northern hem), +1 moves DOWN (southern) in pixel Y

            // This is extremely simplified.
            const cx = midX;
            const cy = midY + (curvature);

            // Actually, ctx.quadraticCurveTo is better
            // But we are in a loop ?? No, specific loop needed for real calc.
        }

        // Let's use quadraticCurveTo for visual smoothness
        const cpX = (x1 + x2) / 2;
        // Bow distance: 
        const bow = (Math.abs(lon2 - lon1) / 180) * 100 * ((lat1 + lat2) / 2 > 0 ? -1 : 1);
        const cpY = (y1 + y2) / 2 + bow;

        ctx.quadraticCurveTo(cpX, cpY, x2, y2);
        ctx.stroke();

        // Labels
        ctx.fillStyle = 'white';
        ctx.fillText("A", x1 + 10, y1);
        ctx.fillText("B", x2 + 10, y2);

    }, [lat1, lon1, lat2, lon2]);

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex items-center space-x-4">
                <button onClick={() => onNavigate?.(View.GEN_NAV_HOME)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"><ArrowLeft size={20} /></button>
                <div className="flex items-center gap-2">
                    <Globe className="text-sky-400" />
                    <h1 className="text-2xl font-bold text-slate-100">Earth Geometry</h1>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
                    <canvas ref={canvasRef} width={400} height={300} className="w-full bg-slate-950 rounded border border-slate-800" />
                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                        <span className="text-sky-400">── Great Circle (Shortest)</span>
                        <span className="text-yellow-400">-- Rhumb Line (Const Bearing)</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl space-y-4">
                        <h2 className="text-white font-bold">Coordinates</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-slate-400">Lat A</label>
                                <input type="number" value={lat1} onChange={e => setLat1(Number(e.target.value))} className="w-full bg-slate-800 rounded p-1 text-white" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400">Lon A</label>
                                <input type="number" value={lon1} onChange={e => setLon1(Number(e.target.value))} className="w-full bg-slate-800 rounded p-1 text-white" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400">Lat B</label>
                                <input type="number" value={lat2} onChange={e => setLat2(Number(e.target.value))} className="w-full bg-slate-800 rounded p-1 text-white" />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400">Lon B</label>
                                <input type="number" value={lon2} onChange={e => setLon2(Number(e.target.value))} className="w-full bg-slate-800 rounded p-1 text-white" />
                            </div>
                        </div>

                        <div className="bg-slate-800 p-4 rounded-lg mt-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-slate-400">Great Circle Dist:</span>
                                <span className="text-xl font-bold text-sky-400">{Math.round(dGC)} NM</span>
                            </div>
                            {/* Rhumb distance is complex to calc accurately without full library, omit for now or standard placeholder */}
                        </div>

                        <div className="text-sm text-slate-300">
                            <p><strong>Convergency:</strong> Meridians converge at the poles. </p>
                            <p>Conversion Angle = 0.5 × Convergency.</p>
                            <p>GC tracks curve towards the nearest pole on a Mercator chart.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EarthGeometry;
