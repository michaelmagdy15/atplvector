import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const DopplerEffect: React.FC = () => {
    const [velocity, setVelocity] = useState(0); // m/s (relative for sim)
    const [isPlaying, setIsPlaying] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);

    // Simulation State
    const sourcePos = useRef({ x: 100, y: 150 });
    const waves = useRef<{ x: number, y: number, r: number, time: number }[]>([]);
    const timeRef = useRef(0);
    const lastWaveTime = useRef(0);

    // Constants
    const WAVE_SPEED = 2; // pixels per frame
    const WAVE_FREQ = 20; // frames between waves
    const MAX_WIDTH = 800;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const render = () => {
            if (!isPlaying) return;

            const width = canvas.width;
            const height = canvas.height;
            ctx.clearRect(0, 0, width, height);

            timeRef.current++;

            // Update Source Position
            // Velocity 0-100 maps to 0-3 px/frame
            const speedPx = (velocity / 100) * 1.5;
            sourcePos.current.x += speedPx;

            // Loop source
            if (sourcePos.current.x > width + 50) {
                sourcePos.current.x = -50;
                waves.current = []; // Clear waves on loop
            }

            // Emit Waves
            if (timeRef.current - lastWaveTime.current > WAVE_FREQ) {
                waves.current.push({
                    x: sourcePos.current.x,
                    y: sourcePos.current.y,
                    r: 0,
                    time: timeRef.current
                });
                lastWaveTime.current = timeRef.current;
            }

            // Draw Receiver (Observer)
            const rxX = width - 100;
            const rxY = height / 2;

            // Draw Receiver
            ctx.fillStyle = '#10b981'; // emerald-500
            ctx.beginPath();
            ctx.arc(rxX, rxY, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.font = '12px sans-serif';
            ctx.fillText("Observer", rxX - 20, rxY + 25);

            // Draw Source (Aircraft)
            ctx.fillStyle = '#38bdf8'; // sky-400
            // Simple triangle for plane
            ctx.beginPath();
            ctx.moveTo(sourcePos.current.x + 15, sourcePos.current.y);
            ctx.lineTo(sourcePos.current.x - 10, sourcePos.current.y - 10);
            ctx.lineTo(sourcePos.current.x - 10, sourcePos.current.y + 10);
            ctx.fill();

            // Draw Velocity Vector
            if (velocity > 0) {
                ctx.strokeStyle = '#f59e0b'; // amber
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(sourcePos.current.x + 15, sourcePos.current.y);
                ctx.lineTo(sourcePos.current.x + 15 + (velocity * 0.5), sourcePos.current.y);
                ctx.stroke();
            }

            // Update and Draw Waves
            ctx.lineWidth = 2;

            // Filter out old waves
            waves.current = waves.current.filter(w => w.r < width);

            waves.current.forEach(wave => {
                wave.r += WAVE_SPEED; // Expand

                // Color shift based on compression?
                // Actually Doppler is about frequency change, visually shown by wave spacing.
                // Waves ahead are compressed (closer), behind are expanded (further).
                // Since we emit at fixed time intervals (WAVE_FREQ) but moving source,
                // the spacing naturally handles itself!

                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.beginPath();
                ctx.arc(wave.x, wave.y, wave.r, 0, Math.PI * 2);
                ctx.stroke();
            });

            animationRef.current = requestAnimationFrame(render);
        };

        if (isPlaying) {
            animationRef.current = requestAnimationFrame(render);
        }

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying, velocity]);

    // Derived Math
    // f' = f (v / v - vs) for source moving towards
    const baseFreq = 1000;
    const vSound = 340; // m/s
    // map slider 0-100 to 0-340 m/s (Mach 1) for dramatic effect
    const vSource = (velocity / 100) * 340;

    // Calculate observed freq when approaching
    const fObserved = Math.round(baseFreq * (vSound / (vSound - vSource)));

    // Wavelength
    const lambdaBase = vSound / baseFreq;
    const lambdaObserved = vSound / fObserved;

    return (
        <div className="flex flex-col gap-6">
            <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-xl">
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={300}
                    className="w-full h-full object-contain bg-slate-950"
                />

                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="bg-black/60 backdrop-blur px-4 py-2 rounded-lg border border-white/10">
                        <div className="text-xs text-slate-400">Source Velocity</div>
                        <div className="text-xl font-mono text-sky-400">{Math.round(vSource)} m/s</div>
                    </div>

                    <div className="bg-black/60 backdrop-blur px-4 py-2 rounded-lg border border-white/10 text-right">
                        <div className="text-xs text-slate-400">Observed Frequency (Approaching)</div>
                        <div className={`text-xl font-mono ${fObserved > baseFreq ? 'text-emerald-400' : 'text-slate-300'}`}>
                            {vSource >= vSound ? '∞ (Sonic Boom)' : `${fObserved} Hz`}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5 space-y-6">

                {/* Controls */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full text-white transition-colors"
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>

                    <button
                        onClick={() => {
                            sourcePos.current = { x: 50, y: 150 };
                            waves.current = [];
                        }}
                        className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full text-white transition-colors"
                    >
                        <RotateCcw size={20} />
                    </button>

                    <div className="flex-1 space-y-2">
                        <label className="flex justify-between text-sm font-medium text-slate-300">
                            <span>Source Speed</span>
                            <span>{velocity}% (Mach {(vSource / 340).toFixed(2)})</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="95" // Don't allow full Mach 1 to avoid divide by zero visual chaos in valid range
                            value={velocity}
                            onChange={(e) => setVelocity(parseInt(e.target.value))}
                            className="w-full accent-sky-500"
                        />
                    </div>
                </div>

                {/* Formula Viz */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                        <h4 className="text-sm font-bold text-slate-400 mb-2">The Formula</h4>
                        <div className="font-serif text-xl text-center py-2 text-white">
                            f' = f  <span className="text-2xl mx-1">(</span>
                            <div className="inline-block text-center align-middle text-sm mx-1">
                                <div className="border-b border-white/20 pb-1">v</div>
                                <div className="pt-1">v ± v<sub className="text-[10px]">s</sub></div>
                            </div>
                            <span className="text-2xl mx-1">)</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 text-center">
                            When approaching: subtract Source Velocity (vs) from Wave Speed (v).
                        </p>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-lg">
                        <h4 className="text-sm font-bold text-slate-400 mb-2">Aviation Impact</h4>
                        <ul className="text-sm text-slate-300 space-y-2 list-disc pl-4">
                            <li>Affects <strong className="text-white">VOR/DVOR</strong> phase comparison.</li>
                            <li>Used in <strong className="text-white">Ground Speed</strong> measurement.</li>
                            <li>Critical for <strong className="text-white">Search & Rescue</strong> homing.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DopplerEffect;
