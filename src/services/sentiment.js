/**
 * sentiment.js
 * Lightweight client-side Sentiment & Emotion Analyzer for Synaptica.
 * Detects tone from user input and signals Synaptica AI to auto-adapt.
 */

export function analyzeSentiment(text = "") {
  if (!text || text.trim().length === 0) {
    return {
      type: "neutral",
      label: "Conversational",
      emoji: "💬",
      color: "gray",
      toneShift: "none",
    };
  }

  const lower = text.toLowerCase();

  // 1. Stressed / Anxious / Frustrated / Seeking Comfort
  const stressedKeywords = [
    "stressed", "anxious", "stuck", "help", "frustrated", "hard", "difficult", "struggling",
    "scared", "worried", "fail", "failing", "error", "broken", "panic", "confused", "sad",
    "hate", "overwhelmed", "deadline", "urgent", "please help", "can't understand", "impossible",
    "depressed", "nervous", "scared"
  ];
  if (stressedKeywords.some((k) => lower.includes(k))) {
    return {
      type: "stressed",
      label: "Stressed / High Empathy Needed",
      emoji: "😰",
      color: "rose",
      toneShift: "empathy",
      shiftDescription: "Auto-shifted AI toward Human Empathy 🧠",
    };
  }

  // 2. Technical / Analytical / Coding / Math
  const techKeywords = [
    "code", "function", "algorithm", "formula", "equation", "python", "javascript", "react",
    "data", "math", "calculus", "benchmark", "syntax", "compile", "optimize", "derivative",
    "quantum", "physics", "logic", "structure"
  ];
  if (techKeywords.some((k) => lower.includes(k))) {
    return {
      type: "technical",
      label: "Analytical / Deep Logic",
      emoji: "📊",
      color: "violet",
      toneShift: "logic",
      shiftDescription: "Auto-shifted AI toward Machine Logic ⚡",
    };
  }

  // 3. Curious / Inquisitive / Educational
  const curiousKeywords = [
    "how does", "why is", "what is", "explain", "learn", "understand", "difference between",
    "tell me about", "wonder", "curious", "could you explain", "concept", "meaning"
  ];
  if (curiousKeywords.some((k) => lower.includes(k)) || lower.includes("?")) {
    return {
      type: "curious",
      label: "Curious / Inquisitive",
      emoji: "🔍",
      color: "sky",
      toneShift: "balanced",
      shiftDescription: "Balanced Duality Synthesis ⚖️",
    };
  }

  // 4. Creative / Inspired
  const creativeKeywords = [
    "idea", "create", "build", "awesome", "cool", "imagine", "story", "design", "invent", "future", "poem"
  ];
  if (creativeKeywords.some((k) => lower.includes(k))) {
    return {
      type: "creative",
      label: "Creative / Inspired",
      emoji: "✨",
      color: "amber",
      toneShift: "balanced",
      shiftDescription: "Creative Spark Synthesis ✨",
    };
  }

  return {
    type: "neutral",
    label: "Conversational",
    emoji: "💬",
    color: "gray",
    toneShift: "none",
  };
}
