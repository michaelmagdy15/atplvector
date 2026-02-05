
export enum MCDUPage {
    MENU = 'MENU',
    INIT_A = 'INIT_A',
    INIT_B = 'INIT_B',
    F_PLN = 'F_PLN',
    RAD_NAV = 'RAD_NAV',
    PROG = 'PROG',
    PERF = 'PERF',
    DATA = 'DATA',
    DIR = 'DIR'
}

export enum MCDUColor {
    WHITE = 'text-white',
    GREEN = 'text-green-500',
    CYAN = 'text-cyan-400',
    AMBER = 'text-amber-500',
    MAGENTA = 'text-fuchsia-500'
}

export interface MCDULine {
    id: number;
    labelLeft?: string;
    dataLeft?: string;
    colorLeft?: MCDUColor;
    labelRight?: string;
    dataRight?: string;
    colorRight?: MCDUColor;
    center?: string; // For titles or centered warnings
    colorCenter?: MCDUColor;
}

export interface MCDUWaypoint {
    id: string; // e.g. "EGLL" or "BPK"
    type: 'ARPT' | 'VOR' | 'NDB' | 'WPT';
    lat?: number;
    lon?: number;
    altConstraint?: string;
    speedConstraint?: string;
    dist?: string; // Simulated distance for display
    time?: string; // Simulated time
}

export interface RadioData {
    vorFreq: string;
    vorCrs: string;
    ilsFreq: string;
    ilsCrs: string;
    adfFreq: string;
}

export interface PerfData {
    v1: string;
    vr: string;
    v2: string;
    flaps: string;
    ths: string;
    flex: string;
    transAlt: string;
    phase: 'TAKEOFF' | 'CLB' | 'CRZ' | 'DES' | 'APPR';
}

export interface MCDUState {
    currentPage: MCDUPage;
    scratchpad: string;
    scratchpadMessage?: string;
    flightPlan: {
        origin: string;
        dest: string;
        alt: string;
        flightNo: string;
        costIndex: string;
        crzFl: string;
        zfw: string;     // Added for INIT B
        blockFuel: string; // Added for INIT B
        waypoints: MCDUWaypoint[]; // Added for F-PLN
    };
    radio: RadioData; // Added for RAD NAV
    perf: PerfData;   // Added for PERF
    subPage: number; // For multi-page scrolling (like F-PLN page 1/2)
}
