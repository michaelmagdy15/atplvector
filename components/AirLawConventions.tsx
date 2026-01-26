import React, { useState } from 'react';
import { Shield, Scale, Gavel, User, AlertCircle, TrendingUp } from 'lucide-react';

const AirLawConventions: React.FC = () => {
    const [damageTier, setDamageTier] = useState<number>(128821);
    const [usdRate, setUsdRate] = useState(1.32); // Mock current SDR to USD rate

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 animate-in fade-in duration-500">
            <header className="max-w-6xl mx-auto mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-red-500/20 text-red-500 rounded-2xl border border-red-500/30">
                        <Shield size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Montreal & Warsaw Conventions</h1>
                        <p className="text-slate-500 text-sm uppercase tracking-widest font-semibold">
                            International Carrier Liability & Passenger Rights
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto space-y-12">
                {/* SDR Calculator */}
                <section className="bg-slate-900/50 border border-white/5 p-8 rounded-3xl backdrop-blur-xl group">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                        <h2 className="text-xl font-bold">Montreal Liability Calculator</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 block">Special Drawing Rights (SDR)</label>
                            <input
                                type="number"
                                value={damageTier}
                                onChange={(e) => setDamageTier(parseInt(e.target.value) || 0)}
                                className="w-full bg-slate-950 border border-slate-800 p-6 rounded-2xl text-3xl font-mono font-bold text-red-500 focus:border-red-500/50 outline-none transition-all"
                            />
                            <div className="mt-4 flex gap-2">
                                {[128821, 1000, 19].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setDamageTier(val)}
                                        className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-[10px] font-bold text-slate-400 transition-colors"
                                    >
                                        Set to {val.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="p-8 bg-slate-950/50 rounded-2xl border border-slate-800 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5 text-green-500 rotate-12">
                                <TrendingUp size={100} />
                            </div>
                            <div className="relative z-10">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Estimated Value (USD)</div>
                                <div className="text-5xl font-mono font-bold text-white">${(damageTier * usdRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                                <p className="mt-4 text-xs text-slate-500 italic">
                                    *Based on a mock index rate of 1 SDR = ${usdRate} USD. Montreal limits are revised every 5 years.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Comparison Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="grid md:grid-cols-2">
                        <div className="p-8 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/30">
                            <h3 className="text-xl font-bold mb-6 text-slate-400 flex items-center gap-2">
                                <Scale size={20} />
                                Warsaw Convention (1929)
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm text-slate-500 line-through decoration-red-500/50">
                                    <AlertCircle className="shrink-0" size={18} />
                                    <span>Presumed liability for death or injury.</span>
                                </li>
                                <li className="flex gap-3 text-sm text-slate-500">
                                    <AlertCircle className="shrink-0" size={18} />
                                    <span>Limits for liability: 125,000 Poincaré gold francs.</span>
                                </li>
                                <li className="flex gap-3 text-sm text-slate-500">
                                    <AlertCircle className="shrink-0" size={18} />
                                    <span>Focus on documentation (Tickets/Air Waybills).</span>
                                </li>
                            </ul>
                        </div>
                        <div className="p-8 relative">
                            <div className="absolute top-4 right-4 items-center">
                                <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-[10px] font-bold uppercase tracking-tighter">Current Standard</span>
                            </div>
                            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                                <Gavel className="text-red-500" size={20} />
                                Montreal Convention (1999)
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm text-slate-300">
                                    <TrendingUp className="text-green-500 shrink-0" size={18} />
                                    <span>Strict Liability up to 128,821 SDR (Special Drawing Rights).</span>
                                </li>
                                <li className="flex gap-3 text-sm text-slate-300">
                                    <TrendingUp className="text-green-500 shrink-0" size={18} />
                                    <span>Unlimited liability for damages above the tier if fault is proven.</span>
                                </li>
                                <li className="flex gap-3 text-sm text-slate-300">
                                    <TrendingUp className="text-green-500 shrink-0" size={18} />
                                    <span>Electronic documentation (tickets) recognized as valid.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Regulation EC 261/2004 */}
                <div className="bg-red-950/20 border border-red-500/10 p-8 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 text-red-500 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                        <User size={120} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            Passenger Rights (EC 261/2004)
                        </h3>
                        <p className="text-slate-400 mb-8 max-w-2xl text-sm leading-relaxed italic">
                            Applying to all flights departing from EU airports or arriving into the EU on an EU carrier.
                        </p>
                        <div className="grid md:grid-cols-3 gap-6 text-sm">
                            <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                                <h4 className="font-bold mb-2">Denial of Boarding</h4>
                                <p className="text-slate-500">Overbooking requires volunteers and financial compensation.</p>
                            </div>
                            <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                                <h4 className="font-bold mb-2">Cancellations</h4>
                                <p className="text-slate-500">Refund, rerouting, and compensation (unless extraord. circ.).</p>
                            </div>
                            <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                                <h4 className="font-bold mb-2">Significant Delay</h4>
                                <p className="text-slate-500">Duty of care (meals/comms) after 2-4 hours based on distance.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AirLawConventions;
