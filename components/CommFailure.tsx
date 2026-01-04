import React, { useState } from 'react';
import { Radio, Cloud, Sun, Navigation } from 'lucide-react';

const CommFailure: React.FC = () => {
    const [step, setStep] = useState(0);

    const reset = () => setStep(0);

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-slate-900">
            <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
                <Radio className="w-6 h-6 text-red-500" />
                <h2 className="text-2xl font-bold text-slate-800">Comm Failure Wizard</h2>
            </div>

            {step === 0 && (
                <div className="text-center animate-in fade-in">
                    <h3 className="text-xl font-bold text-slate-700 mb-6">Are you in VMC or IMC?</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setStep(1)} className="p-8 bg-sky-50 rounded-xl border-2 border-sky-100 hover:border-sky-500 transition group">
                            <Sun className="w-12 h-12 text-orange-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                            <div className="font-bold text-slate-800">VMC</div>
                            <div className="text-xs text-slate-500 mt-2">Visual Met Conditions</div>
                        </button>
                        <button onClick={() => setStep(2)} className="p-8 bg-slate-50 rounded-xl border-2 border-slate-100 hover:border-slate-500 transition group">
                            <Cloud className="w-12 h-12 text-slate-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                            <div className="font-bold text-slate-800">IMC</div>
                            <div className="text-xs text-slate-500 mt-2">Instrument Met Conditions</div>
                        </button>
                    </div>
                </div>
            )}

            {step === 1 && (
                <div className="text-center animate-in slide-in-from-right">
                    <div className="bg-green-100 text-green-800 p-6 rounded-xl mb-6">
                        <h3 className="text-lg font-bold mb-2">VMC Procedure</h3>
                        <ul className="text-left list-disc list-inside space-y-2">
                            <li>Set Transponder 7600</li>
                            <li>Continue to fly in VMC</li>
                            <li>Land at nearest suitable aerodrome</li>
                            <li>Report arrival to appropriate ATSU ASAP</li>
                        </ul>
                    </div>
                    <button onClick={reset} className="text-slate-400 hover:text-slate-600 font-bold text-sm">Start Over</button>
                </div>
            )}

            {step === 2 && (
                <div className="text-center animate-in slide-in-from-right">
                    <h3 className="text-xl font-bold text-slate-700 mb-6">Are you being Radar Vectored?</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setStep(3)} className="p-6 bg-indigo-50 rounded-xl border-2 border-indigo-100 hover:border-indigo-500 transition">
                            <Navigation className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                            <div className="font-bold text-slate-800">YES</div>
                        </button>
                        <button onClick={() => setStep(4)} className="p-6 bg-slate-50 rounded-xl border-2 border-slate-100 hover:border-slate-500 transition">
                            <div className="font-bold text-slate-800 text-xl py-2">NO</div>
                        </button>
                    </div>
                    <button onClick={reset} className="mt-8 text-slate-400 hover:text-slate-600 font-bold text-sm">Start Over</button>
                </div>
            )}

            {step === 3 && (
                <div className="text-center animate-in slide-in-from-right">
                     <div className="bg-orange-100 text-orange-900 p-6 rounded-xl mb-6">
                        <h3 className="text-lg font-bold mb-2">IMC - Radar Vector Procedure</h3>
                        <ul className="text-left list-disc list-inside space-y-2">
                            <li>Set Transponder 7600</li>
                            <li>Proceed in most direct manner</li>
                            <li>Rejoin Flight Plan Route no later than next significant point</li>
                            <li>Take into consideration Minimum Flight Altitude</li>
                        </ul>
                    </div>
                    <button onClick={reset} className="text-slate-400 hover:text-slate-600 font-bold text-sm">Start Over</button>
                </div>
            )}

            {step === 4 && (
                <div className="text-center animate-in slide-in-from-right">
                     <div className="bg-blue-100 text-blue-900 p-6 rounded-xl mb-6">
                        <h3 className="text-lg font-bold mb-2">IMC - Standard Procedure</h3>
                        <ul className="text-left list-disc list-inside space-y-2">
                            <li>Set Transponder 7600</li>
                            <li>Maintain Speed & Level for 20 mins (if no ATS surveillance)</li>
                            <li>OR Maintain Speed & Level for 7 mins (if ATS surveillance)</li>
                            <li>Then proceed according to Flight Plan</li>
                        </ul>
                    </div>
                    <button onClick={reset} className="text-slate-400 hover:text-slate-600 font-bold text-sm">Start Over</button>
                </div>
            )}
        </div>
    );
};

export default CommFailure;