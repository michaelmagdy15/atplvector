import React, { useState } from 'react';
import { View } from '../../types';
import { ArrowLeft, Compass } from 'lucide-react';

interface Props {
    onNavigate?: (view: View) => void;
}

const VDF: React.FC<Props> = ({ onNavigate }) => {
    const [heading, setHeading] = useState(0); // Aircraft Heading
    const [bearing, setBearing] = useState(90); // True bearing to station

    // QDM = Magnetic Heading TO Station (Inverse of Bearing FROM)
    // QDR = Magnetic Bearing FROM Station (Radial)
    // Assuming 0 variation for simplicity.
    const qdm = (bearing + 180) % 360;
    const qdr = bearing;
    const quj = qdm; // True track to station

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex items-center space-x-4">
                <button onClick={() => onNavigate?.(View.RAD_NAV_HOME)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"><ArrowLeft size={20} /></button>
                <div className="flex items-center gap-2">
                    <Compass className="text-sky-400" />
                    <h1 className="text-2xl font-bold text-slate-100">VDF (VHF Direction Finding)</h1>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 relative h-[400px]">
                    {/* Station */}
                    <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2 z-10"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-6 text-xs text-blue-400">VDF Station</div>

                    {/* Aircraft */}
                    {/* Position relative to station based on bearing */}
                    {/* Bearing 90 FROM Station means Aircraft is EAST. */}
                    {/* So aircraft x = cos(0), y = sin(0)? No. */}
                    {/* 90 Deg = East. */}
                    {/* Let's visualize Aircraft orbiting station */}
                    <div
                        className="absolute w-8 h-8 text-white transition-all duration-300"
                        style={{
                            top: '50%', left: '50%',
                            transform: `rotate(${heading}deg) translate(150px) rotate(-${heading}deg)`
                            // Verify: this rotates the Orbit, so 150px away.
                            // We want explicit Bearing Control.
                        }}
                    >
                        <div style={{ transform: `rotate(${heading}deg)` }}>✈️</div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-xl space-y-4">
                        <h2 className="text-white font-bold">Readings</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-800 p-4 rounded text-center">
                                <div className="text-2xl text-green-400 font-mono">{Math.round(qdm).toString().padStart(3, '0')}°</div>
                                <div className="text-xs text-slate-400">QDM (Magnetic to Station)</div>
                            </div>
                            <div className="bg-slate-800 p-4 rounded text-center">
                                <div className="text-2xl text-orange-400 font-mono">{Math.round(qdr).toString().padStart(3, '0')}°</div>
                                <div className="text-xs text-slate-400">QDR (Magnetic from Station)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Note: Incomplete visualizer logic for position, just placeholder for now */}
        </div>
    );
};

export default VDF;
