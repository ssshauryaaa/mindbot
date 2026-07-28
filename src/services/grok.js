/**
 * grok.js
 * Grok AI service using the xAI OpenAI-compatible REST API.
 * Provides real Grok AI responses with multi-turn conversation context.
 */

import { fetchJsonWithTimeout } from './requestUtils.js';

const API_KEY = import.meta.env.VITE_GROK_API_KEY || import.meta.env.VITE_XAI_API_KEY;
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';

const SYSTEM_INSTRUCTION_BASE = `You are Synaptica, a sharp AI & Human Duality Intelligence System powered by Grok.

You help users with academic stream choices, career decisions, coding, logic, and life guidance by synthesizing two distinct streams of thought:
1. Machine Logic (analytical data, facts, formulas, structure)
2. Human Empathy (emotional intelligence, real-world trade-offs, perspective)

Respond ONLY with a raw JSON object (no markdown formatting, no text before or after). Exact JSON structure:
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
 * Synthesizes a response using Grok Cloud API with Duality mode support.
 *
 * @param {string} userPrompt - The user's message
 * @param {Array} history - Prior conversation messages [{sender, text}]
 * @param {string} activeMode - 'Pure Logic' | 'Synaptic Duality' | 'Human Empathy' | 'Logic' | 'Duality' | 'Empathy'
 * @param {string} model - 'grok-beta'
 * @param {number} [customRatio=50] - User-configured logic percentage ratio (0-100)
 * @returns {Promise<{ text: string, aiReasoning: string, humanInsight: string, logicRatio: number, empathyRatio: number, modeName: string }>}
 */
export async function getGrokSynthesizedResponse(userPrompt, history = [], activeMode = 'Synaptic Duality', model = 'grok-beta', customRatio = 50) {
  if (!API_KEY || API_KEY.length < 8) {
    throw new Error('API key not configured — please add VITE_GROK_API_KEY to your .env file and restart the dev server.');
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

    const res = await fetchJsonWithTimeout(GROK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY.trim()}`,
      },
      body: JSON.stringify({
        model: model || 'grok-beta',
        messages: messages,
        temperature: activeMode.includes('Logic') ? 0.35 : activeMode.includes('Empathy') ? 0.85 : 0.7,
        response_format: { type: 'json_object' },
      }),
    }, {
      timeoutMs: 12000,
      retries: 1,
      timeoutLabel: 'Grok request timed out. Please try again.',
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Grok API Error HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const rawText = data?.choices?.[0]?.message?.content;
    if (!rawText) throw new Error('Empty response content from Grok API');

    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/, '')
      .trim();

    const result = JSON.parse(cleaned);

    if (!result.text || !result.aiReasoning || !result.humanInsight) {
      throw new Error('Incomplete JSON schema returned from Grok');
    }

    const defaultRatios = activeMode.includes('Logic') ? { l: 90, e: 10 } : activeMode.includes('Empathy') ? { l: 10, e: 90 } : { l: 50, e: 50 };

    return {
      text: result.text,
      aiReasoning: result.aiReasoning,
      humanInsight: result.humanInsight,
      logicRatio: typeof result.logicRatio === 'number' ? result.logicRatio : defaultRatios.l,
      empathyRatio: typeof result.empathyRatio === 'number' ? result.empathyRatio : defaultRatios.e,
      modeName: activeMode,
      provider: 'grok',
      modelUsed: model || 'grok-beta',
    };
  } catch (err) {
    console.error('[MindBot] Grok API error:', err.message, err);
    throw err;
  }
}
