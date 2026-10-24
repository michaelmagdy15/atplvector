import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Zap, 
    Battery, 
    Activity, 
    ArrowRight, 
    AlertTriangle, 
    RefreshCw, 
    Layers, 
    CheckCircle2, 
    Shield, 
    Gauge, 
    Sliders,
    Power
} from 'lucide-react';

const ElectricsSystem: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'ac' | 'dc' | 'dist'>('ac');

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-yellow-400 mb-2">
                        <span>EASA 021.05</span>
                        <span>•</span>
                        <span>Aircraft General Knowledge</span>
                        <span>•</span>
                        <span>Electrics</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3">
                        <Zap className="text-yellow-400 fill-yellow-400/20 w-10 h-10" />
                        Aircraft Electrical Systems
                    </h1>
                    <p className="text-slate-400 mt-2 max-w-2xl text-base md:text-lg">
                        115V/200V 400Hz 3-phase AC generation, Constant Speed Drive (CSD) irreversible disconnect rules, Transformer Rectifier Units (TRUs), and the 30-minute emergency battery bus.
                    </p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 bg-slate-900/60 p-1.5 rounded-2xl w-full md:w-fit border border-slate-800">
                {[
                    { id: 'ac', label: 'AC Generation & IDG/CSD', icon: RefreshCw },
                    { id: 'dc', label: 'DC, Batteries & Inverters', icon: Battery },
                    { id: 'dist', label: 'Distribution & Split-Bus Logic', icon: Layers },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                            activeTab === tab.id
                                ? 'bg-yellow-500 text-slate-950 font-black shadow-lg shadow-yellow-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                {activeTab === 'ac' && <ACGeneration key="ac" />}
                {activeTab === 'dc' && <DCGeneration key="dc" />}
                {activeTab === 'dist' && <DistributionSystem key="dist" />}
            </AnimatePresence>
        </div>
    );
};

const ACGeneration = () => {
    const [rpm, setRpm] = useState(6000);
    const [poles, setPoles] = useState(4);
    const [csdConnected, setCsdConnected] = useState(true);
    const [csdDisconnectedInFlight, setCsdDisconnectedInFlight] = useState(false);

    // Frequency Formula: f = (RPM * Poles) / 120
    const rawFrequency = (rpm * poles) / 120;
    // When CSD is active, governor holds frequency at 400 Hz
    const stableFreq = csdConnected ? 400 : rawFrequency;

    const disconnectCSD = () => {
        setCsdConnected(false);
        setCsdDisconnectedInFlight(true);
    };

    const resetGroundMaintenance = () => {
        setCsdConnected(true);
        setCsdDisconnectedInFlight(false);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Activity className="text-yellow-400" />
                            Integrated Drive Generator (IDG) & CSD
                        </h3>

                        {/* Engine RPM Control */}
                        <div>
                            <label className="flex justify-between text-xs font-mono font-bold text-slate-400 uppercase mb-2">
                                <span>Engine Spool Speed (N2 RPM)</span>
                                <span className="text-white font-bold">{rpm} RPM</span>
                            </label>
                            <input
                                type="range" min="3000" max="12000" step="200"
                                value={rpm}
                                onChange={(e) => setRpm(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                                <span>3,000 (Idle)</span>
                                <span>6,000 (Cruise)</span>
                                <span>12,000 (Takeoff / TOGA)</span>
                            </div>
                        </div>

                        {/* CSD Disconnect Pushbutton */}
                        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                            <div>
                                <span className="text-sm font-bold text-white block">CSD Disconnect Switch</span>
                                <span className="text-xs text-slate-400">Guarded overhead push switch</span>
                            </div>
                            {csdConnected ? (
                                <button
                                    onClick={disconnectCSD}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-600/30"
                                >
                                    DISCONNECT CSD
                                </button>
                            ) : (
                                <span className="px-3 py-1.5 rounded-lg bg-red-950/40 text-red-400 border border-red-500/30 text-xs font-mono font-bold">
                                    DISCONNECTED
                                </span>
                            )}
                        </div>

                        {/* CSD In-Flight Warning Alert */}
                        {csdDisconnectedInFlight && (
                            <div className="bg-red-950/20 border-2 border-red-500/50 p-4 rounded-2xl text-xs text-red-200 space-y-2">
                                <div className="flex items-center gap-2 font-bold text-red-400 uppercase">
                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                    CRITICAL CSD DISCONNECT RULE:
                                </div>
                                <p className="leading-relaxed">
                                    Solenoid-operated dog-clutch has physically separated the drive shaft from the engine gearbox. 
                                    <strong> CANNOT BE RECONNECTED IN FLIGHT!</strong> Reconnection requires manual physical reset by ground engineers after landing.
                                </p>
                                <button
                                    onClick={resetGroundMaintenance}
                                    className="mt-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono font-bold"
                                >
                                    Simulate Ground Maintenance Reset
                                </button>
                            </div>
                        )}

                        {/* Frequency Meter */}
                        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-xs font-mono font-bold uppercase">AC Frequency Output</span>
                                <span className={`font-mono font-black text-2xl ${
                                    Math.abs(stableFreq - 400) <= 5 ? 'text-emerald-400' : 'text-red-400 animate-pulse'
                                }`}>
                                    {Math.round(stableFreq)} Hz
                                </span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full ${Math.abs(stableFreq - 400) <= 5 ? 'bg-emerald-500' : 'bg-red-500'}`}
                                    animate={{ width: `${Math.min((stableFreq / 800) * 100, 100)}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-1">
                                <span>EASA CS-25 Tolerance: 400 Hz ± 5 Hz (395 – 405 Hz)</span>
                                <span>{csdConnected ? 'CSD REGULATED' : 'WILD FREQUENCY'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Technical Breakdown */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                        <h4 className="text-sm font-mono uppercase text-yellow-400 font-bold flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            115V / 200V 3-Phase AC Root-3 Relationship
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                                <strong className="text-white block mb-1">Phase-to-Neutral: 115V AC</strong>
                                Supplies individual single-phase cabin avionics, instruments, and lighting circuits.
                            </div>
                            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                                <strong className="text-white block mb-1">Phase-to-Phase: 200V AC</strong>
                                Root-3 multiplier ($115\text{V} \times \sqrt{`{3}`} \approx 199.2\text{V} \approx 200\text{V}$). Powers heavy 3-phase fuel pumps, flap motors, and hydraulic pumps.
                            </div>
                        </div>
                        <p className="text-xs text-slate-400">
                            <strong>Why 400 Hz instead of 50/60 Hz?</strong> Higher frequency allows transformers, inductors, and motors to be manufactured with vastly smaller iron cores, saving hundreds of kilograms of airframe mass!
                        </p>
                    </div>
                </div>

                {/* Animated Scope & Generator Viz */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
                    <div className="flex items-center gap-2">
                        {/* Engine Shaft */}
                        <div className="flex flex-col items-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 60000 / Math.max(500, rpm), ease: "linear" }}
                                className="w-16 h-16 rounded-full border-4 border-slate-600 border-dashed mb-2 flex items-center justify-center"
                            >
                                <span className="text-[10px] font-mono text-slate-400">{rpm}</span>
                            </motion.div>
                            <span className="text-[10px] font-black uppercase text-slate-500 font-mono">Gearbox Shaft</span>
                        </div>

                        <ArrowRight className="text-slate-600" />

                        {/* CSD Swashplate Unit */}
                        <div className={`w-28 h-18 p-2 rounded-xl flex flex-col items-center justify-center border-2 transition-colors ${
                            csdConnected ? 'bg-emerald-950/30 border-emerald-500/50' : 'bg-red-950/20 border-red-500/50'
                        }`}>
                            <span className="text-xs font-bold text-white">CSD</span>
                            <span className="text-[9px] font-mono text-slate-400">
                                {csdConnected ? 'Hydraulic Swash' : 'Clutch Open'}
                            </span>
                        </div>

                        <ArrowRight className={`${csdConnected ? 'text-emerald-500' : 'text-slate-600'}`} />

                        {/* Generator Unit */}
                        <div className="flex flex-col items-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1000 / Math.max(10, stableFreq), ease: "linear" }}
                                className="w-20 h-20 rounded-full border-4 border-yellow-400 border-t-transparent shadow-xl shadow-yellow-400/20 mb-2 relative flex items-center justify-center bg-slate-950"
                            >
                                <Zap className="text-yellow-400 w-8 h-8" />
                            </motion.div>
                            <span className="text-[10px] font-black uppercase text-yellow-400 font-mono">IDG Rotor</span>
                        </div>
                    </div>

                    {/* Oscilloscope Sine Wave */}
                    <div className="w-full h-40 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden flex items-center p-2">
                        <svg className="w-full h-full" preserveAspectRatio="none">
                            <motion.path
                                d="M 0 64 Q 25 10, 50 64 T 100 64 T 150 64 T 200 64 T 250 64 T 300 64"
                                fill="none"
                                stroke={Math.abs(stableFreq - 400) <= 5 ? "#eab308" : "#ef4444"}
                                strokeWidth="3"
                                initial={{ pathOffset: 0 }}
                                animate={{ pathOffset: -1 }}
                                transition={{ repeat: Infinity, duration: 1000 / Math.max(50, stableFreq), ease: "linear" }}
                            />
                        </svg>

                        <div className="absolute bottom-3 right-3 text-xs font-mono text-slate-500">
                            FREQUENCY: <strong className={Math.abs(stableFreq - 400) <= 5 ? "text-yellow-400" : "text-red-400"}>{Math.round(stableFreq)} Hz</strong>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const DCGeneration = () => {
    const [batteryChemistry, setBatteryChemistry] = useState<'nicad' | 'leadacid'>('nicad');

    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* TRU & Inverter Architecture */}
                <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Zap className="text-yellow-400" />
                        TRUs & Static Inverters
                    </h3>

                    <div className="space-y-4">
                        <div className="bg-slate-950 p-5 rounded-2xl border border-blue-500/30 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-sm text-blue-300">Transformer Rectifier Unit (TRU)</span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">AC to DC</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Steps down <strong>115V AC (400 Hz)</strong> and rectifies it via solid-state diodes into <strong>28V DC</strong> (typically 200 Amps). Powers main DC buses and trickle-charges aircraft batteries. Contains no moving parts.
                            </p>
                        </div>

                        <div className="bg-slate-950 p-5 rounded-2xl border border-purple-500/30 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-sm text-purple-300">Static Inverter</span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">DC to AC</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Converts <strong>28V DC battery power</strong> into <strong>115V AC (400 Hz, single phase)</strong> during total AC generator failure to drive emergency standby attitude instruments and navigation receivers.
                            </p>
                        </div>

                        {/* Emergency 30-Minute Battery Certification */}
                        <div className="bg-amber-950/20 border border-amber-500/40 p-5 rounded-2xl space-y-2">
                            <div className="flex items-center gap-2 font-bold text-amber-400 text-xs font-mono uppercase">
                                <Shield className="w-4 h-4" />
                                30-Minute Emergency Battery Certification (CS-25)
                            </div>
                            <p className="text-xs text-amber-200/90 leading-relaxed">
                                In the event of complete electrical generator failure, the aircraft's main batteries are certified to power the <strong>Emergency / Standby Bus for at least 30 minutes</strong>. This provides sufficient time to execute an emergency descent and divert to a safe landing using standby horizon, VHF 1, and VOR 1.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Battery Chemistries & Thermal Runaway */}
                <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Battery className="text-yellow-400" />
                        Aviation Battery Chemistries
                    </h3>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setBatteryChemistry('nicad')}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                batteryChemistry === 'nicad'
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                        >
                            Nickel-Cadmium (NiCad)
                        </button>
                        <button
                            onClick={() => setBatteryChemistry('leadacid')}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                batteryChemistry === 'leadacid'
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                        >
                            Lead-Acid
                        </button>
                    </div>

                    {batteryChemistry === 'nicad' ? (
                        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-white text-sm">NiCad Battery Properties</span>
                                <span className="text-[10px] font-mono text-cyan-400">Transport Standard</span>
                            </div>
                            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                                <div>• <strong>Electrolyte:</strong> Potassium Hydroxide ($KOH$).</div>
                                <div>• <strong>Advantage:</strong> Very low internal resistance; delivers enormous starting currents for APU and engine start without voltage sagging.</div>
                                <div>• <strong>State of Charge:</strong> Cannot be measured by hydrometer (electrolyte density does not change with charge!). Must be bench tested.</div>
                            </div>

                            {/* Thermal Runaway Hazard */}
                            <div className="p-4 bg-red-950/20 border border-red-500/40 rounded-xl space-y-1 text-xs text-red-200">
                                <strong className="text-red-400 flex items-center gap-1 font-bold">
                                    <AlertTriangle className="w-4 h-4" /> Thermal Runaway Danger:
                                </strong>
                                <p className="leading-relaxed">
                                    NiCad cells have a <em>negative temperature coefficient of resistance</em>. As the battery heats up, its internal resistance drops. Connected to a constant-voltage bus, it draws increasingly higher charging current, heating up even more until boiling, cell rupture, and fire occur! Protected by battery temperature sensors that trip the charging contactor at ~60°C.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-white text-sm">Lead-Acid Battery Properties</span>
                                <span className="text-[10px] font-mono text-slate-400">General Aviation</span>
                            </div>
                            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                                <div>• <strong>Electrolyte:</strong> Dilute Sulphuric Acid ($H_2SO_4$).</div>
                                <div>• <strong>State of Charge Check:</strong> Measured directly by checking electrolyte Specific Gravity (SG) using a <strong>hydrometer</strong>.</div>
                                <div>• <strong>Full Charge SG:</strong> 1.270 to 1.280 at 15°C.</div>
                                <div>• <strong>Discharged SG:</strong> ~1.100.</div>
                                <div>• <strong>Characteristics:</strong> Heavier, immune to thermal runaway, but voltage sags significantly under heavy discharge.</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const DistributionSystem = () => {
    const [gen1, setGen1] = useState(true);
    const [gen2, setGen2] = useState(true);
    const [apu, setApu] = useState(false);
    const [extPwr, setExtPwr] = useState(false);
    const [busTieAuto, setBusTieAuto] = useState(true);

    // Split-bus AC logic
    const acBus1Powered = gen1 || (busTieAuto && (gen2 || apu || extPwr));
    const acBus2Powered = gen2 || (busTieAuto && (gen1 || apu || extPwr));
    const acEssPowered = acBus1Powered || acBus2Powered;

    // TRU & DC logic
    const tru1Powered = acBus1Powered;
    const tru2Powered = acBus2Powered;
    const dcBus1Powered = tru1Powered || (busTieAuto && tru2Powered);
    const dcBus2Powered = tru2Powered || (busTieAuto && tru1Powered);
    const dcEssPowered = dcBus1Powered || dcBus2Powered;

    // Emergency condition: total AC failure
    const onBatteryOnly = !acBus1Powered && !acBus2Powered;

    return (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Layers className="text-yellow-400" />
                            Split-Bus Distribution & Bus Tie Breakers (BTB)
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                            In modern transport aircraft (A320/B737), generators are non-parallel split buses: two AC sources never power the same bus simultaneously.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-mono">BUS TIE LOGIC:</span>
                        <button
                            onClick={() => setBusTieAuto(!busTieAuto)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                busTieAuto ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-slate-800 text-slate-400'
                            }`}
                        >
                            BUS TIE: {busTieAuto ? 'AUTO' : 'ISOLATED'}
                        </button>
                    </div>
                </div>

                {/* Overhead Generator Switches */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
                    <GeneratorSwitch label="GEN 1 (ENG 1)" active={gen1} onClick={() => setGen1(!gen1)} />
                    <GeneratorSwitch label="APU GEN" active={apu} onClick={() => setApu(!apu)} color="bg-amber-500" />
                    <GeneratorSwitch label="EXT POWER" active={extPwr} onClick={() => setExtPwr(!extPwr)} color="bg-cyan-500" />
                    <GeneratorSwitch label="GEN 2 (ENG 2)" active={gen2} onClick={() => setGen2(!gen2)} />
                </div>

                {/* Busbar Schematic Display */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                    {/* AC Buses */}
                    <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">115V AC Distribution Buses</span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <BusBarIndicator label="AC BUS 1" powered={acBus1Powered} voltage="115V / 400Hz" />
                            <BusBarIndicator label="AC ESS BUS" powered={acEssPowered || onBatteryOnly} voltage="115V AC (Static Inv)" isEssential />
                            <BusBarIndicator label="AC BUS 2" powered={acBus2Powered} voltage="115V / 400Hz" />
                        </div>
                    </div>

                    {/* DC Buses */}
                    <div className="space-y-2 pt-4 border-t border-slate-800">
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">28V DC Distribution Buses</span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <BusBarIndicator label="DC BUS 1" powered={dcBus1Powered} voltage="28V DC (TRU 1)" color="blue" />
                            <BusBarIndicator label="DC ESS BUS" powered={dcEssPowered || onBatteryOnly} voltage="28V DC (BATT)" color="blue" isEssential />
                            <BusBarIndicator label="DC BUS 2" powered={dcBus2Powered} voltage="28V DC (TRU 2)" color="blue" />
                        </div>
                    </div>

                    {/* Emergency Battery State */}
                    {onBatteryOnly && (
                        <div className="bg-red-950/30 border-2 border-red-500 p-4 rounded-xl flex items-center justify-between text-xs animate-pulse">
                            <div className="flex items-center gap-3 text-red-300">
                                <AlertTriangle className="w-5 h-5 text-red-400" />
                                <div>
                                    <strong className="block text-white text-sm">EMERGENCY ELECTRICAL CONFIGURATION</strong>
                                    All AC generators lost! Essential buses powered by Main Aircraft Batteries via Static Inverter (30-Minute Life Limit).
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-red-600 text-white rounded-lg font-mono font-bold">EMER BATT ON</span>
                        </div>
                    )}
                </div>

                {/* Paralleling 4 Criteria Box */}
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                    <h4 className="text-xs font-mono uppercase text-yellow-400 font-bold mb-3">
                        The 4 Mandatory Synchronization Criteria for Paralleling AC Generators
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                            <strong className="text-white block mb-1">1. Voltage</strong>
                            <span className="text-slate-400 text-[11px]">Must match (115V ± 2V)</span>
                        </div>
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                            <strong className="text-white block mb-1">2. Frequency</strong>
                            <span className="text-slate-400 text-[11px]">Must match (400 Hz ± 2 Hz)</span>
                        </div>
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                            <strong className="text-white block mb-1">3. Phase Sequence</strong>
                            <span className="text-slate-400 text-[11px]">A-B-C rotation must be identical</span>
                        </div>
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                            <strong className="text-white block mb-1">4. Phase Angle</strong>
                            <span className="text-slate-400 text-[11px]">Sine wave peaks synchronized</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const GeneratorSwitch = ({ label, active, onClick, color = 'bg-emerald-500' }: any) => (
    <button
        onClick={onClick}
        className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
            active 
                ? 'bg-slate-900 border-yellow-400/50 shadow-lg shadow-yellow-400/10' 
                : 'bg-slate-950 border-slate-800 opacity-60 hover:opacity-100'
        }`}
    >
        <div className={`w-3 h-3 rounded-full ${active ? color : 'bg-slate-700'}`}></div>
        <span className="text-[11px] font-bold text-white uppercase">{label}</span>
        <span className={`text-[10px] font-mono ${active ? 'text-emerald-400' : 'text-slate-500'}`}>
            {active ? 'ONLINE' : 'OFF'}
        </span>
    </button>
);

const BusBarIndicator = ({ label, powered, voltage, color = 'yellow', isEssential = false }: any) => (
    <div className={`p-4 rounded-xl border transition-all ${
        powered 
            ? isEssential 
                ? 'bg-red-950/20 border-red-500/40 text-red-200' 
                : color === 'blue'
                    ? 'bg-blue-950/20 border-blue-500/40 text-blue-200'
                    : 'bg-yellow-950/20 border-yellow-500/40 text-yellow-200'
            : 'bg-slate-900/50 border-slate-800 opacity-40 grayscale'
    }`}>
        <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-white font-mono">{label}</span>
            <span className={`text-[10px] font-mono font-bold ${powered ? 'text-emerald-400' : 'text-slate-500'}`}>
                {powered ? 'POWERED' : 'DEAD'}
            </span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono">{voltage}</div>
    </div>
);

export default ElectricsSystem;
