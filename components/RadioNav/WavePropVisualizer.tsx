import React, { useState, useEffect, useRef } from 'react';
import { View } from '../../types';
import { ArrowLeft, Waves, GitMerge } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const WavePropVisualizer: React.FC<Props> = ({ onNavigate }) => {
    // Mode State
    const [mode, setMode] = useState<'SINGLE' | 'INTERFERENCE'>('SINGLE');

    const [frequency, setFrequency] = useState(1); // Hz (relative)
    const [amplitude, setAmplitude] = useState(50); // px
    const [phase, setPhase] = useState(0); // degrees

    // Wave 2 for Interference
    const [phase2, setPhase2] = useState(0);

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

            const wavelength = 200 / frequency;

            // DRAWING FUNCTION
            const drawWave = (phi: number, color: string, widthPx: number, amp: number, dash: number[]) => {
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.lineWidth = widthPx;
                ctx.setLineDash(dash);

                for (let x = 0; x < width; x++) {
                    const k = (2 * Math.PI) / wavelength;
                    const angle = k * (x - timeRef.current) + (phi * Math.PI / 180);
                    const y = centerY + amp * Math.sin(angle);
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
                ctx.setLineDash([]);
            };

            if (mode === 'SINGLE') {
                // Main Wave
                drawWave(phase, '#38bdf8', 3, amplitude, []);

                // Wavelength Marker
                const startX = 50;
                const endX = 50 + wavelength;
                if (endX < width - 50) {
                    ctx.strokeStyle = '#fff'; ctx.fillStyle = '#fff'; ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(startX, 50); ctx.lineTo(endX, 50); ctx.stroke();
                    ctx.fillText("λ", startX + (wavelength / 2) - 5, 45);
                    // Ends
                    ctx.beginPath(); ctx.moveTo(startX, 47); ctx.lineTo(startX, 53); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(endX, 47); ctx.lineTo(endX, 53); ctx.stroke();
                }

            } else {
                // INTERFERENCE MODE
                const amp1 = amplitude * 0.6; // reduce amp to fit sum
                const amp2 = amplitude * 0.6;

                // Wave 1 (Base) - Dotted Blue
                drawWave(phase, 'rgba(56, 189, 248, 0.4)', 2, amp1, [5, 5]);

                // Wave 2 (Phase Shifted) - Dotted Green
                drawWave(phase2, 'rgba(52, 211, 153, 0.4)', 2, amp2, [5, 5]);

                // Resultant Sum - Solid White
                ctx.beginPath();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 4;
                ctx.shadowColor = 'rgba(255,255,255,0.5)';
                ctx.shadowBlur = 10;

                for (let x = 0; x < width; x++) {
                    const k = (2 * Math.PI) / wavelength;
                    const angle1 = k * (x - timeRef.current) + (phase * Math.PI / 180);
                    const angle2 = k * (x - timeRef.current) + (phase2 * Math.PI / 180);

                    const y1 = amp1 * Math.sin(angle1);
                    const y2 = amp2 * Math.sin(angle2);
                    const ySum = centerY + (y1 + y2);

                    if (x === 0) ctx.moveTo(x, ySum);
                    else ctx.lineTo(x, ySum);
                }
                ctx.stroke();
                ctx.shadowBlur = 0;
            }

            animationRef.current = requestAnimationFrame(render);
        };

        render();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [frequency, amplitude, phase, phase2, mode]);

    // Derived values
    const c = 300; // Speed of light constant (simplified)
    const lambda = (c / frequency).toFixed(1);
    const phaseDiff = Math.abs(phase - phase2) % 360;

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {onNavigate && <button
                        onClick={() => onNavigate(View.RAD_NAV_HOME)}
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                    >
                        <ArrowLeft size={20} />
                    </button>}
                    <h1 className="text-2xl font-bold text-slate-100">Wave & Phase Theory</h1>
                </div>

                <div className="flex bg-slate-800 p-1 rounded-lg">
                    <button
                        onClick={() => setMode('SINGLE')}
                        className={`px-4 py-2 rounded font-medium text-sm flex items-center gap-2 transition-colors ${mode === 'SINGLE' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Waves size={16} /> Single
                    </button>
                    <button
                        onClick={() => { setMode('INTERFERENCE'); setPhase2(180); }} // Default to destructive for dramatic effect
                        className={`px-4 py-2 rounded font-medium text-sm flex items-center gap-2 transition-colors ${mode === 'INTERFERENCE' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        <GitMerge size={16} /> Interference
                    </button>
                </div>
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
                    <div className="absolute top-4 right-4 text-xs font-mono space-y-1">
                        {mode === 'INTERFERENCE' && (
                            <>
                                <div className="text-sky-400">Wave 1 (Base)</div>
                                <div className="text-emerald-400">Wave 2 (Shifted)</div>
                                <div className="text-white font-bold">Sum Result</div>
                            </>
                        )}
                    </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Shared Controls */}
                    <div className="space-y-4">
                        <div className="space-y-2 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-sky-400">Frequency</label>
                                <span className="text-xs font-mono text-slate-400">{frequency} Hz</span>
                            </div>
                            <input type="range" min="0.5" max="5" step="0.1" value={frequency} onChange={(e) => setFrequency(parseFloat(e.target.value))} className="w-full accent-sky-500" />
                        </div>
                        <div className="space-y-2 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-slate-300">Amplitude</label>
                                <span className="text-xs font-mono text-slate-400">{amplitude} px</span>
                            </div>
                            <input type="range" min="10" max="100" step="1" value={amplitude} onChange={(e) => setAmplitude(parseInt(e.target.value))} className="w-full accent-slate-500" />
                        </div>
                    </div>

                    {/* Phase 1 */}
                    <div className="space-y-2 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 flex flex-col justify-center">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-sky-400">Wave 1 Phase</label>
                            <span className="text-xs font-mono text-slate-400">{phase}°</span>
                        </div>
                        <input type="range" min="0" max="360" value={phase} onChange={(e) => setPhase(parseInt(e.target.value))} className="w-full accent-sky-500 mb-6" />
                        <div className="text-center text-xs text-slate-500">Base Reference</div>
                    </div>

                    {/* Phase 2 (Only in Interference) */}
                    <div className={`space-y-2 p-4 rounded-lg border flex flex-col justify-center transition-all ${mode === 'INTERFERENCE' ? 'bg-slate-800/50 border-emerald-500/50 opacity-100' : 'bg-slate-900 border-slate-800 opacity-30 pointer-events-none'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-emerald-400">Wave 2 Phase</label>
                            <span className="text-xs font-mono text-slate-400">{phase2}°</span>
                        </div>
                        <input type="range" min="0" max="360" value={phase2} onChange={(e) => setPhase2(parseInt(e.target.value))} className="w-full accent-emerald-500 mb-4" />
                        {mode === 'INTERFERENCE' && (
                            <div className="text-center">
                                <span className={`text-xs font-bold px-2 py-1 rounded ${Math.abs(phase - phase2) % 360 < 10 ? 'bg-white text-black' :
                                        Math.abs(phase - phase2) % 360 > 170 && Math.abs(phase - phase2) % 360 < 190 ? 'bg-red-500 text-white' :
                                            'bg-slate-700 text-slate-300'
                                    }`}>
                                    {Math.abs(phase - phase2) % 360 < 10 ? 'CONSTRUCTIVE (+)' :
                                        Math.abs(phase - phase2) % 360 > 170 && Math.abs(phase - phase2) % 360 < 190 ? 'DESTRUCTIVE (-)' :
                                            'INTERFERENCE'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Explanation */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-white mb-2">Phase Difference</h3>
                    <p className="text-sm text-slate-400 mb-4">
                        Phase is measured in degrees. A full cycle is 360°.
                    </p>
                    <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex items-start gap-2">
                            <span className="font-bold text-sky-400">In Phase (0°):</span>
                            <span>Peaks align with peaks. Signals add up (Constructive).</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold text-red-400">Anti-Phase (180°):</span>
                            <span>Peaks align with troughs. Signals cancel out (Destructive).</span>
                        </li>
                    </ul>
                </div>
                <div className="glass-panel p-6 rounded-xl">
                    <h3 className="text-lg font-bold text-white mb-2">Aviation Application</h3>
                    <p className="text-sm text-slate-400 text-justify">
                        Radio navigation systems like <strong className="text-white">VOR</strong> rely entirely on measuring the
                        phase difference between two 30Hz signals to determine your bearing.
                        <br /><br />
                        Sky wave interference (Fading) occurs when ground waves and sky waves arrive at the receiver
                        out of phase, cancelling each other out.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WavePropVisualizer;
