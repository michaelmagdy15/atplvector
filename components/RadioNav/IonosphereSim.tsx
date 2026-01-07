import React, { useState, useEffect, useRef } from 'react';
import { View } from '../../types';
import { ArrowLeft, Sun, Moon, Zap } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const IonosphereSim: React.FC<Props> = ({ onNavigate }) => {
    const [isDay, setIsDay] = useState(true);
    const [frequency, setFrequency] = useState(10); // MHz (HF Range)
    const [skyWaveSuccess, setSkyWaveSuccess] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Ionosphere Constants
    // Critical frequencies (approximate for demo)
    const CRITICAL_FREQ_D = 0.5; // D layer absorbs low freq
    const CRITICAL_FREQ_E = 3;
    const CRITICAL_FREQ_F = isDay ? 10 : 6;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        // Clear
        ctx.fillStyle = isDay ? '#0f172a' : '#020617'; // Darker blue for night, slighter lighter for day (sky background)
        ctx.fillRect(0, 0, width, height);

        // Draw Earth Surface
        ctx.fillStyle = '#10b981'; // Earth Green
        ctx.fillRect(0, height - 20, width, 20);

        ctx.fillStyle = '#fff';
        ctx.font = '10px sans-serif';
        ctx.fillText("Transmitter (Tx)", 50, height - 25);
        ctx.fillText("Receiver (Rx)", width - 100, height - 25);

        // Draw Transmitter Tower
        ctx.strokeStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(70, height - 20);
        ctx.lineTo(70, height - 50);
        ctx.stroke();

        // Draw Receiver Station (Target)
        ctx.beginPath();
        ctx.moveTo(width - 80, height - 20);
        ctx.lineTo(width - 80, height - 50);
        ctx.stroke();

        // --- DRAW LAYERS ---
        // D Layer (Day only, low, absorptive)
        if (isDay) {
            ctx.fillStyle = 'rgba(239, 68, 68, 0.2)'; // Red tint
            ctx.fillRect(0, height - 100, width, 20);
            ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
            ctx.fillText("D Layer (Absorbs LF/MF)", 10, height - 90);
        }

        // E Layer (Day/Night, lower reflection)
        ctx.fillStyle = 'rgba(234, 179, 8, 0.2)'; // Yellow tint
        ctx.fillRect(0, height - 150, width, 30);
        ctx.fillStyle = 'rgba(234, 179, 8, 0.6)';
        ctx.fillText("E Layer", 10, height - 135);

        // F Layer (Split F1/F2 day, Single F night)
        if (isDay) {
            // F1
            ctx.fillStyle = 'rgba(59, 130, 246, 0.2)'; // Blue tint
            ctx.fillRect(0, height - 200, width, 30);
            ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
            ctx.fillText("F1 Layer", 10, height - 185);

            // F2 (Highest)
            ctx.fillStyle = 'rgba(147, 51, 234, 0.2)'; // Purple tint
            ctx.fillRect(0, height - 250, width, 40);
            ctx.fillStyle = 'rgba(147, 51, 234, 0.6)';
            ctx.fillText("F2 Layer (Strong Refractor)", 10, height - 230);
        } else {
            // F Combined (Night)
            ctx.fillStyle = 'rgba(147, 51, 234, 0.3)'; // Purple tint
            ctx.fillRect(0, height - 230, width, 50);
            ctx.fillStyle = 'rgba(147, 51, 234, 0.8)';
            ctx.fillText("F Layer (Combined)", 10, height - 210);
        }

        // --- RAY TRACING SIMULATION ---
        ctx.beginPath();
        ctx.strokeStyle = '#f472b6'; // Path color
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        let hitRx = false;

        // Start from Tx
        ctx.moveTo(70, height - 50);

        // D Layer Check
        if (isDay && frequency < 3) {
            // Absorbed by D Layer if freq is low (e.g., MF/LF)
            ctx.lineTo(150, height - 100);
            ctx.stroke();
            ctx.fillStyle = '#ef4444';
            ctx.fillText("SIGNAL ABSORBED BY D-LAYER", 160, height - 100);
            hitRx = false;
        }
        else {
            // Passes D layer, attempts to reflect off higher layers

            // Simplified Physics:
            // High Freq = Penetrates deeper or escapes space
            // Low Freq (but > D loss) = Refracts sooner

            let refractionHeight = 0;
            let success = false;
            let skipDist = 0;

            // Determine Refraction Layer
            if (frequency < 10) {
                // Refracts off E or lower F
                refractionHeight = height - 135; // E layer approx
                success = true;
                skipDist = 200; // Short skip
            } else if (frequency < 30) {
                // Refracts off F
                refractionHeight = isDay ? height - 230 : height - 210;
                success = true;
                skipDist = 500; // Long skip
            } else {
                // Too high freq (VHF/UHF), Space wave
                refractionHeight = -50; // Off screen (Space)
                success = false;
            }

            if (success) {
                // Draw path to ionosphere
                const apexX = 70 + (skipDist / 2);
                ctx.lineTo(apexX, refractionHeight);

                // Draw return to Earth
                const landX = 70 + skipDist;
                ctx.lineTo(landX, height - 20);

                // Check if it lands near Rx (simple range check)
                // Rx is at width - 80.
                // We allow the user to visualize where it lands relative to 'Ideal Rx'

                // Render "Skip Distance" marker
                ctx.fillStyle = '#fff';
                ctx.fillText(`Skip Distance: ${skipDist}km (Sim)`, 70 + (skipDist / 2) - 40, height - 30);

                // Bounce? (Multi-hop) - Just draw one hop for clarity
            } else {
                // Space Wave (Penetrates)
                ctx.lineTo(width / 2, 0);
                ctx.fillStyle = '#94a3b8';
                ctx.fillText("SIGNAL ESCAPES TO SPACE (VHF+)", width / 2 + 10, 50);
            }

            ctx.stroke();
        }

    }, [isDay, frequency]);

    return (
        <div className="max-w-5xl mx-auto p-4 space-y-6">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => onNavigate?.(View.RAD_NAV_HOME)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-slate-100">Ionospheric Propagation (Sky Wave)</h1>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">

                {/* Visualizer Canvas */}
                <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden relative shadow-2xl">
                    <div className="absolute top-4 right-4 flex gap-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${isDay ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-900/40 text-blue-300'}`}>
                            {isDay ? <Sun size={14} /> : <Moon size={14} />}
                            {isDay ? 'DAYTIME' : 'NIGHTTIME'}
                        </div>
                    </div>

                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={400}
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Controls */}
                <div className="space-y-6">

                    {/* Time of Day Toggle */}
                    <div className="glass-panel p-6 rounded-xl space-y-4">
                        <label className="text-sm font-bold text-slate-300 block">Atmospheric Conditions</label>
                        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-lg">
                            <button
                                onClick={() => setIsDay(true)}
                                className={`flex items-center justify-center gap-2 py-2 rounded-md text-sm font-bold transition-all ${isDay ? 'bg-yellow-500 text-black shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <Sun size={16} /> Day
                            </button>
                            <button
                                onClick={() => setIsDay(false)}
                                className={`flex items-center justify-center gap-2 py-2 rounded-md text-sm font-bold transition-all ${!isDay ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                <Moon size={16} /> Night
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            {isDay
                                ? "Daytime: Sun ionizes D, E, F1, F2 layers. D-layer absorbs low frequencies. F-layers are distinct."
                                : "Nighttime: Sun sets. D and E layers dissipate. F1 and F2 merge into a single F layer. Low frequency absorption decreases."}
                        </p>
                    </div>

                    {/* Frequency Slider */}
                    <div className="glass-panel p-6 rounded-xl space-y-4">
                        <label className="text-sm font-bold text-slate-300 flex justify-between">
                            <span>Signal Frequency</span>
                            <span className="text-sky-400 font-mono">{frequency} MHz</span>
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="50"
                            step="1"
                            value={frequency}
                            onChange={(e) => setFrequency(parseInt(e.target.value))}
                            className="w-full accent-emerald-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono uppercase">
                            <span>MF (1)</span>
                            <span>HF (3-30)</span>
                            <span>VHF (30+)</span>
                        </div>

                        <div className="bg-slate-950/50 p-3 rounded-lg border border-white/5">
                            <p className="text-xs text-slate-300">
                                {frequency < 3 && <span className="text-red-400 font-bold block mb-1">High Attenuation</span>}
                                {frequency >= 3 && frequency <= 30 && <span className="text-green-400 font-bold block mb-1">Sky Wave Range</span>}
                                {frequency > 30 && <span className="text-blue-400 font-bold block mb-1">Line of Sight Only</span>}

                                {frequency < 3 && "Low frequencies (MF) are heavily absorbed by the D-layer during the day."}
                                {frequency >= 3 && frequency <= 30 && "High Frequencies (HF) refract off the ionosphere, allowing long-range Over-The-Horizon communication."}
                                {frequency > 30 && "VHF/UHF frequencies have too much energy to refract; they penetrate the ionosphere into space."}
                            </p>
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-white/10 p-5 rounded-xl">
                        <div className="flex items-start gap-3">
                            <Zap className="text-yellow-400 shrink-0 mt-1" size={18} />
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">Skip Distance</h4>
                                <p className="text-xs text-slate-400">
                                    The distance along the Earth's surface between the transmitter and the first point where the refracted wave returns. Between the transmitter and this point is the "Dead Zone".
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default IonosphereSim;
