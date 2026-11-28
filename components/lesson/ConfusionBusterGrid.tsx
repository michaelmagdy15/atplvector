import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import RichText from './RichText';

export interface ConfusionPair {
  leftTitle: string;
  leftBody: string;
  leftColor?: string;
  rightTitle: string;
  rightBody: string;
  rightColor?: string;
  tellApart: string;
}

interface ConfusionBusterGridProps {
  title?: string;
  subtitle?: string;
  pairs: ConfusionPair[];
}

export const ConfusionBusterGrid: React.FC<ConfusionBusterGridProps> = ({
  title = "DON'T MIX UP",
  subtitle = 'Pairs that catch EASA candidates out — compare them side by side.',
  pairs,
}) => {
  if (!pairs || pairs.length === 0) return null;

  return (
    <section className="dx-card p-5 md:p-7 my-8" aria-label={title}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-rose-400" />
            <span className="hud-label text-rose-400">{title}</span>
          </div>
          <p className="text-xs sm:text-sm text-muted mt-1">{subtitle}</p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 border border-line bg-bg text-muted">
          {pairs.length} EXAM TRAPS
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {pairs.map((pair, idx) => {
          const leftC = pair.leftColor || '#38bdf8';
          const rightC = pair.rightColor || '#f59e0b';
          return (
            <div key={idx} className="border-[1.5px] border-line bg-bg flex flex-col">
              {/* Side-by-side VS comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-line relative">
                <div className="p-4" style={{ borderTop: `3px solid ${leftC}` }}>
                  <div className="font-mono text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: leftC }}>
                    {pair.leftTitle}
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    <RichText text={pair.leftBody} />
                  </p>
                </div>

                <div className="p-4" style={{ borderTop: `3px solid ${rightC}` }}>
                  <div className="font-mono text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: rightC }}>
                    {pair.rightTitle}
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    <RichText text={pair.rightBody} />
                  </p>
                </div>
              </div>

              {/* Thick-bordered Tell Apart rule strip */}
              <div className="border-t-2 border-ink/40 bg-bg-sunken px-4 py-3 text-xs text-ink leading-relaxed">
                <span className="font-mono font-extrabold uppercase tracking-wider text-amber-400 mr-2">
                  Tell apart:
                </span>
                <RichText text={pair.tellApart} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ConfusionBusterGrid;
