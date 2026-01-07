import React, { useState, useEffect, useRef } from 'react';
import { View } from '../../types';
import { ArrowLeft, Activity } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const Modulation: React.FC<Props> = ({ onNavigate }) => {
    const [type, setType] = useState<'AM' | 'FM' | 'PULSE'>('AM');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const timeRef = useRef(0);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const render = () => {
            const width = canvas.width;
            const height = canvas.height;
            const centerY = height / 2;

            ctx.clearRect(0, 0, width, height);
            timeRef.current += 0.05;

            ctx.beginPath();
            ctx.strokeStyle = type === 'AM' ? '#38bdf8' : type === 'FM' ? '#34d399' : '#f43f5e';
            ctx.lineWidth = 2;

            for (let x = 0; x < width; x++) {
                const t = timeRef.current + (x * 0.02);
                let y = 0;

                // Carrier Freq
                const fc = 5;
                // Modulating Freq
                const fm = 0.5;

                if (type === 'AM') {
                    // Amp changes
                    const amp = 50 + 30 * Math.sin(fm * t);
                    y = centerY + amp * Math.sin(fc * t);
                } else if (type === 'FM') {
                    // Freq changes
                    const instF = fc + 2 * Math.sin(fm * t);
                    // Integrate freq for phase? Simplified visual:
                    y = centerY + 50 * Math.sin(instF * t); // Not mathematically perfect FM, but visual
                } else if (type === 'PULSE') {
                    // On/Off
                    const on = Math.sin(fm * t) > 0;
                    y = centerY + (on ? 50 * Math.sin(fc * t) : 0);
                }

                if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();
            animationRef.current = requestAnimationFrame(render);
        };
        render();
        return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
    }, [type]);

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex items-center space-x-4">
                <button onClick={() => onNavigate?.(View.RAD_NAV_HOME)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"><ArrowLeft size={20} /></button>
                <div className="flex items-center gap-2">
                    <Activity className="text-sky-400" />
                    <h1 className="text-2xl font-bold text-slate-100">Modulation</h1>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
                <div className="flex justify-center gap-4 mb-6">
                    <button onClick={() => setType('AM')} className={`px-4 py-2 rounded font-bold ${type === 'AM' ? 'bg-sky-500 text-black' : 'bg-slate-800 text-slate-400'}`}>AM (Amplitude)</button>
                    <button onClick={() => setType('FM')} className={`px-4 py-2 rounded font-bold ${type === 'FM' ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'}`}>FM (Frequency)</button>
                    <button onClick={() => setType('PULSE')} className={`px-4 py-2 rounded font-bold ${type === 'PULSE' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'}`}>Pulse (Radar)</button>
                </div>

                <canvas ref={canvasRef} width={800} height={300} className="w-full bg-black rounded border border-white/10" />

                <div className="mt-4 text-center text-slate-400 text-sm">
                    {type === 'AM' && "Used in NDB, VOR (Variable), and VHF Comms. Prone to static."}
                    {type === 'FM' && "Used in VOR (Reference), Radio Altimeter. Resistant to noise."}
                    {type === 'PULSE' && "Used in Radar, DME, Transponder. Short bursts of high energy."}
                </div>
            </div>
        </div>
    );
};

export default Modulation;
