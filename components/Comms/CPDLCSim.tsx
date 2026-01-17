import React, { useState } from 'react';
import { Wifi, Send, ArrowUp, CheckCircle, XCircle } from 'lucide-react';

type Message = {
    id: string;
    from: 'ATC' | 'PILOT';
    text: string;
    time: string;
    responses?: string[];
    isLog?: boolean;
};

const CPDLCSim: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', from: 'ATC', text: 'LOGON ACCEPTED. NEXT DATA AUTHORITY: EGLL', time: '10:02', isLog: true },
        { id: '2', from: 'PILOT', text: 'REQUEST CLIMB FL360', time: '10:05' },
    ]);
    const [pendingResponse, setPendingResponse] = useState<string | null>(null);

    const addPilotMsg = (text: string) => {
        const newMsg: Message = {
            id: Date.now().toString(),
            from: 'PILOT',
            text: text,
            time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newMsg]);

        // Sim ATC response
        setTimeout(() => {
            const atcMsg: Message = {
                id: (Date.now() + 1).toString(),
                from: 'ATC',
                text: 'STANDBY',
                time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, atcMsg]);

            setTimeout(() => {
                const approval: Message = {
                    id: (Date.now() + 2).toString(),
                    from: 'ATC',
                    text: 'CLIMB TO AND MAINTAIN FL360',
                    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
                    responses: ['WILCO', 'UNABLE', 'STANDBY']
                };
                setMessages(prev => [...prev, approval]);
                setPendingResponse(approval.id);
            }, 2000);
        }, 1500);
    };

    const handleResponse = (res: string) => {
        const newMsg: Message = {
            id: Date.now().toString(),
            from: 'PILOT',
            text: res,
            time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newMsg]);
        setPendingResponse(null);
    };

    return (
        <div className="max-w-md mx-auto bg-slate-900 border-4 border-slate-700 rounded-xl overflow-hidden shadow-2xl font-mono relative">
            {/* DCDU Bezel */}
            <div className="bg-slate-800 p-2 flex justify-between items-center border-b border-slate-700">
                <div className="flex items-center gap-2 text-green-500 font-bold text-xs">
                    <Wifi size={14} /> ACARS/CPDLC
                </div>
                <div className="text-slate-500 text-xs font-bold">ACT CTR: EGLL</div>
            </div>

            {/* Screen */}
            <div className="h-[400px] bg-black p-4 overflow-y-auto flex flex-col gap-3">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex flex-col ${msg.from === 'PILOT' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[85%] p-2 rounded border ${msg.from === 'ATC'
                                ? 'bg-slate-900 border-green-500/50 text-green-400'
                                : 'bg-slate-900 border-cyan-500/50 text-cyan-400'
                            }`}>
                            <div className="text-[10px] opacity-70 mb-1 flex justify-between gap-4">
                                <span>{msg.from}</span>
                                <span>{msg.time}</span>
                            </div>
                            <div className="font-bold text-sm tracking-widest">{msg.text}</div>
                        </div>

                        {/* Response options if this is the active ATC command */}
                        {msg.responses && pendingResponse === msg.id && (
                            <div className="flex gap-2 mt-2 w-full">
                                {msg.responses.map(res => (
                                    <button
                                        key={res}
                                        onClick={() => handleResponse(res)}
                                        className="flex-1 py-1 bg-slate-800 border-b-2 border-slate-600 text-green-500 hover:bg-slate-700 hover:text-white text-xs font-bold transition-colors"
                                    >
                                        [{res}]
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-800 border-t border-slate-700 grid grid-cols-2 gap-2">
                <button
                    onClick={() => addPilotMsg('REQUEST CLIMB FL380')}
                    disabled={!!pendingResponse}
                    className="p-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded disabled:opacity-30"
                >
                    REQ CLB FL380
                </button>
                <button
                    onClick={() => addPilotMsg('REQUEST DIRECT TO ABBOT')}
                    disabled={!!pendingResponse}
                    className="p-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded disabled:opacity-30"
                >
                    REQ DCT ABBOT
                </button>
                <button
                    onClick={() => addPilotMsg('WHEN CAN WE EXPECT HIGHER?')}
                    disabled={!!pendingResponse}
                    className="col-span-2 p-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded disabled:opacity-30"
                >
                    FREE TEXT MESSAGE
                </button>
            </div>
        </div>
    );
};

export default CPDLCSim;
