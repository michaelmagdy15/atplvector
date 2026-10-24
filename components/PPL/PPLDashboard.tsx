import React from 'react';
import { View, User } from '../../types';
import { PPL_SUBJECTS, PPLSubject } from '../../data/pplSubjects';
import {
  Plane,
  Scale,
  Users,
  Cloud,
  Compass,
  Radio,
  BookOpen,
  Settings,
  TrendingUp,
  ChevronRight,
  Clock,
  Flame,
  Target,
  GraduationCap,
  Calendar,
  Gauge,
  Award,
  ShieldAlert,
  BookMarked
} from 'lucide-react';
import { Accent, CadButton } from '../artcraft/SectionShell';

interface Props {
  user: User;
  studyTime: number;
  onChangeView: (view: View) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Scale,
  Users,
  Cloud,
  Compass,
  Radio,
  BookOpen,
  Settings,
  TrendingUp,
  Plane,
};

/** Maps each PPL subject to its target view */
const SUBJECT_VIEW_MAP: Record<string, View> = {
  'ppl-comms':  View.DASHBOARD,       // Full reuse — existing VFR comms sim
  'ppl-airlaw': View.PPL_AIR_LAW_HOME,
  'ppl-hpl':    View.PPL_HPL_HOME,
  'ppl-met':    View.PPL_MET_HOME,
  'ppl-nav':    View.PPL_NAV_HOME,
  'ppl-pof':    View.PPL_POF_HOME,
  'ppl-ops':    View.PPL_OPS_HOME,
  'ppl-agk':    View.PPL_AGK_HOME,
  'ppl-perf':   View.PPL_PERF_HOME,
};

const getAccentHex = (color: string) => {
  const hexMap: Record<string, string> = {
    red: '#ef4444',
    orange: '#f97316',
    amber: '#f59e0b',
    yellow: '#eab308',
    lime: '#84cc16',
    green: '#22c55e',
    emerald: '#10b981',
    teal: '#14b8a6',
    cyan: '#06b6d4',
    sky: '#38bdf8',
    blue: '#3b82f6',
    indigo: '#6366f1',
    violet: '#8b5cf6',
    purple: '#a855f7',
    pink: '#ec4899',
  };
  return hexMap[color] || '#38bdf8';
};

const PPLDashboard: React.FC<Props> = ({ user, studyTime, onChangeView }) => {
  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayStudy = user?.dailyStudyData?.[todayDateStr] || 0;
  const dailyGoal = user?.dailyGoalSeconds || 3600;
  const goalPct = Math.min(100, Math.round((todayStudy / dailyGoal) * 100));
  const streak = user?.streakDays || 0;

  const [groundSchoolProgress, setGroundSchoolProgress] = React.useState({ watchedCount: 0, notesCount: 0 });

  React.useEffect(() => {
    try {
      const watched = JSON.parse(localStorage.getItem('ppl_watched_lessons') || '[]');
      const notes = JSON.parse(localStorage.getItem('ppl_lessons_notes') || '{}');
      setGroundSchoolProgress({
        watchedCount: Array.isArray(watched) ? watched.length : 0,
        notesCount: typeof notes === 'object' && notes !== null ? Object.keys(notes).length : 0,
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  const SubjectCard = ({ subject }: { subject: PPLSubject }) => {
    const Icon = (ICON_MAP[subject.icon] || Plane) as React.ElementType;
    const accentHex = getAccentHex(subject.color);
    const targetView = SUBJECT_VIEW_MAP[subject.id];
    const isReady = subject.isContentReady;

    return (
      <div
        role={isReady ? 'button' : undefined}
        tabIndex={isReady ? 0 : -1}
        aria-label={isReady ? `Open ${subject.name}` : undefined}
        onClick={() => isReady && targetView && onChangeView(targetView)}
        onKeyDown={(event) => {
          if (isReady && targetView && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            onChangeView(targetView);
          }
        }}
        className={`group relative bg-bg p-6 md:p-8 flex flex-col justify-between transition-colors ${
          !isReady
            ? 'opacity-70 cursor-not-allowed'
            : 'hover:bg-bg-raised cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-cad-accent'
        }`}
      >
        {!isReady && (
          <div className="absolute inset-0 z-30 bg-bg/85 backdrop-blur-xs flex flex-col items-center justify-center">
            <div className="p-3 bg-bg-raised border border-line mb-3">
              <Calendar className="w-5 h-5 text-amber-400" />
            </div>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1 border border-line bg-bg text-ink">
              Coming Soon
            </span>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-line bg-bg-sunken">
              <span
                className="h-1.5 w-1.5 inline-block"
                style={{ backgroundColor: accentHex }}
              />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink">
                SUBJ {subject.code}
              </span>
            </div>
            <div
              className="h-9 w-9 border border-line flex items-center justify-center transition-colors group-hover:border-line-strong"
              style={{ color: accentHex }}
            >
              <Icon size={18} />
            </div>
          </div>

          <h2 className="font-display text-xl md:text-2xl font-medium tracking-[-0.025em] text-ink mb-2.5 group-hover:text-cad-accent transition-colors">
            {subject.name}
          </h2>
          <p className="text-muted text-sm leading-relaxed mb-6">{subject.description}</p>
        </div>

        <div>
          <div className="flex items-center justify-between pt-4 border-t border-line font-mono text-[11px] uppercase tracking-[0.12em] text-muted group-hover:text-ink transition-colors">
            <span>Open PPL Module</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-cad-accent" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-[1280px] border-x border-line px-4 md:px-10 py-8 md:py-12">
      {/* Primary CAD PPL Flight Plan Hero Banner */}
      <section className="relative border border-line bg-bg-raised p-6 md:p-10 mb-10">
        <span className="tick tick-half absolute -top-[5px] -left-[6px] z-20 pointer-events-none" />
        <span className="tick tick-half absolute -top-[5px] -right-[5px] z-20 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <div className="mb-4 inline-flex items-center gap-2 border border-line bg-bg px-2.5 py-1">
              <Plane size={12} className="text-cad-accent" />
              <span className="hud-label text-ink">FLIGHT TRAINING // PRIVATE PILOT LICENCE</span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-medium tracking-[-0.035em] leading-[1.02] text-ink">
              Student pilot theory{' '}
              <Accent className="text-cad-accent">starts here</Accent>.
            </h1>
            <p className="mt-4 max-w-xl text-sm md:text-base leading-relaxed text-muted">
              Master the official Private Pilot Licence syllabus across single-engine piston systems, VFR navigation, airspace law, meteorology, and aerodynamics.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <CadButton
                variant="accent"
                onClick={() => onChangeView(View.PPL_AIR_LAW_HOME)}
              >
                <span>Start Studying (PPL-010 Air Law)</span>
                <ChevronRight size={15} />
              </CadButton>
              <CadButton
                variant="ghost"
                onClick={() => onChangeView(View.PPL_GROUND_SCHOOL)}
              >
                <span>Enter Video Ground School</span>
              </CadButton>
            </div>
          </div>

          {/* 4-Cell Gapless Telemetry Readout */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-px bg-line border border-line">
            <div className="bg-bg p-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="hud-label text-emerald-400">DAILY GOAL</span>
                <Target size={14} className="text-emerald-400" />
              </div>
              <div className="font-display text-2xl font-medium text-ink">
                {goalPct}%
              </div>
              <div className="h-1 w-full bg-line mt-2 mb-1 overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-700"
                  style={{ width: `${goalPct}%` }}
                />
              </div>
              <div className="font-mono text-[10px] text-muted">
                {formatTime(todayStudy)} / {formatTime(dailyGoal)}
              </div>
            </div>

            <div className="bg-bg p-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="hud-label text-cad-accent">STREAK</span>
                <Flame size={14} className="text-cad-accent" />
              </div>
              <div className="font-display text-2xl font-medium text-ink">
                {streak} <span className="font-mono text-xs text-muted">DAYS</span>
              </div>
              <div className="font-mono text-[10px] text-muted mt-3">
                CONTINUOUS DISPATCH
              </div>
            </div>

            <div className="bg-bg p-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="hud-label text-sky-400">FLIGHT TIME</span>
                <Clock size={14} className="text-sky-400" />
              </div>
              <div className="font-display text-2xl font-medium text-ink">
                {formatTime(studyTime)}
              </div>
              <div className="font-mono text-[10px] text-muted mt-3">
                LOGGED GROUND TIME
              </div>
            </div>

            <div className="bg-bg p-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="hud-label text-indigo-400">LECTURES</span>
                <GraduationCap size={14} className="text-indigo-400" />
              </div>
              <div className="font-display text-2xl font-medium text-ink">
                {groundSchoolProgress.watchedCount} <span className="font-mono text-xs text-muted">/ 64</span>
              </div>
              <div className="font-mono text-[10px] text-muted mt-3">
                VIDEO LESSONS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 01 // PPL Curriculum Subjects */}
      <div className="flex items-end justify-between gap-4 mb-5 pb-3 border-b border-line">
        <div>
          <div className="hud-label text-cad-accent mb-1">01 // EASA &amp; FAA PPL CURRICULUM</div>
          <h2 className="font-display text-2xl md:text-3xl font-medium tracking-[-0.03em] text-ink">
            Private Pilot <Accent className="text-cad-accent">Theory Modules</Accent>
          </h2>
        </div>
        <div className="font-mono text-xs text-muted">
          9 OF 9 SUBJECTS UNLOCKED
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-line border border-line">
        {PPL_SUBJECTS.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>

      {/* 02 // Specialized PPL Flight Deck & Video Labs */}
      <div className="mt-12 flex items-end justify-between gap-4 mb-5 pb-3 border-b border-line">
        <div>
          <div className="hud-label text-sky-400 mb-1">02 // PPL FLIGHT LABS &amp; VIDEO SUITES</div>
          <h2 className="font-display text-2xl md:text-3xl font-medium tracking-[-0.03em] text-ink">
            Interactive Training &amp; <Accent className="text-cad-accent">Flight Deck</Accent> Hubs
          </h2>
        </div>
        <button
          type="button"
          onClick={() => onChangeView(View.FAA_PPL_STUDY_GUIDE)}
          className="invert-block px-3 py-1.5 border border-line font-mono text-[11px] uppercase tracking-[0.12em] text-sky-400 inline-flex items-center gap-1.5 cursor-pointer"
        >
          <BookOpen size={13} />
          <span>PPL Study Handbook</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-line border border-line">
        {/* PPL Video Ground School */}
        <div
          onClick={() => onChangeView(View.PPL_GROUND_SCHOOL)}
          className="bg-bg p-6 md:p-8 flex flex-col justify-between hover:bg-bg-raised transition-colors cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="hud-label text-blue-400">GROUND SCHOOL // 64 LECTURES</span>
              <GraduationCap size={18} className="text-blue-400" />
            </div>
            <h3 className="font-display text-2xl font-medium text-ink mb-2 group-hover:text-blue-400 transition-colors">
              PPL Video Ground School
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Comprehensive visual ground school with 64 focused lessons, note-taking notepad, and exam question drills for single-engine pilots.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 mt-6 border-t border-line font-mono text-[11px] uppercase tracking-[0.12em] text-blue-400">
            <span>Launch Video Lab ({groundSchoolProgress.watchedCount}/64)</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Cessna 172 Flight Deck Hub */}
        <div
          onClick={() => onChangeView(View.C172_HUB)}
          className="bg-bg p-6 md:p-8 flex flex-col justify-between hover:bg-bg-raised transition-colors cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="hud-label text-emerald-400">AIRCRAFT // CESSNA 172SP</span>
              <Gauge size={18} className="text-emerald-400" />
            </div>
            <h3 className="font-display text-2xl font-medium text-ink mb-2 group-hover:text-emerald-400 transition-colors">
              Cessna 172 Cockpit Hub
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Dynamic Airspeed Indicator with arc zones, V-Speed explorer, Lycoming IO-360 powerplant monitoring, fuel &amp; weight envelope, and emergency checklists.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 mt-6 border-t border-line font-mono text-[11px] uppercase tracking-[0.12em] text-emerald-400">
            <span>Enter C172 Cockpit Hub</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* FAA & EASA PPL Knowledge Guide */}
        <div
          onClick={() => onChangeView(View.FAA_PPL_STUDY_GUIDE)}
          className="bg-bg p-6 md:p-8 flex flex-col justify-between hover:bg-bg-raised transition-colors cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="hud-label text-sky-400">KNOWLEDGE BANK // PPL EXAM</span>
              <Award size={18} className="text-sky-400" />
            </div>
            <h3 className="font-display text-2xl font-medium text-ink mb-2 group-hover:text-sky-400 transition-colors">
              PPL Study Handbook
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Interactive handbook covering VFR flight rules, cross-country flight planning, weight &amp; balance computations, density altitude, and engine management.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 mt-6 border-t border-line font-mono text-[11px] uppercase tracking-[0.12em] text-sky-400">
            <span>Open PPL Handbook</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* 03 // Exam Defense & Pilot Cheatsheet */}
      <div className="mt-12 flex items-end justify-between gap-4 mb-5 pb-3 border-b border-line">
        <div>
          <div className="hud-label text-amber-400 mb-1">03 // EXAM DEFENSE &amp; REFERENCE ENGINES</div>
          <h2 className="font-display text-2xl md:text-3xl font-medium tracking-[-0.03em] text-ink">
            RTFQ Defense &amp; <Accent className="text-amber-400">Operational Cheatsheet</Accent>
          </h2>
        </div>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('openCheatsheet'))}
          className="invert-block px-3 py-1.5 border border-amber-500/40 font-mono text-[11px] uppercase tracking-[0.12em] text-amber-400 inline-flex items-center gap-1.5 cursor-pointer hover:bg-amber-500/10 transition-colors"
        >
          <BookMarked size={13} />
          <span>Open Cheatsheet Drawer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-line border border-line">
        {/* RTFQ Exam Trap Defense Trainer */}
        <div
          onClick={() => onChangeView(View.RTFQ_TRAINER)}
          className="bg-bg p-6 md:p-8 flex flex-col justify-between hover:bg-bg-raised transition-colors cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="hud-label text-amber-400">EXAM DEFENSE // METHODOLOGY</span>
              <ShieldAlert size={18} className="text-amber-400" />
            </div>
            <h3 className="font-display text-2xl font-medium text-ink mb-2 group-hover:text-amber-400 transition-colors">
              RTFQ Exam Trap &amp; Defense Trainer
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Drill against classic examiner traps: unit divergence (USG vs Imp Gal), negative polarity stems (NOT/EXCEPT), intermediate calculation distractors, and false opposites.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 mt-6 border-t border-line font-mono text-[11px] uppercase tracking-[0.12em] text-amber-400">
            <span>Launch RTFQ Defense Drills</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Operational Cheatsheet */}
        <div
          onClick={() => window.dispatchEvent(new CustomEvent('openCheatsheet'))}
          className="bg-bg p-6 md:p-8 flex flex-col justify-between hover:bg-bg-raised transition-colors cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="hud-label text-amber-400">QUICK REFERENCE // PILOT FORMULAS</span>
              <BookMarked size={18} className="text-amber-400" />
            </div>
            <h3 className="font-display text-2xl font-medium text-ink mb-2 group-hover:text-amber-400 transition-colors">
              Operational Pilot Cheatsheet &amp; Rules of Thumb
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Instant access to standard V-speeds, climb gradients, altimeter temperature correction rules, 1-in-60 formulas, and emergency squawk codes.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 mt-6 border-t border-line font-mono text-[11px] uppercase tracking-[0.12em] text-amber-400">
            <span>Open Quick Cheatsheet</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PPLDashboard;
