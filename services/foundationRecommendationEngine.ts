/**
 * ATPLVector Foundation Recommendation & Diagnostic Rules Engine
 * 
 * Deterministic, explainable, rule-based recommendation engine for student
 * diagnostic evaluation, misconception detection, cognitive error discrimination,
 * state machine progression, and transparent rationale generation.
 */

import { View } from '../types';

// ============================================================================
// 1. DOMAIN IDENTIFIERS & FOUNDATION CONCEPTS
// ============================================================================

export type FoundationConceptId =
  | 'FND_BARO_PRESSURE_DATUM'      // QNH vs QFE vs Standard 1013.25 datum planes
  | 'FND_PRESSURE_LAPSE'           // Barometric lapse rate (27-30 ft/hPa) & subscale mechanics
  | 'FND_ISA_MODEL'                // International Standard Atmosphere & Delta-ISA deviation
  | 'FND_ALTIMETER_TEMP_ERR'       // Altimeter temperature error correction & true altitude
  | 'FND_AIR_DENSITY_EFFECT'       // Dynamic pressure q=1/2*rho*v^2, IAS/CAS/EAS/TAS density scaling
  | 'FND_ALTIMETER_SUBSCALE_RULE'  // High-to-low pressure altimeter over-reading rule
  | 'FND_CG_MOMENT_ARM'            // Center of gravity, datum, arm, and moment principles
  | 'FND_LIFT_WEIGHT_LOAD_FACTOR'  // Aerodynamic load factor (n=1/cos phi) & accelerated stall
  | 'FND_WIND_TRIANGLE_DRFT'       // Track, Heading, Drift, and Vector Wind addition
  | 'FND_ONE_IN_SIXTY_RULE'        // 1-in-60 rule, track error angle, closing angle & off-track corrections
  | 'FND_CALCULATION_PRECISION';   // Mental math rounding, unit conversions & arithmetic hygiene

export interface FoundationConceptDefinition {
  id: FoundationConceptId;
  name: string;
  domain: 'Meteorology' | 'Instruments' | 'Principles of Flight' | 'Mass & Balance' | 'General Navigation' | 'Cross-Disciplinary';
  description: string;
  prerequisites: FoundationConceptId[];
  targetLearningObjectives: string[];
  recommendedView?: View;
  visualLabId?: string;
  defaultStabilityDays: number;
}

export const FOUNDATION_CONCEPT_CATALOG: Record<FoundationConceptId, FoundationConceptDefinition> = {
  FND_BARO_PRESSURE_DATUM: {
    id: 'FND_BARO_PRESSURE_DATUM',
    name: 'Barometric Pressure Datums (QNH vs QFE vs STD)',
    domain: 'Meteorology',
    description: 'Understanding mean sea level (MSL / QNH), aerodrome elevation (QFE), and 1013.25 hPa standard pressure planes.',
    prerequisites: [],
    targetLearningObjectives: ['050.01.06', '022.02.02', '010.05.04'],
    recommendedView: View.ALTIMETER,
    visualLabId: 'AltimeterVisualizer',
    defaultStabilityDays: 7
  },
  FND_PRESSURE_LAPSE: {
    id: 'FND_PRESSURE_LAPSE',
    name: 'Hydrostatic Pressure Lapse Rate & Subscale Mechanics',
    domain: 'Instruments',
    description: 'The standard lapse rate of 27 to 30 ft/hPa in the lower troposphere and how subscale adjustments mechanically shift the aneroid needle.',
    prerequisites: ['FND_BARO_PRESSURE_DATUM'],
    targetLearningObjectives: ['050.01.06', '022.02.02'],
    recommendedView: View.ALTIMETER,
    visualLabId: 'AltimeterLab',
    defaultStabilityDays: 7
  },
  FND_ISA_MODEL: {
    id: 'FND_ISA_MODEL',
    name: 'International Standard Atmosphere (ISA) & Temperature Deviation',
    domain: 'Meteorology',
    description: 'MSL baseline (+15°C, 1013.25 hPa, 1.225 kg/m³) with 1.98°C/1000 ft lapse rate. Discriminating absolute temperature from ISA deviation (Delta-ISA).',
    prerequisites: [],
    targetLearningObjectives: ['050.01.05', '033.04.02', '032.01'],
    recommendedView: View.MET_ATMOSPHERE,
    visualLabId: 'AtmosphereExplorer',
    defaultStabilityDays: 10
  },
  FND_ALTIMETER_TEMP_ERR: {
    id: 'FND_ALTIMETER_TEMP_ERR',
    name: 'Altimeter Temperature Error Correction & True Altitude',
    domain: 'Meteorology',
    description: 'Calculation of true altitude in non-standard air columns: 4 ft per 1000 ft per °C of Delta-ISA. High-to-low / hot-to-cold look out below.',
    prerequisites: ['FND_PRESSURE_LAPSE', 'FND_ISA_MODEL'],
    targetLearningObjectives: ['050.01.06', '022.02.02'],
    recommendedView: View.ALTIMETER,
    visualLabId: 'AltimeterLab',
    defaultStabilityDays: 7
  },
  FND_AIR_DENSITY_EFFECT: {
    id: 'FND_AIR_DENSITY_EFFECT',
    name: 'Air Density, Dynamic Pressure & Airspeed Hierarchy',
    domain: 'Principles of Flight',
    description: 'Dynamic pressure q = 1/2 * rho * V^2. Relationship between IAS, CAS, EAS, and TAS under varying ambient air densities.',
    prerequisites: ['FND_ISA_MODEL'],
    targetLearningObjectives: ['081.01', '061.01.08', '022.02.01'],
    recommendedView: View.INST_ASI,
    visualLabId: 'AirspeedVisualizer',
    defaultStabilityDays: 10
  },
  FND_ALTIMETER_SUBSCALE_RULE: {
    id: 'FND_ALTIMETER_SUBSCALE_RULE',
    name: 'Subscale Pressure Setting Error Directionality',
    domain: 'Instruments',
    description: 'Danger of flying from high to low pressure without subscale reset: altimeter over-reads actual altitude, causing CFIT danger.',
    prerequisites: ['FND_BARO_PRESSURE_DATUM', 'FND_PRESSURE_LAPSE'],
    targetLearningObjectives: ['022.02.02', '010.05.04', '050.01.06'],
    recommendedView: View.ALTIMETER,
    visualLabId: 'AltimeterLab',
    defaultStabilityDays: 14
  },
  FND_CG_MOMENT_ARM: {
    id: 'FND_CG_MOMENT_ARM',
    name: 'Center of Gravity, Reference Datum & Moment Arms',
    domain: 'Mass & Balance',
    description: 'Moment = Weight * Arm; Center of gravity = Total Moment / Total Weight; datum conventions and forward/aft envelope stability impact.',
    prerequisites: [],
    targetLearningObjectives: ['031.05', '031.06'],
    recommendedView: View.MASS_BAL_CG_CALC,
    visualLabId: 'MomentArmCalc',
    defaultStabilityDays: 14
  },
  FND_LIFT_WEIGHT_LOAD_FACTOR: {
    id: 'FND_LIFT_WEIGHT_LOAD_FACTOR',
    name: 'Load Factor, Bank Angle & Accelerated Stall Speed',
    domain: 'Principles of Flight',
    description: 'Load factor n = 1 / cos(phi). Accelerated stall speed scales as Vs * sqrt(n), causing steep turns to dramatically increase stall margin risks.',
    prerequisites: [],
    targetLearningObjectives: ['081.03', '081.04', '100.07'],
    recommendedView: View.CONCEPT_TURN_PERF,
    visualLabId: 'TurnPerfVisualizer',
    defaultStabilityDays: 10
  },
  FND_CALCULATION_PRECISION: {
    id: 'FND_CALCULATION_PRECISION',
    name: 'Aviation Calculation Precision & Mental Math Hygiene',
    domain: 'Cross-Disciplinary',
    description: 'Mental math shortcuts, intermediate rounding hygiene, unit conversions, and formula execution precision.',
    prerequisites: [],
    targetLearningObjectives: ['100.04', '061.01.08'],
    recommendedView: View.KSA_MENTAL_MATHS,
    visualLabId: 'MentalMathsLab',
    defaultStabilityDays: 14
  },
  FND_WIND_TRIANGLE_DRFT: {
    id: 'FND_WIND_TRIANGLE_DRFT',
    name: 'Wind Triangle Vector Addition & Drift Mechanics',
    domain: 'General Navigation',
    description: 'Vector addition of heading/TAS and wind velocity to produce ground track and groundspeed. Calculation of drift angle and wind correction angle.',
    prerequisites: ['FND_AIR_DENSITY_EFFECT'],
    targetLearningObjectives: ['061.01.03', '061.02.01', '022.02.01'],
    recommendedView: View.FOUNDATION_NAV_TRIANGLE_CHAIN,
    visualLabId: 'NavigationTriangleVisualizer',
    defaultStabilityDays: 10
  },
  FND_ONE_IN_SIXTY_RULE: {
    id: 'FND_ONE_IN_SIXTY_RULE',
    name: '1-in-60 Rule & Mental Dead Reckoning Off-Track Corrections',
    domain: 'General Navigation',
    description: 'Mental calculation of Track Error Angle (TKE = XTE * 60 / DistFlown) and Closing Angle (CA = XTE * 60 / DistToGo). Regaining track vs direct to destination.',
    prerequisites: ['FND_WIND_TRIANGLE_DRFT', 'FND_CALCULATION_PRECISION'],
    targetLearningObjectives: ['061.02.01', '061.01.08'],
    recommendedView: View.FOUNDATION_NAV_TRIANGLE_CHAIN,
    visualLabId: 'OneInSixtyLab',
    defaultStabilityDays: 10
  }
};

// ============================================================================
// 2. ERROR TAXONOMY & MISCONCEPTION SIGNALS
// ============================================================================

export type MisconceptionCode =
  | 'MISCON_QNH_VS_QFE'                 // Confusing QNH with QFE datum
  | 'MISCON_ISA_DEV_VS_ABS_TEMP'        // Confusing ISA temperature deviation with absolute temperature
  | 'MISCON_TEMP_CORR_SIGN_INVERSION'   // Applying wrong sign to altimeter temperature correction
  | 'MISCON_SUBSCALE_SIGN_INVERSION'    // Applying wrong sign to pressure subscale setting change
  | 'MISCON_NEGLECT_DENSITY_ON_TAS'     // Ignoring air density effect on TAS (assuming TAS=IAS at altitude)
  | 'MISCON_TRAN_ALT_VS_LEVEL'          // Confusing Transition Altitude with Transition Level
  | 'MISCON_CG_DATUM_INVERSION'         // Reversing moment arm sign relative to reference datum
  | 'MISCON_LOAD_FACTOR_LINEARITY'      // Believing stall speed increases linearly with bank angle
  | 'MISCON_WIND_VECTOR_DIRECTION'      // Reversing wind direction (blowing towards vs from)
  | 'MISCON_DRIFT_SIGN_INVERSION'       // Adding drift instead of subtracting to get heading (or vice-versa)
  | 'MISCON_1_IN_60_CLOSING_ANGLE'      // Neglecting closing angle to destination, flying parallel
  | 'MISCON_TAS_VS_GS_HEADWIND'         // Confusing Groundspeed with TAS under wind influence
  | 'MISCON_ARITHMETIC_PRECISION';      // Minor calculation slip with correct underlying model

export type ErrorClassification =
  | 'CONCEPTUAL_MISUNDERSTANDING'       // Flawed mental model of physical/aviation principles
  | 'ARITHMETIC_SLIP'                   // Correct formula and sign, but numerical execution mistake
  | 'READING_MISINTERPRETATION'         // Misread units, given values, or question prompt
  | 'TIME_PRESSURE_GUESS'               // Unusually quick response indicative of blind guessing
  | 'UNKNOWN';

export interface DistractorDiagnosticMetadata {
  distractorOptionIndex: number;
  misconceptionCode?: MisconceptionCode;
  errorClassification: ErrorClassification;
  targetFoundationConcept: FoundationConceptId;
  formulaSignature?: string;
  isSignFlipped?: boolean;
  isAbsoluteTempUsed?: boolean;
  isDensityIgnored?: boolean;
  isDatumInverted?: boolean;
  expectedValue?: number;
  distractorValue?: number;
  explanation: string;
}

export interface QuestionDiagnosticMetadata {
  questionId: string;
  subjectId: string;
  primaryLearningObjective: string;
  relatedFoundationConcepts: FoundationConceptId[];
  nominalPacingSeconds: number;
  minimumPacingSeconds: number;
  correctAnswerIndex: number;
  distractors: Record<number, DistractorDiagnosticMetadata>;
}

// ============================================================================
// 3. STUDENT STATE MACHINE (7 DISCRETE STATES)
// ============================================================================

export type StudentConceptStatus =
  | 'unknown'                    // No assessment or diagnostic evidence recorded yet
  | 'needs_foundation'          // Conceptual misunderstanding or repeated failure detected
  | 'learning'                  // Interacting with foundation lesson or in early practice
  | 'demonstrated_with_help'    // Solved correctly, but used hints, chains, or prolonged pacing
  | 'demonstrated_independently'// Solved >= 2 questions independently with fluent pacing
  | 'review_due'                // Retention interval elapsed or downstream dependent LO failed
  | 'retained';                 // Successfully passed review interval independently

export interface StudentEvidenceRecord {
  studentId: string;
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
  helpRequested: boolean;        // Whether hint or reasoning chain was consulted
  attemptNumber: number;
  timestamp: string;             // ISO-8601
}

export interface StateTransitionEvent {
  timestamp: string;
  fromStatus: StudentConceptStatus;
  toStatus: StudentConceptStatus;
  reason: string;
  triggeringQuestionId: string;
  evidenceClassification: ErrorClassification;
  misconceptionDetected?: MisconceptionCode;
}

export interface StudentConceptState {
  studentId: string;
  conceptId: FoundationConceptId;
  status: StudentConceptStatus;
  consecutiveIndependentCorrect: number;
  consecutiveFailures: number;
  totalAttempts: number;
  totalSuccesses: number;
  lastEvidenceTimestamp: string;
  reviewDueDate?: string;
  stabilityDays: number;
  detectedMisconceptions: MisconceptionCode[];
  bypassGranted: boolean;
  history: StateTransitionEvent[];
}

// ============================================================================
// 4. RECOMMENDATION DATA STRUCTURES
// ============================================================================

export type RecommendationPriority = 'IMMEDIATE' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface TransparentRationale {
  triggerQuestionId: string;
  errorClassification: ErrorClassification;
  misconceptionCode?: MisconceptionCode;
  summary: string;
  studentActionObservation: string;
  aviationPrincipleConsequence: string;
  pedagogicalObjective: string;
  whyNow: string;
}

export interface FoundationRecommendation {
  id: string;
  studentId: string;
  conceptId: FoundationConceptId;
  conceptTitle: string;
  priority: RecommendationPriority;
  urgencyScore: number;          // 0 to 100
  recommendedAction: {
    type: 'INTERACTIVE_LAB' | 'MICRO_LESSON' | 'CALCULATION_DRILL' | 'REVIEW_FLASHCARD';
    targetView?: View;
    visualLabId?: string;
    estimatedMinutes: number;
  };
  rationale: TransparentRationale;
  bypassAvailable: boolean;
  createdAt: string;
  isDismissed: boolean;
}

// ============================================================================
// 5. ENGINE IMPLEMENTATION
// ============================================================================

export class FoundationRecommendationEngine {
  private conceptCatalog: Record<FoundationConceptId, FoundationConceptDefinition>;
  private questionMetadataStore: Map<string, QuestionDiagnosticMetadata> = new Map();

  constructor(customCatalog?: Record<FoundationConceptId, FoundationConceptDefinition>) {
    this.conceptCatalog = customCatalog || FOUNDATION_CONCEPT_CATALOG;
    this.seedDefaultQuestionMetadata();
  }

  /**
   * Register diagnostic question metadata so the engine can accurately
   * classify errors down to the distractor level.
   */
  public registerQuestionMetadata(metadata: QuestionDiagnosticMetadata): void {
    this.questionMetadataStore.set(metadata.questionId, metadata);
  }

  public getQuestionMetadata(questionId: string): QuestionDiagnosticMetadata | undefined {
    return this.questionMetadataStore.get(questionId);
  }

  // --------------------------------------------------------------------------
  // A. ARITHMETIC VS CONCEPTUAL ERROR DISCRIMINATION
  // --------------------------------------------------------------------------

  /**
   * Classify a student's answer error deterministically:
   * 1. Inspect distractor diagnostic metadata if registered.
   * 2. Check timing against minimum threshold (guessing detection).
   * 3. Analyze whether choice represents sign flip, datum inversion, or calculation slip.
   */
  public classifyError(
    questionId: string,
    selectedOptionIndex: number,
    timeSpentSeconds: number,
    userComputedValue?: number
  ): {
    classification: ErrorClassification;
    misconceptionCode?: MisconceptionCode;
    targetConcept: FoundationConceptId;
    explanation: string;
  } {
    const qMeta = this.questionMetadataStore.get(questionId);

    // Default fallback if question metadata is unregistered
    if (!qMeta) {
      const fallbackConcept = this.inferConceptFromQuestionId(questionId);
      return {
        classification: 'UNKNOWN',
        targetConcept: fallbackConcept,
        explanation: 'Unregistered question diagnostic metadata; falling back to subject mapping.'
      };
    }

    // Check for rapid guessing / time-pressure error
    if (timeSpentSeconds < qMeta.minimumPacingSeconds) {
      const targetConcept = qMeta.relatedFoundationConcepts[0] || 'FND_CALCULATION_PRECISION';
      return {
        classification: 'TIME_PRESSURE_GUESS',
        targetConcept,
        explanation: `Answer submitted in ${timeSpentSeconds}s (minimum baseline is ${qMeta.minimumPacingSeconds}s). High likelihood of reflexive clicking or time pressure.`
      };
    }

    const distractorMeta = qMeta.distractors[selectedOptionIndex];
    if (distractorMeta) {
      return {
        classification: distractorMeta.errorClassification,
        misconceptionCode: distractorMeta.misconceptionCode,
        targetConcept: distractorMeta.targetFoundationConcept,
        explanation: distractorMeta.explanation
      };
    }

    // If numerical value was provided and we have distractor data, inspect proximity
    if (userComputedValue !== undefined) {
      return this.discriminateNumericError(qMeta, userComputedValue);
    }

    return {
      classification: 'CONCEPTUAL_MISUNDERSTANDING',
      targetConcept: qMeta.relatedFoundationConcepts[0] || 'FND_PRESSURE_LAPSE',
      explanation: 'Selected distractor does not match known arithmetic tolerance; treated as conceptual issue.'
    };
  }

  /**
   * Discriminate numeric error: checks if student answer is within +/- 6% of correct
   * without matching any known misconception signature (sign flip or datum shift).
   */
  private discriminateNumericError(
    qMeta: QuestionDiagnosticMetadata,
    userValue: number
  ): {
    classification: ErrorClassification;
    misconceptionCode?: MisconceptionCode;
    targetConcept: FoundationConceptId;
    explanation: string;
  } {
    const correctDistractor = qMeta.distractors[qMeta.correctAnswerIndex];
    const correctValue = correctDistractor?.expectedValue;

    if (correctValue !== undefined) {
      const relativeDiff = Math.abs((userValue - correctValue) / correctValue);

      // Check if value matches sign flipped distractor
      for (const dist of Object.values(qMeta.distractors)) {
        if (dist.isSignFlipped && dist.distractorValue !== undefined) {
          if (Math.abs(userValue - dist.distractorValue) / Math.abs(dist.distractorValue) < 0.03) {
            return {
              classification: 'CONCEPTUAL_MISUNDERSTANDING',
              misconceptionCode: dist.misconceptionCode,
              targetConcept: dist.targetFoundationConcept,
              explanation: `Value matches sign-inverted error (${userValue} vs ${dist.distractorValue}).`
            };
          }
        }
        if (dist.isAbsoluteTempUsed && dist.distractorValue !== undefined) {
          if (Math.abs(userValue - dist.distractorValue) / Math.abs(dist.distractorValue) < 0.03) {
            return {
              classification: 'CONCEPTUAL_MISUNDERSTANDING',
              misconceptionCode: 'MISCON_ISA_DEV_VS_ABS_TEMP',
              targetConcept: dist.targetFoundationConcept,
              explanation: `Value indicates absolute temperature was used instead of ISA deviation.`
            };
          }
        }
      }

      // If within 6% tolerance and correct sign
      if (relativeDiff <= 0.06 && Math.sign(userValue) === Math.sign(correctValue)) {
        return {
          classification: 'ARITHMETIC_SLIP',
          misconceptionCode: 'MISCON_ARITHMETIC_PRECISION',
          targetConcept: 'FND_CALCULATION_PRECISION',
          explanation: `Numerical result is within ${Math.round(relativeDiff * 100)}% of correct (${correctValue}). Conceptual framework is sound; minor calculation slip.`
        };
      }
    }

    return {
      classification: 'CONCEPTUAL_MISUNDERSTANDING',
      targetConcept: qMeta.relatedFoundationConcepts[0] || 'FND_PRESSURE_LAPSE',
      explanation: 'Calculated value deviates outside arithmetic tolerance or sign boundary.'
    };
  }

  // --------------------------------------------------------------------------
  // B. STATE UPDATE MECHANICS (TRANSITION MATRIX)
  // --------------------------------------------------------------------------

  /**
   * Process a single piece of assessment evidence and return the updated StudentConceptState.
   * Deterministic state transitions strictly guarded by cognitive thresholds.
   */
  public processEvidence(
    currentState: StudentConceptState,
    evidence: StudentEvidenceRecord
  ): {
    updatedState: StudentConceptState;
    transitionOccurred: boolean;
    transitionDetails?: StateTransitionEvent;
    recommendationRequired: boolean;
  } {
    const qMeta = this.questionMetadataStore.get(evidence.questionId);
    const nominalPacing = qMeta ? qMeta.nominalPacingSeconds : 60;
    const isPacingFluent = evidence.timeSpentSeconds <= nominalPacing * 1.5;
    const isIndependent = !evidence.helpRequested && isPacingFluent;

    const updatedState: StudentConceptState = {
      ...currentState,
      totalAttempts: currentState.totalAttempts + 1,
      lastEvidenceTimestamp: evidence.timestamp,
      history: [...currentState.history]
    };

    let transitionOccurred = false;
    let transitionDetails: StateTransitionEvent | undefined;
    let recommendationRequired = false;

    if (evidence.isCorrect) {
      updatedState.totalSuccesses += 1;
      updatedState.consecutiveFailures = 0;

      if (isIndependent) {
        updatedState.consecutiveIndependentCorrect += 1;
      } else {
        updatedState.consecutiveIndependentCorrect = 0;
      }

      // Check Immediate Bypass / Demonstration Criteria:
      // Answering correctly independently twice in a row grants bypass and promotes to demonstrated_independently.
      if (isIndependent && updatedState.consecutiveIndependentCorrect >= 2) {
        if (updatedState.status !== 'demonstrated_independently' && updatedState.status !== 'retained') {
          const fromStatus = updatedState.status;
          updatedState.status = 'demonstrated_independently';
          updatedState.bypassGranted = true;
          updatedState.reviewDueDate = this.calculateReviewDate(evidence.timestamp, updatedState.stabilityDays);

          transitionOccurred = true;
          transitionDetails = {
            timestamp: evidence.timestamp,
            fromStatus,
            toStatus: 'demonstrated_independently',
            reason: 'Bypass condition met: 2 consecutive independent correct answers with fluent pacing.',
            triggeringQuestionId: evidence.questionId,
            evidenceClassification: 'CONCEPTUAL_MISUNDERSTANDING' // N/A on success
          };
        }
      } else if (isIndependent && updatedState.consecutiveIndependentCorrect === 1) {
        // First independent success
        if (updatedState.status === 'needs_foundation' || updatedState.status === 'unknown') {
          const fromStatus = updatedState.status;
          updatedState.status = 'learning';
          transitionOccurred = true;
          transitionDetails = {
            timestamp: evidence.timestamp,
            fromStatus,
            toStatus: 'learning',
            reason: 'First independent correct answer recorded; progressing from remediation into learning.',
            triggeringQuestionId: evidence.questionId,
            evidenceClassification: 'CONCEPTUAL_MISUNDERSTANDING'
          };
        }
      } else if (!isIndependent) {
        // Correct answer but with help (hint, reasoning chain, or prolonged pacing)
        if (updatedState.status !== 'demonstrated_independently' && updatedState.status !== 'retained') {
          const fromStatus = updatedState.status;
          updatedState.status = 'demonstrated_with_help';
          transitionOccurred = true;
          transitionDetails = {
            timestamp: evidence.timestamp,
            fromStatus,
            toStatus: 'demonstrated_with_help',
            reason: 'Solved correctly with cognitive assistance (hint/chain used or pacing > 1.5x nominal).',
            triggeringQuestionId: evidence.questionId,
            evidenceClassification: 'CONCEPTUAL_MISUNDERSTANDING'
          };
        }
      }
    } else {
      // INCORRECT ANSWER PATH
      updatedState.consecutiveFailures += 1;
      updatedState.consecutiveIndependentCorrect = 0;

      const classificationResult = this.classifyError(
        evidence.questionId,
        evidence.selectedOptionIndex,
        evidence.timeSpentSeconds
      );

      if (classificationResult.misconceptionCode) {
        if (!updatedState.detectedMisconceptions.includes(classificationResult.misconceptionCode)) {
          updatedState.detectedMisconceptions.push(classificationResult.misconceptionCode);
        }
      }

      if (classificationResult.classification === 'CONCEPTUAL_MISUNDERSTANDING') {
        // Regress state to needs_foundation
        if (updatedState.status !== 'needs_foundation') {
          const fromStatus = updatedState.status;
          updatedState.status = 'needs_foundation';
          updatedState.bypassGranted = false;
          transitionOccurred = true;
          recommendationRequired = true;

          transitionDetails = {
            timestamp: evidence.timestamp,
            fromStatus,
            toStatus: 'needs_foundation',
            reason: `Conceptual misunderstanding detected: ${classificationResult.explanation}`,
            triggeringQuestionId: evidence.questionId,
            evidenceClassification: classificationResult.classification,
            misconceptionDetected: classificationResult.misconceptionCode
          };
        } else {
          // Already in needs_foundation; reinforces recommendation urgency
          recommendationRequired = true;
        }
      } else if (classificationResult.classification === 'ARITHMETIC_SLIP') {
        // Arithmetic error does NOT demote student to needs_foundation if already proficient
        if (updatedState.status === 'unknown') {
          const fromStatus = updatedState.status;
          updatedState.status = 'learning';
          transitionOccurred = true;
          transitionDetails = {
            timestamp: evidence.timestamp,
            fromStatus,
            toStatus: 'learning',
            reason: 'Arithmetic slip detected on first attempt. Conceptual model intact; no remedial foundation needed.',
            triggeringQuestionId: evidence.questionId,
            evidenceClassification: 'ARITHMETIC_SLIP'
          };
        }
      } else if (classificationResult.classification === 'TIME_PRESSURE_GUESS') {
        // Guessing behavior: do not alter stable demonstrated state on 1 occurrence, but flag
        if (updatedState.consecutiveFailures >= 2 && updatedState.status !== 'needs_foundation') {
          const fromStatus = updatedState.status;
          updatedState.status = 'needs_foundation';
          transitionOccurred = true;
          recommendationRequired = true;
          transitionDetails = {
            timestamp: evidence.timestamp,
            fromStatus,
            toStatus: 'needs_foundation',
            reason: 'Repeated rushed failures indicate cognitive avoidance of prerequisite concepts.',
            triggeringQuestionId: evidence.questionId,
            evidenceClassification: 'TIME_PRESSURE_GUESS'
          };
        }
      }
    }

    if (transitionDetails) {
      updatedState.history.push(transitionDetails);
    }

    return {
      updatedState,
      transitionOccurred,
      transitionDetails,
      recommendationRequired
    };
  }

  // --------------------------------------------------------------------------
  // C. IMMEDIATE SKIP / BYPASS LOGIC
  // --------------------------------------------------------------------------

  /**
   * Determine whether a student can immediately bypass foundation remediation
   * for a specific concept.
   */
  public evaluateBypassEligibility(
    state: StudentConceptState,
    recentEvidence: StudentEvidenceRecord[]
  ): {
    canBypass: boolean;
    reason: string;
  } {
    // Condition 1: Bypass already granted
    if (state.bypassGranted) {
      return {
        canBypass: true,
        reason: 'Bypass previously granted via consecutive independent demonstration.'
      };
    }

    // Condition 2: 2 or more consecutive independent successes recorded
    if (state.consecutiveIndependentCorrect >= 2) {
      return {
        canBypass: true,
        reason: 'Demonstrated autonomy: 2 consecutive questions answered correctly without hints or pacing anomalies.'
      };
    }

    // Condition 3: Fast-track diagnostic probe test
    const conceptEvidence = recentEvidence.filter(e => {
      const qMeta = this.questionMetadataStore.get(e.questionId);
      return qMeta?.relatedFoundationConcepts.includes(state.conceptId);
    });

    const recentCorrectIndependent = conceptEvidence
      .slice(-2)
      .filter(e => e.isCorrect && !e.helpRequested);

    if (recentCorrectIndependent.length >= 2) {
      return {
        canBypass: true,
        reason: 'Passed 2 recent targeted diagnostic probes independently.'
      };
    }

    return {
      canBypass: false,
      reason: `Requires 2 independent correct answers (current: ${state.consecutiveIndependentCorrect}/2).`
    };
  }

  // --------------------------------------------------------------------------
  // D. TRANSPARENT RATIONALE GENERATION
  // --------------------------------------------------------------------------

  /**
   * Generate a transparent, student-facing rationale answering:
   * "Why am I seeing this recommendation?"
   */
  public generateRationale(
    conceptId: FoundationConceptId,
    evidence: StudentEvidenceRecord,
    classification: ErrorClassification,
    misconceptionCode?: MisconceptionCode
  ): TransparentRationale {
    const concept = this.conceptCatalog[conceptId];
    const qMeta = this.questionMetadataStore.get(evidence.questionId);

    switch (misconceptionCode) {
      case 'MISCON_QNH_VS_QFE':
        return {
          triggerQuestionId: evidence.questionId,
          errorClassification: classification,
          misconceptionCode,
          summary: 'Altimeter Reference Datum Confusion (QNH vs QFE)',
          studentActionObservation: `You selected an option assuming the altimeter reads zero on the ground with QNH, or airport elevation with QFE.`,
          aviationPrincipleConsequence: 'QNH measures altitude above Mean Sea Level (reads aerodrome elevation on ground). QFE measures height above airfield datum (reads zero on ground). Confusing them risks terrain collision or flying at the wrong level.',
          pedagogicalObjective: `Master the three barometric reference planes (QNH, QFE, Standard 1013.25) before attempting instrument approach procedures.`,
          whyNow: `Questions in LO 050.01.06 and 022.02 require instant recognition of subscale reference planes.`
        };

      case 'MISCON_ISA_DEV_VS_ABS_TEMP':
        return {
          triggerQuestionId: evidence.questionId,
          errorClassification: classification,
          misconceptionCode,
          summary: 'Differentiating ISA Deviation (Delta-ISA) from Absolute Temperature',
          studentActionObservation: `You used ambient temperature directly in the calculation rather than calculating the difference from standard ISA temperature at that pressure altitude.`,
          aviationPrincipleConsequence: 'At FL100, ISA standard is -5°C. If ambient temperature is -20°C, the ISA deviation is -15°C (ISA -15), NOT -20°C. Using absolute temperatures produces incorrect true altitudes and invalid density calculations.',
          pedagogicalObjective: `Strengthen the ISA temperature lapse rate model (15°C - 2°C per 1000 ft) to reliably extract Delta-ISA.`,
          whyNow: `Required for ECQB altimetry drift-down, obstacle clearance, and aircraft performance questions.`
        };

      case 'MISCON_TEMP_CORR_SIGN_INVERSION':
        return {
          triggerQuestionId: evidence.questionId,
          errorClassification: classification,
          misconceptionCode,
          summary: 'Inverted Sign on Altimeter Temperature Correction',
          studentActionObservation: `In colder-than-standard air, you added the temperature correction instead of subtracting it, concluding your true altitude was higher than indicated.`,
          aviationPrincipleConsequence: 'Remember: "Hot to Cold, Look Out Below". Cold air is denser, compressing isobaric surfaces toward the surface. When air is colder than ISA, your altimeter OVER-READS; you are significantly CLOSER to terrain than your instrument indicates.',
          pedagogicalObjective: `Visualize the physical compression of cold air columns using the interactive AltimeterLab.`,
          whyNow: `High-risk CFIT misconception that accounts for numerous failed ATPL Meteorology and AGK exam attempts.`
        };

      case 'MISCON_SUBSCALE_SIGN_INVERSION':
        return {
          triggerQuestionId: evidence.questionId,
          errorClassification: classification,
          misconceptionCode,
          summary: 'Altimeter Subscale Setting Direction Error',
          studentActionObservation: `When changing subscale pressure from 1013 hPa to a higher QNH (1043 hPa), you subtracted the pressure height difference instead of adding it.`,
          aviationPrincipleConsequence: 'Increasing subscale pressure setting moves the aneroid capsule mechanism to indicate a HIGHER altitude (+30 ft per +1 hPa). Flying from high to low pressure without resetting causes the altimeter to over-read.',
          pedagogicalObjective: `Understand the mechanical link between subscale rotation and needle movement.`,
          whyNow: `Essential for terminal arrival transition altitude (TA) to transition level (TL) calculations.`
        };

      case 'MISCON_NEGLECT_DENSITY_ON_TAS':
        return {
          triggerQuestionId: evidence.questionId,
          errorClassification: classification,
          misconceptionCode,
          summary: 'Neglecting Air Density Effect on True Airspeed (TAS)',
          studentActionObservation: `At high cruising altitude, you treated True Airspeed as equal to or lower than Indicated/Calibrated Airspeed.`,
          aviationPrincipleConsequence: 'Dynamic pressure is 1/2 * rho * V^2. Because air density (rho) drops rapidly with altitude, the aircraft must travel much faster through the airmass (higher TAS) to create the same indicated dynamic pressure.',
          pedagogicalObjective: `Review the airspeed conversion chain: IAS -> CAS -> EAS -> TAS.`,
          whyNow: `Critical for General Navigation time/speed/distance problems and High Speed Aerodynamics.`
        };

      case 'MISCON_WIND_VECTOR_DIRECTION':
        return {
          triggerQuestionId: evidence.questionId,
          errorClassification: classification,
          misconceptionCode,
          summary: 'Wind Vector Origin vs Destination Inversion',
          studentActionObservation: `You plotted wind blowing TOWARDS the given bearing rather than FROM it (e.g. treating wind 270° as blowing easterly towards 090°).`,
          aviationPrincipleConsequence: 'Aviation winds are ALWAYS reported as the direction FROM which the air is moving. Inverting wind direction turns a headwind into a tailwind and flips drift from left to right, creating catastrophic fuel exhaustion and navigational track divergence.',
          pedagogicalObjective: `Master the vector addition convention: Heading + Wind = Track.`,
          whyNow: `Foundational to all General Navigation (061) and Flight Planning (033) exam questions.`
        };

      case 'MISCON_DRIFT_SIGN_INVERSION':
        return {
          triggerQuestionId: evidence.questionId,
          errorClassification: classification,
          misconceptionCode,
          summary: 'Inverted Drift Angle Application (Heading vs Track)',
          studentActionObservation: `With port (left) drift, you subtracted the drift angle from track to find heading, or added drift when heading should compensate into wind.`,
          aviationPrincipleConsequence: 'Remember: "Wind pushes you drift-ward; you must turn into the wind to compensate". With Wind from Left, Drift is Starboard (Right, +). Heading must be into wind (Left, -): Heading = Track - Drift.',
          pedagogicalObjective: `Practice rapid mental sign verification: if wind is from the left, heading must be LESS than track.`,
          whyNow: `One of the most frequent point-loss sources in EASA 061 General Navigation examinations.`
        };

      case 'MISCON_1_IN_60_CLOSING_ANGLE':
        return {
          triggerQuestionId: evidence.questionId,
          errorClassification: classification,
          misconceptionCode,
          summary: 'Omission of Closing Angle in 1-in-60 Off-Track Correction',
          studentActionObservation: `You computed Track Error Angle (TKE) but omitted Closing Angle (CA), yielding a heading that only parallels the original track instead of intercepting the destination.`,
          aviationPrincipleConsequence: 'Applying only TKE halts further drift away from track but leaves the aircraft permanently off track. To fly DIRECT to the next waypoint, Heading Change = TKE + CA.',
          pedagogicalObjective: `Consistently structure 1-in-60 problems into two stages: (1) Parallel track (TKE) + (2) Intercept waypoint (CA).`,
          whyNow: `Core LO 061.02.01 testing mental dead reckoning during VFR navigation.`
        };

      case 'MISCON_ARITHMETIC_PRECISION':
        return {
          triggerQuestionId: evidence.questionId,
          errorClassification: 'ARITHMETIC_SLIP',
          misconceptionCode,
          summary: 'Mental Math / Arithmetic Precision Slip',
          studentActionObservation: `Your formula setup and sign were correct, but the final numerical value drifted by a small arithmetic rounding or multiplication variance.`,
          aviationPrincipleConsequence: 'ATPL multiple-choice questions frequently place distractors within 5% of the correct answer to trap rounding errors or 27 ft vs 30 ft per hPa conversions.',
          pedagogicalObjective: `Refine mental calculation habits and verify whether the question specifies 27 ft/hPa or 30 ft/hPa.`,
          whyNow: `Maintain high exam score conversion without wasting time re-reading foundational theory you already grasp.`
        };

      default:
        return {
          triggerQuestionId: evidence.questionId,
          errorClassification: classification,
          summary: `Prerequisite Gap Detected in ${concept.name}`,
          studentActionObservation: `Question ${evidence.questionId} (LO ${qMeta?.primaryLearningObjective || 'N/A'}) was missed due to prerequisite concept friction.`,
          aviationPrincipleConsequence: `${concept.description}`,
          pedagogicalObjective: `Solidify core foundations in ${concept.name} to avoid compounding errors in complex multi-step problems.`,
          whyNow: `Identified by the recommendation engine based on current assessment performance.`
        };
    }
  }

  // --------------------------------------------------------------------------
  // E. GENERATE ACTIVE RECOMMENDATIONS
  // --------------------------------------------------------------------------

  /**
   * Produce prioritized, explainable recommendations for a student based on
   * current concept states and latest assessment events.
   */
  public generateRecommendations(
    states: StudentConceptState[],
    latestEvidence?: StudentEvidenceRecord
  ): FoundationRecommendation[] {
    const recommendations: FoundationRecommendation[] = [];

    // Filter concepts needing foundation
    const needsFoundationStates = states.filter(s => s.status === 'needs_foundation' && !s.bypassGranted);

    for (const state of needsFoundationStates) {
      const concept = this.conceptCatalog[state.conceptId];
      if (!concept) continue;

      // Determine urgency score (0-100) based on failure count and prerequisite depth
      const failureWeight = Math.min(state.consecutiveFailures * 20, 50);
      const misconceptionWeight = Math.min(state.detectedMisconceptions.length * 15, 30);
      const urgencyScore = Math.min(20 + failureWeight + misconceptionWeight, 100);

      const priority: RecommendationPriority =
        urgencyScore >= 75 ? 'IMMEDIATE' :
        urgencyScore >= 50 ? 'HIGH' :
        urgencyScore >= 30 ? 'MEDIUM' : 'LOW';

      // Build rationale
      const primaryMisconception = state.detectedMisconceptions[state.detectedMisconceptions.length - 1];
      const triggerQId = latestEvidence?.questionId || 'DIAGNOSTIC_ASSESSMENT';
      const dummyEvidence: StudentEvidenceRecord = latestEvidence || {
        studentId: state.studentId,
        questionId: triggerQId,
        selectedOptionIndex: -1,
        isCorrect: false,
        timeSpentSeconds: 45,
        helpRequested: false,
        attemptNumber: 1,
        timestamp: new Date().toISOString()
      };

      const rationale = this.generateRationale(
        state.conceptId,
        dummyEvidence,
        'CONCEPTUAL_MISUNDERSTANDING',
        primaryMisconception
      );

      recommendations.push({
        id: `rec_${state.conceptId}_${Date.now()}`,
        studentId: state.studentId,
        conceptId: state.conceptId,
        conceptTitle: concept.name,
        priority,
        urgencyScore,
        recommendedAction: {
          type: concept.visualLabId ? 'INTERACTIVE_LAB' : 'MICRO_LESSON',
          targetView: concept.recommendedView,
          visualLabId: concept.visualLabId,
          estimatedMinutes: 4
        },
        rationale,
        bypassAvailable: true,
        createdAt: new Date().toISOString(),
        isDismissed: false
      });
    }

    // Sort by urgency descending
    return recommendations.sort((a, b) => b.urgencyScore - a.urgencyScore);
  }

  // --------------------------------------------------------------------------
  // F. HELPER METHODS & SEED DATA
  // --------------------------------------------------------------------------

  private calculateReviewDate(baseIsoDate: string, stabilityDays: number): string {
    const d = new Date(baseIsoDate);
    d.setDate(d.getDate() + stabilityDays);
    return d.toISOString();
  }

  private inferConceptFromQuestionId(questionId: string): FoundationConceptId {
    if (questionId.startsWith('050') || questionId.includes('ALT') || questionId.includes('QNH')) {
      return 'FND_ALTIMETER_TEMP_ERR';
    }
    if (questionId.startsWith('022')) {
      return 'FND_PRESSURE_LAPSE';
    }
    if (questionId.startsWith('081')) {
      return 'FND_AIR_DENSITY_EFFECT';
    }
    if (questionId.startsWith('031')) {
      return 'FND_CG_MOMENT_ARM';
    }
    return 'FND_BARO_PRESSURE_DATUM';
  }

  /**
   * Seed standard question metadata for benchmark ATPL exam diagnostic scenarios.
   */
  private seedDefaultQuestionMetadata(): void {
    // Benchmark Question 1: Altimeter subscale change during descent across transition level
    // (Actual EASA 050 question: QNH 1043, FL45, 30 ft/hPa -> 5400 ft)
    this.registerQuestionMetadata({
      questionId: 'QEBR35TI4',
      subjectId: '050',
      primaryLearningObjective: '050.01.06',
      relatedFoundationConcepts: ['FND_PRESSURE_LAPSE', 'FND_BARO_PRESSURE_DATUM'],
      nominalPacingSeconds: 60,
      minimumPacingSeconds: 8,
      correctAnswerIndex: 0, // 5 400 ft
      distractors: {
        0: {
          distractorOptionIndex: 0,
          errorClassification: 'CONCEPTUAL_MISUNDERSTANDING', // Correct answer
          targetFoundationConcept: 'FND_PRESSURE_LAPSE',
          expectedValue: 5400,
          distractorValue: 5400,
          explanation: 'Correct: (1043 - 1013) * 30 ft = +900 ft. 4500 + 900 = 5400 ft.'
        },
        1: {
          distractorOptionIndex: 1, // 4 100 ft
          misconceptionCode: 'MISCON_TRAN_ALT_VS_LEVEL',
          errorClassification: 'CONCEPTUAL_MISUNDERSTANDING',
          targetFoundationConcept: 'FND_BARO_PRESSURE_DATUM',
          distractorValue: 4100,
          explanation: 'Confused Transition Altitude (5000 ft) with current flight level and subtracted.'
        },
        2: {
          distractorOptionIndex: 2, // 3 600 ft
          misconceptionCode: 'MISCON_SUBSCALE_SIGN_INVERSION',
          errorClassification: 'CONCEPTUAL_MISUNDERSTANDING',
          targetFoundationConcept: 'FND_PRESSURE_LAPSE',
          isSignFlipped: true,
          distractorValue: 3600,
          explanation: 'Applied negative sign to pressure adjustment (4500 - 900 = 3600 ft instead of 4500 + 900).'
        },
        3: {
          distractorOptionIndex: 3, // 5 900 ft
          misconceptionCode: 'MISCON_TRAN_ALT_VS_LEVEL',
          errorClassification: 'CONCEPTUAL_MISUNDERSTANDING',
          targetFoundationConcept: 'FND_BARO_PRESSURE_DATUM',
          distractorValue: 5900,
          explanation: 'Added +900 ft to Transition Altitude (5000 ft) instead of current level (4500 ft).'
        }
      }
    });

    // Benchmark Question 2: Altimeter temperature error in cold air
    // True altitude calculation at FL100, ISA -15°C, indicated 10,000 ft
    // Correction = 4 ft * 10 (thousands) * (-15) = -600 ft -> True altitude = 9400 ft
    this.registerQuestionMetadata({
      questionId: 'Q_ALT_TEMP_COLD_01',
      subjectId: '050',
      primaryLearningObjective: '050.01.06',
      relatedFoundationConcepts: ['FND_ALTIMETER_TEMP_ERR', 'FND_ISA_MODEL'],
      nominalPacingSeconds: 60,
      minimumPacingSeconds: 8,
      correctAnswerIndex: 1, // 9 400 ft
      distractors: {
        0: {
          distractorOptionIndex: 0, // 10 600 ft
          misconceptionCode: 'MISCON_TEMP_CORR_SIGN_INVERSION',
          errorClassification: 'CONCEPTUAL_MISUNDERSTANDING',
          targetFoundationConcept: 'FND_ALTIMETER_TEMP_ERR',
          isSignFlipped: true,
          expectedValue: 9400,
          distractorValue: 10600,
          explanation: 'Added temperature correction in cold air (+600 ft instead of -600 ft). Altimeter over-reads in cold air.'
        },
        1: {
          distractorOptionIndex: 1, // 9 400 ft (Correct)
          errorClassification: 'CONCEPTUAL_MISUNDERSTANDING',
          targetFoundationConcept: 'FND_ALTIMETER_TEMP_ERR',
          expectedValue: 9400,
          distractorValue: 9400,
          explanation: 'Correct: 10,000 ft - (4 * 10 * 15) = 9,400 ft true altitude.'
        },
        2: {
          distractorOptionIndex: 2, // 9 200 ft
          misconceptionCode: 'MISCON_ISA_DEV_VS_ABS_TEMP',
          errorClassification: 'CONCEPTUAL_MISUNDERSTANDING',
          targetFoundationConcept: 'FND_ISA_MODEL',
          isAbsoluteTempUsed: true,
          expectedValue: 9400,
          distractorValue: 9200,
          explanation: 'Used ambient temperature -20°C instead of Delta-ISA (-15°C), resulting in 4 * 10 * -20 = -800 ft.'
        },
        3: {
          distractorOptionIndex: 3, // 9 460 ft
          misconceptionCode: 'MISCON_ARITHMETIC_PRECISION',
          errorClassification: 'ARITHMETIC_SLIP',
          targetFoundationConcept: 'FND_CALCULATION_PRECISION',
          expectedValue: 9400,
          distractorValue: 9460,
          explanation: 'Arithmetic calculation slip (computed 540 ft instead of 600 ft).'
        }
      }
    });

    // Benchmark Question 3: Dynamic Pressure / Airspeed Hierarchy at FL300
    this.registerQuestionMetadata({
      questionId: 'Q_POF_TAS_DENSITY_01',
      subjectId: '081',
      primaryLearningObjective: '081.01',
      relatedFoundationConcepts: ['FND_AIR_DENSITY_EFFECT'],
      nominalPacingSeconds: 45,
      minimumPacingSeconds: 6,
      correctAnswerIndex: 2, // TAS is significantly greater than IAS
      distractors: {
        0: {
          distractorOptionIndex: 0,
          misconceptionCode: 'MISCON_NEGLECT_DENSITY_ON_TAS',
          errorClassification: 'CONCEPTUAL_MISUNDERSTANDING',
          targetFoundationConcept: 'FND_AIR_DENSITY_EFFECT',
          isDensityIgnored: true,
          explanation: 'Assumed TAS equals IAS regardless of altitude.'
        },
        1: {
          distractorOptionIndex: 1,
          misconceptionCode: 'MISCON_NEGLECT_DENSITY_ON_TAS',
          errorClassification: 'CONCEPTUAL_MISUNDERSTANDING',
          targetFoundationConcept: 'FND_AIR_DENSITY_EFFECT',
          isDensityIgnored: true,
          explanation: 'Assumed TAS decreases with altitude due to colder air temperatures.'
        },
        2: {
          distractorOptionIndex: 2, // Correct
          errorClassification: 'CONCEPTUAL_MISUNDERSTANDING',
          targetFoundationConcept: 'FND_AIR_DENSITY_EFFECT',
          explanation: 'Correct: Decreased air density rho at FL300 requires higher TAS to generate identical dynamic pressure.'
        },
        3: {
          distractorOptionIndex: 3,
          errorClassification: 'UNKNOWN',
          targetFoundationConcept: 'FND_AIR_DENSITY_EFFECT',
          explanation: 'Unrelated distractor on compressibility.'
        }
      }
    });
  }
}

// Global Singleton Instance for platform-wide usage
export const foundationEngine = new FoundationRecommendationEngine();
export const foundationRecommendationEngine = foundationEngine;

