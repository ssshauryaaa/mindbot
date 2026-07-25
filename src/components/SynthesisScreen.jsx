/**
 * SynthesisScreen.jsx
 * The signature screen: two lens cards animate in from opposite edges,
 * dock into a single violet-bordered synthesis card, with a color-blend flash.
 *
 * prefers-reduced-motion: simple crossfade only.
 */
import { useState, useEffect } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, GitBranch, Sparkles } from 'lucide-react';
import LensCard from './LensCard';
import ResetButton from './ResetButton';

export default function SynthesisScreen({ aiLensResult, humanLensResult, studentReply, synthesis, onReset }) {
  const shouldReduceMotion = useReducedMotion();
  const [phase, setPhase] = useState('split'); // 'split' | 'merging' | 'merged'

  useEffect(() => {
    // After cards slide in (400ms), trigger merge (300ms)
    const mergeTimer = setTimeout(() => setPhase('merging'), 600);
    const doneTimer = setTimeout(() => setPhase('merged'), 1050);
    return () => {
      clearTimeout(mergeTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  const aiCardVariants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { x: '-100vw', opacity: 0 },
        visible: {
          x: phase === 'split' ? 0 : phase === 'merging' ? '18%' : '0%',
          opacity: 1,
          scale: phase === 'merging' ? 0.95 : 1,
          transition: { duration: phase === 'split' ? 0.4 : 0.3, ease: 'easeInOut' },
        },
      };

  const humanCardVariants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { x: '100vw', opacity: 0 },
        visible: {
          x: phase === 'split' ? 0 : phase === 'merging' ? '-18%' : '0%',
          opacity: 1,
          scale: phase === 'merging' ? 0.95 : 1,
          transition: { duration: phase === 'split' ? 0.4 : 0.3, ease: 'easeInOut' },
        },
      };

  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-center"
      >
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(28px, 5vw, 40px)',
            color: 'var(--synthesis-primary)',
            marginBottom: 8,
          }}
        >
          The Synthesis
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 500 }}>
          Two ways of seeing your situation, placed side by side. The decision stays yours.
        </p>
      </motion.div>

      {/* Color-blend flash overlay on merge */}
      <AnimatePresence>
        {phase === 'merging' && !shouldReduceMotion && (
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.35, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, times: [0, 0.3, 1] }}
            className="fixed inset-0 pointer-events-none z-50"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.5) 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Dual card animation zone */}
      {phase !== 'merged' && (
        <div className="relative w-full flex gap-6 justify-center overflow-hidden">
          {/* AI Lens card */}
          <motion.div
            className="flex-1 max-w-md"
            variants={aiCardVariants}
            initial="hidden"
            animate="visible"
          >
            <LensCard
              variant="ai"
              data={aiLensResult}
            />
          </motion.div>

          {/* Human Lens card */}
          <motion.div
            className="flex-1 max-w-md"
            variants={humanCardVariants}
            initial="hidden"
            animate="visible"
          >
            <LensCard
              variant="human"
              data={{ question: humanLensResult.question, reply: studentReply }}
            />
          </motion.div>
        </div>
      )}

      {/* Merged synthesis card */}
      <AnimatePresence>
        {phase === 'merged' && (
          <motion.div
            key="merged-card"
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full rounded-2xl p-8 flex flex-col gap-7"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '2px solid var(--synthesis-primary)',
              boxShadow: '0 0 40px rgba(139,92,246,0.2)',
              maxWidth: 860,
            }}
          >
            {/* Synthesis header */}
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: 'rgba(139,92,246,0.15)' }}
                aria-hidden="true"
              >
                <Sparkles size={20} strokeWidth={1.5} style={{ color: 'var(--synthesis-primary)' }} />
              </div>
              <span
                className="text-sm font-semibold tracking-wide uppercase"
                style={{ color: 'var(--synthesis-primary)', fontFamily: 'var(--font-heading)' }}
              >
                Synthesis — {aiLensResult.recommendation}
              </span>
            </div>

            {/* Side-by-side mini cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="rounded-xl p-4"
                style={{ backgroundColor: 'var(--bg-surface-raised)', border: '1px solid rgba(59,130,246,0.3)' }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--ai-primary)' }}>
                  AI Lens
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{aiLensResult.recommendation}</strong> — {aiLensResult.confidence} confidence.
                  {' '}{aiLensResult.reasoning}
                </p>
              </div>
              <div
                className="rounded-xl p-4"
                style={{ backgroundColor: 'var(--bg-surface-raised)', border: '1px solid rgba(249,115,22,0.3)' }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--human-primary)' }}>
                  Human Lens
                </p>
                <p className="text-sm italic" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  "{humanLensResult.question}"
                </p>
                {studentReply && (
                  <p className="text-sm mt-2" style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}>
                    {studentReply}
                  </p>
                )}
              </div>
            </div>

            {/* Where they agree / differ */}
            <div className="flex flex-col gap-4">
              {/* Agreement */}
              <div
                className="rounded-xl p-4"
                style={{ backgroundColor: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.25)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={16} strokeWidth={1.5} style={{ color: 'var(--success)' }} aria-hidden="true" />
                  <span className="text-sm font-semibold" style={{ color: 'var(--success)' }}>
                    Where they agree
                  </span>
                </div>
                <ul className="flex flex-col gap-1">
                  {synthesis.agreementPoints.map((pt, i) => (
                    <li key={i} className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Divergence */}
              {synthesis.differencePoints.length > 0 && (
                <div
                  className="rounded-xl p-4"
                  style={{ backgroundColor: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.25)' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch size={16} strokeWidth={1.5} style={{ color: 'var(--warning)' }} aria-hidden="true" />
                    <span className="text-sm font-semibold" style={{ color: 'var(--warning)' }}>
                      Where they differ
                    </span>
                  </div>
                  <ul className="flex flex-col gap-1">
                    {synthesis.differencePoints.map((pt, i) => (
                      <li key={i} className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Closing line — hands decision back to student */}
            <div
              className="rounded-xl p-5"
              style={{
                background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(59,130,246,0.05) 100%)',
                border: '1px solid rgba(139,92,246,0.25)',
              }}
            >
              <p
                className="text-base font-semibold leading-relaxed"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}
              >
                {synthesis.closingLine}
              </p>
            </div>

            {/* Reset */}
            <div className="flex justify-end">
              <ResetButton onReset={onReset} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
