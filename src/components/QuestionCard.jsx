/**
 * QuestionCard.jsx
 * Single intake question with textarea.
 * Slide-in from right on mount, slide-out left on exit.
 */
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function QuestionCard({ question, questionNumber, totalQuestions, onAnswer }) {
  const [value, setValue] = useState('');
  const shouldReduceMotion = useReducedMotion();

  const slideVariants = {
    initial: { opacity: 0, x: shouldReduceMotion ? 0 : 60 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: { opacity: 0, x: shouldReduceMotion ? 0 : -60, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onAnswer(trimmed);
    setValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.shiftKey) return; // allow newlines with shift+enter
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      key={questionNumber}
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Question number */}
        <span
          className="text-sm font-semibold tracking-widest uppercase"
          style={{ color: 'var(--ai-primary)' }}
          aria-label={`Question ${questionNumber} of ${totalQuestions}`}
        >
          {questionNumber} / {totalQuestions}
        </span>

        {/* Question text */}
        <label
          htmlFor={`question-${questionNumber}`}
          className="text-2xl font-bold leading-snug"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}
        >
          {question}
        </label>

        {/* Textarea */}
        <textarea
          id={`question-${questionNumber}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your answer… (Enter to continue)"
          rows={4}
          className="w-full rounded-xl px-4 py-3 resize-none text-base"
          style={{
            backgroundColor: 'var(--bg-surface-raised)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            outline: 'none',
            fontFamily: 'var(--font-body)',
            lineHeight: 1.6,
            transition: 'border-color 0.15s',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--ai-primary)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--border-subtle)'; }}
          aria-required="true"
          autoFocus
        />

        {/* Hint */}
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          Shift+Enter for a new line · Enter to continue
        </p>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={!value.trim()}
          className="self-end flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
          style={{
            backgroundColor: value.trim() ? 'var(--ai-primary)' : 'var(--border-subtle)',
            color: value.trim() ? '#fff' : 'var(--text-secondary)',
            border: 'none',
            cursor: value.trim() ? 'pointer' : 'not-allowed',
            minHeight: 44,
            minWidth: 44,
            fontFamily: 'var(--font-body)',
            transition: 'background-color 0.15s, color 0.15s',
          }}
          whileTap={value.trim() ? { scale: 0.97 } : {}}
          transition={{ duration: 0.1 }}
          aria-label="Continue to next question"
        >
          Continue
          <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
        </motion.button>
      </form>
    </motion.div>
  );
}
