import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { ArrowLeft } from 'lucide-react';
import * as THREE from 'three';

const AircraftBank = ({ bankAngle }: { bankAngle: number }) => {
    return (
        <group rotation={[0, 0, THREE.MathUtils.degToRad(-bankAngle)]}>
            {/* Simple Plane Model */}
            <mesh>
                <boxGeometry args={[1, 0.5, 4]} />
                <meshStandardMaterial color="#cbd5e1" />
            </mesh>
            <mesh>
                <boxGeometry args={[8, 0.1, 1]} />
                <meshStandardMaterial color="#94a3b8" />
            </mesh>
            <mesh position={[0, 0.5, 1.8]}>
                <boxGeometry args={[2, 0.1, 0.8]} />
                <meshStandardMaterial color="#94a3b8" />
            </mesh>
        </group>
    );
};

const VectorForce = ({ magnitude, direction, color, label }: any) => {
    // direction is Euler rotation [x, y, z] in radians
    const length = magnitude * 0.1; // Scale factor
    return (
        <group rotation={direction}>
            <mesh position={[0, length / 2, 0]}>
                <cylinderGeometry args={[0.05, 0.05, length, 8]} />
                <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0, length + 0.25, 0]}>
                <coneGeometry args={[0.15, 0.5, 16]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {label && (
                <Html position={[0, length + 0.5, 0]}>
                    <div className="text-[10px] font-bold px-1 rounded bg-black/60 text-white border border-white/20 whitespace-nowrap">
                        {label}
                    </div>
                </Html>
            )}
        </group>
    );
};

interface Props {
    onBack: () => void;
}

const TurnPerformance: React.FC<Props> = ({ onBack }) => {
    const [bankAngle, setBankAngle] = useState(0);
    const [airspeed, setAirspeed] = useState(150); // knots

    // Physics
    // Load Factor (n) = 1 / cos(bank)
    // Only valid for level turn
    const bankRad = THREE.MathUtils.degToRad(bankAngle);
    const loadFactor = 1 / Math.cos(bankRad);

    // Stall Speed Increase
    // Vs_new = Vs_old * sqrt(n)
    const baseStall = 60;
    const newStall = baseStall * Math.sqrt(loadFactor);

    // Radius of Turn
    // R = V^2 / (g * tan(bank))
    // V in m/s
    const v_ms = airspeed * 0.514444;
    const g = 9.81;
    // R in meters
    const radius = (bankAngle === 0) ? Infinity : (v_ms * v_ms) / (g * Math.tan(bankRad));

    // Rate of Turn (deg/sec)
    // ROT = (g * tan(bank)) / V
    // Result in rad/s -> convert to deg/s
    const rot_rad = (bankAngle === 0) ? 0 : (g * Math.tan(bankRad)) / v_ms;
    const rot_deg = THREE.MathUtils.radToDeg(rot_rad);

    // Color code load factor dangers
    const nColor = loadFactor > 2 ? (loadFactor > 4 ? "text-red-500" : "text-amber-500") : "text-white";

    return (
        <div className="h-screen w-full relative bg-slate-950 overflow-hidden flex flex-col md:flex-row">

            {/* Sidebar Controls */}
            <div className="w-full md:w-80 bg-slate-900 border-r border-white/10 p-6 flex flex-col z-10 shadow-2xl overflow-y-auto">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to Lab
                </button>

                <div className="mb-6">
                    <h2 className="text-2xl font-black text-white">Turn Performance</h2>
                    <p className="text-sm text-slate-400 mt-2">
                        Analyze the relationship between Bank Angle, Load Factor, and Turn Radius.
                    </p>
                </div>

                <div className="space-y-8 ">
                    {/* Bank Angle */}
                    <div>
                        <div className="flex justify-between text-sm font-bold mb-2">
                            <span className="text-blue-400">Bank Angle (Ø)</span>
                            <span className="text-white">{bankAngle}°</span>
                        </div>
                        <input
                            type="range" min="0" max="80" step="1"
                            value={bankAngle} onChange={(e) => setBankAngle(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>

                    {/* Airspeed */}
                    <div>
                        <div className="flex justify-between text-sm font-bold mb-2">
                            <span className="text-emerald-400">TAS (Knots)</span>
                            <span className="text-white">{airspeed} kts</span>
                        </div>
                        <input
                            type="range" min="60" max="300" step="5"
                            value={airspeed} onChange={(e) => setAirspeed(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                    </div>

                    {/* Outputs */}
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                        <div className="flex justify-between items-end border-b border-white/5 pb-2">
                            <span className="text-xs text-slate-400">Load Factor (n)</span>
                            <span className={`text-xl font-black font-mono ${nColor}`}>
                                {loadFactor.toFixed(2)} G
                            </span>
                        </div>

                        <div className="flex justify-between items-end border-b border-white/5 pb-2">
                            <span className="text-xs text-slate-400">Stall Speed (Vs)</span>
                            <div className="text-right">
                                <span className={`text-lg font-bold font-mono ${newStall > airspeed ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                                    {Math.round(newStall)} kts
                                </span>
                                {newStall > airspeed && <div className="text-[10px] text-red-500 font-bold">STALL!</div>}
                            </div>
                        </div>

                        <div className="flex justify-between items-end">
                            <span className="text-xs text-slate-400">Turn Radius</span>
                            <span className="text-lg font-bold font-mono text-white">
                                {radius === Infinity ? '∞' : `${Math.round(radius)} m`}
                            </span>
                        </div>

                        <div className="flex justify-between items-end">
                            <span className="text-xs text-slate-400">Rate 1 Turn?</span>
                            <span className="text-sm font-bold font-mono text-white">
                                {Math.abs(rot_deg - 3) < 0.2 ? 'YES' : 'NO'} ({rot_deg.toFixed(1)}°/s)
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3D Viewport */}
            <div className="flex-grow relative bg-[#0f172a]">
                <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
                    <color attach="background" args={['#0f172a']} />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[5, 10, 5]} intensity={1} />

                    {/* Center Plane */}
                    <AircraftBank bankAngle={bankAngle} />

                    {/* Vector Visualization */}
                    {/* Vertical Lift Component (Always opposes Weight, must increase to maintain level) */}
                    {/* Lv = Weight */}
                    {/* Total Lift = Weight / cos(bank) */}

                    {/* Show Total Lift Vector (Perpendicular to wings) */}
                    {/* Rotation Z is -bankAngle */}
                    <VectorForce
                        magnitude={loadFactor * 20}
                        direction={[0, 0, THREE.MathUtils.degToRad(-bankAngle)]}
                        color="#10b981"
                        label="LIFT"
                    />

                    {/* Show Weight Vector (Down) */}
                    {/* Magnitude 1G * scale */}
                    <VectorForce
                        magnitude={20}
                        direction={[0, 0, Math.PI]}
                        color="#eab308"
                        label="WEIGHT"
                    />

                    <OrbitControls enableZoom={false} enablePan={false} />
                </Canvas>

                <div className="absolute bottom-6 right-6 bg-black/50 p-4 rounded-xl backdrop-blur max-w-xs">
                    <p className="text-xs text-slate-300">
                        <strong>Key Concept:</strong> To maintain level flight in a turn, you must increase Total Lift because the Vertical Component of Lift opposes Weight. This increase in Total Lift increases the Load Factor.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TurnPerformance;
