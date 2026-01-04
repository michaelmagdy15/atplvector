import React from 'react';

/**
 * Floating atmospheric glow orbs.
 * Creates depth and ambient lighting effects in the background.
 */
const GlowOrbs: React.FC = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Primary blue orb - top left */}
            <div
                className="absolute w-[600px] h-[600px] rounded-full animate-blob"
                style={{
                    top: '-10%',
                    left: '-5%',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 70%)',
                    filter: 'blur(60px)',
                }}
            />

            {/* Indigo orb - top right */}
            <div
                className="absolute w-[500px] h-[500px] rounded-full animate-blob"
                style={{
                    top: '5%',
                    right: '-10%',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, rgba(139, 92, 246, 0) 70%)',
                    filter: 'blur(80px)',
                    animationDelay: '-2s',
                }}
            />

            {/* Emerald orb - center left floating */}
            <div
                className="absolute w-[400px] h-[400px] rounded-full animate-float"
                style={{
                    top: '40%',
                    left: '-8%',
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0) 70%)',
                    filter: 'blur(50px)',
                }}
            />

            {/* Cyan orb - bottom center */}
            <div
                className="absolute w-[700px] h-[700px] rounded-full animate-blob"
                style={{
                    bottom: '-15%',
                    left: '30%',
                    background: 'radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, rgba(34, 211, 238, 0) 70%)',
                    filter: 'blur(100px)',
                    animationDelay: '-4s',
                }}
            />

            {/* Purple orb - right side floating */}
            <div
                className="absolute w-[350px] h-[350px] rounded-full animate-float"
                style={{
                    top: '60%',
                    right: '5%',
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0) 70%)',
                    filter: 'blur(40px)',
                    animationDelay: '-3s',
                }}
            />

            {/* Subtle orange accent - bottom right */}
            <div
                className="absolute w-[300px] h-[300px] rounded-full animate-blob"
                style={{
                    bottom: '10%',
                    right: '-5%',
                    background: 'radial-gradient(circle, rgba(251, 146, 60, 0.06) 0%, rgba(251, 146, 60, 0) 70%)',
                    filter: 'blur(50px)',
                    animationDelay: '-5s',
                }}
            />
        </div>
    );
};

export default GlowOrbs;
