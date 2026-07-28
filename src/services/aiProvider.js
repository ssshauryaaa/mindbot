/**
 * aiProvider.js
 * Unified routing for AI synthesis providers (Gemini & Grok).
 */

import { getSynthesizedResponse as getGeminiResponse } from './gemini.js';
import { getGroqSynthesizedResponse } from './groq.js';
import { getGrokSynthesizedResponse } from './grok.js';
import { getOpenRouterSynthesizedResponse } from './openrouter.js';
import { generateSmartResponse } from './fallback.js';

export const AI_PROVIDERS = [
  {
    id: 'gemini',
    name: 'Gemini 3.6 Flash',
    providerName: 'Google AI',
    icon: 'Sparkles',
    defaultModel: 'gemini-3.6-flash',
    badge: 'Gemini',
  },
  {
    id: 'groq',
    name: 'Groq (Llama 3.3 70B)',
    providerName: 'Groq Cloud',
    icon: 'Zap',
    defaultModel: 'llama-3.3-70b-versatile',
    badge: 'Groq',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    providerName: 'OpenRouter',
    icon: 'Globe',
    defaultModel: 'openrouter/free',
    badge: 'OpenRouter',
  },
];

/**
 * Route request to selected AI provider (Gemini, Groq, OpenRouter, or Grok)
 *
 * @param {string} userPrompt - User message text
 * @param {Array} history - Prior message history
 * @param {string} activeMode - 'Logic' | 'Duality' | 'Empathy'
 * @param {string} provider - 'gemini' | 'groq' | 'openrouter' | 'grok'
 * @param {string} [model] - Optional specific model ID
 * @param {number} [customRatio=50] - User-configured logic percentage ratio (0-100)
 */
const GENERIC_OUTPUT_PATTERNS = [
  /^i(?:'m| am) here to help/i,
  /^as an ai/i,
  /^could you clarify/i,
  /^please provide more details/i,
];

function isLowQualityResponse(res) {
  const text = (res?.text || '').trim();
  if (!text || text.length < 40) return true;
  return GENERIC_OUTPUT_PATTERNS.some((pattern) => pattern.test(text));
}

async function callProvider(userPrompt, history, activeMode, provider, model, customRatio) {
  if (provider === 'groq') {
    return await getGroqSynthesizedResponse(userPrompt, history, activeMode, model || 'llama-3.3-70b-versatile', customRatio);
  }
  if (provider === 'openrouter') {
    return await getOpenRouterSynthesizedResponse(userPrompt, history, activeMode, model || 'openrouter/free', customRatio);
  }
  if (provider === 'grok') {
    return await getGrokSynthesizedResponse(userPrompt, history, activeMode, model || 'grok-beta', customRatio);
  }

  const res = await getGeminiResponse(userPrompt, history, activeMode, customRatio);
  return {
    ...res,
    provider: 'gemini',
    modelUsed: model || 'gemini-3.6-flash',
  };
}

export async function getSynthesizedResponse(userPrompt, history = [], activeMode = 'Duality', provider = 'groq', model, customRatio = 50, options = {}) {
  const { safeDemoMode = false } = options;

  try {
    let response = await callProvider(userPrompt, history, activeMode, provider, model, customRatio);

    // Accuracy safeguard: one stricter retry if response looks generic.
    if (isLowQualityResponse(response)) {
      const strictPrompt = `${userPrompt}\n\nPlease provide a concrete, specific answer with examples relevant to the user context.`;
      response = await callProvider(strictPrompt, history, activeMode, provider, model, customRatio);
    }

    return response;
  } catch (err) {
    if (!safeDemoMode) throw err;

    const fallback = generateSmartResponse(userPrompt, history);
    return {
      ...fallback,
      provider: 'fallback',
      modelUsed: 'local-context-engine',
      modeName: 'Safe Fallback',
      isFallback: true,
      logicRatio: 55,
      empathyRatio: 45,
    };
  }
}
