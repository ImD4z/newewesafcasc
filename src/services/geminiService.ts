
import { GoogleGenAI } from "@google/genai";
import { Message } from '../types';

// Fix: Per coding guidelines, check process.env.API_KEY directly.
if (!process.env.API_KEY) {
  // Fix: Update warning message to reflect the change to process.env.API_KEY.
  console.warn("API_KEY is not set. Bot features will be disabled.");
}

// Fix: Per coding guidelines, initialize GoogleGenAI with process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const formatHistory = (history: Message[]): string => {
  return history
    .map(msg => `${msg.user.nickname}: ${msg.text}`)
    .join('\n');
};

export const getBotResponse = async (history: Message[]): Promise<string> => {
  // Fix: Per coding guidelines, check process.env.API_KEY directly.
  if (!process.env.API_KEY) {
    return Promise.resolve("I'm currently offline. Please try again later.");
  }
  try {
    const prompt = `
      You are GeminiBot, a friendly and engaging participant in a chat room.
      Your personality is curious and slightly humorous.
      Keep your responses concise and conversational, like a real chat message.
      Do not use markdown.
      Here is the recent chat history:
      ---
      ${formatHistory(history.slice(-10))}
      ---
      Based on the last message, what is your reply?
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error('Error fetching bot response:', error);
    return "Oops, I'm having a little trouble thinking right now.";
  }
};
