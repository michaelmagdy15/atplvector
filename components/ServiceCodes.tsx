import React, { useState } from 'react';
import { Clock, Sun, Moon, Calendar } from 'lucide-react';

const codes = [
    { code: 'H24', label: 'Continuous Day & Night', desc: 'Service available 24 hours a day.', icon: Clock },
    { code: 'HJ', label: 'Sunrise to Sunset', desc: 'Service available during daylight hours.', icon: Sun },
    { code: 'HN', label: 'Sunset to Sunrise', desc: 'Service available during night hours.', icon: Moon },
    { code: 'HS', label: 'Scheduled Operations', desc: 'Service available during hours of scheduled flights.', icon: Calendar },
    { code: 'HX', label: 'No Specific Hours', desc: 'Working hours are not specified.', icon: Clock },
    { code: 'HR', label: 'Hours', desc: 'Service available during unspecified operational hours.', icon: Clock },
];

const ServiceCodes: React.FC = () => {
    const [selected, setSelected] = useState(codes[0]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-white">Service Availability Codes</h2>
                <p className="text-slate-400">Definitions for Aerodrome Services (Page 3)</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {codes.map((c) => (
                    <button
                        key={c.code}
                        onClick={() => setSelected(c)}
                        className={`p-4 rounded-xl border-2 text-left transition-all
                            ${selected.code === c.code 
                                ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-200' 
                                : 'border-slate-200 bg-white hover:border-slate-300'}
                        `}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-black text-xl text-slate-800">{c.code}</span>
                            <c.icon className={`w-5 h-5 ${selected.code === c.code ? 'text-sky-600' : 'text-slate-400'}`} />
                        </div>
                        <div className="text-xs font-bold text-slate-500 uppercase">{c.label}</div>
                    </button>
                ))}
            </div>

            <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 p-32 bg-sky-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
                        <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center border-4 border-sky-500 shadow-lg">
                            <selected.icon className="w-16 h-16 text-sky-400" />
                        </div>
                    </div>
                    <div className="md:w-2/3 md:pl-8 text-center md:text-left">
                        <h3 className="text-3xl font-bold mb-2">{selected.code} - {selected.label}</h3>
                        <p className="text-slate-300 text-lg leading-relaxed">{selected.desc}</p>
                    </div>
                </div>

                {/* Timeline Visualizer */}
                <div className="mt-12">
                    <div className="flex justify-between text-xs text-slate-500 font-mono mb-2 uppercase">
                        <span>00:00</span>
                        <span>06:00</span>
                        <span>12:00</span>
                        <span>18:00</span>
                        <span>24:00</span>
                    </div>
                    <div className="h-4 bg-slate-800 rounded-full overflow-hidden relative">
                        {/* 24H Bar */}
                        {selected.code === 'H24' && <div className="absolute inset-0 bg-green-500"></div>}
                        {selected.code === 'HJ' && <div className="absolute left-1/4 right-1/4 top-0 bottom-0 bg-yellow-500"></div>}
                        {selected.code === 'HN' && (
                            <>
                                <div className="absolute left-0 w-1/4 top-0 bottom-0 bg-indigo-500"></div>
                                <div className="absolute right-0 w-1/4 top-0 bottom-0 bg-indigo-500"></div>
                            </>
                        )}
                        {['HS','HX','HR'].includes(selected.code) && (
                            <div className="absolute inset-0 bg-slate-700 flex items-center justify-center text-[10px] font-bold tracking-widest">VARIES / UNSPECIFIED</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCodes;