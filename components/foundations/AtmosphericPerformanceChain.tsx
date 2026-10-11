import React, { useState, useEffect } from 'react';
import { View } from '../../types';
import {
  Layers, ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, AlertCircle,
  Gauge, Cloud, Wind, Plane, Brain, RotateCcw, Compass, HelpCircle, Shield,
  TrendingDown, TrendingUp, ChevronRight, Activity, Calendar
} from 'lucide-react';
import RegulatoryBadge from '../ui/RegulatoryBadge';
import AccessibleSlider from '../ui/AccessibleSlider';
import AltimeterGauge from '../altimetry/AltimeterGauge';
import PressureChamberVisualizer from '../altimetry/PressureChamberVisualizer';
import AltimeterQuickReminderCard from '../altimetry/AltimeterQuickReminderCard';
import {
  calculatePressureAltitude,
  calculateDensityAltitude,
  getISAState
} from '../../lib/atmospherePhysics';
import {
  calculateAtmosphere,
  calculateTAS,
  calculateEngineDegradation
} from '../../lib/aviation/aircraftPerformance';
import {
  foundationEngine,
  TransparentRationale,
  StudentEvidenceRecord
} from '../../services/foundationRecommendationEngine';

interface Props {
  onChangeView: (view: View) => void;
  returnView?: View;
  returnTitle?: string;
}

type Stage = 'READINESS_CHECK' | 'RECOMMENDATION' | 'QUICK_REMINDER' | 'GUIDED_REFRESHER' | 'ATPL_LESSON' | 'SCENARIO' | 'ASSESSMENT' | 'COMPLETED';

interface DiagnosticEvaluationResult {
  recommendationTriggered: boolean;
  rationale: TransparentRationale | null;
}

export const AtmosphericPerformanceChain: React.FC<Props> = ({
  onChangeView,
  returnView = View.PLATFORM_DASHBOARD,
  returnTitle = 'Mission Control'
}) => {
  // Current step in the 6-stage journey
  const [currentStage, setCurrentStage] = useState<Stage>('READINESS_CHECK');

  // --- STAGE 1: READINESS CHECK STATE ---
  const [diagAnswers, setDiagAnswers] = useState<Record<string, number>>({});
  const [evaluation, setEvaluation] = useState<DiagnosticEvaluationResult | null>(null);

  // --- STAGE 4: ATPL LESSON INTERACTIVE STATE ---
  const [elevation, setElevation] = useState(5000);
  const [qnh, setQnh] = useState(1013);
  const [oat, setOat] = useState(25); // Celsius
  const [massKg, setMassKg] = useState(2500); // Light twin approx 5,500 lbs
  const [predictedTAS, setPredictedTAS] = useState<'HIGHER' | 'SAME' | 'LOWER' | null>(null);
  const [predictedRoll, setPredictedRoll] = useState<'LONGER' | 'SAME' | 'SHORTER' | null>(null);
  const [predictionSubmitted, setPredictionSubmitted] = useState(false);

  // --- STAGE 5: SAMEDAN SCENARIO STATE ---
  const [samedanPayloadShed, setSamedanPayloadShed] = useState(0); // kg to shed
  const [samedanTimeHour, setSamedanTimeHour] = useState(14); // 14:00 (hot) vs 07:00 (cool)

  // --- STAGE 6: INDEPENDENT ASSESSMENT STATE ---
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
  const [studentMasteryStatus, setStudentMasteryStatus] = useState<'NOT_TESTED' | 'MASTERED' | 'NEEDS_REVIEW'>('NOT_TESTED');
  const [nextReviewDate, setNextReviewDate] = useState<string | null>(null);

  // Physics Calculations
  const atm = calculateAtmosphere({ elevationFt: elevation, qnhHpa: qnh, oatC: oat });
  const pa = atm.pressureAltFt;
  const deltaIsa = atm.deltaIsaC;
  const da = atm.densityAltFt;
  const sigma = atm.densityRatioSigma;

  // Speeds & Performance
  const vRotationIAS = 85; // kts
  const vRotationTAS = calculateTAS(vRotationIAS, sigma);
  const enginePowerPct = Math.round(calculateEngineDegradation('PISTON_NATURAL', sigma, deltaIsa) * 100);
  const baseRollMeters = 450 * Math.pow(massKg / 2500, 2);
  const groundRollMeters = baseRollMeters / Math.pow(sigma, 1.85);

  // Samedan Alpine Scenario Math
  const samedanElev = 5660;
  const samedanQNH = 1010;
  const samedanTemp = samedanTimeHour === 14 ? 28 : 12; // hot vs morning
  const samedanAtm = calculateAtmosphere({ elevationFt: samedanElev, qnhHpa: samedanQNH, oatC: samedanTemp });
  const samedanPA = samedanAtm.pressureAltFt;
  const samedanDA = samedanAtm.densityAltFt;
  const samedanMass = 2500 - samedanPayloadShed;
  const samedanBaseRoll = 450 * Math.pow(samedanMass / 2500, 2);
  const samedanRoll = samedanBaseRoll / Math.pow(samedanAtm.densityRatioSigma, 1.85);
  const samedanTODR = Math.round(samedanRoll * 1.25); // CS-23 1.25 factor
  const samedanTORA = 1800; // meters (5,905 ft)
  const isSamedanGo = samedanTODR <= samedanTORA;

  // Track readiness check submission
  const handleDiagnosticSubmit = () => {
    // Diagnose Question 2: "If flying into extreme cold air (-20°C) with constant 1013 altimeter, what is true altitude?"
    const q2Choice = diagAnswers['diag-q2'];
    const chosenIndex = q2Choice !== undefined ? q2Choice : 1;

    if (chosenIndex === 0) {
      setEvaluation({
        recommendationTriggered: false,
        rationale: null
      });
    } else {
      const misconception = chosenIndex === 1 ? 'MISCON_TEMP_CORR_SIGN_INVERSION' : 'MISCON_ISA_DEV_VS_ABS_TEMP';
      const evidence: StudentEvidenceRecord = {
        studentId: 'student-demo',
        questionId: 'Q_ALT_TEMP_COLD_01',
        selectedOptionIndex: chosenIndex === 1 ? 0 : 2,
        isCorrect: false,
        timeSpentSeconds: 15,
        helpRequested: false,
        attemptNumber: 1,
        timestamp: new Date().toISOString()
      };
      const rationale = foundationEngine.generateRationale(
        'FND_ALTIMETER_TEMP_ERR',
        evidence,
        'CONCEPTUAL_MISUNDERSTANDING',
        misconception
      );
      setEvaluation({
        recommendationTriggered: true,
        rationale
      });
    }
    setCurrentStage('RECOMMENDATION');
  };

  // Handle Assessment submission
  const handleAssessmentSubmit = () => {
    setAssessmentSubmitted(true);
    const q1Correct = assessmentAnswers[1] === 0;
    const q2Correct = assessmentAnswers[2] === 2;

    if (q1Correct && q2Correct) {
      setStudentMasteryStatus('MASTERED');
      // Record mastery in learning system
      const state = foundationRecommendationEngine.recordAssessmentOutcome(
        'FND_ALTIMETER_TEMP_ERR',
        'eval-vertical-slice-1',
        true,
        false
      );
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + 3);
      setNextReviewDate(scheduledDate.toLocaleDateString());
    } else {
      setStudentMasteryStatus('NEEDS_REVIEW');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* ── TOP MISSION CONTROL HEADER ───────────────────────────── */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onChangeView(returnView)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all border border-slate-700"
          >
            <ArrowLeft size={14} /> Return to {returnTitle}
          </button>
          <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                EASA ECQB Vertical Slice
              </span>
              <RegulatoryBadge jurisdiction="EASA" />
            </div>
            <h1 className="text-base md:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Atmospheric Pressure <ChevronRight size={14} className="text-slate-500" /> Altimetry <ChevronRight size={14} className="text-slate-500" /> Density Altitude <ChevronRight size={14} className="text-slate-500" /> Performance
            </h1>
          </div>
        </div>

        {/* Dual Tracking Metrics (Platform Coverage vs Student Demonstrated Mastery) */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2.5">
            <Layers size={14} className="text-cyan-400" />
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Platform Coverage</div>
              <div className="text-xs font-bold text-white">100% ECQB Mapped</div>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2.5">
            <CheckCircle2 size={14} className={studentMasteryStatus === 'MASTERED' ? 'text-emerald-400' : 'text-amber-400'} />
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Demonstrated Mastery</div>
              <div className="text-xs font-bold text-white">
                {studentMasteryStatus === 'MASTERED' ? 'Verified Independent' : 'In Progress'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── STAGE STEPPER BAR ────────────────────────────────────── */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 px-4 md:px-8 py-2.5 overflow-x-auto">
        <div className="max-w-6xl mx-auto flex items-center justify-between min-w-[650px] text-xs">
          {[
            { id: 'READINESS_CHECK', label: '1. Diagnostic' },
            { id: 'RECOMMENDATION', label: '2. Analysis' },
            { id: 'QUICK_REMINDER', label: '3. Quick Recall' },
            { id: 'GUIDED_REFRESHER', label: '4. Altimeter Lab' },
            { id: 'ATPL_LESSON', label: '5. ATPL Physics' },
            { id: 'SCENARIO', label: '6. Alpine Mission' },
            { id: 'ASSESSMENT', label: '7. Exam Gate' }
          ].map((s, idx) => {
            const isActive = currentStage === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentStage(s.id as Stage)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MAIN CONTENT WORKSPACE ───────────────────────────────── */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8">

        {/* ───────────────────────────────────────────────────────────
            STAGE 1: CHAPTER READINESS CHECK (Pre-Flight Diagnostic)
        ──────────────────────────────────────────────────────────── */}
        {currentStage === 'READINESS_CHECK' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <Activity size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Pre-Flight Readiness Check</h2>
                    <p className="text-xs text-slate-400">Verifying PPL/CPL foundational knowledge before high-altitude jet performance</p>
                  </div>
                </div>
                {/* Instant Skip Flow for Knowledgeable Cadets */}
                <button
                  onClick={() => setCurrentStage('ATPL_LESSON')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  Skip Diagnostic <ChevronRight size={14} />
                </button>
              </div>

              <div className="space-y-6 pt-4">
                {/* Question 1: Barometric Datum */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400">QUESTION 1 OF 3 • 050 MET / 022 INST</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Core Physics</span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    When an aircraft altimeter subscale is set to the local QNH on the apron prior to departure, what does the instrument indicate?
                  </p>
                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {[
                      'Zero (Height above the aerodrome runway threshold)',
                      'The official Aerodrome Elevation above Mean Sea Level',
                      'Pressure Altitude above the 1013.25 hPa standard isobar',
                      'Density Altitude corrected for non-standard ambient temperature'
                    ].map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setDiagAnswers(prev => ({ ...prev, 'diag-q1': i }))}
                        className={`text-left text-xs p-3 rounded-lg border transition-all ${
                          diagAnswers['diag-q1'] === i
                            ? 'bg-cyan-500/15 border-cyan-500 text-cyan-200 font-semibold'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                        }`}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 2: Temperature Error (Misconception Trap) */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400">QUESTION 2 OF 3 • 010 AIR LAW / 050 MET</span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">Operational Trap</span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    An aircraft is cruising at FL100 over a mountainous region in extreme winter conditions (OAT is -25°C, which is ISA -20°C). If the altimeter remains unchanged at 10,000 ft indicated, what is the aircraft's TRUE altitude?
                  </p>
                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {[
                      'Approximately 9,200 ft (True altitude is significantly LOWER than indicated)',
                      'Approximately 10,800 ft (True altitude is HIGHER because cold air is denser)',
                      'Exactly 10,000 ft (Aneroid capsules measure absolute pressure independently of temperature)',
                      'Zero (The instrument freezes at sub-zero temperatures)'
                    ].map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setDiagAnswers(prev => ({ ...prev, 'diag-q2': i }))}
                        className={`text-left text-xs p-3 rounded-lg border transition-all ${
                          diagAnswers['diag-q2'] === i
                            ? 'bg-amber-500/15 border-amber-500 text-amber-200 font-semibold'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                        }`}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 3: Density on Takeoff Roll */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400">QUESTION 3 OF 3 • 032 PERFORMANCE</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Takeoff Roll</span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    On a hot summer afternoon with very high Density Altitude, why does an aircraft require a significantly longer takeoff ground roll?
                  </p>
                  <div className="grid grid-cols-1 gap-2 pt-1">
                    {[
                      'Required rotation True Airspeed (TAS) is higher, while engine thrust is reduced due to lower air mass flow',
                      'The indicated rotation speed (Vr) increases on the airspeed indicator dial',
                      'Tire rolling friction increases dramatically on hot asphalt runways',
                      'Lift coefficient (Cl) decreases proportionally with ambient air pressure'
                    ].map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setDiagAnswers(prev => ({ ...prev, 'diag-q3': i }))}
                        className={`text-left text-xs p-3 rounded-lg border transition-all ${
                          diagAnswers['diag-q3'] === i
                            ? 'bg-cyan-500/15 border-cyan-500 text-cyan-200 font-semibold'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                        }`}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  disabled={diagAnswers['diag-q1'] === undefined || diagAnswers['diag-q2'] === undefined || diagAnswers['diag-q3'] === undefined}
                  onClick={handleDiagnosticSubmit}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-900/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Analyze Readiness & Proceed <ArrowRight size={16} className="inline ml-1.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────
            STAGE 2: TRANSPARENT RECOMMENDATION & RATIONALE
        ──────────────────────────────────────────────────────────── */}
        {currentStage === 'RECOMMENDATION' && evaluation && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-5">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${
                  evaluation.recommendationTriggered
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                }`}>
                  {evaluation.recommendationTriggered ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Diagnostic Analysis & Routing</h2>
                  <p className="text-xs text-slate-400">Transparent AI Recommendation Architecture</p>
                </div>
              </div>

              {/* "Why Am I Seeing This Recommendation?" Card */}
              {evaluation.rationale ? (
                <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <HelpCircle size={14} /> Why am I seeing this recommendation?
                    </span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                      {evaluation.rationale.errorClassification}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    {evaluation.rationale.summary}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-slate-100">Observation: </strong>
                    {evaluation.rationale.studentActionObservation}
                  </p>
                  <p className="text-xs text-amber-200/90 bg-amber-950/30 p-3 rounded-lg border border-amber-900/40 leading-relaxed">
                    <strong className="text-amber-100">Aviation Safety Consequence: </strong>
                    {evaluation.rationale.aviationPrincipleConsequence}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-400">
                    <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                      Rule of Thumb: {evaluation.rationale.aviationPrincipleConsequence.includes('below') ? 'High to Low, Look Out Below' : '4 ft/1000 ft/°C'}
                    </span>
                    <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                      Focus: {evaluation.rationale.pedagogicalObjective}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-5 space-y-2">
                  <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 size={16} /> Foundation Principles Verified
                  </h3>
                  <p className="text-xs text-slate-300">
                    You demonstrated fluent recall of barometric datum principles and cold-temperature altimetry hazards. You are cleared for direct entry into the ATPL Physics & Performance Sandbox.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setCurrentStage('QUICK_REMINDER')}
                  className="py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/30 transition-all"
                >
                  <Clock size={16} /> 60-Second Quick Recall (Tier 1)
                </button>
                <button
                  onClick={() => setCurrentStage('GUIDED_REFRESHER')}
                  className="py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/30 transition-all"
                >
                  <Gauge size={16} /> Open Altimeter Lab (Tier 2)
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  onClick={() => setCurrentStage('ATPL_LESSON')}
                  className="text-xs text-slate-400 hover:text-slate-200 underline font-medium"
                >
                  Skip Refresher & Go Directly to ATPL Lesson →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────
            STAGE 3: QUICK REMINDER (Tier 1: < 60s)
        ──────────────────────────────────────────────────────────── */}
        {currentStage === 'QUICK_REMINDER' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Tier 1 Delivery • 60-Second Visual Anchor
              </span>
              <button
                onClick={() => setCurrentStage('ATPL_LESSON')}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                Continue to ATPL Lesson <ArrowRight size={14} />
              </button>
            </div>
            <AltimeterQuickReminderCard />
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────
            STAGE 4: GUIDED FOUNDATION REFRESHER (Tier 2: 3-5 min)
        ──────────────────────────────────────────────────────────── */}
        {currentStage === 'GUIDED_REFRESHER' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Tier 2 Delivery • Interactive Altimeter & Aneroid Capsule Lab
              </span>
              <button
                onClick={() => setCurrentStage('ATPL_LESSON')}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                Proceed to ATPL Lesson <ArrowRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Altimeter 3-Pointer Gauge with Subscale Knob */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Gauge size={16} className="text-cyan-400" /> Interactive 3-Pointer Altimeter Dial
                </h3>
                <AltimeterGauge
                  indicatedAltitudeFt={5000}
                  subscaleHpa={qnh}
                  size={260}
                  onSubscaleChange={(newHpa) => setQnh(Math.round(newHpa))}
                />
                <div className="mt-4 text-center">
                  <span className="text-xs font-mono text-cyan-300 bg-slate-950 px-3 py-1 rounded border border-slate-800">
                    Kollsman Subscale: {qnh} hPa ({(qnh * 0.02953).toFixed(2)} inHg)
                  </span>
                </div>
              </div>

              {/* Aneroid Capsule Pressure Chamber Visualizer */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Activity size={16} className="text-emerald-400" /> Evacuated Aneroid Capsule Mechanism
                </h3>
                <PressureChamberVisualizer
                  ambientPressureHpa={qnh}
                  isBlocked={false}
                  isAlternateStatic={false}
                  size={260}
                />
                <p className="mt-4 text-xs text-slate-400 text-center max-w-xs leading-relaxed">
                  As ambient static pressure decreases with altitude, the vacuum capsule expands, driving the gear train to turn the needles.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────
            STAGE 5: ATPL LESSON & PREDICTION-EXPLORATION SANDBOX
        ──────────────────────────────────────────────────────────── */}
        {currentStage === 'ATPL_LESSON' && (
          <div className="space-y-6">
            {/* Cognitive Rhythm Step 1 & 2: Predict before Explore */}
            {!predictionSubmitted ? (
              <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 md:p-8 space-y-5 max-w-3xl mx-auto shadow-xl shadow-cyan-950/20">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                    <Brain size={22} />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Cognitive Commitment • Step 1</span>
                    <h2 className="text-lg font-bold text-white">Hypothesis: Hot Mountain Airfield Departure</h2>
                  </div>
                </div>

                <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                  <p>
                    <strong>Aviation Scenario:</strong> You are taking off from a high-elevation airfield at <strong className="text-white">5,000 ft AMSL</strong> on an afternoon where OAT is <strong className="text-amber-400">+25°C (ISA +20°C)</strong>.
                  </p>
                  <p className="text-slate-400">
                    Your Cessna/Beechcraft rotation speed is fixed at <strong className="text-white">85 kts IAS</strong>.
                  </p>
                </div>

                <div className="space-y-4 pt-1">
                  <div>
                    <label className="text-xs font-bold text-white block mb-1.5">
                      1. Predict your True Airspeed (TAS) at the moment of liftoff:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'HIGHER', label: 'Higher than 85 kts' },
                        { id: 'SAME', label: 'Exactly 85 kts' },
                        { id: 'LOWER', label: 'Lower than 85 kts' }
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={() => setPredictedTAS(item.id as any)}
                          className={`text-xs py-2.5 px-3 rounded-lg border font-semibold transition-all ${
                            predictedTAS === item.id
                              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-white block mb-1.5">
                      2. Predict your Takeoff Ground Roll distance relative to sea level:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'LONGER', label: 'Much Longer Roll' },
                        { id: 'SAME', label: 'Same Distance' },
                        { id: 'SHORTER', label: 'Shorter Roll' }
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={() => setPredictedRoll(item.id as any)}
                          className={`text-xs py-2.5 px-3 rounded-lg border font-semibold transition-all ${
                            predictedRoll === item.id
                              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={!predictedTAS || !predictedRoll}
                    onClick={() => setPredictionSubmitted(true)}
                    className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all mt-2"
                  >
                    Commit Prediction & Unlock Live Physics Sandbox →
                  </button>
                </div>
              </div>
            ) : (
              /* Cognitive Rhythm Step 3: Explore Live Interactive Physics */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Interactive Physics Lab</span>
                    <h2 className="text-xl font-bold text-white">The Atmosphere-to-Performance Coupling</h2>
                  </div>
                  <button
                    onClick={() => setCurrentStage('SCENARIO')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-orange-950/20"
                  >
                    Go to Alpine Scenario (Samedan) <ArrowRight size={14} />
                  </button>
                </div>

                {/* Live Sliders */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <div>
                    <AccessibleSlider
                      id="elev-slider"
                      label="Field Elevation"
                      value={elevation}
                      min={0}
                      max={9000}
                      step={100}
                      unit=" ft"
                      onChange={setElevation}
                    />
                  </div>
                  <div>
                    <AccessibleSlider
                      id="qnh-slider"
                      label="QNH Subscale"
                      value={qnh}
                      min={960}
                      max={1040}
                      step={1}
                      unit=" hPa"
                      onChange={setQnh}
                    />
                  </div>
                  <div>
                    <AccessibleSlider
                      id="oat-slider"
                      label="Ambient Temp (OAT)"
                      value={oat}
                      min={-20}
                      max={45}
                      step={1}
                      unit=" °C"
                      onChange={setOat}
                    />
                  </div>
                  <div>
                    <AccessibleSlider
                      id="mass-slider"
                      label="Aircraft Mass"
                      value={massKg}
                      min={1500}
                      max={3000}
                      step={50}
                      unit=" kg"
                      onChange={setMassKg}
                    />
                  </div>
                </div>

                {/* Physics Engine Readouts */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Pressure Alt (PA)</div>
                    <div className="text-lg font-mono font-bold text-white">{Math.round(pa)} ft</div>
                    <div className="text-[10px] text-slate-500">Isobar 1013 datum</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <div className="text-[10px] font-bold text-amber-400 uppercase">Density Alt (DA)</div>
                    <div className="text-lg font-mono font-bold text-amber-300">{Math.round(da)} ft</div>
                    <div className="text-[10px] text-amber-400/80">ΔISA = {deltaIsa >= 0 ? `+${deltaIsa.toFixed(1)}` : deltaIsa.toFixed(1)}°C</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Density Ratio (σ)</div>
                    <div className="text-lg font-mono font-bold text-cyan-300">{sigma.toFixed(3)}</div>
                    <div className="text-[10px] text-slate-500">{Math.round((1 - sigma) * 100)}% density loss</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">True Airspeed (TAS)</div>
                    <div className="text-lg font-mono font-bold text-white">{vRotationTAS.toFixed(1)} kts</div>
                    <div className="text-[10px] text-cyan-400">Fixed 85 kts IAS</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Engine Power</div>
                    <div className="text-lg font-mono font-bold text-white">{enginePowerPct}%</div>
                    <div className="text-[10px] text-red-400">-{100 - enginePowerPct}% thrust</div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Ground Roll</div>
                    <div className="text-lg font-mono font-bold text-amber-400">{Math.round(groundRollMeters)} m</div>
                    <div className="text-[10px] text-slate-500">{Math.round(groundRollMeters * 3.28084)} ft</div>
                  </div>
                </div>

                {/* Aerodynamic Relationship Visualizer */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Wind size={16} className="text-cyan-400" /> The Aerodynamic Cause & Effect Chain
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="text-cyan-400 font-bold uppercase tracking-wider text-[10px]">1. Airspeed Law</div>
                      <div className="font-mono text-white text-xs bg-slate-900 p-2 rounded">
                        V_TAS = V_IAS / √σ
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Wings generate lift from dynamic pressure (½ρV²). In thin air (low σ), the aircraft must roll much faster across the ground to reach the required lift.
                      </p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">2. Engine Power Collapse</div>
                      <div className="font-mono text-white text-xs bg-slate-900 p-2 rounded">
                        BHP ≈ 1.132·σ - 0.132
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Piston cylinders ingest fewer oxygen molecules per stroke; turbine mass airflow (ṁ = ρAV) drops, degrading total thrust available for acceleration.
                      </p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="text-red-400 font-bold uppercase tracking-wider text-[10px]">3. Ground Roll Explosion</div>
                      <div className="font-mono text-white text-xs bg-slate-900 p-2 rounded">
                        S_G ∝ W² / (σ² · Thrust)
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Higher physical speed combined with weaker acceleration squares the ground roll distance, creating high-risk runway excursion hazards.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────
            STAGE 6: APPLIED AVIATION SCENARIO (Samedan LSZS)
        ──────────────────────────────────────────────────────────── */}
        {currentStage === 'SCENARIO' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                    Flight Operations Scenario • High Alpine Airport
                  </span>
                  <h2 className="text-xl font-bold text-white">Samedan / Engadin (LSZS) Midday Departure</h2>
                </div>
                <div className={`px-3 py-1.5 rounded-xl font-bold text-xs border ${
                  isSamedanGo
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-red-500/20 text-red-300 border-red-500/40'
                }`}>
                  DISPATCH VERDICT: {isSamedanGo ? 'GO (CLEARED)' : 'NO-GO (RUNWAY EXCURSION)'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-white">Aerodrome & Runway Facts</div>
                  <ul className="space-y-1 text-slate-300 list-disc list-inside">
                    <li>Elevation: 5,660 ft (1,725 m AMSL)</li>
                    <li>Runway 21 TORA: 1,800 m (5,905 ft)</li>
                    <li>Surrounded by 10,000 ft peaks on all sides</li>
                  </ul>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-white">Computed Atmospheric Density</div>
                  <ul className="space-y-1 text-slate-300 list-disc list-inside">
                    <li>Pressure Altitude: {Math.round(samedanPA)} ft</li>
                    <li>Density Altitude: <strong className="text-amber-400">{Math.round(samedanDA)} ft DA</strong></li>
                    <li>Effective Density Loss: {Math.round((1 - samedanAtm.densityRatioSigma) * 100)}%</li>
                  </ul>
                </div>
              </div>

              {/* Scenario Interactive Decision Solvers */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white">Remediation Decision Levers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Departure Time & Temperature:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSamedanTimeHour(14)}
                        className={`text-xs py-2 px-3 rounded-lg border font-semibold ${
                          samedanTimeHour === 14
                            ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        14:00 (+28°C / Hot)
                      </button>
                      <button
                        onClick={() => setSamedanTimeHour(7)}
                        className={`text-xs py-2 px-3 rounded-lg border font-semibold ${
                          samedanTimeHour === 7
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        07:00 (+12°C / Cool)
                      </button>
                    </div>
                  </div>

                  <div>
                    <AccessibleSlider
                      id="shed-slider"
                      label="Payload / Fuel to Shed"
                      value={samedanPayloadShed}
                      min={0}
                      max={600}
                      step={50}
                      unit=" kg"
                      onChange={setSamedanPayloadShed}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">CS-23 Factored Takeoff Distance Required (TODR):</span>
                    <div className="text-base font-mono font-bold text-white">
                      {samedanTODR} m ({Math.round(samedanTODR * 3.28084)} ft)
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400">Runway 21 Margin:</span>
                    <div className={`text-base font-mono font-bold ${
                      samedanTORA - samedanTODR >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {samedanTORA - samedanTODR} m ({Math.round((samedanTORA - samedanTODR) * 3.28084)} ft)
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setCurrentStage('ASSESSMENT')}
                  className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-cyan-950/20"
                >
                  Proceed to Independent Assessment Gate <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────
            STAGE 7: INDEPENDENT ASSESSMENT & SPACED RETENTION
        ──────────────────────────────────────────────────────────── */}
        {currentStage === 'ASSESSMENT' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Shield size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Independent Mastery Assessment</h2>
                  <p className="text-xs text-slate-400">Closed-book, unassisted check for official EASA ECQB certification</p>
                </div>
              </div>

              {!assessmentSubmitted ? (
                <div className="space-y-6 pt-2">
                  {/* Assessment Question 1 */}
                  <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 space-y-3">
                    <div className="text-xs font-mono font-bold text-cyan-400">QUESTION 1 • FORMULA DEDUCTION</div>
                    <p className="text-sm font-semibold text-white">
                      An aircraft flies at FL120 where OAT is -29°C (standard ISA temp at 12,000 ft is -9°C). What is the true altitude of the aircraft?
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        '11,040 ft (4 ft × 12 × (-20) = -960 ft)',
                        '12,960 ft (4 ft × 12 × (+20) = +960 ft)',
                        '12,000 ft (Altimeters are self-compensating)',
                        '10,500 ft (Flat reduction)'
                      ].map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => setAssessmentAnswers(prev => ({ ...prev, 1: i }))}
                          className={`text-left text-xs p-3 rounded-lg border transition-all ${
                            assessmentAnswers[1] === i
                              ? 'bg-cyan-500/15 border-cyan-500 text-cyan-200 font-semibold'
                              : 'bg-slate-900 border-slate-800 text-slate-300'
                          }`}
                        >
                          {String.fromCharCode(65 + i)}. {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Assessment Question 2 */}
                  <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 space-y-3">
                    <div className="text-xs font-mono font-bold text-cyan-400">QUESTION 2 • OPERATIONAL APPLICATION</div>
                    <p className="text-sm font-semibold text-white">
                      If pressure altitude is 3,000 ft and OAT is +30°C (standard temp is +9°C), what is the approximate Density Altitude?
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        '3,000 ft',
                        '4,200 ft',
                        '5,520 ft (3,000 + 120 × 21°C)',
                        '1,800 ft'
                      ].map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => setAssessmentAnswers(prev => ({ ...prev, 2: i }))}
                          className={`text-left text-xs p-3 rounded-lg border transition-all ${
                            assessmentAnswers[2] === i
                              ? 'bg-cyan-500/15 border-cyan-500 text-cyan-200 font-semibold'
                              : 'bg-slate-900 border-slate-800 text-slate-300'
                          }`}
                        >
                          {String.fromCharCode(65 + i)}. {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={assessmentAnswers[1] === undefined || assessmentAnswers[2] === undefined}
                    onClick={handleAssessmentSubmit}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/30 transition-all disabled:opacity-40"
                  >
                    Submit Closed-Book Answers & Record Mastery →
                  </button>
                </div>
              ) : (
                /* Assessment Results & Spaced Retention Output */
                <div className="space-y-5 pt-2">
                  <div className={`p-6 rounded-xl border ${
                    studentMasteryStatus === 'MASTERED'
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      {studentMasteryStatus === 'MASTERED' ? (
                        <CheckCircle2 size={24} className="text-emerald-400" />
                      ) : (
                        <AlertTriangle size={24} className="text-amber-400" />
                      )}
                      <h3 className="text-base font-bold text-white">
                        {studentMasteryStatus === 'MASTERED'
                          ? '100% Unassisted Score — Concept Mastered!'
                          : 'Review Recommended — Partial Score'}
                      </h3>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300">
                      {studentMasteryStatus === 'MASTERED'
                        ? 'Evidence recorded to your persistent profile. Your demonstrated competence in barometric temperature corrections and density altitude calculations has been scheduled into the Spaced Retention System.'
                        : 'Some questions were answered incorrectly. We recommend reviewing the Altimeter Lab before taking the official exam.'}
                    </p>

                    {studentMasteryStatus === 'MASTERED' && nextReviewDate && (
                      <div className="mt-4 p-3 bg-slate-900/90 rounded-lg border border-emerald-500/30 flex items-center justify-between text-xs text-white">
                        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                          <Calendar size={14} /> Next Spaced Retrieval Due:
                        </span>
                        <span className="font-mono font-bold">{nextReviewDate} (Interval: 3 Days)</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => {
                        setAssessmentSubmitted(false);
                        setAssessmentAnswers({});
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      <RotateCcw size={14} className="inline mr-1" /> Retake Assessment
                    </button>
                    <button
                      onClick={() => onChangeView(returnView)}
                      className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-950/20"
                    >
                      Return to {returnTitle} →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AtmosphericPerformanceChain;
