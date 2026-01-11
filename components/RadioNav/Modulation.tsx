import React, { useState, useEffect, useRef } from 'react';
import { View } from '../../types';
import { ArrowLeft, Activity, BarChart3 } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const Modulation: React.FC<Props> = ({ onNavigate }) => {
    const [type, setType] = useState<'AM' | 'FM' | 'SSB' | 'PULSE'>('AM');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const spectrumRef = useRef<HTMLCanvasElement>(null);
    const timeRef = useRef(0);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const spectrum = spectrumRef.current;
        if (!canvas || !spectrum) return;
        const ctx = canvas.getContext('2d');
        const sCtx = spectrum.getContext('2d');
        if (!ctx || !sCtx) return;

        const render = () => {
            const width = canvas.width;
            const height = canvas.height;
            const centerY = height / 2;

            ctx.clearRect(0, 0, width, height);

            // --- TIME DOMAIN ---
            timeRef.current += 1; // Frames

            ctx.beginPath();
            ctx.strokeStyle = type === 'AM' ? '#38bdf8' : type === 'FM' ? '#34d399' : type === 'SSB' ? '#f472b6' : '#f43f5e';
            ctx.lineWidth = 2;

            const fc = 0.5; // Carrier Freq (Visual)
            const fm = 0.05; // Audio Freq

            for (let x = 0; x < width; x++) {
                const t = (timeRef.current + x) * 0.5; // Scaling time
                let y = 0;

                if (type === 'AM') {
                    // Amp changes: (1 + m*sin(fmt))*sin(fct)
                    const amp = 80 + 40 * Math.sin(fm * t);
                    y = centerY + amp * Math.sin(fc * t) * 0.5;
                } else if (type === 'FM') {
                    // Freq changes: sin(fct + beta*sin(fmt))
                    const beta = 5;
                    y = centerY + 60 * Math.sin(fc * t + beta * Math.sin(fm * t));
                } else if (type === 'SSB') {
                    // USB
                    y = centerY + 60 * Math.sin((fc + fm) * t);
                } else if (type === 'PULSE') {
                    // On/Off
                    const pulseWidth = 100;
                    const period = 300;
                    const modT = (timeRef.current + x) % period;
                    const on = modT < pulseWidth;
                    y = centerY + (on ? 60 * Math.sin(fc * t) : 0);
                }

                if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // --- FREQUENCY DOMAIN ---
            const sW = spectrum.width;
            const sH = spectrum.height;
            const sCenter = sW / 2;
            sCtx.clearRect(0, 0, sW, sH);

            // Draw Frequency Axis
            sCtx.strokeStyle = '#64748b';
            sCtx.beginPath(); sCtx.moveTo(0, sH - 20); sCtx.lineTo(sW, sH - 20); sCtx.stroke();
            sCtx.fillStyle = '#94a3b8';
            sCtx.font = '10px monospace';
            sCtx.fillText("Freq ->", sW - 40, sH - 8);
            sCtx.fillText("Carrier (fc)", sCenter - 30, sH - 8);

            // Draw Bars
            const drawBar = (x: number, h: number, color: string, label?: string) => {
                sCtx.fillStyle = color;
                sCtx.fillRect(x - 4, sH - 20 - h, 8, h);
                if (label) {
                    sCtx.fillText(label, x - 10, sH - 25 - h);
                }
            };

            if (type === 'AM') {
                drawBar(sCenter, 100, '#38bdf8', 'C'); // Carrier
                drawBar(sCenter - 40, 30, '#bae6fd', 'LSB'); // LSB
                drawBar(sCenter + 40, 30, '#bae6fd', 'USB'); // USB
                sCtx.fillStyle = '#fff';
                sCtx.fillText("USB & LSB Duplicate Info", 10, 20);
                sCtx.fillText("Carrier = Wasted Power", 10, 35);
            } else if (type === 'FM') {
                drawBar(sCenter, 80, '#34d399', 'C');
                for (let i = 1; i <= 6; i++) {
                    const h = 60 / i;
                    drawBar(sCenter - (20 * i), h, '#6ee7b7');
                    drawBar(sCenter + (20 * i), h, '#6ee7b7');
                }
                sCtx.fillStyle = '#fff';
                sCtx.fillText("Wide Bandwidth", 10, 20);
                sCtx.fillText("Many Sidebands", 10, 35);
            } else if (type === 'SSB') {
                sCtx.strokeStyle = '#333'; sCtx.setLineDash([2, 2]);
                sCtx.strokeRect(sCenter - 4, sH - 120, 8, 100); sCtx.setLineDash([]);
                drawBar(sCenter + 40, 80, '#f472b6', 'USB');
                sCtx.fillStyle = '#fff';
                sCtx.fillText("No Carrier / No LSB", 10, 20);
                sCtx.fillText("All Power in Signal", 10, 35);
            } else if (type === 'PULSE') {
                drawBar(sCenter, 90, '#f43f5e');
                for (let i = 1; i <= 10; i++) {
                    drawBar(sCenter + (15 * i), 90 / (i * 1.5), '#f43f5e');
                    drawBar(sCenter - (15 * i), 90 / (i * 1.5), '#f43f5e');
                }
                sCtx.fillStyle = '#fff';
                sCtx.fillText("Broadband Noise", 10, 20);
            }

            animationRef.current = requestAnimationFrame(render);
        };
        render();
        return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
    }, [type]);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                {onNavigate && <button onClick={() => onNavigate(View.RAD_NAV_HOME)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"><ArrowLeft size={20} /></button>}
                <div className="flex items-center gap-2">
                    <Activity className="text-sky-400" />
                    <h1 className="text-2xl font-bold text-slate-100">Signal Modulation</h1>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-wrap gap-2 mb-6">
                    <button onClick={() => setType('AM')} className={`px-4 py-2 rounded font-bold transition-all ${type === 'AM' ? 'bg-sky-500 text-black shadow-lg shadow-sky-500/20' : 'bg-slate-800 text-slate-400'}`}>AM</button>
                    <button onClick={() => setType('FM')} className={`px-4 py-2 rounded font-bold transition-all ${type === 'FM' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}>FM</button>
                    <button onClick={() => setType('SSB')} className={`px-4 py-2 rounded font-bold transition-all ${type === 'SSB' ? 'bg-pink-500 text-black shadow-lg shadow-pink-500/20' : 'bg-slate-800 text-slate-400'}`}>SSB</button>
                    <button onClick={() => setType('PULSE')} className={`px-4 py-2 rounded font-bold transition-all ${type === 'PULSE' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-slate-800 text-slate-400'}`}>Pulse</button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-bold tracking-wider">
                            <span>Time Domain</span>
                            <Activity size={12} />
                        </div>
                        <canvas ref={canvasRef} width={600} height={200} className="w-full bg-black/80 rounded-lg border border-white/10 shadow-inner" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-bold tracking-wider">
                            <span>Frequency Domain</span>
                            <BarChart3 size={12} />
                        </div>
                        <canvas ref={spectrumRef} width={250} height={200} className="w-full bg-slate-950 rounded-lg border border-white/10 shadow-inner" />
                    </div>
                </div>

                <div className="mt-6 bg-slate-800/50 p-4 rounded-xl border border-white/5">
                    <p className="text-sm text-slate-400">
                        {type === 'AM' && "Signal = Carrier + USB + LSB. Bandwidth efficient but power inefficient and noisy."}
                        {type === 'FM' && "Signal = Variable Frequency. Infinite sidebands theoretically. Noise resistant."}
                        {type === 'SSB' && "Signal = USB only (or LSB). 50% Bandwidth, 100% Power efficiency. Used for long range HF."}
                        {type === 'PULSE' && "Bursts of energy. Wide bandwidth noise. Used for ranging."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Modulation;
