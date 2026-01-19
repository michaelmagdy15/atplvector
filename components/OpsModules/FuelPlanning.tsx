import React, { useState, useEffect } from 'react';
import { Fuel, ArrowRight, Plane, CloudLightning, AlertTriangle } from 'lucide-react';

const FuelPlanning: React.FC = () => {
    // Inputs
    const [engineType, setEngineType] = useState<'jet' | 'piston'>('jet');
    const [tripFuel, setTripFuel] = useState<number>(5000);
    const [taxiFuel, setTaxiFuel] = useState<number>(200);
    const [alternateFuel, setAlternateFuel] = useState<number>(1500);
    const [holdingFuelFlow, setHoldingFuelFlow] = useState<number>(2400); // kg/hr
    const [isIsolated, setIsIsolated] = useState<boolean>(false);
    const [extraTime, setExtraTime] = useState<number>(0); // minutes

    // Calculated
    const [contingency, setContingency] = useState<number>(0);
    const [finalReserve, setFinalReserve] = useState<number>(0);
    const [additional, setAdditional] = useState<number>(0);
    const [extra, setExtra] = useState<number>(0);
    const [blockFuel, setBlockFuel] = useState<number>(0);

    useEffect(() => {
        // 1. Contingency: Higher of 5% of Trip or 5 mins holding
        const contPerc = tripFuel * 0.05;
        const contTime = (holdingFuelFlow / 60) * 5;
        setContingency(isIsolated ? 0 : Math.max(contPerc, contTime)); // Reduced contingency not fully modeled here, stick to standard. 
        // Note: Isolated aerodrome usually requires PNR calculation, but standard rules:
        // Isolated: 2 hours cruise consumption as Additional Fuel.

        // 2. Final Reserve
        // Jet: 30 mins @ 1500ft (approx holding)
        // Piston: 45 mins
        const frTime = engineType === 'jet' ? 30 : 45;
        const frFuel = (holdingFuelFlow / 60) * frTime;
        setFinalReserve(frFuel);

        // 3. Additional (Isolated)
        let addFuel = 0;
        if (isIsolated) {
            // Simplification: Using holding flow as proxy for "Normal Cruise" for this demo or adding fixed amount
            // PDF says: "Additional fuel (isolated aerodromes) is 2 hours normal cruise consumption"
            // We'll use holding flow * 2 hrs as a safe approximation for the UI
            addFuel = holdingFuelFlow * 2;
        }
        setAdditional(addFuel);

        // 4. Extra
        const exFuel = (holdingFuelFlow / 60) * extraTime;
        setExtra(exFuel);

        // Total
        // If isolated, usually don't need Alternate.
        // Block = Taxi + Trip + Contingency + Alternate + Final Reserve + Additional + Extra
        const altConfigured = isIsolated ? 0 : alternateFuel;
        setBlockFuel(taxiFuel + tripFuel + (isIsolated ? 0 : Math.max(contPerc, contTime)) + altConfigured + frFuel + addFuel + exFuel);

    }, [tripFuel, taxiFuel, alternateFuel, holdingFuelFlow, engineType, isIsolated, extraTime]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-2">
                <Fuel className="w-8 h-8 text-blue-400" />
                <div>
                    <h2 className="text-2xl font-bold text-white">Fuel Policy Calculator</h2>
                    <p className="text-slate-400 text-sm">Calculate required block fuel based on OPS rules.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-4 bg-slate-800/30 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold text-white border-b border-slate-700 pb-2 mb-4">Flight Parameters</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 flex gap-4 p-1 bg-slate-900 rounded-lg w-fit">
                            <button
                                onClick={() => setEngineType('jet')}
                                className={`px-4 py-1.5 rounded text-sm font-bold transition-all ${engineType === 'jet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                Jet / Turboprop
                            </button>
                            <button
                                onClick={() => setEngineType('piston')}
                                className={`px-4 py-1.5 rounded text-sm font-bold transition-all ${engineType === 'piston' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                Piston
                            </button>
                        </div>

                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Trip Fuel (kg)</label>
                            <input type="number" value={tripFuel} onChange={e => setTripFuel(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Taxi Fuel (kg)</label>
                            <input type="number" value={taxiFuel} onChange={e => setTaxiFuel(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                        </div>

                        <div className={`transition-opacity ${isIsolated ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                            <label className="text-xs text-slate-400 block mb-1">Alternate Fuel (kg)</label>
                            <input type="number" value={alternateFuel} onChange={e => setAlternateFuel(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                        </div>

                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Holding Flow (kg/hr)</label>
                            <input type="number" value={holdingFuelFlow} onChange={e => setHoldingFuelFlow(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                        </div>

                        <div className="col-span-2">
                            <label className="flex items-center gap-2 cursor-pointer bg-slate-900 p-3 rounded border border-slate-700 hover:border-blue-500">
                                <input type="checkbox" checked={isIsolated} onChange={e => setIsIsolated(e.target.checked)} className="accent-blue-500" />
                                <span className="text-sm font-bold text-white">Isolated Aerodrome Procedure</span>
                            </label>
                            {isIsolated && <p className="text-xs text-yellow-500 mt-1 ml-1">Requires 2 Hours Additional Fuel. No Destination Alternate.</p>}
                        </div>

                        <div className="col-span-2">
                            <label className="text-xs text-slate-400 block mb-1">Extra Fuel (Minutes)</label>
                            <input type="range" min="0" max="120" value={extraTime} onChange={e => setExtraTime(Number(e.target.value))} className="w-full accent-blue-500" />
                            <div className="text-right text-xs text-blue-400 font-bold">{extraTime} mins</div>
                        </div>
                    </div>
                </div>

                {/* Output */}
                <div className="space-y-4">
                    <h3 className="font-bold text-white border-b border-slate-700 pb-2 mb-4">Fuel Log</h3>

                    <div className="bg-white text-slate-900 rounded-lg overflow-hidden font-mono text-sm shadow-xl">
                        <Row label="TAXI" value={taxiFuel} note="Startup & Taxi" />
                        <Row label="TRIP" value={tripFuel} note="T/O to Dest Landing" />
                        <Row
                            label="CONTINGENCY"
                            value={contingency}
                            note={isIsolated ? "Included in Trip/Add" : `Higher of 5% Trip or 5min Hold`}
                            highlight
                        />
                        {!isIsolated && <Row label="ALTERNATE" value={alternateFuel} note="Dest Missed App -> Alt Landing" />}
                        {isIsolated && <Row label="ADDITIONAL" value={additional} note="2 Hours Cruise (Isolated)" highlight />}
                        <Row
                            label="FINAL RES"
                            value={finalReserve}
                            note={`${engineType === 'jet' ? '30 min' : '45 min'} Hold @ 1500ft`}
                            className="bg-red-100 text-red-900 font-bold"
                        />
                        {extra > 0 && <Row label="EXTRA" value={extra} note={`Commander's Discretion (${extraTime} min)`} />}

                        <div className="bg-slate-900 text-white p-4 border-t-2 border-slate-800 flex justify-between items-center">
                            <span className="font-bold text-lg">BLOCK FUEL</span>
                            <span className="font-mono text-2xl text-green-400">{Math.round(blockFuel)} kg</span>
                        </div>
                    </div>

                    <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30 flex gap-3">
                        <AlertTriangle className="text-blue-400 shrink-0" />
                        <p className="text-xs text-blue-200">
                            Minimum fuel at touchdown at the destination alternate (or destination if no alternate required) must be the <strong>FINAL RESERVE</strong>. Landing with less is a declared emergency.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Row = ({ label, value, note, highlight, className = "" }: any) => (
    <div className={`flex justify-between items-center p-3 border-b border-slate-200 last:border-0 ${highlight ? 'bg-yellow-50' : ''} ${className}`}>
        <div className="flex flex-col">
            <span className="font-bold">{label}</span>
            <span className="text-[10px] opacity-60 uppercase">{note}</span>
        </div>
        <span className="font-bold">{Math.round(value)}</span>
    </div>
);

export default FuelPlanning;
