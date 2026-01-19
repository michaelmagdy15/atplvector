import React, { useState } from 'react';
import { Wind, Users, Plane, AlertCircle } from 'lucide-react';

const OxygenRequirements: React.FC = () => {
    const [altitude, setAltitude] = useState<number>(8000);
    const [isPressurized, setIsPressurized] = useState<boolean>(true);

    const getRequirements = () => {
        const reqs = {
            pilot: { text: "None", color: "text-slate-500", active: false },
            crew: { text: "None", color: "text-slate-500", active: false },
            pax: { text: "None", color: "text-slate-500", active: false }
        };

        if (!isPressurized) {
            // Non-Pressurized Rules
            if (altitude > 10000) {
                reqs.pilot = { text: "Entire Time", color: "text-red-500", active: true };
                if (altitude <= 13000) {
                    reqs.crew = { text: "> 30 mins", color: "text-orange-500", active: true };
                    reqs.pax = { text: "10% of Passengers (> 30 mins)", color: "text-orange-500", active: true };
                } else {
                    reqs.crew = { text: "Entire Time", color: "text-red-500", active: true };
                    reqs.pax = { text: "All Passengers", color: "text-red-500", active: true };
                }
            }
        } else {
            // Pressurized Rules (Cabin Altitude)
            // Note: Rules typically refer to CABIN ALTITUDE. Assuming slider is Cabin Altitude for simplicity or System Altitude?
            // Usually text refers to Cabin Pressure Altitude. 
            // BUT there's a rule for FL410 (Aircraft Altitude).
            // Let's assume the slider controls Cabin Altitude for the oxygen masks drop logic, and we handle FL410 separately?
            // PDF: "Flight Deck & Cabin Crew ... 41,000ft+ - 1 pilot must wear a mask"

            // Let's make the slider Cabin Altitude mostly.

            if (altitude > 10000) {
                if (altitude <= 13000) { // 10-13k
                    reqs.pilot = { text: "Review Ops Man", color: "text-yellow-500", active: false }; // Usually >10k entire time 
                    reqs.crew = { text: "> 30 mins", color: "text-orange-500", active: true };
                    // Pax Rule 10-14k in PDF
                }
            }

            // Correct Interpretation of PDF Page 8 for Pressurized:
            // "Passengers: 10-14,000ft -> >30 mins for 10% of pax"
            // "14-15,000ft -> 30% of passengers"
            // "15,000ft+ -> All passengers"

            if (altitude > 10000) {
                reqs.pilot = { text: "Entire Time", color: "text-red-500", active: true }; // >10k for flight deck

                if (altitude <= 13000) {
                    reqs.crew = { text: "> 30 mins", color: "text-orange-500", active: true };
                } else {
                    reqs.crew = { text: "Entire Time", color: "text-red-500", active: true };
                }

                if (altitude <= 14000) {
                    reqs.pax = { text: "10% of Pax (> 30 mins)", color: "text-yellow-500", active: true };
                } else if (altitude <= 15000) {
                    reqs.pax = { text: "30% of Pax", color: "text-orange-500", active: true };
                } else {
                    reqs.pax = { text: "All Pax (Auto-Deploy)", color: "text-red-500", active: true };
                }
            }

            if (altitude > 25000) {
                // Quick Donning Masks required for Flight Deck
                reqs.pilot = { text: "Quick-Donning Masks Required", color: "text-red-500", active: true };
            }
            if (altitude > 41000) {
                reqs.pilot = { text: "1 Pilot MUST wear mask", color: "text-red-600 font-bold", active: true };
            }
        }

        return reqs;
    };

    const reqs = getRequirements();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-2">
                <Wind className="w-8 h-8 text-blue-400" />
                <div>
                    <h2 className="text-2xl font-bold text-white">Oxygen Requirements</h2>
                    <p className="text-slate-400 text-sm">Cabin Pressure Altitude rules.</p>
                </div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <div className="flex justify-between items-center mb-8">
                    <span className="font-bold text-white">Cabin Altitude / FL</span>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" checked={isPressurized} onChange={() => setIsPressurized(true)} className="accent-blue-500" />
                            <span className="text-sm text-white">Pressurized</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" checked={!isPressurized} onChange={() => setIsPressurized(false)} className="accent-blue-500" />
                            <span className="text-sm text-white">Non-Pressurized</span>
                        </label>
                    </div>
                </div>

                <div className="relative pt-6 pb-2 px-4 select-none">
                    <input
                        type="range"
                        min="0"
                        max={isPressurized ? 45000 : 20000}
                        step="500"
                        value={altitude}
                        onChange={(e) => setAltitude(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-black px-4 py-1 rounded-full text-lg shadow-lg">
                        {altitude.toLocaleString()} ft
                    </div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 px-1 mt-2 font-mono">
                    <span>0 ft</span>
                    <span>FL{Math.round((isPressurized ? 45000 : 20000) / 100)}</span>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <ReqCard
                    title="Flight Crew"
                    icon={Plane}
                    content={reqs.pilot.text}
                    colorClass={reqs.pilot.color}
                    isActive={reqs.pilot.active}
                />
                <ReqCard
                    title="Cabin Crew"
                    icon={Users}
                    content={reqs.crew.text}
                    colorClass={reqs.crew.color}
                    isActive={reqs.crew.active}
                />
                <ReqCard
                    title="Passengers"
                    icon={Users}
                    content={reqs.pax.text}
                    colorClass={reqs.pax.color}
                    isActive={reqs.pax.active}
                />
            </div>

            {isPressurized && altitude > 25000 && (
                <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg flex items-center gap-3">
                    <AlertCircle className="text-red-400" />
                    <div>
                        <div className="font-bold text-red-200">High Altitude Warning</div>
                        <div className="text-sm text-red-300">Quick-donning masks required on Flight Deck.</div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ReqCard = ({ title, icon: Icon, content, colorClass, isActive }: any) => (
    <div className={`p-6 rounded-xl border transition-all duration-300 ${isActive ? 'bg-slate-800 border-slate-600' : 'bg-slate-900/50 border-slate-800 opacity-50'}`}>
        <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-600'}`}>
                <Icon size={20} />
            </div>
            <h3 className="font-bold text-white">{title}</h3>
        </div>
        <div className={`text-xl font-bold ${colorClass}`}>
            {content}
        </div>
    </div>
);

export default OxygenRequirements;
