import React from 'react';

const Placeholder: React.FC<{ title: string }> = ({ title }) => (
    <div className="bg-slate-800 rounded-xl p-12 shadow-xl border border-slate-700 mt-8 font-sans flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
        <div className="w-16 h-1 bg-blue-500 rounded-full mb-6"></div>
        <p className="text-slate-400 text-lg max-w-md text-center">
            This advanced interactive simulation is currently under development. Check back soon for updates!
        </p>
    </div>
);

export default Placeholder;
