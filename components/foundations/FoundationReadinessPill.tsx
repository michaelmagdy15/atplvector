import React, { useState, useEffect } from 'react';
import { View } from '../../types';
import {
  CheckCircle2, AlertTriangle, HelpCircle, Sparkles, X,
  Clock, Gauge, ArrowRight, ExternalLink, ShieldCheck, RefreshCw
} from 'lucide-react';
import {
  FoundationConceptId,
  FOUNDATION_CONCEPT_CATALOG,
  foundationEngine,
  StudentConceptState
} from '../../services/foundationRecommendationEngine';
import { learningStorage } from '../../lib/learningSystem/storage';
import AltimeterQuickReminderCard from '../altimetry/AltimeterQuickReminderCard';
import AltimeterGauge from '../altimetry/AltimeterGauge';
import PressureChamberVisualizer from '../altimetry/PressureChamberVisualizer';

interface Props {
  conceptId: FoundationConceptId;
  targetLO?: string;
  onNavigateToFullChain?: (view: View) => void;
  className?: string;
}

export const FoundationReadinessPill: React.FC<Props> = ({
  conceptId,
  targetLO,
  onNavigateToFullChain,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'REMINDER' | 'INTERACTIVE'>('REMINDER');
  const [conceptState, setConceptState] = useState<StudentConceptState | null>(null);

  // In-modal interactive sandbox state
  const [modalElevation, setModalElevation] = useState(4000);
  const [modalQnh, setModalQnh] = useState(1013);
  const [modalOat, setModalOat] = useState(25);

  const conceptDef = FOUNDATION_CONCEPT_CATALOG[conceptId] || {
    id: conceptId,
    name: 'Essential Foundation Principle',
    domain: 'Meteorology',
    description: 'Prerequisite aerodynamic and barometric principles governing this ATPL topic.',
    prerequisites: [],
    targetLearningObjectives: [targetLO || '050.01.06'],
    defaultStabilityDays: 7
  };

  useEffect(() => {
    const rawState = learningStorage.getConceptState(conceptId);
    if (rawState) {
      // Map storage state if needed
      setConceptState({
        studentId: rawState.studentId,
        conceptId: conceptId,
        status: rawState.status === 'DEMONSTRATED' || rawState.status === 'RETAINED' 
          ? 'demonstrated_independently' 
          : rawState.status === 'MISCONCEPTION_FLAGGED'
            ? 'needs_foundation'
            : 'unknown',
        consecutiveIndependentCorrect: rawState.consecutiveIndependentSuccesses || 0,
        consecutiveFailures: 0,
        totalAttempts: rawState.attemptsCount || 0,
        totalSuccesses: rawState.attemptsCount || 0,
        lastEvidenceTimestamp: rawState.lastAssessedAt || new Date().toISOString(),
        stabilityDays: 7,
        detectedMisconceptions: [],
        bypassGranted: rawState.status === 'DEMONSTRATED',
        history: []
      });
    }
  }, [conceptId, isOpen]);

  const isMastered = conceptState?.status === 'demonstrated_independently' || conceptState?.status === 'retained';
  const needsRefresher = conceptState?.status === 'needs_foundation';

  return (
    <>
      {/* Trigger Pill */}
      <button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-sm backdrop-blur-md ${
          isMastered
            ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
            : needsRefresher
              ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40 animate-pulse'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
        } ${className}`}
        title={`Prerequisite readiness for ${conceptDef.name}`}
      >
        {isMastered ? (
          <CheckCircle2 size={13} className="text-emerald-500" />
        ) : needsRefresher ? (
          <AlertTriangle size={13} className="text-amber-500" />
        ) : (
          <Sparkles size={13} className="text-cyan-500" />
        )}

        <span className="truncate max-w-[200px]">
          {isMastered
            ? 'Prerequisite Verified'
            : needsRefresher
              ? 'Prerequisite Recall (60s)'
              : 'Prerequisite Check'}
        </span>

        <span className="text-[10px] font-mono opacity-60">
          {targetLO || conceptDef.targetLearningObjectives[0] || 'FND'}
        </span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${
                  isMastered 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                }`}>
                  <Gauge size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                      {conceptDef.domain} Foundation
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      LO {targetLO || conceptDef.targetLearningObjectives.join(', ')}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {conceptDef.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-800 bg-slate-950/40 text-xs">
              <button
                onClick={() => setModalTab('REMINDER')}
                className={`pb-2.5 px-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
                  modalTab === 'REMINDER'
                    ? 'text-cyan-400 border-cyan-400'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                <Clock size={14} /> 60-Second Quick Recall
              </button>
              <button
                onClick={() => setModalTab('INTERACTIVE')}
                className={`pb-2.5 px-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
                  modalTab === 'INTERACTIVE'
                    ? 'text-cyan-400 border-cyan-400'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                <Gauge size={14} /> In-Lesson Sandbox
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              {modalTab === 'REMINDER' ? (
                <div className="space-y-4">
                  <AltimeterQuickReminderCard 
                    onOpenGuidedLab={() => setModalTab('INTERACTIVE')}
                  />
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5">
                    <div className="font-bold text-slate-200 flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-emerald-400" />
                      Why is this foundation required here?
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      {conceptDef.description} Without fluid recall of barometric compression and temperature divergence, high-altitude takeoff distances and cruise true airspeeds will appear counter-intuitive.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <AltimeterGauge 
                        indicatedAltitudeFt={modalElevation + (modalQnh - 1013) * 27}
                        subscaleHpa={modalQnh}
                        onSubscaleChange={setModalQnh}
                        size={210}
                      />
                      <span className="text-[11px] text-slate-400 mt-2 font-mono">
                        Drag dial or scroll to adjust QNH
                      </span>
                    </div>
                    <div className="space-y-3">
                      <PressureChamberVisualizer 
                        ambientPressureHpa={modalQnh}
                        capsuleExpansionRatio={1013 / modalQnh}
                        needleAngleDegrees={((modalElevation / 1000) * 360) % 360}
                      />
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Elevation:</span>
                          <span className="font-mono text-cyan-400 font-bold">{modalElevation.toLocaleString()} ft</span>
                        </div>
                        <input 
                          type="range"
                          min={0}
                          max={10000}
                          step={500}
                          value={modalElevation}
                          onChange={(e) => setModalElevation(Number(e.target.value))}
                          className="w-full accent-cyan-500"
                        />
                        <div className="flex justify-between">
                          <span className="text-slate-400">QNH Subscale:</span>
                          <span className="font-mono text-cyan-400 font-bold">{modalQnh} hPa</span>
                        </div>
                        <input 
                          type="range"
                          min={950}
                          max={1050}
                          step={1}
                          value={modalQnh}
                          onChange={(e) => setModalQnh(Number(e.target.value))}
                          className="w-full accent-cyan-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {isMastered ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 size={13} /> Retention interval scheduled
                  </span>
                ) : (
                  'Take 60s to refresh without losing your lesson progress'
                )}
              </span>

              <div className="flex items-center gap-2">
                {onNavigateToFullChain && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onNavigateToFullChain(View.FOUNDATION_ATM_PERF_CHAIN);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    Open Full 6-Stage Chain <ExternalLink size={13} />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-950/20"
                >
                  Return to Lesson
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default FoundationReadinessPill;
