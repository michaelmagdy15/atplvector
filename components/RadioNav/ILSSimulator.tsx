import React, { useState } from 'react';
import { View } from '../../types';
import { ArrowLeft, Plane, LandPlot } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const ILSSimulator: React.FC<Props> = ({ onNavigate }) => {
    // 0,0 is Threshold center.
    // X is lateral (+Right, -Left). Y is longitudinal (-Approach, +Runway).
    // Z is altitude.

    // We simplify:
    // Vertical View: Distance vs Altitude.
    // Lateral View: X vs Y.

    const [distance, setDistance] = useState(5); // NM from threshold
    const [lateralOffset, setLateralOffset] = useState(0); // Degrees off centerline (negative left, positive right)
    const [altitude, setAltitude] = useState(1600); // Feet

    // Constants
    const GLIDESLOPE_ANGLE = 3.0; // Degrees
    const LOC_WIDTH = 2.5; // Full scale deflection is +/- 2.5 degrees usually
    const GS_WIDTH = 0.7; // Full scale deflection is +/- 0.7 degrees usually

    // Calculations
    const altitudeNM = altitude / 6076;
    const currentAngle = Math.atan2(altitudeNM, distance) * (180 / Math.PI);

    // Deviation Calculation (Dots)
    // Vertical
    // Target Angle - Current Angle.
    // If Current < Target, we are LOW (Needle touches Top, indicating fly Up).
    // Let's stick to "Deviation from Path".
    // deviation = Current - Target.
    // If deviation is negative (Current < Target), we are LOW. Needle should be HIGH.

    const gsDeviationDegrees = currentAngle - GLIDESLOPE_ANGLE;
    // Full scale (5 dots?) is 0.7 deg.
    const gsDots = - (gsDeviationDegrees / GS_WIDTH) * 2; // Scaling factor?
    // Standard: 5 dots = Full Scale.
    // Lets map 0.7 deg to 2.5 dots (common) or 5 dots?
    // Let's assume standard consumer display: 2 dots range? Or 5 dots.
    // Let's use 2 dots = Full Scale for simplicity or 2.5.
    // Actually typically 5 dots up/down.
    // Limits: +/- 5.

    const gsDotsClamped = Math.max(-2.5, Math.min(2.5, - (gsDeviationDegrees / GS_WIDTH) * 2.5));

    // Lateral (Loc)
    // If Lateral Offset is POSITIVE (Right), we are Right of Course. Needle should be LEFT.
    // locDots = - (Offset / Width) * Scale
    const locDotsClamped = Math.max(-2.5, Math.min(2.5, -(lateralOffset / LOC_WIDTH) * 2.5));

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => onNavigate?.(View.RAD_NAV_HOME)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                    <LandPlot className="text-sky-400" />
                    <h1 className="text-2xl font-bold text-slate-100">ILS Simulator</h1>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">

                {/* Visuals Column */}
                <div className="space-y-6">
                    {/* Top Down (LOC) */}
                    <div className="glass-panel p-4 rounded-xl relative overflow-hidden h-64 bg-slate-900 border border-slate-700">
                        <div className="absolute top-2 left-2 text-xs font-bold text-slate-500 uppercase">Lateral (Localizer)</div>
                        {/* Runway */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-4 bg-slate-700"></div>
                        {/* Centerline */}
                        <div className="absolute right-20 left-0 top-1/2 h-px bg-white/20 border-t border-dashed border-white/50"></div>

                        {/* Lobes Visualization */}
                        <div className="absolute right-20 top-1/2 -translate-y-1/2 origin-right w-[400px] h-[300px] bg-blue-500/5" style={{ transform: 'perspective(500px) rotateY(10deg)' }}></div>
                        <div className="absolute right-20 top-1/2 -translate-y-1/2 origin-right w-[400px] h-[300px] bg-yellow-500/5" style={{ transform: 'perspective(500px) rotateY(-10deg)' }}></div>

                        {/* Aircraft Symbol */}
                        <div
                            className="absolute right-20 w-6 h-6 text-white transition-all duration-300"
                            style={{
                                right: `${(distance / 10) * 100}%`, // Approx scaling
                                top: `50%`,
                                transform: `translate(50%, -50%) translateY(${lateralOffset * 20}px) rotate(-90deg)`
                            }}
                        >
                            <Plane size={24} className="text-sky-400 fill-sky-900" />
                        </div>
                    </div>

                    {/* Side View (GS) */}
                    <div className="glass-panel p-4 rounded-xl relative overflow-hidden h-64 bg-slate-900 border border-slate-700">
                        <div className="absolute top-2 left-2 text-xs font-bold text-slate-500 uppercase">Vertical (Glidepath)</div>
                        {/* Ground */}
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-emerald-900/30 border-t border-emerald-500/20"></div>
                        {/* Runway */}
                        <div className="absolute bottom-8 right-0 w-20 h-1 bg-slate-400"></div>

                        {/* 3 Degree Slope */}
                        <div className="absolute bottom-8 right-20 w-[500px] h-0.5 bg-yellow-500/30 origin-bottom-right" style={{ transform: 'rotate(-3deg)' }}></div>

                        {/* Aircraft Symbol */}
                        <div
                            className="absolute w-6 h-6 text-white transition-all duration-300"
                            style={{
                                right: `${(distance / 10) * 100}%`,
                                bottom: `32px`,
                                transform: `translate(50%, 50%) translateY(${-altitude / 20}px)`
                            }}
                        >
                            <Plane size={24} className="text-sky-400 fill-sky-900" />
                        </div>
                    </div>
                </div>

                {/* Instrument & Controls Column */}
                <div className="space-y-6">
                    {/* HSI / ILS Display */}
                    <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center bg-slate-800/50">
                        <div className="relative w-64 h-64 bg-slate-900 rounded-full border-4 border-slate-600 shadow-2xl flex items-center justify-center overflow-hidden">
                            {/* Static Rose */}
                            <div className="absolute inset-2 border-2 border-white/10 rounded-full"></div>

                            {/* LOC Scale (Horizontal) */}
                            <div className="absolute flex gap-4">
                                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                                <div className="w-3 h-3 border-2 border-white rounded-full bg-transparent"></div>
                                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                            </div>

                            {/* GS Scale (Vertical) */}
                            <div className="absolute flex flex-col gap-4">
                                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                                <div className="w-3 h-3 border border-transparent rounded-full bg-transparent"></div>
                                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                                <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                            </div>

                            {/* LOC Needle (Vertical bar moving left/right) */}
                            <div
                                className="absolute w-1 h-40 bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)] transition-transform duration-300"
                                style={{ transform: `translateX(${locDotsClamped * 20}px)` }}
                            ></div>

                            {/* GS Needle (Horizontal bar moving up/down) */}
                            <div
                                className="absolute h-1 w-40 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)] transition-transform duration-300"
                                style={{ transform: `translateY(${-gsDotsClamped * 20}px)` }}
                            ></div>
                        </div>
                        <div className="mt-4 flex gap-4 text-xs font-mono">
                            <span className={`${Math.abs(locDotsClamped) < 0.5 ? 'text-green-400' : 'text-slate-400'}`}>LOC: {locDotsClamped === 0 ? 'ON TRK' : locDotsClamped > 0 ? 'FLY RIGHT >' : '< FLY LEFT'}</span>
                            <span className={`${Math.abs(gsDotsClamped) < 0.5 ? 'text-green-400' : 'text-slate-400'}`}>GS: {gsDotsClamped === 0 ? 'ON PATH' : gsDotsClamped > 0 ? 'FLY UP ^' : 'v FLY DOWN'}</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="glass-panel p-6 rounded-xl space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs text-slate-400 flex justify-between">
                                <span>Distance from Threshold</span>
                                <span className="text-white font-mono">{distance} NM</span>
                            </label>
                            <input type="range" min="0.5" max="10" step="0.1" value={distance} onChange={(e) => setDistance(parseFloat(e.target.value))} className="w-full accent-slate-500" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-slate-400 flex justify-between">
                                <span>Altitude (QNH)</span>
                                <span className="text-white font-mono">{altitude} ft</span>
                            </label>
                            <input type="range" min="0" max="4000" step="50" value={altitude} onChange={(e) => setAltitude(parseInt(e.target.value))} className="w-full accent-yellow-500" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-slate-400 flex justify-between">
                                <span>Lateral Offset</span>
                                <span className="text-white font-mono">{lateralOffset}°</span>
                            </label>
                            <input type="range" min="-5" max="5" step="0.1" value={lateralOffset} onChange={(e) => setLateralOffset(parseFloat(e.target.value))} className="w-full accent-sky-500" />
                            <div className="flex justify-between text-[10px] text-slate-600">
                                <span>Left of Course</span>
                                <span>Right of Course</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ILSSimulator;
