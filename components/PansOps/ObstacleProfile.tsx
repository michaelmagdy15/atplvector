import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mountain, Layers, ShieldCheck, Ruler } from 'lucide-react';

const ObstacleProfile: React.FC = () => {
    const [moc, setMoc] = useState(300);
    const [areaWidth, setAreaWidth] = useState(10); // NM

    return (
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h3 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                        <Layers className="text-blue-400" /> Area Cross-Section
                    </h3>
                    <p className="text-slate-400 text-sm">
                        Visualizing Primary and Secondary obstacle clearance areas (ICAO Doc 8168).
                    </p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Base MOC (m)</label>
                        <select 
                            value={moc} 
                            onChange={(e) => setMoc(Number(e.target.value))}
                            className="bg-transparent text-white font-bold outline-none cursor-pointer"
                        >
                            <option value={300}>Initial (300m)</option>
                            <option value={150}>Intermediate (150m)</option>
                            <option value={90}>Final NPA (90m)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Profile Visualization */}
            <div className="relative h-[400px] w-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-end justify-center px-12 pb-20">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent"></div>
                
                {/* Horizontal Axis */}
                <div className="absolute bottom-16 left-12 right-12 h-[1px] bg-slate-800"></div>

                {/* Secondary Area (Left) */}
                <div className="relative flex-1 h-full flex items-end">
                     {/* Slope */}
                     <svg className="absolute bottom-16 left-0 w-full h-[200px]" preserveAspectRatio="none">
                        <motion.path 
                            d={`M 0 200 L 100 200 L 100 ${200 - (moc/2)} Z`} 
                            fill="rgba(59, 130, 246, 0.1)" 
                            stroke="rgba(59, 130, 246, 0.3)"
                            strokeDasharray="4 4"
                            initial={false}
                            animate={{ d: `M 0 200 L 100 200 L 100 ${200 - (moc/2)} Z` }}
                        />
                     </svg>
                     <div className="absolute bottom-6 left-0 w-full text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                        Secondary (1/4)
                     </div>
                </div>

                {/* Primary Area */}
                <div className="relative flex-[2] h-full flex items-end">
                    {/* Constant MOC Block */}
                    <motion.div 
                        className="absolute bottom-16 left-0 w-full bg-blue-500/10 border-x border-t border-blue-500/40"
                        initial={false}
                        animate={{ height: moc / 2 }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <ShieldCheck className="text-blue-500/20" size={48} />
                        </div>
                    </motion.div>
                    <div className="absolute bottom-6 left-0 w-full text-center text-[10px] text-blue-400 font-black uppercase tracking-widest">
                        Primary Area (1/2)
                    </div>
                    {/* MOC Label */}
                    <motion.div 
                        className="absolute left-1/2 -translate-x-1/2 text-white font-mono text-sm font-bold bg-slate-900 px-3 py-1 rounded-full border border-slate-700 shadow-xl"
                        initial={false}
                        animate={{ bottom: (moc / 2) + 64 + 10 }}
                    >
                        {moc}m MOC
                    </motion.div>
                </div>

                {/* Secondary Area (Right) */}
                <div className="relative flex-1 h-full flex items-end">
                     {/* Slope */}
                     <svg className="absolute bottom-16 left-0 w-full h-[200px]" preserveAspectRatio="none">
                        <motion.path 
                            d={`M 0 ${200 - (moc/2)} L 100 200 L 0 200 Z`} 
                            fill="rgba(59, 130, 246, 0.1)" 
                            stroke="rgba(59, 130, 246, 0.3)"
                            strokeDasharray="4 4"
                            initial={false}
                            animate={{ d: `M 0 ${200 - (moc/2)} L 100 200 L 0 200 Z` }}
                        />
                     </svg>
                     <div className="absolute bottom-6 left-0 w-full text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                        Secondary (1/4)
                     </div>
                </div>

                {/* Terrain / Obstacle Sim */}
                <div className="absolute bottom-16 left-0 w-full h-8 bg-slate-800/30 flex items-start px-20">
                     <div className="w-4 h-12 bg-slate-700 rounded-t-sm -translate-y-4 mx-4"></div>
                     <div className="w-8 h-20 bg-slate-700 rounded-t-sm -translate-y-12 mx-8"></div>
                     <div className="w-6 h-16 bg-slate-700 rounded-t-sm -translate-y-8 mx-2"></div>
                </div>

                {/* Width Markers */}
                <div className="absolute bottom-12 left-12 right-12 flex justify-between px-2">
                    <Ruler size={14} className="text-slate-600" />
                    <div className="h-[1px] flex-grow bg-slate-800 mx-4 self-center"></div>
                    <span className="text-[10px] text-slate-600 font-mono">Total Area Width</span>
                    <div className="h-[1px] flex-grow bg-slate-800 mx-4 self-center"></div>
                    <Ruler size={14} className="text-slate-600" />
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                    <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                        <ShieldCheck size={16} className="text-blue-400" /> Full MOC
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        In the **Primary Area**, the full Minimum Obstacle Clearance (MOC) is applied to all obstacles.
                    </p>
                </div>
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                    <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                        <Layers size={16} className="text-slate-400" /> Tapered MOC
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        In the **Secondary Area**, MOC tapers from the full value at the inner edge to **zero** at the outer edge.
                    </p>
                </div>
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                    <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                        <Mountain size={16} className="text-pink-400" /> Terrain Margin
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        If terrain is mountainous, an additional margin of up to **100%** of the base MOC may be applied.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ObstacleProfile;
