/**
 * ============================================================================
 * Foundation Learning System - State Machine & Cognitive Transition Logic
 * ============================================================================
 *
 * Implements deterministic cognitive state transitions and spaced repetition
 * scheduling (modified SM-2 algorithm) for aviation concepts.
 */

import {
  ConceptId,
  StudentConceptState,
  ConceptMasteryStatus,
  EvidenceRecord,
  DelayedReviewSchedule,
  ReviewGrade,
  RecommendationRecord,
  RecommendationTrigger,
  RecommendationPriority,
  AssessmentEvidenceType,
  AssistanceUsageLevel,
} from './types';

// ============================================================================
// 1. DEFAULT FACTORIES
// ============================================================================

export function createDefaultConceptState(conceptId: ConceptId): StudentConceptState {
  return {
    conceptId,
    status: 'NOT_STARTED',
    confidence: 0.0,
    lastEvidence: null,
    assistanceUsed: {
      hintsCount: 0,
      reasoningChainsUsed: 0,
      explanationsViewed: 0,
    },
    attempts: {
      total: 0,
      unassisted: 0,
      assisted: 0,
      correctUnassisted: 0,
      correctAssisted: 0,
    },
    nextReview: null,
    history: [],
    updatedAt: new Date().toISOString(),
  };
}

export function createDefaultReviewSchedule(conceptId: ConceptId): DelayedReviewSchedule {
  return {
    conceptId,
    intervalDays: 1,
    easeFactor: 2.5,
    repetitions: 0,
    dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    lapses: 0,
    reviewLog: [],
  };
}

// ============================================================================
// 2. SPACED REPETITION ENGINE (SM-2 / COGNITIVE DECAY)
// ============================================================================

/**
 * Calculates the next review schedule based on the SM-2 algorithm.
 * Grades:
 *   5 - Perfect retrieval
 *   4 - Correct after hesitation
 *   3 - Correct with substantial effort
 *   2 - Incorrect; familiar upon seeing answer
 *   1 - Incorrect; severe difficulty
 *   0 - Complete blackout
 */
export function calculateNextReviewSchedule(
  current: DelayedReviewSchedule,
  grade: ReviewGrade,
  reviewTimestamp: string = new Date().toISOString()
): { schedule: DelayedReviewSchedule; isRetained: boolean } {
  let { intervalDays, easeFactor, repetitions, lapses } = current;
  const isRetained = grade >= 3;

  if (isRetained) {
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 3; // ATPLVector accelerated early interval (1d -> 3d -> 7d)
    } else if (repetitions === 2) {
      intervalDays = 7;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    repetitions += 1;
  } else {
    // Retention lapse: reset interval to 1 day and increment lapse counter
    repetitions = 0;
    intervalDays = 1;
    lapses += 1;
  }

  // Calculate new Ease Factor: EF' = EF + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
  const newEaseFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
  );

  const reviewDate = new Date(reviewTimestamp);
  const nextDueDate = new Date(reviewDate.getTime() + intervalDays * 24 * 60 * 60 * 1000);

  const updatedLog = [
    ...(current.reviewLog || []),
    {
      reviewedAt: reviewTimestamp,
      grade,
      intervalDays,
      easeFactor: Number(newEaseFactor.toFixed(3)),
    },
  ];

  return {
    isRetained,
    schedule: {
      conceptId: current.conceptId,
      intervalDays,
      easeFactor: Number(newEaseFactor.toFixed(3)),
      repetitions,
      dueAt: nextDueDate.toISOString(),
      lastReviewedAt: reviewTimestamp,
      lapses,
      reviewLog: updatedLog.slice(-50), // keep last 50 reviews
    },
  };
}

// ============================================================================
// 3. COGNITIVE STATE TRANSITION MATRIX
// ============================================================================

export type LearningSystemAction =
  | {
      type: 'RECORD_LESSON_EXPOSURE';
      conceptId: ConceptId;
      timestamp?: string;
    }
  | {
      type: 'EVALUATE_ASSESSMENT';
      conceptId: ConceptId;
      assessmentId: string;
      evidenceType: AssessmentEvidenceType;
      score: number;
      passed: boolean;
      assistanceLevel: AssistanceUsageLevel;
      timeSpentSeconds: number;
      diagnosedMisconceptions?: string[];
      timestamp?: string;
    }
  | {
      type: 'RECORD_SPACED_REVIEW';
      conceptId: ConceptId;
      grade: ReviewGrade;
      timestamp?: string;
    }
  | {
      type: 'FLAG_MISCONCEPTION';
      conceptId: ConceptId;
      misconceptionId: string;
      timestamp?: string;
    }
  | {
      type: 'RESOLVE_MISCONCEPTION';
      conceptId: ConceptId;
      misconceptionId: string;
      timestamp?: string;
    };

/**
 * Pure transition function for StudentConceptState.
 */
export function transitionConceptState(
  currentState: StudentConceptState,
  action: LearningSystemAction
): {
  nextState: StudentConceptState;
  scheduleUpdate?: DelayedReviewSchedule;
  generatedRecommendation?: Partial<RecommendationRecord>;
} {
  const timestamp = ('timestamp' in action && action.timestamp) ? action.timestamp : new Date().toISOString();
  const prevStatus = currentState.status;
  let nextStatus: ConceptMasteryStatus = prevStatus;
  let nextConfidence = currentState.confidence;
  let scheduleUpdate: DelayedReviewSchedule | undefined = undefined;
  let generatedRecommendation: Partial<RecommendationRecord> | undefined = undefined;

  const newAttempts = { ...currentState.attempts };
  const newAssistance = { ...currentState.assistanceUsed };
  let lastEvidence: EvidenceRecord | null = currentState.lastEvidence;

  switch (action.type) {
    case 'RECORD_LESSON_EXPOSURE': {
      if (prevStatus === 'NOT_STARTED') {
        nextStatus = 'INTRODUCED';
        nextConfidence = 0.2; // Baseline exposure confidence
      }
      break;
    }

    case 'EVALUATE_ASSESSMENT': {
      newAttempts.total += 1;
      const isUnassisted = action.assistanceLevel === 'NONE';

      if (isUnassisted) {
        newAttempts.unassisted += 1;
        if (action.passed) newAttempts.correctUnassisted += 1;
      } else {
        newAttempts.assisted += 1;
        if (action.passed) newAttempts.correctAssisted += 1;
        if (action.assistanceLevel === 'HINT') newAssistance.hintsCount += 1;
        if (action.assistanceLevel === 'REASONING_CHAIN') newAssistance.reasoningChainsUsed += 1;
        if (action.assistanceLevel === 'EXPLANATION_VIEWED') newAssistance.explanationsViewed += 1;
        newAssistance.lastAssistedAt = timestamp;
      }

      lastEvidence = {
        evidenceId: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp,
        assessmentId: action.assessmentId,
        evidenceType: action.evidenceType,
        score: action.score,
        passed: action.passed,
        assistanceLevel: action.assistanceLevel,
        timeSpentSeconds: action.timeSpentSeconds,
        triggeredMisconceptions: action.diagnosedMisconceptions,
      };

      // Diagnostic Misconceptions have highest priority
      if (action.diagnosedMisconceptions && action.diagnosedMisconceptions.length > 0) {
        nextStatus = 'MISCONCEPTION_FLAGGED';
        nextConfidence = Math.max(0.1, currentState.confidence * 0.5);
        generatedRecommendation = {
          triggeredBy: 'MISCONCEPTION_DETECTED',
          priority: 'CRITICAL_BLOCKER',
          reason: `A diagnostic misconception was detected during practice. Review foundational concept guidance before proceeding.`,
        };
      } else if (action.passed) {
        if (isUnassisted) {
          // Independent unassisted performance demonstrated!
          nextStatus = 'DEMONSTRATED';
          // Bayesian confidence update
          nextConfidence = Math.min(0.95, currentState.confidence * 0.4 + 0.6);

          // Initialize spaced review schedule if not already scheduled
          if (!currentState.nextReview) {
            const initialSchedule = createDefaultReviewSchedule(currentState.conceptId);
            scheduleUpdate = initialSchedule;
          }
        } else {
          // Assisted performance: demonstrates proximal understanding, not yet independent
          nextStatus = 'ASSISTED';
          nextConfidence = Math.min(0.65, currentState.confidence * 0.5 + 0.35);
          generatedRecommendation = {
            triggeredBy: 'ASSISTED_TO_INDEPENDENT',
            priority: 'HIGH',
            reason: `Concept demonstrated with assistance/hints. Attempt an unassisted practice test to confirm independent mastery.`,
          };
        }
      } else {
        // Failed attempt
        if (prevStatus === 'DEMONSTRATED' || prevStatus === 'RETAINED') {
          nextStatus = 'LAPSED';
        }
        nextConfidence = Math.max(0.1, currentState.confidence * 0.6);
      }
      break;
    }

    case 'RECORD_SPACED_REVIEW': {
      const isRetained = action.grade >= 3;
      if (isRetained) {
        nextStatus = 'RETAINED';
        nextConfidence = Math.min(1.0, currentState.confidence * 0.2 + 0.8);
      } else {
        nextStatus = 'LAPSED';
        nextConfidence = Math.max(0.2, currentState.confidence * 0.4);
        generatedRecommendation = {
          triggeredBy: 'DELAYED_REVIEW_DUE',
          priority: 'HIGH',
          reason: `Memory retrieval lapse detected on scheduled review. Quick remediation required to reinforce retention.`,
        };
      }
      break;
    }

    case 'FLAG_MISCONCEPTION': {
      nextStatus = 'MISCONCEPTION_FLAGGED';
      nextConfidence = Math.max(0.1, currentState.confidence * 0.5);
      break;
    }

    case 'RESOLVE_MISCONCEPTION': {
      // Once remediated, return to introduced or assisted awaiting demonstration
      nextStatus = newAttempts.correctUnassisted > 0 ? 'DEMONSTRATED' : 'INTRODUCED';
      nextConfidence = Math.min(0.7, currentState.confidence + 0.3);
      break;
    }
  }

  const nextHistory = [
    ...(currentState.history || []),
    {
      timestamp,
      previousStatus: prevStatus,
      newStatus: nextStatus,
      triggerEvidenceId: lastEvidence ? lastEvidence.evidenceId : 'manual_transition',
      confidenceAfter: Number(nextConfidence.toFixed(2)),
    },
  ].slice(-20); // Keep last 20 transitions

  const nextState: StudentConceptState = {
    ...currentState,
    status: nextStatus,
    confidence: Number(nextConfidence.toFixed(2)),
    lastEvidence,
    assistanceUsed: newAssistance,
    attempts: newAttempts,
    nextReview: scheduleUpdate ? scheduleUpdate.dueAt : currentState.nextReview,
    history: nextHistory,
    updatedAt: timestamp,
  };

  return { nextState, scheduleUpdate, generatedRecommendation };
}
