import React from 'react';
import { Check, Plane } from 'lucide-react';

export interface FlightPlanWaypoint {
  id: string;
  label: string;
  done?: boolean;
}

interface FlightPlanProgressBarProps {
  chapterCode: string;
  waypoints: FlightPlanWaypoint[];
  activeIndex: number;
  progress: number;
  minutesLeft: number;
  onJump: (index: number) => void;
  rightSlot?: React.ReactNode;
}

export const FlightPlanProgressBar: React.FC<FlightPlanProgressBarProps> = ({
  chapterCode,
  waypoints,
  activeIndex,
  progress,
  minutesLeft,
  onJump,
  rightSlot,
}) => {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const currentWp = waypoints[activeIndex];

  return (
    <nav
      aria-label="Chapter flight plan waypoints"
      className="sticky top-[56px] sm:top-[64px] z-30 border-y border-line bg-bg/95 backdrop-blur-md px-3 sm:px-5 py-2.5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Chapter Code & Current Leg */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 border border-line-strong bg-bg-raised text-cad-accent shrink-0">
            {chapterCode}
          </span>
          <span className="text-xs font-semibold text-ink truncate">
            {activeIndex + 1} / {Math.max(1, waypoints.length)} · {currentWp?.label || 'Briefing'}
          </span>
        </div>

        {/* Center: Horizontal Runway/Route Waypoint Scrubber */}
        <div className="hidden md:flex flex-1 max-w-md items-center relative h-6 mx-4">
          {/* Base Track */}
          <div className="w-full h-[2px] bg-line relative overflow-hidden">
            <div
              className="h-full bg-cad-accent transition-transform duration-150 origin-left"
              style={{ transform: `scaleX(${clampedProgress})` }}
            />
          </div>

          {/* Moving Aircraft Marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-all duration-150"
            style={{ left: `${clampedProgress * 100}%` }}
          >
            <div className="bg-bg px-0.5 text-cad-accent">
              <Plane className="w-3.5 h-3.5 rotate-45 fill-current" />
            </div>
          </div>

          {/* Waypoint Buttons */}
          {waypoints.map((wp, idx) => {
            const pct =
              waypoints.length > 1 ? ((idx + 0.5) / waypoints.length) * 100 : 50;
            const isCur = idx === activeIndex;
            const isPast = idx < activeIndex;

            return (
              <button
                key={wp.id}
                type="button"
                title={wp.label}
                aria-label={`Jump to ${wp.label}`}
                aria-current={isCur ? 'step' : undefined}
                onClick={() => onJump(idx)}
                style={{ left: `${pct}%` }}
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center border transition-transform cursor-pointer ${
                  isCur
                    ? 'bg-cad-accent border-white text-white scale-110 shadow'
                    : wp.done || isPast
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 hover:scale-110'
                    : 'bg-bg border-line-strong text-muted hover:border-ink hover:scale-110'
                }`}
              >
                {wp.done ? (
                  <Check className="w-2.5 h-2.5" />
                ) : (
                  <span className="text-[9px] font-mono font-bold">{idx + 1}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: ETA + Optional Action Slot */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="font-mono text-[11px] text-muted hidden sm:inline">
            {minutesLeft <= 0 ? '✓ Debrief ready' : `≈ ${minutesLeft} min left`}
          </span>
          {rightSlot}
        </div>
      </div>
    </nav>
  );
};

export default FlightPlanProgressBar;
