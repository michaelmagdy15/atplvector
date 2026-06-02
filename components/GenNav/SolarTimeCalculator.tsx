import React, { useState, useEffect, useRef } from 'react';
import { View } from '../../types';
import { ChevronLeft, Sun, Clock, Compass, Info, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onChangeView: (view: View) => void;
}

const SolarTimeCalculator: React.FC<Props> = ({ onChangeView }) => {
  // Inputs
  const [utcHour, setUtcHour] = useState(12); // UTC hours (0-23)
  const [utcMin, setUtcMin] = useState(0); // UTC minutes (0-59)
  const [longitude, setLongitude] = useState(15); // degrees (-180 to +180)
  const [latitude, setLatitude] = useState(51.5); // degrees (-90 to +90)
  const [dayOfYear, setDayOfYear] = useState(172); // ~June 21
  const [altitude, setAltitude] = useState(0); // ft

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 1. Calculate LMT (Local Mean Time)
  // LMT = UTC +/- (Longitude / 15) hours
  // 1 degree = 4 minutes
  const totalUtcMinutes = utcHour * 60 + utcMin;
  const longitudeOffsetMinutes = longitude * 4;
  let totalLmtMinutes = (totalUtcMinutes + longitudeOffsetMinutes + 1440) % 1440;
  
  const lmtHour = Math.floor(totalLmtMinutes / 60);
  const lmtMin = Math.round(totalLmtMinutes % 60);

  // 2. Solar declination
  const declination = -23.44 * Math.cos((2 * Math.PI * (dayOfYear + 10)) / 365);

  // 3. Sunrise/Sunset/Civil Twilight Calculations
  // cos(H) = -tan(Lat) * tan(Dec)
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;

  const latRad = toRad(latitude);
  const decRad = toRad(declination);

  // Altitude correction for sunset: depression angle = 0.98 * sqrt(alt_ft) / 60 degrees + refraction
  // Approximate standard dip correction: dip_deg = 0.0293 * sqrt(altitude)
  const dipDeg = 0.0293 * Math.sqrt(altitude);
  const sunsetDepressionRad = toRad(90.833 + dipDeg); // 90 deg + 50' refraction/semi-diameter + dip

  // cos(H) = (cos(sunsetDepression) - sin(Lat)*sin(Dec)) / (cos(Lat)*cos(Dec))
  const cosH_sunset = (Math.cos(sunsetDepressionRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));

  let dayLengthHours = 0;
  let sunriseLmtDec = 0;
  let sunsetLmtDec = 0;
  let polarState: 'NORMAL' | 'POLAR_DAY' | 'POLAR_NIGHT' = 'NORMAL';

  if (cosH_sunset >= 1) {
    polarState = 'POLAR_NIGHT';
    dayLengthHours = 0;
  } else if (cosH_sunset <= -1) {
    polarState = 'POLAR_DAY';
    dayLengthHours = 24;
  } else {
    const H_sunset = Math.acos(cosH_sunset);
    dayLengthHours = (toDeg(H_sunset) * 2) / 15;
    sunriseLmtDec = 12 - toDeg(H_sunset) / 15;
    sunsetLmtDec = 12 + toDeg(H_sunset) / 15;
  }

  // Civil Twilight (sun is 6 degrees below astronomical horizon)
  const civilTwilightDepRad = toRad(96 + dipDeg);
  const cosH_civil = (Math.cos(civilTwilightDepRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
  let civilTwilightStartDec = 0;
  let civilTwilightEndDec = 0;

  if (cosH_civil < 1 && cosH_civil > -1) {
    const H_civil = Math.acos(cosH_civil);
    civilTwilightStartDec = 12 - toDeg(H_civil) / 15;
    civilTwilightEndDec = 12 + toDeg(H_civil) / 15;
  }

  const formatDecimalTime = (decTime: number) => {
    if (polarState === 'POLAR_NIGHT') return 'N/A';
    if (polarState === 'POLAR_DAY') return 'Midnight Sun';
    const h = Math.floor(decTime);
    const m = Math.round((decTime % 1) * 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const getMonth = (d: number) => {
    const date = new Date(2023, 0, d);
    return date.toLocaleString('default', { month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const radius = 70;

    // Earth drawing
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(toRad(-declination));

    // Night side
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, 0, radius, Math.PI / 2, Math.PI * 3 / 2);
    ctx.fill();

    // Daylit side
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(0, 0, radius, -Math.PI / 2, Math.PI / 2);
    ctx.fill();

    // Axis
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, -radius - 15);
    ctx.lineTo(0, radius + 15);
    ctx.stroke();
    ctx.setLineDash([]);

    // Lat line
    const latY = -radius * Math.sin(toRad(latitude));
    const latW = radius * Math.cos(toRad(latitude));
    ctx.strokeStyle = '#f472b6'; // Pink latitude
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-latW, latY);
    ctx.lineTo(latW, latY);
    ctx.stroke();

    ctx.restore();

    // Sun Rays
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    for (let rY = -40; rY <= 40; rY += 20) {
      ctx.beginPath();
      ctx.moveTo(w - 20, cy + rY);
      ctx.lineTo(cx + radius + 10, cy + rY);
      ctx.stroke();
    }
  }, [declination, latitude]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-700">
      {/* Back Button */}
      <button 
        onClick={() => onChangeView(View.GEN_NAV_HOME)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Subject Dashboard
      </button>

      {/* Header */}
      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-yellow-500/20 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="p-4 bg-yellow-500/20 rounded-2xl text-yellow-400">
            <Sun size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Solar Time & twilight Calculator</h1>
        </div>
        <p className="text-slate-300 text-lg max-w-2xl leading-relaxed relative z-10">
          Master LMT to UTC time conversions. Calculate EASA civil twilights, standard offsets, and understand the impact of flight altitude on sunset times.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Controls (5/12) */}
        <div className="lg:col-span-5 bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 space-y-6">
          <h3 className="text-xl font-bold text-white border-b border-white/5 pb-3">Time & Date Controls</h3>

          {/* UTC Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">UTC HOUR</label>
              <input 
                type="number" 
                min="0"
                max="23"
                value={utcHour} 
                onChange={e => setUtcHour(Math.min(23, Math.max(0, Number(e.target.value))))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white font-mono text-sm focus:outline-none" 
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">UTC MINUTE</label>
              <input 
                type="number" 
                min="0"
                max="59"
                value={utcMin} 
                onChange={e => setUtcMin(Math.min(59, Math.max(0, Number(e.target.value))))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white font-mono text-sm focus:outline-none" 
              />
            </div>
          </div>

          {/* Longitude */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>LONGITUDE</span>
              <span className="text-white font-bold">{Math.abs(longitude)}° {longitude >= 0 ? 'E' : 'W'}</span>
            </div>
            <input 
              type="range" 
              min="-180" 
              max="180" 
              value={longitude} 
              onChange={e => setLongitude(Number(e.target.value))} 
              className="w-full accent-yellow-500" 
            />
          </div>

          {/* Latitude */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>LATITUDE</span>
              <span className="text-white font-bold">{Math.abs(latitude)}° {latitude >= 0 ? 'N' : 'S'}</span>
            </div>
            <input 
              type="range" 
              min="-90" 
              max="90" 
              value={latitude} 
              onChange={e => setLatitude(Number(e.target.value))} 
              className="w-full accent-yellow-500" 
            />
          </div>

          {/* Date */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>DATE</span>
              <span className="text-white font-bold">{getMonth(dayOfYear)}</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="365" 
              value={dayOfYear} 
              onChange={e => setDayOfYear(Number(e.target.value))} 
              className="w-full accent-yellow-500" 
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>Equinox</span>
              <span>Solstice (N)</span>
              <span>Equinox</span>
              <span>Solstice (S)</span>
            </div>
          </div>

          {/* Altitude */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>FLIGHT ALTITUDE</span>
              <span className="text-white font-bold">{altitude} ft</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="45000" 
              step="1000"
              value={altitude} 
              onChange={e => setAltitude(Number(e.target.value))} 
              className="w-full accent-yellow-500" 
            />
          </div>
        </div>

        {/* Right Column: Visualizer & EASA Calculations (7/12) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Visual Canvas Earth */}
          <div className="bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 flex flex-col items-center">
            <canvas 
              ref={canvasRef} 
              width={260} 
              height={200} 
              className="bg-slate-950 rounded-full border border-slate-800 shadow-inner" 
            />
            <div className="flex gap-4 mt-4 text-[10px] font-bold text-center text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#f472b6] rounded-full"></span> Selected Latitude</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#38bdf8] rounded-full"></span> Lit (Day)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#1e293b] rounded-full"></span> Dark (Night)</span>
            </div>
          </div>

          {/* Live Computations */}
          <div className="bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 space-y-4">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="text-yellow-400" />
              LMT vs Solar Calculations
            </h3>

            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5">
                <span className="text-slate-500 block text-[10px]">LOCAL MEAN TIME (LMT)</span>
                <span className="text-lg font-bold text-white">
                  {String(lmtHour).padStart(2, '0')}:{String(lmtMin).padStart(2, '0')} LMT
                </span>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5">
                <span className="text-slate-500 block text-[10px]">DAYLIGHT DURATION</span>
                <span className="text-lg font-bold text-yellow-400">
                  {Math.floor(dayLengthHours)}h {Math.round((dayLengthHours % 1) * 60)}m
                </span>
              </div>
            </div>

            {/* Sunrise / Sunset times */}
            <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Civil Twilight Starts (LMT):</span>
                <span className="text-white font-mono font-bold">{formatDecimalTime(civilTwilightStartDec)}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2 text-yellow-400 font-bold">
                <span>Sunrise (LMT):</span>
                <span className="font-mono">{formatDecimalTime(sunriseLmtDec)}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2 text-orange-400 font-bold">
                <span>Sunset (LMT):</span>
                <span className="font-mono">{formatDecimalTime(sunsetLmtDec)}</span>
              </div>
              <div className="flex justify-between">
                <span>Civil Twilight Ends (LMT):</span>
                <span className="text-white font-mono font-bold">{formatDecimalTime(civilTwilightEndDec)}</span>
              </div>
            </div>

            {/* Altitude Effect Note */}
            {altitude > 0 && (
              <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-xl flex items-start gap-2.5 text-xs text-cyan-200">
                <Info size={16} className="shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Altitude Dip Effect:</strong> Flying at {altitude} ft depresses your local horizon by **{dipDeg.toFixed(2)}°**. Consequently, sunrise is earlier and sunset is delayed, extending daylight by **{Math.round((dayLengthHours - (dayLengthHours / (1 + dipDeg/180))) * 60)} minutes** relative to ground level.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarTimeCalculator;
