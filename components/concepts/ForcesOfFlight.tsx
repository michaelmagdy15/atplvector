import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { ArrowLeft, Info, RefreshCw } from 'lucide-react';
import * as THREE from 'three';

// --- 3D Scene Components ---

const VectorArrow = ({ direction, magnitude, color, label, position }: any) => {
    // scale magnitude for visual clarity
    const length = Math.max(1, magnitude * 0.05);
    const arrowRef = useRef<THREE.Group>(null);

    return (
        <group position={position} ref={arrowRef}>
            {/* The Arrow Helper wrapper */}
            <arrowHelper
                args={[
                    new THREE.Vector3(...direction).normalize(),
                    new THREE.Vector3(0, 0, 0),
                    length,
                    color,
                    1, // head length
                    0.5 // head width
                ]}
            />
            {/* Label floating at tip */}
            <group position={[direction[0] * length, direction[1] * length, direction[2] * length]}>
                <Html center>
                    <div className="px-2 py-1 bg-black/60 backdrop-blur rounded text-white text-xs font-bold whitespace-nowrap border border-white/10 pointer-events-none select-none">
                        {label}: {Math.round(magnitude)} N
                    </div>
                </Html>
            </group>
        </group>
    );
};

const AircraftModel = ({ pitch, bank }: { pitch: number, bank: number }) => {
    const mesh = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (mesh.current) {
            // Apply rotations
            mesh.current.rotation.x = THREE.MathUtils.degToRad(pitch);
            mesh.current.rotation.z = THREE.MathUtils.degToRad(-bank);
        }
    });

    return (
        <group>
            {/* Simple Fuselage */}
            <mesh ref={mesh}>
                <boxGeometry args={[1, 0.5, 4]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.4} metalness={0.6} />

                {/* Wings */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[6, 0.1, 1]} />
                    <meshStandardMaterial color="#94a3b8" />
                </mesh>

                {/* Tail */}
                <mesh position={[0, 0.5, 1.8]}>
                    <boxGeometry args={[2, 0.1, 0.8]} />
                    <meshStandardMaterial color="#94a3b8" />
                </mesh>
                <mesh position={[0, 0.5, 1.8]} rotation={[0, 0, Math.PI / 2]}>
                    <boxGeometry args={[1, 0.1, 0.8]} />
                    <meshStandardMaterial color="#64748b" />
                </mesh>

                {/* Cockpit */}
                <mesh position={[0, 0.3, -1.2]}>
                    <boxGeometry args={[0.8, 0.4, 0.8]} />
                    <meshStandardMaterial color="#3b82f6" transparent opacity={0.6} />
                </mesh>
            </mesh>
        </group>
    );
};

// --- Main Component ---

interface Props {
    onBack: () => void;
}

const ForcesOfFlight: React.FC<Props> = ({ onBack }) => {
    // Simulator State
    const [airspeed, setAirspeed] = useState(100); // kts
    const [aoa, setAoa] = useState(2); // degrees
    const [weight] = useState(20000); // N (Fixed for simplicity or adjustable)

    // Physics Calculations (Simplified)
    const liftCoeff = 0.1 * aoa; // Simplified CL linear with AOA
    const dragCoeff = 0.02 + (0.005 * aoa * aoa); // Simplified CD parabolic
    const airDensity = 1.225; // ISA SL
    const wingArea = 20; // m^2
    const velocity = airspeed * 0.514444; // m/s
    const q = 0.5 * airDensity * velocity * velocity; // Dynamic Pressure

    const lift = liftCoeff * q * wingArea;
    const drag = dragCoeff * q * wingArea;
    const thrust = drag; // In steady level flight, Thrust = Drag. If we want accel, T > D.
    // Let's assume steady state for visualization initially, or T = D * 1.1 for "climb" logic?
    // For now: Equilibrium or unbalance based on user input? 
    // Let's make Thrust manually adjustable relative to drag to show unbalance?
    // Actually, simpler: Show resultants based on inputs.

    // Derived Thrust for "maintain speed"
    const reqThrust = drag;

    return (
        <div className="h-screen w-full relative bg-slate-950 overflow-hidden flex flex-col md:flex-row">

            {/* Sidebar Controls */}
            <div className="w-full md:w-80 bg-slate-900 border-r border-white/10 p-6 flex flex-col z-10 shadow-2xl overflow-y-auto">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to Lab
                </button>

                <div className="mb-6">
                    <h2 className="text-2xl font-black text-white">Forces of Flight</h2>
                    <p className="text-sm text-slate-400 mt-2">
                        Observe how Speed and Angle of Attack (AoA) influence Lift and Drag.
                    </p>
                </div>

                <div className="space-y-8 flex-grow">
                    {/* Airspeed Slider */}
                    <div>
                        <div className="flex justify-between text-sm font-bold mb-2">
                            <span className="text-blue-400">Airspeed (TAS)</span>
                            <span className="text-white">{airspeed} kts</span>
                        </div>
                        <input
                            type="range" min="50" max="400" step="5"
                            value={airspeed} onChange={(e) => setAirspeed(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                            <span>Stall</span>
                            <span>Vne</span>
                        </div>
                    </div>

                    {/* AOA Slider */}
                    <div>
                        <div className="flex justify-between text-sm font-bold mb-2">
                            <span className="text-emerald-400">Angle of Attack</span>
                            <span className="text-white">{aoa}°</span>
                        </div>
                        <input
                            type="range" min="0" max="20" step="1"
                            value={aoa} onChange={(e) => setAoa(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                        <div className="text-[10px] text-slate-500 mt-1 text-right">
                            CRIT AOA (Stall) ~16°
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-xs text-slate-300 space-y-2">
                        <div className="flex justify-between">
                            <span>Dynamic Pressure (q):</span>
                            <span className="font-mono text-white">{Math.round(q)} Pa</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Lift Coefficient (CL):</span>
                            <span className="font-mono text-white">{liftCoeff.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Drag Coefficient (CD):</span>
                            <span className="font-mono text-white">{dragCoeff.toFixed(3)}</span>
                        </div>
                    </div>
                </div>

                {/* Reset Button */}
                <button
                    onClick={() => { setAirspeed(100); setAoa(2); }}
                    className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                >
                    <RefreshCw size={16} /> Reset Simulation
                </button>
            </div>

            {/* 3D Viewport */}
            <div className="flex-grow relative h-64 md:h-auto">
                <Canvas shadows camera={{ position: [5, 2, 5], fov: 45 }}>
                    <color attach="background" args={['#0f172a']} />
                    <fog attach="fog" args={['#0f172a', 5, 20]} />

                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
                    <gridHelper args={[20, 20, 0x1e293b, 0x1e293b]} position={[0, -2, 0]} />

                    <group position={[0, 0, 0]}>
                        <AircraftModel pitch={aoa} bank={0} />

                        {/* Force Vectors */}

                        {/* LIFT (Green, Up) */}
                        <VectorArrow
                            direction={[0, 1, 0]}
                            magnitude={lift}
                            color="#10b981"
                            label="LIFT"
                            position={[0, 0, 0]}
                        />

                        {/* WEIGHT (Yellow, Down) */}
                        <VectorArrow
                            direction={[0, -1, 0]}
                            magnitude={weight}
                            color="#eab308"
                            label="WEIGHT"
                            position={[0, 0, 0]}
                        />

                        {/* DRAG (Red, Back) */}
                        <VectorArrow
                            direction={[-1, 0, 0]}
                            magnitude={drag}
                            color="#ef4444"
                            label="DRAG"
                            position={[0, 0, 0]}
                        />

                        {/* THRUST (Blue, Forward) */}
                        <VectorArrow
                            direction={[1, 0, 0]}
                            magnitude={reqThrust}
                            color="#3b82f6"
                            label="THRUST"
                            position={[0, 0, 0]}
                        />
                    </group>

                    <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
                </Canvas>

                {/* Overlay Hint */}
                <div className="absolute bottom-6 right-6 bg-black/50 backdrop-blur px-4 py-2 rounded-full border border-white/10 text-xs text-white flex items-center gap-2 pointer-events-none">
                    <Info size={14} />
                    <span className="hidden md:inline">Drag to Rotate • Scroll to Zoom</span>
                    <span className="md:hidden">Drag to Rotate • Pinch to Zoom</span>
                </div>
            </div>
        </div>
    );
};

export default ForcesOfFlight;
