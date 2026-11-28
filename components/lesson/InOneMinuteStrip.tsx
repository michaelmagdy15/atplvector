import React from 'react';
import RichText from './RichText';

export interface OneMinuteItem {
  num: string;
  headline: string;
  body: string;
  accent?: string;
}

interface InOneMinuteStripProps {
  title?: string;
  items: OneMinuteItem[];
  subjectColor?: string;
}

export const InOneMinuteStrip: React.FC<InOneMinuteStripProps> = ({
  title = 'THE CHAPTER IN ONE MINUTE',
  items,
  subjectColor = 'var(--accent)',
}) => {
  if (!items || items.length === 0) return null;

  const colsClass =
    items.length <= 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5';

  return (
    <section className="dx-card p-5 md:p-6 mb-8" aria-label={title}>
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-line">
        <div className="flex items-center gap-2.5">
          <span
            className="w-2.5 h-2.5 inline-block shrink-0"
            style={{ backgroundColor: subjectColor }}
          />
          <span className="hud-label text-ink">{title}</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
          60-SEC BRIEFING · {items.length} CORE POINTS
        </span>
      </div>

      <div className={`grid ${colsClass} gap-3`}>
        {items.map((item) => {
          const cardAccent = item.accent || subjectColor;
          return (
            <div
              key={item.num}
              className="border border-line bg-bg p-4 flex flex-col justify-between transition-colors hover:border-line-strong"
              style={{ borderTopWidth: '3px', borderTopColor: cardAccent }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="font-mono text-xs font-bold tracking-wider"
                    style={{ color: cardAccent }}
                  >
                    {item.num}
                  </span>
                </div>
                <h3 className="font-display text-base font-bold text-ink leading-snug mb-1.5">
                  {item.headline}
                </h3>
                <p className="text-xs leading-relaxed text-muted">
                  <RichText text={item.body} />
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default InOneMinuteStrip;
