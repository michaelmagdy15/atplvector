import React, { useState } from 'react';
import { Wind, RotateCw } from 'lucide-react';

const ThreeDAirflow: React.FC = () => {
    const [viewAngle, setViewAngle] = useState(0);

    return (
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Wind className="text-blue-400" /> 3D Airflow: Wing Tip Vortices
            </h2>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-black rounded-xl overflow-hidden relative h-[400px] perspective-1000">
                    {/* Scene Container */}
                    <div
                        className="w-full h-full relative transition-transform duration-500 preserve-3d"
                        style={{ transform: `rotateX(20deg) rotateY(${viewAngle}deg)` }}
                    >
                        {/* Plane Body */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-10 bg-slate-200 rounded-full flex items-center justify-center shadow-lg">
                            {/* Wings */}
                            <div className="absolute w-64 h-20 bg-slate-300 transform -translate-x-[40%] rounded-lg shadow-inner"></div>
                            <div className="absolute w-64 h-20 bg-slate-300 transform translate-x-[40%] rounded-lg shadow-inner"></div>
                            <div className="font-bold text-slate-500 z-10">REAR VIEW</div>
                        </div>

                        {/* Vortices Animation - Left */}
                        <div className="absolute top-1/2 left-[20%] transform -translate-y-1/2">
                            <div className="w-20 h-20 border-4 border-dashed border-sky-400 rounded-full animate-spin-slow opacity-60"></div>
                            <div className="absolute top-0 left-0 w-32 h-32 border-2 border-dotted border-white rounded-full animate-spin-reverse-slow opacity-30 -translate-x-6 -translate-y-6"></div>
                            <div className="absolute top-8 left-8 text-sky-400 font-bold text-xl glow-text">↻</div>
                        </div>

                        {/* Vortices Animation - Right */}
                        <div className="absolute top-1/2 right-[20%] transform -translate-y-1/2">
                            <div className="w-20 h-20 border-4 border-dashed border-sky-400 rounded-full animate-spin-reverse-slow opacity-60"></div>
                            <div className="absolute top-0 left-0 w-32 h-32 border-2 border-dotted border-white rounded-full animate-spin-slow opacity-30 -translate-x-6 -translate-y-6"></div>
                            <div className="absolute top-8 left-8 text-sky-400 font-bold text-xl glow-text">↺</div>
                        </div>

                        {/* Downwash Labels */}
                        <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 text-center">
                            <div className="text-yellow-400 font-bold mb-2">DOWNWASH</div>
                            <div className="w-40 h-16 bg-gradient-to-b from-yellow-400/20 to-transparent rounded"></div>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/3 space-y-6">
                    <div className="bg-slate-800 p-4 rounded-lg">
                        <h3 className="text-white font-bold mb-3">Induced Drag Mechanism</h3>
                        <ul className="space-y-3 text-sm text-slate-300">
                            <li className="flex gap-2">
                                <span className="text-sky-400 font-bold">1.</span>
                                <span>Higher pressure under the wing seeks lower pressure on top.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-sky-400 font-bold">2.</span>
                                <span>Air flows around the wingtip, creating a vortex.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-sky-400 font-bold">3.</span>
                                <span>Vortices push air down behind the wing (Downwash).</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-sky-400 font-bold">4.</span>
                                <span>Downwash tilts the local relative airflow downwards.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-sky-400 font-bold">5.</span>
                                <span>Lift vector tilts backwards = <strong className="text-red-400">Induced Drag</strong>.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThreeDAirflow;
