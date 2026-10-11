import React from 'react';
import { View } from '../../types';
import {
  Layers, ArrowRight, Gauge, Wind, Compass, Zap, Radio, Cloud,
  CheckCircle2, AlertTriangle, Shield, Play, Brain, BookOpen, Clock, Activity
} from 'lucide-react';
import RegulatoryBadge from '../ui/RegulatoryBadge';

interface Props {
  onChangeView: (view: View) => void;
  onBack?: () => void;
}

export const FoundationsHub: React.FC<Props> = ({ onChangeView, onBack }) => {
  const foundationClusters = [
    {
      id: 'cluster-atm-perf',
      title: 'Atmosphere, Altimetry & Aircraft Performance',
      subtitle: 'Core Physics to CS-23/CS-25 Operations',
      subjects: ['050 Met', '022 Instruments', '010 Air Law', '032 Performance'],
      description: 'The complete physical learning chain from hydrostatic atmospheric pressure lapse and aneroid capsule mechanics, to cold-temperature altimetry errors, density altitude divergence, and alpine takeoff ground roll calculations.',
      view: View.FOUNDATION_ATM_PERF_CHAIN,
      status: 'PRODUCTION_READY',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      icon: Gauge,
      accentGlow: 'from-cyan-500/20 to-blue-500/20'
    },
    {
      id: 'cluster-nav-triangle',
      title: 'Wind Triangle, Drift & 1-in-60 Dead Reckoning',
      subtitle: 'Vector Addition to En-Route In-Flight Interception',
      subjects: ['061 Gen Nav', '022 Instruments', '062 Radio Nav'],
      description: 'The essential navigation vector chain from heading/TAS vector mechanics and wind drift angle calculation, to mental dead reckoning (MDR) and 1-in-60 off-track course correction to destination.',
      view: View.FOUNDATION_NAV_TRIANGLE_CHAIN,
      status: 'PRODUCTION_READY',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      icon: Compass,
      accentGlow: 'from-emerald-500/20 to-teal-500/20'
    },
    {
      id: 'cluster-aero-lift',
      title: 'Aerodynamic Forces & Critical Angle of Attack',
      subtitle: 'Bernoulli, Boundary Layer & Stall Dynamics',
      subjects: ['081 PoF', '022 Instruments', '032 Performance', '100 KSA'],
      description: 'The foundation of dynamic pressure, circulation, lift generation, adverse yaw, ground effect, and high-speed Mach tuck, scaling directly into transport jet swept-wing aerodynamics.',
      view: View.CONCEPT_FORCES_OF_FLIGHT,
      status: 'AVAILABLE_IN_CONCEPT_LAB',
      badgeColor: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
      icon: Wind,
      accentGlow: 'from-violet-500/20 to-purple-500/20'
    },
    {
      id: 'cluster-turn-perf',
      title: 'Turning Flight Dynamics & Load Factor (G)',
      subtitle: 'Centripetal Force, Stall Speed & Structural Envelopes',
      subjects: ['081 PoF', '032 Performance', '040 Human Performance'],
      description: 'How bank angle escalates load factor (n = 1/cos φ), accelerated stall speed (Vs_turn = Vs √n), rate and radius of turn, and cardiovascular vestibular acceleration risks.',
      view: View.CONCEPT_TURN_PERF,
      status: 'AVAILABLE_IN_CONCEPT_LAB',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      icon: Activity,
      accentGlow: 'from-amber-500/20 to-orange-500/20'
    },
    {
      id: 'cluster-earth-nav',
      title: 'Earth Geometry, Convergency & Great Circles',
      subtitle: 'Spherical Trigonometry & Grid Navigation',
      subjects: ['061 Gen Nav', '033 Flight Planning', '062 Radio Nav'],
      description: 'Departure calculations, convergency (ΔLong × sin Lat), Rhumb lines vs Great circles, and polar stereographic chart projections for trans-oceanic airline routing.',
      view: View.CONCEPT_GREAT_CIRCLE,
      status: 'AVAILABLE_IN_CONCEPT_LAB',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      icon: Compass,
      accentGlow: 'from-emerald-500/20 to-teal-500/20'
    },
    {
      id: 'cluster-hold-entry',
      title: 'Holding Pattern Sectors & PANS-OPS Geometry',
      subtitle: 'Direct, Parallel & Teardrop Entry Physics',
      subjects: ['010 Air Law', '061 Gen Nav', '062 Radio Nav'],
      description: 'Interactive holding pattern entry visualizer with automatic wind drift compensation, outbound timing adjustments, and standard ICAO Doc 8168 obstacle clearance zones.',
      view: View.CONCEPT_HOLD_ENTRY,
      status: 'AVAILABLE_IN_CONCEPT_LAB',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      icon: Layers,
      accentGlow: 'from-blue-500/20 to-indigo-500/20'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* ── HEADER BANNER ────────────────────────────────────────── */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-500/20 to-cyan-500/20 rounded-2xl border border-amber-500/30 text-amber-400">
              <Layers size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  ATPLVector Ground-Bridge
                </span>
                <RegulatoryBadge jurisdiction="EASA" />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Foundations & Prerequisite Hub
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onChangeView(View.CONCEPT_LAB)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-2"
            >
              <Activity size={14} className="text-cyan-400" /> Open Concept Lab
            </button>
            <button
              onClick={() => onChangeView(View.PLATFORM_DASHBOARD)}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-950/20"
            >
              Mission Control
            </button>
          </div>
        </div>

        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Recover foundational PPL/CPL knowledge on demand without repeating entire courses. Designed with the 3-Tier delivery model: <strong className="text-amber-300">Quick Recall (60s)</strong>, <strong className="text-cyan-300">Guided Labs (3-5 min)</strong>, and <strong className="text-emerald-300">Closed-Book Assessment Gates</strong>.
        </p>
      </header>

      {/* ── 3-TIER ARCHITECTURE EXPLAINER CARD ────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Clock size={16} /> Tier 1: Quick Recall
          </div>
          <h3 className="text-sm font-bold text-white">60-Second Visual Anchors</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Non-intrusive micro-cards and live formula drills embedded directly at the top of ATPL lessons for instant memory recovery.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Gauge size={16} /> Tier 2: Guided Sandbox
          </div>
          <h3 className="text-sm font-bold text-white">Interactive Physics Labs</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Manipulate live aerodynamic dials, aneroid capsules, and density altitude sliders to explore physical laws with real-time feedback.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Shield size={16} /> Tier 3: Exam Certification
          </div>
          <h3 className="text-sm font-bold text-white">Unassisted Assessment & Spaced Review</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pass closed-book diagnostic checks to prove independent mastery and schedule automated spaced retrieval practice.
          </p>
        </div>
      </div>

      {/* ── FEATURED PRODUCTION VERTICAL SLICE ────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border-2 border-cyan-500/40 rounded-3xl p-6 md:p-8 space-y-4 shadow-2xl shadow-cyan-950/20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Flagship Vertical Slice • Production Ready
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
              050 Met • 022 Inst • 010 Law • 032 Perf
            </span>
          </div>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-white">
          Atmospheric Pressure → Altimetry → Density Altitude → Aircraft Performance
        </h2>

        <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Experience the complete pedagogical journey connecting basic barometry to transport aircraft takeoff limitations. Features the Innsbruck & Samedan Alpine Summer Departure case study, live aneroid capsule pressure chamber, and automated misconception detection.
        </p>

        <div className="pt-2">
          <button
            onClick={() => onChangeView(View.FOUNDATION_ATM_PERF_CHAIN)}
            className="py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-900/30 transition-all active:scale-95"
          >
            Launch Vertical Slice Journey <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* ── ALL FOUNDATION CLUSTERS GRID ──────────────────────────── */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Brain size={18} className="text-amber-400" /> Curricular Foundation Clusters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {foundationClusters.map(c => {
            const Icon = c.icon;
            return (
              <div
                key={c.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between space-y-4 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white">
                      <Icon size={20} />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${c.badgeColor}`}>
                      {c.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{c.title}</h3>
                    <div className="text-xs font-semibold text-slate-400">{c.subtitle}</div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {c.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {c.subjects.map(s => (
                      <span key={s} className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                        {s}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onChangeView(c.view)}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-all"
                  >
                    Open Module <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FoundationsHub;
