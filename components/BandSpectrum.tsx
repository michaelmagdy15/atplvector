import React from 'react';
import { Radio } from 'lucide-react';

const bands = [
    { name: 'VLF', range: '3-30 kHz', wave: 'Very Long', km: '100-10km', use: 'Submarine' },
    { name: 'LF', range: '30-300 kHz', wave: 'Long', km: '10-1km', use: 'NDB' },
    { name: 'MF', range: '300-3000 kHz', wave: 'Medium', km: '1km-100m', use: 'Commercial Radio / NDB' },
    { name: 'HF', range: '3-30 MHz', wave: 'Short', km: '100-10m', use: 'Oceanic' },
    { name: 'VHF', range: '30-300 MHz', wave: 'Very Short', km: '10-1m', use: 'Civil Voice / VOR' },
    { name: 'UHF', range: '300-3000 MHz', wave: 'Ultra Short', km: '1m-10cm', use: 'Military / DME / GPS' },
    { name: 'SHF', range: '3-30 GHz', wave: 'Super Short', km: '10-1cm', use: 'Radar / Satcom' },
    { name: 'EHF', range: '30-300 GHz', wave: 'Extremely Short', km: '1cm-1mm', use: 'Experimental' },
];

const BandSpectrum: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto overflow-x-auto pb-6">
            <h2 className="text-2xl font-bold text-white mb-6 sticky left-0">Frequency Spectrum</h2>
            <div className="flex space-x-4 min-w-max px-4">
                {bands.map((band, idx) => (
                    <div key={band.name} className="w-48 flex-shrink-0 group">
                        <div className={`h-40 rounded-xl p-6 flex flex-col justify-between transition-all hover:scale-105 hover:shadow-xl relative overflow-hidden
                            ${idx % 2 === 0 ? 'bg-slate-800 text-white' : 'bg-white border-2 border-slate-200 text-slate-800'}
                        `}>
                            <div className="font-black text-4xl opacity-20 absolute top-[-10px] right-[-10px]">{idx + 1}</div>
                            <div>
                                <h3 className="text-2xl font-black">{band.name}</h3>
                                <p className="text-xs font-mono opacity-70">{band.range}</p>
                            </div>
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider mb-1">Wavelength</div>
                                <div className="text-sm font-semibold">{band.km}</div>
                            </div>
                        </div>
                        <div className="mt-3 bg-sky-50 p-3 rounded-lg border border-sky-100 text-sm text-slate-600">
                            <strong>Use:</strong> {band.use}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BandSpectrum;