import React, { useState } from 'react';
import { Activity, Signal, Mic, Wifi, Sun, Radio, Info, AlertTriangle } from 'lucide-react';

const TechPhysics: React.FC = () => {
    const [tab, setTab] = useState(0);

    const tabs = [
        { name: 'Refraction & Ducting', icon: Sun },
        { name: 'Antenna Shielding', icon: Signal },
        { name: '8.33 kHz vs 25 kHz Spacing', icon: Activity },
        { name: 'Attenuation (WTFD)', icon: Wifi },
        { name: 'Stuck Microphone (NORDO)', icon: Mic },
    ];

    return (
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-800 min-h-[620px] flex flex-col text-slate-100">
            <div className="bg-slate-950 p-4 flex overflow-x-auto scrollbar-hide border-b border-slate-800">
                {tabs.map((t, i) => (
                    <button
                        key={i}
                        onClick={() => setTab(i)}
                        className={`flex items-center px-4 py-2.5 rounded-xl mr-2 text-xs font-bold transition-all whitespace-nowrap ${
                            tab === i ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/40' : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <t.icon className="w-4 h-4 mr-2" />
                        {t.name}
                    </button>
                ))}
            </div>
            <div className="p-6 md:p-8 flex-1 bg-slate-900/50">
                {tab === 0 && <RefractionVis />}
                {tab === 1 && <SignalBanking />}
                {tab === 2 && <FreqSpacing />}
                {tab === 3 && <AttenuationMnemonic />}
                {tab === 4 && <MicStuck />}
            </div>
        </div>
    );
};

// 1. Refraction & Atmospheric Ducting
const RefractionVis = () => {
    const [mode, setMode] = useState<'standard' | 'super' | 'sub' | 'duct'>('standard');

    const modeData = {
        standard: {
            title: 'Standard Atmospheric Refraction',
            desc: 'In ISA conditions, atmospheric density decreases with altitude, bending radio waves slightly downward toward Earth. Effective Earth radius = 4/3 actual radius (k = 1.33).',
            bend: 15,
            tag: 'k = 1.33 (Standard Horizon)',
            color: 'text-sky-400',
        },
        super: {
            title: 'Super-Refraction (Extended Range)',
            desc: 'Occurs with temperature inversion (warm dry air over cool moist surface). Lapse rate is reversed; radio waves bend sharply downward, extending VHF line-of-sight well beyond normal range.',
            bend: 38,
            tag: 'k > 1.33 (Range Extended)',
            color: 'text-emerald-400',
        },
        sub: {
            title: 'Sub-Refraction (Reduced Range)',
            desc: 'Occurs with steep lapse rate or cool dry air over warm moist ground. Radio waves bend upward away from Earth, causing premature loss of VHF communications.',
            bend: -12,
            tag: 'k < 1.0 (Range Reduced)',
            color: 'text-amber-400',
        },
        duct: {
            title: 'Atmospheric Ducting (Trapped Waveguide)',
            desc: 'Severe temperature inversion with high humidity gradient traps VHF/UHF waves in a natural waveguide between layers or ground. Signals travel hundreds of miles beyond the horizon.',
            bend: 55,
            tag: 'Ducting Trapped Mode',
            color: 'text-purple-400',
        },
    };

    const cur = modeData[mode];

    return (
        <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto">
                <h3 className="text-xl font-bold text-white mb-2">{cur.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{cur.desc}</p>
            </div>

            <div className="flex justify-center gap-2">
                {(['standard', 'super', 'sub', 'duct'] as const).map(m => (
                    <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                            mode === m ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                    >
                        {m}
                    </button>
                ))}
            </div>

            <div className="relative w-full h-56 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
                {/* Ground */}
                <div className="absolute bottom-0 w-full h-10 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between px-6 text-[10px] text-slate-400">
                    <span>Earth Surface</span>
                    <span>Line-of-Sight Path</span>
                </div>

                {/* Ground Station */}
                <div className="absolute left-8 bottom-10 flex flex-col items-center">
                    <Radio className="text-sky-400 w-6 h-6" />
                    <div className="w-1.5 h-12 bg-slate-600"></div>
                    <span className="text-[10px] font-mono text-slate-400">TX</span>
                </div>

                {/* Aircraft */}
                <div className="absolute right-12 bottom-28 flex flex-col items-center">
                    <div className="w-6 h-2 bg-slate-300 rounded-full"></div>
                    <span className="text-[10px] font-mono text-slate-400 mt-1">RX Aircraft</span>
                </div>

                {/* Wave Path */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path
                        d={`M 45 155 Q 220 ${130 - cur.bend} 440 ${mode === 'sub' ? 70 : 130}`}
                        fill="none"
                        stroke={mode === 'sub' ? '#f59e0b' : mode === 'duct' ? '#c084fc' : mode === 'super' ? '#10b981' : '#38bdf8'}
                        strokeWidth="3"
                        strokeDasharray={mode === 'duct' ? '4,4' : 'none'}
                    />
                </svg>

                <div className="absolute top-3 right-4 bg-slate-900/90 border border-slate-700 px-3 py-1 rounded text-xs font-bold font-mono">
                    <span className={cur.color}>{cur.tag}</span>
                </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 grid md:grid-cols-2 gap-4">
                <div>
                    <strong className="text-white block mb-1">Standard Refraction Rule:</strong>
                    Because temperature and pressure decrease with altitude, the refractive index $n$ decreases. Waves bend downward, giving an optical line of sight of $1.06 \times \sqrt{h}$ and radio horizon of $1.23 \times \sqrt{h}$ (effective $4/3$ Earth radius).
                </div>
                <div>
                    <strong className="text-white block mb-1">EASA Exam Question:</strong>
                    "What atmospheric condition causes super-refraction?"
                    <br />
                    <span className="text-emerald-400 font-medium">Answer: A marked temperature inversion with decreasing humidity with height.</span>
                </div>
            </div>
        </div>
    );
};

// 2. Signal Banking & Antenna Shielding
const SignalBanking = () => {
    const [bank, setBank] = useState(25);
    // Shielding attenuation when banking steeply
    const attenuation = Math.min(100, Math.round(Math.abs(bank) * 1.6));
    const signalStrength = Math.max(0, 100 - attenuation);

    return (
        <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto">
                <h3 className="text-xl font-bold text-white mb-2">Airframe Antenna Shielding & Polarization</h3>
                <p className="text-xs text-slate-400">
                    VHF communications use <strong className="text-white">Vertical Polarization</strong>. When an aircraft banks steeply during a turn, the airframe and wings can physically shield the antenna from the ground station, while cross-polarization causes signal attenuation.
                </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
                <div className="h-32 flex items-center justify-center mb-6">
                    <div
                        className="transition-transform duration-150 flex flex-col items-center"
                        style={{ transform: `rotate(${bank}deg)` }}
                    >
                        {/* Upper Antenna */}
                        <div className="w-1 h-5 bg-sky-400 rounded-t shadow-[0_0_8px_#38bdf8]"></div>
                        {/* Fuselage */}
                        <div className="w-28 h-6 bg-slate-700 rounded-full border border-slate-500 relative flex items-center justify-center">
                            <span className="text-[9px] font-mono text-slate-300">FUSELAGE</span>
                        </div>
                        {/* Wings */}
                        <div className="w-48 h-2 bg-slate-500 -mt-4 rounded"></div>
                    </div>
                </div>

                <div className="w-full max-w-md space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                        <span>Left Bank: -60°</span>
                        <span className="font-mono text-white font-bold">Bank Angle: {bank}°</span>
                        <span>Right Bank: +60°</span>
                    </div>
                    <input
                        type="range"
                        min="-60"
                        max="60"
                        value={bank}
                        onChange={e => setBank(Number(e.target.value))}
                        className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-300">Received Signal Strength</span>
                        <span className="font-mono text-xs font-bold text-sky-400">{signalStrength}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-200 ${
                                signalStrength > 70 ? 'bg-emerald-500' : signalStrength > 35 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${signalStrength}%` }}
                        ></div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2">
                        {signalStrength < 40 ? '⚠️ High risk of broken transmissions or squelch lock during holding turns.' : 'Clear transmission path.'}
                    </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-1.5 text-slate-300">
                    <strong className="text-white block">Aviation Polarization Rule:</strong>
                    Aeronautical VHF communications use <strong className="text-sky-400">vertical polarization</strong> (antennas mounted vertically). If the aircraft antenna tilts 90°, a cross-polarization loss of up to <strong className="text-rose-400">20 dB to 30 dB</strong> can occur!
                </div>
            </div>
        </div>
    );
};

// 3. 8.33 kHz vs 25 kHz Frequency Spacing & 6-Digit Naming
const FreqSpacing = () => {
    const [selectedChannelIdx, setSelectedChannelIdx] = useState(0);

    const channels = [
        { chan: '118.005', carrier: '118.0000', spacing: '8.33 kHz', phrase: 'ONE ONE EIGHT DECIMAL ZERO ZERO FIVE', legacy: '118.000 (25 kHz)' },
        { chan: '118.010', carrier: '118.0083', spacing: '8.33 kHz', phrase: 'ONE ONE EIGHT DECIMAL ZERO ONE ZERO', legacy: 'None (8.33 Only)' },
        { chan: '118.015', carrier: '118.0167', spacing: '8.33 kHz', phrase: 'ONE ONE EIGHT DECIMAL ZERO ONE FIVE', legacy: 'None (8.33 Only)' },
        { chan: '118.030', carrier: '118.0250', spacing: '8.33 kHz', phrase: 'ONE ONE EIGHT DECIMAL ZERO THREE ZERO', legacy: '118.025 (25 kHz)' },
        { chan: '118.035', carrier: '118.0333', spacing: '8.33 kHz', phrase: 'ONE ONE EIGHT DECIMAL ZERO THREE FIVE', legacy: 'None (8.33 Only)' },
        { chan: '118.040', carrier: '118.0417', spacing: '8.33 kHz', phrase: 'ONE ONE EIGHT DECIMAL ZERO FOUR ZERO', legacy: 'None (8.33 Only)' },
        { chan: '118.055', carrier: '118.0500', spacing: '8.33 kHz', phrase: 'ONE ONE EIGHT DECIMAL ZERO FIVE FIVE', legacy: '118.050 (25 kHz)' },
        { chan: '118.060', carrier: '118.0583', spacing: '8.33 kHz', phrase: 'ONE ONE EIGHT DECIMAL ZERO SIX ZERO', legacy: 'None (8.33 Only)' },
        { chan: '118.065', carrier: '118.0667', spacing: '8.33 kHz', phrase: 'ONE ONE EIGHT DECIMAL ZERO SIX FIVE', legacy: 'None (8.33 Only)' },
        { chan: '118.080', carrier: '118.0750', spacing: '8.33 kHz', phrase: 'ONE ONE EIGHT DECIMAL ZERO EIGHT ZERO', legacy: '118.075 (25 kHz)' },
    ];

    const current = channels[selectedChannelIdx];

    return (
        <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto">
                <h3 className="text-xl font-bold text-white mb-2">8.33 kHz Channel Spacing & 6-Digit Naming (ICAO Doc 9432)</h3>
                <p className="text-xs text-slate-400">
                    To triple the available VHF channels in congested European airspace, channel spacing was reduced from 25 kHz to 8.333 kHz.
                    Because $8.333\text{ kHz}$ does not end cleanly in decimals, a <strong className="text-white">6-digit channel name</strong> is spoken and tuned.
                </p>
            </div>

            {/* Interactive Channel Selector */}
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <div className="text-xs text-slate-400 uppercase font-semibold">Tuned Channel Designator</div>
                        <div className="text-3xl font-black text-sky-400 font-mono tracking-wider">{current.chan}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-400 uppercase font-semibold">Actual Radio Carrier Frequency</div>
                        <div className="text-2xl font-black text-emerald-400 font-mono">{current.carrier} MHz</div>
                    </div>
                </div>

                <div className="space-y-1">
                    <input
                        type="range"
                        min="0"
                        max={channels.length - 1}
                        value={selectedChannelIdx}
                        onChange={e => setSelectedChannelIdx(Number(e.target.value))}
                        className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>118.005</span>
                        <span>118.030</span>
                        <span>118.055</span>
                        <span>118.080</span>
                    </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs space-y-1">
                    <span className="text-slate-400 font-semibold block">Mandatory ICAO Spoken Phraseology:</span>
                    <span className="font-mono text-amber-300 font-bold block">{current.phrase}</span>
                    <span className="text-[11px] text-slate-500 block">
                        Legacy 25 kHz equivalent: <strong className="text-slate-300">{current.legacy}</strong>
                    </span>
                </div>
            </div>

            {/* Crucial Channel Mapping Table */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Info size={16} className="text-sky-400" />
                    The 8.33 kHz Naming Rule Decoded
                </h4>
                <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
                    <p>
                        Notice that <strong className="text-white">Channel 118.005</strong> transmits on <strong className="text-sky-300">118.0000 MHz</strong>!
                        Channel <strong className="text-white">118.030</strong> transmits on <strong className="text-sky-300">118.0250 MHz</strong>!
                    </p>
                    <p>
                        <strong>Why not call it 118.000?</strong> Because if ATC says "118.000", an aircraft with a 25 kHz radio will tune it with wide bandwidth filter ($25\text{ kHz}$).
                        When ATC transmits "Channel 118.005", the pilot selects the 6-digit channel on an 8.33 kHz radio, activating the narrow $8.33\text{ kHz}$ bandpass filter to prevent bleeding into adjacent channels.
                    </p>
                </div>
            </div>
        </div>
    );
};

// 4. Attenuation Factors (WTFD Mnemonic)
const AttenuationMnemonic = () => {
    const [revealed, setRevealed] = useState(true);

    return (
        <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto">
                <h3 className="text-xl font-bold text-white mb-2">Atmospheric Attenuation Factors (062 / 090)</h3>
                <p className="text-xs text-slate-400">
                    Radio signals lose energy as they travel through the atmosphere due to scattering, absorption by water vapor, and oxygen molecules. Remember what causes attenuation to increase:
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { letter: 'W', term: 'Wavelength', effect: 'Decreases (λ ↓)', exp: 'Shorter wavelength means higher frequency and greater molecular absorption by rain/clouds.' },
                    { letter: 'T', term: 'Temperature', effect: 'Decreases (T ↓)', exp: 'Colder air holds higher density of gas molecules per volume, increasing scatter.' },
                    { letter: 'F', term: 'Frequency', effect: 'Increases (f ↑)', exp: 'Higher frequencies (SHF/EHF) suffer severe rain fade compared to VHF/HF.' },
                    { letter: 'D', term: 'Density', effect: 'Increases (ρ ↑)', exp: 'Denser air near sea level attenuates radio waves faster than rarefied high-altitude air.' },
                ].map((item, i) => (
                    <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center flex flex-col items-center justify-between">
                        <div className="w-14 h-14 rounded-2xl bg-sky-950 border border-sky-600 flex items-center justify-center text-3xl font-black text-sky-300 mb-2 shadow-lg shadow-sky-950">
                            {item.letter}
                        </div>
                        <div className="font-bold text-sm text-white">{item.term}</div>
                        <div className="text-xs font-mono text-amber-400 font-semibold my-1">{item.effect}</div>
                        {revealed && (
                            <p className="text-[11px] text-slate-400 mt-2 text-left leading-snug">
                                {item.exp}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <div className="text-center">
                <button
                    onClick={() => setRevealed(!revealed)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-lg transition-colors"
                >
                    {revealed ? 'Hide Explanations (Test Yourself)' : 'Reveal Explanations'}
                </button>
            </div>
        </div>
    );
};

// 5. Stuck Microphone
const MicStuck = () => {
    const [stuck, setStuck] = useState(false);

    return (
        <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto">
                <h3 className="text-xl font-bold text-white mb-2">Stuck PTT (Blocked Frequency Hazard)</h3>
                <p className="text-xs text-slate-400">
                    A stuck Push-to-Talk (PTT) switch transmits a continuous carrier wave that disables the entire frequency for all other aircraft and ATC, potentially causing fatal loss of communication.
                </p>
            </div>

            <div className="relative h-44 bg-slate-950 rounded-xl flex items-center justify-center overflow-hidden border border-slate-800">
                {stuck && (
                    <div className="absolute inset-0 bg-rose-600/20 animate-pulse flex flex-col items-center justify-center z-10">
                        <span className="text-rose-500 font-black text-3xl tracking-widest font-mono">FREQUENCY BLOCKED</span>
                        <span className="text-rose-300 text-xs mt-1">HETEROYNE / SQUAWK LOCK ACTIVE</span>
                    </div>
                )}
                <div className="flex gap-1.5 items-end h-24">
                    {[...Array(16)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-3 rounded transition-all duration-100 ${
                                stuck ? 'h-24 bg-rose-500' : 'h-3 bg-sky-500/40'
                            }`}
                        ></div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-3">
                <button
                    onMouseDown={() => setStuck(true)}
                    onMouseUp={() => setStuck(false)}
                    onTouchStart={() => setStuck(true)}
                    onTouchEnd={() => setStuck(false)}
                    className={`w-28 h-28 rounded-full border-4 font-black text-sm tracking-wider transition-all shadow-xl flex items-center justify-center select-none ${
                        stuck
                            ? 'bg-rose-600 border-rose-400 text-white scale-95 shadow-rose-900/50'
                            : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-sky-500'
                    }`}
                >
                    {stuck ? 'TRANSMITTING' : 'HOLD PTT'}
                </button>
                <p className="text-xs text-slate-500">Hold PTT button down to simulate an open microphone.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                <strong className="text-white block">Modern Avionics Mitigations:</strong>
                Modern transceivers incorporate an automatic <strong className="text-sky-400">Time-Out Timer (TOT)</strong> that cuts off continuous transmission after 30 to 35 seconds to release the channel for emergency use.
            </div>
        </div>
    );
};

export default TechPhysics;
