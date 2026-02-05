import React from 'react';

interface Props {
    onKey: (key: string) => void;
    onLSK: (side: 'L' | 'R', index: number) => void;
}

const MCDUKeyboard: React.FC<Props> = ({ onKey, onLSK }) => {

    const FunctionKey = ({ label, code, color = 'bg-slate-700' }: { label: string, code: string, color?: string }) => (
        <button
            onClick={() => onKey(code)}
            className={`${color} text-white/90 text-[10px] md:text-xs font-bold rounded-sm shadow-[0_4px_0_rgba(0,0,0,0.5)] active:shadow-none active:translate-y-[4px] border-b-2 border-slate-900 flex items-center justify-center p-1 md:p-2 h-10 md:h-12 w-full transition-all`}
        >
            {label}
        </button>
    );

    const LSK = ({ side, index }: { side: 'L' | 'R', index: number }) => (
        <button
            onClick={() => onLSK(side, index)}
            className="bg-slate-700 w-8 h-8 md:w-10 md:h-6 rounded-sm shadow-[0_3px_0_rgba(0,0,0,0.5)] active:shadow-none active:translate-y-[3px] flex items-center justify-center border-l-2 border-r-2 border-slate-800"
        >
            <div className="w-4 h-0.5 bg-white/50"></div>
        </button>
    );

    const AlphaKey = ({ char }: { char: string }) => (
        <button
            onClick={() => onKey(char)}
            className="bg-slate-800 text-white text-sm font-bold rounded-full w-10 h-10 md:w-12 md:h-12 shadow-[0_4px_0_rgba(0,0,0,0.5)] active:shadow-none active:translate-y-[4px] flex items-center justify-center border border-slate-900"
        >
            {char}
        </button>
    );

    return (
        <div className="bg-slate-800 p-4 pt-8 rounded-b-xl border-x-4 border-b-4 border-slate-900 shadow-2xl relative">

            {/* LSK Columns Wrapper (Visual trick to align with screen above) */}
            <div className="absolute -top-[520px] left-0 right-0 h-[520px] pointer-events-none flex justify-between px-1">
                {/* These are defined here but controlled via props to the parent to align with the screen */}
            </div>

            <div className="grid grid-cols-6 gap-2 md:gap-4 max-w-lg mx-auto">

                {/* Row 1 Functions */}
                <div className="col-span-1"><FunctionKey label="DIR" code="DIR" /></div>
                <div className="col-span-1"><FunctionKey label="PROG" code="PROG" /></div>
                <div className="col-span-1"><FunctionKey label="PERF" code="PERF" /></div>
                <div className="col-span-1"><FunctionKey label="INIT" code="INIT" /></div>
                <div className="col-span-1"><FunctionKey label="DATA" code="DATA" /></div>
                <div className="col-span-1"><FunctionKey label="F-PLN" code="F-PLN" color="bg-green-700/80" /></div>

                {/* Row 2 Functions */}
                <div className="col-span-1"><FunctionKey label="RAD NAV" code="RAD_NAV" /></div>
                <div className="col-span-1"><FunctionKey label="FUEL" code="FUEL" /></div>
                <div className="col-span-1"><FunctionKey label="SEC F-PLN" code="SEC_FPLN" /></div>
                <div className="col-span-1"><FunctionKey label="ATC COMM" code="ATC" /></div>
                <div className="col-span-1"><FunctionKey label="MCDU MENU" code="MENU" /></div>
                <div className="col-span-1"><FunctionKey label="AIR PORT" code="AIR_PORT" /></div>

                {/* Numeric Pad & Nav */}
                <div className="col-span-4 grid grid-cols-3 gap-2">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '+/-'].map(k => (
                        <button
                            key={k}
                            onClick={() => onKey(k)}
                            className="bg-slate-200 text-slate-900 text-lg font-bold rounded-full w-10 h-10 md:w-12 md:h-12 shadow-[0_4px_0_rgba(0,0,0,0.5)] active:shadow-none active:translate-y-[4px] flex items-center justify-center mx-auto"
                        >
                            {k}
                        </button>
                    ))}
                </div>

                {/* Right Side Actions */}
                <div className="col-span-2 flex flex-col items-center gap-3">
                    <FunctionKey label="CLR" code="CLR" color="bg-amber-600/80" />
                    <div className="h-4"></div>
                    <FunctionKey label="PREV PAGE" code="PREV_PAGE" />
                    <FunctionKey label="NEXT PAGE" code="NEXT_PAGE" />
                </div>

                {/* Alphabet Pad (Simplified Layout for space) */}
                <div className="col-span-6 flex flex-wrap justify-center gap-2 mt-4">
                    {"ABCDE".split("").map(c => <AlphaKey key={c} char={c} />)}
                    {"FGHIJ".split("").map(c => <AlphaKey key={c} char={c} />)}
                    {"KLMNO".split("").map(c => <AlphaKey key={c} char={c} />)}
                    {"PQRST".split("").map(c => <AlphaKey key={c} char={c} />)}
                    {"UVWXY".split("").map(c => <AlphaKey key={c} char={c} />)}
                    <AlphaKey char="Z" />
                    <AlphaKey char="/" />
                    <AlphaKey char="SP" />
                    <AlphaKey char="OVFY" />
                </div>

            </div>
        </div>
    );
};

export default MCDUKeyboard;
