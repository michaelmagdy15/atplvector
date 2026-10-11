# ATPLVector Foundation Clusters Prioritized Rollout Roadmap
## Post-Vertical-Slice Roadmap Across the 13 EASA ATPL Subjects & Integrated KSA 100

**Document Version:** 1.0.0  
**Effective Date:** 2026-10-12  
**Target Syllabus:** EASA Part-FCL (ECQB 2020/2026), UK CAA (CAP 804 / ANO)  
**Governance Authority:** ATPLVector Authoring Governance & Quality Review Board  

---

## 1. Context & Baseline: The First Vertical Slice

The **First Vertical Slice** of ATPLVector established the end-to-end pedagogical and engineering architecture:
- **Vertical Slice Subject 090 (Communications - VFR & IFR):** Complete syllabus LO mapping (`data/easa090Syllabus.ts`), interactive phonetic trainer, Morse identifier decoder, readability sim, urgency/distress builder, and CPDLC trainer.
- **Vertical Slice Subject 062 (Radio Navigation Core):** Radio wave propagation, spectrum explorer, antenna theory, VDF, ADF/NDB, VOR Lab, DME, and ILS systems.
- **Vertical Slice Subject 081 / 031 (Core Dynamics):** Subsonic lift/drag models, Venturi physics, mass buildup, and CG calculation labs.

With the core engineering pipeline, Question Bank, TestFlight build (Build 28), and Cloud Run deployment verified, this roadmap establishes the structured release order for all remaining **Foundation Clusters** across the 13 ATPL subjects.

---

## 2. Prioritization Framework & Decision Matrix

Foundation clusters are prioritized based on four objective criteria:
1. **Cognitive & Curricular Dependency:** Foundational physics and environmental subjects (050 Met, 081 PoF, 021/022 AGK) must precede applied operational subjects (032 Perf, 033 FPL, 070 Ops).
2. **EASA Exam Failure Rate & Volume:** Subjects with historical pass rates below 75% in European civil aviation authorities (e.g., 010 Air Law, 050 Met, 061 Gen Nav, 032 Performance) receive immediate prioritization.
3. **Problem 9 Elimination (Regulatory Cleansing):** Urgent replacement of FAA legacy content in PPL and basic ground courses with authentic EASA SERA and Part-NCO/Part-CAT foundations.
4. **Interactive Simulator Value:** Clusters that convert difficult spatial and mathematical abstractions into tactile visual simulations (e.g. 1-in-60 drift, PBN navigation tolerances, gyroscopic precession, icing thermodynamics).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRIORITIZED ROLLOUT WAVES                       │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 1: Environmental Physics & Flight Dynamics (081 PoF, 050 Met)    │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 2: Avionics, Sensors & Airspace Cleanse (062 RadNav, 022 Inst,   │
│          010 Air Law EASA Cleanse)                                     │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 3: Human Capital, Threat Management & Cockpit (040 HPL, 100 KSA) │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 4: Aircraft Systems, Mass & Flight Limits (031 M&B, 021 AGK,     │
│          032 Performance Class A & B)                                  │
├────────────────────────────────────────────────────────────────────────┤
│ Phase 5: Applied En-Route Ops & Long-Range (061 GenNav, 033 FPL,       │
│          070 Ops Procedures)                                           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Phased Rollout Specifications

---

### Phase 1: Environmental Physics & Flight Dynamics
**Subjects:** `081 Principles of Flight (Aeroplanes)` & `050 Meteorology`  
**Duration Target:** Sprint 1–3  
**Strategic Focus:** Eliminate theoretical ambiguities in lift, drag, stability, and atmospheric pressure.

#### Foundation Clusters in Phase 1:
1. **FC-081-01: Boundary Layer, Separation & Stall Mechanics**
   - *Target LOs:* `081.01.01.00` to `081.01.03.00`
   - *Interactive Module:* Dynamic boundary layer velocity profile with transition point slider, vortex generator toggle, and stall hysteretic polar curve.
   - *WCAG 2.2 AA Focus:* Static flow vectors for reduced-motion; keyboard stepper for angle of attack $\alpha$.
2. **FC-081-02: Transonic Aerodynamics & High-Speed Flight Mechanics**
   - *Target LOs:* `081.02.01.00` to `081.02.03.00`
   - *Interactive Module:* Normal shock wave formation over aerofoil, $M_{\text{crit}}$, drag divergence Mach number ($M_{\text{DDR}}$), shock stall, and Mach tuck pitch-down visualizer.
3. **FC-050-01: Altimetry, QNH & True Altitude Thermodynamics**
   - *Target LOs:* `050.01.02.00` to `050.01.04.00`
   - *Interactive Module:* Tri-altimeter comparison lab (QNH, QFE, standard $1013.25\text{ hPa}$) with non-standard temperature gradient slider and mountain terrain clearance alert.
   - *Problem 9 Alignment:* Exclusively hectopascals (hPa); formula: $\Delta h = 4\text{ ft} / 1,000\text{ ft} / ^\circ\text{C}$ deviation.
4. **FC-050-02: Frontogenesis, Jet Streams & CAT (Clear Air Turbulence)**
   - *Target LOs:* `050.02.03.00` to `050.02.06.00`
   - *Interactive Module:* Polar front cross-section with warm, cold, and occluded conveyor belts, tropopause break, and core jet stream isotachs.

---

### Phase 2: Avionics, Sensors & Airspace Cleansing
**Subjects:** `062 Radio Navigation`, `022 AGK: Instrumentation`, `010 Air Law (EASA Cleanse)`  
**Duration Target:** Sprint 4–6  
**Strategic Focus:** Complete modern navigation, digital flight deck instrumentation, and eradicate Problem 9 FAA airspace contamination.

#### Foundation Clusters in Phase 2:
1. **FC-010-01: SERA Airspace Classification & VMC Minima (EASA Cleanse)**
   - *Target LOs:* `010.06.01.00` to `010.06.05.00`
   - *Interactive Module:* 3D Interactive European Airspace Model displaying Classes A through G with real-time VMC minima readouts in **km and meters**; explicit demonstration that **VFR flights in Class E require no clearance or radio communication**.
   - *Problem 9 Remediation:* Replace legacy FAA Class B 3-ring model and Statute Miles in `Airspace.tsx` and `AirLaw.tsx`.
2. **FC-010-02: Altimeter Setting Procedures, TA, TL & Transition Layer**
   - *Target LOs:* `010.06.06.00` to `010.06.08.00`
   - *Interactive Module:* Aerodrome departure and arrival simulator: climb passing Transition Altitude (change from aerodrome QNH to $1013.25\text{ hPa}$), descent passing Transition Level (change standard to local QNH).
3. **FC-022-01: Pitot-Static Errors & Malfunction Diagnostics**
   - *Target LOs:* `022.01.01.00` to `022.01.04.00`
   - *Interactive Module:* Interactive blockage schematic: select Pitot freeze, drain freeze, or static blockage and observe immediate response across ASI, Altimeter, and VSI during climb, descent, and level acceleration.
4. **FC-062-01: PBN (Performance-Based Navigation) & RNP Specifications**
   - *Target LOs:* `062.03.01.00` to `062.03.05.00`
   - *Interactive Module:* RNAV 5, RNAV 1, RNP 1, RNP 0.3, and RNP AR APCH lateral containment boundary visualization with FTE, PDE, and NSE error budget breakdowns.

---

### Phase 3: Human Capital, Threat Management & Cockpit Integration
**Subjects:** `040 Human Performance & Limitations`, `100 KSA (Knowledge, Skills and Attitudes)`  
**Duration Target:** Sprint 7–8  
**Strategic Focus:** Cognitive ergonomics, high-altitude physiology, TEM, and the new EASA KSA 100 mental math/decision framework.

#### Foundation Clusters in Phase 3:
1. **FC-040-01: High-Altitude Hypoxia, Gas Laws & Time of Useful Consciousness**
   - *Target LOs:* `040.02.01.00` to `040.02.03.00`
   - *Interactive Module:* Dalton's and Henry's law calculator: climb to FL410, rapid explosive decompression simulator, effective performance time (TUC) counter, and emergency descent protocol.
2. **FC-040-02: Vestibular & Visual Illusions (Somatogravic & Coriolis)**
   - *Target LOs:* `040.02.02.04` to `040.02.02.06`
   - *Interactive Module:* Sensory conflict simulator: sudden forward acceleration (false sensation of pitching up $\to$ somatogravic illusion) and sloping runway visual approach angle illusion.
3. **FC-100-01: FORDEC Decision-Making & Threat and Error Management (TEM)**
   - *Target LOs:* `100.02.03.00` and `100.03.02.00`
   - *Interactive Module:* Branching airline scenario trainer: engine oil pressure drop over alpine terrain; structured FORDEC loop (Facts, Options, Risks, Decide, Execute, Check).

---

### Phase 4: Aircraft Systems, Mass & Flight Limits
**Subjects:** `031 Mass & Balance`, `021 AGK: Airframe & Systems`, `032 Performance (Aeroplanes)`  
**Duration Target:** Sprint 9–11  
**Strategic Focus:** Complete commercial aircraft loading, systems physics, and Class A/B certified takeoff/landing charts.

#### Foundation Clusters in Phase 4:
1. **FC-031-01: EASA Part-CAT Standard Masses & Trim Sheet Generation**
   - *Target LOs:* `031.02.01.00` to `031.02.04.00`
   - *Interactive Module:* Interactive cargo and passenger manifest generator using EASA Part-CAT.POL.MAB.100 standard masses ($84\text{ kg}$ adult, $35\text{ kg}$ child, $0.80\text{ kg/L}$ Jet A-1) with drop-line trim sheet for transport jet (% MAC calculation).
2. **FC-032-01: CS-25 Transport Jet Take-off Performance ($V_1, V_R, V_2$, Balanced Field)**
   - *Target LOs:* `032.02.01.00` to `032.02.05.00`
   - *Interactive Module:* Balanced vs unbalanced field length visualizer; engine failure at $V_1$; accelerate-stop distance available (ASDA) vs take-off distance available (TODA); clearway and stopway influence.
3. **FC-021-01: Transport Category Hydraulic & Electrical Bus Architecture**
   - *Target LOs:* `021.01.02.00` and `021.02.01.00`
   - *Interactive Module:* Dual/Triple hydraulic bus interactive schematic (Blue, Green, Yellow) with PTU (Power Transfer Unit) logic and electrical generator split-bus transfer during engine flameout.

---

### Phase 5: Applied En-Route Ops, Long-Range & Exam Polish
**Subjects:** `061 General Navigation`, `033 Flight Planning & Monitoring`, `070 Operational Procedures`  
**Duration Target:** Sprint 12–14  
**Strategic Focus:** Long-range oceanic crossings, fuel policy compliance, and operational emergency handling.

#### Foundation Clusters in Phase 5:
1. **FC-061-01: The 1-in-60 Rule, Convergency & Departure Mechanics**
   - *Target LOs:* `061.01.03.00` to `061.02.01.00`
   - *Interactive Module:* Interactive navigation chart: set track gone and track required, compute drift, track error angle, and closing angle with instant mathematical step-by-step breakdown.
2. **FC-033-01: EASA Fuel Policy & Point of Equal Time (PET) / Point of Safe Return (PSR)**
   - *Target LOs:* `033.02.01.00` to `033.03.02.00`
   - *Interactive Module:* EASA Part-CAT fuel planning calculator: Taxi fuel + Trip fuel + Contingency fuel (higher of $5\%$ or $20\text{ min}$) + Alternate fuel + Final Reserve ($30\text{ min}$ holding at $1,500\text{ ft}$).
3. **FC-070-01: Special Operations: MNPS/NAT-HLA, RVSM & Polar Ops**
   - *Target LOs:* `070.02.01.00` to `070.03.02.00`
   - *Interactive Module:* North Atlantic Organised Track System (NAT-OTS) corridor planner with RVSM vertical separation ($1,000\text{ ft}$ from FL290 to FL410) and SLOP (Strategic Lateral Offset Procedures: $1\text{ NM}$ or $2\text{ NM}$ right of centerline).

---

## 4. Rollout Tracking & Quality Gates

Every foundation cluster must achieve **100% sign-off** against `docs/governance/AVIATION_REVIEWER_CHECKLIST.md` before promotion to production:

```
[Phase Backlog] ──► [Authoring per Template] ──► [SME & A11y Review Gates 1-6] ──► [Merged to Main] ──► [Live Cloud Run & TestFlight]
```

### Key Performance Indicators (KPIs) for Rollout Success:
1. **Zero Regulatory Leakage:** $0\%$ unflagged FAA content in core EASA/PPL ground school paths.
2. **Accessibility Compliance:** $100\%$ of new interactive components pass automated axe-core scans and manual keyboard navigation checks with zero contrast violations ($4.5:1$ text).
3. **Student Mastery Rate:** $>85\%$ first-time pass rate on formative cluster quizzes.
4. **Performance Budget:** $<100\text{ms}$ input latency on interactive dials and sliders across iPhone 15 Pro and iPad Air WKWebView.
