import React from 'react';
import { Plane } from 'lucide-react';

const LoadingScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-[#030712] flex flex-col items-center justify-center z-[9999]">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

            {/* Radar Glow */}
            <div className="absolute w-64 h-64 rounded-full bg-blue-500/10 blur-[100px] animate-pulse"></div>

            {/* Radar Circle */}
            <div className="relative w-48 h-48 mb-8">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-blue-500/30"></div>
                <div className="absolute inset-4 rounded-full border border-blue-500/20"></div>
                <div className="absolute inset-8 rounded-full border border-blue-500/10"></div>

                {/* Radar Sweep */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div
                        className="absolute inset-0 origin-center"
                        style={{
                            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(59, 130, 246, 0.3) 30deg, transparent 60deg)',
                            animation: 'radar-sweep 2s linear infinite'
                        }}
                    ></div>
                </div>

                {/* Center Dot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>

                {/* Logo Icon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div
                        className="w-12 h-12 flex items-center justify-center"
                        style={{
                            animation: 'plane-float 3s ease-in-out infinite',
                        }}
                    >
                        <img
                            src="/assets/ATPLVECTOR Aviation Tech Logo.png"
                            alt="Logo"
                            className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] scale-[3.5]"
                        />
                    </div>
                </div>

                {/* Blips */}
                <div
                    className="absolute w-2 h-2 bg-emerald-400 rounded-full top-[20%] left-[60%]"
                    style={{ animation: 'blip 1.5s ease-out infinite' }}
                ></div>
                <div
                    className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full top-[70%] left-[30%]"
                    style={{ animation: 'blip 2s ease-out infinite 0.5s' }}
                ></div>
            </div>

            {/* Text */}
            <div className="text-center relative z-10">
                <h1 className="text-2xl font-black text-white tracking-tight mb-2">
                    ATPL<span className="text-blue-400">Vector</span>
                </h1>
                <p className="text-slate-400 text-sm font-medium tracking-widest uppercase">
                    Initializing Flight Systems
                </p>

                {/* Loading Dots */}
                <div className="flex justify-center gap-1 mt-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" style={{ animation: 'loading-dot 1.2s ease-in-out infinite' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full" style={{ animation: 'loading-dot 1.2s ease-in-out infinite 0.2s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full" style={{ animation: 'loading-dot 1.2s ease-in-out infinite 0.4s' }}></div>
                </div>
            </div>

            {/* Inline Keyframes */}
            <style>{`
                @keyframes radar-sweep {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes plane-float {
                    0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
                    50% { transform: translate(-50%, -50%) translateY(-8px); }
                }
                @keyframes blip {
                    0% { opacity: 1; transform: scale(1); }
                    100% { opacity: 0; transform: scale(2); }
                }
                @keyframes loading-dot {
                    0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
                    40% { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default LoadingScreen;
