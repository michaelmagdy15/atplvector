import React from 'react';
import { motion } from 'framer-motion';

const WarmFront2D: React.FC = () => {
    return (
        <div className="w-full h-full relative bg-slate-900 overflow-hidden flex items-center justify-center">
            {/* SVG Container */}
            <svg
                viewBox="0 0 800 500"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Definitions for Gradients and Masks */}
                <defs>
                    <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0b1329" />
                        <stop offset="100%" stopColor="#1e293b" />
                    </linearGradient>
                    <linearGradient id="warmAirGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#fca5a5" stopOpacity="0.08" />
                    </linearGradient>
                    <linearGradient id="coldAirGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0284c7" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
                    </linearGradient>
                    <marker id="warmArrow" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
                        <polygon points="0 0, 8 3, 0 6" fill="#fca5a5" />
                    </marker>
                </defs>

                {/* Sky Background */}
                <rect width="800" height="500" fill="url(#skyGradient)" />

                {/* Ground */}
                <rect x="0" y="440" width="800" height="60" fill="#0f172a" />
                <line x1="0" y1="440" x2="800" y2="440" stroke="#334155" strokeWidth="2" />

                {/* Distance Scale at Bottom */}
                <g fill="#64748b" fontSize="10" fontFamily="monospace">
                    <text x="250" y="465">Surface Front (0 km)</text>
                    <text x="420" y="465">~200 km ahead</text>
                    <text x="560" y="465">~500 km ahead</text>
                    <text x="700" y="465">~800 km ahead</text>
                </g>

                {/* Cold Air Wedge (Retreating gently to right, slope 1:150) */}
                <path
                    d="M250,440 L800,440 L800,140 Z"
                    fill="url(#coldAirGradient)"
                />
                <text x="520" y="410" fill="#bae6fd" fontSize="13" fontWeight="bold">Cold Air Mass (Retreating East)</text>

                {/* Warm Air (Overrunning wedge gently) */}
                <path
                    d="M-50,440 L250,440 L800,140 L800,0 L-50,0 Z"
                    fill="url(#warmAirGradient)"
                />

                {/* Upward Glide Flow Arrows */}
                {[0, 1, 2].map((i) => (
                    <motion.path
                        key={`glide-${i}`}
                        d="M120,380 Q350,300 650,150"
                        stroke="#f87171"
                        strokeWidth="2.5"
                        strokeDasharray="12 8"
                        markerEnd="url(#warmArrow)"
                        initial={{ pathOffset: 0 }}
                        animate={{ pathOffset: [0, 1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: i * 1.3 }}
                    />
                ))}

                <text x="60" y="300" fill="#fca5a5" fontSize="16" fontWeight="bold">Warm Air Mass</text>
                <text x="60" y="320" fill="#f87171" fontSize="11">Active Overrunning (Slope 1:150)</text>

                {/* Frontal Incline Surface Line (Red Semicircles) */}
                <line x1="250" y1="440" x2="800" y2="140" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6 4" />
                <circle cx="250" cy="440" r="5" fill="#ef4444" />
                <text x="220" y="430" fill="#ef4444" fontSize="11" fontWeight="bold">Warm Front</text>

                {/* --- CLOUD SEQUENCE (Ci -> Cs -> As -> Ns) --- */}
                
                {/* 1. Cirrus (Ci) at High Alt (~800 km ahead, 30,000+ ft) */}
                <motion.g animate={{ x: [0, 6, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
                    <path d="M660,70 Q720,50 780,65 M680,85 Q730,65 770,80" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" opacity="0.6" fill="none" />
                    <rect x="670" y="40" width="85" height="18" rx="4" fill="#0f172a" fillOpacity="0.8" />
                    <text x="712" y="53" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">Cirrus (Ci)</text>
                    <text x="712" y="98" fill="#94a3b8" fontSize="8" textAnchor="middle">Mares' tails (Ice)</text>
                </motion.g>

                {/* 2. Cirrostratus (Cs) (~500 km ahead, Solar/Lunar Halo) */}
                <motion.g animate={{ x: [0, -5, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>
                    <ellipse cx="580" cy="120" rx="90" ry="18" fill="#cbd5e1" opacity="0.4" />
                    <rect x="535" y="100" width="90" height="18" rx="4" fill="#0f172a" fillOpacity="0.8" />
                    <text x="580" y="113" fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="middle">Cirrostratus (Cs)</text>
                    <text x="580" y="145" fill="#94a3b8" fontSize="8" textAnchor="middle">Halo phenomena</text>
                </motion.g>

                {/* 3. Altostratus (As) (~300 km ahead, Watery Sun, Mid-level) */}
                <motion.g animate={{ x: [0, 4, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
                    <ellipse cx="440" cy="180" rx="100" ry="24" fill="#94a3b8" opacity="0.65" />
                    <rect x="390" y="165" width="100" height="18" rx="4" fill="#0f172a" fillOpacity="0.8" />
                    <text x="440" y="178" fill="#f1f5f9" fontSize="10" fontWeight="bold" textAnchor="middle">Altostratus (As)</text>
                    <text x="440" y="212" fill="#94a3b8" fontSize="8" textAnchor="middle">Watery sun / virga</text>
                </motion.g>

                {/* 4. Nimbostratus (Ns) (0-150 km ahead, Thick, Heavy Steady Rain, Low Cloud Base) */}
                <motion.g animate={{ x: [0, -3, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
                    <path
                        d="M260,260 Q300,210 360,220 Q410,210 440,250 Q430,320 350,330 Q280,330 260,260 Z"
                        fill="#475569"
                        opacity="0.95"
                    />
                    <rect x="300" y="260" width="100" height="18" rx="4" fill="#0f172a" fillOpacity="0.9" />
                    <text x="350" y="273" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">Nimbostratus (Ns)</text>
                    <text x="350" y="345" fill="#93c5fd" fontSize="9" textAnchor="middle">Continuous steady rain</text>
                </motion.g>

                {/* Steady Rain Falling from Nimbostratus */}
                <g>
                    {[...Array(24)].map((_, i) => (
                        <motion.line
                            key={`warm-rain-${i}`}
                            x1={280 + (i * 7)}
                            y1={330}
                            x2={270 + (i * 7)}
                            y2={345}
                            stroke="#60a5fa"
                            strokeWidth="1.5"
                            strokeOpacity="0.75"
                            initial={{ y1: 330, y2: 345 }}
                            animate={{ y1: 440, y2: 455, opacity: [0, 1, 0] }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: (i % 6) * 0.2,
                                ease: "linear"
                            }}
                        />
                    ))}
                </g>

                {/* Sequence Banner on Top */}
                <rect x="20" y="15" width="360" height="26" rx="6" fill="#0f172a" fillOpacity="0.85" stroke="#334155" strokeWidth="1" />
                <text x="30" y="32" fill="#f87171" fontSize="11" fontWeight="bold">
                    Cloud Sequence: Ci → Cs → As → Ns (Advance Warning)
                </text>
            </svg>
        </div>
    );
};

export default WarmFront2D;
