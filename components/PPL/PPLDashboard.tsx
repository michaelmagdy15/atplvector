import React from 'react';
import { View, User } from '../../types';
import { PPL_SUBJECTS, PPLSubject } from '../../data/pplSubjects';
import {
  Plane, Scale, Users, Cloud, Compass, Radio, BookOpen,
  Settings, TrendingUp, ChevronRight, Lock, Clock, Flame, Target
} from 'lucide-react';

interface Props {
  user: User;
  studyTime: number;
  onChangeView: (view: View) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Scale, Users, Cloud, Compass, Radio, BookOpen, Settings, TrendingUp, Plane,
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

const COLOR_GRADIENTS: Record<string, string> = {
  red:    'from-red-500 to-rose-600',
  emerald:'from-emerald-500 to-teal-600',
  teal:   'from-teal-400 to-cyan-500',
  cyan:   'from-cyan-400 to-sky-500',
  violet: 'from-violet-500 to-purple-600',
  sky:    'from-sky-400 to-blue-500',
  indigo: 'from-indigo-500 to-violet-600',
  orange: 'from-orange-500 to-amber-600',
  lime:   'from-lime-400 to-green-500',
};

const PPLDashboard: React.FC<Props> = ({ user, studyTime, onChangeView }) => {
  const formatTime = (s: number) => `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;

  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayStudy   = user?.dailyStudyData?.[todayDateStr] || 0;
  const dailyGoal    = user?.dailyGoalSeconds || 3600;
  const goalPct      = Math.min(100, Math.round((todayStudy / dailyGoal) * 100));
  const streak       = user?.streakDays || 0;

  const SubjectCard = ({ subject }: { subject: PPLSubject }) => {
    const Icon      = (ICON_MAP[subject.icon] || Plane) as React.FC<any>;
    const gradient  = COLOR_GRADIENTS[subject.color] || COLOR_GRADIENTS.sky;
    const targetView = SUBJECT_VIEW_MAP[subject.id];
    const isReady   = subject.isContentReady;

    return (
      <div
        onClick={() => isReady && targetView && onChangeView(targetView)}
        className={`group relative glass-card rounded-2xl p-1 overflow-hidden transition-all duration-300 ${
          isReady ? 'hover:scale-[1.01] cursor-pointer' : 'opacity-70 cursor-not-allowed'
        }`}
      >
        {!isReady && (
          <div className="absolute inset-0 z-30 bg-slate-950/80 flex flex-col items-center justify-center rounded-2xl">
            <div className="p-3 bg-slate-900 border border-white/10 shadow-lg mb-3 rounded-xl">
              <Lock className="w-5 h-5 text-slate-400" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 bg-black/60 px-4 py-1.5 rounded-full border border-amber-500/30">
              Coming Soon
            </span>
          </div>
        )}

        <div className="bg-slate-900/40 rounded-xl h-full p-6 relative overflow-hidden flex flex-col">
          <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${gradient} rounded-full blur-[40px] opacity-15 group-hover:opacity-30 transition-opacity duration-500`} />

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border bg-white/5 border-white/10 text-slate-300">
                {subject.code}
              </span>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} shadow-md opacity-80 group-hover:opacity-100 transition-opacity`}>
                <Icon size={20} className="text-white" />
              </div>
            </div>

            <h2 className="text-lg font-bold text-white mb-2">{subject.name}</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-grow">{subject.description}</p>

            <div className="flex items-center text-sm font-bold text-white/70 group-hover:text-white transition-colors pt-3 border-t border-white/5 mt-auto">
              {subject.reuse === 'full' ? (
                <span className="text-emerald-400 text-xs font-bold">✓ Available Now</span>
              ) : (
                <span className="text-amber-400 text-xs font-bold">⏳ In Development</span>
              )}
              <ChevronRight className="ml-auto w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">

      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-12 gap-8 pt-4">
        <div className="animate-in fade-in slide-in-from-left duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Plane size={12} />
            PPL Training Track
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tighter uppercase leading-tight py-2">
            Student{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 pr-2">
              Pilot
            </span>
          </h1>
          <p className="text-slate-400 text-sm md:text-lg font-medium">
            Private Pilot Licence — Ground Theory Programme
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-right duration-1000">
          <div className="glass-panel px-6 py-4 rounded-2xl flex items-center gap-4 border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 relative z-10">
              <Target size={28} />
            </div>
            <div className="relative z-10">
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 flex justify-between">
                <span>Daily Goal</span>
                <span className="text-emerald-400 ml-4">{goalPct}%</span>
              </div>
              <div className="h-1.5 w-32 bg-slate-800 rounded-full overflow-hidden mb-1">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-1000" style={{ width: `${goalPct}%` }} />
              </div>
              <div className="text-xs font-mono font-bold text-slate-300">
                {formatTime(todayStudy)} / {formatTime(dailyGoal)}
              </div>
            </div>
          </div>

          <div className="glass-panel px-6 py-4 rounded-2xl flex items-center gap-4 border border-white/10 shadow-2xl">
            <div className={`p-3 rounded-xl ${streak > 0 ? 'bg-orange-500/10 text-orange-400' : 'bg-slate-800 text-slate-500'}`}>
              <Flame size={28} className={streak > 0 ? 'animate-pulse' : ''} />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Study Streak</div>
              <div className="text-2xl font-bold text-white leading-none flex items-baseline gap-1">
                {streak} <span className="text-sm text-slate-400">Days</span>
              </div>
            </div>
          </div>

          <div className="glass-panel px-6 py-4 rounded-2xl flex items-center gap-4 border border-white/10 shadow-2xl">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
              <Clock size={28} />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Total Flight Time</div>
              <div className="text-2xl font-mono font-bold text-white leading-none">{formatTime(studyTime)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Banner */}
      <div className="mb-8 p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex items-center gap-4">
        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 shrink-0">
          <Plane size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-white">PPL Content In Development</p>
          <p className="text-xs text-slate-400">
            VFR Communications is available now. All other subjects are being mapped to the official PPL syllabus and will unlock progressively.
          </p>
        </div>
        <div className="ml-auto shrink-0 text-right">
          <span className="text-xs font-black text-emerald-400">1 / {PPL_SUBJECTS.length}</span>
          <p className="text-[10px] text-slate-500">subjects ready</p>
        </div>
      </div>

      {/* Subject Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-700 delay-300">
        {PPL_SUBJECTS.map(subject => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  );
};

export default PPLDashboard;
