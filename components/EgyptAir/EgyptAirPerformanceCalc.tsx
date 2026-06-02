import React, { useState, useEffect } from 'react';
import { View } from '../../types';
import { 
  ArrowLeft, BarChart3, Wind, Thermometer, ShieldAlert, Layers, Info
} from 'lucide-react';

interface Props {
  onChangeView: (view: View) => void;
}

export const EgyptAirPerformanceCalc: React.FC<Props> = ({ onChangeView }) => {
  const [aircraftWeight, setAircraftWeight] = useState(68); // Tons (Typical A320)
  const [fieldElevation, setFieldElevation] = useState(300); // feet (Cairo HECA approx)
  const [outsideTemp, setOutsideTemp] = useState(25); // Celsius
  const [runwayCondition, setRunwayCondition] = useState<'DRY' | 'WET'>('DRY');

  // Outputs
  const [v1Speed, setV1Speed] = useState(0);
  const [vrSpeed, setVrSpeed] = useState(0);
  const [v2Speed, setV2Speed] = useState(0);
  const [climbGradient, setClimbGradient] = useState(2.8); // %
  const [balancedField, setBalancedField] = useState(2100); // meters

  useEffect(() => {
    // 1. Base Speeds calculated from Weight
    // Base V1 = 110 + (Weight - 50) * 1.1
    // Base VR = 115 + (Weight - 50) * 1.2
    // Base V2 = 120 + (Weight - 50) * 1.3
    const baseWeightFactor = aircraftWeight - 50;
    let computedV1 = 112 + baseWeightFactor * 1.15;
    let computedVr = 116 + baseWeightFactor * 1.22;
    let computedV2 = 122 + baseWeightFactor * 1.32;

    // 2. Adjust for Field Elevation (higher elevation = lower density = higher speeds)
    const elevFactor = fieldElevation / 1000 * 1.2;
    computedV1 += elevFactor;
    computedVr += elevFactor;
    computedV2 += elevFactor;

    // 3. Adjust for Outside Air Temperature (OAT)
    // High temp reduces air density and engine thrust, requiring longer run and higher speeds
    if (outsideTemp > 15) {
      const tempFactor = (outsideTemp - 15) * 0.45;
      computedV1 += tempFactor;
      computedVr += tempFactor;
      computedV2 += tempFactor;
    }

    // 4. Adjust for Runway Condition (WET runway decreases V1 to allow safe stop, while VR/V2 remain stable or adjust slightly)
    if (runwayCondition === 'WET') {
      computedV1 -= 6; // Decrease V1 decision speed under wet stop limitations
    }

    setV1Speed(Math.round(computedV1));
    setVrSpeed(Math.round(computedVr));
    setV2Speed(Math.round(computedV2));

    // 5. Calculate takeoff balanced field length
    // Base field = 1500m at 50T
    let field = 1450 + baseWeightFactor * 26;
    field += (fieldElevation / 1000) * 110;
    field += Math.max(0, outsideTemp - 15) * 22;
    if (runwayCondition === 'WET') {
      field += 250; // Wet runway increases stop distance
    }
    setBalancedField(Math.round(field));

    // 6. Second segment climb gradient (2-engine jet minimum EASA target is 2.4% net)
    // High temp and high altitude decrease climb gradient
    let grad = 3.8 - (aircraftWeight - 50) * 0.04;
    grad -= (fieldElevation / 1000) * 0.15;
    grad -= Math.max(0, outsideTemp - 15) * 0.035;
    setClimbGradient(Math.max(1.8, Number(grad.toFixed(2))));

  }, [aircraftWeight, fieldElevation, outsideTemp, runwayCondition]);

  const speedsList = [
    { label: "V1 Decision Speed", value: v1Speed, desc: "Maximum speed to reject takeoff. Adjusted down on wet runways.", color: "text-red-400 bg-red-500/10 border-red-500/25" },
    { label: "VR Rotation Speed", value: vrSpeed, desc: "Speed to initiate nose rotation at standard pitch rate (3°/sec).", color: "text-amber-400 bg-amber-500/10 border-amber-500/25" },
    { label: "V2 Safety Speed", value: v2Speed, desc: "Minimum target climb safety speed in the event of an engine failure.", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" }
  ];

  const climbSegments = [
    { name: "First Segment", range: "Gear down, landing gear retraction in progress. Ends when gear is fully retracted.", minGrad: "Positive net" },
    { name: "Second Segment", range: "Gear retracted, flaps at takeoff setting. Standard climb to 400 ft. Crucial performance sector.", minGrad: "2.4% gross (twin-jet)" },
    { name: "Third Segment", range: "Acceleration and flap retraction sector. Retracting flaps and slats while climbing to MCT.", minGrad: "Acceleration focus" },
    { name: "Fourth Segment", range: "Flaps up, maximum continuous thrust. Climb continued to final en-route altitude.", minGrad: "1.2% net gradient" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 relative overflow-hidden font-sans text-slate-100">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[90px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onChangeView(View.EGYPTAIR_DASHBOARD)}
            className="inline-flex items-center px-4 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 rounded-xl border border-white/5 transition-all text-sm active:scale-95"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Cadet Portal
          </button>
          
          <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-widest">
            <BarChart3 size={16} /> Performance & Speeds Lab
          </div>
        </div>

        {/* main layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card bg-slate-900/40 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
              
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white tracking-tight">Airport & Aircraft Data</h3>
                <p className="text-slate-400 text-xs">Adjust weights, runway parameters, and atmospheric conditions.</p>
              </div>

              <div className="border-t border-white/5 my-2"></div>

              {/* Sliders */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-300">Aircraft Takeoff Weight</span>
                    <span className="text-blue-400 font-mono">{aircraftWeight} Tons</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="80"
                    step="1"
                    value={aircraftWeight}
                    onChange={e => setAircraftWeight(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-300">Outside Air Temperature (OAT)</span>
                    <span className="text-blue-400 font-mono">{outsideTemp}°C</span>
                  </div>
                  <input
                    type="range"
                    min="-10"
                    max="45"
                    step="1"
                    value={outsideTemp}
                    onChange={e => setOutsideTemp(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-300">Airport Field Elevation</span>
                    <span className="text-blue-400 font-mono">{fieldElevation} ft</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={fieldElevation}
                    onChange={e => setFieldElevation(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>

              {/* Runway Condition buttons */}
              <div className="space-y-2 pt-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Runway Surface State</label>
                <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5">
                  <button
                    onClick={() => setRunwayCondition('DRY')}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                      runwayCondition === 'DRY' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Dry Runway
                  </button>
                  <button
                    onClick={() => setRunwayCondition('WET')}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                      runwayCondition === 'WET' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Wet Runway
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Results and Visual Track Timeline */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Speed Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {speedsList.map((speed, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border ${speed.color} flex flex-col justify-between space-y-3 shadow-md`}>
                  <div className="text-[10px] uppercase font-black tracking-wider opacity-60">{speed.label}</div>
                  <div className="text-4xl font-black font-mono">{speed.value} KT</div>
                  <div className="text-[10px] leading-normal opacity-85">{speed.desc}</div>
                </div>
              ))}
            </div>

            {/* Performance Outcomes card */}
            <div className="glass-card bg-slate-900/40 border border-white/5 rounded-3xl p-6 md:p-8 space-y-4">
              <div className="flex justify-between items-center bg-slate-950 p-6 rounded-2xl border border-white/5">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Balanced Field Length</div>
                  <div className="text-3xl font-black text-white font-mono mt-1">{balancedField} meters</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Second Segment Gradient</div>
                  <div className={`text-3xl font-black font-mono mt-1 ${climbGradient >= 2.4 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {climbGradient}% Net
                  </div>
                </div>
              </div>

              {/* Takeoff Segments Visual */}
              <div className="space-y-4 pt-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers size={16} className="text-blue-400" /> ECAA / ECAR 121 Takeoff Climb Segments
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {climbSegments.map((seg, idx) => (
                    <div key={idx} className="p-4 bg-slate-900/60 rounded-xl border border-white/5 space-y-1">
                      <div className="flex justify-between items-center text-xs font-bold text-white">
                        <span>{seg.name}</span>
                        <span className="text-[10px] text-cyan-400">{seg.minGrad}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">{seg.range}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Safety limits warning box */}
            {climbGradient < 2.4 && (
              <div className="p-5 bg-amber-500/10 border border-amber-500/20 text-amber-200 rounded-3xl flex items-center gap-4 animate-pulse">
                <ShieldAlert size={28} className="text-amber-400 shrink-0" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">Low Second Segment Climb Gradient Margin!</h4>
                  <p className="text-xs text-slate-400">
                    Calculated net gradient is below standard twin-jet gross target (2.4% gross, 1.6% net safety margins). Consider weight reductions or adjusting engine flex thrust settings prior to dispatch.
                  </p>
                </div>
              </div>
            )}

            {/* EgyptAir SOP segment overview */}
            <div className="p-6 bg-blue-950/20 border border-blue-500/20 rounded-3xl space-y-3">
              <h4 className="text-sm font-black uppercase text-blue-400 tracking-widest flex items-center gap-2">
                <Info size={16} /> Performance SOPs
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                EgyptAir performance regulations specify strict compliance with the **Second Segment Climb Gradient**. In the event of an engine failure at V1, the aircraft must maintain a minimum climb gradient of 2.4% for twin-jet fleets, gear retracted and flaps at takeoff setting, to clear obstacles safely.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default EgyptAirPerformanceCalc;
