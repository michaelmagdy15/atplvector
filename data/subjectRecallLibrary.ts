import { HoldGateSpec } from '../components/engines/HoldShortGate';
import {
  AcarsRow,
  ConfusionPair,
  KneeboardFormula,
  KneeboardNumber,
  OneMinuteItem,
} from '../components/lesson';

export interface SubjectRecallSpec {
  subjectCode: string;
  subjectName: string;
  accentColor: string;
  examQuestions: number;
  examMinutes: number;
  passPercent: number;
  oneMinuteItems: OneMinuteItem[];
  confusionPairs: ConfusionPair[];
  kneeboard: {
    title: string;
    formulas: KneeboardFormula[];
    keyNumbers: KneeboardNumber[];
    memoryHooks: string[];
  };
  quickGate: HoldGateSpec;
  acarsDebrief: {
    headline: string;
    rows: AcarsRow[];
  };
}

export const SUBJECT_RECALL_LIBRARY: Record<string, SubjectRecallSpec> = {
  '010': {
    subjectCode: '010',
    subjectName: 'Air Law',
    accentColor: 'var(--subj-law)',
    examQuestions: 44,
    examMinutes: 60,
    passPercent: 75,
    oneMinuteItems: [
      { num: '01', headline: 'Airspace Sovereignty', body: '**Art 1:** Complete & exclusive over land + **12 NM** territorial sea. High seas use Annex 2.' },
      { num: '02', headline: 'Standards vs RP', body: '**Standards ("Shall")** notify ICAO under **Art 38**. **RPs ("Should")** do not.' },
      { num: '03', headline: 'Right of Way & SERA', body: 'Least manoeuvrable wins: **Ball → Glider → Airship → Powered / Towing**.' },
      { num: '04', headline: 'Intercept & Signals', body: 'Hold **VHF 121.5 MHz**, rock wings / flash navs = *Understood, will comply*.' },
    ],
    confusionPairs: [
      { leftTitle: 'Transition Altitude (TA)', leftBody: 'Climb setting: **QNH → 1013.25 hPa**. Published per aerodrome in ft AMSL.', leftColor: '#38bdf8', rightTitle: 'Transition Level (TL)', rightBody: 'Descent setting: **1013.25 → QNH**. Assigned dynamically as an **FL**.', rightColor: '#f59e0b', tellApart: '**Climb A → L** (Altitude at TA); **Descend L → Q** (Level at TL). Layer thickness ≥ **1,000 ft**.' },
      { leftTitle: 'VFR Night vs SVFR', leftBody: '**SVFR** clears entry into a Control Zone below VMC (vis ≥ 1,500 m, clear of cloud).', leftColor: '#34d399', rightTitle: 'SERA Class A–G', rightBody: '**Class A** = IFR only. **Class C/D** clear VFR; **E/F/G** allow VFR without clearance.', rightColor: '#fb7185', tellApart: '**A = IFR Alone** · **B/C/D = Need ATC Clearance** for VFR.' },
    ],
    kneeboard: {
      title: 'Air Law 010 Reference Sheet',
      formulas: [
        { name: 'SERA Semi-Circular Levels', formula: '000°–179°M = **ODD** FLs (30, 50…)  |  180°–359°M = **EVEN** FLs (40, 60…)' },
        { name: 'Right of Way Priority', formula: 'Balloon > Glider > Airship > Powered (Same class: **Right gives way**)' },
      ],
      keyNumbers: [
        { label: 'AIRAC Effective Cycle', value: '28 days (56 major)', note: 'Annex 15 AIS' },
        { label: 'Clearway Cap (Annex 14)', value: 'Max 50% TORA', note: 'Declared distances' },
        { label: 'RVSM Airspace Band', value: 'FL290 – FL410', note: '1,000 ft vertical sep' },
      ],
      memoryHooks: [
        '**Converging on Right?** Give way to traffic on your RIGHT (Green nav light facing you).',
        '**Overtaking?** Stay right, approach angle &gt; 70° behind wing — overtaken aircraft ALWAYS has right of way.',
      ],
    },
    quickGate: {
      id: 'qgate-010',
      kind: 'sentence',
      askedInEasa: true,
      sentence: 'When two powered aircraft converge at approximately the same altitude, the aircraft that has the other on its ___ shall give way.',
      options: ['right', 'left', 'dead astern', 'vertical stabilizer'],
      answerIndex: 0,
      why: 'SERA.3210: Give way to aircraft on your **right** (remember: you see their red port navigation light!).',
    },
    acarsDebrief: {
      headline: 'AIR LAW 010 MODULE CHECK COMPLETE',
      rows: [
        { label: 'Priority order', value: 'Balloon > Glider > Airship > Powered' },
        { label: 'ICAO Art 38', value: 'Mandatory difference notice for Standards' },
      ],
    },
  },

  '021': {
    subjectCode: '021',
    subjectName: 'AGK: Systems & Powerplant',
    accentColor: 'var(--subj-agk)',
    examQuestions: 80,
    examMinutes: 120,
    passPercent: 75,
    oneMinuteItems: [
      { num: '01', headline: 'Structures & Load Limits', body: 'Transport jets certified **+2.5G to −1.0G** clean (**+2.0G / 0G** flaps out), **1.5× safety factor**.' },
      { num: '02', headline: 'Hydraulics & PTU', body: 'Pascal’s law **F = P × A**; Skydrol phosphate ester; **PTU transfers power, NEVER fluid**.' },
      { num: '03', headline: 'Electrics & IDG/CSD', body: '**115/200V 400 Hz 3-phase AC**; TRUs convert AC → 28V DC; IDGs hold constant frequency.' },
      { num: '04', headline: 'Gas Turbine Brayton Cycle', body: 'Continuous combustion at **constant pressure**; EGT limits turbine life; axial bleed prevents surge.' },
    ],
    confusionPairs: [
      { leftTitle: 'Limit Load (+2.5G)', leftBody: 'Max load encountered in normal operational life — **zero permanent deformation**.', leftColor: '#38bdf8', rightTitle: 'Ultimate Load (+3.75G)', rightBody: '**1.5 × Limit Load** — structure must withstand it for **3 seconds** without catastrophic failure.', rightColor: '#fb7185', tellApart: '**Limit = Keep flying cleanly**; **Ultimate = 1.5× for 3s survival margin**.' },
      { leftTitle: 'Fail-Safe Design', leftBody: 'Multi-path redundant load members so one failure is carried by intact neighbours.', leftColor: '#34d399', rightTitle: 'Safe-Life Design', rightBody: 'Non-redundant single primary part replaced strictly at fixed flying hours/cycles (landing gear).', rightColor: '#f59e0b', tellApart: '**Fail-Safe** survives damage via backups; **Safe-Life** retires on the calendar before cracks start.' },
    ],
    kneeboard: {
      title: 'AGK 021 Systems & Engines Reference',
      formulas: [
        { name: 'Hydraulic Force', formula: 'F = P × A   |   Ultimate Load = 1.5 × Limit Load' },
        { name: '400 Hz AC Synchronous Speed', formula: 'RPM = {{120 × f // Poles}}   (4 poles @ 400 Hz = 12,000 RPM)' },
      ],
      keyNumbers: [
        { label: 'Cabin Pressurization Max Diff', value: '≈ 8.0 – 8.6 psi', note: 'Cabin altitude max 8,000 ft' },
        { label: 'Passenger O₂ Drop Altitude', value: '14,000 ft cabin alt', note: 'Chemical generators ~12–22 min' },
        { label: 'Jet Bus Standard', value: '115 / 200 V · 400 Hz', note: 'Never parallel un-synced AC gens!' },
      ],
      memoryHooks: [
        '**PTU** = Power Transfer Unit (**rotary mechanical shaft**, zero fluid crosses!).',
        '**Brayton = Constant Pressure**; **Otto = Constant Volume** combustion.',
      ],
    },
    quickGate: {
      id: 'qgate-021',
      kind: 'sentence',
      askedInEasa: true,
      sentence: 'An aircraft Power Transfer Unit (PTU) links Green and Yellow hydraulic systems by transferring mechanical power only — and transfers ___ hydraulic fluid.',
      options: ['zero (no)', '50% reserve', 'only emergency', 'pressurized return'],
      answerIndex: 0,
      why: 'The **PTU** couples a hydraulic motor on one system mechanically to a pump on the other — **preventing cross-contamination if one reservoir leaks dry**.',
    },
    acarsDebrief: {
      headline: 'AGK 021 SYSTEMS MODULE CHECK COMPLETE',
      rows: [
        { label: 'CS-25 Limit / Ultimate', value: '+2.5G clean / 1.5× safety = +3.75G (3s)' },
        { label: 'AC Bus / DC Bus', value: '115V 400 Hz 3-ph → TRUs → 28V DC' },
      ],
    },
  },

  '022': {
    subjectCode: '022',
    subjectName: 'Instrumentation',
    accentColor: '#38bdf8',
    examQuestions: 60,
    examMinutes: 90,
    passPercent: 75,
    oneMinuteItems: [
      { num: '01', headline: 'Pitot & Static Leaks/Blocks', body: 'Blocked Pitot acts like an **altimeter**; blocked Static freezes **altimeter & VSI** and flips ASI errors.' },
      { num: '02', headline: 'Speed Ladder', body: '**IAS → (Inst) → CAS → (Compressibility) → EAS → (Density 1/√σ) → TAS**.' },
      { num: '03', headline: 'Gyros: Rigidity & Precession', body: 'Rigidity grows with RPM & mass; applied torque turns **90° ahead** in spin direction.' },
      { num: '04', headline: 'EGPWS & TCAS II', body: '**TCAS II RA** commands *VERTICAL ONLY* (Climb/Descend) and **overrides ATC clearance**.' },
    ],
    confusionPairs: [
      { leftTitle: 'Compass ANDS Error', leftBody: '**A**ccelerate **N**orth · **D**ecelerate **S**outh (Max error on **090° / 270°**, zero on N/S).', leftColor: '#38bdf8', rightTitle: 'Compass UNOS Turn', rightBody: '**U**ndershoot **N**orth · **O**vershoot **S**outh (N Hemisphere dip error during turns).', rightColor: '#f59e0b', tellApart: '**ANDS = Speed change (E/W headings)** · **UNOS = Turns through N/S** (Northern Hemisphere).' },
      { leftTitle: 'Blocked Static Only (Climbing)', leftBody: 'Altimeter **freezes**, VSI reads **0**, ASI **under-reads** as you climb.', leftColor: '#fb7185', rightTitle: 'Blocked Pitot + Drain Clear', rightBody: 'Ram pressure escapes → ASI **drops to zero** immediately.', rightColor: '#14b8a6', tellApart: 'Plugged Static traps sea-level pressure inside ASI case; higher exterior static misses → ASI **under-reads**.' },
    ],
    kneeboard: {
      title: 'Instrumentation 022 Reference Sheet',
      formulas: [
        { name: 'Speed Conversion Chain', formula: 'IAS → CAS → EAS → TAS  |  M = {{TAS // LSS}}   (LSS = 38.94 √T_{{K}} kt)' },
        { name: 'Schuler Tuning Period', formula: 'T = 2π √({{R_{{earth}} // g}}) ≈ 84.4 minutes' },
      ],
      keyNumbers: [
        { label: 'Rate 1 Standard Turn', value: '3° / sec (2 min = 360°)', note: 'Bank ≈ (TAS/10) + 7°' },
        { label: 'TCAS II RA Authority', value: 'Always follow RA', note: 'Even if ATC instructs opposite' },
        { label: 'Speed of Sound @ +15°C', value: '661 kt (340 m/s)', note: 'Depends ONLY on Temp (√K)' },
      ],
      memoryHooks: [
        '**Blocked Pitot + Drain Blocked + Climb** = ASI **OVER-reads** (acts like an Altimeter!).',
        '**I**nstrument **C**alibrated **E**quivalent **T**rue (**I-C-E-T**).',
      ],
    },
    quickGate: {
      id: 'qgate-022',
      kind: 'sentence',
      askedInEasa: true,
      sentence: 'During an acceleration from 150 kt to 250 kt while flying steady heading **270° West** in the Northern Hemisphere, a direct-reading magnetic compass initially indicates an apparent turn toward ___.',
      options: ['North', 'South', 'East', 'no error at all'],
      answerIndex: 0,
      why: '**ANDS** (**A**ccelerate **N**orth, **D**ecelerate **S**outh) occurs on **East/West** headings due to vertical magnetic dip torque swinging the magnet pole.',
    },
    acarsDebrief: {
      headline: 'INSTRUMENTATION 022 MODULE CHECK COMPLETE',
      rows: [
        { label: 'Speed Chain', value: 'IAS → CAS → EAS → TAS (M = TAS / LSS)' },
        { label: 'TCAS II RA Law', value: 'Vertical avoidance · Follow RA over ATC' },
      ],
    },
  },

  '031': {
    subjectCode: '031',
    subjectName: 'Mass & Balance',
    accentColor: '#eab308',
    examQuestions: 25,
    examMinutes: 75,
    passPercent: 75,
    oneMinuteItems: [
      { num: '01', headline: 'Mass Definitions', body: '**BEM** + crew/catering = **DOM**. **DOM** + traffic load = **ZFM**. + TOF = **TOM**.' },
      { num: '02', headline: 'CG & %MAC', body: '**Moment = Mass × Arm**. **%MAC = {{CG − LEMAC // MAC}} × 100%**.' },
      { num: '03', headline: 'CG Shift Formula', body: '**{{ΔCG // ΔArm}} = {{Moved Mass // Total Mass}}** — adding vs shifting uses *new total mass*.' },
      { num: '04', headline: 'Fwd vs Aft CG Effects', body: '**Fwd CG:** higher stall speed, higher stability, more drag/fuel. **Aft CG:** longer range, less stability.' },
    ],
    confusionPairs: [
      { leftTitle: 'Forward CG Limit', leftBody: 'High tailplane downforce needed → higher effective weight, **higher VS**, longer takeoff roll, worse fuel burn.', leftColor: '#38bdf8', rightTitle: 'Aft CG Limit', rightBody: 'Lower drag & **better range/endurance**, BUT reduced longitudinal stability and hard stall recovery.', rightColor: '#fb7185', tellApart: '**Forward = Safe/Heavy/Thirsty**; **Aft = Fast/Frugal/Twitchy**.' },
      { leftTitle: 'Shifting Mass vs Adding Mass', leftBody: 'Shifting keeps Total Mass constant (`M_total`). Adding/removing changes Total Mass (**use NEW total mass**!).', leftColor: '#eab308', rightTitle: 'Standard Mass Assumptions', rightBody: 'EASA **Flight Deck Crew = 85 kg**, Cabin Crew = **75 kg**, All-Adult Pax (excl. holiday) = **88 kg**.', rightColor: '#14b8a6', tellApart: 'For **Add/Offload** problems: measure ΔArm relative to the **OLD CG** and divide by **NEW Total Mass**.' },
    ],
    kneeboard: {
      title: 'Mass & Balance 031 Formula Sheet',
      formulas: [
        { name: 'CG Position & %MAC', formula: 'CG = {{Σ(Mass × Arm) // Σ Mass}}   |   %MAC = {{CG − LEMAC // MAC}} × 100' },
        { name: 'Mass Shift / Addition', formula: 'ΔCG = {{m × d // Total Mass_{{new}}}}' },
      ],
      keyNumbers: [
        { label: 'DOM to ZFM', value: 'DOM + Traffic Load (Pax+Bag+Cargo)', note: 'Never exceed MZFM' },
        { label: 'Flight Crew / Cabin Crew', value: '85 kg / 75 kg', note: 'ORO.MLR / CAT.POL.MAB' },
        { label: 'Pax Std Jet (≥20 seats)', value: '84 kg (All) / 88 kg (M) / 70 kg (F)', note: 'Checked bag Dom 11 / Eur 13 / Inter 15 kg' },
      ],
      memoryHooks: [
        '**RTOM** = min(**MTOM**, **MLM + Trip Fuel**, **MZFM + TOF**).',
        '**Fwd CG** hurts **Performance** (more drag/burn, higher stall); **Aft CG** hurts **Stability**.',
      ],
    },
    quickGate: { id: 'qgate-031', kind: 'cols' },
    acarsDebrief: {
      headline: 'MASS & BALANCE 031 DISPATCH COMPLETE',
      rows: [
        { label: 'Mass hierarchy', value: 'BEM → DOM → ZFM (≤MZFM) → TOM (≤MTOM)' },
        { label: 'CG formula', value: '%MAC = (CG − LEMAC) / MAC × 100' },
      ],
    },
  },

  '032': {
    subjectCode: '032',
    subjectName: 'Performance',
    accentColor: 'var(--subj-perf)',
    examQuestions: 45,
    examMinutes: 120,
    passPercent: 75,
    oneMinuteItems: [
      { num: '01', headline: 'Declared Distances', body: '**TODA** = TORA + Clearway (≤50% TORA); **ASDA** = TORA + Stopway.' },
      { num: '02', headline: 'Climb Segments (CS-25)', body: '1st (gear up, **0%**), 2nd (**≥2.4% 2-eng** @ V2), Final (**≥1.2% 2-eng** clean @ ≥1.18 VSR).' },
      { num: '03', headline: 'Net vs Gross Gradient', body: 'CS-25 subtracts **0.8%** (2-eng) from Gross Flight Path to ensure obstacle clearance.' },
      { num: '04', headline: 'Landing Distances (LDR)', body: 'Jets dry = **ALD / 0.60** (**1.67×**); Turboprops dry = **1.43×**; **Wet adds +15%** (`1.92×`).' },
    ],
    confusionPairs: [
      { leftTitle: '2nd Segment Climb (2-Eng)', leftBody: 'Gear **UP**, Takeoff flaps, **V2**, MCT/TOGA on live engine: Gross min **2.4%** (3-eng `2.7%`, 4-eng `3.0%`).', leftColor: '#ec4899', rightTitle: 'Final Takeoff Climb (4th Seg)', rightBody: 'Flaps **RETRACTED (Clean)**, MCT thrust, speed ≥ 1.18 VSR: Gross min **1.2%** (2-eng).', rightColor: '#38bdf8', tellApart: '**2nd Segment = 2.4% (2-eng)** flaps out @ V2. **Final Segment = 1.2% (2-eng)** clean!' },
      { leftTitle: 'Best Angle (VX)', leftBody: 'Max height gain per **horizontal distance** (**highest gradient (T−D)/W**).', leftColor: '#34d399', rightTitle: 'Best Rate (VY)', rightBody: 'Max height gain per **unit time** (max excess power). With altitude: **VX rises, VY drops** until crossing at **Absolute Ceiling**.', rightColor: '#f59e0b', tellApart: 'Short-field obstacle = **VX**; Fast ATC climb = **VY**.' },
    ],
    kneeboard: {
      title: 'Performance 032 EASA Numbers',
      formulas: [
        { name: 'Climb Gradient & ROC', formula: 'Gradient % = {{T − D // W}} × 100   |   ROC (fpm) ≈ Gradient% × TAS × 1.013' },
        { name: 'Wet Landing Factor (Jet)', formula: 'Required Wet LDA = 1.15 × {{ALD_{{dry}} // 0.60}} ≈ 1.92 × ALD_{{dry}}' },
      ],
      keyNumbers: [
        { label: 'CS-25 2nd Seg Min (2/3/4 Eng)', value: '2.4% / 2.7% / 3.0%', note: 'Gross minus 0.8 / 0.9 / 1.0% = Net' },
        { label: 'CS-25 Dry / Wet Jet Landing', value: '60% LDA (1.67×) / 1.92×', note: 'Stop within 60% of LDA' },
        { label: '1st Segment Duration', value: '35 ft to Gear Up', note: 'Gear down, 0.0% min (2-eng)' },
      ],
      memoryHooks: [
        '**Wet landing?** Apply **1.15×** on top of the dry factored distance (`1.67 × 1.15 = 1.92`).',
        '**Absolute Ceiling:** `VX = VY` and Rate of Climb = **0 fpm**.',
      ],
    },
    quickGate: { id: 'qgate-032', kind: 'num', askedInEasa: true, generator: 'takeoffGroundRoll' },
    acarsDebrief: {
      headline: 'PERFORMANCE 032 MODULE VERIFIED',
      rows: [
        { label: '2nd / Final Climb (2-Eng)', value: '2.4% (T/O Flaps) · 1.2% (Clean)' },
        { label: 'Jet Dry / Wet Landing', value: 'ALD ≤ 0.60 LDA (×1.67) · Wet ×1.92' },
      ],
    },
  },

  '033': {
    subjectCode: '033',
    subjectName: 'Flight Planning & Monitoring',
    accentColor: '#3b82f6',
    examQuestions: 42,
    examMinutes: 120,
    passPercent: 75,
    oneMinuteItems: [
      { num: '01', headline: 'EU-OPS Fuel Breakdown', body: 'Taxi + **Trip** + **Contingency** (max 5% trip / 5 min) + **Alternate** + **Final Reserve (30 min jets)** + Extra.' },
      { num: '02', headline: 'PET (Critical Time Point)', body: '**PET** depends ONLY on groundspeeds (**{{D × G_{{home}} // G_{{on}} + G_{{home}}}}**), ignoring fuel quantity.' },
      { num: '03', headline: 'PSR (Point of Safe Return)', body: '**PSR** depends strictly on **Safe Endurance (E)**: **{{E × G_{{on}} × G_{{home}} // G_{{on}} + G_{{home}}}}**.' },
      { num: '04', headline: 'ICAO FPL Item 10/18 Traps', body: '**S** = Std VHF/VOR/ILS; **R** = PBN (needs `PBN/` in Item 18); **45 min** before EOBT for IFPS.' },
    ],
    confusionPairs: [
      { leftTitle: 'PET (Point of Equal Time)', leftBody: 'Equal TIME to destination vs return/diversion. **Headwind shifts PET TOWARD destination** (toward wind!).', leftColor: '#38bdf8', rightTitle: 'PSR (Point of Safe Return)', rightBody: 'Farthest distance you can fly and still return with reserves. **ANY wind ALWAYS moves PSR CLOSER (less range)**!', rightColor: '#fb7185', tellApart: 'Think physics: **Any non-zero wind hurts total round-trip range** (PSR always shrinks in ANY wind); **PET shifts INTO the wind**.' },
      { leftTitle: '5% Trip Contingency', leftBody: 'Standard contingency = **max(5% trip fuel, 5 min holding @ 1,500 ft AAL)**.', leftColor: '#34d399', rightTitle: 'Final Reserve Fuel', rightBody: '**30 min** holding at 1,500 ft AAL for **Turbine jets** (**45 min** for **Piston**).' , rightColor: '#f59e0b', tellApart: '**Never dip into Final Reserve** before landing without declaring **MAYDAY FUEL**.' },
    ],
    kneeboard: {
      title: 'Flight Planning 033 Formulas',
      formulas: [
        { name: 'Point of Equal Time (PET)', formula: 'Dist_{{PET}} = {{D × GS_{{home}} // GS_{{on}} + GS_{{home}}}}   |   Time = {{Dist // GS_{{on}}}}' },
        { name: 'Point of Safe Return (PSR)', formula: 'Dist_{{PSR}} = {{Endurance × GS_{{on}} × GS_{{home}} // GS_{{on}} + GS_{{home}}}}' },
      ],
      keyNumbers: [
        { label: 'Jet / Piston Final Reserve', value: '30 min / 45 min @ 1,500 ft', note: 'EASA AMC CAT.OP.MPA.150' },
        { label: 'Fuel Penalty Rule of Thumb', value: '~3–4% Burned per Hour', note: 'Carrying extra tankered fuel costs weight' },
        { label: 'Isolated Aerodrome (Turbine)', value: '+2 hrs Fuel @ Normal Cruise', note: 'No destination alternate required' },
      ],
      memoryHooks: [
        '**Headwind or Tailwind:** PSR **ALWAYS decreases** (round trip with asymmetric legs always loses time!).',
        '**PET:** `H` in numerator (`D × H / (O + H)`) = distance shifts toward the **slower** outbound leg (into headwind).',
      ],
    },
    quickGate: {
      id: 'qgate-033',
      kind: 'sentence',
      askedInEasa: true,
      sentence: 'Compared to still air, adding a constant **30 kt tailwind outbound** (which becomes a 30 kt headwind on return) ALWAYS causes the distance to **PSR** to ___.',
      options: ['decrease', 'increase', 'stay identical', 'equal the total route distance'],
      answerIndex: 0,
      why: 'Because the headwind leg takes longer than the tailwind leg saves, average round-trip groundspeed `2×GS_out×GS_back/(GS_out+GS_back)` is ALWAYS lower than TAS — so **PSR ALWAYS decreases in any wind**.',
    },
    acarsDebrief: {
      headline: 'FLIGHT PLANNING 033 CHECK COMPLETE',
      rows: [
        { label: 'PET vs PSR in Wind', value: 'PET shifts into wind · PSR ALWAYS decreases' },
        { label: 'Turbine Reserves', value: 'Trip + 5% Cont + Alt + 30 min Final Res' },
      ],
    },
  },

  '040': {
    subjectCode: '040',
    subjectName: 'Human Performance & Limitations',
    accentColor: '#10b981',
    examQuestions: 48,
    examMinutes: 60,
    passPercent: 75,
    oneMinuteItems: [
      { num: '01', headline: 'Hypoxic Hypoxia & TUC', body: 'Low **PP O₂** at altitude. **TUC @ FL350 ≈ 30–60s** (halves during rapid decompression!).' },
      { num: '02', headline: 'Boyle’s & Henry’s Laws', body: '**Boyle’s Law** expands trapped gas (ears/sinus); **Henry’s Law** causes nitrogen bubbles (DCS).' },
      { num: '03', headline: 'Spatial Illusions', body: '**Somatogravic** (accel = false pitch up); **Coriolis** (head turn in spin = tumble); **Leans**.' },
      { num: '04', headline: 'Rasmussen & TEM', body: 'Skills (**Automatic**), Rules (**Checklists**), Knowledge (**Slow**) + Reason’s Swiss Cheese Model.' },
    ],
    confusionPairs: [
      { leftTitle: 'Hypoxic Hypoxia', leftBody: 'Insufficient partial pressure of O₂ entering lungs (**high altitude, cabin depressurization**).', leftColor: '#38bdf8', rightTitle: 'Hypemic Hypoxia', rightBody: 'Reduced O₂ carrying capacity in **blood** (**Carbon Monoxide**, anaemia).', rightColor: '#fb7185', tellApart: '**Hypoxic = Altitude air shortage**; **Hypemic = Hemoglobin blocked (CO)**.' },
      { leftTitle: 'Boyle’s Law (Gas Expansion)', leftBody: '`P × V = constant`: trapped gas in middle ear / sinuses / gut swells on **climb**.', leftColor: '#f59e0b', rightTitle: 'Henry’s Law (Gas Solution)', rightBody: 'Dissolved **Nitrogen** bubbles out in blood/joints causing decompression sickness (**Bends** — don’t dive < 24h!).', rightColor: '#a855f7', tellApart: '**Boyle = Balloons/Ears/Belly** (volume); **Henry = Bubbles in Blood** (solution).' },
    ],
    kneeboard: {
      title: 'HPL 040 Aviation Physiology & CRM Sheet',
      formulas: [
        { name: 'Dalton’s Partial Pressure Law', formula: 'P_{{O2}} = 0.21 × P_{{ambient}}   (Below **10,000 ft** supplemental O₂ begins)' },
      ],
      keyNumbers: [
        { label: 'Oxygen Fraction (Dry Air)', value: '21% (Constant to 70,000 ft)', note: 'ONLY total pressure drops!' },
        { label: 'Time of Useful Consciousness FL400', value: '12 – 20 seconds', note: 'Mask on FIRST before helping!' },
        { label: 'Scuba Diving Wait before Flying', value: '12 h (no deco) · 24 h (deco)', note: 'Prevents Nitrogen DCS bends' },
        { label: 'Night Vision Dark Adaptation', value: '30 minutes (Rods)', note: 'Destroyable instantly by white light' },
      ],
      memoryHooks: [
        '**Accelerating on a dark runway** feels like pitching **UP** (**Somatogravic** — don’t push nose into terrain!).',
        '**CO kills slowly** because haemoglobin prefers **CO >200×** stronger than O₂.',
      ],
    },
    quickGate: {
      id: 'qgate-040',
      kind: 'sentence',
      askedInEasa: true,
      sentence: 'During a dark-night go-around with high linear forward acceleration, the **otolith organs** generate a false pitch-up sensation known as the ___ illusion.',
      options: ['somatogravic', 'autokinetic', 'black hole', 'sub-threshold leans'],
      answerIndex: 0,
      why: 'Linear acceleration tilts the resultant gravitoinertial vector backward, tricking the **otoliths** into sensing **nose-up pitch (Somatogravic illusion)**.',
    },
    acarsDebrief: {
      headline: 'HPL 040 PHYSIOLOGY & CRM CHECK COMPLETE',
      rows: [
        { label: 'Rapid Decomp FL350', value: 'Don O₂ Mask immediately (TUC halved)' },
        { label: 'Night / Acceleration Trap', value: 'Trust ADI · Resist Somatogravic nose-down push' },
      ],
    },
  },

  '050': {
    subjectCode: '050',
    subjectName: 'Meteorology',
    accentColor: 'var(--subj-met)',
    examQuestions: 84,
    examMinutes: 120,
    passPercent: 75,
    oneMinuteItems: [
      { num: '01', headline: 'ISA & Tropopause', body: 'Troposphere lapses **1.98°C/1,000 ft** to **−56.5°C @ 36,090 ft**; warmer & higher at Equator.' },
      { num: '02', headline: 'Wind & Coriolis', body: '**Buys Ballot:** stand with wind at back → **LOW on LEFT (N Hem)**. Friction backs surface wind.' },
      { num: '03', headline: 'Stability (ELR vs DALR/SALR)', body: '**ELR > DALR (3°C)** = Absolutely Unstable; **ELR < SALR (1.8°C)** = Stable.' },
      { num: '04', headline: 'Fronts, Icing & Microbursts', body: 'Severe clear ice in **0° to −15°C SLD**; Warm fronts = wide stratus; Cold fronts = steep **CB/TS**.' },
    ],
    confusionPairs: [
      { leftTitle: 'Backing Wind (Surface Friction)', leftBody: 'Anticlockwise wind shift with altitude **decrease** (e.g. `270° → 240°` landing in N Hem) + lower speed.', leftColor: '#38bdf8', rightTitle: 'Veering Wind (Climbing)', rightBody: 'Clockwise wind shift when **climbing** out of the friction layer (e.g. `240° → 270°`) + stronger speed.', rightColor: '#34d399', tellApart: '**N Hem Climb = V**eer (`240 → 270`); **Surface = B**ack (`270 → 240`). Speed drops 30–50% over land.' },
      { leftTitle: 'Polar Tropopause', leftBody: 'Lower altitude (~**26,000 ft**) & **WARMER** (~−45°C) due to short cold air column.', leftColor: '#a855f7', rightTitle: 'Tropical Tropopause', rightBody: 'Much higher altitude (~**55,000 ft**) & **COLDER** (~−80°C).', rightColor: '#ec4899', tellApart: '**Tall tropical air keeps lapsing all the way to −80°C!** Poles stop early and stay warmer.' },
    ],
    kneeboard: {
      title: 'Meteorology 050 Cheat Sheet',
      formulas: [
        { name: 'Cloud Base Estimate', formula: 'Base (ft) ≈ 400 × (T − T_d)   (Spread °C × 400 ft)' },
        { name: 'Lapse Rates (per 1,000 ft)', formula: 'ISA: 1.98°C  |  DALR: 3.0°C  |  SALR: ~1.8°C  |  Dewpoint: ~0.5°C' },
      ],
      keyNumbers: [
        { label: 'Core Jet Stream Speed', value: '≥ 60 kt (Polar / Subtropical)', note: 'CAT worst on cold/low-pressure side' },
        { label: 'Clear Ice Peak Zone', value: '0°C to −15°C (SLD)', note: 'Rime: −15°C to −40°C' },
        { label: 'Pressure Lapse (MSL)', value: '~27 ft / hPa', note: '~30 ft @ 3,000 ft; ~50 ft @ 18,000 ft' },
      ],
      memoryHooks: [
        '**Cold air = lower tropopause & lower true altitude.**',
        '**Polar Jet** sits right in the **tropopause break** on the **warm side** (~FL300–FL350).',
      ],
    },
    quickGate: { id: 'qgate-050', kind: 'num', askedInEasa: true, generator: 'pressureAltitude' },
    acarsDebrief: {
      headline: 'METEOROLOGY 050 DISPATCH CHECKED',
      rows: [
        { label: 'Cloud Base', value: '400 × (OAT − Dewpoint) ft AGL' },
        { label: 'Surface Wind (N Hem)', value: 'Backs 15–30° & slows over land' },
      ],
    },
  },

  '061': {
    subjectCode: '061',
    subjectName: 'General Navigation',
    accentColor: 'var(--subj-nav)',
    examQuestions: 55,
    examMinutes: 135,
    passPercent: 75,
    oneMinuteItems: [
      { num: '01', headline: 'Great Circle vs Rhumb Line', body: 'Great Circle is shortest distance (bends toward **pole**); Rhumb cuts meridians at constant track.' },
      { num: '02', headline: 'Convergency & Conversion', body: '**Conv = ChLong × sin(Mean Lat)**; **Conversion Angle = ½ Convergency**.' },
      { num: '03', headline: 'Charts (Mercator / Lambert / Polar)', body: '**Lambert** scale constant; **Mercator** expands `sec(Lat)`; **Polar Stereo** at poles.' },
      { num: '04', headline: '1-in-60 & Wind Triangle', body: '**Track Error = {{Off-Track × 60 // Dist Gone}}**; **CADET** for compass/true conversion.' },
    ],
    confusionPairs: [
      { leftTitle: 'CADET (Compass → True)', leftBody: '**C**ompass **A**dd **E**ast (Dev/Var) to get **T**rue heading/track.', leftColor: '#f59e0b', rightTitle: 'TVMDC (True → Compass)', rightBody: '**East is Least, West is Best** going True → Magnetic → Compass.', rightColor: '#38bdf8', tellApart: '**Always check direction first**: `M → T` **Add East**; `T → M` **Subtract East**!' },
      { leftTitle: 'Great Circle Bearing', leftBody: 'Concave **toward the nearest Pole** (convex toward Equator). Lies closer to Pole than Rhumb Line.', leftColor: '#34d399', rightTitle: 'Rhumb Line', rightBody: 'Constant true track angle (**straight on Mercator**), curves toward Equator relative to Great Circle.', rightColor: '#fb7185', tellApart: '**Radio (NDB/VHF)** follows **Great Circle** — convert before plotting on **Mercator** (`± Conversion Angle`)!' },
    ],
    kneeboard: {
      title: 'General Navigation 061 Formulas',
      formulas: [
        { name: 'Departure (E–W Distance)', formula: 'Dep (NM) = ChLong (min) × cos(Lat)' },
        { name: 'Convergency & Conv Angle', formula: 'Conv = ChLong × sin(Lat_{{mean}})   |   CA = {{1 // 2}} Conv' },
        { name: 'Scale & 1-in-60 Rule', formula: 'Scale = {{Chart Length // Earth Dist}}   |   TE = {{Dist Off × 60 // Dist Gone}}' },
      ],
      keyNumbers: [
        { label: '1 NM Exact Value', value: '1,852 m = 6,076 ft', note: '1 arc-minute along Great Circle' },
        { label: 'Sun / Earth Rotation Rate', value: '15° Long / 1 hour', note: '1° Long = 4 minutes LMT' },
        { label: 'Crossing IDL West → East', value: 'Subtract 1 Calendar Day', note: 'E → W: Add 1 Calendar Day' },
      ],
      memoryHooks: [
        '**Departure uses COS(Lat)** (distance shrinks at poles); **Convergency uses SIN(Lat)** (meridians pinch at poles).',
        '**West is Best, East is Least** when converting **True → Magnetic**.',
      ],
    },
    quickGate: { id: 'qgate-061', kind: 'num', askedInEasa: true, generator: 'windComponent' },
    acarsDebrief: {
      headline: 'GENERAL NAVIGATION 061 VERIFIED',
      rows: [
        { label: 'Departure / Convergency', value: 'ChLong·cos(Lat)  /  ChLong·sin(Lat)' },
        { label: 'Time vs Longitude', value: '15° = 1 hr · 1° = 4 min LMT' },
      ],
    },
  },

  '062': {
    subjectCode: '062',
    subjectName: 'Radio Navigation',
    accentColor: '#06b6d4',
    examQuestions: 66,
    examMinutes: 90,
    passPercent: 75,
    oneMinuteItems: [
      { num: '01', headline: 'ADF / NDB Physics', body: 'MF surface wave; suffers **night effect, coastal refraction, mountain & static**.' },
      { num: '02', headline: 'VOR & DME', body: 'VHF Line-of-Sight **`1.23 (√h1 + √h2) NM`**; **VOR** uses station Magnetic Variation (site).' },
      { num: '03', headline: 'ILS Precision Approach', body: '**Localizer** (VHF `108–112 odd`, 2.5° width); **Glideslope** (UHF `329–335`, 3° path).' },
      { num: '04', headline: 'GNSS / PBN & RNP', body: '**RAIM** needs **5 sats (FD)** / **6 sats (FDE)**; **RNP** requires **on-board alerting**.' },
    ],
    confusionPairs: [
      { leftTitle: 'RNAV X Specification', leftBody: 'Area navigation **WITHOUT** required on-board performance monitoring & alerting.', leftColor: '#38bdf8', rightTitle: 'RNP X Specification', rightBody: 'Area navigation **WITH** mandatory on-board performance monitoring & alerting (e.g. RNP 1, RNP APCH).', rightColor: '#10b981', tellApart: '**RNP = RNAV + Alerting**. Number = **95% total system accuracy in NM**.' },
      { leftTitle: 'QDM (Magnetic TO)', leftBody: 'Magnetic track **TO** station (`MH + RB`, or CDI radial + 180°).', leftColor: '#f59e0b', rightTitle: 'QDR (Magnetic FROM / Radial)', rightBody: 'Magnetic radial **FROM** station.', rightColor: '#a855f7', tellApart: '**QDM = D**estination (TO) · **QDR = R**adial (FROM).' },
    ],
    kneeboard: {
      title: 'Radio Navigation 062 Quick Sheet',
      formulas: [
        { name: 'VHF / VOR / Radar Horizon', formula: 'Range (NM) = 1.23 × (√H_{{tx ft}} + √H_{{rx ft}})' },
        { name: '3° Glideslope Descent Rate', formula: 'ROD (fpm) ≈ Groundspeed (kt) × 5   |   Height ≈ 318 ft / NM' },
      ],
      keyNumbers: [
        { label: 'SSR Squawk 7700 / 7600 / 7500', value: 'Emerg / Comms / Hijack', note: 'Mode S = 24-bit ICAO address' },
        { label: 'GNSS Satellites for RAIM', value: '5 (Detect) · 6 (Exclude)', note: '4 minimum for 3D fix + clock' },
        { label: 'VOR Accuracy Overall', value: '±5° (Nominal)', note: '2× TO/FROM flag flip on beam passage' },
      ],
      memoryHooks: [
        '**75 Hijack (taken alive), 76 Radio fix, 77 Going to heaven**.',
        '**QUJ = True TO · QTE = True FROM · QDM = Mag TO · QDR = Mag FROM**.',
      ],
    },
    quickGate: {
      id: 'qgate-062',
      kind: 'sentence',
      askedInEasa: true,
      sentence: 'An **RNP 1** PBN navigation specification differs from **RNAV 1** strictly because RNP requires ___ on board the aircraft.',
      options: ['performance monitoring and alerting', 'three independent inertial units', 'dual ADF receivers', 'GLONASS ground augmentation'],
      answerIndex: 0,
      why: 'The defining hallmark of **RNP (Required Navigation Performance)** is **on-board performance monitoring and alerting**.',
    },
    acarsDebrief: {
      headline: 'RADIO NAVIGATION 062 CHECK COMPLETE',
      rows: [
        { label: 'RAIM Requirements', value: '5 Sats Fault Detect · 6 Sats FDE' },
        { label: 'ILS Width / Slope', value: 'LOC ~2.5° (dots ±2.5°) · GS 3° (±0.7°)' },
      ],
    },
  },

  '070': {
    subjectCode: '070',
    subjectName: 'Operational Procedures',
    accentColor: 'var(--subj-ops)',
    examQuestions: 42,
    examMinutes: 75,
    passPercent: 75,
    oneMinuteItems: [
      { num: '01', headline: 'All-Weather Minima (CAT I/II/III)', body: '**CAT I:** DH ≥ 200 ft, RVR ≥ 550 m. **CAT II:** DH 100–200 ft, RVR ≥ 300 m.' },
      { num: '02', headline: 'Approach Ban (1,000 ft)', body: 'Cannot continue below **1,000 ft AAL** (OM equivalent) if reported **RVR < minimum**.' },
      { num: '03', headline: 'ETOPS & Fire / Decompression', body: 'Twin-engine **EDTO 60 min** baseline (non-ETOPS). Halon 1211/1301 extinguishers for cabin/engines.' },
      { num: '04', headline: 'Wake Turbulence Separation', body: '**Heavy behind Super = 6 NM**, Medium behind Heavy = **5 NM**, Light behind Medium/Heavy = **5 / 6 NM**.' },
    ],
    confusionPairs: [
      { leftTitle: 'DA / DH (Precision ILS)', leftBody: 'Decision Altitude/Height — initiate go-around **IMMEDIATELY AT** DA/DH if visual refs missing (some sink below is factored).', leftColor: '#34d399', rightTitle: 'MDA / MDH (Non-Precision)', rightBody: 'Minimum Descent Altitude — **NEVER descend even 1 ft below** without visual contact (CDFA avoids level-off).', rightColor: '#fb7185', tellApart: '**DA** permits momentary overshoot during missed approach initiation; **MDA** is a hard floor.' },
      { leftTitle: 'Clean Aircraft Ice Concept', leftBody: 'Critical wing, tail, and control surfaces must be **completely clear** of frost/snow/ice before takeoff.', leftColor: '#38bdf8', rightTitle: 'Holdover Time (HOT)', rightBody: 'Fluid **Type II / IV** protection window — measured from **START of final anti-icing application** until takeoff roll!', rightColor: '#f59e0b', tellApart: '**HOT clock starts at fluid spray start**, NOT when de-icing truck drives away.' },
    ],
    kneeboard: {
      title: 'Operational Procedures 070 Minima',
      formulas: [
        { name: 'CAT I vs CAT II Minima', formula: 'CAT I: DH ≥ 200 ft / RVR ≥ 550 m   |   CAT II: DH 100–<200 ft / RVR ≥ 300 m' },
      ],
      keyNumbers: [
        { label: 'Approach Ban Gate', value: '1,000 ft AAL (OM)', note: 'If RVR falls below min after 1,000 ft → may continue to DA/MDA' },
        { label: 'Low-Visibility Take-Off (LVTO)', value: '400 m (Std) / 125 m / 75 m', note: 'Requires RVR in all zones' },
        { label: 'Wake Min Time (Takeoff Same RWY)', value: '2 min behind Heavy (3 min intersect)', note: 'Medium behind Super: 3 min' },
      ],
      memoryHooks: [
        '**HOT clock starts** when the **final anti-icing spray BEGINS**.',
        '**Pass 1,000 ft AAL** above RVR min → cleared to continue to DA/DH even if RVR drops afterward.',
      ],
    },
    quickGate: {
      id: 'qgate-070',
      kind: 'sentence',
      askedInEasa: true,
      sentence: 'When applying **Type IV anti-icing fluid**, the Holdover Time (HOT) begins at the ___ of the final anti-icing application step.',
      options: ['start', 'completion', 'pushback', 'runway line-up'],
      answerIndex: 0,
      why: 'Under EASA/FAA winter ops rules, **Holdover Time ALWAYS starts at the beginning of the final (anti-icing) step**, leaving maximum conservative margin.',
    },
    acarsDebrief: {
      headline: 'OPERATIONAL PROCEDURES 070 CHECK COMPLETE',
      rows: [
        { label: 'Approach Ban', value: '1,000 ft AAL gate (check RVR before)' },
        { label: 'CAT I / CAT II DH', value: '≥200 ft (550m)  /  100–<200 ft (300m)' },
      ],
    },
  },

  '081': {
    subjectCode: '081',
    subjectName: 'Principles of Flight',
    accentColor: 'var(--subj-pof)',
    examQuestions: 46,
    examMinutes: 90,
    passPercent: 75,
    oneMinuteItems: [
      { num: '01', headline: 'Lift & Dynamic Pressure', body: '**L = ½ρV²SCL**. At constant weight, slower IAS requires larger **AoA (CL)**.' },
      { num: '02', headline: 'Drag Polar & VMD', body: 'Total Drag minimizes where **Induced Drag (`1/V²`) = Parasite Drag (`V²`)**.' },
      { num: '03', headline: 'Critical AoA (~15°)', body: 'Airfoil stalls at constant critical **AoA**; turn stall speed rises as **√n**.' },
      { num: '04', headline: 'High Speed & Swept Wings', body: '**Mcrit** starts local shockwaves; **Mach Tuck** shifts CP aft; swept tips stall nose-up.' },
    ],
    confusionPairs: [
      { leftTitle: 'Positive Static Stability', leftBody: 'Initial tendency to return toward equilibrium after a disturbance.', leftColor: '#34d399', rightTitle: 'Dynamic Stability', rightBody: 'Time history of oscillations returning (**positive = damped**, negative = divergent).', rightColor: '#f59e0b', tellApart: 'An aircraft can be **Statically Positive** yet **Dynamically Negative** (growing oscillations like Dutch Roll!).' },
      { leftTitle: 'Shock Stall / Mach Tuck', leftBody: 'Normal shockwave separates flow aft of crest at **high Mach**, moving CP aft → **nose-down tuck**.', leftColor: '#38bdf8', rightTitle: 'Swept Wing Tip Stall', rightBody: 'High AoA / **low speed** tip separation moves CP **forward** → **nose-up pitch**.', rightColor: '#fb7185', tellApart: '**High Mach Tuck = Nose DOWN**; **Low-Speed Swept Stall = Nose UP**.' },
    ],
    kneeboard: {
      title: 'Principles of Flight 081 Equations',
      formulas: [
        { name: 'Lift & Stall Load Factor', formula: 'L = {{1 // 2}}ρV²SC_L   |   V_{{S,n}} = V_{{S,1G}} √n   (n = {{1 // cos φ}})' },
        { name: 'Induced Drag Scaling', formula: 'C_{{Di}} = {{C_L² // π · AR · e}}   (Wider Aspect Ratio = less induced drag!)' },
      ],
      keyNumbers: [
        { label: 'Aspect Ratio (AR)', value: 'Span² / Wing Area', note: 'High AR gliders cut wingtip vortices' },
        { label: 'Load Factor @ 60° Bank', value: '2.0 G (Stall +41%)', note: '45° bank = 1.41 G (+19% stall)' },
        { label: 'V_A (Manoeuvring Speed)', value: 'V_S × √n_limit', note: 'Heavy mass INCREASES V_A!' },
      ],
      memoryHooks: [
        '**Heavy weight INCREASES `V_A`** (stalls before structural limit only at higher speed!).',
        '**CG Aft → Less static stability, LOWER fuel burn, LOWER VS**.',
      ],
    },
    quickGate: { id: 'qgate-081', kind: 'num', askedInEasa: true, generator: 'liftEquation' },
    acarsDebrief: {
      headline: 'PRINCIPLES OF FLIGHT 081 CHECKED',
      rows: [
        { label: 'Turn Stall Speed', value: 'VS_turn = VS_1G × √(1 / cos φ)' },
        { label: 'Minimum Drag VMD', value: 'Induced = Parasite · Best Glide L/D max' },
      ],
    },
  },

  '082': {
    subjectCode: '082',
    subjectName: 'PoF — Helicopters',
    accentColor: '#14b8a6',
    examQuestions: 46,
    examMinutes: 90,
    passPercent: 75,
    oneMinuteItems: [
      { num: '01', headline: 'Dissymmetry of Lift', body: 'Forward flight makes **advancing blade** faster (`TAS + ωR`) — solved by **blade flapping**.' },
      { num: '02', headline: 'Gyroscopic Precession', body: 'Cyclic pitch applied **90° before** desired rotor disc tilt direction.' },
      { num: '03', headline: 'Translational Lift (ETL)', body: 'Above **16–24 kt**, clean undisturbed air drastically cuts induced power needed.' },
      { num: '04', headline: 'Vortex Ring State (Settling)', body: 'High ROD (**>300 fpm**), low forward speed (**<ETL**), **power on** — escape via forward cyclic!' },
    ],
    confusionPairs: [
      { leftTitle: 'Vortex Ring State (VRS)', leftBody: 'Descending into own downwash at slow speed with **power applied**. **NEVER pull collective** — fly **forward** out!', leftColor: '#fb7185', rightTitle: 'Autorotation', rightBody: 'Engine off, collective **DOWN**, upward relative airflow drives blades to keep **NR** alive.', rightColor: '#34d399', tellApart: '**VRS = Lower collective + Push forward cyclic**. **Autorotation = Flare near ground to trade NR for cushion**.' },
      { leftTitle: 'Blade Flapping', leftBody: 'Equalizes lift across advancing/retreating halves by changing effective **AoA**.', leftColor: '#38bdf8', rightTitle: 'Lead-Lag (Hunting)', rightBody: 'Compensates **Coriolis** acceleration when flapping moves blade CG closer to hub.', rightColor: '#f59e0b', tellApart: '**Flap = Up/Down (Lift symmetry)**; **Lead-Lag = Forward/Back (Conservation of angular momentum)**.' },
    ],
    kneeboard: {
      title: 'Helicopter Aerodynamics 082 Sheet',
      formulas: [
        { name: 'VRS Recognition Triad', formula: 'IAS < ETL (~20 kt)  +  ROD > 300 fpm  +  Power Applied (≥20%)' },
      ],
      keyNumbers: [
        { label: 'ETL Speed Band', value: '16 – 24 kt', note: 'Induced drag drops, nose pitches up' },
        { label: 'Gyro Phase Lag', value: '90° Ahead in Rotation', note: 'Anti-clockwise top view (US/Eur)' },
        { label: 'Translating Tendency', value: 'Tail Rotor Side Thrust', note: 'Hover with slight cyclic tilt' },
      ],
      memoryHooks: ['**VRS Escape:** *Forward cyclic first* (never flare up / never pull collective while inside vortex!).'],
    },
    quickGate: {
      id: 'qgate-082',
      kind: 'sentence',
      askedInEasa: true,
      sentence: 'When encountering **Vortex Ring State (Settling with Power)** in a single-rotor helicopter, pulling up on the collective without increasing forward airspeed will ___ the sink rate.',
      options: ['worsen (increase)', 'immediately stop', 'reverse into climb', 'convert into autorotation'],
      answerIndex: 0,
      why: 'Adding pitch feeds more air into the tip vortices, deepening the vortex ring. Fly **forward** (and lower collective if altitude permits) into clean air!',
    },
    acarsDebrief: {
      headline: 'HELICOPTER POF 082 CHECK COMPLETE',
      rows: [
        { label: 'Rotor Symmetry', value: 'Flapping fixes Lift · Lead-Lag fixes Coriolis' },
        { label: 'VRS Recovery', value: 'Forward Cyclic into ETL (>20 kt)' },
      ],
    },
  },

  '090': {
    subjectCode: '090',
    subjectName: 'VFR & IFR Communications',
    accentColor: '#6366f1',
    examQuestions: 34,
    examMinutes: 60,
    passPercent: 75,
    oneMinuteItems: [
      { num: '01', headline: 'Mandatory Readbacks', body: 'Clearances, Runway in use, Level/Heading/Speed, Altimeter **QNH**, SSR code, Freq changes.' },
      { num: '02', headline: 'Priority Calls', body: '**MAYDAY** (Distress, **×3**) > **PAN PAN** (Urgency, **×3**) > Flight Safety > Met > Regularity.' },
      { num: '03', headline: 'Comms Failure (VMC vs IMC)', body: '**VMC:** Land nearest suitable; **IMC:** Maintain last assigned **speed & level 7 min** (no radar) / 20 min.' },
      { num: '04', headline: 'VHF Range & Bands', body: '**118.000–136.975 MHz** (**8.33 kHz** spacing), line-of-sight **`1.23 (√h1 + √h2)` NM**.' },
    ],
    confusionPairs: [
      { leftTitle: 'WILCO', leftBody: '**"I understand your message and will comply"** — NEVER combine with ROGER!', leftColor: '#34d399', rightTitle: 'ROGER', rightBody: '**"I have received all of your last transmission"** — does NOT mean compliance or affirmative!', rightColor: '#38bdf8', tellApart: '**WILCO** = Will Comply. **AFFIRM** = Yes. **ROGER** = Simply heard it.' },
      { leftTitle: 'MAYDAY (Distress)', leftBody: 'Grave & imminent danger requiring **immediate assistance** (`Squawk 7700`).', leftColor: '#fb7185', rightTitle: 'PAN PAN (Urgency)', rightBody: 'Safety of craft/person concerned, **no immediate danger** yet (`Urgency` on 121.5 / active freq).', rightColor: '#f59e0b', tellApart: 'On **blind transmission**: preface **"TRANSMITTING BLIND"** twice on primary freq.' },
    ],
    kneeboard: {
      title: 'Comms 090 RTF & Failure Sheet',
      formulas: [
        { name: 'Blind Transmission Prefix', formula: '"TRANSMITTING BLIND" (×2) → Station → Callsign → Intentions' },
      ],
      keyNumbers: [
        { label: '8.33 kHz VHF Aviation Band', value: '118.000 – 136.975 MHz', note: '121.5 MHz International Distress' },
        { label: 'Readability Scale', value: '1 (Unreadable) → 5 (Perfect)', note: '3 = Difficult · 4 = Readable' },
        { label: 'SSR Failure / Emergency', value: '7600 (Comms) · 7700 (Distress)', note: '7500 Unlawful Interference' },
      ],
      memoryHooks: ['**NEVER say "ROGER WILCO"** — WILCO already implies receipt!'],
    },
    quickGate: {
      id: 'qgate-090',
      kind: 'redpen',
      askedInEasa: true,
      ask: 'Spot the **non-standard / prohibited RTF item** in this pilot readback to London Control:',
      rows: [
        { label: 'Level Clearance', value: 'Climbing Flight Level One Two Zero, Speedbird 412' },
        { label: 'QNH Altimeter', value: 'QNH 1009, Speedbird 412' },
        {
          label: 'Confirmation Phrase',
          value: 'Roger Wilco, clearing FL120, Speedbird 412',
          fix: 'WILCO (Never combine ROGER + WILCO)',
        },
        { label: 'Frequency Change', value: 'Contacting Control 132.605, Speedbird 412' },
      ],
      yes: 'Sharp ear — "Roger Wilco" is redundant/non-standard ICAO Doc 9432 RTF!',
      why: '**WILCO** itself means *"I understand and will comply"*, making **ROGER WILCO** non-standard.',
    },
    acarsDebrief: {
      headline: 'COMMS 090 RTF READBACK CHECKED',
      rows: [
        { label: 'Mandatory Readbacks', value: 'Runway, Clearances, Levels, QNH, SSR, Freqs' },
        { label: 'Failure Squawk', value: '7600 (Comms) · Maintain IMC flight plan' },
      ],
    },
  },

  '100': {
    subjectCode: '100',
    subjectName: 'KSA 100 (Knowledge, Skills & Attitudes)',
    accentColor: '#38bdf8',
    examQuestions: 0,
    examMinutes: 0,
    passPercent: 75,
    oneMinuteItems: [
      { num: '01', headline: 'FORDEC & DODAR', body: '**Facts → Options → Risks → Decide → Execute → Check** under abnormal time pressure.' },
      { num: '02', headline: 'TEM (Threat & Error Mgmt)', body: 'Proactively trap **Threats** (weather/MEL/fatigue) before crew **Errors** become **Undesired States**.' },
      { num: '03', headline: 'Mental Math & Gross Error Check', body: 'Cross-check FMC calculations via **3× Height Rule** (`TOD = Alt × 3`), **5× GS ROD**, and fuel checks.' },
      { num: '04', headline: '8 ICAO Core Competencies', body: 'Communication, Leadership/Teamwork, Problem Solving, SA, Workload Mgmt, Application of Procs.' },
    ],
    confusionPairs: [
      { leftTitle: 'Threat (TEM Model)', leftBody: 'External event/error outside crew influence needing active management (**crosswind, ATC slam-dunk, MEL item**).', leftColor: '#f59e0b', rightTitle: 'Undesired Aircraft State (UAS)', rightBody: 'Outcome after mismanaged error putting flight safety at risk (**unstable approach, altitude bust**).', rightColor: '#fb7185', tellApart: '**Threat** happens TO you; **Error** is made BY you; **UAS** is the unsafe **aircraft state**.' },
      { leftTitle: 'FMS Blind Trust', leftBody: 'Blindly flying programmed FMC constraints without raw-data/3× verification.', leftColor: '#a855f7', rightTitle: 'KSA Gross Error Check', rightBody: 'Mental check: `10,000 ft = 30 NM` (3:1 profile); `480 kt GS ≈ 8 NM/min`.', rightColor: '#34d399', tellApart: 'Always check FMS VNAV against **3× Altitude + Wind Correction**!' },
    ],
    kneeboard: {
      title: 'KSA 100 Flight Deck Mental Math',
      formulas: [
        { name: '3:1 Descent Profile & ROD', formula: 'TOD (NM) = {{ΔFL // 3}}   |   ROD (fpm) ≈ GS × 5' },
        { name: 'Minutes to Destination', formula: 'EET = {{Distance (NM) // GS / 60}} min' },
      ],
      keyNumbers: [
        { label: 'Jet Fuel Burn (A320 approx)', value: '~2,400 kg / hr (~40 kg/min)', note: 'Useful mental sanity check' },
        { label: 'Stabilized Approach Gate', value: '1,000 ft IMC / 500 ft VMC', note: 'On speed, config, glide — else Go Around!' },
      ],
      memoryHooks: ['**3 × Height + 10 NM deceleration** gets a clean jet down cleanly from FL300 (`90 + 10 = 100 NM`).'],
    },
    quickGate: {
      id: 'qgate-100',
      kind: 'sentence',
      askedInEasa: true,
      sentence: 'In the **TEM** framework, an uncommanded altitude deviation (`+400 ft above cleared FL`) caused by an overlooked altimeter cross-check is classified as a ___.',
      options: ['Undesired Aircraft State (UAS)', 'External Environmental Threat', 'Pre-flight MEL Waiver', 'Strategic Crew Immunity'],
      answerIndex: 0,
      why: 'When a crew **error** is not trapped in time and pushes the aircraft outside safe limits, it becomes an **Undesired Aircraft State (UAS)**.',
    },
    acarsDebrief: {
      headline: 'KSA 100 COMPETENCY BRIEF VERIFIED',
      rows: [
        { label: '3:1 Descent Profile', value: 'ΔFL ÷ 3 (+10 NM slow down)' },
        { label: 'TEM Shield', value: 'Trap Threats → Catch Errors → Avoid UAS' },
      ],
    },
  },
};

export function getSubjectRecallSpec(subjectCode: string): SubjectRecallSpec {
  return (
    SUBJECT_RECALL_LIBRARY[subjectCode] ||
    SUBJECT_RECALL_LIBRARY['050']
  );
}
