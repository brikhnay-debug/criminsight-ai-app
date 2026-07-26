import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  type GenerativeModel,
} from '@google/generative-ai';

let client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY is not set. Add it to your .env.local file (see .env.example).'
      );
    }
    client = new GoogleGenerativeAI(apiKey);
  }
  return client;
}

// Configurable via env so the model can be upgraded without a code change.
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

/**
 * Returns a Gemini model instance configured with the given system
 * instruction and standard safety thresholds. Called fresh per-request
 * so each feature (chat, summarizer, quiz generator, etc.) can supply
 * its own system prompt.
 */
export function getGeminiModel(systemInstruction: string): GenerativeModel {
  return getClient().getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
  });
}
