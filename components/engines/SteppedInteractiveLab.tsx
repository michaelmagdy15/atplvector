import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { RichText } from '../lesson';

export interface SteppedLabControl {
  key: string;
  label: string;
  unit?: string;
  min: number;
  max: number;
  step?: number;
}

export interface SteppedLabStep {
  id: string;
  title: string;
  body: string;
  memoryHook?: string;
  /** At most ONE just-in-time control revealed ONLY on this step */
  control?: SteppedLabControl;
  /** Optional embedded micro-check question (typically on the last 1–2 steps) */
  check?: {
    question: string;
    options: string[];
    answerIndex: number;
    why: string;
  };
}

interface SteppedInteractiveLabProps {
  title: string;
  subtitle?: string;
  steps: SteppedLabStep[];
  values: Record<string, number>;
  onChangeValue: (key: string, value: number) => void;
  renderCanvas: (activeStep: SteppedLabStep, stepIndex: number) => React.ReactNode;
}

export const SteppedInteractiveLab: React.FC<SteppedInteractiveLabProps> = ({
  title,
  subtitle,
  steps,
  values,
  onChangeValue,
  renderCanvas,
}) => {
  const [stepIdx, setStepIdx] = useState(0);
  const [pickedMap, setPickedMap] = useState<Record<string, number>>({});

  const step = steps[Math.max(0, Math.min(stepIdx, steps.length - 1))];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      if (e.key === 'ArrowRight') {
        setStepIdx((i) => Math.min(steps.length - 1, i + 1));
      } else if (e.key === 'ArrowLeft') {
        setStepIdx((i) => Math.max(0, i - 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [steps.length]);

  if (!step) return null;

  const picked = pickedMap[step.id];

  return (
    <section className="dx-card overflow-hidden my-6" aria-label={title}>
      {/* Top Bar */}
      <div className="px-5 py-3.5 border-b border-line bg-bg-sunken flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="hud-label text-cad-accent">{title}</div>
          {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Lesson steps">
          {steps.map((s, i) => {
            const isCheck = !!s.check;
            const isCur = i === stepIdx;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={isCur}
                aria-label={`Step ${i + 1}: ${s.title}`}
                onClick={() => setStepIdx(i)}
                className={`h-2.5 transition-all cursor-pointer ${
                  isCur
                    ? 'w-7 bg-cad-accent'
                    : isCheck
                    ? 'w-2.5 bg-amber-400/70 hover:bg-amber-400'
                    : 'w-2.5 bg-line-strong hover:bg-ink'
                }`}
                title={isCheck ? `Micro-check: ${s.title}` : s.title}
              />
            );
          })}
        </div>
      </div>

      {/* 55% Left Live Canvas | 45% Right Stepped Micro-Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 p-4 sm:p-6 bg-bg border-b lg:border-b-0 lg:border-r border-line flex items-center justify-center min-h-[300px]">
          {renderCanvas(step, stepIdx)}
        </div>

        <div className="lg:col-span-5 p-5 sm:p-6 bg-bg-raised flex flex-col justify-between gap-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-widest">
              <span className="text-cad-accent">
                STEP {stepIdx + 1} OF {steps.length}
              </span>
              {step.check && (
                <span className="text-amber-400">MICRO-CHECK</span>
              )}
            </div>

            <h3 className="font-display text-xl font-bold text-ink leading-snug">
              {step.title}
            </h3>

            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              <RichText text={step.body} />
            </p>

            {step.memoryHook && (
              <div className="border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-100 leading-relaxed">
                <span className="font-mono font-bold uppercase tracking-wider text-amber-400 mr-1.5">
                  Hook:
                </span>
                <RichText text={step.memoryHook} />
              </div>
            )}

            {/* Just-in-time single control disclosure */}
            {step.control && (
              <div className="border-[1.5px] border-line-strong bg-bg p-4">
                <div className="flex items-center justify-between font-mono text-xs mb-2">
                  <span className="uppercase tracking-wider text-muted">
                    {step.control.label}
                  </span>
                  <span className="font-bold text-cad-accent">
                    {values[step.control.key] ?? step.control.min}{' '}
                    {step.control.unit || ''}
                  </span>
                </div>
                <input
                  type="range"
                  min={step.control.min}
                  max={step.control.max}
                  step={step.control.step || 1}
                  value={values[step.control.key] ?? step.control.min}
                  onChange={(e) =>
                    onChangeValue(step.control!.key, Number(e.target.value))
                  }
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>
            )}

            {/* Optional Micro-Check */}
            {step.check && (
              <div className="space-y-2 pt-1">
                <p className="text-xs font-semibold text-ink">
                  <RichText text={step.check.question} />
                </p>
                <div className="space-y-1.5">
                  {step.check.options.map((opt, idx) => {
                    const chosen = picked === idx;
                    const correct = idx === step.check!.answerIndex;
                    let cls = 'border-line bg-bg text-ink hover:border-line-strong';
                    if (picked !== undefined) {
                      if (correct) cls = 'border-emerald-500 bg-emerald-500/15 text-emerald-200';
                      else if (chosen) cls = 'border-rose-500 bg-rose-500/15 text-rose-200';
                      else cls = 'border-line bg-bg text-muted opacity-55';
                    }
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={picked !== undefined}
                        onClick={() =>
                          setPickedMap((prev) => ({ ...prev, [step.id]: idx }))
                        }
                        className={`w-full px-3 py-2 border text-left text-xs font-medium cursor-pointer ${cls}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {picked !== undefined && (
                  <div
                    className={`p-2.5 border text-xs flex items-start gap-2 ${
                      picked === step.check.answerIndex
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200'
                        : 'border-rose-500/50 bg-rose-500/10 text-rose-200'
                    }`}
                  >
                    {picked === step.check.answerIndex ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <span>
                      <RichText text={step.check.why} />
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-line">
            <button
              type="button"
              disabled={stepIdx === 0}
              onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-line bg-bg text-xs font-mono font-bold uppercase text-ink disabled:opacity-35 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button
              type="button"
              disabled={stepIdx >= steps.length - 1}
              onClick={() => setStepIdx((i) => Math.min(steps.length - 1, i + 1))}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-cad-accent text-white text-xs font-mono font-bold uppercase disabled:opacity-35 cursor-pointer"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SteppedInteractiveLab;
