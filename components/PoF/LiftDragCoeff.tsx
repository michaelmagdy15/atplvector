import React, { useState } from 'react';
import { TrendingUp, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const LiftDragCoeff: React.FC = () => {
    const [camber, setCamber] = useState<'symmetrical' | 'cambered'>('cambered');
    const [aspectRatio, setAspectRatio] = useState(10);

    // Generate data
    const data = [];
    const maxAlpha = 20;
    const minAlpha = -5;

    const stallAngle = 14 + (aspectRatio > 15 ? 2 : 0); // AR effects stall slightly
    const clMax = camber === 'cambered' ? 1.6 : 1.2;
    const zeroLiftAlpha = camber === 'cambered' ? -4 : 0;

    for (let a = minAlpha; a <= maxAlpha; a++) {
        let cl = 0;
        let cd = 0;

        // Linear region
        if (a <= stallAngle) {
            const slope = 0.11; // approx 2pi per radian -> 0.11 per degree
            cl = slope * (a - zeroLiftAlpha);
        } else {
            // Post stall
            const peak = 0.11 * (stallAngle - zeroLiftAlpha);
            cl = peak - 0.08 * (a - stallAngle); // Drop off
        }

        // Drag Polar: Cd = Cd0 + k * Cl^2
        const cd0 = 0.02;
        const e = 0.8; // Oswald efficiency
        const k = 1 / (Math.PI * e * aspectRatio);
        cd = cd0 + k * Math.pow(cl, 2);

        // Stall penalty on drag
        if (a > stallAngle) {
            cd += 0.05 * (a - stallAngle);
        }

        data.push({
            alpha: a,
            cl: cl < 0 && a > stallAngle ? 0.1 : cl, // clamp for visuals
            cd: cd
        });
    }

    return (
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="text-red-400" /> Coefficients: Lift & Drag
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* CL Alpha Graph */}
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-600">
                    <h3 className="text-center text-white font-semibold mb-4">CL vs Alpha (α)</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis
                                    dataKey="alpha"
                                    stroke="#94a3b8"
                                    label={{ value: 'Angle of Attack (°)', position: 'bottom', fill: '#94a3b8' }}
                                />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <ReferenceLine x={stallAngle} stroke="red" strokeDasharray="3 3" label={{ value: 'Stall', fill: 'red', fontSize: 12 }} />
                                <Line type="monotone" dataKey="cl" stroke="#34d399" strokeWidth={3} dot={false} name="CL" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Drag Polar CL-CD (Approximated by showing CD vs Alpha for clarity first, or actual polar?) 
                    Lets show Drag vs Alpha to compare with Lift. Or Polar is specifically requested in syllabus 081 01 04 12
                    "Describe the CL-CD (aeroplane polar)"
                    Let's do Polar (CL vs CD)
                */}
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-600">
                    <h3 className="text-center text-white font-semibold mb-4">Drag Polar (CL vs CD)</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis
                                    dataKey="cd"
                                    type="number"
                                    domain={[0, 'auto']}
                                    stroke="#94a3b8"
                                    label={{ value: 'Drag Coeff (CD)', position: 'bottom', fill: '#94a3b8' }}
                                />
                                <YAxis
                                    dataKey="cl"
                                    stroke="#94a3b8"
                                    label={{ value: 'Lift Coeff (CL)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }}
                                    itemStyle={{ color: '#fff' }}
                                    labelFormatter={(val) => `CD: ${Number(val).toFixed(4)}`} // Recharts quirk with scatter/line mixture
                                />
                                <Line type="monotone" dataKey="cl" data={data} stroke="#60a5fa" strokeWidth={3} dot={false} name="Polar" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="text-slate-400 text-sm block mb-2">Aerofoil Type</label>
                    <div className="flex bg-slate-800 p-1 rounded-lg">
                        <button
                            onClick={() => setCamber('cambered')}
                            className={`flex-1 py-1 px-3 rounded text-sm transition-all ${camber === 'cambered' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            Cambered
                        </button>
                        <button
                            onClick={() => setCamber('symmetrical')}
                            className={`flex-1 py-1 px-3 rounded text-sm transition-all ${camber === 'symmetrical' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            Symmetrical
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        Notice Symmetrical aerofoils generate 0 lift at 0° AoA.
                    </p>
                </div>

                <div>
                    <label className="text-slate-400 text-sm block mb-2 flex justify-between">
                        <span>Aspect Ratio (Effect on Induced Drag)</span>
                        <span className="text-white font-mono">{aspectRatio}</span>
                    </label>
                    <input
                        type="range" min="4" max="25" step="1"
                        value={aspectRatio}
                        onChange={e => setAspectRatio(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                        Higher AR reduces Induced Drag, shifting the Polar to the left (more efficient).
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LiftDragCoeff;
