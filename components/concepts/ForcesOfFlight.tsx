import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Float, PerspectiveCamera, Environment } from '@react-three/drei';
import { ArrowLeft, Info, RefreshCw, Box, Zap } from 'lucide-react';
import * as THREE from 'three';
import SplineVisualizer from '../visual/SplineVisualizer';

// --- 3D Scene Components ---

const VectorArrow = ({ direction, magnitude, color, label, position }: any) => {
    const length = Math.max(1.5, magnitude * 0.005); // Rescale for better visual
    const arrowRef = useRef<THREE.Group>(null);

    return (
        <group position={position} ref={arrowRef}>
            <arrowHelper
                args={[
                    new THREE.Vector3(...direction).normalize(),
                    new THREE.Vector3(0, 0, 0),
                    length,
                    color,
                    0.5, // head length
                    0.3  // head width
                ]}
            />
            <group position={[direction[0] * (length + 0.5), direction[1] * (length + 0.5), direction[2] * (length + 0.5)]}>
                <Html center>
                    <div className="px-2 py-1 bg-black/80 backdrop-blur-md rounded-lg text-white text-[10px] font-black tracking-wider whitespace-nowrap border border-white/20 pointer-events-none select-none shadow-xl transform transition-all duration-300">
                        <span style={{ color }}>{label}</span>: {Math.round(magnitude).toLocaleString()} N
                    </div>
                </Html>
            </group>
        </group>
    );
};

const HighPolyAircraft = ({ pitch, bank }: { pitch: number, bank: number }) => {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.x = THREE.MathUtils.degToRad(pitch);
            group.current.rotation.z = THREE.MathUtils.degToRad(-bank);
            // Subtle vibration
            group.current.position.y = Math.sin(state.clock.elapsedTime * 4) * 0.05;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <group ref={group}>
                {/* Fuselage - Sleek cylinder */}
                <mesh castShadow receiveShadow>
                    <capsuleGeometry args={[0.5, 3, 16, 16]} />
                    <meshStandardMaterial color="#f1f5f9" roughness={0.1} metalness={0.8} />
                </mesh>

                {/* Main Wings - Tapered boxes */}
                <mesh position={[0, 0, 0]} castShadow>
                    <boxGeometry args={[8, 0.15, 1.2]} />
                    <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.5} />
                </mesh>

                {/* Vertical Stabilizer */}
                <mesh position={[0, 0.7, 1.4]} rotation={[-0.2, 0, 0]} castShadow>
                    <boxGeometry args={[0.1, 1, 0.8]} />
                    <meshStandardMaterial color="#cbd5e1" />
                </mesh>

                {/* Horizontal Stabilizer */}
                <mesh position={[0, 0.4, 1.6]} castShadow>
                    <boxGeometry args={[2.5, 0.1, 0.6]} />
                    <meshStandardMaterial color="#cbd5e1" />
                </mesh>

                {/* Cockpit Canpy - Glass */}
                <mesh position={[0, 0.35, -1]} castShadow>
                    <sphereGeometry args={[0.45, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshPhysicalMaterial
                        color="#bae6fd"
                        transparent
                        opacity={0.6}
                        roughness={0}
                        transmission={1}
                        thickness={0.5}
                    />
                </mesh>

                {/* Jet Engine Glow (Visual only) */}
                <pointLight position={[0, 0, 1.8]} color="#3b82f6" intensity={2} distance={5} />
            </group>
        </Float>
    );
};

// --- Main Component ---

interface Props {
    onBack: () => void;
}

const ForcesOfFlight: React.FC<Props> = ({ onBack }) => {
    const [airspeed, setAirspeed] = useState(150);
    const [aoa, setAoa] = useState(4);
    const [viewMode, setViewMode] = useState<'standard' | 'spline'>('standard');

    // Physics Calculations (Aero 101)
    const weight = 35000;
    const airDensity = 1.225;
    const wingArea = 25;
    const velocity = airspeed * 0.514444;
    const q = 0.5 * airDensity * Math.pow(velocity, 2);

    // CL and CD approximations
    const liftCoeff = 0.1 + (0.09 * aoa);
    const dragCoeff = 0.02 + (0.004 * Math.pow(aoa, 2));

    const lift = liftCoeff * q * wingArea;
    const drag = dragCoeff * q * wingArea;
    const thrust = drag; // Equilibrium assumption

    return (
        <div className="h-screen w-full relative bg-slate-950 overflow-hidden flex flex-col md:flex-row">

            {/* Sidebar Controls */}
            <div className="w-full md:w-85 bg-slate-900/80 backdrop-blur-xl border-r border-white/10 p-8 flex flex-col z-20 shadow-2xl overflow-y-auto">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-white mb-10 transition-all font-bold text-xs uppercase tracking-widest group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Hangar
                </button>

                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Zap className="text-blue-400" size={20} />
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight uppercase">Aerodynamics</h2>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Experiment with the four fundamental forces. Observe how Lift overcomes Weight and Thrust counters Drag.
                    </p>
                </div>

                <div className="space-y-10 flex-grow">
                    {/* View Toggle */}
                    <div className="flex bg-slate-800/50 p-1 rounded-xl border border-white/5">
                        <button
                            onClick={() => setViewMode('standard')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${viewMode === 'standard' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Simplified
                        </button>
                        <button
                            onClick={() => setViewMode('spline')}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${viewMode === 'spline' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Premium 3D
                        </button>
                    </div>

                    {/* Airspeed Slider */}
                    <div>
                        <div className="flex justify-between items-end mb-4">
                            <span className="text-[10px] font-black uppercase tracking-tighter text-blue-400">Velocity (TAS)</span>
                            <span className="text-2xl font-mono font-bold text-white leading-none">{airspeed}<span className="text-[10px] ml-1 text-slate-500 uppercase">kts</span></span>
                        </div>
                        <input
                            type="range" min="80" max="500" step="5"
                            value={airspeed} onChange={(e) => setAirspeed(Number(e.target.value))}
                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>

                    {/* AOA Slider */}
                    <div>
                        <div className="flex justify-between items-end mb-4">
                            <span className="text-[10px] font-black uppercase tracking-tighter text-emerald-400">Angle of Attack</span>
                            <span className="text-2xl font-mono font-bold text-white leading-none">{aoa}<span className="text-[10px] ml-1 text-slate-500">°</span></span>
                        </div>
                        <input
                            type="range" min="-2" max="18" step="0.5"
                            value={aoa} onChange={(e) => setAoa(Number(e.target.value))}
                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                        <div className="flex justify-between text-[8px] font-bold text-slate-600 mt-2 uppercase tracking-widest">
                            <span>Negative</span>
                            <span>Optimal</span>
                            <span className="text-red-500/50">Stall</span>
                        </div>
                    </div>

                    {/* Live Telemetry */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                            <div className="text-[8px] font-bold text-slate-500 uppercase mb-1">CL</div>
                            <div className="text-lg font-mono font-bold text-white">{liftCoeff.toFixed(3)}</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                            <div className="text-[8px] font-bold text-slate-500 uppercase mb-1">CD</div>
                            <div className="text-lg font-mono font-bold text-white">{dragCoeff.toFixed(3)}</div>
                        </div>
                        <div className="col-span-2 bg-blue-500/5 p-3 rounded-xl border border-blue-500/10">
                            <div className="text-[8px] font-bold text-blue-500/70 uppercase mb-1 text-center font-black">L/D Ratio</div>
                            <div className="text-xl font-mono font-bold text-blue-400 text-center">{(lift / drag).toFixed(2)}</div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => { setAirspeed(150); setAoa(4); }}
                    className="mt-10 w-full py-4 bg-slate-800 hover:bg-slate-750 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all border border-white/5"
                >
                    <RefreshCw size={14} /> Calibrate
                </button>
            </div>

            {/* 3D Viewport */}
            <div className="flex-grow relative overflow-hidden">
                {viewMode === 'spline' ? (
                    <SplineVisualizer
                        sceneUrl="https://prod.spline.design/T8-XQy8r9yW7B2Fq/scene.splinecode"
                        fallbackColor="#0f172a"
                    >
                        {/* Vectors overlaid on Spline */}
                        <div className="absolute inset-0 pointer-events-none">
                            <Canvas camera={{ position: [5, 2, 5], fov: 45 }} gl={{ alpha: true }}>
                                <ambientLight intensity={1} />
                                <group position={[0, -0.5, 0]}>
                                    <VectorArrow direction={[0, 1, 0]} magnitude={lift} color="#10b981" label="LIFT" />
                                    <VectorArrow direction={[0, -1, 0]} magnitude={weight} color="#eab308" label="WEIGHT" />
                                    <VectorArrow direction={[-1, 0, 0]} magnitude={drag} color="#ef4444" label="DRAG" />
                                    <VectorArrow direction={[1, 0, 0]} magnitude={thrust} color="#3b82f6" label="THRUST" />
                                </group>
                            </Canvas>
                        </div>
                    </SplineVisualizer>
                ) : (
                    <div className="w-full h-full bg-slate-950">
                        <Canvas shadows>
                            <PerspectiveCamera makeDefault position={[6, 3, 8]} fov={40} />
                            <color attach="background" args={['#020617']} />
                            <fog attach="fog" args={['#020617', 8, 25]} />

                            <Environment preset="night" />
                            <ambientLight intensity={0.2} />
                            <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />

                            <gridHelper args={[40, 40, '#1e293b', '#0f172a']} position={[0, -3, 0]} />

                            <group position={[0, 0, 0]}>
                                <HighPolyAircraft pitch={aoa} bank={0} />

                                {/* Vectors */}
                                <VectorArrow direction={[0, 1, 0]} magnitude={lift} color="#10b981" label="LIFT" />
                                <VectorArrow direction={[0, -1, 0]} magnitude={weight} color="#eab308" label="WEIGHT" />
                                <VectorArrow direction={[-1, 0, 0]} magnitude={drag} color="#ef4444" label="DRAG" />
                                <VectorArrow direction={[1, 0, 0]} magnitude={thrust} color="#3b82f6" label="THRUST" />
                            </group>

                            <OrbitControls
                                makeDefault
                                minPolarAngle={Math.PI / 4}
                                maxPolarAngle={Math.PI / 1.5}
                                enableDamping
                                dampingFactor={0.05}
                            />
                        </Canvas>
                    </div>
                )}

                {/* Legend Overlay */}
                <div className="absolute top-8 right-8 flex flex-col gap-2 z-10">
                    <div className="glass-panel px-4 py-2 rounded-full border border-white/10 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">Engine Core Active</span>
                    </div>
                </div>

                <div className="absolute bottom-8 right-8 bg-black/60 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 text-[10px] font-black text-white/50 uppercase tracking-[0.2em] flex items-center gap-3 pointer-events-none shadow-2xl">
                    <Info size={14} className="text-blue-400" />
                    <span>Interactive Nav • Multi-Axis Control</span>
                </div>
            </div>
        </div>
    );
};

export default ForcesOfFlight;

