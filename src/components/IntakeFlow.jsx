/**
 * IntakeFlow.jsx
 * 6-question stepper with animated progress bar.
 * Collects answers and calls onComplete(answers) when done.
 */
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import QuestionCard from './QuestionCard';

const QUESTIONS = [
  "Which subjects do you actually enjoy — not just do well in?",
  "Describe a problem you solved that you were proud of.",
  "How do you usually handle pressure or deadlines?",
  "Picture yourself at 25. What are you doing on a normal Tuesday?",
  "Which subject do you dread, and why?",
  "Is anyone else's opinion (parents, friends) influencing this decision? How much?",
];

export default function IntakeFlow({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const shouldReduceMotion = useReducedMotion();

  const progress = ((currentIndex) / QUESTIONS.length) * 100;

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentIndex + 1 >= QUESTIONS.length) {
      onComplete(newAnswers);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  return (
    <div className="flex flex-col gap-10 w-full max-w-2xl mx-auto">
      {/* Progress bar */}
      <div role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={QUESTIONS.length} aria-label="Intake progress">
        <div
          className="w-full rounded-full overflow-hidden"
          style={{ height: 4, backgroundColor: 'var(--border-subtle)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: 'var(--ai-primary)' }}
            animate={{ width: `${progress}%` }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Question card with slide animation */}
      <AnimatePresence mode="wait">
        <QuestionCard
          key={currentIndex}
          question={QUESTIONS[currentIndex]}
          questionNumber={currentIndex + 1}
          totalQuestions={QUESTIONS.length}
          onAnswer={handleAnswer}
        />
      </AnimatePresence>
    </div>
  );
}
