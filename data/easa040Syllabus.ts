/**
 * EASA 040 - Human Performance & Limitations
 * Complete Learning Objectives extracted from EASA Part-FCL Regulation 1178/2011
 * 
 * Status: ✅ Covered | ⚠️ Partial | ❌ Missing
 */

import { View } from '../types';

export interface EASA_LO {
    id: string;
    title: string;
    status: 'covered' | 'partial' | 'missing';
    component?: View;
}

export const EASA_040_SYLLABUS = {
    '040.00.00.00': { title: 'HUMAN PERFORMANCE AND LIMITATIONS', status: 'covered' },

    // 040.01 - HUMAN FACTORS: BASIC CONCEPTS
    '040.01.00.00': { title: 'HUMAN FACTORS: BASIC CONCEPTS', status: 'covered' },
    '040.01.01.00': { title: 'Human factors in aviation', status: 'covered', component: View.HPL_BASIC_CONCEPTS },
    '040.01.01.01': { title: 'Becoming a competent pilot - ICAO competencies', status: 'covered', component: View.HPL_BASIC_CONCEPTS },
    '040.01.02.00': { title: 'Intentionally left blank', status: 'covered' },
    '040.01.03.00': { title: 'Flight safety concepts', status: 'covered' },
    '040.01.03.01': { title: 'TEM and SHELL models', status: 'covered', component: View.HPL_TEM },
    '040.01.04.00': { title: 'Safety culture', status: 'covered', component: View.HPL_SAFETY },
    '040.01.04.01': { title: 'Just culture, SMS principles', status: 'covered', component: View.HPL_SAFETY },

    // 040.02 - BASICS OF AVIATION PHYSIOLOGY AND HEALTH MAINTENANCE
    '040.02.00.00': { title: 'BASICS OF AVIATION PHYSIOLOGY AND HEALTH MAINTENANCE', status: 'covered' },
    '040.02.01.00': { title: 'Basics of flight physiology', status: 'covered' },
    '040.02.01.01': { title: 'The atmosphere - composition, gas laws', status: 'covered', component: View.HPL_ATMOSPHERE },
    '040.02.01.02': { title: 'Respiratory system', status: 'covered', component: View.HPL_RESPIRATION },
    '040.02.01.03': { title: 'Circulatory system', status: 'covered', component: View.HPL_CIRCULATION },
    '040.02.02.00': { title: 'People and the environment: the sensory system', status: 'covered' },
    '040.02.02.01': { title: 'Central and peripheral nervous system', status: 'covered', component: View.HPL_NERVOUS },
    '040.02.02.02': { title: 'Vision', status: 'covered', component: View.HPL_VISION },
    '040.02.02.03': { title: 'Hearing', status: 'covered', component: View.HPL_HEARING }, // Vision protection also in HPL_VISION
    '040.02.02.04': { title: 'Equilibrium - vestibular system', status: 'covered', component: View.HPL_VESTIBULAR },
    '040.02.02.05': { title: 'Integration of senses - spatial disorientation', status: 'covered', component: View.HPL_VESTIBULAR },
    '040.02.02.06': { title: 'Motion sickness', status: 'covered', component: View.HPL_MOTION_SICKNESS },
    '040.02.03.00': { title: 'Health and hygiene', status: 'covered' },
    '040.02.03.01': { title: 'Personal hygiene, physical fitness', status: 'covered', component: View.HPL_HEALTH },
    '040.02.03.02': { title: 'Toxic hazards - CO, alcohol, drugs, fumes', status: 'covered', component: View.HPL_TOXIC }, // Fumes also in HPL_INCAPACITATION
    '040.02.03.03': { title: 'Hypoxia and hyperventilation', status: 'covered', component: View.HPL_PHYSIOLOGY },
    '040.02.03.04': { title: 'Pressure effects - barotrauma, decompression', status: 'covered', component: View.HPL_PRESSURE },
    '040.02.03.05': { title: 'G-effects and accelerations', status: 'covered', component: View.HPL_ACCELERATION },
    '040.02.03.06': { title: 'Incapacitation in flight', status: 'covered', component: View.HPL_INCAPACITATION },

    // 040.03 - BASIC AVIATION PSYCHOLOGY
    '040.03.00.00': { title: 'BASIC AVIATION PSYCHOLOGY', status: 'covered' },
    '040.03.01.00': { title: 'Human information processing', status: 'covered' },
    '040.03.01.01': { title: 'Attention, perception, memory', status: 'covered', component: View.HPL_INFO_PROCESSING },
    '040.03.01.02': { title: 'Perception and illusions', status: 'covered', component: View.HPL_PERCEPTION },
    '040.03.01.03': { title: 'Memory - sensory, STM, LTM', status: 'covered', component: View.HPL_MEMORY },
    '040.03.01.04': { title: 'Learning and skill acquisition', status: 'covered', component: View.HPL_LEARNING },
    '040.03.02.00': { title: 'Human error and reliability', status: 'covered' },
    '040.03.02.01': { title: 'Error models - Reason model, error chains', status: 'covered', component: View.HPL_ERROR_DECISION },
    '040.03.02.02': { title: 'Mental models and situation awareness', status: 'covered', component: View.HPL_INFO_PROCESSING },
    '040.03.02.03': { title: 'Cognitive biases', status: 'covered', component: View.HPL_BIASES },
    '040.03.02.04': { title: 'Stress and stressors', status: 'covered', component: View.HPL_COMMS_STRESS },
    '040.03.03.00': { title: 'Decision-making', status: 'covered' },
    '040.03.03.01': { title: 'Decision-making models - FOR-DEC, DODAR', status: 'covered', component: View.HPL_ERROR_DECISION },
    '040.03.04.00': { title: 'Avoiding and managing errors: cockpit management', status: 'covered' },
    '040.03.04.01': { title: 'CRM, SOPs, checklists', status: 'covered', component: View.HPL_COCKPIT_MGMT },
    '040.03.04.02': { title: 'Communication', status: 'covered', component: View.HPL_COMMS_STRESS },
    '040.03.04.03': { title: 'Teamwork and leadership', status: 'covered', component: View.HPL_COCKPIT_MGMT },
    '040.03.04.04': { title: 'Conflict management', status: 'covered', component: View.HPL_BEHAVIOUR },
    '040.03.05.00': { title: 'Human behaviour', status: 'covered' },
    '040.03.05.01': { title: 'Personality traits', status: 'covered', component: View.HPL_PERSONALITY },
    '040.03.05.02': { title: 'Hazardous attitudes', status: 'covered', component: View.HPL_BEHAVIOUR },
    '040.03.05.03': { title: 'Error proneness', status: 'covered', component: View.HPL_BEHAVIOUR },
    '040.03.06.00': { title: 'Human overload and underload', status: 'covered' },
    '040.03.06.01': { title: 'Workload management', status: 'covered', component: View.HPL_WORKLOAD },
    '040.03.06.02': { title: 'Fatigue and sleep', status: 'covered', component: View.HPL_SLEEP },
    '040.03.06.03': { title: 'Sleep disorders', status: 'covered', component: View.HPL_SLEEP_DISORDERS },
    '040.03.06.04': { title: 'Thermal comfort', status: 'covered', component: View.HPL_THERMAL },
    '040.03.06.05': { title: 'Radiation', status: 'covered', component: View.HPL_RADIATION },
    '040.03.07.00': { title: 'Advanced cockpit automation', status: 'covered' },
    '040.03.07.01': { title: 'Automation advantages and disadvantages', status: 'covered', component: View.HPL_AUTOMATION },
    '040.03.07.02': { title: 'Mode confusion, complacency', status: 'covered', component: View.HPL_AUTOMATION },
    '040.03.07.03': { title: 'Working concepts - ergonomics', status: 'covered', component: View.HPL_ERGONOMICS },
};

// Calculate coverage statistics
export const getHPLCoverageStats = () => {
    const entries = Object.entries(EASA_040_SYLLABUS);
    const total = entries.length;
    const covered = entries.filter(([_, v]) => v.status === 'covered').length;
    const partial = entries.filter(([_, v]) => v.status === 'partial').length;
    const missing = entries.filter(([_, v]) => v.status === 'missing').length;

    return {
        total,
        covered,
        partial,
        missing,
        percentage: Math.round((covered / total) * 100)
    };
};
