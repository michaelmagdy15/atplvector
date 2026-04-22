# ATPL Vector — Agent Prompts
> Copy each prompt and give it to a fresh AI agent (Claude Code). Each is self-contained.
> Working directory: `c:\Users\Mi5a\atplvector`
> Stack: React 19 + TypeScript + Vite + Framer Motion + Recharts + Lucide React + Tailwind CSS

---

## PHASE 1 — Fix All Stubs

---

### PROMPT 1 — PoF: Flight Controls Module

```
You are working on an ATPL (Air Transport Pilot License) learning platform at c:\Users\Mi5a\atplvector.
Tech stack: React 19 + TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts.
Dark theme UI — background slate-900/950, text white/slate-300, accent colors per subject.

Your job: Replace the stub at components/PoF/PoFControl.tsx with a full interactive educational module.

CURRENT STUB (14 lines — just a placeholder):
The file exports a default React component that renders a heading and a grey paragraph. Replace it entirely.

QUALITY BAR — match the style of components/PoF/HighLiftDevices.tsx and components/PoF/AerofoilGeom.tsx:
- Tab-based navigation between sections
- SVG or canvas animations for visual concepts
- Interactive sliders/toggles that change the diagram in real time
- Info panels with EASA ATPL exam-relevant facts
- Dark theme: bg-slate-900/50, border-slate-700, text-white

CONTENT TO BUILD — EASA 081 Flight Controls:

Tab 1: Primary Controls
- Aileron, elevator, rudder — SVG aircraft diagram showing each surface moving when clicked
- Explain: direction of movement, axis of rotation (roll/pitch/yaw), effect on aircraft
- Interactive: click each control surface → highlight it on diagram + show axis animation
- Adverse yaw explanation with aileron drag comparison

Tab 2: Secondary Controls
- Trim tabs (elevator, rudder, aileron) — animated SVG showing tab deflection vs main surface
- Balance tabs, servo tabs, anti-servo tabs — visual comparison
- Differential ailerons — diagram showing unequal up/down deflection
- Frise ailerons — cross-section SVG showing leading edge down-aileron shape

Tab 3: Control Forces & Balance
- Aerodynamic balance (horn balance, inset hinge) — SVG cross sections
- Mass balance (overhanging weights) — animated flutter frequency diagram
- Control feel vs fly-by-wire explanation
- Reversibility: manual vs power-assisted vs fully powered (3-way comparison card)

Tab 4: Stability & Control Quiz
- 5 multiple-choice questions on control surfaces, balance methods, and adverse yaw
- Show correct/wrong feedback with explanation

FILE: components/PoF/PoFControl.tsx
Export: default export PoFControl
No external dependencies beyond what's already in package.json.
Do not modify any other file.
```

---

### PROMPT 2 — PoF: Flight Mechanics Module

```
You are working on an ATPL learning platform at c:\Users\Mi5a\atplvector.
Tech stack: React 19 + TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts.
Dark theme: bg-slate-900/950, accent emerald/green for PoF subject.

Your job: Replace the stub at components/PoF/PoFFlightMechanics.tsx with a full interactive module.

CONTENT TO BUILD — EASA 081 Flight Mechanics & Stability:

Tab 1: Static Stability
- Longitudinal static stability: positive/neutral/negative — animated aircraft response to pitch disturbance
- Three SVG diagrams: stick-fixed vs stick-free, Cm vs alpha curve slope
- Interactive: drag slider for CG position → watch how Cm-alpha curve slope changes
- Neutral point concept — show NP marker on aircraft side-view SVG

Tab 2: Dynamic Stability
- Phugoid oscillation: animated sinusoidal flight path (slow/long period)
- Short period oscillation: animated fast pitch oscillation
- Dutch roll: animated combined roll+yaw oscillation
- Spiral divergence: animated slowly diverging bank angle
- Use Recharts LineChart or SVG path animations to show each mode over time

Tab 3: Manoeuvring Flight
- Load factor (n) formula: n = L/W — interactive: vary bank angle → see n change
- Stall speed in a turn: Vs_turn = Vs_1g × √n — live calculator with bank angle input
- V-n (manoeuvre envelope) diagram: SVG diagram showing positive/negative stall lines, structural limit, gust line
- Interactive V-n: drag aircraft weight slider → watch envelope reshape

Tab 4: Turning Flight
- Coordinated turn geometry: bank angle, radius, rate of turn calculator
- Formulas: Rate = (g × tan θ) / V, Radius = V² / (g × tan θ)
- Input: TAS and bank angle → output: rate of turn and radius
- Standard rate turn: 3°/s — show what bank angle gives standard rate at different speeds

Tab 5: Quick Quiz (5 questions on stability modes, load factor, turns)

FILE: components/PoF/PoFFlightMechanics.tsx
Export: default export PoFFlightMechanics
Do not modify any other file.
```

---

### PROMPT 3 — PoF: High Speed Flight Module

```
You are working on an ATPL learning platform at c:\Users\Mi5a\atplvector.
Tech stack: React 19 + TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts.
Dark theme. PoF subject accent color: emerald-400/green.

Your job: Replace the stub at components/PoF/PoFHighSpeed.tsx with a full interactive module.

CONTENT TO BUILD — EASA 081 High Speed Aerodynamics:

Tab 1: Compressibility & Mach Number
- Speed of sound formula: a = √(γRT) — show how temperature changes a
- Interactive: altitude slider → show temperature → show speed of sound → show true Mach number for given TAS
- Subsonic / transonic / supersonic / hypersonic regimes — colour-coded speed scale
- Critical Mach number (Mcrit): animated wing cross-section showing where local flow first goes supersonic

Tab 2: Transonic Effects
- Shock wave formation: SVG animation of Normal shock, oblique shock, bow shock
- Wave drag coefficient spike around M=1.0 — Recharts area chart showing Cd vs Mach with drag-divergence Mach highlighted
- Shock-induced separation: animated boundary layer lifting off behind shock
- Mach tuck / nose pitch-down: explain aft CofP shift at transonic speeds

Tab 3: Swept Wings & Design
- Swept wing benefit: effective Mach = M × cos(sweep angle) — interactive sweep angle slider → show effective Mach
- Area rule (Whitcomb): SVG showing coke-bottle fuselage cross-section area distribution
- Supercritical aerofoil cross-section vs conventional: side-by-side SVG
- Winglet effect on induced drag — comparison diagram

Tab 4: High-Speed Limitations
- VMO/MMO coffin corner visualiser: SVG altitude vs speed diagram with:
  - High speed buffet boundary (MMO)
  - Low speed buffet boundary (stall Mach)
  - Operating speed shown as moveable point
- Interactive: drag altitude → watch coffin corner narrow at high altitude
- Vmo vs Mmo crossover altitude — annotated on diagram

Tab 5: Quick Quiz (5 questions on Mcrit, wave drag, swept wings, buffet)

FILE: components/PoF/PoFHighSpeed.tsx
Export: default export PoFHighSpeed
Do not modify any other file.
```

---

### PROMPT 4 — PoF: Aircraft Limitations Module

```
You are working on an ATPL learning platform at c:\Users\Mi5a\atplvector.
Tech stack: React 19 + TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts.
Dark theme. PoF accent: emerald-400.

Your job: Replace the stub at components/PoF/PoFLimitations.tsx with a full interactive module.

CONTENT TO BUILD — EASA 081 Limitations:

Tab 1: Speed Limitations
- VS, VS1, VSO, VA, VFE, VNE, VMO/MMO, VLE, VLO — card grid with each speed, definition, and typical value
- Interactive: aircraft selector (light aircraft / jet transport) → values change
- Colour-coded ASI arc diagram (SVG): white arc (flap), green arc (normal), yellow arc (caution), red line (VNE)
- VA (manoeuvring speed) formula: VA = VS1 × √n_limit — live calculator

Tab 2: Flight Envelope (V-n Diagram)
- Full V-n diagram SVG with: positive/negative stall parabolas, positive/negative structural limits, gust lines
- Annotate: VA, VB, VC, VD on speed axis
- Interactive: change max load factor slider → structural limits move
- Gust intensity toggle (light/moderate/severe) → gust envelope line shifts

Tab 3: Stall Characteristics
- CLmax and stall angle of attack (~16°) — Cl vs alpha chart with stall break
- Stall warning systems: stick shaker, artificial stall warning, natural buffet sequence
- Stall in turning flight vs straight flight (Vs × √n)
- Deep stall / superstall: T-tail aircraft geometry SVG showing pitch-lock condition
- Accelerated stall demo: interactive load factor slider → Vs_turn calculator

Tab 4: Structural Limits
- Limit load vs ultimate load (1.5× factor) — bar chart comparison
- Fatigue: cycles vs stress amplitude S-N curve (Recharts)
- G limits for different aircraft categories (Utility +4.4g/-1.76g, Normal +3.8g/-1.52g, Transport +2.5g/-1.0g)
- Manoeuvre vs gust loads — brief explanation with visual

Tab 5: Quick Quiz (5 questions on speed definitions, V-n diagram, stall speed formula)

FILE: components/PoF/PoFLimitations.tsx
Export: default export PoFLimitations
Do not modify any other file.
```

---

### PROMPT 5 — PoF: Propellers Module

```
You are working on an ATPL learning platform at c:\Users\Mi5a\atplvector.
Tech stack: React 19 + TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts.
Dark theme. PoF accent: emerald-400.

Your job: Replace the stub at components/PoF/PoFPropellers.tsx with a full interactive module.

CONTENT TO BUILD — EASA 081 Propellers:

Tab 1: Propeller Theory
- How a propeller generates thrust: aerofoil cross-section of blade element — SVG showing angle of attack, chord line, relative airflow (combination of rotational velocity + forward velocity)
- Pitch angle, blade angle, angle of attack — labeled SVG diagram
- Helix angle: tan(helix angle) = TAS / (π × D × n) — interactive RPM/TAS/diameter sliders → helix angle changes on SVG

Tab 2: Efficiency & Performance
- Propeller efficiency = Thrust power / Shaft power = (T × V) / P
- Efficiency vs advance ratio curve (Recharts) — J = V / (n × D)
- Fixed-pitch vs variable-pitch comparison: two efficiency curves on same chart
- Why efficiency peaks at one design speed then drops off

Tab 3: Variable-Pitch & CSU
- Constant Speed Unit (CSU) operation: animated schematic
  - Speeder spring vs governor flyweights
  - Underspeed → propeller fine pitch
  - Overspeed → propeller coarse pitch
- Fine pitch = low blade angle = high RPM = takeoff configuration
- Coarse pitch = high blade angle = low RPM = cruise configuration
- Feathering: blade goes to ~90° — why (OEI drag minimisation)
- Reverse pitch: how turboprop reverses thrust on landing

Tab 4: Propeller Effects
- Torque reaction: aircraft rolls opposite to propeller rotation direction — SVG showing forces
- Slipstream effect: corkscrew airflow hitting fin → yaw tendency
- P-factor (asymmetric blade effect): descending blade has higher AoA at high angle of attack → asymmetric thrust
- Gyroscopic effect: precess when pitch/yaw inputs applied
- Each effect: simple diagram + practical implication for pilot

Tab 5: Quick Quiz (5 questions on advance ratio, CSU operation, P-factor, feathering)

FILE: components/PoF/PoFPropellers.tsx
Export: default export PoFPropellers
Do not modify any other file.
```

---

### PROMPT 6 — AGK: Jet Engine Principles (Full Module)

```
You are working on an ATPL learning platform at c:\Users\Mi5a\atplvector.
Tech stack: React 19 + TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts.
Dark theme: bg-slate-900/950. AGK subject accent: orange-400/amber.

Quality reference — read components/AGK/PistonEnginePrinciples.tsx to match the tab structure, animation style, and layout. That file is 447 LOC of high-quality interactive content.

Your job: Replace the stub at components/AGK/JetEnginePrinciples.tsx (currently 39 LOC / near-empty) with a full interactive module at the same quality level as PistonEnginePrinciples.tsx.

CONTENT TO BUILD — EASA 021 Jet/Gas Turbine Engines:

Tab 1: Brayton Cycle
- Animated SVG engine cross-section: intake → compressor → combustor → turbine → nozzle
- Show pressure and temperature rising/falling through each stage
- P-V diagram and T-S diagram with Recharts (Brayton cycle annotations)
- Thermal efficiency formula: η = 1 - (T1/T2) for ideal cycle

Tab 2: Engine Types Comparison
- Turbojet vs Turbofan vs Turboprop vs Turboshaft — side-by-side SVG cross-sections
- Bypass ratio explanation: BPR = cold stream / hot stream mass flow
- High bypass (0.8:1) vs low bypass (5:1) vs ultra-high bypass (12:1) — efficiency/speed tradeoffs
- Where each type is used (fighter/airliner/regional/helicopter)

Tab 3: Compressor & Turbine
- Axial compressor: animated rotating/static blade rows, showing pressure rise per stage
- Centrifugal compressor: animated impeller with diffuser
- Turbine stages: which turbine drives which compressor (N1/N2 spool)
- Compressor stall: what causes it, what happens, how to recover
- Surge line on compressor map (pressure ratio vs mass flow — SVG)

Tab 4: Combustion Chamber
- Types: can, annular, can-annular — SVG cross-sections side by side
- Combustion zones: primary (stoichiometric), secondary (dilution), tertiary (cooling)
- Fuel-air ratio: show rich/lean limits on a bar diagram
- Relight envelope: altitude vs airspeed zone where relight is possible (Recharts)

Tab 5: Engine Performance
- Thrust formula: F = ṁ(Vj - V0) — interactive mass flow and jet velocity sliders
- Specific fuel consumption (SFC) vs altitude: SFC improves with altitude (Recharts)
- Flat-rated thrust: temperature effect — show thrust vs OAT with flat-rating cutoff
- Engine pressure ratio (EPR) and N1 as thrust indicators

Tab 6: Engine Systems
- FADEC: what it controls, failure modes, manual reversion
- Oil system schematic: pressure, scavenge, breather
- Starting sequence: ignition, fuel on, light-off detection, acceleration to idle
- Engine fire: fire loop, extinguisher bottles, shutdown checklist flow (flowchart SVG)

Tab 7: Quick Quiz (6 questions covering all tabs)

FILE: components/AGK/JetEnginePrinciples.tsx
Export: default export JetEnginePrinciples
Do not modify any other file.
```

---

## PHASE 2 — Build 032 Performance (Aeroplanes)

> Note: View enums already exist in types.ts: PERF_HOME, PERF_INTRO, PERF_AERODROME, PERF_TAKEOFF, PERF_CLIMB, PERF_CRUISE, PERF_LANDING, PERF_CLASS_B, PERF_CLASS_A
> App.tsx already routes PERF_HOME to a GenericSubjectDashboard placeholder with modules=[].
> For each new component: create in components/Performance/, then add its lazy import and route to App.tsx.

---

### PROMPT 7 — Performance: Dashboard + Intro + Class Overview

```
You are working on an ATPL learning platform at c:\Users\Mi5a\atplvector.
Tech stack: React 19 + TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts.
Dark theme. Subject 032 (Performance) accent color: lime-400/green-500.

TASK: Build the Performance subject dashboard and intro module, and wire them into the app.

STEP 1 — Create components/Performance/ folder and build PerformanceDashboard.tsx
- Style matches other dashboards (e.g. read components/AGK/AGKSystemsDashboard.tsx for reference — 105 LOC)
- Grid of module cards, each with icon, title, short description, and onClick → navigateTo(View.PERF_INTRO) etc.
- Modules to show: Intro & Classification, Takeoff Performance, Climb Performance, Cruise & Descent, Landing Performance, Performance Charts, Class A vs B, V-Speed Config, Quiz
- Subject header: lime-500 accent, TrendingUp icon

STEP 2 — Create components/Performance/PerfIntro.tsx
Content — EASA 032 Introduction & Classification:

Section 1: Performance Groups
- Class A: multi-engine turbine aircraft — highest performance requirements
- Class B: single/multi-engine propeller ≤5700 kg — simpler requirements
- Class C: aeroplanes with piston engines / old transport jets
- Card comparison grid with characteristics of each class

Section 2: Regulatory Framework
- CS-25 (Class A/B large aeroplanes) vs CS-23 (smaller aircraft)
- JAA TGL10 / EASA AMC25 reference
- Gross vs Net flight path concept: net = gross minus 1.3% gradient for twins
- Why net path? Accounts for human error and minor deterioration
- Visual: two flight paths side by side, net always below gross

Section 3: Atmospheric Effects
- ISA reference: 15°C at SL, −2°C/1000ft up to tropopause
- Density altitude: DA = Pressure Altitude + (ISA deviation × 120)
- Interactive: OAT + elevation input → calculate pressure altitude → density altitude → show % thrust/lift reduction
- Temperature effect on performance: hot/high/humid = degraded performance (3H rule)

Section 4: Key Definitions
- Flashcard grid: TORA, TODA, ASDA, LDA, EMDA, screen height, clearway, stopway
- Click each card to flip and reveal full definition + diagram

FILE: components/Performance/PerformanceDashboard.tsx — export default PerformanceDashboard
FILE: components/Performance/PerfIntro.tsx — export default PerfIntro

STEP 3 — Wire into App.tsx:
- Add lazy imports near other Performance imports
- Route currentView === View.PERF_HOME to PerformanceDashboard (replace GenericSubjectDashboard)
- Route currentView === View.PERF_INTRO to PerfIntro
- The other PERF_ views will be added by later agents — leave them as-is

STEP 4 — Wire into data/sidebarNavigation.ts:
Find the '032' subject section (or add it if absent) and add nav items:
{ label: 'Dashboard', view: View.PERF_HOME }
{ label: 'Intro & Classification', view: View.PERF_INTRO }
```

---

### PROMPT 8 — Performance: Takeoff Performance Module

```
You are working on an ATPL learning platform at c:\Users\Mi5a\atplvector.
Tech stack: React 19 + TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts.
Dark theme. Subject 032 accent: lime-400.
components/Performance/ folder already exists (created by a previous agent).

TASK: Build components/Performance/PerfTakeoff.tsx — a full interactive takeoff performance module.

CONTENT — EASA 032 Takeoff Performance:

Tab 1: V-Speed Configurator
- Interactive calculator with inputs: OAT (°C), Pressure Altitude (ft), Aircraft Weight (kg), Runway Length (m), Wind (kt headwind/tailwind), Runway Slope (%), Runway Condition (dry/wet/contaminated)
- Outputs (calculated using simplified formulas):
  - V1 (decision speed), VR (rotation speed), V2 (takeoff safety speed)
  - Display in a prominent card with large numbers
- Formula guidance: V2 ≥ 1.2 VS1 for Class A; V1 ≤ VR ≤ V2
- Show how changing inputs affects each V-speed (Recharts LineChart: weight vs V-speed)
- Highlight: V1 is not a fixed value — it's determined by the AFM performance charts

Tab 2: Field Length Requirements
- Animated SVG runway diagram showing TORA, TODA, ASDA, LDA with labeled sections
- Clearway (hatched area beyond TORA) and Stopway (RESA) shown
- Three calculations side by side:
  1. All-engines takeoff distance (TODR with all engines)
  2. Engine failure at V1 — continue (TOD using TODA)
  3. Engine failure at V1 — reject (ASD using ASDA)
- Balanced field length concept: find V1 where TOD = ASD — animated slider showing V1 moving until balance
- Interactive: input TORA/TODA/ASDA values → see which is limiting

Tab 3: Screen Height & Obstacle Clearance
- Animated side-view of takeoff showing: ground roll → rotation → lift-off → 35ft screen height → initial climb → 1st/2nd/3rd/final segment
- Show each segment's requirements: gear up (1st), flap retraction (2nd), final clean (final segment)
- 2nd segment gradient requirement: ≥2.4% (2-engine), ≥2.7% (3-engine), ≥3.0% (4-engine) — card comparison
- Obstacle clearance: 35ft at end of TODA, 50ft at screen height (US), net flight path clears obstacles by 35ft

Tab 4: Performance Factors
- Effect of weight: Recharts chart — weight vs field length (parabolic increase)
- Effect of temperature: OAT vs field length (increases with temperature)
- Effect of altitude: pressure altitude vs field length
- Effect of wind: headwind reduces TODR, tailwind increases it — formula: 50% of headwind, 150% of tailwind for unfactored
- Effect of slope: upslope increases TODR — approximately 1% slope = 10% TODR increase (rule of thumb)
- Wet runway: Recharts bar chart comparing dry vs wet vs contaminated field lengths

Tab 5: Rejected Takeoff (RTO)
- Decision making at V1: commit vs abort
- Brake energy limit: max brake energy = ½ × m × V1² — show why heavier/faster = more heat
- Accelerate-stop distance diagram: animated dot on runway decelerating to stop
- Hot brakes: why we should wait before setting parking brake after RTO

FILE: components/Performance/PerfTakeoff.tsx
Export: default export PerfTakeoff

WIRE INTO App.tsx:
- Add: const PerfTakeoff = React.lazy(() => import('./components/Performance/PerfTakeoff'));
- Add route: {currentView === View.PERF_TAKEOFF && <PerfTakeoff />}
WIRE INTO data/sidebarNavigation.ts under '032':
{ label: 'Takeoff Performance', view: View.PERF_TAKEOFF }
```

---

### PROMPT 9 — Performance: Climb Performance Module

```
You are working on an ATPL learning platform at c:\Users\Mi5a\atplvector.
Tech stack: React 19 + TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts.
Dark theme. Subject 032 accent: lime-400.
components/Performance/ folder already exists.

TASK: Build components/Performance/PerfClimb.tsx — full interactive climb performance module.

CONTENT — EASA 032 Climb Performance:

Tab 1: Climb Basics
- Climb angle formula: sin(γ) = (T - D) / W — excess thrust drives climb
- Rate of climb: ROC = (T - D) × V / W = excess power / weight
- Best angle of climb (Vx): maximum altitude gain per unit distance — where excess thrust is maximum
- Best rate of climb (Vy): maximum altitude gain per unit time — where excess power is maximum
- Interactive: power available vs power required Recharts chart — drag Vy/Vx markers
- How Vx and Vy change with altitude: converge at absolute ceiling

Tab 2: Takeoff Climb Segments (Class A)
- Animated flight path showing 4 segments:
  - 1st: gear retraction (positive climb gradient, gear up)
  - 2nd: flaps up acceleration (most critical — gradient requirements apply)
  - 3rd: acceleration to final takeoff speed with flap retraction
  - Final: clean configuration to 1500ft AGL
- Gradient requirements per segment per engine count — comparison table
- OEI (one engine inoperative) climb: net gradient vs gross gradient
- Show: why 2nd segment is most critical (low speed, high drag from flaps, engine out)

Tab 3: En-route Climb
- Drift-down procedure: animate aircraft descending after engine failure to single-engine cruise altitude
- OEI Ceiling: altitude at which climb gradient = 0 with one engine inoperative
- Interactive: weight slider → see drift-down profile change on altitude vs time chart
- Obstacle clearance during drift-down: 1000ft above highest obstacle within 5nm
- Depressurisation combined with engine failure: critical scenario explanation

Tab 4: Ceiling Types
- Service ceiling: altitude where ROC = 100 fpm
- Absolute ceiling: altitude where ROC = 0
- OEI ceiling: altitude with one engine out where ROC = 50 fpm
- Recharts: altitude vs ROC curves for all-engine and OEI, annotated with ceiling points

Tab 5: Climb Performance Factors
- Temperature effect: hotter = degraded climb performance (less thrust, less lift)
- Weight effect: heavier = reduced climb angle and rate
- Flap/gear configuration effect
- Interactive ISA calculator: input altitude + OAT deviation → show ISA temperature → density altitude

FILE: components/Performance/PerfClimb.tsx
Export: default export PerfClimb

WIRE INTO App.tsx:
- Add lazy import
- Add route: {currentView === View.PERF_CLIMB && <PerfClimb />}
WIRE INTO sidebarNavigation.ts under '032':
{ label: 'Climb Performance', view: View.PERF_CLIMB }
```

---

### PROMPT 10 — Performance: Cruise, Descent & Landing Module

```
You are working on an ATPL learning platform at c:\Users\Mi5a\atplvector.
Tech stack: React 19 + TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts.
Dark theme. Subject 032 accent: lime-400.
components/Performance/ folder already exists.

TASK A: Build components/Performance/PerfCruise.tsx — cruise & descent performance.

CONTENT — EASA 032 Cruise Performance:

Tab 1: Range & Endurance
- Range: maximum horizontal distance — achieved at best L/D speed (props) or long-range cruise (jets)
- Endurance: maximum time — achieved at minimum power/drag speed
- Specific range (SR) = V / FF (nautical miles per kg of fuel)
- Breguet range equation (simplified) — visual explanation
- Recharts: payload-range diagram with labels (max payload, max range, ferry range points)
- Effect of altitude on range: jet aircraft benefit from higher altitude (lower fuel flow)

Tab 2: Step Climb
- Why airliners step-climb: as fuel burns, aircraft gets lighter, optimal altitude increases
- Animated: show aircraft stepping up from FL310 → FL350 → FL390 as weight decreases
- Cost Index (CI) concept: CI = 0 (max range speed) vs CI = 100 (min time speed) — Recharts comparison
- ECON speed (CI-based) calculation overview

Tab 3: Descent & Approach
- Descent gradient: tan(γ) = (D - T) / W — idle descent angle
- Top of descent calculation: TOD = altitude to lose / 300 × 3 (rule of thumb: 3nm per 1000ft)
- Idle descent: fuel conservation, engine cooling considerations
- Forced landing glide: best glide speed = Vbg (same as Vx approximately)
- Descent performance factors

TASK B: Build components/Performance/PerfLanding.tsx — landing performance.

CONTENT — EASA 032 Landing Performance:

Tab 1: Approach & Threshold Speeds
- VREF = 1.3 VS0 (threshold speed, flaps full) — interactive VS0 input → VREF shown
- VApp = VREF + wind additive — input wind → VApp shown
- Decision altitude/height (DA/DH) vs Minimum Descent Altitude (MDA/MDH)
- Stabilised approach criteria: speed ±10kt, rate ±200fpm, on glidepath

Tab 2: Landing Distance
- ALD (actual landing distance) vs LDA (landing distance available)
- Factors: weight, wind, runway slope, contamination, flap setting, speed
- Wet runway factor: 1.15 × dry ALD minimum
- Recharts: weight vs landing distance parabolic curve
- Reverse thrust: effect on landing distance (shown as % reduction)

Tab 3: Go-Around Performance
- Baulked landing / missed approach gradient requirement: ≥2.1% for Class A
- Critical configuration: full flap, close to ground, engine power-up lag
- Animated flight path showing baulked landing procedure

FILE: components/Performance/PerfCruise.tsx — export default PerfCruise
FILE: components/Performance/PerfLanding.tsx — export default PerfLanding

WIRE INTO App.tsx:
- Add lazy imports for both
- Add routes: View.PERF_CRUISE → PerfCruise, View.PERF_LANDING → PerfLanding
WIRE INTO sidebarNavigation.ts under '032':
{ label: 'Cruise & Descent', view: View.PERF_CRUISE }
{ label: 'Landing Performance', view: View.PERF_LANDING }
```

---

### PROMPT 11 — Performance: Class A vs B & V-Speed Charts

```
You are working on an ATPL learning platform at c:\Users\Mi5a\atplvector.
Tech stack: React 19 + TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts.
Dark theme. Subject 032 accent: lime-400.
components/Performance/ folder already exists.

TASK A: Build components/Performance/PerfClassA.tsx — Class A aircraft performance requirements.

CONTENT — EASA 032 Class A:

Section 1: What is Class A
- Multi-engine turbine aircraft with MTOW > 5700 kg or certified for ≥10 pax
- Designed so that safe flight can continue after engine failure at any point
- All performance requirements are OEI (one engine inoperative) based

Section 2: The Four Performance Rules
1. At V1 — either continue the takeoff and clear obstacles OR reject and stop within ASDA
2. After takeoff — maintain positive gradient at screen height
3. En-route — maintain OEI cruise ceiling above terrain by required margin
4. Approach & landing — meet gradient requirements in case of baulked landing
Interactive flowchart: animated decision tree for each rule

Section 3: Takeoff Weight Limiting Factors
- Structural MTOW
- Climb-limited weight (2nd segment gradient)
- Obstacle-limited weight (net flight path vs obstacles)
- Brake energy limited weight
- Recharts bar chart: each limit as a bar, lightest = actual TOW limit

TASK B: Build components/Performance/PerfClassB.tsx — Class B aircraft performance requirements.

CONTENT — EASA 032 Class B:
- Multi-engine propeller or single engine propeller ≤ 5700 kg
- All-engines performance basis (no OEI requirement for most)
- Simpler gradient requirements
- Key speed: Vmc (minimum control speed with critical engine inoperative)
- Card comparison: Class A vs Class B requirements table

FILE: components/Performance/PerfClassA.tsx — export default PerfClassA
FILE: components/Performance/PerfClassB.tsx — export default PerfClassB

WIRE INTO App.tsx:
- Add lazy imports
- Add routes: View.PERF_CLASS_A → PerfClassA, View.PERF_CLASS_B → PerfClassB
WIRE INTO sidebarNavigation.ts under '032':
{ label: 'Class A Requirements', view: View.PERF_CLASS_A }
{ label: 'Class B Requirements', view: View.PERF_CLASS_B }
```

---

### PROMPT 12 — Performance: Interactive Performance Charts Trainer

```
You are working on an ATPL learning platform at c:\Users\Mi5a\atplvector.
Tech stack: React 19 + TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts.
Dark theme. Subject 032 accent: lime-400.
components/Performance/ folder already exists.

TASK: Build components/Performance/PerfAerodrome.tsx — the aerodrome performance charts trainer. This is the most practical exam module.

CONTENT — EASA 032 Performance Charts (Exam-critical):

Tab 1: How to Read Performance Charts
- Explanation: Pressure Altitude, Temperature, Weight, Wind, Slope are the 5 inputs
- Generic chart anatomy: axes labeled, how to enter at temperature, go up to altitude, across to weight, down to distance — step-by-step annotated diagram
- Four-panel grid: each type of chart explained (takeoff, climb, cruise, landing)

Tab 2: Interactive Takeoff Chart Simulator
- Build an SVG-based simplified JAA-style takeoff performance chart
- Temperature axis (horizontal bottom): −20°C to +50°C
- Pressure altitude lines: SL, 2000, 4000, 6000, 8000 ft
- Reference line then weight axis with wind and slope correction
- User inputs: OAT (slider), PA (dropdown), Weight (slider), Wind (slider), Slope (slider)
- Animated line trace through the chart → final TODR shown
- Show result in large number card: "Takeoff Distance Required: XXXX m"

Tab 3: Wind & Slope Corrections
- Correction cards: headwind reduces TODR by ~1% per kt (up to 50% max)
- Tailwind increases TODR by ~5% per kt
- Slope: 1% upslope ≈ +10% TODR; 1% downslope ≈ −5% TODR
- Interactive: show TODR changing in real time as wind/slope sliders move

Tab 4: Balanced Field Length Calculator
- Interactive: input TORA, TODA, ASDA and weight
- Calculate: accelerate-stop distance, accelerate-go distance
- Find balanced V1 — show graphically where the two lines cross
- Result shows: "Field limited at XXXX kg" or "Your weight is within limits"

Tab 5: Performance Quiz (6 exam-style questions using the chart reading skills)
- Each question presents a scenario with chart data and asks for TODR or limiting weight

FILE: components/Performance/PerfAerodrome.tsx
Export: default export PerfAerodrome

WIRE INTO App.tsx:
- Add lazy import
- Add route: View.PERF_AERODROME → PerfAerodrome
WIRE INTO sidebarNavigation.ts under '032':
{ label: 'Performance Charts', view: View.PERF_AERODROME }
```

---

## PHASE 3 — Build 033 Flight Planning & Monitoring

> View enums in types.ts: FLIGHT_PLAN_HOME, FLIGHT_PLAN_INTRO, FLIGHT_PLAN_FUEL, FLIGHT_PLAN_IFR, FLIGHT_PLAN_SIG_POINTS
> App.tsx routes FLIGHT_PLAN_HOME to GenericSubjectDashboard placeholder — replace it.
> Create components/FlightPlanning/ folder. Add new view enums to types.ts as needed.

---

### PROMPT 13 — Flight Planning: Dashboard + ICAO Flight Plan Builder

```
You are working on an ATPL learning platform at c:\Users\Mi5a\atplvector.
Tech stack: React 19 + TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts.
Dark theme. Subject 033 (Flight Planning) accent color: green-400/teal.

TASK A: Create components/FlightPlanning/ folder and build FlightPlanDashboard.tsx
- Module cards for: ICAO Flight Plan, Fuel Planning, ETP & PNR, ETOPS, Alternate Planning, Nav Log, In-flight Monitoring, Quiz
- Green accent theme, Map icon header

TASK B: Build components/FlightPlanning/ICAOFlightPlan.tsx — Interactive ICAO ATC Flight Plan Builder

This is the most important module in subject 033.

Section 1: The ICAO FPL Form — Interactive Item-by-Item
Build an interactive ATC flight plan form. Each item is a styled input with label and explanation tooltip:

Item 7: Aircraft Identification (callsign) — text input, 7 chars max
Item 8: Flight Rules (I/V/Y/Z) + Flight Type (S/N/G/M/X) — radio selectors with definitions
Item 9: Aircraft count, ICAO type designator, Wake turbulence (L/M/H/J) — inputs + dropdowns
Item 10: Equipment codes (COM/NAV) — multi-select checkbox grid with common codes: S, F, J1, J3, P, C, X, O, etc.
- Transponder suffix: A, C, E2, H, I, L, P, S, X — dropdown
Item 13: Departure ICAO (4 chars) + EOBT (4-digit UTC) — inputs
Item 15: Cruising speed (N0450/M082), Level (F350/A150), Route string — text input with format guide
Item 16: Destination ICAO + Total EET + Alternate 1 + Alternate 2
Item 18: Other information — expandable section with: STS/, PBN/, NAV/, COM/, DAT/, SUR/, DEP/, DEST/, REG/, EET/, SEL/, TBE/, CODE/, DLE/, OPR/, ORGN/, PER/, ALTN/, RALT/, TALT/, RIF/, RMK/
Item 19: Emergency radio, survival equipment, life jackets, dinghies, aircraft colour, remarks, PIC name

Each item: pale border by default, green border when filled, red tooltip if invalid format.

Section 2: Filed FPL Preview
- As user fills in items, show a live preview of the actual ATC FPL text format:
  (FPL-XXXXX-IS-B738/M-SDE3FGHIJ1J3J5M1RWXYZ/LB1-EGLL0900-N0450F350 DCT WAL DCT POL DCT-EGCC0115 EGKK-PBN/B1B2B3 DOF/240801...)
- Copy to clipboard button

Section 3: Common FPL Mistakes
- Flashcard grid: 8 common errors pilots make on FPLs and how to fix them

FILE: components/FlightPlanning/FlightPlanDashboard.tsx — export default FlightPlanDashboard
FILE: components/FlightPlanning/ICAOFlightPlan.tsx — export default ICAOFlightPlan

WIRE INTO App.tsx:
- Add lazy imports
- Replace View.FLIGHT_PLAN_HOME → FlightPlanDashboard (remove GenericSubjectDashboard)
- Add route: View.FLIGHT_PLAN_IFR → ICAOFlightPlan
WIRE INTO sidebarNavigation.ts — add '033' subject entry:
{ label: 'Dashboard', view: View.FLIGHT_PLAN_HOME }
{ label: 'ICAO Flight Plan', view: View.FLIGHT_PLAN_IFR }
```

---

### PROMPT 14 — Flight Planning: Fuel Planning Calculator

```
You are working on an ATPL learning platform at c:\Users\Mi5a\atplvector.
Tech stack: React 19 + TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts.
Dark theme. Subject 033 accent: green-400.
components/FlightPlanning/ folder already exists.

TASK: Build components/FlightPlanning/FuelPlanning.tsx — interactive fuel planning module.

CONTENT — EASA 033 Fuel Planning (EU-OPS/Air Ops fuel policy):

Tab 1: Fuel Policy & Components
- Fuel breakdown visualiser: stacked bar chart (Recharts BarChart) showing:
  1. Taxi fuel (ground burn before departure)
  2. Trip fuel (takeoff to landing at destination)
  3. Contingency fuel (5% of trip, or 5 min holding, whichever greater)
  4. Alternate fuel (destination to alternate aerodrome)
  5. Final reserve fuel (45 min piston / 30 min turbine at holding speed at 1500ft)
  6. Additional fuel (if needed for specific ops — ETOPS, icing, etc.)
  7. Extra fuel (PIC discretion)
- Block fuel = sum of all above

Tab 2: Interactive Block Fuel Calculator
Inputs:
- Aircraft type selector: A320 / B737 / ATR72 / generic (sets typical fuel flow values)
- Trip distance (nm): slider 50–5000nm
- Wind component (kt): −100 to +100
- Cruise level: FL250–FL430 (affects TAS and fuel flow)
- Contingency fuel policy: 5% trip / 5 min hold
- Alternate distance (nm): 0–500
- Number of alternates: 1 or 2
- Reserve policy: 30 min turbine or 45 min piston

Live outputs:
- Trip fuel (kg)
- Contingency fuel (kg)
- Alternate fuel (kg)
- Final reserve (kg)
- Block fuel (kg) — shown in large number card
- Endurance (hours:minutes)
- Takeoff fuel = Block − taxi fuel

Tab 3: Alternate Fuel Rules
- When is an alternate required? EASA rules:
  - IFR flight unless destination is isolated OR ETOPS
  - Forecast at destination ≤ 1 hour before & after ETA: ceiling < 2000ft or vis < 5km
- Isolated destination: additional final reserve replaces alternate fuel
- Two alternates: when destination has only one instrument approach
- Interactive: toggle conditions → see alternate requirement change

Tab 4: EDTO/ETOPS Fuel
- What ETOPS means: Extended operations beyond 60 minutes from diversion airport
- Extra fuel required: enough to divert to nearest ETOPS alternate, descend in ISA+10, hold 15 min, approach & land
- ETOPS fuel vs non-ETOPS comparison Recharts bar

Tab 5: Fuel Quiz (5 EASA exam-style fuel planning questions)

FILE: components/FlightPlanning/FuelPlanning.tsx
Export: default export FuelPlanning

WIRE INTO App.tsx:
- Add lazy import
- Add route: View.FLIGHT_PLAN_FUEL → FuelPlanning
WIRE INTO sidebarNavigation.ts under '033':
{ label: 'Fuel Planning', view: View.FLIGHT_PLAN_FUEL }
```

---

### PROMPT 15 — Flight Planning: ETP, PNR & ETOPS Tool

```
You are working on an ATPL learning platform at c:\Users\Mi5a\atplvector.
Tech stack: React 19 + TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts.
Dark theme. Subject 033 accent: green-400.
components/FlightPlanning/ folder already exists.

TASK: Build components/FlightPlanning/SigPoints.tsx — ETP, PNR, and ETOPS significant points module.

Note: Add View.FLIGHT_PLAN_ETP and View.FLIGHT_PLAN_PNR to types.ts if not already present (check first — View.FLIGHT_PLAN_SIG_POINTS already exists, use that for this combined module).

CONTENT — EASA 033 Significant Points:

Tab 1: Equal Time Point (ETP) — Point of Equal Time
- Definition: point where time to continue = time to return
- Formula: ETP distance from A = (D × HB) / (HF + HB)
  Where: D = total distance, HF = GS forward (home speed), HB = GS back (from B)
- Interactive calculator:
  - Inputs: Total route distance, TAS, wind component, 2 alternate airports
  - Calculates: ETP distance from departure, ETP distance from destination
  - SVG diagram: route line with ETP marker that moves as inputs change
- Multi-ETP: show engine failure ETP, pressurisation failure ETP (lower altitude = different GS)
- Why ETP changes with wind: strong headwind pushes ETP toward destination

Tab 2: Point of No Return (PNR) — Point of Safe Return
- Definition: furthest point from which aircraft can return to departure with minimum fuel reserves
- Formula: PNR = (Endurance × GS_home) / (GS_out + GS_home)
- Interactive calculator:
  - Inputs: Available fuel (kg), fuel flow (kg/hr), TAS, wind component
  - Outputs: PNR distance (nm), PNR time from departure, fuel state at PNR
  - SVG diagram: route line with PNR marker
- PNR vs ETP comparison — visual explanation of when each is relevant

Tab 3: ETOPS Significant Points
- ETOPS 60/120/180 rules: distance from adequate airport at OEI speed
- Critical fuel scenario: OEI + pressurisation failure simultaneously
- ETOPS entry/exit points on a route — SVG North Atlantic track diagram
- Adequate vs suitable airports: difference and ETOPS requirements for each
- Interactive: drag ETOPS limit ring on simplified map → see which routes become available

Tab 4: Practical Scenarios
- Three worked scenarios with step-by-step solutions:
  1. Calculate ETP for EGLL→KJFK with 50kt headwind
  2. Calculate PNR for a flight with 8000kg usable fuel
  3. Identify if a route requires ETOPS-120 or ETOPS-180 approval
- Each scenario: input blanked, user enters answer, reveal solution

FILE: components/FlightPlanning/SigPoints.tsx
Export: default export SigPoints

WIRE INTO App.tsx:
- Add lazy import
- Add route: View.FLIGHT_PLAN_SIG_POINTS → SigPoints
WIRE INTO sidebarNavigation.ts under '033':
{ label: 'ETP & PNR', view: View.FLIGHT_PLAN_SIG_POINTS }
```

---

### PROMPT 16 — Flight Planning: Navigation Log & In-Flight Monitoring

```
You are working on an ATPL learning platform at c:\Users\Mi5a\atplvector.
Tech stack: React 19 + TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts.
Dark theme. Subject 033 accent: green-400.
components/FlightPlanning/ folder already exists.

Add these view enums to types.ts if not already present:
- FLIGHT_PLAN_NAV_LOG = 'FLIGHT_PLAN_NAV_LOG'
- FLIGHT_PLAN_MONITORING = 'FLIGHT_PLAN_MONITORING'

TASK A: Build components/FlightPlanning/NavLog.tsx — interactive navigation log builder.

CONTENT — EASA 033 Navigation Log:

Tab 1: Navigation Log Builder
- Spreadsheet-style table with columns: Waypoint, Freq, MT (magnetic track), VAR, TH (true heading), TAS, W/V (wind velocity), GS (groundspeed), Dist, ETE (estimated time enroute), ETA, ATA, Fuel used
- Add/remove rows (waypoints)
- Auto-calculate: TH = MT − variation, GS from TAS + wind, ETE = Dist / GS
- Wind correction angle calculated using vector formula
- Running fuel total column
- Print/export preview button (styled like actual nav log form)

Tab 2: How to Compute Track & Heading
- 1-in-60 rule for wind correction: WCA ≈ (wind speed × sin(wind angle)) / TAS × 60
- Interactive: TAS slider, wind speed + direction sliders → watch WCA calculate and animate on SVG compass rose
- Multi-leg example with worked solution

TASK B: Build components/FlightPlanning/InFlightMonitoring.tsx

CONTENT — EASA 033 In-Flight Fuel & Track Monitoring:

Tab 1: Fuel Monitoring
- "Is the fuel on plan?" — comparison tool: planned fuel vs actual fuel remaining
- Re-calculating ETA and fuel on arrival based on current position + wind update
- FUEL imbalance procedure if actual < planned by >5%
- Recharts LineChart: planned fuel vs time with actual fuel points plotted

Tab 2: Track Monitoring & STAR
- Track keeping: cross-track error (XTE) — definition and correction formula
- Closing angle: track error × 2 for intercept
- 1-in-60 rule for track correction: 1° off track at 60nm = 1nm displacement
- Revised ETA calculation after position fix: new GS from fix to destination

Tab 3: Diversion Decision
- Diversion planning checklist: closest suitable airport, fuel check, weather check, ATC notification
- Quick mental diversion calculation: bearing from fix, distance, fuel required vs available
- Practice scenario: presented with current position, fuel, weather → decide continue or divert

FILE: components/FlightPlanning/NavLog.tsx — export default NavLog
FILE: components/FlightPlanning/InFlightMonitoring.tsx — export default InFlightMonitoring

WIRE INTO App.tsx:
- Add lazy imports
- Add routes: View.FLIGHT_PLAN_NAV_LOG → NavLog, View.FLIGHT_PLAN_MONITORING → InFlightMonitoring
WIRE INTO sidebarNavigation.ts under '033':
{ label: 'Navigation Log', view: View.FLIGHT_PLAN_NAV_LOG }
{ label: 'In-flight Monitoring', view: View.FLIGHT_PLAN_MONITORING }
```

---

## PHASE 4A — AGK: Missing Systems

---

### PROMPT 17 — AGK: Pressurisation, ECS, and Oxygen Systems

```
You are working on an ATPL learning platform at c:\Users\Mi5a\atplvector.
Tech stack: React 19 + TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts.
Dark theme. AGK subject 021 accent: orange-400/amber.
Quality reference: read components/AGK/ElectricsSystem.tsx (439 LOC) for layout/animation style.

Add these view enums to types.ts:
- AGK_PRESSURISATION = 'AGK_PRESSURISATION'
- AGK_OXYGEN = 'AGK_OXYGEN'

TASK A: Build components/AGK/PressurisationSystem.tsx

CONTENT — EASA 021 Pressurisation & Air Conditioning:

Tab 1: Pressurisation Basics
- Why pressurised? Cabin altitude kept at ≤8000ft even when aircraft is at FL400
- Animated cross-section of fuselage showing: bleed air in, outflow valve out
- Cabin altitude vs flight altitude Recharts chart — cabin steps up slowly while aircraft climbs
- Differential pressure: ΔP = aircraft altitude pressure − cabin pressure
- Max differential pressure (typically 8.35 PSI for commercial jets) — bar gauge visual

Tab 2: System Components (Animated Schematic)
- Bleed air source → air conditioning packs → mix manifold → distribution → outflow valve → safety valve
- Each component: click to highlight + show description panel
- Outflow valve: motorised butterfly valve — shown open/partially open/closed
- Safety valve: pneumatic — opens if differential exceeds structural limit
- Negative pressure relief valve: opens if external pressure > cabin pressure (on descent)

Tab 3: Pressurisation Modes & Failures
- Pressurisation controller: schedules cabin altitude to match flight profile
- Isobaric mode (constant cabin altitude) vs constant differential mode
- Rapid decompression: explosive vs rapid vs gradual — time of useful consciousness (TUC) chart
- TUC vs altitude: FL250=3-5min, FL300=45-90sec, FL350=30-60sec, FL400=15-20sec
- Emergency descent procedure: animated aircraft diving from FL390 to FL100

Tab 4: Oxygen Systems
- Gaseous oxygen: high-pressure cylinders, diluter-demand masks, continuous flow masks
- Chemical oxygen generators (passenger masks): NaClO3 + Fe → O2, lasts 15 min
- Portable oxygen: therapeutic, first aid
- Oxygen requirements by altitude (EU-OPS): crew supplemental O2 rules
- Interactive: altitude selector → show O2 requirement for crew and passengers

TASK B: Build components/AGK/FuelSystem.tsx

Add view enum AGK_FUEL = 'AGK_FUEL' to types.ts.

CONTENT — EASA 021 Fuel Systems:
- Fuel tank types: integral, bladder, rigid — cross-section SVGs
- Transfer system: gravity feed, pump feed, crossfeed valve
- Fuel management: sequence of tank usage, centre of gravity effects
- Fuel jettison system: why, how, where (height requirement before jettisoning)
- Fuel measurement: capacitance gauges vs float gauges
- Fuel contamination: water in fuel — drain points, FQIS test
- Recharts: typical fuel tank arrangement for wide-body (centre + wing tanks)

FILE: components/AGK/PressurisationSystem.tsx — export default PressurisationSystem
FILE: components/AGK/FuelSystem.tsx — export default FuelSystem

WIRE INTO App.tsx:
- Add lazy imports
- Add routes: AGK_PRESSURISATION → PressurisationSystem, AGK_FUEL → FuelSystem
WIRE INTO sidebarNavigation.ts under '021':
{ label: 'Pressurisation & ECS', view: View.AGK_PRESSURISATION }
{ label: 'Fuel System', view: View.AGK_FUEL }
```

---

### PROMPT 18 — AGK: Fire, Ice Protection & APU

```
You are working on an ATPL learning platform at c:\Users\Mi5a\atplvector.
Tech stack: React 19 + TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts.
Dark theme. AGK accent: orange-400.

Add view enums to types.ts:
- AGK_FIRE = 'AGK_FIRE'
- AGK_ICE = 'AGK_ICE'
- AGK_APU = 'AGK_APU'

TASK A: Build components/AGK/FireProtection.tsx

CONTENT — EASA 021 Fire Detection & Suppression:

Tab 1: Fire Detection
- Fire zones: engine nacelles, APU, cargo holds, lavatories, wheel wells
- Detection types: thermistor loop (continuous element), spot detector, smoke detector, optical sensor
- Animated: fire loop around engine nacelle showing temperature rise → loop resistance change → alarm
- Single vs dual loop: single = warning, dual = more reliable / arming condition for extinguisher
- False fire: distinguish from actual fire (cross-check procedures)

Tab 2: Fire Extinguishing
- Engine fire: squib + Halon 1301 bottle → discharged into nacelle
- Bottle 1 (arm) and Bottle 2 (second shot): discharge switches
- APU fire: single bottle, automatic discharge on ground if fire detected
- Cargo: high-rate discharge + low-rate flooding (keeps cargo below ignition temp)
- Lavatory: automatic heat-activated extinguisher over waste bin

Tab 3: Crew Procedures (Animated Flowchart)
- Engine fire on ground: animated checklist flow (FIRE → FIRE HANDLE PULL → ROTATE → DISCHARGE)
- Engine fire in flight: same + emergency descent consideration
- Smoke in cockpit: masks on, 100% oxygen, source identification flow

TASK B: Build components/AGK/IceProtection.tsx

CONTENT — EASA 021 Ice & Rain Protection:
- Anti-ice vs de-ice: anti-ice prevents formation, de-ice removes after formation
- Wing anti-ice: bleed air system — animated SVG showing bleed air flowing through wing leading edge piccolo tube
- Engine anti-ice: inlet lip heated by bleed air
- Probe heat: pitot, static, TAT, AOA probes — electric heating element
- Window heat: electrically heated windshields
- Types of airframe icing: clear (glaze), rime, mixed — cross-section comparisons
- Performance effects: 30% drag increase, 40% lift reduction with serious icing
- SLD (Supercooled Large Droplets): why certification matters for new aircraft

TASK C: Build components/AGK/APUSystem.tsx

CONTENT — EASA 021 APU:
- Purpose: ground power (electrical + pneumatic) without external GPU/air start cart
- APU Bleed: used for air conditioning packs on ground, engine start, pressurisation if needed
- APU Generator: replaces engine generators on ground, emergency backup in flight
- APU limitations: start envelope (altitude/temperature), max bleed altitude, max electrical altitude
- Animated: APU startup sequence — oil pressure, EGT rise, governor stabilise, AVAIL light

FILE: components/AGK/FireProtection.tsx — export default FireProtection
FILE: components/AGK/IceProtection.tsx — export default IceProtection
FILE: components/AGK/APUSystem.tsx — export default APUSystem

WIRE INTO App.tsx + sidebarNavigation.ts under '021':
{ label: 'Fire Protection', view: View.AGK_FIRE }
{ label: 'Ice Protection', view: View.AGK_ICE }
{ label: 'APU System', view: View.AGK_APU }
```

---

## PHASE 4B — Expand General Navigation (061)

---

### PROMPT 19 — GenNav: Magnetism, Compass & Compass Errors

```
You are working on an ATPL learning platform at c:\Users\Mi5a\atplvector.
Tech stack: React 19 + TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts.
Dark theme. GenNav subject 061 accent: cyan-400/blue.
Quality reference: read components/GenNav/EarthGeometry.tsx (204 LOC) for style.

Add view enums to types.ts:
- GEN_NAV_MAGNETISM = 'GEN_NAV_MAGNETISM'
- GEN_NAV_COMPASS = 'GEN_NAV_COMPASS'

TASK A: Build components/GenNav/Magnetism.tsx

CONTENT — EASA 061 Magnetism:

Tab 1: Earth's Magnetic Field
- Geographic North Pole vs Magnetic North Pole — animated globe SVG showing both poles
- Magnetic variation (declination): angle between true north and magnetic north
- Isogonal lines: lines of equal magnetic variation — simplified world map SVG with isogonals
- Agonic line (zero variation): shown on map
- Variation formula: Magnetic heading = True heading + West variation (or − East variation)
- Interactive: globe spinner + location selector → show local variation + calculation

Tab 2: Aircraft Magnetism
- Hard iron deviation: fixed magnetic fields from aircraft structure
- Soft iron deviation: induced magnetism from surrounding fields
- Deviation card: table showing compass error on each heading
- Compass swing: procedure to measure and record deviation
- CDMVT mnemonic: Compass → Deviation → Magnetic → Variation → True (and reverse)
- Interactive CDMVT calculator: enter any two values → solve for the rest

Tab 3: Magnetic Dip
- Dip angle: angle between magnetic force vector and horizontal
- Dip increases toward magnetic poles: near equator = 0°, at pole = 90°
- Effect on compass: creates northerly turning error and acceleration error
- Interactive globe: move aircraft position → show dip angle changing

TASK B: Build components/GenNav/CompassErrors.tsx

CONTENT — EASA 061 Compass Errors:

Tab 1: Acceleration & Deceleration Errors (ANDS/SLUD)
- ANDS: Accelerate → North (in northern hemisphere) → Deviation South
- SLUD: Slow → South → Deviation Up... wait, use: Accelerate North Decelerate South
- Animated: aircraft on easterly/westerly heading → accelerate → watch compass swing
- Why it happens: dip pulls pendulously-suspended card forward/backward
- Magnitude: greatest on E/W headings, zero on N/S

Tab 2: Turning Errors (NOSE/UNOS)
- Northerly turning error (NTE): when turning through North, compass LAGS
- Southerly turning error (STE): when turning through South, compass LEADS
- Animated: compass rose + aircraft turning through N → compass swings incorrectly
- Interactive: set initial heading + turn direction → watch compass error develop
- Rules: lead the roll-out when turning to North, roll out late when turning to South

Tab 3: Other Compass Errors
- Index error: misalignment of lubber line
- Oscillation error: turbulence causing card to swing
- Magnetic anomalies: large iron deposits below aircraft
- Heeling error: banking changes dip influence

FILE: components/GenNav/Magnetism.tsx — export default Magnetism
FILE: components/GenNav/CompassErrors.tsx — export default CompassErrors

WIRE INTO App.tsx + sidebarNavigation.ts under '061':
{ label: 'Earth Magnetism', view: View.GEN_NAV_MAGNETISM }
{ label: 'Compass Errors', view: View.GEN_NAV_COMPASS }
```

---

### PROMPT 20 — GenNav: Dead Reckoning & In-Flight Navigation

```
You are working on an ATPL learning platform at c:\Users\Mi5a\atplvector.
Tech stack: React 19 + TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts.
Dark theme. GenNav 061 accent: cyan-400.
components/GenNav/ folder already exists.

Add view enums to types.ts:
- GEN_NAV_DR = 'GEN_NAV_DR'
- GEN_NAV_FIXES = 'GEN_NAV_FIXES'

TASK A: Build components/GenNav/DeadReckoning.tsx

CONTENT — EASA 061 Dead Reckoning Navigation:

Tab 1: DR Fundamentals
- DR position = last known position + heading × TAS × time + wind effect
- Track vs heading: wind causes drift angle → aircraft tracks differently than it points
- True track, magnetic track, true heading, magnetic heading — labeled SVG vector diagram
- Drift: wind component perpendicular to track causes drift
- Wind correction angle: WCA = (wind speed × sin(relative wind angle)) / TAS × 57.3
- Interactive: set TAS, wind speed, wind direction → animated triangle shows WCA on SVG

Tab 2: Triangle of Velocities
- Three vectors: TAS (heading), Wind (W/V), Track+GS (track made good)
- Interactive SVG: drag wind vector → track and GS vectors update in real time
- Dead reckoning exercise: given departure fix, TH, TAS, W/V, time → plot DR position
- 1-in-60 rule: 1° of track error = 1nm displacement per 60nm flown

Tab 3: DR Accuracy & Errors
- Cumulative DR error over time
- Effect of incorrect wind forecast on DR position
- Opening error: track error grows with distance
- Closing error: to correct, use double track error angle
- DR position box: larger box = less certain position

TASK B: Build components/GenNav/InFlightNav.tsx

CONTENT — EASA 061 In-Flight Navigation & Fixes:

Tab 1: Position Fixing Methods
- Visual fix: 2 landmarks — cross-bearing technique on SVG chart
- Radio fix: VOR bearing + DME → position circle and arc intersect
- VOR/VOR cross-bearing: two VOR radials crossing → fix
- DME/DME: two distance arcs crossing → two possible positions (use DR to resolve ambiguity)
- Recharts or SVG: animated chart showing fix types

Tab 2: Updating the DR Position
- Running fix: two bearings of same station at different times + aircraft movement
- How to advance a position line: move the first bearing forward using heading × time × GS
- Cocked hat: three position lines that don't meet exactly — take most dangerous position

Tab 3: Navigation in Climb & Descent
- Effect of climb/descent on time and distance calculations
- Mean GS during climb: use average between climb GS and cruise GS
- TOC (top of climb) calculation: distance to climb = altitude to climb / climb gradient
- TOD (top of descent) calculation: distance = altitude to lose / 300 (3° glidepath rule)

Tab 4: Mental Navigation Quiz (5 problems)
- Problem 1: calculate DR position after 45 min with given TH/TAS/W/V
- Problem 2: calculate WCA for given wind and track
- Problem 3: identify correct position line from VOR fix
- Problem 4: TOD calculation
- Problem 5: 1-in-60 rule track correction

FILE: components/GenNav/DeadReckoning.tsx — export default DeadReckoning
FILE: components/GenNav/InFlightNav.tsx — export default InFlightNav

WIRE INTO App.tsx + sidebarNavigation.ts under '061':
{ label: 'Dead Reckoning', view: View.GEN_NAV_DR }
{ label: 'In-Flight Fixes', view: View.GEN_NAV_FIXES }
```

---

## PHASE 5 — Platform Polish & Launch Prep

---

### PROMPT 21 — Platform: Question Bank Population for 032 & 033

```
You are working on an ATPL learning platform at c:\Users\Mi5a\atplvector.
Tech stack: React 19 + TypeScript, Tailwind CSS.

Your task: Add exam-style questions for subjects 032 (Performance) and 033 (Flight Planning) to the question bank system.

STEP 1: Read the question bank data structure by examining:
- lib/qb_storage.ts
- components/QB_Dashboard.tsx
- components/QB_Setup.tsx
Understand the question data format (id, subject, question text, options A/B/C/D, correct answer, explanation).

STEP 2: Create data/questions_032_performance.ts
Add 30 EASA-style multiple choice questions covering:
- V-speed definitions and formulas (V1, VR, V2, VS, VNE, VMO)
- Field length calculations (TORA/TODA/ASDA/LDA)
- Climb gradient requirements (2nd segment per engine count)
- Class A vs Class B requirements
- Performance factors (weight, temperature, altitude, wind, slope)
- Net vs gross flight path
- Landing distance requirements

Format: match the existing question format in the codebase.

STEP 3: Create data/questions_033_flight_planning.ts
Add 25 EASA-style multiple choice questions covering:
- ICAO flight plan items (format, content)
- Fuel planning components and formulas
- Contingency fuel rules
- ETP and PNR formulas and calculations
- ETOPS requirements
- Alternate fuel requirements and rules
- In-flight fuel monitoring

STEP 4: Register both question sets in the question bank index (wherever existing subjects are registered — find the pattern from existing data files).

Do not modify any UI component files.
```

---

### PROMPT 22 — Platform: Performance & Sidebar Navigation Audit

```
You are working on an ATPL learning platform at c:\Users\Mi5a\atplvector.
Tech stack: React 19 + TypeScript, Tailwind CSS.

Your task: Audit and clean up the sidebar navigation and subject coverage.

STEP 1: Read data/sidebarNavigation.ts in full.
Verify that all of these subjects have sidebar entries:
- '010' Air Law
- '021' AGK Systems (and all new modules added by previous agents)
- '022' Instrumentation
- '031' Mass & Balance
- '032' Performance (and all modules: PERF_INTRO, PERF_TAKEOFF, PERF_CLIMB, PERF_CRUISE, PERF_LANDING, PERF_CLASS_A, PERF_CLASS_B, PERF_AERODROME)
- '033' Flight Planning (and all modules: FLIGHT_PLAN_IFR, FLIGHT_PLAN_FUEL, FLIGHT_PLAN_SIG_POINTS, FLIGHT_PLAN_NAV_LOG, FLIGHT_PLAN_MONITORING)
- '040' HPL
- '050' Meteorology
- '061' General Navigation (and all new modules: GEN_NAV_MAGNETISM, GEN_NAV_COMPASS, GEN_NAV_DR, GEN_NAV_FIXES)
- '062' Radio Navigation
- '070' Ops Procedures
- '081' Principles of Flight (including all 5 stub-replaced modules)
- '090' Communications
- '100' KSA

STEP 2: For any missing entries, add them following the exact pattern of existing entries.

STEP 3: Read types.ts and verify all view enums used in sidebarNavigation.ts actually exist.
If any view enum is referenced in the sidebar but missing from types.ts, add it.

STEP 4: Read App.tsx and verify that every View enum value used in sidebarNavigation.ts has a corresponding route in App.tsx.
List any that are missing (do not add them — just report).

Output a summary of what you added and what routes are still missing.
```

---

> **How to use these prompts:**
> Give each numbered prompt to a fresh Claude Code agent in the terminal.
> Complete them in order — later agents depend on files created by earlier ones.
> After each agent finishes, run `npm run build` to verify no TypeScript errors before starting the next.
