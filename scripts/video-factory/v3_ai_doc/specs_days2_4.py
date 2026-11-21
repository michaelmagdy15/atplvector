#!/usr/bin/env python3
"""
Days 2, 3, and 4 (30 Topics) v3 Netflix Documentary Reel Specifications.

All 30 topics belong to Subject 010 Air Law:
  - Day 2 (10): AIR_LAW_ACCIDENT .. AIR_LAW_DOCS
  - Day 3 (10): AIR_LAW_EMERGENCY .. AIR_LAW_LIABILITY
  - Day 4 (10): AIR_LAW_LIGHTGUN .. AIR_LAW_RULES_DETAILS
"""

from __future__ import annotations

DAY2_ORDER = [
    "AIR_LAW_ACCIDENT",
    "AIR_LAW_AERODROME_VIS",
    "AIR_LAW_AIRWORTHINESS",
    "AIR_LAW_AIS_DEEP_DIVE",
    "AIR_LAW_ALTIMETER",
    "AIR_LAW_ANNEXES",
    "AIR_LAW_CONVENTIONS",
    "AIR_LAW_CRUISING",
    "AIR_LAW_DECLARED_DIST",
    "AIR_LAW_DOCS",
]

DAY3_ORDER = [
    "AIR_LAW_EMERGENCY",
    "AIR_LAW_FACILITATION",
    "AIR_LAW_GROUND_OPS",
    "AIR_LAW_HOLDING",
    "AIR_LAW_IFR_VFR",
    "AIR_LAW_INSTRUMENT",
    "AIR_LAW_INTERCEPT",
    "AIR_LAW_INT_LAW",
    "AIR_LAW_LAYERS",
    "AIR_LAW_LIABILITY",
]

DAY4_ORDER = [
    "AIR_LAW_LIGHTGUN",
    "AIR_LAW_LIGHTING",
    "AIR_LAW_OPS_INFO",
    "AIR_LAW_ORG",
    "AIR_LAW_PANS_OPS",
    "AIR_LAW_PARALLEL_RWY",
    "AIR_LAW_PERSONNEL",
    "AIR_LAW_REF_CODE",
    "AIR_LAW_REGISTRATION",
    "AIR_LAW_RULES_DETAILS",
]


def _air_law(view: str, *, title: str, exam_takeaway: str, **rest: object) -> dict:
    return {
        "view": view,
        "subject_code": "010",
        "subject_name": "AIR LAW",
        "title": title,
        "exam_takeaway": exam_takeaway,
        "outro_sub": "010 AIR LAW · MASTER EVERY EASA TOPIC",
        **rest,
    }


DAYS2_4_SPECS: dict[str, dict] = {
    # =========================================================================
    # DAY 2 (10 TOPICS)
    # =========================================================================
    "AIR_LAW_ACCIDENT": _air_law(
        "AIR_LAW_ACCIDENT",
        title="Annex 13 Accident Investigation",
        exam_takeaway="ICAO Annex 13 sole objective is accident prevention, led by the State of Occurrence.",
        transcript=(
            "Midnight crash site on a rain-slicked European runway. "
            "Investigators pull an orange black box from the wreckage. "
            "Lawyers want someone to blame — ICAO Annex Thirteen forbids it. "
            "Police probes hunt criminals and courtrooms hunt financial liability. "
            "Safety investigators lock both doors out: their sole objective is preventing future crashes, protecting cockpit voice recordings from public release. "
            "The State of Occurrence takes legal command first, unless it delegates the inquiry to the State of Registry or Operator. "
            "Wait — notice the calendar split: every serious incident also demands the full investigation. "
            "Pilot call. EASA exam trap. "
            "Whose sole mission under Annex Thirteen is apportioning blame or liability? "
            "Three... Two... One. "
            "Neither! Prevention is the only lawful purpose. "
            "Save this rule: zero blame mission, State of Occurrence leads, black boxes stay shielded."
        ),
        pronunciation_hints="ICAO as eye-kay-oh, EASA as ee-ah-sah, Annex Thirteen cleanly",
        whisper_prompt="ICAO Annex 13, EASA, State of Occurrence, State of Registry, liability, prevention, black boxes.",
        anchors={
            "eng_fail": ("black", "box", "wreckage"),
            "fly_or_stop": ("lawyers", "blame"),
            "act1_end": ("forbids",),
            "act2_start": ("police",),
            "asda_reveal": ("courtrooms", "liability"),
            "toda_reveal": ("safety", "preventing"),
            "act2_end": ("release",),
            "act3_start": ("state", "occurrence"),
            "asdr_draw": ("occurrence",),
            "todr_draw": ("registry", "operator"),
            "v1_collide": ("serious", "incident"),
            "act3_end": ("investigation",),
            "act4_start": ("pilot",),
            "quiz_go": ("liability",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("neither", "prevention"),
            "rule_1": ("zero",),
            "rule_2": ("occurrence",),
            "rule_3": ("shielded", "boxes"),
        },
        seed_1=10011,
        act1_prompt=(
            "Photorealistic vertical moody documentary shot of aviation safety investigators in "
            "high-visibility jackets inspecting a bright orange flight data recorder beside a dark "
            "rain-soaked runway at night illuminated by floodlights and blue emergency beacons, "
            "slow push-in camera, subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10012,
        act2_prompt=(
            "Minimalist stylized 3D matte pastel clay isometric miniature diorama on a dark slate "
            "table showing two separated rooms linked to a tiny orange black box model beside a miniature "
            "runway, court gavel model on one side and safety laboratory on the other, soft tilt-shift, "
            "no text, no numbers"
        ),
        act1_hud={
            "label": "ANNEX 13 // CASE FILE",
            "start_val": 1,
            "end_val": 13,
            "unit": "ANNEX",
            "warn_banner": "▲ CVR & FDR PROTECTED DATA",
            "question_pill": "FIND BLAME — OR STOP NEXT CRASH?",
        },
        act2_pills={
            "top_pill": "JUDICIAL VS SAFETY INQUIRY",
            "left_top": "COURT / POLICE",
            "left_hero": "BLAME",
            "left_sub": "JUDICIAL LIABILITY",
            "right_top": "ANNEX 13 TEAM",
            "right_hero": "PREVENT",
            "right_sub": "NEVER APPORTION FAULT",
        },
        act3_board={
            "fcom_file": "ICAO_ANNEX_13.DOC",
            "fcom_tag": "ANNEX 13 // SOLE OBJECTIVE",
            "chart_file": "INQUIRY_COMMAND_CHAIN.PDF",
            "chart_type": "rules_ladder",
            "x_label": "ANNEX 13 LEGAL RESPONSIBILITIES",
            "y_label": "",
            "marker_label": "OCCURRENCE LEADS",
            "bfl_pill": "SOLE OBJECTIVE: ACCIDENT PREVENTION — ZERO BLAME",
            "highlight_row": 0,
            "rows": [
                ("01 // LEAD", "State of Occurrence", "Leads probe unless formally delegated", (2, 132, 199)),
                ("02 // TEAM", "Registry & Operator States", "Appoint accredited representatives", (5, 150, 105)),
                ("03 // SHIELD", "CVR / FDR Non-Disclosure", "Protected from civil & criminal trials", (225, 29, 72)),
                ("04 // REPORT", "30-Day Prelim / Final Public", "Safety recommendations issued worldwide", (217, 119, 6)),
            ],
        },
        act45_quiz={
            "headline_1": "ANNEX 13 SOLE OBJECTIVE",
            "headline_2": "IS FINDING LIABILITY?",
            "opt_a_val": "TRUE",
            "opt_a_sub": "ASSIGNS LEGAL FAULT",
            "opt_b_val": "FALSE",
            "opt_b_sub": "PREVENTION ONLY",
            "correct_opt": "B",
            "verdict_banner": "FALSE — SOLE OBJECTIVE PREVENTION!",
            "rules": [
                ("1. ZERO BLAME RULE", "NEVER APPORTION FAULT"),
                ("2. STATE OF OCCURRENCE", "DEFAULT LEAD STATE"),
                ("3. CVR / FDR SHIELDED", "NO JUDICIAL RELEASE"),
            ],
        },
    ),

    "AIR_LAW_AERODROME_VIS": _air_law(
        "AIR_LAW_AERODROME_VIS",
        title="Visual Aids, Markings & PAPI",
        exam_takeaway="Runway markings are white, taxiways yellow; PAPI 2 white / 2 red marks an on-slope 3° glidepath.",
        transcript=(
            "Low overcast breaks at four hundred feet on short final. "
            "Four glowing boxes beside the touchdown zone suddenly flash all red. "
            "Wait — stay on slope, or power up instantly? "
            "Down on the pavement, two strict colors separate two worlds. "
            "Yellow paint guides every taxiway centerline and hold bar, while crisp white paint owns the runway threshold, aiming point, and centerline. "
            "Check those four PAPI lights on the left side: two white and two red locks your three-degree glidepath right onto the aiming point four hundred meters past threshold. "
            "Four reds means well below slope; four whites means dangerously high. "
            "Pilot call. EASA exam trap. "
            "Approaching at night, you see three whites and one red on the PAPI — where is the jet? "
            "Three... Two... One. "
            "Slightly high! Remember: red means dead, white means height. "
            "Save this rule: runway white paint, taxiway yellow paint, two white two red three degrees."
        ),
        pronunciation_hints="PAPI as pah-pee, EASA as ee-ah-sah",
        whisper_prompt="PAPI, runway markings, taxiway yellow, aiming point, four hundred meters, glidepath, three white one red.",
        anchors={
            "eng_fail": ("glowing", "boxes", "red"),
            "fly_or_stop": ("power", "instantly"),
            "act1_end": ("instantly",),
            "act2_start": ("pavement",),
            "asda_reveal": ("yellow", "taxiway"),
            "toda_reveal": ("white", "runway"),
            "act2_end": ("centerline",),
            "act3_start": ("four", "papi"),
            "asdr_draw": ("white", "two"),
            "todr_draw": ("aiming", "meters"),
            "v1_collide": ("four", "reds"),
            "act3_end": ("high",),
            "act4_start": ("pilot",),
            "quiz_go": ("jet",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("slightly", "high"),
            "rule_1": ("white",),
            "rule_2": ("yellow",),
            "rule_3": ("degrees",),
        },
        seed_1=10021,
        act1_prompt=(
            "Photorealistic vertical cockpit windshield POV approaching a rain-wet international runway "
            "at dusk through low stratus mist, four bright glowing red PAPI approach lights visible beside "
            "the white threshold bars, subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10022,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric miniature airport junction diorama showing bright "
            "yellow painted curved taxiway centerlines meeting a dark grey runway striped with crisp white "
            "threshold piano keys, warm studio lighting, tilt-shift depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "PAPI // GLIDEPATH ANGLE",
            "start_val": 3.0,
            "end_val": 2.2,
            "decimals": 1,
            "unit": "DEG",
            "warn_banner": "▲ FOUR REDS — BELOW GLIDEPATH",
            "question_pill": "THREE WHITE ONE RED — HIGH OR LOW?",
        },
        act2_pills={
            "top_pill": "ANNEX 14 PAVEMENT COLORS",
            "left_top": "TAXIWAYS & APRON",
            "left_hero": "YELLOW",
            "left_sub": "HOLD BARS & GUIDANCE",
            "right_top": "RUNWAY SURFACE",
            "right_hero": "WHITE",
            "right_sub": "THRESHOLD & AIMING PT",
        },
        act3_board={
            "fcom_file": "ANNEX_14_VOL1.DOC",
            "fcom_tag": "PAPI // 3.0 DEG GLIDE",
            "chart_file": "PAPI_INDICATIONS.PDF",
            "chart_type": "rules_ladder",
            "x_label": "PRECISION APPROACH PATH INDICATOR",
            "y_label": "",
            "marker_label": "3 WHITE 1 RED = HIGH",
            "bfl_pill": "WHITE OVER WHITE WAIT / RED BELOW BED (TOO LOW)",
            "highlight_row": 1,
            "rows": [
                ("4 WHITE", "Way Above Glidepath (>3.5°)", "Reduce pitch / check VASI height", (2, 132, 199)),
                ("3W / 1R", "Slightly Above Glidepath (3.2°)", "Small correction back to 3.0°", (217, 119, 6)),
                ("2W / 2R", "ON Correct 3.0° Glidepath", "Hits aiming point (~400 m RWY ≥2400 m)", (5, 150, 105)),
                ("4 RED", "Dangerously Below Slope (<2.5°)", "Climb immediately / go around", (225, 29, 72)),
            ],
        },
        act45_quiz={
            "headline_1": "PAPI SHOWS 3 WHITE",
            "headline_2": "AND 1 RED — YOU ARE?",
            "opt_a_val": "SLIGHTLY HIGH",
            "opt_a_sub": "ABOVE 3° SLOPE",
            "opt_b_val": "SLIGHTLY LOW",
            "opt_b_sub": "BELOW 3° SLOPE",
            "correct_opt": "A",
            "verdict_banner": "SLIGHTLY ABOVE 3° GLIDEPATH!",
            "rules": [
                ("1. RUNWAY MARKINGS", "ALWAYS WHITE PAINT"),
                ("2. TAXIWAY MARKINGS", "ALWAYS YELLOW PAINT"),
                ("3. 2 WHITE / 2 RED", "ON 3.0° GLIDEPATH"),
            ],
        },
    ),

    "AIR_LAW_AIRWORTHINESS": _air_law(
        "AIR_LAW_AIRWORTHINESS",
        title="Annex 8 Airworthiness & ARC",
        exam_takeaway="The State of Registry issues the non-expiring C of A, kept valid annually by the 12-month ARC.",
        transcript=(
            "Brand-new widebody rolls off the French assembly line in Toulouse. "
            "One paper is overdue by twenty-four hours, and the captain locks the parking brake. "
            "No valid certificate, no revenue flight. "
            "Under ICAO Annex Eight, aircraft builders never issue the Certificate of Airworthiness. "
            "The State of Registry signs it after verifying type design, while Europe makes that certificate non-expiring as long as maintenance stays current. "
            "Look at the annual gatekeeper: every twelve months an Airworthiness Review Certificate validates that inspection records and airworthiness directives match the logbooks. "
            "Miss one AD or miss that renewal, and the whole airframe is grounded. "
            "Pilot call. EASA exam trap. "
            "Who legally issues an aircraft Certificate of Airworthiness? "
            "Three... Two... One. "
            "The State of Registry! Never the manufacturer or operator. "
            "Save this rule: State of Registry issues, non-expiring EASA C of A, twelve-month ARC check."
        ),
        pronunciation_hints="ICAO as eye-kay-oh, EASA as ee-ah-sah, C of A as see of ay, ARC as A-R-C",
        whisper_prompt="Annex 8, Certificate of Airworthiness, State of Registry, Airworthiness Review Certificate, EASA, twelve months.",
        anchors={
            "eng_fail": ("overdue", "hours"),
            "fly_or_stop": ("certificate", "flight"),
            "act1_end": ("flight",),
            "act2_start": ("annex",),
            "asda_reveal": ("builders", "issue"),
            "toda_reveal": ("registry", "non-expiring"),
            "act2_end": ("current",),
            "act3_start": ("annual", "gatekeeper"),
            "asdr_draw": ("twelve", "months"),
            "todr_draw": ("review", "certificate"),
            "v1_collide": ("miss", "grounded"),
            "act3_end": ("grounded",),
            "act4_start": ("pilot",),
            "quiz_go": ("airworthiness",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("state", "registry"),
            "rule_1": ("registry",),
            "rule_2": ("non-expiring",),
            "rule_3": ("twelve-month", "twelve", "arc"),
        },
        seed_1=10031,
        act1_prompt=(
            "Photorealistic vertical shot of a brand-new commercial jetliner inside a brightly lit glass "
            "aviation hangar in Toulouse with maintenance engineers holding inspection tablets beside the "
            "open nose gear door, dramatic reflections on polished floor, subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10032,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric diorama of an aircraft factory hangar beside a "
            "government civil aviation stamp building connected by a miniature red airliner model, crisp "
            "shadows, tilt-shift miniature look, no text, no numbers"
        ),
        act1_hud={
            "label": "PART-M // ARC VALIDITY",
            "start_val": 365,
            "end_val": 0,
            "unit": "DAYS",
            "warn_banner": "▲ ARC EXPIRED — AIRCRAFT GROUNDED",
            "question_pill": "BUILDER SIGN-OFF — OR REGISTRY?",
        },
        act2_pills={
            "top_pill": "ANNEX 8 LEGAL AUTHORITY",
            "left_top": "MANUFACTURER",
            "left_hero": "DESIGN",
            "left_sub": "TYPE CERT ONLY",
            "right_top": "STATE OF REGISTRY",
            "right_hero": "C OF A",
            "right_sub": "ISSUES & GROUNDS",
        },
        act3_board={
            "fcom_file": "PART_21_SUBPART_H.DOC",
            "fcom_tag": "ANNEX 8 // C OF A + ARC",
            "chart_file": "VALIDITY_CYCLE.PDF",
            "chart_type": "rules_ladder",
            "x_label": "CONTINUING AIRWORTHINESS CHAIN",
            "y_label": "",
            "marker_label": "ARC EVERY 12 MONTHS",
            "bfl_pill": "EASA C OF A IS NON-EXPIRING WHILE ARC & ADs STAY VALID",
            "highlight_row": 2,
            "rows": [
                ("01 // TYPE", "EASA / Design State", "Issues Type Certificate for aircraft model", (2, 132, 199)),
                ("02 // C OF A", "State of Registry", "Issues non-expiring C of A to airframe", (5, 150, 105)),
                ("03 // ARC", "12-Month Review (CAMO)", "Validates logs, ADs & physical airframe", (217, 119, 6)),
                ("04 // INVALID", "Missed AD or Unapproved Mod", "Suspends C of A automatically under law", (225, 29, 72)),
            ],
        },
        act45_quiz={
            "headline_1": "WHO ISSUES AIRCRAFT",
            "headline_2": "CERT OF AIRWORTHINESS?",
            "opt_a_val": "DESIGN STATE",
            "opt_a_sub": "ORIGINAL BUILDER",
            "opt_b_val": "STATE OF REG",
            "opt_b_sub": "COUNTRY OF TAIL",
            "correct_opt": "B",
            "verdict_banner": "STATE OF REGISTRY ISSUES C OF A!",
            "rules": [
                ("1. STATE OF REGISTRY", "ISSUES C OF A"),
                ("2. NON-EXPIRING C OF A", "UNDER EASA PART-21"),
                ("3. 12-MONTH ARC", "EXTENDABLE 2x ON ACAM"),
            ],
        },
    ),

    "AIR_LAW_AIS_DEEP_DIVE": _air_law(
        "AIR_LAW_AIS_DEEP_DIVE",
        title="AIS Deep Dive: AIRAC, NOTAM & SNOWTAM",
        exam_takeaway="AIRAC publishes permanently effective operational changes on a strict 28-day cycle; NOTAMs cap at 3 months.",
        transcript=(
            "Airway Victor Two drops off your FMS database at midnight UTC. "
            "Same jet, brand-new waypoint name, and half the region just switched frequencies together. "
            "One global clock keeps every cockpit synced. "
            "Temporary hazards like a closed taxiway or broken glideslope fire off immediate NOTAMs capped at three months. "
            "Permanent route, runway, or frequency changes wait for AIRAC — the strict twenty eight day worldwide synchronization calendar. "
            "Look at the timing ladder: normal AIRAC cycles update every twenty eight days, published at least forty two days early, while major airspace redesigns use a fifty six day double cycle. "
            "Winter runway contamination adds SNOWTAMs, and volcanic clouds trigger ASHTAMs. "
            "Pilot call. EASA exam trap. "
            "What is the standard interval between AIRAC effective dates? "
            "Three... Two... One. "
            "Twenty eight days! Always multiples of four Thursdays. "
            "Save this rule: AIRAC twenty eight days, major changes fifty six, NOTAM max three months."
        ),
        pronunciation_hints="AIRAC as eye-rack, NOTAM as no-tam, SNOWTAM as snow-tam, EASA as ee-ah-sah",
        whisper_prompt="AIRAC, 28 days, 56 days, 42 days, NOTAM, SNOWTAM, ASHTAM, three months.",
        anchors={
            "eng_fail": ("midnight",),
            "fly_or_stop": ("switched", "frequencies"),
            "act1_end": ("clock",),
            "act2_start": ("temporary",),
            "asda_reveal": ("notams", "months"),
            "toda_reveal": ("airac", "calendar"),
            "act2_end": ("calendar",),
            "act3_start": ("timing", "ladder"),
            "asdr_draw": ("twenty", "twenty-eight", "28"),
            "todr_draw": ("fifty", "fifty-six", "56"),
            "v1_collide": ("snowtams", "volcanic"),
            "act3_end": ("ashtams",),
            "act4_start": ("pilot",),
            "quiz_go": ("dates",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("twenty", "twenty-eight", "28"),
            "rule_1": ("twenty", "28", "airac"),
            "rule_2": ("fifty", "56", "major"),
            "rule_3": ("notam", "three", "months"),
        },
        seed_1=10041,
        act1_prompt=(
            "Photorealistic vertical close-up of a commercial jet cockpit FMS navigation screen updating "
            "airway waypoints at night in cruise flight with soft emerald avionics glow and distant stars "
            "beyond the windshield, subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10042,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric miniature calendar desk beside a tiny radio control "
            "tower and white FMS unit showing urgent red alert blocks on one side and synchronized blue blocks "
            "on the other, tilt-shift miniature style, no text, no numbers"
        ),
        act1_hud={
            "label": "AIRAC // SYNC CYCLE",
            "start_val": 1,
            "end_val": 28,
            "unit": "DAY",
            "warn_banner": "▲ AIRAC CYCLE EFFECTIVE 0000 UTC",
            "question_pill": "RANDOM UPDATES — OR FIXED CLOCK?",
        },
        act2_pills={
            "top_pill": "SHORT-TERM VS SCHEDULED",
            "left_top": "TEMPORARY (<3 MO)",
            "left_hero": "NOTAM",
            "left_sub": "UNPLANNED HAZARDS",
            "right_top": "PLANNED CHANGES",
            "right_hero": "AIRAC",
            "right_sub": "SYNCHRONIZED CYCLE",
        },
        act3_board={
            "fcom_file": "ICAO_ANNEX_15.DOC",
            "fcom_tag": "AIRAC // TIMELINE",
            "chart_file": "AIS_NOTICE_DURATIONS.PDF",
            "chart_type": "bars_compare",
            "x_label": "AIS PUBLICATION LEAD & CYCLE DAYS →",
            "y_label": "DAYS",
            "marker_label": "MAJOR = 56 DAYS",
            "bfl_pill": "STANDARD AIRAC 28 DAYS (ADVANCE NOTICE ≥42 DAYS)",
            "highlight_row": 0,
            "bars": [
                ("AIRAC CYCLE", 28, (2, 132, 199), "28 DAYS"),
                ("PRE-NOTICE", 42, (5, 150, 105), "42 DAYS"),
                ("DOUBLE AIRAC", 56, (217, 119, 6), "56 DAYS"),
                ("NOTAM MAX", 90, (225, 29, 72), "90 DAYS (3 MO)"),
            ],
        },
        act45_quiz={
            "headline_1": "STANDARD AIRAC CYCLE",
            "headline_2": "INTERVAL IS?",
            "opt_a_val": "28 DAYS",
            "opt_a_sub": "4 WEEKS EVERY CYCLE",
            "opt_b_val": "30 DAYS",
            "opt_b_sub": "CALENDAR MONTHLY",
            "correct_opt": "A",
            "verdict_banner": "AIRAC RUNS EVERY 28 DAYS!",
            "rules": [
                ("1. STANDARD AIRAC", "28-DAY SYNC CYCLE"),
                ("2. MAJOR REDESIGNS", "56 DAYS ADVANCE"),
                ("3. NOTAM MAX LIFE", "3 MONTHS -> AIP SUP"),
            ],
        },
    ),

    "AIR_LAW_ALTIMETER": _air_law(
        "AIR_LAW_ALTIMETER",
        title="Altimetry: TA, TL, QNH & QNE",
        exam_takeaway="Set 1013.25 hPa climbing past Transition Altitude; set QNH descending past Transition Level (high to low, look out below).",
        transcript=(
            "Climbing past six thousand feet into busy Alpine terrain. "
            "Your co-pilot pulls the baro knob early, and your jet climbs silently closer to crossing traffic. "
            "Which pressure belongs on the sub-scale? "
            "Below Transition Altitude, QNH measures true altitude above mean sea level so every plane clears the peaks. "
            "Above Transition Level, standard ten-thirteen point two five — QNE — locks all jets onto shared Flight Levels. "
            "Look at the trapped air gap between them: the Transition Layer, where ATC never assigns level cruise, and where Transition Level must sit at or above Transition Altitude at all times. "
            "Remember if QNH drops along track, true altitude sinks beneath your gauge! "
            "Pilot call. EASA exam trap. "
            "Flying from high pressure to low pressure without resetting QNH — is true altitude higher or lower? "
            "Three... Two... One. "
            "Lower! High to low, look out below. "
            "Save this rule: climb past TA set standard, descend past TL set QNH, low pressure sinks you."
        ),
        pronunciation_hints="QNH as Q-N-H, QNE as Q-N-E, TA as T-A, TL as T-L, EASA as ee-ah-sah",
        whisper_prompt="Transition Altitude, Transition Level, QNH, QNE, 1013, high pressure, low pressure, look out below.",
        anchors={
            "eng_fail": ("knob", "early"),
            "fly_or_stop": ("pressure", "belongs"),
            "act1_end": ("sub-scale", "scale"),
            "act2_start": ("altitude",),
            "asda_reveal": ("qnh", "sea"),
            "toda_reveal": ("qne", "flight"),
            "act2_end": ("levels",),
            "act3_start": ("trapped", "layer"),
            "asdr_draw": ("transition", "layer"),
            "todr_draw": ("lowest", "above", "level"),
            "v1_collide": ("qnh", "drops", "sinks"),
            "act3_end": ("gauge",),
            "act4_start": ("pilot",),
            "quiz_go": ("lower",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("lower", "high"),
            "rule_1": ("standard",),
            "rule_2": ("qnh",),
            "rule_3": ("low", "sinks"),
        },
        seed_1=10051,
        act1_prompt=(
            "Photorealistic vertical close-up of a commercial airliner primary flight display and aluminum "
            "baro selector knob in a twilight cockpit climbing toward snow-capped Alpine peaks, glowing cyan "
            "altitude tape passing 6000 feet, subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10052,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric cutaway diorama showing snowy mountain peaks below, "
            "a translucent amber mid-air safety band in the middle, and tiny white model airliners flying "
            "on evenly stacked glass shelves above, tilt-shift depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "BARO SUBSCALE // STD",
            "start_val": 1024,
            "end_val": 1013,
            "unit": "hPa",
            "warn_banner": "▲ TRANSITION LAYER CROSSING",
            "question_pill": "QNH ALTITUDE — OR FLIGHT LEVEL?",
        },
        act2_pills={
            "top_pill": "TA VS TL REFERENCE",
            "left_top": "AT / BELOW TA",
            "left_hero": "QNH",
            "left_sub": "ALTITUDE RE: MSL",
            "right_top": "AT / ABOVE TL",
            "right_hero": "1013",
            "right_sub": "FLIGHT LEVELS (QNE)",
        },
        act3_board={
            "fcom_file": "DOC_8168_ALTIMETRY.DOC",
            "fcom_tag": "HIGH -> LOW = LOOK OUT",
            "chart_file": "TRUE_ALT_VS_QNH.PDF",
            "chart_type": "crossing",
            "x_label": "FLYING INTO FALLING PRESSURE →",
            "y_label": "ALT",
            "curve1_label": "INDICATED (CONST)",
            "curve2_label": "TRUE ALTITUDE",
            "marker_label": "TRUE < INDICATED",
            "bfl_pill": "NEVER CRUISE INSIDE TRANSITION LAYER (TL - TA >= 1000 FT)",
        },
        act45_quiz={
            "headline_1": "HIGH TO LOW PRESSURE",
            "headline_2": "WITHOUT RESETTING?",
            "opt_a_val": "TRUE HIGHER",
            "opt_a_sub": "MORE TERRAIN MARGIN",
            "opt_b_val": "TRUE LOWER",
            "opt_b_sub": "HIGH TO LOW = BELOW",
            "correct_opt": "B",
            "verdict_banner": "TRUE ALTITUDE IS LOWER!",
            "rules": [
                ("1. CLIMB PAST TA", "SET QNE 1013.25 hPa"),
                ("2. DESCEND PAST TL", "SET LOCAL QNH"),
                ("3. LOW / COLD AIR", "TRUE ALT < INDICATED"),
            ],
        },
    ),

    "AIR_LAW_ANNEXES": _air_law(
        "AIR_LAW_ANNEXES",
        title="The 19 ICAO Annexes Map",
        exam_takeaway="Annex 2 governs Rules of the Air, Annex 6 Operations, Annex 11 ATS, Annex 14 Aerodromes, Annex 19 Safety Management.",
        transcript=(
            "Nineteen technical rulebooks bind every airline flight from Tokyo to London. "
            "Most students scramble their numbers in the Air Law exam — costing easy points in seconds. "
            "One smart map locks all nineteen in place. "
            "Crew licenses come first in Annex One, Rules of the Air sit in Annex Two, and Operations belong to Annex Six. "
            "Add Annex Eleven for Air Traffic Control, Annex Fourteen for Aerodromes, and Annex Nineteen for Safety Management. "
            "Spot the big three exam anchors: Annex Thirteen handles Accidents, Annex Seventeen covers Security, and Annex Eighteen regulates Dangerous Goods. "
            "Wait — remember every rule inside an Annex is a Standard or Recommended Practice. "
            "Pilot call. EASA exam trap. "
            "Which ICAO Annex strictly governs Rules of the Air? "
            "Three... Two... One. "
            "Annex Two! Never confuse it with Air Traffic Services in Eleven. "
            "Save this rule: One Licenses, Two Rules, Eleven Air Traffic."
        ),
        pronunciation_hints="ICAO as eye-kay-oh, SARPs as sarps, EASA as ee-ah-sah",
        whisper_prompt="ICAO Annexes, Annex 1, Annex 2 Rules of the Air, Annex 6, Annex 11 ATS, Annex 13, Annex 14, Annex 17, Annex 18, Annex 19.",
        anchors={
            "eng_fail": ("scramble", "numbers"),
            "fly_or_stop": ("map", "locks"),
            "act1_end": ("place",),
            "act2_start": ("crew",),
            "asda_reveal": ("licenses", "operations"),
            "toda_reveal": ("traffic", "safety"),
            "act2_end": ("management",),
            "act3_start": ("anchors",),
            "asdr_draw": ("thirteen", "accidents"),
            "todr_draw": ("seventeen", "eighteen"),
            "v1_collide": ("standard", "practice"),
            "act3_end": ("practice",),
            "act4_start": ("pilot",),
            "quiz_go": ("air",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("annex", "two"),
            "rule_1": ("licenses",),
            "rule_2": ("rules",),
            "rule_3": ("traffic",),
        },
        seed_1=10061,
        act1_prompt=(
            "Photorealistic vertical dramatic shot inside an international civil aviation library archive "
            "with rows of sleek navy-blue bound technical manuals glowing under warm spotlight beams above "
            "an illuminated glass aviation route map, subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10062,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric diorama of a neatly organized filing desk with "
            "miniature color-coded aviation binders surrounding a tiny white globe, soft directional lighting, "
            "tilt-shift depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "CHICAGO // SARPs LIBRARY",
            "start_val": 1,
            "end_val": 19,
            "unit": "ANNEX",
            "warn_banner": "▲ HIGH-YIELD EASA EXAM CODES",
            "question_pill": "ANNEX 2 — RULES OR ATC?",
        },
        act2_pills={
            "top_pill": "CORE CREW & OPS BOOKS",
            "left_top": "PILOT & RULES",
            "left_hero": "1 & 2",
            "left_sub": "LICENSING & RULES OF AIR",
            "right_top": "AIRLINE & AIRPORT",
            "right_hero": "6 & 14",
            "right_sub": "OPS & AERODROMES",
        },
        act3_board={
            "fcom_file": "ICAO_19_ANNEXES.DOC",
            "fcom_tag": "SARPs // STANDARD vs RP",
            "chart_file": "TOP_EXAM_ANNEXES.PDF",
            "chart_type": "rules_ladder",
            "x_label": "MUST-KNOW ICAO ANNEX NUMBERS",
            "y_label": "",
            "marker_label": "ANNEX 2 = RULES OF AIR",
            "bfl_pill": "STANDARDS ARE MANDATORY (FILE DIFFERENCES) · RPs DESIRABLE",
            "highlight_row": 0,
            "rows": [
                ("ANNEX 1 & 2", "Personnel Licensing & Rules of Air", "Crew ratings + VFR/IFR flight rules", (2, 132, 199)),
                ("ANNEX 6 & 8", "Aircraft Ops & Airworthiness", "AOC flight ops + C of A standards", (5, 150, 105)),
                ("ANNEX 11 & 14", "Air Traffic Services & Aerodromes", "ATC control vs runway geometry", (217, 119, 6)),
                ("ANNEX 13/17/19", "Accidents / Security / SMS", "Prevention / Hijack / Safety Mgmt", (225, 29, 72)),
            ],
        },
        act45_quiz={
            "headline_1": "WHICH ANNEX COVERS",
            "headline_2": "RULES OF THE AIR?",
            "opt_a_val": "ANNEX 2",
            "opt_a_sub": "FLIGHT & RIGHT-OF-WAY",
            "opt_b_val": "ANNEX 11",
            "opt_b_sub": "AIR TRAFFIC SERVICES",
            "correct_opt": "A",
            "verdict_banner": "ANNEX 2 IS RULES OF THE AIR!",
            "rules": [
                ("1. ANNEX 1 LICENSES", "ANNEX 2 RULES OF AIR"),
                ("2. ANNEX 11 IS ATS", "ANNEX 14 AERODROMES"),
                ("3. ANNEX 17 SECURITY", "ANNEX 18 DANGEROUS GOODS"),
            ],
        },
    ),

    "AIR_LAW_CONVENTIONS": _air_law(
        "AIR_LAW_CONVENTIONS",
        title="Tokyo, Hague & Montreal Conventions",
        exam_takeaway="Tokyo 1963 grants Aircraft Commander restraint powers; Hague 1970 targets hijacking; Montreal 1971 targets sabotage.",
        transcript=(
            "Thirty-five thousand feet over international ocean. "
            "An unruly passenger rushes the armored cockpit door mid-flight. "
            "Does the captain hold legal power to restrain him? "
            "Three landmark security treaties split airborne crime cleanly. "
            "Tokyo Nineteen Sixty-Three covers offences onboard and gives the Aircraft Commander legal immunity to restrain or disembark troublemakers. "
            "Hague Nineteen Seventy specifically criminalizes unlawful seizure — hijacking — demanding severe penalties or extradition. "
            "Montreal Nineteen Seventy-One seals the final gap: sabotage against airports, nav aids, or airborne jets. "
            "Meanwhile, separate liability treaties — Warsaw replaced by Montreal Ninety-Nine — pay passenger claims. "
            "Pilot call. EASA exam trap. "
            "Which convention grants the Pilot-in-Command power to restrain an unruly passenger? "
            "Three... Two... One. "
            "Tokyo Nineteen Sixty Three! Only the State of Registration first exercises jurisdiction aloft. "
            "Save this rule: Tokyo grants restraint, Hague stops hijacking, Montreal stops sabotage."
        ),
        pronunciation_hints="Hague as hayg, Montreal as mon-tree-all, Tokyo as toe-kee-oh, EASA as ee-ah-sah",
        whisper_prompt="Tokyo 1963, Hague 1970, Montreal 1971, Montreal 1999, Warsaw, restrain, hijacking, sabotage.",
        anchors={
            "eng_fail": ("rushes", "cockpit"),
            "fly_or_stop": ("power", "restrain"),
            "act1_end": ("him",),
            "act2_start": ("treaties",),
            "asda_reveal": ("tokyo", "command"),
            "toda_reveal": ("hague", "hijacking"),
            "act2_end": ("extradition",),
            "act3_start": ("montreal", "seals"),
            "asdr_draw": ("sabotage",),
            "todr_draw": ("liability", "warsaw"),
            "v1_collide": ("claims",),
            "act3_end": ("claims",),
            "act4_start": ("pilot",),
            "quiz_go": ("passenger",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("tokyo",),
            "rule_1": ("restraint",),
            "rule_2": ("hijacking", "anti-hijacking"),
            "rule_3": ("sabotage", "anti-sabotage"),
        },
        seed_1=10071,
        act1_prompt=(
            "Photorealistic vertical moody shot looking down the aisle of a night-time commercial airliner "
            "cabin toward the illuminated reinforced cockpit door with amber cabin call lights glowing, tense "
            "documentary framing, subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10072,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric miniature courtroom globe diorama linking three tiny "
            "diplomatic podiums labeled only by distinct colored shields beside a miniature white airliner, "
            "tilt-shift shallow depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "TOKYO 1963 // PIC POWER",
            "start_val": 1963,
            "end_val": 1971,
            "unit": "CONV",
            "warn_banner": "▲ AIRBORNE OFFENCE DETECTED",
            "question_pill": "CAPTAIN IMMUNITY — WHICH TREATY?",
        },
        act2_pills={
            "top_pill": "AIRBORNE CRIMINAL TREATIES",
            "left_top": "ONBOARD OFFENCES",
            "left_hero": "TOKYO 63",
            "left_sub": "PIC RESTRAINT & DISEMBARK",
            "right_top": "UNLAWFUL SEIZURE",
            "right_hero": "HAGUE 70",
            "right_sub": "HIJACKING EXTRADITION",
        },
        act3_board={
            "fcom_file": "INT_AIR_SECURITY.DOC",
            "fcom_tag": "PIC IMMUNITY // TOKYO",
            "chart_file": "CONVENTION_MATRIX.PDF",
            "chart_type": "rules_ladder",
            "x_label": "CRIMINAL & LIABILITY CONVENTIONS",
            "y_label": "",
            "marker_label": "TOKYO = PIC POWERS",
            "bfl_pill": "STATE OF REGISTRATION EXERCISES FIRST JURISDICTION IN FLIGHT",
            "highlight_row": 0,
            "rows": [
                ("TOKYO 1963", "Onboard Offences & Restraint", "Commander immune; restrains / offloads", (2, 132, 199)),
                ("HAGUE 1970", "Unlawful Seizure (Hijacking)", "Mandatory severe penalty or extradite", (225, 29, 72)),
                ("MONTREAL 71", "Sabotage & Nav Aid Attacks", "Covers ground & airborne destruction", (217, 119, 6)),
                ("MONTREAL 99", "Carrier Passenger Liability", "Replaces Warsaw 1929 (injury/baggage)", (5, 150, 105)),
            ],
        },
        act45_quiz={
            "headline_1": "WHICH TREATY GRANTS PIC",
            "headline_2": "POWER TO RESTRAIN?",
            "opt_a_val": "HAGUE 1970",
            "opt_a_sub": "HIJACKING PENALTIES",
            "opt_b_val": "TOKYO 1963",
            "opt_b_sub": "ONBOARD COMMANDER",
            "correct_opt": "B",
            "verdict_banner": "TOKYO 1963 GRANTS PIC RESTRAINT!",
            "rules": [
                ("1. TOKYO 1963", "PIC RESTRAINT IMMUNITY"),
                ("2. HAGUE 1970", "ANTI-HIJACKING SEIZURE"),
                ("3. MONTREAL 1971", "ANTI-SABOTAGE ACTS"),
            ],
        },
    ),

    "AIR_LAW_CRUISING": _air_law(
        "AIR_LAW_CRUISING",
        title="Semi-Circular Cruising Levels & RVSM",
        exam_takeaway="Magnetic tracks 000–179° fly ODD flight levels and 180–359° EVEN; RVSM halves separation to 1,000 ft between FL290 and FL410.",
        transcript=(
            "Closing speed eleven hundred knots on a starry North Atlantic airway. "
            "Two heavy jets cross tracks separated vertically by a single thousand-foot cushion. "
            "Only one simple compass rule keeps noses apart. "
            "Forget heading — cruising levels always depend on magnetic track. "
            "Zero-zero-zero through one-seven-nine East flies Odd levels like Flight Level Three-Ten; one-eight-zero through three-five-nine West flies Even levels like Three-Twenty, with VFR adding five hundred feet. "
            "Inside RVSM airspace from Flight Level Two Ninety to Four Ten, approved jets cut standard two thousand foot spacing in half down to one thousand feet! "
            "Lose an RVSM altimeter, and you immediately inform ATC. "
            "Pilot call. EASA exam trap. "
            "Flying IFR on magnetic track two hundred and sixty degrees at Flight Level Three Fifty — legal or conflict? "
            "Three... Two... One. "
            "Conflict! Westbound tracks belong on Even levels like Three Sixty. "
            "Save this rule: East Odd West Even, magnetic track governs, RVSM Two Ninety to Four Ten."
        ),
        pronunciation_hints="RVSM as R-V-S-M, IFR as I-F-R, VFR as V-F-R, EASA as ee-ah-sah",
        whisper_prompt="Magnetic track, 000 to 179, odd, even, RVSM, FL290, FL410, 1000 feet, FL350, VFR plus 500.",
        anchors={
            "eng_fail": ("closing", "knots"),
            "fly_or_stop": ("compass", "rule"),
            "act1_end": ("apart",),
            "act2_start": ("forget",),
            "asda_reveal": ("east", "odd"),
            "toda_reveal": ("west", "even"),
            "act2_end": ("feet",),
            "act3_start": ("rvsm", "airspace"),
            "asdr_draw": ("ten", "four-ten", "410"),
            "todr_draw": ("thousand", "feet"),
            "v1_collide": ("inform", "atc"),
            "act3_end": ("atc",),
            "act4_start": ("pilot",),
            "quiz_go": ("conflict",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("conflict", "westbound"),
            "rule_1": ("east", "odd"),
            "rule_2": ("magnetic", "track"),
            "rule_3": ("rvsm", "ninety", "290"),
        },
        seed_1=10081,
        act1_prompt=(
            "Photorealistic vertical cinematic shot from the flight deck window looking at a distant twin-engine "
            "widebody contrail crossing safely below beneath twilight purple stratosphere clouds, subtle 35mm "
            "film grain, no text, no logos"
        ),
        seed_2=10082,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric miniature diorama showing a giant pastel compass rose "
            "split down the middle with red eastern flight tracks stepped at odd heights and emerald western tracks "
            "stepped at even heights with tiny jet models, tilt-shift depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "MAG TRACK // LEVEL",
            "start_val": 250,
            "end_val": 260,
            "unit": "DEG",
            "warn_banner": "▲ WESTBOUND TRACK AT ODD FL350!",
            "question_pill": "HDG OR MAGNETIC TRACK?",
        },
        act2_pills={
            "top_pill": "SEMI-CIRCULAR BY MAG TRACK",
            "left_top": "000° – 179° MAG",
            "left_hero": "ODD",
            "left_sub": "FL310 / FL330 / VFR +500",
            "right_top": "180° – 359° MAG",
            "right_hero": "EVEN",
            "right_sub": "FL320 / FL340 / VFR +500",
        },
        act3_board={
            "fcom_file": "ANNEX_2_APPX_3.DOC",
            "fcom_tag": "RVSM // FL290–FL410",
            "chart_file": "VERTICAL_SEPARATION.PDF",
            "chart_type": "bars_compare",
            "x_label": "VERTICAL SEPARATION MINIMUM (FT) →",
            "y_label": "BAND",
            "marker_label": "RVSM = 1,000 FT",
            "bfl_pill": "RVSM REQUIRES TWO INDEPENDENT ALTIMETERS + ALT HOLD + XPDR",
            "highlight_row": 1,
            "bars": [
                ("< FL290 STD", 1000, (2, 132, 199), "1,000 FT"),
                ("FL290-410 RVSM", 1000, (5, 150, 105), "1,000 FT (APPV)"),
                ("FL290-410 NON", 2000, (225, 29, 72), "2,000 FT"),
                ("> FL410 STD", 2000, (217, 119, 6), "2,000 FT"),
            ],
        },
        act45_quiz={
            "headline_1": "MAG TRACK 260° IFR",
            "headline_2": "CRUISING AT FL350?",
            "opt_a_val": "WRONG SIDE",
            "opt_a_sub": "WESTBOUND NEEDS EVEN",
            "opt_b_val": "CORRECT FL",
            "opt_b_sub": "260° USES ODD LEVELS",
            "correct_opt": "A",
            "verdict_banner": "CONFLICT — 260° REQUIRES EVEN FL!",
            "rules": [
                ("1. 000-179 ODD / WEST EVEN", "BY MAGNETIC TRACK"),
                ("2. VFR ADDS +500 FT", "ABOVE FL300 NO VFR*"),
                ("3. RVSM FL290-FL410", "1,000 FT SEPARATION"),
            ],
        },
    ),

    "AIR_LAW_DECLARED_DIST": _air_law(
        "AIR_LAW_DECLARED_DIST",
        title="Annex 14 Declared Runway Distances",
        exam_takeaway="TORA + Stopway = ASDA; TORA + Clearway = TODA; a displaced threshold reduces LDA for landing but still counts for takeoff.",
        transcript=(
            "Heavy summer charter lined up on a tight island runway. "
            "Past the far red edge sit two invisible zones: gravel overrun and open bay water. "
            "Can you stop on grass, or climb through open air? "
            "Start with TORA — the full paved tarmac strong enough for your takeoff roll. "
            "Add the emergency stopway ahead and you get ASDA for rejected braking; instead add the obstacle-free clearway over flat ground or water to get TODA, capped at fifty percent of TORA. "
            "Now flip direction: landing starts strictly at the threshold! "
            "When noise or obstacles shift that threshold forward, LDA shrinks right away. "
            "Pilot call. EASA exam trap. "
            "Can you start your takeoff roll on the pavement behind a displaced landing threshold? "
            "Three... Two... One. "
            "Yes! Displaced threshold pavement counts for takeoff TORA — only landing LDA excludes it. "
            "Save this rule: Stopway builds ASDA, Clearway builds TODA, displaced threshold cuts only LDA."
        ),
        pronunciation_hints="TORA as tore-ah, ASDA as az-dah, TODA as toe-dah, LDA as L-D-A, EASA as ee-ah-sah",
        whisper_prompt="TORA, ASDA, TODA, LDA, Stopway, Clearway, displaced threshold, takeoff roll, fifty percent.",
        anchors={
            "eng_fail": ("red", "edge"),
            "fly_or_stop": ("stop", "climb"),
            "act1_end": ("air",),
            "act2_start": ("start",),
            "asda_reveal": ("stopway", "asda"),
            "toda_reveal": ("clearway", "toda"),
            "act2_end": ("tora",),
            "act3_start": ("landing", "threshold"),
            "asdr_draw": ("threshold",),
            "todr_draw": ("lda", "shrinks"),
            "v1_collide": ("shrinks", "away"),
            "act3_end": ("away",),
            "act4_start": ("pilot",),
            "quiz_go": ("threshold",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("yes", "displaced"),
            "rule_1": ("asda",),
            "rule_2": ("toda",),
            "rule_3": ("lda",),
        },
        seed_1=10091,
        act1_prompt=(
            "Photorealistic vertical shot from the flight deck at line-up on a coastal island runway "
            "looking past white threshold bars toward sparkling turquoise ocean water beyond the paved "
            "departure end under dramatic morning clouds, subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10092,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric miniature airport runway diorama showing a clean "
            "dark grey runway segment followed by a brick-red stopway pad and an emerald clearway grass "
            "strip leading to tiny blue water waves, tilt-shift depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "RWY 09 // DISPLACED THR",
            "start_val": 2400,
            "end_val": 1950,
            "unit": "m",
            "warn_banner": "▲ DISPLACED THRESHOLD AHEAD",
            "question_pill": "ROLL ON IT FOR TAKEOFF?",
        },
        act2_pills={
            "top_pill": "ANNEX 14 DECLARED LENGTHS",
            "left_top": "TORA + STOPWAY",
            "left_hero": "ASDA",
            "left_sub": "MUST SUPPORT REJECTED T/O",
            "right_top": "TORA + CLEARWAY",
            "right_hero": "TODA",
            "right_sub": "AIRSPACE ONLY (<= 1.5x TORA)",
        },
        act3_board={
            "fcom_file": "ANNEX_14_SEC_2_8.DOC",
            "fcom_tag": "DISPLACED THR // TORA OK",
            "chart_file": "DECLARED_DISTANCES.PDF",
            "chart_type": "bars_compare",
            "x_label": "PUBLISHED RUNWAY DISTANCES (METERS) →",
            "y_label": "DIST",
            "marker_label": "LDA EXCLUDES DISPLACED",
            "bfl_pill": "CLEARWAY IS NON-LOAD-BEARING; STOPWAY IS FULL STRENGTH",
            "highlight_row": 3,
            "bars": [
                ("TORA", 2400, (2, 132, 199), "2,400 m (PAVED)"),
                ("ASDA", 2650, (225, 29, 72), "+250 m STOPWAY"),
                ("TODA", 2900, (5, 150, 105), "+500 m CLEARWAY"),
                ("LDA", 1950, (217, 119, 6), "1,950 m (-450 DISP)"),
            ],
        },
        act45_quiz={
            "headline_1": "TAKEOFF ROLL FROM BEHIND",
            "headline_2": "A DISPLACED THRESHOLD?",
            "opt_a_val": "ILLEGAL",
            "opt_a_sub": "CLOSED FOR T/O TOO",
            "opt_b_val": "PERMITTED",
            "opt_b_sub": "COUNTS TOWARD TORA",
            "correct_opt": "B",
            "verdict_banner": "LEGAL FOR T/O — ONLY LDA CUT!",
            "rules": [
                ("1. ASDA = TORA + SWY", "PAVED BRAKE LENGTH"),
                ("2. TODA = TORA + CWY", "MAX CWY = 50% TORA"),
                ("3. DISPLACED THR", "CUTS LDA — OK FOR TORA"),
            ],
        },
    ),

    "AIR_LAW_DOCS": _air_law(
        "AIR_LAW_DOCS",
        title="Chicago Art. 29 Mandatory Onboard Docs",
        exam_takeaway="International flights must carry C of R, C of A, Crew Licenses, Journey Log, Radio License, Noise Cert & Manifests (AOC for CAT).",
        transcript=(
            "Ramp inspectors climb the airstairs in Frankfurt twenty minutes before pushback. "
            "One missing ship document inside that flight bag, and this airliner never leaves the gate. "
            "Which papers are law? "
            "Chicago Convention Article Twenty Nine locks six core books onboard every international aircraft. "
            "Pack Certificates of Registration and Airworthiness, every crew member's license, the Journey Log Book, and the Aircraft Radio Station License. "
            "Add Passenger and Cargo Manifests whenever carrying people or freight, plus a Noise Certificate and certified Air Operator Certificate for commercial flights. "
            "Notice aircraft flight manuals and maintenance logs stay separate from ramp inspection law! "
            "Pilot call. EASA exam trap. "
            "Must an international airliner carry the owner's purchase bill of sale onboard under Article Twenty Nine? "
            "Three... Two... One. "
            "No! Registration and Airworthiness certificates belong in the flight bag, never ownership invoices. "
            "Save this rule: C of R and C of A, Journey Log plus Radio License, AOC and Noise Cert."
        ),
        pronunciation_hints="Article Twenty-Nine cleanly, AOC as A-O-C, C of R as see of R, EASA as ee-ah-sah",
        whisper_prompt="Article 29, Certificate of Registration, Airworthiness, Journey Log Book, Radio Station License, Manifests, AOC, bill of sale.",
        anchors={
            "eng_fail": ("missing", "document"),
            "fly_or_stop": ("papers", "law"),
            "act1_end": ("law",),
            "act2_start": ("chicago",),
            "asda_reveal": ("registration", "airworthiness"),
            "toda_reveal": ("journey", "radio"),
            "act2_end": ("license",),
            "act3_start": ("passenger", "cargo"),
            "asdr_draw": ("noise", "operator"),
            "todr_draw": ("separate", "ramp"),
            "v1_collide": ("law",),
            "act3_end": ("law",),
            "act4_start": ("pilot",),
            "quiz_go": ("nine", "twenty-nine", "29"),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("no", "registration"),
            "rule_1": ("registration", "airworthiness", "c"),
            "rule_2": ("journey", "radio"),
            "rule_3": ("aoc", "noise"),
        },
        seed_1=10101,
        act1_prompt=(
            "Photorealistic vertical moody shot of a civil aviation SAFA ramp inspector checking leather-bound "
            "aircraft ship certificates inside a brightly lit commercial jet cockpit before pushback at twilight, "
            "subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10102,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric miniature diorama of an open cream pilot leather flight "
            "bag beside a tiny white airliner showing color-coded passport booklets, stamped logbooks, and "
            "miniature radio badge, tilt-shift depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "SAFA CHECK // ART. 29",
            "start_val": 0,
            "end_val": 6,
            "unit": "DOCS",
            "warn_banner": "▲ RAMP AUDIT — MISSING PAPERS HOLD",
            "question_pill": "BILL OF SALE REQUIRED ONBOARD?",
        },
        act2_pills={
            "top_pill": "MANDATORY SHIP PAPERS",
            "left_top": "AIRFRAME CERT",
            "left_hero": "C OF R/A",
            "left_sub": "REGISTRATION + AIRWORTHINESS",
            "right_top": "CREW & RADIO",
            "right_hero": "LOG+LIC",
            "right_sub": "JOURNEY LOG + RADIO + CREW",
        },
        act3_board={
            "fcom_file": "CHICAGO_ART_29.DOC",
            "fcom_tag": "MANDATORY ONBOARD KIT",
            "chart_file": "RAMP_DOCUMENT_CHECKLIST.PDF",
            "chart_type": "rules_ladder",
            "x_label": "ARTICLE 29 & PART-CAT FLIGHT BAG CHECK",
            "y_label": "",
            "marker_label": "NO INVOICE NEEDED",
            "bfl_pill": "REMEMBER: C OF R + C OF A + LICENSES + JOURNEY LOG + RADIO + NOISE",
            "highlight_row": 3,
            "rows": [
                ("AIRFRAME", "C of R + C of A + Noise Cert", "Originals onboard every international leg", (2, 132, 199)),
                ("LOGS/COMMS", "Journey Log + Radio License", "Aircraft Station License + flight log", (5, 150, 105)),
                ("CAT / OPS", "Certified AOC Copy + Manifests", "Crew licenses + pax / cargo manifests", (217, 119, 6)),
                ("EXCLUDED", "Purchase Bill of Sale / Invoice", "Commercial receipt — NOT in Art. 29", (225, 29, 72)),
            ],
        },
        act45_quiz={
            "headline_1": "CARRY BILL OF SALE",
            "headline_2": "UNDER CHICAGO ART. 29?",
            "opt_a_val": "NOT REQUIRED",
            "opt_a_sub": "USE C OF R INSTEAD",
            "opt_b_val": "MANDATORY",
            "opt_b_sub": "NEEDED AT RAMP AUDIT",
            "correct_opt": "A",
            "verdict_banner": "C OF R PROVES REGISTRY — NO BILL!",
            "rules": [
                ("1. C OF R & C OF A", "PLUS JOURNEY LOGBOOK"),
                ("2. RADIO & LICENSES", "FOR EVERY FLIGHT CREW"),
                ("3. AOC + NOISE CERT", "FOR COMMERCIAL CAT OPS"),
            ],
        },
    ),

    # =========================================================================
    # DAY 3 (10 TOPICS)
    # =========================================================================
    "AIR_LAW_EMERGENCY": _air_law(
        "AIR_LAW_EMERGENCY",
        title="Emergency Squawks, MAYDAY & PIC Deviation",
        exam_takeaway="7700 Emergency, 7600 Comms Loss, 7500 Hijack; MAYDAY indicates grave/imminent danger; PIC may deviate as required for safety.",
        transcript=(
            "Both radios go stone silent inside dense winter IMC over Paris. "
            "Cabin crew chime twice while traffic surrounds your airway. "
            "Which four digits warn every controller below? "
            "Transponder codes tell your emergency before you even speak. "
            "Seven six zero zero flags total radio failure, seven five zero zero silently warns of unlawful hijack, and seven seven zero zero declares any general emergency. "
            "Pair the right call on guard: PAN PAN alerts ATC to urgent safety needs, whereas MAYDAY signals grave and imminent danger requiring immediate help. "
            "Crucially, in a genuine emergency, the Pilot in Command holds lawful power to break any Air Law rule to save lives! "
            "Pilot call. EASA exam trap. "
            "Your windshield shatters, and both radios drop dead — squawk seven six or seven seven today? "
            "Three... Two... One. "
            "Seven seven zero zero! Always squawk emergency when lives outweigh radio silence. "
            "Save this rule: 77 Emergency 76 Comms 75 Hijack, MAYDAY grave danger, file written report."
        ),
        pronunciation_hints="MAYDAY as may-day, PAN-PAN as pan pan, EASA as ee-ah-sah, IMC as I-M-C",
        whisper_prompt="7700, 7600, 7500, MAYDAY, PAN-PAN, Pilot-in-Command, squawk, radio failure, hijack, written report.",
        anchors={
            "eng_fail": ("silent", "imc"),
            "fly_or_stop": ("four", "digits"),
            "act1_end": ("below",),
            "act2_start": ("transponder",),
            "asda_reveal": ("radio", "hijack"),
            "toda_reveal": ("emergency",),
            "act2_end": ("emergency",),
            "act3_start": ("pair", "guard"),
            "asdr_draw": ("mayday", "danger"),
            "todr_draw": ("commander", "command", "rule"),
            "v1_collide": ("lives",),
            "act3_end": ("lives",),
            "act4_start": ("pilot",),
            "quiz_go": ("today", "seven-seven"),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("seven", "7700"),
            "rule_1": ("hijack", "comms", "75", "76"),
            "rule_2": ("mayday",),
            "rule_3": ("report", "written"),
        },
        seed_1=10111,
        act1_prompt=(
            "Photorealistic vertical close-up of a dark stormy airline cockpit radio pedestal with pilot "
            "fingers reaching for the transponder Mode A rotary knobs under glowing amber master caution lights, "
            "subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10112,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric miniature air traffic radar tower sending bright pulsing "
            "amber and crimson signal rings to a tiny white jet model above pastel cloud layers, tilt-shift "
            "depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "XPDR // EMERGENCY CODE",
            "start_val": 2000,
            "end_val": 7700,
            "unit": "SQ",
            "warn_banner": "▲ MAYDAY + GRAVE IMMINENT DANGER",
            "question_pill": "COMMS DEAD + SHATTERED GLASS?",
        },
        act2_pills={
            "top_pill": "EMERGENCY TRANSPONDER",
            "left_top": "COMMS / HIJACK",
            "left_hero": "76 / 75",
            "left_sub": "7600 NORDO · 7500 HIJACK",
            "right_top": "ALL EMERGENCIES",
            "right_hero": "7700",
            "right_sub": "HIGHEST PRIORITY SQUAWK",
        },
        act3_board={
            "fcom_file": "SERA_8015_ANNEX2.DOC",
            "fcom_tag": "PIC DEVIATION RULE",
            "chart_file": "SQUAWK_&_CALL_PRIORITY.PDF",
            "chart_type": "rules_ladder",
            "x_label": "ICAO DISTRESS, URGENCY & SQUAWK CODES",
            "y_label": "",
            "marker_label": "EMERGENCY > COMMS LOSS",
            "bfl_pill": "MAYDAY > PAN-PAN · DEVIATING PIC NOTIFIES & REPORTS IF ASKED",
            "highlight_row": 0,
            "rows": [
                ("7700 // MAYDAY", "Grave & Imminent Danger", "Immediate aid needed · wins priority", (225, 29, 72)),
                ("7600 // NORDO", "Loss of 2-Way Radio Comms", "Switch to 121.5 guard if able", (217, 119, 6)),
                ("7500 // HIJACK", "Unlawful Interference Onboard", "Silent squawk · special phrasing", (2, 132, 199)),
                ("PIC POWER", "Safety Deviation Authority", "PIC may breach rules in emergency", (5, 150, 105)),
            ],
        },
        act45_quiz={
            "headline_1": "CRACKED WINDSHIELD",
            "headline_2": "+ LOST RADIOS — SQUAWK?",
            "opt_a_val": "7600",
            "opt_a_sub": "RADIO FAILURE ONLY",
            "opt_b_val": "7700",
            "opt_b_sub": "EMERGENCY OVERRIDES",
            "correct_opt": "B",
            "verdict_banner": "SQUAWK 7700 — EMERGENCY WINS!",
            "rules": [
                ("1. 77-76-75 RULE", "ALIVE-COPS-KNIFE"),
                ("2. MAYDAY VS PAN", "DISTRESS VS URGENCY"),
                ("3. PIC DEVIATION", "SAFETY FIRST + REPORT"),
            ],
        },
    ),

    "AIR_LAW_FACILITATION": _air_law(
        "AIR_LAW_FACILITATION",
        title="Annex 9 Facilitation & Deportees",
        exam_takeaway="Under Annex 9, airlines handle repatriation of Inadmissible Persons, whereas States manage Deportees; crew carry a Crew Member Certificate.",
        transcript=(
            "Passport inspection stops a passenger cold at customs arrivals in Madrid. "
            "No visa, wrong border entry — someone must fly them back tonight. "
            "Does the airline pay, or the government? "
            "ICAO Annex Nine removes airport friction for baggage, health clearance, and General Declarations. "
            "Onboard, flight crews bypass ordinary tourist queues with an official Crew Member Certificate issued under ICAO rules. "
            "Now separate the two forced returnees: an Inadmissible Person fails entry right at the border, forcing the inbound airline to transport them back to origin or embarkation! "
            "A Deportee already entered illegally and gets removed strictly by State order. "
            "Pilot call. EASA exam trap. "
            "Who bears primary custody when an airport refuses a passenger an entry visa on arrival? "
            "Three... Two... One. "
            "The airline operator! You carry inadmissible travelers back out. "
            "Save this rule: Annex Nine facilitation, airline takes inadmissibles, State handles deportees."
        ),
        pronunciation_hints="ICAO as eye-kay-oh, Inadmissible cleanly, EASA as ee-ah-sah",
        whisper_prompt="Annex 9, Facilitation, General Declaration, Crew Member Certificate, Inadmissible Person, Deportee, airline, State.",
        anchors={
            "eng_fail": ("customs", "arrivals"),
            "fly_or_stop": ("airline", "government"),
            "act1_end": ("government",),
            "act2_start": ("annex", "nine"),
            "asda_reveal": ("general", "declarations"),
            "toda_reveal": ("crew", "certificate"),
            "act2_end": ("rules",),
            "act3_start": ("separate",),
            "asdr_draw": ("inadmissible",),
            "todr_draw": ("deportee", "state"),
            "v1_collide": ("order",),
            "act3_end": ("order",),
            "act4_start": ("pilot",),
            "quiz_go": ("arrival",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("airline",),
            "rule_1": ("facilitation",),
            "rule_2": ("inadmissibles", "inadmissible"),
            "rule_3": ("deportees", "deportee"),
        },
        seed_1=10121,
        act1_prompt=(
            "Photorealistic vertical documentary shot of an international airport customs passport control hall "
            "at twilight with illuminated inspection booths and blurred uniformed airline crew walking past with "
            "rollaboard luggage, subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10122,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric miniature airport border terminal showing two pastel "
            "gates: airline staff desk beside a tiny white model jet on one side and a government passport booth "
            "on the other, tilt-shift depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "ANNEX 9 // BORDER STOP",
            "start_val": 1,
            "end_val": 9,
            "unit": "ANNEX",
            "warn_banner": "▲ NO ENTRY VISA — REPATRIATION",
            "question_pill": "AIRLINE DUTY — OR STATE ESCORT?",
        },
        act2_pills={
            "top_pill": "ANNEX 9 BORDER CLEARANCE",
            "left_top": "CREW ID PAPER",
            "left_hero": "CMC",
            "left_sub": "VISA-FREE ENTRY DUTY",
            "right_top": "CUSTOMS FORM",
            "right_hero": "GEN DEC",
            "right_sub": "NO CONSULAR TAX FEES",
        },
        act3_board={
            "fcom_file": "ICAO_ANNEX_9.DOC",
            "fcom_tag": "INAD VS DEPORTEE",
            "chart_file": "BORDER_DUTY_SPLIT.PDF",
            "chart_type": "rules_ladder",
            "x_label": "FACILITATION DOCUMENTS & RETURN DUTIES",
            "y_label": "",
            "marker_label": "AIRLINE TAKES INAD",
            "bfl_pill": "PIC MUST RECEIVE NOTICE WHEN ESCORTED PASSENGERS BOARD",
            "highlight_row": 0,
            "rows": [
                ("INAD PERSON", "Refused Entry at Border", "Inbound Airline must fly passenger back", (225, 29, 72)),
                ("DEPORTEE", "Previously Entered State", "State authorities order & fund removal", (2, 132, 199)),
                ("CMC CARD", "Crew Member Certificate", "Replaces passport/visa on duty layovers", (5, 150, 105)),
                ("GEN DEC", "General Declaration Form", "Replaces separate crew/health forms", (217, 119, 6)),
            ],
        },
        act45_quiz={
            "headline_1": "PASSENGER REFUSED ENTRY",
            "headline_2": "AT BORDER — WHO RETURNS?",
            "opt_a_val": "AIRLINE OP",
            "opt_a_sub": "INBOUND CARRIER PAYS",
            "opt_b_val": "HOST STATE",
            "opt_b_sub": "TREATED AS DEPORTEE",
            "correct_opt": "A",
            "verdict_banner": "AIRLINE CARRIES INAD BACK!",
            "rules": [
                ("1. ANNEX 9 DOCS", "GEN DEC & CMC CREW ID"),
                ("2. INADMISSIBLE", "AIRLINE FLIES THEM BACK"),
                ("3. DEPORTEE", "STATE ORDER & ESCORT"),
            ],
        },
    ),

    "AIR_LAW_GROUND_OPS": _air_law(
        "AIR_LAW_GROUND_OPS",
        title="Marshalling Signals & Apron Safety",
        exam_takeaway="Crossed illuminated wands overhead always mean STOP; ground vehicles always yield to taxiing aircraft on the apron.",
        transcript=(
            "Narrow stand between two jumbo wingtips in pouring night rain. "
            "Orange wands glow directly ahead of your nose gear, suddenly snapping into a giant X above the marshaller's head. "
            "Brakes now, or keep creeping? "
            "Standard Annex Two marshalling signals leave zero room for guesswork on dark aprons. "
            "Arms waving overhead toward your chest mean proceed straight ahead; pointing one wand up while tracing a throat-slash means cut engines right away. "
            "Check right-of-way across the entire movement area: any fuel truck, tug, or bus always gives way to a taxiing or towed aircraft, and jet blast demands strict safety cones. "
            "Pilot call. EASA exam trap. "
            "Your marshaller crosses both lighted wands sharply above their head — what command is that? "
            "Three... Two... One. "
            "Emergency Stop! Bring all wheels to a dead halt at once. "
            "Save this rule: crossed wands stop, slash throat cut engines, vehicles yield to aircraft."
        ),
        pronunciation_hints="Annex Two cleanly, EASA as ee-ah-sah, marshaller cleanly",
        whisper_prompt="Marshalling signals, crossed wands, overhead, stop, cut engines, vehicles give way, taxiing aircraft, jet blast.",
        anchors={
            "eng_fail": ("giant", "x"),
            "fly_or_stop": ("brakes", "creeping"),
            "act1_end": ("creeping",),
            "act2_start": ("standard", "annex"),
            "asda_reveal": ("straight", "ahead"),
            "toda_reveal": ("cut", "engines"),
            "act2_end": ("away",),
            "act3_start": ("right-of-way", "movement"),
            "asdr_draw": ("fuel", "tug"),
            "todr_draw": ("jet", "blast"),
            "v1_collide": ("cones",),
            "act3_end": ("cones",),
            "act4_start": ("pilot",),
            "quiz_go": ("command",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("emergency", "stop"),
            "rule_1": ("crossed", "wands"),
            "rule_2": ("cut", "engines"),
            "rule_3": ("vehicles", "aircraft"),
        },
        seed_1=10131,
        act1_prompt=(
            "Photorealistic vertical cockpit view looking down through rain-streaked windshield onto a wet "
            "airport gate stand at night where a ground marshaller in neon vest holds bright glowing orange "
            "wands crossed overhead in front of a jet nose, subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10132,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric miniature airport apron diorama showing a tiny white "
            "jetliner taxiing past yellow painted stand lines while miniature fuel trucks pause behind red "
            "yield markings, tilt-shift depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "APRON TAXI // STAND 14",
            "start_val": 12,
            "end_val": 0,
            "unit": "KT",
            "warn_banner": "▲ CROSSED WANDS SIGNAL AHEAD",
            "question_pill": "SLOW DOWN — OR DEAD STOP?",
        },
        act2_pills={
            "top_pill": "ANNEX 2 APRON COMMANDS",
            "left_top": "ARMS BECKONING UP",
            "left_hero": "AHEAD",
            "left_sub": "PROCEED FORWARD",
            "right_top": "NECK SLASH MOTION",
            "right_hero": "CUT",
            "right_sub": "SHUT DOWN ENGINES",
        },
        act3_board={
            "fcom_file": "ANNEX_2_APPX_1.DOC",
            "fcom_tag": "MARSHALLING // APRON LAW",
            "chart_file": "GROUND_SIGNALS_PRIORITY.PDF",
            "chart_type": "rules_ladder",
            "x_label": "STANDARD MARSHALLING & RIGHT-OF-WAY",
            "y_label": "",
            "marker_label": "CROSSED WANDS = STOP",
            "bfl_pill": "VEHICLES ALWAYS GIVE WAY TO TAXIING OR TOWED AIRCRAFT",
            "highlight_row": 0,
            "rows": [
                ("CROSS WANDS", "Arms Crossed Overhead", "STOP immediately (set parking brake)", (225, 29, 72)),
                ("SLASH THROAT", "Horizontal Hand Across Neck", "Cut all engines immediately", (217, 119, 6)),
                ("PALMS INWARD", "Wands Swept Up/Inward", "Move straight ahead · turn into turn", (5, 150, 105)),
                ("APRON YIELD", "Ground Vehicle Hierarchy", "Tugs/trucks yield to taxiing aircraft", (2, 132, 199)),
            ],
        },
        act45_quiz={
            "headline_1": "MARSHALLER CROSSES WANDS",
            "headline_2": "ABOVE HEAD — ACTION?",
            "opt_a_val": "STOP NOW",
            "opt_a_sub": "IMMEDIATE BRAKES",
            "opt_b_val": "CUT ENGINE",
            "opt_b_sub": "SHUT FUEL LEVERS",
            "correct_opt": "A",
            "verdict_banner": "IMMEDIATE FULL STOP!",
            "rules": [
                ("1. CROSSED WANDS", "STOP IMMEDIATELY"),
                ("2. NECK SLASH", "CUT ALL ENGINES"),
                ("3. VEHICLES YIELD", "TO TAXIING AIRCRAFT"),
            ],
        },
    ),

    "AIR_LAW_HOLDING": _air_law(
        "AIR_LAW_HOLDING",
        title="PANS-OPS Holding Patterns & Entries",
        exam_takeaway="Standard holds turn RIGHT; outbound leg is 1.0 min ≤ FL140 and 1.5 min > FL140; entry splits 180° Direct, 110° Parallel, 70° Teardrop.",
        transcript=(
            "Traffic backs up over Heathrow at twenty thousand feet. "
            "ATC clears you into the VOR hold on radial two-seven-zero, inbound oh-nine-zero. "
            "Turn right right away, or fly out opposite first? "
            "Unless charts say left hand, every ICAO standard hold executes right turns. "
            "Watch your stopwatch on the outbound leg: fly one minute at or below Flight Level One Forty, then jump to one point five minutes above Flight Level One Forty. "
            "Entry always follows three clean sectors around the inbound track with five degrees flexibility: Sector One Parallel at one ten degrees, Sector Two Offset Teardrop at seventy degrees, and huge Sector Three Direct at one eighty. "
            "Pilot call. EASA exam trap. "
            "You approach at Flight Level One Eighty in a standard hold — how long is your outbound leg? "
            "Three... Two... One. "
            "One point five minutes! Everything above Flight Level One Forty gets ninety seconds. "
            "Save this rule: standard turns right, one minute to One Forty, ninety seconds higher."
        ),
        pronunciation_hints="PANS-OPS as panz-ops, VOR as V-O-R, EASA as ee-ah-sah",
        whisper_prompt="Holding pattern, right-hand turns, one minute, 1.5 minutes, FL140, FL180, Parallel 110, Teardrop 70, Direct 180.",
        anchors={
            "eng_fail": ("hold", "radial"),
            "fly_or_stop": ("right", "first"),
            "act1_end": ("first",),
            "act2_start": ("charts",),
            "asda_reveal": ("right", "right-hand"),
            "toda_reveal": ("forty", "one-forty", "140"),
            "act2_end": ("forty", "one-forty", "140"),
            "act3_start": ("entry", "sectors"),
            "asdr_draw": ("parallel",),
            "todr_draw": ("teardrop", "seventy"),
            "v1_collide": ("direct",),
            "act3_end": ("eighty", "one-eighty", "180"),
            "act4_start": ("pilot",),
            "quiz_go": ("leg",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("five", "1.5"),
            "rule_1": ("right",),
            "rule_2": ("minute",),
            "rule_3": ("ninety",),
        },
        seed_1=10141,
        act1_prompt=(
            "Photorealistic vertical cockpit shot showing a glowing glass navigation display depicting a "
            "racetrack holding pattern magenta loop over a white VOR beacon symbol in twilight flight above "
            "broken stratus clouds, subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10142,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric miniature sky diorama showing a pastel translucent "
            "racetrack loop hovering above a tiny blue VOR cone beacon divided into three colored pie slices "
            "with a tiny model airliner entering, tilt-shift depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "HOLD LEG // FL180",
            "start_val": 60,
            "end_val": 90,
            "unit": "SEC",
            "warn_banner": "▲ ENTERING HOLDING FIX ABOVE FL140",
            "question_pill": "1.0 MIN — OR 1.5 MIN OUTBOUND?",
        },
        act2_pills={
            "top_pill": "STANDARD HOLD TIMING",
            "left_top": "AT / BELOW FL140",
            "left_hero": "1.0 MIN",
            "left_sub": "RIGHT-HAND TURNS STD",
            "right_top": "ABOVE FL140",
            "right_hero": "1.5 MIN",
            "right_sub": "90 SEC OUTBOUND LEG",
        },
        act3_board={
            "fcom_file": "DOC_8168_HOLDING.DOC",
            "fcom_tag": "+/- 5 DEG FLEXIBILITY",
            "chart_file": "THREE_ENTRY_SECTORS.PDF",
            "chart_type": "bars_compare",
            "x_label": "SECTOR WIDTH AROUND FIX (DEG) →",
            "y_label": "ENTRY",
            "marker_label": "FL180 = 1.5 MIN",
            "bfl_pill": "MAX BANK 25° OR RATE ONE (3°/SEC) — WHICHEVER LESS",
            "highlight_row": 2,
            "bars": [
                ("SEC 2 OFFSET", 70, (217, 119, 6), "70° TEARDROP"),
                ("SEC 1 PARALLEL", 110, (2, 132, 199), "110° PARALLEL"),
                ("SEC 3 DIRECT", 180, (5, 150, 105), "180° DIRECT"),
            ],
        },
        act45_quiz={
            "headline_1": "STANDARD HOLD AT FL180",
            "headline_2": "OUTBOUND TIME IS?",
            "opt_a_val": "1.0 MIN",
            "opt_a_sub": "60 SECONDS ALWAYS",
            "opt_b_val": "1.5 MIN",
            "opt_b_sub": "90 SECONDS > FL140",
            "correct_opt": "B",
            "verdict_banner": "1.5 MINUTES ABOVE FL140!",
            "rules": [
                ("1. RIGHT TURNS STD", "UNLESS CHARTED LEFT"),
                ("2. OUTBOUND TIMING", "1M <=FL140 · 1.5M ABOVE"),
                ("3. +/- 5 DEG BUFFER", "DIRECT / PARALLEL / OFFSET"),
            ],
        },
    ),

    "AIR_LAW_IFR_VFR": _air_law(
        "AIR_LAW_IFR_VFR",
        title="SERA VMC Minima: FL100, 1500m & Class G",
        exam_takeaway="VMC requires 8 km visibility at/above FL100 and 5 km below, always 1500 m horizontal / 1000 ft vertical from cloud (except Class G ≤3000 ft).",
        transcript=(
            "Drifting cloud deck closes fast at eleven thousand feet in Class Charlie sky. "
            "Your forward visibility settles around six kilometers while staying miles clear of stratus. "
            "Still legal VFR, or instant bust? "
            "Remember the golden Flight Level One Hundred ceiling across controlled sky. "
            "At or above Flight Level One Hundred you need eight full kilometers visibility; drop below One Hundred and five kilometers opens the door — always keeping fifteen hundred meters horizontal and one thousand feet vertical from cloud. "
            "Only Class Golf low at or below three thousand feet drops to clear of cloud, in sight of ground, and five kilometers — or one point five slowly below one forty knots. "
            "Pilot call. EASA exam trap. "
            "Cruising VFR at Flight Level One Ten with six kilometers visibility — legal VMC? "
            "Three... Two... One. "
            "Illegal! Above Flight Level One Hundred demands eight full kilometers visibility. "
            "Save this rule: Eight K above One Hundred, Five K below, Fifteen Hundred by One Thousand."
        ),
        pronunciation_hints="SERA as see-rah, VMC as V-M-C, VFR as V-F-R, EASA as ee-ah-sah",
        whisper_prompt="VMC minima, FL100, eight kilometers, five kilometers, 1500 meters, 1000 feet, Class G, FL110, 6 km.",
        anchors={
            "eng_fail": ("six", "kilometers"),
            "fly_or_stop": ("legal", "bust"),
            "act1_end": ("bust",),
            "act2_start": ("golden",),
            "asda_reveal": ("eight", "kilometers"),
            "toda_reveal": ("five", "thousand"),
            "act2_end": ("cloud",),
            "act3_start": ("golf", "three"),
            "asdr_draw": ("three", "thousand"),
            "todr_draw": ("sight", "ground"),
            "v1_collide": ("forty", "one-forty", "140"),
            "act3_end": ("knots",),
            "act4_start": ("pilot",),
            "quiz_go": ("vmc",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("illegal",),
            "rule_1": ("eight",),
            "rule_2": ("five",),
            "rule_3": ("thousand", "one-thousand", "1000"),
        },
        seed_1=10151,
        act1_prompt=(
            "Photorealistic vertical wingtip and cockpit view of a light twin aircraft cruising in hazy blue "
            "high-altitude sunshine between puffy white cumulus clouds at 11000 feet, slightly misty horizon, "
            "subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10152,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric miniature sky cube divided by a crisp horizontal glass "
            "divider at mid-altitude showing larger spacing arrows in upper sky and tighter ground-hugging clouds "
            "below, tiny pastel airplane, tilt-shift depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "CLASS C // VMC CHECK",
            "start_val": 8.0,
            "end_val": 6.0,
            "decimals": 1,
            "unit": "KM",
            "warn_banner": "▲ FL110 VISIBILITY BELOW 8 KM!",
            "question_pill": "STILL VMC — OR IFR REQUIRED?",
        },
        act2_pills={
            "top_pill": "VMC FLIGHT VISIBILITY SPLIT",
            "left_top": "BELOW FL100",
            "left_hero": "5 KM",
            "left_sub": "1500M HORIZ / 1000FT VERT",
            "right_top": "AT / ABOVE FL100",
            "right_hero": "8 KM",
            "right_sub": "1500M HORIZ / 1000FT VERT",
        },
        act3_board={
            "fcom_file": "SERA_5001_VMC.DOC",
            "fcom_tag": "CLASS G <= 3000 FT",
            "chart_file": "VMC_CLOUD_DISTANCES.PDF",
            "chart_type": "rules_ladder",
            "x_label": "DAYTIME VMC WEATHER MINIMA BY BAND",
            "y_label": "",
            "marker_label": "FL110 NEEDS 8 KM",
            "bfl_pill": "SVFR IN CTR BY DAY: >= 1,500 M VISIBILITY & CLEAR OF CLOUD",
            "highlight_row": 0,
            "rows": [
                (">= FL100 A-G", "8 km Flight Visibility", "1500 m Horiz · 1000 ft Vert from cloud", (225, 29, 72)),
                ("< FL100 C-G", "5 km Flight Visibility", "1500 m Horiz · 1000 ft Vert from cloud", (2, 132, 199)),
                ("G <=3000 FT", "5 km (1.5 km <=140 kt)", "Clear of cloud & in sight of surface", (5, 150, 105)),
                ("CLASS A", "IFR Clearances Strictly Only", "Zero VFR permitted (except SVFR in CTR)", (217, 119, 6)),
            ],
        },
        act45_quiz={
            "headline_1": "VFR AT FL110 WITH 6 KM",
            "headline_2": "VISIBILITY — LEGAL VMC?",
            "opt_a_val": "ILLEGAL",
            "opt_a_sub": "FL100+ NEEDS 8 KM MIN",
            "opt_b_val": "LEGAL VFR",
            "opt_b_sub": "5 KM APPLIES ALL FL",
            "correct_opt": "A",
            "verdict_banner": "BUST — 8 KM MANDATORY AT FL110!",
            "rules": [
                ("1. >= FL100 MINIMA", "8 KM FLIGHT VISIBILITY"),
                ("2. < FL100 CLASS C-G", "5 KM FLIGHT VISIBILITY"),
                ("3. CLOUD MARGIN", "1500 M HORIZ / 1000 FT"),
            ],
        },
    ),

    "AIR_LAW_INSTRUMENT": _air_law(
        "AIR_LAW_INSTRUMENT",
        title="5 Segments of an Instrument Approach",
        exam_takeaway="Every instrument approach has Arrival, Initial, Intermediate, Final & Missed segments; precision uses DA(H) while non-precision uses MDA(H).",
        transcript=(
            "Descending down a stepped non-precision VOR approach in thick sea fog. "
            "One hundred feet early, your hands reach for the thrust levers to level off above the rocks. "
            "Wait — fly past MDA, or climb away? "
            "ICAO divides every instrument approach cleanly into five distinct segments, each shrinking obstacle clearance step by step. "
            "Arrival guides you from enroute to the Initial Approach Fix with a thousand feet minimum margin; Intermediate slows the jet with five hundred feet clearance. "
            "Final Approach protects around two-fifty to three hundred feet, splitting precision ILS Decision Altitude — where you dip slightly during a go-around — from non-precision MDA, a rock-solid floor you never cross! "
            "Pilot call. EASA exam trap. "
            "Can a pilot momentarily descend below MDA while initiating a missed approach? "
            "Three... Two... One. "
            "Never! Unlike Decision Altitude, you level off early enough to protect MDA. "
            "Save this rule: five segments, DA allows transient dip, never bust MDA."
        ),
        pronunciation_hints="VOR as V-O-R, ILS as I-L-S, DA as D-A, MDA as M-D-A, EASA as ee-ah-sah",
        whisper_prompt="Instrument approach, Arrival, Initial, Intermediate, Final, Missed, 1000 feet, 500 feet, DA, MDA, Decision Altitude.",
        anchors={
            "eng_fail": ("level", "rocks"),
            "fly_or_stop": ("mda", "climb"),
            "act1_end": ("away",),
            "act2_start": ("divides",),
            "asda_reveal": ("initial", "thousand"),
            "toda_reveal": ("intermediate", "five"),
            "act2_end": ("clearance",),
            "act3_start": ("final", "protects"),
            "asdr_draw": ("precision", "decision"),
            "todr_draw": ("non-precision", "floor"),
            "v1_collide": ("cross",),
            "act3_end": ("cross",),
            "act4_start": ("pilot",),
            "quiz_go": ("approach",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("never", "unlike"),
            "rule_1": ("segments",),
            "rule_2": ("dip",),
            "rule_3": ("mda",),
        },
        seed_1=10161,
        act1_prompt=(
            "Photorealistic vertical cockpit view emerging beneath thick dark coastal fog toward faint "
            "approach lights gleaming ahead while amber altitude alert indicators illuminate in the panel, "
            "subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10162,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric miniature staircase descent path above pastel green "
            "hills showing five stepped flight blocks dropping toward a miniature runway threshold, "
            "tilt-shift depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "NON-PREC // VOR APP",
            "start_val": 1200,
            "end_val": 420,
            "unit": "FT",
            "warn_banner": "▲ APPROACHING HARD MDA FLOOR",
            "question_pill": "DIP BELOW MDA — OR LEVEL OFF?",
        },
        act2_pills={
            "top_pill": "5 PANS-OPS APPROACH SEGMENTS",
            "left_top": "INITIAL / INTERMED",
            "left_hero": "1000/500",
            "left_sub": "FT OBSTACLE CLEARANCE",
            "right_top": "FINAL / MISSED",
            "right_hero": "DA vs MDA",
            "right_sub": "PRECISION VS HARD FLOOR",
        },
        act3_board={
            "fcom_file": "DOC_8168_APPROACH.DOC",
            "fcom_tag": "MDA IS A HARD FLOOR",
            "chart_file": "APPROACH_SEGMENTS_MOC.PDF",
            "chart_type": "rules_ladder",
            "x_label": "FIVE INSTRUMENT APPROACH SEGMENTS",
            "y_label": "",
            "marker_label": "NEVER CROSS MDA",
            "bfl_pill": "MISSED APPROACH ALSO SPLITS INTO INITIAL, INTERMEDIATE & FINAL",
            "highlight_row": 2,
            "rows": [
                ("01-02 // INIT", "Arrival -> Initial (IAF->IF)", "Minimum Obstacle Clearance >= 1,000 ft", (2, 132, 199)),
                ("03 // INTERM", "Intermediate (IF->FAF)", "Decelerate · gear/flaps · MOC >= 500 ft", (5, 150, 105)),
                ("04 // FINAL", "Precision DA vs Non-Prec MDA", "DA allows dip; MDA NEVER descended below", (225, 29, 72)),
                ("05 // MISSED", "MAPt to Holding Fix", "Follow published gradient (2.5% min)", (217, 119, 6)),
            ],
        },
        act45_quiz={
            "headline_1": "MOMENTARY DIP BELOW MDA",
            "headline_2": "ON MISSED APPROACH?",
            "opt_a_val": "FORBIDDEN",
            "opt_a_sub": "START GO-AROUND EARLY",
            "opt_b_val": "PERMITTED",
            "opt_b_sub": "SAME AS ILS DA(H)",
            "correct_opt": "A",
            "verdict_banner": "NEVER — MDA IS AN ABSOLUTE FLOOR!",
            "rules": [
                ("1. 5 APPROACH PARTS", "ARR-INIT-INT-FIN-MISS"),
                ("2. ILS USES DA(H)", "ALTITUDE LOSS ALLOWED"),
                ("3. VOR/NDB USES MDA", "HARD ALTITUDE FLOOR"),
            ],
        },
    ),

    "AIR_LAW_INTERCEPT": _air_law(
        "AIR_LAW_INTERCEPT",
        title="Civil Interception Signals (Annex 2)",
        exam_takeaway="Wing rocking means Follow Me; abrupt 90° climbing left breakaway means Proceed; gear down + steady landing lights over RWY means Land Here.",
        transcript=(
            "Supersonic shadow pulls smoothly off your left cockpit window. "
            "An armed fighter jet dips both wings and flashes its navigation lights. "
            "Keep your heading, or turn after him? "
            "Every interceptor follows universal Annex Two visual signals even when radios jam. "
            "Rocking wings slowly ahead from your left side always means: You are intercepted, follow me! "
            "An abrupt breaking turn — climbing ninety degrees left without crossing your nose — gives permission to proceed on course. "
            "Then over an airport, lowering landing gear and shining steady landing lights instructs you to land right here — while your own cockpit squawks seven-seven-zero-zero and calls one-two-one decimal five. "
            "Pilot call. EASA exam trap. "
            "An interceptor executes a sudden climbing ninety-degree turn up and left away from your nose — what signal is that? "
            "Three... Two... One. "
            "You may proceed! Resume your cleared flight plan immediately. "
            "Save this rule: rock wings follow me, climbing breakaway proceed, gear down land here."
        ),
        pronunciation_hints="Annex Two cleanly, 121.5 as one-two-one decimal five, EASA as ee-ah-sah",
        whisper_prompt="Interceptor, rock wings, follow me, breaking turn, 90 degrees left, you may proceed, landing gear, 7700, 121.5.",
        anchors={
            "eng_fail": ("dips", "wings"),
            "fly_or_stop": ("heading", "turn"),
            "act1_end": ("him",),
            "act2_start": ("interceptor",),
            "asda_reveal": ("rocking", "follow"),
            "toda_reveal": ("abrupt", "proceed"),
            "act2_end": ("course",),
            "act3_start": ("airport", "lowering"),
            "asdr_draw": ("landing", "lights"),
            "todr_draw": ("squawks",),
            "v1_collide": ("decimal",),
            "act3_end": ("five",),
            "act4_start": ("pilot",),
            "quiz_go": ("that",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("proceed",),
            "rule_1": ("rock", "follow"),
            "rule_2": ("breakaway", "proceed"),
            "rule_3": ("gear", "land"),
        },
        seed_1=10171,
        act1_prompt=(
            "Photorealistic vertical shot from an airliner cockpit side window looking at a sleek military "
            "interceptor fighter jet banking slightly off the left wingtip high above dramatic cumulus clouds "
            "in golden afternoon light, subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10172,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric sky diorama showing a tiny white model airliner "
            "beside a sleek grey interceptor fighter jet gently tilting its wings ahead and to the left over "
            "a pastel runway island, tilt-shift depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "GUARD // INTERCEPT",
            "start_val": 118.1,
            "end_val": 121.5,
            "decimals": 1,
            "unit": "MHz",
            "warn_banner": "▲ VISUAL INTERCEPT SIGNALS ACTIVE",
            "question_pill": "CLIMBING 90° LEFT — WHAT MEANING?",
        },
        act2_pills={
            "top_pill": "INTERCEPTOR VISUAL SIGNALS",
            "left_top": "SERIES 1 // FOLLOW",
            "left_hero": "ROCK WNG",
            "left_sub": "FOLLOW + FLASH NAV LIGHTS",
            "right_top": "SERIES 2 // CLEAR",
            "right_hero": "BREAK 90",
            "right_sub": "CLIMB LEFT = PROCEED",
        },
        act3_board={
            "fcom_file": "ANNEX_2_APPX_2.DOC",
            "fcom_tag": "SQUAWK 7700 + 121.5",
            "chart_file": "INTERCEPTION_CODES.PDF",
            "chart_type": "rules_ladder",
            "x_label": "FIGHTER SIGNALS & CIVIL CREW ACKNOWLEDGEMENT",
            "y_label": "",
            "marker_label": "90° BREAK = PROCEED",
            "bfl_pill": "CIVIL ACK FOR FOLLOW/PROCEED = ROCK WINGS & FLASH LIGHTS",
            "highlight_row": 1,
            "rows": [
                ("ROCK WINGS", "By Day or Night + Flash Lights", "Intercepted — Follow Me (ack: rock wings)", (217, 119, 6)),
                ("90° BREAK UP", "Climbing Left Turn Crossing Away", "You may proceed! Resume own navigation", (5, 150, 105)),
                ("GEAR + LIGHTS", "Circling Aerodrome + Steady Light", "Land at this aerodrome (ack: lower gear)", (2, 132, 199)),
                ("CIVIL SQUAWK", "Cockpit Checklist Immediately", "Squawk 7700 + Call 121.5 MHz + Notify ATC", (225, 29, 72)),
            ],
        },
        act45_quiz={
            "headline_1": "FIGHTER BREAKS UPWARDS",
            "headline_2": "90° LEFT AWAY — MEANS?",
            "opt_a_val": "FOLLOW ME",
            "opt_a_sub": "TURN LEFT BEHIND",
            "opt_b_val": "PROCEED",
            "opt_b_sub": "CLEARED ON COURSE",
            "correct_opt": "B",
            "verdict_banner": "YOU MAY PROCEED ON ROUTE!",
            "rules": [
                ("1. ROCK WINGS", "INTERCEPTED — FOLLOW ME"),
                ("2. 90° CLIMBING LEFT", "YOU MAY PROCEED"),
                ("3. GEAR + LIGHTS", "LAND HERE · SQ 7700"),
            ],
        },
    ),

    "AIR_LAW_INT_LAW": _air_law(
        "AIR_LAW_INT_LAW",
        title="Chicago 1944, Cabotage & Freedoms of the Air",
        exam_takeaway="Article 1 establishes complete and exclusive national airspace sovereignty; Article 7 reserves domestic cabotage; Freedoms 1–2 are technical, 3–5 commercial.",
        transcript=(
            "European carrier loads domestic passengers in New York bound solely for Chicago. "
            "Even if fuel tanks are full and slots sit wide open, federal regulators slam the gate shut. "
            "Which international treaty locks down domestic routes? "
            "The Nineteen Forty-Four Chicago Convention sets the bedrock of global aviation. "
            "Article One grants every State complete and exclusive sovereignty over the airspace above its territory — while Article Seven safeguards domestic cabotage for national airlines alone. "
            "Across borders, Five Core Freedoms unlock the sky: First overflies without landing, Second stops only for fuel or repairs, Third and Fourth fly home passengers out and back, and Fifth picks up foreign traffic onward! "
            "Pilot call. EASA exam trap. "
            "Stopping in a foreign airport solely for fuel and maintenance uses which Freedom of the Air? "
            "Three... Two... One. "
            "The Second Freedom! Remember: First overflies, Second lands for tech stops only. "
            "Save this rule: Article One sovereignty, Article Seven cabotage, First and Second non-traffic."
        ),
        pronunciation_hints="Cabotage as kab-uh-tahj, ICAO as eye-kay-oh, EASA as ee-ah-sah",
        whisper_prompt="Chicago Convention, 1944, Article 1, sovereignty, Article 7, cabotage, First Freedom, Second Freedom, Fifth Freedom, fuel.",
        anchors={
            "eng_fail": ("slam", "shut"),
            "fly_or_stop": ("treaty", "routes"),
            "act1_end": ("routes",),
            "act2_start": ("chicago",),
            "asda_reveal": ("sovereignty",),
            "toda_reveal": ("cabotage",),
            "act2_end": ("alone",),
            "act3_start": ("freedoms", "unlock"),
            "asdr_draw": ("overflies",),
            "todr_draw": ("fuel", "repairs"),
            "v1_collide": ("fifth",),
            "act3_end": ("onward",),
            "act4_start": ("pilot",),
            "quiz_go": ("air",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("second", "freedom"),
            "rule_1": ("sovereignty",),
            "rule_2": ("cabotage",),
            "rule_3": ("non-traffic", "first"),
        },
        seed_1=10181,
        act1_prompt=(
            "Photorealistic vertical exterior shot of a widebody airliner boarding passengers at a sunset "
            "airport jetbridge with dramatic international flag poles and illuminated control tower behind, "
            "subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10182,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric miniature map table showing three pastel country islands "
            "separated by ocean water with tiny arched flight bridges connecting airports — one overflying, "
            "one touching down for fuel, tilt-shift depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "CHICAGO // ART. 1 & 7",
            "start_val": 1944,
            "end_val": 7,
            "unit": "ART",
            "warn_banner": "▲ CABOTAGE ROUTE DENIED BY LAW",
            "question_pill": "FUEL STOP ABROAD — WHICH FREEDOM?",
        },
        act2_pills={
            "top_pill": "CHICAGO CONVENTION 1944",
            "left_top": "ARTICLE 1 // SKY",
            "left_hero": "SOVEREIGN",
            "left_sub": "COMPLETE & EXCLUSIVE",
            "right_top": "ARTICLE 7 // DOMESTIC",
            "right_hero": "CABOTAGE",
            "right_sub": "OWN CARRIERS RESERVED",
        },
        act3_board={
            "fcom_file": "CHICAGO_1944_FREEDOMS.DOC",
            "fcom_tag": "1st & 2nd = NON-TRAFFIC",
            "chart_file": "FIVE_FREEDOMS_OF_AIR.PDF",
            "chart_type": "rules_ladder",
            "x_label": "TRANSIT AGREEMENT vs COMMERCIAL RIGHTS",
            "y_label": "",
            "marker_label": "2ND = TECHNICAL STOP",
            "bfl_pill": "BILATERAL AGREEMENTS GRANT 3RD, 4TH & 5TH COMMERCIAL FREEDOMS",
            "highlight_row": 1,
            "rows": [
                ("1ST FREEDOM", "Overfly Foreign State (No Land)", "Technical transit right (non-commercial)", (2, 132, 199)),
                ("2ND FREEDOM", "Land for Non-Traffic Tech Stop", "Fuel, crew rest or repairs ONLY (no pax)", (5, 150, 105)),
                ("3RD & 4TH", "Home <-> Foreign Pax / Cargo", "Carry revenue traffic out and back home", (217, 119, 6)),
                ("5TH FREEDOM", "Intermediate Foreign Pickup", "Carry B->C pax enroute from Home State A", (225, 29, 72)),
            ],
        },
        act45_quiz={
            "headline_1": "FOREIGN LANDING STRICTLY",
            "headline_2": "FOR REFUELING & REPAIRS?",
            "opt_a_val": "2ND FREEDOM",
            "opt_a_sub": "NON-TRAFFIC TECH STOP",
            "opt_b_val": "3RD FREEDOM",
            "opt_b_sub": "COMMERCIAL DROP-OFF",
            "correct_opt": "A",
            "verdict_banner": "SECOND FREEDOM — TECH STOP ONLY!",
            "rules": [
                ("1. ART. 1 SOVEREIGNTY", "COMPLETE & EXCLUSIVE"),
                ("2. ART. 7 CABOTAGE", "DOMESTIC ROUTES LOCKED"),
                ("3. 1ST OVERFLY / 2ND TECH", "NON-COMMERCIAL RIGHTS"),
            ],
        },
    ),

    "AIR_LAW_LAYERS": _air_law(
        "AIR_LAW_LAYERS",
        title="ICAO Airspace Classes A through G",
        exam_takeaway="Class A allows IFR only; Class C separates IFR from VFR; Class D gives VFR only traffic info on other flights; Class G is uncontrolled.",
        transcript=(
            "Cruising VFR at seven thousand feet approaching a busy European airport TMA. "
            "ATC clears your Cessna inside Class Delta, and suddenly a heavy seven-thirty-seven climbs across your nose. "
            "Does Tower keep you separated from him, or just pass traffic info? "
            "Airspace Classes Alpha through Golf redraw that separation contract at every boundary! "
            "Class Alpha locks the door to VFR completely — IFR only. "
            "Class Charlie gives both IFR and VFR mandatory separation between IFR and VFR jets. "
            "In Class Delta, ATC separates IFR from IFR ONLY — leaving VFR pilots with two-way radio clearance, traffic information, and strict see-and-avoid against everyone! "
            "Drop into Echo and VFR needs zero clearance; Golf stays completely uncontrolled. "
            "Pilot call. EASA exam trap. "
            "Inside Class Delta airspace, are IFR and VFR flights separated by ATC? "
            "Three... Two... One. "
            "No! In Class Delta, VFR only gets traffic information — Class Charlie adds full VFR separation. "
            "Save this rule: A IFR only, C separates IFR-VFR, D gives VFR traffic info."
        ),
        pronunciation_hints="TMA as T-M-A, IFR as I-F-R, VFR as V-F-R, EASA as ee-ah-sah",
        whisper_prompt="Class A, Class C, Class D, Class E, Class G, Delta, Charlie, IFR, VFR, separated, traffic information.",
        anchors={
            "eng_fail": ("delta", "heavy"),
            "fly_or_stop": ("separated", "info"),
            "act1_end": ("info",),
            "act2_start": ("alpha",),
            "asda_reveal": ("alpha", "only"),
            "toda_reveal": ("charlie", "jets"),
            "act2_end": ("jets",),
            "act3_start": ("delta", "atc"),
            "asdr_draw": ("radio", "clearance"),
            "todr_draw": ("echo", "zero"),
            "v1_collide": ("golf", "uncontrolled"),
            "act3_end": ("uncontrolled",),
            "act4_start": ("pilot",),
            "quiz_go": ("atc",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("no", "delta"),
            "rule_1": ("alpha", "a", "only"),
            "rule_2": ("charlie", "c"),
            "rule_3": ("delta", "d", "info"),
        },
        seed_1=10191,
        act1_prompt=(
            "Photorealistic vertical view from a light aircraft cockpit window over European countryside "
            "spotting a distant commercial jet airliner climbing across sunlit hazy airspace below puffy "
            "fair-weather cumulus, subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10192,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric miniature airspace cake diorama showing stacked "
            "translucent glass airspace shelves from bottom cream Golf layer through teal Delta and sky-blue "
            "Charlie up to deep navy Alpha, tilt-shift depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "CLASS D // SEPARATION?",
            "start_val": 3500,
            "end_val": 7000,
            "unit": "FT",
            "warn_banner": "▲ CLASS D — VFR TRAFFIC INFO ONLY",
            "question_pill": "DOES ATC SEPARATE VFR FROM IFR?",
        },
        act2_pills={
            "top_pill": "CLASS C VS CLASS D CONTRACT",
            "left_top": "CLASS CHARLIE (C)",
            "left_hero": "IFR<>VFR",
            "left_sub": "ATC SEPARATES IFR & VFR",
            "right_top": "CLASS DELTA (D)",
            "right_hero": "INFO ONLY",
            "right_sub": "VFR SEPARATES ITSELF",
        },
        act3_board={
            "fcom_file": "ANNEX_11_APPX_4.DOC",
            "fcom_tag": "250 KT MAX < FL100 C-G",
            "chart_file": "AIRSPACE_CLASSES_A_G.PDF",
            "chart_type": "rules_ladder",
            "x_label": "CLEARANCE, SEPARATION & RADIO MATRIX",
            "y_label": "",
            "marker_label": "CLASS D = INFO ONLY",
            "bfl_pill": "CLASSES C–G LIMIT VFR & IFR TO 250 KT IAS BELOW FL100",
            "highlight_row": 2,
            "rows": [
                ("CLASS A", "IFR Only · VFR Prohibited", "All flights separated by ATC + clearance", (225, 29, 72)),
                ("CLASS C", "IFR & VFR Clearance + Radio", "Separates IFR-IFR & IFR-VFR; info VFR-VFR", (5, 150, 105)),
                ("CLASS D", "IFR & VFR Clearance + Radio", "Separates IFR-IFR ONLY; VFR gets info only", (217, 119, 6)),
                ("CLASS E / G", "E: VFR No Clr / G: Uncontrolled", "Class G gives Flight Info on request only", (2, 132, 199)),
            ],
        },
        act45_quiz={
            "headline_1": "IN CLASS DELTA, DOES ATC",
            "headline_2": "SEPARATE VFR FROM IFR?",
            "opt_a_val": "NO — INFO ONLY",
            "opt_a_sub": "VFR SEES & AVOIDS",
            "opt_b_val": "YES — FULL SEP",
            "opt_b_sub": "MANDATORY VECTORING",
            "correct_opt": "A",
            "verdict_banner": "NO — TRAFFIC INFO ONLY IN CLASS D!",
            "rules": [
                ("1. CLASS A = IFR ONLY", "B SEPARATES EVERYONE"),
                ("2. CLASS C = IFR<>VFR", "SEPARATION INCLUDED"),
                ("3. CLASS D = IFR-IFR", "VFR GETS TRAFFIC INFO"),
            ],
        },
    ),

    "AIR_LAW_LIABILITY": _air_law(
        "AIR_LAW_LIABILITY",
        title="Montreal 1999 SDR & EC 261/2004",
        exam_takeaway="Montreal 1999 sets strict two-tier passenger injury liability in SDRs; EC 261/2004 pays €250/€400/€600 based on flight distance (except extraordinary circumstances).",
        transcript=(
            "Long-haul flight cancels on the tarmac for an engine swap — arrivals hit four hours late. "
            "Three hundred passengers line up claiming cash refunds, hotel rooms, and fixed euro payouts. "
            "Which payout actually applies by law? "
            "Split injury from schedule disruption cleanly! "
            "Montreal Ninety Nine uses Special Drawing Rights for strict no fault Tier One death or injury liability, proving airline negligence is not needed below the statutory cap. "
            "Across Europe, Regulation EC Two Sixty One pays fixed cash for delays and denied boarding: two fifty euros under fifteen hundred kilometers, four hundred mid range, and six hundred beyond three thousand five hundred kilometers — unless storms or strikes hit. "
            "Pilot call. EASA exam trap. "
            "An ordinary airline mechanical fault delays a four thousand kilometer flight by four hours — what EC payout applies? "
            "Three... Two... One. "
            "Six hundred euros! Routine technical faults never count as extraordinary circumstances. "
            "Save this rule: Montreal SDR injury, EC Two Sixty One tiers, tech faults stay payable."
        ),
        pronunciation_hints="SDR as S-D-R, EC 261 as E-C two-sixty-one, EASA as ee-ah-sah, euros cleanly",
        whisper_prompt="Montreal 99, Special Drawing Rights, SDR, EC 261, 250, 400, 600 euros, 1500, 3500 kilometers, mechanical fault, extraordinary.",
        anchors={
            "eng_fail": ("cancels", "tarmac"),
            "fly_or_stop": ("payout", "law"),
            "act1_end": ("law",),
            "act2_start": ("injury",),
            "asda_reveal": ("montreal", "rights"),
            "toda_reveal": ("negligence", "cap"),
            "act2_end": ("cap",),
            "act3_start": ("europe", "regulation"),
            "asdr_draw": ("fifteen", "hundred"),
            "todr_draw": ("six", "hundred"),
            "v1_collide": ("storms", "strikes"),
            "act3_end": ("hit",),
            "act4_start": ("pilot",),
            "quiz_go": ("applies",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("six", "600"),
            "rule_1": ("montreal", "sdr", "injury"),
            "rule_2": ("tiers", "ec"),
            "rule_3": ("tech", "faults"),
        },
        seed_1=10201,
        act1_prompt=(
            "Photorealistic vertical documentary shot inside a bright European airport departure gate at "
            "sunset showing grounded airliner tail fins outside glass windows while tired passengers queue "
            "near an airline service desk, subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10202,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric miniature diorama splitting an airline terminal gate "
            "from a golden currency scale beside tiny suitcase blocks and short-medium-long distance arcs "
            "on a pastel globe map, tilt-shift depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "EC 261 // DELAY >3H",
            "start_val": 1500,
            "end_val": 4000,
            "unit": "KM",
            "warn_banner": "▲ TECH CANCEL — CARRIER RESPONSIBLE",
            "question_pill": "4,000 KM DELAY — HOW MANY EUROS?",
        },
        act2_pills={
            "top_pill": "TWO PASSENGER LAW PILLARS",
            "left_top": "MONTREAL 1999",
            "left_hero": "SDR TIER",
            "left_sub": "STRICT INJURY & BAG CLAIMS",
            "right_top": "EU EC 261/2004",
            "right_hero": "250/600",
            "right_sub": "DELAY & DENIED BOARDING",
        },
        act3_board={
            "fcom_file": "EC_261_2004_COMP.DOC",
            "fcom_tag": "TECH FAULT = PAYABLE",
            "chart_file": "EU_DELAY_TIERS.PDF",
            "chart_type": "bars_compare",
            "x_label": "STATUTORY EU COMPENSATION (EUR) →",
            "y_label": "TIER",
            "marker_label": ">3500 KM = EUR 600",
            "bfl_pill": "ONLY EXTRAORDINARY CIRCUMSTANCES (WEATHER/ATC STRIKE) EXEMPT PAYOUT",
            "highlight_row": 2,
            "bars": [
                ("<= 1,500 KM", 250, (2, 132, 199), "EUR 250 (>=3H)"),
                ("1500-3500 KM", 400, (217, 119, 6), "EUR 400 (>=3H)"),
                ("> 3,500 KM", 600, (5, 150, 105), "EUR 600 (>=4H)"),
            ],
        },
        act45_quiz={
            "headline_1": "4,000 KM DELAY FROM",
            "headline_2": "ORDINARY TECH FAULT?",
            "opt_a_val": "EUR 0",
            "opt_a_sub": "EXEMPT AS EXTRAORDINARY",
            "opt_b_val": "EUR 600",
            "opt_b_sub": "CARRIER OWES FULL PAY",
            "correct_opt": "B",
            "verdict_banner": "EUR 600 PAYABLE — TECH NOT EXEMPT!",
            "rules": [
                ("1. MONTREAL 99 SDR", "STRICT INJURY TIERS"),
                ("2. EC 261 TIERS", "250 / 400 / 600 EUROS"),
                ("3. ORDINARY TECH FAULT", "NOT EXTRAORDINARY"),
            ],
        },
    ),

    # =========================================================================
    # DAY 4 (10 TOPICS)
    # =========================================================================
    "AIR_LAW_LIGHTGUN": _air_law(
        "AIR_LAW_LIGHTGUN",
        title="Tower Aldis Light Gun Signals",
        exam_takeaway="Flashing Green means Return for Landing in flight (Cleared to Taxi on ground); Flashing Red means Aerodrome Unsafe (or Taxi Clear on ground); Flashing White means Return to Starting Point.",
        transcript=(
            "Tower radio dies completely on short final at night. "
            "Through the dark cab glass, an air traffic controller aims an intense flashing green beam straight at your windshield. "
            "Touch down immediately, or go around and circle? "
            "Never guess Aldis lamp colors — every signal splits cleanly between In Flight and On Ground! "
            "On the runway, Steady Green clears takeoff and Flashing Green clears taxi; Steady Red holds you short, Flashing Red orders taxi clear of the landing area, and Flashing White sends you back to starting point. "
            "Up in the sky, Steady Green clears landing — whereas Flashing Green warns Return for Landing, holding off until a Steady Green beam clears you down! "
            "Pilot call. EASA exam trap. "
            "In flight on base leg, you receive a Flashing Green light from Tower — land or wait? "
            "Three... Two... One. "
            "Wait and return! Only Steady Green clears you to land. "
            "Save this rule: Steady Green land or takeoff, Flashing Green taxi or wait, Flashing White return to apron."
        ),
        pronunciation_hints="Aldis as all-diss, EASA as ee-ah-sah",
        whisper_prompt="Light gun, Aldis lamp, flashing green, steady green, steady red, flashing red, flashing white, cleared to land, return for landing.",
        anchors={
            "eng_fail": ("flashing", "green"),
            "fly_or_stop": ("touch", "circle"),
            "act1_end": ("circle",),
            "act2_start": ("aldis",),
            "asda_reveal": ("takeoff", "taxi"),
            "toda_reveal": ("starting", "point"),
            "act2_end": ("point",),
            "act3_start": ("sky", "steady"),
            "asdr_draw": ("clears", "landing"),
            "todr_draw": ("warns", "return"),
            "v1_collide": ("down",),
            "act3_end": ("down",),
            "act4_start": ("pilot",),
            "quiz_go": ("wait",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("wait", "return"),
            "rule_1": ("steady",),
            "rule_2": ("flashing", "green"),
            "rule_3": ("white", "apron"),
        },
        seed_1=10211,
        act1_prompt=(
            "Photorealistic vertical cockpit view on final approach at twilight looking toward a dark "
            "control tower cab beaming a sharp glowing emerald-green signal light directly toward the "
            "aircraft windshield above runway edge lights, subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10212,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric miniature airport control tower diorama shining tiny "
            "colored spotlight cones toward both a parked ground jet and a flying aircraft model in twilight sky, "
            "tilt-shift depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "NORDO // TOWER SIGNAL",
            "start_val": 118,
            "end_val": 0,
            "unit": "COM",
            "warn_banner": "▲ FLASHING GREEN BEAM FROM TOWER",
            "question_pill": "LAND NOW — OR CIRCLE FOR STEADY?",
        },
        act2_pills={
            "top_pill": "ALDIS LAMP AIR VS GROUND",
            "left_top": "IN FLIGHT SIGNALS",
            "left_hero": "FL GRN",
            "left_sub": "RETURN -> WAIT STEADY GRN",
            "right_top": "ON GROUND SIGNALS",
            "right_hero": "FL GRN",
            "right_sub": "CLEARED TO TAXI SAFELY",
        },
        act3_board={
            "fcom_file": "ANNEX_2_APPX_1_4.DOC",
            "fcom_tag": "ALDIS LIGHT GUN TABLE",
            "chart_file": "TOWER_LIGHT_COMMANDS.PDF",
            "chart_type": "rules_ladder",
            "x_label": "STEADY & FLASHING BEAM MEANINGS",
            "y_label": "",
            "marker_label": "STEADY GREEN = LAND",
            "bfl_pill": "PYROTECHNIC RED FLARE IN FLIGHT = DO NOT LAND FOR NOW",
            "highlight_row": 0,
            "rows": [
                ("STEADY GRN", "Air: Land / Ground: Takeoff", "Only beam clearing landing or takeoff", (5, 150, 105)),
                ("FLASH GRN", "Air: Return for Landing", "Ground: Cleared to taxi (wait steady!)", (2, 132, 199)),
                ("RED BEAM", "Steady: Give Way / STOP", "Flashing: Aerodrome unsafe / Taxi clear", (225, 29, 72)),
                ("FLASH WHT", "Air: Land Here & Park*", "Ground: Return to starting point (apron)", (217, 119, 6)),
            ],
        },
        act45_quiz={
            "headline_1": "IN FLIGHT: FLASHING GREEN",
            "headline_2": "BEAM FROM TOWER?",
            "opt_a_val": "CLEARED LAND",
            "opt_a_sub": "TOUCH DOWN NOW",
            "opt_b_val": "RETURN / WAIT",
            "opt_b_sub": "AWAIT STEADY GREEN",
            "correct_opt": "B",
            "verdict_banner": "HOLD FOR STEADY GREEN TO LAND!",
            "rules": [
                ("1. STEADY GREEN", "LAND / CLEARED TAKEOFF"),
                ("2. FLASHING GREEN", "WAIT STEADY / TAXI GND"),
                ("3. FLASHING WHITE", "RETURN STARTING POINT"),
            ],
        },
    ),

    "AIR_LAW_LIGHTING": _air_law(
        "AIR_LAW_LIGHTING",
        title="Annex 14 Runway & Taxiway Lighting",
        exam_takeaway="Runway centerline runs White → 900–300m alternating Red/White → last 300m Solid Red; edge lights turn Yellow in the final 600 m; taxiways use Blue edges and Green centerlines.",
        transcript=(
            "Low-visibility rollout at one hundred knots on a fog-bound midnight runway. "
            "Bright white centerline lamps suddenly blink Red-White, Red-White outside your cockpit glass. "
            "Keep rolling slow, or hit maximum reverse now? "
            "Every Annex Fourteen lamp broadcasts exact remaining asphalt distance at a glance. "
            "Taxiways glow Blue along the outer edges and Green down the center — while the main runway wraps itself in crisp White edges, Green threshold bars, and bright Red stop ends. "
            "Watch your runway centerline warning zone: White runs until nine hundred meters left, alternates Red and White between nine hundred and three hundred meters, then turns Solid Red for the final three hundred! "
            "Meanwhile outer runway edge lights flip Yellow across the final six hundred meters. "
            "Pilot call. EASA exam trap. "
            "Where do runway centerline lights alternate Red and White during takeoff or rollout? "
            "Three... Two... One. "
            "Nine hundred to three hundred meters left! Final three hundred is Solid Red. "
            "Save this rule: Centerline 900–300 Red-White, last 300 Red, edge 600 Yellow."
        ),
        pronunciation_hints="Annex Fourteen cleanly, EASA as ee-ah-sah",
        whisper_prompt="Runway lighting, centerline, alternating red and white, 900 meters, 300 meters, 600 meters, yellow edge, blue taxiway, green threshold.",
        anchors={
            "eng_fail": ("red-white", "red"),
            "fly_or_stop": ("rolling", "reverse"),
            "act1_end": ("now",),
            "act2_start": ("annex",),
            "asda_reveal": ("taxiways", "blue"),
            "toda_reveal": ("green", "threshold"),
            "act2_end": ("ends",),
            "act3_start": ("centerline", "warning"),
            "asdr_draw": ("nine", "hundred"),
            "todr_draw": ("solid", "red"),
            "v1_collide": ("yellow", "six"),
            "act3_end": ("meters",),
            "act4_start": ("pilot",),
            "quiz_go": ("rollout",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("nine", "900"),
            "rule_1": ("900", "red-white", "nine"),
            "rule_2": ("300", "three", "red"),
            "rule_3": ("600", "yellow", "edge"),
        },
        seed_1=10221,
        act1_prompt=(
            "Photorealistic vertical cockpit view racing down a fog-shrouded night runway as centerline lights "
            "transition from bright white into glowing red-and-white alternating lamps and solid red bulbs ahead, "
            "subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10222,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric miniature night airport diorama glowing softly with tiny "
            "blue taxiway edge LEDs, green centerline dots, and white-yellow-red runway lamps along a dark slate "
            "runway strip, tilt-shift depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "RWY REMAIN // CL RED-WHT",
            "start_val": 1200,
            "end_val": 600,
            "unit": "m",
            "warn_banner": "▲ RED / WHITE CENTERLINE ZONE",
            "question_pill": "900–300M LEFT — OR FINAL 300M?",
        },
        act2_pills={
            "top_pill": "ANNEX 14 LAMP COLOR CODE",
            "left_top": "TAXIWAY LIGHTS",
            "left_hero": "BLU+GRN",
            "left_sub": "BLUE EDGE / GREEN CENTER",
            "right_top": "RUNWAY GATES",
            "right_hero": "GRN/RED",
            "right_sub": "GREEN THR / RED RWY END",
        },
        act3_board={
            "fcom_file": "ANNEX_14_CH5_3.DOC",
            "fcom_tag": "ROLLOUT REMAINING M",
            "chart_file": "RUNWAY_LIGHT_ZONES.PDF",
            "chart_type": "bars_compare",
            "x_label": "WARNING ZONE FROM RUNWAY END (M) →",
            "y_label": "LAMP",
            "marker_label": "300M = SOLID RED",
            "bfl_pill": "EDGE LIGHTS GO YELLOW LAST 600 M (OR 1/3 OF SHORT RUNWAYS)",
            "highlight_row": 1,
            "bars": [
                ("CL SOLID RED", 300, (225, 29, 72), "LAST 300 M"),
                ("CL RED/WHITE", 900, (217, 119, 6), "900 TO 300 M"),
                ("EDGE YELLOW", 600, (234, 88, 12), "LAST 600 M"),
                ("TAXI BLUE/GRN", 1200, (2, 132, 199), "BLUE EDGE / GRN CL"),
            ],
        },
        act45_quiz={
            "headline_1": "ALTERNATING RED & WHITE",
            "headline_2": "CENTERLINE MEANS?",
            "opt_a_val": "900–300 M",
            "opt_a_sub": "REMAINING RUNWAY",
            "opt_b_val": "LAST 300 M",
            "opt_b_sub": "SOLID RED STARTS 600",
            "correct_opt": "A",
            "verdict_banner": "900 TO 300 M REMAINING LEFT!",
            "rules": [
                ("1. CL 900-300 M R/W", "LAST 300 M SOLID RED"),
                ("2. EDGE LAST 600 M", "YELLOW WARNING (OR 1/3)"),
                ("3. TAXIWAY LIGHTS", "BLUE EDGE · GREEN CL"),
            ],
        },
    ),

    "AIR_LAW_OPS_INFO": _air_law(
        "AIR_LAW_OPS_INFO",
        title="Integrated AIS Package: AIP, SUP, AIC & PIB",
        exam_takeaway="The AIP has 3 parts (GEN, ENR, AD); AIP Supplements hold temporary changes ≥3 months or long text/maps; AICs hold admin/safety info; PIB briefs pre-flight NOTAMs.",
        transcript=(
            "Dispatcher drops a massive pre-flight briefing packet onto your cockpit pedestal. "
            "Inside sit permanent charts, temporary construction diagrams, and winter braking bulletins. "
            "Where does a six-month runway rebuild live? "
            "ICAO Annex Fifteen wraps every operational document inside one Integrated Aeronautical Information Package. "
            "The permanent AIP anchors everything in three strict volumes: GEN for general definitions and national rules, ENR for airways and airspace, and AD for every aerodrome chart. "
            "When temporary crane or runway works last three months or longer — or carry heavy diagrams — they publish as a yellow AIP Supplement, while admin tips or safety warnings sit in an AIC Circular, bundled for crews inside a PIB. "
            "Pilot call. EASA exam trap. "
            "Which part of the AIP contains aerodrome instrument approach charts and taxiway maps? "
            "Three... Two... One. "
            "Part Three: AD! Never confuse Aerodromes AD with Enroute ENR. "
            "Save this rule: AIP GEN ENR AD, Supplements three months plus, AIC non-NOTAM circulars."
        ),
        pronunciation_hints="AIP as A-I-P, GEN as gen, ENR as en-route, AD as A-D, AIC as A-I-C, PIB as P-I-B, EASA as ee-ah-sah",
        whisper_prompt="AIP, GEN, ENR, AD, AIP Supplement, three months, AIC Circular, PIB, aerodrome charts.",
        anchors={
            "eng_fail": ("construction", "diagrams"),
            "fly_or_stop": ("sixmonth", "six", "rebuild"),
            "act1_end": ("live",),
            "act2_start": ("annex", "fifteen"),
            "asda_reveal": ("gen", "airways"),
            "toda_reveal": ("ad", "chart"),
            "act2_end": ("chart",),
            "act3_start": ("temporary", "crane"),
            "asdr_draw": ("supplement",),
            "todr_draw": ("circular", "pib"),
            "v1_collide": ("pib",),
            "act3_end": ("pib",),
            "act4_start": ("pilot",),
            "quiz_go": ("maps",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("part", "ad"),
            "rule_1": ("aip", "gen"),
            "rule_2": ("supplements", "months"),
            "rule_3": ("aic", "circulars"),
        },
        seed_1=10231,
        act1_prompt=(
            "Photorealistic vertical shot inside an airline dispatch briefing room at dawn showing a "
            "flight crew reviewing layered glossy approach plate packets, yellow aviation supplements, and "
            "illuminated weather radar displays, subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10232,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric miniature aviation library stack showing three neatly "
            "labeled pastel binder volumes on a light oak desk beside a bright yellow supplement folder and "
            "tiny white jet model, tilt-shift depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "ANNEX 15 // AIS DOCS",
            "start_val": 1,
            "end_val": 3,
            "unit": "PART",
            "warn_banner": "▲ 6-MONTH TAXIWAY WORKS NOTICE",
            "question_pill": "AIP AD CHART — OR SHORT NOTAM?",
        },
        act2_pills={
            "top_pill": "3 PARTS OF THE AIP",
            "left_top": "PART 1 & PART 2",
            "left_hero": "GEN+ENR",
            "left_sub": "DEFINITIONS + AIRWAYS",
            "right_top": "PART 3 (AIRPORTS)",
            "right_hero": "AD",
            "right_sub": "RUNWAYS + CHARTS + MINIMA",
        },
        act3_board={
            "fcom_file": "INTEGRATED_AIS_PKG.DOC",
            "fcom_tag": "SUP >= 3 MONTHS",
            "chart_file": "AIS_PACKAGE_ROLES.PDF",
            "chart_type": "rules_ladder",
            "x_label": "INTEGRATED AERONAUTICAL INFORMATION PKG",
            "y_label": "",
            "marker_label": "AD = AERODROMES",
            "bfl_pill": "SNOWTAM MAX VALIDITY = 8H · PIB = PRE-FLIGHT BULLETIN",
            "highlight_row": 0,
            "rows": [
                ("AIP (3 PARTS)", "GEN · ENR · AD Permanent Book", "GEN rules · ENR routes · AD airport charts", (2, 132, 199)),
                ("AIP SUPP", "Temp >=3 Mo or Complex Maps", "Yellow pages when too long for a NOTAM", (217, 119, 6)),
                ("AIC CIRCULAR", "Admin, Legal or Safety Notices", "Non-operational warnings & exam updates", (5, 150, 105)),
                ("PIB BRIEF", "Pre-Flight Information Bulletin", "Route-filtered active NOTAMs & SNOWTAM", (225, 29, 72)),
            ],
        },
        act45_quiz={
            "headline_1": "AIRPORT CHARTS & MINIMA",
            "headline_2": "SIT IN WHICH AIP PART?",
            "opt_a_val": "PART 3: AD",
            "opt_a_sub": "AERODROMES SECTION",
            "opt_b_val": "PART 2: ENR",
            "opt_b_sub": "ENROUTE & AIRWAYS",
            "correct_opt": "A",
            "verdict_banner": "PART 3 (AD) HOLDS AIRPORT CHARTS!",
            "rules": [
                ("1. AIP = GEN / ENR / AD", "3 PERMANENT VOLUMES"),
                ("2. AIP SUPP >= 3 MO", "OR TEXT / GRAPHICS"),
                ("3. AIC SAFETY / ADMIN", "PIB = PRE-FLIGHT BRIEF"),
            ],
        },
    ),

    "AIR_LAW_ORG": _air_law(
        "AIR_LAW_ORG",
        title="ICAO, EASA, EUROCONTROL & IATA Roles",
        exam_takeaway="ICAO (Montreal) sets global UN SARPs; EASA (Cologne) runs EU aviation safety & rulemaking; EUROCONTROL (Brussels) manages European ATM/NMOC; IATA is the airline trade association.",
        transcript=(
            "Four international acronyms collide on almost every Air Law test paper. "
            "One writes worldwide UN standards, one certifies European cockpits, and one regulates airline ticket rules. "
            "Who actually holds legal enforcement power? "
            "Map all four headquarters on the globe. "
            "ICAO in Montreal is the United Nations agency publishing Nineteen Annexes — SARPs that Member States convert into national law. "
            "In Cologne, EASA serves as the European Union aviation safety authority issuing legally binding CS-25, Part-FCL, and airworthiness rules across Europe! "
            "Brussels hosts EUROCONTROL managing European air traffic flow via NMOC, while IATA in Montreal represents commercial airlines as a trade body. "
            "Pilot call. EASA exam trap. "
            "Which organization is a private airline trade association rather than a government safety regulator? "
            "Three... Two... One. "
            "IATA! Airlines run IATA — ICAO, EASA, and EUROCONTROL are intergovernmental bodies. "
            "Save this rule: ICAO Montreal global, EASA Cologne EU binding, IATA airline trade."
        ),
        pronunciation_hints="ICAO as eye-kay-oh, EASA as ee-ah-sah, EUROCONTROL cleanly, IATA as eye-ah-tah, NMOC as N-mock",
        whisper_prompt="ICAO Montreal, EASA Cologne, EUROCONTROL Brussels, NMOC, IATA, airlines, trade association, SARPs.",
        anchors={
            "eng_fail": ("collide",),
            "fly_or_stop": ("enforcement", "power"),
            "act1_end": ("power",),
            "act2_start": ("headquarters",),
            "asda_reveal": ("icao", "montreal"),
            "toda_reveal": ("easa", "cologne"),
            "act2_end": ("europe",),
            "act3_start": ("brussels", "eurocontrol"),
            "asdr_draw": ("eurocontrol", "flow"),
            "todr_draw": ("iata", "airlines"),
            "v1_collide": ("trade",),
            "act3_end": ("body",),
            "act4_start": ("pilot",),
            "quiz_go": ("regulator",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("iata",),
            "rule_1": ("icao", "montreal"),
            "rule_2": ("easa", "cologne"),
            "rule_3": ("iata",),
        },
        seed_1=10241,
        act1_prompt=(
            "Photorealistic vertical wide shot of a sleek glass European aviation summit hall and illuminated "
            "air traffic network control wall at dusk showing crisp trans-Atlantic and European route arcs, "
            "subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10242,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric miniature map spanning Montreal, Cologne, and Brussels "
            "with four miniature architectural headquarters towers linked by glowing cyan airline arcs, "
            "tilt-shift depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "GOVERNANCE // HQ MAP",
            "start_val": 1945,
            "end_val": 2002,
            "unit": "ORG",
            "warn_banner": "▲ WHO HOLDS REGULATORY POWER?",
            "question_pill": "GOVERNMENT BODY — OR TRADE GROUP?",
        },
        act2_pills={
            "top_pill": "GLOBAL vs EUROPEAN AUTHORITY",
            "left_top": "UN AGENCY (MONTREAL)",
            "left_hero": "ICAO",
            "left_sub": "193 STATES · ANNEX SARPs",
            "right_top": "EU AGENCY (COLOGNE)",
            "right_hero": "EASA",
            "right_sub": "EU SAFETY LAWS & CERTS",
        },
        act3_board={
            "fcom_file": "AVIATION_BODIES.DOC",
            "fcom_tag": "IATA != REGULATOR",
            "chart_file": "AGENCY_HQ_POWERS.PDF",
            "chart_type": "rules_ladder",
            "x_label": "HEADQUARTERS, MANDATE & LEGAL STATUS",
            "y_label": "",
            "marker_label": "IATA = AIRLINE TRADE",
            "bfl_pill": "EUROCONTROL ACTS AS EU NETWORK MANAGER (NMOC / CFMU FLOW)",
            "highlight_row": 3,
            "rows": [
                ("ICAO // UN", "Montreal · 1944 Chicago", "Sets 19 Annex SARPs · States legislate", (2, 132, 199)),
                ("EASA // EU", "Cologne · EU Regulation", "Legally binding CS-25, Part-FCL, Part-OPS", (5, 150, 105)),
                ("EUROCONTROL", "Brussels · Pan-European ATM", "Flow control (NMOC) & Maastricht UAC", (217, 119, 6)),
                ("IATA // TRADE", "Montreal · Airline Association", "Private airline body (codes/billing) — NON-GOV", (225, 29, 72)),
            ],
        },
        act45_quiz={
            "headline_1": "WHICH IS A PRIVATE AIRLINE",
            "headline_2": "TRADE GROUP, NOT GOV?",
            "opt_a_val": "IATA",
            "opt_a_sub": "AIRLINE ASSOCIATION",
            "opt_b_val": "EASA",
            "opt_b_sub": "EU SAFETY REGULATOR",
            "correct_opt": "A",
            "verdict_banner": "IATA IS AN AIRLINE TRADE BODY!",
            "rules": [
                ("1. ICAO MONTREAL", "GLOBAL UN SARPs (19)"),
                ("2. EASA COLOGNE", "BINDING EU SAFETY LAW"),
                ("3. EUROCONTROL NMOC", "FLOW · IATA = AIRLINES"),
            ],
        },
    ),

    "AIR_LAW_PANS_OPS": _air_law(
        "AIR_LAW_PANS_OPS",
        title="PANS-OPS Departures & Speed Categories",
        exam_takeaway="Standard SID Procedure Design Gradient is 3.3% (2.5% OIS + 0.8% obstacle clearance); omnidirectional turns start ≥120 m (394 ft); Approach Categories depend on 1.3 × VS0 at MLW.",
        transcript=(
            "Heavy twin rotates into cloud out of a mountain valley airport. "
            "No visible obstacle straight ahead, yet the chart blocks every turn below four hundred feet. "
            "Why does Doc Eight-One-Six-Eight demand that climb slope? "
            "PANS-OPS builds invisible safety ramps out of two stacked numbers. "
            "An Obstacle Identification Surface rises at two point five percent, and adding zero point eight percent margin guarantees a three point three percent minimum Procedure Design Gradient! "
            "On omnidirectional departures without track guidance, turns stay locked until one hundred twenty meters — three-ninety-four feet — above runway. "
            "Meanwhile landing Categories Alpha through Echo depend strictly on VAT: one point three times stall speed at maximum certified landing weight! "
            "Pilot call. EASA exam trap. "
            "What is the standard minimum Procedure Design Gradient for an ICAO SID? "
            "Three... Two... One. "
            "Three point three percent! Two-point-five surface plus zero-point-eight margin. "
            "Save this rule: PDG three point three percent, 120 m turn height, Category equals VAT."
        ),
        pronunciation_hints="PANS-OPS as panz-ops, SID as sid, VAT as V-A-T, VS0 as V-S-zero, MLW as M-L-W, EASA as ee-ah-sah",
        whisper_prompt="Doc 8168, PANS-OPS, 2.5 percent, 0.8 percent, 3.3 percent, PDG, 120 meters, 394 feet, VAT, 1.3, landing weight.",
        anchors={
            "eng_fail": ("blocks", "turn"),
            "fly_or_stop": ("doc", "demand"),
            "act1_end": ("slope",),
            "act2_start": ("pansops", "pans", "stacked"),
            "asda_reveal": ("surface", "five", "5"),
            "toda_reveal": ("margin",),
            "act2_end": ("gradient",),
            "act3_start": ("omnidirectional",),
            "asdr_draw": ("twenty", "hundred", "120"),
            "todr_draw": ("categories", "vat"),
            "v1_collide": ("weight",),
            "act3_end": ("weight",),
            "act4_start": ("pilot",),
            "quiz_go": ("gradient", "sid"),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("three", "3", "percent"),
            "rule_1": ("pdg", "percent"),
            "rule_2": ("120", "twenty", "turn"),
            "rule_3": ("vat", "category"),
        },
        seed_1=10251,
        act1_prompt=(
            "Photorealistic vertical shot looking straight down from the climb-out tail camera of a "
            "twin-engine jetliner lifting sharply out of a misty Alpine runway valley toward dark pine ridges "
            "under moody overcast light, subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10252,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric miniature mountain airport diorama showing a translucent "
            "2.5-degree wedge ramp rising from the runway end with a steeper 3.3-degree sky-blue climb corridor "
            "clearing miniature hills, tilt-shift depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "DOC 8168 // SID SLOPE",
            "start_val": 2.5,
            "end_val": 3.3,
            "decimals": 1,
            "unit": "%",
            "warn_banner": "▲ OBSTACLE SURFACE + 0.8% MARGIN",
            "question_pill": "2.5% OR 3.3% STANDARD PDG?",
        },
        act2_pills={
            "top_pill": "SID OBSTACLE PROTECTION",
            "left_top": "OBSTACLE SURFACE (OIS)",
            "left_hero": "2.5%",
            "left_sub": "BASELINE TERRAIN PLANE",
            "right_top": "DESIGN GRADIENT (PDG)",
            "right_hero": "3.3%",
            "right_sub": "INCLUDES +0.8% SAFETY MOC",
        },
        act3_board={
            "fcom_file": "DOC_8168_VOL1.DOC",
            "fcom_tag": "VAT = 1.3 x VS0 (MLW)",
            "chart_file": "CLIMB_&_APPROACH_CAT.PDF",
            "chart_type": "bars_compare",
            "x_label": "CLIMB GRADIENT (%) / MIN TURN ALT →",
            "y_label": "SPEC",
            "marker_label": "PDG = 3.3% MIN",
            "bfl_pill": "APPROACH CAT A-E IS PERMANENTLY SET AT MLW (MAX LANDING MASS)",
            "highlight_row": 2,
            "bars": [
                ("0.8% MOC BUFFER", 0.8, (217, 119, 6), "0.8% CLEARANCE"),
                ("2.5% OIS PLANE", 2.5, (2, 132, 199), "2.5% SURFACE"),
                ("3.3% STD PDG", 3.3, (5, 150, 105), "3.3% MIN CLIMB"),
                ("120m / 394ft", 3.9, (225, 29, 72), "MIN TURN HEIGHT"),
            ],
        },
        act45_quiz={
            "headline_1": "STANDARD MINIMUM SID",
            "headline_2": "PROCEDURE GRADIENT?",
            "opt_a_val": "2.5%",
            "opt_a_sub": "OIS GROUND SURFACE",
            "opt_b_val": "3.3%",
            "opt_b_sub": "INCLUDES 0.8% MARGIN",
            "correct_opt": "B",
            "verdict_banner": "3.3% PDG MINIMUM CLIMB GRADIENT!",
            "rules": [
                ("1. PDG = 3.3% MIN", "2.5% OIS + 0.8% MOC"),
                ("2. TURN HEIGHT", "120 M / 394 FT MINIMUM"),
                ("3. CAT A–E = VAT", "1.3 x VS0 AT MAX LAND MASS"),
            ],
        },
    ),

    "AIR_LAW_PARALLEL_RWY": _air_law(
        "AIR_LAW_PARALLEL_RWY",
        title="Doc 4444 Parallel Runway Ops (Modes 1–4)",
        exam_takeaway="Independent approaches (Mode 1) require ≥1,035 m spacing + No Transgression Zone; Dependent (Mode 2) ≥915 m + 1.5–2 NM stagger; Independent departures (Mode 3) ≥760 m.",
        transcript=(
            "Two widebodies plunge side by side through misty morning cloud toward Frankfurt's parallel runways. "
            "One single drift into the central ribbon triggers instant radar breakaway alerts. "
            "How close can parallel asphalt sit legally? "
            "ICAO Doc Four Four Four Four splits parallel operations into four strict spacing modes. "
            "Mode One runs Independent Approaches down to ten thirty five meters apart, guarded by a six hundred ten meter No Transgression Zone and dedicated radar monitors. "
            "Tighten spacing to nine fifteen meters in Mode Two Dependent Approaches, where jets stagger diagonally by two miles — while departures diverge cleanly in Mode Three down to seven sixty meters! "
            "Pilot call. EASA exam trap. "
            "What is the minimum runway centerline spacing for Independent Simultaneous Parallel Approaches? "
            "Three... Two... One. "
            "Ten hundred and thirty five meters! Remember the No Transgression Zone sits directly between them. "
            "Save this rule: Independent 1035 m, Dependent 915 m, Departures 760 m."
        ),
        pronunciation_hints="Doc 4444 as Doc four-four-four-four, NTZ as N-T-Z, EASA as ee-ah-sah",
        whisper_prompt="Doc 4444, parallel runways, Mode 1, Independent, 1035 meters, No Transgression Zone, 915 meters, 760 meters, Dependent.",
        anchors={
            "eng_fail": ("drift", "central"),
            "fly_or_stop": ("close", "legally"),
            "act1_end": ("legally",),
            "act2_start": ("icao", "doc"),
            "asda_reveal": ("independent", "ten"),
            "toda_reveal": ("transgression", "monitors"),
            "act2_end": ("monitors",),
            "act3_start": ("tighten", "nine"),
            "asdr_draw": ("dependent", "miles"),
            "todr_draw": ("departures", "seven"),
            "v1_collide": ("sixty", "seven-sixty", "760"),
            "act3_end": ("meters",),
            "act4_start": ("pilot",),
            "quiz_go": ("approaches",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("ten", "1035", "10", "hundred"),
            "rule_1": ("1035", "independent"),
            "rule_2": ("915", "9", "nine", "dependent"),
            "rule_3": ("760", "7", "seven", "departures"),
        },
        seed_1=10261,
        act1_prompt=(
            "Photorealistic vertical view from a widebody cockpit on dual final approach seeing a second "
            "commercial jet descending parallel across a thin mist layer toward twin lit runways ahead, "
            "subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10262,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric miniature airport diorama showing two clean grey "
            "parallel runways separated by a glowing amber central buffer strip with two tiny white "
            "airliners lined up side by side, tilt-shift depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "MODE 1 // RWY SPACING",
            "start_val": 760,
            "end_val": 1035,
            "unit": "m",
            "warn_banner": "▲ NO TRANSGRESSION ZONE GUARDED",
            "question_pill": "915 M — OR 1,035 M INDEPENDENT?",
        },
        act2_pills={
            "top_pill": "SIMULTANEOUS APPROACH MODES",
            "left_top": "MODE 1 (INDEPENDENT)",
            "left_hero": "1035 m",
            "left_sub": "NTZ 610M + RADAR MONITOR",
            "right_top": "MODE 2 (DEPENDENT)",
            "right_hero": "915 m",
            "right_sub": "DIAGONAL STAGGER 1.5–2 NM",
        },
        act3_board={
            "fcom_file": "DOC_4444_CH6_7.DOC",
            "fcom_tag": "NTZ >= 610 M MONITORED",
            "chart_file": "PARALLEL_RWY_MODES.PDF",
            "chart_type": "bars_compare",
            "x_label": "MINIMUM RUNWAY CENTERLINE SPACING (M) →",
            "y_label": "MODE",
            "marker_label": "MODE 1 >= 1,035 M",
            "bfl_pill": "MODE 4 SEGREGATED OPS (1 ARR / 1 DEP) ALSO STARTS AT 760 M",
            "highlight_row": 0,
            "bars": [
                ("MODE 1 INDEP", 1035, (5, 150, 105), "1,035 M (+NTZ)"),
                ("MODE 2 DEPND", 915, (2, 132, 199), "915 M (STAGGER)"),
                ("MODE 3 DEPS", 760, (217, 119, 6), "760 M (15° DIV)"),
                ("MODE 4 SEG", 760, (225, 29, 72), "760 M (MIXED)"),
            ],
        },
        act45_quiz={
            "headline_1": "INDEPENDENT PARALLEL",
            "headline_2": "APPROACH MIN SPACING?",
            "opt_a_val": "1,035 m",
            "opt_a_sub": "WITH 610 M NTZ & RADAR",
            "opt_b_val": "915 m",
            "opt_b_sub": "NO STAGGER NEEDED",
            "correct_opt": "A",
            "verdict_banner": "1,035 M MIN FOR MODE 1 INDEPENDENT!",
            "rules": [
                ("1. MODE 1 INDEP APP", ">= 1,035 M + 610 M NTZ"),
                ("2. MODE 2 DEPENDENT", ">= 915 M + 1.5-2 NM"),
                ("3. MODES 3 & 4 DEPS/SEG", ">= 760 M MIN SPACING"),
            ],
        },
    ),

    "AIR_LAW_PERSONNEL": _air_law(
        "AIR_LAW_PERSONNEL",
        title="Part-FCL Licensing, Currency & Medicals",
        exam_takeaway="Unfrozen ATPL(A) requires age 21, 1500 hrs total & 500 hrs multi-pilot; Class 1 drops from 12 to 6 months at age 40 (single-pilot CAT) or 60 (all); 90-day currency needs 3 T/O & landings.",
        transcript=(
            "Forty-first birthday cake disappears just before line-check sign-off. "
            "Our single-pilot charter captain still flies healthy, yet EASA halves his medical validity overnight. "
            "Which age triggers that six-month cut? "
            "Part-FCL sets clear gates from cadet right through captain. "
            "Unlocking an unfrozen ATPL Airplane takes minimum age twenty-one, fifteen hundred total flight hours, and five hundred multi-pilot hours — plus three takeoffs and landings every ninety days to carry passengers. "
            "Now trace Class One medical checks: valid twelve months under age forty, plunging straight to six months at age forty for single-pilot commercial carriage, or at age sixty for multi-pilot airline crews! "
            "Pilot call. EASA exam trap. "
            "A forty-two-year-old captain flying single-pilot commercial air transport — how long does her Class One medical last? "
            "Three... Two... One. "
            "Six months! Multi-pilot keeps twelve months to sixty, single-pilot CAT cuts at forty. "
            "Save this rule: ATPL 1500 hours 500 multi-pilot, age 40 single-pilot cut, 90-day three landings."
        ),
        pronunciation_hints="Part-FCL as part F-C-L, ATPL as A-T-P-L, CAT as C-A-T, EASA as ee-ah-sah",
        whisper_prompt="Part-FCL, ATPL, 21, 1500 hours, 500 multi-pilot, Class 1 medical, 12 months, 6 months, age 40, single-pilot CAT, 90 days.",
        anchors={
            "eng_fail": ("halves", "medical"),
            "fly_or_stop": ("age", "cut"),
            "act1_end": ("cut",),
            "act2_start": ("part-fcl", "part"),
            "asda_reveal": ("fifteen", "15", "1500", "five", "500"),
            "toda_reveal": ("ninety", "90", "passengers"),
            "act2_end": ("passengers",),
            "act3_start": ("class", "medical"),
            "asdr_draw": ("twelve", "12", "forty", "40"),
            "todr_draw": ("six", "6", "single-pilot", "sixty", "60"),
            "v1_collide": ("crews",),
            "act3_end": ("crews",),
            "act4_start": ("pilot",),
            "quiz_go": ("last",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("six", "6", "months"),
            "rule_1": ("atpl", "1500", "500"),
            "rule_2": ("40", "forty"),
            "rule_3": ("90", "90-day", "ninety", "landings"),
        },
        seed_1=10271,
        act1_prompt=(
            "Photorealistic vertical shot of an experienced airline pilot in crisp four-stripe uniform checking "
            "pilot license booklet and cockpit kneeboard inside a bright sunny jet flight deck before engine "
            "start, subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10272,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric miniature aviation desk displaying a golden four-stripe "
            "epaulet, tiny medical stethoscope badge, blue logbook stack, and sleek model twin-jet, "
            "tilt-shift depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "PART-MED // SP CAT >40",
            "start_val": 12,
            "end_val": 6,
            "unit": "MO",
            "warn_banner": "▲ SINGLE-PILOT CAT VALIDITY HALVED",
            "question_pill": "42 YR OLD SP-CAT — 12 OR 6 MO?",
        },
        act2_pills={
            "top_pill": "ATPL(A) EXPERIENCE GATES",
            "left_top": "UNFROZEN ATPL",
            "left_hero": "1,500H",
            "left_sub": "AGE 21 · 500H MULTI-PILOT",
            "right_top": "PAX CURRENCY",
            "right_hero": "3 / 90D",
            "right_sub": "3 T/O + 3 LDG IN 90 DAYS",
        },
        act3_board={
            "fcom_file": "EASA_PART_FCL_MED.DOC",
            "fcom_tag": "CLASS 1 AGE CUTS",
            "chart_file": "CLASS_1_VALIDITY.PDF",
            "chart_type": "bars_compare",
            "x_label": "CLASS 1 MEDICAL VALIDITY (MONTHS) →",
            "y_label": "CREW",
            "marker_label": "SP CAT >=40 = 6 MO",
            "bfl_pill": "MAX AGE COMMERCIAL AIR TRANSPORT: 60 (SINGLE-PILOT) / 65 (MULTI-PILOT)",
            "highlight_row": 1,
            "bars": [
                ("<40 ALL CAT", 12, (5, 150, 105), "12 MONTHS"),
                ("SP CAT 40-59", 6, (225, 29, 72), "6 MONTHS (CUT)"),
                ("MP CAT 40-59", 12, (2, 132, 199), "12 MONTHS"),
                (">=60 ALL CAT", 6, (217, 119, 6), "6 MONTHS"),
            ],
        },
        act45_quiz={
            "headline_1": "42-YR CAPTAIN IN SINGLE-PILOT",
            "headline_2": "CAT — CLASS 1 VALIDITY?",
            "opt_a_val": "12 MONTHS",
            "opt_a_sub": "HALVES ONLY AT AGE 60",
            "opt_b_val": "6 MONTHS",
            "opt_b_sub": "SP CAT DROPS AT AGE 40",
            "correct_opt": "B",
            "verdict_banner": "6 MONTHS — SP CAT CUTS AT 40!",
            "rules": [
                ("1. ATPL 1500H / 500MP", "MIN AGE 21 YEARS"),
                ("2. CLASS 1 MEDICAL", "6 MO >=40 SP-CAT / >=60"),
                ("3. 90-DAY RECENCY", "3 T/O & 3 LANDINGS"),
            ],
        },
    ),

    "AIR_LAW_REF_CODE": _air_law(
        "AIR_LAW_REF_CODE",
        title="Annex 14 Aerodrome Reference Code",
        exam_takeaway="Reference Code pairs Number 1–4 (Aeroplane Reference Field Length) with Letter A–F (Wingspan up to 80 m — OMGWS was decoupled in modern Annex 14).",
        transcript=(
            "Widebody Seven-Seven-Seven wings span sixty-four point eight meters over narrow apron asphalt. "
            "One single misread letter sends that wingtip slicing through taxiway lighting poles! "
            "How does Four-Echo decode an airport? "
            "ICAO Annex Fourteen classifies every runway with a clean two-part code: a Number and a Letter. "
            "Numbers One through Four match Aeroplane Reference Field Length — jumping past eighteen hundred meters for full Code Four! "
            "Letters Alpha through Foxtrot strictly classify Wingspan — up to fifty-two meters for Delta, sixty-five for Echo, and eighty meters for giant A380 Foxtrot; modern Annex Fourteen removed main gear span completely! "
            "Pilot call. EASA exam trap. "
            "Which single aircraft measurement determines the Code Letter under current Annex Fourteen? "
            "Three... Two... One. "
            "Wingspan only! Main gear span was split off into taxiway design rules. "
            "Save this rule: Number equals Field Length, Code Four eighteen hundred plus, Letter equals Wingspan."
        ),
        pronunciation_hints="ICAO as eye-kay-oh, A380 as A three-eighty, EASA as ee-ah-sah",
        whisper_prompt="Aerodrome Reference Code, Annex 14, Field Length, 1800 meters, Code 4, Wingspan, Echo, Foxtrot, 65 meters, 80 meters, main gear span.",
        anchors={
            "eng_fail": ("slicing", "poles"),
            "fly_or_stop": ("airport",),
            "act1_end": ("airport",),
            "act2_start": ("annex",),
            "asda_reveal": ("numbers", "field"),
            "toda_reveal": ("eighteen", "1800", "18", "meters"),
            "act2_end": ("four", "4"),
            "act3_start": ("letters", "wingspan"),
            "asdr_draw": ("delta", "echo"),
            "todr_draw": ("foxtrot", "gear"),
            "v1_collide": ("completely",),
            "act3_end": ("completely",),
            "act4_start": ("pilot",),
            "quiz_go": ("fourteen", "14", "annex"),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("wingspan",),
            "rule_1": ("field", "length"),
            "rule_2": ("eighteen", "1800", "four"),
            "rule_3": ("wingspan",),
        },
        seed_1=10281,
        act1_prompt=(
            "Photorealistic vertical overhead shot of a massive four-engine widebody jetliner taxiing down a "
            "concrete airport taxiway past illuminated yellow clearance bars and distant edge lights at dusk, "
            "subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10282,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric miniature aircraft ruler diorama comparing runway "
            "length next to the wide wingspan of a sleek white model jumbo jet over blue measurement blocks, "
            "tilt-shift depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "CODE 4E // WINGSPAN",
            "start_val": 36.0,
            "end_val": 64.8,
            "decimals": 1,
            "unit": "m",
            "warn_banner": "▲ SPAN APPROACHES 65M TAXIWAY LIMIT",
            "question_pill": "LETTER BY GEAR SPAN OR WINGSPAN?",
        },
        act2_pills={
            "top_pill": "CODE = NUMBER + LETTER",
            "left_top": "ELEMENT 1 (1 TO 4)",
            "left_hero": "LENGTH",
            "left_sub": "FIELD LEN <800 .. >=1800M",
            "right_top": "ELEMENT 2 (A TO F)",
            "right_hero": "WINGSPAN",
            "right_sub": "SPAN <15M UP TO 80M MAX",
        },
        act3_board={
            "fcom_file": "ANNEX_14_SEC_1_6.DOC",
            "fcom_tag": "OMGWS DECOUPLED!",
            "chart_file": "REF_CODE_LETTERS.PDF",
            "chart_type": "bars_compare",
            "x_label": "MAX AIRCRAFT WINGSPAN LIMIT (METERS) →",
            "y_label": "CODE",
            "marker_label": "LETTER = WINGSPAN ONLY",
            "bfl_pill": "CODE 1 <800 · CODE 2 <1200 · CODE 3 <1800 · CODE 4 >=1800 M ARFL",
            "highlight_row": 2,
            "bars": [
                ("CODE C (A320)", 36, (2, 132, 199), "24 TO <36 M"),
                ("CODE D (B767)", 52, (217, 119, 6), "36 TO <52 M"),
                ("CODE E (B777)", 65, (5, 150, 105), "52 TO <65 M"),
                ("CODE F (A380)", 80, (225, 29, 72), "65 TO <80 M"),
            ],
        },
        act45_quiz={
            "headline_1": "CURRENT ANNEX 14 CODE",
            "headline_2": "LETTER DEPENDS SOLELY ON?",
            "opt_a_val": "WINGSPAN",
            "opt_a_sub": "UP TO 80 M MAX (F)",
            "opt_b_val": "GEAR + SPAN",
            "opt_b_sub": "OUTER MAIN GEAR WIDTH",
            "correct_opt": "A",
            "verdict_banner": "WINGSPAN ONLY — OMGWS SPLIT OUT!",
            "rules": [
                ("1. NUMBER 1 TO 4", "REF FIELD LENGTH"),
                ("2. CODE 4 >= 1,800 M", "CODES 1/2/3/4 BY ARFL"),
                ("3. LETTER A–F", "WINGSPAN (<15..80 M)"),
            ],
        },
    ),

    "AIR_LAW_REGISTRATION": _air_law(
        "AIR_LAW_REGISTRATION",
        title="Annex 7 Aircraft Nationality & Marks",
        exam_takeaway="Annex 7 marks pair Nationality + Registration separated by a hyphen, require a fireproof ID plate near the main entrance, and mandate 50 cm wing / 30 cm fuselage minimum letter height.",
        transcript=(
            "Freshly painted airliner rolls out wearing sleek tail markings: Golf Dash Four Tango Charlie. "
            "Ramp audit grabs a steel tape measure — forty centimeters under the wing, and only twenty on the tail! "
            "Clear to launch, or illegal paint? "
            "ICAO Annex Seven governs nationality, registration marks, and strict fireproof metal plates. "
            "One hyphen separates the State nationality code from the registration group unless the first registration symbol is a number, and no jet can hold two national registries simultaneously. "
            "Measure the legal paint sizes: heavier-than-air aircraft need at least fifty centimeters tall under the wing, and thirty centimeters tall on fuselage sides and tail fin — plus a fireproof steel ID plate fixed near the main entrance! "
            "Pilot call. EASA exam trap. "
            "Where must the mandatory fireproof aircraft identification plate be affixed under Annex Seven? "
            "Three... Two... One. "
            "Near the main entrance! Never hidden inside an avionics bay. "
            "Save this rule: Wing fifty centimeters, fuselage thirty centimeters, fireproof plate by main door."
        ),
        pronunciation_hints="ICAO as eye-kay-oh, EASA as ee-ah-sah, G dash 4 T C cleanly",
        whisper_prompt="Annex 7, registration marks, nationality mark, hyphen, 50 centimeters, 30 centimeters, fireproof plate, main entrance.",
        anchors={
            "eng_fail": ("twenty", "20", "tail"),
            "fly_or_stop": ("clear", "paint"),
            "act1_end": ("paint",),
            "act2_start": ("annex", "seven", "7"),
            "asda_reveal": ("hyphen",),
            "toda_reveal": ("simultaneously",),
            "act2_end": ("simultaneously",),
            "act3_start": ("measure", "legal"),
            "asdr_draw": ("fifty", "50", "wing"),
            "todr_draw": ("thirty", "30", "fuselage"),
            "v1_collide": ("fireproof", "entrance"),
            "act3_end": ("entrance",),
            "act4_start": ("pilot",),
            "quiz_go": ("seven", "7"),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("near", "entrance"),
            "rule_1": ("fifty", "50", "wing"),
            "rule_2": ("thirty", "30", "fuselage"),
            "rule_3": ("fireproof", "door"),
        },
        seed_1=10291,
        act1_prompt=(
            "Photorealistic vertical close-up looking up at a gleaming white commercial jetliner fuselage tail "
            "section and underwing surface inside a sunlit paint hangar as an aviation inspector measures "
            "sleek painted aircraft markings, subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10292,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric miniature aircraft paint shop diorama showing a smooth "
            "white model airliner fuselage beside a silver engraved metal ID plaque near a tiny cabin door, "
            "tilt-shift depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "ANNEX 7 // MARK HEIGHT",
            "start_val": 20,
            "end_val": 50,
            "unit": "CM",
            "warn_banner": "▲ UNDERSIZED WING / TAIL LETTERS",
            "question_pill": "WHERE DOES FIREPROOF PLATE GO?",
        },
        act2_pills={
            "top_pill": "ANNEX 7 PAINT & PLATE LAW",
            "left_top": "DUAL REGISTRATION",
            "left_hero": "FORBIDDEN",
            "left_sub": "ONE STATE AT A TIME ONLY",
            "right_top": "ID PLATE MATERIAL",
            "right_hero": "FIREPROOF",
            "right_sub": "NEAR MAIN CABIN DOOR",
        },
        act3_board={
            "fcom_file": "ICAO_ANNEX_7.DOC",
            "fcom_tag": "STROKE WIDTH = H / 6",
            "chart_file": "REGISTRATION_SIZE_LIMITS.PDF",
            "chart_type": "bars_compare",
            "x_label": "MINIMUM LETTER HEIGHT (CM) →",
            "y_label": "PART",
            "marker_label": "PLATE NEAR MAIN DOOR",
            "bfl_pill": "HYPHEN BETWEEN NATIONALITY & REG UNLESS 1ST CHAR IS NUMBER",
            "highlight_row": 0,
            "bars": [
                ("WING BOTTOM", 50, (5, 150, 105), "50 CM MIN"),
                ("FUSELAGE", 30, (2, 132, 199), "30 CM MIN"),
                ("TAIL SURFACES", 30, (217, 119, 6), "30 CM MIN"),
                ("AIRSHIPS", 50, (225, 29, 72), "50 CM MIN"),
            ],
        },
        act45_quiz={
            "headline_1": "ANNEX 7 FIREPROOF ID",
            "headline_2": "PLATE IS MOUNTED?",
            "opt_a_val": "AVIONICS BAY",
            "opt_a_sub": "NOSE GEAR WELL BULKHEAD",
            "opt_b_val": "MAIN ENTRANCE",
            "opt_b_sub": "SECURED NEAR CABIN DOOR",
            "correct_opt": "B",
            "verdict_banner": "SECURED NEAR THE MAIN ENTRANCE!",
            "rules": [
                ("1. WING MARKS >= 50 CM", "FUSELAGE/TAIL >= 30 CM"),
                ("2. STROKE = 1/6 HEIGHT", "ONE REGISTRY STATE ONLY"),
                ("3. FIREPROOF ID PLATE", "NEAR MAIN ENTRANCE"),
            ],
        },
    ),

    "AIR_LAW_RULES_DETAILS": _air_law(
        "AIR_LAW_RULES_DETAILS",
        title="Right-of-Way & SERA Minimum Heights",
        exam_takeaway="Least-maneuverable gives priority (Balloon > Glider > Airship > Engine); converging gives way to RIGHT; head-on BOTH turn RIGHT; min heights 1000 ft / 600 m congested, 500 ft elsewhere.",
        transcript=(
            "Low coastal cruise in sunny VMC. "
            "Two aircraft close fast on intersecting tracks: a hot-air balloon drifts left, while a twin Cessna approaches squarely on your right wingtip. "
            "Climb over him, or yield right? "
            "Annex Two and SERA rank right-of-way strictly by maneuverability: Balloons win over Gliders, Gliders beat Airships, and Airships beat Powered aircraft — unless a plane is towing! "
            "Between equal powered aircraft, converging traffic always gives way to the aircraft on your right, head-on forces BOTH pilots right, and overtaking always passes safely on the right! "
            "Finally check VFR minimum heights: one thousand feet above the highest obstacle within six hundred meters of congested towns, or five hundred feet AGL elsewhere. "
            "Pilot call. EASA exam trap. "
            "Two powered aircraft converge at identical altitude — who holds the right of way? "
            "Three... Two... One. "
            "The aircraft on the RIGHT! You turn or slow to keep clear. "
            "Save this rule: Balloon Glider Airship Engine, yield to the Right, Thousand feet over towns."
        ),
        pronunciation_hints="SERA as see-rah, VMC as V-M-C, VFR as V-F-R, AGL as A-G-L, EASA as ee-ah-sah",
        whisper_prompt="Right of way, Balloon, Glider, Airship, Powered, converging, right, head-on, both right, overtaking, 1000 feet, 600 meters, 500 feet.",
        anchors={
            "eng_fail": ("right", "wingtip"),
            "fly_or_stop": ("climb", "yield"),
            "act1_end": ("right",),
            "act2_start": ("rank",),
            "asda_reveal": ("balloons", "gliders"),
            "toda_reveal": ("towing",),
            "act2_end": ("towing",),
            "act3_start": ("converging", "traffic"),
            "asdr_draw": ("headon", "head", "right"),
            "todr_draw": ("overtaking", "passes"),
            "v1_collide": ("thousand", "1000", "congested"),
            "act3_end": ("elsewhere",),
            "act4_start": ("pilot",),
            "quiz_go": ("way",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("aircraft", "right"),
            "rule_1": ("balloon", "engine"),
            "rule_2": ("yield", "right"),
            "rule_3": ("thousand", "1000", "towns"),
        },
        seed_1=10301,
        act1_prompt=(
            "Photorealistic vertical view from a light aircraft cockpit over green coastline seeing a "
            "bright colorful hot-air balloon drifting peacefully on the left and a twin-propeller aircraft "
            "converging slightly from the right under crisp sun, subtle 35mm film grain, no text, no logos"
        ),
        seed_2=10302,
        act2_prompt=(
            "Minimalist 3D matte pastel clay isometric miniature sky diorama showing four tiny vehicles in a "
            "vertical ladder: pastel hot-air balloon at top, sleek white glider, blimp airship, and twin-prop "
            "plane above a miniature town grid, tilt-shift depth of field, no text, no numbers"
        ),
        act1_hud={
            "label": "SERA // MIN VFR ALT",
            "start_val": 500,
            "end_val": 1000,
            "unit": "FT",
            "warn_banner": "▲ CONVERGING TRAFFIC ON RIGHT!",
            "question_pill": "POWERED CONVERGE — WHO HAS PRIORITY?",
        },
        act2_pills={
            "top_pill": "RIGHT-OF-WAY PRIORITY CHAIN",
            "left_top": "TOP PRIORITY",
            "left_hero": "BALLOON",
            "left_sub": "> GLIDER > AIRSHIP > ENG",
            "right_top": "EQUAL POWERED",
            "right_hero": "TO RIGHT",
            "right_sub": "ALL TURNS BREAK RIGHT",
        },
        act3_board={
            "fcom_file": "SERA_3210_3105.DOC",
            "fcom_tag": "LANDING & EMERG ALWAYS WIN",
            "chart_file": "COLLISION_AVOID_RULES.PDF",
            "chart_type": "rules_ladder",
            "x_label": "SERA RIGHT-OF-WAY & MINIMUM HEIGHTS",
            "y_label": "",
            "marker_label": "GIVE WAY TO RIGHT",
            "bfl_pill": "AIRCRAFT IN DISTRESS OR ON FINAL APPROACH ALWAYS HAS RIGHT-OF-WAY",
            "highlight_row": 0,
            "rows": [
                ("CONVERGING", "Give Way to Aircraft on RIGHT", "Towing aircraft beats powered aeroplanes", (225, 29, 72)),
                ("HEAD-ON", "BOTH Turn Right Immediately", "Never climb/descend blindly into other", (2, 132, 199)),
                ("OVERTAKING", "Overtaken Has Right-of-Way", "Overtaker passes strictly on the RIGHT", (5, 150, 105)),
                ("MIN HEIGHT", "1,000 ft / 600 m Over Towns", "500 ft AGL/ASL away from people/boats", (217, 119, 6)),
            ],
        },
        act45_quiz={
            "headline_1": "TWO EQUAL JETS CONVERGE",
            "headline_2": "AT SAME ALT — WHO HAS ROW?",
            "opt_a_val": "AIRCRAFT RIGHT",
            "opt_a_sub": "OTHER PILOT YIELDS",
            "opt_b_val": "FASTER JET",
            "opt_b_sub": "SLOWER YIELDS RIGHT",
            "correct_opt": "A",
            "verdict_banner": "AIRCRAFT ON THE RIGHT HAS PRIORITY!",
            "rules": [
                ("1. BAL>GLI>AIR>ENG", "TOWING & DISTRESS WIN"),
                ("2. CONVERGE / HEAD / OVR", "YIELD & PASS RIGHT"),
                ("3. VFR MIN HEIGHT", "1000 FT TOWN / 500 OTHER"),
            ],
        },
    ),
}
