import React, { createContext, useContext, useState, useEffect } from 'react';
import { ACHIEVEMENTS, Achievement, UserRank, LEVEL_THRESHOLDS } from '../data/achievements';

interface GamificationState {
    xp: number;
    rank: UserRank;
    unlockedAchievements: string[];
    addXp: (amount: number) => void;
    unlockAchievement: (id: string) => void;
    recentUnlocks: Achievement[]; // For toast notifications
    clearRecentUnlocks: () => void;
    progressToNextLevel: number; // 0-100 percentage
}

const GamificationContext = createContext<GamificationState | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Load from localStorage or default
    const [xp, setXp] = useState<number>(() => {
        const saved = localStorage.getItem('atpl_xp');
        return saved ? parseInt(saved, 10) : 0;
    });

    const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(() => {
        const saved = localStorage.getItem('atpl_achievements');
        return saved ? JSON.parse(saved) : [];
    });

    const [recentUnlocks, setRecentUnlocks] = useState<Achievement[]>([]);

    useEffect(() => {
        localStorage.setItem('atpl_xp', xp.toString());
    }, [xp]);

    useEffect(() => {
        localStorage.setItem('atpl_achievements', JSON.stringify(unlockedAchievements));
    }, [unlockedAchievements]);

    // Calculate Rank based on XP
    const getRank = (currentXp: number): UserRank => {
        if (currentXp >= LEVEL_THRESHOLDS[UserRank.ATPL]) return UserRank.ATPL;
        if (currentXp >= LEVEL_THRESHOLDS[UserRank.CPL]) return UserRank.CPL;
        if (currentXp >= LEVEL_THRESHOLDS[UserRank.PPL]) return UserRank.PPL;
        return UserRank.STUDENT;
    };

    const rank = getRank(xp);

    // Calculate Progress to next level
    const getProgressToNextLevel = () => {
        let currentThreshold = 0;
        let nextThreshold = 1000;

        if (rank === UserRank.STUDENT) {
            currentThreshold = LEVEL_THRESHOLDS[UserRank.STUDENT];
            nextThreshold = LEVEL_THRESHOLDS[UserRank.PPL];
        } else if (rank === UserRank.PPL) {
            currentThreshold = LEVEL_THRESHOLDS[UserRank.PPL];
            nextThreshold = LEVEL_THRESHOLDS[UserRank.CPL];
        } else if (rank === UserRank.CPL) {
            currentThreshold = LEVEL_THRESHOLDS[UserRank.CPL];
            nextThreshold = LEVEL_THRESHOLDS[UserRank.ATPL];
        } else {
            return 100; // Max level
        }

        const range = nextThreshold - currentThreshold;
        const progress = xp - currentThreshold;
        return Math.min(100, Math.max(0, (progress / range) * 100));
    };

    const addXp = (amount: number) => {
        setXp(prev => prev + amount);
    };

    const unlockAchievement = (id: string) => {
        if (!unlockedAchievements.includes(id)) {
            const achievement = ACHIEVEMENTS.find(a => a.id === id);
            if (achievement) {
                setUnlockedAchievements(prev => [...prev, id]);
                addXp(achievement.xpReward);
                setRecentUnlocks(prev => [...prev, achievement]);
            }
        }
    };

    const clearRecentUnlocks = () => {
        setRecentUnlocks([]);
    };

    return (
        <GamificationContext.Provider value={{
            xp,
            rank,
            unlockedAchievements,
            addXp,
            unlockAchievement,
            recentUnlocks,
            clearRecentUnlocks,
            progressToNextLevel: getProgressToNextLevel()
        }}>
            {children}
        </GamificationContext.Provider>
    );
};

export const useGamification = () => {
    const context = useContext(GamificationContext);
    if (!context) {
        throw new Error('useGamification must be used within a GamificationProvider');
    }
    return context;
};
