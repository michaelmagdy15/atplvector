import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AltimeterGaugeProps } from './types';
import { convertHpaToInHg } from './altimetryCalculations';
import { RotateCw, RotateCcw } from 'lucide-react';

export const AltimeterGauge: React.FC<AltimeterGaugeProps> = ({
    indicatedAltitude,
    subscaleHpa,
    onSubscaleChange,
    size = 'md',
    interactive = true,
    highlightElement = null,
    className = ''
}) => {
    // Dimension presets
    const dimension = typeof size === 'number'
        ? size
        : size === 'sm' ? 220 : size === 'lg' ? 360 : 280;

    // Rotation angles for standard 3-pointer altimeter
    // Pointer 1 (100 ft needle): 1 full revolution (360 deg) per 1,000 ft
    const rotation100 = (indicatedAltitude / 1000) * 360;

    // Pointer 2 (1,000 ft needle): 1 full revolution (360 deg) per 10,000 ft
    const rotation1000 = (indicatedAltitude / 10000) * 360;

    // Pointer 3 (10,000 ft needle): 1 full revolution (360 deg) per 100,000 ft
    const rotation10000 = (indicatedAltitude / 100000) * 360;

    // Subscale dual values
    const inHg = convertHpaToInHg(subscaleHpa).toFixed(2);

    // Hatch / Barber pole visibility (visible when altitude < 10,000 ft)
    const showLowAltHatch = indicatedAltitude < 10000;

    const handleAdjustSubscale = (delta: number) => {
        if (!onSubscaleChange) return;
        const newSetting = Math.max(900, Math.min(1060, subscaleHpa + delta));
        onSubscaleChange(newSetting);
    };

    return (
        <div className={`relative flex flex-col items-center select-none ${className}`}>
            {/* Outer Bezel & Case */}
            <div
                style={{ width: dimension, height: dimension }}
                className="relative rounded-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-2 shadow-2xl border-4 border-slate-700/80 flex items-center justify-center"
            >
                {/* Dial Face SVG */}
                <svg
                    viewBox="0 0 300 300"
                    className="w-full h-full rounded-full bg-[#0a0f1d] overflow-visible"
                >
                    <defs>
                        {/* Barber Pole Striped Pattern for Low Altitude Warning (< 10,000 ft) */}
                        <pattern
                            id="altimeterHatch"
                            width="12"
                            height="12"
                            patternTransform="rotate(45 0 0)"
                            patternUnits="userSpaceOnUse"
                        >
                            <line x1="0" y1="0" x2="0" y2="12" stroke="#f59e0b" strokeWidth="6" />
                            <line x1="6" y1="0" x2="6" y2="12" stroke="#000000" strokeWidth="6" />
                        </pattern>

                        <filter id="gaugeShadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.6" />
                        </filter>
                    </defs>

                    {/* Outer Dial Ring */}
                    <circle cx="150" cy="150" r="142" fill="none" stroke="#334155" strokeWidth="2" />
                    <circle cx="150" cy="150" r="138" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />

                    {/* Standard ICAO Barber Pole (Low Altitude Warning Sector) */}
                    {showLowAltHatch && (
                        <path
                            d="M 150 150 L 195 65 A 95 95 0 0 1 235 150 Z"
                            fill="url(#altimeterHatch)"
                            opacity="0.85"
                            className={highlightElement === 'barber-pole' ? 'animate-pulse' : ''}
                        />
                    )}

                    {/* Dial Ticks (Every 100 ft major, 20 ft minor) */}
                    {Array.from({ length: 50 }).map((_, i) => {
                        const angle = i * 7.2; // 360 / 50 = 7.2 deg per 20 ft
                        const isMajor = i % 5 === 0;
                        const isHalf = i % 5 === 2.5;
                        const length = isMajor ? 16 : isHalf ? 10 : 6;
                        const strokeWidth = isMajor ? 3 : 1.5;
                        const strokeColor = isMajor ? '#ffffff' : '#94a3b8';

                        return (
                            <line
                                key={i}
                                x1="150"
                                y1="18"
                                x2="150"
                                y2={18 + length}
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                                transform={`rotate(${angle} 150 150)`}
                            />
                        );
                    })}

                    {/* Dial Numerals 0 to 9 */}
                    {Array.from({ length: 10 }).map((_, i) => {
                        const angle = (i * 36 - 90) * (Math.PI / 180);
                        const radius = 104;
                        const x = 150 + radius * Math.cos(angle);
                        const y = 150 + radius * Math.sin(angle) + 7; // vertical alignment

                        return (
                            <text
                                key={i}
                                x={x}
                                y={y}
                                textAnchor="middle"
                                fill="#f8fafc"
                                fontSize="22"
                                fontWeight="800"
                                fontFamily="monospace"
                                letterSpacing="-1px"
                            >
                                {i}
                            </text>
                        );
                    })}

                    {/* Title Text on Dial */}
                    <text x="150" y="88" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="700" letterSpacing="2">
                        ALTITUDE
                    </text>
                    <text x="150" y="100" textAnchor="middle" fill="#475569" fontSize="8" fontWeight="600">
                        FEET
                    </text>

                    {/* Kollsman Windows (Subscale) */}
                    {/* Left: inHg Window */}
                    <g transform="translate(68, 142)">
                        <rect x="0" y="0" width="46" height="18" rx="3" fill="#020617" stroke="#475569" strokeWidth="1" />
                        <text x="23" y="13" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                            {inHg}
                        </text>
                        <text x="23" y="27" textAnchor="middle" fill="#64748b" fontSize="7" fontWeight="bold">
                            IN.HG
                        </text>
                    </g>

                    {/* Right: hPa/mb Window */}
                    <g transform="translate(186, 142)">
                        <rect x="0" y="0" width="46" height="18" rx="3" fill="#020617" stroke="#475569" strokeWidth="1" />
                        <text x="23" y="13" textAnchor="middle" fill="#4ade80" fontSize="11" fontFamily="monospace" fontWeight="bold">
                            {subscaleHpa}
                        </text>
                        <text x="23" y="27" textAnchor="middle" fill="#64748b" fontSize="7" fontWeight="bold">
                            HPA
                        </text>
                    </g>

                    {/* Pointer 3: 10,000 ft Needle (Thin with inverted chevron at tip) */}
                    <g
                        transform={`rotate(${rotation10000} 150 150)`}
                        filter="url(#gaugeShadow)"
                        className={highlightElement === 'needle-10000' ? 'stroke-yellow-400' : ''}
                    >
                        {/* Needle shaft */}
                        <line x1="150" y1="150" x2="150" y2="35" stroke="#cbd5e1" strokeWidth="1.5" />
                        {/* Outer chevron flag index */}
                        <polygon points="150,22 144,34 156,34" fill="#f8fafc" />
                    </g>

                    {/* Pointer 2: 1,000 ft Needle (Broad, triangular pointer) */}
                    <g
                        transform={`rotate(${rotation1000} 150 150)`}
                        filter="url(#gaugeShadow)"
                        className={highlightElement === 'needle-1000' ? 'stroke-yellow-400' : ''}
                    >
                        <polygon
                            points="150,60 157,140 150,155 143,140"
                            fill="#f8fafc"
                            stroke="#0f172a"
                            strokeWidth="1"
                        />
                    </g>

                    {/* Pointer 1: 100 ft Needle (Longest needle, tip counterweight) */}
                    <g
                        transform={`rotate(${rotation100} 150 150)`}
                        filter="url(#gaugeShadow)"
                        className={highlightElement === 'needle-100' ? 'stroke-yellow-400' : ''}
                    >
                        {/* Needle body */}
                        <polygon
                            points="150,24 153,150 150,178 147,150"
                            fill="#ffffff"
                        />
                        {/* Tip contrast stripe */}
                        <line x1="150" y1="24" x2="150" y2="48" stroke="#38bdf8" strokeWidth="3" />
                    </g>

                    {/* Center Boss / Hub */}
                    <circle cx="150" cy="150" r="12" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                    <circle cx="150" cy="150" r="6" fill="#0f172a" />
                </svg>

                {/* Subscale Rotary Knob (Cockpit lower left position) */}
                {interactive && (
                    <div className="absolute -bottom-4 -left-4 flex items-center gap-1 bg-slate-900 border border-slate-700 p-1.5 rounded-2xl shadow-xl">
                        <button
                            onClick={() => handleAdjustSubscale(-1)}
                            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all active:scale-95"
                            title="Decrease Subscale (-1 hPa)"
                        >
                            <RotateCcw size={14} />
                        </button>
                        <div className="px-1 text-[10px] font-mono font-bold text-emerald-400">
                            {subscaleHpa}
                        </div>
                        <button
                            onClick={() => handleAdjustSubscale(+1)}
                            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all active:scale-95"
                            title="Increase Subscale (+1 hPa)"
                        >
                            <RotateCw size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* Needle Legend Indicator */}
            <div className="mt-4 flex items-center justify-center gap-4 text-[10px] font-medium text-slate-400">
                <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 bg-sky-400 rounded-full inline-block"></span>
                    100 ft needle (360° = 1,000')
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-1.5 bg-white rounded-sm inline-block"></span>
                    1,000 ft needle
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 border border-slate-300 inline-block rotate-45"></span>
                    10,000 ft pointer
                </span>
            </div>
        </div>
    );
};

export default AltimeterGauge;
