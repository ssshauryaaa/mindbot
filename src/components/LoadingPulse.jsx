/**
 * LoadingPulse.jsx
 * Accent-colored pulsing dot — blue for AI lens, amber for Human lens.
 * Respects prefers-reduced-motion.
 */
import { motion, useReducedMotion } from 'framer-motion';

const VARIANT_STYLES = {
  ai: {
    color: 'var(--ai-primary)',
    shadow: '0 0 12px 4px rgba(59,130,246,0.5)',
    label: 'AI is thinking…',
  },
  human: {
    color: 'var(--human-primary)',
    shadow: '0 0 12px 4px rgba(249,115,22,0.5)',
    label: 'Crafting your question…',
  },
};

export default function LoadingPulse({ variant = 'ai' }) {
  const shouldReduceMotion = useReducedMotion();
  const style = VARIANT_STYLES[variant];

  const pulseVariants = {
    animate: shouldReduceMotion
      ? { opacity: [0.6, 1, 0.6] }
      : {
          scale: [1, 1.4, 1],
          opacity: [0.7, 1, 0.7],
          boxShadow: [style.shadow, style.shadow.replace('0.5', '0.8'), style.shadow],
        },
  };

  return (
    <div
      className="flex flex-col items-center gap-6"
      role="status"
      aria-live="polite"
      aria-label={style.label}
    >
      <div className="flex items-center gap-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            style={{
              display: 'inline-block',
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: style.color,
            }}
            variants={pulseVariants}
            animate="animate"
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{style.label}</p>
    </div>
  );
}
