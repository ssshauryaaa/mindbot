import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Brain,
  SlidersHorizontal,
  Zap,
  Sparkles,
  Bookmark,
  Cpu,
  Heart,
  Database,
  Activity,
  GitMerge,
  Globe,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LiquidMetalButton } from './ui/liquid-metal-button';
import { CometCard } from './ui/comet-card';
import { GlareCard } from './ui/glare-card';

/* ────────────────────────────────────────────────────────────────
   Step data — `accent` is a plain grayscale hex value, no color
   tokens. Hierarchy comes from brightness only.
   ──────────────────────────────────────────────────────────────── */
const STEPS = [
  {
    number: '01',
    title: 'It Reads the Room',
    tag: 'Sentiment Analysis',
    icon: Brain,
    accent: '#FFFFFF',
    description:
      'Before a word is processed, the sentiment engine parses your message for tone — stressed, technical, curious, or creative. It uses word-boundary pattern matching to detect dominant signals and automatically shifts the AI mode to match what you actually need.',
    detail: [
      { icon: Activity, text: 'Real-time tone classification on every input' },
      { icon: Cpu, text: 'Weighted keyword scoring with negation detection' },
      { icon: GitMerge, text: 'Auto-adapts Logic / Empathy ratio before you respond' },
    ],
  },
  {
    number: '02',
    title: 'Dual Lenses Engage',
    tag: 'Duality Engine',
    icon: SlidersHorizontal,
    accent: '#E4E4E4',
    description:
      'Every query runs two minds in parallel. The Logic Lens applies data-driven analysis and structured reasoning. The Empathy Lens listens for the human context, fears, and motivations beneath the words. You control the balance with a precision duality slider.',
    detail: [
      { icon: Cpu, text: 'Logic Lens — structured, analytical reasoning' },
      { icon: Heart, text: 'Empathy Lens — emotionally-aware, human-first perspective' },
      { icon: SlidersHorizontal, text: 'Adjustable ratio from 0% to 100% at any time' },
    ],
  },
  {
    number: '03',
    title: 'You Choose Your Engine',
    tag: 'Multi-Model Routing',
    icon: Zap,
    accent: '#C8C8C8',
    description:
      'Route your session through the model that fits the moment. Groq delivers Llama 3.3 70B at near-instant latency. Gemini brings multimodal depth. OpenRouter acts as a free fallback across the open-source frontier — with automatic failover if any engine drops.',
    detail: [
      { icon: Zap, text: 'Groq — Llama 3.3 70B, ultra-low latency inference' },
      { icon: Sparkles, text: 'Gemini 3.6 Flash — high precision, multimodal' },
      { icon: Globe, text: 'OpenRouter — dynamic model routing with fallback' },
    ],
  },
  {
    number: '04',
    title: 'One Synthesized Answer',
    tag: 'Synthesis Layer',
    icon: GitMerge,
    accent: '#F2F2F2',
    description:
      'The synthesis layer merges both lenses. It identifies agreement points, surfaces real differences, and produces a closing truth — not two competing answers, but one coherent perspective that holds both the data and the human in view simultaneously.',
    detail: [
      { icon: Activity, text: 'Compares Logic and Empathy signals for convergence' },
      { icon: Brain, text: 'Generates agreement points and divergence insights' },
      { icon: GitMerge, text: 'Produces a unified closing statement from both perspectives' },
    ],
  },
  {
    number: '05',
    title: 'Every Session, Remembered',
    tag: 'Session Memory',
    icon: Bookmark,
    accent: '#B0B0B0',
    description:
      'Every conversation is auto-titled and saved as a persistent session. The History Drawer gives you instant access to any past exchange — with full message history, the AI mode used, and the provider that ran it. Nothing is ever lost.',
    detail: [
      { icon: Database, text: 'Auto-saved to local storage on every message' },
      { icon: Bookmark, text: 'Full session restore — messages, mode, provider' },
      { icon: Activity, text: 'Searchable history drawer accessible at any time' },
    ],
  },
];

const c = (color, alpha) =>
  alpha != null ? `color-mix(in srgb, ${color} ${alpha}%, transparent)` : color;

/* Desktop zigzag connection points, in 0–100 percentage space for
   both axes. x alternates 44 / 56 (just inside each card's inner
   edge), y is the vertical center of that step's row. Computed once
   at module scope since STEPS never changes at runtime. */
function getPoints(total) {
  return Array.from({ length: total }, (_, i) => ({
    x: i % 2 === 0 ? 44 : 56,
    y: ((i + 0.5) / total) * 100,
  }));
}
const ZIGZAG_POINTS = getPoints(STEPS.length);

function segmentPath(p0, p1) {
  const midY = (p0.y + p1.y) / 2;
  return `M ${p0.x} ${p0.y} C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
}

/*
 * All line segments and dots are now driven off ONE shared scroll
 * progress value (`listProgress`, computed once from the whole list
 * container in the parent). Each segment/dot just remaps that single
 * progress into its own local [0,1] window based on where it sits
 * vertically inside the list (using the same y percentages as the
 * zigzag points). Because it's one continuous progress source tied
 * directly to the container's position in the viewport, nothing can
 * be "pre-drawn" — a segment's pathLength is mathematically 0 until
 * scroll position actually reaches that window, and animates in
 * lock-step with the scroll from then on.
 */

/* One segment of the zigzag line, connecting point i to point i+1. */
function LineSegment({ d, sourceProgress, range }) {
  const progress = useTransform(sourceProgress, range, [0, 1]);
  return (
    <>
      <path d={d} stroke="rgba(255,255,255,0.12)" strokeWidth={1} fill="none" vectorEffect="non-scaling-stroke" />
      <motion.path
        d={d}
        stroke="#FFFFFF"
        strokeWidth={1.4}
        strokeLinecap="round"
        fill="none"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength: progress }}
      />
    </>
  );
}

/* A numbered marker sitting on the line. Its own [0,1] window runs
   from the previous point down to this point, so it lights up right
   as the incoming segment finishes drawing in. */
function ProgressDot({ step, point, sourceProgress, range, side }) {
  const progress = useTransform(sourceProgress, range, [0, 1]);
  const opacity = useTransform(progress, [0, 1], [0.3, 1]);
  const scale = useTransform(progress, [0, 1], [0.7, 1]);
  const boxShadow = useTransform(progress, (v) => `0 0 ${6 + v * 18}px ${c('#FFFFFF', Math.round(v * 45))}`);
  const borderColor = useTransform(progress, (v) => c('#FFFFFF', Math.round(20 + v * 60)));
  const background = useTransform(progress, (v) => c('#FFFFFF', Math.round(v * 100)));
  const textColor = useTransform(progress, (v) => (v > 0.5 ? '#0A0A0A' : '#FFFFFF'));

  return (
    <motion.div
      className={`absolute flex items-center justify-center rounded-full font-mono text-[10px] font-semibold ${side}`}
      style={{
        top: `${point.y}%`,
        transform: 'translate(-50%, -50%)',
        width: 30,
        height: 30,
        opacity,
        scale,
        background,
        border: '1.5px solid',
        borderColor,
        boxShadow,
        color: textColor,
        zIndex: 5,
      }}
    >
      {step.number}
    </motion.div>
  );
}

/* Short horizontal stub connecting each card's inner edge to its dot
   on the line — reinforces "this card is plugged into the line". */
function ConnectorStub({ index, total, isLeft }) {
  const leftPct = isLeft ? 42 : 56;
  const widthPct = 4;
  return (
    <div
      className="absolute h-px hidden sm:block"
      style={{
        top: `${((index + 0.5) / total) * 100}%`,
        left: `${leftPct}%`,
        width: `${widthPct}%`,
        background: 'rgba(255,255,255,0.16)',
      }}
    />
  );
}

/* ────────────────────────────────────────────────────────────────
   Per-step graphic. Each one is a small hand-drawn abstraction of
   what that step actually does — a waveform for tone detection,
   two overlapping circles for the dual lenses, a hub-and-spoke for
   model routing, converging paths for synthesis, stacked layers for
   memory — rather than a generic icon or stock photo, so it stays
   inside the grayscale/glass language of the rest of the section.
   ──────────────────────────────────────────────────────────────── */
function StepGraphic({ step, accent }) {
  switch (step.number) {
    case '01': {
      // Tone waveform — uneven bar heights read as "signal", echoing
      // sentiment analysis parsing the shape of a message.
      const heights = [18, 34, 22, 46, 30, 58, 26, 40, 20, 50, 28, 16];
      const gap = 300 / heights.length;
      return (
        <svg viewBox="0 0 300 120" className="w-full h-full">
          {heights.map((h, i) => {
            const x = gap * i + gap / 2;
            return (
              <line
                key={i}
                x1={x}
                y1={60 - h / 2}
                x2={x}
                y2={60 + h / 2}
                stroke={accent}
                strokeWidth={3}
                strokeLinecap="round"
                opacity={0.35 + (h / 58) * 0.55}
              />
            );
          })}
        </svg>
      );
    }
    case '02':
      // Two overlapping lenses with a slider dot resting on the seam
      // — the Logic/Empathy duality ratio, made literal.
      return (
        <svg viewBox="0 0 300 120" className="w-full h-full">
          <circle cx="118" cy="60" r="44" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.45" />
          <circle cx="182" cy="60" r="44" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.85" />
          <line x1="150" y1="16" x2="150" y2="104" stroke={accent} strokeWidth="1" strokeDasharray="2 5" opacity="0.35" />
          <circle cx="150" cy="60" r="5.5" fill={accent} />
        </svg>
      );
    case '03':
      // Hub-and-spoke — one session, several model engines it can
      // route to.
      return (
        <svg viewBox="0 0 300 120" className="w-full h-full">
          <line x1="150" y1="60" x2="78" y2="28" stroke={accent} strokeWidth="1.5" opacity="0.4" />
          <line x1="150" y1="60" x2="78" y2="92" stroke={accent} strokeWidth="1.5" opacity="0.4" />
          <line x1="150" y1="60" x2="228" y2="60" stroke={accent} strokeWidth="1.5" opacity="0.7" />
          <circle cx="150" cy="60" r="7" fill={accent} />
          <circle cx="78" cy="28" r="4.5" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.6" />
          <circle cx="78" cy="92" r="4.5" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.6" />
          <circle cx="228" cy="60" r="4.5" fill={accent} opacity="0.9" />
        </svg>
      );
    case '04':
      // Two paths converging into a single point — the synthesis of
      // Logic + Empathy into one answer.
      return (
        <svg viewBox="0 0 300 120" className="w-full h-full">
          <path d="M46,32 C130,32 150,60 224,60" stroke={accent} strokeWidth="1.6" fill="none" opacity="0.4" />
          <path d="M46,88 C130,88 150,60 224,60" stroke={accent} strokeWidth="1.6" fill="none" opacity="0.75" />
          <circle cx="224" cy="60" r="6" fill={accent} />
        </svg>
      );
    case '05':
      // Stacked, slightly offset layers — sessions accumulating in
      // history.
      return (
        <svg viewBox="0 0 300 120" className="w-full h-full">
          <rect x="94" y="72" width="120" height="20" rx="5" fill="none" stroke={accent} strokeWidth="1.4" opacity="0.3" />
          <rect x="83" y="55" width="120" height="20" rx="5" fill="none" stroke={accent} strokeWidth="1.4" opacity="0.55" />
          <rect x="72" y="38" width="120" height="20" rx="5" fill="none" stroke={accent} strokeWidth="1.4" opacity="0.9" />
        </svg>
      );
    default:
      return null;
  }
}

/* ────────────────────────────────────────────────────────────────
   One zigzag row — card sits left on even steps, right on odd
   steps, and animates in from that same side as it scrolls into
   view. This card fade-in is independent of the connecting line —
   it still uses its own `whileInView` on the card itself.
   ──────────────────────────────────────────────────────────────── */
function StepRow({ step, index }) {
  const Icon = step.icon;
  const accent = c(step.accent);
  const isLeft = index % 2 === 0;

  return (
    <div
      className={`relative flex w-full min-h-[360px] sm:min-h-[300px] items-center py-8 sm:py-10 justify-start ${isLeft ? 'sm:justify-start' : 'sm:justify-end'
        }`}
    >
      <ConnectorStub index={index} total={STEPS.length} isLeft={isLeft} />

      <motion.div
        initial={{ opacity: 0, x: isLeft ? -56 : 56, y: 24 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full pl-16 sm:pl-0 sm:w-[42%]"
      >
        <CometCard rotateDepth={10} translateDepth={6} className="w-full">
          <div
            className="relative rounded-3xl p-6 sm:p-8"
            style={{
              background: `linear-gradient(150deg, ${c(step.accent, 6)} 0%, rgba(6,6,8,0.9) 55%)`,
              border: `1px solid ${c(step.accent, 18)}`,
              boxShadow: `0 24px 70px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.02), 0 0 40px ${c(step.accent, 8)}`,
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
            }}
          >
            {/* Graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-6 rounded-2xl overflow-hidden"
              style={{
                height: 120,
                background: `linear-gradient(160deg, ${c(step.accent, 10)} 0%, rgba(255,255,255,0.015) 100%)`,
                border: `1px solid ${c(step.accent, 14)}`,
              }}
            >
              <StepGraphic step={step} accent={accent} />
            </motion.div>

            {/* Header */}
            <div className="relative flex items-center gap-3 sm:gap-4 mb-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                className="flex items-center justify-center rounded-2xl flex-shrink-0"
                style={{
                  width: 46,
                  height: 46,
                  background: `radial-gradient(circle, ${c(step.accent, 16)} 0%, ${c(step.accent, 5)} 65%, transparent 100%)`,
                  border: `1.5px solid ${c(step.accent, 32)}`,
                  boxShadow: `0 0 18px ${c(step.accent, 16)}`,
                }}
              >
                <Icon style={{ width: 21, height: 21, color: accent }} />
              </motion.div>

              <div className="min-w-0">
                <span
                  className="font-mono text-[10px] font-semibold uppercase tracking-wider block mb-1"
                  style={{ color: accent }}
                >
                  {step.tag}
                </span>
                <h3
                  className="font-heading text-lg sm:text-xl font-semibold leading-snug"
                  style={{ color: 'var(--text-primary, #FFFFFF)', letterSpacing: '-0.02em' }}
                >
                  {step.title}
                </h3>
              </div>
            </div>

            {/* Divider */}
            <div
              className="relative h-px mb-5"
              style={{ background: `linear-gradient(to right, ${c(step.accent, 20)}, transparent 70%)` }}
            />

            {/* Description */}
            <p
              className="relative font-body text-sm sm:text-[14px] leading-relaxed mb-6"
              style={{ color: 'var(--text-secondary, #B8B8B8)' }}
            >
              {step.description}
            </p>

            {/* Detail rows */}
            <div className="relative space-y-2.5">
              {step.detail.map((d, i) => {
                const DIcon = d.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: isLeft ? -16 : 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.25 + i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="flex items-center justify-center rounded-lg flex-shrink-0"
                      style={{
                        width: 26,
                        height: 26,
                        background: c(step.accent, 8),
                        border: `1px solid ${c(step.accent, 14)}`,
                      }}
                    >
                      <DIcon style={{ width: 12, height: 12, color: accent }} />
                    </div>
                    <span
                      className="font-body text-xs"
                      style={{ color: 'var(--text-secondary, #B8B8B8)', opacity: 0.85 }}
                    >
                      {d.text}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </CometCard>
      </motion.div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Main Export
   ──────────────────────────────────────────────────────────────── */
export default function HowItWorks() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const listRef = useRef(null);

  // Single shared scroll progress for the whole zigzag list. Progress
  // is 0 while the list hasn't reached 85% down the viewport yet, and
  // 1 once its end scrolls up to 35% down the viewport. Every segment
  // and dot below just remaps a slice of this same value — so scroll
  // position is the only thing that ever moves the lines.
  const { scrollYProgress: listProgress } = useScroll({
    target: listRef,
    offset: ['start 0.85', 'end 0.35'],
  });

  // Mobile fallback: a single straight line, same idea, simpler shape.
  const { scrollYProgress: mobileProgress } = useScroll({
    target: listRef,
    offset: ['start 0.95', 'end 0.7'],
  });
  const mobileLineHeight = useTransform(mobileProgress, (v) => `${v * 100}%`);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative w-full overflow-x-hidden"
      style={{ background: 'var(--bg-base, #050506)' }}
    >
      {/* Fade from hero */}
      <div
        className="absolute top-0 inset-x-0 h-28 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 100%)',
          zIndex: 1,
        }}
      />

      {/* Ambient radials — monochrome white glow only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div
          className="absolute"
          style={{
            top: '10%', left: '-8%',
            width: 560, height: 560,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${c('#FFFFFF', 4)} 0%, transparent 65%)`,
            filter: 'blur(48px)',
          }}
        />
        <div
          className="absolute"
          style={{
            top: '48%', right: '-6%',
            width: 480, height: 480,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${c('#FFFFFF', 5)} 0%, transparent 65%)`,
            filter: 'blur(48px)',
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: '12%', left: '28%',
            width: 400, height: 400,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${c('#FFFFFF', 3)} 0%, transparent 65%)`,
            filter: 'blur(40px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 lg:px-6 pt-14 sm:pt-20 pb-16 sm:pb-28">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 sm:mb-18 max-w-xl mx-auto text-center sm:text-left sm:mx-0"
        >
          <div className="flex items-center gap-3 mb-5 justify-center sm:justify-start">
            <div className="h-px w-9" style={{ background: 'var(--border-mid, rgba(255,255,255,0.18))' }} />
            <span
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: 'var(--text-muted, #8A8A8A)' }}
            >
              How It Works
            </span>
            <div className="h-px w-9" style={{ background: 'var(--border-mid, rgba(255,255,255,0.18))' }} />
          </div>

          <h2
            className="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold mb-4"
            style={{ color: 'var(--text-primary, #FFFFFF)', letterSpacing: '-0.03em', lineHeight: 1.12 }}
          >
            Two minds.{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #FFFFFF 0%, #8A8A8A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              One answer.
            </span>
          </h2>

          <p
            className="font-body text-[15px] leading-relaxed"
            style={{ color: 'var(--text-secondary, #B8B8B8)', opacity: 0.75 }}
          >
            Mindbot doesn't retrieve answers — it synthesizes them. Logic and empathy
            run in parallel behind every response. Scroll to see how they connect.
          </p>
        </motion.div>

        {/* ── Zigzag stack with connecting progress line ── */}
        <div ref={listRef} className="relative">
          {/* Desktop zigzag line — N-1 segments, each remapping a
              slice of the shared listProgress based on its vertical
              position in the stack. Nothing draws until scroll
              actually reaches that slice. */}
          <svg
            className="absolute inset-0 w-full h-full hidden sm:block"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ zIndex: 0 }}
          >
            {ZIGZAG_POINTS.slice(0, -1).map((p, s) => {
              const next = ZIGZAG_POINTS[s + 1];
              return (
                <LineSegment
                  key={s}
                  d={segmentPath(p, next)}
                  sourceProgress={listProgress}
                  range={[p.y / 100, next.y / 100]}
                />
              );
            })}
          </svg>

          {/* Mobile straight line, left-aligned */}
          <div
            className="absolute sm:hidden top-0 bottom-0 w-px"
            style={{ left: '6%', background: 'rgba(255,255,255,0.12)', zIndex: 0 }}
          >
            <motion.div
              className="w-full"
              style={{ height: mobileLineHeight, background: '#FFFFFF' }}
            />
          </div>

          {/* Numbered markers on the line — each lights up over the
              slice of scroll leading from the previous point to its
              own position, so it completes right as its line segment
              does. */}
          {STEPS.map((step, index) => {
            const point = ZIGZAG_POINTS[index];
            const prevY = index === 0 ? 0 : ZIGZAG_POINTS[index - 1].y / 100;
            return (
              <ProgressDot
                key={step.number}
                step={step}
                point={point}
                sourceProgress={listProgress}
                range={[prevY, point.y / 100]}
                side={
                  index % 2 === 0
                    ? 'left-[6%] sm:left-[44%]'
                    : 'left-[6%] sm:left-[56%]'
                }
              />
            );
          })}

          {STEPS.map((step, index) => (
            <StepRow key={step.number} step={step} index={index} />
          ))}
        </div>

        {/* ── CTA bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative mt-8"
          style={{ zIndex: 10 }}
        >
          <GlareCard className="glass-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-5 sm:p-6">
            <div>
              <p
                className="font-heading text-sm font-semibold mb-0.5"
                style={{ color: 'var(--text-primary, #FFFFFF)', opacity: 0.88, letterSpacing: '-0.015em' }}
              >
                Ready to experience both lenses?
              </p>
              <p className="font-body text-xs" style={{ color: 'var(--text-muted, #8A8A8A)' }}>
                The duality engine activates the moment you send your first message.
              </p>
            </div>

            <LiquidMetalButton label="Start Thinking" onClick={() => navigate('/')} />
          </GlareCard>
        </motion.div>
      </div>
    </section>
  );
}