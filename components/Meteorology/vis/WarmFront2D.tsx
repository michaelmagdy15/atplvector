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
                        <stop offset="0%" stopColor="#0f172a" />
                        <stop offset="100%" stopColor="#1e293b" />
                    </linearGradient>
                    <linearGradient id="warmAirGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#fca5a5" stopOpacity="0.4" />
                    </linearGradient>
                    <linearGradient id="coldAirGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.1" />
                    </linearGradient>
                </defs>

                {/* Sky Background */}
                <rect width="800" height="500" fill="url(#skyGradient)" />

                {/* Ground */}
                <rect x="0" y="450" width="800" height="50" fill="#0f172a" />
                <line x1="0" y1="450" x2="800" y2="450" stroke="#334155" strokeWidth="2" />

                {/* Cold Air Wedge (Retreating to the right) */}
                <path
                    d="M300,450 L800,450 L800,200 Z"
                    fill="url(#coldAirGradient)"
                />
                <text x="650" y="420" fill="#bae6fd" fontSize="14" fontWeight="bold">Cold Air (Retreating)</text>

                {/* Warm Air (Sliding Up) */}
                <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <path
                        d="M-50,450 L300,450 L800,200 L800,0 L-50,0 Z"
                        fill="url(#warmAirGradient)"
                    />
                    {/* Flow Arrows */}
                    {[1, 2, 3].map((i) => (
                        <motion.path
                            key={`arrow-${i}`}
                            d="M100,250 L400,100" // Simplified path for visual ref
                            stroke="#fca5a5"
                            strokeWidth="2"
                            strokeDasharray="10,10"
                            markerEnd="url(#arrowhead)"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: [0, 1, 0], pathOffset: [0, 1] }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear",
                                delay: i * 1
                            }}
                        />
                    ))}
                    {/* Arrow Head Def */}
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#fca5a5" />
                        </marker>
                    </defs>

                    <text x="100" y="300" fill="#fecaca" fontSize="16" fontWeight="bold">Warm Air</text>
                </motion.g>

                {/* Clouds (Layered) */}
                <g>
                    {/* Nimbostratus (Low, raining) */}
                    <motion.g
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <ellipse cx="400" cy="220" rx="150" ry="30" fill="#64748b" opacity="0.9" />
                        <ellipse cx="500" cy="230" rx="100" ry="25" fill="#475569" opacity="0.9" />
                        <text x="400" y="225" fill="white" fontSize="12" textAnchor="middle">Nimbostratus (Ns)</text>
                    </motion.g>

                    {/* Altostratus (Mid) */}
                    <motion.g
                        animate={{ x: [0, -5, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <ellipse cx="250" cy="150" rx="120" ry="25" fill="#94a3b8" opacity="0.7" />
                        <text x="250" y="155" fill="white" fontSize="12" textAnchor="middle">Altostratus (As)</text>
                    </motion.g>

                    {/* Cirrus (High) */}
                    <motion.g
                        animate={{ x: [0, 8, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <path
                            d="M50,80 Q150,60 250,80"
                            stroke="white"
                            strokeWidth="4"
                            strokeLinecap="round"
                            opacity="0.5"
                            fill="none"
                        />
                        <path
                            d="M80,60 Q180,40 280,60"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            opacity="0.4"
                            fill="none"
                        />
                        <text x="100" y="50" fill="white" fontSize="12">Cirrus (Ci)</text>
                    </motion.g>
                </g>

                {/* Rain Animation */}
                <g>
                    {[...Array(20)].map((_, i) => (
                        <motion.line
                            key={`rain-${i}`}
                            x1={350 + Math.random() * 200}
                            y1={250}
                            x2={350 + Math.random() * 200} // slight angle
                            y2={260}
                            stroke="#60a5fa"
                            strokeWidth="1.5"
                            strokeOpacity="0.6"
                            initial={{ y1: 250, y2: 260, opacity: 0 }}
                            animate={{ y1: 450, y2: 460, opacity: [0, 1, 0] }}
                            transition={{
                                duration: 1 + Math.random(),
                                repeat: Infinity,
                                delay: Math.random() * 2,
                                ease: "linear"
                            }}
                        />
                    ))}
                </g>

                {/* Frontal Surface Line */}
                <line x1="300" y1="450" x2="800" y2="200" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />

            </svg>
        </div>
    );
};

export default WarmFront2D;
