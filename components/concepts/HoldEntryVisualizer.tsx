import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Line } from '@react-three/drei';
import { ArrowLeft, RotateCw, RotateCcw, Info } from 'lucide-react';
import * as THREE from 'three';

// --- 3D Scene Components ---

const EntrySectors = ({ inboundTrack, isRightTurns }: { inboundTrack: number, isRightTurns: boolean }) => {
    // Sector definitions relative to the HOLDING FIX.
    // Standard Hold (Right Turns):
    // Sector 1 (Parallel): 110 deg
    // Sector 2 (Offset/Teardrop): 70 deg
    // Sector 3 (Direct): 180 deg

    // The "inbound track" is the reference.
    // If Inbound is 360...
    // Sector 1 (Parallel): 110 deg slice.
    // Sector 2 (Offset): 70 deg slice.
    // Sector 3 (Direct): 180 deg slice.

    // We visualize these sectors as pie slices on the ground.
    // We rotate the whole group based on the inbound track.

    // Colors
    const colorDirect = "#10b981"; // Green
    const colorParallel = "#3b82f6"; // Blue
    const colorOffset = "#f59e0b"; // Orange

    const rotation = THREE.MathUtils.degToRad(-inboundTrack); // Rotate opposite to compass

    return (
        <group rotation={[0, rotation, 0]}>
            {/* DIRECT SECTOR (180 deg) */}
            {/* Centered? No, defined by the fix. */}
            {/* Logic: 
                Direct is usually the "easiest" entry. It covers 180 degrees.
                For Right Turns:
                - Parallel: Inbound + 110 (to the non-holding side)
                - Offset: Inbound - 70 (to the holding side)
                - Direct: The rest.
            */}

            {/* Let's draw CircleSegments */}
            <mesh rotation={[-Math.PI / 2, 0, isRightTurns ? THREE.MathUtils.degToRad(-70) : THREE.MathUtils.degToRad(70)]}>
                {/* DIRECT */}
                <circleGeometry args={[4, 64, 0, Math.PI]} />
                <meshStandardMaterial color={colorDirect} transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>

            <mesh rotation={[-Math.PI / 2, 0, isRightTurns ? THREE.MathUtils.degToRad(110) : THREE.MathUtils.degToRad(-110)]}>
                {/* PARALLEL (110 deg) */}
                <circleGeometry args={[4, 64, 0, THREE.MathUtils.degToRad(110)]} />
                <meshStandardMaterial color={colorParallel} transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>

            <mesh rotation={[-Math.PI / 2, 0, 0]}> {/* Starts at 0, goes to 70/-70 */}
                {/* OFFSET (70 deg) */}
                <circleGeometry args={[4, 64, 0, THREE.MathUtils.degToRad(70) * (isRightTurns ? -1 : 1)]} />
                <meshStandardMaterial color={colorOffset} transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>

            {/* Labels */}
            <Html position={[2, 0, 2]}>
                <div className="text-white font-bold text-xs drop-shadow-md">Direct</div>
            </Html>
            <Html position={isRightTurns ? [-2, 0, 2] : [-2, 0, -2]}>
                <div className="text-white font-bold text-xs drop-shadow-md">Parallel</div>
            </Html>
            <Html position={isRightTurns ? [-1, 0, -1] : [-1, 0, 1]}>
                <div className="text-white font-bold text-xs drop-shadow-md">Offset</div>
            </Html>

        </group>
    );
};

const Aircraft = ({ heading }: { heading: number }) => {
    // Simply an arrow pointing in the heading direction at the center
    // Wait, in this viz, the aircraft approaches the FIX.
    // So the aircraft position is relative to the center.
    // Let's keep the aircraft static at the "bottom" looking up, and rotate the sectors?
    // OR: Keep the sectors static (oriented to North) and move the aircraft.
    // "Static Sectors" is better for situational awareness.

    const r = 3.5;
    const x = r * Math.sin(THREE.MathUtils.degToRad(heading + 180));
    const z = r * Math.cos(THREE.MathUtils.degToRad(heading + 180));

    return (
        <group position={[x, 0.5, z]} rotation={[0, THREE.MathUtils.degToRad(-heading), 0]}>
            {/* Plane shape */}
            <mesh>
                <coneGeometry args={[0.3, 1, 8]} />
                <meshStandardMaterial color="white" />
            </mesh>
            <Html position={[0, -0.8, 0]} center>
                <div className="bg-black/50 px-2 py-0.5 rounded text-[10px] text-white whitespace-nowrap">
                    HDG {heading}°
                </div>
            </Html>
        </group>
    );
};

// --- Main Component ---

interface Props {
    onBack: () => void;
}

const HoldEntryVisualizer: React.FC<Props> = ({ onBack }) => {
    const [inboundTrack, setInboundTrack] = useState(360);
    const [heading, setHeading] = useState(180); // Aircraft heading
    const [isRightTurns, setIsRightTurns] = useState(true);

    // Determine current entry
    // Need to normalize angles
    const normalize = (deg: number) => (deg + 3600) % 360;

    // Relative heading to the fix INBOUND track
    const relHdg = normalize(heading - inboundTrack);

    // Logic for Standard (Right) Hold:
    // Sector 1 (Parallel): Heading is roughly opposite to inbound.
    // Let's use the standard "Teardrop is 70 deg from inbound" rule.
    // Actually, simpler:
    // If we are approaching the fix on Heading X.
    // Inbound Track of Hold is Y.

    // 1. Determine "Sector 3 (Direct)"
    // It is normally a widet cone.

    // Let's hardcode the logic for "What sector am I in?" for text display
    // Only approximation without complex geometry check.

    return (
        <div className="h-screen w-full relative bg-slate-950 overflow-hidden flex flex-col md:flex-row">

            {/* Sidebar Controls */}
            <div className="w-full md:w-80 bg-slate-900 border-r border-white/10 p-6 flex flex-col z-10 shadow-2xl overflow-y-auto">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to Lab
                </button>

                <div className="mb-6">
                    <h2 className="text-2xl font-black text-white">Hold Entry</h2>
                    <p className="text-sm text-slate-400 mt-2">
                        Visualize the three standard ICAO holding entry sectors.
                    </p>
                </div>

                <div className="space-y-8 flex-grow">
                    {/* Hold Parameters */}
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase mb-4">Hold Definition</div>

                        <div className="mb-4">
                            <label className="text-sm text-slate-300 block mb-2">Inbound Track</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range" min="0" max="360"
                                    value={inboundTrack} onChange={(e) => setInboundTrack(Number(e.target.value))}
                                    className="flex-grow h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                                <span className="font-mono text-white w-12 text-right">{inboundTrack}°</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsRightTurns(true)}
                                className={`flex-1 py-2 rounded-lg border text-sm font-bold flex items-center justify-center gap-2 ${isRightTurns ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'border-white/10 text-slate-400 hover:bg-white/5'}`}
                            >
                                <RotateCw size={16} /> Right
                            </button>
                            <button
                                onClick={() => setIsRightTurns(false)}
                                className={`flex-1 py-2 rounded-lg border text-sm font-bold flex items-center justify-center gap-2 ${!isRightTurns ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'border-white/10 text-slate-400 hover:bg-white/5'}`}
                            >
                                <RotateCcw size={16} /> Left
                            </button>
                        </div>
                    </div>

                    {/* Aircraft Heading */}
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase mb-4">Aircraft State</div>
                        <label className="text-sm text-slate-300 block mb-2">My Heading</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range" min="0" max="360"
                                value={heading} onChange={(e) => setHeading(Number(e.target.value))}
                                className="flex-grow h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <span className="font-mono text-white w-12 text-right">{heading}°</span>
                        </div>
                    </div>

                    {/* Guidance Box */}
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-white/10">
                        <div className="flex items-start gap-3">
                            <Info className="text-blue-400 shrink-0 mt-0.5" size={16} />
                            <div>
                                <h4 className="text-sm font-bold text-white">Entry Rule</h4>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                    Fly towards the fix on heading {heading}°.
                                    Check which colored sector is "ahead" of you on the rose relative to the inbound track ({inboundTrack}°).
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* 3D Viewport */}
            <div className="flex-grow relative bg-[#0f172a]">
                <Canvas shadows camera={{ position: [0, 8, 0], fov: 60 }}> {/* Top Down View mostly */}
                    <color attach="background" args={['#0f172a']} />

                    <ambientLight intensity={0.8} />
                    <pointLight position={[10, 10, 10]} intensity={1} />

                    {/* Compass Rose on Ground */}
                    <group rotation={[-Math.PI / 2, 0, 0]}>
                        <polarGridHelper args={[10, 8, 1, 64]} />
                    </group>

                    {/* The Fix */}
                    <mesh position={[0, 0, 0]}>
                        <sphereGeometry args={[0.2]} />
                        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.5} />
                    </mesh>
                    <Html position={[0, 0.5, 0]}>
                        <div className="text-white font-black text-xs">FIX</div>
                    </Html>

                    {/* Inbound Track Line */}
                    {/* We draw a line representing the HOLDING AXIS */}
                    <group rotation={[0, THREE.MathUtils.degToRad(-inboundTrack), 0]}>
                        {/* Inbound Leg (Solid) */}
                        <mesh position={[0, 0, 3]}>
                            <boxGeometry args={[0.05, 0.05, 6]} />
                            <meshStandardMaterial color="white" />
                        </mesh>
                        {/* Arrow head */}
                        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                            <coneGeometry args={[0.2, 0.5, 8]} />
                            <meshStandardMaterial color="white" />
                        </mesh>
                    </group>

                    {/* The Sectors */}
                    <EntrySectors inboundTrack={inboundTrack} isRightTurns={isRightTurns} />

                    {/* The Aircraft */}
                    <Aircraft heading={heading} />

                    <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
                </Canvas>

                {/* Legend */}
                <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-xs text-white font-bold">Direct (Sector 3)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-xs text-white font-bold">Parallel (Sector 1)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-xs text-white font-bold">Offset (Sector 2)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HoldEntryVisualizer;
