import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../lib/firebase";
import { QuizQuestion } from "../types";

const functions = getFunctions(app);

const generateQuizQuestionCallable = httpsCallable<{topic: string}, any>(functions, 'generateQuizQuestion');
const generateRoleplayResponseCallable = httpsCallable<{history: any[], lastMessage: string}, {text: string}>(functions, 'generateRoleplayResponse');
const explainWeatherCallable = httpsCallable<{rawCode: string}, any>(functions, 'explainWeather');

export const generateQuizQuestion = async (topic: string): Promise<QuizQuestion | null> => {
  try {
    const result = await generateQuizQuestionCallable({ topic });
    return result.data as QuizQuestion;
  } catch (error) {
    console.error("Error generating quiz:", error);
    return null;
  }
};

export const generateRoleplayResponse = async (history: { role: 'user' | 'model', text: string }[], lastMessage: string) => {
  try {
    const result = await generateRoleplayResponseCallable({ history, lastMessage });
    return result.data.text || "Station calling, say again due to interference.";
  } catch (e) {
    console.error("Error generating roleplay:", e);
    return "Radio failure. (API Error)";
  }
};

export const explainWeather = async (rawCode: string): Promise<any | null> => {
  try {
    const result = await explainWeatherCallable({ rawCode });
    return result.data;
  } catch (error) {
    console.error("Error decoding weather:", error);
    return null;
  }
};
