import React from 'react';
import { View } from '../../types';
import { ChevronLeft, Compass, Droplets, FormInput, LineChart, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onChangeView: (view: View) => void;
  onOpenSyllabus?: (id: string) => void;
}

const FlightPlanningDashboard: React.FC<Props> = ({ onChangeView, onOpenSyllabus }) => {
  const modules = [
    {
      id: 'fuel',
      title: 'Fuel Policy Planner',
      desc: 'Interactive calculator for fuel logs. Calculate Taxi, Trip, Contingency (5% vs 3%), Alternate, and Final Reserve fuel, including Isolated Aerodrome procedures.',
      icon: Droplets,
      color: 'from-orange-500 to-amber-600',
      shadow: 'shadow-orange-500/20',
      view: View.FLIGHT_PLAN_FUEL,
    },
    {
      id: 'pet-psr',
      title: 'PET & PSR Calculator',
      desc: 'Visual sliding scale simulating en-route timelines. Live computations of Point of Equal Time (PET) and Point of Safe Return (PSR) under variable wind components.',
      icon: Compass,
      color: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/20',
      view: View.FLIGHT_PLAN_SIG_POINTS,
    },
    {
      id: 'icao-fpl',
      title: 'ICAO FPL Form Generator',
      desc: 'A full-fidelity, interactive mock of the standard ICAO ATS Flight Plan. Real-time syntax and regulatory validation for Items 7, 8, 9, 10, 13, 15, and 18.',
      icon: FormInput,
      color: 'from-purple-500 to-pink-600',
      shadow: 'shadow-purple-500/20',
      view: View.FLIGHT_PLAN_IFR,
    },
    {
      id: 'monitor',
      title: 'In-Flight Log Monitor',
      desc: 'Live tracking visualizer. Input mid-flight wind drift, calculate ground speed revisions, and track en-route fuel/time deviations at visual checkpoints.',
      icon: LineChart,
      color: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/20',
      view: View.FLIGHT_PLAN_INTRO,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-700">
      {/* Back Button */}
      <button 
        onClick={() => onChangeView(View.PLATFORM_DASHBOARD)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Dashboard
      </button>

      {/* Header Panel */}
      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-blue-500/20 relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
              Subject 033
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              Flight Planning & Monitoring
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
              Master the operational calculations required for professional flights. Practice fuel logs, navigate critical boundary points, and fill compliant flight plans.
            </p>
          </div>

          {onOpenSyllabus && (
            <button
              onClick={() => onOpenSyllabus('033')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors border border-slate-700 hover:border-slate-500 px-5 py-3 rounded-xl shrink-0 h-max"
            >
              <BookOpen size={18} />
              <span className="font-bold text-sm">View Syllabus LOs</span>
            </button>
          )}
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <motion.div
              key={mod.id}
              whileHover={{ scale: 1.01, y: -4 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onChangeView(mod.view)}
              className="group relative glass-card bg-slate-900/40 rounded-3xl border border-white/5 p-8 overflow-hidden cursor-pointer flex flex-col justify-between hover:border-white/10 transition-all duration-300 min-h-[250px]"
            >
              {/* Colored blur effect */}
              <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${mod.color} rounded-full blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${mod.color} ${mod.shadow} shadow-lg text-white`}>
                    <Icon size={24} />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                  {mod.title}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                  {mod.desc}
                </p>

                <div className="flex items-center text-xs font-black uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors pt-4 border-t border-white/5">
                  Launch Interactive Simulator
                  <ChevronLeft className="ml-auto rotate-180 w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default FlightPlanningDashboard;
