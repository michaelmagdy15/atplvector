import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, Printer, X } from 'lucide-react';
import RichText from './RichText';

export interface KneeboardFormula {
  name: string;
  formula: string;
  whenToUse?: string;
}

export interface KneeboardNumber {
  label: string;
  value: string;
  note?: string;
}

export interface ChapterKneeboardDrawerProps {
  chapterCode: string;
  chapterTitle: string;
  formulas: KneeboardFormula[];
  keyNumbers: KneeboardNumber[];
  memoryHooks?: string[];
  buttonLabel?: string;
}

export const ChapterKneeboardDrawer: React.FC<ChapterKneeboardDrawerProps> = ({
  chapterCode,
  chapterTitle,
  formulas,
  keyNumbers,
  memoryHooks = [],
  buttonLabel = 'Kneeboard & Formulas',
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider border border-line-strong bg-bg-raised text-ink hover:bg-bg-sunken transition-colors cursor-pointer"
      >
        <BookOpen className="w-3.5 h-3.5 text-cad-accent" />
        <span>{buttonLabel}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[9995] flex justify-end" role="dialog" aria-modal="true" aria-label={`${chapterCode} Kneeboard`}>
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
          />
          <aside className="relative z-10 w-full max-w-lg bg-bg border-l-[1.5px] border-line-strong h-full flex flex-col shadow-2xl overflow-hidden">
            {/* Drawer Header */}
            <div className="p-5 border-b border-line bg-bg-raised flex items-center justify-between gap-3">
              <div>
                <div className="hud-label text-cad-accent">KNEEBOARD // {chapterCode}</div>
                <h3 className="font-display text-lg font-bold text-ink mt-0.5">{chapterTitle}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono font-bold uppercase border border-line bg-bg text-ink hover:border-line-strong cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close kneeboard"
                  className="p-2 border border-line bg-bg text-muted hover:text-ink cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {formulas.length > 0 && (
                <div>
                  <div className="hud-label text-muted mb-2.5">KEY FORMULAS</div>
                  <div className="space-y-2.5">
                    {formulas.map((f, i) => (
                      <div key={i} className="dx-card p-3.5">
                        <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-cad-accent mb-1">
                          {f.name}
                        </div>
                        <div className="font-mono text-sm text-ink leading-relaxed">
                          <RichText text={f.formula} />
                        </div>
                        {f.whenToUse && (
                          <div className="text-xs text-muted mt-1.5">
                            <RichText text={f.whenToUse} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {keyNumbers.length > 0 && (
                <div>
                  <div className="hud-label text-muted mb-2.5">EXAM NUMBERS & LIMITS</div>
                  <div className="border border-line divide-y divide-line bg-bg-raised">
                    {keyNumbers.map((k, i) => (
                      <div key={i} className="p-3 flex items-start justify-between gap-4">
                        <div>
                          <div className="text-xs font-semibold text-ink">{k.label}</div>
                          {k.note && <div className="text-[11px] text-muted mt-0.5">{k.note}</div>}
                        </div>
                        <div className="font-mono text-xs font-bold text-amber-400 shrink-0">
                          {k.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {memoryHooks.length > 0 && (
                <div>
                  <div className="hud-label text-amber-400 mb-2.5">MEMORY HOOKS</div>
                  <ul className="space-y-2">
                    {memoryHooks.map((hook, i) => (
                      <li
                        key={i}
                        className="border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-100 leading-relaxed"
                      >
                        <RichText text={hook} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export interface AcarsRow {
  heading?: string;
  label?: string;
  value?: string;
}

export interface ACARSDebriefSlipProps {
  header?: string;
  chapterLabel: string;
  headline: string;
  rows: AcarsRow[];
}

export const ACARSDebriefSlip: React.FC<ACARSDebriefSlipProps> = ({
  header = 'ACARS // ATPLVECTOR DISPATCH',
  chapterLabel,
  headline,
  rows,
}) => {
  const slipRef = useRef<HTMLDivElement>(null);
  const [printed, setPrinted] = useState(false);

  useEffect(() => {
    const el = slipRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setPrinted(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setPrinted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="my-10 flex justify-center" aria-label="Chapter ACARS debrief">
      <div className="w-full max-w-2xl">
        {/* Thermal printer slot */}
        <div className="flex items-center justify-between px-4 py-2 bg-bg-sunken border-[1.5px] border-line border-b-0">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
            ACARS PRINTER
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>

        <div
          ref={slipRef}
          className={`acars-slip ${printed ? 'printed' : ''} border-[1.5px] border-line-strong bg-bg-raised font-mono text-xs p-5 md:p-6 shadow-xl`}
        >
          <div className="text-muted text-[11px] tracking-widest border-b border-dashed border-line pb-2 mb-3 flex flex-wrap justify-between gap-2">
            <span>{header}</span>
            <span>{chapterLabel}</span>
          </div>

          <h3 className="text-base md:text-lg font-bold text-ink tracking-tight mb-4">
            <RichText text={headline} />
          </h3>

          <div className="space-y-2.5">
            {rows.map((row, idx) => {
              if (row.heading) {
                return (
                  <div
                    key={idx}
                    className="pt-2 mt-2 border-t border-dashed border-line text-[10px] font-bold uppercase tracking-[0.18em] text-cad-accent"
                  >
                    {row.heading}
                  </div>
                );
              }
              return (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs leading-relaxed"
                >
                  <span className="text-muted">
                    <RichText text={row.label || ''} />
                  </span>
                  {row.value && (
                    <span className="font-bold text-ink sm:text-right shrink-0">
                      <RichText text={row.value} />
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-faint text-[10px] tracking-[0.22em] border-t border-dashed border-line pt-3 mt-4 text-center">
            --- END OF MESSAGE ---
          </div>
        </div>
      </div>
    </section>
  );
};
