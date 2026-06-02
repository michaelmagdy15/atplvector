import { View } from '../types';
import { Users, Wifi, Plane, BookOpen, Compass, Settings, Shield, HardDrive, Cpu, Activity, Zap, Wind, Eye, Headset, Heart, Brain, Thermometer, Radio, Satellite, Layers, Map, AlertTriangle, FileText, Database, Scale, Weight, Globe, Calculator, Info, Percent, FileSpreadsheet, Layout, Shuffle, Truck, Box, TrendingUp, RotateCcw, AlertOctagon, Fan, Droplets, HeartPulse, Moon, FolderCog, UserPlus, Cloud, CloudRain, CloudLightning, Sun, Waves, Search, Gauge } from 'lucide-react';

export interface SubjectModule {
    title: string;
    desc: string;
    view: View;
    isLocked?: boolean;
}

export interface SubjectConfig {
    subjectCode: string;
    subjectName: string;
    color: string;
    description: string;
    icon: any;
    modules: SubjectModule[];
}

export const subjectConfigs: Partial<Record<View, SubjectConfig>> = {
    [View.AIR_LAW_HOME]: {
        subjectCode: "010",
        subjectName: "Air Law",
        color: "red",
        description: "International Law, Annexes 1-19, Procedures, and Operations.",
        icon: Scale,
        modules: [
            { title: 'Organisations', desc: 'ICAO, EASA, and Eurocontrol structure.', view: View.AIR_LAW_ORG },
            { title: 'International Law', desc: 'Chicago Convention and freedoms of the air.', view: View.AIR_LAW_INT_LAW },
            { title: 'Liability & Rights', desc: 'EC 261/2004 and Montreal Convention.', view: View.AIR_LAW_LIABILITY },
            { title: 'The 19 Annexes', desc: 'Overview of all ICAO Annexes.', view: View.AIR_LAW_ANNEXES },
            { title: 'Personnel Licensing', desc: 'Medical and experience requirements.', view: View.AIR_LAW_PERSONNEL },
            { title: 'Airworthiness', desc: 'C of A and technical requirements.', view: View.AIR_LAW_AIRWORTHINESS },
            { title: 'Registration', desc: 'Nationality and common marks.', view: View.AIR_LAW_REGISTRATION },
            { title: 'Documents Onboard', desc: 'Mandatory ship papers.', view: View.AIR_LAW_DOCS },
            { title: 'Rules of the Air', desc: 'Right of way and minimum heights.', view: View.AIR_LAW_RULES_DETAILS },
            { title: 'VFR vs IFR', desc: 'Visual vs Instrument flight rules.', view: View.AIR_LAW_RULES_OF_AIR },
            { title: 'Cruising Levels', desc: 'Semi-circular rule calculator.', view: View.AIR_LAW_CRUISING },
            { title: 'Airspace Classes', desc: '3D airspace classifications A-G.', view: View.AIR_LAW_LAYERS },
            { title: 'Instrument Appr.', desc: '5 segments of an approach.', view: View.AIR_LAW_INSTRUMENT },
            { title: 'Parallel Runway', desc: 'Independent and dependent ops.', view: View.AIR_LAW_PARALLEL_RWY },
            { title: 'PANS-OPS', desc: 'Departures and arrival criteria.', view: View.AIR_LAW_PANS_OPS },
            { title: 'AIS & AIRAC', desc: 'NOTAMs and 56-day cycles.', view: View.AIR_LAW_AIS_DEEP_DIVE },
            { title: 'Search & Rescue', desc: 'Alerting phases and signals.', view: View.AIR_LAW_SAR },
        ]
    },
    [View.AGK_SYSTEMS_HOME]: {
        subjectCode: "021",
        subjectName: "AGK: Systems",
        color: "orange",
        description: "Fuselage, hydraulics, landing gear, flight controls, pneumatics and electrics.",
        icon: Settings,
        modules: [
            { title: 'Piston Engines', desc: 'Otto Cycle, mixture, and ignition.', view: View.AGK_PISTON_ENGINE },
            { title: 'Gas Turbines', desc: 'Jet principles, Brayton Cycle.', view: View.AGK_JET_ENGINE },
            { title: 'Electrics', desc: 'Generation, distribution, protection.', view: View.AGK_ELECTRICS },
            { title: 'Hydraulics', desc: 'Pascal\'s Law, pumps and actuators.', view: View.AGK_HYDRAULICS },
            { title: 'Landing Gear', desc: 'Retraction, braking, squat switches.', view: View.AGK_LANDING_GEAR },
        ]
    },
    [View.INST_HOME]: {
        subjectCode: "022",
        subjectName: "Instrumentation",
        color: "slate",
        description: "Sensors, measurement of air data, gyroscopic instruments and EFIS.",
        icon: Activity,
        modules: [
            { title: 'Pitot-Static', desc: 'Pressure probes and instruments.', view: View.INST_PITOT_STATIC },
            { title: 'Altimeter Lab', desc: 'Barometric and temperature errors.', view: View.INST_ALTIMETER },
            { title: 'Airspeed Ind.', desc: 'IAS, CAS, EAS, and TAS corrections.', view: View.INST_ASI },
            { title: 'VSI Lab', desc: 'Standard lag vs Instantaneous response.', view: View.INST_VSI },
            { title: 'Machmeter', desc: 'TAS to Speed of Sound ratio.', view: View.INST_MACHMETER },
            { title: 'Gyro Principles', desc: 'Rigidity and Precession physics.', view: View.INST_GYROS },
            { title: 'Turn Indicator', desc: 'Rate gyros and coordinated turns.', view: View.INST_TURN_INDICATOR },
            { title: 'Attitude Ind.', desc: 'Artificial horizon and erection errors.', view: View.INST_ATTITUDE },
            { title: 'Magnetic Compass', desc: 'Dip, ANDS, and UNOS errors.', view: View.INST_COMPASS },
            { title: 'IRS / ADC', desc: 'Modern digital nav computers.', view: View.INST_NAV_SYSTEMS },
            { title: 'FMS & EFIS', desc: 'Display modes and data management.', view: View.INST_FMS_EFIS },
            { title: 'Autopilot', desc: 'Inner/outer loops and servos.', view: View.INST_AUTOPILOT },
        ]
    },
    [View.MASS_BAL_HOME]: {
        subjectCode: "031",
        subjectName: "Mass & Balance",
        color: "yellow",
        description: "Center of gravity, loading, weighing, and performance limitations.",
        icon: Weight,
        modules: [
            { title: 'Guided Wizard', desc: 'Step-by-step problem solver.', view: View.MASS_BAL_QUIZ },
            { title: 'Definitions', desc: 'BEM, DOM, TOM, and ZFM.', view: View.MASS_BAL_DEFINITIONS },
            { title: 'CG Calculator', desc: 'Calculate CG from weighing forces.', view: View.MASS_BAL_CG_CALC },
            { title: 'MAC Visualizer', desc: 'Mean Aerodynamic Chord calculations.', view: View.MASS_BAL_MAC },
            { title: 'Load Sheet Sim', desc: 'Pax, Cargo, and Fuel planning.', view: View.MASS_BAL_LOADSHEET },
            { title: 'Loading Limits', desc: 'Structural vs Performance limitations.', view: View.MASS_BAL_LIMITS },
            { title: 'CG Shift', desc: 'Effects of moving or adding mass.', view: View.MASS_BAL_CG_SHIFT },
            { title: 'Stall Speed Calc', desc: 'Calculate Vs based on mass.', view: View.MASS_BAL_STALL_SPEED },
        ]
    },
    [View.GEN_NAV_HOME]: {
        subjectCode: "061",
        subjectName: "General Navigation",
        color: "cyan",
        description: "Basics of navigation, magnetism, charts, and dead reckoning.",
        icon: Compass,
        modules: [
            { title: 'Fundamentals', desc: 'Direction, distance, and speed.', view: View.GEN_NAV_BASICS },
            { title: 'VFR Navigation', desc: 'Wind Triangle and CRP-5 usage.', view: View.GEN_NAV_VFR },
            { title: 'Earth Geometry', desc: 'Convergency and rhumb lines.', view: View.GEN_NAV_EARTH },
            { title: 'Charts', desc: 'Lamberts, Mercator, and Stereo.', view: View.GEN_NAV_CHARTS },
            { title: 'Time', desc: 'UTC, LMT, and solar system.', view: View.GEN_NAV_TIME },
            { title: 'Date Line Crossing', desc: 'International Date Line calendar jumps.', view: View.GEN_NAV_DATELINE },
        ]
    },
    [View.KSA_HOME]: {
        subjectCode: "100",
        subjectName: "KSA",
        color: "pink",
        description: "Knowledge, Skills and Attitudes. Core competencies and TEM.",
        icon: Brain,
        modules: [
            { title: 'Competencies', desc: 'Instruction and Assessment indicators.', view: View.KSA_COMPETENCIES },
            { title: 'FOR-DEC', desc: 'Decision making model training.', view: View.KSA_FORDEC },
            { title: 'UPRT Theory', desc: 'Upset prevention and recovery.', view: View.KSA_UPRT },
            { title: 'Mental Maths', desc: 'Interactive aviation arithmetic.', view: View.KSA_MENTAL_MATHS },
            { title: 'CRM Scenarios', desc: 'Crew Resource Management eval.', view: View.KSA_CRM },
        ]
    },
    [View.HPL_HOME]: {
        subjectCode: "040",
        subjectName: "Human Performance",
        color: "emerald",
        description: "Physiology, psychology, sleep, stress, and error management.",
        icon: Users,
        modules: [
            { title: 'Physiology', desc: 'Hypoxia, Respiration, Circulation.', view: View.HPL_PHYSIOLOGY },
            { title: 'Basic Concepts', desc: 'Accident stats, TEM, Safety Culture.', view: View.HPL_BASIC_CONCEPTS },
            { title: 'Sleep & Rhythms', desc: 'Circadian rhythms, Jet Lag, Sleep Stages.', view: View.HPL_SLEEP },
            { title: 'Information Processing', desc: 'Attention, Vigilance, Situation Awareness.', view: View.HPL_INFO_PROCESSING },
            { title: 'Error & Decision', desc: 'Error models, FOR-DEC, Error Chains.', view: View.HPL_ERROR_DECISION },
            { title: 'Cockpit Mgmt & CRM', desc: 'SOPs, Group Dynamics, Synergy.', view: View.HPL_COCKPIT_MGMT },
            { title: 'Comms & Stress', desc: 'Communication models, Stress, Workload.', view: View.HPL_COMMS_STRESS },
            { title: 'Human Behaviour', desc: 'Hazardous Attitudes, Leadership, Crew.', view: View.HPL_BEHAVIOUR },
            { title: 'Vision', desc: 'Eye anatomy, Scanning, and Visual Illusions.', view: View.HPL_VISION },
            { title: 'Hearing', desc: 'The Ear, Vestibular System, Spatial Disorientation.', view: View.HPL_HEARING },
            { title: 'Health', desc: 'Gas Laws, Hypoxia, TUC, Barotrauma.', view: View.HPL_HEALTH },
            { title: 'TEM Model', desc: 'Threats, Errors, UAS, and Countermeasures.', view: View.HPL_TEM },
            { title: 'SHELL Model', desc: 'Software, Hardware, Environment, Liveware.', view: View.HPL_SHELL },
            { title: 'Safety Culture', desc: 'Swiss Cheese, Just Culture, SMS.', view: View.HPL_SAFETY },
            { title: 'Acceleration', desc: 'G-Forces, G-LOC, Protections.', view: View.HPL_ACCELERATION },
            { title: 'Toxic Hazards', desc: 'CO, Alcohol, Smoking, Drugs.', view: View.HPL_TOXIC },
            { title: 'Automation', desc: 'Levels, Irony, Mode Confusion.', view: View.HPL_AUTOMATION },
            { title: 'Vestibular', desc: 'Leans, Coriolis, Somatogravic.', view: View.HPL_VESTIBULAR },
            { title: 'Memory', desc: 'Sensory, STM, LTM, Motor Programs.', view: View.HPL_MEMORY },
            { title: 'Respiration', desc: 'Lungs, Gas Exchange, Control.', view: View.HPL_RESPIRATION },
            { title: 'Circulation', desc: 'Heart, Blood, BP.', view: View.HPL_CIRCULATION },
            { title: 'Nervous System', desc: 'CNS, PNS, Autonomic.', view: View.HPL_NERVOUS },
            { title: 'Metabolism', desc: 'BMR, Blood Sugar, BMI.', view: View.HPL_METABOLISM },
            { title: 'Ergonomics', desc: 'Anthropometry, DEP, Biomechanics.', view: View.HPL_ERGONOMICS },
            { title: 'Biases', desc: 'Confirmation, Sunk Cost, Gambler.', view: View.HPL_BIASES },
            { title: 'Culture', desc: 'Hofstede, Safety Culture, SMS.', view: View.HPL_CULTURE },
            { title: 'Radiation', desc: 'Cosmic, Solar, Ozone.', view: View.HPL_RADIATION },
            { title: 'Thermal', desc: 'Hypothermia, Heat Stroke, Reg.', view: View.HPL_THERMAL },
            { title: 'Sleep Disorders', desc: 'Apnea, Insomnia, Narcolepsy.', view: View.HPL_SLEEP_DISORDERS },
            { title: 'Pressure Effects', desc: 'Barotrauma, Decompression, TUC.', view: View.HPL_PRESSURE },
            { title: 'Motion Sickness', desc: 'Sensory Conflict, Prevention.', view: View.HPL_MOTION_SICKNESS },
            { title: 'Perception', desc: 'Visual Illusions, Runway Illusions.', view: View.HPL_PERCEPTION },
            { title: 'Workload', desc: 'Yerkes-Dodson, ANC, DODAR.', view: View.HPL_WORKLOAD },
            { title: 'Incapacitation', desc: 'Procedures, 2-Comms Rule, Fume Events.', view: View.HPL_INCAPACITATION },
            { title: 'Communication Process', desc: 'Models, Barriers, Readback.', view: View.HPL_COMMUNICATION_PROCESS },
            { title: 'Competency', desc: 'KSA, Core Competencies.', view: View.HPL_COMPETENCY },
            { title: 'Cooperation', desc: 'Group Dynamics, Synergy.', view: View.HPL_COOPERATION },
            { title: 'Health & Hygiene', desc: 'Alcohol, Drugs, Diet & Hygiene.', view: View.HPL_HEALTH_HYGIENE },
            { title: 'Tropical Diseases', desc: 'Infectious diseases and travel health.', view: View.HPL_TROPICAL_DISEASES },
        ]
    },
    [View.RAD_NAV_HOME]: {
        subjectCode: "062",
        subjectName: "Radio Navigation",
        color: "sky",
        description: "Radio aids, radar, GNSS, area navigation systems.",
        icon: Wifi,
        modules: [
            { title: 'Class 1: Fundamentals', desc: 'Waves, Spectrum, Modulation, Propagation (New).', view: View.RAD_NAV_CLASS_1 },
            { title: 'Wave Propagation', desc: 'Wavelength, Frequency, Amplitude visualized.', view: View.RAD_NAV_WAVE_PROP },
            { title: 'Spectrum Explorer', desc: 'VLF to EHF bands and aviation usage.', view: View.RAD_NAV_SPECTRUM },
            { title: 'Ionosphere', desc: 'Sky wave propagation, layers and skip distance.', view: View.RAD_NAV_IONOSPHERE },
            { title: 'Antenna Theory', desc: 'Radiation patterns, dipoles and loops.', view: View.RAD_NAV_ANTENNA },
            { title: 'Modulation', desc: 'AM, FM, Phase and Pulse modulation.', view: View.RAD_NAV_MODULATION },
            { title: 'VOR Simulator', desc: 'CDI, TO/FROM, Radial Interception.', view: View.RAD_NAV_VOR },
            { title: 'ADF/NDB', desc: 'RBI/RMI tracking and homing.', view: View.RAD_NAV_ADF },
            { title: 'DME', desc: 'Slant range vs Ground distance.', view: View.RAD_NAV_DME },
            { title: 'ILS Approach', desc: 'Localizer and Glidepath lobes.', view: View.RAD_NAV_ILS },
            { title: 'VDF', desc: 'QDM/QDR and homing.', view: View.RAD_NAV_VDF },
            { title: 'MLS', desc: 'Microwave Landing System TRSB.', view: View.RAD_NAV_MLS },
            { title: 'Weather Radar', desc: 'Tilt, Iso-Echo, Attenuation and shadows.', view: View.RAD_NAV_WX_RADAR },
            { title: 'Radar Theory', desc: 'Pulse technique, PRF, PRI.', view: View.RAD_NAV_RADAR },
            { title: 'SSR Transponder', desc: 'Mode A/C/S, Codes and Interrogation.', view: View.RAD_NAV_SSR },
            { title: 'GNSS Principles', desc: 'GPS, GLONASS, GALILEO satellites.', view: View.NAV_GNSS },
            { title: 'SBAS/ABAS', desc: 'EGNOS, WAAS and augmentation.', view: View.RAD_NAV_SBAS },
            { title: 'RNAV/PBN', desc: 'Area Navigation and Kalman Filtering.', view: View.RAD_NAV_RNAV },
            { title: 'FMS Trainer', desc: 'CDU/MCDU Waypoint entry.', view: View.RAD_NAV_FMS },
        ]
    },
    [View.POF_HOME]: {
        subjectCode: "081",
        subjectName: "Principles of Flight",
        color: "violet",
        description: "Subsonic aerodynamics, stability, control, lift, drag.",
        icon: Plane,
        modules: [
            { title: 'Atmosphere', desc: 'ISA properties: Temperature, Pressure, Density.', view: View.POF_ATMOSPHERE },
            { title: 'Airflow Basics', desc: 'Streamlines, Bernoulli, and Continuity.', view: View.POF_AIRFLOW },
            { title: 'Aerofoil Geometry', desc: 'Camber, Chord, Thickness, Angle of Attack.', view: View.POF_AEROFOIL },
            { title: 'Wing Geometry', desc: 'Aspect Ratio, Taper, Sweep, Planform.', view: View.POF_WING_GEOM },
            { title: 'Lift & Drag', desc: 'Coefficient curves, polar diagrams.', view: View.POF_LIFT_DRAG },
            { title: '3D Airflow', desc: 'Wingtip vortices, Downwash, Induced Drag.', view: View.POF_3D_AIRFLOW },
            { title: 'Total Drag', desc: 'Parasite vs Induced Drag curves.', view: View.POF_DRAG },
            { title: 'Ground Effect', desc: 'Cushioning effect near surface.', view: View.POF_GROUND_EFFECT },
            { title: 'High Lift Devices', desc: 'Flaps and Slats performance.', view: View.POF_HIGH_LIFT },
            { title: 'Stall', desc: 'Stalling characteristics and recovery.', view: View.POF_STALL },
            { title: 'Stability', desc: 'Static and Dynamic stability.', view: View.POF_STABILITY_SIM },
            { title: 'Coupling Dynamics', desc: 'Dutch Roll and Spiral Divergence.', view: View.POF_COUPLING },
            { title: 'Control', desc: 'Primary controls, balancing.', view: View.POF_CONTROL },
            { title: 'Flight Mechanics', desc: 'Climb, Descent, Turn.', view: View.POF_FLIGHT_MECHANICS },
            { title: 'High Speed Flight', desc: 'Mach number, shockwaves.', view: View.POF_HIGH_SPEED },
            { title: 'Limitations', desc: 'V-g envelope, flutter.', view: View.POF_LIMITATIONS },
            { title: 'Propellers', desc: 'Blade element theory.', view: View.POF_PROPELLERS },
        ]
    },
    [View.OPS_PROC_HOME]: {
        subjectCode: "070",
        subjectName: "Operational Procedures",
        color: "indigo",
        description: "Special operational procedures, noise abatement, fire/smoke, wind shear and icing.",
        icon: BookOpen,
        modules: [
            { title: 'Long Range Ops', desc: 'NAT HLA, ETOPS, Polar.', view: View.OPS_LONG_RANGE },
            { title: 'Special Procedures', desc: 'Fire, DG, Contamination, Noise.', view: View.OPS_SPECIAL },
            { title: 'Flight Time Limitations', desc: 'FDP Calculator & Rest Rules.', view: View.OPS_FTL },
            { title: 'Emergency Ops', desc: 'Fuel dump, TCAS, Distress.', view: View.EMERGENCY_OPS },
            { title: 'All Weather Ops', desc: 'LVP, Minima, Approach Bans.', view: View.OPS_AWO },
            { title: 'General Requirements', desc: 'MEL, Equipment, AOC, Safety.', view: View.OPS_GENERAL },
            { title: 'Ground Ops', desc: 'Marshalling & Safety.', view: View.AIR_LAW_GROUND_OPS },
        ]
    }
};
