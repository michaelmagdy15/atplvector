import React, { useState, useEffect, useRef } from 'react';
import { View } from '../../types';
import { RefreshCcw, ArrowLeft, Sliders } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const WavePropVisualizer: React.FC<Props> = ({ onNavigate }) => {
    const [frequency, setFrequency] = useState(1); // Hz (relative)
    const [amplitude, setAmplitude] = useState(50); // px
    const [phase, setPhase] = useState(0); // degrees
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const timeRef = useRef(0);

    // Speed of wave propagation (pixels per frame)
    const waveSpeed = 2;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const render = () => {
            if (!canvas) return;
            const width = canvas.width;
            const height = canvas.height;
            const centerY = height / 2;

            ctx.clearRect(0, 0, width, height);

            // Time progression
            timeRef.current += waveSpeed;

            // Draw center line
            ctx.beginPath();
            ctx.strokeStyle = '#334155'; // slate-700
            ctx.lineWidth = 1;
            ctx.moveTo(0, centerY);
            ctx.lineTo(width, centerY);
            ctx.stroke();

            // Draw Sine Wave
            ctx.beginPath();
            ctx.strokeStyle = '#38bdf8'; // sky-400
            ctx.lineWidth = 3;

            // Wavelength (pixels) inversely proportional to frequency
            // Base wavelength at freq 1 = 200px
            const wavelength = 200 / frequency;

            for (let x = 0; x < width; x++) {
                // y = A * sin(2*pi*f*t + phi)
                // spatial: y = A * sin( (2*pi/lambda) * (x - vt) + phase )

                const k = (2 * Math.PI) / wavelength;
                const angle = k * (x - timeRef.current) + (phase * Math.PI / 180);
                const y = centerY + amplitude * Math.sin(angle);

                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Draw Wavelength Marker (Lambda)
            // Show one full cycle relative to a fixed point or just visually
            // Let's draw a static representation of lambda at the top
            ctx.beginPath();
            ctx.strokeStyle = '#fff';
            ctx.fillStyle = '#fff';
            ctx.lineWidth = 1;
            const startX = 50;
            const endX = 50 + wavelength;
            const lineY = 50;

            // Limit marker drawing to canvas bounds
            if (endX < width - 50) {
                ctx.moveTo(startX, lineY);
                ctx.lineTo(endX, lineY);
                ctx.stroke();

                // Arrows
                ctx.fillText("λ", startX + (wavelength / 2) - 5, lineY - 5);
                ctx.beginPath(); ctx.moveTo(startX, lineY - 3); ctx.lineTo(startX, lineY + 3); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(endX, lineY - 3); ctx.lineTo(endX, lineY + 3); ctx.stroke();
            }

            animationRef.current = requestAnimationFrame(render);
        };

        render();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [frequency, amplitude, phase]);

    // Derived values
    const c = 300; // Speed of light constant (simplified)
    const lambda = (c / frequency).toFixed(1);

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => onNavigate?.(View.RAD_NAV_HOME)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-slate-100">Wave Propagation Theory</h1>
            </div>

            {/* Main Visualizer */}
            <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 shadow-xl space-y-6">

                <div className="relative h-64 w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={256}
                        className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-2 left-2 text-xs text-slate-500 font-mono">
                        v = c (Speed of Light)
                    </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Frequency */}
                    <div className="space-y-2 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-sky-400">Frequency (f)</label>
                            <span className="text-xs bg-slate-900 px-2 py-1 rounded text-slate-300 font-mono">{frequency} Hz</span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="5"
                            step="0.1"
                            value={frequency}
                            onChange={(e) => setFrequency(parseFloat(e.target.value))}
                            className="w-full accent-sky-500"
                        />
                        <p className="text-xs text-slate-500">Cycles per second</p>
                    </div>

                    {/* Amplitude */}
                    <div className="space-y-2 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-indigo-400">Amplitude (A)</label>
                            <span className="text-xs bg-slate-900 px-2 py-1 rounded text-slate-300 font-mono">{amplitude}</span>
                        </div>
                        <input
                            type="range"
                            min="10"
                            max="100"
                            step="1"
                            value={amplitude}
                            onChange={(e) => setAmplitude(parseInt(e.target.value))}
                            className="w-full accent-indigo-500"
                        />
                        <p className="text-xs text-slate-500">Signal Strength</p>
                    </div>

                    {/* Phase */}
                    <div className="space-y-2 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-emerald-400">Phase (φ)</label>
                            <span className="text-xs bg-slate-900 px-2 py-1 rounded text-slate-300 font-mono">{phase}°</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            step="1"
                            value={phase}
                            onChange={(e) => setPhase(parseInt(e.target.value))}
                            className="w-full accent-emerald-500"
                        />
                        <p className="text-xs text-slate-500">Starting angle offset</p>
                    </div>
                </div>

                {/* Formula Box */}
                <div className="flex justify-center">
                    <div className="inline-flex items-center gap-6 px-8 py-4 bg-black/40 rounded-xl border border-white/10">
                        <div className="text-center">
                            <span className="block text-2xl font-serif text-white italic">λ = c / f</span>
                        </div>
                        <div className="h-8 w-px bg-white/10"></div>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between gap-4">
                                <span className="text-slate-400">Wavelength (λ):</span>
                                <span className="text-sky-300 font-mono">{lambda} m</span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-slate-400">Frequency (f):</span>
                                <span className="text-sky-300 font-mono">{frequency} Hz</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Educational Content */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-white mb-3">Key Concepts</h3>
                    <ul className="space-y-2 text-slate-300 text-sm list-disc pl-4">
                        <li><strong className="text-white">Wavelength (λ):</strong> The physical distance of one complete cycle.</li>
                        <li><strong className="text-white">Frequency (f):</strong> Number of cycles passing a point per second (Hertz).</li>
                        <li><strong className="text-white">Amplitude (A):</strong> The maximum displacement from the equilibrium (signal strength).</li>
                        <li><strong className="text-white">Phase (φ):</strong> The position of a point in time on a waveform cycle.</li>
                    </ul>
                </div>
                <div className="glass-panel p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-white mb-3">Radio Formula</h3>
                    <p className="text-slate-300 text-sm mb-4">
                        The higher the frequency, the shorter the wavelength.
                    </p>
                    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 text-xs font-mono text-slate-400">
                        c (Speed of Light) ≈ 300,000,000 m/s<br />
                        f = Frequency in Hz<br />
                        λ = Wavelength in Meters
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WavePropVisualizer;
