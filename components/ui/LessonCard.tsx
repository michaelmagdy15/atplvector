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
            accent: '#f43f5e',
            tagBg: 'bg-rose-500/15 border-rose-500/40 text-rose-200',
        },
        blue: {
            accent: '#38bdf8',
            tagBg: 'bg-sky-500/15 border-sky-500/40 text-sky-200',
        },
        purple: {
            accent: '#a855f7',
            tagBg: 'bg-purple-500/15 border-purple-500/40 text-purple-200',
        }
    }[colorTheme];

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="dx-card overflow-hidden flex flex-col"
            style={{ borderTopWidth: '3px', borderTopColor: theme.accent }}
        >
            {/* Header Area */}
            <div className="p-6 pb-8 bg-bg-raised">
                <div className="hud-label mb-2" style={{ color: theme.accent }}>
                    SYNOPTIC BRIEFING
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold mb-3 text-ink">
                    {title}
                </h3>
                <p className="text-muted text-sm sm:text-base leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Warm Amber Memory Hook / Exam Tip Strip */}
            <div className="border-y border-amber-500/50 bg-amber-500/15 px-6 py-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                    MEMORY HOOK · {examTip}
                </span>
            </div>

            {/* Tags Section */}
            <div className="p-6 bg-bg">
                <h4 className="hud-label text-muted mb-3">Produces</h4>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                        <span key={i} className={`px-3 py-1.5 border text-xs font-mono font-bold ${theme.tagBg}`}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default LessonCard;
