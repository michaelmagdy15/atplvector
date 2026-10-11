import React, { useState } from 'react';
import { View } from '../../types';
import {
  Compass, ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, AlertCircle,
  Wind, Navigation, Clock, RotateCcw, Shield, ExternalLink, Calendar,
  TrendingUp, Activity, Layers, Sparkles
} from 'lucide-react';
import RegulatoryBadge from '../ui/RegulatoryBadge';
import AccessibleSlider from '../ui/AccessibleSlider';
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

type Stage = 'READINESS_CHECK' | 'RECOMMENDATION' | 'QUICK_REMINDER' | 'VECTOR_EXPLORER' | 'SCENARIO_1_IN_60' | 'ASSESSMENT' | 'COMPLETED';

interface DiagnosticEvaluationResult {
  recommendationTriggered: boolean;
  rationale: TransparentRationale | null;
}

export const NavigationTriangleChain: React.FC<Props> = ({
  onChangeView,
  returnView = View.PLATFORM_DASHBOARD,
  returnTitle = 'Mission Control'
}) => {
  const [currentStage, setCurrentStage] = useState<Stage>('READINESS_CHECK');

  // --- STAGE 1: DIAGNOSTIC STATE ---
  const [diagAnswers, setDiagAnswers] = useState<Record<string, number>>({});
  const [evaluation, setEvaluation] = useState<DiagnosticEvaluationResult | null>(null);

  // --- STAGE 4: VECTOR EXPLORER INTERACTIVE STATE ---
  const [trackDeg, setTrackDeg] = useState(90);
  const [tasKt, setTasKt] = useState(180);
  const [windDirDeg, setWindDirDeg] = useState(40); // wind from 040
  const [windSpeedKt, setWindSpeedKt] = useState(35);
  const [predictionDrift, setPredictionDrift] = useState<'LEFT' | 'RIGHT' | 'ZERO' | null>(null);
  const [predictionSubmitted, setPredictionSubmitted] = useState(false);

  // --- STAGE 5: 1-IN-60 SCENARIO STATE ---
  const [distFlownNm, setDistFlownNm] = useState(40);
  const [distToGoNm, setDistToGoNm] = useState(60);
  const [xteNm, setXteNm] = useState(3); // 3 NM Right
  const [offTrackDirection, setOffTrackDirection] = useState<'LEFT' | 'RIGHT'>('RIGHT');
  const [selectedRecoveryStrategy, setSelectedRecoveryStrategy] = useState<'PARALLEL' | 'DIRECT' | 'REGAIN_SAME'>('DIRECT');

  // --- STAGE 6: ASSESSMENT STATE ---
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
  const [studentMasteryStatus, setStudentMasteryStatus] = useState<'NOT_TESTED' | 'MASTERED' | 'NEEDS_REVIEW'>('NOT_TESTED');
  const [nextReviewDate, setNextReviewDate] = useState<string | null>(null);

  // Trigonometric Vector Calculations
  // Wind angle relative to track
  const windAngleRad = ((windDirDeg - trackDeg) * Math.PI) / 180;
  // Crosswind component: positive = from right, negative = from left
  const crosswindKt = windSpeedKt * Math.sin(windAngleRad);
  // Headwind component: positive = headwind, negative = tailwind
  const headwindKt = windSpeedKt * Math.cos(windAngleRad);

  // Drift angle: arcsin(crosswind / TAS) in degrees
  // If wind from 040 and track 090: wind is from LEFT (040 is 50 deg left of 090)
  // Crosswind pushes aircraft to the RIGHT -> Drift is RIGHT (+), Heading must be LEFT (-)
  const rawSinDrift = Math.max(-1, Math.min(1, crosswindKt / tasKt));
  const driftDeg = Math.round(((Math.asin(rawSinDrift) * 180) / Math.PI) * 10) / 10;
  // Heading = Track - Drift
  const headingDeg = Math.round((trackDeg - driftDeg + 360) % 360);
  // Groundspeed approximation: TAS * cos(drift) - headwind
  const gsKt = Math.round(tasKt * Math.cos((driftDeg * Math.PI) / 180) - headwindKt);

  // 1-in-60 Math
  const tkeDeg = Math.round(((xteNm * 60) / distFlownNm) * 10) / 10;
  const caDeg = Math.round(((xteNm * 60) / distToGoNm) * 10) / 10;
  const directHeadingChange = Math.round((tkeDeg + caDeg) * 10) / 10;
  const regainSameHeadingChange = Math.round((tkeDeg * 2) * 10) / 10;

  // Handle Diagnostic submission
  const handleDiagnosticSubmit = () => {
    // Q1: Track 090, TAS 180, Wind 040/40. (Wind from Left 50 deg).
    // Wind pushes Right -> Drift is Starboard/Right (+). Heading must be into wind -> Left/Less than 090.
    // Correct option: 1 (Heading < 090, Drift Right)
    const q1Choice = diagAnswers['diag-q1'];
    // Q2: 1-in-60: 30 NM flown, 2 NM Left, 60 NM to go.
    // TKE = 2*60/30 = 4 deg Right. CA = 2*60/60 = 2 deg Right. Total direct = 4 + 2 = +6 deg.
    // Correct option: 1 (+6 deg)
    const q2Choice = diagAnswers['diag-q2'];

    const q1Correct = q1Choice === 1;
    const q2Correct = q2Choice === 1;

    if (q1Correct && q2Correct) {
      setEvaluation({
        recommendationTriggered: false,
        rationale: null
      });
    } else {
      let misconception: any = 'MISCON_DRIFT_SIGN_INVERSION';
      if (q1Choice === 0) {
        misconception = 'MISCON_DRIFT_SIGN_INVERSION';
      } else if (q1Choice === 2) {
        misconception = 'MISCON_WIND_VECTOR_DIRECTION';
      } else if (q2Choice === 0) {
        misconception = 'MISCON_1_IN_60_CLOSING_ANGLE';
      }

      const evidence: StudentEvidenceRecord = {
        studentId: 'student-demo',
        questionId: 'Q_NAV_DRIFT_VECTOR_01',
        selectedOptionIndex: q1Choice !== undefined ? q1Choice : 0,
        isCorrect: false,
        timeSpentSeconds: 25,
        helpRequested: false,
        attemptNumber: 1,
        timestamp: new Date().toISOString()
      };

      const rationale = foundationEngine.generateRationale(
        'FND_WIND_TRIANGLE_DRFT',
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
    // Q1: Wind vector direction. Correct: 1 ("Direction FROM which wind blows")
    const q1Correct = assessmentAnswers[1] === 1;
    // Q2: 1-in-60 formula. Correct: 2 ("TKE + CA = 5° + 2.5° = 7.5°")
    const q2Correct = assessmentAnswers[2] === 2;

    if (q1Correct && q2Correct) {
      setStudentMasteryStatus('MASTERED');
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + 3);
      setNextReviewDate(scheduledDate.toLocaleDateString());
    } else {
      setStudentMasteryStatus('NEEDS_REVIEW');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Breadcrumb & Return Banner */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onChangeView(returnView)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800"
          >
            <ArrowLeft size={16} />
            <span>Return to {returnTitle}</span>
          </button>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              CLUSTER 2
            </span>
            <span className="text-xs font-bold text-slate-300 hidden md:inline">
              Wind Triangle & 1-in-60 Dead Reckoning
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <RegulatoryBadge authority="EASA" label="ECQB 2026 / 061 Gen Nav" />
        </div>
      </header>

      {/* Progress Step Navigation */}
      <div className="bg-slate-900/40 border-b border-slate-800/80 px-4 py-2.5 overflow-x-auto">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-1 text-[11px] min-w-[650px]">
          {[
            { id: 'READINESS_CHECK', label: '1. Diagnostic' },
            { id: 'RECOMMENDATION', label: '2. Analysis' },
            { id: 'QUICK_REMINDER', label: '3. 60s Recall' },
            { id: 'VECTOR_EXPLORER', label: '4. Vector Lab' },
            { id: 'SCENARIO_1_IN_60', label: '5. 1-in-60 Sandbox' },
            { id: 'ASSESSMENT', label: '6. Assessment' }
          ].map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setCurrentStage(step.id as Stage)}
              className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition-all text-center flex items-center justify-center gap-1.5 ${
                currentStage === step.id
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono ${
                currentStage === step.id ? 'bg-cyan-900 text-cyan-200' : 'bg-slate-800 text-slate-400'
              }`}>
                {idx + 1}
              </span>
              <span>{step.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 space-y-6">

        {/* ------------------------------------------------------------------ */}
        {/* STAGE 1: READINESS CHECK (DIAGNOSTIC) */}
        {/* ------------------------------------------------------------------ */}
        {currentStage === 'READINESS_CHECK' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
                  <Compass size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">General Navigation Readiness Check</h2>
                  <p className="text-xs text-slate-400">
                    Two rapid questions to determine if your wind vector and 1-in-60 mental models are exam-ready.
                  </p>
                </div>
              </div>

              {/* Question 1 */}
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-400">Question 1 of 2</span>
                  <span className="text-slate-500 font-mono">LO 061.01.03</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  You are tracking <strong className="text-cyan-300">090°(T)</strong> at <strong className="text-cyan-300">180 kt TAS</strong>. The wind is reported as <strong className="text-amber-300">040°/40 kt</strong>. What is the drift direction, and how does your required heading compare to your track?
                </p>
                <div className="grid grid-cols-1 gap-2 pt-2">
                  {[
                    'Drift is Left (Port); Required Heading is GREATER than 090°',
                    'Drift is Right (Starboard); Required Heading is LESS than 090° (Turn into wind)',
                    'Drift is Right (Starboard); Required Heading is GREATER than 090°',
                    'Drift is Zero because wind is at 45° to the track'
                  ].map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setDiagAnswers({ ...diagAnswers, 'diag-q1': i })}
                      className={`text-left p-3 rounded-xl border text-xs transition-all ${
                        diagAnswers['diag-q1'] === i
                          ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 font-semibold shadow-inner'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-mono mr-2 text-slate-500">{String.fromCharCode(65 + i)}.</span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-400">Question 2 of 2</span>
                  <span className="text-slate-500 font-mono">LO 061.02.01</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  Planned track is <strong className="text-cyan-300">180°</strong>. After <strong className="text-cyan-300">30 NM</strong> flown, your fix is <strong className="text-amber-300">2 NM Left of track</strong>. Exactly <strong className="text-cyan-300">60 NM</strong> remain to your destination. What heading adjustment is required to fly <strong className="text-emerald-300">DIRECT</strong> to destination?
                </p>
                <div className="grid grid-cols-1 gap-2 pt-2">
                  {[
                    'Turn 4° Right (TKE only — parallels the track)',
                    'Turn 6° Right (TKE 4° + Closing Angle 2° — intercepts destination)',
                    'Turn 6° Left (Turn into the track error)',
                    'Turn 8° Right (Double TKE — regains track in same distance flown)'
                  ].map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setDiagAnswers({ ...diagAnswers, 'diag-q2': i })}
                      className={`text-left p-3 rounded-xl border text-xs transition-all ${
                        diagAnswers['diag-q2'] === i
                          ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 font-semibold shadow-inner'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-mono mr-2 text-slate-500">{String.fromCharCode(65 + i)}.</span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={diagAnswers['diag-q1'] === undefined || diagAnswers['diag-q2'] === undefined}
                onClick={handleDiagnosticSubmit}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs tracking-wide transition-all shadow-lg shadow-cyan-950/30 disabled:opacity-40"
              >
                Submit Diagnostic for Instant Cognitive Analysis →
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STAGE 2: RECOMMENDATION & TRANSPARENT RATIONALE */}
        {/* ------------------------------------------------------------------ */}
        {currentStage === 'RECOMMENDATION' && evaluation && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl border ${
                  evaluation.recommendationTriggered
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                }`}>
                  {evaluation.recommendationTriggered ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Diagnostic Evaluation Result</h2>
                  <p className="text-xs text-slate-400">
                    {evaluation.recommendationTriggered
                      ? 'Targeted foundation refresher recommended based on distractor pattern.'
                      : 'Prerequisite mastery verified! You have fluent command of the wind triangle.'}
                  </p>
                </div>
              </div>

              {evaluation.rationale ? (
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-amber-400 uppercase tracking-wider font-bold">
                      Detected Misconception
                    </span>
                    <span className="text-slate-500 font-mono">
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
                    <strong className="text-amber-100">Aviation Consequence: </strong>
                    {evaluation.rationale.aviationPrincipleConsequence}
                  </p>
                </div>
              ) : (
                <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-5 space-y-2">
                  <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 size={16} /> Navigation Foundations Verified
                  </h3>
                  <p className="text-xs text-slate-300">
                    You demonstrated precise understanding of drift compensation and the 1-in-60 closing angle. You are cleared for advanced en-route flight planning.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setCurrentStage('QUICK_REMINDER')}
                  className="py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/30 transition-all"
                >
                  <Clock size={16} /> 60-Second Quick Recall (Tier 1)
                </button>
                <button
                  onClick={() => setCurrentStage('VECTOR_EXPLORER')}
                  className="py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/30 transition-all"
                >
                  <Compass size={16} /> Open Interactive Vector Lab (Tier 2)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STAGE 3: 60-SECOND QUICK RECALL */}
        {/* ------------------------------------------------------------------ */}
        {currentStage === 'QUICK_REMINDER' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-amber-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    60-Second Navigation Prerequisite Pill
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  Tier 1 Rapid Recall
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-cyan-400 uppercase font-mono">1. Vector Formula</div>
                  <div className="font-mono text-sm text-white bg-slate-900 p-2 rounded border border-slate-800 text-center">
                    Heading + Wind = Track
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Aircraft points on Heading at TAS. Wind pushes aircraft along. Resultant path is Track over ground at Ground Speed (GS).
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-emerald-400 uppercase font-mono">2. Drift vs WCA</div>
                  <div className="font-mono text-sm text-white bg-slate-900 p-2 rounded border border-slate-800 text-center">
                    Heading = Track - Drift
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Wind from Left pushes you Right (Starboard drift +). To stay on track, you must turn LEFT into the wind: subtract drift from track.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-purple-400 uppercase font-mono">3. 1-in-60 Direct</div>
                  <div className="font-mono text-sm text-white bg-slate-900 p-2 rounded border border-slate-800 text-center">
                    ΔHDG = TKE + CA
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    TKE = (XTE × 60) / Flown.<br />
                    CA = (XTE × 60) / ToGo.<br />
                    TKE only parallels track; you must add CA to reach destination!
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setCurrentStage('VECTOR_EXPLORER')}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950/20"
                >
                  Proceed to Interactive Vector Lab →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STAGE 4: INTERACTIVE VECTOR LAB */}
        {/* ------------------------------------------------------------------ */}
        {currentStage === 'VECTOR_EXPLORER' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Compass size={20} className="text-cyan-400" />
                  <div>
                    <h2 className="text-base font-bold text-white">Tactical Wind Triangle Vector Lab</h2>
                    <p className="text-xs text-slate-400">
                      Manipulate planned track, TAS, and ambient wind to observe live drift angles and groundspeed scaling.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800">
                  LO 061.01.03
                </span>
              </div>

              {/* Pre-Simulation Prediction */}
              {!predictionSubmitted ? (
                <div className="p-4 bg-cyan-950/30 border border-cyan-500/30 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                    <Sparkles size={16} /> Pre-Simulation Prediction Challenge
                  </div>
                  <p className="text-xs text-slate-200">
                    If Planned Track is <strong className="text-cyan-300">090°</strong> and Wind is from <strong className="text-amber-300">030°/40 kt</strong> (blowing from your left), will drift angle be to the <strong className="text-white">LEFT (Port)</strong> or <strong className="text-white">RIGHT (Starboard)</strong>?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPredictionDrift('LEFT')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                        predictionDrift === 'LEFT' ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-slate-900 text-slate-300 border-slate-800'
                      }`}
                    >
                      Port (Left)
                    </button>
                    <button
                      onClick={() => setPredictionDrift('RIGHT')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                        predictionDrift === 'RIGHT' ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-slate-900 text-slate-300 border-slate-800'
                      }`}
                    >
                      Starboard (Right)
                    </button>
                    <button
                      disabled={!predictionDrift}
                      onClick={() => setPredictionSubmitted(true)}
                      className="ml-auto px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold disabled:opacity-40"
                    >
                      Verify Prediction →
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                  predictionDrift === 'RIGHT' ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                }`}>
                  <span>
                    {predictionDrift === 'RIGHT'
                      ? '✓ Correct! Wind from 030° blows towards 210°, carrying the aircraft to the RIGHT.'
                      : '✗ Note: Wind from 030° pushes the aircraft to the RIGHT (Starboard). Heading must point LEFT.'}
                  </span>
                  <button onClick={() => setPredictionSubmitted(false)} className="underline text-slate-400 text-[10px]">
                    Reset
                  </button>
                </div>
              )}

              {/* Vector Visualization & Sliders */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                {/* SVG Visualizer Canvas */}
                <div className="lg:col-span-6 bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col items-center justify-center relative min-h-[300px]">
                  <svg viewBox="-150 -150 300 300" className="w-full max-w-[280px] h-auto">
                    {/* Compass Rose Ring */}
                    <circle cx="0" cy="0" r="120" fill="none" stroke="#1e293b" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="80" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 3" />
                    <line x1="0" y1="-125" x2="0" y2="125" stroke="#334155" strokeWidth="1" />
                    <line x1="-125" y1="0" x2="125" y2="0" stroke="#334155" strokeWidth="1" />
                    
                    {/* Cardinal Labels */}
                    <text x="0" y="-130" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">360°</text>
                    <text x="135" y="4" textAnchor="start" fill="#64748b" fontSize="10" fontFamily="monospace">090°</text>
                    <text x="0" y="140" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">180°</text>
                    <text x="-135" y="4" textAnchor="end" fill="#64748b" fontSize="10" fontFamily="monospace">270°</text>

                    {/* Vector 1: Heading Vector (Green) */}
                    {(() => {
                      const hRad = ((headingDeg - 90) * Math.PI) / 180;
                      const hLen = 90;
                      const hx = hLen * Math.cos(hRad);
                      const hy = hLen * Math.sin(hRad);
                      return (
                        <g>
                          <line x1="0" y1="0" x2={hx} y2={hy} stroke="#10b981" strokeWidth="2.5" />
                          <circle cx={hx} cy={hy} r="3" fill="#10b981" />
                        </g>
                      );
                    })()}

                    {/* Vector 2: Wind Vector (Amber) */}
                    {(() => {
                      const hRad = ((headingDeg - 90) * Math.PI) / 180;
                      const hLen = 90;
                      const hx = hLen * Math.cos(hRad);
                      const hy = hLen * Math.sin(hRad);

                      // Wind blows FROM windDirDeg towards (windDirDeg + 180)
                      const blowDirDeg = (windDirDeg + 180) % 360;
                      const wRad = ((blowDirDeg - 90) * Math.PI) / 180;
                      const wLen = (windSpeedKt / 80) * 50;
                      const wx = hx + wLen * Math.cos(wRad);
                      const wy = hy + wLen * Math.sin(wRad);
                      return (
                        <g>
                          <line x1={hx} y1={hy} x2={wx} y2={wy} stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" />
                          <circle cx={wx} cy={wy} r="3" fill="#f59e0b" />
                        </g>
                      );
                    })()}

                    {/* Vector 3: Resultant Track Vector (Cyan) */}
                    {(() => {
                      const tRad = ((trackDeg - 90) * Math.PI) / 180;
                      const tLen = (gsKt / 300) * 110;
                      const tx = tLen * Math.cos(tRad);
                      const ty = tLen * Math.sin(tRad);
                      return (
                        <g>
                          <line x1="0" y1="0" x2={tx} y2={ty} stroke="#06b6d4" strokeWidth="3" />
                          <polygon
                            points={`${tx},${ty} ${tx - 6},${ty - 4} ${tx - 6},${ty + 4}`}
                            fill="#06b6d4"
                            transform={`rotate(${trackDeg - 90} ${tx} ${ty})`}
                          />
                        </g>
                      );
                    })()}
                  </svg>

                  {/* Legend */}
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-3 text-[10px] font-mono">
                    <span className="text-emerald-400">● Heading {headingDeg}° / {tasKt} kt</span>
                    <span className="text-amber-400">● Wind {windDirDeg}° / {windSpeedKt} kt</span>
                    <span className="text-cyan-400">● Track {trackDeg}° / {gsKt} kt GS</span>
                  </div>
                </div>

                {/* Tactical Parameters Controls */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Planned Track (TR):</span>
                      <span className="font-mono text-cyan-400 font-bold">{trackDeg}°(T)</span>
                    </div>
                    <AccessibleSlider
                      label="Planned Track"
                      value={trackDeg}
                      min={0}
                      max={359}
                      step={5}
                      unit="°"
                      onChange={setTrackDeg}
                    />
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">True Airspeed (TAS):</span>
                      <span className="font-mono text-emerald-400 font-bold">{tasKt} kts</span>
                    </div>
                    <AccessibleSlider
                      label="True Airspeed"
                      value={tasKt}
                      min={100}
                      max={300}
                      step={10}
                      unit=" kts"
                      onChange={setTasKt}
                    />
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Wind Direction (FROM):</span>
                      <span className="font-mono text-amber-400 font-bold">{windDirDeg}°</span>
                    </div>
                    <AccessibleSlider
                      label="Wind Direction"
                      value={windDirDeg}
                      min={0}
                      max={359}
                      step={10}
                      unit="°"
                      onChange={setWindDirDeg}
                    />
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Wind Speed:</span>
                      <span className="font-mono text-amber-400 font-bold">{windSpeedKt} kts</span>
                    </div>
                    <AccessibleSlider
                      label="Wind Speed"
                      value={windSpeedKt}
                      min={0}
                      max={80}
                      step={5}
                      unit=" kts"
                      onChange={setWindSpeedKt}
                    />
                  </div>
                </div>
              </div>

              {/* Solution Metrics Pill */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950 rounded-xl border border-cyan-900/30 text-center">
                <div>
                  <div className="text-[10px] text-slate-500 font-mono uppercase">Drift Angle</div>
                  <div className={`text-base font-black font-mono ${driftDeg >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {driftDeg >= 0 ? `+${driftDeg}° (R)` : `${driftDeg}° (L)`}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-mono uppercase">Required Heading</div>
                  <div className="text-base font-black font-mono text-cyan-300">
                    {headingDeg}°(T)
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-mono uppercase">Crosswind</div>
                  <div className="text-base font-black font-mono text-slate-200">
                    {Math.abs(Math.round(crosswindKt))} kts
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-mono uppercase">Ground Speed (GS)</div>
                  <div className="text-base font-black font-mono text-purple-300">
                    {gsKt} kts
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setCurrentStage('SCENARIO_1_IN_60')}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950/20"
                >
                  Proceed to 1-in-60 Off-Track Recovery →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STAGE 5: 1-IN-60 SCENARIO & RECOVERY */}
        {/* ------------------------------------------------------------------ */}
        {currentStage === 'SCENARIO_1_IN_60' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Navigation size={20} className="text-emerald-400" />
                  <div>
                    <h2 className="text-base font-bold text-white">Mental Dead Reckoning: 1-in-60 Off-Track Recovery</h2>
                    <p className="text-xs text-slate-400">
                      North Sea Transit: Fix shows aircraft drifted off track. Choose your tactical recovery strategy.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
                  LO 061.02.01
                </span>
              </div>

              {/* Scenario Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Distance Flown:</span>
                    <span className="font-mono text-cyan-400 font-bold">{distFlownNm} NM</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    step={10}
                    value={distFlownNm}
                    onChange={(e) => setDistFlownNm(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Cross-Track Error (XTE):</span>
                    <span className="font-mono text-amber-400 font-bold">{xteNm} NM {offTrackDirection}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={0.5}
                    value={xteNm}
                    onChange={(e) => setXteNm(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Distance Remaining:</span>
                    <span className="font-mono text-purple-400 font-bold">{distToGoNm} NM</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={120}
                    step={10}
                    value={distToGoNm}
                    onChange={(e) => setDistToGoNm(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>
              </div>

              {/* Mathematical Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-cyan-400 uppercase font-mono">
                    Step 1: Track Error Angle (TKE)
                  </div>
                  <div className="font-mono text-xs text-slate-300">
                    TKE = (XTE × 60) / Dist Flown = ({xteNm} × 60) / {distFlownNm} = <strong className="text-cyan-400 text-sm">{tkeDeg}°</strong>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Applying {tkeDeg}° {offTrackDirection === 'RIGHT' ? 'Left' : 'Right'} prevents drifting further off track (parallels original track).
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-purple-400 uppercase font-mono">
                    Step 2: Closing Angle (CA)
                  </div>
                  <div className="font-mono text-xs text-slate-300">
                    CA = (XTE × 60) / Dist To Go = ({xteNm} × 60) / {distToGoNm} = <strong className="text-purple-400 text-sm">{caDeg}°</strong>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Additional angle required to converge upon and intercept the destination waypoint.
                  </p>
                </div>
              </div>

              {/* Recovery Decisions */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Select Navigation Decision:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setSelectedRecoveryStrategy('PARALLEL')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      selectedRecoveryStrategy === 'PARALLEL'
                        ? 'bg-amber-950/60 border-amber-500 text-amber-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-white mb-1">A. Parallel Track Only</div>
                    <div>Change Heading by <strong>{tkeDeg}°</strong></div>
                    <div className="text-[10px] text-amber-300/80 mt-1">Leaves aircraft {xteNm} NM off track at destination!</div>
                  </button>

                  <button
                    onClick={() => setSelectedRecoveryStrategy('DIRECT')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      selectedRecoveryStrategy === 'DIRECT'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-white mb-1">B. Direct to Destination</div>
                    <div>Change Heading by <strong>{directHeadingChange}°</strong> (TKE + CA)</div>
                    <div className="text-[10px] text-emerald-300/80 mt-1">Arrives exactly over destination waypoint!</div>
                  </button>

                  <button
                    onClick={() => setSelectedRecoveryStrategy('REGAIN_SAME')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      selectedRecoveryStrategy === 'REGAIN_SAME'
                        ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-white mb-1">C. Regain in Same Distance</div>
                    <div>Change Heading by <strong>{regainSameHeadingChange}°</strong> (2 × TKE)</div>
                    <div className="text-[10px] text-cyan-300/80 mt-1">Back on centerline in {distFlownNm} NM, then fly track.</div>
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setCurrentStage('ASSESSMENT')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/20"
                >
                  Proceed to Independent Mastery Assessment →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STAGE 6: ASSESSMENT & SPACED RETENTION */}
        {/* ------------------------------------------------------------------ */}
        {currentStage === 'ASSESSMENT' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Shield size={20} className="text-emerald-400" />
                  <div>
                    <h2 className="text-base font-bold text-white">Closed-Book Foundation Assessment</h2>
                    <p className="text-xs text-slate-400">
                      Demonstrate unassisted mastery to earn credit and schedule your first spaced retrieval review.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Passing: 100%
                </span>
              </div>

              {!assessmentSubmitted ? (
                <div className="space-y-5">
                  {/* Q1 */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                    <div className="text-xs font-bold text-cyan-400">Question 1</div>
                    <p className="text-xs text-slate-200">
                      In aeronautical flight planning and meteorology, an announced wind of <strong className="text-white">240°/30 kt</strong> means:
                    </p>
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {[
                        'The air is moving towards bearing 240° at 30 knots',
                        'The air is moving FROM bearing 240° towards 060° at 30 knots',
                        'The wind vector points into the southwest quadrant with 30 NM range'
                      ].map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => setAssessmentAnswers({ ...assessmentAnswers, 1: i })}
                          className={`text-left p-3 rounded-lg border text-xs transition-all ${
                            assessmentAnswers[1] === i
                              ? 'bg-cyan-950 border-cyan-500 text-cyan-200'
                              : 'bg-slate-900 border-slate-800 text-slate-300'
                          }`}
                        >
                          {String.fromCharCode(65 + i)}. {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q2 */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                    <div className="text-xs font-bold text-cyan-400">Question 2</div>
                    <p className="text-xs text-slate-200">
                      An aircraft has flown 60 NM and is 5 NM left of planned track. 120 NM remain to destination. What total heading change is needed to fly direct to destination?
                    </p>
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {[
                        '5° Right (TKE only)',
                        '2.5° Right (Closing Angle only)',
                        '7.5° Right (TKE 5° + CA 2.5°)',
                        '10° Right (Double TKE)'
                      ].map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => setAssessmentAnswers({ ...assessmentAnswers, 2: i })}
                          className={`text-left p-3 rounded-lg border text-xs transition-all ${
                            assessmentAnswers[2] === i
                              ? 'bg-cyan-950 border-cyan-500 text-cyan-200'
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
                          ? '100% Score — Wind Triangle & 1-in-60 Mastered!'
                          : 'Review Recommended — Partial Score'}
                      </h3>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300">
                      {studentMasteryStatus === 'MASTERED'
                        ? 'Evidence recorded to your persistent profile. Your demonstrated competence in wind triangle vector addition and 1-in-60 off-track corrections has been scheduled into the Spaced Retention System.'
                        : 'Some answers were incorrect. We recommend reviewing the Tactical Vector Lab before re-attempting.'}
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

export default NavigationTriangleChain;
