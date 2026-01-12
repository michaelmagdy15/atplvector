import React, { useState, useEffect, useRef } from 'react';
import { View } from '../../types';
import { ArrowLeft, Radar, Activity } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const RadarTheory: React.FC<Props> = ({ onNavigate }) => {
    // Radar Parameters
    const [prf, setPrf] = useState(100); // Pulse Repetition Frequency (Hz) (Scaled: 100-1000)
    const [pulseWidth, setPulseWidth] = useState(2); // Microseconds (Scaled: 1-10)

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const timeRef = useRef(0);

    // Theory Calculations
    const c_NM = 161987; // Speed of light in NM/s
    // Max Range (NM) = c / (2 * PRF)
    const maxRange = Math.round(c_NM / (2 * prf));

    // Min Range (Blind Spot) = (c * PW) / 2
    // PW in microseconds. c in NM/s. 
    // c per microsecond = 0.162 NM/us roughly
    const c_us = 0.161987;
    const minRange = (c_us * pulseWidth) / 2;

    // Simulation State
    const [echoes, setEchoes] = useState<{ dist: number, strength: number }[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const render = () => {
            const width = canvas.width;
            const height = canvas.height;

            ctx.fillStyle = '#0f172a'; // Slate 900
            ctx.fillRect(0, 0, width, height);

            timeRef.current += 1;

            // Draw Timeline Trace (A-Scope)
            const centerY = height / 2;
            const scaleX = width / 1000; // 1000 pixels = 1 PRI roughly? 

            // Trigger every PRI frames
            // Simulate PRF: higher PRF = shorter Interval (PRI)
            // Let's base it on frames.
            // PRI_frames = 10000 / prf;
            const priFrames = Math.max(20, Math.floor(20000 / prf));

            const beamX = (timeRef.current % priFrames) * (width / priFrames);

            // Draw scale
            ctx.strokeStyle = '#334155';
            ctx.beginPath();
            ctx.moveTo(0, centerY);
            ctx.lineTo(width, centerY);
            ctx.stroke();

            // Draw Transmitted Pulse (Tx) at start of cycle
            // Width of Tx = Pulse Width scaled
            const drawPulse = (x: number, h: number, w: number, color: string) => {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.moveTo(x, centerY);
                ctx.lineTo(x, centerY - h);
                ctx.lineTo(x + w, centerY - h);
                ctx.lineTo(x + w, centerY);
                ctx.fill();
            };

            // Main Tx Pulse always at x=0 of the cycle logic
            // But we want to show moving scan? A-Scope shows amplitude vs time.
            // Let's emulate an oscilloscope sweep.

            // Draw trace history? No, live sweep.
            // Sweep moves Left to Right.
            // x = (time % PRI)

            // Tx Pulse at Start (0)
            const pxPerUs = width / (priFrames); // Very rough, let's just make it visual
            const pwWidth = pulseWidth * 5; // Visual scaling

            drawPulse(beamX, 100, pwWidth, '#f43f5e'); // Red Tx

            // Draw Echoes
            // Echo at 50% max range
            const echoDist = beamX - (width * 0.5);
            // If beam passes echo point?
            // Static Echo logic:
            // Echo exists at fixed "time" T after Tx.
            const targetT = width * 0.6; // Target at 60% of range

            drawPulse(0, 100, pwWidth, '#f43f5e'); // Always Tx at 0 on scope?

            // Correct A-Scope:
            // X-axis is Time (Distance). Y-axis is Altitude.
            // Always show Tx at 0.
            // Show Echo at T_echo.
            // If PRF is too high, Echo might appear on NEXT sweep (Second Time Around Return).
            // That's advanced.

            // Let's just draw static A-Scope Diagram reacting to params
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, width, height);

            // Grid
            ctx.strokeStyle = '#1e293b';
            for (let i = 0; i < width; i += 50) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
            }

            // Axis
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(0, centerY); ctx.lineTo(width, centerY); ctx.stroke();

            // 1. Tx Pulse (Fixed at 0)
            const txW = pulseWidth * 4;
            ctx.fillStyle = '#f43f5e'; // Rose-500
            ctx.fillRect(20, centerY - 80, txW, 80);
            ctx.font = '12px sans-serif';
            ctx.fillText("Tx Pulse", 20, centerY - 90);

            // 2. Target Echo (Fixed Distance for Demo)
            // Let's place a target at 300px (Scaled NM)
            const targetPx = 300;
            // Draw Echo
            ctx.fillStyle = '#34d399'; // Emerald-400
            ctx.fillRect(20 + targetPx, centerY - 40, txW * 1.5, 40); // Wider, weaker
            ctx.fillText("Target Echo", 20 + targetPx, centerY - 50);

            // 3. PRI Visual (Distance to next Pulse)
            // PRI pixel width scales inversely with PRF
            // Max PRF 1000 = Min PRI. Min PRF 100 = Max PRI.
            // Let's say Width = 800px represents Max Range at Max PRF?
            // Actually: Range = c / 2*PRF. 
            // Lower PRF = Longer Range.
            // If we keep Scale (Pixels per NM) constant:
            // Lower PRF -> Next pulse is further right (offscreen maybe).
            // Higher PRF -> Next pulse is closer (left).

            // Let's keep Scope Window = Time = PRI.
            // So Width = PRI.
            // Lower PRF = Longer PRI = More Time shown. 
            // So a fixed target (at fixed range/time) appears "closer" to the left (proportionally less of the total time).
            // Wait: Range = Time * c / 2. Target Time is constant.
            // PRI increases (Lower PRF). Total Time Axis increases.
            // Target Px position = (TargetTime / PRI_Time) * Width.
            // TargetTime is constant. PRI_Time increases. Ratio decreases. Target moves left.
            // Correct.

            const targetTime = 500; // Arbitrary units
            const priTime = 200000 / prf; // Inverse PRF

            const targetX = (targetTime / priTime) * (width - 40) + 20;

            if (targetX < width) {
                ctx.fillStyle = '#34d399';
                ctx.fillRect(targetX, centerY - 40, txW + 5, 40);
                ctx.fillStyle = '#fff';
                ctx.fillText("Echo", targetX, centerY - 50);
            }

            // Pulse Width Visualization
            // Tx Pulse width changes directly with pw state
            ctx.fillStyle = '#f43f5e';
            ctx.fillRect(20, centerY - 80, pulseWidth * 10, 80); // Visual scale

            // Blind Spot (Min Range)
            // Area blocked by Pulse Width
            ctx.fillStyle = 'rgba(244, 63, 94, 0.2)';
            ctx.fillRect(20, centerY, pulseWidth * 10, 20);
            ctx.font = '10px sans-serif';
            ctx.fillText(`Blind Spot: ${minRange.toFixed(2)} NM`, 20, centerY + 30);

            animationRef.current = requestAnimationFrame(render);
        };

        render();
        return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
    }, [prf, pulseWidth]);

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => onNavigate?.(View.RAD_NAV_HOME)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                    <Radar className="text-rose-500" />
                    <h1 className="text-2xl font-bold text-slate-100">Primary Radar Theory</h1>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Scope */}
                <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-700 p-4 shadow-xl">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xs font-bold text-slate-400 uppercase">A-Scope (Amplitude vs Time)</h2>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Activity size={14} /> Live Trace
                        </div>
                    </div>
                    <canvas
                        ref={canvasRef}
                        width={600}
                        height={300}
                        className="w-full h-full bg-slate-950 rounded border border-slate-800"
                    />
                </div>

                {/* Controls */}
                <div className="space-y-6">

                    {/* PRF Control */}
                    <div className="glass-panel p-6 rounded-xl space-y-4">
                        <label className="text-xs font-bold text-slate-400 uppercase block mb-1">
                            Pulse Repetition Frequency (PRF)
                        </label>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-2xl font-mono text-white">{prf} <span className="text-sm text-slate-500">Hz</span></span>
                            <span className="text-xs text-rose-400">Affects Max Range</span>
                        </div>
                        <input
                            type="range" min="100" max="1000" step="50"
                            value={prf}
                            onChange={(e) => setPrf(parseInt(e.target.value))}
                            className="w-full accent-rose-500"
                        />
                        <div className="bg-slate-950 p-3 rounded border border-white/5">
                            <span className="text-xs text-slate-500 block">Max Range (Theoretical)</span>
                            <span className="text-lg font-mono text-rose-300">{maxRange.toLocaleString()} NM</span>
                        </div>
                    </div>

                    {/* Pulse Width Control */}
                    <div className="glass-panel p-6 rounded-xl space-y-4">
                        <label className="text-xs font-bold text-slate-400 uppercase block mb-1">
                            Pulse Width (PW)
                        </label>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-2xl font-mono text-white">{pulseWidth} <span className="text-sm text-slate-500">µs</span></span>
                            <span className="text-xs text-rose-400">Affects Min Range</span>
                        </div>
                        <input
                            type="range" min="1" max="10" step="0.5"
                            value={pulseWidth}
                            onChange={(e) => setPulseWidth(parseFloat(e.target.value))}
                            className="w-full accent-rose-500"
                        />
                        <div className="bg-slate-950 p-3 rounded border border-white/5">
                            <span className="text-xs text-slate-500 block">Min Range (Blind Spot)</span>
                            <span className="text-lg font-mono text-rose-300">{minRange.toFixed(2)} NM</span>
                        </div>
                    </div>


                    {/* Formulae */}
                    <div className="p-4 bg-blue-900/20 border border-blue-500/20 rounded-xl text-xs space-y-2 text-blue-200">
                        <p><strong>Max Range:</strong> Rmax = c / (2 × PRF)</p>
                        <p>High PRF = Short Range (pulses overlap).</p>
                        <div className="h-px bg-blue-500/20 my-2"></div>
                        <p><strong>Min Range:</strong> Rmin = (c × PW) / 2</p>
                        <p>Long Pulse = Large Blind Spot (Rx is off while Tx).</p>
                    </div>

                    {/* NEW: Power Law & Beam Width */}
                    <div className="glass-panel p-6 rounded-xl space-y-4 border-t border-rose-500/20">
                        <h3 className="text-sm font-bold text-white mb-2">Radar Range Equation</h3>
                        <div className="text-xs text-slate-400 mb-2">
                            To double the range, you need <strong>16x</strong> the power ($2^4$).
                        </div>
                        {/* Interactive Power Slider */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span>Tx Power</span>
                                <span className="text-rose-400">Range Impact</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 flex-1 bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-rose-500" style={{ width: '25%' }}></div>
                                </div>
                                <span className="text-xs font-mono text-white">x1 Power = x1 Range</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 flex-1 bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-rose-500" style={{ width: '100%' }}></div>
                                </div>
                                <span className="text-xs font-mono text-white">x16 Power = x2 Range</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-xl space-y-4">
                        <h3 className="text-sm font-bold text-white mb-2">Beam Width</h3>
                        <div className="text-xs text-slate-400 mb-2">
                            Beam Width = 70 × (Wavelength / Diameter)
                        </div>
                        <div className="p-3 bg-slate-900 rounded border border-slate-700 space-y-2">
                            <div className="flex justify-between text-xs">
                                <span>Wavelength ($\lambda$)</span>
                                <span className="text-white">3 cm (X-Band)</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span>Dish Diameter</span>
                                <span className="text-white">30 cm (12")</span>
                            </div>
                            <div className="h-px bg-slate-700"></div>
                            <div className="flex justify-between font-bold text-sm text-emerald-400">
                                <span>Beam Width</span>
                                <span>7.0°</span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1">
                                Narrow beam concentrates energy better. Large dish = Narrow beam.
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RadarTheory;
