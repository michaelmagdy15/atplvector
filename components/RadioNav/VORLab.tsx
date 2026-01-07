import React, { useState, useEffect, useRef } from 'react';
import { View } from '../../types';
import { ArrowLeft, RotateCw, Plane, Navigation } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const VORLab: React.FC<Props> = ({ onNavigate }) => {
    // State
    const [obs, setObs] = useState(360); // Selected Radial (0-359)
    const [aircraftPos, setAircraftPos] = useState({ x: 100, y: 100 }); // Relative to center (0,0)
    const [heading, setHeading] = useState(0); // Aircraft heading

    // Derived Calculations
    const calculateVorData = () => {
        // VOR is at (0,0)
        // Aircraft angle from VOR (Radial)
        // atan2(y, x) gives radians. specific handling for compass degrees.
        // Coordinate system: Up is North (0 deg/ -y), Right is East (90 deg / +x)

        // Convert Cartesian to Compass bearing from VOR to Aircraft (The "Radial" the aircraft is ON)
        // Vectors: VOR (0,0), AC (x, y)
        // Angle = atan2(x, -y) * (180/PI). 
        let radial = Math.atan2(aircraftPos.x, -aircraftPos.y) * (180 / Math.PI);
        if (radial < 0) radial += 360;

        // QDM (Magnetic Bearing TO Station) = (Radial + 180) % 360
        const qdm = (radial + 180) % 360;

        // Deviation Calculation
        // Difference between OBS and Radial
        let diff = radial - obs;
        // Normalize to -180 to +180
        while (diff <= -180) diff += 360;
        while (diff > 180) diff -= 360;

        // TO/FROM Logic
        // If diff is between -90 and +90, we are on the "FROM" side? 
        // Standard VOR: 
        // If |Radial - OBS| < 90, Flag is FROM.
        // If |Radial - OBS| > 90, Flag is TO.

        let flag: 'TO' | 'FROM' | 'OFF' = 'OFF';
        let deflection = 0; // -10 to +10 (dots)

        // Check angular difference for flag
        const absDiff = Math.abs(diff);
        if (absDiff < 89) flag = 'FROM';
        else if (absDiff > 91) flag = 'TO';
        else flag = 'OFF'; // Cone of confusion / abeam (simplified)

        // Deflection Logic
        // Needle shows direction TO the radial.
        // If OBS is 360 (North), and we are on Radial 010 (East of course), NEEDLE should point LEFT (West).
        // Formula: Deviation = Radial - OBS.
        // If Flag is FROM: Linear deviation.
        // If Flag is TO: Invert? Handled by convention.

        // Actually, easiest way: 
        // Angular difference between Aircraft Radial and OBS.
        // Determine "Sensing":
        // Correct sensing if aircraft heading approx matches OBS? No, VOR is position based only.

        // Let's use standard deviation logic:
        // Deflection is simply the angular difference, clamped to +/- 10 degrees usually (full scale).
        // Standard VOR Full Scale Deflection is 10 degrees.

        // Re-calc diff relative to the "Selected Course Line"
        // If OBS is 360. Course line runs S->N.
        // If we are at 010 Radial (Right of course). Needle should be LEFT (-).
        // Diff = 10 - 360 = 10. 
        // So Needle = -Diff * Gain?
        // Let's refine.

        let deviationAngle = diff;

        // If we are in "TO" sector, the radial we are ON is reciprocal to OBS.
        // e.g. OBS 360. We are South (Radial 180). Flag TO.
        // We are ON the line. Deviation 0.
        // If we move East (Radial 170). We are Right of centerline (looking North). Needle should be Left.
        // Radial 170 - OBS 360 = -190 => +170. 

        // Simplified Logic used in sims:
        // interceptAngle = obs - radial;
        // normalize interceptAngle
        // if abs(interceptAngle) > 90: It's TO
        // deviation based on (interceptAngle + 180) if TO?

        // Let's try this:
        // Course Error = OBS - Radial
        let courseError = obs - radial;
        while (courseError <= -180) courseError += 360;
        while (courseError > 180) courseError -= 360;

        if (Math.abs(courseError) < 90) {
            flag = 'FROM';
            deflection = courseError;
        } else {
            flag = 'TO';
            // Invert logic for TO
            // e.g. OBS 360. Radial 170. Error = 190 -> -170.
            // We want deflection to zero at 180.
            if (courseError > 0) deflection = courseError - 180;
            else deflection = courseError + 180;
        }

        // Clamp deflection to +/- 10 degrees for display
        const clampedDeflection = Math.max(-10, Math.min(10, deflection));

        return { radial, qdm, flag, deflection: clampedDeflection, rawDeflection: deflection };
    };

    const data = calculateVorData();

    // Interaction Handlers
    const draggingRef = useRef(false);
    const mapRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!draggingRef.current || !mapRef.current) return;
        const rect = mapRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const x = e.clientX - rect.left - centerX;
        const y = e.clientY - rect.top - centerY;

        // Limit radius to keep in circle
        const dist = Math.sqrt(x * x + y * y);
        const maxRad = Math.min(centerX, centerY) - 20;

        if (dist > maxRad) {
            const angle = Math.atan2(y, x);
            setAircraftPos({
                x: Math.cos(angle) * maxRad,
                y: Math.sin(angle) * maxRad
            });
        } else {
            setAircraftPos({ x, y });
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => onNavigate?.(View.RAD_NAV_HOME)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-slate-100">VOR Simulator</h1>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* MAP VIEW */}
                <div className="glass-panel p-6 rounded-2xl flex flex-col items-center">
                    <h2 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Navigation Map</h2>

                    <div
                        ref={mapRef}
                        className="relative w-[400px] h-[400px] bg-slate-900 border border-slate-700 rounded-full shadow-inner cursor-crosshair overflow-hidden"
                        onMouseDown={() => draggingRef.current = true}
                        onMouseUp={() => draggingRef.current = false}
                        onMouseLeave={() => draggingRef.current = false}
                        onMouseMove={handleMouseMove}
                    >
                        {/* Grid / Compass Rose */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-px bg-slate-400"></div>
                            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-px bg-slate-400"></div>
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs">N</div>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs">S</div>
                            <div className="absolute top-1/2 right-2 -translate-y-1/2 text-xs">E</div>
                            <div className="absolute top-1/2 left-2 -translate-y-1/2 text-xs">W</div>
                        </div>

                        {/* VOR Station */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[14px] border-l-transparent border-r-transparent border-b-blue-500"></div>
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-blue-400 bg-slate-900/80 px-1 rounded">
                                ABC 112.5
                            </div>
                        </div>

                        {/* Selected Radial (OBS) Line */}
                        <div
                            className="absolute top-1/2 left-1/2 w-[600px] h-0.5 bg-green-500/30 -translate-y-1/2 -translate-x-1/2 pointer-events-none transform"
                            style={{ transform: `translate(-50%, -50%) rotate(${obs - 90}deg)` }}
                        ></div>

                        {/* Aircraft */}
                        <div
                            className="absolute w-8 h-8 -ml-4 -mt-4 text-white transition-transform duration-75 pointer-events-none drop-shadow-lg"
                            style={{
                                left: `calc(50% + ${aircraftPos.x}px)`,
                                top: `calc(50% + ${aircraftPos.y}px)`,
                                transform: `rotate(${heading}deg)`
                            }}
                        >
                            <Plane size={32} fill="white" className="text-slate-900" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-4">Drag the aircraft to change position around the VOR.</p>
                </div>

                {/* INSTRUMENT VIEW */}
                <div className="space-y-6">
                    {/* CDI Instrument */}
                    <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center bg-slate-800/50">
                        <div className="relative w-64 h-64 bg-slate-900 rounded-full border-4 border-slate-600 shadow-2xl flex items-center justify-center">

                            {/* Compass Card Elements (Static for standard CDI, rotating for HSI - keeping simple CDI for now) */}
                            <div className="absolute top-2 text-yellow-400 font-mono text-xl font-bold bg-slate-800 px-2 rounded border border-white/10">
                                {obs.toString().padStart(3, '0')}°
                            </div>

                            {/* Dots */}
                            <div className="absolute flex gap-3">
                                <span className={`w-2 h-2 rounded-full border border-white/30 ${Math.abs(data.deflection) > 9 ? 'bg-white/10' : ''}`}></span>
                                <span className="w-2 h-2 rounded-full border border-white/30"></span>
                                <span className="w-2 h-2 rounded-full border border-white/30"></span>
                                <span className="w-2 h-2 rounded-full border border-white/30"></span>
                                <div className="w-4 h-4 rounded-full border-2 border-slate-500 bg-slate-800 z-10"></div>
                                <span className="w-2 h-2 rounded-full border border-white/30"></span>
                                <span className="w-2 h-2 rounded-full border border-white/30"></span>
                                <span className="w-2 h-2 rounded-full border border-white/30"></span>
                                <span className="w-2 h-2 rounded-full border border-white/30"></span>
                            </div>

                            {/* Needle */}
                            <div
                                className="absolute w-1 h-40 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-transform duration-300 ease-out origin-center"
                                style={{ transform: `translateX(${-data.deflection * 7}px)` }} // 7px per degree? approx
                            ></div>

                            {/* TO/FROM Flag */}
                            <div className="absolute flex items-center gap-8">
                                <div className={`px-2 py-0.5 text-xs font-black rounded ${data.flag === 'TO' ? 'bg-white text-black' : 'bg-slate-800 text-slate-700'}`}>TO</div>
                                <div className={`px-2 py-0.5 text-xs font-black rounded ${data.flag === 'FROM' ? 'bg-white text-black' : 'bg-slate-800 text-slate-700'}`}>FR</div>
                            </div>

                            {/* OBS Knob */}
                            <div className="absolute -bottom-8 -left-8">
                                <div className="text-xs font-bold text-slate-500 mb-1 ml-1">OBS</div>
                                <div className="relative w-16 h-16 bg-slate-700 rounded-full border-b-4 border-slate-900 shadow-xl flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                                    onClick={() => setObs((o) => (o + 5) % 360)}
                                // Could add drag to rotate logic later
                                >
                                    <RotateCw className="text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Panel */}
                    <div className="glass-panel p-6 rounded-xl space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                                <label className="text-xs text-slate-500 block">Current Radial</label>
                                <span className="text-xl font-mono text-green-400">{Math.round(data.radial).toString().padStart(3, '0')}°</span>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg">
                                <label className="text-xs text-slate-500 block">Deviation</label>
                                <span className={`text-xl font-mono ${Math.abs(data.deflection) < 2 ? 'text-green-400' : 'text-red-400'}`}>
                                    {data.deflection > 0 ? 'L' : data.deflection < 0 ? 'R' : ''} {Math.abs(Math.round(data.deflection))}°
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <h3 className="text-sm font-bold text-white">Controls</h3>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400 flex justify-between">
                                    <span>OBS Selection</span>
                                    <span>{obs}°</span>
                                </label>
                                <input
                                    type="range" min="0" max="359" value={obs}
                                    onChange={(e) => setObs(parseInt(e.target.value))}
                                    className="w-full accent-yellow-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-slate-400 flex justify-between">
                                    <span>Aircraft Heading</span>
                                    <span>{heading}°</span>
                                </label>
                                <input
                                    type="range" min="0" max="359" value={heading}
                                    onChange={(e) => setHeading(parseInt(e.target.value))}
                                    className="w-full accent-blue-500"
                                />
                                <p className="text-[10px] text-slate-500 italic">Heading does not affect VOR indications, only map visualization.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VORLab;
