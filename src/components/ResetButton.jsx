/**
 * ResetButton.jsx
 * Quiet "Try again" button that resets the full app state.
 */
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

export default function ResetButton({ onReset }) {
  return (
    <motion.button
      onClick={onReset}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
      style={{
        color: 'var(--text-secondary)',
        backgroundColor: 'transparent',
        border: '1px solid var(--border-subtle)',
        cursor: 'pointer',
        minHeight: 44,
        minWidth: 44,
      }}
      whileHover={{
        color: 'var(--text-primary)',
        borderColor: 'var(--text-secondary)',
        backgroundColor: 'var(--bg-surface)',
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      aria-label="Try again — restart from the beginning"
    >
      <RotateCcw size={16} strokeWidth={1.5} />
      <span>Try again</span>
    </motion.button>
  );
}
