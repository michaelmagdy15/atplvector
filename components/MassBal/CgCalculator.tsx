
import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const CgCalculator: React.FC = () => {
    // Aircraft Data (Simplified C172-like)
    const datum = 0; // Firewall
    const [frontPaxWeight, setFrontPaxWeight] = useState(160); // kg
    const [rearPaxWeight, setRearPaxWeight] = useState(0); // kg
    const [fuelWeight, setFuelWeight] = useState(100); // kg
    const [baggageWeight, setBaggageWeight] = useState(10); // kg

    // Arms (meters)
    const arms = {
        bem: 1.0, // Basic Empty Mass Arm
        front: 0.9,
        rear: 1.8,
        fuel: 1.2,
        baggage: 2.4
    };

    const bem = 700; // Basic Empty Mass

    // Calculations
    const totalMass = bem + frontPaxWeight + rearPaxWeight + fuelWeight + baggageWeight;
    
    const totalMoment = (bem * arms.bem) + 
                       (frontPaxWeight * arms.front) + 
                       (rearPaxWeight * arms.rear) + 
                       (fuelWeight * arms.fuel) + 
                       (baggageWeight * arms.baggage);
    
    const cgPosition = totalMoment / totalMass;

    // Envelope Limits (Simplified)
    // Forward Limit: 0.9m at all weights
    // Aft Limit: 1.4m at all weights
    // Mass Limit: 1150 kg
    const limits = { fwd: 0.9, aft: 1.4, maxMass: 1150 };

    const isSafe = 
        totalMass <= limits.maxMass && 
        cgPosition >= limits.fwd && 
        cgPosition <= limits.aft;

    // Graph plotting logic
    // X-Axis: Arm (0.8m to 1.5m)
    // Y-Axis: Mass (700kg to 1200kg)
    const plotX = (cg: number) => ((cg - 0.8) / (1.5 - 0.8)) * 100;
    const plotY = (mass: number) => 100 - ((mass - 700) / (1200 - 700)) * 100;

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="text-yellow-400" /> Center of Gravity Calculator (031.05)
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">
                
                {/* Inputs */}
                <div className="space-y-6">
                    <div className="bg-slate-900 p-5 rounded-lg border border-slate-700">
                        <h3 className="text-slate-300 font-bold mb-4 border-b border-slate-600 pb-2">Loading Manifest</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="flex justify-between text-xs text-slate-400 uppercase font-bold">Front Seat (Pilots) <span className="text-white">{frontPaxWeight} kg</span></label>
                                <input type="range" min="50" max="250" value={frontPaxWeight} onChange={e => setFrontPaxWeight(Number(e.target.value))} className="w-full accent-sky-500" />
                            </div>
                            <div>
                                <label className="flex justify-between text-xs text-slate-400 uppercase font-bold">Rear Seat (Pax) <span className="text-white">{rearPaxWeight} kg</span></label>
                                <input type="range" min="0" max="250" value={rearPaxWeight} onChange={e => setRearPaxWeight(Number(e.target.value))} className="w-full accent-sky-500" />
                            </div>
                            <div>
                                <label className="flex justify-between text-xs text-slate-400 uppercase font-bold">Fuel (Wings) <span className="text-white">{fuelWeight} kg</span></label>
                                <input type="range" min="0" max="150" value={fuelWeight} onChange={e => setFuelWeight(Number(e.target.value))} className="w-full accent-yellow-500" />
                            </div>
                            <div>
                                <label className="flex justify-between text-xs text-slate-400 uppercase font-bold">Baggage (Aft) <span className="text-white">{baggageWeight} kg</span></label>
                                <input type="range" min="0" max="100" value={baggageWeight} onChange={e => setBaggageWeight(Number(e.target.value))} className="w-full accent-purple-500" />
                            </div>
                        </div>
                    </div>

                    <div className={`p-4 rounded-lg border-l-4 flex items-center justify-between ${isSafe ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
                        <div>
                            <div className="text-xs text-slate-400 font-bold uppercase">Total Mass</div>
                            <div className={`text-2xl font-black ${totalMass > limits.maxMass ? 'text-red-500' : 'text-white'}`}>{totalMass} kg</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-400 font-bold uppercase">CG Position</div>
                            <div className={`text-2xl font-black ${cgPosition < limits.fwd || cgPosition > limits.aft ? 'text-red-500' : 'text-white'}`}>{cgPosition.toFixed(3)} m</div>
                        </div>
                        <div className={`text-3xl ${isSafe ? 'text-green-500' : 'text-red-500'}`}>
                            {isSafe ? <CheckCircle /> : <AlertTriangle />}
                        </div>
                    </div>
                </div>

                {/* CG Envelope Graph */}
                <div className="bg-white rounded-xl p-4 relative overflow-hidden shadow-inner h-[400px]">
                    <div className="absolute top-2 left-2 text-slate-400 text-xs font-bold">Mass (kg)</div>
                    <div className="absolute bottom-2 right-2 text-slate-400 text-xs font-bold">CG Arm (m)</div>

                    {/* SVG Graph */}
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Grid */}
                        <defs>
                            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f1f5f9" strokeWidth="0.5"/>
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#grid)" />

                        {/* Envelope Box */}
                        {/* FWD limit: 0.9m. AFT limit: 1.4m. Max Mass: 1150kg. Min Mass: ~700kg */}
                        <path 
                            d={`M ${plotX(0.9)} ${plotY(700)} L ${plotX(0.9)} ${plotY(1150)} L ${plotX(1.4)} ${plotY(1150)} L ${plotX(1.4)} ${plotY(700)} Z`}
                            fill="rgba(16, 185, 129, 0.1)"
                            stroke="#10b981"
                            strokeWidth="0.5"
                        />
                        <text x={plotX(1.15)} y={plotY(900)} textAnchor="middle" className="text-[4px] fill-green-600 font-bold">SAFE ENVELOPE</text>

                        {/* CG Point */}
                        <circle 
                            cx={plotX(cgPosition)} 
                            cy={plotY(totalMass)} 
                            r="2" 
                            className={`transition-all duration-300 ${isSafe ? 'fill-blue-600' : 'fill-red-600 animate-pulse'}`} 
                        />
                        
                        {/* Crosshairs */}
                        <line x1={plotX(cgPosition)} y1="0" x2={plotX(cgPosition)} y2="100" stroke="#94a3b8" strokeWidth="0.2" strokeDasharray="2,2" />
                        <line x1="0" y1={plotY(totalMass)} x2="100" y2={plotY(totalMass)} stroke="#94a3b8" strokeWidth="0.2" strokeDasharray="2,2" />

                        {/* Labels for Limits */}
                        <text x={plotX(0.9)} y="98" fontSize="3" fill="#64748b" textAnchor="middle">0.9m</text>
                        <text x={plotX(1.4)} y="98" fontSize="3" fill="#64748b" textAnchor="middle">1.4m</text>
                        <text x="2" y={plotY(1150)} fontSize="3" fill="#64748b">1150kg</text>

                    </svg>

                </div>
            </div>
        </div>
    );
};

export default CgCalculator;
