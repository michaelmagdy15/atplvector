import React, { useState, useEffect } from 'react';
import { View } from '../../types';
import { 
  ArrowLeft, Navigation, Compass, ShieldAlert, Sliders, Info, ShieldCheck, Sun
} from 'lucide-react';

interface Props {
  onChangeView: (view: View) => void;
}

export const EgyptAirNavSimulator: React.FC<Props> = ({ onChangeView }) => {
  const [activeTab, setActiveTab] = useState<'DME_ARC' | 'HOLDING' | 'VISUAL_SEG' | 'GPS_SPOOF'>('DME_ARC');

  // --- DME Arc State ---
  const [groundSpeed, setGroundSpeed] = useState(150); // knots
  const [arcRadius, setArcRadius] = useState(12); // NM
  const [selectedLeadRadial, setSelectedLeadRadial] = useState(0); // degrees
  const [turnDirection, setTurnDirection] = useState<'LEFT' | 'RIGHT'>('LEFT');
  const [calculatedLeadRadial, setCalculatedLeadRadial] = useState(0);
  const [leadDistance, setLeadDistance] = useState(0);

  // --- Holding Entry State ---
  const [inboundHeading, setInboundHeading] = useState(90); // degrees (avoid 090 octal)
  const [radialOutbound, setRadialOutbound] = useState(270); // degrees
  const [isStandard, setIsStandard] = useState(true); // standard = right turns
  const [entrySector, setEntrySector] = useState<'DIRECT' | 'PARALLEL' | 'TEARDROP'>('DIRECT');

  // --- Visual Segment State ---
  const [rvrValue, setRvrValue] = useState(550); // meters
  const [dhHeight, setDhHeight] = useState(200); // feet
  const [glideslopeAngle, setGlideslopeAngle] = useState(3.0); // degrees
  const [visualSegment, setVisualSegment] = useState(0); // meters
  const [visibleLights, setVisibleLights] = useState(0); // number of lights (30m spacing)

  // --- GPS Spoofing State ---
  const [isSpoofed, setIsSpoofed] = useState(false);
  const [navBackupMode, setNavBackupMode] = useState<'IRS' | 'VOR_DME' | 'FMS_DR'>('VOR_DME');
  const [anpAccuracy, setAnpAccuracy] = useState(0.04); // NM

  // --- DME Arc calculations ---
  useEffect(() => {
    // 1. Turn radius = (TAS / 200) for standard 3 degree/sec rate, simplified as (Groundspeed / 200)
    // Turn Radius (R) in NM = (GS / 60) * 1.5% or GS / 200 approx
    const radiusOfTurn = groundSpeed / 200; 
    setLeadDistance(radiusOfTurn);

    // 2. Lead Radial in degrees = (60 / Arc Radius) * Turn Radius
    const leadDegrees = Math.round((60 / arcRadius) * radiusOfTurn);
    setCalculatedLeadRadial(leadDegrees);
  }, [groundSpeed, arcRadius]);

  // --- Holding Sector calculation ---
  useEffect(() => {
    // We calculate holding entry based on aircraft inbound heading relative to holding outbound radial
    // Difference = Heading - Outbound Radial
    let diff = (inboundHeading - radialOutbound + 360) % 360;
    
    // For Standard Hold (Right turns):
    // Parallel: Outbound radial to Outbound radial + 110 deg
    // Teardrop: Outbound radial - 70 deg to Outbound radial
    // Direct: Everything else (180 deg)
    if (isStandard) {
      if (diff >= 0 && diff <= 110) {
        setEntrySector('PARALLEL');
      } else if (diff >= 290 && diff < 360) {
        setEntrySector('TEARDROP');
      } else {
        setEntrySector('DIRECT');
      }
    } else {
      // Non-Standard Hold (Left turns):
      // Parallel: Outbound radial - 110 deg to Outbound radial
      // Teardrop: Outbound radial to Outbound radial + 70 deg
      // Direct: Everything else
      if (diff >= 250 && diff < 360) {
        setEntrySector('PARALLEL');
      } else if (diff > 0 && diff <= 70) {
        setEntrySector('TEARDROP');
      } else {
        setEntrySector('DIRECT');
      }
    }
  }, [inboundHeading, radialOutbound, isStandard]);

  // --- Visual Segment calculations ---
  useEffect(() => {
    // Visual Segment S = RVR - (DH / tan(Glideslope))
    // Glideslope in radians
    const gsRad = (glideslopeAngle * Math.PI) / 180;
    // DH converted to meters (1 ft = 0.3048 m)
    const dhMeters = dhHeight * 0.3048;
    const cutOffDist = dhMeters / Math.tan(gsRad);
    
    const segment = Math.max(0, Math.round(rvrValue - cutOffDist));
    setVisualSegment(segment);

    // Visible lights (assuming standard 30m spacing of approach lighting systems)
    const lights = Math.max(0, Math.floor(segment / 30));
    setVisibleLights(lights);
  }, [rvrValue, dhHeight, glideslopeAngle]);

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 relative overflow-hidden font-sans text-slate-100">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* Navigation Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button 
            onClick={() => onChangeView(View.EGYPTAIR_DASHBOARD)}
            className="inline-flex items-center px-4 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 rounded-xl border border-white/5 transition-all text-sm active:scale-95"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Cadet Portal
          </button>
          
          {/* Navigation sub-tabs */}
          <div className="flex flex-wrap bg-slate-900 border border-white/5 p-1 rounded-xl">
            {[
              { id: 'DME_ARC', label: 'DME Arc Lab' },
              { id: 'HOLDING', label: 'Holding Entries' },
              { id: 'VISUAL_SEG', label: 'Visual Runway' },
              { id: 'GPS_SPOOF', label: 'FMC Spoofing' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === tab.id ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- DME Arc Simulator --- */}
        {activeTab === 'DME_ARC' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-card bg-slate-900/40 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
                
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white tracking-tight">DME Arc Controls</h3>
                  <p className="text-slate-400 text-xs">Simulate radial intercept dynamics.</p>
                </div>

                <div className="border-t border-white/5 my-2"></div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-300">Ground Speed</span>
                      <span className="text-blue-400 font-mono">{groundSpeed} Knots</span>
                    </div>
                    <input
                      type="range"
                      min="120"
                      max="280"
                      step="10"
                      value={groundSpeed}
                      onChange={e => setGroundSpeed(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-300">DME Arc Radius</span>
                      <span className="text-blue-400 font-mono">{arcRadius} NM</span>
                    </div>
                    <input
                      type="range"
                      min="6"
                      max="20"
                      step="1"
                      value={arcRadius}
                      onChange={e => setArcRadius(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>

                <div className="p-5 bg-slate-950 rounded-2xl border border-white/5 space-y-3">
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Calculated Lead Values</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-slate-400 text-xs">Turn Radius</div>
                      <div className="text-white font-black text-lg font-mono">{leadDistance.toFixed(2)} NM</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-xs">Lead Radial Offset</div>
                      <div className="text-white font-black text-lg font-mono">{calculatedLeadRadial}°</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="glass-card bg-slate-900/40 border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center relative min-h-[350px]">
                {/* Visual Circle Representation */}
                <div className="w-64 h-64 rounded-full border-2 border-slate-800 border-dashed flex items-center justify-center relative">
                  {/* Arc Path */}
                  <div className="absolute inset-4 rounded-full border border-blue-500/30"></div>
                  
                  {/* Station in the center */}
                  <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center text-white text-[9px] font-black shadow-lg shadow-blue-500/20">VOR</div>
                  
                  {/* Radial Lines */}
                  <div className="absolute w-full h-[1px] bg-slate-800" style={{ transform: 'rotate(0deg)' }}></div>
                  <div className="absolute w-full h-[1px] bg-slate-800" style={{ transform: 'rotate(45deg)' }}></div>
                  <div className="absolute w-full h-[1px] bg-slate-800" style={{ transform: 'rotate(90deg)' }}></div>
                  
                  {/* Airplane positioning on intercept */}
                  <div className="absolute top-0 translate-y-[-12px] flex flex-col items-center gap-1">
                    <Compass className="w-6 h-6 text-cyan-400 animate-pulse" />
                    <span className="text-[8px] bg-black/60 px-1 text-white font-bold rounded">Active Intercept</span>
                  </div>
                </div>

                <div className="text-center space-y-2 mt-6">
                  <h4 className="text-white font-bold text-sm">Lead radial rule: Begin turn {calculatedLeadRadial}° prior to target radial.</h4>
                  <p className="text-xs text-slate-400 max-w-md">Formula applied: Lead angle = (60 / Arc Radius) * Turn Radius. Ensures a smooth tangent intercept onto the arc without overshoot.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Holding Entries Tab --- */}
        {activeTab === 'HOLDING' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-card bg-slate-900/40 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
                
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white tracking-tight">Holding Pattern Parameters</h3>
                  <p className="text-slate-400 text-xs">Compute entry sectors dynamically.</p>
                </div>

                <div className="border-t border-white/5 my-2"></div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-300">Aircraft Inbound Heading</span>
                      <span className="text-blue-400 font-mono">{inboundHeading}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="359"
                      step="5"
                      value={inboundHeading}
                      onChange={e => setInboundHeading(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-300">Holding Outbound Radial</span>
                      <span className="text-blue-400 font-mono">{radialOutbound}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="359"
                      step="5"
                      value={radialOutbound}
                      onChange={e => setRadialOutbound(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Turn Direction</label>
                  <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5">
                    <button
                      onClick={() => setIsStandard(true)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                        isStandard ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Standard (Right)
                    </button>
                    <button
                      onClick={() => setIsStandard(false)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                        !isStandard ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Non-Standard (Left)
                    </button>
                  </div>
                </div>

              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="glass-card bg-slate-900/40 border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[350px]">
                
                {/* Sector Visual Indicator */}
                <div className="flex gap-4">
                  {[
                    { id: 'DIRECT', label: 'Direct Entry', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
                    { id: 'PARALLEL', label: 'Parallel Entry', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
                    { id: 'TEARDROP', label: 'Teardrop Entry', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
                  ].map(sec => (
                    <div 
                      key={sec.id} 
                      className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all ${
                        entrySector === sec.id ? `${sec.color} scale-105 ring-2 ring-blue-500/20` : 'opacity-30 border-white/5 bg-slate-900/50 text-slate-500'
                      }`}
                    >
                      {sec.label}
                    </div>
                  ))}
                </div>

                {/* Hold diagram */}
                <div className="w-72 h-44 border border-slate-800 rounded-3xl relative mt-8 flex items-center justify-center">
                  <div className="absolute left-6 w-32 h-24 border-2 border-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-500">Fix Point</span>
                  </div>
                  <div className="absolute right-6 w-32 h-24 border-2 border-slate-800 border-dashed rounded-full flex items-center justify-center">
                    <span className="text-[9px] font-bold text-slate-600">Outbound Leg</span>
                  </div>
                </div>

                <div className="text-center space-y-2 mt-6">
                  <h4 className="text-white font-bold text-sm">Recommended Entry Sector: <span className="text-blue-400">{entrySector}</span></h4>
                  <p className="text-xs text-slate-400 max-w-md">Computed based on sector boundaries relative to holding fix inbound radial. Left vs right turns shift the entry criteria zones accordingly.</p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* --- Visual Runway Tab --- */}
        {activeTab === 'VISUAL_SEG' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-card bg-slate-900/40 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
                
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white tracking-tight">Runway Visibility Calculator</h3>
                  <p className="text-slate-400 text-xs">Simulate decision height vs visual segment length.</p>
                </div>

                <div className="border-t border-white/5 my-2"></div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-300">Runway Visual Range (RVR)</span>
                      <span className="text-blue-400 font-mono">{rvrValue} Meters</span>
                    </div>
                    <input
                      type="range"
                      min="200"
                      max="1500"
                      step="50"
                      value={rvrValue}
                      onChange={e => setRvrValue(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-300">Decision Height (DH)</span>
                      <span className="text-blue-400 font-mono">{dhHeight} feet</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="400"
                      step="25"
                      value={dhHeight}
                      onChange={e => setDhHeight(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>

              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="glass-card bg-slate-900/40 border border-white/5 rounded-3xl p-8 flex flex-col justify-between min-h-[350px]">
                
                <div className="flex justify-between items-center bg-slate-950 p-6 rounded-2xl border border-white/5">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Visual Runway Segment</div>
                    <div className="text-3xl font-black text-white font-mono mt-1">{visualSegment} meters</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Visible Approach Lights</div>
                    <div className="text-3xl font-black text-blue-400 font-mono mt-1">{visibleLights} lights</div>
                  </div>
                </div>

                {/* Visual fog representation */}
                <div className="w-full h-24 bg-slate-950 rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center">
                  {/* Fog overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/10 via-slate-900/60 to-slate-950 z-10" style={{ opacity: `${(1500 - rvrValue) / 1300}` }}></div>
                  
                  {/* Approach Lights */}
                  <div className="flex gap-4 relative z-0">
                    {Array.from({ length: 8 }).map((_, idx) => (
                      <span 
                        key={idx} 
                        className={`w-3.5 h-3.5 rounded-full shadow-lg ${
                          idx < visibleLights ? 'bg-amber-400 animate-pulse shadow-amber-500/50' : 'bg-slate-800'
                        }`}
                      ></span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-400 text-center leading-normal">
                  Calculation base: Visual segment = RVR - (DH / tan(GS)). Assumes cockpit cut-off angle limits is matched. Enables first officer visual confirmations at minimums.
                </p>

              </div>
            </div>
          </div>
        )}

        {/* --- GPS Spoofing Tab --- */}
        {activeTab === 'GPS_SPOOF' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-card bg-slate-900/40 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
                
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white tracking-tight">GPS Spoofing Safeguards</h3>
                  <p className="text-slate-400 text-xs">Simulate backup VOR/IRS integrity verification.</p>
                </div>

                <div className="border-t border-white/5 my-2"></div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">FMC Position Status</label>
                    <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5">
                      <button
                        onClick={() => { setIsSpoofed(false); setAnpAccuracy(0.04); }}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                          !isSpoofed ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Normal GPS
                      </button>
                      <button
                        onClick={() => { setIsSpoofed(true); setAnpAccuracy(0.85); }}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                          isSpoofed ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        GPS Spoofed!
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Active Navigation Backup</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'IRS', label: 'IRS Drift' },
                        { id: 'VOR_DME', label: 'VOR/DME' },
                        { id: 'FMS_DR', label: 'Dead Reck' }
                      ].map(back => (
                        <button
                          key={back.id}
                          onClick={() => setNavBackupMode(back.id as any)}
                          className={`py-3 px-2 rounded-xl text-[10px] font-bold border transition-all text-center ${
                            navBackupMode === back.id 
                              ? 'bg-blue-600 border-blue-500 text-white' 
                              : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          {back.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="glass-card bg-slate-900/40 border border-white/5 rounded-3xl p-8 flex flex-col justify-between min-h-[350px]">
                
                <div className="flex justify-between items-center bg-slate-950 p-6 rounded-2xl border border-white/5">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Actual Nav Performance (ANP)</div>
                    <div className={`text-3xl font-black font-mono mt-1 ${isSpoofed ? 'text-red-400' : 'text-emerald-400'}`}>
                      {anpAccuracy} NM
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest">FMC Crosscheck Integrity</div>
                    <div className="text-3xl font-black text-blue-400 font-mono mt-1">
                      {isSpoofed ? 'UNRELIABLE' : 'VERIFIED'}
                    </div>
                  </div>
                </div>

                {/* Status indicator box */}
                <div className={`p-5 rounded-2xl border flex items-center gap-4 ${
                  isSpoofed 
                    ? 'bg-red-500/10 border-red-500/20 text-red-200' 
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                }`}>
                  <div className="shrink-0">
                    {isSpoofed ? <ShieldAlert size={28} className="text-red-400" /> : <ShieldCheck size={28} className="text-emerald-400" />}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm">{isSpoofed ? 'GPS Jamming/Spoofing Detected!' : 'GPS Navigation Validated'}</h4>
                    <p className="text-xs text-slate-400">
                      {isSpoofed 
                        ? `FMC is utilizing backup VOR/DME crosschecks (Backup Mode: ${navBackupMode}). Pilot action: Cross-reference dual VOR bearings and cross-check IRS coordinate drift.`
                        : 'Actual Navigation Performance matches the Required Navigation Performance (RNP). GPS signal integrity is verified by triple IRS voting systems.'
                      }
                    </p>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 leading-relaxed">
                  EgyptAir ABC Chapter 11 guideline: Under GPS jamming, verify position using raw-data conventional navigation (VOR, NDB, DME) and report discrepancies to Cairo FIR ATC immediately.
                </p>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default EgyptAirNavSimulator;
