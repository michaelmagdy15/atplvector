import React from 'react';
import { motion } from 'framer-motion';

const OccludedFront2D: React.FC = () => {
    return (
        <div className="w-full h-full relative bg-slate-900 overflow-hidden flex items-center justify-center">
            <svg
                viewBox="0 0 800 500"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <linearGradient id="occludedSky" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                </defs>

                <rect width="800" height="500" fill="url(#occludedSky)" />

                {/* Ground */}
                <rect x="0" y="450" width="800" height="50" fill="#0f172a" />
                <line x1="0" y1="450" x2="800" y2="450" stroke="#334155" strokeWidth="2" />

                {/* Warm Air (LIFTED - Trowal) */}
                <motion.path
                    d="M100,150 L700,150 L400,0 Z"
                    fill="#fca5a5"
                    opacity="0.2"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <text x="400" y="80" fill="#fecaca" fontSize="16" fontWeight="bold" textAnchor="middle">Warm Air (Lifted Off Ground)</text>
                <text x="400" y="100" fill="#fecaca" fontSize="12" textAnchor="middle">"TROWAL"</text>

                {/* Cold Air (Aggressor) */}
                <path d="M-50,450 L300,450 L100,200 L-50,200 Z" fill="#3b82f6" opacity="0.4" />

                {/* Cool Air (Ahead) */}
                <path d="M300,450 L800,450 L800,200 L500,200 Z" fill="#60a5fa" opacity="0.2" />

                {/* Frontal Symbol (Purple) */}
                <path d="M300,450 L400,150" stroke="#9333ea" strokeWidth="4" />

                {/* Mixed Clouds */}
                <motion.g animate={{ x: [-5, 5, -5] }} transition={{ duration: 5, repeat: Infinity }}>
                    <ellipse cx="400" cy="200" rx="200" ry="40" fill="#64748b" opacity="0.8" />
                    <text x="400" y="205" fill="white" fontSize="14" textAnchor="middle">Mixed Layered & Towering Clouds</text>
                </motion.g>

                {/* Precipitation */}
                <g>
                    {[...Array(20)].map((_, i) => (
                        <motion.line
                            key={`occluded-rain-${i}`}
                            x1={300 + Math.random() * 200}
                            y1={240}
                            x2={300 + Math.random() * 200}
                            y2={250}
                            stroke="#94a3b8"
                            strokeWidth="1"
                            animate={{ y1: 450, y2: 460, opacity: [0, 1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: Math.random(), ease: "linear" }}
                        />
                    ))}
                </g>

            </svg>
        </div>
    );
};

export default OccludedFront2D;
