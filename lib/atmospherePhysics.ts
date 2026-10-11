/**
 * Standard ICAO Atmosphere (ICAO Doc 7488 / ISO 2533)
 * & Aeronautical Atmospheric Physics Utility Engine
 *
 * Provides mathematically rigorous and syllabus-compliant implementations of:
 * - International Standard Atmosphere (ISA) temperature, pressure, and density profiles
 * - Pressure Altitude (PA) with exact barometric inversion and EASA/FAA rules of thumb (27 & 30 ft/hPa)
 * - Density Altitude (DA) with exact gas inversion, 118.8 ft/°C derivative, and 120 ft/°C rule of thumb
 * - Moist air density via virtual temperature and Dalton's partial pressures (vapor displacement)
 * - Performance degradation indices (takeoff roll, climb gradient, TAS vs CAS divergence)
 */

export const ISA_CONSTANTS = {
  /** Mean sea level pressure in hPa (millibars) */
  SEA_LEVEL_PRESSURE_HPA: 1013.25,
  /** Mean sea level pressure in Pascals (N/m^2) */
  SEA_LEVEL_PRESSURE_PA: 101325,
  /** Mean sea level standard temperature in Celsius */
  SEA_LEVEL_TEMP_C: 15.0,
  /** Mean sea level standard temperature in Kelvin */
  SEA_LEVEL_TEMP_K: 288.15,
  /** Standard dry air density at MSL in kg/m^3 */
  SEA_LEVEL_DENSITY_KG_M3: 1.2250,
  /** Troposphere standard temperature lapse rate in K/m (6.5 °C/km) */
  LAPSE_RATE_K_PER_M: 0.0065,
  /** Troposphere standard lapse rate in °C per 1,000 ft (exact: 1.9812 °C/1,000 ft) */
  LAPSE_RATE_C_PER_1000FT: 1.9812,
  /** Syllabus rounded lapse rate in °C per 1,000 ft */
  LAPSE_RATE_APPROX_C_PER_1000FT: 2.0,
  /** Standard tropopause geopotential altitude in meters */
  TROPOPAUSE_ALT_M: 11000,
  /** Standard tropopause geopotential altitude in feet (11,000 m / 0.3048) */
  TROPOPAUSE_ALT_FT: 36089.24,
  /** Standard tropopause temperature in Celsius */
  TROPOPAUSE_TEMP_C: -56.5,
  /** Standard tropopause temperature in Kelvin */
  TROPOPAUSE_TEMP_K: 216.65,
  /** Standard tropopause pressure in hPa */
  TROPOPAUSE_PRESSURE_HPA: 226.32,
  /** Specific gas constant for dry air in J/(kg*K) */
  GAS_CONSTANT_DRY_AIR_J_KG_K: 287.05287,
  /** Specific gas constant for water vapor in J/(kg*K) */
  GAS_CONSTANT_WATER_VAPOR_J_KG_K: 461.5,
  /** Standard acceleration due to gravity in m/s^2 */
  GRAVITY_M_S2: 9.80665,
  /** Dimensionless exponent g0 / (R * L_m) = 5.25588 for Troposphere pressure */
  EXPONENT_PRESSURE: 5.2558797,
  /** Dimensionless exponent (g0 / (R * L_m)) - 1 = 4.25588 for Troposphere density */
  EXPONENT_DENSITY: 4.2558797 - 1,
  /** Inverse exponent 1 / 4.25588 = 0.23497 for density altitude inversion */
  INVERSE_EXPONENT_DENSITY: 1 / (5.2558797 - 1),
  /** Scale height in meters in the lower isothermal Stratosphere: R * T_tropo / g0 */
  SCALE_HEIGHT_STRATOSPHERE_M: (287.05287 * 216.65) / 9.80665, // ~ 6341.62 m
  /** Exact conversion factor meters per foot */
  METERS_PER_FOOT: 0.3048,
  /** Exact conversion factor feet per meter */
  FEET_PER_METER: 1 / 0.3048,
  /** EASA ATPL barometric lapse rate at sea level: 27 ft/hPa (from 96 * T0 / P0) */
  BAROMETRIC_FACTOR_EASA_FT_PER_HPA: 27,
  /** FAA / general rule of thumb barometric lapse rate: 30 ft/hPa */
  BAROMETRIC_FACTOR_FAA_FT_PER_HPA: 30,
  /** Density altitude temperature coefficient (exact linear approximation): 118.8 ft/°C */
  DA_TEMP_FACTOR_EXACT: 118.8,
  /** Density altitude temperature coefficient (rule of thumb): 120 ft/°C */
  DA_TEMP_FACTOR_RULE_OF_THUMB: 120,
} as const;

export interface AtmosphericState {
  temperatureC: number;
  temperatureK: number;
  pressureHpa: number;
  pressurePa: number;
  densityKgM3: number;
  densityRatio: number; // sigma = rho / rho0
}

/**
 * Returns standard ISA temperature at a given geopotential altitude in feet.
 * Handles the troposphere linear lapse rate and the lower stratosphere isothermal zone.
 */
export function getISATemperature(altitudeFt: number): number {
  if (altitudeFt <= ISA_CONSTANTS.TROPOPAUSE_ALT_FT) {
    return ISA_CONSTANTS.SEA_LEVEL_TEMP_C - (altitudeFt / 1000) * ISA_CONSTANTS.LAPSE_RATE_C_PER_1000FT;
  }
  return ISA_CONSTANTS.TROPOPAUSE_TEMP_C;
}

/**
 * Returns standard ISA pressure in hPa at a given altitude in feet.
 * Uses the polytropic power law in the Troposphere and the exponential hydrostatic decay in the Stratosphere.
 */
export function getISAPressure(altitudeFt: number): number {
  const altM = altitudeFt * ISA_CONSTANTS.METERS_PER_FOOT;

  if (altM <= ISA_CONSTANTS.TROPOPAUSE_ALT_M) {
    const tempK = ISA_CONSTANTS.SEA_LEVEL_TEMP_K - ISA_CONSTANTS.LAPSE_RATE_K_PER_M * altM;
    return ISA_CONSTANTS.SEA_LEVEL_PRESSURE_HPA * Math.pow(tempK / ISA_CONSTANTS.SEA_LEVEL_TEMP_K, ISA_CONSTANTS.EXPONENT_PRESSURE);
  }

  // Isothermal layer (11 km to 20 km)
  const deltaH = altM - ISA_CONSTANTS.TROPOPAUSE_ALT_M;
  return ISA_CONSTANTS.TROPOPAUSE_PRESSURE_HPA * Math.exp(-deltaH / ISA_CONSTANTS.SCALE_HEIGHT_STRATOSPHERE_M);
}

/**
 * Returns standard ISA density in kg/m^3 at a given altitude in feet.
 */
export function getISADensity(altitudeFt: number): number {
  const pressHpa = getISAPressure(altitudeFt);
  const tempC = getISATemperature(altitudeFt);
  const tempK = tempC + 273.15;
  return (pressHpa * 100) / (ISA_CONSTANTS.GAS_CONSTANT_DRY_AIR_J_KG_K * tempK);
}

/**
 * Returns complete ISA atmospheric parameters at a given altitude in feet.
 */
export function getISAState(altitudeFt: number): AtmosphericState {
  const tempC = getISATemperature(altitudeFt);
  const tempK = tempC + 273.15;
  const pressHpa = getISAPressure(altitudeFt);
  const pressPa = pressHpa * 100;
  const densityKgM3 = pressPa / (ISA_CONSTANTS.GAS_CONSTANT_DRY_AIR_J_KG_K * tempK);
  const densityRatio = densityKgM3 / ISA_CONSTANTS.SEA_LEVEL_DENSITY_KG_M3;

  return {
    temperatureC: tempC,
    temperatureK: tempK,
    pressureHpa: pressHpa,
    pressurePa: pressPa,
    densityKgM3,
    densityRatio,
  };
}

/**
 * Calculates Pressure Altitude (PA) using the standard aviation formula:
 * PA = Elevation + (1013.25 - QNH) * lapseRate
 *
 * @param elevationFt Aerodrome or terrain elevation in feet
 * @param qnhHpa Local altimeter pressure setting (QNH) in hPa
 * @param lapseRate Barometric factor in ft/hPa (default: 27 ft/hPa for EASA ATPL, 30 ft/hPa for FAA)
 */
export function calculatePressureAltitude(
  elevationFt: number,
  qnhHpa: number,
  lapseRate: number = ISA_CONSTANTS.BAROMETRIC_FACTOR_EASA_FT_PER_HPA
): number {
  return elevationFt + (ISA_CONSTANTS.SEA_LEVEL_PRESSURE_HPA - qnhHpa) * lapseRate;
}

/**
 * Calculates exact Pressure Altitude (PA) by inverting the ISA pressure formula.
 * This represents the exact altitude where standard atmospheric pressure equals local ambient station pressure.
 */
export function calculateExactPressureAltitude(elevationFt: number, qnhHpa: number): number {
  // Local station pressure (QFE) reconstructed from QNH at airfield elevation:
  const elevM = elevationFt * ISA_CONSTANTS.METERS_PER_FOOT;
  const tempK = ISA_CONSTANTS.SEA_LEVEL_TEMP_K - ISA_CONSTANTS.LAPSE_RATE_K_PER_M * elevM;
  const pStationHpa = qnhHpa * Math.pow(tempK / ISA_CONSTANTS.SEA_LEVEL_TEMP_K, ISA_CONSTANTS.EXPONENT_PRESSURE);

  // Invert ISA to find altitude where P_isa == pStationHpa
  if (pStationHpa >= ISA_CONSTANTS.TROPOPAUSE_PRESSURE_HPA) {
    const tempRatio = Math.pow(pStationHpa / ISA_CONSTANTS.SEA_LEVEL_PRESSURE_HPA, 1 / ISA_CONSTANTS.EXPONENT_PRESSURE);
    const altM = (ISA_CONSTANTS.SEA_LEVEL_TEMP_K / ISA_CONSTANTS.LAPSE_RATE_K_PER_M) * (1 - tempRatio);
    return altM * ISA_CONSTANTS.FEET_PER_METER;
  }

  // Above tropopause
  const deltaM = -ISA_CONSTANTS.SCALE_HEIGHT_STRATOSPHERE_M * Math.log(pStationHpa / ISA_CONSTANTS.TROPOPAUSE_PRESSURE_HPA);
  return (ISA_CONSTANTS.TROPOPAUSE_ALT_M + deltaM) * ISA_CONSTANTS.FEET_PER_METER;
}

/**
 * Calculates Density Altitude (DA) using the standard aeronautical formula:
 * DA = PA + factor * (OAT - ISA_temp)
 *
 * @param pressureAltFt Pressure altitude in feet
 * @param oatC Outside Air Temperature in Celsius
 * @param factor Temperature coefficient (120 ft/°C rule-of-thumb or 118.8 ft/°C exact)
 */
export function calculateDensityAltitude(
  pressureAltFt: number,
  oatC: number,
  factor: number = ISA_CONSTANTS.DA_TEMP_FACTOR_RULE_OF_THUMB
): {
  densityAltitudeFt: number;
  isaTempC: number;
  isaDeviationC: number;
} {
  const isaTempC = getISATemperature(pressureAltFt);
  const isaDeviationC = oatC - isaTempC;
  const densityAltitudeFt = pressureAltFt + factor * isaDeviationC;

  return {
    densityAltitudeFt,
    isaTempC,
    isaDeviationC,
  };
}

/**
 * Calculates exact Density Altitude by computing the actual air density via the ideal gas law:
 * rho = P_ambient / (R * T_actual)
 * and finding the exact geopotential altitude in the ISA model that possesses this density.
 */
export function calculateExactDensityAltitude(pressureAltFt: number, oatC: number): number {
  const pAmbHpa = getISAPressure(pressureAltFt);
  const tempK = oatC + 273.15;
  const actualDensity = (pAmbHpa * 100) / (ISA_CONSTANTS.GAS_CONSTANT_DRY_AIR_J_KG_K * tempK);

  // Invert troposphere density profile: rho / rho0 = (1 - L*h / T0)^4.25588
  const densityRatio = actualDensity / ISA_CONSTANTS.SEA_LEVEL_DENSITY_KG_M3;

  if (densityRatio <= 0) return 80000;

  // Invert troposphere
  const tempRatio = Math.pow(densityRatio, ISA_CONSTANTS.INVERSE_EXPONENT_DENSITY);
  const altM = (ISA_CONSTANTS.SEA_LEVEL_TEMP_K / ISA_CONSTANTS.LAPSE_RATE_K_PER_M) * (1 - tempRatio);
  return altM * ISA_CONSTANTS.FEET_PER_METER;
}

/**
 * Calculates the saturation vapor pressure in hPa using the Magnus-Tetens formula.
 */
export function getSaturationVaporPressureHpa(tempC: number): number {
  return 6.1078 * Math.pow(10, (7.5 * tempC) / (237.3 + tempC));
}

/**
 * Calculates moist air density and the resulting effective density altitude.
 * Dalton's law: P = P_dry + e. Moist air is lighter than dry air because
 * water vapor (MW 18.015 g/mol) displaces heavier N2 (28 g/mol) and O2 (32 g/mol).
 */
export function calculateHumidAtmosphere(
  pressureAltFt: number,
  oatC: number,
  relativeHumidityPct: number
): {
  dryDensityKgM3: number;
  moistDensityKgM3: number;
  virtualTempC: number;
  densityAltitudeDryFt: number;
  densityAltitudeMoistFt: number;
  humidityEffectFt: number;
} {
  const pAmbHpa = getISAPressure(pressureAltFt);
  const tempK = oatC + 273.15;

  // Dry air density
  const dryDensityKgM3 = (pAmbHpa * 100) / (ISA_CONSTANTS.GAS_CONSTANT_DRY_AIR_J_KG_K * tempK);

  // Partial water vapor pressure
  const es = getSaturationVaporPressureHpa(oatC);
  const e = (Math.max(0, Math.min(100, relativeHumidityPct)) / 100) * es;
  const pDry = Math.max(0, pAmbHpa - e);

  // Moist air density
  const moistDensityKgM3 =
    (pDry * 100) / (ISA_CONSTANTS.GAS_CONSTANT_DRY_AIR_J_KG_K * tempK) +
    (e * 100) / (ISA_CONSTANTS.GAS_CONSTANT_WATER_VAPOR_J_KG_K * tempK);

  // Virtual temperature: the temperature dry air would need to have the same density
  const virtualTempK = tempK / (1 - (e / pAmbHpa) * (1 - 0.622));
  const virtualTempC = virtualTempK - 273.15;

  const daDry = calculateExactDensityAltitude(pressureAltFt, oatC);
  const daMoist = calculateExactDensityAltitude(pressureAltFt, virtualTempC);

  return {
    dryDensityKgM3,
    moistDensityKgM3,
    virtualTempC,
    densityAltitudeDryFt: daDry,
    densityAltitudeMoistFt: daMoist,
    humidityEffectFt: Math.max(0, daMoist - daDry),
  };
}

/**
 * Aircraft Performance Degradation Indices
 * High density altitude affects:
 * 1. Aerodynamic lift: L = 1/2 * rho * V^2 * S (requires higher TAS for same IAS)
 * 2. Engine thrust/power: Naturally aspirated piston engines lose ~3% power per 1,000 ft DA
 * 3. Propeller efficiency: Less mass flow per revolution
 * Combined effect on takeoff roll: approximately ground roll ~ (rho0 / rho)^2 to (rho0 / rho)^2.3
 */
export function calculatePerformanceFactors(densityRatio: number): {
  /** Relative lift generation factor at constant true airspeed */
  liftFactor: number;
  /** Estimated takeoff ground roll multiplier compared to sea level standard (1.0 = baseline) */
  takeoffRollMultiplier: number;
  /** Estimated climb gradient / rate multiplier (1.0 = baseline) */
  climbRateMultiplier: number;
  /** True Airspeed (TAS) multiplier for a constant Calibrated Airspeed (CAS) */
  tasMultiplier: number;
  /** Performance health score from 0% to 100% */
  performanceHealthScore: number;
} {
  const safeSigma = Math.max(0.1, Math.min(1.5, densityRatio));

  // TAS = CAS / sqrt(sigma)
  const tasMultiplier = 1 / Math.sqrt(safeSigma);

  // Takeoff roll increases quadratically with density reduction (approx 1 / sigma^2)
  const takeoffRollMultiplier = 1 / Math.pow(safeSigma, 1.85);

  // Available excess thrust/power scales with sigma^1.4 for unsupercharged piston aircraft
  const climbRateMultiplier = Math.max(0, Math.pow(safeSigma, 1.4));

  // Visual composite score (100% at SL ISA, degrading to ~25% at 10,000 ft DA)
  const performanceHealthScore = Math.max(10, Math.min(100, safeSigma * 100));

  return {
    liftFactor: safeSigma,
    takeoffRollMultiplier,
    climbRateMultiplier,
    tasMultiplier,
    performanceHealthScore,
  };
}
