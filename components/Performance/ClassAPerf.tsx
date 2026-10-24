import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, Shield, AlertTriangle, CheckCircle2, Sliders,
  TrendingUp, Wind, Thermometer, Gauge, ArrowRight, HelpCircle,
  AlertOctagon, Compass, PlaneTakeoff, Info, Award
} from 'lucide-react';
import {
  AIRCRAFT_PRESETS,
  calculateAtmosphere,
  AtmosphericConditions,
  EngineCount,
  getCs25ClimbSegments,
  calculateNetObstacleClearance,
  validateVSpeedHierarchy
} from '../../lib/aviation/aircraftPerformance';

export const ClassAPerf: React.FC = () => {
  // Aircraft selection: Default to A320 or Citation Mustang
  const [selectedAircraftId, setSelectedAircraftId] = useState<'airbus_a320' | 'citation_mustang'>('airbus_a320');
  const aircraft = AIRCRAFT_PRESETS[selectedAircraftId];

  // Engine Count override (default 2 for twin, but allow testing 3-engine tri-jet or 4-engine quad-jet regulations)
  const [engineCount, setEngineCount] = useState<EngineCount>(2);

  // Flight parameters
  const [weightKg, setWeightKg] = useState<number>(72000); // 72 Tons
  const [elevationFt, setElevationFt] = useState<number>(300); // Cairo / Frankfurt
  const [qnhHpa, setQnhHpa] = useState<number>(1013);
  const [oatC, setOatC] = useState<number>(30); // Hot summer day
  const [runwayCondition, setRunwayCondition] = useState<'DRY' | 'WET'>('DRY');

  // Convert kg to lbs for engine math
  const weightLbs = weightKg * 2.20462;

  // Conditions
  const conditions: AtmosphericConditions = useMemo(() => ({
    elevationFt,
    qnhHpa,
    oatC,
    windKts: 0,
    runwaySlopePct: 0,
    surface: runwayCondition === 'WET' ? 'PAVED_WET' : 'PAVED_DRY'
  }), [elevationFt, qnhHpa, oatC, runwayCondition]);

  const atmo = useMemo(() => calculateAtmosphere(conditions), [conditions]);

  // V-Speed calculations (Class A rules)
  const baseV1 = selectedAircraftId === 'airbus_a320' ? 140 : 88;
  const baseVr = selectedAircraftId === 'airbus_a320' ? 144 : 91;
  const baseV2 = selectedAircraftId === 'airbus_a320' ? 148 : 97;
  const baseVmcg = selectedAircraftId === 'airbus_a320' ? 118 : 74;
  const baseVmca = selectedAircraftId === 'airbus_a320' ? 124 : 78;
  const baseVmbe = selectedAircraftId === 'airbus_a320' ? 165 : 110;
  const baseVsr = selectedAircraftId === 'airbus_a320' ? 122 : 82;
  const baseVsr0 = selectedAircraftId === 'airbus_a320' ? 112 : 72;
  const baseVref = selectedAircraftId === 'airbus_a320' ? 138 : 94;

  const wtFactor = Math.sqrt(weightLbs / aircraft.maxTakeoffWeightLbs);
  const v1Ias = Math.round(baseV1 * wtFactor * (runwayCondition === 'WET' ? 0.95 : 1.0));
  const vrIas = Math.round(baseVr * wtFactor);
  const v2Ias = Math.round(baseV2 * wtFactor);
  const vmcgIas = Math.round(baseVmcg);
  const vmcaIas = Math.round(baseVmca);
  const vmbeIas = Math.round(baseVmbe);
  const vsrIas = Math.round(baseVsr * wtFactor);
  const vsr0Ias = Math.round(baseVsr0 * wtFactor);
  const vrefIas = Math.round(baseVref * wtFactor);

  // V-Speed hierarchy verification
  const vSpeedCheck = useMemo(() => {
    return validateVSpeedHierarchy({
      vmcg: vmcgIas,
      v1: v1Ias,
      vr: vrIas,
      vmbe: vmbeIas,
      vmca: vmcaIas,
      v2: v2Ias,
      vsr: vsrIas,
      vref: vrefIas,
      vsr0: vsr0Ias
    });
  }, [vmcgIas, v1Ias, vrIas, vmbeIas, vmcaIas, v2Ias, vsrIas, vrefIas, vsr0Ias]);

  // CS-25 Climb Segments based on selected engine count
  const segments = useMemo(() => getCs25ClimbSegments(engineCount), [engineCount]);
  const netDeduction = engineCount === 2 ? 0.8 : engineCount === 3 ? 0.9 : 1.0;

  // Temperature and density penalties
  const tempPenalty = Math.max(0, oatC - 15) * 0.04;
  const daPenalty = (atmo.densityAltFt / 1000) * 0.12;

  // 2nd Segment (Critical) Achieved Gross & Net Gradients
  const seg2Base = engineCount === 2 ? 3.6 : engineCount === 3 ? 4.0 : 4.4;
  const seg2GrossGrad = Math.max(1.5, Number((seg2Base - tempPenalty - daPenalty).toFixed(2)));
  const seg2NetGrad = Number((seg2GrossGrad - netDeduction).toFixed(2));

  // 4th Segment Achieved Gross & Net Gradients
  const seg4Base = engineCount === 2 ? 2.1 : engineCount === 3 ? 2.4 : 2.7;
  const seg4GrossGrad = Math.max(0.8, Number((seg4Base - tempPenalty * 0.7 - daPenalty * 0.6).toFixed(2)));
  const seg4NetGrad = Number((seg4GrossGrad - netDeduction).toFixed(2));

  // Compliance checks for segments
  const seg1GrossReq = segments[0].minGrossGradientPct;
  const seg2GrossReq = segments[1].minGrossGradientPct;
  const seg4GrossReq = segments[3].minGrossGradientPct;

  const isSeg2Compliant = seg2GrossGrad >= seg2GrossReq;
  const isSeg4Compliant = seg4GrossGrad >= seg4GrossReq;

  // -------------------------------------------------------------
  // Croucher Chapter 9 Worked Example: Net Obstacle Clearance
  // -------------------------------------------------------------
  // Default scenario: Tower at 4,000m (13,123 ft), elevation 280 ft above screen height
  const [obstacleDistanceMeters, setObstacleDistanceMeters] = useState<number>(4000);
  const [obstacleElevationAboveScreenFt, setObstacleElevationAboveScreenFt] = useState<number>(280);
  const [simulatedGrossGradientPct, setSimulatedGrossGradientPct] = useState<number>(3.4);

  const obstacleDistanceFt = Math.round(obstacleDistanceMeters * 3.28084);
  const screenHeightFt = runwayCondition === 'WET' ? 15 : 35;

  const obstacleClearanceCalc = useMemo(() => {
    return calculateNetObstacleClearance({
      obstacleDistanceFt,
      obstacleElevationAboveDerFt: obstacleElevationAboveScreenFt,
      grossGradientPct: simulatedGrossGradientPct,
      engineCount,
      isWetRunway: runwayCondition === 'WET'
    });
  }, [obstacleDistanceFt, obstacleElevationAboveScreenFt, simulatedGrossGradientPct, engineCount, runwayCondition]);

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'segments' | 'obstacleCalc' | 'vSpeeds' | 'quiz'>('segments');

  // Student quiz
  const [selectedQuizQuestion, setSelectedQuizQuestion] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  const quizQuestions = [
    {
      id: 0,
      question: "In CS-25 certification for a twin-engine turbojet aeroplane, what is the regulatory minimum gross climb gradient requirement in the second takeoff segment with one engine inoperative, and what margin is deducted to determine the net flight path?",
      options: [
        { id: 1, text: "A) Gross min 2.4%, Margin deducted 0.8% (Net min 1.6%)", correct: true },
        { id: 2, text: "B) Gross min 2.7%, Margin deducted 0.9% (Net min 1.8%)", correct: false },
        { id: 3, text: "C) Gross min 3.0%, Margin deducted 1.0% (Net min 2.0%)", correct: false },
        { id: 4, text: "D) Gross min 1.2%, Margin deducted 0.5% (Net min 0.7%)", correct: false }
      ],
      explanation: "Under CS-25.121(b), a twin-jet must achieve at least 2.4% gross climb gradient in the second segment, and CS-25.115 specifies an 0.8% reduction for the net flight path. (3-engine: 2.7% gross, 0.9% net; 4-engine: 3.0% gross, 1.0% net)."
    },
    {
      id: 1,
      question: "What is the certified screen height at the end of the takeoff distance for a Class A aircraft on a dry runway versus a wet runway?",
      options: [
        { id: 1, text: "A) 50 ft dry, 35 ft wet", correct: false },
        { id: 2, text: "B) 35 ft dry, 15 ft wet", correct: true },
        { id: 3, text: "C) 35 ft dry, 35 ft wet", correct: false },
        { id: 4, text: "D) 50 ft dry, 50 ft wet", correct: false }
      ],
      explanation: "In CS-25 Class A certification, dry runway screen height is 35 ft. In wet runway operations, the screen height is legally reduced to 15 ft to accommodate a lower V1 decision speed without imposing payload penalties."
    },
    {
      id: 2,
      question: "What is the minimum required vertical clearance over an obstacle along the net takeoff flight path for a Class A transport jet?",
      options: [
        { id: 1, text: "A) 50 ft for all runway conditions", correct: false },
        { id: 2, text: "B) 35 ft using gross flight path", correct: false },
        { id: 3, text: "C) 35 ft (15 ft if wet) using the NET takeoff flight path", correct: true },
        { id: 4, text: "D) 100 ft vertically or 300 m horizontally", correct: false }
      ],
      explanation: "All obstacle clearance calculations MUST be made using the NET flight path (gross minus regulatory deduction). The net flight path must clear all obstacles by at least 35 ft vertically on dry runways (15 ft on wet runways)."
    },
    {
      id: 3,
      question: "Why is aborting a takeoff after passing V1 strictly prohibited, even in the event of an engine fire or catastrophic failure?",
      options: [
        { id: 1, text: "A) Kinetic energy varies with V^2, and remaining ASDA is insufficient, guaranteeing a high-speed overrun", correct: true },
        { id: 2, text: "B) The autopilot automatically engages and forces rotation", correct: false },
        { id: 3, text: "C) Thrust reversers are electrically inhibited above V1", correct: false },
        { id: 4, text: "D) Tire burst velocity is exceeded at V1", correct: false }
      ],
      explanation: "V1 is the 'Red Line of No Return'. Stopping distance required exceeds available ASDA past V1. Because kinetic energy is proportional to V^2 (Ek = 1/2 m V^2), aborting just 2 knots above V1 results in massive excess energy and severe runway excursion."
    }
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-rose-500/10 dark:bg-rose-500/20 p-4 rounded-2xl text-rose-500 border border-rose-500/30">
            <Layers size={36} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                EASA CS-25 & CAT.POL.A.200+
              </span>
              <span className="text-xs text-slate-500 font-mono">Croucher Ch 09: Flight Performance</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Class A Jet Performance Masterclass
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-1">
              The 4 Climb Segments, Net vs Gross Flight Paths, V-Speed Hierarchy, and Obstacle Clearance
            </p>
          </div>
        </div>

        {/* Aircraft & Engine Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => {
                setSelectedAircraftId('airbus_a320');
                setWeightKg(72000);
                setEngineCount(2);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedAircraftId === 'airbus_a320'
                  ? 'bg-rose-600 text-white font-black shadow'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Airbus A320-200
            </button>
            <button
              onClick={() => {
                setSelectedAircraftId('citation_mustang');
                setWeightKg(3900);
                setEngineCount(2);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedAircraftId === 'citation_mustang'
                  ? 'bg-rose-600 text-white font-black shadow'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Citation Mustang
            </button>
          </div>

          {/* Engine Count Filter */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <span className="text-[10px] font-bold uppercase text-slate-400 px-2">Engines:</span>
            {([2, 3, 4] as EngineCount[]).map(cnt => (
              <button
                key={cnt}
                onClick={() => setEngineCount(cnt)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  engineCount === cnt
                    ? 'bg-rose-500 text-white shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:text-white'
                }`}
              >
                {cnt}-Eng ({cnt === 2 ? '-0.8%' : cnt === 3 ? '-0.9%' : '-1.0%'})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Atmospheric & Operational Parameters Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl">
        <div>
          <label className="text-[10px] font-bold uppercase text-slate-500 block">Takeoff Weight</label>
          <div className="text-lg font-black font-mono text-slate-900 dark:text-white">
            {(weightKg / 1000).toFixed(1)} <span className="text-xs font-normal text-slate-400">tonnes</span>
          </div>
          <span className="text-[10px] text-slate-400">{Math.round(weightLbs).toLocaleString()} lbs</span>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-slate-500 block">Aerodrome Elev</label>
          <div className="text-lg font-black font-mono text-slate-900 dark:text-white">
            {elevationFt} <span className="text-xs font-normal text-slate-400">ft AMSL</span>
          </div>
          <span className="text-[10px] text-slate-400">PA: {Math.round(atmo.pressureAltFt)} ft</span>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-slate-500 block">Ambient Temp (OAT)</label>
          <div className="text-lg font-black font-mono text-slate-900 dark:text-white">
            {oatC}°C
          </div>
          <span className="text-[10px] font-bold text-amber-500">
            ΔISA: {atmo.deltaIsaC >= 0 ? `+${atmo.deltaIsaC.toFixed(1)}` : atmo.deltaIsaC.toFixed(1)}°C
          </span>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-slate-500 block">Density Alt (DA)</label>
          <div className="text-lg font-black font-mono text-slate-900 dark:text-white">
            {Math.round(atmo.densityAltFt).toLocaleString()} <span className="text-xs font-normal text-slate-400">ft</span>
          </div>
          <span className="text-[10px] text-slate-400">σ: {atmo.densityRatioSigma.toFixed(3)}</span>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-slate-500 block">Runway State</label>
          <div className="flex items-center gap-1 mt-1">
            <button
              onClick={() => setRunwayCondition('DRY')}
              className={`px-2 py-0.5 rounded text-xs font-bold ${
                runwayCondition === 'DRY'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
              }`}
            >
              DRY (35')
            </button>
            <button
              onClick={() => setRunwayCondition('WET')}
              className={`px-2 py-0.5 rounded text-xs font-bold ${
                runwayCondition === 'WET'
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
              }`}
            >
              WET (15')
            </button>
          </div>
          <span className="text-[10px] text-slate-400">Screen: {screenHeightFt} ft</span>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-slate-500 block">Regulatory Deduction</label>
          <div className="text-lg font-black font-mono text-rose-500">
            -{netDeduction.toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-400">CS-25.115 ({engineCount}-Eng)</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('segments')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'segments'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp size={16} /> The 4 Climb Segments
        </button>
        <button
          onClick={() => setActiveTab('obstacleCalc')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'obstacleCalc'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Compass size={16} /> Croucher Obstacle Clearance (Net vs Gross)
        </button>
        <button
          onClick={() => setActiveTab('vSpeeds')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'vSpeeds'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Gauge size={16} /> V-Speed Hierarchy & Mental Models
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'quiz'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <HelpCircle size={16} /> ATPL 032 Exam Challenge
        </button>
      </div>

      {/* TAB 1: THE 4 CLIMB SEGMENTS */}
      {activeTab === 'segments' && (
        <div className="space-y-8 animate-in fade-in">
          
          {/* Visual Flight Profile Canvas */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <PlaneTakeoff className="text-rose-400" size={20} />
                  Engine-Out Takeoff Flight Path (Gross vs Net Profile)
                </h3>
                <p className="text-xs text-slate-400">
                  CS-25.115 Takeoff Net Flight Path: Gross gradient minus {netDeduction}% for {engineCount}-engine aeroplanes.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-3 h-0.5 bg-rose-400 inline-block"></span> Gross Gradient
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-3 h-0.5 bg-emerald-400 inline-block"></span> Net Gradient (Legal Flight Path)
                </span>
              </div>
            </div>

            {/* Profile SVG */}
            <div className="w-full h-64 relative">
              <svg viewBox="0 0 1000 280" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="netFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Ground Line */}
                <line x1="0" y1="240" x2="1000" y2="240" stroke="#334155" strokeWidth="2" />
                <text x="30" y="260" fill="#64748b" fontSize="11" fontFamily="monospace">Runway DER</text>

                {/* Vertical Segment Division Markers */}
                <line x1="120" y1="20" x2="120" y2="240" stroke="#334155" strokeDasharray="3 3" />
                <line x1="380" y1="20" x2="380" y2="240" stroke="#334155" strokeDasharray="3 3" />
                <line x1="680" y1="20" x2="680" y2="240" stroke="#334155" strokeDasharray="3 3" />

                {/* Segment Labels */}
                <text x="60" y="30" fill="#f43f5e" fontSize="11" fontWeight="bold" textAnchor="middle">1st Segment</text>
                <text x="60" y="45" fill="#94a3b8" fontSize="9" textAnchor="middle">{screenHeightFt}' to Gear Up</text>

                <text x="250" y="30" fill="#f43f5e" fontSize="11" fontWeight="bold" textAnchor="middle">2nd Segment (CRITICAL)</text>
                <text x="250" y="45" fill="#94a3b8" fontSize="9" textAnchor="middle">Gear Up to min 400' AGL</text>

                <text x="530" y="30" fill="#f43f5e" fontSize="11" fontWeight="bold" textAnchor="middle">3rd Segment (Accel)</text>
                <text x="530" y="45" fill="#94a3b8" fontSize="9" textAnchor="middle">Level Flap Retraction</text>

                <text x="840" y="30" fill="#f43f5e" fontSize="11" fontWeight="bold" textAnchor="middle">4th Segment (Final)</text>
                <text x="840" y="45" fill="#94a3b8" fontSize="9" textAnchor="middle">Clean to 1,500' AGL (MCT)</text>

                {/* Net Path Polygon (Fill under Net path) */}
                <polygon
                  points={`0,240 20,230 120,220 380,140 680,140 1000,50 1000,240`}
                  fill="url(#netFill)"
                />

                {/* Gross Flight Path (Upper line) */}
                <polyline
                  points={`0,240 20,228 120,214 380,118 680,118 1000,20`}
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2.5"
                />

                {/* Net Flight Path (Lower line - Gross minus deduction) */}
                <polyline
                  points={`0,240 20,230 120,220 380,140 680,140 1000,50`}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                />

                {/* Screen Height Callout */}
                <circle cx="20" cy="230" r="4" fill="#38bdf8" />
                <text x="20" y="215" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Screen: {screenHeightFt} ft
                </text>

                {/* Acceleration Altitude 400 ft Callout */}
                <circle cx="380" cy="140" r="4" fill="#fbbf24" />
                <text x="380" y="160" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Min 400 ft AGL
                </text>

                {/* 1500 ft Final Altitude Callout */}
                <circle cx="1000" cy="50" r="4" fill="#10b981" />
                <text x="960" y="70" fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="end">
                  1,500 ft AGL
                </text>

                {/* Regulatory Margin Callout */}
                <path d="M 300,126 L 300,134" stroke="#e2e8f0" strokeWidth="1" />
                <text x="310" y="132" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
                  Δ {netDeduction}%
                </text>
              </svg>
            </div>
          </div>

          {/* 4 Segment Detail Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {segments.map(seg => {
              const isCritical = seg.segmentNumber === 2;
              const isAchievedOk =
                seg.segmentNumber === 1
                  ? true
                  : seg.segmentNumber === 2
                  ? isSeg2Compliant
                  : seg.segmentNumber === 3
                  ? true
                  : isSeg4Compliant;

              const achievedGross =
                seg.segmentNumber === 2
                  ? seg2GrossGrad
                  : seg.segmentNumber === 4
                  ? seg4GrossGrad
                  : null;

              const achievedNet =
                seg.segmentNumber === 2
                  ? seg2NetGrad
                  : seg.segmentNumber === 4
                  ? seg4NetGrad
                  : null;

              return (
                <div
                  key={seg.segmentNumber}
                  className={`p-5 rounded-2xl space-y-4 border transition-all ${
                    isCritical
                      ? 'bg-rose-500/5 border-rose-500/30 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-rose-500">
                      SEGMENT {seg.segmentNumber}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {seg.thrustSetting === 'TAKEOFF_OEI' ? 'Takeoff Thrust (OEI)' : 'MCT'}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{seg.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {seg.startBoundary} → {seg.endBoundary}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Gear:</span>
                      <strong className={seg.gearState === 'RETRACTING' ? 'text-amber-500' : 'text-emerald-500'}>
                        {seg.gearState}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Flaps:</span>
                      <strong className={seg.flapState === 'CLEAN' ? 'text-emerald-500' : 'text-amber-500'}>
                        {seg.flapState}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Speed:</span>
                      <strong className="font-mono text-white">{seg.targetSpeed}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">CS-25 Min Gross:</span>
                      <span className="font-mono font-bold text-rose-400">
                        {seg.minGrossGradientPct === 0.01 ? 'Positive (>0%)' : `${seg.minGrossGradientPct}%`}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Net Deduction:</span>
                      <span className="font-mono text-slate-400">-{seg.regulatoryDeductionPct}%</span>
                    </div>
                    {achievedGross !== null && (
                      <div className="flex justify-between text-xs pt-1 border-t border-dashed border-slate-700">
                        <span className="text-slate-400">Current Status:</span>
                        <span className={`font-mono font-bold ${isAchievedOk ? 'text-emerald-400' : 'text-red-400'}`}>
                          Gross {achievedGross}% | Net {achievedNet}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mental Model Callout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                <AlertTriangle size={18} />
                Mental Model: "Gross is Theoretical, Net is Survival"
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Gross Performance</strong> is what factory test pilots achieve with a brand-new aircraft and new engines under ideal conditions.
                <strong> Net Performance</strong> reflects reality: an aged engine, an exhausted flight crew in turbulence, and aerodynamic degradation.
                <strong> Regulatory obstacle clearance charts only accept the Net flight path!</strong>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-2">
              <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
                <Shield size={18} />
                Wet Runway Screen Height Rule (15 ft vs 35 ft)
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Under CS-25, wet runway operations permit reducing screen height from <strong>35 ft to 15 ft</strong>. This enables pilots to select a lower $V_1$ decision speed to avoid runway overruns on slick surfaces without forcing airlines to reduce passenger or cargo payload.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: CROUCHER WORKED EXAMPLE INTERACTIVE OBSTACLE CALCULATOR */}
      {activeTab === 'obstacleCalc' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 border border-blue-500/30 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Croucher ATPL Ch 09 Worked Example
                </span>
                <h3 className="text-2xl font-black text-white mt-2">
                  Net Obstacle Clearance Verifier (Class A)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Compute legal vertical clearance over distant obstacles using the {netDeduction}% regulatory net deduction.
                </p>
              </div>

              <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-mono font-bold text-sm ${
                obstacleClearanceCalc.isCompliant
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse'
              }`}>
                {obstacleClearanceCalc.isCompliant ? (
                  <>
                    <CheckCircle2 size={18} />
                    COMPLIANT (+{obstacleClearanceCalc.clearanceMarginSurplusFt} ft surplus)
                  </>
                ) : (
                  <>
                    <AlertTriangle size={18} />
                    BREACHED ({obstacleClearanceCalc.clearanceMarginSurplusFt} ft deficit)
                  </>
                )}
              </div>
            </div>

            {/* Interactive Sliders for Worked Example */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Obstacle Distance from TODA</span>
                  <span className="text-white font-mono">{obstacleDistanceMeters} m ({obstacleDistanceFt} ft)</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={8000}
                  step={100}
                  value={obstacleDistanceMeters}
                  onChange={(e) => setObstacleDistanceMeters(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <span className="text-[10px] text-slate-500">Croucher baseline: 4,000 meters (13,123 ft)</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Obstacle Height (above Screen)</span>
                  <span className="text-white font-mono">{obstacleElevationAboveScreenFt} ft</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={500}
                  step={5}
                  value={obstacleElevationAboveScreenFt}
                  onChange={(e) => setObstacleElevationAboveScreenFt(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <span className="text-[10px] text-slate-500">Croucher baseline: 280 ft tower</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">2nd Segment Gross Gradient</span>
                  <span className="text-rose-400 font-mono font-bold">{simulatedGrossGradientPct.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min={2.0}
                  max={5.0}
                  step={0.1}
                  value={simulatedGrossGradientPct}
                  onChange={(e) => setSimulatedGrossGradientPct(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
                <span className="text-[10px] text-slate-500">Croucher baseline: 3.4% Gross</span>
              </div>
            </div>

            {/* Formula Step-by-Step Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 block uppercase font-sans font-bold">Step 1: Net Gradient</span>
                <div className="text-lg font-bold text-white">
                  {obstacleClearanceCalc.netGradientPct}%
                </div>
                <div className="text-[11px] text-slate-400">
                  Gross ({simulatedGrossGradientPct}%) - Margin ({netDeduction}%)
                </div>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 block uppercase font-sans font-bold">Step 2: Altitude Gained (Δh)</span>
                <div className="text-lg font-bold text-white">
                  {obstacleClearanceCalc.altitudeGainedFt} ft
                </div>
                <div className="text-[11px] text-slate-400">
                  {obstacleDistanceFt} ft × {obstacleClearanceCalc.netGradientPct / 100}
                </div>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 block uppercase font-sans font-bold">Step 3: Aircraft Net Alt</span>
                <div className="text-lg font-bold text-white">
                  {obstacleClearanceCalc.aircraftNetAltitudeAboveDerFt} ft
                </div>
                <div className="text-[11px] text-slate-400">
                  {screenHeightFt} ft (Screen) + {obstacleClearanceCalc.altitudeGainedFt} ft
                </div>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 block uppercase font-sans font-bold">Step 4: Clearance Margin</span>
                <div className={`text-lg font-bold ${obstacleClearanceCalc.isCompliant ? 'text-emerald-400' : 'text-red-400'}`}>
                  {obstacleClearanceCalc.clearanceAboveObstacleFt} ft
                </div>
                <div className="text-[11px] text-slate-400">
                  Required: {obstacleClearanceCalc.requiredClearanceFt} ft ({runwayCondition.toLowerCase()})
                </div>
              </div>
            </div>

            {/* Visual Obstacle Geometry */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-3 flex items-center gap-2">
                <Info size={14} className="text-blue-400" /> Obstacle Profile Geometry Diagram
              </h4>
              <div className="w-full h-44 relative">
                <svg viewBox="0 0 800 180" className="w-full h-full" preserveAspectRatio="none">
                  {/* Ground */}
                  <line x1="0" y1="160" x2="800" y2="160" stroke="#475569" strokeWidth="2" />
                  
                  {/* Obstacle Tower */}
                  {/* Placed at x=620 */}
                  <rect x="615" y="60" width="10" height="100" fill="#ef4444" opacity="0.8" />
                  <circle cx="620" cy="60" r="4" fill="#ef4444" />
                  <text x="620" y="45" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Tower: {obstacleElevationAboveScreenFt} ft
                  </text>

                  {/* 35 ft Required Buffer line above tower */}
                  <line x1="590" y1="40" x2="650" y2="40" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" />
                  <text x="655" y="43" fill="#10b981" fontSize="9" fontFamily="monospace">
                    +35 ft min legal buffer
                  </text>

                  {/* Flight Paths */}
                  {/* Screen height start at x=40, y=145 */}
                  {/* Gross Path */}
                  <line x1="40" y1="145" x2="780" y2="10" stroke="#f43f5e" strokeWidth="2" />
                  <text x="780" y="10" fill="#f43f5e" fontSize="9" textAnchor="end">Gross Flight Path</text>

                  {/* Net Path */}
                  {(() => {
                    // Start at screen height y=145
                    // End height corresponds to aircraftNetAltitudeAboveDerFt
                    // Scale: 300 ft alt = 100 px dy
                    const netYAtObs = 145 - (obstacleClearanceCalc.aircraftNetAltitudeAboveDerFt / 380) * 110;
                    return (
                      <>
                        <line x1="40" y1="145" x2="750" y2={netYAtObs - 20} stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 2" />
                        <circle cx="620" cy={netYAtObs} r="5" fill="#10b981" />
                        <text x="620" y={netYAtObs - 10} fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="middle">
                          Net Alt: {obstacleClearanceCalc.aircraftNetAltitudeAboveDerFt} ft
                        </text>
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: V-SPEED HIERARCHY & MENTAL MODELS */}
      {activeTab === 'vSpeeds' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Certification Inequality Chain */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Gauge size={20} className="text-amber-500" />
                  V-Speed Certification Hierarchy (CS-25.107)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Rigorous speed bounding rules required for all Class A transport jets.
                </p>
              </div>
              <div className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                vSpeedCheck.allCompliant ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400'
              }`}>
                {vSpeedCheck.allCompliant ? 'ALL CERTIFICATION CRITERIA MET' : 'HIERARCHY VIOLATION'}
              </div>
            </div>

            {/* Visual Hierarchy Ladder */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 font-mono text-center">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 min-w-[100px]">
                <span className="text-[10px] text-slate-500 block uppercase font-sans">Ground Control</span>
                <span className="text-sm font-bold text-slate-400">VMCG</span>
                <div className="text-xl font-black text-white">{vmcgIas} kt</div>
              </div>

              <span className="text-rose-500 font-bold text-lg">≤</span>

              <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/30 min-w-[120px]">
                <span className="text-[10px] text-red-400 block uppercase font-sans font-bold">Decision Speed</span>
                <span className="text-sm font-bold text-red-400">V1</span>
                <div className="text-2xl font-black text-red-400">{v1Ias} kt</div>
              </div>

              <span className="text-rose-500 font-bold text-lg">≤</span>

              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 min-w-[120px]">
                <span className="text-[10px] text-amber-400 block uppercase font-sans font-bold">Rotation (≥1.05 VMCA)</span>
                <span className="text-sm font-bold text-amber-400">VR</span>
                <div className="text-2xl font-black text-amber-400">{vrIas} kt</div>
              </div>

              <span className="text-rose-500 font-bold text-lg">≤</span>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 min-w-[110px]">
                <span className="text-[10px] text-slate-500 block uppercase font-sans">Brake Energy Limit</span>
                <span className="text-sm font-bold text-slate-400">VMBE</span>
                <div className="text-xl font-black text-white">{vmbeIas} kt</div>
              </div>

              <span className="text-slate-600 font-bold text-lg">|</span>

              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30 min-w-[120px]">
                <span className="text-[10px] text-emerald-400 block uppercase font-sans font-bold">Safety (≥1.13 VSR)</span>
                <span className="text-sm font-bold text-emerald-400">V2</span>
                <div className="text-2xl font-black text-emerald-400">{v2Ias} kt</div>
              </div>

              <span className="text-slate-600 font-bold text-lg">|</span>

              <div className="p-3 bg-sky-500/10 rounded-xl border border-sky-500/30 min-w-[120px]">
                <span className="text-[10px] text-sky-400 block uppercase font-sans font-bold">Landing (≥1.23 VSR0)</span>
                <span className="text-sm font-bold text-sky-400">VREF</span>
                <div className="text-2xl font-black text-sky-400">{vrefIas} kt</div>
              </div>
            </div>
          </div>

          {/* Critical Operational Mental Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* V1 Red Line Card */}
            <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-3xl space-y-3">
              <div className="flex items-center gap-3 text-red-500 font-bold">
                <AlertOctagon size={24} />
                <h4 className="text-base font-bold">"V1 as the Red Line of No Return"</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Before $V_1$, the captain aborts the takeoff for engine failures, system warnings, or fire.
                <strong> After $V_1$, the aircraft MUST continue into the air even with catastrophic engine failure, cabin smoke, or master warning!</strong>
              </p>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-red-500/20 text-[11px] font-mono text-red-300">
                Anti-pattern: Aborting at V1 + 2 kt guarantees an excursion because kinetic energy varies with velocity squared (Ek ∝ V²). Stopping distance on the remaining runway is zero.
              </div>
            </div>

            {/* Premature Rotation Card */}
            <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-3xl space-y-3">
              <div className="flex items-center gap-3 text-amber-500 font-bold">
                <AlertTriangle size={24} />
                <h4 className="text-base font-bold">Pitch Rotation Anti-Patterns</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Pilot rotation rate must be maintained strictly at approximately <strong>3°/second</strong> beginning at $V_R$ to reach $V_2$ at the screen height.
              </p>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-amber-500/20 text-[11px] font-mono text-amber-300">
                - Under-rotation or rotating below VR increases ground run and risks tailstrike.<br/>
                - Rotating too rapidly (&gt;3°/sec) drastically increases induced drag and stalls the wings in ground effect!
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 4: ATPL 032 EXAM CHALLENGE */}
      {activeTab === 'quiz' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
                  <Award size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">ATPL Subject 032 Performance Knowledge Check</h3>
                  <p className="text-xs text-slate-400">Class A Transport Jet Certification & Regulations</p>
                </div>
              </div>

              {/* Question Navigator */}
              <div className="flex gap-1">
                {quizQuestions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setSelectedQuizQuestion(idx)}
                    className={`w-8 h-8 rounded-lg font-mono text-xs font-bold transition-all ${
                      selectedQuizQuestion === idx
                        ? 'bg-purple-600 text-white shadow'
                        : quizAnswers[idx] !== undefined
                        ? 'bg-slate-800 text-slate-300 border border-purple-500/40'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    Q{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Question Body */}
            {(() => {
              const currentQ = quizQuestions[selectedQuizQuestion];
              const selectedAns = quizAnswers[selectedQuizQuestion];

              return (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] font-mono font-bold uppercase text-purple-400 block mb-1">
                      Question {selectedQuizQuestion + 1} of {quizQuestions.length}
                    </span>
                    <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                      {currentQ.question}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {currentQ.options.map(opt => {
                      const isChosen = selectedAns === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setQuizAnswers({ ...quizAnswers, [selectedQuizQuestion]: opt.id });
                          }}
                          className={`p-4 rounded-xl text-left border transition-all ${
                            isChosen
                              ? opt.correct
                                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold'
                                : 'border-red-500 bg-red-500/10 text-red-300 font-bold'
                              : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {opt.text}
                        </button>
                      );
                    })}
                  </div>

                  {selectedAns !== undefined && (
                    <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                      currentQ.options.find(o => o.id === selectedAns)?.correct
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-red-500/10 border-red-500/30 text-red-300'
                    }`}>
                      <div className="flex items-start gap-2">
                        {currentQ.options.find(o => o.id === selectedAns)?.correct ? (
                          <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-400" />
                        ) : (
                          <AlertTriangle size={18} className="shrink-0 mt-0.5 text-red-400" />
                        )}
                        <div>
                          <strong>
                            {currentQ.options.find(o => o.id === selectedAns)?.correct ? 'Correct! ' : 'Incorrect. '}
                          </strong>
                          {currentQ.explanation}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

          </div>
        </div>
      )}

    </div>
  );
};

export default ClassAPerf;
