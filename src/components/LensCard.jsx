/**
 * LensCard.jsx
 * Reusable card for AI Lens and Human Lens results.
 * variant="ai"    — blue border, Brain icon
 * variant="human" — amber border, MessageCircle icon
 *
 * On mount: fades in from 95% scale, glow pulse once.
 */
import { motion, useReducedMotion } from 'framer-motion';
import { Brain, MessageCircle, TrendingUp } from 'lucide-react';

const VARIANTS = {
  ai: {
    label: 'AI Lens',
    icon: Brain,
    primary: 'var(--ai-primary)',
    glow: 'var(--ai-glow)',
    glowRgb: '59,130,246',
    badgeColors: {
      High: { bg: 'rgba(34,197,94,0.15)', text: '#22C55E', border: 'rgba(34,197,94,0.3)' },
      Medium: { bg: 'rgba(234,179,8,0.15)', text: '#EAB308', border: 'rgba(234,179,8,0.3)' },
      Low: { bg: 'rgba(148,163,184,0.15)', text: '#94A3B8', border: 'rgba(148,163,184,0.3)' },
    },
  },
  human: {
    label: 'Human Lens',
    icon: MessageCircle,
    primary: 'var(--human-primary)',
    glow: 'var(--human-glow)',
    glowRgb: '249,115,22',
    badgeColors: null,
  },
};

export default function LensCard({ variant = 'ai', data, className = '', style: extraStyle = {} }) {
  const shouldReduceMotion = useReducedMotion();
  const v = VARIANTS[variant];
  const Icon = v.icon;

  const cardVariants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.25, ease: 'easeOut' },
    },
  };

  const glowVariants = {
    pulse: {
      boxShadow: [
        `0 0 0px 0px rgba(${v.glowRgb},0)`,
        `0 0 24px 6px rgba(${v.glowRgb},0.45)`,
        `0 0 0px 0px rgba(${v.glowRgb},0)`,
      ],
      transition: { duration: 0.8, ease: 'easeOut', times: [0, 0.4, 1] },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`rounded-2xl p-6 flex flex-col gap-4 ${className}`}
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: `1px solid ${v.primary}`,
        ...extraStyle,
      }}
    >
      {/* Card Header */}
      <motion.div
        variants={glowVariants}
        animate={shouldReduceMotion ? undefined : 'pulse'}
        className="rounded-xl"
      >
        <div className="flex items-center gap-3 mb-1">
          <div
            className="p-2 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `rgba(${v.glowRgb},0.15)` }}
            aria-hidden="true"
          >
            <Icon size={20} strokeWidth={1.5} style={{ color: v.primary }} />
          </div>
          <span
            className="text-sm font-semibold tracking-wide uppercase"
            style={{ color: v.primary, fontFamily: 'var(--font-heading)' }}
          >
            {v.label}
          </span>
        </div>
      </motion.div>

      {/* AI Lens: recommendation + confidence + reasoning */}
      {variant === 'ai' && data && (
        <>
          <div className="flex items-center gap-3 flex-wrap">
            <h2
              className="text-3xl"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 700 }}
            >
              {data.recommendation}
            </h2>
            {data.confidence && (
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: v.badgeColors[data.confidence]?.bg,
                  color: v.badgeColors[data.confidence]?.text,
                  border: `1px solid ${v.badgeColors[data.confidence]?.border}`,
                }}
                aria-label={`Confidence: ${data.confidence}`}
              >
                {data.confidence} confidence
              </span>
            )}
          </div>

          <div className="flex items-start gap-2">
            <TrendingUp size={16} strokeWidth={1.5} style={{ color: v.primary, marginTop: 3, flexShrink: 0 }} aria-hidden="true" />
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: 15 }}>
              {data.reasoning}
            </p>
          </div>
        </>
      )}

      {/* Human Lens: interview question + reply area */}
      {variant === 'human' && data && (
        <>
          <p
            className="text-lg font-semibold leading-relaxed"
            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}
          >
            {data.question}
          </p>

          {data.reply && (
            <div
              className="rounded-lg px-4 py-3 text-sm"
              style={{
                backgroundColor: 'var(--bg-surface-raised)',
                color: 'var(--text-secondary)',
                borderLeft: `3px solid var(--human-primary)`,
                lineHeight: 1.6,
              }}
            >
              {data.reply}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
