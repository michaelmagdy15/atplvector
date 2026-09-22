import { FAAQuestion, FAATestMode } from '../types';

const questionsCache: Partial<Record<FAATestMode, FAAQuestion[]>> = {};

export const getFAAQuestions = async (mode: FAATestMode): Promise<FAAQuestion[]> => {
    if (questionsCache[mode]) {
        return questionsCache[mode]!;
    }

    try {
        const response = await fetch(`/question-bank/faa/${mode}_questions.json`);
        if (!response.ok) {
            throw new Error(`Failed to load FAA questions for ${mode}`);
        }
        const raw: any[] = await response.json();
        const mapped: FAAQuestion[] = raw.map((q) => ({
            id: q.id.startsWith(mode) ? q.id : `${mode}-${q.id}`,
            plt: q.plt || '',
            text: q.text,
            options: q.options,
            correct: q.correct,
            explanation: q.explanation,
            category: q.category,
            figureRef: q.figureRef,
        }));
        questionsCache[mode] = mapped;
        return mapped;
    } catch (err) {
        console.error("Error fetching FAA questions:", err);
        return [];
    }
};

export const getCachedFAAQuestions = (mode: FAATestMode): FAAQuestion[] => {
    return questionsCache[mode] || [];
};
