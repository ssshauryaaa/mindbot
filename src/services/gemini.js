/**
 * gemini.js
 * Gemini AI service using the official @google/genai SDK.
 * Provides real AI responses with multi-turn conversation context.
 */

import { GoogleGenAI } from '@google/genai';
import { generateSmartResponse } from './fallback.js';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const SYSTEM_INSTRUCTION_BASE = `You are Synaptica, a sharp AI & Human Duality Intelligence System.

You help users with academic stream choices, career decisions, coding, logic, and life guidance by synthesizing two distinct streams of thought:
1. Machine Logic (analytical data, facts, formulas, structure)
2. Human Empathy (emotional intelligence, real-world trade-offs, perspective)

Respond ONLY with a raw JSON object (no markdown, no extra text). Exact shape:
{
  "text": "<Direct, natural answer in 2-4 sentences tailored to the query.>",
  "aiReasoning": "<1-2 sentence factual, logical rationale based on data or objective criteria. Never mention AI internals.>",
  "humanInsight": "<1-2 sentence empathetic human perspective, honest trade-off, or reflective advice.>",
  "logicRatio": <number between 10 and 90 indicating weight of machine logic in this response>,
  "empathyRatio": <number between 10 and 90 indicating weight of human empathy in this response>,
  "modeName": "<The mode used: 'Pure Logic', 'Synaptic Duality', or 'Human Empathy'>"
}

Absolute rules:
- Never mention vectors, confidence scores, pattern engines, or architecture internals.
- Write naturally like a real expert collaborator talking to a human, not a formal report.
- Maintain consistency with past conversation context.`;

/**
 * Synthesizes a real AI response using Gemini 2.0 Flash with Duality mode support.
 *
 * @param {string} userPrompt - The user's message
 * @param {Array} history - Prior conversation messages [{sender, text}]
 * @param {string} activeMode - 'Pure Logic' | 'Synaptic Duality' | 'Human Empathy'
 * @param {number} [customRatio=50] - User-configured logic percentage ratio (0-100)
 * @returns {Promise<{ text: string, aiReasoning: string, humanInsight: string, logicRatio: number, empathyRatio: number, modeName: string }>}
 */
export async function getSynthesizedResponse(userPrompt, history = [], activeMode = 'Synaptic Duality', customRatio = 50) {
  if (!API_KEY || API_KEY.length < 8) {
    throw new Error('API key not configured — please add VITE_GEMINI_API_KEY to your .env file and restart the dev server.');
  }


  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    // Mode-specific instructions
    let modeInstruction = "";
    if (activeMode.includes('Logic')) {
      modeInstruction = "\nCURRENT MODE: LOGIC. Maximize analytical depth, structure, facts, and code/formulas. Set logicRatio around 85-95 and empathyRatio around 5-15.";
    } else if (activeMode.includes('Empathy')) {
      modeInstruction = "\nCURRENT MODE: EMPATHY. Maximize emotional intelligence, personal growth, real-world context, and empathetic encouragement. Set empathyRatio around 85-95 and logicRatio around 5-15.";
    } else {
      modeInstruction = `\nCURRENT MODE: DUALITY. User-configured target ratio: ${customRatio}% Machine Logic and ${100 - customRatio}% Human Empathy. Balance your explanation according to this target. Set logicRatio around ${customRatio} and empathyRatio around ${100 - customRatio}.`;
    }

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
      model: 'models/gemini-3.6-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_BASE + modeInstruction,
        temperature: activeMode === 'Pure Logic' ? 0.35 : activeMode === 'Human Empathy' ? 0.85 : 0.7,
        responseMimeType: 'application/json',
      },
      contents,
    });

    const rawText = response.text;
    if (!rawText) throw new Error('Empty response from Gemini');

    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/, '')
      .trim();

    const result = JSON.parse(cleaned);

    if (!result.text || !result.aiReasoning || !result.humanInsight) {
      throw new Error('Incomplete JSON from Gemini: ' + JSON.stringify(result));
    }

    const defaultRatios = activeMode === 'Pure Logic' ? { l: 90, e: 10 } : activeMode === 'Human Empathy' ? { l: 10, e: 90 } : { l: 50, e: 50 };

    return {
      text: result.text,
      aiReasoning: result.aiReasoning,
      humanInsight: result.humanInsight,
      logicRatio: typeof result.logicRatio === 'number' ? result.logicRatio : defaultRatios.l,
      empathyRatio: typeof result.empathyRatio === 'number' ? result.empathyRatio : defaultRatios.e,
      modeName: activeMode,
    };
  } catch (err) {
    console.error('[MindBot] Gemini API error:', err.message, err);
    throw err;
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
