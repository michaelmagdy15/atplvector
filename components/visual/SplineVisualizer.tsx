import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { Application } from '@splinetool/runtime';

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
    if (typeof window === 'undefined') return false;

    const isMobile = window.innerWidth < mobileBreakpoint;

    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const noWebGL = !gl;

    return !isMobile && !noWebGL;
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
    const [splineLoaded, setSplineLoaded] = useState(false);
    const [splineFailed, setSplineFailed] = useState(false);
    const [canLoad, setCanLoad] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

    useEffect(() => {
        setCanLoad(shouldLoadSpline(mobileBreakpoint));
    }, [mobileBreakpoint]);

    useEffect(() => {
        if (!canLoad) return;

        // If Spline hasn't loaded after 15 seconds, show fallback
        timeoutRef.current = setTimeout(() => {
            if (!splineLoaded) {
                setSplineFailed(true);
            }
        }, 15000);

        return () => clearTimeout(timeoutRef.current);
    }, [canLoad, splineLoaded]);

    const handleLoad = (app: Application) => {
        clearTimeout(timeoutRef.current);
        setSplineLoaded(true);
        if (onLoad) onLoad(app);
    };

    const showFallback = !canLoad || splineFailed;

    return (
        <div
            className={`relative w-full h-full overflow-hidden ${className}`}
        >
            {/* Fallback layer */}
            <div
                className="absolute inset-0 z-0 transition-opacity duration-1000"
                style={{
                    background: fallbackImageUrl
                        ? `url(${fallbackImageUrl}) center/cover no-repeat`
                        : fallbackColor,
                    opacity: splineLoaded && !showFallback ? 0 : 1,
                }}
            />

            {/* Spline scene */}
            {canLoad && !splineFailed && (
                <Suspense fallback={null}>
                    <Spline
                        scene={sceneUrl}
                        onLoad={handleLoad}
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
                            pointerEvents: interactive ? 'auto' : 'none',
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
