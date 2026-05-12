import React, { useState } from 'react';
import { View } from '../../../types';
import { ChevronLeft, Scale, Cloud, Eye, Ruler } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onChangeView: (view: View) => void;
}

type AirspaceClass = 'A' | 'B' | 'C' | 'D' | 'E' | 'G';

const AirLaw: React.FC<Props> = ({ onChangeView }) => {
  const [selectedAirspace, setSelectedAirspace] = useState<AirspaceClass>('C');

  const airspaceData: Record<AirspaceClass, {
    name: string;
    description: string;
    color: string;
    bg: string;
    clearance: string;
    visibility: string;
    cloudClearance: string;
    chartSymbol: string;
  }> = {
    A: {
      name: 'Class A',
      description: 'Airspace from 18,000 MSL up to and including FL 600. All operations must be conducted under IFR.',
      color: 'text-red-400',
      bg: 'bg-red-500/20',
      clearance: 'IFR Clearance Required',
      visibility: 'N/A (IFR Only)',
      cloudClearance: 'N/A (IFR Only)',
      chartSymbol: 'None (Implicit above 18k)'
    },
    B: {
      name: 'Class B',
      description: 'Airspace from surface to 10,000 MSL surrounding the nation\'s busiest airports. Solid blue line on sectionals.',
      color: 'text-blue-400',
      bg: 'bg-blue-500/20',
      clearance: 'Specific ATC Clearance Required',
      visibility: '3 Statute Miles',
      cloudClearance: 'Clear of Clouds',
      chartSymbol: 'Solid Blue Line'
    },
    C: {
      name: 'Class C',
      description: 'Airspace from surface to 4,000 AGL surrounding airports with operational control towers and radar approach control. Solid magenta line.',
      color: 'text-fuchsia-400',
      bg: 'bg-fuchsia-500/20',
      clearance: 'Two-way radio communication',
      visibility: '3 Statute Miles',
      cloudClearance: '1000 above, 500 below, 2000 horizontal',
      chartSymbol: 'Solid Magenta Line'
    },
    D: {
      name: 'Class D',
      description: 'Airspace from surface to 2,500 AGL surrounding airports with operational control tower. Dashed blue line.',
      color: 'text-blue-300',
      bg: 'bg-blue-500/10',
      clearance: 'Two-way radio communication',
      visibility: '3 Statute Miles',
      cloudClearance: '1000 above, 500 below, 2000 horizontal',
      chartSymbol: 'Dashed Blue Line'
    },
    E: {
      name: 'Class E',
      description: 'Controlled airspace not classified as A, B, C, or D. Often starts at 700 AGL, 1200 AGL, or 14,500 MSL.',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/20',
      clearance: 'None for VFR',
      visibility: 'Under 10k MSL: 3 SM | Above 10k MSL: 5 SM',
      cloudClearance: 'Under 10k MSL: 152 | Above 10k MSL: 1000 above/below, 1 SM horiz.',
      chartSymbol: 'Dashed/Faded Magenta or Blue'
    },
    G: {
      name: 'Class G',
      description: 'Uncontrolled airspace extending from the surface upward to the overlying Class E airspace.',
      color: 'text-slate-400',
      bg: 'bg-slate-500/20',
      clearance: 'None',
      visibility: '1 SM (Day), 3 SM (Night) < 10k MSL',
      cloudClearance: 'Clear of Clouds (Day < 1200 AGL)',
      chartSymbol: 'None (Implicit outside controlled airspace)'
    }
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

      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-sky-500/20 relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="p-4 bg-sky-500/20 rounded-2xl text-sky-400">
            <Scale size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Air Law & Procedures</h1>
        </div>
        
        <p className="text-slate-300 text-lg max-w-2xl leading-relaxed relative z-10">
          Master the rules of the sky. Explore airspace classifications, VFR weather minimums, and Federal Aviation Regulations (FARs).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Airspace Visualizer Map (Abstract) */}
        <div className="lg:col-span-2 bg-slate-900/50 p-8 rounded-3xl border border-white/5 relative h-[500px] flex items-end">
          <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
            <div className="text-right text-slate-500 font-mono text-sm border-b border-dashed border-slate-700 pb-2">FL 600</div>
            <div className="text-right text-slate-500 font-mono text-sm border-b border-dashed border-slate-700 pb-2">18,000 MSL</div>
            <div className="text-right text-slate-500 font-mono text-sm border-b border-dashed border-slate-700 pb-2">10,000 MSL</div>
            <div className="text-right text-slate-500 font-mono text-sm border-b border-dashed border-slate-700 pb-2">Surface</div>
          </div>

          <div className="w-full h-full flex items-end gap-2 relative z-10 pt-16">
            {/* Class G/E block */}
            <div 
              className="flex-1 h-1/4 flex flex-col justify-end group cursor-pointer"
              onClick={() => setSelectedAirspace('G')}
            >
              <motion.div 
                animate={{ backgroundColor: selectedAirspace === 'G' ? 'rgba(100, 116, 139, 0.4)' : 'rgba(100, 116, 139, 0.1)' }}
                className="w-full h-1/3 border border-slate-600 rounded-t-lg transition-colors flex items-center justify-center"
              >
                <span className="font-bold text-slate-400">G</span>
              </motion.div>
            </div>
            
            {/* Class C block */}
            <div 
              className="flex-1 h-1/2 flex flex-col justify-end group cursor-pointer"
              onClick={() => setSelectedAirspace('C')}
            >
              <motion.div 
                animate={{ backgroundColor: selectedAirspace === 'C' ? 'rgba(232, 121, 249, 0.4)' : 'rgba(232, 121, 249, 0.1)' }}
                className="w-full h-1/2 border-2 border-fuchsia-500 rounded-t-lg transition-colors flex items-center justify-center"
              >
                <span className="font-bold text-fuchsia-400">C</span>
              </motion.div>
              <div className="w-1/2 mx-auto h-1/4 border-x-2 border-fuchsia-500 bg-fuchsia-500/10" />
            </div>

            {/* Class B block */}
            <div 
              className="flex-1 h-3/4 flex flex-col justify-end group cursor-pointer"
              onClick={() => setSelectedAirspace('B')}
            >
              <motion.div 
                animate={{ backgroundColor: selectedAirspace === 'B' ? 'rgba(96, 165, 250, 0.4)' : 'rgba(96, 165, 250, 0.1)' }}
                className="w-full h-1/3 border-2 border-blue-500 rounded-t-lg transition-colors flex items-center justify-center"
              >
                <span className="font-bold text-blue-400">B</span>
              </motion.div>
              <div className="w-2/3 mx-auto h-1/3 border-x-2 border-blue-500 bg-blue-500/10" />
              <div className="w-1/3 mx-auto h-1/3 border-x-2 border-blue-500 bg-blue-500/10" />
            </div>

             {/* Class D block */}
             <div 
              className="flex-1 h-1/3 flex flex-col justify-end group cursor-pointer"
              onClick={() => setSelectedAirspace('D')}
            >
              <motion.div 
                animate={{ backgroundColor: selectedAirspace === 'D' ? 'rgba(147, 197, 253, 0.4)' : 'rgba(147, 197, 253, 0.1)' }}
                className="w-full h-full border-2 border-dashed border-blue-400 rounded-t-lg transition-colors flex items-center justify-center"
              >
                <span className="font-bold text-blue-300">D</span>
              </motion.div>
            </div>

            {/* Class A Overlay */}
            <div 
              className="absolute top-0 left-0 w-full h-1/4 cursor-pointer"
              onClick={() => setSelectedAirspace('A')}
            >
              <motion.div 
                animate={{ backgroundColor: selectedAirspace === 'A' ? 'rgba(248, 113, 113, 0.2)' : 'rgba(248, 113, 113, 0.05)' }}
                className="w-full h-full border-b-2 border-red-500 flex items-center justify-center transition-colors"
              >
                 <span className="font-bold text-red-400 tracking-widest">Class A (IFR Only)</span>
              </motion.div>
            </div>
            
            {/* Class E Background */}
            <div 
              className="absolute inset-0 -z-10 cursor-pointer pointer-events-auto"
              onClick={() => setSelectedAirspace('E')}
            >
               <motion.div 
                animate={{ backgroundColor: selectedAirspace === 'E' ? 'rgba(52, 211, 153, 0.1)' : 'transparent' }}
                className="w-full h-full transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedAirspace}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`bg-slate-900/80 p-8 rounded-3xl border border-white/10 flex flex-col`}
          >
            <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold mb-4 w-max ${airspaceData[selectedAirspace].bg} ${airspaceData[selectedAirspace].color}`}>
              {airspaceData[selectedAirspace].name}
            </div>
            
            <p className="text-slate-300 mb-8 leading-relaxed">
              {airspaceData[selectedAirspace].description}
            </p>

            <div className="space-y-6 flex-1">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-slate-800 rounded-lg text-blue-400">
                  <Eye size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Visibility</h4>
                  <p className="text-white font-medium">{airspaceData[selectedAirspace].visibility}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-slate-800 rounded-lg text-sky-400">
                  <Cloud size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Cloud Clearance</h4>
                  <p className="text-white font-medium">{airspaceData[selectedAirspace].cloudClearance}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-slate-800 rounded-lg text-emerald-400">
                  <Ruler size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Chart Symbol</h4>
                  <p className="text-white font-medium">{airspaceData[selectedAirspace].chartSymbol}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Entry Requirements</h4>
              <p className="text-orange-400 font-bold">{airspaceData[selectedAirspace].clearance}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AirLaw;
