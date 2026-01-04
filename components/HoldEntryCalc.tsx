import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

const HoldEntryCalc: React.FC = () => {
    const [inboundTrack, setInboundTrack] = useState(360);
    const [heading, setHeading] = useState(180);

    // Calculate sectors based on Standard Right Hand Hold
    // Sector 1 (Parallel): Heading is within 110 deg of reciprocal track (on the non-holding side)
    // Sector 2 (Teardrop): Heading is within 70 deg of reciprocal track (on the holding side)
    // Sector 3 (Direct): The remaining 180 deg
    
    const getEntry = () => {
        // Normalize angular difference
        let diff = (heading - inboundTrack + 360) % 360; // Relative to inbound track
        
        // Standard Right Hand Hold Logic
        // Reciprocal is inbound - 180
        // Sector 3 (Direct): Heading is typically opposite to inbound within wide margin
        
        // Simplified logic for standard right turn hold:
        // Sector 1 (Parallel): Heading is roughly same direction as inbound (reciprocal of inbound track)
        // Let's use the angular difference from the FIX heading (reciprocal of inbound)
        
        // Correct geometric logic for Right Hand Hold:
        // Draw line 70 deg to right of Inbound Reciprocal.
        // Zone 1 (Parallel): 110 deg slice to the left of inbound.
        // Zone 2 (Teardrop): 70 deg slice to the right of inbound.
        // Zone 3 (Direct): 180 deg remaining.
        
        // Calculate relative angle to the Inbound Reciprocal
        // Inbound Reciprocal = (Inbound + 180) % 360
        
        const recip = (inboundTrack + 180) % 360;
        let angleFromRecip = (heading - recip + 360) % 360;

        if (angleFromRecip > 0 && angleFromRecip < 110) return { type: 'Parallel', sector: 1, color: 'text-blue-500' };
        if (angleFromRecip >= 290) return { type: 'Teardrop', sector: 2, color: 'text-orange-500' }; // 360 - 70 = 290
        return { type: 'Direct', sector: 3, color: 'text-green-500' };
    };

    const result = getEntry();

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-slate-900">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <RotateCcw className="mr-2" /> Holding Entry Computer
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Inbound Track ( toward fix)</label>
                    <div className="flex items-center bg-slate-100 rounded-lg p-3">
                        <input 
                            type="number" 
                            value={inboundTrack}
                            onChange={(e) => setInboundTrack(Number(e.target.value) % 360)}
                            className="bg-transparent font-mono text-xl w-full outline-none text-slate-900"
                        />
                        <span className="text-slate-400 font-bold">°</span>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Your Heading</label>
                    <div className="flex items-center bg-slate-100 rounded-lg p-3">
                        <input 
                            type="number" 
                            value={heading}
                            onChange={(e) => setHeading(Number(e.target.value) % 360)}
                            className="bg-transparent font-mono text-xl w-full outline-none text-slate-900"
                        />
                        <span className="text-slate-400 font-bold">°</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center">
                <div className="relative w-64 h-64 bg-slate-50 rounded-full border-4 border-slate-200 mb-6 flex items-center justify-center">
                    {/* Compass North */}
                    <div className="absolute top-2 text-xs font-bold text-slate-300">N</div>

                    {/* Aircraft Heading Vector */}
                    <div 
                        className="absolute w-1 h-32 bg-slate-300 origin-bottom rounded-full"
                        style={{ transform: `rotate(${heading}deg) translateY(-50%)` }}
                    >
                         <div className="w-4 h-4 bg-slate-800 rounded-full absolute -top-2 -left-1.5 border-2 border-white"></div>
                    </div>

                    {/* Holding Fix Logic Visualization */}
                    <div 
                        className="absolute w-full h-full opacity-30 rounded-full"
                        style={{ 
                            background: `conic-gradient(
                                from ${(inboundTrack + 70) % 360}deg, 
                                #3b82f6 0deg 110deg, 
                                #22c55e 110deg 290deg,
                                #f97316 290deg 360deg
                            )` 
                        }}
                    ></div>
                    
                    <div className="z-10 bg-white px-4 py-2 rounded-lg shadow font-bold text-slate-800 border border-slate-200">
                        FIX
                    </div>
                </div>

                <div className="text-center">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">RECOMMENDED ENTRY</div>
                    <div className={`text-4xl font-black ${result.color} mt-2`}>
                        {result.type.toUpperCase()}
                    </div>
                    <div className="text-slate-500 mt-1">Sector {result.sector}</div>
                </div>
            </div>
        </div>
    );
};

export default HoldEntryCalc;