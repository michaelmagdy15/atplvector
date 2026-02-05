import React from 'react';
import { MCDULine, MCDUColor } from './mcduTypes';

interface Props {
    lines: MCDULine[];
    title: string;
    pageNumber?: string; // e.g., "1/2"
    scratchpad: string;
    scratchpadMessage?: string;
}

const MCDUScreen: React.FC<Props> = ({ lines, title, pageNumber, scratchpad, scratchpadMessage }) => {
    return (
        <div className="bg-black border-[12px] border-slate-700 rounded-lg p-2 w-full h-full shadow-[inset_0_0_20px_rgba(0,0,0,1)] relative overflow-hidden font-mono">
            {/* CRT Scanline Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_2px,3px_100%]"></div>

            {/* Screen Content Wrapper */}
            <div className="relative z-0 h-full flex flex-col justify-between py-1 px-2">

                {/* Header Line */}
                <div className="flex justify-between items-end border-b border-white/20 pb-0.5 mb-1 h-8">
                    <span className="text-sm font-bold text-white transform scale-x-90 origin-left tracking-tighter">{title}</span>
                    {pageNumber && <span className="text-xs font-bold text-white transform scale-x-90 origin-right">{pageNumber}</span>}
                </div>

                {/* Data Lines */}
                <div className="flex-1 flex flex-col justify-around">
                    {lines.map((line) => (
                        <div key={line.id} className="flex flex-col h-[16%] justify-center relative group">
                            {/* LSK Indicators (Visual only, aligned with keys) */}

                            {/* Line Content */}
                            <div className="flex justify-between items-end leading-none">
                                {/* Left Side */}
                                <div className="flex flex-col items-start gap-0.5 min-w-[30%]">
                                    {line.labelLeft && (
                                        <span className="text-[10px] text-white/90 scale-x-90 origin-left">{line.labelLeft}</span>
                                    )}
                                    <span
                                        className={`text-lg font-bold scale-y-110 scale-x-95 origin-left tracking-tighter ${line.colorLeft || MCDUColor.GREEN}`}
                                    >
                                        {line.dataLeft || (line.labelLeft ? '[]' : '')}
                                    </span>
                                </div>

                                {/* Center */}
                                {line.center && (
                                    <div className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center whitespace-nowrap ${line.colorCenter || MCDUColor.WHITE}`}>
                                        <span className="font-bold">{line.center}</span>
                                    </div>
                                )}

                                {/* Right Side */}
                                <div className="flex flex-col items-end gap-0.5 min-w-[30%]">
                                    {line.labelRight && (
                                        <span className="text-[10px] text-white/90 scale-x-90 origin-right">{line.labelRight}</span>
                                    )}
                                    <span
                                        className={`text-lg font-bold scale-y-110 scale-x-95 origin-right tracking-tighter ${line.colorRight || MCDUColor.GREEN}`}
                                    >
                                        {line.dataRight || (line.labelRight ? '[]' : '')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Scratchpad Line */}
                <div className="h-8 border-t border-white/20 flex items-center mt-1 px-1">
                    <span className={`font-bold text-lg tracking-widest ${scratchpadMessage ? 'text-amber-500' : 'text-white'}`}>
                        {scratchpadMessage || scratchpad || ""}
                        {!scratchpadMessage && <span className="animate-pulse">_</span>}
                    </span>
                </div>

            </div>
        </div>
    );
};

export default MCDUScreen;
