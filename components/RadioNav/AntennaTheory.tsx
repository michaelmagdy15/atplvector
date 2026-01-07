import React, { useState } from 'react';
import { View } from '../../types';
import { ArrowLeft, Wifi } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const AntennaTheory: React.FC<Props> = ({ onNavigate }) => {
    const [type, setType] = useState<'DIPOLE' | 'LOOP'>('DIPOLE');

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex items-center space-x-4">
                <button onClick={() => onNavigate?.(View.RAD_NAV_HOME)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"><ArrowLeft size={20} /></button>
                <div className="flex items-center gap-2">
                    <Wifi className="text-sky-400" />
                    <h1 className="text-2xl font-bold text-slate-100">Antenna Theory</h1>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[400px]">
                    {type === 'DIPOLE' ? (
                        <div className="relative w-64 h-64 flex items-center justify-center">
                            {/* Dipole Element */}
                            <div className="w-1 h-32 bg-slate-200 absolute"></div>
                            {/* Radiation Pattern (Omni in H-plane) */}
                            {/* Or Figure 8 in E-plane */}
                            <div className="absolute w-48 h-48 border-4 border-sky-500/50 rounded-full animate-pulse"></div>
                            <div className="absolute w-64 h-64 border-2 border-sky-500/30 rounded-full"></div>
                            <div className="text-xs text-sky-400 absolute bottom-0 bg-black/50 px-2 rounded">Omni-directional (Horizontal Plane)</div>
                        </div>
                    ) : (
                        <div className="relative w-64 h-64 flex items-center justify-center">
                            {/* Loop Element */}
                            <div className="w-32 h-32 border-4 border-slate-200 rounded-full absolute"></div>
                            {/* Radiation Pattern (Figure 8) */}
                            <div className="absolute w-64 h-32 bg-yellow-500/20 border border-yellow-500/50 rounded-full transform rotate-90"></div>
                            <div className="text-xs text-yellow-500 absolute bottom-0 bg-black/50 px-2 rounded">Figure-8 Pattern (Nulls perdendicular)</div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl space-y-4">
                        <label className="text-sm font-bold text-white block">Antenna Type</label>
                        <div className="flex bg-slate-950 p-1 rounded-lg">
                            <button onClick={() => setType('DIPOLE')} className={`flex-1 py-2 text-xs font-bold rounded ${type === 'DIPOLE' ? 'bg-sky-500 text-black' : 'text-slate-500'}`}>Hertzian Dipole</button>
                            <button onClick={() => setType('LOOP')} className={`flex-1 py-2 text-xs font-bold rounded ${type === 'LOOP' ? 'bg-yellow-500 text-black' : 'text-slate-500'}`}>Loop Antenna</button>
                        </div>
                        <p className="text-sm text-slate-300 mt-2">
                            {type === 'DIPOLE'
                                ? "Used in VOR and VHF Comms. Vertical polarization is standard for aviation."
                                : "Used in ADF (NDB). Directional properties (Nulls) allow finding the bearing to a station."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AntennaTheory;
