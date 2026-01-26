
import React from 'react';
import { Wind, Waves, AlertTriangle } from 'lucide-react';

const Turbulence: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Mountain Wave */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Waves className="text-blue-400" /> Mountain Waves
                    </h3>

                    <div className="relative h-64 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden mb-6">
                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                            {/* Mountain */}
                            <path d="M50,256 L150,100 L250,256" fill="#334155" stroke="none" />

                            {/* Wind Flow */}
                            <path d="M0,50 Q150,50 150,50 T300,100 T450,50 T600,100" fill="none" stroke="#60a5fa" strokeWidth="4" strokeDasharray="10 5" className="animate-pulse" />
                            <path d="M0,80 Q150,80 150,80 T300,130 T450,80 T600,130" fill="none" stroke="#60a5fa" strokeWidth="3" opacity="0.6" />

                            {/* Rotor */}
                            <circle cx="280" cy="200" r="30" stroke="#f87171" strokeWidth="2" strokeDasharray="4 4" fill="none" className="animate-spin-slow" />

                            {/* Lenticular Cloud */}
                            <ellipse cx="300" cy="80" rx="60" ry="10" fill="white" opacity="0.8" />
                            <ellipse cx="450" cy="60" rx="50" ry="8" fill="white" opacity="0.6" />
                        </svg>

                        <div className="absolute bottom-2 left-2 text-xs text-slate-500">Cross-section view</div>
                        <div className="absolute top-1/2 left-[45%] text-xs font-bold text-red-400 bg-black/50 px-1 rounded">Rotor Zone</div>
                    </div>

                    <ul className="space-y-2 text-sm text-slate-300">
                        <li className="flex gap-2">
                            <span className="font-bold text-blue-400">• Conditions:</span>
                            Stable air, wind &gt; 20kt blowing perpendicular to ridge.
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold text-white">• Lenticular Clouds:</span>
                            Stationary lens-shaped clouds at crests. Sign of severe turbulence.
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold text-red-400">• Danger:</span>
                            Downdrafts can exceed climb capability. Rotor clouds indicate extreme turbulence.
                        </li>
                    </ul>
                </div>

                {/* Windshear & CAT */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Wind className="text-slate-400" /> Clear Air Turbulence (CAT)
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed mb-4">
                            High-level turbulence not associated with convective clouds. Usually found near the <strong className="text-white">Jet Stream</strong>.
                        </p>
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <div className="text-xs font-bold text-slate-500 uppercase mb-2">Location</div>
                            <div className="text-white text-sm">
                                Found on the <span className="text-red-400 font-bold">Cold Side</span> of the jet stream core.
                                Most severe near the tropopause break.
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <AlertTriangle className="text-yellow-500" /> Windshear
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            A sudden change in wind speed and/or direction covering a short distance.
                            <br /><br />
                            <strong>Causes:</strong> Inversions, Thunderstorms (Microbursts), Frontal passages, Surface friction.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Turbulence;
