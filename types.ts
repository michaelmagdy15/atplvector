
export enum View {
  // Platform Level
  PLATFORM_DASHBOARD = 'PLATFORM_DASHBOARD',
  PROFILE = 'PROFILE',
  ACCOUNT_SETTINGS = 'ACCOUNT_SETTINGS',
  SYLLABUS_VIEWER = 'SYLLABUS_VIEWER',
  FLASHCARDS = 'FLASHCARDS',
  SUBSCRIPTION_MANAGEMENT = 'SUBSCRIPTION_MANAGEMENT',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  STUDY_GUIDE = 'STUDY_GUIDE',
  QUESTION_BANK = 'QUESTION_BANK',
  EXAM_PLANNER = 'EXAM_PLANNER',
  PROGRESS_DASHBOARD = 'PROGRESS_DASHBOARD',
  PLATFORM_PROGRESS = 'PLATFORM_PROGRESS',

  // Auth Specific
  AUTH_LOGIN = 'AUTH_LOGIN',
  AUTH_SIGNUP = 'AUTH_SIGNUP',
  AUTH_FORGOT_PASSWORD = 'AUTH_FORGOT_PASSWORD',
  AUTH_RECOVER_EMAIL = 'AUTH_RECOVER_EMAIL',
  AUTH_RESET_PASSWORD = 'AUTH_RESET_PASSWORD', // New view for handling token callback

  // Air Law Subject (010)
  AIR_LAW_HOME = 'AIR_LAW_HOME',
  AIR_LAW_ANNEXES = 'AIR_LAW_ANNEXES',
  AIR_LAW_INT_LAW = 'AIR_LAW_INT_LAW',
  AIR_LAW_DOCS = 'AIR_LAW_DOCS',
  AIR_LAW_PERSONNEL = 'AIR_LAW_PERSONNEL',
  AIR_LAW_OPS_INFO = 'AIR_LAW_OPS_INFO',
  AIR_LAW_SECURITY = 'AIR_LAW_SECURITY',
  AIR_LAW_ACCIDENT = 'AIR_LAW_ACCIDENT',
  AIR_LAW_SAR = 'AIR_LAW_SAR',
  AIR_LAW_RULES_OF_AIR = 'AIR_LAW_RULES_OF_AIR',
  AIR_LAW_CRUISING = 'AIR_LAW_CRUISING',
  AIR_LAW_INTERCEPT = 'AIR_LAW_INTERCEPT',
  AIR_LAW_EMERGENCY = 'AIR_LAW_EMERGENCY',
  AIR_LAW_LAYERS = 'AIR_LAW_LAYERS',
  AIR_LAW_IFR_VFR = 'AIR_LAW_IFR_VFR',
  AIR_LAW_INSTRUMENT = 'AIR_LAW_INSTRUMENT',
  AIR_LAW_HOLDING = 'AIR_LAW_HOLDING',
  AIR_LAW_ALTIMETER = 'AIR_LAW_ALTIMETER',
  AIR_LAW_REF_CODE = 'AIR_LAW_REF_CODE',
  AIR_LAW_SURFACE_CON = 'AIR_LAW_SURFACE_CON',
  AIR_LAW_RUNWAY_LIGHT = 'AIR_LAW_RUNWAY_LIGHT',
  AIR_LAW_TAXIWAY_LIGHT = 'AIR_LAW_TAXIWAY_LIGHT',
  AIR_LAW_SURFACE_LIGHT = 'AIR_LAW_SURFACE_LIGHT',
  AIR_LAW_AERODROME_VIS = 'AIR_LAW_AERODROME_VIS',
  AIR_LAW_SIGNS = 'AIR_LAW_SIGNS',
  AIR_LAW_RWSL = 'AIR_LAW_RWSL',
  AIR_LAW_TVASIS = 'AIR_LAW_TVASIS',
  AIR_LAW_LIGHTING = 'AIR_LAW_LIGHTING', // Summary
  AIR_LAW_LIGHTGUN = 'AIR_LAW_LIGHTGUN',
  AIR_LAW_REGISTRATION = 'AIR_LAW_REGISTRATION',
  AIR_LAW_WEATHER = 'AIR_LAW_WEATHER',
  AIR_LAW_DECLARED_DIST = 'AIR_LAW_DECLARED_DIST',
  AIR_LAW_ORG = 'AIR_LAW_ORG',
  AIR_LAW_AIRWORTHINESS = 'AIR_LAW_AIRWORTHINESS',
  AIR_LAW_PANS_OPS = 'AIR_LAW_PANS_OPS',
  AIR_LAW_RULES_DETAILS = 'AIR_LAW_RULES_DETAILS',
  AIR_LAW_LIABILITY = 'AIR_LAW_LIABILITY',
  AIR_LAW_GROUND_OPS = 'AIR_LAW_GROUND_OPS',
  AIR_LAW_FACILITATION = 'AIR_LAW_FACILITATION',
  AIR_LAW_PARALLEL_RWY = 'AIR_LAW_PARALLEL_RWY',
  AIR_LAW_AIS_DEEP_DIVE = 'AIR_LAW_AIS_DEEP_DIVE',
  AIR_LAW_CONVENTIONS = 'AIR_LAW_CONVENTIONS',

  // AGK (021/022)
  AGK_HOME = 'AGK_HOME',
  AGK_SYSTEMS_HOME = 'AGK_SYSTEMS_HOME', // 021
  AGK_INSTRUMENTS_HOME = 'AGK_INSTRUMENTS_HOME', // 022
  AGK_HYDRAULICS = 'AGK_HYDRAULICS',
  AGK_JET_ENGINE = 'AGK_JET_ENGINE',
  AGK_PISTON_ENGINE = 'AGK_PISTON_ENGINE',
  AGK_ELECTRICS = 'AGK_ELECTRICS',
  AGK_LANDING_GEAR = 'AGK_LANDING_GEAR',
  AGK_FLIGHT_CONTROLS = 'AGK_FLIGHT_CONTROLS',
  AGK_ASI = 'AGK_ASI',
  AGK_GYROS = 'AGK_GYROS',

  // Mass & Balance (031)
  MASS_BAL_HOME = 'MASS_BAL_HOME',
  MASS_BAL_DEFINITIONS = 'MASS_BAL_DEFINITIONS',
  MASS_BAL_CG_CALC = 'MASS_BAL_CG_CALC',
  MASS_BAL_LIMITS = 'MASS_BAL_LIMITS',
  MASS_BAL_MAC = 'MASS_BAL_MAC',
  MASS_BAL_FUEL = 'MASS_BAL_FUEL',
  MASS_BAL_SHIFT = 'MASS_BAL_SHIFT',
  MASS_BAL_LOADSHEET = 'MASS_BAL_LOADSHEET',
  MASS_BAL_FLOW_DIAGRAM = 'MASS_BAL_FLOW_DIAGRAM',
  MASS_BAL_CG_SHIFT = 'MASS_BAL_CG_SHIFT',
  MASS_BAL_TRIM_SHEET = 'MASS_BAL_TRIM_SHEET',
  MASS_BAL_CONVERTER = 'MASS_BAL_CONVERTER',
  MASS_BAL_EFFECTS = 'MASS_BAL_EFFECTS',
  MASS_BAL_CG_EFFECTS = 'MASS_BAL_CG_EFFECTS',
  MASS_BAL_STRUCTURAL = 'MASS_BAL_STRUCTURAL',
  MASS_BAL_STALL_SPEED = 'MASS_BAL_STALL_SPEED',
  MASS_BAL_FLEET = 'MASS_BAL_FLEET',
  MASS_BAL_CARGO_TYPES = 'MASS_BAL_CARGO_TYPES',
  MASS_BAL_STD_MASSES = 'MASS_BAL_STD_MASSES',
  MASS_BAL_QUIZ = 'MASS_BAL_QUIZ', // New Guided Practice Wizard

  // Performance (032)
  PERF_HOME = 'PERF_HOME',
  PERF_INTRO = 'PERF_INTRO',
  PERF_AERODROME = 'PERF_AERODROME',
  PERF_TAKEOFF = 'PERF_TAKEOFF',
  PERF_CLIMB = 'PERF_CLIMB',
  PERF_CRUISE = 'PERF_CRUISE',
  PERF_LANDING = 'PERF_LANDING',
  PERF_CLASS_B = 'PERF_CLASS_B',
  PERF_CLASS_A = 'PERF_CLASS_A',

  // Flight Planning (033)
  FLIGHT_PLAN_HOME = 'FLIGHT_PLAN_HOME',
  FLIGHT_PLAN_INTRO = 'FLIGHT_PLAN_INTRO',
  FLIGHT_PLAN_FUEL = 'FLIGHT_PLAN_FUEL',
  FLIGHT_PLAN_IFR = 'FLIGHT_PLAN_IFR',
  FLIGHT_PLAN_SIG_POINTS = 'FLIGHT_PLAN_SIG_POINTS',

  // Human Performance (040)
  HPL_HOME = 'HPL_HOME',
  HPL_PHYSIOLOGY = 'HPL_PHYSIOLOGY',
  HPL_BASIC_CONCEPTS = 'HPL_BASIC_CONCEPTS', // 01
  HPL_SLEEP = 'HPL_SLEEP', // 02
  HPL_INFO_PROCESSING = 'HPL_INFO_PROCESSING', // 03.01-02
  HPL_ERROR_DECISION = 'HPL_ERROR_DECISION', // 03.03
  HPL_COMMS_STRESS = 'HPL_COMMS_STRESS', // 03.04-06
  HPL_BEHAVIOUR = 'HPL_BEHAVIOUR', // 03.05
  HPL_COCKPIT_MGMT = 'HPL_COCKPIT_MGMT', // 03.04
  HPL_VISION = 'HPL_VISION',
  HPL_HEARING = 'HPL_HEARING',
  HPL_HEALTH = 'HPL_HEALTH',
  HPL_TEM = 'HPL_TEM', // 040.03
  HPL_SHELL = 'HPL_SHELL', // 040.01
  HPL_SAFETY = 'HPL_SAFETY', // 040.01
  HPL_ACCELERATION = 'HPL_ACCELERATION',
  HPL_TOXIC = 'HPL_TOXIC',
  HPL_INCAPACITATION = 'HPL_INCAPACITATION',
  HPL_AUTOMATION = 'HPL_AUTOMATION',
  HPL_VESTIBULAR = 'HPL_VESTIBULAR',
  HPL_MEMORY = 'HPL_MEMORY',
  HPL_LEARNING = 'HPL_LEARNING',
  HPL_PERSONALITY = 'HPL_PERSONALITY',
  HPL_ATMOSPHERE = 'HPL_ATMOSPHERE',
  HPL_INCIDENTS = 'HPL_INCIDENTS',
  HPL_RESPIRATION = 'HPL_RESPIRATION',
  HPL_CIRCULATION = 'HPL_CIRCULATION',
  HPL_NERVOUS = 'HPL_NERVOUS',
  HPL_METABOLISM = 'HPL_METABOLISM',
  HPL_ERGONOMICS = 'HPL_ERGONOMICS',
  HPL_BIASES = 'HPL_BIASES',
  HPL_CULTURE = 'HPL_CULTURE',
  HPL_RADIATION = 'HPL_RADIATION',
  HPL_THERMAL = 'HPL_THERMAL',
  HPL_SLEEP_DISORDERS = 'HPL_SLEEP_DISORDERS',
  HPL_PRESSURE = 'HPL_PRESSURE',           // Barotrauma, decompression
  HPL_MOTION_SICKNESS = 'HPL_MOTION_SICKNESS', // Sensory conflict theory
  HPL_PERCEPTION = 'HPL_PERCEPTION',       // Visual illusions, runway illusions
  HPL_WORKLOAD = 'HPL_WORKLOAD',           // Workload management, Yerkes-Dodson
  HPL_COMMUNICATION_PROCESS = 'HPL_COMMUNICATION_PROCESS',
  HPL_COMPETENCY = 'HPL_COMPETENCY',
  HPL_COOPERATION = 'HPL_COOPERATION',
  HPL_HEALTH_HYGIENE = 'HPL_HEALTH_HYGIENE',
  HPL_TROPICAL_DISEASES = 'HPL_TROPICAL_DISEASES',

  // Meteorology (050)
  MET_HOME = 'MET_HOME',
  MET_ATMOSPHERE = 'MET_ATMOSPHERE',
  MET_WIND = 'MET_WIND',
  MET_HUMIDITY = 'MET_HUMIDITY',
  MET_CIRCULATION = 'MET_CIRCULATION',
  MET_FRONTS = 'MET_FRONTS',
  MET_CLOUDS = 'MET_CLOUDS',
  MET_TEMPERATURE = 'MET_TEMPERATURE',
  MET_ALTIMETRY = 'MET_ALTIMETRY',
  MET_PRECIPITATION = 'MET_PRECIPITATION',
  MET_PRESSURE = 'MET_PRESSURE',
  MET_DENSITY = 'MET_DENSITY',
  MET_VISIBILITY = 'MET_VISIBILITY',
  MET_ICING = 'MET_ICING',
  MET_THUNDERSTORMS = 'MET_THUNDERSTORMS',
  MET_AIR_MASSES = 'MET_AIR_MASSES',
  MET_TURBULENCE = 'MET_TURBULENCE',
  MET_JET_STREAMS = 'MET_JET_STREAMS',
  MET_CLIMATOLOGY = 'MET_CLIMATOLOGY',
  MET_LOCAL_WINDS = 'MET_LOCAL_WINDS',
  MET_DEPRESSIONS_ANTICYCLONES = 'MET_DEPRESSIONS_ANTICYCLONES',
  MET_CLOUD_TYPES = 'MET_CLOUD_TYPES',
  MET_METAR_TAF = 'MET_METAR_TAF',
  MET_CHARTS = 'MET_CHARTS',
  MET_TRS = 'MET_TRS',
  MET_SPECIAL_HAZARDS = 'MET_SPECIAL_HAZARDS',
  MET_SATELLITE = 'MET_SATELLITE',
  MET_OPTICAL = 'MET_OPTICAL',
  MET_STATION_MODEL = 'MET_STATION_MODEL',

  // Navigation (061/062)
  NAV_HOME = 'NAV_HOME',
  RAD_NAV_HOME = 'RAD_NAV_HOME', // 062
  NAV_60_1 = 'NAV_60_1',
  NAV_TIME = 'NAV_TIME',
  NAV_GNSS = 'NAV_GNSS',
  NAV_NDB_VOR = 'NAV_NDB_VOR',

  // Radio Navigation (062) Interactive Components
  RAD_NAV_WAVE_PROP = 'RAD_NAV_WAVE_PROP',
  RAD_NAV_SPECTRUM = 'RAD_NAV_SPECTRUM',
  RAD_NAV_MODULATION = 'RAD_NAV_MODULATION',
  RAD_NAV_ANTENNA = 'RAD_NAV_ANTENNA',
  RAD_NAV_IONOSPHERE = 'RAD_NAV_IONOSPHERE',
  RAD_NAV_VDF = 'RAD_NAV_VDF',
  RAD_NAV_ADF = 'RAD_NAV_ADF',
  RAD_NAV_VOR = 'RAD_NAV_VOR',
  RAD_NAV_DME = 'RAD_NAV_DME',
  RAD_NAV_ILS = 'RAD_NAV_ILS',
  RAD_NAV_MLS = 'RAD_NAV_MLS',
  RAD_NAV_RADAR = 'RAD_NAV_RADAR',
  RAD_NAV_SSR = 'RAD_NAV_SSR',
  RAD_NAV_RNAV = 'RAD_NAV_RNAV',
  RAD_NAV_FMS = 'RAD_NAV_FMS',
  RAD_NAV_SBAS = 'RAD_NAV_SBAS',
  RAD_NAV_CLASS_1 = 'RAD_NAV_CLASS_1', // Class 1: Radio Fundamentals
  RAD_NAV_WX_RADAR = 'RAD_NAV_WX_RADAR', // Class 10: Weather Radar

  // General Navigation (061)
  GEN_NAV_HOME = 'GEN_NAV_HOME',
  GEN_NAV_BASICS = 'GEN_NAV_BASICS', // 061.01 Basics of Navigation
  GEN_NAV_VFR = 'GEN_NAV_VFR', // 061.02 VFR Navigation (Dead Reckoning)
  GEN_NAV_EARTH = 'GEN_NAV_EARTH', // 061.03 Great Circles and Rhumb Lines
  GEN_NAV_CHARTS = 'GEN_NAV_CHARTS', // 061.04 Charts
  GEN_NAV_TIME = 'GEN_NAV_TIME', // 061.05 Time
  GEN_NAV_WIND_TRIANGLE = 'GEN_NAV_WIND_TRIANGLE', // Wind triangle problems
  GEN_NAV_MAPS = 'GEN_NAV_MAPS', // Map reading
  GEN_NAV_SOLAR = 'GEN_NAV_SOLAR', // Solar time and position
  GEN_NAV_POLAR = 'GEN_NAV_POLAR', // Polar navigation

  // Ops Procedures (070)
  OPS_PROC_HOME = 'OPS_PROC_HOME',
  OPS_LONG_RANGE = 'OPS_LONG_RANGE',
  OPS_SPECIAL = 'OPS_SPECIAL',
  OPS_FTL = 'OPS_FTL',
  OPS_AWO = 'OPS_AWO',
  OPS_GENERAL = 'OPS_GENERAL',

  // Principles of Flight (081)
  POF_HOME = 'POF_HOME',
  POF_ATMOSPHERE = 'POF_ATMOSPHERE',
  POF_AIRFLOW = 'POF_AIRFLOW',
  POF_AEROFOIL = 'POF_AEROFOIL',
  POF_WING_GEOM = 'POF_WING_GEOM',
  POF_COEFFICIENTS = 'POF_COEFFICIENTS',
  POF_3D_AIRFLOW = 'POF_3D_AIRFLOW',
  POF_DRAG = 'POF_DRAG',
  POF_GROUND_EFFECT = 'POF_GROUND_EFFECT',
  POF_HIGH_LIFT = 'POF_HIGH_LIFT',
  POF_LIFT_DRAG = 'POF_LIFT_DRAG',
  POF_STALL = 'POF_STALL',
  POF_STABILITY = 'POF_STABILITY',
  POF_CONTROL = 'POF_CONTROL',
  POF_LIMITATIONS = 'POF_LIMITATIONS',
  POF_PROPELLERS = 'POF_PROPELLERS',
  POF_FLIGHT_MECHANICS = 'POF_FLIGHT_MECHANICS',
  POF_HIGH_SPEED = 'POF_HIGH_SPEED',



  // Communications Subject (090)
  DASHBOARD = 'DASHBOARD',
  REFERENCE = 'REFERENCE',
  LIGHT_GUN = 'LIGHT_GUN',
  VHF_CALC = 'VHF_CALC',
  AI_QUIZ = 'AI_QUIZ',
  AI_ROLEPLAY = 'AI_ROLEPLAY',
  PHONETIC = 'PHONETIC',
  TRANSPONDER = 'TRANSPONDER',
  METAR = 'METAR',
  EMERGENCY = 'EMERGENCY',
  READBACK = 'READBACK',
  MORSE = 'MORSE',
  WORD_MATCH = 'WORD_MATCH',
  FREQ_EXPLORER = 'FREQ_EXPLORER',
  TIME_ZONER = 'TIME_ZONER',
  QCODE_CARDS = 'QCODE_CARDS',
  AIRSPACE = 'AIRSPACE',
  HOLDING = 'HOLDING',
  ALTIMETER = 'ALTIMETER',
  RUNWAY = 'RUNWAY',
  INTERCEPT = 'INTERCEPT',
  SNOWTAM = 'SNOWTAM',
  WAKE_TURB = 'WAKE_TURB',
  POS_REPORT = 'POS_REPORT',
  COMM_FAIL = 'COMM_FAIL',
  PRIORITY = 'PRIORITY',
  CLOUD_MASTER = 'CLOUD_MASTER',
  RVR_SIM = 'RVR_SIM',
  FLIRT_TRAINER = 'FLIRT_TRAINER',
  TIME_REPORT = 'TIME_REPORT',
  SERVICE_CODES = 'SERVICE_CODES',
  SUFFIX_MATCH = 'SUFFIX_MATCH',
  Q_COMPASS = 'Q_COMPASS',
  BAND_SPEC = 'BAND_SPEC',
  READABILITY_SIM = 'READABILITY_SIM',
  TRAFFIC_CLOCK = 'TRAFFIC_CLOCK',
  RVR_CODE = 'RVR_CODE',
  PAPI_VIS = 'PAPI_VIS',
  ALT_SPEAK = 'ALT_SPEAK',
  BLIND_TX = 'BLIND_TX',
  AIREP_SPEC = 'AIREP_SPEC',
  ADV_PHRASEOLOGY = 'ADV_PHRASEOLOGY',
  TECH_PHYSICS = 'TECH_PHYSICS',
  EMERGENCY_OPS = 'EMERGENCY_OPS',
  FLIGHT_RULES = 'FLIGHT_RULES',
  PHRASEOLOGY_EXPLORER = 'PHRASEOLOGY_EXPLORER',
  GENERAL_THEORY = 'GENERAL_THEORY',
  RADIO_NAV_DATA = 'RADIO_NAV_DATA',

  // KSA Subject 100
  KSA_HOME = 'KSA_HOME',
  KSA_COMPETENCIES = 'KSA_COMPETENCIES',
  KSA_TEM = 'KSA_TEM',
  KSA_MENTAL_MATHS = 'KSA_MENTAL_MATHS',
  KSA_FORDEC = 'KSA_FORDEC',           // FOR-DEC Decision Model
  KSA_UPRT = 'KSA_UPRT',               // Upset Prevention & Recovery
  KSA_CRM = 'KSA_CRM',                 // CRM Scenarios
  KSA_RESILIENCE = 'KSA_RESILIENCE',   // Resilience Training
  KSA_PROCEDURES = 'KSA_PROCEDURES',   // Application of Procedures

  // NEW 090 SPECIFIC
  VOLMET_SIM = 'VOLMET_SIM',
  VFR_COMMS_SIM = 'VFR_COMMS_SIM',
  PROPAGATION_THEORY = 'PROPAGATION_THEORY',
  WEATHER_MINIMA = 'WEATHER_MINIMA',
  TAXIWAY_LIGHT = 'TAXIWAY_LIGHT',
  SURFACE_LIGHT = 'SURFACE_LIGHT',
  RUNWAY_MARKING = 'RUNWAY_MARKING',
  RADAR_VECTORS = 'RADAR_VECTORS',
  TRANSFER_DRILL = 'TRANSFER_DRILL',
  METAR_BUILDER = 'METAR_BUILDER',
  LEVEL_CHANGES = 'LEVEL_CHANGES',
  CPDLC_SIM = 'CPDLC_SIM',
  URGENCY_TRAINER = 'URGENCY_TRAINER',
  ABBREVIATION_GAME = 'ABBREVIATION_GAME',
  CALLSIGN_TRAINER = 'CALLSIGN_TRAINER',
  SIGMET_DECODER = 'SIGMET_DECODER',
  NUM_TIME_TRANSMIT = 'NUM_TIME_TRANSMIT',
  COMMS_DEFINITIONS = 'COMMS_DEFINITIONS',

  // Visual Concept Lab
  CONCEPT_LAB = 'CONCEPT_LAB',
  CONCEPT_FORCES_OF_FLIGHT = 'CONCEPT_FORCES_OF_FLIGHT',
  CONCEPT_HOLD_ENTRY = 'CONCEPT_HOLD_ENTRY',
  CONCEPT_GREAT_CIRCLE = 'CONCEPT_GREAT_CIRCLE',
  CONCEPT_TURN_PERF = 'CONCEPT_TURN_PERF',
  // AGK Instrumentation (022)
  INST_HOME = 'INST_HOME',
  INST_PITOT_STATIC = 'INST_PITOT_STATIC',
  INST_ALTIMETER = 'INST_ALTIMETER',
  INST_ASI = 'INST_ASI',
  INST_VSI = 'INST_VSI',
  INST_MACHMETER = 'INST_MACHMETER',
  INST_GYROS = 'INST_GYROS',
  INST_ATTITUDE = 'INST_ATTITUDE',
  INST_COMPASS = 'INST_COMPASS',
  INST_NAV_SYSTEMS = 'INST_NAV_SYSTEMS',
  INST_FMS_EFIS = 'INST_FMS_EFIS',
  INST_TURN_INDICATOR = 'INST_TURN_INDICATOR',
  INST_DG = 'INST_DG',
  INST_RADIO_ALT = 'INST_RADIO_ALT',
  INST_GPWS = 'INST_GPWS',
  INST_AUTOPILOT = 'INST_AUTOPILOT',
  INST_AUTOLAND = 'INST_AUTOLAND',

  // Simulators
  MCDU_SIM = 'MCDU_SIM',
}

export enum AuthStatus {
  ANONYMOUS = 'ANONYMOUS',
  SIGNED_UP = 'SIGNED_UP', // Email not verified
  PENDING_APPROVAL = 'PENDING_APPROVAL', // Awaiting admin approval
  FREE_TRIAL = 'FREE_TRIAL', // In free trial period (1 week)
  TRIAL_EXPIRED = 'TRIAL_EXPIRED', // Trial ended, needs subscription
  VERIFIED = 'VERIFIED',   // Verified, not paid
  ACTIVE = 'ACTIVE',       // Paid and active
  SUSPENDED = 'SUSPENDED', // Temporarily suspended by admin
  BANNED = 'BANNED',        // Permanently banned
  DEMO_PREVIEW = 'DEMO_PREVIEW', // 3-hour unrestricted access
  DEMO_EXPIRED = 'DEMO_EXPIRED'  // Demo period finished
}

export enum AirspaceClass {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G'
}

export enum FlightRule {
  VFR = 'VFR',
  IFR = 'IFR'
}

export interface AirspaceData {
  class: AirspaceClass;
  type: 'Controlled' | 'Uncontrolled' | 'Advisory';
  separation: string;
  vfrAllowed: boolean;
  radioReq: boolean;
  clearanceReq: boolean;
  notes: string;
}

export interface User {
  email: string;
  id: string;
  fullName?: string;
  status: AuthStatus;
  studySeconds: number; // New field for tracking
  subscriptionTier?: '1_MONTH' | '3_MONTHS' | '6_MONTHS' | '9_MONTHS' | '12_MONTHS' | 'SINGLE_SUBJECT' | 'CUSTOM' | 'PRO_MONTHLY' | 'PRO_YEARLY';
  allowedSubjects?: string[]; // 'ALL' or array of IDs
  isAdmin?: boolean;
  isApproved?: boolean; // Manual admin approval status
  trialStartDate?: string; // ISO date string when trial started
  demoStartDate?: string; // ISO date string when 3-hour demo started
  trialSubjects?: string[]; // Subjects available during trial (e.g., ['090', '040'])
  learningObjectivesRatings?: Record<string, number>; // Map of LO ID to rating (0-5)
  exam_plan?: any; // JSONB stored in Supabase
}

export interface QCode {
  code: string;
  meaning: string;
}

export interface LightSignal {
  id: string;
  color: 'green' | 'red' | 'white';
  pattern: 'steady' | 'flash';
  context: 'ground' | 'air';
  meaning: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  learningObjectives: string[];
  annexes: string[];
  // Advanced ECQB Metadata
  authorities?: string[]; // e.g., ["UKCAA", "EASA-CENTRAL", "AUSTRO"]
  lastSeen?: string;      // ISO date of last report in exam
  isRecent?: boolean;     // Flag for "Hot Points"
  countries?: string[];   // Specific countries reported
  difficulty?: 'easy' | 'medium' | 'hard';
}

// New interfaces for LOs
export interface LearningObjective {
  id: string;
  subject: string;
  text: string;
  coveredBy?: View; // The view that covers this LO
}

export interface SubjectStats {
  id: string;
  name: string;
  totalLOs: number;
  coveredLOs: number;
}

export interface Flashcard {
  id: string;
  subjectId: string;
  front: string;
  back: string;
}

export interface AdminStats {
  totalUsers: number;
  pendingApproval: number;
  activeSubscriptions: number;
  proUsers: number;
  adminCount: number;
  recentSignups: User[];
}


export interface InviteCode {
  code: string;
  created_by?: string;
  created_at: string;
  used_by?: string; // ID of user who used it
  used_at?: string;
}

export interface Testimonial {
  id: string;
  userId: string;
  userName: string;
  userRole: string; // e.g., 'ATPL Student', 'CFI'
  text: string;
  rating: number; // 1-5
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// React Three Fiber intrinsic element declarations
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // React Three Fiber elements
      group: any;
      mesh: any;
      cylinderGeometry: any;
      meshPhysicalMaterial: any;
      meshStandardMaterial: any;
      planeGeometry: any;
      gridHelper: any;
      ambientLight: any;
      pointLight: any;
      color: any;
    }
  }
}
export interface SavedTest {
  id: string;
  name: string;
  subjectId: string;
  mode: 'study' | 'exam';
  questionIds: string[];
  userAnswers: (number | null)[]; // Index of selected option
  userStatuses: ('correct' | 'incorrect' | 'skipped' | 'unseen')[];
  userAttributions?: (ErrorAttribution | null)[]; // Tracking why questions were missed
  questionPacing?: number[]; // Time spent on each question in seconds
  currentIndex: number;
  score: number;
  timeSpent: number; // in seconds
  createdAt: string;
  lastResumedAt: string;
  isCompleted: boolean;
}

export type ErrorAttribution = 'misread' | 'formula' | 'concept' | 'careless' | 'time' | 'unknown';

export interface QBConfig {
  subjectId: string;
  mode: 'study' | 'exam';
  count: number;
  topics: string[]; // List of topic IDs selected
  filters: {
    onlyRealExam: boolean;
    withAnnexes: boolean;
    withoutAnnexes: boolean;
    unseen: boolean;
    incorrect: boolean;
    // Advanced Filters
    selectedAuthorities?: string[];
    selectedCountries?: string[];
    recentOnly?: boolean;
    difficultyLevels?: ('easy' | 'medium' | 'hard')[];
    // Smart Filters
    flaggedOnly?: boolean;
    wrongAnswersOnly?: boolean;
  };
}

export interface TopicResult {
  topicId: string;
  title: string;
  total: number;
  correct: number;
}

export interface TestResult {
  testId: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  topicBreakdown: TopicResult[];
  areasForImprovement: string[]; // List of topic titles
}

export interface QBStats {
  averageScore: number;
  questionsSeen: number;
  totalTestsCompleted: number;
  scoreHistory: { date: string, score: number, type: 'study' | 'exam' }[];
  flaggedQuestionIds: string[];
  incorrectQuestionIds: string[]; // Set of unique IDs that were ever answered incorrectly
  seenQuestionIds: string[]; // Set of unique IDs ever seen in a practice session
  attributionCounts: Record<ErrorAttribution, number>;
  averagePacing: number; // Average seconds per question
}
