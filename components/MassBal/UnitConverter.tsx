import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowDown, ArrowUp, ArrowLeft, RefreshCw, Scale, Droplet } from 'lucide-react';

const UnitConverter: React.FC = () => {
    // State for inputs
    const [kg, setKg] = useState<number>(1000);
    const [lbs, setLbs] = useState<number>(2205);
    const [litres, setLitres] = useState<number>(1250);
    const [usGal, setUsGal] = useState<number>(330);
    const [impGal, setImpGal] = useState<number>(275);
    const [sg, setSg] = useState<number>(0.8);

    // Active field tracking to prevent loops
    const [lastEdited, setLastEdited] = useState<'kg' | 'lbs' | 'litres' | 'usg' | 'impg' | 'sg'>('kg');

    // Constants
    const KG_TO_LBS = 2.205;
    const USG_TO_LITRE = 3.785; // Approx 3.8 in diagram
    const IMPG_TO_LITRE = 4.546; // Approx 4.55 in diagram
    const IMPG_TO_USG = 1.2;

    // Conversion Logic
    useEffect(() => {
        // When KG changes
        if (lastEdited === 'kg') {
            setLbs(Number((kg * KG_TO_LBS).toFixed(2)));
            setLitres(Number((kg / sg).toFixed(2)));
        }
    }, [kg, lastEdited]);

    useEffect(() => {
        // When LBS changes
        if (lastEdited === 'lbs') {
            setKg(Number((lbs / KG_TO_LBS).toFixed(2)));
        }
    }, [lbs, lastEdited]);

    // Volume Loop Sync
    useEffect(() => {
        if (lastEdited === 'litres') {
            setUsGal(Number((litres / USG_TO_LITRE).toFixed(2)));
            setImpGal(Number((litres / IMPG_TO_LITRE).toFixed(2)));
            setKg(Number((litres * sg).toFixed(2)));
        } else if (lastEdited === 'usg') {
            const l = usGal * USG_TO_LITRE;
            setLitres(Number(l.toFixed(2)));
            setImpGal(Number((usGal / IMPG_TO_USG).toFixed(2)));
        } else if (lastEdited === 'impg') {
            const l = impGal * IMPG_TO_LITRE;
            setLitres(Number(l.toFixed(2)));
            setUsGal(Number((impGal * IMPG_TO_USG).toFixed(2)));
        }
    }, [litres, usGal, impGal, lastEdited]);

    // Recalculate mass if SG changes (keeping volume constant)
    useEffect(() => {
        if (lastEdited === 'sg') {
            setKg(Number((litres * sg).toFixed(2)));
        }
    }, [sg]);

    // Derived update for Kg/Lbs when volume/SG changes indirectly
    useEffect(() => {
        if (['litres', 'usg', 'impg', 'sg'].includes(lastEdited)) {
            setLbs(Number((kg * KG_TO_LBS).toFixed(2)));
        }
    }, [kg]);


    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                    Mass & Volume <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Converter</span>
                </h1>
                <p className="text-slate-400 mt-2">Interactive conversion loop with Specific Gravity.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">

                {/* SG Control - Central Top */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 bg-slate-800 p-4 rounded-xl border border-slate-600 shadow-xl flex items-center gap-4">
                    <div className="text-right">
                        <label className="text-xs font-bold text-slate-400 uppercase block">Specific Gravity</label>
                        <div className="text-[10px] text-slate-500">Density (kg/L)</div>
                    </div>
                    <div className="flex items-center bg-slate-900 rounded-lg p-2 border border-slate-700">
                        <Droplet className="text-cyan-400 mr-2" size={16} />
                        <input
                            type="number" step="0.01"
                            value={sg}
                            onChange={(e) => { setSg(Number(e.target.value)); setLastEdited('sg'); }}
                            className="bg-transparent w-20 text-white font-mono font-bold text-lg text-center outline-none"
                        />
                    </div>
                </div>

                {/* Main Grid Layout replicating the diagram */}
                <div className="grid grid-cols-2 gap-x-24 gap-y-16 mt-16 max-w-3xl mx-auto relative">

                    {/* KG Box */}
                    <div className="relative group">
                        <div className={`p-6 rounded-2xl border-2 transition-all ${lastEdited === 'kg' ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'bg-slate-800 border-slate-600'}`}>
                            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Mass (SI)</label>
                            <div className="flex items-baseline gap-2">
                                <input
                                    type="number" value={kg}
                                    onChange={(e) => { setKg(Number(e.target.value)); setLastEdited('kg'); }}
                                    className="bg-transparent text-3xl font-black text-white w-full outline-none font-mono"
                                />
                                <span className="text-xl font-bold text-indigo-400">kg</span>
                            </div>
                        </div>
                        {/* Connection: Kg <-> Litre */}
                        <div className="absolute top-1/2 -right-24 -translate-y-1/2 flex flex-col items-center w-24">
                            <ArrowLeft className="text-cyan-400" />
                            <div className="text-[10px] font-bold text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-cyan-900 my-1">
                                ÷ SG
                            </div>
                            <div className="w-full h-0.5 bg-slate-700 my-1"></div>
                            <div className="text-[10px] font-bold text-indigo-400 bg-slate-900 px-2 py-0.5 rounded border border-indigo-900 my-1">
                                x SG
                            </div>
                            <ArrowRight className="text-indigo-400" />
                        </div>
                    </div>

                    {/* Litre Box */}
                    <div className="relative">
                        <div className={`p-6 rounded-2xl border-2 transition-all ${lastEdited === 'litres' ? 'bg-cyan-600/20 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-slate-800 border-slate-600'}`}>
                            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Volume (SI)</label>
                            <div className="flex items-baseline gap-2">
                                <input
                                    type="number" value={litres}
                                    onChange={(e) => { setLitres(Number(e.target.value)); setLastEdited('litres'); }}
                                    className="bg-transparent text-3xl font-black text-white w-full outline-none font-mono"
                                />
                                <span className="text-xl font-bold text-cyan-400">L</span>
                            </div>
                        </div>
                        {/* Connection: Litre <-> US Gal */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-16 flex flex-col items-center h-16 justify-center">
                            <ArrowUp className="text-cyan-400" />
                            <div className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 rounded border border-slate-700 z-10">x 3.8</div>
                            <div className="h-full w-0.5 bg-slate-700"></div>
                        </div>
                    </div>

                    {/* LBS Box */}
                    <div className="relative">
                        <div className={`p-6 rounded-2xl border-2 transition-all ${lastEdited === 'lbs' ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'bg-slate-800 border-slate-600'}`}>
                            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Mass (Imp)</label>
                            <div className="flex items-baseline gap-2">
                                <input
                                    type="number" value={lbs}
                                    onChange={(e) => { setLbs(Number(e.target.value)); setLastEdited('lbs'); }}
                                    className="bg-transparent text-3xl font-black text-white w-full outline-none font-mono"
                                />
                                <span className="text-xl font-bold text-indigo-400">lb</span>
                            </div>
                        </div>
                        {/* Connection: Kg <-> Lbs */}
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center h-16 justify-center">
                            <div className="h-full w-0.5 bg-slate-700"></div>
                            <div className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 rounded border border-slate-700 z-10 my-1">x 2.205</div>
                            <ArrowDown className="text-indigo-400" />
                        </div>
                        {/* Connection: Lbs <-> Imp Gal */}
                        <div className="absolute top-1/2 -right-24 -translate-y-1/2 flex flex-col items-center w-24">
                            <ArrowLeft className="text-cyan-400" />
                            <div className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700 my-1">
                                x 10 SG
                            </div>
                            <ArrowRight className="text-indigo-400" />
                        </div>
                    </div>

                    {/* US Gal & Imp Gal Column */}
                    <div className="space-y-8">
                        {/* US Gal */}
                        <div className="relative">
                            <div className={`p-4 rounded-2xl border-2 transition-all ${lastEdited === 'usg' ? 'bg-cyan-600/20 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-slate-800 border-slate-600'}`}>
                                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Volume (US)</label>
                                <div className="flex items-baseline gap-2">
                                    <input
                                        type="number" value={usGal}
                                        onChange={(e) => { setUsGal(Number(e.target.value)); setLastEdited('usg'); }}
                                        className="bg-transparent text-2xl font-black text-white w-full outline-none font-mono"
                                    />
                                    <span className="text-sm font-bold text-cyan-400">US Gal</span>
                                </div>
                            </div>
                            {/* Connection: US Gal <-> Imp Gal */}
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center h-8 justify-center">
                                <ArrowUp className="text-cyan-400 text-xs" size={16} />
                                <div className="text-[10px] font-bold text-slate-400 bg-slate-900 px-1 rounded z-10">x 1.2</div>
                            </div>
                        </div>

                        {/* Imp Gal */}
                        <div className="relative">
                            <div className={`p-4 rounded-2xl border-2 transition-all ${lastEdited === 'impg' ? 'bg-cyan-600/20 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'bg-slate-800 border-slate-600'}`}>
                                <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Volume (Imp)</label>
                                <div className="flex items-baseline gap-2">
                                    <input
                                        type="number" value={impGal}
                                        onChange={(e) => { setImpGal(Number(e.target.value)); setLastEdited('impg'); }}
                                        className="bg-transparent text-2xl font-black text-white w-full outline-none font-mono"
                                    />
                                    <span className="text-sm font-bold text-cyan-400">Imp Gal</span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                {/* Right Side Long Connection (Imp Gal -> Litre) */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 h-48 w-0.5 bg-slate-700 hidden lg:block"></div>
                <div className="absolute right-8 top-16 text-[10px] font-bold text-slate-400 bg-slate-900 px-2 rounded border border-slate-700 hidden lg:block">x 4.546</div>
            </div>
        </div>
    );
};

export default UnitConverter;
