
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

// API key from Vite environment — set VITE_API_KEY in .env
// WARNING: This key is exposed in the client bundle. TODO: Move AI calls to a serverless backend.
const apiKey: string = import.meta.env.VITE_API_KEY || 'AIzaSyDZO0RL-i32tP-iv1HqrAf-nmhWsgyrBXs';
const ai = new GoogleGenAI({ apiKey });

export const generateQuizQuestion = async (topic: string): Promise<QuizQuestion | null> => {
  if (!apiKey) {
    console.error("API Key missing");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a multiple choice question about aviation communications specifically related to: ${topic}. 
      Ensure it is relevant to the ATPL syllabus (ICAO standards).
      Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.INTEGER, description: "Index of the correct answer (0-3)" },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion;
    }
    return null;
  } catch (error) {
    console.error("Error generating quiz:", error);
    return null;
  }
};

export const generateRoleplayResponse = async (history: { role: 'user' | 'model', text: string }[], lastMessage: string) => {
  if (!apiKey) return "API Key missing. Please configure your environment variables.";

  const contents = history.map(h => ({
    role: h.role,
    parts: [{ text: h.text }]
  }));

  // Add new message
  contents.push({ role: 'user', parts: [{ text: lastMessage }] });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: "You are an Air Traffic Controller (ATC). You are strict, professional, and use ICAO standard phraseology. You are simulating a radio environment. Keep responses brief and relevant to aviation. If the user (pilot) makes a mistake, correct them professionally. Use the callsign 'Tower' or 'Approach'. The user is 'Fastair 345'.",
      }
    });
    return response.text || "Station calling, say again due to interference.";
  } catch (e) {
    return "Radio failure. (API Error)";
  }
};

export const explainWeather = async (rawCode: string): Promise<any | null> => {
  if (!apiKey) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this aviation weather report (METAR or TAF). Break it down into clear, readable sections. 
      Raw: ${rawCode}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, description: "METAR or TAF" },
            airport: { type: Type.STRING, description: "Airport ICAO and Name" },
            time: { type: Type.STRING, description: "Day and Time in UTC" },
            wind: { type: Type.STRING, description: "Wind direction, speed and units" },
            visibility: { type: Type.STRING, description: "Visibility conditions" },
            conditions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Weather phenomena (Rain, Snow, etc)" },
            clouds: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Cloud layers" },
            temp: { type: Type.STRING, description: "Temperature and Dewpoint (if applicable)" },
            pressure: { type: Type.STRING, description: "QNH or Altimeter (if applicable)" },
            trend: { type: Type.STRING, description: "Trend forecast (NOSIG, BECMG, TEMPO) or N/A" }
          },
          required: ["type", "airport", "time", "wind", "visibility"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Error decoding weather:", error);
    return null;
  }
};
