import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Cloud } from '@react-three/drei';
import { CloudRain, Snowflake, AlertOctagon, Info, ArrowDown, ArrowUp } from 'lucide-react';
import Precipitation3D from './Precipitation3D';

const Precipitation: React.FC = () => {
    const [precipType, setPrecipType] = useState<'rain' | 'snow' | 'hail' | 'drizzle' | 'freezing_rain'>('rain');

    const content = {
        rain: {
            title: "Rain (+RA)",
            desc: "Water drops larger than 0.5mm. Produced by Nimbostratus (continuous) or Cumulonimbus (showers).",
            process: "coalescence",
            processTitle: "Collision-Coalescence",
            fact: "Raindrops fall at about 14-20 mph!",
            icon: CloudRain,
            color: "blue"
        },
        drizzle: {
            title: "Drizzle (DZ)",
            desc: "Very small water drops (<0.5mm) that settle slowly. Unlike rain, drizzle falls from Stratus clouds.",
            process: "coalescence",
            processTitle: "Collision-Coalescence (Low Level)",
            fact: "Drizzle can reduce visibility significantly (Mist/Fog).",
            icon: CloudRain, // Fallback safe icon
            color: "sky"
        },
        snow: {
            title: "Snow (SN)",
            desc: "Ice crystals that remain frozen from cloud to ground. Occurs when temperature is <0°C throughout.",
            process: "bergeron",
            processTitle: "Bergeron-Findeisen Process",
            fact: "Dry snow gives better braking action than wet snow.",
            icon: Snowflake,
            color: "white"
        },
        freezing_rain: {
            title: "Freezing Rain (FZRA)",
            desc: "Supercooled rain that freezes instantly upon impact with the ground or aircraft frame. EXTREME HAZARD!",
            process: "freezing_rain",
            processTitle: "Supercooled Droplets",
            fact: "Causes Clear Ice - the most dangerous type of airframe icing.",
            icon: Snowflake, // Fallback safe icon
            color: "cyan"
        },
        hail: {
            title: "Hail (GR)",
            desc: "Solid balls of ice >5mm. Only formed in Cumulonimbus (CB) clouds with strong updrafts.",
            process: "accretion",
            processTitle: "Accretion in Updrafts",
            fact: "Large hail indicates severe turbulence and wind shear!",
            icon: AlertOctagon,
            color: "teal"
        }
    };

    const currentInfo = content[precipType];

    return (
        <div className="h-screen w-full bg-slate-950 flex flex-col overflow-y-auto">

            {/* TOP SECTION: 3D Visualization (60vh) */}
            <div className="relative h-[60vh] shrink-0 border-b border-slate-700">
                {/* Header Overlay */}
                <div className="absolute top-0 left-0 w-full z-10 p-6 flex justify-between items-start pointer-events-none">
                    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-xl pointer-events-auto shadow-2xl max-w-xl">
                        <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                            <currentInfo.icon className={`text-${currentInfo.color}-400`} size={32} />
                            {currentInfo.title}
                        </h1>

                        {/* Selector */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {(Object.keys(content) as Array<keyof typeof content>).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setPrecipType(t)}
                                    className={`px-3 py-1 rounded-lg font-bold transition-all text-xs uppercase tracking-wide border ${precipType === t
                                        ? 'bg-blue-600 border-blue-400 text-white shadow-lg'
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    {t.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                        <p className="text-slate-200 text-sm">{currentInfo.desc}</p>
                    </div>
                </div>

                {/* 3D Canvas */}
                <div className="absolute inset-0 bg-slate-900">
                    <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
                        <Suspense fallback={null}>
                            <color attach="background" args={['#0f172a']} />
                            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} intensity={1} />
                            <Cloud position={[0, 15, 0]} opacity={0.6} speed={0.2} width={20} depth={5} segments={20} />
                            <Precipitation3D type={precipType} />
                            <OrbitControls enableZoom={true} enablePan={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} autoRotate autoRotateSpeed={0.5} />
                            <gridHelper args={[100, 100, 0x1e293b, 0x0f172a]} position={[0, -10, 0]} />
                        </Suspense>
                    </Canvas>
                </div>

                <div className="absolute bottom-4 w-full text-center pointer-events-none">
                    <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                        Scroll down for Diagram & Theory
                    </span>
                </div>
            </div>

            {/* BOTTOM SECTION: Educational content (Diagrams) */}
            <div className="flex-1 bg-slate-900 p-8">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">

                    {/* Diagram Container */}
                    <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl relative min-h-[300px] flex items-center justify-center">
                        <h3 className="absolute top-4 left-6 text-slate-400 text-xs font-bold uppercase tracking-wider">
                            Formation Process: {currentInfo.processTitle}
                        </h3>

                        <DiagramView process={currentInfo.process as any} />
                    </div>

                    {/* Explainer Text */}
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-900/30 rounded-lg text-blue-400">
                                <Info size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">How it forms</h3>
                                <p className="text-slate-300 leading-relaxed">
                                    {precipType === 'rain' && "In warm clouds (>0°C), larger droplets fall faster, colliding with smaller ones and merging. This is the Collision-Coalescence process. In cold clouds, ice crystals melt as they fall through warmer air."}
                                    {precipType === 'drizzle' && "Drizzle forms in low stratus clouds where vertical motion is weak. Droplets grow only slightly by coalescence, remaining very small (<0.5mm) and falling slowly."}
                                    {precipType === 'snow' && "Ice crystals grow by deposition (vapor turning directly to ice) at the expense of supercooled water droplets. This is the Bergeron process. They aggregate into snowflakes as they fall."}
                                    {precipType === 'hail' && "Hailstones are recirculated in strong Cumulonimbus updrafts. They collect layers of supercooled water which freezes on impact (Accretion) until they are too heavy for the updraft to support."}
                                    {precipType === 'freezing_rain' && "Snow falls into a warm layer and melts into rain, then passes through a shallow freezing layer near the ground. The drops become supercooled (<0°C) but remain liquid until they hit a surface."}
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                            <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                                Key Associated Cloud
                            </h4>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                                    <Cloud size={32} className="text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-blue-200">
                                        {precipType === 'hail' ? 'Cumulonimbus (CB)' : precipType === 'drizzle' ? 'Stratus (ST)' : 'Nimbostratus (NS)'}
                                    </p>
                                    <p className="text-slate-400 text-sm">
                                        {precipType === 'hail' ? 'Vertical development, strong updrafts' : 'Layer cloud, stable air'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- SVG DIAGRAMS ---

const DiagramView = ({ process }: { process: 'coalescence' | 'bergeron' | 'accretion' | 'freezing_rain' }) => {
    if (process === 'coalescence') {
        return (
            <svg viewBox="0 0 300 200" className="w-full h-full max-w-sm">
                {/* Background Cloud */}
                <path d="M50 80 Q70 40 100 50 Q130 20 180 50 Q230 40 250 90 A50 50 0 0 1 200 150 L100 150 A50 50 0 0 1 50 80" fill="#334155" opacity="0.5" />

                {/* Large Drop Falling */}
                <circle cx="150" cy="60" r="8" fill="#60a5fa">
                    <animate attributeName="cy" from="60" to="180" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="r" values="8; 12; 15" dur="2s" repeatCount="indefinite" />
                </circle>

                {/* Small Drops being absorbed */}
                <circle cx="150" cy="100" r="4" fill="#93c5fd">
                    <animate attributeName="cy" from="100" to="120" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0" dur="2s" repeatCount="indefinite" keyTimes="0;0.5" />
                </circle>
                <circle cx="150" cy="140" r="5" fill="#93c5fd">
                    <animate attributeName="cy" from="140" to="160" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0" dur="2s" repeatCount="indefinite" keyTimes="0;0.7" />
                </circle>

                <text x="180" y="100" fill="white" fontSize="12" className="font-mono">Larger drop falls fast</text>
                <text x="180" y="120" fill="#93c5fd" fontSize="12" className="font-mono">Collects small drops</text>
            </svg>
        );
    }

    if (process === 'bergeron') {
        return (
            <svg viewBox="0 0 300 200" className="w-full h-full max-w-sm">
                <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="gray" strokeWidth="0.5" opacity="0.2" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Ice Crystal */}
                <g transform="translate(150, 100)">
                    <path d="M0 -30 L0 30 M-26 -15 L26 15 M-26 15 L26 -15" stroke="white" strokeWidth="3" />
                    <circle r="5" fill="white" />
                    <animateTransform attributeName="transform" type="rotate" from="0 150 100" to="360 150 100" dur="10s" repeatCount="indefinite" />
                </g>

                {/* Water Droplets Evaporating */}
                <circle cx="100" cy="80" r="10" fill="#60a5fa" opacity="0.7">
                    <animate attributeName="r" values="10; 0" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7; 0" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="200" cy="120" r="10" fill="#60a5fa" opacity="0.7">
                    <animate attributeName="r" values="10; 0" dur="3s" repeatCount="indefinite" begin="1s" />
                    <animate attributeName="opacity" values="0.7; 0" dur="3s" repeatCount="indefinite" begin="1s" />
                </circle>

                {/* Vapor path */}
                <path d="M100 80 L140 90 M200 120 L160 110" stroke="#a5f3fc" strokeDasharray="4,4">
                    <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite" />
                </path>

                <text x="20" y="180" fill="#a5f3fc" fontSize="12">Water evaporates...</text>
                <text x="180" y="180" fill="white" fontSize="12">...Ice grows (Sublimation)</text>
            </svg>
        );
    }

    if (process === 'accretion') {
        return (
            <svg viewBox="0 0 300 200" className="w-full h-full max-w-sm">
                <defs>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
                    </marker>
                </defs>
                {/* CB Cloud Outline */}
                <path d="M50 180 L50 50 Q150 0 250 50 L250 180" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="5,5" />

                {/* Updraft Arrows */}
                <path d="M100 180 L100 100" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow)" />
                <path d="M120 180 L120 80" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow)" />

                {/* Hail trajectory */}
                <path d="M150 80 Q180 40 200 80 T200 140 T150 100" fill="none" stroke="white" strokeWidth="2" strokeDasharray="4,4">
                    <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1s" repeatCount="indefinite" />
                </path>

                {/* Hailstone Growing */}
                <circle cx="150" cy="80" r="5" fill="white">
                    <animateMotion path="M0 0 Q30 -40 50 0 T50 60 T0 20" dur="4s" repeatCount="indefinite" />
                    <animate attributeName="r" values="5; 8; 12; 15; 5" dur="4s" repeatCount="indefinite" />
                </circle>

                <text x="20" y="150" fill="#ef4444" fontSize="12">Strong Updrafts</text>
                <text x="180" y="30" fill="white" fontSize="12">Recirculation</text>
            </svg>
        );
    }

    if (process === 'freezing_rain') {
        return (
            <svg viewBox="0 0 300 200" className="w-full h-full max-w-sm">
                {/* Layers */}
                <rect x="0" y="0" width="300" height="60" fill="#1e293b" opacity="0.3" /> {/* Cold Cloud */}
                <rect x="0" y="60" width="300" height="80" fill="#ef4444" opacity="0.1" /> {/* Warm Layer */}
                <rect x="0" y="140" width="300" height="60" fill="#3b82f6" opacity="0.2" /> {/* Freezing Layer */}

                <text x="10" y="30" fill="white" fontSize="10">Cold Cloud (&lt;0°C)</text>
                <text x="10" y="100" fill="#fca5a5" fontSize="10">Warm Layer (&gt;0°C)</text>
                <text x="10" y="170" fill="#93c5fd" fontSize="10">Freezing Layer (&lt;0°C)</text>

                {/* Falling Particle */}
                <g transform="translate(150,0)">
                    {/* Snow */}
                    <path d="M0 20 L0 30 M-5 25 L5 25" stroke="white" strokeWidth="2">
                        <animateTransform attributeName="transform" type="translate" from="0 0" to="0 60" dur="2s" fill="freeze" />
                        <animate attributeName="opacity" values="1;0" dur="0.1s" begin="2s" fill="freeze" />
                    </path>

                    {/* Melt to Rain */}
                    <circle cx="0" cy="0" r="4" fill="#60a5fa" opacity="0">
                        <animate attributeName="opacity" values="0;1" dur="0.1s" begin="2s" fill="freeze" />
                        <animateTransform attributeName="transform" type="translate" from="0 60" to="0 140" dur="2s" begin="2s" fill="freeze" />
                    </circle>

                    {/* Supercool */}
                    <circle cx="0" cy="0" r="4" fill="#a5f3fc" stroke="white" opacity="0">
                        <animate attributeName="opacity" values="0;1" dur="0.1s" begin="4s" fill="freeze" />
                        <animateTransform attributeName="transform" type="translate" from="0 140" to="0 190" dur="1s" begin="4s" fill="freeze" />
                    </circle>
                </g>

                <text x="170" y="110" fill="white" fontSize="10">Melts</text>
                <text x="170" y="160" fill="white" fontSize="10">Supercools</text>
            </svg>
        );
    }

    return null;
};

export default Precipitation;
