import React, { useState, useEffect, useRef } from 'react';
import { View } from '../../types';
import { ArrowLeft, Compass } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const PolarGrid: React.FC<Props> = ({ onNavigate }) => {
    // Inputs
    const [long, setLong] = useState(0); // Longitude of aircraft
    const [datumLong, setDatumLong] = useState(0); // Datum Meridian (Grid North)

    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Theory:
    // Polar Stereographic Chart. Meridians are straight lines converging at Pole.
    // True North direction changes as you move East/West.
    // Grid North is aligned with the Datum Meridian.
    // Grid Convergence = Difference between TN and GN.
    // Convergence = Longitude - Datum Longitude (in Polar Stereo).
    // Grid Heading = True Heading + West Longitude (if Datum is Greenwich?)
    // Formula: GH = TH + G.Conv (where G.Conv is Westerly +?)

    // Visual:
    // Pole at center.
    // Datum Meridian vertical up (North).
    // Aircraft at some angle (Longitude).

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

        // Draw Chart Limit Circle
        ctx.strokeStyle = '#334155';
        ctx.beginPath(); ctx.arc(cx, cy, 120, 0, Math.PI * 2); ctx.stroke();

        // Pole
        ctx.fillStyle = 'white';
        ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill();

        const toRad = (d: number) => (d - 90) * Math.PI / 180; // -90 so 0 deg is UP (Standard Math 0 is Right)

        // Draw Datum Meridian (Grid North reference)
        // Up is 0 Longitude (if Datum=0). 
        // We draw Datum vertical ? No, let's rotate everything relative to screen up.
        // Let Screen Up = Grid North.

        ctx.strokeStyle = '#facc15'; // Yellow for Grid North
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx, cy - 110);
        ctx.stroke();
        ctx.fillStyle = '#facc15';
        ctx.fillText("GN", cx - 10, cy - 115);

        // Draw True North Meridian at Aircraft Position
        // Angle relative to Datum = (Long - Datum)
        // If Long is East (+), it is to the Right (Clockwise).
        const conv = long - datumLong;
        const acAngleRad = toRad(90 + conv); // 90 because 0 is Up in our viz logic above? 
        // Wait, standard polar: 0 deg Lon is usually down? Or Greenwich Up?
        // Let's say Greenwich Up. East is Right.

        // Aircraft position vector
        const r = 80;
        const ax = cx + r * Math.sin(conv * Math.PI / 180);
        const ay = cy - r * Math.cos(conv * Math.PI / 180);

        // Draw Meridian to Aircraft (True North line goes from Ac to Pole)
        ctx.strokeStyle = '#38bdf8'; // Blue for True North
        ctx.setLineDash([]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(ax, ay);
        ctx.stroke();

        // Draw True North Vector at Aircraft
        // TN is always reaching towards Pole.
        // Vector pointing North at Aircraft position?
        // It points INWARDS to center.

        // Draw Grid North Vector at Aircraft
        // Always Parallel to Datum Meridian (Straight Up).
        ctx.beginPath();
        ctx.strokeStyle = '#facc15';
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax, ay - 40);
        ctx.stroke();

        // Draw Aircraft (Dot)
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(ax, ay, 5, 0, Math.PI * 2); ctx.fill();

        // Draw True North Vector at Aircraft (Extension of meridian)
        // Actually, "North" is towards the pole.
        // So heading 000 T is direction towards pole? No, away from pole is South.
        // Towards pole is North.
        // So at AC, vector to Center is TN.
        // Let's visualize Heading.

        // If we fly Grid North 000, we fly parallel to Datum.
        // Our True Heading changes.

    }, [long, datumLong]);

    const convergence = long - datumLong;

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex items-center space-x-4">
                <button onClick={() => onNavigate?.(View.GEN_NAV_HOME)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"><ArrowLeft size={20} /></button>
                <div className="flex items-center gap-2">
                    <Compass className="text-sky-400" />
                    <h1 className="text-2xl font-bold text-slate-100">Polar Grid Navigation</h1>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 flex flex-col items-center">
                    <canvas ref={canvasRef} width={300} height={300} className="rounded-full bg-slate-950 border border-slate-800 shadow-inner" />
                    <div className="mt-4 text-center">
                        <div className="text-yellow-400 text-sm font-bold">Yellow: Grid North (Parallel to Datum)</div>
                        <div className="text-sky-400 text-sm font-bold">Blue: True North (Meridian to Pole)</div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl space-y-6">
                        <div>
                            <label className="block text-xs text-slate-400 mb-2">Aircraft Longitude ({long}°)</label>
                            <input type="range" min="-90" max="90" value={long} onChange={e => setLong(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500" />
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>90° W</span>
                                <span>0°</span>
                                <span>90° E</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-slate-400 mb-2">Datum Meridian ({datumLong}°)</label>
                            <input type="range" min="-90" max="90" value={datumLong} onChange={e => setDatumLong(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
                        </div>

                        <div className="bg-slate-800 p-4 rounded-lg">
                            <h3 className="text-sm font-bold text-slate-300 mb-3">Formula</h3>
                            <div className="space-y-2 font-mono text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Convergence =</span>
                                    <span className="text-white">{convergence}°</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Grid Hdg =</span>
                                    <span className="text-white">True Hdg {convergence >= 0 ? '-' : '+'} {Math.abs(convergence)}</span>
                                </div>
                                <div className="text-xs text-slate-500 mt-2">
                                    "Convergency West, True Best" (True is larger)<br />
                                    "Convergency East, True Least"
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PolarGrid;
