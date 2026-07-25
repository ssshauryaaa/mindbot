/**
 * gemini.js
 * Gemini AI service using the official @google/genai SDK.
 * Provides real AI responses with multi-turn conversation context.
 */

import { GoogleGenAI } from '@google/genai';
import { generateSmartResponse } from './fallback.js';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const SYSTEM_INSTRUCTION = `You are Synaptica, a sharp and empathetic AI stream & career counselor.

You help Indian students think through academic stream choices (Science PCM, Science PCB, Commerce, Humanities/Arts, Law, Design) and career paths (Engineering, Medical, NDA/Defence, Business, Design, Civil Services, etc.).

Always read the full conversation history. If a user asks a follow-up like "what about humanities?" or "what should I do after that", reference what they've already shared.

Respond ONLY with a raw JSON object (no markdown, no extra text). Exact shape:
{
  "text": "<Direct, natural answer in 2-4 sentences. Use their actual interests/situation. If the question is too vague, ask ONE specific clarifying question instead of giving generic advice.>",
  "aiReasoning": "<1-2 sentence factual rationale based on the student's specific situation — subject strengths, exam eligibility, career outcomes, or demand data. Never mention AI internals.>",
  "humanInsight": "<1-2 sentence honest human perspective — a real tradeoff, an observation, or a reflective question tailored to them. Not a generic disclaimer.>"
}

Absolute rules:
- Never mention vectors, confidence scores, pattern engines, checksums, or anything about your own architecture.
- Do not give vague, non-committal answers. Be direct and specific.
- Write like a real counselor talking to a student, not a formal report.
- If you don't know something specific about the student, ask for it. Don't fake confidence.`;

/**
 * Synthesizes a real AI response using Gemini 2.0 Flash.
 *
 * @param {string} userPrompt - The user's message
 * @param {Array} history - Prior conversation messages [{sender, text}]
 * @returns {Promise<{ text: string, aiReasoning: string, humanInsight: string }>}
 */
export async function getSynthesizedResponse(userPrompt, history = []) {
  if (!API_KEY || API_KEY.length < 8) {
    console.warn('[MindBot] No API key found, using fallback');
    return generateSmartResponse(userPrompt, history);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    // Build multi-turn history (last 8 messages for context)
    const contents = history
      .slice(-8)
      .filter(msg => typeof msg.text === 'string' && msg.text.trim().length > 0)
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: userPrompt }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.75,
        responseMimeType: 'application/json',
      },
      contents,
    });

    const rawText = response.text;
    if (!rawText) throw new Error('Empty response from Gemini');

    // Strip markdown fences if present
    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/, '')
      .trim();

    const result = JSON.parse(cleaned);

    if (!result.text || !result.aiReasoning || !result.humanInsight) {
      throw new Error('Incomplete JSON from Gemini: ' + JSON.stringify(result));
    }

    console.info('[MindBot] ✓ Real Gemini response received');
    return result;
  } catch (err) {
    console.warn('[MindBot] Gemini failed, using smart fallback:', err.message);
    return generateSmartResponse(userPrompt, history);
  }
}

/**
 * AI Lens — Intake helper
 */
export async function getAILens(answers) {
  return generateSmartResponse(answers.join(' '));
}

/**
 * Human Lens — Intake helper
 */
export async function getHumanLens(answers, aiLensResult) {
  return {
    question: "What part of this recommendation feels most natural to you?"
  };
}
