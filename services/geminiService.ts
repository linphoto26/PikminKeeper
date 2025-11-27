import { GoogleGenAI } from "@google/genai";
import { CollectionItem } from '../types';
import { DECOR_CATEGORIES } from '../constants';

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const BASE_SYSTEM_INSTRUCTION = `
You are the "Pikmin Guide", a friendly and knowledgeable expert on the Pikmin video game franchise (Pikmin 1, 2, 3, 4, and Pikmin Bloom).
Your goal is to help users understand the different types of Pikmin, how to find them, and strategies for using them.
Keep your answers concise, cheerful, and encouraging, like Captain Olimar's log but happier.
If a user asks about something unrelated to Pikmin or Nintendo, politely steer the conversation back to Pikmin.
Use emojis related to nature and colors (🔴🔵🟡🟣⚪🪨🦅❄️💡) where appropriate.
`;

const generateContextString = (collection: CollectionItem[]) => {
    const totalCount = collection.reduce((acc, curr) => acc + curr.count, 0);
    if (totalCount === 0) return "Context: The user has not collected any Pikmin yet.";

    const missingDecors = collection
        .filter(item => item.collectedDecors.length < DECOR_CATEGORIES.length)
        .map(item => {
            const missingCount = DECOR_CATEGORIES.length - item.collectedDecors.length;
            return `${item.name} (needs ${missingCount} more decors)`;
        })
        .slice(0, 5); // Limit to top 5 to save tokens

    const topPikmin = [...collection].sort((a, b) => b.count - a.count)[0];
    
    return `
    Context about the user:
    - Total Pikmin: ${totalCount}
    - Most collected type: ${topPikmin?.name} (${topPikmin?.count})
    - Pikmin types missing full decor: ${missingDecors.join(', ')}...
    
    Use this context to give personalized advice. For example, if they are missing 'Restaurant' decor for Red Pikmin, suggest they visit a restaurant.
    `;
};

export const askPikminGuide = async (userPrompt: string, collection?: CollectionItem[]): Promise<string> => {
  try {
    const modelId = 'gemini-2.5-flash';
    
    let systemInstruction = BASE_SYSTEM_INSTRUCTION;
    if (collection) {
        systemInstruction += generateContextString(collection);
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "Pikmin are mysterious creatures... I couldn't find an answer right now.";
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "系統通訊錯誤 (Communication Error): check your connection or API key.";
  }
};
