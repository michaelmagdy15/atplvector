import React, { useEffect } from 'react';

interface SplineVisualizerProps {
  sceneUrl: string;
  fallbackColor?: string;
  fallbackImageUrl?: string;
  mobileBreakpoint?: number;
  className?: string;
  children?: React.ReactNode;
  onLoad?: (app: unknown) => void;
  onMouseDown?: (e: unknown) => void;
  onMouseHover?: (e: unknown) => void;
  interactive?: boolean;
}

/**
 * Lightweight dot-grid visual container preserving the legacy SplineVisualizer contract
 * without importing the heavy external @splinetool runtime (~2 MB saved).
 */
const SplineVisualizer: React.FC<SplineVisualizerProps> = ({
  fallbackColor = 'var(--bg)',
  fallbackImageUrl,
  className = '',
  children,
  onLoad,
}) => {
  useEffect(() => {
    onLoad?.(null);
  }, [onLoad]);

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-dot-grid ${className}`}
      style={{
        backgroundColor: fallbackImageUrl ? undefined : fallbackColor,
        backgroundImage: fallbackImageUrl
          ? `url(${fallbackImageUrl})`
          : undefined,
        backgroundSize: fallbackImageUrl ? 'cover' : undefined,
        backgroundPosition: fallbackImageUrl ? 'center' : undefined,
      }}
    >
      {children && (
        <div className="relative z-10 w-full h-full">{children}</div>
      )}
    </div>
  );
};

export default SplineVisualizer;
