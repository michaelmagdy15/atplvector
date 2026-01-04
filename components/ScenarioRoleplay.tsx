import React, { useState, useRef, useEffect } from 'react';
import { generateRoleplayResponse } from '../services/gemini';
import { ChatMessage } from '../types';
import { Send, User, Radio, Mic } from 'lucide-react';

const ScenarioRoleplay: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Tower this is Fastair 345, ready for radio check, 118.1.' },
    { id: '2', role: 'user', text: 'Fastair 345, Tower, reading you five.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const apiHistory = messages.map(m => ({ role: m.role, text: m.text }));
    const responseText = await generateRoleplayResponse(apiHistory, input);

    const modelMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
    setMessages(prev => [...prev, modelMsg]);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[600px] flex flex-col bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
      {/* Header */}
      <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-500/20 rounded-full">
                <Radio className="w-5 h-5 text-sky-400" />
            </div>
            <div>
                <h3 className="text-slate-100 font-semibold">Simulated Frequency: 118.100</h3>
                <p className="text-slate-400 text-xs">AI ATC - Practice your phraseology</p>
            </div>
        </div>
        <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-mono animate-pulse">
            LIVE
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900 scrollbar-thin scrollbar-thumb-slate-700">
        {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-sky-600 ml-3' : 'bg-slate-700 mr-3'}`}>
                        {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Radio className="w-4 h-4 text-white" />}
                    </div>
                    <div className={`p-4 rounded-2xl font-mono text-sm ${msg.role === 'user' ? 'bg-sky-600/20 text-sky-100 border border-sky-500/30' : 'bg-slate-800 text-slate-200 border border-slate-700'}`}>
                        {msg.text}
                    </div>
                </div>
            </div>
        ))}
        {loading && (
            <div className="flex justify-start">
                 <div className="flex items-center space-x-2 text-slate-500 bg-slate-800/50 px-4 py-2 rounded-full text-xs font-mono">
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                 </div>
            </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <div className="relative">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type transmission here (e.g. 'Tower, request taxi...')"
                className="w-full bg-slate-900 text-slate-100 pl-10 pr-12 py-3 rounded-lg border border-slate-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-500 font-mono"
            />
            <Mic className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
            <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="absolute right-2 top-2 p-1.5 bg-sky-600 text-white rounded hover:bg-sky-500 disabled:opacity-50 disabled:hover:bg-sky-600 transition"
            >
                <Send className="w-4 h-4" />
            </button>
        </div>
        <p className="text-center text-xs text-slate-500 mt-2">
            Use standard ICAO phraseology. Your callsign is <span className="text-slate-400 font-bold">FASTAIR 345</span>.
        </p>
      </div>
    </div>
  );
};

export default ScenarioRoleplay;
