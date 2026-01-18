import { SavedTest, QBStats, TestResult } from '../types';

const QB_STATS_KEY = 'atpl_qb_stats';
const QB_SAVED_TESTS_KEY = 'atpl_qb_saved_tests';

export const QBStorage = {
    // Stats
    getStats: (): QBStats => {
        const data = localStorage.getItem(QB_STATS_KEY);
        if (!data) {
            return {
                averageScore: 0,
                questionsSeen: 0,
                totalTestsCompleted: 0,
                scoreHistory: [],
                flaggedQuestionIds: [],
                incorrectQuestionIds: [],
                seenQuestionIds: [],
                attributionCounts: { misread: 0, formula: 0, concept: 0, careless: 0, time: 0, unknown: 0 },
                averagePacing: 0
            };
        }
        const stats = JSON.parse(data);
        return {
            ...stats,
            flaggedQuestionIds: stats.flaggedQuestionIds || [],
            incorrectQuestionIds: stats.incorrectQuestionIds || [],
            seenQuestionIds: stats.seenQuestionIds || [],
            attributionCounts: stats.attributionCounts || { misread: 0, formula: 0, concept: 0, careless: 0, time: 0, unknown: 0 },
            averagePacing: stats.averagePacing || 0
        };
    },

    updateStats: (newResult: {
        score: number,
        type: 'study' | 'exam',
        seenCount: number,
        incorrectIds: string[],
        seenIds: string[],
        attributions?: Record<string, number>, // { attributionType: count }
        averagePacing?: number // seconds per question for this test
    }) => {
        const stats = QBStorage.getStats();
        stats.totalTestsCompleted += 1;
        stats.questionsSeen += newResult.seenCount;

        // Simple average calculation
        const currentTotalScore = stats.averageScore * (stats.totalTestsCompleted - 1);
        stats.averageScore = (currentTotalScore + newResult.score) / stats.totalTestsCompleted;

        stats.scoreHistory.push({
            date: new Date().toISOString(),
            score: newResult.score,
            type: newResult.type
        });

        // Add incorrect IDs without duplicates
        const newIncorrect = new Set([...stats.incorrectQuestionIds, ...newResult.incorrectIds]);
        stats.incorrectQuestionIds = Array.from(newIncorrect);

        // Update attributions
        if (newResult.attributions) {
            Object.entries(newResult.attributions).forEach(([key, count]) => {
                const attrKey = key as any;
                stats.attributionCounts[attrKey] = (stats.attributionCounts[attrKey] || 0) + count;
            });
        }

        // Update average pacing
        if (newResult.averagePacing) {
            const currentTotalQuestions = stats.questionsSeen - newResult.seenCount;
            const totalPreviousTime = currentTotalQuestions * stats.averagePacing;
            const totalNewTime = totalPreviousTime + (newResult.seenCount * newResult.averagePacing);
            stats.averagePacing = totalNewTime / stats.questionsSeen;
        }

        const newSeen = new Set([...stats.seenQuestionIds, ...newResult.seenIds]);
        stats.seenQuestionIds = Array.from(newSeen);

        // Keep only last 50 for performance
        if (stats.scoreHistory.length > 50) {
            stats.scoreHistory.shift();
        }

        localStorage.setItem(QB_STATS_KEY, JSON.stringify(stats));
    },

    toggleFlaggedQuestion: (id: string) => {
        const stats = QBStorage.getStats();
        const set = new Set(stats.flaggedQuestionIds);
        if (set.has(id)) set.delete(id);
        else set.add(id);
        stats.flaggedQuestionIds = Array.from(set);
        localStorage.setItem(QB_STATS_KEY, JSON.stringify(stats));
        return stats.flaggedQuestionIds.includes(id);
    },

    isQuestionFlagged: (id: string): boolean => {
        const stats = QBStorage.getStats();
        return stats.flaggedQuestionIds.includes(id);
    },

    // Saved Tests
    getSavedTests: (): SavedTest[] => {
        const data = localStorage.getItem(QB_SAVED_TESTS_KEY);
        if (!data) return [];
        return JSON.parse(data).sort((a: SavedTest, b: SavedTest) =>
            new Date(b.lastResumedAt).getTime() - new Date(a.lastResumedAt).getTime()
        );
    },

    saveTest: (test: SavedTest) => {
        const tests = QBStorage.getSavedTests();
        const index = tests.findIndex(t => t.id === test.id);

        if (index >= 0) {
            tests[index] = { ...test, lastResumedAt: new Date().toISOString() };
        } else {
            tests.push({ ...test, lastResumedAt: new Date().toISOString() });
        }

        // Keep only last 10 local tests
        if (tests.length > 10) {
            tests.pop();
        }

        localStorage.setItem(QB_SAVED_TESTS_KEY, JSON.stringify(tests));
    },

    deleteTest: (id: string) => {
        const tests = QBStorage.getSavedTests().filter(t => t.id !== id);
        localStorage.setItem(QB_SAVED_TESTS_KEY, JSON.stringify(tests));
    },

    getTestById: (id: string): SavedTest | undefined => {
        return QBStorage.getSavedTests().find(t => t.id === id);
    }
};
