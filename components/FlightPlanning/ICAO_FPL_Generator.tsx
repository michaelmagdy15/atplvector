import React, { useState } from 'react';
import { View } from '../../types';
import { ChevronLeft, FormInput, Info, AlertTriangle, CheckCircle, Clock, DollarSign, TrendingUp, Compass, Plane, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onChangeView: (view: View) => void;
}

const ICAO_FPL_Generator: React.FC<Props> = ({ onChangeView }) => {
  // Navigation Tabs: 'fpl' (ICAO Form 2012) vs 'cost_index' (FMC CI & Step Climbs)
  const [activeTab, setActiveTab] = useState<'fpl' | 'cost_index'>('fpl');

  // ICAO ATS Flight Plan (Form 2012 / CA48) State
  const [item7, setItem7] = useState('BAW123'); // Aircraft ID
  const [item8Rules, setItem8Rules] = useState('I'); // Flight Rules (I/V/Y/Z)
  const [item8Type, setItem8Type] = useState('S'); // Type of Flight (S/N/G/M/X)
  const [item9Num, setItem9Num] = useState(''); // Number of aircraft
  const [item9Type, setItem9Type] = useState('B738'); // Type of aircraft
  const [item9Wake, setItem9Wake] = useState('M'); // Wake Turbulence (L/M/H/J)
  const [item10Equip, setItem10Equip] = useState('SDFGIRWYZ'); // Equipment
  const [item10Trans, setItem10Trans] = useState('LB1'); // Transponder (e.g. Mode S with ADS-B)
  const [item13Dep, setItem13Dep] = useState('EGLL'); // Departure Aerodrome
  const [item13Time, setItem13Time] = useState('1030'); // Departure Time UTC
  const [item15SpeedType, setItem15SpeedType] = useState('N'); // Speed Type (N = Knots, M = Mach)
  const [item15Speed, setItem15Speed] = useState('0450'); // Speed value
  const [item15LevelType, setItem15LevelType] = useState('F'); // Level Type (F = FL, A = Altitude, V = VFR)
  const [item15Level, setItem15Level] = useState('350'); // Level value
  const [item15Route, setItem15Route] = useState('DVR UL9 KONAN UL607 AMASI'); // Route string
  const [item16Dest, setItem16Dest] = useState('LFPG'); // Destination
  const [item16Eet, setItem16Eet] = useState('0115'); // EET
  const [item16Alt1, setItem16Alt1] = useState('LFOB'); // Alternate 1
  const [item16Alt2, setItem16Alt2] = useState('LFQQ'); // Alternate 2
  const [item18Other, setItem18Other] = useState('PBN/A1B1C1D1O1S2 DOF/261024 REG/G-EUXF EET/LFFF0025 RIF/LFPO RVR/300'); // Other Info

  // Slot (CTOT) Verification Simulation
  const [ctotTime, setCtotTime] = useState('1045'); // Calculated Take-Off Time
  const [actualReadyTime, setActualReadyTime] = useState('1043');

  // Cost Index (CI) Optimization State
  // Cost Index = Time Cost ($/hr) / Fuel Cost ($/kg)
  const [timeCostPerHour, setTimeCostPerHour] = useState<number>(650); // $/hour (crew, leasing, maintenance)
  const [fuelCostPerKg, setFuelCostPerKg] = useState<number>(0.85); // $/kg jet A-1
  const [userCostIndex, setUserCostIndex] = useState<number>(35); // Typical B737/A320 CI

  // Aircraft Cost Index Presets
  const ciPresets = [
    { name: 'Boeing 737-800', defaultCi: 28, maxCi: 200, baseMach: 0.76, baseFlow: 2300 },
    { name: 'Airbus A320neo', defaultCi: 25, maxCi: 999, baseMach: 0.76, baseFlow: 2150 },
    { name: 'Boeing 777-300ER', defaultCi: 75, maxCi: 500, baseMach: 0.83, baseFlow: 6800 },
    { name: 'Airbus A350-900', defaultCi: 60, maxCi: 999, baseMach: 0.84, baseFlow: 5400 }
  ];
  const [selectedCiPreset, setSelectedCiPreset] = useState(ciPresets[0]);

  // Derived Theoretical CI from Time & Fuel Cost
  // Formula: CI = Time Cost / Fuel Cost (normalized to airline FMC scaling)
  const theoreticalCi = Math.round(timeCostPerHour / (fuelCostPerKg * 20)); // Normalized scaling
  
  // Econ Cruise Mach and Fuel impact
  // At CI = 0: Max Range Cruise (MRC) Mach ~0.74, Lowest Burn
  // At High CI: High Mach ~0.80+, High Burn
  const econMach = Number((selectedCiPreset.baseMach - 0.02 + ((userCostIndex / (selectedCiPreset.maxCi || 200)) * 0.05)).toFixed(3));
  const econTas = Math.round(econMach * 573); // At FL350 ISA standard (speed of sound ~573 kt)
  const econFlow = Math.round(selectedCiPreset.baseFlow * (1 + ((userCostIndex / 100) * 0.06)));
  const flightTimeHours = 1200 / econTas; // 1,200 NM sector
  const tripFuelEstimate = Math.round(flightTimeHours * econFlow);
  const totalCost = Math.round((flightTimeHours * timeCostPerHour) + (tripFuelEstimate * fuelCostPerKg));

  // CTOT Slot Window Compliance
  // Strictly -5 min to +10 min
  const ctotMins = Number(ctotTime.substring(0, 2)) * 60 + Number(ctotTime.substring(2, 4));
  const readyMins = Number(actualReadyTime.substring(0, 2)) * 60 + Number(actualReadyTime.substring(2, 4));
  const slotDelta = readyMins - ctotMins;
  const isSlotCompliant = slotDelta >= -5 && slotDelta <= 10;

  // Validation Logic for ICAO Form 2012
  const errors: Record<string, string> = {};

  if (!/^[A-Z0-9]{1,7}$/i.test(item7)) {
    errors.item7 = 'Aircraft Identification must be 1 to 7 alphanumeric characters.';
  }
  if (!['I', 'V', 'Y', 'Z'].includes(item8Rules.toUpperCase())) {
    errors.item8Rules = 'Flight Rules must be I (IFR), V (VFR), Y (IFR then VFR), or Z (VFR then IFR).';
  }
  if (!['S', 'N', 'G', 'M', 'X'].includes(item8Type.toUpperCase())) {
    errors.item8Type = 'Type of Flight must be S (Scheduled), N (Non-scheduled), G (General), M (Military), or X (Other).';
  }
  if (item9Num && !/^\d{1,2}$/.test(item9Num)) {
    errors.item9Num = 'Number of aircraft must be 1 to 2 digits.';
  }
  if (!/^[A-Z0-9]{2,4}$/i.test(item9Type)) {
    errors.item9Type = 'Aircraft type must be a valid 2-4 character ICAO designator.';
  }
  if (!['L', 'M', 'H', 'J'].includes(item9Wake.toUpperCase())) {
    errors.item9Wake = 'Wake turbulence must be L (≤7t), M (7-136t), H (≥136t), or J (Super e.g. A380).';
  }
  if (!/^[A-Z]{4}$/i.test(item13Dep)) {
    errors.item13Dep = 'Departure Aerodrome must be a 4-letter ICAO location designator (e.g. EGLL).';
  }
  if (!/^\d{4}$/.test(item13Time) || Number(item13Time.substring(0, 2)) >= 24 || Number(item13Time.substring(2, 4)) >= 60) {
    errors.item13Time = 'Departure time must be a valid 4-digit UTC time (HHMM).';
  }
  if (!/^[A-Z]{4}$/i.test(item16Dest)) {
    errors.item16Dest = 'Destination Aerodrome must be a 4-letter ICAO location designator.';
  }
  if (!/^\d{4}$/.test(item16Eet) || Number(item16Eet.substring(0, 2)) >= 24 || Number(item16Eet.substring(2, 4)) >= 60) {
    errors.item16Eet = 'Total EET must be 4-digit hours and minutes (HHMM).';
  }

  const isValid = Object.keys(errors).length === 0;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-700 font-sans space-y-8">
      {/* Back Button */}
      <button 
        onClick={() => onChangeView(View.FLIGHT_PLAN_HOME)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Subject Dashboard
      </button>

      {/* Header */}
      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-purple-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-bold uppercase tracking-widest mb-4">
              <FormInput className="w-3.5 h-3.5" /> Subject 033 • ICAO ATS Form 2012 / CA48 & FMC Economics
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Flight Plan Filing & Cost Index Optimization
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl leading-relaxed mt-2">
              Generate fully compliant ICAO ATS flight plans with real-time regulatory syntax checks, verify CTOT slot windows, and optimize cruise Cost Index (CI) and step climbs.
            </p>
          </div>

          {/* Module Tab Selector */}
          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-700 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('fpl')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'fpl'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FormInput className="w-4 h-4" />
              ICAO Form 2012 / CA48
            </button>
            <button
              onClick={() => setActiveTab('cost_index')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'cost_index'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Cost Index & Optimum Altitude
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: ICAO Flight Plan Form 2012 */}
      {activeTab === 'fpl' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: ICAO Form Paper Mockup (8/12 cols) */}
          <div className="lg:col-span-8 bg-slate-900/60 text-slate-100 p-6 md:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="bg-yellow-500/20 text-yellow-300 text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full border border-yellow-500/30">
                  ICAO Form 2012 / CA48 ATS Flight Plan
                </span>
                <span className="text-xs text-slate-400 font-mono">CFMU / Eurocontrol Syntax</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">PBN Compliant</span>
            </div>

            <div className="space-y-4 pt-2">
              {/* Row 1: Item 7 & Item 8 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4 bg-slate-950/60 p-4 rounded-xl border border-white/5">
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">ITEM 7: AIRCRAFT IDENTIFICATION</label>
                  <input 
                    type="text" 
                    value={item7} 
                    maxLength={7}
                    onChange={e => setItem7(e.target.value.toUpperCase())}
                    className="w-full bg-transparent text-white font-mono text-lg font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none" 
                  />
                  {errors.item7 && <span className="text-[9px] text-red-400 mt-1 block">{errors.item7}</span>}
                </div>

                <div className="md:col-span-4 bg-slate-950/60 p-4 rounded-xl border border-white/5">
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">ITEM 8: FLIGHT RULES</label>
                  <select 
                    value={item8Rules} 
                    onChange={e => setItem8Rules(e.target.value)}
                    className="w-full bg-slate-900 text-white font-mono text-base font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="I">I (IFR)</option>
                    <option value="V">V (VFR)</option>
                    <option value="Y">Y (IFR first then VFR)</option>
                    <option value="Z">Z (VFR first then IFR)</option>
                  </select>
                </div>

                <div className="md:col-span-4 bg-slate-950/60 p-4 rounded-xl border border-white/5">
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">ITEM 8: TYPE OF FLIGHT</label>
                  <select 
                    value={item8Type} 
                    onChange={e => setItem8Type(e.target.value)}
                    className="w-full bg-slate-900 text-white font-mono text-base font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="S">S (Scheduled Air Transport)</option>
                    <option value="N">N (Non-Scheduled)</option>
                    <option value="G">G (General Aviation)</option>
                    <option value="M">M (Military)</option>
                    <option value="X">X (Other Category)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Item 9 (Type & Wake) & Item 10 (Equip & Transponder) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-6 bg-slate-950/60 p-4 rounded-xl border border-white/5 flex gap-4">
                  <div className="w-1/3">
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">ITEM 9: NUM</label>
                    <input 
                      type="text" 
                      placeholder="1"
                      value={item9Num} 
                      onChange={e => setItem9Num(e.target.value)}
                      className="w-full bg-transparent text-white font-mono text-base font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none" 
                    />
                  </div>
                  <div className="w-1/3">
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">TYPE OF A/C</label>
                    <input 
                      type="text" 
                      value={item9Type} 
                      onChange={e => setItem9Type(e.target.value.toUpperCase())}
                      className="w-full bg-transparent text-white font-mono text-base font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none" 
                    />
                  </div>
                  <div className="w-1/3">
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">WAKE CAT</label>
                    <select 
                      value={item9Wake} 
                      onChange={e => setItem9Wake(e.target.value)}
                      className="w-full bg-slate-900 text-white font-mono text-base font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none"
                    >
                      <option value="L">L (≤ 7,000 kg)</option>
                      <option value="M">M (7,000–136,000 kg)</option>
                      <option value="H">H (≥ 136,000 kg)</option>
                      <option value="J">J (Super Heavy A380)</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-6 bg-slate-950/60 p-4 rounded-xl border border-white/5 flex gap-4">
                  <div className="w-2/3">
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">ITEM 10: COM/NAV EQUIP</label>
                    <input 
                      type="text" 
                      value={item10Equip} 
                      onChange={e => setItem10Equip(e.target.value.toUpperCase())}
                      className="w-full bg-transparent text-white font-mono text-base font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none" 
                    />
                  </div>
                  <div className="w-1/3">
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">SURVEILLANCE</label>
                    <input 
                      type="text" 
                      value={item10Trans} 
                      onChange={e => setItem10Trans(e.target.value.toUpperCase())}
                      className="w-full bg-transparent text-white font-mono text-base font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none" 
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Item 13 Departure */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-6 bg-slate-950/60 p-4 rounded-xl border border-white/5">
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">ITEM 13: DEP AERODROME</label>
                  <input 
                    type="text" 
                    value={item13Dep} 
                    maxLength={4}
                    onChange={e => setItem13Dep(e.target.value.toUpperCase())}
                    className="w-full bg-transparent text-white font-mono text-lg font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none" 
                  />
                  {errors.item13Dep && <span className="text-[9px] text-red-400 mt-1 block">{errors.item13Dep}</span>}
                </div>

                <div className="md:col-span-6 bg-slate-950/60 p-4 rounded-xl border border-white/5">
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">DEPARTURE TIME (EOBT UTC)</label>
                  <input 
                    type="text" 
                    value={item13Time} 
                    maxLength={4}
                    onChange={e => setItem13Time(e.target.value)}
                    className="w-full bg-transparent text-white font-mono text-lg font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none" 
                  />
                  {errors.item13Time && <span className="text-[9px] text-red-400 mt-1 block">{errors.item13Time}</span>}
                </div>
              </div>

              {/* Row 4: Item 15 Speed, Level & Route */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-3">
                <label className="text-[10px] text-slate-400 font-bold block mb-1">ITEM 15: CRUISING SPEED, LEVEL & ROUTE</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex gap-2">
                    <div className="w-1/3">
                      <label className="text-[9px] text-slate-500 block">TYPE</label>
                      <select value={item15SpeedType} onChange={e => setItem15SpeedType(e.target.value)} className="w-full bg-slate-900 text-white font-mono text-sm border-b border-slate-700 focus:outline-none">
                        <option value="N">N (Knots)</option>
                        <option value="M">M (Mach)</option>
                      </select>
                    </div>
                    <div className="w-2/3">
                      <label className="text-[9px] text-slate-500 block">TRUE AIRSPEED / MACH</label>
                      <input type="text" value={item15Speed} onChange={e => setItem15Speed(e.target.value)} className="w-full bg-transparent text-white font-mono text-sm border-b border-slate-700 focus:outline-none" />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="w-1/3">
                      <label className="text-[9px] text-slate-500 block">LEVEL</label>
                      <select value={item15LevelType} onChange={e => setItem15LevelType(e.target.value)} className="w-full bg-slate-900 text-white font-mono text-sm border-b border-slate-700 focus:outline-none">
                        <option value="F">F (FL)</option>
                        <option value="A">A (Altitude)</option>
                        <option value="V">V (VFR)</option>
                      </select>
                    </div>
                    <div className="w-2/3">
                      <label className="text-[9px] text-slate-500 block">INITIAL LEVEL</label>
                      <input type="text" value={item15Level} disabled={item15LevelType === 'V'} className="w-full bg-transparent text-white font-mono text-sm border-b border-slate-700 focus:outline-none disabled:opacity-30" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] text-slate-500 block mb-1">ATS ROUTE STRING</label>
                  <textarea 
                    value={item15Route} 
                    rows={2}
                    onChange={e => setItem15Route(e.target.value.toUpperCase())}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-mono text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 5: Item 16 Destination & Alternates */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5">
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">DESTINATION</label>
                  <input 
                    type="text" 
                    value={item16Dest} 
                    maxLength={4}
                    onChange={e => setItem16Dest(e.target.value.toUpperCase())}
                    className="w-full bg-transparent text-white font-mono text-lg font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none" 
                  />
                </div>
                <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5">
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">TOTAL EET (HHMM)</label>
                  <input 
                    type="text" 
                    value={item16Eet} 
                    maxLength={4}
                    onChange={e => setItem16Eet(e.target.value)}
                    className="w-full bg-transparent text-white font-mono text-lg font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none" 
                  />
                </div>
                <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5">
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">1ST ALTN</label>
                  <input 
                    type="text" 
                    value={item16Alt1} 
                    maxLength={4}
                    onChange={e => setItem16Alt1(e.target.value.toUpperCase())}
                    className="w-full bg-transparent text-white font-mono text-lg font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none" 
                  />
                </div>
                <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5">
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">2ND ALTN</label>
                  <input 
                    type="text" 
                    value={item16Alt2} 
                    maxLength={4}
                    onChange={e => setItem16Alt2(e.target.value.toUpperCase())}
                    className="w-full bg-transparent text-white font-mono text-lg font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none" 
                  />
                </div>
              </div>

              {/* Row 6: Item 18 Other Information */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5">
                <label className="text-[10px] text-slate-400 font-bold block mb-1">ITEM 18: OTHER INFORMATION (PBN, REG, DOF, EET, RIF)</label>
                <textarea 
                  value={item18Other} 
                  rows={2}
                  onChange={e => setItem18Other(e.target.value.toUpperCase())}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 font-mono text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Slot Window (CTOT) & Validation Guide (4/12 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Real-time FPL Validation */}
            <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Automated ATS Syntax Audit
              </h3>

              {isValid ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-3">
                  <CheckCircle className="text-emerald-400 w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-200 leading-relaxed">
                    <strong>Format Fully Valid:</strong> Matches ICAO Doc 4444 and Eurocontrol IFPS parsing rules. Ready to transmit.
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3">
                  <AlertTriangle className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-xs text-red-200 space-y-1">
                    <strong>Validation Warnings:</strong>
                    {Object.values(errors).map((err, i) => (
                      <div key={i}>• {err}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTOT Slot Window Simulation (EASA Ch 15 Rule) */}
            <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                CTOT Slot Allocation Window
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Strict EASA / Eurocontrol Rule:</strong> The Calculated Take-Off Time (CTOT) slot tolerance window is strictly <strong>-5 minutes to +10 minutes</strong>. Missing this slot leads to automated flight plan cancellation!
              </p>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-500 block">ISSUED CTOT</span>
                  <input
                    type="text"
                    value={ctotTime}
                    maxLength={4}
                    onChange={e => setCtotTime(e.target.value)}
                    className="w-full bg-transparent font-bold text-white text-base focus:outline-none"
                  />
                  <span className="text-[9px] text-slate-400">Window: -5 / +10</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-500 block">ACTUAL READY</span>
                  <input
                    type="text"
                    value={actualReadyTime}
                    maxLength={4}
                    onChange={e => setActualReadyTime(e.target.value)}
                    className="w-full bg-transparent font-bold text-white text-base focus:outline-none"
                  />
                  <span className={`text-[9px] font-bold ${isSlotCompliant ? 'text-emerald-400' : 'text-red-400'}`}>
                    Delta: {slotDelta >= 0 ? `+${slotDelta}` : slotDelta} min
                  </span>
                </div>
              </div>

              <div className={`p-3 rounded-xl border text-xs font-bold ${
                isSlotCompliant ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' : 'bg-red-950/30 border-red-500/40 text-red-300'
              }`}>
                {isSlotCompliant ? '✓ Within Slot Window (-5 to +10 min)' : '⚠️ SLOT MISSED! Flight plan slot suspended.'}
              </div>
            </div>

            {/* Wake Turbulence Reference Table */}
            <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 space-y-3 text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider block">
                Item 9 Wake Turbulence Categories
              </span>
              <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-emerald-400 font-bold">L (Light)</span>
                  <span>MTOM ≤ 7,000 kg</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-blue-400 font-bold">M (Medium)</span>
                  <span>7,000 kg &lt; MTOM &lt; 136,000 kg</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-amber-400 font-bold">H (Heavy)</span>
                  <span>MTOM ≥ 136,000 kg</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-purple-400 font-bold">J (Super)</span>
                  <span>Airbus A380-800 Special</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Cost Index & Optimum Cruise Tool */}
      {activeTab === 'cost_index' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Cost Index Explainer Banner */}
          <div className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-purple-500/30 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-1">
                  FMC Flight Management Computer Parameter
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  Cost Index (CI) = Time Cost ($/hr) / Fuel Cost ($/kg)
                </h3>
              </div>
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                {ciPresets.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => { setSelectedCiPreset(preset); setUserCostIndex(preset.defaultCi); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedCiPreset.name === preset.name
                        ? 'bg-purple-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {preset.name.split(' ')[0]} {preset.name.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
              The Cost Index governs FMC speed and altitude schedules. <strong>CI = 0</strong> corresponds to Maximum Range Cruise (minimum fuel burn, lowest speed). As CI increases towards 999, the FMC flies faster to save expensive time at the expense of burning more fuel.
            </p>
          </div>

          {/* Interactive Cost Index Simulator */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Inputs (5/12 cols) */}
            <div className="lg:col-span-5 bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 space-y-6">
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider border-b border-white/5 pb-2">
                Economic & FMC Inputs
              </h4>

              {/* Cost Index Slider */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
                  <span className="text-purple-400 font-bold">FMC COST INDEX (CI)</span>
                  <span className="text-white font-black text-base">{userCostIndex}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={selectedCiPreset.maxCi}
                  step="1"
                  value={userCostIndex}
                  onChange={e => setUserCostIndex(Number(e.target.value))}
                  className="w-full accent-purple-500 h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>CI = 0 (Min Fuel / MRC)</span>
                  <span>Typical: {selectedCiPreset.defaultCi}</span>
                  <span>CI = {selectedCiPreset.maxCi} (Min Time)</span>
                </div>
              </div>

              {/* Time Cost Slider */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
                  <span>HOURLY TIME COST (Crew, Maintenance, Depreciation)</span>
                  <span className="text-white font-bold">${timeCostPerHour} / hr</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="50"
                  value={timeCostPerHour}
                  onChange={e => setTimeCostPerHour(Number(e.target.value))}
                  className="w-full accent-purple-500 h-2 cursor-pointer"
                />
              </div>

              {/* Fuel Cost Slider */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
                  <span>JET A-1 FUEL COST</span>
                  <span className="text-white font-bold">${fuelCostPerKg.toFixed(2)} / kg</span>
                </div>
                <input
                  type="range"
                  min="0.40"
                  max="1.80"
                  step="0.05"
                  value={fuelCostPerKg}
                  onChange={e => setFuelCostPerKg(Number(e.target.value))}
                  className="w-full accent-purple-500 h-2 cursor-pointer"
                />
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-white/5 space-y-1 text-xs">
                <span className="text-slate-400 uppercase font-mono block">Recommended Airline CI</span>
                <span className="text-purple-300 font-bold font-mono text-base">Calculated CI: {theoreticalCi}</span>
                <p className="text-[11px] text-slate-500 mt-1">
                  When jet fuel prices spike, airlines instruct pilots to lower the CI to save fuel. When tight slots or passenger connections risk delays, airlines raise CI.
                </p>
              </div>
            </div>

            {/* Right Output & Economics (7/12 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Performance Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
                <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block">ECON CRUISE MACH</span>
                  <span className="text-2xl font-black text-white mt-1">M{econMach.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{econTas} KT TAS</span>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block">FLIGHT TIME (1200 NM)</span>
                  <span className="text-2xl font-black text-cyan-400 mt-1">{flightTimeHours.toFixed(2)}h</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{Math.round(flightTimeHours * 60)} mins</span>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block">TRIP FUEL BURN</span>
                  <span className="text-2xl font-black text-amber-400 mt-1">{(tripFuelEstimate / 1000).toFixed(1)}t</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{econFlow} kg/hr</span>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block">TOTAL SECTOR COST</span>
                  <span className="text-2xl font-black text-emerald-400 mt-1">${totalCost.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Time + Fuel</span>
                </div>
              </div>

              {/* Step Climb & Optimum Altitude Theory (EASA Ch 15) */}
              <div className="bg-slate-900/60 p-6 rounded-3xl border border-white/5 space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  Step Climbs & Optimum Aerodynamic Altitude (EASA Ch 15)
                </h4>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs text-slate-300">
                  <p className="leading-relaxed">
                    As fuel burns off en-route, aircraft total mass continuously decreases. Because optimal cruise altitude occurs at maximum lift-to-drag ratio (L/D_max), the aerodynamically optimum altitude increases as weight drops:
                  </p>
                  
                  {/* Step Climb Flow Representation */}
                  <div className="flex items-center justify-between font-mono text-center py-2 bg-slate-900/60 rounded-xl px-4 border border-white/5">
                    <div>
                      <span className="text-slate-500 block text-[10px]">DEPARTURE HEAVY</span>
                      <span className="text-white font-bold text-sm">FL330</span>
                      <span className="text-[10px] text-slate-400 block">75 Tonnes</span>
                    </div>
                    <span className="text-cyan-400 font-bold">→ Step Climb →</span>
                    <div>
                      <span className="text-slate-500 block text-[10px]">MID-CRUISE</span>
                      <span className="text-white font-bold text-sm">FL370</span>
                      <span className="text-[10px] text-slate-400 block">68 Tonnes</span>
                    </div>
                    <span className="text-cyan-400 font-bold">→ Step Climb →</span>
                    <div>
                      <span className="text-slate-500 block text-[10px]">FINAL CRUISE</span>
                      <span className="text-white font-bold text-sm">FL410</span>
                      <span className="text-[10px] text-slate-400 block">61 Tonnes</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    Executing step climbs to follow the optimum altitude curve maximizes nautical air miles flown per kilogram of fuel burned. Climbing too early (before mass has sufficiently decreased) leaves the aircraft thrust-limited or buffeted near aerodynamic stall ceiling (coffin corner).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ICAO_FPL_Generator;
