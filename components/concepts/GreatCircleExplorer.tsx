import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Html } from '@react-three/drei';
import { ArrowLeft, Globe } from 'lucide-react';
import * as THREE from 'three';

// --- Geometry Helpers ---

const EARTH_RADIUS = 5;

// Convert Lat/Lon to Vector3
const toVector = (lat: number, lon: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(EARTH_RADIUS * Math.sin(phi) * Math.cos(theta));
    const z = (EARTH_RADIUS * Math.sin(phi) * Math.sin(theta));
    const y = (EARTH_RADIUS * Math.cos(phi));
    return new THREE.Vector3(x, y, z);
};

// Generate points for Great Circle path
const getGreatCirclePath = (v1: THREE.Vector3, v2: THREE.Vector3) => {
    const points = [];
    for (let i = 0; i <= 50; i++) {
        const t = i / 50;
        // SLERP interpolation on unit sphere, then scale
        const v = v1.clone().normalize().lerp(v2.clone().normalize(), t).normalize().multiplyScalar(EARTH_RADIUS + 0.02);
        points.push(v);
    }
    return points;
};

// Generate approximate Rhumb Line (Loxodrome) points
// Simplified: Linear interp in Lat/Lon space mapped to sphere
const getRhumbPath = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const points = [];
    const steps = 50;
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const lat = lat1 + (lat2 - lat1) * t;
        const lon = lon1 + (lon2 - lon1) * t;
        const v = toVector(lat, lon).normalize().multiplyScalar(EARTH_RADIUS + 0.02);
        points.push(v);
    }
    return points;
};

const CityMarker = ({ lat, lon, label }: { lat: number, lon: number, label: string }) => {
    const pos = toVector(lat, lon);
    return (
        <group position={pos}>
            <mesh>
                <sphereGeometry args={[0.1]} />
                <meshStandardMaterial color="white" emissive="white" />
            </mesh>
            <Html distanceFactor={15}>
                <div className="text-white text-xs font-bold bg-black/50 px-1 rounded whitespace-nowrap -translate-y-4">{label}</div>
            </Html>
        </group>
    );
};

// --- Main Component ---

interface Props {
    onBack: () => void;
}

const GreatCircleExplorer: React.FC<Props> = ({ onBack }) => {
    // State for Point A and B
    const [latA, setLatA] = useState(51.5); // London
    const [lonA, setLonA] = useState(0);
    const [latB, setLatB] = useState(40.7); // New York
    const [lonB, setLonB] = useState(-74);

    const posA = useMemo(() => toVector(latA, lonA), [latA, lonA]);
    const posB = useMemo(() => toVector(latB, lonB), [latB, lonB]);

    const gcPoints = useMemo(() => getGreatCirclePath(posA, posB), [posA, posB]);
    const rhumbPoints = useMemo(() => getRhumbPath(latA, lonA, latB, lonB), [latA, lonA, latB, lonB]);

    return (
        <div className="h-screen w-full relative bg-slate-950 overflow-hidden flex flex-col md:flex-row">

            {/* Sidebar */}
            <div className="w-full md:w-80 bg-slate-900 border-r border-white/10 p-6 flex flex-col z-10 shadow-2xl overflow-y-auto">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to Lab
                </button>

                <div className="mb-6">
                    <h2 className="text-2xl font-black text-white">Great Circle</h2>
                    <p className="text-sm text-slate-400 mt-2">
                        Compare the shortest path (Great Circle) vs Constant Heading (Rhumb Line).
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Point A Control */}
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                        <div className="text-xs font-bold text-slate-400 uppercase mb-3">Origin (Point A)</div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-slate-500">Latitude</label>
                                <input type="range" min="-90" max="90" value={latA} onChange={(e) => setLatA(Number(e.target.value))} className="w-full h-1 bg-slate-700 rounded appearance-none" />
                                <div className="text-right text-xs font-mono text-white">{latA}°</div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500">Longitude</label>
                                <input type="range" min="-180" max="180" value={lonA} onChange={(e) => setLonA(Number(e.target.value))} className="w-full h-1 bg-slate-700 rounded appearance-none" />
                                <div className="text-right text-xs font-mono text-white">{lonA}°</div>
                            </div>
                        </div>
                    </div>

                    {/* Point B Control */}
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                        <div className="text-xs font-bold text-slate-400 uppercase mb-3">Destination (Point B)</div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-slate-500">Latitude</label>
                                <input type="range" min="-90" max="90" value={latB} onChange={(e) => setLatB(Number(e.target.value))} className="w-full h-1 bg-slate-700 rounded appearance-none" />
                                <div className="text-right text-xs font-mono text-white">{latB}°</div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500">Longitude</label>
                                <input type="range" min="-180" max="180" value={lonB} onChange={(e) => setLonB(Number(e.target.value))} className="w-full h-1 bg-slate-700 rounded appearance-none" />
                                <div className="text-right text-xs font-mono text-white">{lonB}°</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300">
                        <p><strong>Did you know?</strong> On a standard Mercator projection, the Rhumb line is straight but longer. The Great Circle curves towards the pole but is shortest.</p>
                    </div>
                </div>
            </div>

            {/* 3D Viewport */}
            <div className="flex-grow relative bg-[#050510]">
                <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[20, 10, 10]} intensity={1.5} />

                    <OrbitControls enablePan={false} minDistance={7} maxDistance={20} />

                    {/* Earth Sphere */}
                    <Sphere args={[EARTH_RADIUS, 64, 64]}>
                        <meshStandardMaterial
                            color="#1e293b"
                            wireframe={true} // Stylish tech look
                            transparent
                            opacity={0.3}
                        />
                    </Sphere>
                    {/* Inner solidity */}
                    <Sphere args={[EARTH_RADIUS - 0.01, 32, 32]}>
                        <meshBasicMaterial color="#0f172a" />
                    </Sphere>

                    {/* Markers */}
                    <CityMarker lat={latA} lon={lonA} label="A" />
                    <CityMarker lat={latB} lon={lonB} label="B" />

                    {/* Great Circle Path (Green) */}
                    <Line points={gcPoints} color="#10b981" lineWidth={3} />

                    {/* Rhumb Line Path (Red) */}
                    <Line points={rhumbPoints} color="#ef4444" lineWidth={2} dashed dashScale={10} dashSize={0.5} gapSize={0.5} />

                </Canvas>

                {/* Legend */}
                <div className="absolute top-6 right-6 flex flex-col gap-2 bg-black/50 p-4 rounded-xl backdrop-blur">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-1 bg-emerald-500 rounded-full"></div>
                        <span className="text-xs text-white font-bold">Great Circle (Shortest)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-1 border-t-2 border-red-500 border-dashed"></div>
                        <span className="text-xs text-white font-bold">Rhumb Line (Const Hdg)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GreatCircleExplorer;
