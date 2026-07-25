/**
 * synthesis.js
 * Client-side agree/differ logic — no API call needed.
 * Compares the AI Lens recommendation against signals in the student's Human Lens reply.
 */

// Keywords suggesting doubt, second thoughts, or a competing interest
const DOUBT_MARKERS = [
  'but', 'however', 'although', 'though', 'yet', 'still', 'unsure',
  'not sure', 'confused', "don't know", 'maybe', 'perhaps', 'doubt',
  'actually', 'actually prefer', 'wish', 'rather', 'instead',
  'different', 'else', 'other', 'change', 'reconsider', "can't decide",
];

// Keywords suggesting reinforcement / confidence in the AI's pick
const REINFORCEMENT_MARKERS = [
  'yes', 'exactly', 'definitely', 'absolutely', 'confirm', 'sure',
  'agree', 'right', 'correct', 'always', 'passionate', 'love',
  'excited', 'confident', 'clear', 'makes sense', 'obvious',
];

const STREAM_KEYWORDS = {
  Science: ['science', 'physics', 'chemistry', 'biology', 'math', 'engineering', 'tech', 'research', 'coding', 'medical'],
  Commerce: ['commerce', 'business', 'economics', 'finance', 'accounting', 'entrepreneurship', 'management', 'trade'],
  Arts: ['arts', 'art', 'creative', 'design', 'writing', 'literature', 'music', 'history', 'psychology', 'media', 'journalism'],
};

/**
 * Check if the reply mentions a different stream than what AI recommended
 */
function mentionsCompetingStream(reply, aiStream) {
  const lower = reply.toLowerCase();
  for (const [stream, keywords] of Object.entries(STREAM_KEYWORDS)) {
    if (stream !== aiStream && keywords.some(kw => lower.includes(kw))) {
      return stream;
    }
  }
  return null;
}

/**
 * Analyse the student's Human Lens reply and produce synthesis output.
 *
 * @param {string} studentReply — free-text reply to the Human Lens question
 * @param {{ recommendation: string, confidence: string, reasoning: string }} aiLensResult
 * @param {{ question: string }} humanLensResult
 * @returns {{
 *   agrees: boolean,
 *   agreementPoints: string[],
 *   differencePoints: string[],
 *   closingLine: string
 * }}
 */
export function synthesize(studentReply, aiLensResult, humanLensResult) {
  const lower = studentReply.toLowerCase();

  const doubtScore = DOUBT_MARKERS.filter(m => lower.includes(m)).length;
  const reinforceScore = REINFORCEMENT_MARKERS.filter(m => lower.includes(m)).length;
  const competingStream = mentionsCompetingStream(studentReply, aiLensResult.recommendation);

  const agrees = reinforceScore >= doubtScore && !competingStream;

  // Build agreement points
  const agreementPoints = [];
  if (reinforceScore > 0) {
    agreementPoints.push(`Your reply echoes the pattern the AI detected — a genuine pull toward ${aiLensResult.recommendation}.`);
  }
  if (aiLensResult.confidence === 'High') {
    agreementPoints.push(`The AI's recommendation carried ${aiLensResult.confidence.toLowerCase()} confidence, which your answer doesn't appear to contradict.`);
  }
  if (agreementPoints.length === 0) {
    agreementPoints.push(`Both lenses point to ${aiLensResult.recommendation} as the most coherent fit based on your answers.`);
  }

  // Build difference points
  const differencePoints = [];
  if (competingStream) {
    differencePoints.push(`Your reply surfaces real interest in ${competingStream} — something the AI's data-pattern didn't weight heavily enough.`);
  }
  if (doubtScore > reinforceScore) {
    differencePoints.push(`The uncertainty in your reply suggests the recommendation doesn't feel fully settled to you — which is worth sitting with before deciding.`);
  }
  if (differencePoints.length === 0 && agrees) {
    differencePoints.push(`No major divergence detected — though one lens asking a question doesn't mean all tensions are resolved.`);
  }
  if (differencePoints.length === 0) {
    differencePoints.push(`The Human Lens question revealed something the AI's pattern-match couldn't surface on its own.`);
  }

  const closingLine = agrees
    ? `Both lenses lean toward ${aiLensResult.recommendation} — but this is your life, not a data output. What feels true when you imagine actually living that choice?`
    : `There's a real split here. The AI sees a pattern; you see a pull in another direction. Neither is wrong — but only you know which one is actually you.`;

  return { agrees, agreementPoints, differencePoints, closingLine };
}
