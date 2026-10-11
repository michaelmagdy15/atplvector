/**
 * Altimetry & Vertical Reference Systems - Mathematical Core
 * Validated against ICAO Doc 8168 (PANS-OPS), Doc 9839, EASA Part-FCL Syllabus 022/050/010.
 */

import {
    AtmosphereConditions,
    AltimeterSettings,
    AltimeterReadout,
    TransitionLevelResult,
    FlightRegime,
    BarometricDatum
} from './types';

// ==========================================
// PHYSICAL & ATPL SYLLABUS CONSTANTS
// ==========================================

/** Standard atmospheric sea level pressure (hPa / mb) */
export const STANDARD_PRESSURE_HPA = 1013.25;

/** Standard atmospheric sea level pressure (inHg) */
export const STANDARD_PRESSURE_INHG = 29.9213;

/** Standard ISA sea level temperature (°C) */
export const ISA_SEA_LEVEL_TEMP_C = 15.0;

/** Standard ISA temperature lapse rate per 1,000 ft (up to 36,090 ft) */
export const ISA_LAPSE_RATE_PER_1000FT = 1.98;

/** Troposphere upper boundary in feet */
export const TROPOPAUSE_ALTITUDE_FT = 36090;

/** Isothermal stratosphere temperature (°C) */
export const STRATOSPHERE_TEMP_C = -56.5;

/** Exact sea level barometric lapse rate (ft per hPa) in ISA */
export const BARO_LAPSE_SEA_LEVEL_FT_PER_HPA = 27.3;

/** Standard ATPL operational rule of thumb in lower troposphere (ft per hPa) */
export const BARO_LAPSE_LOWER_TROPO_RULE_OF_THUMB = 30.0;

/** Air Law / PANS-OPS transition level pressure correction factor (ft per hPa) */
export const BARO_LAPSE_TRANSITION_CALC_FT_PER_HPA = 27.0;

/** Temperature error rule of thumb: 4 ft per 1,000 ft per °C of ISA deviation */
export const TEMP_ERROR_FACTOR_FT_PER_1000FT_PER_DEG = 4.0;

/** Density altitude rule of thumb: 120 ft per °C of ISA deviation */
export const DENSITY_ALT_FACTOR_FT_PER_DEG = 120.0;

// ==========================================
// UNIT CONVERSIONS & BAROMETRIC FORMULAS
// ==========================================

/**
 * Converts pressure in hPa/mb to Inches of Mercury (inHg).
 */
export function convertHpaToInHg(hPa: number): number {
    return hPa * (STANDARD_PRESSURE_INHG / STANDARD_PRESSURE_HPA);
}

/**
 * Converts pressure in Inches of Mercury (inHg) to hPa/mb.
 */
export function convertInHgToHpa(inHg: number): number {
    return inHg * (STANDARD_PRESSURE_HPA / STANDARD_PRESSURE_INHG);
}

/**
 * Computes theoretical ISA temperature at a given altitude in feet.
 */
export function getISATemperatureAtAlt(altitudeFt: number): number {
    if (altitudeFt >= TROPOPAUSE_ALTITUDE_FT) {
        return STRATOSPHERE_TEMP_C;
    }
    return ISA_SEA_LEVEL_TEMP_C - (altitudeFt / 1000) * ISA_LAPSE_RATE_PER_1000FT;
}

/**
 * Computes exact atmospheric vertical thickness for 1 hPa at a given temperature and pressure.
 * ATPL Formula: Δh = 96 * T(Kelvin) / P(hPa) in ft/hPa.
 */
export function getExactLapseRateFtPerHpa(tempCelsius: number, pressureHpa: number): number {
    const tempKelvin = tempCelsius + 273.15;
    if (pressureHpa <= 0) return BARO_LAPSE_LOWER_TROPO_RULE_OF_THUMB;
    return (96.0 * tempKelvin) / pressureHpa;
}

// ==========================================
// SUBSCALE & PRESSURE ALTITUDE LOGIC
// ==========================================

/**
 * Computes Subscale Error (ft) between the Kollsman setting and the actual QNH.
 * If Subscale > actualQNH, altimeter OVERREADS (+error, dangerous).
 * If Subscale < actualQNH, altimeter UNDERREADS (-error, safe).
 */
export function calculateSubscaleError(
    subscaleHpa: number,
    actualQnhHpa: number,
    lapseRate: number = BARO_LAPSE_LOWER_TROPO_RULE_OF_THUMB
): number {
    return (subscaleHpa - actualQnhHpa) * lapseRate;
}

/**
 * Computes Pressure Altitude (PA) from Altitude above MSL and local QNH.
 * PA = Altitude + (1013.25 - QNH) * 30 ft/hPa.
 */
export function calculatePressureAltitude(
    altitudeAMSL: number,
    actualQnhHpa: number,
    lapseRate: number = BARO_LAPSE_LOWER_TROPO_RULE_OF_THUMB
): number {
    return altitudeAMSL + (STANDARD_PRESSURE_HPA - actualQnhHpa) * lapseRate;
}

/**
 * Computes Height above ground / aerodrome (AGL).
 * Height = Altitude AMSL - Aerodrome/Terrain Elevation.
 */
export function calculateHeightAGL(altitudeAMSL: number, surfaceElevationFt: number): number {
    return Math.max(0, altitudeAMSL - surfaceElevationFt);
}

// ==========================================
// TEMPERATURE ERROR FORMULA
// ==========================================

/**
 * Computes Temperature Error (ft) according to the ATPL rule of thumb:
 * Error = 4 ft per 1,000 ft of air column per degree Celsius ISA deviation.
 * 
 * Column height is usually measured from the reporting station elevation to the aircraft.
 * When column air is COLDER than ISA (isaDeviation < 0), true altitude is LOWER than indicated.
 * 
 * Returns: temperatureCorrection in feet (signed):
 * True Altitude = Indicated Altitude + tempCorrection.
 */
export function calculateTemperatureCorrection(
    airColumnFt: number,
    isaDeviationC: number
): number {
    const columnThousands = Math.max(0, airColumnFt) / 1000.0;
    return columnThousands * TEMP_ERROR_FACTOR_FT_PER_1000FT_PER_DEG * isaDeviationC;
}

// ==========================================
// DENSITY ALTITUDE FORMULA
// ==========================================

/**
 * Computes Density Altitude using the standard ATPL linear rule:
 * DA = Pressure Altitude + (120 ft * ISA Deviation).
 */
export function calculateDensityAltitude(
    pressureAltitudeFt: number,
    oatC: number
): number {
    const isaTempAtPA = getISATemperatureAtAlt(pressureAltitudeFt);
    const isaDeviation = oatC - isaTempAtPA;
    return pressureAltitudeFt + DENSITY_ALT_FACTOR_FT_PER_DEG * isaDeviation;
}

// ==========================================
// TRANSITION ALTITUDE / LEVEL & FLIGHT REGIMES
// ==========================================

/**
 * Computes the lowest usable Transition Level (TL) and layer thickness based on local QNH.
 * Implements ICAO Annex 2 & Doc 8168 / EASA Air Law standard method:
 * 1. Difference = 1013 - QNH.
 * 2. Pressure difference in ft = Difference * 27 ft/hPa.
 * 3. Base PA at TA = TA + (1013 - QNH) * 27.
 * 4. Add minimum required separation buffer (typically 1,000 ft), then round up to next usable FL (nearest 500 ft).
 */
export function calculateTransitionLevel(
    transitionAltitudeFt: number,
    qnhHpa: number,
    minBufferFt: number = 0,
    lapseRate: number = BARO_LAPSE_TRANSITION_CALC_FT_PER_HPA
): TransitionLevelResult {
    const pressDiffHpa = STANDARD_PRESSURE_HPA - qnhHpa;
    const pressCorrFt = pressDiffHpa * lapseRate;
    const paAtTa = transitionAltitudeFt + pressCorrFt;

    // Minimum acceptable flight level altitude
    const minFlAltitude = paAtTa + minBufferFt;

    // Round up to nearest 500 ft flight level (e.g. 6216 -> 6500 = FL065)
    // If exact multiple of 500, advance to next 500 ft so TL is strictly above TA
    const roundedFlAltitude = minFlAltitude % 500 === 0 && minBufferFt === 0
        ? minFlAltitude + 500
        : Math.ceil(minFlAltitude / 500) * 500;

    const transitionLevel = Math.round(roundedFlAltitude / 100);

    const flString = transitionLevel < 100
        ? `FL0${transitionLevel}`
        : `FL${transitionLevel}`;

    const transitionLayerThicknessFt = roundedFlAltitude - transitionAltitudeFt;

    return {
        transitionAltitudeFt,
        transitionLevel,
        transitionLevelFL: flString,
        transitionLayerThicknessFt,
        qnhHpa
    };
}

/**
 * Determines current flight regime relative to TA and TL.
 */
export function determineFlightRegime(
    altitudeFt: number,
    transitionAltitudeFt: number,
    transitionLevelFt: number
): { regime: FlightRegime; requiredSubscale: BarometricDatum } {
    if (altitudeFt <= transitionAltitudeFt) {
        return { regime: 'BELOW_TA', requiredSubscale: 'QNH' };
    }
    if (altitudeFt >= transitionLevelFt) {
        return { regime: 'FLIGHT_LEVELS', requiredSubscale: 'STD' };
    }
    return { regime: 'TRANSITION_LAYER', requiredSubscale: 'STD' };
}

// ==========================================
// MASTER STATE RESOLVER
// ==========================================

export interface AltimetryInputParams {
    conditions: AtmosphereConditions;
    settings: AltimeterSettings;
}

/**
 * Pure function that resolves the complete altimetry state across all 5 datums and error models.
 */
export function resolveAltimetryReadout(params: AltimetryInputParams): AltimeterReadout {
    const { conditions, settings } = params;
    const { actualQnhHpa, elevationFt, oatC, trueAltitudeFt } = conditions;
    const { subscaleHpa, transitionAltitudeFt } = settings;

    // 1. Atmosphere lapse and ISA references
    const isaTempAtAltC = getISATemperatureAtAlt(trueAltitudeFt);
    const isaDeviationC = oatC - isaTempAtAltC;
    const currentLapseRateFtPerHpa = getExactLapseRateFtPerHpa(oatC, actualQnhHpa);

    // 2. Subscale Error
    const subscaleErrorFt = calculateSubscaleError(subscaleHpa, actualQnhHpa, BARO_LAPSE_LOWER_TROPO_RULE_OF_THUMB);

    // 3. Air column and Temperature Error
    const airColumnFt = Math.max(0, trueAltitudeFt - elevationFt);
    const tempCorrectionFt = calculateTemperatureCorrection(airColumnFt, isaDeviationC);
    // Note: Temperature error in terms of (Indicated - True)
    const temperatureErrorFt = -tempCorrectionFt;

    // 4. Indicated Altitude
    // Indicated = True + Subscale Error + Temperature Error
    const indicatedAltitude = trueAltitudeFt + subscaleErrorFt + temperatureErrorFt;

    // 5. Vertical Reference Datums
    const heightAGL = calculateHeightAGL(trueAltitudeFt, elevationFt);
    const altitudeAMSL = trueAltitudeFt;
    const pressureAltitude = calculatePressureAltitude(trueAltitudeFt, actualQnhHpa, BARO_LAPSE_LOWER_TROPO_RULE_OF_THUMB);
    const flightLevel = Math.round(pressureAltitude / 100);
    const densityAltitude = calculateDensityAltitude(pressureAltitude, oatC);

    // 6. Transition Level & Regimes
    const tlInfo = calculateTransitionLevel(transitionAltitudeFt, actualQnhHpa);
    const tlAltitudeFt = tlInfo.transitionLevel * 100;
    const { regime, requiredSubscale } = determineFlightRegime(indicatedAltitude, transitionAltitudeFt, tlAltitudeFt);

    const totalErrorFt = indicatedAltitude - trueAltitudeFt;
    const isOverreading = totalErrorFt > 0;

    return {
        heightAGL: Math.round(heightAGL),
        altitudeAMSL: Math.round(altitudeAMSL),
        pressureAltitude: Math.round(pressureAltitude),
        flightLevel,
        densityAltitude: Math.round(densityAltitude),
        indicatedAltitude: Math.round(indicatedAltitude),
        trueAltitude: Math.round(trueAltitudeFt),
        subscaleErrorFt: Math.round(subscaleErrorFt),
        temperatureErrorFt: Math.round(temperatureErrorFt),
        totalErrorFt: Math.round(totalErrorFt),
        isOverreading,
        flightRegime: regime,
        requiredSubscale,
        transitionLevelInfo: tlInfo,
        isaTempAtAltC: Number(isaTempAtAltC.toFixed(1)),
        isaDeviationC: Number(isaDeviationC.toFixed(1)),
        currentLapseRateFtPerHpa: Number(currentLapseRateFtPerHpa.toFixed(1))
    };
}
