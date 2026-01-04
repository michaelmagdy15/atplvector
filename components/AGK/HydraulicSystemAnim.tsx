
import React, { useState, useEffect } from 'react';
import { Settings, ArrowDown } from 'lucide-react';

const HydraulicSystemAnim: React.FC = () => {
    const [pressure, setPressure] = useState(0);
    const [pumpOn, setPumpOn] = useState(false);
    const [actuatorPos, setActuatorPos] = useState(0); // 0 to 100

    useEffect(() => {
        let interval: any;
        if (pumpOn && pressure < 3000) {
            interval = setInterval(() => setPressure(p => Math.min(3000, p + 50)), 50);
        } else if (!pumpOn && pressure > 0) {
            interval = setInterval(() => setPressure(p => Math.max(0, p - 30)), 50);
        }
        return () => clearInterval(interval);
    }, [pumpOn, pressure]);

    const moveActuator = (dir: 'extend' | 'retract') => {
        if (pressure < 1000) return;
        if (dir === 'extend') setActuatorPos(Math.min(100, actuatorPos + 10));
        else setActuatorPos(Math.max(0, actuatorPos - 10));
    };

    return (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Settings className="text-blue-400" /> Hydraulic System (Pascal's Law)
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
                {/* Schematic */}
                <div className="bg-slate-900 rounded-xl p-4 relative h-[300px] border border-slate-600">
                    {/* Reservoir */}
                    <div className="absolute top-4 left-4 w-16 h-20 border-2 border-slate-500 rounded-b-lg bg-blue-900/30 overflow-hidden">
                        <div className="absolute bottom-0 w-full bg-blue-600 transition-all duration-1000" style={{ height: '80%' }}></div>
                        <span className="absolute top-1 left-1 text-[8px] text-white">RES</span>
                    </div>

                    {/* Pump */}
                    <div className={`absolute top-28 left-8 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${pumpOn ? 'border-green-500 animate-spin' : 'border-red-500'}`}>
                        <Settings size={16} className="text-slate-400" />
                    </div>

                    {/* Lines */}
                    <div className="absolute top-[50px] left-[40px] w-[2px] h-[60px] bg-slate-600"></div>
                    <div className={`absolute top-[140px] left-[40px] w-[150px] h-[2px] transition-colors duration-500 ${pressure > 1000 ? 'bg-green-500' : 'bg-slate-600'}`}></div>

                    {/* Actuator */}
                    <div className="absolute top-[120px] right-10 w-24 h-8 border-2 border-slate-400 bg-slate-800 rounded">
                        <div 
                            className="h-full bg-slate-500 transition-all duration-300"
                            style={{ width: `${actuatorPos}%` }}
                        ></div>
                    </div>
                    
                    {/* Gauge */}
                    <div className="absolute bottom-4 right-4 text-right">
                        <div className="text-xs text-slate-400">SYS PRESS</div>
                        <div className={`font-mono text-2xl font-bold ${pressure > 2500 ? 'text-green-500' : 'text-amber-500'}`}>
                            {pressure} PSI
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-6">
                    <div className="bg-slate-900/50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-white font-bold">Engine Pump</span>
                            <button 
                                onClick={() => setPumpOn(!pumpOn)}
                                className={`px-4 py-2 rounded font-bold transition-colors ${pumpOn ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
                            >
                                {pumpOn ? 'ON' : 'OFF'}
                            </button>
                        </div>
                        <p className="text-xs text-slate-400">
                            Pressure is required to operate heavy controls. Pascal's Law: Pressure applied to an enclosed fluid is transmitted undiminished.
                        </p>
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded-lg">
                        <span className="text-white font-bold block mb-4">Flap Actuator</span>
                        <div className="flex gap-2">
                            <button onClick={() => moveActuator('retract')} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded">Retract</button>
                            <button onClick={() => moveActuator('extend')} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded">Extend</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HydraulicSystemAnim;
