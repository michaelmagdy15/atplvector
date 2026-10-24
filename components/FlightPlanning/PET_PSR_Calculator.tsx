import React, { useState } from 'react';
import { View } from '../../types';
import { ChevronLeft, Compass, Info, AlertTriangle, CheckCircle, Navigation, Wind, BookOpen, Clock, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onChangeView: (view: View) => void;
}

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  distance: number;
  tas: number;
  wind: number; // + = tailwind out, - = headwind out
  endurance: number;
  engineOutTas?: number;
  note: string;
}

const PRESETS: ScenarioPreset[] = [
  {
    id: 'croucher-ch15',
    name: 'Croucher Ch 15 Worked Example',
    desc: '1,200 NM oceanic sector, 420 kt TAS, 40 kt Headwind outbound. Returning is faster with tailwind.',
    distance: 1200,
    tas: 420,
    wind: -40, // 40 kt headwind
    endurance: 4.8,
    note: 'PET shifts into the wind towards destination: D_PET = 1200 × 460 / 840 = 657.1 NM.'
  },
  {
    id: 'transatlantic-jetstream',
    name: 'North Atlantic Jetstream (+80 kt Tailwind)',
    desc: '1,800 NM oceanic crossing with 80 kt tailwind. Outbound groundspeed is 530 kt.',
    distance: 1800,
    tas: 450,
    wind: 80,
    endurance: 5.5,
    note: 'Tailwind outbound pulls PET towards departure (returning is into an 80 kt headwind).'
  },
  {
    id: 'isolated-island',
    name: 'Isolated Island Sector (Critical PSR)',
    desc: '800 NM sector to remote island with no diversion alternate. Verifying Point of Safe Return.',
    distance: 800,
    tas: 300,
    wind: -25,
    endurance: 3.8,
    note: 'If PSR occurs before destination or PET, returning is impossible past PSR.'
  }
];

const PET_PSR_Calculator: React.FC<Props> = ({ onChangeView }) => {
  // Sector Parameters
  const [totalDistance, setTotalDistance] = useState<number>(1200); // NM
  const [tas, setTas] = useState<number>(420); // KT
  const [windComponent, setWindComponent] = useState<number>(-40); // KT (+ = Tailwind out, - = Headwind out)
  const [endurance, setEndurance] = useState<number>(4.8); // Hours safe endurance (fuel minus reserve)
  
  // Engine-Out (1EO) Critical Decision Toggle
  const [engineOutMode, setEngineOutMode] = useState<boolean>(false);
  const [engineOutTas, setEngineOutTas] = useState<number>(330); // Reduced single-engine cruise speed

  // Active Cruise Speed
  const activeTas = engineOutMode ? engineOutTas : tas;

  // Apply Preset
  const handleApplyPreset = (p: ScenarioPreset) => {
    setTotalDistance(p.distance);
    setTas(p.tas);
    setWindComponent(p.wind);
    setEndurance(p.endurance);
    setEngineOutMode(false);
  };

  // Groundspeeds
  // Outbound groundspeed (O) = TAS + Wind (if wind > 0 tailwind, if wind < 0 headwind)
  const gsOut = Math.max(50, activeTas + windComponent);
  // Homeward groundspeed (H) = TAS - Wind (opposite wind on 180° reciprocal course)
  const gsHome = Math.max(50, activeTas - windComponent);

  // Point of Equal Time (PET / Critical Point)
  // d_PET = (D * H) / (O + H)
  const dPet = (totalDistance * gsHome) / (gsOut + gsHome);
  const tPetHours = dPet / gsOut;
  const tPetMins = tPetHours * 60;

  // Time to return to DEP from PET vs Time to continue to DEST from PET
  const tReturnFromPetMins = (dPet / gsHome) * 60;
  const tContinueFromPetMins = ((totalDistance - dPet) / gsOut) * 60;

  // Point of Safe Return (PSR / PNR)
  // t_PSR = (E * H) / (O + H)
  const tPsrHours = (endurance * gsHome) / (gsOut + gsHome);
  const tPsrMins = tPsrHours * 60;
  const dPsr = tPsrHours * gsOut; // NM from departure

  // Calculations for scale visuals
  const halfDistance = totalDistance / 2;
  const petOffsetPercent = Math.max(0, Math.min(100, (dPet / totalDistance) * 100));
  const psrOffsetPercent = Math.max(0, Math.min(100, (dPsr / totalDistance) * 100));

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

      {/* Header Panel */}
      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-blue-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
              <Compass className="w-3.5 h-3.5" /> Subject 033 • Critical En-Route Decision Points
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Point of Equal Time (PET) & Point of Safe Return (PSR)
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl leading-relaxed mt-2">
              Solve critical in-flight boundaries where diverting forward takes equal time to returning, and the point of no return where fuel endurance limits homeward return.
            </p>
          </div>

          {/* Engine-Out Failure Mode Switch */}
          <div className="bg-slate-950 p-2 rounded-2xl border border-slate-700 self-start md:self-auto flex items-center gap-3">
            <Shield className={`w-5 h-5 ${engineOutMode ? 'text-red-400 animate-pulse' : 'text-slate-500'}`} />
            <div>
              <div className="text-xs font-bold text-white">One Engine Inoperative (1EO)</div>
              <div className="text-[10px] text-slate-400">Driftdown speed ({engineOutTas} kt)</div>
            </div>
            <button
              onClick={() => setEngineOutMode(!engineOutMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                engineOutMode
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {engineOutMode ? '1EO ACTIVE' : 'ALL ENGINES'}
            </button>
          </div>
        </div>
      </div>

      {/* Croucher Presets Bar */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-blue-400" />
          Pre-Loaded Croucher & EASA Exam Sectors:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESETS.map(p => (
            <button
              key={p.id}
              onClick={() => handleApplyPreset(p)}
              className="p-3 bg-slate-950/80 hover:bg-blue-950/30 hover:border-blue-500/50 border border-slate-800 rounded-xl text-left transition-all group"
            >
              <span className="text-xs font-bold text-white group-hover:text-blue-300 block mb-1">
                {p.name}
              </span>
              <span className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                {p.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Parameter Inputs (5/12 cols) */}
        <div className="lg:col-span-5 bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">Sector & Aerodynamic Inputs</h3>

          {/* Sector Distance */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>TOTAL SECTOR DISTANCE (D)</span>
              <span className="text-white font-bold">{totalDistance} NM</span>
            </div>
            <input 
              type="range" 
              min="300" 
              max="3000" 
              step="50" 
              value={totalDistance} 
              onChange={e => setTotalDistance(Number(e.target.value))} 
              className="w-full accent-blue-500 h-2 cursor-pointer" 
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>300 NM</span>
              <span>Midpoint: {halfDistance} NM</span>
              <span>3,000 NM</span>
            </div>
          </div>

          {/* Cruise Speed TAS */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>TRUE AIRSPEED (TAS)</span>
              <span className="text-white font-bold">{activeTas} KT {engineOutMode && '(1EO)'}</span>
            </div>
            <input 
              type="range" 
              min="120" 
              max="550" 
              step="10" 
              value={tas} 
              onChange={e => setTas(Number(e.target.value))} 
              className="w-full accent-blue-500 h-2 cursor-pointer" 
            />
          </div>

          {/* Wind Component */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>OUTBOUND EN-ROUTE WIND</span>
              <span className={`font-bold ${windComponent > 0 ? 'text-emerald-400' : windComponent < 0 ? 'text-amber-400' : 'text-white'}`}>
                {windComponent > 0 ? `+${windComponent} KT Tailwind` : windComponent < 0 ? `${Math.abs(windComponent)} KT Headwind` : '0 KT (Still Air)'}
              </span>
            </div>
            <input 
              type="range" 
              min="-120" 
              max="120" 
              step="5" 
              value={windComponent} 
              onChange={e => setWindComponent(Number(e.target.value))} 
              className="w-full accent-blue-500 h-2 cursor-pointer" 
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>-120 KT Headwind</span>
              <span>Calm</span>
              <span>+120 KT Tailwind</span>
            </div>
          </div>

          {/* Fuel Safe Endurance */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>SAFE FUEL ENDURANCE (E)</span>
              <span className="text-white font-bold">{endurance.toFixed(1)} Hours</span>
            </div>
            <input 
              type="range" 
              min="1.5" 
              max="12.0" 
              step="0.1" 
              value={endurance} 
              onChange={e => setEndurance(Number(e.target.value))} 
              className="w-full accent-blue-500 h-2 cursor-pointer" 
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              Usable fuel endurance minus mandatory Final Reserve and Alternate fuel allowances.
            </span>
          </div>

          {/* Computed Groundspeeds */}
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Groundspeed Calculation Breakdown</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 p-3 rounded-xl border border-white/5 text-center">
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Outbound GS (O)</span>
                <span className="text-xl font-bold text-white font-mono">{gsOut} KT</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{activeTas} {windComponent >= 0 ? '+' : '-'} {Math.abs(windComponent)}</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-white/5 text-center">
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Homeward GS (H)</span>
                <span className="text-xl font-bold text-white font-mono">{gsHome} KT</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{activeTas} {windComponent >= 0 ? '-' : '+'} {Math.abs(windComponent)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Timeline & Croucher Math Proof (7/12 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Visual Scale Diagram */}
          <div className="bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Navigation className="text-blue-400 rotate-90" />
                Flight Route Decision Timeline
              </h3>
              <span className="text-xs font-mono text-slate-400">
                {windComponent < 0 ? '← Wind Blowing From Dest' : windComponent > 0 ? '→ Wind Blowing From Dep' : 'No Wind'}
              </span>
            </div>

            {/* Interactive Flight Timeline Bar */}
            <div className="relative pt-14 pb-20 px-6 bg-slate-950 rounded-2xl border border-slate-800 select-none">
              {/* Route Line */}
              <div className="h-2 w-full bg-slate-800 rounded-full"></div>

              {/* Geographic Midpoint */}
              <div className="absolute left-1/2 top-12 -translate-x-1/2 flex flex-col items-center">
                <div className="w-0.5 h-6 bg-slate-700"></div>
                <span className="text-[10px] text-slate-500 font-mono mt-1">Midpoint ({halfDistance} NM)</span>
              </div>

              {/* Departure (0 NM) */}
              <div className="absolute left-6 top-12 flex flex-col items-center">
                <div className="w-1.5 h-6 bg-slate-400"></div>
                <span className="text-[10px] text-slate-300 font-bold mt-1">DEP (0 NM)</span>
              </div>

              {/* Destination */}
              <div className="absolute right-6 top-12 flex flex-col items-center">
                <div className="w-1.5 h-6 bg-slate-400"></div>
                <span className="text-[10px] text-slate-300 font-bold mt-1">DEST ({totalDistance} NM)</span>
              </div>

              {/* PET Marker Pin */}
              <motion.div 
                animate={{ left: `calc(${petOffsetPercent}% + 24px - ${petOffsetPercent * 0.48}px)` }} 
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                className="absolute top-2 -translate-x-1/2 flex flex-col items-center z-20 cursor-pointer"
              >
                <div className="bg-blue-500 text-black font-black text-[10px] px-2 py-0.5 rounded shadow-lg shadow-blue-500/30">
                  PET / CP
                </div>
                <div className="w-0.5 h-12 bg-blue-500"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-slate-900 -mt-1"></div>
                <span className="text-[11px] text-blue-400 font-mono font-bold mt-1 whitespace-nowrap bg-slate-900/90 px-1 rounded">
                  {Math.round(dPet)} NM
                </span>
              </motion.div>

              {/* PSR Marker Pin */}
              <motion.div 
                animate={{ left: `calc(${psrOffsetPercent}% + 24px - ${psrOffsetPercent * 0.48}px)` }} 
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                className="absolute top-16 -translate-x-1/2 flex flex-col items-center z-20 cursor-pointer"
              >
                <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900"></div>
                <div className="w-0.5 h-12 bg-red-500"></div>
                <div className="bg-red-500 text-black font-black text-[10px] px-2 py-0.5 rounded shadow-lg shadow-red-500/30">
                  PSR / PNR
                </div>
                <span className="text-[11px] text-red-400 font-mono font-bold mt-1 whitespace-nowrap bg-slate-900/90 px-1 rounded">
                  {Math.round(dPsr)} NM
                </span>
              </motion.div>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* PET Analysis */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs text-blue-400 block uppercase font-mono font-bold">
                  Point of Equal Time (PET)
                </span>
                <div className="flex items-baseline gap-2 font-mono">
                  <span className="text-3xl font-black text-white">{Math.round(dPet)}</span>
                  <span className="text-xs text-slate-400">NM from DEP ({petOffsetPercent.toFixed(1)}% of route)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Time to reach PET: <strong>{Math.floor(tPetMins)} mins</strong>. Returning home or continuing to destination from this exact geographical point takes identical flight time: <strong>{Math.round(tReturnFromPetMins)} mins</strong>.
                </p>
              </div>

              {/* PSR Analysis */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs text-red-400 block uppercase font-mono font-bold">
                  Point of Safe Return (PSR)
                </span>
                <div className="flex items-baseline gap-2 font-mono">
                  <span className="text-3xl font-black text-white">{Math.round(dPsr)}</span>
                  <span className="text-xs text-slate-400">NM from DEP (Time: {Math.floor(tPsrMins)} min)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Point of no return. Flying past this point leaves insufficient usable fuel to return to departure aerodrome while keeping mandatory reserve intact.
                </p>
              </div>
            </div>

            {/* Croucher Mental Model Box */}
            <div className="p-4 bg-blue-950/20 border border-blue-500/30 rounded-2xl flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-blue-400">Croucher Mental Model: "Wind Shifts the PET Into the Wind":</strong> Notice that an outbound headwind shifts the PET forward <em>towards the destination</em> ({Math.round(dPet)} NM &gt; {halfDistance} NM). This happens because the aircraft returns home with a high-speed tailwind ({gsHome} KT), making the return flight faster than the outbound leg!
              </div>
            </div>

            {/* PSR vs PET Critical Decision Warning */}
            {dPsr < dPet ? (
              <div className="p-4 bg-red-950/40 border border-red-500/50 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="text-red-400 w-5 h-5 shrink-0 mt-0.5 animate-bounce" />
                <div className="text-xs text-red-200 leading-relaxed">
                  <strong>CRITICAL FLIGHT PLAN HAZARD (PSR &lt; PET):</strong> The Point of Safe Return ({Math.round(dPsr)} NM) occurs BEFORE the Point of Equal Time ({Math.round(dPet)} NM)! You will run out of safe fuel return options before reaching the equal-time decision point. En-route diversion airport required!
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl flex items-start gap-3">
                <CheckCircle className="text-emerald-400 w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-200 leading-relaxed">
                  <strong>Operational Safety Margin Normal (PSR &gt; PET):</strong> PSR occurs after PET. You have sufficient safe fuel reserves to reach the PET boundary and decide whether to return or continue safely.
                </div>
              </div>
            )}
          </div>

          {/* Mathematical Proof Card (Croucher Ch 15) */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
            <span className="text-blue-400 font-bold uppercase tracking-wider block">
              Croucher Mathematical Proof (Ch 15 Formulas)
            </span>

            <div className="space-y-3 text-slate-300">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-blue-300 font-bold block mb-1">Point of Equal Time (PET) Formula</span>
                <span className="text-white text-sm">D_PET = (D × H) / (O + H)</span>
                <div className="text-[11px] text-slate-400 mt-2">
                  D_PET = ({totalDistance} × {gsHome}) / ({gsOut} + {gsHome}) = {(totalDistance * gsHome).toLocaleString()} / {gsOut + gsHome} = <strong className="text-blue-400">{dPet.toFixed(1)} NM</strong>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-red-300 font-bold block mb-1">Point of Safe Return (PSR) Formula</span>
                <span className="text-white text-sm">T_PSR = (E × H) / (O + H)</span>
                <div className="text-[11px] text-slate-400 mt-2">
                  T_PSR = ({endurance.toFixed(1)} × {gsHome}) / ({gsOut} + {gsHome}) = {tPsrHours.toFixed(3)} hrs ({Math.floor(tPsrMins)} mins). Distance = {tPsrHours.toFixed(3)} × {gsOut} = <strong className="text-red-400">{dPsr.toFixed(1)} NM</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PET_PSR_Calculator;
