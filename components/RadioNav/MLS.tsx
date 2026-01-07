import React, { useState, useEffect, useRef } from 'react';
import { View } from '../../types';
import { ArrowLeft, Signal } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const MLS: React.FC<Props> = ({ onNavigate }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const angleRef = useRef(0); // Sweep angle
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const render = () => {
            const width = canvas.width;
            const height = canvas.height;
            ctx.clearRect(0, 0, width, height);

            // Draw Runway
            ctx.fillStyle = '#334155';
            ctx.fillRect(width / 2 - 20, height / 2, 40, height / 2);

            // TRSB Sweep (Azimuth)
            // Sweep Left to Right then Right to Left
            // -40 to +40 degrees
            angleRef.current = (angleRef.current + 2) % 360;
            const sweepPhase = Math.sin(angleRef.current * Math.PI / 180) * 40; // Oscillation +/- 40 deg

            // Draw Beam
            ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
            ctx.beginPath();
            ctx.moveTo(width / 2, height - 20); // Transmitter at far end? No, Azimuth is guidance.
            // Simplified: Draw a fan originating from runway end
            const bx = width / 2;
            const by = height - 50;
            const beamLen = 300;
            const angleRad = (sweepPhase - 90) * Math.PI / 180; // Up is -90

            ctx.lineTo(bx + beamLen * Math.cos(angleRad - 0.1), by + beamLen * Math.sin(angleRad - 0.1));
            ctx.lineTo(bx + beamLen * Math.cos(angleRad + 0.1), by + beamLen * Math.sin(angleRad + 0.1));
            ctx.fill();

            // Aircraft
            const ax = width / 2 - 50;
            const ay = height / 2 - 50;
            ctx.font = '20px sans-serif';
            ctx.fillText("✈️", ax, ay);

            // Hit detection visual
            // If beam crosses aircraft
            // Aircraft angle relative to station
            // Station at bottom center (bx, by)
            const aircraftAngle = Math.atan2(ay - by, ax - bx) * 180 / Math.PI; // -90 is Up.
            // Aircraft is roughly at -110 deg?

            animationRef.current = requestAnimationFrame(render);
        };
        render();
        return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex items-center space-x-4">
                <button onClick={() => onNavigate?.(View.RAD_NAV_HOME)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"><ArrowLeft size={20} /></button>
                <div className="flex items-center gap-2">
                    <Signal className="text-sky-400" />
                    <h1 className="text-2xl font-bold text-slate-100">Microwave Landing System (MLS)</h1>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
                <h2 className="text-white font-bold mb-4">Time Reference Scanning Beam (TRSB)</h2>
                <div className="flex justify-center">
                    <canvas ref={canvasRef} width={600} height={400} className="bg-black rounded border border-slate-800" />
                </div>
                <p className="text-sm text-slate-400 mt-4 text-center">
                    The beam scans TO and FRO. The aircraft measures the time difference between the two hits to calculate its angle.
                </p>
            </div>
        </div>
    );
};

export default MLS;
