/**
 * Altimetry & Vertical Reference Systems - TypeScript Definitions
 * Standardized across ATPL Subjects: 022 (Instrumentation), 050 (Meteorology), 010 (Air Law)
 */

export type BarometricDatum = 'QNH' | 'QFE' | 'STD';
export type BarometricUnits = 'hPa' | 'inHg';

export interface AtmosphereConditions {
    /** Surface/Station barometric pressure reduced to sea level (hPa) */
    actualQnhHpa: number;
    /** Aerodrome or ground surface elevation above MSL (feet) */
    elevationFt: number;
    /** Outside Air Temperature at current altitude (°C) */
    oatC: number;
    /** Current true geometric altitude of the aircraft above MSL (feet) */
    trueAltitudeFt: number;
}

export interface AltimeterSettings {
    /** Current setting dialed into the Kollsman subscale window (hPa) */
    subscaleHpa: number;
    /** Published Transition Altitude for the aerodrome/airspace (feet) */
    transitionAltitudeFt: number;
    /** Minimum required transition layer separation buffer (default 1000 ft) */
    minTransitionLayerBufferFt?: number;
}

export interface TransitionLevelResult {
    /** Transition Altitude in feet */
    transitionAltitudeFt: number;
    /** Computed lowest usable Transition Level (e.g. 65 for FL65, 70 for FL70) */
    transitionLevel: number;
    /** Formatted FL string (e.g. 'FL065' or 'FL070') */
    transitionLevelFL: string;
    /** Thickness of the transition layer in feet (TL in ft - TA in ft) */
    transitionLayerThicknessFt: number;
    /** Current QNH used for computation */
    qnhHpa: number;
}

export type FlightRegime = 'BELOW_TA' | 'TRANSITION_LAYER' | 'FLIGHT_LEVELS';

export interface AltimeterReadout {
    // 5 Core Vertical References
    /** 1. Height above specified datum / aerodrome elevation (ft AGL) */
    heightAGL: number;
    /** 2. Altitude above Mean Sea Level (ft AMSL) */
    altitudeAMSL: number;
    /** 3. Pressure Altitude referenced to standard 1013.25 hPa datum (ft) */
    pressureAltitude: number;
    /** 4. Flight Level (PA / 100), valid in cruise above Transition Level */
    flightLevel: number;
    /** 5. Density Altitude (Pressure altitude corrected for non-standard temperature) (ft) */
    densityAltitude: number;

    // Cockpit & Instrument Indications
    /** Indicated altitude shown on dial face (ft) */
    indicatedAltitude: number;
    /** True physical altitude above MSL (ft) */
    trueAltitude: number;

    // Error Breakdowns
    /** Subscale error caused by discrepancy between subscale setting and actual QNH (ft) */
    subscaleErrorFt: number;
    /** Temperature error caused by deviation from ISA standard temperature lapse (ft) */
    temperatureErrorFt: number;
    /** Combined error: Indicated - True (ft) */
    totalErrorFt: number;
    /** True if instrument overreads (reads HIGHER than true altitude -> dangerous) */
    isOverreading: boolean;

    // Air Law & Operational Status
    /** Current flight regime relative to TA and TL */
    flightRegime: FlightRegime;
    /** Required barometric setting for current regime ('QNH' or 'STD') */
    requiredSubscale: BarometricDatum;
    /** Lowest usable flight level calculated from ambient QNH */
    transitionLevelInfo: TransitionLevelResult;

    // Atmosphere reference
    /** ISA temperature at current pressure altitude (°C) */
    isaTempAtAltC: number;
    /** ISA temperature deviation (OAT - ISA) (°C) */
    isaDeviationC: number;
    /** Barometric lapse rate at current density (ft/hPa) */
    currentLapseRateFtPerHpa: number;
}

export interface AltimeterGaugeProps {
    /** Indicated altitude in feet (drives the needles) */
    indicatedAltitude: number;
    /** Subscale setting in hPa (drives the Kollsman window) */
    subscaleHpa: number;
    /** Optional callback when user adjusts the subscale knob */
    onSubscaleChange?: (newSubscaleHpa: number) => void;
    /** Size preset or pixel dimension */
    size?: 'sm' | 'md' | 'lg' | number;
    /** Show interactive rotary knob */
    interactive?: boolean;
    /** Optional highlight for teaching */
    highlightElement?: 'needle-100' | 'needle-1000' | 'needle-10000' | 'kollsman' | 'barber-pole' | null;
    className?: string;
}

export interface PressureChamberProps {
    /** Ambient static pressure feeding the case (hPa) */
    ambientPressureHpa: number;
    /** Rate of climb/descent (fpm) */
    verticalSpeedFpm?: number;
    /** Is static port blocked with ice/debris */
    isStaticBlocked?: boolean;
    /** Is alternate static source selected */
    isAlternateStaticOn?: boolean;
    className?: string;
}
