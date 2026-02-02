import React, { useEffect, useRef } from 'react';

/**
 * Animated starfield background using Canvas API.
 * Creates a moving star effect that evokes flying at altitude.
 */
const StarfieldBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let stars: Star[] = [];

        interface Star {
            x: number;
            y: number;
            z: number;
            size: number;
            opacity: number;
        }

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        };

        const initStars = () => {
            stars = [];
            const numStars = Math.floor((canvas.width * canvas.height) / 8000);
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    z: Math.random() * 3 + 0.5,
                    size: Math.random() * 1.5 + 0.5,
                    opacity: Math.random() * 0.5 + 0.3,
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stars.forEach((star) => {
                // Move stars slowly downward for a flight effect
                star.y += star.z * 0.15;

                // Wrap around
                if (star.y > canvas.height) {
                    star.y = 0;
                    star.x = Math.random() * canvas.width;
                }

                // Twinkle effect
                const twinkle = Math.sin(Date.now() * 0.002 + star.x) * 0.15 + 0.85;
                const finalOpacity = star.opacity * twinkle;

                // Draw star - Optimized to avoid gradient creation in loop
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(148, 163, 184, ${finalOpacity})`;
                ctx.fill();

                // Add simple glow for larger stars using reduced opacity circle instead of gradient
                if (star.size > 1.2) {
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(148, 163, 184, ${finalOpacity * 0.15})`;
                    ctx.fill();
                }
            });

            animationId = requestAnimationFrame(animate);
        };

        resize();
        window.addEventListener('resize', resize);
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ opacity: 0.6 }}
        />
    );
};

export default StarfieldBackground;
