
import { LearningObjective, SubjectStats, View } from '../types';
import syllabusData from './syllabus.json';

// Type for syllabus JSON structure
interface SyllabusNode {
    code: string;
    title: string;
    children?: SyllabusNode[];
    los?: { id: string; text: string; details?: string }[];
}

// Recursively count all LOs in a syllabus node
function countLOs(node: SyllabusNode): number {
    let count = node.los?.length || 0;
    if (node.children) {
        for (const child of node.children) {
            count += countLOs(child);
        }
    }
    return count;
}

// Extract subject ID from code (e.g., "040 00 00 00" -> "040")
function getSubjectId(code: string): string {
    return code.split(' ')[0];
}

// Build subjects dynamically from syllabus.json, with fallback defaults
function buildSubjectsFromSyllabus(): SubjectStats[] {
    // Default subjects with estimated totalLOs (used if not in syllabus.json)
    const defaultSubjects: SubjectStats[] = [
        { id: '010', name: 'Air Law', totalLOs: 215, coveredLOs: 0 },
        { id: '021', name: 'AGK: Systems', totalLOs: 180, coveredLOs: 0 },
        { id: '022', name: 'AGK: Instruments', totalLOs: 140, coveredLOs: 0 },
        { id: '031', name: 'Mass & Balance', totalLOs: 80, coveredLOs: 0 },
        { id: '032', name: 'Performance (A)', totalLOs: 120, coveredLOs: 0 },
        { id: '033', name: 'Flight Planning', totalLOs: 95, coveredLOs: 0 },
        { id: '040', name: 'Human Performance', totalLOs: 110, coveredLOs: 0 },
        { id: '050', name: 'Meteorology', totalLOs: 160, coveredLOs: 0 },
        { id: '061', name: 'General Navigation', totalLOs: 90, coveredLOs: 0 },
        { id: '062', name: 'Radio Navigation', totalLOs: 328, coveredLOs: 0 },
        { id: '070', name: 'Operational Proc.', totalLOs: 85, coveredLOs: 0 },
        { id: '081', name: 'Principles of Flight', totalLOs: 150, coveredLOs: 0 },
        { id: '090', name: 'Communications', totalLOs: 119, coveredLOs: 0 },
        { id: '100', name: 'KSA', totalLOs: 40, coveredLOs: 0 },
    ];

    // Build map of syllabus.json data to override defaults
    const syllabusMap: Record<string, number> = {};
    for (const subject of syllabusData as SyllabusNode[]) {
        const id = getSubjectId(subject.code);
        syllabusMap[id] = countLOs(subject);
    }

    // Merge: use syllabus.json totalLOs when available AND meaningful (>10), otherwise keep defaults
    return defaultSubjects.map(sub => ({
        ...sub,
        totalLOs: (syllabusMap[sub.id] && syllabusMap[sub.id] > 10) ? syllabusMap[sub.id] : sub.totalLOs,
    }));
}

// Generate SUBJECTS dynamically from the JSON
export const SUBJECTS: SubjectStats[] = buildSubjectsFromSyllabus();

// Covered Learning Objectives - these map platform modules to syllabus sections
export const LEARNING_OBJECTIVES: LearningObjective[] = [
    // --- 010 AIR LAW ---
    { id: '010.01', subject: '010', text: 'International Law: Conventions & Agreements', coveredBy: View.AIR_LAW_INT_LAW },
    { id: '010.02', subject: '010', text: 'Airworthiness of Aircraft (Annex 8)', coveredBy: View.AIR_LAW_AIRWORTHINESS },
    { id: '010.03', subject: '010', text: 'Aircraft Nationality & Registration (Annex 7)', coveredBy: View.AIR_LAW_REGISTRATION },
    { id: '010.04', subject: '010', text: 'Personnel Licensing (Annex 1)', coveredBy: View.AIR_LAW_PERSONNEL },
    { id: '010.05', subject: '010', text: 'Rules of the Air (Annex 2 / SERA)', coveredBy: View.AIR_LAW_RULES_DETAILS },
    { id: '010.05.02', subject: '010', text: 'Visual & Instrument Flight Rules', coveredBy: View.AIR_LAW_RULES_OF_AIR },
    { id: '010.05.03', subject: '010', text: 'Interception Procedures', coveredBy: View.AIR_LAW_INTERCEPT },
    { id: '010.05.04', subject: '010', text: 'Altimeter Setting Procedures', coveredBy: View.AIR_LAW_ALTIMETER },
    { id: '010.05.05', subject: '010', text: 'Cruising Levels (Semi-Circular Rule)', coveredBy: View.AIR_LAW_CRUISING },
    { id: '010.06', subject: '010', text: 'Aircraft Operations (Annex 6)', coveredBy: View.AIR_LAW_DOCS },
    { id: '010.06.02', subject: '010', text: 'Operational Procedures (PANS-OPS)', coveredBy: View.AIR_LAW_PANS_OPS },
    { id: '010.06.04', subject: '010', text: 'Instrument Approach Procedures', coveredBy: View.AIR_LAW_INSTRUMENT },
    { id: '010.06.05', subject: '010', text: 'Holding Procedures', coveredBy: View.AIR_LAW_HOLDING },
    { id: '010.07', subject: '010', text: 'Air Traffic Services (Annex 11)', coveredBy: View.AIR_LAW_LAYERS },
    { id: '010.07.02', subject: '010', text: 'Airspace Classifications', coveredBy: View.AIR_LAW_IFR_VFR },
    { id: '010.08', subject: '010', text: 'Aeronautical Information Service (Annex 15)', coveredBy: View.AIR_LAW_OPS_INFO },
    { id: '010.09', subject: '010', text: 'Aerodromes (Annex 14)', coveredBy: View.AIR_LAW_REF_CODE },
    { id: '010.09.02', subject: '010', text: 'Aerodrome Data & Dimensions', coveredBy: View.AIR_LAW_DECLARED_DIST },
    { id: '010.09.03', subject: '010', text: 'Movement Area & Surfaces', coveredBy: View.AIR_LAW_SURFACE_CON },
    { id: '010.09.04', subject: '010', text: 'Visual Aids: Markings', coveredBy: View.AIR_LAW_AERODROME_VIS },
    { id: '010.09.05', subject: '010', text: 'Visual Aids: Lights', coveredBy: View.AIR_LAW_LIGHTING },
    { id: '010.09.06', subject: '010', text: 'Visual Aids: Signs', coveredBy: View.AIR_LAW_SIGNS },
    { id: '010.09.07', subject: '010', text: 'Visual Aids: PAPI/VASIS', coveredBy: View.AIR_LAW_TVASIS },
    { id: '010.09.08', subject: '010', text: 'Runway Status Lights', coveredBy: View.AIR_LAW_RWSL },
    { id: '010.10', subject: '010', text: 'Facilitation (Annex 9)', coveredBy: View.AIR_LAW_OPS_INFO },
    { id: '010.11', subject: '010', text: 'Search and Rescue (Annex 12)', coveredBy: View.AIR_LAW_SAR },
    { id: '010.12', subject: '010', text: 'Security (Annex 17)', coveredBy: View.AIR_LAW_SECURITY },
    { id: '010.13', subject: '010', text: 'Accident Investigation (Annex 13)', coveredBy: View.AIR_LAW_ACCIDENT },
    { id: '010.14', subject: '010', text: 'Ground Operations', coveredBy: View.AIR_LAW_GROUND_OPS },

    // --- 021 AGK SYSTEMS ---
    { id: '021.03.01', subject: '021', text: 'Hydromechanics: Principles', coveredBy: View.AGK_HYDRAULICS },
    { id: '021.11.01', subject: '021', text: 'Gas Turbines: Basic Principles', coveredBy: View.AGK_JET_ENGINE },

    // --- 031 MASS & BALANCE ---
    // [031.01] PURPOSE OF MASS-AND-BALANCE
    { id: '031.01', subject: '031', text: 'Purpose', coveredBy: View.MASS_BAL_DEFINITIONS },

    // [031.02] LOADING
    { id: '031.02', subject: '031', text: 'Loading', coveredBy: View.MASS_BAL_LIMITS },
    { id: '031.02.01', subject: '031', text: 'Mass definitions', coveredBy: View.MASS_BAL_DEFINITIONS },
    { id: '031.02.02', subject: '031', text: 'Mass limits', coveredBy: View.MASS_BAL_LIMITS },

    // [031.04] MASS-AND-BALANCE DETAILS OF AIRCRAFT
    { id: '031.04', subject: '031', text: 'Details of Aircraft', coveredBy: View.MASS_BAL_MAC },
    { id: '031.04.01', subject: '031', text: 'Weighing procedures', coveredBy: View.MASS_BAL_MAC },

    // [031.05] DETERMINATION OF CG POSITION
    { id: '031.05', subject: '031', text: 'Determination of CG Position', coveredBy: View.MASS_BAL_CG_CALC },
    { id: '031.05.01', subject: '031', text: 'Methods of calculation', coveredBy: View.MASS_BAL_CG_CALC },
    { id: '031.05.02', subject: '031', text: 'Arithmetic method', coveredBy: View.MASS_BAL_CG_CALC },

    // [031.06] CARGO HANDLING
    { id: '031.06', subject: '031', text: 'Cargo Handling', coveredBy: View.MASS_BAL_SHIFT },
    { id: '031.06.01', subject: '031', text: 'Load shifting', coveredBy: View.MASS_BAL_SHIFT },

    // --- 040 HUMAN PERFORMANCE (Complete EASA Coverage) ---
    // 040.01 - Human Factors: Basic Concepts
    { id: '040.01', subject: '040', text: 'Human Factors: Basic Concepts', coveredBy: View.HPL_BASIC_CONCEPTS },
    { id: '040.01.01', subject: '040', text: 'Human factors in aviation', coveredBy: View.HPL_BASIC_CONCEPTS },
    { id: '040.01.03', subject: '040', text: 'TEM and SHELL models', coveredBy: View.HPL_TEM },
    { id: '040.01.04', subject: '040', text: 'Safety culture', coveredBy: View.HPL_SAFETY },

    // 040.02 - Basics of Aviation Physiology
    { id: '040.02', subject: '040', text: 'Basics of Aviation Physiology and Health', coveredBy: View.HPL_HOME },
    { id: '040.02.01.01', subject: '040', text: 'The atmosphere - composition, gas laws', coveredBy: View.HPL_ATMOSPHERE },
    { id: '040.02.01.02', subject: '040', text: 'Respiratory system', coveredBy: View.HPL_RESPIRATION },
    { id: '040.02.01.03', subject: '040', text: 'Circulatory system', coveredBy: View.HPL_CIRCULATION },
    { id: '040.02.02.01', subject: '040', text: 'Central and peripheral nervous system', coveredBy: View.HPL_NERVOUS },
    { id: '040.02.02.02', subject: '040', text: 'Vision', coveredBy: View.HPL_VISION },
    { id: '040.02.02.03', subject: '040', text: 'Hearing', coveredBy: View.HPL_HEARING },
    { id: '040.02.02.04', subject: '040', text: 'Equilibrium - vestibular system', coveredBy: View.HPL_VESTIBULAR },
    { id: '040.02.02.06', subject: '040', text: 'Motion sickness', coveredBy: View.HPL_MOTION_SICKNESS },
    { id: '040.02.03.01', subject: '040', text: 'Personal hygiene, physical fitness', coveredBy: View.HPL_HEALTH },
    { id: '040.02.03.02', subject: '040', text: 'Toxic hazards - CO, alcohol, drugs', coveredBy: View.HPL_TOXIC },
    { id: '040.02.03.03', subject: '040', text: 'Hypoxia and hyperventilation', coveredBy: View.HPL_PHYSIOLOGY },
    { id: '040.02.03.04', subject: '040', text: 'Pressure effects - barotrauma, decompression', coveredBy: View.HPL_PRESSURE },
    { id: '040.02.03.05', subject: '040', text: 'G-effects and accelerations', coveredBy: View.HPL_ACCELERATION },

    // 040.03 - Basic Aviation Psychology
    { id: '040.03', subject: '040', text: 'Basic Aviation Psychology', coveredBy: View.HPL_HOME },
    { id: '040.03.01.01', subject: '040', text: 'Attention, perception, memory', coveredBy: View.HPL_INFO_PROCESSING },
    { id: '040.03.01.02', subject: '040', text: 'Perception and illusions', coveredBy: View.HPL_PERCEPTION },
    { id: '040.03.01.03', subject: '040', text: 'Memory - sensory, STM, LTM', coveredBy: View.HPL_MEMORY },
    { id: '040.03.01.04', subject: '040', text: 'Learning and skill acquisition', coveredBy: View.HPL_LEARNING },
    { id: '040.03.02.01', subject: '040', text: 'Error models - Reason model, error chains', coveredBy: View.HPL_ERROR_DECISION },
    { id: '040.03.02.03', subject: '040', text: 'Cognitive biases', coveredBy: View.HPL_BIASES },
    { id: '040.03.02.04', subject: '040', text: 'Stress and stressors', coveredBy: View.HPL_COMMS_STRESS },
    { id: '040.03.03.01', subject: '040', text: 'Decision-making models - FOR-DEC, DODAR', coveredBy: View.HPL_ERROR_DECISION },
    { id: '040.03.04.01', subject: '040', text: 'CRM, SOPs, checklists', coveredBy: View.HPL_COCKPIT_MGMT },
    { id: '040.03.04.02', subject: '040', text: 'Communication', coveredBy: View.HPL_COMMS_STRESS },
    { id: '040.03.05.01', subject: '040', text: 'Personality traits', coveredBy: View.HPL_PERSONALITY },
    { id: '040.03.05.02', subject: '040', text: 'Hazardous attitudes', coveredBy: View.HPL_BEHAVIOUR },
    { id: '040.03.06.01', subject: '040', text: 'Workload management', coveredBy: View.HPL_WORKLOAD },
    { id: '040.03.06.02', subject: '040', text: 'Fatigue and sleep', coveredBy: View.HPL_SLEEP },
    { id: '040.03.06.03', subject: '040', text: 'Sleep disorders', coveredBy: View.HPL_SLEEP_DISORDERS },
    { id: '040.03.06.04', subject: '040', text: 'Thermal comfort', coveredBy: View.HPL_THERMAL },
    { id: '040.03.06.05', subject: '040', text: 'Radiation', coveredBy: View.HPL_RADIATION },
    { id: '040.03.07.01', subject: '040', text: 'Automation advantages and disadvantages', coveredBy: View.HPL_AUTOMATION },
    { id: '040.03.07.02', subject: '040', text: 'Ergonomics and human-machine interface', coveredBy: View.HPL_ERGONOMICS },
    { id: '040.03.07.03', subject: '040', text: 'Culture and organizational factors', coveredBy: View.HPL_CULTURE },
    { id: '040.03.07.04', subject: '040', text: 'Metabolism and nutrition', coveredBy: View.HPL_METABOLISM },

    // --- 050 METEOROLOGY ---
    { id: '050.01.01', subject: '050', text: 'The Atmosphere: Structure', coveredBy: View.MET_ATMOSPHERE },

    // --- 061 GEN NAV ---
    { id: '061.01.03', subject: '061', text: 'Navigation: 1 in 60 Rule', coveredBy: View.NAV_60_1 },
    { id: '061.01.05', subject: '061', text: 'Time: UTC & Local', coveredBy: View.TIME_ZONER },

    // --- 062 RADIO NAV ---
    { id: '062.01', subject: '062', text: 'Radio Fundamentals (Class 1)', coveredBy: View.RAD_NAV_CLASS_1 },
    { id: '062.01.01', subject: '062', text: 'Wave Propagation', coveredBy: View.RAD_NAV_WAVE_PROP },
    { id: '062.01.02', subject: '062', text: 'Frequency Spectrum', coveredBy: View.RAD_NAV_SPECTRUM },
    { id: '062.01.03', subject: '062', text: 'Modulation', coveredBy: View.RAD_NAV_MODULATION },
    { id: '062.01.04', subject: '062', text: 'Antennas', coveredBy: View.RAD_NAV_ANTENNA },
    { id: '062.01.05', subject: '062', text: 'Ionosphere', coveredBy: View.RAD_NAV_IONOSPHERE },
    { id: '062.02', subject: '062', text: 'VHF Direction Finding (VDF)', coveredBy: View.RAD_NAV_VDF },
    { id: '062.02.01', subject: '062', text: 'ADF / NDB', coveredBy: View.RAD_NAV_ADF },
    { id: '062.02.02', subject: '062', text: 'VOR / DVOR', coveredBy: View.RAD_NAV_VOR },
    { id: '062.02.03', subject: '062', text: 'DME', coveredBy: View.RAD_NAV_DME },
    { id: '062.02.04', subject: '062', text: 'ILS', coveredBy: View.RAD_NAV_ILS },
    { id: '062.02.05', subject: '062', text: 'MLS', coveredBy: View.RAD_NAV_MLS },
    { id: '062.03', subject: '062', text: 'Basic Radar Theory', coveredBy: View.RAD_NAV_RADAR },
    { id: '062.03.01', subject: '062', text: 'Secondary Surveillance Radar (SSR)', coveredBy: View.RAD_NAV_SSR },
    { id: '062.05', subject: '062', text: 'Area Navigation (RNAV/PBN)', coveredBy: View.RAD_NAV_RNAV },
    { id: '062.05.01', subject: '062', text: 'FMS', coveredBy: View.RAD_NAV_FMS },
    { id: '062.06', subject: '062', text: 'GNSS: Principles', coveredBy: View.NAV_GNSS }, // Includes GNSS Theory
    { id: '062.06.01', subject: '062', text: 'SBAS / ABAS', coveredBy: View.RAD_NAV_SBAS },
    { id: '062.07', subject: '062', text: 'Weather Radar', coveredBy: View.RAD_NAV_WX_RADAR },

    // --- 081 PRINCIPLES OF FLIGHT ---
    { id: '081.01.01', subject: '081', text: 'Subsonic Aerodynamics: Lift/Drag', coveredBy: View.POF_LIFT_DRAG },

    // --- 090 COMMUNICATIONS (Comprehensive) ---
    // 090.01 Concepts
    { id: '090.01', subject: '090', text: 'Concepts', coveredBy: View.DASHBOARD },
    { id: '090.01.01', subject: '090', text: 'Definitions & Terms', coveredBy: View.GENERAL_THEORY },
    { id: '090.01.02', subject: '090', text: 'Abbreviations', coveredBy: View.GENERAL_THEORY },
    { id: '090.01.03', subject: '090', text: 'Q-Codes', coveredBy: View.QCODE_CARDS },
    { id: '090.01.04', subject: '090', text: 'Categories of Messages', coveredBy: View.PRIORITY },

    // 090.02 General Operating Procedures
    { id: '090.02', subject: '090', text: 'General Operating Procedures', coveredBy: View.DASHBOARD },
    { id: '090.02.01', subject: '090', text: 'Transmission Technique', coveredBy: View.GENERAL_THEORY },
    { id: '090.02.02', subject: '090', text: 'Callsigns & Suffixes', coveredBy: View.SUFFIX_MATCH },
    { id: '090.02.03', subject: '090', text: 'Transmission of Numbers', coveredBy: View.ALT_SPEAK },
    { id: '090.02.04', subject: '090', text: 'Transmission of Time', coveredBy: View.TIME_REPORT },
    { id: '090.02.05', subject: '090', text: 'Standard Words & Phrases', coveredBy: View.WORD_MATCH },
    { id: '090.02.06', subject: '090', text: 'Radiotelephony Call Signs', coveredBy: View.FLIGHT_RULES },
    { id: '090.02.07', subject: '090', text: 'Readback Requirements', coveredBy: View.READBACK },
    { id: '090.02.08', subject: '090', text: 'Test Procedures', coveredBy: View.READABILITY_SIM },
    { id: '090.02.09', subject: '090', text: 'Transfer of Communications', coveredBy: View.FLIGHT_RULES },
    { id: '090.02.10', subject: '090', text: 'VFR Communications', coveredBy: View.VFR_COMMS_SIM },
    { id: '090.02.11', subject: '090', text: 'IFR Communications', coveredBy: View.PHRASEOLOGY_EXPLORER },
    { id: '090.02.12', subject: '090', text: 'Advanced Phraseology', coveredBy: View.ADV_PHRASEOLOGY },

    // 090.03 Weather
    { id: '090.03', subject: '090', text: 'Relevant Weather Information', coveredBy: View.DASHBOARD },
    { id: '090.03.01', subject: '090', text: 'Aerodrome Weather (METAR)', coveredBy: View.METAR },
    { id: '090.03.02', subject: '090', text: 'Weather Broadcasts (VOLMET/ATIS)', coveredBy: View.VOLMET_SIM },
    { id: '090.03.03', subject: '090', text: 'Special Air Reports', coveredBy: View.AIREP_SPEC },

    // 090.04 Failure
    { id: '090.04', subject: '090', text: 'Voice Communication Failure', coveredBy: View.COMM_FAIL },
    { id: '090.04.01', subject: '090', text: 'Communications Failure', coveredBy: View.COMM_FAIL },
    { id: '090.04.02', subject: '090', text: 'Blind Transmission', coveredBy: View.BLIND_TX },

    // 090.05 Distress
    { id: '090.05', subject: '090', text: 'Distress and Urgency Procedures', coveredBy: View.EMERGENCY },
    { id: '090.05.01', subject: '090', text: 'Distress (MAYDAY)', coveredBy: View.EMERGENCY },
    { id: '090.05.02', subject: '090', text: 'Urgency (PAN-PAN)', coveredBy: View.EMERGENCY },
    { id: '090.05.03', subject: '090', text: 'Emergency Operations', coveredBy: View.EMERGENCY_OPS },

    // 090.06 Propagation
    { id: '090.06', subject: '090', text: 'VHF Propagation and Allocation', coveredBy: View.PROPAGATION_THEORY },
    { id: '090.06.01', subject: '090', text: 'VHF Propagation', coveredBy: View.PROPAGATION_THEORY },
    { id: '090.06.02', subject: '090', text: 'Frequency Spectrum', coveredBy: View.BAND_SPEC },
    { id: '090.06.03', subject: '090', text: 'Range & Altitude', coveredBy: View.VHF_CALC },
    { id: '090.06.04', subject: '090', text: 'Technical Aspects', coveredBy: View.TECH_PHYSICS },

    // 090.07 Misc
    { id: '090.07', subject: '090', text: 'Other Communications', coveredBy: View.DASHBOARD },
    { id: '090.07.01', subject: '090', text: 'Morse Code', coveredBy: View.MORSE },
    { id: '090.07.02', subject: '090', text: 'Transponder Operation', coveredBy: View.TRANSPONDER },
    { id: '090.07.03', subject: '090', text: 'Data Link (ACARS/CPDLC)', coveredBy: View.RADIO_NAV_DATA },

    // --- 100 KNOWLEDGE, SKILLS AND ATTITUDES (KSA) ---
    { id: '100.01', subject: '100', text: 'ICAO Core Competencies', coveredBy: View.KSA_COMPETENCIES },
    { id: '100.02', subject: '100', text: 'Core Competencies Learning Objectives', coveredBy: View.KSA_COMPETENCIES },
    { id: '100.03', subject: '100', text: 'Threat and Error Management (TEM)', coveredBy: View.KSA_TEM },
    { id: '100.04', subject: '100', text: 'Mental Maths', coveredBy: View.KSA_MENTAL_MATHS },
];

// Calculate progress by comparing covered LOs to total from syllabus
export const calculateProgress = () => {
    const stats = SUBJECTS.map(sub => {
        // Find mapped learning objectives for this subject
        const mappedLOs = LEARNING_OBJECTIVES.filter(lo => lo.subject === sub.id && lo.coveredBy);

        // Count the unique modules covering this subject
        const uniqueModules = new Set(mappedLOs.map(lo => lo.coveredBy)).size;

        // Each interactive module covers approximately 5 official Learning Objectives (LOs)
        // EXCEPTION: Radio Nav (062) modules are huge (entire chapters), so we weight them higher (18 LOs each)
        // to reflect that ~18 modules cover the entire ~320 LO syllabus.
        const weightPerModule = sub.id === '062' ? 18 : 5;
        const estimatedCoverage = uniqueModules * weightPerModule;

        // Calculate percentage using the actual totalLOs from syllabus.json
        const percentage = sub.totalLOs > 0
            ? Math.min(100, Math.round((estimatedCoverage / sub.totalLOs) * 100))
            : 0;

        return {
            ...sub,
            coveredLOs: estimatedCoverage,
            percentage: percentage
        };
    });
    return stats;
};
