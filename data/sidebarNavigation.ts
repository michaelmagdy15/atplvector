
import { View } from '../types';
import { Scale, Settings, Weight, TrendingUp, Map, Users, Cloud, Compass, Radio, BookOpen, Plane, Wifi, Activity, AlertCircle, Database, Phone, ShieldAlert, Mic, Play, MessageSquare, Brain, Moon, Shield, GitMerge, MessageCircle, HeartPulse, UserPlus, FolderCog } from 'lucide-react';

export interface SidebarItem {
    label: string;
    view: View;
    icon?: any;
}

export interface SubjectConfig {
    id: string;
    title: string;
    color: string;
    dashboardView: View;
    items: SidebarItem[];
}

// Helper to define navigation structure
const NAV_MAP: SubjectConfig[] = [
    {
        id: '010',
        title: 'Air Law',
        color: 'red',
        dashboardView: View.AIR_LAW_HOME,
        items: [
            { label: 'Dashboard', view: View.AIR_LAW_HOME, icon: Scale },
            { label: 'International Law', view: View.AIR_LAW_INT_LAW },
            { label: 'Organisations', view: View.AIR_LAW_ORG },
            { label: 'Liability & Rights', view: View.AIR_LAW_LIABILITY },
            { label: 'The 19 Annexes', view: View.AIR_LAW_ANNEXES },
            { label: 'Personnel Licensing', view: View.AIR_LAW_PERSONNEL },
            { label: 'Airworthiness', view: View.AIR_LAW_AIRWORTHINESS },
            { label: 'Registration', view: View.AIR_LAW_REGISTRATION },
            { label: 'Docs Onboard', view: View.AIR_LAW_DOCS },
            { label: 'Rules of the Air', view: View.AIR_LAW_RULES_DETAILS },
            { label: 'VFR vs IFR', view: View.AIR_LAW_RULES_OF_AIR },
            { label: 'Cruising Levels', view: View.AIR_LAW_CRUISING },
            { label: 'Interception', view: View.AIR_LAW_INTERCEPT },
            { label: 'Light Gun Signals', view: View.AIR_LAW_LIGHTGUN },
            { label: 'Airspace Classes', view: View.AIR_LAW_LAYERS },
            { label: 'IFR/VFR Explorer', view: View.AIR_LAW_IFR_VFR },
            { label: 'Instrument Appr.', view: View.AIR_LAW_INSTRUMENT },
            { label: 'PANS-OPS', view: View.AIR_LAW_PANS_OPS },
            { label: 'Holding Patterns', view: View.AIR_LAW_HOLDING },
            { label: 'Altimetry', view: View.AIR_LAW_ALTIMETER },
            { label: 'Aerodrome Codes', view: View.AIR_LAW_REF_CODE },
            { label: 'Surface Contam.', view: View.AIR_LAW_SURFACE_CON },
            { label: 'Lighting Systems', view: View.AIR_LAW_LIGHTING },
            { label: 'Visual Aids', view: View.AIR_LAW_AERODROME_VIS },
            { label: 'Signs & Signals', view: View.AIR_LAW_SIGNS },
            { label: 'Ground Ops', view: View.AIR_LAW_GROUND_OPS },
            { label: 'RWSL', view: View.AIR_LAW_RWSL },
            { label: 'T-VASIS', view: View.AIR_LAW_TVASIS },
            { label: 'Declared Dist.', view: View.AIR_LAW_DECLARED_DIST },
            { label: 'Ops Info (AIS)', view: View.AIR_LAW_OPS_INFO },
            { label: 'Security', view: View.AIR_LAW_SECURITY },
            { label: 'Accident Invest.', view: View.AIR_LAW_ACCIDENT },
            { label: 'Search & Rescue', view: View.AIR_LAW_SAR },
            { label: 'Emergency Proc.', view: View.AIR_LAW_EMERGENCY },
        ]
    },
    {
        id: '090',
        title: 'Communications',
        color: 'indigo',
        dashboardView: View.DASHBOARD,
        items: [
            { label: 'Dashboard', view: View.DASHBOARD, icon: Radio },
            { label: 'General Theory', view: View.GENERAL_THEORY },
            { label: 'Propagation', view: View.PROPAGATION_THEORY },
            { label: 'Tech Physics', view: View.TECH_PHYSICS },
            { label: 'Freq Explorer', view: View.FREQ_EXPLORER },
            { label: 'Station Suffixes', view: View.SUFFIX_MATCH },
            { label: 'Q-Codes', view: View.QCODE_CARDS },
            { label: 'Direction Finding', view: View.Q_COMPASS },
            { label: 'Standard Words', view: View.WORD_MATCH },
            { label: 'Phonetic Trainer', view: View.PHONETIC },
            { label: 'Number Tx', view: View.ALT_SPEAK },
            { label: 'Time Tx', view: View.TIME_REPORT },
            { label: 'Readability', view: View.READABILITY_SIM },
            { label: 'Protocols', view: View.FLIGHT_RULES },
            { label: 'Priority', view: View.PRIORITY },
            { label: 'Readback', view: View.READBACK },
            { label: 'METAR Decoder', view: View.METAR },
            { label: 'VOLMET/ATIS', view: View.VOLMET_SIM },
            { label: 'AIREP Special', view: View.AIREP_SPEC },
            { label: 'Data Link', view: View.RADIO_NAV_DATA },
            { label: 'Time Zones', view: View.TIME_ZONER },
            { label: 'Distress Builder', view: View.EMERGENCY },
            { label: 'Emergency Ops', view: View.EMERGENCY_OPS },
            { label: 'Comms Failure', view: View.COMM_FAIL },
            { label: 'Blind Tx', view: View.BLIND_TX },
            { label: 'Transponder', view: View.TRANSPONDER },
            { label: 'VFR Sim', view: View.VFR_COMMS_SIM },
            { label: 'IFR Phraseology', view: View.PHRASEOLOGY_EXPLORER },
            { label: 'Advanced Phrase.', view: View.ADV_PHRASEOLOGY },
            { label: 'Position Reports', view: View.POS_REPORT },
            { label: 'Traffic Info', view: View.TRAFFIC_CLOCK },
            { label: 'AI Roleplay', view: View.AI_ROLEPLAY },
            { label: 'AI Examiner', view: View.AI_QUIZ },
            { label: 'Light Gun', view: View.LIGHT_GUN },
            { label: 'Morse Master', view: View.MORSE },
            { label: 'Nav Idents', view: View.NAV_NDB_VOR },
            { label: 'Cloud Master', view: View.CLOUD_MASTER },
            { label: 'RVR Simulator', view: View.RVR_SIM },
            { label: 'RVR Decoder', view: View.RVR_CODE },
            { label: 'FLIRT Trainer', view: View.FLIRT_TRAINER },
            { label: 'PAPI Vis', view: View.PAPI_VIS },
            { label: 'Weather Minima', view: View.WEATHER_MINIMA },
            { label: 'Holding Calc', view: View.HOLDING },
            { label: 'Altimeter Lab', view: View.ALTIMETER },
            { label: 'Runway Lights', view: View.RUNWAY },
            { label: 'Surface Lights', view: View.SURFACE_LIGHT },
            { label: 'Taxiway Lights', view: View.TAXIWAY_LIGHT },
            { label: 'Runway Marking', view: View.RUNWAY_MARKING },
            { label: 'SNOWTAM', view: View.SNOWTAM },
            { label: 'Wake Turb', view: View.WAKE_TURB },
            { label: 'Service Codes', view: View.SERVICE_CODES },
            { label: 'Intercept', view: View.INTERCEPT },
        ]
    },
    {
        id: '031',
        title: 'Mass & Balance',
        color: 'yellow',
        dashboardView: View.MASS_BAL_HOME,
        items: [
            { label: 'Dashboard', view: View.MASS_BAL_HOME, icon: Weight },
            { label: 'Definitions', view: View.MASS_BAL_DEFINITIONS },
            { label: 'CG Calculator', view: View.MASS_BAL_CG_CALC },
            { label: 'Loading Limits', view: View.MASS_BAL_LIMITS },
            { label: 'MAC Visualizer', view: View.MASS_BAL_MAC },
            { label: 'Fuel Density', view: View.MASS_BAL_FUEL },
            { label: 'Load Shift', view: View.MASS_BAL_SHIFT },
        ]
    },
    {
        id: '021',
        title: 'AGK Systems',
        color: 'orange',
        dashboardView: View.AGK_SYSTEMS_HOME,
        items: [
            { label: 'Dashboard', view: View.AGK_SYSTEMS_HOME, icon: Settings },
            { label: 'Hydraulics', view: View.AGK_HYDRAULICS },
            { label: 'Gas Turbines', view: View.AGK_JET_ENGINE },
        ]
    },
    {
        id: '040',
        title: 'Human Perf.',
        color: 'emerald',
        dashboardView: View.HPL_HOME,
        items: [
            { label: 'Dashboard', view: View.HPL_HOME, icon: Users },
            { label: 'Physiology', view: View.HPL_PHYSIOLOGY, icon: HeartPulse },
            { label: 'Basic Concepts', view: View.HPL_BASIC_CONCEPTS, icon: Shield },
            { label: 'Sleep & Rhythms', view: View.HPL_SLEEP, icon: Moon },
            { label: 'Info Processing', view: View.HPL_INFO_PROCESSING, icon: Brain },
            { label: 'Error & Decision', view: View.HPL_ERROR_DECISION, icon: GitMerge },
            { label: 'Cockpit Mgmt', view: View.HPL_COCKPIT_MGMT, icon: FolderCog },
            { label: 'Behaviour', view: View.HPL_BEHAVIOUR, icon: UserPlus },
            { label: 'Comms & Stress', view: View.HPL_COMMS_STRESS, icon: MessageCircle },
            { label: 'Vision', view: View.HPL_VISION },
            { label: 'Hearing', view: View.HPL_HEARING },
            { label: 'Health', view: View.HPL_HEALTH },
            { label: 'TEM Model', view: View.HPL_TEM },
            { label: 'SHELL Model', view: View.HPL_SHELL },
            { label: 'Safety Culture', view: View.HPL_SAFETY },
            { label: 'Acceleration', view: View.HPL_ACCELERATION },
            { label: 'Toxic Hazards', view: View.HPL_TOXIC },
            { label: 'Automation', view: View.HPL_AUTOMATION },
            { label: 'Vestibular', view: View.HPL_VESTIBULAR },
            { label: 'Memory', view: View.HPL_MEMORY },
            { label: 'Learning', view: View.HPL_LEARNING },
            { label: 'Personality', view: View.HPL_PERSONALITY },
            { label: 'Atmosphere', view: View.HPL_ATMOSPHERE },
            { label: 'Respiration', view: View.HPL_RESPIRATION },
            { label: 'Circulation', view: View.HPL_CIRCULATION },
            { label: 'Nervous System', view: View.HPL_NERVOUS },
            { label: 'Metabolism', view: View.HPL_METABOLISM },
            { label: 'Ergonomics', view: View.HPL_ERGONOMICS },
            { label: 'Biases', view: View.HPL_BIASES },
            { label: 'Culture', view: View.HPL_CULTURE },
            { label: 'Radiation', view: View.HPL_RADIATION },
            { label: 'Thermal', view: View.HPL_THERMAL },
            { label: 'Sleep Disorders', view: View.HPL_SLEEP_DISORDERS },
            { label: 'Pressure Effects', view: View.HPL_PRESSURE },
            { label: 'Motion Sickness', view: View.HPL_MOTION_SICKNESS },
            { label: 'Perception', view: View.HPL_PERCEPTION },
            { label: 'Workload', view: View.HPL_WORKLOAD },
        ]
    },
    {
        id: '050',
        title: 'Meteorology',
        color: 'teal',
        dashboardView: View.MET_HOME,
        items: [
            { label: 'Dashboard', view: View.MET_HOME, icon: Cloud },
            { label: 'Atmosphere', view: View.MET_ATMOSPHERE },
        ]
    },
    {
        id: '061',
        title: 'Gen Nav',
        color: 'cyan',
        dashboardView: View.GEN_NAV_HOME,
        items: [
            { label: 'Dashboard', view: View.GEN_NAV_HOME, icon: Compass },
            { label: 'Earth Geometry', view: View.GEN_NAV_EARTH },
            { label: 'Solar Time', view: View.GEN_NAV_SOLAR },
            { label: 'Map Projections', view: View.GEN_NAV_MAPS },
            { label: '1 in 60 Rule', view: View.NAV_60_1 },
            { label: 'Wind Triangle', view: View.GEN_NAV_WIND_TRIANGLE },
            { label: 'Time Zones', view: View.NAV_TIME },
            { label: 'Polar Nav', view: View.GEN_NAV_POLAR },
        ]
    },
    {
        id: '062',
        title: 'Radio Nav',
        color: 'sky',
        dashboardView: View.RAD_NAV_HOME,
        items: [
            { label: 'Dashboard', view: View.RAD_NAV_HOME, icon: Wifi },
            { label: 'Wave Propagation', view: View.RAD_NAV_WAVE_PROP },
            { label: 'Spectrum Explorer', view: View.RAD_NAV_SPECTRUM },
            { label: 'Modulation', view: View.RAD_NAV_MODULATION },
            { label: 'Antenna Theory', view: View.RAD_NAV_ANTENNA },
            { label: 'Ionosphere', view: View.RAD_NAV_IONOSPHERE },
            { label: 'VDF', view: View.RAD_NAV_VDF },
            { label: 'ADF/NDB', view: View.RAD_NAV_ADF },
            { label: 'VOR Lab', view: View.RAD_NAV_VOR },
            { label: 'DME', view: View.RAD_NAV_DME },
            { label: 'ILS', view: View.RAD_NAV_ILS },
            { label: 'MLS', view: View.RAD_NAV_MLS },
            { label: 'Radar Theory', view: View.RAD_NAV_RADAR },
            { label: 'SSR/Transponder', view: View.RAD_NAV_SSR },
            { label: 'RNAV/PBN', view: View.RAD_NAV_RNAV },
            { label: 'FMS', view: View.RAD_NAV_FMS },
            { label: 'GNSS Theory', view: View.NAV_GNSS },
            { label: 'SBAS/ABAS', view: View.RAD_NAV_SBAS },
        ]
    },
    {
        id: '081',
        title: 'Principles of Flight',
        color: 'violet',
        dashboardView: View.POF_HOME,
        items: [
            { label: 'Dashboard', view: View.POF_HOME, icon: Plane },
            { label: 'Atmosphere (ISA)', view: View.POF_ATMOSPHERE },
            { label: 'Airflow Basics', view: View.POF_AIRFLOW },
            { label: 'Aerofoil Geom', view: View.POF_AEROFOIL },
            { label: 'Wing Geom', view: View.POF_WING_GEOM },
            { label: 'Lift & Drag Coeff', view: View.POF_LIFT_DRAG }, // Using existing/new shared view if appropriate, or mapped to Coeff
            { label: '3D Airflow', view: View.POF_3D_AIRFLOW },
            { label: 'Total Drag', view: View.POF_DRAG },
            { label: 'Ground Effect', view: View.POF_GROUND_EFFECT },
            { label: 'High Lift Devices', view: View.POF_HIGH_LIFT },
        ]
    },
    {
        id: '070',
        title: 'Ops Procedures',
        color: 'indigo',
        dashboardView: View.OPS_PROC_HOME,
        items: [
            { label: 'Dashboard', view: View.OPS_PROC_HOME, icon: BookOpen },
        ]
    }
];

export const getSubjectConfig = (currentView: View): SubjectConfig | null => {
    // Check if current view is in any subject's item list
    const found = NAV_MAP.find(subject => subject.items.some(item => item.view === currentView));
    if (found) return found;

    // Fallback logic for generic dashboards if not in items list explicitly but matches dashboard
    const dashMatch = NAV_MAP.find(subject => subject.dashboardView === currentView);
    return dashMatch || null;
};
