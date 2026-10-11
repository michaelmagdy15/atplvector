import React from 'react';
import { motion } from 'framer-motion';
import { PressureChamberProps } from './types';
import { STANDARD_PRESSURE_HPA } from './altimetryCalculations';
import { Wind, AlertCircle, Droplets, CheckCircle2 } from 'lucide-react';

export const PressureChamberVisualizer: React.FC<PressureChamberProps> = ({
    ambientPressureHpa,
    verticalSpeedFpm = 0,
    isStaticBlocked = false,
    isAlternateStaticOn = false,
    className = ''
}) => {
    // Standard ISA SL pressure = 1013.25
    // Effective pressure in the casing:
    // If blocked, casing pressure freezes at 1013.25
    // If alternate static is selected, aerodynamic suction lowers casing pressure by ~12 hPa (cockpit depression)
    const effectiveCasingPressure = isStaticBlocked
        ? STANDARD_PRESSURE_HPA
        : isAlternateStaticOn
            ? ambientPressureHpa - 12
            : ambientPressureHpa;

    // Relative pressure delta compared to sea level (negative at high altitude)
    const deltaPressure = effectiveCasingPressure - STANDARD_PRESSURE_HPA;

    // Capsule expansion factor:
    // Lower pressure -> capsule expands (capsule height increases)
    // Higher pressure -> capsule compresses
    // Normal baseline height = 44px. Expansion range: 30px (high pressure) to 65px (low pressure)
    const capsuleExpansion = Math.min(22, Math.max(-14, -deltaPressure * 0.04));
    const capsuleHeight = 44 + capsuleExpansion;

    // Leaf spring deflection angle
    const leverAngle = -capsuleExpansion * 0.8;

    // Status message
    const getStatus = () => {
        if (isStaticBlocked) {
            return {
                title: 'STATIC PORT BLOCKED',
                desc: 'Aneroid capsule cannot sense outside pressure changes. Capsule expansion frozen. Altimeter reads fixed altitude.',
                color: 'text-red-400',
                bg: 'bg-red-500/10 border-red-500/30'
            };
        }
        if (isAlternateStaticOn) {
            return {
                title: 'ALTERNATE STATIC SOURCE ACTIVE',
                desc: 'Cabin air acceleration induces venturi suction. Case pressure is LOWER than ambient -> Capsule over-expands -> Altimeter OVERREADS.',
                color: 'text-amber-400',
                bg: 'bg-amber-500/10 border-amber-500/30'
            };
        }
        if (ambientPressureHpa < STANDARD_PRESSURE_HPA) {
            return {
                title: 'CLIMB / LOW PRESSURE (CAPSULE EXPANDING)',
                desc: `Static pressure dropped to ${Math.round(ambientPressureHpa)} hPa. Evacuated capsule expands outward against leaf spring.`,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10 border-emerald-500/30'
            };
        }
        return {
            title: 'NORMAL AMBIENT STATIC SENSING',
            desc: `Static port feeding case at ${Math.round(ambientPressureHpa)} hPa. Capsule balanced by internal spring.`,
            color: 'text-sky-400',
            bg: 'bg-sky-500/10 border-sky-500/30'
        };
    };

    const status = getStatus();

    return (
        <div className={`bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400">
                        <Wind size={20} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm tracking-wide">Aneroid Capsule & Static Chamber</h3>
                        <p className="text-[11px] text-slate-400">Sensing Static Pressure (Ps) through evacuated bellows</p>
                    </div>
                </div>

                <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Case Pressure</span>
                    <span className="font-mono text-base font-black text-white">
                        {Math.round(effectiveCasingPressure)} <span className="text-xs text-slate-400 font-normal">hPa</span>
                    </span>
                </div>
            </div>

            {/* Cross-Section Diagram */}
            <div className="relative w-full h-[220px] bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden flex items-center justify-center p-4">
                <svg viewBox="0 0 420 200" className="w-full h-full">
                    <defs>
                        {/* Static Air Molecules Pattern */}
                        <radialGradient id="capsuleMetal" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#e2e8f0" />
                            <stop offset="60%" stopColor="#94a3b8" />
                            <stop offset="100%" stopColor="#475569" />
                        </radialGradient>
                    </defs>

                    {/* Outer Hermetic Instrument Case */}
                    <rect x="70" y="20" width="280" height="160" rx="16" fill="#0f172a" stroke="#334155" strokeWidth="3" />
                    <text x="82" y="38" fill="#64748b" fontSize="8" fontWeight="bold" letterSpacing="1">
                        AIRTIGHT INSTRUMENT CASING
                    </text>

                    {/* Static Tube Inlet (from left) */}
                    <path
                        d="M 10 100 L 70 100"
                        stroke={isStaticBlocked ? "#ef4444" : isAlternateStaticOn ? "#f59e0b" : "#38bdf8"}
                        strokeWidth="8"
                        strokeLinecap="round"
                    />
                    <text x="12" y="88" fill={isStaticBlocked ? "#ef4444" : "#94a3b8"} fontSize="8" fontWeight="bold">
                        {isStaticBlocked ? "BLOCKED" : "STATIC PORT (Ps)"}
                    </text>

                    {/* Air Flow Particles */}
                    {!isStaticBlocked && (
                        <g opacity="0.6">
                            <circle cx="25" cy="100" r="2" fill="#38bdf8" />
                            <circle cx="45" cy="100" r="2" fill="#38bdf8" />
                            <circle cx="65" cy="100" r="2" fill="#38bdf8" />
                        </g>
                    )}

                    {/* Case Interior Ambient Air Pressure Arrows */}
                    <g opacity="0.4" stroke="#38bdf8" strokeWidth="1.5">
                        <line x1="160" y1="42" x2="160" y2="58" markerEnd="url(#arrowhead)" />
                        <line x1="260" y1="42" x2="260" y2="58" markerEnd="url(#arrowhead)" />
                        <line x1="160" y1="158" x2="160" y2="142" markerEnd="url(#arrowhead)" />
                        <line x1="260" y1="158" x2="260" y2="142" markerEnd="url(#arrowhead)" />
                    </g>

                    {/* Evacuated Aneroid Capsule (Bellows with corrugations) */}
                    <g transform={`translate(150, ${100 - capsuleHeight / 2})`}>
                        {/* Upper Half */}
                        <path
                            d={`M 0 0 C 30 -6, 90 -6, 120 0 C 110 ${capsuleHeight * 0.25}, 110 ${capsuleHeight * 0.25}, 120 ${capsuleHeight * 0.5} C 90 ${capsuleHeight * 0.5 + 6}, 30 ${capsuleHeight * 0.5 + 6}, 0 ${capsuleHeight * 0.5} C 10 ${capsuleHeight * 0.25}, 10 ${capsuleHeight * 0.25}, 0 0 Z`}
                            fill="url(#capsuleMetal)"
                            stroke="#64748b"
                            strokeWidth="1.5"
                        />
                        {/* Lower Half */}
                        <path
                            d={`M 0 ${capsuleHeight * 0.5} C 30 ${capsuleHeight * 0.5 - 6}, 90 ${capsuleHeight * 0.5 - 6}, 120 ${capsuleHeight * 0.5} C 110 ${capsuleHeight * 0.75}, 110 ${capsuleHeight * 0.75}, 120 ${capsuleHeight} C 90 ${capsuleHeight + 6}, 30 ${capsuleHeight + 6}, 0 ${capsuleHeight} C 10 ${capsuleHeight * 0.75}, 10 ${capsuleHeight * 0.75}, 0 ${capsuleHeight * 0.5} Z`}
                            fill="url(#capsuleMetal)"
                            stroke="#475569"
                            strokeWidth="1.5"
                        />

                        {/* Internal Label: VACUUM */}
                        <text x="60" y={capsuleHeight * 0.5 + 3} textAnchor="middle" fill="#0f172a" fontSize="8" fontWeight="bold" letterSpacing="1">
                            EVACUATED (VACUUM)
                        </text>
                    </g>

                    {/* Leaf Spring / D-Spring (Temp Compensator) */}
                    <path
                        d="M 140 100 Q 130 70 145 50"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    <text x="110" y="48" fill="#f59e0b" fontSize="7" fontWeight="bold">
                        LEAF SPRING
                    </text>

                    {/* Mechanical Linkage Rod */}
                    <g transform={`translate(270, 100)`}>
                        <line
                            x1="0"
                            y1="0"
                            x2="35"
                            y2={leverAngle * 1.5}
                            stroke="#cbd5e1"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        {/* Pivot Joint */}
                        <circle cx="0" cy="0" r="4" fill="#94a3b8" />
                        <circle cx="35" cy={leverAngle * 1.5} r="3" fill="#38bdf8" />

                        {/* Sector Gear / Pinion */}
                        <path
                            d={`M 40 ${leverAngle * 1.5 - 8} A 12 12 0 0 1 40 ${leverAngle * 1.5 + 8}`}
                            fill="none"
                            stroke="#94a3b8"
                            strokeWidth="3"
                        />
                        <circle cx="50" cy={leverAngle * 1.5} r="5" fill="#334155" stroke="#cbd5e1" strokeWidth="1.5" />
                        <line
                            x1="50"
                            y1={leverAngle * 1.5}
                            x2="65"
                            y2={leverAngle * 1.5 - 8}
                            stroke="#38bdf8"
                            strokeWidth="2"
                        />
                    </g>
                    <text x="290" y="80" fill="#94a3b8" fontSize="7" fontWeight="bold">
                        GEAR LINKAGE
                    </text>
                </svg>
            </div>

            {/* Status Footer Banner */}
            <div className={`mt-4 p-3.5 rounded-2xl border ${status.bg} transition-all`}>
                <div className="flex items-start gap-2.5">
                    {isStaticBlocked ? (
                        <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
                    ) : (
                        <CheckCircle2 className={`${status.color} shrink-0 mt-0.5`} size={16} />
                    )}
                    <div>
                        <h4 className={`text-xs font-bold ${status.color} uppercase tracking-wider`}>
                            {status.title}
                        </h4>
                        <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                            {status.desc}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PressureChamberVisualizer;
