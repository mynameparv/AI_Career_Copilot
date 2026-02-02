
import { GoogleGenAI, Type } from "@google/genai";

// Use process.env.API_KEY directly in the GoogleGenAI constructor.
// Model name is updated to gemini-3-flash-preview for general text tasks.

export const getGeminiResponse = async (prompt: string, systemInstruction?: string) => {
  // Always initialize a new instance to ensure the latest environment variables are used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: systemInstruction || "You are an expert career coach and project manager. Help users with career growth, technical roadmaps, and job application strategies.",
      temperature: 0.7,
    },
  });
  // The .text property is a getter, not a method.
  return response.text;
};

export const generateProjectRoadmap = async (topic: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Create a detailed project roadmap for: ${topic}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          phases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                duration: { type: Type.STRING }
              }
            }
          }
        },
        required: ["title", "description", "phases"]
      }
    }
  });
  // Safely parse the JSON response from the text property.
  return JSON.parse(response.text || '{}');
};
