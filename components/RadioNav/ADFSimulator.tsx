import React, { useState, useRef } from 'react';
import { View } from '../../types';
import { ArrowLeft, Plane, Compass } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const ADFSimulator: React.FC<Props> = ({ onNavigate }) => {
    // State
    const [aircraftPos, setAircraftPos] = useState({ x: 0, y: 150 }); // Relative to NDB at (0,0)
    const [heading, setHeading] = useState(0); // Magnetic Heading
    const [mode, setMode] = useState<'RBI' | 'RMI'>('RBI');

    // NDB is at center (0,0)
    // Coords: +y is Down (South), -y is Up (North). +x is Right (East)

    // Calculate Bearings
    const calculateBearings = () => {
        // Angle from Aircraft TO Station
        // Vector from AC to Station: (-ac.x, -ac.y)
        let bearingToStation = Math.atan2(-aircraftPos.x, -aircraftPos.y * -1) * (180 / Math.PI);
        // Correct coord sys: 
        // VOR lab used: atan2(x, -y) for Radial (Station to AC)
        // Here we want QDM (AC to Station).
        // Let's use standard map coords: Up=North(0), Right=East(90).
        // AC at (0, 150) aka South of Station.
        // Vector AC->Station is (0, -150). (North).
        // atan2(dx, -dy) -> atan2(0, 150) -> 0. Correct.

        let dx = -aircraftPos.x;
        let dy = -aircraftPos.y; // If y is positive down, -y goes up relative to AC?
        // Let's stick to screen coords: Y increases downwards.
        // Station at 0,0. AC at 0,150.
        // To get to station, we go UP (negative Y).

        let qdm = Math.atan2(dx, -dy) * (180 / Math.PI);
        if (qdm < 0) qdm += 360;

        // Relative Bearing = QDM - Heading
        let relBearing = qdm - heading;
        if (relBearing < 0) relBearing += 360;

        return { qdm, relBearing };
    };

    const { qdm, relBearing } = calculateBearings();

    // Interaction
    const draggingRef = useRef(false);
    const mapRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!draggingRef.current || !mapRef.current) return;
        const rect = mapRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const x = e.clientX - rect.left - centerX;
        const y = e.clientY - rect.top - centerY;

        // Limit radius
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
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => onNavigate?.(View.RAD_NAV_HOME)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-slate-100">ADF / NDB Simulator</h1>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Map View */}
                <div className="glass-panel p-6 rounded-2xl flex flex-col items-center">
                    <h2 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">Navigation Context</h2>

                    <div
                        ref={mapRef}
                        className="relative w-[400px] h-[400px] bg-slate-900 border border-slate-700 rounded-full shadow-inner cursor-crosshair overflow-hidden"
                        onMouseDown={() => draggingRef.current = true}
                        onMouseUp={() => draggingRef.current = false}
                        onMouseLeave={() => draggingRef.current = false}
                        onMouseMove={handleMouseMove}
                    >
                        {/* Grid / Directions */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs">N</div>
                            <div className="absolute top-1/2 right-2 -translate-y-1/2 text-xs">E</div>
                            <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-white rounded-full"></div>
                        </div>

                        {/* NDB Station */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.8)]"></div>
                            <div className="mt-2 text-[10px] font-mono text-amber-500 bg-black/50 px-1 rounded">NDB 345</div>
                        </div>

                        {/* QDM Line */}
                        <div
                            className="absolute top-1/2 left-1/2 w-[600px] h-px bg-amber-500/20 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
                            style={{ transform: `translate(-50%, -50%) rotate(${qdm - 90}deg)` }}
                        ></div>

                        {/* Aircraft */}
                        <div
                            className="absolute w-10 h-10 -ml-5 -mt-5 text-white transition-transform duration-75 pointer-events-none drop-shadow-xl"
                            style={{
                                left: `calc(50% + ${aircraftPos.x}px)`,
                                top: `calc(50% + ${aircraftPos.y}px)`,
                                transform: `rotate(${heading}deg)`
                            }}
                        >
                            <Plane size={40} className="text-white drop-shadow-md" />
                        </div>
                    </div>
                </div>

                {/* Instrument View */}
                <div className="space-y-6">
                    <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center bg-slate-800/50 relative">
                        {/* Toggle Mode */}
                        <div className="absolute top-4 right-4 flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                            <button onClick={() => setMode('RBI')} className={`px-3 py-1 text-xs font-bold rounded ${mode === 'RBI' ? 'bg-amber-500 text-black' : 'text-slate-400'}`}>RBI</button>
                            <button onClick={() => setMode('RMI')} className={`px-3 py-1 text-xs font-bold rounded ${mode === 'RMI' ? 'bg-amber-500 text-black' : 'text-slate-400'}`}>RMI</button>
                        </div>

                        <div className="relative w-72 h-72 bg-[#1a1a1a] rounded-full border-8 border-[#2a2a2a] shadow-2xl flex items-center justify-center">

                            {/* Card */}
                            {/* For RBI: Fixed Card (North Up always) */}
                            {/* For RMI: Card rotates to Magnetic Heading */}
                            <div
                                className="absolute inset-2 rounded-full transition-transform duration-500 ease-out"
                                style={{ transform: mode === 'RMI' ? `rotate(${-heading}deg)` : 'rotate(0deg)' }}
                            >
                                {/* Graduations */}
                                {Array.from({ length: 72 }).map((_, i) => {
                                    const isMajor = i % 2 === 0;
                                    const isCardinal = i % 18 === 0; // 0, 90, 180, 270
                                    return (
                                        <div
                                            key={i}
                                            className={`absolute top-0 left-1/2 -translate-x-1/2 w-0.5 ${isCardinal ? 'h-6 bg-yellow-500' : isMajor ? 'h-3 bg-white' : 'h-2 bg-white/50'} origin-bottom h-1/2`}
                                            style={{ transform: `rotate(${i * 5}deg)` }}
                                        >
                                            {isMajor && i % 6 === 0 && (
                                                <span
                                                    className="block mt-7 text-[10px] font-bold text-white transform -translate-x-1/2"
                                                    style={{ transform: `rotate(${-i * 5}deg)` }} // Counter rotate text
                                                >
                                                    {(i * 5 / 10).toString().padStart(2, '0')}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                                {/* Aircraft Symbol (Fixed center) */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <Plane size={32} className="text-orange-500" />
                                </div>
                            </div>

                            {/* Needle */}
                            {/* RBI: Points to Relative Bearing. 0 is Nose. */}
                            {/* RMI: Points to QDM (Magnetic Bearing To Station). */}
                            <div
                                className="absolute w-1 h-56 bg-gradient-to-t from-transparent via-amber-500 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.6)] rounded-full origin-center transition-transform duration-300 ease-out"
                                style={{
                                    transform: mode === 'RBI'
                                        ? `rotate(${relBearing}deg)`
                                        : `rotate(${qdm - (mode === 'RMI' ? heading : 0)}deg)`
                                    // Wait, RMI Card Rotates (-Heading). Needle Points to QDM relative to World?
                                    // If Card is rotated -Heading, then Compass North is at -Heading.
                                    // Needle needs to point at QDM.
                                    // Relative to the CONTAINER (which holds the card):
                                    // The Needle should be at (QDM - Heading). 
                                    // Yes, RMI needle effectively points to Relative Bearing physically on the instrument, but reads QDM against the card.
                                    // Let's verify: 
                                    // Heading 090. Card rotated -90. 'E' is at top. 'N' is at left.
                                    // Station is North (QDM 360).
                                    // Relative Bearing is 270 (-90). Needle points Left.
                                    // Needle physically points Left (270).
                                    // Correct. Both RBI and RMI needles physically point to RelBearing.
                                    // But on RMI, you read the number under the needle tip (which is the Card value).
                                    // At Left (270 deg physical), the Card (North at Left) reads 'N' (360/0). Correct.QDM 360.
                                }}
                            >
                                <div className="w-3 h-3 border-2 border-amber-500 rounded-full absolute -top-1.5 left-1/2 -translate-x-1/2 bg-[#1a1a1a]"></div>
                                <div className="w-3 h-3 border-2 border-amber-500 rounded-full absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-[#1a1a1a]"></div>
                            </div>

                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-xl space-y-4">
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 flex justify-between mb-2">
                                    <span>Aircraft Heading (HDG)</span>
                                    <span className="text-white font-mono">{heading}°</span>
                                </label>
                                <input
                                    type="range" min="0" max="359" value={heading}
                                    onChange={(e) => setHeading(parseInt(e.target.value))}
                                    className="w-full accent-blue-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                            <div className="bg-slate-900/50 p-3 rounded-lg text-center">
                                <span className="text-xs text-slate-500 block mb-1">Magnetic Bearing To (QDM)</span>
                                <span className="text-xl font-mono text-amber-400">{Math.round(qdm).toString().padStart(3, '0')}°</span>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-lg text-center">
                                <span className="text-xs text-slate-500 block mb-1">Relative Bearing</span>
                                <span className="text-xl font-mono text-white">{Math.round(relBearing).toString().padStart(3, '0')}°</span>
                            </div>
                        </div>

                        <div className="text-[10px] text-slate-500 p-2 bg-slate-900 rounded border border-white/5">
                            <strong>Formula:</strong> QDM = HDG + Relative Bearing
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ADFSimulator;
