/**
 * gemini.js
 * Gemini API wrapper with 5-second timeout + automatic fallback.
 * Never throws to the caller — always returns a valid result shape.
 */

import { fallbackAILens, fallbackHumanLens } from './fallback.js';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = 'gemini-2.0-flash';
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const TIMEOUT_MS = 5000;

/**
 * Core fetch wrapper with timeout and JSON parsing.
 * @param {string} systemInstruction
 * @param {string} userMessage
 * @returns {Promise<object>} — parsed JSON from the model's text response
 */
async function callGemini(systemInstruction, userMessage) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: userMessage }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error('Empty response from Gemini');

    return JSON.parse(text);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * AI Lens — calls Gemini with intake answers, returns stream recommendation.
 * Falls back silently on any error.
 *
 * @param {string[]} answers — array of 6 intake answers
 * @returns {Promise<{ recommendation: string, confidence: 'High'|'Medium'|'Low', reasoning: string }>}
 */
export async function getAILens(answers) {
  const systemInstruction = `You are an academic stream advisor. Given a student's answers about their interests, a proud problem-solving moment, how they handle pressure, their 5-year vision, and a subject they dread, recommend ONE stream: Science, Commerce, or Arts. Respond ONLY in JSON: { "recommendation": string, "confidence": "High"|"Medium"|"Low", "reasoning": string (2-3 sentences, reference specific details from their answers, not generic advice) }`;

  const userMessage = `Here are the student's answers to 6 intake questions:
1. Which subjects do you actually enjoy, not just do well in?
   ${answers[0]}

2. Describe a problem you solved that you were proud of.
   ${answers[1]}

3. How do you usually handle pressure or deadlines?
   ${answers[2]}

4. Picture yourself at 25. What are you doing on a normal Tuesday?
   ${answers[3]}

5. Which subject do you dread, and why?
   ${answers[4]}

6. Is anyone else's opinion (parents, friends) influencing this decision? How much?
   ${answers[5]}`;

  try {
    const result = await callGemini(systemInstruction, userMessage);
    // Validate shape
    if (!result.recommendation || !result.confidence || !result.reasoning) {
      throw new Error('Invalid response shape from AI Lens');
    }
    return result;
  } catch (err) {
    console.warn('[MindBot] AI Lens fallback activated:', err.message);
    return fallbackAILens(answers);
  }
}

/**
 * Human Lens — finds a tension in student's answers and asks ONE follow-up question.
 * Falls back silently on any error.
 *
 * @param {string[]} answers
 * @param {{ recommendation: string, confidence: string, reasoning: string }} aiLensResult
 * @returns {Promise<{ question: string }>}
 */
export async function getHumanLens(answers, aiLensResult) {
  const systemInstruction = `You are not an advisor here — you are an interviewer. You have the student's intake answers AND the AI Lens recommendation. Find ONE genuine tension between their answers (e.g., they lean Science but dread math; they picture a creative life at 25 but chose Commerce-leaning interests). Ask exactly ONE direct, specific follow-up question about that tension. No advice, no recommendation, just the question. Respond ONLY in JSON: { "question": string }`;

  const userMessage = `AI Lens recommended: ${aiLensResult.recommendation} (${aiLensResult.confidence} confidence)
Reasoning: ${aiLensResult.reasoning}

Student's intake answers:
1. Subjects they enjoy: ${answers[0]}
2. Problem they were proud of solving: ${answers[1]}
3. How they handle pressure: ${answers[2]}
4. Vision at 25: ${answers[3]}
5. Subject they dread: ${answers[4]}
6. External influences: ${answers[5]}`;

  try {
    const result = await callGemini(systemInstruction, userMessage);
    if (!result.question) throw new Error('Invalid response shape from Human Lens');
    return result;
  } catch (err) {
    console.warn('[MindBot] Human Lens fallback activated:', err.message);
    return fallbackHumanLens(answers, aiLensResult);
  }
}
