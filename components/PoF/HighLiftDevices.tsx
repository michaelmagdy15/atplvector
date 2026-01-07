import React, { useState } from 'react';
import { Settings, ChevronDown } from 'lucide-react';

const HighLiftDevices: React.FC = () => {
    const [flapType, setFlapType] = useState<'plain' | 'split' | 'slotted' | 'fowler'>('plain');
    const [deployed, setDeployed] = useState(false);
    const [slatDeployed, setSlatDeployed] = useState(false);

    // Visual params
    const getFlapPath = () => {
        const base = "M 0 0 L 100 0 L 100 20 L 0 20 Z"; // Simple rect

        // Transitions based on type and deployed state
        let rotation = deployed ? 30 : 0;
        let translationX = 0;
        let translationY = 0;

        if (deployed) {
            if (flapType === 'fowler') {
                translationX = 20;
                translationY = 5;
            } else if (flapType === 'slotted') {
                translationX = 5;
                translationY = 5;
            }
        }

        return { rotation, translationX, translationY };
    };

    const { rotation, translationX, translationY } = getFlapPath();

    return (
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Settings className="text-purple-400" /> High Lift Devices
            </h2>

            <div className="flex flex-col gap-8">
                {/* Visualizer */}
                <div className="bg-[#0f172a] rounded-xl border border-slate-600 h-[300px] relative overflow-hidden flex items-center justify-center">

                    {/* Main Wing Section */}
                    <div className="relative w-[500px] h-[100px]">
                        {/* Static leading edge part */}
                        <div className="absolute left-[50px] top-0 w-[400px] h-[60px] bg-slate-300 rounded-full z-10"
                            style={{ clipPath: 'polygon(0 0, 80% 0, 80% 100%, 0 100%)' }}></div>

                        {/* Slat */}
                        <div className={`absolute left-[50px] top-0 w-[80px] h-[60px] bg-sky-400 rounded-l-full z-20 transition-all duration-700 ${slatDeployed ? '-translate-x-6 translate-y-2 rotate-[-5deg]' : ''}`}>
                            <div className="absolute right-0 top-0 h-full w-2 bg-slate-400/20"></div>
                        </div>

                        {/* Flap */}
                        <div
                            className="absolute right-[50px] top-0 w-[100px] h-[60px] bg-indigo-500 rounded-r-full z-0 transition-all duration-700 origin-top-left"
                            style={{
                                transform: `translate(${translationX}px, ${translationY}px) rotate(${rotation}deg)`
                            }}
                        >
                            {flapType === 'split' && (
                                <div className="absolute top-0 left-0 w-full h-2 bg-black/20"></div> // Visual hint
                            )}
                        </div>

                        {/* Airflow Lines */}
                        <div className="absolute inset-0 pointer-events-none z-30 opacity-50">
                            <div className={`h-0.5 bg-white w-full absolute top-[20px] transition-all duration-700 ${slatDeployed ? '-translate-y-4' : ''}`}></div>
                            <div className="h-0.5 bg-white w-full absolute top-[40px]"></div>
                            <div className="h-0.5 bg-white w-full absolute top-[60px]"></div>
                        </div>
                    </div>

                    <div className="absolute bottom-4 right-4 flex gap-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-sky-400 rounded"></div> Slat</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-500 rounded"></div> Flap</div>
                    </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <label className="text-slate-400 text-sm block mb-2">Flap Type</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['plain', 'split', 'slotted', 'fowler'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setFlapType(type as any)}
                                        className={`py-2 px-4 rounded text-sm capitalize transition-all ${flapType === type ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setDeployed(!deployed)}
                                className={`flex-1 py-3 rounded-lg font-bold transition-all ${deployed ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'}`}
                            >
                                {deployed ? 'Retract Flaps' : 'Extend Flaps'}
                            </button>
                            <button
                                onClick={() => setSlatDeployed(!slatDeployed)}
                                className={`flex-1 py-3 rounded-lg font-bold transition-all ${slatDeployed ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-300'}`}
                            >
                                {slatDeployed ? 'Retract Slats' : 'Extend Slats'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-lg">
                        <h3 className="text-white font-bold mb-3 flex items-center justify-between">
                            Performance Impact
                            <span className="text-xs font-normal text-slate-400 px-2 py-1 bg-slate-700 rounded">
                                {flapType.toUpperCase()}
                            </span>
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between border-b border-slate-700 pb-2">
                                <span className="text-slate-300">Lift (CLmax)</span>
                                <span className="text-emerald-400 font-mono">
                                    {deployed ? (flapType === 'fowler' ? '+90%' : flapType === 'slotted' ? '+65%' : '+50%') : '0%'}
                                </span>
                            </div>
                            <div className="flex justify-between border-b border-slate-700 pb-2">
                                <span className="text-slate-300">Drag</span>
                                <span className="text-red-400 font-mono">
                                    {deployed ? 'Increased' : 'Normal'}
                                </span>
                            </div>
                            <div className="flex justify-between pb-2">
                                <span className="text-slate-300">Stall Angle</span>
                                <span className="text-yellow-400 font-mono">
                                    {slatDeployed ? 'INCREASED' : (deployed ? 'DECREASED' : 'Normal')}
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            * Slats re-energize the boundary layer, delaying the stall. Flaps increase camber (and area for Fowler), increasing Lift at the cost of Drag and lower stall angle.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HighLiftDevices;
