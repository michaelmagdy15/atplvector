import React, { useEffect, useState } from 'react';
import { Bookmark, Check, Lightbulb, Ruler, Sparkles, Star } from 'lucide-react';
import RichText from './RichText';
import {
  PROGRESS_EVENT,
  readLessonMeta,
  toggleLessonBookmark,
  toggleLessonDone,
} from '../../lib/lessonProgress';

export interface LessonHeaderDeckProps {
  id: string;
  index?: string;
  questionTitle: string;
  examRule: string;
  memoryHook: string;
  askedInEasa?: boolean;
  analogy?: string;
  scaleNote?: string;
  tier?: 'exam' | 'airline';
  subjectColor?: string;
}

export const LessonHeaderDeck: React.FC<LessonHeaderDeckProps> = ({
  id,
  index,
  questionTitle,
  examRule,
  memoryHook,
  askedInEasa = false,
  analogy,
  scaleNote,
  tier = 'exam',
  subjectColor = 'var(--accent)',
}) => {
  const [isDone, setIsDone] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const sync = () => {
      const meta = readLessonMeta();
      setIsDone(meta.doneIds.includes(id));
      setIsBookmarked(meta.bookmarkIds.includes(id));
    };
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, [id]);

  const toggleDone = () => {
    setIsDone(toggleLessonDone(id));
  };

  const toggleBookmark = () => {
    setIsBookmarked(toggleLessonBookmark(id));
  };

  return (
    <header className="mb-6 space-y-3.5" id={id}>
      {/* Top Meta Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {index && (
            <span
              className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-line bg-bg-sunken"
              style={{ color: subjectColor }}
            >
              {index}
            </span>
          )}
          {askedInEasa && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border border-amber-400/50 bg-amber-500/15 text-amber-300">
              <Star className="w-3 h-3 fill-current" /> Asked in EASA Exams
            </span>
          )}
          {tier === 'airline' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border border-cyan-400/50 bg-cyan-500/15 text-cyan-300">
              <Sparkles className="w-3 h-3" /> Airline Prep
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleDone}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
              isDone
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                : 'border-line bg-bg text-muted hover:text-ink hover:border-line-strong'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            {isDone ? 'Done' : 'Mark done'}
          </button>
          <button
            type="button"
            onClick={toggleBookmark}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark lesson'}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
              isBookmarked
                ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                : 'border-line bg-bg text-muted hover:text-ink hover:border-line-strong'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            {isBookmarked ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {/* Question-Driven Heading */}
      <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-ink leading-tight">
        {questionTitle}
      </h2>

      {/* Dual Takeaway Row: Left Exam Rule + Right Warm Amber Memory Hook */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-2xl border-[1.5px] border-line-strong bg-bg-raised p-4">
          <div className="hud-label text-ink mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: subjectColor }} />
            EXAM RULE
          </div>
          <p className="text-xs sm:text-sm font-medium text-ink leading-relaxed">
            <RichText text={examRule} />
          </p>
        </div>

        <div className="rounded-2xl border-[1.5px] border-amber-500/50 bg-amber-500/10 p-4">
          <div className="hud-label text-amber-400 mb-1 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" />
            MEMORY HOOK
          </div>
          <p className="text-xs sm:text-sm font-semibold text-amber-100 leading-relaxed">
            <RichText text={memoryHook} />
          </p>
        </div>
      </div>

      {/* Think of it Analogy & Scale Note */}
      {analogy && (
        <div className="rounded-xl border-l-2 border-cyan-400/70 bg-bg-sunken px-3.5 py-2.5 text-xs text-muted leading-relaxed">
          <span className="font-mono font-bold uppercase tracking-wider text-cyan-400 mr-2">
            Think of it
          </span>
          <RichText text={analogy} />
        </div>
      )}

      {scaleNote && (
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-faint">
          <Ruler className="w-3.5 h-3.5 shrink-0" />
          <span>{scaleNote}</span>
        </div>
      )}
    </header>
  );
};

export default LessonHeaderDeck;
