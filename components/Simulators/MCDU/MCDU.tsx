import React, { useState, useEffect } from 'react';
import MCDUScreen from './MCDUScreen';
import MCDUKeyboard from './MCDUKeyboard';
import { MCDUPage, MCDUState, MCDUColor, MCDULine, MCDUWaypoint } from './mcduTypes';
import { ChevronLeft } from 'lucide-react';

interface Props {
    onExit: () => void;
}

const MCDU: React.FC<Props> = ({ onExit }) => {

    // Internal State
    const [state, setState] = useState<MCDUState>({
        currentPage: MCDUPage.MENU,
        scratchpad: "",
        subPage: 0,
        flightPlan: {
            origin: "____",
            dest: "____",
            alt: "____",
            flightNo: "______",
            costIndex: "__",
            crzFl: "_____",
            zfw: "__._",
            blockFuel: "__._",
            waypoints: []
        },
        radio: {
            vorFreq: "___.__",
            vorCrs: "___",
            ilsFreq: "___.__",
            ilsCrs: "___",
            adfFreq: "____._"
        },
        perf: {
            v1: "___",
            vr: "___",
            v2: "___",
            flaps: "_",
            ths: "_._",
            flex: "__",
            transAlt: "5000",
            phase: 'TAKEOFF'
        }
    });

    const [msgTimeout, setMsgTimeout] = useState<NodeJS.Timeout | null>(null);

    // Helpers
    const showMsg = (msg: string) => {
        setState(s => ({ ...s, scratchpadMessage: msg }));
        if (msgTimeout) clearTimeout(msgTimeout);
        const t = setTimeout(() => {
            setState(s => ({ ...s, scratchpadMessage: undefined }));
        }, 2000);
        setMsgTimeout(t);
    };

    const handleKey = (key: string) => {
        if (state.scratchpadMessage) {
            setState(s => ({ ...s, scratchpadMessage: undefined }));
        }

        if (key === 'CLR') {
            setState(s => ({ ...s, scratchpad: s.scratchpad.slice(0, -1) }));
            return;
        }

        // Navigation Keys
        const navMap: Record<string, MCDUPage> = {
            'INIT': MCDUPage.INIT_A,
            'PERF': MCDUPage.PERF,
            'PROG': MCDUPage.PROG,
            'DATA': MCDUPage.DATA,
            'F-PLN': MCDUPage.F_PLN,
            'RAD_NAV': MCDUPage.RAD_NAV,
            'DIR': MCDUPage.DIR,
            'MENU': MCDUPage.MENU
        };

        if (navMap[key]) {
            setState(s => ({ ...s, currentPage: navMap[key] }));
            return;
        }

        // Typing
        if (key === 'SP') key = ' ';
        if (state.scratchpad.length < 24) {
            setState(s => ({ ...s, scratchpad: s.scratchpad + key }));
        } else {
            showMsg("SCRATCHPAD FULL");
        }
    };

    const handleLSK = (side: 'L' | 'R', index: number) => {
        const key = `${index}${side}`;

        // Clear message on LSK press
        if (state.scratchpadMessage) {
            setState(s => ({ ...s, scratchpadMessage: undefined }));
            return;
        }

        // Logic router based on page
        switch (state.currentPage) {
            case MCDUPage.MENU:
                if (key === '1L') setState(s => ({ ...s, currentPage: MCDUPage.F_PLN }));
                if (key === '2L') setState(s => ({ ...s, currentPage: MCDUPage.INIT_A }));
                break;

            case MCDUPage.INIT_A:
                if (key === '1R') {
                    if (state.scratchpad.length > 0) {
                        // Simple validation
                        if (state.scratchpad.includes('/')) {
                            const [orig, dest] = state.scratchpad.split('/');
                            setState(s => ({
                                ...s,
                                flightPlan: { ...s.flightPlan, origin: orig, dest: dest },
                                scratchpad: ""
                            }));
                        } else {
                            showMsg("FORMAT ERROR");
                        }
                    }
                }
                if (key === '2L') {
                    // Flight No
                    if (state.scratchpad.length > 0) {
                        setState(s => ({
                            ...s,
                            flightPlan: { ...s.flightPlan, flightNo: state.scratchpad },
                            scratchpad: ""
                        }));
                    }
                }
                if (key === '3L' && state.scratchpad) setState(s => ({ ...s, flightPlan: { ...s.flightPlan, costIndex: s.scratchpad }, scratchpad: "" }));
                if (key === '5L' && state.scratchpad) setState(s => ({ ...s, flightPlan: { ...s.flightPlan, crzFl: s.scratchpad }, scratchpad: "" }));
                if (key === '6R') {
                    setState(s => ({ ...s, currentPage: MCDUPage.INIT_B }));
                }
                break;

            case MCDUPage.INIT_B:
                if (key === '6L') setState(s => ({ ...s, currentPage: MCDUPage.INIT_A }));
                if (key === '1L') { // ZFW
                    if (state.scratchpad) setState(s => ({ ...s, flightPlan: { ...s.flightPlan, zfw: s.scratchpad }, scratchpad: "" }));
                }
                if (key === '2L') { // BLOCK FUEL
                    if (state.scratchpad) setState(s => ({ ...s, flightPlan: { ...s.flightPlan, blockFuel: s.scratchpad }, scratchpad: "" }));
                }
                break;

            case MCDUPage.F_PLN:
                // Waypoint interaction could go here
                break;

            case MCDUPage.PERF:
                if (key === '6R') {
                    // Cycle phases for demo
                    const phases = ['TAKEOFF', 'CLB', 'CRZ', 'DES', 'APPR'] as const;
                    const idx = phases.indexOf(state.perf.phase);
                    const next = phases[(idx + 1) % phases.length];
                    setState(s => ({ ...s, perf: { ...s.perf, phase: next } }));
                }
                // Input V-Speeds
                if (key === '1L' && state.scratchpad) setState(s => ({ ...s, perf: { ...s.perf, v1: s.scratchpad }, scratchpad: "" }));
                if (key === '2L' && state.scratchpad) setState(s => ({ ...s, perf: { ...s.perf, vr: s.scratchpad }, scratchpad: "" }));
                if (key === '3L' && state.scratchpad) setState(s => ({ ...s, perf: { ...s.perf, v2: s.scratchpad }, scratchpad: "" }));
                break;

            case MCDUPage.RAD_NAV:
                if (key === '1L' && state.scratchpad) setState(s => ({ ...s, radio: { ...s.radio, vorFreq: s.scratchpad }, scratchpad: "" }));
                if (key === '2L' && state.scratchpad) setState(s => ({ ...s, radio: { ...s.radio, ilsFreq: s.scratchpad }, scratchpad: "" }));
                if (key === '3L' && state.scratchpad) setState(s => ({ ...s, radio: { ...s.radio, adfFreq: s.scratchpad }, scratchpad: "" }));
                break;

            default:
                showMsg("NOT ALLOWED");
                break;
        }
    };

    // Page Renderers
    const renderPage = (): { title: string, lines: MCDULine[] } => {
        switch (state.currentPage) {
            case MCDUPage.MENU:
                return {
                    title: "MCDU MENU",
                    lines: [
                        { id: 1, labelLeft: "<FMGC", center: "SELECT", colorCenter: MCDUColor.WHITE },
                        { id: 2, labelLeft: "<ATSU" },
                        { id: 3, labelLeft: "<AIDS" },
                        { id: 4, labelLeft: "<CFDS" },
                        { id: 5, labelLeft: "" },
                        { id: 6, labelLeft: "" },
                    ]
                };

            case MCDUPage.INIT_A:
                return {
                    title: "INIT",
                    lines: [
                        {
                            id: 1,
                            labelLeft: "CO RTE",
                            dataLeft: "__________",
                            labelRight: "FROM/TO",
                            dataRight: state.flightPlan.origin.includes('_') ? "____/____" : `${state.flightPlan.origin}/${state.flightPlan.dest}`
                        },
                        {
                            id: 2,
                            labelLeft: "ALTN/CO RTE",
                            dataLeft: "____/__________",
                            labelRight: "ALT/TEMP",
                            dataRight: state.flightPlan.alt
                        },
                        {
                            id: 3,
                            labelLeft: "FLT NBR",
                            dataLeft: state.flightPlan.flightNo,
                            colorLeft: state.flightPlan.flightNo.includes('_') ? MCDUColor.AMBER : MCDUColor.GREEN
                        },
                        {
                            id: 4,
                            labelLeft: "COST INDEX",
                            dataLeft: state.flightPlan.costIndex,
                            colorLeft: state.flightPlan.costIndex.includes('_') ? MCDUColor.AMBER : MCDUColor.GREEN
                        },
                        {
                            id: 5,
                            labelLeft: "CRZ FL/TEMP",
                            dataLeft: state.flightPlan.crzFl,
                            labelRight: "TROPO",
                            dataRight: "36090",
                            colorRight: MCDUColor.GREEN
                        },
                        {
                            id: 6,
                            labelRight: "INIT B>",
                            colorRight: MCDUColor.WHITE
                        },
                    ]
                };

            case MCDUPage.INIT_B:
                return {
                    title: "INIT",
                    lines: [
                        { id: 1, labelLeft: "ZFW/ZFWCG", dataLeft: `${state.flightPlan.zfw} / 25.0` },
                        { id: 2, labelLeft: "BLOCK", dataLeft: state.flightPlan.blockFuel, colorLeft: MCDUColor.AMBER },
                        { id: 3, labelLeft: "EST TOW", dataLeft: "65.4" },
                        { id: 4, labelLeft: "EST LDW", dataLeft: "63.2" },
                        { id: 5, labelLeft: "TAXI", dataLeft: "0.2" },
                        { id: 6, labelLeft: "<INIT A", colorLeft: MCDUColor.WHITE },
                    ]
                };

            case MCDUPage.PERF:
                return {
                    title: `PERF ${state.perf.phase}`,
                    lines: [
                        { id: 1, labelLeft: "V1", dataLeft: state.perf.v1, labelRight: "FLAPS/THS", dataRight: `${state.perf.flaps}/${state.perf.ths}` },
                        { id: 2, labelLeft: "VR", dataLeft: state.perf.vr, labelRight: "FLEX TO", dataRight: state.perf.flex },
                        { id: 3, labelLeft: "V2", dataLeft: state.perf.v2 },
                        { id: 4, labelLeft: "TRANS ALT", dataLeft: state.perf.transAlt },
                        { id: 5, labelLeft: "THR RED/ACC", dataLeft: "1500/1500" },
                        { id: 6, labelLeft: "ENG OUT ACC", dataLeft: "1500", labelRight: "NEXT PHASE>", colorRight: MCDUColor.WHITE },
                    ]
                };

            case MCDUPage.RAD_NAV:
                return {
                    title: "RADIO NAV",
                    lines: [
                        { id: 1, labelLeft: "VOR/FREQ/CRS", dataLeft: `${state.radio.vorFreq}/${state.radio.vorCrs}` },
                        { id: 2, labelLeft: "ILS/FREQ/CRS", dataLeft: `${state.radio.ilsFreq}/${state.radio.ilsCrs}` },
                        { id: 3, labelLeft: "ADF/FREQ", dataLeft: state.radio.adfFreq },
                        { id: 4, labelLeft: "MLS/FREQ/CRS", dataLeft: "[ ]/[ ]" },
                        { id: 5, labelLeft: "" },
                        { id: 6, labelLeft: "" },
                    ]
                };

            case MCDUPage.PROG:
                return {
                    title: "PROG",
                    lines: [
                        { id: 1, labelLeft: "CRZ", dataLeft: "FL360", labelRight: "OPT/REC MAX", dataRight: "FL370/FL390" },
                        { id: 2, labelLeft: "BRG/DIST TO", center: state.flightPlan.dest, colorCenter: MCDUColor.GREEN },
                        { id: 3, labelLeft: "260°/ 420NM", colorLeft: MCDUColor.GREEN },
                        { id: 4, labelLeft: "" },
                        { id: 5, labelLeft: "GPS PRIMARY", center: "ACCURACY", colorCenter: MCDUColor.WHITE, labelRight: "HIGH", colorRight: MCDUColor.GREEN },
                        { id: 6, labelLeft: "REQUIRED", dataLeft: "0.2NM", labelRight: "ESTIMATED", dataRight: "0.04NM" },
                    ]
                };

            case MCDUPage.DIR:
                return {
                    title: "DIR TO",
                    lines: [
                        { id: 1, labelLeft: "WAYPOINT", dataLeft: "______", colorLeft: MCDUColor.AMBER },
                        { id: 2, labelLeft: "F-PLN WPTS", center: "DIRECT TO", colorCenter: MCDUColor.WHITE },
                        { id: 3, labelLeft: "EGLL" },
                        { id: 4, labelLeft: "BPK" },
                        { id: 5, labelLeft: "BIG" },
                        { id: 6, labelLeft: "DET" },
                    ]
                };

            case MCDUPage.DATA:
                return {
                    title: "DATA INDEX",
                    lines: [
                        { id: 1, labelLeft: "<POSITION MONITOR" },
                        { id: 2, labelLeft: "<IRS MONITOR" },
                        { id: 3, labelLeft: "<GPS MONITOR" },
                        { id: 4, labelLeft: "<A/C STATUS" },
                        { id: 5, labelLeft: "<CLOSEST AIRPORTS" },
                        { id: 6, labelLeft: "WAYPOINTS>", colorLeft: MCDUColor.WHITE, labelRight: "NEVAIDS>", colorRight: MCDUColor.WHITE },
                    ]
                };

            case MCDUPage.F_PLN:
                // Dynamic F-PLN generation
                const fplnLines: MCDULine[] = [];

                // Default sample if empty
                const wpts = state.flightPlan.waypoints.length > 0 ? state.flightPlan.waypoints : [
                    { id: state.flightPlan.origin || "ORIGIN", type: 'ARPT', time: '12:00' },
                    { id: "SID", type: 'WPT', dist: '5' },
                    { id: "WPT1", type: 'WPT', dist: '25' },
                    { id: "WPT2", type: 'WPT', dist: '40' },
                    { id: state.flightPlan.dest || "DEST", type: 'ARPT', time: '13:00', dist: '120' }
                ];

                // Paginate logic (simplified for now, always showing first few)
                wpts.slice(0, 5).forEach((wpt, i) => {
                    fplnLines.push({
                        id: i + 1,
                        labelLeft: wpt.time,
                        dataLeft: wpt.id,
                        colorLeft: MCDUColor.GREEN,
                        labelRight: wpt.speedConstraint ? "SPD/ALT" : "DIST",
                        dataRight: wpt.dist || "----",
                        colorRight: MCDUColor.WHITE
                    });
                });
                if (fplnLines.length < 5) fplnLines.push({ id: 6, labelLeft: "--- END OF F-PLN ---" });
                else fplnLines.push({ id: 6, labelLeft: "DEST", dataLeft: state.flightPlan.dest, colorLeft: MCDUColor.GREEN });

                return {
                    title: "F-PLN",
                    lines: fplnLines
                };

            default:
                return {
                    title: state.currentPage,
                    lines: [
                        { id: 3, center: "PAGE NOT IMPLEMENTED", colorCenter: MCDUColor.AMBER }
                    ]
                };
        }
    };

    const pageData = renderPage();

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            {/* Back button for internal nav */}
            <div className="w-full max-w-2xl mb-4">
                <button onClick={onExit} className="flex items-center text-slate-400 hover:text-white transition-colors">
                    <ChevronLeft size={20} />
                    <span className="font-bold">EXIT SIMULATOR</span>
                </button>
            </div>

            <div className="bg-slate-800 p-4 rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-700 relative">

                {/* Visual Bezel Screw */}
                <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-slate-600 shadow-inner"></div>
                <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-slate-600 shadow-inner"></div>
                <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-slate-600 shadow-inner"></div>
                <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-slate-600 shadow-inner"></div>

                <div className="flex flex-col gap-1">
                    {/* Screen Area with LSK Buttons overlaid on the sides */}
                    <div className="relative mb-2">
                        {/* LSK Buttons Left */}
                        <div className="absolute left-0 top-[12%] bottom-[12%] flex flex-col justify-between z-20 -translate-x-1/2">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <button
                                    key={`L${i}`}
                                    onClick={() => handleLSK('L', i)}
                                    className="w-8 h-8 md:w-10 md:h-10 bg-slate-900 rounded-sm border-2 border-slate-700 shadow-lg active:scale-95 flex items-center justify-center group"
                                >
                                    <div className="w-4 h-1 bg-white/30 group-hover:bg-white/60"></div>
                                </button>
                            ))}
                        </div>

                        {/* THE SCREEN */}
                        <div className="aspect-[1/1] md:aspect-[4/3] w-full px-5 md:px-6">
                            <MCDUScreen
                                lines={pageData.lines}
                                title={pageData.title}
                                scratchpad={state.scratchpad}
                                scratchpadMessage={state.scratchpadMessage}
                            />
                        </div>

                        {/* LSK Buttons Right */}
                        <div className="absolute right-0 top-[12%] bottom-[12%] flex flex-col justify-between z-20 translate-x-1/2">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <button
                                    key={`R${i}`}
                                    onClick={() => handleLSK('R', i)}
                                    className="w-8 h-8 md:w-10 md:h-10 bg-slate-900 rounded-sm border-2 border-slate-700 shadow-lg active:scale-95 flex items-center justify-center group"
                                >
                                    <div className="w-4 h-1 bg-white/30 group-hover:bg-white/60"></div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Keyboard */}
                    <MCDUKeyboard
                        onKey={handleKey}
                        onLSK={handleLSK}
                    />
                </div>
            </div>
        </div>
    );
};

export default MCDU;
