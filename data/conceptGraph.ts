/**
 * ATPLVector Curriculum & Prerequisite Graph Architecture
 * 
 * Formal Directed Acyclic Graph (DAG) modeling the cognitive primitives,
 * prerequisite dependencies, cross-subject attachments, and regulatory metadata.
 * 
 * Demonstrates:
 * 1. The 7-Node Core Learning Chain:
 *    Atmospheric Pressure -> Temperature -> Density -> Altimeter Principles/Settings -> Altitude/Height/FL -> Density Altitude -> Aircraft Performance
 * 2. Separation between ECQB Regulatory Learning Objectives and Cognitive Foundation Concepts
 * 3. Multi-subject attachment (010, 022, 032, 050) using the Facade/Lens Pattern
 * 4. Misconceptions and Observable Evidence of Understanding
 * 5. Full 13-Subject Foundation Inventory
 * 6. Jurisdiction and Licence Level Regulatory Metadata (EASA, UK CAA, FAA, PPL, CPL, IR, ATPL)
 */

import { View } from '../types';

// ============================================================================
// 1. FORMAL METADATA & SCHEMA INTERFACES
// ============================================================================

export type Authority = 'EASA' | 'UK_CAA' | 'FAA' | 'ICAO';
export type LicenceLevel = 'PPL' | 'CPL' | 'IR' | 'ATPL' | 'CB_IR' | 'BIR';
export type AircraftCategory = 'A' | 'H'; // Aeroplane | Helicopter

export type SubjectCode = 
  | '010' // Air Law & ATC Procedures
  | '021' // AGK: Airframe, Systems, Powerplant
  | '022' // AGK: Instrumentation
  | '031' // Mass & Balance
  | '032' // Flight Performance (Aeroplanes)
  | '033' // Flight Planning & Monitoring
  | '040' // Human Performance & Limitations
  | '050' // Meteorology
  | '061' // General Navigation
  | '062' // Radio Navigation
  | '070' // Operational Procedures
  | '081' // Principles of Flight (Aeroplanes)
  | '090' // Communications (VFR/IFR)
  | '100'; // Knowledge, Skills and Attitudes (KSA)

export type PrerequisiteType = 
  | 'HARD_PHYSICAL'          // Physics/Math dependency without which the downstream concept is incomprehensible
  | 'PARAMETRIC_INPUT'       // Physical quantity feeds directly into downstream state equations
  | 'CROSS_DISCIPLINARY'     // Physical concept mapped into legal, operational, or instrumental domains
  | 'COGNITIVE_SCAFFOLD';    // Intuitive mental anchor aiding conceptual transfer

export interface RegulatoryDelta {
  authority: Authority;
  differenceDescription: string;
  ruleReference: string; // e.g. "SERA.5001" vs "FAR 91.155"
  impactOnStudent: string;
}

export interface Misconception {
  id: string;
  flawedMentalModel: string;
  dangerLevel: 'ACADEMIC_CONFUSION' | 'EXAM_TRAP' | 'SYSTEMIC_ERROR' | 'FATAL_CFIT';
  diagnosticTriggerQuestion: string;
  correctCognitiveModel: string;
  remediationAction: string;
}

export interface MasteryEvidence {
  observableBehaviors: string[];
  quantitativeCalculationProof: string;
  simulatorTelemetryThreshold: string;
}

export interface SubjectAttachment {
  subject: SubjectCode;
  easaLearningObjectives: string[]; // ECQB 2026 / v6 LO codes
  regulatoryReferences: string[];   // CS-25, ICAO Doc 8168, etc.
  pedagogicalLens: string;          // Perspective emphasized in this subject
  scenarioChallenge: string;        // Concrete operational problem
}

export interface ConceptNode {
  id: string;
  title: string;
  category: 'ATMOSPHERE_PHYSICS' | 'INSTRUMENTATION' | 'ALTIMETRY_PROCEDURES' | 'AERODYNAMICS' | 'AIRCRAFT_PERFORMANCE';
  cognitiveLevel: 'FOUNDATION_INTUITIVE' | 'OPERATIONAL_APPLIED' | 'ADVANCED_SYNTHESIS';
  governingLaws: {
    name: string;
    formulaKaTeX: string;
    physicalInterpretation: string;
  }[];
  definition: string;
  componentView: View;
  prerequisites: {
    prerequisiteConceptId: string;
    type: PrerequisiteType;
    rationale: string;
    mathTransferEquation?: string;
  }[];
  misconceptions: Misconception[];
  masteryEvidence: MasteryEvidence;
  subjectAttachments: SubjectAttachment[];
  regulatoryMetadata: {
    applicableAuthorities: Authority[];
    licenceRelevance: LicenceLevel[];
    ecqb2026SyllabusCoverage: string[];
    deltas: RegulatoryDelta[];
  };
}

// ============================================================================
// 2. THE FORMAL 7-NODE CHAIN (PHYSICS TO FLIGHT OPERATIONS)
// ============================================================================

export const ATMOSPHERIC_PERFORMANCE_CHAIN: Record<string, ConceptNode> = {

  // --------------------------------------------------------------------------
  // NODE 1: ATMOSPHERIC PRESSURE
  // --------------------------------------------------------------------------
  CONCEPT_ATM_PRESSURE: {
    id: 'CONCEPT_ATM_PRESSURE',
    title: 'Atmospheric Pressure & Hydrostatic Gradient',
    category: 'ATMOSPHERE_PHYSICS',
    cognitiveLevel: 'FOUNDATION_INTUITIVE',
    governingLaws: [
      {
        name: 'Hydrostatic Balance Equation',
        formulaKaTeX: 'dP = -\\rho g dz',
        physicalInterpretation: 'Pressure decrease with altitude is proportional to the weight of the air column above.'
      },
      {
        name: 'Barometric Near-Surface Lapse Rate',
        formulaKaTeX: '\\frac{\\Delta z}{\\Delta P} \\approx 27\\text{ to }30\\text{ ft/hPa (MSL)}',
        physicalInterpretation: 'Near sea level in standard conditions, a 1 hPa pressure drop corresponds to ~27-30 feet of vertical ascent; expands to ~73 ft/hPa at 18,000 ft.'
      }
    ],
    definition: 'The static force exerted per unit area by the weight of atmospheric gas molecules above a given level, acting equally in all directions.',
    componentView: View.MET_PRESSURE,
    prerequisites: [],
    misconceptions: [
      {
        id: 'MISC_PRES_DIRECTION',
        flawedMentalModel: 'Believing atmospheric pressure acts only downwards like a solid weight pushing on an object.',
        dangerLevel: 'ACADEMIC_CONFUSION',
        diagnosticTriggerQuestion: 'Does the static port on the vertical fuselage side measure downward atmospheric weight or ambient air pressure?',
        correctCognitiveModel: 'Fluids in hydrostatic equilibrium exert static pressure omnidirectionally (Pascal principle); static ports measure true ambient pressure perpendicular to airflow.',
        remediationAction: 'Inspect 3D pitot-static fuselage cutaway showing static port pressure equilibrium.'
      },
      {
        id: 'MISC_PRES_LINEARITY',
        flawedMentalModel: 'Assuming pressure decreases linearly with altitude at 30 ft/hPa all the way to space.',
        dangerLevel: 'EXAM_TRAP',
        diagnosticTriggerQuestion: 'If pressure drops 1 hPa per 27 ft at sea level, what is the rate of change at FL 180 (500 hPa)?',
        correctCognitiveModel: 'Because air is compressible, density decreases with altitude; thus the vertical distance per hPa increases exponentially (approx 50 ft/hPa at 10,000 ft, 73 ft/hPa at 18,000 ft).',
        remediationAction: 'Interactive barometer column simulator demonstrating exponential air compressibility.'
      }
    ],
    masteryEvidence: {
      observableBehaviors: [
        'Explains why pressure is 1013.25 hPa at MSL but drops by half at ~18,000 ft (500 hPa).',
        'Recognizes that barometric lapse rate is non-linear without prompting.'
      ],
      quantitativeCalculationProof: 'Calculates pressure level spacing across layers: ~27 ft/hPa at SL, ~50 ft/hPa at 10,000 ft, ~73 ft/hPa at 18,000 ft.',
      simulatorTelemetryThreshold: 'Correctly sets ambient static pressure across varying altitudes within 5% error.'
    },
    subjectAttachments: [
      {
        subject: '050',
        easaLearningObjectives: ['050.01.03.01.01', '050.01.03.02.01', '050.01.03.02.03'],
        regulatoryReferences: ['ICAO Annex 3', 'WMO Guide No. 8'],
        pedagogicalLens: 'Meteorological isobars, pressure centers, vertical pressure gradients, barometric lapse rate in ISA.',
        scenarioChallenge: 'Interpret surface pressure chart showing high and low centers and calculate vertical spacing between 1000 hPa and 850 hPa surfaces.'
      },
      {
        subject: '022',
        easaLearningObjectives: ['022.01.01.01.01', '022.01.01.01.02', '022.02.01.01.01'],
        regulatoryReferences: ['CS-25.1325', 'TSO-C16a'],
        pedagogicalLens: 'Static pressure sensing, static port positioning, position/manoeuvre errors, transducer conversion.',
        scenarioChallenge: 'Analyze static port ice blockage and predict sensor readings during descent.'
      },
      {
        subject: '040',
        easaLearningObjectives: ['040.02.01.01.01', '040.02.03.04.01'],
        regulatoryReferences: ['Part-MED'],
        pedagogicalLens: 'Dalton and Boyle gas laws, expansion of trapped gases in body cavities (ears, sinuses, GI tract).',
        scenarioChallenge: 'Explain middle-ear barotrauma during rapid descent from FL 240.'
      }
    ],
    regulatoryMetadata: {
      applicableAuthorities: ['EASA', 'UK_CAA', 'FAA', 'ICAO'],
      licenceRelevance: ['PPL', 'CPL', 'ATPL'],
      ecqb2026SyllabusCoverage: ['050.01.03', '022.01.01'],
      deltas: [
        {
          authority: 'FAA',
          differenceDescription: 'FAA uses inches of mercury (inHg) as standard primary pressure unit (29.92 inHg), whereas EASA/ICAO uses hectopascals / millibars (1013.25 hPa). 1 inHg = 33.8639 hPa.',
          ruleReference: 'FAR 91.121',
          impactOnStudent: 'Must seamlessly convert: 1 inHg ≈ 33.86 hPa (1 hPa ≈ 0.03 inHg); rule of thumb 1 inHg ≈ 1000 ft altitude change.'
        }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // NODE 2: TEMPERATURE & LAPSE RATES
  // --------------------------------------------------------------------------
  CONCEPT_TEMPERATURE: {
    id: 'CONCEPT_TEMPERATURE',
    title: 'Atmospheric Temperature & Environmental Lapse Rates',
    category: 'ATMOSPHERE_PHYSICS',
    cognitiveLevel: 'FOUNDATION_INTUITIVE',
    governingLaws: [
      {
        name: 'ISA Standard Temperature Model',
        formulaKaTeX: 'T(z) = T_0 - L \\cdot z = 288.15\\text{ K} - 0.0065\\text{ K/m} \\cdot z = +15^\\circ\\text{C} - 1.98^\\circ\\text{C}/1000\\text{ ft}',
        physicalInterpretation: 'Standard temperature starts at +15°C at MSL and cools at 2°C per 1,000 ft until reaching -56.5°C at the tropopause (36,089 ft).'
      },
      {
        name: 'ISA Deviation Formulation',
        formulaKaTeX: '\\Delta ISA = OAT - T_{ISA}(z)',
        physicalInterpretation: 'The absolute temperature offset between the actual Outside Air Temperature (OAT) and the theoretical standard atmosphere at that pressure altitude.'
      }
    ],
    definition: 'The measure of average kinetic energy of air molecules, governing thermal expansion, adiabatic lapse behavior, and density variation.',
    componentView: View.MET_TEMPERATURE,
    prerequisites: [
      {
        prerequisiteConceptId: 'CONCEPT_ATM_PRESSURE',
        type: 'HARD_PHYSICAL',
        rationale: 'Thermal adiabatic expansion and lapse rates are driven by the vertical pressure drop.'
      }
    ],
    misconceptions: [
      {
        id: 'MISC_ISA_FIXED',
        flawedMentalModel: 'Believing the atmosphere is always ISA +0°C, or confusing airfield elevation with pressure altitude when computing ISA temperature.',
        dangerLevel: 'EXAM_TRAP',
        diagnosticTriggerQuestion: 'What is the ISA temperature at an aerodrome elevation of 4,000 ft when QNH is 993 hPa and OAT is +12°C?',
        correctCognitiveModel: 'ISA temperature must be evaluated at PRESSURE ALTITUDE, not geometric elevation! QNH 993 gives PA = 4,000 + (1013 - 993)*30 = 4,600 ft. ISA temp is 15 - (4.6 * 2) = +5.8°C; Delta ISA is +12 - 5.8 = +6.2°C.',
        remediationAction: 'Step-by-step ISA deviation calculation workbench.'
      },
      {
        id: 'MISC_INVERSION_DENSITY',
        flawedMentalModel: 'Assuming temperature always drops with altitude everywhere.',
        dangerLevel: 'SYSTEMIC_ERROR',
        diagnosticTriggerQuestion: 'In a surface temperature inversion, what happens to air density and altimeter error with altitude?',
        correctCognitiveModel: 'Inversions (warm air aloft) invert the standard lapse rate, dramatically modifying air density and altimeter column temperature error.',
        remediationAction: 'Skew-T log-P aerological diagram explorer.'
      }
    ],
    masteryEvidence: {
      observableBehaviors: [
        'Calculates ISA temperature for any flight level instantaneously (e.g. FL 100 = -5°C, FL 250 = -35°C, FL 350 = -55°C).',
        'Computes Delta ISA from given OAT and Pressure Altitude with zero prompting.'
      ],
      quantitativeCalculationProof: 'Solves complex non-standard temperature problems: e.g., Airport Elev 2,500 ft, QNH 1025 hPa, OAT +20°C -> PA = 2,140 ft -> T_ISA = +10.7°C -> Delta ISA = +9.3°C.',
      simulatorTelemetryThreshold: 'Correctly sets temperature deviation slider to match given OAT/PA within ±0.5°C.'
    },
    subjectAttachments: [
      {
        subject: '050',
        easaLearningObjectives: ['050.01.02.01.01', '050.01.02.02.01', '050.01.02.02.03'],
        regulatoryReferences: ['ICAO Doc 7488/3 (Manual of ICAO Standard Atmosphere)'],
        pedagogicalLens: 'Tropospheric lapse rates (DALR 3°C/1000ft, SALR ~1.5°C/1000ft, ELR), stability, inversions, tropopause height variations.',
        scenarioChallenge: 'Calculate freezing level given ground temperature +18°C and standard ELR 2°C/1000ft.'
      },
      {
        subject: '033',
        easaLearningObjectives: ['033.04.02.01', '033.04.02.02'],
        regulatoryReferences: ['EASA Part-CAT.OP.MPA.106'],
        pedagogicalLens: 'Cruise temperature effect on jet engine specific fuel consumption (SFC) and maximum certified flight level.',
        scenarioChallenge: 'Evaluate step climb capability at FL 370 with ISA +15°C vs ISA +0°C.'
      }
    ],
    regulatoryMetadata: {
      applicableAuthorities: ['EASA', 'UK_CAA', 'FAA', 'ICAO'],
      licenceRelevance: ['PPL', 'CPL', 'ATPL'],
      ecqb2026SyllabusCoverage: ['050.01.02', '033.04.02'],
      deltas: []
    }
  },

  // --------------------------------------------------------------------------
  // NODE 3: AIR DENSITY
  // --------------------------------------------------------------------------
  CONCEPT_AIR_DENSITY: {
    id: 'CONCEPT_AIR_DENSITY',
    title: 'Air Density & Equation of State',
    category: 'ATMOSPHERE_PHYSICS',
    cognitiveLevel: 'FOUNDATION_INTUITIVE',
    governingLaws: [
      {
        name: 'Ideal Gas Equation of State',
        formulaKaTeX: 'P = \\rho R T \\iff \\rho = \\frac{P}{R T}',
        physicalInterpretation: 'Density is directly proportional to static pressure and inversely proportional to absolute temperature (Kelvin).'
      },
      {
        name: 'Density Ratio (Sigma)',
        formulaKaTeX: '\\sigma = \\frac{\\rho}{\\rho_0} = \\frac{P}{P_0} \\cdot \\frac{T_0}{T}',
        physicalInterpretation: 'The dimensionless ratio of local density to standard sea-level density (rho0 = 1.225 kg/m3).'
      },
      {
        name: 'Humidity Effect on Density',
        formulaKaTeX: 'M_{water} = 18.02\\text{ g/mol} < M_{dry} = 28.96\\text{ g/mol} \\implies \\rho_{humid} < \\rho_{dry}',
        physicalInterpretation: 'Water vapor molecules displace heavier diatomic nitrogen and oxygen molecules, reducing air density.'
      }
    ],
    definition: 'The mass of air per unit volume (kg/m³). It directly governs the mass flow through engines, aerodynamic lift, and drag generation.',
    componentView: View.MET_DENSITY,
    prerequisites: [
      {
        prerequisiteConceptId: 'CONCEPT_ATM_PRESSURE',
        type: 'PARAMETRIC_INPUT',
        rationale: 'Density is directly driven by pressure P in the equation of state.',
        mathTransferEquation: '\\rho \\propto P'
      },
      {
        prerequisiteConceptId: 'CONCEPT_TEMPERATURE',
        type: 'PARAMETRIC_INPUT',
        rationale: 'Density is inversely driven by absolute temperature T.',
        mathTransferEquation: '\\rho \\propto 1/T'
      }
    ],
    misconceptions: [
      {
        id: 'MISC_HUMIDITY_HEAVY',
        flawedMentalModel: 'Believing humid air is "heavy" and therefore more dense than dry air.',
        dangerLevel: 'EXAM_TRAP',
        diagnosticTriggerQuestion: 'On a humid 35°C day, is the aircraft takeoff run shorter or longer than on a dry 35°C day?',
        correctCognitiveModel: 'Avogadro’s law states that equal volumes of gases at the same P and T contain equal numbers of molecules. H2O (mol mass 18) is lighter than N2 (28) and O2 (32). Humid air is LESS DENSE, reducing performance further!',
        remediationAction: 'Molecular balance visualization showing gas molecular weights.'
      },
      {
        id: 'MISC_DENSITY_ALT_INVERSION',
        flawedMentalModel: 'Thinking "high density altitude" means the air is dense.',
        dangerLevel: 'FATAL_CFIT',
        diagnosticTriggerQuestion: 'If the ATIS states "Density Altitude 8,500 feet" at a 2,000 ft airport, is the air dense or thin?',
        correctCognitiveModel: 'High density altitude means the air has the density equivalent of a HIGH altitude — it is THIN air, yielding POOR performance!',
        remediationAction: 'Density Altitude semantic clarification lab.'
      }
    ],
    masteryEvidence: {
      observableBehaviors: [
        'Articulates within 5 seconds the three culprits of poor air density: High Altitude, High Temperature, High Humidity.',
        'Calculates air density rho given P and T using R = 287.058 J/(kg*K).'
      ],
      quantitativeCalculationProof: 'Solves: At FL 100 (P = 697 hPa, T = -5°C = 268.15 K): rho = 69700 / (287.058 * 268.15) = 0.905 kg/m3. Sigma = 0.905 / 1.225 = 0.739.',
      simulatorTelemetryThreshold: 'Predicts dynamic pressure variation within ±2% across simulated density variations.'
    },
    subjectAttachments: [
      {
        subject: '050',
        easaLearningObjectives: ['050.01.04.01.01', '050.01.04.01.02', '050.03.01.01.01'],
        regulatoryReferences: ['WMO-No. 8'],
        pedagogicalLens: 'Vertical density distribution, atmospheric stability, thermal convection.',
        scenarioChallenge: 'Calculate density reduction across a cold front passing through an elevated valley.'
      },
      {
        subject: '081',
        easaLearningObjectives: ['081.01.01.01.01', '081.01.01.01.02', '081.01.04.01.01'],
        regulatoryReferences: ['CS-25 Book 1 Subpart B'],
        pedagogicalLens: 'Dynamic pressure q = 0.5 * rho * V^2, Lift equation L = q * S * CL, relation between EAS and TAS.',
        scenarioChallenge: 'Demonstrate why TAS must increase as density drops to maintain constant lift in level flight.'
      }
    ],
    regulatoryMetadata: {
      applicableAuthorities: ['EASA', 'UK_CAA', 'FAA', 'ICAO'],
      licenceRelevance: ['PPL', 'CPL', 'ATPL'],
      ecqb2026SyllabusCoverage: ['050.01.04', '081.01.01'],
      deltas: []
    }
  },

  // --------------------------------------------------------------------------
  // NODE 4: ALTIMETER PRINCIPLES & SETTINGS
  // --------------------------------------------------------------------------
  CONCEPT_ALTIMETER_PRINCIPLES: {
    id: 'CONCEPT_ALTIMETER_PRINCIPLES',
    title: 'Pressure Altimeter Mechanism & Subscale Settings',
    category: 'INSTRUMENTATION',
    cognitiveLevel: 'OPERATIONAL_APPLIED',
    governingLaws: [
      {
        name: 'Aneroid Capsule Deflection Law',
        formulaKaTeX: '\\Delta x_{capsule} = f(P_{static} - P_{sealed}) = f(P_{static})',
        physicalInterpretation: 'Evacuated capsule expands as static pressure drops and contracts as static pressure rises.'
      },
      {
        name: 'Kollsman Subscale Mechanical Offset',
        formulaKaTeX: 'Altitude_{indicated} = Altitude_{calibrated} + (Subscale - 1013.25) \\times 27\\text{ to }30\\text{ ft/hPa}',
        physicalInterpretation: 'Rotating the setting knob mechanically shifts the pointer datum without altering capsule sensitivity.'
      },
      {
        name: 'Altimeter Subscale Settings Definitions',
        formulaKaTeX: '\\text{QNH: Datum = MSL Pressure} \\implies \\text{Reads Elevation on Ground}; \\quad \\text{QFE: Datum = AD Pressure} \\implies \\text{Reads 0 on Ground}; \\quad \\text{Std (1013.25): Datum = Standard MSL} \\implies \\text{Reads Flight Level}',
        physicalInterpretation: 'Pressure settings define the reference isobaric plane from which vertical distance is indicated.'
      }
    ],
    definition: 'An aneroid barometer calibrated to display vertical distance according to the ISA pressure-height relationship, adjusted via a barometric subscale (Kollsman window).',
    componentView: View.INST_ALTIMETER,
    prerequisites: [
      {
        prerequisiteConceptId: 'CONCEPT_ATM_PRESSURE',
        type: 'HARD_PHYSICAL',
        rationale: 'The altimeter is physically a pressure gauge measuring static atmospheric pressure.',
        mathTransferEquation: 'Z_{ind} = \\frac{T_0}{L} \\left[ 1 - \\left( \\frac{P_s}{P_{subscale}} \\right)^{\\frac{R L}{g}} \\right]'
      }
    ],
    misconceptions: [
      {
        id: 'MISC_ALTIMETER_MEASURES_GEOMETRIC',
        flawedMentalModel: 'Believing the altimeter measures geometric distance from the ground like a tape measure or radar.',
        dangerLevel: 'FATAL_CFIT',
        diagnosticTriggerQuestion: 'When flying at indicated altitude 5,000 ft on QNH into an unusually cold air mass, does your true distance from terrain stay 5,000 ft?',
        correctCognitiveModel: 'The altimeter measures static pressure only. If cold air contracts the pressure column, the pressure level you are following sits physically CLOSER to the ground: "High to low, look out below!"',
        remediationAction: 'Interactive cold air altimeter terrain collision simulator.'
      },
      {
        id: 'MISC_SUBSCALE_OPPOSITE',
        flawedMentalModel: 'Turning subscale up causes pointer to go down, or getting confused about high/low pressure resets.',
        dangerLevel: 'EXAM_TRAP',
        diagnosticTriggerQuestion: 'If actual QNH is 1000 hPa but the subscale is accidentally left at 1020 hPa, does the altimeter over-read or under-read?',
        correctCognitiveModel: 'Subscale set too high (+20 hPa) adds ~600 ft to the pointer reading! The altimeter over-reads; the aircraft is 600 ft lower than indicated!',
        remediationAction: 'Altimeter knob mechanical linkage cutaway trainer.'
      }
    ],
    masteryEvidence: {
      observableBehaviors: [
        'States the three altimeter settings (QNH, QFE, 1013.25) and their datums immediately.',
        'Explains the consequence of subscale mis-setting with zero hesitation.',
        'Preflight checks: verifies altimeter reads within ±60-75 ft of aerodrome elevation when set to actual QNH.'
      ],
      quantitativeCalculationProof: 'Solves subscale error: Subscale = 1025 hPa, Real QNH = 1005 hPa -> Altimeter reads 20 hPa * 30 ft = 600 ft HIGHER than true altitude. True position is 600 ft BELOW indicated.',
      simulatorTelemetryThreshold: 'Correctly dials QNH in interactive cockpit within ±0.5 hPa in under 3 seconds.'
    },
    subjectAttachments: [
      {
        subject: '022',
        easaLearningObjectives: ['022.02.02.01.01', '022.02.02.01.02', '022.02.02.02.01', '022.02.02.03.01'],
        regulatoryReferences: ['CS-25.1303', 'ETSO-C10b'],
        pedagogicalLens: 'Mechanical construction, evacuated capsules, leaf springs, temperature compensation bi-metallic strips, static blockage & hysteresis errors.',
        scenarioChallenge: 'Diagnose frozen static port on climb: determine why altimeter pointer freezes at blockage altitude.'
      },
      {
        subject: '010',
        easaLearningObjectives: ['010.06.06.01.01', '010.06.06.01.02', '010.06.06.02.01'],
        regulatoryReferences: ['ICAO Doc 8168 Vol I Part VI (Altimeter Setting Procedures)'],
        pedagogicalLens: 'Regulatory preflight altimeter tolerance checks (±60 ft / ±75 ft), QNH broadcast by ATC, transition altitude procedures.',
        scenarioChallenge: 'Determine if an aircraft is airworthy for IFR departure when altimeter indicates 280 ft at an aerodrome with elevation 190 ft on local QNH.'
      }
    ],
    regulatoryMetadata: {
      applicableAuthorities: ['EASA', 'UK_CAA', 'FAA', 'ICAO'],
      licenceRelevance: ['PPL', 'CPL', 'IR', 'ATPL'],
      ecqb2026SyllabusCoverage: ['022.02.02', '010.06.06'],
      deltas: [
        {
          authority: 'FAA',
          differenceDescription: 'FAA regulations cite altimeter check tolerance as 75 ft for IFR flight (14 CFR 91.411); EASA OPS requires ±60 ft for commercial operations.',
          ruleReference: '14 CFR 91.411 vs EASA Part-CAT.IDE.A.125',
          impactOnStudent: 'In FAA test mode, allowable error is 75 ft; in EASA exam mode, tolerance is 60 ft.'
        }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // NODE 5: VERTICAL REFERENCES: ALTITUDE, HEIGHT & FLIGHT LEVEL
  // --------------------------------------------------------------------------
  CONCEPT_VERTICAL_REFERENCES: {
    id: 'CONCEPT_VERTICAL_REFERENCES',
    title: 'Vertical Separation: Altitude, Height, Flight Levels & Transition Layer',
    category: 'ALTIMETRY_PROCEDURES',
    cognitiveLevel: 'OPERATIONAL_APPLIED',
    governingLaws: [
      {
        name: 'True Altitude Temperature Correction Formula',
        formulaKaTeX: '\\Delta Z_{temp} \\approx 4\\text{ ft} \\times \\left(\\frac{Z_{ind}}{1000}\\right) \\times \\Delta ISA',
        physicalInterpretation: 'For every 1°C deviation from ISA, true altitude changes by 4 ft per 1,000 ft of indicated column height.'
      },
      {
        name: 'Transition Layer Geometry',
        formulaKaTeX: '\\text{Transition Layer} = \\text{Transition Level (TRL, in FL)} - \\text{Transition Altitude (TA, in ft)} \\ge 1000\\text{ ft}',
        physicalInterpretation: 'Airspace buffer separating aircraft referenced to QNH (altitude) from aircraft referenced to 1013.25 (flight level).'
      },
      {
        name: 'Semicircular Cruising Rule',
        formulaKaTeX: '\\text{Track } 000^\\circ - 179^\\circ \\implies \\text{ODD Flight Level}; \\quad \\text{Track } 180^\\circ - 359^\\circ \\implies \\text{EVEN Flight Level}',
        physicalInterpretation: 'Maintains 1,000 ft or 2,000 ft vertical separation between opposing traffic flows.'
      }
    ],
    definition: 'The operational vertical reference system defining vertical position as Height (above aerodrome, QFE), Altitude (above MSL, QNH), or Flight Level (above 1013.25 hPa isobaric datum).',
    componentView: View.AIR_LAW_ALTIMETER,
    prerequisites: [
      {
        prerequisiteConceptId: 'CONCEPT_ALTIMETER_PRINCIPLES',
        type: 'HARD_PHYSICAL',
        rationale: 'Vertical references depend directly on the altimeter subscale datum.',
        mathTransferEquation: 'FL = (1013.25 - P_s) \\times \\text{lapse rate}; \\quad Alt = (QNH - P_s) \\times \\text{lapse rate}'
      },
      {
        prerequisiteConceptId: 'CONCEPT_TEMPERATURE',
        type: 'PARAMETRIC_INPUT',
        rationale: 'Temperature determines the true geometric height of any isobaric surface.',
        mathTransferEquation: 'Z_{true} = Z_{ind} + 4 \\times \\left( \\frac{Z_{ind}}{1000} \\right) \\times \\Delta ISA'
      }
    ],
    misconceptions: [
      {
        id: 'MISC_TRANSITION_RESET_TIMING',
        flawedMentalModel: 'Resetting the altimeter to 1013.25 during descent passing the Transition Altitude instead of the Transition Level.',
        dangerLevel: 'SYSTEMIC_ERROR',
        diagnosticTriggerQuestion: 'When descending from cruise into an aerodrome, at which point do you set the altimeter subscale to local QNH?',
        correctCognitiveModel: 'Climbing: Switch from QNH to 1013.25 at TRANSITION ALTITUDE (TA). Descending: Switch from 1013.25 to QNH at TRANSITION LEVEL (TRL) or upon clearance to an altitude.',
        remediationAction: 'Transition layer descent sequence simulator.'
      },
      {
        id: 'MISC_COLD_TEMP_SAFETY',
        flawedMentalModel: 'Assuming that because an aircraft is level at FL 100, its clearance above a mountain ridge remains constant regardless of outside temperature.',
        dangerLevel: 'FATAL_CFIT',
        diagnosticTriggerQuestion: 'You are at FL 100 over the Alps in winter where OAT is -40°C. Is your true altitude higher, equal to, or lower than 10,000 ft?',
        correctCognitiveModel: 'ISA at 10,000 ft is -5°C. OAT -40°C is ISA -35°C! Delta Z = 4 * 10 * (-35) = -1,400 ft! Your True Altitude is only 8,600 ft! You could collide with a 9,000 ft peak while indicating 10,000 ft!',
        remediationAction: 'ICAO Cold Temperature Correction Table and Baro-VNAV approach safety simulator.'
      }
    ],
    masteryEvidence: {
      observableBehaviors: [
        'Correctly calculates true altitude under extreme temperature deviations without reference to tables.',
        'Switches altimeter settings seamlessly on climb through TA and descent through TRL in simulator flight tests.',
        'Applies ICAO Doc 8168 cold temperature corrections to published MDA/DA and intermediate approach fixes below 0°C.'
      ],
      quantitativeCalculationProof: 'Computes cold temperature correction: Airport Elev 1,500 ft, MDA 2,500 ft, OAT -25°C -> Column height = 1,000 ft -> Delta ISA = -25 - (+10) = -35°C -> Correction = 4 * 1 * 35 = 140 ft -> Corrected MDA = 2,640 ft.',
      simulatorTelemetryThreshold: 'Maintains assigned vertical level within ±50 ft through transition layer procedures.'
    },
    subjectAttachments: [
      {
        subject: '010',
        easaLearningObjectives: [
          '010.05.03.01.05', '010.05.03.01.06',
          '010.06.06.01.01', '010.06.06.01.03', '010.06.06.01.08', '010.06.06.01.12', '010.06.06.01.15',
          '010.06.06.02.02', '010.06.06.02.05'
        ],
        regulatoryReferences: ['SERA.5005', 'SERA.5015', 'ICAO Doc 8168 PANS-OPS Vol I'],
        pedagogicalLens: 'Air law requirements: Semicircular rule, TA definition and publication in AIP, TRL calculation by ATC, reporting levels to ATC.',
        scenarioChallenge: 'Calculate Transition Level given Transition Altitude 5,000 ft and local QNH 985 hPa.'
      },
      {
        subject: '050',
        easaLearningObjectives: ['050.01.06.01.01', '050.01.06.02.01', '050.01.06.03.01', '050.01.06.03.04'],
        regulatoryReferences: ['WMO-No. 8'],
        pedagogicalLens: 'Relationship between pressure levels and true height, temperature gradient effects on isobaric spacing.',
        scenarioChallenge: 'Calculate true altitude at FL 180 over an Arctic low-pressure system.'
      },
      {
        subject: '070',
        easaLearningObjectives: ['070.01.01.01.01', '070.01.01.01.02'],
        regulatoryReferences: ['EASA Part-CAT.OP.MPA.145', 'ICAO Doc 8168 Cold Temp Correction Table'],
        pedagogicalLens: 'Operational cold temperature altimeter corrections applied to published approach charts.',
        scenarioChallenge: 'Correct an entire RNP APCH vertical profile at -30°C in mountainous terrain.'
      }
    ],
    regulatoryMetadata: {
      applicableAuthorities: ['EASA', 'UK_CAA', 'FAA', 'ICAO'],
      licenceRelevance: ['PPL', 'CPL', 'IR', 'ATPL'],
      ecqb2026SyllabusCoverage: ['010.06.06', '050.01.06', '070.01'],
      deltas: [
        {
          authority: 'FAA',
          differenceDescription: 'In the USA, Transition Altitude is fixed nationwide at 18,000 ft MSL (FL 180) across the contiguous US (14 CFR 91.121). In EASA and UK, Transition Altitudes vary by aerodrome/terminal area, typically between 3,000 ft and 6,000 ft.',
          ruleReference: '14 CFR 91.121 vs SERA.5005',
          impactOnStudent: 'US pilots operate below 18,000 ft exclusively on local altimeter settings; European pilots change to standard 1013.25 much lower, often immediately after departure (~3,000-6,000 ft).'
        },
        {
          authority: 'UK_CAA',
          differenceDescription: 'UK maintains regional Transition Altitudes (typically 3,000 ft outside controlled airspace or 6,000 ft in London TMA) and provides Regional Pressure Settings (RPS) representing lowest forecast QNH in an ASR.',
          ruleReference: 'UK CAP 493 MATS Part 1',
          impactOnStudent: 'Must understand Regional Pressure Settings (RPS) for terrain clearance in Class G airspace.'
        }
      ]
    }
  },

  // --------------------------------------------------------------------------
  // NODE 6: DENSITY ALTITUDE
  // --------------------------------------------------------------------------
  CONCEPT_DENSITY_ALTITUDE: {
    id: 'CONCEPT_DENSITY_ALTITUDE',
    title: 'Density Altitude Computation & True Airspeed Mechanics',
    category: 'AERODYNAMICS',
    cognitiveLevel: 'OPERATIONAL_APPLIED',
    governingLaws: [
      {
        name: 'Pressure Altitude Calculation',
        formulaKaTeX: 'PA = \\text{Elevation} + (1013.25 - QNH) \\times 27\\text{ or }30\\text{ ft/hPa}',
        physicalInterpretation: 'Altitude indicated when the subscale is set to standard 1013.25 hPa.'
      },
      {
        name: 'Density Altitude Exact and Approximation Formulas',
        formulaKaTeX: 'DA \\approx PA + 118.8 \\cdot (OAT - T_{ISA,PA}) \\approx PA + 120 \\cdot \\Delta ISA',
        physicalInterpretation: 'For every 1°C that actual temperature is above ISA, density altitude increases by ~120 ft above pressure altitude.'
      },
      {
        name: 'TAS to IAS Conversion via Density Ratio',
        formulaKaTeX: 'V_{TAS} = \\frac{V_{EAS}}{\\sqrt{\\sigma}} \\approx V_{CAS} \\times \\left(1 + 0.0175 \\times \\frac{PA}{1000}\\right)',
        physicalInterpretation: 'As density drops, an aircraft must travel physically faster (higher TAS) to generate the same dynamic pressure (IAS) over the wings.'
      }
    ],
    definition: 'Pressure altitude corrected for non-standard temperature; physically represents the altitude in the International Standard Atmosphere at which the air density is identical to the current local air density.',
    componentView: View.C172_HUB,
    prerequisites: [
      {
        prerequisiteConceptId: 'CONCEPT_AIR_DENSITY',
        type: 'HARD_PHYSICAL',
        rationale: 'Density altitude is the operational proxy for density rho.',
        mathTransferEquation: '\\sigma = \\left( 1 - 2.25577 \\times 10^{-5} \\times DA \\right)^{4.25588}'
      },
      {
        prerequisiteConceptId: 'CONCEPT_VERTICAL_REFERENCES',
        type: 'PARAMETRIC_INPUT',
        rationale: 'Pressure altitude is the reference base from which temperature corrections are projected.',
        mathTransferEquation: 'DA = PA + 118.8 \\cdot \\Delta ISA'
      }
    ],
    misconceptions: [
      {
        id: 'MISC_ELEVATION_INTO_DA',
        flawedMentalModel: 'Plugging aerodrome elevation directly into the density altitude formula instead of first finding Pressure Altitude.',
        dangerLevel: 'EXAM_TRAP',
        diagnosticTriggerQuestion: 'Aerodrome elevation is 2,000 ft, QNH is 980 hPa, OAT is +30°C. What is the Density Altitude?',
        correctCognitiveModel: 'Low QNH (980 hPa) adds: (1013 - 980)*30 = +990 ft to elevation! PA = 2,990 ft. ISA temp at 2,990 ft is 15 - 6 = +9°C. Delta ISA is +30 - 9 = +21°C! DA = 2,990 + (120 * 21) = 2,990 + 2,520 = 5,510 ft! Skipping PA underestimates DA by nearly 1,000 ft!',
        remediationAction: 'Two-step PA -> DA visual calculator drill.'
      },
      {
        id: 'MISC_STALL_SPEED_DA',
        flawedMentalModel: 'Believing that indicated stall speed (IAS) increases significantly with high density altitude.',
        dangerLevel: 'FATAL_CFIT',
        diagnosticTriggerQuestion: 'At a density altitude of 9,000 ft, does your Cessna 172 stall at a higher indicated airspeed (IAS)?',
        correctCognitiveModel: 'Stall is governed by dynamic pressure q = 0.5 * rho * V_TAS^2 = 0.5 * rho0 * V_IAS^2. Indicated stall speed remains virtually CONSTANT. However, True Airspeed (TAS) and Ground Speed are much higher, requiring a longer runway and creating the illusion of excessive speed during approach!',
        remediationAction: 'Simulator high-altitude landing illusion comparison.'
      }
    ],
    masteryEvidence: {
      observableBehaviors: [
        'Solves mental DA calculations within 15 seconds without paper: PA = Elev + 30*(1013-QNH); DA = PA + 120*DeltaISA.',
        'Explains why ground roll is prolonged even though the ASI displays normal rotation speed VR.'
      ],
      quantitativeCalculationProof: 'Computes exact and rule-of-thumb DA matching flight computer / CRP-5 wheel results within ±50 ft.',
      simulatorTelemetryThreshold: 'Inputs correct density altitude into flight planning performance modules with 100% accuracy.'
    },
    subjectAttachments: [
      {
        subject: '061',
        easaLearningObjectives: ['061.01.04.01.01', '061.02.01.01.01'],
        regulatoryReferences: ['EASA Part-FCL Appendix 1'],
        pedagogicalLens: 'Flight computer (CRP-5 / E6B) circular slide rule calculations: alignment of temperature against pressure altitude to read density altitude and TAS.',
        scenarioChallenge: 'Calculate TAS given FL 140, CAS 180 kts, OAT -25°C.'
      },
      {
        subject: '032',
        easaLearningObjectives: ['032.01.02.03.01', '032.01.02.03.02', '032.01.02.03.03'],
        regulatoryReferences: ['CS-23 Subpart B', 'CS-25 Subpart B'],
        pedagogicalLens: 'Density altitude as the primary independent parameter in performance graphs.',
        scenarioChallenge: 'Determine if single-engine climb gradient meets the regulatory 1.2% margin at DA 7,500 ft.'
      }
    ],
    regulatoryMetadata: {
      applicableAuthorities: ['EASA', 'UK_CAA', 'FAA', 'ICAO'],
      licenceRelevance: ['PPL', 'CPL', 'ATPL'],
      ecqb2026SyllabusCoverage: ['061.01.04', '032.01.02'],
      deltas: []
    }
  },

  // --------------------------------------------------------------------------
  // NODE 7: AIRCRAFT PERFORMANCE
  // --------------------------------------------------------------------------
  CONCEPT_AIRCRAFT_PERFORMANCE: {
    id: 'CONCEPT_AIRCRAFT_PERFORMANCE',
    title: 'Aircraft Flight Performance & Certification Margins',
    category: 'AIRCRAFT_PERFORMANCE',
    cognitiveLevel: 'ADVANCED_SYNTHESIS',
    governingLaws: [
      {
        name: 'Ground Roll Distance Scaling Law',
        formulaKaTeX: 'S_{ground} \\approx \\frac{W^2 \\cdot V_{LOF,TAS}^2}{2 g \\cdot F_{net}} \\propto \\frac{W^2}{\\sigma \\cdot T_{avail}} \\propto \\frac{1}{\\sigma^2 \\text{ to } \\sigma^{2.5}}',
        physicalInterpretation: 'Takeoff distance expands non-linearly with density altitude because true lift-off speed increases while engine thrust decreases simultaneously.'
      },
      {
        name: 'Climb Gradient & Rate of Climb Physics',
        formulaKaTeX: '\\text{Gradient (\\%)} = \\frac{T - D}{W} \\times 100; \\quad ROC = \\text{Gradient} \\times V_{TAS} \\times 1.0127',
        physicalInterpretation: 'Climb angle depends purely on excess thrust (T - D), which shrinks rapidly as density altitude rises.'
      },
      {
        name: 'Engine Power Degradation Laws',
        formulaKaTeX: '\\text{Piston: } BHP = BHP_0 \\left( \\frac{\\rho}{\\rho_0} - \\frac{1 - \\rho/\\rho_0}{7.55} \\right); \\quad \\text{Turbine: } F_N \\propto \\dot{m} = \\rho A V',
        physicalInterpretation: 'Naturally aspirated piston engines lose ~3% power per 1,000 ft DA; jet thrust drops as mass airflow declines above flat-rated temperatures.'
      },
      {
        name: 'Regulatory Safety Factoring (CS-23 vs CS-25)',
        formulaKaTeX: '\\text{CS-23 Class B: } TODR = TOD_{unfactored} \\times 1.25 (\\text{or } 1.15); \\quad \\text{CS-25 Class A: Clear 35 ft screen with One Engine Inoperative (OEI)}',
        physicalInterpretation: 'Regulations require statutory safety margins over demonstrated performance to account for pilot variation and engine degradation.'
      }
    ],
    definition: 'The operational capabilities of the aircraft (takeoff roll, climb gradient, ceiling, landing distance) under specified conditions, bounded by airworthiness certification codes (CS-23 / CS-25).',
    componentView: View.PERF_TAKEOFF,
    prerequisites: [
      {
        prerequisiteConceptId: 'CONCEPT_DENSITY_ALTITUDE',
        type: 'HARD_PHYSICAL',
        rationale: 'Density altitude governs the reduction in thrust, lift, and climb rate.',
        mathTransferEquation: 'S_{TO} \\propto \\left( \\frac{1}{\\sigma} \\right)^2'
      }
    ],
    misconceptions: [
      {
        id: 'MISC_PERF_LINEAR_TEMP',
        flawedMentalModel: 'Assuming a 10°C increase in temperature causes only a 5-10% linear increase in takeoff distance.',
        dangerLevel: 'FATAL_CFIT',
        diagnosticTriggerQuestion: 'If temperature increases from 15°C to 35°C at an airport at 5,000 ft, by what factor might the takeoff ground roll increase?',
        correctCognitiveModel: 'Takeoff distance scales with ~1/sigma^2. At 5,000 ft and +35°C (DA ~8,500 ft), ground roll can double (+100%), and climb gradient can drop below obstacle clearance minimums!',
        remediationAction: 'Interactive Takeoff Performance runway length simulator with hot/high envelope.'
      },
      {
        id: 'MISC_GROSS_VS_NET',
        flawedMentalModel: 'Confusing Gross Performance (what the test pilot achieved) with Net Performance (what is legally planned for obstacle clearance).',
        dangerLevel: 'SYSTEMIC_ERROR',
        diagnosticTriggerQuestion: 'In CS-25 Class A takeoff planning, is obstacle clearance calculated against gross climb gradient or net climb gradient?',
        correctCognitiveModel: 'Net performance must be used! The net flight path subtracts a mandatory margin (0.8% for twins, 0.9% for tri-jets, 1.0% for quads) from the gross climb gradient to ensure obstacle clearance.',
        remediationAction: 'CS-25 Takeoff Flight Path 4-segment net vs gross diagram.'
      }
    ],
    masteryEvidence: {
      observableBehaviors: [
        'Demonstrates complete knowledge of the variables affecting takeoff distance: weight (squared), density altitude, head/tailwind, slope, surface contamination.',
        'Calculates TODR and TORR using Class B tabular data and Class A graphical charts with 100% precision.',
        'Identifies field length limited, climb limited, obstacle limited, and brake energy limited takeoff weights.'
      ],
      quantitativeCalculationProof: 'Solves full dispatch calculation: Elevation 3,000 ft, QNH 1003, OAT +32°C, Runway 1,400 m, 1% upslope, grass runway. Applies: PA = 3,300 ft -> DA = 6,100 ft -> Unfactored TOD = 680 m -> Grass factor 1.20 -> Upslope factor 1.10 -> Safety factor 1.25 -> Factored TODR = 1,122 m <= 1,400 m (Dispatch Go).',
      simulatorTelemetryThreshold: 'Correctly completes MTOW optimization for specified runway length and atmospheric conditions.'
    },
    subjectAttachments: [
      {
        subject: '032',
        easaLearningObjectives: [
          '032.01.01.04.01', '032.01.01.04.03', '032.01.02.03.01', '032.01.02.03.02',
          '032.01.02.03.03', '032.01.02.03.04', '032.02.01.01', '032.04.01.01'
        ],
        regulatoryReferences: ['CS-23 Subpart B', 'CS-25 Subpart B', 'Part-CAT.POL.A.200 - 250'],
        pedagogicalLens: 'Rigorous calculation of takeoff, climb, cruise, and landing stages under CS-23 (Class B) and CS-25 (Class A) regulations.',
        scenarioChallenge: 'Calculate Maximum Takeoff Mass (MTOM) limited by second segment climb requirements on a 38°C day at Madrid-Barajas (LEMD).'
      },
      {
        subject: '031',
        easaLearningObjectives: ['031.02.02.01', '031.05.01.01'],
        regulatoryReferences: ['Part-CAT.POL.MAB'],
        pedagogicalLens: 'Interaction between structural mass limits and performance-limited takeoff/landing masses.',
        scenarioChallenge: 'Determine Regulated Takeoff Mass (RTOM) taking into account structural MTOM vs Climb-limited TOM.'
      },
      {
        subject: '033',
        easaLearningObjectives: ['033.03.01.02', '033.04.02.01'],
        regulatoryReferences: ['Part-CAT.OP.MPA.106'],
        pedagogicalLens: 'Fuel planning impact: increased fuel consumption at higher density altitude / temperature deviations.',
        scenarioChallenge: 'Recalculate route trip fuel when cruise temperature is ISA +12°C instead of forecast ISA +0°C.'
      }
    ],
    regulatoryMetadata: {
      applicableAuthorities: ['EASA', 'UK_CAA', 'FAA', 'ICAO'],
      licenceRelevance: ['PPL', 'CPL', 'ATPL'],
      ecqb2026SyllabusCoverage: ['032.01', '032.02', '032.04'],
      deltas: [
        {
          authority: 'FAA',
          differenceDescription: 'FAA Part 121 takeoff flight path requirements differ slightly in wet runway accountability and clearway/stopway usage compared to EASA Part-CAT.POL.A.',
          ruleReference: '14 CFR 121.189 vs EASA Part-CAT.POL.A.205',
          impactOnStudent: 'Must select the appropriate regulatory code when calculating balanced field length and screen heights (FAA uses 35 ft dry / 15 ft wet; EASA specifies distinct wet factors).'
        }
      ]
    }
  }
};

// ============================================================================
// 3. CROSS-SUBJECT FOUNDATION INVENTORY (ALL 13 ATPL SUBJECTS)
// ============================================================================

export interface FoundationInventoryItem {
  id: string;
  name: string;
  underlyingPhysicsMath: string;
  primarySubject: SubjectCode;
  crossAttachedSubjects: SubjectCode[];
  centralityScore: number; // In-degree + Out-degree across ATPL syllabus
  studentFailureRate: 'HIGH' | 'VERY_HIGH' | 'CRITICAL';
  safetyRelevance: 'OPERATIONAL_EFFICIENCY' | 'INCIDENT_RISK' | 'FATAL_CFIT_RISK';
}

export const TOP_15_FOUNDATION_INVENTORY: FoundationInventoryItem[] = [
  {
    id: 'FC_ATMOSPHERIC_BAROMETRY',
    name: 'Hydrostatics, Pressure Lapse & Altimeter Settings',
    underlyingPhysicsMath: 'dP = -rho * g * dz; barometric formula; aneroid mechanics',
    primarySubject: '050',
    crossAttachedSubjects: ['010', '022', '032', '033', '040', '070'],
    centralityScore: 10,
    studentFailureRate: 'CRITICAL',
    safetyRelevance: 'FATAL_CFIT_RISK'
  },
  {
    id: 'FC_DYNAMIC_PRESSURE_LIFT',
    name: 'Dynamic Pressure (q = 0.5*rho*V^2) & Airspeed Mechanics (IAS-CAS-EAS-TAS)',
    underlyingPhysicsMath: 'Bernoulli equation; compressibility correction; pitot-static delta P',
    primarySubject: '081',
    crossAttachedSubjects: ['022', '032', '033', '061'],
    centralityScore: 9,
    studentFailureRate: 'CRITICAL',
    safetyRelevance: 'FATAL_CFIT_RISK'
  },
  {
    id: 'FC_VECTOR_WIND_TRIANGLE',
    name: 'Vector Trigonometry & The Wind Triangle (Heading, Track, Drift, GS)',
    underlyingPhysicsMath: 'Vector addition: V_ground = V_air + V_wind; law of sines/cosines',
    primarySubject: '061',
    crossAttachedSubjects: ['010', '032', '033', '062', '070'],
    centralityScore: 8,
    studentFailureRate: 'HIGH',
    safetyRelevance: 'INCIDENT_RISK'
  },
  {
    id: 'FC_CENTRE_OF_GRAVITY_MOMENTS',
    name: 'Moments, Levers & Centre of Gravity Equilibrium',
    underlyingPhysicsMath: 'Sum of Moments = Sum(Weight_i * Arm_i); Neutral point & static margin',
    primarySubject: '031',
    crossAttachedSubjects: ['032', '081', '021'],
    centralityScore: 7,
    studentFailureRate: 'VERY_HIGH',
    safetyRelevance: 'FATAL_CFIT_RISK'
  },
  {
    id: 'FC_THERMAL_GAS_LAWS',
    name: 'Thermodynamics: Boyle, Charles, Dalton & Engine Cycles',
    underlyingPhysicsMath: 'P*V = n*R*T; Brayton / Otto cycles; adiabatic compression',
    primarySubject: '021',
    crossAttachedSubjects: ['040', '050', '032'],
    centralityScore: 7,
    studentFailureRate: 'HIGH',
    safetyRelevance: 'INCIDENT_RISK'
  },
  {
    id: 'FC_WAVE_PROPAGATION_DOPPLER',
    name: 'Electromagnetic Waves, Frequency, Phase & Doppler Shift',
    underlyingPhysicsMath: 'c = f * lambda; Doppler delta f = (v/c) * f0; reflection, refraction',
    primarySubject: '062',
    crossAttachedSubjects: ['022', '050', '090'],
    centralityScore: 7,
    studentFailureRate: 'VERY_HIGH',
    safetyRelevance: 'INCIDENT_RISK'
  },
  {
    id: 'FC_SPATIAL_DISORIENTATION_VESTIBULAR',
    name: 'Vestibular & Visual Physiology (Somatogravic / Somatogyral Illusions)',
    underlyingPhysicsMath: 'Semicircular canals (angular accel) & Otoliths (linear accel/gravity ambiguity)',
    primarySubject: '040',
    crossAttachedSubjects: ['022', '070', '081'],
    centralityScore: 6,
    studentFailureRate: 'VERY_HIGH',
    safetyRelevance: 'FATAL_CFIT_RISK'
  },
  {
    id: 'FC_EARTH_GEOMETRY_CONVERGENCY',
    name: 'Spherical Earth Geometry, Great Circles, Rhumb Lines & Convergency',
    underlyingPhysicsMath: 'Earth convergency = delta Longitude * sin(Mean Latitude); departure formula',
    primarySubject: '061',
    crossAttachedSubjects: ['062', '033', '010'],
    centralityScore: 6,
    studentFailureRate: 'CRITICAL',
    safetyRelevance: 'OPERATIONAL_EFFICIENCY'
  },
  {
    id: 'FC_AERODYNAMIC_STALL_CRITICAL_AOA',
    name: 'Boundary Layer Separation, Adverse Pressure Gradient & Critical AOA',
    underlyingPhysicsMath: 'Navier-Stokes boundary layer separation; circulation theory; stall hysteresis',
    primarySubject: '081',
    crossAttachedSubjects: ['022', '032', '040', '100'],
    centralityScore: 7,
    studentFailureRate: 'HIGH',
    safetyRelevance: 'FATAL_CFIT_RISK'
  },
  {
    id: 'FC_ATMOSPHERIC_MOISTURE_CLOUDS',
    name: 'Latent Heat, Dew Point, Adiabatic Expansion & Cloud Formation',
    underlyingPhysicsMath: 'Clausius-Clapeyron equation; DALR 3°C/1000ft vs SALR 1.5°C/1000ft',
    primarySubject: '050',
    crossAttachedSubjects: ['021', '070', '081'],
    centralityScore: 6,
    studentFailureRate: 'HIGH',
    safetyRelevance: 'INCIDENT_RISK'
  },
  {
    id: 'FC_HYDRAULIC_PNEUMATIC_PASCAL',
    name: 'Fluid Power: Pascal Law, Cavitation & Accumulators',
    underlyingPhysicsMath: 'F1/A1 = F2/A2; continuity equation A1*V1 = A2*V2; hydraulic hammer',
    primarySubject: '021',
    crossAttachedSubjects: ['022', '032'],
    centralityScore: 5,
    studentFailureRate: 'HIGH',
    safetyRelevance: 'INCIDENT_RISK'
  },
  {
    id: 'FC_GYROSCOPIC_PRECESSION',
    name: 'Rigidity in Space & Gyroscopic Precession',
    underlyingPhysicsMath: 'Angular momentum L = I * omega; Torque tau = dL/dt (90° phase shift)',
    primarySubject: '022',
    crossAttachedSubjects: ['061', '081'],
    centralityScore: 5,
    studentFailureRate: 'VERY_HIGH',
    safetyRelevance: 'INCIDENT_RISK'
  },
  {
    id: 'FC_RADIONAV_TRIANGULATION_HYPERBOLA',
    name: 'Range-Range, Rho-Theta & Hyperbolic Time-Difference Navigation',
    underlyingPhysicsMath: 'Trilateration (DME/GNSS); VOR phase comparison; hyperbolic locus',
    primarySubject: '062',
    crossAttachedSubjects: ['022', '061', '033'],
    centralityScore: 6,
    studentFailureRate: 'HIGH',
    safetyRelevance: 'INCIDENT_RISK'
  },
  {
    id: 'FC_HUMAN_INFO_PROCESSING_TEM',
    name: 'Threat & Error Management (TEM) & Working Memory Bottlenecks',
    underlyingPhysicsMath: 'Baddeley working memory model; Reason Swiss Cheese model; cognitive load',
    primarySubject: '040',
    crossAttachedSubjects: ['010', '070', '090', '100'],
    centralityScore: 7,
    studentFailureRate: 'HIGH',
    safetyRelevance: 'FATAL_CFIT_RISK'
  },
  {
    id: 'FC_ICAO_LEGAL_SOVEREIGNTY_AIRSPACE',
    name: 'Chicago Convention, Sovereignty & ICAO Airspace Classes A-G',
    underlyingPhysicsMath: 'Jurisdictional hierarchy; ICAO Annexes SARPs vs National Differences',
    primarySubject: '010',
    crossAttachedSubjects: ['033', '070', '090'],
    centralityScore: 6,
    studentFailureRate: 'HIGH',
    safetyRelevance: 'INCIDENT_RISK'
  }
];

// ============================================================================
// 4. REGULATORY METADATA RESOLUTION MATRIX
// ============================================================================

export interface RegulatoryJurisdictionProfile {
  authority: Authority;
  primaryRules: string[];
  standardAltimeterUnits: 'hPa' | 'inHg';
  transitionAltitudePolicy: string;
  fuelReservesPolicy: string;
  weatherMinimaTableRef: string;
}

export const REGULATORY_JURISDICTION_PROFILES: Record<Authority, RegulatoryJurisdictionProfile> = {
  EASA: {
    authority: 'EASA',
    primaryRules: ['Regulation (EU) No 1178/2011 (Part-FCL)', 'Regulation (EU) No 965/2012 (Part-CAT)', 'SERA (EU 923/2012)'],
    standardAltimeterUnits: 'hPa',
    transitionAltitudePolicy: 'Variable by aerodrome / TMA (typically 3,000 - 6,000 ft, published in AIP)',
    fuelReservesPolicy: 'Part-CAT.OP.MPA.180 (Taxi + Trip + Contingency 5% or 3% with ERA + Alternate + Final Reserve 30/45 min)',
    weatherMinimaTableRef: 'SERA.5001 / Part-CAT.OP.MPA.110'
  },
  UK_CAA: {
    authority: 'UK_CAA',
    primaryRules: ['The Air Navigation Order 2016 (ANO)', 'UK Regulation (EU) 1178/2011 as retained', 'CAP 493 (MATS)'],
    standardAltimeterUnits: 'hPa',
    transitionAltitudePolicy: 'Variable (typically 3,000 ft outside CAS, 6,000 ft in London TMA); uses Regional Pressure Settings (RPS)',
    fuelReservesPolicy: 'UK Part-CAT harmonized with EASA post-Brexit',
    weatherMinimaTableRef: 'UK SERA.5001'
  },
  FAA: {
    authority: 'FAA',
    primaryRules: ['14 CFR Part 61 (Certification)', '14 CFR Part 91 (General Operating)', '14 CFR Part 121 (Air Carriers)'],
    standardAltimeterUnits: 'inHg',
    transitionAltitudePolicy: 'Uniform nationwide at 18,000 ft MSL (FL 180) across contiguous USA',
    fuelReservesPolicy: 'FAR 91.167 / 121.639 (45 min IFR reserve vs 30 min EASA final reserve for turbine)',
    weatherMinimaTableRef: '14 CFR 91.155 (Basic VFR weather minimums table: 3-152, etc.)'
  },
  ICAO: {
    authority: 'ICAO',
    primaryRules: ['Annex 1 (Personnel)', 'Annex 2 (Rules of Air)', 'Annex 6 (Operations)', 'Annex 8 (Airworthiness)', 'Doc 8168 (PANS-OPS)'],
    standardAltimeterUnits: 'hPa',
    transitionAltitudePolicy: 'PANS-OPS Vol I: established by individual contracting states as near as possible to 3,000 ft or above',
    fuelReservesPolicy: 'Annex 6 Part I Chapter 4 baseline standards',
    weatherMinimaTableRef: 'Annex 2 Chapter 4 Table 4-1'
  }
};
