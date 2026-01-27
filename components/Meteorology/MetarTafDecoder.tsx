import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Wind, Eye, Cloud, Thermometer, Database, Calendar, Info, Clock, AlertCircle } from 'lucide-react';

const PRESETS = [
    { name: "Standard", code: "EGLL 261250Z 24015KT 9999 FEW025 15/08 Q1013 NOSIG=" },
    { name: "Bad Weather", code: "LFPG 261300Z 18025G40KT 0800 R27R/1200 +TSRA FEW005 SCT010CB OVC020 12/11 Q0998 BECMG 0500 FG=" },
    { name: "CAVOK", code: "LEMD 261330Z 04005KT CAVOK 22/04 Q1025 NOSIG=" },
    { name: "Complex Trend", code: "EDDF 261220Z 20008KT 4000 -RA BR BKN008 08/07 Q1002 TEMPO 1500 +RA BKN003 PROB40 TEMPO 0800 FG=" }
];

const MetarTafDecoder: React.FC = () => {
    const [input, setInput] = useState(PRESETS[0].code);
    const [decoded, setDecoded] = useState<any[]>([]);

    useEffect(() => {
        decodeMetar(input);
    }, [input]);

    const decodeMetar = (metar: string) => {
        const parts = metar.replace('=', '').split(' ');
        const result: any[] = [];

        parts.forEach((part) => {
            let field = "UNKNOWN";
            let desc = "Not recognized";
            let color = "text-slate-500";
            let icon = Database;

            // Simple Pattern Matching (Educational/Heuristic)
            if (part.match(/^[A-Z]{4}$/)) {
                field = "Station ID";
                desc = `ICAO code for the airport: ${part}`;
                color = "text-white font-bold";
                icon = Database;
            } else if (part.match(/^\d{6}Z$/)) {
                field = "Day/Time";
                desc = `Day ${part.slice(0, 2)} at ${part.slice(2, 4)}:${part.slice(4, 6)} UTC`;
                color = "text-blue-400";
                icon = Clock;
            } else if (part.match(/^\d{3}\d{2}(G\d{2})?KT$/) || part.match(/^VRB\d{2}KT$/)) {
                field = "Wind";
                const dir = part.slice(0, 3);
                const speed = part.slice(3, 5);
                desc = dir === 'VRB' ? `Variable direction at ${speed} knots` : `From ${dir}° at ${speed} knots`;
                if (part.includes('G')) desc += `, Gusting to ${part.split('G')[1].replace('KT', '')} knots`;
                color = "text-teal-400";
                icon = Wind;
            } else if (part === 'CAVOK') {
                field = "Visibility/Clouds";
                desc = "Ceiling And Visibility OK (Vis > 10km, No cloud below 5000ft, No significant weather)";
                color = "text-emerald-400";
                icon = Eye;
            } else if (part.match(/^\d{4}$/) || part === '9999' || part === '0000') {
                field = "Visibility";
                desc = part === '9999' ? "Visibility 10km or more" : `${part} meters horizontal visibility`;
                color = "text-sky-400";
                icon = Eye;
            } else if (part.match(/^(FEW|SCT|BKN|OVC|VV)\d{3}(CB|TCU)?$/)) {
                field = "Clouds";
                const amt = part.slice(0, 3);
                const height = parseInt(part.slice(3, 6)) * 100;
                const cloudType = part.includes('CB') ? ' Cumulonimbus' : part.includes('TCU') ? ' Towering Cumulus' : '';
                desc = `${amt} at ${height}ft AGL${cloudType}`;
                color = "text-slate-300";
                icon = Cloud;
            } else if (part.match(/^-?\d{2}\/-?\d{2}$/)) {
                field = "Temp/Dewpoint";
                const [t, d] = part.split('/');
                desc = `Temperature ${t.replace('M', '-')}°C, Dewpoint ${d.replace('M', '-')}°C`;
                color = "text-orange-400";
                icon = Thermometer;
            } else if (part.match(/^Q\d{4}$/)) {
                field = "Altimeter (QNH)";
                desc = `Sea level pressure: ${part.slice(1)} hPa (hectopascals)`;
                color = "text-purple-400";
                icon = FileText;
            } else if (['NOSIG', 'BECMG', 'TEMPO', 'PROB30', 'PROB40'].includes(part)) {
                field = "Trend";
                desc = part === 'NOSIG' ? "No Significant Change expected in the next 2 hours" : `Change indicator: ${part}`;
                color = "text-yellow-500 font-bold";
                icon = Info;
            } else if (part.match(/^[+-]?(RA|SN|DZ|FG|HZ|BR|TS|GR|FU)+$/)) {
                field = "Present Weather";
                desc = `Weather phenomenon: ${part}`;
                color = "text-red-400";
                icon = AlertCircle;
            } else if (part.match(/^R\d{2}([LCR])?\/\d{4}[NDU]?$/)) {
                field = "RVR";
                desc = `Runway Visual Range for ${part.split('/')[0]}: ${part.split('/')[1]}m`;
                color = "text-amber-500";
                icon = Eye;
            }

            result.push({ raw: part, field, desc, color, icon });
        });

        setDecoded(result);
    };

    return (
        <div className="space-y-8 p-4 md:p-6 max-w-7xl mx-auto text-slate-200">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                <div className="flex-grow w-full">
                    <h2 className="text-3xl font-black text-white flex items-center gap-3 mb-2">
                        <FileText className="text-yellow-400" />
                        METAR/TAF Decoder
                    </h2>
                    <p className="text-slate-400 text-sm mb-6">Interactive decoding for pilot training. Click segments to see details.</p>

                    <div className="relative group mb-8">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value.toUpperCase())}
                            className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl px-6 py-4 text-xl font-mono text-white focus:border-yellow-500/50 outline-none transition-all pr-12"
                            placeholder="Enter METAR or TAF here..."
                        />
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-yellow-500" />
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                        {PRESETS.map((p) => (
                            <button
                                key={p.name}
                                onClick={() => setInput(p.code)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${input === p.code ? 'bg-yellow-600 border-yellow-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-white'}`}
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>

                    <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
                        <div className="flex flex-wrap gap-x-3 gap-y-4">
                            {decoded.map((item, idx) => (
                                <Segment key={idx} item={item} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:w-80 space-y-6">
                    <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Info size={14} className="text-blue-400" /> Quick Guide
                        </h4>
                        <ul className="space-y-3 text-xs text-slate-400 leading-relaxed">
                            <li><strong>9999:</strong> Visibility 10km or more</li>
                            <li><strong>VV:</strong> Vertical Visibility (when indefinite ceiling)</li>
                            <li><strong>NOSIG:</strong> No significant change</li>
                            <li><strong>CAVOK:</strong> No cloud below 5k, no TS, vis {">"}10k</li>
                        </ul>
                    </div>

                    <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-3xl">
                        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Did You Know?</h4>
                        <p className="text-[11px] text-slate-400 italic">
                            METAR stands for "MÉTéorologique Aviation Régulière", French for Regular Aviation Meteorological report.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Segment = ({ item }: { item: any }) => {
    const Icon = item.icon;
    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="group relative cursor-default"
        >
            <div className={`text-2xl font-mono px-2 py-1 rounded-lg hover:bg-slate-900 transition-colors ${item.color}`}>
                {item.raw}
            </div>

            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50">
                <div className="bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-2xl relative">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-t border-l border-slate-700 rotate-45" />
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1.5 rounded-lg bg-slate-950 ${item.color.replace('font-bold', '')}`}>
                            <Icon size={14} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.field}</span>
                    </div>
                    <p className="text-xs text-white leading-relaxed">{item.desc}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default MetarTafDecoder;
