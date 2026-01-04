
import React from 'react';
import { Flame } from 'lucide-react';

const JetEnginePrinciples: React.FC = () => {
    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Flame className="text-orange-500" /> Gas Turbine Cycle (Brayton)
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-slate-900 p-4 rounded-lg text-center border-b-4 border-blue-500">
                    <h3 className="font-bold text-white mb-2">1. Induction</h3>
                    <p className="text-sm text-slate-400">Air is drawn into the engine inlet.</p>
                </div>
                <div className="flex-1 bg-slate-900 p-4 rounded-lg text-center border-b-4 border-yellow-500">
                    <h3 className="font-bold text-white mb-2">2. Compression</h3>
                    <p className="text-sm text-slate-400">Pressure/Temp increases. Velocity constant/decreases.</p>
                </div>
                <div className="flex-1 bg-slate-900 p-4 rounded-lg text-center border-b-4 border-red-500 animate-pulse">
                    <h3 className="font-bold text-white mb-2">3. Combustion</h3>
                    <p className="text-sm text-slate-400">Fuel added. Constant Pressure expansion.</p>
                </div>
                <div className="flex-1 bg-slate-900 p-4 rounded-lg text-center border-b-4 border-orange-500">
                    <h3 className="font-bold text-white mb-2">4. Exhaust</h3>
                    <p className="text-sm text-slate-400">Gas accelerates through turbine & nozzle.</p>
                </div>
            </div>

            <div className="mt-8 bg-slate-700/50 p-6 rounded-xl text-center">
                 <p className="text-slate-300 italic">"Suck, Squeeze, Bang, Blow"</p>
                 <p className="text-xs text-slate-500 mt-2">Continuous cycle (unlike Piston intermittent).</p>
            </div>
        </div>
    );
};

export default JetEnginePrinciples;
