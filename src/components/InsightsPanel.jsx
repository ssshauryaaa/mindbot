import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, Cpu, MessageSquare, Clock, Zap, BarChart2, Sparkles, Heart } from 'lucide-react';

/* ════════════════════════════════════════════════════════════════
   InsightsPanel
   Slide-out analytics panel for the current session.
   Props:
     isOpen    {boolean}
     onClose   {() => void}
     messages  {Array}  — full messages array from ConversationPage
════════════════════════════════════════════════════════════════ */

function ArcGauge({ value, max = 100, color, label, size = 80 }) {
  const r = (size - 10) / 2;
  const circumference = Math.PI * r; // half circle
  const pct = Math.max(0, Math.min(1, value / max));
  const offset = circumference * (1 - pct);
  const cx = size / 2;
  const cy = size / 2 + 6; // shift centre down so arc sits at bottom

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size * 0.62} viewBox={`0 0 ${size} ${size * 0.62}`} style={{ overflow: 'visible' }}>
        {/* Track */}
        <path
          d={`M ${10 / 2} ${cy} A ${r} ${r} 0 0 1 ${size - 10 / 2} ${cy}`}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Fill */}
        <motion.path
          d={`M ${10 / 2} ${cy} A ${r} ${r} 0 0 1 ${size - 10 / 2} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
        {/* Value text */}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fill="white"
          fontSize="15"
          fontWeight="600"
          fontFamily="Space Grotesk, sans-serif"
        >
          {Math.round(value)}%
        </text>
      </svg>
      <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider">{label}</span>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent = 'rgba(255,255,255,0.6)', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-1.5 p-3 rounded-xl"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${accent}15` }}>
          <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
        </div>
        <span className="text-[11px] text-white/40 font-mono uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-xl font-semibold text-white/90" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        {value}
      </span>
    </motion.div>
  );
}

function SentimentBar({ label, count, total, color, delay = 0 }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex flex-col gap-1"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-white/55 font-mono">{label}</span>
        <span className="text-[11px] text-white/35 font-mono">{count}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: delay + 0.1 }}
        />
      </div>
    </motion.div>
  );
}

export default function InsightsPanel({ isOpen, onClose, messages = [] }) {
  const stats = useMemo(() => {
    const aiMsgs = messages.filter(m => m.sender === 'synaptica' && !m.isError);
    const userMsgs = messages.filter(m => m.sender === 'user');

    // Average ratios
    const avgLogic = aiMsgs.length
      ? Math.round(aiMsgs.reduce((s, m) => s + (m.logicRatio || 50), 0) / aiMsgs.length)
      : 50;
    const avgEmpathy = aiMsgs.length
      ? Math.round(aiMsgs.reduce((s, m) => s + (m.empathyRatio || 50), 0) / aiMsgs.length)
      : 50;

    // Sentiment counts from user messages
    const sentimentCounts = { stressed: 0, technical: 0, curious: 0, creative: 0, neutral: 0 };
    userMsgs.forEach(m => {
      const t = m.sentiment?.type || 'neutral';
      sentimentCounts[t] = (sentimentCounts[t] || 0) + 1;
    });

    // Most used mode
    const modeCounts = {};
    aiMsgs.forEach(m => {
      const mode = m.modeName || 'Synaptic Duality';
      modeCounts[mode] = (modeCounts[mode] || 0) + 1;
    });
    const topMode = Object.entries(modeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

    // Word count
    const totalWords = userMsgs.reduce((s, m) => s + (m.text?.split(/\s+/).filter(Boolean).length || 0), 0);

    // Avg response time
    const responseTimes = aiMsgs.filter(m => m.thinkingMs).map(m => m.thinkingMs);
    const avgResponseMs = responseTimes.length
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : 0;

    return {
      totalMessages: messages.length,
      userMessages: userMsgs.length,
      aiMessages: aiMsgs.length,
      avgLogic,
      avgEmpathy,
      sentimentCounts,
      totalSentiments: userMsgs.length,
      topMode,
      totalWords,
      avgResponseSec: avgResponseMs ? (avgResponseMs / 1000).toFixed(1) : '—',
    };
  }, [messages]);

  const sentimentBars = [
    { key: 'technical', label: 'Logic / Technical', color: '#a78bfa' },
    { key: 'curious', label: 'Curious / Inquisitive', color: '#38bdf8' },
    { key: 'creative', label: 'Creative', color: '#fbbf24' },
    { key: 'stressed', label: 'Stressed / Emotional', color: '#f472b6' },
    { key: 'neutral', label: 'Neutral', color: 'rgba(255,255,255,0.3)' },
  ];

  const modeColor = stats.topMode?.includes('Logic') ? '#a78bfa'
    : stats.topMode?.includes('Empathy') ? '#f472b6'
    : '#34d399';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40"
            style={{ backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.6 }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 bottom-0 z-[61] flex flex-col overflow-hidden"
            style={{
              width: 'min(380px, 92vw)',
              background: 'rgba(6, 6, 10, 0.97)',
              borderLeft: '1px solid rgba(255,255,255,0.10)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/[0.07] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)' }}>
                  <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white/90" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Session Insights
                  </h2>
                  <p className="text-[11px] text-white/35 font-mono">
                    {stats.totalMessages} messages this session
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/08 transition-all cursor-pointer"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6" style={{ scrollbarWidth: 'none' }}>

              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 py-16">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/08 flex items-center justify-center">
                    <BarChart2 className="w-5 h-5 text-white/20" />
                  </div>
                  <p className="text-sm text-white/30 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Start a conversation to<br />see insights appear here.
                  </p>
                </div>
              ) : (
                <>
                  {/* Duality gauges */}
                  <div>
                    <p className="text-[11px] font-mono text-white/35 uppercase tracking-wider mb-3">
                      Avg Duality Balance
                    </p>
                    <div className="flex items-end justify-around p-4 rounded-2xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.25)' }}>
                          <Cpu className="w-4 h-4 text-violet-400" />
                        </div>
                        <ArcGauge value={stats.avgLogic} color="#a78bfa" label="Logic" size={88} />
                      </div>

                      <div className="w-px h-20 bg-white/[0.06] self-center" />

                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{ background: 'rgba(244,114,182,0.15)', border: '1px solid rgba(244,114,182,0.25)' }}>
                          <Heart className="w-4 h-4 text-pink-400" />
                        </div>
                        <ArcGauge value={stats.avgEmpathy} color="#f472b6" label="Empathy" size={88} />
                      </div>
                    </div>
                  </div>

                  {/* Stat cards */}
                  <div>
                    <p className="text-[11px] font-mono text-white/35 uppercase tracking-wider mb-3">
                      Session Stats
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                      <StatCard icon={MessageSquare} label="Messages" value={stats.totalMessages} accent="#38bdf8" delay={0.05} />
                      <StatCard icon={Brain} label="Words Sent" value={stats.totalWords} accent="#34d399" delay={0.1} />
                      <StatCard icon={Clock} label="Avg Response" value={`${stats.avgResponseSec}s`} accent="#fbbf24" delay={0.15} />
                      <StatCard icon={Zap} label="AI Replies" value={stats.aiMessages} accent="#a78bfa" delay={0.2} />
                    </div>
                  </div>

                  {/* Most used mode badge */}
                  <div>
                    <p className="text-[11px] font-mono text-white/35 uppercase tracking-wider mb-3">
                      Dominant Mode
                    </p>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.25, duration: 0.4 }}
                      className="flex items-center gap-3 p-3.5 rounded-xl"
                      style={{
                        background: `${modeColor}0d`,
                        border: `1px solid ${modeColor}25`,
                      }}
                    >
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${modeColor}18`, border: `1px solid ${modeColor}35` }}>
                        <Sparkles className="w-4 h-4" style={{ color: modeColor }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: modeColor, fontFamily: 'Space Grotesk, sans-serif' }}>
                          {stats.topMode}
                        </p>
                        <p className="text-[11px] text-white/35 font-mono">Most-used reasoning mode</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Sentiment breakdown */}
                  {stats.totalSentiments > 0 && (
                    <div>
                      <p className="text-[11px] font-mono text-white/35 uppercase tracking-wider mb-3">
                        Your Tone Breakdown
                      </p>
                      <div className="space-y-2.5 p-4 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        {sentimentBars.map((s, i) => (
                          <SentimentBar
                            key={s.key}
                            label={s.label}
                            count={stats.sentimentCounts[s.key] || 0}
                            total={stats.totalSentiments}
                            color={s.color}
                            delay={0.08 * i}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 border-t border-white/[0.06] shrink-0">
              <p className="text-[10px] text-white/20 text-center font-mono">
                SYNAPTICA · Session Analytics · Live
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
