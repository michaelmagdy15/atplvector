import {
  FoundationRecommendationEngine,
  StudentConceptState,
  StudentEvidenceRecord,
  foundationEngine
} from '../services/foundationRecommendationEngine';

function runValidationSuite() {
  console.log('=============================================================');
  console.log('ATPLVector Foundation Recommendation Engine - Validation Suite');
  console.log('=============================================================\n');

  const engine = new FoundationRecommendationEngine();
  let passedCount = 0;
  let testCount = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    testCount++;
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passedCount++;
    } else {
      console.error(`[FAIL] ${testName} - ${details || 'Assertion failed'}`);
    }
  }

  // --------------------------------------------------------------------------
  // TEST 1: Misconception Signal Detection (Subscale Sign Inversion)
  // --------------------------------------------------------------------------
  console.log('--- TEST GROUP 1: Specific Misconception Signals ---');
  const resSubscale = engine.classifyError('QEBR35TI4', 2, 45); // option 2 is 3600 ft
  assert(
    resSubscale.misconceptionCode === 'MISCON_SUBSCALE_SIGN_INVERSION',
    'Detects MISCON_SUBSCALE_SIGN_INVERSION on QEBR35TI4 (3600 ft selected)',
    `Expected MISCON_SUBSCALE_SIGN_INVERSION, got: ${resSubscale.misconceptionCode}`
  );
  assert(
    resSubscale.classification === 'CONCEPTUAL_MISUNDERSTANDING',
    'Classified as CONCEPTUAL_MISUNDERSTANDING',
    `Got: ${resSubscale.classification}`
  );
  assert(
    resSubscale.targetConcept === 'FND_PRESSURE_LAPSE',
    'Target concept is FND_PRESSURE_LAPSE',
    `Got: ${resSubscale.targetConcept}`
  );

  // --------------------------------------------------------------------------
  // TEST 2: Altimeter Temperature Correction Sign Inversion
  // --------------------------------------------------------------------------
  const resColdSign = engine.classifyError('Q_ALT_TEMP_COLD_01', 0, 50); // option 0 is 10600 ft
  assert(
    resColdSign.misconceptionCode === 'MISCON_TEMP_CORR_SIGN_INVERSION',
    'Detects MISCON_TEMP_CORR_SIGN_INVERSION on cold air correction (10600 ft selected)',
    `Got: ${resColdSign.misconceptionCode}`
  );
  assert(
    resColdSign.targetConcept === 'FND_ALTIMETER_TEMP_ERR',
    'Target concept is FND_ALTIMETER_TEMP_ERR',
    `Got: ${resColdSign.targetConcept}`
  );

  // --------------------------------------------------------------------------
  // TEST 3: Absolute Temp vs Delta-ISA Confusion
  // --------------------------------------------------------------------------
  const resAbsTemp = engine.classifyError('Q_ALT_TEMP_COLD_01', 2, 52); // option 2 is 9200 ft
  assert(
    resAbsTemp.misconceptionCode === 'MISCON_ISA_DEV_VS_ABS_TEMP',
    'Detects MISCON_ISA_DEV_VS_ABS_TEMP when student uses ambient -20°C instead of Delta-ISA',
    `Got: ${resAbsTemp.misconceptionCode}`
  );
  assert(
    resAbsTemp.targetConcept === 'FND_ISA_MODEL',
    'Target concept is FND_ISA_MODEL',
    `Got: ${resAbsTemp.targetConcept}`
  );

  // --------------------------------------------------------------------------
  // TEST 4: Neglecting Air Density on TAS
  // --------------------------------------------------------------------------
  const resTasDensity = engine.classifyError('Q_POF_TAS_DENSITY_01', 0, 30);
  assert(
    resTasDensity.misconceptionCode === 'MISCON_NEGLECT_DENSITY_ON_TAS',
    'Detects MISCON_NEGLECT_DENSITY_ON_TAS at FL300',
    `Got: ${resTasDensity.misconceptionCode}`
  );
  assert(
    resTasDensity.targetConcept === 'FND_AIR_DENSITY_EFFECT',
    'Target concept is FND_AIR_DENSITY_EFFECT',
    `Got: ${resTasDensity.targetConcept}`
  );

  // --------------------------------------------------------------------------
  // TEST 5: Arithmetic Error vs Conceptual Misunderstanding Discrimination
  // --------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 2: Arithmetic Error vs Conceptual Discrimination ---');
  const resArith = engine.classifyError('Q_ALT_TEMP_COLD_01', 3, 50); // option 3 is 9460 ft
  assert(
    resArith.classification === 'ARITHMETIC_SLIP',
    'Discrimination: Option 3 (9460 ft) classified as ARITHMETIC_SLIP',
    `Got: ${resArith.classification}`
  );
  assert(
    resArith.targetConcept === 'FND_CALCULATION_PRECISION',
    'Target concept is FND_CALCULATION_PRECISION (not remedial foundation)',
    `Got: ${resArith.targetConcept}`
  );

  // Test guessing detection (< 8s pacing on 60s question)
  const resGuess = engine.classifyError('Q_ALT_TEMP_COLD_01', 0, 3);
  assert(
    resGuess.classification === 'TIME_PRESSURE_GUESS',
    'Discrimination: Response under minimum threshold (3s < 8s) flagged as TIME_PRESSURE_GUESS',
    `Got: ${resGuess.classification}`
  );

  // --------------------------------------------------------------------------
  // TEST 6: State Machine Progression & Transition Logic
  // --------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 3: StudentConceptState State Transitions ---');
  const initialConceptState: StudentConceptState = {
    studentId: 'pilot_cadet_007',
    conceptId: 'FND_ALTIMETER_TEMP_ERR',
    status: 'unknown',
    consecutiveIndependentCorrect: 0,
    consecutiveFailures: 0,
    totalAttempts: 0,
    totalSuccesses: 0,
    lastEvidenceTimestamp: new Date().toISOString(),
    stabilityDays: 7,
    detectedMisconceptions: [],
    bypassGranted: false,
    history: []
  };

  // Step A: First attempt has conceptual misunderstanding -> transitions to 'needs_foundation'
  const evWrongSign: StudentEvidenceRecord = {
    studentId: 'pilot_cadet_007',
    questionId: 'Q_ALT_TEMP_COLD_01',
    selectedOptionIndex: 0, // sign inverted
    isCorrect: false,
    timeSpentSeconds: 45,
    helpRequested: false,
    attemptNumber: 1,
    timestamp: '2026-10-11T12:00:00Z'
  };

  const step1 = engine.processEvidence(initialConceptState, evWrongSign);
  assert(
    step1.updatedState.status === 'needs_foundation',
    'Step A: Conceptual error transitions status from "unknown" to "needs_foundation"',
    `Got: ${step1.updatedState.status}`
  );
  assert(
    step1.recommendationRequired === true,
    'Step A: Recommendation flag is triggered',
    `Got: ${step1.recommendationRequired}`
  );
  assert(
    step1.updatedState.detectedMisconceptions.includes('MISCON_TEMP_CORR_SIGN_INVERSION'),
    'Step A: Misconception MISCON_TEMP_CORR_SIGN_INVERSION recorded in state',
    `Detected misconceptions: ${JSON.stringify(step1.updatedState.detectedMisconceptions)}`
  );

  // Step B: Student answers correctly with help -> transitions to 'demonstrated_with_help'
  const evHelpCorrect: StudentEvidenceRecord = {
    studentId: 'pilot_cadet_007',
    questionId: 'Q_ALT_TEMP_COLD_01',
    selectedOptionIndex: 1, // correct
    isCorrect: true,
    timeSpentSeconds: 65,
    helpRequested: true, // Used hint/chain
    attemptNumber: 2,
    timestamp: '2026-10-11T12:15:00Z'
  };

  const step2 = engine.processEvidence(step1.updatedState, evHelpCorrect);
  assert(
    step2.updatedState.status === 'demonstrated_with_help',
    'Step B: Correct answer with hint/chain transitions to "demonstrated_with_help"',
    `Got: ${step2.updatedState.status}`
  );

  // Step C: Student answers correctly independently (1st time) -> advances to 'learning' / demonstrated_with_help
  const evIndepCorrect1: StudentEvidenceRecord = {
    studentId: 'pilot_cadet_007',
    questionId: 'Q_ALT_TEMP_COLD_01',
    selectedOptionIndex: 1,
    isCorrect: true,
    timeSpentSeconds: 40,
    helpRequested: false,
    attemptNumber: 3,
    timestamp: '2026-10-11T12:30:00Z'
  };

  const step3 = engine.processEvidence(step2.updatedState, evIndepCorrect1);
  assert(
    step3.updatedState.consecutiveIndependentCorrect === 1,
    'Step C: 1st independent correct answer increments consecutive count to 1',
    `Got: ${step3.updatedState.consecutiveIndependentCorrect}`
  );

  // Step D: Student answers 2nd question correctly independently -> BYPASS / 'demonstrated_independently'
  const evIndepCorrect2: StudentEvidenceRecord = {
    studentId: 'pilot_cadet_007',
    questionId: 'Q_ALT_TEMP_COLD_01',
    selectedOptionIndex: 1,
    isCorrect: true,
    timeSpentSeconds: 35,
    helpRequested: false,
    attemptNumber: 4,
    timestamp: '2026-10-11T12:45:00Z'
  };

  const step4 = engine.processEvidence(step3.updatedState, evIndepCorrect2);
  assert(
    step4.updatedState.status === 'demonstrated_independently',
    'Step D: 2 consecutive independent answers transition status to "demonstrated_independently"',
    `Got: ${step4.updatedState.status}`
  );
  assert(
    step4.updatedState.bypassGranted === true,
    'Step D: bypassGranted is set to true',
    `Got: ${step4.updatedState.bypassGranted}`
  );
  assert(
    step4.updatedState.reviewDueDate !== undefined,
    'Step D: reviewDueDate is scheduled based on stabilityDays',
    `Got: ${step4.updatedState.reviewDueDate}`
  );

  // --------------------------------------------------------------------------
  // TEST 7: Immediate Skip / Bypass Evaluation
  // --------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 4: Immediate Skip / Bypass Evaluation ---');
  const bypassCheck = engine.evaluateBypassEligibility(step4.updatedState, [evIndepCorrect1, evIndepCorrect2]);
  assert(
    bypassCheck.canBypass === true,
    'Bypass evaluation confirms student can skip foundation remediation',
    `Reason: ${bypassCheck.reason}`
  );

  // --------------------------------------------------------------------------
  // TEST 8: Transparent Rationale Generation
  // --------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 5: Transparent Rationale Generation ---');
  const rationale = engine.generateRationale(
    'FND_ALTIMETER_TEMP_ERR',
    evWrongSign,
    'CONCEPTUAL_MISUNDERSTANDING',
    'MISCON_TEMP_CORR_SIGN_INVERSION'
  );

  assert(
    rationale.triggerQuestionId === 'Q_ALT_TEMP_COLD_01',
    'Rationale records correct trigger question ID',
    `Got: ${rationale.triggerQuestionId}`
  );
  assert(
    rationale.summary.includes('Inverted Sign'),
    'Rationale summary explicitly states the misconception',
    `Got: ${rationale.summary}`
  );
  assert(
    rationale.aviationPrincipleConsequence.includes('Look Out Below'),
    'Rationale includes operational rule of thumb ("Look Out Below")',
    `Got: ${rationale.aviationPrincipleConsequence}`
  );
  assert(
    rationale.pedagogicalObjective.includes('AltimeterLab'),
    'Rationale directs student to specific interactive tool (AltimeterLab)',
    `Got: ${rationale.pedagogicalObjective}`
  );

  // --------------------------------------------------------------------------
  // TEST 9: Active Recommendation Generation
  // --------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 6: Recommendation Generation ---');
  const activeRecs = engine.generateRecommendations([step1.updatedState], evWrongSign);
  assert(
    activeRecs.length === 1,
    'Generates exactly 1 recommendation for concept in "needs_foundation"',
    `Got: ${activeRecs.length}`
  );
  assert(
    activeRecs[0].conceptId === 'FND_ALTIMETER_TEMP_ERR',
    'Recommendation is for FND_ALTIMETER_TEMP_ERR',
    `Got: ${activeRecs[0].conceptId}`
  );
  // --------------------------------------------------------------------------
  // TEST 10: Navigation Foundation Misconceptions
  // --------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 7: Navigation Triangle & 1-in-60 Misconceptions ---');
  const evNavWind = {
    studentId: 'pilot-test-nav',
    questionId: 'Q_NAV_DRIFT_01',
    selectedOptionIndex: 2,
    isCorrect: false,
    timeSpentSeconds: 40,
    helpRequested: false,
    attemptNumber: 1,
    timestamp: new Date().toISOString()
  };
  const ratNavWind = engine.generateRationale('FND_WIND_TRIANGLE_DRFT', evNavWind, 'CONCEPTUAL_MISUNDERSTANDING', 'MISCON_WIND_VECTOR_DIRECTION');
  assert(
    ratNavWind.summary.includes('Wind Vector Origin'),
    'Detects and generates rationale for MISCON_WIND_VECTOR_DIRECTION',
    `Got: ${ratNavWind.summary}`
  );
  assert(
    ratNavWind.aviationPrincipleConsequence.includes('FROM'),
    'Explains that aviation winds are reported as direction FROM which air moves',
    `Got: ${ratNavWind.aviationPrincipleConsequence}`
  );

  const ratNavDrift = engine.generateRationale('FND_WIND_TRIANGLE_DRFT', evNavWind, 'CONCEPTUAL_MISUNDERSTANDING', 'MISCON_DRIFT_SIGN_INVERSION');
  assert(
    ratNavDrift.summary.includes('Inverted Drift'),
    'Detects and generates rationale for MISCON_DRIFT_SIGN_INVERSION',
    `Got: ${ratNavDrift.summary}`
  );

  const ratNav1in60 = engine.generateRationale('FND_ONE_IN_SIXTY_RULE', evNavWind, 'CONCEPTUAL_MISUNDERSTANDING', 'MISCON_1_IN_60_CLOSING_ANGLE');
  assert(
    ratNav1in60.summary.includes('Closing Angle'),
    'Detects and generates rationale for MISCON_1_IN_60_CLOSING_ANGLE',
    `Got: ${ratNav1in60.summary}`
  );

  console.log('\n=============================================================');
  console.log(`Validation Suite Complete: ${passedCount}/${testCount} tests passed.`);
  console.log('=============================================================\n');

  if (passedCount !== testCount) {
    process.exit(1);
  }
}

runValidationSuite();
