import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, PerspectiveCamera, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, MapPin, Plane, ChevronRight, Activity } from 'lucide-react';

const SEGMENTS = [
  {
    id: 'arrival',
    name: 'Arrival Segment',
    start: [20, 10, 0],
    end: [12, 8, 0],
    color: '#818cf8',
    fix: 'IAF',
    description: 'Transition from en-route to approach.',
    tasks: 'Maneuver to intercept IAF.',
    moc: 'Variable'
  },
  {
    id: 'initial',
    name: 'Initial Approach',
    start: [12, 8, 0],
    end: [6, 5, 0],
    color: '#fb7185',
    fix: 'IF',
    description: 'From IAF to Intermediate Fix.',
    tasks: 'Align aircraft with intermediate course.',
    moc: '300m (984ft)'
  },
  {
    id: 'intermediate',
    name: 'Intermediate Approach',
    start: [6, 5, 0],
    end: [0, 2, 0],
    color: '#facc15',
    fix: 'FAF',
    description: 'From IF to Final Approach Fix.',
    tasks: 'Configuration, speed reduction, alignment.',
    moc: '150m (492ft)'
  },
  {
    id: 'final',
    name: 'Final Approach',
    start: [0, 2, 0],
    end: [-4, 0, 0],
    color: '#4ade80',
    fix: 'MAPt',
    description: 'From FAF to Missed Approach Point.',
    tasks: 'Descent for landing.',
    moc: '75m - 90m'
  },
  {
    id: 'missed',
    name: 'Missed Approach',
    start: [-4, 0, 0],
    end: [-10, 6, 0],
    color: '#f87171',
    fix: 'Holding',
    description: 'Climb-out for safety.',
    tasks: 'Safe climb to clear obstacles.',
    moc: '30m - 50m'
  }
];

const SegmentLine = ({ segment, isSelected }: { segment: typeof SEGMENTS[0], isSelected: boolean }) => {
  const points = [
    new THREE.Vector3(...segment.start),
    new THREE.Vector3(...segment.end)
  ];
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <group>
      {/* @ts-ignore - R3F element */}
      <line geometry={lineGeometry}>
        {/* @ts-ignore - R3F element */}
        <lineBasicMaterial color={segment.color} linewidth={isSelected ? 5 : 2} opacity={isSelected ? 1 : 0.4} transparent />
      </line>
      
      {/* Starting Point (Fix) */}
      <mesh position={new THREE.Vector3(...segment.start)}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={segment.color} emissive={segment.color} emissiveIntensity={isSelected ? 2 : 0.5} />
      </mesh>

      {isSelected && (
        <Html position={new THREE.Vector3(...segment.start)} distanceFactor={10}>
          <div className="bg-slate-900/90 backdrop-blur-md border border-white/20 rounded px-2 py-1 text-[8px] font-bold text-white whitespace-nowrap -translate-y-6">
            {segment.fix}
          </div>
        </Html>
      )}
    </group>
  );
};

const PlaneModel = ({ position, rotation }: { position: THREE.Vector3, rotation: THREE.Euler }) => {
    return (
        <group position={position} rotation={rotation}>
            <Float speed={5} rotationIntensity={0.5} floatIntensity={0.5}>
                {/* Simple Plane Shape */}
                <mesh>
                    <boxGeometry args={[0.5, 0.05, 0.1]} />
                    <meshStandardMaterial color="white" />
                </mesh>
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[0.1, 0.02, 0.6]} />
                    <meshStandardMaterial color="white" />
                </mesh>
            </Float>
        </group>
    );
};

const ApproachSegments: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('arrival');
  const selectedSegment = SEGMENTS.find(s => s.id === selectedId)!;

  return (
    <div className="flex flex-col h-[600px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
      {/* 3D Scene */}
      <div className="flex-grow relative cursor-grab active:cursor-grabbing">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[10, 10, 20]} fov={40} />
          <OrbitControls enablePan={true} minPolarAngle={0} maxPolarAngle={Math.PI / 1.5} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <gridHelper args={[50, 50, 0x334155, 0x1e293b]} position={[0, -2, 0]} />

          {SEGMENTS.map(s => (
            <SegmentLine key={s.id} segment={s} isSelected={selectedId === s.id} />
          ))}

          {/* Runway Visualizer */}
          <mesh position={[-4.5, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10, 1]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[-4.5, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10, 0.05]} />
            <meshStandardMaterial color="white" transparent opacity={0.5} />
          </mesh>
        </Canvas>

        {/* Floating HUD */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
            <h3 className="text-white font-bold text-xl flex items-center gap-2 drop-shadow-lg">
                <Plane className="text-pink-400 rotate-45" /> Instrument Approach Profile
            </h3>
            <p className="text-slate-400 text-xs max-w-xs drop-shadow-md">
                Interact with the 3D space to explore the five approach segments.
            </p>
        </div>

        {/* Quick Selection */}
        <div className="absolute bottom-6 left-6 flex gap-2">
            {SEGMENTS.map(s => (
                <button
                    key={s.id}
                    onClick={() => setSelectedId(s.id)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all duration-300 border flex items-center gap-1 ${
                        selectedId === s.id 
                        ? 'bg-white text-slate-900 border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-110' 
                        : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:bg-slate-800'
                    }`}
                >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.name.split(' ')[0]}
                </button>
            ))}
        </div>
      </div>

      {/* Info Panel */}
      <AnimatePresence mode="wait">
        <motion.div
            key={selectedId}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-slate-900 border-t border-slate-800 p-6 flex flex-col md:flex-row gap-6 items-center"
        >
            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-pink-600 text-white text-[10px] font-bold rounded">DOC 8168</span>
                    <h4 className="text-white font-bold text-lg">{selectedSegment.name}</h4>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                    {selectedSegment.description}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 min-w-[140px]">
                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-1 flex items-center gap-1">
                        <Activity size={12} className="text-pink-400" /> Primary Task
                    </div>
                    <div className="text-xs text-white font-medium">{selectedSegment.tasks}</div>
                </div>
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 min-w-[140px]">
                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-1 flex items-center gap-1">
                        <Info size={12} className="text-yellow-400" /> Min Clearance (MOC)
                    </div>
                    <div className="text-xs text-white font-mono">{selectedSegment.moc}</div>
                </div>
            </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ApproachSegments;
