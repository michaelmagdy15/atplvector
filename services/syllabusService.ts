import { LEARNING_OBJECTIVES, SUBJECTS } from '../data/learningObjectives';
import syllabusData from '../data/syllabus.json';

// Type for the raw syllabus JSON structure (hierarchical)
export interface SyllabusNode {
    code: string;
    title: string;
    children?: SyllabusNode[];
    los?: { id: string; text: string; full_id: string }[];
}

export const getUseSyllabusForSubject = (subjectId: string) => {
    // Determine the root code for the subject (e.g., "010" -> "010 00 00 00")
    // This logic might need adjustment if subject IDs don't perfectly map to leading code chars
    const rootNode = (syllabusData as SyllabusNode[]).find(node => node.code.startsWith(subjectId));
    return rootNode;
};

// Flatten the hierarchy to get all LOs for a subject
export const getAllLOsForSubject = (subjectId: string) => {
    const root = getUseSyllabusForSubject(subjectId);
    if (!root) return [];

    const los: { id: string; text: string; full_id: string }[] = [];

    const traverse = (node: SyllabusNode) => {
        if (node.los) {
            los.push(...node.los);
        }
        if (node.children) {
            node.children.forEach(traverse);
        }
    };

    traverse(root);
    return los;
};
