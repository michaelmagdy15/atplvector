import React from 'react';
import { motion } from 'framer-motion';

interface LessonCardProps {
    title: string;
    description: string;
    examTip: string;
    tags: string[];
    colorTheme: 'red' | 'blue' | 'purple'; // warm, cold, occluded
}

const LessonCard: React.FC<LessonCardProps> = ({ title, description, examTip, tags, colorTheme }) => {
    const theme = {
        red: {
            bg: 'bg-red-500/10',
            border: 'border-red-500/20',
            headerBg: 'bg-gradient-to-r from-red-500/80 to-red-600/80',
            examBg: 'bg-amber-400',
            examText: 'text-amber-900',
            tagBg: 'bg-red-500',
            tagText: 'text-white'
        },
        blue: {
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
            headerBg: 'bg-gradient-to-r from-blue-500/80 to-blue-600/80',
            examBg: 'bg-amber-400',
            examText: 'text-amber-900',
            tagBg: 'bg-blue-500',
            tagText: 'text-white'
        },
        purple: {
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20',
            headerBg: 'bg-gradient-to-r from-purple-500/80 to-purple-600/80',
            examBg: 'bg-amber-400',
            examText: 'text-amber-900',
            tagBg: 'bg-purple-500',
            tagText: 'text-white'
        }
    }[colorTheme];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-3xl overflow-hidden border ${theme.border} backdrop-blur-sm bg-slate-900/50 shadow-xl`}
        >
            {/* Header Area */}
            <div className={`p-6 pb-8 ${theme.bg}`}>
                <h3 className={`text-3xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70`}>
                    {title}
                </h3>
                <p className="text-slate-300 text-lg leading-relaxed font-medium">
                    {description}
                </p>
            </div>

            {/* Exam Tip Strip */}
            <div className={`${theme.examBg} p-3 px-6 flex items-center justify-center shadow-lg relative z-10 mx-4 -mt-5 rounded-xl`}>
                <span className={`text-sm font-bold uppercase tracking-wide ${theme.examText}`}>
                    {examTip}
                </span>
            </div>

            {/* Tags Section */}
            <div className="p-6 pt-8">
                <h4 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">Produces</h4>
                <div className="flex flex-wrap gap-3">
                    {tags.map((tag, i) => (
                        <span key={i} className={`px-4 py-2 ${theme.tagBg} ${theme.tagText} rounded-full text-sm font-bold shadow-lg`}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default LessonCard;
