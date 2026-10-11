# ATPLVector Foundation Cluster Authoring Template
**Document Version:** 1.0.0  
**Effective Date:** 2026-10-12  
**Target Syllabus:** EASA Part-FCL (ECQB 2020/2026), UK CAA (CAP 804 / ANO), FAA 14 CFR Cross-Credit  
**Governance Authority:** ATPLVector Authoring Governance & Quality Review Board  

---

## 1. Overview & Purpose

This template defines the mandatory structural, pedagogical, regulatory, and technical standards for authoring **Foundation Clusters** across all 13 EASA ATPL subjects and integrated KSA 100. 

A **Foundation Cluster** is a self-contained learning module covering a coherent set of related Learning Objectives (LOs). Every cluster combines:
1. Grounded theoretical narrative and formula derivations.
2. An interactive visual simulation or computation tool.
3. Explicit tri-jurisdictional regulatory differentiation (EASA vs UK CAA vs FAA).
4. Cognitive trap analysis and exam distractor breakdown.
5. Formative assessment questions referenced to official ECQB codes.
6. Full WCAG 2.2 AA accessibility and responsive ergonomic compliance.

---

## 2. Cluster Metadata Specification (Frontmatter)

Every foundation cluster authored in markdown or code must provide the following standardized YAML frontmatter:

```yaml
---
cluster_id: "FC-081-01"
subject_code: "081"
subject_name: "Principles of Flight (Aeroplanes)"
cluster_title: "Subsonic Airflow, Lift Generation & Circulation"
version: "1.0.0"
status: "draft | in_review | approved | published"
author: "Author Name or ID"
reviewer: "Aviation SME Reviewer Name or ID"
regulatory_baseline:
  easa_amc: "AMC/GM to Part-FCL - Amendment 11 (ECQB 2020 / ECQB 2026)"
  uk_caa_ref: "CAP 804 / UK SERA Differences"
  faa_ref: "FAA-H-8083-25C (Pilot's Handbook of Aeronautical Knowledge), FAR Part 91"
easa_lo_mapping:
  - lo_code: "081.01.01.01"
    lo_title: "Describe the changes in static and dynamic pressure along a streamline"
    bloom_level: "Understand (K2)"
  - lo_code: "081.01.01.02"
    lo_title: "Apply Bernoulli's equation to incompressible subsonic airflow"
    bloom_level: "Apply (K3)"
  - lo_code: "081.01.02.01"
    lo_title: "Explain the generation of circulation and lift around a cambered aerofoil"
    bloom_level: "Understand (K2)"
licence_scope:
  - "ATPL(A)"
  - "CPL(A)"
  - "PPL(A)"
prerequisites:
  - "FC-050-01 (ISA Atmosphere & Gas Laws)"
estimated_study_time_minutes: 45
exam_weight_ecqb: "High (~4-6 questions per exam sitting)"
interactive_component_id: "AirflowVenturiVisualizer"
accessibility_level: "WCAG 2.2 AA Certified"
last_regulatory_audit: "2026-10-12"
---
```

---

## 3. Mandatory Cluster Architecture (Section-by-Section)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Executive Summary & Learning Objectives                  │
├─────────────────────────────────────────────────────────────┤
│ 2. Tri-Jurisdictional Regulatory Framing (EASA / UK / FAA)  │
├─────────────────────────────────────────────────────────────┤
│ 3. Core Theoretical Narrative & Formula Architecture        │
├─────────────────────────────────────────────────────────────┤
│ 4. Interactive Simulation & Tool Specification              │
├─────────────────────────────────────────────────────────────┤
│ 5. Common Student Misconceptions & ECQB Trick Questions     │
├─────────────────────────────────────────────────────────────┤
│ 6. Formative Assessment Question Bank (ECQB Format)         │
├─────────────────────────────────────────────────────────────┤
│ 7. Technical, Ergonomic & Accessibility Verification        │
└─────────────────────────────────────────────────────────────┘
```

---

### Section 1: Executive Summary & Learning Objectives

- **Target Persona:** Clearly state the pilot level (Ab-initio PPL student, CPL modular cadet, integrated ATPL candidate, or multi-crew airline captain).
- **Core Aviation Problem:** Explain *why* this knowledge is operationally vital in the cockpit (e.g. stall recognition in high-altitude cruise, QNH missetting in mountain terrain).
- **Explicit LO Checklist:** Quote verbatim the official EASA Learning Objective codes and descriptors from `data/syllabus.json`.

---

### Section 2: Tri-Jurisdictional Regulatory Framing

Authors must address **Problem 9** directly by defining regulatory applicability up front:

| Parameter | EASA Part-FCL / SERA Baseline | UK CAA Differences (Post-Brexit) | FAA 14 CFR (US FAR) Differences |
| :--- | :--- | :--- | :--- |
| **Applicable Regulation** | Regulation (EU) No 1178/2011, SERA 923/2012, Part-CAT 965/2012 | UK Air Navigation Order (ANO) 2016, UK SERA deviations, CAP 804 | 14 CFR Part 61, Part 91, Part 121 / FAA AIM |
| **Primary Units** | Metric / ICAO standard (kg, hPa, m, km, °C) | Hybrid ICAO (kg, hPa, nm, ft, °C) | US Customary (lbs, inHg, in-lbs, SM, °F/°C) |
| **Airspace / Minima** | SERA Classes A–G; VMC minima in km/m; no clearance for VFR in Class E | UK Class E/G bespoke rules; MATZ; UK Flight Information Service | FAA Classes A–E, G; VMC in Statute Miles; Class B wedding cake |
| **Altimetry Rules** | Aerodrome-specific Transition Altitude (TA); ATC-issued Transition Level (TL) | Aerodrome TA (typically 3,000–6,000 ft); regional QNH | Fixed nationwide TA = 18,000 ft MSL; TL = FL180 |
| **Standard Masses** | Part-CAT.POL.MAB.100 (Adult: 84 kg, Male: 88 kg, Female: 70 kg, Child: 35 kg) | Aligned with UK Part-CAT; winter/summer survey allowances | FAA AC 120-27F (Summer adult 190 lbs / Winter 195 lbs) |

> [!IMPORTANT]
> If a topic contains FAA legacy material (e.g. FAR 91.205 ATOMATOFLAMES, BasicMed, Statute Miles), it **must not** be presented as primary EASA content. It must either be converted to EASA Part-NCO/Part-CAT equivalents or isolated within an explicit **"FAA Differences / Cross-Credit Hub"** callout box with a `[FAA Difference]` badge.

---

### Section 3: Core Theoretical Narrative & Formula Architecture

1. **First Principles Derivation:**
   - Begin with foundational physics or regulatory treaties (e.g., Conservation of Mass $\to$ Continuity Equation $A_1 V_1 = A_2 V_2$; Bernoulli $p + \frac{1}{2}\rho v^2 = p_t$).
   - Never present a formula as an isolated magic number without defining variables, SI units, and cockpit practical approximations.

2. **Standard Formula Block Format:**
   ```latex
   \[
   L = C_L \cdot \frac{1}{2}\rho V^2 \cdot S
   \]
   ```
   - Where:
     - $L$ = Lift force (Newtons, $\text{N}$)
     - $C_L$ = Coefficient of lift (dimensionless)
     - $\rho$ = Air density ($\text{kg/m}^3$; ISA MSL standard $\rho_0 = 1.225\text{ kg/m}^3$)
     - $V$ = True Airspeed ($\text{m/s}$ in physical formula; convert to $\text{kt}$ with factor $1\text{ kt} = 0.5144\text{ m/s}$)
     - $S$ = Wing planform area ($\text{m}^2$)

3. **Cockpit Operational Rule-of-Thumb Callout:**
   - Provide the pilot's quick mental math conversion:
     > [!TIP]
     > *Cockpit Mental Math:* At low subsonic speeds, stall speed increases with the square root of load factor: $V_{S, \text{turn}} = V_S \cdot \sqrt{n}$. In a $60^\circ$ coordinated turn ($n = 2.0\text{ G}$), stall speed increases by $\sqrt{2} \approx +41\%$.

---

### Section 4: Interactive Simulation & Tool Specification

Every foundation cluster must define the technical blueprint for an accompanying interactive React/TypeScript component:

1. **Component Name & Location:** e.g., `components/PoF/AirflowVenturiVisualizer.tsx`.
2. **State & Input Parameters:**
   - Sliders/Dials with min, max, default, step, and physical units.
   - Example:
     - Constriction Ratio: 20% to 100% (step: 1%)
     - Upstream Airspeed ($V_1$): 50 kt to 250 kt (step: 5 kt)
     - Ambient Pressure ($P_1$): 900 hPa to 1050 hPa (step: 1 hPa)
3. **Mathematical Model:**
   - Exact equations executed in the React render cycle or WebGL shader.
4. **Visual Feedback & Instrumentation:**
   - Dynamic SVG or Canvas showing streamlines, pressure isobar shading, and numeric gauge readouts.
5. **Aviation Failure & Limit Modes:**
   - Explicit behavior when limits are reached (e.g. compressibility onset at $M > 0.3$, cavitation, stall separation, critical Mach drag divergence).

---

### Section 5: Common Student Misconceptions & ECQB Trick Questions

Document known pitfalls verified against historical EASA exam statistics:
- **Misconception 1:** e.g., "Equal transit time fallacy" — believing air molecules over the upper camber must rejoin molecules beneath the lower surface at the trailing edge simultaneously.
  - *Correct Physics:* Upper airflow reaches trailing edge significantly earlier due to circulation and pressure gradients.
- **Misconception 2:** e.g., Confusing pressure altitude with density altitude when temperature is below ISA.
  - *ECQB Trap:* When temperature is below ISA ($ISA - \Delta T$), density altitude is *lower* than pressure altitude.

---

### Section 6: Formative Assessment Question Bank (ECQB Format)

Authors must author 4 to 8 ECQB-compliant questions per cluster following strict EASA examination design rules:

```markdown
#### Question Item: Q081-FC01-001
- **Target LO:** `081.01.01.02`
- **Cognitive Level:** Apply (K3)
- **Question Stem:** In a subsonic, frictionless, incompressible airflow through a convergent duct, what happens to static pressure and dynamic pressure?
- **Option A (Correct):** Static pressure decreases, dynamic pressure increases.
- **Option B (Distractor - Inverted):** Static pressure increases, dynamic pressure decreases.
- **Option C (Distractor - Total Pressure Error):** Static pressure remains constant, dynamic pressure increases.
- **Option D (Distractor - Viscous Assumption):** Both static pressure and dynamic pressure decrease.
- **Explanation & Derivation:**
  According to the continuity equation for incompressible flow ($A_1 V_1 = A_2 V_2$), when the cross-sectional area $A$ decreases in a convergent duct, velocity $V$ must increase.
  According to Bernoulli's equation ($p + \frac{1}{2}\rho V^2 = \text{constant}$):
  As velocity $V$ increases, dynamic pressure $q = \frac{1}{2}\rho V^2$ increases.
  Since total pressure is constant, static pressure $p$ must decrease.
- **Official EASA Reference:** ECQB Subject 081 / ICAO Annex 14 / Regulation (EU) No 1178/2011.
```

---

### Section 7: Technical, Ergonomic & Accessibility Verification

Before submission, author must confirm:
- [ ] Accessible label on every interactive control (`aria-label` or `<label htmlFor>`).
- [ ] Keyboard stepping implemented: Arrows (fine step), PageUp/Down (coarse 10x step), Home/End (bounds).
- [ ] Direct text/number entry alternative present for precision input.
- [ ] Motion animations wrapped in `prefers-reduced-motion` fallbacks or provided with a Pause/Stop button.
- [ ] Contrast ratio $\ge 4.5:1$ for all body text against dark backgrounds (`#0F172A`, `#020617`).
- [ ] Touch targets $\ge 44 \times 44\text{ pt}$ on mobile and tablet viewports.
