import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface Precipitation3DProps {
    type: 'rain' | 'snow' | 'hail' | 'drizzle' | 'freezing_rain';
    count?: number;
}

const Precipitation3D: React.FC<Precipitation3DProps> = ({ type, count = 2000 }) => {
    const points = useRef<THREE.Points>(null!);

    // Generate initial particle positions and velocities
    const [positions, velocities, sizes] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const vel = new Float32Array(count * 3);
        const sz = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 50;     // x: -25 to 25
            pos[i * 3 + 1] = Math.random() * 40;         // y: 0 to 40
            pos[i * 3 + 2] = (Math.random() - 0.5) * 50; // z: -25 to 25

            // Initial velocities based on type
            if (type === 'rain' || type === 'freezing_rain') {
                vel[i * 3 + 1] = -0.5 - Math.random() * 0.5; // Fast fall
                sz[i] = 0.5; // Streak length
            } else if (type === 'drizzle') {
                vel[i * 3 + 1] = -0.1 - Math.random() * 0.1; // Slow fall like mist
                sz[i] = 0.1; // Tiny
            } else if (type === 'snow') {
                vel[i * 3 + 1] = -0.05 - Math.random() * 0.05; // Slow fall
                vel[i * 3] = (Math.random() - 0.5) * 0.05; // Drift X
                vel[i * 3 + 2] = (Math.random() - 0.5) * 0.05; // Drift Z
                sz[i] = 0.2;
            } else { // Hail
                vel[i * 3 + 1] = -0.8 - Math.random() * 0.4; // Very fast
                sz[i] = 0.4 + Math.random() * 0.4; // Varied sizes
            }
        }
        return [pos, vel, sz];
    }, [type, count]);

    useFrame(() => {
        if (!points.current) return;

        const positions = points.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < count; i++) {
            // Update Y position (falling)
            let speedY = -0.2;
            if (type === 'rain' || type === 'freezing_rain') speedY = -0.8;
            if (type === 'drizzle') speedY = -0.2;
            if (type === 'snow') speedY = -0.1;
            if (type === 'hail') speedY = -1.0;

            positions[i * 3 + 1] += speedY;

            // Loop reset
            if (positions[i * 3 + 1] < -10) {
                positions[i * 3 + 1] = 40;
                positions[i * 3] = (Math.random() - 0.5) * 50;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
            }

            // Drift for snow
            if (type === 'snow') {
                positions[i * 3] += Math.sin(Date.now() * 0.001 + i) * 0.02;
            }
        }

        points.current.geometry.attributes.position.needsUpdate = true;
    });

    const color = type === 'snow' ? '#ffffff' : type === 'hail' ? '#e2e8f0' : type === 'freezing_rain' ? '#a5f3fc' : '#60a5fa';
    const size = type === 'snow' ? 0.3 : type === 'hail' ? 0.6 : type === 'drizzle' ? 0.1 : 0.2;

    return (
        <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color={color}
                size={size}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.8}
            />
        </Points>
    );
};

export default Precipitation3D;
