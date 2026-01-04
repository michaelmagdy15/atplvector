import React, { useState } from 'react';
import { Wind, Activity, Brain } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const HPLRespiration: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'volumes' | 'exchange' | 'control'>('volumes');

    return (
        <div className="space-y-6">
            <header className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <Wind className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100">Respiration & Gas Exchange</h1>
                </div>
                <p className="text-slate-400">
                    Understanding lung volumes, alveolar gas exchange, and the control of breathing is vital for understanding hypoxia mechanisms.
                </p>
            </header>

            <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg">
                <TabButton
                    active={activeTab === 'volumes'}
                    onClick={() => setActiveTab('volumes')}
                    icon={Activity}
                    label="Lung Volumes"
                />
                <TabButton
                    active={activeTab === 'exchange'}
                    onClick={() => setActiveTab('exchange')}
                    icon={Wind}
                    label="Gas Exchange"
                />
                <TabButton
                    active={activeTab === 'control'}
                    onClick={() => setActiveTab('control')}
                    icon={Brain}
                    label="Control Mechanism"
                />
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 min-h-[400px]">
                {activeTab === 'volumes' && <LungVolumesSim />}
                {activeTab === 'exchange' && <GasExchangeSim />}
                {activeTab === 'control' && <RespirationControl />}
            </div>
        </div>
    );
};

// --- Sub-components ---

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md transition-all font-medium ${active
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
    >
        <Icon size={18} />
        {label}
    </button>
);

const LungVolumesSim = () => {
    // Simulated spirometry data
    const data = [
        { time: 0, vol: 2500 }, { time: 1, vol: 3000 }, { time: 2, vol: 2500 }, // Tidal
        { time: 3, vol: 3000 }, { time: 4, vol: 2500 }, // Tidal
        { time: 5, vol: 5800 }, // IRV peak
        { time: 7, vol: 2500 }, // Return
        { time: 8, vol: 1200 }, // ERV bottom (Residual starts at 1200)
        { time: 10, vol: 2500 }, // Return
        { time: 11, vol: 3000 }, { time: 12, vol: 2500 }, // Tidal
    ];

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Spirometry & Volumes</h3>
                    <div className="h-64 w-full bg-slate-900/50 rounded-lg p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" hide />
                                <YAxis domain={[0, 6000]} hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
                                    formatter={(value: any) => [`${value} ml`, 'Volume']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="vol"
                                    stroke="#10b981"
                                    fillOpacity={1}
                                    fill="url(#colorVol)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="space-y-4">
                    <VolumeCard
                        title="Tidal Volume (TV)"
                        val="~500 ml"
                        desc="Volume of air inhaled or exhaled in a normal breath."
                        color="bg-emerald-500/10 border-emerald-500/30"
                    />
                    <VolumeCard
                        title="Inspiratory Reserve (IRV)"
                        val="~3000 ml"
                        desc="Max volume that can be inhaled after a normal inhalation."
                        color="bg-blue-500/10 border-blue-500/30"
                    />
                    <VolumeCard
                        title="Expiratory Reserve (ERV)"
                        val="~1100 ml"
                        desc="Max volume that can be exhaled after a normal exhalation."
                        color="bg-sky-500/10 border-sky-500/30"
                    />
                    <VolumeCard
                        title="Residual Volume (RV)"
                        val="~1200 ml"
                        desc="Volume remaining in lungs after max exhalation. Keeps alveoli open."
                        color="bg-indigo-500/10 border-indigo-500/30"
                    />
                </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg text-sm text-slate-300">
                <strong className="text-white">Vital Capacity (VC)</strong> = IRV + TV + ERV. This is the max air you can move (~4.6L).
                <br />
                <strong className="text-white">Total Lung Capacity (TLC)</strong> = VC + RV (~5.8L).
            </div>
        </div>
    );
};

const VolumeCard = ({ title, val, desc, color }: any) => (
    <div className={`p-4 rounded-lg border ${color}`}>
        <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-slate-200">{title}</span>
            <span className="text-sm font-mono bg-slate-900 px-2 py-1 rounded text-slate-400">{val}</span>
        </div>
        <p className="text-xs text-slate-400">{desc}</p>
    </div>
);

const GasExchangeSim = () => {
    return (
        <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Alveolar Gas Exchange</h3>
                <p className="text-slate-300">
                    Exchange occurs via <span className="text-emerald-400 font-bold">Diffusion</span>. Gases move from an area of high pressure to low pressure across the alveolar-capillary membrane.
                </p>

                <div className="bg-slate-900 p-6 rounded-xl relative overflow-hidden">
                    {/* Abstract visual of Alveolus */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-slate-900 to-slate-900"></div>

                    <div className="relative z-10 grid grid-cols-2 gap-8 text-center">
                        <div className="bg-blue-500/20 p-4 rounded-full border-2 border-blue-500/50 h-32 w-32 flex flex-col items-center justify-center mx-auto">
                            <span className="text-xs text-blue-300 uppercase font-bold">Alveolus</span>
                            <div className="font-bold text-white text-lg mt-1">PO2: 103</div>
                            <div className="font-bold text-slate-400 text-sm">PCO2: 40</div>
                        </div>

                        <div className="flex flex-col justify-center items-center text-slate-500">
                            <div className="animate-pulse">➨ O2 diffuses in</div>
                            <div className="h-px w-full bg-slate-700 my-2"></div>
                            <div className="animate-pulse delay-75">CO2 diffuses out ➨</div>
                        </div>
                    </div>

                    <div className="relative z-10 mt-8">
                        <div className="bg-red-900/40 p-3 rounded-lg border border-red-500/30 flex justify-between items-center max-w-md mx-auto">
                            <span className="text-red-300 font-bold">Venous Blood</span>
                            <div className="text-right text-xs text-slate-400">
                                <div>PO2: 40 mmHg (Low)</div>
                                <div>PCO2: 46 mmHg (High)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-700/30 p-6 rounded-xl border border-slate-700">
                <h4 className="font-bold text-emerald-400 mb-4">Factors Affecting Diffusion</h4>
                <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></div>
                        <span><strong>Pressure Gradient:</strong> The steeper the difference, the faster the diffusion. Hypoxia entails a lower gradient.</span>
                    </li>
                    <li className="flex gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></div>
                        <span><strong>Surface Area:</strong> Emphysema reduces surface area, impairing exchange.</span>
                    </li>
                    <li className="flex gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></div>
                        <span><strong>Thickness:</strong> Pneumonia/Edema thickens the membrane, slowing diffusion.</span>
                    </li>
                    <li className="flex gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></div>
                        <span><strong>Time:</strong> Blood needs ~0.25s to oxygenate. At high heart rates (exercise), time is reduced but still sufficient in healthy lungs.</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

const RespirationControl = () => {
    return (
        <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 bg-indigo-900/20 border border-indigo-500/30 rounded-xl">
                    <h3 className="text-lg font-bold text-indigo-300 mb-2">Central Chemoreceptors</h3>
                    <p className="text-sm text-slate-400 mb-4">Located in the Medulla Oblongata (Brain Stem).</p>

                    <div className="space-y-2">
                        <div className="flex justify-between bg-black/20 p-2 rounded px-3">
                            <span className="text-slate-300">Primary Stimulus</span>
                            <span className="text-white font-bold">CO2 Level (High PCO2)</span>
                        </div>
                        <div className="flex justify-between bg-black/20 p-2 rounded px-3">
                            <span className="text-slate-300">Sensitivity</span>
                            <span className="text-emerald-400">High</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-2 italic">
                            "Hypercapnic Drive" - Normal breathing is driven by the need to expel CO2.
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-rose-900/20 border border-rose-500/30 rounded-xl opacity-75">
                    <h3 className="text-lg font-bold text-rose-300 mb-2">Peripheral Chemoreceptors</h3>
                    <p className="text-sm text-slate-400 mb-4">Located in Carotid & Aortic bodies.</p>

                    <div className="space-y-2">
                        <div className="flex justify-between bg-black/20 p-2 rounded px-3">
                            <span className="text-slate-300">Primary Stimulus</span>
                            <span className="text-white font-bold">Low O2 (Hypoxia)</span>
                        </div>
                        <div className="flex justify-between bg-black/20 p-2 rounded px-3">
                            <span className="text-slate-300">Activation Threshold</span>
                            <span className="text-rose-400">PaO2 &lt; 60 mmHg</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-2 italic">
                            "Hypoxic Drive" - Takes over as primary drive in severe lung disease or extreme altitude.
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-lg text-center">
                <h4 className="text-white font-bold mb-2">Hyperventilation Loop</h4>
                <p className="text-slate-400 max-w-2xl mx-auto mb-6">
                    Hyperventilation expels too much CO2 (Hypocapnia). This reduces the "Hypercapnic Drive", potentially leading to a temporary cessation of breathing (bedside apnea) until CO2 builds back up.
                </p>

                <div className="flex justify-center items-center gap-4 text-sm font-mono text-emerald-500">
                    <div className="bg-emerald-500/10 px-4 py-2 rounded border border-emerald-500/20">Anxiety / Hypoxia</div>
                    <span>→</span>
                    <div className="bg-emerald-500/10 px-4 py-2 rounded border border-emerald-500/20">Increased Rate</div>
                    <span>→</span>
                    <div className="bg-emerald-500/10 px-4 py-2 rounded border border-emerald-500/20">Low CO2</div>
                    <span>→</span>
                    <div className="bg-emerald-500/10 px-4 py-2 rounded border border-emerald-500/20">Alkalosis ( Symptoms )</div>
                </div>
            </div>
        </div>
    );
};

export default HPLRespiration;
