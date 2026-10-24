import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudLightning, Info, AlertTriangle, ArrowRight, ShieldAlert, GitCommit, Layers, Wind } from 'lucide-react';

import WarmFront2D from './vis/WarmFront2D';
import ColdFront2D from './vis/ColdFront2D';
import OccludedFront2D from './vis/OccludedFront2D';
import LessonCard from '../ui/LessonCard';

const FrontalSystems: React.FC = () => {
    const [frontType, setFrontType] = useState<'cold' | 'warm' | 'occluded' | 'lifecycle'>('cold');

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
                        <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                            <CloudLightning className="text-indigo-400" size={32} />
                        </div>
                        Polar Front Depressions & Frontal Boundaries
                        <span className="text-sm font-bold bg-indigo-600 px-3 py-1 rounded-full text-white tracking-wide ml-2">ATPL 050</span>
                    </h2>
                    <p className="text-slate-400 mt-3 max-w-2xl text-base font-light leading-relaxed">
                        Polar front theory, frontal slopes, cloud advance warning sequences, and severe convective squall line hazards.
                    </p>
                </div>

                {/* Tab Selector */}
                <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl overflow-x-auto">
                    {[
                        { id: 'cold', label: 'Cold Front', color: '#2563eb' },
                        { id: 'warm', label: 'Warm Front', color: '#dc2626' },
                        { id: 'occluded', label: 'Occlusion (TROWAL)', color: '#9333ea' },
                        { id: 'lifecycle', label: 'Polar Front Lifecycle', color: '#059669' }
                    ].map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setFrontType(f.id as any)}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 relative whitespace-nowrap ${
                                frontType === f.id
                                    ? 'text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                            style={{
                                backgroundColor: frontType === f.id ? f.color : 'transparent'
                            }}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </header>

            {frontType !== 'lifecycle' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Visualization Area */}
                    <div className="h-[420px] md:h-[500px] bg-slate-950 rounded-[2.5rem] border border-slate-800 relative overflow-hidden shadow-2xl group">
                        <div className="absolute top-4 left-6 z-10 pointer-events-none">
                            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                {frontType === 'cold' ? 'Cold Front Cross-Section' : frontType === 'warm' ? 'Warm Front Cross-Section' : 'Occluded Front Cross-Section'}
                            </h3>
                            <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mt-1">
                                {frontType === 'cold' ? 'Slope 1:50 • Steep Wedge' : frontType === 'warm' ? 'Slope 1:150 • Gentle Incline' : 'Trough of Warm Air Aloft'}
                            </p>
                        </div>

                        <div className="w-full h-full">
                            <AnimatePresence mode="wait">
                                {frontType === 'warm' && (
                                    <motion.div
                                        key="warm-vis"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.05 }}
                                        className="w-full h-full"
                                    >
                                        <WarmFront2D />
                                    </motion.div>
                                )}
                                {frontType === 'cold' && (
                                    <motion.div
                                        key="cold-vis"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.05 }}
                                        className="w-full h-full"
                                    >
                                        <ColdFront2D />
                                    </motion.div>
                                )}
                                {frontType === 'occluded' && (
                                    <motion.div
                                        key="occluded-vis"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.05 }}
                                        className="w-full h-full"
                                    >
                                        <OccludedFront2D />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Overlay Helper */}
                        <div className="absolute bottom-6 right-6 flex gap-2">
                            <div className="bg-slate-900/80 backdrop-blur text-xs font-bold text-slate-300 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div> Cold Air
                            </div>
                            <div className="bg-slate-900/80 backdrop-blur text-xs font-bold text-slate-300 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div> Warm Air
                            </div>
                        </div>
                    </div>

                    {/* Information Cards */}
                    <div className="space-y-6">
                        <AnimatePresence mode="wait">
                            {frontType === 'cold' && (
                                <LessonCard
                                    key="cold-card"
                                    title="Cold Front Dynamics"
                                    description="Dense polar air aggressively undercuts the warm moist air mass. The steep frontal slope (1:50) acts as a high-speed wedge, throwing warm air vertically into violent convective overturning."
                                    examTip="Croucher Exam Rule: Slope 1:50 • Speed 25-50 kts • Severe Squall Lines • Abrupt Wind Veer & Rapid Pressure Spike"
                                    tags={['Steep 1:50 Slope', 'Cumulonimbus (CB)', 'Hail & Microbursts', 'Abrupt Veer', 'Excellent Post-Front Vis']}
                                    colorTheme="blue"
                                />
                            )}
                            {frontType === 'warm' && (
                                <LessonCard
                                    key="warm-card"
                                    title="Warm Front Dynamics"
                                    description="Lighter tropical air glides over a retreating wedge of cold air. The gentle slope (1:150 to 1:200) forces gradual widespread stratiform condensation extending up to 800-1,000 km ahead."
                                    examTip="Croucher Cloud Warning Sequence: Ci → Cs (Halo) → As (Watery Sun) → Ns (Continuous Rain) • Steady Wind Veer"
                                    tags={['Shallow 1:150 Slope', 'Ci → Cs → As → Ns', 'Continuous Steady Rain', 'Low Ceilings', 'Poor Visibility / Mist']}
                                    colorTheme="red"
                                />
                            )}
                            {frontType === 'occluded' && (
                                <LessonCard
                                    key="occluded-card"
                                    title="Occluded Front (TROWAL)"
                                    description="Because cold fronts move significantly faster (25-50 kts) than warm fronts (10-20 kts), the cold front catches the warm front and zips it up from the low center, lifting the warm sector completely off the ground."
                                    examTip="Key Concept: TROWAL (Trough of Warm Air Aloft) • Mixed Cb and Ns clouds • Associated with mature decaying depressions."
                                    tags={['Cold / Warm Occlusions', 'Embedded Cb inside Ns', 'Severe Icing Hazard', 'Depression Core']}
                                    colorTheme="purple"
                                />
                            )}
                        </AnimatePresence>

                        {/* Operational Hazard Notice */}
                        <div className="bg-amber-500/10 rounded-2xl p-6 border border-amber-500/20 flex items-start gap-4">
                            <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-white font-bold text-sm mb-1">Croucher Tactical Rule: Frontal Penetration</h4>
                                <p className="text-slate-300 text-xs leading-relaxed">
                                    Never attempt to penetrate a cold front near the <strong>apex (center of the Low)</strong>. Convergence and vertical velocities peak at the wave tip, harboring embedded microbursts, severe turbulence, and line squalls. Cross perpendicularly at the lowest active radar intensity or circumnavigate.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Polar Front Lifecycle Tab */
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">The Norwegian Polar Front Model (Depression Lifecycle)</h3>
                        <p className="text-slate-400 text-sm">
                            The full 5-stage evolutionary lifecycle of an extratropical frontal depression (Croucher Ch 14).
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {[
                            {
                                step: '1',
                                title: 'Initial Boundary',
                                stage: 'Stationary Polar Front',
                                desc: 'Cold polar easterlies shear against warm subtropical westerlies with no cross-boundary flow.',
                                icon: GitCommit
                            },
                            {
                                step: '2',
                                title: 'Wave Formation',
                                stage: 'Incipient Frontal Wave',
                                desc: 'Upper-level divergence (jet streak) drops central pressure. A kink develops: warm air pushes north, cold air pushes south.',
                                icon: Layers
                            },
                            {
                                step: '3',
                                title: 'Mature Depression',
                                stage: 'Distinct Warm Sector',
                                desc: 'Fully formed cyclonic low. Warm front (1:150) advances east; steep cold front (1:50) sweeps behind it.',
                                icon: Wind
                            },
                            {
                                step: '4',
                                title: 'Occlusion',
                                stage: 'TROWAL Formation',
                                desc: 'Faster cold front overtakes warm front, squeezing warm air aloft. Warm sector disappears from ground.',
                                icon: CloudLightning
                            },
                            {
                                step: '5',
                                title: 'Dissipation',
                                stage: 'Frontolysis / Filling',
                                desc: 'Central pressure rises, temperature contrast washes out, and the depression dissolves into cold pool.',
                                icon: Info
                            }
                        ].map((s) => (
                            <div key={s.step} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                                            {s.step}
                                        </span>
                                        <s.icon size={16} className="text-slate-500" />
                                    </div>
                                    <h4 className="text-white font-bold text-sm mb-1">{s.title}</h4>
                                    <div className="text-[11px] font-mono text-emerald-400 mb-2">{s.stage}</div>
                                    <p className="text-slate-400 text-xs leading-relaxed">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Comprehensive Croucher Ch 14 Frontal Reference Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Layers className="text-indigo-400" size={20} />
                            Croucher Frontal Systems Comparison Matrix
                        </h3>
                        <p className="text-slate-400 text-xs mt-1">
                            Exact ATPL examination benchmarks for synoptic parameters across both frontal types.
                        </p>
                    </div>
                    <span className="text-xs font-mono px-3 py-1 bg-slate-950 text-indigo-300 rounded-full border border-indigo-500/30">
                        Croucher Ch 14 Official Table
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300 border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 text-xs uppercase font-bold text-slate-400 bg-slate-950/60">
                                <th className="p-4 rounded-l-xl">Feature</th>
                                <th className="p-4 text-red-400">Warm Front</th>
                                <th className="p-4 text-blue-400 rounded-r-xl">Cold Front</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-medium">
                            <tr className="hover:bg-slate-800/30 transition-colors">
                                <td className="p-4 font-bold text-white">Frontal Slope</td>
                                <td className="p-4 text-red-300 font-mono">Gentle (1:150 to 1:200)</td>
                                <td className="p-4 text-blue-300 font-mono">Steep (1:50)</td>
                            </tr>
                            <tr className="hover:bg-slate-800/30 transition-colors">
                                <td className="p-4 font-bold text-white">Cloud Progression</td>
                                <td className="p-4 text-slate-300">Ci → Cs → As → Ns (over 800 km)</td>
                                <td className="p-4 text-slate-300">Cu, TCU, Cb, squall line (narrow 30-50 km band)</td>
                            </tr>
                            <tr className="hover:bg-slate-800/30 transition-colors">
                                <td className="p-4 font-bold text-white">Precipitation Type</td>
                                <td className="p-4 text-slate-300">Continuous steady rain or drizzle</td>
                                <td className="p-4 text-slate-300">Intense rain showers, hail, lightning squalls</td>
                            </tr>
                            <tr className="hover:bg-slate-800/30 transition-colors">
                                <td className="p-4 font-bold text-white">Wind Behavior (NH)</td>
                                <td className="p-4 text-slate-300">Veers steadily and decreases</td>
                                <td className="p-4 text-slate-300">Veers abruptly, violent turbulent gusts</td>
                            </tr>
                            <tr className="hover:bg-slate-800/30 transition-colors">
                                <td className="p-4 font-bold text-white">Temperature Change</td>
                                <td className="p-4 text-slate-300">Rises steadily after passage</td>
                                <td className="p-4 text-slate-300">Drops sharply and rapidly after passage</td>
                            </tr>
                            <tr className="hover:bg-slate-800/30 transition-colors">
                                <td className="p-4 font-bold text-white">Barometric Pressure</td>
                                <td className="p-4 text-slate-300">Falls steadily ahead, steady in warm sector</td>
                                <td className="p-4 text-slate-300">Falls, then sharp instantaneous spike / jump</td>
                            </tr>
                            <tr className="hover:bg-slate-800/30 transition-colors">
                                <td className="p-4 font-bold text-white">Visibility Post-Passage</td>
                                <td className="p-4 text-slate-300">Poor, mist, low stratus, drizzle</td>
                                <td className="p-4 text-slate-300">Rapidly becomes very good / crystal clear (except in showers)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FrontalSystems;
