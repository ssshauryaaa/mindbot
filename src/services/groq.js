/**
 * groq.js
 * Groq AI service using Groq's fast OpenAI-compatible REST API.
 * Provides high-speed LLM responses (e.g. Llama 3.3 70B) with multi-turn conversation context.
 */

import { fetchJsonWithTimeout } from './requestUtils.js';
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_INSTRUCTION_BASE = `You are Synaptica, an expert AI & Human Duality Intelligence System powered by Groq.

You help users with academic stream choices, career decisions, coding, logic, and life guidance by synthesizing two distinct streams of thought:
1. Machine Logic (analytical data, facts, formulas, clear step-by-step structure)
2. Human Empathy (emotional intelligence, real-world trade-offs, practical perspective)

Respond ONLY with a raw JSON object (no markdown formatting codeblocks wrapping the outer JSON, no text before or after). Exact JSON structure:
{
  "text": "<Comprehensive, detailed, and clear answer tailored to the user's prompt. Provide thorough explanations, structured points, or step-by-step guidance whenever applicable. Do NOT give brief or superficial answers.>",
  "aiReasoning": "<Detailed 2-3 sentence factual, logical rationale explaining the underlying principles, data, or analytical criteria. Never mention AI internals or confidence scores.>",
  "humanInsight": "<Detailed 2-3 sentence empathetic human perspective, practical real-world advice, honest trade-offs, or strategic reflection.>",
  "logicRatio": <number between 10 and 90 indicating weight of machine logic in this response>,
  "empathyRatio": <number between 10 and 90 indicating weight of human empathy in this response>,
  "modeName": "<The mode used: 'Pure Logic', 'Synaptic Duality', or 'Human Empathy'>"
}

Code formatting rule: ANY code snippet, function, or command anywhere in "text" MUST be wrapped in a fenced code block with a language tag (\\\`\\\`\\\`python, \\\`\\\`\\\`javascript, etc.). Never output code as plain unformatted text.Only give code when the user specifically asks for code

Absolute rules:
- Provide rich, high-value depth and complete explanations.
- Never mention vectors, confidence scores, pattern engines, or architecture internals.
- Write naturally like a world-class mentor and technical expert collaborating with a human.
- Maintain consistency with past conversation context.`;

/**
 * Synthesizes a response using Groq Cloud API with Duality mode support.
 *
 * @param {string} userPrompt - The user's message
 * @param {Array} history - Prior conversation messages [{sender, text}]
 * @param {string} activeMode - 'Pure Logic' | 'Synaptic Duality' | 'Human Empathy' | 'Logic' | 'Duality' | 'Empathy'
 * @param {string} model - 'llama-3.3-70b-versatile'
 * @param {number} [customRatio=50] - User-configured logic percentage ratio (0-100)
 * @returns {Promise<{ text: string, aiReasoning: string, humanInsight: string, logicRatio: number, empathyRatio: number, modeName: string }>}
 */
export async function getGroqSynthesizedResponse(userPrompt, history = [], activeMode = 'Synaptic Duality', model = 'llama-3.3-70b-versatile', customRatio = 50) {
  if (!API_KEY || API_KEY.length < 8) {
    throw new Error('API key not configured — please add VITE_GROQ_API_KEY to your .env file and restart the dev server.');
  }

  try {
    let modeInstruction = "";
    if (activeMode.includes('Logic')) {
      modeInstruction = "\nCURRENT MODE: LOGIC. Maximize analytical depth, structure, facts, and code/formulas. Set logicRatio around 85-95 and empathyRatio around 5-15.";
    } else if (activeMode.includes('Empathy')) {
      modeInstruction = "\nCURRENT MODE: EMPATHY. Maximize emotional intelligence, personal growth, real-world context, and empathetic encouragement. Set empathyRatio around 85-95 and logicRatio around 5-15.";
    } else {
      modeInstruction = `\nCURRENT MODE: DUALITY. User-configured target ratio: ${customRatio}% Machine Logic and ${100 - customRatio}% Human Empathy. Balance your explanation according to this target. Set logicRatio around ${customRatio} and empathyRatio around ${100 - customRatio}.`;
    }

    const messages = [
      {
        role: 'system',
        content: SYSTEM_INSTRUCTION_BASE + modeInstruction,
      },
    ];

    // Build multi-turn history (last 8 messages for context)
    history
      .slice(-8)
      .filter(msg => typeof msg.text === 'string' && msg.text.trim().length > 0)
      .forEach(msg => {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        });
      });

    // Current user message
    messages.push({
      role: 'user',
      content: userPrompt,
    });

    const res = await fetchJsonWithTimeout(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY.trim()}`,
      },
      body: JSON.stringify({
        model: model || 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: activeMode.includes('Logic') ? 0.35 : activeMode.includes('Empathy') ? 0.85 : 0.7,
        max_tokens: 2048,
        response_format: { type: 'json_object' },
      }),
    }, {
      timeoutMs: 12000,
      retries: 1,
      timeoutLabel: 'Groq request timed out. Please try again.',
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Groq API Error HTTP ${res.status}: ${errText}`);
    }

    const json = await res.json();
    const rawContent = json?.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error('Empty response from Groq API');
    }

    const cleaned = rawContent
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/, '')
      .trim();

    const result = JSON.parse(cleaned);

    if (!result.text || !result.aiReasoning || !result.humanInsight) {
      throw new Error('Incomplete JSON response from Groq: ' + JSON.stringify(result));
    }

    const defaultRatios = activeMode.includes('Logic') ? { l: 90, e: 10 } : activeMode.includes('Empathy') ? { l: 10, e: 90 } : { l: 50, e: 50 };

    return {
      text: result.text,
      aiReasoning: result.aiReasoning,
      humanInsight: result.humanInsight,
      logicRatio: typeof result.logicRatio === 'number' ? result.logicRatio : defaultRatios.l,
      empathyRatio: typeof result.empathyRatio === 'number' ? result.empathyRatio : defaultRatios.e,
      modeName: activeMode,
      provider: 'groq',
      modelUsed: model || 'llama-3.3-70b-versatile',
    };
  } catch (err) {
    console.error('[MindBot] Groq API error:', err.message, err);
    throw err;
  }
}
