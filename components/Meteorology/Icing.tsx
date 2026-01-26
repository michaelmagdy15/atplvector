
import React from 'react';
import { Snowflake, Droplets, Thermometer, AlertTriangle } from 'lucide-react';

const Icing: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Induction vs Structural */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Snowflake className="text-cyan-400" /> Structural Icing
                        </h3>
                        <div className="space-y-4">
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 cursor-pointer hover:border-cyan-500 transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-white group-hover:text-cyan-400">Clear Ice (Glaze)</h4>
                                    <span className="px-2 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold rounded">Most Dangerous</span>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed mb-3">
                                    Large Supercooled Water Droplets (SCWD) hit the leading edge and flow back before freezing.
                                    Transparent, heavy, and hard to remove. Alters airfoil shape significantly.
                                </p>
                                <div className="text-xs text-slate-500 font-mono">Temp: 0°C to -10°C | Clouds: CB/Nimbostratus</div>
                            </div>

                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 cursor-pointer hover:border-white transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-white group-hover:text-white">Rime Ice</h4>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed mb-3">
                                    Small droplets freeze instantly upon impact, trapping air. Opaque, milky white, brittle.
                                    Easier to remove (de-icing boots). Forms on leading edge point.
                                </p>
                                <div className="text-xs text-slate-500 font-mono">Temp: -10°C to -20°C | Clouds: Stratiform</div>
                            </div>

                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 cursor-pointer hover:border-white transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-white group-hover:text-white">Hoar Frost</h4>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed mb-3">
                                    Deposition of water vapor into ice crystals on a cold surface (Sublimation).
                                    Occurs in clear air when aircraft skin temp &lt; 0°C (e.g., descent from cold altitude into warm moist air).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Intensity & Hazards */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <AlertTriangle className="text-yellow-400" /> Hazards & Intensity
                        </h3>

                        <div className="space-y-2 mb-6">
                            <IntensityRow label="Trace" desc="Perceptible. Not hazardous unless encountered for > 1h." color="text-slate-400" />
                            <IntensityRow label="Light" desc="Accumulation may create a problem if flight > 1h. Occasional use of de-ice." color="text-blue-300" />
                            <IntensityRow label="Moderate" desc="Short encounters potentially hazardous. Use of de-icing equipment is necessary." color="text-orange-400" />
                            <IntensityRow label="Severe" desc="Rate of accumulation exceeds de-icing capability. Immediate diversion." color="text-red-500" />
                        </div>

                        <div className="bg-slate-800/50 p-4 rounded-xl border-l-4 border-red-500">
                            <h4 className="font-bold text-white text-sm mb-2">Aerodynamic Penalties</h4>
                            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                                <li>Lift reduced by up to 30%</li>
                                <li>Drag increased by up to 40%</li>
                                <li>Stall speed INCREASED</li>
                                <li>Critical Angle of Attack DECREASED</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                        <h4 className="text-sm font-bold text-slate-400 uppercase mb-3">Induction Icing (Carb Icing)</h4>
                        <p className="text-xs text-slate-300 mb-4">
                            Can occur at temperatures as high as +30°C due to fuel vaporization and Venturi effect cooling (drop of 20-30°C).
                            Most likely between +10°C and +25°C with high humidity.
                        </p>
                        <div className="w-full h-2 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded-full opacity-50"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const IntensityRow = ({ label, desc, color }: { label: string, desc: string, color: string }) => (
    <div className="flex gap-4 p-3 bg-slate-950 rounded-lg border border-slate-800/50">
        <span className={`font-bold w-20 ${color}`}>{label}</span>
        <span className="text-xs text-slate-400">{desc}</span>
    </div>
);

export default Icing;
