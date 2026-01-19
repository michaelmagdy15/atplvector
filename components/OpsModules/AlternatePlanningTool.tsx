import React, { useState, useEffect } from 'react';
import { Fuel, Map, Clock, Plane, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const AlternatePlanningTool: React.FC = () => {
    // Flight parameters
    const [flightTime, setFlightTime] = useState<number>(5); // hours
    const [runwaysAvailable, setRunwaysAvailable] = useState<number>(1);
    const [ceiling, setCeiling] = useState<number>(2500); // ft
    const [visibility, setVisibility] = useState<number>(6000); // m
    const [isIsolated, setIsIsolated] = useState<boolean>(false);
    const [hasWeatherInfo, setHasWeatherInfo] = useState<boolean>(true);
    const [forecastBelowMinima, setForecastBelowMinima] = useState<boolean>(false);

    // Calculate required alternates
    const [alternatesRequired, setAlternatesRequired] = useState<number>(1);
    const [reason, setReason] = useState<string>('');

    useEffect(() => {
        let alts = 1;
        let reasonText = "Standard: 1 destination alternate required for IFR.";

        // Check if no alternate needed
        if (flightTime < 6) {
            if (runwaysAvailable >= 2 || (ceiling >= 2000 && visibility >= 5000)) {
                alts = 0;
                reasonText = "No alternate needed: Flight <6hrs AND (2+ runways OR ceiling ≥2000ft + vis ≥5km)";
            }
        }

        // Check if isolated
        if (isIsolated) {
            alts = 0;
            reasonText = "Isolated Aerodrome: No destination alternate. 2hr additional fuel required.";
        }

        // Check if 2 alternates needed
        if (!isIsolated) {
            if (!hasWeatherInfo) {
                alts = 2;
                reasonText = "2 alternates required: No weather information available.";
            } else if (forecastBelowMinima) {
                alts = 2;
                reasonText = "2 alternates required: Weather forecast below planning minima ±1hr ETA.";
            }
        }

        setAlternatesRequired(alts);
        setReason(reasonText);
    }, [flightTime, runwaysAvailable, ceiling, visibility, isIsolated, hasWeatherInfo, forecastBelowMinima]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-2">
                <Map className="w-8 h-8 text-blue-400" />
                <div>
                    <h2 className="text-2xl font-bold text-white">Alternate Planning Calculator</h2>
                    <p className="text-slate-400 text-sm">Determine how many alternates you need.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Inputs */}
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 space-y-5">
                    <h3 className="font-bold text-white border-b border-slate-700 pb-2">Flight Parameters</h3>

                    <div>
                        <label className="text-xs text-slate-400 block mb-2">Flight Time (hours)</label>
                        <input
                            type="range"
                            min="1"
                            max="15"
                            value={flightTime}
                            onChange={(e) => setFlightTime(Number(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>1 hr</span>
                            <span className="text-blue-400 font-bold">{flightTime} hrs</span>
                            <span>15 hrs</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 block mb-2">Separate Runways at Destination</label>
                        <div className="flex gap-2">
                            {[1, 2, 3].map(n => (
                                <button
                                    key={n}
                                    onClick={() => setRunwaysAvailable(n)}
                                    className={`flex-1 py-2 rounded-lg font-bold transition-all ${runwaysAvailable === n
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-slate-900 border border-slate-700 text-slate-400 hover:bg-slate-800'
                                        }`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-400 block mb-2">Ceiling (ft)</label>
                            <input
                                type="number"
                                value={ceiling}
                                onChange={(e) => setCeiling(Number(e.target.value))}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 block mb-2">Visibility (m)</label>
                            <input
                                type="number"
                                value={visibility}
                                onChange={(e) => setVisibility(Number(e.target.value))}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer bg-slate-900 p-3 rounded-lg border border-slate-700 hover:border-blue-500">
                            <input
                                type="checkbox"
                                checked={isIsolated}
                                onChange={(e) => setIsIsolated(e.target.checked)}
                                className="accent-blue-500 w-4 h-4"
                            />
                            <span className="text-sm text-white font-bold">Isolated Aerodrome</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer bg-slate-900 p-3 rounded-lg border border-slate-700 hover:border-blue-500">
                            <input
                                type="checkbox"
                                checked={!hasWeatherInfo}
                                onChange={(e) => setHasWeatherInfo(!e.target.checked)}
                                className="accent-blue-500 w-4 h-4"
                            />
                            <span className="text-sm text-white font-bold">No Weather Info Available</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer bg-slate-900 p-3 rounded-lg border border-slate-700 hover:border-blue-500">
                            <input
                                type="checkbox"
                                checked={forecastBelowMinima}
                                onChange={(e) => setForecastBelowMinima(e.target.checked)}
                                className="accent-blue-500 w-4 h-4"
                            />
                            <span className="text-sm text-white font-bold">Forecast Below Planning Minima</span>
                        </label>
                    </div>
                </div>

                {/* Result */}
                <div className="flex flex-col justify-center">
                    <div className={`rounded-2xl p-8 border-2 text-center transition-all duration-300 ${alternatesRequired === 0
                            ? 'bg-emerald-950/50 border-emerald-500'
                            : alternatesRequired === 1
                                ? 'bg-blue-950/50 border-blue-500'
                                : 'bg-orange-950/50 border-orange-500'
                        }`}>
                        <div className="text-slate-400 text-sm uppercase font-bold mb-2">Alternates Required</div>
                        <div className="text-7xl font-black text-white mb-4">{alternatesRequired}</div>
                        <div className={`text-lg ${alternatesRequired === 0 ? 'text-emerald-300' : alternatesRequired === 1 ? 'text-blue-300' : 'text-orange-300'
                            }`}>
                            {reason}
                        </div>
                    </div>

                    {isIsolated && (
                        <div className="mt-4 bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/30 flex items-center gap-3">
                            <AlertCircle className="text-yellow-400 shrink-0" />
                            <p className="text-sm text-yellow-200">
                                Remember: Isolated aerodrome requires <strong>2 hours additional fuel</strong> at normal cruise consumption.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Take-Off Alternate Rules */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Plane className="w-5 h-5 text-indigo-400" />
                    Take-Off Alternate
                </h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-300">
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <h4 className="font-bold text-white mb-2">When Required?</h4>
                        <p>If it's <strong>impossible to return</strong> to the departure aerodrome due to weather or runway condition.</p>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <h4 className="font-bold text-white mb-2">If No Take-Off Alternate Available?</h4>
                        <p>Conditions at departure must be <strong>better than required</strong> for landing with an available instrument approach (AEO).</p>
                    </div>
                </div>
            </div>

            {/* Distance Rules */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-400" />
                    Maximum Distance to Alternate (Non-ETOPS)
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <div className="text-xs text-slate-500 uppercase mb-1">Performance Class A</div>
                        <div className="text-xl font-bold text-white">MOPSC ≥20 or MCTOM &gt;45,360kg</div>
                        <div className="text-2xl font-black text-blue-400 mt-2">60 mins</div>
                        <div className="text-xs text-slate-400">at OEI cruise speed</div>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                        <div className="text-xs text-slate-500 uppercase mb-1">Performance Class B & C</div>
                        <div className="text-xl font-bold text-white">MOPSC ≤19 or MCTOM &lt;45,360kg</div>
                        <div className="text-2xl font-black text-emerald-400 mt-2">120 mins or 300nm</div>
                        <div className="text-xs text-slate-400">whichever is least</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlternatePlanningTool;
