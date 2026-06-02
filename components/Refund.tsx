import React from 'react';
import { CreditCard, ArrowLeft } from 'lucide-react';

interface Props {
    onBack: () => void;
}

const Refund: React.FC<Props> = ({ onBack }) => {
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
                        <div className="p-3 bg-amber-500/20 rounded-xl">
                            <CreditCard className="w-8 h-8 text-amber-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">Refund Policy</h1>
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                        <h3>1. Standard 14-Day Refund Window</h3>
                        <p>
                            At ATPL Vector, we want to ensure you are fully satisfied with our visual training suite.
                            We offer a standard <strong>14-day refund window</strong> from the date of purchase.
                        </p>

                        <h3>2. Refund Conditions</h3>
                        <p>
                            To be eligible for a refund, the following criteria must be met:
                        </p>
                        <ul>
                            <li>The request must be made within 14 calendar days of your initial subscription activation.</li>
                            <li>The service must not have been accessed or used significantly (e.g. less than 5 mock exams completed or less than 1 hour of total simulation study time).</li>
                        </ul>

                        <h3>3. Non-refundable Circumstances</h3>
                        <p>
                            Refunds will not be issued in cases of:
                        </p>
                        <ul>
                            <li>Accounts suspended due to breaches of our Terms of Service (such as sharing login credentials).</li>
                            <li>Requests made after the 14-day period has expired.</li>
                        </ul>

                        <h3>4. How to Request a Refund</h3>
                        <p>
                            To request a refund, please send an email to <strong>support@atplvector.com</strong> with your:
                        </p>
                        <ul>
                            <li>Registered email address</li>
                            <li>Clerk User ID / Billing email address</li>
                            <li>Receipt or transaction ID from our payment gateway (Paddle)</li>
                        </ul>
                        <p className="mt-4">
                            Our support team will review your account activity and process all qualifying refunds within 3-5 business days.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Refund;
