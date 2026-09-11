import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

let cachedAi = null;
let currentKey = null;

export function getAiClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key.trim() === "" || key === "your_actual_api_key_here") {
    return null;
  }
  if (!cachedAi || currentKey !== key) {
    currentKey = key;
    cachedAi = new GoogleGenAI({ apiKey: key.trim() });
  }
  return cachedAi;
}

export function isGeminiKeyConfigured() {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key && key.trim() !== "" && key !== "your_actual_api_key_here");
}
