import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  BookMarked,
  Compass,
  LayoutGrid,
  BarChart2,
  MoreHorizontal,
  Mic,
  Settings2,
  MessageSquare,
  Send,
  ChevronDown,
  Lightbulb,
  Clapperboard,
  TrendingUp,
  HelpCircle,
  Sparkles,
  Brain,
  Cpu,
  User,
  X,
  ArrowLeft,
} from 'lucide-react';

/* ─── Background Beam / Aurora SVG Canvas ───────────────────── */
function BeamBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep void base */}
      <div className="absolute inset-0 bg-[#0a0a0c]" />

      {/* Central beam — tall vertical light column */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0"
        style={{
          width: '1px',
          height: '55%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.9) 40%, rgba(200,200,255,0.6) 70%, rgba(255,255,255,0.0) 100%)',
          filter: 'blur(0.5px)',
        }}
      />

      {/* Wide ambient glow behind beam */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0"
        style={{
          width: '320px',
          height: '55%',
          background: 'radial-gradient(ellipse 50% 60% at 50% 0%, rgba(200,200,255,0.18) 0%, transparent 80%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Subtle wide radial floor glow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-[38%]"
        style={{
          width: '900px',
          height: '350px',
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(180,180,255,0.10) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Right-side abstract flowing curve/stroke */}
      <svg
        className="absolute right-0 bottom-0 opacity-[0.13]"
        width="480"
        height="500"
        viewBox="0 0 480 500"
        fill="none"
      >
        <path
          d="M480 500 C400 400, 350 300, 420 200 C450 150, 480 120, 460 60"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M480 500 C380 380, 330 260, 410 160 C450 110, 490 80, 470 20"
          stroke="white"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M480 480 C360 360, 300 240, 380 140"
          stroke="white"
          strokeWidth="0.5"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="4 8"
        />
      </svg>

      {/* Subtle particle dots */}
      {[
        { x: '62%', y: '18%', size: 1.5, opacity: 0.5 },
        { x: '72%', y: '30%', size: 1, opacity: 0.4 },
        { x: '66%', y: '50%', size: 1.2, opacity: 0.3 },
        { x: '80%', y: '22%', size: 1, opacity: 0.35 },
        { x: '30%', y: '25%', size: 1, opacity: 0.3 },
        { x: '22%', y: '40%', size: 1.5, opacity: 0.25 },
        { x: '75%', y: '60%', size: 1, opacity: 0.2 },
      ].map((dot, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: dot.x,
            top: dot.y,
            width: dot.size,
            height: dot.size,
            opacity: dot.opacity,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Logo Mark — Glowing Arrow/Synapse Shape ─────────────────── */
function GlowingLogoMark() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer radial glow rings */}
      <div
        className="absolute rounded-full"
        style={{
          width: 90,
          height: 90,
          background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
          filter: 'blur(12px)',
        }}
      />
      {/* Inner glow */}
      <div
        className="absolute rounded-full animate-pulse"
        style={{
          width: 52,
          height: 52,
          background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)',
          filter: 'blur(6px)',
        }}
      />

      {/* SVG Logo Mark — triangular arrow/play button shape */}
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="relative z-10 drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]">
        {/* Two angular arms forming the logo */}
        {/* Left upper arm */}
        <line x1="24" y1="10" x2="10" y2="32" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
        {/* Right upper arm */}
        <line x1="24" y1="10" x2="38" y2="32" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
        {/* Diagonal inner cut — the arrow notch */}
        <line x1="17" y1="26" x2="30" y2="20" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* ─── Quick Action Suggestion Chips ──────────────────────────── */
const suggestions = [
  { label: 'Generate ideas', icon: Lightbulb },
  { label: 'Motion concept', icon: Clapperboard },
  { label: 'Market analysis', icon: TrendingUp },
  { label: 'Ask AI anything', icon: HelpCircle },
];

/* ─── Conversation Message Component ────────────────────────── */
function Message({ msg }) {
  if (msg.sender === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end items-start gap-3"
      >
        <div
          className="max-w-xl px-5 py-3.5 rounded-2xl rounded-tr-sm text-sm text-white/90 leading-relaxed"
          style={{
            background: 'rgba(40, 40, 60, 0.7)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {msg.text}
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-human-500 to-synapse-500 flex items-center justify-center shrink-0 shadow-lg">
          <User className="w-4 h-4 text-white" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex justify-start items-start gap-3"
    >
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg" style={{ background: 'rgba(124,92,255,0.2)', border: '1px solid rgba(124,92,255,0.4)' }}>
        <Sparkles className="w-4 h-4 text-synapse-400" />
      </div>
      <div className="max-w-2xl space-y-3">
        <div
          className="px-5 py-4 rounded-2xl rounded-tl-sm text-sm text-white/90 leading-relaxed"
          style={{
            background: 'rgba(20, 20, 35, 0.75)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <p>{msg.text}</p>

          {/* Dual stream cards */}
          {(msg.aiReasoning || msg.humanInsight) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
              {msg.aiReasoning && (
                <div className="p-3 rounded-xl text-xs" style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.25)' }}>
                  <div className="flex items-center gap-1.5 text-ai-400 font-mono font-semibold mb-1.5">
                    <Cpu className="w-3 h-3" /><span>AI Compute Stream</span>
                  </div>
                  <p className="text-white/70 leading-snug">{msg.aiReasoning}</p>
                </div>
              )}
              {msg.humanInsight && (
                <div className="p-3 rounded-xl text-xs" style={{ background: 'rgba(178,75,243,0.07)', border: '1px solid rgba(178,75,243,0.25)' }}>
                  <div className="flex items-center gap-1.5 text-human-400 font-mono font-semibold mb-1.5">
                    <Brain className="w-3 h-3" /><span>Human Context</span>
                  </div>
                  <p className="text-white/70 leading-snug">{msg.humanInsight}</p>
                </div>
              )}
            </div>
          )}
        </div>
        <p className="text-[10px] font-mono text-white/30 pl-1">{msg.time} · Verified by Synapse</p>
      </div>
    </motion.div>
  );
}

/* ─── MAIN CONVERSATION PAGE ─────────────────────────────────── */
export default function ConversationPage({ onBack }) {
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); // false = welcome screen, true = chat
  const [activeMode, setActiveMode] = useState('Auto');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const t = text || inputVal;
    if (!t.trim()) return;
    setInputVal('');
    setHasStarted(true);

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: t,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const reply = {
        id: Date.now() + 1,
        sender: 'synaptica',
        text: `Here's my synthesized dual-stream analysis on: "${t}"`,
        aiReasoning: 'Executed high-speed pattern matching across 1.2M domain vectors in 22ms. Optimal reasoning path identified and verified.',
        humanInsight: 'Applied contextual guardrails to ensure the response aligns with real-world human judgment, ethical constraints, and practical implementation.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, reply]);
    }, 1800);
  };

  /* ── Left Icon Sidebar ─────────────────────────────────────── */
  const sidebarItems = [
    { icon: Plus, label: 'New conversation', action: () => { setMessages([]); setHasStarted(false); } },
    { icon: BookMarked, label: 'Saved sessions', action: () => {} },
    { icon: Compass, label: 'Explore', action: () => {} },
    { icon: LayoutGrid, label: 'All tools', action: () => {} },
    { icon: BarChart2, label: 'Analytics', action: () => {} },
    { icon: MoreHorizontal, label: 'More', action: () => {} },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0a0c] text-white relative">
      {/* ── Animated Background Beam ──────────────────────── */}
      <BeamBackground />

      {/* ── Minimal Icon-Only Left Sidebar ─────────────────── */}
      <aside
        className="relative z-20 flex flex-col items-center py-5 gap-5 shrink-0"
        style={{
          width: 60,
          borderRight: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(10, 10, 14, 0.65)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {sidebarItems.map(({ icon: Icon, label, action }, i) => (
          <button
            key={i}
            onClick={action}
            title={label}
            aria-label={label}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all duration-200 cursor-pointer"
            style={{ background: 'transparent' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Icon className="w-4.5 h-4.5" strokeWidth={1.5} />
          </button>
        ))}
      </aside>

      {/* ── Main Content Area ────────────────────────────────── */}
      <main className="relative z-10 flex-1 flex flex-col overflow-hidden">

        {/* ── Welcome / Empty State ──────────────────────────── */}
        <AnimatePresence mode="wait">
          {!hasStarted && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col items-center justify-center px-6"
            >
              {/* Glowing Logo Mark */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="mb-8"
              >
                <GlowingLogoMark />
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl sm:text-4xl md:text-5xl font-normal text-white mb-10 tracking-tight text-center"
                style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em' }}
              >
                How can i help you today?
              </motion.h1>

              {/* Big Input Box */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-full max-w-2xl"
              >
                <InputBox
                  value={inputVal}
                  onChange={setInputVal}
                  onSend={sendMessage}
                  activeMode={activeMode}
                  onModeChange={setActiveMode}
                  large
                />
              </motion.div>

              {/* Quick Suggestion Chips */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="flex flex-wrap items-center justify-center gap-3 mt-6"
              >
                {suggestions.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => sendMessage(label)}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm text-white/70 hover:text-white transition-all duration-200 cursor-pointer"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(12px)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.09)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    }}
                  >
                    <Icon className="w-4 h-4 text-white/50" strokeWidth={1.5} />
                    <span>{label}</span>
                  </button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Active Conversation View ───────────────────────── */}
        <AnimatePresence>
          {hasStarted && (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* Conversation Header */}
              <div
                className="flex items-center justify-between px-6 py-4 shrink-0"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,10,14,0.5)', backdropFilter: 'blur(16px)' }}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setMessages([]); setHasStarted(false); }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(124,92,255,0.2)' }}>
                      <Sparkles className="w-3.5 h-3.5 text-synapse-400" />
                    </div>
                    <span className="text-sm font-medium text-white/80">SYNAPTICA — Dual AI Stream</span>
                    <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
                      Active
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => { setMessages([]); setHasStarted(false); }}
                  className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors cursor-pointer px-3 py-1.5 rounded-lg"
                  style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New session</span>
                </button>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-16 py-8 space-y-6">
                {messages.map((msg) => <Message key={msg.id} msg={msg} />)}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(124,92,255,0.2)', border: '1px solid rgba(124,92,255,0.3)' }}>
                      <Sparkles className="w-4 h-4 text-synapse-400 animate-spin" />
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3 rounded-2xl text-xs text-white/50" style={{ background: 'rgba(20,20,35,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span className="font-mono">Synthesizing dual-stream response</span>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-ai-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-synapse-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-human-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Sticky Bottom Input Bar */}
              <div className="px-4 sm:px-8 lg:px-16 py-5 shrink-0" style={{ background: 'rgba(10,10,14,0.7)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <InputBox
                  value={inputVal}
                  onChange={setInputVal}
                  onSend={sendMessage}
                  activeMode={activeMode}
                  onModeChange={setActiveMode}
                />
                {/* Suggestion Row */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {suggestions.map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      onClick={() => sendMessage(label)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white transition-all cursor-pointer"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

/* ─── Shared Input Box Component ─────────────────────────────── */
function InputBox({ value, onChange, onSend, activeMode, onModeChange, large = false }) {
  return (
    <div
      className="relative w-full"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        backdropFilter: 'blur(16px)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'rgba(124,92,255,0.5)';
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,92,255,0.12), inset 0 1px 1px rgba(255,255,255,0.05)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Text Input */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        placeholder="What do you want to know ?"
        rows={large ? 2 : 1}
        className="w-full bg-transparent resize-none px-5 pt-4 pb-2 text-sm sm:text-base text-white/90 placeholder-white/25 focus:outline-none leading-relaxed"
        style={{ fontFamily: "'Inter', sans-serif" }}
      />

      {/* Bottom Controls Row */}
      <div className="flex items-center justify-between px-4 pb-3 pt-1">
        {/* Left: Mode selector */}
        <button
          onClick={() => onModeChange(activeMode === 'Auto' ? 'Focused' : 'Auto')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <Sparkles className="w-3.5 h-3.5 text-synapse-400" strokeWidth={1.5} />
          <span>{activeMode}</span>
          <ChevronDown className="w-3 h-3" />
        </button>

        {/* Right: Action Icons */}
        <div className="flex items-center gap-2">
          {/* Attachment / File */}
          <button
            aria-label="Attach file"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/35 hover:text-white transition-colors cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
            </svg>
          </button>

          {/* Settings */}
          <button
            aria-label="Settings"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/35 hover:text-white transition-colors cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <Settings2 className="w-4 h-4" strokeWidth={1.5} />
          </button>

          {/* Voice/Mic */}
          <button
            aria-label="Voice input"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/35 hover:text-white transition-colors cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <Mic className="w-4 h-4" strokeWidth={1.5} />
          </button>

          {/* Send */}
          <button
            onClick={onSend}
            disabled={!value.trim()}
            aria-label="Send message"
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer disabled:opacity-30"
            style={{
              background: value.trim()
                ? 'linear-gradient(135deg, #00D4FF 0%, #7C5CFF 50%, #B24BF3 100%)'
                : 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: value.trim() ? '0 0 12px rgba(124,92,255,0.5)' : 'none',
            }}
          >
            <MessageSquare className="w-4 h-4 text-white" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
