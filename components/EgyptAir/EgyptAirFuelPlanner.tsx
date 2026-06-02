import React, { useState, useEffect } from 'react';
import { View } from '../../types';
import { 
  ArrowLeft, Fuel, Info, AlertTriangle, RefreshCw, Layers, Compass
} from 'lucide-react';

interface Props {
  onChangeView: (view: View) => void;
}

interface AircraftType {
  name: string;
  hourlyBurn: number; // kg per hour
  holdingBurn: number; // kg per hour (at 1500ft ISA)
  averageSpeed: number; // Knots
}

const aircraftProfiles: AircraftType[] = [
  { name: "Airbus A320neo", hourlyBurn: 2400, holdingBurn: 1800, averageSpeed: 450 },
  { name: "Boeing 737-800", hourlyBurn: 2600, holdingBurn: 2000, averageSpeed: 460 },
  { name: "Boeing 787-9", hourlyBurn: 5400, holdingBurn: 4200, averageSpeed: 490 }
];

export const EgyptAirFuelPlanner: React.FC<Props> = ({ onChangeView }) => {
  const [selectedAc, setSelectedAc] = useState<AircraftType>(aircraftProfiles[0]);
  const [tripDistance, setTripDistance] = useState(600); // NM
  const [alternateDistance, setAlternateDistance] = useState(150); // NM
  const [contingencyPolicy, setContingencyPolicy] = useState<'STANDARD_5' | 'DECISION_3'>('STANDARD_5');
  const [windComponent, setWindComponent] = useState(0); // Knots (positive = headwind, negative = tailwind)
  const [extraFuel, setExtraFuel] = useState(500); // kg

  // Output States
  const [taxiFuel, setTaxiFuel] = useState(200); // kg (standard company allowance)
  const [tripFuel, setTripFuel] = useState(0);
  const [contingencyFuel, setContingencyFuel] = useState(0);
  const [alternateFuel, setAlternateFuel] = useState(0);
  const [finalReserve, setFinalReserve] = useState(0);
  const [blockFuel, setBlockFuel] = useState(0);

  useEffect(() => {
    // 1. Calculate ground speed adjusting for wind (headwind reduces GS)
    const effectiveGs = Math.max(200, selectedAc.averageSpeed - windComponent);
    
    // 2. Trip Fuel = (Distance / Ground Speed) * Hourly Burn
    const calculatedTripTime = tripDistance / effectiveGs;
    const calculatedTripFuel = Math.round(calculatedTripTime * selectedAc.hourlyBurn);
    setTripFuel(calculatedTripFuel);

    // 3. Contingency Fuel: EgyptAir Standard
    // STANDARD_5 = 5% of trip fuel, minimum 5 mins holding burn
    // DECISION_3 = 3% of trip fuel with decision point
    const minContingencyHold = Math.round((5 / 60) * selectedAc.holdingBurn);
    let calculatedContingency = 0;
    if (contingencyPolicy === 'STANDARD_5') {
      calculatedContingency = Math.max(minContingencyHold, Math.round(calculatedTripFuel * 0.05));
    } else {
      calculatedContingency = Math.max(minContingencyHold, Math.round(calculatedTripFuel * 0.03));
    }
    setContingencyFuel(calculatedContingency);

    // 4. Alternate Fuel (Climb, cruise, descent, approach)
    // Alternate Speed = 400 knots for simplification
    const alternateTime = alternateDistance / 400;
    const calculatedAlternateFuel = Math.round(alternateTime * selectedAc.hourlyBurn + 200); // +200kg for approach
    setAlternateFuel(calculatedAlternateFuel);

    // 5. Final Reserve Fuel = 30 minutes of holding at 1,500 ft (under ISA conditions)
    const calculatedFinalReserve = Math.round(0.5 * selectedAc.holdingBurn);
    setFinalReserve(calculatedFinalReserve);

    // 6. Block Fuel = Taxi + Trip + Contingency + Alternate + Final Reserve + Extra
    const calculatedBlock = taxiFuel + calculatedTripFuel + calculatedContingency + calculatedAlternateFuel + calculatedFinalReserve + extraFuel;
    setBlockFuel(calculatedBlock);

  }, [selectedAc, tripDistance, alternateDistance, contingencyPolicy, windComponent, extraFuel, taxiFuel]);

  const fuelCategories = [
    { label: "Taxi Fuel", value: taxiFuel, desc: "EgyptAir standard startup & taxi burn", color: "bg-slate-700" },
    { label: "Trip Fuel", value: tripFuel, desc: "Takeoff, climb, cruise & descent fuel", color: "bg-blue-600" },
    { label: "Contingency Fuel", value: contingencyFuel, desc: `ECAA ${contingencyPolicy === 'STANDARD_5' ? '5%' : '3%'} reserve policy`, color: "bg-cyan-500" },
    { label: "Alternate Fuel", value: alternateFuel, desc: "Climb, cruise, descent & approach to alternate", color: "bg-teal-500" },
    { label: "Final Reserve Fuel", value: finalReserve, desc: "30 minutes holding reserve at 1,500 ft", color: "bg-red-500" },
    { label: "Extra Fuel", value: extraFuel, desc: "Captain discretionary fuel allowance", color: "bg-indigo-500" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 relative overflow-hidden font-sans text-slate-100">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-cyan-600/10 rounded-full blur-[90px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onChangeView(View.EGYPTAIR_DASHBOARD)}
            className="inline-flex items-center px-4 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 rounded-xl border border-white/5 transition-all text-sm active:scale-95"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Cadet Portal
          </button>
          
          <div className="flex items-center gap-2 text-cyan-400 font-black text-xs uppercase tracking-widest">
            <Fuel size={16} /> Fuel Planning Lab
          </div>
        </div>

        {/* main layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card bg-slate-900/40 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
              
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white tracking-tight">Buildup Parameters</h3>
                <p className="text-slate-400 text-xs">Adjust flight profile and company reserves policies.</p>
              </div>

              <div className="border-t border-white/5 my-2"></div>

              {/* Aircraft selector */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Aircraft Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {aircraftProfiles.map((ac, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedAc(ac)}
                      className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        selectedAc.name === ac.name 
                          ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-lg shadow-cyan-500/10' 
                          : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {ac.name.replace("Boeing ", "B").replace("Airbus ", "A")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-300">Trip Distance</span>
                    <span className="text-cyan-400 font-mono">{tripDistance} NM</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="50"
                    value={tripDistance}
                    onChange={e => setTripDistance(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-300">Alternate Distance</span>
                    <span className="text-cyan-400 font-mono">{alternateDistance} NM</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="400"
                    step="25"
                    value={alternateDistance}
                    onChange={e => setAlternateDistance(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-300">Wind Component</span>
                    <span className={`font-mono ${windComponent > 0 ? 'text-amber-400' : windComponent < 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {windComponent > 0 ? `+${windComponent} Knots Headwind` : windComponent < 0 ? `${windComponent} Knots Tailwind` : 'Calm Wind'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-60"
                    max="60"
                    step="5"
                    value={windComponent}
                    onChange={e => setWindComponent(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-300">Captain's Discretionary Extra</span>
                    <span className="text-cyan-400 font-mono">{extraFuel} kg</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="100"
                    value={extraFuel}
                    onChange={e => setExtraFuel(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
              </div>

              {/* Contingency fuel policy */}
              <div className="space-y-2 pt-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Contingency Policy</label>
                <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5">
                  <button
                    onClick={() => setContingencyPolicy('STANDARD_5')}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                      contingencyPolicy === 'STANDARD_5' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Standard 5% Rule
                  </button>
                  <button
                    onClick={() => setContingencyPolicy('DECISION_3')}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                      contingencyPolicy === 'DECISION_3' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    3% Decision Point
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Results and Visual Tank */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Visual Tank Component */}
            <div className="glass-card bg-slate-900/40 border border-white/5 rounded-3xl p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white tracking-tight">Block Fuel Breakdown</h3>
                <span className="text-2xl font-black text-white font-mono">{blockFuel.toLocaleString()} kg</span>
              </div>

              {/* Visual Tank Bar */}
              <div className="w-full h-10 bg-slate-950 rounded-2xl overflow-hidden border border-white/5 flex shadow-inner relative">
                {fuelCategories.map((cat, idx) => {
                  const percentage = (cat.value / blockFuel) * 100;
                  return (
                    <div
                      key={idx}
                      className={`${cat.color} h-full transition-all duration-500 hover:opacity-80 relative group`}
                      style={{ width: `${percentage}%` }}
                    >
                      {/* Tooltip on Hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 border border-white/10 rounded-lg text-[10px] font-black text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-20 whitespace-nowrap">
                        {cat.label}: {cat.value.toLocaleString()} kg ({percentage.toFixed(1)}%)
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                {fuelCategories.map((cat, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded ${cat.color} shrink-0`}></span>
                      <span className="text-xs font-bold text-white">{cat.label}</span>
                    </div>
                    <div className="text-sm font-black text-slate-300 font-mono ml-5">{cat.value.toLocaleString()} kg</div>
                    <div className="text-[10px] text-slate-500 ml-5 leading-normal">{cat.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* EgyptAir specific company fuel regulations info */}
            <div className="p-6 bg-cyan-950/20 border border-cyan-500/20 rounded-3xl space-y-4">
              <h4 className="text-sm font-black uppercase text-cyan-400 tracking-widest flex items-center gap-2">
                <Info size={16} /> EgyptAir OM-A Fuel SOPs
              </h4>
              <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
                <p>
                  <strong>1. Taxi Fuel:</strong> A standard company allowance of <span className="text-white">200 kg</span> is applied for all short/medium haul twin-jet aircraft, covering APU usage and startup taxi burns prior to takeoff.
                </p>
                <p>
                  <strong>2. Contingency Fuel:</strong> Standard ECAA regulations demand <span className="text-white">5%</span> of the planned trip fuel, but can be reduced to <span className="text-white">3%</span> if a decision point is planned and monitored along the route. In all cases, contingency fuel cannot be less than the amount required to fly for 5 minutes at holding speed at 1,500 ft above the destination.
                </p>
                <p>
                  <strong>3. Final Reserve Fuel:</strong> For jet aircraft, the final reserve must equal the amount of fuel required to hold for <span className="text-white">30 minutes at 1,500 ft</span> under ISA temperature conditions above the destination or alternate airport, calculated at estimated landing mass.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default EgyptAirFuelPlanner;
