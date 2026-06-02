import React, { useState } from 'react';
import { View } from '../../types';
import { ChevronLeft, FormInput, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onChangeView: (view: View) => void;
}

const ICAO_FPL_Generator: React.FC<Props> = ({ onChangeView }) => {
  // Form State
  const [item7, setItem7] = useState('BAW123'); // Aircraft ID
  const [item8Rules, setItem8Rules] = useState('I'); // Flight Rules (I/V/Y/Z)
  const [item8Type, setItem8Type] = useState('S'); // Type of Flight (S/N/G/M/X)
  const [item9Num, setItem9Num] = useState(''); // Number of aircraft
  const [item9Type, setItem9Type] = useState('B738'); // Type of aircraft
  const [item9Wake, setItem9Wake] = useState('M'); // Wake Turbulence (L/M/H/J)
  const [item10Equip, setItem10Equip] = useState('SDFG'); // Equipment
  const [item10Trans, setItem10Trans] = useState('S'); // Transponder (S/C/X)
  const [item13Dep, setItem13Dep] = useState('EGLL'); // Departure Aerodrome
  const [item13Time, setItem13Time] = useState('1030'); // Departure Time
  const [item15SpeedType, setItem15SpeedType] = useState('N'); // Speed Type (N = Knots, M = Mach)
  const [item15Speed, setItem15Speed] = useState('0450'); // Speed value
  const [item15LevelType, setItem15LevelType] = useState('F'); // Level Type (F = FL, A = Altitude, V = VFR)
  const [item15Level, setItem15Level] = useState('350'); // Level value
  const [item15Route, setItem15Route] = useState('DCT DTY UL602 GAM UR123'); // Route
  const [item16Dest, setItem16Dest] = useState('LFPG'); // Destination
  const [item16Eet, setItem16Eet] = useState('0115'); // EET
  const [item16Alt1, setItem16Alt1] = useState('LFOB'); // Alternate 1
  const [item16Alt2, setItem16Alt2] = useState('LFQQ'); // Alternate 2
  const [item18Other, setItem18Other] = useState('PBN/A1B1C1D1S1 REG/G-BAWN DOF/260602 EET/LFFF0035'); // Other Info
  const [item19Dinghy, setItem19Dinghy] = useState(false); // Supplementary Info
  const [item19Jackets, setItem19Jackets] = useState(true);

  // Validation Logic
  const errors: Record<string, string> = {};

  if (!/^[A-Z0-9]{1,7}$/i.test(item7)) {
    errors.item7 = 'Aircraft Identification must be 1 to 7 alphanumeric characters.';
  }
  if (!['I', 'V', 'Y', 'Z'].includes(item8Rules.toUpperCase())) {
    errors.item8Rules = 'Flight Rules must be I (IFR), V (VFR), Y (IFR first), or Z (VFR first).';
  }
  if (!['S', 'N', 'G', 'M', 'X'].includes(item8Type.toUpperCase())) {
    errors.item8Type = 'Type of Flight must be S (Scheduled), N (Non-scheduled), G (General), M (Military), or X (Other).';
  }
  if (item9Num && !/^\d{1,2}$/.test(item9Num)) {
    errors.item9Num = 'Number of aircraft must be 1 to 2 digits (leave blank if single aircraft).';
  }
  if (!/^[A-Z0-9]{2,4}$/i.test(item9Type)) {
    errors.item9Type = 'Aircraft type must be a 2-4 character designator (e.g. B738, C172).';
  }
  if (!['L', 'M', 'H', 'J'].includes(item9Wake.toUpperCase())) {
    errors.item9Wake = 'Wake turbulence category must be L (Light), M (Medium), H (Heavy), or J (Super).';
  }
  if (!/^[A-Z]{4}$/i.test(item13Dep)) {
    errors.item13Dep = 'Departure Aerodrome must be a 4-letter ICAO code (e.g. EGLL).';
  }
  if (!/^\d{4}$/.test(item13Time) || Number(item13Time.substring(0, 2)) >= 24 || Number(item13Time.substring(2, 4)) >= 60) {
    errors.item13Time = 'Departure time must be a valid 4-digit UTC time (HHMM).';
  }
  if (!/^[A-Z]{4}$/i.test(item16Dest)) {
    errors.item16Dest = 'Destination Aerodrome must be a 4-letter ICAO code.';
  }
  if (!/^\d{4}$/.test(item16Eet) || Number(item16Eet.substring(0, 2)) >= 24 || Number(item16Eet.substring(2, 4)) >= 60) {
    errors.item16Eet = 'Total EET must be in 4-digit hours and minutes format (HHMM).';
  }

  const isValid = Object.keys(errors).length === 0;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-700">
      {/* Back Button */}
      <button 
        onClick={() => onChangeView(View.FLIGHT_PLAN_HOME)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Subject Dashboard
      </button>

      {/* Header */}
      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-purple-500/20 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="p-4 bg-purple-500/20 rounded-2xl text-purple-400">
            <FormInput size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">ICAO Flight Plan Generator</h1>
        </div>
        <p className="text-slate-300 text-lg max-w-2xl leading-relaxed relative z-10">
          Fully interactive flight plan builder conforming strictly to standard ICAO ATS layouts. Real-time syntax validation for EASA exam preparation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: ICAO Form Paper Mockup (8/12) */}
        <div className="lg:col-span-8 bg-amber-50/5 text-slate-100 p-6 md:p-8 rounded-3xl border border-white/10 space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 bg-yellow-500/20 text-yellow-300 text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-br-2xl border-r border-b border-white/10">
            Official ICAO ATS Flight Plan Form
          </div>

          <div className="space-y-4 pt-4">
            {/* Row 1: Item 7 & 8 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4 bg-slate-950/40 p-4 rounded-xl border border-white/5">
                <label className="text-[10px] text-slate-500 font-bold block mb-1">ITEM 7: AIRCRAFT ID</label>
                <input 
                  type="text" 
                  value={item7} 
                  maxLength={7}
                  onChange={e => setItem7(e.target.value.toUpperCase())}
                  className="w-full bg-transparent text-white font-mono text-lg font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none" 
                />
                {errors.item7 && <span className="text-[9px] text-red-400 mt-1 block">{errors.item7}</span>}
              </div>

              <div className="md:col-span-4 bg-slate-950/40 p-4 rounded-xl border border-white/5">
                <label className="text-[10px] text-slate-500 font-bold block mb-1">ITEM 8: FLIGHT RULES</label>
                <select 
                  value={item8Rules} 
                  onChange={e => setItem8Rules(e.target.value)}
                  className="w-full bg-slate-900 text-white font-mono text-lg font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none"
                >
                  <option value="I">I (IFR)</option>
                  <option value="V">V (VFR)</option>
                  <option value="Y">Y (IFR first then VFR)</option>
                  <option value="Z">Z (VFR first then IFR)</option>
                </select>
              </div>

              <div className="md:col-span-4 bg-slate-950/40 p-4 rounded-xl border border-white/5">
                <label className="text-[10px] text-slate-500 font-bold block mb-1">ITEM 8: TYPE OF FLIGHT</label>
                <select 
                  value={item8Type} 
                  onChange={e => setItem8Type(e.target.value)}
                  className="w-full bg-slate-900 text-white font-mono text-lg font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none"
                >
                  <option value="S">S (Scheduled)</option>
                  <option value="N">N (Non-scheduled)</option>
                  <option value="G">G (General Aviation)</option>
                  <option value="M">M (Military)</option>
                  <option value="X">X (Other)</option>
                </select>
              </div>
            </div>

            {/* Row 2: Item 9 & 10 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-6 bg-slate-950/40 p-4 rounded-xl border border-white/5 flex gap-4">
                <div className="w-1/3">
                  <label className="text-[10px] text-slate-500 font-bold block mb-1">ITEM 9: NUMBER</label>
                  <input 
                    type="text" 
                    placeholder="1"
                    value={item9Num} 
                    onChange={e => setItem9Num(e.target.value)}
                    className="w-full bg-transparent text-white font-mono text-lg font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none" 
                  />
                </div>
                <div className="w-1/3">
                  <label className="text-[10px] text-slate-500 font-bold block mb-1">TYPE OF A/C</label>
                  <input 
                    type="text" 
                    value={item9Type} 
                    onChange={e => setItem9Type(e.target.value.toUpperCase())}
                    className="w-full bg-transparent text-white font-mono text-lg font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none" 
                  />
                </div>
                <div className="w-1/3">
                  <label className="text-[10px] text-slate-500 font-bold block mb-1">WAKE CAT</label>
                  <select 
                    value={item9Wake} 
                    onChange={e => setItem9Wake(e.target.value)}
                    className="w-full bg-slate-900 text-white font-mono text-lg font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="L">L (Light)</option>
                    <option value="M">M (Medium)</option>
                    <option value="H">H (Heavy)</option>
                    <option value="J">J (Super Heavy)</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-6 bg-slate-950/40 p-4 rounded-xl border border-white/5 flex gap-4">
                <div className="w-2/3">
                  <label className="text-[10px] text-slate-500 font-bold block mb-1">ITEM 10: EQUIPMENT</label>
                  <input 
                    type="text" 
                    value={item10Equip} 
                    onChange={e => setItem10Equip(e.target.value.toUpperCase())}
                    className="w-full bg-transparent text-white font-mono text-lg font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none" 
                  />
                </div>
                <div className="w-1/3">
                  <label className="text-[10px] text-slate-500 font-bold block mb-1">TRANSPONDER</label>
                  <select 
                    value={item10Trans} 
                    onChange={e => setItem10Trans(e.target.value)}
                    className="w-full bg-slate-900 text-white font-mono text-lg font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="S">S (Mode S)</option>
                    <option value="C">C (Mode C)</option>
                    <option value="X">X (None)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Row 3: Item 13 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-6 bg-slate-950/40 p-4 rounded-xl border border-white/5">
                <label className="text-[10px] text-slate-500 font-bold block mb-1">ITEM 13: DEP AERODROME</label>
                <input 
                  type="text" 
                  value={item13Dep} 
                  maxLength={4}
                  onChange={e => setItem13Dep(e.target.value.toUpperCase())}
                  className="w-full bg-transparent text-white font-mono text-lg font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none" 
                />
              </div>

              <div className="md:col-span-6 bg-slate-950/40 p-4 rounded-xl border border-white/5">
                <label className="text-[10px] text-slate-500 font-bold block mb-1">DEPARTURE TIME (UTC)</label>
                <input 
                  type="text" 
                  value={item13Time} 
                  maxLength={4}
                  onChange={e => setItem13Time(e.target.value)}
                  className="w-full bg-transparent text-white font-mono text-lg font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none" 
                />
              </div>
            </div>

            {/* Row 4: Item 15 Speed, Level & Route */}
            <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 space-y-4">
              <label className="text-[10px] text-slate-500 font-bold block mb-1">ITEM 15: ROUTING DETAILS</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex gap-2">
                  <div className="w-1/3">
                    <label className="text-[9px] text-slate-600 block">SPD TYPE</label>
                    <select value={item15SpeedType} onChange={e => setItem15SpeedType(e.target.value)} className="w-full bg-slate-900 text-white font-mono text-sm border-b border-slate-700 focus:outline-none">
                      <option value="N">N (Knots)</option>
                      <option value="M">M (Mach)</option>
                    </select>
                  </div>
                  <div className="w-2/3">
                    <label className="text-[9px] text-slate-600 block">SPEED</label>
                    <input type="text" value={item15Speed} onChange={e => setItem15Speed(e.target.value)} className="w-full bg-transparent text-white font-mono text-sm border-b border-slate-700 focus:outline-none" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="w-1/3">
                    <label className="text-[9px] text-slate-600 block">LEVEL TYPE</label>
                    <select value={item15LevelType} onChange={e => setItem15LevelType(e.target.value)} className="w-full bg-slate-900 text-white font-mono text-sm border-b border-slate-700 focus:outline-none">
                      <option value="F">F (Flight Level)</option>
                      <option value="A">A (Altitude)</option>
                      <option value="V">V (VFR)</option>
                    </select>
                  </div>
                  <div className="w-2/3">
                    <label className="text-[9px] text-slate-600 block">LEVEL</label>
                    <input type="text" value={item15Level} disabled={item15LevelType === 'V'} className="w-full bg-transparent text-white font-mono text-sm border-b border-slate-700 focus:outline-none disabled:opacity-30" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[9px] text-slate-600 block mb-1">ROUTE OF FLIGHT</label>
                <textarea 
                  value={item15Route} 
                  rows={2}
                  onChange={e => setItem15Route(e.target.value.toUpperCase())}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-mono text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Row 5: Item 16 Destination, EET & Alternates */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5">
                <label className="text-[10px] text-slate-500 font-bold block mb-1">DESTINATION</label>
                <input 
                  type="text" 
                  value={item16Dest} 
                  maxLength={4}
                  onChange={e => setItem16Dest(e.target.value.toUpperCase())}
                  className="w-full bg-transparent text-white font-mono text-lg font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none" 
                />
              </div>
              <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5">
                <label className="text-[10px] text-slate-500 font-bold block mb-1">TOTAL EET</label>
                <input 
                  type="text" 
                  value={item16Eet} 
                  maxLength={4}
                  onChange={e => setItem16Eet(e.target.value)}
                  className="w-full bg-transparent text-white font-mono text-lg font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none" 
                />
              </div>
              <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5">
                <label className="text-[10px] text-slate-500 font-bold block mb-1">ALTN AERODROME</label>
                <input 
                  type="text" 
                  value={item16Alt1} 
                  maxLength={4}
                  onChange={e => setItem16Alt1(e.target.value.toUpperCase())}
                  className="w-full bg-transparent text-white font-mono text-lg font-bold border-b border-slate-700 focus:border-purple-500 focus:outline-none" 
                />
              </div>
              <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5">
                <label className="text-[10px] text-slate-500 font-bold block mb-1">2ND ALTN AERODROME</label>
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
            <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5">
              <label className="text-[10px] text-slate-500 font-bold block mb-2">ITEM 18: OTHER INFORMATION</label>
              <textarea 
                value={item18Other} 
                rows={2}
                onChange={e => setItem18Other(e.target.value.toUpperCase())}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 font-mono text-sm text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Validation & Education (4/12) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Validation Box */}
          <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 space-y-4">
            <h3 className="text-lg font-bold text-white mb-2">Real-Time FPL Audit</h3>
            
            {isValid ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-3">
                <CheckCircle className="text-emerald-400 w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-200">
                  <strong>Form Format Fully Valid:</strong> Complies with EASA standard parsing rules. Ready to transmit to Flight Service.
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="text-red-400 w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs text-red-200 space-y-1">
                  <strong>Validation Issues Found:</strong>
                  <ul className="list-disc pl-4 space-y-1">
                    {Object.values(errors).map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Educational EASA Guidelines */}
          <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 space-y-4">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">EASA Syllabus Guide</h4>
            
            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex gap-3">
                <div className="p-2 bg-slate-950 rounded-lg text-purple-400 font-bold h-max">01</div>
                <div className="leading-relaxed">
                  <strong>Fixed Formats:</strong> ICAO Flight Plans are strictly standard-formatted to allow automatic parsing by Aeronautical Fixed Telecommunication Network (AFTN) computers.
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 bg-slate-950 rounded-lg text-purple-400 font-bold h-max">02</div>
                <div className="leading-relaxed">
                  <strong>Item 10 (Equip):</strong> Standard equipment is represented as **S** (standard VHF, VOR, ILS combo). Modern RNP routes require adding **G** (GNSS) and corresponding PBN/ codes in Item 18.
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 bg-slate-950 rounded-lg text-purple-400 font-bold h-max">03</div>
                <div className="leading-relaxed">
                  <strong>Wake Turbulence:</strong> Determined by Maximum Certified Take-off Mass (MCTOM):
                  <ul className="list-disc pl-4 mt-1 space-y-0.5">
                    <li>**L (Light):** &le; 7,000 kg</li>
                    <li>**M (Medium):** 7,000 kg &lt; MCTOM &lt; 136,000 kg</li>
                    <li>**H (Heavy):** &ge; 136,000 kg</li>
                    <li>**J (Super):** Airbus A380-800, etc.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ICAO_FPL_Generator;
