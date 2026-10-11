# ATPLVector Regulatory Alignment & Separation Architecture
## Resolving Problem 9: FAA-Orientation in Foundation Material vs EASA Part-FCL Standards

**Document Version:** 1.0.0  
**Effective Date:** 2026-10-12  
**Governance Scope:** PPL vs ATPL Course Tracks, Question Bank, Study Guides, and Interactive Modules  
**Authority:** ATPLVector Authoring Governance & Quality Review Board  

---

## 1. Executive Summary & Root Cause Analysis

### The Problem Statement
> **Problem 9:** *"Existing PPL material is heavily FAA-oriented; EASA foundations require explicit regulatory separation (e.g. QNH in hPa vs inHg, transition altitude vs transition level, standard masses, airspace classification A-G differences)."*

### Root Cause Audit Findings
A systematic audit of the ATPLVector repository reveals the structural source of the contamination:
1. **Source Material Origin (`ppl_objectives_extracted.md`):**
   The initial PPL syllabus was directly transcribed from the US Jeppesen Guided Flight Discovery (GFD) Private Pilot syllabus, which is built exclusively around **14 CFR Part 61 / Part 141**, **FAR Part 91**, and the US **Aeronautical Information Manual (AIM)**.
2. **Heuristic Keyword Mapping (`map_ppl_to_easa.py`):**
   `map_ppl_to_easa.py` executed a high-level keyword remap (e.g., mapping "Ground Lesson 4" to "010 Air Law" and "061 Navigation"), but left the underlying content unchanged.
3. **Pervasive Contamination in Active Code:**
   - **`components/ppl-guide/sections/Airspace.tsx` & `components/PPL/subjects/AirLaw.tsx`:** Define Class A as "18,000 to 60,000 ft MSL", Class B as "3 rings around major airports", Class F as "Not used in U.S. airspace", and VMC visibility in "Statute Miles".
   - **`components/ppl-guide/sections/WeatherInfo.tsx`:** Decodes METAR altimeter settings as `A3012` (inHg) rather than EASA standard `Q1013` (hPa).
   - **`components/ppl-guide/sections/Performance.tsx`:** Uses FAR 91.103 as the governing rule, calculates moments in `in-lbs` and weights in `lbs`, and uses Avgas density `6 lbs/gal`.
   - **`components/ppl-guide/sections/PilotQualifications.tsx`:** Teaches FAA 1st/2nd/3rd Class Medicals, BasicMed (14 CFR Part 68), and Biennial Flight Reviews (FAR 61.56).

### Training Hazard
For student pilots preparing for EASA Part-FCL (PPL, CPL, or ATPL) or UK CAA examinations, relying on FAA rules guarantees exam failure and creates dangerous cognitive interference in European airspace.

---

## 2. Definitive Tri-Jurisdictional Difference Matrix

The following matrix provides the definitive regulatory baseline for ATPLVector authors and reviewers:

| Domain | EASA Part-FCL / SERA Baseline | UK CAA Differences (CAP 804 / ANO) | FAA 14 CFR (US FAR) Differences |
| :--- | :--- | :--- | :--- |
| **Altimeter Sub-Scale Setting** | **Hectopascals (hPa)**. Standard datum: $1013.25\text{ hPa}$. QNH/QFE standard. Pressure lapse: $\approx 27\text{ ft/hPa}$ at sea level. | **Hectopascals (hPa)**. Identical to EASA standard datum $1013.25\text{ hPa}$. Regional Pressure Setting (RPS) used outside controlled airspace. | **Inches of Mercury (inHg)**. Standard datum: $29.92\text{ inHg}$. Altimeter setting: $1\text{ inHg} \approx 1,000\text{ ft}$ ($0.1\text{ inHg} \approx 100\text{ ft}$). |
| **Transition Altitude (TA)** | **Variable per aerodrome / TMA** (typically $3,000\text{ ft}$ to $6,000\text{ ft}$, up to $10,000\text{ ft}$ in alpine areas). Published on SID/STAR charts. | **Variable per aerodrome** (e.g. London TMA $6,000\text{ ft}$; elsewhere $3,000\text{ ft}$). UK Standard Transition Altitude proposal under review. | **Uniform Fixed Nationwide**: Fixed at **$18,000\text{ ft MSL}$** across the entire contiguous US. |
| **Transition Level (TL)** | **Variable, calculated by ATC/ATIS**. Chosen based on current QNH to guarantee minimum $1,000\text{ ft}$ Transition Layer buffer above TA. | **Variable, issued by ATC / ATIS**. Calculated from local aerodrome QNH. | **FL180 standard** (or FL190/FL200 if local altimeter setting $< 29.92\text{ inHg}$ per FAR 91.121). |
| **Cruising Level Rules** | **Semi-Circular Rule (SERA.5005)** based on **Magnetic Track**: East ($000^\circ\text{–}179^\circ$) = Odd thousands; West ($180^\circ\text{–}359^\circ$) = Even thousands. VFR adds $+500\text{ ft}$. | Aligned with SERA, but UK previously used Quadrantal rule (still retained in historical questions). | **Semi-Circular Rule (FAR 91.159)** based on **Magnetic Course**: $0^\circ\text{–}179^\circ$ = Odd $+500\text{ ft}$; $180^\circ\text{–}359^\circ$ = Even $+500\text{ ft}$ (above $3,000\text{ ft AGL}$). |
| **Standard Masses (CAT)** | **Part-CAT.POL.MAB.100**: <br>• All Adults: $84\text{ kg}$ (incl. $6\text{ kg}$ hand baggage)<br>• Male: $88\text{ kg}$<br>• Female: $70\text{ kg}$<br>• Child ($2\text{–}11$): $35\text{ kg}$<br>• Infant: $0\text{ kg}$<br>• Flight crew: $85\text{ kg}$; Cabin crew: $75\text{ kg}$. | Aligned with EASA Part-CAT standards; operators may use approved survey masses. | **FAA AC 120-27F**: Masses in **pounds (lbs)**.<br>• Summer adult: $190\text{ lbs}$ ($86.2\text{ kg}$)<br>• Winter adult: $195\text{ lbs}$ ($88.5\text{ kg}$)<br>• Child: $82\text{ lbs}$ summer / $87\text{ lbs}$ winter. |
| **Fuel Density Standard** | • Jet A-1: **$0.80\text{ kg/L}$** ($0.79\text{–}0.80\text{ kg/L}$)<br>• Avgas 100LL: **$0.72\text{ kg/L}$** ($6.01\text{ lbs/US gal}$) | Identical to EASA standard metric fuel densities. | • Avgas: **$6.0\text{ lbs/US gal}$**<br>• Jet A: **$6.7\text{ lbs/US gal}$** |
| **Airspace Class A** | IFR only. All flights separated. VFR prohibited (except special national waivers). Continuous 2-way radio + clearance. | IFR only. Special VFR permitted in certain UK CTRs with clearance. | IFR only. From $18,000\text{ ft MSL}$ up to and including FL600. Mode C + ADS-B Out required. |
| **Airspace Class B** | IFR and VFR permitted. All flights separated from each other. Rare in European airspace. | Not used in current UK airspace classification. | Upside-down wedding cake surrounding 37 primary airports. ATC clearance mandatory for VFR ("cleared into Class B"). 3 SM visibility, clear of clouds. |
| **Airspace Class C** | IFR and VFR permitted. IFR separated from IFR and VFR; **VFR separated from IFR**, but receives only traffic information regarding other VFR flights. | Standard CTR/CTA airspace. Similar separation rules. | Surface to $4,000\text{ ft AGL}$. Two-way radio communication established (ATC repeats callsign). VFR: 3 SM, 500 below, 1000 above, 2000 horizontal ("3-152"). |
| **Airspace Class D** | IFR and VFR permitted. IFR separated from IFR only. VFR receives traffic info regarding all flights. Continuous 2-way radio + clearance required for all. | Extensively used for regional airport CTRs/CTAs. | Surface to $2,500\text{ ft AGL}$. Two-way radio established. VFR minima: 3 SM, 500 below, 1000 above, 2000 horiz. |
| **Airspace Class E** | **Controlled for IFR, UNCONTROLLED for VFR**. IFR requires ATC clearance and continuous radio; **VFR does NOT require ATC clearance or radio contact** (unless inside designated RMZ/TMZ). | UK Class E airway corridors; VFR without radio allowed outside designated transponder zones. | Controlled airspace. VFR does not require ATC clearance or 2-way comms. Minima: 3 SM below $10,000\text{ ft}$, 5 SM at/above $10,000\text{ ft}$. |
| **Airspace Class F** | **Advisory Airspace (SERA.6001)**. IFR advisory service, flight info for all. Rare/transitional in Europe. | Formerly used; phased out in favor of Class E/G. | **Not used in the United States**. |
| **Airspace Class G** | Uncontrolled airspace. IFR and VFR permitted. Flight Information Service (FIS) on request. Continuous 2-way radio not required. | Open FIR. Unique UK Flight Information Services: Basic Service, Traffic Service, Deconfliction Service. | Uncontrolled airspace. Minima: 1 SM day, clear of clouds below $1,200\text{ ft AGL}$. |
| **VMC Weather Minima** | • At/above $10,000\text{ ft AMSL}$: $8\text{ km}$ visibility; $1,500\text{ m}$ horiz, $300\text{ m} (1,000\text{ ft})$ vert from cloud.<br>• Below $10,000\text{ ft AMSL}$: $5\text{ km}$ visibility; $1,500\text{ m}$ horiz, $300\text{ m}$ vert.<br>• Class G low altitude: $5\text{ km}$ (or $1.5\text{ km}$ if speed $\le 140\text{ kt}$), clear of cloud, in sight of surface. | Aligned with SERA minima; specific UK exemptions for helicopters and low-speed flight in Class G. | Expressed in **Statute Miles (SM)** and feet.<br>• Class C/D/E ($<10\text{k}$): 3 SM, $500\text{ ft}$ below, $1,000\text{ ft}$ above, $2,000\text{ ft}$ horiz.<br>• Class B: 3 SM, clear of clouds.<br>• Class G ($<1,200\text{ ft}$ day): 1 SM, clear of clouds. |
| **Pre-Flight Action & Regulations** | **Part-NCO.GEN.105** / **Part-CAT.GEN.NMPA**: Fuel planning, weather briefing, mass & balance compliance, NOTAMs. | UK Part-NCO / UK ANO 2016 Article 86. | **FAR 91.103**: Preflight action requirements (runway lengths, takeoff/landing data, fuel, weather). |
| **Required Equipment (VFR)** | **Part-NCO.IDE.A.100**: Required instruments and equipment (ASI, sensitive altimeter, magnetic compass, timekeeper, first aid kit, fire extinguisher). | UK Part-NCO.IDE.A. | **FAR 91.205**: "ATOMATOFLAMES" (Day VFR) and "FLAPS" (Night VFR). |
| **Pilot Medical Certification** | **Part-MED**: Class 1 (Commercial/ATPL), Class 2 (PPL), LAPL Medical. Validity: Class 1 = 12 mo ($<60$) / 6 mo ($\ge 60$ or single-pilot CAT $\ge 40$); Class 2 = 60 mo ($<40$), 24 mo ($40\text{–}50$), 12 mo ($>50$). | UK Part-MED Class 1 & 2; UK Pilot Medical Declaration (PMD) for national privileges. | **14 CFR Part 67 / Part 68**: 1st Class, 2nd Class, 3rd Class, and **BasicMed**. |
| **Recency & Revalidation** | **Part-FCL FCL.740.A (SEP Class Rating)**: Valid 2 years. Revalidation via 12 hrs flight time (incl. 6 hrs PIC, 12 takeoffs/landings, 1 hr with FI) within 12 mo preceding expiry, OR proficiency check with FE. | UK Part-FCL.740.A. | **FAR 61.56 (Flight Review)**: 24 calendar months (BFR: 1 hr ground + 1 hr flight with CFI). |

---

## 3. Separation Architecture & Implementation Plan

To eliminate confusion without destroying valuable multi-jurisdiction study material, ATPLVector adopts the following **Three-Tier Architecture**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ATPLVector Platform                             │
├───────────────────────────────────┬────────────────────────────────────┤
│ Tier 1: Core EASA Part-FCL Ground │ Tier 2: Tri-Jurisdictional Badges  │
│ (100% ECQB 2020/2026 Baseline)    │ (Explicit Visual & Semantic Tags)  │
├───────────────────────────────────┴────────────────────────────────────┤
│ Tier 3: Isolated FAA Cross-Credit & Flight Deck Hub                     │
│ (`/faa-guide`, `C172_HUB`, `FAA_PPL_STUDY_GUIDE`)                      │
└────────────────────────────────────────────────────────────────────────┘
```

### 1. Tier 1: EASA Cleanse of Core Ground School
All primary modules (`components/PPL/subjects/`, `components/ppl-guide/`, `data/pplGroundCourse.ts`, and ATPL subjects 010 to 090):
- **Altimetry:** Converted to hPa (e.g. METAR reports read `Q1018`, altimeter sub-scales read in hPa).
- **Airspace:** SERA Classes A–G with European VMC minima (km/m). Class E explicitly taught as uncontrolled for VFR.
- **Mass & Balance:** Mass in kg, fuel density in kg/L, standard masses per Part-CAT.POL.MAB.100.
- **Rules & Law:** Citations changed from FAR 91.103 / FAR 91.205 to EASA Part-NCO.GEN.105 / Part-NCO.IDE.A and SERA.

### 2. Tier 2: Tri-Jurisdictional Semantic Badges
When differences are discussed, interactive widgets and text blocks must display explicit badges:
- `<RegulatoryBadge jurisdiction="EASA" />` (Blue theme)
- `<RegulatoryBadge jurisdiction="UK_CAA" />` (Purple theme)
- `<RegulatoryBadge jurisdiction="FAA" />` (Amber theme)
- `<RegulatoryBadge jurisdiction="ICAO" />` (Teal theme)

### 3. Tier 3: Isolated FAA Cross-Credit & Flight Deck Hub
Retain US FAA material strictly inside designated views:
- `View.FAA_TEST_GUIDE`
- `View.C172_HUB`
- `View.FAA_PPL_STUDY_GUIDE`
These modules are labeled:
> *"FAA 14 CFR Cross-Credit & North American Flight Operations Module — For EASA Part-FCL exam preparation, use the EASA Ground School track."*

---

## 4. Code Remediation Roadmap for Problem 9

| File Path | Contaminated FAA Content | Remediation Plan |
| :--- | :--- | :--- |
| `components/ppl-guide/sections/Airspace.tsx` | Class A 18k–60k ft; Class B 3-rings; Class F "not used in US"; Statute Miles | Replace `AIRSPACE_CLASSES` with SERA A–G table; define VMC minima in km and meters; clarify Class E VFR freedom |
| `components/PPL/subjects/AirLaw.tsx` | `Statute Miles`, `Solid Magenta Line`, `18,000 MSL`, `Clear of Clouds < 1200 AGL` | Update `airspaceData` object to SERA criteria; convert visibility to km, cloud clearance to meters |
| `components/ppl-guide/sections/WeatherInfo.tsx` | METAR `A3012` altimeter in inHg | Update METAR decoder example to European standard `Q1013` (hPa); add note explaining FAA `Axxxx` |
| `components/ppl-guide/sections/Performance.tsx` | FAR 91.103, Avgas 6 lbs/gal, weights in lbs, in-lbs moments | Update primary formula to kg / kg·m / Part-NCO.GEN.105; add dual-unit toggle (kg/lbs) |
| `components/ppl-guide/sections/PilotQualifications.tsx` | BasicMed, 1st/2nd/3rd class FAA medicals, BFR | Replace with EASA Part-MED (Class 1, Class 2, LAPL) and Part-FCL.740.A SEP revalidation rules |
| `data/pplGroundCourse.ts` | Jeppesen FAR lesson extracts | Cleanse lesson descriptions to align with EASA Part-FCL PPL syllabus AMC1 FCL.210.A |
