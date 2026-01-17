import React, { useState } from 'react';
import { Book, Globe, Radio } from 'lucide-react';

const definitions = [
    { term: 'Aeronautical Station', def: 'A land station in the aeronautical mobile service. In certain instances, an aeronautical station may be located, for example, on board a ship or on a platform at sea.', icon: Radio },
    { term: 'Aircraft Station', def: 'A mobile station in the aeronautical mobile service, other than a survival craft station, located on board an aircraft.', icon: Globe },
    { term: 'Aeronautical Fixed Service (AFS)', def: 'A telecommunication service between specified fixed points provided primarily for the safety of air navigation and for the regular, efficient and economical operation of air services.', icon: Book },
    { term: 'Aeronautical Mobile Service', def: 'A mobile service between aeronautical stations and aircraft stations, or between aircraft stations, in which survival craft stations may participate.', icon: Radio },
    { term: 'Blind Transmission', def: 'A transmission from one station to another station in circumstances where two-way communication cannot be established but where it is believed that the called station is able to receive the transmission.', icon: Radio },
    { term: 'Readback', def: 'A procedure whereby the receiving station repeats a received message or an appropriate part thereof back to the transmitting station so as to obtain confirmation of correct reception.', icon: Book },
];

const CommsDefinitions: React.FC = () => {
    const [search, setSearch] = useState('');

    const filtered = definitions.filter(d => d.term.toLowerCase().includes(search.toLowerCase()) || d.def.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8 border-b border-slate-200 pb-6">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Definitions</h2>
                <p className="text-slate-500">Key terms for VFR/IFR Communications (090.01)</p>
            </div>

            <div className="relative mb-8">
                <input
                    type="text"
                    placeholder="Search definitions..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full p-4 pl-12 bg-white rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <Book className="absolute left-4 top-4 text-slate-400" />
            </div>

            <div className="space-y-4">
                {filtered.map((d, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex gap-6">
                        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center shrink-0">
                            <d.icon className="text-indigo-600" size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">{d.term}</h3>
                            <p className="text-slate-600 leading-relaxed">{d.def}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommsDefinitions;
