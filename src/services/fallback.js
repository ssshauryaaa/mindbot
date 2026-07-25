/**
 * fallback.js
 * Local keyword-matching backup when Gemini API is unreachable.
 * Returns the SAME JSON shape as the real API calls — indistinguishable in a demo.
 */

const SCIENCE_KEYWORDS = [
  'physics', 'chemistry', 'biology', 'math', 'maths', 'mathematics',
  'coding', 'programming', 'engineering', 'technology', 'research',
  'experiment', 'lab', 'doctor', 'scientist', 'data', 'computer',
  'machine', 'robot', 'space', 'astronomy', 'medicine', 'medical',
  'calculate', 'formula', 'solve', 'logical', 'analytical', 'precise',
];

const COMMERCE_KEYWORDS = [
  'business', 'commerce', 'economics', 'finance', 'accounting', 'money',
  'entrepreneur', 'startup', 'management', 'marketing', 'trade', 'stock',
  'investment', 'bank', 'profit', 'sales', 'company', 'corporate',
  'market', 'strategy', 'leadership', 'organize', 'administration', 'ca',
  'chartered', 'mba', 'budget', 'cost', 'revenue',
];

const ARTS_KEYWORDS = [
  'art', 'design', 'creative', 'creativity', 'writing', 'literature',
  'music', 'dance', 'theatre', 'drama', 'film', 'photography', 'paint',
  'draw', 'sketch', 'history', 'geography', 'political', 'psychology',
  'sociology', 'philosophy', 'journalism', 'media', 'story', 'poem',
  'poetry', 'language', 'culture', 'social', 'human', 'express',
];

// Tension patterns for follow-up questions
const TENSION_QUESTIONS = {
  scienceButCreative: "You seem drawn to creative expression, yet you're leaning toward Science. What would it look like if you found a career where precision and creativity coexist — and does that feel possible to you?",
  commerceButPassionate: "You describe passion-driven interests, but Commerce can sometimes feel transactional. What's the deeper 'why' behind choosing a business path — is it independence, impact, or something else?",
  artsButPressured: "There's a real tension between what excites you creatively and what others expect. If no one's opinion mattered at all, what would your Tuesday at 25 actually look like?",
  scienceButDreadsMath: "You've mentioned leaning toward Science, but there's hesitation around the exact subjects Science demands most. What part of Science excites you enough to push through that resistance?",
  unsure: "You describe your ideal future quite vividly, but your subject preferences point in a different direction. Which matters more to you — the path that uses your current strengths, or the one that leads to the life you described?",
};

function scoreAnswers(answers) {
  const text = answers.join(' ').toLowerCase();
  let science = 0, commerce = 0, arts = 0;

  SCIENCE_KEYWORDS.forEach(kw => { if (text.includes(kw)) science++; });
  COMMERCE_KEYWORDS.forEach(kw => { if (text.includes(kw)) commerce++; });
  ARTS_KEYWORDS.forEach(kw => { if (text.includes(kw)) arts++; });

  return { science, commerce, arts };
}

function pickStream(scores) {
  const { science, commerce, arts } = scores;
  const max = Math.max(science, commerce, arts);
  if (max === 0) return 'Commerce'; // neutral default
  if (science === max) return 'Science';
  if (commerce === max) return 'Commerce';
  return 'Arts';
}

function pickConfidence(scores) {
  const vals = Object.values(scores);
  const max = Math.max(...vals);
  const total = vals.reduce((a, b) => a + b, 0);
  if (total === 0) return 'Low';
  const ratio = max / total;
  if (ratio > 0.55) return 'High';
  if (ratio > 0.4) return 'Medium';
  return 'Low';
}

function buildReasoning(stream, answers) {
  const text = answers.join(' ').toLowerCase();

  const reasoningMap = {
    Science: `Based on the subjects and problems you described, Science aligns well with your analytical strengths and curiosity-driven problem-solving. Your vision for the future suggests you thrive in structured, discovery-oriented environments. The skills you mentioned — especially around ${text.includes('math') ? 'mathematics' : text.includes('code') || text.includes('program') ? 'technology' : 'logic and analysis'} — are core to Science pathways.`,
    Commerce: `Your answers reflect a strong orientation toward systems, strategy, and real-world outcomes — hallmarks of someone well-suited for Commerce. The way you described handling pressure and your 5-year vision suggests you're drawn to environments where decisions have tangible impact. Commerce offers the blend of analytical thinking and people-facing work your answers point toward.`,
    Arts: `The way you described your proudest moment and your vision at 25 reveals someone who thinks in stories, ideas, and meaning — the defining quality of Arts and Humanities students. Your comfort with ambiguity and your reflective approach to pressure suggest you'd thrive in disciplines that reward interpretation and creative thinking over rote correctness.`,
  };

  return reasoningMap[stream];
}

function pickFollowUpQuestion(stream, answers) {
  const text = answers.join(' ').toLowerCase();

  const dreadsMath = text.includes('math') || text.includes('maths') || text.includes('mathematics');
  const mentionsCreative = ARTS_KEYWORDS.some(kw => text.includes(kw));
  const mentionsPressure = text.includes('stress') || text.includes('pressure') || text.includes('overwhelm');
  const parentsInfluence = text.includes('parent') || text.includes('family') || text.includes('expect');

  if (stream === 'Science' && dreadsMath) return TENSION_QUESTIONS.scienceButDreadsMath;
  if (stream === 'Science' && mentionsCreative) return TENSION_QUESTIONS.scienceButCreative;
  if (stream === 'Commerce' && mentionsCreative) return TENSION_QUESTIONS.commerceButPassionate;
  if (stream === 'Arts' && (mentionsPressure || parentsInfluence)) return TENSION_QUESTIONS.artsButPressured;
  return TENSION_QUESTIONS.unsure;
}

/**
 * Fallback for AI Lens
 * @param {string[]} answers — array of 6 intake answers
 * @returns {{ recommendation: string, confidence: string, reasoning: string }}
 */
export function fallbackAILens(answers) {
  const scores = scoreAnswers(answers);
  const recommendation = pickStream(scores);
  const confidence = pickConfidence(scores);
  const reasoning = buildReasoning(recommendation, answers);
  return { recommendation, confidence, reasoning };
}

/**
 * Fallback for Human Lens
 * @param {string[]} answers
 * @param {{ recommendation: string }} aiLensResult
 * @returns {{ question: string }}
 */
export function fallbackHumanLens(answers, aiLensResult) {
  const question = pickFollowUpQuestion(aiLensResult.recommendation, answers);
  return { question };
}
