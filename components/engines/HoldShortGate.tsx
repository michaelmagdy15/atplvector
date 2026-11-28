import React, { useEffect, useMemo, useState } from 'react';
import { Award, CheckCircle2, RefreshCw, ShieldAlert, XCircle } from 'lucide-react';
import { RichText } from '../lesson';
import {
  genRtomThreeColumn,
  MATH_GENERATORS,
  MathGeneratorId,
  MathProblem,
  RtomProblem,
  WorkedStep,
} from '../../lib/generators/aviationMathGenerators';

export type HoldGateSpec =
  | {
      id: string;
      kind: 'sentence';
      askedInEasa?: boolean;
      sentence: string; // contains ___
      options: string[];
      answerIndex: number;
      yes?: string;
      why: string;
      steps?: WorkedStep[];
      showOnPass?: Record<string, any>;
    }
  | {
      id: string;
      kind: 'sort';
      askedInEasa?: boolean;
      ask: string;
      bins: Array<{ label: string; desc?: string }>;
      items: Array<{ text: string; binIndex: number; note?: string; scenePatch?: Record<string, any> }>;
      why: string;
      showOnPass?: Record<string, any>;
    }
  | {
      id: string;
      kind: 'set';
      askedInEasa?: boolean;
      ask: string;
      sub?: string;
      lever: { key: string; label: string; unit?: string; min: number; max: number; step?: number; start: number };
      okRange: [number, number];
      goLabel?: string;
      yes?: string;
      hint: string;
      why: string;
      during?: Record<string, any>;
      showOnPass?: Record<string, any>;
    }
  | {
      id: string;
      kind: 'call';
      askedInEasa?: boolean;
      ask: string;
      lever: { key: string; label: string; unit?: string; min: number; max: number; step?: number; start: number };
      baseValue: number;
      truthValue: number;
      playTween: { key: string; from: number; to: number; ms?: number };
      yes?: string;
      why: string;
      during?: Record<string, any>;
      showOnPass?: Record<string, any>;
    }
  | {
      id: string;
      kind: 'tape';
      askedInEasa?: boolean;
      ask: string;
      orderedSpeeds: string[];
      hints?: Record<string, string>;
      notes?: Record<string, string>;
      sceneKey?: string;
      why: string;
      showOnPass?: Record<string, any>;
    }
  | {
      id: string;
      kind: 'redpen';
      askedInEasa?: boolean;
      ask: string;
      rows: Array<{ label: string; value: string; fix?: string; note?: string }>;
      yes?: string;
      why: string;
      showOnPass?: Record<string, any>;
    }
  | {
      id: string;
      kind: 'tiles';
      askedInEasa?: boolean;
      ask: string;
      answerTiles: string[];
      extraTiles?: string[];
      yes?: string;
      why: string;
      showOnPass?: Record<string, any>;
    }
  | {
      id: string;
      kind: 'num';
      askedInEasa?: boolean;
      generator?: MathGeneratorId;
      staticProblem?: MathProblem;
      during?: Record<string, any>;
      showOnPass?: Record<string, any>;
    }
  | {
      id: string;
      kind: 'cols';
      during?: Record<string, any>;
      showOnPass?: Record<string, any>;
    };

export interface HoldShortGateProps {
  gate: HoldGateSpec;
  onSceneOverride?: (patch: Record<string, any>) => void;
  onScenePlay?: (key: string, from: number, to: number, ms: number, onDone?: () => void) => void;
  onCleared?: (id: string) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const FeedbackBlock: React.FC<{
  ok: boolean;
  title: string;
  body?: string;
  steps?: WorkedStep[];
}> = ({ ok, title, body, steps }) => (
  <div
    className={`mt-3 border p-3.5 text-xs leading-relaxed ${
      ok
        ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-100'
        : 'border-rose-500/60 bg-rose-500/10 text-rose-100'
    }`}
  >
    <div className="flex items-center gap-1.5 font-mono font-bold uppercase tracking-wider mb-1">
      {ok ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      ) : (
        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
      )}
      <span>{title}</span>
    </div>
    {body && (
      <p className="text-muted mt-1">
        <RichText text={body} />
      </p>
    )}
    {steps && steps.length > 0 && (
      <div className="mt-2.5 border border-line bg-bg divide-y divide-line font-mono text-[11px]">
        {steps.map((st, idx) => (
          <div
            key={idx}
            className={`px-3 py-1.5 flex items-center justify-between gap-3 ${
              st.isAnswer ? 'bg-emerald-500/15 text-emerald-300 font-bold' : 'text-muted'
            }`}
          >
            <span>
              <RichText text={st.label} />
            </span>
            <span className="font-bold text-ink shrink-0">{st.value}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

export const HoldShortGate: React.FC<HoldShortGateProps> = ({
  gate,
  onSceneOverride,
  onScenePlay,
  onCleared,
}) => {
  const [cleared, setCleared] = useState(false);

  const markCleared = (patch?: Record<string, any>) => {
    setCleared(true);
    if (patch) onSceneOverride?.(patch);
    onCleared?.(gate.id);
  };

  return (
    <div
      className={`my-5 border-[1.5px] bg-bg-raised p-4 sm:p-5 transition-colors ${
        cleared ? 'border-emerald-500/70' : 'border-amber-500/60'
      }`}
    >
      {/* Amber/Emerald Runway Hold-Short Header Strip */}
      <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-dashed border-line">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block w-2.5 h-2.5 ${
              cleared ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
          <span
            className={`hud-label ${
              cleared ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {cleared ? 'CLEARED · HOLD SHORT COMPLETE' : 'HOLD SHORT · ACTIVE CHECK'}
          </span>
        </div>
        {'askedInEasa' in gate && gate.askedInEasa && (
          <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-amber-400/40 bg-amber-500/10 text-amber-300">
            ★ EASA Paper
          </span>
        )}
      </div>

      {gate.kind === 'sentence' && (
        <SentenceGate gate={gate} onDone={markCleared} />
      )}
      {gate.kind === 'sort' && (
        <SortGate gate={gate} onSceneOverride={onSceneOverride} onDone={markCleared} />
      )}
      {gate.kind === 'set' && (
        <SetGate gate={gate} onSceneOverride={onSceneOverride} onDone={markCleared} />
      )}
      {gate.kind === 'call' && (
        <CallGate
          gate={gate}
          onSceneOverride={onSceneOverride}
          onScenePlay={onScenePlay}
          onDone={markCleared}
        />
      )}
      {gate.kind === 'tape' && (
        <TapeGate gate={gate} onSceneOverride={onSceneOverride} onDone={markCleared} />
      )}
      {gate.kind === 'redpen' && (
        <RedPenGate gate={gate} onDone={markCleared} />
      )}
      {gate.kind === 'tiles' && (
        <TilesGate gate={gate} onDone={markCleared} />
      )}
      {gate.kind === 'num' && (
        <NumGate gate={gate} onSceneOverride={onSceneOverride} onDone={markCleared} />
      )}
      {gate.kind === 'cols' && (
        <ColsGate gate={gate} onSceneOverride={onSceneOverride} onDone={markCleared} />
      )}
    </div>
  );
};

// 1. SENTENCE (Cloze Fill)
const SentenceGate: React.FC<{
  gate: Extract<HoldGateSpec, { kind: 'sentence' }>;
  onDone: (patch?: Record<string, any>) => void;
}> = ({ gate, onDone }) => {
  const [picked, setPicked] = useState<number | null>(null);
  const shuffledIdx = useMemo(() => shuffle(gate.options.map((_, i) => i)), [gate.id]);
  const [before, after] = gate.sentence.split('___');
  const isOk = picked === gate.answerIndex;

  return (
    <div>
      <p className="text-sm text-ink leading-relaxed mb-3.5">
        <RichText text={before} />
        <span
          className={`inline-block min-w-[84px] text-center px-2 py-0.5 mx-1 border-b-2 font-mono font-bold ${
            picked === null
              ? 'border-amber-400 text-amber-300 bg-bg-sunken'
              : isOk
              ? 'border-emerald-400 text-emerald-300 bg-emerald-500/15'
              : 'border-rose-400 text-rose-300 bg-rose-500/15'
          }`}
        >
          {picked === null ? '_____' : gate.options[picked]}
        </span>
        <RichText text={after || ''} />
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {shuffledIdx.map((idx) => {
          const opt = gate.options[idx];
          const chosen = picked === idx;
          const correct = idx === gate.answerIndex;
          let cls = 'border-line bg-bg text-ink hover:border-line-strong';
          if (picked !== null) {
            if (correct) cls = 'border-emerald-500 bg-emerald-500/15 text-emerald-200';
            else if (chosen) cls = 'border-rose-500 bg-rose-500/15 text-rose-200';
            else cls = 'border-line bg-bg text-muted opacity-60';
          }
          return (
            <button
              key={idx}
              type="button"
              disabled={picked !== null}
              onClick={() => {
                setPicked(idx);
                onDone(gate.showOnPass);
              }}
              className={`px-3 py-2 text-left text-xs font-medium border transition-colors cursor-pointer ${cls}`}
            >
              <RichText text={opt} />
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <FeedbackBlock
          ok={isOk}
          title={isOk ? gate.yes || 'Cleared.' : `Not quite — ${gate.options[gate.answerIndex]}`}
          body={gate.why}
          steps={gate.steps}
        />
      )}
    </div>
  );
};

// 2. SORT (Bin Triage)
const SortGate: React.FC<{
  gate: Extract<HoldGateSpec, { kind: 'sort' }>;
  onSceneOverride?: (p: Record<string, any>) => void;
  onDone: (patch?: Record<string, any>) => void;
}> = ({ gate, onSceneOverride, onDone }) => {
  const [cursor, setCursor] = useState(0);
  const [slips, setSlips] = useState(0);
  const [feedback, setFeedback] = useState<string>('');
  const [shakeBin, setShakeBin] = useState<number | null>(null);
  const completed = cursor >= gate.items.length;
  const item = gate.items[cursor];

  const handlePickBin = (binIdx: number) => {
    if (completed || !item) return;
    if (binIdx !== item.binIndex) {
      setSlips((s) => s + 1);
      setShakeBin(binIdx);
      setTimeout(() => setShakeBin(null), 340);
      setFeedback(item.note || 'Wrong category — check what drives that limit.');
      return;
    }
    setFeedback(item.note || 'Correct!');
    if (item.scenePatch) onSceneOverride?.(item.scenePatch);
    const next = cursor + 1;
    setCursor(next);
    if (next >= gate.items.length) {
      onDone(gate.showOnPass);
    }
  };

  return (
    <div>
      <p className="text-xs sm:text-sm font-medium text-ink mb-3">
        <RichText text={gate.ask} />
      </p>

      {!completed ? (
        <>
          <div className="border border-line-strong bg-bg p-3.5 mb-3 flex items-center justify-between gap-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
              ITEM {cursor + 1} / {gate.items.length}
            </span>
            <span className="text-sm font-bold text-ink text-right">
              <RichText text={item.text} />
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {gate.bins.map((b, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handlePickBin(i)}
                className={`p-2.5 border border-line bg-bg hover:border-cad-accent text-left transition-colors cursor-pointer ${
                  shakeBin === i ? 'dx-shake border-rose-500' : ''
                }`}
              >
                <div className="text-xs font-bold text-ink">{b.label}</div>
                {b.desc && <div className="text-[11px] text-muted mt-0.5">{b.desc}</div>}
              </button>
            ))}
          </div>

          {feedback && (
            <p className="text-[11px] text-amber-300 mt-2 font-mono">
              <RichText text={feedback} />
            </p>
          )}
        </>
      ) : (
        <FeedbackBlock
          ok={slips === 0}
          title={
            slips === 0
              ? 'All placed cleanly on the first pass.'
              : `All placed (${slips} slip${slips > 1 ? 's' : ''}).`
          }
          body={gate.why}
        />
      )}
    </div>
  );
};

// 3. SET (Single Lever Target driving live 3D scene)
const SetGate: React.FC<{
  gate: Extract<HoldGateSpec, { kind: 'set' }>;
  onSceneOverride?: (p: Record<string, any>) => void;
  onDone: (patch?: Record<string, any>) => void;
}> = ({ gate, onSceneOverride, onDone }) => {
  const [val, setVal] = useState(gate.lever.start);
  const [checked, setChecked] = useState<{ ok: boolean; msg: string } | null>(null);
  const [locked, setLocked] = useState(false);

  const handleChange = (next: number) => {
    setVal(next);
    onSceneOverride?.({ [gate.lever.key]: next, ...(gate.during || {}) });
  };

  const handleCheck = () => {
    const ok = val >= gate.okRange[0] && val <= gate.okRange[1];
    setChecked({
      ok,
      msg: ok ? gate.yes || 'Spot on.' : gate.hint,
    });
    if (ok) {
      setLocked(true);
      onDone(gate.showOnPass);
    }
  };

  return (
    <div>
      <p className="text-xs sm:text-sm font-medium text-ink mb-2">
        <RichText text={gate.ask} />
      </p>
      {gate.sub && <p className="text-xs text-muted mb-3">{gate.sub}</p>}

      <div className="border border-line bg-bg p-3 mb-3">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-muted uppercase">{gate.lever.label}</span>
          <span className="font-bold text-cad-accent">
            {val} {gate.lever.unit || ''}
          </span>
        </div>
        <input
          type="range"
          disabled={locked}
          min={gate.lever.min}
          max={gate.lever.max}
          step={gate.lever.step || 0.5}
          value={val}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="w-full accent-blue-500 cursor-pointer"
        />
      </div>

      <button
        type="button"
        disabled={locked}
        onClick={handleCheck}
        className="px-4 py-2 bg-cad-accent text-white text-xs font-mono font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer"
      >
        {gate.goLabel || 'Check it'}
      </button>

      {checked && (
        <FeedbackBlock
          ok={checked.ok}
          title={checked.msg}
          body={checked.ok ? gate.why : undefined}
        />
      )}
    </div>
  );
};

// 4. CALL (Predict-Then-Simulate Run It)
const CallGate: React.FC<{
  gate: Extract<HoldGateSpec, { kind: 'call' }>;
  onSceneOverride?: (p: Record<string, any>) => void;
  onScenePlay?: (key: string, from: number, to: number, ms: number, onDone?: () => void) => void;
  onDone: (patch?: Record<string, any>) => void;
}> = ({ gate, onSceneOverride, onScenePlay, onDone }) => {
  const [val, setVal] = useState(gate.lever.start);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ ok: boolean } | null>(null);

  const handleRun = () => {
    setRunning(true);
    const truthDir = Math.sign(gate.truthValue - gate.baseValue);
    const pickDir = Math.sign(val - gate.baseValue);
    const ok = truthDir === 0 ? Math.abs(val - gate.baseValue) <= 1 : pickDir === truthDir;

    onSceneOverride?.({ ...(gate.during || {}), [gate.lever.key]: val });
    if (onScenePlay) {
      onScenePlay(
        gate.playTween.key,
        gate.playTween.from,
        gate.playTween.to,
        gate.playTween.ms ?? 2600,
        () => {
          setRunning(false);
          setResult({ ok });
          onDone(gate.showOnPass);
        }
      );
    } else {
      setRunning(false);
      setResult({ ok });
      onDone(gate.showOnPass);
    }
  };

  return (
    <div>
      <p className="text-xs sm:text-sm font-medium text-ink mb-3">
        <RichText text={gate.ask} />
      </p>

      <div className="border border-line bg-bg p-3 mb-3">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-muted uppercase">{gate.lever.label}</span>
          <span className="font-bold text-amber-300">
            {val} {gate.lever.unit || ''}
          </span>
        </div>
        <input
          type="range"
          disabled={running || result !== null}
          min={gate.lever.min}
          max={gate.lever.max}
          step={gate.lever.step || 1}
          value={val}
          onChange={(e) => {
            const v = Number(e.target.value);
            setVal(v);
            onSceneOverride?.({ [gate.lever.key]: v });
          }}
          className="w-full accent-amber-400 cursor-pointer"
        />
      </div>

      <button
        type="button"
        disabled={running || result !== null}
        onClick={handleRun}
        className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-mono font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer"
      >
        {running ? 'Simulating physics…' : 'Run it'}
      </button>

      {result && (
        <FeedbackBlock
          ok={result.ok}
          title={
            result.ok
              ? gate.yes || 'Good call — physics moved that exact direction.'
              : 'Look at the 3D scene — the physics went the opposite way.'
          }
          body={gate.why}
        />
      )}
    </div>
  );
};

// 5. TAPE (Sequential Speed Tape Builder)
const TapeGate: React.FC<{
  gate: Extract<HoldGateSpec, { kind: 'tape' }>;
  onSceneOverride?: (p: Record<string, any>) => void;
  onDone: (patch?: Record<string, any>) => void;
}> = ({ gate, onSceneOverride, onDone }) => {
  const shuffled = useMemo(() => shuffle(gate.orderedSpeeds), [gate.id]);
  const [placed, setPlaced] = useState<string[]>([]);
  const [hint, setHint] = useState('');
  const [slips, setSlips] = useState(0);

  const pickSpeed = (spd: string) => {
    const expected = gate.orderedSpeeds[placed.length];
    if (spd !== expected) {
      setSlips((s) => s + 1);
      setHint(gate.hints?.[expected] || `Place the slowest remaining speed first.`);
      return;
    }
    const next = [...placed, spd];
    setPlaced(next);
    setHint(gate.notes?.[spd] || '');
    if (gate.sceneKey) onSceneOverride?.({ [gate.sceneKey]: next.length });
    if (next.length === gate.orderedSpeeds.length) {
      onDone(gate.showOnPass);
    }
  };

  return (
    <div>
      <p className="text-xs sm:text-sm font-medium text-ink mb-3">
        <RichText text={gate.ask} />
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Mini Vertical ASI Tape */}
        <div className="sm:w-36 border border-line-strong bg-bg-sunken p-2.5 flex flex-col justify-between min-h-[120px]">
          <div className="font-mono text-[9px] uppercase tracking-widest text-muted mb-1">
            ASI TAPE (LOW → HIGH)
          </div>
          <div className="space-y-1 flex-1 flex flex-col-reverse justify-start">
            {placed.map((spd, i) => (
              <div
                key={spd}
                className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-400/50 font-mono text-xs font-bold text-emerald-300 flex justify-between"
              >
                <span>{spd}</span>
                <span className="text-[10px] text-emerald-400">#{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Speed Buttons */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            {shuffled.map((spd) => {
              const used = placed.includes(spd);
              return (
                <button
                  key={spd}
                  type="button"
                  disabled={used}
                  onClick={() => pickSpeed(spd)}
                  className={`px-3 py-1.5 font-mono text-xs font-bold border transition-colors cursor-pointer ${
                    used
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 opacity-50'
                      : 'border-line bg-bg text-ink hover:border-cad-accent'
                  }`}
                >
                  {spd}
                </button>
              );
            })}
          </div>
          {hint && (
            <p className="text-[11px] font-mono text-amber-300">
              <RichText text={hint} />
            </p>
          )}
        </div>
      </div>

      {placed.length === gate.orderedSpeeds.length && (
        <FeedbackBlock
          ok={slips === 0}
          title={slips === 0 ? 'V-speed tape locked in first time.' : 'Tape in order now.'}
          body={gate.why}
        />
      )}
    </div>
  );
};

// 6. REDPEN (Spot the Wrong Line on a Form)
const RedPenGate: React.FC<{
  gate: Extract<HoldGateSpec, { kind: 'redpen' }>;
  onDone: (patch?: Record<string, any>) => void;
}> = ({ gate, onDone }) => {
  const [caught, setCaught] = useState(false);
  const [missNote, setMissNote] = useState<string>('');

  return (
    <div>
      <p className="text-xs sm:text-sm font-medium text-ink mb-3">
        <RichText text={gate.ask} />
      </p>

      <div className="border border-line bg-bg divide-y divide-line font-mono text-xs">
        {gate.rows.map((r, i) => {
          const isFaulty = !!r.fix;
          return (
            <button
              key={i}
              type="button"
              disabled={caught}
              onClick={() => {
                if (isFaulty) {
                  setCaught(true);
                  setMissNote('');
                  onDone(gate.showOnPass);
                } else {
                  setMissNote(r.note || 'That line complies with regulations. Check another row.');
                }
              }}
              className={`w-full px-3.5 py-2.5 flex items-center justify-between gap-4 text-left transition-colors cursor-pointer ${
                caught && isFaulty
                  ? 'bg-rose-500/15'
                  : 'hover:bg-bg-sunken'
              }`}
            >
              <span className="text-muted">{r.label}</span>
              <span className="flex items-center gap-2 font-bold">
                <span
                  className={
                    caught && isFaulty
                      ? 'line-through text-rose-400'
                      : 'text-ink'
                  }
                >
                  {r.value}
                </span>
                {caught && isFaulty && (
                  <span className="px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-400/50 text-emerald-300">
                    → {r.fix}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {missNote && !caught && (
        <p className="mt-2 text-[11px] font-mono text-amber-300">{missNote}</p>
      )}
      {caught && (
        <FeedbackBlock ok title={gate.yes || 'Caught the illegal dispatch line.'} body={gate.why} />
      )}
    </div>
  );
};

// 7. TILES (Build ATS / ICAO Sequence)
const TilesGate: React.FC<{
  gate: Extract<HoldGateSpec, { kind: 'tiles' }>;
  onDone: (patch?: Record<string, any>) => void;
}> = ({ gate, onDone }) => {
  const pool = useMemo(
    () =>
      shuffle([...gate.answerTiles, ...(gate.extraTiles || [])]).map((t, idx) => ({
        id: `${t}-${idx}`,
        text: t,
      })),
    [gate.id]
  );
  const [selected, setSelected] = useState<Array<{ id: string; text: string }>>([]);
  const [verdict, setVerdict] = useState<{ ok: boolean; msg: string } | null>(null);

  const usedIds = new Set(selected.map((s) => s.id));

  const submit = () => {
    const built = selected.map((s) => s.text).join('');
    const target = gate.answerTiles.join('');
    const ok = built === target;
    setVerdict({
      ok,
      msg: ok ? gate.yes || 'Accepted by ATS.' : `Rejected. Expected format: ${target}`,
    });
    if (ok) onDone(gate.showOnPass);
  };

  return (
    <div>
      <p className="text-xs sm:text-sm font-medium text-ink mb-3">
        <RichText text={gate.ask} />
      </p>

      <div className="min-h-[42px] border border-line-strong bg-bg-sunken px-3 py-2 flex flex-wrap items-center gap-1.5 mb-3">
        {selected.length === 0 ? (
          <span className="text-xs font-mono text-faint">Tap tiles below to assemble…</span>
        ) : (
          selected.map((tile, idx) => (
            <button
              key={tile.id}
              type="button"
              onClick={() =>
                setSelected((prev) => prev.filter((_, i) => i !== idx))
              }
              className="px-2 py-1 bg-cad-accent/20 border border-cad-accent text-ink font-mono text-xs font-bold cursor-pointer"
            >
              {tile.text === ' ' ? '␣' : tile.text}
            </button>
          ))
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {pool.map((tile) => (
          <button
            key={tile.id}
            type="button"
            disabled={usedIds.has(tile.id) || verdict?.ok}
            onClick={() => setSelected((prev) => [...prev, tile])}
            className="px-2.5 py-1 border border-line bg-bg text-xs font-mono font-bold text-ink hover:border-line-strong disabled:opacity-35 cursor-pointer"
          >
            {tile.text === ' ' ? '␣ space' : tile.text}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={selected.length === 0 || verdict?.ok}
        onClick={submit}
        className="px-4 py-1.5 bg-cad-accent text-white text-xs font-mono font-bold uppercase tracking-wider disabled:opacity-40 cursor-pointer"
      >
        File it
      </button>

      {verdict && (
        <FeedbackBlock ok={verdict.ok} title={verdict.msg} body={gate.why} />
      )}
    </div>
  );
};

// 8. NUM (Infinite Procedural EASA Math with Fresh Numbers)
const NumGate: React.FC<{
  gate: Extract<HoldGateSpec, { kind: 'num' }>;
  onSceneOverride?: (p: Record<string, any>) => void;
  onDone: (patch?: Record<string, any>) => void;
}> = ({ gate, onSceneOverride, onDone }) => {
  const buildProblem = () =>
    gate.generator ? MATH_GENERATORS[gate.generator]() : gate.staticProblem!;

  const [problem, setProblem] = useState<MathProblem>(() => buildProblem());
  const [inputVal, setInputVal] = useState('');
  const [checked, setChecked] = useState<{ ok: boolean } | null>(null);

  useEffect(() => {
    if (gate.during) onSceneOverride?.(gate.during);
  }, [gate.id]);

  const check = () => {
    const num = parseFloat(inputVal.replace(/[\s,]/g, ''));
    if (Number.isNaN(num)) return;
    const ok = Math.abs(num - problem.answer) <= problem.tolerance;
    setChecked({ ok });
    onDone(gate.showOnPass);
  };

  const refresh = () => {
    setProblem(buildProblem());
    setInputVal('');
    setChecked(null);
  };

  return (
    <div>
      <p className="text-xs sm:text-sm font-medium text-ink mb-3">
        <RichText text={problem.ask} />
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          inputMode="decimal"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') check();
          }}
          placeholder="Enter number…"
          aria-label="Numeric answer"
          className="w-40 px-3 py-2 border border-line-strong bg-bg font-mono text-sm font-bold text-ink focus:outline-none focus:border-cad-accent"
        />
        <span className="font-mono text-xs text-muted">{problem.unit}</span>
        <button
          type="button"
          onClick={check}
          className="px-4 py-2 bg-cad-accent text-white text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
        >
          Check
        </button>
        {gate.generator && (
          <button
            type="button"
            onClick={refresh}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-line bg-bg text-muted hover:text-ink text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Fresh numbers
          </button>
        )}
      </div>

      {checked && (
        <FeedbackBlock
          ok={checked.ok}
          title={
            checked.ok
              ? `Right: ${problem.answer.toLocaleString()} ${problem.unit}`
              : `Calculated answer: ${problem.answer.toLocaleString()} ${problem.unit} (±${problem.tolerance})`
          }
          body={problem.why}
          steps={problem.steps}
        />
      )}
    </div>
  );
};

// 9. COLS (4-Stage Interactive RTOM Three-Column Builder)
const ColsGate: React.FC<{
  gate: Extract<HoldGateSpec, { kind: 'cols' }>;
  onSceneOverride?: (p: Record<string, any>) => void;
  onDone: (patch?: Record<string, any>) => void;
}> = ({ onSceneOverride, onDone }) => {
  const [prob, setProb] = useState<RtomProblem>(() => genRtomThreeColumn());
  const [stage, setStage] = useState<'fuel' | 'cols' | 'least' | 'payload' | 'done'>('fuel');
  const [fuelUnlocked, setFuelUnlocked] = useState(false);
  const [filledSlots, setFilledSlots] = useState<Record<string, number>>({});
  const [slotCursor, setSlotCursor] = useState(0);
  const [hint, setHint] = useState('Step 1: Derive Take-Off Fuel (Trip + Reserve) first.');
  const [pickedColIdx, setPickedColIdx] = useState<number | null>(null);
  const [mtlInput, setMtlInput] = useState('');
  const [finalOk, setFinalOk] = useState<boolean | null>(null);

  const flatSlots = useMemo(
    () =>
      prob.columns.flatMap((c, ci) =>
        c.slots.map((s) => ({ ci, slot: s, id: `${ci}-${s.key}` }))
      ),
    [prob]
  );

  const allChips = useMemo(
    () => (fuelUnlocked ? [...prob.baseChips, ...prob.deriveChips] : prob.baseChips),
    [prob, fuelUnlocked]
  );

  const resetFresh = () => {
    setProb(genRtomThreeColumn());
    setStage('fuel');
    setFuelUnlocked(false);
    setFilledSlots({});
    setSlotCursor(0);
    setHint('Step 1: Derive Take-Off Fuel (Trip + Reserve) first.');
    setPickedColIdx(null);
    setMtlInput('');
    setFinalOk(null);
    onSceneOverride?.({ cut: 1, cargoRatio: 0.15 });
  };

  const handleDeriveFuel = () => {
    setFuelUnlocked(true);
    setStage('cols');
    setHint(
      `Tap the matching flight-data chip for Column 1: **${flatSlots[0].slot.label}**.`
    );
    onSceneOverride?.({ cut: 1, fuelRatio: 0.9, cargoRatio: 0.25 });
  };

  const handleChipClick = (chipKey: string, val: number) => {
    if (stage !== 'cols') return;
    const expected = flatSlots[slotCursor];
    if (!expected) return;
    if (chipKey !== expected.slot.key) {
      setHint(expected.slot.hint);
      return;
    }
    const nextFilled = { ...filledSlots, [expected.id]: val };
    setFilledSlots(nextFilled);
    const nextIdx = slotCursor + 1;
    setSlotCursor(nextIdx);
    onSceneOverride?.({ cargoRatio: 0.25 + (nextIdx / flatSlots.length) * 0.45 });

    if (nextIdx >= flatSlots.length) {
      setStage('least');
      setHint('Three take-off masses calculated. **Tap the SMALLEST column** — that is your RTOM.');
    } else {
      setHint(
        `Col ${flatSlots[nextIdx].ci + 1}: tap **${flatSlots[nextIdx].slot.label}** above.`
      );
    }
  };

  const handlePickCol = (ci: number) => {
    if (stage !== 'least') return;
    const chosen = prob.columns[ci];
    if (chosen.sum !== prob.rtom) {
      setHint(
        `${chosen.sum.toLocaleString()} kg would exceed one of the other structural limits! Pick the **smallest** total.`
      );
      return;
    }
    setPickedColIdx(ci);
    setStage('payload');
    setHint(`RTOM locked at **${prob.rtom.toLocaleString()} kg**. Now compute Max Traffic Load (RTOM − DOM − TOF).`);
  };

  const handleSubmitMtl = () => {
    const val = parseFloat(mtlInput.replace(/[\s,]/g, ''));
    if (Number.isNaN(val)) return;
    const ok = Math.abs(val - prob.answerMtl) <= 20;
    setFinalOk(ok);
    setStage('done');
    onSceneOverride?.({ cut: 1, cargoRatio: 1, fuelRatio: 0.95 });
    onDone({ cut: 1, cargoRatio: 1 });
  };

  return (
    <div className="space-y-3">
      <p className="text-xs sm:text-sm font-medium text-ink">
        <RichText text={prob.text} />
      </p>

      {/* 4-Stage Stepper */}
      <div className="grid grid-cols-4 gap-1 font-mono text-[10px] uppercase tracking-wider">
        {[
          ['fuel', '1. Fuel'],
          ['cols', '2. Columns'],
          ['least', '3. Least'],
          ['payload', '4. Payload'],
        ].map(([k, lbl]) => {
          const active = stage === k || (stage === 'done' && k === 'payload');
          return (
            <div
              key={k}
              className={`px-2 py-1 text-center border ${
                active
                  ? 'border-cad-accent bg-cad-accent/20 text-ink font-bold'
                  : 'border-line bg-bg text-muted'
              }`}
            >
              {lbl}
            </div>
          );
        })}
      </div>

      {/* Flight Data Chips */}
      <div className="flex flex-wrap gap-1.5">
        {allChips.map((c) => (
          <button
            key={c.key}
            type="button"
            disabled={stage !== 'cols'}
            onClick={() => handleChipClick(c.key, c.value)}
            className="px-2.5 py-1.5 border border-line bg-bg hover:border-cad-accent text-left font-mono text-[11px] disabled:opacity-75 cursor-pointer"
          >
            <span className="text-muted block text-[9px] uppercase">{c.label}</span>
            <span className="font-bold text-ink">
              {c.value.toLocaleString()} {c.unit}
            </span>
          </button>
        ))}
      </div>

      {/* 3 Limit Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {prob.columns.map((col, ci) => {
          const colDone = col.slots.every((s) => filledSlots[`${ci}-${s.key}`] !== undefined);
          const isPicked = pickedColIdx === ci;
          return (
            <button
              key={ci}
              type="button"
              disabled={stage !== 'least'}
              onClick={() => handlePickCol(ci)}
              className={`p-3 border text-left transition-all ${
                isPicked
                  ? 'border-emerald-400 bg-emerald-500/15'
                  : stage === 'least'
                  ? 'border-amber-400/70 bg-bg hover:bg-bg-sunken cursor-pointer'
                  : 'border-line bg-bg'
              }`}
            >
              <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted mb-2">
                {col.head}
              </div>
              <div className="space-y-1.5 mb-2">
                {col.slots.map((s) => {
                  const id = `${ci}-${s.key}`;
                  const v = filledSlots[id];
                  const isNext = stage === 'cols' && flatSlots[slotCursor]?.id === id;
                  return (
                    <div
                      key={id}
                      className={`px-2 py-1 border font-mono text-[11px] flex justify-between ${
                        isNext
                          ? 'border-amber-400 bg-amber-500/10 text-amber-200'
                          : 'border-line bg-bg-sunken text-ink'
                      }`}
                    >
                      <span className="text-muted">{s.label}</span>
                      <span className="font-bold">{v !== undefined ? v.toLocaleString() : '—'}</span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-line pt-1.5 font-mono text-xs font-bold flex justify-between text-ink">
                <span>TOTAL</span>
                <span>{colDone ? `${col.sum.toLocaleString()} ${prob.unit}` : '…'}</span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs font-mono text-amber-300">
        <RichText text={hint} />
      </p>

      {stage === 'fuel' && (
        <button
          type="button"
          onClick={handleDeriveFuel}
          className="px-4 py-2 bg-cad-accent text-white text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
        >
          Work out Take-Off Fuel →
        </button>
      )}

      {stage === 'payload' && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <input
            type="text"
            inputMode="decimal"
            value={mtlInput}
            onChange={(e) => setMtlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmitMtl();
            }}
            placeholder="MTL in kg…"
            aria-label="Maximum Traffic Load"
            className="w-36 px-3 py-1.5 border border-line-strong bg-bg font-mono text-xs font-bold text-ink"
          />
          <button
            type="button"
            onClick={handleSubmitMtl}
            className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
          >
            Check MTL
          </button>
        </div>
      )}

      {finalOk !== null && (
        <div>
          <FeedbackBlock
            ok={finalOk}
            title={
              finalOk
                ? `Dispatch loaded: MTL = ${prob.answerMtl.toLocaleString()} kg`
                : `Correct MTL = ${prob.answerMtl.toLocaleString()} kg`
            }
            body={prob.why}
            steps={prob.steps}
          />
          <button
            type="button"
            onClick={resetFresh}
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 border border-line bg-bg text-xs font-mono font-bold uppercase text-muted hover:text-ink cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Fresh numbers
          </button>
        </div>
      )}
    </div>
  );
};

// CHECKRIDE DECK (75% EASA Pass Gate)
export interface CheckrideCall {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  why: string;
}

export const CheckrideDeck: React.FC<{
  calls: CheckrideCall[];
  passPercent?: number;
  subjectLabel?: string;
}> = ({ calls, passPercent = 75, subjectLabel = 'EASA ATPL' }) => {
  const [deck, setDeck] = useState<CheckrideCall[]>(() => shuffle(calls));
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);

  const finished = idx >= deck.length;
  const current = deck[idx];
  const shuffledOpts = useMemo(
    () => (current ? shuffle(current.options.map((text, origIdx) => ({ text, origIdx }))) : []),
    [current?.id, idx]
  );

  const scorePct = deck.length ? Math.round((results.filter(Boolean).length / deck.length) * 100) : 0;
  const passed = scorePct >= passPercent;

  const restart = () => {
    setDeck(shuffle(calls));
    setIdx(0);
    setPicked(null);
    setResults([]);
  };

  return (
    <section className="dx-card p-5 md:p-7 my-8" id="checkride" aria-label="Chapter checkride">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="hud-label text-emerald-400">CHECKRIDE · {subjectLabel}</span>
          </div>
          <p className="text-xs sm:text-sm text-muted mt-1">
            {deck.length} exam-style calls. You need <strong>{passPercent}%</strong> to pass.
          </p>
        </div>

        {/* Segmented Progress Bar */}
        <div className="flex items-center gap-1">
          {deck.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-6 border ${
                results[i] === true
                  ? 'bg-emerald-500 border-emerald-400'
                  : results[i] === false
                  ? 'bg-rose-500 border-rose-400'
                  : i === idx && !finished
                  ? 'bg-cad-accent border-white'
                  : 'bg-bg border-line'
              }`}
            />
          ))}
        </div>
      </div>

      {!finished && current ? (
        <div>
          <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted mb-2">
            CALL {idx + 1} OF {deck.length}
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-ink leading-relaxed mb-4">
            <RichText text={current.question} />
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {shuffledOpts.map((opt) => {
              const chosen = picked === opt.origIdx;
              const correct = opt.origIdx === current.answerIndex;
              let cls = 'border-line bg-bg text-ink hover:border-line-strong';
              if (picked !== null) {
                if (correct) cls = 'border-emerald-500 bg-emerald-500/15 text-emerald-200';
                else if (chosen) cls = 'border-rose-500 bg-rose-500/15 text-rose-200';
                else cls = 'border-line bg-bg text-muted opacity-55';
              }
              return (
                <button
                  key={opt.origIdx}
                  type="button"
                  disabled={picked !== null}
                  onClick={() => {
                    setPicked(opt.origIdx);
                    setResults((prev) => [...prev, opt.origIdx === current.answerIndex]);
                  }}
                  className={`p-3.5 border text-left text-xs sm:text-sm font-medium transition-colors cursor-pointer ${cls}`}
                >
                  <RichText text={opt.text} />
                </button>
              );
            })}
          </div>

          {picked !== null && (
            <div className="mt-4">
              <FeedbackBlock
                ok={picked === current.answerIndex}
                title={
                  picked === current.answerIndex
                    ? 'Cleared.'
                    : `Expected: ${current.options[current.answerIndex]}`
                }
                body={current.why}
              />
              <button
                type="button"
                onClick={() => {
                  setPicked(null);
                  setIdx((i) => i + 1);
                }}
                className="mt-3 px-4 py-2 bg-cad-accent text-white text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
              >
                {idx + 1 < deck.length ? 'Next call →' : 'See checkride result'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 py-2">
          <div className="flex items-center gap-5">
            <div className="font-mono text-5xl font-black text-ink">
              {scorePct}
              <span className="text-xl text-muted">%</span>
            </div>
            <div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest border ${
                  passed
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                    : 'border-rose-400 bg-rose-500/20 text-rose-300'
                }`}
              >
                {passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                {passed ? 'PASSED · DISPATCH RELEASED' : 'NOT YET'}
              </span>
              <p className="text-xs sm:text-sm text-muted mt-2">
                {results.filter(Boolean).length} of {deck.length} calls correct.
                {passed
                  ? ' Strong command of the chapter.'
                  : ' Review the Don’t Mix Up strip above and fly it again.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center gap-2 px-4 py-2 border border-line-strong bg-bg text-ink hover:bg-bg-sunken text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Fly it again
          </button>
        </div>
      )}
    </section>
  );
};
