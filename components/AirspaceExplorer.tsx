import React, { useState } from 'react';
import { easaAirspace } from '../data/courseData';
import { Shield, Radio, CheckSquare, XSquare } from 'lucide-react';

const AirspaceExplorer: React.FC = () => {
    const [selectedClass, setSelectedClass] = useState(easaAirspace[1]); // Default to Class C

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-white">EASA Airspace Classifications</h2>
                <p className="text-slate-400">Interactive guide to European Airspace structures</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                {easaAirspace.map((ac) => (
                    <button
                        key={ac.class}
                        onClick={() => setSelectedClass(ac)}
                        className={`p-4 rounded-xl font-bold text-xl transition-all shadow-sm
                            ${selectedClass.class === ac.class 
                                ? 'bg-sky-600 text-white scale-110 shadow-lg' 
                                : 'bg-white text-slate-600 hover:bg-sky-50'}
                        `}
                    >
                        Class {ac.class}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex flex-col md:flex-row text-slate-900">
                {/* Visual Representation */}
                <div className="bg-slate-900 p-8 md:w-1/3 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
                    <div className="relative z-10 text-center">
                        <div className="text-9xl font-black text-slate-800/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            {selectedClass.class}
                        </div>
                        <Shield className="w-24 h-24 text-sky-500 mx-auto mb-4" />
                        <div className="text-white font-bold text-2xl">Controlled?</div>
                        <div className={`text-xl font-mono ${selectedClass.class === 'G' ? 'text-red-400' : 'text-green-400'}`}>
                            {selectedClass.class === 'G' ? 'NO' : 'YES'}
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="p-8 md:w-2/3 space-y-6">
                    <div className="flex items-start">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4 shrink-0">
                            <Radio className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-700">Radio Communication</h4>
                            <p className="text-slate-500">{selectedClass.radio}</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 shrink-0 ${selectedClass.clearance.includes('No') ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                            {selectedClass.clearance.includes('No') ? <CheckSquare className="w-6 h-6" /> : <XSquare className="w-6 h-6" />}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-700">ATC Clearance</h4>
                            <p className="text-slate-500">{selectedClass.clearance}</p>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <h4 className="font-bold text-slate-700 text-sm uppercase mb-2">Separation Provided</h4>
                        <p className="text-slate-600 italic">"{selectedClass.separation}"</p>
                    </div>

                     <div className="p-4 bg-sky-50 rounded-lg border border-sky-100 text-sm text-sky-800">
                        <strong>EASA Note:</strong> Class B is rarely used in Europe. Class A is typically IFR only. Class G is the only unregulated airspace.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AirspaceExplorer;