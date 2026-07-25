/**
 * fallback.js
 * Stateful, Context-Aware Conversational Intelligence Engine for MindBot.
 * Tracks conversation history (NDA, Science, Commerce, Humanities, Design, Law)
 * and answers follow-up questions contextually without topic jumping.
 */

// Context detection keywords
const TOPICS = {
  NDA: ['nda', 'armed forces', 'defence', 'defense', 'army', 'navy', 'air force', 'airforce', 'military', 'officer'],
  SCIENCE_PCM: ['physics', 'math', 'maths', 'mathematics', 'pcm', 'engineer', 'engineering', 'tech', 'coding', 'computer science'],
  SCIENCE_PCB: ['biology', 'doctor', 'medical', 'pcb', 'medicine', 'biotech', 'neuroscience', 'neet'],
  COMMERCE: ['commerce', 'business', 'finance', 'economics', 'accounting', 'ca', 'mba', 'stock', 'banking', 'trade'],
  HUMANITIES: ['humanities', 'arts', 'history', 'psychology', 'literature', 'sociology', 'political', 'journalism', 'philosophy', 'media'],
  DESIGN: ['design', 'art', 'creative', 'ux', 'ui', 'architecture', 'animation', 'fashion'],
  LAW: ['law', 'legal', 'lawyer', 'clat', 'justice', 'advocate'],
};

/**
 * Detects the dominant topic from text or conversation history
 */
function detectTopic(text) {
  const lower = text.toLowerCase();
  for (const [topic, keywords] of Object.entries(TOPICS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return topic;
    }
  }
  return null;
}

/**
 * Detects topic from history if the current prompt is a follow-up
 */
function getActiveContext(prompt, history = []) {
  // Check current prompt first
  const currentTopic = detectTopic(prompt);
  if (currentTopic) return currentTopic;

  // Otherwise inspect past messages in reverse order
  for (let i = history.length - 1; i >= 0; i--) {
    const msgText = typeof history[i]?.text === 'string' ? history[i].text : '';
    const topic = detectTopic(msgText);
    if (topic) return topic;
  }

  return 'GENERAL';
}

/**
 * Generates a rich, context-aware conversational response.
 *
 * @param {string} prompt - User message
 * @param {Array} history - Past message thread for context
 * @returns {{ text: string, aiReasoning: string, humanInsight: string }}
 */
export function generateSmartResponse(prompt, history = []) {
  const cleanPrompt = prompt.toLowerCase().trim();
  const context = getActiveContext(prompt, history);

  const isFollowUp = /after|options|career|doing next|what next|scope|jobs|prospects|can i do/i.test(cleanPrompt);
  const isStreamChoice = /which|choose|select|recommend|prepare|pick|suggest/i.test(cleanPrompt);

  // 1. Specific NDA Queries
  if (cleanPrompt.includes('nda') || cleanPrompt.includes('armed forces') || cleanPrompt.includes('defence') || cleanPrompt.includes('army') || cleanPrompt.includes('air force') || cleanPrompt.includes('navy')) {
    return {
      text: "If you want to prepare for NDA (National Defence Academy), **Science with Physics and Mathematics (PCM)** is the most recommended stream. Physics and Math are mandatory for the Air Force and Navy wings of NDA. For the Army wing, any stream is eligible, but PCM gives you an added advantage for technical officer entries (like 10+2 TES Entry).",
      aiReasoning: "Mandatory Eligibility Criterion: The Indian Air Force and Navy wings of NDA strictly require Physics and Mathematics at the 10+2 level. PCM also qualifies you for the 10+2 Technical Entry Scheme (TES).",
      humanInsight: "SSB & Written Preparation: NDA requires balancing academic strength in Math and General Ability with physical endurance and leadership traits evaluated during the SSB interview."
    };
  }

  // 2. Career Options & Follow-up Queries (Context-Aware!)
  if (isFollowUp) {
    if (context === 'NDA' || cleanPrompt.includes('nda')) {
      return {
        text: "After 12th PCM with an NDA/Defence focus, your top career pathways include: 1) Executive & Flying Officer Commissions in the Indian Army, Navy, or Air Force via NDA, 2) 10+2 Technical Entry Scheme (TES) for direct Military Engineering, 3) Commercial Aviation & Pilot training, 4) Aerospace & Defense R&D (DRDO), and 5) Computer Science / Robotics Engineering.",
        aiReasoning: "Defense & Engineering Pathway Mapping: 10+2 PCM qualifies you for both NDA officer entries and technical engineering degrees, preserving maximum career flexibility.",
        humanInsight: "Leadership & Service: Armed Forces careers offer unparalleled early leadership and service pride. Start building physical fitness and SSB situational judgment early alongside 12th studies."
      };
    }

    if (context === 'SCIENCE_PCM') {
      return {
        text: "With 12th Science (PCM), your major career pathways include: 1) Engineering & Tech (Computer Science, AI, Mechanical, Aerospace), 2) Defence Officer entries (NDA, Technical Entry Scheme), 3) Data Science & Quantitative Finance, 4) Architecture (NATA/JEE Paper 2), and 5) Pure Scientific Research & Astronomy (IISER / IISc).",
        aiReasoning: "Academic Versatility Signal: Science PCM provides entry to technical, defense, research, and analytical fields, making it the broadest stream for post-12th options.",
        humanInsight: "Personal Fit: PCM leaves all doors open, but demand high analytical discipline. Are you more excited by building software/tech, physical engineering, or defense service?"
      };
    }

    if (context === 'HUMANITIES') {
      return {
        text: "After Humanities/Arts, key career options include: 1) Corporate Law & Litigation (BA LLB via CLAT), 2) Clinical & Industrial Psychology, 3) UX/UI Design & Product Research, 4) Civil Services (UPSC / IAS / IFS), 5) Journalism & New Media, and 6) Public Policy & International Relations.",
        aiReasoning: "Qualitative Market Demand: Growing industry demand for human-centered skillsets in UX research, corporate law, policy analysis, and strategic communication.",
        humanInsight: "Modern Industry Relevance: Humanities combined with digital tools or analytical methods is highly lucrative. Focus on building strong writing, critical analysis, and portfolio proof."
      };
    }

    if (context === 'COMMERCE') {
      return {
        text: "After 12th Commerce, major career options include: 1) Chartered Accountancy (CA) & ACCA, 2) Investment Banking & Equity Research, 3) Corporate Finance & Business Analytics, 4) BBA/IPMAT for Top IIM Integrated Management, and 5) Product Entrepreneurship.",
        aiReasoning: "Financial & Strategic Aptitude: Commerce builds foundational skills in capital allocation, regulatory accounting, and commercial strategy across corporate sectors.",
        humanInsight: "Career Direction: Commerce offers high financial upside. Consider whether you prefer working with structured financial numbers or managing teams and scaling businesses."
      };
    }
  }

  // 3. Direct Topic Matches
  if (cleanPrompt.includes('humanities') || cleanPrompt.includes('arts')) {
    return {
      text: "Humanities (Arts) explores human behavior, history, psychology, literature, and social systems. It's a fantastic stream if you love critical thinking, writing, understanding society, or creative design. Career fields include UX Research, Law, Psychology, Journalism, and Public Policy.",
      aiReasoning: "Aptitude Signal: High alignment for students who excel in verbal reasoning, contextual analysis, and critical discourse over formulaic problem-solving.",
      humanInsight: "Field Reality: Humanities opens diverse non-linear paths. What specific area — human behavior, law, writing, or design — draws your curiosity most?"
    };
  }

  if (cleanPrompt.includes('commerce') || cleanPrompt.includes('business')) {
    return {
      text: "Commerce focuses on business operations, financial markets, accounting, and economics. It is ideal if you enjoy numerical strategy, organizational leadership, and real-world trade dynamics.",
      aiReasoning: "Domain Relevance: Direct preparation for commercial enterprise, financial markets, and organizational management frameworks.",
      humanInsight: "Practical Application: Business is ultimately about solving market problems for people. Do you see yourself analyzing financial growth or leading projects and startups?"
    };
  }

  // 4. General Stream Selection Query
  if (isStreamChoice) {
    return {
      text: "To choose the right stream, match your natural subject interest with your target goal: For NDA (Air Force/Navy) or Engineering choose **Science (PCM)**. For Medical/Biotech choose **Science (PCB)**. For Business, Finance & Accounting choose **Commerce**. For Law, Design, Psychology & Journalism choose **Humanities**.",
      aiReasoning: "Subject-to-Career Alignment: Evaluating primary subject interest against professional entrance exam requirements across Indian higher education.",
      humanInsight: "Decision Strategy: Pick the stream where you feel curious to learn every day, rather than what feels pressured by external expectations."
    };
  }

  // 5. Context-driven default fallback
  if (context === 'NDA' || context === 'SCIENCE_PCM') {
    return {
      text: `Regarding your query about "${prompt}": For Science (PCM) and NDA pathways, maintaining strong fundamentals in Class 11/12 Mathematics and Physics is essential. This prepares you simultaneously for NDA written exams, JEE Main, and technical officer entries.`,
      aiReasoning: "Curriculum Synergy: Class 11 & 12 PCM syllabus directly covers the Mathematics and Physics portions of competitive entrance examinations.",
      humanInsight: "Preparation Balance: Consistent daily practice in mathematics and general knowledge builds long-term confidence for competitive written papers.",
    };
  }

  return {
    text: `Synaptica analysis for "${prompt}": Exploring your academic and career choices involves evaluating your daily subject comfort against your long-term vision. Every stream opens specialized career avenues when aligned with your authentic interests.`,
    aiReasoning: "Guidance Framework: Comparing student subject preferences and goal clarity against higher education eligibility criteria.",
    humanInsight: "Practical Advice: Speak with mentors or professionals in your fields of interest to understand what their daily work routine actually looks like.",
  };
}

// Legacy exports for intake compatibility
export function fallbackAILens(answers) {
  const text = answers.join(' ');
  return generateSmartResponse(text);
}

export function fallbackHumanLens(answers, aiLensResult) {
  return {
    question: "What part of this recommendation feels most natural to you?"
  };
}
