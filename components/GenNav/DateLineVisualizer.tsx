import React, { useState } from 'react';
import { View } from '../../types';
import { ChevronLeft, Globe, ArrowRight, AlertTriangle, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onChangeView: (view: View) => void;
}

const DateLineVisualizer: React.FC<Props> = ({ onChangeView }) => {
  // Flight parameters
  const [direction, setDirection] = useState<'WESTBOUND' | 'EASTBOUND'>('WESTBOUND');
  const [currentDate, setCurrentDate] = useState('2026-06-02');
  const [currentHour, setCurrentHour] = useState(10);
  const [currentMin, setCurrentMin] = useState(0);

  // 180° longitude crossing calculations
  // Westbound: East Longitude (e.g., UTC+12) to West Longitude (e.g., UTC-12)
  // When flying WESTBOUND across the IDL, we cross from West Hemisphere to East Hemisphere? 
  // Wait!
  // Longitude ranges: 0° to 180° E, and 0° to 180° W.
  // Traveling West means going towards the West, so:
  // - 179° E (UTC+12) -> cross IDL -> 179° W (UTC-12).
  // - Since we are moving Westbound, we enter the Western hemisphere. Local time offset drops from +12 to -12 (subtract 24 hours offset).
  // - To maintain the exact same physical moment, as the timezone shifts by -24 hours, the local DATE must ADVANCE by 1 day! 
  // Wait, let's verify:
  // Physical time UTC is constant.
  // At 179°E: LMT = UTC + 12 hrs.
  // At 179°W: LMT = UTC - 12 hrs.
  // Difference in LMT: 179°W LMT is 24 hours BEHIND 179°E LMT.
  // So:
  // - If we cross from East to West (Westbound flight: e.g. from Tokyo to San Francisco, crossing 180° from East to West):
  //   Wait, Tokyo is East, SF is West. Flying Tokyo to SF means flying EASTBOUND across the Pacific!
  //   Yes! Flying Eastbound (crosses from East Longitude to West Longitude):
  //   You gain time! Date goes BACK one day (subtract a day).
  //   Flying Westbound (crosses from West Longitude to East Longitude, e.g. SF to Tokyo):
  //   You lose time! Date goes FORWARD one day (add a day).
  // EASA standard rules:
  // - Crossing Westbound (from West Longitude to East Longitude, i.e., heading West):
  //   Date is ADVANCED by 1 day.
  // - Crossing Eastbound (from East Longitude to West Longitude, i.e., heading East):
  //   Date is RETARDED by 1 day.

  // Let's set up the crossing values:
  const getCrossingResults = () => {
    const baseDate = new Date(currentDate);
    const resultDate = new Date(baseDate);

    if (direction === 'WESTBOUND') {
      // heading West (West to East longitude): Date + 1
      resultDate.setDate(baseDate.getDate() + 1);
      return {
        fromLong: '175° W',
        toLong: '175° E',
        fromOffset: 'UTC-12',
        toOffset: 'UTC+12',
        resultDate: resultDate.toISOString().split('T')[0],
        advancement: '+1 Day (Advance)',
        ruleText: 'Flying Westbound across the IDL, the local date is ADVANCED by 1 day.'
      };
    } else {
      // heading East (East to West longitude): Date - 1
      resultDate.setDate(baseDate.getDate() - 1);
      return {
        fromLong: '175° E',
        toLong: '175° W',
        fromOffset: 'UTC+12',
        toOffset: 'UTC-12',
        resultDate: resultDate.toISOString().split('T')[0],
        advancement: '-1 Day (Retard)',
        ruleText: 'Flying Eastbound across the IDL, the local date is RETARDED by 1 day.'
      };
    }
  };

  const results = getCrossingResults();

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
      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-cyan-500/20 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="p-4 bg-cyan-500/20 rounded-2xl text-cyan-400">
            <Globe size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">International Date Line Simulator</h1>
        </div>
        <p className="text-slate-300 text-lg max-w-2xl leading-relaxed relative z-10">
          Visualise time and date transitions when crossing the International Date Line (180° meridian). Understand EASA standard calendar adjustment rules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Flight Configuration (5/12) */}
        <div className="lg:col-span-5 bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 space-y-6">
          <h3 className="text-xl font-bold text-white border-b border-white/5 pb-3">Flight Planner</h3>

          {/* Direction */}
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 font-bold block">FLIGHT HEADING DIRECTION</label>
            <div className="flex bg-slate-950 p-1 rounded-xl">
              <button 
                onClick={() => setDirection('WESTBOUND')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${direction === 'WESTBOUND' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Westbound (heading West)
              </button>
              <button 
                onClick={() => setDirection('EASTBOUND')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${direction === 'EASTBOUND' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Eastbound (heading East)
              </button>
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 font-bold block">INITIAL LOCAL DATE</label>
            <input 
              type="date" 
              value={currentDate} 
              onChange={e => setCurrentDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none" 
            />
          </div>

          {/* Start Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-500 font-bold block mb-1">LOCAL HOUR</label>
              <input 
                type="number" 
                min="0"
                max="23"
                value={currentHour} 
                onChange={e => setCurrentHour(Math.min(23, Math.max(0, Number(e.target.value))))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white font-mono text-sm focus:outline-none" 
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-bold block mb-1">LOCAL MINUTE</label>
              <input 
                type="number" 
                min="0"
                max="59"
                value={currentMin} 
                onChange={e => setCurrentMin(Math.min(59, Math.max(0, Number(e.target.value))))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white font-mono text-sm focus:outline-none" 
              />
            </div>
          </div>
        </div>

        {/* Right Column: Visual Crossing & Results (7/12) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Crossing Visualizer Panel */}
          <div className="bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 space-y-8">
            <h3 className="text-xl font-bold text-white mb-4">180° Meridian Crossing Visual</h3>

            <div className="flex items-center justify-between bg-slate-950/60 p-6 rounded-2xl border border-white/5 relative overflow-hidden">
              {/* Vertical IDL line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-dashed bg-cyan-500/30 flex flex-col justify-center items-center">
                <span className="text-[9px] text-cyan-400/80 font-mono tracking-widest uppercase rotate-90 origin-center whitespace-nowrap">180° IDL Line</span>
              </div>

              {/* Departure Side */}
              <div className="z-10 text-center space-y-2">
                <span className="text-[10px] text-slate-500 font-bold block">BEFORE CROSSING</span>
                <span className="text-lg font-black text-white font-mono block">{results.fromLong}</span>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-white/5 font-mono text-xs">
                  <span className="text-[10px] text-slate-500 block">LOCAL DATE</span>
                  <span className="text-white font-bold">{currentDate}</span>
                </div>
              </div>

              {/* Crossing arrow animation */}
              <div className="z-10 bg-cyan-500/20 text-cyan-400 p-3 rounded-full border border-cyan-500/30">
                <ArrowRight className={`w-6 h-6 ${direction === 'WESTBOUND' ? '' : 'rotate-180'}`} />
              </div>

              {/* Arrival Side */}
              <div className="z-10 text-center space-y-2">
                <span className="text-[10px] text-slate-500 font-bold block">AFTER CROSSING</span>
                <span className="text-lg font-black text-white font-mono block">{results.toLong}</span>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-cyan-500/30 font-mono text-xs shadow-lg shadow-cyan-900/10">
                  <span className="text-[10px] text-cyan-400 block font-bold">REVISED DATE</span>
                  <span className="text-cyan-300 font-black">{results.resultDate}</span>
                </div>
              </div>
            </div>

            {/* Safety advisory */}
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-start gap-3">
              <Calendar className="text-cyan-400 w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs text-cyan-200 leading-relaxed">
                <strong>EASA Operational Mnemonic:</strong> {results.ruleText}
                <div className="font-bold text-white mt-1">
                  Time of Day: {String(currentHour).padStart(2, '0')}:{String(currentMin).padStart(2, '0')} (remains identical, only the calendar day jumps!).
                </div>
              </div>
            </div>
          </div>

          {/* EASA Exam Context */}
          <div className="bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-white/5 space-y-4">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">EASA Navigation Exam Context</h4>
            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex gap-3">
                <div className="p-2 bg-slate-950 rounded-lg text-cyan-400 font-bold h-max font-mono">01</div>
                <div>
                  <strong>UTC Consistency:</strong> Flying across the IDL changes your LMT and calendar date, but your **UTC time and date remain completely unchanged**. 
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 bg-slate-950 rounded-lg text-cyan-400 font-bold h-max font-mono">02</div>
                <div>
                  <strong>Mnemonic for crossing Westward:</strong> Going Westward (into East Longitudes) means we are heading towards the sun's rising direction relative to timezone boundaries. Thus, we jump into the next calendar day.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateLineVisualizer;
