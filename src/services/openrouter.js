/**
 * openrouter.js
 * OpenRouter AI service connecting to hundreds of open-source & proprietary LLMs.
 * Uses a fallback model chain — if one model is rate-limited or down, the next is tried automatically.
 * Endpoint: https://openrouter.ai/api/v1/chat/completions
 */

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const SYSTEM_INSTRUCTION_BASE = `You are Synaptica, an expert AI & Human Duality Intelligence System powered by OpenRouter.

You help users with academic stream choices, career decisions, coding, logic, and life guidance by synthesizing two distinct streams of thought:
1. Machine Logic (analytical data, facts, formulas, clear step-by-step structure)
2. Human Empathy (emotional intelligence, real-world trade-offs, practical perspective)

You MUST respond ONLY with a raw JSON object. Do NOT wrap it in markdown code fences. No text before or after the JSON. Exact structure required:
{
  "text": "<Comprehensive, detailed answer. Provide thorough explanations, structured points, or step-by-step guidance. Do NOT give brief or superficial answers.>",
  "aiReasoning": "<Detailed 2-3 sentence factual, logical rationale. Never mention AI internals or confidence scores.>",
  "humanInsight": "<Detailed 2-3 sentence empathetic human perspective, practical real-world advice, honest trade-offs.>",
  "logicRatio": <integer 10-90: weight of machine logic>,
  "empathyRatio": <integer 10-90: weight of human empathy>,
  "modeName": "<'Pure Logic' | 'Synaptic Duality' | 'Human Empathy'>"
}

Code formatting rule: ANY code snippet, function, or command anywhere in "text" MUST be wrapped in a fenced code block with a language tag (\\\`\\\`\\\`python, \\\`\\\`\\\`javascript, etc.). Never output code as plain unformatted text.Only give code when the user specifically asks for code

Rules:
- Output ONLY valid JSON. Never include prose, preamble, or markdown fences outside the JSON.
- Provide rich, high-value depth and complete explanations.
- Never mention vectors, confidence scores, or AI architecture internals.
- Write like a world-class mentor and technical expert.`;

/**
 * Priority-ordered list of free OpenRouter models to try.
 * Uses OpenRouter's official openrouter/free dynamic model router first,
 * followed by confirmed open-source free models.
 */
const FREE_MODEL_CHAIN = [
  'openrouter/free',
  'openrouter/auto',
  'google/gemma-2-9b-it:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'qwen/qwen-2.5-72b-instruct:free',
  'mistralai/mistral-7b-instruct:free',
  'deepseek/deepseek-r1:free',
];

/**
 * Synthesizes a response using OpenRouter API with automatic model fallback.
 *
 * @param {string} userPrompt - The user's message
 * @param {Array} history - Prior conversation messages [{sender, text}]
 * @param {string} activeMode - 'Pure Logic' | 'Synaptic Duality' | 'Human Empathy'
 * @param {string|null} [model] - Optional override model slug
 * @param {number} [customRatio=50] - User-configured logic percentage ratio (0-100)
 */
export async function getOpenRouterSynthesizedResponse(userPrompt, history = [], activeMode = 'Synaptic Duality', model = null, customRatio = 50) {
  if (!API_KEY || API_KEY.length < 8) {
    throw new Error('API key not configured — please add VITE_OPENROUTER_API_KEY to your .env file and restart the dev server.');
  }

  let modeInstruction = "";
  if (activeMode.includes('Logic')) {
    modeInstruction = "\nCURRENT MODE: LOGIC. Maximize analytical depth, structure, facts, and code/formulas. Set logicRatio 85-95 and empathyRatio 5-15.";
  } else if (activeMode.includes('Empathy')) {
    modeInstruction = "\nCURRENT MODE: EMPATHY. Maximize emotional intelligence, personal growth, real-world context. Set empathyRatio 85-95 and logicRatio 5-15.";
  } else {
    modeInstruction = `\nCURRENT MODE: DUALITY. User-configured target ratio: ${customRatio}% Machine Logic and ${100 - customRatio}% Human Empathy. Balance your explanation according to this target. Set logicRatio around ${customRatio} and empathyRatio around ${100 - customRatio}.`;
  }

  const messages = [
    { role: 'system', content: SYSTEM_INSTRUCTION_BASE + modeInstruction },
  ];

  history
    .slice(-8)
    .filter(msg => typeof msg.text === 'string' && msg.text.trim().length > 0)
    .forEach(msg => {
      messages.push({ role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.text });
    });

  messages.push({ role: 'user', content: userPrompt });

  // If a model is requested, try it first, then fall back to FREE_MODEL_CHAIN if it fails
  const modelsToTry = model
    ? [model, ...FREE_MODEL_CHAIN.filter(m => m !== model)]
    : FREE_MODEL_CHAIN;

  let lastError = null;
  let attemptedCount = 0;

  for (const currentModel of modelsToTry) {
    attemptedCount++;
    try {
      console.log(`[MindBot] OpenRouter: trying model ${attemptedCount}/${modelsToTry.length} → ${currentModel}`);

      const res = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY.trim()}`,
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
          'X-Title': 'MindBot AI Duality Platform',
        },
        body: JSON.stringify({
          model: currentModel,
          messages: messages,
          temperature: activeMode.includes('Logic') ? 0.35 : activeMode.includes('Empathy') ? 0.85 : 0.7,
          max_tokens: 2048,
        }),
      });

      // Skip to next model on rate-limit or model unavailable
      if (res.status === 429 || res.status === 404) {
        const errBody = await res.text();
        console.warn(`[MindBot] OpenRouter "${currentModel}" skipped (HTTP ${res.status}) → trying next model...`);
        lastError = new Error(`OpenRouter API Error HTTP ${res.status}: ${errBody}`);
        continue;
      }

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`[MindBot] OpenRouter "${currentModel}" error (HTTP ${res.status}) → trying next model...`);
        lastError = new Error(`OpenRouter API Error HTTP ${res.status}: ${errText}`);
        continue;
      }

      const json = await res.json();
      const rawContent = json?.choices?.[0]?.message?.content;

      if (!rawContent) {
        console.warn(`[MindBot] OpenRouter "${currentModel}" returned empty content → trying next model...`);
        lastError = new Error(`Empty response from OpenRouter model "${currentModel}"`);
        continue;
      }

      // Clean markdown fences if model includes them
      let cleaned = rawContent
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/gi, '')
        .trim();

      // Extract JSON object if wrapped in additional commentary
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleaned = jsonMatch[0];
      }

      let result;
      try {
        result = JSON.parse(cleaned);
      } catch {
        console.warn(`[MindBot] OpenRouter "${currentModel}" returned non-JSON content → trying next model...`);
        lastError = new Error(`Non-JSON response from "${currentModel}": ${cleaned.slice(0, 120)}`);
        continue;
      }

      if (!result.text || !result.aiReasoning || !result.humanInsight) {
        console.warn(`[MindBot] OpenRouter "${currentModel}" returned incomplete JSON → trying next model...`);
        lastError = new Error(`Incomplete JSON from "${currentModel}"`);
        continue;
      }

      const defaultRatios = activeMode.includes('Logic') ? { l: 90, e: 10 } : activeMode.includes('Empathy') ? { l: 10, e: 90 } : { l: 50, e: 50 };

      console.log(`[MindBot] OpenRouter success with model: ${currentModel}`);
      return {
        text: result.text,
        aiReasoning: result.aiReasoning,
        humanInsight: result.humanInsight,
        logicRatio: typeof result.logicRatio === 'number' ? result.logicRatio : defaultRatios.l,
        empathyRatio: typeof result.empathyRatio === 'number' ? result.empathyRatio : defaultRatios.e,
        modeName: activeMode,
        provider: 'openrouter',
        modelUsed: currentModel,
      };

    } catch (err) {
      console.warn(`[MindBot] OpenRouter "${currentModel}" threw an error: ${err.message} → trying next model...`);
      lastError = err;
    }
  }

  // All models exhausted
  console.error('[MindBot] OpenRouter: all models in chain failed.', lastError);
  throw lastError || new Error('All OpenRouter free models are currently unavailable. Please try again in a moment.');
}
