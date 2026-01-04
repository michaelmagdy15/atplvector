// @ts-nocheck
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import { AirspaceData, AirspaceClass } from '../types';

interface CakeProps {
  data: AirspaceData[];
  selectedClass: AirspaceClass;
  onSelect: (c: AirspaceClass) => void;
}

interface LayerProps { 
  item: AirspaceData; 
  index: number; 
  isSelected: boolean; 
  onSelect: () => void;
  total: number;
}

const Layer: React.FC<LayerProps> = ({ 
  item, 
  index, 
  isSelected, 
  onSelect,
  total 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Position: Stack from G (bottom) to A (top)
  const invertedIndex = total - 1 - index;
  const yPos = invertedIndex * 1.2 - (total * 1.2) / 2;
  
  const radius = 3 + (index * 0.15); 

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
      if (isSelected) {
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1.1, delta * 5);
        meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, 1.1, delta * 5);
      } else {
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1, delta * 5);
        meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, 1, delta * 5);
      }
    }
  });

  const color = item.type === 'Controlled' ? '#10b981' : '#64748b'; 
  const emissive = isSelected ? '#ffffff' : (hovered ? color : '#000000');
  const opacity = isSelected ? 0.9 : (hovered ? 0.7 : 0.4);

  return (
    <group position={[0, yPos, 0]}>
      <mesh
        ref={meshRef}
        onClick={(e: any) => { e.stopPropagation(); onSelect(); }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[radius, radius, 0.8, 32]} />
        <meshPhysicalMaterial 
          color={color}
          transparent
          opacity={opacity}
          metalness={0.2}
          roughness={0.2}
          emissive={emissive}
          emissiveIntensity={isSelected ? 0.5 : (hovered ? 0.2 : 0)}
          transmission={0.2}
          thickness={1}
        />
      </mesh>
      
      {/* Label */}
      <Html position={[radius + 0.5, 0, 0]} center className="pointer-events-none select-none">
        <div className={`
          px-3 py-1 rounded-full font-bold text-sm whitespace-nowrap transition-all duration-300
          ${isSelected 
            ? 'bg-white text-slate-900 scale-110 shadow-xl border-2 border-indigo-500' 
            : 'bg-slate-900/80 text-white border border-slate-600'}
        `}>
          Class {item.class}
        </div>
      </Html>

      {/* Floating Info for selected - simplified */}
      {isSelected && (
         <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
            <Html position={[-radius - 0.5, 0.5, 0]} center zIndexRange={[100, 0]}>
               <div className="bg-indigo-600 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                 {item.type}
               </div>
            </Html>
         </Float>
      )}
    </group>
  );
};

const AirspaceCake: React.FC<CakeProps> = ({ data, selectedClass, onSelect }) => {
  return (
    <div className="w-full h-[400px] md:h-[500px] bg-slate-900 rounded-lg overflow-hidden relative group">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
         <div className="bg-black/30 backdrop-blur px-3 py-2 rounded text-xs text-slate-300 border border-slate-700">
            <p>Drag to Rotate • Scroll to Zoom</p>
         </div>
      </div>
      
      <Canvas camera={{ position: [8, 4, 8], fov: 45 }}>
        <color attach="background" args={['#0f172a']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, 5, -10]} intensity={0.5} color="#38bdf8" />
        
        <group position={[0, 0, 0]}>
          {data.map((item, index) => (
            <Layer 
              key={item.class}
              item={item}
              index={index}
              total={data.length}
              isSelected={selectedClass === item.class}
              onSelect={() => onSelect(item.class)}
            />
          ))}
          
          {/* Central Axis/Pole just for visual anchor */}
          <mesh position={[0, -0.5, 0]}>
             <cylinderGeometry args={[0.2, 0.2, data.length * 1.5, 8]} />
             <meshStandardMaterial color="#334155" />
          </mesh>
          
          {/* Ground Plane */}
          <mesh position={[0, -(data.length * 1.2) / 2 - 1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
             <planeGeometry args={[20, 20]} />
             <meshStandardMaterial color="#1e293b" opacity={0.5} transparent />
             <gridHelper args={[20, 20, '#334155', '#1e293b']} rotation={[-Math.PI/2, 0, 0]} />
          </mesh>
        </group>

        <OrbitControls 
          enablePan={false} 
          minPolarAngle={Math.PI / 6} 
          maxPolarAngle={Math.PI / 1.5}
          autoRotate={false} 
          enableZoom={true}
          minDistance={5}
          maxDistance={20}
        />
      </Canvas>
    </div>
  );
};

export default AirspaceCake;