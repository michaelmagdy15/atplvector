import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';

interface Props {
    onBack: () => void;
}

const Terms: React.FC<Props> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-slate-950 pt-20 pb-12 px-6">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={onBack}
                    className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
                </button>

                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 md:p-12">
                    <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-8">
                        <div className="p-3 bg-blue-500/20 rounded-xl">
                            <Shield className="w-8 h-8 text-blue-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                        <h3>1. Introduction</h3>
                        <p>
                            Welcome to ATPLVector. By accessing our platform, you agree to these Terms of Service.
                            These terms govern your use of our educational software and services.
                        </p>

                        <h3>2. Educational Purpose Only</h3>
                        <p>
                            ATPLVector is a training aid designed to assist with ATPL theoretical knowledge.
                            It is <strong>NOT</strong> a substitute for official flight training materials, aircraft manuals, or regulatory documents.
                            Always defer to your approved training organization (ATO) and official EASA/FAA publications for operational decisions.
                        </p>

                        <h3>3. User Accounts</h3>
                        <p>
                            You are responsible for maintaining the confidentiality of your account credentials.
                            Sharing accounts is strictly prohibited and may result in immediate suspension without refund.
                        </p>

                        <h3>4. Intellectual Property</h3>
                        <p>
                            All content, including 3D models, simulations, code, and text, is owned by ATPLVector.
                            You may not copy, reverse engineer, or redistribute any part of the platform.
                        </p>

                        <h3>5. Subscription & Refunds</h3>
                        <p>
                            Subscriptions are billed in advance. You may cancel at any time to prevent future billing.
                            Refunds are handled on a case-by-case basis within 14 days of purchase if the service was not accessed or used significantly.
                        </p>

                        <h3>6. Liability Limitation</h3>
                        <p>
                            ATPLVector is provided "as is". We make no warranties regarding the accuracy or completeness of the materials.
                            We are not liable for any examination failures or operational incidents.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;
