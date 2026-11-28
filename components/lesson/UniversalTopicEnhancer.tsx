import React, { useEffect, useState } from 'react';
import {
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { getSubjectConfig } from '../../data/sidebarNavigation';
import { getSubjectRecallSpec } from '../../data/subjectRecallLibrary';
import {
  PROGRESS_EVENT,
  readLessonMeta,
  toggleLessonBookmark,
  toggleLessonDone,
} from '../../lib/lessonProgress';
import { View } from '../../types';
import {
  ACARSDebriefSlip,
  ChapterKneeboardDrawer,
  ConfusionBusterGrid,
  StudyDepthToggle,
} from './index';
import { HoldShortGate } from '../engines/HoldShortGate';

interface UniversalTopicEnhancerProps {
  currentView: View;
  onNavigate: (view: View) => void;
  children: React.ReactNode;
}

/** Views that already render full custom ScrollySceneLesson / custom v2 layouts directly */
const SELF_CONTAINED_V2_VIEWS = new Set<View>([
  View.PERF_TAKEOFF,
  View.CONCEPT_FORCES_OF_FLIGHT,
  View.AIR_LAW_INT_LAW,
  View.FOUNDATION_ATM_PERF_CHAIN,
]);

export const UniversalTopicEnhancer: React.FC<UniversalTopicEnhancerProps> = ({
  currentView,
  onNavigate,
  children,
}) => {
  const subjectConfig = getSubjectConfig(currentView);
  const isSubjectDashboard = Boolean(
    subjectConfig && currentView === subjectConfig.dashboardView
  );

  const shouldEnhance = Boolean(
    subjectConfig &&
      !isSubjectDashboard &&
      !SELF_CONTAINED_V2_VIEWS.has(currentView)
  );

  const [isDone, setIsDone] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [recallExpanded, setRecallExpanded] = useState(false);

  const topicId = `topic-${currentView}`;

  useEffect(() => {
    setRecallExpanded(false);
    const sync = () => {
      const meta = readLessonMeta();
      setIsDone(meta.doneIds.includes(topicId));
      setIsBookmarked(meta.bookmarkIds.includes(topicId));
    };
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    return () => window.removeEventListener(PROGRESS_EVENT, sync);
  }, [topicId]);

  if (!shouldEnhance || !subjectConfig) {
    return <>{children}</>;
  }

  const spec = getSubjectRecallSpec(subjectConfig.id);
  const items = subjectConfig.items.filter(
    (it) => it.view !== subjectConfig.dashboardView
  );
  const currentIdx = items.findIndex((it) => it.view === currentView);
  const currentItem = currentIdx >= 0 ? items[currentIdx] : null;
  const prevItem = currentIdx > 0 ? items[currentIdx - 1] : null;
  const nextItem =
    currentIdx >= 0 && currentIdx < items.length - 1 ? items[currentIdx + 1] : null;

  return (
    <div className="space-y-6">
      {/* Top Tactile Module Command Bar */}
      <div
        className="dx-card px-4 py-3 flex flex-wrap items-center justify-between gap-3"
        style={{ borderTopWidth: '3px', borderTopColor: spec.accentColor }}
      >
        <div className="flex flex-wrap items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => onNavigate(subjectConfig.dashboardView)}
            className="font-mono text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 border border-line bg-bg hover:border-line-strong text-ink cursor-pointer"
            style={{ color: spec.accentColor }}
          >
            SUBJ {subjectConfig.id} · {subjectConfig.title}
          </button>

          {spec.examQuestions > 0 && (
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-line bg-bg-sunken text-muted hidden sm:inline">
              {spec.examQuestions} EASA Qs · {spec.examMinutes} min · {spec.passPercent}% Pass
            </span>
          )}

          {currentItem && (
            <span className="text-xs font-semibold text-ink truncate">
              {currentItem.label}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <StudyDepthToggle className="hidden xl:inline-flex" />

          <ChapterKneeboardDrawer
            chapterCode={subjectConfig.id}
            chapterTitle={spec.kneeboard.title}
            formulas={spec.kneeboard.formulas}
            keyNumbers={spec.kneeboard.keyNumbers}
            memoryHooks={spec.kneeboard.memoryHooks}
            buttonLabel="Kneeboard"
          />

          <button
            type="button"
            onClick={() => setIsDone(toggleLessonDone(topicId))}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-mono font-bold uppercase border cursor-pointer ${
              isDone
                ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                : 'border-line bg-bg text-muted hover:text-ink hover:border-line-strong'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isDone ? 'Done' : 'Mark done'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsBookmarked(toggleLessonBookmark(topicId))}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark topic'}
            className={`p-1.5 border cursor-pointer ${
              isBookmarked
                ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                : 'border-line bg-bg text-muted hover:text-ink'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Existing Module Content */}
      <div className="dx-card p-1 sm:p-2">{children}</div>

      {/* Bottom Active Recall, Confusion Busters & Leg Navigation Suite */}
      <div className="space-y-4">
        <div className="dx-card p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="hud-label text-amber-400">
                HIGH-RETENTION EXAM PACK · SUBJ {subjectConfig.id}
              </div>
              <p className="text-xs text-muted">
                Test yourself with this subject&apos;s **Don&apos;t Mix Up** traps, **Hold Short** active check, and **ACARS Debrief**.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setRecallExpanded((e) => !e)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-amber-400/60 bg-amber-500/15 text-amber-200 hover:bg-amber-500/25 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            {recallExpanded ? 'Hide Recall Suite' : 'Open Exam Traps & Quick Drill'}
          </button>
        </div>

        {recallExpanded && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <ConfusionBusterGrid
              title={`DON'T MIX UP · ${subjectConfig.title.toUpperCase()}`}
              pairs={spec.confusionPairs}
            />
            <HoldShortGate
              gate={spec.quickGate}
              onCleared={() => {
                if (!isDone) {
                  setIsDone(toggleLessonDone(topicId));
                }
              }}
            />
            <ACARSDebriefSlip
              chapterLabel={`${subjectConfig.id} // ${currentItem?.label || subjectConfig.title}`}
              headline={spec.acarsDebrief.headline}
              rows={spec.acarsDebrief.rows}
            />
          </div>
        )}

        {/* Flight Leg Footer (Prev / Next Topic) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {prevItem ? (
            <button
              type="button"
              onClick={() => onNavigate(prevItem.view)}
              className="dx-card p-4 text-left hover:border-line-strong flex items-center gap-3 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-muted shrink-0" />
              <div className="min-w-0">
                <div className="hud-label text-muted">PREVIOUS LEG</div>
                <div className="text-sm font-bold text-ink truncate">{prevItem.label}</div>
              </div>
            </button>
          ) : (
            <div />
          )}

          {nextItem && (
            <button
              type="button"
              onClick={() => onNavigate(nextItem.view)}
              className="dx-card p-4 text-right hover:border-cad-accent flex items-center justify-end gap-3 cursor-pointer"
            >
              <div className="min-w-0">
                <div className="hud-label text-cad-accent">NEXT LEG</div>
                <div className="text-sm font-bold text-ink truncate">{nextItem.label}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-cad-accent shrink-0" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversalTopicEnhancer;
