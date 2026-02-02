import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Plane, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, RotateCw } from 'lucide-react';

const FlightControlsSystem: React.FC = () => {
    const [elevator, setElevator] = useState(0); // -100 to 100
    const [aileron, setAileron] = useState(0); // -100 to 100
    const [rudder, setRudder] = useState(0); // -100 to 100
    const [flaps, setFlaps] = useState(0); // 0, 1, 5, 15, 25, 40
    const [slats, setSlats] = useState(false);
    const [spoilers, setSpoilers] = useState(0); // 0 to 100
    const [trimElevator, setTrimElevator] = useState(0);

    const flapPositions = [0, 1, 5, 15, 25, 40];

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <Settings className="text-blue-500" />
                Flight Control Systems
            </h1>
            <p className="text-slate-400 text-sm max-w-3xl">
                Primary and secondary flight controls. Explore how ailerons, elevators, and rudders work together with high-lift devices.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Aircraft Visualization */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 relative min-h-[450px] flex items-center justify-center overflow-hidden">

                    {/* Aircraft Schematic */}
                    <div className="relative w-80 h-80">
                        {/* Fuselage */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-48 bg-slate-700 rounded-full" />

                        {/* Nose */}
                        <div className="absolute left-1/2 top-8 -translate-x-1/2 w-8 h-8 bg-slate-600 rounded-full" />

                        {/* Wings */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-8 flex items-center justify-center">
                            {/* Left Wing */}
                            <motion.div
                                className="h-4 w-32 bg-gradient-to-l from-slate-600 to-slate-700 rounded-l-full relative"
                                animate={{ rotateX: aileron * 0.3 }}
                            >
                                {/* Left Aileron */}
                                <motion.div
                                    className="absolute right-0 top-0 h-full w-8 bg-blue-500/50 rounded-l"
                                    animate={{ rotateX: aileron * 0.5 }}
                                    style={{ transformOrigin: 'right' }}
                                />
                                {/* Flap */}
                                <div className={`absolute -bottom-2 right-8 w-12 h-2 ${flaps > 0 ? 'bg-emerald-500' : 'bg-slate-500'} rounded transition-all`}
                                    style={{ transform: `rotate(${flaps * 0.5}deg)` }}
                                />
                            </motion.div>

                            {/* Right Wing */}
                            <motion.div
                                className="h-4 w-32 bg-gradient-to-r from-slate-600 to-slate-700 rounded-r-full relative"
                                animate={{ rotateX: -aileron * 0.3 }}
                            >
                                {/* Right Aileron */}
                                <motion.div
                                    className="absolute left-0 top-0 h-full w-8 bg-blue-500/50 rounded-r"
                                    animate={{ rotateX: -aileron * 0.5 }}
                                    style={{ transformOrigin: 'left' }}
                                />
                                {/* Flap */}
                                <div className={`absolute -bottom-2 left-8 w-12 h-2 ${flaps > 0 ? 'bg-emerald-500' : 'bg-slate-500'} rounded transition-all`}
                                    style={{ transform: `rotate(-${flaps * 0.5}deg)` }}
                                />
                            </motion.div>
                        </div>

                        {/* Horizontal Stabilizer */}
                        <div className="absolute left-1/2 bottom-16 -translate-x-1/2 flex items-center">
                            <motion.div
                                className="h-2 w-16 bg-slate-600 rounded-l-full"
                                animate={{ rotateX: elevator * 0.3 }}
                            />
                            <motion.div
                                className="h-2 w-16 bg-slate-600 rounded-r-full"
                                animate={{ rotateX: elevator * 0.3 }}
                            />
                        </div>

                        {/* Vertical Stabilizer */}
                        <motion.div
                            className="absolute left-1/2 bottom-16 -translate-x-1/2 w-4 h-12 bg-slate-600 rounded-t"
                            animate={{ rotateY: rudder * 0.3 }}
                        />

                        {/* Control Indicators */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-4 text-xs">
                            <span className="text-blue-400">Aileron: {aileron}%</span>
                            <span className="text-emerald-400">Elevator: {elevator}%</span>
                            <span className="text-amber-400">Rudder: {rudder}%</span>
                        </div>
                    </div>

                    {/* Spoiler Indicator */}
                    {spoilers > 0 && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-orange-500/20 border border-orange-500 text-orange-400 text-xs font-bold rounded">
                            SPOILERS {spoilers}%
                        </div>
                    )}
                </div>

                {/* Controls Panel */}
                <div className="space-y-6">

                    {/* Primary Controls */}
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Primary Controls</h3>

                        <div className="space-y-4">
                            {/* Elevator */}
                            <div>
                                <div className="flex justify-between text-xs text-slate-400 mb-1">
                                    <span className="flex items-center gap-1"><ArrowUp size={12} /> Pitch Up</span>
                                    <span className="flex items-center gap-1">Pitch Down <ArrowDown size={12} /></span>
                                </div>
                                <input
                                    type="range"
                                    min="-100" max="100" value={elevator}
                                    onChange={(e) => setElevator(Number(e.target.value))}
                                    className="w-full accent-emerald-500"
                                />
                            </div>

                            {/* Aileron */}
                            <div>
                                <div className="flex justify-between text-xs text-slate-400 mb-1">
                                    <span className="flex items-center gap-1"><RotateCcw size={12} /> Roll Left</span>
                                    <span className="flex items-center gap-1">Roll Right <RotateCw size={12} /></span>
                                </div>
                                <input
                                    type="range"
                                    min="-100" max="100" value={aileron}
                                    onChange={(e) => setAileron(Number(e.target.value))}
                                    className="w-full accent-blue-500"
                                />
                            </div>

                            {/* Rudder */}
                            <div>
                                <div className="flex justify-between text-xs text-slate-400 mb-1">
                                    <span className="flex items-center gap-1"><ArrowLeft size={12} /> Yaw Left</span>
                                    <span className="flex items-center gap-1">Yaw Right <ArrowRight size={12} /></span>
                                </div>
                                <input
                                    type="range"
                                    min="-100" max="100" value={rudder}
                                    onChange={(e) => setRudder(Number(e.target.value))}
                                    className="w-full accent-amber-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Secondary Controls */}
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">High Lift Devices</h3>

                        {/* Flaps */}
                        <div className="mb-4">
                            <span className="text-xs text-slate-400 block mb-2">Flaps</span>
                            <div className="flex gap-1">
                                {flapPositions.map((pos) => (
                                    <button
                                        key={pos}
                                        onClick={() => setFlaps(pos)}
                                        className={`flex-1 py-2 text-xs font-bold rounded transition-all ${flaps === pos
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                            }`}
                                    >
                                        {pos}°
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Slats */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-slate-300">Slats</span>
                            <button
                                onClick={() => setSlats(!slats)}
                                className={`px-4 py-1 rounded text-xs font-bold ${slats ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'
                                    }`}
                            >
                                {slats ? 'EXTENDED' : 'RETRACTED'}
                            </button>
                        </div>

                        {/* Spoilers */}
                        <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                <span>Spoilers</span>
                                <span>{spoilers}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="100" value={spoilers}
                                onChange={(e) => setSpoilers(Number(e.target.value))}
                                className="w-full accent-orange-500"
                            />
                        </div>
                    </div>

                    {/* Trim */}
                    <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-white font-bold">Elevator Trim</span>
                            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                                {trimElevator > 0 ? 'NOSE DN' : trimElevator < 0 ? 'NOSE UP' : 'NEUTRAL'}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="-100" max="100" value={trimElevator}
                            onChange={(e) => setTrimElevator(Number(e.target.value))}
                            className="w-full accent-purple-500 mt-2"
                        />
                    </div>

                    {/* Reset Button */}
                    <button
                        onClick={() => {
                            setElevator(0);
                            setAileron(0);
                            setRudder(0);
                            setFlaps(0);
                            setSlats(false);
                            setSpoilers(0);
                            setTrimElevator(0);
                        }}
                        className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors"
                    >
                        Reset All Controls
                    </button>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <h4 className="text-blue-400 font-bold mb-2">Ailerons</h4>
                    <p className="text-slate-400 text-sm">Located on the trailing edge of the wings. Control roll movement. Move differentially (one up, one down).</p>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <h4 className="text-emerald-400 font-bold mb-2">Elevators</h4>
                    <p className="text-slate-400 text-sm">Mounted on the horizontal stabilizer. Control pitch. Move together in the same direction.</p>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <h4 className="text-amber-400 font-bold mb-2">Rudder</h4>
                    <p className="text-slate-400 text-sm">Attached to the vertical stabilizer. Controls yaw. Used for coordination and crosswind landing.</p>
                </div>
            </div>
        </div>
    );
};

export default FlightControlsSystem;
