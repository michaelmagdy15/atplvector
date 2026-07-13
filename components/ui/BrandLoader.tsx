import React from 'react';

interface Props {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    text?: string;
}

const BrandLoader: React.FC<Props> = ({ size = 'md', className = '', text }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-16 h-16',
        lg: 'w-24 h-24',
        xl: 'w-32 h-32',
    };

    return (
        <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
            <div className={`relative ${sizeClasses[size]} group`}>
                {/* Background Glow */}
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse group-hover:bg-blue-400/30 transition-colors"></div>

                {/* Logo with Animation */}
                <div className="relative z-10 w-full h-full">
                    <img
                        src="/logo.png"
                        alt="Loading..."
                        className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-logo-float scale-[3.5]"
                    />
                </div>

                {/* Spinning Ring */}
                <div className="absolute inset-[-8px] rounded-full border-2 border-transparent border-t-blue-500/40 border-r-blue-500/10 animate-spin transition-all duration-1000"></div>
            </div>

            {text && (
                <p className="mt-6 text-slate-400 text-sm font-medium tracking-widest uppercase animate-pulse">
                    {text}
                </p>
            )}

            <style>{`
                @keyframes logo-float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(5deg); }
                }
                .animate-logo-float {
                    animation: logo-float 2.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default BrandLoader;
