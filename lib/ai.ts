import { db, doc } from './firebase';
import { getDoc, setDoc } from 'firebase/firestore';

/**
 * Fetches an explanation for a question.
 * Checks Firestore cache first. If not found, generates a mock explanation.
 */
export async function getExplanation(
    questionId: string, 
    questionText: string, 
    options: string[], 
    correctAnswerIdx: number
): Promise<string> {
    try {
        // 1. Check Firestore cache
        const docRef = doc(db, 'explanations', questionId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().text) {
            console.log(`[AI Cache Hit] Loaded explanation for ${questionId} from Firestore.`);
            return docSnap.data().text;
        }

        console.log(`[AI Generation] Simulating new explanation for ${questionId}...`);
        
        // 2. Simulate AI delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const correctAnswerText = options[correctAnswerIdx];
        
        const explanation = `**Simulated AI Explanation:**\n\nThe correct answer is **${String.fromCharCode(65 + correctAnswerIdx)}: ${correctAnswerText}**.\n\n*Note: The live Gemini API integration has been disabled to save tokens. This is a placeholder explanation for the aerodynamic or regulatory reasoning behind this specific question.*`;

        // 3. Cache the mock result in Firestore so it loads instantly next time
        try {
            await setDoc(docRef, { 
                text: explanation, 
                createdAt: new Date().toISOString() 
            }, { merge: true });
            console.log(`[AI Cache Set] Saved mock explanation for ${questionId} to Firestore.`);
        } catch (dbError) {
            console.error("Failed to save explanation to Firestore:", dbError);
        }

        return explanation;
    } catch (error) {
        console.error("Error generating simulated explanation:", error);
        throw new Error("Failed to generate explanation.");
    }
}
