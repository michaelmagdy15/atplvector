import React, { useState } from 'react';
import { Wind, ArrowRight, ArrowDown, Globe, Compass, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const WindSystems: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'forces' | 'jets' | 'local'>('forces');
    const [pressureGradient, setPressureGradient] = useState(50); // 0-100

    return (
        <div className="space-y-8">
            {/* View Toggle */}
            <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800 w-fit mx-auto shadow-lg">
                <button
                    onClick={() => setActiveTab('forces')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'forces' ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    Forces (PGF/Coriolis)
                </button>
                <button
                    onClick={() => setActiveTab('jets')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'jets' ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    Jet Streams
                </button>
                <button
                    onClick={() => setActiveTab('local')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'local' ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                >
                    Local Winds
                </button>
            </div>

            {/* FORCES INTERACTIVE */}
            {activeTab === 'forces' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl min-h-[500px] flex flex-col">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Compass className="text-teal-400" /> Geostrophic Balance
                        </h3>

                        <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 flex-1 relative overflow-hidden">
                            {/* Isobars */}
                            <div className="absolute inset-x-0 top-1/4 h-[1px] bg-slate-700"></div>
                            <div className="absolute left-2 top-[22%] text-xs font-mono text-slate-500">LOW (990)</div>

                            <div className="absolute inset-x-0 bottom-1/4 h-[1px] bg-slate-700"></div>
                            <div className="absolute left-2 bottom-[22%] text-xs font-mono text-slate-500">HIGH (1020)</div>

                            {/* Center Particle (Air Parcel) */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-[0_0_15px_white] z-20 flex items-center justify-center">
                                <Wind size={16} className="text-slate-900" />
                            </div>

                            {/* PGF Arrow (Gradient Force - To Low) */}
                            <motion.div
                                className="absolute top-1/2 left-1/2 w-1 bg-blue-500 origin-bottom"
                                style={{ height: pressureGradient * 2, rotate: 180 }} // Pointing UP
                            >
                                <div className="absolute top-0 -translate-y-full -translate-x-1/2 text-[10px] font-bold text-blue-400 whitespace-nowrap">PGF</div>
                                <ArrowDown className="absolute -top-3 -left-1.5 text-blue-500 rotate-180" size={12} />
                            </motion.div>

                            {/* Coriolis Arrow (To Right in NH) */}
                            <motion.div
                                className="absolute top-1/2 left-1/2 h-1 bg-red-500 origin-left"
                                style={{ width: pressureGradient * 2 }} // Balances PGF eventually
                            >
                                <div className="absolute right-0 translate-x-full -translate-y-1/2 text-[10px] font-bold text-red-400 ml-2 whitespace-nowrap">Coriolis</div>
                                <ArrowRight className="absolute -right-3 -top-1.5 text-red-500" size={12} />
                            </motion.div>

                            {/* Resultant Wind (Geostrophic - Parallel) */}
                            <motion.div
                                className="absolute top-1/2 left-1/2 h-2 bg-teal-400 origin-left rounded-full shadow-[0_0_10px_#2dd4bf]"
                                style={{ width: pressureGradient * 3 }}
                            >
                                <div className="absolute right-2 top-2 text-[10px] font-bold text-teal-300 whitespace-nowrap">Winnd ({pressureGradient * 2} kts)</div>
                            </motion.div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <label className="block text-sm font-bold text-slate-400 mb-2">Pressure Gradient (Isobar Spacing)</label>
                            <input
                                type="range"
                                min="10" max="100"
                                value={pressureGradient}
                                onChange={(e) => setPressureGradient(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                            />
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>Slack (Light Winds)</span>
                                <span>Steep (Strong Winds)</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
                            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                <RefreshCw size={16} className="text-red-400" /> Coriolis Force
                            </h4>
                            <p className="text-sm text-slate-400 leading-relaxed mb-4">
                                Caused by Earth's rotation. Deflects wind to the <strong>RIGHT</strong> in Northern Hemisphere.
                                <br />Magnitude depends on:
                            </p>
                            <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
                                <li><strong>Latitude:</strong> Zero at Equator, Max at Poles (sin lat).</li>
                                <li><strong>Wind Speed:</strong> Faster wind = More deflection.</li>
                            </ul>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
                            <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                <Globe size={16} className="text-blue-400" /> Buys Ballot's Law
                            </h4>
                            <blockquote className="border-l-4 border-teal-500 pl-4 py-1 text-sm text-slate-200 italic my-4">
                                "In the Northern Hemisphere, if you stand with your back to the wind, the heavy pressure is on the right and the low pressure area is on your left."
                            </blockquote>
                        </div>
                    </div>
                </div>
            )}

            {/* JET STREAMS & LOCAL WINDS PLACEHOLDERS FOR NOW (To remain brief as per user request to start components) */}
            {activeTab !== 'forces' && (
                <div className="bg-slate-900 border border-slate-800 p-12 rounded-3xl text-center">
                    <p className="text-slate-400">Detailed visualizations for {activeTab} loaded from study notes...</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-2xl mx-auto">
                        {activeTab === 'jets' && (
                            <>
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                    <h4 className="text-teal-400 font-bold">Polar Front Jet</h4>
                                    <p className="text-xs text-slate-500">60°N, FL300. Associated with main weather systems.</p>
                                </div>
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                    <h4 className="text-teal-400 font-bold">Subtropical Jet</h4>
                                    <p className="text-xs text-slate-500">30°N, FL400. Higher and more stable.</p>
                                </div>
                            </>
                        )}
                        {activeTab === 'local' && (
                            <>
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                    <h4 className="text-teal-400 font-bold">Föhn Wind</h4>
                                    <p className="text-xs text-slate-500">Warm dry wind descending lee side of mountains.</p>
                                </div>
                                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                    <h4 className="text-teal-400 font-bold">Sea Breeze</h4>
                                    <p className="text-xs text-slate-500">Daytime. Land heats up &rarr; Low Pressure &rarr; Wind from Sea.</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WindSystems;
