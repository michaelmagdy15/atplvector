import React, { useState } from 'react';
import { Package, Box, Briefcase, Truck, Info, Grid } from 'lucide-react';

const CargoTypes: React.FC = () => {
    const [selectedType, setSelectedType] = useState<string>('palletised');

    const cargoTypes = [
        {
            id: 'palletised',
            name: 'Palletised Cargo',
            description: 'Individual pieces placed on standard pallets and secured by nets.',
            icon: <Grid size={32} />,
            color: 'amber',
            examples: ['Heavy machinery', 'Automotive parts', 'Industrial equipment']
        },
        {
            id: 'containerised',
            name: 'Containerised Cargo',
            description: 'Normal baggage placed into standard-size containers (ULDs).',
            icon: <Box size={32} />,
            color: 'cyan',
            examples: ['Passenger baggage', 'General cargo', 'Mail']
        },
        {
            id: 'bulk',
            name: 'Bulk Cargo',
            description: 'Late baggage and crew bags loaded directly into the hold.',
            icon: <Briefcase size={32} />,
            color: 'emerald',
            examples: ['Late check-in bags', 'Crew baggage', 'Rush cargo']
        },
        {
            id: 'baggage',
            name: 'Baggage',
            description: 'Personal belongings of passengers.',
            icon: <Package size={32} />,
            color: 'violet',
            examples: ['Suitcases', 'Sports equipment', 'Personal items']
        }
    ];

    const selectedCargo = cargoTypes.find(c => c.id === selectedType);

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-orange-500/10 rounded-full mb-4">
                    <Truck className="w-8 h-8 text-orange-400" />
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                    Cargo <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Classifications</span>
                </h1>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cargoTypes.map(cargo => (
                    <button
                        key={cargo.id}
                        onClick={() => setSelectedType(cargo.id)}
                        className={`p-6 rounded-2xl border-2 transition-all hover:scale-105 ${selectedType === cargo.id
                                ? 'bg-slate-700 border-white shadow-lg'
                                : 'bg-slate-800/50 border-slate-700'
                            }`}
                    >
                        <div className={`mb-4 ${selectedType === cargo.id ? 'text-white' : 'text-slate-400'}`}>
                            {cargo.icon}
                        </div>
                        <h3 className="font-bold text-sm text-white">{cargo.name}</h3>
                    </button>
                ))}
            </div>

            {selectedCargo && (
                <div className="bg-slate-800 border border-slate-600 rounded-2xl p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-4 bg-slate-700 rounded-xl text-white">{selectedCargo.icon}</div>
                        <h2 className="text-2xl font-bold text-white">{selectedCargo.name}</h2>
                    </div>
                    <p className="text-slate-300 text-lg mb-6">{selectedCargo.description}</p>
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Examples</h4>
                        <div className="flex flex-wrap gap-2">
                            {selectedCargo.examples.map((ex, i) => (
                                <span key={i} className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm">{ex}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                    <Info size={20} /> Loading Formulas
                </h3>
                <ul className="text-sm text-slate-300 space-y-2">
                    <li>• <strong>Floor Loading:</strong> Mass / Area (use largest 2 sides)</li>
                    <li>• <strong>Running Load:</strong> Mass / Length (use longest side)</li>
                </ul>
            </div>
        </div>
    );
};

export default CargoTypes;
