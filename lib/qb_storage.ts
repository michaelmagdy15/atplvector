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
                scoreHistory: []
            };
        }
        return JSON.parse(data);
    },

    updateStats: (newResult: { score: number, type: 'study' | 'exam', seenCount: number }) => {
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

        // Keep only last 50 for performance
        if (stats.scoreHistory.length > 50) {
            stats.scoreHistory.shift();
        }

        localStorage.setItem(QB_STATS_KEY, JSON.stringify(stats));
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
