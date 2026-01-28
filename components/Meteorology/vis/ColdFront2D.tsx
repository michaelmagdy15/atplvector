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
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="100%" stopColor="#334155" />
                    </linearGradient>
                    <linearGradient id="coldWedgeGradient" x1="100%" y1="0%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.4" />
                    </linearGradient>
                    <linearGradient id="warmAirRise" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#f87171" stopOpacity="0.1" />
                    </linearGradient>
                </defs>

                {/* Sky Background */}
                <rect width="800" height="500" fill="url(#skyGradientCold)" />

                {/* Ground */}
                <rect x="0" y="450" width="800" height="50" fill="#0f172a" />
                <line x1="0" y1="450" x2="800" y2="450" stroke="#334155" strokeWidth="2" />

                {/* Warm Air (Being pushed up) */}
                <motion.path
                    d="M400,450 L800,450 L800,0 L400,0 Z"
                    fill="url(#warmAirRise)"
                    opacity="0.3"
                />

                {/* Rapid Uplift Arrows */}
                {[1, 2].map((i) => (
                    <motion.path
                        key={`arrow-up-${i}`}
                        d="M450,400 L450,100"
                        stroke="#fca5a5"
                        strokeWidth="3"
                        strokeDasharray="15,10"
                        markerEnd="url(#arrowhead)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 1, 0], pathOffset: [0, 1] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeOut",
                            delay: i * 0.5
                        }}
                    />
                ))}
                <text x="500" y="300" fill="#fecaca" fontSize="16" fontWeight="bold">Warm Air (Rapid Uplift)</text>


                {/* Cold Air Wedge (Advancing from Left) - Steep Slope */}
                <motion.path
                    d="M-100,450 L400,450 L400,250 L300,100 L-100,100 Z"
                    fill="url(#coldWedgeGradient)"
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                />
                <text x="100" y="400" fill="#bae6fd" fontSize="16" fontWeight="bold">Cold Air (Advancing)</text>


                {/* Cumulonimbus Cloud (Towering) */}
                <motion.g
                    initial={{ y: 10 }}
                    animate={{ y: -10 }}
                    transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                >
                    {/* Anvil */}
                    <path
                        d="M300,150 Q280,50 450,50 L550,50 Q600,60 550,150 Z"
                        fill="#cbd5e1"
                    />
                    {/* Body */}
                    <ellipse cx="425" cy="200" rx="60" ry="120" fill="#94a3b8" />
                    <ellipse cx="425" cy="300" rx="70" ry="60" fill="#64748b" />

                    <text x="430" y="100" fill="black" fontSize="14" fontWeight="bold" textAnchor="middle">Cb</text>
                </motion.g>

                {/* Heavy Rain / Showers */}
                <g>
                    {[...Array(30)].map((_, i) => (
                        <motion.line
                            key={`rain-heavy-${i}`}
                            x1={380 + Math.random() * 80}
                            y1={300}
                            x2={380 + Math.random() * 80}
                            y2={320}
                            stroke="#fbbf24" // Yellowish tint for heavy/hail comparison? Or stay blue. Let's do bright blue.
                            strokeWidth="2"
                            initial={{ y1: 300, y2: 320, opacity: 0 }}
                            animate={{ y1: 450, y2: 470, opacity: [0, 1, 0] }}
                            transition={{
                                duration: 0.5 + Math.random() * 0.5, // Faster than warm front
                                repeat: Infinity,
                                delay: Math.random(),
                                ease: "linear"
                            }}
                        />
                    ))}
                </g>

                {/* Lightning */}
                <motion.path
                    d="M420,150 L400,250 L440,250 L410,380"
                    stroke="#fbbf24" // Lightning color
                    strokeWidth="3"
                    fill="none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0, 1, 0] }}
                    transition={{
                        duration: 0.2,
                        repeat: Infinity,
                        repeatDelay: 3 + Math.random() * 5
                    }}
                />

                {/* Frontal Surface Line */}
                <line x1="300" y1="100" x2="400" y2="450" stroke="#3b82f6" strokeWidth="3" />

            </svg>
        </div>
    );
};

export default ColdFront2D;
