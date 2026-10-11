import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Thermometer,
  ArrowUp,
  ArrowDown,
  Droplets,
  Gauge,
  Mountain,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  Plane,
  Info,
  TrendingUp,
  TrendingDown,
  Sliders,
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  calculatePressureAltitude,
  calculateExactPressureAltitude,
  calculateDensityAltitude,
  calculateExactDensityAltitude,
  calculateHumidAtmosphere,
  calculatePerformanceFactors,
  getISATemperature,
  getISAState,
  ISA_CONSTANTS
} from '../../lib/atmospherePhysics';

interface PresetScenario {
  id: string;
  name: string;
  airport: string;
  elevation: number;
  qnh: number;
  temperature: number;
  humidity: number;
  description: string;
}

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'sea-level-isa',
    name: 'ISA Standard Sea Level',
    airport: 'MSL Standard (15°C, 1013.25 hPa)',
    elevation: 0,
    qnh: 1013,
    temperature: 15,
    humidity: 0,
    description: 'Standard baseline conditions. Geometric, Pressure, and Density altitudes are all aligned.'
  },
  {
    id: 'aspen-summer',
    name: 'High Mountain Hot Day',
    airport: 'Aspen Pitkin / Leadville (7,820 ft)',
    elevation: 7820,
    qnh: 1008,
    temperature: 31,
    humidity: 25,
    description: 'Severe hot-and-high conditions. High elevation + low QNH + high temperature create an extreme DA divergence.'
  },
  {
    id: 'denver-mile-high',
    name: 'Mile-High Summer Heat',
    airport: 'Denver Intl (5,431 ft)',
    elevation: 5430,
    qnh: 1015,
    temperature: 36,
    humidity: 20,
    description: 'Elevated plateau in summer. Density altitude frequently exceeds 9,000 ft, severely degrading climb gradients.'
  },
  {
    id: 'innsbruck-winter',
    name: 'Alpine Valley Cold Winter',
    airport: 'Innsbruck Airport (1,900 ft)',
    elevation: 1900,
    qnh: 1032,
    temperature: -12,
    humidity: 45,
    description: 'Dense cold air and high pressure. Density altitude drops well below physical field elevation.'
  },
  {
    id: 'tropical-humid',
    name: 'Tropical Low & High Humidity',
    airport: 'Singapore / Miami (10 ft)',
    elevation: 10,
    qnh: 1002,
    temperature: 36,
    humidity: 90,
    description: 'Hot, low pressure, and saturated air. Low molecular weight of water vapor further degrades air density.'
  }
];

export const Density: React.FC = () => {
  // Input parameters
  const [elevation, setElevation] = useState<number>(5000); // ft
  const [qnh, setQnh] = useState<number>(1013); // hPa
  const [temperature, setTemperature] = useState<number>(20); // °C
  const [humidity, setHumidity] = useState<number>(30); // %
  const [barometricRate, setBarometricRate] = useState<27 | 30>(27); // 27 ft/hPa (EASA) or 30 ft/hPa (FAA)
  const [calculationMode, setCalculationMode] = useState<'ruleOfThumb' | 'exact'>('ruleOfThumb');

  // Prediction challenge state
  const [predictionHypothesis, setPredictionHypothesis] = useState<'increase' | 'decrease' | 'same' | null>(null);
  const [predictionSubmitted, setPredictionSubmitted] = useState<boolean>(false);
  const [predictionFeedbackOpen, setPredictionFeedbackOpen] = useState<boolean>(false);

  // Active tab
  const [activeTab, setActiveTab] = useState<'interactive' | 'prediction' | 'misconceptions'>('interactive');

  // Physics calculations via lib/atmospherePhysics
  const pa = calculatePressureAltitude(elevation, qnh, barometricRate);
  const daCalc = calculateDensityAltitude(pa, temperature, 120);
  const daExact = calculateExactDensityAltitude(pa, temperature);
  const humidAtm = calculateHumidAtmosphere(pa, temperature, humidity);

  // Display density altitude based on calculation mode and humidity inclusion
  const baseDA = calculationMode === 'exact' ? daExact : daCalc.densityAltitudeFt;
  const effectiveDA = Math.round(baseDA + humidAtm.humidityEffectFt);

  // ISA benchmark comparisons at pressure altitude
  const isaTempAtPA = getISATemperature(pa);
  const isaDeviation = temperature - isaTempAtPA;

  // Real atmospheric density and density ratio (sigma)
  const effectiveDensityKgM3 = humidAtm.moistDensityKgM3;
  const sigma = Math.max(0.1, effectiveDensityKgM3 / ISA_CONSTANTS.SEA_LEVEL_DENSITY_KG_M3);
  const perf = calculatePerformanceFactors(sigma);

  // Canvas ref for molecular kinetic particle simulation
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Molecular simulation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = canvas.width;
    const height = canvas.height;

    // Molecular density determines particle count
    // Scale between 40 (sparse at high DA) and 180 (dense at sea level cold)
    const baseCount = Math.round(Math.max(35, Math.min(200, (effectiveDensityKgM3 / 1.225) * 110)));
    const waterVaporCount = Math.round((humidity / 100) * (baseCount * 0.18));

    // Particle speed proportional to sqrt(T_Kelvin)
    const tempK = temperature + 273.15;
    const speedScale = 0.5 * Math.sqrt(tempK / 288.15);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      isWater: boolean;
    }

    const particles: Particle[] = [];

    // Dry air molecules (N2 / O2)
    for (let i = 0; i < baseCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.6 + Math.random() * 0.8) * speedScale;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2.2,
        isWater: false
      });
    }

    // Water vapor molecules (H2O - lighter and faster)
    for (let i = 0; i < waterVaporCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.8 + Math.random() * 1.0) * speedScale;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.8,
        isWater: true
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const step = 24;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Render molecules
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < p.radius) {
          p.x = p.radius;
          p.vx *= -1;
        } else if (p.x > width - p.radius) {
          p.x = width - p.radius;
          p.vx *= -1;
        }
        if (p.y < p.radius) {
          p.y = p.radius;
          p.vy *= -1;
        } else if (p.y > height - p.radius) {
          p.y = height - p.radius;
          p.vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        if (p.isWater) {
          ctx.fillStyle = 'rgba(168, 85, 247, 0.85)'; // Water vapor
          ctx.shadowColor = 'rgba(168, 85, 247, 0.4)';
          ctx.shadowBlur = 4;
        } else {
          ctx.fillStyle = temperature > 25 ? 'rgba(249, 115, 22, 0.85)' : 'rgba(56, 189, 248, 0.85)';
          ctx.shadowColor = temperature > 25 ? 'rgba(249, 115, 22, 0.4)' : 'rgba(56, 189, 248, 0.4)';
          ctx.shadowBlur = 3;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [effectiveDensityKgM3, temperature, humidity]);

  // Load a preset
  const handleSelectPreset = (preset: PresetScenario) => {
    setElevation(preset.elevation);
    setQnh(preset.qnh);
    setTemperature(preset.temperature);
    setHumidity(preset.humidity);
  };

  // Run +15°C Prediction Test
  const handleTestPredictionCase = () => {
    setElevation(5000);
    setQnh(1013);
    setTemperature(20); // +15°C above standard 5°C
    setHumidity(0);
    setActiveTab('interactive');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/20 rounded-2xl border border-orange-500/30 text-orange-400">
              <Thermometer size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Density Altitude Master</h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Atmospheric density, pressure datums, and aircraft performance degradation
              </p>
            </div>
          </div>
        </div>

        {/* View mode navigation */}
        <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('interactive')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'interactive'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders size={14} /> Interactive Lab
          </button>
          <button
            onClick={() => setActiveTab('prediction')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'prediction'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles size={14} /> Prediction Challenge
          </button>
          <button
            onClick={() => setActiveTab('misconceptions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'misconceptions'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle size={14} /> Misconceptions
          </button>
        </div>
      </header>

      {/* --- TAB 1: INTERACTIVE LAB --- */}
      {activeTab === 'interactive' && (
        <div className="space-y-8">
          {/* Quick Scenario Presets */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Mountain size={14} className="text-orange-400" /> Operational Scenarios & Presets
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {PRESET_SCENARIOS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-left p-3 rounded-xl border transition-all text-xs ${
                    elevation === preset.elevation && temperature === preset.temperature && qnh === preset.qnh
                      ? 'bg-orange-600/20 border-orange-500/60 text-white shadow-md'
                      : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold text-white truncate">{preset.name}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{preset.airport}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Main 2-Column Interface: Controls + Results */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Interactive Inputs */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sliders size={18} className="text-orange-400" /> Atmospheric Inputs
                </h3>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
                  <button
                    onClick={() => setBarometricRate(27)}
                    className={`px-2 py-0.5 rounded font-mono font-bold transition-all ${
                      barometricRate === 27 ? 'bg-orange-500 text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    27 ft/hPa (EASA)
                  </button>
                  <button
                    onClick={() => setBarometricRate(30)}
                    className={`px-2 py-0.5 rounded font-mono font-bold transition-all ${
                      barometricRate === 30 ? 'bg-orange-500 text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    30 ft/hPa (FAA)
                  </button>
                </div>
              </div>

              {/* Slider 1: Airfield Elevation */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Mountain size={15} className="text-emerald-400" /> Airfield Elevation
                  </span>
                  <span className="text-white font-mono text-base font-bold">
                    {elevation.toLocaleString()} <span className="text-xs text-slate-500">ft MSL</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={elevation}
                  onChange={(e) => setElevation(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                  <span>Sea Level (0 ft)</span>
                  <span>Denver (5.4k)</span>
                  <span>Leadville (10,000 ft)</span>
                </div>
              </div>

              {/* Slider 2: Altimeter Setting (QNH) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Gauge size={15} className="text-indigo-400" /> Barometric Pressure (QNH)
                  </span>
                  <span className="text-white font-mono text-base font-bold">
                    {qnh} <span className="text-xs text-slate-500">hPa</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="950"
                  max="1050"
                  step="1"
                  value={qnh}
                  onChange={(e) => setQnh(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                  <span>Deep Low (950 hPa)</span>
                  <span className="text-slate-400">ISA (1013.25)</span>
                  <span>Intense High (1050 hPa)</span>
                </div>
              </div>

              {/* Slider 3: Ambient Temperature (OAT) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Thermometer size={15} className="text-orange-400" /> Ambient Temperature (OAT)
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className={`text-base font-bold ${temperature > isaTempAtPA ? 'text-orange-400' : 'text-sky-400'}`}>
                      {temperature > 0 ? `+${temperature}` : temperature}°C
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      ISA {isaDeviation >= 0 ? `+${isaDeviation.toFixed(1)}` : isaDeviation.toFixed(1)}°C
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="50"
                  step="1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                  <span>Extreme Cold (-30°C)</span>
                  <span>ISA Standard (+15°C)</span>
                  <span>Extreme Heat (+50°C)</span>
                </div>
              </div>

              {/* Slider 4: Relative Humidity */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Droplets size={15} className="text-purple-400" /> Relative Humidity
                  </span>
                  <span className="text-purple-300 font-mono text-base font-bold">
                    {humidity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={humidity}
                  onChange={(e) => setHumidity(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                  <span>Dry Air (0%)</span>
                  <span>Average (50%)</span>
                  <span>Saturated (100%)</span>
                </div>
              </div>

              {/* Formula & Method Toggle */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Calculation Engine:</span>
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setCalculationMode('ruleOfThumb')}
                    className={`px-2.5 py-1 rounded font-bold transition-all ${
                      calculationMode === 'ruleOfThumb' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    120 ft/°C (ATPL Rule)
                  </button>
                  <button
                    onClick={() => setCalculationMode('exact')}
                    className={`px-2.5 py-1 rounded font-bold transition-all ${
                      calculationMode === 'exact' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Exact Gas Inversion
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Models (Molecular Particle Box + 3-Column Altitude Divergence) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Primary Readout Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                    <Mountain size={12} className="text-emerald-400" /> Geometric Elevation
                  </div>
                  <div className="text-2xl font-black font-mono text-white">
                    {elevation.toLocaleString()} <span className="text-xs font-semibold text-slate-600">ft</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 font-mono">Physical ground level</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                    <Gauge size={12} className="text-indigo-400" /> Pressure Altitude
                  </div>
                  <div className="text-2xl font-black font-mono text-indigo-300">
                    {Math.round(pa).toLocaleString()} <span className="text-xs font-semibold text-slate-600">ft</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 font-mono">
                    Δ {Math.round(pa - elevation) >= 0 ? `+${Math.round(pa - elevation)}` : Math.round(pa - elevation)}' (QNE 1013)
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border relative overflow-hidden ${
                  effectiveDA > 5000
                    ? 'bg-orange-950/30 border-orange-500/50'
                    : 'bg-slate-900 border-slate-800'
                }`}>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-orange-400 mb-1 flex items-center gap-1.5">
                    <Thermometer size={12} /> Density Altitude
                  </div>
                  <div className="text-3xl font-black font-mono text-orange-400">
                    {effectiveDA.toLocaleString()} <span className="text-sm font-semibold text-slate-600">ft</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    Air density: {effectiveDensityKgM3.toFixed(3)} kg/m³
                  </div>
                </div>
              </div>

              {/* Molecular Density Box & 3-Column Altitude Diagram */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Layers size={16} className="text-sky-400" /> Real-time Molecular & Datum Divergence
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Visualizing air molecular spacing alongside geometric vs pressure vs density altitude datums.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="flex items-center gap-1 text-sky-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" /> Dry Gas (N₂/O₂)
                    </span>
                    <span className="flex items-center gap-1 text-purple-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" /> Water Vapor
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Molecular Kinetic Simulation Canvas */}
                  <div className="md:col-span-6 bg-slate-950 rounded-2xl border border-slate-800 p-3 relative overflow-hidden h-64 flex flex-col justify-between">
                    <canvas
                      ref={canvasRef}
                      width={320}
                      height={200}
                      className="w-full h-full rounded-xl"
                    />
                    <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center text-[10px] font-mono text-slate-500 bg-slate-950/80 px-2 py-1 rounded backdrop-blur-sm border border-slate-800">
                      <span>Density Ratio (σ): {(sigma * 100).toFixed(1)}%</span>
                      <span>Particle Count: {Math.round(sigma * 100)}</span>
                    </div>
                  </div>

                  {/* 3-Column Visual Altitude Gauge */}
                  <div className="md:col-span-6 bg-slate-950 rounded-2xl border border-slate-800 p-4 h-64 flex flex-col justify-between relative">
                    <div className="text-[10px] font-mono text-slate-500 flex justify-between border-b border-slate-800 pb-1">
                      <span>15,000'</span>
                      <span>VERTICAL DATUM DISPLACEMENT</span>
                    </div>

                    {/* Bars Container */}
                    <div className="flex-1 flex justify-around items-end pt-3 pb-2 gap-4">
                      {/* Geometric Elevation Bar */}
                      <div className="flex-1 flex flex-col items-center h-full justify-end">
                        <div className="text-[10px] font-mono text-emerald-400 font-bold mb-1">
                          {elevation}'
                        </div>
                        <div
                          className="w-full bg-emerald-500/80 rounded-t-lg transition-all duration-300 relative group"
                          style={{ height: `${Math.min(100, Math.max(5, (elevation / 15000) * 100))}%` }}
                        >
                          <div className="absolute inset-0 bg-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity rounded-t-lg" />
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase truncate">Elevation</div>
                      </div>

                      {/* Pressure Altitude Bar */}
                      <div className="flex-1 flex flex-col items-center h-full justify-end">
                        <div className="text-[10px] font-mono text-indigo-400 font-bold mb-1">
                          {Math.round(pa)}'
                        </div>
                        <div
                          className="w-full bg-indigo-500/80 rounded-t-lg transition-all duration-300 relative group"
                          style={{ height: `${Math.min(100, Math.max(5, (pa / 15000) * 100))}%` }}
                        >
                          <div className="absolute inset-0 bg-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity rounded-t-lg" />
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase truncate">PA</div>
                      </div>

                      {/* Density Altitude Bar */}
                      <div className="flex-1 flex flex-col items-center h-full justify-end">
                        <div className="text-[10px] font-mono text-orange-400 font-bold mb-1">
                          {effectiveDA}'
                        </div>
                        <div
                          className={`w-full rounded-t-lg transition-all duration-300 relative group ${
                            effectiveDA > 7000 ? 'bg-red-500' : 'bg-orange-500'
                          }`}
                          style={{ height: `${Math.min(100, Math.max(5, (effectiveDA / 15000) * 100))}%` }}
                        >
                          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity rounded-t-lg" />
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase truncate">DA</div>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono text-slate-500 text-center border-t border-slate-800 pt-1">
                      {effectiveDA > elevation ? (
                        <span className="text-orange-400">
                          ▲ Aircraft flies as if {Math.abs(effectiveDA - elevation).toLocaleString()} ft higher than airfield
                        </span>
                      ) : (
                        <span className="text-sky-400">
                          ▼ Aircraft flies as if {Math.abs(elevation - effectiveDA).toLocaleString()} ft lower than airfield
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Aircraft Operational Performance Degradation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Takeoff Ground Roll */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Plane size={14} className="text-orange-400" /> Takeoff Ground Roll
                    </span>
                    <span className="text-white font-mono">
                      x{perf.takeoffRollMultiplier.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xl font-mono font-black text-orange-400">
                    +{Math.round((perf.takeoffRollMultiplier - 1) * 100)}%
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Longer runway distance required to achieve lift-off airspeed.
                  </div>
                </div>

                {/* Rate of Climb */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
                    <span className="flex items-center gap-1.5">
                      <TrendingDown size={14} className="text-red-400" /> Climb Rate Available
                    </span>
                    <span className="text-white font-mono">
                      {Math.round(perf.climbRateMultiplier * 100)}%
                    </span>
                  </div>
                  <div className="text-xl font-mono font-black text-red-400">
                    -{Math.round((1 - perf.climbRateMultiplier) * 100)}%
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Reduced excess thrust and propeller efficiency in thin air.
                  </div>
                </div>

                {/* True Airspeed (TAS) vs IAS */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp size={14} className="text-sky-400" /> Touchdown TAS
                    </span>
                    <span className="text-white font-mono">
                      x{perf.tasMultiplier.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xl font-mono font-black text-sky-400">
                    +{Math.round((perf.tasMultiplier - 1) * 100)}%
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    For identical 70 kt IAS, true speed over ground is much faster.
                  </div>
                </div>
              </div>

              {/* Safety Warning Banner if High DA */}
              {effectiveDA > 4000 && (
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-start gap-3">
                  <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={20} />
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-red-300">
                      Aviation Safety Warning: High Density Altitude Regime
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      At {effectiveDA.toLocaleString()} ft Density Altitude, a naturally aspirated engine loses roughly{' '}
                      <strong>{Math.round((effectiveDA / 1000) * 3)}%</strong> of its rated sea-level horsepower. Takeoff roll is extended by{' '}
                      <strong>+{Math.round((perf.takeoffRollMultiplier - 1) * 100)}%</strong>, obstacle clearance margins are severely reduced, and approach speeds over the ground will feel deceptively fast.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: ACTIVE PREDICTION CHALLENGE --- */}
      {activeTab === 'prediction' && (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-orange-500/20 text-orange-400 rounded-xl border border-orange-500/30">
                <Sparkles size={24} />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">ATPL Interactive Hypothesis Testing</span>
                <h3 className="text-2xl font-black text-white">The Mountain Airfield Temperature Jump</h3>
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 mb-6">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question:</div>
              <p className="text-lg text-slate-100 font-medium leading-relaxed">
                You are parked at a mountain airfield at an elevation of <strong>5,000 ft</strong> with a standard altimeter setting of <strong>1013 hPa</strong>. The standard ISA temperature at 5,000 ft is approximately <strong>+5°C</strong>.
              </p>
              <p className="text-lg text-amber-200 font-medium leading-relaxed">
                By mid-afternoon, solar radiation heats the runway and the outside air temperature rises by <strong>+15°C</strong> to <strong>+20°C</strong>.
                What happens to your Density Altitude?
              </p>
            </div>

            {/* Selectable Hypothesis Cards */}
            <div className="space-y-3 mb-6">
              {[
                {
                  id: 'increase',
                  label: 'Hypothesis A: Density Altitude INCREASES by approximately +1,800 ft',
                  desc: 'Warmer air expands and becomes less dense. The aircraft acts as though it is at ~6,800 ft.'
                },
                {
                  id: 'decrease',
                  label: 'Hypothesis B: Density Altitude DECREASES by approximately -1,800 ft',
                  desc: 'Hot air rises and provides thermal lifting currents, making the aircraft climb as if it were lower.'
                },
                {
                  id: 'same',
                  label: 'Hypothesis C: Density Altitude REMAINS UNCHANGED',
                  desc: 'Because the mountain airfield elevation and the barometric pressure (1013 hPa) did not change.'
                }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setPredictionHypothesis(opt.id as any);
                    setPredictionSubmitted(true);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                    predictionHypothesis === opt.id
                      ? 'bg-orange-600/20 border-orange-500 text-white shadow-lg'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-white mb-1">{opt.label}</div>
                    <div className="text-xs text-slate-400">{opt.desc}</div>
                  </div>
                  {predictionHypothesis === opt.id && (
                    <CheckCircle2 className="text-orange-400 shrink-0 mt-1" size={20} />
                  )}
                </button>
              ))}
            </div>

            {/* Explanation & Validation Feedback */}
            <AnimatePresence>
              {predictionSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-2xl border space-y-4 ${
                    predictionHypothesis === 'increase'
                      ? 'bg-emerald-950/30 border-emerald-500/50'
                      : 'bg-red-950/30 border-red-500/50'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-lg">
                    {predictionHypothesis === 'increase' ? (
                      <span className="text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 size={22} /> Correct! Density Altitude increases by exactly 1,800 ft.
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center gap-2">
                        <AlertTriangle size={22} /> Incorrect. Warm air increases Density Altitude!
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-slate-200 space-y-2 leading-relaxed font-light">
                    <p>
                      <strong>The Physics Derivation:</strong>
                      <br />
                      Under the ideal gas law: <code className="text-amber-300">ρ = P / (R · T)</code>. Heating a gas parcel at constant barometric pressure causes thermal kinetic expansion. The distance between air molecules increases, dramatically reducing air density (mass per unit volume).
                    </p>
                    <p>
                      <strong>Standard ATPL Aviation Rule of Thumb:</strong>
                      <br />
                      <code className="text-orange-300 font-mono bg-slate-900 px-2 py-0.5 rounded">
                        DA = PA + [120 × (OAT - ISA_temp)]
                      </code>
                    </p>
                    <p>
                      Here, <code className="text-slate-300">OAT - ISA_temp = +15°C</code>.
                      <br />
                      <code className="text-slate-300">ΔDA = 120 × 15 = +1,800 ft</code>.
                      <br />
                      The effective Density Altitude becomes <strong>5,000 + 1,800 = 6,800 ft</strong>!
                    </p>
                  </div>

                  <div className="pt-2 flex gap-4">
                    <button
                      onClick={handleTestPredictionCase}
                      className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg"
                    >
                      <Sliders size={16} /> Load this +15°C Test in Interactive Lab
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* --- TAB 3: AERONAUTICAL MISCONCEPTIONS --- */}
      {activeTab === 'misconceptions' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-8">
            <div>
              <h3 className="text-2xl font-black text-white flex items-center gap-3">
                <HelpCircle className="text-orange-400" /> Deep Aeronautical Misconceptions
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Common conceptual traps in EASA/FAA examinations and operational flight planning.
              </p>
            </div>

            <div className="grid gap-6">
              {/* Misconception 1 */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase">
                  <AlertTriangle size={16} /> Misconception #1: "Hot air rises, so shouldn't the airplane climb better?"
                </div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">The Reality:</div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Hot air rises relative to surrounding cold air only in localized convective thermals. When the ambient air mass at an airfield is hot, it expands in all directions. Aerodynamic lift is governed by:
                  <code className="block bg-slate-900 p-2 rounded text-orange-300 font-mono my-2">
                    L = 0.5 · ρ · V² · S · CL
                  </code>
                  Because <code className="text-orange-300 font-mono">ρ</code> (density) is lower, fewer air molecules hit the wings per second. Furthermore, aircraft engines (both reciprocating piston and gas turbine) are <strong>mass-flow air pumps</strong>. Thinner air starves the engine of oxygen, cutting brake horsepower and jet thrust while propeller blades experience less bite.
                </p>
              </div>

              {/* Misconception 2 */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase">
                  <AlertTriangle size={16} /> Misconception #2: "Density Altitude is a physical altitude I can read on an instrument."
                </div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">The Reality:</div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  No cockpit instrument directly reads Density Altitude!
                  <br />
                  A standard aneroid altimeter only measures <strong>static atmospheric pressure</strong>. When set to 1013.25 hPa, it reads <strong>Pressure Altitude</strong>. It has zero knowledge of temperature. Density Altitude is an <strong>imaginary performance index</strong> calculated by the pilot or flight computer, describing the ISA altitude whose air density matches what the aircraft is experiencing.
                </p>
              </div>

              {/* Misconception 3 */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase">
                  <AlertTriangle size={16} /> Misconception #3: "Humid air is heavier and denser than dry air."
                </div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">The Reality:</div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Pilots often associate humidity with "heavy, sticky" summer air. In physics, however, according to <strong>Avogadro’s Law</strong>, equal volumes of gases at the same temperature and pressure contain the same number of molecules:
                </p>
                <div className="grid grid-cols-2 gap-4 font-mono text-xs my-2">
                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <span className="text-sky-400 font-bold">Dry Air (N₂ + O₂):</span>
                    <br />
                    Molar Mass ≈ <strong>28.96 g/mol</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <span className="text-purple-400 font-bold">Water Vapor (H₂O):</span>
                    <br />
                    Molar Mass ≈ <strong>18.02 g/mol</strong>
                  </div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  When air becomes humid, light water vapor molecules displace heavier nitrogen and oxygen molecules in the volume. Consequently, <strong>moist air is LESS dense than dry air</strong>, raising Density Altitude by up to several hundred feet on hot, humid days!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Density;
