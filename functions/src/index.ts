import { onCall, HttpsError } from "firebase-functions/v2/https";
import { GoogleGenAI, Type } from "@google/genai";

// Read API key from environment (set via Firebase Secrets or env variables)
const apiKey = process.env.GEMINI_API_KEY;

export const generateQuizQuestion = onCall(async (request) => {
  const { topic } = request.data;
  if (!topic || typeof topic !== "string") {
    throw new HttpsError("invalid-argument", "The function must be called with a string 'topic'.");
  }
  if (!apiKey) {
    throw new HttpsError("internal", "API Key missing in backend.");
  }

  const ai = new GoogleGenAI({ apiKey });

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
      return JSON.parse(response.text);
    }
    throw new HttpsError("internal", "No text in response.");
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new HttpsError("internal", "Failed to generate quiz question.");
  }
});

export const generateRoleplayResponse = onCall(async (request) => {
  const { history, lastMessage } = request.data;
  if (!history || !lastMessage) {
    throw new HttpsError("invalid-argument", "Missing history or lastMessage.");
  }
  if (!apiKey) {
    throw new HttpsError("internal", "API Key missing in backend.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const contents = history.map((h: any) => ({
    role: h.role,
    parts: [{ text: h.text }]
  }));
  contents.push({ role: 'user', parts: [{ text: lastMessage }] });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: "You are an Air Traffic Controller (ATC). You are strict, professional, and use ICAO standard phraseology. You are simulating a radio environment. Keep responses brief and relevant to aviation. If the user (pilot) makes a mistake, correct them professionally. Use the callsign 'Tower' or 'Approach'. The user is 'Fastair 345'.",
      }
    });
    return { text: response.text || "Station calling, say again due to interference." };
  } catch (e) {
    console.error("Error generating roleplay:", e);
    throw new HttpsError("internal", "Radio failure. (API Error)");
  }
});

export const explainWeather = onCall(async (request) => {
  const { rawCode } = request.data;
  if (!rawCode) {
    throw new HttpsError("invalid-argument", "Missing rawCode.");
  }
  if (!apiKey) {
    throw new HttpsError("internal", "API Key missing in backend.");
  }

  const ai = new GoogleGenAI({ apiKey });

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
    throw new HttpsError("internal", "No text in response.");
  } catch (error) {
    console.error("Error decoding weather:", error);
    throw new HttpsError("internal", "Failed to decode weather.");
  }
});
