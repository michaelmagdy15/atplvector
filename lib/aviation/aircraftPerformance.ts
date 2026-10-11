/**
 * Aircraft Performance Physics & Atmospheric Modeling Core
 * ATPL Subject 032 - Flight Performance & Planning
 * 
 * Provides rigorous aerodynamic and atmospheric formulas:
 * 1. ISA Atmospheric modeling (Pressure Altitude, Density Altitude, Density Ratio sigma)
 * 2. Speed relationships (IAS, CAS, EAS, TAS) based on dynamic pressure q = 0.5 * rho * V^2
 * 3. Power & Thrust degradation:
 *    - Unsupercharged piston: Gagg-Farrar relation & ~3% BHP loss per 1,000 ft DA
 *    - Turbine: Mass airflow m_dot = rho * A * V & Flat-rate temperature corner points
 * 4. Ground roll & Total distance over screen height (35ft / 50ft)
 * 5. Climb gradient gamma = (Thrust - Drag) / Weight & Rate of Climb ROC
 * 6. Class A (CS-25) & Class B (CS-23) regulatory safety factors & obstacle clearance
 */

export interface AtmosphericConditions {
  elevationFt: number;
  qnhHpa: number;
  oatC: number;
  windKts?: number; // positive = headwind, negative = tailwind
  runwaySlopePct?: number; // positive = upslope, negative = downslope
  surface?: 'PAVED_DRY' | 'PAVED_WET' | 'GRASS_DRY_SHORT' | 'GRASS_WET_SHORT' | 'SOFT_GROUND';
}

export interface AtmosphereResult {
  pressureAltFt: number;
  isaTempC: number;
  deltaIsaC: number;
  densityRatioSigma: number;
  densityRhoKgM3: number;
  densityAltFt: number;
  densityAltApproxFt: number;
}

export interface AircraftPreset {
  id: string;
  name: string;
  category: 'CLASS_A' | 'CLASS_B';
  engineType: 'PISTON_NA' | 'PISTON_TURBO' | 'TURBOPROP' | 'TURBOJET';
  enginesCount: number;
  maxTakeoffWeightLbs: number;
  emptyWeightLbs: number;
  wingAreaSqFt: number;
  screenHeightFt: number; // 35 ft for Class A / Jet, 50 ft for Class B
  speeds: {
    vs0Ias: number; // Stall dirty
    vs1Ias: number; // Stall clean
    vrIas: number;  // Rotation
    vxIas: number;  // Best angle
    vyIas: number;  // Best rate
    v2Ias?: number; // Class A takeoff safety speed
  };
  seaLevelBase: {
    groundRollFt: number;
    distanceToScreenFt: number;
    maxSeaLevelRocFpm: number;
    ratedPowerHpOrThrustLbs: number;
  };
}

export const AIRCRAFT_PRESETS: Record<string, AircraftPreset> = {
  C172_SP: {
    id: 'c172_sp',
    name: 'Cessna 172S Skyhawk (Class B Single Piston)',
    category: 'CLASS_B',
    engineType: 'PISTON_NA',
    enginesCount: 1,
    maxTakeoffWeightLbs: 2550,
    emptyWeightLbs: 1660,
    wingAreaSqFt: 174,
    screenHeightFt: 50,
    speeds: {
      vs0Ias: 40,
      vs1Ias: 48,
      vrIas: 55,
      vxIas: 62,
      vyIas: 74,
    },
    seaLevelBase: {
      groundRollFt: 960,
      distanceToScreenFt: 1630,
      maxSeaLevelRocFpm: 730,
      ratedPowerHpOrThrustLbs: 180, // BHP (Lycoming IO-360-L2A)
    }
  },
  BARON_G58: {
    id: 'baron_g58',
    name: 'Beechcraft Baron G58 (Class B Light Twin Piston)',
    category: 'CLASS_B',
    engineType: 'PISTON_NA',
    enginesCount: 2,
    maxTakeoffWeightLbs: 5500,
    emptyWeightLbs: 3950,
    wingAreaSqFt: 199.2,
    screenHeightFt: 50,
    speeds: {
      vs0Ias: 73,
      vs1Ias: 84,
      vrIas: 85,
      vxIas: 92,
      vyIas: 105,
    },
    seaLevelBase: {
      groundRollFt: 1400,
      distanceToScreenFt: 2300,
      maxSeaLevelRocFpm: 1700,
      ratedPowerHpOrThrustLbs: 600, // 2x 300 HP Continental IO-550
    }
  },
  CITATION_MUSTANG: {
    id: 'citation_mustang',
    name: 'Cessna Citation Mustang (Class A Entry Light Jet)',
    category: 'CLASS_A',
    engineType: 'TURBOJET',
    enginesCount: 2,
    maxTakeoffWeightLbs: 8645,
    emptyWeightLbs: 5350,
    wingAreaSqFt: 209.9,
    screenHeightFt: 35,
    speeds: {
      vs0Ias: 75,
      vs1Ias: 88,
      vrIas: 91,
      vxIas: 120,
      vyIas: 170,
      v2Ias: 97,
    },
    seaLevelBase: {
      groundRollFt: 1900,
      distanceToScreenFt: 3110,
      maxSeaLevelRocFpm: 3010,
      ratedPowerHpOrThrustLbs: 2920, // 2x 1460 lbf PW615F
    }
  },
  AIRBUS_A320: {
    id: 'airbus_a320',
    name: 'Airbus A320-200 (Class A Transport Jet)',
    category: 'CLASS_A',
    engineType: 'TURBOJET',
    enginesCount: 2,
    maxTakeoffWeightLbs: 170000, // ~77,000 kg MTOW
    emptyWeightLbs: 93900,
    wingAreaSqFt: 1320,
    screenHeightFt: 35,
    speeds: {
      vs0Ias: 115,
      vs1Ias: 128,
      vrIas: 142,
      vxIas: 175,
      vyIas: 250,
      v2Ias: 148,
    },
    seaLevelBase: {
      groundRollFt: 4600,
      distanceToScreenFt: 6200,
      maxSeaLevelRocFpm: 3200,
      ratedPowerHpOrThrustLbs: 54000, // 2x 27,000 lbf CFM56-5B4
    }
  }
};

/**
 * 1. Calculate Standard ISA Atmosphere parameters
 */
export function calculateAtmosphere(conditions: AtmosphericConditions): AtmosphereResult {
  const { elevationFt, qnhHpa, oatC } = conditions;

  // Pressure Altitude = Elevation + (1013.25 - QNH) * 27.305 ft/hPa
  const pressureAltFt = elevationFt + (1013.25 - qnhHpa) * 27.305;

  // ISA Standard Temperature at Pressure Altitude
  // Lapse rate = 1.98 C per 1000 ft (approx 2 deg C)
  const isaTempC = 15 - (pressureAltFt / 1000) * 1.98;

  // ISA Deviation Delta ISA
  const deltaIsaC = oatC - isaTempC;

  // Pressure ratio delta = P / P0 = (1 - 6.8756e-6 * PA)^5.25588
  // Guard against extreme negative values
  const clampedPA = Math.max(-2000, Math.min(pressureAltFt, 50000));
  const pressureRatioDelta = Math.pow(1 - 0.0000068756 * clampedPA, 5.25588);

  // Absolute temperatures in Kelvin
  const tempK = oatC + 273.15;
  const tempRatioTheta = tempK / 288.15;

  // Density ratio sigma = rho / rho0 = delta / theta
  const densityRatioSigma = Math.max(0.2, pressureRatioDelta / tempRatioTheta);

  // Air density rho (kg/m^3), rho0 = 1.225 kg/m^3
  const densityRhoKgM3 = 1.225 * densityRatioSigma;

  // Exact Density Altitude: derived from ISA troposphere inversion of sigma
  // DA = (T0 / L) * (1 - sigma^(1 / 4.25588)) = 145442 * (1 - sigma^0.23497)
  const densityAltFt = 145442 * (1 - Math.pow(densityRatioSigma, 0.23497));

  // Pilot's rule of thumb: DA = PA + 118.8 * deltaISA (or 120 * deltaISA)
  const densityAltApproxFt = pressureAltFt + 118.8 * deltaIsaC;

  return {
    pressureAltFt,
    isaTempC,
    deltaIsaC,
    densityRatioSigma,
    densityRhoKgM3,
    densityAltFt,
    densityAltApproxFt,
  };
}

/**
 * 2. True Airspeed (TAS) vs Indicated Airspeed (IAS)
 * Dynamic pressure: q = 0.5 * rho * TAS^2 = 0.5 * rho_0 * IAS^2
 * Therefore: TAS = IAS / sqrt(sigma)
 */
export function calculateTAS(iasKts: number, sigma: number): number {
  if (sigma <= 0.01) return iasKts;
  return iasKts / Math.sqrt(sigma);
}

/**
 * 3. Engine Power / Thrust Degradation
 */
export function calculateEngineDegradation(
  engineType: AircraftPreset['engineType'],
  sigma: number,
  densityAltFt: number,
  deltaIsaC: number
): {
  availablePowerOrThrustFraction: number; // 0.0 to 1.0 (or > 1.0 if supercharged at SL)
  powerLossPercentage: number;
  explanation: string;
} {
  switch (engineType) {
    case 'PISTON_NA': {
      // Naturally aspirated piston: Gagg-Farrar relation:
      // P / P0 = (sigma - 0.117) / (1 - 0.117) approx 1.132 * sigma - 0.132
      // Standard rule of thumb: ~3.3% loss per 1000 ft Density Altitude
      const frac = Math.max(0.1, 1.132 * sigma - 0.132);
      const lossPct = Math.max(0, (1 - frac) * 100);
      return {
        availablePowerOrThrustFraction: frac,
        powerLossPercentage: lossPct,
        explanation: `Naturally aspirated piston loses ~3.3% power per 1,000 ft DA due to reduced air mass flow into cylinders. At DA ${Math.round(densityAltFt)} ft, engine produces ${Math.round(frac * 100)}% of rated BHP.`,
      };
    }
    case 'PISTON_TURBO': {
      // Turbocharged maintain sea level manifold pressure up to critical altitude (~15,000 to 20,000 ft)
      // Slight loss due to intercooler efficiency at high OAT
      const criticalAltFt = 16000;
      let frac = 1.0;
      if (densityAltFt > criticalAltFt) {
        frac = 1.0 - ((densityAltFt - criticalAltFt) / 1000) * 0.035;
      }
      if (deltaIsaC > 15) {
        frac -= (deltaIsaC - 15) * 0.005; // Hot day intercooler penalty
      }
      frac = Math.max(0.2, Math.min(1.0, frac));
      return {
        availablePowerOrThrustFraction: frac,
        powerLossPercentage: (1 - frac) * 100,
        explanation: `Turbocharger maintains rated MAP up to critical altitude (~16,000 ft). Above that or in extreme heat, power degrades.`,
      };
    }
    case 'TURBOPROP':
    case 'TURBOJET': {
      // Turbine thrust: m_dot * (V_exit - V_in). Mass flow drops with rho.
      // High OAT reaches Turbine Inlet Temp (TIT) / EGT flat-rate corner limit (typically ISA + 15C).
      let frac = Math.pow(sigma, 0.75); // Density effect on turbine mass flow
      if (deltaIsaC > 15) {
        // Temperature-limited: rolled back to prevent turbine blade overheating (~0.8% per deg C above flat-rate)
        const tempCutback = (deltaIsaC - 15) * 0.008;
        frac *= Math.max(0.5, 1 - tempCutback);
      }
      frac = Math.max(0.2, Math.min(1.05, frac));
      return {
        availablePowerOrThrustFraction: frac,
        powerLossPercentage: (1 - frac) * 100,
        explanation: `Turbine thrust depends on air mass flow (m_dot = rho * A * V). High OAT above flat-rated limit (ISA + 15°C) requires fuel rollback to protect turbine blades from overtemp.`,
      };
    }
  }
}

/**
 * 4. Regulatory Runway Factoring & Slope / Surface Adjustments
 */
export function getSurfaceAndSlopeMultipliers(
  surface: AtmosphericConditions['surface'] = 'PAVED_DRY',
  runwaySlopePct: number = 0
): {
  surfaceFactor: number;
  slopeFactor: number;
  combinedRollMultiplier: number;
} {
  // Surface multipliers according to ICAO / EASA CS-23 & CS-25 guidelines:
  // Paved dry: 1.00
  // Paved wet: 1.15
  // Dry short grass (<= 20 cm): 1.20
  // Wet short grass: 1.30
  // Soft ground / long grass: 1.35
  let surfaceFactor = 1.0;
  switch (surface) {
    case 'PAVED_DRY':
      surfaceFactor = 1.0;
      break;
    case 'PAVED_WET':
      surfaceFactor = 1.15;
      break;
    case 'GRASS_DRY_SHORT':
      surfaceFactor = 1.20;
      break;
    case 'GRASS_WET_SHORT':
      surfaceFactor = 1.30;
      break;
    case 'SOFT_GROUND':
      surfaceFactor = 1.38;
      break;
  }

  // Slope factor for takeoff:
  // Upslope (+%): adds ~5% to takeoff distance per 1% upslope (due to gravity resisting acceleration: g * sin(theta))
  // Downslope (-%): subtracts ~2.5% to 5% per 1% downslope (FAA/EASA standard allowance typically capped at -2.5% to -3% for safety)
  let slopeFactor = 1.0;
  if (runwaySlopePct > 0) {
    slopeFactor += (runwaySlopePct / 1.0) * 0.05;
  } else if (runwaySlopePct < 0) {
    slopeFactor += (runwaySlopePct / 1.0) * 0.025; // Negative slope reduces roll slightly
  }
  slopeFactor = Math.max(0.85, slopeFactor);

  return {
    surfaceFactor,
    slopeFactor,
    combinedRollMultiplier: surfaceFactor * slopeFactor,
  };
}

/**
 * 5. Full Takeoff Roll and Distance Calculation
 */
export interface TakeoffPerformanceResult {
  vrIasKts: number;
  vrTasKts: number;
  liftoffGroundSpeedKts: number;
  groundRollFt: number;
  distanceToScreenFt: number;
  regulatoryFactor: number; // e.g. 1.25 for Class B, 1.15 for Class A screen
  factoredRequiredDistanceFt: number;
  accelerateStopDistanceFt: number;
  powerAvailableFraction: number;
  weightPenaltyFactor: number;
  windCorrectionFactor: number;
}

export function calculateTakeoffPerformance(
  aircraft: AircraftPreset,
  weightLbs: number,
  conditions: AtmosphericConditions
): TakeoffPerformanceResult {
  const atmo = calculateAtmosphere(conditions);
  const sigma = atmo.densityRatioSigma;
  const windKts = conditions.windKts ?? 0;
  const slopePct = conditions.runwaySlopePct ?? 0;
  const surface = conditions.surface ?? 'PAVED_DRY';

  // 1. Speeds
  // Lift = 0.5 * rho * V_TAS^2 * S * CL = W.
  // When weight varies from MTOW, stall speed and Vr change with sqrt(W / W_mtow)
  const weightRatio = Math.max(0.5, Math.min(1.2, weightLbs / aircraft.maxTakeoffWeightLbs));
  const speedWeightFactor = Math.sqrt(weightRatio);

  const vrIas = aircraft.speeds.vrIas * speedWeightFactor;
  const vrTas = calculateTAS(vrIas, sigma);
  const liftoffGs = Math.max(10, vrTas - windKts); // Headwind reduces groundspeed; tailwind increases

  // 2. Engine thrust/power degradation
  const enginePerf = calculateEngineDegradation(
    aircraft.engineType,
    sigma,
    atmo.densityAltFt,
    atmo.deltaIsaC
  );
  const powerFraction = enginePerf.availablePowerOrThrustFraction;

  // 3. Ground roll physics:
  // S_G proportional to (Weight^2) / (sigma * Power * Thrust)
  // For unsupercharged piston: roll scales roughly with 1 / (sigma^2.1)
  // For turbine: roll scales with 1 / (sigma^1.6)
  const densityPowerIndex = aircraft.engineType === 'PISTON_NA' ? 2.15 : 1.7;
  const densityRollMultiplier = Math.pow(1 / sigma, densityPowerIndex * 0.7) / Math.pow(powerFraction, 0.85);

  // Weight penalty: Kinetic energy is m*V^2, and V^2 is proportional to W, so S_G is proportional to (W / W_ref)^2
  const weightPenaltyFactor = Math.pow(weightRatio, 2.0);

  // Wind correction:
  // Standard rule: 9 kts headwind reduces takeoff roll by ~10% (factor (1 - hw / vrTas)^1.85)
  // 2 kts tailwind increases takeoff roll by ~10% (factor (1 + tw / vrTas)^2.0)
  let windFactor = 1.0;
  if (windKts > 0) {
    // Headwind
    windFactor = Math.pow(Math.max(0.4, (vrTas - windKts) / vrTas), 1.85);
  } else if (windKts < 0) {
    // Tailwind
    const tailwindKts = Math.abs(windKts);
    windFactor = Math.pow((vrTas + tailwindKts) / vrTas, 2.0);
  }

  // Surface and slope multipliers
  const { combinedRollMultiplier } = getSurfaceAndSlopeMultipliers(surface, slopePct);

  // Baseline ground roll at reference MTOW sea level
  const baseRoll = aircraft.seaLevelBase.groundRollFt;
  const groundRollFt = baseRoll * weightPenaltyFactor * densityRollMultiplier * windFactor * combinedRollMultiplier;

  // Airborne distance to screen height (35ft or 50ft)
  // Airborne distance = ScreenHeight / sin(gamma_climb)
  const baseAirDistance = aircraft.seaLevelBase.distanceToScreenFt - baseRoll;
  // Climb gradient degrades with (Thrust - Drag) / Weight
  const airDistanceDegradation = (1 / powerFraction) * Math.sqrt(1 / sigma) * (1 / Math.max(0.2, (vrTas - windKts) / vrTas));
  const airborneDistanceFt = baseAirDistance * airDistanceDegradation * (weightRatio);

  const distanceToScreenFt = groundRollFt + airborneDistanceFt;

  // Regulatory safety factors:
  // Class B (CS-23 / EASA Part-NCO): Factored Takeoff Distance Required (TODR) = Unfactored TOD * 1.25
  // Class A (CS-25): Must clear 35 ft with OEI, or 1.15 * All Engines Operating distance to 35ft, whichever is greater
  const regulatoryFactor = aircraft.category === 'CLASS_B' ? 1.25 : 1.15;
  const factoredRequiredDistanceFt = distanceToScreenFt * regulatoryFactor;

  // Accelerate-Stop Distance (ASDR):
  // Roll to V1 + reaction + emergency braking to full stop
  const brakeFriction = surface === 'PAVED_WET' ? 0.22 : 0.35;
  const stopDistanceFt = (Math.pow(liftoffGs * 1.6878, 2)) / (2 * 32.174 * brakeFriction);
  const accelerateStopDistanceFt = groundRollFt * 0.9 + stopDistanceFt;

  return {
    vrIasKts: Math.round(vrIas * 10) / 10,
    vrTasKts: Math.round(vrTas * 10) / 10,
    liftoffGroundSpeedKts: Math.round(liftoffGs * 10) / 10,
    groundRollFt: Math.round(groundRollFt),
    distanceToScreenFt: Math.round(distanceToScreenFt),
    regulatoryFactor,
    factoredRequiredDistanceFt: Math.round(factoredRequiredDistanceFt),
    accelerateStopDistanceFt: Math.round(accelerateStopDistanceFt),
    powerAvailableFraction: Math.round(powerFraction * 100) / 100,
    weightPenaltyFactor: Math.round(weightPenaltyFactor * 100) / 100,
    windCorrectionFactor: Math.round(windFactor * 100) / 100,
  };
}

/**
 * 6. Climb Gradient & Rate of Climb Physics
 * 
 * Climb Gradient (%) = (Thrust - Drag) / Weight * 100
 * Rate of Climb (ROC in fpm) = Gradient(%) * V_TAS(kts) * 1.0127
 * Ground Gradient (%) = ROC(fpm) / (GS(kts) * 1.0127)
 */
export interface ClimbPerformanceResult {
  gradientPct: number;
  rocFpm: number;
  groundGradientPct: number;
  vxIasKts: number;
  vxTasKts: number;
  vyIasKts: number;
  vyTasKts: number;
  thrustLbs: number;
  dragLbs: number;
  excessThrustLbs: number;
  isStalled: boolean;
  isCeilingReached: boolean;
  engineOutGradientPct?: number;
  engineOutRocFpm?: number;
}

export function calculateClimbPerformance(
  aircraft: AircraftPreset,
  weightLbs: number,
  conditions: AtmosphericConditions,
  airspeedIasKts: number,
  isSingleEngineInoperative: boolean = false
): ClimbPerformanceResult {
  const atmo = calculateAtmosphere(conditions);
  const sigma = atmo.densityRatioSigma;
  const windKts = conditions.windKts ?? 0;

  // Weight ratio
  const weightRatio = weightLbs / aircraft.maxTakeoffWeightLbs;

  // Speeds
  const vxIas = aircraft.speeds.vxIas * Math.sqrt(weightRatio);
  const vyIas = aircraft.speeds.vyIas * Math.sqrt(weightRatio);
  const vsClean = aircraft.speeds.vs1Ias * Math.sqrt(weightRatio);

  const ias = Math.max(10, airspeedIasKts);
  const tas = calculateTAS(ias, sigma);
  const groundSpeed = Math.max(15, tas - windKts);

  // Engine power degradation
  const enginePerf = calculateEngineDegradation(
    aircraft.engineType,
    sigma,
    atmo.densityAltFt,
    atmo.deltaIsaC
  );

  let activeEnginesFraction = 1.0;
  if (isSingleEngineInoperative && aircraft.enginesCount > 1) {
    // Loss of 1 engine out of N:
    // If twin, 50% power loss, plus additional windmilling or feathered propeller drag!
    activeEnginesFraction = (aircraft.enginesCount - 1) / aircraft.enginesCount;
  }

  // Available Thrust (T) at given airspeed:
  // For propeller: Thrust = (550 * BHP * eta_prop) / V_TAS_fps
  // At Vy sea level reference:
  const baseRated = aircraft.seaLevelBase.ratedPowerHpOrThrustLbs;
  let totalAvailableThrustLbs = 0;

  if (aircraft.engineType === 'TURBOJET') {
    // Jet thrust remains roughly flat with speed at low Mach
    totalAvailableThrustLbs = baseRated * enginePerf.availablePowerOrThrustFraction * activeEnginesFraction;
  } else {
    // Propeller thrust:
    const hp = baseRated * enginePerf.availablePowerOrThrustFraction * activeEnginesFraction;
    const propEfficiency = 0.80; // typical climb propeller efficiency
    const tasFps = Math.max(30, tas * 1.6878);
    totalAvailableThrustLbs = (550 * hp * propEfficiency) / tasFps;
  }

  // Total Drag D = Parasite Drag + Induced Drag
  // D = q * S * CD0 + (W^2) / (q * S * pi * AR * e)
  // Dynamic pressure q in lbs/sq ft: q = 0.5 * rho * V_TAS^2 = 0.001188 * IAS^2 (in knots)
  const q = 0.001188 * Math.pow(ias, 2);
  const wingArea = aircraft.wingAreaSqFt;
  const cd0 = aircraft.category === 'CLASS_A' ? 0.020 : 0.028;
  const ar = 7.5; // Aspect ratio
  const oswaldE = 0.80;

  const parasiteDragLbs = q * wingArea * cd0;
  const inducedDragLbs = Math.pow(weightLbs, 2) / (q * wingArea * Math.PI * ar * oswaldE);
  let totalDragLbs = parasiteDragLbs + inducedDragLbs;

  // Add asymmetric / feathered drag penalty if OEI
  if (isSingleEngineInoperative && aircraft.enginesCount > 1) {
    totalDragLbs += 0.08 * totalDragLbs; // Windmilling/rudder trim drag
  }

  // Excess thrust
  const excessThrustLbs = totalAvailableThrustLbs - totalDragLbs;

  // Check stall
  const isStalled = ias < vsClean;

  // Climb gradient: gamma = (T - D) / W
  let gradientPct = (excessThrustLbs / weightLbs) * 100;
  if (isStalled) gradientPct = -15; // Uncontrolled descent in stall

  // Rate of climb: ROC = Gradient(%) * V_TAS(kts) * 1.0127
  let rocFpm = gradientPct * tas * 1.0127;

  // Ground climb gradient with wind:
  // Gradient_ground = ROC(fpm) / (GS(kts) * 1.0127)
  const groundGradientPct = rocFpm / (groundSpeed * 1.0127);

  const isCeilingReached = rocFpm < 100;

  // If twin or multi, calculate OEI baseline for comparison
  let engineOutGradientPct: number | undefined;
  let engineOutRocFpm: number | undefined;
  if (aircraft.enginesCount > 1 && !isSingleEngineInoperative) {
    const oeiResult = calculateClimbPerformance(aircraft, weightLbs, conditions, vyIas, true);
    engineOutGradientPct = oeiResult.gradientPct;
    engineOutRocFpm = oeiResult.rocFpm;
  }

  return {
    gradientPct: Math.round(gradientPct * 10) / 10,
    rocFpm: Math.round(rocFpm),
    groundGradientPct: Math.round(groundGradientPct * 10) / 10,
    vxIasKts: Math.round(vxIas),
    vxTasKts: Math.round(calculateTAS(vxIas, sigma)),
    vyIasKts: Math.round(vyIas),
    vyTasKts: Math.round(calculateTAS(vyIas, sigma)),
    thrustLbs: Math.round(totalAvailableThrustLbs),
    dragLbs: Math.round(totalDragLbs),
    excessThrustLbs: Math.round(excessThrustLbs),
    isStalled,
    isCeilingReached,
    engineOutGradientPct,
    engineOutRocFpm,
  };
}

/**
 * 7. Obstacle Clearance Profile Evaluator
 */
export interface Obstacle {
  distanceFromDerFt: number; // Distance from Departure End of Runway
  elevationFt: number;       // Obstacle top elevation AMSL
}

export function evaluateObstacleClearance(
  aerodromeElevFt: number,
  screenHeightFt: number,
  climbGroundGradientPct: number,
  obstacle: Obstacle
): {
  aircraftAltitudeAtObstacleAmmsl: number;
  clearanceMarginFt: number;
  isCleared: boolean;
  requiredGradientToClearPct: number;
} {
  const horizontalDistFt = obstacle.distanceFromDerFt;
  // Altitude gained from DER: (GroundGradient% / 100) * distance
  const altitudeGainedFt = (climbGroundGradientPct / 100) * horizontalDistFt;
  const aircraftAltitudeAtObstacleAmmsl = aerodromeElevFt + screenHeightFt + altitudeGainedFt;
  const clearanceMarginFt = aircraftAltitudeAtObstacleAmmsl - obstacle.elevationFt;

  // Required gradient to clear obstacle with at least 50 ft clearance margin
  const requiredClimbFt = (obstacle.elevationFt + 50) - (aerodromeElevFt + screenHeightFt);
  const requiredGradientToClearPct = Math.max(0, (requiredClimbFt / horizontalDistFt) * 100);

  return {
    aircraftAltitudeAtObstacleAmmsl: Math.round(aircraftAltitudeAtObstacleAmmsl),
    clearanceMarginFt: Math.round(clearanceMarginFt),
    isCleared: clearanceMarginFt >= 50,
    requiredGradientToClearPct: Math.round(requiredGradientToClearPct * 10) / 10,
  };
}
