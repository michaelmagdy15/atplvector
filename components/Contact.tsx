import React from 'react';
import { Mail, ArrowLeft, MessageSquare, Send } from 'lucide-react';

interface Props {
    onBack: () => void;
}

const Contact: React.FC<Props> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-slate-950 pt-20 pb-12 px-6">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={onBack}
                    className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
                </button>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8">
                        <h1 className="text-3xl font-bold text-white mb-6">Get in touch</h1>
                        <p className="text-slate-400 mb-8">
                            Have questions about the platform, pricing, or spotted a bug?
                            We'd love to hear from you.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-500/20 rounded-xl">
                                    <Mail className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Email Us</h3>
                                    <p className="text-sm text-slate-400 mb-1">For general inquiries and support</p>
                                    <a href="mailto:support@atplvector.com" className="text-blue-400 hover:text-blue-300 font-mono">support@atplvector.com</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-purple-500/20 rounded-xl">
                                    <MessageSquare className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Live Chat</h3>
                                    <p className="text-sm text-slate-400">Available Mon-Fri, 09:00 - 17:00 UTC</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-slate-900 border border-white/10 rounded-2xl p-8">
                        <form className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Name</label>
                                <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none transition-all placeholder-slate-600" placeholder="Your Name" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email</label>
                                <input type="email" className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none transition-all placeholder-slate-600" placeholder="pilot@example.com" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Message</label>
                                <textarea rows={4} className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-blue-500 outline-none transition-all placeholder-slate-600" placeholder="How can we help?" />
                            </div>
                            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                                <Send className="w-4 h-4" /> Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
