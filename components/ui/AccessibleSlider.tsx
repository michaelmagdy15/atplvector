import React, { useId } from 'react';

export interface AccessibleSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  coarseStepMultiplier?: number;
  onChange: (value: number) => void;
  helperText?: string;
  ariaValueText?: (val: number) => string;
  className?: string;
  accentColor?: 'cyan' | 'emerald' | 'amber' | 'sky';
  disabled?: boolean;
}

/**
 * WCAG 2.2 AA compliant range slider component for aviation instruments.
 * Features:
 * - Proper keyboard navigation (Arrows for fine step, PageUp/PageDown for coarse step, Home/End for bounds)
 * - Associated label via generated useId
 * - Companion direct numeric input for motor-impaired users and precision input
 * - High-contrast focus indicators
 * - Human-readable aria-valuetext
 */
export const AccessibleSlider: React.FC<AccessibleSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  coarseStepMultiplier = 10,
  onChange,
  helperText,
  ariaValueText,
  className = '',
  accentColor = 'cyan',
  disabled = false,
}) => {
  const generatedId = useId();
  const inputId = `${generatedId}-slider`;
  const numberId = `${generatedId}-number`;
  const helperId = helperText ? `${generatedId}-helper` : undefined;

  const coarseStep = step * coarseStepMultiplier;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    let nextValue = value;

    switch (e.key) {
      case 'PageUp':
        nextValue = Math.min(max, value + coarseStep);
        e.preventDefault();
        break;
      case 'PageDown':
        nextValue = Math.max(min, value - coarseStep);
        e.preventDefault();
        break;
      case 'Home':
        nextValue = min;
        e.preventDefault();
        break;
      case 'End':
        nextValue = max;
        e.preventDefault();
        break;
      default:
        return;
    }

    onChange(nextValue);
  };

  const formattedValueText = ariaValueText
    ? ariaValueText(value)
    : `${value}${unit ? ` ${unit}` : ''}`;

  const accentClasses = {
    cyan: 'accent-cyan-400 focus-visible:ring-cyan-400',
    emerald: 'accent-emerald-400 focus-visible:ring-emerald-400',
    amber: 'accent-amber-400 focus-visible:ring-amber-400',
    sky: 'accent-sky-400 focus-visible:ring-sky-400',
  }[accentColor];

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <label
          htmlFor={inputId}
          className="text-xs font-bold text-slate-200 uppercase tracking-wider select-none cursor-pointer"
        >
          {label}
        </label>
        <div className="flex items-center gap-1.5">
          <label htmlFor={numberId} className="sr-only">
            {label} numeric value
          </label>
          <input
            id={numberId}
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) {
                onChange(Math.min(max, Math.max(min, val)));
              }
            }}
            className="w-20 px-2 py-1 text-xs font-mono font-bold text-white bg-slate-800/80 border border-slate-700 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-50 text-right"
          />
          {unit && (
            <span className="text-xs font-mono text-slate-400 select-none">
              {unit}
            </span>
          )}
        </div>
      </div>

      <div className="relative flex items-center">
        <input
          id={inputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onKeyDown={handleKeyDown}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={formattedValueText}
          aria-describedby={helperId}
          className={`w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${accentClasses}`}
        />
      </div>

      {helperText && (
        <p id={helperId} className="text-[11px] text-slate-400 leading-tight">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default AccessibleSlider;
