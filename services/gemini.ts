import { GoogleGenAI } from "@google/genai";
import { AnalysisMode } from "../types";

// NOTE: In a production environment, this logic should ideally reside in a 
// Firebase Cloud Function to protect your API_KEY. For this demo, we run it client-side.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstruction = (mode: AnalysisMode): string => {
  switch (mode) {
    case AnalysisMode.EXPLAIN:
      return "You are an expert software engineer. Explain the following code clearly and concisely. Break down complex logic into simple steps. Focus on the 'why' and 'how'.";
    case AnalysisMode.FIND_BUGS:
      return "You are a senior QA engineer and security expert. Analyze the code for bugs, security vulnerabilities, edge cases, and logic errors. List each issue found and suggest a fix.";
    case AnalysisMode.IMPROVE:
      return "You are a world-class software architect. Review the code for readability, performance, clean code principles (DRY, SOLID), and modern best practices. Provide the refactored, improved code. IMPORTANT: Wrap the full improved code in a single markdown code block (```language ... ```) so it can be programmatically extracted.";
    default:
      return "You are a helpful coding assistant.";
  }
};

export const analyzeCode = async (code: string, mode: AnalysisMode): Promise<string> => {
  if (!code.trim()) return "";

  // Select model based on complexity.
  // 'gemini-2.5-flash' is great for fast explanations and standard bugs.
  // 'gemini-3-pro-preview' is better for deep architectural improvements.
  const modelName = mode === AnalysisMode.IMPROVE ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Please perform a "${mode}" analysis on this code:\n\n\`\`\`\n${code}\n\`\`\``,
      config: {
        systemInstruction: getSystemInstruction(mode),
        temperature: 0.3, // Lower temperature for more deterministic/technical code answers
      }
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error analyzing code. Please check your API key and try again.";
  }
};