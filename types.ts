
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

  // AGK (021/022)
  AGK_HOME = 'AGK_HOME',
  AGK_SYSTEMS_HOME = 'AGK_SYSTEMS_HOME', // 021
  AGK_INSTRUMENTS_HOME = 'AGK_INSTRUMENTS_HOME', // 022
  AGK_HYDRAULICS = 'AGK_HYDRAULICS',
  AGK_JET_ENGINE = 'AGK_JET_ENGINE',
  AGK_PISTON_ENGINE = 'AGK_PISTON_ENGINE',
  AGK_ELECTRICS = 'AGK_ELECTRICS',
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

  // Performance (032)
  PERF_HOME = 'PERF_HOME',

  // Flight Planning (033)
  FLIGHT_PLAN_HOME = 'FLIGHT_PLAN_HOME',

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

  // Meteorology (050)
  MET_HOME = 'MET_HOME',
  MET_ATMOSPHERE = 'MET_ATMOSPHERE',
  MET_CIRCULATION = 'MET_CIRCULATION',
  MET_FRONTS = 'MET_FRONTS',
  MET_CLOUDS = 'MET_CLOUDS',
  MET_ALTIMETRY = 'MET_ALTIMETRY',

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
  GEN_NAV_EARTH = 'GEN_NAV_EARTH', // Earth Geometry
  GEN_NAV_SOLAR = 'GEN_NAV_SOLAR', // Time & Seasons
  GEN_NAV_MAPS = 'GEN_NAV_MAPS', // Projections
  GEN_NAV_WIND_TRIANGLE = 'GEN_NAV_WIND_TRIANGLE', // Dead Reckoning
  GEN_NAV_POLAR = 'GEN_NAV_POLAR', // Grid Nav

  // Ops Procedures (070)
  OPS_PROC_HOME = 'OPS_PROC_HOME',

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

  // NEW 090 SPECIFIC
  VOLMET_SIM = 'VOLMET_SIM',
  VFR_COMMS_SIM = 'VFR_COMMS_SIM',
  PROPAGATION_THEORY = 'PROPAGATION_THEORY',
  WEATHER_MINIMA = 'WEATHER_MINIMA',
  TAXIWAY_LIGHT = 'TAXIWAY_LIGHT',
  SURFACE_LIGHT = 'SURFACE_LIGHT',
  RUNWAY_MARKING = 'RUNWAY_MARKING',
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
  BANNED = 'BANNED'        // Permanently banned
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
  subscriptionTier?: 'CUSTOM' | 'PRO_MONTHLY' | 'PRO_YEARLY';
  allowedSubjects?: string[]; // 'ALL' or array of IDs
  isAdmin?: boolean;
  isApproved?: boolean; // Manual admin approval status
  trialStartDate?: string; // ISO date string when trial started
  trialSubjects?: string[]; // Subjects available during trial (e.g., ['090', '040'])
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

// Global definition for JSX Intrinsic Elements to fix widespread errors
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

      // Catch-all
      [elemName: string]: any;
    }
  }
}
