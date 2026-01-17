import React from 'react';
import { Lock, ArrowLeft } from 'lucide-react';

interface Props {
    onBack: () => void;
}

const Privacy: React.FC<Props> = ({ onBack }) => {
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
                        <div className="p-3 bg-emerald-500/20 rounded-xl">
                            <Lock className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                        <h3>1. Data Collection</h3>
                        <p>
                            We collect information necessary to provide our service, including:
                        </p>
                        <ul>
                            <li>Account information (Email, Name)</li>
                            <li>Usage data (Progress, Quiz Scores, Study Time)</li>
                            <li>Payment information (processed securely via third-party providers)</li>
                        </ul>

                        <h3>2. How We Use Your Data</h3>
                        <p>
                            Your data is used solely to:
                            <ul>
                                <li>Provide and improve the educational platform</li>
                                <li>Track your learning progress</li>
                                <li>Process subscriptions</li>
                                <li>Communicate important updates</li>
                            </ul>
                        </p>

                        <h3>3. Data Protection</h3>
                        <p>
                            We implement industry-standard security measures to protect your data.
                            We do not sell your personal data to advertisers or third parties.
                        </p>

                        <h3>4. Cookies</h3>
                        <p>
                            We use essential cookies to maintain your login session and preferences.
                            Analytics cookies help us understand how the platform is used but can be opted out of.
                        </p>

                        <h3>5. Contact Us</h3>
                        <p>
                            For any privacy-related inquiries, please contact our Data Protection Officer at privacy@atplvector.com.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
