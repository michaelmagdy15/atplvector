
import React, { useState } from 'react';
import { Activity, Signal, Mic, Wifi, Sun } from 'lucide-react';

const TechPhysics: React.FC = () => {
    const [tab, setTab] = useState(0);

    const tabs = [
        { name: 'Refraction', icon: Sun },
        { name: 'Signal Bank', icon: Signal },
        { name: 'Freq Spacing', icon: Activity },
        { name: 'Attenuation', icon: Wifi },
        { name: 'Mic Stuck', icon: Mic },
    ];

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 min-h-[600px] flex flex-col text-black">
            <div className="bg-slate-900 p-4 flex overflow-x-auto scrollbar-hide">
                {tabs.map((t, i) => (
                    <button
                        key={i}
                        onClick={() => setTab(i)}
                        className={`flex items-center px-4 py-2 rounded-lg mr-2 transition-all whitespace-nowrap ${
                            tab === i ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                    >
                        <t.icon className="w-4 h-4 mr-2" />
                        {t.name}
                    </button>
                ))}
            </div>
            <div className="p-8 flex-1 bg-slate-50 text-black">
                {tab === 0 && <RefractionVis />}
                {tab === 1 && <SignalBanking />}
                {tab === 2 && <FreqSpacing />}
                {tab === 3 && <AttenuationMnemonic />}
                {tab === 4 && <MicStuck />}
            </div>
        </div>
    );
};

// 1. Refraction (Page 22)
const RefractionVis = () => {
    const [temp, setTemp] = useState(20);
    
    // Cold air (lower temp) -> More refraction (Super refraction)
    // Warm air -> Standard
    const bend = Math.max(0, 30 - temp) * 2;

    return (
        <div className="text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Atmospheric Refraction</h3>
            <p className="text-slate-600 mb-6">Cold air over warm surface causes super-refraction (extended range).</p>
            
            <div className="relative w-full h-64 bg-sky-100 rounded-xl overflow-hidden border border-sky-200 mb-6">
                <div className="absolute bottom-0 w-full h-12 bg-blue-600 opacity-20"></div>
                <div className="absolute left-10 bottom-10 w-4 h-20 bg-slate-700"></div> {/* Tower */}
                <div className="absolute right-10 bottom-32 w-8 h-4 bg-slate-900"></div> {/* Plane */}
                
                {/* Wave */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path 
                        d={`M 50 180 Q ${200} ${100 + bend} 360 140`} 
                        fill="none" stroke="red" strokeWidth="3" strokeDasharray="5,5"
                    />
                </svg>
                
                <div className="absolute top-4 right-4 bg-white/80 p-2 rounded text-xs font-bold text-slate-800">
                    {temp < 15 ? "SUPER REFRACTION" : "STANDARD PROPAGATION"}
                </div>
            </div>

            <div className="flex items-center justify-center gap-4">
                <span className="text-blue-600 font-bold">Cold</span>
                <input type="range" min="0" max="40" value={temp} onChange={e => setTemp(Number(e.target.value))} className="w-64" />
                <span className="text-red-600 font-bold">Warm</span>
            </div>
        </div>
    );
};

// 2. Signal Banking (Page 21)
const SignalBanking = () => {
    const [bank, setBank] = useState(0);
    const signal = Math.max(0, 100 - Math.abs(bank) * 1.5);

    return (
        <div className="text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Antenna Shielding</h3>
            
            <div className="flex justify-center mb-8">
                <div 
                    className="w-32 h-8 bg-slate-800 rounded transition-transform duration-100"
                    style={{ transform: `rotate(${bank}deg)` }}
                >
                    <div className="w-2 h-4 bg-slate-600 mx-auto -mt-4"></div> {/* Tail */}
                    <div className="w-32 h-2 bg-sky-500 mx-auto mt-8"></div> {/* Wings */}
                </div>
            </div>

            <input type="range" min="-60" max="60" value={bank} onChange={e => setBank(Number(e.target.value))} className="w-full mb-6" />
            
            <div className="w-full bg-slate-200 h-6 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-300 ${signal > 70 ? 'bg-green-500' : signal > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${signal}%` }}
                ></div>
            </div>
            <div className="text-xs text-slate-500 mt-2 font-bold uppercase">Signal Strength</div>
        </div>
    );
};

// 3. Frequency Spacing (Page 12)
const FreqSpacing = () => {
    const [mode, setMode] = useState<'25' | '8.33'>('25');
    
    return (
        <div className="text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Channel Spacing</h3>
            
            <div className="flex justify-center gap-4 mb-8">
                <button onClick={() => setMode('25')} className={`px-4 py-2 rounded font-bold ${mode === '25' ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-800'}`}>25 kHz</button>
                <button onClick={() => setMode('8.33')} className={`px-4 py-2 rounded font-bold ${mode === '8.33' ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-800'}`}>8.33 kHz</button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden text-black">
                <div className="p-3 border-b border-slate-100 font-bold bg-slate-50">Next Channels from 118.000</div>
                {mode === '25' ? (
                    <div className="divide-y divide-slate-100">
                        <div className="p-3 font-mono">118.000</div>
                        <div className="p-3 font-mono">118.025</div>
                        <div className="p-3 font-mono">118.050</div>
                        <div className="p-3 font-mono">118.075</div>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        <div className="p-3 font-mono">118.000 (118.005)</div>
                        <div className="p-3 font-mono text-sky-600 font-bold">118.010</div>
                        <div className="p-3 font-mono text-sky-600 font-bold">118.015</div>
                        <div className="p-3 font-mono">118.025 (118.030)</div>
                    </div>
                )}
            </div>
        </div>
    );
};

// 4. Attenuation Mnemonic (Page 21)
const AttenuationMnemonic = () => {
    const [revealed, setRevealed] = useState(false);

    return (
        <div className="text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Attenuation Factors</h3>
            <p className="text-slate-600 mb-8">Remember the factors that increase attenuation using the mnemonic.</p>
            
            <div className="grid grid-cols-4 gap-4 mb-8">
                {['W', 'T', 'F', 'D'].map((char, i) => (
                    <div key={i} className="bg-slate-800 text-white text-4xl font-black p-4 rounded-xl shadow-lg">
                        {char}
                    </div>
                ))}
            </div>

            <button onClick={() => setRevealed(!revealed)} className="mb-6 px-6 py-2 bg-sky-600 text-white rounded-lg font-bold">
                {revealed ? 'Hide Meanings' : 'Reveal Meanings'}
            </button>

            {revealed && (
                <div className="grid grid-cols-1 gap-2 text-left bg-white p-6 rounded-xl border border-slate-200 text-black">
                    <div className="p-2 bg-slate-50 rounded"><span className="font-bold text-sky-600">W</span> - Wavelength (Decrease)</div>
                    <div className="p-2 bg-slate-50 rounded"><span className="font-bold text-sky-600">T</span> - Temperature (Decrease)</div>
                    <div className="p-2 bg-slate-50 rounded"><span className="font-bold text-sky-600">F</span> - Frequency (Increase)</div>
                    <div className="p-2 bg-slate-50 rounded"><span className="font-bold text-sky-600">D</span> - Density (Increase)</div>
                </div>
            )}
        </div>
    );
};

// 5. Mic Stuck (Page 13)
const MicStuck = () => {
    const [stuck, setStuck] = useState(false);

    return (
        <div className="text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Stuck Microphone</h3>
            
            <div className="relative h-40 bg-slate-900 rounded-xl flex items-center justify-center mb-6 overflow-hidden">
                {stuck && (
                    <div className="absolute inset-0 bg-red-500/20 animate-pulse flex items-center justify-center">
                        <span className="text-red-500 font-black text-4xl tracking-widest opacity-50">BLOCKING</span>
                    </div>
                )}
                <div className="flex gap-1 items-end h-20">
                    {[...Array(10)].map((_, i) => (
                        <div 
                            key={i} 
                            className={`w-4 bg-green-500 transition-all duration-100 ${stuck ? 'h-20 bg-red-500' : 'h-2'}`}
                            style={{ height: stuck ? '100%' : `${Math.random() * 40}%` }}
                        ></div>
                    ))}
                </div>
            </div>

            <button 
                onMouseDown={() => setStuck(true)} 
                onMouseUp={() => setStuck(false)}
                className="w-24 h-24 rounded-full bg-slate-200 border-4 border-slate-300 active:bg-red-500 active:border-red-600 active:text-white text-slate-900 font-bold transition-colors shadow-lg active:shadow-none flex items-center justify-center"
            >
                PTT
            </button>
            <p className="mt-4 text-xs text-slate-500">Hold PTT to simulate stuck mic carrier wave.</p>
        </div>
    );
};

export default TechPhysics;
