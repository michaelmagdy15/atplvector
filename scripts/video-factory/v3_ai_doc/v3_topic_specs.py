#!/usr/bin/env python3
"""
Complete Day 1 (10 Topics) v3 Netflix Documentary Reel Specifications.

Covers:
  - 032 Performance (7): PERF_INTRO, PERF_TAKEOFF, PERF_CLIMB, PERF_CRUISE,
    PERF_LANDING, PERF_CLASS_A, PERF_CLASS_B
  - 081 Principles of Flight (3): POF_HIGH_SPEED, POF_STALL, POF_DRAG

Every topic uses the verified 6-Act structure:
  Act 1: ComfyUI MiniMax H3 photoreal aviation clip + HUD telemetry
  Act 2: ComfyUI MiniMax H3 matte 3D isometric clay diorama + tilt-shift + callouts
  Act 3: Pure 2D Netflix investigative evidence board + bespoke engineering chart
  Act 4: Noir amber spotlight interactive 3-2-1 EASA pilot-call quiz
  Act 5: Emerald spotlight verdict + 3 saveable EASA limits
  Act 6: Branded ATPLVECTOR outro sting
"""

from __future__ import annotations

DAY1_ORDER = [
    "PERF_INTRO",
    "PERF_TAKEOFF",
    "PERF_CLIMB",
    "PERF_CRUISE",
    "PERF_LANDING",
    "PERF_CLASS_A",
    "PERF_CLASS_B",
    "POF_HIGH_SPEED",
    "POF_STALL",
    "POF_DRAG",
]

TOPIC_SPECS: dict[str, dict] = {
    "PERF_INTRO": {
        "view": "PERF_INTRO",
        "subject_code": "032",
        "subject_name": "PERFORMANCE",
        "title": "Density Altitude & TAS vs IAS",
        "outro_sub": "032 PERFORMANCE · MASTER EVERY EASA TOPIC",
        "transcript": (
            "High altitude, scorching heat, and humid air quietly strip thrust off your wings. "
            "Watch your indicated airspeed climbing to one hundred and forty knots, while groundspeed accelerates past one hundred and seventy. "
            "Same cockpit gauge — way more runway needed. "
            "At sea level, dense air packs power into engines and lift over wings. "
            "Climb a hot airport to eight thousand feet, and thinner air forces true airspeed far higher than indicated. "
            "As density altitude rises, air density falls sharply. "
            "Meanwhile, true airspeed climbs roughly two percent per thousand feet above sea level. "
            "Pilot call. EASA exam trap. "
            "Does your indicated lift-off speed change at an eight-thousand-foot runway? "
            "Three... Two... One. "
            "Stays identical! You rotate at the same IAS, only groundspeed skyrockets. "
            "Save this rule: high altitude, high temperature, high humidity."
        ),
        "pronunciation_hints": "EASA as ee-ah-sah, IAS as eye-A-S, TAS as T-A-S, rho as density",
        "whisper_prompt": "Density altitude, IAS, TAS, EASA, groundspeed, eight thousand feet, sea level.",
        "anchors": {
            "eng_fail": ("groundspeed", "accelerates"),
            "fly_or_stop": ("same", "cockpit"),
            "act1_end": ("needed",),
            "act2_start": ("sea",),
            "asda_reveal": ("dense",),
            "toda_reveal": ("hot", "thinner"),
            "act2_end": ("indicated",),
            "act3_start": ("density", "altitude"),
            "asdr_draw": ("density", "falls"),
            "todr_draw": ("meanwhile", "true"),
            "v1_collide": ("two", "percent"),
            "act3_end": ("level",),
            "act4_start": ("pilot",),
            "quiz_go": ("runway",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("stays", "identical"),
            "rule_1": ("high",),
            "rule_2": ("temperature",),
            "rule_3": ("humidity",),
        },
        "seed_1": 32011,
        "act1_prompt": (
            "Photorealistic cinematic vertical shot of a commercial twin-engine jetliner "
            "accelerating down a sun-baked desert mountain airport runway surrounded by red "
            "rock peaks under shimmering hot air heat haze and golden afternoon sun, dramatic "
            "forward tracking chase camera, subtle 35mm film grain, no text, no logos"
        ),
        "seed_2": 32012,
        "act2_prompt": (
            "Minimalist stylized 3D matte pastel clay isometric miniature airport diorama on "
            "a warm desert sand studio table showing two miniature runways side by side with "
            "tiny white model airliners, tiny cream hangars, warm directional studio shadows, "
            "tilt-shift miniature shallow depth of field, smooth overhead camera glide, "
            "no text, no numbers"
        ),
        "act1_hud": {
            "label": "TAS // HOT & HIGH",
            "start_val": 142,
            "end_val": 172,
            "unit": "KT",
            "warn_banner": "▲ DENSITY ALT EXTREME",
            "question_pill": "SAME IAS — OR MORE RUNWAY?",
        },
        "act2_pills": {
            "top_pill": "DENSITY ALTITUDE EFFECT",
            "left_top": "SEA LEVEL",
            "left_hero": "DENSE",
            "left_sub": "SHORT T/O ROLL",
            "right_top": "HOT & HIGH",
            "right_hero": "THIN",
            "right_sub": "+2% TAS / 1000FT",
        },
        "act3_board": {
            "fcom_file": "EASA_PERF_032.DOC",
            "fcom_tag": "CS-25 // DENSITY ALT",
            "chart_file": "TAS_VS_DENSITY.PDF",
            "chart_type": "dual_diverge",
            "x_label": "DENSITY ALTITUDE →",
            "y_label": "RATIO",
            "curve1_label": "AIR DENSITY",
            "curve2_label": "TRUE AIRSPEED",
            "marker_label": "8000 FT: +16% TAS",
            "bfl_pill": "+2% TAS PER 1,000 FT DENSITY ALT",
        },
        "act45_quiz": {
            "headline_1": "INDICATED LIFT-OFF",
            "headline_2": "AT 8,000 FT RWY?",
            "opt_a_val": "HIGHER",
            "opt_a_sub": "INCREASES IAS",
            "opt_b_val": "SAME IAS",
            "opt_b_sub": "GROUND SPD UP",
            "correct_opt": "B",
            "verdict_banner": "ROTATE AT SAME IAS!",
            "rules": [
                ("1. HIGH ALTITUDE", "LOWER PRESSURE"),
                ("2. HIGH TEMP", "LOWER DENSITY"),
                ("3. HIGH HUMIDITY", "WATER VAPOR DROP"),
            ],
        },
    },
    "PERF_TAKEOFF": {
        "view": "PERF_TAKEOFF",
        "subject_code": "032",
        "subject_name": "PERFORMANCE",
        "title": "Balanced Field Length & V1",
        "outro_sub": "032 PERFORMANCE · MASTER EVERY EASA TOPIC",
        "transcript": (
            "One hundred and forty knots down a wet runway. "
            "One engine just failed. "
            "You have less than one second: fly, or slam the brakes. "
            "At V1, the runway splits in two. "
            "Before it, you stop inside the paved stopway — that is ASDA. "
            "Past it, you rotate and climb through the clearway — that is TODA. "
            "Push V1 higher, and stopping takes longer. "
            "Drop V1 lower, and flying on one engine takes longer. "
            "Where those two curves collide is your Balanced Field Length. "
            "Pilot call. EASA exam trap. "
            "Engine fails two knots before V1 — stop, or go? "
            "Three... Two... One. "
            "Stop. Reject the takeoff immediately. "
            "Save this rule: V1 is never below VMCG, "
            "never above VR, and never above brake energy VMBE."
        ),
        "pronunciation_hints": (
            "V1 as vee-one, ASDA as az-dah, TODA as toe-dah, EASA as ee-ah-sah, "
            "VMCG as vee-M-C-G, VR as vee-R, VMBE as vee-M-B-E"
        ),
        "whisper_prompt": (
            "One hundred and forty knots down a wet runway. V1, ASDA, TODA, "
            "stopway, clearway, Balanced Field Length, EASA, VMCG, VR, VMBE."
        ),
        "anchors": {
            "eng_fail": ("engine",),
            "fly_or_stop": ("fly",),
            "act1_end": ("brakes", "brake"),
            "act2_start": ("at", "splits"),
            "asda_reveal": ("before",),
            "toda_reveal": ("past", "passed"),
            "act2_end": ("clearway",),
            "act3_start": ("push",),
            "asdr_draw": ("push",),
            "todr_draw": ("drop",),
            "v1_collide": ("collide", "intersect"),
            "act3_end": ("length",),
            "act4_start": ("pilot",),
            "quiz_go": ("go",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("stop",),
            "rule_1": ("below",),
            "rule_2": ("above",),
            "rule_3": ("brake", "energy"),
        },
        "seed_1": 3201,
        "act1_prompt": (
            "Photorealistic cinematic vertical aerial chase shot behind a commercial "
            "twin-engine widebody jetliner accelerating rapidly down a dark rain-slicked "
            "asphalt airport runway at dramatic crimson-orange sunset, glowing blue "
            "taxiway edge lights and bright white centerline strobe lights streaking past "
            "into the horizon, wet specular reflections on the runway, dramatic orange "
            "sparks and dark exhaust plume suddenly bursting from the right wing engine "
            "nacelle, gripping Netflix aviation documentary cinematography, 35mm film "
            "grain, smooth dynamic forward tracking camera, no text, no logos, no subtitles"
        ),
        "seed_2": 3202,
        "act2_prompt": (
            "Minimalist stylized 3D matte pastel clay isometric miniature airport diorama "
            "on a warm terracotta peach matte studio table, sleek dark teal asphalt "
            "runway and parallel taxiway, three cream rounded arched airport hangars, "
            "a small miniature control tower casting soft warm directional studio shadows, "
            "a tiny matte white twin-engine airliner rolling smoothly along the runway "
            "and lifting off gently, tilt-shift miniature shallow depth of field lens "
            "blur, slow smooth overhead camera glide, clean architectural clay model look, "
            "no text, no numbers, no letters"
        ),
        "act1_hud": {
            "label": "IAS // WET RWY",
            "start_val": 98,
            "end_val": 140,
            "unit": "KT",
            "warn_banner": "▲ MASTER WARN · ENG 2 FAIL",
            "question_pill": "FLY — OR SLAM THE BRAKES?",
        },
        "act2_pills": {
            "top_pill": "V1 · DECISION GATE",
            "left_top": "BEFORE V1",
            "left_hero": "ASDA",
            "left_sub": "STOPWAY · ABORT",
            "right_top": "PAST V1",
            "right_hero": "TODA",
            "right_sub": "CLEARWAY · CLIMB",
        },
        "act3_board": {
            "fcom_file": "EASA_FCOM_032.DOC",
            "fcom_tag": "CS-25.107 · V1",
            "chart_file": "CS25_BALANCED_FIELD.PDF",
            "chart_type": "crossing",
            "x_label": "DECISION SPEED (V1) →",
            "y_label": "DIST",
            "curve1_label": "ASDR (STOP)",
            "curve2_label": "TODR (GO)",
            "marker_label": "BALANCED V1",
            "bfl_pill": "BALANCED FIELD · ASDR = TODR",
        },
        "act45_quiz": {
            "headline_1": "ENGINE FAILS",
            "headline_2": "2 KT BEFORE V1",
            "opt_a_val": "STOP",
            "opt_a_sub": "REJECT TAKEOFF",
            "opt_b_val": "GO",
            "opt_b_sub": "CONTINUE FLYING",
            "correct_opt": "A",
            "verdict_banner": "REJECT TAKEOFF IMMEDIATELY",
            "rules": [
                ("1. V1 ≥ VMCG", "MIN CONTROL GROUND"),
                ("2. V1 ≤ VR", "ROTATION SPEED"),
                ("3. V1 ≤ VMBE", "MAX BRAKE ENERGY"),
            ],
        },
    },
    "PERF_CLIMB": {
        "view": "PERF_CLIMB",
        "subject_code": "032",
        "subject_name": "PERFORMANCE",
        "title": "Vx vs Vy & Excess Thrust",
        "outro_sub": "032 PERFORMANCE · MASTER EVERY EASA TOPIC",
        "transcript": (
            "Liftoff! Steep terrain rises straight ahead off the departure end of the runway. "
            "Four hundred feet above concrete, you need every inch of vertical clearance — pitch steep for best angle, or nose lower for faster rate? "
            "Best angle speed VX squeezes maximum climb gradient over horizontal distance. "
            "Best rate speed VY chases maximum altitude gained every minute. "
            "For jets, thrust available stays nearly flat across speeds, while thrust required dips low in the middle. "
            "Where that gap opens widest gives maximum excess thrust — defining your steepest angle VX. "
            "Pilot call. EASA exam trap. "
            "Flying into a forty-knot headwind: does it boost climb angle, or vertical climb rate? "
            "Three... Two... One. "
            "Angle only! Headwind shrinks your ground track, while vertical speed never changes. "
            "Save this rule: VX needs excess thrust, VY needs excess power, headwind boosts angle."
        ),
        "pronunciation_hints": "VX as vee-X, VY as vee-Y, EASA as ee-ah-sah",
        "whisper_prompt": "Liftoff, steep terrain, VX, VY, excess thrust, excess power, forty-knot headwind, climb gradient.",
        "anchors": {
            "eng_fail": ("terrain",),
            "fly_or_stop": ("vertical", "clearance"),
            "act1_end": ("rate",),
            "act2_start": ("best",),
            "asda_reveal": ("angle",),
            "toda_reveal": ("rate",),
            "act2_end": ("minute",),
            "act3_start": ("jets",),
            "asdr_draw": ("available", "flat"),
            "todr_draw": ("required", "dips"),
            "v1_collide": ("gap", "excess"),
            "act3_end": ("vx",),
            "act4_start": ("pilot",),
            "quiz_go": ("rate",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("angle",),
            "rule_1": ("thrust",),
            "rule_2": ("power",),
            "rule_3": ("headwind",),
        },
        "seed_1": 32031,
        "act1_prompt": (
            "Photorealistic vertical aerial shot chasing behind a climbing commercial twinjet "
            "rising steeply over dark misty pine mountain ridges just ahead at dramatic dawn, "
            "landing gear tucking smoothly away, crisp dramatic atmosphere, 35mm film grain, "
            "no text, no logos"
        ),
        "seed_2": 32032,
        "act2_prompt": (
            "Minimalist stylized 3D matte pastel clay isometric miniature airport departure scene "
            "on a warm peach terracotta table showing a tiny white jetliner climbing steeply past "
            "sculpted sage clay hills, tilt-shift miniature depth of field, soft studio shadows, "
            "smooth slow camera glide, no text, no numbers"
        ),
        "act1_hud": {
            "label": "CLIMB // OBSTACLE",
            "start_val": 4.2,
            "end_val": 6.8,
            "unit": "%",
            "decimals": 1,
            "warn_banner": "▲ CLOSE-IN TERRAIN AHEAD",
            "question_pill": "STEEP ANGLE — OR FAST RATE?",
        },
        "act2_pills": {
            "top_pill": "VX VS VY CLIMB",
            "left_top": "STEEPEST",
            "left_hero": "VX",
            "left_sub": "EXCESS THRUST",
            "right_top": "FASTEST",
            "right_hero": "VY",
            "right_sub": "EXCESS POWER",
        },
        "act3_board": {
            "fcom_file": "FCOM_CLIMB_032.DOC",
            "fcom_tag": "GRADIENT = (T-D) / W",
            "chart_file": "EXCESS_THRUST_VX.PDF",
            "chart_type": "climb_thrust",
            "x_label": "AIRSPEED (IAS) →",
            "y_label": "THRUST",
            "curve1_label": "THRUST REQ",
            "curve2_label": "THRUST AVAIL",
            "marker_label": "MAX EXCESS THRUST",
            "bfl_pill": "MAX EXCESS THRUST = STEEPEST VX",
        },
        "act45_quiz": {
            "headline_1": "40 KT HEADWIND",
            "headline_2": "ON CLIMB OUT?",
            "opt_a_val": "ANGLE ONLY",
            "opt_a_sub": "STEEPER GRADIENT",
            "opt_b_val": "RATE TOO",
            "opt_b_sub": "MORE FT / MIN",
            "correct_opt": "A",
            "verdict_banner": "HEADWIND BOOSTS ANGLE ONLY",
            "rules": [
                ("1. VX = EXCESS THRUST", "MAX GRADIENT"),
                ("2. VY = EXCESS POWER", "MAX FT / MIN"),
                ("3. WIND ≠ VERT RATE", "GROUND TRACK ONLY"),
            ],
        },
    },
    "PERF_CRUISE": {
        "view": "PERF_CRUISE",
        "subject_code": "032",
        "subject_name": "PERFORMANCE",
        "title": "Specific Air Range & Step Climb",
        "outro_sub": "032 PERFORMANCE · MASTER EVERY EASA TOPIC",
        "transcript": (
            "Flight level three-four-zero across the North Atlantic, smashing into a fierce hundred-knot headwind. "
            "Every kilogram of fuel counts on a long crossing. Slow down to stretch fuel flow, or push thrust faster? "
            "Maximum Range Cruise sits right at the peak of Specific Air Range. "
            "Airlines instead fly Long Range Cruise slightly faster — trading one percent fuel range for a four percent speed boost. "
            "On the Specific Air Range arch, range rises to the crest before wave drag pulls it down. "
            "Burn fuel, get lighter, and step climb higher to lift your whole range curve up. "
            "Pilot call. EASA exam trap. "
            "Into a strong hundred-knot headwind for best range: slow down, or speed up? "
            "Three... Two... One. "
            "Speed up! Flying slower leaves you fighting the headwind longer. "
            "Save this rule: LRC trades one percent, speed up into headwinds, step climb lighter."
        ),
        "pronunciation_hints": "LRC as L-R-C, MRC as M-R-C, EASA as ee-ah-sah",
        "whisper_prompt": "Atlantic, headwind, Maximum Range Cruise, Long Range Cruise, Specific Air Range, step climb, LRC.",
        "anchors": {
            "eng_fail": ("headwind", "fierce"),
            "fly_or_stop": ("slow", "down"),
            "act1_end": ("faster",),
            "act2_start": ("maximum",),
            "asda_reveal": ("peak",),
            "toda_reveal": ("long",),
            "act2_end": ("boost",),
            "act3_start": ("arch", "curve"),
            "asdr_draw": ("rises", "crest"),
            "todr_draw": ("lighter", "step"),
            "v1_collide": ("curve", "up"),
            "act3_end": ("up",),
            "act4_start": ("pilot",),
            "quiz_go": ("speed",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("speed",),
            "rule_1": ("percent",),
            "rule_2": ("headwinds", "headwind"),
            "rule_3": ("step",),
        },
        "seed_1": 32041,
        "act1_prompt": (
            "Photorealistic vertical high-altitude shot behind a widebody jetliner cruising "
            "above endless thick silver cloud tops at twilight horizon with crisp contrails "
            "streaming into golden sunset, gripping Netflix documentary feel, 35mm film grain, "
            "no text, no logos"
        ),
        "seed_2": 32042,
        "act2_prompt": (
            "Minimalist stylized 3D matte pastel clay isometric miniature cloudscape on a warm "
            "cream studio backdrop showing a tiny matte white jetliner gliding smoothly along "
            "an elevated step climb arc above soft sculpted pastel clouds, tilt-shift blur, "
            "soft warm shadows, no text, no numbers"
        ),
        "act1_hud": {
            "label": "HEADWIND // FL340",
            "start_val": 62,
            "end_val": 100,
            "unit": "KT",
            "warn_banner": "▲ STRONG JETSTREAM HEADWIND",
            "question_pill": "SLOW DOWN — OR SPEED UP?",
        },
        "act2_pills": {
            "top_pill": "CRUISE OPTIMIZATION",
            "left_top": "100% NM/KG",
            "left_hero": "MRC",
            "left_sub": "PEAK AIR RANGE",
            "right_top": "99% NM/KG",
            "right_hero": "LRC",
            "right_sub": "+4% CRUISE SPD",
        },
        "act3_board": {
            "fcom_file": "FCOM_CRUISE_032.DOC",
            "fcom_tag": "SAR = TAS / FUEL FLOW",
            "chart_file": "SPECIFIC_RANGE_SAR.PDF",
            "chart_type": "sar_arch",
            "x_label": "MACH / TAS →",
            "y_label": "SAR",
            "curve1_label": "SAR CURVE",
            "curve2_label": "99% LRC",
            "marker_label": "LRC GATE",
            "bfl_pill": "LRC = 99% RANGE AT +4% SPEED",
        },
        "act45_quiz": {
            "headline_1": "100 KT HEADWIND",
            "headline_2": "FOR MAX RANGE?",
            "opt_a_val": "SLOW DOWN",
            "opt_a_sub": "CUT FUEL FLOW",
            "opt_b_val": "SPEED UP",
            "opt_b_sub": "CUT WIND TIME",
            "correct_opt": "B",
            "verdict_banner": "FLY FASTER INTO HEADWINDS",
            "rules": [
                ("1. LRC = 99% SAR", "+4% SPEED BONUS"),
                ("2. HEADWIND → FASTER", "MIN WIND EXPOSURE"),
                ("3. STEP CLIMB LIGHT", "HIGHER SAR ARCH"),
            ],
        },
    },
    "PERF_LANDING": {
        "view": "PERF_LANDING",
        "subject_code": "032",
        "subject_name": "PERFORMANCE",
        "title": "Factored Landing Distance",
        "outro_sub": "032 PERFORMANCE · MASTER EVERY EASA TOPIC",
        "transcript": (
            "Descending fast toward a rain-lashed runway at night. "
            "Test pilots once nailed that stop with maximum certification braking — performance you can never repeat on winter concrete. "
            "Will your dispatched runway be long enough? "
            "Dry jet dispatch demands stopping inside sixty percent of available runway — dividing actual distance by zero point six. "
            "Dispatch onto a wet runway, and regulations multiply that entire dry requirement by one point one five. "
            "Measured from fifty feet over the threshold down to full stop, factors triple the raw roll gap: "
            "turboprops divide by zero point seven, jets by zero point six, and wet pushes to one point nine two. "
            "Pilot call. EASA exam trap. "
            "Calculating dry dispatch landing distance for a CS-25 jet: do thrust reversers count? "
            "Three... Two... One. "
            "Zero credit! Dry dispatch assumes wheel brakes and spoilers only. "
            "Save this rule: jets divide by zero six, props zero seven, wet times one one five."
        ),
        "pronunciation_hints": "EASA as ee-ah-sah, CS-25 as C-S-twenty-five",
        "whisper_prompt": "Rain runway, sixty percent, zero point six, one point one five, turboprops, CS-25, thrust reversers.",
        "anchors": {
            "eng_fail": ("maximum", "certification"),
            "fly_or_stop": ("dispatched", "enough"),
            "act1_end": ("enough",),
            "act2_start": ("dry",),
            "asda_reveal": ("sixty",),
            "toda_reveal": ("wet",),
            "act2_end": ("five",),
            "act3_start": ("fifty",),
            "asdr_draw": ("turboprops",),
            "todr_draw": ("jets",),
            "v1_collide": ("nine", "wet"),
            "act3_end": ("two",),
            "act4_start": ("pilot",),
            "quiz_go": ("count",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("zero", "credit"),
            "rule_1": ("six",),
            "rule_2": ("seven",),
            "rule_3": ("five",),
        },
        "seed_1": 32051,
        "act1_prompt": (
            "Photorealistic vertical cockpit approach view looking through wet windshield rain "
            "toward glowing emerald and white runway approach lights on a dark stormy evening, "
            "dramatic water spray and glowing airport runway concrete rushing closer, 35mm film "
            "grain, no text, no logos"
        ),
        "seed_2": 32052,
        "act2_prompt": (
            "Minimalist stylized 3D matte pastel clay isometric miniature airport landing diorama "
            "on a warm terracotta studio table with a sleek dark teal runway, three cream arched "
            "hangars, and a tiny white twinjet touching down cleanly with soft studio lighting and "
            "tilt-shift blur, no text, no numbers"
        ),
        "act1_hud": {
            "label": "LDR // WET RWY",
            "start_val": 1540,
            "end_val": 1920,
            "unit": "M",
            "warn_banner": "▲ WET DISPATCH MARGIN CHECK",
            "question_pill": "DO REVERSERS COUNT DRY?",
        },
        "act2_pills": {
            "top_pill": "CS-25 LANDING FACTORS",
            "left_top": "DRY JET",
            "left_hero": "÷ 0.60",
            "left_sub": "60% LDA (×1.67)",
            "right_top": "WET JET",
            "right_hero": "× 1.15",
            "right_sub": "+15% ON DRY LDR",
        },
        "act3_board": {
            "fcom_file": "CAT_POL_A_230.DOC",
            "fcom_tag": "50 FT SCREEN → STOP",
            "chart_file": "LANDING_BUFFERS.PDF",
            "chart_type": "bars_compare",
            "x_label": "REQUIRED FACTOR →",
            "y_label": "CASE",
            "bars": [
                ("DRY ALD", 1.00, (100, 116, 139)),
                ("PROP DRY", 1.43, (56, 189, 248)),
                ("JET DRY", 1.67, (245, 158, 11)),
                ("JET WET", 1.92, (225, 29, 72)),
            ],
            "bfl_pill": "DRY ÷ 0.60 (JET)  |  WET × 1.15",
        },
        "act45_quiz": {
            "headline_1": "DRY JET DISPATCH",
            "headline_2": "THRUST REVERSERS?",
            "opt_a_val": "NO CREDIT",
            "opt_a_sub": "WHEEL BRAKES ONLY",
            "opt_b_val": "-15% CREDIT",
            "opt_b_sub": "COUNT REVERSERS",
            "correct_opt": "A",
            "verdict_banner": "ZERO DRY REVERSER CREDIT",
            "rules": [
                ("1. JETS ÷ 0.60", "60% RULE (×1.67)"),
                ("2. PROPS ÷ 0.70", "70% RULE (×1.43)"),
                ("3. WET × 1.15", "+15% OVER DRY LDR"),
            ],
        },
    },
    "PERF_CLASS_A": {
        "view": "PERF_CLASS_A",
        "subject_code": "032",
        "subject_name": "PERFORMANCE",
        "title": "Class A OEI Segments & Net Path",
        "outro_sub": "032 PERFORMANCE · MASTER EVERY EASA TOPIC",
        "transcript": (
            "One engine quits right after V1 on a heavy twinjet departure. "
            "Mountains ring the airport only miles away. Only certified engine-out climb guarantees your wings clear terrain safely. "
            "CS-25 divides climb into four distinct segments. "
            "Segment one tucks the landing gear cleanly, then segment two climbs at V2 demanding at least two point four percent on twins. "
            "Flight tests record raw Gross climb performance. "
            "Before clearing obstacles by thirty-five feet, regulators deduct a mandatory safety penalty — point eight twins, point nine tris, one percent quads. "
            "Pilot call. EASA exam trap. "
            "Verifying thirty-five-foot obstacle clearance off departure: Gross gradient, or Net flight path? "
            "Three... Two... One. "
            "Net flight path! Never trust raw Gross gradient near terrain. "
            "Save this rule: twins minus zero eight, tris minus zero nine, quads minus one point zero."
        ),
        "pronunciation_hints": "V1 as vee-one, V2 as vee-two, CS-25 as C-S-twenty-five, EASA as ee-ah-sah",
        "whisper_prompt": "V1, V2, CS-25, segment two, two point four percent, Gross, Net flight path, thirty-five feet.",
        "anchors": {
            "eng_fail": ("mountains",),
            "fly_or_stop": ("guarantees", "wings"),
            "act1_end": ("safely",),
            "act2_start": ("four", "divides"),
            "asda_reveal": ("gear",),
            "toda_reveal": ("second",),
            "act2_end": ("twins",),
            "act3_start": ("tests", "record"),
            "asdr_draw": ("gross",),
            "todr_draw": ("penalty",),
            "v1_collide": ("nine", "percent"),
            "act3_end": ("quads",),
            "act4_start": ("pilot",),
            "quiz_go": ("path",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("net",),
            "rule_1": ("eight",),
            "rule_2": ("nine",),
            "rule_3": ("quads",),
        },
        "seed_1": 32061,
        "act1_prompt": (
            "Photorealistic vertical aerial shot behind a heavy twinjet airliner banking slightly "
            "after takeoff climbing above dark snow-dusted mountain ridges in crisp dawn light "
            "with landing gear doors closing cleanly beneath the fuselage, 35mm film grain, "
            "no text, no logos"
        ),
        "seed_2": 32062,
        "act2_prompt": (
            "Minimalist stylized 3D matte pastel clay isometric miniature airport departure diorama "
            "showing four clean stepped climb markers above a teal runway toward miniature cream "
            "mountain peaks on a peach studio surface, tilt-shift blur, warm soft shadows, no text"
        ),
        "act1_hud": {
            "label": "SEG 2 // OEI MIN",
            "start_val": 2.4,
            "end_val": 2.4,
            "unit": "%",
            "decimals": 1,
            "warn_banner": "▲ OEI OBSTACLE CLEARANCE",
            "question_pill": "GROSS — OR NET FLIGHT PATH?",
        },
        "act2_pills": {
            "top_pill": "CS-25 OEI SEGMENTS",
            "left_top": "SEGMENT 1",
            "left_hero": "> 0%",
            "left_sub": "GEAR UP · +CLIMB",
            "right_top": "SEGMENT 2",
            "right_hero": "2.4%",
            "right_sub": "V2 TO 400 FT (TWIN)",
        },
        "act3_board": {
            "fcom_file": "CS25_121_OEI.DOC",
            "fcom_tag": "NET = GROSS - PENALTY",
            "chart_file": "NET_GRADIENT_LOSS.PDF",
            "chart_type": "bars_compare",
            "x_label": "EASA PENALTY (%) →",
            "y_label": "ENG",
            "bars": [
                ("TWIN (-0.8%)", 0.80, (56, 189, 248)),
                ("TRI (-0.9%)", 0.90, (245, 158, 11)),
                ("QUAD (-1.0%)", 1.00, (225, 29, 72)),
                ("35FT OBST", 1.25, (16, 185, 129)),
            ],
            "bfl_pill": "NET FLIGHT PATH MUST CLEAR 35 FT",
        },
        "act45_quiz": {
            "headline_1": "35 FT OBSTACLE",
            "headline_2": "CLEARANCE CHECK?",
            "opt_a_val": "GROSS",
            "opt_a_sub": "RAW FLIGHT TEST",
            "opt_b_val": "NET PATH",
            "opt_b_sub": "MINUS PENALTY",
            "correct_opt": "B",
            "verdict_banner": "ALWAYS USE NET FLIGHT PATH",
            "rules": [
                ("1. TWIN -0.8% NET", "2.4% SEG 2 MIN"),
                ("2. TRI -0.9% NET", "2.7% SEG 2 MIN"),
                ("3. QUAD -1.0% NET", "3.0% SEG 2 MIN"),
            ],
        },
    },
    "PERF_CLASS_B": {
        "view": "PERF_CLASS_B",
        "subject_code": "032",
        "subject_name": "PERFORMANCE",
        "title": "Class B Multipliers & Power Loss",
        "outro_sub": "032 PERFORMANCE · MASTER EVERY EASA TOPIC",
        "transcript": (
            "Short grass runway departure in a light twin turboprop. "
            "Performance Class B airplanes fly much lighter than heavy Class A jets — but what happens if an engine quits right after liftoff? "
            "Regulations take handbook unfactored distance over a fifty-foot screen and multiply takeoff by one point two five. "
            "For landing over fifty feet, multiply unfactored distance by one point four three. "
            "Remember the pipeline: add grass, slope, and wind corrections before scaling final safety factors. "
            "Pilot call. EASA exam trap. "
            "A single-engine Class B airplane loses power right after liftoff: is engine-out climb guaranteed? "
            "Three... Two... One. "
            "Zero guarantee! Unlike Class A jets, you land straight ahead within glide reach. "
            "Save this rule: takeoff times one two five, landing times one four three, wet times one one five."
        ),
        "pronunciation_hints": "EASA as ee-ah-sah, OEI as O-E-I",
        "whisper_prompt": "Grass runway, Class B, fifty-foot screen, one point two five, one point four three, liftoff.",
        "anchors": {
            "eng_fail": ("lighter",),
            "fly_or_stop": ("engine", "quits"),
            "act1_end": ("liftoff",),
            "act2_start": ("regulations", "handbook"),
            "asda_reveal": ("takeoff",),
            "toda_reveal": ("landing",),
            "act2_end": ("three",),
            "act3_start": ("remember", "pipeline"),
            "asdr_draw": ("grass", "slope"),
            "todr_draw": ("scaling",),
            "v1_collide": ("safety", "factors"),
            "act3_end": ("factors",),
            "act4_start": ("pilot",),
            "quiz_go": ("guaranteed",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("zero", "guarantee"),
            "rule_1": ("two", "five"),
            "rule_2": ("four", "three"),
            "rule_3": ("wet",),
        },
        "seed_1": 32071,
        "act1_prompt": (
            "Photorealistic vertical shot of a sleek twin-engine turboprop light aircraft rolling "
            "down a dew-covered green grass countryside airstrip at golden morning sunlight with "
            "spinning propellers and white wingtips, cinematic tracking shot, 35mm film grain, "
            "no text, no logos"
        ),
        "seed_2": 32072,
        "act2_prompt": (
            "Minimalist stylized 3D matte pastel clay isometric miniature country airfield diorama "
            "on a warm peach studio base with a sage green grass strip, one small white clay "
            "wooden hangar, and a tiny propeller airplane clearing miniature trees, tilt-shift "
            "blur, soft shadows, no text"
        ),
        "act1_hud": {
            "label": "CLASS B // SCREEN",
            "start_val": 50,
            "end_val": 50,
            "unit": "FT",
            "warn_banner": "▲ LIGHT TWIN / SINGLE OPS",
            "question_pill": "OEI CLIMB GUARANTEED?",
        },
        "act2_pills": {
            "top_pill": "CLASS B DISPATCH MATH",
            "left_top": "TAKEOFF",
            "left_hero": "× 1.25",
            "left_sub": "50 FT SCREEN (+25%)",
            "right_top": "LANDING",
            "right_hero": "× 1.43",
            "right_sub": "FROM 50 FT (÷0.70)",
        },
        "act3_board": {
            "fcom_file": "PART_NCO_CLASS_B.DOC",
            "fcom_tag": "50 FT SCREEN LIMIT",
            "chart_file": "CLASS_B_FACTORS.PDF",
            "chart_type": "bars_compare",
            "x_label": "MULTIPLIER →",
            "y_label": "PHASE",
            "bars": [
                ("POH ROLL", 1.00, (100, 116, 139)),
                ("T/O FACTOR", 1.25, (245, 158, 11)),
                ("LDG FACTOR", 1.43, (16, 185, 129)),
                ("WET ×1.15", 1.64, (225, 29, 72)),
            ],
            "bfl_pill": "SURFACE PENALTY FIRST · FACTOR LAST",
        },
        "act45_quiz": {
            "headline_1": "CLASS B ENGINE LOSS",
            "headline_2": "RIGHT AFTER LIFTOFF?",
            "opt_a_val": "NO GUARANTEE",
            "opt_a_sub": "LAND STRAIGHT AHEAD",
            "opt_b_val": "2.4% CLIMB",
            "opt_b_sub": "GUARANTEED NET",
            "correct_opt": "A",
            "verdict_banner": "NO OEI CLIMB GUARANTEE!",
            "rules": [
                ("1. TAKEOFF × 1.25", "OVER 50 FT SCREEN"),
                ("2. LANDING × 1.43", "FROM 50 FT (÷0.70)"),
                ("3. WET × 1.15", "+15% SAFETY MARGIN"),
            ],
        },
    },
    "POF_HIGH_SPEED": {
        "view": "POF_HIGH_SPEED",
        "subject_code": "081",
        "subject_name": "PRINCIPLES OF FLIGHT",
        "title": "Coffin Corner & Mach Tuck",
        "outro_sub": "081 PRINCIPLES OF FLIGHT · MASTER EVERY TOPIC",
        "transcript": (
            "Flight level four-one-zero near the top of your ceiling. "
            "Thinner air pushes stall speed upward while freezing temperatures pull Mach limit down. Suddenly the nose pitches sharply downward on its own. "
            "Low-speed stall rises on your left while critical Mach closes in on your right. "
            "Where both boundaries squeeze together lies Coffin Corner. "
            "Push faster past critical Mach, and shockwaves form atop the wing — shifting center of pressure aft and tucking the nose down. "
            "Pilot call. EASA exam trap. "
            "Mach Tuck strikes at flight level four-one-zero: yank hard back on the yoke, or trim and descend? "
            "Three... Two... One. "
            "Trim and descend! Pulling violently risks an immediate shock stall. "
            "Save this rule: shock shifts CP aft, trust Mach Trim, descend smoothly to denser air."
        ),
        "pronunciation_hints": "EASA as ee-ah-sah, CP as C-P, FL410 as flight level four one zero",
        "whisper_prompt": "Coffin Corner, Mach Tuck, critical Mach, shockwave, center of pressure, Mach Trim.",
        "anchors": {
            "eng_fail": ("thinner", "stall"),
            "fly_or_stop": ("nose", "downward"),
            "act1_end": ("own",),
            "act2_start": ("low", "speed"),
            "asda_reveal": ("stall", "left"),
            "toda_reveal": ("mach", "right"),
            "act2_end": ("corner",),
            "act3_start": ("push", "faster"),
            "asdr_draw": ("shockwaves", "wing"),
            "todr_draw": ("shifting", "aft"),
            "v1_collide": ("tucking", "down"),
            "act3_end": ("down",),
            "act4_start": ("pilot",),
            "quiz_go": ("descend",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("trim",),
            "rule_1": ("shock",),
            "rule_2": ("trim",),
            "rule_3": ("denser",),
        },
        "seed_1": 81011,
        "act1_prompt": (
            "Photorealistic vertical shot looking down across an endless ocean of fluffy white "
            "cumulus clouds beneath a bright metallic airliner wing climbing steeply upward "
            "into deep cobalt stratosphere with sunlit cloud tops, gripping documentary style, "
            "35mm film grain, no text, no logos"
        ),
        "seed_2": 81012,
        "act2_prompt": (
            "Minimalist stylized 3D matte pastel clay isometric miniature high-altitude wing "
            "aerodynamics diorama on a cool slate-blue studio table showing a white clay swept "
            "wing airfoil over layered soft clouds with clean studio lighting and tilt-shift blur, "
            "no text, no numbers"
        ),
        "act1_hud": {
            "label": "MACH // FL410",
            "start_val": 0.78,
            "end_val": 0.85,
            "unit": "M",
            "decimals": 2,
            "warn_banner": "▲ SHOCKWAVE · MACH TUCK",
            "question_pill": "PULL HARD — OR TRIM & DESCEND?",
        },
        "act2_pills": {
            "top_pill": "FL410 · COFFIN CORNER",
            "left_top": "LOW SPEED",
            "left_hero": "VS ↑",
            "left_sub": "HIGH-ALT STALL",
            "right_top": "HIGH SPEED",
            "right_hero": "MMO ↓",
            "right_sub": "CRITICAL MACH LIMIT",
        },
        "act3_board": {
            "fcom_file": "POF_HIGHSPEED_081.DOC",
            "fcom_tag": "SHOCK -> CP SHIFTS AFT",
            "chart_file": "COFFIN_CORNER_FL410.PDF",
            "chart_type": "coffin_corner",
            "x_label": "AIRSPEED / MACH →",
            "y_label": "ALT",
            "curve1_label": "STALL (VS)",
            "curve2_label": "MACH (MMO)",
            "marker_label": "COFFIN CORNER",
            "bfl_pill": "VS MEETS MMO · SHOCK TUCKS NOSE DOWN",
        },
        "act45_quiz": {
            "headline_1": "MACH TUCK HITS",
            "headline_2": "AT FLIGHT LEVEL 410?",
            "opt_a_val": "PULL HARD",
            "opt_a_sub": "FORCE NOSE UP",
            "opt_b_val": "TRIM & DROP",
            "opt_b_sub": "IDLE & DESCEND",
            "correct_opt": "B",
            "verdict_banner": "USE MACH TRIM & DESCEND!",
            "rules": [
                ("1. SHOCK -> CP AFT", "NOSE PITCHES DOWN"),
                ("2. USE MACH TRIM", "NO VIOLENT PULL"),
                ("3. IDLE & DESCEND", "WARMER DENSE AIR"),
            ],
        },
    },
    "POF_STALL": {
        "view": "POF_STALL",
        "subject_code": "081",
        "subject_name": "PRINCIPLES OF FLIGHT",
        "title": "Critical AoA & Load Factor Stall",
        "outro_sub": "081 PRINCIPLES OF FLIGHT · MASTER EVERY TOPIC",
        "transcript": (
            "Two hundred knots slicing through a steep sixty-degree turn. "
            "Airspeed reads completely fast, yet the stick shaker erupts violently — an airplane can stall at any speed once one invisible angle breaks. "
            "Wing lift climbs steadily until reaching CL max around sixteen degrees critical angle. "
            "Pull two Gs in a steep sixty-degree bank, and stall speed multiplies by root two — jumping forty-one percent. "
            "Cross that fixed critical angle, and smooth boundary airflow bursts violently away from the upper wing. "
            "Pilot call. EASA exam trap. "
            "Stall warning triggers deep in a steep turn: full power first, or pitch nose down? "
            "Three... Two... One. "
            "Pitch down immediately! Unloading angle of attack restores lift instantly. "
            "Save this rule: pitch down first, roll wings level, then add smooth thrust."
        ),
        "pronunciation_hints": "AoA as angle of attack, CL as C-L, EASA as ee-ah-sah",
        "whisper_prompt": "Two hundred knots, stick shaker, CL max, sixteen degrees, sixty-degree turn, forty-one percent, pitch down.",
        "anchors": {
            "eng_fail": ("stick", "shaker"),
            "fly_or_stop": ("stall", "speed"),
            "act1_end": ("breaks",),
            "act2_start": ("wing", "lift"),
            "asda_reveal": ("sixteen", "angle"),
            "toda_reveal": ("forty", "percent"),
            "act2_end": ("percent",),
            "act3_start": ("cross", "fixed"),
            "asdr_draw": ("smooth",),
            "todr_draw": ("bursts", "away"),
            "v1_collide": ("upper", "wing"),
            "act3_end": ("wing",),
            "act4_start": ("pilot",),
            "quiz_go": ("down",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("pitch",),
            "rule_1": ("pitch",),
            "rule_2": ("level",),
            "rule_3": ("thrust",),
        },
        "seed_1": 81021,
        "act1_prompt": (
            "Photorealistic vertical aerial shot looking from behind a twin-engine training jet "
            "banked dramatically at sixty degrees over sunlit coast cliffs and clouds, sharp dynamic "
            "maneuver motion, 35mm film grain, no text, no logos"
        ),
        "seed_2": 81022,
        "act2_prompt": (
            "Minimalist stylized 3D matte pastel clay isometric miniature aerodynamic wind tunnel "
            "table in soft coral and sky blue clay showing a tilted white airfoil model with clean "
            "streamline clay ribbons above it, tilt-shift miniature depth of field, soft shadows, "
            "no text"
        ),
        "act1_hud": {
            "label": "BANK 60° // STALL",
            "start_val": 1.2,
            "end_val": 2.0,
            "unit": "G",
            "decimals": 1,
            "warn_banner": "▲ STICK SHAKER · HIGH-G STALL",
            "question_pill": "FULL POWER — OR PITCH DOWN?",
        },
        "act2_pills": {
            "top_pill": "CRITICAL AOA · CONSTANT (~16°)",
            "left_top": "LOAD FACTOR",
            "left_hero": "2.0 G",
            "left_sub": "60° LEVEL BANK",
            "right_top": "STALL SPD",
            "right_hero": "+41%",
            "right_sub": "VS × √n SCALE",
        },
        "act3_board": {
            "fcom_file": "POF_STALL_081.DOC",
            "fcom_tag": "FIXED CRIT AoA ~16°",
            "chart_file": "LIFT_CURVE_STALL.PDF",
            "chart_type": "lift_stall",
            "x_label": "ANGLE OF ATTACK (α) →",
            "y_label": "CL",
            "curve1_label": "CL CURVE",
            "curve2_label": "STALL DROP",
            "marker_label": "CL MAX (16°)",
            "bfl_pill": "STALL AT ANY AIRSPEED · REDUCE α FIRST",
        },
        "act45_quiz": {
            "headline_1": "STALL WARNING IN",
            "headline_2": "60° STEEP BANK?",
            "opt_a_val": "PITCH DOWN",
            "opt_a_sub": "UNLOAD THE WING",
            "opt_b_val": "FULL POWER",
            "opt_b_sub": "HOLD PITCH UP",
            "correct_opt": "A",
            "verdict_banner": "PITCH DOWN FIRST TO UNLOAD!",
            "rules": [
                ("1. PITCH DOWN FIRST", "REDUCE CRIT AoA"),
                ("2. LEVEL THE WINGS", "RETURN TO 1.0 G"),
                ("3. SMOOTH THRUST", "PREVENT SEC STALL"),
            ],
        },
    },
    "POF_DRAG": {
        "view": "POF_DRAG",
        "subject_code": "081",
        "subject_name": "PRINCIPLES OF FLIGHT",
        "title": "Total Drag Curve & VMD",
        "outro_sub": "081 PRINCIPLES OF FLIGHT · MASTER EVERY TOPIC",
        "transcript": (
            "Slowing below glide speed on final approach. "
            "Even though airspeed drops, total drag climbs sharply upward — sinking the airplane faster unless you act now. "
            "Every knot pays two opposing aerodynamic taxes. "
            "Induced drag rockets when flying slow from wingtip vortices, while parasite drag explodes proportionally with speed squared. "
            "Add both curves together to trace Total Drag. "
            "At the exact valley sits minimum drag speed VMD — where induced and parasite drag split fifty-fifty. "
            "Pilot call. EASA exam trap. "
            "Flying behind the drag curve and speed drops five knots: need less thrust, or more thrust? "
            "Three... Two... One. "
            "More thrust! Behind VMD, slowing down drives induced drag higher faster. "
            "Save this rule: VMD gives best glide, jet VX meets VMD, heavy weight shifts VMD right."
        ),
        "pronunciation_hints": "VMD as vee-M-D, VX as vee-X, EASA as ee-ah-sah",
        "whisper_prompt": "VMD, induced drag, parasite drag, Total Drag, best glide, behind the drag curve, fifty-fifty.",
        "anchors": {
            "eng_fail": ("drag", "climbs"),
            "fly_or_stop": ("act", "now"),
            "act1_end": ("now",),
            "act2_start": ("every",),
            "asda_reveal": ("induced",),
            "toda_reveal": ("parasite",),
            "act2_end": ("squared",),
            "act3_start": ("add", "curves"),
            "asdr_draw": ("total",),
            "todr_draw": ("valley",),
            "v1_collide": ("minimum", "vmd"),
            "act3_end": ("fifty", "fifty-fifty"),
            "act4_start": ("pilot",),
            "quiz_go": ("thrust",),
            "quiz_3": ("three", "3"),
            "quiz_2": ("two", "2"),
            "quiz_1": ("one", "1"),
            "verdict_stop": ("more", "thrust"),
            "rule_1": ("glide",),
            "rule_2": ("vmd", "vx"),
            "rule_3": ("heavy", "weight"),
        },
        "seed_1": 81031,
        "act1_prompt": (
            "Photorealistic vertical wingtip close-up of a commercial twinjet banking over ocean "
            "waters at sunset with glowing golden vortex condensation ribbons swirling smoothly "
            "from wingtip flaps, gripping documentary feel, 35mm film grain, no text, no logos"
        ),
        "seed_2": 81032,
        "act2_prompt": (
            "Minimalist stylized 3D matte pastel clay isometric miniature airport approach diorama "
            "on a warm peach terracotta studio table showing a tiny white jetliner descending cleanly "
            "above soft clouds with subtle wingtip vortex clay trails, tilt-shift blur, soft shadows, "
            "no text"
        ),
        "act1_hud": {
            "label": "IAS // BEHIND VMD",
            "start_val": 145,
            "end_val": 118,
            "unit": "KT",
            "warn_banner": "▲ SPEED INSTABILITY ZONE",
            "question_pill": "LESS THRUST — OR MORE THRUST?",
        },
        "act2_pills": {
            "top_pill": "TWO DRAG TAXES",
            "left_top": "SLOW FLIGHT",
            "left_hero": "1 / V²",
            "left_sub": "INDUCED · VORTICES",
            "right_top": "FAST FLIGHT",
            "right_hero": "× V²",
            "right_sub": "PARASITE · FRICTION",
        },
        "act3_board": {
            "fcom_file": "POF_DRAG_081.DOC",
            "fcom_tag": "TOTAL = Di + Dp",
            "chart_file": "TOTAL_DRAG_VMD.PDF",
            "chart_type": "drag_curve",
            "x_label": "AIRSPEED (IAS) →",
            "y_label": "DRAG",
            "curve1_label": "INDUCED (1/V²)",
            "curve2_label": "PARASITE (V²)",
            "marker_label": "VMD (50/50)",
            "bfl_pill": "MINIMUM DRAG VMD = MAXIMUM L / D",
        },
        "act45_quiz": {
            "headline_1": "BELOW VMD (-5 KT)",
            "headline_2": "BEHIND DRAG CURVE?",
            "opt_a_val": "LESS THRUST",
            "opt_a_sub": "SLOWER NEEDS LESS",
            "opt_b_val": "MORE THRUST",
            "opt_b_sub": "INDUCED SPIKES UP",
            "correct_opt": "B",
            "verdict_banner": "SLOWING BEHIND VMD NEEDS MORE!",
            "rules": [
                ("1. VMD = BEST GLIDE", "MAX L / D RATIO"),
                ("2. JET VX ≈ VMD", "MIN DRAG GRADIENT"),
                ("3. HEAVY -> HIGHER", "VMD SHIFTS RIGHT"),
            ],
        },
    },
}


def get_topic_spec(view: str) -> dict:
    key = view.strip().upper()
    if key not in TOPIC_SPECS:
        raise KeyError(f"Unknown Day 1 v3 topic {view!r}. Available: {', '.join(DAY1_ORDER)}")
    return TOPIC_SPECS[key]
