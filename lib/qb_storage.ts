import { Question, QBStats, SavedTest } from '../types';

const STORAGE_KEYS = {
    STATS: 'atpl_qb_stats',
    SAVED_TESTS: 'atpl_qb_saved_tests',
    USER_INTERACTIONS: 'atpl_qb_interactions', // Map of questionId -> { seen, correct, wrong, flagged, pinned }
};

export interface QuestionInteraction {
    seen: boolean;
    correct: boolean;
    wrong: boolean;
    flagged: boolean;
    pinned: boolean;
    lastAnswered?: string;
}

const DEFAULT_STATS: QBStats = {
    totalAnswered: 0,
    correctCount: 0,
    averageScore: 0,
    testsCompleted: 0,
    attributionCounts: {
        realExam: 0,
        other: 0,
    },
    scoreHistory: [],
};

export const QBStorage = {
    getStats: (): QBStats => {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.STATS);
            if (!raw) return DEFAULT_STATS;
            const parsed = JSON.parse(raw);
            return {
                ...DEFAULT_STATS,
                ...parsed,
                attributionCounts: {
                    realExam: parsed?.attributionCounts?.realExam || 0,
                    other: parsed?.attributionCounts?.other || 0,
                },
                scoreHistory: Array.isArray(parsed?.scoreHistory) ? parsed.scoreHistory : [],
            };
        } catch {
            return DEFAULT_STATS;
        }
    },

    updateStats: (sessionScore: number, totalInSession: number, correctInSession: number) => {
        const stats = QBStorage.getStats();
        stats.totalAnswered += totalInSession;
        stats.correctCount += correctInSession;
        stats.testsCompleted += 1;
        stats.averageScore = Math.round(((stats.averageScore * (stats.testsCompleted - 1)) + sessionScore) / stats.testsCompleted);

        stats.scoreHistory.push({
            date: new Date().toISOString(),
            score: sessionScore,
        });

        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
        return stats;
    },

    getInteractions: (): Record<string, QuestionInteraction> => {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.USER_INTERACTIONS);
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    },

    saveInteraction: (questionId: string, update: Partial<QuestionInteraction>) => {
        const all = QBStorage.getInteractions();
        const current = all[questionId] || {
            seen: false,
            correct: false,
            wrong: false,
            flagged: false,
            pinned: false,
        };

        all[questionId] = { ...current, ...update };
        localStorage.setItem(STORAGE_KEYS.USER_INTERACTIONS, JSON.stringify(all));
    },

    recordVote: (type: 'realExam' | 'other') => {
        const stats = QBStorage.getStats();
        stats.attributionCounts[type] += 1;
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    },

    getSavedTests: (): SavedTest[] => {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.SAVED_TESTS);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            return parsed.filter(Boolean).map((t: any) => ({
                ...t,
                questionIds: Array.isArray(t.questionIds) ? t.questionIds : [],
                userAnswers: t.userAnswers || {},
                flaggedQuestions: Array.isArray(t.flaggedQuestions) ? t.flaggedQuestions : [],
            }));
        } catch {
            return [];
        }
    },

    saveTest: (test: SavedTest) => {
        const all = QBStorage.getSavedTests();
        const index = all.findIndex(t => t.id === test.id);
        if (index >= 0) {
            all[index] = test;
        } else {
            all.unshift(test);
        }
        localStorage.setItem(STORAGE_KEYS.SAVED_TESTS, JSON.stringify(all.slice(0, 20))); // Keep last 20
    },

    deleteTest: (id: string) => {
        const all = QBStorage.getSavedTests().filter(t => t.id !== id);
        localStorage.setItem(STORAGE_KEYS.SAVED_TESTS, JSON.stringify(all));
    }
};
