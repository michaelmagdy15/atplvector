
import React, { useState } from 'react';
import { Globe, MapPin, Wind } from 'lucide-react';

const AirMasses: React.FC = () => {
    const [selectedMass, setSelectedMass] = useState<string | null>(null);

    const airMasses = [
        { id: 'mPw', name: 'Polar Maritime', code: 'mPm', origin: 'North Atlantic', temp: 'Cool', humidity: 'Moist', wx: 'Showers, good vis, unstable' },
        { id: 'mTw', name: 'Tropical Maritime', code: 'mTm', origin: 'Azores', temp: 'Warm', humidity: 'Moist', wx: 'Drizzle, low stratus, stable' },
        { id: 'cPc', name: 'Polar Continental', code: 'cPc', origin: 'Siberia/Scandinavia', temp: 'Cold', humidity: 'Dry', wx: 'Clear skies, frost, radiation fog (Winter)' },
        { id: 'cTc', name: 'Tropical Continental', code: 'cTc', origin: 'North Africa', temp: 'Hot', humidity: 'Dry', wx: 'Haze, heatwaves, stable' },
        { id: 'mAm', name: 'Arctic Maritime', code: 'mAm', origin: 'Arctic Ocean', temp: 'Very Cold', humidity: 'Moist', wx: 'Heavy snow showers, unstable' },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Map Representation (Abstract) */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl relative min-h-[400px] flex items-center justify-center">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/4/4b/Europe_blank_laea_location_map.svg')] bg-cover bg-center" style={{ filter: 'invert(1)' }}></div>

                    {/* Air Mass Nodes */}
                    <div className="absolute top-10 w-full flex justify-center">
                        <MassNode data={airMasses[4]} onClick={() => setSelectedMass('mAm')} isSelected={selectedMass === 'mAm'} />
                    </div>

                    <div className="absolute top-20 right-10">
                        <MassNode data={airMasses[2]} onClick={() => setSelectedMass('cPc')} isSelected={selectedMass === 'cPc'} />
                    </div>

                    <div className="absolute bottom-20 right-10">
                        <MassNode data={airMasses[3]} onClick={() => setSelectedMass('cTc')} isSelected={selectedMass === 'cTc'} />
                    </div>

                    <div className="absolute bottom-20 left-10">
                        <MassNode data={airMasses[1]} onClick={() => setSelectedMass('mTw')} isSelected={selectedMass === 'mTw'} />
                    </div>

                    <div className="absolute top-1/2 left-10 -translate-y-1/2">
                        <MassNode data={airMasses[0]} onClick={() => setSelectedMass('mPw')} isSelected={selectedMass === 'mPw'} />
                    </div>

                    <div className="bg-slate-950 p-2 rounded border border-slate-700 text-xs text-slate-500 z-10">
                        Select an origin point
                    </div>
                </div>

                {/* Details Panel */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Globe className="text-rose-400" /> Air Masses
                    </h3>

                    {selectedMass ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            {airMasses.filter(m => m.id === selectedMass).map(mass => (
                                <div key={mass.id} className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-3xl font-black text-white">{mass.name}</h2>
                                        <span className="text-2xl font-mono text-rose-400 font-bold bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">{mass.code}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-950 rounded-xl">
                                            <div className="text-xs text-slate-500 uppercase font-bold">Origin</div>
                                            <div className="text-white font-medium">{mass.origin}</div>
                                        </div>
                                        <div className="p-4 bg-slate-950 rounded-xl">
                                            <div className="text-xs text-slate-500 uppercase font-bold">Temperature</div>
                                            <div className="text-white font-medium">{mass.temp}</div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                                        <div className="text-xs text-slate-400 uppercase font-bold mb-2">Typical Weather (UK/Europe)</div>
                                        <p className="text-lg text-white leading-relaxed">{mass.wx}</p>
                                    </div>

                                    <div className="text-xs text-slate-500 p-4 bg-slate-950 rounded-lg">
                                        <span className="font-bold text-rose-400">Key Concept: </span>
                                        Air masses assume the characteristics of their source region.
                                        Modification occurs as they travel over land/sea.
                                        Example: Cold air moving over warm sea becomes <strong>Unstable</strong> (bubbling up).
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-500 opacity-50">
                            <Wind size={48} className="mb-4" />
                            <p>Select a region on the map</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const MassNode = ({ data, onClick, isSelected }: { data: any, onClick: () => void, isSelected: boolean }) => (
    <button
        onClick={onClick}
        className={`group flex flex-col items-center gap-2 transition-all ${isSelected ? 'scale-110' : 'hover:scale-110'}`}
    >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 shadow-xl z-20 ${isSelected
                ? 'bg-rose-500 border-white text-white'
                : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-rose-400 hover:text-rose-400'
            }`}>
            <MapPin size={20} fill={isSelected ? "currentColor" : "none"} />
        </div>
        <div className={`px-2 py-1 rounded text-xs font-bold transition-colors ${isSelected ? 'bg-white text-slate-900' : 'bg-slate-950 text-slate-500'
            }`}>
            {data.code}
        </div>
    </button>
);

export default AirMasses;
