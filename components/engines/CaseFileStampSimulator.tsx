import React, { useState } from 'react';
import { CheckCircle2, FileWarning, RotateCcw, Stamp } from 'lucide-react';
import { RichText } from '../lesson';

export interface StampCaseFile {
  id: string;
  docketCode: string;
  scenario: string;
  correctStampId: string;
  why: string;
}

export interface TreatyStampOption {
  id: string;
  label: string;
  sublabel?: string;
}

interface CaseFileStampSimulatorProps {
  title?: string;
  subtitle?: string;
  stamps: TreatyStampOption[];
  cases: StampCaseFile[];
}

export const CaseFileStampSimulator: React.FC<CaseFileStampSimulatorProps> = ({
  title = 'DESK STAMP SIMULATOR',
  subtitle = 'Case files land on your desk. Read the incident or dispute and press the governing legal stamp.',
  stamps,
  cases,
}) => {
  const [idx, setIdx] = useState(0);
  const [stamped, setStamped] = useState(false);
  const [wrongStampId, setWrongStampId] = useState<string | null>(null);
  const [firstTryClean, setFirstTryClean] = useState(0);
  const [hadSlipThisCase, setHadSlipThisCase] = useState(false);
  const [feedback, setFeedback] = useState('');

  const finished = idx >= cases.length;
  const activeCase = cases[idx];
  const matchedStamp = activeCase
    ? stamps.find((s) => s.id === activeCase.correctStampId)
    : undefined;

  const pressStamp = (stampId: string) => {
    if (finished || stamped || !activeCase) return;
    if (stampId !== activeCase.correctStampId) {
      setHadSlipThisCase(true);
      setWrongStampId(stampId);
      setFeedback('Wrong treaty desk — check whether this involves sovereignty, passenger liability, cargo, or unlawful interference.');
      setTimeout(() => setWrongStampId(null), 360);
      return;
    }

    setStamped(true);
    setFeedback(activeCase.why);
    if (!hadSlipThisCase) {
      setFirstTryClean((c) => c + 1);
    }
  };

  const nextCase = () => {
    setIdx((i) => i + 1);
    setStamped(false);
    setHadSlipThisCase(false);
    setFeedback('');
  };

  const resetAll = () => {
    setIdx(0);
    setStamped(false);
    setHadSlipThisCase(false);
    setFirstTryClean(0);
    setFeedback('');
  };

  return (
    <section className="dx-card p-5 sm:p-6 my-6" aria-label={title}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <Stamp className="w-4 h-4 text-amber-400" />
            <span className="hud-label text-amber-400">{title}</span>
          </div>
          <p className="text-xs sm:text-sm text-muted mt-1">{subtitle}</p>
        </div>
        <span className="font-mono text-xs font-bold px-2.5 py-1 border border-line bg-bg text-ink">
          {finished ? 'DESK CLEAR' : `CASE ${idx + 1} / ${cases.length}`}
        </span>
      </div>

      {!finished && activeCase ? (
        <div className="space-y-4">
          {/* Physical Case File Dossier */}
          <div className="relative border-[1.5px] border-line-strong bg-bg p-5 min-h-[130px] overflow-hidden">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2 flex items-center gap-2">
              <FileWarning className="w-3.5 h-3.5 text-rose-400" />
              <span>DOCKET // {activeCase.docketCode}</span>
            </div>
            <p className="text-sm sm:text-base font-medium text-ink leading-relaxed max-w-2xl">
              <RichText text={activeCase.scenario} />
            </p>

            {/* Slammed Ink Stamp Overlay */}
            {stamped && matchedStamp && (
              <div className="mt-3 sm:mt-0 sm:absolute sm:top-4 sm:right-5 inline-block border-2 border-emerald-400 bg-emerald-500/15 px-3.5 py-1.5 font-mono text-xs font-black uppercase tracking-widest text-emerald-300 -rotate-6 shadow-lg">
                ✓ {matchedStamp.label}
              </div>
            )}
          </div>

          {/* Desk Stamps Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {stamps.map((s) => {
              const isCorrectNow = stamped && s.id === activeCase.correctStampId;
              const isWrong = wrongStampId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={stamped}
                  onClick={() => pressStamp(s.id)}
                  className={`p-2.5 border text-left transition-all cursor-pointer ${
                    isCorrectNow
                      ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200'
                      : isWrong
                      ? 'dx-shake border-rose-500 bg-rose-500/20 text-rose-200'
                      : 'border-line bg-bg-sunken hover:border-amber-400 text-ink'
                  }`}
                >
                  <div className="font-mono text-xs font-bold leading-tight">{s.label}</div>
                  {s.sublabel && (
                    <div className="text-[10px] text-muted mt-0.5">{s.sublabel}</div>
                  )}
                </button>
              );
            })}
          </div>

          {feedback && (
            <div
              className={`border p-3 text-xs leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                stamped
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100'
                  : 'border-amber-500/50 bg-amber-500/10 text-amber-200'
              }`}
            >
              <span>
                <RichText text={feedback} />
              </span>
              {stamped && (
                <button
                  type="button"
                  onClick={nextCase}
                  className="shrink-0 px-4 py-1.5 bg-cad-accent text-white font-mono text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  {idx + 1 < cases.length ? 'Next case file →' : 'Finish docket'}
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <div className="font-display text-lg font-bold text-ink">
                All {cases.length} case files stamped ({firstTryClean} / {cases.length} first-try)
              </div>
              <p className="text-xs text-muted">
                You now separate state sovereignty (Chicago), liability (Montreal 1999), onboard offences (Tokyo), hijacking (Hague), sabotage (Montreal 1971), and third-party ground damage (Rome).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-line-strong bg-bg text-xs font-mono font-bold uppercase text-ink cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Stamp again
          </button>
        </div>
      )}
    </section>
  );
};

export default CaseFileStampSimulator;
