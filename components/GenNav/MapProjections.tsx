import React, { useState, useEffect, useRef } from 'react';
import { View } from '../../types';
import { ArrowLeft, Map } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const MapProjections: React.FC<Props> = ({ onNavigate }) => {
    const [proj, setProj] = useState<'MERCATOR' | 'LAMBERT' | 'POLAR'>('MERCATOR');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Theory:
    // Mercator: 
    // - Parallel Straight Meridians.
    // - Rhumb Lines are straight.
    // - Great Circles are curved (convex to pole).
    // - Scale expands with sec(Lat).

    // Lambert:
    // - Converging Straight Meridians.
    // - Great Circles essentially straight.
    // - Scale constant along standard parallels.

    const toRad = (d: number) => d * Math.PI / 180;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h / 2;

        if (proj === 'MERCATOR') {
            // Draw Grid
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 1;

            // Meridians (Parallel)
            for (let x = 50; x < w; x += 60) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
            }
            // Parallels (Expanding distance)
            // Visual approx: spacing increases away from Equator (let cy = Eq)
            let y = cy;
            let spacing = 20;
            for (let i = 0; y > 0; i++) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
                y -= spacing;
                spacing *= 1.2; // expansion
            }
            y = cy; spacing = 20;
            for (let i = 0; y < h; i++) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
                y += spacing;
                spacing *= 1.2;
            }

            // Rhumb Line (Straight)
            ctx.strokeStyle = '#facc15'; // Yellow
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(100, cy + 50);
            ctx.lineTo(w - 100, cy - 50);
            ctx.stroke();

            // Great Circle (Curved to Pole)
            ctx.strokeStyle = '#38bdf8'; // Blue
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(100, cy + 50);
            // Control point higher (towards top if Northern hem is top)
            ctx.quadraticCurveTo(cx, cy - 80, w - 100, cy - 50);
            ctx.stroke();

        } else if (proj === 'LAMBERT') {
            // LAMBERT (Conic)
            // Fan shape
            ctx.strokeStyle = '#334155';

            // Meridians (Converging to top center roughly)
            const originX = w / 2;
            const originY = -100; // Apex off screen

            for (let deg = -40; deg <= 40; deg += 20) {
                const angle = deg * Math.PI / 180;
                ctx.beginPath();
                ctx.moveTo(originX, originY); // From apex
                ctx.lineTo(originX + Math.sin(angle) * 600, originY + Math.cos(angle) * 600);
                ctx.stroke();
            }

            // Parallels (Concentric Arcs)
            for (let r = 300; r < 600; r += 80) {
                ctx.beginPath();
                ctx.arc(originX, originY, r, toRad(90 - 40), toRad(90 + 40));
                ctx.stroke();
            }



            // Points
            // Left Point roughly (-30 deg, r=400)
            // Right Point roughly (+30 deg, r=400)

            // Great Circle (Straight) - In Lambert it's a Straight Line
            ctx.strokeStyle = '#38bdf8';
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(originX - 150, 350);
            ctx.lineTo(originX + 150, 350);
            ctx.stroke();

            // Rhumb Line (Curved concave to pole)
            ctx.strokeStyle = '#facc15';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(originX - 150, 350);
            ctx.quadraticCurveTo(originX, 380, originX + 150, 350); // Dips down away from pole
            ctx.stroke();
        } else {
            // POLAR STEREOGRAPHIC
            // Center is Pole
            const cx = w / 2;
            const cy = h / 2;

            ctx.strokeStyle = '#334155';

            // Meridians (Radiating Straight Lines)
            for (let deg = 0; deg < 360; deg += 30) {
                const angle = deg * Math.PI / 180;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + Math.cos(angle) * 200, cy + Math.sin(angle) * 200);
                ctx.stroke();
            }

            // Parallels (Concentric Circles)
            for (let r = 50; r <= 150; r += 50) {
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Great Circle (Straight if through pole, slightly curved otherwise)
            // Visual approx: Straight line nearby to pole
            ctx.strokeStyle = '#38bdf8';
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(cx - 100, cy + 50);
            ctx.lineTo(cx + 100, cy + 50);
            ctx.stroke();

            // Rhumb Line (Concave to pole = Spirals, but locally curved)
            ctx.strokeStyle = '#facc15';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(cx - 100, cy + 50);
            // Rhumb line on polar chart is a spiral, concave to pole
            ctx.quadraticCurveTo(cx, cy + 100, cx + 100, cy + 50);
            ctx.stroke();
        }

    }, [proj]);

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex items-center space-x-4">
                <button onClick={() => onNavigate?.(View.GEN_NAV_HOME)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"><ArrowLeft size={20} /></button>
                <div className="flex items-center gap-2">
                    <Map className="text-sky-400" />
                    <h1 className="text-2xl font-bold text-slate-100">Map Projections</h1>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
                    <canvas ref={canvasRef} width={400} height={300} className="w-full bg-slate-950 rounded border border-slate-800" />
                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                        <span className="text-sky-400">── Great Circle</span>
                        <span className="text-yellow-400">--- Rhumb Line</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl space-y-4">
                        <div className="flex bg-slate-950 p-1 rounded-lg mb-4">
                            <button onClick={() => setProj('MERCATOR')} className={`flex-1 py-2 text-xs font-bold rounded ${proj === 'MERCATOR' ? 'bg-sky-500 text-black' : 'text-slate-500'}`}>Mercator</button>
                            <button onClick={() => setProj('LAMBERT')} className={`flex-1 py-2 text-xs font-bold rounded ${proj === 'LAMBERT' ? 'bg-indigo-500 text-white' : 'text-slate-500'}`}>Lambert</button>
                            <button onClick={() => setProj('POLAR')} className={`flex-1 py-2 text-xs font-bold rounded ${proj === 'POLAR' ? 'bg-purple-500 text-white' : 'text-slate-500'}`}>Polar</button>
                        </div>

                        {proj === 'MERCATOR' ? (
                            <div className="space-y-2 text-sm text-slate-300">
                                <p><strong>Geometry:</strong> Cylindrical projection.</p>
                                <p><strong>Meridians:</strong> Parallel straight lines.</p>
                                <p><strong>Rhumb Lines:</strong> Straight lines (Good for bearings).</p>
                                <p><strong>Great Circles:</strong> Curved towards the nearest pole.</p>
                                <p><strong>Scale:</strong> Expands with secant of latitude (incorrect areas).</p>
                            </div>
                        ) : proj === 'LAMBERT' ? (
                            <div className="space-y-2 text-sm text-slate-300">
                                <p><strong>Geometry:</strong> Conic projection (secant to Earth).</p>
                                <p><strong>Meridians:</strong> Straight lines converging at pole.</p>
                                <p><strong>Great Circles:</strong> Approximate straight lines (Good for radio nav).</p>
                                <p><strong>Rhumb Lines:</strong> Curves concave to the pole.</p>
                                <p><strong>Scale:</strong> Constant at Standard Parallels.</p>
                            </div>
                        ) : (
                            <div className="space-y-2 text-sm text-slate-300">
                                <p><strong>Geometry:</strong> Planar projection (tangent at pole).</p>
                                <p><strong>Meridians:</strong> Straight lines radiating from pole.</p>
                                <p><strong>Parallels:</strong> Concentric circles.</p>
                                <p><strong>Great Circles:</strong> Straight lines (if passing through pole), otherwise curved concave to pole.</p>
                                <p><strong>Use:</strong> Polar navigation (Grid Navigation).</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapProjections;
