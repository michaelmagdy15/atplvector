import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import type { Application } from '@splinetool/runtime';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineVisualizerProps {
    sceneUrl: string;
    fallbackColor?: string;
    fallbackImageUrl?: string;
    mobileBreakpoint?: number;
    className?: string;
    children?: React.ReactNode;
    onLoad?: (app: Application) => void;
    onMouseDown?: (e: any) => void;
    onMouseHover?: (e: any) => void;
    interactive?: boolean;
}

function shouldLoadSpline(mobileBreakpoint: number): boolean {
    if (window.innerWidth < mobileBreakpoint || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (connection?.saveData || connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g') return false;
    const device = navigator as Navigator & { deviceMemory?: number };
    if ((device.deviceMemory && device.deviceMemory <= 2) ||
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2)) return false;

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
}

const SplineVisualizer: React.FC<SplineVisualizerProps> = ({
    sceneUrl,
    fallbackColor = '#0f172a',
    fallbackImageUrl,
    mobileBreakpoint = 768,
    className = '',
    children,
    onLoad,
    onMouseDown,
    onMouseHover,
    interactive = true,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [canLoad, setCanLoad] = useState(false);
    const [visible, setVisible] = useState(false);
    const [startLoading, setStartLoading] = useState(false);
    const [splineLoaded, setSplineLoaded] = useState(false);
    const [splineFailed, setSplineFailed] = useState(false);

    useEffect(() => {
        const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const connection = (navigator as Navigator & {
            connection?: EventTarget & { saveData?: boolean; effectiveType?: string };
        }).connection;
        const update = () => setCanLoad(shouldLoadSpline(mobileBreakpoint));
        update();
        window.addEventListener('resize', update);
        motion.addEventListener('change', update);
        connection?.addEventListener?.('change', update);
        return () => {
            window.removeEventListener('resize', update);
            motion.removeEventListener('change', update);
            connection?.removeEventListener?.('change', update);
        };
    }, [mobileBreakpoint]);

    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;
        if (!('IntersectionObserver' in window)) {
            setVisible(true);
            return;
        }
        const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!canLoad || !visible || startLoading) return;
        if ('requestIdleCallback' in window) {
            const id = window.requestIdleCallback(() => setStartLoading(true), { timeout: 2000 });
            return () => window.cancelIdleCallback(id);
        }
        const id = setTimeout(() => setStartLoading(true), 150);
        return () => clearTimeout(id);
    }, [canLoad, visible, startLoading]);

    useEffect(() => {
        if (!canLoad || !startLoading || splineLoaded || splineFailed) return;
        const id = window.setTimeout(() => setSplineFailed(true), 15000);
        return () => window.clearTimeout(id);
    }, [canLoad, startLoading, splineLoaded, splineFailed, sceneUrl]);

    useEffect(() => {
        setSplineLoaded(false);
        setSplineFailed(false);
    }, [sceneUrl]);

    const showSpline = canLoad && startLoading && !splineFailed;

    return (
        <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
            {/* Fallback layer */}
            <div
                className="absolute inset-0 z-0 transition-opacity duration-1000"
                style={{
                    background: fallbackImageUrl
                        ? `url(${fallbackImageUrl}) center/cover no-repeat`
                        : fallbackColor,
                    opacity: splineLoaded && showSpline ? 0 : 1,
                    pointerEvents: 'none',
                }}
            />

            {/* Spline scene */}
            {showSpline && (
                <Suspense fallback={null}>
                    <Spline
                        key={sceneUrl}
                        scene={sceneUrl}
                        onLoad={(app: Application) => {
                            setSplineLoaded(true);
                            onLoad?.(app);
                        }}
                        onMouseDown={onMouseDown}
                        onMouseOver={onMouseHover}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 0,
                            opacity: splineLoaded ? 1 : 0,
                            transition: 'opacity 1s ease',
                            pointerEvents: interactive && splineLoaded ? 'auto' : 'none',
                        }}
                    />
                </Suspense>
            )}

            {/* Content overlays */}
            {children && (
                <div className="relative z-10 w-full h-full">
                    {children}
                </div>
            )}
        </div>
    );
};

export default SplineVisualizer;
