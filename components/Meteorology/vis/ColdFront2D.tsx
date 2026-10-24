import React from 'react';
import { motion } from 'framer-motion';

const ColdFront2D: React.FC = () => {
    return (
        <div className="w-full h-full relative bg-slate-900 overflow-hidden flex items-center justify-center">
            {/* SVG Container */}
            <svg
                viewBox="0 0 800 500"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <linearGradient id="skyGradientCold" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0a1020" />
                        <stop offset="100%" stopColor="#1e293b" />
                    </linearGradient>
                    <linearGradient id="coldWedgeGradient" x1="100%" y1="0%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#1e40af" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.4" />
                    </linearGradient>
                    <linearGradient id="warmAirRise" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#f87171" stopOpacity="0.05" />
                    </linearGradient>
                    <marker id="coldArrow" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
                        <polygon points="0 0, 8 3, 0 6" fill="#60a5fa" />
                    </marker>
                    <marker id="warmLiftArrow" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
                        <polygon points="0 0, 8 3, 0 6" fill="#fca5a5" />
                    </marker>
                </defs>

                {/* Sky Background */}
                <rect width="800" height="500" fill="url(#skyGradientCold)" />

                {/* Ground */}
                <rect x="0" y="440" width="800" height="60" fill="#0f172a" />
                <line x1="0" y1="440" x2="800" y2="440" stroke="#334155" strokeWidth="2" />

                {/* Scale & Position */}
                <g fill="#64748b" fontSize="10" fontFamily="monospace">
                    <text x="50" y="465">Cold Polar Air Behind Front</text>
                    <text x="380" y="465">Surface Front (Steep 1:50 Nose)</text>
                    <text x="620" y="465">Warm Sector Ahead</text>
                </g>

                {/* Warm Air (Violently uplifted) */}
                <path
                    d="M400,440 L800,440 L800,0 L400,0 Z"
                    fill="url(#warmAirRise)"
                />

                {/* Violent Updraft Vectors */}
                {[0, 1].map((i) => (
                    <motion.path
                        key={`cold-lift-${i}`}
                        d={`M${480 + i * 50},410 L${450 + i * 40},130`}
                        stroke="#f87171"
                        strokeWidth="3"
                        strokeDasharray="14 8"
                        markerEnd="url(#warmLiftArrow)"
                        initial={{ pathOffset: 0 }}
                        animate={{ pathOffset: [0, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: i * 0.4 }}
                    />
                ))}
                <text x="540" y="320" fill="#fca5a5" fontSize="14" fontWeight="bold">Warm Air Mass</text>
                <text x="540" y="340" fill="#f87171" fontSize="10">Forced Convection (Up to 3,000+ fpm)</text>

                {/* Cold Air Wedge (Steep rounded nose 1:50) */}
                <path
                    d="M-50,440 L400,440 Q410,380 370,240 L310,130 L-50,130 Z"
                    fill="url(#coldWedgeGradient)"
                />
                <text x="100" y="380" fill="#bfdbfe" fontSize="15" fontWeight="bold">Cold Dense Air Wedge</text>
                <text x="100" y="402" fill="#93c5fd" fontSize="10">Steep Slope (1:50) • Undercutting at 25-50 kts</text>

                {/* Blue Triangles on Front Line */}
                <line x1="310" y1="130" x2="400" y2="440" stroke="#3b82f6" strokeWidth="3" strokeDasharray="6 4" />
                <polygon points="390,440 405,440 398,425" fill="#3b82f6" />
                <polygon points="365,340 380,340 373,325" fill="#3b82f6" />
                <polygon points="338,240 353,240 346,225" fill="#3b82f6" />

                {/* Towering Cumulonimbus (CB) with Anvil */}
                <motion.g
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                    {/* Anvil pointing downwind (to the right / East) */}
                    <path
                        d="M330,120 Q310,40 440,40 L650,40 Q690,45 610,120 Z"
                        fill="#cbd5e1"
                        opacity="0.9"
                    />
                    <text x="540" y="70" fill="#1e293b" fontSize="11" fontWeight="black">Anvil (Points Downwind)</text>
                    <text x="540" y="85" fill="#475569" fontSize="8">Hail Hazard Under Anvil (up to 20 NM)</text>

                    {/* Main CB Body */}
                    <ellipse cx="430" cy="180" rx="80" ry="80" fill="#94a3b8" />
                    <ellipse cx="440" cy="270" rx="90" ry="75" fill="#475569" />
                    <ellipse cx="400" cy="350" rx="60" ry="40" fill="#334155" />

                    <text x="430" y="210" fill="white" fontSize="18" fontWeight="black" textAnchor="middle">Cb</text>
                    <text x="430" y="230" fill="#fecaca" fontSize="9" fontWeight="bold" textAnchor="middle">Tops to FL400+</text>
                </motion.g>

                {/* Torrential Rain & Hail Shaft */}
                <g>
                    {[...Array(32)].map((_, i) => (
                        <motion.line
                            key={`cold-rain-${i}`}
                            x1={370 + (i * 4)}
                            y1={350}
                            x2={365 + (i * 4)}
                            y2={370}
                            stroke="#60a5fa"
                            strokeWidth="2.5"
                            initial={{ y1: 350, y2: 370 }}
                            animate={{ y1: 440, y2: 460, opacity: [0, 1, 0] }}
                            transition={{
                                duration: 0.45 + (i % 4) * 0.1,
                                repeat: Infinity,
                                delay: (i % 8) * 0.08,
                                ease: "linear"
                            }}
                        />
                    ))}
                </g>

                {/* Lightning Bolt */}
                <motion.path
                    d="M440,160 L415,240 L450,240 L420,360"
                    stroke="#fbbf24"
                    strokeWidth="3.5"
                    fill="none"
                    filter="drop-shadow(0 0 8px #f59e0b)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0, 1, 0] }}
                    transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 4 }}
                />

                {/* Banner with Wind Veer & Hazard Alert */}
                <rect x="20" y="15" width="410" height="26" rx="6" fill="#0f172a" fillOpacity="0.85" stroke="#334155" strokeWidth="1" />
                <text x="30" y="32" fill="#60a5fa" fontSize="11" fontWeight="bold">
                    EASA Profile: Slope 1:50 • Abrupt Wind Veer • Squalls & Hail
                </text>
            </svg>
        </div>
    );
};

export default ColdFront2D;
