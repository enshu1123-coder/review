import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

export function getGemini(): GoogleGenAI {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY 환경변수가 없습니다.");
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

export const MODEL = "gemini-2.5-flash";
