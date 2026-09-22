import React, { useMemo } from 'react';

interface ConfettiExplosionProps {
    particleCount?: number;
    duration?: number; // ms
    force?: number;
    width?: number; // px spread
    colors?: string[];
}

interface Particle {
    id: number;
    color: string;
    x: number;
    y: number;
    rotation: number;
    size: number;
    delay: number;
}

export const ConfettiExplosion: React.FC<ConfettiExplosionProps> = ({
    particleCount = 60,
    duration = 2000,
    force = 0.6,
    width = 600,
    colors = ['#10b981', '#38bdf8', '#f59e0b', '#ef4444', '#a855f7', '#ec4899']
}) => {
    const particles = useMemo<Particle[]>(() => {
        const list: Particle[] = [];
        for (let i = 0; i < particleCount; i++) {
            // Angle between -150 deg and -30 deg (fountain upwards)
            const angle = (Math.PI * (Math.random() * 0.8 + 0.1)) + Math.PI;
            const dist = (Math.random() * (width / 2) + 50) * force;
            const x = Math.cos(angle) * dist;
            const y = Math.sin(angle) * dist * 1.5; // Arc up then gravity falls
            list.push({
                id: i,
                color: colors[Math.floor(Math.random() * colors.length)],
                x,
                y,
                rotation: Math.random() * 720 - 360,
                size: Math.random() * 6 + 5,
                delay: Math.random() * 0.1,
            });
        }
        return list;
    }, [particleCount, force, width, colors]);

    return (
        <div style={{ position: 'relative', width: 0, height: 0, pointerEvents: 'none' }}>
            <style>{`
                @keyframes confettiBurst {
                    0% {
                        transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
                        opacity: 1;
                    }
                    70% {
                        opacity: 0.9;
                    }
                    100% {
                        transform: var(--dest-transform) scale(0.5);
                        opacity: 0;
                    }
                }
            `}</style>
            {particles.map(p => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: `${p.size}px`,
                        height: `${p.size * 0.6}px`,
                        backgroundColor: p.color,
                        borderRadius: '2px',
                        transformOrigin: 'center',
                        animation: `confettiBurst ${duration}ms cubic-bezier(0.25, 1, 0.5, 1) forwards`,
                        animationDelay: `${p.delay}s`,
                        // @ts-ignore
                        '--dest-transform': `translate3d(${p.x}px, ${p.y + 180}px, 0) rotate(${p.rotation}deg)`,
                    }}
                />
            ))}
        </div>
    );
};

export default ConfettiExplosion;
