"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.explainWeather = exports.generateRoleplayResponse = exports.generateQuizQuestion = void 0;
const https_1 = require("firebase-functions/v2/https");
const genai_1 = require("@google/genai");
// Read API key from environment (set via Firebase Secrets or env variables)
const apiKey = process.env.GEMINI_API_KEY;
exports.generateQuizQuestion = (0, https_1.onCall)(async (request) => {
    const { topic } = request.data;
    if (!topic || typeof topic !== "string") {
        throw new https_1.HttpsError("invalid-argument", "The function must be called with a string 'topic'.");
    }
    if (!apiKey) {
        throw new https_1.HttpsError("internal", "API Key missing in backend.");
    }
    const ai = new genai_1.GoogleGenAI({ apiKey });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a multiple choice question about aviation communications specifically related to: ${topic}. 
      Ensure it is relevant to the ATPL syllabus (ICAO standards).
      Return JSON.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: genai_1.Type.OBJECT,
                    properties: {
                        question: { type: genai_1.Type.STRING },
                        options: {
                            type: genai_1.Type.ARRAY,
                            items: { type: genai_1.Type.STRING }
                        },
                        correctAnswer: { type: genai_1.Type.INTEGER, description: "Index of the correct answer (0-3)" },
                        explanation: { type: genai_1.Type.STRING }
                    },
                    required: ["question", "options", "correctAnswer", "explanation"]
                }
            }
        });
        if (response.text) {
            return JSON.parse(response.text);
        }
        throw new https_1.HttpsError("internal", "No text in response.");
    }
    catch (error) {
        console.error("Error generating quiz:", error);
        throw new https_1.HttpsError("internal", "Failed to generate quiz question.");
    }
});
exports.generateRoleplayResponse = (0, https_1.onCall)(async (request) => {
    const { history, lastMessage } = request.data;
    if (!history || !lastMessage) {
        throw new https_1.HttpsError("invalid-argument", "Missing history or lastMessage.");
    }
    if (!apiKey) {
        throw new https_1.HttpsError("internal", "API Key missing in backend.");
    }
    const ai = new genai_1.GoogleGenAI({ apiKey });
    const contents = history.map((h) => ({
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
    }
    catch (e) {
        console.error("Error generating roleplay:", e);
        throw new https_1.HttpsError("internal", "Radio failure. (API Error)");
    }
});
exports.explainWeather = (0, https_1.onCall)(async (request) => {
    const { rawCode } = request.data;
    if (!rawCode) {
        throw new https_1.HttpsError("invalid-argument", "Missing rawCode.");
    }
    if (!apiKey) {
        throw new https_1.HttpsError("internal", "API Key missing in backend.");
    }
    const ai = new genai_1.GoogleGenAI({ apiKey });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze this aviation weather report (METAR or TAF). Break it down into clear, readable sections. 
      Raw: ${rawCode}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: genai_1.Type.OBJECT,
                    properties: {
                        type: { type: genai_1.Type.STRING, description: "METAR or TAF" },
                        airport: { type: genai_1.Type.STRING, description: "Airport ICAO and Name" },
                        time: { type: genai_1.Type.STRING, description: "Day and Time in UTC" },
                        wind: { type: genai_1.Type.STRING, description: "Wind direction, speed and units" },
                        visibility: { type: genai_1.Type.STRING, description: "Visibility conditions" },
                        conditions: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING }, description: "Weather phenomena (Rain, Snow, etc)" },
                        clouds: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING }, description: "Cloud layers" },
                        temp: { type: genai_1.Type.STRING, description: "Temperature and Dewpoint (if applicable)" },
                        pressure: { type: genai_1.Type.STRING, description: "QNH or Altimeter (if applicable)" },
                        trend: { type: genai_1.Type.STRING, description: "Trend forecast (NOSIG, BECMG, TEMPO) or N/A" }
                    },
                    required: ["type", "airport", "time", "wind", "visibility"]
                }
            }
        });
        if (response.text) {
            return JSON.parse(response.text);
        }
        throw new https_1.HttpsError("internal", "No text in response.");
    }
    catch (error) {
        console.error("Error decoding weather:", error);
        throw new https_1.HttpsError("internal", "Failed to decode weather.");
    }
});
//# sourceMappingURL=index.js.map