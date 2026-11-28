import { calculateDensityAltitude, calculatePressureAltitude, getISATemperature } from '../atmospherePhysics';

export interface WorkedStep {
  label: string;
  value: string;
  isAnswer?: boolean;
}

export interface MathProblem {
  ask: string;
  answer: number;
  unit: string;
  tolerance: number;
  why: string;
  steps: WorkedStep[];
}

export interface RtomDataChip {
  key: 'dom' | 'mtom' | 'mlm' | 'mzfm' | 'trip' | 'reserve' | 'fob' | 'tof';
  label: string;
  value: number;
  unit: string;
  howToDerive?: string;
}

export interface RtomColumnSlot {
  key: RtomDataChip['key'];
  label: string;
  hint: string;
}

export interface RtomColumnSpec {
  head: string;
  slots: RtomColumnSlot[];
  sum: number;
}

export interface RtomProblem {
  text: string;
  unit: string;
  baseChips: RtomDataChip[];
  deriveChips: RtomDataChip[];
  columns: RtomColumnSpec[];
  rtom: number;
  dom: number;
  fob: number;
  answerMtl: number;
  why: string;
  steps: WorkedStep[];
}

function randInt(min: number, max: number, step = 1): number {
  const steps = Math.floor((max - min) / step);
  return min + Math.floor(Math.random() * (steps + 1)) * step;
}

export function genPressureAltitude(): MathProblem {
  const elev = randInt(500, 6500, 100);
  const qnh = randInt(985, 1033, 1);
  const pa = Math.round(calculatePressureAltitude(elev, qnh, 27));
  const diff = 1013 - qnh;

  return {
    ask: `Airfield elevation is **${elev.toLocaleString()} ft**, QNH is **${qnh} hPa** (use 27 ft/hPa). What is Pressure Altitude?`,
    answer: pa,
    unit: 'ft',
    tolerance: 60,
    why: 'Low pressure lifts the 1013.25 hPa datum downward in height relative to terrain, **increasing** Pressure Altitude.',
    steps: [
      { label: 'Pressure difference (1013 − QNH)', value: `1013 − ${qnh} = ${diff > 0 ? '+' : ''}${diff} hPa` },
      { label: 'Altitude offset (× 27 ft/hPa)', value: `${diff} × 27 = ${diff * 27 > 0 ? '+' : ''}${diff * 27} ft` },
      { label: 'Pressure Altitude = Elev + Offset', value: `${pa.toLocaleString()} ft`, isAnswer: true },
    ],
  };
}

export function genDensityAltitude(): MathProblem {
  const pa = randInt(1000, 7000, 500);
  const isaT = Math.round(getISATemperature(pa));
  const dev = randInt(5, 25, 1);
  const oat = isaT + dev;
  const { densityAltitudeFt } = calculateDensityAltitude(pa, oat, 120);
  const da = Math.round(densityAltitudeFt);

  return {
    ask: `Pressure Altitude is **${pa.toLocaleString()} ft** and OAT is **${oat}°C**. Using DA = PA + 120 × ΔISA (ISA lapse 2°C/1,000 ft), what is Density Altitude?`,
    answer: da,
    unit: 'ft',
    tolerance: 180,
    why: 'Each **+1°C above ISA** reduces air density equivalent to lifting the aircraft roughly **120 ft** higher.',
    steps: [
      { label: 'ISA temp at PA (15 − 2 × PA/1000)', value: `15 − ${(pa / 500).toFixed(1)} ≈ ${isaT}°C` },
      { label: 'ISA Deviation (OAT − ISA)', value: `${oat} − (${isaT}) = +${dev}°C` },
      { label: 'Density Altitude (PA + 120 × ΔISA)', value: `${da.toLocaleString()} ft`, isAnswer: true },
    ],
  };
}

export function genTasFromIas(): MathProblem {
  const ias = randInt(110, 240, 5);
  const paThousands = randInt(6, 24, 2);
  const altFt = paThousands * 1000;
  // EASA 2% per 1,000 ft mental rule matches sqrt(sigma) closely at mid-troposphere
  const tas = Math.round(ias * (1 + 0.02 * paThousands));

  return {
    ask: `Flying at **${ias} kt CAS/IAS** at **${altFt.toLocaleString()} ft** PA (ISA). Using the EASA rule of thumb (+2% per 1,000 ft), what is your TAS?`,
    answer: tas,
    unit: 'kt',
    tolerance: 4,
    why: 'Air density drops with altitude, so the aeroplane must fly through **more true distance per second** to push the same air mass into the pitot tube.',
    steps: [
      { label: 'Altitude percentage rule', value: `2% × ${paThousands} = +${2 * paThousands}%` },
      { label: 'Speed increment', value: `${ias} × ${(0.02 * paThousands).toFixed(2)} = +${Math.round(ias * 0.02 * paThousands)} kt` },
      { label: 'True Airspeed (TAS)', value: `${tas} kt`, isAnswer: true },
    ],
  };
}

export function genWindComponent(): MathProblem {
  const rwyDeg = randInt(1, 36, 1) * 10;
  const angleOff = [0, 30, 45, 60][randInt(0, 3)];
  const sign = Math.random() > 0.5 ? 1 : -1;
  const windDir = (rwyDeg + sign * angleOff + 360) % 360 || 360;
  const windSpd = randInt(12, 32, 2);
  const headwind = Math.round(windSpd * Math.cos((angleOff * Math.PI) / 180));

  return {
    ask: `Runway heading is **${String(rwyDeg).padStart(3, '0')}°** and tower reports wind **${String(windDir).padStart(3, '0')}° / ${windSpd} kt**. What is the **headwind component**?`,
    answer: headwind,
    unit: 'kt',
    tolerance: 2,
    why: 'Headwind reduces groundspeed at liftoff and touchdown, cutting takeoff and landing roll roughly with **(V_LOF − Wind)²**.',
    steps: [
      { label: 'Relative wind angle (|Wind − RWY|)', value: `${angleOff}°` },
      { label: `Cosine factor cos(${angleOff}°)`, value: `${Math.cos((angleOff * Math.PI) / 180).toFixed(2)}` },
      { label: 'Headwind Component', value: `${headwind} kt`, isAnswer: true },
    ],
  };
}

export function genTakeoffGroundRoll(): MathProblem {
  const baseRollM = randInt(1100, 1700, 50);
  const tailwindKts = randInt(4, 10, 2);
  const upslopePct = [1, 2][randInt(0, 1)];
  // EASA rough takeoff correction: +15% per 5 kt tailwind (~3%/kt) & +10% per +1% upslope
  const afterWind = Math.round(baseRollM * (1 + tailwindKts * 0.03));
  const afterSlope = Math.round(afterWind * (1 + upslopePct * 0.1));

  return {
    ask: `Zero-wind, level dry TODR is **${baseRollM.toLocaleString()} m**. Apply a **${tailwindKts} kt tailwind** (+3%/kt) and **+${upslopePct}% upslope** (+10%/1% slope) sequentially. What is the corrected TODR?`,
    answer: afterSlope,
    unit: 'm',
    tolerance: 35,
    why: 'Tailwind adds kinetic energy needed relative to the ground, while upslope forces a component of weight (**W·sin θ**) to oppose acceleration.',
    steps: [
      { label: `After +${tailwindKts * 3}% tailwind penalty`, value: `${baseRollM} × ${(1 + tailwindKts * 0.03).toFixed(2)} = ${afterWind.toLocaleString()} m` },
      { label: `After +${upslopePct * 10}% upslope penalty`, value: `${afterWind} × ${(1 + upslopePct * 0.1).toFixed(2)} = ${afterSlope.toLocaleString()} m`, isAnswer: true },
    ],
  };
}

export function genLiftEquation(): MathProblem {
  const rho = 1.225;
  const vMs = randInt(60, 100, 5);
  const area = randInt(120, 140, 5);
  const cl = Number((0.4 + randInt(0, 6) * 0.1).toFixed(1));
  const liftKn = Math.round((0.5 * rho * vMs * vMs * area * cl) / 1000);

  return {
    ask: `At sea level (**ρ = 1.225 kg/m³**), TAS = **${vMs} m/s**, wing area **S = ${area} m²**, and **C_L = ${cl}**. Calculate Lift {{1 // 2}}ρV²SC_L in **kN**.`,
    answer: liftKn,
    unit: 'kN',
    tolerance: 8,
    why: 'Lift scales with **V²**: doubling true airspeed multiplies dynamic pressure and lift by **4×** at constant CL.',
    steps: [
      { label: 'Dynamic pressure q = 0.5 × 1.225 × V²', value: `${Math.round(0.5 * rho * vMs * vMs).toLocaleString()} Pa` },
      { label: 'Multiply by S × CL and divide by 1,000', value: `${liftKn.toLocaleString()} kN`, isAnswer: true },
    ],
  };
}

export function genRtomThreeColumn(): RtomProblem {
  const dom = randInt(41200, 44200, 200);
  const mtom = randInt(73000, 77000, 500);
  const mlm = randInt(64000, 67000, 500);
  const mzfm = randInt(60500, 63000, 500);
  const trip = randInt(4800, 7800, 200);
  const reserve = randInt(2400, 3600, 200);

  const fob = trip + reserve;
  const tof = trip + reserve; // simplified ramp->takeoff burned = taxi negligible for exam drill

  const col1 = mtom;
  const col2 = mlm + trip;
  const col3 = mzfm + tof;
  const rtom = Math.min(col1, col2, col3);
  const mtl = rtom - dom - fob;

  return {
    text: 'Compute the **Regulated Take-Off Mass (RTOM)** and **Maximum Traffic Load (MTL)** for this A320 dispatch leg.',
    unit: 'kg',
    dom,
    fob,
    rtom,
    answerMtl: mtl,
    baseChips: [
      { key: 'dom', label: 'Dry Operating Mass (DOM)', value: dom, unit: 'kg' },
      { key: 'mtom', label: 'Max Take-Off Mass (MTOM)', value: mtom, unit: 'kg' },
      { key: 'mlm', label: 'Max Landing Mass (MLM)', value: mlm, unit: 'kg' },
      { key: 'mzfm', label: 'Max Zero Fuel Mass (MZFM)', value: mzfm, unit: 'kg' },
      { key: 'trip', label: 'Trip Fuel', value: trip, unit: 'kg' },
      { key: 'reserve', label: 'Contingency + Alt + Final Res', value: reserve, unit: 'kg' },
    ],
    deriveChips: [
      {
        key: 'fob',
        label: 'Take-Off Fuel (TOF / FOB)',
        value: fob,
        unit: 'kg',
        howToDerive: `First sum fuel: **Trip (${trip.toLocaleString()}) + Reserve (${reserve.toLocaleString()}) = ${fob.toLocaleString()} kg**`,
      },
    ],
    columns: [
      {
        head: 'Take-Off Limit',
        sum: col1,
        slots: [{ key: 'mtom', label: 'MTOM', hint: 'Column 1 checks the structural **MTOM** limit directly.' }],
      },
      {
        head: 'Landing Limit',
        sum: col2,
        slots: [
          { key: 'mlm', label: 'MLM', hint: 'Landing column starts with **Max Landing Mass (MLM)**.' },
          { key: 'trip', label: '+ Trip Fuel', hint: 'Add **Trip Fuel** burned on the way to destination.' },
        ],
      },
      {
        head: 'Zero-Fuel Limit',
        sum: col3,
        slots: [
          { key: 'mzfm', label: 'MZFM', hint: 'Zero-fuel column starts with **Max Zero Fuel Mass (MZFM)**.' },
          { key: 'fob', label: '+ Take-Off Fuel', hint: 'Add **Take-Off Fuel (TOF / FOB)** carried in the tanks.' },
        ],
      },
    ],
    why: 'Dispatching above the **lowest** of the three columns breaks either structural take-off mass, landing structural gear limit on arrival, or wing-root bending limit (MZFM).',
    steps: [
      { label: 'Col 1 (MTOM)', value: `${col1.toLocaleString()} kg` },
      { label: 'Col 2 (MLM + Trip)', value: `${col2.toLocaleString()} kg` },
      { label: 'Col 3 (MZFM + TOF)', value: `${col3.toLocaleString()} kg` },
      { label: 'Regulated Take-Off Mass (least)', value: `${rtom.toLocaleString()} kg` },
      { label: 'MTL = RTOM − DOM − TOF', value: `${mtl.toLocaleString()} kg`, isAnswer: true },
    ],
  };
}

export const MATH_GENERATORS = {
  pressureAltitude: genPressureAltitude,
  densityAltitude: genDensityAltitude,
  tasFromIas: genTasFromIas,
  windComponent: genWindComponent,
  takeoffGroundRoll: genTakeoffGroundRoll,
  liftEquation: genLiftEquation,
} as const;

export type MathGeneratorId = keyof typeof MATH_GENERATORS;
