import React, { useState } from 'react';
import { View } from '../../../types';
import { ChevronLeft, BookOpen, CheckCircle2, AlertOctagon, Plane, Settings, Navigation, ShieldAlert, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onChangeView: (view: View) => void;
}

type WalkaroundSection = 'cabin' | 'empennage' | 'rightWing' | 'nose' | 'leftWing';

const WALK_CHECKLIST: Record<WalkaroundSection, string[]> = {
  cabin: ['AROW documents verified', 'Control wheel lock removed', 'Ignition OFF', 'Avionics master OFF', 'Master switch ON', 'Fuel quantity checked', 'Flaps DOWN', 'Master switch OFF'],
  empennage: ['Baggage door secure', 'Horizontal stabilizer secure', 'Elevator free and correct', 'Rudder free and correct', 'Antennas secure'],
  rightWing: ['Flap secure and tracks checked', 'Aileron free and secure', 'Wing tip and lights checked', 'Leading edge checked', 'Tie-down removed', 'Main wheel tire checked', 'Fuel tank sumped'],
  nose: ['Engine oil level checked', 'Fuel strainer sumped', 'Propeller and spinner checked', 'Air inlets clear', 'Alternator belt checked', 'Nose wheel strut and tire checked', 'Static port clear'],
  leftWing: ['Main wheel tire checked', 'Fuel tank sumped', 'Pitot tube cover removed', 'Fuel vent clear', 'Stall warning opening checked', 'Leading edge checked', 'Aileron free and secure', 'Flap secure']
};

const EMERGENCY_FLOW = [
  { letter: 'A', title: 'Airspeed', desc: 'Establish best glide speed (Vg).' },
  { letter: 'B', title: 'Best Field', desc: 'Turn towards the most suitable landing area. Consider wind direction, terrain, and obstacles.' },
  { letter: 'C', title: 'Checklist / Cause', desc: 'Fuel selector BOTH, Mixture RICH, Carb Heat ON, Primer IN & LOCKED, Magnetos BOTH/START.' },
  { letter: 'D', title: 'Declare', desc: 'Squawk 7700. Transmit MAYDAY on 121.5 or current frequency.' },
  { letter: 'E', title: 'Execute', desc: 'Prepare for forced landing. Shut off fuel, mixture idle cut-off, ignition off, master off, unlatch doors.' }
];

const OperationalProcedures: React.FC<Props> = ({ onChangeView }) => {
  const [activeTab, setActiveTab] = useState<'walkaround' | 'emergency'>('walkaround');
  const [activeSection, setActiveSection] = useState<WalkaroundSection>('cabin');
  const [completedSections, setCompletedSections] = useState<Set<WalkaroundSection>>(new Set());
  
  const [emergencyStep, setEmergencyStep] = useState(0);

  const toggleChecklist = (section: WalkaroundSection) => {
    setActiveSection(section);
  };

  const completeSection = () => {
    setCompletedSections(prev => new Set(prev).add(activeSection));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-700">
      <button 
        onClick={() => onChangeView(View.PPL_DASHBOARD)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Dashboard
      </button>

      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-indigo-500/20 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="p-4 bg-indigo-500/20 rounded-2xl text-indigo-400">
            <BookOpen size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Operational Procedures</h1>
        </div>
        
        <p className="text-slate-300 text-lg max-w-2xl leading-relaxed relative z-10">
          Master standard operating procedures and emergency memory items.
        </p>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('walkaround')}
          className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
            activeTab === 'walkaround' 
              ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <CheckCircle2 size={18} /> Pre-Flight Walkaround
        </button>
        <button
          onClick={() => {
            setActiveTab('emergency');
            setEmergencyStep(0);
          }}
          className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
            activeTab === 'emergency' 
              ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <AlertOctagon size={18} /> Emergency Flows
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'walkaround' && (
          <motion.div
            key="walkaround"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Visualizer */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col items-center justify-center min-h-[400px]">
              <div className="relative w-[300px] h-[300px]">
                {/* Airplane representation */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                   <Plane size={200} className="text-slate-600 rotate-0" strokeWidth={1} />
                </div>

                {/* Hotspots */}
                <button 
                  onClick={() => toggleChecklist('cabin')}
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all z-10
                    ${activeSection === 'cabin' ? 'border-indigo-400 bg-indigo-500/30' : completedSections.has('cabin') ? 'border-emerald-500 text-emerald-500' : 'border-slate-500 hover:border-white'}`}
                >
                  {completedSections.has('cabin') && activeSection !== 'cabin' ? <CheckCircle2 size={20} /> : <span className="font-bold">1</span>}
                </button>

                <button 
                  onClick={() => toggleChecklist('empennage')}
                  className={`absolute bottom-8 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all z-10
                    ${activeSection === 'empennage' ? 'border-indigo-400 bg-indigo-500/30' : completedSections.has('empennage') ? 'border-emerald-500 text-emerald-500' : 'border-slate-500 hover:border-white'}`}
                >
                  {completedSections.has('empennage') && activeSection !== 'empennage' ? <CheckCircle2 size={20} /> : <span className="font-bold">2</span>}
                </button>

                <button 
                  onClick={() => toggleChecklist('rightWing')}
                  className={`absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all z-10
                    ${activeSection === 'rightWing' ? 'border-indigo-400 bg-indigo-500/30' : completedSections.has('rightWing') ? 'border-emerald-500 text-emerald-500' : 'border-slate-500 hover:border-white'}`}
                >
                  {completedSections.has('rightWing') && activeSection !== 'rightWing' ? <CheckCircle2 size={20} /> : <span className="font-bold">3</span>}
                </button>

                <button 
                  onClick={() => toggleChecklist('nose')}
                  className={`absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all z-10
                    ${activeSection === 'nose' ? 'border-indigo-400 bg-indigo-500/30' : completedSections.has('nose') ? 'border-emerald-500 text-emerald-500' : 'border-slate-500 hover:border-white'}`}
                >
                  {completedSections.has('nose') && activeSection !== 'nose' ? <CheckCircle2 size={20} /> : <span className="font-bold">4</span>}
                </button>

                <button 
                  onClick={() => toggleChecklist('leftWing')}
                  className={`absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all z-10
                    ${activeSection === 'leftWing' ? 'border-indigo-400 bg-indigo-500/30' : completedSections.has('leftWing') ? 'border-emerald-500 text-emerald-500' : 'border-slate-500 hover:border-white'}`}
                >
                  {completedSections.has('leftWing') && activeSection !== 'leftWing' ? <CheckCircle2 size={20} /> : <span className="font-bold">5</span>}
                </button>

                {/* Path connections SVG could go here for extra polish */}
              </div>
            </div>

            {/* Checklist */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white capitalize">{activeSection.replace(/([A-Z])/g, ' $1').trim()} Inspection</h2>
                {completedSections.has(activeSection) && <span className="text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold">COMPLETED</span>}
              </div>

              <ul className="space-y-3 mb-8">
                {WALK_CHECKLIST[activeSection].map((item, idx) => (
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-xl border border-white/5"
                  >
                    <div className="w-5 h-5 rounded border border-slate-500 shrink-0 mt-0.5" />
                    <span className="text-slate-300">{item}</span>
                  </motion.li>
                ))}
              </ul>

              <button 
                onClick={completeSection}
                disabled={completedSections.has(activeSection)}
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  completedSections.has(activeSection) 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-indigo-500 text-white hover:bg-indigo-400 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                }`}
              >
                Mark Section Complete
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'emergency' && (
          <motion.div
            key="emergency"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel p-8 md:p-12 rounded-3xl border border-red-500/20 max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-4 bg-red-500/20 rounded-full text-red-400 mb-4">
                <ShieldAlert size={48} />
              </div>
              <h2 className="text-3xl font-black text-white">Engine Failure In-Flight</h2>
              <p className="text-slate-400 mt-2">Memory Item Flow (A-B-C-D-E)</p>
            </div>

            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-6 top-0 bottom-0 w-1 bg-slate-800 rounded-full" />
              <div 
                className="absolute left-6 top-0 w-1 bg-red-500 rounded-full transition-all duration-500" 
                style={{ height: `${(emergencyStep / (EMERGENCY_FLOW.length - 1)) * 100}%` }} 
              />

              <div className="space-y-8 relative">
                {EMERGENCY_FLOW.map((step, idx) => (
                  <div 
                    key={step.letter} 
                    className={`flex items-start gap-6 transition-all duration-500 ${idx > emergencyStep ? 'opacity-30 grayscale' : 'opacity-100'}`}
                  >
                    <button
                      onClick={() => setEmergencyStep(idx)}
                      className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center text-xl font-black relative z-10 transition-colors
                        ${idx <= emergencyStep ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-800 text-slate-500'}`}
                    >
                      {step.letter}
                    </button>
                    
                    <div className={`flex-1 pt-2 transition-all ${idx === emergencyStep ? 'scale-105 transform origin-left' : ''}`}>
                      <h3 className={`text-2xl font-bold mb-2 ${idx <= emergencyStep ? 'text-white' : 'text-slate-500'}`}>
                        {step.title}
                      </h3>
                      <p className={`text-lg leading-relaxed ${idx <= emergencyStep ? 'text-slate-300' : 'text-slate-600'}`}>
                        {step.desc}
                      </p>
                      
                      {idx === emergencyStep && idx < EMERGENCY_FLOW.length - 1 && (
                        <button 
                          onClick={() => setEmergencyStep(idx + 1)}
                          className="mt-4 flex items-center gap-2 text-red-400 hover:text-red-300 font-bold transition-colors"
                        >
                          Next Step <ArrowRight size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OperationalProcedures;
