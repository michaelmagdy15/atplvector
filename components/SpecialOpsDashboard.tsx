
import React, { useState } from 'react';
import { Flame, AlertTriangle, Volume2, Snowflake, Wind, Droplets, ArrowRight } from 'lucide-react';
import WakeTurbulence from './WakeTurbulence';
import SurfaceContamination from './SurfaceContamination';

const SpecialOpsDashboard: React.FC<{ isLocked?: boolean }> = ({ isLocked = false }) => {
    const [view, setView] = useState('menu'); // menu, wake, contam, dg, fire, noise

    const renderModule = () => {
        switch (view) {
            case 'wake': return <WakeTurbulence />;
            case 'contam': return <SurfaceContamination />;
            case 'dg': return <DangerousGoodsModule />;
            case 'fire': return <FireSmokeModule />;
            case 'noise': return <NoiseAbatementModule />;
            default: return null;
        }
    };

    if (view !== 'menu') {
        return (
            <div className="animate-in fade-in zoom-in-95 duration-300">
                <button
                    onClick={() => setView('menu')}
                    className="mb-4 flex items-center text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowRight className="rotate-180 mr-2" /> Back to Special Ops
                </button>
                {renderModule()}
            </div>
        );
    }

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 ${isLocked ? 'opacity-50 pointer-events-none blur-[1px] grayscale-[0.5] select-none' : ''}`}>
            <SpecialOpCard
                title="Wake Turbulence"
                desc="Separation minima and heavy/medium/light categories."
                icon={Wind}
                color="blue"
                onClick={() => setView('wake')}
            />
            <SpecialOpCard
                title="Surface Contamination"
                desc="Braking action, SNOWTAMs, and runway friction."
                icon={Snowflake}
                color="cyan"
                onClick={() => setView('contam')}
            />
            <SpecialOpCard
                title="Dangerous Goods"
                desc="ICAO Annex 18, Classes 1-9, and labeling."
                icon={AlertTriangle}
                color="orange"
                onClick={() => setView('dg')}
            />
            <SpecialOpCard
                title="Fire & Smoke"
                desc="Extinguishing agents, fire classes, and procedures."
                icon={Flame}
                color="red"
                onClick={() => setView('fire')}
            />
            <SpecialOpCard
                title="Noise Abatement"
                desc="NADP 1 vs NADP 2 departure profiles."
                icon={Volume2}
                color="green"
                onClick={() => setView('noise')}
            />
            <SpecialOpCard
                title="De-Icing / Anti-Icing"
                desc="Holdover times and fluid types (Type I, II, IV)."
                icon={Droplets}
                color="purple"
                onClick={() => setView('contam')} // Reusing contam for now or add specific
            />
        </div>
    );
};

const SpecialOpCard = ({ title, desc, icon: Icon, color, onClick }: any) => {
    const colorMap: any = {
        blue: "bg-blue-500/10 border-blue-500/20 text-blue-400 hover:border-blue-500/50",
        cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:border-cyan-500/50",
        orange: "bg-orange-500/10 border-orange-500/20 text-orange-400 hover:border-orange-500/50",
        red: "bg-red-500/10 border-red-500/20 text-red-400 hover:border-red-500/50",
        green: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:border-emerald-500/50",
        purple: "bg-purple-500/10 border-purple-500/20 text-purple-400 hover:border-purple-500/50",
    };

    return (
        <button
            onClick={onClick}
            className={`p-6 rounded-xl border text-left transition-all hover:scale-[1.02] flex flex-col h-full bg-slate-900 ${colorMap[color]}`}
        >
            <div className="mb-4 p-3 rounded-lg bg-slate-950/50 w-fit">
                <Icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-400">{desc}</p>
        </button>
    );
};

// --- SUB-MODULES ---

const DangerousGoodsModule = () => (
    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-6">Dangerous Goods Classes</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
                { code: '1', name: 'Explosives', color: 'bg-orange-500' },
                { code: '2', name: 'Gases', color: 'bg-red-500' },
                { code: '3', name: 'Flammable Liquids', color: 'bg-red-600' },
                { code: '4', name: 'Flammable Solids', color: 'bg-red-400 border-l-[20px] border-white' /* Striped sim */ },
                { code: '5', name: 'Oxidizers', color: 'bg-yellow-400' },
                { code: '6', name: 'Toxic/Infectious', color: 'bg-white text-black' },
                { code: '7', name: 'Radioactive', color: 'bg-yellow-100 text-black' },
                { code: '8', name: 'Corrosives', color: 'bg-white text-black border-b-[20px] border-black' },
                { code: '9', name: 'Miscellaneous', color: 'bg-white text-black border-t-[20px] border-black' },
            ].map((c) => (
                <div key={c.code} className={`p-4 rounded-lg flex flex-col items-center justify-center text-center h-32 border border-slate-700 ${c.color.includes('bg-') ? '' : 'bg-slate-800'}`}>
                    <div className={`w-full h-full rounded flex flex-col justify-between p-2 font-bold ${c.color}`}>
                        <span className="text-xs uppercase opacity-80">{c.name}</span>
                        <span className="text-2xl self-end">{c.code}</span>
                    </div>
                </div>
            ))}
        </div>
        <div className="mt-8 bg-slate-800 p-4 rounded-lg">
            <h3 className="font-bold text-white mb-2">Transport of Dangerous Goods by Air</h3>
            <p className="text-slate-400 text-sm">
                Pilots must be notified via NOTOC (Notification to Captain). Some items are forbidden (unless exempted), some allowed in Cargo only, some in Passenger aircraft (limited qty).
            </p>
        </div>
    </div>
);

const FireSmokeModule = () => (
    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-6">Fire Classification & Extinguishers</h2>
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-lg">
                    <div className="w-10 h-10 bg-green-900 text-green-500 flex items-center justify-center font-black rounded text-xl">A</div>
                    <div>
                        <div className="text-white font-bold">Class A: Solids</div>
                        <div className="text-slate-400 text-xs text-sm">Wood, paper, fabric. Best agent: Water / Glycol.</div>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-lg">
                    <div className="w-10 h-10 bg-red-900 text-red-500 flex items-center justify-center font-black rounded text-xl">B</div>
                    <div>
                        <div className="text-white font-bold">Class B: Flammable Liquids</div>
                        <div className="text-slate-400 text-xs text-sm">Fuel, oil, paint. Best agent: Halon, Foam, Dry Powder.</div>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-lg">
                    <div className="w-10 h-10 bg-blue-900 text-blue-500 flex items-center justify-center font-black rounded text-xl">C</div>
                    <div>
                        <div className="text-white font-bold">Class C: Flammable Gases</div>
                        <div className="text-slate-400 text-xs text-sm">Butane, Propane. Best agent: Halon, Dry Powder.</div>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-lg">
                    <div className="w-10 h-10 bg-yellow-900 text-yellow-500 flex items-center justify-center font-black rounded text-xl">D</div>
                    <div>
                        <div className="text-white font-bold">Class D: Metals</div>
                        <div className="text-slate-400 text-xs text-sm">Magnesium, Lithium. Best agent: Special dry powder.</div>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-lg border border-yellow-500/30">
                    <div className="w-10 h-10 bg-yellow-500 text-black flex items-center justify-center font-black rounded text-xl">⚡</div>
                    <div>
                        <div className="text-white font-bold">Electrical Fire</div>
                        <div className="text-slate-400 text-xs text-sm">Live circuits. Best agent: Halon, CO2. NEVER Water.</div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-xl border border-slate-700 flex flex-col justify-center">
                <h3 className="text-lg font-bold text-white mb-4">Halon 1211 (BCF)</h3>
                <p className="text-slate-400 text-sm mb-4">
                    The standard aviation extinguisher. Chemically interferes with combustion. Low toxicity but an asphyxiant in confined spaces.
                </p>
                <div className="w-full h-48 bg-slate-900 rounded-lg relative overflow-hidden flex items-center justify-center">
                    <div className="w-16 h-32 bg-green-600 rounded-full relative shadow-lg"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-16 text-white font-bold text-xs">HALON</div>
                </div>
            </div>
        </div>
    </div>
);

const NoiseAbatementModule = () => {
    const [profile, setProfile] = useState(1);

    return (
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-2">Noise Abatement Departure Procedures</h2>
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setProfile(1)}
                    className={`px-4 py-2 rounded font-bold ${profile === 1 ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                    NADP 1 (Close-in)
                </button>
                <button
                    onClick={() => setProfile(2)}
                    className={`px-4 py-2 rounded font-bold ${profile === 2 ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                    NADP 2 (Distant)
                </button>
            </div>

            <div className="h-64 border-l border-b border-slate-600 relative bg-slate-800/20 rounded-tr-lg">
                {/* Axes */}
                <div className="absolute bottom-0 left-0 w-full h-px bg-slate-500"></div>
                <div className="absolute bottom-0 left-0 h-full w-px bg-slate-500"></div>

                {profile === 1 ? (
                    <>
                        {/* Profile Line for NADP 1 */}
                        <svg className="absolute inset-0 w-full h-full overflow-visible">
                            <path d="M0,256 L50,150 L100,100 L300,50" fill="none" stroke="#22c55e" strokeWidth="4" />
                        </svg>
                        <div className="absolute bottom-20 left-10 text-xs text-green-400 font-bold bg-slate-900 px-2 py-1 rounded border border-green-500/50">
                            V2 + 10-20kts<br />Take-off Thrust
                        </div>
                        <div className="absolute bottom-32 left-28 text-xs text-white bg-slate-900 px-2 py-1 rounded">
                            Thrust Reduction (typically 1500ft)
                        </div>
                        <div className="absolute top-10 right-10 text-right">
                            <h3 className="font-bold text-white">NADP 1</h3>
                            <p className="text-slate-400 text-sm">Protects areas CLOSE to the airport (climb steep and slow).</p>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Profile Line for NADP 2 */}
                        <svg className="absolute inset-0 w-full h-full overflow-visible">
                            <path d="M0,256 L50,180 L150,180 L350,20" fill="none" stroke="#22c55e" strokeWidth="4" />
                        </svg>
                        <div className="absolute bottom-16 left-12 text-xs text-white bg-slate-900 px-2 py-1 rounded">
                            Acceleration Segment (typically 800ft)
                        </div>
                        <div className="absolute top-4 right-10 text-right">
                            <h3 className="font-bold text-white">NADP 2</h3>
                            <p className="text-slate-400 text-sm">Protects areas DISTANT from the airport (accelerate early, clean up).</p>
                        </div>
                    </>
                )}
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>Runway</span>
                <span>Distance</span>
            </div>
        </div>
    );
};

export default SpecialOpsDashboard;
