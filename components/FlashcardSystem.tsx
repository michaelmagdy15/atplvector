
import React, { useState, useEffect } from 'react';
import { Flashcard } from '../types';
import { SUBJECTS } from '../data/learningObjectives';
import { Plus, Trash2, Filter, RotateCcw, ChevronLeft, ChevronRight, Brain, GraduationCap, Shuffle } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Static System Cards (Cannot be deleted by user)
const SYSTEM_CARDS: Flashcard[] = [
    // === COMMUNICATIONS (090) ===
    { id: 'sys-1', subjectId: '090', front: 'Meaning of QDM?', back: 'Magnetic Heading TO the station (No wind correction).' },
    { id: 'sys-2', subjectId: '090', front: 'Squawk 7600 indicates?', back: 'Radio Communication Failure.' },
    { id: 'sys-3', subjectId: '090', front: 'Readability Scale 3 means?', back: 'Readable but with difficulty.' },
    { id: 'sys-4', subjectId: '090', front: 'Blind Transmission condition?', back: 'Made when receiver failure is suspected. Transmit blindly twice.' },
    { id: 'sys-5', subjectId: '090', front: 'Urgency Signal?', back: 'PAN-PAN, spoken three times.' },
    { id: 'sys-6', subjectId: '090', front: 'Distress Signal?', back: 'MAYDAY, spoken three times.' },
    { id: 'sys-7', subjectId: '090', front: 'VHF Frequency Range?', back: '118.000 - 136.975 MHz.' },
    { id: 'sys-8', subjectId: '090', front: 'Correct readback for "Climb FL 240"?', back: '"Climb Flight Level 240".' },
    { id: 'sys-9', subjectId: '090', front: 'Definition of "ROGER"?', back: '"I have received all of your last transmission". Does NOT mean Yes/Wilco.' },
    { id: 'sys-10', subjectId: '090', front: 'Meaning of QTE?', back: 'True Bearing FROM the station.' },
    { id: 'sys-11', subjectId: '090', front: 'Transponder Code for Hijack?', back: '7500.' },
    { id: 'sys-12', subjectId: '090', front: 'Correct format for Conditional Clearance?', back: 'Condition - Instruction - Condition (e.g., "Behind the landing A320, line up behind").' },
    { id: 'sys-13', subjectId: '090', front: 'Height of the Ionosphere D-Layer?', back: 'Approx 60km (lowest layer, absorbs HF during day).' },
    { id: 'sys-14', subjectId: '090', front: 'Frequency separation in VHF band?', back: '8.33 kHz or 25 kHz.' },
    { id: 'sys-15', subjectId: '090', front: 'Meaning of "WILCO"?', back: '"I understand your message and will comply with it".' },
    { id: 'sys-16', subjectId: '090', front: 'Maximum range of VHF?', back: 'Line of Sight (Formula: 1.23 * (√H1 + √H2)).' },
    { id: 'sys-17', subjectId: '090', front: 'Priority: Flight Safety Messages vs Met Messages?', back: 'Flight Safety Messages have priority over Meteorological Messages.' },
    { id: 'sys-18', subjectId: '090', front: 'Test transmission limit?', back: 'Should not exceed 10 seconds.' },
    { id: 'sys-19', subjectId: '090', front: 'Squelch function?', back: 'Eliminates background noise when no signal is being received.' },
    { id: 'sys-20', subjectId: '090', front: 'Action on "Readability 1"?', back: 'Unreadable. Try different frequency, check headset, or use backup radio.' },
    { id: 'sys-21', subjectId: '090', front: 'What does QNH mean?', back: 'Altimeter setting to read aerodrome elevation on ground.' },
    { id: 'sys-22', subjectId: '090', front: 'What does QFE mean?', back: 'Altimeter setting to read zero at aerodrome reference point.' },
    { id: 'sys-23', subjectId: '090', front: 'Meaning of "AFFIRM"?', back: 'Yes.' },
    { id: 'sys-24', subjectId: '090', front: 'Meaning of "NEGATIVE"?', back: 'No, or permission not granted, or that is not correct.' },
    { id: 'sys-25', subjectId: '090', front: 'SELCAL purpose?', back: 'Selective Calling - alerts crew when ATC needs to contact them on HF.' },

    // === AIR LAW (010) ===
    { id: 'sys-26', subjectId: '010', front: 'ICAO Annex 2 covers?', back: 'Rules of the Air.' },
    { id: 'sys-27', subjectId: '010', front: 'Chicago Convention year?', back: '1944.' },
    { id: 'sys-28', subjectId: '010', front: 'What is ICAO Annex 1?', back: 'Personnel Licensing.' },
    { id: 'sys-29', subjectId: '010', front: 'ICAO Annex 6 covers?', back: 'Operation of Aircraft.' },
    { id: 'sys-30', subjectId: '010', front: 'ICAO Annex 8 covers?', back: 'Airworthiness of Aircraft.' },
    { id: 'sys-31', subjectId: '010', front: 'Semi-circular cruising levels: Eastbound tracks (000-179)?', back: 'Odd Flight Levels (FL 250, 270, 290...)' },
    { id: 'sys-32', subjectId: '010', front: 'Semi-circular cruising levels: Westbound tracks (180-359)?', back: 'Even Flight Levels (FL 260, 280, 300...)' },
    { id: 'sys-33', subjectId: '010', front: 'VMC minima in Class B airspace?', back: 'Clear of cloud, 1500m visibility.' },
    { id: 'sys-34', subjectId: '010', front: 'What is a NOTAM?', back: 'Notice to Airmen - contains essential operational information.' },
    { id: 'sys-35', subjectId: '010', front: 'Transition Altitude?', back: 'Altitude at or below which aircraft vertical position is controlled by reference to altitude (QNH).' },
    { id: 'sys-36', subjectId: '010', front: 'Transition Level?', back: 'Lowest flight level available for use above transition altitude.' },
    { id: 'sys-37', subjectId: '010', front: 'Minimum vertical separation in RVSM airspace?', back: '1000 ft (FL290-FL410).' },
    { id: 'sys-38', subjectId: '010', front: 'What are freedoms of the air?', back: 'Rights negotiated between states for commercial aviation.' },
    { id: 'sys-39', subjectId: '010', front: 'First Freedom of the Air?', back: 'Right to fly over a foreign country without landing.' },
    { id: 'sys-40', subjectId: '010', front: 'Second Freedom of the Air?', back: 'Right to land in a foreign country for technical reasons (refueling, maintenance).' },
    { id: 'sys-41', subjectId: '010', front: 'Light signals: Steady Green to aircraft in flight?', back: 'Cleared to land.' },
    { id: 'sys-42', subjectId: '010', front: 'Light signals: Steady Red to aircraft in flight?', back: 'Give way to other aircraft and continue circling.' },
    { id: 'sys-43', subjectId: '010', front: 'Light signals: Red Flares/Pyrotechnics?', back: 'Do not land, wait for permission.' },
    { id: 'sys-44', subjectId: '010', front: 'What is JAR-OPS?', back: 'Joint Aviation Requirements for Commercial Air Transportation.' },

    // === METEOROLOGY (050) ===
    { id: 'sys-45', subjectId: '050', front: 'Standard Lapse Rate?', back: '1.98°C per 1000ft (approx 2°C).' },
    { id: 'sys-46', subjectId: '050', front: 'ISA temperature at sea level?', back: '15°C (288K).' },
    { id: 'sys-47', subjectId: '050', front: 'ISA pressure at sea level?', back: '1013.25 hPa (29.92 inHg).' },
    { id: 'sys-48', subjectId: '050', front: 'Tropopause height at mid-latitudes?', back: 'Approximately 36,000 ft (11 km).' },
    { id: 'sys-49', subjectId: '050', front: 'What causes wind?', back: 'Pressure gradient between areas of high and low pressure.' },
    { id: 'sys-50', subjectId: '050', front: 'Coriolis Effect?', back: 'Deflection of moving air due to Earth rotation (right in NH, left in SH).' },
    { id: 'sys-51', subjectId: '050', front: 'Geostrophic Wind?', back: 'Wind flowing parallel to isobars when pressure gradient and Coriolis forces balance.' },
    { id: 'sys-52', subjectId: '050', front: 'Buys Ballot Law?', back: 'Stand with back to wind: Low pressure is to your left (NH).' },
    { id: 'sys-53', subjectId: '050', front: 'What is a METAR?', back: 'Aviation Routine Weather Report.' },
    { id: 'sys-54', subjectId: '050', front: 'What is a TAF?', back: 'Terminal Aerodrome Forecast - weather forecast for specific airport.' },
    { id: 'sys-55', subjectId: '050', front: 'SIGMET contains?', back: 'Significant meteorological hazards (volcanic ash, TS, severe turbulence).' },
    { id: 'sys-56', subjectId: '050', front: 'CU cloud type?', back: 'Cumulus - fair weather, heap clouds.' },
    { id: 'sys-57', subjectId: '050', front: 'CB cloud type?', back: 'Cumulonimbus - thunderstorm clouds with vertical development.' },
    { id: 'sys-58', subjectId: '050', front: 'CI cloud type?', back: 'Cirrus - high-level ice crystal clouds.' },
    { id: 'sys-59', subjectId: '050', front: 'Dew Point definition?', back: 'Temperature at which air becomes saturated and condensation begins.' },
    { id: 'sys-60', subjectId: '050', front: 'Wind shear definition?', back: 'Sudden change in wind velocity and/or direction over a short distance.' },
    { id: 'sys-61', subjectId: '050', front: 'Fog visibility limit?', back: 'Visibility less than 1000m.' },
    { id: 'sys-62', subjectId: '050', front: 'Mist visibility range?', back: 'Visibility between 1000m and 5000m.' },
    { id: 'sys-63', subjectId: '050', front: 'Warm Front characteristics?', back: 'Gentle slope, stratiform clouds, continuous precipitation.' },
    { id: 'sys-64', subjectId: '050', front: 'Cold Front characteristics?', back: 'Steep slope, cumuliform clouds, showery precipitation.' },

    // === HUMAN PERFORMANCE (040) ===
    { id: 'sys-65', subjectId: '040', front: 'Time of Useful Consciousness at FL350?', back: '30-60 seconds.' },
    { id: 'sys-66', subjectId: '040', front: 'Symptoms of Hypoxia?', back: 'Euphoria, impaired judgment, cyanosis, tunnel vision.' },
    { id: 'sys-67', subjectId: '040', front: 'Hyperventilation cause?', back: 'Breathing too fast/deep - carbon dioxide depletion.' },
    { id: 'sys-68', subjectId: '040', front: 'What is the "Leans" illusion?', back: 'Vestibular illusion sensing level flight when actually banked.' },
    { id: 'sys-69', subjectId: '040', front: 'Somatogravic Illusion?', back: 'Rapid acceleration interpreted as pitch-up, leading to nose-down input.' },
    { id: 'sys-70', subjectId: '040', front: 'Circadian Rhythm period?', back: 'Approximately 24-25 hours.' },
    { id: 'sys-71', subjectId: '040', front: 'IMSAFE checklist?', back: 'Illness, Medication, Stress, Alcohol, Fatigue, Emotion.' },
    { id: 'sys-72', subjectId: '040', front: 'Minimum time between alcohol and flying?', back: '8 hours bottle to throttle (or more depending on quantity).' },
    { id: 'sys-73', subjectId: '040', front: 'Primary flight control and fatigue?', back: 'Fatigue significantly degrades decision-making before motor skills.' },
    { id: 'sys-74', subjectId: '040', front: 'What is Confirmation Bias?', back: 'Seeking information that confirms existing beliefs.' },
    { id: 'sys-75', subjectId: '040', front: 'Stages of information processing?', back: 'Sensory input → Perception → Decision → Response.' },
    { id: 'sys-76', subjectId: '040', front: 'Short-term memory capacity?', back: '7 ± 2 items (Miller\'s Law).' },
    { id: 'sys-77', subjectId: '040', front: 'Night vision adaptation time?', back: '30 minutes for full dark adaptation.' },
    { id: 'sys-78', subjectId: '040', front: 'Carbon Monoxide effect?', back: 'Binds to hemoglobin, reducing oxygen-carrying capacity.' },
    { id: 'sys-79', subjectId: '040', front: 'Type of stress affecting pilots?', back: 'Acute (short-term) and Chronic (long-term) stress.' },

    // === GENERAL NAVIGATION (061) ===
    { id: 'sys-80', subjectId: '061', front: 'Great Circle definition?', back: 'Circle on Earth surface whose center is the center of the Earth.' },
    { id: 'sys-81', subjectId: '061', front: 'Rhumb Line definition?', back: 'A line that crosses all meridians at the same angle.' },
    { id: 'sys-82', subjectId: '061', front: 'Nautical Mile definition?', back: 'One minute of latitude (approximately 1852m).' },
    { id: 'sys-83', subjectId: '061', front: 'Lambert Conformal Conic projection properties?', back: 'Conformal, Great Circle is nearly straight, used for en-route charts.' },
    { id: 'sys-84', subjectId: '061', front: 'Mercator projection properties?', back: 'Conformal, Rhumb Line is straight, distortion at high latitudes.' },
    { id: 'sys-85', subjectId: '061', front: 'Convergency formula?', back: 'Convergency = Change in Longitude × sin(Mean Latitude).' },
    { id: 'sys-86', subjectId: '061', front: 'Magnetic Variation?', back: 'Angle between True North and Magnetic North.' },
    { id: 'sys-87', subjectId: '061', front: 'Deviation?', back: 'Error caused by aircraft magnetic fields on compass.' },
    { id: 'sys-88', subjectId: '061', front: 'Isogonals?', back: 'Lines joining places of equal magnetic variation.' },
    { id: 'sys-89', subjectId: '061', front: 'Agonic Line?', back: 'Line of zero magnetic variation.' },
    { id: 'sys-90', subjectId: '061', front: '1:60 Rule?', back: '1 NM off track for every 60 NM traveled per 1° track error.' },
    { id: 'sys-91', subjectId: '061', front: 'Track Rule: Heading + Drift?', back: 'Track Made Good = Heading + Drift.' },
    { id: 'sys-92', subjectId: '061', front: 'Contour Line?', back: 'Line joining points of equal elevation.' },
    { id: 'sys-93', subjectId: '061', front: 'Earth circumference?', back: 'Approximately 21,600 NM (40,000 km).' },

    // === RADIO NAVIGATION (062) ===
    { id: 'sys-94', subjectId: '062', front: 'NDB stands for?', back: 'Non-Directional Beacon.' },
    { id: 'sys-95', subjectId: '062', front: 'VOR stands for?', back: 'VHF Omnidirectional Range.' },
    { id: 'sys-96', subjectId: '062', front: 'DME stands for?', back: 'Distance Measuring Equipment.' },
    { id: 'sys-97', subjectId: '062', front: 'ILS components?', back: 'Localizer (lateral), Glideslope (vertical), Markers/DME.' },
    { id: 'sys-98', subjectId: '062', front: 'ILS Category I minima?', back: 'DH 200ft, RVR 550m.' },
    { id: 'sys-99', subjectId: '062', front: 'ILS Category IIIA minima?', back: 'DH 50ft (or no DH), RVR 200m.' },
    { id: 'sys-100', subjectId: '062', front: 'VOR accuracy?', back: '±1° (designated operational coverage).' },
    { id: 'sys-101', subjectId: '062', front: 'DME slant range error?', back: 'Greater at close range and high altitude, negligible beyond 1 NM per 1000ft.' },
    { id: 'sys-102', subjectId: '062', front: 'GNSS stands for?', back: 'Global Navigation Satellite System.' },
    { id: 'sys-103', subjectId: '062', front: 'GPS minimum satellites for 3D fix?', back: '4 satellites.' },
    { id: 'sys-104', subjectId: '062', front: 'WAAS/SBAS purpose?', back: 'Space-Based Augmentation System - improves GPS accuracy and integrity.' },
    { id: 'sys-105', subjectId: '062', front: 'RAIM stands for?', back: 'Receiver Autonomous Integrity Monitoring.' },
    { id: 'sys-106', subjectId: '062', front: 'MLS stands for?', back: 'Microwave Landing System.' },
    { id: 'sys-107', subjectId: '062', front: 'Primary radar principle?', back: 'Detects aircraft from reflected radio energy.' },
    { id: 'sys-108', subjectId: '062', front: 'Secondary radar (SSR) principle?', back: 'Interrogates transponder for identification and altitude.' },

    // === PRINCIPLES OF FLIGHT (081) ===
    { id: 'sys-109', subjectId: '081', front: 'Four forces of flight?', back: 'Lift, Weight, Thrust, Drag.' },
    { id: 'sys-110', subjectId: '081', front: 'Lift formula factors?', back: 'Lift = ½ρV²SCL (density, velocity squared, wing area, lift coefficient).' },
    { id: 'sys-111', subjectId: '081', front: 'Induced Drag?', back: 'Drag caused by lift production, decreases with speed.' },
    { id: 'sys-112', subjectId: '081', front: 'Parasite Drag?', back: 'Drag independent of lift, increases with speed squared.' },
    { id: 'sys-113', subjectId: '081', front: 'Critical Angle of Attack?', back: 'Angle at which airflow separates from upper wing surface causing stall.' },
    { id: 'sys-114', subjectId: '081', front: 'Stall speed in a 60° bank?', back: '1.41 × VS (stall speed increases by √load factor).' },
    { id: 'sys-115', subjectId: '081', front: 'Load factor in 60° bank?', back: '2G.' },
    { id: 'sys-116', subjectId: '081', front: 'Aspect Ratio effect on performance?', back: 'High AR = less induced drag, better L/D ratio.' },
    { id: 'sys-117', subjectId: '081', front: 'Ground Effect causes?', back: 'Reduced induced drag and increased lift near ground.' },
    { id: 'sys-118', subjectId: '081', front: 'Adverse Yaw?', back: 'Yaw opposite to turn direction caused by differential drag on wings.' },
    { id: 'sys-119', subjectId: '081', front: 'Dutch Roll?', back: 'Coupled oscillation in yaw and roll, common in swept wing aircraft.' },
    { id: 'sys-120', subjectId: '081', front: 'Function of Winglets?', back: 'Reduce induced drag by weakening wingtip vortices.' },
    { id: 'sys-121', subjectId: '081', front: 'High-lift devices purpose?', back: 'Increase lift coefficient for lower takeoff/landing speeds.' },
    { id: 'sys-122', subjectId: '081', front: 'Spoilers primary function?', back: 'Increase drag and reduce lift (for speed brakes and roll control).' },
    { id: 'sys-123', subjectId: '081', front: 'Mach number definition?', back: 'Ratio of true airspeed to local speed of sound.' },

    // === AGK: AIRFRAME & SYSTEMS (021) ===
    { id: 'sys-124', subjectId: '021', front: 'Primary flight controls?', back: 'Ailerons (roll), Elevator (pitch), Rudder (yaw).' },
    { id: 'sys-125', subjectId: '021', front: 'Hydraulic system typical pressure?', back: '3000 PSI (large aircraft).' },
    { id: 'sys-126', subjectId: '021', front: 'Pressurization differential limit?', back: 'Maximum cabin-to-outside pressure difference (typically 8.6 PSI).' },
    { id: 'sys-127', subjectId: '021', front: 'Fuel system vent purpose?', back: 'Prevents negative pressure in fuel tanks during fuel consumption.' },
    { id: 'sys-128', subjectId: '021', front: 'Emergency exit lighting color?', back: 'Green for exit location, red for exit door handle.' },
    { id: 'sys-129', subjectId: '021', front: 'Tricycle landing gear advantage?', back: 'Better visibility on ground, stable during braking.' },
    { id: 'sys-130', subjectId: '021', front: 'Swept wing advantage?', back: 'Delays onset of transonic effects (compressibility drag).' },
    { id: 'sys-131', subjectId: '021', front: 'APU stands for?', back: 'Auxiliary Power Unit.' },
    { id: 'sys-132', subjectId: '021', front: 'Bleed air source?', back: 'Compressed air from engine compressor stages.' },

    // === AGK: ELECTRICS/ELECTRONICS (022) ===
    { id: 'sys-133', subjectId: '022', front: 'Typical aircraft DC voltage?', back: '28V DC.' },
    { id: 'sys-134', subjectId: '022', front: 'Typical aircraft AC voltage and frequency?', back: '115V AC at 400Hz.' },
    { id: 'sys-135', subjectId: '022', front: 'Inverter function?', back: 'Converts DC to AC.' },
    { id: 'sys-136', subjectId: '022', front: 'TRU (Transformer Rectifier Unit) function?', back: 'Converts AC to DC.' },
    { id: 'sys-137', subjectId: '022', front: 'Circuit breaker function?', back: 'Protects circuits from overcurrent; can be reset.' },
    { id: 'sys-138', subjectId: '022', front: 'Static discharger purpose?', back: 'Discharges static electricity to prevent radio interference.' },

    // === INSTRUMENTATION (031) ===
    { id: 'sys-139', subjectId: '031', front: 'Pitot tube measures?', back: 'Total (dynamic + static) pressure for airspeed.' },
    { id: 'sys-140', subjectId: '031', front: 'Static port measures?', back: 'Static (ambient) pressure for altimeter and VSI.' },
    { id: 'sys-141', subjectId: '031', front: 'Blocked pitot, open static - airspeed indication?', back: 'ASI drops to zero (no dynamic pressure sensed).' },
    { id: 'sys-142', subjectId: '031', front: 'Altimeter error in high temp?', back: 'True altitude is higher than indicated.' },
    { id: 'sys-143', subjectId: '031', front: 'Gyroscope rigidity in space?', back: 'Tendency of a spinning gyro to maintain its orientation.' },
    { id: 'sys-144', subjectId: '031', front: 'Gyroscope precession?', back: 'Force applied to spinning gyro acts 90° in rotation direction.' },
    { id: 'sys-145', subjectId: '031', front: 'Attitude Indicator power source?', back: 'Usually vacuum/pressure (traditional) or electric (modern).' },
    { id: 'sys-146', subjectId: '031', front: 'Turn coordinator measures?', back: 'Rate of roll and rate of turn.' },

    // === FLIGHT PLANNING (032) ===
    { id: 'sys-147', subjectId: '032', front: 'Fuel types: Jet A vs Avgas?', back: 'Jet A = kerosene (turbines), Avgas = gasoline (piston engines).' },
    { id: 'sys-148', subjectId: '032', front: 'ETOPS stands for?', back: 'Extended-range Twin-engine Operations.' },
    { id: 'sys-149', subjectId: '032', front: 'Fuel contingency requirement?', back: '5% of trip fuel for flights following fuel policy.' },
    { id: 'sys-150', subjectId: '032', front: 'Alternate fuel purpose?', back: 'Fuel required to fly from destination to alternate airport.' },
    { id: 'sys-151', subjectId: '032', front: 'Final Reserve Fuel (jets)?', back: '30 minutes holding at 1500ft above alternate.' },

    // === MASS & BALANCE (033) ===
    { id: 'sys-152', subjectId: '033', front: 'MAC stands for?', back: 'Mean Aerodynamic Chord.' },
    { id: 'sys-153', subjectId: '033', front: 'CG range limits?', back: 'Forward limit (stability) and Aft limit (controllability).' },
    { id: 'sys-154', subjectId: '033', front: 'Effect of forward CG?', back: 'Increased stability, higher stall speed, more elevator needed.' },
    { id: 'sys-155', subjectId: '033', front: 'Effect of aft CG?', back: 'Decreased stability, lower stall speed, reduced control authority.' },
    { id: 'sys-156', subjectId: '033', front: 'BEM stands for?', back: 'Basic Empty Mass (airframe + unusable fuel + oil).' },
    { id: 'sys-157', subjectId: '033', front: 'DOM stands for?', back: 'Dry Operating Mass (BEM + crew + catering + equipment).' },
    { id: 'sys-158', subjectId: '033', front: 'ZFM stands for?', back: 'Zero Fuel Mass (DOM + payload).' },
    { id: 'sys-159', subjectId: '033', front: 'TOM stands for?', back: 'Take-Off Mass (ZFM + fuel at takeoff).' },
    { id: 'sys-160', subjectId: '033', front: 'LM stands for?', back: 'Landing Mass (TOM - trip fuel).' },

    // === OPERATIONAL PROCEDURES (070) ===
    { id: 'sys-161', subjectId: '070', front: 'TCAS stands for?', back: 'Traffic Collision Avoidance System.' },
    { id: 'sys-162', subjectId: '070', front: 'TCAS TA vs RA?', back: 'TA = Traffic Advisory (awareness), RA = Resolution Advisory (action required).' },
    { id: 'sys-163', subjectId: '070', front: 'GPWS stands for?', back: 'Ground Proximity Warning System.' },
    { id: 'sys-164', subjectId: '070', front: 'EGPWS enhancement?', back: 'Enhanced GPWS - includes terrain database for predictive warnings.' },
    { id: 'sys-165', subjectId: '070', front: 'Cabin altitude warning?', back: 'Typically 10,000 ft (horn sounds if exceeded).' },
    { id: 'sys-166', subjectId: '070', front: 'Emergency descent procedure trigger?', back: 'Rapid decompression or smoke/fire in flight.' },
    { id: 'sys-167', subjectId: '070', front: 'Ditching definition?', back: 'Controlled emergency descent/landing on water.' },
    { id: 'sys-168', subjectId: '070', front: 'ELT stands for?', back: 'Emergency Locator Transmitter.' },
    { id: 'sys-169', subjectId: '070', front: 'ELT frequency?', back: '121.5 MHz and 406 MHz.' },
    { id: 'sys-170', subjectId: '070', front: 'Fire detection types?', back: 'Smoke, heat (rate-of-rise and overheat), flame detectors.' },
];

const FlashcardSystem: React.FC = () => {
    const [userCards, setUserCards] = useState<Flashcard[]>([]);

    const [mode, setMode] = useState<'manage' | 'practice'>('manage');
    const [filterSub, setFilterSub] = useState('ALL');

    // New Card State
    const [newFront, setNewFront] = useState('');
    const [newBack, setNewBack] = useState('');
    const [newSub, setNewSub] = useState('090');
    const [isSaving, setIsSaving] = useState(false);

    // Practice State
    const [practiceIndex, setPracticeIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    // Load User Cards
    useEffect(() => {
        fetchUserCards();
    }, []);

    const fetchUserCards = async () => {
        const { data: session } = await supabase.auth.getSession();
        if (session.session?.user) {
            const { data, error } = await supabase
                .from('flashcards')
                .select('*')
                .eq('user_id', session.session.user.id);

            if (data && !error) {
                const mapped: Flashcard[] = data.map((d: any) => ({
                    id: d.id,
                    subjectId: d.subject_id,
                    front: d.front,
                    back: d.back
                }));
                setUserCards(mapped);
            }
        }
    };

    const allCards = [...SYSTEM_CARDS, ...userCards];
    const activeDeck = filterSub === 'ALL' ? allCards : allCards.filter(c => c.subjectId === filterSub);

    const handleAdd = async () => {
        if (!newFront || !newBack) return;
        setIsSaving(true);

        try {
            const { data: userData } = await supabase.auth.getUser();
            const userId = userData.user?.id;

            if (userId) {
                // Persist to DB
                const { data, error } = await supabase.from('flashcards').insert({
                    user_id: userId,
                    subject_id: newSub,
                    front: newFront,
                    back: newBack
                }).select().single();

                if (data && !error) {
                    const newCard: Flashcard = {
                        id: data.id,
                        subjectId: data.subject_id,
                        front: data.front,
                        back: data.back
                    };
                    setUserCards([...userCards, newCard]);
                    setNewFront('');
                    setNewBack('');
                } else if (error) {
                    console.error("DB Error:", error);
                    alert("Failed to save card. " + (error.message || "Unknown error"));
                }
            } else {
                alert("You must be logged in to create cards.");
            }
        } catch (e: any) {
            console.error(e);
            alert("An error occurred: " + (e.message || "Unknown error"));
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        // Prevent deleting system cards
        if (id.startsWith('sys-')) return;

        const { error } = await supabase.from('flashcards').delete().eq('id', id);
        if (!error) {
            setUserCards(userCards.filter(c => c.id !== id));
        } else {
            alert("Failed to delete card: " + error.message);
        }
    };

    const startPractice = () => {
        if (activeDeck.length === 0) return;
        setPracticeIndex(0);
        setIsFlipped(false);
        setMode('practice');
    };

    // Shuffle only affects current view, not permanent order
    const [shuffledDeck, setShuffledDeck] = useState<Flashcard[]>([]);

    // When entering practice, use shuffled or ordered
    const getPlayDeck = () => shuffledDeck.length > 0 ? shuffledDeck : activeDeck;

    const handleShuffle = () => {
        setShuffledDeck([...activeDeck].sort(() => Math.random() - 0.5));
    };

    const nextCard = () => {
        const deck = getPlayDeck();
        setIsFlipped(false);
        setTimeout(() => {
            setPracticeIndex((prev) => (prev + 1) % deck.length);
        }, 150);
    };

    const prevCard = () => {
        const deck = getPlayDeck();
        setIsFlipped(false);
        setTimeout(() => {
            setPracticeIndex((prev) => (prev - 1 + deck.length) % deck.length);
        }, 150);
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-2">
                        <GraduationCap className="text-amber-400" /> Study Flashcards
                    </h1>
                    <p className="text-slate-400 mt-1">Create, organize and practice your knowledge.</p>
                </div>
                {mode === 'manage' && (
                    <div className="flex gap-2">
                        <button
                            onClick={handleShuffle}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors"
                        >
                            <Shuffle size={18} /> Shuffle
                        </button>
                        <button
                            onClick={startPractice}
                            disabled={activeDeck.length === 0}
                            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                        >
                            <Brain /> Practice Deck ({activeDeck.length})
                        </button>
                    </div>
                )}
                {mode === 'practice' && (
                    <button
                        onClick={() => { setMode('manage'); setShuffledDeck([]); }}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2"
                    >
                        Exit Practice
                    </button>
                )}
            </div>

            {mode === 'manage' && (
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Create & Filter Column */}
                    <div className="space-y-6">
                        {/* Filter */}
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Filter size={16} /> Filter Deck</h3>
                            <select
                                value={filterSub}
                                onChange={(e) => setFilterSub(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 text-white p-3 rounded-lg focus:border-indigo-500 outline-none"
                            >
                                <option value="ALL">All Subjects</option>
                                {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.id} {s.name}</option>)}
                            </select>
                        </div>

                        {/* Create New */}
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Plus size={16} /> Add New Card</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-slate-400 uppercase font-bold block mb-1">Subject</label>
                                    <select
                                        value={newSub}
                                        onChange={(e) => setNewSub(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-600 text-white p-2 rounded focus:border-indigo-500 outline-none text-sm"
                                    >
                                        {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.id} {s.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 uppercase font-bold block mb-1">Front (Question)</label>
                                    <textarea
                                        value={newFront}
                                        onChange={(e) => setNewFront(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-600 text-white p-2 rounded focus:border-indigo-500 outline-none text-sm h-20 resize-none"
                                        placeholder="e.g. VFR Minima Class G?"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 uppercase font-bold block mb-1">Back (Answer)</label>
                                    <textarea
                                        value={newBack}
                                        onChange={(e) => setNewBack(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-600 text-white p-2 rounded focus:border-indigo-500 outline-none text-sm h-20 resize-none"
                                        placeholder="e.g. 5km Vis..."
                                    />
                                </div>
                                <button
                                    onClick={handleAdd}
                                    disabled={isSaving}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white py-2 rounded-lg font-bold shadow-md flex justify-center items-center"
                                >
                                    {isSaving ? 'Saving...' : 'Add Card'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card List Column */}
                    <div className="lg:col-span-2">
                        <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 min-h-[500px]">
                            <h3 className="font-bold text-slate-400 uppercase text-xs mb-4">Your Cards ({activeDeck.length})</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activeDeck.length === 0 && (
                                    <div className="col-span-full text-center py-20 text-slate-500">No cards in this deck. Add one!</div>
                                )}
                                {activeDeck.map(card => (
                                    <div key={card.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col justify-between group hover:border-slate-500 transition-colors">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-1 rounded border border-slate-700">Subject {card.subjectId}</span>
                                                {/* Only show delete for non-system cards */}
                                                {!card.id.startsWith('sys-') && (
                                                    <button onClick={() => handleDelete(card.id)} className="text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                                )}
                                            </div>
                                            <p className="font-bold text-white mb-2 line-clamp-2">{card.front}</p>
                                            <p className="text-sm text-slate-400 line-clamp-3 border-t border-slate-700 pt-2">{card.back}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {mode === 'practice' && (
                <div className="flex flex-col items-center justify-center min-h-[600px] animate-in fade-in">
                    {/* Access correct deck (shuffled or raw) */}
                    {(() => {
                        const deck = getPlayDeck();
                        return (
                            <>
                                {/* Progress Bar */}
                                <div className="w-full max-w-2xl bg-slate-800 h-2 rounded-full mb-8 overflow-hidden">
                                    <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${((practiceIndex + 1) / deck.length) * 100}%` }}></div>
                                </div>

                                {/* The Card */}
                                <div className="relative w-full max-w-2xl h-80 perspective-1000 group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                                    <div className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>

                                        {/* Front */}
                                        <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center p-12 text-center border-b-8 border-indigo-600">
                                            <span className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Question</span>
                                            <span className="absolute top-4 right-4 text-xs font-bold text-indigo-100 bg-indigo-600 px-2 py-1 rounded">Subject {deck[practiceIndex].subjectId}</span>
                                            <h2 className="text-3xl font-black text-slate-800">{deck[practiceIndex].front}</h2>
                                            <p className="absolute bottom-4 text-slate-400 text-xs flex items-center gap-1"><RotateCcw size={12} /> Click to Flip</p>
                                        </div>

                                        {/* Back */}
                                        <div className="absolute w-full h-full backface-hidden bg-slate-900 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-12 text-center border-b-8 border-emerald-500 rotate-y-180">
                                            <span className="absolute top-4 left-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Answer</span>
                                            <p className="text-xl font-medium text-emerald-400 leading-relaxed">{deck[practiceIndex].back}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center gap-8 mt-12">
                                    <button onClick={prevCard} className="p-4 bg-slate-800 rounded-full hover:bg-slate-700 text-white transition-all hover:scale-110 border border-slate-600">
                                        <ChevronLeft size={24} />
                                    </button>
                                    <div className="text-slate-400 font-mono font-bold">
                                        {practiceIndex + 1} / {deck.length}
                                    </div>
                                    <button onClick={nextCard} className="p-4 bg-slate-800 rounded-full hover:bg-slate-700 text-white transition-all hover:scale-110 border border-slate-600">
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            </>
                        );
                    })()}
                </div>
            )}
        </div>
    );
};

export default FlashcardSystem;
