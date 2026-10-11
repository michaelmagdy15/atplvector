# ATPLVector Aviation Reviewer Checklist
**Document Version:** 1.0.0  
**Effective Date:** 2026-10-12  
**Target Syllabus:** EASA Part-FCL (ECQB 2020/2026), UK CAA (CAP 804 / UK ANO), FAA 14 CFR Cross-Credit  
**Applicability:** Subject Matter Experts (SMEs), Chief Flight Instructors (CFIs), Regulatory Auditors, Lead Engineers  

---

## 1. Review Governance & Stage-Gate Flow

No learning cluster or interactive simulator may be merged to `main` or deployed to production (`https://atplvector.com` or Apple TestFlight `com.atplvector01.app`) without completing the **Six-Gate Review Protocol**:

```
[Author Submission]
       │
       ▼
┌──────────────────────────────────────────────┐
│ Gate 1: Regulatory Scope & Citation Veracity │
└──────────────────────┬───────────────────────┘
                       │ PASS
                       ▼
┌──────────────────────────────────────────────┐
│ Gate 2: Technical & Aerodynamic Accuracy     │
└──────────────────────┬───────────────────────┘
                       │ PASS
                       ▼
┌──────────────────────────────────────────────┐
│ Gate 3: Unit Discipline & Tri-Jurisdiction   │
└──────────────────────┬───────────────────────┘
                       │ PASS
                       ▼
┌──────────────────────────────────────────────┐
│ Gate 4: Simulation & Dynamic Gauge Fidelity  │
└──────────────────────┬───────────────────────┘
                       │ PASS
                       ▼
┌──────────────────────────────────────────────┐
│ Gate 5: ECQB Question Stem & Distractor Logic│
└──────────────────────┬───────────────────────┘
                       │ PASS
                       ▼
┌──────────────────────────────────────────────┐
│ Gate 6: Universal Accessibility & Ergonomics │
└──────────────────────┬───────────────────────┘
                       │ PASS
                       ▼
            [Signed Off & Published]
```

---

## 2. The Six Review Gates

### Gate 1: Regulatory Scope & Citation Veracity

- [ ] **EASA Part-FCL LO Mapping:**
  - Every learning point is mapped to a valid 8-digit EASA ECQB LO code (e.g., `081.01.01.01`).
  - No orphaned learning objectives or unreferenced assertions.
  - Aligns with latest ECQB 2020 / ECQB 2026 amendments (Regulation (EU) No 1178/2011, AMC/GM).
- [ ] **SERA Standardised Rules of the Air:**
  - Operational rules cite Regulation (EU) No 923/2012 (SERA), not superseded national codes.
- [ ] **Part-CAT / Commercial Air Transport Scope:**
  - Air transport operations reference Regulation (EU) No 965/2012 (Part-CAT, Part-SPA, Part-NCC, Part-NCO).
- [ ] **PBN / ICAO Doc 9613 Compliance:**
  - RNP/RNAV specifications, RNP APCH, RNP AR APCH, and sensor standards align with ICAO Doc 9613 and EASA CS-ACNS.

---

### Gate 2: Technical, Mathematical & Aerodynamic Accuracy

- [ ] **Physical Laws & Atmosphere Standards:**
  - ISA baseline parameters explicitly respected:
    - Sea level temperature $T_0 = +15^\circ\text{C}$ ($288.15\text{ K}$).
    - Sea level pressure $p_0 = 1013.25\text{ hPa}$.
    - Sea level density $\rho_0 = 1.225\text{ kg/m}^3$.
    - Temperature lapse rate = $1.98^\circ\text{C} / 1,000\text{ ft}$ ($0.65^\circ\text{C} / 100\text{ m}$) up to Tropopause ($36,090\text{ ft} / 11,000\text{ m}$), isothermal at $-56.5^\circ\text{C}$ up to $65,617\text{ ft} / 20,000\text{ m}$.
- [ ] **Aerodynamic Relations:**
  - Lift, drag, pitching moment, compressibility ($M_{\text{crit}}$, shock stall, Mach tuck) formulas mathematically sound.
  - Polar diagrams, $C_L$ vs $\alpha$, $C_D$ vs $\alpha$, drag curves ($D_{\text{total}} = D_{\text{induced}} + D_{\text{parasite}}$) reflect correct asymptotes and minima.
- [ ] **Mass & Balance Math:**
  - Center of Gravity calculations use standard formulas:
    $$\text{CG Position} = \frac{\text{Total Moment}}{\text{Total Mass}}$$
    $$\% \text{MAC} = \frac{\text{Distance from LEMAC to CG}}{\text{MAC Length}} \times 100$$
  - Shift mass formula: $\Delta \text{CG} = \frac{m \cdot d}{M_{\text{total}}}$.
- [ ] **Navigation & Triangle of Velocities:**
  - $1\text{ in }60$ rule verified: Track Error $(\text{deg}) = \frac{\text{Distance Off Track}}{\text{Distance Gone}} \times 60$.
  - Convergency formula: $\text{Convergency} = \Delta \text{Longitude} \times \sin(\text{Mean Latitude})$.
  - Departure formula: $\text{Departure (NM)} = \Delta \text{Longitude (min)} \times \cos(\text{Latitude})$.

---

### Gate 3: Unit Discipline & Tri-Jurisdiction (Addressing Problem 9)

Reviewers must rigorously verify unit discipline and jurisdictional segregation:

- [ ] **Altimetry Units:**
  - Primary EASA syllabus: **Hectopascals (hPa)**.
  - Altimeter sub-scale labeled as hPa (e.g. $1013\text{ hPa}$).
  - Millibars (mb) acceptable only as historical synonym ($1\text{ mb} = 1\text{ hPa}$).
  - Inches of mercury (**inHg**) must **only** appear in US FAA difference sections with explicit conversion callouts ($1\text{ inHg} \approx 33.8639\text{ hPa}$; $29.92\text{ inHg} = 1013.25\text{ hPa}$).
- [ ] **Transition Altitude vs Transition Level:**
  - Explains that under EASA/SERA, Transition Altitude (TA) is published on aerodrome charts (e.g., $3,000\text{ ft}$ to $6,000\text{ ft}$, or up to $10,000\text{ ft}$ in alpine areas).
  - Transition Level (TL) is calculated and assigned by ATC / ATIS based on current local QNH.
  - Transition Layer is the airspace between TA and TL where cruising flight is prohibited.
  - Contrasts clearly with FAA airspace where TA is fixed nationwide at $18,000\text{ ft MSL}$ and TL is FL180+.
- [ ] **Mass Units & Standard Masses:**
  - Masses presented primarily in **Kilograms (kg)**.
  - Uses EASA Part-CAT standard passenger masses (CAT.POL.MAB.100):
    - All adults: $84\text{ kg}$ (includes $6\text{ kg}$ hand baggage); or Male: $88\text{ kg}$, Female: $70\text{ kg}$.
    - Child (2–11 yrs): $35\text{ kg}$. Infant ($<2\text{ yrs}$): $0\text{ kg}$ (held on lap).
    - Crew: Flight crew $85\text{ kg}$, Cabin crew $75\text{ kg}$.
    - Standard fuel densities: Jet A-1 = $0.80\text{ kg/L}$; Avgas 100LL = $0.72\text{ kg/L}$.
  - FAA passenger weights ($190/195\text{ lbs}$) restricted to FAA cross-credit callouts.
- [ ] **Airspace Classification:**
  - Full ICAO/SERA classes A through G defined without FAA distortions.
  - Class E: Controlled for IFR (clearance + separation required), but **uncontrolled for VFR** (no ATC clearance or radio required for VFR under standard SERA rules, unless in designated RMZ/TMZ).
  - Class B: Clarified as rare in Europe, unlike the extensive FAA terminal cake airspace.
  - Class F: Advisory routes (SERA.6001), distinct from FAA non-use.
  - Visibility expressed in **Kilometers (km) and Meters (m)** (e.g. $8\text{ km}$ at $\ge 10,000\text{ ft}$, $5\text{ km}$ below); cloud separation in meters ($1,500\text{ m}$ horizontal, $300\text{ m} / 1,000\text{ ft}$ vertical). Statute Miles (SM) restricted to FAA difference notes.
- [ ] **Medical & Licensing Differences:**
  - EASA Medical: Class 1, Class 2, LAPL (Part-MED).
  - No mention of US "BasicMed" or "3rd Class" in core European content.
  - EASA SEP Revalidation (FCL.740.A): 12 hours including 6 hrs PIC, 12 landings, 1 hr with FI in 12 months preceding expiry, OR proficiency check with FE. Not FAA "Biennial Flight Review (BFR)".

---

### Gate 4: Simulation & Dynamic Gauge Fidelity

- [ ] **Instrument Physics:**
  - Pitot-static instruments simulate actual instrument errors (position error, density error, compressibility error, blockages).
  - Static vent blockage: altimeter freezes, VSI indicates zero, ASI under-reads on climb / over-reads on descent.
  - Pitot tube blockage (drain clear): ASI drops to zero. Pitot + drain blocked: ASI acts like an altimeter.
- [ ] **Magnetic Compass Illusions:**
  - Acceleration errors (ANDS - Accelerate North, Decelerate South in Northern Hemisphere).
  - Turning errors (UNOS - Undershoot North, Overshoot South).
- [ ] **Radio Navigation Aids:**
  - VOR: Radial is always magnetic bearing *from* the station. Full-scale CDI deflection is $\pm 10^\circ$ ($2^\circ$ per dot). TO/FROM flag flips perpendicular to selected radial.
  - ADF / NDB: Coastal refraction, night effect (skywave interference), thunderstorm/mountain dip simulated or noted.
  - ILS: Localizer full scale $\pm 2.5^\circ$ ($0.5^\circ$ per dot); Glideslope full scale $\pm 0.7^\circ$ ($0.14^\circ$ per dot). False glideslopes occur at multiples ($2\theta \approx 6^\circ, 3\theta \approx 9^\circ$), always with reverse sensing.
- [ ] **Responsiveness & Boundary Conditions:**
  - Interactive controls do not allow unrealistic numeric inputs without triggering warning flags.
  - Sliders update gauges smoothly with zero jerky re-renders or infinite loops.

---

### Gate 5: ECQB Question Stem & Distractor Logic

- [ ] **Single Definitive Correct Answer:**
  - The correct option is supported unequivocally by official EASA regulations or authoritative physics.
- [ ] **Plausible Distractors:**
  - Every distractor represents a known pilot cognitive misconception, unit inversion, or sign error (not nonsense humor).
- [ ] **Unambiguous Question Stem:**
  - Stems avoid negative phrasing ("Which of the following is NOT...") unless explicitly highlighted: `NOT`, `LEAST`, `EXCEPT`.
  - Environmental assumptions are stated (e.g. "Assuming ISA standard conditions at sea level...").
- [ ] **Comprehensive Explanations:**
  - Explanations explain not only *why* the correct answer is right, but *why each distractor is wrong*.

---

### Gate 6: Universal Accessibility & Ergonomics

- [ ] **Keyboard Navigability:**
  - All interactive elements reachable via `Tab`.
  - Sliders and dials controllable with `ArrowLeft`, `ArrowRight`, `PageUp`, `PageDown`, `Home`, `End`.
  - Direct keyboard numeric input supported.
- [ ] **Screen Reader Support:**
  - Custom canvas and SVG elements have descriptive `aria-label` or accessible companion tables.
  - Dynamic instrument readouts update `aria-live="polite"` regions.
  - `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and `aria-valuetext` present on all ranges.
- [ ] **Reduced-Motion Fallbacks:**
  - Animations respect `prefers-reduced-motion: reduce`.
  - Continuous rotating animations (`animate-spin`) or rapid visual strobes disabled when reduced motion is preferred.
  - Static diagrams with labeled vectors provide 100% equivalent educational information.
- [ ] **Contrast & Theme:**
  - Text contrast $\ge 4.5:1$ against background.
  - Interactive UI components and borders $\ge 3:1$.
  - Clear visible focus indicator (`focus-visible:ring-2 focus-visible:ring-cyan-400`).
- [ ] **Mobile Ergonomics (Apple HIG):**
  - Minimum tap target size $\ge 44 \times 44\text{ pt}$ ($48 \times 48\text{ px}$).
  - Safe-area insets (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`) respected.

---

## 3. Review Severity Classification & Sign-Off

| Severity Level | Definition | Merge Action |
| :--- | :--- | :--- |
| 🔴 **Blocker (Level 1)** | Factual aerodynamic inaccuracy, FAA regulation presented as EASA law, incorrect exam answer key, major accessibility block (keyboard trap), crash bug. | **Immediate Rejection.** Cannot merge. |
| 🟠 **Major (Level 2)** | Missing unit conversions, ambiguous question stem, missing reduced-motion fallback on heavy animation, contrast failure on key explanatory text. | Must be fixed before release approval. |
| 🟡 **Minor (Level 3)** | Typographical error, non-critical styling polish, non-essential label improvement. | May be fixed in fast-follow PR. |

### Sign-off Record Template

```markdown
### Review Sign-Off
- **Cluster ID:** FC-___-___
- **Reviewer Name:** ________________________
- **Review Date:** YYYY-MM-DD
- **Verdict:** [ ] APPROVED  [ ] CHANGES REQUIRED  [ ] REJECTED
- **Gate 1 (Regulatory):** PASS / FAIL
- **Gate 2 (Technical):** PASS / FAIL
- **Gate 3 (Tri-Jurisdiction):** PASS / FAIL
- **Gate 4 (Simulation):** PASS / FAIL
- **Gate 5 (Assessment):** PASS / FAIL
- **Gate 6 (Accessibility):** PASS / FAIL
- **Reviewer Signature / Hash:** ________________________
```
