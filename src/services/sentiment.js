/**
 * sentiment.js
 * Professional client-side Sentiment & Emotion Analyzer for Synaptica.
 * Detects tone from user input and signals Synaptica AI to auto-adapt.
 *
 * Changes from the original:
 * - Word-boundary matching (regex) instead of `.includes()`, so "hard" no
 *   longer fires on "hardware" and "sad" no longer fires on "sadly ironic".
 * - Every category is scored (not just the first one that matches), so a
 *   message like "I'm stressed about this bug in my code" is judged on
 *   which tone actually dominates, not on array order.
 * - Lightweight negation handling: "not stressed" / "isn't hard" no longer
 *   count as a stressed-tone hit.
 * - Priority is now an explicit, named constant instead of "whichever
 *   `if` happens to run first" — easy to see and to change.
 * - Output keeps the same shape as before (type, label, icon, color,
 *   toneShift, shiftDescription) so existing callers don't break, plus
 *   two additive fields: `confidence` and `matchedKeywords`.
 */

const CATEGORIES = {
  stressed: {
    keywords: [
      "stressed", "anxious", "stuck", "help", "frustrated", "hard", "difficult",
      "struggling", "scared", "worried", "fail", "failing", "error", "broken",
      "panic", "confused", "sad", "hate", "overwhelmed", "deadline", "urgent",
      "can't understand", "impossible", "depressed", "nervous",
    ],
    label: "High Empathy Tone",
    icon: "HeartHandshake",
    color: "rose",
    toneShift: "empathy",
    shiftDescription: "Auto-adapted: High Empathy Mode 🧠",
    weight: 1.4, // emotional-safety signals win close ties on purpose
  },
  technical: {
    keywords: [
      "code", "function", "algorithm", "formula", "equation", "python",
      "javascript", "react", "data", "math", "calculus", "benchmark", "syntax",
      "compile", "optimize", "derivative", "quantum", "physics", "logic",
      "structure",
    ],
    label: "Deep Logic Tone",
    icon: "Cpu",
    color: "violet",
    toneShift: "logic",
    shiftDescription: "Auto-adapted: Machine Logic Mode ⚡",
    weight: 1,
  },
  curious: {
    keywords: [
      "how does", "why is", "what is", "explain", "learn", "understand",
      "difference between", "tell me about", "wonder", "curious",
      "could you explain", "concept", "meaning",
    ],
    label: "Inquisitive Tone",
    icon: "Search",
    color: "sky",
    toneShift: "balanced",
    shiftDescription: "Balanced Duality Mode ⚖️",
    weight: 0.9,
  },
  creative: {
    keywords: [
      "idea", "create", "build", "awesome", "cool", "imagine", "story",
      "design", "invent", "future", "poem",
    ],
    label: "Creative Tone",
    icon: "Sparkles",
    color: "amber",
    toneShift: "balanced",
    shiftDescription: "Creative Synthesis Mode ✨",
    weight: 0.9,
  },
};

const NEUTRAL_RESULT = Object.freeze({
  type: "neutral",
  label: "Conversational",
  icon: "MessageSquare",
  color: "gray",
  toneShift: "none",
  confidence: 0,
  matchedKeywords: [],
});

const NEGATORS = ["not", "no", "n't", "never", "isn't", "aren't", "wasn't", "weren't"];

// Escape regex-special characters and build one word-boundary pattern per
// keyword up front, so classification never recompiles regex on every call.
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function compileCategories() {
  const compiled = {};
  for (const [key, cat] of Object.entries(CATEGORIES)) {
    compiled[key] = {
      ...cat,
      patterns: cat.keywords.map((kw) => ({
        text: kw,
        // Multi-word phrases ("how does") just need to appear in order;
        // single words get real \b boundaries so substrings don't match.
        regex: kw.includes(" ")
          ? new RegExp(escapeRegExp(kw), "i")
          : new RegExp(`\\b${escapeRegExp(kw)}\\b`, "i"),
      })),
    };
  }
  return compiled;
}

const COMPILED_CATEGORIES = compileCategories();

/** True if a negator sits within the few words immediately before the match. */
function isNegated(lower, matchIndex) {
  const windowStart = Math.max(0, matchIndex - 20);
  const preceding = lower.slice(windowStart, matchIndex);
  return NEGATORS.some((neg) => new RegExp(`\\b${escapeRegExp(neg)}\\b\\s*\\w*\\s*$`, "i").test(preceding));
}

function scoreCategory(lower, category) {
  const matched = [];
  let score = 0;

  for (const { text, regex } of category.patterns) {
    const match = regex.exec(lower);
    if (!match) continue;
    if (isNegated(lower, match.index)) continue;
    score += category.weight;
    matched.push(text);
  }

  return { score, matched };
}

/**
 * Classify the tone of a piece of text.
 * @param {string} text
 * @returns {{
 *   type: string, label: string, icon: string, color: string,
 *   toneShift: string, shiftDescription?: string,
 *   confidence: number, matchedKeywords: string[]
 * }}
 */
export function analyzeSentiment(text = "") {
  if (!text || text.trim().length === 0) {
    return { ...NEUTRAL_RESULT };
  }

  const lower = text.toLowerCase();
  const isQuestion = lower.includes("?");

  let best = null; // { key, score, matched }
  for (const [key, category] of Object.entries(COMPILED_CATEGORIES)) {
    const { score, matched } = scoreCategory(lower, category);
    // A bare "?" nudges curiosity even with no keyword hit.
    const adjusted = key === "curious" && isQuestion ? score + 0.5 : score;
    if (adjusted <= 0) continue;
    if (!best || adjusted > best.score) {
      best = { key, score: adjusted, matched };
    }
  }

  if (!best) return { ...NEUTRAL_RESULT };

  const category = CATEGORIES[best.key];
  // Confidence is a soft, bounded signal for UI use (e.g. dimming a badge
  // when a message barely qualifies) — not a statistical probability.
  const confidence = Math.min(1, best.score / 3);

  return {
    type: best.key,
    label: category.label,
    icon: category.icon,
    color: category.color,
    toneShift: category.toneShift,
    shiftDescription: category.shiftDescription,
    confidence: Math.round(confidence * 100) / 100,
    matchedKeywords: best.matched,
  };
}