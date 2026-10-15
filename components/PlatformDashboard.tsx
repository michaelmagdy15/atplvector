import React from 'react';
import { View, User } from '../types';
import {
  Plane,
  Scale,
  Clock,
  Trophy,
  ChevronRight,
  Settings,
  Activity,
  Weight,
  TrendingUp,
  Map,
  Users,
  Cloud,
  Radio,
  Navigation,
  Compass,
  BookOpen,
  Lock,
  Calendar,
  Flame,
  Target,
  Shield,
  Gauge,
  Award,
} from 'lucide-react';
import { Accent, CadButton } from './artcraft/SectionShell';

interface Props {
  onChangeView: (view: View) => void;
  studyTime: number;
  user: User;
}

const PlatformDashboard: React.FC<Props> = ({ onChangeView, studyTime, user }) => {
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const isLocked = (subjectId: string) => {
    const allowed = user.allowedSubjects || [];
    if (allowed.includes('ALL')) return false;
    return !allowed.includes(subjectId);
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
    return hexMap[color] || '#3b82f6';
  };

  const SubjectCard = ({
    code,
    title,
    desc,
    icon: Icon,
    color,
    onClick,
    progress,
    isComingSoon,
  }: any) => {
    const locked = isLocked(code) || isComingSoon;
    const accentHex = getAccentHex(color);

    return (
      <div
        role={locked ? undefined : 'button'}
        tabIndex={locked ? -1 : 0}
        aria-label={locked ? undefined : `Open ${title}`}
        onClick={() => !locked && onClick()}
        onKeyDown={(event) => {
          if (!locked && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            onClick();
          }
        }}
        className={`group relative bg-bg p-6 md:p-8 flex flex-col justify-between transition-colors ${
          locked
            ? 'opacity-70 cursor-not-allowed'
            : 'hover:bg-bg-raised cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-cad-accent'
        }`}
      >
        {locked && (
          <div className="absolute inset-0 z-30 bg-bg/85 backdrop-blur-xs flex flex-col items-center justify-center">
            <div className="p-3 bg-bg-raised border border-line mb-3">
              {isComingSoon ? (
                <Calendar className="w-5 h-5 text-amber-400" />
              ) : (
                <Lock className="w-5 h-5 text-muted" />
              )}
            </div>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1 border border-line bg-bg text-ink">
              {isComingSoon ? 'Coming Soon' : 'Locked'}
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
                SUBJ {code}
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
            {title}
          </h2>
          <p className="text-muted text-sm leading-relaxed mb-6">{desc}</p>
        </div>

        <div>
          {!locked && progress !== undefined && (
            <div className="mb-5">
              <div className="flex justify-between font-mono text-[10px] uppercase tracking-wider text-muted mb-1.5">
                <span>Mastery</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 w-full bg-line overflow-hidden">
                <div
                  className="h-full transition-transform duration-700 origin-left"
                  style={{
                    backgroundColor: accentHex,
                    transform: `scaleX(${progress / 100})`,
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-line font-mono text-[11px] uppercase tracking-[0.12em] text-muted group-hover:text-ink transition-colors">
            <span>Open Module</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-cad-accent" />
          </div>
        </div>
      </div>
    );
  };

  const commsLocked = isLocked('090');

  // Gamification calculations
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayStudySeconds = user?.dailyStudyData?.[todayDateStr] || 0;
  const dailyGoalSeconds = user?.dailyGoalSeconds || 3600;
  const streakDays = user?.streakDays || 0;
  const goalProgressPercent = Math.min(
    100,
    Math.round((todayStudySeconds / dailyGoalSeconds) * 100)
  );

  return (
    <div className="mx-auto max-w-[1280px] border-x border-line px-4 md:px-10 py-8 md:py-12">
      {/* Primary CAD Flight Plan Hero Banner */}
      <section className="relative border border-line bg-bg-raised p-6 md:p-10 mb-10">
        <span className="tick tick-half absolute -top-[5px] -left-[6px] z-20 pointer-events-none" />
        <span className="tick tick-half absolute -top-[5px] -right-[5px] z-20 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <div className="mb-4 inline-flex items-center gap-2 border border-line bg-bg px-2.5 py-1">
              <Navigation size={12} className="text-cad-accent" />
              <span className="hud-label text-ink">FLIGHT PLAN // ACTIVE DISPATCH</span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-medium tracking-[-0.035em] leading-[1.02] text-ink">
              Your next training vector{' '}
              <Accent className="text-cad-accent">starts here</Accent>.
            </h1>
            <p className="mt-4 max-w-xl text-sm md:text-base leading-relaxed text-muted">
              Build EASA exam readiness one focused simulator session at a time. Select a subject module below or inspect your telemetry analytics.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <CadButton
                variant="accent"
                onClick={() => onChangeView(View.AIR_LAW_HOME)}
              >
                <span>Start Studying (010 Air Law)</span>
                <ChevronRight size={15} />
              </CadButton>
              <CadButton
                variant="ghost"
                onClick={() => onChangeView(View.PROGRESS_DASHBOARD)}
              >
                <span>View Telemetry Progress</span>
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
                {goalProgressPercent}%
              </div>
              <div className="h-1 w-full bg-line mt-2 mb-1 overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-700"
                  style={{ width: `${goalProgressPercent}%` }}
                />
              </div>
              <div className="font-mono text-[10px] text-muted">
                {formatTime(todayStudySeconds)} / {formatTime(dailyGoalSeconds)}
              </div>
            </div>

            <div className="bg-bg p-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="hud-label text-cad-accent">STREAK</span>
                <Flame size={14} className="text-cad-accent" />
              </div>
              <div className="font-display text-2xl font-medium text-ink">
                {streakDays} <span className="font-mono text-xs text-muted">DAYS</span>
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
              <div className="font-mono text-[10px] text-muted mt-1">
                LOGGED SIMULATOR HOURS
              </div>
            </div>

            <div className="bg-bg p-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="hud-label text-amber-400">RANK</span>
                <Trophy size={14} className="text-amber-400" />
              </div>
              <div className="font-display text-2xl font-medium text-ink">Cadet</div>
              <div className="font-mono text-[10px] text-muted mt-1">
                EASA ATPL TRACK
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Eyebrow for EASA Subjects */}
      <div className="flex items-end justify-between gap-4 mb-5 pb-3 border-b border-line">
        <div>
          <div className="hud-label text-cad-accent mb-1">01 // EASA ECQB-2026 SYLLABUS</div>
          <h2 className="font-display text-2xl md:text-3xl font-medium tracking-[-0.03em] text-ink">
            Ground School <Accent className="text-cad-accent">Subject Matrix</Accent>
          </h2>
        </div>
        <span className="hidden sm:block hud-label">14 SUBJECT MODULES · SELECT TO LAUNCH</span>
      </div>

      {/* Gapless CAD Subject Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-line border border-line">
        <SubjectCard
          code="010"
          title="Air Law"
          desc="International law, conventions, agreements and organizations. ICAO Annex 2, 7, 11 and 14."
          icon={Scale}
          color="red"
          onClick={() => onChangeView(View.AIR_LAW_HOME)}
        />
        <SubjectCard
          code="021"
          title="AGK: Systems"
          desc="Fuselage, hydraulics, landing gear, flight controls, pneumatics, electrics and powerplant."
          icon={Settings}
          color="orange"
          onClick={() => onChangeView(View.AGK_SYSTEMS_HOME)}
        />
        <SubjectCard
          code="022"
          title="AGK: Instruments"
          desc="Sensors, air data computers, gyroscopic instruments, inertial navigation and EFIS/FMS."
          icon={Activity}
          color="amber"
          onClick={() => onChangeView(View.INST_HOME)}
        />
        <SubjectCard
          code="031"
          title="Mass & Balance"
          desc="Center of gravity envelopes, %MAC calculations, cargo loading and structural limits."
          icon={Weight}
          color="yellow"
          onClick={() => onChangeView(View.MASS_BAL_HOME)}
        />
        <SubjectCard
          code="032"
          title="Performance (A)"
          desc="Take-off V-speeds, balanced field length, climb gradients, cruise and landing for Class A."
          icon={TrendingUp}
          color="lime"
          onClick={() => onChangeView(View.PERF_HOME)}
        />
        <SubjectCard
          code="033"
          title="Flight Planning"
          desc="Fuel policy calculations, Point of Equal Time (PET), PSR, ETOPS and ICAO ATS flight plans."
          icon={Map}
          color="blue"
          onClick={() => onChangeView(View.FLIGHT_PLAN_HOME)}
        />
        <SubjectCard
          code="040"
          title="Human Performance"
          desc="Aviation physiology, hypoxia, vestibular illusions, sleep cycles and SHELL/TEM error models."
          icon={Users}
          color="emerald"
          onClick={() => onChangeView(View.HPL_HOME)}
        />
        <SubjectCard
          code="050"
          title="Meteorology"
          desc="ISA thermodynamics, frontal systems, jet streams, icing, turbulence and METAR/TAF decoding."
          icon={Cloud}
          color="teal"
          onClick={() => onChangeView(View.MET_HOME)}
        />
        <SubjectCard
          code="061"
          title="General Navigation"
          desc="Great circle & rhumb line geometry, Lambert conformal charts, magnetism and solar time."
          icon={Compass}
          color="cyan"
          onClick={() => onChangeView(View.GEN_NAV_HOME)}
        />
        <SubjectCard
          code="062"
          title="Radio Navigation"
          desc="VOR, DME, ILS CAT IIIB, NDB, weather radar, GNSS/SBAS and RNAV/PBN specification labs."
          icon={Radio}
          color="sky"
          onClick={() => onChangeView(View.RAD_NAV_HOME)}
        />
        <SubjectCard
          code="070"
          title="Operational Proc."
          desc="All-weather operations, RVSM, MNPS/NAT HLA, noise abatement, windshear and wake turbulence."
          icon={BookOpen}
          color="indigo"
          onClick={() => onChangeView(View.OPS_PROC_HOME)}
        />
        <SubjectCard
          code="081"
          title="Principles of Flight"
          desc="Subsonic & transonic aerodynamics, Cl/Cd drag polars, high-lift devices, stall and stability."
          icon={Plane}
          color="violet"
          onClick={() => onChangeView(View.POF_HOME)}
        />
        <SubjectCard
          code="100"
          title="KSA (100)"
          desc="Knowledge, Skills and Attitudes. ICAO core competencies, FORDEC decision-making and mental math."
          icon={Users}
          color="pink"
          onClick={() => onChangeView(View.KSA_HOME)}
        />

        {/* Subject 090 VFR & IFR Communications (Spans remaining 2 cols on XL) */}
        <div
          onClick={() => !commsLocked && onChangeView(View.DASHBOARD)}
          className={`xl:col-span-2 bg-bg-raised p-6 md:p-8 flex flex-col justify-between relative group transition-colors ${
            commsLocked ? 'opacity-70 cursor-not-allowed' : 'hover:bg-bg cursor-pointer'
          }`}
        >
          {commsLocked && (
            <div className="absolute inset-0 z-30 bg-bg/85 flex flex-col items-center justify-center">
              <Lock className="w-5 h-5 text-muted mb-2" />
              <span className="font-mono text-[10px] uppercase tracking-widest px-3 py-1 border border-line">
                Locked
              </span>
            </div>
          )}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-cad-accent/50 bg-cad-accent/10">
                <span className="h-1.5 w-1.5 bg-cad-accent inline-block" />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-cad-accent">
                  SUBJ 090 // FEATURED ATC SIMULATOR
                </span>
              </div>
              <Navigation size={20} className="text-cad-accent" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-medium tracking-[-0.03em] text-ink mb-2.5">
              VFR &amp; IFR <Accent className="text-cad-accent">Communications</Accent>
            </h2>
            <p className="text-muted text-sm md:text-base leading-relaxed max-w-xl">
              Master standard ICAO radiotelephony with AI-powered ATC roleplay, distress/urgency phraseology, propagation physics, and Morse code identification.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 mt-6 border-t border-line font-mono text-xs uppercase tracking-[0.12em] text-cad-accent">
            <span>Initialize Comms Simulator</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Specialized Airline & FAA Portals */}
      <div className="mt-12 flex items-end justify-between gap-4 mb-5 pb-3 border-b border-line">
        <div>
          <div className="hud-label text-sky-400 mb-1">02 // SPECIALIZED AIRLINE &amp; FAA SUITES</div>
          <h2 className="font-display text-2xl md:text-3xl font-medium tracking-[-0.03em] text-ink">
            Cadet Assessment &amp; <Accent className="text-cad-accent">FAA Knowledge</Accent> Hubs
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
        {/* EgyptAir Cadet Portal */}
        <div
          onClick={() => onChangeView(View.EGYPTAIR_DASHBOARD)}
          className="bg-bg p-6 md:p-8 flex flex-col justify-between hover:bg-bg-raised transition-colors cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="hud-label text-cyan-400">AIRLINE PORTAL // EGYPTAIR</span>
              <Plane size={18} className="text-cyan-400" />
            </div>
            <h3 className="font-display text-2xl font-medium text-ink mb-2 group-hover:text-cyan-400 transition-colors">
              ABC 4th Edition Prep
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Dedicated ground-school training covering ECARs, company fuel buildup, instrument holds &amp; DME arcs, jet aerodynamics, and ADM/CRM scenarios.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 mt-6 border-t border-line font-mono text-[11px] uppercase tracking-[0.12em] text-cyan-400">
            <span>Enter Cadet Portal</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* FAA Knowledge Test Guide */}
        <div
          onClick={() => onChangeView(View.FAA_TEST_GUIDE)}
          className="bg-bg p-6 md:p-8 flex flex-col justify-between hover:bg-bg-raised transition-colors cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="hud-label text-sky-400">FAA EXAM // PPL · IR · CPL · ATP</span>
              <Award size={18} className="text-sky-400" />
            </div>
            <h3 className="font-display text-2xl font-medium text-ink mb-2 group-hover:text-sky-400 transition-colors">
              FAA Knowledge Test Guide
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Interactive FAA exam simulator with 57 official figures, zero-latency sound synthesizer, mistake analytics, concept explorer, and timed practice tests.
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 mt-6 border-t border-line font-mono text-[11px] uppercase tracking-[0.12em] text-sky-400">
            <span>Launch FAA Test Center</span>
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
              Cessna 172 Flight Deck Hub
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
      </div>
    </div>
  );
};

export default PlatformDashboard;
