/**
 * ============================================================================
 * ATPLVector Foundation Learning System - Core Data Models & Type Definitions
 * ============================================================================
 *
 * This module defines the production-grade data architecture for ATPLVector's
 * adaptive pedagogical engine. It strictly decouples:
 *   1. Platform Curriculum Coverage (static system availability)
 *   2. Lesson Activity / Participation (student exposure & engagement)
 *   3. Assisted Performance (guided practice with scaffolding/hints)
 *   4. Independent Demonstrated Understanding (unassisted summative mastery)
 *   5. Retained Understanding After Delay (spaced repetition & decay resistance)
 */

import { CourseLevel, View } from '../../types';

// ============================================================================
// 1. CONCEPT & KNOWLEDGE GRAPH
// ============================================================================

/**
 * Standardized identifier for a canonical concept node in the knowledge graph.
 * Format examples: 'concept.081.aerofoil-lift', 'carb-ice', 'concept.032.density-altitude'
 */
export type ConceptId = string;

/**
 * Subject affiliation with primary flag and topic classification.
 */
export interface SubjectAffiliation {
  /** EASA subject code ('010' - '100') or PPL subject code ('ppl-pof', etc.) */
  subjectId: string;
  /** Whether this subject is the primary home of the concept */
  isPrimary: boolean;
  /** Optional topic subdivision code (e.g. '081.01.02') */
  topicCode?: string;
  /** Name of the subject for display */
  subjectName?: string;
}

/**
 * Regulatory track applicability and importance.
 */
export interface ConceptRegulatoryStatus {
  /** Certification tracks that require or test this concept */
  tracks: Array<'EASA_ATPL_A' | 'EASA_ATPL_H' | 'EASA_CPL' | 'EASA_PPL' | 'FAA_PPL' | 'FAA_CPL' | 'FAA_IR'>;
  /** Pedagogical role within the syllabus */
  applicability: 'MANDATORY' | 'CORE_THEORY' | 'SUPPORTING' | 'ENRICHMENT';
  /** Relative frequency in official exam sittings (0.0 to 1.0) */
  examFrequencyScore?: number;
  /** Whether this concept is classified as a critical flight safety item */
  isSafetyCritical?: boolean;
}

/**
 * Traceable citation to an official regulatory or manufacturer source.
 */
export interface SourceReference {
  authority: 'EASA' | 'FAA' | 'ICAO' | 'UK_CAA' | 'MANUFACTURER' | 'STANDARD_TEXT';
  document: string;          // e.g. 'ECQB 2024', '14 CFR Part 91', 'PANS-OPS Doc 8168', 'C172 POH'
  sectionOrLoId: string;     // e.g. '081.01.01.01', 'FAR 91.205', 'Annex 2 §3.2'
  citationTitle?: string;
  sourceUrl?: string;
}

/**
 * Diagnostic misconception cataloged for this concept.
 */
export interface ConceptMisconception {
  id: string;
  label: string;
  description: string;
  /** The typical erroneous mental model held by students */
  erroneousReasoning: string;
  /** The diagnostic condition or distractor selection indicating this misconception */
  diagnosticSignal: string;
  /** Recommended pedagogical counter-evidence or refutation explanation */
  counterEvidence: string;
  /** Remediation concept to revisit if this misconception is triggered */
  remediationConceptId?: ConceptId;
}

/**
 * Supported types of interactive multimedia and simulation learning assets.
 */
export type LearningAssetType =
  | 'SPLINE_3D_SCENE'
  | 'R3F_INTERACTIVE'
  | 'CALCULATOR'
  | 'SIMULATOR_SCENARIO'
  | 'VIDEO_LECTURE'
  | 'REASONING_CHAIN'
  | 'INTERACTIVE_DIAGRAM';

/**
 * An interactive educational asset attached to a concept.
 */
export interface LearningAsset {
  assetId: string;
  assetType: LearningAssetType;
  title: string;
  description?: string;
  /** Associated View if the asset maps to an ATPLVector interactive page */
  targetView?: View;
  /** Relative path or external resource URL */
  resourceUri?: string;
  /** Configuration or scene-specific parameters */
  metadata?: Record<string, unknown>;
}

/**
 * Canonical Concept Node in the ATPLVector Knowledge Graph.
 */
export interface Concept {
  id: ConceptId;
  title: string;
  description: string;
  subjectAffiliations: SubjectAffiliation[];
  regulatoryStatus: ConceptRegulatoryStatus;
  sourceReferences: SourceReference[];
  /** Concept IDs that must or should be mastered before learning this concept */
  prerequisites: ConceptId[];
  /** Catalog of known cognitive traps and misconceptions */
  misconceptions: ConceptMisconception[];
  /** Interactive tools, 3D visualizers, calculators, and simulations available */
  availableAssets: LearningAsset[];
  /** Monotonic schema/content version for migration tracking */
  version: number;
}

// ============================================================================
// 2. PREREQUISITE GRAPH EDGES
// ============================================================================

export type PrerequisiteRequirementType =
  | 'HARD_BLOCKER'        // Strict dependency: impossible or dangerous to learn target without it
  | 'SOFT_RECOMMENDED'    // Recommended foundation: significantly reduces cognitive load
  | 'CO_REQUISITE'        // Parallel concept: best studied concurrently
  | 'INTUITIVE_ANALOGY';  // Analogous foundation from another domain (e.g. Venturi -> Aerofoil)

/**
 * Directed edge representing conceptual dependency in the curriculum DAG.
 */
export interface PrerequisiteEdge {
  /** The foundational concept that must be understood first */
  fromConceptId: ConceptId;
  /** The downstream concept that depends on the prerequisite */
  toConceptId: ConceptId;
  /** Degree of dependency: 0.0 (weak) to 1.0 (strict necessity) */
  weight: number;
  /** Semantic classification of the requirement */
  requirementType: PrerequisiteRequirementType;
  /** Educational rationale for this prerequisite link */
  rationale?: string;
}

// ============================================================================
// 3. LESSON METADATA & CURRICULUM
// ============================================================================

export type CognitiveDepth =
  | 'RECALL_RECOGNITION'        // Bloom L1: Define terms, identify symbols
  | 'CONCEPTUAL_COMPREHENSION'  // Bloom L2: Explain relationships, interpret diagrams
  | 'PROCEDURAL_APPLICATION'    // Bloom L3: Calculate values, apply procedures
  | 'ANALYSIS_SYNTHESIS'        // Bloom L4: Diagnose failures, integrate cross-subject systems
  | 'EVALUATION_DECISION';      // Bloom L5: Aeronautical Decision Making (ADM/TEM)

export type ActivityType =
  | 'VIDEO_LECTURE'
  | 'INTERACTIVE_SIMULATION'
  | 'GUIDED_REASONING_CHAIN'
  | 'PRACTICE_SCENARIO'
  | 'FORMULA_WORKSHOP'
  | 'CHECK_FOR_UNDERSTANDING';

export interface LessonActivity {
  activityId: string;
  title: string;
  activityType: ActivityType;
  estimatedMinutes: number;
  /** Concepts explicitly practiced or taught in this specific activity */
  associatedConceptIds: ConceptId[];
  isMandatory: boolean;
}

/**
 * Metadata defining a curriculum lesson or interactive learning module.
 */
export interface LessonMetadata {
  id: string;
  title: string;
  subject: string;
  /** All concept IDs directly taught in this lesson */
  conceptsTaught: ConceptId[];
  /** Prerequisite concept IDs required prior to lesson commencement */
  prerequisites: ConceptId[];
  /** Official EASA ECQB Learning Objectives covered */
  easaLOs: string[];
  /** Target cognitive depth for this lesson */
  depth: CognitiveDepth;
  /** Structured sequential or modular activities composing the lesson */
  activities: LessonActivity[];
  /** Linked diagnostic/summative assessment IDs */
  assessmentIds: string[];
  /** Estimated completion duration in minutes */
  duration: number;
  /** Course level / track designation */
  regulatoryTrack: CourseLevel | 'DUAL_TRACK';
  /** Schema and content revision number */
  version: number;
}

// ============================================================================
// 4. ASSESSMENT & EVIDENCE
// ============================================================================

export type AssessmentEvidenceType =
  | 'MULTIPLE_CHOICE'
  | 'NUMERICAL_CALCULATION'
  | 'INTERACTIVE_SIM_ACTION'
  | 'SCENARIO_DECISION'
  | 'STEP_BY_STEP_REASONING'
  | 'FREE_RESPONSE_KEYWORD';

export type AssistancePermittedLevel =
  | 'NONE'                  // Strict closed-book evaluation (for independent mastery)
  | 'HINT_ONLY'             // Single qualitative hint permitted
  | 'REASONING_CHAIN'       // Stepwise "Why Mode" interactive guide permitted
  | 'FULL_STEP_THROUGH';    // Open walkthrough mode

export interface EvaluatedConceptWeight {
  conceptId: ConceptId;
  /** Proportion of total assessment score attributable to this concept (sum = 1.0) */
  weight: number;
  targetEvidenceType: AssessmentEvidenceType;
}

export interface AssessmentSuccessCriteria {
  /** Passing percentage threshold (e.g. 75 for standard ATPL, 100 for safety-critical) */
  passingScorePercentage: number;
  /** Allowed time in seconds before timeout flag (optional) */
  timeLimitSeconds?: number;
  /** For numerical questions: acceptable variance */
  numericalTolerance?: {
    absolute?: number;
    percentage?: number;
  };
}

export interface AssessmentFeedbackRule {
  triggerCondition: 'CORRECT' | 'INCORRECT' | 'HINT_USED' | 'TIMEOUT';
  feedbackText: string;
  /** Suggest a targeted concept to remediate if triggered */
  suggestedRemediationConceptId?: ConceptId;
}

export interface MisconceptionSignal {
  /** The distractor option index/key or simulator mistake pattern that triggers this */
  triggerAnswerOrAction: string | number;
  /** The identified misconception ID */
  misconceptionId: string;
  /** The concept with which this misconception is associated */
  conceptId: ConceptId;
  diagnosticNotes: string;
}

/**
 * Diagnostic or summative assessment definition.
 */
export interface Assessment {
  id: string;
  /** Which concepts are tested and with what weight */
  conceptsEvaluated: EvaluatedConceptWeight[];
  evidenceType: AssessmentEvidenceType;
  assistancePermitted: AssistancePermittedLevel;
  successCriteria: AssessmentSuccessCriteria;
  feedbackRules: AssessmentFeedbackRule[];
  misconceptionSignals: MisconceptionSignal[];
  /** Associated question or scenario IDs */
  questionReferenceId?: string;
  /** Target lesson ID if embedded inside a lesson */
  lessonId?: string;
}

// ============================================================================
// 5. STUDENT COGNITIVE STATE & MASTERY LIFECYCLE
// ============================================================================

/**
 * Granular cognitive mastery lifecycle state for a student on a specific concept.
 *
 * Lifecycle flow:
 *   NOT_STARTED -> INTRODUCED -> ASSISTED -> DEMONSTRATED -> RETAINED
 *                                                 |
 *                                                 v
 *                                               LAPSED (if review fails)
 *                                                 |
 *                                                 v
 *                                         MISCONCEPTION_FLAGGED
 */
export type ConceptMasteryStatus =
  | 'NOT_STARTED'             // No engagement yet recorded
  | 'INTRODUCED'              // Lesson viewed / theory presented, but no performance evidence
  | 'ASSISTED'                // Solved correctly only with hints, reasoning chains, or AI explanations
  | 'DEMONSTRATED'            // Solved correctly UNASSISTED under test conditions (current session)
  | 'RETAINED'                // Verified independent understanding after a delayed spaced interval
  | 'LAPSED'                  // Was demonstrated/retained, but failed a subsequent review or practice item
  | 'MISCONCEPTION_FLAGGED';  // Specific misconception pattern was diagnosed and requires targeted unlearning

export type AssistanceUsageLevel = 'NONE' | 'HINT' | 'REASONING_CHAIN' | 'EXPLANATION_VIEWED';

/**
 * Discrete evidence point recorded from student activity or assessment.
 */
export interface EvidenceRecord {
  evidenceId: string;
  timestamp: string;               // ISO 8601
  assessmentId: string;
  evidenceType: AssessmentEvidenceType;
  score: number;                   // 0 to 100
  passed: boolean;
  assistanceLevel: AssistanceUsageLevel;
  timeSpentSeconds: number;
  triggeredMisconceptions?: string[]; // IDs of any misconceptions diagnosed
}

/**
 * Counter tracking assistance dependency for cognitive diagnostics.
 */
export interface AssistanceUsageMetrics {
  hintsCount: number;
  reasoningChainsUsed: number;
  explanationsViewed: number;
  lastAssistedAt?: string;
}

/**
 * Attempt counters categorized by autonomy level.
 */
export interface AttemptMetrics {
  total: number;
  unassisted: number;
  assisted: number;
  correctUnassisted: number;
  correctAssisted: number;
}

/**
 * Lightweight historical transition record for trend analytics and trajectory mapping.
 */
export interface ConceptHistoryEntry {
  timestamp: string;
  previousStatus: ConceptMasteryStatus;
  newStatus: ConceptMasteryStatus;
  triggerEvidenceId: string;
  confidenceAfter: number;
}

/**
 * Complete, authoritative cognitive state of a student on a single concept.
 */
export interface StudentConceptState {
  conceptId: ConceptId;
  status: ConceptMasteryStatus;
  /** Estimated mastery confidence score between 0.0 (no confidence) and 1.0 (absolute certainty) */
  confidence: number;
  /** Most recent evidence point evaluated */
  lastEvidence: EvidenceRecord | null;
  /** Metrics on scaffolding/assistance accessed by the student */
  assistanceUsed: AssistanceUsageMetrics;
  /** Breakdown of attempts and unassisted vs assisted accuracy */
  attempts: AttemptMetrics;
  /** ISO date/time string when the next spaced-retrieval review is scheduled */
  nextReview: string | null;
  /** Recent history of status transitions */
  history: ConceptHistoryEntry[];
  /** Monotonic revision number for synchronization and conflict resolution */
  updatedAt: string;
}

// ============================================================================
// 6. DELAYED REVIEW SCHEDULE (SPACED RETRIEVAL)
// ============================================================================

export type ReviewGrade =
  | 0 // Complete blackout: no memory of concept
  | 1 // Incorrect: familiar upon seeing answer
  | 2 // Incorrect: serious difficulty remembering
  | 3 // Correct: with substantial hesitation/effort
  | 4 // Correct: after hesitation
  | 5 // Perfect: immediate, confident, fluent retrieval

/**
 * Spaced repetition memory schedule using modified SM-2 / FSRS cognitive decay model.
 */
export interface DelayedReviewSchedule {
  conceptId: ConceptId;
  /** Current interval between reviews in days */
  intervalDays: number;
  /** Ease factor multiplier (default: 2.5, minimum: 1.3) */
  easeFactor: number;
  /** Number of consecutive successful retained reviews */
  repetitions: number;
  /** When the review item is due for retrieval */
  dueAt: string; // ISO 8601
  /** Last time a delayed review was attempted */
  lastReviewedAt?: string;
  /** Number of times the student suffered a retention lapse */
  lapses: number;
  /** Historical review log for calibration */
  reviewLog?: Array<{
    reviewedAt: string;
    grade: ReviewGrade;
    intervalDays: number;
    easeFactor: number;
  }>;
}

// ============================================================================
// 7. PEDAGOGICAL RECOMMENDATIONS
// ============================================================================

export type RecommendationTrigger =
  | 'PREREQUISITE_DEFICIT'    // Downstream failure caused by missing foundational concept
  | 'MISCONCEPTION_DETECTED'   // Diagnostic signal identified an active cognitive distortion
  | 'DELAYED_REVIEW_DUE'       // Spaced retention decay threshold reached
  | 'EXAM_APPROACHING'         // Exam planner date requires high-yield retention
  | 'LESSON_NEXT_IN_SEQUENCE'  // Natural forward progression through syllabus
  | 'ASSISTED_TO_INDEPENDENT'; // Concept completed with scaffolding; now needs unassisted proof

export type RecommendationPriority =
  | 'LOW'              // Enrichment / non-urgent review
  | 'MEDIUM'           // Standard next lesson in sequence
  | 'HIGH'             // Spaced review due or assisted concept awaiting proof
  | 'CRITICAL_BLOCKER'; // Missing prerequisite preventing comprehension of current topic

export type RecommendationStatus =
  | 'ACTIVE'
  | 'DISMISSED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'SUPERSEDED';

/**
 * Actionable, prioritized recommendation for the student's next optimal learning step.
 */
export interface RecommendationRecord {
  id: string;
  studentId: string;
  triggeredBy: RecommendationTrigger;
  recommendedConceptId: ConceptId;
  /** Clear, human-readable pedagogical explanation of why this was recommended */
  reason: string;
  priority: RecommendationPriority;
  status: RecommendationStatus;
  createdAt: string; // ISO 8601
  resolvedAt?: string;
  /** Direct navigation target if the recommendation opens an interactive tool */
  actionTarget?: {
    view?: View;
    lessonId?: string;
    assessmentId?: string;
    subjectId?: string;
  };
}

// ============================================================================
// 8. THE 5 DISTINCT DIMENSIONS OF LEARNING (EXPLICIT ARCHITECTURAL SEPARATION)
// ============================================================================

/**
 * Dimension 1: Static platform readiness / curriculum availability.
 * Does ATPLVector offer lessons, 3D scenes, or questions for this syllabus code?
 */
export interface PlatformCurriculumCoverage {
  subjectId: string;
  totalOfficialLOs: number;
  coveredLOs: number;
  interactiveViewsAvailable: View[];
  coveragePercentage: number;
  isFullyImplemented: boolean;
}

/**
 * Dimension 2: Student exposure and lesson participation.
 * Has the student opened the lesson, watched the lecture, or explored the 3D scene?
 */
export interface StudentLessonActivity {
  lessonId: string;
  studentId: string;
  watched: boolean;
  notes: string;
  timeSpentSeconds: number;
  completedActivities: string[]; // activityIds
  isCompleted: boolean;
  firstAccessedAt: string;
  lastAccessedAt: string;
}

/**
 * Dimension 3: Scaffolded / Assisted performance.
 * What can the student solve with hints, step-by-step reasoning, or AI explanations?
 */
export interface StudentAssistedPerformance {
  conceptId: ConceptId;
  assistedAccuracy: number; // percentage
  totalAssistedAttempts: number;
  averageHintsPerAttempt: number;
  reasoningChainsConsulted: number;
}

/**
 * Dimension 4: Independent unassisted demonstrated understanding.
 * Can the student solve questions and diagnostic scenarios under closed-book conditions?
 */
export interface StudentIndependentDemonstration {
  conceptId: ConceptId;
  demonstratedScore: number;
  demonstratedAt: string; // ISO
  unassistedStreak: number;
  isCurrentSessionMastered: boolean;
}

/**
 * Dimension 5: Retained understanding over time (decay resistance).
 * Has the knowledge consolidated into long-term memory across spaced intervals?
 */
export interface StudentRetainedUnderstanding {
  conceptId: ConceptId;
  retentionIntervalDays: number;
  totalRepetitions: number;
  stabilityScore: number; // Estimated probability of retrieval today
  isCurrentlyDue: boolean;
  dueAt: string;
}

/**
 * Unified Student Profile Scorecard aggregating all 5 dimensions cleanly.
 */
export interface StudentCognitiveScorecard {
  studentId: string;
  subjectId: string;
  /** Dimension 1 */
  platformCoverage: PlatformCurriculumCoverage;
  /** Dimension 2 */
  lessonsCompletedCount: number;
  totalLessonsInSubject: number;
  /** Dimension 3 */
  conceptsInAssistedStateCount: number;
  /** Dimension 4 */
  conceptsDemonstratedCount: number;
  /** Dimension 5 */
  conceptsRetainedCount: number;
  /** Overall subject mastery index (weighted by Dimension 4 and 5) */
  compositeMasteryPercentage: number;
}
