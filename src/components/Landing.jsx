/**
 * Landing.jsx
 * Full-viewport landing screen with dual-tone logo treatment.
 * Staggered fade-up entrance, "Start" button with blue accent.
 */
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Landing({ onStart }) {
  const shouldReduceMotion = useReducedMotion();

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.12 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      {/* Ambient background glow blobs */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full blur-3xl"
          style={{
            width: 480,
            height: 480,
            top: '10%',
            left: '5%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full blur-3xl"
          style={{
            width: 400,
            height: 400,
            top: '15%',
            right: '5%',
            background: 'radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 70%)',
          }}
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center gap-8 relative z-10"
        style={{ maxWidth: 560 }}
      >
        {/* Badge */}
        <motion.div variants={item}>
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            <Sparkles size={12} strokeWidth={1.5} aria-hidden="true" />
            SYNAPTICA — Duality of Mind
          </span>
        </motion.div>

        {/* App name — dual-tone */}
        <motion.h1
          variants={item}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(48px, 8vw, 80px)',
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          <span style={{ color: 'var(--ai-primary)' }}>Mind</span>
          <span style={{ color: 'var(--human-primary)' }}>Bot</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={item}
          style={{
            fontSize: 18,
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: 420,
          }}
        >
          Two lenses. One decision.
          <br />
          AI pattern-matching meets human reflection — so you can see the full picture before you choose.
        </motion.p>

        {/* Dual-lens visual teaser */}
        <motion.div variants={item} className="flex items-center gap-4">
          <div
            className="px-4 py-2 rounded-xl text-sm font-semibold"
            style={{
              backgroundColor: 'rgba(59,130,246,0.12)',
              border: '1px solid rgba(59,130,246,0.3)',
              color: 'var(--ai-glow)',
            }}
          >
            AI Lens
          </div>
          <div
            style={{
              width: 32,
              height: 2,
              background: 'linear-gradient(90deg, var(--ai-primary), var(--synthesis-primary), var(--human-primary))',
              borderRadius: 1,
            }}
            aria-hidden="true"
          />
          <div
            className="px-4 py-2 rounded-xl text-sm font-semibold"
            style={{
              backgroundColor: 'rgba(249,115,22,0.12)',
              border: '1px solid rgba(249,115,22,0.3)',
              color: 'var(--human-glow)',
            }}
          >
            Human Lens
          </div>
        </motion.div>

        {/* CTA button */}
        <motion.div variants={item}>
          <motion.button
            onClick={onStart}
            className="px-10 py-4 rounded-2xl font-bold text-lg"
            style={{
              background: 'linear-gradient(135deg, var(--ai-primary) 0%, #6366F1 100%)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-heading)',
              minHeight: 56,
              minWidth: 44,
              boxShadow: '0 0 32px rgba(59,130,246,0.3)',
            }}
            whileHover={{
              boxShadow: '0 0 48px rgba(59,130,246,0.5)',
              scale: 1.02,
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            aria-label="Start MindBot — choose your stream"
          >
            Begin your assessment →
          </motion.button>
        </motion.div>

        {/* 3-minute hint for demo context */}
        <motion.p
          variants={item}
          style={{ fontSize: 13, color: 'var(--text-secondary)', opacity: 0.7 }}
        >
          6 questions · Two AI perspectives · Your decision
        </motion.p>
      </motion.div>
    </div>
  );
}
