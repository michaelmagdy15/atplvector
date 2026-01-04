
import React from 'react';
import { Cloud, ArrowUp } from 'lucide-react';

const AtmosphereLayers: React.FC = () => {
    const layers = [
        { name: 'Thermosphere', height: '85km+', temp: 'Rising', feat: 'Auroras' },
        { name: 'Mesosphere', height: '50-85km', temp: '-90°C', feat: 'Meteors burn up' },
        { name: 'Stratosphere', height: '11-50km', temp: 'Isothermal/Rising', feat: 'Ozone Layer, Jet Streams' },
        { name: 'Troposphere', height: '0-11km', temp: '-2°C/1000ft', feat: 'Weather, Clouds' }
    ];

    return (
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700 mt-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Cloud className="text-sky-400" /> The Atmosphere
            </h2>

            <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-blue-500 to-sky-300"></div>
                
                <div className="space-y-4 ml-16">
                    {layers.map((layer) => (
                        <div key={layer.name} className="bg-slate-900 p-4 rounded-lg border border-slate-700 hover:border-sky-500 transition-colors">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-bold text-white text-lg">{layer.name}</h3>
                                <span className="text-xs font-mono text-slate-400">{layer.height}</span>
                            </div>
                            <div className="flex gap-4 text-sm text-slate-300">
                                <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                    Temp: {layer.temp}
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    {layer.feat}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 p-4 bg-sky-900/30 border border-sky-800 rounded-lg text-sm text-sky-200">
                <strong>ISA (International Standard Atmosphere):</strong> MSL Temp +15°C, Pressure 1013.25 hPa, Lapse Rate -1.98°C/1000ft. Tropopause at 36,090ft (-56.5°C).
            </div>
        </div>
    );
};

export default AtmosphereLayers;
