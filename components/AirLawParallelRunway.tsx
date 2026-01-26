import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Text, Box, Cylinder, Plane, Float } from '@react-three/drei';
import { GitMerge, ArrowDown, Info, ShieldCheck, AlertTriangle, Layers, Maximize, Play } from 'lucide-react';

const RunwayWorld = ({ mode }: { mode: 'independent' | 'dependent' }) => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />

            {/* Runways */}
            <mesh position={[-5, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[2, 20]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            <mesh position={[5, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[2, 20]} />
                <meshStandardMaterial color="#111" />
            </mesh>

            {/* Runway Labels */}
            <Text position={[-5, 0.1, 11]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.8} color="white">27L</Text>
            <Text position={[5, 0.1, 11]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.8} color="white">27R</Text>

            {/* No Transgression Zone (NTZ) */}
            {mode === 'independent' && (
                <mesh position={[0, 0.05, 0]}>
                    <boxGeometry args={[4, 0.1, 20]} />
                    <meshStandardMaterial color="red" transparent opacity={0.2} />
                </mesh>
            )}

            {/* Aircraft A */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <group position={[-5, 2, 8]}>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0, 0.3, 1, 3]} />
                        <meshStandardMaterial color="#ef4444" />
                    </mesh>
                    <Text position={[0, 0.5, 0]} fontSize={0.3} color="white">SPEEDY 1</Text>
                </group>
            </Float>

            {/* Aircraft B */}
            <Float speed={1.5} rotationIntensity={1} floatIntensity={0.8}>
                <group position={[5, 2.5, mode === 'independent' ? 8 : 12]}>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0, 0.3, 1, 3]} />
                        <meshStandardMaterial color="#3b82f6" />
                    </mesh>
                    <Text position={[0, 0.5, 0]} fontSize={0.3} color="white">WINDY 2</Text>
                </group>
            </Float>

            <Grid infiniteGrid cellSize={1} sectionSize={5} fadeDistance={30} position={[0, -0.01, 0]} />
        </>
    );
};

const AirLawParallelRunway: React.FC = () => {
    const [mode, setMode] = useState<'independent' | 'dependent'>('independent');

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 animate-in fade-in duration-500">
            {/* Header */}
            <header className="max-w-6xl mx-auto mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-red-500/20 text-red-500 rounded-2xl border border-red-500/30">
                        <GitMerge size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Parallel Runway Operations</h1>
                        <p className="text-slate-500 text-sm uppercase tracking-widest font-semibold flex items-center gap-2">
                            ICAO DOC 8168 & PANS-OPS
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto space-y-8">
                {/* Interactive Mode Toggle */}
                <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit mx-auto mb-12 shadow-2xl">
                    <button
                        onClick={() => setMode('independent')}
                        className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${mode === 'independent' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-500 hover:text-white'}`}
                    >
                        Independent Approaches
                    </button>
                    <button
                        onClick={() => setMode('dependent')}
                        className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${mode === 'dependent' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-500 hover:text-white'}`}
                    >
                        Dependent Approaches
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Visual 3D Area */}
                    <div className="lg:col-span-2 h-[500px] bg-slate-950 rounded-3xl border border-white/5 relative overflow-hidden shadow-inner">
                        <div className="absolute top-4 right-4 z-10 flex gap-2">
                            <div className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] items-center border border-white/10 text-slate-400 font-mono">
                                {mode === 'independent' ? 'NTZ ACTIVE' : 'DIAGONAL SPACING REQ'}
                            </div>
                        </div>
                        <Canvas shadows>
                            <PerspectiveCamera makeDefault position={[0, 15, 20]} fov={50} />
                            <OrbitControls maxPolarAngle={Math.PI / 2.1} makeDefault />
                            <Suspense fallback={null}>
                                <RunwayWorld mode={mode} />
                            </Suspense>
                        </Canvas>
                    </div>

                    {/* Guidance Panel */}
                    <div className="space-y-6">
                        <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 backdrop-blur-md">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Info className="text-blue-400" size={20} />
                                {mode === 'independent' ? 'Independent Rules' : 'Dependent Rules'}
                            </h3>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${mode === 'independent' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-blue-500'}`}></div>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        {mode === 'independent'
                                            ? "No radar-separation minima required between aircraft on adjacent paths. Monitor frequency is MANDATORY to track NTZ violations."
                                            : "Specific radar-separation (e.g., 3nm) or diagonal separation (1.5nm) MUST be maintained."}
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${mode === 'independent' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        {mode === 'independent'
                                            ? "NTZ (No Transgression Zone) is a 610m (2000ft) wide safety buffer between approaches."
                                            : "NOZ (Normal Operating Zone) extends from runway centerline to the NTZ boundary."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-red-950/20 rounded-2xl border border-red-500/10">
                            <h3 className="text-lg font-bold mb-4 text-red-400 flex items-center gap-2">
                                <AlertTriangle size={20} />
                                Intercept Rules
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-900/80 rounded-xl">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Max Angle</div>
                                    <div className="text-sm font-bold">30°</div>
                                </div>
                                <div className="p-3 bg-slate-900/80 rounded-xl">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Min Capture</div>
                                    <div className="text-sm font-bold">1000' Below</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AirLawParallelRunway;
